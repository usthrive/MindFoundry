/**
 * Level D · Week 2 — "Multi-digit ± fluency" (conceptId: multi-digit-add-sub-fluency).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC), authored on the proven D4
 * architecture. Standard addition/subtraction algorithms to 6 digits with an
 * estimate-first reasonableness habit; the Day-5 non-computational strand analyses
 * a worked error (chose the wrong operation for a take-away story).
 *
 * Authoring choices (kit §D, row D2):
 *  - anchor = the place-value column (why a carry/borrow is legal at all).
 *  - Multi-step (op-family ⇒ ≥2, ≥1 on Day 4): three genuine 2-op chains — a town
 *    that shrinks then grows (sub→add), a budget spent-then-paid (sub→add), and a
 *    route with two legs peeled off (sub→sub). Answers + step-counts come from the
 *    shipped rational op-chain (evalRatChain), never hand-typed.
 *  - Error-analysis: a code-generated add-instead-of-subtract item; the shown
 *    "wrong" number and the true answer are re-derived by the verify template
 *    (d_verify_binop_misconception_v1), so fabrication is impossible.
 *  - Discrimination (keyword traps): "how many more" tempts an add but is a
 *    difference; "arrived, none left" tempts a subtract but is a total.
 *  - Situations: money-change, measurement (distance), population change
 *    (combine / comparison / multi-stage) — five structure-distinct families.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free; each generator reused ≤2×
 *    in the daily core; distinct town names drawn fresh (never a hardcoded name in
 *    the draw pool).
 */

import { asWarmup, classify, compareWhole, digitValue, multiply, reasoning, roundWhole } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C12 = { level: 'C' as const, week: 12 };
const D1 = { level: 'D' as const, week: 1 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const TOWNS = ['Riverton', 'Oakdale', 'Elmwood', 'Fairview', 'Brookside', 'Lakeside', 'Pinehurst', 'Greenfield', 'Ashford', 'Hillcrest', 'Cedar Falls', 'Westbrook'] as const;
/** Two DISTINCT town names (comparison must never pit a town against itself). */
const twoTowns = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...TOWNS]).slice(0, 2) as [string, string];

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wRound = asWarmup(roundWhole(3, 12000, 890000), D1);
const wDigit = asWarmup(digitValue(6), D1);
const wCompare = asWarmup(compareWhole(6), D1);
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);

