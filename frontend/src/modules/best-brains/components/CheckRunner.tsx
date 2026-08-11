/**
 * CheckRunner — the shared surface for WeeklyCheck (Form A) and FreshProblems
 * (Form B): same visual dress as PracticePage (P6 — the check never looks like
 * an exam) with the two honest differences stated by Ms. Wren upstream:
 * per-item feedback is HELD (every answer gets the same neutral ack), and the
 * AnchorPanel shows the strategy card only (P7 exception, framed honestly).
 * ScratchPad stays. No timer anywhere (P4/P11). Mandatory-navigation feel:
 * one item at a time, no back, answered items stand (resume via localStorage —
 * no restart-scumming; each form is served once).
 *
 * That resume used to live in `sessionStorage`, which served the rule only
 * halfway: it held answers across a reload and dropped them at a restart, so a
 * restart WAS the scum — and, far worse in practice, a child who lost their
 * tablet mid-check was made to sit the questions again. localStorage is the
 * honest implementation of the rule this file already claimed to enforce.
 */

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { InteractionBand } from '../copy';
import { MODULE_COPY } from '../copy';
import { checkAnswer } from '../answers';
import type { MasteryAnswerInput } from '../services/bbProgressService';
import type { ErrorTag, PackItem, WeeklyConceptPack } from '../types';
import WrenBubble from './WrenBubble';
import AudioButton from './AudioButton';
import { PromptFigure } from './figures/BBFigureView';
import { promptText, speakablePrompt } from '../figures/prompt';
import AnswerEntry from './AnswerEntry';
import AnchorPanel from './AnchorPanel';
import BBScratchPad from './BBScratchPad';

export interface CheckRunnerProps {
  pack: WeeklyConceptPack;
  items: PackItem[];
  band: InteractionBand;
  /** localStorage resume key — answered items stand across a reload AND a restart. */
  storageKey: string;
  /** Fired once per item as it is answered (attempt telemetry). */
  onItemAnswered: (item: PackItem, answer: string, correct: boolean, errorTag?: ErrorTag) => void;
  /** Fired when the last item is answered, with the full answer sheet. */
  onComplete: (answers: MasteryAnswerInput[]) => void;
  headerLabel: string;
}

function errorTagFor(item: PackItem, answer: string): ErrorTag | undefined {
  const chosen = item.choices?.find((c) => c.key.toLowerCase() === answer.trim().toLowerCase());
  return chosen?.errorTag ?? item.errorTags[0];
}

/**
 * Resume across a RESTART, not just across a navigation.
 *
 * Reported from real use: a child finished five questions of the weekly check,
 * the iPad restarted, and the check began again at question one. The answers
 * were never lost — `onItemAnswered` banks every one of them server-side as it
 * happens — but the resume state lived in `sessionStorage`, which the device
 * clears when the browser session ends. So the record was intact and the child
 * was made to sit the work again anyway.
 *
 * `localStorage` survives the restart. Two guards come with it, because a store
 * that outlives the session can now be wrong in ways a session store could not:
 *
 *  - **Filter to the items actually on the page.** A pack regenerates per child
 *    and per seed. Stale entries from another pack would otherwise count toward
 *    `answers.length >= items.length` and could mark a check complete that the
 *    child never sat.
 *  - **Key on the child.** The key had no child id in it, so two children
 *    sharing one iPad shared one resume slot — invisible while a device has one
 *    user, and silent cross-contamination the moment it has two.
 */
function loadSaved(key: string, items: readonly PackItem[]): MasteryAnswerInput[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const saved = JSON.parse(raw) as MasteryAnswerInput[];
    if (!Array.isArray(saved)) return [];
    const live = new Set(items.map((i) => i.id));
    const kept = saved.filter((a) => a && typeof a.itemId === 'string' && live.has(a.itemId));
    // De-dupe defensively: one answer per item, first write wins.
    const seen = new Set<string>();
    return kept.filter((a) => (seen.has(a.itemId) ? false : (seen.add(a.itemId), true)));
  } catch {
    return [];
  }
}

export default function CheckRunner({
  pack,
  items,
  band,
  storageKey,
  onItemAnswered,
  onComplete,
  headerLabel,
}: CheckRunnerProps) {
  const [answers, setAnswers] = useState<MasteryAnswerInput[]>(() => loadSaved(storageKey, items));
  const [acked, setAcked] = useState(false);
  const [anchorOpen, setAnchorOpen] = useState(false);

  // Resume-at-item: the first item without a stored answer (no back path exists).
  const idx = useMemo(() => {
    const answered = new Set(answers.map((a) => a.itemId));
    const first = items.findIndex((i) => !answered.has(i.id));
    return first === -1 ? items.length - 1 : first;
  }, [answers, items]);

  const item = items[idx];
  const done = answers.length >= items.length;

  function handleAnswer(given: string) {
    if (acked || done) return;
    const { correct } = checkAnswer(item.answer, given);
    const entry: MasteryAnswerInput = {
      itemId: item.id,
      answer: given,
      correct,
      errorTag: correct ? undefined : errorTagFor(item, given),
    };
    const next = [...answers, entry];
    setAnswers(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* resume is best-effort */
    }
    onItemAnswered(item, given, correct, entry.errorTag);
    setAcked(true);
  }

  function advance() {
    setAcked(false);
    if (answers.length >= items.length) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* noop */
      }
      onComplete(answers);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-5">
      <header className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">
          {headerLabel} · {Math.min(idx + 1, items.length)} of {items.length}
        </p>
        <button
          type="button"
          onClick={() => setAnchorOpen(true)}
          aria-label="Open the strategy card"
          className="flex h-12 min-w-[48px] items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-3 text-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
        >
          📌
        </button>
      </header>

      <section aria-label="The problem" className="flex flex-col gap-4 rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <p className={cn('flex-1 text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>{promptText(item.prompt)}</p>
          <AudioButton text={speakablePrompt(item.prompt, item.figure?.alt)} band={band} autoplay={band === 'A'} />
        </div>
        <PromptFigure prompt={item.prompt} figure={item.figure} band={band} />
      </section>

      {acked ? (
        <div className="flex flex-col gap-5">
          {/* Feedback held till the end — the same warm-neutral ack every time. */}
          <WrenBubble band={band} text={MODULE_COPY.placementAck[band]} emotion="settled" />
          <button
            type="button"
            onClick={advance}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            {answers.length >= items.length ? 'Hand it to Ms. Wren' : 'Next'}
          </button>
        </div>
      ) : (
        <AnswerEntry item={item} band={band} onSubmit={handleAnswer} />
      )}

      <div className="mt-auto">
        {/* The check had no full-screen pad at all: `item` was never passed, so
            the control that opens it never rendered. A weekly check is exactly
            where a child most needs room to work, and the pinned question adds
            no scaffolding — it is the same question already on the screen.

            `answerSlot` is withheld once the item is acknowledged: at that point
            the page shows the ack and a Next button instead of an answer control,
            and an answer row inside the pad would offer a second chance to
            answer an item already banked. */}
        <BBScratchPad
          itemKey={`check-${item.id}`}
          band={band}
          item={item}
          answerSlot={
            acked
              ? undefined
              : (close) => (
                  <AnswerEntry
                    item={item}
                    band={band}
                    onSubmit={(answer) => {
                      close();
                      handleAnswer(answer);
                    }}
                  />
                )
          }
        />
      </div>

      {/* P7 exception: strategy card only — worked examples hidden, honestly framed. */}
      <AnchorPanel pack={pack} mode="strategy-only" band={band} open={anchorOpen} onClose={() => setAnchorOpen(false)} />
    </div>
  );
}
