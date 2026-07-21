/**
 * Level D · Week 3 — "Factors, multiples & primes" (conceptId: factors-multiples-primes).
 * Factor pairs to 100; prime vs composite; multiples. Day-5: prime-sieve +
 * "is the claim true for all numbers?" reasoning.
 * Retrieval (QG-2): D2 ±fluency, D1 rounding, C12 × facts.
 */

import { addWhole, asWarmup, classify, factorPair, multipleFill, multiply, primeChoice, reasoning, roundWhole, subWhole } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D1 = { level: 'D' as const, week: 1 };
const D2 = { level: 'D' as const, week: 2 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wSub = asWarmup(subWhole(1200, 88000), D2);
const wRound = asWarmup(roundWhole(3, 12000, 880000), D1);

export const buildD03 = makeWeekBuilder({
  week: 3,
  conceptId: 'factors-multiples-primes',
  conceptName: 'Factors, multiples & primes',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [C12, D2],
  explanation: {
    hook: 'Some numbers can be arranged into neat rectangles more than one way; a few stubborn numbers make only a single long line. That difference — between rectangle-rich and rectangle-poor numbers — is what "prime" and "composite" really mean.',
    whyBeforeHow:
      'A factor is a number that divides evenly, leaving no remainder; a multiple is what you land on when you skip-count. Every whole number bigger than one is either prime (only 1 and itself as factors) or composite (more factor pairs). Factors and multiples are two views of the same fact: if 6 is a factor of 24, then 24 is a multiple of 6.',
    script: [
      { say: 'Factor pairs of 24: 1×24, 2×12, 3×8, 4×6. Each pair is a different rectangle with 24 tiles.', visual: 'Four rectangles of 24 tiles morph into one another.' },
      { say: 'A prime like 7 has only one rectangle: 1×7. No other whole numbers multiply to it.', visual: 'A 1×7 strip; other rectangles fail to fill evenly.' },
      { say: 'Test small factors 2, 3, 5, 7 to decide prime or composite — and remember factor and multiple are the same fact seen two ways.', visual: 'Divisibility checks flash beside a number.' },
    ],
    summary: 'Factors divide evenly; multiples are skip-count landings. Primes have exactly one factor pair (1 and themselves); composites have more.',
    vocabulary: [
      { term: 'factor', kidGloss: 'a number that divides evenly with no remainder' },
      { term: 'multiple', kidGloss: 'a skip-count landing of a number' },
      { term: 'prime', kidGloss: 'only two factors: 1 and itself' },
      { term: 'composite', kidGloss: 'more than two factors' },
    ],
  },
  guidedExamples: [
    ge(3, 1, 'modeled', 'List all factor pairs of 36.', [
      { teacherSay: 'Walk up from 1: 1×36, 2×18, 3×12, 4×9, 6×6. Stop when the pair meets in the middle.', expected: '1,2,3,4,6,9,12,18,36' },
    ], '1×36, 2×18, 3×12, 4×9, 6×6'),
    ge(3, 2, 'completion', 'Is 51 prime or composite?', [
      { teacherSay: 'Try small factors: is it even? Divisible by 3?' },
      { childDo: 'Find a factor pair or rule it out.', expected: '3 × 17, so composite' },
    ], 'composite'),
    ge(3, 3, 'prompted', 'What is the 6th multiple of 8?', [
      { teacherSay: 'Skip-count by 8, or multiply.', expected: '8 × 6' },
      { childDo: 'State it.', expected: '48' },
    ], '48'),
    ge(3, 4, 'independent', 'Name a number that is a factor of 20 AND a multiple of 5. Solve cold.', [
      { childDo: 'Check the factors of 20 against multiples of 5.', expected: '5 or 10 or 20' },
    ], '5, 10, or 20'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: factorPair(), diff: 2 },
      { gen: multipleFill(), diff: 3 },
      { gen: primeChoice(), diff: 3 },
      { gen: factorPair(), diff: 3 },
      { gen: multipleFill(), diff: 4 },
    ],
    [
      { gen: wAdd, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: primeChoice(), diff: 3 },
      { gen: factorPair(), diff: 3 },
      { gen: multiply(6, 12, 6, 12), diff: 4 },
      { gen: multipleFill(), diff: 4 },
    ],
    [
      { gen: wSub, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: factorPair(), diff: 3 },
      { gen: primeChoice(), diff: 3 },
      { gen: multipleFill(), diff: 4 },
      { gen: factorPair(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: factorPair(), diff: 4 },
      { gen: multipleFill(), diff: 4 },
      { gen: multiply(11, 19, 4, 9), diff: 5 },
    ],
    [
      {
        gen: classify({
          prompt: 'A friend says: "Every odd number is prime." Is that claim always, sometimes, or never true?',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Ignores odd composites like 9, 15, 21.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Overcorrects — many odd numbers (3, 5, 7) are prime.' },
          ],
          hints: ['Test 9 and 15 — are they odd? Are they prime?', 'One counterexample breaks "always."'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain how you know 1 is neither prime nor composite. Use the word "factor".',
          value: '1 has only one factor, itself, so it fits neither definition',
          acceptableForms: ['one factor', 'factor', 'only itself'],
          keywords: true,
          hints: ['How many factors does 1 have?', 'Prime needs exactly two; composite needs more.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Use the sieve idea: after crossing out multiples of 2, 3, and 5 up to 30, which numbers survive? What are they? (Show your crossing-out.)',
          value: 'the primes 7, 11, 13, 17, 19, 23, 29 survive (with 2, 3, 5 themselves)',
          acceptableForms: ['7', '11', '13', '17', '19', '23', '29'],
          keywords: true,
          hints: ['Cross out every second, third, and fifth number.', 'The survivors have no small factors.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'True or false: if a number is a multiple of 6, it must be a multiple of 3. Explain with the factor idea. (Written explanation required.)',
          value: 'true; 6 has 3 as a factor, so any multiple of 6 carries a 3',
          acceptableForms: [],
          hints: ['What are the factors of 6?', 'A multiple of 6 is 6 copies of something — where is the 3?'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D3-PZ-01',
    title: 'Puzzle Grove: Factor Detective',
    puzzleType: 'logic',
    prompt: 'I am a number under 50. I am even, a multiple of 3, and I have exactly six factors. Who might I am? Find all numbers that fit and explain how each clue narrows the field.',
    answer: { value: 'candidates: 12 and 18 (both even multiples of 3 with six factors)', acceptableForms: ['12', '18'], validation: 'short-text-keyword' },
    hintLadder: ['Even AND a multiple of 3 means a multiple of 6.', 'List the factors of each multiple of 6 and count them.'],
    errorTags: ['concept-misconception', 'fact-recall'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: factorPair(), diff: 3 },
    { gen: multipleFill(), diff: 3 },
    { gen: primeChoice(), diff: 3 },
    { gen: factorPair(), diff: 3 },
    { gen: multipleFill(), diff: 4 },
    { gen: multiply(6, 12, 6, 12), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01: complete a factor pair. 02: kth multiple. 03: prime vs composite (choice). 04: complete a factor pair. 05: kth multiple (harder). 06: product of two 1–2-digit factors. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'prime-composite-mixup', description: 'Calls a composite prime by missing a factor pair, or vice versa.', exampleWrongAnswer: '51 called prime (misses 3 × 17)', distractorRationale: 'Offer the opposite classification with a plausible-looking number.', reteachPointer: 'explanation/script[1] (test small factors)' },
    { errorTag: 'fact-recall', subtype: 'skip-count-slip', description: 'Miscounts a multiple or a factor product.', exampleWrongAnswer: '6th multiple of 8 → 56', distractorRationale: 'Offer an adjacent multiple.', reteachPointer: '60-second skip-count refresh; feeds the sprint pool' },
    { errorTag: 'procedure-slip', subtype: 'missed-factor', description: 'Lists factor pairs but skips one (forgets a middle pair).', exampleWrongAnswer: 'factors of 24 without 3 × 8', distractorRationale: 'Offer a factor list with a gap.', reteachPointer: 'guidedExamples/D3-GE-01 (walk up from 1)' },
    { errorTag: 'task-comprehension', subtype: 'factor-vs-multiple', description: 'Swaps factor and multiple — the two directions of the same relationship.', exampleWrongAnswer: 'asked for a multiple, gives a factor', distractorRationale: 'Offer a factor when a multiple is asked.', reteachPointer: 'explanation/summary (two views of one fact)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Factors, multiples, and the prime/composite split — seeing numbers as rectangles (factor pairs) and skip-count landings (multiples), and testing small factors to decide if a number is prime.',
    improvingCandidates: ['finding all factor pairs of a number', 'naming multiples by skip-counting', 'deciding prime versus composite with small-factor tests'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the prime/composite decision — testing 2, 3, 5, 7 before declaring a number prime' },
      { errorTag: 'task-comprehension', text: 'keeping factor and multiple straight — they are the same fact seen two ways' },
      { errorTag: 'fact-recall', text: 'quick multiplication facts that power factor-finding — the sprints target these' },
    ],
    homeFocus: {
      praiseLine: 'You caught that 51 is not prime by spotting 3 × 17 — that is exactly the factor-testing habit that makes primes obvious.',
      questionForChild: 'Is 91 prime or composite? What small factors would you test first?',
      schoolSyncHook: 'Tell us if your child\'s class uses factor rainbows or factor trees, and we will echo that model.',
    },
    vocabularyForParent: ['factor (divides evenly)', 'multiple (a skip-count landing)', 'prime (only two factors)', 'composite (more than two factors)'],
  },
});
