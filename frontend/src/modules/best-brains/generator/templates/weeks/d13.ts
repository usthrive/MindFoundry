/**
 * Level D · Week 13 — "Decimal place value to thousandths"
 * (conceptId: decimal-place-value-thousandths).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rebuilt on the D4 exemplar
 * so it clears the §6 pedagogical preflight AND the authenticity gate.
 *
 * Place-value family, so the multi-step obligation is met by composing a
 * prior-week operation (whole-number scaling) into a decimal chain that lands in
 * the thousandths place: k copies of a thousandths measure, THEN combine. Every
 * computational answer is code-derived — rounding via the registered
 * `d_dec_round_v1` template, place naming via `d_dec_pv_v1`, and the multi-steps
 * via the shipped decimal op-chain (`d_multistep_dec_v1`). The Day-5
 * error-analysis re-derives its "wrong" value from the `d_verify_dec_v1`
 * right-align misconception (a genuine place miscount), so nothing is fabricated.
 * Hints are fixed, role-based and name/number-free; each generator is reused ≤2×
 * in the daily core; names are drawn distinct via two()/three().
 */

import { asWarmup, classify, decCompareChoice, decPlaceValue, fractionToDecimal, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStepDec } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { roundDec } from '../lib/compute';
import { ge, makeWeekBuilder } from '../lib/assemble';
import type { Rng } from '../../rng';

const C12 = { level: 'C' as const, week: 12 };
const D12 = { level: 'D' as const, week: 12 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** Two distinct names. */
const two = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 2) as [string, string];
/** Three distinct names. */
const three = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 3) as [string, string, string];

/** A 3-place decimal string (genuine thousandths digit), with no 5-tie at the
 *  round-to boundary so rounding is unambiguous. `places` = 1 (tenth) or 2 (hundredth). */
function roundValue(r: Rng, places: number, wholeMax: number): string {
  const whole = r.int(1, wholeMax);
  const digs = [r.int(1, 9), r.int(0, 9), r.int(1, 9)];
  if (digs[places] === 5) digs[places] = 6;
  return `${whole}.${digs.join('')}`;
}

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wCompare = asWarmup(decCompareChoice(), D12);
const wFracDec = asWarmup(fractionToDecimal(), D12);

