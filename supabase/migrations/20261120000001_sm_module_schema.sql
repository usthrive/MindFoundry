-- Singapore Method module (module id `school-math`) — version 2 records (BUILD-PLAN v2 stage 0)
-- Additive-only: every object is new and sm_-prefixed; no existing table is touched.
--
-- Data model law (modules/school-math/design/engine/BUILD-PLAN.md §5.2; ENGINE-SPEC §4):
--   * Items are NOT stored. A day's items regenerate deterministically from the frozen
--     manifest (template id + seed + role per slot) in sm_day_state.
--   * sm_item_attempts is the record of what the child knows: append-only. sm_skill_state is a
--     rebuildable projection of it for the parent view, never the source of truth.
--   * "Two separate days", clean days and the 2 / 7 / 21-day comebacks are counted on the
--     device's LOCAL calendar day (local_day), never on UTC created_at.
--   * Every change of where a child is (grade, start unit, park, go back, re-run placement)
--     goes through the app's one move path, which writes sm_parent_moves (append-only).
--   * Test-prep tables are NOT created here (future feature, TEST-PREP-SPEC); test_date is kept.
--   * RLS follows the house child→parent ownership pattern (children.user_id = auth.uid()).
--     Upsert tables carry four policies; append-only tables carry three (no UPDATE), declared
--     below with a "sm:append-only" line read by frontend/scripts/sm-schema-test.ts.
--
-- sm:append-only sm_item_attempts
-- sm:append-only sm_parent_moves
-- sm:append-only sm_explanation_reviews

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. sm_enrollment — one row per child: grade, the parent's Settings, the start
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_enrollment (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id     UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  grade        INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
  -- Settings JSONB: { lessonN, practiceN, daysPerWeek, weekendDays[], readAloud }.
  -- Defaults by grade live in the app (BUILD-PLAN §2 T-2, T-3).
  settings     JSONB NOT NULL DEFAULT '{}',
  -- School layer (optional): { book, chapter, updatedAt }.
  school       JSONB NOT NULL DEFAULT '{}',
  -- School breaks for the pacing line: { breaks: [{ from, to }] }.
  calendar     JSONB NOT NULL DEFAULT '{}',
  -- Units the parent ticked as hard (placement reads these as at most short-check).
  hard_units   TEXT[] NOT NULL DEFAULT '{}',
  -- What the parent wants added, e.g. 'word-problems', 'more-advanced'.
  wants        TEXT[] NOT NULL DEFAULT '{}',
  -- Stored for the future test-prep feature; nothing reads it yet.
  test_date    DATE,
  start_unit   TEXT CHECK (start_unit ~ '^G[1-5]-U[0-9]{2}$'),
  status       TEXT NOT NULL DEFAULT 'intake' CHECK (status IN ('intake','placement','active','paused')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id)
);

CREATE INDEX IF NOT EXISTS idx_sm_enrollment_child ON sm_enrollment(child_id);

-- ============================================================================
-- 2. sm_placement_sittings — one row per placement test (DD25; BUILD-PLAN §6)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_placement_sittings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id         UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  grade            INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
  seed             BIGINT NOT NULL,
  form             TEXT NOT NULL,
  -- Items served: [{ slot, unitId, templateId, seed, role: 'warm'|'placement' }].
  items            JSONB NOT NULL DEFAULT '[]',
  -- Per unit: { "G1-U02": "placed-out" | "short-check" | "start-here" | "not-reached" }.
  unit_results     JSONB NOT NULL DEFAULT '{}',
  stop_reason      TEXT CHECK (stop_reason IN ('ladder-end','two-core-misses','warm-items-missed','abandoned')),
  proposed_start   TEXT CHECK (proposed_start ~ '^G[1-5]-U[0-9]{2}$'),
  parent_changed   BOOLEAN NOT NULL DEFAULT FALSE,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sm_placement_sittings_child
  ON sm_placement_sittings(child_id, started_at DESC);

