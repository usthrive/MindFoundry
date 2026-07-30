/**
 * Level D · Week 20 — "× ÷ decimals" (conceptId: muldiv-decimals).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten to the proven D4
 * shape: module-scope generators with FIXED, role-based, name-free / number-free
 * hint ladders (seed-invariant dedup), each generator reused ≤ 2× in the daily
 * core, distinct names drawn per item, rung-1 always an algorithm-free orienting
 * question.
 *
 * Concept: multiply the digits, then PLACE THE POINT by counting the factors'
 * decimal places; divide a decimal by a whole with the point held above;
 * estimation is the safety net that fixes the point.
 *
 * Authoring choices (per the D20 recipe row):
 *  - Multi-step (2×, ≥1 on Day 4): a money 2-step "cost × qty THEN ÷ among people"
 *    (msCostShare) and a rate 2-step "rate × days THEN + a cool-down" (msDistance) —
 *    both composed by the shipped exact-decimal op-chain (evalDecChain).
 *  - Error-analysis (Day 5, generated): the POINT-DROP misconception via
 *    d_verify_dec_v1 (wrongMode 'point-drop') — the shown "wrong" number and the
 *    true product are both re-derived by QG-11, so neither can be fabricated.
 *  - Discrimination (Days 2–3): "where does the point go" — the digits are given,
 *    the child must choose the point position (correct code-selected).
 *  - Situations: money-change, measurement, area, sharing, rate (≥3 distinct).
 */

import { asWarmup, classify, decAddSub, decRound, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStepDec } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { divDecByWhole, formatDec, mulDec } from '../lib/compute';
import { money } from '../lib/format';
import type { Rng } from '../../rng';

