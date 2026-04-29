-- Cohorts feature schema
-- Small (2-6 child) practice teams with shared celebration: Team Energy bar, Boost Wall, Past-Me Pacer
-- Safety floor: no DMs, no chat, no free text in kid UI, no cross-family individual rankings
-- Scoring: 5 daily Effort Stars per child (show / forward / quality / focus / boost) -> shared Team Energy

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. REFERENCE DATA TABLES (must come first; other tables FK to these)
-- ============================================================================

-- Curated sticker library: the ONLY child-to-child communication channel.
-- Seeded in companion seed migration. Public read, no user writes.
CREATE TABLE IF NOT EXISTS stickers (
  id          TEXT PRIMARY KEY,
  category    TEXT NOT NULL CHECK (category IN ('cheer','fistbump','gotthis','celebrate','sympathy','math')),
  emoji       TEXT NOT NULL,
  label       TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pre-built phantom cohorts so small-population cohorts still have a "race".
-- No real children's data. Public read.
CREATE TABLE IF NOT EXISTS ghost_cohorts (
  key                    TEXT PRIMARY KEY,
  name                   TEXT NOT NULL,
  emoji                  TEXT NOT NULL,
  weekly_energy_target   INTEGER NOT NULL CHECK (weekly_energy_target > 0),
  description            TEXT,
  display_order          INTEGER NOT NULL DEFAULT 0,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. COHORT CORE
-- ============================================================================

-- A cohort is a 2-6 child team owned by a parent (V1) or teacher (V2).
CREATE TABLE IF NOT EXISTS cohorts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 24),
  emoji                TEXT NOT NULL DEFAULT '☄️',
  code                 TEXT NOT NULL UNIQUE,                             -- WORD-WORD-#### (server-generated)
  owner_user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cohort_type          TEXT NOT NULL DEFAULT 'friends' CHECK (cohort_type IN ('friends','classroom')),
  age_band_lowest      TEXT NOT NULL DEFAULT '8-9' CHECK (age_band_lowest IN ('4-7','8-9','10-11')),
  ghost_cohort_id      TEXT REFERENCES ghost_cohorts(key) ON DELETE SET NULL,
  archived_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cohorts_owner ON cohorts(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_active ON cohorts(id) WHERE archived_at IS NULL;

-- Membership rows: child <-> cohort.
CREATE TABLE IF NOT EXISTS cohort_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id   UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','member')),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at  TIMESTAMPTZ,
  UNIQUE (cohort_id, child_id)
);

CREATE INDEX IF NOT EXISTS idx_cohort_members_cohort ON cohort_members(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_child_active
  ON cohort_members(child_id) WHERE removed_at IS NULL;

-- ============================================================================
-- 3. JOIN AND INVITE REQUESTS
-- ============================================================================

-- A parent enters a code and asks to join an existing cohort (their child as member).
-- Owner approves/declines.
CREATE TABLE IF NOT EXISTS cohort_join_requests (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id            UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  requesting_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id             UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  status               TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','approved','declined','cancelled')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at           TIMESTAMPTZ
);

-- Only one pending request per (cohort, child); allow re-request after decline.
CREATE UNIQUE INDEX IF NOT EXISTS idx_cohort_join_requests_pending
  ON cohort_join_requests(cohort_id, child_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_cohort_join_requests_owner_pending
  ON cohort_join_requests(cohort_id) WHERE status = 'pending';

-- A KID asks their parent to invite a friend (kid never sees the code).
-- Parent approves -> parent then shares the cohort's existing code.
CREATE TABLE IF NOT EXISTS cohort_invite_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id    UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  child_id     UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  card_emoji   TEXT NOT NULL DEFAULT '🚀',
  status       TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','declined','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cohort_invite_requests_child
  ON cohort_invite_requests(child_id) WHERE status = 'pending';

-- ============================================================================
-- 4. STICKER SENDS
-- ============================================================================

-- One curated sticker sent from one cohort member to another. Async, public-to-cohort.
-- read_at marks when the recipient saw it.
CREATE TABLE IF NOT EXISTS sticker_sends (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id       UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  from_child_id   UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  to_child_id     UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  sticker_id      TEXT NOT NULL REFERENCES stickers(id) ON DELETE RESTRICT,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at         TIMESTAMPTZ,
  CHECK (from_child_id <> to_child_id)
);

CREATE INDEX IF NOT EXISTS idx_sticker_sends_unread
  ON sticker_sends(to_child_id, sent_at DESC) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sticker_sends_cohort
  ON sticker_sends(cohort_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_sticker_sends_from_today
  ON sticker_sends(from_child_id, sent_at DESC);

-- ============================================================================
-- 5. EFFORT STARS AND COHORT ENERGY (DERIVED CACHE TABLES)
-- ============================================================================

-- Per-child, per-day star count. Cache for cohort-bar reads.
-- Recomputed via compute_daily_effort_stars() on demand or via scheduled rollup.
CREATE TABLE IF NOT EXISTS daily_effort_stars (
  child_id     UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  stars        INTEGER NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 5),
  breakdown    JSONB NOT NULL DEFAULT '{}',                    -- {show, forward, quality, focus, boost}
  computed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (child_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_effort_stars_recent
  ON daily_effort_stars(child_id, date DESC);

-- Per-cohort weekly energy total (Mon-start).
CREATE TABLE IF NOT EXISTS cohort_energy_weekly (
  cohort_id           UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  week_start_date     DATE NOT NULL,
  total_energy        INTEGER NOT NULL DEFAULT 0,
  synergy_bonus       INTEGER NOT NULL DEFAULT 0,
  perfect_week_bonus  INTEGER NOT NULL DEFAULT 0,
  computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (cohort_id, week_start_date)
);

CREATE INDEX IF NOT EXISTS idx_cohort_energy_weekly_cohort
  ON cohort_energy_weekly(cohort_id, week_start_date DESC);

-- ============================================================================
-- 6. UPDATED_AT TRIGGERS (reuses existing update_updated_at_column())
-- ============================================================================

DROP TRIGGER IF EXISTS trg_cohorts_updated_at ON cohorts;
CREATE TRIGGER trg_cohorts_updated_at BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE stickers                ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghost_cohorts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_members          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_join_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_invite_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_sends           ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_effort_stars      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_energy_weekly    ENABLE ROW LEVEL SECURITY;

-- Reference data: anyone authenticated can read.
DROP POLICY IF EXISTS "Anyone can read stickers" ON stickers;
CREATE POLICY "Anyone can read stickers" ON stickers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read ghost_cohorts" ON ghost_cohorts;
CREATE POLICY "Anyone can read ghost_cohorts" ON ghost_cohorts FOR SELECT USING (true);

-- ----- cohorts -----
-- SELECT: cohort owner OR parent of any active member of the cohort.
DROP POLICY IF EXISTS "Users can view own or member cohorts" ON cohorts;
CREATE POLICY "Users can view own or member cohorts" ON cohorts
  FOR SELECT USING (
    owner_user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM cohort_members cm
      JOIN children c ON c.id = cm.child_id
      WHERE cm.cohort_id = cohorts.id
        AND cm.removed_at IS NULL
        AND c.user_id = auth.uid()
    )
  );

-- INSERT: any user can create a cohort, must own it.
DROP POLICY IF EXISTS "Users can insert own cohorts" ON cohorts;
CREATE POLICY "Users can insert own cohorts" ON cohorts
  FOR INSERT WITH CHECK (owner_user_id = auth.uid());

-- UPDATE / DELETE: owner only.
DROP POLICY IF EXISTS "Owners can update own cohorts" ON cohorts;
CREATE POLICY "Owners can update own cohorts" ON cohorts
  FOR UPDATE USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete own cohorts" ON cohorts;
CREATE POLICY "Owners can delete own cohorts" ON cohorts
  FOR DELETE USING (owner_user_id = auth.uid());

-- ----- cohort_members -----
-- SELECT: cohort owner sees all rows; parent of child sees their child's row only.
-- Cross-family teammate visibility goes through get_cohort_view() RPC, NOT direct SELECT.
DROP POLICY IF EXISTS "Members and owners can view membership" ON cohort_members;
CREATE POLICY "Members and owners can view membership" ON cohort_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cohorts ch
      WHERE ch.id = cohort_members.cohort_id AND ch.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = cohort_members.child_id AND c.user_id = auth.uid()
    )
  );

-- INSERT: cohort owner only (used during create + approve).
DROP POLICY IF EXISTS "Owners can insert cohort members" ON cohort_members;
CREATE POLICY "Owners can insert cohort members" ON cohort_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM cohorts ch
      WHERE ch.id = cohort_members.cohort_id AND ch.owner_user_id = auth.uid()
    )
  );

