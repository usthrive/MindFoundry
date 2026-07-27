/**
 * Level D · Week 19 — "Dividing with unit fractions" (conceptId: dividing-unit-fractions).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten on the D04 exemplar:
 *  - Genuine multi-step word problems via lib/multistep (count-then-share,
 *    count-then-scale); the answer + step-count come from the shipped op-chain.
 *  - A code-generated error-analysis item (multiplied-by-1/d instead of flipping)
 *    whose "wrong" number and true answer are re-derived by QG-11 — fabrication
 *    is impossible.
 *  - Discrimination traps (÷-by-unit-fraction makes MORE; which operation counts
 *    pieces) forcing a CHOICE by Day 3.
 *  - Metacognition (estimate-first) woven into Day 2 AND modeled in the script.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free; each generator reused ≤2×
 *    in the daily core; rung-1 is always an algorithm-free orienting question.
 *  - Distinct proper names drawn fresh per item; no hardcoded name from the pool.
 *
 * conceptualAnchor: the scoop model (fill each whole with the little scoops and
 * count them). No deepeningDelta — no strictly-earlier week shares this family.
 */

import { asWarmup, classify, fracTimesFrac, fracTimesWhole, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { divFrac, formatFrac } from '../lib/compute';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D11 = { level: 'D' as const, week: 11 };
const D18 = { level: 'D' as const, week: 18 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** Two distinct names. */
const two = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

const frac = (n: number, d: number) => `${n}/${d}`;
/** Code-computed answer for the registered d_frac_div_v1 template (never hand-typed). */
const divAns = (n1: number, d1: number, n2: number, d2: number) => formatFrac(divFrac({ n: n1, d: d1 }, { n: n2, d: d2 }));

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wTimesFrac = asWarmup(fracTimesFrac(), D18);
const wTimesWhole = asWarmup(fracTimesWhole(), D11);

// --- Single-step whole ÷ unit-fraction situations (count how many fit) ----------
const sitScoop = situation({
  situationType: 'rate', cognitiveOp: 'frac-divide',
  draw: (r) => {
    const d = r.int(2, 9); const k = r.int(2, 12); const name = r.pick(NAMES);
    return {
      prompt: `${name} empties a ${k}-cup tub of oats using a ${frac(1, d)}-cup scoop. How many scoops does that take?`,
      answerValue: divAns(k, 1, 1, d), templateId: 'd_frac_div_v1', params: { n1: k, d1: 1, n2: 1, d2: d }, units: 'scoops',
      validation: 'equivalent-fraction',
      hints: ['Does a smaller scoop fit more pieces into each cup, or fewer?', 'Count how many scoops fill one whole cup, then repeat for every cup.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const sitCut = situation({
  situationType: 'measurement', cognitiveOp: 'frac-divide',
  draw: (r) => {
    const d = r.int(2, 9); const k = r.int(2, 12); const name = r.pick(NAMES);
    return {
      prompt: `${name} cuts a ${k}-metre rope into ${frac(1, d)}-metre pieces. How many pieces is that?`,
      answerValue: divAns(k, 1, 1, d), templateId: 'd_frac_div_v1', params: { n1: k, d1: 1, n2: 1, d2: d }, units: 'pieces',
      validation: 'equivalent-fraction',
      hints: ['How many small pieces do you picture fitting along the whole rope?', 'Find the pieces in one metre, then scale up to the full length.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const sitGlass = situation({
  situationType: 'measurement', cognitiveOp: 'frac-divide',
  draw: (r) => {
    const d = r.int(2, 9); const k = r.int(2, 12); const name = r.pick(NAMES);
    return {
      prompt: `${name} pours ${k} litres of lemonade into ${frac(1, d)}-litre glasses. How many glasses can be filled?`,
      answerValue: divAns(k, 1, 1, d), templateId: 'd_frac_div_v1', params: { n1: k, d1: 1, n2: 1, d2: d }, units: 'glasses',
      validation: 'equivalent-fraction',
      hints: ['Will one jug pour many small glasses, or only a few?', 'Count the glasses filled by a single litre, then across the whole amount.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// --- Single-step unit-fraction ÷ whole situations (split one piece into shares) --
const sitShare = situation({
  situationType: 'sharing', cognitiveOp: 'frac-divide',
  draw: (r) => {
    const d = r.int(2, 9); const k = r.int(2, 12); const name = r.pick(NAMES);
    return {
      prompt: `${name} shares ${frac(1, d)} litre of paint equally among ${k} pots. How much paint is in each pot?`,
      answerValue: divAns(1, d, k, 1), templateId: 'd_frac_div_v1', params: { n1: 1, d1: d, n2: k, d2: 1 }, units: 'litre',
      validation: 'equivalent-fraction',
      hints: ['Are you counting how many pieces fit, or splitting one piece up?', 'Cut the single piece into that many equal shares and name each one.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const sitSplit = situation({
  situationType: 'sharing', cognitiveOp: 'frac-divide',
  draw: (r) => {
    const d = r.int(2, 9); const k = r.int(2, 12); const name = r.pick(NAMES);
    return {
      prompt: `${name} folds a ${frac(1, d)}-metre ribbon into ${k} equal parts. How long is each part?`,
      answerValue: divAns(1, d, k, 1), templateId: 'd_frac_div_v1', params: { n1: 1, d1: d, n2: k, d2: 1 }, units: 'metre',
      validation: 'equivalent-fraction',
      hints: ['Does sharing one small piece make each part bigger or smaller?', 'Divide the one piece into that many equal shares to name each length.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// Metacognition base: estimate-first wrapper on the scoop-count situation.
const sitScoopEstimate = withEstimateFirst(
  sitScoop,
  'a smaller scoop fills a whole with many little pieces, so the answer should land well above the number of cups.',
);

// --- Multi-step problems (count-then-share; count-per-whole-then-scale) ----------
const msShareOut = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'frac-divide',
  draw: (r) => {
    const d = r.pick([2, 3, 4, 5]); const k = r.int(2, 8);
    const total = k * d;
    const divs: number[] = [];
    for (let x = 2; x < total; x++) if (total % x === 0) divs.push(x);
    const m = r.pick(divs); const [n1, n2] = two(r);
    return {
      prompt: `${n1} pours a ${k}-litre drum of juice with a ${frac(1, d)}-litre cup, then ${n2} shares the cupfuls equally into ${m} jugs. How many cupfuls go in each jug?`,
      initN: k, steps: [{ op: 'div', n: 1, d }, { op: 'div', n: m, d: 1 }], units: 'cupfuls',
      hints: ['Which happens first here — counting the cupfuls, or sharing them out?', 'First count how many cupfuls the drum makes, then split them between the jugs.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msPerBatch = multiStep({
  situationType: 'part-whole', cognitiveOp: 'frac-divide',
  draw: (r) => {
    const d = r.pick([2, 3, 4, 5, 6]); const k = r.int(2, 9); const name = r.pick(NAMES);
    return {
      prompt: `Each pot holds 1 litre of soup and is filled with a ${frac(1, d)}-litre ladle. ${name} fills ${k} identical pots. How many ladles are used in all?`,
      initN: 1, steps: [{ op: 'div', n: 1, d }, { op: 'mul', n: k, d: 1 }], units: 'ladles',
      hints: ['Do you work out one pot first, or all the pots at once?', 'Count the ladles a single pot needs, then multiply across all the pots.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (fixed name-free hints) -------------------------------
const discrimMoreLess = discrimination({
  variant: 'cross-op', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const d = r.int(2, 6); const k = r.int(2, 9);
    return {
      prompt: `A ${frac(1, d)}-cup scoop is used to empty a ${k}-cup tub. Is the number of scoops MORE than ${k}, FEWER than ${k}, or exactly ${k}?`,
      correct: `more than ${k}`,
      distractors: [
        { text: `fewer than ${k}`, errorTag: 'concept-misconception', rationale: 'Expects dividing to shrink the amount, but small scoops mean many fit, so the count grows.' },
        { text: `exactly ${k}`, errorTag: 'task-comprehension', rationale: 'Only true if each scoop were a whole cup; a fraction scoop makes more scoops than cups.' },
      ],
      hints: ['Does a smaller scoop mean you need more scoops, or fewer?', 'Picture how many small scoops fit inside a single cup.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const discrimWhichOp = discrimination({
  variant: 'cross-op', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const d = r.int(2, 6); const k = r.int(2, 9);
    return {
      prompt: `To find how many ${frac(1, d)}-litre glasses a ${k}-litre jug fills, which calculation fits?`,
      correct: `${k} ÷ ${frac(1, d)}`,
      distractors: [
        { text: `${frac(1, d)} ÷ ${k}`, errorTag: 'task-comprehension', rationale: 'Splits one glass among the litres — the reverse of counting how many glasses fit.' },
        { text: `${k} ÷ ${d}`, errorTag: 'concept-misconception', rationale: 'Divides by the bottom number instead of by the whole unit fraction.' },
      ],
      hints: ['Which question are you answering — how many glasses fit, or how big is one share?', 'The words "how many fit" point to the operation that counts pieces.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives the truth) ---------------
// Misconception: forgot to flip — multiplied by 1/d (a÷b) instead of by d (a×b).
const eaMultipliedNotFlipped = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'frac-divide',
  drawParams: (r) => {
    const d = r.pick([2, 3, 4, 5]); const m = r.int(2, 6);
    return { a: d * m, b: d, op: '*', wrongOp: '/' };
  },
  build: (v, p) => ({
    prompt: `A cook needs the number of ${frac(1, Number(p.b))}-cup scoops that fill ${Number(p.a)} cups. Dividing by ${frac(1, Number(p.b))} is the same as multiplying by ${Number(p.b)}, but a student multiplied by ${frac(1, Number(p.b))} instead and wrote ${v.wrong} scoops.`,
    extension: 'Draw the scoops that fit in a single cup to show why the true count is far larger, then write the correct number.',
    hints: ['Does using a smaller scoop give more scoops, or fewer?', 'Count how many small scoops fit in one cup, then across all the cups.'],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
});

export const buildD19 = makeWeekBuilder({
  week: 19,
  conceptId: 'dividing-unit-fractions',
  conceptName: 'Dividing with unit fractions',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D11, D18],
  pedagogyContract: 'v2',
  conceptualAnchor: 'scoop model',
  explanation: {
    hook: 'How many 1/3-cup scoops fill 4 cups? Twelve! Dividing by a small fraction gives a BIG answer, because you are counting how many tiny pieces fit — and lots of tiny pieces fit.',
    whyBeforeHow:
      'Dividing a whole number by a unit fraction asks how many of the small pieces fit inside it, and because each whole holds a full set of those pieces, the count comes out far larger than the whole — that is why the scoop model settles it every time: fill each whole with the little scoops and count them, so dividing by a third lands on three times as many, never fewer. Turned around, a unit fraction divided by a whole splits one small piece into equal shares, so that piece only gets smaller. The scoop model makes both directions visible before any flip-and-multiply rule.',
    script: [
      { say: 'For 4 ÷ 1/3, I fill each of the 4 cups with 1/3-scoops and count: each cup takes 3 scoops, so 4 × 3 = 12 scoops in all.', visual: 'Four bars each cut into thirds; twelve scoops counted.' },
      { say: 'For 1/3 ÷ 4, I cut one third into 4 equal shares; each share is a smaller piece, one twelfth of the whole.', visual: 'One third splits into four twelfth-pieces.' },
      { say: 'Before I compute, I estimate: a smaller scoop must give more scoops, so a sensible answer for whole ÷ unit fraction lands well above the number of wholes — if it came out smaller, I would check again.', visual: 'A rough size check: many little scoops versus a few big cups.' },
    ],
    summary: 'Whole ÷ unit fraction counts how many small pieces fit, giving a bigger number; unit fraction ÷ whole splits one piece into smaller shares. Picture the scoops first, then use flip-and-multiply.',
    vocabulary: [
      { term: 'unit fraction', kidGloss: 'a fraction with 1 on top, like 1/3' },
      { term: 'how many fit', kidGloss: 'the question whole ÷ unit fraction answers' },
      { term: 'scoop model', kidGloss: 'fill each whole with the little scoops and count them' },
    ],
  },
  guidedExamples: [
    ge(19, 1, 'modeled', '5 ÷ 1/2. How many 1/2-cup scoops fill 5 cups?', [
      { teacherSay: 'I notice this asks how many small scoops FIT, not how to share — so let me picture one cup and count the halves inside it first.', expected: '2' },
      { teacherSay: 'Two halves in each cup, and there are five cups, so I count 2, 4, 6, 8, 10 — the scoops stack up past the number of cups.', expected: '10' },
    ], '10'),
    ge(19, 2, 'completion', '1/4 ÷ 3. One quarter-cup of paint is shared equally among 3 jars.', [
      { teacherSay: 'Which is it here — are we counting pieces that fit, or splitting one piece into shares?', expected: 'splitting' },
      { childDo: 'Split one quarter into 3 equal shares and name each share.', expected: '1/12' },
    ], '1/12'),
    ge(19, 3, 'prompted', '6 ÷ 1/3. How many 1/3-cups fill 6 cups?', [
      { childDo: 'Estimate first — should the count be bigger or smaller than 6? Then count the thirds.', expected: '18' },
    ], '18'),
    ge(19, 4, 'independent', '1/5 ÷ 2. Split one fifth into 2 equal shares. Solve cold.', [
      { childDo: 'Name each share of the whole.', expected: '1/10' },
    ], '1/10'),
  ],
  days: [
    // Day 1 — concept echo: single-step both directions, blocked (no interleaving)
    [
      { gen: wMul, diff: 2 },
      { gen: wTimesFrac, diff: 2 },
      { gen: wTimesWhole, diff: 2 },
      { gen: sitScoop, diff: 2 },
      { gen: sitCut, diff: 3 },
      { gen: sitShare, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wMul, diff: 2 },
      { gen: wTimesFrac, diff: 2 },
      { gen: sitScoopEstimate, diff: 3 },
      { gen: discrimMoreLess, diff: 3 },
      { gen: discrimWhichOp, diff: 3 },
      { gen: msShareOut, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wMul, diff: 2 },
      { gen: sitCut, diff: 3 },
      { gen: sitGlass, diff: 3 },
      { gen: sitSplit, diff: 3 },
      { gen: discrimMoreLess, diff: 4 },
      { gen: msPerBatch, diff: 4 },
    ],
    // Day 4 — multi-step word problems (2 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msShareOut, diff: 4 },
      { gen: msPerBatch, diff: 4 },
      { gen: sitShare, diff: 4 },
      { gen: sitGlass, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + story-match + reasoning + classify
    [
      { gen: eaMultipliedNotFlipped, diff: 4 },
      {
        gen: classify({
          prompt: 'Which story matches 4 ÷ 1/3?',
          correct: 'how many 1/3-cup scoops fill 4 cups',
          distractors: [
            { text: 'sharing 4 cups equally among 3 friends', errorTag: 'task-comprehension', rationale: 'That story is 4 ÷ 3 — sharing among 3, not counting thirds.' },
            { text: 'taking 1/3 of 4 cups', errorTag: 'concept-misconception', rationale: 'That is 1/3 × 4, a multiply that makes less, not a divide.' },
          ],
          hints: ['Does dividing by a unit fraction count how many fit, or share into equal groups?', 'Match the words to "how many small pieces fit".'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain, using the words "how many", why 6 ÷ 1/2 gives an answer larger than 6. Then say what the answer is.',
          value: 'it counts how many halves fit in six wholes, and many small halves fit, so the count is twelve',
          acceptableForms: ['how many', 'halves', 'twelve', '12'],
          keywords: true,
          hints: ['How many halves fit inside one whole?', 'Then picture how many fit inside every whole in the problem.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: dividing a whole number by a unit fraction gives an answer larger than that whole number. Say how you know in one sentence.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'A unit fraction is always less than one, so its pieces always number more than the wholes.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reverses the truth — small pieces mean many fit, so the count grows.' },
          ],
          hints: ['Is a unit fraction bigger or smaller than one whole?', 'How many small pieces fit inside each whole?'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D19-PZ-01',
    title: 'Puzzle Grove: The Scoop Ladder',
    puzzleType: 'logic',
    prompt: 'A jar holds 3 cups. Filling it counts twelve scoops with a 1/4-cup scoop. Without dividing all over again, how many scoops would a 1/8-cup scoop take — and explain the pattern when the scoop is cut in half.',
    answer: { value: '24 scoops; halving the scoop doubles the count', acceptableForms: ['24'], validation: 'short-text-keyword' },
    hintLadder: ['If each scoop is half as big, do you need more scoops or fewer?', 'Halving the scoop doubles the number of scoops.'],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sitScoop, diff: 3 },
    { gen: msShareOut, diff: 3 },
    { gen: sitCut, diff: 3 },
    { gen: msPerBatch, diff: 3 },
    { gen: sitShare, diff: 4 },
    { gen: sitGlass, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: whole ÷ unit-fraction count (scoops / rope pieces). 02/04: two-step (count-then-share / count-per-whole-then-scale). 05: unit-fraction ÷ whole split. 06: whole ÷ unit-fraction glasses. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'divide-shrinks', description: 'Expects dividing to always shrink, so multiplies by the unit fraction (or divides by the denominator) and under-counts how many pieces fit.', exampleWrongAnswer: '4 ÷ 1/3 answered as 1 1/3', distractorRationale: 'Offer the multiplied-by-1/d result (too small).', reteachPointer: 'explanation/script[0] (count how many fit)' },
    { errorTag: 'task-comprehension', subtype: 'direction-swap', description: 'Confuses whole ÷ fraction with fraction ÷ whole (matches the wrong story).', exampleWrongAnswer: '1/3 ÷ 4 answered as 12', distractorRationale: 'Offer the other-direction answer.', reteachPointer: 'Day-5 story-match (match the story to how-many-fit)' },
    { errorTag: 'procedure-slip', subtype: 'flip-slip', description: 'Chooses the right idea but flips the wrong number, or forgets to flip when applying the rule.', exampleWrongAnswer: '5 ÷ 1/2 answered as 2.5', distractorRationale: 'Offer the un-flipped result.', reteachPointer: 'guidedExamples/D19-GE-01 (count, then the rule)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Dividing with unit fractions — counting how many small pieces fit into a whole (whole ÷ unit fraction gives a big answer) and splitting one piece into equal shares (unit fraction ÷ whole gives a smaller piece), using the scoop model before the flip-and-multiply rule.',
    improvingCandidates: ['counting how many unit-fraction pieces fit', 'splitting a piece into equal shares', 'matching a story to a fraction division'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'that dividing by a small fraction gives a BIG answer — the scoop-counting warm-ups build this' },
      { errorTag: 'task-comprehension', text: 'keeping whole ÷ fraction and fraction ÷ whole straight' },
      { errorTag: 'procedure-slip', text: 'flipping the right number when using the rule' },
    ],
    homeFocus: {
      praiseLine: 'You counted how many 1/3-cup scoops fill a whole cup and saw the total climb past the number of cups — that picture is the whole idea.',
      questionForChild: 'How many 1/2-cup scoops empty a 3-cup jar — and why is the answer bigger than 3?',
      schoolSyncHook: 'If your child\'s class uses measuring-cup or number-line models, tell us and we will feature them.',
    },
    vocabularyForParent: ['unit fraction (1 on top, like 1/3)', 'how many fit (whole ÷ unit fraction)', 'flip/reciprocal (to divide by a fraction)'],
  },
});
