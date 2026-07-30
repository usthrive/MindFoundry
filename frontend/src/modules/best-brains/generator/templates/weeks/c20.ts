/**
 * Level C · Week 20 — "Area" (conceptId: area).
 *
 * FILL-ARCHITECTURE §5 row C20: anchor "cover and count"; multi-step "rows ×
 * columns (ties to arrays, `usesPriorSkill`)"; error-analysis "skips the partial
 * rows in the count"; discrimination "area count vs side count"; Day-5 signature
 * "same area, different shapes".
 *
 * THE CLAIM THE WEEK MAKES is that area is a COUNT of unit squares, and that
 * rows × columns is a shortcut for that count rather than a formula to be
 * remembered. So the content is built to earn the shortcut instead of issuing it:
 *  - the first thing every child does is cover and count. The lesson script
 *    counts fifteen squares one at a time BEFORE it notices that the rows repeat;
 *  - two items make counting the only honest route, because their rows are not
 *    all the same length (a two-row shape on Day 1, a four-row staircase from
 *    Day 3). A child who has reached for rows × columns there over-counts, which
 *    is exactly the experience that makes the shortcut's precondition felt;
 *  - a structural discrimination prices that precondition directly: offered a
 *    shape whose last row is short, "multiply the rows by the longest row" and
 *    "multiply the rows by the shortest row" are both on the page as choices;
 *  - the shortcut then appears as what it is — one row counted once for every
 *    row — inside three chains that need it (rows × columns, then a strip added,
 *    a tray subtracted, or the row count recovered and re-used).
 *
 * UNITS ARE THE SECOND TRAP and they are handled at the source: every quantity
 * goes through `lib/format.ts` (never a bare `${…}`), and each item's answer
 * carries the unit its own question asks for — a count of physical squares
 * ('panes', 'patches', 'tiles') where the squares are objects, and
 * 'square centimeters' / 'square meters' where the unit square is a standard
 * one. `valueForms` therefore builds "24 square meters", never "24 meters", for
 * the accepted-answer list too, and the area-vs-side discrimination offers its
 * numbers with their labels attached.
 *
 * WHAT THIS WEEK DELIBERATELY DOES NOT DO — C21 is the perimeter-vs-area week
 * and the contrast is its content, not a garnish it inherits half-spent. So no
 * item here walks a rim, adds four sides, or asks a child to choose between two
 * measures; the word perimeter is never used. The one place the border comes
 * near is the area-vs-SIDE discrimination the recipe assigns to C20, and it is
 * kept in the counting register the whole way: the squares along one edge of a
 * grid against the squares in the whole grid. C21 also claims the inverse
 * direction ("a stated covering reveals the side nobody measured", in meters);
 * this week's inverses stay counts — how many squares sit in each row, how many
 * rows a covering was laid in — and never return a length.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7). On this concept the cell count
 * of a grid IS the answer, so an `area-grid` drawn whole would hand over every
 * assessed item. Therefore:
 *  - assessed items that carry a picture draw ONE ROW of the covering and assert
 *    the row length against the item's own param — the same move c06's array
 *    item makes. The picture teaches what a row of squares looks like and leaves
 *    the covering to the child;
 *  - the filled grid, `showCounts` and all, appears only where the answer is
 *    already on the page: the lesson script and the modeled/completion guided
 *    examples;
 *  - the shapes with unequal rows carry no picture at all. Their whole point is
 *    that the child must build the covering row by row, and a drawn grid would
 *    do that building for them;
 *  - the Day-5 puzzle is picture-free by design: it asks the child to DRAW the
 *    L-shape on squared paper, which is the first half of the work.
 *
 * VERIFY-LIBRARY NOTE (FANOUT kit §E2.3, documented here rather than buried).
 * The recipe's error-analysis is "skips the partial rows in the count", whose
 * honest output is (rows − 1) × row-size — a product of a pair the story never
 * states, so `d_verify_binop_misconception_v1` cannot express it, and the one
 * pairing it CAN express for an area story (a × b vs a + b) is the headline
 * misconception C21 owns. The registry does carry the slip itself:
 * `a_verify_count_slip_v1` computes a counting slip honestly, and its
 * 'skip-count' mode returns exactly "one short". So the item is reframed onto
 * the quantity that is genuinely being miscounted — the ROWS. A plan states its
 * whole covering and its full-row size, its last row is a short one, and the
 * student's row count comes back one light; the child recovers the true row
 * count and says what one row is worth. Nothing is fabricated: both the shown
 * number and the keyed truth come from the verify template, and the recipe's
 * misconception is the one on the page.
 *
 * Contexts are hand-bound (place + covering in one literal) rather than drawn
 * from `lib/contexts.ts`, whose frames are all COUNT frames: this week measures
 * surfaces. No two generators share a covering, none of them reuses a place C21
 * or c06 already owns, and the irregular shapes live on squared paper — the
 * honest home of an area that no multiplication reaches.
 *
 * Retrieval is backward-only into B20 (equal rows — the array this week turns
 * into a measurement), C3 (± within 1,000) and C10 (the ×/÷ fact families the
 * row-size inverse leans on).
 */

