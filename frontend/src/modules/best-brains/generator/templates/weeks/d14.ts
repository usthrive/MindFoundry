/**
 * Level D · Week 14 — "± decimals" (conceptId: addsub-decimals). Column add/sub
 * with alignment reasoning in money-change and measurement contexts.
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rebuilt from the v1 file to
 * clear the 13 pedagogical gates + QG-11, mirroring the D4 exemplar's shape:
 *  - Genuine multi-step DECIMAL word problems via lib/multistep (buy-two-then-make
 *    change; three-price total; cut-then-tie-on) — answer + step-count come from
 *    the shipped decimal op-chain (evalDecChain), never hand-typed.
 *  - A code-generated error-analysis item (right-align misalignment) whose shown
 *    "wrong" number and true sum are both re-derived by QG-11 (d_verify_dec_v1) —
 *    fabrication is impossible.
 *  - Discrimination traps (align-the-point vs right-justify; where the filler zero
 *    goes) forcing a SET-UP choice by Day 2/3.
 *  - Metacognition (estimate-first) woven into Day 2 core AND modeled in the script.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free / number-free; each core
 *    generator reused <= 2x; rung-1 of every core hint is an orienting question.
 *  - Distinct names drawn fresh per item from a module pool (never a hardcoded name
 *    that is also in the draw pool).
 */

import { asWarmup, classify, decCompareChoice, decRound, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStepDec } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { addDec, subDec } from '../lib/compute';
import { bill, money } from '../lib/format';
import { columnMethod, numberLine } from '../lib/figures';
import { ge, makeWeekBuilder } from '../lib/assemble';
import type { Rng } from '../../rng';