-- UPDATE: owner (mark removed) or parent of child (leave).
DROP POLICY IF EXISTS "Owners or parents can update membership" ON cohort_members;
CREATE POLICY "Owners or parents can update membership" ON cohort_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM cohorts ch
            WHERE ch.id = cohort_members.cohort_id AND ch.owner_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM children c
               WHERE c.id = cohort_members.child_id AND c.user_id = auth.uid())
  );

-- ----- cohort_join_requests -----
DROP POLICY IF EXISTS "Requester or owner can view join requests" ON cohort_join_requests;
CREATE POLICY "Requester or owner can view join requests" ON cohort_join_requests
  FOR SELECT USING (
    requesting_user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM cohorts ch
               WHERE ch.id = cohort_join_requests.cohort_id AND ch.owner_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can request to join with own child" ON cohort_join_requests;
CREATE POLICY "Parents can request to join with own child" ON cohort_join_requests
  FOR INSERT WITH CHECK (
    requesting_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = cohort_join_requests.child_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owner approves or requester cancels" ON cohort_join_requests;
CREATE POLICY "Owner approves or requester cancels" ON cohort_join_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM cohorts ch
            WHERE ch.id = cohort_join_requests.cohort_id AND ch.owner_user_id = auth.uid())
    OR requesting_user_id = auth.uid()
  );

