/**
 * Level C · Week 15 — "Meeting fractions" (conceptId: meeting-fractions).
 *
 * FILL-ARCHITECTURE §5 row C15: anchor "equal-parts naming"; the week is
 * SINGLE-STEP BY DESIGN (band note), so it declares `conceptFamily:'place-value'`
 * and meets the one multi-step the gate asks for by composing with a strictly
 * prior week; error-analysis "the student who counts the UNSHADED parts";
 * discrimination "1/3 needs three EQUAL thirds"; Day-5 signature "fold/draw
 * thirds", whose drawing half is the flagged manual-review part (§7).
 *
 * The week's whole claim is that a fraction names EQUAL parts of one whole, so
 * "three pieces" and "thirds" are different facts about a shape — and the
 * content is built to force that check rather than decorate it:
 *  - the sharpest item is a structural discrimination between a strip cut into
 *    d matching pieces, a strip cut into d pieces that do NOT match, and a strip
 *    cut into d+1 matching pieces (the child who counted the CUTS). Nothing in
 *    it can be answered by counting alone;
 *  - a second discrimination offers the recipe's misconception as a live option:
 *    the fraction built from the parts that are NOT coloured;
 *  - a "re-cut" item hands the child a picture of a genuinely unequal cut and
 *    asks about the equal cut that replaces it — the picture is the
 *    counter-example, the question is the repair;
 *  - a generated error-analysis whose shown wrong number is the real output of
 *    the part-to-part reading (the gold parts weighed against the plain ones
 *    rather than against the whole).
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7, E2.5). Three things to know,
 * because this is the week where pictures carry the mathematics:
 *
 *  1. WHAT THE PRIMITIVES CAN AND CANNOT DRAW. `areaGrid` draws d equal cells
 *     with `shaded` of them filled — the equal-parts picture, exactly. Unequal
 *     parts are NOT expressible on a grid (its cells are equal by construction),
 *     but they ARE expressible on `barModel`, whose segments are drawn to a
 *     shared scale from their own `value`s: segments [1,2,1] draw one strip cut
 *     into three pieces where the middle one is visibly twice the others. So the
 *     unequal-parts trap is a REAL picture here, not a described one.
 *  2. WHAT A DAY-ITEM FIGURE ASSERTS. Never the answer: `sitOnePart` asserts the
 *     grid's CELL COUNT against the partition the prompt already states,
 *     `sitShadedFraction` asserts the SHADED COUNT the prompt states, the number
 *     line asserts the size of ONE step (never the landing mark), the re-cut bar
 *     asserts the length of the OLD cut. Every one of those is a given the child
 *     was handed; the naming — which is the answer — stays the child's.
 *  3. WHERE THE FULL PICTURE LIVES. The completed namings (1/4 shaded, 1/3 and
 *     2/3 on a line, a half held against three eighths) live in the lesson
 *     script and the modeled guided example, where the answer is already on the
 *     page.
 *
 * ONE LIBRARY GAP, recorded rather than faked (kit §E2.3 form): no registered
 * verify template computes a COMPLEMENT — "the count of the parts that are NOT
 * shaded" is an operand of the story, and `d_verify_binop_misconception_v1` can
 * only return a binary operation OF the two stated operands, so a truth/claim
 * pair of {n, d−n} is not derivable. The nearest genuine, code-derived member of
 * the same misconception family IS registered — `ratio_verify_part_whole_v1`
 * returns {p/(p+q), p/q}, the child who counts the unshaded parts and puts that
 * count under the line — so the Day-5 error-analysis uses it, and the literal
 * (d−n)/d reading ships as a live distractor on `discrimShadedName`, where its
 * value is derived from the item's own drawn parts.
 *
 * Retrieval is backward-only into B22 (halves and quarters — the direct
 * ancestor), C9 (sharing equally), C12 (the fact table) and C3 (addition).
 *
 * SCOPE NOTE vs C17: this week partitions ONE WHOLE (a strip, a cake, a number
 * line). Fractions of a SET of objects are C17's week and appear nowhere here.
 */