// --- Single-step rounding situations (registered d_dec_round_v1; orienting hints) --
const sScaleRound = situation({
  situationType: 'measurement', cognitiveOp: 'dec-round',
  draw: (r) => {
    const places = r.pick([1, 2]);
    const value = roundValue(r, places, 19);
    const placeName = places === 1 ? 'tenth' : 'hundredth';
    const scene = r.pick(['A lab scale reads', 'A balance shows', 'A kitchen scale reads']);
    return {
      prompt: `${scene} ${value} grams. Round that reading to the nearest ${placeName} of a gram.`,
      answerValue: roundDec(value, places), templateId: 'd_dec_round_v1', params: { value, places },
      hints: ['Which two friendly decimals does this reading sit between?', 'The digit just past the round-to place decides which way it lands.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

const sMoneyRound = situation({
  situationType: 'money-change', cognitiveOp: 'dec-round',
  draw: (r) => {
    const places = r.pick([1, 2]);
    const value = roundValue(r, places, 9);
    const placeName = places === 1 ? 'tenth' : 'hundredth';
    const name = r.pick(NAMES);
    return {
      prompt: `A fuel pump prices diesel at ${value} dollars a litre. ${name} rounds that price to the nearest ${placeName} of a dollar. What price is posted?`,
      answerValue: roundDec(value, places), templateId: 'd_dec_round_v1', params: { value, places },
      hints: ['Which nearby amount would the pump most likely post?', 'The neighbour digit one place past the kept place settles it.'],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

const sGaugeRound = situation({
  situationType: 'rate', cognitiveOp: 'dec-round',
  draw: (r) => {
    const places = r.pick([1, 2]);
    const value = roundValue(r, places, 14);
    const placeName = places === 1 ? 'tenth' : 'hundredth';
    const scene = r.pick(['A meter logs a flow of', 'A gauge records', 'A sensor reads a rate of']);
    return {
      prompt: `${scene} ${value} litres each minute. Round that rate to the nearest ${placeName} of a litre.`,
      answerValue: roundDec(value, places), templateId: 'd_dec_round_v1', params: { value, places },
      hints: ['Is this rate nearer the smaller friendly value, or the larger one?', 'Read the deciding digit one place to the right of what you keep.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// Metacog base — served ONLY through the estimate-first wrapper.
const sEstimateBase = situation({
  situationType: 'measurement', cognitiveOp: 'dec-round',
  draw: (r) => {
    const places = r.pick([1, 2]);
    const value = roundValue(r, places, 9);
    const placeName = places === 1 ? 'tenth' : 'hundredth';
    return {
      prompt: `A tape measure marks a board at ${value} metres. Round it to the nearest ${placeName} of a metre.`,
      answerValue: roundDec(value, places), templateId: 'd_dec_round_v1', params: { value, places },
      hints: ['Before rounding, where on the number line does this length sit — nearer the low mark or the high one?', 'Check the single digit just beyond the place you are keeping.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});
const mEstimate = withEstimateFirst(sEstimateBase, 'should the rounded reading sit close to the original, or far from it?');

// --- Multi-step: compose a prior-week op (whole-number scaling) into a thousandths chain --
const msBeads = multiStepDec({
  situationType: 'measurement', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const base = `0.${r.int(1, 4)}${r.int(0, 9)}${r.int(1, 9)}`; // thousandths mass of one bead
    const k = r.int(2, 5);
    const clasp = r.pick(['0.2', '0.4', '0.25', '0.15', '0.1']);
    const [n1, n2] = two(r);
    return {
      prompt: `One glass bead weighs ${base} gram. ${n1} strings ${k} of them on a wire, then ${n2} adds a clasp weighing ${clasp} gram. What is the total mass?`,
      init: base, steps: [{ op: 'mul', v: String(k) }, { op: 'add', v: clasp }], units: 'gram',
      hints: ['Which comes first — the mass of the beads on their own, or the whole bracelet?', 'Scale one bead up to all the beads, then add the clasp.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msTiles = multiStepDec({
  situationType: 'combine', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const edge = `0.${r.int(1, 3)}${r.int(0, 9)}${r.int(1, 9)}`; // thousandths width of one tile
    const k = r.int(2, 5);
    const cap = r.pick(['0.05', '0.1', '0.2', '0.15', '0.25']);
    return {
      prompt: `A mosaic border uses tiles each ${edge} metre wide. A row places ${k} tiles side by side, then a ${cap} metre end-cap is added. How wide is the whole border?`,
      init: edge, steps: [{ op: 'mul', v: String(k) }, { op: 'add', v: cap }], units: 'metre',
      hints: ['Are you asked for one tile, the row of tiles, or the whole border with its cap?', 'Build the row of tiles first, then add the end-cap.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Discrimination traps (Days 2-3; fixed name-free hints) ----------------------
const dCompareTrap = discrimination({
  variant: 'cross-op', cognitiveOp: 'compare',
  draw: (r) => {
    const big = `0.${r.int(6, 9)}`;         // one place — the TRUE largest
    const t1 = r.int(31, 59);
    let t2 = r.int(31, 59);
    if (t2 === t1) t2 = t1 === 59 ? 58 : t1 + 1;
    const long1 = `0.${t1}`;
    const long2 = `0.${t2}`;                 // two places, both below `big`
    const [a, b, c] = three(r);
    const bigLongOwner = Number(long1) >= Number(long2) ? b : c;
    return {
      prompt: `In a science lab ${a} measured ${big} litre, ${b} measured ${long1} litre, and ${c} measured ${long2} litre. Who measured the MOST?`,
      correct: a, correctForms: [big],
      distractors: [
        { text: bigLongOwner, errorTag: 'concept-misconception', rationale: 'Picked the reading with the most digits — "longer looks bigger" ignores that the tenths place decides.' },
        { text: 'they measured the same', errorTag: 'representation-misread', rationale: 'Treats decimals of different length as automatically equal.' },
      ],
      hints: ['When decimals have different lengths, which place tells you the most?', 'Compare the tenths first; more digits does not mean more amount.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const dPlaceWorth = discrimination({
  variant: 'structural', cognitiveOp: 'dec-pv',
  draw: (r) => {
    const d = r.int(2, 9);
    return {
      prompt: `In 0.${d}, what is the ${d} worth?`,
      correct: `${d} tenths`,
      distractors: [
        { text: `${d} hundredths`, errorTag: 'representation-misread', rationale: 'Counts the first place as hundredths — one column too far to the right.' },
        { text: `${d} ones`, errorTag: 'concept-misconception', rationale: 'Reads the digit as a whole number, ignoring the decimal point.' },
      ],
      hints: ['What is the FIRST place to the right of the point called?', 'The first column past the point is tenths; the second is hundredths.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives the truth from d_verify_dec_v1) --
const eaMiscountedPlace = errorAnalysis({
  verifyTemplateId: 'd_verify_dec_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => ({
    a: `0.${r.int(1, 9)}`,                                  // tenths (one place)
    b: `0.${String(r.int(105, 895)).padStart(3, '0')}`,    // thousandths (three places)
    op: '+', wrongMode: 'right-align',
  }),
  build: (v, p) => ({
    prompt: `A student added ${p.a} and ${p.b}, stacking them with their right-hand edges in line, and wrote ${v.wrong}.`,
    extension: 'Set the two numbers on a place chart so tenths sit under tenths and thousandths under thousandths, show where each digit really belongs, and write the correct sum.',
    hints: ['Do the two numbers line up by place, or by their right edges?', 'Stack them so each column — tenths, hundredths, thousandths — meets its match.'],
    errorTags: ['representation-misread', 'concept-misconception'],
    answerKeywords: [String(v.correct)],
  }),
});

export const buildD13 = makeWeekBuilder({
  week: 13,
  conceptId: 'decimal-place-value-thousandths',
  conceptName: 'Decimal place value to thousandths',
  strandTags: ['decimals-fractions', 'number-sense-counting'],
  prerequisiteWeeks: [D12],
  pedagogyContract: 'v2',
  conceptualAnchor: 'place chart',
  deepeningDelta:
    'Extends D12 "meeting decimals" (tenths and hundredths, fraction↔decimal, compare) one column further to the thousandths, and adds rounding-to-a-named-place plus place-by-place comparison out to three decimals — the same ten-times-smaller place rule, run one step deeper.',
  explanation: {
    hook: 'Between 0.42 and 0.43 there seems to be nothing... until you open the thousandths place, and 0.421, 0.425, 0.429 all appear. Decimals never run out of room — there is always a smaller place.',
    whyBeforeHow:
      'Every place to the right of the decimal point is worth ten times less than the place before it — tenths, then hundredths, then thousandths — because the ten-times place-value rule that builds whole numbers simply keeps running to the right. That is why a place chart settles every question this week: line each digit up in its own column, and its worth is fixed by the column it lands in, not by how many digits trail behind it. Reading, rounding, and comparing to thousandths all become the same move — find the column. To round, look at the single digit one column to the right of the place you are keeping, since that one neighbour decides whether the kept digit holds or ticks up.',
    script: [
      { say: 'Watch the places shrink by tens as we step right: four tenths, then four hundredths, then four thousandths — each column a tenth of the one before it.', visual: 'A place chart extends right of the point; each column a tenth of the last.' },
      { say: 'In a number like 3.472 the last digit names the thousandths, the one before it the hundredths, and the first the tenths — I read a digit by its column on the place chart, not by how big it looks.', visual: 'Each decimal digit sits in a labelled column.' },
      { say: 'Before rounding, estimate: a rounded value lands on the nearest friendly decimal, so it should sit right beside the original — if your answer jumped far, check which column you used to decide.', visual: 'Benchmark: the original and its rounded neighbour, a whisker apart.' },
    ],
    summary: 'Places shrink ten-fold to the right: tenths, hundredths, thousandths. Name a digit by its column on the place chart; to round, let the digit one place to the right decide.',
    vocabulary: [
      { term: 'thousandths', kidGloss: 'the third place after the decimal point' },
      { term: 'place chart', kidGloss: 'columns that hold each digit by its value' },
      { term: 'place value', kidGloss: 'each column is a tenth of the one to its left' },
      { term: 'round', kidGloss: 'swap for the nearest friendly decimal' },
    ],
  },
  guidedExamples: [
    ge(13, 1, 'modeled', 'In 3.472, which digit is in the thousandths place?', [
      { teacherSay: 'Let me walk the places rightward from the point: first tenths, then hundredths, so the third digit is the thousandths — I name a digit by the column it stands in, not by how big it looks.', expected: '2' },
    ], '2'),
    ge(13, 2, 'completion', 'Round 2.463 to the nearest hundredth.', [
      { teacherSay: 'Which digit decides when we round to the hundredths place — the neighbour just to its right?', expected: 'the thousandths digit' },
      { childDo: 'Use that deciding digit to round the hundredths.', expected: '2.46' },
    ], '2.46'),
    ge(13, 3, 'prompted', 'Round 7.0952 to the nearest thousandth.', [
      { childDo: 'Estimate first, then decide with the digit one place below the thousandths.', expected: '7.095' },
    ], '7.095'),
    ge(13, 4, 'independent', 'A balance reads 5.638 grams. Round it to the nearest hundredth of a gram. Solve cold.', [
      { childDo: 'Find the deciding digit, then round.', expected: '5.64' },
    ], '5.64'),
  ],
  days: [
    // Day 1 — concept echo: single-step place naming + rounding only
    [
      { gen: wMul, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: wFracDec, diff: 2 },
      { gen: decPlaceValue(), diff: 2 },
      { gen: sScaleRound, diff: 3 },
      { gen: sMoneyRound, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination + multi-step enter
    [
      { gen: wMul, diff: 2 },
      { gen: wFracDec, diff: 2 },
      { gen: decPlaceValue(), diff: 3 },
      { gen: mEstimate, diff: 3 },
      { gen: dCompareTrap, diff: 3 },
      { gen: msBeads, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wCompare, diff: 2 },
      { gen: dPlaceWorth, diff: 3 },
      { gen: sGaugeRound, diff: 3 },
      { gen: msTiles, diff: 3 },
      { gen: dCompareTrap, diff: 4 },
      { gen: sScaleRound, diff: 4 },
    ],
    // Day 4 — word problems (two multi-step + two rounding situations)
    [
      { gen: msBeads, diff: 4 },
      { gen: msTiles, diff: 4 },
      { gen: sGaugeRound, diff: 4 },
      { gen: sMoneyRound, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaMiscountedPlace, diff: 4 },
      {
        gen: classify({
          prompt: 'When you round a decimal to the nearest hundredth, which single digit decides whether the hundredths digit stays or ticks up?',
          correct: 'the digit in the thousandths place (one column to the right)',
          distractors: [
            { text: 'the digit in the tenths place', errorTag: 'representation-misread', rationale: 'Looks to the LEFT of the round-to place instead of one column to its right.' },
            { text: 'the hundredths digit itself', errorTag: 'concept-misconception', rationale: 'Uses the digit being kept to decide, instead of its right-hand neighbour.' },
          ],
          hints: ['Which digit sits just past the place you are keeping?', 'To round to hundredths, look one column further right — the thousandths.'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Name a decimal that sits strictly between 0.42 and 0.43. How many such decimals exist, and how do you know? (Written explanation required.)',
          value: 'e.g. 0.425; infinitely many, because you can always open one more place to the right',
          acceptableForms: ['0.425', 'infinitely many', 'thousandths'],
          keywords: true,
          hints: ['Could there be room for another decimal between these two?', 'Open the thousandths place, then imagine opening ten-thousandths.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: writing one more zero at the very END of a decimal changes the amount it names. Say how you know in one sentence.',
          correct: 'never',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'Treats a trailing zero as if it added value to the number.' },
            { text: 'sometimes', errorTag: 'representation-misread', rationale: 'A zero on the end always sits in an empty smaller place, adding nothing.' },
          ],
          hints: ['What place does a zero written on the end fall into?', 'An empty smaller place holds no amount at all.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D13-PZ-01',
    title: 'Puzzle Grove: Squeeze In',
    puzzleType: 'logic',
    prompt: 'Find three different decimals that all sit strictly between 0.6 and 0.61. Then explain why you could find a hundred more.',
    answer: { value: 'e.g. 0.601, 0.605, 0.609; infinitely many by opening smaller places', acceptableForms: ['0.605', 'infinitely'], validation: 'short-text-keyword' },
    hintLadder: ['Could a smaller place open up room between them?', 'Open the thousandths place; each new column to the right gives ten more slots.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'density-reasoning' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: decPlaceValue(), diff: 3 },
    { gen: sScaleRound, diff: 3 },
    { gen: msBeads, diff: 3 },
    { gen: sGaugeRound, diff: 3 },
    { gen: msTiles, diff: 4 },
    { gen: sMoneyRound, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: name the digit in a given place. 02/04/06: round a measured value to a named place (deciding-digit affordance preserved). 03/05: two-step decimal problem — scale a thousandths measure, then combine. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'representation-misread', subtype: 'wrong-deciding-digit', description: 'Uses the wrong digit to decide a rounding, or reads a digit in the wrong column (counts places from the wrong side).', exampleWrongAnswer: '3.148 to the nearest hundredth decided by the tenths 1', distractorRationale: 'Offer the wrong-column reading.', reteachPointer: 'explanation/script[1] (read a digit by its column on the place chart)' },
    { errorTag: 'concept-misconception', subtype: 'trailing-zero-and-density', description: 'Thinks a trailing zero changes a decimal\'s value, or that decimals "run out" between two values.', exampleWrongAnswer: '0.40 called bigger than 0.4', distractorRationale: 'Offer "always changes value" on trailing-zero claims.', reteachPointer: 'Day-5 classify (a trailing zero sits in an empty place)' },
    { errorTag: 'procedure-slip', subtype: 'round-direction', description: 'Rounds the wrong direction, or changes digits below the rounding place.', exampleWrongAnswer: '2.463 to the nearest hundredth given as 2.47', distractorRationale: 'Offer the wrong-direction round.', reteachPointer: 'guidedExamples/D13-GE-02 (the deciding digit rounds it)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Decimal place value out to thousandths — naming the digit in each column, rounding to a chosen place, and seeing that there is always a smaller place (so decimals never run out of room between two values).',
    improvingCandidates: ['naming a digit\'s place out to thousandths', 'rounding decimals to a chosen place using the deciding digit', 'building a two-step answer from a thousandths measure'],
    strengtheningByTag: [
      { errorTag: 'representation-misread', text: 'using the digit ONE column to the right of the round-to place to decide — the warm-ups reinforce reading by column' },
      { errorTag: 'concept-misconception', text: 'seeing that a trailing zero adds no value (0.4 = 0.40) and that decimals never run out between two values' },
      { errorTag: 'procedure-slip', text: 'rounding in the correct direction without disturbing the digits below' },
    ],
    homeFocus: {
      praiseLine: 'You lined up the digits on the place chart and compared them column by column — that is exactly what place value means.',
      questionForChild: 'To round 3.148 to the nearest hundredth, which digit do you look at — and why that one?',
      schoolSyncHook: 'If your child\'s class works with sports times or measurements, tell us and we will feature those in the rounding problems.',
    },
    vocabularyForParent: ['thousandths (third place after the point)', 'place chart (columns that hold each digit by its value)', 'rounding (nearest friendly decimal)'],
  },
});
