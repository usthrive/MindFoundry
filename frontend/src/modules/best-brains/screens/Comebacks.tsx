/**
 * Comebacks (2026-10-15) — before a practice day's warm-up, up to two questions
 * he missed on an earlier week's check come back, with new numbers
 * (../session/comebacks.ts). The first try has no help showing; a miss opens the
 * guiding steps one at a time, then the answer with its reasoning — the review's
 * own component (CheckReview, when="comeback").
 *
 * Every day opens through here; when nothing is due — or the ledger cannot load —
 * it forwards straight to the warm-up, so it can never block a day. The list is
 * fixed when the screen opens: an answer moves its entry's due date, and the
 * screen must not re-serve or drop questions under the child mid-way.
 *
 * Each answer is logged under the ORIGIN week's pack, day null, no error tag (a
 * comeback slip must not feed this week's miss patterns or its stability rule).
 * attempt_no 1 is the unaided first try — the only answer the schedule reads.
 */
import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import CheckReview from '../components/CheckReview';
import { recordItemAttempt } from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import { isDayActionable } from '../session/weekLogic';
import { dueComebacks, parseComebackId } from '../session/comebacks';
import { questionsFor, useComebacks } from '../session/useComebacks';

export default function Comebacks() {
  const navigate = useNavigate();
  const params = useParams<{ day: string }>();
  const day = Number(params.day);
  const { loading, enrollment, weekState, band, childId } = useFoundrySession();
  const { ready, ledger, rows, weeks } = useComebacks(childId, enrollment?.level);
  // Fixed once the ledger is in (see the header).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo(() => (ready ? questionsFor(dueComebacks(ledger, rows), weeks) : null), [ready]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !Number.isInteger(day) || day < 2 || day > 5) {
    return <Navigate to="/foundry" replace />;
  }
  if (!isDayActionable(weekState.dayProgress, day)) return <Navigate to="/foundry/hub" replace />;
  const onward = `/foundry/day/${day}/warmup`;
  if (questions === null) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (questions.length === 0) return <Navigate to={onward} replace />;

  return (
    <CheckReview
      misses={questions.map((q) => ({ item: q.item, answer: '' }))}
      band={band}
      when="comeback"
      onReAnswer={(item, answer, correct, stepsShown) => {
        const cb = parseComebackId(item.id);
        if (!cb) return;
        void recordItemAttempt({
          childId,
          packId: `MFM-${cb.level}${cb.week}`,
          itemId: item.id,
          answer,
          correct,
          hintRungsUsed: stepsShown,
          attemptNo: stepsShown + 1,
          day: null,
        });
      }}
      onDone={() => navigate(onward, { replace: true })}
    />
  );
}
