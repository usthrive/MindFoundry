/**
 * CheckReview — "Let's look at these together": going over the paper after the
 * weekly check (owner "go", 2026-09-26). Logic: ../session/checkReview.ts.
 *
 * Each missed question comes back, one at a time:
 *   · the question, read again (autoplayed at band A);
 *   · what he answered on the check, said plainly — never "wrong";
 *   · one guiding step: the item's own first hint rung (a census of all 1,404
 *     check items found none whose first two rungs state the answer);
 *   · another go. Right → a warm confirm. Not yet → the next step, then, if
 *     still stuck, the answer with its reasoning (the DD13 miss protocol).
 * The score never changes; this is teaching after the measuring. Every
 * re-answer is recorded with the number of steps he needed before it.
 */
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CONFIRMS, MISS_OPENER, type InteractionBand } from '../copy';
import { checkAnswer } from '../answers';
import { promptText, speakablePrompt } from '../figures/prompt';
import { PromptFigure } from './figures/BBFigureView';
import AnswerEntry from './AnswerEntry';
import AudioButton from './AudioButton';
import WrenBubble from './WrenBubble';
import { answerAsShown, reviewSteps } from '../session/checkReview';
import type { PackItem } from '../types';

export interface CheckReviewMiss {
  item: PackItem;
  /** His answer on the check (a choice key for choice items). */
  answer: string;
}

export interface CheckReviewProps {
  misses: CheckReviewMiss[];
  band: InteractionBand;
  /** Where this review sits: right after the check, or opening the strengthening round. */
  when: 'after-check' | 'before-strengthening';
  /** Record one re-answer: correct or not, and how many guiding steps were showing. */
  onReAnswer: (item: PackItem, answer: string, correct: boolean, stepsShown: number) => void;
  onDone: () => void;
}

const INTRO: Record<'after-check' | 'before-strengthening', Record<InteractionBand, (n: number) => string>> = {
  'after-check': {
    A: () => "Let's look at these together!",
    B: (n) => `All done! Let's look at ${n === 1 ? 'one' : n === 2 ? 'two' : 'a few'} together before we go.`,
    C: (n) => `Done. Let's go over ${n === 1 ? 'the one' : `the ${n}`} that didn't land yet.`,
  },
  'before-strengthening': {
    A: () => "First, let's look at the last page!",
    B: (n) => `Before we practise, let's look at ${n === 1 ? 'one' : n === 2 ? 'two' : 'a few'} from the last page.`,
    C: (n) => `First, the ${n === 1 ? 'question' : `${n} questions`} from the last page that didn't land yet.`,
  },
};

function yourAnswerLine(item: PackItem, answer: string, band: InteractionBand): string {
  const shown = answerAsShown(item, answer)
  if (!shown.trim()) return 'Last time this one was left empty.'
  if (item.choices?.length) return band === 'A' ? `Last time you picked ${shown}.` : `On the last page you chose ${shown}.`
  return band === 'A' ? `Last time you said ${shown}.` : `On the last page you wrote ${shown}.`
}

type Phase = { kind: 'asking' } | { kind: 'right'; text: string } | { kind: 'shown'; text: string };

export default function CheckReview({ misses, band, when, onReAnswer, onDone }: CheckReviewProps) {
  const [idx, setIdx] = useState(0);
  const [steps, setSteps] = useState(1);
  const [tries, setTries] = useState(0);
  const [phase, setPhase] = useState<Phase>({ kind: 'asking' });

  const miss = misses[Math.min(idx, misses.length - 1)];
  if (!miss) return null;
  const { item } = miss;
  const available = reviewSteps(item);
  const shownSteps = available.slice(0, Math.min(steps, available.length));
  const last = idx + 1 >= misses.length;

  function handle(answer: string) {
    if (phase.kind !== 'asking') return;
    const { correct } = checkAnswer(item.answer, answer);
    onReAnswer(item, answer, correct, shownSteps.length);
    if (correct) {
      setPhase({ kind: 'right', text: CONFIRMS[band][idx % CONFIRMS[band].length] });
      return;
    }
    const nextTries = tries + 1;
    setTries(nextTries);
    if (steps < available.length) {
      setSteps(steps + 1);
      return;
    }
    // Every step has been tried: show the answer with its reasoning, never a bare mark.
    const reasoning = item.hintLadder[item.hintLadder.length - 1] ?? '';
    setPhase({ kind: 'shown', text: `${MISS_OPENER[band]} ${reasoning} It comes to ${answerAsShown(item, item.answer.value)}.` });
  }

  function next() {
    if (last) { onDone(); return; }
    setIdx(idx + 1);
    setSteps(1);
    setTries(0);
    setPhase({ kind: 'asking' });
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-5" data-check-review>
      <header className="flex items-center justify-between">
        <p className="mf-label">Looking back · {idx + 1} of {misses.length}</p>
      </header>

      {idx === 0 && phase.kind === 'asking' && steps === 1 && (
        <WrenBubble band={band} autoplay={band === 'A'} text={INTRO[when][band](misses.length)} emotion="warm" />
      )}

      <section aria-label="The question" className="mf-card-quiet flex flex-col gap-4 p-6">
        <div className="flex items-start gap-3">
          <p className={cn('flex-1 whitespace-pre-line text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>
            {promptText(item.prompt)}
          </p>
          <AudioButton text={speakablePrompt(item.prompt, item.figure?.alt, item.statements)} band={band} autoplay={band === 'A' && idx > 0} />
        </div>
        <PromptFigure prompt={item.prompt} figure={item.figure} band={band} />
      </section>

      <p className="text-base font-medium text-text-secondary" data-review-your-answer>
        {yourAnswerLine(item, miss.answer, band)}
      </p>

      {phase.kind === 'asking' && (
        <>
          <ol className="flex flex-col gap-2" aria-label="Look again">
            {shownSteps.map((s, i) => (
              <li key={i} data-review-step={i + 1} className="flex items-start gap-3 rounded-2xl bg-secondary-light/60 p-4">
                <span aria-hidden="true" className="mt-0.5 text-lg">🔎</span>
                <p className="flex-1 text-lg text-text-primary">{s}</p>
                {/* A newly opened step is read aloud at band A; step 1 is not, so it
                    never races the question's own read-aloud (the 2026-09-04 lesson). */}
                <AudioButton text={s} band={band} autoplay={band === 'A' && i > 0 && i === shownSteps.length - 1} />
              </li>
            ))}
          </ol>
          {tries > 0 && <WrenBubble band={band} text={MISS_OPENER[band]} emotion="curious" />}
          <AnswerEntry key={`${item.id}-${tries}`} item={item} band={band} onSubmit={handle} />
        </>
      )}

      {phase.kind !== 'asking' && (
        <div className="flex flex-col gap-5">
          <WrenBubble band={band} autoplay text={phase.text} emotion={phase.kind === 'right' ? 'warm' : 'curious'} />
          <button
            type="button"
            onClick={next}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            {last ? (when === 'after-check' ? 'On we go' : 'Ready to practise') : 'Next one'}
          </button>
        </div>
      )}
    </div>
  );
}
