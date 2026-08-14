/**
 * G5 — signed order/abs, signed arithmetic, four quadrants (E6-E9)
 *
 * The Level-E integer family (FILL-ARCHITECTURE §2 row G5, §6 recipes E6-E9):
 * order/compare · opposites and absolute value · signed ± chains · signed × ÷ ·
 * four-quadrant plot / name / reflect — plus the four misconceptions those weeks
 * name by hand: −8 > −3 ("because 8 > 3"), −5 + 3 = −8 (adds the magnitudes),
 * neg × neg = neg, and the x/y swap on the plane.
 *
 * Contract every family in this directory follows:
 *  - generators return an `ItemGen` (see lib/items.ts) and stamp `authorMeta`;
 *  - every computational item names a `templateId` registered in the array
 *    below, so QG-5 re-derives its answer from the same params the generator
 *    used and a wrong answer key is structurally impossible;
 *  - embedded-claim items (discrimination / error-analysis) register a
 *    `verifyFor` instead, which QG-11 calls the same way;
 *  - prose is interpolated ONLY through lib/format.ts, never a bare `${…}`;
 *  - figures come from lib/figures.ts and are built from the item's OWN drawn
 *    values, so QG-13 can prove the picture agrees with the answer.
 *
 * `registry.ts` spreads `INTEGER_TEMPLATE_DEFS`, so nothing else needs editing when
 * a template is added here.
 *
 * TWO THINGS THIS FAMILY LEARNED THE HARD WAY, recorded so the next author does
 * not rediscover them:
 *
 *  1. SIGNED MATH IS A COMPUTE-LAYER CONCERN, not a template one. Every value
 *     here comes from `compute.ts` (`cmpFrac`, `canonicalSigned`, `formatPoint`,
 *     `evalRatChain`) rather than from inline arithmetic, because that is where
 *     the audit lives. A template that wrote `String(-n)` by hand would ship
 *     "-0" for n = 0 on some seed and nothing would catch it.
 *
 *  2. A MINUS SIGN IS A DIGIT-ADJACENT CHARACTER, and three shared gates read
 *     prose character by character. So: numbers are rendered with `fmtInt`
 *     (ASCII '-', never the Unicode minus, which QG-11's `prompt.includes(wrong)`
 *     re-derivation would miss), and a unit-bearing answer never lands on ±1 —
 *     QG-12c's "1 <plural>" scan has no left boundary for the sign, so a
 *     perfectly correct "-1 degrees" reads to it as "1 degrees".
 */

import type { BBFigure } from '../../../types';
import type { Rng } from '../../rng';
import type { ItemDraft } from '../shared';
import type { AnswerDef, VerifyDef, VerifyResult } from './compute';
import { canonicalSigned, cmpFrac, formatPoint, num, str } from './compute';
import { discrimination } from './discrimination';
import { errorAnalysis } from './erroranalysis';
import { assertsParam, coordinateGrid, numberLine } from './figures';
import { countNoun, fmtInt, unitFor } from './format';
import { multiStep, type ItemGen } from './multistep';
import { situation } from './situations';

type Params = Record<string, unknown>;

// ===========================================================================
// Shared draw helpers
// ===========================================================================

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

/** Two distinct names (never a hardcoded name that is also in the pool). */
function two(r: Rng): [string, string] {
  return r.shuffle([...NAMES]).slice(0, 2) as [string, string];
}

/**
 * A non-zero integer of magnitude `lo`…`hi`, negative with probability ~1/2.
 * Magnitude starts at 2 wherever the value can reach an ANSWER that carries a
 * unit (see the ±1 note in the header).
 */
function signed(r: Rng, lo: number, hi: number): number {
  const mag = r.int(lo, hi);
  return r.int(0, 1) === 0 ? -mag : mag;
}

/** A strictly negative integer of magnitude `lo`…`hi`. */
function negative(r: Rng, lo: number, hi: number): number {
  return -r.int(lo, hi);
}

/**
 * A number-line window that certainly contains `values` (and always zero — the
 * whole point of an integer line is that the child can SEE which side of zero a
 * value sits on). `checkFigureShape` requires max > min and every mark inside,
 * both of which the padding guarantees.
 */
function lineWindow(values: number[]): { min: number; max: number; step: number } {
  const lo = Math.min(...values, 0);
  const hi = Math.max(...values, 0);
  const pad = Math.max(1, Math.round((hi - lo) / 8));
  const min = lo - pad;
  const max = hi + pad;
  const span = max - min;
  const step = span <= 14 ? 1 : span <= 40 ? 5 : span <= 120 ? 10 : 25;
  return { min, max, step };
}

/**
 * Attach a figure built from the item's OWN `generator.params` (the QG-13 law:
 * the picture is derived from the values the answer was derived from, so it
 * cannot disagree with it).
 *
 * It is a local wrapper because `situations.ts` / `multistep.ts` carry no
 * `figure` slot in their draw shapes and those are shared files this family does
 * not own. Reading the params back off the finished draft is not a workaround
 * for that — it is the same guarantee arrived at from the other end: there is no
 * second draw, so no second source of truth.
 */
function withFigure(base: ItemGen, build: (params: Params) => BBFigure | undefined): ItemGen {
  return (rng, guard, difficulty) => {
    const draft: ItemDraft = base(rng, guard, difficulty);
    if (!draft.generator) return draft;
    const figure = build(draft.generator.params as Params);
    return figure ? { ...draft, figure } : draft;
  };
}

/** Read a number[] param (the array shapes `compute.num` cannot type-check). */
function nums(p: Params, key: string): number[] {
  const v = p[key];
  if (!Array.isArray(v) || v.length === 0 || v.some((x) => typeof x !== 'number' || !Number.isFinite(x))) {
    throw new Error(`template param '${key}' must be a non-empty number[]`);
  }
  return v as number[];
}

// ===========================================================================
// Registered answers (QG-5 re-derives every one of these)
// ===========================================================================

/** Ascending / descending order of a drawn set — the E6 Day-5 signature. */
function intOrder(p: Params): string {
  const values = nums(p, 'values');
  const dir = str(p, 'dir');
  if (dir !== 'asc' && dir !== 'desc') throw new Error(`e_int_order_v1: dir must be 'asc' or 'desc'`);
  // Ordered through cmpFrac, not `a - b`: one comparison primitive, one audit.
  const sorted = [...values].sort((a, b) => cmpFrac({ n: a, d: 1 }, { n: b, d: 1 }));
  if (dir === 'desc') sorted.reverse();
  return sorted.map((v) => String(canonicalSigned(v))).join(', ');
}

