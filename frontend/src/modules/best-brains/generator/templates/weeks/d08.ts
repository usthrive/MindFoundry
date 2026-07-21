/**
 * Level D · Week 8 — "2-digit × 2-digit" (conceptId: two-digit-by-two-digit).
 * Area model with four partial products → standard algorithm. Day-5:
 * which-partial-went-missing error analysis. Retrieval: D5 area model, D6 ÷, C12 × facts.
 */

import { asWarmup, classify, divideRemainder, multiply, reasoning, storyMultiply } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D5 = { level: 'D' as const, week: 5 };
const D6 = { level: 'D' as const, week: 6 };

const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wArea = asWarmup(multiply(11, 49, 3, 9), D5);
const wDiv = asWarmup(divideRemainder(3, 9, 20, 89), D6);

export const buildD08 = makeWeekBuilder({
  week: 8,
  conceptId: 'two-digit-by-two-digit',
  conceptName: 'Two-digit × two-digit multiplication',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D5, D6],
  explanation: {
    hook: 'A rectangle for 23 × 47 splits into FOUR rooms, not two. Miss one room and the answer is quietly wrong — so this week is really about accounting for every partial product.',
    whyBeforeHow:
      'When BOTH factors are broken by place, the area rectangle cuts into four smaller rectangles: tens×tens, tens×ones, ones×tens, ones×ones. The product is the sum of all four areas. The standard algorithm packs these four partials into two rows, but the four-room picture is what keeps a partial from going missing.',
    script: [
      { say: '23 × 47: split into 20+3 and 40+7. Four rooms: 20×40=800, 20×7=140, 3×40=120, 3×7=21.', visual: 'A rectangle cuts into four labeled rooms.' },
      { say: 'Add all four: 800 + 140 + 120 + 21 = 1,081. Every room must be counted.', visual: 'Four areas sum to 1,081.' },
      { say: 'The stacked algorithm hides the four partials in two rows — estimate (20 × 50 = 1,000) to check none slipped.', visual: 'Four rooms fold into the two-row algorithm.' },
    ],
    summary: 'Break both factors by place: four partial products (tens×tens down to ones×ones), then add all four. Estimate to catch a missing room.',
    vocabulary: [
      { term: 'partial product', kidGloss: 'the area of one of the four rooms' },
      { term: 'four rooms', kidGloss: 'the four rectangles when both sides are split' },
      { term: 'estimate', kidGloss: 'a rounded check that catches a missing partial' },
    ],
  },
  guidedExamples: [
    ge(8, 1, 'modeled', '24 × 36 with four partial products.', [
      { teacherSay: 'Rooms: 20×30=600, 20×6=120, 4×30=120, 4×6=24. Sum: 864.', expected: '864' },
    ], '864'),
    ge(8, 2, 'prompted', '52 × 18.', [
      { teacherSay: 'Split into 50+2 and 10+8. Which four products?', expected: '500, 400, 20, 16' },
      { childDo: 'Add them.', expected: '936' },
    ], '936'),
    ge(8, 3, 'independent', '47 × 29. Solve cold, then estimate to check.', [
      { childDo: 'Four partials, add, then check with 50 × 30.', expected: '1,363' },
    ], '1,363'),
  ],
  days: [
    [
      { gen: wMulFact, diff: 2 },
      { gen: multiply(11, 29, 11, 29), diff: 2 },
      { gen: multiply(21, 49, 12, 39), diff: 3 },
      { gen: storyMultiply(), diff: 3 },
      { gen: multiply(11, 29, 11, 29), diff: 3 },
      { gen: multiply(31, 79, 21, 69), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: multiply(21, 49, 12, 39), diff: 3 },
      { gen: multiply(31, 79, 21, 69), diff: 3 },
      { gen: storyMultiply(), diff: 4 },
      { gen: multiply(41, 89, 31, 79), diff: 4 },
    ],
    [
      { gen: wDiv, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: multiply(11, 29, 11, 29), diff: 3 },
      { gen: multiply(31, 79, 21, 69), diff: 3 },
      { gen: multiply(41, 89, 31, 79), diff: 4 },
      { gen: storyMultiply(), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: storyMultiply(), diff: 4 },
      { gen: storyMultiply(), diff: 4 },
      { gen: storyMultiply(), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'List all four partial products for 23 × 45 and add them. Use the word "room".',
          value: '20×40=800, 20×5=100, 3×40=120, 3×5=15; four rooms total 1,035',
          acceptableForms: ['800', '100', '120', '15', 'room'],
          keywords: true,
          hints: ['Split both factors by place.', 'There are four rooms — count each.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'A student multiplied 32 × 21 and got 674 by using only 30×20, 2×20, and 2×1. Which partial went missing?',
          correct: '30 × 1 (the tens-times-ones room)',
          distractors: [
            { text: 'none — 674 is correct', errorTag: 'concept-misconception', rationale: 'Accepts a three-room answer as complete.' },
            { text: '2 × 1', errorTag: 'representation-misread', rationale: 'Names a room that WAS included.' },
          ],
          hints: ['There should be four rooms; three were used.', 'Which factor-pair of places is absent?'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Why does 2-digit × 2-digit give four partial products, while 2-digit × 1-digit gives only two? Explain with the rectangle. (Written explanation required.)',
          value: 'splitting both sides makes 2×2 rooms; splitting one side makes 2×1 rooms',
          acceptableForms: [],
          hints: ['How many pieces does each side split into?', 'Rooms = pieces on one side × pieces on the other.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Estimate 38 × 52 by rounding, then say whether an exact answer of 1,976 is reasonable. Show your estimate.',
          value: '40 × 50 = 2,000, so 1,976 is reasonable',
          acceptableForms: ['2000', '2,000', 'reasonable'],
          keywords: true,
          hints: ['Round each factor to the nearest ten.', 'Is the exact answer near the estimate?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D8-PZ-01',
    title: 'Puzzle Grove: The Missing Room',
    puzzleType: 'error-analysis',
    prompt: 'For 26 × 34, three rooms are 600, 180, and 24. One room is missing and the false total is 804. Find the missing partial product and the true total.',
    answer: { value: 'missing room 20 × 4 = 80; true total 884', acceptableForms: ['80', '884'], validation: 'short-text-keyword' },
    hintLadder: ['Split both factors: 20+6 and 30+4. Which four rooms?', 'Compare the four to the three given.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: multiply(11, 29, 11, 29), diff: 3 },
    { gen: multiply(21, 49, 12, 39), diff: 3 },
    { gen: multiply(31, 79, 21, 69), diff: 3 },
    { gen: storyMultiply(), diff: 3 },
    { gen: multiply(41, 89, 31, 79), diff: 4 },
    { gen: multiply(21, 49, 12, 39), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01–03/05/06: 2-digit × 2-digit products (four-partial affordance preserved). 04: equal-groups multiplication story. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'missing-partial', description: 'Uses only three of the four partial products (typically drops tens×ones or ones×tens).', exampleWrongAnswer: '32 × 21 → 674 (missing 30 × 1)', distractorRationale: 'Offer a three-room total.', reteachPointer: 'explanation/script[0] (four rooms, always)' },
    { errorTag: 'procedure-slip', subtype: 'partial-sum-slip', description: 'Finds all four partials but adds them incorrectly.', exampleWrongAnswer: '800+140+120+21 → 1,071', distractorRationale: 'Offer a near-miss total of correct partials.', reteachPointer: 'guidedExamples/D8-GE-01 (add all four)' },
    { errorTag: 'representation-misread', subtype: 'place-shift', description: 'Forgets a partial\'s place value (writes tens×tens without its zeros).', exampleWrongAnswer: '20 × 40 → 80 instead of 800', distractorRationale: 'Offer the place-shifted partial.', reteachPointer: 'D5 review (×-by-tens keeps its zeros)' },
    { errorTag: 'fact-recall', subtype: 'basic-fact-slip', description: 'A single-digit fact inside a partial is wrong.', exampleWrongAnswer: '3 × 7 → 24', distractorRationale: 'Offer an adjacent product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Two-digit by two-digit multiplication — breaking both numbers by place into four partial products (four "rooms" of a rectangle), then adding all four, with an estimate to catch a missing room.',
    improvingCandidates: ['finding all four partial products', 'adding the four partials correctly', 'estimating to check the product'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'accounting for all FOUR rooms — the missing-room warm-ups drill exactly this' },
      { errorTag: 'representation-misread', text: 'keeping each partial\'s place value (20 × 40 is 800, not 80)' },
      { errorTag: 'fact-recall', text: 'quick single-digit facts inside each partial — the sprints keep them sharp' },
    ],
    homeFocus: {
      praiseLine: 'You caught the missing room in 32 × 21 — spotting the absent partial product is exactly the skill that makes two-digit multiplication reliable.',
      questionForChild: 'For 23 × 45, what are the four partial products — and how do they add to the answer?',
      schoolSyncHook: 'If your child\'s class uses the box/grid method or the stacked algorithm, tell us and we will lead with that one.',
    },
    vocabularyForParent: ['partial product (area of one room)', 'four rooms (both factors split by place)', 'estimate (a rounded check)'],
  },
});
