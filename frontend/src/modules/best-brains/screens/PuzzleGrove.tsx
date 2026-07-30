/**
 * PuzzleGrove (Flow 4, DD12/E26) — the week's one non-computational page under
 * the module's own "Puzzle Grove" mark: the Day-5 noncomputational page items
 * (the same-concept transfer slice) followed by the featured pack.puzzle.
 * Ms. Wren responds qualitatively (strategy talk, never a score); the puzzle
 * never joins the objective gate %, but written explanations flow as DD7
 * formative data. Parking ("brain marinating") is allowed — the Day-5 tile
 * then stays partial until the puzzle closes the week (dual-strand law).
 * Done or parked → WeeklyCheck framed as "last page of the week".
 */

import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CONFIRMS, MISS_OPENER, MODULE_COPY } from '../copy';
import { checkAnswer } from '../answers';
import { getPackDay } from '../generator/packGenerator';
import { recordItemAttempt, updateDayProgress } from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import { PromptFigure } from '../components/figures/BBFigureView';
import { promptText, speakablePrompt } from '../figures/prompt';
import AnswerEntry from '../components/AnswerEntry';
import AnchorPanel from '../components/AnchorPanel';
import HintLadderView from '../components/HintLadder';
import BBScratchPad from '../components/BBScratchPad';
import type { PackItem, Puzzle } from '../types';

type Stage = { kind: 'item'; item: PackItem } | { kind: 'puzzle'; puzzle: Puzzle };