-- ----- cohort_invite_requests -----
DROP POLICY IF EXISTS "Parent of child or cohort owner can view" ON cohort_invite_requests;
CREATE POLICY "Parent of child or cohort owner can view" ON cohort_invite_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c
            WHERE c.id = cohort_invite_requests.child_id AND c.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM cohorts ch
               WHERE ch.id = cohort_invite_requests.cohort_id AND ch.owner_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parent of child can insert invite request" ON cohort_invite_requests;
CREATE POLICY "Parent of child can insert invite request" ON cohort_invite_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = cohort_invite_requests.child_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Parent of child can update own invite request" ON cohort_invite_requests;
CREATE POLICY "Parent of child can update own invite request" ON cohort_invite_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = cohort_invite_requests.child_id AND c.user_id = auth.uid()
    )
  );

-- ----- sticker_sends -----
DROP POLICY IF EXISTS "Sender or recipient parent can view sticker_sends" ON sticker_sends;
CREATE POLICY "Sender or recipient parent can view sticker_sends" ON sticker_sends
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c
            WHERE c.id = sticker_sends.from_child_id AND c.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM children c
               WHERE c.id = sticker_sends.to_child_id AND c.user_id = auth.uid())
  );

-- INSERT: only parent of from_child, AND both children must be active members of cohort_id.
DROP POLICY IF EXISTS "Parent of sender can insert sticker_sends" ON sticker_sends;
CREATE POLICY "Parent of sender can insert sticker_sends" ON sticker_sends
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = sticker_sends.from_child_id AND c.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM cohort_members cm1
      WHERE cm1.cohort_id = sticker_sends.cohort_id
        AND cm1.child_id = sticker_sends.from_child_id
        AND cm1.removed_at IS NULL
    )
    AND EXISTS (
      SELECT 1 FROM cohort_members cm2
      WHERE cm2.cohort_id = sticker_sends.cohort_id
        AND cm2.child_id = sticker_sends.to_child_id
        AND cm2.removed_at IS NULL
    )
  );

-- UPDATE (mark read): parent of recipient only.
DROP POLICY IF EXISTS "Parent of recipient can mark read" ON sticker_sends;
CREATE POLICY "Parent of recipient can mark read" ON sticker_sends
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c
            WHERE c.id = sticker_sends.to_child_id AND c.user_id = auth.uid())
  );

-- ----- daily_effort_stars (private to family) -----
DROP POLICY IF EXISTS "Parent of child can view daily_effort_stars" ON daily_effort_stars;
CREATE POLICY "Parent of child can view daily_effort_stars" ON daily_effort_stars
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = daily_effort_stars.child_id AND c.user_id = auth.uid()
    )
  );

