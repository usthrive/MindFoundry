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

/** Validations whose answer is text-shaped and cannot be produced on a NumberPad. */
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

  // 2. Band A: acknowledge-only, then generated tap targets.
  if (band === 'A') {
    if (item.answer.validation === 'manual-review') return { kind: 'ack' };
    const options = tapOptionsFor(item);
    if (options) return { kind: 'tap', options: options.map(String) };
    // Non-numeric band-A items with no choices fall through to typed entry.
  }

  // 3. Band C, or any answer whose shape is text.
  if (band === 'C' || needsTypedEntry(item)) return { kind: 'text' };

  // 4. Otherwise the NumberPad.
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
    case 'pad':
      return `NumberPad {${[...s.alphabet].sort().join('')}} max ${s.maxDigits} digits`;
    case 'text':
      return 'free text';
  }
}
