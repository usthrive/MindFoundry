/**
 * AnswerEntry — the band input law (P10) for one PackItem:
 *   A: tap-first (authored choices or generated tap options; oversized targets)
 *   B: NumberPad numeric entry with a framed answer box
 *   C: symbolic/typed entry
 * Multiple-choice items render tappable choices at every band (recognition
 * items are authored as such upstream). Presentational: emits the raw answer
 * string; the container checks it and owns feedback.
 *
 * TWO SHAPES CUT ACROSS THE BANDS (owner ruling 2026-09-22), because what the
 * ITEM asks for outranks how old the child is:
 *   truth-set      one True/False row per claim, at every band;
 *   manual-review  an explain box that says "Tell Ms. Wren", never "Check",
 *                  at bands B and C (band A keeps its "I did it!" tap).
 * Both sit ahead of the typed branch here and in `inputSurfaceFor`, IN THE SAME
 * ORDER — the branch order is the law the answerability gate reads.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import NumberPad from '@/components/input/NumberPad';
import type { InteractionBand } from '../copy';
import type { AnswerValidation, PackItem } from '../types';
import { tapOptionsFor } from '../answers';
import { needsTypedEntry, PAD_MAX_DIGITS } from '../inputSurface';

/**
 * THE PLACEHOLDER SAYS THE SHAPE OF THE ANSWER (owner ruling 2026-09-22).
 *
 * Every typed box in the module said "Your answer", which tells a child
 * nothing and is actively misleading where the marker is picky: `ordered-list`
 * and `set` split the entry on commas and semicolons (`listEqual`, answers.ts),
 * so a child who writes "3 7 12" is marked wrong for a formatting rule nobody
 * told them. A placeholder is the cheapest possible place to state it, and the
 * example is written in the EXACT separator the marker accepts.
 *
 * Exported so `bb-screen-contract-test`'s `typed-format-hint` check can assert
 * the table rather than re-describe it — the inputSurface law again: one
 * statement, read by both the child's screen and the gate.
 */
export function placeholderFor(validation: AnswerValidation, band: InteractionBand): string {
  switch (validation) {
    case 'manual-review':
      // The explain surface. Bands differ because the demand does: at B the ask
      // is to say it at all, at C to say it in shape.
      return band === 'C' ? 'Explain in a sentence or two.' : 'In your own words…';
    case 'short-text-keyword':
      return 'A few words';
    case 'ordered-list':
    case 'set':
      // `listEqual` splits on , and ; — so the example uses a comma.
      return 'e.g. 3, 7, 12';
    case 'number-sentence':
      // `checkAnswer` strips spaces and compares the whole sentence, so the
      // example carries the "=" and the result, not just the operands.
      return 'e.g. 4 + 3 = 7';
    default:
      // Numeric shapes (exact/equivalent numeric, equivalent fraction) and the
      // surfaces that never reach a text box (choice-key, truth-set): a number
      // needs no format hint, and "Your answer" is honest about a number.
      return 'Your answer';
  }
}

