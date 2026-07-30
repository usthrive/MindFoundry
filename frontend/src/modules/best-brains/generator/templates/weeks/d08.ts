/**
 * Level D · Week 8 — "2-digit × 2-digit" (conceptId: two-digit-by-two-digit).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten to the D4-proven
 * shape: the concept is the FOUR ROOMS of the area rectangle — split both factors
 * by place, pair every part with every part, add all four partial products.
 *
 * Authoring patterns copied from d04.ts:
 *  - Genuine multi-step word problems via lib/multistep (mul→add, mul→sub,
 *    mul→add→sub); answer + step-count come from the shipped op-chain.
 *  - A code-generated error-analysis item (a room where the student ADDED the two
 *    place-parts instead of multiplying) whose shown "wrong" value and true answer
 *    are re-derived by QG-11 — the fabricated-"674" bug is now impossible.
 *  - Discrimination traps (three-room vs four-room; two-digit vs one-digit factor)
 *    forcing a STRUCTURAL choice by Day 3.
 *  - Metacognition woven into Day 2 (estimate-first) AND modeled in the script.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free; each generator reused ≤2×
 *    in the daily core; every rung-1 an algorithm-free orienting question.
 *  - Distinct proper names drawn fresh per item — never a hardcoded pool name.
 */

import { asWarmup, classify, divideRemainder, factorPair, multiply, reasoning, storyMultiply } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const D3 = { level: 'D' as const, week: 3 };
const C12 = { level: 'C' as const, week: 12 };
const D5 = { level: 'D' as const, week: 5 };
const D6 = { level: 'D' as const, week: 6 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wArea = asWarmup(multiply(11, 49, 3, 9), D5); // 2-digit × 1-digit area-model
const wDiv = asWarmup(divideRemainder(3, 9, 20, 89), D6);
const wFactor = asWarmup(factorPair(), D3);                   // D3 missing-factor form (not a second bare product)

// --- Single-step 2-digit × 2-digit situations (fixed, role-based, name-free hints) ---
const sitArea = situation({
  situationType: 'area', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(12, 40); const b = r.int(11, 30);
    const thing = r.pick(['rug', 'garden bed', 'mural', 'floor mat', 'poster', 'quilt']);
    return {
      prompt: `A ${thing} measures ${a} cm by ${b} cm. What is its area in square centimeters?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: 'square cm',
      hints: ['Does area count the tiles along one edge, or fill the whole rectangle?', 'Split each side into tens and ones, find the four rooms, then add them.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

const sitRate = situation({
  situationType: 'rate', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(12, 45); const b = r.int(11, 30);
    const [container, item] = r.pick([['crates', 'apples'], ['boxes', 'books'], ['trays', 'muffins'], ['bins', 'bottles']]);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} fills ${a} ${container} with ${b} ${item} in each. How many ${item} is that in all?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: item,
      hints: ['Is this one big pile, or many equal groups joined together?', 'Multiply the number of groups by the size of each group; break a factor by place if it helps.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const sitMeasure = situation({
  situationType: 'measurement', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(13, 40); const b = r.int(12, 30);
    return {
      prompt: `A long ribbon is cut into ${a} equal strips. Each strip is ${b} cm long. What is the total length of ribbon used?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: 'cm',
      hints: ['Does each strip add the same length, so the total is a product?', "Multiply the number of strips by each strip's length; split a factor into tens and ones."],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// Metacognition base: only ever served through the estimate-first wrapper.
const sitOrder = situation({
  situationType: 'rate', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(12, 40); const b = r.int(11, 30);
    const [pack, item] = r.pick([['cartons', 'eggs'], ['packs', 'stickers'], ['rolls', 'stamps'], ['jars', 'beads']]);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} orders ${a} ${pack} of ${item}, with ${b} ${item} in each. How many ${item} altogether?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: item,
      hints: ['How many equal groups are there, and how big is each one?', 'Round both factors to the nearest ten to picture the size, then multiply exactly.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const sitEstimate = withEstimateFirst(sitOrder, 'round each factor to the nearest ten — about where should the real product land?');

// --- Multi-step problems (the product is one step in a longer chain) ------------
const msSeats = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(12, 30); const b = r.int(11, 25); const c = r.int(8, 40);
    return {
      prompt: `A depot stacks ${a} pallets with ${b} cartons on each, plus ${c} loose cartons on the floor. How many cartons are there in all?`,
      initN: a, steps: [{ op: 'mul', n: b, d: 1 }, { op: 'add', n: c, d: 1 }], units: 'cartons',
      hints: ['Do the loose cartons come before or after you find the stacked block?', 'Find the pallets-times-cartons product first, then add the loose ones.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msParking = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(12, 28); const b = r.int(11, 24); const c = r.int(6, 30);
    return {
      prompt: `A packer fills ${a} crates with ${b} jars each, but ${c} jars arrive cracked and are set aside. How many good jars are packed?`,
      initN: a, steps: [{ op: 'mul', n: b, d: 1 }, { op: 'sub', n: c, d: 1 }], units: 'jars',
      hints: ['Are you counting every jar, or only the ones still fit to pack?', 'Work out the full crates-times-jars total, then take away the cracked ones.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const msWarehouse = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(12, 26); const b = r.int(11, 22); const c = r.int(10, 40); const e = r.int(5, 30);
    return {
      prompt: `A warehouse stacks ${a} shelves with ${b} boxes on each. A delivery adds ${c} more boxes, then ${e} boxes are shipped out. How many boxes remain?`,
      initN: a, steps: [{ op: 'mul', n: b, d: 1 }, { op: 'add', n: c, d: 1 }, { op: 'sub', n: e, d: 1 }], units: 'boxes',
      hints: ['Which happens first: stacking the shelves, or the delivery and shipping?', 'Find the shelves-times-boxes product, add the delivery, then subtract what shipped.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (structural: how many rooms; which needs four) --------
const discrimRooms = discrimination({
  variant: 'structural',
  draw: (r) => {
    const a = r.int(21, 49); const b = r.int(21, 49);
    return {
      prompt: `To multiply ${a} × ${b}, both factors are split by place into tens and ones. How many partial products (rooms) must be added to reach the whole product?`,
      correct: 'four', correctForms: ['4', 'four rooms'],
      distractors: [
        { text: 'two', errorTag: 'concept-misconception', rationale: 'Splits only one factor, as in a two-digit by one-digit product — but here BOTH factors are split.' },
        { text: 'three', errorTag: 'concept-misconception', rationale: 'Drops one of the four place-pair products — a missing room.' },
      ],
      hints: ['How many place-parts does each two-digit factor break into?', 'Pair every place-part of one factor with every place-part of the other, and count the pairings you make.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const discrimVsOne = discrimination({
  variant: 'structural',
  draw: (r) => {
    const a = r.int(21, 49); const b = r.int(21, 49); const p = r.int(21, 49); const q = r.int(3, 9);
    return {
      prompt: `Which product needs FOUR partial products (four rooms): ${a} × ${b}, or ${p} × ${q}?`,
      correct: `${a} × ${b}`, correctForms: ['the two-digit by two-digit one'],
      distractors: [
        { text: `${p} × ${q}`, errorTag: 'concept-misconception', rationale: 'A two-digit by one-digit product splits only one factor, so it makes just two rooms, not four.' },
        { text: 'both need the same number', errorTag: 'representation-misread', rationale: 'Treats a one-digit factor as if it also split into tens and ones.' },
      ],
      hints: ['Which factor pair splits BOTH numbers into tens and ones?', 'Only a two-digit times a two-digit makes a full two-by-two grid of rooms.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth AND the shown wrong) ---
// The student computed each of the four rooms but, for the ones-by-tens room,
// ADDED the two place-parts instead of multiplying. `a` = the ones part, `b` = the
// tens value; correct room = a×b, the shown wrong room = a+b (a real misconception).
const eaRoomAdded = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const t1 = r.int(2, 9); const o1 = r.int(2, 9); const t2 = r.int(2, 9); const o2 = r.int(2, 9);
    return { a: o1, b: t2 * 10, op: '*', wrongOp: '+', A: t1 * 10 + o1, B: t2 * 10 + o2 };
  },
  build: (v, p) => {
    const A = Number(p.A); const B = Number(p.B); const room = Number(p.a); const tens = Number(p.b);
    return {
      prompt: `A student multiplied ${A} × ${B} with the four-rooms method. For the ones-by-tens room they wrote ${room} and ${tens} in the corners and recorded that room as ${v.wrong}.`,
      extension: "Explain why that room needs a multiply, give the room's true value, and estimate the whole product to show the total is now sensible.",
      hints: ['Does that room show a product of two place-parts, or just their sum?', 'Picture the ones part copied across the whole tens part — that many, not one more group.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: ['multiply', 'room'],
    };
  },
});

export const buildD08 = makeWeekBuilder({
  week: 8,
  conceptId: 'two-digit-by-two-digit',
  conceptName: '2-digit × 2-digit',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D5, D6],
  pedagogyContract: 'v2',
  conceptualAnchor: 'four rooms',
  explanation: {
    hook: 'A rectangle for 23 × 47 splits into FOUR rooms, not two. Miss one room and the answer is quietly wrong — so this week is really about accounting for every partial product.',
    whyBeforeHow:
      'Because both factors are broken by place, the area rectangle cuts into four rooms — tens by tens, tens by ones, ones by tens, and ones by ones — one room for every pairing of a place-part from each factor, so the whole product is the sum of all four room areas. The standard algorithm folds those four rooms into two written rows, which is why drawing the four rooms first is what keeps a partial product from quietly going missing.',
    script: [
      { say: 'Watch: 24 × 36. I split 24 into 20 and 4, and 36 into 30 and 6. That gives four rooms — 20 × 30 = 600, 20 × 6 = 120, 4 × 30 = 120, and 4 × 6 = 24.', visual: 'A rectangle cut into four labeled rooms.' },
      { say: 'I add all four rooms — six hundred, one hundred twenty, one hundred twenty, and twenty-four — and the total is 864. Every room has to be counted, or the answer comes up short.', visual: 'Four room areas gather into one running sum.' },
      { say: 'Before trusting the total, I estimate: 20 by 40 is about 800, so a sensible answer sits near there — if my total were tiny, I would know a room had gone missing.', visual: 'A rounded estimate brackets the four-room total.' },
    ],
    summary: 'Break both factors by place, find all four rooms (tens by tens down to ones by ones), and add them. Estimate with rounded factors to catch a room that went missing.',
    vocabulary: [
      { term: 'partial product', kidGloss: 'the area of one of the four rooms' },
      { term: 'four rooms', kidGloss: 'the four rectangles when both sides are split by place' },
      { term: 'estimate', kidGloss: 'a rounded check that catches a missing partial' },
    ],
  },
  guidedExamples: [
    ge(8, 1, 'modeled', 'Find 24 × 36 with the four-rooms method.', [
      { teacherSay: 'Watch me split 24 into 20 and 4, and 36 into 30 and 6 — I get four rooms, one for each pair of place-parts, so let me find each room on its own.' },
      { teacherSay: 'The four rooms are 20 × 30 = 600, 20 × 6 = 120, 4 × 30 = 120, and 4 × 6 = 24; now I add all four rooms.', expected: '864' },
    ], '864'),
    ge(8, 2, 'completion', 'Complete the four rooms for 52 × 18, then add them.', [
      { teacherSay: 'Split 52 into 50 and 2, and 18 into 10 and 8. Which four rooms do you get?', expected: '500, 400, 20, 16' },
      { childDo: 'Add the four rooms.', expected: '936' },
    ], '936'),
    ge(8, 3, 'prompted', 'Find 47 × 29 with four rooms, then estimate to check.', [
      { childDo: 'List the four rooms and add them.', expected: '1,363' },
    ], '1,363'),
    ge(8, 4, 'independent', 'Solve 63 × 24 cold: four rooms, add, then round each factor to check the size.', [
      { childDo: 'Four rooms, add, then estimate with rounded factors.', expected: '1,512' },
    ], '1,512'),
  ],
  days: [
    // Day 1 — concept echo: single-step 2×2 products only, blocked (no interleaving)
    [
      { gen: wFactor, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: wDiv, diff: 2 },
      { gen: sitArea, diff: 2 },
      { gen: sitRate, diff: 3 },
      { gen: sitMeasure, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + estimate-first metacognition enter
    [
      { gen: wMulFact, diff: 2 },
      { gen: wDiv, diff: 2 },
      { gen: sitEstimate, diff: 3 },
      { gen: discrimRooms, diff: 3 },
      { gen: sitArea, diff: 3 },
      { gen: msSeats, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wMulFact, diff: 2 },
      { gen: sitRate, diff: 3 },
      { gen: discrimRooms, diff: 4 },
      { gen: msParking, diff: 4 },
      { gen: msWarehouse, diff: 4 },
      { gen: discrimVsOne, diff: 3 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: sitMeasure, diff: 4 },
      { gen: msSeats, diff: 4 },
      { gen: msParking, diff: 4 },
      { gen: msWarehouse, diff: 5 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaRoomAdded, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Why does multiplying a two-digit number by a two-digit number make FOUR partial products, while a two-digit by a one-digit makes only two? Explain using the rectangle of rooms.',
          value: 'both factors split into two place-parts, so pairing them makes two-by-two = four rooms; splitting one factor makes two-by-one = two rooms',
          acceptableForms: [],
          hints: ['How many pieces does each factor break into when you split it by place?', 'Rooms come from pairing every part of one side with every part of the other.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: multiplying a two-digit number by another two-digit number produces four partial products (four rooms). Say how you know in one sentence.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Thinks some pairs skip a room — but both factors always split into tens and ones, making two by two.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Reads the four-room structure backwards.' },
          ],
          hints: ['Which parts of each factor get paired to form the rooms?', 'Picture both sides split into tens and ones every single time.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Round each factor of 38 × 52 to the nearest ten and give the estimated product. Then say whether an exact answer near two thousand is reasonable, and why.',
          value: '40 times 50 is 2,000, so an exact answer near two thousand is reasonable',
          acceptableForms: ['2000', '2,000', 'reasonable'],
          keywords: true,
          hints: ['About how big should the product be once you round each factor?', 'Compare your rounded estimate with the exact answer — are they close?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D8-PZ-01',
    title: 'Puzzle Grove: The Missing Room',
    puzzleType: 'error-analysis',
    prompt: 'For 26 × 34, three of the four rooms come out to 600, 180, and 24, and the running total on the page is 804. One room was never added. Which room is missing, and what is the correct total?',
    answer: { value: 'the missing room is tens-by-ones, twenty times four, which is worth 80; correct total 884', acceptableForms: ['80', '884'], validation: 'short-text-keyword' },
    hintLadder: ['Which pairing of place-parts is NOT shown among the three rooms?', 'List all four rooms of 20+6 and 30+4, then compare them with the three given.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sitArea, diff: 3 },
    { gen: msSeats, diff: 3 },
    { gen: sitRate, diff: 3 },
    { gen: msParking, diff: 3 },
    { gen: storyMultiply(), diff: 4 },
    { gen: msWarehouse, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: single-step 2-digit × 2-digit (four-room affordance preserved). 02/04/06: multi-step (product then combine / remove / combine-and-remove). 05: equal-groups multiplication story. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'missing-partial', description: 'Uses only three of the four rooms (typically drops tens×ones or ones×tens), or adds within a room instead of multiplying.', exampleWrongAnswer: '32 × 21 with only 30×20, 2×20, 2×1 → 642 (missing 30×1; the true product is 672)', distractorRationale: 'Offer a three-room total or an add-instead-of-multiply room.', reteachPointer: 'explanation/script[0] (the four rooms, always)' },
    { errorTag: 'procedure-slip', subtype: 'partial-sum-slip', description: 'Finds all four rooms but adds them incorrectly.', exampleWrongAnswer: '800+140+120+21 → 1,071', distractorRationale: 'Offer a near-miss total of the correct rooms.', reteachPointer: 'guidedExamples/D8-GE-01 (add all four rooms)' },
    { errorTag: 'representation-misread', subtype: 'place-shift', description: "Forgets a room's place value (writes tens×tens without its zeros).", exampleWrongAnswer: '20 × 40 → 80 instead of 800', distractorRationale: 'Offer the place-shifted room.', reteachPointer: 'explanation/script[2] (the estimate catches a place-shifted room)' },
    { errorTag: 'fact-recall', subtype: 'basic-fact-slip', description: 'A single-digit fact inside a room is wrong.', exampleWrongAnswer: '3 × 7 → 24', distractorRationale: 'Offer an adjacent product.', reteachPointer: '60-second multiplication-fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Two-digit by two-digit multiplication — breaking both numbers by place into four partial products (four "rooms" of a rectangle), then adding all four, with an estimate to catch a missing room.',
    improvingCandidates: ['finding all four partial products', 'adding the four rooms correctly', 'estimating with rounded factors to check the product'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'accounting for all FOUR rooms — the missing-room work drills exactly this' },
      { errorTag: 'representation-misread', text: "keeping each room's place value (20 × 40 is 800, not 80)" },
      { errorTag: 'fact-recall', text: 'quick single-digit facts inside each room — the sprints keep them sharp' },
    ],
    homeFocus: {
      praiseLine: 'You split both factors into place-parts and checked that all four rooms were counted — that habit of finding every partial product is what makes two-digit multiplication reliable.',
      questionForChild: 'For 23 × 45, what are the four rooms — and how do they add up to the answer?',
      schoolSyncHook: 'If your child\'s class uses the box/grid method or the stacked algorithm, tell us and we will lead with that one.',
    },
    vocabularyForParent: ['partial product (area of one room)', 'four rooms (both factors split by place)', 'estimate (a rounded check)'],
  },
});
