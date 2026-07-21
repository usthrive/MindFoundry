/**
 * Level D · Week 21 — "Order of operations & expressions" (conceptId: order-of-operations-expressions).
 * Evaluate with parentheses; write expressions from words. Day-5: insert-the-
 * parentheses to hit a target. Retrieval: D2 ±, D5 ×, C12 × facts.
 */

import { addWhole, asWarmup, classify, evalExpr, multiply, reasoning, writeExprChoice } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D5 = { level: 'D' as const, week: 5 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wArea = asWarmup(multiply(11, 49, 3, 9), D5);

export const buildD21 = makeWeekBuilder({
  week: 21,
  conceptId: 'order-of-operations-expressions',
  conceptName: 'Order of operations & expressions',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D2, D5],
  explanation: {
    hook: '3 + 4 × 2 is 11, not 14 — because multiplication happens before addition. Math has traffic rules so that everyone reads the same expression the same way. Parentheses are the override that lets you change the order on purpose.',
    whyBeforeHow:
      'Order of operations is a shared agreement: do parentheses first, then multiplication and division, then addition and subtraction, working left to right within a level. Without it, one expression could mean many things. Parentheses group work that must happen first, so "(3 + 4) × 2" deliberately adds before multiplying. Writing expressions from words is the reverse skill — turning "twice the sum of 3 and 5" into 2 × (3 + 5).',
    script: [
      { say: '3 + 4 × 2: multiplication first (4 × 2 = 8), then add: 11. Not left-to-right.', visual: 'The × step highlights before the + step.' },
      { say: 'Parentheses override: (3 + 4) × 2 groups the add first (7), then × 2 = 14.', visual: 'Parentheses glow; the add happens inside first.' },
      { say: 'Words to symbols: "twice the sum of 3 and 5" groups the sum, then doubles: 2 × (3 + 5).', visual: 'A phrase maps onto a grouped expression.' },
    ],
    summary: 'Follow the order: parentheses, then × and ÷, then + and −, left to right. Parentheses change the order on purpose; translate "sum/difference" phrases into grouped expressions.',
    vocabulary: [
      { term: 'order of operations', kidGloss: 'the agreed order for doing a calculation' },
      { term: 'parentheses', kidGloss: 'grouping that must be done first' },
      { term: 'expression', kidGloss: 'a math phrase with numbers and operations, no equals' },
    ],
  },
  guidedExamples: [
    ge(21, 1, 'modeled', 'Evaluate 5 + 6 × 3.', [
      { teacherSay: 'Multiply first: 6 × 3 = 18, then add 5: 23.', expected: '23' },
    ], '23'),
    ge(21, 2, 'prompted', 'Evaluate (5 + 6) × 3.', [
      { teacherSay: 'What do the parentheses tell you to do first?', expected: 'add 5 + 6' },
      { childDo: 'Finish.', expected: '33' },
    ], '33'),
    ge(21, 3, 'independent', 'Write "three times the sum of 4 and 2" as an expression, then evaluate. Solve cold.', [
      { childDo: 'Group the sum, then multiply.', expected: '3 × (4 + 2) = 18' },
    ], '18'),
  ],
  days: [
    [
      { gen: wAdd, diff: 2 },
      { gen: evalExpr(false), diff: 2 },
      { gen: evalExpr(true), diff: 3 },
      { gen: writeExprChoice(), diff: 3 },
      { gen: evalExpr(false), diff: 3 },
      { gen: evalExpr(true), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: evalExpr(true), diff: 3 },
      { gen: evalExpr(false), diff: 3 },
      { gen: writeExprChoice(), diff: 4 },
      { gen: evalExpr(true), diff: 4 },
    ],
    [
      { gen: wAdd, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: evalExpr(false), diff: 3 },
      { gen: evalExpr(true), diff: 3 },
      { gen: writeExprChoice(), diff: 4 },
      { gen: evalExpr(false), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: evalExpr(true), diff: 4 },
      { gen: evalExpr(false), diff: 4 },
      { gen: writeExprChoice(), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'Insert parentheses in 2 + 3 × 4 to make it equal 20. Write the parenthesized expression.',
          value: '(2 + 3) × 4 = 20',
          acceptableForms: ['(2 + 3) × 4', '(2+3)'],
          keywords: true,
          hints: ['You need the add to happen before the multiply.', 'Group 2 + 3.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Without parentheses, what does 8 − 2 × 3 equal?',
          correct: '2 (multiply first: 8 − 6)',
          distractors: [
            { text: '18 (left to right: 6 × 3)', errorTag: 'procedure-slip', rationale: 'Works strictly left to right, ignoring that × comes before −.' },
            { text: '4 (subtract first, then guess)', errorTag: 'concept-misconception', rationale: 'Subtracts before multiplying.' },
          ],
          hints: ['Which operation comes first, × or −?', 'Do 2 × 3 before the subtraction.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why 3 + 4 × 2 is not 14, using the order of operations. (Written explanation required.)',
          value: 'multiplication comes before addition, so 4 × 2 = 8 first, then + 3 = 11',
          acceptableForms: ['multiplication first', '11', 'order'],
          keywords: true,
          hints: ['Which operation has priority?', 'Do the × before the +.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Which expression means "5 less than the product of 3 and 4"?',
          correct: '3 × 4 − 5',
          distractors: [
            { text: '5 − 3 × 4', errorTag: 'task-comprehension', rationale: '"5 less than X" is X − 5, not 5 − X.' },
            { text: '(3 + 4) − 5', errorTag: 'concept-misconception', rationale: 'Uses sum instead of product.' },
          ],
          hints: ['"Product" means multiply; "less than" reverses the order.', 'X − 5, where X is the product.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D21-PZ-01',
    title: 'Puzzle Grove: Parenthesis Power',
    puzzleType: 'logic',
    prompt: 'Using the numbers 6, 2, and 3 once each with + and ×, and inserting parentheses, make three different values. Show the expressions and their results.',
    answer: { value: 'e.g. 6 + 2 × 3 = 12, (6 + 2) × 3 = 24, 6 × 2 + 3 = 15', acceptableForms: ['12', '24', '15'], validation: 'short-text-keyword' },
    hintLadder: ['Parentheses change which operation happens first.', 'Try grouping different pairs.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: evalExpr(false), diff: 3 },
    { gen: evalExpr(true), diff: 3 },
    { gen: writeExprChoice(), diff: 3 },
    { gen: evalExpr(false), diff: 3 },
    { gen: evalExpr(true), diff: 4 },
    { gen: writeExprChoice(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/04: evaluate without parentheses (× before +). 02/05: evaluate with parentheses (grouping-first affordance). 03/06: translate words → expression (choice). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'procedure-slip', subtype: 'left-to-right', description: 'Evaluates strictly left to right, ignoring that × and ÷ come before + and −.', exampleWrongAnswer: '3 + 4 × 2 → 14', distractorRationale: 'Offer the left-to-right result.', reteachPointer: 'explanation/script[0] (× before +)' },
    { errorTag: 'concept-misconception', subtype: 'ignore-parentheses', description: 'Skips or misreads the parentheses that change the order.', exampleWrongAnswer: '(5 + 6) × 3 → 23', distractorRationale: 'Offer the no-parentheses result.', reteachPointer: 'guidedExamples/D21-GE-02 (parentheses first)' },
    { errorTag: 'task-comprehension', subtype: 'phrase-reversal', description: 'Reverses a "less than / from" phrase when translating words to symbols.', exampleWrongAnswer: '"5 less than the product" → 5 − product', distractorRationale: 'Offer the reversed-order expression.', reteachPointer: 'Day-5 classify (X − 5, not 5 − X)' },
    { errorTag: 'representation-misread', subtype: 'grouping-scope', description: 'Groups the wrong part when writing an expression from words.', exampleWrongAnswer: '"twice the sum of 3 and 5" → 2 × 3 + 5', distractorRationale: 'Offer the mis-grouped expression.', reteachPointer: 'writeExprChoice (group the whole sum)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Order of operations and expressions — following the agreed order (parentheses, then × and ÷, then + and −), using parentheses to change the order on purpose, and translating word phrases into grouped expressions.',
    improvingCandidates: ['doing × and ÷ before + and −', 'evaluating parentheses first', 'writing an expression from a word phrase'],
    strengtheningByTag: [
      { errorTag: 'procedure-slip', text: 'the priority of × and ÷ over + and − — the warm-ups reinforce it' },
      { errorTag: 'concept-misconception', text: 'honoring parentheses that change the order' },
      { errorTag: 'task-comprehension', text: 'reading "less than / from" phrases in the right order' },
    ],
    homeFocus: {
      praiseLine: 'You inserted parentheses to turn 2 + 3 × 4 into 20 — controlling the order on purpose is exactly what parentheses are for.',
      questionForChild: 'What does 3 + 4 × 2 equal — and why isn\'t it 14?',
      schoolSyncHook: 'If your child\'s class uses a memory phrase for the order, tell us and we will echo it (while keeping the reasoning front and center).',
    },
    vocabularyForParent: ['order of operations (the agreed order)', 'parentheses (do this first)', 'expression (a math phrase, no equals)'],
  },
});
