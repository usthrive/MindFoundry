/**
 * Level B · Week 13 — "Addition within 100 (regrouping)"
 * (conceptId: add-within-100-regrouping).
 *
 * FILL-ARCHITECTURE §4 row B13: anchor "trade ten ones for a ten"; multi-step
 * "three addends"; error-analysis "the carry dropped (63 for 47 + 26)";
 * discrimination "regroup vs no regroup"; Day-5 signature "two ways to add
 * 38 + 25".
 *
 * THE HAZARD THIS WEEK CARRIES. The concept is a written method, so the lazy
 * version of the week is five pages of column sums wearing five different nouns.
 * Depth here therefore comes from WHERE the trade happens, never from bigger
 * numbers — every number on every page is a two-digit number a Level-B child
 * already reads. One drawn primitive, `columns(r, shape)`, produces a sum with a
 * NAMED structure:
 *   `none`        — the ones settle below ten, so nothing travels anywhere;
 *   `trade`       — the ones pass ten, so one ten travels and some ones stay;
 *   `exactly-ten` — the ones make ten on the nose, so the WHOLE amount travels
 *                   and the ones column is left holding nothing.
 * Every situation names its shape, so the pages differ by their arithmetic
 * structure rather than by their nouns, and `predictTrade` draws its shape fresh
 * each time and asks the child to call — BEFORE computing — whether a trade is
 * coming. That call is a real question only because the shape genuinely varies.
 *
 * ⚠ VERIFY-LIBRARY LIMIT, declared per FANOUT kit §E2.3. The recipe's
 * error-analysis is a DROPPED carry: 63 for 47 + 26, a total exactly one ten
 * short. That total is not derivable from a registered verify over the story's
 * own operands. `d_verify_binop_misconception_v1` varies the OPERATION across one
 * fixed pair, and solving `a + b = T` with `a ∘ b = T − 10` over {+,−,×,÷} forces
 * b = 5 (so the shown slip reads as a plain subtraction of five, which is not a
 * dropped carry and is not anything a child does) or a degenerate pair unrelated
 * to the prose. Fabricating the number is forbidden, so per the kit's own order:
 *
 *   - the dropped carry is shown where it CAN be computed honestly. It is a
 *     code-derived option in `discrimWhichTotal` (the total a sum reaches when the
 *     traded ten never lands — literally the recipe's 63 for 47 + 26, beside the
 *     recipe's other named output, the whole ones total written into the ones
 *     place, 613), it is the subject of the Day-5 Always/Sometimes/Never claim,
 *     and it heads the mistake bank;
 *   - Day 5's generated error-analysis carries the same slip AT THE PLACE THE
 *     TRADE HAPPENS, where it IS derivable: the tens are counted and the count
 *     stops one short, because the ten handed up from the ones is never counted
 *     in. `a_verify_count_slip_v1` in `slip:'skip-count'` mode is the corpus's
 *     registered "the count stopped one short" transform and returns exactly
 *     {correct: n, wrong: n − 1}. Fed the TENS COUNT of the true total it produces
 *     the recipe's own arithmetic — 7 tens counted as 6, so 47 + 26 finishes at
 *     63 — code-derived, with the misconception named by the template rather than
 *     invented by the prompt. The addends ride in the same params so the prose and
 *     the truth are drawn together; the template reads only `n` and `slip`.
 *
 * CONCEPT FAMILY: `'operation'`, the full row (≥2 multi-step week-wide).
 * Declaring 'place-value' would have been a dodge — the concept is an addition
 * method, and its own recipe hands it a three-addend two-step.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Two families, both built from
 * the item's own drawn values, both asserting a GIVEN:
 *   - a tens-and-ones CHART holds ONE stated addend, so it teaches what a column
 *     is worth and can never total anything;
 *   - a ONES FRAME holds the single ones one stated number has, so the bare boxes
 *     show how many more ones fit before the column spills — the evidence the
 *     prediction and the regroup-or-not choice are decided on, without either
 *     being decided for the child.
 * No assessed item is ever drawn AFTER the trade: a frame holding thirteen ones
 * shows the leftover ones, which is an answer on two of these pages. The finished
 * trade appears only in the lesson script and the modeled guided example, where
 * the answer is already printed.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): sentences kept short;
 * `column`, `trade` and `carry` glossed in `explanation.vocabulary` before any
 * item leans on them; metacognition in its intro form — the B row's own
 * "will it pass ten?" prediction, drawn over a pool that genuinely holds both
 * answers; error-analysis written-lite, one sentence; the sprint ungraded and
 * self-referenced on the two-digit-plus-one-digit work of B11.
 *
 * Retrieval is backward-only into B2 (tens and ones — how many whole tens a
 * number holds), B5 (the partner of ten, which is how many ones still fit before
 * the column spills), B10 (adding whole tens on the hundred chart) and B11
 * (two-digit + one-digit across a ten — the same trade in one column).
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, counterGroups, tenFrame } from '../lib/figures';
import type { BBFigure, FigureAssertion, PlaceName } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B2 = { level: 'B' as const, week: 2 };
const B5 = { level: 'B' as const, week: 5 };
const B10 = { level: 'B' as const, week: 10 };
const B11 = { level: 'B' as const, week: 11 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so a comparison story cannot compare someone with themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// columns() — the week's drawn primitive
//
// A two-digit + two-digit sum whose REGROUP STRUCTURE is chosen, not left to
// luck. Every range below is closed by construction (lo ≤ hi for every draw), so
// a shape never needs a redraw loop: a loop consumes a variable number of rng
// draws and makes every later item in the pack depend on this one (kit §E2.4).
//
// Three invariants hold for every shape: both addends are genuine two-digit
// numbers, the two addends are different, and the total stays under 100 — the
// ceiling the week is named for.
// ---------------------------------------------------------------------------

type Shape = 'none' | 'trade' | 'exactly-ten';

interface Sum {
  a: number;
  b: number;
  total: number;
  /** The two ones digits, and what they come to together. */
  o1: number;
  o2: number;
  onesSum: number;
  /** The two tens digits. */
  t1: number;
  t2: number;
  /** Tens in the finished total — one more than t1 + t2 whenever a ten travels. */
  totalTens: number;
}

