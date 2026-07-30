/**
 * Level D · Week 11 — "Fraction × whole number" (conceptId: fraction-times-whole).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten from the D4
 * exemplar's shape to clear the 13 pedagogical gates + QG-11.
 *
 * Authoring choices for this week (kit row D11):
 *  - conceptualAnchor = "copies of a fraction": k × a/b is repeated addition of
 *    the fraction — multiply only the count on top, keep the piece-size on the
 *    bottom.
 *  - Multi-step (op-family ⇒ ≥2, incl. Day 4): "k copies THEN add a whole cup"
 *    chains (combine + part-whole situations), answer + step-count from the
 *    shipped op-chain.
 *  - Error-analysis (Day 5, generated): the "glue the whole onto the fraction"
 *    (add-instead-of-copy) misconception — d_verify_frac_v1 wrong-op-add re-derives
 *    both the shown wrong value AND the true answer, so neither can be fabricated.
 *  - Discrimination (Days 2–3): repeated-add-copies vs scale-both / add-the-whole.
 *  - Situations: recipe scaling (rate), laps & ribbon (measurement), granola +
 *    layer-cake (combine / part-whole) — 4 structure-distinct families.
 *  - SEED-INVARIANT hints: fixed, role-based, name/number-free; each core
 *    generator reused ≤2×; rung-1 is always an algorithm-free orienting question.
 */

