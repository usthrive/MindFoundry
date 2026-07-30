/**
 * Level C · Week 13 — "Distributive thinking" (conceptId: distributive-thinking).
 *
 * FILL-ARCHITECTURE §5 row C13: anchor "split-the-array"; multi-step is NATIVE
 * to the concept (cut, multiply each part, put the parts back); error-analysis
 * "the student who does not multiply BOTH parts"; discrimination "a valid split
 * vs an invalid one"; Day-5 signature "split 7 × 8 three ways and show they
 * agree".
 *
 * The week's whole claim is that an array can be CUT without anything moving —
 * 7 × 8 is 7 × 5 and 7 × 3 standing side by side — and that the cut is only
 * legal when the two parts add back to exactly what was cut. So the content is
 * built to force both halves of that claim rather than decorate them:
 *  - the sharp item is a split-validity choice whose tempting distractor is the
 *    OVERLAPPING cut (five and four out of a row of eight): it looks exactly
 *    like a legal split and lands one whole row too high, because one column
 *    sits inside both parts. Its sibling runs the same idea backwards — which
 *    single multiplication does "a × p + a × q" rebuild — and its distractor is
 *    the double-count proper (both factors joined, so the array is counted
 *    twice);
 *  - four genuine two-step items, all of them the concept itself: a container
 *    holding a ten and a few more, the part of an array not yet counted, a
 *    near-ten cut (ten each, then one back out of every group), and one carrying
 *    a quantity that must be left alone;
 *  - a generated error-analysis whose shown number is the real output of the
 *    misconception (the leftover part joined by an add rather than by rows).
 *
 * A NOTE ON THE ERROR-ANALYSIS (the one place the recipe and the shipped
 * library disagree). The recipe names the double-count as the Day-5 error, but
 * `d_verify_binop_misconception_v1` — the only whole-number verify template that
 * returns a `wrong` value — varies the OPERATION over one fixed operand pair, so
 * a double-count (2ab) is not derivable from it and no double-count verify
 * template exists. Faking the number was never an option (kit §A.1), so the
 * double-count lives where it can be shown honestly — in `discrimRebuildProduct`
 * (the `2a × b` option), in the Day-5 Always/Sometimes/Never claim, and in the
 * mistake bank — and Day 5's generated item takes the complementary slip: both
 * parts must be multiplied, and this student multiplied only one of them.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7): a figure attached to a DAY ITEM
 * shows the part that is ALREADY KNOWN — the block already counted, one strip,
 * one busload — and asserts that block against the item's own drawn param. The
 * picture therefore teaches where the cut falls and can never hand over the
 * total the item asks for. The pictures that show a WHOLE split array, partial
 * products written in the rooms and all, live where the answer is already on the
 * page: the lesson script and the modeled/completion guided examples.
 *
 * Retrieval is backward-only into C3 (addition within 1,000 — the recombine
 * step), C7 (the ×2/×5/×10 ladder every friendly cut lands on), C10 (fact
 * families) and C11 (×6 ×7, where "5s and one more group" was first seen).
 */

import { addWhole, asWarmup, classify, multiply, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor, wholeMoney } from '../lib/format';
import { frame } from '../lib/contexts';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel, counters } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C3 = { level: 'C' as const, week: 3 };
const C6 = { level: 'C' as const, week: 6 };
const C7 = { level: 'C' as const, week: 7 };
const C10 = { level: 'C' as const, week: 10 };
const C11 = { level: 'C' as const, week: 11 };
const C12 = { level: 'C' as const, week: 12 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

/**
 * The friendly part every split in this week cuts to. Five is not an arbitrary
 * choice: it is the fact ladder C7 built and the "5s and one more group" move
 * C11 leaned on, so the cut always lands on ground the child already owns.
 */
const FRIENDLY = 5;

/** The noun pool of a registry frame; the container word and grammar are local. */
const nounOf = (r: Rng, id: string): string => r.pick(frame(id).nouns);

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep) have no figure slot, and lib/
// is not ours to edit, so this wrapper does what `withEstimateFirst` does: it
// works entirely inside the returned closure, takes no new rng draw, and leaves
// the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It reads
// the drafted item's `generator.params` — the very numbers the answer was
// computed from — so the figure law ("built from the item's own drawn values")
// holds by construction.
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
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — the recombine step: two partial products have to be put back together. */
const wAdd = asWarmup(addWhole(24, 470), C3);

/** C11 — the ×6/×7 facts this week now builds out of easier ones. */
const wFacts = asWarmup(multiply(6, 7, 3, 9), C11);

