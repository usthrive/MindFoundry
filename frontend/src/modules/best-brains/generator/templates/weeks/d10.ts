/**
 * Level D · Week 10 — "± fractions (like denominators)" (conceptId: frac-addsub-like-denominators).
 * Add/subtract fractions and mixed numbers with like denominators. Day-5:
 * fraction-sum target puzzles (make 2 exactly). Retrieval: D9 equivalence, C15 fractions, C12 × facts.
 */

import { asWarmup, classify, fracAddSubLike, fracCompareChoice, fracEquivFill, multiply, reasoning, storyFractionCombine } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const C15 = { level: 'C' as const, week: 15 };
const D9 = { level: 'D' as const, week: 9 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wEquiv = asWarmup(fracEquivFill(), D9);
const wCompare = asWarmup(fracCompareChoice(), C15);

export const buildD10 = makeWeekBuilder({
  week: 10,
  conceptId: 'frac-addsub-like-denominators',
  conceptName: 'Adding & subtracting fractions (like denominators)',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [C15, D9],
  explanation: {
    hook: 'When the pieces already match — fifths and fifths — adding fractions is just counting: 2 fifths and 1 fifth make 3 fifths. The bottom number names the piece; it does not change when you count.',
    whyBeforeHow:
      'A fraction counts equal pieces. When two fractions share a denominator, they count the SAME size piece, so you simply add or subtract the counts on top; the piece-size (bottom) stays fixed. The tempting mistake — adding the bottoms too — would change the piece mid-count, which makes no sense. Simplify at the end when the result shares a factor.',
    script: [
      { say: '2/5 + 1/5: two fifth-pieces plus one fifth-piece = three fifth-pieces, 3/5. The bottom never moves.', visual: 'Fifth-pieces snap together on one bar.' },
      { say: '5/6 − 2/6: take two sixth-pieces from five, leaving 3/6, which simplifies to 1/2.', visual: 'Two of five sixth-pieces slide off; 3/6 collapses to 1/2.' },
      { say: 'Mixed numbers: add wholes with wholes and fractions with fractions — 1 1/4 + 2 2/4 = 3 3/4.', visual: 'Whole bars stack; quarter-pieces combine.' },
    ],
    summary: 'Same denominator = same piece-size, so add or subtract only the top counts; the bottom stays. Combine wholes separately and simplify at the end.',
    vocabulary: [
      { term: 'like denominators', kidGloss: 'same-size pieces, ready to count together' },
      { term: 'numerator', kidGloss: 'how many pieces you have (the count on top)' },
      { term: 'simplify', kidGloss: 'rename to the fewest, largest pieces' },
    ],
  },
  guidedExamples: [
    ge(10, 1, 'modeled', '3/8 + 2/8.', [
      { teacherSay: 'Eighths and eighths — count: 3 + 2 = 5 eighth-pieces, so 5/8. The 8 stays.', expected: '5/8' },
    ], '5/8'),
    ge(10, 2, 'prompted', '7/10 − 3/10.', [
      { teacherSay: 'Same tenths — subtract the counts.', expected: '4/10' },
      { childDo: 'Simplify.', expected: '2/5' },
    ], '2/5'),
    ge(10, 3, 'independent', '2 1/6 + 1 4/6. Solve cold.', [
      { childDo: 'Wholes with wholes, sixths with sixths; simplify if you can.', expected: '3 5/6' },
    ], '3 5/6'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: fracAddSubLike(1), diff: 2 },
      { gen: fracAddSubLike(-1), diff: 3 },
      { gen: fracAddSubLike(1), diff: 3 },
      { gen: fracAddSubLike(-1), diff: 3 },
      { gen: fracAddSubLike(1), diff: 4 },
    ],
    [
      { gen: wEquiv, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracAddSubLike(-1), diff: 3 },
      { gen: fracAddSubLike(1), diff: 3 },
      { gen: storyFractionCombine(1, true), diff: 4 },
      { gen: fracAddSubLike(-1), diff: 4 },
    ],
    [
      { gen: wCompare, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracAddSubLike(1), diff: 3 },
      { gen: fracAddSubLike(-1), diff: 3 },
      { gen: storyFractionCombine(-1, true), diff: 4 },
      { gen: fracAddSubLike(1), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyFractionCombine(1, true), diff: 4 },
      { gen: storyFractionCombine(-1, true), diff: 4 },
      { gen: storyFractionCombine(1, true), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'A friend adds 2/5 + 1/5 and gets 3/10. Explain the mistake in one line, using the word "pieces".',
          value: 'they added the bottoms too; the piece-size (fifths) must stay the same',
          acceptableForms: ['added the bottom', 'pieces', 'same size'],
          keywords: true,
          hints: ['What size are the pieces before and after?', 'Adding bottoms changes the piece mid-count.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'To add 3/8 + 4/8, what happens to the denominator 8?',
          correct: 'it stays 8 — the piece-size does not change',
          distractors: [
            { text: 'it becomes 16 (add the bottoms)', errorTag: 'concept-misconception', rationale: 'The signature add-the-bottoms error.' },
            { text: 'it becomes 64 (multiply the bottoms)', errorTag: 'concept-misconception', rationale: 'Multiplies denominators as if they were unlike.' },
          ],
          hints: ['Are the pieces the same size already?', 'Count the pieces; keep their size.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Find two sixths-fractions (each less than 1) that add to exactly 2. List them and explain. (Written explanation required.)',
          value: 'no two proper sixths reach 2; the most is 5/6 + 5/6 = 10/6 < 2 — so it is impossible',
          acceptableForms: [],
          hints: ['What is the biggest a proper sixth can be?', 'Add the two biggest and compare to 2.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Make 2 exactly using three fractions with denominator 4 (mixed numbers allowed). Give one solution and check it.',
          value: 'for example 3/4 + 3/4 + 2/4 = 8/4 = 2',
          acceptableForms: ['8/4', '2'],
          keywords: true,
          hints: ['2 equals how many fourths?', 'Pick three counts of fourths that total that.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D10-PZ-01',
    title: 'Puzzle Grove: Make Exactly Two',
    puzzleType: 'game',
    prompt: 'Cards: 1/4, 3/4, 2/4, 5/4, 1/4, 3/4. Choose cards (repeats allowed from the pile) whose sum is EXACTLY 2. Find two different winning sets and show each sums to 8/4.',
    answer: { value: 'e.g. 5/4 + 3/4 = 2 and 3/4 + 3/4 + 2/4 = 2', acceptableForms: ['8/4', '2'], validation: 'short-text-keyword' },
    hintLadder: ['2 is how many fourths?', 'Add counts of fourths until they reach 8/4.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fracAddSubLike(1), diff: 3 },
    { gen: fracAddSubLike(-1), diff: 3 },
    { gen: fracAddSubLike(1), diff: 3 },
    { gen: storyFractionCombine(1, true), diff: 3 },
    { gen: fracAddSubLike(-1), diff: 4 },
    { gen: fracAddSubLike(1), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/03/06: like-denominator addition (simplify affordance preserved). 02/05: like-denominator subtraction. 04: like-denominator combine word problem. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'add-the-bottoms', description: 'Adds denominators as well as numerators (2/5 + 1/5 = 3/10).', exampleWrongAnswer: '2/5 + 1/5 → 3/10', distractorRationale: 'Offer the added-bottoms result.', reteachPointer: 'explanation/script[0] (the bottom never moves)' },
    { errorTag: 'procedure-slip', subtype: 'no-simplify', description: 'Leaves a result unsimplified when a common factor exists.', exampleWrongAnswer: '4/10 left as 4/10', distractorRationale: 'Offer the unsimplified form as a near-answer.', reteachPointer: 'guidedExamples/D10-GE-02 (simplify at the end)' },
    { errorTag: 'representation-misread', subtype: 'mixed-parts-crossed', description: 'Adds a whole to a fraction part, or mixes the columns of a mixed number.', exampleWrongAnswer: '1 1/4 + 2 2/4 → 3 3 (parts crossed)', distractorRationale: 'Offer a crossed-parts total.', reteachPointer: 'explanation/script[2] (wholes with wholes)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Adding and subtracting fractions (and mixed numbers) that already share a denominator — counting the same-size pieces, keeping the bottom fixed, and simplifying the result.',
    improvingCandidates: ['combining like-denominator fractions by counting pieces', 'keeping the denominator fixed', 'simplifying the answer'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'NOT adding the bottoms — the piece-size stays the same, and the warm-ups reinforce it' },
      { errorTag: 'procedure-slip', text: 'simplifying the result to its lowest terms' },
      { errorTag: 'representation-misread', text: 'keeping whole parts and fraction parts in their own columns for mixed numbers' },
    ],
    homeFocus: {
      praiseLine: 'You saw that 2/5 + 1/5 is just counting fifths — three of them — without touching the bottom. That is the whole idea.',
      questionForChild: 'When you add 3/8 + 4/8, what happens to the 8 — and why?',
      schoolSyncHook: 'If your child\'s class simplifies fractions at a particular step, tell us and we will match that habit.',
    },
    vocabularyForParent: ['like denominators (same-size pieces)', 'numerator (the count on top)', 'simplify (fewest, largest pieces)'],
  },
});
