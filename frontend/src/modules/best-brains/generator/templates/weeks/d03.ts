/**
 * Level D · Week 3 — "Factors, multiples & primes" (conceptId: factors-multiples-primes).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rebuilt to the D4 exemplar
 * shape (ACCEPT 4.21): module-scope generators with FIXED, role-based, name-free /
 * number-free hints (seed-invariant dedup), each reused ≤2× in the daily core.
 *
 * Concept family = PLACE-VALUE (a within-concept 2-step is intrinsically thin here),
 * so §6.1 is satisfied with genuine multi-step items that COMPOSE a prior-week
 * operation (addition, D2) onto a this-week factor/multiple skill — `usesPriorSkill`.
 *
 * Authoring choices:
 *  - Multi-step: (a) count a multiple by groups THEN add loose ones (mul→add,
 *    combine); (b) find a rectangle's other side from a factor THEN add the two
 *    side lengths — the factor pair's sum (div→add, measurement). Both fold via
 *    the shipped op-chain (evalRatChain), so the answer + step-count are derived.
 *  - Error-analysis (Day 5, generated): "f times WHAT makes N?" answered by
 *    SUBTRACTING f instead of dividing — the wrong number and the true co-factor
 *    are both re-derived by d_verify_binop_misconception_v1 (÷ vs −); fabrication
 *    is impossible.
 *  - Discrimination (Days 2–3): prime-vs-composite (odd ≠ prime) and the
 *    factor-vs-multiple direction trap — each forces a real CHOICE, no worked claim.
 *  - ≥3 situationTypes among word problems: rate (multiples), area (rectangle =
 *    factor pair), combine (multiple + loose), measurement (factor-pair sum).
 *  - Metacognition woven into Days 2 & 4 (estimate-first) and modeled in the script.
 */

