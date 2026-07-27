/**
 * Level D · Week 23 — "Angles & shape hierarchies" (conceptId: angles-shape-hierarchies).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten to the proven D4
 * shape: module-scope generators with FIXED, role-based, name-free hint ladders
 * (rung-1 always an algorithm-free orienting question), each core generator
 * reused ≤ 2×, situationType-tagged word problems, generated multi-step, a
 * generated discrimination trap, and a code-recomputed error-analysis item.
 *
 * conceptualAnchor = "angle sum": the fixed total the angles of a figure add to
 * (180° on a straight line and in a triangle; 360° in a quadrilateral). A missing
 * angle is the total minus what is used; the LARGEST angle names a triangle; and
 * shapes nest by their properties (a square is a special rectangle).
 *
 * Every computational answer is code-computed: single-step angle situations route
 * through the registered `d_angle_v1` template (supplementary 180−a /
 * complementary 90−a / triangle 180−a−b); multi-step items fold the shipped
 * rational op-chain; the error-analysis "wrong" value is the genuine output of a
 * named misconception recomputed by `d_verify_binop_misconception_v1`.
 *
 * angles-shape-hierarchies is a PLACE-VALUE-family concept (a within-concept
 * 2-step is intrinsically thin), so the §6.1 floor is ≥1 week-wide multi-step;
 * this week ships several (triangle/quadrilateral angle-sum chains + an isosceles
 * subtract-then-halve that composes a prior-week division). Its concept family is
 * unique in the ladder, so no deepeningDelta is owed.
 */