import { addWhole, asWarmup, classify, divideExact, multiply, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtFrac, partitionWord, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B22 = { level: 'B' as const, week: 22 };
const C3 = { level: 'C' as const, week: 3 };
const C6 = { level: 'C' as const, week: 6 };
const C9 = { level: 'C' as const, week: 9 };
const C12 = { level: 'C' as const, week: 12 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Scenes — one WHOLE thing and the word for one of its equal parts, drawn as a
// bound pair so "a cake cut into 6 equal panes" can never be assembled. Every
// whole starts with a consonant sound, so the article is always "a".
// ---------------------------------------------------------------------------

/**
 * Wholes that get CUT UP — the partition is an action the child can picture.
 *
 * `part` names the parts the FIRST time ("cut into 6 equal slices"), `piece`
 * names them on every mention after that ("4 slices are gone"): English drops
 * the adjective on the second reference, and `countNoun` needs a real noun on
 * both — "4 of them" is not something a formatter can inflect.
 */
const CUT_SCENES = [
  { whole: 'ribbon', part: 'equal pieces', piece: 'pieces' },
  { whole: 'cake', part: 'equal slices', piece: 'slices' },
  { whole: 'pizza', part: 'equal slices', piece: 'slices' },
  { whole: 'paper strip', part: 'equal parts', piece: 'parts' },
  { whole: 'chocolate bar', part: 'equal squares', piece: 'squares' },
  { whole: 'loaf of bread', part: 'equal slices', piece: 'slices' },
] as const;

/**
 * The subset of CUT_SCENES that can be EATEN.
 *
 * The party item drew its whole from the full pool and then said the pieces were
 * eaten, which at roughly a third of seeds told a child that a ribbon or a paper
 * strip had been eaten. The arithmetic was right, so every gate passed it; only
 * reading the sentence catches it. Any template whose verb only makes sense for
 * food must draw from here.
 */
const EDIBLE_SCENES = CUT_SCENES.filter((sc) =>
  ['cake', 'pizza', 'chocolate bar', 'loaf of bread'].includes(sc.whole),
);

/** Wholes that are BUILT from parts — the partition is already there to read. */
const PANEL_SCENES = [
  { whole: 'quilt', part: 'equal squares', piece: 'squares' },
  { whole: 'flag', part: 'equal bands', piece: 'bands' },
  { whole: 'wall', part: 'equal panels', piece: 'panels' },
  { whole: 'window', part: 'equal panes', piece: 'panes' },
] as const;

/**
 * Cut plans whose pieces are visibly NOT all the same size. Values are lengths
 * in "small pieces", which is exactly what `barModel` draws them as, so the
 * picture is unequal by construction rather than by caption.
 */
const UNEQUAL_PLANS = [
  [1, 2, 1],
  [2, 1, 1],
  [1, 1, 3],
  [1, 3, 1, 1],
  [2, 1, 1, 2],
] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep) have no figure slot, and lib/
// is not ours to edit, so this wrapper does what `withEstimateFirst` does: it
// works entirely inside the returned closure, takes no new rng draw, and leaves
// the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It reads
// the drafted item's `generator.params` — the very numbers the answer was
// computed from — so the figure law ("built from the item's own drawn values")
// holds by construction. (Pattern copied from c06/c05, the proven Level-C weeks.)
// ---------------------------------------------------------------------------

/** Local gcd — lib/compute's is not re-exported through the week-facing modules. */
function gcdOf(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcdOf(b, a % b);
}

/**
 * A numerator in [lo, hi] that leaves the fraction in LOWEST TERMS, drawn in one
 * pick from a precomputed list (never a redraw loop, kit §E2.4).
 *
 * Why lowest terms matters this week and not later: renaming is C16's lesson. A
 * picture of 2 coloured parts in 6 whose honest answer is "1/3" would teach
 * equivalence two weeks early, and — on the choice items — it would let a
 * distractor print the correct answer in a different dress.
 */
function coprimeIn(r: Rng, d: number, lo: number, hi: number): number {
  const cands: number[] = [];
  for (let n = lo; n <= hi; n++) if (gcdOf(n, d) === 1) cands.push(n);
  return cands.length > 0 ? r.pick(cands) : d - 1;
}

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);
const planOf = (p: Params): number[] => ((p.plan as number[] | undefined) ?? []);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C9 — sharing a whole set equally; the move a partition borrows its fairness from. */
const wShare = asWarmup(divideExact(2, 6, 3, 9), C9);
/** C12 — the fact table, kept warm for the piece-counting multi-step. */
const wMultiply = asWarmup(multiply(3, 9, 3, 9), C12);
/** C3 — addition within 1,000. */
const wAdd = asWarmup(addWhole(124, 468), C3);

/**
 * B22 — halves and quarters, the week's direct ancestor: the child has already
 * met "one of two equal parts" and "one of four equal parts" by name, and this
 * week only widens the same idea to any number of parts.
 */
const wHalfQuarter = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'name-half-quarter',
    draw: (r) => {
      const d = r.pick([2, 4] as const);
      const s = r.pick(CUT_SCENES);
      const name = one(r);
      return {
        prompt: `${name} cuts a ${s.whole} into ${countNoun(d, s.part)} and takes one of them. What fraction of the whole ${s.whole} is that?`,
        answerValue: fmtFrac(1, d, 'partition-anchored'),
        templateId: 'd_frac_times_whole_v1',
        params: { k: 1, n: 1, d },
        validation: 'equivalent-fraction',
        hints: [
          'How many equal parts is the whole thing sitting in?',
          'The bottom number counts every equal part; one single part is one of them.',
        ],
        errorTags: ['concept-misconception', 'fact-recall'],
      };
    },
  }),
  B22,
);

// ---------------------------------------------------------------------------
// Single-step naming — the week's own form, in four models
// ---------------------------------------------------------------------------

/**
 * The anchor: one whole, d matching parts, and the name for ONE of them. The
 * picture shows the partition the prompt states and asserts its CELL COUNT — a
 * given. Nothing in the grid is shaded, so the picture cannot say which part is
 * meant or what it is called; the naming is the child's.
 */
