/**
 * Level B · Week 20 — "Arrays & repeated addition" (conceptId: arrays-repeated-addition).
 *
 * FILL-ARCHITECTURE §4 row B20: anchor "rows of the same size"; multi-step
 * "array + extras"; error-analysis "counts one row for the total";
 * discrimination "3 rows of 4 vs 4 rows of 3 — same total?"; Day-5 signature
 * "build all the arrays for 12 (set answer)".
 *
 * WHAT THIS WEEK IS FOR. It builds the ARRAY and the count that reads it, and it
 * stops one step short of the notation:
 *   1. an array is rows of the same size — and the equality of the rows is what
 *      makes any shortcut legal at all. Ragged rows are the whole reason the
 *      check comes first;
 *   2. the total is reached by adding the ROW SIZE once for every row. That is
 *      repeated addition, and B18's skip count is the fast way to run it;
 *   3. one row is not the array. This is the week's own slip and it gets a page
 *      of its own on Day 5;
 *   4. turning an array round leaves its total alone. Three rows of four and
 *      four rows of three land on the same number, which the child DISCOVERS
 *      here rather than being told.
 *
 * NO × SYMBOL ANYWHERE, and no `showCounts` on any figure. C6 ("Meeting
 * multiplication") owns the symbol and cites this week as its prior skill, so
 * B20 hands C6 the structure and none of the notation. Two internal exceptions,
 * both invisible to the child: the two chains carry an `{op:'mul'}` step, and the
 * single-step items name the registered template `d_mul_v1`. Those are the
 * library's only way to say "this row again, once per row", and they are what
 * make every answer code-computed rather than authored. No child-facing string in
 * this pack contains a `×`, and every prompt states the move as rows and adding.
 *
 * VERIFY-LIBRARY LIMIT AND HOW IT WAS CLOSED (kit §E2.3, the "look for an
 * algebraic identity first" branch). The recipe's error is a student who counts
 * ONE ROW and calls it the total, so the shown wrong number must be the ROW SIZE
 * while the truth is the whole array. No registered transform returns an operand
 * unchanged — until the operands are chosen so that it does. With `rows = 2 ×
 * cols`, subtracting the two stated numbers gives `rows − cols = cols`: exactly
 * the size of one row, code-derived by `d_verify_binop_misconception_v1` with
 * `{op:'*', wrongOp:'-'}`. So `correct` is the real total and `wrong` is the real
 * row size, neither fabricated, and the recipe's own item survives intact. The
 * price is a narrow operand pool (three tall arrays: 4 rows of 2, 6 rows of 3, 8
 * rows of 4), which costs nothing here — a pack carries exactly one
 * error-analysis item, and a wall of letterboxes in a block of flats is taller
 * than it is wide anyway. The `wrongOp` in the params is the DERIVATION, not the
 * diagnosis: the diagnosis lives in the mistakeBank ("reports one row as the
 * whole array") and is what the child has to supply.
 *
 * CONCEPT FAMILY: `'operation'`, the full row (≥2 multi-step week-wide, four
 * multi-step items in all). The recipe hands this week its own two-step and the
 * array makes two genuinely different ones available — see below.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Every figure on an assessed item
 * draws ONE ROW and asserts its length against the item's own param. That is the
 * given the prose already states, and it is deliberately NOT the array: a full
 * grid drawn beside "how many in all?" can be counted cell by cell, which is the
 * slow one-at-a-time count this week exists to replace. `areaGrid` draws the
 * whole array only where the answer is already on the page — the lesson script
 * and the modeled/completion guided examples. `showCounts` is never used: it
 * prints the row and column counts, which the prose has already handed over, and
 * at this level a bare pair of dimensions beside a grid reads as notation.
 *   The two discriminations and the size prediction carry NO picture on purpose.
 * Two arrays drawn side by side answer "do they hold the same number?" by
 * letting the child count both, and a drawn array answers "will it pass twenty?"
 * before the prediction is made.
 *
 * THE DEGENERATE CASE. A 2-by-2 array is the one shape where rows + row size and
 * rows-of-row-size agree, so a child who joins the two numbers instead of
 * counting the rows still lands on four and no item can see it. C6 hit this
 * exactly. Here `wallOfLetterboxes` is the only generator whose ranges can reach
 * it, and it is nudged DETERMINISTICALLY (one step, never a redraw loop — kit
 * §E2.4, which would shift every later draw in the pack). Every other generator
 * has a floor of three on one side, so the case cannot be drawn at all.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): prompt sentences ≤15
 * words; `array`, `row`, `row size` and `repeated addition` glossed in
 * `explanation.vocabulary` before any item leans on them; metacognition in its
 * intro form — the B row's own "will it pass …?" prediction, drawn over a roof
 * whose panel count genuinely lands on both sides of twenty; error-analysis
 * written-lite, one sentence; the sprint ungraded and self-referenced.
 *
 * FRAMES, re-checked against the weeks directory at the END of the build (kit
 * §E2.8), not at the start. Every scene here was scanned across all 62 authored
 * weeks and appears in none of them: a wall of letterboxes in a block of flats,
 * rows in a school photo, solar panels on a barn roof, the hollows of an
 * ice-cube tray, deckchairs on the seafront, rows of knitted stitches. The scan
 * earned its keep three times:
 *   - c20 already unwraps a slab of chocolate "scored into squares, so many
 *     across and so many rows down", which is this week's anchor in another
 *     wrapper. The chocolate bar was the first draft of the anchor page;
 *   - c06 lays a path with rows of tiles and plants seedlings in rows, so tiling
 *     and garden rows are both spoken for — the second multi-step was a row of
 *     radishes before it became a row of knitting;
 *   - c06's puzzle already lays 12 STICKERS out in every equal arrangement and
 *     names each one "R rows of C". So the Day-5 production drops stickers
 *     entirely and asks for something else: the REPEATED ADDITIONS for twelve
 *     buttons, which is the array named the way this week names it. The buttons
 *     are the ones the lesson script builds with, so Day 5 reaches back to the
 *     board rather than opening a scene of its own.
 * Buttons and blocks appear as generic classroom manipulatives, which the corpus
 * uses everywhere and which carry no scene of their own. ONE DISCLOSED NEAR-MISS:
 * c05 has a car park and so does the puzzle here. c05's is a container cars drive
 * into and out of across a morning; this one is a grid of painted spaces that
 * gains a row. Same noun, different frame — kept deliberately, and flagged here
 * rather than buried.
 *
 * The scan was run a second time after b19 landed mid-build, which is exactly the
 * case §E2.8 describes. It found two collisions a word-boundary grep had missed:
 * crayons (c06's own trap scene, plus six other weeks) and pressed leaves on a
 * nature table (b16). The B13 warm-up now counts felt tips and the B15 warm-up
 * saved bottle caps, neither of which appears anywhere else. b19 itself is clear
 * of this week: it works with peaches, radishes, forks, flowers, hazelnuts,
 * whistles, canoes and matchboxes.
 *
 * Retrieval is backward-only into B18 (a fives count — the fast way to run a
 * repeated addition), B13 (addition within 100, the arithmetic every row after
 * the first one is), B10 (counting on whole tens, adding the same amount again)
 * and B15 ("how many more", which the same-total discovery leans on).
 */

