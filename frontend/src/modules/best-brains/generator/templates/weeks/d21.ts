/**
 * Level D · Week 21 — "Order of operations & expressions"
 * (conceptId: order-of-operations-expressions).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC), authored on the proven D4
 * shape. Operation-family concept → the conceptual anchor is GROUPING: what sits
 * inside a grouping (a product, or a parenthesised sum) is settled first.
 *
 * Authoring patterns copied from d04.ts:
 *  - Genuine multi-step word problems via lib/multistep — each evaluates a
 *    two-operation expression (product THEN sum) over one real context; the
 *    answer + step-count come from the shipped op-chain, never hand-typed. Four
 *    distinct situation families (combine / area / measurement / part-whole).
 *  - A code-generated error-analysis item (× read as +) whose shown "wrong"
 *    number and true value are re-derived by QG-11 — fabrication is impossible.
 *  - Discrimination traps forcing an operation-ORDER choice (× before + vs
 *    left-to-right) and a structure choice ("less than the product" phrasing).
 *  - Metacognition (estimate-first) woven into Day 2 core AND the explanation.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free / number-free (rung-1 an
 *    algorithm-free orienting question); each generator reused ≤ 2× in daily core.
 *  - Library evalExpr/writeExprChoice reused through a thin `withHints` wrapper so
 *    every core rung-1 is orienting (the library's own rung-1 is algorithmic).
 */

import { addWhole, asWarmup, classify, evalExpr, multiply, reasoning, writeExprChoice, type ItemGen } from '../lib/items';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D5 = { level: 'D' as const, week: 5 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

/** Reuse a library generator with a fixed, role-based, orienting hint ladder. */
const withHints = (base: ItemGen, hints: [string, string]): ItemGen =>
  (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: hints });

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wArea = asWarmup(multiply(11, 49, 3, 9), D5);

// --- Single-step expression evaluation (concept echo) ---------------------------
const evalNoParen = withHints(evalExpr(false), [
  'Which operation here outranks the other — the × or the +?',
  'Multiplication is settled before addition, so find the product first, then add the remaining number.',
]);

const evalParen = withHints(evalExpr(true), [
  'What do the parentheses tell you to handle first?',
  'Do the grouped sum inside the brackets, then multiply that total.',
]);

const writeExpr = withHints(writeExprChoice(), [
  'Does "twice" double the whole sum, or only one number inside it?',
  'Group the whole sum first, then multiply the group by two.',
]);

// Metacognition base: estimate-first around a grouped evaluation (own hint ladder,
// distinct from evalParen so the seed-invariant dedup keeps them separate).
const evalParenMetaBase = withHints(evalExpr(true), [
  'Before you compute, will grouping the sum first make the answer bigger or smaller than the numbers you started with?',
  'Do the grouped sum, then multiply — then compare the size against your estimate.',
]);
const evalParenMeta = withEstimateFirst(
  evalParenMetaBase,
  'grouping the sum first and then multiplying builds whole copies of that total, so the answer should land well above either starting number.',
);