import { addWhole, asWarmup, classify, multiply, patternTerm, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D22 = { level: 'D' as const, week: 22 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const TRIANGLE_KINDS = ['acute', 'right', 'obtuse'] as const;
type TriKind = (typeof TRIANGLE_KINDS)[number];

// --- Retrieval warm-ups (strictly-prior skills; exempt from the pedagogy gates) --
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wPattern = asWarmup(patternTerm(), D22);
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);

// --- Single-step angle situations (fixed, role-based, name-free hints) ----------
// A — supplementary partner (situationType: measurement).
const sitSupplementary = situation({
  situationType: 'measurement', cognitiveOp: 'angle',
  draw: (r) => {
    const a = r.int(25, 155);
    const surface = r.pick(['a ramp meeting the flat floor', 'a road sloping up to level ground', 'a gate leaning against its straight post', 'a lid tilting off a straight shelf']);
    return {
      prompt: `Where ${surface}, the angle on one side of the straight line is ${a}°. The angle on the other side is its supplement. How many degrees is it?`,
      answerValue: String(180 - a), templateId: 'd_angle_v1', params: { rel: 'supplementary', a }, units: 'degrees',
      acceptableForms: [`${180 - a}°`, `${180 - a} degrees`],
      hints: ['Do these two angles open out into a straight line, or into a square corner?', 'A straight line is one straight angle — take the given angle away from it to find the partner.'],
      errorTags: ['fact-recall', 'procedure-slip'],
    };
  },
});

// B — complementary partner (situationType: combine).
const sitComplementary = situation({
  situationType: 'combine', cognitiveOp: 'angle',
  draw: (r) => {
    const a = r.int(15, 75); const name = r.pick(NAMES);
    return {
      prompt: `${name} folds a square corner into two angles that fit together to fill it. One of them is ${a}°. What is the other angle?`,
      answerValue: String(90 - a), templateId: 'd_angle_v1', params: { rel: 'complementary', a }, units: 'degrees',
      acceptableForms: [`${90 - a}°`, `${90 - a} degrees`],
      hints: ['Do the two angles snap together into a square corner, or stretch into a straight line?', 'A square corner is one right angle — take the known angle away from it.'],
      errorTags: ['fact-recall', 'procedure-slip'],
    };
  },
});

// C — third angle of a triangle (situationType: part-whole).
const sitTriangleThird = situation({
  situationType: 'part-whole', cognitiveOp: 'angle',
  draw: (r) => {
    const a = r.int(30, 90); const b = r.int(30, 140 - a); const name = r.pick(NAMES);
    return {
      prompt: `${name}'s triangular garden bed has two corner angles measuring ${a}° and ${b}°. What is the third corner angle?`,
      answerValue: String(180 - a - b), templateId: 'd_angle_v1', params: { rel: 'triangle', a, b }, units: 'degrees',
      acceptableForms: [`${180 - a - b}°`, `${180 - a - b} degrees`],
      hints: ['Do a triangle\'s three corners together fill a straight angle, or a square corner?', 'Add the two known corners, then take that sum from the triangle\'s total.'],
      errorTags: ['fact-recall', 'procedure-slip'],
    };
  },
});

// Metacognition base: supplementary served ONLY through the estimate-first wrapper.
const sitSuppEstimate = withEstimateFirst(
  sitSupplementary,
  'the partner angle should be whatever is left of a straight line after the given one, so a large given angle leaves a small partner and a small one leaves a large partner.',
);

// --- Multi-step angle-sum problems (answer + step-count from the shipped chain) --
// D — isosceles: subtract the top, THEN split the rest between two equal base
// angles (composes a prior-week division). initN is the stated total (180).
const msIsosceles = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const top = 2 * r.int(15, 40); // even top so the halved base angle is whole
    return {
      prompt: `An isosceles triangle's three angles total 180°. Its top angle is ${top}° and its two base angles are equal to each other. What is the measure of EACH base angle?`,
      initN: 180, steps: [{ op: 'sub', n: top, d: 1 }, { op: 'div', n: 2, d: 1 }], units: 'degrees',
      hints: ['After the top angle is set aside, is the rest one angle or shared by two equal ones?', 'Take the top angle from the total first, then split what remains between the two equal base angles.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// E — fourth angle of a quadrilateral: three subtractions from the 360° total.
const msQuadFourth = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(60, 110); const b = r.int(60, 110); const c = r.int(60, 110);
    const name = r.pick(NAMES);
    return {
      prompt: `The four angles of ${name}'s quadrilateral tile add up to 360°. Three of them are ${a}°, ${b}°, and ${c}°. What is the fourth angle?`,
      initN: 360, steps: [{ op: 'sub', n: a, d: 1 }, { op: 'sub', n: b, d: 1 }, { op: 'sub', n: c, d: 1 }], units: 'degrees',
      hints: ['Is the missing angle one of the four corners, or the whole way around the shape?', 'Add the three known angles, then take that from the four-angle total.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// F — three angles along a straight line: two subtractions from the 180° total.
const msStraightThree = multiStep({
  situationType: 'measurement', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(40, 90); const b = r.int(40, 130 - a);
    return {
      prompt: `Three angles lie in a row along a straight edge, which measures 180°. Two of them are ${a}° and ${b}°. What is the third angle?`,
      initN: 180, steps: [{ op: 'sub', n: a, d: 1 }, { op: 'sub', n: b, d: 1 }], units: 'degrees',
      hints: ['Which piece is unknown — one angle on the line, or the whole straight line?', 'Peel off the two known angles from the straight line, one at a time.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// --- Discrimination traps (fixed name-free hints; correct code-selected) --------
// Classify a triangle by its LARGEST angle (not a smaller one).
const discrimClassify = discrimination({
  variant: 'structural', cognitiveOp: 'classify-triangle',
  draw: (r) => {
    const kind = r.pick(TRIANGLE_KINDS);
    let a: number; let b: number;
    if (kind === 'right') { a = 90; b = r.int(25, 60); }
    else if (kind === 'obtuse') { a = r.int(95, 130); b = r.int(20, 160 - a); }
    else { a = r.int(60, 80); b = r.int(60, 80); }
    const c = 180 - a - b;
    const angles = r.shuffle([a, b, c]);
    const rationaleFor: Record<TriKind, string> = {
      acute: 'Judged by the two smaller angles and ignored the one angle that is a square corner or larger.',
      right: 'A triangle is right ONLY when its largest angle is exactly a square corner (90°).',
      obtuse: 'An obtuse call needs the LARGEST angle to be more than a square corner; here it is not.',
    };
    const others = TRIANGLE_KINDS.filter((k) => k !== kind);
    return {
      prompt: `A triangle has angles ${angles[0]}°, ${angles[1]}°, and ${angles[2]}°. Is it acute, right, or obtuse?`,
      correct: kind,
      distractors: [
        { text: others[0], errorTag: 'representation-misread', rationale: rationaleFor[others[0]] },
        { text: others[1], errorTag: 'concept-misconception', rationale: rationaleFor[others[1]] },
      ],
      hints: ['Which single angle decides a triangle\'s name — the smallest, or the largest?', 'Compare the biggest angle to a square corner: under it, exactly it, or over it.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// Which direction of a shape hierarchy is ALWAYS true (special ⊂ general).
const SHAPE_PAIRS: Array<[string, string]> = [
  ['square', 'rectangle'], ['square', 'rhombus'], ['rectangle', 'parallelogram'], ['rhombus', 'parallelogram'], ['square', 'parallelogram'],
];
const discrimShape = discrimination({
  variant: 'structural', cognitiveOp: 'shape-hierarchy',
  draw: (r) => {
    const [special, general] = r.pick(SHAPE_PAIRS);
    return {
      prompt: `Which statement is ALWAYS true: every ${special} is a ${general}, or every ${general} is a ${special}?`,
      correct: `every ${special} is a ${general}`,
      distractors: [
        { text: `every ${general} is a ${special}`, errorTag: 'concept-misconception', rationale: `Reverses the family — a ${general} need not carry the extra properties that make a ${special}.` },
        { text: 'neither is always true', errorTag: 'task-comprehension', rationale: `A ${special} always has every property a ${general} needs, so one direction is always true.` },
      ],
      hints: ['Which shape carries MORE required properties — the special one, or the general one?', 'The one with more properties always fits inside the family with fewer.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 recomputes both truth and "wrong") --
// A student ADDED the angle onto a straight line instead of subtracting from it.
const eaAddInsteadOfSubtract = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'angle',
  drawParams: (r) => ({ a: 180, b: r.int(20, 80), op: '-', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A student needed the angle that pairs with a ${p.b}° angle to make a straight line, and wrote that the partner angle is ${v.wrong}°.`,
    extension: 'Explain, using a straight line, why an angle that large cannot be right, then give the correct partner angle.',
    hints: ['Does the partner angle add onto the given one, or fill what is left of a straight line?', 'Two angles that form a straight line share one straight angle — take the given angle away from it.'],
    errorTags: ['fact-recall', 'concept-misconception'],
  }),
});

export const buildD23 = makeWeekBuilder({
  week: 23,
  conceptId: 'angles-shape-hierarchies',
  conceptName: 'Angles & shape hierarchies',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D2, D22],
  pedagogyContract: 'v2',
  conceptualAnchor: 'angle sum',
  explanation: {
    hook: 'A square is a rectangle — really! Shapes belong to families, and a "special" member still counts as part of the bigger family. Angles obey tidy rules too: a straight line is 180°, a square corner is 90°, and a triangle\'s three angles always total 180°.',
    whyBeforeHow:
      'An angle measures an amount of turning, and the angle sum of a straight line is always 180° because the two angles open out to one flat, straight edge — so a missing angle is found by subtracting from that fixed total, never by guessing. The same idea drives triangles: their angle sum is 180°, so the third angle is whatever the first two leave, and the LARGEST of the three names the triangle (acute, right, or obtuse). Shapes nest the same way by their properties: since every square has four right angles and four equal sides, it satisfies the rectangle definition, so a square is a special rectangle — a member of the family, not an outsider.',
    script: [
      { say: 'Two angles that sit on one straight line always open out to a straight angle, so if one is 65° the other must be 115° — the straight line is shared between them.', visual: 'A straight angle splits into 65° and 115°.' },
      { say: 'A triangle\'s three angles fill a straight angle too. Given two of them, I subtract from the total to find the third.', visual: 'Three triangle angles fold onto a straight line.' },
      { say: 'To name a triangle, I look only at its LARGEST angle: under a square corner is acute, exactly a square corner is right, over a square corner is obtuse.', visual: 'Three triangles sort by their biggest angle.' },
      { say: 'Before I finish, I estimate: the missing angle should be whatever is left of the straight line or triangle, so I check that a large given angle leaves a small partner — if they do not add up sensibly, I look again.', visual: 'A benchmark: a big angle beside a small leftover, filling one straight line.' },
    ],
    summary: 'Angles on a straight line and inside a triangle share a fixed angle sum, so a missing angle is found by subtracting — and the largest angle names a triangle. Shapes nest by their properties, so a square is a special rectangle.',
    vocabulary: [
      { term: 'angle sum', kidGloss: 'the fixed total the angles add up to (180° on a line and in a triangle, 360° in a quadrilateral)' },
      { term: 'supplementary', kidGloss: 'two angles that together make a straight line (180°)' },
      { term: 'complementary', kidGloss: 'two angles that together make a square corner (90°)' },
      { term: 'shape hierarchy', kidGloss: 'shape families where a special member still belongs to the bigger family' },
    ],
  },
  guidedExamples: [
    ge(23, 1, 'modeled', 'Two angles sit on one straight line. One is 65°. Find the other.', [
      { teacherSay: 'I notice these two angles rest on a single straight line, so together they must open out to a straight angle — that tells me I subtract, not add. Let me take the 65 away from a straight line.', expected: '115' },
      { teacherSay: 'Watch: a straight line is 180°, and taking 65 away leaves 115°. I check it — 115 and 65 together do make one straight line, so it fits.', expected: '115' },
    ], '115°'),
    ge(23, 2, 'completion', 'A triangle has angles 50° and 60°. Find the third.', [
      { teacherSay: 'A triangle\'s three angles always fill a straight angle. Which operation finds the missing one?', expected: 'subtract' },
      { childDo: 'Take the two known angles away from the triangle\'s total.', expected: '70' },
    ], '70°'),
    ge(23, 3, 'prompted', 'Two angles fit together into a square corner. One is 35°. Find the other.', [
      { childDo: 'A square corner is 90° — take the known angle away.', expected: '55' },
    ], '55°'),
    ge(23, 4, 'independent', 'An isosceles triangle\'s angles total 180°. Its top angle is 40° and the two base angles are equal. Find EACH base angle. Solve cold.', [
      { childDo: 'Remove the top angle, then split the rest between the two equal base angles.', expected: '70' },
    ], '70°'),
  ],
  days: [
    // Day 1 — concept echo: single-step angle work only, blocked (no interleaving)
    [
      { gen: wAdd, diff: 2 },
      { gen: wPattern, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: sitSupplementary, diff: 2 },
      { gen: sitComplementary, diff: 2 },
      { gen: sitTriangleThird, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination + multi-step enter
    [
      { gen: wMul, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: sitSuppEstimate, diff: 3 },
      { gen: msIsosceles, diff: 3 },
      { gen: msStraightThree, diff: 3 },
      { gen: discrimClassify, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wPattern, diff: 2 },
      { gen: sitComplementary, diff: 3 },
      { gen: msQuadFourth, diff: 4 },
      { gen: msStraightThree, diff: 3 },
      { gen: discrimClassify, diff: 4 },
      { gen: discrimShape, diff: 3 },
    ],
    // Day 4 — word problems (two multi-step angle-sum chains + a single-step + hierarchy)
    [
      { gen: sitTriangleThird, diff: 4 },
      { gen: msIsosceles, diff: 4 },
      { gen: msQuadFourth, diff: 5 },
      { gen: discrimShape, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + two classification defenses
    [
      { gen: eaAddInsteadOfSubtract, diff: 4 },
      {
        gen: reasoning({
          prompt: 'A triangle has two angles of 45°. Find the third angle, then name the triangle (acute, right, or obtuse) and explain in writing how the third angle decides.',
          value: 'the third angle is 90°, so the largest angle is a right angle and the triangle is right',
          acceptableForms: ['90', 'right'],
          keywords: true,
          hints: ['What must a triangle\'s three angles always add up to?', 'Once you know all three, which one gives the triangle its name?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: a square is a rectangle. Give one reason.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Every square has four right angles and four equal sides, so it meets the rectangle definition every time — not just sometimes.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reads a special shape as excluded from the family it actually belongs to.' },
          ],
          hints: ['What does the definition of a rectangle require?', 'Does every square meet each of those requirements?'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: a rectangle is a square. Give one reason.',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Only rectangles whose four sides are all equal are squares; most rectangles are not.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'A rectangle with four equal sides IS a square, so it can happen.' },
          ],
          hints: ['Are the four sides of every rectangle equal in length?', 'When would a rectangle also count as a square?'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D23-PZ-01',
    title: 'Puzzle Grove: The Angle Staircase',
    puzzleType: 'logic',
    prompt: 'A triangle\'s three angles climb in equal steps: the middle angle is 20° more than the smallest, and the largest is 20° more than the middle. All three together make 180°. Find the three angles.',
    answer: { value: '40, 60, 80', acceptableForms: ['40', '60', '80', '40, 60, 80'], validation: 'short-text-keyword' },
    hintLadder: ['If the smallest is one unknown amount, how would you describe the other two in terms of it?', 'Three equal-step angles share the total evenly, so the middle one is the total split three ways.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sitSupplementary, diff: 3 },
    { gen: msIsosceles, diff: 3 },
    { gen: sitTriangleThird, diff: 3 },
    { gen: msQuadFourth, diff: 3 },
    { gen: sitComplementary, diff: 4 },
    { gen: msStraightThree, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step angle partner (supplementary / triangle-third / complementary). 02/04/06: multi-step angle-sum chain (isosceles subtract-then-halve / quadrilateral fourth / three-on-a-line). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'fact-recall', subtype: 'wrong-total', description: 'Uses the wrong angle total (90 instead of 180, or 180 instead of 360), so the subtraction starts from the wrong number.', exampleWrongAnswer: 'finding a triangle\'s third angle by subtracting from 90', distractorRationale: 'Offer an answer built on the wrong total.', reteachPointer: 'explanation/script[1] (a triangle\'s angles fill a straight angle, 180°)' },
    { errorTag: 'procedure-slip', subtype: 'angle-subtraction', description: 'Chooses the right total but slips when subtracting the known angle(s) from it.', exampleWrongAnswer: '180 − 70 answered as 100', distractorRationale: 'Offer a near-miss angle one step off.', reteachPointer: 'guidedExamples/D23-GE-01 (subtract the given angle from the straight line)' },
    { errorTag: 'concept-misconception', subtype: 'add-not-subtract', description: 'Adds an angle onto the straight-line or triangle total instead of subtracting from it, giving an impossible angle bigger than the whole.', exampleWrongAnswer: 'a straight-line partner of 240°', distractorRationale: 'Offer the add-instead-of-subtract result.', reteachPointer: 'explanation/whyBeforeHow (a missing angle is the total minus what is used, the angle sum idea)' },
    { errorTag: 'representation-misread', subtype: 'classify-by-small-angle', description: 'Classifies a triangle by a small angle instead of its largest angle.', exampleWrongAnswer: 'a 100°-40°-40° triangle called acute', distractorRationale: 'Offer a small-angle classification.', reteachPointer: 'explanation/script[2] (the LARGEST angle names the triangle)' },
    { errorTag: 'task-comprehension', subtype: 'hierarchy-reversed-or-excluded', description: 'Reverses a shape hierarchy (thinks every rectangle is a square) or excludes special members (thinks a square is not a rectangle).', exampleWrongAnswer: 'says a square is never a rectangle', distractorRationale: 'Offer the reversed or excluded hierarchy claim.', reteachPointer: 'Day-5 classification (a special member still belongs to the bigger family)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Angle facts and shape families — angles on a straight line total 180°, a square corner is 90°, a triangle\'s angles total 180° (and a quadrilateral\'s total 360°), with the LARGEST angle naming a triangle. Shapes nest by their properties, so a square is a special rectangle.',
    improvingCandidates: ['finding a missing angle by subtracting from the total', 'classifying a triangle by its largest angle', 'placing shapes in their family hierarchy'],
    strengtheningByTag: [
      { errorTag: 'fact-recall', text: 'the fixed angle-sum totals — 180° for a line and a triangle, 90° for a square corner, 360° for a quadrilateral' },
      { errorTag: 'representation-misread', text: 'classifying a triangle by its LARGEST angle, not a smaller one' },
      { errorTag: 'concept-misconception', text: 'shape hierarchies — a square IS a rectangle, and the estimate-first checks keep impossible angles from slipping by' },
    ],
    homeFocus: {
      praiseLine: 'You estimated the leftover angle first and checked that the two parts really made a straight line before writing the answer — reasoning from the angle sum instead of guessing is exactly the goal.',
      questionForChild: 'A triangle has angles of 50° and 60° — what is the third, and how do you know it is not obtuse?',
      schoolSyncHook: 'If your child\'s class uses a protractor or shape-sorting activities a certain way, tell us and we will match that support.',
    },
    vocabularyForParent: ['angle sum (the fixed total angles add to)', 'supplementary (add to 180°)', 'complementary (add to 90°)', 'shape hierarchy (special shapes belong to bigger families)'],
  },
});
