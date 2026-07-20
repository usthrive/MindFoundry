/**
 * Shared assembly helpers for week-content template modules.
 *
 * Conventions enforced here (so every week module inherits them):
 *  - Content ids follow <Level><Week>-<slot>-<nn> (schema contentId pattern).
 *  - Operand-surface freshness: every parameterized draw goes through a
 *    TupleGuard so no operand tuple repeats inside a pack (QG-1) and Form B
 *    stays surface-disjoint from Form A and the daily pages (QG-4).
 *  - GeneratorSpec seeds come from the slot's named RNG stream (provenance).
 */

import type {
  BBLevel,
  Choice,
  DayFocus,
  ErrorTag,
  PackDay,
  PackItem,
} from '../../types';
import { Rng } from '../rng';

/** A PackItem minus its id — ids are assigned at day/section assembly time. */
export type ItemDraft = Omit<PackItem, 'id'>;

export function contentId(level: BBLevel, week: number, slot: string, nn: number): string {
  return `${level}${week}-${slot}-${String(nn).padStart(2, '0')}`;
}

export function makeDay(
  level: BBLevel,
  week: number,
  day: number,
  focus: DayFocus,
  pageCount: number,
  drafts: ItemDraft[],
  teacherNoteStrip?: string,
): PackDay {
  const items: PackItem[] = drafts.map((draft, i) => ({
    id: contentId(level, week, `D${day}`, i + 1),
    ...draft,
  }));
  const result: PackDay = { day, focus, pageCount, items };
  if (teacherNoteStrip !== undefined) result.teacherNoteStrip = teacherNoteStrip;
  return result;
}

export function makeMasteryItems(
  level: BBLevel,
  week: number,
  form: 'MA' | 'MB',
  drafts: ItemDraft[],
): PackItem[] {
  return drafts.map((draft, i) => ({
    id: contentId(level, week, form, i + 1),
    ...draft,
  }));
}

/** Tracks used operand tuples so surfaces stay fresh across the whole pack. */
export class TupleGuard {
  private seen = new Set<string>();

  taken(sig: string): boolean {
    return this.seen.has(sig);
  }

  add(sig: string): void {
    this.seen.add(sig);
  }
}

/**
 * Draw parameters until the signature is unused (deterministic: pure function
 * of the rng stream). After maxTries the last draw is accepted — param ranges
 * in the week modules are sized so this is unreachable in practice.
 */
export function drawFresh<T>(
  rng: Rng,
  guard: TupleGuard,
  sample: (rng: Rng) => T,
  sigOf: (v: T) => string,
  maxTries = 60,
): T {
  let value = sample(rng);
  for (let i = 0; i < maxTries && guard.taken(sigOf(value)); i++) {
    value = sample(rng);
  }
  guard.add(sigOf(value));
  return value;
}

/** Build a shuffled multiple-choice block with exactly one correct choice. */
export function makeChoices(
  rng: Rng,
  correct: string,
  distractors: Array<{ text: string; errorTag: ErrorTag; rationale: string }>,
): { choices: Choice[]; correctKey: string } {
  const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const entries: Array<Omit<Choice, 'key'>> = [
    { text: correct, isCorrect: true },
    ...distractors.map((d) => ({
      text: d.text,
      isCorrect: false,
      errorTag: d.errorTag,
      rationale: d.rationale,
    })),
  ];
  const shuffled = rng.shuffle(entries);
  const choices = shuffled.map((entry, i) => ({ key: KEYS[i], ...entry }));
  const correctKey = choices.find((c) => c.isCorrect)?.key ?? 'A';
  return { choices, correctKey };
}

// ---------------------------------------------------------------------------
// Number words (0–999) — for read/write-the-numeral templates
// ---------------------------------------------------------------------------

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];

export function numberWords(n: number): string {
  if (n < 0 || n > 999 || !Number.isInteger(n)) {
    throw new Error(`numberWords supports integers 0–999, got ${n}`);
  }
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return rest === 0 ? `${ONES[h]} hundred` : `${ONES[h]} hundred ${numberWords(rest)}`;
}

/** Small-number word (for acceptableForms on Level A answers). */
export function smallWord(n: number): string {
  return ONES[n] ?? String(n);
}
