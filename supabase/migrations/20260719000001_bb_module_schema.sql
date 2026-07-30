-- Best Brains-inspired module ("Foundry Method", module id `best-brains`) — increment 1 schema
-- Additive-only: all objects are new and bb_-prefixed; no existing table is touched.
--
-- Data model law:
--   * WeeklyConceptPacks are NOT stored server-side. Packs regenerate
--     deterministically from (level, week, pack_seed, content_version) via the
--     seeded template registry (QUESTION-GENERATOR-SPEC §3.1). The DB stores only
--     the seed + pinned content_version (DD15 versioned content pointers).
--   * The week is the primary key of the curriculum graph (METHODOLOGY-MODEL §2):
--     all state keys on (child_id, level, week).
--   * bb_week_state.state is the DD1 mastery state machine — the ONLY mastery
--     state space. The platform computes transitions; nothing overrides the gate.
--   * RLS follows the house child→parent ownership pattern (children.user_id = auth.uid()).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. bb_enrollment — one row per enrolled child (current level + settings)
-- ============================================================================

CREATE TABLE IF NOT EXISTS bb_enrollment (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id          UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  level             TEXT NOT NULL CHECK (level IN ('A','B','C','D','E')),
  placed_at         TIMESTAMPTZ,
  -- PlacementResult JSONB: { placedLevel, entryWeek, clusterResults[], strengths[],
  --                          completedAt, isRecheck, endedBySafetyExit } (DD5)
  placement_result  JSONB,
  current_week      INTEGER NOT NULL DEFAULT 1 CHECK (current_week BETWEEN 1 AND 24),
  -- BBEnrollmentSettings JSONB incl. sprint_opt_out (DD11/P11), sessionLength
  -- (short/standard/full, hard-capped at 15 min), weekRevealDay, acceleratedMode.
  settings          JSONB NOT NULL DEFAULT '{"sprintOptOut": false, "sessionLength": "standard"}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id)
);

CREATE INDEX IF NOT EXISTS idx_bb_enrollment_child ON bb_enrollment(child_id);

-- ============================================================================
-- 2. bb_week_state — one row per (child, level, week) cycle; DD1 machine state
-- ============================================================================

CREATE TABLE IF NOT EXISTS bb_week_state (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id         UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  level            TEXT NOT NULL CHECK (level IN ('A','B','C','D','E')),
  week             INTEGER NOT NULL CHECK (week BETWEEN 1 AND 24),
  -- Deterministic pack regeneration seed; packs themselves are never stored.
  pack_seed        BIGINT NOT NULL,
  -- Pinned pack contentVersion for this learner (DD15 — a "wrong book" state is impossible).
  content_version  TEXT,
  -- DD1 mastery state machine (METHODOLOGY-MODEL §5). Legal transitions enforced app-side
  -- (frontend/src/modules/best-brains/constants.ts WEEK_STATE_TRANSITIONS).
  state            TEXT NOT NULL DEFAULT 'not_started' CHECK (state IN (
                     'not_started','in_week','mastery_check','passed',
                     'near_miss_cycle1','cycle2','escalated','fast_track')),
  -- DayProgress JSONB: keys "1".."5" -> { state: locked|today|partial|done,
  --                                       completedItemIds[], minutesSpent, completedAt }
  day_progress     JSONB NOT NULL DEFAULT '{}',
  -- WeekMasteryRecord JSONB: { attempts: [{form: A|B, cycle, scorePct, attemptedAt,
  --   dominantErrorTags[]}], finalScorePct, escalatedAt, placementRecheckRequested }
  mastery          JSONB NOT NULL DEFAULT '{"attempts": []}',
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, level, week)
);

CREATE INDEX IF NOT EXISTS idx_bb_week_state_child_level_week
  ON bb_week_state(child_id, level, week);
CREATE INDEX IF NOT EXISTS idx_bb_week_state_active
  ON bb_week_state(child_id) WHERE completed_at IS NULL;

-- ============================================================================
-- 3. bb_item_attempts — append-only item telemetry (hint depth, DD7 tags)
-- ============================================================================

