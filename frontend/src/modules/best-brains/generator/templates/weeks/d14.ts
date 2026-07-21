/**
 * Level D · Week 14 — "± decimals" (conceptId: addsub-decimals). Column ± with
 * alignment reasoning; money/measurement contexts. Day-5: misaligned-columns
 * error analysis. Retrieval: D13 decimal place value, D12 decimals, C12 × facts.
 */

import { asWarmup, classify, decAddSub, decCompareChoice, decRound, multiply, reasoning, storyDecimalMoney } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D12 = { level: 'D' as const, week: 12 };
const D13 = { level: 'D' as const, week: 13 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wRound = asWarmup(decRound(2), D13);
const wCompare = asWarmup(decCompareChoice(), D12);

export const buildD14 = makeWeekBuilder({
  week: 14,
  conceptId: 'addsub-decimals',
  conceptName: 'Adding & subtracting decimals',
  strandTags: ['decimals-fractions', 'addition-subtraction'],
  prerequisiteWeeks: [D12, D13],
  explanation: {
    hook: 'The whole secret of adding decimals is one small thing: line up the points. Do that and 2.5 + 1.75 is just column addition. Skip it and everything drifts into the wrong place.',
    whyBeforeHow:
      'Decimals add and subtract by place, exactly like whole numbers — tenths meet tenths, hundredths meet hundredths. Lining up the decimal points is what forces each place over its match. A number with fewer places, like 2.5, can wear extra zeros (2.50) so the columns stay even. Estimating first keeps a misplaced point from sneaking through.',
    script: [
      { say: '2.5 + 1.75: stack with points aligned, add a zero to 2.5 → 2.50, then add columns: 4.25.', visual: 'Two decimals stack with points aligned; a filler zero appears.' },
      { say: 'Subtraction is the same: 6.3 − 1.47 → 6.30 − 1.47 = 4.83, borrowing where a column cannot pay.', visual: 'Aligned columns with a borrow across the hundredths.' },
      { say: 'Estimate first: 2.5 + 1.75 is about 4.3, so 4.25 is reasonable; a wandering point would jump far off.', visual: 'A rounded estimate flags the ballpark.' },
    ],
    summary: 'Line up the decimal points, fill short numbers with zeros, then add or subtract by place. Estimate first to catch a misplaced point.',
    vocabulary: [
      { term: 'align the points', kidGloss: 'stack so each place meets its match' },
      { term: 'filler zero', kidGloss: 'a zero that keeps the columns even' },
      { term: 'estimate', kidGloss: 'a rounded ballpark to check the answer' },
    ],
  },
  guidedExamples: [
    ge(14, 1, 'modeled', '3.6 + 2.45.', [
      { teacherSay: 'Align points, write 3.60, add columns: 6.05.', expected: '6.05' },
    ], '6.05'),
    ge(14, 2, 'prompted', '5.2 − 1.86.', [
      { teacherSay: 'Fill 5.2 as 5.20, then subtract.' },
      { childDo: 'Borrow where needed.', expected: '3.34' },
    ], '3.34'),
    ge(14, 3, 'independent', '4.75 + 3.9. Solve cold, then estimate to check.', [
      { childDo: 'Align, fill, add; estimate ~4.8 + 3.9.', expected: '8.65' },
    ], '8.65'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: decAddSub(1), diff: 2 },
      { gen: decAddSub(-1), diff: 3 },
      { gen: decAddSub(1), diff: 3 },
      { gen: decAddSub(-1), diff: 3 },
      { gen: decAddSub(1), diff: 4 },
    ],
    [
      { gen: wRound, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: decAddSub(-1), diff: 3 },
      { gen: decAddSub(1), diff: 3 },
      { gen: storyDecimalMoney(1), diff: 4 },
      { gen: decAddSub(-1), diff: 4 },
    ],
    [
      { gen: wCompare, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: decAddSub(1), diff: 3 },
      { gen: decAddSub(-1), diff: 3 },
      { gen: storyDecimalMoney(-1), diff: 4 },
      { gen: decAddSub(1), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyDecimalMoney(1), diff: 4 },
      { gen: storyDecimalMoney(-1), diff: 4 },
      { gen: storyDecimalMoney(1), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'A student added 2.5 + 1.75 by writing them right-aligned (25 over 175) and got 2.00. Explain the mistake in one line.',
          value: 'they aligned the digits by the right edge instead of by the decimal point',
          acceptableForms: ['align', 'decimal point', 'point'],
          keywords: true,
          hints: ['What must line up before adding?', 'Estimate: the answer should be over 4.'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'To add 3.4 + 0.27 correctly, what should you do first?',
          correct: 'line up the decimal points (write 3.40)',
          distractors: [
            { text: 'line up the right-hand digits', errorTag: 'representation-misread', rationale: 'Right-aligning mismatches the place values.' },
            { text: 'drop the point and add as whole numbers', errorTag: 'concept-misconception', rationale: 'Ignores place value entirely.' },
          ],
          hints: ['Which places must meet?', 'A filler zero keeps the columns even.'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Why can we write 2.5 as 2.50 when adding, but NOT as 2.05? Explain with place value. (Written explanation required.)',
          value: '2.50 adds an empty hundredths place (same value); 2.05 moves the 5 to hundredths (different value)',
          acceptableForms: [],
          hints: ['Where does the added zero go in each case?', 'A trailing zero is empty; a middle zero shifts a digit.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Estimate 8.7 − 2.95, then say whether an exact answer of 5.75 is reasonable. Show your estimate.',
          value: 'about 9 − 3 = 6, so 5.75 is reasonable',
          acceptableForms: ['6', 'reasonable'],
          keywords: true,
          hints: ['Round each to the nearest whole.', 'Is the exact answer near the estimate?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D14-PZ-01',
    title: 'Puzzle Grove: Point Patrol',
    puzzleType: 'error-analysis',
    prompt: 'A receipt adds $4.50 + $0.7 + $12 and prints $16.7. One entry was lined up wrong. Find the true total and explain which entry drifted.',
    answer: { value: 'true total $17.20; the $0.7 (and the whole $12) must align by the point, not the right edge', acceptableForms: ['17.20', '17.2'], validation: 'short-text-keyword' },
    hintLadder: ['Rewrite each as dollars-and-cents with the points aligned.', 'A whole number of dollars is 12.00.'],
    errorTags: ['representation-misread', 'procedure-slip'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: decAddSub(1), diff: 3 },
    { gen: decAddSub(-1), diff: 3 },
    { gen: decAddSub(1), diff: 3 },
    { gen: storyDecimalMoney(1), diff: 3 },
    { gen: decAddSub(-1), diff: 4 },
    { gen: decAddSub(1), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/03/06: decimal addition (filler-zero affordance preserved). 02/05: decimal subtraction with borrowing. 04: money add word problem. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'representation-misread', subtype: 'right-align', description: 'Lines decimals up by the right edge instead of the point, so unlike places add.', exampleWrongAnswer: '2.5 + 1.75 → 2.00', distractorRationale: 'Offer the right-aligned sum.', reteachPointer: 'explanation/script[0] (align the points)' },
    { errorTag: 'procedure-slip', subtype: 'borrow-slip', description: 'Mishandles a borrow across decimal places.', exampleWrongAnswer: '6.3 − 1.47 → 4.93', distractorRationale: 'Offer a no-borrow difference.', reteachPointer: 'guidedExamples/D14-GE-02 (fill with a zero, then borrow)' },
    { errorTag: 'concept-misconception', subtype: 'zero-placement', description: 'Adds a zero in the wrong place (2.5 → 2.05 instead of 2.50).', exampleWrongAnswer: '2.5 filled as 2.05', distractorRationale: 'Offer the wrong-zero-placement result.', reteachPointer: 'Day-5 reasoning (trailing vs middle zero)' },
    { errorTag: 'task-comprehension', subtype: 'money-context', description: 'Loses the money context (mixes dollars and cents columns).', exampleWrongAnswer: '$12 aligned as 1.2', distractorRationale: 'Offer the mis-scaled money total.', reteachPointer: 'puzzle D14-PZ-01 (whole dollars are 12.00)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Adding and subtracting decimals by lining up the decimal points, filling short numbers with zeros so the columns stay even, and estimating first to catch a misplaced point — often in money and measurement contexts.',
    improvingCandidates: ['lining up the decimal points before computing', 'filling with zeros to keep columns even', 'estimating to check the answer'],
    strengtheningByTag: [
      { errorTag: 'representation-misread', text: 'aligning by the decimal point, never the right edge — the warm-ups reinforce this' },
      { errorTag: 'procedure-slip', text: 'borrowing cleanly across decimal places' },
      { errorTag: 'concept-misconception', text: 'placing a filler zero correctly (2.50, not 2.05)' },
    ],
    homeFocus: {
      praiseLine: 'You lined up the decimal points and filled 2.5 as 2.50 before adding — that one habit prevents almost every decimal error.',
      questionForChild: 'Before you add 3.6 + 2.45, what is a quick estimate — and how will it tell you if your point drifted?',
      schoolSyncHook: 'If your child\'s class uses grid paper or money to align decimals, tell us and we will match that support.',
    },
    vocabularyForParent: ['align the points (stack place over place)', 'filler zero (keeps columns even)', 'estimate (a rounded check)'],
  },
});
