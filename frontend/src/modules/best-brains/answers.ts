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
 * Band-A tap options for a numeric item without authored choices:
 * the correct answer plus deterministic near-miss distractors, order
 * derived from the item id (stable across renders — P2 calm).
 */
export function tapOptionsFor(item: PackItem): number[] | null {
  const answer = parseNumeric(item.answer.value);
  if (answer === null || !Number.isInteger(answer)) return null;
  const opts = new Set<number>([answer]);
  const deltas = [1, -1, 2, -2, 3];
  for (const d of deltas) {
    if (opts.size >= 4) break;
    const v = answer + d;
    if (v >= 0) opts.add(v);
  }
  // Stable pseudo-shuffle keyed on the item id.
  let h = 0;
  for (const ch of item.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return [...opts].sort((a, b) => ((a * 2654435761 + h) >>> 8) % 1000 - ((b * 2654435761 + h) >>> 8) % 1000);
}
