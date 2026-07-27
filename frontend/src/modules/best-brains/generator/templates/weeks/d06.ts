/**
 * Level D · Week 6 — "Division with remainders" (conceptId: division-with-remainders).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC), copying the D4 exemplar shape:
 *  - Module-scope generators with FIXED, role-based, name-free / number-free hints
 *    (so the seed-invariant dedup gate is deterministic); each reused ≤2× in core.
 *  - Genuine multi-step word problems via lib/multistep (combine→share, remove→share,
 *    scale→share); the answer + step-count come from the shipped exact op-chain.
 *  - A code-generated error-analysis item (the division CHECK: multiply-vs-add) whose
 *    shown "wrong" number and true answer are re-derived by QG-11 — fabrication is
 *    impossible (the structural cure for the old keyed-"7 R 3"-for-29÷4 bug).
 *  - A discrimination trap (remainder-too-big vs a valid remainder) forcing a CHOICE
 *    by Day 2, and metacognition (estimate-first) woven into Day 2 core.
 *  - Distinct proper names drawn fresh per item; the conceptual anchor is fair-sharing.
 */

import { asWarmup, classify, divideExact, factorPair, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C9 = { level: 'C' as const, week: 9 };
const C12 = { level: 'C' as const, week: 12 };
const D3 = { level: 'D' as const, week: 3 };
const D5 = { level: 'D' as const, week: 5 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);        // C12 fact table
const wDivExact = asWarmup(divideExact(2, 9, 3, 9), C9);     // C9 meeting-division (exact)
const wArea = asWarmup(multiply(11, 49, 3, 9), D5);          // D5 area-model product
const wFactor = asWarmup(factorPair(), D3);                  // D3 factor pair

// --- Single-step sharing → quotient + remainder (fixed, role-based, name-free hints) ---
const shareRem = situation({
  situationType: 'sharing', cognitiveOp: 'div-remainder',
  draw: (r) => {
    const b = r.int(3, 8);
    let a = r.int(20, 95);
    if (a % b === 0) a += 1;
    const thing = r.pick(['stickers', 'marbles', 'crayons', 'shells', 'cards', 'beads', 'buttons']);
    const name = r.pick(NAMES);
    const q = Math.floor(a / b);
    const rem = a % b;
    return {
      prompt: `${name} shares ${a} ${thing} equally among ${b} friends. Give the number each friend gets and the number left over (as: quotient, remainder).`,
      answerValue: `${q}, ${rem}`, templateId: 'd_div_rem_v1', params: { a, b },
      validation: 'ordered-list', acceptableForms: [`${q} R ${rem}`], units: thing,
      hints: ['Does every share come out even, or will a few be left that cannot make another whole group?', 'Find how many whole ones each friend gets, then count what stays behind.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

const groupRem = situation({
  situationType: 'measurement', cognitiveOp: 'div-remainder',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(25, 98);
    if (a % b === 0) a += 1;
    const [container, item] = r.pick([['crates', 'jars'], ['boxes', 'books'], ['trays', 'cups'], ['bags', 'apples']]);
    const q = Math.floor(a / b);
    const rem = a % b;
    return {
      prompt: `${a} ${item} are loaded into ${container} that each hold ${b}. Give the number of full ${container} and the number of ${item} left over (as: quotient, remainder).`,
      answerValue: `${q}, ${rem}`, templateId: 'd_div_rem_v1', params: { a, b },
      validation: 'ordered-list', acceptableForms: [`${q} R ${rem}`],
      hints: ['How many full groups of the given size can you build before you run short?', 'Whatever cannot fill one more group is the leftover.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// --- Single-step interpret-the-remainder situations -----------------------------
const leftoverStory = situation({
  situationType: 'sharing', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 8);
    let a = r.int(20, 90);
    if (a % b === 0) a += 1;
    const thing = r.pick(['stickers', 'pretzels', 'grapes', 'markers', 'coins']);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} shares ${a} ${thing} equally among ${b} classmates. How many ${thing} are LEFT OVER?`,
      answerValue: String(a % b), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'remainder' }, units: thing,
      hints: ['Is the question asking for the size of each share, or only for what is left after sharing?', 'Share into equal groups first; the answer is only the piece that stays behind.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const roundUpStory = situation({
  situationType: 'part-whole', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 8);
    let a = r.int(20, 90);
    if (a % b === 0) a += 1;
    const [group, unit] = r.pick([['tables', 'guests'], ['buses', 'students'], ['boats', 'rowers']]);
    const name = r.pick(NAMES);
    const value = Math.floor(a / b) + 1;
    return {
      prompt: `${name} is seating ${a} ${unit}. Each ${group.slice(0, -1)} holds ${b}. How many ${group} are needed so everyone has a place?`,
      answerValue: String(value), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'round-up' }, units: group,
      hints: ['Which matters here — how many fit at one place, or how many places it takes so no one is left out?', 'A place that is only part full still needs a whole one of its own.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// Metacognition base: a round-up interpretation, only ever served through the estimate wrapper.
const estBase = situation({
  situationType: 'part-whole', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 8);
    let a = r.int(20, 90);
    if (a % b === 0) a += 1;
    const name = r.pick(NAMES);
    const value = Math.floor(a / b) + 1;
    return {
      prompt: `${name} packs ${a} books into crates that each hold ${b}. How many crates are needed to pack them all?`,
      answerValue: String(value), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'round-up' }, units: 'crates',
      hints: ['Before you divide, will a small leftover force one more group, or can it be set aside here?', 'Think about whether every book must be packed before you count the crates.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const estFirst = withEstimateFirst(estBase, 'sharing leaves whole groups plus maybe a few extra, so the number of groups should be near the share size, and one larger when something would be left out.');

// --- Multi-step division word problems (exact op-chains; answer + step-count derived) ---
const msGatherShare = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const g = r.int(2, 6);
    const per = r.int(4, 12);
    const total = g * per;
    const added = r.int(2, total - 2);
    const start = total - added;
    const thing = r.pick(['apples', 'plums', 'beads', 'stamps', 'shells']);
    const name = r.pick(NAMES);
    return {
      prompt: `A basket holds ${start} ${thing}. ${name} adds ${added} more, then shares them equally among ${g} friends. How many ${thing} does each friend get?`,
      initN: start, steps: [{ op: 'add', n: added, d: 1 }, { op: 'div', n: g, d: 1 }], units: thing,
      hints: ['Should you share right away, or first put all the pieces into one pile?', 'Combine the two amounts first, then split the pile into equal shares.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msReduceShare = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const g = r.int(2, 6);
    const per = r.int(4, 10);
    const rest = g * per;
    const removed = r.int(2, 15);
    const start = rest + removed;
    const thing = r.pick(['stickers', 'cards', 'tickets', 'marbles']);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} has ${start} ${thing} and gives ${removed} away. The rest are shared equally among ${g} albums. How many ${thing} go in each album?`,
      initN: start, steps: [{ op: 'sub', n: removed, d: 1 }, { op: 'div', n: g, d: 1 }], units: thing,
      hints: ['Are all of the items shared, or do some leave first before the rest are split?', 'Take away the ones that leave, then share what remains equally.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msScaleShare = multiStep({
  situationType: 'sharing', cognitiveOp: 'multi-step',
  draw: (r) => {
    const g = r.int(2, 6);
    const per = r.int(3, 9);
    const total = g * per;
    const divisors: number[] = [];
    for (let x = 2; x < total; x++) if (total % x === 0) divisors.push(x);
    const rows = r.pick(divisors);
    const seats = total / rows;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} sets out ${rows} shelves with ${seats} books on each, then shares all the books equally among ${g} classrooms. How many books does each classroom get?`,
      initN: rows, steps: [{ op: 'mul', n: seats, d: 1 }, { op: 'div', n: g, d: 1 }], units: 'books',
      hints: ['Do you know the total already, or must you build it from the rows first?', 'Find how many books there are in all, then split them into equal shares.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination trap: remainder-too-big vs a valid remainder ----------------
const discrimRemSize = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const b = r.int(4, 8);
    let a = r.int(30, 95);
    if (a % b === 0) a += 1;
    const q = Math.floor(a / b);
    const rem = a % b;
    const [container, thing] = r.pick([['trays', 'rolls'], ['boxes', 'eggs'], ['bags', 'apples']]);
    return {
      prompt: `A baker packs ${a} ${thing} into ${container} that each hold ${b}. Which choice shows the full ${container} and the leftover written correctly?`,
      correct: `${q} R ${rem}`,
      distractors: [
        { text: `${q - 1} R ${rem + b}`, errorTag: 'concept-misconception', rationale: `Stops one group early, so the leftover is not smaller than the group size — another ${container.slice(0, -1)} still fills.` },
        { text: `${q} R ${rem + 1}`, errorTag: 'procedure-slip', rationale: 'Miscounts the leftover by one when checking what stays behind.' },
      ],
      hints: ['Which leftover is still too big to leave alone — could another whole group be made from it?', 'A leftover that reaches the group size means one more group still fits.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// --- Day-5 error-analysis on the division CHECK (QG-11 re-derives the truth) -----
const eaCheckRebuild = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(4, 9), b: r.int(3, 8), op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `To check a division answer, you rebuild the start: multiply the quotient by the divisor, then add the remainder. Working with a quotient of ${p.a} and a divisor of ${p.b}, a student ADDED them — writing ${p.a} + ${p.b} = ${v.wrong} — before adding the remainder.`,
    extension: 'Show the correct first step of the rebuild, and explain why adding the quotient and divisor cannot rebuild the equal groups.',
    hints: ['Does rebuilding the groups copy the divisor once for each share, or add the two numbers a single time?', 'Picture the quotient as that many equal groups of the divisor before you combine.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
    answerKeywords: ['multiply'],
  }),
});

export const buildD06 = makeWeekBuilder({
  week: 6,
  conceptId: 'division-with-remainders',
  conceptName: 'Division with remainders',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D3, D5],
  pedagogyContract: 'v2',
  conceptualAnchor: 'fair-sharing',
  explanation: {
    hook: 'Share 47 stickers among 5 friends and everyone gets 9 — with 2 that just will not split. That leftover has a name: the remainder. It is not a mistake; it is information about what would not go around.',
    whyBeforeHow:
      'Division is repeated fair-sharing: you keep handing out equal amounts because every group must get the same, and you stop when what is left is too small to give everyone one more. That leftover is the remainder, and since another whole group would form the moment it reached the divisor, the remainder is always smaller than the divisor. The written method is just bookkeeping for this fair-sharing story, and you can always check it by rebuilding: the quotient times the divisor, plus the remainder, returns the number you started with.',
    script: [
      { say: 'Deal 38 counters into 5 equal piles: each pile gets 7 (that is 35 handed out), and 3 are left with nowhere to go. Those 3 are the remainder.', visual: 'Counters deal into 5 equal piles; three sit outside.' },
      { say: 'The remainder is always smaller than the number of piles. If 5 or more were left, another whole pile could still be filled, so the sharing would not be finished.', visual: 'A too-big leftover regroups into one more pile.' },
      { say: 'Before you write an answer, estimate about how many each pile should get, then check by rebuilding: quotient times divisor plus remainder should return the start.', visual: 'A rough estimate, then quotient times divisor plus remainder rebuilds the original.' },
    ],
    summary: 'Share into equal groups until you cannot; the leftover is the remainder, always smaller than the divisor. Rebuild with quotient times divisor plus remainder to check.',
    vocabulary: [
      { term: 'quotient', kidGloss: 'how many each share gets' },
      { term: 'remainder', kidGloss: 'what is left when fair sharing stops' },
      { term: 'divisor', kidGloss: 'how many groups you share into' },
    ],
  },
  guidedExamples: [
    ge(6, 1, 'modeled', 'Share 38 counters into 4 equal groups.', [
      { teacherSay: 'Watch me deal these out: I give one to each of the 4 groups, again and again. I notice that after 9 rounds I have handed out 36, and only 2 are left — too few for another full round.', expected: '9 R 2' },
      { teacherSay: 'So each group has 9 with 2 left over. Let me check by rebuilding: does 9 times 4, then 2 more, land back on the 38 I started with?', expected: '38' },
    ], '9 R 2'),
    ge(6, 2, 'completion', '53 shared into 6 equal groups.', [
      { teacherSay: 'How many whole groups of 6 fit into 53 before you run short?', expected: '8' },
      { childDo: 'Count what is left after those groups.', expected: '5' },
    ], '8 R 5'),
    ge(6, 3, 'prompted', '75 counters into 8 equal groups.', [
      { childDo: 'Find the quotient, then the remainder, then rebuild to check.', expected: '9 R 3' },
    ], '9 R 3'),
    ge(6, 4, 'independent', 'A 47 cm ribbon is cut into 5 equal pieces as long as possible, with a scrap left. Solve cold, then check by rebuilding.', [
      { childDo: 'Quotient and remainder, then verify.', expected: '9 R 2' },
    ], '9 R 2'),
  ],
  days: [
    // Day 1 — concept echo: single-step share-and-name-the-remainder, blocked (no interleaving)
    [
      { gen: wMulFact, diff: 2 },
      { gen: wDivExact, diff: 2 },
      { gen: wFactor, diff: 2 },
      { gen: shareRem, diff: 2 },
      { gen: groupRem, diff: 3 },
      { gen: leftoverStory, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wArea, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: discrimRemSize, diff: 3 },
      { gen: estFirst, diff: 3 },
      { gen: roundUpStory, diff: 3 },
      { gen: shareRem, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wFactor, diff: 2 },
      { gen: msGatherShare, diff: 4 },
      { gen: discrimRemSize, diff: 4 },
      { gen: groupRem, diff: 4 },
      { gen: leftoverStory, diff: 3 },
      { gen: msScaleShare, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msGatherShare, diff: 4 },
      { gen: msReduceShare, diff: 5 },
      { gen: msScaleShare, diff: 4 },
      { gen: roundUpStory, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaCheckRebuild, diff: 4 },
      {
        gen: reasoning({
          prompt: 'One division can lead to four different real-world answers depending on the story. For sharing 26 things equally among 4 groups, describe one story whose answer is the number in each group, and one story whose answer needs a whole extra group. Explain in writing why the same numbers give different answers.',
          value: 'drop-the-remainder stories keep the quotient; round-up stories need one more whole group, so the same numbers answer differently by what the leftover means',
          hints: ['When does a leftover force a whole extra group, and when is it simply ignored?', 'Compare a story that counts full groups with one that must include everyone.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: when things are shared into equal groups, the number left over can be the same as the number of groups. Say how you know in one sentence.',
          correct: 'never',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'If the leftover equalled the number of groups, another whole group would form, so the sharing was not finished.' },
            { text: 'sometimes', errorTag: 'task-comprehension', rationale: 'Treats the remainder rule as optional — a leftover as big as the divisor always regroups.' },
          ],
          hints: ['Could a leftover as big as the number of groups still be shared out?', 'Picture handing one more to every group from that leftover.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D6-PZ-01',
    title: 'Puzzle Grove: The Leftover Riddle',
    puzzleType: 'logic',
    prompt: 'I share a bag of marbles into 6 equal piles and 4 are left over. Each pile holds 7 marbles. How many marbles were in the bag? Then explain: could the leftover ever have been 6?',
    answer: { value: '46 marbles; no — a leftover of 6 equals the number of piles, so another full pile would form', acceptableForms: ['46'], validation: 'short-text-keyword' },
    hintLadder: ['Rebuild the bag from the quotient, the divisor, and the leftover.', 'A leftover must always stay smaller than the number of piles.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: shareRem, diff: 3 },
    { gen: msGatherShare, diff: 3 },
    { gen: groupRem, diff: 3 },
    { gen: msReduceShare, diff: 3 },
    { gen: leftoverStory, diff: 3 },
    { gen: msScaleShare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step share-and-name (quotient+remainder or interpreted leftover; the fair-sharing affordance preserved). 02/04/06: two-step division (combine→share, remove→share, scale→share). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'remainder-too-big', description: 'Leaves a remainder equal to or larger than the divisor (stops fair-sharing too early).', exampleWrongAnswer: 'sharing 29 among 4 written as 6 R 5', distractorRationale: 'Offer a quotient one too small with an oversized remainder.', reteachPointer: 'explanation/script[1] (the remainder must be smaller than the divisor)' },
    { errorTag: 'procedure-slip', subtype: 'leftover-miscount', description: 'Chooses the right quotient but miscounts the leftover by one.', exampleWrongAnswer: 'a leftover of 2 recorded as 3', distractorRationale: 'Offer an off-by-one remainder.', reteachPointer: 'guidedExamples/D6-GE-01 (check by rebuilding the start)' },
    { errorTag: 'task-comprehension', subtype: 'wrong-interpretation', description: 'Reports the quotient when the story wants the leftover, or forgets the extra group when everyone must be seated.', exampleWrongAnswer: 'dropping the remainder when a whole extra bus is still needed', distractorRationale: 'Offer the drop-the-remainder value in a round-up story.', reteachPointer: 'explanation/script[2] (estimate then check what the leftover means)' },
    { errorTag: 'fact-recall', subtype: 'quotient-fact-slip', description: 'Picks a quotient whose product overshoots or undershoots the dividend.', exampleWrongAnswer: '53 ÷ 6 taken as 9 because 9 × 6 is read as 53', distractorRationale: 'Offer a quotient whose product exceeds the dividend.', reteachPointer: '60-second multiplication-fact refresh (sprint pool)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Division with remainders — sharing into equal groups until no whole group is left, writing the leftover as a remainder (always smaller than the divisor), and checking with quotient times divisor plus remainder.',
    improvingCandidates: ['sharing to find the quotient and the leftover', 'keeping the remainder smaller than the divisor', 'deciding what the leftover means in a story (leftover, drop, or one more group)'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the rule that a remainder must stay below the divisor — the discrimination trap and warm-ups keep this in view' },
      { errorTag: 'procedure-slip', text: 'computing the leftover accurately after finding the quotient' },
      { errorTag: 'fact-recall', text: 'quick multiplication facts that make choosing the quotient fast — the sprints target these' },
    ],
    homeFocus: {
      praiseLine: 'You checked your division by rebuilding the start, and you shared the counters into equal piles before naming the leftover — that habit catches almost every remainder slip.',
      questionForChild: 'When you share 29 by 4, why can the leftover never be 4 or more?',
      schoolSyncHook: 'If your child\'s class writes remainders a particular way (R, a fraction, or a decimal), tell us and we will match it.',
    },
    vocabularyForParent: ['quotient (how many each share gets)', 'remainder (what is left over)', 'divisor (how many groups)'],
  },
});
