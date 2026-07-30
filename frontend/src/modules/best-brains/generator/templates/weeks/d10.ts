/**
 * Level D · Week 10 — "± fractions (like denominators)" (conceptId: frac-addsub-like-denominators).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC), authored to the shape D4
 * proved (ACCEPT 4.21). Concept: add/subtract fractions and mixed numbers that
 * already share a denominator — count the same-size pieces, keep the bottom, and
 * simplify at the end.
 *
 * Authoring choices (kit recipe D10):
 *  - Anchor: the UNIT BRICK. Like denominators = same-size bricks, so only the
 *    top counts move; the bottom names the brick and never changes.
 *  - Multi-step (OP family → ≥2 week-wide incl. ≥1 on Day 4): three genuine
 *    2-op chains — combine (add two like pieces THEN pour a third off), distance
 *    (three legs summed), and part-whole (one whole minus two used pieces).
 *  - Error-analysis (Day 5, generated): the tops-AND-bottoms slip via
 *    d_verify_frac_v1 mode 'tops-bottoms' — the shown wrong value and true sum
 *    are BOTH code-recomputed, so nothing is fabricated.
 *  - Discrimination (Days 2–3): add-tops-only vs add-both (keep-the-bottom).
 *  - Situations: recipe (combine), distance/ribbon (measurement), time/plot
 *    (part-whole), pizza (sharing) — structure-distinct, not noun-swaps.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free / number-free; rung-1 an
 *    algorithm-free orienting question; every core generator reused ≤ 2×.
 *  - Distinct proper names drawn fresh per item; hypothetical "A student" only in
 *    the error-analysis item.
 */