CREATE TABLE IF NOT EXISTS bb_item_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  -- Pack address, e.g. 'MFM-A15' (level+week recoverable from the id).
  pack_id         TEXT NOT NULL,
  -- Item content id, e.g. 'A15-D3-06' (slots D1-D5, GE, PZ, FS, MA, MB).
  item_id         TEXT NOT NULL,
  answer          TEXT NOT NULL,
  correct         BOOLEAN NOT NULL,
  hint_rungs_used INTEGER NOT NULL DEFAULT 0 CHECK (hint_rungs_used BETWEEN 0 AND 3),
  attempt_no      INTEGER NOT NULL DEFAULT 1 CHECK (attempt_no >= 1),
  -- 1-5 for daily/Form-A work; NULL for Form B and sprint attempts.
  day             INTEGER CHECK (day BETWEEN 1 AND 5),
  -- Closed DD7 taxonomy; logged on diagnosable misses, feeds PatternsView + reteach selection.
  error_tag       TEXT CHECK (error_tag IN (
                    'fact-recall','procedure-slip','concept-misconception',
                    'representation-misread','task-comprehension')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bb_item_attempts_child_pack
  ON bb_item_attempts(child_id, pack_id);
CREATE INDEX IF NOT EXISTS idx_bb_item_attempts_child_created
  ON bb_item_attempts(child_id, created_at DESC);

-- ============================================================================
-- 4. bb_parent_reports — weekly narrative artifact + acknowledge ritual (DD6)
-- ============================================================================

CREATE TABLE IF NOT EXISTS bb_parent_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  level           TEXT NOT NULL CHECK (level IN ('A','B','C','D','E')),
  week            INTEGER NOT NULL CHECK (week BETWEEN 1 AND 24),
  -- ReportNarrative JSONB, the E102 4-field frame: { whatWeWorkedOn, improving,
  --   strengthening, homeFocus: {praiseLine, questionForChild, schoolSyncHook?},
  --   teacherNarrative }
  narrative       JSONB NOT NULL,
  -- Parent-facing labels: 'passed' / 'one_more_round' / 'escalated' ("Review" never rendered).
  verdict         TEXT NOT NULL CHECK (verdict IN ('passed','one_more_round','escalated')),
  -- Weekly-check % — appears exactly once, parent surface only (P6).
  percent         INTEGER NOT NULL CHECK (percent BETWEEN 0 AND 100),
  -- Acknowledge-tap timestamp (the sign-off ritual, E15); NULL until acknowledged.
  acknowledged_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, level, week)
);

CREATE INDEX IF NOT EXISTS idx_bb_parent_reports_child_level_week
  ON bb_parent_reports(child_id, level, week);
CREATE INDEX IF NOT EXISTS idx_bb_parent_reports_unacknowledged
  ON bb_parent_reports(child_id, created_at DESC) WHERE acknowledged_at IS NULL;

-- ============================================================================
-- 5. updated_at triggers (reuses existing update_updated_at_column())
-- ============================================================================

DROP TRIGGER IF EXISTS trg_bb_enrollment_updated_at ON bb_enrollment;
CREATE TRIGGER trg_bb_enrollment_updated_at BEFORE UPDATE ON bb_enrollment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_bb_week_state_updated_at ON bb_week_state;
CREATE TRIGGER trg_bb_week_state_updated_at BEFORE UPDATE ON bb_week_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_bb_parent_reports_updated_at ON bb_parent_reports;
CREATE TRIGGER trg_bb_parent_reports_updated_at BEFORE UPDATE ON bb_parent_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. Row Level Security — house child→parent ownership pattern
-- ============================================================================

ALTER TABLE bb_enrollment     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_week_state     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_item_attempts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bb_parent_reports ENABLE ROW LEVEL SECURITY;

-- ----- bb_enrollment -----
DROP POLICY IF EXISTS "Parents can view own children bb_enrollment" ON bb_enrollment;
CREATE POLICY "Parents can view own children bb_enrollment" ON bb_enrollment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_enrollment.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children bb_enrollment" ON bb_enrollment;
CREATE POLICY "Parents can insert own children bb_enrollment" ON bb_enrollment
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_enrollment.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children bb_enrollment" ON bb_enrollment;
CREATE POLICY "Parents can update own children bb_enrollment" ON bb_enrollment
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_enrollment.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children bb_enrollment" ON bb_enrollment;
CREATE POLICY "Parents can delete own children bb_enrollment" ON bb_enrollment
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_enrollment.child_id AND c.user_id = auth.uid())
  );

