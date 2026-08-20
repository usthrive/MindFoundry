/**
 * Level D · Week 16 — "Division: 2-digit divisors" (conceptId: division-two-digit-divisors).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Mirrors the D4 exemplar
 * (ACCEPT 4.21): module-scope generators with FIXED, role-based, name-free hints;
 * two()/three() draw distinct names per prompt; the 5-day skeleton; a code-
 * generated error-analysis whose "wrong" value is re-derived by QG-11.
 *
 * Concept identity (content/catalog.ts D-16): estimate-quotient strategies + long
 * division with 2-digit divisors; Day-5 non-computational focus = bracket the
 * quotient before dividing. conceptualAnchor = the estimate-quotient move.
 *
 * Authoring choices:
 *  - Multi-step (operation family, ≥2 week-wide, ≥1 on Day 4): share-then-add,
 *    fill-crates-then-ship (÷ then −), buses-then-adults (÷ then ×, prior skill);
 *    each answer + step-count come from the shipped op-chain (evalRatChain).
 *  - Error-analysis (Day 5): the trial-quotient CHECK — a student ADDS the guess
 *    and the divisor instead of multiplying to verify. d_verify_binop_misconception_v1
 *    returns {correct = q×b, wrong = q+b}; the prompt embeds v.wrong, so nothing
 *    is hand-typed.
 *  - Discrimination (Days 2–3): which two round tens BRACKET the quotient (the
 *    correct pair is code-selected from the true quotient).
 *  - Situations: sharing, measurement (grouping into boxes), rate, part-whole
 *    teams — plus multi-stage / combine multi-step families (≥3 distinct).
 *  - Metacognition: an estimate-first rate problem in Day-2 core + modeled in the
 *    explanation script (round → estimate → check → adjust → bracket).
 */

import { asWarmup, classify, divideRemainder, factorPair, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { barModel, mathSentence, numberLine } from '../lib/figures';
import { ge, makeWeekBuilder } from '../lib/assemble';

const D3 = { level: 'D' as const, week: 3 };
const C12 = { level: 'C' as const, week: 12 };
const D6 = { level: 'D' as const, week: 6 };
const D15 = { level: 'D' as const, week: 15 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** Two distinct names (never a hardcoded name that is also in the pool). */
const two = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 2) as [string, string];
/** Three distinct names. */
const three = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 3) as [string, string, string];

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wBigMul = asWarmup(multiply(101, 299, 11, 29), D15);
const wDivRem = asWarmup(divideRemainder(3, 9, 20, 89), D6);
const wFactor = asWarmup(factorPair(), D3);                   // D3 missing-factor form (not a second bare product)

