/**
 * Level D · Week 18 — "Multiplying fractions" (conceptId: multiplying-fractions).
 * a/b × c/d via area model; fraction of a fraction. Day-5: does multiplying
 * always make bigger? Always/Sometimes/Never. Retrieval: D11 frac×whole, D9 equivalence, C12 × facts.
 */

import { asWarmup, classify, fracEquivFill, fracTimesFrac, fracTimesWhole, multiply, reasoning, storyFracOfFrac } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D9 = { level: 'D' as const, week: 9 };
const D11 = { level: 'D' as const, week: 11 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wTimesWhole = asWarmup(fracTimesWhole(), D11);
const wEquiv = asWarmup(fracEquivFill(), D9);

export const buildD18 = makeWeekBuilder({
  week: 18,
  conceptId: 'multiplying-fractions',
  conceptName: 'Multiplying fractions',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D9, D11],
  explanation: {
    hook: 'Half of three-quarters of a pizza is less than either — 3/8. Surprising, because we expect multiplying to grow things. But "of" a fraction means taking a PART of a part, so the result shrinks.',
    whyBeforeHow:
      '2/3 × 3/4 asks for "two-thirds OF three-quarters." Picture a square: shade 3/4 across, then 2/3 down — the overlap is the product. Counting the overlap cells gives (2×3) shaded out of (3×4) total, so you multiply tops and bottoms. Because you are taking a piece of a piece, multiplying by a fraction below 1 makes the amount smaller — the opposite of whole-number multiplying.',
    script: [
      { say: '2/3 × 3/4: shade 3/4 of a square across, then 2/3 of that down. The overlap is 6 of 12 cells = 6/12 = 1/2.', visual: 'A unit square shaded two ways; the overlap counts out 6/12.' },
      { say: 'So multiply tops (2×3=6) and bottoms (3×4=12): 6/12, which simplifies to 1/2.', visual: 'Tops and bottoms multiply; 6/12 collapses to 1/2.' },
      { say: 'A part of a part is smaller: 1/2 of 3/4 is only 3/8, less than 3/4.', visual: 'A shrinking bar shows the part-of-a-part.' },
    ],
    summary: 'To multiply fractions, multiply tops together and bottoms together (the overlap in an area square). Taking a fraction OF a fraction shrinks the amount.',
    vocabulary: [
      { term: 'of', kidGloss: 'the multiply signal for a fraction of an amount' },
      { term: 'area square', kidGloss: 'a unit square shaded two ways to show the product' },
      { term: 'part of a part', kidGloss: 'why a fraction product is smaller' },
    ],
  },
  guidedExamples: [
    ge(18, 1, 'modeled', '2/3 × 3/5.', [
      { teacherSay: 'Tops: 2 × 3 = 6. Bottoms: 3 × 5 = 15. So 6/15, which simplifies to 2/5.', expected: '2/5' },
    ], '2/5'),
    ge(18, 2, 'prompted', '3/4 × 2/9.', [
      { teacherSay: 'Multiply tops and bottoms.', expected: '6/36' },
      { childDo: 'Simplify.', expected: '1/6' },
    ], '1/6'),
    ge(18, 3, 'independent', '1/2 × 4/5. Solve cold and simplify.', [
      { childDo: 'Tops × tops, bottoms × bottoms, then simplify.', expected: '2/5' },
    ], '2/5'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: fracTimesFrac(), diff: 2 },
      { gen: fracTimesFrac(), diff: 3 },
      { gen: fracTimesFrac(), diff: 3 },
      { gen: fracTimesFrac(), diff: 3 },
      { gen: fracTimesFrac(), diff: 4 },
    ],
    [
      { gen: wTimesWhole, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracTimesFrac(), diff: 3 },
      { gen: fracTimesFrac(), diff: 3 },
      { gen: storyFracOfFrac(), diff: 4 },
      { gen: fracTimesFrac(), diff: 4 },
    ],
    [
      { gen: wEquiv, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracTimesFrac(), diff: 3 },
      { gen: fracTimesFrac(), diff: 3 },
      { gen: storyFracOfFrac(), diff: 4 },
      { gen: fracTimesFrac(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyFracOfFrac(), diff: 4 },
      { gen: storyFracOfFrac(), diff: 4 },
      { gen: storyFracOfFrac(), diff: 5 },
    ],
    [
      {
        gen: classify({
          prompt: 'Always/sometimes/never: multiplying a positive number by a fraction less than 1 makes it smaller.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'A fraction below 1 always shrinks a positive amount — it is not conditional.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reverses the truth — taking a part always shrinks.' },
          ],
          hints: ['Taking a part of something leaves less.', 'Try 1/2 of 8, or 3/4 of 8.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why 1/2 × 3/4 is SMALLER than 3/4, using the words "part of". (Written explanation required.)',
          value: 'it takes only half OF the 3/4, so it is a part of a part — smaller',
          acceptableForms: ['part of', 'half of', 'smaller'],
          keywords: true,
          hints: ['What does "half of 3/4" mean?', 'Is a part of 3/4 more or less than 3/4?'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Draw the area-square picture for 2/5 × 1/2 and count the shaded overlap to give the product. (Show your square.)',
          value: 'shade 1/2 across and 2/5 down; overlap is 2 of 10 cells = 2/10 = 1/5',
          acceptableForms: ['2/10', '1/5'],
          keywords: true,
          hints: ['Shade one fraction across, the other down.', 'Count the double-shaded cells over the total.'],
          errorTags: ['representation-misread', 'procedure-slip'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'When is a fraction product GREATER than both factors? Choose the true statement.',
          correct: 'never, when both factors are between 0 and 1',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Applies whole-number intuition to proper fractions.' },
            { text: 'when the denominators are large', errorTag: 'representation-misread', rationale: 'Denominator size does not reverse the shrink.' },
          ],
          hints: ['A part of a part is smaller than each part.', 'Test 1/2 × 1/2.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D18-PZ-01',
    title: 'Puzzle Grove: Shrinking Squares',
    puzzleType: 'math-art',
    prompt: 'Using one unit square, shade to show 3/4 × 2/3. Report the overlap fraction, then explain why the product is smaller than both 3/4 and 2/3.',
    answer: { value: 'overlap 6/12 = 1/2; a part of a part is smaller than each part', acceptableForms: ['6/12', '1/2'], validation: 'short-text-keyword' },
    hintLadder: ['Shade one fraction across, the other down.', 'The double-shaded region is the product.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fracTimesFrac(), diff: 3 },
    { gen: fracTimesFrac(), diff: 3 },
    { gen: fracTimesFrac(), diff: 3 },
    { gen: storyFracOfFrac(), diff: 3 },
    { gen: fracTimesFrac(), diff: 4 },
    { gen: fracTimesFrac(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01–03/05/06: fraction × fraction (simplify affordance preserved). 04: fraction-of-a-fraction word problem. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'cross-add', description: 'Adds instead of multiplying, or expects the product to grow.', exampleWrongAnswer: '2/3 × 3/4 → 5/7', distractorRationale: 'Offer an add-the-fractions result.', reteachPointer: 'explanation/script[1] (multiply tops and bottoms)' },
    { errorTag: 'procedure-slip', subtype: 'no-simplify', description: 'Multiplies correctly but leaves the result unsimplified.', exampleWrongAnswer: '6/12 left as 6/12', distractorRationale: 'Offer the unsimplified product.', reteachPointer: 'guidedExamples/D18-GE-02 (simplify at the end)' },
    { errorTag: 'representation-misread', subtype: 'overlap-miscount', description: 'Miscounts the shaded overlap in the area square.', exampleWrongAnswer: 'counts 8/12 instead of 6/12', distractorRationale: 'Offer a mis-counted overlap.', reteachPointer: 'Day-5 reasoning (shade across then down)' },
    { errorTag: 'task-comprehension', subtype: 'of-means-multiply', description: 'Misreads "of" as add or subtract in a word problem.', exampleWrongAnswer: '1/2 of 3/4 answered by adding', distractorRationale: 'Offer an added result on an "of" problem.', reteachPointer: 'storyFracOfFrac ("of" signals multiply)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying fractions — multiplying tops together and bottoms together (the overlap of a shaded area square), and understanding why taking a fraction OF a fraction makes the amount smaller.',
    improvingCandidates: ['multiplying tops and bottoms', 'reading "of" as multiply', 'simplifying the product'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'that a fraction of a fraction SHRINKS — the area-square warm-ups make this visible' },
      { errorTag: 'procedure-slip', text: 'simplifying the product to lowest terms' },
      { errorTag: 'task-comprehension', text: 'reading "of" as a multiplication signal' },
    ],
    homeFocus: {
      praiseLine: 'You saw that 1/2 of 3/4 is only 3/8 — smaller than either — because it is a part of a part. That is the deep idea of this week.',
      questionForChild: 'Why is 2/3 × 3/4 less than 3/4 — what does "of" mean here?',
      schoolSyncHook: 'If your child\'s class uses area models for fraction multiplication, tell us and we will lead with that picture.',
    },
    vocabularyForParent: ['"of" (the multiply signal)', 'area square (product as shaded overlap)', 'part of a part (why products shrink)'],
  },
});