-- INSERT/UPDATE done via SECURITY DEFINER functions only; no direct user write.

-- ----- cohort_energy_weekly -----
DROP POLICY IF EXISTS "Cohort members and owner can view weekly energy" ON cohort_energy_weekly;
CREATE POLICY "Cohort members and owner can view weekly energy" ON cohort_energy_weekly
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cohorts ch
      WHERE ch.id = cohort_energy_weekly.cohort_id AND ch.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1
      FROM cohort_members cm
      JOIN children c ON c.id = cm.child_id
      WHERE cm.cohort_id = cohort_energy_weekly.cohort_id
        AND cm.removed_at IS NULL
        AND c.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. HELPER FUNCTIONS
-- ============================================================================

-- Map child age to age band for safety gating.
CREATE OR REPLACE FUNCTION child_age_band(p_age INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE
    WHEN p_age IS NULL THEN '8-9'
    WHEN p_age <= 7 THEN '4-7'
    WHEN p_age <= 9 THEN '8-9'
    ELSE '10-11'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generate a unique cohort code in WORD-WORD-#### format.
-- Up to 20 attempts then raises. Curated wordlists chosen for kid-friendliness.
CREATE OR REPLACE FUNCTION generate_cohort_code()
RETURNS TEXT AS $$
DECLARE
  v_w1 TEXT[] := ARRAY['BLUE','RED','GOLD','MOON','STAR','COMET','SUN','SKY','SEA','PINE','MINT','WAVE'];
  v_w2 TEXT[] := ARRAY['FOX','BEAR','OWL','WOLF','LION','SHARK','EAGLE','DEER','TIGER','HAWK','SEAL','OTTER'];
  v_code TEXT;
  v_attempts INT := 0;
BEGIN
  LOOP
    v_attempts := v_attempts + 1;
    IF v_attempts > 20 THEN
      RAISE EXCEPTION 'Could not generate unique cohort code after 20 attempts';
    END IF;
    v_code := v_w1[1 + floor(random() * array_length(v_w1, 1))::int]
              || '-' || v_w2[1 + floor(random() * array_length(v_w2, 1))::int]
              || '-' || lpad((floor(random() * 10000))::int::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM cohorts WHERE code = v_code);
  END LOOP;
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Compute (and return) the 5 effort stars for a child on a date.
-- Pure derivation from existing tables; does NOT write to daily_effort_stars.
CREATE OR REPLACE FUNCTION compute_daily_effort_stars(p_child UUID, p_date DATE)
RETURNS JSONB AS $$
DECLARE
  v_age INT;
  v_focus_threshold INT;
  v_show BOOLEAN;
  v_forward BOOLEAN;
  v_quality BOOLEAN;
  v_focus BOOLEAN;
  v_boost BOOLEAN;
  v_correct INT;
  v_attempts INT;
  v_total_time INT;
  v_stars INT;
BEGIN
  SELECT age INTO v_age FROM children WHERE id = p_child;
  v_focus_threshold := CASE
    WHEN v_age IS NULL OR v_age <= 7 THEN 600       -- 10 min
    WHEN v_age <= 9 THEN 900                         -- 15 min
    ELSE 1200                                        -- 20 min
  END;

  SELECT EXISTS(
    SELECT 1 FROM practice_sessions
    WHERE child_id = p_child
      AND started_at::date = p_date
      AND time_spent >= 180
  ) INTO v_show;

  SELECT EXISTS(
    SELECT 1 FROM worksheet_progress
    WHERE child_id = p_child
      AND status = 'completed'
      AND completed_at::date = p_date
  ) OR EXISTS(
    SELECT 1 FROM concepts_seen
    WHERE child_id = p_child
      AND seen_at::date = p_date
  ) INTO v_forward;

  SELECT
    COUNT(*) FILTER (WHERE is_correct),
    COUNT(*)
  INTO v_correct, v_attempts
  FROM problem_attempts
  WHERE child_id = p_child
    AND created_at::date = p_date;
  v_quality := v_attempts >= 5 AND (v_correct::numeric / v_attempts) >= 0.80;

  SELECT COALESCE(SUM(time_spent), 0) INTO v_total_time
  FROM practice_sessions
  WHERE child_id = p_child
    AND started_at::date = p_date;
  v_focus := v_total_time >= v_focus_threshold;

  SELECT EXISTS(
    SELECT 1 FROM sticker_sends
    WHERE from_child_id = p_child
      AND sent_at::date = p_date
  ) INTO v_boost;

  v_stars :=
    (CASE WHEN v_show    THEN 1 ELSE 0 END) +
    (CASE WHEN v_forward THEN 1 ELSE 0 END) +
    (CASE WHEN v_quality THEN 1 ELSE 0 END) +
    (CASE WHEN v_focus   THEN 1 ELSE 0 END) +
    (CASE WHEN v_boost   THEN 1 ELSE 0 END);

  RETURN jsonb_build_object(
    'show', v_show,
    'forward', v_forward,
    'quality', v_quality,
    'focus', v_focus,
    'boost', v_boost,
    'total', v_stars
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Upsert today's stars for a child into the cache table. Safe to call repeatedly.
CREATE OR REPLACE FUNCTION upsert_daily_effort_stars(p_child UUID, p_date DATE)
RETURNS INTEGER AS $$
DECLARE
  v_breakdown JSONB;
  v_total INT;
BEGIN
  v_breakdown := compute_daily_effort_stars(p_child, p_date);
  v_total := COALESCE((v_breakdown->>'total')::int, 0);

  INSERT INTO daily_effort_stars (child_id, date, stars, breakdown, computed_at)
  VALUES (p_child, p_date, v_total, v_breakdown, NOW())
  ON CONFLICT (child_id, date) DO UPDATE
    SET stars = EXCLUDED.stars,
        breakdown = EXCLUDED.breakdown,
        computed_at = NOW();

  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recompute the cohort's weekly energy bar, including synergy bonus.
-- synergy_bonus: for each weekday in the week where ALL active members earned >=1 star,
-- add (team_size) energy.
-- perfect_week_bonus: +5 if synergy fired all 5 weekdays Mon-Fri.
CREATE OR REPLACE FUNCTION recompute_cohort_energy_weekly(p_cohort UUID, p_week_start DATE)
RETURNS VOID AS $$
DECLARE
  v_team_size INT;
  v_total INT;
  v_synergy INT;
  v_perfect INT;
  v_synergy_days INT;
BEGIN
  SELECT COUNT(*) INTO v_team_size
  FROM cohort_members
  WHERE cohort_id = p_cohort AND removed_at IS NULL;

  IF v_team_size = 0 THEN
    INSERT INTO cohort_energy_weekly (cohort_id, week_start_date, total_energy, synergy_bonus, perfect_week_bonus, computed_at)
    VALUES (p_cohort, p_week_start, 0, 0, 0, NOW())
    ON CONFLICT (cohort_id, week_start_date) DO UPDATE
      SET total_energy = 0, synergy_bonus = 0, perfect_week_bonus = 0, computed_at = NOW();
    RETURN;
  END IF;

  SELECT COALESCE(SUM(des.stars), 0)
  INTO v_total
  FROM cohort_members cm
  JOIN daily_effort_stars des ON des.child_id = cm.child_id
  WHERE cm.cohort_id = p_cohort
    AND cm.removed_at IS NULL
    AND des.date >= p_week_start
    AND des.date <  p_week_start + INTERVAL '7 days';

  SELECT COUNT(*)
  INTO v_synergy_days
  FROM (
    SELECT des.date, COUNT(*) FILTER (WHERE des.stars > 0) AS active_count
    FROM cohort_members cm
    JOIN daily_effort_stars des ON des.child_id = cm.child_id
    WHERE cm.cohort_id = p_cohort
      AND cm.removed_at IS NULL
      AND des.date >= p_week_start
      AND des.date <  p_week_start + INTERVAL '7 days'
    GROUP BY des.date
  ) d
  WHERE d.active_count = v_team_size;

  v_synergy := v_synergy_days * v_team_size;
  v_perfect := CASE WHEN v_synergy_days >= 5 THEN 5 ELSE 0 END;

  INSERT INTO cohort_energy_weekly (cohort_id, week_start_date, total_energy, synergy_bonus, perfect_week_bonus, computed_at)
  VALUES (p_cohort, p_week_start, v_total, v_synergy, v_perfect, NOW())
  ON CONFLICT (cohort_id, week_start_date) DO UPDATE
    SET total_energy = EXCLUDED.total_energy,
        synergy_bonus = EXCLUDED.synergy_bonus,
        perfect_week_bonus = EXCLUDED.perfect_week_bonus,
        computed_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe age-band-aware projection of a cohort's members for cross-family rendering.
-- Returns first-name only (per safety floor); no last names ever exposed.
-- Caller must be either cohort owner or parent of an active member.
-- Sorted alphabetically (hard-coded; never by score).
CREATE OR REPLACE FUNCTION get_cohort_view(p_cohort UUID)
RETURNS TABLE(
  member_id        UUID,
  display_name     TEXT,
  avatar           TEXT,
  age_band         TEXT,
  today_stars      INT,
  streak           INT,
  mastered_today   BOOLEAN,
  sleepy           BOOLEAN,
  trend            TEXT,
  is_owner         BOOLEAN
) AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_authorized BOOLEAN;
BEGIN
  SELECT (
    EXISTS (SELECT 1 FROM cohorts ch WHERE ch.id = p_cohort AND ch.owner_user_id = v_caller)
    OR EXISTS (
      SELECT 1
      FROM cohort_members cm
      JOIN children c ON c.id = cm.child_id
      WHERE cm.cohort_id = p_cohort
        AND cm.removed_at IS NULL
        AND c.user_id = v_caller
    )
  ) INTO v_authorized;

  IF NOT v_authorized THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    cm.child_id AS member_id,
    COALESCE(NULLIF(SPLIT_PART(c.name, ' ', 1), ''), 'Friend') AS display_name,
    COALESCE(c.avatar, '🧒') AS avatar,
    child_age_band(c.age) AS age_band,
    COALESCE(des.stars, 0) AS today_stars,
    COALESCE(c.streak, 0) AS streak,
    EXISTS (
      SELECT 1 FROM achievements a
      WHERE a.child_id = c.id
        AND a.achievement_type IN ('skill_mastery','level_complete')
        AND a.earned_at::date = CURRENT_DATE
    ) AS mastered_today,
    NOT EXISTS (
      SELECT 1 FROM daily_effort_stars d
      WHERE d.child_id = c.id
        AND d.date >= CURRENT_DATE - INTERVAL '2 days'
        AND d.stars > 0
    ) AS sleepy,
    CASE
      WHEN (SELECT COALESCE(AVG(stars), 0) FROM daily_effort_stars
            WHERE child_id = c.id AND date >= CURRENT_DATE - INTERVAL '7 days')
         > (SELECT COALESCE(AVG(stars), 0) FROM daily_effort_stars
            WHERE child_id = c.id
              AND date BETWEEN CURRENT_DATE - INTERVAL '14 days' AND CURRENT_DATE - INTERVAL '8 days') + 0.5
        THEN 'up'
      WHEN (SELECT COALESCE(AVG(stars), 0) FROM daily_effort_stars
            WHERE child_id = c.id AND date >= CURRENT_DATE - INTERVAL '7 days')
         < (SELECT COALESCE(AVG(stars), 0) FROM daily_effort_stars
            WHERE child_id = c.id
              AND date BETWEEN CURRENT_DATE - INTERVAL '14 days' AND CURRENT_DATE - INTERVAL '8 days') - 0.5
        THEN 'down'
      ELSE 'flat'
    END AS trend,
    (cm.role = 'owner') AS is_owner
  FROM cohort_members cm
  JOIN children c ON c.id = cm.child_id
  LEFT JOIN daily_effort_stars des ON des.child_id = c.id AND des.date = CURRENT_DATE
  WHERE cm.cohort_id = p_cohort
    AND cm.removed_at IS NULL
  ORDER BY display_name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Approve a pending join request: owner-only side effect.
-- 1) flips the join_request to approved
-- 2) inserts a cohort_members row
CREATE OR REPLACE FUNCTION approve_cohort_join_request(p_request UUID)
RETURNS UUID AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_cohort UUID;
  v_child UUID;
  v_status TEXT;
  v_member_id UUID;
