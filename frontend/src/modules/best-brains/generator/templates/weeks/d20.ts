/**
 * Level D · Week 20 — "× ÷ decimals" (conceptId: muldiv-decimals). Decimal × whole,
 * decimal × decimal, ÷ by whole; place-the-point reasoning. Day-5: where-does-
 * the-point-go (argue from estimation). Retrieval: D14 ±decimals, D13 place value, C12 × facts.
 */

import { asWarmup, classify, decAddSub, decDivideWhole, decMultiply, decRound, multiply, reasoning, storyDecMultiply } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D13 = { level: 'D' as const, week: 13 };
const D14 = { level: 'D' as const, week: 14 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wDecAdd = asWarmup(decAddSub(1), D14);
const wDecRound = asWarmup(decRound(2), D13);

export const buildD20 = makeWeekBuilder({
  week: 20,
  conceptId: 'muldiv-decimals',
  conceptName: 'Multiplying & dividing decimals',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D13, D14],
  explanation: {
    hook: '0.3 × 0.4 is not 0.12 by luck — it is three-tenths of four-tenths, and tenths times tenths make hundredths. The whole game is knowing WHERE the decimal point lands, and estimation always tells you.',
    whyBeforeHow:
      'Multiply decimals by first ignoring the point (multiply the digits), then placing the point by counting how many decimal places the factors carried together — because tenths × tenths = hundredths. For dividing by a whole number, share place by place and keep the point lined up above. The safest check is estimation: 0.3 × 0.4 is about "a third of a bit less than a half," clearly small, so the point sits well left.',
    script: [
      { say: '0.3 × 0.4: ignore points, 3 × 4 = 12; the factors have 1 + 1 = 2 decimal places, so 0.12.', visual: 'Digits multiply; two place-counts push the point over.' },
      { say: '4.8 ÷ 6: share 4.8 into 6 equal parts, keeping the point above: 0.8.', visual: 'A decimal shares into six parts; the point stays aligned.' },
      { say: 'Estimate to place the point: 0.3 × 0.4 must be small (under a half), so 0.12, never 1.2 or 12.', visual: 'An estimate rules out the wrong point positions.' },
    ],
    summary: 'Multiply the digits, then place the point by counting the factors\' decimal places (tenths × tenths = hundredths). Divide by a whole by sharing with the point aligned. Estimate to place the point.',
    vocabulary: [
      { term: 'decimal places', kidGloss: 'digits to the right of the point' },
      { term: 'place the point', kidGloss: 'count the factors\' decimal places to position it' },
      { term: 'estimate', kidGloss: 'a rounded check that fixes the point' },
    ],
  },
  guidedExamples: [
    ge(20, 1, 'modeled', '0.6 × 7.', [
      { teacherSay: '6 × 7 = 42; one decimal place in the factors, so 4.2.', expected: '4.2' },
    ], '4.2'),
    ge(20, 2, 'prompted', '0.4 × 0.5.', [
      { teacherSay: '4 × 5 = 20; how many decimal places together?', expected: 'two' },
      { childDo: 'Place the point.', expected: '0.20 = 0.2' },
    ], '0.2'),
    ge(20, 3, 'independent', '5.6 ÷ 8. Solve cold.', [
      { childDo: 'Share with the point aligned.', expected: '0.7' },
    ], '0.7'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: decMultiply(false), diff: 2 },
      { gen: decMultiply(true), diff: 3 },
      { gen: decDivideWhole(), diff: 3 },
      { gen: decMultiply(false), diff: 3 },
      { gen: decMultiply(true), diff: 4 },
    ],
    [
      { gen: wDecAdd, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: decDivideWhole(), diff: 3 },
      { gen: decMultiply(true), diff: 3 },
      { gen: storyDecMultiply(), diff: 4 },
      { gen: decMultiply(false), diff: 4 },
    ],
    [
      { gen: wDecRound, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: decMultiply(true), diff: 3 },
      { gen: decDivideWhole(), diff: 3 },
      { gen: storyDecMultiply(), diff: 4 },
      { gen: decMultiply(false), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyDecMultiply(), diff: 4 },
      { gen: storyDecMultiply(), diff: 4 },
      { gen: storyDecMultiply(), diff: 5 },
    ],
    [
      {
        gen: classify({
          prompt: 'For 0.7 × 0.6, the digits give 42. Where does the point go?',
          correct: '0.42 (two decimal places)',
          distractors: [
            { text: '4.2 (one decimal place)', errorTag: 'procedure-slip', rationale: 'Counts only one factor\'s decimal place.' },
            { text: '42 (no decimal place)', errorTag: 'concept-misconception', rationale: 'Forgets that both factors are less than 1, so the product is small.' },
          ],
          hints: ['Count decimal places in BOTH factors.', 'Both are under 1, so the product is under 1.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Use estimation to argue where the point goes in 3.2 × 4 (digits give 128). Explain. (Written explanation required.)',
          value: 'about 3 × 4 = 12, so it is 12.8, not 1.28 or 128',
          acceptableForms: ['12.8', '12', 'estimate'],
          keywords: true,
          hints: ['Round 3.2 to a whole and multiply.', 'Which point position lands near your estimate?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why 0.3 × 0.4 is SMALLER than both 0.3 and 0.4, unlike multiplying whole numbers. (Written explanation required.)',
          value: 'multiplying by a number less than 1 shrinks it — it takes only part',
          acceptableForms: ['less than 1', 'part', 'smaller'],
          keywords: true,
          hints: ['0.4 is less than one whole.', 'Taking 0.4 OF 0.3 leaves less.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'For 6.4 ÷ 8, where does the point go if the digits give 8?',
          correct: '0.8 (the answer is less than 1)',
          distractors: [
            { text: '8 (drop the point)', errorTag: 'concept-misconception', rationale: 'Ignores that 6.4 shared among 8 is under 1.' },
            { text: '8.0', errorTag: 'representation-misread', rationale: 'Same error dressed with a trailing zero.' },
          ],
          hints: ['Is 6.4 shared 8 ways more or less than 1?', 'Estimate: 6.4 ÷ 8 is near 6 ÷ 8.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D20-PZ-01',
    title: 'Puzzle Grove: Place the Point',
    puzzleType: 'estimation',
    prompt: 'The digits of 2.5 × 0.4, 25 × 4, and 0.25 × 0.4 are all "10" (or 100). Using estimation, place the point in each and explain why the same digits land in different spots.',
    answer: { value: '2.5 × 0.4 = 1.0, 25 × 4 = 100, 0.25 × 0.4 = 0.10 — decimal places in the factors set the point', acceptableForms: ['1', '100', '0.1'], validation: 'short-text-keyword' },
    hintLadder: ['Estimate each product\'s size first.', 'Count the decimal places in the two factors.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: decMultiply(false), diff: 3 },
    { gen: decMultiply(true), diff: 3 },
    { gen: decDivideWhole(), diff: 3 },
    { gen: storyDecMultiply(), diff: 3 },
    { gen: decMultiply(true), diff: 4 },
    { gen: decDivideWhole(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/05: decimal × whole (or × decimal). 02: decimal × decimal. 03/06: decimal ÷ whole. 04: decimal cost word problem (place-the-point affordance preserved). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'procedure-slip', subtype: 'point-miscount', description: 'Places the decimal point by counting the wrong number of decimal places.', exampleWrongAnswer: '0.7 × 0.6 → 4.2', distractorRationale: 'Offer the one-place-off product.', reteachPointer: 'explanation/script[0] (count both factors\' places)' },
    { errorTag: 'concept-misconception', subtype: 'product-should-shrink', description: 'Expects a product to grow even when multiplying by less than 1.', exampleWrongAnswer: '0.3 × 0.4 → bigger than 0.4', distractorRationale: 'Offer a too-large product.', reteachPointer: 'Day-5 reasoning (×<1 shrinks)' },
    { errorTag: 'representation-misread', subtype: 'quotient-point', description: 'Misplaces the point in a decimal ÷ whole quotient.', exampleWrongAnswer: '4.8 ÷ 6 → 8', distractorRationale: 'Offer the point-dropped quotient.', reteachPointer: 'guidedExamples/D20-GE-03 (keep the point aligned)' },
    { errorTag: 'task-comprehension', subtype: 'cost-context', description: 'Mishandles a money product (drops the point in the total).', exampleWrongAnswer: '$1.50 × 4 → $60', distractorRationale: 'Offer a point-dropped cost.', reteachPointer: 'storyDecMultiply (place the point in the total)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying and dividing decimals — multiplying the digits then placing the point by counting decimal places, dividing by a whole number with the point aligned, and using estimation to put the point in the right spot.',
    improvingCandidates: ['placing the decimal point by counting places', 'dividing a decimal by a whole number', 'estimating to fix the point'],
    strengtheningByTag: [
      { errorTag: 'procedure-slip', text: 'counting the factors\' decimal places to place the point — the warm-ups reinforce this' },
      { errorTag: 'concept-misconception', text: 'that multiplying by less than 1 SHRINKS the amount' },
      { errorTag: 'representation-misread', text: 'placing the point correctly in a division quotient' },
    ],
    homeFocus: {
      praiseLine: 'You used estimation to place the point in 3.2 × 4 — arguing from "about 12" instead of a rule is exactly the reasoning we want.',
      questionForChild: 'The digits of 0.7 × 0.6 are 42 — so where does the point go, and how do you know?',
      schoolSyncHook: 'If your child\'s class emphasizes estimation or a place-counting rule, tell us and we will lead with that approach.',
    },
    vocabularyForParent: ['decimal places (digits right of the point)', 'place the point (count the factors\' places)', 'estimate (a rounded check)'],
  },
});