-- ----- bb_week_state -----
DROP POLICY IF EXISTS "Parents can view own children bb_week_state" ON bb_week_state;
CREATE POLICY "Parents can view own children bb_week_state" ON bb_week_state
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_week_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children bb_week_state" ON bb_week_state;
CREATE POLICY "Parents can insert own children bb_week_state" ON bb_week_state
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_week_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children bb_week_state" ON bb_week_state;
CREATE POLICY "Parents can update own children bb_week_state" ON bb_week_state
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_week_state.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children bb_week_state" ON bb_week_state;
CREATE POLICY "Parents can delete own children bb_week_state" ON bb_week_state
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_week_state.child_id AND c.user_id = auth.uid())
  );

-- ----- bb_item_attempts (append-only: no UPDATE policy; DELETE for the P12 data-deletion flow) -----
DROP POLICY IF EXISTS "Parents can view own children bb_item_attempts" ON bb_item_attempts;
CREATE POLICY "Parents can view own children bb_item_attempts" ON bb_item_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_item_attempts.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children bb_item_attempts" ON bb_item_attempts;
CREATE POLICY "Parents can insert own children bb_item_attempts" ON bb_item_attempts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_item_attempts.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children bb_item_attempts" ON bb_item_attempts;
CREATE POLICY "Parents can delete own children bb_item_attempts" ON bb_item_attempts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_item_attempts.child_id AND c.user_id = auth.uid())
  );

-- ----- bb_parent_reports (UPDATE = acknowledge tap; INSERT normally server-side) -----
DROP POLICY IF EXISTS "Parents can view own children bb_parent_reports" ON bb_parent_reports;
CREATE POLICY "Parents can view own children bb_parent_reports" ON bb_parent_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_parent_reports.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can insert own children bb_parent_reports" ON bb_parent_reports;
CREATE POLICY "Parents can insert own children bb_parent_reports" ON bb_parent_reports
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_parent_reports.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can update own children bb_parent_reports" ON bb_parent_reports;
CREATE POLICY "Parents can update own children bb_parent_reports" ON bb_parent_reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_parent_reports.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children bb_parent_reports" ON bb_parent_reports;
CREATE POLICY "Parents can delete own children bb_parent_reports" ON bb_parent_reports
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_parent_reports.child_id AND c.user_id = auth.uid())
  );

-- ============================================================================
-- 7. Comments
-- ============================================================================

COMMENT ON TABLE bb_enrollment IS
  'Foundry Method (best-brains module) enrollment: one row per child — placed level, current week, parent settings. Level codes A-E are the module''s own neutral ladder (DD2), unrelated to Kumon levels.';
COMMENT ON TABLE bb_week_state IS
  'One row per (child, level, week) concept-cycle. state = DD1 mastery state machine (85% gate, corrective loop, fast-track, escalation). Packs are NOT stored: they regenerate deterministically from pack_seed + content_version (QUESTION-GENERATOR-SPEC §3.1, DD15).';
COMMENT ON TABLE bb_item_attempts IS
  'Append-only per-item telemetry: answer, correctness, hint rungs used (0-3), DD7 error tag. Feeds mastery scoring, PatternsView, retrieval scheduling, and report generation.';
COMMENT ON TABLE bb_parent_reports IS
  'Weekly parent narrative artifact (DD6/E102 4-field frame) + acknowledge ritual. verdict: passed / one_more_round / escalated — the word "Review" is never rendered. Browsable history = the persistent learner profile (E85).';

COMMENT ON COLUMN bb_week_state.pack_seed IS
  'Deterministic regeneration seed for the week''s WeeklyConceptPack. Same (level, week, seed, content_version) reproduces the identical pack; the pack JSON is never persisted.';
COMMENT ON COLUMN bb_week_state.state IS
  'DD1 machine: not_started -> in_week -> mastery_check -> passed | near_miss_cycle1 -> (fast_track | passed | cycle2) -> (passed | escalated). No other mastery state space exists.';
COMMENT ON COLUMN bb_enrollment.settings IS
  'BBEnrollmentSettings JSONB: sprintOptOut (DD11), sessionLength short|standard|full (15-min hard cap), weekRevealDay, reportNotificationDay, acceleratedMode, personaVoiceEnabled, soundEffectsEnabled.';
COMMENT ON COLUMN bb_parent_reports.percent IS
  'Weekly-check percentage. Parent surface only; child surfaces never show % (P6).';
