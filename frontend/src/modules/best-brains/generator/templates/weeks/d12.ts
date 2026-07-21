/**
 * Level D · Week 12 — "Meeting decimals" (conceptId: meeting-decimals). MID-LEVEL
 * CHECKPOINT. Tenths/hundredths; fraction ↔ decimal; compare decimals. Day-5:
 * "why is 0.8 > 0.35?" written explanation. Retrieval: D9/D10 fractions, C12 × facts.
 */

import { asWarmup, classify, decCompareChoice, decimalToFraction, fracAddSubLike, fracEquivFill, fractionToDecimal, multiply, reasoning, storyDecimalMoney } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D9 = { level: 'D' as const, week: 9 };
const D10 = { level: 'D' as const, week: 10 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wLike = asWarmup(fracAddSubLike(1), D10);
const wEquiv = asWarmup(fracEquivFill(), D9);

export const buildD12 = makeWeekBuilder({
  week: 12,
  conceptId: 'meeting-decimals',
  conceptName: 'Meeting decimals',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [D9, D10],
  explanation: {
    hook: '0.8 or 0.35 — which is bigger? Many people pick 0.35 because it "has more digits." But decimals are place value again: eight tenths beats thirty-five hundredths, because tenths are the bigger place.',
    whyBeforeHow:
      'A decimal is just a fraction whose denominator is a power of ten, written in place-value columns to the right of the point: tenths, then hundredths. So 0.8 = 8/10 and 0.35 = 35/100. To compare, line up the points and read the biggest place first — never count digits. Fractions and decimals are two spellings of the same amount, and money (dimes and pennies) is the everyday model.',
    script: [
      { say: '0.8 is 8 tenths; 0.35 is 3 tenths and 5 hundredths. Tenths first: 8 > 3, so 0.8 wins.', visual: 'Tenths and hundredths grids compare; 0.8 fills more.' },
      { say: 'Fraction ↔ decimal: 3/10 = 0.3; 7/100 = 0.07; 1/2 = 5/10 = 0.5. Re-cut to a power of ten.', visual: 'A fraction re-cuts into tenths, then reads off as a decimal.' },
      { say: 'Money models it: 0.8 dollars is 8 dimes; 0.35 dollars is 3 dimes and a nickel — 8 dimes is more.', visual: 'Dimes and pennies stack beside each decimal.' },
    ],
    summary: 'Decimals are place-value fractions (tenths, hundredths). Compare by lining up the point and reading the biggest place first — never by digit count. Fractions and decimals are two names for one amount.',
    vocabulary: [
      { term: 'tenths', kidGloss: 'the first place after the decimal point' },
      { term: 'hundredths', kidGloss: 'the second place after the point' },
      { term: 'decimal point', kidGloss: 'the mark separating ones from tenths' },
    ],
  },
  guidedExamples: [
    ge(12, 1, 'modeled', 'Write 7/10 as a decimal.', [
      { teacherSay: 'Seven tenths goes one place after the point: 0.7.', expected: '0.7' },
    ], '0.7'),
    ge(12, 2, 'prompted', 'Write 0.25 as a fraction in simplest form.', [
      { teacherSay: '0.25 is 25 hundredths.', expected: '25/100' },
      { childDo: 'Simplify.', expected: '1/4' },
    ], '1/4'),
    ge(12, 3, 'independent', 'Which is greater: 0.6 or 0.48? Solve cold.', [
      { childDo: 'Line up the points; compare tenths first.', expected: '0.6' },
    ], '0.6'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: fractionToDecimal(), diff: 2 },
      { gen: decCompareChoice(), diff: 3 },
      { gen: decimalToFraction(), diff: 3 },
      { gen: fractionToDecimal(), diff: 3 },
      { gen: decCompareChoice(), diff: 4 },
    ],
    [
      { gen: wLike, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: decimalToFraction(), diff: 3 },
      { gen: fractionToDecimal(), diff: 3 },
      { gen: storyDecimalMoney(1), diff: 4 },
      { gen: decCompareChoice(), diff: 4 },
    ],
    [
      { gen: wEquiv, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fractionToDecimal(), diff: 3 },
      { gen: decimalToFraction(), diff: 3 },
      { gen: storyDecimalMoney(-1), diff: 4 },
      { gen: decCompareChoice(), diff: 4 },
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
          prompt: 'Explain why 0.8 > 0.35 even though 0.35 has more digits. Use the word "tenths".',
          value: '0.8 is 8 tenths; 0.35 is only 3 tenths and change, and tenths outrank hundredths',
          acceptableForms: ['tenths', 'bigger place', 'place value'],
          keywords: true,
          hints: ['How many tenths in each?', 'Compare the biggest place first.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Is "the decimal with more digits is always larger" true, sometimes true, or never true?',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'The longer-is-bigger trap — 0.8 beats 0.35.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Sometimes it is true (0.75 > 0.7), just not always.' },
          ],
          hints: ['Test 0.8 vs 0.35.', 'It depends on the place values, not the length.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Show that 1/2, 0.5, and 5/10 are the same amount, using tenths. (Written explanation required.)',
          value: 're-cut 1/2 into tenths: 5/10, which is 0.5',
          acceptableForms: ['5/10', '0.5', 'tenths'],
          keywords: true,
          hints: ['Re-cut a half into tenths.', 'Read the tenths off as a decimal.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Using money, explain which is more: $0.4 or $0.36. Name the coins. (Written explanation required.)',
          value: '$0.4 is 4 dimes = 40 cents; $0.36 is 36 cents, so $0.4 is more',
          acceptableForms: ['40', '4 dimes', '0.4'],
          keywords: true,
          hints: ['Turn each into cents.', 'Four dimes is how many cents?'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D12-PZ-01',
    title: 'Puzzle Grove: Decimal or Fraction?',
    puzzleType: 'logic',
    prompt: 'Match each decimal to its simplest fraction and order all of them from least to greatest: 0.5, 0.25, 0.2, 0.75. Then name one that equals a "nice" fraction and one that is trickier — explain.',
    answer: { value: '0.2=1/5, 0.25=1/4, 0.5=1/2, 0.75=3/4; order 0.2 < 0.25 < 0.5 < 0.75', acceptableForms: ['1/5', '1/4', '1/2', '3/4'], validation: 'short-text-keyword' },
    hintLadder: ['Read each as hundredths, then simplify.', 'Compare the tenths place to order them.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fractionToDecimal(), diff: 3 },
    { gen: decimalToFraction(), diff: 3 },
    { gen: decCompareChoice(), diff: 3 },
    { gen: storyDecimalMoney(1), diff: 3 },
    { gen: fractionToDecimal(), diff: 4 },
    { gen: decimalToFraction(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/05: fraction → decimal. 02/06: decimal → fraction (simplify affordance preserved). 03: compare two decimals (longer-is-bigger trap). 04: money add word problem. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'longer-is-bigger', description: 'Thinks a decimal with more digits is larger (0.35 > 0.8).', exampleWrongAnswer: '0.35 called greater than 0.8', distractorRationale: 'Offer the longer decimal as "greater."', reteachPointer: 'explanation/script[0] (compare tenths first)' },
    { errorTag: 'representation-misread', subtype: 'place-misalign', description: 'Reads tenths as hundredths or misplaces the point when converting.', exampleWrongAnswer: '3/10 → 0.03', distractorRationale: 'Offer the place-shifted decimal.', reteachPointer: 'guidedExamples/D12-GE-01 (tenths = one place)' },
    { errorTag: 'procedure-slip', subtype: 'no-simplify', description: 'Converts a decimal to a fraction but leaves it unsimplified.', exampleWrongAnswer: '0.25 → 25/100 left unsimplified', distractorRationale: 'Offer the unsimplified fraction.', reteachPointer: 'guidedExamples/D12-GE-02 (simplify to 1/4)' },
    { errorTag: 'task-comprehension', subtype: 'money-misread', description: 'Loses track of dollars vs cents in a money problem.', exampleWrongAnswer: '$0.4 read as 4 cents', distractorRationale: 'Offer the cents-misread amount.', reteachPointer: 'Day-5 reasoning (0.4 dollars = 40 cents)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Meeting decimals — reading tenths and hundredths as place-value fractions, converting between fractions and decimals, and comparing decimals by place value (not by how many digits they have). This week doubles as the mid-level checkpoint.',
    improvingCandidates: ['converting fractions to decimals and back', 'comparing decimals by place value', 'using money to reason about decimals'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the longer-is-bigger trap — comparing tenths first, as the warm-ups drill' },
      { errorTag: 'representation-misread', text: 'placing the decimal point in the right column when converting' },
      { errorTag: 'procedure-slip', text: 'simplifying a decimal-to-fraction result' },
    ],
    homeFocus: {
      praiseLine: 'You explained that 0.8 beats 0.35 because eight tenths outranks three tenths — reading place value, not digit count, is the whole skill.',
      questionForChild: 'Which is more, 0.6 or 0.48 — and how does thinking in dimes and pennies help?',
      schoolSyncHook: 'If your child\'s class ties decimals to money or to grids, tell us and we will lead with that model.',
    },
    vocabularyForParent: ['tenths (first place after the point)', 'hundredths (second place)', 'decimal point (separates ones from tenths)'],
  },
});