/** Exact signed quotient — integer templates never leave a remainder. */
function intDiv(p: Params): string {
  const a = num(p, 'a');
  const b = num(p, 'b');
  if (b === 0) throw new Error('e_int_div_v1: division by zero');
  if (a % b !== 0) throw new Error(`e_int_div_v1: ${a} ÷ ${b} is not exact`);
  return String(canonicalSigned(a / b));
}

/** Reflection of a point across an axis (or through the origin). */
function intReflect(p: Params): string {
  const x = num(p, 'x');
  const y = num(p, 'y');
  switch (str(p, 'axis')) {
    case 'x': return `${canonicalSigned(x)}, ${canonicalSigned(-y)}`;
    case 'y': return `${canonicalSigned(-x)}, ${canonicalSigned(y)}`;
    case 'origin': return `${canonicalSigned(-x)}, ${canonicalSigned(-y)}`;
    default: throw new Error(`e_int_reflect_v1: axis must be 'x', 'y' or 'origin'`);
  }
}

// ===========================================================================
// Registered truths for the choice items (code-selected, never hand-authored)
//
// `discrimination()` does not attach a GeneratorSpec to its drafts, so QG-11
// cannot re-derive these from the shipped pack the way it re-derives an
// error-analysis truth. Registering them anyway is what keeps the correct option
// code-computed: the draw calls the SAME function the registry exposes, so the
// keyed answer and the registered truth are one expression, not two.
// ===========================================================================

/** The comparison symbol that makes "a __ b" true. */
function verifyCompareSymbol(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const c = cmpFrac({ n: a, d: 1 }, { n: b, d: 1 });
  return { correct: c < 0 ? '<' : c > 0 ? '>' : '=' };
}

/** The value of a signed add/sub, for value-choice traps. */
function verifyAddSubValue(p: Params): VerifyResult {
  const a = num(p, 'a');
  const b = num(p, 'b');
  const op = str(p, 'op');
  if (op !== '+' && op !== '-') throw new Error(`e_int_addsub_truth_v1: op must be '+' or '-'`);
  return { correct: String(canonicalSigned(op === '+' ? a + b : a - b)) };
}

const QUADRANT = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'] as const;

/** Which quadrant a point falls in — the signs, not the sizes, decide. */
function verifyQuadrant(p: Params): VerifyResult {
  const x = num(p, 'x');
  const y = num(p, 'y');
  if (x === 0 || y === 0) throw new Error('e_int_quadrant_v1: a point on an axis is in no quadrant');
  const idx = x > 0 ? (y > 0 ? 0 : 3) : y > 0 ? 1 : 2;
  return { correct: QUADRANT[idx] };
}

/** Sign of a product from the COUNT of negative factors (E9 "count-the-signs"). */
function verifySignCount(p: Params): VerifyResult {
  const factors = nums(p, 'factors');
  if (factors.some((f) => f === 0)) throw new Error('e_int_sign_count_v1: a zero factor has no sign');
  const negatives = factors.filter((f) => f < 0).length;
  return { correct: negatives % 2 === 0 ? 'positive' : 'negative' };
}

// ===========================================================================
// E6 — negative numbers: order, opposites, absolute value
// ===========================================================================

/** Order a mixed week of temperatures (E6 Day-5 signature). */
export function orderTemperatures(dir: 'asc' | 'desc' = 'asc'): ItemGen {
  return withFigure(
    situation({
      situationType: 'comparison',
      cognitiveOp: 'int-order',
      draw: (r) => {
        // ZERO IS DRAWABLE — one set in four contains it.
        //
        // The set used to be filled from `signed(r, 1, 14)`, whose magnitude
        // starts at 1, so zero appeared in 0 of 2,000 draws (measured). Zero is
        // the mirror line this whole week is built on, and the week's own Day-5
        // ordering item could not show it. It is also the one reading whose
        // place in the order no amount of digit-comparing will settle, which is
        // exactly the discrimination the item is for.
        //
        // The set is SHUFFLED before it is listed. Seeding zero into the array
        // first would have printed it in the leftmost slot every time it was
        // drawn — a positional tell traded for a coverage gap, which is the
        // same defect `eaMagnitudeOrder` carries below.
        const drawn: number[] = [];
        if (r.int(1, 4) === 1) drawn.push(0);
        while (drawn.length < 4) {
          const v = signed(r, 1, 14);
          if (!drawn.includes(v)) drawn.push(v);
        }
        // `shuffle` returns a new array and leaves its input alone, so the
        // shuffled one is what both the prose and `params` carry — one order,
        // one source of truth, and QG-5/QG-13 re-derive from the listed set.
        //
        // THE LISTED ORDER IS NEITHER SORTED ORDER. Four values have 24
        // arrangements, two of which are the answer and the answer backwards,
        // so 4.4% of draws printed the readings already in the order the item
        // asks for and another 4.1% printed them in exact reverse (measured,
        // 4,000 draws per direction). "Four readings: 12, -2, -6, -13. Write
        // them in order, WARMEST first" was served as a MASTERY slot, where the
        // work is copying a line that is already done. Found by reading the
        // pack; no gate sees it, because the answer is right.
        //
        // Rejecting both costs 2 of 24 arrangements and removes the one habit
        // — copy the list, forwards or backwards — that reaches the answer
        // without reading a single sign.
        const ascending = [...drawn].sort((x, y) => cmpFrac({ n: x, d: 1 }, { n: y, d: 1 }));
        const sortedKey = ascending.join(',');
        const reverseKey = [...ascending].reverse().join(',');
        let values = r.shuffle(drawn);
        for (let i = 0; i < 40 && (values.join(',') === sortedKey || values.join(',') === reverseKey); i++) {
          values = r.shuffle(drawn);
        }
        const day = r.pick(['week', 'cold snap', 'ski trip', 'field week']);
        const listed = values.map((v) => fmtInt(v)).join(', ');
        const order = dir === 'asc' ? 'COLDEST first' : 'WARMEST first';
        return {
          prompt: `Four readings from one ${day}, in ${unitFor(2, 'degrees')}: ${listed}. Write them in order, ${order}.`,
          answerValue: intOrder({ values, dir }),
          templateId: 'e_int_order_v1',
          params: { values, dir },
          validation: 'ordered-list',
          // Per-direction ladders: the §6.5 dedup gate counts ladder TEMPLATES,
          // so two configurations of one factory sharing a ladder would burn the
          // week's whole allowance on one wording.
          hints:
            dir === 'asc'
              ? [
                  'Which of these readings would you have to travel furthest LEFT on a number line to reach?',
                  'Place every reading on the line first, then read them off left to right.',
                ]
              : [
                  'Which of these readings sits furthest RIGHT on a number line?',
                  'Place every reading on the line first, then read them off right to left.',
                ],
          errorTags: ['concept-misconception', 'representation-misread'],
        };
      },
    }),
    (p) => {
      const values = nums(p, 'values');
      return numberLine(lineWindow(values), {
        alt: `a number line through zero, wide enough to hold all four readings`,
      });
    },
  );
}

