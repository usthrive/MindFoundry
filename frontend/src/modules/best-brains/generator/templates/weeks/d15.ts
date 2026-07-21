/**
 * Level D · Week 15 — "Multi-digit × fluency" (conceptId: multi-digit-multiplication-fluency).
 * Standard algorithm 3-digit × 2-digit; estimation as a check. Day-5: reconcile
 * area-model vs algorithm line by line. Retrieval: D8 2×2, D5 area model, C12 × facts.
 */

import { asWarmup, classify, divideRemainder, multiply, reasoning, storyMultiply } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D5 = { level: 'D' as const, week: 5 };
const D6 = { level: 'D' as const, week: 6 };
const D8 = { level: 'D' as const, week: 8 };

const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wTwoByOne = asWarmup(multiply(11, 49, 3, 9), D5);
const wTwoByTwo = asWarmup(multiply(11, 29, 11, 29), D8);
const wDiv = asWarmup(divideRemainder(3, 9, 20, 89), D6);

export const buildD15 = makeWeekBuilder({
  week: 15,
  conceptId: 'multi-digit-multiplication-fluency',
  conceptName: 'Multi-digit multiplication fluency',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D5, D8],
  explanation: {
    hook: '243 × 57 looks intimidating, but it is the four-room idea stretched wider: break each factor by place, multiply the parts, and add. The area model and the tidy algorithm are the SAME work in two outfits.',
    whyBeforeHow:
      'A 3-digit × 2-digit product is a big rectangle cut into place-value rooms; the algorithm just records those partial products in stacked rows and adds. Fluency means doing this without losing a partial or a place. An estimate — round both factors — brackets the answer so a slipped zero or dropped row shows up immediately.',
    script: [
      { say: '243 × 57: multiply 243 × 7, then 243 × 50, and add. Each row is a bundle of partial products.', visual: 'Two algorithm rows form; their partials tie back to rooms.' },
      { say: 'The 50-row ends in a 0 because you are multiplying by a ten — that placeholder keeps the places honest.', visual: 'The placeholder zero slides into the second row.' },
      { say: 'Estimate: 240 × 60 ≈ 14,400. If the exact answer lands far from that, hunt for the slip.', visual: 'A rounded bracket brackets the exact answer.' },
    ],
    summary: 'Break both factors by place, multiply row by row (with the ten-row placeholder zero), and add. Estimate with rounded factors to bracket the answer.',
    vocabulary: [
      { term: 'partial product', kidGloss: 'one place-part of the whole product' },
      { term: 'placeholder zero', kidGloss: 'the zero that marks a ×-by-ten row' },
      { term: 'estimate', kidGloss: 'rounded factors that bracket the answer' },
    ],
  },
  guidedExamples: [
    ge(15, 1, 'modeled', '124 × 32.', [
      { teacherSay: '124 × 2 = 248; 124 × 30 = 3,720; add: 3,968.', expected: '3,968' },
    ], '3,968'),
    ge(15, 2, 'prompted', '206 × 45.', [
      { teacherSay: 'First row: 206 × 5. Second row: 206 × 40 (note the placeholder zero).', expected: '1,030 and 8,240' },
      { childDo: 'Add the rows.', expected: '9,270' },
    ], '9,270'),
    ge(15, 3, 'independent', '318 × 26. Solve cold, then estimate to check.', [
      { childDo: 'Two rows, add; estimate 320 × 26.', expected: '8,268' },
    ], '8,268'),
  ],
  days: [
    [
      { gen: wMulFact, diff: 2 },
      { gen: multiply(101, 299, 11, 29), diff: 2 },
      { gen: multiply(101, 499, 21, 49), diff: 3 },
      { gen: storyMultiply(), diff: 3 },
      { gen: multiply(101, 299, 11, 29), diff: 3 },
      { gen: multiply(301, 699, 31, 69), diff: 4 },
    ],
    [
      { gen: wTwoByTwo, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: multiply(101, 499, 21, 49), diff: 3 },
      { gen: multiply(301, 699, 31, 69), diff: 3 },
      { gen: storyMultiply(), diff: 4 },
      { gen: multiply(401, 899, 41, 89), diff: 4 },
    ],
    [
      { gen: wDiv, diff: 2 },
      { gen: wTwoByOne, diff: 2 },
      { gen: multiply(101, 299, 11, 29), diff: 3 },
      { gen: multiply(301, 699, 31, 69), diff: 3 },
      { gen: multiply(401, 899, 41, 89), diff: 4 },
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
          prompt: 'For 213 × 24, name the two algorithm rows (before adding) and say why the second row ends in 0.',
          value: '213 × 4 = 852 and 213 × 20 = 4,260; the 0 marks multiplying by a ten',
          acceptableForms: ['852', '4260', '4,260', 'placeholder'],
          keywords: true,
          hints: ['Split 24 into 4 and 20.', 'The 20-row is a ×-by-ten row.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'A student solved 152 × 30 and wrote 456 (from 152 × 3) with no zero. Is that right?',
          correct: 'no — it needs the placeholder zero: 4,560',
          distractors: [
            { text: 'yes, 456 is correct', errorTag: 'concept-misconception', rationale: 'Drops the ×-by-ten placeholder, losing a whole place.' },
            { text: 'no, it should be 45,600', errorTag: 'representation-misread', rationale: 'Adds two zeros instead of one for ×30.' },
          ],
          hints: ['×30 is ×3 then ×10.', 'How many zeros does ×10 add?'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Show that the area model and the standard algorithm give the same answer for 132 × 21 by matching two area rooms to two algorithm rows. (Written work required.)',
          value: 'area rooms sum to 2,772 and the two algorithm rows sum to 2,772 — same partials, same total',
          acceptableForms: ['2772', '2,772'],
          keywords: true,
          hints: ['Break both factors by place.', 'Match each room to a piece of a row.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Estimate 287 × 52, then say whether an exact answer of 14,924 is reasonable. Show your estimate.',
          value: '300 × 50 = 15,000, so 14,924 is reasonable',
          acceptableForms: ['15000', '15,000', 'reasonable'],
          keywords: true,
          hints: ['Round each factor.', 'Is the exact answer near the estimate?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D15-PZ-01',
    title: 'Puzzle Grove: Which Row Slipped?',
    puzzleType: 'error-analysis',
    prompt: 'For 146 × 23, a student wrote rows 438 and 292, then added to 730. One row is wrong. Find the true rows and the true product.',
    answer: { value: 'the second row should be 146 × 20 = 2,920 (not 292); true product 3,358', acceptableForms: ['2920', '2,920', '3358', '3,358'], validation: 'short-text-keyword' },
    hintLadder: ['The second row multiplies by 20, not 2.', 'Estimate 150 × 23 to bracket the answer.'],
    errorTags: ['representation-misread', 'procedure-slip'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: multiply(101, 299, 11, 29), diff: 3 },
    { gen: multiply(101, 499, 21, 49), diff: 3 },
    { gen: multiply(301, 699, 31, 69), diff: 3 },
    { gen: storyMultiply(), diff: 3 },
    { gen: multiply(401, 899, 41, 89), diff: 4 },
    { gen: multiply(101, 499, 21, 49), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01–03/05/06: 3-digit × 2-digit products (placeholder-zero and row affordances preserved). 04: equal-groups multiplication story. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'missing-placeholder', description: 'Drops the placeholder zero on the ×-by-ten row, collapsing a place.', exampleWrongAnswer: '152 × 30 → 456', distractorRationale: 'Offer the no-placeholder row result.', reteachPointer: 'explanation/script[1] (the placeholder keeps places honest)' },
    { errorTag: 'procedure-slip', subtype: 'row-add-slip', description: 'Computes the rows but adds them incorrectly.', exampleWrongAnswer: '852 + 4,260 → 5,012', distractorRationale: 'Offer a near-miss row sum.', reteachPointer: 'guidedExamples/D15-GE-02 (add the two rows)' },
    { errorTag: 'representation-misread', subtype: 'digit-shift', description: 'Shifts a partial into the wrong column when stacking the rows.', exampleWrongAnswer: 'second row written one column off', distractorRationale: 'Offer the shifted-row total.', reteachPointer: 'D8 review (keep partials in their place)' },
    { errorTag: 'fact-recall', subtype: 'basic-fact-slip', description: 'A single-digit fact inside a row is wrong.', exampleWrongAnswer: '6 × 8 → 42', distractorRationale: 'Offer an adjacent product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Fluent multi-digit multiplication (3-digit × 2-digit) — the standard algorithm as stacked rows of partial products, the placeholder zero on the ×-by-ten row, and an estimate to bracket the answer.',
    improvingCandidates: ['writing both algorithm rows correctly', 'keeping the placeholder zero on the tens row', 'estimating to check the product'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the ×-by-ten placeholder zero — the warm-ups keep it in view' },
      { errorTag: 'representation-misread', text: 'stacking each partial in its correct column' },
      { errorTag: 'fact-recall', text: 'quick single-digit facts inside every row — the sprints keep them fast' },
    ],
    homeFocus: {
      praiseLine: 'You matched the area-model rooms to the algorithm rows and saw they are the same work — that connection is what makes the algorithm make sense.',
      questionForChild: 'When you multiply 152 × 30, why does the answer end in a zero?',
      schoolSyncHook: 'If your child\'s class prefers the area/box method or the stacked algorithm, tell us and we will lead with it.',
    },
    vocabularyForParent: ['partial product (one place-part)', 'placeholder zero (marks a ×-by-ten row)', 'estimate (rounded bracket)'],
  },
});
