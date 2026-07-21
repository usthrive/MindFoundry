/**
 * Level D · Week 2 — "Multi-digit ± fluency" (conceptId: multi-digit-add-sub-fluency).
 * Standard algorithms to 6 digits with estimation checks; Day-5 error-analysis
 * of a hidden borrowed-zero slip. Composed from the shared library.
 * Retrieval (QG-2): D1 place value/rounding, C3/C4 ±within 1,000, C12 × facts.
 */

import { addWhole, asWarmup, classify, compareWhole, digitValue, multiply, reasoning, roundWhole, subWhole } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C12 = { level: 'C' as const, week: 12 };
const D1 = { level: 'D' as const, week: 1 };

const wRound = asWarmup(roundWhole(3, 12000, 890000), D1);
const wDigit = asWarmup(digitValue(6), D1);
const wCompare = asWarmup(compareWhole(6), D1);
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);

export const buildD02 = makeWeekBuilder({
  week: 2,
  conceptId: 'multi-digit-add-sub-fluency',
  conceptName: 'Multi-digit addition & subtraction fluency',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [C3, C4, D1],
  explanation: {
    hook: 'Adding six-digit numbers uses the SAME move you learned for two digits: line up the places, work the ones first, and trade a ten when a column overflows. Nothing new — just more columns.',
    whyBeforeHow:
      'Every column holds one place value, so it can carry at most nine before it must trade ten of itself for one of the next place up. Subtraction runs the trade backward: when a column cannot pay, it borrows one from the place to its left. Lining places up is what makes the trades legal — a digit only ever meets its own place.',
    script: [
      { say: 'Stack the numbers so ones sit over ones. Add the ones; if you pass ten, carry one to the tens.', visual: 'Two 5-digit numbers align; a carried 1 hops to the next column.' },
      { say: 'Subtracting across a zero: the zero has nothing to lend, so borrow from the next place that does — the trade ripples over.', visual: 'A row of zeros lights up; a borrow ripples left to right.' },
      { say: 'Estimate first with rounded numbers. If your careful answer is far from the estimate, a trade went wrong.', visual: 'Rounded numbers give a ballpark; the exact answer lands beside it.' },
    ],
    summary: 'Line up places, work ones-first, trade a ten when a column overflows (or borrow when it cannot pay). Estimate first so a slipped trade shows up.',
    vocabulary: [
      { term: 'regroup / carry', kidGloss: 'trade ten of one place for one of the next place up' },
      { term: 'borrow', kidGloss: 'take one from the place on the left when a column cannot pay' },
      { term: 'estimate', kidGloss: 'a rounded ballpark to check the exact answer against' },
    ],
  },
  guidedExamples: [
    ge(2, 1, 'modeled', '34,687 + 8,455 with the standard algorithm.', [
      { teacherSay: 'Ones: 7 + 5 = 12, write 2 carry 1. Keep going leftward, carrying when a column passes ten.', expected: '43,142' },
    ], '43,142'),
    ge(2, 2, 'completion', '50,004 − 1,236 (subtract across zeros).', [
      { teacherSay: 'The ones column: 4 cannot pay 6, and the zeros to the left have nothing to lend.' },
      { childDo: 'Borrow from the first place that has something, then subtract.', expected: '48,768' },
    ], '48,768'),
    ge(2, 3, 'prompted', 'Estimate 61,900 + 28,400, then say if 90,300 is reasonable.', [
      { teacherSay: 'Round each to the nearest ten-thousand.', expected: '60,000 + 30,000 = 90,000' },
      { childDo: 'Is the exact answer close to the estimate?', expected: 'yes' },
    ], 'yes, ~90,000'),
    ge(2, 4, 'independent', '204,613 − 97,508. Solve cold, then check with an estimate.', [
      { childDo: 'Subtract place by place, borrowing where needed; estimate to check.', expected: '107,105' },
    ], '107,105'),
  ],
  days: [
    [
      { gen: wRound, diff: 2 },
      { gen: addWhole(1200, 89999), diff: 2 },
      { gen: subWhole(1200, 89999), diff: 3 },
      { gen: addWhole(12000, 899999), diff: 3 },
      { gen: subWhole(12000, 899999, true), diff: 3 },
      { gen: addWhole(1200, 89999), diff: 4 },
    ],
    [
      { gen: wDigit, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: subWhole(1200, 89999), diff: 3 },
      { gen: addWhole(12000, 899999), diff: 3 },
      { gen: subWhole(12000, 899999, true), diff: 4 },
      { gen: subWhole(1200, 89999), diff: 4 },
    ],
    [
      { gen: wCompare, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: addWhole(1200, 89999), diff: 3 },
      { gen: subWhole(12000, 899999, true), diff: 3 },
      { gen: addWhole(12000, 899999), diff: 4 },
      { gen: subWhole(1200, 89999), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: addWhole(12000, 780000), diff: 4 },
      { gen: subWhole(12000, 890000, true), diff: 4 },
      { gen: addWhole(1200, 89999), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'A student wrote 6,000 − 2,437 = 4,637. Explain, in one line, where the subtraction went wrong.',
          value: 'the borrow across the zeros was skipped',
          acceptableForms: ['borrow', 'regroup', 'across zeros'],
          keywords: true,
          hints: ['Estimate: 6,000 − 2,400 is about 3,600 — is 4,637 close?', 'Watch the borrowing across the row of zeros.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Without computing exactly: is 48,712 + 39,650 closer to 80,000 or 90,000?',
          correct: '90,000',
          distractors: [
            { text: '80,000', errorTag: 'procedure-slip', rationale: 'Rounds both down instead of to the nearest ten-thousand.' },
            { text: '100,000', errorTag: 'concept-misconception', rationale: 'Over-rounds each addend up a whole place.' },
          ],
          hints: ['Round each addend to the nearest ten-thousand and add.', '50,000 + 40,000 gives the ballpark.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Why do we line up the ones under the ones when we add, instead of the leftmost digits? Explain using the word "place".',
          value: 'each column must hold one place so digits of the same place add together',
          acceptableForms: ['place', 'same place', 'columns'],
          keywords: true,
          hints: ['What would happen if tens landed under hundreds?', 'Only same-place digits can be combined directly.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Make up a subtraction of two 4-digit numbers that needs borrowing across a zero, then solve it and show your check. (Written work required.)',
          value: 'answers vary; a middle zero forces a rippling borrow, checked by adding back',
          acceptableForms: [],
          hints: ['Put a 0 in the tens or hundreds place of the top number.', 'Check by adding your answer to the number you subtracted.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D2-PZ-01',
    title: 'Puzzle Grove: The Missing Digits',
    puzzleType: 'logic',
    prompt: 'In the sum 3▢,4_1 + 2_,__9 the answer is 61,200. Some digits are hidden. Find one set of digits that could make it work, and explain how the carries pin them down.',
    answer: { value: 'answers vary; the carries fix each hidden digit in turn', acceptableForms: [], validation: 'manual-review' },
    hintLadder: ['Start at the ones column — what must it be to end in 0?', 'Track each carry leftward; each column limits the next.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: addWhole(1200, 89999), diff: 3 },
    { gen: subWhole(1200, 89999), diff: 3 },
    { gen: addWhole(12000, 899999), diff: 3 },
    { gen: subWhole(12000, 899999, true), diff: 4 },
    { gen: addWhole(12000, 899999), diff: 4 },
    { gen: subWhole(1200, 89999), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01: 4–5-digit sum. 02: 4–5-digit difference. 03: 5–6-digit sum. 04: subtraction across zeros (borrow-ripple affordance preserved). 05: 5–6-digit sum. 06: 4–5-digit difference. No operand surface reused from Form A or the daily pages (pack-wide guard).',
  mistakeBank: [
    { errorTag: 'procedure-slip', subtype: 'carry-or-borrow-drop', description: 'Forgets to carry a passed ten, or mishandles a borrow — especially across zeros.', exampleWrongAnswer: '6,000 − 2,437 → 4,637', distractorRationale: 'Offer the no-borrow result on across-zero items.', reteachPointer: 'explanation/script[1] (borrow ripples over zeros)' },
    { errorTag: 'concept-misconception', subtype: 'misaligned-places', description: 'Lines the numbers up by the left edge, so unlike places get combined.', exampleWrongAnswer: '452 + 38 stacked as 452 over 38 flush-left', distractorRationale: 'Offer the misaligned-sum result.', reteachPointer: 'Day-5 reasoning (only same-place digits combine)' },
    { errorTag: 'representation-misread', subtype: 'digit-swap', description: 'Copies a digit into the wrong column when re-writing the problem.', exampleWrongAnswer: 'reads 40,613 as 46,013', distractorRationale: 'Offer the digit-swapped total.', reteachPointer: 'guidedExamples/D2-GE-01 (keep columns tidy)' },
    { errorTag: 'fact-recall', subtype: 'single-column-slip', description: 'A single-column add/sub fact is wrong, throwing off the whole answer.', exampleWrongAnswer: '7 + 5 → 13', distractorRationale: 'Offer the off-by-one column total.', reteachPointer: '60-second single-column fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Adding and subtracting large numbers fluently with the standard algorithms — including the tricky borrow across a row of zeros — and always estimating first so a slipped trade shows up.',
    improvingCandidates: ['carrying and borrowing cleanly across many columns', 'subtracting across zeros', 'estimating before computing as a self-check'],
    strengtheningByTag: [
      { errorTag: 'procedure-slip', text: 'the borrow across zeros — one across-zero subtraction stays in the warm-ups each week' },
      { errorTag: 'concept-misconception', text: 'lining numbers up by place, ones under ones, before working' },
      { errorTag: 'fact-recall', text: 'quick single-column facts so the algorithm never stalls — the sprints target these' },
    ],
    homeFocus: {
      praiseLine: 'You estimated first and your exact answer landed right beside the ballpark — that habit catches almost every slip.',
      questionForChild: 'Before you solve 50,004 − 1,236, what is a quick estimate — and how will it tell you if your answer is off?',
      schoolSyncHook: 'If your child\'s class uses a particular subtraction layout, tell us and we will match it in the models.',
    },
    vocabularyForParent: ['regroup / carry (trade up a place)', 'borrow (trade down a place)', 'estimate (a rounded check)'],
  },
});
