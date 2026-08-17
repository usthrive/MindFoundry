/**
 * Level-D item-template LIBRARY — the reusable, composable item generators that
 * every Level-D week builder is assembled from. Each factory returns an
 * `ItemGen` = (rng, guard, difficulty) => ItemDraft.
 *
 * Correctness invariants inherited by every generator here:
 *  1. The numeric/final answer is ALWAYS computed by code (lib/compute.ts). The
 *     generator writes `answer.value` with a `compute*` call and records a
 *     `generator` spec whose templateId re-derives the same value in QG-5.
 *  2. Every draw goes through `drawUniqueItem`, so no operand surface repeats in
 *     a pack (QG-1) and Form B stays disjoint from Form A (QG-4).
 *  3. Hint rungs describe the METHOD only — never the computed answer (QG-5).
 *  4. Choice items compute the correct option from the same params; distractors
 *     carry a DD7 errorTag + rationale (QG-3), all from the closed enum (QG-9).
 *
 * HINT LADDERS HERE ARE SEED-INVARIANT, and ten of them were not until
 * 2026-08-16. A rung that interpolates a drawn value ("Think: 7 times WHAT
 * lands on 63?") gives a different ladder per draw, which breaks the
 * pack-generation dedup for whichever learner draws the unlucky seed (L19).
 * bb-family-test has enforced that on every other family since it was written
 * and never on this one, because its FAMILIES list did not include this file —
 * so `factorPair` shipped 102 distinct ladders, unseen. The rungs now name
 * ROLES ("the factor you are given", "the named digit"), never values.
 *
 * Choice / short-text / manual-review items intentionally have no `answerFor`
 * (audit skipped): their correctness is the code-selected choice key, or they
 * are flagged for keyword / AI-runtime grading (open reasoning).
 */

import type { Choice, ErrorTag, ItemType, WeekRef } from '../../../types';
import { fmtInt } from './format';
import type { Rng } from '../../rng';
import { makeChoices, TupleGuard } from '../shared';
import type { ItemDraft } from '../shared';
import { drawUniqueItem } from './guard';
import {
  addDec,
  addFrac,
  decToFrac,
  divDecByWhole,
  divFrac,
  formatFrac,
  fracToDec,
  mulDec,
  mulFrac,
  roundDec,
  roundInt,
  subDec,
  subFrac,
  type Frac,
} from './compute';

export type ItemGen = (rng: Rng, guard: TupleGuard, difficulty: number) => ItemDraft;

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

function fracStr(n: number, d: number): string {
  return `${n}/${d}`;
}

// ===========================================================================
// Place value & rounding (whole numbers)
// ===========================================================================