-- ============================================================================
-- 3. sm_unit_state — one row per (child, unit)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_unit_state (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  unit_id         TEXT NOT NULL CHECK (unit_id ~ '^G[1-5]-U[0-9]{2}$'),
  state           TEXT NOT NULL DEFAULT 'not-started' CHECK (state IN (
                    'not-started','in-progress','check-due','checked','placed-out')),
  -- Per lesson: { "L1": { lessonDay: 'YYYY-MM-DD', practiceDays: n } }.
  lessons         JSONB NOT NULL DEFAULT '{}',
  -- Entry-check pairs: { pairId: 'holds' | 'does-not-hold' | 'unclear' }.
  entry_check     JSONB NOT NULL DEFAULT '{}',
  -- Skill ids marked "already knows" (DD24 previews / placement confirms).
  already_knows   TEXT[] NOT NULL DEFAULT '{}',
  -- Lesson demos seen, per content version: { "L1": "<contentVersion>" } (TAD §3.16).
  demos_seen      JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, unit_id)
);

CREATE INDEX IF NOT EXISTS idx_sm_unit_state_child ON sm_unit_state(child_id);

-- ============================================================================
-- 4. sm_day_state — one row per sitting on a local day; the frozen manifest
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_day_state (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  local_day     DATE NOT NULL,
  -- 1 for the day's first sitting; a child who goes on after the rest offer opens 2, 3 …
  seq           INTEGER NOT NULL DEFAULT 1 CHECK (seq >= 1),
  day_kind      TEXT NOT NULL CHECK (day_kind IN (
                  'lesson','practice','entry','check','review','placement')),
  unit_id       TEXT CHECK (unit_id ~ '^G[1-5]-U[0-9]{2}$'),
  lesson_id     TEXT,
  -- Frozen at day start: [{ slot, templateId, seed, role, skillIds[] }] — resume re-serves
  -- exactly these items at the same place (TAD §3.20).
  manifest      JSONB NOT NULL,
  n             INTEGER NOT NULL CHECK (n >= 1),
  place_k       INTEGER NOT NULL DEFAULT 0 CHECK (place_k >= 0),
  content_version TEXT,
  done_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, local_day, seq)
);

CREATE INDEX IF NOT EXISTS idx_sm_day_state_child_day ON sm_day_state(child_id, local_day DESC);

-- ============================================================================
-- 5. sm_item_attempts — append-only: the record of what the child knows
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_item_attempts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id            UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  unit_id             TEXT NOT NULL CHECK (unit_id ~ '^G[1-5]-U[0-9]{2}$'),
  lesson_id           TEXT,
  item_id             TEXT NOT NULL,
  template_id         TEXT NOT NULL,
  seed                BIGINT NOT NULL,
  role                TEXT NOT NULL CHECK (role IN (
                        'starter','step','exit','practice','return','comeback','preview',
                        'entry','placement','warm','check','mock','prep','short-check',
                        'review','interim')),
  skill_ids           TEXT[] NOT NULL DEFAULT '{}',
  -- Per part: [{ part, surface, correct, ungraded? }].
  parts               JSONB NOT NULL DEFAULT '[]',
  first_try_correct   BOOLEAN NOT NULL,
  tries               INTEGER NOT NULL DEFAULT 1 CHECK (tries >= 1),
  -- Every answer tried, in order (TAD §8).
  answers_tried       JSONB NOT NULL DEFAULT '[]',
  -- Monotonic clock, paused while the app is hidden; NULL when the clock did not run.
  first_try_ms        INTEGER CHECK (first_try_ms >= 0),
  scaffold_visible    BOOLEAN NOT NULL DEFAULT FALSE,
  ladder_rung         INTEGER NOT NULL DEFAULT 0 CHECK (ladder_rung BETWEEN 0 AND 4),
  model_rung          TEXT CHECK (model_rung IN ('read','label','build','unaided')),
  self_check_differed BOOLEAN,
  strategy_chip       TEXT,
  misconception_rule  TEXT,
  day_kind            TEXT NOT NULL CHECK (day_kind IN (
                        'lesson','practice','entry','check','review','placement')),
  local_day           DATE NOT NULL,
  content_version     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sm_item_attempts_child_day
  ON sm_item_attempts(child_id, local_day DESC);
CREATE INDEX IF NOT EXISTS idx_sm_item_attempts_child_unit
  ON sm_item_attempts(child_id, unit_id);
CREATE INDEX IF NOT EXISTS idx_sm_item_attempts_skills
  ON sm_item_attempts USING GIN (skill_ids);

