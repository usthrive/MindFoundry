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
import { assertsParam, numberLine } from './figures';
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
        const values: number[] = [];
        while (values.length < 4) {
          const v = signed(r, 1, 14);
          if (!values.includes(v)) values.push(v);
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
      // Both negative, different magnitudes: exactly the shape where "8 > 3"
      // pulls the wrong way.
      const big = r.int(5, 15);
      const small = r.int(1, big - 1);
      const [a, b] = r.int(0, 1) === 0 ? [-big, -small] : [-small, -big];
      const truth = verifyCompareSymbol({ a, b });
      return {
        prompt: `Which symbol makes this true? ${fmtInt(a)} __ ${fmtInt(b)}`,
        correct: truth.correct,
        distractors: [
          {
            text: truth.correct === '<' ? '>' : '<',
            errorTag: 'concept-misconception',
            rationale: 'Ranks the two by how far they sit from zero, so the bigger digits look like the bigger number.',
          },
          {
            text: '=',
            errorTag: 'representation-misread',
            rationale: 'Reads both as "some amount of cold" without ordering them.',
          },
        ],
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
        const place = r.pick(['a cliff path', 'a lift shaft', 'a canyon walk', 'a harbour wall']);
        return {
          prompt: `On ${place}, ${name} marks a height of ${countNoun(n, 'm')} against sea level. Which height is the OPPOSITE of that mark?`,
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
        const n = signed(r, 2, 30);
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
        const a = signed(r, 2, 18);
        let b = signed(r, 2, 18);
        // A gap of 0 has nothing to compare and a gap of 1 would render the
        // unit-bearing answer as "1 degrees" through some surfaces.
        if (Math.abs(a - b) < 2) b = a + (a < 0 ? 5 : -5);
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
        const start = negative(r, 2, 12);
        const fall = r.int(2, 9);
        let rise = r.int(2, 12);
        // A rise equal to the fall makes the two moves cancel, which reads as a
        // non-problem; and keep the reported answer clear of ±1 and 0, since the
        // answer carries a unit.
        if (rise === fall) rise += 3;
        while (Math.abs(start - fall + rise) < 2) rise += 2;
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
      return { a: -big, b: -small };
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
      const x = signed(r, 2, 8);
      let y = signed(r, 2, 8);
      if (y === x) y = -x;
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

/** Reflect a point across an axis (E7 plot-then-reflect). */
export function reflectPoint(axis: 'x' | 'y' | 'origin' = 'x'): ItemGen {
  return situation({
    situationType: 'measurement',
    cognitiveOp: 'int-reflect',
    draw: (r) => {
      const x = signed(r, 2, 9);
      const y = signed(r, 2, 9);
      const name = r.pick(NAMES);
      const across =
        axis === 'x' ? 'across the x-axis' : axis === 'y' ? 'across the y-axis' : 'through the origin';
      const thing = r.pick(['a mirrored tile', 'a folded map', 'a symmetric logo', 'a reflected buoy']);
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
  });
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
            rationale: 'Reads the pair up-then-across, so the point lands where the swapped pair would.',
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
      const x = signed(r, 2, 8);
      let y = signed(r, 2, 8);
      if (y === x) y = -x;
      return { x, y, mode: 'swap' };
    },
    build: (v, p) => ({
      prompt: `A student was asked to plot a point ${countNoun(Math.abs(num(p, 'x')), 'units')} along the x-axis and ${countNoun(Math.abs(num(p, 'y')), 'units')} along the y-axis, with the signs shown on the map. They wrote the point as ${v.wrong}.`,
      extension: 'Plot both pairs on one grid, then write the pair the map really describes and say how the two spots differ.',
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