/** Expanded form → standard number (D1). digits = number of digits (5–7). */
export function expandedForm(digits = 6): ItemGen {
  const hi = 10 ** digits - 1;
  const lo = 10 ** (digits - 1);
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const value = r.int(lo, hi);
      const s = String(value);
      const terms: string[] = [];
      for (let i = 0; i < s.length; i++) {
        const place = s.length - 1 - i;
        const d = Number(s[i]);
        if (d !== 0) terms.push(fmtInt(d * 10 ** place));
      }
      return {
        type: 'computation',
        prompt: `${terms.join(' + ')} = ?`,
        answer: { value: String(value), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_pv_expand_v1', params: { value }, seed: r.uint() },
        hintLadder: ['Each part already names its place. Slide them into one number.', 'Line the parts up by place, then read across.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** Value of a chosen digit in a large number (D1). */
export function digitValue(digits = 6): ItemGen {
  const hi = 10 ** digits - 1;
  const lo = 10 ** (digits - 1);
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // Draw a number that has at least one nonzero digit appearing EXACTLY ONCE,
      // then target that place — so "the digit D" names one place unambiguously
      // (338164 has two 3s: "the value of the digit 3" would be ambiguous).
      let value = r.int(lo, hi);
      let s = String(value);
      let place = -1;
      for (let tries = 0; tries < 40 && place < 0; tries++) {
        const cands: number[] = [];
        for (let p = 0; p < s.length; p++) {
          const ch = s[s.length - 1 - p];
          if (ch !== '0' && s.split(ch).length - 1 === 1) cands.push(p);
        }
        if (cands.length) { place = cands[r.int(0, cands.length - 1)]; break; }
        value = r.int(lo, hi);
        s = String(value);
      }
      if (place < 0) for (let p = 0; p < s.length; p++) if (s[s.length - 1 - p] !== '0') { place = p; break; }
      const digit = Number(s[s.length - 1 - place]);
      return {
        type: 'computation',
        prompt: `What is the VALUE of the digit ${digit} in ${fmtInt(value)}?`,
        answer: { value: String(digit * 10 ** place), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_pv_digit_value_v1', params: { digit, place }, seed: r.uint() },
        hintLadder: ['Find which place the named digit sits in.', 'The place multiplies the digit: ones, tens, hundreds, and up.'],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    });
}

/** Round a whole number to the nearest 10^place (D1, D2). */
export function roundWhole(place: number, lo: number, hi: number): ItemGen {
  const unit = 10 ** place;
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // Avoid exact multiples and .5 ties so rounding is unambiguous.
      let n = r.int(lo, hi);
      if (n % unit === 0) n += r.int(1, unit - 1);
      if (n % unit === unit / 2) n += 1;
      return {
        type: 'computation',
        prompt: `Round ${fmtInt(n)} to the nearest ${unit}.`,
        answer: { value: String(roundInt(n, place)), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_round_v1', params: { n, place }, seed: r.uint() },
        hintLadder: [`Which two multiples of ${unit} does it sit between?`, 'Look at the digit just below the rounding place to choose.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

/** Compare two large numbers with <, >, = (choice) (D1). */
export function compareWhole(digits = 6): ItemGen {
  const hi = 10 ** digits - 1;
  const lo = 10 ** (digits - 1);
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(lo, hi);
      const bRaw = r.int(lo, hi);
      // ONE DRAW IN FIVE MAKES THE TWO NUMBERS EQUAL, so `=` can actually be the
      // answer. This line used to read `if (a === b) b += 1`, which prevented
      // equality outright: `=` was offered on every exposure and correct on none,
      // so a child who met the item twice learnt to strike it out and compare two
      // options instead of three. Found by scripts/bb-answer-entropy-test.ts
      // sweeping the CERTIFIED Level D corpus — no per-pack gate can see it,
      // because every individual item was correct.
      const equalDraw = r.int(1, 5) === 1;
      const b = equalDraw ? a : bRaw === a ? bRaw + 1 : bRaw;
      const correct = a === b ? '=' : a > b ? '>' : '<';
      const wrongSymbols: Array<{ text: string; errorTag: 'concept-misconception' | 'representation-misread'; rationale: string }> =
        a === b
          ? [
            { text: '>', errorTag: 'representation-misread', rationale: 'Reads the two numbers as different without checking every place — these two agree in every place.' },
            { text: '<', errorTag: 'representation-misread', rationale: 'Reads the two numbers as different without checking every place — these two agree in every place.' },
          ]
          : [
            { text: a > b ? '<' : '>', errorTag: 'concept-misconception', rationale: 'Symbol reversed — the open mouth must face the larger number.' },
            { text: '=', errorTag: 'representation-misread', rationale: 'Treats the two numbers as equal without comparing place by place.' },
          ];
      const { choices, correctKey } = makeChoices(r, correct, wrongSymbols);
      return {
        type: 'representation',
        prompt: `Compare: ${fmtInt(a)} __ ${fmtInt(b)}. Which symbol makes it true?`,
        choices,
        answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_pv_compare_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Compare from the biggest place leftward — first place that differs decides it.', 'The open side of the symbol faces the bigger number.'],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    });
}

// ===========================================================================
// Whole-number arithmetic
// ===========================================================================

export function addWhole(lo: number, hi: number): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(lo, hi);
      const b = r.int(lo, hi);
      return {
        type: 'computation',
        prompt: `${fmtInt(a)} + ${fmtInt(b)} = ?`,
        answer: { value: String(a + b), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_add_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Line up the places; add from the ones, carrying when a column reaches ten.', 'Estimate first to know about how big the total should be.'],
        errorTags: ['procedure-slip'],
      };
    });
}

export function subWhole(lo: number, hi: number, acrossZeros = false): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      let a = r.int(lo, hi);
      let b = r.int(lo, hi);
      if (b > a) [a, b] = [b, a];
      if (a === b) a += 1;
      if (acrossZeros) {
        // Force a chain of zeros in the minuend to exercise borrowing.
        a = r.int(Math.max(lo, 10 ** (String(a).length - 1)), hi);
        a = a - (a % 100) + (a % 10); // e.g. 4003-like tail with a zero tens place
        if (b >= a) b = r.int(1, a - 1);
      }
      return {
        type: 'computation',
        prompt: `${fmtInt(a)} − ${fmtInt(b)} = ?`,
        answer: { value: String(a - b), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_sub_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Subtract from the ones first. If a column cannot pay, trade one from the place to its left.', 'When you cross a zero, trade from the next place that has something.'],
        errorTags: ['procedure-slip'],
      };
    });
}

export function multiply(aLo: number, aHi: number, bLo: number, bHi: number): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(aLo, aHi);
      const b = r.int(bLo, bHi);
      return {
        type: 'computation',
        prompt: `${a} × ${b} = ?`,
        answer: { value: String(a * b), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_mul_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Break one factor into place parts and multiply each part, then add the partials.', 'Estimate with rounded factors to check the size of the product.'],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    });
}

/** Exact division a ÷ b (D16, retrieval). Draws b then a = b·q. */
export function divideExact(bLo: number, bHi: number, qLo: number, qHi: number): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const b = r.int(bLo, bHi);
      const q = r.int(qLo, qHi);
      const a = b * q;
      return {
        type: 'computation',
        prompt: `${a} ÷ ${b} = ?`,
        answer: { value: String(q), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_div_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['How many groups of the divisor fit? Estimate with a friendly multiple first.', 'Share one place value at a time, largest place first.'],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    });
}

/** Division with remainder → ordered pair "q, r" (D6, D16). */
export function divideRemainder(bLo: number, bHi: number, aLo: number, aHi: number): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const b = r.int(bLo, bHi);
      let a = r.int(aLo, aHi);
      if (a % b === 0) a += 1; // ensure a real remainder
      return {
        type: 'computation',
        prompt: `Divide ${a} ÷ ${b}. Give the quotient and the remainder (as: quotient, remainder).`,
        answer: { value: `${Math.floor(a / b)}, ${a % b}`, acceptableForms: [`${Math.floor(a / b)} R ${a % b}`], validation: 'ordered-list' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_div_rem_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Share until you cannot make another whole group — what is left over is the remainder.', 'Check with quotient × divisor + remainder.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

// ===========================================================================
// Number theory (D3)
// ===========================================================================

/** Complete a factor pair of n (D3). */
export function factorPair(): ItemGen {
  const COMPOSITES = [24, 36, 48, 60, 72, 40, 54, 56, 84, 90, 96, 63, 80, 45, 42, 66, 78, 100];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.pick(COMPOSITES);
      const factors: number[] = [];
      for (let f = 2; f < n; f++) if (n % f === 0) factors.push(f);
      const f = r.pick(factors);
      return {
        type: 'computation',
        prompt: `${f} is a factor of ${n}. What number multiplies by ${f} to make ${n}?`,
        answer: { value: String(n / f), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_factor_pair_v1', params: { n, f }, seed: r.uint() },
        hintLadder: ['Think: the factor you are given times WHAT lands on the target?', 'Skip-count by the factor, or divide to undo the multiply.'],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    });
}

/** The kth multiple of a base number (D3). */
export function multipleFill(): ItemGen {
  const ORD = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const base = r.int(3, 12);
      const k = r.int(3, 8);
      return {
        type: 'computation',
        prompt: `What is the ${ORD[k]} multiple of ${base}?`,
        answer: { value: String(base * k), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_multiple_v1', params: { base, k }, seed: r.uint() },
        hintLadder: ['Skip-count by the number whose multiples are wanted.', 'The kth multiple is that number taken k times.'],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    });
}

/** Prime or composite? (choice) (D3). */
export function primeChoice(): ItemGen {
  const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const COMPOSITES = [12, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const isPrime = r.chance(0.5);
      const n = isPrime ? r.pick(PRIMES) : r.pick(COMPOSITES);
      const { choices, correctKey } = makeChoices(r, isPrime ? 'prime' : 'composite', [
        {
          text: isPrime ? 'composite' : 'prime',
          errorTag: 'concept-misconception',
          rationale: isPrime ? 'Assumes an odd number must factor — but this one has no factors besides 1 and itself.' : 'Misses a factor pair, so calls a composite number prime.',
        },
      ]);
      return {
        type: 'classification',
        prompt: `Is ${n} prime or composite?`,
        choices,
        answer: { value: correctKey, acceptableForms: [isPrime ? 'prime' : 'composite'], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_prime_v1', params: { n, isPrime }, seed: r.uint() },
        hintLadder: ['Try to split the number into equal groups bigger than one.', 'Check 2, 3, 5, 7 as possible factors before deciding.'],
        errorTags: ['concept-misconception', 'fact-recall'],
      };
    });
}

// ===========================================================================
// Fractions
// ===========================================================================

/** Equivalent fraction: a/b = ?/target (D9). */
export function fracEquivFill(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // THE PAIR IS DRAWN, NOT THE DENOMINATOR AND THEN THE NUMERATOR.
      // A denominator of 2 leaves exactly ONE legal numerator, so picking the
      // denominator uniformly forced a fifth of all draws onto n1 = 1 — and 1
      // scaled by a factor of 2–4 collides with 2 scaled by 2. "4" came out on
      // 24.5% of draws against a 9.1% uniform share. Drawing uniformly over the
      // legal (numerator, denominator) PAIRS gives each proper fraction the same
      // chance, which is what "pick a fraction" was always meant to mean.
      const pairs: Array<[number, number]> = [];
      for (const d of [2, 3, 4, 5, 6]) for (let n = 1; n < d; n++) pairs.push([n, d]);
      const [n1, d1] = r.pick(pairs);
      const k = r.int(2, 5);
      const d2 = d1 * k;
      return {
        type: 'computation',
        prompt: `Fill in: ${fracStr(n1, d1)} = ▢/${d2}`,
        answer: { value: String(n1 * k), acceptableForms: [`${n1 * k}/${d2}`], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_equiv_v1', params: { n1, d1, d2 }, seed: r.uint() },
        hintLadder: ['What does the bottom number multiply by to reach the new bottom? Scale the top by that same factor.', 'Top and bottom both grow together — the amount stays the same.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

/** Which fraction is greater? (choice) (D9). */
export function fracCompareChoice(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // ONE DRAW IN FIVE IS AN EQUIVALENT PAIR, so "they are equal" can be the
      // answer. The generator used to nudge every tie away, so the card was
      // offered on 2,000/2,000 draws and keyed on none (measured) — a
      // permanently unkeyable option, the L38 class already repaired twice in
      // this library (`compareWhole` above, `compareNegativesTrap` in G5). A
      // child who meets it twice learns to strike it out and answer a two-way
      // question.
      //
      // It is also the better item. "Which is greater: 2/4 or 1/2?" is the D9
      // skill itself — two fractions that look different and name one amount —
      // and it is the only draw on which every digit-comparing habit fails at
      // once. The equal pair is built by SCALING, so the two surfaces always
      // differ even though the values do not.
      const equalDraw = r.int(1, 5) === 1;
      let d1: number;
      let d2: number;
      let n1: number;
      let n2: number;
      if (equalDraw) {
        const base = r.pick([2, 3, 4] as const);
        const k = base === 2 ? r.pick([2, 3, 4] as const) : 2; // base*k stays in 4…8
        d1 = base;
        n1 = r.int(1, base - 1);
        d2 = base * k;
        n2 = n1 * k;
        if (r.int(0, 1) === 0) {
          [d1, d2] = [d2, d1];
          [n1, n2] = [n2, n1];
        }
      } else {
        // RESAMPLED until the two values genuinely differ.
        //
        // Nudging is what the old line did — swap the denominator, clamp the
        // numerator back into range — and it could land straight back on an
        // equivalent pair: 1/2 against 2/4 nudges d2 from 4 to 2, clamps n2 to
        // 1, and hands `build` 1/2 against 1/2. The equal branch then fired and
        // shipped the same card twice, once keyed and once not. Measured at 35
        // duplicate card sets in 2,000 draws while this comment's predecessor
        // was in place — the L38 defect reintroduced by its own repair, which is
        // why the sweep is re-run after a fix and not only before one.
        d1 = 2; n1 = 1; d2 = 3; n2 = 1; // fallback: 1/2 vs 1/3, see temperatureSwing
        for (let i = 0; i < 60; i++) {
          const b1 = r.pick([2, 3, 4, 5, 6, 8]);
          let b2 = r.pick([2, 3, 4, 5, 6, 8]);
          if (b2 === b1) b2 = b1 === 8 ? 3 : b1 + 1;
          const a1 = r.int(1, b1 - 1);
          const a2 = r.int(1, b2 - 1);
          if (Math.abs(a1 / b1 - a2 / b2) < 1e-9) continue;
          d1 = b1; n1 = a1; d2 = b2; n2 = a2;
          break;
        }
      }
      function build(rr: Rng, a1: number, b1: number, a2: number, b2: number): ItemDraft {
        const equal = Math.abs(a1 / b1 - a2 / b2) < 1e-9;
        const greater = equal ? 'they are equal' : a1 / b1 > a2 / b2 ? fracStr(a1, b1) : fracStr(a2, b2);
        const lesser = a1 / b1 > a2 / b2 ? fracStr(a2, b2) : fracStr(a1, b1);
        // Distractors DERIVED from the truth, never a fixed list. Hard-coding
        // "they are equal" as a wrong card was safe only while it could not be
        // the answer; the moment an equivalent pair became drawable the same
        // list would have shipped a card set holding it twice, once keyed and
        // once not — the third defect the G5 repair uncovered.
        const wrongCards = equal
          ? [
            {
              text: fracStr(a1, b1),
              errorTag: 'concept-misconception' as const,
              rationale: b1 > b2
                ? 'Judges size by the bigger bottom number — smaller pieces, not more amount.'
                : 'Judges size by the bigger top number alone, ignoring how big the pieces are.',
            },
            {
              text: fracStr(a2, b2),
              errorTag: 'concept-misconception' as const,
              rationale: b2 > b1
                ? 'Judges size by the bigger bottom number — smaller pieces, not more amount.'
                : 'Judges size by the bigger top number alone, ignoring how big the pieces are.',
            },
          ]
          : [
            {
              text: lesser,
              errorTag: 'concept-misconception' as const,
              // Pick the misconception that genuinely yields THIS distractor.
              rationale:
                (a1 / b1 > a2 / b2 ? b2 > b1 : b1 > b2)
                  ? 'Judges size by the bigger bottom number — smaller pieces, not more amount.'
                  : (a1 / b1 > a2 / b2 ? a2 > a1 : a1 > a2)
                    ? 'Judges size by the bigger top number alone, ignoring how big the pieces are.'
                    : 'Compares the two fractions without first giving them a common piece-size.',
            },
            { text: 'they are equal', errorTag: 'representation-misread' as const, rationale: 'Skips finding a common size to compare fairly.' },
          ];
        const { choices, correctKey } = makeChoices(rr, greater, wrongCards);
        return {
          type: 'classification',
          prompt: `Which is greater: ${fracStr(a1, b1)} or ${fracStr(a2, b2)}?`,
          choices,
          answer: { value: correctKey, acceptableForms: [greater], validation: 'choice-key' },
          difficulty,
          strand: 'computational',
          isRetrieval: false,
          generator: { templateId: 'd_frac_compare_v1', params: { n1: a1, d1: b1, n2: a2, d2: b2 }, seed: rr.uint() },
          hintLadder: ['Compare each to a benchmark like 1/2, or re-cut both into the same size pieces.', 'A bigger bottom means smaller pieces, not a bigger amount.'],
          // Declared from the cards actually shipped: on an equivalent pair both
          // wrong cards are the same misconception, and claiming a tag no card
          // carries is the bookkeeping QG-3 exists to check.
          errorTags: equal ? ['concept-misconception'] : ['concept-misconception', 'representation-misread'],
        };
      }
      return build(r, n1, d1, n2, d2);
    });
}

/** ± fractions with LIKE denominators (D10). op: 1 add, -1 sub. */
export function fracAddSubLike(op: 1 | -1): ItemGen {
  // "1" is the answer on 18.0% of addition draws, and that is arithmetic, not a
  // defect. Two proper fractions over a common denominator d complete a whole
  // whenever their numerators are complements, which is 1/(d-1) of uniform
  // draws — and that is precisely the case the week most wants a child to meet.
  // Widening the denominator pool would dilute it, at the cost of taking the
  // fractions out of band. Stated rather than engineered around.
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = r.pick([4, 5, 6, 8, 9, 10, 12]);
      let n1 = r.int(1, d - 1);
      let n2 = r.int(1, d - 1);
      if (op === -1 && n2 >= n1) [n1, n2] = [Math.max(n1, n2), Math.min(n1, n2) === Math.max(n1, n2) ? 1 : Math.min(n1, n2)];
      const result: Frac = op === -1 ? subFrac({ n: n1, d }, { n: n2, d }) : addFrac({ n: n1, d }, { n: n2, d });
      return {
        type: 'computation',
        prompt: `${fracStr(n1, d)} ${op === -1 ? '−' : '+'} ${fracStr(n2, d)} = ?`,
        answer: { value: formatFrac(result), acceptableForms: [`${op === -1 ? n1 - n2 : n1 + n2}/${d}`], validation: 'equivalent-fraction' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_like_v1', params: { n1, n2, d, op }, seed: r.uint() },
        hintLadder: ['Same-size pieces already — just combine the counts on top; the piece-size stays.', 'Simplify at the end if the top and bottom share a factor.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** ± fractions with UNLIKE denominators (used as a warm-up / interleave). */
export function fracAddSubUnlike(op: 1 | -1): ItemGen {
  const PAIRS: Array<[number, number]> = [[2, 3], [3, 4], [2, 5], [4, 6], [3, 6], [2, 8], [5, 10], [3, 5], [4, 8], [2, 6]];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const [d1, d2] = r.pick(PAIRS);
      let n1 = r.int(1, d1 - 1);
      let n2 = r.int(1, d2 - 1);
      if (op === -1 && n1 / d1 <= n2 / d2) n1 = d1 - 1; // keep the difference positive
      if (op === -1 && n1 / d1 <= n2 / d2) n2 = 1;
      const result: Frac = op === -1 ? subFrac({ n: n1, d: d1 }, { n: n2, d: d2 }) : addFrac({ n: n1, d: d1 }, { n: n2, d: d2 });
      return {
        type: 'computation',
        prompt: `${fracStr(n1, d1)} ${op === -1 ? '−' : '+'} ${fracStr(n2, d2)} = ?`,
        answer: { value: formatFrac(result), acceptableForms: [], validation: 'equivalent-fraction' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_unlike_v1', params: { n1, d1, n2, d2, op }, seed: r.uint() },
        hintLadder: ['Re-cut both into a common size of piece first, then combine the counts.', 'Any common multiple of the two bottoms works; the least keeps numbers small.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** whole × fraction (D11). */
export function fracTimesWhole(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = r.pick([2, 3, 4, 5, 6, 8]);
      const n = r.int(1, d - 1);
      const k = r.int(2, 6);
      const result = mulFrac({ n: k, d: 1 }, { n, d });
      return {
        type: 'computation',
        prompt: `${k} × ${fracStr(n, d)} = ?`,
        answer: { value: formatFrac(result), acceptableForms: [`${k * n}/${d}`], validation: 'equivalent-fraction' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_times_whole_v1', params: { k, n, d }, seed: r.uint() },
        hintLadder: ['Picture that many copies of the fraction — count the unit-pieces.', 'Multiply the top by the whole number; the piece-size stays the same.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** fraction × fraction (D18). */
export function fracTimesFrac(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d1 = r.pick([2, 3, 4, 5]);
      const d2 = r.pick([2, 3, 4, 5]);
      const n1 = r.int(1, d1 - 1);
      const n2 = r.int(1, d2 - 1);
      const result = mulFrac({ n: n1, d: d1 }, { n: n2, d: d2 });
      return {
        type: 'computation',
        prompt: `${fracStr(n1, d1)} × ${fracStr(n2, d2)} = ?`,
        answer: { value: formatFrac(result), acceptableForms: [`${n1 * n2}/${d1 * d2}`], validation: 'equivalent-fraction' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_times_frac_v1', params: { n1, d1, n2, d2 }, seed: r.uint() },
        hintLadder: ['A fraction OF a fraction: multiply tops together and bottoms together.', 'Think of the area of a piece-of-a-piece rectangle.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** whole ÷ unit fraction, or unit fraction ÷ whole (D19). */
export function fracDivide(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const wholeFirst = r.chance(0.5);
      // Wide (d, k) space: the commuted signature collapses "k ÷ 1/d" and
      // "1/d ÷ k", so the range must comfortably exceed the pack's usage.
      const d = r.pick([2, 3, 4, 5, 6, 7, 8, 9]);
      const k = r.int(2, 9);
      let a: Frac;
      let b: Frac;
      let prompt: string;
      if (wholeFirst) {
        a = { n: k, d: 1 };
        b = { n: 1, d };
        prompt = `${k} ÷ ${fracStr(1, d)} = ?`;
      } else {
        a = { n: 1, d };
        b = { n: k, d: 1 };
        prompt = `${fracStr(1, d)} ÷ ${k} = ?`;
      }
      const result = divFrac(a, b);
      return {
        type: 'computation',
        prompt,
        answer: { value: formatFrac(result), acceptableForms: [], validation: 'equivalent-fraction' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_div_v1', params: { n1: a.n, d1: a.d, n2: b.n, d2: b.d }, seed: r.uint() },
        hintLadder: ['Which way round is it — a whole amount measured out in small pieces, or one small piece shared into equal parts?', 'Dividing by a fraction is the same as multiplying by its flip.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

// ===========================================================================
// Decimals
// ===========================================================================

/** Which decimal is greater? (choice) (D12). */
export function decCompareChoice(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // One "short" decimal vs one "long" decimal to trap the longer-is-bigger error.
      //
      // ONE DRAW IN FIVE MAKES THEM EQUAL — 0.4 against 0.40. The generator used
      // to redraw every tie away, so "they are equal" was offered on 2,000/2,000
      // draws and keyed on none (measured): the L38 unkeyable card, the same one
      // repaired in `compareWhole`, `fracCompareChoice` above and G5's
      // `compareNegativesTrap`.
      //
      // Here the equal draw is not a concession to the card — it is the sharpest
      // form of the item. "Longer means bigger" is exactly the misconception D12
      // names, and 0.4 vs 0.40 is the one pair where a child who holds it has to
      // choose between two identical amounts. The trailing zero is what makes
      // the two surfaces differ while the values do not.
      const equalDraw = r.int(1, 5) === 1;
      const tenths = r.int(1, 9);
      const a = `0.${tenths}`;
      const b = equalDraw ? `0.${tenths}0` : `0.${String(r.int(11, 89)).padStart(2, '0')}`;
      const av = Number(a);
      const bv = Number(b);
      // An unequal draw that lands on a round tenth (0.20 against 0.2) is a tie
      // the shape did not ask for; it redraws, as before.
      if (!equalDraw && Math.abs(av - bv) < 1e-9) return decCompareChoice()(r, guard, difficulty);
      const equal = Math.abs(av - bv) < 1e-9;
      const greater = equal ? 'they are equal' : av > bv ? a : b;
      const lesser = av > bv ? b : a;
      // Derived from the truth — a fixed list would ship "they are equal" twice
      // on the draw where it is the answer.
      const wrongCards = equal
        ? [
          { text: a, errorTag: 'concept-misconception' as const, rationale: 'Reads the shorter decimal as the smaller amount, counting digits instead of places.' },
          { text: b, errorTag: 'concept-misconception' as const, rationale: 'Chooses the one with more digits — "longer means bigger" misread of decimals.' },
        ]
        : [
          {
            text: lesser,
            errorTag: 'concept-misconception' as const,
            // "Longer means bigger" only explains this distractor when the SMALLER
            // decimal is in fact the longer one.
            rationale:
              lesser.length > greater.length
                ? 'Chooses the one with more digits — "longer means bigger" misread of decimals.'
                : 'Compares the digits after the point without lining up the places first.',
          },
          { text: 'they are equal', errorTag: 'representation-misread' as const, rationale: 'Ignores the tenths place, where the comparison is decided.' },
        ];
      const { choices, correctKey } = makeChoices(r, greater, wrongCards);
      return {
        type: 'classification',
        prompt: `Which is greater: ${a} or ${b}?`,
        choices,
        answer: { value: correctKey, acceptableForms: [greater], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_compare_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Line up the decimal points and compare the tenths first.', 'Add a zero so both have the same number of places, then compare.'],
        // Declared from the cards actually shipped (see `fracCompareChoice`).
        errorTags: equal ? ['concept-misconception'] : ['concept-misconception', 'representation-misread'],
      };
    });
}

/** Fraction (tenths/hundredths) → decimal (D12). */
export function fractionToDecimal(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // HALVES ARE REACHED THROUGH THEIR EQUIVALENTS, NOT THROUGH d = 2.
      // A denominator of 2 admits one numerator only, so an eighth of every draw
      // landed on 1/2 and "0.5" was the answer on 19.3% of draws against a 1.0%
      // uniform share — a child writing 0.5 every time beat one in five. The
      // half is still reachable, and better taught, through 2/4, 5/10, 25/50 and
      // 50/100, which is the re-cutting the hint ladder actually describes.
      const d = r.pick([4, 5, 10, 20, 25, 50, 100]);
      const n = r.int(1, d - 1);
      return {
        type: 'computation',
        prompt: `Write ${fracStr(n, d)} as a decimal.`,
        answer: { value: fracToDec(n, d), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_to_dec_v1', params: { n, d }, seed: r.uint() },
        hintLadder: ['Re-cut the fraction into tenths or hundredths — a place value the decimal can name.', 'Tenths go one place after the point; hundredths go two.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** Decimal → fraction, reduced (D12). */
export function decimalToFraction(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const twoPlace = r.chance(0.5);
      const value = twoPlace ? `0.${String(r.int(5, 95)).padStart(2, '0')}` : `0.${r.int(1, 9)}`;
      return {
        type: 'computation',
        prompt: `Write ${value} as a fraction in simplest form.`,
        answer: { value: decToFrac(value), acceptableForms: [], validation: 'equivalent-fraction' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_to_frac_v1', params: { value }, seed: r.uint() },
        hintLadder: ['Read the decimal as a place-value fraction: tenths or hundredths.', 'Then simplify by a factor shared by the top and bottom.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** Which digit is in a named decimal place (D13). */
export function decPlaceValue(): ItemGen {
  const PLACES = [
    { name: 'tenths', idx: 0 },
    { name: 'hundredths', idx: 1 },
    { name: 'thousandths', idx: 2 },
  ];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const digitsAfter = [r.int(1, 9), r.int(1, 9), r.int(1, 9)];
      const whole = r.int(1, 9);
      const value = `${whole}.${digitsAfter.join('')}`;
      const place = r.pick(PLACES);
      const digit = digitsAfter[place.idx];
      return {
        type: 'computation',
        prompt: `In ${value}, which digit is in the ${place.name} place?`,
        answer: { value: String(digit), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_pv_v1', params: { digit }, seed: r.uint() },
        hintLadder: ['Count places right of the point: tenths, hundredths, thousandths.', 'Each step right is ten times smaller.'],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    });
}

/** Round a decimal to a named place (D13). */
export function decRound(places: number): ItemGen {
  const placeName = places === 1 ? 'tenth' : places === 2 ? 'hundredth' : 'thousandth';
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const digs = [r.int(0, 9), r.int(0, 9), r.int(0, 9), r.int(1, 9)].slice(0, places + 2);
      const whole = r.int(1, 19);
      let value = `${whole}.${digs.join('')}`;
      // avoid exact 5-tie at the rounding boundary
      if (digs[places] === 5) digs[places] = 6;
      value = `${whole}.${digs.join('')}`;
      return {
        type: 'computation',
        prompt: `Round ${value} to the nearest ${placeName}.`,
        answer: { value: roundDec(value, places), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_round_v1', params: { value, places }, seed: r.uint() },
        hintLadder: [`Look at the digit just past the ${placeName} place to decide.`, '5 or more rounds up; less rounds down.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

/** ± decimals (D14). */
export function decAddSub(op: 1 | -1): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const scaleA = r.pick([1, 2]);
      const scaleB = r.pick([1, 2]);
      const a = (r.int(15, 480) / 10 ** scaleA).toFixed(scaleA);
      let b = (r.int(10, 300) / 10 ** scaleB).toFixed(scaleB);
      if (op === -1 && Number(b) >= Number(a)) b = (Number(a) / 2).toFixed(scaleB);
      return {
        type: 'computation',
        prompt: `${a} ${op === -1 ? '−' : '+'} ${b} = ?`,
        answer: { value: op === -1 ? subDec(a, b) : addDec(a, b), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_addsub_v1', params: { a, b, op }, seed: r.uint() },
        hintLadder: ['Line up the decimal points so each place meets its match, then add or subtract.', 'Fill empty places with zeros so the columns are even.'],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    });
}

/** decimal × whole or decimal × decimal (D20). */
export function decMultiply(byDecimal = false): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = (r.int(11, 89) / 10).toFixed(1);
      const b = byDecimal ? (r.int(2, 9) / 10).toFixed(1) : String(r.int(3, 9));
      return {
        type: 'computation',
        prompt: `${a} × ${b} = ?`,
        answer: { value: mulDec(a, b), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_mul_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Multiply as if there were no points, then place the point by counting decimal places in the factors.', 'Estimate with rounded factors to check where the point belongs.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

/** exact decimal ÷ whole (D20). */
export function decDivideWhole(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const b = r.int(2, 8);
      const q = (r.int(11, 89) / 10).toFixed(1);
      const a = mulDec(q, String(b)); // a = q·b, so a ÷ b = q exactly
      return {
        type: 'computation',
        prompt: `${a} ÷ ${b} = ?`,
        answer: { value: divDecByWhole(a, b), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_div_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Share the whole part first, then the tenths — keep the point lined up above.', 'Check by multiplying your answer back by the divisor.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

// ===========================================================================
// Expressions, patterns, geometry
// ===========================================================================

/** Evaluate a numerical expression, optionally with parentheses (D21). */
export function evalExpr(withParens: boolean): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(2, 9);
      const b = r.int(2, 9);
      const c = r.int(2, 9);
      let prompt: string;
      let value: number;
      if (withParens) {
        prompt = `(${a} + ${b}) × ${c} = ?`;
        value = (a + b) * c;
      } else {
        prompt = `${a} + ${b} × ${c} = ?`;
        value = a + b * c;
      }
      return {
        type: 'computation',
        prompt,
        answer: { value: String(value), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_eval_expr_v1', params: { value }, seed: r.uint() },
        hintLadder: [withParens ? 'Do the work inside the parentheses first.' : 'Multiplication happens before addition — group that part first.', 'Then finish the remaining operation left to right.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

/** Translate words → expression (choice) (D21). */
export function writeExprChoice(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(2, 9);
      const b = r.int(2, 9);
      // WHICH PHRASE IS ASKED IS DRAWN; the three expressions never change.
      // Only the grouped form was ever the answer, and brackets make it the
      // longest string on the page every time — "tap the longest expression"
      // keyed 3000 of 3000 draws against a 33% baseline, on an item whose whole
      // subject is that these three expressions are DIFFERENT. Rotating the
      // phrase teaches the same distinction in all three directions, which is
      // what the item claimed to do.
      // AND ALL THREE CARDS LEAD WITH THE SAME TOKEN, which is a second repair
      // on top of the phrase rotation below, not a restatement of it.
      //
      // `PLUS_TWO` used to render `a + b + 2` — the only card of the three
      // beginning with a DRAWN number, where the other two begin with the
      // literal 2. So "tap the card that starts with the phrase's first
      // number" isolated exactly one card, and on the phrasing that leads with
      // `a` and keys `PLUS_TWO` it isolated the KEY. Measured over 3,000 draws:
      // 45.9% against a 33.3% baseline overall, and 91.0% on the third of draws
      // asking "two more than the sum of …". Its mirror paid too — the key
      // ended with the phrase's last number on only 25.5%, so striking that
      // card improved a guess.
      //
      // The census cannot see this class: it compares cards to CARDS and never
      // the PROMPT to the cards, so a correspondence between the two is
      // invisible to every check it runs. This is the same defect, in the same
      // shape, that `algebra.expressionMeaningTrap` carried — both of them
      // BEHIND an earlier repair that had correctly closed a card-only tell.
      // Rotating which phrase is asked fixes card identity and cannot touch a
      // correspondence.
      //
      // `2 + a + b` is the same translation of "two more than the sum" —
      // addition commutes and D21's subject is which OPERATION the words name,
      // not which end the constant is written at. Now every card begins with
      // the same token, so the strategy has nothing to isolate; and every card
      // also ends with `b`, which retires the mirror at the same time.
      const GROUPED = `2 × (${a} + ${b})`;
      const TWICE_FIRST = `2 × ${a} + ${b}`;
      const PLUS_TWO = `2 + ${a} + ${b}`;
      const FORMS = [
        {
          form: 'grouped',
          phrase: `twice the sum of ${a} and ${b}`,
          correct: GROUPED,
          distractors: [
            { text: TWICE_FIRST, errorTag: 'concept-misconception' as const, rationale: 'Drops the grouping — doubles only the first number, not the whole sum.' },
            { text: PLUS_TWO, errorTag: 'task-comprehension' as const, rationale: 'Reads "twice" as "add two" instead of "multiply by two".' },
          ],
        },
        {
          form: 'twice-first',
          phrase: `${b} more than twice ${a}`,
          correct: TWICE_FIRST,
          distractors: [
            { text: GROUPED, errorTag: 'concept-misconception' as const, rationale: 'Groups the two numbers first — doubles both of them, not just the one "twice" names.' },
            { text: PLUS_TWO, errorTag: 'task-comprehension' as const, rationale: 'Reads "twice" as "add two" instead of "multiply by two".' },
          ],
        },
        {
          form: 'plus-two',
          phrase: `two more than the sum of ${a} and ${b}`,
          correct: PLUS_TWO,
          distractors: [
            { text: GROUPED, errorTag: 'concept-misconception' as const, rationale: 'Multiplies the sum by two instead of adding two to it.' },
            { text: TWICE_FIRST, errorTag: 'task-comprehension' as const, rationale: 'Doubles the first number instead of adding two to the whole sum.' },
          ],
        },
      ];
      const pick = r.pick(FORMS);
      const { choices, correctKey } = makeChoices(r, pick.correct, pick.distractors);
      return {
        type: 'representation',
        prompt: `Which expression means: "${pick.phrase}"?`,
        choices,
        answer: { value: correctKey, acceptableForms: [pick.correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_write_expr_v1', params: { a, b, form: pick.form }, seed: r.uint() },
        // ONE LADDER FOR ALL THREE PHRASINGS. Rungs that named the drawn form
        // would be seed-variant, which is a hard family-test failure (L19), so
        // these describe the METHOD — read the phrase in order, build it, then
        // match — which is the same method whichever phrase was drawn.
        hintLadder: ['Read the phrase in order: what is grouped, and what acts on that group?', 'Build the phrase one piece at a time, then match it against each expression.'],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    });
}

/** Name the ordered pair for a described point (choice) (D22). */
export function plotChoice(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // BOTH COUNTS START AT 2. At 1 the prompt read "Point P is 1 units
      // right", on 20.7% of 4,000 draws — a QG-12c violation the gate could not
      // see, because its stem minimum exempted three-letter plurals until this
      // session, and `units` was reached through a bare `${…}` rather than
      // `unitFor`. Latent rather than shipped: D22 is the only week that names
      // this generator and its header explains it cannot serve the raw form in
      // v2 core, so 300 served D22 packs contain none of them. It surfaced when
      // E7 tried to use it and the draw failed E7's own 200-seed sweep.
      const x = r.int(2, 9);
      let y = r.int(2, 9);
      if (y === x) y = x === 9 ? 8 : x + 1;
      const correct = `(${x}, ${y})`;
      const { choices, correctKey } = makeChoices(r, correct, [
        { text: `(${y}, ${x})`, errorTag: 'representation-misread', rationale: 'Swaps the coordinates — plots up-then-right instead of right-then-up.' },
        { text: `(${x}, 0)`, errorTag: 'task-comprehension', rationale: 'Ignores the up movement, staying on the x-axis.' },
      ]);
      return {
        type: 'representation',
        prompt: `Point P is ${x} units right and ${y} units up from the origin (0, 0). Which ordered pair names it?`,
        choices,
        answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_plot_v1', params: { x, y }, seed: r.uint() },
        hintLadder: ['The first number is how far RIGHT; the second is how far UP.', 'Right before up — x before y.'],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    });
}

/** Arithmetic-pattern nth term (D22). */
export function patternTerm(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const start = r.int(2, 12);
      const step = r.int(2, 9);
      const k = r.int(4, 8);
      return {
        type: 'computation',
        prompt: `A pattern starts at ${start} and adds ${step} each step. What is the ${k}th number?`,
        answer: { value: String(start + step * (k - 1)), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_pattern_term_v1', params: { start, step, k }, seed: r.uint() },
        hintLadder: ['The first number is the start; each later number adds the same step.', 'Add the step to the start one time fewer than the term you are asked for.'],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    });
}

/** Angle relationship arithmetic (D23). rel picks the relationship. */
export function angleArith(rel: 'supplementary' | 'complementary' | 'triangle'): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      if (rel === 'triangle') {
        const a = r.int(30, 90);
        const b = r.int(30, 140 - a);
        return {
          type: 'computation',
          prompt: `Two angles of a triangle are ${a}° and ${b}°. What is the third angle?`,
          answer: { value: String(180 - a - b), acceptableForms: [`${180 - a - b}°`], validation: 'exact-numeric' },
          difficulty,
          strand: 'computational',
          isRetrieval: false,
          generator: { templateId: 'd_angle_v1', params: { rel, a, b }, seed: r.uint() },
          hintLadder: ['The three angles of any triangle add to a straight angle.', 'Subtract the two known angles from that total.'],
          errorTags: ['fact-recall', 'procedure-slip'],
        };
      }
      const total = rel === 'supplementary' ? 180 : 90;
      const a = r.int(20, total - 20);
      return {
        type: 'computation',
        prompt: `Two ${rel} angles: one is ${a}°. What is the other?`,
        answer: { value: String(total - a), acceptableForms: [`${total - a}°`], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_angle_v1', params: { rel, a }, seed: r.uint() },
        hintLadder: [`${rel === 'supplementary' ? 'Supplementary angles form a straight line.' : 'Complementary angles form a right angle.'}`, 'Subtract the known angle from that total.'],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    });
}

/** Classify a triangle by its angles (choice; correct computed) (D23). */
export function classifyTriangleChoice(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const kind = r.pick(['acute', 'right', 'obtuse'] as const);
      let a: number;
      let b: number;
      if (kind === 'right') {
        a = 90;
        b = r.int(20, 60);
      } else if (kind === 'obtuse') {
        a = r.int(95, 130);
        b = r.int(20, 175 - a);
      } else {
        a = r.int(50, 80);
        b = r.int(50, Math.min(85, 175 - a));
      }
      const c = 180 - a - b;
      const { choices, correctKey } = makeChoices(r, kind, [
        { text: kind === 'acute' ? 'right' : 'acute', errorTag: 'concept-misconception', rationale: 'Reads only one angle instead of checking the largest angle against 90°.' },
        { text: kind === 'obtuse' ? 'right' : 'obtuse', errorTag: 'representation-misread', rationale: 'Miscategorizes by the smallest angle rather than the largest.' },
      ]);
      return {
        type: 'classification',
        prompt: `A triangle has angles ${a}°, ${b}°, and ${c}°. Classify it by its angles.`,
        choices,
        answer: { value: correctKey, acceptableForms: [kind], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_triangle_v1', params: { a, b, c }, seed: r.uint() },
        hintLadder: ['Look at the LARGEST angle only.', 'Equal to 90° is right; more than 90° is obtuse; all under 90° is acute.'],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    });
}

/** Volume of a box l × w × h (D24). */
export function volumeBox(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const l = r.int(2, 12);
      const w = r.int(2, 10);
      const h = r.int(2, 8);
      return {
        type: 'computation',
        prompt: `A box is ${l} by ${w} by ${h} units. What is its volume in cubic units?`,
        answer: { value: String(l * w * h), acceptableForms: [`${l * w * h} cubic units`], validation: 'exact-numeric', units: 'cubic units' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_volume_v1', params: { l, w, h }, seed: r.uint() },
        hintLadder: ['Volume fills space: multiply length, width, and height.', 'Find the cubes in one layer, then multiply by the number of layers.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

/** Area of a rectangle l × w (D24, retrieval). */
export function rectArea(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const l = r.int(4, 19);
      let w = r.int(3, 12);
      // Length and width were drawn independently, so the prompt could read "9
      // units long and 11 units wide" — a rectangle whose width exceeds its
      // length. The arithmetic was always right, which is why every gate passed
      // it; it is the WORDS that were wrong. Reflected deterministically rather
      // than redrawn (a loop would shift every later draw in the pack).
      if (w > l) w = Math.max(3, l - 1);
      return {
        type: 'computation',
        prompt: `A rectangle is ${l} units long and ${w} units wide. What is its area in square units?`,
        answer: { value: String(l * w), acceptableForms: [`${l * w} square units`], validation: 'exact-numeric', units: 'square units' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_area_v1', params: { l, w }, seed: r.uint() },
        hintLadder: ['Area tiles a surface: multiply length by width.', 'Count the square tiles in one row, then the number of rows.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    });
}

// ===========================================================================
// Word-problem (story) generators — Day 4. Every answer is code-computed.
// ===========================================================================

/** "n times as many" multiplicative comparison (D4). */
export function storyMulCompare(): ItemGen {
  const THINGS = ['stickers', 'marbles', 'books', 'coins', 'shells', 'cards', 'stamps', 'beads'];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(4, 40);
      const k = r.int(2, 8);
      const thing = r.pick(THINGS);
      const [n1, n2] = r.shuffle([...NAMES]).slice(0, 2);
      return {
        type: 'word-problem',
        prompt: `${n1} has ${a} ${thing}. ${n2} has ${k} times as many ${thing} as ${n1}. How many ${thing} does ${n2} have?`,
        answer: { value: String(a * k), acceptableForms: [`${a * k} ${thing}`], validation: 'exact-numeric', units: thing },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_mul_compare_v1', params: { a, k }, seed: r.uint() },
        hintLadder: ['"Times as many" is a multiply, not an add.', 'How many groups the size of the first amount?'],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    });
}

/** Multiply story: quantity × per-unit (D5, D8, D15). */
export function storyMultiply(): ItemGen {
  const UNITS = [
    ['crates', 'apples'],
    ['boxes', 'pencils'],
    ['shelves', 'books'],
    ['vans', 'seats'],
    ['trays', 'muffins'],
    ['bags', 'marbles'],
  ];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(12, 60);
      const b = r.int(11, 40);
      const [container, item] = r.pick(UNITS);
      const name = r.pick(NAMES);
      return {
        type: 'word-problem',
        prompt: `${name} packs ${a} ${container} with ${b} ${item} in each. How many ${item} is that in all?`,
        answer: { value: String(a * b), acceptableForms: [`${a * b} ${item}`], validation: 'exact-numeric', units: item },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_mul_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Equal groups: multiply the number of groups by the size of each group.', 'Break a factor into place parts and add the partial products.'],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    });
}

/** Division story where the remainder must be USED (D6, D7, D16). */
export function storyDivideUse(mode: 'round-up' | 'drop' | 'remainder'): ItemGen {
  const SCENES: Record<string, { setup: (a: number, b: number, n: string) => string; unit: string }> = {
    'round-up': { setup: (a, b, n) => `${n} is seating ${a} guests. Each table holds ${b}. How many tables are needed so everyone has a seat?`, unit: 'tables' },
    drop: { setup: (a, b, n) => `${n} has ${a} craft sticks and glues ${b} onto each star. How many complete stars can be made?`, unit: 'stars' },
    remainder: { setup: (a, b, n) => `${n} shares ${a} stickers equally among ${b} friends. How many stickers are LEFT OVER?`, unit: 'stickers' },
  };
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const b = r.int(3, 9);
      let a = r.int(20, 95);
      if (a % b === 0) a += 1;
      const name = r.pick(NAMES);
      const scene = SCENES[mode];
      const q = Math.floor(a / b);
      const rem = a % b;
      const value = mode === 'round-up' ? q + 1 : mode === 'drop' ? q : rem;
      return {
        type: 'word-problem',
        prompt: scene.setup(a, b, name),
        answer: { value: String(value), acceptableForms: [`${value} ${scene.unit}`], validation: 'exact-numeric', units: scene.unit },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_interpret_rem_v1', params: { a, b, mode }, seed: r.uint() },
        hintLadder: ['Divide first — then ask what the leftover means in THIS story.', mode === 'round-up' ? 'A partly-full group still needs its own whole group.' : mode === 'drop' ? 'A leftover that cannot fill a group is not counted.' : 'The answer is only the leftover, not the number of groups.'],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    });
}

/** Decimal-rounding-in-context story (D13). */
export function storyDecRound(places: number): ItemGen {
  const placeName = places === 1 ? 'tenth' : places === 2 ? 'hundredth' : 'thousandth';
  const SCENES = ['A runner\'s time was', 'A scale read', 'A rain gauge measured', 'A stopwatch showed'];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const digs = [r.int(0, 9), r.int(0, 9), r.int(0, 9), r.int(1, 9)].slice(0, places + 2);
      if (digs[places] === 5) digs[places] = 6;
      const whole = r.int(1, 49);
      const value = `${whole}.${digs.join('')}`;
      const scene = r.pick(SCENES);
      return {
        type: 'word-problem',
        prompt: `${scene} ${value}. Round it to the nearest ${placeName} for the record.`,
        answer: { value: roundDec(value, places), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_round_v1', params: { value, places }, seed: r.uint() },
        hintLadder: [`Look at the digit just past the ${placeName} place.`, '5 or more rounds up; less rounds down.'],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    });
}

/** Rounding-in-context story (D1, D2 reasonableness). */
export function storyRound(place: number, lo: number, hi: number): ItemGen {
  const unit = 10 ** place;
  const PLACES = ['a town', 'a city', 'a stadium crowd', 'a festival', 'a library'];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      let n = r.int(lo, hi);
      if (n % unit === 0) n += r.int(1, unit - 1);
      if (n % unit === unit / 2) n += 1;
      const place2 = r.pick(PLACES);
      return {
        type: 'word-problem',
        prompt: `${place2} counted ${n} people. A headline rounds it to the nearest ${unit}. What number does the headline show?`,
        answer: { value: String(roundInt(n, place)), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_round_v1', params: { n, place }, seed: r.uint() },
        hintLadder: [`Which two multiples of ${unit} does the count fall between?`, 'The digit just below the rounding place decides which way to go.'],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    });
}

/** Decimal money add/subtract story (D12, D14, D20). */
export function storyDecimalMoney(op: 1 | -1): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = (r.int(150, 4800) / 100).toFixed(2);
      let b = (r.int(75, 2500) / 100).toFixed(2);
      const name = r.pick(NAMES);
      if (op === -1 && Number(b) >= Number(a)) b = (Number(a) / 2).toFixed(2);
      const value = op === -1 ? subDec(a, b) : addDec(a, b);
      return {
        type: 'word-problem',
        prompt: op === -1 ? `${name} has $${a} and spends $${b}. How much money is left?` : `${name} spends $${a} on a book and $${b} on a pen. How much is spent in all?`,
        answer: { value, acceptableForms: [`$${value}`], validation: 'exact-numeric', units: 'dollars' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_addsub_v1', params: { a, b, op }, seed: r.uint() },
        hintLadder: ['Line up the decimal points — dollars over dollars, cents over cents.', 'Keep two decimal places for money.'],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    });
}

/** Decimal × whole cost story (D20). */
export function storyDecMultiply(): ItemGen {
  const ITEMS = ['notebooks', 'apples', 'pens', 'tickets', 'stamps', 'markers'];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const price = (r.int(15, 95) / 10).toFixed(1);
      const qty = r.int(3, 9);
      const item = r.pick(ITEMS);
      const name = r.pick(NAMES);
      return {
        type: 'word-problem',
        prompt: `${name} buys ${qty} ${item} at $${price} each. What is the total cost?`,
        answer: { value: mulDec(price, String(qty)), acceptableForms: [`$${mulDec(price, String(qty))}`], validation: 'exact-numeric', units: 'dollars' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_dec_mul_v1', params: { a: price, b: String(qty) }, seed: r.uint() },
        hintLadder: ['Multiply the price by the quantity as if there were no point, then place the point.', 'Count one decimal place in the price for the answer.'],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    });
}

/** Fraction combine story (recipe / distance). like=true → same denominator. */
export function storyFractionCombine(op: 1 | -1, like = false): ItemGen {
  const PAIRS: Array<[number, number]> = [[2, 3], [3, 4], [4, 6], [2, 5], [3, 6], [5, 10], [2, 4], [3, 8]];
  const LIKE_D = [4, 5, 6, 8, 10, 12];
  const SCENES = [
    { unit: 'cup', verb: (n: string) => `${n}'s recipe` },
    { unit: 'mile', verb: (n: string) => `${n}` },
    { unit: 'liter', verb: (n: string) => `${n}'s jug` },
  ];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      let d1: number;
      let d2: number;
      if (like) {
        d1 = d2 = r.pick(LIKE_D);
      } else {
        [d1, d2] = r.pick(PAIRS);
      }
      let n1 = r.int(1, d1 - 1);
      let n2 = r.int(1, d2 - 1);
      if (op === -1 && n1 / d1 <= n2 / d2) {
        n1 = d1 - 1;
        n2 = 1;
      }
      const scene = r.pick(SCENES);
      const name = r.pick(NAMES);
      const result = op === -1 ? subFrac({ n: n1, d: d1 }, { n: n2, d: d2 }) : addFrac({ n: n1, d: d1 }, { n: n2, d: d2 });
      const prompt = op === -1
        ? `${scene.verb(name)} had ${fracStr(n1, d1)} ${scene.unit} and used ${fracStr(n2, d2)} ${scene.unit}. How much ${scene.unit} is left?`
        : `${scene.verb(name)} used ${fracStr(n1, d1)} ${scene.unit} and then ${fracStr(n2, d2)} ${scene.unit} more. How much ${scene.unit} in all?`;
      return {
        type: 'word-problem',
        prompt,
        answer: { value: formatFrac(result), acceptableForms: [], validation: 'equivalent-fraction', units: scene.unit },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: like ? 'd_frac_like_v1' : 'd_frac_unlike_v1', params: like ? { n1, n2, d: d1, op } : { n1, d1, n2, d2, op }, seed: r.uint() },
        hintLadder: [like ? 'Same-size pieces already — combine the counts.' : 'Estimate against 1/2 and 1 first, then re-cut both into the same size pieces.', 'Simplify the result if it can be.'],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    });
}

/** Fraction comparison word problem — answer is the greater fraction (D9). */
export function storyFractionCompare(): ItemGen {
  const SCENES = [
    { unit: 'mile', verb: 'ran' },
    { unit: 'bar', verb: 'ate' },
    { unit: 'hour', verb: 'read for' },
  ];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d1 = r.pick([2, 3, 4, 5, 6, 8]);
      let d2 = r.pick([2, 3, 4, 5, 6, 8]);
      if (d2 === d1) d2 = d1 === 8 ? 3 : d1 + 1;
      const n1 = r.int(1, d1 - 1);
      const n2 = r.int(1, d2 - 1);
      if (Math.abs(n1 / d1 - n2 / d2) < 1e-9) return storyFractionCompare()(r, guard, difficulty);
      const scene = r.pick(SCENES);
      const [name1, name2] = r.shuffle([...NAMES]).slice(0, 2);
      const bigger = n1 / d1 > n2 / d2 ? fracStr(n1, d1) : fracStr(n2, d2);
      const winner = n1 / d1 > n2 / d2 ? name1 : name2;
      return {
        type: 'word-problem',
        prompt: `${name1} ${scene.verb} ${fracStr(n1, d1)} ${scene.unit} and ${name2} ${scene.verb} ${fracStr(n2, d2)} ${scene.unit}. Who did more — and what fraction did they do?`,
        answer: { value: bigger, acceptableForms: [winner, `${winner} ${bigger}`], validation: 'short-text-keyword' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_compare_v1', params: { n1, d1, n2, d2 }, seed: r.uint() },
        hintLadder: ['Compare each fraction to a benchmark like 1/2, or re-cut to a common size.', 'A bigger bottom means smaller pieces, not more amount.'],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    });
}

/** whole × fraction story: recipe scaling (D11). */
export function storyFracTimesWhole(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = r.pick([2, 3, 4, 5, 6, 8]);
      const n = r.int(1, d - 1);
      const k = r.int(2, 6);
      const name = r.pick(NAMES);
      const result = mulFrac({ n: k, d: 1 }, { n, d });
      return {
        type: 'word-problem',
        prompt: `Each batch of ${name}'s bread needs ${fracStr(n, d)} cup of flour. How much flour is needed for ${k} batches?`,
        answer: { value: formatFrac(result), acceptableForms: [`${k * n}/${d}`], validation: 'equivalent-fraction', units: 'cup' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_times_whole_v1', params: { k, n, d }, seed: r.uint() },
        hintLadder: ['Equal batches — count the fraction once for every batch.', 'Multiply the top by the number of batches; the piece-size stays.'],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    });
}

/** fraction of a fraction story (D18). */
export function storyFracOfFrac(): ItemGen {
  const SCENES = [
    { whole: 'garden', unit: 'acre', part: 'beans cover' },
    { whole: 'wall', unit: 'wall', part: 'blue paint covers' },
    { whole: 'field', unit: 'field', part: 'corn fills' },
  ];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d1 = r.pick([2, 3, 4]);
      const d2 = r.pick([2, 3, 4, 5]);
      const n1 = r.int(1, d1 - 1);
      const n2 = r.int(1, d2 - 1);
      const scene = r.pick(SCENES);
      const result = mulFrac({ n: n1, d: d1 }, { n: n2, d: d2 });
      return {
        type: 'word-problem',
        prompt: `A ${scene.whole} is ${fracStr(n2, d2)} of an ${scene.unit} in size, and ${scene.part} ${fracStr(n1, d1)} of it. What fraction of an ${scene.unit} is that?`,
        answer: { value: formatFrac(result), acceptableForms: [`${n1 * n2}/${d1 * d2}`], validation: 'equivalent-fraction', units: scene.unit },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_times_frac_v1', params: { n1, d1, n2, d2 }, seed: r.uint() },
        hintLadder: ['"Of" signals multiply: a fraction of a fraction.', 'Multiply tops together and bottoms together.'],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    });
}

/** whole ÷ unit-fraction story: scooping (D19). */
export function storyFracDivide(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = r.pick([2, 3, 4, 5, 6]);
      const k = r.int(2, 6);
      const name = r.pick(NAMES);
      const result = divFrac({ n: k, d: 1 }, { n: 1, d });
      return {
        type: 'word-problem',
        prompt: `${name} pours ${k} cups of rice using a ${fracStr(1, d)}-cup scoop. How many scoops is that?`,
        answer: { value: formatFrac(result), acceptableForms: [], validation: 'equivalent-fraction', units: 'scoops' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_frac_div_v1', params: { n1: k, d1: 1, n2: 1, d2: d }, seed: r.uint() },
        hintLadder: ['How many scoops fill ONE cup? Then all of the cups.', 'Dividing by a unit fraction multiplies by its bottom number.'],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    });
}

// ===========================================================================
// Retrieval wrapper + Day-5 (noncomputational) authored items
// ===========================================================================

/** Wrap any core generator as a backward-only spaced-retrieval warm-up (QG-2). */
export function asWarmup(base: ItemGen, source: WeekRef): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, Math.min(difficulty, 3));
    return {
      ...d,
      prompt: `Warm-up! ${d.prompt}`,
      difficulty: Math.min(d.difficulty, 3),
      isRetrieval: true,
      retrievalSource: source,
    };
  };
}

interface ReasoningCfg {
  type?: ItemType;
  prompt: string;
  value: string;
  acceptableForms?: string[];
  keywords?: boolean; // true → short-text-keyword; false/omit → manual-review
  hints: string[];
  errorTags: ErrorTag[];
}

/** Authored Day-5 written-reasoning item (short-text-keyword or manual-review). */
export function reasoning(cfg: ReasoningCfg): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, () => ({
      type: cfg.type ?? 'reasoning',
      prompt: cfg.prompt,
      answer: {
        value: cfg.value,
        acceptableForms: cfg.acceptableForms ?? [],
        validation: cfg.keywords ? 'short-text-keyword' : 'manual-review',
      },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      hintLadder: cfg.hints,
      errorTags: cfg.errorTags,
    }));
}

interface ClassifyCfg {
  prompt: string;
  correct: string;
  distractors: Array<{ text: string; errorTag: ErrorTag; rationale: string }>;
  hints: string[];
  errorTags: ErrorTag[];
  type?: ItemType;
}

/** Authored Day-5 classification / Always-Sometimes-Never item (choice). */
export function classify(cfg: ClassifyCfg): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const { choices, correctKey } = makeChoices(r, cfg.correct, cfg.distractors);
      const item: ItemDraft = {
        type: cfg.type ?? 'classification',
        prompt: cfg.prompt,
        choices,
        answer: { value: correctKey, acceptableForms: [cfg.correct], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        hintLadder: cfg.hints,
        errorTags: cfg.errorTags,
      };
      return item;
    });
}

export type { Choice };