const C12 = { level: 'C' as const, week: 12 };
const D12 = { level: 'D' as const, week: 12 };
const D13 = { level: 'D' as const, week: 13 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const pad2 = (n: number) => String(n).padStart(2, '0');
/** One-place decimal string with whole part in [lo,hi] (e.g. "3.7"). */
const dec1 = (r: Rng, lo: number, hi: number) => `${r.int(lo, hi)}.${r.int(1, 9)}`;
/** Two-place decimal string with whole part in [lo,hi] (e.g. "1.27"). */
const dec2 = (r: Rng, lo: number, hi: number) => `${r.int(lo, hi)}.${pad2(r.int(0, 95))}`;
/** Two-place "cents" string with whole part in [lo,hi] and non-zero cents (e.g. "1.27"). */
const cents = (r: Rng, lo: number, hi: number) => `${r.int(lo, hi)}.${pad2(r.int(5, 95))}`;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wRound = asWarmup(decRound(2), D13);
const wCompare = asWarmup(decCompareChoice(), D12);

// --- Single-step decimal situations (fixed, role-based, name-free hints) --------
const sJoinLen = situation({
  situationType: 'measurement', cognitiveOp: 'dec-add',
  draw: (r) => {
    const a = dec1(r, 2, 9); const b = dec2(r, 1, 8);
    return {
      prompt: `A walking path has two sections. The first is ${a} km and the second is ${b} km. How long is the whole path?`,
      answerValue: addDec(a, b), templateId: 'd_dec_addsub_v1', params: { a, b, op: 1 }, units: 'km',
      hints: ['Do the two sections join into one length, or are you comparing them?', 'Stack the two lengths with their points aligned, filling a short one with a zero.'],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

const sLeftLen = situation({
  situationType: 'measurement', cognitiveOp: 'dec-sub',
  draw: (r) => {
    const a = cents(r, 6, 12); const b = dec1(r, 1, 4);
    return {
      prompt: `A ribbon is ${a} m long. A piece ${b} m long is cut off. How much ribbon is left?`,
      answerValue: subDec(a, b), templateId: 'd_dec_addsub_v1', params: { a, b, op: -1 }, units: 'm',
      hints: ['Are you taking a piece away, or joining pieces together?', 'Write the longer length with a filler zero so every place lines up before you subtract.'],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

const sSpendMoney = situation({
  situationType: 'money-change', cognitiveOp: 'dec-sub',
  draw: (r) => {
    const a = cents(r, 12, 40); const b = cents(r, 2, 9); const name = r.pick(NAMES);
    const ans = subDec(a, b);
    return {
      prompt: `${name} has ${money(a)} and spends ${money(b)} on lunch. How much money is left?`,
      answerValue: ans, templateId: 'd_dec_addsub_v1', params: { a, b, op: -1 }, units: 'dollars',
      hints: ['Does spending take money away, or add to what is left?', 'Line the dollars over the dollars and the cents over the cents before you take one away.'],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

const sBuyTotal = situation({
  situationType: 'combine', cognitiveOp: 'dec-add',
  draw: (r) => {
    const a = cents(r, 3, 12); const b = cents(r, 1, 6); const name = r.pick(NAMES);
    const ans = addDec(a, b);
    return {
      prompt: `${name} buys a book for ${money(a)} and a pen for ${money(b)}. What is the total cost?`,
      answerValue: ans, templateId: 'd_dec_addsub_v1', params: { a, b, op: 1 }, units: 'dollars',
      hints: ['Do the two prices combine into one total, or is one taken from the other?', 'Stack the two prices with the points aligned, keeping two cents places on each.'],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

// Metacognition base: a per-month rate, ever served only through the estimate wrapper.
const sRateMoney = situation({
  situationType: 'rate', cognitiveOp: 'dec-add',
  draw: (r) => {
    const a = cents(r, 5, 15); const b = cents(r, 1, 6); const name = r.pick(NAMES);
    const ans = addDec(a, b);
    return {
      prompt: `${name}'s basic plan costs ${money(a)} a month. The bigger plan costs ${money(b)} more each month. What does the bigger plan cost a month?`,
      answerValue: ans, templateId: 'd_dec_addsub_v1', params: { a, b, op: 1 }, units: 'dollars',
      hints: ['Does "more each month" add onto the base price, or take from it?', 'Align the two monthly prices by the point, then add place by place.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});
const sRateEstimate = withEstimateFirst(
  sRateMoney,
  'should the bigger plan come out above or below the basic plan?',
);

// --- Multi-step decimal problems (exact decimal op-chain; role-based hints) ------
const mChange = multiStepDec({
  situationType: 'money-change', cognitiveOp: 'multi-step',
  draw: (r) => {
    const billValue = r.pick([10, 20]);
    const p1 = cents(r, 1, 3); const p2 = cents(r, 1, 3); const name = r.pick(NAMES);
    return {
      prompt: `${name} pays with a ${bill(billValue)} bill for a book costing ${money(p1)} and a pen costing ${money(p2)}. How much change should ${name} get back?`,
      init: String(billValue), steps: [{ op: 'sub', v: p1 }, { op: 'sub', v: p2 }], units: 'dollars',
      hints: ['Does this ask for the total spent, or the change handed back?', 'Add the two prices with the points aligned, then take that total from the bill.'],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

const mThreeTotal = multiStepDec({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = cents(r, 2, 6); const b = cents(r, 1, 5); const c = cents(r, 1, 4); const name = r.pick(NAMES);
    return {
      prompt: `${name} buys three snacks costing ${money(a)}, ${money(b)}, and ${money(c)}. What is the total cost of all three?`,
      init: a, steps: [{ op: 'add', v: b }, { op: 'add', v: c }], units: 'dollars',
      hints: ['Do the three prices build one running total, or is something taken away?', 'Add the first two with the points aligned, then add the third onto that.'],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

const mCutTie = multiStepDec({
  situationType: 'measurement', cognitiveOp: 'multi-step',
  draw: (r) => {
    const a = dec1(r, 8, 15); const b = cents(r, 1, 4); const c = dec1(r, 1, 3); const name = r.pick(NAMES);
    return {
      prompt: `A rope is ${a} m long. ${name} cuts off ${b} m, then ties on another ${c} m. How long is the rope now?`,
      init: a, steps: [{ op: 'sub', v: b }, { op: 'add', v: c }], units: 'm',
      hints: ['Are you only cutting, or cutting first and then adding a piece on?', 'Line up the points to subtract the cut, then align again to add the new piece.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (set-up choice; fixed name-free hints) -----------------
const discrimAlign = discrimination({
  variant: 'structural', cognitiveOp: 'choose-setup',
  draw: (r) => {
    const a = dec1(r, 2, 8); const b = dec2(r, 1, 6);
    return {
      prompt: `To add ${a} + ${b} correctly, what should you set up FIRST?`,
      correct: 'line up the decimal points, then add place by place',
      correctForms: ['align the decimal points', 'line up the points'],
      distractors: [
        { text: 'line up the right-hand digits, then add', errorTag: 'representation-misread', rationale: 'Right-justifying puts unlike places together, so tenths get added to hundredths.' },
        { text: 'drop both points, add as whole numbers, then guess where the point goes', errorTag: 'concept-misconception', rationale: 'Ignores place value entirely and leaves the point to chance.' },
      ],
      hints: ['Which parts of the two numbers have to meet before you can add?', 'Picture the points stacked in one column, tenths over tenths.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

const discrimFillZero = discrimination({
  variant: 'structural', cognitiveOp: 'choose-setup',
  draw: (r) => {
    const whole = r.int(3, 8); const t = r.int(1, 9);
    const value = `${whole}.${t}`;
    return {
      prompt: `You are about to subtract with ${value}, which stops at the tenths place. How should you rewrite it so it lines up with a number that goes to hundredths?`,
      correct: `write a zero in the empty hundredths place (${value}0)`,
      correctForms: ['add a trailing zero', 'fill the hundredths with a zero'],
      distractors: [
        { text: `slide the digits over so the ${t} moves to the hundredths place (0${value})`, errorTag: 'concept-misconception', rationale: 'Moving the digit changes its value; the tenths digit is no longer worth tenths.' },
        { text: 'leave it as it is and subtract only the digits that are already there', errorTag: 'representation-misread', rationale: 'Uneven columns line unlike places up under each other.' },
      ],
      hints: ['Where does the extra zero belong so the value does not change?', 'A zero on the empty end fills a place without moving any other digit.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth AND the shown wrong) --
const eaRightAlign = errorAnalysis({
  verifyTemplateId: 'd_verify_dec_v1', cognitiveOp: 'dec-add',
  drawParams: (r) => ({
    a: `${r.int(2, 8)}.${r.int(1, 9)}`,
    b: `${r.int(1, 6)}.${pad2(r.int(10, 95))}`,
    op: '+', wrongMode: 'right-align',
  }),
  build: (v, p) => ({
    prompt: `A student added ${p.a} + ${p.b}, stacking the two numbers with their right-hand edges in line, and wrote ${v.wrong}.`,
    extension: 'Show with a quick estimate and aligned columns why that is off, then write the true sum.',
    hints: ['Which feature of the two numbers has to line up before adding — the last digit, or the point?', 'Estimate by rounding each to the nearest whole; the true sum should sit near that.'],
    errorTags: ['representation-misread', 'concept-misconception'],
  }),
});

export const buildD14 = makeWeekBuilder({
  week: 14,
  conceptId: 'addsub-decimals',
  conceptName: 'Adding & subtracting decimals',
  strandTags: ['decimals-fractions', 'addition-subtraction'],
  prerequisiteWeeks: [D12, D13],
  pedagogyContract: 'v2',
  conceptualAnchor: 'aligned decimal point',
  explanation: {
    hook: 'The whole secret of adding decimals is one small move: line up the points. Do that and adding tenths to hundredths is just column work. Skip it and every digit drifts into the wrong place.',
    whyBeforeHow:
      'Decimals add and subtract place by place, exactly like whole numbers, because tenths can only join tenths and hundredths only hundredths — that is why the aligned decimal point is the whole method: it forces every digit over its matching place before a single column is added. A number that stops at tenths can wear an extra zero so the columns stay even, since a zero on the empty right end fills a place without changing the value. Estimating first keeps a point that has drifted from slipping past unnoticed.',
    script: [
      {
        say: 'Watch: to add a value written to tenths and one written to hundredths, I stack them and line up the points, then let the shorter one wear a filler zero so every column has a partner.',
        visual: '4.75 stacked over 3.9 with the points lined up, the filler zero shaded in the hundredths place, and 8.65 under the line.',
        // The week's own pair: segment three flags 9 as the ballpark and 8.65 as
        // the exact total, so this is that total being made. The filler zero is
        // written into 3.9 rather than described, and its column is the shaded
        // one — a hundredths column with a partner in both rows is the entire
        // claim of the say. The point is drawn down every row by pointAfterCol,
        // so the alignment is visible instead of asserted.
        figure: columnMethod(
          {
            op: '+',
            pointAfterCol: 0,
            rows: [
              { cells: ['1', '', ''], role: 'carry' },
              { cells: ['4', '7', '5'], role: 'operand' },
              { cells: ['3', '9', '0'], role: 'operand' },
              { cells: ['8', '6', '5'], role: 'result' },
            ],
            highlightCols: [2],
          },
          {
            alt:
              '4.75 stacked over 3.90 with the decimal points in one line, the filler zero standing under the 5 in ' +
              'the shaded hundredths column, a carried 1 above the ones, and 8.65 under the line',
          },
        ),
      },
      {
        say: 'Subtraction is the same picture: I fill the shorter number with a zero, then take each column, borrowing where a place cannot pay.',
        visual: '5.2 written as 5.20 over 1.86, with the borrow marked across the hundredths and the answer line left empty.',
        // The same apparatus running backwards. The result row is left EMPTY on
        // purpose: this subtraction is what guidedExamples[1] hands the child to
        // finish, so the picture stops where the say stops — the rule is ruled
        // and the aligned point under it shows where the answer's point will go.
        // The rewritten digits ride in the carry row, the one place a two-digit
        // note ("10 hundredths") is allowed.
        figure: columnMethod(
          {
            op: '−',
            pointAfterCol: 0,
            rows: [
              { cells: ['4', '1', '10'], role: 'carry' },
              { cells: ['5', '2', '0'], role: 'operand', struck: [0, 1, 2] },
              { cells: ['1', '8', '6'], role: 'operand' },
              { cells: ['', '', ''], role: 'result' },
            ],
            highlightCols: [2],
          },
          {
            alt:
              '5.20 stacked over 1.86 with the points in one line, every digit of 5.20 struck through and rewritten ' +
              'small above it as 4, 1 and 10 where the borrow crossed the shaded hundredths column, and the answer ' +
              'line ruled and still empty',
          },
        ),
      },
      {
        say: 'Before I compute I estimate: round each number to the nearest whole and add — the exact answer should land near that, so a wandering point that jumps far off is easy to catch as unreasonable.',
        visual: 'A number line from 8 to 10 with the rounded ballpark 9 flagged and the exact total 8.65 marked just to its left.',
        figure: numberLine(
          {
            min: 8,
            max: 10,
            step: 1,
            partition: 10,
            labels: 'majors',
            marks: [
              { at: 9, label: 'about 9', style: 'flag' },
              { at: 8.65, label: '8.65', style: 'point' },
            ],
          },
          { alt: 'a number line from 8 to 10 stepped in tenths, with a flag on 9 for the rounded ballpark and a dot on 8.65 for the exact total' },
        ),
      },
    ],
    summary: 'Line up the decimal points, fill short numbers with a zero on the right, then add or subtract by place. Estimate first to catch a misplaced point.',
    vocabulary: [
      { term: 'align the points', kidGloss: 'stack the numbers so each place meets its match' },
      { term: 'filler zero', kidGloss: 'a zero on the empty right end that keeps the columns even without changing the value' },
      { term: 'estimate', kidGloss: 'a rounded ballpark used to check the answer is sensible' },
    ],
  },
  guidedExamples: [
    ge(14, 1, 'modeled', 'Add 3.6 + 2.45.', [
      { teacherSay: 'I notice these two numbers stop at different places, so before I add I stack them and line up the points — watch me give 3.6 a filler zero to make it 3.60.' },
      { teacherSay: 'Now I add straight down each column, hundredths first, then tenths, then ones: what does the sum come to?', expected: '6.05' },
    ], '6.05'),
    ge(14, 2, 'completion', 'Subtract 5.2 − 1.86.', [
      { teacherSay: 'What should we write 5.2 as so it lines up with a number that goes to hundredths?', expected: '5.20' },
      { childDo: 'Line up the points and subtract, borrowing where a column cannot pay.', expected: '3.34' },
    ], '3.34'),
    ge(14, 3, 'prompted', 'Add 4.75 + 3.9.', [
      { childDo: 'Estimate about how big the sum should be, then align, fill, and add.', expected: '8.65' },
    ], '8.65'),
    ge(14, 4, 'independent', 'A jug holds 6.4 L. You pour in 1.85 L more, then use 2.5 L. How much is in the jug now? Solve cold.', [
      { childDo: 'Align and add the pour, then align and subtract what was used.', expected: '5.75' },
    ], '5.75 L'),
  ],
  days: [
    // Day 1 — concept echo: single-step alignment only, blocked (no interleaving yet)
    [
      { gen: wMul, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: sJoinLen, diff: 2 },
      { gen: sSpendMoney, diff: 2 },
      { gen: sLeftLen, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition + first multi-step
    [
      { gen: wMul, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: sBuyTotal, diff: 3 },
      { gen: sRateEstimate, diff: 3 },
      { gen: discrimAlign, diff: 3 },
      { gen: mChange, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wCompare, diff: 2 },
      { gen: sJoinLen, diff: 3 },
      { gen: sLeftLen, diff: 3 },
      { gen: discrimFillZero, diff: 3 },
      { gen: mThreeTotal, diff: 4 },
      { gen: discrimAlign, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; 4 situation types week-wide)
    [
      { gen: mChange, diff: 4 },
      { gen: mThreeTotal, diff: 4 },
      { gen: mCutTie, diff: 5 },
      { gen: sBuyTotal, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaRightAlign, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Why can we write a decimal that stops at tenths with an extra zero on the RIGHT (like turning 2.5 into 2.50) when adding, but NOT with a zero tucked in the middle (2.05)? Explain with place value.',
          value: 'a zero on the right fills an empty hundredths place and keeps the same value; a zero in the middle shifts the 5 into hundredths, changing the value',
          acceptableForms: [],
          hints: ['Where does each added zero land in the number?', 'A trailing zero fills an empty place; a middle zero pushes a digit to a smaller place.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: adding a zero to the far RIGHT end of a decimal leaves its value unchanged. In one sentence, say how you know.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Treats a trailing zero as if it might move a digit; a zero on the empty right end never changes the value.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Reads a trailing zero as shifting the digits, which it does not.' },
          ],
          hints: ['Does a zero on the empty right end move any other digit to a new place?', 'Picture the place chart: the filled digits stay exactly where they were.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D14-PZ-01',
    title: 'Puzzle Grove: Point Patrol',
    puzzleType: 'logic',
    prompt: 'A shopper hands over a $20 bill for a notebook that costs $6.85 and a marker that costs $2.40. Work out the exact change, then explain the one set-up habit that keeps the cents from drifting.',
    answer: { value: 'change $10.75; align every amount by the decimal point (whole dollars are 20.00) before adding or subtracting', acceptableForms: ['10.75', '$10.75'], validation: 'short-text-keyword' },
    hintLadder: ['Does the receipt want the total spent, or what is left of the bill?', 'Total the two prices with the points aligned, then take that from 20.00.'],
    errorTags: ['task-comprehension', 'representation-misread'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sJoinLen, diff: 3 },
    { gen: mChange, diff: 3 },
    { gen: sSpendMoney, diff: 3 },
    { gen: mThreeTotal, diff: 3 },
    { gen: sLeftLen, diff: 4 },
    { gen: mCutTie, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step alignment (join lengths / spend money / cut a length — filler-zero affordance preserved). 02/04/06: multi-step decimal chain (make change / three-price total / cut-then-tie-on). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'representation-misread', subtype: 'right-align', description: 'Lines the decimals up by the right edge instead of the point, so unlike places are added or subtracted.', exampleWrongAnswer: '2.5 + 1.75 set up right-justified', distractorRationale: 'Offer the right-aligned setup / result.', reteachPointer: 'explanation/script[0] (align the points, fill with a zero)' },
    { errorTag: 'procedure-slip', subtype: 'borrow-slip', description: 'Chooses the right setup but mishandles a borrow across decimal places.', exampleWrongAnswer: '6.3 − 1.47 answered as 4.93', distractorRationale: 'Offer a no-borrow difference.', reteachPointer: 'guidedExamples/D14-GE-02 (fill with a zero, then borrow)' },
    { errorTag: 'concept-misconception', subtype: 'zero-placement', description: 'Puts a filler zero in the wrong place (2.5 → 2.05 instead of 2.50), shifting a digit.', exampleWrongAnswer: '2.5 rewritten as 2.05', distractorRationale: 'Offer the shifted-digit rewrite.', reteachPointer: 'Day-5 reasoning (trailing vs middle zero) and explanation/vocabulary (filler zero)' },
    { errorTag: 'task-comprehension', subtype: 'change-vs-total', description: 'In a money problem, reports the total spent instead of the change (or the reverse), losing the two-step structure.', exampleWrongAnswer: 'change given as the sum of the two prices', distractorRationale: 'Offer the total-spent value where change was asked.', reteachPointer: 'Day-4 make-change multi-step, then puzzle D14-PZ-01 (whole dollars are 20.00)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Adding and subtracting decimals by lining up the decimal points, filling short numbers with a zero on the right so the columns stay even, and estimating first to catch a misplaced point — mostly in money-change and measurement contexts, including two-step "make change" problems.',
    improvingCandidates: ['lining up the decimal points before computing', 'filling with a trailing zero to keep columns even', 'estimating to check the answer is reasonable', 'holding a two-step money problem (total, then change)'],
    strengtheningByTag: [
      { errorTag: 'representation-misread', text: 'aligning by the decimal point, never the right edge — the warm-ups reinforce this' },
      { errorTag: 'concept-misconception', text: 'placing a filler zero on the right (2.50, not 2.05) so no digit shifts' },
      { errorTag: 'procedure-slip', text: 'borrowing cleanly across decimal places' },
      { errorTag: 'task-comprehension', text: 'keeping the two steps of a make-change problem straight — total spent, then change' },
    ],
    homeFocus: {
      praiseLine: 'You lined up the decimal points and gave the shorter number a filler zero before adding — that one habit keeps every place over its match.',
      questionForChild: 'Before you add 3.6 + 2.45, what is a quick estimate — and how would it tell you if your point had drifted?',
      schoolSyncHook: 'If your child\'s class uses grid paper or money to align decimals, tell us and we will match that support.',
    },
    vocabularyForParent: ['align the points (stack place over place)', 'filler zero (a trailing zero that keeps columns even)', 'estimate (a rounded check for reasonableness)'],
  },
});