// --- Single-step situations (fixed, role-based, name-free hints) ----------------
const distTrip = situation({
  situationType: 'measurement', cognitiveOp: 'sub',
  draw: (r) => {
    const a = r.int(12000, 98000); const b = r.int(1000, 9000);
    const name = r.pick(NAMES);
    const road = r.pick(['coastal highway', 'mountain route', 'cross-country trail', 'river road', 'ridge road']);
    return {
      prompt: `The ${road} is ${a} km long. ${name} has already driven ${b} km. How many km are LEFT to drive?`,
      answerValue: String(a - b), templateId: 'd_sub_v1', params: { a, b }, units: 'km',
      hints: ['Does the trip ask for the whole distance, or only the part still ahead?', 'Take the stretch already driven off the full length of the road.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const moneySpend = situation({
  situationType: 'money-change', cognitiveOp: 'sub',
  draw: (r) => {
    const a = r.int(3000, 9800); const b = r.int(200, 2500);
    const name = r.pick(NAMES);
    const thing = r.pick(['a used car', 'new furniture', 'a laptop', 'a mountain bike', 'a big repair']);
    return {
      prompt: `${name} had saved $${a} and spent $${b} on ${thing}. How much money is left?`,
      answerValue: String(a - b), templateId: 'd_sub_v1', params: { a, b }, units: 'dollars',
      acceptableForms: [`$${a - b}`],
      hints: ['When money is spent, does the amount saved grow or shrink?', 'Begin with what was saved and remove what was spent.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const popGrow = situation({
  situationType: 'combine', cognitiveOp: 'add',
  draw: (r) => {
    const a = r.int(20000, 90000); const b = r.int(1000, 9000);
    const town = r.pick(TOWNS);
    return {
      prompt: `${town} had a population of ${a}. Over the year ${b} more people moved in. What is the town's new population?`,
      answerValue: String(a + b), templateId: 'd_add_v1', params: { a, b }, units: 'people',
      hints: ['Do arrivals push the population up or pull it down?', 'Join the residents already there with the ones who moved in.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const popCompare = situation({
  situationType: 'comparison', cognitiveOp: 'sub',
  draw: (r) => {
    const a = r.int(40000, 95000); const b = r.int(10000, 39000);
    const [t1, t2] = twoTowns(r);
    return {
      prompt: `${t1} has ${a} residents and ${t2} has ${b} residents. How many MORE residents does ${t1} have than ${t2}?`,
      answerValue: String(a - b), templateId: 'd_sub_v1', params: { a, b }, units: 'residents',
      hints: ['Does "how many more" ask for a combined total, or the gap between two counts?', 'Set the smaller population beside the larger and find the difference.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// Metacognition base: a money total, only ever served through the estimate wrapper.
const costCheck = situation({
  situationType: 'money-change', cognitiveOp: 'add',
  draw: (r) => {
    const a = r.int(1200, 8900); const b = r.int(1200, 8900);
    return {
      prompt: `A shop's morning sales came to $${a} and its afternoon sales came to $${b}. What were the shop's total sales for the day?`,
      answerValue: String(a + b), templateId: 'd_add_v1', params: { a, b }, units: 'dollars',
      acceptableForms: [`$${a + b}`],
      hints: ['Are the morning and afternoon amounts being joined, or compared?', 'Add the two amounts, keeping ones over ones and tens over tens.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const costEstimate = withEstimateFirst(costCheck, 'rounding each amount to a friendly nearby number gives a ballpark, so the total should land close to that rounded sum, not far above or below.');

// --- Multi-step chains (answer + step-count from the shipped op-chain) -----------
const msPopChange = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(30000, 95000); const b = r.int(2000, 9000); const c = r.int(1000, 8000);
    const town = r.pick(TOWNS);
    return {
      prompt: `${town} had ${a} residents. During the year ${b} residents moved away, and then ${c} new residents arrived. What is the population NOW?`,
      initN: a, steps: [{ op: 'sub', n: b, d: 1 }, { op: 'add', n: c, d: 1 }], units: 'residents',
      hints: ['Which change shrinks the town, and which one grows it back?', 'Remove the departures from the start first, then bring in the arrivals.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msMoneyBudget = multiStep({
  situationType: 'money-change', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(3000, 9000); const b = r.int(800, 2500); const c = r.int(700, 2500);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} started the month with $${a}. They spent $${b} on bills and later were paid $${c}. How much money do they have now?`,
      initN: a, steps: [{ op: 'sub', n: b, d: 1 }, { op: 'add', n: c, d: 1 }], units: 'dollars',
      hints: ['Before any arithmetic, which step lowers the balance and which lifts it?', 'Take the spending off the starting amount, then add the pay.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msDistance = multiStep({
  situationType: 'measurement', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = r.int(2400, 4800); const b = r.int(400, 900); const c = r.int(400, 900);
    const name = r.pick(NAMES);
    return {
      prompt: `A cross-country cycling tour is ${a} km. ${name} rides ${b} km on the first leg and ${c} km on the second. How many km are LEFT to finish?`,
      initN: a, steps: [{ op: 'sub', n: b, d: 1 }, { op: 'sub', n: c, d: 1 }], units: 'km',
      hints: ['Does each leg already ridden leave more or less of the route ahead?', 'Peel both finished legs off the full route to see what remains.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (add-vs-subtract keyword traps) -----------------------
const discrimGap = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const a = r.int(24000, 88000); const b = r.int(9000, 23000);
    const [t1, t2] = twoTowns(r);
    return {
      prompt: `${t1} had ${a} visitors and ${t2} had ${b} visitors. To find how many MORE visitors ${t1} had, which operation do you use?`,
      correct: 'subtract', correctForms: ['subtraction', 'find the difference'],
      distractors: [
        { text: 'add', errorTag: 'task-comprehension', rationale: 'The word "more" looks like an add word, but the gap between two amounts is a subtraction.' },
        { text: 'multiply', errorTag: 'concept-misconception', rationale: 'Comparing two counts is a single difference, not repeated groups.' },
      ],
      hints: ['Would joining the two counts answer "how many more", or is that really a difference?', 'A gap between two amounts is one subtraction, not a sum.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const discrimArrive = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const a = r.int(31000, 89000); const b = r.int(2000, 9000);
    const town = r.pick(TOWNS);
    return {
      prompt: `${town}'s population was ${a}. During the year ${b} new residents arrived and none left. To find the population at the end of the year, which operation fits?`,
      correct: 'add', correctForms: ['addition', 'find the total'],
      distractors: [
        { text: 'subtract', errorTag: 'task-comprehension', rationale: '"During the year" can sound like a take-away, but arrivals with none leaving build a total — an addition.' },
        { text: 'multiply', errorTag: 'concept-misconception', rationale: 'This asks for one new total, not a scaling into equal groups.' },
      ],
      hints: ['With people arriving and none leaving, does the population climb or fall?', 'A running total that only gains is built by adding, not taking away.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives the truth) ---------------
const eaWrongOp = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  drawParams: (r) => ({ a: r.int(4200, 8900), b: r.int(1100, 3900), op: '-', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A shop took in $${p.a} at the register and paid out $${p.b} in refunds during the day. To find how much money was LEFT, a student worked it out as ${v.wrong}.`,
    extension: 'Name the operation the "how much is left after paying out" story actually calls for, explain why, then give the correct amount.',
    hints: ['Does "how much is LEFT after paying out" build the amount up, or bring it down?', 'Picture the register emptying as refunds go out — money leaving means less, not more.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }),
});

export const buildD02 = makeWeekBuilder({
  week: 2,
  conceptId: 'multi-digit-add-sub-fluency',
  conceptName: 'Multi-digit addition & subtraction fluency',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [C3, C4, D1],
  pedagogyContract: 'v2',
  conceptualAnchor: 'place-value column',
  explanation: {
    hook: 'Adding and subtracting six-digit numbers uses the SAME move you learned for two digits — line the places up, work the ones first, and trade when a column overflows. Nothing new; just more columns.',
    whyBeforeHow:
      'Because each place-value column can hold only nine before it must trade ten of itself for one of the next column up, adding and subtracting large numbers are really the same small moves repeated — the columns just keep going. That is why lining the numbers up by place matters so much: a digit only ever meets a digit of its own place-value column, so every carry and every borrow stays honest. Subtraction runs the trade in reverse — when a column cannot pay, it borrows one from the place to its left, and across a row of zeros that borrow has to ripple until it reaches a column with something to give.',
    script: [
      { say: 'Stack the numbers so ones sit over ones, then work from the ones column leftward, trading a ten to the next column whenever one spills past ten.', visual: 'Two large numbers align by place; a carried 1 hops to the next column.' },
      { say: 'Subtracting across a row of zeros: a zero has nothing to lend, so the borrow travels left to the first place that does, then ripples back to the ones.', visual: 'A row of zeros lights up; a borrow ripples left, then unwinds.' },
      { say: 'Estimate first with rounded numbers so you carry a ballpark in mind; if your careful answer lands far from that estimate, a trade probably slipped and it is worth a second look.', visual: 'Rounded numbers give a range; the exact answer lands inside it.' },
    ],
    summary: 'Line up the places, work ones-first, trade a ten when a column overflows (or borrow when it cannot pay). Estimate first so a slipped trade shows up right away.',
    vocabulary: [
      { term: 'regroup / carry', kidGloss: 'trade ten of one place for one of the next place up' },
      { term: 'borrow', kidGloss: 'take one from the place on the left when a column cannot pay' },
      { term: 'estimate', kidGloss: 'a rounded ballpark you check the exact answer against' },
    ],
  },
  guidedExamples: [
    ge(2, 1, 'modeled', '34,687 + 8,455 with the standard algorithm.', [
      { teacherSay: 'I line the numbers up so ones sit over ones, then I start at the ones and watch for any column that spills past ten. Let me work it: 7 and 5 make twelve, so I write 2 and carry one into the tens.', expected: '43,142' },
    ], '43,142'),
    ge(2, 2, 'completion', '50,004 − 1,236 with the standard algorithm (subtracting across zeros).', [
      { teacherSay: 'The ones column needs to take six from four, but four is too small and the zeros to its left have nothing to lend.' },
      { childDo: 'Borrow from the first place that has something, then finish the subtraction.', expected: '48,768' },
    ], '48,768'),
    ge(2, 3, 'prompted', 'Estimate 61,900 + 28,400 to the nearest ten-thousand, then decide whether 90,300 is reasonable.', [
      { childDo: 'Round each addend, add the rounded numbers, and compare to the exact total.', expected: 'about 90,000' },
    ], 'about 90,000; 90,300 is reasonable'),
    ge(2, 4, 'independent', 'A town had 52,000 residents. 6,400 moved away, then 3,900 arrived. Find the new population, then check with an estimate.', [
      { childDo: 'Take the departures off the start, add the arrivals, and estimate to check.', expected: '49,500' },
    ], '49,500'),
  ],
  days: [
    // Day 1 — concept echo: single-step ± only, blocked (no premature interleaving)
    [
      { gen: wRound, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: wDigit, diff: 2 },
      { gen: distTrip, diff: 2 },
      { gen: moneySpend, diff: 3 },
      { gen: popGrow, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition + a multi-step enter
    [
      { gen: wCompare, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: costEstimate, diff: 3 },
      { gen: discrimGap, diff: 3 },
      { gen: popCompare, diff: 3 },
      { gen: msMoneyBudget, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wRound, diff: 2 },
      { gen: distTrip, diff: 3 },
      { gen: popCompare, diff: 4 },
      { gen: discrimArrive, diff: 3 },
      { gen: msPopChange, diff: 4 },
      { gen: msDistance, diff: 3 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msPopChange, diff: 5 },
      { gen: msMoneyBudget, diff: 4 },
      { gen: msDistance, diff: 4 },
      { gen: popGrow, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaWrongOp, diff: 4 },
      {
        gen: reasoning({
          prompt: 'When you subtract from a number with a row of zeros in the middle, those zeros have nothing to lend. Explain, in your own words, why the borrow has to travel to a farther-left place — and how a quick estimate would warn you if you skipped it.',
          value: 'a zero cannot lend, so the borrow moves left to the first place that can, and an estimate flags a skipped borrow',
          acceptableForms: ['borrow', 'ripple', 'estimate', 'nothing to lend'],
          hints: ['What can a place holding zero lend when the column beside it needs to borrow?', 'Follow the borrow as it hops left to the first place that has something to give.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Without computing exactly: is 48,712 + 39,650 closer to 80,000 or to 90,000? In one sentence, say how you know.',
          correct: '90,000',
          distractors: [
            { text: '80,000', errorTag: 'procedure-slip', rationale: 'Rounds both addends down instead of to the nearest ten-thousand.' },
            { text: '100,000', errorTag: 'concept-misconception', rationale: 'Over-rounds each addend up a whole place.' },
          ],
          hints: ['Which two ten-thousands does each number land between when you round it?', 'Round each addend to the nearest ten-thousand, then add the rounded numbers.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D2-PZ-01',
    title: 'Puzzle Grove: The Number Machine',
    puzzleType: 'logic',
    prompt: 'A number machine takes a starting number, ADDS 4,750, then SUBTRACTS 1,880, and out comes 32,470. What starting number went in? Work backwards, undoing the steps in reverse order, and explain why you undo the LAST operation first.',
    answer: { value: '29600', acceptableForms: ['29,600'], validation: 'exact-numeric' },
    hintLadder: ['To undo a machine, which operation do you reverse first — the first step or the last step?', 'Undo the subtract by adding it back, then undo the add by taking it away.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: distTrip, diff: 3 },
    { gen: msMoneyBudget, diff: 3 },
    { gen: moneySpend, diff: 3 },
    { gen: msPopChange, diff: 3 },
    { gen: popCompare, diff: 4 },
    { gen: msDistance, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step ± word problem (distance-left / spent-left / compare-difference). 02/04/06: two-step chain (spend-then-earn / shrink-then-grow / two-legs-off). No operand surface reused from Form A or the daily pages (pack-wide guard).',
  mistakeBank: [
    { errorTag: 'task-comprehension', subtype: 'add-vs-subtract', description: 'Reads a take-away story (spent, paid out, moved away, "how many more") as a join and adds instead of subtracting, or the reverse.', exampleWrongAnswer: 'a "how many more" question answered by adding the two counts', distractorRationale: 'Offer the add-instead-of-subtract result.', reteachPointer: 'the Day-2 add-or-subtract discrimination items, then guidedExamples/D2-GE-02' },
    { errorTag: 'procedure-slip', subtype: 'carry-or-borrow-drop', description: 'Forgets to carry a passed ten, or mishandles a borrow — especially across a row of zeros.', exampleWrongAnswer: 'a subtraction across zeros that skips the rippling borrow', distractorRationale: 'Offer the no-borrow result on across-zero items.', reteachPointer: 'explanation/script[1] (the borrow ripples over zeros)' },
    { errorTag: 'concept-misconception', subtype: 'misaligned-places', description: 'Lines the numbers up by the wrong edge, so unlike places get combined.', exampleWrongAnswer: 'a five-digit and a three-digit number added flush by the left edge', distractorRationale: 'Offer the misaligned-sum result.', reteachPointer: 'explanation/whyBeforeHow (a digit only ever meets its own place-value column)' },
    { errorTag: 'fact-recall', subtype: 'single-column-slip', description: 'A single-column add or subtract fact is wrong, throwing off the whole answer.', exampleWrongAnswer: 'a ones-column sum off by one', distractorRationale: 'Offer the off-by-one column total.', reteachPointer: '60-second single-column fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Adding and subtracting large numbers fluently with the standard algorithms — including the tricky borrow across a row of zeros — and choosing add vs subtract from the story, always estimating first so a slipped trade shows up.',
    improvingCandidates: ['carrying and borrowing cleanly across many columns', 'subtracting across zeros', 'choosing add or subtract from the story words', 'estimating before computing as a self-check'],
    strengtheningByTag: [
      { errorTag: 'task-comprehension', text: 'reading a story for whether it joins or takes away — the add-or-subtract discrimination items make the trap visible' },
      { errorTag: 'procedure-slip', text: 'the borrow across zeros — one across-zero subtraction stays in the warm-ups each week' },
      { errorTag: 'concept-misconception', text: 'lining numbers up by place, ones under ones, before working' },
    ],
    homeFocus: {
      praiseLine: 'You estimated first, then lined up the places and traded across the zeros exactly where the columns needed it — that is the whole skill in one move.',
      questionForChild: 'Before you solve 50,004 − 1,236, what is a quick estimate — and how will it tell you if your answer is off?',
      schoolSyncHook: 'If your child\'s class uses a particular subtraction layout, tell us and we will match it in the models.',
    },
    vocabularyForParent: ['regroup / carry (trade up a place)', 'borrow (trade down a place)', 'estimate (a rounded check)'],
  },
});