function columns(r: Rng, shape: Shape): Sum {
  let o1: number;
  let o2: number;
  switch (shape) {
    case 'none':
      // The ones settle inside nine, so no column hands anything on.
      o1 = r.int(1, 4);
      o2 = r.int(1, 9 - o1);
      break;
    case 'exactly-ten':
      // The ones make ten on the nose: the whole amount travels and the ones
      // column finishes empty, which is the case children read as "gone".
      o1 = r.int(2, 8);
      o2 = 10 - o1;
      break;
    default:
      // The ones pass ten, so one ten travels and at least one one stays behind.
      o1 = r.int(3, 9);
      o2 = r.int(Math.max(2, 11 - o1), 9);
      break;
  }
  // A travelling ten needs room in the tens column, so the tens cap is one lower
  // on the two shapes that trade. Either way the total stays under a hundred.
  const t1 = r.int(1, 4);
  const cap = shape === 'none' ? 9 : 8;
  let t2 = r.int(1, cap - t1);
  // "47 pipe cleaners and 47 pipe cleaners" reads like a typo even when the
  // arithmetic is sound. Nudged in the TENS digit, deterministically and in one
  // step: the chosen ones structure survives untouched, and t1 + t2 only ever
  // falls (or rises from two to three), so the total stays under a hundred.
  if (t1 === t2 && o1 === o2) t2 = t2 > 1 ? t2 - 1 : 2;
  const a = 10 * t1 + o1;
  const b = 10 * t2 + o2;
  const onesSum = o1 + o2;
  return {
    a,
    b,
    total: a + b,
    o1,
    o2,
    onesSum,
    t1,
    t2,
    totalTens: t1 + t2 + (onesSum >= 10 ? 1 : 0),
  };
}

// ---------------------------------------------------------------------------
// withFigure / withDrawnFrame / placeValueChart
//
// The shipped primitives carry no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so the
// QG-1/QG-4 surface signature the guard already registered is unchanged).
// `withFigure` rebuilds from the drafted item's `generator.params` — the very
// numbers its answer was computed from — which is what makes a contradicting
// picture unbuildable rather than merely unlikely. `withDrawnFrame` covers the
// case `discrimination()` creates: it emits no generator spec at all, so the draw
// closure posts what it drew into a one-slot box which the decorator reads
// immediately afterwards (`drawUniqueItem` returns the draft its LAST build call
// produced, so the box always holds that same draw).
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface DrawnOnes {
  /** Single ones sitting in the ones column at the moment the picture is taken. */
  n: number;
  seed: number;
}

function onesSlot(): { last: DrawnOnes | null } {
  return { last: null };
}

/** The posted draw, or a loud failure — never a silently different picture. */
function posted(box: { last: DrawnOnes | null }, who: string): DrawnOnes {
  if (!box.last) throw new Error(`b13/${who}: the draw posted no ones count to build the frame from`);
  return box.last;
}

/**
 * Give a choice item the ones frame it was drawn from, plus the generator spec
 * that pins the picture's params to the item's own draw. `a_frame_read_v1` is the
 * template that names them: it carries no `verifyFor`, so QG-11 does not hunt for
 * a worked claim on an item that makes none, and its `answerFor` is never
 * consulted either (the arithmetic audit skips choice-key items) — while QG-13
 * still proves the drawn frame holds the count the item drew.
 */
function withDrawnFrame(
  box: { last: DrawnOnes | null },
  base: ItemGen,
  build: (f: DrawnOnes) => BBFigure,
): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const drawn = posted(box, 'withDrawnFrame');
    return {
      ...d,
      generator: { templateId: 'a_frame_read_v1', params: { n: drawn.n }, seed: drawn.seed },
      figure: build(drawn),
    };
  };
}

/**
 * The ones column drawn as a frame of ten: the single ones a stated number holds,
 * with its bare boxes left to be counted. It shows how much room is left before
 * the column spills, and it never shows what spills.
 */
const onesFrame = (n: number, asserts: FigureAssertion): BBFigure =>
  tenFrame(n, {
    alt: `a ones frame holding ${countNoun(n, 'ones')}, its other boxes still bare`,
    asserts,
  });

/**
 * The local builder for the one figure family `lib/figures.ts` does not expose a
 * helper for. It emits the same schema and the same `asserts` clause QG-13
 * re-derives.
 */