/** A realistic shelf price to the cent, in 5-cent steps: "1.05"…"8.95". */
const priceCents = (r: Rng) => (r.int(21, 179) * 5 / 100).toFixed(2);
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D13 = { level: 'D' as const, week: 13 };
const D14 = { level: 'D' as const, week: 14 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wDecAdd = asWarmup(decAddSub(1), D14);
const wDecRound = asWarmup(decRound(2), D13);

// --- Single-step decimal situations (fixed, role-based, name-free hints) --------
// decimal × whole, money (money-change)
const sMoneyMul = situation({
  situationType: 'money-change', cognitiveOp: 'dec-mul',
  draw: (r) => {
    const price = priceCents(r);
    const qty = r.int(3, 9);
    const item = r.pick(['notebooks', 'apples', 'pens', 'tickets', 'stamps', 'markers']);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} buys ${qty} ${item} at ${money(price)} each. What is the total cost?`,
      answerValue: mulDec(price, String(qty)), templateId: 'd_dec_mul_v1', params: { a: price, b: String(qty) }, units: 'dollars',
      hints: ['Does the cost grow with each item bought, or stay the same?', 'Multiply the price by the number of items, then place the point.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// decimal × whole, measurement
const sRateMul = situation({
  situationType: 'measurement', cognitiveOp: 'dec-mul',
  draw: (r) => {
    const a = (r.int(11, 89) / 10).toFixed(1);
    const b = r.int(3, 9);
    const name = r.pick(NAMES);
    return {
      prompt: `A plank is ${a} m long. ${name} lays ${b} identical planks end to end. What is the total length?`,
      answerValue: mulDec(a, String(b)), templateId: 'd_dec_mul_v1', params: { a, b: String(b) }, units: 'm',
      hints: ['Is this one plank\'s length, or all of them together?', 'Multiply one plank\'s length by how many planks there are.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// decimal × decimal, area
const sDecTimesDec = situation({
  situationType: 'area', cognitiveOp: 'dec-mul',
  draw: (r) => {
    const a = (r.int(11, 89) / 10).toFixed(1);
    const b = (r.int(2, 9) / 10).toFixed(1);
    const name = r.pick(NAMES);
    return {
      prompt: `${name}'s rug is ${a} m long and ${b} m wide. What is its area in square metres?`,
      answerValue: mulDec(a, b), templateId: 'd_dec_mul_v1', params: { a, b }, units: 'square metres',
      hints: ['Will the area be smaller or larger than the longer side?', 'Multiply length by width, then count both factors\' decimal places.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// decimal ÷ whole, sharing (dividend built so the division is exact)
const sDivShare = situation({
  situationType: 'sharing', cognitiveOp: 'dec-div',
  draw: (r) => {
    let qInt = r.int(11, 89);
    if (qInt % 10 === 0) qInt += 1;
    const q = (qInt / 10).toFixed(1);
    const b = r.int(2, 8);
    const a = mulDec(q, String(b)); // a = q·b, so a ÷ b = q exactly
    const name = r.pick(NAMES);
    return {
      prompt: `${name} pours ${a} litres of juice equally into ${b} bottles. How much juice is in each bottle?`,
      answerValue: divDecByWhole(a, b), templateId: 'd_dec_div_v1', params: { a, b }, units: 'litres',
      hints: ['Is each bottle\'s share bigger or smaller than the whole amount?', 'Share the whole part first, then the tenths, keeping the point above.'],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

// Metacognition base: a fare/day cost, only ever served through the estimate wrapper.
const sRateBudget = situation({
  situationType: 'rate', cognitiveOp: 'dec-mul',
  draw: (r) => {
    const price = priceCents(r);
    const qty = r.int(3, 9);
    const name = r.pick(NAMES);
    return {
      prompt: `A day pass costs ${money(price)}. ${name} buys one for each of ${qty} days. What is the total cost?`,
      answerValue: mulDec(price, String(qty)), templateId: 'd_dec_mul_v1', params: { a: price, b: String(qty) }, units: 'dollars',
      hints: ['Should the total sit near one fare, or well above it?', 'Multiply the fare by the number of days, then place the point.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const sRateBudgetEstimate = withEstimateFirst(sRateBudget, 'should the total sit near one fare, or well above it?');

// --- Multi-step decimal problems -----------------------------------------------
// cost × qty THEN ÷ among people (money 2-step). qty is a multiple of people, so
// the total divides exactly and the answer is a clean money value.
const msCostShare = multiStepDec({
  situationType: 'money-change', cognitiveOp: 'dec-chain',
  draw: (r) => {
    const price = priceCents(r);
    const people = r.pick([2, 5]);
    const qty = people * r.int(2, 4);
    const item = r.pick(['snacks', 'tickets', 'gifts', 'meals', 'passes']);
    const name = r.pick(NAMES);
    return {
      prompt: `At ${money(price)} each, ${name} buys ${qty} ${item}, then shares the total cost equally among ${people} people. How much does each person pay?`,
      init: price, steps: [{ op: 'mul', v: String(qty) }, { op: 'div', v: String(people) }], units: 'dollars',
      hints: ['Does the question want the whole bill, or one person\'s share?', 'Find the total cost first, then split it into equal shares.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// rate × days THEN + a cool-down (rate 2-step)
const msDistance = multiStepDec({
  situationType: 'rate', cognitiveOp: 'dec-chain',
  draw: (r) => {
    const rate = (r.int(11, 45) / 10).toFixed(1);
    const days = r.int(2, 6);
    const extra = (r.int(5, 25) / 10).toFixed(1);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} jogs ${rate} km each morning for ${days} mornings, then jogs ${extra} km more to cool down. How far in all?`,
      init: rate, steps: [{ op: 'mul', v: String(days) }, { op: 'add', v: extra }], units: 'km',
      hints: ['Is this one morning\'s run, or the whole week together?', 'Total the repeated mornings first, then add the cool-down.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination: where does the point go? (fixed name-free hints) -----------
const discrimPoint = discrimination({
  variant: 'structural', cognitiveOp: 'place-point',
  draw: (r) => {
    const aInt = r.int(2, 9);
    const bInt = r.int(2, 9);
    const a = (aInt / 10).toFixed(1);
    const b = (bInt / 10).toFixed(1);
    const product = aInt * bInt;
    const correct = mulDec(a, b);        // two decimal places (both factors < 1)
    const oneOff = formatDec(product, 1); // counted only one factor's place
    const dropped = String(product);      // dropped the point entirely
    return {
      prompt: `For ${a} × ${b}, multiplying the digits gives ${product}. Where does the decimal point belong in the answer?`,
      correct,
      distractors: [
        { text: oneOff, errorTag: 'procedure-slip', rationale: 'Counted the decimal places in only ONE factor, not both.' },
        { text: dropped, errorTag: 'concept-misconception', rationale: 'Dropped the point entirely — but two numbers under 1 make a product under 1.' },
      ],
      hints: ['Are both factors less than one, or more than one?', 'Count the decimal places in BOTH factors, then slide the point that many spots.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives the truth) --------------
const eaPointDrop = errorAnalysis({
  verifyTemplateId: 'd_verify_dec_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    let aInt = r.int(11, 89);
    if (aInt % 10 === 0) aInt += 1;
    return { a: (aInt / 10).toFixed(1), b: String(r.int(3, 9)), op: '*', wrongMode: 'point-drop' };
  },
  build: (v, p) => ({
    prompt: `A student multiplied ${p.a} × ${p.b}. Every digit in their working is right, but they wrote the answer as ${v.wrong}.`,
    extension: 'Use estimation to show why that answer is far too big, then write the correct product.',
    hints: ['About how big should this product be — near the whole-number guess, or ten times bigger?', 'Estimate the size first, then count the decimal places the point needs.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
    answerKeywords: ['estimate'],
  }),
});

export const buildD20 = makeWeekBuilder({
  week: 20,
  conceptId: 'muldiv-decimals',
  conceptName: '× ÷ decimals',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D13, D14],
  pedagogyContract: 'v2',
  conceptualAnchor: 'place-the-point',
  explanation: {
    hook: '0.3 × 0.4 is not 0.12 by luck — it is three-tenths of four-tenths, and tenths times tenths make hundredths. The whole game is knowing WHERE the point lands, and estimation always tells you.',
    whyBeforeHow:
      'When you multiply decimals you can ignore the point at first and just multiply the digits, because the digits obey the same times-tables you already know; the point is placed afterward by counting how many decimal places the two factors carried together, since tenths times tenths make hundredths. That counting move is the place-the-point idea, and estimation is its safety net: 0.3 × 0.4 is about a third of a bit under a half, clearly small, so the point must sit well to the left. Dividing a decimal by a whole number works the same way — share place by place with the point held straight above the line.',
    script: [
      { say: 'Watch me multiply 0.6 × 7. First I ignore the point and multiply the digits, six times seven, to get forty-two. The two factors carry one decimal place together, so I slide the point over one spot: 4.2.', visual: 'Digits multiply; one place-count slides the point over.' },
      { say: 'Now 4.8 ÷ 6: I share 4.8 into six equal parts, keeping the point straight above the line, and land on 0.8.', visual: 'A decimal shares into six parts; the point stays aligned.' },
      { say: 'Before trusting any answer, I estimate to place the point: 0.3 × 0.4 must be small, well under a half, so it can only be 0.12 — never 1.2 or 12.', visual: 'An estimate rules out the wrong point positions.' },
    ],
    summary: 'Multiply the digits, then place the point by counting the factors\' decimal places — tenths times tenths make hundredths. Divide by a whole by sharing with the point held above. Estimate to place the point.',
    vocabulary: [
      { term: 'decimal places', kidGloss: 'the digits to the right of the point' },
      { term: 'place the point', kidGloss: 'count the factors\' decimal places to position it' },
      { term: 'estimate', kidGloss: 'a rounded check that fixes where the point goes' },
    ],
  },
  guidedExamples: [
    ge(20, 1, 'modeled', '0.6 × 7.', [
      { teacherSay: 'I see a decimal times a whole number, so let me ignore the point first and just multiply the digits: six times seven is forty-two.' },
      { teacherSay: 'The factors carry one decimal place together, so the point slides over one spot — where does it land?', expected: '4.2' },
    ], '4.2'),
    ge(20, 2, 'completion', '0.4 × 0.5.', [
      { teacherSay: 'The digits give four times five, which is twenty. How many decimal places do the two factors carry together?', expected: 'two' },
      { childDo: 'Place the point that many spots in from the right.', expected: '0.2' },
    ], '0.2'),
    ge(20, 3, 'prompted', '5.6 ÷ 8.', [
      { childDo: 'Share with the point held straight above, then check by estimating.', expected: '0.7' },
    ], '0.7'),
    ge(20, 4, 'independent', 'A ribbon costs $1.20 per metre. Buy 3 metres, then split the cost between 2 friends. Solve cold.', [
      { childDo: 'Find the total first, then share it.', expected: '$1.80' },
    ], '$1.80'),
  ],
  days: [
    // Day 1 — concept echo: single-step decimal work, blocked (no interleaving yet)
    [
      { gen: wMul, diff: 2 },
      { gen: wDecAdd, diff: 2 },
      { gen: wDecRound, diff: 2 },
      { gen: sMoneyMul, diff: 2 },
      { gen: sRateMul, diff: 2 },
      { gen: sDecTimesDec, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wDecAdd, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: sDivShare, diff: 3 },
      { gen: sRateBudgetEstimate, diff: 3 },
      { gen: discrimPoint, diff: 3 },
      { gen: sDecTimesDec, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wDecRound, diff: 2 },
      { gen: sMoneyMul, diff: 3 },
      { gen: msCostShare, diff: 3 },
      { gen: msDistance, diff: 3 },
      { gen: discrimPoint, diff: 4 },
      { gen: sRateMul, diff: 3 },
    ],
    // Day 4 — multi-step word problems (2 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msCostShare, diff: 4 },
      { gen: msDistance, diff: 4 },
      { gen: sDivShare, diff: 4 },
      { gen: sRateBudgetEstimate, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaPointDrop, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Use estimation to argue where the decimal point goes in 3.2 × 4, whose digits multiply to 128. Explain your reasoning in writing.',
          value: 'about 3 × 4 is 12, so the answer is 12.8 — never 1.28 or 128',
          acceptableForms: ['12.8', '12', 'estimate'],
          keywords: true,
          hints: ['About how big is 3.2 — closer to 3, or to 4?', 'Which point position lands nearest your estimate?'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain in writing why 0.3 × 0.4 is SMALLER than both 0.3 and 0.4, even though multiplying whole numbers makes them bigger.',
          value: 'multiplying by a number less than 1 takes only part of the amount, so the product shrinks',
          acceptableForms: ['less than 1', 'part', 'shrinks', 'smaller'],
          keywords: true,
          hints: ['Is 0.4 more than one whole, or less than one?', 'Picture taking part of a part — does it grow, or shrink?'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: the product of two numbers that are each less than 1 is itself less than 1. Say how you know in one sentence.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Two factors under one always land the product below one — it cannot climb past either factor.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reads the claim backwards.' },
          ],
          hints: ['If you take part of a part, can the result ever climb past a whole?', 'Picture a fraction of a fraction on a grid.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D20-PZ-01',
    title: 'Puzzle Grove: Place the Point',
    puzzleType: 'estimation',
    prompt: 'Three multiplications use the same digits 3 and 4, giving the digit-answer 12 every time: one is 3 × 4, one is 0.3 × 0.4, and one is 3 × 0.4. Use estimation to place the decimal point in each product, and explain why identical digits land the point in different spots.',
    answer: {
      value: '3 × 4 = 12, 0.3 × 0.4 = 0.12, 3 × 0.4 = 1.2 — the decimal places in the two factors set where the point lands',
      acceptableForms: ['12', '0.12', '1.2'], validation: 'short-text-keyword',
    },
    hintLadder: ['About how big should each product be — near a whole number, near a small piece, or in between?', 'Count the decimal places in the two factors of each.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'estimate-place' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sMoneyMul, diff: 3 },
    { gen: msCostShare, diff: 3 },
    { gen: sRateMul, diff: 3 },
    { gen: msDistance, diff: 3 },
    { gen: sDecTimesDec, diff: 4 },
    { gen: sDivShare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step decimal × whole or × decimal (place-the-point affordance preserved). 02/04: two-step decimal (buy-then-share money / rate-then-add). 06: decimal ÷ whole. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'procedure-slip', subtype: 'point-miscount', description: 'Places the decimal point by counting the wrong number of the factors\' decimal places.', exampleWrongAnswer: '0.7 × 0.6 answered as 4.2', distractorRationale: 'Offer the one-place-off product.', reteachPointer: 'explanation/script[0] (count BOTH factors\' decimal places)' },
    { errorTag: 'concept-misconception', subtype: 'product-should-shrink', description: 'Expects a product to grow even when a factor is less than 1, so drops the point.', exampleWrongAnswer: '0.3 × 0.4 answered as 12', distractorRationale: 'Offer the point-dropped product.', reteachPointer: 'Day-5 reasoning on why multiplying by less than one shrinks the amount' },
    { errorTag: 'representation-misread', subtype: 'quotient-point', description: 'Misplaces the point in a decimal ÷ whole quotient.', exampleWrongAnswer: '4.8 ÷ 6 answered as 8', distractorRationale: 'Offer the point-dropped quotient.', reteachPointer: 'guidedExamples/D20-GE-03 (keep the point held above the line)' },
    { errorTag: 'task-comprehension', subtype: 'cost-context', description: 'Solves only the first step of a money problem, forgetting to share or place the point in the total.', exampleWrongAnswer: 'Buy-then-share answered with the whole bill', distractorRationale: 'Offer the total instead of one person\'s share.', reteachPointer: 'the Day-4 buy-then-share money problem (total first, then divide with the point placed)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying and dividing decimals — multiplying the digits then placing the point by counting decimal places, dividing a decimal by a whole number with the point held above, and using estimation to put the point in the right spot.',
    improvingCandidates: ['placing the decimal point by counting the factors\' places', 'dividing a decimal by a whole number', 'estimating to fix where the point goes'],
    strengtheningByTag: [
      { errorTag: 'procedure-slip', text: 'counting both factors\' decimal places to place the point — the warm-ups reinforce this' },
      { errorTag: 'concept-misconception', text: 'that multiplying by less than 1 SHRINKS the amount, so the point sits far left' },
      { errorTag: 'representation-misread', text: 'placing the point correctly in a division quotient' },
    ],
    homeFocus: {
      praiseLine: 'You estimated first and used that to place the decimal point — reasoning from about-how-big instead of a memorized rule is exactly the move we want.',
      questionForChild: 'The digits of 0.7 × 0.6 are 42 — so where does the point go, and how do you know?',
      schoolSyncHook: 'If your child\'s class leads with estimation or with a place-counting rule, tell us and we will match that approach.',
    },
    vocabularyForParent: ['decimal places (digits right of the point)', 'place the point (count the factors\' places)', 'estimate (a rounded check that fixes the point)'],
  },
});