-- ============================================================================
-- 6. sm_skill_state — a rebuildable projection of sm_item_attempts
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_skill_state (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id                  UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  skill_id                  TEXT NOT NULL,
  state                     TEXT NOT NULL DEFAULT 'not-started' CHECK (state IN (
                              'not-started','learning','stuck','parked','known')),
  stretch                   BOOLEAN NOT NULL DEFAULT FALSE,
  -- The local days that qualified it as known (two separate days, METHODOLOGY §4).
  qualifying_days           DATE[] NOT NULL DEFAULT '{}',
  practice_days_since_clean INTEGER NOT NULL DEFAULT 0 CHECK (practice_days_since_clean >= 0),
  fluency_ms                INTEGER CHECK (fluency_ms > 0),
  parked_at                 TIMESTAMPTZ,
  rebuilt_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_sm_skill_state_child ON sm_skill_state(child_id);

-- ============================================================================
-- 7. sm_check_sittings — chapter checks, cumulative checks, mocks (DD11)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_check_sittings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  -- A unit id, or a multi-unit blueprint id such as 'G1-CUM-1'.
  blueprint_id    TEXT NOT NULL,
  kind            TEXT NOT NULL CHECK (kind IN ('chapter','cumulative','mock')),
  form            TEXT NOT NULL,
  seed            BIGINT NOT NULL,
  -- { A: { points, max }, B: {…}, C: {…} } — counts, never percentages.
  section_counts  JSONB NOT NULL DEFAULT '{}',
  -- { conceptsAndProcedures: { points, max }, reasoning: { points, max } }.
  category_rows   JSONB NOT NULL DEFAULT '{}',
  points          INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  points_max      INTEGER NOT NULL CHECK (points_max > 0),
  local_day       DATE NOT NULL,
  finished_at     TIMESTAMPTZ,
  -- The review of misses never changes the score; it only records when it was done.
  review_done_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (points <= points_max)
);

CREATE INDEX IF NOT EXISTS idx_sm_check_sittings_child
  ON sm_check_sittings(child_id, created_at DESC);

-- ============================================================================
-- 8. sm_comebacks — missed questions coming back at 2 / 7 / 21 days
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_comebacks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  -- The item family that returns with new numbers: '<templateId>'.
  item_family     TEXT NOT NULL,
  skill_ids       TEXT[] NOT NULL DEFAULT '{}',
  source          TEXT NOT NULL CHECK (source IN ('check','placement','return','mock')),
  -- The sitting or attempt that produced it.
  source_ref      UUID,
  -- 0 → due at +2 days, 1 → +7, 2 → +21.
  interval_step   INTEGER NOT NULL DEFAULT 0 CHECK (interval_step BETWEEN 0 AND 2),
  next_due        DATE NOT NULL,
  clean_in_a_row  INTEGER NOT NULL DEFAULT 0 CHECK (clean_in_a_row BETWEEN 0 AND 3),
  settled_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sm_comebacks_child_due
  ON sm_comebacks(child_id, next_due) WHERE settled_at IS NULL;

