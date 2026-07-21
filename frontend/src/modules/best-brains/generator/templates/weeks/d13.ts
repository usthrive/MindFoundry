/**
 * Level D · Week 13 — "Decimal place value to thousandths" (conceptId: decimal-place-value-thousandths).
 * Read/write/round/compare to thousandths. Day-5: density puzzle (name a decimal
 * between 0.42 and 0.43). Retrieval: D12 decimals, C12 × facts.
 */

import { asWarmup, classify, decCompareChoice, decPlaceValue, decRound, fractionToDecimal, multiply, reasoning, storyDecRound } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D12 = { level: 'D' as const, week: 12 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wCompare = asWarmup(decCompareChoice(), D12);
const wFracDec = asWarmup(fractionToDecimal(), D12);

export const buildD13 = makeWeekBuilder({
  week: 13,
  conceptId: 'decimal-place-value-thousandths',
  conceptName: 'Decimal place value to thousandths',
  strandTags: ['decimals-fractions', 'number-sense-counting'],
  prerequisiteWeeks: [D12],
  explanation: {
    hook: 'Between 0.42 and 0.43 there is nothing... until you open the thousandths place, and suddenly 0.421, 0.425, 0.429 all appear. Decimals never run out of room — there is always a smaller place.',
    whyBeforeHow:
      'Every place right of the point is ten times smaller than the one before: tenths, hundredths, thousandths. That is the same ×10 rule as whole numbers, run backward. Reading, rounding, and comparing to thousandths is just extending place value to the right. Rounding asks which nearby "friendly" decimal a number is closest to; you decide by the digit one place below the round-to spot.',
    script: [
      { say: 'Places shrink by tens rightward: 0.4 is four tenths, 0.04 four hundredths, 0.004 four thousandths.', visual: 'A place chart extends right; each column a tenth of the last.' },
      { say: 'In 3.472 the 2 is thousandths, the 7 hundredths, the 4 tenths — name a digit by its place.', visual: 'Each decimal digit labels its place.' },
      { say: 'Round 3.472 to hundredths: look at the thousandths digit (2), under 5, so round DOWN to 3.47.', visual: 'The deciding digit flashes; 3.47 is chosen.' },
    ],
    summary: 'Places shrink ×10 to the right: tenths, hundredths, thousandths. Name a digit by its place; round by the digit one place below the round-to spot.',
    vocabulary: [
      { term: 'thousandths', kidGloss: 'the third place after the decimal point' },
      { term: 'place value', kidGloss: 'each place is a tenth of the one to its left' },
      { term: 'round', kidGloss: 'swap for the nearest friendly decimal' },
    ],
  },
  guidedExamples: [
    ge(13, 1, 'modeled', 'In 5.638, which digit is in the hundredths place?', [
      { teacherSay: 'Count right: 6 tenths, 3 hundredths, 8 thousandths. The hundredths digit is 3.', expected: '3' },
    ], '3'),
    ge(13, 2, 'prompted', 'Round 2.4863 to the nearest hundredth.', [
      { teacherSay: 'Which digit decides — the thousandths?', expected: '6' },
      { childDo: 'Round the hundredths.', expected: '2.49' },
    ], '2.49'),
    ge(13, 3, 'independent', 'Round 7.0952 to the nearest thousandth. Solve cold.', [
      { childDo: 'Look one place below the thousandths and decide.', expected: '7.095' },
    ], '7.095'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: decPlaceValue(), diff: 2 },
      { gen: decRound(2), diff: 3 },
      { gen: decPlaceValue(), diff: 3 },
      { gen: decRound(3), diff: 3 },
      { gen: decPlaceValue(), diff: 4 },
    ],
    [
      { gen: wCompare, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: decRound(2), diff: 3 },
      { gen: decPlaceValue(), diff: 3 },
      { gen: decRound(3), diff: 4 },
      { gen: decRound(2), diff: 4 },
    ],
    [
      { gen: wFracDec, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: decPlaceValue(), diff: 3 },
      { gen: decRound(3), diff: 3 },
      { gen: decRound(2), diff: 4 },
      { gen: decPlaceValue(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyDecRound(2), diff: 4 },
      { gen: storyDecRound(3), diff: 4 },
      { gen: storyDecRound(1), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'Name a decimal between 0.42 and 0.43. How many such decimals are there? Explain.',
          value: 'e.g. 0.425; there are infinitely many, since you can always open a smaller place',
          acceptableForms: ['0.425', 'infinitely many', 'thousandths'],
          keywords: true,
          hints: ['Open the thousandths place.', 'Could you keep going to ten-thousandths?'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Rounding 3.148 to the nearest hundredth: which digit decides the rounding?',
          correct: 'the thousandths digit (8)',
          distractors: [
            { text: 'the tenths digit (1)', errorTag: 'representation-misread', rationale: 'Looks too far left instead of one place below the round-to spot.' },
            { text: 'the hundredths digit (4)', errorTag: 'concept-misconception', rationale: 'Uses the round-to digit itself instead of the one below it.' },
          ],
          hints: ['The deciding digit sits one place BELOW the round-to place.', 'Round to hundredths → look at thousandths.'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why 0.5 and 0.50 and 0.500 are all equal, using place value. (Written explanation required.)',
          value: 'the extra zeros add empty hundredths and thousandths — no amount, same value',
          acceptableForms: [],
          hints: ['What do the extra zeros contribute?', 'Zero hundredths adds nothing.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always/sometimes/never: adding a zero to the END of a decimal (0.4 → 0.40) changes its value.',
          correct: 'never',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Treats a trailing zero as if it added amount.' },
            { text: 'sometimes', errorTag: 'representation-misread', rationale: 'A trailing zero is always empty of value.' },
          ],
          hints: ['What place does the added zero sit in?', 'Zero of a place adds nothing.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D13-PZ-01',
    title: 'Puzzle Grove: Squeeze In',
    puzzleType: 'logic',
    prompt: 'Find three different decimals that all sit strictly between 0.6 and 0.61. Then explain why you could find a hundred more.',
    answer: { value: 'e.g. 0.601, 0.605, 0.609; infinitely many by opening smaller places', acceptableForms: ['0.605', 'infinitely'], validation: 'short-text-keyword' },
    hintLadder: ['Open the thousandths place between them.', 'Each new place gives ten more slots.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: decPlaceValue(), diff: 3 },
    { gen: decRound(2), diff: 3 },
    { gen: decPlaceValue(), diff: 3 },
    { gen: decRound(3), diff: 3 },
    { gen: decRound(2), diff: 4 },
    { gen: decPlaceValue(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/03/06: name the digit in a given place. 02/05: round to the nearest hundredth. 04: round to the nearest thousandth (deciding-digit affordance preserved). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'representation-misread', subtype: 'wrong-deciding-digit', description: 'Uses the wrong digit to decide a rounding (looks at the round-to digit or too far left).', exampleWrongAnswer: '3.148 to hundredths decided by the 1', distractorRationale: 'Offer the wrong-digit rounding.', reteachPointer: 'explanation/script[2] (one place below decides)' },
    { errorTag: 'concept-misconception', subtype: 'trailing-zero-value', description: 'Thinks a trailing zero changes a decimal\'s value, or that decimals "run out" between two values.', exampleWrongAnswer: '0.40 called bigger than 0.4', distractorRationale: 'Offer "always changes value" on trailing-zero claims.', reteachPointer: 'Day-5 classify (a trailing zero is empty)' },
    { errorTag: 'procedure-slip', subtype: 'round-direction', description: 'Rounds the wrong direction, or changes digits below the rounding place.', exampleWrongAnswer: '2.4863 to hundredths → 2.48', distractorRationale: 'Offer the wrong-direction round.', reteachPointer: 'guidedExamples/D13-GE-02 (6 rounds up)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Decimal place value out to thousandths — naming the digit in each place, rounding to a chosen place, and seeing that there is always a smaller place (so decimals never run out of room between two values).',
    improvingCandidates: ['naming a digit\'s place out to thousandths', 'rounding decimals to a chosen place', 'finding decimals between two others'],
    strengtheningByTag: [
      { errorTag: 'representation-misread', text: 'using the digit ONE place below the round-to spot to decide — the warm-ups reinforce this' },
      { errorTag: 'concept-misconception', text: 'seeing that a trailing zero adds no value (0.4 = 0.40)' },
      { errorTag: 'procedure-slip', text: 'rounding in the correct direction' },
    ],
    homeFocus: {
      praiseLine: 'You found three decimals between 0.42 and 0.43 and saw there are infinitely many — that is deep place-value insight.',
      questionForChild: 'To round 3.148 to the nearest hundredth, which digit do you look at — and why that one?',
      schoolSyncHook: 'If your child\'s class works with sports times or measurements, tell us and we will feature those in the rounding problems.',
    },
    vocabularyForParent: ['thousandths (third place after the point)', 'place value (each place a tenth of the last)', 'rounding (nearest friendly decimal)'],
  },
});