export default function PuzzleGrove() {
  const navigate = useNavigate();
  const session = useFoundrySession();
  const { loading, enrollment, pack, band, childId, refreshWeekState } = session;
  const weekState = session.weekState;

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: 'confirm' | 'path' | 'close'; text: string } | null>(null);
  const [rung, setRung] = useState(0);
  const [attemptedSinceRung, setAttemptedSinceRung] = useState(true);
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [doneIds, setDoneIds] = useState<string[]>(
    () => weekState?.dayProgress['5']?.completedItemIds ?? [],
  );

  const stages = useMemo<Stage[]>(() => {
    if (!pack) return [];
    const pageItems = getPackDay(pack, 5).items.filter((i) => !i.isRetrieval);
    return [
      ...pageItems.map((item) => ({ kind: 'item' as const, item })),
      { kind: 'puzzle' as const, puzzle: pack.puzzle },
    ];
  }, [pack]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;
  // Route guard: the Grove opens after the Day-5 warm-up (tile partial) and
  // stays available during a corrective week (other strands keep moving, DD1).
  if (!weekState.dayProgress['5']) return <Navigate to="/foundry/hub" replace />;

  // Resume: skip stages already completed.
  const remaining = stages.filter((s) =>
    s.kind === 'item' ? !doneIds.includes(s.item.id) : !doneIds.includes(s.puzzle.id),
  );
  const stage = remaining[Math.min(idx, remaining.length - 1)] ?? null;

  async function persist(ids: string[]) {
    if (!weekState) return;
    const entry = weekState.dayProgress['5'];
    try {
      await updateDayProgress(weekState, '5', {
        ...(entry ?? { state: 'partial' }),
        state: 'partial',
        completedItemIds: Array.from(new Set([...(entry?.completedItemIds ?? []), ...ids])),
      });
      await refreshWeekState();
    } catch (e) {
      console.error('[bb] grove progress save failed', e);
    }
  }

  function toCheck() {
    navigate('/foundry/check', { replace: true });
  }

  if (!stage) {
    // Everything in the Grove is done — straight to the last page of the week.
    toCheck();
    return null;
  }

  const current = stage.kind === 'item' ? stage.item : stage.puzzle;
  const prompt = stage.kind === 'item' ? stage.item.prompt : `${stage.puzzle.title} — ${stage.puzzle.prompt}`;
  const figure = stage.kind === 'item' ? stage.item.figure : stage.puzzle.figure;
  const hintLadder = current.hintLadder;
  const isPuzzle = stage.kind === 'puzzle';

  function handleAnswer(answer: string) {
    if (feedback) return;
    setAttemptedSinceRung(true);
    const answerSpec = stage.kind === 'item' ? stage.item.answer : stage.puzzle.answer;
    const { correct, ungraded } = checkAnswer(answerSpec, answer);
    void recordItemAttempt({
      childId,
      packId: pack!.packId,
      itemId: current.id,
      answer,
      correct,
      hintRungsUsed: rung,
      attemptNo: 1,
      day: 5,
      errorTag:
        correct || ungraded
          ? undefined
          : stage.kind === 'item'
            ? stage.item.errorTags[0]
            : stage.puzzle.errorTags?.[0],
    });
    if (ungraded || (isPuzzle && correct)) {
      // Qualitative close — strategy talk, never a score (DD12).
      setFeedback({ kind: 'close', text: MODULE_COPY.puzzleClose[band] });
      return;
    }
    if (correct) {
      setFeedback({ kind: 'confirm', text: CONFIRMS[band][idx % CONFIRMS[band].length] });
      return;
    }
    // Miss: brief correction path (acknowledge + orient), then flow on —
    // the Grove is formative, never part of the gate.
    const orient = hintLadder[0] ? ` ${hintLadder[0]}` : '';
    setFeedback({ kind: 'path', text: `${MISS_OPENER[band]}${orient}` });
  }

  async function advance() {
    const ids = [current.id];
    setFeedback(null);
    setRung(0);
    setAttemptedSinceRung(true);
    const nextDone = [...doneIds, ...ids];
    setDoneIds(nextDone);
    await persist(ids);
    const left = stages.filter((s) =>
      s.kind === 'item' ? !nextDone.includes(s.item.id) : !nextDone.includes(s.puzzle.id),
    );
    if (left.length === 0) toCheck();
    else setIdx(0);
  }

  function parkPuzzle() {
    // "Brain marinating" — the tile stays partial until the puzzle closes the week.
    toCheck();
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-5">
      <header className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">
          Day 5 · Puzzle Grove
        </p>
        <button
          type="button"
          onClick={() => setAnchorOpen(true)}
          aria-label="Open this week's anchor"
          className="flex h-12 min-w-[48px] items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-3 text-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
        >
          📌
        </button>
      </header>

      {idx === 0 && !feedback && <WrenBubble band={band} autoplay text={MODULE_COPY.puzzleOpen[band]} emotion="warm" />}

      <section
        aria-label={isPuzzle ? 'The puzzle' : 'The task'}
        className={cn('rounded-3xl p-6 shadow-sm', isPuzzle ? 'bg-secondary-light' : 'bg-surface')}
      >
        {isPuzzle && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-secondary-700">🌳 Puzzle Grove</p>
        )}
        <div className="flex items-start gap-3">
          <p className={cn('flex-1 text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>{promptText(prompt)}</p>
          <AudioButton text={speakablePrompt(prompt, figure?.alt)} band={band} autoplay={band === 'A'} />
        </div>
        <div className="mt-4">
          <PromptFigure prompt={prompt} figure={figure} band={band} />
        </div>
      </section>

      {/* Band-A "show a grown-up" card (E57) rides the Day-5 teacher note strip. */}
      {band === 'A' && isPuzzle && getPackDay(pack, 5).teacherNoteStrip && (
        <div className="rounded-2xl border-2 border-dashed border-secondary/40 bg-white p-4">
          <p className="text-sm font-semibold text-secondary-700">Show a grown-up!</p>
          <p className="text-sm text-text-secondary">{getPackDay(pack, 5).teacherNoteStrip}</p>
        </div>
      )}

      {feedback ? (
        <div className="flex flex-col gap-5">
          <WrenBubble
            band={band}
            autoplay
            text={feedback.text}
            emotion={feedback.kind === 'path' ? 'curious' : 'warm'}
          />
          <button
            type="button"
            onClick={() => void advance()}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            {remaining.length <= 1 ? 'Last page of the week' : 'Next'}
          </button>
        </div>
      ) : (
        <>
          {hintLadder.length > 0 && (
            <HintLadderView
              band={band}
              hintLadder={hintLadder}
              rung={rung}
              escalationLocked={!attemptedSinceRung}
              onRequestRung={(r) => {
                setRung(r);
                setAttemptedSinceRung(false); // LS1-R3(a)
              }}
            />
          )}
          <AnswerEntry item={{ ...(stage.kind === 'item' ? stage.item : puzzleAsItem(stage.puzzle)) }} band={band} onSubmit={handleAnswer} />
          {isPuzzle && (
            <button
              type="button"
              onClick={parkPuzzle}
              className="min-h-[48px] rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
            >
              {MODULE_COPY.puzzlePark[band]}
            </button>
          )}
        </>
      )}

      <div className="mt-auto">
        <BBScratchPad itemKey={`grove-${current.id}`} band={band} />
      </div>

      <AnchorPanel pack={pack} mode="full" band={band} open={anchorOpen} onClose={() => setAnchorOpen(false)} />
    </div>
  );
}

/** Adapt the puzzle to the AnswerEntry PackItem surface (input law only). */
function puzzleAsItem(puzzle: Puzzle): PackItem {
  return {
    id: puzzle.id,
    type: 'reasoning',
    prompt: puzzle.prompt,
    answer: puzzle.answer,
    difficulty: 3,
    strand: 'noncomputational',
    isRetrieval: false,
    hintLadder: puzzle.hintLadder,
    errorTags: puzzle.errorTags?.length ? puzzle.errorTags : ['concept-misconception'],
  };
}
