/**
 * Level D · Week 15 — "Multi-digit × fluency" (conceptId: multi-digit-multiplication-fluency).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten on the proven
 * D4 shape (ACCEPT 4.21). Standard algorithm for 3-digit × 2-digit, with an
 * estimate-first reasonableness check as the through-line.
 *
 * Authoring choices (kit recipe D15):
 *  - Multi-step (op-family ≥2): mul→add (array + extra) and mul→sub (build then
 *    remove / cost then voucher) chains — answer + step-count come from the
 *    shipped rational op-chain.
 *  - Error-analysis (Day 5): d_verify_binop_misconception_v1 — a rushed learner
 *    adds the two factors instead of multiplying; the true product and the shown
 *    wrong value are BOTH recomputed by QG-11, and the analysis is framed on the
 *    rounded-factor estimate (why the sum cannot be the product).
 *  - Discrimination (Days 2–3): estimate-vs-exact reasonableness — pick the
 *    best rounded-factor estimate; the traps are a dropped place and an extra zero.
 *  - Situations: packing (rate), seating (area), distance (measurement), plus
 *    combine / part-whole / money-change multi-step families.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free; each generator reused
 *    ≤2× in the daily core; every rung-1 an algorithm-free orienting question.
 */

import { asWarmup, classify, divideRemainder, factorPair, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { article, fmtInt, wholeMoney } from '../lib/format';
import { ge, makeWeekBuilder } from '../lib/assemble';

const D3 = { level: 'D' as const, week: 3 };
const C12 = { level: 'C' as const, week: 12 };
const D5 = { level: 'D' as const, week: 5 };
const D6 = { level: 'D' as const, week: 6 };
const D8 = { level: 'D' as const, week: 8 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** Two distinct names (drawn fresh per item; never a hardcoded pool name). */
const two = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wTwoByOne = asWarmup(multiply(11, 49, 3, 9), D5);
const wTwoByTwo = asWarmup(multiply(11, 29, 11, 29), D8);
const wDiv = asWarmup(divideRemainder(3, 9, 20, 89), D6);
const wFactor = asWarmup(factorPair(), D3);                   // D3 missing-factor form (not a second bare product)

// --- Single-step 3-digit × 2-digit situations (fixed, role-based, name-free hints) --
const sPack = situation({
  situationType: 'rate', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(103, 489); const b = r.int(12, 79);
    const [container, item] = r.pick([['crates', 'bolts'], ['boxes', 'nails'], ['bins', 'screws'], ['cartons', 'clips'], ['sacks', 'beads']]);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} packs ${a} ${container} with ${b} ${item} in each. How many ${item} is that in all?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: item,
      hints: ['Does this describe equal groups, or something being shared out?', 'Set the number of containers against the amount in each, then multiply.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const sSeat = situation({
  situationType: 'area', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(102, 389); const b = r.int(13, 49);
    const place = r.pick(['library', 'archive', 'bookshop', 'reading room', 'store room']);
    return {
      // `article()` rather than a hardcoded "A": the pool contains "archive",
      // which needs "an". Capitalised because the sentence opens here.
      prompt: `${cap(article(place))} has ${a} shelves holding ${b} books each. How many books are there in all?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: 'books',
      hints: ['Picture the books as a grid of shelves and columns — what finds the whole array?', 'Multiply the number of shelves by the books on each shelf.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** Sentence-initial capital for an article-led opener. */
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const sTrip = situation({
  situationType: 'measurement', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(108, 389); const b = r.int(12, 29);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} drives a ${a} km loop ${b} times in a season. How many km is that in all?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: 'km',
      hints: ['Is each loop the same length, so the total is one amount repeated?', 'Multiply the length of one loop by the number of loops.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// Metacognition base: a cost problem, only ever served through the estimate wrapper.
const sMoney = situation({
  situationType: 'rate', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(103, 269); const b = r.int(12, 29);
    const name = r.pick(NAMES);
    return {
      prompt: `${name}'s club buys ${a} tickets at ${wholeMoney(b)} each. What is the total cost?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: 'dollars',
      acceptableForms: [wholeMoney(a * b)],
      hints: ['Does buying more at one price scale the cost up in equal steps?', 'Multiply the price by how many tickets are bought.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const mcEstimate = withEstimateFirst(
  sMoney,
  'round both factors to their leading place — about where should the answer land?',
);

// --- Multi-step 3-digit × 2-digit problems (chain answer from the op-chain) ------
const msFill = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(103, 289); const b = r.int(12, 29); const c = r.int(10, 89);
    const [n1, n2] = two(r);
    return {
      prompt: `${n1} fills ${a} shelves with ${b} books each, and ${n2} adds ${c} more books to the collection. How many books are there now?`,
      initN: a, steps: [{ op: 'mul', n: b, d: 1 }, { op: 'add', n: c, d: 1 }], units: 'books',
      hints: ['Are you asked for the shelved amount, or that amount plus an addition on top?', 'Find the array total first, then combine it with the extra amount.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). Every other multi-step in this week
// narrates its operations in execution order, so the child follows rather than
// plans. Here the stated total is the RESULT of the packing, so the opening move
// is a divide the sentence order never announces.
const msShip = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step', usesPriorSkill: true, posing: 'inverse-start',
  draw: (r) => {
    const b = r.int(12, 24); const crates = r.int(8, 20); const a = b * crates; const c = r.int(2, b - 1);
    const [n1, n2] = two(r);
    return {
      prompt: `${n1} packed ${a} tins equally into ${crates} crates. ${n2} then takes ${c} tins out of one crate. How many tins are left in that crate?`,
      initN: a, steps: [{ op: 'div', n: crates, d: 1 }, { op: 'sub', n: c, d: 1 }], units: 'tins',
      hints: ['Do you already know what one crate holds, or must you work that out first?', 'Find what a single crate held, then take away the tins removed from it.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const msBudget = multiStep({
  situationType: 'money-change', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(110, 240); const b = r.int(12, 29); const c = r.int(15, 89);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} buys ${a} tickets at ${wholeMoney(b)} each and then uses a ${wholeMoney(c)} group voucher. What is the final cost in dollars?`,
      initN: a, steps: [{ op: 'mul', n: b, d: 1 }, { op: 'sub', n: c, d: 1 }], units: 'dollars',
      hints: ['What has to be worked out before the voucher can be taken off?', 'Multiply to get the full cost, then subtract the reduction.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination: estimate vs exact reasonableness (fixed name-free hints) ----
const discEstimate = discrimination({
  variant: 'structural', cognitiveOp: 'estimate-reasonableness',
  draw: (r) => {
    const a = r.int(124, 889); const b = r.int(24, 89);
    const rA = Math.round(a / 100) * 100; const rB = Math.round(b / 10) * 10;
    const est = rA * rB;
    return {
      prompt: `Rounding both factors to their biggest place, which is the closest estimate of ${fmtInt(a)} × ${fmtInt(b)}?`,
      correct: fmtInt(est), correctForms: [String(est)],
      distractors: [
        { text: fmtInt(est / 10), errorTag: 'representation-misread', rationale: 'Dropped a place — the estimate is missing one of its zeros.' },
        { text: fmtInt(est * 10), errorTag: 'procedure-slip', rationale: 'Slipped an extra zero onto the estimate.' },
      ],
      hints: ['Which single round number is nearest without doing the exact multiply?', 'Round each factor to its leading place, then multiply the round numbers.'],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives both truths) --------------
const eaEstimate = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(103, 897), b: r.int(23, 79), op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A student was asked for ${p.a} × ${p.b} and, rushing, wrote ${v.wrong}.`,
    extension: 'Use a rounded-factor estimate to show why that answer cannot be the product, then give the true product.',
    hints: ['Does a quick estimate of the rounded factors land anywhere near this answer?', 'Compare the size of a product with the size of a sum of the same two numbers.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
});

export const buildD15 = makeWeekBuilder({
  week: 15,
  conceptId: 'multi-digit-multiplication-fluency',
  conceptName: 'Multi-digit × fluency',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D5, D8],
  pedagogyContract: 'v2',
  conceptualAnchor: 'standard algorithm',
  deepeningDelta:
    'Extends the four-partial 2-digit × 2-digit work of Week 8 to a 3-digit × 2-digit factor: more partial products and a longer tens row, with a rounded-factor estimate promoted from optional check to the routine reasonableness gate.',
  explanation: {
    hook: '243 × 57 looks intimidating, but it is the four-room idea stretched wider: break each factor by place, multiply the parts, and add. The area model and the tidy algorithm are the SAME work in two outfits.',
    whyBeforeHow:
      'Because a three-digit by two-digit product is just a big rectangle cut into place-value rooms, the standard algorithm can record each room as a partial product in its own stacked row — that is why the placeholder zero matters, since it holds the tens row in its true column so no partial slips a place. An estimate from rounding both factors brackets the whole thing, so a dropped row or a lost zero shows up at a glance rather than hiding in a tidy-looking answer.',
    script: [
      { say: 'Watch me build the standard algorithm one row at a time: the ones row first, then the tens row underneath it, each a bundle of partial products.', visual: 'Two algorithm rows form; their partials tie back to the rooms of a rectangle.' },
      { say: 'The tens row ends in a placeholder zero on purpose, because I am really multiplying by a whole ten, and that zero keeps every partial in its true column.', visual: 'The placeholder zero slides into the second row before the digits.' },
      { say: 'Before I trust the total, I estimate: round both factors to their leading place and the exact answer should land near that round product — a dropped row or a missing zero jumps out right away.', visual: 'A rounded bracket sits beside the exact answer, close but not equal.' },
    ],
    summary: 'Break both factors by place, multiply row by row with the ten-row placeholder zero, and add. Round both factors first so the estimate brackets the answer and any slip is obvious.',
    vocabulary: [
      { term: 'partial product', kidGloss: 'one place-part of the whole product' },
      { term: 'placeholder zero', kidGloss: 'the zero that marks a times-by-ten row' },
      { term: 'estimate', kidGloss: 'rounded factors that bracket the answer' },
    ],
  },
  guidedExamples: [
    ge(15, 1, 'modeled', '124 × 32.', [
      { teacherSay: 'Let me lay 124 by 32 out as the standard algorithm. First I multiply 124 by the 2 ones — I expect a number a little under two hundred fifty.', expected: '248' },
      { teacherSay: 'Now the tens row: 124 by the 3 tens, and I write the placeholder zero first so the row sits in the tens column.', expected: '3,720' },
      { childDo: 'Add the two rows.', expected: '3,968' },
    ], '3,968'),
    ge(15, 2, 'completion', '206 × 45.', [
      { teacherSay: 'The ones row is 206 fives; the tens row is 206 forties. Which row still carries the placeholder zero?', expected: 'the tens row' },
      { childDo: 'Write both rows and add.', expected: '9,270' },
    ], '9,270'),
    ge(15, 3, 'prompted', '318 × 26.', [
      { childDo: 'Multiply the ones row, then the tens row with its placeholder zero, then add; estimate 320 by 26 to check.', expected: '8,268' },
    ], '8,268'),
    ge(15, 4, 'independent', '243 × 57. Solve cold, then check with a rounded estimate.', [
      { childDo: 'Two rows with the placeholder zero, then add.', expected: '13,851' },
    ], '13,851'),
  ],
  days: [
    // Day 1 — concept echo: single-step 3×2-digit products only, blocked
    [
      { gen: wMulFact, diff: 2 },
      { gen: wFactor, diff: 2 },
      { gen: wDiv, diff: 2 },
      { gen: sPack, diff: 2 },
      { gen: sSeat, diff: 3 },
      { gen: sTrip, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination + multi-step enter
    [
      { gen: wTwoByOne, diff: 2 },
      { gen: wDiv, diff: 2 },
      { gen: mcEstimate, diff: 3 },
      { gen: discEstimate, diff: 3 },
      { gen: msFill, diff: 3 },
      { gen: sPack, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wTwoByTwo, diff: 2 },
      { gen: sSeat, diff: 3 },
      { gen: msShip, diff: 3 },
      { gen: msBudget, diff: 4 },
      { gen: discEstimate, diff: 4 },
      { gen: sTrip, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msFill, diff: 4 },
      { gen: msShip, diff: 4 },
      { gen: msBudget, diff: 5 },
      { gen: mcEstimate, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaEstimate, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Show that the area model and the standard algorithm give the same product for 128 × 24 by matching each area room to the algorithm row that contains it. (Written work required.)',
          value: 'the four area rooms and the two algorithm rows both total 3,072 — the same partial products, grouped two ways',
          acceptableForms: ['3072', '3,072'],
          keywords: true,
          hints: ['Which rooms of the rectangle line up with which rows of the algorithm?', 'Match each partial product to the room that produces it.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: an estimate found by rounding both factors is exactly equal to the real product. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Treats a rounded estimate as the exact product — true only when the factors are already round.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Misses that round factors round to themselves, so the estimate can hit the product exactly.' },
          ],
          hints: ['When would a rounded estimate land exactly on the real product?', 'Think about factors that are already round versus ones that are not.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D15-PZ-01',
    title: 'Puzzle Grove: The Row That Lost Its Zero',
    puzzleType: 'error-analysis',
    prompt: 'For 146 times 23, a helper wrote a ones-row of 438 and a tens-row of 292, then added them for a total of 730. One row forgot its placeholder zero. Find the corrected tens-row and the true product.',
    answer: { value: 'tens-row 2,920 and product 3,358', acceptableForms: ['2920', '2,920', '3358', '3,358'], validation: 'short-text-keyword' },
    hintLadder: ['Which row is really multiplying by twenty rather than by two?', 'Give that row its placeholder zero, then add the two rows again.'],
    errorTags: ['representation-misread', 'procedure-slip'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sPack, diff: 3 },
    { gen: msFill, diff: 3 },
    { gen: sSeat, diff: 3 },
    { gen: msShip, diff: 3 },
    { gen: sTrip, diff: 4 },
    { gen: msBudget, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step 3-digit × 2-digit products (packing / seating / distance affordances preserved). 02/04/06: two-step multiplication (array-then-add, build-then-remove, cost-then-voucher). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'missing-placeholder', description: 'Drops the placeholder zero on the times-by-ten row, collapsing a place.', exampleWrongAnswer: '152 × 30 answered with the 456 row and no zero', distractorRationale: 'Offer the no-placeholder row result.', reteachPointer: 'explanation/script[1] (the placeholder keeps places honest)' },
    { errorTag: 'representation-misread', subtype: 'digit-shift', description: 'Shifts a partial into the wrong column, or drops a place from the estimate.', exampleWrongAnswer: 'the tens row written one column off', distractorRationale: 'Offer the shifted-row or missing-zero total.', reteachPointer: 'D8 review (keep partials in their place)' },
    { errorTag: 'procedure-slip', subtype: 'row-add-slip', description: 'Computes the rows or the estimate but adds a row, or an extra zero, incorrectly.', exampleWrongAnswer: '852 and 4,260 added to 5,012', distractorRationale: 'Offer a near-miss row sum or an extra-zero estimate.', reteachPointer: 'guidedExamples/D15-GE-01 (add the two rows)' },
    { errorTag: 'task-comprehension', subtype: 'estimate-vs-exact', description: 'Confuses the rounded estimate with the exact product, or reads a two-step story as one step.', exampleWrongAnswer: 'reports the estimate as the final answer', distractorRationale: 'Offer the estimate in place of the exact product.', reteachPointer: 'guidedExamples/D15-GE-02 (rows, then add for the exact total)' },
    { errorTag: 'fact-recall', subtype: 'basic-fact-slip', description: 'A single-digit fact inside a row is wrong.', exampleWrongAnswer: '6 × 8 answered as 42', distractorRationale: 'Offer an adjacent product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Fluent multi-digit multiplication (3-digit × 2-digit) — the standard algorithm as stacked rows of partial products, the placeholder zero on the times-by-ten row, and a rounded-factor estimate to bracket the answer.',
    improvingCandidates: ['writing both algorithm rows correctly', 'keeping the placeholder zero on the tens row', 'estimating with rounded factors to check the product'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the times-by-ten placeholder zero — the warm-ups keep it in view' },
      { errorTag: 'representation-misread', text: 'stacking each partial in its correct column' },
      { errorTag: 'procedure-slip', text: 'adding the rows and placing zeros carefully — the estimate catches a slip' },
      { errorTag: 'fact-recall', text: 'quick single-digit facts inside every row — the sprints keep them fast' },
    ],
    homeFocus: {
      praiseLine: 'You estimated with rounded factors and caught that a quick sum was far too small to be the product — that reasonableness check is the whole safety net.',
      questionForChild: 'When you multiply 152 × 30, why does the answer end in a zero — and about how big should 243 × 57 be before you work it out?',
      schoolSyncHook: 'If your child\'s class prefers the area/box method or the stacked algorithm, tell us and we will lead with it.',
    },
    vocabularyForParent: ['partial product (one place-part)', 'placeholder zero (marks a times-by-ten row)', 'estimate (rounded bracket)'],
  },
});
