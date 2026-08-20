/**
 * Level D · Week 5 — "Area-model multiplication" (conceptId: area-model-multiplication).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten to the proven D4
 * shape (ACCEPT 4.21): the area rectangle is the conceptual anchor, and every
 * computational answer is code-derived (registered answerFor for single-step
 * word problems; the shipped op-chain for multi-step), so no key is hand-typed.
 *
 * Authoring patterns copied from d04.ts:
 *  - Genuine multi-step word problems via lib/multistep (mul→add, mul→sub,
 *    add→mul); the answer + step-count come from the shipped rational op-chain.
 *  - A code-generated error-analysis item (multiplied-vs-added / repeated-add
 *    confusion) whose "wrong" number and true answer are re-derived by QG-11.
 *  - Discrimination traps (which computation = the area model; how many rooms)
 *    forcing a structural CHOICE by Day 3.
 *  - Metacognition (estimate-first) woven into Day 2 core AND modeled in the
 *    explanation script.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free / number-free; each core
 *    generator reused <= 2x. Distinct proper names drawn fresh per item.
 */

import { addWhole, asWarmup, classify, multiply, reasoning, storyMulCompare, subWhole } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { wholeMoney } from '../lib/format';
import { areaGrid, barModel, columnMethod } from '../lib/figures';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D4 = { level: 'D' as const, week: 4 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wSub = asWarmup(subWhole(1200, 88000), D2);
const wCompare = asWarmup(storyMulCompare(), D4);

// --- Single-step area-model situations (fixed, role-based, name-free hints) ------
// 2-digit x 1-digit — a scaling "rate" situation.
const sRows2d = situation({
  situationType: 'rate', cognitiveOp: 'mul',
  draw: (r) => {
    const rows = r.int(3, 9); const per = r.int(12, 49); const name = r.pick(NAMES);
    return {
      prompt: `${name}'s theater has ${rows} rows with ${per} seats in each row. How many seats are there in all?`,
      answerValue: String(rows * per), templateId: 'd_mul_v1', params: { a: rows, b: per }, units: 'seats',
      hints: ['Does every row hold the same number of seats, so one row can be scaled up?', 'Break the seats-in-a-row into tens and ones, multiply each by the row count, then add.'],
      errorTags: ['procedure-slip', 'fact-recall'],
    };
  },
});

// 3-digit x 1-digit — an "area" situation (tiling a floor).
const sTiles3d = situation({
  situationType: 'area', cognitiveOp: 'mul',
  draw: (r) => {
    const w = r.int(3, 9); const l = r.int(101, 499); const name = r.pick(NAMES);
    return {
      prompt: `${name} tiles a hall floor that is ${w} tiles wide and ${l} tiles long. How many tiles cover the floor?`,
      answerValue: String(l * w), templateId: 'd_area_v1', params: { l, w }, units: 'tiles',
      hints: ['Which side is the long one to split into hundreds, tens, and ones?', 'Give each place its own room; a room\'s area is its length times the short side, then add the rooms.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// 2-digit x 1-digit — a second "rate" context (packing crates).
const sCrates2d = situation({
  situationType: 'rate', cognitiveOp: 'mul',
  draw: (r) => {
    const crates = r.int(3, 9); const per = r.int(12, 49);
    return {
      prompt: `A warehouse stacks ${crates} crates, and each crate holds ${per} cans. How many cans are there altogether?`,
      answerValue: String(crates * per), templateId: 'd_mul_v1', params: { a: crates, b: per }, units: 'cans',
      hints: ['Are all the crates filled with the same count, so this is one scaling?', 'Split the cans-per-crate by place value, multiply each part by the crates, and total them.'],
      errorTags: ['procedure-slip', 'fact-recall'],
    };
  },
});

// Metacognition base: a price/rate scaling, only ever served through the estimate wrapper.
const sPrice2d = situation({
  situationType: 'rate', cognitiveOp: 'mul',
  draw: (r) => {
    const qty = r.int(3, 9); const price = r.int(12, 49);
    const item = r.pick(['kite', 'book', 'game', 'plant', 'mug', 'lamp']); const name = r.pick(NAMES);
    return {
      prompt: `One ${item} costs ${wholeMoney(price)}. ${name} buys ${qty} of them. What is the total cost?`,
      answerValue: String(qty * price), templateId: 'd_mul_v1', params: { a: qty, b: price }, units: 'dollars',
      acceptableForms: [wholeMoney(qty * price)],
      hints: ['Does the total grow as equal-size copies of one price?', 'Split the price into tens and ones, scale each by the count, then combine.'],
      errorTags: ['procedure-slip', 'fact-recall'],
    };
  },
});
const sEstimate = withEstimateFirst(
  sPrice2d,
  'if you round the price up, will the true total land above or below that estimate?',
);

// --- Multi-step area-model word problems ---------------------------------------
// scale THEN combine (mul -> add): boxed total plus loose extras.
const msPacking = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const b = r.int(3, 9); const p = r.int(12, 49); const m = r.int(3, 20); const name = r.pick(NAMES);
    return {
      prompt: `${name} packs ${b} boxes with ${p} books in each box, then adds ${m} more loose books on top. How many books did ${name} handle in all?`,
      initN: b, steps: [{ op: 'mul', n: p, d: 1 }, { op: 'add', n: m, d: 1 }], units: 'books',
      hints: ['Does the question want only the boxed books, or the loose ones added too?', 'Find the boxed total first, then bring in the loose books.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// scale THEN take away (mul -> sub): full seat count minus the taken seats.
const msSeating = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const rows = r.int(3, 9); const per = r.int(12, 40); const taken = r.int(6, 30);
    return {
      prompt: `A patio is laid with ${rows} rows of ${per} paving stones. So far ${taken} of the stones are down. How many are still to lay?`,
      initN: rows, steps: [{ op: 'mul', n: per, d: 1 }, { op: 'sub', n: taken, d: 1 }], units: 'stones',
      hints: ['Are you counting every stone, or only the ones still to go?', 'Build the full stone count first, then take away the ones already down.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// scale THEN remove (mul -> sub): a 3-digit x 1-digit tiling minus cracked tiles.
const msTiling = multiStep({
  situationType: 'area', cognitiveOp: 'multi-step',
  draw: (r) => {
    const l = r.int(110, 499); const w = r.int(3, 9); const c = r.int(2, 20); const name = r.pick(NAMES);
    return {
      prompt: `${name}'s floor is ${l} tiles long and ${w} tiles wide. After tiling, ${c} cracked tiles are pulled out. How many good tiles remain?`,
      initN: l, steps: [{ op: 'mul', n: w, d: 1 }, { op: 'sub', n: c, d: 1 }], units: 'tiles',
      hints: ['How many good tiles are left once the cracked ones are set aside?', 'Cover the whole floor first, then remove the cracked tiles from that total.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// grow THEN scale (add -> mul): add rows first, then multiply by plants-per-row.
const msGardenScale = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'multi-step',
  draw: (r) => {
    const rowsA = r.int(2, 5); const extra = r.int(1, 3); const plants = r.int(12, 40); const name = r.pick(NAMES);
    return {
      prompt: `${name}'s garden has ${rowsA} rows of ${plants} plants. Next season ${name} adds ${extra} more rows of the same size. How many plants will the garden have then?`,
      initN: rowsA, steps: [{ op: 'add', n: extra, d: 1 }, { op: 'mul', n: plants, d: 1 }], units: 'plants',
      hints: ['Do the extra rows change how many rows you finally multiply?', 'Settle the new row count first, then scale it by the plants in a row.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (area-model vs repeated-add / dropped-partial) --------
const dSplitMethod = discrimination({
  variant: 'structural', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const k = r.int(3, 9); const ones = r.int(1, 9); const tens = r.int(2, 4) * 10; const a = tens + ones;
    return {
      prompt: `To find ${k} × ${a} with the area model, ${a} breaks into ${tens} and ${ones}. Which computation gives the correct total?`,
      correct: `(${k}×${tens}) + (${k}×${ones})`,
      distractors: [
        { text: `${tens} × ${ones}, then × ${k}`, errorTag: 'concept-misconception', rationale: 'Multiplies the two place-parts together instead of multiplying each part by the outside factor.' },
        { text: `${k} + ${a}`, errorTag: 'concept-misconception', rationale: 'Adds the two factors — treats the "times" as a "plus" (repeated-add confusion).' },
      ],
      hints: ['Does the area model multiply each place part by the outside number, or the parts by each other?', 'Two rooms share one height; each room\'s area is that height times its own width, and the rooms add.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const dRooms = discrimination({
  variant: 'structural', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const k = r.int(3, 9); const a = r.int(102, 499);
    return {
      prompt: `You multiply ${k} × ${a} with the area model. Into how many rooms should the rectangle be cut?`,
      correct: `three rooms — one each for the hundreds, tens, and ones`,
      distractors: [
        { text: `two rooms`, errorTag: 'concept-misconception', rationale: 'Splits off only one place and drops a partial product.' },
        { text: `one room — no break-apart`, errorTag: 'concept-misconception', rationale: 'Leaves the factor whole, so the area model does no work.' },
      ],
      hints: ['How many place-value parts does a three-digit number split into?', 'Name each place inside the three-digit factor, then pair every one of them with the single-digit factor.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives the truth) --------------
// multiplied-vs-added: the child treats "rows of" as an add instead of the area model.
const eaTimesVsPlus = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(3, 9), b: r.int(12, 49), op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A student needed to work out ${p.a} rows of ${p.b} chairs, and wrote ${v.wrong} chairs.`,
    extension: 'Use a labelled rectangle to show why that is wrong, then give the true number of chairs.',
    hints: ['Does "rows of" tell you to add the two numbers, or to copy one amount across the rows?', 'Picture the rows filling a rectangle; count the copies, not a single sum.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
    answerKeywords: ['area model', 'partial'],
  }),
});

export const buildD05 = makeWeekBuilder({
  week: 5,
  conceptId: 'area-model-multiplication',
  conceptName: 'Area-model multiplication',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D2, D4],
  pedagogyContract: 'v2',
  conceptualAnchor: 'area rectangle',
  explanation: {
    hook: 'Multiplying 6 × 47 in your head feels hard — until you break the 47 into 40 and 7, multiply each part, and snap the pieces back together. A rectangle shows exactly why that works.',
    whyBeforeHow:
      'Multiplication is the area of a rectangle, and because the whole area is just the sum of its parts, splitting one side by place value lets you find each smaller room\'s area (a partial product) and add them up. That is why 6 × 47 equals 6 × 40 plus 6 × 7: the area rectangle makes the parts recombine into the whole, and the standard algorithm only records those same partials, stacked more compactly.',
    script: [
      {
        say: 'Watch me set up 6 × 47: I draw a rectangle and cut the 47 side into 40 and 7. Now I have two rooms — 6 × 40 = 240 and 6 × 7 = 42.',
        visual: 'A rectangle 6 tall with its long side cut into 40 and 7, the wide room holding 240 and the narrow one holding 42.',
        figure: areaGrid(
          { rows: 1, cols: 2, rowLabels: ['6'], colLabels: ['40', '7'], cellLabels: ['240', '42'] },
          { alt: 'a rectangle 6 tall, cut into a wide room 40 across holding 240 and a narrow room 7 across holding 42' },
        ),
      },
      {
        say: 'Add the partial products: 240 + 42 = 282. The parts always add back to the whole area — no room can be left out.',
        visual: 'The two room areas laid end to end on one bar, 240 and 42, braced and labelled 282.',
        figure: barModel(
          [{ segments: [{ value: 240, label: '240' }, { value: 42, label: '42' }] }],
          { brace: { label: '282' }, alt: 'one bar made of the two room areas, a long 240 joined to a short 42, braced underneath and labelled 282' },
        ),
      },
      {
        say: 'Estimate first to stay honest: 6 × 50 is about 300, so 282 is reasonable. The standard algorithm records the SAME partials, just stacked.',
        visual: 'The same 6 × 47 stacked as the written algorithm, with its two partial rows 42 and 240 adding to 282.',
        // The claim in the say is that the algorithm holds the SAME two numbers
        // the rooms held, so the two partials are written on their own rows
        // rather than collapsed into one — 42 and 240 are exactly the rooms of
        // segment one and the bar segments of segment two. Leading '' cells hold
        // the empty place columns open, which is what puts each partial under
        // its own place.
        figure: columnMethod(
          {
            op: '×',
            rows: [
              { cells: ['', '4', '7'], role: 'operand' },
              { cells: ['', '', '6'], role: 'operand' },
              { cells: ['', '4', '2'], role: 'partial' },
              { cells: ['2', '4', '0'], role: 'partial' },
              { cells: ['2', '8', '2'], role: 'result' },
            ],
          },
          {
            alt:
              '47 stacked over 6 with a times sign, then the two partial rows the rooms gave — 42 from six sevens ' +
              'and 240 from six forties — and 282 under the line',
          },
        ),
      },
    ],
    summary: 'Break a factor by place, multiply each part (partial products), then add. The area rectangle shows why the parts recombine into the whole product.',
    vocabulary: [
      { term: 'partial product', kidGloss: 'the area of one broken-apart room' },
      { term: 'break apart', kidGloss: 'split a factor into place-value chunks' },
      { term: 'area model', kidGloss: 'a rectangle whose area is the product' },
    ],
  },
  guidedExamples: [
    ge(5, 1, 'modeled', '4 × 68 with the area model.', [
      { teacherSay: 'Let me picture 4 × 68 as a rectangle: I break the 68 side into 60 and 8 so I can multiply friendly place parts. I notice each room is 4 tall.' },
      { teacherSay: 'Watch me fill the two rooms: 4 × 60 is 240, and 4 × 8 is 32. What do the two rooms add to?', expected: '272' },
    ], '272'),
    ge(5, 2, 'completion', '7 × 253 by breaking apart the 253.', [
      { teacherSay: 'Which three place parts does 253 break into?', expected: '200, 50, 3' },
      { childDo: 'Multiply each part by 7 and add the three partials.', expected: '1,771' },
    ], '1,771'),
    ge(5, 3, 'prompted', '6 × 34 with the area model.', [
      { childDo: 'Estimate first with 6 × 30, then find both partials and add.', expected: '204' },
    ], '204'),
    ge(5, 4, 'independent', '9 × 74. Solve cold with partials, then estimate to check.', [
      { childDo: 'Break 74, multiply each part by 9, add; estimate 9 × 70 to check.', expected: '666' },
    ], '666'),
  ],
  days: [
    // Day 1 — concept echo: single-step area-model scaling only (no interleaving)
    [
      { gen: wMulFact, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: sRows2d, diff: 2 },
      { gen: sTiles3d, diff: 3 },
      { gen: sCrates2d, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wSub, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: sEstimate, diff: 3 },
      { gen: dSplitMethod, diff: 3 },
      { gen: msPacking, diff: 3 },
      { gen: sRows2d, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wMulFact, diff: 2 },
      { gen: sTiles3d, diff: 3 },
      { gen: sCrates2d, diff: 4 },
      { gen: dRooms, diff: 3 },
      { gen: msSeating, diff: 3 },
      { gen: dSplitMethod, diff: 4 },
    ],
    // Day 4 — multi-step word problems (all multi-step; >=3 situation types week-wide)
    [
      { gen: msPacking, diff: 4 },
      { gen: msSeating, diff: 4 },
      { gen: msTiling, diff: 5 },
      { gen: msGardenScale, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaTimesVsPlus, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Draw the area model for 5 × 126 and label every room with its partial product, then give the total.',
          value: '5×100=500, 5×20=100, 5×6=30; total 630',
          acceptableForms: ['500', '100', '30', '630'],
          keywords: true,
          hints: ['Which place-value pieces should each room stand for?', 'One labelled room per place; the three areas add to the total.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: to finish an area-model multiplication you must add the area of EVERY room. In one sentence, say how you know.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Suggests a partial product can be skipped — but every room is part of the whole area.' },
            { text: 'never', errorTag: 'concept-misconception', rationale: 'Denies that the rooms recombine into the product.' },
          ],
          hints: ['Do all the rooms\' areas together rebuild the whole rectangle?', 'Leave one room out and the rectangle is not fully covered.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain in writing why breaking 47 into 40 and 7 is a tidier split than 20 and 27 for multiplying by 6.',
          value: 'place-value chunks give round tens that are easy to multiply and add',
          acceptableForms: [],
          hints: ['Which split leaves rooms that are easy to multiply and add?', 'Place-value chunks give round tens and hundreds to work with.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D5-PZ-01',
    title: 'Puzzle Grove: Room by Room',
    puzzleType: 'construction',
    prompt: 'A rectangle for 7 × 68 is split into two rooms by breaking 68 into 60 and 8. One room has an area of 420. What is the other room\'s area, and which part of 68 made the 420 room?',
    answer: { value: 'the other room is 56; the 420 room came from the 60 part (7 × 60)', acceptableForms: ['56', '60'], validation: 'short-text-keyword' },
    hintLadder: ['Which part of 68 would give a room area of 420 when multiplied by 7?', 'The two room areas must add back to 7 × 68.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sRows2d, diff: 3 },
    { gen: msPacking, diff: 3 },
    { gen: sTiles3d, diff: 3 },
    { gen: msSeating, diff: 3 },
    { gen: sCrates2d, diff: 4 },
    { gen: msTiling, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step area-model multiplication (2- and 3-digit × 1-digit). 02/04/06: two-step area-model problems (scale then combine / scale then remove). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'missing-partial', description: 'Drops one partial product (multiplies only the tens, forgets the ones, or vice versa), or treats the "times" as a "plus".', exampleWrongAnswer: '6 × 47 → 240 (only 6 × 40)', distractorRationale: 'Offer a single-partial result or the added-factors result.', reteachPointer: 'guidedExamples/D5-GE-01 (every room counts) then explanation/script[1]' },
    { errorTag: 'procedure-slip', subtype: 'partial-add-slip', description: 'Computes the partials correctly but adds them or the second step wrong.', exampleWrongAnswer: '240 + 42 → 272 (add slip)', distractorRationale: 'Offer a near-miss sum of the correct partials.', reteachPointer: 'explanation/script[1] (the parts recombine to the whole)' },
    { errorTag: 'fact-recall', subtype: 'place-mult-slip', description: 'Multiplies a place part wrong (6 × 40 → 24 instead of 240 — drops the zero).', exampleWrongAnswer: '6 × 40 → 24', distractorRationale: 'Offer the dropped-zero partial.', reteachPointer: '60-second ×-by-tens refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying by breaking a number into place-value parts (the area model) — multiply each part, then add the partial products; the rectangle shows why the pieces recombine into the whole.',
    improvingCandidates: ['breaking a factor into place-value parts', 'multiplying each partial and adding', 'connecting each area rectangle room to its numbers'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'including EVERY partial product — the area-model warm-ups keep all rooms in view' },
      { errorTag: 'fact-recall', text: 'multiplying by tens and hundreds cleanly (6 × 40 = 240) — the sprints keep facts fast' },
      { errorTag: 'procedure-slip', text: 'adding the partials accurately at the end' },
    ],
    homeFocus: {
      praiseLine: 'You broke the two-digit factor into tens and ones, multiplied each room, and added the partials back to the whole — that is the area model working exactly as it should.',
      questionForChild: 'For 6 × 34, what are the two partial products — and how do they add up to the answer?',
      schoolSyncHook: 'If your child\'s class uses a grid or box method, tell us and we will match that layout.',
    },
    vocabularyForParent: ['partial product (area of one broken-apart room)', 'break apart (split by place value)', 'area model (a rectangle whose area is the product)'],
  },
});