import { addWhole, asWarmup, classify, factorPair, multiply, reasoning, roundWhole, subWhole } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D1 = { level: 'D' as const, week: 1 };
const D2 = { level: 'D' as const, week: 2 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

/** Composites rich in factor pairs (rectangle = factor-pair anchor). */
const COMPOSITES = [24, 36, 48, 60, 72, 40, 54, 56, 84, 90, 96, 63, 80, 45, 42, 66, 78, 100] as const;
/** A composite and one of its proper factors (2 ≤ f < n). */
function factorOf(r: { pick: <T>(a: readonly T[]) => T; int: (lo: number, hi: number) => number }): [number, number] {
  const n = r.pick(COMPOSITES);
  const factors: number[] = [];
  for (let f = 2; f < n; f++) if (n % f === 0) factors.push(f);
  return [n, r.pick(factors)];
}

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wSub = asWarmup(subWhole(1200, 88000), D2);
const wRound = asWarmup(roundWhole(3, 12000, 880000), D1);

// --- Single-step number-property word problems (fixed, role-based, name-free hints) ---
const wpMultiple = situation({
  situationType: 'rate', cognitiveOp: 'multiple',
  draw: (r) => {
    const base = r.int(3, 12); const k = r.int(3, 9);
    const name = r.pick(NAMES);
    const thing = r.pick(['stickers', 'buttons', 'beads', 'stamps', 'marbles']);
    return {
      prompt: `${thing[0].toUpperCase() + thing.slice(1)} come in packs of ${base}. ${name} buys ${k} full packs. How many ${thing} is that in all?`,
      answerValue: String(base * k), templateId: 'd_multiple_v1', params: { base, k }, units: thing,
      hints: [
        'Is this one amount counted several equal times over, or several different amounts added together?',
        'Take the size of one pack and count it up once for each pack.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});

const wpFactorRows = situation({
  situationType: 'area', cognitiveOp: 'factor-pair',
  draw: (r) => {
    const [n, f] = factorOf(r);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} sets ${n} plants in a rectangle with ${f} plants in each row. How many rows are there?`,
      answerValue: String(n / f), templateId: 'd_factor_pair_v1', params: { n, f }, units: 'rows',
      hints: [
        'Does a rectangle split the whole into equal rows, or stack it up higher?',
        'Count how many equal rows of that size it takes to fill the whole amount.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});

// Metacognition base: a multiples "rate" problem, only ever served through the estimate wrapper.
const wpRateBase = situation({
  situationType: 'rate', cognitiveOp: 'multiple',
  draw: (r) => {
    const base = r.int(4, 12); const k = r.int(3, 8);
    const name = r.pick(NAMES);
    return {
      prompt: `A sheet holds ${base} stickers. ${name} peels off ${k} full sheets. How many stickers is that?`,
      answerValue: String(base * k), templateId: 'd_multiple_v1', params: { base, k }, units: 'stickers',
      hints: [
        'Should the answer land near one sheet, or many sheets stacked together?',
        'Build it from equal groups — one sheet counted for each sheet used.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});
const wpMultipleEstimate = withEstimateFirst(
  wpRateBase,
  'should the total be nearer to one sheet, or to many times a sheet?',
);

// --- Multi-step (compose a prior-week op onto a this-week factor/multiple skill) ---
const msMultipleCombine = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const base = r.int(3, 12); const k = r.int(3, 8); const m = r.int(2, 20);
    const name = r.pick(NAMES);
    return {
      prompt: `Marbles come in bags of ${base}. ${name} buys ${k} bags, then finds ${m} loose marbles on the shelf. How many marbles are there in all?`,
      initN: base, steps: [{ op: 'mul', n: k, d: 1 }, { op: 'add', n: m, d: 1 }], units: 'marbles',
      hints: [
        'Does the question want only the bagged marbles, or every marble counted together?',
        'Build the bagged amount first by counting equal groups, then add on the loose ones.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msFactorPairSum = multiStep({
  situationType: 'measurement', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const [n, f] = factorOf(r);
    return {
      prompt: `A rug holds ${n} squares in a rectangle, with ${f} squares along one side. Find the length of the other side, then add the two side lengths together.`,
      initN: n, steps: [{ op: 'div', n: f, d: 1 }, { op: 'add', n: f, d: 1 }],
      hints: [
        'Once you know one side of the rectangle, how do you find the other side that pairs with it?',
        'Find the matching side by sharing the whole into equal rows, then add the two side lengths.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (Days 2–3; fixed name-free hints) ---------------------
const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47] as const;
const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51] as const;

const discrimPrime = discrimination({
  variant: 'structural', cognitiveOp: 'prime-composite',
  draw: (r) => {
    // THE STEM NO LONGER GIVES THE ANSWER AWAY. It used to open "One of these is
    // prime and one is composite", which made the third option ("both are
    // composite") contradict the question itself — a child who read carefully
    // eliminated it for free, and it was correct on none of 60 exposures. So the
    // stem now states only what is on the page, and one draw in four really does
    // put two composites there. The intended misconception (every odd number must
    // be composite) is still exactly what the wrong options catch.
    const p = r.pick(PRIMES);
    const c = r.pick(ODD_COMPOSITES);
    const bothComposite = r.int(1, 4) === 1;
    // Computed from `c`, never re-drawn, so the rng stream lands identically.
    const otherRaw = r.pick(ODD_COMPOSITES);
    const second = bothComposite ? (otherRaw === c ? ODD_COMPOSITES[(ODD_COMPOSITES.indexOf(c) + 1) % ODD_COMPOSITES.length] : otherRaw) : p;
    // Order rotates, so the composite is not always the number written second.
    const compFirst = r.int(0, 1) === 0;
    const [shownA, shownB] = compFirst ? [c, second] : [second, c];
    return {
      prompt: `Look at these two numbers: ${shownA} and ${shownB}. Which one is the COMPOSITE number?`,
      correct: bothComposite ? 'both are composite' : String(c),
      distractors: bothComposite
        ? [
          { text: String(shownA), errorTag: 'task-comprehension' as const, rationale: 'Names one number and stops, though both of these break into equal groups bigger than one.' },
          { text: String(shownB), errorTag: 'task-comprehension' as const, rationale: 'Names one number and stops, though both of these break into equal groups bigger than one.' },
        ]
        : [
          { text: String(p), errorTag: 'concept-misconception' as const, rationale: 'Chose the prime — assumed an odd number must break into factors, but this one has only 1 and itself.' },
          { text: 'both are composite', errorTag: 'task-comprehension' as const, rationale: 'Treats every odd number as composite, missing that one of them has no factor pair.' },
        ],
      hints: [
        'Being odd does not settle it — can each number be split into equal groups bigger than one?',
        'Try a small factor such as three on each number before you choose.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const discrimFactorMultiple = discrimination({
  variant: 'cross-op', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const [n, f] = factorOf(r);
    return {
      prompt: `Look at ${n} and ${f}. Is ${f} a FACTOR of ${n}, or a MULTIPLE of ${n}?`,
      correct: 'factor', correctForms: ['a factor', `factor of ${n}`],
      distractors: [
        { text: 'multiple', errorTag: 'task-comprehension', rationale: 'Swapped the two directions — the larger number is the multiple of the smaller, not the reverse.' },
        { text: 'both', errorTag: 'concept-misconception', rationale: 'A smaller number that divides evenly is a factor; it is not also a multiple of the larger number.' },
      ],
      hints: [
        'Which of the two numbers is the bigger one that the other builds up to?',
        'The smaller number that divides evenly is the factor; the bigger total it lands on is the multiple.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth AND the shown wrong) ---
// "f times WHAT makes N?" answered by SUBTRACTING f (a real wrong-inverse slip)
// instead of dividing. correct = N/f, wrong = N−f, both from the verify template.
const EA_FACTOR: Array<[number, number]> = [
  [51, 3], [57, 3], [87, 3], [93, 3], [69, 3], [91, 7], [77, 7], [85, 5], [95, 5], [65, 5], [63, 7], [49, 7],
];
const eaFactorInverse = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  drawParams: (r) => {
    const [n, f] = r.pick(EA_FACTOR);
    return { a: n, b: f, op: '/', wrongOp: '-' };
  },
  build: (v, p) => ({
    prompt: `A student was asked: ${p.b} times WHAT number makes ${p.a}? The student wrote ${v.wrong}.`,
    extension: 'Use a factor pair to show why that number cannot be right, then give the number that truly works.',
    hints: [
      'Does "times what" ask you to divide the total back into equal groups, or to take one number away from the other?',
      'Undo the multiply by sharing the whole into equal groups of the known size.',
    ],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
});

export const buildD03 = makeWeekBuilder({
  week: 3,
  conceptId: 'factors-multiples-primes',
  conceptName: 'Factors, multiples & primes',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [C12, D2],
  pedagogyContract: 'v2',
  conceptualAnchor: 'tile rectangle',
  explanation: {
    hook: 'Some numbers can be arranged into neat rectangles more than one way; a few stubborn numbers make only a single long strip. That difference — between rectangle-rich and rectangle-poor numbers — is what "prime" and "composite" really mean.',
    whyBeforeHow:
      'Because a factor divides a number evenly with no remainder, every factor pair is simply a different tile rectangle built from the same tiles — that is why a prime, which forms only one 1-by-itself rectangle, stands apart from a composite, which can be rebuilt as several rectangles. Factors and multiples are one fact seen two ways: since 6 divides 24, a rectangle 6 tiles wide fills 24, so 24 is a multiple of 6.',
    script: [
      { say: 'Watch me build 24: one row of 24, then two rows of 12, then three rows of 8, then four rows of 6. Each tile rectangle is a different factor pair of 24.', visual: 'Four rectangles of 24 tiles morph into one another.' },
      { say: 'A prime like 7 makes only ONE rectangle, a single row of 7. No other whole numbers fill it evenly, so it has just two factors: 1 and itself.', visual: 'A 1-by-7 strip; other rectangles fail to fill evenly.' },
      { say: 'Before you decide a big number is prime, estimate which small factors could even fit, then check 2, 3, 5, and 7 — that quick reasonable check keeps you from missing a factor pair.', visual: 'Divisibility checks flash beside a number.' },
    ],
    summary: 'Factors divide evenly (tile rectangles); multiples are skip-count landings. A prime makes exactly one rectangle (1 and itself); a composite makes more. Factor and multiple are the same fact seen two ways.',
    vocabulary: [
      { term: 'factor', kidGloss: 'a number that divides evenly with no remainder' },
      { term: 'multiple', kidGloss: 'a skip-count landing of a number' },
      { term: 'prime', kidGloss: 'only two factors: 1 and itself (one rectangle)' },
      { term: 'composite', kidGloss: 'more than two factors (several rectangles)' },
    ],
  },
  guidedExamples: [
    ge(3, 1, 'modeled', 'List all the factor pairs of 36.', [
      { teacherSay: 'Let me picture 36 tiles and try to build rectangles from them. I start small: one long row of 36 works, so 1 and 36 make a pair. Watch as I climb — does 2 divide 36 evenly? It does, giving 2 and 18.', expected: '2 and 18' },
      { teacherSay: 'I keep climbing: 3 and 12, then 4 and 9, then 6 and 6. Once the two factors meet in the middle, I know the list is complete.', expected: '6 and 6' },
    ], '1 and 36, 2 and 18, 3 and 12, 4 and 9, 6 and 6'),
    ge(3, 2, 'completion', 'Is 51 prime or composite?', [
      { teacherSay: 'Let me test small factors. Is 51 even? No. Does 3 divide it?', expected: 'yes' },
      { childDo: 'Find a factor pair or rule it out.', expected: '3 and 17, so composite' },
    ], 'composite'),
    ge(3, 3, 'prompted', 'What is the 6th multiple of 8?', [
      { childDo: 'Skip-count by 8 six times, or multiply.', expected: '48' },
    ], '48'),
    ge(3, 4, 'independent', 'Name a number that is a factor of 20 AND a multiple of 5. Solve cold.', [
      { childDo: 'Check the factors of 20 against the multiples of 5.', expected: '5, 10, or 20' },
    ], '5, 10, or 20'),
  ],
  days: [
    // Day 1 — concept echo: single-step factor / multiple only, blocked
    [
      { gen: wMul, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: factorPair(), diff: 2 },
      { gen: wpMultiple, diff: 2 },
      { gen: wpFactorRows, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wSub, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: wpMultipleEstimate, diff: 3 },
      { gen: discrimPrime, diff: 3 },
      { gen: msMultipleCombine, diff: 3 },
      { gen: discrimFactorMultiple, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wRound, diff: 2 },
      { gen: factorPair(), diff: 3 },
      { gen: wpFactorRows, diff: 3 },
      { gen: msFactorPairSum, diff: 4 },
      { gen: discrimPrime, diff: 4 },
      { gen: wpMultiple, diff: 3 },
    ],
    // Day 4 — word problems (multi-step + estimate-first + a discrimination)
    [
      { gen: msMultipleCombine, diff: 4 },
      { gen: msFactorPairSum, diff: 4 },
      { gen: wpMultipleEstimate, diff: 4 },
      { gen: discrimFactorMultiple, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaFactorInverse, diff: 4 },
      {
        gen: reasoning({
          prompt: 'True or false: if a number is a multiple of 6, it must also be a multiple of 3. Explain using the idea of factors. (Written explanation required.)',
          value: 'true; 6 has 3 as a factor, so every multiple of 6 carries a 3 inside it',
          acceptableForms: ['true', 'factor', 'multiple of 3'],
          keywords: true,
          hints: [
            'What factors are hidden inside every six?',
            'A multiple of six is six counted several times — where does the three hide inside each six?',
          ],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: an odd number is prime. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Ignores odd composites — a number like 9, 15, or 21 is odd but has a factor pair.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Overcorrects — many odd numbers (3, 5, 7) are prime.' },
          ],
          hints: [
            'Are there any odd numbers that DO split into equal groups bigger than one?',
            'One counterexample is enough to break an "always" claim.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D3-PZ-01',
    title: 'Puzzle Grove: Factor Detective',
    puzzleType: 'logic',
    prompt: 'I am a number under 50. I am even, I am a multiple of 3, and I have exactly six factors. Who might I be? Find every number that fits and explain how each clue narrows the field.',
    answer: { value: 'candidates: 12 and 18 (both even multiples of 3 with six factors)', acceptableForms: ['12', '18', '12 and 18'], validation: 'short-text-keyword' },
    hintLadder: [
      'Even AND a multiple of 3 together mean a multiple of what number?',
      'List the factors of each multiple of six under fifty and count them.',
    ],
    errorTags: ['concept-misconception', 'fact-recall'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: wpMultiple, diff: 3 },
    { gen: msMultipleCombine, diff: 3 },
    { gen: wpFactorRows, diff: 3 },
    { gen: msFactorPairSum, diff: 4 },
    { gen: discrimPrime, diff: 3 },
    { gen: factorPair(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: single-step multiple (rate) / factor-rows (rectangle). 02/04: two-step (count-a-multiple-then-add / find-the-other-side-then-sum-the-pair). 05: prime-vs-composite discrimination. 06: complete a factor pair. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'prime-composite-mixup', description: 'Calls a composite prime by missing a factor pair (or the reverse), often assuming odd means prime.', exampleWrongAnswer: '51 called prime (misses the factor pair 3 and 17)', distractorRationale: 'Offer the opposite classification on an odd composite.', reteachPointer: 'explanation/script[1] (a prime makes only one rectangle)' },
    { errorTag: 'task-comprehension', subtype: 'factor-vs-multiple', description: 'Swaps factor and multiple — the two directions of the same relationship.', exampleWrongAnswer: 'asked whether 6 is a factor of 24, answers "multiple"', distractorRationale: 'Offer the swapped direction.', reteachPointer: 'explanation/summary (two views of one fact)' },
    { errorTag: 'fact-recall', subtype: 'skip-count-slip', description: 'Chooses the right idea but slips on a multiplication or skip-count fact.', exampleWrongAnswer: '6th multiple of 8 answered as 56', distractorRationale: 'Offer an adjacent multiple.', reteachPointer: '60-second skip-count refresh; feeds the sprint pool' },
    { errorTag: 'procedure-slip', subtype: 'missed-factor', description: 'Lists factor pairs but skips a middle pair, or drops a step in a two-step problem.', exampleWrongAnswer: 'factors of 24 listed without the pair 3 and 8', distractorRationale: 'Offer a factor list with a gap.', reteachPointer: 'guidedExamples/D3-GE-01 (climb up from 1 until the pair meets)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Factors, multiples, and the prime/composite split — seeing numbers as tile rectangles (factor pairs) and skip-count landings (multiples), and testing small factors before deciding a number is prime.',
    improvingCandidates: ['finding factor pairs by building rectangles', 'naming multiples by skip-counting', 'deciding prime versus composite with small-factor tests'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the prime/composite decision — testing 2, 3, 5, and 7 before declaring a number prime' },
      { errorTag: 'task-comprehension', text: 'keeping factor and multiple straight — they are the same fact seen two ways' },
      { errorTag: 'fact-recall', text: 'quick multiplication facts that power factor-finding — the sprints keep these sharp' },
    ],
    homeFocus: {
      praiseLine: 'You caught that 51 is not prime by finding the factor pair 3 and 17 — that factor-testing habit is exactly what makes primes clear.',
      questionForChild: 'Is 91 prime or composite? What small factors would you test first?',
      schoolSyncHook: 'Tell us if your child\'s class uses factor rainbows or factor trees, and we will echo that model.',
    },
    vocabularyForParent: ['factor (divides evenly — a tile rectangle)', 'multiple (a skip-count landing)', 'prime (only two factors)', 'composite (more than two factors)'],
  },
});
