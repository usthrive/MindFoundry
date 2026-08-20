/**
 * FreshProblems (Flow 6, DD1 Form-B law) — the corrective re-check, explicitly
 * framed as brand-new problems, never the old ones. Serves
 * pack.masteryCheck.formB (index-paired isomorphs; QG-4 guarantees disjoint
 * surfaces upstream — Form A surfaces are never re-served here). Same dress
 * as WeeklyCheck: feedback held, strategy-card-only anchor, ScratchPad on.
 * Re-scored by the RPC on the DD1 machine: ≥95% → fast-track · ≥ the DD1 pass
 * threshold (MASTERY_THRESHOLD_PCT in constants; 85→80 by owner ruling
 * 2026-08-10) → pass · below it → cycle 2 (new angle) or, after cycle 2,
 * escalation. No other routes.
 */

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { COPY, MODULE_COPY } from '../copy';
import {
  recordItemAttempt,
  scoreMasteryCheck,
  type MasteryAnswerInput,
} from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import CheckRunner from '../components/CheckRunner';

export default function FreshProblems() {
  const navigate = useNavigate();
  const { loading, enrollment, weekState, pack, band, childId, refreshWeekState } = useFoundrySession();
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failedSubmit, setFailedSubmit] = useState(false);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;
  // Route guard: Form B only exists inside the corrective loop.
  if (weekState.state !== 'near_miss_cycle1' && weekState.state !== 'cycle2') {
    return <Navigate to="/foundry/hub" replace />;
  }

  const cycle = weekState.state === 'cycle2' ? 2 : 1;
  const items = pack.masteryCheck.formB;

  async function submit(answers: MasteryAnswerInput[]) {
    if (!weekState || !pack) return;
    setSubmitting(true);
    try {
      const result = await scoreMasteryCheck(weekState, 'B', answers, pack.parentSummarySeed);
      await refreshWeekState();
      if (result.state === 'passed' || result.state === 'fast_track') {
        navigate('/foundry/resolve', { replace: true, state: { justResolved: true } });
      } else if (result.state === 'cycle2') {
        navigate('/foundry/strengthen', { replace: true, state: { entry: 'cycle2' } });
      } else {
        // escalated — the friendly reinforcements card lives on StrengthenPlan.
        navigate('/foundry/strengthen', { replace: true, state: { entry: 'escalated' } });
      }
    } catch (e) {
      console.error('[bb] Form B scoring failed', e);
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
        <WrenBubble band={band} autoplay text={MODULE_COPY.freshIntro[band]} emotion="warm" />
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="min-h-[64px] rounded-2xl bg-primary px-8 text-xl font-semibold text-white shadow-lg hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          Fresh ones — let's go
        </button>
      </div>
    );
  }

  return (
    <CheckRunner
      pack={pack}
      items={items}
      band={band}
      /* Keyed on the child — see the note in WeeklyCheck: the resume store now
         survives a restart, so it must not be shared across children. */
      storageKey={`bb-check-B${cycle}-${childId}-${pack.packId}`}
      headerLabel="Brand-new problems"
      onItemAnswered={(item, answer, correct, errorTag) => {
        void recordItemAttempt({
          childId,
          packId: pack.packId,
          itemId: item.id,
          answer,
          correct,
          hintRungsUsed: 0,
          attemptNo: cycle,
          day: null, // Form B rows carry no day (schema convention)
          errorTag,
        });
      }}
      onComplete={(answers) => void submit(answers)}
    />
  );
}
