/**
 * Level D · Week 12 — "Meeting decimals" (conceptId: meeting-decimals). MID-LEVEL
 * CHECKPOINT, rebuilt as a v2 pedagogy blueprint (CONTENT-GENERATOR-FIX-SPEC).
 *
 * Copies the D4 exemplar's shape: module-scope generators with FIXED, role-based,
 * name-free / number-free hint ladders (so the dedup gate is seed-invariant), each
 * reused ≤2× in the daily CORE; genuine multi-step money problems via
 * lib/multiStepDec (answer + step-count come from the shipped decimal op-chain); a
 * code-generated error-analysis item whose "wrong" number is re-derived by the
 * verify template (fabrication impossible); a discrimination trap forcing the
 * longer-is-bigger CHOICE by Day 3; metacognition woven into Day 2 core and modeled
 * in the explanation script.
 *
 * Concept identity is taken VERBATIM from content/catalog.ts (row: meeting-decimals,
 * "Tenths/hundredths notation; fraction↔decimal; compare decimals"; Day-5 focus:
 * "Money-as-decimals reasoning; why is 0.8 > 0.35"). It is a place-value-family
 * concept, so §6.1 asks for ≥1 week-wide multi-step composed with a prior-week op
 * (money ± fluency); it shares no family with an earlier week, so no deepeningDelta.
 */

import { asWarmup, classify, fracAddSubLike, fracEquivFill, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStepDec } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { fracToDec, decToFrac } from '../lib/compute';
import { money } from '../lib/format';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D9 = { level: 'D' as const, week: 9 };
const D10 = { level: 'D' as const, week: 10 };

// Denominators that re-cut cleanly into tenths/hundredths (terminating decimals).
const TEN_DENOMS = [2, 4, 5, 10, 20, 25, 50, 100] as const;
const SMALL_DENOMS = [2, 4, 5, 10, 20, 25] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wLike = asWarmup(fracAddSubLike(1), D10);
const wEquiv = asWarmup(fracEquivFill(), D9);

// --- Single-step conversions, each in a distinct situation family ---------------
// Every answer is code-computed via a REGISTERED template (fracToDec / decToFrac),
// so QG-5 re-derives it; hints are fixed, role-based, orient→locate.

