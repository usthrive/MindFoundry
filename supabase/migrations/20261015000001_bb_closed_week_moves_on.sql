-- After the second re-check misses, the week closes and the child moves on
-- (owner ruling, 2026-10-15). The parent report stops promising a teacher.
--
-- WHY. A cycle-2 Form B below the bar sets the week to 'escalated'. The report
-- this function writes then told the parent: "After two strengthening rounds, a
-- teacher from our team is stepping in and we are re-checking the starting
-- point." Neither existed. No teacher was ever notified, no re-check flow was
-- ever built (`placementRecheckRequested` has no reader), and no code ever left
-- 'escalated' — so the week stayed open forever with every day tile green and no
-- button forward. The owner asked what happens after the teacher step; the
-- answer was nothing.
--
-- The ruling: the week closes and the child keeps moving — the hub opens the next
-- week the day after, exactly as for a passed week — and every question missed
-- on any check comes back as a warm-up with new numbers, 2 days, 7 days, then 21
-- days apart, until it is right three times in a row without help
-- (frontend/src/modules/best-brains/session/comebacks.ts). The state stays
-- 'escalated' and the verdict 'escalated' (parent label "Moved on · practice
-- continues"): the routing, the guard trigger and the report's CHECK constraint
-- are untouched. Only the sentence the parent reads changes.
--
-- HOW. Patched in place, as 20260810000001 did for the threshold: re-pasting the
-- ~200-line function would risk drift by transcription. The occurrence count is
-- asserted first; a migration that silently changes nothing raises instead.

DO $mig$
DECLARE
  d text;
  n int;
  old_text constant text := 'After two strengthening rounds, a teacher from our team is stepping in and we are re-checking the starting point. That is the system working as designed.';
  new_text constant text := 'After two practice rounds the week closes, so your child keeps moving. The questions still missed come back as warm-ups with new numbers - in two days, a week, then three weeks - until they are right each time without help. Your child''''s home screen shows what to work on together.';
BEGIN
  SELECT pg_get_functiondef(p.oid) INTO d
    FROM pg_proc p JOIN pg_namespace ns ON ns.oid = p.pronamespace
   WHERE p.proname = 'bb_score_mastery_check' AND ns.nspname = 'public';

  IF d IS NULL THEN
    RAISE EXCEPTION 'bb_score_mastery_check not found';
  END IF;

  n := (length(d) - length(replace(d, old_text, ''))) / length(old_text);

  IF n = 0 AND position('the week closes, so your child keeps moving' IN d) > 0 THEN
    RAISE NOTICE 'closed-week narrative already migrated; nothing to do';
    RETURN;
  ELSIF n <> 1 THEN
    RAISE EXCEPTION 'expected exactly 1 occurrence of the teacher narrative, found %', n;
  END IF;

  EXECUTE replace(d, old_text, new_text);
END
$mig$;
