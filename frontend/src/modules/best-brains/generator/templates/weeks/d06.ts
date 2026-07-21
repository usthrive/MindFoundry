/**
 * Level D · Week 6 — "Division with remainders" (conceptId: division-with-remainders).
 * 1-digit divisors; sharing model → written method; remainder notation. Day-5:
 * "same computation, four different answers." Retrieval: D5 ×, D3 factors, C12 × facts.
 */

import { asWarmup, classify, divideRemainder, factorPair, multiply, reasoning, storyDivideUse } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D3 = { level: 'D' as const, week: 3 };
const D5 = { level: 'D' as const, week: 5 };

const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wArea = asWarmup(multiply(11, 49, 3, 9), D5);
const wFactor = asWarmup(factorPair(), D3);

export const buildD06 = makeWeekBuilder({
  week: 6,
  conceptId: 'division-with-remainders',
  conceptName: 'Division with remainders',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D3, D5],
  explanation: {
    hook: 'Share 47 stickers among 5 friends and everyone gets 9 — with 2 left over that just won\'t split evenly. That leftover has a name: the remainder. It is not a mistake; it is information.',
    whyBeforeHow:
      'Division is repeated fair sharing until you cannot make another whole group. The remainder is what is left when fair sharing stops — always smaller than the divisor, or the sharing is not finished. The written method is bookkeeping for the sharing story, one place value at a time, and you can always check it: quotient × divisor + remainder returns the number you started with.',
    script: [
      { say: 'Share 47 among 5: each gets 9 (that\'s 45), and 2 are left. Write 9 R 2.', visual: 'Blocks share into 5 piles of 9; two blocks sit outside.' },
      { say: 'The remainder must be less than the divisor. A remainder of 5 or more means another whole group still fits.', visual: 'A too-big leftover regroups into one more share.' },
      { say: 'Check every answer: 9 × 5 + 2 = 47. If it doesn\'t rebuild the start, something slipped.', visual: 'quotient × divisor + remainder rebuilds the original.' },
    ],
    summary: 'Share into equal groups until you cannot; the leftover is the remainder (always less than the divisor). Check with quotient × divisor + remainder.',
    vocabulary: [
      { term: 'quotient', kidGloss: 'how many each share gets' },
      { term: 'remainder', kidGloss: 'what is left when fair sharing stops' },
      { term: 'divisor', kidGloss: 'how many groups you share into' },
    ],
  },
  guidedExamples: [
    ge(6, 1, 'modeled', '38 ÷ 4 with the sharing model.', [
      { teacherSay: 'Four groups: each gets 9 (that\'s 36), and 2 are left. 38 ÷ 4 = 9 R 2. Check: 9 × 4 + 2 = 38.', expected: '9 R 2' },
    ], '9 R 2'),
    ge(6, 2, 'prompted', '53 ÷ 6.', [
      { teacherSay: 'How many 6s fit in 53?', expected: '8, since 8 × 6 = 48' },
      { childDo: 'Find the remainder.', expected: '5' },
    ], '8 R 5'),
    ge(6, 3, 'independent', '75 ÷ 8. Solve cold and check.', [
      { childDo: 'Divide, then verify with quotient × divisor + remainder.', expected: '9 R 3' },
    ], '9 R 3'),
  ],
  days: [
    [
      { gen: wMulFact, diff: 2 },
      { gen: divideRemainder(3, 6, 20, 59), diff: 2 },
      { gen: divideRemainder(4, 8, 25, 79), diff: 3 },
      { gen: divideRemainder(3, 9, 30, 95), diff: 3 },
      { gen: divideRemainder(4, 7, 20, 69), diff: 3 },
      { gen: divideRemainder(5, 9, 40, 95), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: divideRemainder(3, 6, 20, 59), diff: 3 },
      { gen: divideRemainder(4, 8, 25, 79), diff: 3 },
      { gen: divideRemainder(5, 9, 40, 95), diff: 4 },
      { gen: divideRemainder(3, 9, 30, 95), diff: 4 },
    ],
    [
      { gen: wFactor, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: divideRemainder(4, 7, 20, 69), diff: 3 },
      { gen: divideRemainder(5, 9, 40, 95), diff: 3 },
      { gen: divideRemainder(3, 9, 30, 95), diff: 4 },
      { gen: divideRemainder(4, 8, 25, 79), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: storyDivideUse('round-up'), diff: 4 },
      { gen: storyDivideUse('drop'), diff: 4 },
      { gen: storyDivideUse('remainder'), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'For 47 ÷ 5 = 9 R 2, why must the remainder be less than 5? Explain with the sharing idea.',
          value: 'a remainder of 5 or more would make another whole group, so sharing is not finished',
          acceptableForms: ['less than', 'another group', 'divisor'],
          keywords: true,
          hints: ['What if 5 were left over?', 'A full group still fits means keep sharing.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: '29 cookies shared among 4 children. A student wrote 7 R 3. Is that right?',
          correct: 'yes, 7 R 3 is correct',
          distractors: [
            { text: 'no, it should be 6 R 5', errorTag: 'concept-misconception', rationale: 'Leaves a remainder (5) that is not smaller than the divisor (4).' },
            { text: 'no, it should be 7 R 1', errorTag: 'procedure-slip', rationale: 'Miscomputes the leftover (29 − 28 = 1 is a subtraction slip).' },
          ],
          hints: ['Is the remainder smaller than 4?', 'Check with 7 × 4 + 3.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'The computation 26 ÷ 4 = 6 R 2 can lead to FOUR different final answers depending on the story. Give one story that answers 6, and one that answers 7. (Written explanation required.)',
          value: 'drop-the-remainder stories answer 6; round-up (need a whole extra group) stories answer 7',
          acceptableForms: [],
          hints: ['When does a leftover force one more whole group?', 'When is a leftover simply ignored?'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Check whether 61 ÷ 7 = 8 R 5 is correct by rebuilding the start. Show the rebuild.',
          value: '8 × 7 + 5 = 61, so it is correct',
          acceptableForms: ['61', '8 × 7 + 5', 'correct'],
          keywords: true,
          hints: ['Multiply quotient by divisor, then add the remainder.', 'Does it return 61?'],
          errorTags: ['procedure-slip'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D6-PZ-01',
    title: 'Puzzle Grove: Leftover Riddle',
    puzzleType: 'logic',
    prompt: 'I divided a number of marbles by 6 and had a remainder of 4. The quotient was 7. How many marbles did I start with? Then: could the remainder ever have been 6? Explain.',
    answer: { value: '46 marbles; a remainder of 6 is impossible because it equals the divisor and would make another group', acceptableForms: ['46'], validation: 'short-text-keyword' },
    hintLadder: ['Rebuild with quotient × divisor + remainder.', 'A remainder must stay below the divisor.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: divideRemainder(3, 6, 20, 59), diff: 3 },
    { gen: divideRemainder(4, 8, 25, 79), diff: 3 },
    { gen: divideRemainder(3, 9, 30, 95), diff: 3 },
    { gen: divideRemainder(4, 7, 20, 69), diff: 3 },
    { gen: divideRemainder(5, 9, 40, 95), diff: 4 },
    { gen: divideRemainder(4, 8, 25, 79), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. All slots: a ÷ b with a genuine remainder (ordered pair quotient, remainder). Divisors and dividend ranges vary by slot; the remainder-is-smaller-than-divisor property is preserved throughout. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'remainder-too-big', description: 'Leaves a remainder equal to or larger than the divisor (stops sharing too early).', exampleWrongAnswer: '29 ÷ 4 → 6 R 5', distractorRationale: 'Offer a quotient one too small with an oversized remainder.', reteachPointer: 'explanation/script[1] (remainder must be smaller than divisor)' },
    { errorTag: 'procedure-slip', subtype: 'leftover-subtraction', description: 'Miscomputes the leftover after multiplying the quotient by the divisor.', exampleWrongAnswer: '29 − 28 → 3', distractorRationale: 'Offer an off-by-one remainder.', reteachPointer: 'guidedExamples/D6-GE-01 (check by rebuilding)' },
    { errorTag: 'fact-recall', subtype: 'quotient-fact-slip', description: 'Picks a quotient whose product overshoots or undershoots the dividend.', exampleWrongAnswer: '53 ÷ 6 → 9 (9 × 6 = 54 > 53)', distractorRationale: 'Offer a quotient whose product exceeds the dividend.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Division with remainders — sharing into equal groups until no whole group is left, writing the leftover as a remainder (always smaller than the divisor), and checking with quotient × divisor + remainder.',
    improvingCandidates: ['sharing to find the quotient and the leftover', 'keeping the remainder smaller than the divisor', 'checking division by rebuilding the start'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the rule that a remainder must stay below the divisor — the warm-ups keep this in view' },
      { errorTag: 'procedure-slip', text: 'computing the leftover accurately after finding the quotient' },
      { errorTag: 'fact-recall', text: 'quick multiplication facts that make choosing the quotient fast — the sprints target these' },
    ],
    homeFocus: {
      praiseLine: 'You checked 47 ÷ 5 by rebuilding: 9 × 5 + 2 = 47 — that self-check catches almost every remainder slip.',
      questionForChild: 'When you divide 29 by 4, why can\'t the remainder be 5 or more?',
      schoolSyncHook: 'If your child\'s class writes remainders a particular way (R, fraction, or decimal), tell us and we will match it.',
    },
    vocabularyForParent: ['quotient (how many each share gets)', 'remainder (what is left over)', 'divisor (how many groups)'],
  },
});