// --- Single-step division situations (fixed, role-based, name-free hints) --------
const gShare = situation({
  situationType: 'sharing', cognitiveOp: 'div-exact',
  draw: (r) => {
    const b = r.int(6, 24); const q = r.int(8, 40); const a = b * q;
    const thing = r.pick(['stickers', 'beads', 'cards', 'stamps', 'marbles', 'crayons']);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} shares ${a} ${thing} equally among ${b} friends. How many ${thing} does each friend get?`,
      answerValue: String(a / b), templateId: 'd_div_v1', params: { a, b }, units: thing,
      hints: ['Does sharing equally split the whole into groups, or join the two numbers together?', 'Picture the whole pile handed out fairly, one to each friend at a time.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const gBox = situation({
  situationType: 'measurement', cognitiveOp: 'div-exact',
  draw: (r) => {
    const b = r.int(11, 40); const q = r.int(11, 39); const a = b * q;
    const item = r.pick(['bottles', 'books', 'tiles', 'apples', 'cans', 'bricks']);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} packs ${a} ${item} into boxes that hold ${b} each. How many boxes does that fill?`,
      answerValue: String(a / b), templateId: 'd_div_v1', params: { a, b }, units: 'boxes',
      hints: ['How many equal boxes can the whole pile fill?', 'Find how many groups of the box-size fit inside the total.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// Metacognition base: a rate problem, only ever served through the estimate wrapper
// in core (raw once on Day 1 concept-echo).
const gRate = situation({
  situationType: 'rate', cognitiveOp: 'div-exact',
  draw: (r) => {
    const b = r.int(12, 30); const q = r.int(11, 40); const a = b * q;
    const item = r.pick(['labels', 'tickets', 'flyers', 'cards', 'stamps']);
    return {
      prompt: `A machine prints ${b} ${item} every minute. How many minutes does it take to print ${a} ${item}?`,
      answerValue: String(a / b), templateId: 'd_div_v1', params: { a, b }, units: 'minutes',
      hints: ['Which number counts the minutes — the total, or how many print each minute?', 'Divide the total by the amount printed each minute.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const gRateEst = withEstimateFirst(gRate, 'about how many equal groups fit if you use a friendlier divisor?');

const gGroup = situation({
  situationType: 'part-whole', cognitiveOp: 'div-exact',
  draw: (r) => {
    const b = r.int(8, 25); const q = r.int(9, 30); const a = b * q;
    const unit = r.pick(['players', 'dancers', 'singers', 'scouts', 'runners']);
    return {
      prompt: `A club of ${a} ${unit} splits into equal teams of ${b}. How many teams are there?`,
      answerValue: String(a / b), templateId: 'd_div_v1', params: { a, b }, units: 'teams',
      hints: ['Are you finding how many equal teams there are, or the size of one team?', 'Count how many groups of the team-size fit inside the whole club.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Multi-step division problems (answer + step-count from the shipped chain) ---
const mSharePlus = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'div-then-add',
  draw: (r) => {
    const b = r.int(6, 20); const q = r.int(8, 30); const a = b * q; const extra = r.int(2, 9);
    const [n1, n2, n3] = three(r);
    return {
      prompt: `${n1}, ${n2}, and ${n3} baked ${a} muffins and shared them equally onto ${b} trays, then set ${extra} more muffins on each tray. How many muffins are on each tray now?`,
      initN: a, steps: [{ op: 'div', n: b, d: 1 }, { op: 'add', n: extra, d: 1 }], units: 'muffins',
      hints: ['Does the question want each tray before or after the extra muffins are added?', 'Find each fair share first, then add on the extra.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const mPackShip = multiStep({
  situationType: 'combine', cognitiveOp: 'div-then-sub',
  draw: (r) => {
    const b = r.int(8, 20); const q = r.int(10, 30); const a = b * q; const c = r.int(2, q - 1);
    const [n1, n2] = two(r);
    return {
      prompt: `${n1} packs ${a} books into crates that hold ${b} each. ${n2} then ships out ${c} full crates. How many crates are left?`,
      initN: a, steps: [{ op: 'div', n: b, d: 1 }, { op: 'sub', n: c, d: 1 }], units: 'crates',
      hints: ['Which happens first — filling the crates, or shipping some away?', 'Fill the crates first, then take away the ones that were shipped.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const mBusAdults = multiStep({
  situationType: 'part-whole', cognitiveOp: 'div-then-mul', usesPriorSkill: true,
  draw: (r) => {
    const b = r.int(9, 30); const q = r.int(6, 20); const a = b * q; const m = r.int(2, 4);
    const name = r.pick(NAMES);
    return {
      prompt: `${name}'s club has ${a} members. Each team takes ${b}, and every team needs ${m} coaches. How many coaches are needed for all the teams?`,
      initN: a, steps: [{ op: 'div', n: b, d: 1 }, { op: 'mul', n: m, d: 1 }], units: 'coaches',
      hints: ['Do you need the number of teams before you can count the coaches?', 'Find how many teams first, then the coaches each team needs.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Discrimination: which two round tens BRACKET the quotient (code-selected) ----
const dBracket = discrimination({
  variant: 'structural',
  draw: (r) => {
    const b = r.int(12, 28); let q = r.int(21, 88); if (q % 10 === 0) q += 1; const a = b * q;
    const tenLow = Math.floor(q / 10) * 10; const tenHigh = tenLow + 10;
    return {
      prompt: `Between which two multiples of ten does the quotient of ${a} ÷ ${b} fall?`,
      correct: `${tenLow} and ${tenHigh}`,
      distractors: [
        { text: `${tenLow - 10} and ${tenLow}`, errorTag: 'representation-misread', rationale: 'Brackets too low — the divisor times this pair lands under the number.' },
        { text: `${tenHigh} and ${tenHigh + 10}`, errorTag: 'concept-misconception', rationale: 'Brackets too high — the divisor times this pair overshoots the number.' },
      ],
      hints: ['Which two round tens could the quotient sit between?', 'Multiply the divisor by a lower ten and a higher ten to see which pair traps the total.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives correct AND wrong) ---------
const eaCheckByAdding = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(12, 38), b: r.int(13, 29), op: '*', wrongOp: '+' }),
  build: (v, p, r) => {
    const q = p.a as number; const b = p.b as number;
    const big = q * b + r.int(1, b - 1);
    return {
      prompt: `A student is dividing ${big} by ${b} and thinks the quotient is ${q}. To test that guess, the check is ${q} times ${b} — but the student ADDED the two numbers and wrote ${v.wrong}.`,
      extension: `Work out ${q} times ${b} the correct way, compare it with ${big}, and say whether ${q} is a good quotient.`,
      hints: ['Does checking a quotient guess mean multiplying the guess by the divisor, or adding them together?', 'Picture equal groups the size of the divisor — that is a multiply, not a sum.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

export const buildD16 = makeWeekBuilder({
  week: 16,
  conceptId: 'division-two-digit-divisors',
  conceptName: 'Division: 2-digit divisors',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D6, D15],
  pedagogyContract: 'v2',
  conceptualAnchor: 'estimate-quotient',
  explanation: {
    hook: 'Dividing by 23 feels harder than dividing by 3 — until you notice the trick is ESTIMATING. Round 23 to 20, guess how many fit, then adjust. Long division with big divisors is really smart guessing plus checking.',
    whyBeforeHow:
      'Dividing by a 2-digit number is the same fair-share idea as dividing by one digit, but the "how many fit" step is hard to eyeball, so we reach for an estimate-quotient move: round the divisor to a friendly ten and try that guess first. Because the rounded divisor makes each trial easy to picture, a quick check by multiplying tells you at once whether the guess overshoots (lower it) or leaves room (raise it); bracketing the whole quotient between two round products first keeps every long-division step honest.',
    script: [
      {
        say: '736 ÷ 23: round 23 to 20. About how many 20s are in 73, the leading part? Roughly 3, so I try 3 as the first quotient digit.',
        visual: 'The rounding written out, 23 is about 20, and under it the trial it buys: 73 divided by 20 is about 3.',
        // Two lines because the say has two moves: round the divisor, then ask
        // the easy question the rounded one allows. Both lines are written with
        // "is about", not "equals" — 73 ÷ 20 is not 3, and a picture claiming it
        // was would teach the opposite of a TRIAL digit. The 3 is underlined as
        // the digit chosen, and the very next segment tests it.
        figure: mathSentence(
          [{ text: '23' }, { text: '≈' }, { text: '20', mark: 'ring' }],
          {
            then: {
              connector: 'becomes',
              tokens: [
                { text: '73' }, { text: '÷' }, { text: '20' },
                { text: '≈' }, { text: '3', mark: 'underline' },
              ],
            },
            alt:
              'the divisor rounded — 23 is about 20, with the 20 ringed — and under it the trial that buys, ' +
              '73 divided by 20 is about 3, with the 3 underlined',
          },
        ),
      },
      {
        say: 'Check the trial: 3 × 23 = 69, which is under 73, so there is room — I bring down and keep going, guessing then verifying.',
        visual: 'The trial product 69 drawn just short of the working number 73, both to the same scale.',
        figure: barModel(
          [
            { label: 'the trial', segments: [{ value: 69, label: '3 × 23 = 69' }] },
            { label: 'the number', segments: [{ value: 73, label: '73' }] },
          ],
          { scaleMax: 73, alt: 'two bars to one scale, the trial product 69 stopping a little short of the working number 73' },
        ),
      },
      {
        say: 'Bracket first: the quotient of 736 ÷ 23 sits between 30 and 40, because 23 × 30 = 690 and 23 × 40 = 920 trap it. That bracket keeps my long division honest.',
        visual: 'A number line trapping 736 between the two round products 690 and 920.',
        figure: numberLine(
          {
            min: 600,
            max: 1000,
            step: 100,
            labels: 'none',
            marks: [
              { at: 690, label: '23 × 30', style: 'flag' },
              { at: 736, label: '736', style: 'point' },
              { at: 920, label: '23 × 40', style: 'flag' },
            ],
          },
          { alt: 'a number line from 600 to 1,000 with flags on the round products 690 and 920 and a dot for 736 sitting between them' },
        ),
      },
    ],
    summary: 'Round the divisor to a friendly ten to estimate each quotient digit, check the guess by multiplying, and adjust up or down. Bracket the whole quotient between two round products before you dive in.',
    vocabulary: [
      { term: 'divisor', kidGloss: 'the number you divide by' },
      { term: 'estimate the quotient', kidGloss: 'guess how many fit using a friendly, rounded divisor' },
      { term: 'bracket', kidGloss: 'trap the answer between two round products' },
    ],
  },
  guidedExamples: [
    ge(16, 1, 'modeled', 'Divide 322 ÷ 14 using an estimate first.', [
      { teacherSay: 'I see a 2-digit divisor, so first I round 14 to about 15 and ask myself roughly how many 15s are in 322 — that feels near 20, so let me start my guess there.', expected: 'about 20' },
      { teacherSay: 'Now I check by multiplying and adjust: 14 × 23 = 322 exactly, so the quotient is 23.', expected: '23' },
    ], '23'),
    ge(16, 2, 'completion', '405 ÷ 27.', [
      { teacherSay: 'Round 27 to 30 — about how many 30s are in 405?', expected: 'about 13' },
      { childDo: 'Check the trial by multiplying and adjust to the exact quotient.', expected: '15' },
    ], '15'),
    ge(16, 3, 'prompted', '588 ÷ 21.', [
      { childDo: 'Round the divisor, estimate, then verify by multiplying.', expected: '28' },
    ], '28'),
    ge(16, 4, 'independent', '816 ÷ 24. Solve cold: estimate, check, adjust.', [
      { childDo: 'Estimate with a rounded divisor, then confirm with multiplication.', expected: '34' },
    ], '34'),
  ],
  days: [
    // Day 1 — concept echo: single-step division only, blocked (no interleaving yet)
    [
      { gen: wMulFact, diff: 2 },
      { gen: wFactor, diff: 2 },
      { gen: wDivRem, diff: 2 },
      { gen: gShare, diff: 3 },
      { gen: gBox, diff: 3 },
      { gen: gRate, diff: 3 },
    ],
    // Day 2 — fluency + application: estimate-first metacognition + discrimination enter
    [
      { gen: wBigMul, diff: 2 },
      { gen: wDivRem, diff: 2 },
      { gen: gRateEst, diff: 3 },
      { gen: gGroup, diff: 3 },
      { gen: dBracket, diff: 3 },
      { gen: mSharePlus, diff: 4 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wDivRem, diff: 2 },
      { gen: gShare, diff: 3 },
      { gen: gBox, diff: 3 },
      { gen: dBracket, diff: 4 },
      { gen: mPackShip, diff: 4 },
      { gen: mBusAdults, diff: 4 },
    ],
    // Day 4 — word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: gGroup, diff: 4 },
      { gen: mSharePlus, diff: 4 },
      { gen: mPackShip, diff: 5 },
      { gen: mBusAdults, diff: 5 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaCheckByAdding, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Before dividing 736 ÷ 23, bracket the quotient: between which two multiples of ten must it lie? Show the products that prove your bracket.',
          value: 'between 30 and 40, since 23 × 30 = 690 and 23 × 40 = 920',
          acceptableForms: ['30', '40', '690', '920'],
          keywords: true,
          hints: ['Which two multiples of ten could trap the quotient?', 'Try the divisor times a lower ten and times a higher ten.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'To estimate a quotient when dividing by 29, which friendly divisor makes the trial guess quickest?',
          correct: '30',
          distractors: [
            { text: '20', errorTag: 'representation-misread', rationale: 'Rounds 29 the wrong way, giving a poor estimate.' },
            { text: '25', errorTag: 'concept-misconception', rationale: 'Not a round ten, so it does not make the trial easy.' },
          ],
          hints: ['Which ten is that divisor closest to?', 'A close, round ten makes the trial quick.'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D16-PZ-01',
    title: 'Puzzle Grove: The Hidden Dividend',
    puzzleType: 'logic',
    prompt: 'A mystery number divided by 21 leaves a remainder of 5, and its quotient is somewhere in the thirties. Find EVERY number it could be, and explain how you know the list is complete.',
    answer: { value: 'ten numbers: 635, 656, 677, 698, 719, 740, 761, 782, 803, 824 — one for each quotient from 30 to 39, each 21 more than the last', acceptableForms: ['635', '824', 'ten'], validation: 'short-text-keyword' },
    hintLadder: ['If you know the quotient and the remainder, can you rebuild the number that was divided?', 'Rebuild one number for the smallest quotient in the thirties, then see what changes each time the quotient goes up by one.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  puzzleMeta: { stepCount: 3, cognitiveOp: 'constraint-search' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: gShare, diff: 3 },
    { gen: mSharePlus, diff: 3 },
    { gen: gBox, diff: 3 },
    { gen: mPackShip, diff: 3 },
    { gen: gGroup, diff: 4 },
    { gen: mBusAdults, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step 2-digit-divisor division (sharing / grouping-into-boxes / equal-teams — the estimate-quotient affordance preserved). 02/04/06: two-step division (÷ then + / ÷ then − / ÷ then ×). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'quotient-estimate-off', description: 'Estimates the quotient poorly — rounds the divisor the wrong way, or skips estimating entirely.', exampleWrongAnswer: '611 ÷ 29 estimated with 20 instead of 30', distractorRationale: 'Offer the quotient from the wrong-way estimate.', reteachPointer: 'explanation/script[0] (round the divisor to a friendly ten)' },
    { errorTag: 'procedure-slip', subtype: 'long-division-step', description: 'Slips a bring-down or subtraction step in the long division, or leaves a remainder larger than the divisor.', exampleWrongAnswer: 'stops with a remainder bigger than the divisor', distractorRationale: 'Offer a one-step-off quotient.', reteachPointer: 'guidedExamples/D16-GE-02 (check each trial by multiplying)' },
    { errorTag: 'representation-misread', subtype: 'round-wrong-way', description: 'Rounds the divisor away from the nearest ten, harming the estimate and mis-bracketing the quotient.', exampleWrongAnswer: '29 rounded to 20', distractorRationale: 'Offer the wrong-rounded divisor or a too-low bracket.', reteachPointer: 'Day-5 classify (round to the nearest ten)' },
    { errorTag: 'fact-recall', subtype: 'trial-product-slip', description: 'Miscomputes the trial product (quotient × divisor) used to check a guess.', exampleWrongAnswer: '18 × 28 read as a near-miss product', distractorRationale: 'Offer a near-miss trial product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
    { errorTag: 'task-comprehension', subtype: 'wrong-step-order', description: 'In a multi-step problem, adds/subtracts/multiplies before dividing, or answers the intermediate quotient instead of the final quantity.', exampleWrongAnswer: 'reports the buses instead of the adults', distractorRationale: 'Offer the intermediate quotient as if it were the final answer.', reteachPointer: 'Day-4 multi-step problems (find the buses first, then the adults)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Long division with 2-digit divisors — estimating each quotient digit by rounding the divisor to a friendly ten, checking by multiplying, and bracketing the whole quotient between round products before diving in.',
    improvingCandidates: ['estimating a quotient digit by rounding the divisor', 'checking a trial guess by multiplying', 'bracketing the quotient between round products'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'estimating the quotient with a friendly, rounded divisor — the warm-ups build this instinct' },
      { errorTag: 'procedure-slip', text: 'the bring-down and subtract steps of long division, and never leaving a remainder bigger than the divisor' },
      { errorTag: 'fact-recall', text: 'quick trial-product multiplication — the sprints keep facts fast' },
    ],
    homeFocus: {
      praiseLine: 'You bracketed the division between two round products and estimated the quotient before dividing — that estimate-first move keeps long division from going off the rails.',
      questionForChild: 'To estimate 611 ÷ 29, what friendly number would you divide by instead — and why?',
      schoolSyncHook: 'If your child\'s class uses partial-quotients or the standard long-division layout, tell us and we will match it.',
    },
    vocabularyForParent: ['divisor (the number you divide by)', 'estimate the quotient (guess with a friendly, rounded divisor)', 'bracket (trap the answer between round products)'],
  },
});
