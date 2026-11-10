-- A Kumon sheet moves on only when it is passed: first try AND speed (ruling R1,
-- 2026-11-10, docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md).
--
-- WHY. Every finished sheet advanced. worksheet_progress kept a "completed" label
-- computed as 80% of FINAL answers (retries included) out of a total that counted
-- a reloaded page twice (10/13, 10/14, 10/15 on ten-problem sheets), and kept only
-- the latest time. Re-scored under the new rule, one child's C15-C55 sittings
-- would have repeated 32 times out of 42. The record now carries what the rule
-- reads and what the parent page shows:
--
--   first_try_correct  right on the first check with no help, latest sitting
--   problems_total     problems in the latest sitting
--   sittings           every sitting and parent move, oldest first (JSON objects
--                      shaped by frontend/src/services/sheetPass.ts SheetEvent):
--                      { kind: 'sitting', at, outcome: pass|repeat|moved_on,
--                        tryNumber, problems, firstTry, seconds, sctSeconds,
--                        timeRatio, focusScore, reasons, sessionId }
--                      { kind: 'parent', at, outcome: parent_move_on|parent_repeat|
--                        parent_go_back, from, to }
--
-- avg_focus_score already existed and is now written. Nothing is back-filled: the
-- rule starts from the next sheet. status keeps its CHECK; 'completed' now means
-- passed. Additive only — every existing reader is unaffected.

ALTER TABLE public.worksheet_progress
  ADD COLUMN IF NOT EXISTS first_try_correct integer,
  ADD COLUMN IF NOT EXISTS problems_total integer,
  ADD COLUMN IF NOT EXISTS sittings jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.worksheet_progress
  DROP CONSTRAINT IF EXISTS worksheet_progress_sittings_is_array;
ALTER TABLE public.worksheet_progress
  ADD CONSTRAINT worksheet_progress_sittings_is_array CHECK (jsonb_typeof(sittings) = 'array');

COMMENT ON COLUMN public.worksheet_progress.sittings IS
  'Every sitting and parent move on this sheet, oldest first (frontend/src/services/sheetPass.ts SheetEvent). 2026-11-10.';
COMMENT ON COLUMN public.worksheet_progress.first_try_correct IS
  'Right on the first check with no help, in the latest sitting. 2026-11-10.';
COMMENT ON COLUMN public.worksheet_progress.problems_total IS
  'Problems in the latest sitting. 2026-11-10.';