export interface AnswerEntryProps {
  item: PackItem;
  band: InteractionBand;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function AnswerEntry({ item, band, onSubmit, disabled, className }: AnswerEntryProps) {
  const [value, setValue] = useState('');
  /** One judgement per `item.statements` row; null until the child chooses. */
  const [truth, setTruth] = useState<Array<'T' | 'F' | null>>([]);

  // Fresh entry per item (P2: one problem in focus).
  useEffect(() => {
    setValue('');
    setTruth((item.statements ?? []).map(() => null));
  }, [item.id, item.statements]);

  // H2: clear the buffer the moment an answer is submitted, so a miss never
  // leaves stale digits to merge into the next attempt (Maya's phantom "82…").
  // Editing in progress is untouched — the buffer only clears on commit.
  function submit(answer: string) {
    onSubmit(answer);
    setValue('');
  }

  // --- Multiple choice (any band; oversized at A) --------------------------
  if (item.choices && item.choices.length > 0) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {item.choices.map((choice) => (
          <button
            key={choice.key}
            type="button"
            disabled={disabled}
            onClick={() => onSubmit(choice.key)}
            className={cn(
              'flex items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-4 text-left',
              'transition-all hover:border-primary/40 hover:bg-primary-light active:scale-[0.99]',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation select-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              band === 'A' ? 'min-h-[72px] text-xl' : 'min-h-[56px] text-lg',
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-text-secondary">
              {choice.key}
            </span>
            <span className="text-text-primary">{choice.text}</span>
          </button>
        ))}
      </div>
    );
  }

  /**
   * --- The truth form: one row per claim, at every band ---------------------
   *
   * WHY A FORM AND NOT A PARAGRAPH (owner ruling 2026-09-22, from B3-D5-03).
   * "Three sentences are on the board. 62 > 58. 71 < 68. 45 = 45. Write TRUE
   * beside each sentence that is true…" asked for three judgements and offered
   * one blank line. The child cannot write beside anything — there is nothing
   * to write beside — and the marker could not read what they wrote anyway.
   *
   * So the claims become rows and the judgement becomes a pair of buttons. Each
   * claim is at least text-lg (2xl at band A) because it is the thing being
   * READ; the buttons are ≥48×48 at every band because they are the thing being
   * TAPPED, and the selected one is filled rather than merely outlined so the
   * state survives a glance. `aria-pressed` carries the same state to a screen
   * reader, and `Check` stays disabled until every row has been answered — a
   * half-filled row is an unfinished answer, not a partial one.
   */
  if (item.answer.validation === 'truth-set') {
    const statements = item.statements ?? [];
    const complete = statements.length > 0 && truth.length === statements.length && truth.every(Boolean);
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {statements.map((text, i) => (
          <div
            key={`${item.id}-s${i}`}
            data-bb-statement={i}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3"
          >
            <span className={cn('flex-1 font-semibold text-text-primary', band === 'A' ? 'text-2xl' : 'text-lg')}>
              {text}
            </span>
            <div className="flex shrink-0 gap-2">
              {(['T', 'F'] as const).map((t) => {
                const selected = truth[i] === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    aria-label={`${text} — ${t === 'T' ? 'True' : 'False'}`}
                    onClick={() => setTruth((prev) => prev.map((v, j) => (j === i ? t : v)))}
                    className={cn(
                      'flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl px-4 text-lg font-semibold',
                      'transition-all active:scale-95 touch-manipulation select-none',
                      'focus:outline-none focus:ring-2 focus:ring-primary/40',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      selected
                        ? 'bg-primary text-white shadow-md'
                        : 'border-2 border-gray-200 bg-white text-text-primary hover:border-primary/40',
                    )}
                  >
                    {t === 'T' ? 'True' : 'False'}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled || !complete}
          onClick={() => {
            if (!complete) return;
            onSubmit(truth.join(','));
            setTruth(statements.map(() => null));
          }}
          className={cn(
            'min-h-[52px] rounded-2xl bg-primary px-6 font-semibold text-white shadow-md',
            'transition-all hover:bg-primary-hover active:scale-[0.99]',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          Check
        </button>
      </div>
    );
  }

  // --- A band: tap options for numeric answers -----------------------------
  if (band === 'A') {
    /**
     * UNGRADED BAND-A TASKS ARE ACKNOWLEDGED, NEVER TYPED.
     *
     * `manual-review` is the make/show/tell form: "Draw 3 counters in the
     * frame", "Sort them, fewest first. Tell how you know." `checkAnswer`
     * already returns `{correct: true, ungraded: true}` for it — the item cannot
     * affect a score — and yet the entry fell through to a TEXT BOX, so a
     * three-to-five-year-old who cannot read was shown a keyboard for a task
     * that was not being marked. 22 such items across the authored Level-A
     * weeks.
     *
     * The maths here is the doing and the telling, both of which happen away
     * from the screen. So the screen's only job is to let him say he has
     * finished, in one oversized tap, with no adult in the loop — the prompt is
     * already read aloud to him, and nothing he does here can be wrong.
     */
    if (item.answer.validation === 'manual-review') {
      return (
        <div className={cn('flex justify-center', className)}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSubmit('done')}
            className={cn(
              'flex min-h-[96px] items-center justify-center gap-3 rounded-3xl bg-white px-10',
              'text-3xl font-bold text-text-primary shadow-lg',
              'transition-all hover:scale-105 hover:bg-gray-50 active:scale-95',
              'focus:outline-none focus:ring-4 focus:ring-primary/40 touch-manipulation select-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            aria-label="I did it"
          >
            <span aria-hidden="true">✓</span>
            <span>I did it!</span>
          </button>
        </div>
      );
    }

    const options = tapOptionsFor(item);
    if (options) {
      return (
        <div className={cn('flex flex-wrap justify-center gap-4', className)}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSubmit(String(opt))}
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-bold text-text-primary shadow-lg',
                'transition-all hover:scale-105 hover:bg-gray-50 active:scale-95',
                'focus:outline-none focus:ring-4 focus:ring-primary/40 touch-manipulation select-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              aria-label={`Answer ${opt}`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    // Non-numeric A-band items without choices fall through to typed entry
    // (rare; authored packs keep A tappable).
  }

  /**
   * --- Bands B and C: the honest explain-it control -------------------------
   *
   * THE BUTTON MUST NOT SAY "CHECK" (owner ruling 2026-09-22). `checkAnswer`
   * returns `{correct: true, ungraded: true}` for every `manual-review` item —
   * it does not read the text, it cannot read the text, and no score moves
   * whatever is typed. The band-A half of this was fixed in 2026-08 with the
   * "I did it!" tap; bands B and C were left falling through to the typed
   * branch, so a six-year-old on B3-D5-03 was shown a one-line box and a button
   * marked **Check** for an argument nothing marks. 147 items corpus-wide,
   * none of them in a mastery check, none of them ever marked.
   *
   * What is true is that the writing GOES SOMEWHERE — to a person — so the
   * primary button says so. The second button exists because this task is
   * meant to be done out loud, at the table, to whoever is there; before it,
   * the only way past the screen was to type something you had already said.
   * A textarea rather than an input because an argument is two sentences, not
   * one line, and a box the size of the expected answer is itself instruction.
   */
  if (item.answer.validation === 'manual-review') {
    return (
      <form
        className={cn('flex flex-col gap-3', className)}
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) submit(value);
        }}
      >
        <textarea
          rows={2}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholderFor('manual-review', band)}
          aria-label="Your explanation"
          className={cn(
            'min-h-[96px] rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-lg text-text-primary',
            'focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
            'disabled:opacity-50',
          )}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={cn(
            'min-h-[52px] rounded-2xl bg-primary px-6 font-semibold text-white shadow-md',
            'transition-all hover:bg-primary-hover active:scale-[0.99]',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          Tell Ms. Wren
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => submit('said-aloud')}
          className={cn(
            'min-h-[52px] rounded-2xl border-2 border-gray-200 bg-white px-6 font-semibold text-text-primary',
            'transition-all hover:border-primary/40 hover:bg-primary-light active:scale-[0.99]',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          I said it out loud
        </button>
      </form>
    );
  }

  // --- C band or text-shaped answers: typed entry --------------------------
  if (band === 'C' || needsTypedEntry(item)) {
    return (
      <form
        className={cn('flex flex-col gap-3', className)}
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) submit(value);
        }}
      >
        <input
          type="text"
          inputMode={['exact-numeric', 'equivalent-numeric'].includes(item.answer.validation) ? 'decimal' : 'text'}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholderFor(item.answer.validation, band)}
          aria-label="Your answer"
          className={cn(
            'min-h-[56px] rounded-2xl border-2 border-gray-200 bg-white px-4 text-lg text-text-primary',
            'focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
            'disabled:opacity-50',
          )}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={cn(
            'min-h-[52px] rounded-2xl bg-primary px-6 font-semibold text-white shadow-md',
            'transition-all hover:bg-primary-hover active:scale-[0.99]',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          Check
        </button>
      </form>
    );
  }

  // --- B band (and A fallback for numerals): NumberPad ---------------------
  // Reference dress: dashed teal answer box, warm tray behind the keys.
  return (
    <div className={cn('mf-pad-tray flex flex-col items-center gap-3', className)}>
      <div
        aria-label="Your answer so far"
        className="flex min-h-[60px] w-full max-w-[240px] items-center justify-center rounded-xl border-[2.5px] border-dashed border-primary bg-white text-3xl font-bold text-text-primary"
      >
        {value || <span className="text-text-muted">&nbsp;</span>}
      </div>
      <NumberPad
        onNumberClick={(n) => {
          if (n === -1) setValue((v) => (v.startsWith('-') ? v.slice(1) : `-${v}`));
          else if (n === -2) setValue((v) => (v.includes('.') ? v : `${v}.`));
          else if (n === -3) setValue((v) => (v.includes('/') ? v : `${v}/`));
          else setValue((v) => (v.length < PAD_MAX_DIGITS ? `${v}${n}` : v));
        }}
        onBackspace={() => setValue((v) => v.slice(0, -1))}
        onClear={() => setValue('')}
        onSubmit={() => {
          if (value.trim()) submit(value);
        }}
        allowDecimal={item.answer.validation === 'equivalent-numeric'}
        allowFraction={item.answer.validation === 'equivalent-fraction'}
        disabled={disabled}
      />
    </div>
  );
}