function placeValueChart(
  value: number,
  opts: { highlight?: PlaceName; showValues?: boolean; alt: string; asserts?: FigureAssertion },
): BBFigure {
  return {
    type: 'place-value-chart',
    alt: opts.alt,
    params: {
      digits: String(value),
      ...(opts.highlight ? { highlight: opts.highlight } : {}),
      ...(opts.showValues !== undefined ? { showValues: opts.showValues } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/** "a tens-and-ones chart holding 47 …" — a chart of ONE stated number. */
function chartAlt(value: number): string {
  const s = String(value);
  return `a tens-and-ones chart holding ${s}, with ${s[0]} in the tens column and ${s[1]} in the ones column`;
}

// ---------------------------------------------------------------------------
// Context frames
//
// Small pools, scanned against every week already written (kit §E2.8): a
// classroom craft trolley for the two-pile joins, an art box of pipe cleaners for
// the trade page, a jigsaw table for the comparison, and pom-poms and paper
// snowflakes for the two chains. That scan found two collisions, and both were
// re-dressed rather than shipped:
//   - STICKS BUNDLED IN TENS was the first draft of the grouping page, and both
//     B6 and B16 already bundle sticks in tens — the same real-world act, inside
//     the same level. That page now fills the week's OWN model instead (counters
//     laid into ten-frames), which no week uses for grouping and which IS the
//     anchor rather than a story about it.
//   - the trolley pool once shared a noun with the art box, so one day could hold
//     a trolley of them and an art box of them, with nothing telling a child that
//     the two piles were different.
// ---------------------------------------------------------------------------

/** Things the craft trolley holds — the plain join stories. */
const TROLLEY = ['clothes pegs', 'paint brushes'] as const;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B5 — the partner of ten, posed as the question this week needs it for: how many
 * of the ones in your hand will actually fit? A child who knows that has already
 * decided whether a trade is coming.
 */
const wPartnerOfTen = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'partner-of-ten',
    draw: (r) => {
      const held = r.int(6, 9);
      const hand = r.int(10 - held, 9);
      const name = one(r);
      return {
        prompt: `${name} has ${countNoun(held, 'counters')} in a ten-frame and ${countNoun(hand, 'counters')} in one hand. How many of them slide in to fill the frame?`,
        answerValue: String(10 - held),
        templateId: 'retr_partners_of_10_v1',
        params: { a: held },
        units: 'counters',
        hints: [
          'How many boxes in the frame are still waiting?',
          'Count the bare boxes, and only that many can slide in.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  B5,
);

/** B2 — how many whole tens a two-digit number holds, which is what a trade adds to. */
const wTensCount = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'pv-decompose',
    draw: (r) => {
      const n = r.int(23, 89);
      return {
        prompt: `A number card shows ${n}. How many whole tens does ${n} hold?`,
        answerValue: String(Math.floor(n / 10)),
        templateId: 'tens_ones_decompose_v1',
        params: { n },
        units: 'tens',
        hints: [
          'Which digit of a two-digit number counts the whole tens?',
          'Read the left-hand digit on the card, and that is the tens count.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  B2,
);

/** B10 — adding whole tens, the arithmetic the tens column runs on. */
const wAddTens = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add-tens',
    draw: (r) => {
      const start = 10 * r.int(2, 5) + r.int(1, 9);
      const rows = r.int(2, 4);
      return {
        prompt: `A counter sits on ${start} on the hundred chart. It moves down ${countNoun(rows, 'rows')}. Which number is it on now?`,
        answerValue: String(start + 10 * rows),
        templateId: 'retr_add_within_100_v1',
        params: { a: start, b: 10 * rows },
        hints: [
          'Does a step down the chart make a number grow or shrink?',
          'Each row down brings one more ten. Count the tens on and leave the ones digit.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B10,
);

/** B11 — two-digit + one-digit across a ten: the same trade, in one column only. */
const wBridgeOnes = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-across-ten',
    draw: (r) => {
      const stack = 10 * r.int(2, 8) + r.int(5, 9);
      const more = r.int(10 - (stack % 10), 9);
      const name = one(r);
      return {
        prompt: `A stack holds ${countNoun(stack, 'paper cups')}. ${name} puts ${countNoun(more, 'more paper cups')} on top. How many paper cups now?`,
        answerValue: String(stack + more),
        templateId: 'add_within_100_v1',
        params: { a: stack, b: more },
        units: 'paper cups',
        hints: [
          'Will these ones climb past the next whole ten?',
          'Fill the ten first. Then count the cups left over on top of it.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B11,
);

// ---------------------------------------------------------------------------
// Single-step situations — one per REGROUP STRUCTURE, so the pages differ by
// where the trade lands rather than by what the story is about
// ---------------------------------------------------------------------------

/**
 * NO TRADE. The baseline the other structures are heard against, and the page
 * that stops "this is the trading week" from becoming the cue.
 *
 * Figure = a tens-and-ones chart of the first stated count. It is a given, it
 * totals nothing, and it puts the two column names on the page in the order the
 * child will work them.
 */
const sitNoTrade = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-no-trade',
    draw: (r) => {
      const { a, b } = columns(r, 'none');
      const noun = r.pick(TROLLEY);
      return {
        prompt: `[image: ${chartAlt(a)}] The craft trolley holds ${countNoun(a, noun)} in its top tray. The bottom tray holds ${countNoun(b, noun)}. How many ${noun} are in the trolley?`,
        answerValue: String(a + b),
        templateId: 'd_add_v1',
        params: { a, b },
        units: noun,
        hints: [
          // Neutral on purpose: a rung that only ever means "no" on this
          // generator teaches the child to read the hint, not the sum.
          'Do the ones in this sum reach ten, or do they settle below it?',
          'Total the ones, then the tens, and leave each answer where it lands.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'a');
    return placeValueChart(a, { showValues: true, alt: chartAlt(a), asserts: assertsParam('a', 'value') });
  },
);

/**
 * ONE TRADE, with ones left behind — the week's anchor case.
 *
 * Figure = the ones frame of the FIRST part's single ones. `o1` rides in the
 * params for the picture alone: `d_add_v1` reads a and b only, and QG-13 reads
 * only `o1`, so the frame is pinned to the ones the story starts from.
 */
const sitTradeOnes = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'add-trade-ones',
    draw: (r) => {
      const { a, b, o1 } = columns(r, 'trade');
      return {
        prompt: `[image: a ones frame holding ${countNoun(o1, 'ones')}, its other boxes still bare] The art box holds ${countNoun(a, 'red pipe cleaners')}. It also holds ${countNoun(b, 'blue pipe cleaners')}. How many pipe cleaners are in the box?`,
        answerValue: String(a + b),
        templateId: 'd_add_v1',
        params: { a, b, o1 },
        units: 'pipe cleaners',
        hints: [
          'How many ones can one column hold before it has built a whole ten?',
          'Total the ones, send the built ten next door, and keep what stays behind.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  (p) => onesFrame(numOf(p, 'o1'), assertsParam('o1')),
);

/**
 * THE ONES MAKE TEN EXACTLY. The whole amount travels, so the ones column
 * finishes with nothing in it — the structure children read as "the ones have
 * gone", and the one that makes a zero mean something.
 *
 * Posed as a COMPARISON (an amount stated as "more than" another) so the week is
 * not five join stories in a row. Figure = the chart of the amount the story
 * states second, which is a given; the whole is what the question asks for.
 */
const sitExactlyTen = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'add-trade-exact',
    draw: (r) => {
      const drawn = columns(r, 'exactly-ten');
      // The bigger count goes in FIRST, so the compared amount is the smaller of
      // the two. Read the other way round the sentence is sound and sounds wrong:
      // "fitted 18 pieces … fitted 72 more than that" is a comparison nobody
      // makes. The swap is a reordering of two already-drawn numbers, so it costs
      // no rng draw and the ones structure is untouched.
      const a = Math.max(drawn.a, drawn.b);
      const b = Math.min(drawn.a, drawn.b);
      const [first, second] = two(r);
      return {
        prompt: `[image: ${chartAlt(b)}] ${first} fitted ${countNoun(a, 'jigsaw pieces')} into a puzzle. ${second} fitted ${countNoun(b, 'more jigsaw pieces')} than ${first}. How many jigsaw pieces did ${second} fit?`,
        answerValue: String(a + b),
        templateId: 'd_add_v1',
        params: { a, b },
        units: 'jigsaw pieces',
        hints: [
          'What is left in the ones column when the ones fill it exactly?',
          'Send the whole ten across, then read what the ones column still holds.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const b = numOf(p, 'b');
    return placeValueChart(b, { showValues: true, alt: chartAlt(b), asserts: assertsParam('b', 'value') });
  },
);

/**
 * THE TRADE MADE LITERAL: ten single counters really do fill one frame, and the
 * question is what could not get into a frame. This is the anchor with the story
 * taken away — the same ten-frame the figures draw, now doing the grouping.
 *
 * The registered template is `d_sub_v1`, and its `a` and `b` are the operands of
 * the subtraction the child actually performs — the ones the two pots bring, less
 * the ten that filled the last frame. They are deliberately NOT the story's first
 * two numbers, which is why they are named here rather than left to be inferred.
 * `first` and `second` ride along so the prose is drawn from the same place as the
 * truth.
 */
const sitLeftoverOnes = situation({
  situationType: 'sharing',
  cognitiveOp: 'trade-leftover-ones',
  draw: (r) => {
    const { a, b, onesSum } = columns(r, 'trade');
    return {
      prompt: `A ten-frame holds ten counters. One pot has ${countNoun(a, 'counters')} and another has ${countNoun(b, 'counters')}. All of them are laid into ten-frames. How many counters are left with no frame to sit in?`,
      answerValue: String(onesSum - 10),
      templateId: 'd_sub_v1',
      params: { a: onesSum, b: 10, first: a, second: b },
      units: 'counters',
      hints: [
        'Which counters can travel ten at a time, and which have to stay single?',
        'Fill one frame at a time, then count the counters with no frame left.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * METACOGNITION, in the Level-B intro form the fill spec names — a "will it pass
 * ten?" prediction, made before any adding happens.
 *
 * The shape is drawn fresh from all three structures, so the call cannot be
 * answered by reflex or by the page's habits: two of the three shapes fill a ten
 * and one does not, and the child has to look at the two ones digits before
 * picking up a pencil. That is the single habit that stops a trade from going
 * missing.
 *
 * The base is served ONLY through the wrapper (kit §E2.2): a generator used both
 * raw and wrapped ships two identical hint ladders, which spends two of the three
 * the dedup allows on one idea.
 *
 * Figure = the chart of the first stated count with its ones column picked out,
 * so the evidence for the prediction is on the page and the prediction is not.
 */
const predictTradeBase = withFigure(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'predict-trade',
    draw: (r) => {
      const shape = r.pick(['none', 'trade', 'exactly-ten'] as const);
      const { a, b } = columns(r, shape);
      const name = one(r);
      return {
        prompt: `[image: ${chartAlt(a)}] ${name} counted ${countNoun(a, 'skips')} before break. After break ${name} counted ${countNoun(b, 'skips')}. How many skips is that in all?`,
        answerValue: String(a + b),
        templateId: 'd_add_v1',
        params: { a, b },
        units: 'skips',
        hints: [
          'Are the two ones digits big enough between them to fill a ten?',
          'Hold one ones digit against the other. Then work the sum and check your call.',
        ],
        errorTags: ['procedure-slip', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'a');
    return placeValueChart(a, {
      highlight: 'ones',
      alt: chartAlt(a),
      asserts: assertsParam('a', 'value'),
    });
  },
);

const predictTrade = withEstimateFirst(
  predictTradeBase,
  'will the ones in this sum fill a whole ten?',
);

// ---------------------------------------------------------------------------
// Discrimination — regroup or no regroup, and then which total the trade allows
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DISCRIMINATION, drawn so that both sums start from the SAME
 * number: one second number spills the ones column and one stops short of it, so
 * the only thing that can settle the question is a ones digit held against the
 * bare boxes. The third option is the child who has learnt "this is the trading
 * week" and applies it to everything.
 *
 * Every option the child can pick is named in the prompt, so the page reads as
 * one question rather than a question plus a surprise third door — and the sums
 * stay in the prompt, which is where QG-1 reads the operand surface from.
 */
const needsTradeBox = onesSlot();
const discrimNeedsTrade = withDrawnFrame(
  needsTradeBox,
  discrimination({
    variant: 'structural',
    cognitiveOp: 'trade-or-not',
    draw: (r) => {
      // 6–8 ones leaves room for a second number that still stops short of ten.
      const o1 = r.int(6, 8);
      const t1 = r.int(1, 4);
      const first = 10 * t1 + o1;
      const bigOnes = r.int(10 - o1, 9);
      // ONE IN THREE DRAWS MAKES "both sums" THE ANSWER, and the ones digits must
      // still differ so the page never prints one sum twice. Before this, the
      // third option was offered on every exposure and keyed on none: a child who
      // met the page twice learnt to strike it out, and what remained was a
      // two-way choice won by reading the bigger ones digit. A dead option
      // teaches its own elimination. (b05 carries the same fix; both were found
      // by scripts/bb-answer-entropy-test.ts.)
      const bothTrade = r.int(1, 3) === 1;
      const smallOnesRaw = bothTrade ? r.int(10 - o1, 9) : r.int(1, 9 - o1);
      const smallOnes = bothTrade && smallOnesRaw === bigOnes
        ? (bigOnes === 9 ? 10 - o1 : bigOnes + 1)
        : smallOnesRaw;
      const bigger = 10 * r.int(1, 7 - t1) + bigOnes;
      const smaller = 10 * r.int(1, 8 - t1) + smallOnes;
      // Which sum is printed first rotates too — it used to be the trading one
      // every time, so the answer was the first sum named in every draw.
      const biggerFirst = r.int(0, 1) === 0;
      const [shownA, shownB] = biggerFirst ? [bigger, smaller] : [smaller, bigger];
      needsTradeBox.last = { n: o1, seed: r.uint() };
      const keyed = bothTrade ? 'both sums' : `${first} + ${bigger}`;
      return {
        prompt: `[image: a ones frame holding ${countNoun(o1, 'ones')}, its other boxes still bare] A place-value mat holds ${first} — ${countNoun(t1, 'tens')} and ${countNoun(o1, 'ones')}. Two sums start from this mat: ${first} + ${shownA} and ${first} + ${shownB}. Which one has to trade ten ones for a ten? Name one sum, or name both.`,
        correct: keyed,
        distractors: (
          bothTrade
            ? [
              {
                text: `${first} + ${shownA}`,
                errorTag: 'concept-misconception' as const,
                rationale: 'Names one sum and stops, though both second numbers carry more ones than the bare boxes can hold.',
              },
              {
                text: `${first} + ${shownB}`,
                errorTag: 'concept-misconception' as const,
                rationale: 'Names one sum and stops, though both second numbers carry more ones than the bare boxes can hold.',
              },
            ]
            : [
              {
                text: `${first} + ${smaller}`,
                errorTag: 'concept-misconception' as const,
                rationale: 'The ones in that sum stop short of the last bare box, so no ten is ever built and nothing travels.',
              },
              {
                text: 'both sums',
                errorTag: 'task-comprehension' as const,
                rationale: 'Treats every two-digit sum as a trading sum, including the ones whose ones column settles with room to spare.',
              },
            ]
        ).filter((d) => d.text !== keyed),
        hints: [
          'How many boxes are still bare in this ones frame?',
          'Try each second number against those bare boxes, and watch which ones overflow.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (f) => onesFrame(f.n, assertsParam('n')),
);

/**
 * WHICH TOTAL THE TRADE ALLOWS — and the page where the recipe's dropped carry is
 * shown honestly (see the ⚠ note in the file header).
 *
 * Both wrong totals are computed in code from this item's own digits and both are
 * real. One is the total a sum reaches when the traded ten never lands, which is
 * exactly the recipe's 63 for 47 + 26. The other is the total when the whole ones
 * amount is written into the ones place, which is the recipe's 613 for the same
 * sum. Counting the tens separates all three, which is what the check is for.
 */
const discrimWhichTotal = discrimination({
  variant: 'structural',
  cognitiveOp: 'size-check',
  draw: (r) => {
    const { a, b, total, onesSum, t1, t2 } = columns(r, 'trade');
    return {
      prompt: `Only one of these totals can be right for ${a} + ${b}. Count the tens each one has, and pick the total the trade allows.`,
      correct: String(total),
      distractors: [
        {
          text: String(total - 10),
          errorTag: 'concept-misconception',
          rationale: 'The total a sum lands on when the ten built in the ones column never reaches the tens — the answer comes out one whole ten light.',
        },
        {
          text: `${t1 + t2}${onesSum}`,
          errorTag: 'representation-misread',
          rationale: 'The total a sum lands on when the whole ones amount is written inside the ones column, so a two-digit column result is squeezed into one place.',
        },
      ],
      hints: [
        'About how many tens should this total carry, before any adding is done?',
        'Total the two tens digits. Then ask whether the ones column owes them one more.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — the recipe's three addends, in the two places the trade can hide
// ---------------------------------------------------------------------------

/**
 * THREE ADDENDS with the trade in the FIRST join (the B13 multi-step). Two joins
 * in a row, which is where a child discovers that the running total has to be
 * held between the lines — and the traded ten has to survive the second join.
 *
 * The three tens digits are drawn as a shuffled distinct triple, so the three
 * counts can never read as the same number twice, and the total stays inside 100
 * by construction. Figure = the chart of the first stated count, which is `initN`,
 * so the picture asserts against the chain's own starting value.
 */
const msThreeAddends = withFigure(
  multiStep({
    situationType: 'multi-stage',
    draw: (r) => {
      const tens = r.shuffle([1, 2, r.pick([3, 4] as const)]);
      const o1 = r.int(3, 9);
      const o2 = r.int(Math.max(2, 11 - o1), 9);
      const o3 = r.int(1, Math.min(6, 27 - o1 - o2));
      const d1 = 10 * tens[0] + o1;
      const d2 = 10 * tens[1] + o2;
      const d3 = 10 * tens[2] + o3;
      const name = one(r);
      return {
        prompt: `[image: ${chartAlt(d1)}] ${name} made ${countNoun(d1, 'pom-poms')} on Monday and ${countNoun(d2, 'pom-poms')} on Tuesday. On Wednesday ${name} made ${countNoun(d3, 'pom-poms')}. How many pom-poms is that over the three days?`,
        initN: d1,
        steps: [
          { op: 'add', n: d2, d: 1 },
          { op: 'add', n: d3, d: 1 },
        ],
        units: 'pom-poms',
        hints: [
          'Is this story asking for one join, or for more than one?',
          'Total the first two days and hold that number. Then bring in the last day.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const d1 = numOf(p, 'initN');
    return placeValueChart(d1, { showValues: true, alt: chartAlt(d1), asserts: assertsParam('initN', 'value') });
  },
);

/**
 * THREE ADDENDS with the trade arriving LATE. The first two counts settle with
 * room in the ones column, and only the third one spills it — so a child who
 * checked for a trade once, at the start, has already stopped looking. Where the
 * trade lands is the whole point of this pair of pages.
 *
 * No figure: the chain never consumes a single column here, and a chart of one
 * batch would assert nothing the item asks about.
 */
const msTradeArrivesLate = multiStep({
  situationType: 'combine',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    // The first two ones digits stay under ten together; the third pushes them
    // past it. Every bound is closed, so no draw is ever retried (kit §E2.4).
    const o1 = r.int(1, 4);
    const o2 = r.int(1, 5 - o1);
    const o3 = r.int(10 - o1 - o2, 9);
    const tens = r.shuffle([1, 2, r.pick([3, 4] as const)]);
    const b1 = 10 * tens[0] + o1;
    const b2 = 10 * tens[1] + o2;
    const b3 = 10 * tens[2] + o3;
    return {
      prompt: `A class cut out paper snowflakes for the window. The first batch had ${countNoun(b1, 'snowflakes')} and the second had ${countNoun(b2, 'snowflakes')}. A third batch of ${countNoun(b3, 'snowflakes')} followed. How many snowflakes are on the window?`,
      initN: b1,
      steps: [
        { op: 'add', n: b2, d: 1 },
        { op: 'add', n: b3, d: 1 },
      ],
      units: 'snowflakes',
      hints: [
        'Which of these joins is the one that pushes the ones column past ten?',
        'Build the total one batch at a time. Check the ones column after every batch.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header for why the shown slip is a TENS COUNT that stops one short
// rather than a total simply written a ten light: only the former is derivable
// from a registered verify, and its transform — a count that misses one — is
// exactly what happens to the ten that has just arrived from the ones column.
//
// The working is shown in the two steps the week teaches (the ones, then the
// tens), so the item reads as a piece of real working rather than as a riddle
// about a digit.
// ---------------------------------------------------------------------------

const eaCarryDropped = errorAnalysis({
  verifyTemplateId: 'a_verify_count_slip_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const { a, b, onesSum, totalTens } = columns(r, 'trade');
    return { n: totalTens, slip: 'skip-count', first: a, second: b, onesSum };
  },
  build: (v, p, r) => {
    const first = Number(p.first);
    const second = Number(p.second);
    const onesSum = Number(p.onesSum);
    const onesLeft = onesSum - 10;
    const studentTotal = Number(v.wrong) * 10 + onesLeft;
    const name = one(r);
    return {
      prompt: `${name} added ${first} and ${second} in two steps. The ones came to ${onesSum}, so ten of them became one ten. Then ${name} counted the tens and reached ${v.wrong} tens. The total ${name} gave was ${studentTotal}.`,
      extension: `Count the tens yourself. Write how many tens the answer really has, and write the true total. Then write one sentence to ${name} about the ten that travelled.`,
      hints: [
        'Where should the ten that was traded end up?',
        'Count every ten in this answer yourself, including the one that travelled from the ones.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: [
        String(first + second),
        'the traded ten belongs in the tens column',
        'count the ten that travelled',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB13 = makeWeekBuilder({
  level: 'B',
  week: 13,
  conceptId: 'add-within-100-regrouping',
  conceptName: 'Addition within 100 (regrouping)',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [B2, B5, B10, B11],
  pedagogyContract: 'v2',
  conceptualAnchor: 'trade ten ones for a ten',
  conceptFamily: 'operation',
  deepeningDelta:
    'B5 built a ten out of two small numbers and read the answer as ten and some more. B11 sent a single ones digit across a ten. B13 keeps the same move and gives it a second column to land in: the built ten is no longer the answer, it is a passenger that has to be counted with the tens already there. The numbers stay inside 100, where a Level-B child reads every one of them. What is new is WHERE the trade happens — in the ones with some left over, in the ones with none left over, or only once a third amount arrives.',
  explanation: {
    hook:
      'A ones column cannot hold ten. Ten ones are simply too big for it. So they swap themselves for one single ten and move next door.',
    whyBeforeHow:
      'Every column counts a different size. The ones column counts single ones. The tens column counts whole tens. A column holds nine at most, because ten builds one of the next size up. That is why we trade ten ones for a ten. Nothing is lost in the swap. The same ones are still there. They wear a new name and stand one place to the left. So the total never changes when you trade. Only the way it is written changes. Some sums need the trade and some do not, and the ones column decides. Look at the two ones digits before you write. If they reach ten, a ten is on its way.',
    script: [
      {
        say: 'Watch me set out 47 and 26. Tens under tens, ones under ones. I always begin at the ones column, because that is where a trade can start.',
        visual: 'A tens-and-ones chart holding 47, with the ones column picked out.',
        figure: placeValueChart(47, {
          showValues: true,
          highlight: 'ones',
          alt: 'a tens-and-ones chart holding 47, with 4 in the tens column and 7 in the ones column',
        }),
      },
      {
        say: 'Ones first. 7 ones and 6 ones make thirteen ones. Thirteen will not fit in a column that stops at nine. So ten of those ones become one single ten, and three ones stay behind.',
        visual: 'Thirteen ones drawn as one full frame of ten with three more beside it.',
        figure: tenFrame(13, {
          frames: 2,
          alt: 'a full frame of ten ones beside a second frame holding the 3 ones that stayed behind',
        }),
      },
      {
        say: 'Now the tens, and this is the step that gets missed. I count 4 tens, 2 tens, and the ten that just arrived. That makes 7 tens. With the 3 ones, my answer is 73.',
        visual: 'A tens-and-ones chart holding the finished total 73.',
        figure: placeValueChart(73, {
          showValues: true,
          alt: 'a tens-and-ones chart holding 73, with 7 in the tens column and 3 in the ones column',
        }),
      },
      {
        say: 'One habit before I write anything down. I check the size first. 4 tens and 2 tens make 6 tens. The ones came to thirteen, so one more ten is coming. My answer has to reach 70.',
        visual: 'Six tens laid out, with a seventh ten waiting to join them.',
      },
    ],
    summary:
      'Line the tens under the tens and the ones under the ones. Start at the ones. If the ones reach ten, trade ten ones for a ten. Send that ten next door. Then count the tens, including the one that arrived. Check the tens first, so you know roughly how big the answer must be.',
    vocabulary: [
      { term: 'column', kidGloss: 'the place a digit stands in — the tens or the ones' },
      { term: 'trade (regroup)', kidGloss: 'swap ten ones for one ten, because ten ones cannot fit in one column' },
      { term: 'the carry', kidGloss: 'the ten that travels from the ones column to the tens column' },
      { term: 'size check', kidGloss: 'counting the tens first, so you know roughly where the answer must land' },
    ],
  },
  guidedExamples: [
    {
      ...ge(13, 1, 'modeled', 'Work out 47 + 26. Trade ten ones for a ten.', [
        {
          teacherSay:
            'Watch me. I begin at the ones, every time. 7 ones and 6 ones make thirteen ones. Thirteen is too many for one column. So I take ten of them and swap them for a single ten.',
        },
        {
          teacherSay: 'Now my tens: 4 tens, 2 tens, and the ten I just traded. How many tens is that?',
          expected: '7',
        },
      ], '73'),
      visual: 'The finished sum in a tens-and-ones chart, with the traded ten counted in.',
      figure: placeValueChart(73, {
        showValues: true,
        alt: 'a tens-and-ones chart holding the finished total 73, with 7 in the tens column and 3 in the ones column',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(13, 2, 'completion', 'Work out 45 + 38. Watch the ones column.', [
        { teacherSay: 'The ones come to thirteen, so ten of them become one ten. What stays in the ones column?', expected: '3' },
        { childDo: 'Count the tens, and do not leave out the ten that just arrived.', expected: '83' },
      ], '83'),
      // COMPLETION fade: the child produces 83, so the picture holds the number
      // they were GIVEN — the first count — and stops there.
      visual: 'A tens-and-ones chart holding 45.',
      figure: placeValueChart(45, {
        showValues: true,
        alt: 'a tens-and-ones chart holding 45, with 4 in the tens column and 5 in the ones column',
      }),
    },
    ge(13, 3, 'prompted', 'Work out 34 + 26. Here the ones make ten exactly.', [
      { childDo: 'Send the whole ten across, then say what the ones column is left holding.', expected: '60' },
    ], '60'),
    {
      ...ge(13, 4, 'independent', 'Ana made 23 pom-poms, then 19 more, then 14 more. How many pom-poms did Ana make? Solve cold.', [
        { childDo: 'Join two of the counts first, then bring in the last one.', expected: '56' },
      ], '56'),
    },
  ],
  days: [
    // Day 1 — concept echo: the three structures in order, so the first page a
    // child meets is a ladder of WHERE, not a stack of sums. Single-step only.
    [
      { gen: wPartnerOfTen, diff: 2 },
      { gen: wTensCount, diff: 2 },
      { gen: sitNoTrade, diff: 2 },
      { gen: sitTradeOnes, diff: 3 },
      { gen: sitExactlyTen, diff: 3 },
    ],
    // Day 2 — fluency + application: the prediction, the regroup-or-not trap, and
    // the trade made literal in ten-frames.
    [
      { gen: wAddTens, diff: 2 },
      { gen: predictTrade, diff: 3 },
      { gen: discrimNeedsTrade, diff: 3 },
      { gen: sitTradeOnes, diff: 3 },
      { gen: sitLeftoverOnes, diff: 4 },
    ],
    // Day 3 — interleave: the trap and the size check against the week's first
    // three-addend chain, so the shape of the page never signals the task.
    [
      { gen: wBridgeOnes, diff: 2 },
      { gen: discrimNeedsTrade, diff: 4 },
      { gen: discrimWhichTotal, diff: 3 },
      { gen: msThreeAddends, diff: 4 },
      { gen: predictTrade, diff: 4 },
    ],
    // Day 4 — word problems: both chains beside the two single-step structures
    // they are built out of, so "it must need a trade" never becomes the cue.
    [
      { gen: wPartnerOfTen, diff: 2 },
      { gen: msThreeAddends, diff: 4 },
      { gen: msTradeArrivesLate, diff: 4 },
      { gen: sitExactlyTen, diff: 3 },
      { gen: sitNoTrade, diff: 3 },
    ],
    // Day 5 — the signature: the missed ten taken apart, one sum added two ways,
    // and the claim that settles when a trade is needed at all.
    [
      { gen: wAddTens, diff: 2 },
      { gen: eaCarryDropped, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Here is one sum: 38 + 25. Work it out two ways. Way one: add the tens, add the ones, then join those two answers. Way two: move two ones from the 25 across, so the 38 becomes 40. Then add what is left of the 25. Write both totals. Then write one sentence about why both ways can be trusted.',
          value: 'both ways reach 63 — the ones are only moved about, so the total cannot change',
          acceptableForms: ['63', 'sixty-three', 'the same', 'both the same'],
          keywords: true,
          hints: [
            'Which of the two ways builds the tens first?',
            'Work each way on its own paper, then hold the two totals side by side.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? Adding two 2-digit numbers means trading ten ones for a ten. Write one sentence that shows how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Treats every two-digit sum as a trading sum, though a ones column that settles below ten hands nothing on.',
            },
            {
              text: 'never',
              errorTag: 'task-comprehension',
              rationale: 'Rules the trade out altogether, which leaves the sums whose ones do reach ten with nowhere to put the built ten.',
            },
          ],
          hints: [
            'Can you think of two 2-digit numbers whose ones stay under ten?',
            'Build one sum that trades and one that does not. Then choose the word that covers both.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: when a two-digit sum comes out wrong, look at how far off it is before you look at the digits. Out by exactly ten, and the arithmetic is almost certainly fine — the traded ten simply never got counted with the other tens. Ask "which ten arrived from the ones?" rather than re-adding the whole sum. A handful of pennies and a ten-pence piece on the table settles it faster than a page of practice.',
  ],
  puzzle: (r) => {
    // A leaf covers the TENS digit of a finished sum, and the ones digit is left
    // showing. So the sum cannot be re-run in the usual direction: the child has
    // to work the ones column, notice what it handed across, and then count the
    // tens including that passenger. The ones digit on the page is a given (it is
    // what the ones column really leaves), and it settles nothing about the tens.
    const { a, b, onesSum, totalTens, o1, o2 } = columns(r, 'trade');
    const onesLeft = onesSum - 10;
    return {
      id: 'B13-PZ-01',
      title: 'Puzzle Grove: The Leaf on the Tens',
      puzzleType: 'logic',
      prompt: `[image: ${o1} ones drawn beside ${o2} ones, ready to be joined] A leaf has landed on a finished sum: ${a} + ${b} = ▢${onesLeft}. Which digit is hiding under the leaf? Then say how you know the two tens digits alone could not tell you.`,
      figure: counterGroups(
        [
          { count: o1, noun: 'counters', label: 'the first ones' },
          { count: o2, noun: 'counters', label: 'the second ones' },
        ],
        {
          relation: 'join',
          alt: `${o1} ones drawn beside ${o2} ones, ready to be joined`,
        },
      ),
      answer: {
        value: String(totalTens),
        acceptableForms: [countNoun(totalTens, 'tens')],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which column has to be finished before the tens column can be counted?',
        'Join the two ones amounts and see what they hand across. Then count every ten.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  // Reading a finished sum BACKWARDS from the column that was left showing: the
  // ones have to be rebuilt before the tens can be counted, and the child then
  // has to argue why the two tens digits are not enough on their own. No core
  // page asks for either move.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'hidden-tens-deduction' },
  sprint: {
    skill: 'Two-digit plus one-digit — the same trade in one column',
    sourceWeek: B11,
    itemCount: 16,
    scheduledDay: 2,
    templateId: 'add_within_100_facts_v1',
    params: { min: 23, max: 89, addendMax: 9 },
  },
  mastery: [
    { gen: sitNoTrade, diff: 3 },
    { gen: msThreeAddends, diff: 4 },
    { gen: sitTradeOnes, diff: 3 },
    { gen: msTradeArrivesLate, diff: 4 },
    { gen: sitLeftoverOnes, diff: 3 },
    { gen: discrimNeedsTrade, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: three single-step sums chosen for their regroup STRUCTURE — a sum where no column fills, a sum whose ones spill and leave some behind, and the grouping page where ten single counters really fill one frame (the tens-and-ones chart and the ones frame preserved on the first two). 02/04: the two three-addend chains, one with the trade in the first join and one where it only arrives with the third amount. 06: the regroup-or-not choice, with both sums starting from the same number and the ones frame preserved. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'traded-ten-never-counted',
      description: 'Builds the ten correctly and then counts only the two tens digits, so the ten that arrived from the ones column is never counted in and the total finishes one whole ten light.',
      exampleWrongAnswer: '47 + 26 given as 63',
      distractorRationale: 'Offer the total a sum reaches when the ten built in the ones column never lands in the tens.',
      reteachPointer: 'explanation/script[2] (count the tens, and count the ten that just arrived)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'whole-ones-total-written-in',
      description: 'Writes the whole ones amount inside the ones column, so a two-digit column result is squeezed into one place and nothing is handed on.',
      exampleWrongAnswer: '47 + 26 given as 613',
      distractorRationale: 'Offer the total a sum reaches when the ones column keeps every one of its thirteen ones.',
      reteachPointer: 'guidedExamples/B13-GE-01 (thirteen ones are too many for one column, so ten of them leave)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'trades-every-sum',
      description: 'Trades on every sum, including ones whose ones column settles below ten with room to spare, and reports a ten that was never built.',
      exampleWrongAnswer: '43 + 25 worked as though a ten had to travel',
      distractorRationale: 'Offer "both sums" where only the sum whose ones reach ten needs a trade.',
      reteachPointer: 'explanation/whyBeforeHow (the ones column decides whether a trade is needed)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'tens-count-adrift',
      description: 'Chooses the right move, then loses the thread while counting the tens, so the answer lands one ten above or below the true total.',
      exampleWrongAnswer: 'a total of 73 given as 83',
      distractorRationale: 'Offer the total one ten away from the truth.',
      reteachPointer: 'guidedExamples/B13-GE-02 (count the tens slowly, including the one that arrived), then the 2-minute ones-column sprint',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'partner-of-ten-unsure',
      description: 'Knows that ten ones trade for a ten, but has to count the bare boxes one at a time to see whether the ones reach ten, so the decision arrives too slowly to hold the rest of the method together.',
      exampleWrongAnswer: 'the ones of 47 read as having 4 boxes free',
      distractorRationale: 'Offer a partner of ten one out from the true one, which is what counting the bare boxes hastily produces.',
      reteachPointer: 'explanation/script[0] (find the ones column first), then the 2-minute ones-column sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Adding two-digit numbers when the ones column fills up — trading ten ones for a ten, sending that ten to the tens column and counting it there, spotting BEFORE adding whether a trade is coming, joining three amounts in turn, and adding one sum two different ways to see that both land in the same place.',
    improvingCandidates: [
      'saying whether a sum needs a trade before starting to add',
      'counting the traded ten in with the tens already there',
      'adding one sum two ways and getting the same total',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'counting the traded ten into the tens column — a total that is out by exactly ten is nearly always this',
      },
      {
        errorTag: 'representation-misread',
        text: 'handing on a full ones column instead of squeezing its whole total into one place',
      },
      {
        errorTag: 'task-comprehension',
        text: 'noticing when the ones settle below ten, so no trade is needed at all',
      },
      {
        errorTag: 'fact-recall',
        text: 'the partners of ten, which decide at a glance whether the ones column will fill',
      },
    ],
    homeFocus: {
      praiseLine:
        'You traded ten ones for a ten and then counted that new ten in with the others — that is exactly the habit this week is built on.',
      questionForChild: 'In 47 + 26, which column fills up first, and where does the ten it builds go?',
      schoolSyncHook: 'If your child\'s class writes the little traded ten above the tens column rather than below the line, tell us and we will lay ours out the same way.',
    },
    vocabularyForParent: [
      'column (the tens or the ones — the place that decides what a digit is worth)',
      'trade or regroup (ten ones swap for one ten, which then moves left)',
      'the carry (the ten that travels from the ones column into the tens)',
    ],
  },
});
