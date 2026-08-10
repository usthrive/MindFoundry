/**
 * AnswerEntry — the band input law (P10) for one PackItem:
 *   A: tap-first (authored choices or generated tap options; oversized targets)
 *   B: NumberPad numeric entry with a framed answer box
 *   C: symbolic/typed entry
 * Multiple-choice items render tappable choices at every band (recognition
 * items are authored as such upstream). Presentational: emits the raw answer
 * string; the container checks it and owns feedback.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import NumberPad from '@/components/input/NumberPad';
import type { InteractionBand } from '../copy';
import type { PackItem } from '../types';
import { tapOptionsFor } from '../answers';

export interface AnswerEntryProps {
  item: PackItem;
  band: InteractionBand;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  className?: string;
}

function needsTypedEntry(item: PackItem): boolean {
  return ['short-text-keyword', 'ordered-list', 'set', 'manual-review', 'number-sentence'].includes(
    item.answer.validation,
  );
}

export default function AnswerEntry({ item, band, onSubmit, disabled, className }: AnswerEntryProps) {
  const [value, setValue] = useState('');

  // Fresh entry per item (P2: one problem in focus).
  useEffect(() => {
    setValue('');
  }, [item.id]);

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
          placeholder="Your answer"
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
          else setValue((v) => (v.length < 8 ? `${v}${n}` : v));
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
