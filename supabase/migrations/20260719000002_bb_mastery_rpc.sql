-- Best Brains-inspired module — increment 4: server-side mastery scoring
--
-- The client can never write a verdict. This migration:
--   1. bb_score_mastery_check(...) SECURITY DEFINER RPC — recomputes the
--      percent from the submitted answer sheet, applies DD1 (85% gate, 95%
--      fast-track, 2-cycle escalation) + the LS1-R5 week-stability rule,
--      appends the mastery JSONB attempt, performs the bb_week_state
--      transition, and upserts the weekly bb_parent_reports row (E102
--      four-field frame; verdict + % parent-only, P6).
--   2. A BEFORE UPDATE guard trigger on bb_week_state making verdict-state
--      transitions and mastery JSONB writes RPC-only: without the
--      transaction-local 'bb.rpc' flag (set only inside the RPC), a client
--      may only walk not_started→in_week→mastery_check. This is the honest
--      enforcement path given the house RLS pattern (parents legitimately
--      hold UPDATE on their children's rows for day_progress).
--   3. bb_parent_reports hardening: report rows are written by the RPC only
--      (INSERT policy dropped + privilege revoked); the parent's only write
--      is the acknowledge tap (column-level UPDATE grant on acknowledged_at).
--
-- HONEST LIMIT (documented in BUILD-NOTES): per-item `correct` flags are
-- client-asserted — packs regenerate deterministically client-side and items
-- are never stored server-side, so the server cannot re-derive answers.
-- What the RPC owns outright: aggregation, thresholds, stability, the DD1
-- routing, the state write, and the parent report. A forged answer sheet
-- could inflate item flags but can never skip states, alter thresholds, or
-- self-award `passed` outside the machine.

-- ============================================================================
-- 1. Guard trigger — verdict states + mastery JSONB are RPC-only
-- ============================================================================

CREATE OR REPLACE FUNCTION bb_week_state_guard() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  -- The RPC (and deliberate maintenance in the same transaction) sets this.
  IF COALESCE(current_setting('bb.rpc', true), '') = 'on' THEN
    RETURN NEW;
  END IF;
  IF NEW.state IS DISTINCT FROM OLD.state THEN
    -- Client-legal edges only (DD1: the walk INTO the check; verdicts are computed).
    IF NOT ((OLD.state = 'not_started' AND NEW.state = 'in_week')
         OR (OLD.state = 'in_week' AND NEW.state = 'mastery_check')) THEN
      RAISE EXCEPTION 'bb_week_state transition % -> % is RPC-only (bb_score_mastery_check)',
        OLD.state, NEW.state;
    END IF;
  END IF;
  IF NEW.mastery IS DISTINCT FROM OLD.mastery THEN
    RAISE EXCEPTION 'bb_week_state.mastery is RPC-only (bb_score_mastery_check)';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_bb_week_state_guard ON bb_week_state;
CREATE TRIGGER trg_bb_week_state_guard BEFORE UPDATE ON bb_week_state
  FOR EACH ROW EXECUTE FUNCTION bb_week_state_guard();

-- ============================================================================
-- 2. The scoring RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION bb_score_mastery_check(
  p_child_id     uuid,
  p_level        text,
  p_week         integer,
  p_form         text,
  p_answers      jsonb,   -- [{itemId, answer, correct, errorTag}]
  p_summary_seed jsonb    -- the pack's parentSummarySeed (E102 seed)
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  -- Constants mirror frontend/src/modules/best-brains/constants.ts — keep in sync.
  c_threshold  CONSTANT numeric := 85;  -- MASTERY_THRESHOLD_PCT (DD1)
  c_fast       CONSTANT numeric := 95;  -- FAST_TRACK_PCT (DD1)
  c_stability  CONSTANT numeric := 75;  -- STABILITY_MIN_PCT (LS1-R5 "materially below 80")
  v_row            bb_week_state%ROWTYPE;
  v_total          integer;
  v_correct        integer;
  v_pct            numeric;
  v_stable         boolean := true;
  v_stability_hold boolean := false;
  v_new_state      text;
  v_cycle          integer;
  v_verdict        text;
  v_tags           text[];
  v_now_iso        text := to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
  v_attempt        jsonb;
  v_mastery        jsonb;
  v_pack_id        text;
  v_entry          jsonb;
  v_acc            numeric;
  v_improving      text;
  v_strengthen     text;
  v_teacher        text;
  v_narrative      jsonb;
  d                integer;
BEGIN
  -- SECURITY DEFINER bypasses RLS: ownership is checked explicitly.
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'bb_score_mastery_check: not authenticated';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM children c WHERE c.id = p_child_id AND c.user_id = auth.uid()) THEN
    RAISE EXCEPTION 'bb_score_mastery_check: child not owned by caller';
  END IF;
  IF p_form NOT IN ('A', 'B') THEN
    RAISE EXCEPTION 'bb_score_mastery_check: invalid form %', p_form;
  END IF;
  v_total := COALESCE(jsonb_array_length(p_answers), 0);
  IF v_total < 1 OR v_total > 20 THEN
    RAISE EXCEPTION 'bb_score_mastery_check: answer sheet size % out of range', v_total;
  END IF;

  SELECT * INTO v_row FROM bb_week_state
    WHERE child_id = p_child_id AND level = p_level AND week = p_week
    FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'bb_score_mastery_check: no week state for %/%', p_level, p_week;
  END IF;

  -- The DD1 machine is the only state space: forms are scoreable only from
  -- their legal states (Form A once; Form B once per corrective cycle).
  IF p_form = 'A' AND v_row.state NOT IN ('in_week', 'mastery_check') THEN
    RAISE EXCEPTION 'bb_score_mastery_check: Form A cannot be scored from state %', v_row.state;
  END IF;
  IF p_form = 'B' AND v_row.state NOT IN ('near_miss_cycle1', 'cycle2') THEN
    RAISE EXCEPTION 'bb_score_mastery_check: Form B cannot be scored from state %', v_row.state;
  END IF;

  -- Server-side percent (the client's own tally is never trusted).
  SELECT count(*) FILTER (WHERE (e->>'correct')::boolean)
    INTO v_correct
    FROM jsonb_array_elements(p_answers) e;
  v_pct := round(100.0 * v_correct / v_total);

  -- Dominant DD7 tags among misses (top 2) — select the micro-reteach.
  SELECT array_agg(tag) INTO v_tags FROM (
    SELECT e->>'errorTag' AS tag, count(*) AS n
      FROM jsonb_array_elements(p_answers) e
      WHERE NOT (e->>'correct')::boolean AND e->>'errorTag' IS NOT NULL
      GROUP BY 1 ORDER BY n DESC, tag LIMIT 2
  ) t;

  -- LS1-R5 (DD1.1) week-stability, Form A only: advance requires the check
  -- AND no completed independent practice day (2–4; Day 1 is instructional)
  -- materially below 80% — implemented as first-attempt accuracy < 75.
  -- Prefers day_progress.accuracyPct; legacy rows derive from bb_item_attempts
  -- (first attempts, >=3 graded rows so tiny samples never veto).
  IF p_form = 'A' THEN
    v_pack_id := 'MFM-' || p_level || p_week::text;
    FOR d IN 2..4 LOOP
      v_acc := NULL;
      v_entry := v_row.day_progress -> d::text;
      IF v_entry IS NOT NULL AND v_entry->>'state' = 'done' THEN
        IF v_entry ? 'accuracyPct' THEN
          v_acc := (v_entry->>'accuracyPct')::numeric;
        ELSE
          SELECT CASE WHEN count(*) >= 3
                      THEN round(100.0 * count(*) FILTER (WHERE a.correct) / count(*))
                 END
            INTO v_acc
            FROM bb_item_attempts a
            WHERE a.child_id = p_child_id AND a.pack_id = v_pack_id
              AND a.day = d AND a.attempt_no = 1;
        END IF;
        IF v_acc IS NOT NULL AND v_acc < c_stability THEN
          v_stable := false;
        END IF;
      END IF;
    END LOOP;
  END IF;

  -- DD1 routing (METHODOLOGY §5 pseudocode, verbatim + LS1-R5).
  IF p_form = 'A' THEN
    v_cycle := 0;
    IF v_pct >= c_threshold AND v_stable THEN
      v_new_state := 'passed';
    ELSE
      v_new_state := 'near_miss_cycle1';
      v_stability_hold := (v_pct >= c_threshold AND NOT v_stable);
    END IF;
  ELSIF v_row.state = 'near_miss_cycle1' THEN
    v_cycle := 1;
    IF v_pct >= c_fast THEN v_new_state := 'fast_track';
    ELSIF v_pct >= c_threshold THEN v_new_state := 'passed';
    ELSE v_new_state := 'cycle2';
    END IF;
  ELSE
    v_cycle := 2;
    IF v_pct >= c_threshold THEN v_new_state := 'passed';
    ELSE v_new_state := 'escalated';
    END IF;
  END IF;

  -- Mastery JSONB (WeekMasteryRecord shape).
  v_attempt := jsonb_build_object(
    'form', p_form,
    'cycle', v_cycle,
    'scorePct', v_pct,
    'attemptedAt', v_now_iso,
    'dominantErrorTags', COALESCE(to_jsonb(v_tags), '[]'::jsonb),
    'stabilityHold', v_stability_hold
  );
  v_mastery := COALESCE(v_row.mastery, '{"attempts": []}'::jsonb);
  v_mastery := jsonb_set(v_mastery, '{attempts}',
                         COALESCE(v_mastery->'attempts', '[]'::jsonb) || v_attempt);
  IF v_new_state IN ('passed', 'fast_track') THEN
    v_mastery := v_mastery || jsonb_build_object('finalScorePct', v_pct);
  ELSIF v_new_state = 'escalated' THEN
    v_mastery := v_mastery
      || jsonb_build_object('escalatedAt', v_now_iso, 'placementRecheckRequested', true);
  END IF;

  -- The one write path the guard trigger admits.
  PERFORM set_config('bb.rpc', 'on', true);
  UPDATE bb_week_state SET
    state = v_new_state,
    mastery = v_mastery,
    completed_at = CASE WHEN v_new_state IN ('passed', 'fast_track') THEN now() ELSE completed_at END
  WHERE id = v_row.id;
  PERFORM set_config('bb.rpc', '', true);

  v_verdict := CASE WHEN v_new_state IN ('passed', 'fast_track') THEN 'passed'
                    WHEN v_new_state = 'escalated' THEN 'escalated'
                    ELSE 'one_more_round' END;

  -- E102 four-field narrative from the seed + computed fields ("Review" never
  -- rendered; % lives in the percent column, parent-only).
  v_improving := COALESCE(p_summary_seed->'improvingCandidates'->>0,
                          'Steady, careful work this week.');
  SELECT s->>'text' INTO v_strengthen
    FROM jsonb_array_elements(COALESCE(p_summary_seed->'strengtheningByTag', '[]'::jsonb)) s
    WHERE s->>'errorTag' = COALESCE(v_tags[1], '')
    LIMIT 1;
  IF v_strengthen IS NULL THEN
    v_strengthen := CASE WHEN v_verdict = 'passed'
      THEN 'Nothing specific needs strengthening this week — we keep building on solid ground.'
      ELSE COALESCE(p_summary_seed->'strengtheningByTag'->0->>'text',
                    'One step is still settling; we are strengthening it with a short reteach and brand-new problems.')
      END;
  END IF;
  v_teacher := CASE v_verdict
    WHEN 'passed' THEN
      'The weekly check confirmed it: this concept is solid, and it now joins the warm-up rotation so it stays that way.'
    WHEN 'one_more_round' THEN
      'The check showed one step still settling, so we run one more round: a short reteach, then brand-new problems. Everything else keeps moving.'
    ELSE
      'After two strengthening rounds, a teacher from our team is stepping in and we are re-checking the starting point. That is the system working as designed.'
    END;
  v_narrative := jsonb_build_object(
    'whatWeWorkedOn', COALESCE(p_summary_seed->>'whatWeWorkedOn', ''),
    'improving', v_improving,
    'strengthening', v_strengthen,
    'homeFocus', COALESCE(p_summary_seed->'homeFocus', '{}'::jsonb),
    'teacherNarrative', v_teacher
  );

  -- Weekly report row (unique per child/level/week): later corrective
  -- outcomes refresh it; the acknowledge stamp is preserved.
  INSERT INTO bb_parent_reports (child_id, level, week, narrative, verdict, percent)
  VALUES (p_child_id, p_level, p_week, v_narrative, v_verdict, v_pct::integer)
  ON CONFLICT (child_id, level, week) DO UPDATE
    SET narrative = EXCLUDED.narrative,
        verdict   = EXCLUDED.verdict,
        percent   = EXCLUDED.percent;

  RETURN jsonb_build_object(
    'state', v_new_state,
    'score_pct', v_pct,
    'verdict', v_verdict,
    'stability_hold', v_stability_hold
  );
END $$;

REVOKE ALL ON FUNCTION bb_score_mastery_check(uuid, text, integer, text, jsonb, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION bb_score_mastery_check(uuid, text, integer, text, jsonb, jsonb) TO authenticated;

-- ============================================================================
-- 3. bb_parent_reports hardening — reports are RPC-written; the parent's only
--    write is the acknowledge tap (E15 ritual)
-- ============================================================================

DROP POLICY IF EXISTS "Parents can insert own children bb_parent_reports" ON bb_parent_reports;
REVOKE INSERT ON bb_parent_reports FROM authenticated, anon;
REVOKE UPDATE ON bb_parent_reports FROM authenticated, anon;
GRANT UPDATE (acknowledged_at) ON bb_parent_reports TO authenticated;

-- ============================================================================
-- 4. Comments
-- ============================================================================

COMMENT ON FUNCTION bb_score_mastery_check(uuid, text, integer, text, jsonb, jsonb) IS
  'Server-side weekly mastery scoring (DD1 + LS1-R5). The only path into verdict states (guard trigger enforces); assembles the weekly parent report (E102). Thresholds mirror best-brains constants.ts: pass 85, fast-track 95, stability 75.';
COMMENT ON FUNCTION bb_week_state_guard() IS
  'RPC-only enforcement for bb_week_state: without the transaction-local bb.rpc flag, clients may only transition not_started->in_week->mastery_check and may never write mastery JSONB. Maintenance edits require SELECT set_config(''bb.rpc'',''on'',true) in the same transaction.';