/** The magnitude trap, as a symbol choice: −8 __ −3 (E6 discrimination). */
export function compareNegativesTrap(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'int-compare',
    draw: (r) => {
      // PAIR SHAPES, drawn — not always both-negative-and-unequal.
      //
      // This used to draw `big = int(5,15)`, `small = int(1, big-1)` and negate
      // both. Two defects fell out of that, and E6's author refused to serve the
      // generator because of them (measured, 2,000 draws):
      //
      //  1. `small < big` ALWAYS, so the two readings could never coincide and
      //     the "=" card was offered on 2,000/2,000 draws and keyed on NONE — a
      //     permanently unkeyable option (L38), which teaches a child to strike
      //     it out unread. `compareWhole` in items.ts was repaired for exactly
      //     this and draws a tie one time in five.
      //  2. Both operands were always negative, so the true symbol was the
      //     reverse of the magnitude comparison on 100% of draws — "compare the
      //     digits, then flip" certified every time. A rule that is uniformly
      //     invertible is not a discrimination.
      //
      // Both are fixed by drawing the SHAPE first: below-zero pairs still carry
      // the week's trap and stay the most common, while cross-zero, on-zero and
      // tied pairs make the flip-rule wrong and the "=" card reachable.
      // Shape mix. `across` is the only shape on which "compare the digits, then
      // flip" is WRONG, so it is weighted equally with `below` rather than left
      // as a garnish: at 3-below/1-across the flip rule still won 90.9% of draws
      // (measured), which is a rule a child can carry out of the week intact.
      const shape = r.pick(['below', 'below', 'across', 'across', 'zero', 'tie'] as const);
      let a: number;
      let b: number;
      if (shape === 'tie') {
        const v = -r.int(1, 15);
        [a, b] = [v, v];
      } else if (shape === 'zero') {
        const v = -r.int(1, 15);
        [a, b] = r.int(0, 1) === 0 ? [v, 0] : [0, v];
      } else if (shape === 'across') {
        const neg = -r.int(1, 15);
        const pos = r.int(1, 15);
        [a, b] = r.int(0, 1) === 0 ? [neg, pos] : [pos, neg];
      } else {
        const big = r.int(5, 15);
        const small = r.int(1, big - 1);
        [a, b] = r.int(0, 1) === 0 ? [-big, -small] : [-small, -big];
      }
      const truth = verifyCompareSymbol({ a, b });
      return {
        prompt: `Which symbol makes this true? ${fmtInt(a)} __ ${fmtInt(b)}`,
        correct: truth.correct,
        // The two symbols that are NOT the truth — derived, never hard-coded.
        // Hard-coding '=' as a distractor was safe only while '=' could never be
        // the answer; the moment a tie became drawable it produced a card set
        // holding '=' twice, once keyed and once not.
        distractors: (['<', '>', '='] as const)
          .filter((sym) => sym !== truth.correct)
          .map((sym) => (
            sym === '='
              ? {
                text: '=',
                errorTag: 'representation-misread' as const,
                rationale: 'Reads both as "some amount of cold" without ordering them.',
              }
              : {
                text: sym,
                errorTag: 'concept-misconception' as const,
                rationale: 'Ranks the two by how far they sit from zero, so the bigger digits look like the bigger number.',
              }
          )),
        hints: [
          'Which of these two would you meet FIRST walking left to right along a number line?',
          'Whatever comes first walking rightwards is the smaller number, however big its digits look.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

/** Opposites — same distance from zero, other side (E6 mirror-line anchor). */
export function oppositeValue(): ItemGen {
  return withFigure(
    situation({
      situationType: 'measurement',
      cognitiveOp: 'int-opposite',
      draw: (r) => {
        const n = signed(r, 2, 40);
        const name = r.pick(NAMES);
        // The preposition travels WITH the place. A single hard-coded "On"
        // shipped "On a lift shaft, Zoe marks a height of…" on 24.1% of draws
        // (measured) — you are in a lift shaft, not on one. There is no gate
        // for English, so the only place this can be got right is at the draw.
        const place = r.pick([
          { prep: 'On', name: 'a cliff path' },
          { prep: 'In', name: 'a lift shaft' },
          { prep: 'On', name: 'a canyon walk' },
          { prep: 'On', name: 'a harbour wall' },
        ] as const);
        return {
          prompt: `${place.prep} ${place.name}, ${name} marks a height of ${countNoun(n, 'm')} against sea level. Which height is the OPPOSITE of that mark?`,
          answerValue: String(canonicalSigned(-n)),
          templateId: 'e_int_opposite_v1',
          params: { n },
          units: 'm',
          hints: [
            'Does the opposite of a height sit closer to sea level, further from it, or the same distance the other way?',
            'Fold the line at zero and see where the mark lands.',
          ],
          errorTags: ['concept-misconception', 'procedure-slip'],
        };
      },
    }),
    // The GIVEN mark, never the answer: showing where the opposite lands would
    // hand over the very move the item asks for.
    (p) => {
      const n = num(p, 'n');
      return numberLine(
        { ...lineWindow([n, -n]), marks: [{ at: n, label: fmtInt(n), style: 'point' }] },
        { alt: `a number line through zero with the given height marked`, asserts: assertsParam('n', 'mark:0') },
      );
    },
  );
}

/** Absolute value as distance from zero (E6). */
export function absoluteValue(): ItemGen {
  return withFigure(
    situation({
      situationType: 'measurement',
      cognitiveOp: 'int-abs',
      draw: (r) => {
        // THE SIGN IS WEIGHTED, three negative readings to one positive.
        //
        // `signed()` is an even coin, and on a POSITIVE draw |n| = n: the answer
        // is the number already printed in the prompt, so "copy it out" is
        // correct and the misconception this item exists to catch — report the
        // reading as it stands, sign and all — scores 100%. Measured at 50.4%
        // of 2,000 draws.
        //
        // Weighted rather than banned, deliberately. |+n| = n is a fact about
        // distance the week has to teach; a child who only ever meets negatives
        // learns "absolute value means strike out the minus sign", which is the
        // wrong rule with the right answers. The residual 25% is that fact, not
        // a defect — the same call `compareNegativesTrap` makes below about the
        // flip rule being genuinely correct on both-negative pairs.
        const mag = r.int(2, 30);
        const n = r.int(1, 4) === 1 ? mag : -mag;
        const thing = r.pick(['a diving platform', 'a mine shaft entry', 'a drone', 'a submarine hatch']);
        return {
          prompt: `${thing[0].toUpperCase()}${thing.slice(1)} logs its position as ${countNoun(n, 'm')} relative to sea level. How FAR from sea level is it?`,
          answerValue: String(Math.abs(n)),
          templateId: 'e_int_abs_v1',
          params: { n },
          units: 'm',
          hints: [
            'Does a distance care which side of zero you are on?',
            'Count the steps back to zero, and report the count.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        };
      },
    }),
    (p) => {
      const n = num(p, 'n');
      return numberLine(
        { ...lineWindow([n]), marks: [{ at: n, label: fmtInt(n), style: 'point' }] },
        { alt: `a number line with the logged position marked and zero visible`, asserts: assertsParam('n', 'mark:0') },
      );
    },
  );
}

/** How far apart two signed readings are (E6, feeds the E8 chains). */
export function distanceBetween(): ItemGen {
  return withFigure(
    situation({
      situationType: 'comparison',
      cognitiveOp: 'int-distance',
      draw: (r) => {
        // THE PAIR SHAPE IS DRAWN, weighted to the readings that cross zero.
        //
        // Two independent `signed()` draws land on the same side of zero half
        // the time (measured: 50.0% of 2,000), and a same-side pair is a plain
        // whole-number subtraction wearing a minus sign — -14 and -3 are 11
        // apart by exactly the arithmetic the child had before this week. Half
        // of a signed-distance generator's draws carried no signed content.
        //
        // Shapes: `across` 3 (the week's actual content — the count runs
        // through zero), `zero` 1 (distance from the mirror line itself, the
        // case that makes |n| and "how far from zero" the same question), and
        // `same` 1, kept because it is a real reading pair and the one place
        // where "just subtract" is right.
        //
        // Every shape holds the old gap rule: a gap of 0 has nothing to compare
        // and a gap of 1 renders the unit-bearing answer as "1 degrees" through
        // some surfaces (the ±1 note in the header).
        const shape = r.pick(['across', 'across', 'across', 'zero', 'same'] as const);
        let a: number;
        let b: number;
        if (shape === 'zero') {
          const v = signed(r, 2, 18);
          [a, b] = r.int(0, 1) === 0 ? [v, 0] : [0, v];
        } else if (shape === 'across') {
          const neg = -r.int(2, 18);
          const pos = r.int(2, 18);
          [a, b] = r.int(0, 1) === 0 ? [neg, pos] : [pos, neg];
        } else {
          const sign = r.int(0, 1) === 0 ? -1 : 1;
          const m1 = r.int(2, 18);
          let m2 = r.int(2, 18);
          // Nudged AWAY from m1 and always back inside 2…18, so the same-side
          // shape cannot drift out of the range the story is written for.
          if (Math.abs(m1 - m2) < 2) m2 = m1 <= 9 ? m1 + 5 : m1 - 5;
          [a, b] = [sign * m1, sign * m2];
        }
        const [n1, n2] = two(r);
        return {
          prompt: `${n1} records ${countNoun(a, 'degrees')} and ${n2} records ${countNoun(b, 'degrees')} on the same morning. How many degrees apart are the two readings?`,
          answerValue: String(Math.abs(a - b)),
          templateId: 'e_int_distance_v1',
          params: { a, b },
          units: 'degrees',
          hints: [
            'Is the gap between two readings ever a negative amount?',
            'Count the steps from one reading to the other along the line, crossing zero if you must.',
          ],
          errorTags: ['procedure-slip', 'concept-misconception'],
        };
      },
    }),
    (p) => {
      const a = num(p, 'a');
      const b = num(p, 'b');
      return numberLine(
        {
          ...lineWindow([a, b]),
          marks: [
            { at: a, label: fmtInt(a), style: 'point' },
            { at: b, label: fmtInt(b), style: 'point' },
          ],
        },
        { alt: `a number line with both morning readings marked`, asserts: assertsParam('a', 'mark:0') },
      );
    },
  );
}

/** Temperature falls then rises — the E6 multi-step (a signed chain). */
export function temperatureSwing(): ItemGen {
  return withFigure(
    multiStep({
      situationType: 'rate-of-change',
      cognitiveOp: 'int-addsub',
      draw: (r) => {
        // RESAMPLED, never nudged.
        //
        // This used to draw the triple once and then push `rise` until the draw
        // was legal: +3 on a cancel, then +2 per round while |answer| < 2. Every
        // one of those steps moves the ANSWER by the same amount, so the three
        // answers the loop was written to exclude did not disappear — they were
        // shunted onto their neighbours. -1 needed two rounds and landed on 3;
        // 0 landed on 2; 1 landed on 3. Measured over 2,000 draws: 25 distinct
        // answers, 20.8% of the mass on {1, 2, 3} and 12.9% on "3" alone. A
        // child who notices that "3" is the house favourite has found a better
        // strategy than adding, which is what the item is for.
        //
        // The third condition is new: the story prints `start`, `fall` and
        // `rise`, so an answer equal to any of them is copied rather than
        // computed (measured at 4.2% of draws — "It falls 2 degrees … then
        // rises 10", answer 2).
        //
        // Resampling keeps every constraint and leaves the distribution alone.
        // The seed values below are a documented last resort, not a default:
        // well over half the 968-triple space is admissible, so 60 consecutive
        // misses has probability around 1e-13. They are stated rather than left
        // implicit because a draw loop that can fall off its own end and ship an
        // inadmissible item is precisely the defect being repaired.
        let start = -5;
        let fall = 3;
        let rise = 4; // answer -4: two moves that do not cancel, and distinct
        for (let i = 0; i < 60; i++) {
          const s = negative(r, 2, 12);
          const f = r.int(2, 9);
          const u = r.int(2, 12);
          const answer = s - f + u;
          // A rise equal to the fall makes the two moves cancel, which reads as
          // a non-problem; the answer stays clear of ±1 and 0 because it
          // carries a unit (the ±1 note in the header); and clear of every
          // number the prompt already prints.
          if (f === u) continue;
          if (Math.abs(answer) < 2) continue;
          if (answer === s || answer === f || answer === u) continue;
          start = s;
          fall = f;
          rise = u;
          break;
        }
        const when = r.pick(['dawn', 'first light', 'the early shift', 'sunrise']);
        return {
          prompt: `At ${when} a weather station reads ${countNoun(start, 'degrees')}. It falls ${countNoun(fall, 'degrees')} by mid-morning, then rises ${countNoun(rise, 'degrees')} by noon. What does it read at noon?`,
          initN: start,
          steps: [{ op: 'sub', n: fall, d: 1 }, { op: 'add', n: rise, d: 1 }],
          units: 'degrees',
          hints: [
            'Before you work: does a fall then a rise always end above where it started?',
            'Take the moves one at a time along the line — each one starts where the last one stopped.',
          ],
          errorTags: ['procedure-slip', 'concept-misconception'],
        };
      },
    }),
    (p) => {
      const start = num(p, 'initN');
      return numberLine(
        { ...lineWindow([start, start - 12, start + 14]), marks: [{ at: start, label: fmtInt(start), style: 'flag' }] },
        { alt: `a number line through zero with the dawn reading flagged`, asserts: assertsParam('initN', 'mark:0') },
      );
    },
  );
}

/** Day-5 error analysis: −8 > −3 "because 8 > 3" (E6 — the named E6 slip). */
export function eaMagnitudeOrder(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_verify_int_compare_v1',
    cognitiveOp: 'int-compare',
    drawParams: (r) => {
      // Both negative, magnitudes apart, so the misconception has a distinct
      // output (the verify refuses any pair where it would not).
      const big = r.int(5, 15);
      const small = r.int(2, big - 1);
      // WHICH READING IS NAMED FIRST IS DRAWN.
      //
      // This used to return `{ a: -big, b: -small }` unconditionally, so the
      // warmer reading — the one the item asks for — was named SECOND on
      // 500/500 draws (measured). The item is manual-review, so no child is
      // certified by it and the tell cannot pass anyone through the gate; that
      // is exactly why it survived. What it can do is teach: "the second one is
      // the answer" is a rule a child can carry out of Day 5, and it is a rule
      // about nothing. `verifyIntCompare` reads the pair, not the order, so it
      // recomputes the same truth either way.
      return r.int(0, 1) === 0 ? { a: -big, b: -small } : { a: -small, b: -big };
    },
    build: (v, p) => ({
      prompt: `A student was asked which is the WARMER reading, ${countNoun(num(p, 'a'), 'degrees')} or ${countNoun(num(p, 'b'), 'degrees')}, and answered ${v.wrong}, saying the bigger number wins.`,
      extension: 'Mark both readings on one number line, then write which reading really is warmer and say what the line shows that the digits do not.',
      hints: [
        'Which way along a number line does a reading have to move to get warmer?',
        'Mark both readings on one line and see which one you reach later moving rightwards.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    }),
  });
}

// ===========================================================================
// E7 — the four-quadrant plane
// ===========================================================================

/** Name the ordered pair for a described position (E7 plot/name). */
export function namePointFromMoves(): ItemGen {
  return situation({
    situationType: 'measurement',
    cognitiveOp: 'int-plot',
    draw: (r) => {
      // THE SIGN OF y IS DRAWN FIRST, INDEPENDENTLY; only its MAGNITUDE is
      // redrawn on a collision.
      //
      // This began as `if (y === x) y = -x`, which converted every
      // same-sign-same-magnitude draw into an opposite-sign pair and tilted the
      // keys to QII/QIV on 57.9% of 2,400 draws. Redrawing y whole was better
      // (54.8%) but not level, and could not be: x === y is only ever a
      // SAME-SIGN event, so any rule that rejects it removes same-sign pairs
      // and nothing else. Deciding the sign before the collision can happen is
      // what makes the four quadrants equally likely — the magnitude redraw
      // then keeps x !== y, which the swap misconception downstream needs.
      //
      // Four E weeks share this generator; a quadrant drawn less often is one a
      // child meets less often.
      const x = signed(r, 2, 8);
      const ySign = r.int(0, 1) === 0 ? -1 : 1;
      let yMag = r.int(2, 8);
      if (ySign === Math.sign(x)) {
        for (let i = 0; i < 20 && yMag === Math.abs(x); i++) yMag = r.int(2, 8);
      }
      const y = ySign * yMag;
      const name = r.pick(NAMES);
      const [xWord, xDir] = x > 0 ? ['right', 'east'] : ['left', 'west'];
      const [yWord, yDir] = y > 0 ? ['up', 'north'] : ['down', 'south'];
      const map = r.pick(['a treasure map', 'a park map', 'a stage plan', 'a harbour chart']);
      return {
        prompt: `On ${map}, ${name} starts at the origin, goes ${countNoun(Math.abs(x), 'steps')} ${xWord} (${xDir}), then ${countNoun(Math.abs(y), 'steps')} ${yWord} (${yDir}). Which ordered pair names that spot?`,
        answerValue: `${canonicalSigned(x)}, ${canonicalSigned(y)}`,
        templateId: 'e_int_point_name_v1',
        params: { x, y },
        validation: 'ordered-list',
        acceptableForms: [formatPoint(x, y)],
        hints: [
          'Which movement does the FIRST number in a pair always describe?',
          'Along the corridor before up the stairs: the sideways move is written first, and its direction decides its sign.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  });
}

/**
 * A square window that certainly contains `points` AND both axes.
 *
 * Square and symmetric on purpose: a reflection item whose grid was cropped to
 * its own points would show the mirror line off-centre, which is the one visual
 * fact the item depends on. `checkFigureShape` wants max > min on both axes;
 * the padding guarantees it even for a point sitting on an axis.
 */
function gridWindow(points: Array<{ x: number; y: number }>): { xMin: number; xMax: number; yMin: number; yMax: number; step: number } {
  const reach = Math.max(1, ...points.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)]));
  const span = reach + 1;
  return { xMin: -span, xMax: span, yMin: -span, yMax: span, step: span <= 12 ? 1 : 2 };
}

/** Reflect a point across an axis (E7 plot-then-reflect). */
export function reflectPoint(axis: 'x' | 'y' | 'origin' = 'x'): ItemGen {
  return withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'int-reflect',
    draw: (r) => {
      const x = signed(r, 2, 9);
      const y = signed(r, 2, 9);
      const name = r.pick(NAMES);
      const across =
        axis === 'x' ? 'across the x-axis' : axis === 'y' ? 'across the y-axis' : 'through the origin';
      const thing = r.pick(['a mirrored tile', 'a folded map', 'a symmetric logo', 'a harbour buoy']);
      return {
        prompt: `${name} is designing ${thing}. The point ${formatPoint(x, y)} is reflected ${across}. Which ordered pair names the reflected point?`,
        answerValue: intReflect({ x, y, axis }),
        templateId: 'e_int_reflect_v1',
        params: { x, y, axis },
        validation: 'ordered-list',
        acceptableForms: [`(${intReflect({ x, y, axis })})`],
        hints:
          axis === 'x'
            ? [
                'Which coordinate can a mirror along the horizontal axis leave completely alone?',
                'Fold the grid along the horizontal axis: the height flips to the other side, the sideways position stays put.',
              ]
            : axis === 'y'
              ? [
                  'Which coordinate can a mirror along the vertical axis leave completely alone?',
                  'Fold the grid along the vertical axis: the sideways position flips, the height stays put.',
                ]
              : [
                  'Does turning a point half-way round the origin leave either coordinate untouched?',
                  'Spin the grid half a turn about the origin and read where the point has landed.',
                ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
    // The GIVEN point only — never the reflection. Plotting the answer would
    // hand over the move the item asks for, the same rule `oppositeValue`
    // follows above. What the grid supplies is the mirror line itself, which is
    // the thing a child cannot reason about from two numbers in a bracket.
    (p) => {
      const x = num(p, 'x');
      const y = num(p, 'y');
      return coordinateGrid(
        { ...gridWindow([{ x, y }]), points: [{ x, y, label: formatPoint(x, y), style: 'point' }] },
        {
          alt: `a four-quadrant grid with the starting point marked and both axes through zero`,
          // NO `asserts`, deliberately, and for two independent reasons.
          //
          // Mechanically: `point:k` reads back the formatted PAIR, "(-2,-4)",
          // and this template's params are the scalars x, y and axis. There is
          // no param for `assertsParam` to compare it against — pairing it with
          // `x` fails on every draw, which is how this was found.
          //
          // And in principle: the assertion binds a figure to the item's
          // ANSWER, and this figure deliberately shows the point BEFORE the
          // reflection. Tying it to the answer is exactly what must not happen
          // here. `withFigure` already gives the QG-13 guarantee structurally —
          // the picture is built from the same params the answer came from, so
          // there is no second source of truth to disagree with.
        },
      );
    },
  );
}

/** Signs name the quadrant — (−3, 2) vs (2, −3) (E7 discrimination). */
export function quadrantSignTrap(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'int-quadrant',
    draw: (r) => {
      const x = signed(r, 2, 9);
      let y = signed(r, 2, 9);
      if (Math.abs(y) === Math.abs(x)) y = y > 0 ? y + 1 : y - 1;
      const truth = verifyQuadrant({ x, y });
      const swapped = verifyQuadrant({ x: y, y: x });
      const mirrored = verifyQuadrant({ x: -x, y });
      return {
        prompt: `In which quadrant does the point ${formatPoint(x, y)} lie?`,
        correct: truth.correct,
        distractors: [
          {
            text: swapped.correct === truth.correct ? mirrored.correct : swapped.correct,
            errorTag: 'representation-misread',
            // THE RATIONALE FOLLOWS THE CARD, because the card is not always
            // the swap. When x and y share a sign the point is in QI or QIII,
            // both of which are swap-invariant — the swap lands back on the
            // truth, so the code falls through to the y-mirror. That happens on
            // 49.5% of 4,000 draws, and the fixed wording claimed the child had
            // read the pair up-then-across on every one of them: a rationale
            // naming a move that did not produce the option it is attached to,
            // which is the DD7 bookkeeping QG-3 exists to keep honest.
            rationale:
              swapped.correct === truth.correct
                ? 'Reads the first number\'s sign off the wrong side of the origin, so the point lands in the mirror-image corner.'
                : 'Reads the pair up-then-across, so the point lands where the swapped pair would.',
          },
          {
            text:
              [...QUADRANT].filter((q) => q !== truth.correct && q !== swapped.correct && q !== mirrored.correct)[0] ??
              QUADRANT[(QUADRANT.indexOf(truth.correct as typeof QUADRANT[number]) + 2) % 4],
            errorTag: 'concept-misconception',
            rationale: 'Numbers the quadrants clockwise, so the count runs the wrong way round the origin.',
          },
        ],
        hints: [
          'Which two facts about a pair decide its quadrant — the sizes of the numbers, or their signs?',
          'Read the first sign for left-or-right and the second for up-or-down, then find that corner.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  });
}

/** Day-5 error analysis: the x/y swap (E7). */
export function eaCoordinateSwap(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_verify_point_v1',
    cognitiveOp: 'int-plot',
    drawParams: (r) => {
      // Redrawn, not negated — same reason as `namePointFromMoves` above.
      const x = signed(r, 2, 8);
      let y = signed(r, 2, 8);
      for (let i = 0; i < 20 && y === x; i++) y = signed(r, 2, 8);
      return { x, y, mode: 'swap' };
    },
    build: (v, p) => ({
      // THE DIRECTIONS ARE STATED, not referred to.
      //
      // This used to read "…along the y-axis, with the signs shown on the map"
      // on 100% of draws, and the item ships no map — it is an errorAnalysis
      // draft with no figure, measured at 0% (500 draws). The signs were
      // technically recoverable from the student's wrong pair, so the item was
      // answerable and no gate could object; a child who went looking for the
      // map simply did not find one. Same shape as the hundred-chart items a
      // six-year-old reported, recorded in figures.ts.
      //
      // Naming left/right and above/below states the signs in words, which is
      // also the vocabulary the week is teaching.
      prompt: `A student was asked to plot a point ${countNoun(Math.abs(num(p, 'x')), 'units')} to the ${num(p, 'x') < 0 ? 'LEFT' : 'RIGHT'} of the origin and ${countNoun(Math.abs(num(p, 'y')), 'units')} ${num(p, 'y') < 0 ? 'BELOW' : 'ABOVE'} it. They wrote the point as ${v.wrong}.`,
      extension: 'Plot both pairs on one grid, then write the pair the directions really describe and say how the two spots differ.',
      hints: [
        'Which number in an ordered pair does the grid read first?',
        'Walk each pair out on the grid — across first, then up — and see where the two walks end.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    }),
  });
}

// ===========================================================================
// E8 — adding and subtracting integers (zero pairs)
// ===========================================================================

/** A single signed move: a balance, a score, a depth (E8). */
export function signedAddSubStory(op: '+' | '-' = '+'): ItemGen {
  return withFigure(
    situation({
      situationType: op === '+' ? 'combine' : 'rate-of-change',
      cognitiveOp: 'int-addsub',
      draw: (r) => {
        const a = negative(r, 2, 15);
        // Subtracting a negative is the case E8 exists for; adding pairs a
        // negative start with a positive move.
        let b = op === '-' ? negative(r, 2, 9) : r.int(2, 12);
        // Keep the ANSWER clear of ±1: `countNoun` would render it "-1 points",
        // and QG-12c's "1 <plural>" scan has no boundary for the minus sign.
        while (Math.abs(op === '+' ? a + b : a - b) < 2) b += op === '+' ? 1 : -1;
        const name = r.pick(NAMES);
        const value = op === '+' ? a + b : a - b;
        const prompt =
          op === '+'
            ? `${name}'s game score is ${countNoun(a, 'points')}. The next round is worth ${countNoun(b, 'points')}. What is the score after that round?`
            : `${name}'s game score is ${countNoun(a, 'points')}. A penalty worth ${countNoun(b, 'points')} is taken back off the scoreboard. What is the score now?`;
        return {
          prompt,
          answerValue: String(canonicalSigned(value)),
          templateId: 'e_int_addsub_v1',
          params: { a, b, op },
          units: 'points',
          hints:
            op === '+'
              ? [
                  'Does a positive round always lift a score back above zero?',
                  'Start at the given score on the line and step the round out in the direction it points.',
                ]
              : [
                  'Does taking a penalty back off a scoreboard move a score up or down?',
                  'Start at the given score on the line and undo the penalty move — undoing runs the other way.',
                ],
          errorTags: ['concept-misconception', 'procedure-slip'],
        };
      },
    }),
    (p) => {
      const a = num(p, 'a');
      const b = num(p, 'b');
      return numberLine(
        { ...lineWindow([a, a + b, a - b]), marks: [{ at: a, label: fmtInt(a), style: 'flag' }] },
        { alt: `a number line through zero with the starting score flagged`, asserts: assertsParam('a', 'mark:0') },
      );
    },
  );
}

/** Two signed moves in one story — the E8 signed chain. */
export function signedChainStory(): ItemGen {
  return withFigure(
    multiStep({
      situationType: 'multi-stage',
      cognitiveOp: 'int-addsub',
      draw: (r) => {
        const start = negative(r, 4, 20) * 5;
        const rise = r.int(2, 12) * 5;
        let dive = r.int(2, 12) * 5;
        // A dive equal to the rise makes the chain a no-op (and reads as three
        // copies of one number); a near-zero finish would render "-1 m".
        if (dive === rise) dive += 5;
        while (Math.abs(start + rise - dive) < 2) dive += 5;
        const name = r.pick(NAMES);
        const craft = r.pick(['submersible', 'dive drone', 'research sub', 'survey pod']);
        return {
          prompt: `${name}'s ${craft} sits at ${countNoun(start, 'm')} relative to sea level. It rises ${countNoun(rise, 'm')}, then dives ${countNoun(dive, 'm')}. Where is it now?`,
          initN: start,
          steps: [{ op: 'add', n: rise, d: 1 }, { op: 'sub', n: dive, d: 1 }],
          units: 'm',
          hints: [
            'Before you compute: can a rise followed by a bigger dive ever finish above where it began?',
            'Do the moves in the order told, keeping every position on one line through zero.',
          ],
          errorTags: ['procedure-slip', 'concept-misconception'],
        };
      },
    }),
    (p) => {
      const start = num(p, 'initN');
      return numberLine(
        { ...lineWindow([start, start + 60, 0]), marks: [{ at: start, label: fmtInt(start), style: 'flag' }] },
        { alt: `a vertical-style number line through sea level with the starting depth flagged`, asserts: assertsParam('initN', 'mark:0') },
      );
    },
  );
}

/** Minus-a-negative vs minus-a-positive (E8 discrimination). */
export function minusNegativeTrap(): ItemGen {
  return discrimination({
    variant: 'cross-op',
    cognitiveOp: 'int-addsub',
    draw: (r) => {
      const a = negative(r, 2, 12);
      const b = r.int(3, 12);
      const truth = verifyAddSubValue({ a, b: -b, op: '-' });
      const trap = verifyAddSubValue({ a, b, op: '-' });
      return {
        prompt: `Two cards are dealt from the same start of ${fmtInt(a)}. Card A says "subtract ${fmtInt(b)}". Card B says "subtract ${fmtInt(-b)}". Which number does Card B land on?`,
        correct: truth.correct,
        distractors: [
          {
            text: trap.correct,
            errorTag: 'concept-misconception',
            rationale: 'Treats both cards as the same move, since both say "subtract".',
          },
          {
            text: String(canonicalSigned(a)),
            errorTag: 'task-comprehension',
            rationale: 'Cancels the two signs into no move at all and stays at the start.',
          },
        ],
        hints: [
          'Does removing a debt leave you better off or worse off?',
          'Read the second card as undoing a downward move, and see which way that sends you along the line.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  });
}

/** Day-5 error analysis: adds the magnitudes, −5 + 3 = −8 (E8). */
export function eaAddsMagnitudes(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_verify_int_addsub_v1',
    cognitiveOp: 'int-addsub',
    drawParams: (r) => ({ a: negative(r, 2, 14), b: r.int(2, 12), op: '+', wrongMode: 'add-magnitudes' }),
    build: (v, p) => ({
      prompt: `A student worked out the noon temperature after a reading of ${countNoun(num(p, 'a'), 'degrees')} rose by ${countNoun(num(p, 'b'), 'degrees')}, and wrote ${v.wrong} degrees.`,
      extension: 'Draw the move on a number line, then write the true reading and describe what the drawn move does that the written one does not.',
      hints: [
        'Which direction does a rise send you along the line, whatever the starting reading?',
        'Put the starting reading on the line and step the rise out one unit at a time.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    }),
  });
}

// ===========================================================================
// E9 — multiplying and dividing signed numbers
// ===========================================================================

/** A repeated signed change: k periods of a per-period drop or gain (E9). */
export function signedMultiplyStory(): ItemGen {
  return situation({
    situationType: 'rate',
    cognitiveOp: 'int-mul',
    draw: (r) => {
      const rate = signed(r, 2, 9);
      const k = r.int(2, 9);
      const name = r.pick(NAMES);
      const unitWord = r.pick(['hour', 'day', 'week', 'round']);
      const falls = rate < 0;
      return {
        // Both numbers of the period word come from format.ts — `countNoun`
        // pluralises it and `unitFor` gives the singular; neither is spelled by
        // hand, which is the whole point of the P5 rule.
        prompt: `${name} tracks a change of ${countNoun(rate, 'degrees')} every ${unitFor(1, unitWord)} — ${falls ? 'a fall' : 'a rise'} each time. What is the total change after ${countNoun(k, unitWord)}?`,
        answerValue: String(canonicalSigned(rate * k)),
        templateId: 'e_int_mul_v1',
        params: { a: rate, b: k },
        units: 'degrees',
        hints: [
          'Does repeating a fall make the total change bigger or smaller than one fall?',
          'Count the repeats of the same signed move, and keep the direction the story gave you.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/** Undo a repeated signed change — exact signed division (E9). */
export function signedDivideStory(): ItemGen {
  return situation({
    situationType: 'sharing',
    cognitiveOp: 'int-div',
    draw: (r) => {
      const k = r.int(2, 9);
      const rate = signed(r, 2, 9);
      const total = rate * k;
      const name = r.pick(NAMES);
      const unitWord = r.pick(['hour', 'day', 'week', 'round']);
      return {
        prompt: `Over ${countNoun(k, unitWord)}, ${name} logs a total change of ${countNoun(total, 'degrees')}, and the change was the same every ${unitFor(1, unitWord)}. What was the change per ${unitFor(1, unitWord)}?`,
        answerValue: intDiv({ a: total, b: k }),
        templateId: 'e_int_div_v1',
        params: { a: total, b: k },
        units: 'degrees',
        hints: [
          'If the whole change was downward, can any single step have been upward?',
          'Share the total change equally across the periods, direction included.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/** Count-the-signs: is the product positive or negative? (E9 discrimination). */
export function countTheSignsTrap(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'int-sign',
    draw: (r) => {
      const size = r.int(3, 4);
      const factors: number[] = [];
      for (let i = 0; i < size; i++) factors.push(signed(r, 2, 9));
      // Guarantee at least two negatives, so the item is about COUNTING signs
      // rather than spotting a single one.
      if (factors.filter((f) => f < 0).length < 2) {
        factors[0] = -Math.abs(factors[0]);
        factors[1] = -Math.abs(factors[1]);
      }
      const truth = verifySignCount({ factors });
      const shown = factors.map((f) => fmtInt(f)).join(' x ');
      return {
        prompt: `Without multiplying it out: is the product ${shown} positive or negative?`,
        correct: truth.correct,
        distractors: [
          {
            text: truth.correct === 'positive' ? 'negative' : 'positive',
            errorTag: 'concept-misconception',
            rationale: 'Carries the sign of the first factor (or of any negative seen) straight to the product.',
          },
          {
            text: 'it depends on the sizes of the numbers',
            errorTag: 'task-comprehension',
            rationale: 'Looks at magnitudes, which never affect the sign of a product.',
          },
        ],
        hints: [
          'How many of these factors pull the product to the other side of zero?',
          'Pair the negative factors off; each pair cancels, and what is left decides the sign.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  });
}

/** Day-5 error analysis: neg × neg kept negative (E9). */
export function eaNegTimesNeg(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'e_verify_int_mul_v1',
    cognitiveOp: 'int-mul',
    drawParams: (r) => ({ a: negative(r, 2, 9), b: negative(r, 2, 9), op: '*', wrongMode: 'neg-times-neg-is-neg' }),
    build: (v, p) => ({
      prompt: `A student multiplied ${fmtInt(num(p, 'a'))} by ${fmtInt(num(p, 'b'))} and wrote ${v.wrong}, saying that two negatives keep the minus sign.`,
      extension: 'Continue the times-table pattern downward past zero to show what the product must be, then write the true product.',
      hints: [
        'What happens to a product each time one factor drops by one step?',
        'Write the row of products in order and follow the pattern past zero.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    }),
  });
}

// ===========================================================================
// Registry (spread by registry.ts)
// ===========================================================================

export const INTEGER_TEMPLATE_DEFS: Array<AnswerDef | VerifyDef> = [
  // --- Order, opposites, absolute value (E6) --------------------------------
  { id: 'e_int_order_v1', answerFor: intOrder },
  { id: 'e_int_opposite_v1', answerFor: (p) => String(canonicalSigned(-num(p, 'n'))) },
  { id: 'e_int_abs_v1', answerFor: (p) => String(Math.abs(num(p, 'n'))) },
  { id: 'e_int_distance_v1', answerFor: (p) => String(Math.abs(num(p, 'a') - num(p, 'b'))) },
  // --- Signed arithmetic (E8, E9) -------------------------------------------
  {
    id: 'e_int_addsub_v1',
    answerFor: (p) => String(canonicalSigned(str(p, 'op') === '-' ? num(p, 'a') - num(p, 'b') : num(p, 'a') + num(p, 'b'))),
  },
  { id: 'e_int_mul_v1', answerFor: (p) => String(canonicalSigned(num(p, 'a') * num(p, 'b'))) },
  { id: 'e_int_div_v1', answerFor: intDiv },
  // --- The coordinate plane (E7) --------------------------------------------
  { id: 'e_int_point_name_v1', answerFor: (p) => `${canonicalSigned(num(p, 'x'))}, ${canonicalSigned(num(p, 'y'))}` },
  { id: 'e_int_reflect_v1', answerFor: intReflect },
  // --- Choice-item truths (code-selects the correct option; see the note
  //     above the functions for why they are registered even though
  //     `discrimination()` ships no GeneratorSpec) ----------------------------
  { id: 'e_int_compare_symbol_v1', verifyFor: verifyCompareSymbol },
  { id: 'e_int_addsub_truth_v1', verifyFor: verifyAddSubValue },
  { id: 'e_int_quadrant_v1', verifyFor: verifyQuadrant },
  { id: 'e_int_sign_count_v1', verifyFor: verifySignCount },
];
