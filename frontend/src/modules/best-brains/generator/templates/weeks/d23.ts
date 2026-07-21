/**
 * Level D · Week 23 — "Angles & shape hierarchies" (conceptId: angles-shape-hierarchies).
 * Measure/compute angles; classify triangles; quadrilateral hierarchy. Day-5:
 * "a square is a rectangle" — Always/Sometimes/Never. Retrieval: D22 patterns, D2 ±, C12 × facts.
 */

import { addWhole, angleArith, asWarmup, classify, classifyTriangleChoice, multiply, patternTerm, reasoning } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D22 = { level: 'D' as const, week: 22 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wPattern = asWarmup(patternTerm(), D22);

export const buildD23 = makeWeekBuilder({
  week: 23,
  conceptId: 'angles-shape-hierarchies',
  conceptName: 'Angles & shape hierarchies',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D2, D22],
  explanation: {
    hook: 'A square is a rectangle — really! Shapes belong to families, and a "special" member still counts as part of the bigger family. Angles work by tidy rules too: a straight line is 180°, a corner is 90°, and a triangle\'s three angles always total 180°.',
    whyBeforeHow:
      'Angles measure turning, in degrees. Two facts do most of the work: angles on a straight line sum to 180° (supplementary), and a right angle is 90° (its partner is complementary). A triangle\'s angles always sum to 180°, so the third is found by subtraction — and the largest angle names the triangle (acute, right, or obtuse). Shapes form hierarchies by their properties: every square has four right angles and equal sides, so it satisfies the rectangle definition — a square is a special rectangle, not a separate thing.',
    script: [
      { say: 'On a straight line, two angles add to 180°. If one is 65°, the other is 115°.', visual: 'A straight angle splits into 65° and 115°.' },
      { say: 'A triangle\'s three angles total 180°. Given two, subtract to find the third.', visual: 'Three triangle angles sum to a straight line.' },
      { say: 'Classify by the biggest angle: under 90° acute, exactly 90° right, over 90° obtuse.', visual: 'Three triangles sort by their largest angle.' },
    ],
    summary: 'Angles on a line sum to 180°; a right angle is 90°; a triangle\'s angles total 180° (the largest names it). Shapes nest by properties — a square is a special rectangle.',
    vocabulary: [
      { term: 'supplementary', kidGloss: 'two angles that add to 180°' },
      { term: 'complementary', kidGloss: 'two angles that add to 90°' },
      { term: 'hierarchy', kidGloss: 'shape families where special members belong to bigger ones' },
    ],
  },
  guidedExamples: [
    ge(23, 1, 'modeled', 'Two supplementary angles: one is 70°. Find the other.', [
      { teacherSay: 'They add to 180°, so 180 − 70 = 110°.', expected: '110' },
    ], '110°'),
    ge(23, 2, 'prompted', 'A triangle has angles 50° and 60°. Find the third.', [
      { teacherSay: 'The three total 180°.' },
      { childDo: 'Subtract the two known angles.', expected: '70' },
    ], '70°'),
    ge(23, 3, 'independent', 'A triangle has angles 100°, 40°, and 40°. Classify it. Solve cold.', [
      { childDo: 'Look at the largest angle.', expected: 'obtuse' },
    ], 'obtuse'),
  ],
  days: [
    [
      { gen: wAdd, diff: 2 },
      { gen: angleArith('supplementary'), diff: 2 },
      { gen: angleArith('triangle'), diff: 3 },
      { gen: classifyTriangleChoice(), diff: 3 },
      { gen: angleArith('complementary'), diff: 3 },
      { gen: angleArith('triangle'), diff: 4 },
    ],
    [
      { gen: wPattern, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: angleArith('triangle'), diff: 3 },
      { gen: classifyTriangleChoice(), diff: 3 },
      { gen: angleArith('supplementary'), diff: 4 },
      { gen: angleArith('triangle'), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: classifyTriangleChoice(), diff: 3 },
      { gen: angleArith('complementary'), diff: 3 },
      { gen: angleArith('triangle'), diff: 4 },
      { gen: classifyTriangleChoice(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: angleArith('triangle'), diff: 4 },
      { gen: angleArith('supplementary'), diff: 4 },
      { gen: classifyTriangleChoice(), diff: 5 },
    ],
    [
      {
        gen: classify({
          prompt: 'Always/sometimes/never: a square is a rectangle.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Every square has four right angles and meets the rectangle definition — always.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Treats "special" as "excluded" from the family.' },
          ],
          hints: ['What is the definition of a rectangle?', 'Does every square meet it?'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'A triangle has two angles of 45°. What is the third, and what kind of triangle is it? Explain. (Written explanation required.)',
          value: 'the third is 90°, so it is a right triangle',
          acceptableForms: ['90', 'right'],
          keywords: true,
          hints: ['The three angles total 180°.', 'What does a 90° angle make it?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why a triangle cannot have two right angles. Use the 180° fact. (Written explanation required.)',
          value: 'two 90° angles already total 180°, leaving 0° for the third — impossible',
          acceptableForms: [],
          hints: ['Add two right angles.', 'How much is left for the third?'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always/sometimes/never: a rectangle is a square.',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Reverses the hierarchy — only rectangles with equal sides are squares.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'A rectangle with equal sides IS a square.' },
          ],
          hints: ['Is every rectangle\'s sides equal?', 'Only some rectangles are squares.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D23-PZ-01',
    title: 'Puzzle Grove: Family Tree',
    puzzleType: 'logic',
    prompt: 'Place these in a shape family tree from most general to most special: quadrilateral, rectangle, square, parallelogram. Then say one property each level ADDS.',
    answer: { value: 'quadrilateral → parallelogram → rectangle → square; each adds a property (parallel sides, right angles, equal sides)', acceptableForms: ['square', 'rectangle', 'parallelogram'], validation: 'short-text-keyword' },
    hintLadder: ['Start with the loosest definition (four sides).', 'Each step adds a requirement.'],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: angleArith('supplementary'), diff: 3 },
    { gen: angleArith('triangle'), diff: 3 },
    { gen: classifyTriangleChoice(), diff: 3 },
    { gen: angleArith('complementary'), diff: 3 },
    { gen: angleArith('triangle'), diff: 4 },
    { gen: classifyTriangleChoice(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01: supplementary partner. 02/05: triangle third angle. 03/06: classify a triangle by its angles (largest-angle affordance). 04: complementary partner. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'hierarchy-reversed', description: 'Reverses a shape hierarchy (thinks every rectangle is a square) or excludes special members.', exampleWrongAnswer: 'a square is NOT a rectangle', distractorRationale: 'Offer the reversed hierarchy claim.', reteachPointer: 'explanation/whyBeforeHow (a square is a special rectangle)' },
    { errorTag: 'procedure-slip', subtype: 'angle-subtraction', description: 'Subtracts wrong when finding a missing angle.', exampleWrongAnswer: '180 − 70 → 100', distractorRationale: 'Offer a near-miss angle.', reteachPointer: 'guidedExamples/D23-GE-01 (subtract from the total)' },
    { errorTag: 'fact-recall', subtype: 'wrong-total', description: 'Uses the wrong angle total (90 instead of 180, or vice versa).', exampleWrongAnswer: 'triangle angles totaling 90', distractorRationale: 'Offer an answer using the wrong total.', reteachPointer: 'explanation/script[1] (triangles total 180°)' },
    { errorTag: 'representation-misread', subtype: 'classify-by-small-angle', description: 'Classifies a triangle by a small angle instead of the largest.', exampleWrongAnswer: 'a 100°-40°-40° triangle called acute', distractorRationale: 'Offer a small-angle classification.', reteachPointer: 'explanation/script[2] (the largest angle names it)' },
    { errorTag: 'task-comprehension', subtype: 'family-excludes-special', description: 'Reads a shape hierarchy as excluding special members ("a square is not a rectangle").', exampleWrongAnswer: 'says a square is never a rectangle', distractorRationale: 'Offer "never" on a square-is-a-rectangle claim.', reteachPointer: 'Day-5 classify (special members still belong to the family)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Angle facts and shape families — angles on a line total 180°, a right angle is 90°, and a triangle\'s angles total 180° (the largest angle names the triangle). Shapes nest by their properties, so a square is a special rectangle.',
    improvingCandidates: ['finding a missing angle by subtraction', 'classifying a triangle by its largest angle', 'placing shapes in their family hierarchy'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'shape hierarchies — a square IS a rectangle, and the warm-ups reinforce the family idea' },
      { errorTag: 'fact-recall', text: 'the 180° angle facts for lines and triangles' },
      { errorTag: 'representation-misread', text: 'classifying a triangle by its LARGEST angle' },
    ],
    homeFocus: {
      praiseLine: 'You explained why a triangle cannot have two right angles — reasoning from the 180° fact instead of memorizing is exactly the goal.',
      questionForChild: 'A triangle has angles of 50° and 60° — what is the third, and how do you know?',
      schoolSyncHook: 'If your child\'s class uses a protractor or shape-sorting activities, tell us and we will match that support.',
    },
    vocabularyForParent: ['supplementary (add to 180°)', 'complementary (add to 90°)', 'hierarchy (special shapes belong to bigger families)'],
  },
});
