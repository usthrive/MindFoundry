-- Ms. Wren reads the explanation — storage for the AI review of manual-review
-- items (owner ruling 2026-09-22, option (a): grade and coach).
--
-- WHY THIS MIGRATION CARRIES TWO TABLES.
--
--   * bb_explanation_reviews is the new one: one row per reading, holding the
--     child's own words, the verdict, the line the child was given, and the
--     parent-facing reason. The weekly report reads it ("In their own words").
--     FORMATIVE ONLY — nothing here is read by mastery scoring, by the day's
--     accuracy, or by the DD1 gate; `checkAnswer` still returns
--     {correct: true, ungraded: true} for every one of these items.
--
--   * ai_usage_log is NOT new: `supabase/functions/ai-service/index.ts` has
--     been writing to it since the function shipped and NO MIGRATION EVER
--     CREATED IT. Every one of those inserts has been failing into a
--     console.error in a fire-and-forget .then(), so the cost telemetry the
--     function believes it keeps does not exist. It is created here, IF NOT
--     EXISTS, with exactly the columns the function already writes, because
--     this is the first operation whose cost anyone will want to look at.
--
-- Additive-only: no existing object is altered.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. ai_usage_log — the cost ledger the edge function already writes to
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_usage_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id      UUID REFERENCES children(id) ON DELETE CASCADE,
  feature       TEXT,
  model         TEXT,
  input_tokens  INTEGER,
  output_tokens INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_log_child_created
  ON ai_usage_log(child_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_log_feature_created
  ON ai_usage_log(feature, created_at DESC);

-- Service role only: this is an operator's cost ledger, not a parent surface.
-- RLS on with NO policies means no client role can read or write it, while the
-- service-role key the edge function uses bypasses RLS as it always has.
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ai_usage_log IS
  'Per-call AI cost ledger written by the ai-service edge function (fire-and-forget). Service role only — RLS is on with no policies. Created 2026-09-22; the function had been writing to a table that did not exist.';

-- ============================================================================
-- 2. bb_explanation_reviews — one row per reading of a child's explanation
-- ============================================================================

CREATE TABLE IF NOT EXISTS bb_explanation_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  -- Pack address, e.g. 'MFM-B3' (the same scheme bb_item_attempts uses).
  pack_id       TEXT NOT NULL,
  -- Item content id, e.g. 'B3-D5-02'.
  item_id       TEXT NOT NULL,
  -- 1-5 for daily work; NULL where the surface has no day.
  day           INTEGER CHECK (day BETWEEN 1 AND 5),
  -- The child's own words, capped client- and function-side at 500 chars.
  child_text    TEXT,
  verdict       TEXT NOT NULL CHECK (verdict IN ('got-it','partly','not-yet')),
  -- What Ms. Wren said to the child, and the one question that followed it.
  line          TEXT NOT NULL,
  nudge         TEXT,
  -- Parent-facing, <=120 chars, NEVER rendered on a child surface.
  reason        TEXT,
  model         TEXT,
  input_tokens  INTEGER,
  output_tokens INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- (child_id, created_at) serves both readers: the parent report's per-child
-- listing and the edge function's per-day quota count.
CREATE INDEX IF NOT EXISTS idx_bb_explanation_reviews_child_created
  ON bb_explanation_reviews(child_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bb_explanation_reviews_child_pack
  ON bb_explanation_reviews(child_id, pack_id);

-- ============================================================================
-- 3. Row Level Security — house child->parent ownership pattern
-- ============================================================================
--
-- SELECT only. Rows are written by the edge function under the service role
-- (which bypasses RLS), so there is deliberately no INSERT or UPDATE policy:
-- a verdict a client could write is not a verdict. DELETE is granted for the
-- same reason bb_item_attempts has it — the P12 data-deletion flow.

ALTER TABLE bb_explanation_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view own children bb_explanation_reviews" ON bb_explanation_reviews;
CREATE POLICY "Parents can view own children bb_explanation_reviews" ON bb_explanation_reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_explanation_reviews.child_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Parents can delete own children bb_explanation_reviews" ON bb_explanation_reviews;
CREATE POLICY "Parents can delete own children bb_explanation_reviews" ON bb_explanation_reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children c WHERE c.id = bb_explanation_reviews.child_id AND c.user_id = auth.uid())
  );

-- ============================================================================
-- 4. Comments
-- ============================================================================

COMMENT ON TABLE bb_explanation_reviews IS
  'Ms. Wren''s reading of a band B/C manual-review explanation (owner ruling 2026-09-22, option (a)). Formative only: never read by mastery scoring, the day''s accuracy, or the DD1 weekly gate. Written by the ai-service edge function under the service role; parents read their own child''s rows.';
COMMENT ON COLUMN bb_explanation_reviews.verdict IS
  'got-it / partly / not-yet. Rendered to the parent as "Got it" / "Getting there" / "Not yet"; the child sees the line, never the label.';
COMMENT ON COLUMN bb_explanation_reviews.reason IS
  'Parent-facing note, at most 120 chars. Never shown on a child surface (P6 spirit: the child gets the teaching, the parent gets the diagnosis).';
COMMENT ON COLUMN bb_explanation_reviews.child_text IS
  'The child''s own words as submitted, capped at 500 chars. The literal "said-aloud" never reaches this table — that path skips the review entirely.';
