/**
 * Level D · Week 5 — "Area-model multiplication" (conceptId: area-model-multiplication).
 * 2- and 3-digit × 1-digit via break-apart / area model. Day-5: draw-the-model
 * (connect each partial product to its rectangle). Retrieval: D4, D2, C12.
 */

import { addWhole, asWarmup, classify, multiply, reasoning, storyMulCompare, storyMultiply } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D4 = { level: 'D' as const, week: 4 };

const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wCompare = asWarmup(storyMulCompare(), D4);

export const buildD05 = makeWeekBuilder({
  week: 5,
  conceptId: 'area-model-multiplication',
  conceptName: 'Area-model multiplication',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D2, D4],
  explanation: {
    hook: 'To multiply 6 × 47 in your head feels hard — until you break the 47 into 40 and 7, multiply each part, and snap the pieces back together. A rectangle shows exactly why that works.',
    whyBeforeHow:
      'Multiplication measures the area of a rectangle. Split one side by place value and the rectangle splits into smaller rectangles whose areas are the "partial products." Because the whole area is just the sum of its parts, 6 × 47 = 6 × 40 + 6 × 7. The area model is the picture; the standard algorithm is the same partials written compactly.',
    script: [
      { say: '6 × 47: draw a rectangle, cut the 47 side into 40 and 7. Two rooms: 6 × 40 = 240 and 6 × 7 = 42.', visual: 'A rectangle splits into a 6×40 room and a 6×7 room, each labeled.' },
      { say: 'Add the partial products: 240 + 42 = 282. The parts always add back to the whole area.', visual: 'The two room areas slide together into 282.' },
      { say: 'The standard algorithm records the SAME partials — just stacked. Estimate first: 6 × 50 ≈ 300, so 282 is reasonable.', visual: 'Area partials line up beside the stacked algorithm.' },
    ],
    summary: 'Break a factor by place, multiply each part (partial products), and add. The area rectangle shows why the parts recombine into the whole.',
    vocabulary: [
      { term: 'partial product', kidGloss: 'the area of one broken-apart piece' },
      { term: 'break apart', kidGloss: 'split a factor into place-value chunks' },
      { term: 'area model', kidGloss: 'a rectangle whose area is the product' },
    ],
  },
  guidedExamples: [
    ge(5, 1, 'modeled', '4 × 68 with the area model.', [
      { teacherSay: 'Split 68 into 60 and 8. Rooms: 4 × 60 = 240 and 4 × 8 = 32. Add: 272.', expected: '272' },
    ], '272'),
    ge(5, 2, 'prompted', '7 × 253 by breaking apart the 253.', [
      { teacherSay: 'Break 253 into which three place parts?', expected: '200, 50, 3' },
      { childDo: 'Multiply each by 7 and add.', expected: '1,771' },
    ], '1,771'),
    ge(5, 3, 'independent', '9 × 74. Solve cold with partials, then estimate to check.', [
      { childDo: 'Break 74, multiply each part by 9, add; estimate 9 × 70.', expected: '666' },
    ], '666'),
  ],
  days: [
    [
      { gen: wMulFact, diff: 2 },
      { gen: multiply(11, 49, 3, 9), diff: 2 },
      { gen: multiply(51, 99, 3, 9), diff: 3 },
      { gen: storyMultiply(), diff: 3 },
      { gen: multiply(11, 49, 3, 9), diff: 3 },
      { gen: multiply(101, 499, 3, 9), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: multiply(51, 99, 3, 9), diff: 3 },
      { gen: multiply(101, 499, 3, 9), diff: 3 },
      { gen: storyMultiply(), diff: 4 },
      { gen: multiply(501, 899, 3, 9), diff: 4 },
    ],
    [
      { gen: wCompare, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: multiply(11, 49, 3, 9), diff: 3 },
      { gen: multiply(101, 499, 3, 9), diff: 3 },
      { gen: multiply(501, 899, 3, 9), diff: 4 },
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
          prompt: 'For 6 × 34, name the two partial products and show they add to the whole. Use the word "rectangle".',
          value: '6 × 30 = 180 and 6 × 4 = 24; the two rectangles add to 204',
          acceptableForms: ['180', '24', 'rectangle', 'partial'],
          keywords: true,
          hints: ['Split 34 into 30 and 4.', 'Each part is one smaller rectangle of the whole.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'A student split 8 × 53 as 8 × 50 and 8 × 3, getting 400 and 24, then wrote 424. Is that right?',
          correct: 'yes, 424 is correct',
          distractors: [
            { text: 'no, a partial product is missing', errorTag: 'concept-misconception', rationale: 'Assumes an error where the partials are actually complete.' },
            { text: 'no, they should multiply the parts together', errorTag: 'concept-misconception', rationale: 'Misreads break-apart as multiplying the pieces by each other.' },
          ],
          hints: ['Do 50 and 3 rebuild 53?', 'Add the two partials and compare.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why breaking 47 into 40 and 7 (not 20 and 27) is the tidiest split for 6 × 47. (Written explanation required.)',
          value: 'splitting by place value keeps the partials easy to multiply and add',
          acceptableForms: [],
          hints: ['Which split gives round tens?', 'Place-value chunks multiply most easily.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Draw the area model for 5 × 126 and label every room with its partial product, then give the total. (Show your rectangle.)',
          value: '5×100=500, 5×20=100, 5×6=30; total 630',
          acceptableForms: ['500', '100', '30', '630'],
          keywords: true,
          hints: ['Break 126 into 100, 20, 6.', 'Three rooms; add all three areas.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D5-PZ-01',
    title: 'Puzzle Grove: Room by Room',
    puzzleType: 'construction',
    prompt: 'A rectangle for 7 × 68 is cut into two rooms. One room\'s area is 490. What is the other room\'s area, and what split of 68 gives these two rooms?',
    answer: { value: 'the other room is 56; the split is 70 and −2, or check 60 and 8 gives 420 and 56', acceptableForms: ['56'], validation: 'short-text-keyword' },
    hintLadder: ['490 ÷ 7 tells you one part of 68.', 'The two parts must add back to 68.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: multiply(11, 49, 3, 9), diff: 3 },
    { gen: multiply(51, 99, 3, 9), diff: 3 },
    { gen: multiply(101, 499, 3, 9), diff: 3 },
    { gen: storyMultiply(), diff: 3 },
    { gen: multiply(501, 899, 3, 9), diff: 4 },
    { gen: multiply(101, 499, 3, 9), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/02: 2-digit × 1-digit. 03/05/06: 3-digit × 1-digit. 04: equal-groups multiplication story. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'missing-partial', description: 'Drops one partial product (multiplies only the tens, forgets the ones, or vice versa).', exampleWrongAnswer: '6 × 47 → 240 (only 6 × 40)', distractorRationale: 'Offer a single-partial result.', reteachPointer: 'guidedExamples/D5-GE-01 (every room counts)' },
    { errorTag: 'procedure-slip', subtype: 'partial-add-slip', description: 'Computes the partials but adds them wrong.', exampleWrongAnswer: '240 + 42 → 272→282 slip', distractorRationale: 'Offer a near-miss sum of correct partials.', reteachPointer: 'explanation/script[1] (parts recombine to the whole)' },
    { errorTag: 'fact-recall', subtype: 'place-mult-slip', description: 'Multiplies a place part wrong (6 × 40 → 24 instead of 240).', exampleWrongAnswer: '6 × 40 → 24', distractorRationale: 'Offer the dropped-zero partial.', reteachPointer: '60-second ×-by-tens refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying by breaking a number into place-value parts (the area model) — multiply each part, then add the partial products; the rectangle shows why the pieces recombine.',
    improvingCandidates: ['breaking a factor into place-value parts', 'multiplying each partial and adding', 'connecting the area rectangle to the numbers'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'including EVERY partial product — the area-model warm-ups keep all rooms in view' },
      { errorTag: 'fact-recall', text: 'multiplying by tens and hundreds cleanly (6 × 40 = 240) — the sprints keep facts fast' },
      { errorTag: 'procedure-slip', text: 'adding the partials accurately at the end' },
    ],
    homeFocus: {
      praiseLine: 'You broke 47 into 40 and 7, multiplied each, and added them back perfectly — that is the whole area-model idea in action.',
      questionForChild: 'For 6 × 34, what are the two partial products — and how do they add up to the answer?',
      schoolSyncHook: 'If your child\'s class uses a grid or box method, tell us and we will match that layout.',
    },
    vocabularyForParent: ['partial product (area of one broken-apart piece)', 'break apart (split by place value)', 'area model (rectangle whose area is the product)'],
  },
});
