/**
 * Level D · Week 24 — "Volume + Ready for Level E" (conceptId: volume-ready-level-e).
 * LEVEL-EXIT GATE, authored as a v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC).
 *
 * Anchor: UNIT CUBES — one flat layer holds length × width cubes, and a box is
 * height copies of that layer, so V = length × width × height (area pushed into
 * the third dimension). The week echoes that model, interleaves an area-vs-volume
 * discrimination + an estimate-first metacog frame, and (place-value family)
 * carries ≥1 genuine multi-step that composes volume with a prior-week op.
 *
 * Authoring patterns copied from the D4 exemplar:
 *  - Every computational answer is code-computed by a registered template
 *    (d_volume_v1 / d_div_v1) or the shipped op-chain (d_multistep_rat_v1).
 *  - The Day-5 error-analysis re-derives BOTH the true volume and the shown wrong
 *    value from d_verify_binop_misconception_v1 — fabrication is impossible.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free; each generator ≤2× in
 *    the daily core; rung-1 is always an algorithm-free orienting question.
 *  - Prompts are object-based (box / crate / tank / bin), so no proper name is
 *    ever hardcoded and no self-referential name clause can occur.
 */

import { angleArith, asWarmup, classify, decAddSub, decMultiply, fracAddSubLike, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { barModel, mathSentence } from '../lib/figures';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D10 = { level: 'D' as const, week: 10 };
const D14 = { level: 'D' as const, week: 14 };
const D20 = { level: 'D' as const, week: 20 };
const D23 = { level: 'D' as const, week: 23 };

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wFracLike = asWarmup(fracAddSubLike(1), D10);
const wDecAdd = asWarmup(decAddSub(1), D14);
const wDecMul = asWarmup(decMultiply(false), D20);
const wAngle = asWarmup(angleArith('triangle'), D23);

// --- Single-step volume situations (fixed, role-based, name-free hints) ---------
const sitVolBox = situation({
  situationType: 'measurement', cognitiveOp: 'volume',
  draw: (r) => {
    const l = r.int(2, 9); const w = r.int(2, 8); const h = r.int(2, 6);
    return {
      prompt: `A storage box measures ${l} by ${w} by ${h} units. How many unit cubes fill it exactly?`,
      answerValue: String(l * w * h), templateId: 'd_volume_v1', params: { l, w, h }, units: 'cubic units',
      hints: ['Does filling a box count flat tiles, or the cubes stacked all the way through it?', 'Find the cubes in one bottom layer, then repeat that layer up through the height.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const sitVolTank = situation({
  situationType: 'measurement', cognitiveOp: 'volume',
  draw: (r) => {
    const l = r.int(3, 10); const w = r.int(2, 7); const h = r.int(2, 7);
    return {
      prompt: `A glass tank is ${l} units long, ${w} units wide, and ${h} units deep. How many unit cubes of water fill it?`,
      answerValue: String(l * w * h), templateId: 'd_volume_v1', params: { l, w, h }, units: 'cubic units',
      hints: ['Which two edges make one bottom layer here, and how many of those layers stack up?', 'Multiply the two base edges for one layer, then take that layer as many times as the depth.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const sitVolStack = situation({
  situationType: 'measurement', cognitiveOp: 'volume',
  draw: (r) => {
    const l = r.int(2, 8); const w = r.int(3, 9); const h = r.int(3, 7);
    return {
      prompt: `A toy chest is ${l} by ${w} by ${h} units. Packed tight with unit cubes, how many cubes does it hold?`,
      answerValue: String(l * w * h), templateId: 'd_volume_v1', params: { l, w, h }, units: 'cubic units',
      hints: ['Picture one layer of cubes on the bottom, then the copies rising up — how many layers are there?', 'Count one layer\'s cubes, then scale by the number of layers.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// Missing-dimension: total cubes ÷ base layer = layer count (composes prior division).
const sitVolLayers = situation({
  situationType: 'part-whole', cognitiveOp: 'volume-missing', usesPriorSkill: true,
  draw: (r) => {
    const base = r.int(6, 40); const h = r.int(2, 9); const total = base * h;
    return {
      prompt: `A bin holds ${total} unit cubes packed tight, and its bottom layer is ${base} cubes. How many layers tall is the bin?`,
      answerValue: String(h), templateId: 'd_div_v1', params: { a: total, b: base }, units: 'layers',
      hints: ['If you know the whole pile of cubes and one layer\'s cubes, what tells you how many layers there are?', 'Share the total cubes into equal layers to find how many layers tall it is.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// Metacognition base: only ever served through the estimate-first wrapper.
const sitVolEstimateBase = situation({
  situationType: 'measurement', cognitiveOp: 'volume',
  draw: (r) => {
    const l = r.int(2, 9); const w = r.int(2, 7); const h = r.int(2, 7);
    return {
      prompt: `A shipping crate measures ${l} by ${w} by ${h} units. How many unit cubes pack it completely?`,
      answerValue: String(l * w * h), templateId: 'd_volume_v1', params: { l, w, h }, units: 'cubic units',
      hints: ['Roughly how many cubes should a box this size hold — closer to a handful or a big pile?', 'Estimate with rounded edges first, then multiply the three edges exactly.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const sitVolEstimate = withEstimateFirst(sitVolEstimateBase, 'should the cube count be near one flat layer, or several times it?');

// --- Multi-step volume problems (genuine ≥2-op chains; stated operands) ----------
const msFillThenAdd = multiStep({
  situationType: 'combine', cognitiveOp: 'volume-combine', usesPriorSkill: true,
  draw: (r) => {
    const l = r.int(2, 8); const w = r.int(2, 7); const h = r.int(2, 6); const t = r.int(4, 30);
    return {
      prompt: `A crate is ${l} by ${w} by ${h} units and is packed tight with unit cubes. A bag adds ${t} more loose cubes. How many unit cubes are there in all?`,
      initN: l, steps: [{ op: 'mul', n: w, d: 1 }, { op: 'mul', n: h, d: 1 }, { op: 'add', n: t, d: 1 }], units: 'cubes',
      hints: ['Are you asked for just the crate\'s cubes, or the crate plus the loose ones together?', 'Fill the crate first — length by width by height — then add the extra cubes.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msNeedMore = multiStep({
  situationType: 'part-whole', cognitiveOp: 'volume-gap', usesPriorSkill: true,
  draw: (r) => {
    const l = r.int(2, 8); const w = r.int(2, 7); const h = r.int(2, 6);
    const base = l * w; const have = r.int(2, base - 1);
    return {
      prompt: `A box is ${l} by ${w} by ${h} units. You already have ${have} unit cubes to pack inside it. How many MORE unit cubes are needed to fill it completely?`,
      initN: l, steps: [{ op: 'mul', n: w, d: 1 }, { op: 'mul', n: h, d: 1 }, { op: 'sub', n: have, d: 1 }], units: 'cubes',
      hints: ['Is the answer the whole box, or only the gap between what you have and a full box?', 'Find the full box\'s cubes, then take away the cubes you already have.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// --- Discrimination: area (two edges) vs volume (three edges) --------------------
const discrimVolArea = discrimination({
  variant: 'cross-op', cognitiveOp: 'choose-operation',
  draw: (r) => {
    const l = r.int(2, 10); const w = r.int(2, 9); const h = r.int(2, 8);
    return {
      prompt: `A closed box measures ${l} by ${w} by ${h} units. Which move finds how many unit cubes completely fill it?`,
      correct: 'multiply all three edge lengths',
      distractors: [
        { text: 'multiply only two edge lengths', errorTag: 'concept-misconception', rationale: 'Two edges give one flat layer — that is area, the cubes in a single layer, not the whole space filled.' },
        { text: 'add the three edge lengths', errorTag: 'procedure-slip', rationale: 'Adds the edges instead of multiplying, so it never counts the cubes that fill the box.' },
      ],
      hints: ['Does filling the whole inside of a box need two edges, or all three?', 'One layer uses two edges; the height brings in the third.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth AND the shown wrong) --
const eaAddInsteadOfStack = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'volume',
  drawParams: (r) => ({ a: r.int(2, 6) * r.int(2, 5), b: r.int(3, 7), op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A student found the bottom layer of a box holds ${p.a} unit cubes and the box is ${p.b} layers tall, then said the volume is ${v.wrong} cubic units.`,
    extension: 'Use a picture of the stacked layers to show why that is not right, then give the correct volume.',
    hints: ['Does stacking identical layers mean you multiply by the layer count, or add it on?', 'Draw the layers as copies — see whether they add up or multiply.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
    answerKeywords: ['multiply', 'layers'],
  }),
});

export const buildD24 = makeWeekBuilder({
  week: 24,
  conceptId: 'volume-ready-level-e',
  conceptName: 'Volume + Ready for Level E',
  strandTags: ['algebra-geometry', 'multiplication-division'],
  prerequisiteWeeks: [D20, D23],
  pedagogyContract: 'v2',
  conceptualAnchor: 'unit cubes',
  explanation: {
    hook: 'How many sugar cubes fill a box? Lay one layer, count it, then count the layers — that is volume, and it is why V = length × width × height. This exit week also gathers the whole level together, ready for what comes next.',
    whyBeforeHow:
      'Volume counts the unit cubes that pack a solid with no gaps, so one flat layer covers length-by-width cubes and a filled box is just height copies of that layer — that is why V = length × width × height, the area idea pushed up into a third dimension. Because every layer is an identical copy, you multiply by the height rather than adding it, and this exit week gathers the level\'s place-value, fraction, and decimal habits so they carry, fluent and connected, into Level E.',
    script: [
      {
        say: 'One bottom layer of a 4-by-3 base holds 4 × 3 = 12 cubes; stack 5 such layers and 12 × 5 = 60 cubes fill the box.',
        visual: 'The five layers laid out flat as five equal blocks of 12 cubes, braced and labelled 60 cubes — the solid drawn as a row rather than a stack.',
        figure: barModel(
          [
            {
              segments: [
                { value: 12, label: '12' },
                { value: 12, label: '12' },
                { value: 12, label: '12' },
                { value: 12, label: '12' },
                { value: 12, label: '12' },
              ],
            },
          ],
          { brace: { label: '60 cubes' }, alt: 'five equal blocks of 12 laid end to end, one block for each identical layer, the whole row braced and labelled 60 cubes' },
        ),
      },
      {
        say: 'So volume = length × width × height — the base layer times the number of layers.',
        visual: 'The formula written in words, volume = length × width × height, and under it the box just filled: 4 × 3 × 5 = 60.',
        // The formula in words above the same box's own three edges below it,
        // token for token: length under length, width under width, height under
        // height. The row of five twelves in the segment above is where the 4,
        // the 3 and the 5 came from, so the two figures are one picture read
        // twice — the general rule, and the box that was just counted.
        figure: mathSentence(
          [
            { text: 'volume' }, { text: '=' }, { text: 'length' }, { text: '×' },
            { text: 'width' }, { text: '×' }, { text: 'height' },
          ],
          {
            then: {
              connector: 'equals',
              tokens: [
                { text: '4' }, { text: '×' }, { text: '3' }, { text: '×' },
                { text: '5' }, { text: '=' }, { text: '60', mark: 'underline' },
              ],
            },
            alt:
              'the formula volume equals length times width times height written out, and under it this box\'s own ' +
              'edges in the same order, four times three times five equals sixty, with the sixty underlined',
          },
        ),
      },
      {
        say: 'Before multiplying, estimate: round the edges to friendly numbers and picture the pile, so a sensible answer lands near that ballpark and you can check it.',
        visual: 'A crate 9 by 4 by 6 drawn as an exact pile of 216 cubes, beside the rounded 10 by 4 by 6 estimate of 240 — two piles about the same size.',
        figure: barModel(
          [
            { label: 'exact', segments: [{ value: 216 }], total: '216 cubes' },
            { label: 'rounded', segments: [{ value: 240, fill: 'soft' }], total: '240 cubes' },
          ],
          { scaleMax: 240, alt: 'two bars to one scale, the exact pile of 216 cubes only a little shorter than the rounded-edge estimate of 240' },
        ),
      },
    ],
    summary: 'Volume = length × width × height — one layer of unit cubes times the number of layers. This exit week also gathers the level\'s arithmetic, fractions, and decimals, ready for Level E.',
    vocabulary: [
      { term: 'volume', kidGloss: 'how many unit cubes fill a solid' },
      { term: 'cubic units', kidGloss: 'the units volume is measured in' },
      { term: 'layer', kidGloss: 'one base-area sheet of cubes' },
    ],
  },
  guidedExamples: [
    ge(24, 1, 'modeled', 'A box is 3 by 4 by 2 units. How many unit cubes fill it?', [
      { teacherSay: 'Let me build the bottom layer first: I lay 3 by 4 flat and count the cubes in that one sheet, so 3 × 4 = 12 cubes in a layer.', expected: '12' },
      { teacherSay: 'Now I stack that same 12-cube layer 2 layers high, so 12 × 2 = 24 cubes fill the box.', expected: '24' },
    ], '24 cubic units'),
    ge(24, 2, 'completion', 'A box is 6 by 2 by 4 units. How many unit cubes fill it?', [
      { teacherSay: 'What are the cubes in one bottom layer here?', expected: '12' },
      { childDo: 'Stack that layer up the height and count.', expected: '48' },
    ], '48 cubic units'),
    ge(24, 3, 'prompted', 'A box is 5 by 3 by 4 units. Find its volume.', [
      { childDo: 'One layer first, then the number of layers.', expected: '60' },
    ], '60 cubic units'),
    ge(24, 4, 'independent', 'A box is 5 by 5 by 3 units. Find its volume. Solve it cold.', [
      { childDo: 'Base layer times the height.', expected: '75' },
    ], '75 cubic units'),
  ],
  days: [
    // Day 1 — concept echo: single-step volume only (no interleaving), ~3 retrieval
    [
      { gen: wMul, diff: 2 },
      { gen: wDecAdd, diff: 2 },
      { gen: wFracLike, diff: 2 },
      { gen: sitVolBox, diff: 2 },
      { gen: sitVolTank, diff: 3 },
      { gen: sitVolStack, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination + first multi-step
    [
      { gen: wAngle, diff: 2 },
      { gen: wDecMul, diff: 2 },
      { gen: sitVolEstimate, diff: 3 },
      { gen: discrimVolArea, diff: 3 },
      { gen: msFillThenAdd, diff: 3 },
      { gen: sitVolBox, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wMul, diff: 2 },
      { gen: discrimVolArea, diff: 4 },
      { gen: msFillThenAdd, diff: 4 },
      { gen: msNeedMore, diff: 4 },
      { gen: sitVolLayers, diff: 3 },
      { gen: sitVolTank, diff: 3 },
    ],
    // Day 4 — word problems (multi-step + missing-dimension + estimate)
    [
      { gen: msNeedMore, diff: 5 },
      { gen: sitVolLayers, diff: 4 },
      { gen: sitVolStack, diff: 4 },
      { gen: sitVolEstimate, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + design reasoning + classification
    [
      { gen: eaAddInsteadOfStack, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Design a box with whole-number edges that holds exactly 36 unit cubes. Give the three edge lengths and show they multiply to 36.',
          value: 'any whole-number triple whose product is 36, e.g. 3 by 3 by 4 or 2 by 3 by 6',
          acceptableForms: ['36'],
          keywords: true,
          hints: ['Which three edge lengths could multiply to the target number of cubes?', 'Try a few whole-number triples and multiply all three to check.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Doubling ONLY the height of a box, with length and width unchanged, does what to the number of cubes it holds?',
          correct: 'doubles the number of cubes',
          distractors: [
            { text: 'quadruples the number of cubes', errorTag: 'concept-misconception', rationale: 'Only one of the three edges changed, so the product scales by 2, not 4.' },
            { text: 'adds two cubes', errorTag: 'representation-misread', rationale: 'Treats doubling a factor as adding two to the product.' },
          ],
          hints: ['When one edge doubles and the others stay, what happens to the product?', 'Picture the box with twice the layers stacked up.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D24-PZ-01',
    title: 'Puzzle Grove: The Box Designer',
    puzzleType: 'construction',
    prompt: 'Design two DIFFERENT boxes with whole-number edges that each hold exactly 24 unit cubes. Give both sets of edge lengths, then say which box is closer to a cube shape and explain how you know.',
    answer: { value: 'two whole-number triples with product 24, e.g. 2 by 3 by 4 and 1 by 4 by 6; the 2 by 3 by 4 box is closer to a cube', acceptableForms: ['2 by 3 by 4', '1 by 4 by 6', '24'], validation: 'short-text-keyword' },
    hintLadder: ['Which edge triples multiply to the target number of cubes?', 'Compare the longest and shortest edge of each box you found — which pair sits closer together?'],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: sitVolBox, diff: 3 },
    { gen: msFillThenAdd, diff: 3 },
    { gen: sitVolTank, diff: 3 },
    { gen: msNeedMore, diff: 3 },
    { gen: sitVolLayers, diff: 4 },
    { gen: sitVolStack, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/06: single-step volume of a box (V = l×w×h). 02/04: two-step volume (fill then combine / find the gap to full). 05: missing-dimension (total cubes ÷ base layer = layer count). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'area-vs-volume', description: 'Uses two edges (a flat layer, area) where three edges (the filled space, volume) are needed.', exampleWrongAnswer: 'volume of a 4 by 3 by 5 box answered as 12 (only the base layer)', distractorRationale: 'Offer the base-layer product instead of the full volume.', reteachPointer: 'explanation/script[0] (one layer stacked into height copies)' },
    { errorTag: 'procedure-slip', subtype: 'dropped-third-factor', description: 'Multiplies two of the three edges but forgets to multiply by the third.', exampleWrongAnswer: '4 by 3 by 5 answered as 20 (only two edges)', distractorRationale: 'Offer a two-edge product.', reteachPointer: 'guidedExamples/D24-GE-01 (base layer × height)' },
    { errorTag: 'representation-misread', subtype: 'scale-confusion', description: 'Confuses doubling one edge with doubling or adding to the whole volume.', exampleWrongAnswer: 'doubling the height answered as quadrupling the cubes', distractorRationale: 'Offer the over-scaled volume.', reteachPointer: 'Day-5 classify (one factor doubles the product)' },
    { errorTag: 'fact-recall', subtype: 'product-slip', description: 'Chooses the right three factors but slips on one of the multiplications.', exampleWrongAnswer: '12 layer cubes over 5 layers answered as 55', distractorRationale: 'Offer a near-miss product.', reteachPointer: '60-second multiplication-fact refresh (sprint pool)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Volume — filling a solid with unit cubes as V = length × width × height (one layer of cubes times the number of layers) — plus a capstone mix that pulls the level\'s arithmetic, fractions, and decimals back together, ready for Level E.',
    improvingCandidates: ['finding volume as one layer times the number of layers', 'designing a box to hit a target number of cubes', 'connecting volume back to area and multiplication'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'telling area (two edges, a flat layer) from volume (three edges, the filled space) — the layer picture makes the difference visible' },
      { errorTag: 'procedure-slip', text: 'remembering to multiply all THREE edge lengths' },
      { errorTag: 'representation-misread', text: 'not confusing doubling one edge with doubling or adding to the whole volume' },
    ],
    homeFocus: {
      praiseLine: 'You pictured one layer of cubes and stacked it up the height, so you saw exactly why volume multiplies all three edges instead of only two.',
      questionForChild: 'A box is 4 by 3 by 5 units — how many unit cubes fill it, and how does one layer help you count them?',
      schoolSyncHook: 'As your child finishes this level, tell us which Level-E topics their class is heading toward and we will preview them in the warm-ups.',
    },
    vocabularyForParent: ['volume (unit cubes that fill a solid)', 'cubic units (the units of volume)', 'layer (one base-area sheet of cubes)'],
  },
});