import { asWarmup, classify, fracAddSubLike, fracEquivFill, fracTimesWhole, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { coprimeNumerator } from '../lib/format';
import { ge, makeWeekBuilder } from '../lib/assemble';
import { addFrac, formatFrac, mulFrac } from '../lib/compute';

const C12 = { level: 'C' as const, week: 12 };
const D9 = { level: 'D' as const, week: 9 };
const D10 = { level: 'D' as const, week: 10 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

const DEN = [2, 3, 4, 5, 6, 8] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wLike = asWarmup(fracAddSubLike(1), D10);
const wEquiv = asWarmup(fracEquivFill(), D9);

// --- Single-step fraction × whole situations (fixed, role-based, name-free hints)
const siRecipe = situation({
  situationType: 'rate', cognitiveOp: 'frac-times-whole',
  draw: (r) => {
    const d = r.pick(DEN); const n = coprimeNumerator(r, d); const k = r.int(2, 6); const name = r.pick(NAMES);
    return {
      prompt: `Each loaf of ${name}'s bread needs ${n}/${d} cup of flour. How much flour is needed for ${k} loaves?`,
      answerValue: formatFrac(mulFrac({ n: k, d: 1 }, { n, d })),
      templateId: 'd_frac_times_whole_v1', params: { k, n, d }, units: 'cup',
      validation: 'equivalent-fraction', acceptableForms: [`${k * n}/${d}`],
      hints: ['Does baking more loaves take more flour, or the same amount?', 'Find the flour for one loaf, then take that many copies of it.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const siLaps = situation({
  situationType: 'measurement', cognitiveOp: 'frac-times-whole',
  draw: (r) => {
    const d = r.pick(DEN); const n = coprimeNumerator(r, d); const k = r.int(2, 6); const name = r.pick(NAMES);
    return {
      prompt: `One lap of the park path is ${n}/${d} km. ${name} runs ${k} laps. How far does ${name} run in all?`,
      answerValue: formatFrac(mulFrac({ n: k, d: 1 }, { n, d })),
      templateId: 'd_frac_times_whole_v1', params: { k, n, d }, units: 'km',
      validation: 'equivalent-fraction', acceptableForms: [`${k * n}/${d}`],
      hints: ['Are more laps a longer distance, or the same distance?', 'Lay the lap length down once for each lap, then count the pieces.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const siRibbon = situation({
  situationType: 'measurement', cognitiveOp: 'frac-times-whole',
  draw: (r) => {
    const d = r.pick(DEN); const n = coprimeNumerator(r, d); const k = r.int(2, 6); const name = r.pick(NAMES);
    return {
      prompt: `Each bow takes ${n}/${d} m of ribbon. ${name} ties ${k} bows. How much ribbon is that in total?`,
      answerValue: formatFrac(mulFrac({ n: k, d: 1 }, { n, d })),
      templateId: 'd_frac_times_whole_v1', params: { k, n, d }, units: 'm',
      validation: 'equivalent-fraction', acceptableForms: [`${k * n}/${d}`],
      hints: ['Which needs more ribbon — one bow, or several bows?', 'Repeat the ribbon length once per bow, keeping each piece the same size.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// Metacognition base: only ever served through the estimate-first wrapper (Day 2).
const siRecipeEstimate = withEstimateFirst(
  siRecipe,
  'should the total be more or less than one serving, and about how many times as much?',
);

// --- Multi-step: k copies of a fraction THEN add a whole number of cups ---------
const msGranola = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d = r.pick(DEN); const n = coprimeNumerator(r, d); const k = r.int(2, 5); const w = r.int(2, 4); const name = r.pick(NAMES);
    return {
      prompt: `Each batch of ${name}'s granola needs ${n}/${d} cup of oats. ${name} makes ${k} batches, then stirs in ${w} more cups of oats from the pantry. How many cups of oats are used altogether?`,
      initN: n, initD: d, steps: [{ op: 'mul', n: k, d: 1 }, { op: 'add', n: w, d: 1 }], units: 'cups',
      validation: 'equivalent-fraction',
      hints: ['Does the question want one batch, or all the batches plus the pantry oats together?', 'Find the oats for all the batches first, then add the pantry cups.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msLayerCake = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d = r.pick(DEN); const n = coprimeNumerator(r, d); const k = r.int(2, 5); const w = r.int(2, 4); const name = r.pick(NAMES);
    return {
      prompt: `A layer cake uses ${n}/${d} cup of sugar for each of its ${k} layers, plus ${w} whole cups for the frosting. How much sugar does ${name}'s cake need in all?`,
      initN: n, initD: d, steps: [{ op: 'mul', n: k, d: 1 }, { op: 'add', n: w, d: 1 }], units: 'cups',
      validation: 'equivalent-fraction',
      hints: ['What are the two amounts you must add — the layers and the frosting?', 'Work out the sugar for all the layers, then add the frosting cups.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (repeated-add vs multiply; fixed name-free hints) ------
const discTotalPick = discrimination({
  variant: 'cross-op', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const d = r.pick(DEN); const n = coprimeNumerator(r, d); let k = r.int(2, 6);
    if (n === 2 && k === 2) k = 3; // keep the added-whole distractor distinct from the answer
    const name = r.pick(NAMES);
    return {
      prompt: `${name} fills a ${n}/${d}-cup scoop ${k} times. Which amount is the total?`,
      correct: formatFrac(mulFrac({ n: k, d: 1 }, { n, d })), correctForms: [`${k * n}/${d}`],
      distractors: [
        { text: `${k * n}/${k * d}`, errorTag: 'concept-misconception', rationale: 'Scaled the top AND the bottom, which keeps the same amount instead of stacking copies.' },
        { text: formatFrac(addFrac({ n: k, d: 1 }, { n, d })), errorTag: 'task-comprehension', rationale: 'Glued the whole number onto the fraction (adding) instead of taking that many copies.' },
      ],
      hints: ['Do more scoops make more than one scoop, or the same amount?', 'Count the unit-pieces in that many copies; the piece-size never changes.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const discBottomMove = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const d = r.pick(DEN); const n = r.int(1, d - 1); const k = r.int(2, 6); const name = r.pick(NAMES);
    return {
      prompt: `${name} is working out ${k} × ${n}/${d}. Which move on the bottom number keeps every piece the right size?`,
      correct: 'keep the bottom the same and multiply only the top', correctForms: ['keep the bottom the same'],
      distractors: [
        { text: `multiply the bottom by ${k} as well`, errorTag: 'concept-misconception', rationale: 'Scaling the bottom too makes an equivalent fraction — the same amount, not more copies.' },
        { text: `add ${k} to the bottom`, errorTag: 'task-comprehension', rationale: 'Changing the bottom by adding confuses how many pieces there are with how big each one is.' },
      ],
      hints: ['Which part of a fraction sets how big each piece is — the top or the bottom?', 'More copies change how many pieces you have, not the size of each piece.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth + shown wrong) ------
const eaGlueInsteadOfCopy = errorAnalysis({
  verifyTemplateId: 'd_verify_frac_v1', cognitiveOp: 'frac-times-whole',
  drawParams: (r) => {
    const d = r.pick([3, 4, 5, 6, 8]); const n = r.int(1, d - 1); const k = r.int(2, 5);
    return { n1: k, d1: 1, n2: n, d2: d, op: '*', wrongMode: 'wrong-op-add' };
  },
  build: (v, p) => ({
    prompt: `A student worked out ${p.n1} × ${p.n2}/${p.d2} — that is ${p.n1} groups of ${p.n2}/${p.d2} — and wrote the answer ${v.wrong}.`,
    extension: 'Use a copies-of-a-fraction picture to show why that is wrong, then give the true amount.',
    hints: ['Does taking copies change how many pieces you have, or how big each piece is?', 'Stack the fraction the given number of times and count the pieces, then compare.'],
    errorTags: ['concept-misconception', 'task-comprehension'],
    answerKeywords: ['copies', 'multiply the top'],
  }),
});

export const buildD11 = makeWeekBuilder({
  week: 11,
  conceptId: 'fraction-times-whole',
  conceptName: 'Fraction × whole number',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D9, D10],
  pedagogyContract: 'v2',
  conceptualAnchor: 'copies of a fraction',
  deepeningDelta:
    'D10 added same-size fraction pieces a step at a time; D11 takes a WHOLE NUMBER of copies of one fraction at once — repeated addition compressed into a multiply, where only the top count scales and the piece-size (bottom) is held fixed, so results routinely pass one whole and are renamed as mixed numbers.',
  explanation: {
    hook: '3 × 2/5 is just three helpings of 2/5 — six fifth-pieces in all. Multiplying a fraction by a whole number is repeated addition wearing a shorter name.',
    whyBeforeHow:
      'Because a fraction is built from unit-fraction bricks, taking copies of a fraction just piles up more of those same bricks — that is why multiplying a fraction by a whole number multiplies only the top count and keeps the bottom fixed: the brick size never changes, only how many bricks you have. When the copies stack past one whole, rename the improper result as a mixed number.',
    script: [
      { say: 'Watch three groups of two-thirds: I copy the two-thirds bar three times and count the thirds — six thirds, which fills two whole cups. Copies, not a new piece size.', visual: 'Three groups of two fifth-bricks line up into one long bar.' },
      { say: 'Only the count on top is multiplied; the brick size on the bottom holds still.', visual: 'The bottom number stays fixed while the top count grows.' },
      { say: 'Estimate first to stay reasonable: four copies of three-quarters sit near four times three-quarters, so expect an answer close to three whole cups — if you land near zero, you changed the piece size by mistake.', visual: 'Benchmark: four short bars stacked, landing just under three whole cups.' },
    ],
    summary: 'n × a/b makes n copies of a fraction: multiply the top by n, keep the bottom, and rename an over-one result as a mixed number.',
    vocabulary: [
      { term: 'unit-fraction brick', kidGloss: 'one piece, like 1/5, that builds the fraction' },
      { term: 'repeated addition', kidGloss: 'copies of the same fraction added up' },
      { term: 'mixed number', kidGloss: 'a whole part and a fraction part together' },
    ],
  },
  guidedExamples: [
    ge(11, 1, 'modeled', '4 × 2/3.', [
      { teacherSay: 'I see four groups of two-thirds, so this is repeated addition, not a change to the piece size. Let me copy two-thirds four times and count the thirds.' },
      { teacherSay: 'Watch me count the thirds as the bar stacks: two, four, six, eight thirds in all.', expected: '8/3' },
    ], '2 2/3'),
    ge(11, 2, 'completion', '5 × 3/8.', [
      { teacherSay: 'Which do I multiply — only the top, or the top and the bottom?', expected: 'only the top' },
      { childDo: 'Multiply the top by five, keep the eighths.', expected: '15/8' },
    ], '1 7/8'),
    ge(11, 3, 'prompted', '6 × 5/6.', [
      { childDo: 'Estimate near six copies of a bit under one, then multiply the count and simplify.', expected: '5' },
    ], '5'),
    ge(11, 4, 'independent', 'A jug needs 3/4 cup per glass. Fill 8 glasses, then pour in 2 more cups. How much liquid in all? Solve cold.', [
      { childDo: 'Copies of three-quarters first, then add the extra cups.', expected: '8' },
    ], '8 cups'),
  ],
  days: [
    // Day 1 — concept echo: single-step scaling only, blocked (no discrimination / multi-step)
    [
      { gen: wMul, diff: 2 },
      { gen: fracTimesWhole(), diff: 2 },
      { gen: fracTimesWhole(), diff: 2 },
      { gen: siRecipe, diff: 2 },
      { gen: siLaps, diff: 2 },
      { gen: siRibbon, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wLike, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: siRecipeEstimate, diff: 3 },
      { gen: discTotalPick, diff: 3 },
      { gen: msGranola, diff: 3 },
      { gen: discBottomMove, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wEquiv, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: discTotalPick, diff: 4 },
      { gen: discBottomMove, diff: 4 },
      { gen: msLayerCake, diff: 4 },
      { gen: siLaps, diff: 3 },
    ],
    // Day 4 — multi-step word problems (2 of 3 core are genuine chains)
    [
      { gen: wMul, diff: 2 },
      { gen: msGranola, diff: 4 },
      { gen: msLayerCake, diff: 5 },
      { gen: siRibbon, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification
    [
      { gen: eaGlueInsteadOfCopy, diff: 4 },
      {
        gen: reasoning({
          prompt: 'A recipe needs 2/3 cup of oats for one batch. Scale it up for 5 batches, then explain in writing whether the total should be more or less than 3 cups and how you know.',
          value: 'ten thirds, which is 3 1/3 cups — a bit more than 3, because five copies pass three whole cups by one third',
          acceptableForms: ['10/3', '3 1/3'],
          keywords: true,
          hints: ['About how much do five small two-thirds servings add up to — near one cup, or several?', 'Count the thirds in five copies, then compare to three whole cups.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: multiplying a fraction by a whole number bigger than one makes the amount grow. Give a one-sentence reason.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'A whole number bigger than one always stacks extra copies, so the amount always grows here.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reads the claim backwards — copies add up, they do not shrink.' },
          ],
          hints: ['Does adding more copies of a piece ever make less than one copy?', 'Picture two or more copies beside a single piece.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Show two ways to find 4 × 3/8 — once as repeated addition of 3/8, once by multiplying the top by 4 — and confirm both give the same amount. Written work required.',
          value: 'both give twelve eighths, which is 1 1/2',
          acceptableForms: ['12/8', '1 1/2'],
          keywords: true,
          hints: ['Which two methods should land on the same total?', 'Add the fraction to itself the given number of times, then multiply the count — compare.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D11-PZ-01',
    title: 'Puzzle Grove: The Lap Threshold',
    puzzleType: 'logic',
    prompt: 'One lap of the park path is 3/8 km. What is the SMALLEST whole number of laps that takes you past 2 km? Show the lap just before and the lap that passes it, and say how you know no smaller number works.',
    answer: { value: '6 laps (5 laps = 15/8 = 1 7/8 km, still short; 6 laps = 18/8 = 2 1/4 km, past 2)', acceptableForms: ['6', '6 laps'], validation: 'short-text-keyword' },
    hintLadder: ['Does one lap on its own get you close to 2 km, or will it take several?', 'Build the copies up one lap at a time and watch for the first total that clears 2 km.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 3, cognitiveOp: 'inverse-search' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fracTimesWhole(), diff: 3 },
    { gen: msGranola, diff: 3 },
    { gen: siLaps, diff: 3 },
    { gen: msLayerCake, diff: 4 },
    { gen: siRibbon, diff: 4 },
    { gen: fracTimesWhole(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/06: single-step whole × fraction (mixed-number-result affordance preserved). 03/05: fraction × whole word problems (measurement). 02/04: two-step "k copies then add a whole cup" chains (combine / part-whole). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'multiply-bottom-too', description: 'Multiplies the whole number into the denominator as well (3 × 2/5 = 6/15), keeping the same amount instead of stacking copies.', exampleWrongAnswer: '3 × 2/5 answered as 6/15', distractorRationale: 'Offer the scaled-both (equivalent-fraction) result.', reteachPointer: 'explanation/script[1] (only the count on top grows)' },
    { errorTag: 'task-comprehension', subtype: 'glue-whole-to-fraction', description: 'Adds the whole number onto the fraction (writing a mixed number) instead of taking that many copies.', exampleWrongAnswer: '3 × 2/5 answered as 3 2/5', distractorRationale: 'Offer the add-instead-of-copy result.', reteachPointer: 'explanation/script[0] (copies of a fraction as repeated addition)' },
    { errorTag: 'procedure-slip', subtype: 'improper-not-converted', description: 'Leaves an over-one result improper, or renames it to a mixed number incorrectly.', exampleWrongAnswer: '8/3 left as 8/3 when a mixed number is asked', distractorRationale: 'Offer a mis-converted mixed number.', reteachPointer: 'guidedExamples/D11-GE-01 (8/3 = 2 2/3)' },
    { errorTag: 'fact-recall', subtype: 'top-times-slip', description: 'Chooses the right operation but slips on the whole-number × numerator fact.', exampleWrongAnswer: '5 × 3 answered as 18', distractorRationale: 'Offer an adjacent numerator product.', reteachPointer: '60-second × fact refresh; feeds the sprint pool' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Multiplying a fraction by a whole number — stacking copies of the fraction (repeated addition), multiplying the top by the whole number and keeping the bottom, then writing over-one results as mixed numbers.',
    improvingCandidates: ['multiplying the numerator by the whole number', 'keeping the denominator fixed', 'converting improper results to mixed numbers'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'multiplying ONLY the top, not the bottom — the unit-brick warm-ups keep this visible' },
      { errorTag: 'task-comprehension', text: 'taking copies of the fraction instead of gluing the whole number onto it' },
      { errorTag: 'procedure-slip', text: 'turning an over-one answer into a tidy mixed number' },
    ],
    homeFocus: {
      praiseLine: 'You pictured three helpings of two-fifths as copies of a fraction and counted six fifth-pieces, keeping the fifths — that is the whole idea.',
      questionForChild: 'For 5 × 3/8, what do you multiply, and what stays the same?',
      schoolSyncHook: 'If your child\'s class links this to repeated addition or to areas, tell us and we will lead with that view.',
    },
    vocabularyForParent: ['unit-fraction brick (one piece like 1/5)', 'repeated addition (copies added up)', 'mixed number (whole + fraction)'],
  },
});
