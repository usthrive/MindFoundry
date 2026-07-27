/**
 * Level D · Week 4 — "Multiplicative comparison" (conceptId: multiplicative-comparison).
 *
 * v2 PEDAGOGY EXEMPLAR (CONTENT-GENERATOR-FIX-SPEC). The reference rewrite that
 * proves the 13 pedagogical gates + QG-11 and cleared the authenticity gate at
 * weighted-mean 4.21 / depth 4.2 (ACCEPT, adversarially confirmed).
 *
 * Authoring patterns the fan-out copies from here:
 *  - Genuine multi-step word problems via lib/multistep (mul→add, mul→sub,
 *    divide→add); the answer + step-count come from the shipped op-chain.
 *  - A code-generated error-analysis item (add-instead-of-multiply) whose "wrong"
 *    number and true answer are re-derived by QG-11 — fabrication is impossible.
 *  - Discrimination traps (add-vs-multiply) forcing an operation CHOICE by Day 3.
 *  - Metacognition woven into Day 2 AND modeled in the explanation script.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free (so the dedup gate is
 *    deterministic across all learner seeds); each generator reused ≤ 2× in core.
 *  - Distinct proper names drawn fresh per item — never a hardcoded name that is
 *    also in the draw pool (that produced a self-referential clause at some seeds).
 */

import { addWhole, asWarmup, classify, multipleFill, multiply, reasoning, subWhole } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D3 = { level: 'D' as const, week: 3 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** Two distinct names. */
const two = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 2) as [string, string];
/** Three distinct names (anchor + two comparators). */
const three = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 3) as [string, string, string];

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wSub = asWarmup(subWhole(1200, 88000), D2);
const wMultiple = asWarmup(multipleFill(), D3);