BEGIN
  SELECT cohort_id, child_id, status INTO v_cohort, v_child, v_status
  FROM cohort_join_requests
  WHERE id = p_request;

  IF v_cohort IS NULL THEN
    RAISE EXCEPTION 'Join request not found';
  END IF;

  IF v_status <> 'pending' THEN
    RAISE EXCEPTION 'Join request is not pending';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM cohorts WHERE id = v_cohort AND owner_user_id = v_caller) THEN
    RAISE EXCEPTION 'Only the cohort owner can approve';
  END IF;

  -- Insert the member (idempotent on duplicate)
  INSERT INTO cohort_members (cohort_id, child_id, role)
  VALUES (v_cohort, v_child, 'member')
  ON CONFLICT (cohort_id, child_id) DO UPDATE
    SET removed_at = NULL
  RETURNING id INTO v_member_id;

  UPDATE cohort_join_requests
    SET status = 'approved', decided_at = NOW()
    WHERE id = p_request;

  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION generate_cohort_code()                       TO authenticated;
GRANT EXECUTE ON FUNCTION compute_daily_effort_stars(UUID, DATE)       TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_daily_effort_stars(UUID, DATE)        TO authenticated;
GRANT EXECUTE ON FUNCTION recompute_cohort_energy_weekly(UUID, DATE)   TO authenticated;
GRANT EXECUTE ON FUNCTION get_cohort_view(UUID)                        TO authenticated;
GRANT EXECUTE ON FUNCTION approve_cohort_join_request(UUID)            TO authenticated;
GRANT EXECUTE ON FUNCTION child_age_band(INTEGER)                      TO authenticated;

