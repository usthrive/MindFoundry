/**
 * Level D · Week 4 — "Multiplicative comparison" (conceptId: multiplicative-comparison).
 * "n times as many" problems and comparison bar models. Day-5: additive-vs-
 * multiplicative comparison sort. Retrieval: D2 ±, D3 multiples, C12 × facts.
 */

import { addWhole, asWarmup, classify, multipleFill, multiply, reasoning, storyMulCompare, subWhole } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D3 = { level: 'D' as const, week: 3 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wSub = asWarmup(subWhole(1200, 88000), D2);
const wMultiple = asWarmup(multipleFill(), D3);

export const buildD04 = makeWeekBuilder({
  week: 4,
  conceptId: 'multiplicative-comparison',
  conceptName: 'Multiplicative comparison',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D2, D3],
  explanation: {
    hook: '"3 more than" and "3 times as many" sound almost alike — but one adds and the other multiplies. Mixing them up is the classic trap of this week, and a bar model catches it every time.',
    whyBeforeHow:
      'A multiplicative comparison scales one amount up by a whole number of copies. If Ava has 4 and Ben has 3 times as many, Ben has 3 copies of Ava\'s 4 — a multiply, not an add. The signal words "times as many" mean copies; "more than" means a difference. Drawing the two bars side by side makes the operation obvious before any numbers move.',
    script: [
      { say: 'Bar model: Ava\'s bar has 4. "3 times as many" means Ben\'s bar is three of Ava\'s bars: 4 + 4 + 4 = 12.', visual: 'One short bar; a bar three times as long stacks beside it.' },
      { say: 'Compare that to "3 MORE than 4," which is one bar plus a little extra: 4 + 3 = 7. Same words, very different pictures.', visual: 'A bar of 4 with a small +3 tail.' },
      { say: 'Read for the signal: "times as many / as long / as heavy" scales; "more / fewer / longer by" adds or subtracts.', visual: 'Signal phrases sort into a multiply pile and an add pile.' },
    ],
    summary: '"Times as many" scales by copies (multiply); "more than" is a difference (add). Draw both bars and the operation reveals itself.',
    vocabulary: [
      { term: 'times as many', kidGloss: 'that many copies of the amount (multiply)' },
      { term: 'more than', kidGloss: 'a difference on top of the amount (add)' },
      { term: 'bar model', kidGloss: 'side-by-side bars that show the comparison' },
    ],
  },
  guidedExamples: [
    ge(4, 1, 'modeled', 'Maya read 6 books. Leo read 4 times as many. How many did Leo read?', [
      { teacherSay: '"4 times as many" means 4 copies of Maya\'s 6: 6 × 4 = 24.', expected: '24' },
    ], '24'),
    ge(4, 2, 'prompted', 'A rope is 8 m. A second rope is 5 times as long. How long is the second rope?', [
      { teacherSay: 'Which operation does "times as long" signal?', expected: 'multiply' },
      { childDo: 'Scale 8 by 5.', expected: '40' },
    ], '40 m'),
    ge(4, 3, 'independent', 'Ben has 7 stickers. Ria has 6 times as many. How many does Ria have? Solve cold.', [
      { childDo: 'Draw the bars, then multiply.', expected: '42' },
    ], '42'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: storyMulCompare(), diff: 2 },
      { gen: multiply(3, 12, 3, 12), diff: 3 },
      { gen: storyMulCompare(), diff: 3 },
      { gen: multiply(11, 40, 2, 9), diff: 3 },
      { gen: storyMulCompare(), diff: 4 },
    ],
    [
      { gen: wAdd, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: storyMulCompare(), diff: 3 },
      { gen: multiply(3, 12, 3, 12), diff: 3 },
      { gen: storyMulCompare(), diff: 4 },
      { gen: multiply(11, 40, 2, 9), diff: 4 },
    ],
    [
      { gen: wSub, diff: 2 },
      { gen: wMultiple, diff: 2 },
      { gen: storyMulCompare(), diff: 3 },
      { gen: multiply(3, 12, 3, 12), diff: 3 },
      { gen: storyMulCompare(), diff: 4 },
      { gen: storyMulCompare(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyMulCompare(), diff: 4 },
      { gen: storyMulCompare(), diff: 4 },
      { gen: storyMulCompare(), diff: 5 },
    ],
    [
      {
        gen: classify({
          prompt: 'Which phrase signals MULTIPLICATION: "4 more than" or "4 times as many"?',
          correct: '4 times as many',
          distractors: [
            { text: '4 more than', errorTag: 'task-comprehension', rationale: 'Confuses a difference ("more than") with scaling ("times as many").' },
            { text: 'both mean multiply', errorTag: 'concept-misconception', rationale: 'Misses that "more than" is an addition.' },
          ],
          hints: ['Which one means "copies of"?', 'Draw both bar models and compare.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Ava has 5 marbles. Write ONE "more than" sentence and ONE "times as many" sentence about Ben, then solve both. Explain why the answers differ.',
          value: 'more-than adds a difference; times-as-many multiplies into copies, so the totals differ',
          acceptableForms: ['more than', 'times as many', 'multiply', 'add'],
          keywords: true,
          hints: ['One sentence adds; the other scales.', 'Compare the two bar pictures.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'A tree is 3 m tall. Next year it is "twice as tall." Always/sometimes/never: twice as tall means the height doubled.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Hedges on a fixed definition — "twice" always means ×2.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reads the claim backwards.' },
          ],
          hints: ['What number does "twice" stand for?', 'Doubling is multiplying by exactly 2.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'A problem says "Sam has 12, which is 3 times what Pia has." How many does Pia have, and why is this a DIVIDE? (Written explanation required.)',
          value: 'Pia has 4; the total is 3 copies of Pia, so undo with division',
          acceptableForms: [],
          hints: ['12 is 3 copies of Pia\'s amount.', 'To find one copy, divide the total by 3.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D4-PZ-01',
    title: 'Puzzle Grove: Bar-Model Match',
    puzzleType: 'logic',
    prompt: 'Three stories: (a) "6 more than 10", (b) "3 times as many as 10", (c) "10 fewer than 40". Match each to its bar picture and its answer, and say which one is a multiplicative comparison.',
    answer: { value: '(a) 16 add, (b) 30 multiply — the multiplicative one, (c) 30 subtract', acceptableForms: ['b', '(b)', '30'], validation: 'short-text-keyword' },
    hintLadder: ['Sort the signal words first: add, multiply, subtract.', 'Only "times as many" scales into copies.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: storyMulCompare(), diff: 3 },
    { gen: multiply(3, 12, 3, 12), diff: 3 },
    { gen: storyMulCompare(), diff: 3 },
    { gen: multiply(11, 40, 2, 9), diff: 3 },
    { gen: storyMulCompare(), diff: 4 },
    { gen: multiply(3, 12, 3, 12), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/03/05: "times as many" comparison stories (scaling affordance preserved). 02/04/06: supporting products. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'task-comprehension', subtype: 'more-vs-times', description: 'Reads "times as many" as "more than" (adds instead of scaling), or vice versa.', exampleWrongAnswer: '"4 times 6" answered as 10', distractorRationale: 'Offer the add-instead-of-multiply result.', reteachPointer: 'explanation/script[1] (two very different bars)' },
    { errorTag: 'concept-misconception', subtype: 'compare-direction', description: 'Multiplies the wrong quantity, or divides when the smaller amount is unknown.', exampleWrongAnswer: '"12 is 3 times Pia" answered 36', distractorRationale: 'Offer the multiply-instead-of-divide result.', reteachPointer: 'Day-5 reasoning (undo copies with division)' },
    { errorTag: 'procedure-slip', subtype: 'scaling-fact-slip', description: 'Picks the right operation but slips on the multiplication fact.', exampleWrongAnswer: '7 × 6 → 48', distractorRationale: 'Offer an adjacent product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplicative comparison — telling "times as many" (scaling into copies, a multiply) apart from "more than" (a difference, an add), using side-by-side bar models.',
    improvingCandidates: ['spotting the "times as many" signal and multiplying', 'drawing comparison bar models', 'finding the smaller amount by dividing'],
    strengtheningByTag: [
      { errorTag: 'task-comprehension', text: 'keeping "times as many" and "more than" apart — the bar-model warm-ups make the difference visible' },
      { errorTag: 'concept-misconception', text: 'choosing multiply or divide by which amount is unknown' },
      { errorTag: 'procedure-slip', text: 'the multiplication fact once the operation is chosen — the sprints keep facts sharp' },
    ],
    homeFocus: {
      praiseLine: 'You drew the two bars and instantly saw that "3 times as many" is a multiply, not an add — that picture is the whole skill.',
      questionForChild: 'If Sam has 12 and that is 3 times what Pia has, how many does Pia have — and is that a multiply or a divide?',
      schoolSyncHook: 'If your child\'s class draws bar/tape models a certain way, tell us and we will match the style.',
    },
    vocabularyForParent: ['times as many (copies — multiply)', 'more than (a difference — add)', 'bar model (side-by-side comparison)'],
  },
});
