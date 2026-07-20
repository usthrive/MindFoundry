/**
 * GuidedPractice (Flow 2, DD4) — practice *with* Ms. Wren through the scaffold
 * fade: modeled → completion → prompted → independent. teacherSay narrated,
 * childDo as the input moment; misses get Acknowledge→Locate→Guide→Re-attempt,
 * never a bare ✗ (DD13). Two interventions on one example parks it warmly
 * (TreasureChest ritual matures in increment 4; parking = telemetry + move on).
 * Completing the set completes Day 1 (Flow 2 step 4).
 */

import { useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { COPY, MISS_OPENER, MODULE_COPY } from '../copy';
import { recordItemAttempt, updateDayProgress } from '../services/bbProgressService';
import { LESSON_KEY } from '../session/weekLogic';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import BBScratchPad from '../components/BBScratchPad';

const FADE_LABELS: Record<string, string> = {
  modeled: 'Watch me',
  completion: 'Finish my steps',
  prompted: 'Your turn, with nudges',
  independent: 'All yours',
};

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export default function GuidedPractice() {
  const navigate = useNavigate();
  const { loading, enrollment, weekState, pack, band, childId, refreshWeekState, ensureWeekStarted } =
    useFoundrySession();

  const [exIdx, setExIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [entry, setEntry] = useState('');
  const [missLine, setMissLine] = useState<string | null>(null);
  const [interventions, setInterventions] = useState(0);
  const [parkedLine, setParkedLine] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const attemptNo = useRef(1);
  const startedAt = useRef(Date.now());

  const examples = useMemo(() => pack?.guidedExamples ?? [], [pack]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;

  const example = examples[Math.min(exIdx, examples.length - 1)];
  const step = example.steps[Math.min(stepIdx, example.steps.length - 1)];
  const isModeled = example.fadeLevel === 'modeled';
  const needsInput = !isModeled && !!step.childDo && !!step.expected;

  function advanceStep() {
    setEntry('');
    setMissLine(null);
    attemptNo.current = 1;
    if (stepIdx + 1 < example.steps.length) {
      setStepIdx((i) => i + 1);
    } else {
      void advanceExample();
    }
  }

  async function advanceExample() {
    setInterventions(0);
    setParkedLine(null);
    setStepIdx(0);
    setEntry('');
    setMissLine(null);
    attemptNo.current = 1;
    if (exIdx + 1 < examples.length) {
      setExIdx((i) => i + 1);
      return;
    }
    await finishSet();
  }

  async function finishSet() {
    if (saving || !weekState) return;
    setSaving(true);
    try {
      await ensureWeekStarted();
      const now = new Date().toISOString();
      const minutes = Math.round((Date.now() - startedAt.current) / 60000);
      const afterLesson = await updateDayProgress(weekState, LESSON_KEY, {
        state: 'done',
        completedAt: now,
      });
      await updateDayProgress(afterLesson, '1', {
        state: 'done',
        completedItemIds: examples.map((e) => e.id),
        minutesSpent: minutes,
        completedAt: now,
      });
      await refreshWeekState();
      navigate('/foundry/day/1/done', {
        replace: true,
        state: {
          praise: `You worked through every example of ${pack?.identity.conceptName ?? 'this week'} right beside Ms. Wren — modeled to all-yours.`,
        },
      });
    } catch (e) {
      console.error('[bb] guided completion failed', e);
      setSaving(false);
    }
  }

  function submitStep() {
    if (!step.expected || !entry.trim()) return;
    const correct = normalize(entry) === normalize(step.expected);
    void recordItemAttempt({
      childId,
      packId: pack!.packId,
      itemId: example.id,
      answer: entry,
      correct,
      hintRungsUsed: 0,
      attemptNo: attemptNo.current,
      day: 1,
    });
    if (correct) {
      advanceStep();
      return;
    }
    attemptNo.current += 1;
    const nextInterventions = interventions + 1;
    setInterventions(nextInterventions);
    if (nextInterventions >= 2) {
      // Park the example warmly; the weekly gate — not any item — decides advancement.
      setParkedLine(COPY.itemParked[band]);
      return;
    }
    setMissLine(`${MISS_OPENER[band]} ${step.teacherSay ?? ''}`.trim());
    setEntry('');
  }

  if (parkedLine) {
    return (
      <div className="flex min-h-[70vh] flex-col justify-center gap-8">
        <WrenBubble band={band} autoplay text={parkedLine} emotion="warm" />
        <button
          type="button"
          onClick={() => void advanceExample()}
          className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          On we go
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-5">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">{MODULE_COPY.guidedIntro[band]}</h1>
        <span className="rounded-full bg-secondary-light px-3 py-1 text-sm font-medium text-secondary-700">
          {FADE_LABELS[example.fadeLevel]}
        </span>
      </header>

      {/* Example count as quiet dots (P2 — never a score). */}
      <div className="flex gap-2" aria-label={`Example ${exIdx + 1} of ${examples.length}`}>
        {examples.map((e, i) => (
          <span
            key={e.id}
            className={cn(
              'h-2 flex-1 rounded-full',
              i < exIdx ? 'bg-secondary' : i === exIdx ? 'bg-primary' : 'bg-gray-200',
            )}
          />
        ))}
      </div>

      <section aria-label="The problem" className="rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <p className={cn('flex-1 text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>
            {example.prompt}
          </p>
          <AudioButton text={example.prompt} band={band} autoplay={band === 'A'} />
        </div>
      </section>

      {missLine ? (
        <WrenBubble band={band} autoplay text={missLine} emotion="curious" />
      ) : (
        step.teacherSay && <WrenBubble band={band} autoplay text={step.teacherSay} emotion="curious" />
      )}

      {needsInput && (
        <div className="rounded-3xl bg-surface p-5 shadow-sm">
          <p className={cn('mb-3 text-text-primary', band === 'A' ? 'text-xl' : 'text-lg')}>{step.childDo}</p>
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              submitStep();
            }}
          >
            <input
              type="text"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Your step"
              aria-label="Your step"
              className="min-h-[56px] flex-1 rounded-2xl border-2 border-gray-200 bg-white px-4 text-lg text-text-primary focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={!entry.trim()}
              className="min-h-[56px] rounded-2xl bg-primary px-6 font-semibold text-white shadow-md hover:bg-primary-hover disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation"
            >
              Check
            </button>
          </form>
        </div>
      )}

      {!needsInput && (
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            // Modeled tap-along: continuing reveals the step's result.
            advanceStep();
          }}
          className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          {step.expected ? `${step.expected} — got it!` : 'Continue'}
        </button>
      )}

      <div className="mt-auto">
        <BBScratchPad itemKey={`guided-${example.id}`} band={band} />
      </div>
    </div>
  );
}