// --- Single-step comparison situations (fixed, role-based, name-free hints) ------
const cmpObjects = situation({
  situationType: 'comparison', cognitiveOp: 'mul-compare',
  draw: (r) => {
    const a = r.int(4, 40); const k = r.int(2, 8);
    const thing = r.pick(['stickers', 'marbles', 'coins', 'shells', 'cards', 'stamps', 'beads']);
    const [n1, n2] = two(r);
    return {
      prompt: `${n1} has ${a} ${thing}. ${n2} has ${k} times as many ${thing} as ${n1}. How many ${thing} does ${n2} have?`,
      answerValue: String(a * k), templateId: 'd_mul_v1', params: { a, b: k }, units: thing,
      hints: ['Does "times as many" copy the first amount, or just add a few to it?', 'Picture the first bar, then that many copies for the second person.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const cmpDistance = situation({
  situationType: 'comparison', cognitiveOp: 'mul-compare',
  draw: (r) => {
    const a = r.int(3, 25); const k = r.int(2, 7); const name = r.pick(NAMES);
    return {
      prompt: `A short trail is ${a} km. ${name}'s long trail is ${k} times as long. How long is ${name}'s trail?`,
      answerValue: String(a * k), templateId: 'd_mul_v1', params: { a, b: k }, units: 'km',
      hints: ['Is "times as long" a copy word, or an add word?', 'Lay the short length down as many times as the problem says.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const cmpBuilding = situation({
  situationType: 'measurement', cognitiveOp: 'mul-compare',
  draw: (r) => {
    const a = r.int(3, 20); const k = r.int(2, 6); const name = r.pick(NAMES);
    return {
      prompt: `A small tower is ${a} m tall. ${name} builds one ${k} times as tall. How tall is ${name}'s tower?`,
      answerValue: String(a * k), templateId: 'd_mul_v1', params: { a, b: k }, units: 'm',
      hints: ['Does "times as tall" stack whole copies of the height, or add a little?', 'Picture the short height repeated that many times.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// Metacognition base: a price/rate comparison, only ever served through the estimate wrapper.
const cmpMoney = situation({
  situationType: 'rate', cognitiveOp: 'mul-compare',
  draw: (r) => {
    const a = r.int(3, 30); const k = r.int(2, 6); const item = r.pick(['a kite', 'a book', 'a game', 'a plant', 'a mug']);
    const name = r.pick(NAMES);
    return {
      prompt: `${item[0].toUpperCase() + item.slice(1)} costs $${a}. ${name}'s bike costs ${k} times as much. How much does the bike cost?`,
      answerValue: String(a * k), templateId: 'd_mul_v1', params: { a, b: k }, units: 'dollars',
      acceptableForms: [`$${a * k}`],
      hints: ['Does "times as much" scale the price up in copies, or add to it?', 'Stack the base price that many times over.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const cmpEstimate = withEstimateFirst(cmpMoney, 'times-as-much stacks whole copies of the price, so the answer should land well above the base cost.');

// --- Multi-step comparison problems --------------------------------------------
const msTogether = multiStep({
  situationType: 'combine', cognitiveOp: 'mul-compare',
  draw: (r) => {
    const a = r.int(4, 15); const k = r.int(2, 6);
    const thing = r.pick(['books', 'apples', 'pencils', 'blocks', 'tickets']); const [n1, n2] = two(r);
    return {
      prompt: `${n1} has ${a} ${thing}. ${n2} has ${k} times as many. How many ${thing} do ${n1} and ${n2} have ALTOGETHER?`,
      initN: a, steps: [{ op: 'mul', n: k, d: 1 }, { op: 'add', n: a, d: 1 }], units: thing,
      hints: ['Does the question ask for one person\'s pile, or both piles together?', 'Find the scaled amount first, then combine it with the starting amount.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msLonger = multiStep({
  situationType: 'measurement', cognitiveOp: 'mul-compare',
  draw: (r) => {
    const a = r.int(4, 14); const k = r.int(2, 6); const name = r.pick(NAMES);
    return {
      prompt: `A blue ribbon is ${a} cm. ${name}'s red ribbon is ${k} times as long. How much LONGER is the red ribbon than the blue one?`,
      initN: a, steps: [{ op: 'mul', n: k, d: 1 }, { op: 'sub', n: a, d: 1 }], units: 'cm',
      hints: ['Are you finding the long length itself, or the GAP between the two?', 'Scale the short length up first, then compare the two.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msPartWhole = multiStep({
  situationType: 'part-whole', cognitiveOp: 'mul-compare', usesPriorSkill: true,
  draw: (r) => {
    const k = r.int(2, 5); const small = r.int(3, 9); const total = small * k; const [n1, n2] = two(r);
    return {
      prompt: `${n1} has ${total} cards, which is ${k} times as many as ${n2}. How many cards do ${n1} and ${n2} have together?`,
      initN: total, steps: [{ op: 'div', n: k, d: 1 }, { op: 'add', n: total, d: 1 }], units: 'cards',
      hints: ['Is the smaller amount found by scaling up, or by sharing back down?', 'Undo the copies to find the smaller amount, then add the two.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Discrimination traps (add-vs-multiply; fixed name-free hints) --------------
const discrimValue = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const a = r.int(3, 9); const k = r.int(2, 6); const [n1, n2] = two(r);
    return {
      prompt: `${n1} has ${a} marbles. ${n2} has ${k} times as many. Which number is ${n2}'s amount?`,
      correct: String(a * k),
      distractors: [
        { text: String(a + k), errorTag: 'task-comprehension', rationale: `Added the two numbers — that is a "more than" move, not "times as many".` },
        { text: String(a), errorTag: 'concept-misconception', rationale: 'Left the amount unchanged, ignoring the scaling.' },
      ],
      hints: ['Does "times as many" add the two numbers, or copy the first amount?', 'Picture one bar, then the copies beside it.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const discrimPhrase = discrimination({
  variant: 'structural', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const a = r.int(4, 9); const k = r.int(2, 6);
    // Three DISTINCT names — anchor must not collide with either comparator.
    const [anchor, n1, n2] = three(r);
    return {
      prompt: `${anchor} has ${a}. ${n1} has ${k} times as many as ${anchor}; ${n2} has ${k} more than ${anchor}. Who ends up with more, ${n1} or ${n2}?`,
      correct: n1, correctForms: ['the one with times as many'],
      distractors: [
        { text: n2, errorTag: 'concept-misconception', rationale: 'Reads "times as many" as if it were "more than" — copies far outgrow a small addition.' },
        { text: 'they are equal', errorTag: 'task-comprehension', rationale: 'Treats scaling and adding as the same move.' },
      ],
      hints: ['Which grows an amount faster — copying it, or adding a few to it?', 'Picture the copies next to one bar with a small piece added.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives the truth) --------------
const eaAddInsteadOfMultiply = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'mul-compare',
  drawParams: (r) => ({ a: r.int(4, 9), b: r.int(3, 6), op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A student read "Mia has ${p.b} times as many stamps as Jo, who has ${p.a}" and wrote that Mia has ${v.wrong} stamps.`,
    extension: 'Show with a bar picture why that answer is wrong, then write the true number.',
    hints: ['Does "times as many" tell you to add the two numbers, or to copy the first amount?', 'Draw the first bar, then the copies — count what it really makes.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }),
});

export const buildD04 = makeWeekBuilder({
  week: 4,
  conceptId: 'multiplicative-comparison',
  conceptName: 'Multiplicative comparison',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D2, D3],
  pedagogyContract: 'v2',
  conceptualAnchor: 'bar model',
  explanation: {
    hook: '"3 more than 6" and "3 times as many as 6" sound like cousins — but one lands on 9 and the other on 18. This week we catch that difference before it catches us.',
    whyBeforeHow:
      'A multiplicative comparison scales one amount into a whole number of copies, so "times as many" is a multiply and not an add — that is why a bar model settles it every time: draw one bar for the first amount, then repeat the whole bar that many times, and the copies are impossible to miss. "More than" only stretches a single bar by a little; "times as many" stacks whole bars, which is a far bigger jump.',
    script: [
      { say: 'Watch: Maya\'s bar shows her amount. "Ben has 3 times as many" means I copy Maya\'s whole bar three times — one, two, three. Three copies is a multiply.', visual: 'One short bar; three identical bars stack beside it.' },
      { say: '"3 more than Maya" is a different picture: keep Maya\'s one bar and add a small piece. Same word "three", very different bars.', visual: 'A single bar with a small +3 tail.' },
      { say: 'Before you compute, estimate: "times as many" always makes the amount grow by whole copies, so a sensible answer is clearly bigger — if it barely changed, you probably added by mistake.', visual: 'Benchmark: one bar vs several stacked bars, the gap obvious.' },
    ],
    summary: '"Times as many" copies an amount (multiply); "more than" adds a difference (add). Draw the bars, estimate the size, then compute.',
    vocabulary: [
      { term: 'times as many', kidGloss: 'that many whole copies of the amount (multiply)' },
      { term: 'more than', kidGloss: 'a small difference added on top (add)' },
      { term: 'bar model', kidGloss: 'side-by-side bars that show the comparison' },
    ],
  },
  guidedExamples: [
    ge(4, 1, 'modeled', 'Maya read 6 books. Leo read 4 times as many. How many did Leo read?', [
      { teacherSay: 'I see "times as many" — that is a copy word, not a sum word, so I know I will multiply, not add. Let me picture Maya\'s 6 as one bar.' },
      { teacherSay: 'Four copies of 6: watch me count 6, 12, 18, 24 as the bar stacks four times.', expected: '24' },
    ], '24'),
    ge(4, 2, 'completion', 'A ribbon is 8 m. A second ribbon is 5 times as long. How long is the second ribbon?', [
      { teacherSay: 'Which operation does "times as long" signal — add or multiply?', expected: 'multiply' },
      { childDo: 'Scale 8 by 5.', expected: '40' },
    ], '40 m'),
    ge(4, 3, 'prompted', 'Ben has 7 stickers. Ria has 6 times as many. How many does Ria have?', [
      { childDo: 'Estimate first, then multiply the copies.', expected: '42' },
    ], '42'),
    ge(4, 4, 'independent', 'Sam has 9 marbles. Pia has 3 times as many, then finds 4 more. How many does Pia have? Solve cold.', [
      { childDo: 'Copies first, then the extra.', expected: '31' },
    ], '31'),
  ],
  days: [
    // Day 1 — concept echo: single-step scaling only, blocked (no premature interleaving)
    [
      { gen: wMulFact, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: wMultiple, diff: 2 },
      { gen: cmpObjects, diff: 2 },
      { gen: cmpDistance, diff: 3 },
      { gen: cmpBuilding, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wSub, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: cmpEstimate, diff: 3 },
      { gen: discrimPhrase, diff: 3 },
      { gen: msTogether, diff: 3 },
      { gen: discrimValue, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wMulFact, diff: 2 },
      { gen: cmpObjects, diff: 3 },
      { gen: cmpBuilding, diff: 3 },
      { gen: msLonger, diff: 3 },
      { gen: discrimPhrase, diff: 4 },
      { gen: discrimValue, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msTogether, diff: 4 },
      { gen: msLonger, diff: 4 },
      { gen: msPartWhole, diff: 5 },
      { gen: cmpDistance, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaAddInsteadOfMultiply, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Ava has 5 marbles. Write ONE "more than" sentence and ONE "times as many" sentence about Ben, solve both, and explain in writing why the answers differ.',
          value: 'more-than adds a small difference; times-as-many multiplies into whole copies, so the totals differ',
          acceptableForms: ['more than', 'times as many', 'multiply', 'add'],
          keywords: true,
          hints: ['Which of your two sentences copies the amount, and which just adds to it?', 'Compare the two bar pictures side by side.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: "twice as tall" means the height doubled. In one sentence, say how you know.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Hedges on a fixed definition — "twice" always means exactly two copies.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reads the claim backwards.' },
          ],
          hints: ['What exact number of copies does "twice" stand for?', 'Picture one bar, then a second identical bar.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D4-PZ-01',
    title: 'Puzzle Grove: The Marble Chain',
    puzzleType: 'logic',
    prompt: 'Ada, Bea, and Cid. Bea has 3 times as many marbles as Ada. Cid has 5 more than Bea. Bea has 12 marbles. How many does Ada have, and how many does Cid have?',
    answer: { value: 'Ada 4, Cid 17', acceptableForms: ['Ada 4', 'Cid 17', '4 and 17'], validation: 'short-text-keyword' },
    hintLadder: ['Which of Bea\'s clues UNDOES a scaling, and which just adds?', 'Undo Bea\'s copies to reach Ada; add to Bea to reach Cid.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: cmpObjects, diff: 3 },
    { gen: msTogether, diff: 3 },
    { gen: cmpDistance, diff: 3 },
    { gen: msLonger, diff: 3 },
    { gen: cmpBuilding, diff: 4 },
    { gen: msPartWhole, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step "times as many" comparison (scaling affordance preserved). 02/04/06: two-step comparison (scale then combine / compare / undo-and-add). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'task-comprehension', subtype: 'more-vs-times', description: 'Reads "times as many" as "more than" and adds instead of scaling (or the reverse).', exampleWrongAnswer: 'Mia has 3 times as many as 6 answered as 9', distractorRationale: 'Offer the add-instead-of-multiply result.', reteachPointer: 'explanation/script[1] (two very different bars)' },
    { errorTag: 'concept-misconception', subtype: 'compare-direction', description: 'Multiplies the wrong quantity, or forgets to undo the scaling when the smaller amount is unknown.', exampleWrongAnswer: '"12 is 3 times Pia" answered as 36', distractorRationale: 'Offer the multiply-instead-of-divide result.', reteachPointer: 'explanation/script[0] (copies as a multiply) then the Day-4 part-whole problem, which UNDOES the scaling by dividing to find the smaller amount' },
    { errorTag: 'procedure-slip', subtype: 'scaling-fact-slip', description: 'Chooses the right operation but slips on the multiplication fact.', exampleWrongAnswer: '7 times as many as 6 answered as 48', distractorRationale: 'Offer an adjacent product.', reteachPointer: 'guidedExamples/D4-GE-01 (the fact check inside the copies model), then the 60-second multiplication-fact refresh (sprint pool)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplicative comparison — telling "times as many" (whole copies, a multiply) apart from "more than" (a small difference, an add), using side-by-side bar models and estimate-first checks.',
    improvingCandidates: ['spotting the "times as many" signal and multiplying', 'drawing comparison bar models', 'undoing a scaling by dividing to find the smaller amount'],
    strengtheningByTag: [
      { errorTag: 'task-comprehension', text: 'keeping "times as many" and "more than" apart — the bar-model warm-ups make the difference visible' },
      { errorTag: 'concept-misconception', text: 'choosing multiply or divide by which amount is the unknown one' },
      { errorTag: 'procedure-slip', text: 'the multiplication fact once the operation is chosen — the sprints keep facts sharp' },
    ],
    homeFocus: {
      praiseLine: 'You drew the two bars and saw at a glance that "3 times as many" stacks whole copies while "more than" adds only a little — that picture is the whole skill.',
      questionForChild: 'If Sam has 12 and that is 3 times what Pia has, how many does Pia have — and did you multiply or divide to find it?',
      schoolSyncHook: 'If your child\'s class draws bar/tape models a certain way, tell us and we will match the style.',
    },
    vocabularyForParent: ['times as many (whole copies — multiply)', 'more than (a small difference — add)', 'bar model (side-by-side comparison)'],
  },
});
