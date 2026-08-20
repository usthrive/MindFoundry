/**
 * Level D · Week 18 — "Multiplying fractions" (conceptId: multiplying-fractions).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Structure copied from the
 * D4 exemplar (ACCEPT 4.21): module-scope generators with FIXED, role-based,
 * name-free hint ladders (seed-invariant dedup), a genuine multi-step chain, a
 * code-generated error-analysis item, discrimination traps forcing an "of =
 * multiply vs add" choice, metacognition in the daily core and modeled in the
 * script, and a puzzle that applies the concept a new way.
 *
 * Concept anchor: the AREA SQUARE — a fraction OF a fraction is the double-shaded
 * overlap, a part of a part, which is why the product is SMALLER than either
 * factor. Multi-step (op-family, ≥2): fraction of a fraction THEN of a whole
 * quantity. Error-analysis: added instead of multiplied (d_verify_frac_v1,
 * wrong-op-add). Situations: garden/field/ribbon area + wall/recipe multi-stage.
 */

import { asWarmup, classify, fracEquivFill, fracTimesWhole, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { coprimeNumerator } from '../lib/format';
import { areaGrid, barModel } from '../lib/figures';
import { ge, makeWeekBuilder } from '../lib/assemble';
import { addFrac, formatFrac, mulFrac } from '../lib/compute';

const C12 = { level: 'C' as const, week: 12 };
const D9 = { level: 'D' as const, week: 9 };
const D11 = { level: 'D' as const, week: 11 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

/** Product of two fractions, canonical string (matches d_frac_times_frac_v1's answerFor). */
const prod = (n1: number, d1: number, n2: number, d2: number) => formatFrac(mulFrac({ n: n1, d: d1 }, { n: n2, d: d2 }));

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wTimesWhole = asWarmup(fracTimesWhole(), D11);
const wEquiv = asWarmup(fracEquivFill(), D9);

// --- Single-step "fraction OF a fraction" situations (fixed name-free hints) -----
const sitGardenArea = situation({
  situationType: 'area', cognitiveOp: 'frac-times-frac',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    return {
      prompt: `A garden bed is ${n1}/${d1} of a square metre. A gardener plants herbs in ${n2}/${d2} of the bed. What fraction of a square metre is herbs?`,
      answerValue: prod(n1, d1, n2, d2), templateId: 'd_frac_times_frac_v1', params: { n1, d1, n2, d2 },
      validation: 'equivalent-fraction', acceptableForms: [`${n1 * n2}/${d1 * d2}`],
      hints: ['Does covering a part OF the bed leave more than the whole bed, or less?', 'Overlap the two shadings on one square and count the double-shaded part.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const sitFieldPartWhole = situation({
  situationType: 'part-whole', cognitiveOp: 'frac-times-frac',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    return {
      prompt: `In a park, ${n1}/${d1} of a field is grass. Cows graze ${n2}/${d2} of the grassy part. What fraction of the whole field do the cows graze?`,
      answerValue: prod(n1, d1, n2, d2), templateId: 'd_frac_times_frac_v1', params: { n1, d1, n2, d2 },
      validation: 'equivalent-fraction', acceptableForms: [`${n1 * n2}/${d1 * d2}`],
      hints: ['Is the grazed strip the whole grassy part, or only a slice inside it?', 'Multiply the part you keep by the part of the field it sits in.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const sitClothMeasurement = situation({
  situationType: 'measurement', cognitiveOp: 'frac-times-frac',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    const name = r.pick(NAMES);
    return {
      prompt: `A ribbon is ${n1}/${d1} of a metre long. ${name} cuts off ${n2}/${d2} of the ribbon. How long is the cut piece, as a fraction of a metre?`,
      answerValue: prod(n1, d1, n2, d2), templateId: 'd_frac_times_frac_v1', params: { n1, d1, n2, d2 },
      validation: 'equivalent-fraction', acceptableForms: [`${n1 * n2}/${d1 * d2}`],
      hints: ['Which is bigger — the whole ribbon, or the little piece cut from part of it?', 'Lay the cut fraction along the ribbon fraction and read where they overlap.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// Metacognition base: only ever served through the estimate-first wrapper.
const sitJuiceMeasure = situation({
  situationType: 'measurement', cognitiveOp: 'frac-times-frac',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    const name = r.pick(NAMES);
    return {
      prompt: `A jug holds ${n1}/${d1} of a litre. ${name} drinks ${n2}/${d2} of what is in the jug. What fraction of a litre did ${name} drink?`,
      answerValue: prod(n1, d1, n2, d2), templateId: 'd_frac_times_frac_v1', params: { n1, d1, n2, d2 },
      validation: 'equivalent-fraction', acceptableForms: [`${n1 * n2}/${d1 * d2}`],
      hints: ['About how big is a part of a part — bigger or smaller than each fraction?', 'Picture one fraction of the jug, then a fraction of that.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const sitEstimate = withEstimateFirst(
  sitJuiceMeasure,
  'will a part OF a part land above or below each of the two fractions?',
);

// --- Multi-step: fraction OF a fraction THEN of a whole quantity ----------------
// initN/initD = the FIRST stated fraction; W = d1·d2·t guarantees a whole result.
const msFieldCorn = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    const W = d1 * d2 * r.int(1, 2);
    return {
      prompt: `A field is ${n1}/${d1} planted. Of the planted part, ${n2}/${d2} is corn. The whole field is ${W} hectares. How many hectares are corn?`,
      initN: n1, initD: d1, steps: [{ op: 'mul', n: n2, d: d2 }, { op: 'mul', n: W, d: 1 }],
      units: 'hectares', validation: 'exact-numeric',
      hints: ['Does the question want the whole planted part, or just the corn inside it?', 'Take the corn fraction of the planted part first, then that much of the whole field.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msWallPaint = multiStep({
  situationType: 'area', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    const W = d1 * d2 * r.int(1, 2);
    return {
      prompt: `A wall is ${n1}/${d1} painted. Of the painted area, ${n2}/${d2} gets a second coat. The whole wall is ${W} square metres. How many square metres get a second coat?`,
      initN: n1, initD: d1, steps: [{ op: 'mul', n: n2, d: d2 }, { op: 'mul', n: W, d: 1 }],
      units: 'square metres', validation: 'exact-numeric',
      hints: ['Which part matters here — all the paint, or only the second-coat piece of it?', 'Find the second-coat fraction of the painted area first, then that much of the whole wall.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msRecipe = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    const W = d1 * d2 * r.int(1, 2);
    return {
      prompt: `A recipe fills ${n1}/${d1} of a tray. A batch uses ${n2}/${d2} of the recipe. If a full tray holds ${W} cups, how many cups does the batch make?`,
      initN: n1, initD: d1, steps: [{ op: 'mul', n: n2, d: d2 }, { op: 'mul', n: W, d: 1 }],
      units: 'cups', validation: 'exact-numeric',
      hints: ['Is a batch the whole recipe, or only a fraction of the part it fills?', 'Scale down to the batch fraction first, then read it off the full tray amount.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps ("of" = multiply vs add; fixed name-free hints) --------
const discrimOfAmount = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    const product = prod(n1, d1, n2, d2);
    const sum = formatFrac(addFrac({ n: n1, d: d1 }, { n: n2, d: d2 }));
    const kept = formatFrac({ n: n2, d: d2 });
    return {
      prompt: `A poster is ${n1}/${d1} covered in stickers. You add glitter to ${n2}/${d2} OF the sticker area. Which fraction of the whole poster gets glitter?`,
      correct: product,
      distractors: [
        { text: sum, errorTag: 'task-comprehension', rationale: 'Added the fractions, but "of" a part means multiply — a part of a part is smaller, not a bigger total.' },
        { text: kept, errorTag: 'concept-misconception', rationale: 'Kept the whole sticker fraction, ignoring that only part of it gets glitter.' },
      ],
      hints: ['Does "OF the sticker area" grow the amount, or take a slice of what is there?', 'Shade the poster twice and keep only the cells shaded both times.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const discrimOfOp = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = coprimeNumerator(r, d1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = coprimeNumerator(r, d2);
    return {
      prompt: `In "${n1}/${d1} of ${n2}/${d2}", what does the word "of" tell you to do with the two fractions?`,
      correct: 'multiply the two fractions',
      distractors: [
        { text: 'add the two fractions', errorTag: 'task-comprehension', rationale: '"of" between fractions signals multiply; adding grows the amount instead of taking a part.' },
        { text: 'find a common denominator and add', errorTag: 'concept-misconception', rationale: 'Common denominators are the tool for adding, not for a part-of-a-part.' },
      ],
      hints: ['Does the word "of" point to a bigger total, or to a part taken from a part?', 'Try it on one square: a part of a part is an overlap, which is a multiply.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives correct + shown wrong) ----
const eaAddInsteadOfMultiply = errorAnalysis({
  verifyTemplateId: 'd_verify_frac_v1', cognitiveOp: 'frac-times-frac',
  drawParams: (r) => {
    const d1 = r.pick([2, 3, 4, 5]); const n1 = r.int(1, d1 - 1);
    const d2 = r.pick([2, 3, 4, 5]); const n2 = r.int(1, d2 - 1);
    return { n1, d1, n2, d2, op: '*', wrongMode: 'wrong-op-add' };
  },
  build: (v, p) => ({
    prompt: `A student worked out ${p.n1}/${p.d1} × ${p.n2}/${p.d2} and got ${v.wrong}.`,
    extension: 'Use an area square to show the real product, then explain in writing what the student did wrong and give the correct answer.',
    hints: ['Does a × between two fractions grow the amount, or take a part of a part?', 'Shade the square two ways and count the overlap, not the whole.'],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
});

export const buildD18 = makeWeekBuilder({
  week: 18,
  conceptId: 'multiplying-fractions',
  conceptName: 'Multiplying fractions',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D9, D11],
  pedagogyContract: 'v2',
  conceptualAnchor: 'area square',
  explanation: {
    hook: 'Half of three-quarters of a pizza is less than either — three-eighths. Surprising, because we expect multiplying to grow things. But "of" a fraction means taking a PART of a part, so the amount shrinks.',
    whyBeforeHow:
      'When a problem says two-thirds OF three-quarters, it wants a part of a part, and that is why an area square settles it: because "of" between fractions means multiply and never add, you shade 3/4 across the square and 2/3 of that down, and the double-shaded overlap IS the product. Counting the overlap gives six shaded cells out of twelve, which is exactly multiplying the tops together and the bottoms together. Taking a piece of a piece is why a fraction times a fraction below one lands smaller than either factor — the opposite of whole-number multiplying.',
    script: [
      {
        say: '2/3 × 3/4 asks for two-thirds OF three-quarters. I shade 3/4 across a square, then 2/3 of that strip down; the double-shaded overlap is the product.',
        visual: 'A unit square cut into twelve cells, shaded one way across and another way down, so the six double-shaded cells stand out where the two shadings meet.',
        figure: areaGrid(
          { rows: 3, cols: 4, shadedRows: 2, shadedCols: 3 },
          { alt: 'a square cut into three rows and four columns, with three of the four columns shaded one way and two of the three rows shaded the other, so six of the twelve cells carry both shadings and are ringed' },
        ),
      },
      {
        say: 'The overlap is six of twelve cells, so tops multiply (two times three) and bottoms multiply (three times four): the fraction is 6/12, which simplifies to 1/2.',
        visual: 'Six of twelve pieces filled on one bar, and the very same length shown as one half of two on the bar beneath it.',
        figure: barModel(
          [
            {
              label: '6/12',
              segments: [
                { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 },
                { value: 1, fill: 'none' }, { value: 1, fill: 'none' }, { value: 1, fill: 'none' },
                { value: 1, fill: 'none' }, { value: 1, fill: 'none' }, { value: 1, fill: 'none' },
              ],
            },
            { label: '1/2', segments: [{ value: 6 }, { value: 6, fill: 'none' }] },
          ],
          { scaleMax: 12, alt: 'a bar of twelve pieces with six filled, above a bar cut into just two pieces with one filled — the filled parts reach exactly the same length' },
        ),
      },
      {
        say: 'Before multiplying, estimate: a part of a part is smaller than either fraction, so a sensible answer sits below both — if it grew, I added by mistake.',
        visual: 'Three quarters drawn as a bar, and two thirds of that bar drawn shorter beneath it.',
        figure: barModel(
          [
            { label: '3/4', segments: [{ value: 9 }] },
            { label: '2/3 of it', segments: [{ value: 6 }] },
          ],
          { scaleMax: 12, alt: 'a bar reaching three quarters of the whole, and beneath it a shorter bar reaching only two thirds of that' },
        ),
      },
    ],
    summary: 'To multiply fractions, multiply the tops together and the bottoms together — the double-shaded overlap in an area square. A fraction OF a fraction is a part of a part, so the product is smaller than either factor.',
    vocabulary: [
      { term: 'of', kidGloss: 'the multiply signal for a fraction of an amount' },
      { term: 'area square', kidGloss: 'a unit square shaded two ways so the product is the overlap' },
      { term: 'part of a part', kidGloss: 'why a fraction product is smaller than either factor' },
    ],
  },
  guidedExamples: [
    ge(18, 1, 'modeled', '2/3 × 3/4.', [
      { teacherSay: 'I see the word "of" hiding inside the × — this is a part of a part, so let me shade an area square instead of guessing.' },
      { teacherSay: 'I shade 3/4 across, then 2/3 of that strip down, and count the overlap: six of the twelve little cells are double-shaded, which is 6/12.', expected: '6/12' },
    ], '1/2'),
    ge(18, 2, 'completion', '3/4 × 2/9.', [
      { teacherSay: 'Which operation does "of" signal here — add or multiply?', expected: 'multiply' },
      { childDo: 'Multiply tops and bottoms, then simplify.', expected: '1/6' },
    ], '1/6'),
    ge(18, 3, 'independent', '1/2 × 4/5. Solve cold and simplify.', [
      { childDo: 'Tops × tops, bottoms × bottoms, then simplify.', expected: '2/5' },
    ], '2/5'),
  ],
  days: [
    // Day 1 — concept echo: single-step "of a fraction" only, blocked
    [
      { gen: wMul, diff: 2 },
      { gen: wTimesWhole, diff: 2 },
      { gen: wEquiv, diff: 2 },
      { gen: sitGardenArea, diff: 2 },
      { gen: sitFieldPartWhole, diff: 3 },
      { gen: sitClothMeasurement, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination enter
    [
      { gen: wMul, diff: 2 },
      { gen: wEquiv, diff: 2 },
      { gen: sitEstimate, diff: 3 },
      { gen: discrimOfAmount, diff: 3 },
      { gen: sitFieldPartWhole, diff: 3 },
      { gen: msFieldCorn, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wTimesWhole, diff: 2 },
      { gen: sitGardenArea, diff: 3 },
      { gen: discrimOfOp, diff: 3 },
      { gen: discrimOfAmount, diff: 4 },
      { gen: msWallPaint, diff: 3 },
      { gen: msFieldCorn, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step)
    [
      { gen: msWallPaint, diff: 4 },
      { gen: msRecipe, diff: 4 },
      { gen: msRecipe, diff: 5 },
      { gen: sitClothMeasurement, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + classify + reasoning (+ ramped warm-up)
    [
      { gen: eaAddInsteadOfMultiply, diff: 4 },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: multiplying a positive amount by a fraction less than 1 makes it smaller. In one sentence, say how you know.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'A fraction below 1 always takes only a part, so the result is always smaller — it is not conditional.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reverses the rule — taking a part can never make an amount grow.' },
          ],
          hints: ['Does multiplying by a part make an amount grow, or shrink?', 'Picture a fraction of a fraction on one square — the overlap is the smaller piece.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain in writing why 1/2 × 3/4 is SMALLER than 3/4, using the words "part of".',
          value: 'it takes only half OF the 3/4, so it is a part of a part — smaller than 3/4',
          acceptableForms: ['part of', 'half of', 'smaller'],
          keywords: true,
          hints: ['Does taking half OF a fraction leave more, or less, than the fraction itself?', 'Compare the size of half a fraction with the fraction it came from.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Draw the area-square picture for 2/5 × 1/2, shade it two ways, and count the overlap to give the product.',
          value: 'shade 1/2 across and 2/5 down; the overlap is two of ten cells = 2/10 = 1/5',
          acceptableForms: ['2/10', '1/5'],
          keywords: true,
          hints: ['Which cells are the product — every shaded cell, or only the ones shaded twice?', 'Count the double-shaded cells over the total cells.'],
          errorTags: ['representation-misread', 'procedure-slip'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D18-PZ-01',
    title: 'Puzzle Grove: Shrinking Squares',
    puzzleType: 'math-art',
    prompt: 'Take one unit square. First shade 3/4 of it across, then 2/3 of THAT strip down, and read the overlap fraction. Now do it again starting from 1/2 and 4/5. Which starting pair leaves the SMALLER overlap, and what are the two overlap fractions?',
    answer: { value: 'overlaps 1/2 and 2/5; the 1/2 and 4/5 pair leaves the smaller overlap, 2/5', acceptableForms: ['1/2', '2/5'], validation: 'short-text-keyword' },
    hintLadder: ['Which shading leaves the smaller double-shaded patch?', 'Multiply each pair of tops and bottoms, then compare the two overlaps.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sitGardenArea, diff: 3 },
    { gen: msFieldCorn, diff: 3 },
    { gen: sitFieldPartWhole, diff: 3 },
    { gen: msWallPaint, diff: 3 },
    { gen: sitClothMeasurement, diff: 4 },
    { gen: msRecipe, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step "fraction OF a fraction" (area/part-whole/measurement; overlap affordance preserved). 02/04/06: two-step "fraction of a fraction THEN of a whole" (scale down, then read off the whole quantity). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'expects-bigger', description: 'Expects the product to grow, or adds instead of multiplying a fraction OF a fraction.', exampleWrongAnswer: '2/3 × 3/4 answered as 17/12 (added)', distractorRationale: 'Offer the add-the-fractions result.', reteachPointer: 'explanation/script[2] (a part of a part is smaller)' },
    { errorTag: 'task-comprehension', subtype: 'of-means-multiply', description: 'Misreads "of" as add (or leaves one fraction unchanged) in a word problem.', exampleWrongAnswer: '1/2 of 3/4 answered by adding to get 5/4', distractorRationale: 'Offer an added result on an "of" problem.', reteachPointer: 'explanation/script[0] ("of" is a multiply, shown on the area square)' },
    { errorTag: 'procedure-slip', subtype: 'no-simplify', description: 'Multiplies tops and bottoms correctly but leaves the product unsimplified.', exampleWrongAnswer: '6/12 left as 6/12', distractorRationale: 'Offer the unsimplified product.', reteachPointer: 'guidedExamples/D18-GE-02 (simplify at the end)' },
    { errorTag: 'representation-misread', subtype: 'overlap-miscount', description: 'Miscounts the shaded overlap in the area square (counts all shaded cells, not the double-shaded ones).', exampleWrongAnswer: 'counts 8/12 instead of 6/12', distractorRationale: 'Offer a mis-counted overlap.', reteachPointer: 'Day-5 area-square reasoning (shade across then down, count the overlap)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying fractions — multiplying tops together and bottoms together (the double-shaded overlap of an area square), and understanding why taking a fraction OF a fraction makes the amount smaller than either factor.',
    improvingCandidates: ['multiplying tops and bottoms', 'reading "of" as multiply', 'simplifying the product'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'that a fraction of a fraction SHRINKS — the area-square overlap makes this visible' },
      { errorTag: 'task-comprehension', text: 'reading "of" as a multiplication signal, not an add' },
      { errorTag: 'procedure-slip', text: 'simplifying the product to lowest terms' },
    ],
    homeFocus: {
      praiseLine: 'You shaded the square two ways and counted the overlap, so you saw at a glance that a part of a part is smaller than either piece — that picture is the whole idea.',
      questionForChild: 'Why is 2/3 × 3/4 less than 3/4 — what does the word "of" mean here?',
      schoolSyncHook: 'If your child\'s class uses area models for fraction multiplication, tell us and we will lead with that picture.',
    },
    vocabularyForParent: ['"of" (the multiply signal)', 'area square (product as the shaded overlap)', 'part of a part (why products shrink)'],
  },
});
