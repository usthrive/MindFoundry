/**
 * Level D · Week 24 — "Volume + Ready for Level E" (conceptId: volume-ready-level-e).
 * LEVEL-EXIT GATE. Volume by unit cubes → V = l×w×h; capstone mixed review. Day-5:
 * box-packing design + vocabulary review. Retrieval: D23 angles, D20 × ÷ decimals, D14 ± decimals, C12 × facts.
 */

import { asWarmup, angleArith, classify, decAddSub, fracAddSubLike, multiply, reasoning, rectArea, storyMultiply, volumeBox } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D14 = { level: 'D' as const, week: 14 };
const D20 = { level: 'D' as const, week: 20 };
const D23 = { level: 'D' as const, week: 23 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAngle = asWarmup(angleArith('triangle'), D23);
const wDecAdd = asWarmup(decAddSub(1), D14);
const wDecMul = asWarmup(multiply(11, 49, 3, 9), D20);

export const buildD24 = makeWeekBuilder({
  week: 24,
  conceptId: 'volume-ready-level-e',
  conceptName: 'Volume + Ready for Level E',
  strandTags: ['algebra-geometry', 'multiplication-division'],
  prerequisiteWeeks: [D20, D23],
  explanation: {
    hook: 'How many sugar cubes fill a box? Stack one layer, count it, then count the layers — that is volume, and it is why V = length × width × height. This week also gathers the whole level together, ready for what comes next.',
    whyBeforeHow:
      'Volume counts the unit cubes that fill a solid. One layer holds length × width cubes (that is the base area), and there are height layers, so V = length × width × height. It is area extended into the third dimension. As the level-exit week, it also revisits the big skills — multi-digit arithmetic, fractions, decimals — so they stand together, fluent and connected, before Level E.',
    script: [
      { say: 'One layer of a 4-by-3 base holds 12 cubes. Stack 5 such layers: 12 × 5 = 60 cubes.', visual: 'A base layer of 12 cubes stacks into five layers.' },
      { say: 'So V = length × width × height — the base area times the number of layers.', visual: 'The formula appears over the filled box.' },
      { say: 'Capstone: the same careful place-value, fraction, and decimal habits from all year carry straight into Level E.', visual: 'Earlier icons gather beside the box.' },
    ],
    summary: 'Volume = length × width × height — one layer\'s cubes times the number of layers. This exit week also consolidates the level\'s arithmetic, fractions, and decimals.',
    vocabulary: [
      { term: 'volume', kidGloss: 'how many unit cubes fill a solid' },
      { term: 'cubic units', kidGloss: 'the units volume is measured in' },
      { term: 'layer', kidGloss: 'one base-area sheet of cubes' },
    ],
  },
  guidedExamples: [
    ge(24, 1, 'modeled', 'A box is 4 by 3 by 5 units. Find its volume.', [
      { teacherSay: 'Base layer 4 × 3 = 12 cubes; 5 layers: 12 × 5 = 60 cubic units.', expected: '60' },
    ], '60 cubic units'),
    ge(24, 2, 'prompted', 'A box is 6 by 2 by 4 units.', [
      { teacherSay: 'What is the base layer?', expected: '6 × 2 = 12' },
      { childDo: 'Multiply by the number of layers.', expected: '48' },
    ], '48 cubic units'),
    ge(24, 3, 'independent', 'A box is 5 by 5 by 3 units. Find its volume. Solve cold.', [
      { childDo: 'Base area times height.', expected: '75' },
    ], '75 cubic units'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: volumeBox(), diff: 2 },
      { gen: rectArea(), diff: 3 },
      { gen: volumeBox(), diff: 3 },
      { gen: volumeBox(), diff: 3 },
      { gen: rectArea(), diff: 4 },
    ],
    [
      { gen: wAngle, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: volumeBox(), diff: 3 },
      { gen: rectArea(), diff: 3 },
      { gen: multiply(11, 49, 3, 9), diff: 4 },
      { gen: volumeBox(), diff: 4 },
    ],
    [
      { gen: wDecAdd, diff: 2 },
      { gen: wDecMul, diff: 2 },
      { gen: volumeBox(), diff: 3 },
      { gen: rectArea(), diff: 3 },
      { gen: fracAddSubLike(1), diff: 4 },
      { gen: volumeBox(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: volumeBox(), diff: 4 },
      { gen: storyMultiply(), diff: 4 },
      { gen: volumeBox(), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'Two boxes hold the same volume: one is 2 by 3 by 4, the other is 1 by 4 by 6. Confirm both volumes and name which uses a taller stack. (Show your work.)',
          value: 'both are 24 cubic units; the 1 × 4 × 6 box is the taller stack',
          acceptableForms: ['24'],
          keywords: true,
          hints: ['Multiply length × width × height for each.', 'Compare the heights.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Doubling only the HEIGHT of a box does what to its volume?',
          correct: 'doubles the volume',
          distractors: [
            { text: 'quadruples the volume', errorTag: 'concept-misconception', rationale: 'Only one dimension changed, so the volume scales by 2, not 4.' },
            { text: 'adds 2 to the volume', errorTag: 'representation-misread', rationale: 'Confuses doubling a factor with adding to the product.' },
          ],
          hints: ['Volume is a product of three lengths.', 'Doubling one factor doubles the product.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Design a box (whole-number edges) with a volume of exactly 36 cubic units. Give the three edge lengths and show they multiply to 36. (Written work required.)',
          value: 'e.g. 3 × 3 × 4 = 36, or 2 × 3 × 6 = 36',
          acceptableForms: ['36'],
          keywords: true,
          hints: ['Find three whole numbers whose product is 36.', 'Check by multiplying all three.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Capstone review: explain in one line each why (a) 0.8 > 0.35 and (b) 2/3 + 1/6 = 5/6. Use the words "place" and "pieces".',
          value: '0.8 has more tenths (bigger place); 2/3 renames to 4/6, so 4 + 1 same-size pieces = 5/6',
          acceptableForms: ['place', 'pieces', '5/6'],
          keywords: true,
          hints: ['Compare decimals by place; combine fractions by same-size pieces.', 'Rename 2/3 into sixths.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D24-PZ-01',
    title: 'Puzzle Grove: Box Designer',
    puzzleType: 'construction',
    prompt: 'You must build a box holding exactly 24 unit cubes with whole-number edges. Find two DIFFERENT boxes that work, then say which uses fewer cubes on its outside (surface). Explain your reasoning.',
    answer: { value: 'e.g. 2×3×4 and 1×4×6 both hold 24; the more cube-like 2×3×4 has less surface', acceptableForms: ['2×3×4', '1×4×6', '24'], validation: 'short-text-keyword' },
    hintLadder: ['Find edge triples whose product is 24.', 'Boxes closer to a cube have less outside surface.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: volumeBox(), diff: 3 },
    { gen: rectArea(), diff: 3 },
    { gen: volumeBox(), diff: 3 },
    { gen: volumeBox(), diff: 3 },
    { gen: rectArea(), diff: 4 },
    { gen: volumeBox(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01/03/04/06: volume of a box (V = l×w×h). 02/05: rectangle area (base-layer affordance preserved). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'area-vs-volume', description: 'Uses two dimensions (area) where three (volume) are needed, or vice versa.', exampleWrongAnswer: 'volume of a 4×3×5 box → 12', distractorRationale: 'Offer the base-area instead of the volume.', reteachPointer: 'explanation/script[0] (layers times the base)' },
    { errorTag: 'procedure-slip', subtype: 'three-factor-slip', description: 'Multiplies two of the three edges but forgets the third.', exampleWrongAnswer: '4 × 3 × 5 → 20 (only two edges)', distractorRationale: 'Offer a two-edge product.', reteachPointer: 'guidedExamples/D24-GE-01 (base area × height)' },
    { errorTag: 'representation-misread', subtype: 'scale-confusion', description: 'Confuses doubling a dimension with doubling or adding to the volume.', exampleWrongAnswer: 'doubling height quadruples the volume', distractorRationale: 'Offer the over-scaled volume.', reteachPointer: 'Day-5 classify (one factor doubles the product)' },
    { errorTag: 'fact-recall', subtype: 'product-slip', description: 'Slips on one of the multiplications in the three-factor product.', exampleWrongAnswer: '12 × 5 → 55', distractorRationale: 'Offer a near-miss product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Volume — filling a solid with unit cubes as V = length × width × height (one layer\'s cubes times the number of layers) — plus a capstone review of the level\'s arithmetic, fractions, and decimals, ready for Level E.',
    improvingCandidates: ['finding volume as base area × height', 'designing boxes with a target volume', 'connecting volume to earlier multiplication'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'telling area (two dimensions) from volume (three) — the box warm-ups reinforce the layers idea' },
      { errorTag: 'procedure-slip', text: 'multiplying all THREE edge lengths' },
      { errorTag: 'fact-recall', text: 'quick multiplication inside the volume product — the sprints keep facts fast' },
    ],
    homeFocus: {
      praiseLine: 'You found two different boxes that each hold exactly 24 cubes — designing to a target volume shows you truly understand length × width × height.',
      questionForChild: 'A box is 4 by 3 by 5 units — how many cubes fit, and how does one layer help you count?',
      schoolSyncHook: 'As your child finishes this level, tell us what Level-E topics their class is heading toward and we will preview them in the warm-ups.',
    },
    vocabularyForParent: ['volume (cubes that fill a solid)', 'cubic units (volume units)', 'layer (one base-area sheet of cubes)'],
  },
});
