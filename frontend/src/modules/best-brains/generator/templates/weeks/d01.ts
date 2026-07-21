/**
 * Level D · Week 1 — "Place value to 1,000,000" (conceptId: place-value-to-1000000).
 * CURRICULUM-MAP Level D row 1: read/write/compare/round large numbers; the
 * ×10 place relationship. Day-5 focus: "How big is a million?" benchmark
 * reasoning. Composed from the shared Level-D item library (lib/items.ts) via
 * the week assembler (lib/assemble.ts).
 *
 * Retrieval (QG-2): backward-only from Level C — C1 place value to 1,000, C2
 * compare & round, C3 addition within 1,000, C12 × facts.
 */

import {
  asWarmup,
  classify,
  compareWhole,
  digitValue,
  expandedForm,
  reasoning,
  roundWhole,
  storyRound,
  multiply,
  addWhole,
} from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C1 = { level: 'C' as const, week: 1 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C12 = { level: 'C' as const, week: 12 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(120, 880), C3);
const wRound = asWarmup(roundWhole(2, 150, 9500), C2);
const wCompare = asWarmup(compareWhole(3), C2);

export const buildD01 = makeWeekBuilder({
  week: 1,
  conceptId: 'place-value-to-1000000',
  conceptName: 'Place value to 1,000,000',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [C1, C2],
  explanation: {
    hook: 'The same digit 4 can be worth four, forty, or four HUNDRED THOUSAND. Nothing about the 4 changed — only how far left it sits. Big numbers are just this one idea, stretched.',
    whyBeforeHow:
      'Every place is ten times the place to its right: ones, tens, hundreds, thousands, ten-thousands, hundred-thousands, millions. That single ×10 rule lets ten digits name any number, however huge. Read a big number in groups of three — ones, thousands, millions — and each group is just the hundreds-tens-ones you already know.',
    script: [
      { say: 'Watch the places grow by tens: 1, then 10, then 100, then 1,000 — each seat ten of the one before.', visual: 'A place-value chart fills leftward; each new column is ten copies of its right neighbor.' },
      { say: 'Split 348,207 into groups of three from the right: 348 thousand, and 207. Read the group, say its name.', visual: 'Commas drop in; "three hundred forty-eight thousand, two hundred seven" appears.' },
      { say: 'The 8 in 348,207 sits in the thousands group — it is worth 8,000, not 8. The place multiplies the digit, same as always.', visual: 'The 8 highlighted; 8,000 blocks appear beneath it.' },
      { say: 'To round, find the two friendly numbers it sits between and look one place below the round-to spot to choose.', visual: 'A number line with two round neighbors; the deciding digit flashes.' },
    ],
    summary: 'Places grow ×10 leftward and read in groups of three. A digit is worth its face times its place; compare and round by the place that decides.',
    vocabulary: [
      { term: 'place value', kidGloss: 'what a digit is worth because of where it sits' },
      { term: 'period', kidGloss: 'a group of three places: ones, thousands, millions' },
      { term: 'ten times', kidGloss: 'each place is ten of the place to its right' },
      { term: 'round', kidGloss: 'swap a number for the nearest friendly one' },
    ],
  },
  guidedExamples: [
    ge(1, 1, 'modeled', 'Read 507,036 aloud and give the value of the 7.', [
      { teacherSay: 'Groups of three: 507 thousand, 036. So "five hundred seven thousand, thirty-six". The 7 is in the thousands group: worth 7,000.', expected: '7,000' },
    ], '7,000'),
    ge(1, 2, 'completion', 'Write "sixty-two thousand, four hundred nine" as a number.', [
      { teacherSay: 'Thousands group first: sixty-two thousand is 62 in the thousands period.' },
      { childDo: 'Fill the ones period: four hundred nine.', expected: '409' },
      { teacherSay: 'Together: 62,409.' },
    ], '62,409'),
    ge(1, 3, 'prompted', 'Round 284,650 to the nearest ten-thousand.', [
      { teacherSay: 'Which ten-thousands does it sit between?', expected: '280,000 and 290,000' },
      { childDo: 'Look at the thousands digit to choose.', expected: '280,000' },
    ], '280,000'),
    ge(1, 4, 'independent', 'Which is greater: 619,043 or 619,430? Solve cold.', [
      { childDo: 'Compare place by place from the left until they differ.', expected: '619,430' },
    ], '619,430'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: expandedForm(6), diff: 2 },
      { gen: digitValue(6), diff: 3 },
      { gen: roundWhole(3, 12000, 899999), diff: 3 },
      { gen: compareWhole(6), diff: 3 },
      { gen: expandedForm(6), diff: 4 },
    ],
    [
      { gen: wAdd, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: digitValue(6), diff: 3 },
      { gen: roundWhole(4, 25000, 950000), diff: 3 },
      { gen: expandedForm(6), diff: 4 },
      { gen: compareWhole(6), diff: 4 },
    ],
    [
      { gen: wCompare, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: roundWhole(5, 130000, 980000), diff: 3 },
      { gen: digitValue(6), diff: 3 },
      { gen: compareWhole(6), diff: 4 },
      { gen: roundWhole(3, 15000, 890000), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyRound(4, 24000, 780000), diff: 4 },
      { gen: storyRound(5, 130000, 940000), diff: 4 },
      { gen: storyRound(3, 3400, 89000), diff: 5 },
    ],
    [
      {
        gen: reasoning({
          prompt: 'A person has been alive for about 1,000,000 seconds. Is that closer to a WEEK or a YEAR? Answer and give your benchmark.',
          value: 'week',
          acceptableForms: ['about 11 days', 'a week', '11 days'],
          keywords: true,
          hints: ['A million seconds is a bit over 11 days.', 'Compare 11 days to 7 days versus 365 days.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'A book has about 100,000 letters. About how many letters are in 10 such books?',
          correct: '1,000,000',
          distractors: [
            { text: '110,000', errorTag: 'concept-misconception', rationale: 'Adds 10 instead of scaling by 10 — misses that "ten times" moves one whole place.' },
            { text: '100,010', errorTag: 'representation-misread', rationale: 'Tacks a 10 on the end rather than multiplying.' },
          ],
          hints: ['Ten times a number shifts every digit one place left.', '100,000 × 10 gains one zero.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why the 5 in 52,000 is worth more than the 5 in 5,200, using the word "place".',
          value: 'the first 5 sits in a bigger place, so it is worth more',
          acceptableForms: ['place', 'ten times', 'bigger place'],
          keywords: true,
          hints: ['Name the place each 5 sits in.', 'Each place left is ten times the one before.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'A sign reads "about 40,000 fans." Write one exact crowd size that would round to 40,000 at the nearest ten-thousand, and one that would NOT. (Written explanation required.)',
          value: 'any count in [35,000, 44,999] rounds to 40,000; anything outside does not',
          acceptableForms: [],
          hints: ['Which exact counts round to 40,000 at the nearest ten-thousand?', 'Find the halfway points on each side.'],
          errorTags: ['concept-misconception', 'procedure-slip'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D1-PZ-01',
    title: 'Puzzle Grove: A Million Benchmarks',
    puzzleType: 'estimation',
    prompt:
      'Sort these into "about a thousand," "about a hundred thousand," and "about a million": seats in a big stadium, hairs on a head, steps in a long walk, seconds in a school day, people in a small town. Give a benchmark reason for each placement.',
    answer: {
      value: 'estimates vary; each placement names a benchmark and a reason',
      acceptableForms: [],
      validation: 'manual-review',
    },
    hintLadder: ['Anchor one you know first, then compare the others to it.', 'Ask: is it closer to 1,000, to 100,000, or to 1,000,000?'],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
  sprint: {
    skill: 'Single-digit multiplication facts (full table)',
    sourceWeek: C12,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: expandedForm(6), diff: 3 },
    { gen: digitValue(6), diff: 3 },
    { gen: roundWhole(3, 12000, 899999), diff: 3 },
    { gen: compareWhole(6), diff: 3 },
    { gen: roundWhole(4, 24000, 940000), diff: 4 },
    { gen: digitValue(6), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01: expanded → standard (6-digit). 02: value of a chosen digit. 03: round to the nearest thousand. 04: compare two 6-digit numbers (symbol choice). 05: round to the nearest ten-thousand. 06: value of a chosen digit (harder). No operand surface reused from Form A or the daily pages (pack-wide surface guard).',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'place-vs-face', description: 'Answers with the digit itself instead of its place-multiplied value (the 8 in 348,207 is "8").', exampleWrongAnswer: 'value of 8 in 348,207 → 8', distractorRationale: 'Offer the bare digit on digit-value items.', reteachPointer: 'explanation/script[2] (the place multiplies the digit)' },
    { errorTag: 'procedure-slip', subtype: 'rounding-direction', description: 'Rounds the wrong way, or changes digits below the rounding place instead of zeroing them.', exampleWrongAnswer: '284,650 to nearest ten-thousand → 290,000', distractorRationale: 'Offer the wrong-direction round on rounding items.', reteachPointer: 'guidedExamples/D1-GE-03 (look one place below to choose)' },
    { errorTag: 'representation-misread', subtype: 'period-misread', description: 'Reads the groups of three wrong, or lines the wrong digits up when comparing.', exampleWrongAnswer: '619,043 vs 619,430 → calls them equal', distractorRationale: 'Offer "equal" on same-leading-digits comparisons.', reteachPointer: 'explanation/script[1] (read in groups of three)' },
    { errorTag: 'fact-recall', subtype: 'times-ten-slip', description: 'Adds ten instead of multiplying by ten when scaling across a place.', exampleWrongAnswer: '100,000 × 10 → 110,000', distractorRationale: 'Offer the add-ten result on scaling items.', reteachPointer: 'Day-5 reasoning (ten times shifts one whole place)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Reading, writing, comparing and rounding numbers up to the millions — and the one rule underneath it all: each place is ten times the place to its right.',
    improvingCandidates: ['reading large numbers in groups of three', 'naming a digit\'s value from its place', 'rounding big numbers to a named place'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'telling a digit\'s face apart from its value (the 8 in 348,207 is worth 8,000) — place-pointing stays in the warm-ups' },
      { errorTag: 'procedure-slip', text: 'rounding in the right direction by checking the digit just below the rounding place' },
      { errorTag: 'representation-misread', text: 'reading the groups of three correctly before comparing' },
    ],
    homeFocus: {
      praiseLine: 'You read a six-digit number in tidy groups of three and knew exactly what each part was worth — that is real place-value command.',
      questionForChild: 'In the number 348,207, which digit is worth the most — and how do you know?',
      schoolSyncHook: 'If you tell us how large the numbers are in your child\'s class right now, we will aim the warm-ups at that range.',
    },
    vocabularyForParent: ['place value (where a digit sits sets its worth)', 'period (a group of three places)', 'rounding (swap for the nearest friendly number)'],
  },
});
