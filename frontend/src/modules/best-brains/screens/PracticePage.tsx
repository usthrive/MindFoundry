/**
 * PracticePage (Flow 3) — the core daily work surface: the day's pages, one
 * problem in focus at a time (P2). Immediate feedback per DD13: correct →
 * brief specific confirm; miss → HintLadder auto-opens at rung 1 inside the
 * correction formula (never a bare ✗). Two spent interventions park the item
 * warmly and the flow continues (the weekly gate decides advancement, not any
 * item). AnchorPanel + ScratchPad persistent (P7/P3). Resume-at-item via
 * day_progress.completedItemIds; 15-min soft-stop honors the dose cap (E12).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getPackDay } from '../generator/packGenerator';
import { COPY, CONFIRMS, MISS_OPENER } from '../copy';
import { checkAnswer } from '../answers';
import { recordItemAttempt, updateDayProgress } from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import AnswerEntry from '../components/AnswerEntry';
import AnchorPanel from '../components/AnchorPanel';
import HintLadderView from '../components/HintLadder';
import BBScratchPad from '../components/BBScratchPad';
import type { ErrorTag, PackItem, WeekState } from '../types';

type Feedback =
  | { kind: 'confirm'; text: string }
  | { kind: 'miss'; text: string }
  | { kind: 'parked'; text: string };

function errorTagFor(item: PackItem, answer: string): ErrorTag | undefined {
  const chosen = item.choices?.find((c) => c.key.toLowerCase() === answer.trim().toLowerCase());
  return chosen?.errorTag ?? item.errorTags[0];
}

export default function PracticePage() {
  const navigate = useNavigate();
  const params = useParams<{ day: string }>();
  const day = Number(params.day);
  const session = useFoundrySession();
  const { loading, enrollment, pack, band, childId, capMinutes, sessionMinutes, refreshWeekState } = session;

  const [weekState, setWeekState] = useState<WeekState | null>(session.weekState);
  useEffect(() => {
    if (session.weekState && !weekState) setWeekState(session.weekState);
  }, [session.weekState, weekState]);

  const packDay = useMemo(() => {
    if (!pack || !Number.isInteger(day) || day < 1 || day > 5) return null;
    return getPackDay(pack, day);
  }, [pack, day]);

  const items = useMemo(() => packDay?.items.filter((i) => !i.isRetrieval) ?? [], [packDay]);
  const pageCount = Math.max(1, packDay?.pageCount ?? 1);
  const perPage = Math.max(1, Math.ceil(items.length / pageCount));

  // Resume-at-item: skip what's already completed ("we were right here").
  const [completedIds, setCompletedIds] = useState<string[]>(
    () => session.weekState?.dayProgress[String(day)]?.completedItemIds ?? [],
  );
  const [idx, setIdx] = useState(() => {
    const done = session.weekState?.dayProgress[String(day)]?.completedItemIds ?? [];
    const first = items.findIndex((i) => !done.includes(i.id));
    return first === -1 ? 0 : first;
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [rung, setRung] = useState(0);
  // LS1-R3(a): a genuine attempt is required since the last rung before the
  // ladder may escalate (research/phase2-gaps/DESIGN-DEFAULTS-ADDENDUM-LS1.md).
  const [attemptedSinceRung, setAttemptedSinceRung] = useState(true);
  const [misses, setMisses] = useState(0);
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [softStopped, setSoftStopped] = useState(false);
  const hintsUsedTotal = useRef(0);
  const parkedTotal = useRef(0);
  const attemptNo = useRef(1);
  const startedAt = useRef(Date.now());

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack || !packDay || items.length === 0) {
    return <Navigate to="/foundry" replace />;
  }

  const item = items[Math.min(idx, items.length - 1)];
  const page = Math.floor(Math.min(idx, items.length - 1) / perPage) + 1;

  async function persistProgress(ids: string[], done: boolean) {
    if (!weekState) return;
    const minutes = Math.round((Date.now() - startedAt.current) / 60000);
    const prevMinutes = weekState.dayProgress[String(day)]?.minutesSpent ?? 0;
    try {
      const next = await updateDayProgress(weekState, String(day), {
        state: done ? 'done' : 'partial',
        completedItemIds: ids,
        minutesSpent: prevMinutes + minutes,
        ...(done ? { completedAt: new Date().toISOString() } : {}),
      });
      setWeekState(next);
      if (done) await refreshWeekState();
    } catch (e) {
      console.error('[bb] day progress save failed', e);
    }
  }

  function praiseLine(): string {
    const concept = pack?.identity.conceptName ?? 'this week';
    if (parkedTotal.current > 0) {
      return `You caught ${parkedTotal.current === 1 ? 'a sneaky one' : 'some sneaky ones'} and kept going — tomorrow we open the chest together.`;
    }
    if (hintsUsedTotal.current === 0) {
      return `Every ${concept} problem today, solved on your own steps — no hints needed.`;
    }
    return 'You climbed the hint ladder one rung at a time and found the step yourself — that is exactly how to get unstuck.';
  }

  async function advance(afterId: string) {
    const ids = completedIds.includes(afterId) ? completedIds : [...completedIds, afterId];
    setCompletedIds(ids);
    setFeedback(null);
    setRung(0);
    setAttemptedSinceRung(true);
    setMisses(0);
    attemptNo.current = 1;

    const nextIdx = items.findIndex((i) => !ids.includes(i.id));
    if (nextIdx === -1) {
      await persistProgress(ids, true);
      navigate(`/foundry/day/${day}/done`, { replace: true, state: { praise: praiseLine() } });
      return;
    }
    // 15-min hard-cap law: soft-stop between items, never mid-item.
    if (sessionMinutes() > capMinutes) {
      await persistProgress(ids, false);
      navigate(`/foundry/day/${day}/done`, { replace: true, state: { partial: true } });
      return;
    }
    await persistProgress(ids, false);
    setIdx(nextIdx);
  }

  function handleAnswer(answer: string) {
    if (feedback && feedback.kind !== 'miss') return;
    setAttemptedSinceRung(true); // LS1-R3(a): this attempt re-opens escalation.
    const { correct, ungraded } = checkAnswer(item.answer, answer);
    const tag = correct ? undefined : errorTagFor(item, answer);
    void recordItemAttempt({
      childId,
      packId: pack!.packId,
      itemId: item.id,
      answer,
      correct,
      hintRungsUsed: rung,
      attemptNo: attemptNo.current,
      day,
      errorTag: tag,
    });

    if (correct || ungraded) {
      setFeedback({ kind: 'confirm', text: CONFIRMS[band][idx % CONFIRMS[band].length] });
      return;
    }

    attemptNo.current += 1;
    const missCount = misses + 1;
    setMisses(missCount);
    if (missCount >= 2) {
      // Two interventions spent → park warmly, flow continues (§4.2 move-on rule).
      parkedTotal.current += 1;
      setFeedback({ kind: 'parked', text: COPY.itemParked[band] });
      return;
    }
    // Miss-triggered: hint ladder auto-opens at rung 1 (DD13; bare ✗ never renders).
    if (rung === 0 && item.hintLadder.length > 0) {
      setRung(1);
      hintsUsedTotal.current += 1;
      setAttemptedSinceRung(false); // LS1-R3(a): try with rung 1 before rung 2.
    }
    setFeedback({ kind: 'miss', text: MISS_OPENER[band] });
  }

  if (softStopped) {
    return (
      <div className="flex min-h-[70vh] flex-col justify-center gap-8">
        <WrenBubble band={band} autoplay text={COPY.idleTimeout[band]} emotion="settled" />
        <button
          type="button"
          onClick={() => {
            void persistProgress(completedIds, false).then(() =>
              navigate(`/foundry/day/${day}/done`, { replace: true, state: { partial: true } }),
            );
          }}
          className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          See you tomorrow
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-5">
      <header className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">
          Day {day} · page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAnchorOpen(true)}
            aria-label="Open this week's anchor"
            className="flex h-12 min-w-[48px] items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-3 text-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            📌
          </button>
          <button
            type="button"
            onClick={() => setSoftStopped(true)}
            aria-label="Stop for today"
            className="flex h-12 min-w-[48px] items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-3 text-sm font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            Done for now
          </button>
        </div>
      </header>

      <section aria-label="The problem" className="rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <p className={cn('flex-1 text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>{item.prompt}</p>
          <AudioButton
            text={item.prompt}
            band={band}
            autoplay={band === 'A' || (packDay.focus === 'word-problems' && item.type === 'word-problem')}
          />
        </div>
      </section>

      {feedback?.kind === 'confirm' && (
        <div className="flex flex-col gap-5">
          <WrenBubble band={band} autoplay text={feedback.text} emotion="warm" />
          <button
            type="button"
            onClick={() => void advance(item.id)}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            Next
          </button>
        </div>
      )}

      {feedback?.kind === 'parked' && (
        <div className="flex flex-col gap-5">
          <WrenBubble band={band} autoplay text={feedback.text} emotion="warm" />
          <button
            type="button"
            onClick={() => void advance(item.id)}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            On we go
          </button>
        </div>
      )}

      {(!feedback || feedback.kind === 'miss') && (
        <>
          {feedback?.kind === 'miss' && <WrenBubble band={band} autoplay text={feedback.text} emotion="curious" />}
          {item.hintLadder.length > 0 && (
            <HintLadderView
              band={band}
              hintLadder={item.hintLadder}
              rung={rung}
              escalationLocked={!attemptedSinceRung}
              onRequestRung={(r) => {
                hintsUsedTotal.current += 1;
                setRung(r);
                setAttemptedSinceRung(false); // LS1-R3(a): try before the next rung.
              }}
            />
          )}
          <AnswerEntry item={item} band={band} onSubmit={handleAnswer} />
        </>
      )}

      <div className="mt-auto">
        <BBScratchPad itemKey={`practice-${item.id}`} band={band} />
      </div>

      <AnchorPanel pack={pack} mode="full" band={band} open={anchorOpen} onClose={() => setAnchorOpen(false)} />
    </div>
  );
}
