/**
 * WeeklyCheck (Flow 6, METHODOLOGY Step 9) — Form A dressed as "the last page
 * of the week", never an exam. Ms. Wren states the two honest differences
 * (comments held; strategy-card-only anchor). Submission goes to the
 * bb_score_mastery_check RPC — the platform computes the score (Ms. Wren can
 * never alter it), applies DD1 + LS1-R5, and routes on the machine:
 * ≥85% (and week-stable) → WeekResolve; otherwise → StrengthenPlan.
 * No other outcome states exist.
 */

import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { COPY, MODULE_COPY } from '../copy';
import { getPackDay } from '../generator/packGenerator';
import {
  recordItemAttempt,
  scoreMasteryCheck,
  transitionWeekState,
  updateDayProgress,
  type MasteryAnswerInput,
} from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import CheckRunner from '../components/CheckRunner';

export default function WeeklyCheck() {
  const navigate = useNavigate();
  const { loading, enrollment, weekState, pack, band, childId, refreshWeekState } = useFoundrySession();
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failedSubmit, setFailedSubmit] = useState(false);
  const transitioned = useRef(false);

  // Form A is served from the mastery_check state; entering the screen from
  // in_week performs the legal DD1 edge once (Form A is served exactly once).
  useEffect(() => {
    if (!weekState || transitioned.current) return;
    if (weekState.state === 'in_week') {
      transitioned.current = true;
      void transitionWeekState(weekState, 'mastery_check').then(() => refreshWeekState());
    }
  }, [weekState, refreshWeekState]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;
  // Route guard: the check only exists while the week is being checked.
  if (weekState.state === 'passed' || weekState.state === 'fast_track') {
    return <Navigate to="/foundry/resolve" replace />;
  }
  if (weekState.state !== 'in_week' && weekState.state !== 'mastery_check') {
    return <Navigate to="/foundry/hub" replace />;
  }

  const items = pack.masteryCheck.formA;

  async function submit(answers: MasteryAnswerInput[]) {
    if (!weekState || !pack) return;
    setSubmitting(true);
    try {
      const result = await scoreMasteryCheck(weekState, 'A', answers, pack.parentSummarySeed);
      // Day-5 tile: done only when the puzzle also closed (dual-strand law, E26).
      const day5 = weekState.dayProgress['5'];
      const puzzleDone = day5?.completedItemIds?.includes(pack.puzzle.id) ?? false;
      const day5Items = getPackDay(pack, 5).items.map((i) => i.id);
      await updateDayProgress(weekState, '5', {
        ...day5,
        state: puzzleDone ? 'done' : 'partial',
        completedItemIds: Array.from(new Set([...(day5?.completedItemIds ?? []), ...day5Items])),
        ...(puzzleDone ? { completedAt: new Date().toISOString() } : {}),
      });
      await refreshWeekState();
      if (result.state === 'passed') {
        navigate('/foundry/resolve', { replace: true, state: { justResolved: true } });
      } else {
        navigate('/foundry/strengthen', { replace: true, state: { entry: 'cycle1' } });
      }
    } catch (e) {
      console.error('[bb] mastery scoring failed', e);
      // Offline / transient failure: answers stand locally; warm defer (E12 law).
      setFailedSubmit(true);
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <div className="flex min-h-[70vh] flex-col justify-center gap-6">
        <WrenBubble band={band} text={MODULE_COPY.checkTallying[band]} emotion="settled" />
      </div>
    );
  }

  if (failedSubmit) {
    return (
      <div className="flex min-h-[70vh] flex-col justify-center gap-6">
        <WrenBubble band={band} autoplay text={COPY.offlineTally[band]} emotion="settled" />
        <button
          type="button"
          onClick={() => navigate('/foundry/hub', { replace: true })}
          className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover touch-manipulation"
        >
          Back to my week
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex min-h-[70vh] flex-col justify-center gap-6">
        <WrenBubble band={band} autoplay text={COPY.checkFraming[band]} emotion="warm" />
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="min-h-[64px] rounded-2xl bg-primary px-8 text-xl font-semibold text-white shadow-lg hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          Last page — let's go
        </button>
      </div>
    );
  }

  return (
    <CheckRunner
      pack={pack}
      items={items}
      band={band}
      storageKey={`bb-check-A-${pack.packId}`}
      headerLabel="Last page of the week"
      onItemAnswered={(item, answer, correct, errorTag) => {
        void recordItemAttempt({
          childId,
          packId: pack.packId,
          itemId: item.id,
          answer,
          correct,
          hintRungsUsed: 0,
          attemptNo: 1,
          day: 5,
          errorTag,
        });
      }}
      onComplete={(answers) => void submit(answers)}
    />
  );
}