const sitOnePart = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'name-unit-fraction',
    draw: (r) => {
      const d = r.pick([3, 5, 6, 8, 10, 12] as const);
      const s = r.pick(CUT_SCENES);
      const name = one(r);
      return {
        prompt: `[image: one ${s.whole} cut into ${countNoun(d, s.part)}] ${name} cuts a ${s.whole} into ${countNoun(d, s.part)}. What fraction of the whole ${s.whole} is ONE of those ${unitFor(2, s.part)}?`,
        answerValue: fmtFrac(1, d, 'partition-anchored'),
        templateId: 'd_frac_times_whole_v1',
        params: { k: 1, n: 1, d, whole: s.whole, part: s.part },
        validation: 'equivalent-fraction',
        hints: [
          'Does every part in this cut hold the same amount as the others?',
          'Count the equal parts the whole was cut into. Write that number underneath. One single part sits on top.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'd') },
      {
        alt: `one ${strOf(p, 'whole')} cut into ${countNoun(numOf(p, 'd'), strOf(p, 'part'))}, with none of them coloured`,
        asserts: assertsParam('d', 'cells'),
      },
    ),
);

/**
 * The read-it-off form: a whole BUILT from equal parts, some of them coloured.
 * The numerator is drawn coprime with the denominator, so the fraction the child
 * writes is already the fraction the page shows — renaming is C16's week, not
 * this one, and a shaded picture that answers "1/3" to a 2-of-6 count would
 * teach the wrong lesson two weeks early.
 */
const sitShadedFraction = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'name-fraction',
    draw: (r) => {
      const d = r.pick([4, 5, 6, 8, 9, 10] as const);
      // Two or more coloured parts: naming ONE part is the other generator's
      // item, and this one exists to show that the top number can count several.
      const k = coprimeIn(r, d, 2, d - 1);
      const s = r.pick(PANEL_SCENES);
      const name = one(r);
      return {
        prompt: `[image: one ${s.whole} made of ${countNoun(d, s.part)} with ${countNoun(k, s.piece)} coloured] ${name} makes a ${s.whole} from ${countNoun(d, s.part)} and paints ${countNoun(k, s.piece)} gold. What fraction of the whole ${s.whole} is gold?`,
        answerValue: fmtFrac(k, d, 'partition-anchored'),
        templateId: 'd_frac_times_whole_v1',
        params: { k, n: 1, d, whole: s.whole, part: s.part, piece: s.piece },
        validation: 'equivalent-fraction',
        hints: [
          'Which parts does the question name: the coloured ones, or the plain ones?',
          'Put the count of every equal part underneath. Put the count of the named parts on top.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'd'), shaded: numOf(p, 'k') },
      {
        alt: `one ${strOf(p, 'whole')} made of ${countNoun(numOf(p, 'd'), strOf(p, 'part'))}, with ${countNoun(numOf(p, 'k'), strOf(p, 'piece'))} coloured`,
        asserts: assertsParam('k', 'shaded'),
      },
    ),
);

/**
 * The number-line model: the same naming, but the whole is a LENGTH and the
 * parts are steps. The picture draws the partition and ONE step out of it — the
 * unit the child counts with — and asserts that step against the item's own
 * `unit` param. The landing mark is never drawn, so the line cannot answer the
 * question; it only says how big one step is.
 */
const sitNumberLine = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'name-fraction-line',
    draw: (r) => {
      const d = r.pick([3, 4, 5, 6, 8] as const);
      // At least two steps: the picture marks ONE step, so a one-step hop would
      // land exactly on the mark the child was handed and the item would be
      // answered by the scaffold rather than by counting.
      const k = coprimeIn(r, d, 2, d - 1);
      const name = one(r);
      return {
        prompt: `[image: a number line from 0 to 1 divided into ${countNoun(d, 'equal steps')}, with one step marked] A number line runs from 0 to 1. The space between them is divided into ${countNoun(d, 'equal steps')}. ${name} starts at 0 and hops ${countNoun(k, 'steps')} forward. Which fraction names the mark ${name} lands on?`,
        answerValue: fmtFrac(k, d, 'partition-anchored'),
        templateId: 'd_frac_times_whole_v1',
        params: { k, n: 1, d, unit: fmtFrac(1, d, 'partition-anchored') },
        validation: 'equivalent-fraction',
        hints: [
          'How much of the whole journey does a single step cover?',
          'Name one step first, then count how many of those steps the hop uses up.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const d = numOf(p, 'd');
    return numberLine(
      {
        min: 0,
        max: 1,
        step: 1,
        partition: d,
        labels: 'ends',
        marks: [{ at: 1 / d, style: 'point' }],
        hops: [{ from: 0, to: 1 / d, label: 'one step' }],
      },
      {
        alt: `a number line from 0 to 1 divided into ${countNoun(d, 'equal steps')}, with one step marked from 0`,
        asserts: { of: 'mark:0', equals: 'param:unit' },
      },
    );
  },
);

/**
 * The repair item — the discrimination in working form. The child is HANDED a
 * picture of a genuinely unequal cut (bar segments of different lengths, drawn
 * to a shared scale) and told that no piece of it can be named. The question is
 * about the equal cut that replaces it, so the picture is the counter-example
 * and can never hand over the answer: it shows a different cut from the one the
 * question asks about. The bar asserts its own total length, which is the drawn
 * plan, not anything the child is asked for.
 */
const sitRecut = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'partition-repair',
    draw: (r) => {
      const plan = r.pick(UNEQUAL_PLANS);
      const pieces = plan.length;
      let d: number = r.pick([3, 4, 5, 6, 8] as const);
      // A re-cut into the same number of parts lets a child answer from the
      // piece count alone, which is the reading this item exists to break. The
      // plans run 3–4 pieces long, so one deterministic step up always clears it
      // and always lands on a partition the week already uses.
      if (d === pieces) d = d + 1;
      const s = r.pick(CUT_SCENES);
      const name = one(r);
      return {
        prompt: `[image: a ${s.whole} cut into ${countNoun(pieces, 'pieces')} that are not all the same size] A ${s.whole} has been cut into ${countNoun(pieces, 'pieces')}. But the pieces are not all the same size. So not one of them can be named as a fraction. ${name} takes a fresh ${s.whole}. It is cut into ${countNoun(d, s.part)} instead. What fraction of that whole ${s.whole} is one of ${name}'s ${unitFor(2, s.part)}?`,
        answerValue: fmtFrac(1, d, 'partition-anchored'),
        templateId: 'd_frac_times_whole_v1',
        params: { k: 1, n: 1, d, plan: [...plan], planTotal: plan.reduce((a, b) => a + b, 0), whole: s.whole, part: s.part },
        validation: 'equivalent-fraction',
        hints: [
          'Which of the two cuts in this story can a fraction actually name?',
          'Work with the cut whose parts all match. Then count how many parts the whole holds.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const plan = planOf(p);
    return barModel(
      [{ segments: plan.map((value) => ({ value })) }],
      {
        scaleMax: numOf(p, 'planTotal'),
        alt: `one ${strOf(p, 'whole')} cut into ${countNoun(plan.length, 'pieces')} that are not all the same size`,
        asserts: assertsParam('planTotal', 'bar:0'),
      },
    );
  },
);

/**
 * The measurement form, and the week's second composition with a prior week:
 * the parts are equal because the LENGTH was shared equally (C9), so the
 * fraction idea and the division idea meet on one strip. The bar shows the whole
 * length the child was given, uncut — the sharing is the question.
 */
const sitEqualLengths = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'equal-parts-length',
    usesPriorSkill: true,
    draw: (r) => {
      const d = r.pick([3, 4, 5, 6, 8] as const);
      const q = r.int(4, 15);
      const len = d * q;
      const name = one(r);
      return {
        prompt: `[image: one unbroken bar standing for the whole ${len} cm ribbon] A ribbon is ${countNoun(len, 'cm')} long. ${name} cuts it into ${countNoun(d, 'equal pieces')}. How long is one of those pieces?`,
        answerValue: String(q),
        templateId: 'd_div_v1',
        params: { a: len, b: d },
        units: 'cm',
        hints: [
          'Is the stated length the whole ribbon, or one piece?',
          'Share the whole length out equally, one turn for each piece. Then read off what one piece gets.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    barModel(
      [{ label: 'the whole ribbon', segments: [{ value: numOf(p, 'a'), label: `${numOf(p, 'a')} cm` }] }],
      {
        scaleMax: numOf(p, 'a'),
        alt: `one unbroken bar standing for the whole ${countNoun(numOf(p, 'a'), 'cm')} ribbon, with no cuts drawn on it`,
        asserts: assertsParam('a'),
      },
    ),
);

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so this
 * ladder is never drawn twice by two different routes (kit §E2.2).
 *
 * The probe is a genuine call: the coloured count runs from two parts up to one
 * short of the whole, so "more or less than half?" cannot be answered by reflex,
 * and answering it is exactly the benchmark sense a child needs before they can
 * tell 3/8 from 5/8. NO FIGURE, on purpose: a picture of the shaded slices would
 * let the child SEE the answer to the probe instead of reasoning it out.
 */
const sitCakeShare = situation({
  situationType: 'sharing',
  cognitiveOp: 'name-fraction-share',
  draw: (r) => {
    // No sixths here: with 6 parts the only coprime count above one is 5, which
    // would make the estimate probe ("more or less than half?") the same call
    // every time. These denominators put the eaten part on both sides of half.
    const d = r.pick([5, 7, 8, 9, 10] as const);
    const k = coprimeIn(r, d, 2, d - 1);
    // EDIBLE_SCENES, not CUT_SCENES: this sentence says the pieces were eaten.
    const s = r.pick(EDIBLE_SCENES);
    const name = one(r);
    return {
      prompt: `${name} cuts a ${s.whole} into ${countNoun(d, s.part)}. It is shared out at a party. By the end, ${countNoun(k, s.piece)} have been eaten. What fraction of the whole ${s.whole} has been eaten?`,
      answerValue: fmtFrac(k, d, 'partition-anchored'),
      templateId: 'd_frac_times_whole_v1',
      params: { k, n: 1, d },
      validation: 'equivalent-fraction',
      hints: [
        'Would the part that has gone fill half of the whole?',
        'Count every equal part the whole was cut into. That is the bottom number. Then count the ones that have gone.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});
const sitCakeShareEstimate = withEstimateFirst(
  sitCakeShare,
  'will the part eaten be more or less than half the whole?',
);

// ---------------------------------------------------------------------------
// The one multi-step (§6.1 place-value row): counting UNIT PIECES, composed
// with C6's equal groups. The fraction idea supplies the unit — every tray is
// cut the same way, so a piece is a piece wherever it comes from — and the prior
// week supplies the arithmetic. `usesPriorSkill` records the composition.
// ---------------------------------------------------------------------------

const msCountPieces = multiStep({
  situationType: 'combine',
  usesPriorSkill: true,
  draw: (r) => {
    const perTray = r.pick([4, 6, 8] as const);
    const trays = r.int(3, 6);
    const taken = r.int(2, 9);
    const name = one(r);
    return {
      prompt: `Every tray of fudge is cut into ${countNoun(perTray, 'equal pieces')}. ${name} fills ${countNoun(trays, 'trays')} that way. Then ${countNoun(taken, 'pieces')} are taken for the tasting table. How many pieces are left?`,
      initN: perTray,
      steps: [
        { op: 'mul', n: trays, d: 1 },
        { op: 'sub', n: taken, d: 1 },
      ],
      units: 'pieces',
      hints: [
        'Does the question ask about one tray, or about everything left?',
        'Count what all the trays hold first, then take off the ones that leave.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's point, forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * THE sharpest item in the week. Three strips, one fraction name, and counting
 * cannot separate them: the trap strip has exactly the right NUMBER of pieces
 * and the wrong sizes, while the third strip has matching pieces and one too
 * many of them — the child who counted the cuts rather than the parts.
 *
 * The options are described in words rather than drawn, because a choice block
 * holds text: three little pictures cannot be options. The unequal cut is drawn
 * where it can be — the lesson script, the completion example, the re-cut item
 * and the puzzle all carry the real bar picture.
 */
const discrimEqualThirds = discrimination({
  variant: 'structural',
  cognitiveOp: 'equal-parts-check',
  draw: (r) => {
    const d = r.pick([3, 4, 5, 6] as const);
    const name = one(r);
    return {
      prompt: `${name} cuts up three paper strips of the same size. Which strip shows ${partitionWord(d)}?`,
      correct: `the strip cut into ${countNoun(d, 'pieces')} that are all the same size`,
      distractors: [
        {
          text: `the strip cut into ${countNoun(d, 'pieces')} where one piece is longer than the others`,
          errorTag: 'concept-misconception',
          rationale: 'Counts the pieces and stops there. A fraction can only name parts that match, so a strip with one long piece has no part that fits the name.',
        },
        {
          text: `the strip cut into ${countNoun(d + 1, 'pieces')} that are all the same size`,
          errorTag: 'representation-misread',
          rationale: 'Counts the CUTS rather than the parts they make — a straight cut across a strip always leaves one more piece than there are cuts.',
        },
      ],
      hints: [
        'Which strip could you fold so every piece lands on top of the others?',
        'Count the parts, then check their sizes: a fraction name needs both to be right.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The naming trap, carrying the recipe's misconception as a live option: the
 * first distractor IS the fraction built from the parts that were NOT coloured,
 * and the second weighs the coloured parts against the plain ones instead of
 * against the whole. Both are computed from the item's own drawn parts, so a
 * distractor cannot drift away from the story it belongs to.
 */
const discrimShadedName = discrimination({
  variant: 'structural',
  cognitiveOp: 'name-fraction-choice',
  draw: (r) => {
    const d = r.pick([5, 7, 8, 9, 10] as const);
    // Fewer gold parts than plain ones, and coprime with the whole. Both
    // constraints are about the DISTRACTORS: coprime means neither wrong option
    // can be a renaming of the right one (renaming is C16), and keeping the gold
    // count under half keeps the part-to-part option below one — a fraction over
    // one is a wrong answer no child would ever be tempted by, and a trap nobody
    // falls into is not a trap.
    const k = coprimeIn(r, d, 2, Math.ceil(d / 2) - 1);
    const s = r.pick(PANEL_SCENES);
    const name = one(r);
    return {
      prompt: `${name} builds a ${s.whole} from ${countNoun(d, s.part)}. ${countNoun(k, s.piece)} are gold and the rest are plain. Which fraction names the gold part of the whole ${s.whole}?`,
      correct: `${k}/${d}`,
      distractors: [
        {
          text: `${d - k}/${d}`,
          errorTag: 'concept-misconception',
          rationale: 'Counts the parts left plain and puts that count on top. The top number has to count the parts the question actually names.',
        },
        {
          text: `${k}/${d - k}`,
          errorTag: 'representation-misread',
          rationale: 'Weighs the gold parts against the plain ones. The bottom number counts every equal part in the whole, not the ones left over.',
        },
      ],
      hints: [
        'What does the bottom number of a fraction have to count?',
        'Count every equal part in the whole for the bottom. Then count only the named parts for the top.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's error: the student who counts the UNSHADED parts. The registered
// truth that computes it is `ratio_verify_part_whole_v1` — correct = p/(p+q),
// the gold parts against every equal part; wrong = p/q, the gold parts against
// the plain ones. What makes this the week's item rather than an arithmetic
// item: the student COUNTED CORRECTLY. Both of their numbers are really on the
// page, so there is nothing to find by re-counting — the only way in is to ask
// what the bottom number of a fraction is for.
// ---------------------------------------------------------------------------

const eaCountedThePlainParts = errorAnalysis({
  verifyTemplateId: 'ratio_verify_part_whole_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const q = r.int(4, 8);
    // Fewer gold parts than plain ones, and coprime with them: the true fraction
    // and the student's both come out in lowest terms, so the two differ by what
    // they MEAN rather than by a renaming the child has not been taught yet.
    return { p: coprimeIn(r, q, 2, q - 1), q };
  },
  build: (v, p, r) => {
    const s = r.pick(PANEL_SCENES);
    const name = one(r);
    return {
      prompt: `${name} builds a ${s.whole} from equal parts. ${countNoun(Number(p.p), 'parts')} are gold and ${countNoun(Number(p.q), 'parts')} are plain. Asked what fraction of the whole ${s.whole} is gold, a student wrote ${v.wrong}.`,
      extension: `Draw the whole ${s.whole} with all of its equal parts. Write the fraction that really names the gold part. Then say in one sentence which parts the student counted underneath the line.`,
      hints: [
        'What does the bottom number of a fraction have to count?',
        'Count every equal part in the whole first. Only then decide which parts the question names.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: ['every equal part', 'the whole', 'all the parts'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC15 = makeWeekBuilder({
  level: 'C',
  week: 15,
  conceptId: 'meeting-fractions',
  conceptName: 'Meeting fractions',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [B22, C6, C9],
  pedagogyContract: 'v2',
  conceptualAnchor: 'equal-parts naming',
  conceptFamily: 'place-value',
  deepeningDelta:
    'B22 named two special cuts — halves and quarters — on shapes that were already folded for the child. C15 widens that to any number of parts, adds the number line as a second whole, and makes the EQUALITY of the parts something the child has to check rather than assume. Naming a fraction is genuinely single-step at this stage, so the week does not force a two-step: the one multi-step it carries composes this week\'s unit — a piece of an equally-cut tray — with C6\'s equal groups (usesPriorSkill), and the measurement item composes it with C9\'s equal sharing. Renaming and comparing fractions stay closed until C16.',
  explanation: {
    hook:
      'Cut a cake into three pieces and you have three pieces. Cut it into three pieces of the same size and you have thirds. Only then is there anything for a fraction to name.',
    whyBeforeHow:
      'A fraction is a name for parts of one whole. The name only tells the truth if every part is exactly the same size. That is why equal-parts naming starts with a check, not with a count. The bottom number says how many equal parts the whole was cut into. The top number says how many of those parts you mean. So three pieces are not automatically thirds. If one piece is longer than the others, a part has no single size. Then no fraction fits. Check that the parts match, count them, and the name writes itself.',
    script: [
      {
        say: 'Watch me name a part. I have cut this strip into four parts. Before I say one word about fractions, I check that the four parts match. They do. So one of them is one quarter of the strip. I write that as 1/4.',
        visual: 'A strip cut into four equal parts, with one part coloured.',
        figure: areaGrid(
          { rows: 1, cols: 4, shaded: 1 },
          { alt: 'a strip cut into four equal parts, with one of them coloured' },
        ),
      },
      {
        say: 'Now watch this strip. It is cut into three pieces too. But look at the middle one. It is as long as the other two put together. Three pieces, yes. Thirds, no. There is no fraction I can write for these parts. The parts do not have one size between them.',
        visual: 'A strip cut into three pieces, the middle one twice as long as the others.',
        figure: barModel(
          [{ segments: [{ value: 1 }, { value: 2 }, { value: 1 }] }],
          { scaleMax: 4, alt: 'a strip cut into three pieces where the middle piece is as long as the other two put together' },
        ),
      },
      {
        say: 'The same idea rides on a number line. I divide the space between 0 and 1 into three equal steps. One step from zero lands on the mark called 1/3. Two steps land on 2/3. If my steps were not equal the marks would name nothing.',
        visual: 'A number line from 0 to 1 in three equal steps, with the first two marks named.',
        figure: numberLine(
          {
            min: 0,
            max: 1,
            step: 1,
            partition: 3,
            labels: 'ends',
            marks: [
              { at: 1 / 3, label: '1/3', style: 'flag' },
              { at: 2 / 3, label: '2/3', style: 'flag' },
            ],
          },
          { alt: 'a number line from 0 to 1 divided into three equal steps, with the first two step marks named 1/3 and 2/3' },
        ),
      },
      {
        say: 'One more habit before I write any fraction down. I check the size I expect. Half of this strip is four of its eight parts. So a smaller coloured piece has to get a name smaller than one half. Three parts out of eight is a little under half. If I had written something bigger than half, I would count the parts again.',
        visual: 'Half a strip coloured, beside three eighths of the same strip coloured.',
        figure: barModel(
          [
            { label: 'one half', segments: [{ value: 4, label: '4 of 8' }, { value: 4, fill: 'none' }] },
            { label: 'three eighths', segments: [{ value: 3, label: '3 of 8' }, { value: 5, fill: 'none' }] },
          ],
          { scaleMax: 8, alt: 'two strips of eight equal parts: the first with four parts coloured, the second with three coloured' },
        ),
      },
    ],
    summary:
      'Count the parts, then check that they match. A fraction only names EQUAL parts of one whole. The bottom number tells how many equal parts the whole was cut into. The top number counts the parts you mean. Three pieces that do not match are not thirds. That holds on a strip, on a cake and on a number line.',
    vocabulary: [
      { term: 'equal parts', kidGloss: 'parts of one whole that are all exactly the same size' },
      { term: 'fraction', kidGloss: 'a name for equal parts of one whole' },
      { term: 'unit fraction', kidGloss: 'one single equal part, like one third' },
      { term: 'thirds', kidGloss: 'the parts you get when one whole is cut into three equal parts' },
      { term: 'the whole', kidGloss: 'the one thing that is being cut up — all of it' },
    ],
  },
  guidedExamples: [
    {
      ...ge(15, 1, 'modeled', 'A ribbon is cut into 4 equal pieces, and 3 of them are painted gold. What fraction of the whole ribbon is gold?', [
        {
          teacherSay:
            'First I hunt for the words that promise the pieces match: "equal pieces". That is what lets me use a fraction at all. Without it I would have four pieces of ribbon and nothing to name.',
        },
        {
          teacherSay: 'Now the bottom number counts every equal piece in the whole ribbon. The top number counts only the gold ones. What fraction does that give me?',
          expected: '3/4',
        },
      ], '3/4'),
      visual: 'A ribbon cut into four equal pieces, with three of them coloured.',
      figure: areaGrid(
        { rows: 1, cols: 4, shaded: 3 },
        { alt: 'a ribbon cut into four equal pieces, with three of them coloured', asserts: { of: 'shaded-fraction', ...assertsAnswer } },
      ),
    },
    {
      ...ge(15, 2, 'completion', 'A strip is cut into 3 pieces. The middle piece is as long as the other two put together. Is one of the small pieces one third of the strip?', [
        { teacherSay: 'Do the three pieces of this strip match each other?', expected: 'no' },
        { childDo: 'Say what would have to change about this cut before a third could be named.', expected: 'the three pieces would all have to be the same size' },
      ], 'no — the three pieces are not the same size, so none of them can be called one third'),
      visual: 'A strip cut into three pieces, the middle one twice as long as the others.',
      figure: barModel(
        [{ segments: [{ value: 1 }, { value: 2 }, { value: 1 }] }],
        { scaleMax: 4, alt: 'a strip cut into three pieces where the middle piece is as long as the other two put together' },
      ),
    },
    {
      ...ge(15, 3, 'prompted', 'A number line runs from 0 to 1. The space between them is divided into 6 equal steps. Which fraction names the mark 5 steps from 0?', [
        { childDo: 'Name what one single step is worth first, then count the steps in the hop.', expected: '5/6' },
      ], '5/6'),
      visual: 'A number line from 0 to 1 divided into six equal steps, with nothing marked yet.',
      figure: numberLine(
        { min: 0, max: 1, step: 1, partition: 6, labels: 'ends' },
        { alt: 'a number line from 0 to 1 divided into six equal steps, with no mark on it yet' },
      ),
    },
    // Independent stage: no picture at all. Deciding what the whole is, and that
    // the slices match, IS the task here — drawing the cake would do the first
    // half of it for the child.
    ge(15, 4, 'independent', 'A cake is cut into 8 equal slices. 3 slices are eaten. What fraction of the whole cake has been eaten? Solve cold.', [
      { childDo: 'Count every equal slice in the whole cake, then count the ones that have gone.', expected: '3/8' },
    ], '3/8'),
  ],
  days: [
    // Day 1 — concept echo: the naming move in three models (area, built whole,
    // shared length), single-step only, with the halves-and-quarters ancestor
    // opening the week.
    [
      { gen: wHalfQuarter, diff: 2 },
      { gen: wShare, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: sitOnePart, diff: 2 },
      { gen: sitShadedFraction, diff: 3 },
      { gen: sitEqualLengths, diff: 3 },
    ],
    // Day 2 — fluency + application: the naming trap and the estimate-first
    // metacognition enter, and the re-cut item asks for the first real judgement.
    [
      { gen: wMultiply, diff: 2 },
      { gen: wHalfQuarter, diff: 2 },
      { gen: sitCakeShareEstimate, diff: 3 },
      { gen: discrimShadedName, diff: 3 },
      { gen: sitNumberLine, diff: 3 },
      { gen: sitRecut, diff: 4 },
    ],
    // Day 3 — interleave: both discriminations back to back (the equal-parts
    // check and the naming trap) against the week's multi-step and two namings,
    // so the page shape never tells the child which question is coming.
    [
      { gen: wShare, diff: 2 },
      { gen: discrimEqualThirds, diff: 4 },
      { gen: discrimShadedName, diff: 4 },
      { gen: msCountPieces, diff: 4 },
      { gen: sitOnePart, diff: 3 },
      { gen: sitShadedFraction, diff: 3 },
    ],
    // Day 4 — word problems: the multi-step, the repair, and the three models
    // of naming carried in real situations.
    [
      { gen: msCountPieces, diff: 4 },
      { gen: sitRecut, diff: 4 },
      { gen: sitNumberLine, diff: 4 },
      { gen: sitEqualLengths, diff: 4 },
      { gen: sitCakeShareEstimate, diff: 4 },
    ],
    // Day 5 — non-computational: the error-analysis, the fold-and-draw
    // production (its drawing half flagged for a person to read), and the claim
    // that settles when three pieces really are thirds (+ a ramped warm-up).
    [
      { gen: wMultiply, diff: 2 },
      { gen: eaCountedThePlainParts, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Fold a strip of paper into three equal parts. Colour one of them. Write one sentence saying how you KNOW your three parts really are thirds. Then draw a second strip cut into three pieces that are not thirds. Write what is different about it.',
          value:
            'the three folded parts land exactly on top of each other, so each one is one third; the second strip has three pieces that are not the same size, so no piece of it can be called a third',
          hints: [
            'How could you check that your three parts really do match?',
            'Fold the strip back on itself, or measure the parts, and say what you find.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? A shape is cut into three pieces. One of those pieces is one third of the shape. In one sentence, explain how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Names the pieces by counting them, so any three-piece cut becomes thirds — even a cut with one long piece and two short ones.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Rules out the fair cut as well, where the three pieces really do match and each one of them is a third.',
            },
          ],
          hints: [
            'Can you picture a three-piece cut where the pieces do not match?',
            'Try one cut with matching pieces. Try another with a long piece and two short ones. Does a single answer cover both?',
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
    'For grown-ups: the whole week rests on one habit — before naming any fraction, check that the parts match. If your child calls three uneven pieces "thirds", do not correct the word; hand them the paper and ask them to fold it so the pieces land on top of each other. The fold settles it in seconds, and folding is the thing they will still be doing in their heads next year.',
  ],
  puzzle: (r) => {
    // A strip of `small + 1` pieces: all but one the same size, and one that is
    // `big` of those small pieces long. Nothing here is a quarter or a third —
    // the child has to measure the odd piece in small ones before any fraction
    // can be named at all.
    const small = r.int(3, 5);
    const big = r.pick([2, 3] as const);
    const units = small + big;
    const plan = [...Array.from({ length: small }, () => 1), big];
    return {
      id: 'C15-PZ-01',
      title: 'Puzzle Grove: The Piece That Cheats',
      puzzleType: 'logic',
      prompt: `[image: a strip cut into ${countNoun(small + 1, 'pieces')} — ${countNoun(small, 'pieces')} the same size, and one longer piece] A strip is cut into ${countNoun(small + 1, 'pieces')}. ${countNoun(small, 'pieces')} are exactly the same size. The last one is as long as ${countNoun(big, 'small pieces')} put together. What fraction of the whole strip is ONE small piece? Why can no piece be named until the long one is measured?`,
      figure: barModel(
        [{ segments: plan.map((value) => ({ value })) }],
        {
          scaleMax: units,
          alt: `a strip cut into ${countNoun(small + 1, 'pieces')}: ${countNoun(small, 'pieces')} the same size, and one that is as long as ${countNoun(big, 'small pieces')} put together`,
        },
      ),
      answer: {
        value: fmtFrac(1, units, 'partition-anchored'),
        acceptableForms: [`1 out of ${units}`],
        validation: 'equivalent-fraction',
      },
      hintLadder: [
        'Could you cut the long piece so every piece matches?',
        'Lay the small piece along the long one. How many times does it fit? Then count how many small pieces the whole strip would make.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Multiplication facts — the counting the tray-of-pieces problems lean on',
    sourceWeek: C12,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sitOnePart, diff: 3 },
    { gen: msCountPieces, diff: 4 },
    { gen: sitShadedFraction, diff: 3 },
    { gen: sitRecut, diff: 4 },
    { gen: sitNumberLine, diff: 3 },
    { gen: sitEqualLengths, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: naming one equal part, naming several coloured parts, and naming a mark on a partitioned number line — the three models the week teaches, one each, with the cell-count, shaded-count and one-step figure affordances preserved. 02: the piece-counting two-step. 04: the re-cut judgement, whose unequal bar is redrawn from its own fresh plan. 06: equal parts of a measured length. Operand surfaces are drawn fresh per slot but uniqueness is NOT enforced across forms or days; where a fact space is small, a mastery item can coincide with the operands of a daily item.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'counts-pieces-not-equal-parts',
      description: 'Names a fraction from the number of pieces without checking that the pieces are the same size, so any three-piece cut becomes thirds.',
      exampleWrongAnswer: 'one of three uneven pieces called 1/3',
      distractorRationale: 'Offer the cut that has the right number of pieces and the wrong sizes.',
      reteachPointer: 'explanation/script[1] (three pieces whose middle one is as long as the other two)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'wrong-bottom-number',
      description: 'Builds the bottom number from something other than the whole — the parts left over, or the number of cuts rather than the parts they make.',
      exampleWrongAnswer: '3 gold parts of a whole with 5 plain ones written as 3/5',
      distractorRationale: 'Offer the fraction that weighs the named parts against the leftover parts, and the cut with one extra piece.',
      reteachPointer: 'guidedExamples/C15-GE-01 (the bottom number counts every equal piece in the whole)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'names-the-other-parts',
      description: 'Answers with the parts the question did not ask about — the plain ones when the coloured ones were named, or the whole when one part was named.',
      exampleWrongAnswer: 'a quilt with 3 gold squares of 8 answered as 5/8',
      distractorRationale: 'Offer the fraction built from the parts the question leaves out.',
      reteachPointer: 'explanation/script[0] (say out loud which parts you are naming before you write anything)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'miscounts-the-parts',
      description: 'Chooses the right move and then loses the count — one part short or one part over when counting the parts of the whole.',
      exampleWrongAnswer: 'a strip of 8 equal parts counted as 7',
      distractorRationale: 'Offer the fraction whose bottom number is one part out.',
      reteachPointer: 'guidedExamples/C15-GE-03 (touch each part once as you count it), then the 2-minute facts sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Meeting fractions — naming EQUAL parts of one whole, writing unit fractions like one third, reading fractions off strips, cakes and a number line, and checking that the parts really match before any fraction name is written.',
    improvingCandidates: [
      'checking that every part is the same size before naming a fraction',
      'counting all the equal parts of the whole for the bottom number',
      'naming a mark on a number line as a fraction',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'the difference between three pieces and three EQUAL pieces — folding the paper settles it in a second',
      },
      {
        errorTag: 'representation-misread',
        text: 'building the bottom number from every equal part of the whole, not from the parts left over',
      },
      {
        errorTag: 'task-comprehension',
        text: 'naming the parts the question asks about rather than the ones beside them',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the count of the parts steady — touching each part once as it is counted',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked that all the parts matched before you named the fraction, and you counted every equal part of the whole for the bottom number — that check is the heart of this week.',
      questionForChild: 'If we cut this sandwich into three pieces and one is bigger, is a small piece one third? How could we fix the cut?',
      schoolSyncHook: 'If your child\'s class says "one third" where we write 1/3, or uses shapes we have not cut up here, tell us and we will match them.',
    },
    vocabularyForParent: [
      'equal parts (all exactly the same size — the check that comes first)',
      'unit fraction (one single equal part, like 1/3)',
      'the whole (the one thing being cut up)',
    ],
  },
});
