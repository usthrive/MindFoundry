-- Cohorts feature seed data
-- Depends on 20260428000001_cohorts_schema.sql
-- Idempotent: safe to re-run.

-- ============================================================================
-- 1. STICKERS (22 curated reactions, 6 categories)
-- ============================================================================

INSERT INTO stickers (id, category, emoji, label, display_order) VALUES
  ('cheer_01',     'cheer',     '🎉', 'Way to go!',        10),
  ('cheer_02',     'cheer',     '🌟', 'Superstar',         20),
  ('cheer_03',     'cheer',     '👏', 'Yes!',              30),
  ('cheer_04',     'cheer',     '🥳', 'Hooray',            40),
  ('fist_01',      'fistbump',  '🤜', 'Fist bump',         50),
  ('fist_02',      'fistbump',  '💪', 'Strong work',       60),
  ('fist_03',      'fistbump',  '🙌', 'High five',         70),
  ('gotthis_01',   'gotthis',   '🌱', 'Growing',           80),
  ('gotthis_02',   'gotthis',   '🛟', 'You got this',      90),
  ('gotthis_03',   'gotthis',   '🧗', 'Keep climbing',     100),
  ('celebrate_01', 'celebrate', '🎊', 'Big win',           110),
  ('celebrate_02', 'celebrate', '🏆', 'Champion',          120),
  ('celebrate_03', 'celebrate', '🚀', 'Liftoff',           130),
  ('sympathy_01',  'sympathy',  '🫂', 'We miss you',       140),
  ('sympathy_02',  'sympathy',  '💛', 'Thinking of you',   150),
  ('sympathy_03',  'sympathy',  '🌤️', 'Tomorrow',          160),
  ('math_01',      'math',      '🧮', 'Math wizard',       170),
  ('math_02',      'math',      '➕', 'Plus power',        180),
  ('math_03',      'math',      '🟰', 'Equals win',        190),
  ('math_04',      'math',      '∞',  'Infinite',          200),
  ('math_05',      'math',      '🔢', 'Number nerd',       210),
  ('math_06',      'math',      '📐', 'On point',          220)
ON CONFLICT (id) DO UPDATE SET
  category      = EXCLUDED.category,
  emoji         = EXCLUDED.emoji,
  label         = EXCLUDED.label,
  display_order = EXCLUDED.display_order;

-- ============================================================================
-- 2. GHOST COHORTS (3 benchmark phantoms)
-- ============================================================================

INSERT INTO ghost_cohorts (key, name, emoji, weekly_energy_target, description, display_order) VALUES
  ('cozy',    'Cozy Cohort',    '🛋️', 55,  'A laid-back pace. Great if your team is just warming up.', 10),
  ('steady',  'Steady Cohort',  '⛵',  95,  'A solid, consistent rhythm. The most popular pick.',       20),
  ('awesome', 'Awesome Cohort', '🚀', 140, 'A stretch goal. For teams ready to push hard.',            30)
ON CONFLICT (key) DO UPDATE SET
  name                  = EXCLUDED.name,
  emoji                 = EXCLUDED.emoji,
  weekly_energy_target  = EXCLUDED.weekly_energy_target,
  description           = EXCLUDED.description,
  display_order         = EXCLUDED.display_order;

-- ============================================================================
-- 3. FEATURE FLAG REGISTRATION
-- ============================================================================
-- Cohorts is available to foundation_ai and vip tiers; free / foundation see a
-- locked Teams card preview.

INSERT INTO features (id, name, description, category, icon, display_order, is_active, preview_available)
VALUES (
  'cohorts',
  'Cohorts',
  'Practice together with friends. Earn shared Team Energy stars and send curated stickers - no chat, no DMs.',
  'premium',
  '☄️',
  260,
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name              = EXCLUDED.name,
  description       = EXCLUDED.description,
  category          = EXCLUDED.category,
  icon              = EXCLUDED.icon,
  preview_available = EXCLUDED.preview_available,
  updated_at        = NOW();

INSERT INTO feature_tier_mappings (feature_id, tier_id, is_enabled)
VALUES
  ('cohorts', 'foundation_ai', true),
  ('cohorts', 'vip',           true)
ON CONFLICT (feature_id, tier_id) DO UPDATE SET
  is_enabled = true,
  updated_at = NOW();

-- ============================================================================
-- 4. BACKFILL daily_effort_stars FOR ACTIVE CHILDREN (last 14 days)
-- ============================================================================
-- Populates the cache for the past 2 weeks so the Past-Me Pacer and trend
-- detection have data to read on day one. Runs upsert_daily_effort_stars()
-- which is idempotent. Active = at least one practice_session in last 60 days.

DO $$
DECLARE
  v_child UUID;
  v_date  DATE;
BEGIN
  FOR v_child IN
    SELECT DISTINCT child_id
    FROM practice_sessions
    WHERE created_at >= NOW() - INTERVAL '60 days'
  LOOP
    FOR v_date IN
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '14 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date
    LOOP
      PERFORM upsert_daily_effort_stars(v_child, v_date);
    END LOOP;
  END LOOP;
END $$;
