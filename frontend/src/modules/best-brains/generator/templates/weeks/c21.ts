/**
 * Level C · Week 21 — "Perimeter vs area" (conceptId: perimeter-vs-area).
 *
 * FILL-ARCHITECTURE §5 row C21: anchor "fence vs field"; multi-step "both on one
 * figure"; error-analysis "adds all the sides for the area"; discrimination
 * "**THE cross-op week by design**"; Day-5 signature "same perimeter, different
 * areas (deep)".
 *
 * THE WHOLE WEEK IS ONE SUSTAINED DISCRIMINATION, so the content is built to
 * force the choice rather than to signal it:
 *  - **no item ever says "find the perimeter" or "find the area".** Every prompt
 *    states a physical JOB — a fence runs around the edge, carpet covers the
 *    inside, ribbon is glued to the rim, a pond eats into the grass — and the
 *    child decides which measure the job wants. That is the discrimination, and
 *    it runs through all five days rather than sitting in one flagged item;
 *  - three explicit traps on top of it: pick the NUMBER (with its label), pick
 *    the MOVE ("add all four side lengths" is offered as the area answer — the
 *    week's headline misconception, priced as a distractor), and pick between
 *    two pens built from the SAME fence;
 *  - two inverse-start chains (C's F3 ceiling) that cannot be done without both
 *    ideas: a fence length reveals the missing side and then the covering
 *    (msFenceToArea), and a covering reveals the missing side and then the walk
 *    around (msAreaToFence). Those are "both on one figure" as a single honest
 *    answer; the Day-5 puzzle asks for both out loud.
 *
 * UNITS ARE THE SECOND TRAP and they are handled at the source: every quantity
 * goes through `lib/format.ts` (never a bare `${…}`), perimeter answers carry
 * `units: 'meters' | 'centimeters'`, and every area answer carries
 * `units: 'square meters' | 'square centimeters'` — so `valueForms` builds
 * "36 square meters", never "36 meters", for the accepted-answer list too.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7). An `area-grid` can only assert
 * its CELL COUNT, and on this concept the cell count is the area — which is a
 * given on one kind of item and the answer on the other. So:
 *  - PERIMETER items draw the whole field in unit squares (the child walks the
 *    rim; the count inside is not what is asked) and assert that cell count
 *    against the plot's own `squares` param — provenance, never the answer;
 *  - AREA items draw ONE ROW and assert the GIVEN length, exactly as c06's
 *    array item does: the picture teaches the unit of covering and leaves the
 *    covering itself to the child;
 *  - the filled, counted grid appears only where the answer is already on the
 *    page — the lesson script and the modeled/completion guided examples;
 *  - the two inverse chains carry NO figure at all: a drawn grid would hand
 *    over the missing side, which is the first step they exist to ask for. The
 *    centimeter ribbon item is picture-free for a softer reason — a week that
 *    supplies a grid every single time teaches "wait for the grid".
 *
 * Contexts are hand-bound (place + job in one literal) rather than drawn from
 * `lib/contexts.ts`: every registered frame is a COUNT frame (equal groups,
 * sharing, parts of a set), and this week measures a border and a surface. No
 * two generators share a place, so no context repeats across days.
 *
 * Retrieval is backward-only into C3/C4 (± within 1,000 — the four-side walk is
 * an addition), C12 (the fact table the covering leans on) and above all C20,
 * whose rows-times-columns area is the skill this week sets a partner beside.
 */