-- ============================================================================
-- 9. sm_parent_moves — append-only audit of the one move path
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_parent_moves (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL CHECK (kind IN (
                'move-start','park','unpark','go-back-unit','rerun-placement',
                'grade-changed','setting-changed','placement-applied')),
  from_value  JSONB,
  to_value    JSONB,
  by_user     UUID DEFAULT auth.uid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sm_parent_moves_child ON sm_parent_moves(child_id, created_at DESC);

-- ============================================================================
-- 10. sm_explanation_reviews — the bb_explanation_reviews shape, keyed by unit
-- ============================================================================

CREATE TABLE IF NOT EXISTS sm_explanation_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  unit_id       TEXT NOT NULL CHECK (unit_id ~ '^G[1-5]-U[0-9]{2}$'),
  lesson_id     TEXT,
  item_id       TEXT NOT NULL,
  local_day     DATE,
  -- The child's own words, capped client- and function-side at 500 chars.
  child_text    TEXT,
  verdict       TEXT NOT NULL CHECK (verdict IN ('got-it','partly','not-yet')),
  -- What the teacher said to the child, and the one question that followed it.
  line          TEXT NOT NULL,
  nudge         TEXT,
  -- Parent-facing, <= 120 chars, NEVER rendered on a child surface.
  reason        TEXT,
  model         TEXT,
  input_tokens  INTEGER,
  output_tokens INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sm_explanation_reviews_child_created
  ON sm_explanation_reviews(child_id, created_at DESC);

-- ============================================================================
-- 11. updated_at triggers (reuses the existing update_updated_at_column())
-- ============================================================================

DROP TRIGGER IF EXISTS trg_sm_enrollment_updated_at ON sm_enrollment;
CREATE TRIGGER trg_sm_enrollment_updated_at BEFORE UPDATE ON sm_enrollment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sm_placement_sittings_updated_at ON sm_placement_sittings;
CREATE TRIGGER trg_sm_placement_sittings_updated_at BEFORE UPDATE ON sm_placement_sittings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sm_unit_state_updated_at ON sm_unit_state;
CREATE TRIGGER trg_sm_unit_state_updated_at BEFORE UPDATE ON sm_unit_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sm_day_state_updated_at ON sm_day_state;
CREATE TRIGGER trg_sm_day_state_updated_at BEFORE UPDATE ON sm_day_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sm_skill_state_updated_at ON sm_skill_state;
CREATE TRIGGER trg_sm_skill_state_updated_at BEFORE UPDATE ON sm_skill_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sm_check_sittings_updated_at ON sm_check_sittings;
CREATE TRIGGER trg_sm_check_sittings_updated_at BEFORE UPDATE ON sm_check_sittings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sm_comebacks_updated_at ON sm_comebacks;
CREATE TRIGGER trg_sm_comebacks_updated_at BEFORE UPDATE ON sm_comebacks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 12. Row Level Security — house child→parent ownership pattern
-- ============================================================================

ALTER TABLE sm_enrollment          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_placement_sittings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_unit_state          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_day_state           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_item_attempts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_skill_state         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_check_sittings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_comebacks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_parent_moves        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sm_explanation_reviews ENABLE ROW LEVEL SECURITY;

-- Upsert tables: SELECT, INSERT, UPDATE, DELETE. Append-only tables: SELECT, INSERT, DELETE
-- (no UPDATE; DELETE kept for the data-deletion flow, as bb_item_attempts).

-- ----- sm_enrollment -----
DROP POLICY IF EXISTS "Parents can view own children sm_enrollment" ON sm_enrollment;
CREATE POLICY "Parents can view own children sm_enrollment" ON sm_enrollment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_enrollment.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_enrollment" ON sm_enrollment;
CREATE POLICY "Parents can insert own children sm_enrollment" ON sm_enrollment
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_enrollment.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children sm_enrollment" ON sm_enrollment;
CREATE POLICY "Parents can update own children sm_enrollment" ON sm_enrollment
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_enrollment.child_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_enrollment.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_enrollment" ON sm_enrollment;
CREATE POLICY "Parents can delete own children sm_enrollment" ON sm_enrollment
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_enrollment.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_placement_sittings -----
DROP POLICY IF EXISTS "Parents can view own children sm_placement_sittings" ON sm_placement_sittings;
CREATE POLICY "Parents can view own children sm_placement_sittings" ON sm_placement_sittings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_placement_sittings.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_placement_sittings" ON sm_placement_sittings;
CREATE POLICY "Parents can insert own children sm_placement_sittings" ON sm_placement_sittings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_placement_sittings.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children sm_placement_sittings" ON sm_placement_sittings;
CREATE POLICY "Parents can update own children sm_placement_sittings" ON sm_placement_sittings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_placement_sittings.child_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_placement_sittings.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_placement_sittings" ON sm_placement_sittings;
CREATE POLICY "Parents can delete own children sm_placement_sittings" ON sm_placement_sittings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_placement_sittings.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_unit_state -----
DROP POLICY IF EXISTS "Parents can view own children sm_unit_state" ON sm_unit_state;
CREATE POLICY "Parents can view own children sm_unit_state" ON sm_unit_state
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_unit_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_unit_state" ON sm_unit_state;
CREATE POLICY "Parents can insert own children sm_unit_state" ON sm_unit_state
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_unit_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children sm_unit_state" ON sm_unit_state;
CREATE POLICY "Parents can update own children sm_unit_state" ON sm_unit_state
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_unit_state.child_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_unit_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_unit_state" ON sm_unit_state;
CREATE POLICY "Parents can delete own children sm_unit_state" ON sm_unit_state
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_unit_state.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_day_state -----
DROP POLICY IF EXISTS "Parents can view own children sm_day_state" ON sm_day_state;
CREATE POLICY "Parents can view own children sm_day_state" ON sm_day_state
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_day_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_day_state" ON sm_day_state;
CREATE POLICY "Parents can insert own children sm_day_state" ON sm_day_state
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_day_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children sm_day_state" ON sm_day_state;
CREATE POLICY "Parents can update own children sm_day_state" ON sm_day_state
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_day_state.child_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_day_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_day_state" ON sm_day_state;
CREATE POLICY "Parents can delete own children sm_day_state" ON sm_day_state
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_day_state.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_skill_state -----
DROP POLICY IF EXISTS "Parents can view own children sm_skill_state" ON sm_skill_state;
CREATE POLICY "Parents can view own children sm_skill_state" ON sm_skill_state
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_skill_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_skill_state" ON sm_skill_state;
CREATE POLICY "Parents can insert own children sm_skill_state" ON sm_skill_state
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_skill_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children sm_skill_state" ON sm_skill_state;
CREATE POLICY "Parents can update own children sm_skill_state" ON sm_skill_state
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_skill_state.child_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_skill_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_skill_state" ON sm_skill_state;
CREATE POLICY "Parents can delete own children sm_skill_state" ON sm_skill_state
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_skill_state.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_check_sittings -----
DROP POLICY IF EXISTS "Parents can view own children sm_check_sittings" ON sm_check_sittings;
CREATE POLICY "Parents can view own children sm_check_sittings" ON sm_check_sittings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_check_sittings.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_check_sittings" ON sm_check_sittings;
CREATE POLICY "Parents can insert own children sm_check_sittings" ON sm_check_sittings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_check_sittings.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children sm_check_sittings" ON sm_check_sittings;
CREATE POLICY "Parents can update own children sm_check_sittings" ON sm_check_sittings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_check_sittings.child_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_check_sittings.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_check_sittings" ON sm_check_sittings;
CREATE POLICY "Parents can delete own children sm_check_sittings" ON sm_check_sittings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_check_sittings.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_comebacks -----
DROP POLICY IF EXISTS "Parents can view own children sm_comebacks" ON sm_comebacks;
CREATE POLICY "Parents can view own children sm_comebacks" ON sm_comebacks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_comebacks.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_comebacks" ON sm_comebacks;
CREATE POLICY "Parents can insert own children sm_comebacks" ON sm_comebacks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_comebacks.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children sm_comebacks" ON sm_comebacks;
CREATE POLICY "Parents can update own children sm_comebacks" ON sm_comebacks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_comebacks.child_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_comebacks.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_comebacks" ON sm_comebacks;
CREATE POLICY "Parents can delete own children sm_comebacks" ON sm_comebacks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_comebacks.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_item_attempts (append-only) -----
DROP POLICY IF EXISTS "Parents can view own children sm_item_attempts" ON sm_item_attempts;
CREATE POLICY "Parents can view own children sm_item_attempts" ON sm_item_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_item_attempts.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_item_attempts" ON sm_item_attempts;
CREATE POLICY "Parents can insert own children sm_item_attempts" ON sm_item_attempts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_item_attempts.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_item_attempts" ON sm_item_attempts;
CREATE POLICY "Parents can delete own children sm_item_attempts" ON sm_item_attempts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_item_attempts.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_parent_moves (append-only) -----
DROP POLICY IF EXISTS "Parents can view own children sm_parent_moves" ON sm_parent_moves;
CREATE POLICY "Parents can view own children sm_parent_moves" ON sm_parent_moves
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_parent_moves.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_parent_moves" ON sm_parent_moves;
CREATE POLICY "Parents can insert own children sm_parent_moves" ON sm_parent_moves
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_parent_moves.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_parent_moves" ON sm_parent_moves;
CREATE POLICY "Parents can delete own children sm_parent_moves" ON sm_parent_moves
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_parent_moves.child_id AND c.user_id = auth.uid())
  );

-- ----- sm_explanation_reviews (append-only) -----
DROP POLICY IF EXISTS "Parents can view own children sm_explanation_reviews" ON sm_explanation_reviews;
CREATE POLICY "Parents can view own children sm_explanation_reviews" ON sm_explanation_reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_explanation_reviews.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children sm_explanation_reviews" ON sm_explanation_reviews;
CREATE POLICY "Parents can insert own children sm_explanation_reviews" ON sm_explanation_reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_explanation_reviews.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children sm_explanation_reviews" ON sm_explanation_reviews;
CREATE POLICY "Parents can delete own children sm_explanation_reviews" ON sm_explanation_reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = sm_explanation_reviews.child_id AND c.user_id = auth.uid())
  );