import { asWarmup, classify } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { drawUniqueItem } from '../lib/guard';
import { countNoun, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B10 = { level: 'B' as const, week: 10 };
const B13 = { level: 'B' as const, week: 13 };
const B15 = { level: 'B' as const, week: 15 };
const B18 = { level: 'B' as const, week: 18 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/**
 * Two DIFFERENT drawn names, in a fixed number of draws.
 *
 * The offset is computed rather than re-picked: a "pick again until they differ"
 * loop consumes a variable number of draws and every later item in the pack
 * would depend on how long it ran (kit §E2.4).
 */
function two(r: Rng): [string, string] {
  const i = r.int(0, NAMES.length - 1);
  const j = (i + 1 + r.int(0, NAMES.length - 2)) % NAMES.length;
  return [NAMES[i], NAMES[j]];
}

// ---------------------------------------------------------------------------
// withFigure — a picture built from the item's OWN generator params
//
// The shipped primitives (`situation` / `multiStep`) carry no figure slot and
// lib/ is not ours to edit, so this does what `withEstimateFirst` does: all the
// work happens inside the returned closure, no new rng draw is taken, and the
// prompt is untouched (so the QG-1/QG-4 surface signature the guard already
// registered is unchanged). It rebuilds from the drafted item's
// `generator.params` — the very numbers its answer was computed from — which is
// what makes a contradicting picture unbuildable rather than merely unlikely.
// (Pattern established by c06 and reused by every A/B/C week since.)
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

// ---------------------------------------------------------------------------
// The anchor, drawn — ONE row, and its length asserted
// ---------------------------------------------------------------------------

/** "one row of 5 letterboxes" — the accessible name and the prompt's image tag. */
const oneRowAlt = (n: number, noun: string): string => `one row of ${countNoun(n, noun)}`;

/**
 * A single row of the array, and nothing else.
 *
 * The grid is one row deep, so the only quantity the picture can be asked for is
 * the row length — which the prose states in the same breath. The rest of the
 * array is what the child builds, and it is never drawn on a page that asks for
 * the total.
 */
const oneRow = (n: number, noun: string, key: string): BBFigure =>
  areaGrid({ rows: 1, cols: n }, { alt: oneRowAlt(n, noun), asserts: assertsParam(key, 'cells') });

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B18 — a fives count, which is the quick way to run a repeated addition.
 *
 * Set on gloves rather than on a number line or a row of objects: b18 owns the
 * hopping grasshopper and the counted pairs, and a row of equal things is this
 * week's own content rather than a warm-up (kit §E2.8).
 */
const wFivesCount = asWarmup(
  situation({
    situationType: 'rate',
    cognitiveOp: 'count-in-fives',
    draw: (r) => {
      const gloves = r.int(3, 9);
      const name = one(r);
      return {
        prompt: `${name} finds ${countNoun(gloves, 'gloves')} in the lost property box. Each glove has ${countNoun(5, 'fingers')}. How many fingers is that in all?`,
        answerValue: String(5 * gloves),
        templateId: 'd_multiple_v1',
        params: { base: 5, k: gloves },
        units: 'fingers',
        hints: [
          'Which count moves along this pile in equal jumps?',
          'Take five for each one, and keep the ones you have done on your fingers.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B18,
);

/**
 * B13 — two-digit addition, the arithmetic every row after the first one is.
 *
 * NOT a container someone tips more into: b18 tips satsumas into a crate and b19
 * tips radishes into one, so a third week doing it would read as the same page
 * written three times (kit §E2.8). Here the new amount ARRIVES, in a packet, and
 * the felt tips belong to no other week in the corpus.
 */
const wPacketArrives = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-within-100',
    draw: (r) => {
      const held = 10 * r.int(2, 5) + r.int(3, 9);
      const arriving = 10 * r.int(1, 3) + r.int(3, 9);
      const name = one(r);
      return {
        prompt: `${name} counts ${countNoun(held, 'felt tips')} in the art room jar. A new packet of ${countNoun(arriving, 'felt tips')} arrives. How many felt tips are there now?`,
        answerValue: String(held + arriving),
        templateId: 'retr_add_within_100_v1',
        params: { a: held, b: arriving },
        units: 'felt tips',
        hints: [
          'Does the number in the jar grow or shrink when a packet arrives?',
          'Add the tens first, then the ones. Trade a whole ten if you make one.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B13,
);

/**
 * B10 — counting on three whole tens, which is adding the same amount again
 * three times over. No scene at all: it is a move on the number itself, and the
 * week has enough rows in it already.
 */
const wThreeTensOn = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add-tens',
    draw: (r) => {
      const start = 10 * r.int(1, 5) + r.int(2, 8);
      const name = one(r);
      return {
        prompt: `${name} starts at ${start} and counts on three whole tens. Which number does ${name} land on?`,
        answerValue: String(start + 30),
        templateId: 'retr_count_by_tens_v1',
        params: { start },
        hints: [
          'Which part of a number changes when whole tens are added?',
          'Move on one whole ten at a time. Leave the loose ones exactly as they are.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B10,
);

/** B15 — "how many more", the comparison the same-total discovery leans on. */
const wHowManyMore = asWarmup(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare-difference',
    draw: (r) => {
      const more = r.int(14, 28);
      const fewer = r.int(4, 12);
      const [first, second] = two(r);
      return {
        prompt: `${first} has saved ${countNoun(more, 'bottle caps')}. ${second} has saved ${countNoun(fewer, 'bottle caps')}. How many more has ${first} saved?`,
        answerValue: String(more - fewer),
        templateId: 'retr_word_sub_v1',
        params: { a: more, b: fewer },
        units: 'bottle caps',
        hints: [
          'Who has saved more, and are you asked how many MORE?',
          'Line the two piles up in your head and count the gap between them.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B15,
);

// ---------------------------------------------------------------------------
// Single-step core — the array in three different kinds of story, so the pages
// differ by what the rows are DOING and not by the noun on the page
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR: an array as an arrangement, and the total it holds.
 *
 * A block of flats is the one scene where a tall narrow array is the natural
 * shape, which is also why the Day-5 error-analysis lives here.
 *
 * The 2-by-2 nudge is the week's degenerate guard: it is the single shape where
 * joining the two numbers and counting the rows agree, so a child adding instead
 * of building would pass. One deterministic step, never a redraw (kit §E2.4).
 */
const wallOfLetterboxes = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'array-total',
    draw: (r) => {
      const rows = r.int(2, 6);
      let perRow = r.int(2, 5);
      if (rows === 2 && perRow === 2) perRow = 3;
      const name = one(r);
      return {
        prompt: `[image: ${oneRowAlt(perRow, 'letterboxes')}] ${name} lives in a block of flats. Its letterboxes go up in ${countNoun(rows, 'rows')}. Every row holds ${countNoun(perRow, 'letterboxes')}. How many letterboxes are there in all?`,
        answerValue: String(rows * perRow),
        templateId: 'd_mul_v1',
        params: { a: perRow, b: rows, noun: 'letterboxes' },
        units: 'letterboxes',
        hints: [
          'Are all the rows here the same length?',
          'Say the row size once for every row. Hold a finger on each row you finish.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  (p) => oneRow(numOf(p, 'a'), strOf(p, 'noun'), 'a'),
);

/**
 * The rows as a RATE: every row of the photo holds the same number of children,
 * so the row is the unit and the class is the total. No picture — children are
 * not a drawable noun, and a row of counters standing in for a row of people is
 * a small lie at a band that is read to.
 */
const rowsInThePhoto = situation({
  situationType: 'rate',
  cognitiveOp: 'row-repeat',
  draw: (r) => {
    const rows = r.int(2, 4);
    const perRow = r.int(3, 8);
    const name = one(r);
    return {
      prompt: `${name}'s class lines up for the school photo. They stand in ${countNoun(rows, 'rows')}. Every row has ${countNoun(perRow, 'children')} in it. How many children are in the photo?`,
      answerValue: String(rows * perRow),
      templateId: 'd_mul_v1',
      params: { a: perRow, b: rows },
      units: 'children',
      hints: [
        'Which number here tells you what a single row holds?',
        'Add that same number again for every row, and stop at the back row.',
      ],
      errorTags: ['task-comprehension', 'fact-recall'],
    };
  },
});

/** The array as a COMBINE: equal rows of panels gathered into one roof. */
const panelsOnTheBarn = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'count-by-rows',
    draw: (r) => {
      const rows = r.int(2, 6);
      const perRow = r.int(3, 8);
      const name = one(r);
      return {
        prompt: `[image: ${oneRowAlt(perRow, 'panels')}] ${name} counts the solar panels on the barn roof. They sit in ${countNoun(rows, 'rows')} of ${countNoun(perRow, 'panels')}. How many panels are on the roof?`,
        answerValue: String(rows * perRow),
        templateId: 'd_mul_v1',
        params: { a: perRow, b: rows, noun: 'panels' },
        units: 'panels',
        hints: [
          'Would counting one row on its own answer this question?',
          'Build the total row by row, and keep the running number in your head.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => oneRow(numOf(p, 'a'), strOf(p, 'noun'), 'a'),
);

/**
 * The array as a PART-WHOLE: the tray's whole is made of its equal rows. Kept
 * small, because an ice-cube tray is small — the honest ceiling on a scene is
 * part of the content.
 */
const trayOfHollows = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'array-total',
    draw: (r) => {
      const rows = r.int(2, 4);
      const perRow = r.int(3, 6);
      const name = one(r);
      return {
        prompt: `[image: ${oneRowAlt(perRow, 'hollows')}] ${name} fills an ice-cube tray at the sink. It has ${countNoun(rows, 'rows')}, and every row holds ${countNoun(perRow, 'hollows')}. How many ice cubes will the tray make?`,
        answerValue: String(rows * perRow),
        templateId: 'd_mul_v1',
        params: { a: perRow, b: rows, noun: 'hollows' },
        units: 'ice cubes',
        hints: [
          'How much does one row add to the whole tray?',
          'Add the row size once for each row, and read off where you finish.',
        ],
        errorTags: ['representation-misread', 'fact-recall'],
      };
    },
  }),
  (p) => oneRow(numOf(p, 'a'), strOf(p, 'noun'), 'a'),
);

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form ("will it pass …?"), before any working
//
// The barn roof is the one scene here whose panel count genuinely lands on both
// sides of twenty: two rows of three is nowhere near it and six rows of eight is
// far past it, so the child has to weigh the row length AGAINST the number of
// rows before picking up a pencil. That weighing is the habit; a wrong guess
// costs nothing.
//
// The base is served ONLY through the wrapper (kit §E2.2): a generator used both
// raw and wrapped ships two identical hint ladders, which spends two of the three
// the dedup allows on one idea. No figure, for the obvious reason — a drawn roof
// beside "will it pass twenty?" has answered the question.
// ---------------------------------------------------------------------------

const predictThePanels = withEstimateFirst(
  panelsOnTheBarn,
  'will this roof hold more than twenty panels?',
);

// ---------------------------------------------------------------------------
// Discriminations
//
// TURNED ARRAY (the §4 row): three rows of four beside four rows of three. This
// is a DISCOVERY, not a rule to be stated, so the item asks the child to decide
// and the Day-5 claim never turns it into a law — the two arrangements really do
// hold the same number, and the reason is that nothing moved.
//
// EQUAL ROWS: the anchor's own contrast. One arrangement has rows of the same
// size and one has a short row at the end, and only the first can be totalled by
// adding one number again and again. Without this page "rows" quietly becomes the
// whole idea and "the same size" drops out of it.
//
// Neither carries a picture: two arrays drawn side by side let the child count
// them instead of reasoning about them.
// ---------------------------------------------------------------------------

const turnedArraySameTotal = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const rows = r.int(2, 6);
    // A different row length, so the two arrangements are genuinely two
    // arrangements. Computed, not re-drawn (kit §E2.4).
    let perRow = r.int(2, 6);
    if (perRow === rows) perRow = rows === 6 ? 3 : rows + 1;
    // HALF the draws are NOT a transpose. Without this the second arrangement
    // was always a×b against b×a, so "they have the same number" was correct on
    // every exposure in every seed — including a mastery slot. A child could
    // pass the weekly check having learned "answer 'the same'", which is worse
    // than a wrong answer because the maths, the distractors and every gate all
    // look right. Found by the style gate, not by any deterministic check.
    const transposed = r.int(0, 1) === 1;
    const secondRows = transposed ? perRow : Math.max(2, perRow - 1);
    const secondPer = rows;
    const firstTotal = rows * perRow;
    const secondTotal = secondRows * secondPer;
    const [first, second] = two(r);
    const correct = firstTotal === secondTotal
      ? 'they have the same number'
      : firstTotal > secondTotal
        ? `${first} has more`
        : `${second} has more`;
    return {
      prompt: `${first} lays out ${countNoun(rows, 'rows')} of ${countNoun(perRow, 'blocks')}. ${second} lays out ${countNoun(secondRows, 'rows')} of ${countNoun(secondPer, 'blocks')}. Who has more blocks?`,
      correct,
      // Built from whichever answers are NOT correct, so no option can ever
      // duplicate the keyed one now that the comparison genuinely varies.
      distractors: (
        [
          {
            text: 'they have the same number',
            errorTag: 'concept-misconception' as const,
            rationale: 'Reads two arrangements built from the same pair of numbers as equal without totalling either.',
          },
          {
            text: `${first} has more`,
            errorTag: 'concept-misconception' as const,
            rationale: 'Reads the arrangement with more rows as the bigger one, without weighing how long its rows are.',
          },
          {
            text: `${second} has more`,
            errorTag: 'representation-misread' as const,
            rationale: 'Reads two arrangements that look different as two different amounts, without totalling either.',
          },
        ] as const
      )
        .filter((d) => d.text !== correct)
        .map((d) => ({ ...d })),
      hints: [
        'Does an arrangement with more rows always hold more blocks?',
        'Total each one row by row, then hold the two totals side by side.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const whichRowsAreEqual = discrimination({
  variant: 'structural',
  cognitiveOp: 'spot-equal-rows',
  draw: (r) => {
    const rows = r.int(3, 4);
    const perRow = r.int(4, 8);
    // Every row full except the last, which is one short — read out the way a
    // teacher would read it, with the last row named separately.
    const ragged = `${Array.from({ length: rows - 1 }, () => String(perRow)).join(', ')} and ${perRow - 1}`;
    const [first, second] = two(r);
    return {
      prompt: `${first}'s class stands in ${countNoun(rows, 'rows')} for the photo. Every row has ${countNoun(perRow, 'children')} in it. ${second}'s class stands in ${countNoun(rows, 'rows')} too. Their rows hold ${ragged}. Only one class can be counted by adding the same number every time. Which class is it?`,
      correct: `${first}'s class`,
      distractors: [
        {
          text: `${second}'s class`,
          errorTag: 'concept-misconception' as const,
          rationale: 'Treats any set of rows as an array, so the short row at the end goes unnoticed.',
        },
        {
          text: 'both classes',
          errorTag: 'representation-misread' as const,
          rationale: 'Reads "in rows" as the whole condition and drops the part about the rows matching.',
        },
      ],
      hints: [
        'Are the rows in both of these the same length?',
        'Read along each set of rows in turn, and check whether any row is short.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — the array, then one more move
//
// Both chains are two things a child does in that order, and `stepCount` is read
// off the chain rather than claimed. What differs is what the second move is
// ABOUT, and the pair is chosen so that the boundary between "a row" and "not a
// row" gets drawn from both sides:
//   - the UNFINISHED ROW adds fewer than a row's worth, so the extras can never
//     be mistaken for another row;
//   - the ROW ADDED adds exactly a row's worth, which is the same arithmetic and
//     a completely different story. A child who has only met one of these has
//     learnt a scene rather than a method.
// ---------------------------------------------------------------------------

/** The recipe's own two-step: full rows, then the row that is not finished. */
const msUnfinishedRow = withFigure(
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const perRow = r.int(4, 8);
      const rows = r.int(2, 5);
      // Strictly below a row's worth, so the last row is genuinely unfinished.
      const extra = r.int(1, perRow - 1);
      const name = one(r);
      return {
        prompt: `[image: ${oneRowAlt(perRow, 'deckchairs')}] ${name} sets out deckchairs on the seafront. There are ${countNoun(rows, 'full rows')} of ${countNoun(perRow, 'deckchairs')}. The next row has ${countNoun(extra, 'deckchairs')} in it. How many deckchairs are out?`,
        initN: perRow,
        steps: [
          { op: 'mul', n: rows, d: 1 },
          { op: 'add', n: extra, d: 1 },
        ],
        units: 'deckchairs',
        hints: [
          'Which rows here are full, and which one is not?',
          'Total the full rows first, then bring in the few in the unfinished row.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => oneRow(numOf(p, 'initN'), 'deckchairs', 'initN'),
);

/**
 * The same two moves where the second one is a WHOLE row.
 *
 * Knitting is the scene that makes it obvious: one more row of the same length
 * adds the row size once more, which is repeated addition doing the only thing
 * it does. A child may see that straight off and count the rows differently —
 * that is insight, not a slip, and it lands on the same number.
 */
const msRowAdded = withFigure(
  multiStep({
    situationType: 'combine',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const perRow = r.int(5, 9);
      const rows = r.int(2, 5);
      const name = one(r);
      return {
        prompt: `[image: ${oneRowAlt(perRow, 'stitches')}] ${name} is knitting a scarf. There are ${countNoun(rows, 'rows')} on the needle, with ${countNoun(perRow, 'stitches')} in each row. ${name} knits one more full row. How many stitches is that in all?`,
        initN: perRow,
        steps: [
          { op: 'mul', n: rows, d: 1 },
          { op: 'add', n: perRow, d: 1 },
        ],
        units: 'stitches',
        hints: [
          'What does one more row of the same length add?',
          'Total the rows on the needle first, then add one more row on the end.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => oneRow(numOf(p, 'initN'), 'stitches', 'initN'),
);

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header for the derivation. The row size the student reports is
// `rows − cols`, which IS the row size because the wall is drawn twice as tall as
// it is wide, so the shown number is a real transform output and the true total
// is code-computed from the same two params. Nothing is fabricated and the
// recipe's intended item is untouched.
//
// The prompt shows the claim and stops: naming the slip would BE the answer.
// ---------------------------------------------------------------------------

const eaOneRowAsTheWhole = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const perRow = r.int(2, 4);
    return { a: 2 * perRow, b: perRow, op: '*', wrongOp: '-' };
  },
  build: (v, p, r) => {
    const rows = Number(p.a);
    const perRow = Number(p.b);
    const name = one(r);
    return {
      prompt: `${name} looks at the wall of letterboxes in a new block of flats. They stand in ${countNoun(rows, 'rows')}, and every row holds ${countNoun(perRow, 'letterboxes')}. ${name} writes that the wall has ${v.wrong} letterboxes.`,
      extension: `Write how many letterboxes the wall really holds. Then write one sentence to ${name} about what a single row shows.`,
      hints: [
        'Does one row hold the whole wall, or only part of it?',
        'Take the row that was counted. Then work down the wall, row by row.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
      answerKeywords: [
        'one row is only part of the wall',
        'every row has to be added',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 production — every array for twelve (§4 signature: a SET answer)
//
// Authored rather than drawn, and fixed on twelve: the child has to argue that
// the list is complete, and a completeness argument is only worth having if every
// learner is arguing about the same list (b18's Day-5 made the same call).
//
// Answered as a `set` and not as keywords. The task is EVERY arrangement, and a
// keyword check marks a child correct for finding one of them — which is exactly
// the half-finished search the item exists to push past. `reasoning()` fixes its
// own validation, so the draft is assembled here through the same
// `drawUniqueItem` primitive every other item goes through.
//
// Each arrangement is named by its REPEATED ADDITION, which is this week's own
// language and keeps the page clear of c06's "rows of" list. The constraint is
// stated exactly (kit §E2.7): at least two rows, and at least two in every row.
// Without it "twelve in one row" and "twelve rows of one" are defensible answers
// and the set has no single membership.
// ---------------------------------------------------------------------------

/** The four arrangements of twelve, as the additions the child writes. */
const TWELVE_WAYS = ['6 + 6', '4 + 4 + 4', '3 + 3 + 3 + 3', '2 + 2 + 2 + 2 + 2 + 2'] as const;

const everyArrayOfTwelve: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, () => ({
    type: 'reasoning',
    prompt:
      'Twelve buttons are tipped onto the table. They have to be laid out in equal rows. Every row must hold at least two, and there must be at least two rows. Write the repeated addition for EVERY array that works. Then say how you know that none is missing.',
    answer: {
      value: TWELVE_WAYS.join('; '),
      acceptableForms: [
        TWELVE_WAYS.join(', '),
        '2 rows of 6; 3 rows of 4; 4 rows of 3; 6 rows of 2',
        '2 rows of 6, 3 rows of 4, 4 rows of 3, 6 rows of 2',
      ],
      validation: 'set' as const,
    },
    difficulty,
    strand: 'noncomputational' as const,
    isRetrieval: false,
    hintLadder: [
      'How could you be sure that no array is missing from your list?',
      'Try two in a row, then three, then four. Keep the ones that come out even.',
    ],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }));

/**
 * The claim that separates the NUMBER of rows from the TOTAL — the confusion the
 * whole week is built against, and the honest answer is the middle one. A tall
 * thin array can hold less than a short wide one, so "more rows means more" is
 * true only while the rows are the same length.
 */
const asnMoreRowsMoreThings = classify({
  prompt:
    'Always, sometimes, or never true? An array with more rows holds more things. Write one sentence saying how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Counts rows and ignores how long they are, so a tall thin array is always read as the bigger one.',
    },
    {
      text: 'never',
      errorTag: 'representation-misread',
      rationale: 'Rules out the arrays where extra rows really do add more, which is every pair with rows of the same length.',
    },
  ],
  hints: [
    'Could you build a tall arrangement that holds fewer than a short one?',
    'Draw a tall narrow arrangement beside a short wide one, then total them both.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB20 = makeWeekBuilder({
  level: 'B',
  week: 20,
  conceptId: 'arrays-repeated-addition',
  conceptName: 'Arrays & repeated addition',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [B10, B13, B15, B18],
  pedagogyContract: 'v2',
  conceptualAnchor: 'rows of the same size',
  conceptFamily: 'operation',
  deepeningDelta:
    'B18 taught a count of equal hops and left the equal groups wherever they happened to lie — a shore of starfish, a drawer of pairs, a stall of cards. B20 tidies them into an ARRAY, and the tidying is the new mathematics: once the things stand in rows of the same size, the row is a unit you can see, the number of rows is a second thing you can see, and the total follows from adding one of them once for each of the other. Two consequences B18 could not reach come with it. A row can now be mistaken for the whole, which is a slip a scattered pile never invited, and an array can be TURNED, which is why three rows of four and four rows of three are the same twelve things looked at twice. C6 takes this structure and gives it the symbol.',
  explanation: {
    hook:
      'A big pile is slow to count. Lined up in equal rows, it almost counts itself.',
    whyBeforeHow:
      'Counting a pile one at a time is slow. It is easy to lose your place. An array tidies the pile into rows of the same size. Because every row holds the same number, you can add it once for each row. That is repeated addition, and it is safe only while the rows match. If one row were short, adding the same number would tell you a lie. So the first check in an array is that the rows are equal. Then you add the row size once for every row. The total arrives quickly. One row on its own is never the answer. It is one row out of several.',
    script: [
      {
        say: 'Watch me tidy these buttons. I put four in a row, then another four, then four more. Every row holds the same number, and that is what makes this an array.',
        visual: 'Three rows with four buttons in each row.',
        figure: areaGrid(
          { rows: 3, cols: 4, rowLabels: ['4', '4', '4'] },
          { alt: 'three rows with four buttons in each row' },
        ),
      },
      {
        say: 'Now the total. I take the first row, then the next, then the last: four, eight, twelve. I say one number for each row, and no button gets counted twice.',
        visual: 'The same three rows, with the first row marked.',
        figure: areaGrid(
          { rows: 3, cols: 4, shadedRows: 1, rowLabels: ['4', '4', '4'] },
          { alt: 'three rows with four buttons in each row, the first row marked' },
        ),
      },
      {
        say: 'Now I turn the whole thing a quarter turn. It reads as four rows of three. Not one button has moved, so the total cannot have changed: twelve again.',
        visual: 'Four rows with three buttons in each row.',
        figure: areaGrid(
          { rows: 4, cols: 3, rowLabels: ['3', '3', '3', '3'] },
          { alt: 'four rows with three buttons in each row' },
        ),
      },
      {
        say: 'One habit before I write any answer down. I check roughly how big it ought to be. A whole array holds a good deal more than one row. A row-sized answer is my warning.',
        visual: 'A finger travelling down the rows, one row at a time.',
      },
    ],
    summary:
      'An array is rows of the same size. Add the row size once for every row. Keep count of the rows as you go. One row is never the whole array. Turn an array a quarter turn and its total stays the same.',
    vocabulary: [
      { term: 'array', kidGloss: 'things laid out in rows that all hold the same number' },
      { term: 'row', kidGloss: 'one line of things going across' },
      { term: 'row size', kidGloss: 'how many things one row holds' },
      { term: 'repeated addition', kidGloss: 'adding the same number again and again' },
    ],
  },
  guidedExamples: [
    {
      ...ge(20, 1, 'modeled', 'A block of flats has its letterboxes in 3 rows. Every row holds 5 letterboxes. How many letterboxes are there in all?', [
        {
          teacherSay:
            'First I check the rows. Every row holds five, so I am allowed to add five once for each row. Watch me keep a finger up for every row I finish.',
        },
        {
          teacherSay: 'Five, ten — two fingers are up and one row is still to come. Where does that last row put me?',
          expected: '15',
        },
      ], '15'),
      visual: 'Three rows with five letterboxes in each row.',
      figure: areaGrid(
        { rows: 3, cols: 5, rowLabels: ['5', '5', '5'] },
        { alt: 'three rows with five letterboxes in each row', asserts: { of: 'cells', ...assertsAnswer } },
      ),
    },
    {
      ...ge(20, 2, 'completion', 'An ice-cube tray has 4 rows. Every row holds 3 hollows. How many ice cubes will it make?', [
        { teacherSay: 'Which number here tells you what one row holds?', expected: '3' },
        { childDo: 'Add that number once for every row, and say where you finish.', expected: '12' },
      ], '12'),
      visual: 'Four rows with three hollows in each row.',
      figure: areaGrid(
        { rows: 4, cols: 3, rowLabels: ['3', '3', '3', '3'] },
        { alt: 'four rows with three hollows in each row', asserts: { of: 'cells', ...assertsAnswer } },
      ),
    },
    ge(20, 3, 'prompted', 'Solar panels sit in 5 rows on a barn roof. Every row holds 4 panels. How many panels are on the roof?', [
      { childDo: 'Add the row size once for every row, right down to the last row.', expected: '20' },
    ], '20'),
    {
      // Independent: ONE full row only. Deciding that the full rows are one job
      // and the unfinished row another IS the task here, so a picture of both
      // parts would hand over the plan the item exists to ask for.
      ...ge(20, 4, 'independent', 'Deckchairs stand in 4 full rows of 6. Two more deckchairs stand in the next row. How many deckchairs are out? Solve cold.', [
        { childDo: 'Total the full rows first, then bring in the two on the end.', expected: '26' },
      ], '26'),
      visual: 'One full row of six deckchairs. The other rows are yours to work out.',
      figure: areaGrid({ rows: 1, cols: 6 }, { alt: 'one full row of six deckchairs' }),
    },
  ],
  days: [
    // Day 1 — concept echo: the array in three kinds of story, single-step only,
    // no trap and no chain yet.
    [
      { gen: wFivesCount, diff: 2 },
      { gen: wPacketArrives, diff: 2 },
      { gen: wallOfLetterboxes, diff: 2 },
      { gen: rowsInThePhoto, diff: 3 },
      { gen: trayOfHollows, diff: 3 },
    ],
    // Day 2 — fluency + application: the size prediction, the turned array, and
    // the week's first two-step beside the anchor page it is built on.
    [
      { gen: wThreeTensOn, diff: 2 },
      { gen: predictThePanels, diff: 3 },
      { gen: turnedArraySameTotal, diff: 3 },
      { gen: msUnfinishedRow, diff: 4 },
      { gen: wallOfLetterboxes, diff: 3 },
    ],
    // Day 3 — interleave: the equal-rows check and the turned array against the
    // whole-row chain, so the shape of a page never signals the task.
    [
      { gen: wHowManyMore, diff: 2 },
      { gen: whichRowsAreEqual, diff: 3 },
      { gen: turnedArraySameTotal, diff: 4 },
      { gen: msRowAdded, diff: 4 },
      { gen: trayOfHollows, diff: 3 },
    ],
    // Day 4 — word problems: both chains beside the single-step arrays they are
    // built out of, so "it must take two steps" never becomes the cue.
    [
      { gen: wPacketArrives, diff: 3 },
      { gen: msUnfinishedRow, diff: 4 },
      { gen: msRowAdded, diff: 4 },
      { gen: rowsInThePhoto, diff: 3 },
      { gen: predictThePanels, diff: 4 },
    ],
    // Day 5 — the signature: the row mistaken for the wall taken apart, every
    // wall of twelve hunted down and argued for, and the rows-versus-total claim.
    [
      { gen: wFivesCount, diff: 2 },
      { gen: eaOneRowAsTheWhole, diff: 4 },
      { gen: everyArrayOfTwelve, diff: 3 },
      { gen: asnMoreRowsMoreThings, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: when an array comes out wrong, ask your child to point at one row before you look at the answer. Nearly every slip is one of two things — the row size added the wrong number of times, or one row reported as the lot. Pointing tells you which, and it takes seconds. Arrays are everywhere once you start looking: egg boxes, window panes, the buttons on a lift, a tray of buns. Counting one aloud together on the way home does more than a worksheet, because your child has to decide what a row is before they can count it.',
  ],
  puzzle: (r) => {
    // The core pages are all handed the rows and asked for the total. This one is
    // handed the TOTAL and has to find the row, and then grow the array by a row
    // it has just measured. Two moves, neither of them a Day-1 move, and both
    // testable by building — which is how a six-year-old should be arguing here.
    //
    // Deterministic construction: the row length is picked and the total computed
    // from it, so the pair is always consistent (kit §E2.4).
    const rows = r.int(3, 5);
    const perRow = r.int(4, 7);
    const total = rows * perRow;
    const name = one(r);
    return {
      id: 'B20-PZ-01',
      title: 'Puzzle Grove: How Long Is a Row?',
      puzzleType: 'logic',
      prompt: `${name} counts the spaces in the new car park. There are ${countNoun(total, 'spaces')}, painted in ${countNoun(rows, 'equal rows')}. Work out how many ${unitFor(2, 'spaces')} are in one row. Then the builders paint one more row of the same length. How many spaces are there now? Write both numbers, and say how you tested the first one.`,
      answer: {
        // A `set`, not a single value: the puzzle asks for the row AND the wall
        // one row taller, and a child who finds only the row has stopped halfway.
        value: `${perRow}, ${total + perRow}`,
        acceptableForms: [`${perRow}; ${total + perRow}`, `${perRow} ${total + perRow}`],
        validation: 'set',
      },
      hintLadder: [
        'What must one row hold, if all the rows reach that total?',
        'Try a row length. Add it once for each row, then adjust until you land on the total.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  // Every core page states the rows and asks for the total. The puzzle states the
  // total and asks for the row, then makes the array one row taller: an inverse
  // followed by an extension, and neither appears on Day 1.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'inverse-then-extend' },
  sprint: {
    skill: 'Addition within 100 — the single add a row of an array repeats',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 12, max: 48 },
  },
  mastery: [
    { gen: wallOfLetterboxes, diff: 3 },
    { gen: msUnfinishedRow, diff: 4 },
    { gen: rowsInThePhoto, diff: 3 },
    { gen: msRowAdded, diff: 4 },
    { gen: trayOfHollows, diff: 3 },
    { gen: turnedArraySameTotal, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: three single-step arrays, one per structure — the wall as an arrangement, the photo rows as a rate, the tray as a whole made of rows — with the one-row picture preserved on 01 and 05 and no picture on 03. 02/04: the two chains, one finishing with an unfinished row and one with a whole row added, both keeping the figure of their opening row. 06: the turned array, drawn with a fresh pair of row counts, so a form cannot be passed by remembering that the answer was "the same" once. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'task-comprehension',
      subtype: 'one-row-as-the-whole',
      description: 'Counts a single row and reports it as the total, so the answer is the row size however many rows the array has.',
      exampleWrongAnswer: 'a wall of 6 rows of 3 letterboxes answered as 3',
      distractorRationale: 'Offer the size of one row, which is what a child who stops at the first row arrives at.',
      reteachPointer: 'explanation/script[1] (I say one number for each row)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'rows-counted-not-measured',
      description: 'Compares arrays by how many rows they have and never weighs the row length, so a tall narrow array is read as the bigger one.',
      exampleWrongAnswer: '5 rows of 2 called bigger than 3 rows of 6',
      distractorRationale: 'Offer the arrangement with more rows on any comparison of two arrays.',
      reteachPointer: 'explanation/script[2] (not one button has moved)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'ragged-rows-accepted',
      description: 'Treats any set of rows as an array, so a short row at the end is added as though it were full.',
      exampleWrongAnswer: 'rows of 6, 6 and 5 totalled as three sixes',
      distractorRationale: 'Offer the total the array would reach if its short row were full.',
      reteachPointer: 'explanation/whyBeforeHow (if one row were short, adding the same number would tell you a lie)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-count-of-rows',
      description: 'Holds the row size steady but loses track of how many rows have been added, so the total lands one row short or one row over.',
      exampleWrongAnswer: '4 rows of 7 answered as 21',
      distractorRationale: 'Offer the total one whole row away from the truth.',
      reteachPointer: 'guidedExamples/B20-GE-01 (keep a finger up for every row I finish)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'row-count-not-yet-quick',
      description: 'Knows what to do and rebuilds the running total from the first row every time, so the answer arrives too slowly for the rest of the method to hold together.',
      exampleWrongAnswer: 'the fourth row of an array restarted from the first row',
      distractorRationale: 'Offer a total one row size out from the truth, which is what a hurried rebuild produces.',
      reteachPointer: 'explanation/summary (keep count of the rows as you go), then the 2-minute addition sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Arrays and repeated addition — reading things laid out in rows of the same size, totalling an array by adding the row size once for every row, finishing an array that has an unfinished row or a row added, and finding that turning an array round leaves its total alone.',
    improvingCandidates: [
      'checking that every row holds the same number before totalling anything',
      'adding the row size once for each row, and keeping count of the rows',
      'telling the number of rows apart from how many things there are',
    ],
    strengtheningByTag: [
      {
        errorTag: 'task-comprehension',
        text: 'answering for the whole array rather than for the one row in front of them',
      },
      {
        errorTag: 'concept-misconception',
        text: 'weighing the length of a row as well as the number of rows when two arrays are compared',
      },
      {
        errorTag: 'representation-misread',
        text: 'spotting a short row, which is the one thing that makes adding the same number every time unsafe',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping track of how many rows have been counted, which the two-minute sprint keeps quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked that the rows matched and then counted them one row at a time — that check is the habit this whole week is built on.',
      questionForChild: 'If a tray has 4 rows with 5 hollows in each row, how many ice cubes does it make — and how did you count them?',
      schoolSyncHook: 'If your child\'s class says "3 rows of 4" where we say "an array", tell us and we will use the words they hear.',
    },
    vocabularyForParent: [
      'array (things laid out in rows that all hold the same number)',
      'row size (how many things one row holds)',
      'repeated addition (adding the same number again and again — one row at a time)',
    ],
  },
});
