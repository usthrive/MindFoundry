/**
 * Level D · Week 22 — "Coordinate plane (Q1) & patterns" (conceptId: coordinate-plane-q1-patterns).
 * Plot points; generate patterns and read their terms. Day-5: hidden-picture
 * plotting + "what does the pattern predict?" Retrieval: D21 expressions, D2 ±, C12 × facts.
 */

import { addWhole, asWarmup, classify, evalExpr, multiply, patternTerm, plotChoice, reasoning } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D21 = { level: 'D' as const, week: 21 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wEval = asWarmup(evalExpr(false), D21);

export const buildD22 = makeWeekBuilder({
  week: 22,
  conceptId: 'coordinate-plane-q1-patterns',
  conceptName: 'Coordinate plane (Q1) & patterns',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D2, D21],
  explanation: {
    hook: 'An ordered pair like (3, 4) is a treasure-map instruction: go 3 right, then 4 up. Get the order wrong and you dig in the wrong spot. Patterns are the same idea in a table — a rule that predicts what comes next.',
    whyBeforeHow:
      'The first-quadrant coordinate plane names each point by how far RIGHT (x) and how far UP (y) it sits from the origin (0, 0) — always x before y. A number pattern has a starting value and a step; its rule lets you predict any term without listing them all: the nth term is start + step × (n − 1). Plotting the terms turns the rule into a straight staircase you can read.',
    script: [
      { say: '(3, 4): from the origin, 3 right then 4 up. The first number is always the across move.', visual: 'A dot walks 3 right, 4 up on a grid.' },
      { say: 'Pattern starting at 2, adding 5: 2, 7, 12, 17... the 1st is the start, each later adds 5.', visual: 'A table fills; a staircase of dots climbs.' },
      { say: 'Predict the 6th term without listing: start 2 plus five steps of 5 = 27. The rule beats counting.', visual: 'The rule jumps straight to the 6th term.' },
    ],
    summary: 'Plot a point as (right, up) from the origin — x before y. A pattern\'s nth term is start + step × (n − 1); use the rule to predict any term.',
    vocabulary: [
      { term: 'ordered pair', kidGloss: '(across, up) — x before y' },
      { term: 'origin', kidGloss: 'the corner (0, 0) where the axes meet' },
      { term: 'term', kidGloss: 'one number in a pattern (1st, 2nd, ...)' },
    ],
  },
  guidedExamples: [
    ge(22, 1, 'modeled', 'A pattern starts at 3 and adds 4. What is the 5th term?', [
      { teacherSay: '3, 7, 11, 15, 19 — or by rule: 3 + 4 × 4 = 19.', expected: '19' },
    ], '19'),
    ge(22, 2, 'prompted', 'Name the ordered pair 5 right and 2 up from the origin.', [
      { teacherSay: 'Which number comes first, across or up?', expected: 'across (x)' },
      { childDo: 'Write the pair.', expected: '(5, 2)' },
    ], '(5, 2)'),
    ge(22, 3, 'independent', 'A pattern starts at 6 and adds 3. What is the 7th term? Solve cold.', [
      { childDo: 'Use start + step × (n − 1).', expected: '24' },
    ], '24'),
  ],
  days: [
    [
      { gen: wAdd, diff: 2 },
      { gen: patternTerm(), diff: 2 },
      { gen: plotChoice(), diff: 3 },
      { gen: patternTerm(), diff: 3 },
      { gen: plotChoice(), diff: 3 },
      { gen: patternTerm(), diff: 4 },
    ],
    [
      { gen: wEval, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: plotChoice(), diff: 3 },
      { gen: patternTerm(), diff: 3 },
      { gen: patternTerm(), diff: 4 },
      { gen: plotChoice(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: patternTerm(), diff: 3 },
      { gen: plotChoice(), diff: 3 },
      { gen: patternTerm(), diff: 4 },
      { gen: plotChoice(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: patternTerm(), diff: 4 },
      { gen: patternTerm(), diff: 4 },
      { gen: plotChoice(), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'A pattern is 4, 9, 14, 19, ... What is its rule, and what is the 10th term? Show how you predicted it.',
          value: 'start 4, add 5 each time; the 10th term is 4 + 5 × 9 = 49',
          acceptableForms: ['add 5', '49'],
          keywords: true,
          hints: ['How much is added each step?', 'Use start + step × (n − 1).'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Which point is at (2, 5)?',
          correct: '2 right and 5 up from the origin',
          distractors: [
            { text: '5 right and 2 up from the origin', errorTag: 'representation-misread', rationale: 'Swaps x and y — up before across.' },
            { text: '2 right and stay on the bottom axis', errorTag: 'task-comprehension', rationale: 'Ignores the up-move entirely.' },
          ],
          hints: ['First number is across, second is up.', 'x before y.'],
          errorTags: ['representation-misread', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Two patterns start at 0: one adds 2, the other adds 4. When you plot both, how do their staircases differ, and which climbs faster? (Written explanation required.)',
          value: 'the add-4 pattern climbs twice as steeply — bigger step, steeper staircase',
          acceptableForms: [],
          hints: ['A bigger step means a bigger jump each term.', 'Which line rises faster on the grid?'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always/sometimes/never: the point (0, 4) sits on the up-axis (the y-axis).',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'An x of 0 means no across-move, so it is always on the up-axis.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Confuses which coordinate pins it to the axis.' },
          ],
          hints: ['What does an x of 0 mean?', 'No across-move keeps it on the up-axis.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D22-PZ-01',
    title: 'Puzzle Grove: Hidden Picture',
    puzzleType: 'construction',
    prompt: 'Plot (1, 1), (1, 4), (4, 4), (4, 1) and connect them in order. What shape appears? Then predict: if the pattern of a fifth point continued the rule "+3 to x," where would it land?',
    answer: { value: 'a square (side 3); the next x-step lands at x = 7', acceptableForms: ['square', '7'], validation: 'short-text-keyword' },
    hintLadder: ['Plot each point as (across, up).', 'Connect them and read the shape.'],
    errorTags: ['representation-misread', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: patternTerm(), diff: 3 },
    { gen: plotChoice(), diff: 3 },
    { gen: patternTerm(), diff: 3 },
    { gen: plotChoice(), diff: 3 },
    { gen: patternTerm(), diff: 4 },
    { gen: plotChoice(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. Odd slots: predict the nth term of an arithmetic pattern. Even slots: name the ordered pair for a described point (x-before-y affordance preserved). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'representation-misread', subtype: 'xy-swap', description: 'Swaps the coordinates (plots up before across).', exampleWrongAnswer: '(2, 5) read as 5 right, 2 up', distractorRationale: 'Offer the swapped ordered pair.', reteachPointer: 'explanation/script[0] (x before y)' },
    { errorTag: 'procedure-slip', subtype: 'off-by-one-term', description: 'Adds the step one too many or too few times when finding a term.', exampleWrongAnswer: '5th term of start 3 add 4 → 23', distractorRationale: 'Offer the off-by-one term.', reteachPointer: 'guidedExamples/D22-GE-01 (start + step × (n − 1))' },
    { errorTag: 'concept-misconception', subtype: 'start-counts-as-step', description: 'Treats the start as the result of a step, shifting every term.', exampleWrongAnswer: 'calls the start the "0th" term', distractorRationale: 'Offer a shifted term.', reteachPointer: 'explanation/script[1] (the 1st term is the start)' },
    { errorTag: 'task-comprehension', subtype: 'axis-misread', description: 'Ignores one of the two moves, landing on the wrong axis or spot.', exampleWrongAnswer: '(2, 5) plotted on the bottom axis', distractorRationale: 'Offer an on-axis mislanding.', reteachPointer: 'Day-5 classify (an x of 0 stays on the up-axis)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Plotting points in the first quadrant as (across, up) from the origin — x before y — and using a pattern\'s rule (start + step per term) to predict any term without listing them all.',
    improvingCandidates: ['plotting points as x-before-y', 'finding a pattern\'s rule', 'predicting a distant term with the rule'],
    strengtheningByTag: [
      { errorTag: 'representation-misread', text: 'plotting across BEFORE up — the coordinate warm-ups reinforce x-before-y' },
      { errorTag: 'procedure-slip', text: 'counting the right number of steps to a term' },
      { errorTag: 'concept-misconception', text: 'treating the start as the 1st term, not a step result' },
    ],
    homeFocus: {
      praiseLine: 'You predicted the 10th term of a pattern with a rule instead of listing all ten — using structure to skip ahead is real algebraic thinking.',
      questionForChild: 'For the point (2, 5), which way do you move first — and how far?',
      schoolSyncHook: 'If your child\'s class plots on a particular grid or uses input/output tables, tell us and we will match that format.',
    },
    vocabularyForParent: ['ordered pair ((across, up))', 'origin ((0, 0))', 'term (one number in a pattern)'],
  },
});
