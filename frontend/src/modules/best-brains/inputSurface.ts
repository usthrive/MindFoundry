/**
 * THE INPUT SURFACE LAW — what a child can physically enter for one item.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * Every defect my son has found has been one shape: A QUESTION NO ONE COULD
 * HAVE ANSWERED, which the app then marks him wrong for. A division answer of
 * "13 R 1" on a pad with no R key. A 4-digit product with two answer boxes. A
 * Level G answer of "y = 5x + 2" on a digits-only pad. A scene that existed
 * only as an [image: …] stage direction and was never drawn.
 *
 * Those were treated as six bugs and fixed six times. They are ONE bug: the
 * surface that ACCEPTS the answer and the content that STORES the answer were
 * described in two different places, and nothing compared them.
 *
 * So the description now lives HERE, once. `AnswerEntry` renders from it and
 * `bb-answerability-gate` asserts against it. A gate that re-implemented the
 * rule would drift from the component the first time someone changed a prop —
 * which is exactly how the figure census printed "un-migrated [image:] 1" on
 * every green run for weeks. The gate must read the SAME law the child meets,
 * not a copy of it.
 */

import type { InteractionBand } from './copy';
import type { PackItem, AnswerSpec } from './types';
import { tapOptionsFor } from './answers';

/**
 * Validations whose answer is text-shaped and cannot be produced on a NumberPad.
 *
 * `manual-review` stays on this list because the statement is still TRUE of it
 * — it is text-shaped and a pad cannot produce it — but since 2026-09-22 it is
 * intercepted earlier (rule 3 at band A, rule 4 at bands B/C) and never reaches
 * the typed branch. The list is what the pad CANNOT do, not a routing table.
 */
const TYPED_VALIDATIONS = [
  'short-text-keyword',
  'ordered-list',
  'set',
  'manual-review',
  'number-sentence',
] as const;

export function needsTypedEntry(item: { answer: Pick<AnswerSpec, 'validation'> }): boolean {
  return (TYPED_VALIDATIONS as readonly string[]).includes(item.answer.validation);
}

export type InputSurface =
  /** Tappable authored choices — the child submits a choice KEY, never a value. */
  | { kind: 'choices'; keys: string[] }
  /** Band-A generated tap targets — the child submits one of these exact numerals. */
  | { kind: 'tap'; options: string[] }
  /** Band-A ungraded make/show/tell — one oversized "I did it!" button. */
  | { kind: 'ack' }
  /**
   * `n` True/False rows — the child submits one judgement per statement, as
   * `T,F,…`. A CLOSED SET like `choices`: nothing else is enterable.
   */
  | { kind: 'truth'; n: number }
  /**
   * Bands B/C ungraded explain-it — a textarea plus "Tell Ms. Wren" and "I said
   * it out loud". Distinct from `text` because NOTHING IS BEING MARKED: the
   * surface must not offer a "Check" button, and the gate must not read it as a
   * graded typed box (2026-09-22 ruling — see `inputSurfaceFor`).
   */
  | { kind: 'explain' }
  /** NumberPad. `alphabet` is every character the pad can emit — nothing else exists. */
  | { kind: 'pad'; alphabet: Set<string>; maxDigits: number }
  /** Free text field — any character is reachable via the device keyboard. */
  | { kind: 'text' };

/**
 * The pad's digit cap. `AnswerEntry` guards digit appends with `v.length < 8`,
 * so a 9-digit answer can never be assembled however long the child persists.
 */
export const PAD_MAX_DIGITS = 8;

/**
 * Which surface does this item actually put in front of this child?
 *
 * Mirrors `AnswerEntry`'s render branches in order. `AnswerEntry` imports this
 * rather than repeating the branches, so the two cannot disagree.
 */
export function inputSurfaceFor(item: PackItem, band: InteractionBand): InputSurface {
  // 1. Authored multiple choice wins at every band.
  if (item.choices && item.choices.length > 0) {
    return { kind: 'choices', keys: item.choices.map((c) => c.key) };
  }

  // 2. The truth form, at EVERY band. A row of True/False buttons is the one
  // control a four-year-old and a twelve-year-old can both work, so unlike the
  // other shapes it does not vary by band — only its type size does.
  if (item.answer.validation === 'truth-set') {
    return { kind: 'truth', n: item.statements?.length ?? 0 };
  }

  // 3. Band A: acknowledge-only, then generated tap targets.
  if (band === 'A') {
    if (item.answer.validation === 'manual-review') return { kind: 'ack' };
    const options = tapOptionsFor(item);
    if (options) return { kind: 'tap', options: options.map(String) };
    // Non-numeric band-A items with no choices fall through to typed entry.
  }

  /**
   * 4. Bands B and C: an ungraded explain-it task gets the EXPLAIN surface, not
   * a graded text box.
   *
   * The band-A half of this was fixed in 2026-08 ("I did it!", rule 3 above)
   * and the same argument was never carried up the ladder, so B3-D5-03 — a
   * make-an-argument task that `checkAnswer` cannot mark and does not try to —
   * put a one-line box and a button reading **Check** in front of a
   * six-year-old. The word is a lie about what happens next: nothing is
   * checked, and the child who writes nothing is told to try again by a form
   * that had already decided to accept whatever came. 147 items corpus-wide
   * validate as manual-review and none of them was ever marked.
   *
   * So the surface says what is true: room to write, a button that SENDS it to
   * a person ("Tell Ms. Wren"), and a second button for the child who did the
   * telling out loud, which is how this task is meant to be done away from the
   * screen. The gate `control-honesty` asserts no manual-review item can reach
   * `text` or `pad` at any band.
   */
  if (item.answer.validation === 'manual-review') return { kind: 'explain' };

  // 5. Band C, or any other answer whose shape is text.
  if (band === 'C' || needsTypedEntry(item)) return { kind: 'text' };

  // 6. Otherwise the NumberPad.
  //
  // THE ALPHABET IS THE WHOLE POINT. `AnswerEntry` passes `allowDecimal` only
  // for 'equivalent-numeric' and `allowFraction` only for 'equivalent-fraction',
  // and passes NEITHER `allowNegative` NOR `allowRemainder` at all — so on this
  // pad a minus sign and an R are not merely discouraged, they do not exist.
  // Any stored answer needing one is unanswerable, and the gate says so.
  const alphabet = new Set('0123456789'.split(''));
  if (item.answer.validation === 'equivalent-numeric') alphabet.add('.');
  if (item.answer.validation === 'equivalent-fraction') alphabet.add('/');
  return { kind: 'pad', alphabet, maxDigits: PAD_MAX_DIGITS };
}

/** Human-readable surface name for gate output. */
export function describeSurface(s: InputSurface): string {
  switch (s.kind) {
    case 'choices':
      return `choice keys [${s.keys.join(' ')}]`;
    case 'tap':
      return `tap targets [${s.options.join(' ')}]`;
    case 'ack':
      return '"I did it!" (ungraded)';
    case 'truth':
      return `${s.n} True/False rows`;
    case 'explain':
      return 'explain box + "Tell Ms. Wren" (ungraded)';
    case 'pad':
      return `NumberPad {${[...s.alphabet].sort().join('')}} max ${s.maxDigits} digits`;
    case 'text':
      return 'free text';
  }
}
