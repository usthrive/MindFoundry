/**
 * Level D · Week 11 — "Fraction × whole number" (conceptId: fraction-times-whole).
 * n × a/b via unit-fraction bricks; word problems. Day-5: recipe-scaling reasoning.
 * Retrieval: D10 like-denominator ±, D9 equivalence, C12 × facts.
 */

import { asWarmup, classify, fracAddSubLike, fracEquivFill, fracTimesWhole, multiply, reasoning, storyFracTimesWhole } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D9 = { level: 'D' as const, week: 9 };
const D10 = { level: 'D' as const, week: 10 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wLike = asWarmup(fracAddSubLike(1), D10);
const wEquiv = asWarmup(fracEquivFill(), D9);

export const buildD11 = makeWeekBuilder({
  week: 11,
  conceptId: 'fraction-times-whole',
  conceptName: 'Fraction × whole number',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D9, D10],
  explanation: {
    hook: '3 × 2/5 is just three helpings of 2/5 — six fifth-pieces in all. Multiplying a fraction by a whole number is repeated addition wearing a shorter name.',
    whyBeforeHow:
      'A fraction is built from unit-fraction bricks: 2/5 is two 1/5-bricks. Taking it 3 times gives 3 × 2 = 6 of those 1/5-bricks — the brick size never changes, only how many you have. So multiply the top by the whole number and keep the bottom. Because you are stacking pieces smaller than one, the result grows past 1 as a mixed number.',
    script: [
      { say: '3 × 2/5: three copies of two fifth-bricks = six fifth-bricks = 6/5 = 1 1/5.', visual: 'Three groups of two fifth-bricks line up into 6/5.' },
      { say: 'Only the count (top) is multiplied; the brick-size (bottom) holds still.', visual: 'The 5 stays fixed while the top count grows.' },
      { say: 'Recipe use: 4 batches each needing 3/4 cup means 4 × 3/4 = 12/4 = 3 cups.', visual: 'Four 3/4-cup scoops fill three cups.' },
    ],
    summary: 'n × a/b stacks n copies of a/b: multiply the top by n, keep the bottom. Convert an over-one result to a mixed number.',
    vocabulary: [
      { term: 'unit-fraction brick', kidGloss: 'one piece, like 1/5, that builds the fraction' },
      { term: 'repeated addition', kidGloss: 'copies of the same fraction added up' },
      { term: 'mixed number', kidGloss: 'a whole part and a fraction part together' },
    ],
  },
  guidedExamples: [
    ge(11, 1, 'modeled', '4 × 2/3.', [
      { teacherSay: 'Four copies of two thirds = eight thirds = 8/3 = 2 2/3.', expected: '8/3' },
    ], '2 2/3'),
    ge(11, 2, 'prompted', '5 × 3/8.', [
      { teacherSay: 'Multiply the top by 5; keep the eighths.', expected: '15/8' },
      { childDo: 'Write as a mixed number.', expected: '1 7/8' },
    ], '1 7/8'),
    ge(11, 3, 'independent', '6 × 5/6. Solve cold.', [
      { childDo: 'Multiply the top by 6, keep the sixths, simplify.', expected: '5' },
    ], '5'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: fracTimesWhole(), diff: 2 },
      { gen: fracTimesWhole(), diff: 3 },
      { gen: fracTimesWhole(), diff: 3 },
      { gen: fracTimesWhole(), diff: 3 },
      { gen: fracTimesWhole(), diff: 4 },
    ],
    [
      { gen: wLike, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracTimesWhole(), diff: 3 },
      { gen: fracTimesWhole(), diff: 3 },
      { gen: storyFracTimesWhole(), diff: 4 },
      { gen: fracTimesWhole(), diff: 4 },
    ],
    [
      { gen: wEquiv, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracTimesWhole(), diff: 3 },
      { gen: fracTimesWhole(), diff: 3 },
      { gen: storyFracTimesWhole(), diff: 4 },
      { gen: fracTimesWhole(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyFracTimesWhole(), diff: 4 },
      { gen: storyFracTimesWhole(), diff: 4 },
      { gen: storyFracTimesWhole(), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'Explain why 3 × 2/5 keeps fifths (not fifteenths). Use the phrase "brick size".',
          value: 'the brick size stays 1/5; only the number of bricks grows',
          acceptableForms: ['brick', 'fifths', 'top'],
          keywords: true,
          hints: ['What is being copied — the pieces or the piece-size?', 'Only the count changes.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Is "multiplying always makes a number bigger" always, sometimes, or never true?',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Multiplying by a fraction less than 1 makes it smaller — but this week we multiply by whole numbers, which do grow it.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Multiplying by a whole number more than 1 clearly grows it.' },
          ],
          hints: ['Try 3 × 2/5 versus 1/2 × 6.', 'It depends on the multiplier.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'A recipe needs 2/3 cup of oats per batch. Scale it for 5 batches and explain whether the answer should be more or less than 3 cups. (Written explanation required.)',
          value: '5 × 2/3 = 10/3 = 3 1/3 cups, a bit more than 3',
          acceptableForms: ['10/3', '3 1/3'],
          keywords: true,
          hints: ['Five copies of 2/3.', 'Estimate: 5 × 2/3 is near 5 × 0.7.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Show two ways to compute 4 × 3/8 — as repeated addition and as top-times-whole — and confirm they match. (Written work required.)',
          value: '3/8+3/8+3/8+3/8 = 12/8 and 4×3/8 = 12/8 = 1 1/2',
          acceptableForms: ['12/8', '1 1/2'],
          keywords: true,
          hints: ['Add four copies of 3/8.', 'Then multiply the top by 4.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D11-PZ-01',
    title: 'Puzzle Grove: Batch Planner',
    puzzleType: 'construction',
    prompt: 'A muffin batch uses 3/4 cup of flour. You have exactly 6 cups. How many whole batches can you make, and how much flour is left over? Show the multiplication and the leftover.',
    answer: { value: '8 batches use 24/4 = 6 cups exactly, so none left over', acceptableForms: ['8'], validation: 'short-text-keyword' },
    hintLadder: ['How many 3/4-cups are in 6 cups?', 'Multiply up: 3/4 × how many reaches 6?'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fracTimesWhole(), diff: 3 },
    { gen: fracTimesWhole(), diff: 3 },
    { gen: fracTimesWhole(), diff: 3 },
    { gen: storyFracTimesWhole(), diff: 3 },
    { gen: fracTimesWhole(), diff: 4 },
    { gen: fracTimesWhole(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01–03/05/06: whole × fraction (mixed-number-result affordance preserved). 04: recipe-scaling word problem. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'multiply-bottom-too', description: 'Multiplies the whole number into the denominator as well (3 × 2/5 = 6/15).', exampleWrongAnswer: '3 × 2/5 → 6/15', distractorRationale: 'Offer the bottom-multiplied result.', reteachPointer: 'explanation/script[1] (only the count grows)' },
    { errorTag: 'procedure-slip', subtype: 'improper-not-converted', description: 'Leaves an over-one result improper (or converts it wrongly).', exampleWrongAnswer: '8/3 left as 8/3 when a mixed number is asked', distractorRationale: 'Offer a mis-converted mixed number.', reteachPointer: 'guidedExamples/D11-GE-01 (8/3 = 2 2/3)' },
    { errorTag: 'fact-recall', subtype: 'top-times-slip', description: 'Slips on the whole-number × top multiplication.', exampleWrongAnswer: '5 × 3 → 18', distractorRationale: 'Offer an adjacent numerator product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
    { errorTag: 'task-comprehension', subtype: 'does-multiplying-grow', description: 'Over-generalizes "multiplying makes bigger" without checking the multiplier (whole vs fraction).', exampleWrongAnswer: 'claims 1/2 × 6 must be larger than 6', distractorRationale: 'Offer "always" on the does-multiplying-grow claim.', reteachPointer: 'Day-5 classify (it depends on the multiplier)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying a fraction by a whole number — stacking copies of the fraction (repeated addition), multiplying the top by the whole number and keeping the bottom, then writing over-one results as mixed numbers.',
    improvingCandidates: ['multiplying the numerator by the whole number', 'keeping the denominator fixed', 'converting improper results to mixed numbers'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'multiplying ONLY the top, not the bottom — the unit-brick warm-ups reinforce this' },
      { errorTag: 'procedure-slip', text: 'turning an over-one answer into a tidy mixed number' },
      { errorTag: 'fact-recall', text: 'quick multiplication of the top by the whole number — the sprints keep facts fast' },
    ],
    homeFocus: {
      praiseLine: 'You treated 3 × 2/5 as three helpings of 2/5 — six fifth-bricks — and kept the fifths. That is exactly right.',
      questionForChild: 'For 5 × 3/8, what do you multiply, and what stays the same?',
      schoolSyncHook: 'If your child\'s class links this to repeated addition or to areas, tell us and we will lead with that view.',
    },
    vocabularyForParent: ['unit-fraction brick (one piece like 1/5)', 'repeated addition (copies added up)', 'mixed number (whole + fraction)'],
  },
});
