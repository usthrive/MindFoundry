/**
 * Level C · Week 24 — "Ready for Level D (consolidation)" (conceptId:
 * ready-for-level-d). THE LEVEL-EXIT GATE.
 *
 * FILL-ARCHITECTURE §5 row C24: anchor "mixed multi-step"; multi-step "native";
 * error-analysis "(mixed)"; discrimination "**operation choice unsignalled**";
 * Day-5 signature "exit check + strategy reflection". Read with §3's
 * consolidation law — a week 24 is documented DEEPENING, never a mixed-review
 * pile — and with the Level-D exit week `d24.ts`, which is the pattern for this
 * job.
 *
 * THE ONE NEW DEMAND, stated so it can be checked: **nothing on the page says
 * which tool a job wants.** Every other week of the level named its operation by
 * naming itself — C6 was the equal-groups page, C9 the sharing page, C20 the
 * covering page — so a child could be fluent in all twenty-three and still have
 * never once CHOSEN. C24 removes the label, and builds the content to force the
 * choice rather than to decorate it:
 *
 *  - the cue words are made unreliable ON PURPOSE. `sitBadgeShare` says "each"
 *    and wants a division; `msSharedThenLost` says "shared equally" and its
 *    opening move is a multiplication; `eaCueWordSlip` is a student who let the
 *    word pick the operation. A child who has learned "each ⇒ ×" is wrong three
 *    times this week, and the Day-5 Always/Sometimes/Never asks them to say so.
 *  - **every two-step item crosses TWO of the level's chapters**, never one
 *    chapter twice: a fraction of a set feeding an equal-groups count
 *    (msTicketsThenPoints, C17 × C6), a covering feeding a subtraction
 *    (msBoardThenGap, C20 × C4), equal groups feeding a share
 *    (msLabelsThenCabins, C6 × C9), a share that ALREADY HAPPENED and has to be
 *    undone before anything else can start (msSharedThenLost, C9/C10 × C4).
 *    That is the integration the consolidation law asks for: a child who can do
 *    every C week separately still meets something new here.
 *  - one item states a quantity the question does not want (`msCupsPlusLoose`,
 *    `posing: 'has-distractor'`), and one discrimination prices that habit
 *    directly (`discrimUnusedNumber`). "Use every number" stops paying.
 *  - retrieval is raised to the top of the band (8 of 27 daily items, 29.6%) and
 *    sourced across the WHOLE level — C2, C3, C4, C10, C12, C16, C20 — so what
 *    is revisited is the year, not last week.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7, and it is the week's own rule).
 * A picture of a structure — a part-whole bar, a filled grid — announces the
 * shape of the story, which is precisely the thing this week refuses to
 * announce. So a figure appears on a DAY ITEM only where the prose has already
 * named the tool: the fraction-of-a-set item (its own sentence says "one third
 * of them") carries a bar of the WHOLE with nothing partitioned off, and the
 * covering item carries ONE ROW of the board, c21's proven affordance. Where the
 * choice is live, the page is deliberately bare. The pictures that show a whole
 * journey live where the answer is already on the page — the lesson script and
 * the guided examples.
 *
 * ERROR-ANALYSIS and the verify library (kit §E2.3). The recipe cell is
 * "(mixed)", and the mix this week is really about is the cue word, so the slip
 * is generated honestly by `d_verify_binop_misconception_v1` with
 * `{op:'/', wrongOp:'*'}`: the truth is the share and the shown wrong value is
 * the genuine output of letting "each" mean multiply. Nothing is fabricated, and
 * the item cannot be answered by re-checking digits — the student's
 * multiplication is perfectly correct.
 *
 * Contexts are hand-bound and none is reused from an earlier C week (sports-day
 * cool boxes, swimming badges, a club fund, flower bulbs, a display board,
 * hall paper cranes, camp name labels, a raffle book, a gallery wall, class
 * crayons, fair paper cups, craft-club wax). No two generators share a place.
 */

