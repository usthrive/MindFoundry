/**
 * Level D · Week 9 — "Fraction equivalence & comparison" (conceptId: fraction-equivalence-comparison).
 * Equivalence by scaling; compare via benchmarks and common denominators. Day-5:
 * order fractions WITHOUT computing. Retrieval: C15/C16 fractions, C12 × facts.
 */

import { asWarmup, classify, fracCompareChoice, fracEquivFill, multiply, reasoning, storyFractionCompare } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const C15 = { level: 'C' as const, week: 15 };
const C16 = { level: 'C' as const, week: 16 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wEquiv = asWarmup(fracEquivFill(), C16);
const wCompare = asWarmup(fracCompareChoice(), C15);

export const buildD09 = makeWeekBuilder({
  week: 9,
  conceptId: 'fraction-equivalence-comparison',
  conceptName: 'Fraction equivalence & comparison',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [C15, C16],
  explanation: {
    hook: 'Is 3/5 bigger than 1/2? You cannot tell by staring — the pieces are different sizes. But re-cut both into the same size, or lean each against the friendly landmark 1/2, and the answer jumps out.',
    whyBeforeHow:
      'Two fractions are equivalent when they name the same amount with different-sized pieces: 1/2 = 3/6 = 50/100. Scaling top and bottom by the same number re-cuts without changing the amount. To compare, either give both a common piece-size (common denominator) or judge each against a benchmark like 0, 1/2, and 1. A bigger denominator means SMALLER pieces, not a bigger amount — the classic trap.',
    script: [
      { say: 'Scale 1/2 by 3: top and bottom both ×3 gives 3/6. Same length on the number line, new name.', visual: 'A 1/2 bar re-cuts into 3/6; the length holds still.' },
      { say: 'Compare 3/5 and 1/2 with the 1/2 benchmark: 3/5 is past the halfway mark, so 3/5 is bigger.', visual: '3/5 and 1/2 sit on a 0–1 line with a 1/2 flag.' },
      { say: 'Trap: 1/8 vs 1/3 — the 8 looks bigger, but eighths are TINY pieces, so 1/3 is more.', visual: 'One eighth-piece dwarfed by one third-piece.' },
    ],
    summary: 'Scale top and bottom together to make equivalent fractions. Compare by a common size or a benchmark; remember a bigger bottom means smaller pieces.',
    vocabulary: [
      { term: 'equivalent fraction', kidGloss: 'same amount, different-sized pieces' },
      { term: 'benchmark', kidGloss: 'a friendly landmark like 0, 1/2, or 1' },
      { term: 'common denominator', kidGloss: 'a shared piece-size for fair comparison' },
    ],
  },
  guidedExamples: [
    ge(9, 1, 'modeled', 'Fill in: 2/3 = ?/12.', [
      { teacherSay: '3 scales to 12 by ×4, so the top scales by ×4 too: 2 × 4 = 8. So 8/12.', expected: '8' },
    ], '8'),
    ge(9, 2, 'prompted', 'Which is greater: 5/8 or 1/2?', [
      { teacherSay: 'Write 1/2 in eighths.', expected: '4/8' },
      { childDo: 'Compare 5/8 with 4/8.', expected: '5/8 is greater' },
    ], '5/8'),
    ge(9, 3, 'independent', 'Which is greater: 2/5 or 3/8? Solve cold with a benchmark or common size.', [
      { childDo: 'Compare each to 1/2, or re-cut both to fortieths.', expected: '3/8 is greater' },
    ], '3/8'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: fracEquivFill(), diff: 2 },
      { gen: fracCompareChoice(), diff: 3 },
      { gen: fracEquivFill(), diff: 3 },
      { gen: fracCompareChoice(), diff: 3 },
      { gen: fracEquivFill(), diff: 4 },
    ],
    [
      { gen: wCompare, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracEquivFill(), diff: 3 },
      { gen: fracCompareChoice(), diff: 3 },
      { gen: storyFractionCompare(), diff: 4 },
      { gen: fracEquivFill(), diff: 4 },
    ],
    [
      { gen: wEquiv, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracCompareChoice(), diff: 3 },
      { gen: fracEquivFill(), diff: 3 },
      { gen: storyFractionCompare(), diff: 4 },
      { gen: fracCompareChoice(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyFractionCompare(), diff: 4 },
      { gen: storyFractionCompare(), diff: 4 },
      { gen: storyFractionCompare(), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'Order 3/4, 1/2, and 5/8 from least to greatest WITHOUT finding a common denominator. Explain using the 1/2 benchmark.',
          value: '1/2, 5/8, 3/4 — all compared against one half',
          acceptableForms: ['1/2, 5/8, 3/4', 'benchmark', 'half'],
          keywords: true,
          hints: ['Which are above 1/2? Which is exactly 1/2?', 'Then split the above-half ones by eighths and fourths.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'A friend says 1/6 is bigger than 1/4 "because 6 is bigger than 4." Always, sometimes, or never right for unit fractions?',
          correct: 'never',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'The bigger-bottom-is-bigger trap — larger denominators make smaller pieces.' },
            { text: 'sometimes', errorTag: 'representation-misread', rationale: 'For unit fractions the rule is absolute, not conditional.' },
          ],
          hints: ['Picture one sixth-piece and one fourth-piece.', 'More cuts make each piece smaller.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why 3/6 and 1/2 are equal, using the word "pieces". (Written explanation required.)',
          value: 'both name the same amount; 3/6 just cuts the same half into more, smaller pieces',
          acceptableForms: [],
          hints: ['Re-cut 1/2 into sixths.', 'Does the length change when you add cut lines?'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Two children compare 2/3 of a small pizza and 2/3 of a large pizza. Is "they are equal shares" always, sometimes, or never true?',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Ignores that 2/3 of different-sized wholes are different AMOUNTS.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'They ARE the same FRACTION, even if different amounts.' },
          ],
          hints: ['Same fraction, but of what whole?', 'When are the wholes the same size?'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D9-PZ-01',
    title: 'Puzzle Grove: Benchmark Sort',
    puzzleType: 'logic',
    prompt: 'Sort these into "less than 1/2," "equal to 1/2," and "greater than 1/2" WITHOUT computing: 2/5, 4/8, 5/9, 3/10, 7/12. Give a one-line reason for each.',
    answer: { value: 'less: 2/5, 3/10; equal: 4/8; greater: 5/9, 7/12', acceptableForms: ['2/5', '3/10', '4/8', '5/9', '7/12'], validation: 'short-text-keyword' },
    hintLadder: ['Half the denominator marks the 1/2 point of the numerator.', 'Is the top above, at, or below half the bottom?'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fracEquivFill(), diff: 3 },
    { gen: fracCompareChoice(), diff: 3 },
    { gen: fracEquivFill(), diff: 3 },
    { gen: storyFractionCompare(), diff: 3 },
    { gen: fracCompareChoice(), diff: 4 },
    { gen: fracEquivFill(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/03/06: fill an equivalent fraction (scale-both affordance preserved). 02/05: compare two fractions (benchmark/common-size choice). 04: comparison word problem. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'bigger-bottom-bigger', description: 'Judges a fraction bigger because its denominator is bigger (misses that more pieces are smaller).', exampleWrongAnswer: '1/6 called bigger than 1/4', distractorRationale: 'Offer the larger-denominator fraction as "greater."', reteachPointer: 'explanation/script[2] (eighths are tiny)' },
    { errorTag: 'procedure-slip', subtype: 'scale-one-only', description: 'Scales the denominator to make an equivalent fraction but forgets to scale the numerator.', exampleWrongAnswer: '2/3 = 2/12', distractorRationale: 'Offer the denominator-only-scaled result.', reteachPointer: 'guidedExamples/D9-GE-01 (both numbers scale)' },
    { errorTag: 'representation-misread', subtype: 'wrong-benchmark', description: 'Places a fraction on the wrong side of the 1/2 benchmark.', exampleWrongAnswer: '5/9 placed below 1/2', distractorRationale: 'Offer a mis-benchmarked ordering.', reteachPointer: 'Day-5 reasoning (half the bottom marks the 1/2 point)' },
    { errorTag: 'task-comprehension', subtype: 'fraction-vs-amount', description: 'Confuses "same fraction" with "same amount" when wholes differ.', exampleWrongAnswer: '2/3 of small = 2/3 of large', distractorRationale: 'Offer "always equal" on different-whole comparisons.', reteachPointer: 'Day-5 classify (fraction vs amount)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Making equivalent fractions by scaling top and bottom together, and comparing fractions with benchmarks (like 1/2) or a common piece-size — including the trap that a bigger denominator means smaller pieces.',
    improvingCandidates: ['scaling both numbers to make equivalent fractions', 'comparing fractions against the 1/2 benchmark', 'ordering fractions without heavy computing'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the bigger-bottom-is-smaller-pieces idea — unit-fraction warm-ups keep this front and center' },
      { errorTag: 'procedure-slip', text: 'scaling BOTH the top and the bottom when making equivalents' },
      { errorTag: 'representation-misread', text: 'placing fractions correctly against the 1/2 landmark' },
    ],
    homeFocus: {
      praiseLine: 'You compared 3/5 and 1/2 by leaning each on the half mark — that benchmark move is faster and deeper than cross-multiplying.',
      questionForChild: 'Is 5/8 more or less than 1/2 — and how can you tell without any calculating?',
      schoolSyncHook: 'If your child\'s class uses fraction strips or number lines, tell us and we will match that model.',
    },
    vocabularyForParent: ['equivalent fraction (same amount, new pieces)', 'benchmark (a landmark like 1/2)', 'common denominator (a shared piece-size)'],
  },
});
