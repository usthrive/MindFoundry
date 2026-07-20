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
import { isDayActionable } from '../session/weekLogic';
import { sprintEligible } from '../session/sprintLogic';
import { nearTransferVariant, type NearTransferItem } from '../session/fixit';
import {
  FATIGUE_ACCURACY_FLOOR,
  FATIGUE_DEEP_HINT_STREAK,
  FATIGUE_RAPID_GUESS_COUNT,
  FATIGUE_RAPID_GUESS_MS,
  FATIGUE_ROLLING_WINDOW,
} from '../constants';
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
  | { kind: 'parked'; text: string }
  /** LS1-R3(b): bottom-out reveal — the answer with full reasoning, then fix-it. */
  | { kind: 'reveal'; text: string };

/** LS1-R3(b) fix-it step after a bottom-out reveal. */
type FixIt = { kind: 'variant'; variant: NearTransferItem; forId: string } | { kind: 'explain'; forId: string };

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
  const [fixit, setFixit] = useState<FixIt | null>(null);
  const [explainText, setExplainText] = useState('');
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
  // LS1-R5: first-attempt correctness per item feeds the day's accuracyPct.
  const firstAttempts = useRef(new Map<string, boolean>());
  // LS1-R2 fatigue signals (v1 heuristic).
  const rollingFirstAttempts = useRef<boolean[]>([]);
  const rapidWrongCount = useRef(0);
  const deepHintStreak = useRef(0);
  const itemShownAt = useRef(Date.now());
  // Route-level day-unlock guard: judged once, on the first loaded render.
  const dayAllowed = useRef<boolean | null>(null);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack || !packDay || items.length === 0) {
    return <Navigate to="/foundry" replace />;
  }
  // Deep links must not bypass tile gating (increment-3 known bug, fixed).
  if (dayAllowed.current === null) dayAllowed.current = isDayActionable(weekState.dayProgress, day);
  if (!dayAllowed.current) return <Navigate to="/foundry/hub" replace />;

  const item = items[Math.min(idx, items.length - 1)];
  const page = Math.floor(Math.min(idx, items.length - 1) / perPage) + 1;

  async function persistProgress(ids: string[], done: boolean) {
    if (!weekState) return;
    const minutes = Math.round((Date.now() - startedAt.current) / 60000);
    const prev = weekState.dayProgress[String(day)];
    // LS1-R5: the day's first-attempt accuracy (graded items seen this
    // session, merged over any prior partial visit) — the stability rule
    // reads it at mastery scoring. Never child-visible.
    const results = [...firstAttempts.current.values()];
    const sessionAccuracy =
      results.length > 0 ? Math.round((100 * results.filter(Boolean).length) / results.length) : undefined;
    const accuracyPct =
      prev?.accuracyPct !== undefined && sessionAccuracy !== undefined
        ? Math.round((prev.accuracyPct + sessionAccuracy) / 2)
        : sessionAccuracy ?? prev?.accuracyPct;
    try {
      const next = await updateDayProgress(weekState, String(day), {
        state: done ? 'done' : 'partial',
        completedItemIds: ids,
        minutesSpent: (prev?.minutesSpent ?? 0) + minutes,
        ...(accuracyPct !== undefined ? { accuracyPct } : {}),
        ...(done ? { completedAt: new Date().toISOString() } : {}),
      });
      setWeekState(next);
      if (done) await refreshWeekState();
    } catch (e) {
      console.error('[bb] day progress save failed', e);
    }
  }

  /**
   * LS1-R2 — adaptive stop (v1): two distinct fatigue signals in one session
   * end the day early and warmly; the concept resurfaces tomorrow (the day
   * stays partial). Checked only BETWEEN items, never mid-item.
   */
  function fatigueSignals(): number {
    let signals = 0;
    const recent = rollingFirstAttempts.current.slice(-FATIGUE_ROLLING_WINDOW);
    if (recent.length >= FATIGUE_ROLLING_WINDOW) {
      const acc = recent.filter(Boolean).length / recent.length;
      if (acc < FATIGUE_ACCURACY_FLOOR) signals += 1;
    }
    if (rapidWrongCount.current >= FATIGUE_RAPID_GUESS_COUNT) signals += 1;
    if (deepHintStreak.current >= FATIGUE_DEEP_HINT_STREAK) signals += 1;
    return signals;
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
    // LS1-R2: riding the ladder to rung 3 on consecutive items is a fatigue signal.
    deepHintStreak.current = rung >= 3 ? deepHintStreak.current + 1 : 0;
    setCompletedIds(ids);
    setFeedback(null);
    setFixit(null);
    setRung(0);
    setAttemptedSinceRung(true);
    setMisses(0);
    attemptNo.current = 1;
    itemShownAt.current = Date.now();

    const nextIdx = items.findIndex((i) => !ids.includes(i.id));
    if (nextIdx === -1) {
      await persistProgress(ids, true);
      navigate(`/foundry/day/${day}/done`, { replace: true, state: { praise: praiseLine() } });
      return;
    }
    // Band hard-cap law (LS1-R1): soft-stop between items, never mid-item.
    if (sessionMinutes() > capMinutes) {
      await persistProgress(ids, false);
      navigate(`/foundry/day/${day}/done`, { replace: true, state: { partial: true } });
      return;
    }
    // LS1-R2 adaptive stop: two fatigue signals → warm early end; the concept
    // resurfaces tomorrow (day stays partial).
    if (fatigueSignals() >= 2) {
      await persistProgress(ids, false);
      navigate(`/foundry/day/${day}/done`, { replace: true, state: { partial: true, adaptive: true } });
      return;
    }
    // Sprint offer at the page boundary (Flow 5: Days 2–3, ≤2/week, opt-in).
    const nextPage = Math.floor(nextIdx / perPage) + 1;
    if (nextPage > page && enrollment && weekState && pack && sprintEligible(enrollment, weekState, pack, day)) {
      await persistProgress(ids, false);
      await refreshWeekState(); // hand the fresh row back to the session context
      navigate('/foundry/sprint', { state: { day } });
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

    if (attemptNo.current === 1 && !ungraded) {
      // LS1-R5 accuracy + LS1-R2 rolling-window sample (first attempts only).
      firstAttempts.current.set(item.id, correct);
      rollingFirstAttempts.current.push(correct);
      // LS1-R2: a fast wrong answer is a rapid guess.
      if (!correct && Date.now() - itemShownAt.current < FATIGUE_RAPID_GUESS_MS) {
        rapidWrongCount.current += 1;
      }
    }

    if (correct || ungraded) {
      setFeedback({ kind: 'confirm', text: CONFIRMS[band][idx % CONFIRMS[band].length] });
      return;
    }

    attemptNo.current += 1;
    const missCount = misses + 1;
    setMisses(missCount);
    if (missCount >= 2) {
      if (rung >= 3) {
        // LS1-R3(b): the ladder is exhausted — the answer appears with its
        // reasoning (P8: only after rung 3 + a real attempt), and a fix-it
        // step follows before the day continues.
        const reasoning = item.hintLadder[item.hintLadder.length - 1] ?? '';
        setFeedback({
          kind: 'reveal',
          text: `${MISS_OPENER[band]} ${reasoning} It comes to ${item.answer.value}.`,
        });
        return;
      }
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

  /** LS1-R3(b): route the bottom-out reveal into the fix-it step. */
  function afterReveal() {
    setFeedback(null);
    const variant = nearTransferVariant(item);
    if (variant) setFixit({ kind: 'variant', variant, forId: item.id });
    else {
      setExplainText('');
      setFixit({ kind: 'explain', forId: item.id });
    }
  }

  /** LS1-R3(b): near-transfer re-attempt closes warmly either way. */
  function handleVariantAnswer(answer: string) {
    if (fixit?.kind !== 'variant') return;
    const correct = answer.trim() === fixit.variant.answer;
    void recordItemAttempt({
      childId,
      packId: pack!.packId,
      itemId: item.id,
      answer: `fix-it: ${answer}`,
      correct,
      hintRungsUsed: 3,
      attemptNo: attemptNo.current,
      day,
    });
    setFixit(null);
    setFeedback({
      kind: 'confirm',
      text: correct
        ? 'You turned it around on a brand-new one — that is the whole trick.'
        : "We walked it together — it'll come back another day.",
    });
  }

  function sendExplainBack() {
    if (explainText.trim()) {
      void recordItemAttempt({
        childId,
        packId: pack!.packId,
        itemId: item.id,
        answer: `explain-back: ${explainText.trim()}`,
        correct: true,
        hintRungsUsed: 3,
        attemptNo: attemptNo.current,
        day,
      });
    }
    setFixit(null);
    void advance(item.id);
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
        <p className="mf-label">
          Day {day} · page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSoftStopped(true)}
            aria-label="Stop for today"
            className="flex h-10 min-w-[48px] items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-[11.5px] font-semibold text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            Done for now
          </button>
          {/* Anchor tab bleeds off the right edge, per the reference. */}
          <button
            type="button"
            onClick={() => setAnchorOpen(true)}
            aria-label="Open this week's anchor"
            className="-mr-4 flex h-10 min-w-[48px] items-center justify-center rounded-l-xl rounded-r-none bg-primary px-3 text-[11.5px] font-bold text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation sm:-mr-5"
          >
            Anchor ⌗
          </button>
        </div>
      </header>

      <section aria-label="The problem" className="mf-card-quiet p-6">
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

      {feedback?.kind === 'reveal' && (
        /* LS1-R3(b): bottom-out reveal → the fix-it step follows, never a dead end. */
        <div className="flex flex-col gap-5">
          <WrenBubble band={band} autoplay text={feedback.text} emotion="curious" />
          <button
            type="button"
            onClick={afterReveal}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            Let's fix it
          </button>
        </div>
      )}

      {fixit?.kind === 'variant' && !feedback && (
        /* LS1-R3(b): near-transfer variant — same structure, fresh numbers. */
        <div className="flex flex-col gap-4">
          <WrenBubble
            band={band}
            autoplay
            text={band === 'A' ? 'Your turn on a fresh one!' : 'Same move, fresh numbers — take it.'}
            emotion="curious"
          />
          <section aria-label="A fresh one" className="mf-card-quiet p-6">
            <p className={cn('text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>{fixit.variant.prompt}</p>
          </section>
          <AnswerEntry
            item={{
              ...item,
              id: `${item.id}-fixit`,
              prompt: fixit.variant.prompt,
              choices: undefined,
              answer: { value: fixit.variant.answer, acceptableForms: [], validation: 'exact-numeric' },
            }}
            band={band}
            onSubmit={handleVariantAnswer}
          />
        </div>
      )}

      {fixit?.kind === 'explain' && !feedback && (
        /* LS1-R3(b): explain-back when no cheap variant exists. */
        <div className="flex flex-col gap-4">
          <WrenBubble
            band={band}
            autoplay
            text={
              band === 'C'
                ? 'Before we move on — tell me the first step in your own words.'
                : 'Tell Ms. Wren the first step in your own words!'
            }
            emotion="curious"
          />
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendExplainBack();
            }}
          >
            <input
              type="text"
              value={explainText}
              onChange={(e) => setExplainText(e.target.value)}
              placeholder="First, I…"
              aria-label="The first step in your own words"
              className="min-h-[56px] rounded-2xl border-2 border-gray-200 bg-white px-4 text-lg text-text-primary focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={!explainText.trim()}
              className="min-h-[52px] rounded-2xl bg-primary px-6 font-semibold text-white shadow-md hover:bg-primary-hover disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation"
            >
              Tell Ms. Wren
            </button>
            <button
              type="button"
              onClick={() => {
                setFixit(null);
                void advance(item.id);
              }}
              className="min-h-[48px] rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            >
              I said it out loud instead
            </button>
          </form>
        </div>
      )}

      {!fixit && (!feedback || feedback.kind === 'miss') && (
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
