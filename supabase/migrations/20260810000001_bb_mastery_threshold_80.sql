-- Mastery pass threshold 85 -> 80 (owner ruling, 2026-08-10).
--
-- WHY. 85% over a SIX-item mastery form demanded a perfect score: 5/6 is 83.3%,
-- which failed. Every level ships 6-item forms, so the effective bar was 6/6 on
-- all 120 cells — a four-year-old who slipped once in six was told he had not
-- mastered the week — and `c_fast` (95) was unreachable as a DISTINCT tier,
-- because 6/6 already cleared it. At 80 the tiers separate as designed:
--   5/6 = 83.3% -> passed
--   6/6 = 100%  -> fast_track
--
-- This was found by an independent reader evaluation reading the arithmetic of
-- the threshold against the form LENGTH. A percentage bar only expresses what
-- the form length can represent; check both together whenever either moves.
--
-- HOW. The constant is patched in place programmatically rather than by
-- re-pasting ~200 lines of routing, stability and narrative logic, so no part of
-- the function can drift by transcription error. The occurrence count is
-- asserted first: a migration that silently changes nothing is the worst
-- outcome, so this raises rather than no-ops if the constant is ever moved or
-- reformatted.
--
-- PAIRED WITH: frontend/src/modules/best-brains/constants.ts
-- (MASTERY_THRESHOLD 0.80 / MASTERY_THRESHOLD_PCT 80). The RPC is the
-- authoritative half — the client tally is never trusted — so both must move
-- together. Applied to the live project on 2026-08-10 and verified:
-- threshold 80, c_fast 95, c_stability 75 unchanged.

DO $mig$
DECLARE
  d text;
  n int;
BEGIN
  SELECT pg_get_functiondef(p.oid) INTO d
    FROM pg_proc p JOIN pg_namespace ns ON ns.oid = p.pronamespace
   WHERE p.proname = 'bb_score_mastery_check' AND ns.nspname = 'public';

  IF d IS NULL THEN
    RAISE EXCEPTION 'bb_score_mastery_check not found';
  END IF;

  n := (length(d) - length(replace(d, 'c_threshold  CONSTANT numeric := 85;', '')))
       / length('c_threshold  CONSTANT numeric := 85;');

  IF n = 0 THEN
    RAISE NOTICE 'threshold already migrated; nothing to do';
    RETURN;
  ELSIF n <> 1 THEN
    RAISE EXCEPTION 'expected exactly 1 occurrence of the threshold constant, found %', n;
  END IF;

  d := replace(d,
    'c_threshold  CONSTANT numeric := 85;  -- MASTERY_THRESHOLD_PCT (DD1)',
    'c_threshold  CONSTANT numeric := 80;  -- MASTERY_THRESHOLD_PCT (DD1; 85->80 2026-08-10, see migration)');

  EXECUTE d;
END
$mig$;
