/**
 * Level D · Week 7 — "Interpreting remainders" (conceptId: interpreting-remainders).
 * Multi-step division word problems; choosing the remainder's meaning. Day-5:
 * justify-your-choice in writing. Retrieval: D6 division, D5 ×, C12 × facts.
 */

import { asWarmup, classify, divideRemainder, multiply, reasoning, storyDivideUse } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D5 = { level: 'D' as const, week: 5 };
const D6 = { level: 'D' as const, week: 6 };

const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wArea = asWarmup(multiply(11, 49, 3, 9), D5);
const wDiv = asWarmup(divideRemainder(3, 9, 20, 89), D6);

export const buildD07 = makeWeekBuilder({
  week: 7,
  conceptId: 'interpreting-remainders',
  conceptName: 'Interpreting remainders',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D5, D6],
  explanation: {
    hook: 'The exact same division — 26 ÷ 4 = 6 R 2 — can answer 6, or 7, or 2, or "6 and a half," depending on the story. The math is done; now the STORY decides what the remainder means.',
    whyBeforeHow:
      'A remainder is real, but what to DO with it depends on the question. If a leftover still needs its own group (extra bus for extra riders), round up. If a leftover cannot complete a group (ribbons per bow), drop it. Sometimes the leftover itself is the answer (how many are left over). Interpreting is a reading skill riding on top of the arithmetic — restate the question after computing and ask, "what is this leftover, here?"',
    script: [
      { say: 'Buses: 26 kids, 4 per row... no — 26 riders, buses hold 4. 6 buses seat 24; 2 riders still need a seat, so round UP to 7 buses.', visual: 'Six full buses; two riders board a seventh.' },
      { say: 'Bows: 26 cm of ribbon, 4 cm per bow. Only 6 complete bows; the 2 leftover cm cannot make a bow, so DROP it.', visual: 'Six bows tied; a 2 cm scrap set aside.' },
      { say: 'Leftover-as-answer: 26 stickers among 4 friends — how many left over? The answer IS the remainder: 2.', visual: 'Two stickers glow as the answer.' },
    ],
    summary: 'Do the division, then let the story interpret the remainder: round up when a leftover needs its own group, drop it when it cannot complete one, or report the leftover itself.',
    vocabulary: [
      { term: 'round up', kidGloss: 'add a whole group for a leftover that still needs one' },
      { term: 'drop the remainder', kidGloss: 'ignore a leftover that cannot complete a group' },
      { term: 'remainder-as-answer', kidGloss: 'when the question asks for the leftover itself' },
    ],
  },
  guidedExamples: [
    ge(7, 1, 'modeled', '50 people, vans hold 8. How many vans are needed?', [
      { teacherSay: '50 ÷ 8 = 6 R 2. Two people still need a ride, so round UP: 7 vans.', expected: '7' },
    ], '7'),
    ge(7, 2, 'prompted', '50 cm of tape, 8 cm per gift. How many gifts can be wrapped?', [
      { teacherSay: 'Same division — but can the 2 leftover cm wrap a gift?', expected: 'no' },
      { childDo: 'Give the count of complete gifts.', expected: '6' },
    ], '6'),
    ge(7, 3, 'independent', '50 marbles shared among 8 friends. How many are left over? Solve cold.', [
      { childDo: 'Divide, then report the leftover itself.', expected: '2' },
    ], '2'),
  ],
  days: [
    [
      { gen: wMulFact, diff: 2 },
      { gen: storyDivideUse('round-up'), diff: 2 },
      { gen: storyDivideUse('drop'), diff: 3 },
      { gen: storyDivideUse('remainder'), diff: 3 },
      { gen: storyDivideUse('round-up'), diff: 3 },
      { gen: divideRemainder(4, 9, 25, 89), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: storyDivideUse('drop'), diff: 3 },
      { gen: storyDivideUse('remainder'), diff: 3 },
      { gen: storyDivideUse('round-up'), diff: 4 },
      { gen: storyDivideUse('drop'), diff: 4 },
    ],
    [
      { gen: wDiv, diff: 2 },
      { gen: wMulFact, diff: 2 },
      { gen: storyDivideUse('remainder'), diff: 3 },
      { gen: storyDivideUse('round-up'), diff: 3 },
      { gen: storyDivideUse('drop'), diff: 4 },
      { gen: storyDivideUse('remainder'), diff: 4 },
    ],
    [
      { gen: wMulFact, diff: 2 },
      { gen: storyDivideUse('round-up'), diff: 4 },
      { gen: storyDivideUse('drop'), diff: 4 },
      { gen: storyDivideUse('remainder'), diff: 5 },
    ],
    [
      {
        gen: classify({
          prompt: '"38 students, 5 to a tent. How many tents are needed?" What should be done with the remainder?',
          correct: 'round up — an extra tent for the leftover students',
          distractors: [
            { text: 'drop it — ignore the leftover students', errorTag: 'task-comprehension', rationale: 'Leaves the leftover students without a tent.' },
            { text: 'report the remainder as the answer', errorTag: 'concept-misconception', rationale: 'Answers "how many left over" when the question asked "how many tents."' },
          ],
          hints: ['Do the leftover students still need somewhere to sleep?', 'Restate the exact question after dividing.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Write two different questions about "45 cookies, 6 per box" — one whose answer is 7 and one whose answer is 3. Explain the difference. (Written explanation required.)',
          value: '"how many boxes to hold all cookies" rounds up to 8? — restate: 7 full boxes plus leftovers; leftover-as-answer gives 3',
          acceptableForms: [],
          hints: ['45 ÷ 6 = 7 R 3.', 'One question wants complete boxes; the other wants the leftover.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: '"How many full crates from 58 apples, 9 per crate?" Which interpretation fits?',
          correct: 'drop the remainder — count only full crates',
          distractors: [
            { text: 'round up — count a partial crate as full', errorTag: 'task-comprehension', rationale: 'A partial crate is not full, so it should not be counted.' },
            { text: 'the answer is the remainder', errorTag: 'concept-misconception', rationale: 'The question asks for crates, not leftover apples.' },
          ],
          hints: ['Does a partly-filled crate count as full?', 'Match the interpretation to the exact wording.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'A student always rounds remainders up. Give one story where that gives the WRONG answer, and explain. (Written explanation required.)',
          value: 'a "how many complete groups" story should drop the remainder; rounding up over-counts',
          acceptableForms: [],
          hints: ['Think of a story that wants only complete groups.', 'When is a leftover NOT enough for another group?'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D7-PZ-01',
    title: 'Puzzle Grove: Same Numbers, Four Answers',
    puzzleType: 'logic',
    prompt: 'Using 34 ÷ 4, write four short stories whose correct answers are 8, 9, 2, and "8 and a half." Label which interpretation each uses.',
    answer: { value: 'drop→8, round-up→9, remainder→2, share-the-remainder→8 1/2', acceptableForms: ['8', '9', '2'], validation: 'short-text-keyword' },
    hintLadder: ['34 ÷ 4 = 8 R 2 is the shared computation.', 'Change only the QUESTION, not the numbers.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: storyDivideUse('round-up'), diff: 3 },
    { gen: storyDivideUse('drop'), diff: 3 },
    { gen: storyDivideUse('remainder'), diff: 3 },
    { gen: storyDivideUse('round-up'), diff: 3 },
    { gen: storyDivideUse('drop'), diff: 4 },
    { gen: storyDivideUse('remainder'), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. Slots cycle the three interpretations — round-up (01/04), drop (02/05), remainder-as-answer (03/06) — so each corrective form re-tests the SAME interpretation with fresh numbers. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'task-comprehension', subtype: 'wrong-interpretation', description: 'Applies the wrong remainder move — drops when the story needs an extra group, or rounds up when only complete groups count.', exampleWrongAnswer: 'buses problem answered 6 instead of 7', distractorRationale: 'Offer the drop result on a round-up story (and vice versa).', reteachPointer: 'explanation/script[0-1] (let the story decide)' },
    { errorTag: 'concept-misconception', subtype: 'reports-wrong-part', description: 'Reports the quotient when the leftover is asked, or the remainder when groups are asked.', exampleWrongAnswer: '"how many left over" answered with the quotient', distractorRationale: 'Offer the quotient when the remainder is the answer.', reteachPointer: 'Day-5 classify (restate the exact question)' },
    { errorTag: 'procedure-slip', subtype: 'division-slip', description: 'The underlying division is wrong, so every interpretation is off.', exampleWrongAnswer: '50 ÷ 8 → 5 R 10', distractorRationale: 'Offer a result with an oversized remainder.', reteachPointer: 'D6 review (remainder smaller than divisor)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Interpreting remainders — doing the division, then letting the story decide whether to round up, drop the leftover, or report the leftover itself.',
    improvingCandidates: ['matching the remainder move to the story', 'restating the exact question after dividing', 'explaining an interpretation in writing'],
    strengtheningByTag: [
      { errorTag: 'task-comprehension', text: 'choosing round-up vs drop vs remainder-as-answer — the warm-ups cycle all three' },
      { errorTag: 'concept-misconception', text: 'reporting the part the question actually asks for (groups vs leftover)' },
      { errorTag: 'procedure-slip', text: 'a clean underlying division so the interpretation stands on solid ground' },
    ],
    homeFocus: {
      praiseLine: 'You noticed the buses problem needs an EXTRA bus for the leftover riders — reading the remainder\'s meaning is the hard part, and you own it.',
      questionForChild: 'For "45 cookies, 6 per box," when would the answer be 7, and when would it be 3?',
      schoolSyncHook: 'If your child\'s class uses particular remainder contexts, share them and we will feature those stories.',
    },
    vocabularyForParent: ['round up (a leftover needs its own group)', 'drop the remainder (a leftover cannot complete a group)', 'remainder-as-answer (the leftover itself)'],
  },
});
