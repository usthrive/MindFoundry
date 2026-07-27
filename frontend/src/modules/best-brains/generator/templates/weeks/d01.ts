/**
 * Level D · Week 1 — "Place value to 1,000,000" (conceptId: place-value-to-1000000).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten from the D4
 * exemplar's shape (ACCEPT 4.21): module-scope generators with FIXED, role-based,
 * name-free / number-free hint ladders; each generator reused ≤2× in the daily
 * core; every computational answer code-derived through a registered template
 * (answerFor) or the shipped op-chain; the Day-5 error-analysis truth re-derived
 * by a verify template so its "wrong" number cannot be fabricated.
 *
 * Concept identity is a PLACE-VALUE family: §6.1 asks for ≥1 week-wide multi-step
 * composed with a prior-week op (here whole-number addition and ×10 scaling), and
 * §6.13 obliges a deepeningDelta versus C1's place value to 1,000.
 *
 * CURRICULUM-MAP D-row-1: read/write/compare/round large numbers; the ×10 place
 * relationship. Day-5 focus: "How big is a million?" benchmark reasoning.
 * Retrieval (QG-2): backward-only from Level C.
 */

import {
  addWhole,
  asWarmup,
  classify,
  compareWhole,
  expandedForm,
  multiply,
  reasoning,
  roundWhole,
} from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C1 = { level: 'C' as const, week: 1 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C12 = { level: 'C' as const, week: 12 };

/** Nonzero place-value parts of a whole number, e.g. 408060 → ["400000","8000","60"]. */
function expandTerms(value: number): string[] {
  const s = String(value);
  const terms: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const place = s.length - 1 - i;
    const d = Number(s[i]);
    if (d !== 0) terms.push(String(d * 10 ** place));
  }
  return terms;
}

// --- Retrieval warm-ups (prior-week Level-C skills; exempt from the v2 gates) ----
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(120, 880), C3);
const wRound = asWarmup(roundWhole(2, 150, 9500), C2);
const wCompareP = asWarmup(compareWhole(3), C2);
const wExpandP = asWarmup(expandedForm(3), C1);

// --- Single-step place-value situations (registered answerFor; role-free hints) --