const fToDecMeasure = situation({
  situationType: 'measurement', cognitiveOp: 'frac-dec-convert',
  draw: (r) => {
    const d = r.pick([...TEN_DENOMS]);
    const n = r.int(1, d - 1);
    return {
      prompt: `A jug holds ${n}/${d} of a litre. Write that amount as a decimal.`,
      answerValue: fracToDec(n, d), templateId: 'd_frac_to_dec_v1', params: { n, d }, units: 'litres',
      hints: ['Does re-naming the fraction as tenths or hundredths change the amount, or only how it is spelled?', 'Rewrite it over ten or a hundred, then read the digits after the point.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const fToDecShade = situation({
  situationType: 'area', cognitiveOp: 'frac-dec-convert',
  draw: (r) => {
    const d = r.pick([...SMALL_DENOMS]);
    const n = r.int(1, d - 1);
    return {
      prompt: `A wall is split into ${d} equal panels and ${n} of them are painted. Write the painted part as a decimal.`,
      answerValue: fracToDec(n, d), templateId: 'd_frac_to_dec_v1', params: { n, d },
      hints: ['Which power of ten can these equal panels be regrouped into — tenths or hundredths?', 'Count the painted parts out of ten or a hundred, then place the point.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const fToDecLine = situation({
  situationType: 'part-whole', cognitiveOp: 'frac-dec-convert',
  draw: (r) => {
    const d = r.pick([...TEN_DENOMS]);
    const n = r.int(1, d - 1);
    return {
      prompt: `On a number line from 0 to 1, a marker sits exactly at ${n}/${d}. What decimal names that marker?`,
      answerValue: fracToDec(n, d), templateId: 'd_frac_to_dec_v1', params: { n, d },
      hints: ['Is the marker closer to a whole, or only a few tenths along the line?', 'Rename the fraction in tenths or hundredths, then read the decimal straight off.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const decToFCoin = situation({
  situationType: 'part-whole', cognitiveOp: 'frac-dec-convert',
  draw: (r) => {
    const value = r.chance(0.5) ? `0.${String(r.int(5, 95)).padStart(2, '0')}` : `0.${r.int(1, 9)}`;
    return {
      // No `$` here: the decimal is the LESSON OBJECT being renamed as a fraction,
      // and "$0.7 of a dollar" is doubly wrong — a price is never one-place, and
      // the sign already says "of a dollar" (POLISH-PASS-SPEC §P1).
      prompt: `A handful of coins is worth ${value} of a dollar. Write that as a fraction of a dollar in simplest form.`,
      answerValue: decToFrac(value), templateId: 'd_dec_to_frac_v1', params: { value }, validation: 'equivalent-fraction',
      hints: ['Which place does the last digit fall in — tenths or hundredths? That names the bottom number.', 'Write it as that many tenths or hundredths, then reduce by a shared factor.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

const decToFRibbon = situation({
  situationType: 'measurement', cognitiveOp: 'frac-dec-convert',
  draw: (r) => {
    const value = r.chance(0.5) ? `0.${String(r.int(5, 95)).padStart(2, '0')}` : `0.${r.int(1, 9)}`;
    return {
      prompt: `A ribbon is ${value} of a metre long. Write its length as a fraction of a metre in simplest form.`,
      answerValue: decToFrac(value), templateId: 'd_dec_to_frac_v1', params: { value }, validation: 'equivalent-fraction',
      hints: ['Does the number of places after the point tell you tenths or hundredths on the bottom?', 'Read it as tenths or hundredths, then simplify.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// --- Multi-step money problems (decimal op-chain; compose prior ± fluency) -------
const msChange = multiStepDec({
  situationType: 'money-change', usesPriorSkill: true,
  draw: (r) => {
    // Real cents, not tenths-dressed-as-money: a price is written to the cent,
    // and hundredths are exactly this checkpoint week's second place.
    const c1 = r.int(15, 45);
    const c2 = r.int(10, 90 - c1);
    const v1 = `0.${String(c1).padStart(2, '0')}`;
    const v2 = `0.${String(c2).padStart(2, '0')}`;
    const [buyA, buyB] = r.shuffle(['a sticker', 'a pencil', 'a badge', 'a rubber', 'a marble', 'a card']).slice(0, 2);
    return {
      prompt: `You have ${money('1')}. You buy ${buyA} for ${money(v1)} and ${buyB} for ${money(v2)}. How much money do you have left?`,
      init: '1', steps: [{ op: 'sub', v: v1 }, { op: 'sub', v: v2 }], units: 'dollars',
      hints: ['Is the question asking for what you spent, or for what stays in your pocket?', 'Take each purchase away from the money you started with, one at a time.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const msChangeEst = withEstimateFirst(msChange, 'will the change be more or less than the money you started with?');

const msSave = multiStepDec({
  situationType: 'combine', usesPriorSkill: true,
  draw: (r) => {
    const s1 = r.int(25, 60);
    const s2 = r.int(15, 45);
    const sp = r.int(10, Math.min(s1 + s2, 55));
    const v1 = `0.${String(s1).padStart(2, '0')}`;
    const v2 = `0.${String(s2).padStart(2, '0')}`;
    const vsp = `0.${String(sp).padStart(2, '0')}`;
    const item = r.pick(['a sticker', 'a badge', 'a pencil', 'a card', 'a marble']);
    return {
      prompt: `You saved ${money(v1)} on Monday and ${money(v2)} on Tuesday, then spent ${money(vsp)} on ${item}. How much money do you have now?`,
      init: v1, steps: [{ op: 'add', v: v2 }, { op: 'sub', v: vsp }], units: 'dollars',
      hints: ['Do the two days add together first, or does the spending come off before anything else?', 'Combine what you saved across the two days, then take the spending away from that total.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (longer-is-bigger; place miscount) --------------------
const discrimCompare = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const t = r.int(4, 9);                 // short decimal 0.t (the true winner)
    const hh = r.int(11, t * 10 - 1);      // long decimal 0.hh < 0.t
    const shortD = `0.${t}`;
    const longD = `0.${String(hh).padStart(2, '0')}`;
    return {
      prompt: `Which is greater: ${shortD} or ${longD}?`,
      correct: shortD,
      distractors: [
        { text: longD, errorTag: 'concept-misconception', rationale: 'Picks the one with more digits — the longer-is-bigger trap; tenths outrank hundredths.' },
        { text: 'they are equal', errorTag: 'representation-misread', rationale: 'Ignores the tenths place, where the comparison is actually settled.' },
      ],
      hints: ['Does a decimal with more digits automatically mean more, or does the biggest place decide it?', 'Give both the same number of places, then read the tenths first.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const discrimName = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const t = r.int(2, 8);
    const dec = `0.${t}`;
    return {
      prompt: `Which fraction is equal to ${dec}?`,
      correct: `${t}/10`,
      distractors: [
        { text: `${t}/100`, errorTag: 'representation-misread', rationale: 'Counts one digit after the point as hundredths — it is one place off; a single place is tenths.' },
        { text: `1/${t}`, errorTag: 'concept-misconception', rationale: 'Flips the fraction — reads the tenths digit as a denominator instead of a numerator.' },
      ],
      hints: ['Is the single digit after the point counting tenths or hundredths?', 'Match the number of decimal places to the power of ten on the bottom.'],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives correct AND wrong) -------
// Right-align misconception: the tenths digit is shrunk to a hundredth, so 0.8
// behaves like 0.08 — the place-value root of the longer-is-bigger error.
const eaRightAlign = errorAnalysis({
  verifyTemplateId: 'd_verify_dec_v1', cognitiveOp: 'dec-compare',
  drawParams: (r) => {
    const t = r.int(4, 9);
    const hh = r.int(15, 45);
    return { a: `0.${t}`, b: `0.${String(hh).padStart(2, '0')}`, op: '+', wrongMode: 'right-align' };
  },
  build: (v, p) => ({
    // Bare decimals, not prices: the ragged digit-count (0.7 beside 0.35) IS the
    // misconception's mechanism, and money cannot legitimately be written that
    // way. The money MODEL stays as the reteach anchor, in the extension.
    prompt: `A student added ${p.a} and ${p.b}, stacking them with their last digits in line, and wrote the total as ${v.wrong}.`,
    extension: 'Explain, using the money model (dimes and pennies), which column the tenths digit really belongs in, then give the true total.',
    hints: ['Does the single digit in the first amount stand for dimes, or for pennies?', 'Line up the decimal points — dimes over dimes — then add.'],
    errorTags: ['representation-misread', 'concept-misconception'],
    answerKeywords: ['tenths', 'dimes', 'line up the points'],
  }),
});

export const buildD12 = makeWeekBuilder({
  week: 12,
  conceptId: 'meeting-decimals',
  conceptName: 'Meeting decimals',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [D9, D10],
  pedagogyContract: 'v2',
  conceptualAnchor: 'money model',
  explanation: {
    hook: '0.8 or 0.35 — which is bigger? Lots of people grab 0.35 because it shows more digits. But decimals are place value all over again: eight tenths beats thirty-five hundredths, because tenths is the bigger place.',
    whyBeforeHow:
      'A decimal is only a fraction whose denominator is a power of ten, written in place-value columns to the right of the point, so that 0.8 means eight tenths and 0.35 means thirty-five hundredths; that is why you always compare from the biggest place first and never by counting digits. The money model makes it concrete — a dime is one tenth of a dollar and a penny is one hundredth — so 0.8 of a dollar is 8 dimes while 0.35 is only 3 dimes and a nickel, and 8 dimes plainly outweighs 3. Fractions and decimals are just two spellings of the very same amount.',
    script: [
      { say: '0.8 is 8 tenths; 0.35 is 3 tenths and 5 hundredths. Reading the biggest place first, 8 tenths beats 3 tenths, so 0.8 is the larger amount.', visual: 'Tenths and hundredths grids side by side; the 0.8 grid fills more.' },
      { say: 'To turn a fraction into a decimal, re-cut it into tenths or hundredths: 3/10 is 0.3, and 1/2 re-cuts to 5/10, which reads as 0.5.', visual: 'A half re-cuts into five tenths, then reads off as a decimal.' },
      { say: 'Before you compare or add, estimate: 0.8 sits near a whole dollar while 0.35 is about a third of one, so a quick benchmark check says 0.8 must be the bigger amount.', visual: 'A number line from 0 to 1 with 0.8 near the right end and 0.35 left of the middle.' },
    ],
    summary: 'Decimals are place-value fractions — tenths, then hundredths. Compare by lining up the point and reading the biggest place first, never by how many digits there are. A fraction and its decimal are two names for one amount.',
    vocabulary: [
      { term: 'tenths', kidGloss: 'the first place after the decimal point' },
      { term: 'hundredths', kidGloss: 'the second place after the point' },
      { term: 'decimal point', kidGloss: 'the mark separating ones from tenths' },
    ],
  },
  guidedExamples: [
    ge(12, 1, 'modeled', 'Write 7/10 as a decimal.', [
      { teacherSay: 'I read 7/10 as seven tenths, and tenths are exactly the first place after the decimal point, so let me write the seven right there.', expected: '0.7' },
      { teacherSay: 'Does the 7 belong in the tenths place or the hundredths place?', expected: 'tenths' },
    ], '0.7'),
    ge(12, 2, 'completion', 'Write 0.25 as a fraction in simplest form.', [
      { teacherSay: '0.25 means twenty-five hundredths — what fraction is that before we simplify?', expected: '25/100' },
      { childDo: 'Simplify by the factor 25 shares with 100.', expected: '1/4' },
    ], '1/4'),
    ge(12, 3, 'prompted', 'A jug holds 6/10 of a litre. Write that as a decimal, then say which is larger: your decimal or 0.48.', [
      { childDo: 'Convert first, then compare the tenths place.', expected: '0.6' },
    ], '0.6'),
    ge(12, 4, 'independent', 'You pay for a $0.35 eraser and a $0.40 pencil with a $1 coin. How much change do you get? Solve cold.', [
      { childDo: 'Add the two prices, then take the total from one dollar.', expected: '0.25' },
    ], '$0.25'),
  ],
  days: [
    // Day 1 — concept echo: single-step conversions only, blocked (no interleaving yet)
    [
      { gen: wMul, diff: 2 },
      { gen: fToDecMeasure, diff: 2 },
      { gen: decToFCoin, diff: 2 },
      { gen: fToDecShade, diff: 3 },
      { gen: decToFRibbon, diff: 3 },
      { gen: fToDecLine, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wLike, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fToDecMeasure, diff: 3 },
      { gen: decToFCoin, diff: 3 },
      { gen: discrimCompare, diff: 3 },
      { gen: msChangeEst, diff: 4 },
    ],
    // Day 3 — interleave discrimination with the first multi-step
    [
      { gen: wEquiv, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fToDecShade, diff: 3 },
      { gen: fToDecLine, diff: 3 },
      { gen: discrimName, diff: 3 },
      { gen: msSave, diff: 4 },
    ],
    // Day 4 — multi-step money word problems (2 of 3 core are multi-step)
    [
      { gen: wMul, diff: 2 },
      { gen: decToFRibbon, diff: 3 },
      { gen: msChange, diff: 4 },
      { gen: msSave, diff: 5 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaRightAlign, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Explain why 0.8 is greater than 0.35, even though 0.35 shows more digits. Use the word "tenths" in your answer.',
          value: '0.8 is 8 tenths while 0.35 is only 3 tenths and a bit, and tenths outrank hundredths',
          acceptableForms: ['tenths', 'bigger place', 'place value'],
          keywords: true,
          hints: ['How many tenths does each number have?', 'Compare the biggest place first, before the smaller places.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: "a decimal with more digits is the larger number." Give one example that shows how you decided.',
          correct: 'sometimes',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'The longer-is-bigger trap — 0.8 has fewer digits than 0.35 but is larger.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Sometimes the longer decimal really is larger (0.75 > 0.7), so "never" is too strong.' },
          ],
          hints: ['Does adding digits after the point always add value, or does the biggest place decide?', 'Test a short decimal against a longer one and see which wins.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Using coins, explain which is more: $0.40 or $0.36. Name the coins for each amount, then say which wins.',
          value: '$0.40 is 4 dimes (40 cents); $0.36 is 3 dimes, a nickel and a penny (36 cents), so $0.40 is more',
          acceptableForms: ['40', '4 dimes', '0.40'],
          keywords: true,
          hints: ['Which is worth more — four dimes, or three dimes and a few pennies?', 'Turn each amount into cents, then compare the totals.'],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D12-PZ-01',
    title: 'Puzzle Grove: Decimal or Fraction?',
    puzzleType: 'logic',
    prompt: 'Match each decimal to its simplest fraction, then order all four from least to greatest: 0.5, 0.25, 0.2, 0.75. Name the one you found easiest to convert and the one that was trickiest, and explain what made the difference.',
    answer: { value: '0.2=1/5, 0.25=1/4, 0.5=1/2, 0.75=3/4; order 0.2 < 0.25 < 0.5 < 0.75', acceptableForms: ['1/5', '1/4', '1/2', '3/4'], validation: 'short-text-keyword' },
    hintLadder: ['Which of these decimals lands on a "nice" fraction you already know?', 'Read each as hundredths, simplify, then compare the tenths place to order them.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fToDecMeasure, diff: 3 },
    { gen: decToFCoin, diff: 3 },
    { gen: fToDecShade, diff: 3 },
    { gen: msChange, diff: 3 },
    { gen: decToFRibbon, diff: 4 },
    { gen: msSave, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step conversion (fraction→decimal / decimal→fraction, conversion affordance preserved). 04/06: two-step money problem (spend-and-compare / save-then-spend). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'longer-is-bigger', description: 'Thinks a decimal with more digits is larger (0.35 > 0.8).', exampleWrongAnswer: '0.35 called greater than 0.8', distractorRationale: 'Offer the longer decimal as "greater."', reteachPointer: 'explanation/script[0] (compare tenths first)' },
    { errorTag: 'representation-misread', subtype: 'place-misalign', description: 'Reads tenths as hundredths or misplaces the point when converting or aligning.', exampleWrongAnswer: '3/10 written as 0.03', distractorRationale: 'Offer the place-shifted decimal.', reteachPointer: 'guidedExamples/D12-GE-01 (tenths = one place after the point)' },
    { errorTag: 'procedure-slip', subtype: 'no-simplify', description: 'Converts a decimal to a fraction but leaves it unsimplified, or slips a step in a money chain.', exampleWrongAnswer: '0.25 left as 25/100', distractorRationale: 'Offer the unsimplified fraction.', reteachPointer: 'guidedExamples/D12-GE-02 (simplify to 1/4)' },
    { errorTag: 'task-comprehension', subtype: 'money-misread', description: 'Loses track of dollars vs cents, or answers the wrong quantity in a two-step money problem.', exampleWrongAnswer: '$0.40 read as 4 cents', distractorRationale: 'Offer the cents-misread amount.', reteachPointer: 'Day-5 reasoning (0.40 dollars = 40 cents)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Meeting decimals — reading tenths and hundredths as place-value fractions, converting between fractions and decimals, and comparing decimals by place value (not by how many digits they have). This week doubles as the mid-level checkpoint, with two-step money problems that lean on earlier addition and subtraction.',
    improvingCandidates: ['converting fractions to decimals and back', 'comparing decimals by place value', 'using money to reason about decimals in two-step problems'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the longer-is-bigger trap — comparing tenths first, as the warm-ups drill' },
      { errorTag: 'representation-misread', text: 'placing the decimal point in the right column when converting or aligning' },
      { errorTag: 'procedure-slip', text: 'simplifying a decimal-to-fraction result and keeping the steps of a money chain in order' },
      { errorTag: 'task-comprehension', text: 'answering the quantity the money problem actually asks for' },
    ],
    homeFocus: {
      praiseLine: 'You explained that 0.8 beats 0.35 because eight tenths outranks three tenths — reading place value, not digit count, is the whole skill.',
      questionForChild: 'Which is more, 0.6 or 0.48 — and how does thinking in dimes and pennies help you decide?',
      schoolSyncHook: 'If your child\'s class ties decimals to money or to grids, tell us and we will lead with that model.',
    },
    vocabularyForParent: ['tenths (first place after the point)', 'hundredths (second place)', 'decimal point (separates ones from tenths)'],
  },
});
