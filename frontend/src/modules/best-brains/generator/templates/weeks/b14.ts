/**
 * Level B · Week 14 — "Subtraction within 100 (regrouping)"
 * (conceptId: sub-within-100-regrouping).
 *
 * FILL-ARCHITECTURE §4 row B14: anchor "break a ten"; multi-step "sub then check
 * by adding back (metacog)"; error-analysis "smaller-from-larger (63 − 47 = 24)";
 * discrimination "needs-borrow vs not"; Day-5 signature — the row defers to the
 * pinned fixture, so this week MIRRORS MFM-B14's design as a seeded week.
 *
 * WHAT MIRRORING THE FIXTURE MEANS HERE. `generator/fixtures/mfm-b14.ts` is a
 * pinned calibration fixture, hand-authored and served for (B, 14) in preference
 * to anything generated; it is not edited and not imported. This blueprint carries
 * the same DESIGN — the same anchor (a ten broken open when the ones column runs
 * short), the same defining misconception (smaller-from-larger), the same
 * decision-first habit (its "Do you need to trade? yes/no, then solve" pages), the
 * same add-back check, the same zero-ones stress case, and the same Day-5 shape:
 * two ways of doing one take-away that the child has to judge, beside a worked
 * error to hunt. Every operand, every scene and every sentence is this week's own,
 * because the fixture's are hand-written prose and a generated week that echoed
 * them would ship the same page twice under two names.
 *
 * THE HAZARD THIS WEEK CARRIES. The concept is a written method, so the lazy week
 * is twenty column subtractions in twenty costumes. Depth here comes from WHERE
 * the ones column runs short, never from bigger numbers — every number on every
 * page is a two-digit number a Level-B child already reads. One drawn primitive,
 * `columns(r, shape)`, produces a take-away with a NAMED structure:
 *   `none`        — the ones on top are already enough, so no ten is opened;
 *   `break`       — the ones on top run short, so one ten is opened and the ones
 *                   column is handed ten more single ones (the week's anchor);
 *   `zero-ones`   — the ones column on top is EMPTY, so there is nothing there to
 *                   take from at all before a ten is opened;
 *   `ones-equal`  — the two ones digits match, so the ones column settles on
 *                   nothing and no ten is opened, which is the case children read
 *                   as "something must be wrong, my answer ends in zero".
 * Every situation commits to a shape, so the pages differ by their arithmetic
 * structure rather than by their nouns — and `predictBreak` draws its shape fresh
 * every time and asks the child to CALL, before computing, whether a ten will have
 * to be broken. That call is a real question only because the shape genuinely
 * varies: two of the four shapes break a ten and two do not.
 *
 * ⚠ VERIFY-LIBRARY LIMIT, and how the recipe's misconception was reached HONESTLY
 * (FANOUT kit §E2.3, taking its FIRST option — look for the identity). The named
 * error is smaller-from-larger: facing 63 − 47 a child works each column by
 * taking the smaller digit from the larger one, writes 4 in the ones and 2 in the
 * tens, and answers 24. No shipped verify returns that number from the story's own
 * operands, and fabricating it is forbidden (kit §F.1). There is, however, an
 * identity that makes it genuinely computable, one place below the one C4 found:
 *
 *   write the minuend as 10·t1 + o1 and the subtrahend as 10·t2 + o2, with
 *   t1 > t2 (so the take-away is positive) and o1 < o2 (so a ten must be broken).
 *   The column-by-column digit flip writes |o1 − o2| = o2 − o1 in the ones and
 *   |t1 − t2| = t1 − t2 in the tens, so the answer it produces is
 *       10·(t1 − t2) + (o2 − o1).
 *   The TRUE difference is 10·(t1 − t2) − (o2 − o1).
 *   So with A = 10·(t1 − t2) — the gap between the tens columns — and
 *   B = o2 − o1 — the amount by which the ones column falls short —
 *       A − B is exactly the true difference, and
 *       A + B is exactly what the flip writes.
 *
 * `{a: A, b: B, op: '-', wrongOp: '+'}` on `d_verify_binop_misconception_v1`
 * therefore hands the item a code-derived `correct` AND a code-derived `wrong`
 * that is precisely the recipe's misconception. Fed the recipe's own numbers it
 * reproduces the recipe's own example: 63 − 47 gives A = 20, B = 4, correct 16,
 * wrong 24. Both halves are re-derived by QG-11, nothing is invented, and the
 * item's prose names the two digits the student put in the two columns, so what is
 * on the page is the flip rather than an addition read backwards. The minuend and
 * subtrahend ride in the same params so the prose and the truth are drawn
 * together; the template reads only `a`, `b`, `op` and `wrongOp`.
 *
 * The same misconception is also offered where a child can meet it as a CHOICE
 * (`discrimWhichDifference`), beside the other real wrong answer of this week —
 * the difference a take-away lands on when the ten is opened for the ones but the
 * tens digit above it is never reduced, which is the true difference plus ten.
 * Both distractors are computed from that item's own digits.
 *
 * CONCEPT FAMILY: `'operation'`, the full row (≥2 multi-step week-wide). The
 * concept is a subtraction method and its own recipe hands it the two-step, so
 * declaring 'place-value' would have been a dodge.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Two families, both built from the
 * item's own drawn values, both asserting a GIVEN and never the answer:
 *   - a TENS-AND-ONES CHART holds the count the story starts from, with its ones
 *     column picked out. On the zero-ones pages that column is visibly empty,
 *     which is the thing the child has to notice before any arithmetic — and it is
 *     not the answer to anything;
 *   - a ONES FRAME holds the single ones the starting number is actually holding,
 *     with its other boxes bare, so "there are not enough of them to hand over"
 *     is something a child can see rather than be told.
 * No assessed item is drawn AFTER the break: a frame holding thirteen ones shows
 * what the opened ten produced, and on these pages that is a step of the answer.
 * The finished journey appears only in the lesson script and the modeled guided
 * example, where the answer is already printed.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): short sentences; `break a
 * ten`, `difference` and `check by adding back` glossed before any item leans on
 * them; metacognition in its intro form — the B row's own prediction, here "will a
 * ten have to be broken?", drawn over a pool that genuinely holds both answers,
 * plus the add-back check attached to a single-step take-away where it is a real
 * check and not a puzzle; error-analysis written-lite, one sentence; the sprint
 * ungraded and self-referenced on the take-away facts of B8 — the teen fact that
 * hides inside every broken ten.
 *
 * Retrieval is backward-only into B2 (a number held as bundles of ten AND more
 * than nine loose ones — exactly what a broken ten produces), B4 (hopping back
 * along the number line), B7 (the missing part, which is the add-back check in its
 * first form) and B13 (the same trade running the other way).
 *
 * CONTEXT SCAN (kit §E2.8), run against the weeks directory immediately before
 * reporting: bean bags, quoits, peanuts, milk cartons, paper planes, gold stars,
 * paper streamers, flower pots, paper windmills, shuttlecocks, bread rolls, chalk
 * sticks, yoghurt pots and the snail are each used by no other week. Four earlier
 * drafts were re-dressed rather than shipped — postcards, envelopes and leaflets
 * (all claimed by C4, the level above's subtraction week), conkers and acorns
 * (B15 and C4), lolly sticks (B15) and paper cups (B13).
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, numberLine, tenFrame } from '../lib/figures';
import type { BBFigure, FigureAssertion, PlaceName } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B2 = { level: 'B' as const, week: 2 };
const B4 = { level: 'B' as const, week: 4 };
const B7 = { level: 'B' as const, week: 7 };
const B8 = { level: 'B' as const, week: 8 };
const B13 = { level: 'B' as const, week: 13 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/** Two DIFFERENT team colours, so a comparison cannot compare a team with itself. */
const TEAM_COLOURS = ['blue', 'green', 'red', 'yellow'] as const;
const twoTeams = (r: Rng): [string, string] => r.shuffle([...TEAM_COLOURS]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// columns() — the week's drawn primitive
//
// A two-digit take-away whose STRUCTURE is chosen rather than left to luck. Every
// range below is closed by construction (lo ≤ hi for every draw), so a shape never
// needs a redraw loop: a loop consumes a variable number of rng draws and makes
// every later item in the pack depend on this one (kit §E2.4).
//
// Three invariants hold for every shape: both numbers are genuine two-digit
// numbers, the number on top is the bigger one (so a Level-B child never meets a
// negative), and the whole take-away stays inside 100.
// ---------------------------------------------------------------------------

type Shape = 'none' | 'break' | 'zero-ones' | 'ones-equal';

interface Take {
  /** The number on top, and the number underneath. */
  a: number;
  b: number;
  /** Their ones digits, and their tens digits. */
  o1: number;
  o2: number;
  t1: number;
  t2: number;
  diff: number;
  /** True when the ones on top cannot cover the ones underneath. */
  needsBreak: boolean;
  /** The ones digit the answer is left holding. */
  onesLeft: number;
}

function columns(r: Rng, shape: Shape): Take {
  let o1: number;
  let o2: number;
  switch (shape) {
    case 'none':
      // The ones on top are already enough, so nothing is opened anywhere.
      o2 = r.int(1, 4);
      o1 = r.int(o2 + 1, 9);
      break;
    case 'zero-ones':
      // The ones column on top is empty: there is nothing there to take from,
      // which is the case children answer by writing a nought and moving on.
      o1 = 0;
      o2 = r.int(1, 9);
      break;
    case 'ones-equal':
      // The two ones digits match, so the ones column settles on nothing and no
      // ten travels — an answer that ends in zero and is nonetheless right.
      o1 = r.int(1, 9);
      o2 = o1;
      break;
    default:
      // The ones on top run short, so one ten is opened and the ones column is
      // handed ten more single ones. This is the week's anchor case.
      o1 = r.int(1, 7);
      o2 = r.int(o1 + 1, 9);
      break;
  }
  // The tens on top are always the larger, so the number on top is the bigger
  // number in every shape and the answer is never below zero. The widest a ones
  // column can fall short is eight, and a single ten always covers that, so the
  // difference stays positive with a tens gap of one.
  const t2 = r.int(1, 3);
  const t1 = r.int(t2 + 1, 9);
  const a = 10 * t1 + o1;
  const b = 10 * t2 + o2;
  const diff = a - b;
  return { a, b, o1, o2, t1, t2, diff, needsBreak: o1 < o2, onesLeft: diff % 10 };
}

// ---------------------------------------------------------------------------
// withFigure / placeValueChart
//
// The shipped item primitives carry no figure slot and `lib/` is not ours to
// edit, so `withFigure` works the way `withCheckBack` does: everything happens
// inside the returned closure, no fresh rng draw is taken, and the prompt is left
// exactly as the draw wrote it — so the QG-1/QG-4 surface signature the guard has
// already registered is untouched. It rebuilds the picture from the drafted item's
// own `generator.params`, which are the very numbers its answer was computed from;
// that is what makes a contradicting picture unbuildable rather than merely
// unlikely, and QG-13 then proves it from the shipped data.
//
// `placeValueChart` is the one primitive `lib/figures.ts` exports no builder for.
// It emits the same schema and the same `asserts` clause QG-13 re-derives, and
// every caller here hands it a two-digit number, which is what its column
// wording describes.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

function placeValueChart(
  value: number,
  opts: { highlight?: PlaceName; alt: string; asserts?: FigureAssertion },
): BBFigure {
  return {
    type: 'place-value-chart',
    alt: opts.alt,
    params: {
      digits: String(value),
      showValues: true,
      ...(opts.highlight ? { highlight: opts.highlight } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/**
 * What a child SEES in the chart, column by column — never "the number is 80",
 * which would be a caption. An empty column is described as empty rather than as
 * holding a nought, because "who has anything to give?" is the question the
 * picture exists to make askable.
 */
function chartAlt(value: number): string {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  const right = ones === 0 ? 'nothing at all' : countNoun(ones, 'single ones');
  return `a tens-and-ones chart for ${value}: ${countNoun(tens, 'tens')} in the left column and ${right} in the right column`;
}

/** The ones column drawn as a frame of ten, with the boxes nobody has filled left bare. */
function frameAlt(ones: number): string {
  return `a ones frame holding ${countNoun(ones, 'single ones')}, with the rest of its boxes left bare`;
}

const onesFrame = (ones: number, asserts: FigureAssertion): BBFigure =>
  tenFrame(ones, { alt: frameAlt(ones), asserts });

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B2 — a number held as bundles of ten AND more than nine loose ones. That is
 * not a curiosity this week: it is the exact state a number is in the moment a
 * ten has been broken open, so a child who can name it has already met the idea.
 */
const wRebundle = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'pv-rebundle',
    draw: (r) => {
      const t = r.int(3, 7);
      const o = r.int(11, 15);
      return {
        prompt: `A tin holds ${countNoun(t, 'bundles')} of ten chalk sticks and ${countNoun(o, 'loose chalk sticks')}. How many chalk sticks are in the tin?`,
        answerValue: String(10 * t + o),
        templateId: 'rebundle_v1',
        params: { t, o },
        units: 'chalk sticks',
        hints: [
          'How many chalk sticks is one bundle worth?',
          'Count the bundles ten at a time, then carry on counting with the loose ones.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  B2,
);

/** B7 — the missing part, which is the add-back check meeting a child for the first time. */
const wMissingPart = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'missing-part',
    draw: (r) => {
      const total = r.int(12, 18);
      const already = r.int(4, total - 4);
      return {
        prompt: `A tray needs ${countNoun(total, 'yoghurt pots')} in all. ${countNoun(already, 'yoghurt pots')} are on the tray already. How many more pots does the tray still need?`,
        answerValue: String(total - already),
        templateId: 'retr_sub_within_100_v1',
        params: { a: total, b: already },
        units: 'pots',
        hints: [
          'What would you count on from the pots that are on the tray to reach the number the tray needs?',
          'Start at the number already on the tray and count on until you reach the number it needs.',
        ],
        errorTags: ['task-comprehension', 'fact-recall'],
      };
    },
  }),
  B7,
);

/** B4 — hopping back along the number line, the plainest form of taking away. */
const wHopBack = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-back',
    draw: (r) => {
      const start = r.int(12, 19);
      const hop = r.int(3, 6);
      return {
        prompt: `A snail sits on ${start} on the number line. It slides back ${countNoun(hop, 'spaces')}. Which number does the snail land on?`,
        answerValue: String(start - hop),
        templateId: 'a_takeaway_v1',
        params: { a: start, b: hop },
        hints: [
          'Which way along the line does a slide backwards go?',
          'Put a finger on the starting number and step back one space at a time, counting as you go.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  }),
  B4,
);

/**
 * B13 — the same trade, running the other way. Last week ten single ones bundled
 * themselves into a ten and moved left; this week one ten falls apart into ten
 * single ones and moves right. Holding the two side by side is the point.
 */
const wTradeTheOtherWay = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-regroup',
    draw: (r) => {
      const t1 = r.int(2, 4);
      const t2 = r.int(2, 3);
      const o1 = r.int(4, 9);
      const o2 = r.int(10 - o1, 9);
      const a = 10 * t1 + o1;
      const b = 10 * t2 + o2;
      return {
        prompt: `A bakery tray held ${countNoun(a, 'bread rolls')}. The baker put ${countNoun(b, 'more bread rolls')} on the tray. How many bread rolls are on the tray now?`,
        answerValue: String(a + b),
        templateId: 'add_within_100_v1',
        params: { a, b },
        units: 'bread rolls',
        hints: [
          'Do the ones in these two numbers reach ten between them?',
          'Total the ones, send the whole ten they build next door, and keep what stays behind.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B13,
);

// ---------------------------------------------------------------------------
// Single-step situations — one per STRUCTURE, so the pages differ by where the
// ones column runs short rather than by what is being counted
// ---------------------------------------------------------------------------

/** Things the PE store holds — the take-away with nothing to open. */
const PE_STORE = ['bean bags', 'quoits'] as const;

/**
 * NO BREAK. The baseline the other structures are heard against, and the page
 * that stops "this is the breaking week" from becoming the cue.
 *
 * No figure: there is nothing to notice about this ones column, and a picture on
 * every page would teach the child to wait for one.
 */
const sitNoBreak = situation({
  situationType: 'part-whole',
  cognitiveOp: 'sub-no-break',
  draw: (r) => {
    const { a, b } = columns(r, 'none');
    const noun = r.pick(PE_STORE);
    return {
      prompt: `The PE store held ${countNoun(a, noun)}. ${countNoun(b, noun)} were carried out to the field. How many ${unitFor(2, noun)} are still in the store?`,
      answerValue: String(a - b),
      templateId: 'sub_2digit_regroup_v1',
      params: { minuend: a, subtrahend: b },
      units: noun,
      hints: [
        // Neutral on purpose: a rung that only ever means "no" on this generator
        // teaches the child to read the hint rather than the numbers.
        'Which column is worked first, and has it got enough single ones in it?',
        'Work the single ones, then the tens, and leave each answer standing in its own column.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * ONE TEN BROKEN OPEN, with single ones left over — the week's anchor case.
 *
 * Figure = the ones frame of the count the story starts from. `onesOnTop` rides in
 * the params for the picture alone: `sub_2digit_regroup_v1` reads the minuend and
 * the subtrahend only, and QG-13 reads only `onesOnTop`, so the frame is pinned to
 * the ones the take-away has to pay from — and it shows how few of them there are,
 * never what the opened ten produces.
 */
const sitBreakATen = withFigure(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'sub-break-ten',
    draw: (r) => {
      const { a, b, o1 } = columns(r, 'break');
      return {
        prompt: `[image: ${frameAlt(o1)}] A bird feeder held ${countNoun(a, 'peanuts')} at breakfast time. By lunchtime the birds had taken ${countNoun(b, 'peanuts')}. How many peanuts were left in the feeder?`,
        answerValue: String(a - b),
        templateId: 'sub_2digit_regroup_v1',
        params: { minuend: a, subtrahend: b, onesOnTop: o1 },
        units: 'peanuts',
        hints: [
          'Are there enough single ones on top to hand over what the birds took?',
          'Open one ten up first. It falls apart into ten more single ones, and then the column can be worked.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => onesFrame(numOf(p, 'onesOnTop'), assertsParam('onesOnTop')),
);

/**
 * THE ONES COLUMN ON TOP IS EMPTY. There is nothing there to take from at all, so
 * the answer's ones digit has to be built out of an opened ten — and a child who
 * has been told "you can't, so write nothing" writes a nought and moves on.
 *
 * Figure = the chart of the count the kitchen started with, with the ones column
 * picked out. The count is stated in the prose, so the picture asserts a given;
 * what it adds is the SIGHT of an empty column, which is what the child has to
 * notice before any arithmetic and is not the answer to anything.
 */
const sitZeroOnes = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'sub-zero-ones',
    draw: (r) => {
      const { a, b } = columns(r, 'zero-ones');
      return {
        prompt: `[image: ${chartAlt(a)}] The school kitchen had ${countNoun(a, 'milk cartons')} this morning. ${countNoun(b, 'milk cartons')} went out to the classrooms. How many milk cartons are still in the kitchen?`,
        answerValue: String(a - b),
        templateId: 'sub_2digit_regroup_v1',
        params: { minuend: a, subtrahend: b },
        units: 'milk cartons',
        hints: [
          'How many single ones has the number on top got in its ones column?',
          'An empty column has nothing to give away, so open a ten up and count the ten single ones it makes.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'minuend');
    return placeValueChart(a, { highlight: 'ones', alt: chartAlt(a), asserts: assertsParam('minuend', 'value') });
  },
);

/**
 * THE TWO ONES DIGITS MATCH. The ones column settles on nothing, no ten is opened,
 * and the answer ends in a zero that MEANS something — the structure a child
 * distrusts, because an answer ending in nought looks like an unfinished one.
 *
 * Posed as a comparison so the week is not five take-away stories in a row, and
 * between two teams rather than two children, since the corpus already compares
 * named children in several places.
 */
const sitOnesEqual = situation({
  situationType: 'comparison',
  cognitiveOp: 'sub-ones-settle',
  draw: (r) => {
    const { a, b } = columns(r, 'ones-equal');
    const [first, second] = twoTeams(r);
    return {
      prompt: `The ${first} team folded ${countNoun(a, 'paper planes')} for the fair. The ${second} team folded ${countNoun(b, 'paper planes')}. How many more paper planes did the ${first} team fold?`,
      answerValue: String(a - b),
      templateId: 'sub_2digit_regroup_v1',
      params: { minuend: a, subtrahend: b },
      units: 'paper planes',
      hints: [
        'What is left in the ones column when both ones digits are the same?',
        'Work the ones column first and write down what it leaves, then work the tens.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * THE ADD-BACK CHECK, attached to a take-away that really does need a ten opened —
 * the recipe's "subtract, then check by adding back", in the form where the check
 * is worth doing: the child's own answer plus the amount that left has to rebuild
 * the length the streamer started with, or something went wrong.
 *
 * Served ONLY through the wrapper (kit §E2.2): a generator reachable both raw and
 * wrapped ships two identical hint ladders, spending two of the three the dedup
 * allows on one idea.
 */
const streamerCut = situation({
  situationType: 'measurement',
  cognitiveOp: 'sub-break-check',
  draw: (r) => {
    const { a, b } = columns(r, 'break');
    return {
      prompt: `A paper streamer is ${countNoun(a, 'cm')} long. ${countNoun(b, 'cm')} is cut off it for the party chain. How many centimetres of streamer are left?`,
      answerValue: String(a - b),
      templateId: 'sub_2digit_regroup_v1',
      params: { minuend: a, subtrahend: b },
      units: 'cm',
      hints: [
        'Does the ones column on top have enough single ones in it to pay, or will it need help?',
        'Deal with the single ones first, opening a ten if that column runs short, and then work the tens.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

const checkBackCut = withCheckBack(
  streamerCut,
  'add your answer onto the length that was cut off, and see whether you land back on the length the streamer began with',
);

/**
 * METACOGNITION, in the Level-B intro form the fill spec names — a prediction made
 * before any working happens, which for a subtraction week is "will a ten have to
 * be broken?".
 *
 * The shape is drawn fresh from all four structures, so the call cannot be
 * answered by reflex or by the page's habits: two of the four shapes break a ten
 * and two do not, and the child has to hold the two ones digits against each other
 * before picking up a pencil. That single habit is what stops a break from being
 * missed and what stops one being invented.
 *
 * Figure = the chart of the count the chart holds, with its ones column picked
 * out, so the evidence for the prediction is on the page and the prediction is not.
 */
const goldStarChart = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'predict-break',
    draw: (r) => {
      const shape = r.pick(['none', 'break', 'zero-ones', 'ones-equal'] as const);
      const { a, b } = columns(r, shape);
      return {
        prompt: `[image: ${chartAlt(a)}] A class chart has room for ${countNoun(a, 'gold stars')}. ${countNoun(b, 'gold stars')} are stuck on it already. How many spaces on the chart are still empty?`,
        answerValue: String(a - b),
        templateId: 'sub_2digit_regroup_v1',
        params: { minuend: a, subtrahend: b },
        units: 'gold stars',
        hints: [
          'Do the single ones on top run short here, or are there already enough of them?',
          'Hold one ones digit against the other, make your call, then work it out and see whether you were right.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'minuend');
    return placeValueChart(a, { highlight: 'ones', alt: chartAlt(a), asserts: assertsParam('minuend', 'value') });
  },
);

const predictBreak = withEstimateFirst(
  goldStarChart,
  'will a whole ten have to be broken open before the ones column can be worked?',
);

// ---------------------------------------------------------------------------
// Multi-step — the recipe's "subtract, then check by adding back", and the
// fixture's own two-step money story
// ---------------------------------------------------------------------------

/**
 * OUT, THEN BACK — the add-back move living inside the story rather than beside
 * it. Something leaves, some of it returns, and the child has to hold the middle
 * number to get to the end. Having done that twice, "add your answer back on" is a
 * move they have already made rather than a rule they are handed.
 *
 * The amount that comes back is capped below the amount that went out, so nothing
 * ever returns that never left, and the shed can never finish with more pots than
 * it started with.
 *
 * No figure: the story consumes no single column, and a chart of one count would
 * assert nothing this item asks about.
 */
const msOutThenBack = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'sub-then-add-back',
  draw: (r) => {
    const { a, b } = columns(r, 'break');
    const back = r.int(5, b - 5);
    return {
      prompt: `The garden shed held ${countNoun(a, 'flower pots')}. ${countNoun(b, 'flower pots')} went out to the planting session, and ${countNoun(back, 'flower pots')} came back unused at the end. How many flower pots are in the shed now?`,
      initN: a,
      steps: [
        { op: 'sub', n: b, d: 1 },
        { op: 'add', n: back, d: 1 },
      ],
      units: 'flower pots',
      hints: [
        'How many separate changes happen in this story, and which one happens first?',
        'Work out what is left after the pots go out, write that number down, and then bring back what returned.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * GROW, THEN SHRINK — the two-step the fixture's own Day 4 carries: an amount is
 * added to, and only then is something bought out of the total. The take-away is
 * therefore performed on a number nobody stated, which is where a child discovers
 * that the middle number has to be written down.
 *
 * The amount given is whole tens, so the ones digit of the running total is the
 * ones digit the child started with — and the price always asks for more single
 * ones than that, so the second step genuinely breaks a ten.
 */
const msFindThenSpend = multiStep({
  situationType: 'money-change',
  cognitiveOp: 'add-then-sub',
  draw: (r) => {
    const ta = r.int(3, 5);
    const oa = r.int(1, 4);
    const start = 10 * ta + oa;
    const tb = r.int(2, 3);
    const given = 10 * tb;
    const price = 10 * r.int(1, ta + tb - 1) + r.int(oa + 1, 9);
    const name = one(r);
    return {
      prompt: `${name} had ${countNoun(start, 'cents')} in a purse. At the school fair ${name} was given ${countNoun(given, 'cents')} more. Then ${name} paid ${countNoun(price, 'cents')} for a paper windmill. How many cents does ${name} have now?`,
      initN: start,
      steps: [
        { op: 'add', n: given, d: 1 },
        { op: 'sub', n: price, d: 1 },
      ],
      acceptableForms: [countNoun(start + given - price, 'cents')],
      hints: [
        'Does the money grow first in this story, or shrink first?',
        'Put the two amounts together and hold that number, then take the price away from it.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — does this one need a ten broken open, and which answer can the
// break allow
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DISCRIMINATION, drawn so the two take-aways are built from the SAME
 * FOUR DIGITS with the two ones digits swapped. Nothing about the size of the
 * numbers, the size of the gap, or the look of the page can settle it: only which
 * of the two ones digits is the one on top. The third option is the child who has
 * learnt "this is the breaking week" and applies it to everything.
 *
 * Both take-aways are printed in the prompt, so the page reads as one question
 * rather than a question plus a surprise third door — and the numbers stay in the
 * prompt, which is where QG-1 reads the operand surface from.
 */
const discrimNeedsBreak = discrimination({
  variant: 'structural',
  cognitiveOp: 'break-or-not',
  draw: (r) => {
    const t2 = r.int(1, 3);
    const t1 = r.int(t2 + 1, 8);
    const low = r.int(0, 4);
    const high = r.int(low + 1, 9);
    const needs = `${10 * t1 + low} − ${10 * t2 + high}`;
    const already = `${10 * t1 + high} − ${10 * t2 + low}`;
    return {
      prompt: `These two take-aways are built from the same four digits: ${needs} and ${already}. Only one of them has to break a ten open. Which one is it — or is it both?`,
      correct: needs,
      distractors: [
        {
          text: already,
          errorTag: 'concept-misconception',
          rationale: 'Judges the take-away by the size of the two numbers rather than by which ones digit is the one standing on top.',
        },
        {
          text: 'both take-aways',
          errorTag: 'task-comprehension',
          rationale: 'Treats every two-digit take-away as one that breaks a ten, including the one whose ones column has plenty to give.',
        },
      ],
      hints: [
        'Which digit in each take-away is the one sitting on top of the ones column?',
        'Try each ones column on its own: hold the top digit against the one underneath and see which of them runs short.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * WHICH ANSWER THE BREAK ALLOWS — and the page where the recipe's misconception can
 * be met as a choice rather than as a hunt.
 *
 * Both wrong answers are computed in code from this item's own digits, and both are
 * real. One is what the column-by-column digit flip writes, which is the recipe's
 * 24 for 63 − 47. The other is what a take-away lands on when the ten IS opened for
 * the ones column but the tens digit above it is never reduced — a whole ten too
 * many. Counting the tens gap first separates all three, which is what the check
 * is for.
 */
const discrimWhichDifference = discrimination({
  variant: 'structural',
  cognitiveOp: 'size-check',
  draw: (r) => {
    const t2 = r.int(1, 3);
    const t1 = r.int(t2 + 2, Math.min(9, t2 + 6));
    const o1 = r.int(0, 3);
    let o2 = r.int(o1 + 1, Math.min(9, o1 + 6));
    // A shortfall of exactly five would make the two wrong answers the SAME
    // number, so the page would offer one distractor twice. Nudged in one
    // deterministic step, never a redraw (kit §E2.4); the structure survives,
    // because the shortfall is still at least one.
    if (o2 - o1 === 5) o2 -= 1;
    const a = 10 * t1 + o1;
    const b = 10 * t2 + o2;
    const diff = a - b;
    return {
      prompt: `Here are three answers for ${a} − ${b}, and only one of them can be right. Which one is it?`,
      correct: String(diff),
      distractors: [
        {
          text: String(10 * (t1 - t2) + (o2 - o1)),
          errorTag: 'concept-misconception',
          rationale: 'The answer that comes out when each column is worked by taking the smaller digit from the larger one, so no ten is ever opened.',
        },
        {
          text: String(diff + 10),
          errorTag: 'procedure-slip',
          rationale: 'The answer that comes out when a ten is opened for the ones column and the tens digit above it is left as it was, so the tens end up one too many.',
        },
      ],
      hints: [
        'Roughly how many tens should this answer have, before any working is done?',
        'Find the gap between the two tens digits first, then ask what a short ones column does to it.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives BOTH numbers)
//
// See the ⚠ note in the file header for the identity that makes the recipe's
// smaller-from-larger answer a code-computed value: over the tens gap A and the
// ones shortfall B, A − B is the true difference and A + B is exactly what the
// digit flip writes. The prose names the two digits the student put in the two
// columns, so what is on the page is a piece of real column working rather than an
// addition read backwards.
// ---------------------------------------------------------------------------

const eaSmallerFromLarger = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const t2 = r.int(1, 4);
    const t1 = r.int(t2 + 2, 9);
    const o1 = r.int(0, 5);
    const o2 = r.int(o1 + 2, Math.min(9, o1 + 6));
    return {
      a: 10 * (t1 - t2),
      b: o2 - o1,
      op: '-',
      wrongOp: '+',
      minuend: 10 * t1 + o1,
      subtrahend: 10 * t2 + o2,
      onesWritten: o2 - o1,
      tensWritten: t1 - t2,
    };
  },
  build: (v, p, r) => {
    const minuend = Number(p.minuend);
    const subtrahend = Number(p.subtrahend);
    const onesWritten = Number(p.onesWritten);
    const tensWritten = Number(p.tensWritten);
    const name = one(r);
    return {
      prompt: `${name} worked out ${minuend} − ${subtrahend} straight down the columns. In the ones column ${name} put ${onesWritten}. In the tens column ${name} put ${tensWritten}. So the answer ${name} wrote down was ${v.wrong}.`,
      extension: `Work out what ${minuend} − ${subtrahend} really leaves. Then write one sentence to ${name} about the ones column, and say what has to happen there before it can be worked.`,
      hints: [
        'In this take-away, which of the two ones digits is the one sitting on top?',
        'Check whether the top ones digit is big enough on its own, and if it is not, see where the single ones it needs can come from.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: [
        'a ten has to be broken open first',
        'the ones digit on top was the smaller one',
        'the ones column cannot pay on its own',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB14 = makeWeekBuilder({
  level: 'B',
  week: 14,
  conceptId: 'sub-within-100-regrouping',
  conceptName: 'Subtraction within 100 (regrouping)',
  strandTags: ['addition-subtraction', 'number-sense-counting'],
  prerequisiteWeeks: [B2, B7, B8, B13],
  pedagogyContract: 'v2',
  conceptualAnchor: 'break a ten',
  conceptFamily: 'operation',
  deepeningDelta:
    'B4 took small numbers away by stepping back along the line, one space at a time. B13 sent a built ten from the ones column into the tens. B14 runs that same trade backwards and gives it a reason: the ones column is asked for more single ones than it is holding, so a ten comes back the other way and falls apart into ten of them. The numbers stay inside 100, where a Level-B child reads every one of them. What is new is WHERE the column runs short — with some single ones on top, with none at all on top, or nowhere, because the ones on top were enough all along.',
  explanation: {
    hook:
      'Two single ones on the top row, and the take-away asks for seven of them. Nothing you do to that column will find five more. So you go next door and fetch a ten.',
    whyBeforeHow:
      'Each column holds one size. The right-hand column holds single ones. The left-hand column holds whole tens. A take-away is worked one column at a time, and it starts at the ones. Sometimes the ones on top run short, because the number underneath asks for more single ones than the top number is holding. That is when we break a ten. One ten is only ten single ones bundled together, so it can be opened again. The tens column hands one ten across. The ones column gains ten more single ones. Nothing has been lost on the way: 73 is still 73 while it is held as 6 tens and 13 ones, and only its pieces have changed. Now both columns can be worked. And because nothing was lost, putting back what you took away has to land you on the number you began with, which is why that makes such a good check.',
    script: [
      {
        say: 'Watch me before I write anything. I set 73 above 46, tens under tens. I always go to the ones column first. Three single ones on top, six underneath. Three is not enough.',
        visual: 'A tens-and-ones chart holding 73, with the ones column picked out.',
        figure: placeValueChart(73, { highlight: 'ones', alt: chartAlt(73) }),
      },
      {
        say: 'So I break one ten open. It falls apart into ten single ones and they join the three already there. Now the top row is holding 6 tens and 13 ones. That is still 73. Count it.',
        visual: 'A full frame of ten single ones beside a second frame holding the three that were already there.',
        figure: tenFrame(13, {
          frames: 2,
          alt: 'a full frame of ten single ones beside a second frame holding the 3 single ones that were already in the column',
        }),
      },
      {
        say: 'Now both columns can be worked. Thirteen single ones take away six leaves seven. Six tens take away four tens leaves two tens. So 73 take away 46 leaves 27.',
        visual: 'A tens-and-ones chart holding the finished answer 27.',
        figure: placeValueChart(27, { alt: chartAlt(27) }),
      },
      {
        say: 'One habit before I stop. 73 take away 46 is near 70 take away 50, so my answer should be about 20. Then I check it properly by putting the 46 back: 27 + 46 = 73, the number I began with.',
        visual: 'A number line with one hop from 27 back up to 73.',
        figure: numberLine(
          {
            min: 0,
            max: 100,
            step: 10,
            labels: 'majors',
            marks: [
              { at: 27, label: '27', style: 'flag' },
              { at: 73, label: '73', style: 'flag' },
            ],
            hops: [{ from: 27, to: 73, label: 'put the 46 back' }],
          },
          { alt: 'a number line from 0 to 100 with one hop from 27 back up to 73' },
        ),
      },
    ],
    summary:
      'Line the tens under the tens and the ones under the ones. Start at the ones. If the ones on top run short, break a ten open: the tens column hands one across and the ones column gains ten single ones. Then work both columns. Check by adding your answer to the amount you took away — you should land where you started.',
    vocabulary: [
      { term: 'break a ten (regroup)', kidGloss: 'open one ten up into the ten single ones it is made of' },
      { term: 'runs short', kidGloss: 'a column that has not got enough single ones to hand over yet' },
      { term: 'difference', kidGloss: 'what a take-away leaves — how far apart the two numbers are' },
      { term: 'check by adding back', kidGloss: 'put back what you took away; you should land on the number you started with' },
    ],
  },
  guidedExamples: [
    {
      ...ge(14, 1, 'modeled', 'Work out 85 − 47. Break a ten if the ones run short.', [
        {
          teacherSay:
            'Watch me start at the ones, the way I always do. Five single ones on top, seven underneath. Five is not enough to hand over seven, so I am going to break a ten open.',
        },
        {
          teacherSay: 'Now the top row is holding 7 tens and 15 ones. How many single ones can I take the seven from?',
          expected: '15',
        },
      ], '38'),
      visual: 'The finished answer in a tens-and-ones chart.',
      figure: placeValueChart(38, {
        alt: 'a tens-and-ones chart holding the finished answer 38, with 3 tens in the left column and 8 single ones in the right column',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(14, 2, 'completion', 'Work out 60 − 24. Look at the ones column on top first.', [
        { teacherSay: 'This ones column on top is empty. Which column is there to hand it something?', expected: 'the tens' },
        { childDo: 'Open one ten up, then work the ones and the tens.', expected: '36' },
      ], '36'),
      // COMPLETION fade: the child produces 36, so the picture holds the number
      // they were HANDED — the count the day started with — and stops there.
      visual: 'A tens-and-ones chart holding 60, with the empty ones column picked out.',
      figure: placeValueChart(60, { highlight: 'ones', alt: chartAlt(60) }),
    },
    ge(14, 3, 'prompted', 'Work out 76 − 32. Careful — decide before you start.', [
      { childDo: 'Say whether any ten has to be opened here, then work the columns.', expected: '44' },
    ], '44'),
    {
      ...ge(14, 4, 'independent', 'Work out 91 − 57 cold. Then check it by adding back.', [
        { childDo: 'Work the columns, then add your answer to 57 and see where you land.', expected: '34' },
      ], '34'),
    },
  ],
  days: [
    // Day 1 — concept echo: three structures in order, so the first page a child
    // meets is a ladder of WHERE the column runs short. Single-step only.
    [
      { gen: wRebundle, diff: 2 },
      { gen: wMissingPart, diff: 2 },
      { gen: sitNoBreak, diff: 2 },
      { gen: sitBreakATen, diff: 3 },
      { gen: sitZeroOnes, diff: 3 },
    ],
    // Day 2 — fluency + application: the prediction, the break-or-not trap, the
    // answer that ends in a zero, and the add-back check.
    [
      { gen: wTradeTheOtherWay, diff: 3 },
      { gen: predictBreak, diff: 3 },
      { gen: discrimNeedsBreak, diff: 3 },
      { gen: sitOnesEqual, diff: 3 },
      { gen: checkBackCut, diff: 3 },
    ],
    // Day 3 — interleave: both traps against the week's first two-step story, with
    // the check-back page between them so the shape of the page never signals the
    // task.
    [
      { gen: wHopBack, diff: 2 },
      { gen: discrimNeedsBreak, diff: 4 },
      { gen: discrimWhichDifference, diff: 3 },
      { gen: checkBackCut, diff: 4 },
      { gen: msOutThenBack, diff: 4 },
    ],
    // Day 4 — word problems: both two-steps beside the prediction and a no-break
    // story, so "it must need a break" never becomes the cue.
    [
      { gen: wRebundle, diff: 2 },
      { gen: msOutThenBack, diff: 4 },
      { gen: msFindThenSpend, diff: 4 },
      { gen: predictBreak, diff: 4 },
      { gen: sitZeroOnes, diff: 3 },
    ],
    // Day 5 — the fixture's own signature: a worked error to hunt, one take-away
    // done two ways for the child to judge, and a claim about what an opened ten
    // does to the answer.
    [
      { gen: wTradeTheOtherWay, diff: 3 },
      { gen: eaSmallerFromLarger, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Here is one take-away: 83 − 57. Do it two ways. Way one: set it out in columns and open a ten when the ones run short. Way two: start at 57 and count up to 83 in easy hops, collecting your hops as you go. Write the answer each way gave you. Then write one sentence saying whether both ways can be trusted.',
          value: 'both ways leave 26, because the two numbers stay the same distance apart however you travel between them',
          acceptableForms: ['26', 'twenty-six', 'the same', 'both the same'],
          keywords: true,
          hints: [
            'Which of the two ways works down the columns, and which one travels along the line?',
            'Do each way on a fresh line, then read your two answers out loud one after the other.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes or never true? When a ten has to be broken open, the ones digit of the answer is bigger than the ones digit you started with. Try two take-aways of your own, then write one sentence showing how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Reads it as a coincidence of particular numbers, when an opened ten hands the ones column ten more single ones every time, so what that column is left holding cannot be smaller than the digit it began with.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads the ones column as though a take-away could only shrink it, missing the ten single ones that arrive in it when a ten is opened.',
            },
          ],
          hints: [
            'Can you build one take-away that needs a ten opened, and then look at what its answer ends with?',
            'Try two of your own, write the starting ones digit beside the answer ones digit, and then pick the word that covers both.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
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
    'For grown-ups: when a take-away comes out wrong this week, ask your child to add their answer to the amount that was taken away before you look at the digits. If that does not rebuild the number they started with, they have found the problem themselves, which is worth more than being told. Two slips account for nearly all of it: an answer that is out by exactly ten means the ten was opened and the tens digit above it was never reduced, and an answer that is too big usually means each column was worked smaller-digit-from-larger, whichever one was on top. A ten-pence piece and a handful of pennies settle both faster than a page of practice.',
  ],
  puzzle: (r) => {
    // A riddle that runs BACKWARDS, mirroring the fixture's own puzzle: the child
    // is given the amount taken away and the number it landed on, and has to
    // rebuild the number nobody stated. The ones digits are drawn so that putting
    // the amount back needs a trade, so the puzzle also exercises last week's
    // move — and the only way through is to undo, which no core page asks for.
    const takenOnes = r.int(3, 9);
    const landedOnes = r.int(10 - takenOnes, 9);
    const takenTens = r.int(2, 4);
    const landedTens = r.int(2, 8 - takenTens);
    const taken = 10 * takenTens + takenOnes;
    const landed = 10 * landedTens + landedOnes;
    return {
      id: 'B14-PZ-01',
      title: 'Puzzle Grove: The Number I Started With',
      puzzleType: 'logic',
      prompt: `Here is a riddle. Take ${taken} away from my number and you land on ${landed}. Which number am I? Then write how you found it, without trying number after number.`,
      answer: {
        value: String(taken + landed),
        acceptableForms: [],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which way round does this riddle run — does it start at my number, or end there?',
        'Put back the amount that was taken away, and watch the ones column while you do it.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  // Reading a take-away backwards: the number the whole story is about is the one
  // number that was never printed, so the child has to undo rather than work
  // forwards, and the undoing itself needs last week's trade. No core page poses
  // its question this way round.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'undo-a-take-away' },
  sprint: {
    skill: 'Take-away facts inside 20 — the fact that hides inside every broken ten',
    sourceWeek: B8,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 11, max: 18, subtrahendMax: 9 },
  },
  mastery: [
    { gen: sitZeroOnes, diff: 3 },
    { gen: msOutThenBack, diff: 4 },
    { gen: sitBreakATen, diff: 3 },
    { gen: msFindThenSpend, diff: 4 },
    { gen: sitOnesEqual, diff: 3 },
    { gen: discrimNeedsBreak, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: three single-step take-aways chosen for their STRUCTURE — an empty ones column on top, a ones column that runs short and is handed an opened ten, and a comparison whose two ones digits match so the answer ends in a zero (the tens-and-ones chart and the ones frame preserved on the first two). 02/04: the two-step stories — pots out and some back (the add-back check living inside the story) and an amount added to before a price is taken out of it. 06: the break-or-not choice, both take-aways built from the same four digits. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'smaller-from-larger',
      description: 'Works each column by taking the smaller digit from the larger one, whichever of them is on top, so no ten is ever opened and the answer comes out too big.',
      exampleWrongAnswer: '63 − 47 given as 24',
      distractorRationale: 'Offer the answer the column-by-column digit flip produces.',
      reteachPointer: 'guidedExamples/B14-GE-01 (five single ones cannot hand over seven, so a ten is opened first)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'tens-digit-not-reduced',
      description: 'Opens a ten for the ones column and then counts the tens as though none had left, so the answer finishes a whole ten too big.',
      exampleWrongAnswer: '73 − 46 given as 37',
      distractorRationale: 'Offer the answer one whole ten above the true one.',
      reteachPointer: 'explanation/script[1] (the tens column hands one across, so it is left with one fewer)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'empty-column-read-as-done',
      description: 'Reads an empty ones column on top as a column with nothing to do, and brings the digit underneath it straight down into the answer.',
      exampleWrongAnswer: '70 − 26 given as 56',
      distractorRationale: 'Offer the answer that keeps the bottom ones digit standing in an empty column.',
      reteachPointer: 'explanation/script[0] (the ones column is always worked first, empty or not)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'breaks-every-take-away',
      description: 'Opens a ten on every take-away, including the ones whose ones column has plenty to give, and reports a trade that never happened.',
      exampleWrongAnswer: '76 − 32 worked as though a ten had been opened',
      distractorRationale: 'Offer "both take-aways" where only the one whose ones column runs short breaks a ten.',
      reteachPointer: 'explanation/whyBeforeHow (the ones column decides whether a ten has to be opened at all)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'teen-take-away-fact',
      description: 'Opens the ten correctly and then gets the teen fact inside it wrong, so a sound method lands one away from the truth.',
      exampleWrongAnswer: '73 − 46 given as 28',
      distractorRationale: 'Offer an answer one out from the true one, which is what an unsure teen fact produces.',
      reteachPointer: 'guidedExamples/B14-GE-02 (say the teen take-away out loud), then the 2-minute take-away sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Taking one two-digit number away from another when the ones column runs short — breaking one ten open into ten single ones, deciding BEFORE working whether a break is needed at all, handling the case where the ones column on top is empty, and checking every answer by adding it back to the amount that was taken away.',
    improvingCandidates: [
      'saying whether a take-away needs a ten opened before starting to work it',
      'reducing the tens digit once it has handed a ten across',
      'checking an answer by adding it back to the amount that left',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'leaving the two ones digits where they are instead of swapping them round — the top one has to pay, even when it is the smaller',
      },
      {
        errorTag: 'procedure-slip',
        text: 'remembering the tens digit is one smaller after it has handed a ten over — an answer out by exactly ten is nearly always this',
      },
      {
        errorTag: 'representation-misread',
        text: 'reading an empty ones column as a column that still has to be worked',
      },
      {
        errorTag: 'fact-recall',
        text: 'the teen take-away facts, which is the arithmetic hiding inside every broken ten',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked whether the ones column had enough before you wrote anything down, and when it did not you broke a ten open and said so out loud — that is exactly the habit this week is built on.',
      questionForChild: 'In 73 − 46, which column runs short first, and where do the single ones it needs come from?',
      schoolSyncHook: 'If your child\'s class calls this borrowing rather than breaking a ten, or crosses the digits out in a particular way, tell us and we will use their words.',
    },
    vocabularyForParent: [
      'break a ten / regroup (open one ten up into the ten single ones it is made of)',
      'difference (what a take-away leaves)',
      'checking by adding back (the answer plus the amount taken away must rebuild the start)',
    ],
  },
});