import { addWhole, asWarmup, classify, multiply, reasoning, rectArea, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C12 = { level: 'C' as const, week: 12 };
const C20 = { level: 'C' as const, week: 20 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// Same wrapper c06 uses, for the same reason: the shipped primitives have no
// figure slot and lib/ is not ours to edit, so this works entirely inside the
// returned closure, takes no new rng draw, and leaves the prompt (and therefore
// the QG-1/QG-4 surface signature) untouched. It reads the drafted item's
// `generator.params` — the very numbers the answer was computed from — so the
// figure law holds by construction.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/**
 * A rectangle's two sides, drawn so the LENGTH is never shorter than the width.
 * English does not survive "4 meters long and 6 meters wide", and a child who
 * reads that sentence twice has been distracted from the only choice that
 * matters this week.
 */
function sides(r: Rng, lLo: number, lHi: number, wLo: number, wHi: number): { l: number; w: number } {
  const l = r.int(lLo, lHi);
  return { l, w: r.int(wLo, Math.min(wHi, l - 1)) };
}

/** What a child sees when a plot is drawn in unit squares. Never the way round. */
const plotScene = (l: number, w: number): string =>
  `the plot drawn in unit squares, ${countNoun(l, 'squares')} across and ${countNoun(w, 'squares')} down`;

/** One row of the covering — the unit of area, never the count of it. */
const rowScene = (l: number, place: string): string =>
  `one row across the ${place}, marked into ${countNoun(l, 'squares')}`;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

const wAdd = asWarmup(addWhole(105, 489), C3);
const wSub = asWarmup(subWhole(124, 698), C4);
const wFacts = asWarmup(multiply(3, 9, 3, 9), C12);
/** C20 — rows × columns. The enabling skill, warmed up in its own week's words. */
const wArea = asWarmup(rectArea(), C20);

// ---------------------------------------------------------------------------
// The border: single-step "way round" jobs. None of them names the perimeter.
// ---------------------------------------------------------------------------

const FENCE_SCENES = [
  { place: 'vegetable plot', barrier: 'low fence' },
  { place: 'flower bed', barrier: 'wooden border' },
  { place: 'herb patch', barrier: 'wire edging' },
  { place: 'pumpkin patch', barrier: 'rope line' },
] as const;

/**
 * The anchor border item. The registry carries no perimeter template, so the
 * answer is recomputed as 2 × (one length + one width) through `d_mul_v1`; the
 * drawn sides and the plot's square count ride along in `params` so both the
 * arithmetic audit and the figure audit have something of the item's own to
 * check against.
 */
const perPlotFence = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'perimeter',
    draw: (r) => {
      const { l, w } = sides(r, 6, 12, 2, 9);
      const s = r.pick(FENCE_SCENES);
      const name = one(r);
      return {
        prompt: `[image: ${plotScene(l, w)}] ${name}'s ${s.place} is ${countNoun(l, 'meters')} long and ${countNoun(w, 'meters')} wide. A ${s.barrier} runs right around the edge. How many meters of ${s.barrier} is that?`,
        answerValue: String(2 * (l + w)),
        templateId: 'd_mul_v1',
        params: { a: 2, b: l + w, l, w, squares: l * w },
        units: 'meters',
        hints: [
          'Does this job travel along the edge, or cover the middle?',
          'Trace right around with your finger and add the length of every side you cross.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: numOf(p, 'w'), cols: numOf(p, 'l') },
      { alt: plotScene(numOf(p, 'l'), numOf(p, 'w')), asserts: assertsParam('squares', 'cells') },
    ),
);

/** The square: four sides the same, so the walk is one side counted four times. */
const perSandpitEdge = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'perimeter',
    draw: (r) => {
      const side = r.int(3, 7);
      const name = one(r);
      return {
        prompt: `[image: ${plotScene(side, side)}] ${name} builds a square sandpit with sides of ${countNoun(side, 'meters')}. Wooden edging goes right around it. How many meters of edging is that?`,
        answerValue: String(4 * side),
        templateId: 'd_mul_v1',
        params: { a: 4, b: side, l: side, w: side, squares: side * side },
        units: 'meters',
        hints: [
          'How many sides does a square have, and how do those sides compare?',
          'Every side matches the one you measured, so count that length once for each side.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: numOf(p, 'w'), cols: numOf(p, 'l') },
      { alt: plotScene(numOf(p, 'l'), numOf(p, 'w')), asserts: assertsParam('squares', 'cells') },
    ),
);

/** The same border idea in centimeters, so the unit is not always "meters". */
const perCardRibbon = situation({
  situationType: 'measurement',
  cognitiveOp: 'perimeter',
  draw: (r) => {
    const { l, w } = sides(r, 10, 18, 5, 9);
    const thing = r.pick(['birthday card', 'bookmark', 'place mat']);
    const name = one(r);
    return {
      prompt: `${name} glues ribbon right around the rim of a ${thing}. The ${thing} is ${countNoun(l, 'centimeters')} long and ${countNoun(w, 'centimeters')} wide. How many centimeters of ribbon is that?`,
      answerValue: String(2 * (l + w)),
      templateId: 'd_mul_v1',
      params: { a: 2, b: l + w, l, w },
      units: 'centimeters',
      hints: [
        'Where does the ribbon actually sit — around the rim, or across the face?',
        'Follow the ribbon along all four edges, taking the long edge and the short edge twice each.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// The surface: single-step "covering" jobs, and the inverse that undoes one.
// ---------------------------------------------------------------------------

const CARPET_SCENES = ['reading corner', 'hall floor', 'porch', 'music room floor'] as const;

const areaCarpet = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'area',
    draw: (r) => {
      const { l, w } = sides(r, 5, 12, 2, 9);
      const place = r.pick(CARPET_SCENES);
      const name = one(r);
      return {
        prompt: `[image: ${rowScene(l, place)}] ${name} lays carpet over the whole ${place}. It is ${countNoun(l, 'meters')} long and ${countNoun(w, 'meters')} wide. How many square meters of carpet is that?`,
        answerValue: String(l * w),
        templateId: 'd_area_v1',
        params: { l, w, place },
        units: 'square meters',
        hints: [
          'Is the carpet laid along the edge, or over the whole inside?',
          'Count the squares in one row, then take that row once for every row.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'l') },
      { alt: rowScene(numOf(p, 'l'), strOf(p, 'place')), asserts: assertsParam('l', 'cells') },
    ),
);

/** Inverse: the covering and one side are known, the other side is not. */
const areaMissingSide = situation({
  situationType: 'part-whole',
  cognitiveOp: 'area-missing-side',
  usesPriorSkill: true,
  draw: (r) => {
    const { l, w } = sides(r, 5, 12, 3, 9);
    const name = one(r);
    return {
      prompt: `${name}'s mosaic covers ${countNoun(l * w, 'square centimeters')} of a wall. It is ${countNoun(l, 'centimeters')} long. How many centimeters wide is the mosaic?`,
      answerValue: String(w),
      templateId: 'd_div_v1',
      params: { a: l * w, b: l },
      units: 'centimeters',
      hints: [
        'If you know the whole covering and one side, what has the other side got to be?',
        'Share the covering squares into rows as long as the side you already know.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * Metacognition base — only ever served through the estimate-first wrapper.
 * The probe is this week's own question rather than a size guess: predicting
 * whether the squares inside beat the meters around forces the child to hold
 * both measures in mind before either is worked out.
 */
const areaBlanketBase = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'area',
    draw: (r) => {
      const { l, w } = sides(r, 4, 9, 2, 6);
      const name = one(r);
      return {
        prompt: `[image: ${rowScene(l, 'grass')}] ${name} unrolls a picnic blanket on the grass. It is ${countNoun(l, 'meters')} long and ${countNoun(w, 'meters')} wide. How many square meters of grass does it hide?`,
        answerValue: String(l * w),
        templateId: 'd_area_v1',
        params: { l, w, place: 'grass' },
        units: 'square meters',
        hints: [
          'Which measure does a blanket lying flat change — the way round, or the space covered?',
          'Picture one row of squares under the blanket, then repeat that row across the width.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'l') },
      { alt: rowScene(numOf(p, 'l'), strOf(p, 'place')), asserts: assertsParam('l', 'cells') },
    ),
);
const areaBlanketEstimate = withEstimateFirst(
  areaBlanketBase,
  'will the squares hidden underneath outnumber the meters around the rim, or fall short of them?',
);

// ---------------------------------------------------------------------------
// Multi-step. Every operand a chain consumes is stated in its own prompt.
// ---------------------------------------------------------------------------

/** Forward: the whole way round, then the stretch that carries no fence. */
const msPaddockGate = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'perimeter-multi',
  draw: (r) => {
    const { l, w } = sides(r, 9, 15, 4, 9);
    const gap = r.int(2, 4);
    const name = one(r);
    return {
      prompt: `${name}'s pony paddock is ${countNoun(l, 'meters')} long and ${countNoun(w, 'meters')} wide. ${name} fences right around it, leaving a gap of ${countNoun(gap, 'meters')} for the gate. How many meters of fence is that?`,
      initN: l,
      steps: [
        { op: 'add', n: w, d: 1 },
        { op: 'mul', n: 2, d: 1 },
        { op: 'sub', n: gap, d: 1 },
      ],
      units: 'meters',
      hints: [
        'Does the gate gap add fence, or take fence away?',
        'Walk the whole way round first, then take off the stretch that carries no fence.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** Forward: the whole covering, then the part of it that is not grass. */
const msLawnPond = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'area-multi',
  draw: (r) => {
    const { l, w } = sides(r, 7, 12, 4, 9);
    const pond = r.int(3, 12);
    const name = one(r);
    return {
      prompt: `${name}'s lawn is ${countNoun(l, 'meters')} long and ${countNoun(w, 'meters')} wide. A pond covers ${countNoun(pond, 'square meters')} of it. How many square meters of grass are left?`,
      initN: l,
      steps: [
        { op: 'mul', n: w, d: 1 },
        { op: 'sub', n: pond, d: 1 },
      ],
      units: 'square meters',
      hints: [
        'Is the pond part of the grass, or a hole cut out of it?',
        'Cover the whole rectangle first, then take out the squares the water sits on.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * Inverse-start, and the week's own two-step: the stated quantity is the RESULT
 * of the border operation, so half of it is one length plus one width, the known
 * length comes out of that half, and only then can the covering be counted. Both
 * ideas, one figure, one honest answer.
 */
const msFenceToArea = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'border-to-covering',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const { l, w } = sides(r, 7, 12, 2, 8);
    const name = one(r);
    return {
      prompt: `A roll of fencing is ${countNoun(2 * (l + w), 'meters')} long. ${name} uses every meter of it around a rectangular duck pen. The pen is ${countNoun(l, 'meters')} long. How many square meters does the pen cover?`,
      initN: 2 * (l + w),
      steps: [
        { op: 'div', n: 2, d: 1 },
        { op: 'sub', n: l, d: 1 },
        { op: 'mul', n: l, d: 1 },
      ],
      units: 'square meters',
      hints: [
        'What can the length of the fence tell you about the side nobody measured?',
        'Half the way round is one length and one width together, so take the known length out of that half.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/** Inverse-start, the other way round: the covering reveals the walk. */
const msAreaToFence = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'covering-to-border',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const { l, w } = sides(r, 4, 8, 2, 6);
    const name = one(r);
    return {
      prompt: `${name}'s tarpaulin covers ${countNoun(l * w, 'square meters')} of the yard. It is ${countNoun(l, 'meters')} long. Rope is threaded right around its edge. How many meters of rope is that?`,
      initN: l * w,
      steps: [
        { op: 'div', n: l, d: 1 },
        { op: 'add', n: l, d: 1 },
        { op: 'mul', n: 2, d: 1 },
      ],
      units: 'meters',
      hints: [
        'What does the covering tell you about the side you were not given?',
        'Split the covering into rows as long as the known side, then walk all four sides.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — three of them, because this is the cross-op week
// ---------------------------------------------------------------------------

const JOB_SCENES = [
  { place: 'sports hall floor', cover: 'covers it with square foam tiles', border: 'runs a strip of grip tape right around the rim' },
  { place: 'stage platform', cover: 'paints the whole top of it', border: 'nails a safety strip right around the rim' },
  { place: 'barn floor', cover: 'spreads straw over the whole floor', border: 'seals the join right around the rim' },
] as const;

/**
 * Pick the NUMBER — and its label. Both quantities are computable from the two
 * stated sides, the prompt describes a job rather than naming a measure, and the
 * options carry their units, so the same item prices the cross-op error and the
 * dropped-label error at once.
 */
const discrimWhichNumber = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const drawn = sides(r, 6, 12, 2, 9);
    const l = drawn.l;
    // (l−2)(w−2) = 4 is the one family where the covering and the way round land
    // on the same number, which would print two identical options.
    const w = (l - 2) * (drawn.w - 2) === 4 ? (drawn.w === 3 ? 2 : drawn.w - 1) : drawn.w;
    const s = r.pick(JOB_SCENES);
    const wantsCover = r.chance(0.5);
    const name = one(r);
    const area = l * w;
    const around = 2 * (l + w);
    return {
      prompt: `${name}'s ${s.place} is ${countNoun(l, 'meters')} long and ${countNoun(w, 'meters')} wide. ${name} ${wantsCover ? s.cover : s.border}. Which measurement does that job need?`,
      correct: wantsCover ? countNoun(area, 'square meters') : countNoun(around, 'meters'),
      distractors: [
        {
          text: wantsCover ? countNoun(around, 'meters') : countNoun(area, 'square meters'),
          errorTag: 'concept-misconception',
          rationale: wantsCover
            ? 'Measures the way round for a job that fills the inside — that is the fence, not the field.'
            : 'Counts the squares inside for a job that only ever touches the rim.',
        },
        {
          text: wantsCover ? countNoun(area, 'meters') : countNoun(around, 'square meters'),
          errorTag: 'representation-misread',
          rationale: 'The count is right and the label is not: a covering is counted in squares, a walk is counted in lengths.',
        },
        {
          text: countNoun(l + w, 'meters'),
          errorTag: 'task-comprehension',
          rationale: 'Stops after one length and one width, which is only half of the way round.',
        },
      ],
      hints: [
        'Which part of the shape does this job actually touch?',
        'Say the job back in your own words, then match it to a walk around the rim or a covering of the inside.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * Pick the MOVE. This is where "adds all the sides for the area" is priced: it
 * is offered as an answer, tagged, and rationalised, so the child has to reject
 * it rather than never meeting it.
 */
const discrimWhichMove = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    const { l, w } = sides(r, 6, 14, 3, 9);
    const place = r.pick(['greenhouse floor', 'skate deck', 'workshop floor']);
    const wantsCover = r.chance(0.5);
    const name = one(r);
    const job = wantsCover ? 'how much matting covers the whole of it' : 'how much trim runs right around its rim';
    return {
      prompt: `A rectangular ${place} is ${countNoun(l, 'meters')} long and ${countNoun(w, 'meters')} wide. ${name} needs to know ${job}. Which move finds it?`,
      correct: wantsCover ? 'multiply the two side lengths' : 'add all four side lengths',
      distractors: [
        {
          text: wantsCover ? 'add all four side lengths' : 'multiply the two side lengths',
          errorTag: 'concept-misconception',
          rationale: wantsCover
            ? 'Adding the four sides measures the walk around the rim, which never counts a single square of the inside.'
            : 'Multiplying the sides counts the squares that fill the middle, and trim never crosses the middle.',
        },
        {
          text: 'add the two different side lengths',
          errorTag: 'task-comprehension',
          rationale: 'Reaches only half of the way round, and it does not count a covering either.',
        },
      ],
      hints: [
        'Which of these moves stays on the border, and which one fills the middle?',
        'Picture each move happening: one walks the rim, the other tiles the whole shape.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The structural sibling and the seed of Day 5: two pens, one fence length, and
 * the option that says they must therefore hold the same. That option is the
 * misconception this week exists to break, so it is on the page as a choice.
 */
const discrimSameFence = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const half = r.int(9, 15);
    const cap = Math.floor(half / 2);
    const w1 = r.int(2, cap);
    let w2 = r.int(2, cap);
    if (w2 === w1) w2 = w1 === 2 ? 3 : w1 - 1;
    const l1 = half - w1;
    const l2 = half - w2;
    const big = Math.max(l1 * w1, l2 * w2);
    const small = Math.min(l1 * w1, l2 * w2);
    return {
      prompt: `Two rabbit runs are built from the same length of fencing. One is ${countNoun(l1, 'meters')} long and ${countNoun(w1, 'meters')} wide. The other is ${countNoun(l2, 'meters')} long and ${countNoun(w2, 'meters')} wide. How much floor space does the roomier run give?`,
      correct: countNoun(big, 'square meters'),
      distractors: [
        {
          text: countNoun(small, 'square meters'),
          errorTag: 'representation-misread',
          rationale: 'Reads the longer run as the roomier one; a long thin run has more length but less floor.',
        },
        {
          text: 'the two runs give the same floor space',
          errorTag: 'concept-misconception',
          rationale: 'Lets the fence decide the field — equal fences fix the way round, and the covering is still free to differ.',
        },
      ],
      hints: [
        'Do two runs with the same fence have to hold the same space?',
        'Work out the covering of each run, then hold the two numbers side by side.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's slip is "adds the sides for the area". The verify library
// computes a BINARY operation, so the shown wrong value is the honest output of
// adding the two measurements the plan carries, which is exactly the move the
// child has to name. The full four-side version of the same slip is priced in
// discrimWhichMove, where a distractor may be authored rather than computed.
// ---------------------------------------------------------------------------

const eaAddedTheSides = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'area',
  drawParams: (r) => ({ a: r.int(4, 12), b: r.int(3, 9), op: '*', wrongOp: '+' }),
  build: (v, p, r) => {
    const name = one(r);
    return {
      prompt: `A student measured ${name}'s rug: ${countNoun(Number(p.a), 'meters')} along one side and ${countNoun(Number(p.b), 'meters')} along the next. The question asked how much floor the rug covers. The student put the two measurements together and wrote ${v.wrong} square meters.`,
      extension: 'Draw the rug on squared paper, count what it really covers, and write one sentence saying what the student\'s number does measure.',
      hints: [
        'Which of the two measurements on its own tells you how much floor is covered?',
        'Draw the rug on squares and count what fits inside it.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: ['area', 'square meters', 'cover', 'multiply'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC21 = makeWeekBuilder({
  level: 'C',
  week: 21,
  conceptId: 'perimeter-vs-area',
  conceptName: 'Perimeter vs area',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [C3, C12, C20],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the fence and the field',
  conceptFamily: 'operation',
  deepeningDelta:
    'C20 taught one measure of a rectangle — the covering, found by rows × columns. C21 puts a second measure beside it and never signals which one a job wants, so the new load is the CHOICE (and its label), plus the inverse direction: a stated fence length or a stated covering now reveals the side nobody measured.',
  explanation: {
    hook:
      'Fencing is sold by the meter. Turf is sold by the square meter. Two children measure the same garden, come back with two different numbers, and both of them are right — this week is about knowing which number a job is asking for.',
    whyBeforeHow:
      'A rectangle can be measured in two completely different ways, and the two answers are not rivals — they answer different questions. The way round is a LENGTH, because you are walking a line from corner to corner to corner, and a line is measured in meters. The covering is a SURFACE, because you are filling the inside with squares, and a surface is counted in square meters. That is the difference between the fence and the field: the fence is a line you walk, the field is a space you cover. So the first job is never arithmetic — it is deciding which of the two the question wants, because the wrong one gives a number that looks perfectly reasonable and is useless.',
    script: [
      {
        say: 'Watch me measure this garden the first way. I put my finger on a corner and walk the edge like a fence: five meters, then three, then five, then three. That walk is the perimeter, and it is measured in meters.',
        visual: 'A garden drawn in unit squares with the border traced right around.',
        figure: areaGrid(
          { rows: 3, cols: 5 },
          { alt: 'a garden drawn in unit squares, 5 squares across and 3 squares down, with the border traced right around' },
        ),
      },
      {
        say: 'Here is the same walk laid out straight. Four sides, end to end, one line of fence — sixteen meters of it. Notice that nothing about this line tells me what is inside the garden.',
        visual: 'The four sides of the garden laid end to end as one bar.',
        figure: barModel(
          [
            {
              label: 'the four sides, end to end',
              segments: [{ value: 5 }, { value: 3 }, { value: 5 }, { value: 3 }],
              total: '16 m',
            },
          ],
          { scaleMax: 16, alt: 'the four sides of the garden laid end to end in one line, sixteen meters long' },
        ),
      },
      {
        say: 'Now the second way, on the same garden. I fill the inside with square meters: three rows of five squares, fifteen squares in all. That count is the area, and it is counted in square meters, not meters.',
        visual: 'The same garden filled with fifteen square meters, in three rows of five.',
        figure: areaGrid(
          { rows: 3, cols: 5, showCounts: true },
          { alt: 'the same garden filled with square meters, 3 rows of 5' },
        ),
      },
      {
        say: 'And here is the surprise. I bend that same sixteen meters of fence into a square garden instead. The fence has not changed one bit, but now sixteen squares fit inside where fifteen fitted before. The fence does not decide the field.',
        visual: 'A square garden with the same length of fence around it, holding one more square.',
        figure: areaGrid(
          { rows: 4, cols: 4, showCounts: true },
          { alt: 'a square garden filled with square meters, 4 rows of 4, with the same length of fence around it' },
        ),
      },
      {
        say: 'So before I write anything down I check the label I am about to use. A fence answer is in meters; a covering answer is in square meters. If I estimate roughly and the label feels wrong, I have answered the other question.',
        visual: 'Two labelled answer boxes side by side: meters for the fence, square meters for the field.',
      },
    ],
    summary:
      'Perimeter is the walk around the edge, measured in meters. Area is the covering inside, counted in square meters. Read the job first: does it travel along the rim, or fill the middle? And two shapes with the same fence can hold very different fields.',
    vocabulary: [
      { term: 'perimeter', kidGloss: 'the distance all the way around the edge of a shape' },
      { term: 'area', kidGloss: 'how much surface a shape covers, counted in squares' },
      { term: 'square meter', kidGloss: 'a square that measures one meter along every side' },
      { term: 'label (unit)', kidGloss: 'the words after the number that say what kind of measure it is' },
    ],
  },
  guidedExamples: [
    {
      ...ge(21, 1, 'modeled', 'A garden is 7 meters long and 4 meters wide. It needs a fence right around the edge and turf over the whole inside. How much of each?', [
        {
          teacherSay:
            'First I ask what each job touches, because that is what decides everything else. The fence lives on the EDGE, so I walk it: seven, then four, then seven, then four. How far is that walk?',
          expected: '22',
        },
        {
          teacherSay:
            'Now the turf. Turf lies on the INSIDE, so I stop walking and start counting squares: four rows with seven square meters in each row.',
          expected: '28',
          figure: areaGrid(
            { rows: 4, cols: 7, showCounts: true },
            { alt: 'the garden filled with square meters, 4 rows of 7', asserts: { of: 'cells', ...assertsAnswer } },
          ),
        },
        {
          teacherSay:
            'Two jobs, two numbers, two labels — and I write the labels on, because twenty-two and twenty-eight would be meaningless to the person buying the fence.',
        },
      ], '22 meters of fence and 28 square meters of turf'),
      visual: 'One garden, measured twice: the edge walked, then the inside filled.',
    },
    {
      ...ge(21, 2, 'completion', 'A rug is 6 meters long and 3 meters wide. How much floor does it cover?', [
        { teacherSay: 'Does a rug lying flat cover the floor, or edge it?', expected: 'covers it' },
        { childDo: 'Count one row of squares, then take that row for every row.', expected: '18' },
      ], '18 square meters'),
      visual: 'The rug drawn in square meters, three rows of six.',
      figure: areaGrid(
        { rows: 3, cols: 6, showCounts: true },
        { alt: 'a rug drawn in square meters, 3 rows of 6', asserts: { of: 'cells', ...assertsAnswer } },
      ),
    },
    ge(21, 3, 'prompted', 'A card is 9 centimeters long and 5 centimeters wide. Ribbon is glued right around its rim. How much ribbon is that?', [
      { childDo: 'Decide whether the job travels the rim or fills the middle, then work it out and write the label.', expected: '28' },
    ], '28 centimeters'),
    {
      // Independent stage: ONE row is drawn. Choosing which measure each half of
      // the question wants IS the task, so a full grid would answer the second
      // half before the child had read it.
      ...ge(21, 4, 'independent', 'A sandpit is 5 meters long and 4 meters wide. Work out the meters of edging for its border and the square meters of sand that fill it. Solve cold.', [
        { childDo: 'Take the two jobs one at a time, and label both answers.', expected: '18 meters and 20 square meters' },
      ], '18 meters of edging and 20 square meters of sand'),
      visual: 'One row of the sandpit marked into square meters. The rest is yours to work out.',
      figure: areaGrid({ rows: 1, cols: 5 }, { alt: 'one row across the sandpit, marked into 5 squares' }),
    },
  ],
  days: [
    // Day 1 — concept echo: one job per item, both measures met, single-step only.
    [
      { gen: wAdd, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: wFacts, diff: 2 },
      { gen: areaCarpet, diff: 2 },
      { gen: perPlotFence, diff: 3 },
      { gen: perSandpitEdge, diff: 3 },
    ],
    // Day 2 — fluency + application: the first trap, the estimate-first predict,
    // and the first two-step story.
    [
      { gen: wSub, diff: 2 },
      { gen: areaBlanketEstimate, diff: 3 },
      { gen: discrimWhichNumber, diff: 3 },
      { gen: msPaddockGate, diff: 4 },
      { gen: areaMissingSide, diff: 3 },
      { gen: perCardRibbon, diff: 3 },
    ],
    // Day 3 — interleave: the move-choice and the same-fence contrast beside a
    // two-step, with one unsignalled job of each kind to finish.
    [
      { gen: wFacts, diff: 2 },
      { gen: discrimSameFence, diff: 4 },
      { gen: discrimWhichMove, diff: 3 },
      { gen: msLawnPond, diff: 4 },
      { gen: perPlotFence, diff: 3 },
      { gen: areaCarpet, diff: 3 },
    ],
    // Day 4 — word problems: the two inverse-start chains that need both ideas,
    // beside the two forward chains and the single-step inverse.
    [
      { gen: msFenceToArea, diff: 5 },
      { gen: msAreaToFence, diff: 5 },
      { gen: msPaddockGate, diff: 4 },
      { gen: msLawnPond, diff: 4 },
      { gen: areaMissingSide, diff: 4 },
    ],
    // Day 5 — non-computational: the error-analysis, the same-fence investigation
    // written out, and the claim that generalises it (+ a ramped warm-up).
    [
      { gen: wAdd, diff: 2 },
      { gen: eaAddedTheSides, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Two dog pens are built from the same 24 meters of fencing. One is 8 meters by 4 meters. The other is 10 meters by 2 meters. Check that both really do use all 24 meters. Then work out the floor space of each, and write one sentence saying how the same fencing can hold two different amounts of space.',
          value:
            'both pens use 24 meters of fencing; the 8 by 4 pen covers 32 square meters and the 10 by 2 pen covers 20 square meters, so the same way round can hold different coverings',
          acceptableForms: ['32', '20', 'square meters', 'same fence', 'different'],
          keywords: true,
          hints: [
            'Which of the two pens looks squarer, and does that turn out to matter?',
            'Walk each pen to check the fencing, then count the squares inside each one.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: a rectangle with a longer fence around it covers more space than one with a shorter fence. Say in one sentence how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Lets the fence decide the field: a long thin rectangle can carry a huge fence around a tiny covering.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads the two measures as opposites — a wider fence often does hold more space, it just does not have to.',
            },
          ],
          hints: [
            'Can you picture a long thin rectangle beside a fat one?',
            'Give each of your two rectangles a fence length and a covering, then see whether the longer fence always wins.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the whole week turns on one question — does this job travel along the edge, or cover the inside? If your child gives a covering answer in meters, do not correct the number; ask them to point at what they measured. Pointing at the rim while saying "square meters" sorts it out faster than any rule. The surprise worth sharing at home: the same length of fence can hold very different amounts of space, and the squarer the shape, the more it holds.',
  ],
  puzzle: (r) => {
    const half = r.pick([8, 10, 12, 14] as const);
    const ways: string[] = [];
    for (let w = 1; w <= Math.floor(half / 2); w++) {
      const l = half - w;
      ways.push(`${countNoun(l, 'meters')} by ${countNoun(w, 'meters')} covers ${countNoun(l * w, 'square meters')}`);
    }
    const name = one(r);
    return {
      id: 'C21-PZ-01',
      title: 'Puzzle Grove: One Fence, Many Fields',
      puzzleType: 'construction',
      prompt: `${name} has ${countNoun(half * 2, 'meters')} of fencing for a rectangular tortoise run, and the sides must be whole meters. Find EVERY rectangle that uses all of the fencing, work out the floor space of each one, and say which shape gives the tortoise the most room.`,
      answer: { value: ways.join('; '), acceptableForms: ways, validation: 'short-text-keyword' },
      hintLadder: [
        'How could you be sure you had found EVERY rectangle, and not just some of them?',
        'One length and one width make half of the way round, so try each width in turn and see what length is left for it.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Multiplication facts — the rows-and-columns substrate',
    sourceWeek: C12,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: perPlotFence, diff: 3 },
    { gen: areaCarpet, diff: 3 },
    { gen: msPaddockGate, diff: 4 },
    { gen: msFenceToArea, diff: 4 },
    { gen: areaMissingSide, diff: 3 },
    { gen: msAreaToFence, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/02: the two single-step jobs the week keeps unsignalled — a border walked in meters and a covering counted in square meters, one of each. 03: forward two-step border (the whole way round, less the gate gap). 04/06: the two inverse-start chains — a stated fence length yielding a covering, and a stated covering yielding a fence length. 05: single-step inverse (covering ÷ known side). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'border-for-covering',
      description: 'Answers a covering job with the way round (or a border job with the squares inside) — the two measures are swapped.',
      exampleWrongAnswer: 'the turf for a 9 by 4 plot answered as 26 square meters',
      distractorRationale: 'Offer the other measure of the same rectangle, carrying its own label.',
      reteachPointer: 'explanation/script[2] (the inside filled with squares) beside script[0] (the edge walked)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-two-sides',
      description: 'Adds one length and one width and stops, reaching only half of the way round.',
      exampleWrongAnswer: 'the fence around a 9 by 4 plot answered as 13 meters',
      distractorRationale: 'Offer the sum of the two stated sides.',
      reteachPointer: 'guidedExamples/C21-GE-01 (four sides walked, not two)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'label-dropped',
      description: 'Finds the right number and writes the wrong label — meters for a covering, square meters for a walk.',
      exampleWrongAnswer: 'a covering of 36 square meters written as 36 meters',
      distractorRationale: 'Offer the correct number under the other measure\'s label.',
      reteachPointer: 'explanation/script[4] (check the label before writing the answer)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'side-missed',
      description: 'Chooses the right move but loses a side while walking round, or a row while counting the covering.',
      exampleWrongAnswer: 'the walk around a 7 by 5 plot answered as 19 meters',
      distractorRationale: 'Offer the result with one side left out.',
      reteachPointer: 'guidedExamples/C21-GE-02 (say the running total once per row), then the 2-minute multiplication sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Perimeter and area together — reading a job to decide whether it travels around the edge (meters of fence, ribbon, edging) or covers the inside (square meters of turf, carpet, straw), labelling each answer correctly, and working backwards from a fence length or a covering to the side nobody measured.',
    improvingCandidates: [
      'reading the job first and deciding which measure it wants',
      'writing the matching label — meters for a walk, square meters for a covering',
      'walking all four sides instead of stopping after two',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping the fence apart from the field — tracing the rim with a finger settles it in seconds',
      },
      {
        errorTag: 'representation-misread',
        text: 'labelling the answer, so a covering never comes back in plain meters',
      },
      {
        errorTag: 'task-comprehension',
        text: 'finishing the whole way round, gate gaps and all, before answering',
      },
    ],
    homeFocus: {
      praiseLine:
        'You traced the edge with your finger before you counted anything, and you checked the label on your answer — that is exactly the move that keeps these two measurements apart.',
      questionForChild: 'Our kitchen table needs a cloth over the top and a ribbon around the rim — which one needs square meters, and how do you know?',
      schoolSyncHook: 'If your child\'s class writes area as length × width or as rows × columns, tell us and we will use the same wording.',
    },
    vocabularyForParent: [
      'perimeter (the distance right around the edge, in meters)',
      'area (the covering inside, in square meters)',
      'label (the unit written after the number — it says which measure it is)',
    ],
  },
});