import { asWarmup, classify, fracCompareChoice, fracEquivFill, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { addFrac, formatFrac, subFrac } from '../lib/compute';
import { partitionWord } from '../lib/format';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const C15 = { level: 'C' as const, week: 15 };
const D9 = { level: 'D' as const, week: 9 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wEquiv = asWarmup(fracEquivFill(), D9);
const wCompare = asWarmup(fracCompareChoice(), C15);

// --- Single-step like-denominator situations (fixed, role-based, name-free hints)
const sCombineAdd = situation({
  situationType: 'combine', cognitiveOp: 'frac-add-like',
  draw: (r) => {
    const d = r.pick([4, 5, 6, 8, 10, 12]);
    const n1 = r.int(1, d - 1); const n2 = r.int(1, d - 1);
    const name = r.pick(NAMES);
    const grain = r.pick(['oats', 'flour', 'raisins', 'berries', 'cocoa']);
    return {
      prompt: `${name}'s recipe measures ${grain} in ${partitionWord(d)} of a cup. It uses ${n1}/${d} cup, then ${n2}/${d} cup more. How many cups of ${grain} in all?`,
      answerValue: formatFrac(addFrac({ n: n1, d }, { n: n2, d })),
      templateId: 'd_frac_like_v1', params: { n1, n2, d, op: 1 }, units: 'cup', validation: 'equivalent-fraction',
      hints: ['Do the two amounts already use the same-size pieces, or must they be re-cut first?', 'Add the counts on top; the piece-size on the bottom stays the same.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const sMeasureSub = situation({
  situationType: 'measurement', cognitiveOp: 'frac-sub-like',
  draw: (r) => {
    const d = r.pick([4, 5, 6, 8, 10, 12]);
    const n1 = r.int(2, d - 1); const n2 = r.int(1, n1 - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `A trail is marked in ${partitionWord(d)} of a kilometre. It runs ${n1}/${d} of a kilometre, and ${name} has already walked ${n2}/${d}. How much of the trail is left to walk?`,
      answerValue: formatFrac(subFrac({ n: n1, d }, { n: n2, d })),
      templateId: 'd_frac_like_v1', params: { n1, n2, d, op: -1 }, validation: 'equivalent-fraction',
      hints: ['Are both distances measured in the same size of piece already?', 'Take the smaller count from the larger; the piece-size does not change.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const sTimeAdd = situation({
  situationType: 'part-whole', cognitiveOp: 'frac-add-like',
  draw: (r) => {
    const d = r.pick([4, 6, 8, 12]);
    const n1 = r.int(1, d - 1); const n2 = r.int(1, d - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `${name}'s timetable is blocked in ${partitionWord(d)} of an hour. ${name} spent ${n1}/${d} of an hour on maths and ${n2}/${d} on reading. What fraction of an hour was that altogether?`,
      answerValue: formatFrac(addFrac({ n: n1, d }, { n: n2, d })),
      templateId: 'd_frac_like_v1', params: { n1, n2, d, op: 1 }, units: 'hour', validation: 'equivalent-fraction',
      hints: ['Which part changes when you join same-size pieces — the count, or the piece-size?', 'Combine the same-size time-pieces; leave the bottom number where it is.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const sSharing = situation({
  situationType: 'sharing', cognitiveOp: 'frac-sub-like',
  draw: (r) => {
    const d = r.pick([4, 5, 6, 8, 10]);
    const n1 = r.int(2, d - 1); const n2 = r.int(1, n1 - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `A pizza is cut into ${d} equal slices. ${name} had ${n1}/${d} of it and shared ${n2}/${d} with a friend. How much of the pizza is left?`,
      answerValue: formatFrac(subFrac({ n: n1, d }, { n: n2, d })),
      templateId: 'd_frac_like_v1', params: { n1, n2, d, op: -1 }, validation: 'equivalent-fraction',
      hints: ['Do both amounts count the same-size slices already?', 'Take the shared count off the top; the slice-size stays put.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// Metacognition base: a length-combine problem, only ever served through the estimate wrapper.
const meBase = situation({
  situationType: 'measurement', cognitiveOp: 'frac-add-like',
  draw: (r) => {
    const d = r.pick([4, 5, 6, 8, 10, 12]);
    const n1 = r.int(1, d - 1); const n2 = r.int(1, d - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `Ribbon is sold in ${partitionWord(d)} of a metre. ${name}'s blue ribbon is ${n1}/${d} of a metre and a red one is ${n2}/${d}. Laid end to end, how long are they together?`,
      answerValue: formatFrac(addFrac({ n: n1, d }, { n: n2, d })),
      templateId: 'd_frac_like_v1', params: { n1, n2, d, op: 1 }, units: 'metre', validation: 'equivalent-fraction',
      hints: ['Before adding, are both lengths cut into the same size of piece?', 'Join the counts of same-size pieces; the piece-size stays fixed.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const meEstimate = withEstimateFirst(meBase, 'should the joined length come out longer or shorter than the longer piece alone?');

// --- Multi-step like-denominator chains (≥2 ops each; fixed name-free hints) -----
const msRecipe = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d = r.pick([4, 5, 6, 8, 10, 12]);
    const n1 = r.int(1, d - 1); const n2 = r.int(1, d - 1);
    const n3 = r.int(1, Math.min(d - 1, n1 + n2 - 1));
    const name = r.pick(NAMES);
    return {
      prompt: `A jug is marked in ${partitionWord(d)} of a litre. ${name} pours in ${n1}/${d} litre, then ${n2}/${d} litre more, then pours ${n3}/${d} litre back out. How much juice is in the jug now?`,
      initN: n1, initD: d, steps: [{ op: 'add', n: n2, d }, { op: 'sub', n: n3, d }], units: 'litre', validation: 'equivalent-fraction',
      hints: ['Does the question want one amount, or the running total after every change?', 'Combine the two pours first, then take the poured-out amount away.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const msDistance = multiStep({
  situationType: 'measurement', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d = r.pick([4, 5, 6, 8, 10, 12]);
    const n1 = r.int(1, d - 1); const n2 = r.int(1, d - 1); const n3 = r.int(1, d - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `A running track is marked in ${partitionWord(d)} of a mile. ${name} jogs ${n1}/${d}, then ${n2}/${d}, then ${n3}/${d} of a mile. How far did ${name} jog in total?`,
      initN: n1, initD: d, steps: [{ op: 'add', n: n2, d }, { op: 'add', n: n3, d }], units: 'mile', validation: 'equivalent-fraction',
      hints: ['Which do you want — a single leg, or the whole distance after every leg?', 'Add the legs one at a time; every leg is measured in the same size of piece.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const msPartWhole = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const d = r.pick([6, 8, 10, 12]);
    const n1 = r.int(1, d - 2); const n2 = r.int(1, d - 1 - n1);
    const name = r.pick(NAMES);
    return {
      prompt: `A garden bed is marked out in ${partitionWord(d)}. ${name} fills ${n1}/${d} of it with carrots and ${n2}/${d} of it with beans. What fraction of the plot is still empty?`,
      initN: 1, initD: 1, steps: [{ op: 'sub', n: n1, d }, { op: 'sub', n: n2, d }], validation: 'equivalent-fraction',
      hints: ['Is the whole staying whole, or are pieces being taken from it?', 'Start from one whole and take away each planted piece in turn.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// --- Discrimination trap: add-tops-only vs add-both (fixed name-free hints) ------
const discAddBoth = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const d = r.pick([4, 5, 6, 8, 10]);
    const n1 = r.int(1, d - 1); const n2 = r.int(1, d - 1);
    const right = formatFrac(addFrac({ n: n1, d }, { n: n2, d }));
    return {
      prompt: `To work out ${n1}/${d} + ${n2}/${d}, which move is correct?`,
      correct: `add the top counts and keep the bottom (${right})`,
      correctForms: [right],
      distractors: [
        { text: `add the tops AND the bottoms (${n1 + n2}/${d + d})`, errorTag: 'concept-misconception', rationale: 'Adds the denominators too — that changes the piece-size in the middle of counting.' },
        { text: 'keep the tops the same and add the bottoms', errorTag: 'representation-misread', rationale: 'Combines the wrong parts — the bottoms name the piece and must stay fixed while the tops are counted.' },
      ],
      hints: ['Which number names the size of the piece — the top or the bottom?', 'If the piece-size must stay the same, which of the two numbers may you combine?'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth AND the shown wrong)
const eaTopsBottoms = errorAnalysis({
  verifyTemplateId: 'd_verify_frac_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const d = r.pick([4, 5, 6, 8, 10]);
    return { n1: r.int(1, d - 1), d1: d, n2: r.int(1, d - 1), d2: d, op: '+', wrongMode: 'tops-bottoms' };
  },
  build: (v, p) => ({
    prompt: `A student added ${p.n1}/${p.d1} + ${p.n2}/${p.d1} and wrote ${v.wrong}.`,
    extension: 'Use a unit-brick picture to show why that is not right, then write the true sum.',
    hints: ['Which number tells the SIZE of each piece — and does joining pieces change that size?', 'Count only the same-size pieces on top; leave the bottom brick alone.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
});

export const buildD10 = makeWeekBuilder({
  week: 10,
  conceptId: 'frac-addsub-like-denominators',
  conceptName: 'Adding & subtracting fractions (like denominators)',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [C15, D9],
  pedagogyContract: 'v2',
  conceptualAnchor: 'unit brick',
  deepeningDelta:
    'D9 established that a fraction NAMES equal pieces and that same-numerator/same-denominator amounts can be compared; D10 keeps the denominator fixed and now OPERATES on the counts — adding and subtracting same-size unit bricks (including mixed numbers) rather than only comparing them.',
  explanation: {
    hook: 'When the pieces already match — fifths and fifths — adding fractions is just counting: two fifth-bricks and one fifth-brick make three fifth-bricks. The bottom number names the brick; it does not budge while you count.',
    whyBeforeHow:
      'A fraction counts equal pieces, and because two fractions with the same denominator are built from the same unit brick, you only ever add or subtract the counts on top — the bottom names the brick and it never moves. The tempting slip is to add the bottoms too, but that would swap the brick for a smaller one halfway through the count, which makes no sense. So keep the denominator, combine the top counts, handle whole parts on their own, and simplify at the end when the top and bottom share a factor.',
    script: [
      { say: 'Watch: 3/8 and 2/8 are both eighth-bricks. I slide them onto one bar and count — three bricks, then two more — and read off five eighth-bricks, 5/8. The bottom brick never changed.', visual: 'Eighth-bricks snap together on one bar.' },
      { say: 'Subtracting is the same picture in reverse: from 5/6 I slide off two sixth-bricks, three sixth-bricks stay, 3/6, and I rename that to the tidier 1/2.', visual: 'Two of five sixth-bricks slide off; 3/6 collapses to 1/2.' },
      { say: 'Estimate first to stay safe: two sixth-bricks plus one sixth-brick is nowhere near a whole, so if an answer looked close to one whole I would know I had changed the brick size by mistake.', visual: 'A bar barely half-filled versus a full bar — the gap is the check.' },
    ],
    summary: 'Same denominator means same-size bricks, so add or subtract only the top counts and keep the bottom. Combine whole parts separately, estimate to check, and simplify at the end.',
    vocabulary: [
      { term: 'like denominators', kidGloss: 'same-size pieces, ready to count together' },
      { term: 'numerator', kidGloss: 'how many pieces you have (the count on top)' },
      { term: 'unit brick', kidGloss: 'one same-size piece the fraction is built from' },
      { term: 'simplify', kidGloss: 'rename to the fewest, largest pieces' },
    ],
  },
  guidedExamples: [
    ge(10, 1, 'modeled', '3/8 + 2/8.', [
      { teacherSay: 'I notice both fractions are eighth-bricks, so I know the bottom will not change — I am only counting how many eighths I end up with. Let me picture three eighth-bricks and then two more.' },
      { teacherSay: 'Count them together: three bricks and two bricks — how many eighth-bricks is that?', expected: '5/8' },
    ], '5/8'),
    ge(10, 2, 'completion', '7/10 − 3/10.', [
      { teacherSay: 'Both are tenth-bricks — which operation do we do to the top counts, and does the bottom change?', expected: 'subtract; the bottom stays' },
      { childDo: 'Take three tenth-bricks from seven, then simplify.', expected: '2/5' },
    ], '2/5'),
    ge(10, 3, 'prompted', '2 1/6 + 1 4/6.', [
      { childDo: 'Add the wholes, then the sixth-bricks; simplify if you can.', expected: '3 5/6' },
    ], '3 5/6'),
    ge(10, 4, 'independent', 'A jug holds 9/10 litre. You pour in 3/10 litre, then pour out 5/10 litre. How much is in the jug? Solve cold.', [
      { childDo: 'Add the pour-in, then take away the pour-out; keep tenths.', expected: '7/10' },
    ], '7/10'),
  ],
  days: [
    // Day 1 — concept echo: single-step like-denominator problems, blocked (no interleaving)
    [
      { gen: wMul, diff: 2 },
      { gen: wEquiv, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: sCombineAdd, diff: 2 },
      { gen: sMeasureSub, diff: 3 },
      { gen: sTimeAdd, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination enter
    [
      { gen: wMul, diff: 2 },
      { gen: wEquiv, diff: 2 },
      { gen: meEstimate, diff: 3 },
      { gen: discAddBoth, diff: 3 },
      { gen: msRecipe, diff: 3 },
      { gen: sSharing, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wMul, diff: 2 },
      { gen: sMeasureSub, diff: 3 },
      { gen: sTimeAdd, diff: 3 },
      { gen: discAddBoth, diff: 4 },
      { gen: msPartWhole, diff: 4 },
      { gen: msDistance, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msRecipe, diff: 4 },
      { gen: msPartWhole, diff: 4 },
      { gen: msDistance, diff: 5 },
      { gen: sCombineAdd, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaTopsBottoms, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Two friends both start with fifths. One says that adding fifths to fifths gives tenths. In writing, explain what stays the same and what changes when you add same-size pieces, and why the answer is still in fifths.',
          value: 'the piece-size (fifths) stays the same; only the count on top changes, so the sum is still counted in fifths',
          acceptableForms: ['fifths', 'count', 'same size', 'piece'],
          keywords: true,
          hints: ['When you push same-size pieces together, does their size change or only how many there are?', 'Say which number names the size and must stay put.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: when you add two fractions that already have the same denominator, the denominator of the answer is that same number. Explain how you know in one sentence.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'Treats a fixed rule as situational — like-size bricks always keep their size.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Reads the rule backwards; the shared bottom is exactly what stays.' },
          ],
          hints: ['If the pieces are already the same size, is there ever a reason to change the bottom number?', 'Picture same-size bricks combining — the brick size never moves.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D10-PZ-01',
    title: 'Puzzle Grove: Make Exactly Two',
    puzzleType: 'game',
    prompt: 'Every card is measured in eighths. Pick three cards that add to EXACTLY two whole bars (that is, sixteen eighth-bricks). Cards available: 7/8, 5/8, 4/8, 6/8, 3/8. Find two different winning trios and show each one fills sixteen eighth-bricks.',
    answer: { value: 'e.g. 7/8 + 5/8 + 4/8 makes 16/8 and 6/8 + 7/8 + 3/8 makes 16/8', acceptableForms: ['16/8', '2'], validation: 'short-text-keyword' },
    hintLadder: ['Two whole bars is how many eighth-bricks altogether?', 'Hunt for three eighth-counts whose bricks add up to that many.'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 3, cognitiveOp: 'target-sum' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sCombineAdd, diff: 3 },
    { gen: msRecipe, diff: 3 },
    { gen: sMeasureSub, diff: 3 },
    { gen: msPartWhole, diff: 3 },
    { gen: sTimeAdd, diff: 4 },
    { gen: msDistance, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step like-denominator ± (combine, measurement-subtract, part-whole-add — the count-the-bricks affordance preserved). 02/04/06: two-step like-denominator chains (pour-in-then-out, whole-minus-two-parts, three legs summed). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'add-the-bottoms', description: 'Adds the denominators as well as the numerators (2/5 + 1/5 read as 3/10) — swaps the brick size mid-count.', exampleWrongAnswer: '2/5 + 1/5 answered as 3/10', distractorRationale: 'Offer the added-bottoms result.', reteachPointer: 'explanation/script[0] (the bottom brick never changes)' },
    { errorTag: 'procedure-slip', subtype: 'no-simplify', description: 'Chooses the right operation but leaves a result unsimplified when a common factor exists, or slips combining whole parts of a mixed number.', exampleWrongAnswer: '4/10 left as 4/10 instead of 2/5', distractorRationale: 'Offer the unsimplified form as a near-answer.', reteachPointer: 'guidedExamples/D10-GE-02 (simplify at the end)' },
    { errorTag: 'representation-misread', subtype: 'wrong-part-combined', description: 'Combines the parts that should stay fixed — keeps the tops and adds the bottoms, or crosses whole and fraction columns.', exampleWrongAnswer: '3/8 + 2/8 answered as 3/16', distractorRationale: 'Offer the keep-tops-add-bottoms result.', reteachPointer: 'explanation/script[1] (the bottom brick names the piece and stays)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Adding and subtracting fractions (and mixed numbers) that already share a denominator — counting the same-size unit bricks, keeping the bottom fixed, estimating to check, and simplifying the result.',
    improvingCandidates: ['combining like-denominator fractions by counting bricks', 'keeping the denominator fixed while the top counts change', 'simplifying the answer at the end'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'NOT adding the bottoms — the brick size stays the same, and the unit-brick warm-ups make that visible' },
      { errorTag: 'procedure-slip', text: 'simplifying the result and keeping whole parts and fraction parts in their own columns' },
      { errorTag: 'representation-misread', text: 'combining only the counts on top, leaving the shared bottom untouched' },
    ],
    homeFocus: {
      praiseLine: 'You pictured the eighth-bricks and counted them together without touching the bottom — that picture is the whole skill.',
      questionForChild: 'When you add 3/8 + 4/8, what happens to the 8 on the bottom — and why?',
      schoolSyncHook: 'If your child\'s class simplifies fractions at a particular step, tell us and we will match that habit.',
    },
    vocabularyForParent: ['like denominators (same-size pieces)', 'numerator (the count on top)', 'unit brick (one same-size piece)', 'simplify (fewest, largest pieces)'],
  },
});