-- Service role gets full DML access on cache tables (rollups, future cron)
GRANT INSERT, UPDATE ON daily_effort_stars     TO service_role;
GRANT INSERT, UPDATE ON cohort_energy_weekly   TO service_role;

-- ============================================================================
-- 9. COMMENTS
-- ============================================================================

COMMENT ON TABLE cohorts                IS 'Small (2-6) child practice teams. Parent-owned in V1; classroom type reserved for V2.';
COMMENT ON TABLE cohort_members         IS 'Child membership in a cohort. Soft-delete via removed_at.';
COMMENT ON TABLE cohort_join_requests   IS 'Parent-initiated request to add their child to an existing cohort. Owner approves.';
COMMENT ON TABLE cohort_invite_requests IS 'Kid-initiated invite-card request. Kid never sees the cohort code; parent shares.';
COMMENT ON TABLE stickers               IS 'Curated child-to-child reactions. The ONLY child-facing communication channel. Public read.';
COMMENT ON TABLE sticker_sends          IS 'One sticker delivered from one cohort member to another. Async; read_at marks recipient view.';
COMMENT ON TABLE ghost_cohorts          IS 'Pre-built phantom cohorts for benchmark "races". No real children data.';
COMMENT ON TABLE daily_effort_stars     IS 'Per-child daily 0-5 stars: show / forward / quality / focus / boost. Cache; recomputed via SECURITY DEFINER fns.';
COMMENT ON TABLE cohort_energy_weekly   IS 'Mon-start weekly aggregate for cohort Team Energy bar. Cache.';

COMMENT ON COLUMN cohorts.code              IS 'Public-shareable join code, format WORD-WORD-#### (e.g. BLUE-FOX-7842).';
COMMENT ON COLUMN cohorts.age_band_lowest   IS 'Lowest age-band among members; UI defaults safety gates to this.';
COMMENT ON COLUMN daily_effort_stars.breakdown IS '{show, forward, quality, focus, boost, total} booleans + total int.';
COMMENT ON COLUMN sticker_sends.read_at     IS 'NULL until recipient views; clears the NEW badge in cohort home.';

COMMENT ON FUNCTION get_cohort_view(UUID) IS 'Safe projection of a cohort''s teammates: first-name only, age-band-aware, alphabetical. SECURITY DEFINER; verifies caller is member or owner.';
COMMENT ON FUNCTION compute_daily_effort_stars(UUID, DATE) IS 'Pure derivation of 5 effort stars from existing tables. Read-only.';
COMMENT ON FUNCTION generate_cohort_code() IS 'Returns a unique WORD-WORD-#### cohort code; retries up to 20x on collision.';