// --- Multi-step expression word problems (product THEN sum) --------------------
// Each states the MULTIPLIED quantity first, so initN matches the prompt's first
// number and the folded chain evaluates the expression correctly (× before +).
const msTickets = multiStep({
  situationType: 'combine', cognitiveOp: 'eval-expr',
  draw: (r) => {
    const p = r.int(6, 15); const q = r.int(2, 6); const c = r.int(5, 20);
    return {
      prompt: `Each movie ticket costs ${p} dollars. A family buys ${q} tickets, then adds one snack combo for ${c} dollars. Write the total as one expression and find its value in dollars.`,
      initN: p, steps: [{ op: 'mul', n: q, d: 1 }, { op: 'add', n: c, d: 1 }], units: 'dollars',
      hints: ['Which costs get multiplied together before anything is added on?', 'Find the ticket total first (price × count), then add the one combo.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msGarden = multiStep({
  situationType: 'area', cognitiveOp: 'eval-expr',
  draw: (r) => {
    const rows = r.int(3, 9); const plants = r.int(4, 12); const pot = r.int(2, 15);
    return {
      prompt: `A garden has ${rows} rows with ${plants} plants in each row, plus ${pot} plants in a pot. Write one expression for the total number of plants and evaluate it.`,
      initN: rows, steps: [{ op: 'mul', n: plants, d: 1 }, { op: 'add', n: pot, d: 1 }], units: 'plants',
      hints: ['Do you count the rows of plants before or after adding the pot?', 'Multiply rows by plants per row first, then add the extra pot.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msLaps = multiStep({
  situationType: 'measurement', cognitiveOp: 'eval-expr',
  draw: (r) => {
    const laps = r.int(3, 8); const len = r.int(8, 25); const cool = r.int(10, 50); const name = r.pick(NAMES);
    return {
      prompt: `${name} runs ${laps} laps of ${len} metres each, then walks ${cool} metres to cool down. Write one expression for the total distance and find it in metres.`,
      initN: laps, steps: [{ op: 'mul', n: len, d: 1 }, { op: 'add', n: cool, d: 1 }], units: 'metres',
      hints: ['Which distances multiply, and which one only adds on at the end?', 'Get the running distance (laps × length) first, then add the cool-down walk.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msSnacks = multiStep({
  situationType: 'part-whole', cognitiveOp: 'eval-expr',
  draw: (r) => {
    const boxes = r.int(3, 9); const crayons = r.int(4, 12); const loose = r.int(2, 15);
    return {
      prompt: `A shelf holds ${boxes} boxes of ${crayons} crayons, with ${loose} loose crayons on top. Write one expression for the total number of crayons and evaluate it.`,
      initN: boxes, steps: [{ op: 'mul', n: crayons, d: 1 }, { op: 'add', n: loose, d: 1 }], units: 'crayons',
      hints: ['Are the crayons inside the boxes found by multiplying or by adding?', 'Multiply boxes by crayons per box first, then add the loose ones on top.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps ------------------------------------------------------
// Cross-op: which value does an add-then-times expression really have?
const discrimOrder = discrimination({
  variant: 'cross-op', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const a = r.int(2, 9); const b = r.int(2, 9); const c = r.int(2, 9);
    return {
      prompt: `Following the order of operations, what is the value of ${a} + ${b} × ${c}?`,
      correct: String(a + b * c),
      distractors: [
        { text: String((a + b) * c), errorTag: 'procedure-slip', rationale: 'Worked strictly left to right — added before multiplying, though × outranks +.' },
        { text: String(a + b + c), errorTag: 'concept-misconception', rationale: 'Added every number and ignored the multiplication sign entirely.' },
      ],
      hints: ['Which operation in this expression has to be done first?', 'Multiply before you add — settle the product, then add the remaining number.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// Structural: translate a "less than the product" phrase — order and grouping.
const discrimPhrase = discrimination({
  variant: 'structural', cognitiveOp: 'write-expr',
  draw: (r) => {
    const a = r.int(2, 9); const b = r.int(2, 9); const c = r.int(2, 9);
    return {
      prompt: `Which expression means "${a} less than the product of ${b} and ${c}"?`,
      correct: `${b} × ${c} − ${a}`,
      distractors: [
        { text: `${a} − ${b} × ${c}`, errorTag: 'task-comprehension', rationale: '"less than" reverses the order — it is the product minus the amount, not the amount minus the product.' },
        { text: `(${b} + ${c}) − ${a}`, errorTag: 'representation-misread', rationale: 'Used the sum of the two numbers instead of their product.' },
      ],
      hints: ['Does "less than" subtract from the product, or from the smaller number?', 'Build the product first, then take the "less than" amount away from it.'],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives correct + the shown wrong)
// The disputed quantity is the product that order-of-operations does FIRST; the
// student ignored ×-first and added those two numbers instead.
const eaOrderOfOps = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'eval-expr',
  drawParams: (r) => ({ a: r.int(3, 9), b: r.int(2, 9), op: '*', wrongOp: '+' }),
  build: (v, p, r) => {
    const lead = r.int(2, 9);
    return {
      prompt: `A student evaluated ${lead} + ${p.a} × ${p.b}. The order of operations says the product ${p.a} × ${p.b} is settled first — but, ignoring that × outranks +, the student added those two numbers instead and wrote ${p.a} × ${p.b} = ${v.wrong}.`,
      extension: `Explain why ${p.a} × ${p.b} must be worked as a product before the addition, and give its correct value.`,
      hints: ['Which sign, × or +, tells you to work that part first?', 'A product means equal groups — multiply the two numbers, do not add them.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

export const buildD21 = makeWeekBuilder({
  week: 21,
  conceptId: 'order-of-operations-expressions',
  conceptName: 'Order of operations & expressions',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D2, D5],
  pedagogyContract: 'v2',
  conceptualAnchor: 'grouping',
  explanation: {
    hook: '3 + 4 × 2 is 11, not 14 — the × goes before the +. Math has traffic rules so one written expression means exactly one thing to everyone, and parentheses are the override that lets you change the order on purpose.',
    whyBeforeHow:
      'Order of operations is a shared agreement, and it exists because one written expression must mean exactly one thing to everyone — that is why multiplication and division are settled before addition and subtraction, working left to right within a level. Grouping with parentheses is the deliberate override: whatever sits inside a grouping is done first, so writing "(3 + 4) × 2" forces the addition ahead of the multiply. Writing an expression from words is the reverse move — "twice the sum of 3 and 5" groups the sum, then doubles it: 2 × (3 + 5).',
    script: [
      { say: 'Watch 3 + 4 × 2: I do the multiplication first because × outranks +, so 4 × 2 = 8, and only then 3 + 8 = 11 — not straight left to right.', visual: 'The × step highlights, then the + step.' },
      { say: 'Parentheses are a grouping I can add on purpose: (3 + 4) × 2 forces the add first, giving 7, then × 2 = 14. Same digits, the grouping changed the value.', visual: 'The parentheses glow; the add happens inside first.' },
      { say: 'Before computing, estimate: grouping a sum before multiplying makes the answer clearly larger, so check that your result lands well above either number — if it barely moved, you probably added when you should have multiplied.', visual: 'A rough benchmark: grouped-then-times towers over the plain sum.' },
    ],
    summary: 'Follow the order: parentheses, then × and ÷, then + and −, left to right. Grouping changes the order on purpose; translate "sum/product" phrases into grouped expressions.',
    vocabulary: [
      { term: 'order of operations', kidGloss: 'the agreed order for doing a calculation' },
      { term: 'grouping (parentheses)', kidGloss: 'work packed together that must be done first' },
      { term: 'expression', kidGloss: 'a math phrase with numbers and operations, no equals sign' },
    ],
  },
  guidedExamples: [
    ge(21, 1, 'modeled', 'Evaluate 5 + 6 × 3.', [
      { teacherSay: 'Let me look before I leap: I see a + and a ×, and the order of operations tells me the × outranks the +, so I must settle 6 × 3 first — I cannot just sweep left to right.' },
      { teacherSay: 'So watch: 6 × 3 = 18, and now the expression is really 5 + 18. Do I add now? Yes — 5 + 18 = 23.', expected: '23' },
    ], '23'),
    ge(21, 2, 'completion', 'Evaluate (5 + 6) × 3.', [
      { teacherSay: 'What does the grouping tell me to do first?', expected: 'add 5 + 6' },
      { childDo: 'Finish by multiplying that total by 3.', expected: '33' },
    ], '33'),
    ge(21, 3, 'prompted', 'Write "three times the sum of 4 and 2" as an expression, then evaluate.', [
      { childDo: 'Group the whole sum first, then multiply the group by three.', expected: '3 × (4 + 2) = 18' },
    ], '18'),
    ge(21, 4, 'independent', 'Evaluate 20 − 4 × 3, then check it against a quick estimate. Solve cold.', [
      { childDo: 'Product first, then subtract; estimate to confirm the size.', expected: '8' },
    ], '8'),
  ],
  days: [
    // Day 1 — concept echo: single-step expression evaluation only (no interleaving)
    [
      { gen: wMul, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: evalNoParen, diff: 2 },
      { gen: evalParen, diff: 3 },
      { gen: writeExpr, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination enter
    [
      { gen: wAdd, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: evalParenMeta, diff: 3 },
      { gen: discrimOrder, diff: 3 },
      { gen: evalNoParen, diff: 3 },
      { gen: writeExpr, diff: 4 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wMul, diff: 2 },
      { gen: discrimPhrase, diff: 3 },
      { gen: discrimOrder, diff: 3 },
      { gen: msTickets, diff: 3 },
      { gen: msGarden, diff: 4 },
      { gen: evalParen, diff: 4 },
    ],
    // Day 4 — multi-step expression word problems (all multi-step; 4 situation types)
    [
      { gen: msTickets, diff: 4 },
      { gen: msGarden, diff: 4 },
      { gen: msLaps, diff: 5 },
      { gen: msSnacks, diff: 5 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaOrderOfOps, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Insert one pair of parentheses into 2 + 3 × 4 so the expression equals 20. Write the parenthesized expression and explain in words why the parentheses change its value.',
          value: '(2 + 3) × 4 = 20',
          acceptableForms: ['(2 + 3) × 4', '(2+3)×4', '(2 + 3)'],
          keywords: true,
          hints: ['Which operation do you need to force to happen first to reach the target?', 'Wrap the addition so it is done before the multiply.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: adding a pair of parentheses to an expression changes its value. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Parentheses around work that was already going first (like a product) leave the value unchanged.' },
            { text: 'never', errorTag: 'procedure-slip', rationale: 'Ignores that grouping can force a lower-priority operation to happen first and change the result.' },
          ],
          hints: ['Does grouping matter when it wraps the operation that was already going first?', 'Compare a grouped sum-times-a-number with the same sum left ungrouped.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D21-PZ-01',
    title: 'Puzzle Grove: The Parenthesis Switch',
    puzzleType: 'logic',
    prompt: 'You may insert ONE pair of parentheses into 4 + 6 × 2 — or leave it as is. Make the LARGEST value you can and the SMALLEST value you can. Show each expression and its result.',
    answer: { value: 'largest (4 + 6) × 2 = 20; smallest 4 + 6 × 2 = 16', acceptableForms: ['20', '16', '(4 + 6) × 2'], validation: 'short-text-keyword' },
    hintLadder: ['Which placement of parentheses forces the addition to happen first?', 'Compare the value with the brackets to the value without them.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: evalNoParen, diff: 3 },
    { gen: msTickets, diff: 3 },
    { gen: evalParen, diff: 3 },
    { gen: msGarden, diff: 3 },
    { gen: writeExpr, diff: 4 },
    { gen: msLaps, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step expression work (evaluate × before +, evaluate a grouping, translate a "sum" phrase). 02/04/06: two-step expression word problems (product THEN sum). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'procedure-slip', subtype: 'left-to-right', description: 'Evaluates strictly left to right, ignoring that × and ÷ are settled before + and −.', exampleWrongAnswer: '3 + 4 × 2 → 14', distractorRationale: 'Offer the left-to-right result.', reteachPointer: 'explanation/script[0] (× before +)' },
    { errorTag: 'concept-misconception', subtype: 'ignore-grouping', description: 'Skips or misreads the parentheses that deliberately change the order.', exampleWrongAnswer: '(5 + 6) × 3 → 23', distractorRationale: 'Offer the no-parentheses result.', reteachPointer: 'guidedExamples/D21-GE-02 (grouping settled first)' },
    { errorTag: 'task-comprehension', subtype: 'phrase-order', description: 'Reverses a "less than / from" phrase when translating words into an expression.', exampleWrongAnswer: '"5 less than the product" → 5 − product', distractorRationale: 'Offer the reversed-order expression.', reteachPointer: 'Day-3 discrimination (product minus the amount)' },
    { errorTag: 'representation-misread', subtype: 'grouping-scope', description: 'Groups the wrong part — uses a sum where a product is meant, or doubles one part instead of the whole sum.', exampleWrongAnswer: '"twice the sum of 3 and 5" → 2 × 3 + 5', distractorRationale: 'Offer the mis-grouped expression.', reteachPointer: 'writeExpr (group the whole sum)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Order of operations and expressions — following the agreed order (parentheses/grouping first, then × and ÷, then + and −), using grouping to change the order on purpose, and translating word phrases into grouped expressions.',
    improvingCandidates: ['doing × and ÷ before + and −', 'evaluating a grouping first', 'writing a two-operation expression from a word phrase and evaluating it'],
    strengtheningByTag: [
      { errorTag: 'procedure-slip', text: 'the priority of × and ÷ over + and − — the warm-ups keep it automatic' },
      { errorTag: 'concept-misconception', text: 'honoring the grouping that changes the order' },
      { errorTag: 'task-comprehension', text: 'reading "less than / from" phrases in the right order' },
      { errorTag: 'representation-misread', text: 'grouping the whole sum, not just one part, when writing an expression' },
    ],
    homeFocus: {
      praiseLine: 'You noticed the × had to be settled before the +, and you grouped the sum on purpose to steer the answer — that control over the order is the whole skill.',
      questionForChild: 'What does 3 + 4 × 2 equal — and why isn\'t it 14?',
      schoolSyncHook: 'If your child\'s class uses a memory phrase for the order, tell us and we will echo it while keeping the reasoning front and center.',
    },
    vocabularyForParent: ['order of operations (the agreed order)', 'grouping / parentheses (do this first)', 'expression (a math phrase, no equals sign)'],
  },
});