/** C10 — the fact triangle: a missing factor is the split read backwards. */
const wMissingFactor = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'factor-pair',
    draw: (r) => {
      const f = r.int(3, 9);
      const q = r.int(3, 9);
      return {
        prompt: `${one(r)} is filling in a fact triangle: ${f} × ▢ = ${f * q}. What number belongs in the box?`,
        answerValue: String(q),
        templateId: 'd_factor_pair_v1',
        params: { n: f * q, f },
        hints: [
          'How many of the first number would it take to reach the total?',
          'Skip-count by the first number and keep track of how many jumps it takes.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  C10,
);

/** C7 — the ×2/×5/×10 ladder, which is where a friendly cut always lands. */
const wLadder = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'multiple',
    draw: (r) => {
      const base = r.pick([2, 5, 10] as const);
      const k = r.int(4, 9);
      const name = one(r);
      return {
        prompt: `${name} counts up in ${base}s: ${base}, ${base * 2}, ${base * 3}, and on. What is the ${ORDINAL[k]} number ${name} says?`,
        answerValue: String(base * k),
        templateId: 'd_multiple_v1',
        params: { base, k },
        hints: [
          'Which number is added on to get from each one to the next?',
          'Keep adding that jump, counting the jumps as you go.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  C7,
);

// ---------------------------------------------------------------------------
// Single-step situations — the split shown from four different angles
// ---------------------------------------------------------------------------

/**
 * The anchor form: an array with one block already counted. The figure draws
 * ONLY that block, so the picture says where the cut is and the child still has
 * to work out — and add on — the part that is missing.
 */
const sitFinishTheArray = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'mul',
    draw: (r) => {
      const rows = r.int(3, 8);
      const cols = r.int(6, 9);
      const noun = nounOf(r, 'seating');
      const name = one(r);
      const known = rows * FRIENDLY;
      return {
        prompt: `[image: the block ${name} has already counted — ${countNoun(rows, 'rows')} with ${countNoun(FRIENDLY, noun)} in each] The hall is set out in ${countNoun(rows, 'rows')}, and every row holds ${countNoun(cols, noun)}. ${name} has already counted the first ${countNoun(FRIENDLY, noun)} in every row — that is ${countNoun(known, noun)}. How many ${unitFor(2, noun)} are in the hall?`,
        answerValue: String(rows * cols),
        templateId: 'd_mul_v1',
        params: { a: rows, b: cols, known, noun },
        units: noun,
        hints: [
          'How much of the hall has already been counted, and how much is left over?',
          'Work out what the uncounted block holds, then join it to the block that is already counted.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: numOf(p, 'a'), cols: FRIENDLY },
      {
        alt: `the block already counted: ${countNoun(numOf(p, 'a'), 'rows')} with ${countNoun(FRIENDLY, strOf(p, 'noun'))} in each`,
        asserts: assertsParam('known', 'cells'),
      },
    ),
);

/** The known-fact form: the story hands over the easy fact and asks for the hard one. */
const sitKnownFact = situation({
  situationType: 'rate',
  cognitiveOp: 'mul',
  draw: (r) => {
    const per = r.int(3, 9);
    const groups = r.int(6, 9);
    const noun = nounOf(r, 'warehouse');
    const name = one(r);
    return {
      prompt: `${name} stacks ${countNoun(per, noun)} onto every pallet, and knows that ${per} × ${FRIENDLY} = ${per * FRIENDLY} without stopping to think. How many ${unitFor(2, noun)} are on ${countNoun(groups, 'pallets')}?`,
      answerValue: String(per * groups),
      templateId: 'd_mul_v1',
      params: { a: per, b: groups },
      units: noun,
      hints: [
        'Which fact has the story already given you, and how many pallets does it cover?',
        'Start from the fact you were handed, then count on the pallets it does not reach.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});

/**
 * The one-more-group form (the C11 seed, deepened): a known total plus one more
 * whole group. The figure shows that ONE group, never the total.
 */
const sitOneMoreGroup = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add',
    draw: (r) => {
      const per = r.int(4, 9);
      const groups = r.int(4, 8);
      const noun = nounOf(r, 'transport');
      const name = one(r);
      return {
        prompt: `[image: one bus with ${countNoun(per, noun)} on board] ${name} counts ${countNoun(groups, 'buses')} with ${countNoun(per, noun)} on each — that is ${countNoun(per * groups, noun)}. Then one more bus pulls in with ${countNoun(per, noun)} on board. How many ${unitFor(2, noun)} are there now?`,
        answerValue: String(per * groups + per),
        templateId: 'd_add_v1',
        params: { a: per * groups, b: per, noun },
        units: noun,
        hints: [
          'Does the last bus change how full the other buses are?',
          'Take the total the story gives you and count on one whole busload.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'b'), strOf(p, 'noun'), {
      alt: `one bus with ${countNoun(numOf(p, 'b'), strOf(p, 'noun'))} on board`,
      asserts: assertsParam('b'),
    }),
);

/**
 * The measurement form: the same LENGTH laid down again, not the same count.
 * The bar shows ONE strip, so the line's length is still the child's to find.
 */
const sitStripLine = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'mul',
    draw: (r) => {
      const len = r.int(6, 9);
      const count = r.int(4, 9);
      // 'cloth', not 'ribbon-cutting': both of that frame's nouns must survive
      // the sentence, and a BOW laid end to end is not a length.
      const noun = nounOf(r, 'cloth');
      const name = one(r);
      return {
        prompt: `[image: one ${unitFor(1, noun)}, ${countNoun(len, 'cm')} long] Every ${unitFor(1, noun)} on the craft table is ${countNoun(len, 'cm')} long. ${name} lays ${countNoun(count, noun)} end to end in one line. How long is the whole line?`,
        answerValue: String(len * count),
        templateId: 'd_mul_v1',
        params: { a: len, b: count, noun },
        units: 'cm',
        hints: [
          'Is the question asking about one piece, or about the line they make together?',
          'Lay the same length down once for every piece, and read how far the line reaches.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    barModel(
      [{ label: `one ${unitFor(1, strOf(p, 'noun'))}`, segments: [{ value: numOf(p, 'a'), label: String(numOf(p, 'a')) }] }],
      {
        scaleMax: numOf(p, 'a'),
        alt: `one ${unitFor(1, strOf(p, 'noun'))}, ${countNoun(numOf(p, 'a'), 'cm')} long`,
        asserts: assertsParam('a'),
      },
    ),
);

/**
 * Metacognition base — only ever served through the estimate-first wrapper. The
 * probe IS this week's content: ten-dollar tickets are the upper bound a near-ten
 * split leans on, so calling above-or-below is the split done in the head first.
 */
const sitStallPrice = situation({
  situationType: 'money-change',
  cognitiveOp: 'mul',
  draw: (r) => {
    const price = r.int(4, 9);
    const count = r.int(6, 9);
    const noun = nounOf(r, 'market-stall');
    const name = one(r);
    return {
      prompt: `One ${unitFor(1, noun)} on the market stall costs ${wholeMoney(price)}. ${name} buys ${countNoun(count, noun)}. How much does ${name} pay in all?`,
      answerValue: String(price * count),
      templateId: 'd_mul_v1',
      params: { a: price, b: count },
      units: 'dollars',
      acceptableForms: [wholeMoney(price * count)],
      hints: [
        'What would the shopping cost if the price were a friendly ten dollars each?',
        'Start from that friendly total, then take off what each one is short of ten — once for every one bought.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const sitStallPriceEstimate = withEstimateFirst(
  sitStallPrice,
  'if every one of them cost ten dollars, would the total be larger or smaller than the real total?',
);

// ---------------------------------------------------------------------------
// Multi-step: the concept itself — cut, multiply each part, put them back
// ---------------------------------------------------------------------------

/**
 * The container that is already split: a ten and a few more in every pack. The
 * child either adds first and multiplies once, or multiplies the tens and the
 * extras separately — the two roads are the distributive law, and both land here.
 */
const msTenAndExtras = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    const extra = r.int(2, 6);
    const packs = r.int(4, 8);
    const noun = nounOf(r, 'ticket-sales');
    const name = one(r);
    return {
      prompt: `Every booklet holds ${countNoun(10, `full-price ${unitFor(2, noun)}`)} and ${countNoun(extra, `child ${unitFor(2, noun)}`)}. ${name} buys ${countNoun(packs, 'booklets')}. How many ${unitFor(2, noun)} is that in all?`,
      initN: 10,
      steps: [
        { op: 'add', n: extra, d: 1 },
        { op: 'mul', n: packs, d: 1 },
      ],
      units: noun,
      hints: [
        'How many does one whole booklet hold?',
        'Fill one booklet first, then take that many once for every booklet in the story.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * The unfinished array: how long is the part that has NOT been counted, and what
 * is it worth? The opening move is the cut itself, not a multiplication.
 */
const msUncountedPart = multiStep({
  situationType: 'area',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    const cols = r.int(7, 9);
    const rows = r.int(3, 8);
    const noun = nounOf(r, 'tiling');
    const name = one(r);
    return {
      prompt: `Every row of the path has ${countNoun(cols, noun)}, and the path has ${countNoun(rows, 'rows')}. ${name} has swept the first ${countNoun(FRIENDLY, noun)} in every row. How many ${unitFor(2, noun)} are still dusty?`,
      initN: cols,
      steps: [
        { op: 'sub', n: FRIENDLY, d: 1 },
        { op: 'mul', n: rows, d: 1 },
      ],
      units: noun,
      hints: [
        'How much of a single row is still dusty?',
        'Measure the unswept part of one row, then remember that every row has one.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * The near-ten cut: fill every group to ten, then take the difference back out.
 * This is the subtractive face of the same law, and the reason ×9 and ×8 are
 * easy facts in disguise.
 */
const msNearTen = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    const crates = r.int(4, 9);
    const short = r.pick([1, 2] as const);
    // 'packing', because its container ('crate') and its contents are different
    // words: the 'weighing' frame would have written "10 sacks in every sack".
    const noun = nounOf(r, 'packing');
    const name = one(r);
    return {
      prompt: `Every crate in the store holds ${countNoun(10, noun)}. ${name} loads ${countNoun(crates, 'crates')} onto the van, then lifts ${countNoun(short * crates, noun)} back out — ${countNoun(short, noun)} from each crate. How many ${unitFor(2, noun)} are on the van?`,
      initN: 10,
      steps: [
        { op: 'mul', n: crates, d: 1 },
        { op: 'sub', n: short * crates, d: 1 },
      ],
      units: noun,
      hints: [
        'Would it be easier to fill every group right to the top first, and deal with the missing ones afterwards?',
        'Load every group full, then take back out what the story lifts away.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

/**
 * The same cut, posed with a quantity that is NOT used
 * (PEDAGOGY-CEILING-REVIEW F3 `has-distractor`): every item in the corpus
 * consuming every number it states quietly teaches "use all the numbers".
 */
const msGapsWithSpare = multiStep({
  situationType: 'combine',
  cognitiveOp: 'multi-step',
  posing: 'has-distractor',
  draw: (r) => {
    const gaps = r.int(2, 3);
    const shelves = r.int(4, 8);
    // The unused quantity must not echo a number the story actually uses — a
    // distractor that matches a working number reads as a clue, not a decoy.
    let spare = r.int(3, 7);
    for (let i = 0; i < 6 && (spare === gaps || spare === shelves); i++) spare = spare === 7 ? 3 : spare + 1;
    const name = one(r);
    return {
      prompt: `A full shelf takes ${countNoun(10, 'books')}, but ${name} leaves ${countNoun(gaps, 'gaps')} on every shelf for new titles. ${name} fills ${countNoun(shelves, 'shelves')} that way. A trolley by the door holds ${countNoun(spare, 'magazines')}. How many books are on the shelves?`,
      initN: 10,
      steps: [
        { op: 'sub', n: gaps, d: 1 },
        { op: 'mul', n: shelves, d: 1 },
      ],
      units: 'books',
      hints: [
        'Which numbers in this story are counting books, and which one is not?',
        'Work out what one shelf really holds, then take that many once for every shelf — and leave the number that counts something else alone.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's sharpest pair, forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * A valid split against an invalid one. The trap is the OVERLAPPING cut: five
 * and four out of a row of eight looks exactly like a legal split, and it is
 * the double-count — one column falls inside both parts, so the total comes out
 * a whole row too high. The second distractor is the add-instead-of-multiply
 * read of the leftover, which is why this is registered as a cross-op trap.
 */
const discrimValidSplit = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const rows = r.int(4, 9);
    const rowLen = r.int(7, 9);
    const rest = rowLen - FRIENDLY;
    const name = one(r);
    return {
      prompt: `${name} works out ${rows} × ${rowLen} by cutting the ${rowLen} into two parts. Which one of these lands on the same total as ${rows} × ${rowLen}?`,
      correct: `${rows} × ${FRIENDLY} + ${rows} × ${rest}`,
      distractors: [
        {
          text: `${rows} × ${FRIENDLY} + ${rows} × ${rest + 1}`,
          errorTag: 'concept-misconception',
          rationale: `The two parts total one more than ${rowLen}, so the parts overlap by a column and that column is counted twice — a whole row of ${rows} too many.`,
        },
        {
          text: `${rows} × ${FRIENDLY} + ${rest}`,
          errorTag: 'representation-misread',
          rationale: `Counts the leftover part as ${rest} on its own, when every one of the ${rows} rows carries that leftover.`,
        },
      ],
      hints: [
        'Do the two parts add back to exactly the number that was cut?',
        'Both pieces keep every row they started with, so each piece still has to be multiplied by the number of rows.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The same idea read backwards — which single multiplication does a pair of
 * partial products rebuild? Here the double-count is the headline distractor:
 * joining the two row-counts as well as the two parts counts the array twice.
 */
const discrimRebuildProduct = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const rows = r.int(4, 9);
    const p = r.int(3, 5);
    let q = r.int(2, 4);
    if (q === p) q = p === 3 ? 2 : 3;
    return {
      prompt: `Which single multiplication has the same total as ${rows} × ${p} + ${rows} × ${q}?`,
      correct: `${rows} × ${p + q}`,
      distractors: [
        {
          text: `${rows * 2} × ${p + q}`,
          errorTag: 'concept-misconception',
          rationale: `Joins the two ${rows}s as well as the two parts, which counts the whole array twice — the rows were never cut, so there are still only ${rows} of them.`,
        },
        {
          text: `${rows} × ${p * q}`,
          errorTag: 'representation-misread',
          rationale: 'Multiplies the two parts together; the parts lie side by side in the same rows, so they join by adding.',
        },
      ],
      hints: [
        'When a row is cut into two shorter pieces, does the number of rows change?',
        'Put the two pieces of the row back end to end, and keep the rows exactly as they were.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
// ---------------------------------------------------------------------------

/**
 * The student cuts the row correctly, multiplies the first part correctly, and
 * then joins the leftover part with an add. The shown number is the genuine
 * output of that misconception (`d_verify_binop_misconception_v1`, '*' vs '+'),
 * and every line of arithmetic the student writes is internally true — which is
 * what makes the item hard: nothing is a slip, so the child has to find the
 * MOVE, not the sum.
 */
const eaLeftoverAdded = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(4, 9), b: r.int(2, 4), op: '*', wrongOp: '+' }),
  build: (v, p) => {
    const rows = Number(p.a);
    const rest = Number(p.b);
    const rowLen = FRIENDLY + rest;
    const firstPart = rows * FRIENDLY;
    return {
      prompt: `A student worked out ${rows} × ${rowLen} by cutting the ${rowLen} into ${FRIENDLY} and ${rest}. For the first part the student wrote ${rows} × ${FRIENDLY} = ${firstPart}. For the second part the student wrote ${rows} + ${rest} = ${v.wrong}, and gave ${firstPart + Number(v.wrong)} as the answer.`,
      extension: `Draw the array with the cut in it, write down what the SECOND part is really worth, and add one sentence saying what the student did to the leftover part.`,
      hints: [
        'Which piece of the picture does the second line describe?',
        'Count the rows the leftover piece still has, then work out what that piece really holds.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC13 = makeWeekBuilder({
  level: 'C',
  week: 13,
  conceptId: 'distributive-thinking',
  conceptName: 'Distributive thinking',
  strandTags: ['multiplication-division', 'algebra-geometry'],
  prerequisiteWeeks: [C6, C11, C12],
  pedagogyContract: 'v2',
  conceptualAnchor: 'split-the-array',
  conceptFamily: 'operation',
  deepeningDelta:
    'C11 used one split of one kind ("five 7s and one more 7") as a way to reach two hard facts. C13 makes the split itself the object: any factor may be cut, the cut may be additive or near-ten, the two parts must add back to exactly what was cut, and the factor that was not cut never changes — which is why three different splits of the same product all agree.',
  explanation: {
    hook:
      '7 × 8 is a hard fact. 7 × 5 is an easy one, and so is 7 × 3 — and this week you will see that the hard fact is nothing but those two easy ones standing side by side.',
    whyBeforeHow:
      'A hard fact is only a stack of easy facts, because an array can be cut into two smaller arrays without a single square moving. That is the split-the-array move: cut ONE factor into two friendly parts, work out what each part is worth, then put the two answers back together. Cutting the 8 in 7 × 8 into 5 and 3 is safe since the seven rows are still seven rows in both pieces — the cut changes how long a row is, never how many rows there are. And the two parts have to add back to exactly what was cut: if they overlap, a column sits in both pieces and gets counted twice.',
    script: [
      {
        say: 'Watch me take 7 × 8, which I do not know by heart. I cut every row after the fifth square. Now I have two blocks: 7 rows of 5, and 7 rows of 3. Nothing has moved — I have only drawn a line.',
        visual: 'Seven rows of eight squares, with the first five squares of every row shaded.',
        figure: areaGrid(
          { rows: 7, cols: 8, shadedCols: 5 },
          { alt: 'seven rows of eight squares, with the first five squares in every row shaded as one block' },
        ),
      },
      {
        say: 'Now I read the two blocks. 7 × 5 = 35, and 7 × 3 = 21. Put the blocks back together: 35 + 21 = 56. So 7 × 8 = 56, and I never counted a single square one at a time.',
        visual: 'The same array as two labelled rooms: a 7-by-5 room holding 35 and a 7-by-3 room holding 21.',
        figure: areaGrid(
          { rows: 1, cols: 2, rowLabels: ['7'], colLabels: ['5', '3'], cellLabels: ['35', '21'] },
          { alt: 'the seven-row array as two rooms: a five-wide room holding 35 and a three-wide room holding 21' },
        ),
      },
      {
        say: 'Before I cut anything I check about how big the answer should be. Seven tens is 70, so seven eights has to land a good way below 70 — and near it, not near seven fives. When my two parts came to 56 I could see straight away that the size was sensible.',
        visual: 'Two reference bars: seven fives beside seven tens, with the answer sitting between them.',
        figure: barModel(
          [
            { label: 'seven fives', segments: [{ value: 35, label: '35' }] },
            { label: 'seven tens', segments: [{ value: 70, label: '70' }] },
          ],
          { scaleMax: 70, alt: 'a bar of thirty-five for seven fives beside a longer bar of seventy for seven tens' },
        ),
      },
      {
        say: 'Here is the cut that is not allowed. If I take 5 and 4 out of a row that is only 8 long, the two pieces overlap by one column. That column gets counted in both blocks, and 35 + 28 = 63 — one whole row of 7 too many. The parts must add back to exactly the number I cut.',
        visual: 'The same seven rows cut into a five-wide piece and a four-wide piece, with the shared column marked.',
        figure: areaGrid(
          { rows: 1, cols: 2, rowLabels: ['7'], colLabels: ['5', '4'], cellLabels: ['35', '28'] },
          { alt: 'the seven-row array cut into a five-wide piece and a four-wide piece, whose widths together reach past the end of the row' },
        ),
      },
    ],
    summary:
      'Any array can be cut into two smaller arrays. Cut one factor into two friendly parts, multiply EACH part by the other factor, then add the two answers. The two parts must add back to exactly what you cut, and the factor you did not cut stays exactly as it was.',
    vocabulary: [
      { term: 'array', kidGloss: 'equal rows of the same length, tidied into a rectangle' },
      { term: 'split-the-array', kidGloss: 'draw a line through the rows to make two smaller arrays' },
      { term: 'part (of a split)', kidGloss: 'one of the two pieces a factor is cut into' },
      { term: 'partial product', kidGloss: 'what one piece of a split array is worth on its own' },
    ],
  },
  guidedExamples: [
    {
      ...ge(13, 1, 'modeled', 'A wall has 6 rows of tiles with 8 tiles in every row. How many tiles are on the wall?', [
        {
          teacherSay:
            'I do not know 6 × 8 by heart, so let me cut it where the counting is easy. I draw a line after the fifth tile of every row, because I know my fives — that gives me 6 rows of 5, which is 30.',
        },
        {
          teacherSay: 'The piece I have left is 6 rows of 3. What is that piece worth?',
          expected: '18',
        },
        {
          childDo: 'Put the two pieces back together.',
          expected: '48',
        },
      ], '48'),
      visual: 'Six rows of eight tiles with the first five tiles in every row shaded.',
      figure: areaGrid(
        { rows: 6, cols: 8, shadedCols: 5 },
        { alt: 'six rows of eight tiles, with the first five tiles in every row shaded', asserts: { of: 'cells', ...assertsAnswer } },
      ),
    },
    {
      ...ge(13, 2, 'completion', 'A crate holds 7 jars. How many jars are in 6 crates?', [
        { teacherSay: 'The two rooms are already drawn for you. Which fact fills the wide room?', expected: '35' },
        { childDo: 'Work out the narrow room, then add the two rooms together.', expected: '42' },
      ], '42'),
      visual: 'The seven-row array as two rooms: a five-wide room and a one-wide room.',
      figure: areaGrid(
        { rows: 1, cols: 2, rowLabels: ['7'], colLabels: ['5', '1'], cellLabels: ['35', '?'] },
        { alt: 'the seven-row array as two rooms: a five-wide room holding 35 and a one-wide room still empty' },
      ),
    },
    ge(13, 3, 'prompted', 'Ria works out 9 × 6. She cuts the 6 into 5 and 1. Name what each part is worth, then give the total.', [
      { childDo: 'Say the two parts out loud, then join them.', expected: '54' },
    ], '54'),
    ge(13, 4, 'independent', 'A sticker sheet has 8 rows with 7 stickers in every row. Choose your own cut and find the total. Solve cold.', [
      { childDo: 'Cut one factor where the facts are easy for you, and check your two parts add back to the number you cut.', expected: '56' },
    ], '56'),
  ],
  days: [
    // Day 1 — concept echo: the split in three single-step models, no chains yet.
    [
      { gen: wAdd, diff: 2 },
      { gen: wMissingFactor, diff: 2 },
      { gen: wFacts, diff: 2 },
      { gen: sitOneMoreGroup, diff: 2 },
      { gen: sitKnownFact, diff: 3 },
      { gen: sitFinishTheArray, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first metacognition and the
    // split-validity trap arrive.
    [
      { gen: wLadder, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: sitStallPriceEstimate, diff: 3 },
      { gen: discrimValidSplit, diff: 4 },
      { gen: sitStripLine, diff: 3 },
      { gen: sitKnownFact, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations against the first two chains.
    [
      { gen: wFacts, diff: 3 },
      { gen: discrimRebuildProduct, diff: 4 },
      { gen: discrimValidSplit, diff: 4 },
      { gen: msTenAndExtras, diff: 4 },
      { gen: sitFinishTheArray, diff: 3 },
      { gen: msUncountedPart, diff: 4 },
    ],
    // Day 4 — word problems: four genuine two-steps, including the one carrying
    // a quantity that must be left alone.
    [
      { gen: msTenAndExtras, diff: 4 },
      { gen: msUncountedPart, diff: 4 },
      { gen: msNearTen, diff: 4 },
      { gen: msGapsWithSpare, diff: 5 },
      { gen: sitStripLine, diff: 3 },
    ],
    // Day 5 — non-computational: the error-analysis, the three-ways production,
    // and the claim that kills the double-count (+ a ramped warm-up).
    [
      { gen: wMissingFactor, diff: 2 },
      { gen: eaLeftoverAdded, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Work out 7 × 8 three ways. First cut the 8 into 5 and 3. Then cut the 8 into 4 and 4. Then cut the 7 into 5 and 2. Write the two parts and the total for each cut, then write one sentence saying what you notice about the three totals.',
          value: 'every cut lands on the same total, because each one cuts the same array into two pieces and puts them straight back together',
          acceptableForms: ['same total', 'the same', '56', 'one array', 'equal'],
          keywords: true,
          hints: [
            'Which of your three cuts changed the size of the array itself?',
            'Lay the three pairs of parts under one another and read the totals down the page.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: when you cut one factor of a multiplication into two parts, the other factor has to be cut as well. Explain how you know in one sentence.',
          correct: 'never',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Cuts both factors and then joins every piece, which counts the whole array twice over.',
            },
            {
              text: 'sometimes',
              errorTag: 'representation-misread',
              rationale: 'Reads the two factors as playing the same part in the picture; the factor left whole is the number of rows, and cutting a row never changes how many rows there are.',
            },
          ],
          hints: [
            'When a row is cut in two, does the picture gain any extra rows?',
            'Draw the cut, then count the rows in each piece and compare them with the rows you started with.',
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
    'For grown-ups: this week is one idea — a hard fact is two easy facts side by side. If your child stalls on something like 7 × 8, do not supply the answer; ask "what is 7 × 5?" and then "how many are still missing?". The only rule to hold them to is that the two parts must add back to exactly the number they cut, because parts that overlap count some of the array twice.',
  ],
  puzzle: (r) => {
    const rows = r.int(4, 9);
    const rowLen = r.pick([6, 7, 8, 9] as const);
    const ways: string[] = [];
    for (let p = 1; p <= Math.floor(rowLen / 2); p++) ways.push(`${p} and ${rowLen - p}`);
    const name = one(r);
    return {
      id: 'C13-PZ-01',
      title: 'Puzzle Grove: Balance the Beam',
      puzzleType: 'logic',
      // "one or more", not "a whole number": zero is a whole number, so a
      // 0-and-everything pair would balance the beam and sit outside the key —
      // and completeness is the very thing this puzzle asks the child to argue.
      prompt: `${name} hangs ${rows} × ${rowLen} on the left pan of a balance beam. On the right pan go two weights: ${rows} × ▢ and ${rows} × ▢, with a counting number — one or more — in each box. Find EVERY pair of numbers that balances the beam, counting a pair and its swap as the same pair, and say how you know none is missing.`,
      answer: { value: ways.join('; '), acceptableForms: ways, validation: 'short-text-keyword' },
      hintLadder: [
        'How could you be sure you have found every pair, and not only some of them?',
        'Walk the first box up in order — one, then two, then three — and stop once it passes halfway, since after that the pairs start repeating.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Multiplication facts ×2, ×5, ×10 — the friendly facts every split lands on',
    sourceWeek: C7,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { tables: [2, 5, 10], max: 10 },
  },
  mastery: [
    { gen: sitFinishTheArray, diff: 3 },
    { gen: msTenAndExtras, diff: 3 },
    { gen: sitKnownFact, diff: 3 },
    { gen: msUncountedPart, diff: 4 },
    { gen: sitStripLine, diff: 3 },
    { gen: msNearTen, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step splits — an array with one block already counted, a story that hands over the easy fact, and a length laid down again — each keeping its known-part figure. 02/04/06: two-step cuts — a ten-and-extras container, the part of an array not yet counted, and a near-ten load-and-lift. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'double-counted-split',
      description:
        'Lets the two parts overlap, or cuts both factors and joins every piece, so part of the array is counted twice.',
      exampleWrongAnswer: '7 × 8 answered as 63, cutting the 8 into 5 and 4',
      distractorRationale: 'Offer the split whose two parts total one more than the number that was cut, or the product with both row-counts joined.',
      reteachPointer: 'explanation/script[3] (the overlapping cut) beside script[1] (the cut that fits exactly)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'leftover-not-multiplied',
      description:
        'Multiplies the first part but joins the leftover part as a bare number, as though only one row carried it.',
      exampleWrongAnswer: '7 × 8 answered as 38 (35 and then 3)',
      distractorRationale: 'Offer the first partial product with the leftover part added on its own.',
      reteachPointer: 'guidedExamples/C13-GE-01 (name what the second block is worth before adding it)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-the-known-part',
      description:
        'Answers with the block the story already counted, or with one part of a two-step cut, and never returns for the rest.',
      exampleWrongAnswer: '6 rows of 8 with 30 already counted, answered as 30',
      distractorRationale: 'Offer the stated partial product on split-and-finish items.',
      reteachPointer: 'explanation/script[0] (two blocks are drawn, and both of them count)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'lost-partial',
      description:
        'Chooses a good cut and works both parts out, then loses one of them while adding, landing a part short.',
      exampleWrongAnswer: '35 and 21 recombined as 35',
      distractorRationale: 'Offer the larger partial product on its own.',
      reteachPointer: 'guidedExamples/C13-GE-02 (write both rooms down before adding), then the 2-minute facts sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Distributive thinking — cutting an array into two smaller arrays to build a hard fact out of easy ones (7 × 8 as 7 × 5 and 7 × 3), checking that the two parts add back to exactly what was cut, and using a near-ten cut for facts like ×9 and ×8.',
    improvingCandidates: [
      'cutting a factor at a friendly number instead of counting one at a time',
      'multiplying BOTH parts of a cut before adding them',
      'checking that the two parts add back to the number that was cut',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping the two parts from overlapping — a shared column gets counted twice and the answer comes out a whole row too big',
      },
      {
        errorTag: 'representation-misread',
        text: 'remembering that the leftover part sits in every row, so it is multiplied like the first part',
      },
      {
        errorTag: 'task-comprehension',
        text: 'going back for the second block after the first one is counted',
      },
    ],
    homeFocus: {
      praiseLine:
        'You split the hard fact into two easy ones and checked that your two parts added back to what you cut — that is exactly the move this week is built on.',
      questionForChild: 'If you had to work out 7 × 6 without knowing it, where would you cut it — and what would each part be worth?',
      schoolSyncHook: 'If your child\'s class calls this "break apart" or draws it as an area model, tell us and we will use the words they hear in school.',
    },
    vocabularyForParent: [
      'split the array (cut one factor into two easy parts)',
      'partial product (what one piece of the cut array is worth)',
      'near-ten cut (fill every group to ten, then take the extra back out)',
    ],
  },
});
