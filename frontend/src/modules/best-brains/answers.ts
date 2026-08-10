/**
 * Best Brains-inspired module — client-side answer checking.
 *
 * Evaluates a child's answer against a PackItem's AnswerSpec. Pragmatic and
 * forgiving on surface form (whitespace/case/leading zeros), strict on value.
 * 'manual-review' answers are always acknowledged without grading (Flow 4 law);
 * they return `correct: true` for flow purposes and are flagged `ungraded`.
 */

import type { AnswerSpec, PackItem } from './types';

export interface AnswerCheck {
  correct: boolean;
  /** True for manual-review items: acknowledged, never graded. */
  ungraded: boolean;
}

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseNumeric(s: string): number | null {
  const cleaned = s.trim().replace(/,/g, '');
  // Fraction form a/b
  const frac = cleaned.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const den = Number(frac[2]);
    if (den === 0) return null;
    return Number(frac[1]) / den;
  }
  // Mixed number "a b/c"
  const mixed = cleaned.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const den = Number(mixed[3]);
    if (den === 0) return null;
    const fracPart = Number(mixed[2]) / den;
    return whole < 0 ? whole - fracPart : whole + fracPart;
  }
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function numericEqual(a: string, b: string): boolean {
  const na = parseNumeric(a);
  const nb = parseNumeric(b);
  if (na === null || nb === null) return false;
  return Math.abs(na - nb) < 1e-9;
}

function listEqual(a: string, b: string, ordered: boolean): boolean {
  const split = (s: string) =>
    s
      .split(/[,;]/)
      .map((t) => norm(t))
      .filter(Boolean);
  const la = split(a);
  const lb = split(b);
  if (la.length !== lb.length) return false;
  if (ordered) return la.every((t, i) => t === lb[i]);
  const sb = [...lb].sort();
  return [...la].sort().every((t, i) => t === sb[i]);
}

/** Check a raw answer string against an AnswerSpec. */
export function checkAnswer(spec: AnswerSpec, given: string): AnswerCheck {
  const g = norm(given);
  if (!g) return { correct: false, ungraded: false };

  // Exact surface matches (canonical value or any acceptable form) always pass.
  const surfaces = [spec.value, ...spec.acceptableForms].map(norm);
  if (surfaces.includes(g)) return { correct: true, ungraded: false };

  switch (spec.validation) {
    case 'exact-numeric':
    case 'equivalent-numeric':
    case 'equivalent-fraction': {
      // requireSimplestForm / units nuances are enforced upstream by
      // acceptableForms enumeration; value-equality is the fallback.
      if (spec.requireSimplestForm) return { correct: false, ungraded: false };
      return { correct: numericEqual(spec.value, given), ungraded: false };
    }
    case 'number-sentence': {
      if (spec.orderMatters) return { correct: false, ungraded: false };
      // Accept commuted "a + b = c" ↔ "b + a = c" via acceptableForms first;
      // fallback: strip spaces and compare.
      return { correct: norm(spec.value).replace(/\s/g, '') === g.replace(/\s/g, ''), ungraded: false };
    }
    case 'choice-key':
      return { correct: g === norm(spec.value), ungraded: false };
    case 'short-text-keyword': {
      const keywords = [spec.value, ...spec.acceptableForms].map(norm).filter(Boolean);
      return { correct: keywords.some((k) => g.includes(k)), ungraded: false };
    }
    case 'ordered-list':
      return { correct: listEqual(spec.value, given, true), ungraded: false };
    case 'set':
      return { correct: listEqual(spec.value, given, false), ungraded: false };
    case 'manual-review':
      // Acknowledged without grading (Flow 4 / PuzzleGrove law).
      return { correct: true, ungraded: true };
    default:
      return { correct: false, ungraded: false };
  }
}

/**
 * Band-A tap options for a numeric item without authored choices: the correct
 * answer plus deterministic near-miss distractors, in an order derived from the
 * item id (stable across renders — P2 calm).
 *
 * ── THE RANK BUG THIS FIXES (2026-08-10) ────────────────────────────────────
 * The previous build seeded `{answer}` and walked deltas [1, -1, 2, -2, 3],
 * stopping at four options. That always produced {answer−1, answer, answer+1,
 * answer+2} — so THE ANSWER WAS THE SECOND-SMALLEST BUTTON ON EVERY ITEM. For
 * an answer of 5 the child saw 4, 5, 6, 7; for 9, 8, 9, 10, 11. Measured across
 * every authored Level-A week: 7,440 items, 100.0% at rank 2.
 *
 * That is 238 of 448 band-A items — over half the level — answerable by tapping
 * the second-smallest number without counting anything.
 *
 * It survived because it lives HERE. `bb-answer-entropy-test` reads the
 * AUTHORED `choices` in a pack; these options never exist in content, they are
 * built in the display layer at the moment the page is drawn, so every
 * "0 guessable slots" pass was blind to them. Two weeks' authors had just moved
 * their mastery slots to free-entry numerics — the correct fix for a dead
 * option on the content side — and routed them straight into this.
 *
 * The fix rotates the answer's rank BY VALUE (how many options sit below it)
 * and keeps the existing positional shuffle, because a child can play either
 * habit: "tap the second-smallest number" and "tap the second button" are
 * different shortcuts and both have to fail. Everything stays a pure function
 * of the item id, so a page is identical on every render (P2).
 *
 * `answer − below` may not go negative, so a very small answer cannot carry
 * three options beneath it; the rank is clamped, never wrapped, and the shortfall
 * is made up above. That clamp is why small answers still skew low, which is
 * arithmetic rather than a choice — at band A the honest mitigation is authored
 * choices, and this path exists only for items that have none.
 */
export function tapOptionsFor(item: PackItem): number[] | null {
  const answer = parseNumeric(item.answer.value);
  if (answer === null || !Number.isInteger(answer) || answer < 0) return null;

  /**
   * The hash must include the ANSWER, not just the item id — and the entropy
   * gate caught the first version of this fix for exactly that reason.
   *
   * An item id is FIXED for a slot ("A1-MA-01" every time), so hashing the id
   * alone rotated the rank ACROSS slots while freezing it WITHIN one: slot
   * formA[0] keyed the 2nd-smallest on 100% of 120 draws, formB[0] the smallest
   * on 100%. Aggregated over a page that looked balanced (28.7% best shortcut),
   * which is precisely the per-pack-vs-per-draw confusion of L52, mirrored — and
   * it matters here because a child RE-SITS a mastery form on the corrective
   * pass, meeting the same slot again.
   *
   * Folding the answer in makes the rank move with the draw while keeping the
   * function pure in the item, so a page is still identical on every render (P2).
   */
  let h = 0;
  for (const ch of `${item.id}:${String(answer)}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;

  const TOTAL = 4;
  // How many of the three distractors sit BELOW the answer: 0..3, rotated per
  // item, clamped so no option is negative. This is the rank rotation.
  const below = Math.min(h % TOTAL, answer);
  const above = TOTAL - 1 - below;

  const opts: number[] = [answer];
  for (let d = 1; d <= below; d++) opts.push(answer - d);
  for (let d = 1; d <= above; d++) opts.push(answer + d);
  // If the clamp cost us options (tiny answers), top up above rather than leave
  // a short page.
  for (let d = above + 1; opts.length < TOTAL; d++) opts.push(answer + d);

  // Positional shuffle, so "tap the Nth button" is a separate losing habit.
  return opts.sort((a, b) => (((a * 2654435761 + h) >>> 8) % 1000) - (((b * 2654435761 + h) >>> 8) % 1000));
}