import { addWhole, asWarmup, classify, divideExact, multiply, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B20 = { level: 'B' as const, week: 20 };
const C3 = { level: 'C' as const, week: 3 };
const C6 = { level: 'C' as const, week: 6 };
const C10 = { level: 'C' as const, week: 10 };
const C12 = { level: 'C' as const, week: 12 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives have no figure slot and `lib/` is not ours to edit, so
// this does what `withEstimateFirst` does: everything happens inside the
// returned closure, no new rng draw is taken, and the prompt (and with it the
// QG-1/QG-4 surface signature) is left alone. It reads the drafted item's
// `generator.params` — the numbers its answer was computed from — so "a figure
// is built from the item's own drawn values" holds by construction.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/** What one row of a covering looks like — never how many rows there are. */
const rowScene = (per: number, thing: string): string =>
  `one row across the ${thing}, marked into ${countNoun(per, 'squares')}`;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

const wAdd = asWarmup(addWhole(118, 461), C3);
const wFacts = asWarmup(multiply(2, 9, 4, 9), C12);
/** C10 — the ×/÷ family, which is how a covering gives back its row size. */
const wShare = asWarmup(divideExact(3, 9, 3, 9), C10);

/** B20 — equal rows, the arrangement this week starts measuring rather than counting. */
const wRows = asWarmup(
  situation({
    situationType: 'rate',
    cognitiveOp: 'mul',
    draw: (r) => {
      const per = r.int(3, 8);
      const rows = r.int(3, 6);
      const noun = r.pick(['stamps', 'buttons', 'shells', 'cards']);
      return {
        prompt: `A drawer is packed in ${countNoun(rows, 'equal rows')} with ${countNoun(per, noun)} in every row. How many ${unitFor(2, noun)} is that in all?`,
        answerValue: String(per * rows),
        templateId: 'd_mul_v1',
        params: { a: per, b: rows },
        units: noun,
        hints: [
          'Do the rows in this drawer all hold the same amount?',
          'Say what one row holds, then keep saying it once for every row there is.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B20,
);

// ---------------------------------------------------------------------------
// Cover and count — the anchor, in its two registers
// ---------------------------------------------------------------------------

/**
 * The COUNT register: the squares are real objects, so the covering is counted
 * in panes, patches, cards. Figure = one row, asserted against the row size.
 */
const TILED_THINGS = [
  { thing: 'window', noun: 'square panes' },
  { thing: 'noticeboard', noun: 'square cards' },
  { thing: 'splashback', noun: 'square tiles' },
  { thing: 'sticker chart', noun: 'square stickers' },
] as const;

const covTiles = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'area-count',
    draw: (r) => {
      const per = r.int(4, 9);
      const rows = r.int(3, 6);
      const s = r.pick(TILED_THINGS);
      const name = one(r);
      return {
        prompt: `[image: ${rowScene(per, s.thing)}] ${name}'s ${s.thing} is filled with ${s.noun}. Every row holds ${countNoun(per, s.noun)}, and the ${s.thing} has ${countNoun(rows, 'rows')}. How many ${unitFor(2, s.noun)} cover it?`,
        answerValue: String(per * rows),
        templateId: 'd_area_v1',
        params: { l: per, w: rows, thing: s.thing },
        units: s.noun,
        hints: [
          'Are the rows of this covering all the same size?',
          'Tile one row first, then lay that same row again for each row the shape has.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'l') },
      { alt: rowScene(numOf(p, 'l'), strOf(p, 'thing')), asserts: assertsParam('l', 'cells') },
    ),
);

/**
 * The MEASURE register: the sides arrive as lengths, the unit square is a
 * standard one, and the answer therefore carries a SQUARE label. Deliberately
 * picture-free — turning two stated lengths into a covering is the work.
 */
const MEASURED_THINGS = [
  { thing: 'photo', unit: 'centimeters', squared: 'square centimeters' },
  { thing: 'name badge', unit: 'centimeters', squared: 'square centimeters' },
  { thing: 'shed roof', unit: 'meters', squared: 'square meters' },
  { thing: 'campsite pitch', unit: 'meters', squared: 'square meters' },
] as const;

const covSquareUnits = situation({
  situationType: 'measurement',
  cognitiveOp: 'area-measure',
  draw: (r) => {
    const long = r.int(5, 9);
    // At least three the short way: a 9-by-2 photo is a sliver no child has ever
    // been handed, and a covering only two squares deep barely reads as rows.
    const short = r.int(3, Math.min(6, long - 1));
    const s = r.pick(MEASURED_THINGS);
    const name = one(r);
    return {
      prompt: `${name} measures a ${s.thing}: it is ${countNoun(long, s.unit)} long and ${countNoun(short, s.unit)} wide. Squares measuring ${countNoun(1, s.unit)} along every side are laid over it with no gaps. How many ${s.squared} does the ${s.thing} cover?`,
      answerValue: String(long * short),
      templateId: 'd_area_v1',
      params: { l: long, w: short },
      units: s.squared,
      hints: [
        'What size is the square this covering is being measured in?',
        'Fit the little squares along the longer measurement first, then stack that line of them down the shorter one.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

/**
 * Two rows that do NOT match, so the covering can only be counted. Single-step
 * on purpose: Day 1 meets the awkward shape before it meets the shortcut, and
 * the four-row staircase later deepens the same job.
 */
const covStepRows = situation({
  situationType: 'combine',
  cognitiveOp: 'count-unequal-rows',
  draw: (r) => {
    const top = r.int(4, 9);
    const under = r.int(2, top - 1);
    const name = one(r);
    return {
      prompt: `${name} colours a shape on squared paper. The top row of it is ${countNoun(top, 'squares')} long, and the row underneath is ${countNoun(under, 'squares')} long. How many squares does the shape cover?`,
      answerValue: String(top + under),
      templateId: 'd_add_v1',
      params: { a: top, b: under },
      units: 'squares',
      hints: [
        'Do the two rows here hold the same number of squares?',
        'Count each row on its own, then put the two counts together.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/** Inverse, kept in the counting register: a covering gives back its row size. */
const covRowSize = situation({
  situationType: 'sharing',
  cognitiveOp: 'row-size-from-covering',
  usesPriorSkill: true,
  draw: (r) => {
    const rows = r.int(3, 6);
    const per = r.int(4, 9);
    const name = one(r);
    return {
      prompt: `${name} has a sheet of ${countNoun(rows * per, 'square stamps')}, printed in ${countNoun(rows, 'equal rows')}. How many stamps are in each row?`,
      answerValue: String(per),
      templateId: 'd_div_v1',
      params: { a: rows * per, b: rows },
      units: 'stamps',
      hints: [
        'If every row is the same length, what has one row got to hold?',
        'Deal the whole covering out into the rows, giving each row an equal share.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * Metacognition base — only ever served through the estimate-first wrapper, so
 * its ladder appears once (kit §E2.2). The probe benchmarks the covering
 * against twenty, which the drawn range straddles, so the prediction is a real
 * call rather than a formality.
 */
const covSlabBase = situation({
  situationType: 'area',
  cognitiveOp: 'area-count',
  draw: (r) => {
    const per = r.int(4, 9);
    const rows = r.int(3, 6);
    const name = one(r);
    return {
      prompt: `${name} unwraps a slab of chocolate scored into squares: ${countNoun(per, 'squares')} across, and ${countNoun(rows, 'rows')} down. How many squares of chocolate is that?`,
      answerValue: String(per * rows),
      templateId: 'd_area_v1',
      params: { l: per, w: rows },
      units: 'squares',
      hints: [
        'Is one row of squares the whole slab, or a part of it?',
        'Skip-count down the slab: say what a row holds, say it again for the next row, and keep going to the bottom.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const covSlabEstimate = withEstimateFirst(
  covSlabBase,
  'will this covering come to more than twenty squares, or fewer?',
);

// ---------------------------------------------------------------------------
// Multi-step. Every operand a chain consumes is stated in its own prompt.
// ---------------------------------------------------------------------------

/** rows × columns, then the squares added on afterwards. */
const msQuiltThenStrip = multiStep({
  situationType: 'combine',
  cognitiveOp: 'area-multi',
  usesPriorSkill: true,
  draw: (r) => {
    const rows = r.int(3, 6);
    const per = r.int(4, 8);
    // The extra must not be one row's worth, or the story reads as another whole
    // row and the two-step collapses. Nudged deterministically (never redrawn:
    // a loop would shift every later draw in the pack).
    let extra = r.int(2, 9);
    if (extra === per) extra = per === 2 ? 3 : per - 1;
    const name = one(r);
    return {
      prompt: `${name} sews a quilt from ${countNoun(rows, 'rows')} of ${countNoun(per, 'square patches')}, then sews ${countNoun(extra, 'patches')} more along one end. How many patches has ${name} used in all?`,
      initN: rows,
      steps: [
        { op: 'mul', n: per, d: 1 },
        { op: 'add', n: extra, d: 1 },
      ],
      units: 'patches',
      hints: [
        'Which part of this quilt is made of matching rows, and which part is not?',
        'Count the matching rows first, and only then add on the few sewn at the end.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/** rows × columns, then the squares something else is sitting on. */
const msTabletopTray = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'area-multi',
  draw: (r) => {
    const rows = r.int(4, 8);
    const per = r.int(3, 7);
    const hidden = r.int(3, Math.min(12, rows * per - 4));
    const name = one(r);
    return {
      prompt: `${name}'s tabletop is tiled with ${countNoun(rows, 'rows')} of ${countNoun(per, 'square tiles')}. A tray is put down on it and hides ${countNoun(hidden, 'tiles')}. How many tiles can still be seen?`,
      initN: rows,
      steps: [
        { op: 'mul', n: per, d: 1 },
        { op: 'sub', n: hidden, d: 1 },
      ],
      units: 'tiles',
      hints: [
        'Does the tray add tiles to the tabletop, or hide some of them?',
        'Count every tile on the top first, then take off the ones underneath the tray.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** Four rows, none of them matching: the covering has to be built one row at a time. */
const msStaircase = multiStep({
  situationType: 'combine',
  cognitiveOp: 'count-unequal-rows',
  draw: (r) => {
    const top = r.int(2, 5);
    const name = one(r);
    return {
      prompt: `${name} draws a staircase shape on squared paper. Its top row is ${countNoun(top, 'squares')} long, the next row is ${countNoun(top + 1, 'squares')} long, the next is ${countNoun(top + 2, 'squares')} long, and the bottom row is ${countNoun(top + 3, 'squares')} long. How many squares does the staircase cover?`,
      initN: top,
      steps: [
        { op: 'add', n: top + 1, d: 1 },
        { op: 'add', n: top + 2, d: 1 },
        { op: 'add', n: top + 3, d: 1 },
      ],
      units: 'squares',
      hints: [
        'Are all four rows of this shape the same length?',
        'Take the rows in order from the top, keeping a running total as you go down.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * Inverse-start (C's F3 ceiling): the stated quantity is the RESULT of the
 * first covering, so the row count has to be recovered before the second
 * covering can be built. Both halves are rows × columns.
 */
const msSameRowsLongerRow = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'rows-then-recount',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const rows = r.int(3, 6);
    const per = r.int(3, 6);
    const wider = per + r.int(2, 3);
    const name = one(r);
    return {
      prompt: `A baking tray holds ${countNoun(rows * per, 'square biscuits')}, set out in rows of ${countNoun(per, 'biscuits')}. ${name} fills a wider tray that has the same number of rows, with ${countNoun(wider, 'biscuits')} in every row. How many biscuits does the wider tray hold?`,
      initN: rows * per,
      steps: [
        { op: 'div', n: per, d: 1 },
        { op: 'mul', n: wider, d: 1 },
      ],
      units: 'biscuits',
      hints: [
        'Do both trays have the same number of rows, and can you work out what that number is?',
        'Split the first tray into its rows to see how many there are, then fill each of those rows to the new length.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the covering against the edge, and the shortcut against its
// own precondition
// ---------------------------------------------------------------------------

/**
 * The recipe's "area count vs side count", kept entirely in squares: the
 * numbers along an edge of a grid against the number inside it. Every option
 * carries its label, so the item also prices the answer that is right about the
 * count and wrong about what was counted.
 */
const discrimCoverOrEdge = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const across = r.int(4, 9);
    const drawn = r.int(3, 6);
    // A square block would print the "one edge" option and the "how many rows"
    // option as the same text, so two choices would be indistinguishable and one
    // of them would be marked against a child who picked the other. Nudged
    // deterministically (never redrawn: a loop would shift every later draw).
    const down = drawn === across ? (drawn > 3 ? drawn - 1 : 4) : drawn;
    const s = r.pick(['locker wall', 'pigeonhole rack', 'display cabinet'] as const);
    const name = one(r);
    return {
      prompt: `${name} looks at a ${s} built from square compartments: ${countNoun(across, 'compartments')} across the top and ${countNoun(down, 'compartments')} down the side. Which number tells how many compartments the whole ${s} holds?`,
      correct: countNoun(across * down, 'compartments'),
      distractors: [
        {
          text: countNoun(across, 'compartments'),
          errorTag: 'task-comprehension',
          rationale: 'Counts the compartments along one edge and stops, leaving every row below the top one uncounted.',
        },
        {
          text: countNoun(across + down, 'compartments'),
          errorTag: 'concept-misconception',
          rationale: 'Counts along the top edge and down the side edge and puts the two together — that measures the edges, not what fills the middle.',
        },
        {
          text: countNoun(down, 'compartments'),
          errorTag: 'representation-misread',
          rationale: 'Reports how many rows there are as though a row were a single compartment.',
        },
      ],
      hints: [
        'Does this question want the squares along one edge, or the squares filling the whole thing?',
        'Point at what is being asked for: a single line of squares, or every square in the block.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The shortcut's precondition, as a choice. The shape's last row is short, so
 * copying ANY row into every row misses — one way over, one way under — and the
 * child has to notice that the rows do not match before choosing a move.
 */
const discrimShortcutSafe = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const full = r.int(4, 8);
    const last = r.int(2, full - 1);
    const name = one(r);
    return {
      prompt: `${name} covers a shape on squared paper. Its first row takes ${countNoun(full, 'squares')}, its second row takes ${countNoun(full, 'squares')}, and its last row takes only ${countNoun(last, 'squares')}. Which move counts the squares that cover this shape?`,
      correct: 'count each row on its own and add the three counts',
      distractors: [
        {
          text: 'multiply the number of rows by the longest row',
          errorTag: 'concept-misconception',
          rationale: 'Copies the longest row into every row, which counts squares the short row never had.',
        },
        {
          text: 'multiply the number of rows by the shortest row',
          errorTag: 'representation-misread',
          rationale: 'Copies the shortest row into every row, and loses the squares the full rows carry.',
        },
      ],
      hints: [
        'Do all the rows of this shape hold the same number of squares?',
        'A move that copies one row is only safe while every row matches it; otherwise the rows have to be taken one at a time.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the VERIFY-LIBRARY NOTE in the file header for why the slip is shown on
// the ROW COUNT: `a_verify_count_slip_v1` computes a counting slip honestly and
// its 'skip-count' mode returns a count that is one short — the partial row
// left out. The plan states its whole covering and its full-row size, so the
// true row count is recoverable and the extension asks what one row was worth.
// ---------------------------------------------------------------------------

const eaShortRowSkipped = errorAnalysis({
  verifyTemplateId: 'a_verify_count_slip_v1',
  cognitiveOp: 'count-rows',
  drawParams: (r) => {
    const rows = r.int(4, 6);
    const per = r.int(4, 7);
    const last = r.int(2, per - 1);
    return { n: rows, slip: 'skip-count', per, last, covered: (rows - 1) * per + last };
  },
  build: (v, p, r) => {
    const per = Number(p.per);
    const last = Number(p.last);
    const covered = Number(p.covered);
    const name = one(r);
    return {
      prompt: `A student checks ${name}'s patio plan on squared paper. The patio covers ${countNoun(covered, 'square slabs')} altogether: every full row holds ${countNoun(per, 'slabs')}, and the last row is a short one holding ${countNoun(last, 'slabs')}. Running a finger down the side of the plan, the student counted the rows and wrote ${countNoun(Number(v.wrong), 'rows')}.`,
      extension: 'Work the rows out for yourself, then write one sentence saying what a single row is worth in a count like this one.',
      hints: [
        'Does a row that is shorter than the others still count as a row?',
        'Take the short row off the total first, and see how many full rows the slabs that are left will make.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: ['rows', 'short row', 'last row', 'squares'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC20 = makeWeekBuilder({
  level: 'C',
  week: 20,
  conceptId: 'area',
  conceptName: 'Area',
  strandTags: ['algebra-geometry', 'multiplication-division'],
  prerequisiteWeeks: [B20, C6, C12],
  pedagogyContract: 'v2',
  conceptualAnchor: 'cover and count',
  conceptFamily: 'operation',
  deepeningDelta:
    'C6 and B20 built equal rows as a way of COUNTING things that were already there. C20 turns that arrangement into a way of MEASURING a surface: the squares are a unit the child supplies, the count of them is the area, and rows × columns is demoted from a rule to a shortcut that is only legal while the rows match. The new load is the unit square itself and the label it forces — a covering is answered in squares, or in square centimeters and square meters.',
  explanation: {
    hook:
      'Two children each draw a shape and argue about which one is bigger. They could argue all afternoon — or they could lay the same little squares over both drawings and count. This week the argument ends with a number.',
    whyBeforeHow:
      'Area is not a formula, it is a count. To measure how much surface something has you cover and count: lay equal squares over it with no gaps and no overlaps, and the number of squares you used IS the area — that is a fair measurement because every square is the same size, so two coverings can be compared by their counts alone. Rows times columns arrives afterwards, and only because a tidy covering repeats itself: if every row holds the same number of squares, counting one row and taking it once for every row lands on exactly the same total as counting the whole lot one at a time. That is why the shortcut is safe on a rectangle and unsafe on a shape whose rows do not match, and why the answer is given in SQUARES — squares are what was counted.',
    script: [
      {
        say: 'Watch me measure this shape without a ruler. I lay squares over it until none of it is showing, and then I count them one at a time — one, two, three, all the way to fifteen. That count is the area. Area is nothing more mysterious than how many squares it takes to cover something.',
        visual: 'A shape covered with unit squares, waiting to be counted.',
        figure: areaGrid(
          { rows: 3, cols: 5 },
          { alt: 'a shape covered with equal squares, 3 rows of 5 squares' },
        ),
      },
      {
        say: 'Counting one square at a time is slow, and halfway down I nearly lost my place. So let me look at what I built: every row holds the same five squares, and there are three rows. Instead of counting fifteen separate squares I can count one row and take it three times. The multiplying is a shortcut for the counting — it is not a different idea.',
        visual: 'The same covering with every row labelled by what it holds.',
        figure: areaGrid(
          { rows: 3, cols: 5, rowLabels: ['5', '5', '5'] },
          { alt: 'the same covering with each of its three rows labelled five' },
        ),
      },
      {
        say: 'The shortcut only holds while the rows match, and here is a shape where they do not: four squares, then four, then a short row of two. If I copy the longest row into all three rows I am counting squares that are not on the paper. With a shape like this I go back to what I did first and take the rows one at a time.',
        visual: 'A shape on squared paper whose bottom row stops early.',
        figure: areaGrid(
          { rows: 3, cols: 4, shaded: 10 },
          { alt: 'a shape on squared paper: two rows of four squares and a short bottom row of two' },
        ),
      },
      {
        say: 'Before I write anything down I check two things. Roughly, about how many squares should this take? If my number comes out wildly bigger than my estimate I have counted something twice. Then the label: each of these squares measures one centimeter along every side, so what I counted is square centimeters, not centimeters. Centimeters would measure a line; I measured a covering.',
        visual: 'One unit square, one centimeter along each side.',
        figure: areaGrid(
          { rows: 1, cols: 1 },
          { alt: 'a single square measuring one centimeter along every side' },
        ),
      },
      {
        say: 'One last surprise. Twelve squares can be laid out as two rows of six, or as three rows of four, or as a stepped shape that is not a rectangle at all. Those shapes look nothing like each other, and every one of them covers exactly twelve squares. The area is the count, not the outline.',
        visual: 'Twelve squares laid out as two rows of six.',
        figure: areaGrid(
          { rows: 2, cols: 6, showCounts: true },
          { alt: 'twelve squares laid out as 2 rows of 6' },
        ),
      },
    ],
    summary:
      'Area is how many equal squares it takes to cover a shape, with no gaps and no overlaps. When every row holds the same amount you can count one row and take it once for every row — that is rows times columns, a shortcut for counting rather than a rule to remember. When the rows do not match, count them one at a time. And always write the label: a covering comes out in squares, or in square centimeters and square meters when the squares are that size.',
    vocabulary: [
      { term: 'area', kidGloss: 'how much surface a shape covers, counted in squares' },
      { term: 'unit square', kidGloss: 'the one square you cover with — every one of them the same size' },
      { term: 'rows and columns', kidGloss: 'the lines a tidy covering falls into: rows go across, columns go down' },
      { term: 'square centimeter', kidGloss: 'a square that measures one centimeter along every side' },
    ],
  },
  guidedExamples: [
    {
      ...ge(20, 1, 'modeled', 'A tray of fudge is cut into 4 rows, with 6 squares in every row. How many squares of fudge is that?', [
        {
          teacherSay:
            'Watch what I do first: I do not reach for a rule, I look for the squares. One row along the top gives me six of them, and I check the rows underneath match it before I trust that six. How many rows have I got to copy it into?',
          expected: '4',
        },
        {
          teacherSay:
            'Now I lay that row down again for every row of the tray, saying the running count out loud as I go — six, twelve, eighteen. Where does the fourth row land me?',
          expected: '24',
          figure: areaGrid(
            { rows: 4, cols: 6, showCounts: true },
            { alt: 'a tray of fudge cut into 4 rows of 6 squares', asserts: { of: 'cells', ...assertsAnswer } },
          ),
        },
        {
          teacherSay:
            'Twenty-four squares of fudge. I say the label as I write it, because the squares are what I counted and the number means nothing without them.',
        },
      ], '24 squares of fudge'),
      visual: 'The tray of fudge, cut into four rows of six squares.',
    },
    {
      ...ge(20, 2, 'completion', 'A luggage label is drawn on centimeter squares: 5 squares across and 3 squares down. How much does the label cover?', [
        { teacherSay: 'Does the label cover the squares on the paper, or only run along their edges?', expected: 'covers them' },
        { childDo: 'Count the squares in the top row, then bring in a row at a time until the label is full.', expected: '15' },
      ], '15 square centimeters'),
      visual: 'The label drawn on centimeter squares, three rows of five.',
      figure: areaGrid(
        { rows: 3, cols: 5, showCounts: true },
        { alt: 'a label drawn on centimeter squares, 3 rows of 5', asserts: { of: 'cells', ...assertsAnswer } },
      ),
    },
    ge(20, 3, 'prompted', 'A noticeboard is filled with square cards: 7 rows, with 4 cards in every row. How many cards cover the board?', [
      { childDo: 'Name what one row holds and how many rows there are, then count the rows up.', expected: '28' },
    ], '28 cards'),
    {
      // Independent stage: ONE row is drawn. Deciding to build the matching rows
      // first and only then bring in the spare slabs IS the task, so a full grid
      // would plan the item for the child.
      ...ge(20, 4, 'independent', 'A path is laid with square slabs: 5 rows with 6 slabs in each row, and then 3 spare slabs at the gate. How many slabs cover the path? Solve cold.', [
        { childDo: 'Build the matching rows first, then deal with the spares.', expected: '33' },
      ], '33 slabs'),
      visual: 'One row of the path, marked into six square slabs. The rest is yours to work out.',
      figure: areaGrid({ rows: 1, cols: 6 }, { alt: 'one row across the path, marked into 6 squares' }),
    },
  ],
  days: [
    // Day 1 — concept echo: cover and count in both registers, and one shape
    // whose rows refuse to match. Single-step throughout.
    [
      { gen: wRows, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: wShare, diff: 2 },
      { gen: covTiles, diff: 2 },
      { gen: covSquareUnits, diff: 3 },
      { gen: covStepRows, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first predict, the first trap,
    // the first two-step, and the inverse that reads a row off a covering.
    [
      { gen: wFacts, diff: 2 },
      { gen: covSlabEstimate, diff: 3 },
      { gen: discrimCoverOrEdge, diff: 3 },
      { gen: msQuiltThenStrip, diff: 4 },
      { gen: covTiles, diff: 3 },
      { gen: covRowSize, diff: 3 },
    ],
    // Day 3 — interleave: the shortcut's precondition beside the covering-vs-edge
    // trap, a two-step, and the staircase that no multiplication reaches.
    [
      { gen: wShare, diff: 2 },
      { gen: discrimShortcutSafe, diff: 4 },
      { gen: discrimCoverOrEdge, diff: 3 },
      { gen: msTabletopTray, diff: 4 },
      { gen: msStaircase, diff: 4 },
      { gen: covSquareUnits, diff: 3 },
    ],
    // Day 4 — word problems: the inverse-start chain beside the two forward
    // chains, the staircase, and the single-step inverse.
    [
      { gen: msSameRowsLongerRow, diff: 5 },
      { gen: msQuiltThenStrip, diff: 4 },
      { gen: msTabletopTray, diff: 4 },
      { gen: msStaircase, diff: 4 },
      { gen: covRowSize, diff: 4 },
    ],
    // Day 5 — non-computational: the error-analysis, the same-count-different-
    // shape production, and the claim that generalises it (+ a ramped warm-up).
    [
      { gen: wAdd, diff: 2 },
      { gen: eaShortRowSkipped, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Draw two shapes on squared paper that each cover exactly 12 squares. Make one of them a rectangle, and make the other one a shape that is not a rectangle. Then write one sentence saying how you know that both of your shapes cover the same amount.',
          value:
            'both shapes cover 12 squares, because each one is built from 12 whole squares however differently they are arranged',
          acceptableForms: ['12', '12 squares', 'same amount', 'count the squares', 'different shapes'],
          keywords: true,
          hints: [
            'Which shapes can be built out of whole squares?',
            'Count the squares in each of your drawings, then hold the two counts side by side.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: two shapes that cover the same number of squares must be the same shape. Say in one sentence how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Ties the covering to the outline: a long thin shape and a fat one can hold exactly the same squares.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Rules out the plain case where the two shapes really are alike, and two matching shapes do cover the same squares.',
            },
          ],
          hints: [
            'Could you build two shapes that look nothing alike out of the same handful of squares?',
            'Lay twelve squares out as a long strip, then as a fat block, and count both.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
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
    'For grown-ups: area is a count of squares before it is anything else, and multiplying is only the fast way to do that count. If your child multiplies a shape whose rows are not all the same length, do not correct the number — hand them squared paper and ask them to count it. The counting settles it, and it is what the multiplying stands for. Worth trying at home: the same twelve squares pushed into two or three different shapes, all still twelve.',
  ],
  puzzle: (r) => {
    const across = r.int(5, 8);
    const rows = r.int(4, 6);
    const missing = r.int(2, across - 2);
    const last = across - missing;
    const total = (rows - 1) * across + last;
    const name = one(r);
    return {
      id: 'C20-PZ-01',
      title: 'Puzzle Grove: Two Ways to Split It',
      puzzleType: 'construction',
      prompt: `Draw this shape on squared paper: ${countNoun(rows - 1, 'rows')} of ${countNoun(across, 'squares')}, and then a bottom row that holds only ${countNoun(last, 'squares')}. ${name} says a shape like this can be cut into two rectangles. Find one way to cut it, work out the squares in each rectangle, and add them. Then find a DIFFERENT cut and work it out again. How many squares does the shape cover, and what happens to that total when you cut it the other way?`,
      answer: {
        value: `${total} squares, and both cuts give the same total`,
        acceptableForms: [String(total), `${total} squares`, 'the same total either way'],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Where could one straight cut leave you with two rectangles?',
        'One cut runs straight across under the matching rows; another runs straight down the edge where the bottom row stops short.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Multiplication facts — the shortcut that stands in for counting every square',
    sourceWeek: C12,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: covTiles, diff: 3 },
    { gen: msQuiltThenStrip, diff: 4 },
    { gen: covSquareUnits, diff: 3 },
    { gen: msTabletopTray, diff: 4 },
    { gen: covRowSize, diff: 3 },
    { gen: msSameRowsLongerRow, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the three single-step forms the week teaches — a covering counted in real squares (with its one-row figure preserved), a covering measured in square centimeters or square meters from two stated lengths, and the inverse that reads a row size off a whole covering. 02/04: the two forward chains, rows × columns then a strip added, and rows × columns then a tray subtracted. 06: the inverse-start chain, where the row count has to be recovered from the first covering before the second one can be built. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'edge-for-covering',
      description: 'Answers a covering question with the squares along an edge — one row, or the two edges put together — instead of the squares filling the shape.',
      exampleWrongAnswer: 'a 7-across by 4-down block of compartments answered as 11 compartments',
      distractorRationale: 'Offer the sum of the two stated edges, and the single edge on its own.',
      reteachPointer: 'explanation/script[0] (the whole surface covered and counted)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'shortcut-on-unequal-rows',
      description: 'Copies one row into every row of a shape whose rows are not all the same length, so the count comes out over or under by whole squares.',
      exampleWrongAnswer: 'rows of 5, 5 and 2 answered as 15 squares',
      distractorRationale: 'Offer the number of rows multiplied by the longest row, and by the shortest row.',
      reteachPointer: 'explanation/script[2] (the shape whose bottom row stops early)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-one-row',
      description: 'Answers with what a single row holds, or reports the rows and leaves out the squares a two-step story adds on at the end.',
      exampleWrongAnswer: 'a covering of 6 rows of 4 answered as 4',
      distractorRationale: 'Offer the size of one row on covering-choice items.',
      reteachPointer: 'guidedExamples/C20-GE-01 (every row copied, not only the first)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'row-lost',
      description: 'Chooses the right move but loses a row while counting down the side, so the covering comes out one whole row short.',
      exampleWrongAnswer: 'a covering of 5 rows of 6 answered as 24',
      distractorRationale: 'Offer the covering with one row left out of the count.',
      reteachPointer: 'guidedExamples/C20-GE-02 (say the running total once per row), then the 2-minute multiplication sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Area as a count of squares — covering a shape with equal squares and counting them, finding that rows times columns is the fast way to do that same count whenever the rows match, counting row by row when they do not, and labelling the answer in squares, square centimeters or square meters.',
    improvingCandidates: [
      'covering a shape with equal squares before reaching for any number',
      'checking that every row holds the same amount before taking the shortcut',
      'writing the label — a covering is answered in squares, never in plain centimeters',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping the squares inside a shape apart from the squares along its edge',
      },
      {
        errorTag: 'representation-misread',
        text: 'noticing when the rows do not match, so the counting shortcut is put away',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering for the whole covering rather than for one row of it',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted one row and checked that the others matched it before you used the shortcut — that is exactly the move that keeps a covering honest.',
      questionForChild: 'How many square tiles would it take to cover our chopping board — and how could you find out without counting every single one?',
      schoolSyncHook: 'If your child\'s class writes area as length × width rather than rows × columns, tell us and we will use their wording.',
    },
    vocabularyForParent: [
      'area (how much surface a shape covers, counted in squares)',
      'unit square (the equal square everything is covered with)',
      'square centimeter / square meter (the label an area answer carries)',
    ],
  },
});