/** Expanded → standard: combine the lit place parts into one number (d_pv_expand_v1). */
const sExpand = situation({
  situationType: 'combine', cognitiveOp: 'pv-expand',
  draw: (r) => {
    let value = r.int(100000, 999999);
    let terms = expandTerms(value);
    for (let tries = 0; tries < 12 && terms.length < 2; tries++) {
      value = r.int(100000, 999999);
      terms = expandTerms(value);
    }
    return {
      prompt: `A scoreboard lights up its place parts: ${terms.join(' + ')}. What single number does it show?`,
      answerValue: String(value), templateId: 'd_pv_expand_v1', params: { value },
      hints: ['What single number do these place parts build together?', 'Place each part in its own column, then read across the whole number.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/** Value of a chosen digit in a large number — the place-vs-face core (d_pv_digit_value_v1). */
const sDigitValue = situation({
  situationType: 'measurement', cognitiveOp: 'pv-digit-value',
  draw: (r) => {
    const place = r.int(0, 5);
    const digit = r.int(1, 9);
    const others = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => d !== digit);
    const arr = new Array(6).fill(0);
    for (let p = 0; p < 6; p++) arr[p] = p === place ? digit : r.pick(others);
    if (arr[5] === 0) arr[5] = r.pick(others.filter((d) => d !== 0));
    let value = 0;
    for (let p = 0; p < 6; p++) value += arr[p] * 10 ** p;
    return {
      prompt: `A stadium's all-time record crowd is written ${value}. What is the VALUE of the digit ${digit} in that number?`,
      answerValue: String(digit * 10 ** place), templateId: 'd_pv_digit_value_v1', params: { digit, place },
      hints: ['Does a digit\'s worth come from the digit itself, or from the place it sits in?', 'Name the column the digit sits in, then multiply the digit by that place.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/** Round a large count to a named place in context (d_round_v1). */
const sRound = situation({
  situationType: 'measurement', cognitiveOp: 'round',
  draw: (r) => {
    const place = r.pick([3, 4, 5]);
    const unit = 10 ** place;
    let n = r.int(120000, 985000);
    if (n % unit === 0) n += r.int(1, unit - 1);
    const rounded = Math.round(n / unit) * unit;
    return {
      prompt: `A city's population is ${n}. A yearbook rounds it to the nearest ${unit}. What number does the yearbook print?`,
      answerValue: String(rounded), templateId: 'd_round_v1', params: { n, place }, units: 'people',
      hints: ['Which two friendly round numbers does the count sit between?', 'Check the digit just below the place you are rounding to.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

/** ×10 / ×100 / ×1000 scaling — the place-shift relationship in context (d_mul_v1). */
const sScaleTen = situation({
  situationType: 'comparison', cognitiveOp: 'mul',
  draw: (r) => {
    const a = r.int(12, 900);
    const b = r.pick([10, 100, 1000]);
    return {
      prompt: `A small depot stores ${a} boxes. A mega-warehouse stores ${b} times as many. How many boxes does the mega-warehouse store?`,
      answerValue: String(a * b), templateId: 'd_mul_v1', params: { a, b }, units: 'boxes',
      hints: ['Does "times as many" add a few more, or copy the whole amount that many times?', 'Slide every digit up by as many places as the ten-power says.'],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});
// Metacognition carrier — only ever served through the estimate-first wrapper.
const sScaleEstimate = withEstimateFirst(
  sScaleTen,
  'scaling by ten or a hundred slides every digit up into a higher place, so a right answer should be much larger — carrying new zeros — not just a little bigger.',
);

// --- Multi-step place-value problems (compose with a prior-week op) --------------

/** Total several large counts (3-term addition chain; composes prior +). */
const msTotal = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const a = r.int(150000, 450000);
    const b = r.int(90000, 300000);
    const c = r.int(20000, 150000);
    return {
      prompt: `A festival drew ${a} people on Friday, ${b} on Saturday, and ${c} on Sunday. How many people came in all across the three days?`,
      initN: a, steps: [{ op: 'add', n: b, d: 1 }, { op: 'add', n: c, d: 1 }], units: 'people',
      hints: ['Does the question want one day, or every day added together?', 'Find the two-day total first, then bring in the last day.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** Nested ×10 then ×100 scaling (composes prior × facts across two place shifts). */
const msScale = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const a = r.int(120, 900);
    return {
      prompt: `A crate holds ${a} cans. A pallet holds 10 crates, and a truck holds 100 pallets. How many cans fill a full truck?`,
      initN: a, steps: [{ op: 'mul', n: 10, d: 1 }, { op: 'mul', n: 100, d: 1 }], units: 'cans',
      hints: ['Does the count jump straight to the answer, or grow in two stages?', 'Scale up by the first amount, then scale that result by the second.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// --- Discrimination: place value vs face value (which digit is worth more) -------
const discrimPlaceValue = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const hiPlace = r.int(4, 5);
    const loPlace = r.int(0, hiPlace - 2);
    const hiDigit = r.int(2, 5);
    const loDigit = r.int(hiDigit + 2, 9);
    const arr = new Array(6).fill(0);
    arr[hiPlace] = hiDigit;
    arr[loPlace] = loDigit;
    let value = 0;
    for (let p = 0; p < 6; p++) value += arr[p] * 10 ** p;
    return {
      prompt: `In the number ${value}, one digit is a ${hiDigit} and another is a ${loDigit}. Which digit is worth MORE?`,
      correct: `the ${hiDigit}`,
      correctForms: [String(hiDigit * 10 ** hiPlace)],
      distractors: [
        { text: `the ${loDigit}`, errorTag: 'concept-misconception', rationale: 'Chose the bigger-looking digit, but a digit\'s worth comes from its place, not its face.' },
        { text: 'they are worth the same', errorTag: 'representation-misread', rationale: 'Treats two digits in different places as equal in value.' },
      ],
      hints: ['Which sets a digit\'s worth — the digit you see, or the place it sits in?', 'Read the column each digit sits in before you decide.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// --- Compare two large numbers (library choice generator; orienting rung-1) ------
const cmp = compareWhole(6);

// --- Day-5 error-analysis (generated; QG-11 re-derives correct + shown wrong) ----
const eaTimesTenAsPlus = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'pv-times-ten',
  drawParams: (r) => ({ a: r.int(1200, 90000), b: 10, op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A student read that one warehouse holds ${p.a} boxes and said that 10 warehouses hold ${v.wrong} boxes.`,
    extension: 'Explain with the place-value chart why ten TIMES a number is not ten MORE, then give the true count.',
    hints: ['Does multiplying by ten pile on ten more, or slide every digit up one place?', 'Picture the digits shifting one column to the left on the chart.'],
    errorTags: ['concept-misconception', 'fact-recall'],
  }),
});

export const buildD01 = makeWeekBuilder({
  week: 1,
  conceptId: 'place-value-to-1000000',
  conceptName: 'Place value to 1,000,000',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [C1, C2],
  pedagogyContract: 'v2',
  conceptualAnchor: 'place-value chart',
  deepeningDelta:
    'Level C\'s place value stopped at the thousands (three-digit numbers on a hundreds-tens-ones chart); this week extends the SAME place-value chart leftward through ten-thousands and hundred-thousands to a million, reads numbers in periods of three, and promotes the ×10 relationship between neighboring places from a background fact to an explicit, tested idea.',
  explanation: {
    hook: 'The same digit 4 can be worth four, forty, or four HUNDRED THOUSAND. Nothing about the 4 changed — only how far left it sits. Big numbers are just this one idea, stretched.',
    whyBeforeHow:
      'Each place is worth ten times the place to its right, and because that ten-times pattern never breaks, a place-value chart can line every digit up in columns where each column holds ten of the one on its right — that is why just ten digits can name any number, however huge. Read a big number in groups of three, ones then thousands then millions, and each group is only the hundreds, tens, and ones you already know.',
    script: [
      { say: 'Watch the columns grow by tens: one, then ten, then a hundred, then a thousand — each column seats ten of the one on its right.', visual: 'A place-value chart fills leftward; each new column is ten copies of its right neighbor.' },
      { say: 'Split a big number into groups of three from the right — the thousands group, then the ones group — read each group, then say its period name.', visual: 'Commas drop in; "three hundred forty-eight thousand, two hundred seven" appears.' },
      { say: 'A digit\'s worth is its face times its place: an eight in the thousands column is worth eight thousand, not eight. The place multiplies the digit, the way it always has.', visual: 'The eight is highlighted; a block of eight thousand appears beneath it.' },
      { say: 'Before you round, estimate which friendly number the count sits nearest — that benchmark tells you about how big the rounded answer should be, so a wild answer stands out.', visual: 'A number line with two round neighbors; the deciding digit flashes.' },
    ],
    summary: 'Places grow ten times leftward and read in groups of three. A digit is worth its face times its place; compare and round by the place that decides.',
    vocabulary: [
      { term: 'place value', kidGloss: 'what a digit is worth because of where it sits' },
      { term: 'period', kidGloss: 'a group of three places: ones, thousands, millions' },
      { term: 'ten times', kidGloss: 'each place is ten of the place to its right' },
      { term: 'round', kidGloss: 'swap a number for the nearest friendly one' },
    ],
  },
  guidedExamples: [
    ge(1, 1, 'modeled', 'Read 507,036 aloud and give the value of the 7.', [
      { teacherSay: 'Watch me split it into groups of three: 507 thousand, then 036. I read "five hundred seven thousand, thirty-six," and I can see the 7 sits in the thousands column, so it is worth seven thousand.', expected: '7,000' },
    ], '7,000'),
    ge(1, 2, 'completion', 'Write "sixty-two thousand, four hundred nine" as a number.', [
      { teacherSay: 'The thousands group first: sixty-two thousand is 62 in the thousands period.' },
      { childDo: 'Fill the ones period with four hundred nine.', expected: '409' },
    ], '62,409'),
    ge(1, 3, 'prompted', 'Round 284,650 to the nearest ten-thousand.', [
      { childDo: 'Name the two ten-thousands it sits between, then look one place below to choose.', expected: '280,000' },
    ], '280,000'),
    ge(1, 4, 'independent', 'Which is greater: 619,043 or 619,430? Solve cold.', [
      { childDo: 'Compare place by place from the left until they differ.', expected: '619,430' },
    ], '619,430'),
  ],
  days: [
    // Day 1 — concept echo: single-step place value only (no premature interleaving)
    [
      { gen: wMul, diff: 2 },
      { gen: wExpandP, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: sExpand, diff: 2 },
      { gen: sScaleTen, diff: 3 },
      { gen: sRound, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wAdd, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: sScaleEstimate, diff: 3 },
      { gen: discrimPlaceValue, diff: 3 },
      { gen: sDigitValue, diff: 3 },
      { gen: cmp, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wCompareP, diff: 2 },
      { gen: sRound, diff: 3 },
      { gen: cmp, diff: 3 },
      { gen: discrimPlaceValue, diff: 3 },
      { gen: msTotal, diff: 4 },
      { gen: msScale, diff: 4 },
    ],
    // Day 4 — multi-step + big-number word problems (≥3 situation types week-wide)
    [
      { gen: msTotal, diff: 4 },
      { gen: msScale, diff: 4 },
      { gen: sExpand, diff: 3 },
      { gen: sDigitValue, diff: 3 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaTimesTenAsPlus, diff: 4 },
      {
        gen: reasoning({
          prompt: 'About 1,000,000 seconds pass in a stretch of time. Is that closer to a WEEK or a YEAR? Answer, and name the benchmark you used.',
          value: 'week',
          acceptableForms: ['about 11 days', 'a week', '11 days'],
          keywords: true,
          hints: ['Is a million seconds nearer a handful of days, or many months?', 'Set it beside about seven days on one side and a whole year on the other.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: any 6-digit number is greater than any 5-digit number. In one sentence, say how you know.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Thinks a 5-digit number with big digits can top a 6-digit one — but an extra place outweighs any digit below it.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reads the comparison backwards.' },
          ],
          hints: ['Which decides size first — how many places a number has, or its biggest digit?', 'Picture both on a place-value chart and see which reaches a higher column.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D1-PZ-01',
    title: 'Puzzle Grove: Millions in Disguise',
    puzzleType: 'estimation',
    prompt:
      'Which is nearest to ONE MILLION: the seats in a big stadium, the pages in a long novel, or the people in a large city? Then estimate about how many of the SMALLEST of the three you would need to stack up to a million, and name the benchmark behind each choice.',
    answer: {
      value: 'a large city is nearest a million; the stacking estimate names a benchmark and a reason',
      acceptableForms: [],
      validation: 'manual-review',
    },
    hintLadder: ['Which of the three do you already know the rough size of?', 'Anchor the one you know, then compare the others to a million.'],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Single-digit multiplication facts (full table)',
    sourceWeek: C12,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sExpand, diff: 3 },
    { gen: sDigitValue, diff: 3 },
    { gen: sRound, diff: 3 },
    { gen: cmp, diff: 3 },
    { gen: msTotal, diff: 4 },
    { gen: msScale, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: expanded → standard (6-digit). 02: value of a chosen digit. 03: round a large count to a named place. 04: compare two 6-digit numbers (symbol choice). 05: three-day attendance total (add chain). 06: nested ×10-then-×100 scaling. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'place-vs-face', description: 'Answers with the digit itself instead of its place-multiplied value (the 8 in 348,207 is "8").', exampleWrongAnswer: 'value of 8 in 348,207 → 8', distractorRationale: 'Offer the bare digit on digit-value items.', reteachPointer: 'explanation/script[2] (the place multiplies the digit)' },
    { errorTag: 'procedure-slip', subtype: 'rounding-direction', description: 'Rounds the wrong way, or changes digits below the rounding place instead of zeroing them.', exampleWrongAnswer: '284,650 to nearest ten-thousand → 290,000', distractorRationale: 'Offer the wrong-direction round on rounding items.', reteachPointer: 'guidedExamples/D1-GE-03 (look one place below to choose)' },
    { errorTag: 'representation-misread', subtype: 'period-misread', description: 'Reads the groups of three wrong, or lines the wrong digits up when comparing.', exampleWrongAnswer: '619,043 vs 619,430 → calls them equal', distractorRationale: 'Offer "equal" on same-leading-digits comparisons.', reteachPointer: 'explanation/script[1] (read in groups of three)' },
    { errorTag: 'fact-recall', subtype: 'times-ten-slip', description: 'Adds ten instead of multiplying by ten when scaling across a place.', exampleWrongAnswer: '100,000 × 10 answered as 100,010', distractorRationale: 'Offer the add-ten result on scaling items.', reteachPointer: 'Day-5 error-analysis (ten times slides one whole place, it does not add ten)' },
    { errorTag: 'task-comprehension', subtype: 'benchmark-misjudge', description: 'Misjudges the size of a large number against a benchmark, or answers a two-step total after only one step.', exampleWrongAnswer: 'calls a 5-digit crowd bigger than a 6-digit one', distractorRationale: 'Offer the smaller-magnitude or one-step-only result.', reteachPointer: 'explanation/script[3] (estimate the friendly benchmark first)' },
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
      praiseLine: 'You read a six-digit number in tidy groups of three and named what each part was worth — the way you compared the places instead of the bare digits is real place-value command.',
      questionForChild: 'In the number 348,207, which digit is worth the most — and how do you know?',
      schoolSyncHook: 'If you tell us how large the numbers are in your child\'s class right now, we will aim the warm-ups at that range.',
    },
    vocabularyForParent: ['place value (where a digit sits sets its worth)', 'period (a group of three places)', 'rounding (swap for the nearest friendly number)'],
  },
});
