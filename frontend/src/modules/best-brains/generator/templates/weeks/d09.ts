/**
 * Level D · Week 9 — "Fraction equivalence & comparison"
 * (conceptId: fraction-equivalence-comparison).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten on the proven D4
 * shape (ACCEPT 4.21): module-scope generators with FIXED, role-based, name-free
 * hints; a `two()` name helper drawing distinct names; a genuine multi-step
 * op-chain composed with a PRIOR-week skill (fraction-of-a-set → whole-number
 * add / subtract / equal-share); a benchmark discrimination trap; a CODE-
 * GENERATED error-analysis whose "wrong" value is a real misconception output
 * (additive instead of multiplicative scaling) re-derived by QG-11; metacognition
 * woven into Day 2 AND modeled in the explanation script.
 *
 * Anchor: the NUMBER LINE — equivalent fractions mark the same point; comparison
 * is "which point is farther from zero", settled by benchmarks or a shared size.
 * Concept identity is place-value-family, so §6.1 asks for ≥1 week-wide multi-step
 * (here three, each composing with a strictly-prior op).
 */

import { asWarmup, classify, fracCompareChoice, fracEquivFill, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const C15 = { level: 'C' as const, week: 15 };
const C16 = { level: 'C' as const, week: 16 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** Two distinct names drawn fresh per item (never a hardcoded pool name). */
const two = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// --- Retrieval warm-ups (strictly-prior skills; exempt from the pedagogical gates)
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wEquiv = asWarmup(fracEquivFill(), C16);
const wCompare = asWarmup(fracCompareChoice(), C15);

// --- Single-step EQUIVALENCE situations (scale-both; fixed role-based hints) -----
const eqRecipe = situation({
  situationType: 'sharing', cognitiveOp: 'frac-equiv',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5, 6]);
    const n1 = r.int(1, d1 - 1);
    const k = r.int(2, 4);
    const d2 = d1 * k;
    const grain = r.pick(['oats', 'flour', 'rice', 'sugar', 'cocoa']);
    return {
      prompt: `A muffin recipe uses ${n1}/${d1} cup of ${grain} per tray. A measuring scoop is marked in ${d2} equal parts of a cup. How many of those parts fill ${n1}/${d1} cup?`,
      answerValue: String(n1 * k), templateId: 'd_frac_equiv_v1', params: { n1, d1, d2 },
      acceptableForms: [`${n1 * k}/${d2}`],
      hints: ['What do you multiply the bottom by to reach the new one — and does the top follow?', 'Grow the top by the same factor that grows the bottom, so the amount holds still.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

const eqDistance = situation({
  situationType: 'measurement', cognitiveOp: 'frac-equiv',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5, 6]);
    const n1 = r.int(1, d1 - 1);
    const k = r.int(2, 4);
    const d2 = d1 * k;
    return {
      prompt: `A path is split into ${d1} equal legs and a bench sits at the ${n1}/${d1} mark. The same path is re-striped into ${d2} equal legs. Which mark now lands on the bench?`,
      answerValue: String(n1 * k), templateId: 'd_frac_equiv_v1', params: { n1, d1, d2 },
      acceptableForms: [`${n1 * k}/${d2}`],
      hints: ['Is the bench moving, or only the number of stripes on the path?', 'Scale the top by the same factor the bottom grew, and the spot stays put.'],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

const eqNumberline = situation({
  situationType: 'measurement', cognitiveOp: 'frac-equiv',
  draw: (r) => {
    const d1 = r.pick([2, 3, 4, 5, 6]);
    const n1 = r.int(1, d1 - 1);
    const k = r.int(2, 4);
    const d2 = d1 * k;
    return {
      prompt: `On a number line from 0 to 1, a point sits at ${n1}/${d1}. The line is re-labeled with ${d2} equal steps. Which step number lands exactly on that point?`,
      answerValue: String(n1 * k), templateId: 'd_frac_equiv_v1', params: { n1, d1, d2 },
      acceptableForms: [`${n1 * k}/${d2}`],
      hints: ['Which point are you naming — has it slid along, or only been re-cut?', 'Multiply the top by the same factor as the bottom; the point does not move.'],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

// --- Single-step COMPARISON situations (answer = greater fraction; QG-5 skips) ---
const cmpShare = situation({
  situationType: 'comparison', cognitiveOp: 'frac-compare',
  draw: (r) => {
    const scene = r.pick([{ v: 'ate', u: 'of a bar' }, { v: 'read', u: 'of a book' }, { v: 'painted', u: 'of a fence' }]);
    const [name1, name2] = two(r);
    const denoms = [2, 3, 4, 5, 6, 8];
    let d1 = 2, d2 = 3, n1 = 1, n2 = 1;
    for (let t = 0; t < 40; t++) {
      d1 = r.pick(denoms); d2 = r.pick(denoms); n1 = r.int(1, d1 - 1); n2 = r.int(1, d2 - 1);
      if (d1 !== d2 && Math.abs(n1 / d1 - n2 / d2) > 1e-9) break;
    }
    const g1 = n1 / d1 > n2 / d2;
    const bigger = g1 ? `${n1}/${d1}` : `${n2}/${d2}`;
    const winner = g1 ? name1 : name2;
    return {
      prompt: `${name1} ${scene.v} ${n1}/${d1} ${scene.u} and ${name2} ${scene.v} ${n2}/${d2} ${scene.u}. Who did more — and what fraction did they do?`,
      answerValue: bigger, templateId: 'd_frac_compare_v1', params: { n1, d1, n2, d2 },
      validation: 'short-text-keyword', acceptableForms: [winner, `${winner} ${bigger}`],
      hints: ['Which share clears the one-half mark — or are both on the same side of it?', 'Lean each fraction on a landmark, or re-cut both to a shared piece-size.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// Metacognition base: only ever served through the estimate-first wrapper.
const cmpMeasure = situation({
  situationType: 'comparison', cognitiveOp: 'frac-compare',
  draw: (r) => {
    const stuff = r.pick(['litre of juice', 'metre of ribbon', 'kilogram of clay']);
    const [name1, name2] = two(r);
    const denoms = [2, 3, 4, 5, 6, 8];
    let d1 = 2, d2 = 3, n1 = 1, n2 = 1;
    for (let t = 0; t < 40; t++) {
      d1 = r.pick(denoms); d2 = r.pick(denoms); n1 = r.int(1, d1 - 1); n2 = r.int(1, d2 - 1);
      if (d1 !== d2 && Math.abs(n1 / d1 - n2 / d2) > 1e-9) break;
    }
    const g1 = n1 / d1 > n2 / d2;
    const bigger = g1 ? `${n1}/${d1}` : `${n2}/${d2}`;
    const winner = g1 ? name1 : name2;
    return {
      prompt: `${name1} has ${n1}/${d1} ${stuff} and ${name2} has ${n2}/${d2} ${stuff}. Who has more, and what fraction is it?`,
      answerValue: bigger, templateId: 'd_frac_compare_v1', params: { n1, d1, n2, d2 },
      validation: 'short-text-keyword', acceptableForms: [winner, `${winner} ${bigger}`],
      hints: ['Which one is closer to a whole — or closer to zero?', 'Compare each to a landmark, or give both the same piece-size first.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});
const cmpEstimate = withEstimateFirst(cmpMeasure, 'a fraction that reaches past the halfway landmark is worth more than half, so weigh each one against that mark before you decide.');

// --- Multi-step: fraction-of-a-set (PRIOR skill) composed with a whole-number op -
const msSetAdd = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const d = r.pick([2, 3, 4, 5, 6, 8]);
    const m = r.int(2, 6);
    const total = d * m;
    const n = r.int(1, d - 1);
    const k = r.int(2, 9);
    const thing = r.pick(['apples', 'marbles', 'beads', 'tiles', 'cards']);
    const kind = r.pick(['ripe', 'red', 'shiny', 'blue', 'gold']);
    return {
      prompt: `A crate holds ${total} ${thing}. ${n}/${d} of them are ${kind}. Then ${k} more ${kind} ${thing} are added. How many ${kind} ${thing} are there now?`,
      initN: total, steps: [{ op: 'mul', n, d }, { op: 'add', n: k, d: 1 }], units: thing,
      hints: ['Does the question want the fractional share first, or the final count after more arrive?', 'Take the fractional part of the group, then bring in the extra ones.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msSetRest = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const d = r.pick([2, 3, 4, 5, 6, 8]);
    const m = r.int(2, 6);
    const total = d * m;
    const n = r.int(1, d - 1);
    const silver = m * (d - n);
    const k = r.int(1, Math.max(1, silver - 1));
    return {
      prompt: `A box holds ${total} beads. ${n}/${d} of them are gold and the rest are silver. Then ${k} silver beads are taken out. How many silver beads are left?`,
      initN: total, steps: [{ op: 'mul', n: d - n, d }, { op: 'sub', n: k, d: 1 }], units: 'beads',
      hints: ['Which beads does the question follow — the gold share, or what stays after some silver leave?', 'Find the leftover part of the group first, then take away the ones removed.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const msShareEqual = multiStep({
  situationType: 'sharing', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const d = r.pick([2, 3, 4, 5, 6]);
    const n = r.int(1, d - 1);
    const m = r.pick([4, 6]);
    const total = d * m;
    const p = r.pick(m === 4 ? [2, 4] : [2, 3, 6]);
    return {
      prompt: `A field has ${total} plots. ${n}/${d} of them are planted. The planted plots are shared equally among ${p} gardeners. How many planted plots does each gardener tend?`,
      initN: total, steps: [{ op: 'mul', n, d }, { op: 'div', n: p, d: 1 }], units: 'plots',
      hints: ['Before dividing, how big is the planted part of the whole field?', 'Take the fraction of the plots first, then split that share evenly.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination: which is greater (benchmark vs bigger-bottom trap) ----------
const discrimGreater = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const denoms = [2, 3, 4, 5, 6, 8];
    let d1 = 2, d2 = 3, n1 = 1, n2 = 1;
    for (let t = 0; t < 40; t++) {
      d1 = r.pick(denoms); d2 = r.pick(denoms); n1 = r.int(1, d1 - 1); n2 = r.int(1, d2 - 1);
      if (d1 !== d2 && Math.abs(n1 / d1 - n2 / d2) > 1e-9) break;
    }
    const g1 = n1 / d1 > n2 / d2;
    const greater = g1 ? `${n1}/${d1}` : `${n2}/${d2}`;
    const lesser = g1 ? `${n2}/${d2}` : `${n1}/${d1}`;
    return {
      prompt: `Which is greater: ${n1}/${d1} or ${n2}/${d2}? Decide with a benchmark or a shared piece-size — not by the bottom number.`,
      correct: greater,
      distractors: [
        { text: lesser, errorTag: 'concept-misconception', rationale: 'Picks the fraction with the bigger bottom number — more pieces means smaller pieces, not a bigger amount.' },
        { text: 'they are equal', errorTag: 'representation-misread', rationale: 'Skips finding a shared size, so treats two different amounts as the same.' },
      ],
      hints: ['Which fraction reaches past the one-half mark — or do they share a side?', 'Re-cut both into the same size pieces, or lean each on a landmark.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// --- Day-5 error-analysis: additive-instead-of-multiplicative scaling -----------
// The "wrong" numerator (top scaled by ADDING k) and the true one (top × k) are
// both re-derived by QG-11 from d_verify_binop_misconception_v1 — no fabrication.
const eaScaleTop = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'frac-equiv',
  drawParams: (r) => {
    const d1 = r.pick([2, 3, 4, 5, 6]);
    const n1 = r.int(1, d1 - 1);
    let k = r.int(2, 4);
    if (n1 === 2 && k === 2) k = 3; // avoid n1+k === n1*k (degenerate non-error)
    return { a: n1, b: k, op: '*', wrongOp: '+', d1, d2: d1 * k };
  },
  build: (v, p) => ({
    prompt: `To rename ${p.a}/${p.d1} into ${p.d2}ths, a student multiplied the bottom by ${p.b} to reach ${p.d2}, but changed the top by ADDING ${p.b}, writing ${v.wrong}/${p.d2}.`,
    extension: 'Show with a picture why the top must scale the same way the bottom did, then write the correct numerator.',
    hints: ['Does changing the top by adding keep the same amount the bottom\'s scaling kept?', 'Picture re-cutting each piece: the top count grows by the same FACTOR, not by the same amount.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
});

export const buildD09 = makeWeekBuilder({
  week: 9,
  conceptId: 'fraction-equivalence-comparison',
  conceptName: 'Fraction equivalence & comparison',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [C15, C16],
  pedagogyContract: 'v2',
  conceptualAnchor: 'number line',
  deepeningDelta:
    'Deepens the C-level "equivalent & comparing fractions" work: there the child compared same-numerator or same-denominator fractions with drawn models; here equivalence is generated by SCALING (top and bottom by the same factor) and any two fractions are compared with the 1/2 benchmark or a common denominator — reasoning on the number line rather than reading a picture.',
  explanation: {
    hook: 'Is 3/5 bigger than 1/2? You cannot tell by staring — the pieces are different sizes. But slide each onto a number line, or lean each against a friendly landmark, and the answer jumps right out.',
    whyBeforeHow:
      'Two fractions are equivalent because they mark the SAME point on a number line even when the pieces are cut differently — since scaling the top and bottom by the same factor only re-cuts each piece, the amount cannot move. That is why a number line settles every comparison: slide each fraction to its point, and the one farther from zero is the larger, no matter which has the bigger bottom. A bigger denominator just means more, smaller pieces — never a bigger amount, which is the trap this week is built to catch.',
    script: [
      { say: 'Watch me scale one half by three: top and bottom each times three gives three sixths. On the number line the point does not budge, so it is the very same amount wearing a new name.', visual: 'A 1/2 tick re-labeled 3/6; the point holds still.' },
      { say: 'To compare three fifths and one half, I lean each on the one-half benchmark: three fifths sits just past the middle, so it is the larger — no cross-multiplying needed.', visual: 'Three fifths and one half on a 0–1 line with a half flag.' },
      { say: 'Estimate before you commit: a fraction near zero is tiny and one near a whole is almost all of it, so a quick landmark check tells you whether an answer is even sensible.', visual: 'Benchmarks 0, one half, and 1 marked along the line.' },
    ],
    summary: 'Scale the top and bottom together to make equivalent fractions. Compare by a shared piece-size or a benchmark, and remember that a bigger bottom means smaller pieces.',
    vocabulary: [
      { term: 'equivalent fraction', kidGloss: 'the same amount shown with different-sized pieces' },
      { term: 'benchmark', kidGloss: 'a friendly landmark like 0, one half, or 1' },
      { term: 'number line', kidGloss: 'a line where every fraction has its own point' },
    ],
  },
  guidedExamples: [
    ge(9, 1, 'modeled', 'Fill in: 2/3 = ▢/12.', [
      { teacherSay: 'I notice the bottom jumped from 3 up to 12 — that is a four-times jump. Here is why the top has to follow: to keep the very SAME amount, every piece must be re-cut the same way, so I scale the top by that same four.' },
      { teacherSay: 'So I take the top, 2, and scale it up four times as well. What numerator does that give?', expected: '8' },
    ], '8'),
    ge(9, 2, 'completion', 'Which is greater: 5/8 or 1/2?', [
      { teacherSay: 'Rename one half into eighths first — what is it?', expected: '4/8' },
      { childDo: 'Now compare five eighths with that.', expected: '5/8' },
    ], '5/8'),
    ge(9, 3, 'prompted', 'Which is greater: 2/5 or 3/4? Use the one-half benchmark.', [
      { childDo: 'Check each against one half, then decide.', expected: '3/4' },
    ], '3/4'),
    ge(9, 4, 'independent', 'Rename 3/5 into tenths, then say whether it is more or less than one half. Solve cold.', [
      { childDo: 'Scale to tenths, then lean it on the half mark.', expected: '6/10, more than one half' },
    ], '6/10, more than one half'),
  ],
  days: [
    // Day 1 — concept echo: single-step equivalence/comparison only (~3 retrieval)
    [
      { gen: wCompare, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: wEquiv, diff: 2 },
      { gen: eqRecipe, diff: 2 },
      { gen: eqDistance, diff: 2 },
      { gen: cmpShare, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wMul, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: eqRecipe, diff: 3 },
      { gen: discrimGreater, diff: 3 },
      { gen: cmpEstimate, diff: 3 },
      { gen: msSetAdd, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wEquiv, diff: 2 },
      { gen: eqDistance, diff: 3 },
      { gen: eqNumberline, diff: 3 },
      { gen: discrimGreater, diff: 4 },
      { gen: msSetRest, diff: 4 },
      { gen: cmpMeasure, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msSetAdd, diff: 4 },
      { gen: msSetRest, diff: 5 },
      { gen: msShareEqual, diff: 4 },
      { gen: eqNumberline, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaScaleTop, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Order 3/4, 1/2, and 5/8 from least to greatest using ONLY the one-half benchmark — no common denominators. Write one sentence for each, saying which side of one half it sits on.',
          value: '1/2, 5/8, 3/4 — ordered by the one-half benchmark',
          acceptableForms: ['1/2, 5/8, 3/4', 'benchmark', 'one half'],
          keywords: true,
          hints: ['Which of the three clears the one-half mark, and which fall short of it?', 'Then split the above-half ones apart by how close each is to a whole.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Think about two UNIT fractions (a one on top). The one with the bigger bottom number is the smaller amount. Always, sometimes, or never true?',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Treats a fixed rule as conditional — for unit fractions more pieces always means smaller pieces.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Reverses the link between piece-count and piece-size.' },
          ],
          hints: ['Picture one piece when a whole is cut into few parts versus many parts.', 'More cuts make each single piece smaller.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D9-PZ-01',
    title: 'Puzzle Grove: Benchmark Sort',
    puzzleType: 'logic',
    prompt: 'Sort these into "less than 1/2," "equal to 1/2," and "greater than 1/2" WITHOUT computing: 2/5, 4/8, 5/9, 3/10, 7/12. Give a one-line reason for each.',
    answer: { value: 'less: 2/5, 3/10; equal: 4/8; greater: 5/9, 7/12', acceptableForms: ['2/5', '3/10', '4/8', '5/9', '7/12'], validation: 'short-text-keyword' },
    hintLadder: ['Is the top above, at, or below half of the bottom?', 'Half the denominator marks the 1/2 point of the numerator.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: eqRecipe, diff: 3 },
    { gen: msSetAdd, diff: 3 },
    { gen: cmpShare, diff: 3 },
    { gen: discrimGreater, diff: 3 },
    { gen: eqDistance, diff: 4 },
    { gen: msSetRest, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step equivalence/comparison (scale-both / benchmark affordance preserved). 02/06: two-step fraction-of-a-set composed with a whole-number op. 04: benchmark discrimination trap. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'bigger-bottom-bigger', description: 'Judges a fraction bigger because its denominator is bigger, missing that more pieces are smaller pieces.', exampleWrongAnswer: '1/6 called bigger than 1/4', distractorRationale: 'Offer the larger-denominator fraction as "greater."', reteachPointer: 'explanation/script[1] (lean each on the one-half benchmark)' },
    { errorTag: 'procedure-slip', subtype: 'scale-one-only', description: 'Scales one part of a fraction to make an equivalent — grows the bottom but adds to (or forgets) the top.', exampleWrongAnswer: '2/3 renamed to sixths as 5/6', distractorRationale: 'Offer the additively-scaled numerator.', reteachPointer: 'guidedExamples/D9-GE-01 (both numbers scale by the same factor)' },
    { errorTag: 'representation-misread', subtype: 'wrong-benchmark', description: 'Places a fraction on the wrong side of the 1/2 benchmark, or reads the number line off the point.', exampleWrongAnswer: '5/9 placed below one half', distractorRationale: 'Offer a mis-benchmarked ordering.', reteachPointer: 'explanation/script[2] (0, one half, and 1 as landmarks)' },
    { errorTag: 'task-comprehension', subtype: 'share-vs-final', description: 'In a two-step problem, stops at the fractional share instead of finishing the second step (adding, removing, or dividing).', exampleWrongAnswer: 'reports the ripe count and forgets the ones added', distractorRationale: 'Offer the first-step-only result.', reteachPointer: 'Day-4 multi-step word problems (find the share first, then the extra step)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Making equivalent fractions by scaling top and bottom together, and comparing fractions with benchmarks (like one half) or a common piece-size — including the trap that a bigger denominator means smaller pieces. Two-step problems reused a prior skill (a fraction of a set) before adding, removing, or sharing.',
    improvingCandidates: ['scaling both numbers to make equivalent fractions', 'comparing fractions against the one-half benchmark', 'finishing two-step fraction-of-a-set problems'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'the bigger-bottom-means-smaller-pieces idea — the benchmark work keeps this front and center' },
      { errorTag: 'procedure-slip', text: 'scaling BOTH the top and the bottom by the same factor when making equivalents' },
      { errorTag: 'representation-misread', text: 'placing fractions correctly against the one-half landmark on a number line' },
    ],
    homeFocus: {
      praiseLine: 'You renamed one half into eighths and compared on the number line instead of guessing from the bottom number — that re-cutting move is the whole idea.',
      questionForChild: 'Is 5/8 more or less than one half — and how can you tell without any calculating?',
      schoolSyncHook: 'If your child\'s class uses fraction strips or number lines, tell us and we will match that model.',
    },
    vocabularyForParent: ['equivalent fraction (same amount, new pieces)', 'benchmark (a landmark like one half)', 'number line (every fraction has its own point)'],
  },
});