import {
  addWhole,
  asWarmup,
  classify,
  divideExact,
  fracEquivFill,
  multiply,
  reasoning,
  rectArea,
  roundWhole,
  subWhole,
} from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtFrac, wholeMoney } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsParam, barModel } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C9 = { level: 'C' as const, week: 9 };
const C10 = { level: 'C' as const, week: 10 };
const C12 = { level: 'C' as const, week: 12 };
const C16 = { level: 'C' as const, week: 16 };
const C17 = { level: 'C' as const, week: 17 };
const C20 = { level: 'C' as const, week: 20 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two distinct names, for the comparison story. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives have no figure slot and lib/ is not ours to edit, so
// this wrapper works entirely inside the returned closure, takes no new rng
// draw, and leaves the prompt (and therefore the QG-1/QG-4 surface signature)
// untouched. It reads the drafted item's `generator.params` — the very numbers
// the answer was computed from — so the figure law holds by construction.
// (Wrapper shape follows c06/c21; the pictures and their words are this week's.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups. Seven formats, every source a named earlier week, and
// between them they span the level: place value and rounding (C2), the two
// column algorithms (C3/C4), the fact table both ways round (C10/C12),
// equivalence (C16) and covering (C20).
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000. */
const wAddThousand = asWarmup(addWhole(118, 462), C3);
/** C4 — subtraction within 1,000. */
const wSubThousand = asWarmup(subWhole(126, 874), C4);
/** C12 — the finished fact table. */
const wFactTable = asWarmup(multiply(4, 9, 4, 9), C12);
/** C10 — the same table read as a division. */
const wShareFact = asWarmup(divideExact(4, 9, 4, 9), C10);
/** C20 — rows times columns, the covering skill. */
const wCover = asWarmup(rectArea(), C20);
/** C2 — rounding, which every size check this week leans on. */
const wRound = asWarmup(roundWhole(2, 118, 962), C2);
/** C16 — renaming a fraction, so the fraction tool stays warm. */
const wEquivFrac = asWarmup(fracEquivFill(), C16);

// ---------------------------------------------------------------------------
// Single-step jobs. Six tools, six situation families, and NOT ONE of them
// names its operation. These are the menu the week refuses to label.
// ---------------------------------------------------------------------------

/** Equal groups (C6/C7). The load repeats; nothing is split. */
const sitCartonGroups = situation({
  situationType: 'combine',
  cognitiveOp: 'mul',
  draw: (r) => {
    const boxes = r.int(4, 9);
    const per = r.int(6, 12);
    const name = one(r);
    return {
      prompt: `${name} loads ${countNoun(boxes, 'cool boxes')} onto the sports-day trolley. Every cool box is filled with ${countNoun(per, 'juice cartons')}. How many juice cartons go out to the field?`,
      answerValue: String(boxes * per),
      templateId: 'd_mul_v1',
      params: { a: boxes, b: per },
      units: 'juice cartons',
      hints: [
        'Does this story describe one pile, or the same load appearing again and again?',
        'Take what a single cool box carries. Count it once for every box.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Sharing (C9). The sentence carries the word "each" — the cue that meant
 * multiply for eight straight weeks — and wants a division.
 */
const sitBadgeShare = situation({
  situationType: 'sharing',
  cognitiveOp: 'div-share',
  draw: (r) => {
    const boards = r.int(3, 8);
    const per = r.int(5, 12);
    return {
      prompt: `The swimming club has ${countNoun(boards * per, 'badges')} to pin up. It puts the same number on each of its ${countNoun(boards, 'display boards')}. How many badges go on one board?`,
      answerValue: String(per),
      templateId: 'd_div_v1',
      params: { a: boards * per, b: boards },
      units: 'badges',
      hints: [
        'Which is the whole thing here — the badges, or the boards?',
        'Deal the badges out board by board until the pile is gone. Then look at one board.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/** Sharing again, in money, so the tool is not welded to one kind of noun. */
const sitFundShare = situation({
  situationType: 'money-change',
  cognitiveOp: 'div-money',
  draw: (r) => {
    const teams = r.int(3, 8);
    const each = r.int(4, 15);
    return {
      prompt: `A club fund of ${wholeMoney(teams * each)} is split evenly between ${countNoun(teams, 'teams')} for the end-of-year trip. How much does one team receive?`,
      answerValue: String(each),
      templateId: 'd_div_v1',
      params: { a: teams * each, b: teams },
      units: 'dollars',
      acceptableForms: [wholeMoney(each)],
      hints: [
        'Is the fund being gathered up in this story, or broken into equal parts?',
        'Cut the fund into one part per team. Then read off one part.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * A fraction of a set (C17) — one of the two items whose prose DOES name its
 * tool, which is why it may carry a picture. The bar shows the whole box and
 * marks nothing off: the partition is the child's to make.
 */
const sitBulbFraction = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'fraction-of-set',
    draw: (r) => {
      const d = r.pick([2, 3, 4, 5, 6] as const);
      const per = r.int(4, 12);
      return {
        prompt: `[image: one bar for all ${countNoun(d * per, 'flower bulbs')} in the box, with nothing marked off yet] A garden-club box holds ${countNoun(d * per, 'flower bulbs')}, and ${fmtFrac(1, d)} of them are tulip bulbs. How many tulip bulbs is that?`,
        answerValue: String(per),
        templateId: 'd_div_v1',
        params: { a: d * per, b: d },
        units: 'tulip bulbs',
        hints: [
          'What does the bottom number of a fraction tell you about the groups?',
          'Break the box into that many equal groups, then pick up exactly one of them.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) => {
    const whole = numOf(p, 'a');
    return barModel(
      [{ label: 'every bulb in the box', segments: [{ value: whole, label: String(whole) }] }],
      {
        scaleMax: whole,
        alt: `one bar for all ${countNoun(whole, 'flower bulbs')} in the box, with the tulip bulbs not marked off`,
        asserts: assertsParam('a'),
      },
    );
  },
);

/**
 * Covering (C20) — the second tool-named item, so it too may carry a picture.
 * ONE row is drawn: the unit of covering is a given, the count of it is not.
 */
const sitCoverBoard = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'cover',
    draw: (r) => {
      const across = r.int(6, 12);
      const down = r.int(3, Math.min(8, across - 2));
      const name = one(r);
      return {
        prompt: `[image: one row across the board, marked into ${countNoun(across, 'card spaces')}] ${name}'s class covers a display board with square cards. The board takes ${countNoun(across, 'cards')} across and ${countNoun(down, 'cards')} down. How many cards cover the whole board?`,
        answerValue: String(across * down),
        templateId: 'd_area_v1',
        params: { l: across, w: down },
        units: 'cards',
        hints: [
          'What is the smallest patch of that board a single card can hide?',
          'One card hides one space. Work out how many spaces the board is made of.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const across = numOf(p, 'l');
    return areaGrid(
      { rows: 1, cols: across },
      {
        alt: `one row across the display board, marked into ${countNoun(across, 'card spaces')}`,
        asserts: assertsParam('l', 'cells'),
      },
    );
  },
);

/** Comparison (C3/C4, B15's descendant): the one job where two numbers must NOT meet. */
const sitLanternGap = situation({
  situationType: 'comparison',
  cognitiveOp: 'compare-gap',
  draw: (r) => {
    const [n1, n2] = two(r);
    const hall = r.int(180, 640);
    const corridor = r.int(60, hall - 70);
    return {
      prompt: `${n1} counted ${countNoun(hall, 'paper cranes')} hanging over the hall. ${n2} counted ${countNoun(corridor, 'paper cranes')} hanging over the corridor. How many more cranes hang over the hall than over the corridor?`,
      answerValue: String(hall - corridor),
      templateId: 'd_sub_v1',
      params: { a: hall, b: corridor },
      units: 'paper cranes',
      hints: [
        'Is this question after one total, or after the difference between two of them?',
        'Cross off one hall crane for every corridor crane, and count what is still hanging.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step. Every chain crosses TWO chapters of the level — that is the
// integration the consolidation law asks for, and it is what a child who has
// mastered each week separately has never been asked to do.
// ---------------------------------------------------------------------------

/** C6 equal groups → C9 sharing. Build one pile, then break it up again. */
const msLabelsThenCabins = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'groups-then-share',
  usesPriorSkill: true,
  draw: (r) => {
    const cabins = r.pick([3, 4, 5] as const);
    const k = r.pick([2, 3, 4] as const);
    const perStrip = cabins * k;
    const strips = r.int(4, 9);
    const name = one(r);
    return {
      prompt: `${name} picks up ${countNoun(strips, 'strips')} of camp name labels. Every strip has ${countNoun(perStrip, 'labels')} printed on it. ${name} shares all of those labels equally between ${countNoun(cabins, 'cabins')}. How many labels does one cabin get?`,
      initN: strips,
      steps: [
        { op: 'mul', n: perStrip, d: 1 },
        { op: 'div', n: cabins, d: 1 },
      ],
      units: 'labels',
      hints: [
        'Which of the two moves has to happen first?',
        'Gather every label into a single pile first, and only then start dealing them out.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** C17 fraction of a set → C6 equal groups. A part of a set, then that part counted in groups. */
const msTicketsThenPoints = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'part-then-groups',
  usesPriorSkill: true,
  draw: (r) => {
    const d = r.pick([2, 3, 4, 5] as const);
    const per = r.int(5, 12);
    const points = r.int(3, 9);
    return {
      prompt: `A raffle book holds ${countNoun(d * per, 'tickets')}, and ${fmtFrac(1, d)} of them have been sold. Every ticket sold puts ${countNoun(points, 'points')} on the class chart. How many points has the book earned?`,
      initN: d * per,
      steps: [
        { op: 'div', n: d, d: 1 },
        { op: 'mul', n: points, d: 1 },
      ],
      units: 'points',
      hints: [
        'Does the chart count every ticket in the book, or only the sold ones?',
        'Find the sold pile first. Then count what one ticket is worth, for every ticket.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/** C20 covering → C4 subtraction. Fill the wall, then ask about the bare part. */
const msBoardThenGap = multiStep({
  situationType: 'area',
  cognitiveOp: 'cover-then-gap',
  usesPriorSkill: true,
  draw: (r) => {
    const across = r.int(6, 12);
    const down = r.int(3, Math.min(8, across - 2));
    const already = r.int(4, across * down - 6);
    return {
      prompt: `The end-of-year gallery wall is full at ${countNoun(across, 'paintings')} across and ${countNoun(down, 'paintings')} down. ${countNoun(already, 'paintings')} are already pinned up. How many more paintings are needed to fill the wall?`,
      initN: across,
      steps: [
        { op: 'mul', n: down, d: 1 },
        { op: 'sub', n: already, d: 1 },
      ],
      units: 'paintings',
      hints: [
        'Does the question ask about the finished wall, or the space still bare?',
        'Fill the wall in your head, then take off the paintings that are already hanging.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * INVERSE-START (the C5 ceiling lift, kept alive at exit) and the week's
 * sharpest cue-word trap: the story says "shared equally", and because the
 * share has ALREADY happened, the opening move is its inverse. Every word
 * points one way and the first calculation goes the other.
 */
const msSharedThenLost = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'undo-share',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const tables = r.int(5, 9);
    const each = r.int(8, 14);
    const lost = r.int(5, Math.min(40, tables * each - 20));
    return {
      prompt: `In September the class's crayons were shared equally between ${countNoun(tables, 'tables')}. Every table was handed ${countNoun(each, 'crayons')}. Since then ${countNoun(lost, 'crayons')} have gone missing. How many crayons does the class still have altogether?`,
      initN: tables,
      steps: [
        { op: 'mul', n: each, d: 1 },
        { op: 'sub', n: lost, d: 1 },
      ],
      units: 'crayons',
      hints: [
        'Does this story give the whole set, or only one table\'s share?',
        'Put every table\'s handful back together to rebuild the set. Then take off what has gone.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * HAS-DISTRACTOR. A stated quantity the question does not want — and it sits in
 * the MIDDLE of the story, interrupting the chain, rather than trailing off the
 * end as an aside. First move is C14's multiply-by-tens; second is a plain join.
 */
const msCupsPlusLoose = multiStep({
  situationType: 'combine',
  cognitiveOp: 'tens-then-join',
  posing: 'has-distractor',
  usesPriorSkill: true,
  draw: (r) => {
    const packs = r.int(3, 9);
    const stalls = r.int(11, 19);
    const loose = r.int(12, 80);
    return {
      prompt: `The lemonade stall opens ${countNoun(packs, 'packs')} of paper cups with ${countNoun(30, 'cups')} in every pack. ${countNoun(stalls, 'other stalls')} are trading beside it along the field. The lemonade stall also finds ${countNoun(loose, 'cups')} loose in its cupboard. How many paper cups does the lemonade stall have?`,
      initN: packs,
      steps: [
        { op: 'mul', n: 30, d: 1 },
        { op: 'add', n: loose, d: 1 },
      ],
      units: 'cups',
      hints: [
        'Which of the numbers in this story are actually counting cups?',
        'Work out what the sealed packs hold, then bring in the ones found loose.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so this
 * ladder is never drawn twice (kit §E2.2). The probe is the week's own question
 * in disguise: whether the answer ends up bigger or smaller than the number the
 * story opens with cannot be answered by reflex, because it depends entirely on
 * which tool the child has decided the story wants.
 */
const msWaxCandles = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'group-then-join',
  usesPriorSkill: true,
  draw: (r) => {
    // Ranges chosen so the estimate probe is a genuine call: with these, the
    // answer lands ABOVE the opening number about a third of the time and below
    // it the rest, so "bigger or smaller?" cannot be answered by reflex — the
    // child has to weigh a division that shrinks against an addition that grows.
    const perCandle = r.pick([2, 3, 4] as const);
    const made = r.int(6, 15);
    const ready = r.int(6, 30);
    return {
      prompt: `A craft club has ${countNoun(perCandle * made, 'wax blocks')}. It melts ${countNoun(perCandle, 'blocks')} for every candle it pours. Last week's ${countNoun(ready, 'candles')} are already standing on the shelf. How many candles will stand on the shelf once this week's pouring is done?`,
      initN: perCandle * made,
      steps: [
        { op: 'div', n: perCandle, d: 1 },
        { op: 'add', n: ready, d: 1 },
      ],
      units: 'candles',
      hints: [
        'Does the number of wax blocks tell you the number of candles straight away?',
        'Melt the wax down into candles first, and add the shelf\'s existing row afterwards.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});
const msWaxCandlesEstimate = withEstimateFirst(
  msWaxCandles,
  'will the answer be bigger than the story\'s opening number, or smaller?',
);

// ---------------------------------------------------------------------------
// Discrimination — three of them, because "operation choice, unsignalled" IS
// the week. One picks the CALCULATION against a misleading cue word, one picks
// the QUESTION that a given calculation belongs to (identical numbers in all
// three options, so only structure can decide), and one picks the number the
// question does not want.
// ---------------------------------------------------------------------------

const discrimWhichCalculation = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-operation',
  draw: (r) => {
    const trolleys = r.int(4, 9);
    const perTrolley = r.int(8, 18);
    const chairs = trolleys * perTrolley;
    const name = one(r);
    return {
      prompt: `${name} finds ${countNoun(chairs, 'chairs')} in the sports hall. They are stacked on ${countNoun(trolleys, 'trolleys')}, with the same number on each. Which calculation finds how many chairs are on one trolley?`,
      correct: `${chairs} ÷ ${trolleys}`,
      distractors: [
        {
          text: `${chairs} × ${trolleys}`,
          errorTag: 'concept-misconception',
          rationale: 'Lets the word for equal loads mean multiply, which builds a pile far larger than the hall ever held.',
        },
        {
          text: `${chairs} − ${trolleys}`,
          errorTag: 'task-comprehension',
          rationale: 'Takes a count of trolleys away from a count of chairs, so it measures a gap between two different kinds of thing.',
        },
      ],
      hints: [
        'Does this story hand you one trolley\'s load, or the load of the whole hall?',
        'Picture the chairs being dealt out trolley by trolley. Then name that move.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The reverse map, and the purest form of the week's demand: the SAME two
 * numbers stand in all three options, so no surface feature can decide — only
 * what the sentence does to the crate.
 */
const discrimWhichQuestion = discrimination({
  variant: 'structural',
  cognitiveOp: 'match-question',
  draw: (r) => {
    const kids = r.int(4, 9);
    const per = r.int(4, 9);
    const apples = kids * per;
    return {
      prompt: `Here are three questions about ${countNoun(kids, 'children')} and ${countNoun(apples, 'apples')}. Only ONE of them needs the calculation ${apples} ÷ ${kids}. Which one?`,
      correct: `The ${apples} apples are shared equally between the ${kids} children. How many apples does one child get?`,
      distractors: [
        {
          text: `Every one of the ${kids} children brings in ${apples} apples. How many apples is that in all?`,
          errorTag: 'concept-misconception',
          rationale: 'Gives every child a whole crate of their own, so the two numbers build a bigger total rather than splitting one.',
        },
        {
          text: `There are ${apples} apples and ${kids} children. How many more apples than children are there?`,
          errorTag: 'task-comprehension',
          rationale: 'Lines the two counts up against each other, which measures the gap between them rather than the size of one share.',
        },
      ],
      hints: [
        'Which of these three shapes splits one pile up, rather than building a bigger one?',
        'Read each question on its own and picture what happens to the pile of apples.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The distractor-quantity habit, priced as a choice. Every item in the level
 * before this one consumed every number it mentioned, which quietly teaches
 * "use all the numbers"; here that strategy has to be rejected out loud.
 *
 * All three quantities are dealt from ONE shuffled pool, and that is load-bearing
 * rather than tidy. Drawing the three roles from disjoint ranges (which is how
 * this was first written) made the spare number the LARGEST option every time,
 * so a child could score the item by picking the biggest without reading a word
 * of it — a discrimination whose surface leaks its own answer. Dealing from one
 * pool makes size carry no information, and it still guarantees three distinct
 * options with no redraw loop (kit §E2.4).
 */
const discrimUnusedNumber = discrimination({
  variant: 'structural',
  cognitiveOp: 'unused-quantity',
  draw: (r) => {
    const pool: number[] = [];
    for (let v = 3; v <= 14; v++) pool.push(v);
    const [choirs, songs, days] = r.shuffle(pool);
    return {
      prompt: `${countNoun(choirs, 'choirs')} are taking part in the summer festival. Every choir is learning ${countNoun(songs, 'songs')}, and the festival runs for ${countNoun(days, 'days')}. Which number is NOT needed to find how many songs they are learning?`,
      correct: String(days),
      distractors: [
        {
          text: String(choirs),
          errorTag: 'task-comprehension',
          rationale: 'Throws away the number of groups, and without it there is nothing to count the song lists across.',
        },
        {
          text: String(songs),
          errorTag: 'representation-misread',
          rationale: 'Throws away the size of one choir\'s list, which is the very quantity the total is built out of.',
        },
      ],
      hints: [
        'Which quantity does the question actually ask you to count?',
        'Read the question sentence on its own, then hold each number up against it.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers).
//
// The exit week's own slip: the operation chosen by the cue word. The verify
// template supplies the honest pair — the truth is the share (a ÷ b) and the
// shown wrong value is the genuine output of reading "each" as an instruction
// to multiply (a × b). What makes this the week's item rather than an
// arithmetic item: the student's MULTIPLICATION IS CORRECT. There is nothing to
// find in the digits, so the only way in is to ask what a number that size
// could possibly be counting.
// ---------------------------------------------------------------------------

const eaCueWordSlip = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const baskets = r.int(3, 8);
    const per = r.int(4, 11);
    return { a: baskets * per, b: baskets, op: '/', wrongOp: '*' };
  },
  build: (v, p, r) => {
    const name = one(r);
    return {
      prompt: `${name}'s farm shop packed ${countNoun(Number(p.a), 'apples')} into ${countNoun(Number(p.b), 'baskets')}. Each basket got the same number of apples. Asked how many apples one basket holds, a student wrote ${p.a} × ${p.b} = ${v.wrong}.`,
      extension: 'Work out how many apples one basket really holds. Then write one sentence about what a number that big could count.',
      hints: [
        'Can one basket hold more apples than the whole shop packed?',
        'Draw the baskets and share the apples out yourself. Then hold your total beside the one on the page.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: ['share', 'one basket', 'smaller'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC24 = makeWeekBuilder({
  level: 'C',
  week: 24,
  conceptId: 'ready-for-level-d',
  conceptName: 'Ready for Level D (consolidation)',
  strandTags: ['multiplication-division', 'decimals-fractions'],
  prerequisiteWeeks: [C9, C17, C20],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the shape of the story',
  conceptFamily: 'operation',
  deepeningDelta:
    'C3 to C23 each handed the child the tool by naming itself: C6 was the equal-groups page, C9 the sharing page, C17 the fraction-of-a-set page, C20 the covering page. A child could be fluent in all twenty-three and never once have CHOSEN. C24 removes the label and then makes the surface cues unreliable on purpose — a story that says "each" wants a division, a story that says "shared equally" opens with a multiplication, and one story states a number the question does not want. Every two-step item here crosses TWO of the level\'s chapters rather than repeating one: a fraction of a set feeding an equal-groups count, a covering feeding a subtraction, a share that has already happened and must be undone before anything else can begin. Retrieval is raised to the top of the band and drawn from across the whole level, so what is revisited is the year, not last week.',
  explanation: {
    hook:
      'Here are two stories. A crate of 48 apples is shared equally between 6 baskets. Six baskets each hold 48 apples. The same two numbers both times — and the answers are 8 and 288. This week is about telling those two shapes apart. Do it before you write anything down.',
    whyBeforeHow:
      'Two stories can carry exactly the same numbers and still need opposite moves. That is because the numbers never say what is happening to them. The shape of the story does. A group repeated makes a bigger pile. One pile split fairly makes a smaller one. Two amounts held side by side make a gap. A surface filled with squares makes a covering. So this last week asks for the shape first and the arithmetic second. The words are not reliable signposts. A story leaning on the word each may be asking you to share. Every tool you have collected this year is still exactly the tool it was. What is new is that nothing tells you which one to pick up. Some jobs want two of them, one after the other.',
    script: [
      {
        say: 'Watch what I do with two stories that hold the same two numbers. The first one: a crate of 48 apples is shared equally between 6 baskets. I am splitting one whole pile into fair parts. So my answer must be smaller than the pile I started with. One basket holds 8 apples.',
        visual: 'One bar of 48 apples cut into six equal baskets of 8.',
        figure: barModel(
          [
            {
              label: 'the crate, shared between six baskets',
              segments: [
                { value: 8, label: '8' },
                { value: 8 },
                { value: 8 },
                { value: 8 },
                { value: 8 },
                { value: 8 },
              ],
              total: '48',
            },
          ],
          { scaleMax: 48, alt: 'one bar of 48 apples cut into six equal parts of 8' },
        ),
      },
      {
        say: 'Now the second story. There are 6 baskets, and every one holds 48 apples. Nothing is being split here at all. One load is repeating, so 6 × 48 = 288 apples. Same two numbers, opposite shapes, and two answers that are nowhere near each other.',
        visual: 'Six baskets side by side, each one a full crate rather than a share of one.',
      },
      {
        say: 'The word each turned up in both of those stories. It pointed a different way each time. That is the reason I never let a single word choose my move for me. I ask what is happening to the pile. The word can say what it likes.',
        visual: 'The word each written once between the two stories, with an arrow to each of them.',
      },
      {
        say: 'Some jobs want two tools, one after the other. A gallery wall holds 9 paintings across and 4 down. A full wall takes 9 × 4 = 36 paintings. If 14 are already pinned up, the ones still missing come to 22. I had to pick two different moves to get there.',
        visual: 'A gallery wall drawn as four rows of nine spaces, with some spaces filled.',
        figure: areaGrid(
          { rows: 4, cols: 9, showCounts: true },
          { alt: 'a gallery wall drawn as 4 rows of 9 painting spaces' },
        ),
      },
      {
        say: 'One last habit before any arithmetic. I check roughly how big my answer ought to be. Sharing a pile makes the number smaller. Repeating a group makes it bigger. If my answer lands on the other side of that, I stop. Then I look at the shape of the story again, not at my columns.',
        visual: 'Two arrows from a starting number, one running up and one running down.',
      },
    ],
    summary:
      'The numbers in a story never tell you what to do with them. The shape of the story does. Ask first what is happening. Is one group repeating, or is one whole being split? Are two amounts being compared, or is a surface being covered? Then check that the size of your answer fits the shape you chose. Some jobs want two tools, one after the other. And a few stories mention a number the question never wanted.',
    vocabulary: [
      { term: 'the shape of a story', kidGloss: 'what the story does to the numbers: repeats, splits, compares or covers' },
      { term: 'choosing the move', kidGloss: 'deciding which calculation the story needs, before doing any of it' },
      { term: 'a spare number', kidGloss: 'a number a story mentions that its question does not need' },
      { term: 'a size check', kidGloss: 'asking whether your answer should have come out bigger or smaller' },
    ],
  },
  guidedExamples: [
    {
      ...ge(24, 1, 'modeled', 'A crate holds 42 apples. They are shared equally between 6 baskets, with the same number in every basket. How many apples are in one basket?', [
        {
          teacherSay:
            'Watch me read the whole story before I touch a number. I am hunting for its shape. Is one load repeating here, or is one pile being cut up? The 42 apples are a single pile, and the baskets cut it up. So I need a move that makes my number smaller.',
        },
        {
          teacherSay: 'Now the arithmetic is the easy half of the job. What does one basket end up holding?',
          expected: '7',
        },
      ], '7 apples'),
      visual: 'One bar of 42 apples cut into six equal baskets.',
      figure: barModel(
        [
          {
            label: 'the crate, shared between six baskets',
            segments: [
              { value: 7, label: '7' },
              { value: 7 },
              { value: 7 },
              { value: 7 },
              { value: 7 },
              { value: 7 },
            ],
            total: '42',
          },
        ],
        { scaleMax: 42, alt: 'one bar of 42 apples cut into six equal parts of 7' },
      ),
    },
    ge(24, 2, 'completion', 'The same two numbers, a different shape. There are 6 baskets, and every basket holds 42 apples. How many apples is that in all?', [
      { teacherSay: 'Which of the two things is repeating this time — the crate, or the basket?', expected: 'the basket' },
      { childDo: 'Name the move this shape needs, then work it out.', expected: '252' },
    ], '252 apples'),
    ge(24, 3, 'prompted', 'A gallery wall holds 8 paintings across and 5 paintings down when it is full. 14 paintings are already pinned up. How many more paintings are needed to fill it?', [
      { childDo: 'Decide how many jobs this story needs before you start, then take them in order.', expected: '26' },
    ], '26 paintings'),
    ge(24, 4, 'independent', 'A club fund of $72 is split evenly between 9 teams. One team then puts $3 of its share back into the fund. How much does that team keep? Solve it cold.', [
      { childDo: 'Two jobs, and no words telling you which is which. Name each one before you write it.', expected: '5' },
    ], '$5'),
  ],
  days: [
    // Day 1 — concept echo: the tools met one at a time and never announced.
    // Three different shapes (repeat, split, compare) with nothing on the page
    // to say which is which, and no two-step load yet.
    [
      { gen: wAddThousand, diff: 2 },
      { gen: wFactTable, diff: 2 },
      { gen: wCover, diff: 2 },
      { gen: sitCartonGroups, diff: 2 },
      { gen: sitBadgeShare, diff: 3 },
      { gen: sitLanternGap, diff: 3 },
    ],
    // Day 2 — fluency + application: the first unsignalled-operation trap, the
    // estimate-first predict (which cannot be answered without choosing a tool
    // first), and the week's first two-chapter chain.
    [
      { gen: wSubThousand, diff: 2 },
      { gen: wEquivFrac, diff: 2 },
      { gen: discrimWhichCalculation, diff: 3 },
      { gen: msWaxCandlesEstimate, diff: 4 },
      { gen: msLabelsThenCabins, diff: 3 },
      { gen: sitBulbFraction, diff: 3 },
    ],
    // Day 3 — interleave at full width: the reverse-map trap and the spare-number
    // trap beside a fraction-into-groups chain and a covering, so the page shape
    // never predicts the move.
    [
      { gen: wShareFact, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: discrimWhichQuestion, diff: 4 },
      { gen: discrimUnusedNumber, diff: 3 },
      { gen: msTicketsThenPoints, diff: 4 },
      { gen: sitCoverBoard, diff: 3 },
    ],
    // Day 4 — word problems: the integration day. Four chains, each crossing two
    // chapters, one of them inverse-start and one carrying a spare number — plus
    // a single-step story so "it must be two steps" never becomes the cue.
    [
      { gen: msSharedThenLost, diff: 5 },
      { gen: msCupsPlusLoose, diff: 5 },
      { gen: msBoardThenGap, diff: 4 },
      { gen: msLabelsThenCabins, diff: 4 },
      { gen: sitFundShare, diff: 3 },
    ],
    // Day 5 — the exit check and the strategy reflection: the cue-word slip
    // analysed, three jobs sorted by tool with the reasoning written out, and
    // the claim about cue words settled for good (+ a ramped warm-up).
    [
      { gen: wFactTable, diff: 2 },
      { gen: eaCueWordSlip, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Three jobs from the summer fair, all built from the same two numbers. Job 1: 96 raffle tickets are shared equally between 8 stalls. How many does one stall get? Job 2: each of 8 stalls sells 96 cups of lemonade. How many cups is that? Job 3: there are 96 cups and 8 jugs. How many more cups than jugs? Write the calculation you would do for each job and work it out. Then write one sentence for each saying what in the WORDS made you sure.',
          value:
            'job 1 is 96 divided by 8, which is 12; job 2 is 8 times 96, which is 768; job 3 is 96 take away 8, which is 88 — the shapes are a share, a repeat and a comparison',
          acceptableForms: ['12', '768', '88', 'share', 'repeat', 'compare'],
          keywords: true,
          hints: [
            'Which words in each job tell you what is happening to the numbers?',
            'Say each job aloud in your own words. Then name the move it needs.',
          ],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? When a story uses the word each, the job is a multiplication. Say in one sentence how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Treats a cue word as the instruction, but the same word sits in every sharing story, where the job is a division.',
            },
            {
              text: 'never',
              errorTag: 'task-comprehension',
              rationale: 'Rules out all the equal-groups stories where that word really does mark the size of one group.',
            },
          ],
          hints: [
            'Can a story use that word and still need a different move?',
            'Write one story where that word means multiplying. Then write one where it does not.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this is the last week of the level, and it deliberately stops telling your child which calculation to do. If they get one wrong, do not check the arithmetic first — ask them to say what the story is DOING to the numbers: repeating a group, splitting a pile, comparing two amounts, or covering a surface. Nine times in ten the columns were fine and the choice was the thing that slipped. The one habit worth taking into the next level: before writing anything, say out loud whether the answer should come out bigger or smaller.',
  ],
  puzzle: (r) => {
    const small = r.pick([4, 6, 8, 9] as const);
    const q = r.int(5, 9);
    const big = small * q;
    const name = one(r);
    return {
      id: 'C24-PZ-01',
      title: 'Puzzle Grove: Two Numbers, Four Jobs',
      puzzleType: 'construction',
      prompt: `${name} is allowed only two numbers all afternoon: ${big} and ${small}. Write FOUR different summer-fair questions that use just those two numbers. Answer one by adding, and one by taking away. Answer one by repeating a group, and one by sharing equally. Work out all four answers. Then say which question was the hardest one to word. What made it hard?`,
      answer: {
        value: `${big + small}; ${big - small}; ${big * small}; ${big / small}`,
        acceptableForms: [String(big + small), String(big - small), String(big * small), String(big / small)],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Which of the four moves is the one that makes the numbers grow the most?',
        'Take the moves one at a time. For each one, ask what kind of story fits.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 4, cognitiveOp: 'invent-the-question' },
  sprint: {
    // mult_facts_v1 emits only a × b items — a division claim in this label
    // would promise what the realizer cannot serve.
    skill: 'Multiplication facts — the recall the level ends on',
    sourceWeek: C12,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sitBadgeShare, diff: 3 },
    { gen: msLabelsThenCabins, diff: 4 },
    { gen: sitCartonGroups, diff: 3 },
    { gen: msSharedThenLost, diff: 4 },
    { gen: sitBulbFraction, diff: 3 },
    { gen: msBoardThenGap, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the three single-step shapes the week keeps unsignalled — a whole pile split between boards, one load repeated over boxes, and a unit fraction of a set (with its whole-bar figure preserved). 02/06: two-chapter forward chains — equal groups then a share, and a covering then the gap to full. 04: the inverse-start chain, where the share has already happened and has to be undone before anything else can start. Operand surfaces are drawn fresh per slot but uniqueness is NOT enforced across forms or days; where a fact space is small, a mastery item can coincide with the operands of a daily item.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'cue-word-chose-the-move',
      description: 'Lets a single word in the story pick the operation — "each" read as multiply, "shared" read as divide — instead of reading what the story does to the quantity.',
      exampleWrongAnswer: '"48 badges on each of 6 boards" answered as 288',
      distractorRationale: 'Offer the result of the operation the story\'s cue word points at.',
      reteachPointer: 'explanation/script[2] (the same word pointed both ways in two stories)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'used-every-number',
      description: 'Consumes every number the story mentions, including one the question never asked for, or stops after the first of two moves and reports the middle number.',
      exampleWrongAnswer: 'a cups story answered with the number of stalls folded into the total',
      distractorRationale: 'Offer the result that has an unwanted stated quantity folded in, and the middle number of a two-move chain.',
      reteachPointer: 'guidedExamples/C24-GE-03 (decide how many jobs the story needs before starting)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'wrong-quantity-named',
      description: 'Reports a quantity the story really does mention, but not the one the question points at — the whole set when one share was asked for, or one part when the total was.',
      exampleWrongAnswer: 'a "how many in one basket?" story answered with the size of the whole crate',
      distractorRationale: 'Offer a quantity the story genuinely carries, but not the one the question names.',
      reteachPointer: 'explanation/script[4] (check the size of the answer against the shape you chose)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'second-move-slip',
      description: 'Chooses both moves correctly and in the right order, then slips on the arithmetic of one of them.',
      exampleWrongAnswer: 'the second line of a two-move chain, 36 take away 14, answered as 12',
      distractorRationale: 'Offer the result that is ten out on the second move.',
      reteachPointer: 'guidedExamples/C24-GE-04 (name each job before writing it), then the 2-minute facts sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The last week of the level, and the one that pulls it all together: stories that do NOT say which calculation they want. Your child had to read each story, decide whether it repeats a group, splits a pile, compares two amounts or covers a surface, and only then do the arithmetic — including jobs that need two of the year\'s tools one after the other, and one or two stories that mention a number the question does not want.',
    improvingCandidates: [
      'reading a story for its shape before choosing a calculation',
      'handling jobs that need two different tools, one after the other',
      'spotting a number a story mentions that the question does not need',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'not letting one word decide the move — "each" turns up in sharing stories just as often as in repeating ones',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was actually asked, and leaving out any number it did not ask for',
      },
      {
        errorTag: 'representation-misread',
        text: 'tracking which quantity in a story the question is pointing at — the whole, or one share of it',
      },
      {
        errorTag: 'procedure-slip',
        text: 'the arithmetic inside each move once the plan is settled — the sprints keep that part quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You read each story right through and named what it was doing to the numbers before you picked a calculation — and you noticed when a familiar word was pointing the wrong way.',
      questionForChild: 'A tray holds 24 buns and they are shared between 4 plates — and 4 plates each hold 24 buns. Which of those needs a bigger answer, and how did you know before working it out?',
      schoolSyncHook: 'As your child finishes this level, tell us which Level-D topics their class is heading toward and we will preview them in the warm-ups.',
    },
    vocabularyForParent: [
      'the shape of a story (what it does to the numbers: repeats, splits, compares, covers)',
      'choosing the move (deciding the calculation before doing any of it)',
      'a spare number (one the story mentions and the question does not want)',
    ],
  },
});
