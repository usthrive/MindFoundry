/**
 * Level D · Week 16 — "Division: 2-digit divisors" (conceptId: division-two-digit-divisors).
 * Estimate-quotient strategies; long division with 2-digit divisors. Day-5:
 * estimation-first (bracket the quotient). Retrieval: D15 ×, D6 division, C12 × facts.
 */

import { asWarmup, classify, divideExact, divideRemainder, multiply, reasoning, storyDivideUse } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D6 = { level: 'D' as const, week: 6 };
const D15 = { level: 'D' as const, week: 15 };

const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wBigMul = asWarmup(multiply(101, 299, 11, 29), D15);
const wDiv1 = asWarmup(divideRemainder(3, 9, 20, 89), D6);

export const buildD16 = makeWeekBuilder({
  week: 16,
  conceptId: 'division-two-digit-divisors',
  conceptName: 'Division with 2-digit divisors',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D6, D15],
  explanation: {
    hook: 'Dividing by 23 feels harder than dividing by 3 — until you realize the trick is ESTIMATING. Round 23 to 20, guess how many fit, then adjust. Long division with big divisors is really smart guessing plus checking.',
    whyBeforeHow:
      'Division by a 2-digit number is the same share-and-check process, but the "how many fit" step needs an estimate: round the divisor to a friendly ten and try. If your guess times the divisor overshoots, lower it; if there is room for more, raise it. Bracketing the quotient first (between which two round numbers must it lie?) keeps the long-division steps honest.',
    script: [
      { say: '736 ÷ 23: round 23 to 20. About how many 20s in 73 (the leading part)? Roughly 3 — try 3.', visual: 'The divisor rounds to 20; a trial quotient digit appears.' },
      { say: 'Check the trial: 3 × 23 = 69, under 73, room left. Bring down, continue — smart guess, then verify.', visual: 'Trial product checks against the working number.' },
      { say: 'Bracket first: 736 ÷ 23 is between 30 (23×30=690) and 40 (23×40=920), so the quotient starts with 3-something.', visual: 'The quotient is bracketed between two round products.' },
    ],
    summary: 'Round the divisor to estimate each quotient digit, check by multiplying, and adjust. Bracket the quotient between round products to stay on track.',
    vocabulary: [
      { term: 'divisor', kidGloss: 'the number you divide by' },
      { term: 'estimate the quotient', kidGloss: 'guess how many fit using a friendly round divisor' },
      { term: 'bracket', kidGloss: 'trap the answer between two round products' },
    ],
  },
  guidedExamples: [
    ge(16, 1, 'modeled', 'View 322 ÷ 14 through estimation.', [
      { teacherSay: 'Round 14 to about 15. 322 ÷ 15 is near 21, and 14 × 23 = 322 exactly. So 23.', expected: '23' },
    ], '23'),
    ge(16, 2, 'prompted', '405 ÷ 27.', [
      { teacherSay: 'Round 27 to 30; about how many 30s in 405?', expected: 'about 13' },
      { childDo: 'Check 15 × 27 and adjust.', expected: '15' },
    ], '15'),
    ge(16, 3, 'independent', '588 ÷ 21. Solve cold with an estimate first.', [
      { childDo: 'Round the divisor, estimate, then verify with multiplication.', expected: '28' },
    ], '28'),
  ],
  days: [
    [
      { gen: wMulFact, diff: 2 },
      { gen: divideExact(11, 29, 4, 9), diff: 2 },
      { gen: divideRemainder(11, 29, 120, 499), diff: 3 },
      { gen: divideExact(21, 39, 11, 29), diff: 3 },
      { gen: divideRemainder(11, 39, 200, 800), diff: 3 },
      { gen: divideExact(21, 49, 11, 39), diff: 4 },
    ],
    [
      { gen: wBigMul, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: divideRemainder(11, 29, 120, 499), diff: 3 },
      { gen: divideExact(21, 39, 11, 29), diff: 3 },
      { gen: divideRemainder(11, 39, 200, 800), diff: 4 },
      { gen: divideExact(11, 29, 4, 9), diff: 4 },
    ],
    [
      { gen: wDiv1, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: divideExact(21, 49, 11, 39), diff: 3 },
      { gen: divideRemainder(11, 29, 120, 499), diff: 3 },
      { gen: divideExact(21, 39, 11, 29), diff: 4 },
      { gen: divideRemainder(11, 39, 200, 800), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: divideRemainder(11, 39, 200, 800), diff: 4 },
      { gen: divideExact(21, 49, 11, 39), diff: 4 },
      { gen: storyDivideUse('round-up'), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'Before dividing 736 ÷ 23, bracket the quotient: between which two multiples of ten must it lie? Show the two products.',
          value: 'between 30 and 40, since 23 × 30 = 690 and 23 × 40 = 920',
          acceptableForms: ['30', '40', '690', '920'],
          keywords: true,
          hints: ['Try 23 × 30 and 23 × 40.', 'Which pair traps 736?'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'To estimate 611 ÷ 29, which friendly divisor is best to guess with?',
          correct: '30',
          distractors: [
            { text: '20', errorTag: 'representation-misread', rationale: 'Rounds 29 the wrong way, giving a poor estimate.' },
            { text: '29 (do not round)', errorTag: 'concept-misconception', rationale: 'Skips the estimate that makes the guess easy.' },
          ],
          hints: ['Round 29 to the nearest ten.', 'A friendly divisor makes the guess quick.'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'A student guessed the quotient of 504 ÷ 18 was 20, but 18 × 20 = 360, far under 504. What should they do next, and roughly what is the quotient? (Written explanation required.)',
          value: 'raise the guess; 18 × 28 = 504, so the quotient is 28',
          acceptableForms: ['28', 'raise', 'higher'],
          keywords: true,
          hints: ['If the product is too small, the guess is too small.', 'Try a bigger quotient and check.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Explain how the multiplication check (quotient × divisor) tells you whether your trial digit is too big or too small. (Written explanation required.)',
          value: 'if the product overshoots the number, the guess is too big; if it leaves lots of room, too small',
          acceptableForms: [],
          hints: ['Compare the product to the working number.', 'Overshoot vs room-left points the way.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D16-PZ-01',
    title: 'Puzzle Grove: Bracket the Quotient',
    puzzleType: 'estimation',
    prompt: 'Without doing full long division, bracket 851 ÷ 23 between two consecutive multiples of ten, then find the exact quotient. Show the two bracketing products.',
    answer: { value: 'between 30 and 40 (23×30=690, 23×40=920); exact quotient 37', acceptableForms: ['37'], validation: 'short-text-keyword' },
    hintLadder: ['Multiply the divisor by 30 and by 40.', 'Then home in between them.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: divideExact(11, 29, 4, 9), diff: 3 },
    { gen: divideRemainder(11, 29, 120, 499), diff: 3 },
    { gen: divideExact(21, 39, 11, 29), diff: 3 },
    { gen: divideRemainder(11, 39, 200, 800), diff: 3 },
    { gen: divideExact(21, 49, 11, 39), diff: 4 },
    { gen: divideRemainder(11, 29, 120, 499), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. Odd slots: exact division by a 2-digit divisor (estimate-the-quotient affordance). Even slots: 2-digit-divisor division with a remainder (ordered pair). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'quotient-estimate-off', description: 'Estimates the quotient poorly (rounds the divisor the wrong way or skips estimating).', exampleWrongAnswer: '611 ÷ 29 estimated with 20', distractorRationale: 'Offer a quotient from the wrong-way estimate.', reteachPointer: 'explanation/script[0] (round the divisor to a friendly ten)' },
    { errorTag: 'procedure-slip', subtype: 'long-division-step', description: 'Slips a bring-down or subtraction step in the long division.', exampleWrongAnswer: 'drops a digit mid-division', distractorRationale: 'Offer a one-step-off quotient.', reteachPointer: 'guidedExamples/D16-GE-02 (check each trial by multiplying)' },
    { errorTag: 'fact-recall', subtype: 'trial-product-slip', description: 'Miscomputes the trial product (quotient × divisor).', exampleWrongAnswer: '18 × 28 → 494', distractorRationale: 'Offer a near-miss trial product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
    { errorTag: 'representation-misread', subtype: 'round-wrong-way', description: 'Rounds the divisor away from the nearest ten, harming the estimate.', exampleWrongAnswer: '29 rounded to 20', distractorRationale: 'Offer the wrong-rounded divisor.', reteachPointer: 'Day-5 classify (round to the nearest ten)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Long division with 2-digit divisors — estimating each quotient digit by rounding the divisor to a friendly ten, checking by multiplying, and bracketing the whole quotient between round products before diving in.',
    improvingCandidates: ['estimating a quotient digit by rounding the divisor', 'checking a trial by multiplying', 'bracketing the quotient between round products'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'estimating the quotient with a friendly rounded divisor — the warm-ups build this instinct' },
      { errorTag: 'procedure-slip', text: 'the bring-down and subtract steps of long division' },
      { errorTag: 'fact-recall', text: 'quick trial-product multiplication — the sprints keep facts fast' },
    ],
    homeFocus: {
      praiseLine: 'You bracketed 736 ÷ 23 between 30 and 40 before dividing — that estimate-first move keeps long division from going off the rails.',
      questionForChild: 'To estimate 611 ÷ 29, what friendly number would you divide by instead — and why?',
      schoolSyncHook: 'If your child\'s class uses partial-quotients or the standard long-division layout, tell us and we will match it.',
    },
    vocabularyForParent: ['divisor (the number you divide by)', 'estimate the quotient (guess with a friendly divisor)', 'bracket (trap the answer between round products)'],
  },
});
