/**
 * WarmUp (Flow 3, DD8) — 2–4 fast retrieval items styled as warm-ups, never
 * "review of what you forgot". Immediate friendly confirm; a miss gets the
 * brief inline correction formula (opener + orienting hint + the path), then
 * flows on. Day 5 continues to PuzzleGrove (increment-4 stub for now).
 *
 * LS1-R3(b) (research/phase2-gaps/DESIGN-DEFAULTS-ADDENDUM-LS1.md): the
 * warm-up miss path is increment 3's only bottom-out answer reveal, so the
 * fix-it follow-up lives here — band A re-enacts the same item once
 * (tap-to-choose re-attempt), bands B/C give a short explain-back ("the first
 * step in your own words", recorded as ungraded telemetry) before the day
 * flow continues.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getPackDay } from '../generator/packGenerator';
import { dayFlow } from '../session/dayFlow';
import QuestionCounter from '../components/QuestionCounter';
import { COPY, CONFIRMS, MISS_OPENER } from '../copy';
import { checkAnswer } from '../answers';
import { recordItemAttempt, updateDayProgress } from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import { isDayActionable } from '../session/weekLogic';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import { PromptFigure } from '../components/figures/BBFigureView';
import { promptText, speakablePrompt } from '../figures/prompt';
import AnswerEntry from '../components/AnswerEntry';

export default function WarmUp() {
  const navigate = useNavigate();
  const params = useParams<{ day: string }>();
  const day = Number(params.day);
  const { loading, enrollment, weekState, pack, band, childId, refreshWeekState, ensureWeekStarted } =
    useFoundrySession();

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: 'confirm' | 'correct-path'; text: string } | null>(null);
  /** LS1-R3(b) fix-it follow-up after a bottom-out reveal. */
  const [fixit, setFixit] = useState<'explain' | 'reattempt' | null>(null);
  const [explainText, setExplainText] = useState('');
  const startedRef = useRef(false);

  // The warm-up screen exists only when it has its 2–4 items (DD8); a lone
  // retrieval item is the day's first question on the work screen instead
  // (session/dayFlow.ts — the 2026-09-04 "only 1–2 questions" report).
  const flow = useMemo(() => {
    if (!pack || !Number.isInteger(day) || day < 1 || day > 5) return null;
    return dayFlow(getPackDay(pack, day));
  }, [pack, day]);
  const items = useMemo(() => flow?.warmup ?? [], [flow]);

  // C1: an empty warm-up slot (0 retrieval items, or a lone one folded into the
  // work screen by dayFlow) must never strand the child on a blank screen.
  // Day 5 forwards to the Grove, which requires the day-5 slot banked first
  // (PuzzleGrove guards on dayProgress['5']); do that write here, from an
  // effect — never navigate() during render. Day ≤4 forwards declaratively in
  // the render below (no side effect needed — PracticePage owns its progress).
  const day5Forwarded = useRef(false);
  useEffect(() => {
    if (loading || !enrollment || !weekState || !pack) return;
    if (day !== 5 || items.length > 0) return;
    if (weekState.dayProgress['5']) return; // already banked → the render guard forwards
    if (!isDayActionable(weekState.dayProgress, 5)) return;
    if (day5Forwarded.current) return;
    day5Forwarded.current = true;
    void (async () => {
      await updateDayProgress(weekState, '5', { state: 'partial', completedItemIds: [] });
      await refreshWeekState();
      navigate('/foundry/puzzle', { replace: true });
    })();
  }, [loading, enrollment, weekState, pack, day, items.length, refreshWeekState, navigate]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack || !Number.isInteger(day) || day < 2 || day > 5) {
    return <Navigate to="/foundry" replace />;
  }
  // Route-level day-unlock guard: deep links must not bypass tile gating
  // (increment-3 known bug, fixed). Day-5 re-entry (warm-up already banked)
  // forwards to the Grove instead of replaying the warm-ups.
  if (day === 5 && weekState.dayProgress['5']) {
    return <Navigate to="/foundry/puzzle" replace />;
  }
  if (!isDayActionable(weekState.dayProgress, day)) {
    return <Navigate to="/foundry/hub" replace />;
  }

  if (!startedRef.current) {
    startedRef.current = true;
    void ensureWeekStarted();
  }

  async function goOnward() {
    if (day <= 4) {
      navigate(`/foundry/day/${day}/practice`, { replace: true });
      return;
    }
    // Day 5: PuzzleGrove → WeeklyCheck arrive in increment 4; the tile stays
    // partial (the week can't close without them — dual-strand law).
    if (weekState) {
      await updateDayProgress(weekState, '5', {
        state: 'partial',
        completedItemIds: items.map((i) => i.id),
      });
      await refreshWeekState();
    }
    navigate('/foundry/puzzle', { replace: true });
  }

  // No retrieval slice (early weeks): never render blank (C1). Day ≤4 forwards
  // declaratively to the core practice surface; day 5 is banked+forwarded by
  // the effect above — show a safe placeholder, never null, meanwhile.
  if (items.length === 0) {
    if (day <= 4) return <Navigate to={`/foundry/day/${day}/practice`} replace />;
    return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  }

  const item = items[Math.min(idx, items.length - 1)];

  function handleAnswer(answer: string) {
    if (feedback) return;
    const { correct } = checkAnswer(item.answer, answer);
    const isReattempt = fixit === 'reattempt';
    void recordItemAttempt({
      childId,
      packId: pack!.packId,
      itemId: item.id,
      answer,
      correct,
      hintRungsUsed: 0,
      attemptNo: isReattempt ? 2 : 1,
      day,
      errorTag: correct ? undefined : item.errorTags[0],
    });
    if (isReattempt) {
      // LS1-R3(b), band A: the re-enactment closes the loop warmly either way.
      setFixit(null);
      setFeedback({
        kind: 'confirm',
        text: correct ? 'You walked it through yourself this time!' : "We walked it together — it'll come back another day.",
      });
      return;
    }
    if (correct) {
      setFeedback({ kind: 'confirm', text: CONFIRMS[band][idx % CONFIRMS[band].length] });
    } else {
      // Brief inline correction: acknowledge + orient + the path (DD13) — never a bare ✗.
      const orient = item.hintLadder[0] ? ` ${item.hintLadder[0]}` : '';
      setFeedback({
        kind: 'correct-path',
        text: `${MISS_OPENER[band]}${orient} It comes to ${item.answer.value}.`,
      });
    }
  }

  /** LS1-R3(b): a bottom-out reveal routes into the fix-it step, not straight onward. */
  function afterReveal() {
    setFeedback(null);
    if (band === 'A') {
      setFixit('reattempt');
    } else {
      setExplainText('');
      setFixit('explain');
    }
  }

  function sendExplainBack() {
    if (explainText.trim()) {
      // Ungraded telemetry: the explain-back is acknowledged, never scored.
      void recordItemAttempt({
        childId,
        packId: pack!.packId,
        itemId: item.id,
        answer: `explain-back: ${explainText.trim()}`,
        correct: true,
        hintRungsUsed: 0,
        attemptNo: 2,
        day,
      });
    }
    setFixit(null);
    next();
  }

  function next() {
    setFeedback(null);
    setFixit(null);
    if (idx + 1 < items.length) setIdx((i) => i + 1);
    else void goOnward();
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      <header className="flex items-start justify-between gap-3">
        <QuestionCounter day={day} k={idx + 1} total={flow?.total ?? items.length} band={band} />
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">Warm-up</p>
      </header>

      {idx === 0 && <WrenBubble band={band} autoplay text={COPY.warmupOpen[band]} emotion="warm" />}

      <section aria-label="The question" className="flex flex-col gap-4 rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <p className={cn('flex-1 text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>{promptText(item.prompt)}</p>
          <AudioButton text={speakablePrompt(item.prompt, item.figure?.alt)} band={band} autoplay={band === 'A'} />
        </div>
        <PromptFigure prompt={item.prompt} figure={item.figure} band={band} />
      </section>

      {feedback ? (
        <div className="flex flex-col gap-5">
          <WrenBubble
            band={band}
            autoplay
            text={feedback.text}
            emotion={feedback.kind === 'confirm' ? 'warm' : 'curious'}
          />
          <button
            type="button"
            onClick={feedback.kind === 'correct-path' ? afterReveal : next}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            {feedback.kind === 'correct-path'
              ? "Let's fix it"
              : idx + 1 < items.length
                ? 'Next one'
                : 'All warmed up!'}
          </button>
        </div>
      ) : fixit === 'explain' ? (
        /* LS1-R3(b), bands B/C: explain-back before the day flow continues. */
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
                next();
              }}
              className="min-h-[48px] rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            >
              I said it out loud instead
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {fixit === 'reattempt' && (
            /* LS1-R3(b), band A: re-enactment — same item, tap-to-choose again. */
            <WrenBubble band={band} autoplay text="Your turn — let's do it together!" emotion="curious" />
          )}
          <AnswerEntry item={item} band={band} onSubmit={handleAnswer} />
        </div>
      )}
    </div>
  );
}
