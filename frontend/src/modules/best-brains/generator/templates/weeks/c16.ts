/**
 * Level C · Week 16 — "Equivalent & comparing fractions"
 * (conceptId: equivalent-comparing-fractions).
 *
 * FILL-ARCHITECTURE §5 row C16: anchor "the number line and its half-way mark";
 * multi-step "rename, then compare"; error-analysis on the bigger-bottom trap;
 * discrimination "the bigger-bottom trap made a choice"; Day-5 signature "a
 * benchmark sort" — D9's little sibling, pitched for eight-year-olds.
 *
 * The week makes ONE claim in two halves, and everything is built to force it:
 *
 *  1. RE-MARKING THE RULER DOES NOT MOVE THE MARK. A trail cut into thirds and
 *     the same trail cut into twelfths is one trail; the bench standing at the
 *     1/3 mark is standing at the 4/12 mark too, and it has not shifted an inch.
 *     That is what makes two fractions equal, and it is why the `number-line`
 *     primitive carries this week: it takes a `partition`, so the identical
 *     point can be drawn on a coarse ruler and on a fine one and visibly NOT
 *     move. Both directions are taught — renaming UP (a trail re-marked finer)
 *     and renaming DOWN (links gathered into bunches).
 *  2. MORE PIECES FROM ONE WHOLE MEANS SMALLER PIECES. Eight is a bigger number
 *     than three and an eighth is a smaller piece than a third, and no amount of
 *     staring at the numerals will tell a child that. Two things settle it: the
 *     same whole cut both ways, drawn to one scale, and the half-way mark.
 *
 * THE BIGGER-BOTTOM TRAP, AND WHERE IT HONESTLY LIVES (kit §E2.3 form). The
 * recipe names "1/8 > 1/3 because 8 > 3" as the week's error-analysis. It cannot
 * be one, and the reason is worth recording rather than papering over: the shown
 * `wrong` value of a generated error-analysis must be a REAL output of a
 * registered verify transform, and no registered transform can produce it.
 * `d_verify_frac_v1` varies the fraction OPERATION over one operand pair (it
 * cannot pick between two fractions); `d_verify_binop_misconception_v1` varies
 * the operation over one fixed pair (a, b), so it cannot express the operand
 * SWAP the trap really is — a whole W shared d1 ways versus the same W shared d2
 * ways needs W÷d1 and W÷d2, and no single binary operation on (W, d1) returns
 * W÷d2 for sensible partitions. A comparison's answer is a fraction, not an
 * arithmetic result, so there is nothing to recompute. Fabricating the number
 * was never an option, so the trap is placed where it CAN be shown honestly, and
 * placed everywhere:
 *   - `discrimBiggerPiece`, a live choice whose wrong option is the bigger-bottom
 *     unit fraction, computed from the item's own drawn partitions (Days 2, 3);
 *   - the Day-5 Always/Sometimes/Never claim, which is the trap generalised —
 *     and answers "sometimes", so it also breaks the over-generalisation a child
 *     forms right after learning the same-numerator rule;
 *   - `sitTwoMaps`, where the trap becomes arithmetic: on a 24 m course one of
 *     the twelve stretches really does come out at 2 m and one of the four at 6 m;
 *   - explanation/script[2], where the two cuts of one whole are drawn to a
 *     single scale, and mistakeBank[0].
 * The GENERATED Day-5 error-analysis therefore carries the derivable slip that
 * sits closest to the week's own arithmetic: renaming by SUBTRACTING the two
 * numbers instead of sharing ("a trail of 12 stretches, so 1/3 of it is 12 − 3 =
 * 9 stretches"). Both numbers come from `d_verify_binop_misconception_v1` over
 * the item's own partition, nothing is invented, and the repair tool is the
 * week's own anchor — 1/3 falls short of the half-way mark while 9 of 12
 * stretches runs well past it, so the benchmark catches the slip before any
 * arithmetic does.
 *
 * FIGURE LAW as applied here (kit §F.7, §E2.5). On an assessed item the picture
 * asserts a GIVEN and never the answer: the number line carries the OLD ruler
 * with the old mark flagged (the new name is the child's), the chain grid asserts
 * the painted count the prompt already states, the bar asserts the whole length
 * or the single known share. The full journey — one point wearing two names, and
 * thirds held against eighths — lives in explanation.script and the modeled
 * guided example, where the answer is already on the page. The two
 * discriminations carry no picture at all, and deliberately: their options are
 * text, and any drawing of the two cuts would answer the question.
 *
 * QG-12b: every fraction printed in a word-problem prompt is drawn in LOWEST
 * TERMS at the source (`coprimeIn`), so an unreduced real-world quantity cannot
 * occur. Unreduced forms appear only where the rename IS the lesson — the
 * classification items, the puzzle and the Day-5 sort — none of which is a
 * word problem.
 *
 * SCOPE vs the neighbours: C15 named equal parts of ONE whole and never renamed
 * one; C17 takes the same bottom-number meaning to a SET of separate objects.
 * This week owns the middle: one whole, two rulers. Its contexts (journeys with
 * a start and a finish, and things built from equal links) are used by neither.
 *
 * Retrieval is backward-only into C15 (naming one equal part), C12 (the fact
 * table a rename is read off), C9 (equal sharing) and C2 (comparing whole
 * numbers — the move this week takes to fractions).
 */

import { asWarmup, classify, compareWhole, divideExact, multiply, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtFrac, partitionWord, unitFor } from '../lib/format';
import { gcd } from '../lib/compute';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C2 = { level: 'C' as const, week: 2 };
const C9 = { level: 'C' as const, week: 9 };
const C12 = { level: 'C' as const, week: 12 };
const C15 = { level: 'C' as const, week: 15 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two distinct drawn names, for the items that put two children side by side. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// Scenes
//
// The week needs two kinds of whole and it draws each as a BOUND scene, so a
// "scooter run cut into equal links" can never be assembled:
//  - a JOURNEY, which is the number line made concrete: it has a start, an end
//    and a length, and every one of its parts is called a "stretch". One shared
//    part-word across the week is deliberate — the whole point is that the
//    stretches change SIZE when the ruler changes, not what they are called.
//  - a MADE thing, built from equal parts that can be gathered into groups —
//    which is renaming in the other direction.
// EVERY whole named below begins with a consonant SOUND, so the article in front
// of it is always "a" and no prompt has to interpolate one — the kit §F.6 rule
// made a property of the data. An "obstacle course" in these pools would print
// "A obstacle course runs 36 m…", which nothing in the stack reads for: QG-12c's
// article check covers numerals only. It was in this pool once; it is not now.
// ---------------------------------------------------------------------------

const JOURNEY_SCENES = [
  { whole: 'treasure trail', from: 'start flag', to: 'treasure chest', move: 'walks' },
  { whole: 'relay track', from: 'start line', to: 'finish line', move: 'runs' },
  { whole: 'scooter run', from: 'first cone', to: 'last cone', move: 'rides' },
  { whole: 'nature walk', from: 'garden gate', to: 'duck pond', move: 'walks' },
] as const;

/**
 * The journeys that may be quoted a LENGTH IN METRES. A course laid out on a
 * school field really is a few dozen metres long; a nature walk is not, and "a
 * 24 m nature walk" is the kind of sentence a gate cannot see and a reader
 * cannot un-see. Only these three carry a measurement.
 */
const COURSE_SCENES = [
  { whole: 'relay track', from: 'start line', to: 'finish line' },
  { whole: 'scooter run', from: 'first cone', to: 'last cone' },
  { whole: 'long jump run-up', from: 'first marker', to: 'take-off board' },
] as const;

/** Something a child stands on the trail so a mark has a name in the story. */
const LANDMARKS = ['bench', 'water barrel', 'signpost', 'oak tree'] as const;

const MADE_SCENES = [
  { whole: 'paper chain', part: 'equal links', piece: 'links', group: 'bunches' },
  { whole: 'toy train', part: 'equal carriages', piece: 'carriages', group: 'sets' },
  { whole: 'paper snake', part: 'equal segments', piece: 'segments', group: 'bands' },
] as const;

/**
 * Same-length things two children can genuinely CUT UP — the trap's habitat.
 * A toy train is built from carriages and cannot be cut into five matching
 * pieces, which is why the cutting items draw from their own pool.
 */
const CUT_SCENES = ['strip of card', 'length of string', 'length of wool'] as const;

// ---------------------------------------------------------------------------
// Draw helpers — deterministic, never a redraw loop (kit §E2.4)
// ---------------------------------------------------------------------------

/**
 * A numerator in [lo, hi] sharing no factor with `d`, drawn in ONE pick from a
 * precomputed list. Lowest terms at the source is what keeps every prose
 * fraction honest as a real-world quantity (QG-12b) — reducing after the params
 * are fixed would desynchronise the prose from `generator.params`.
 */
function coprimeIn(r: Rng, d: number, lo: number, hi: number): number {
  const cands: number[] = [];
  for (let n = lo; n <= hi; n++) if (gcd(n, d) === 1) cands.push(n);
  return cands.length > 0 ? r.pick(cands) : 1;
}

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives have no figure slot and lib/ is not ours to edit, so
// this wrapper does what `withEstimateFirst` does: it works entirely inside the
// returned closure, takes no new rng draw, and leaves the prompt (and therefore
// the QG-1/QG-4 surface signature) untouched. It reads the drafted item's
// `generator.params` — the very numbers the answer was computed from — so the
// figure law holds by construction. (Pattern from c05/c06/c15/c17.)
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

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C12 — the fact table every rename is read off. Threes and up: a Level-C
 *  child at week sixteen is not warmed up by two times two. */
const wFactRecall = asWarmup(multiply(3, 9, 3, 9), C12);
/** C9 — sharing a whole into equal parts, the substrate a partition rests on. */
const wShareEqually = asWarmup(divideExact(3, 6, 3, 9), C9);
/** C2 — deciding which of two whole numbers is greater; this week does it to fractions. */
const wCompareNumbers = asWarmup(compareWhole(3), C2);

/**
 * C15 — naming ONE equal part of a whole. The direct ancestor: the child can
 * already write 1/6, and this week asks what that name is worth beside another.
 */
const wNameOnePart = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'name-unit-fraction',
    draw: (r) => {
      const d = r.pick([3, 4, 6, 8] as const);
      const s = r.pick(MADE_SCENES);
      const name = one(r);
      return {
        prompt: `${name} builds a ${s.whole} out of ${countNoun(d, s.part)}. What fraction of the whole ${s.whole} is ONE of those ${unitFor(2, s.piece)}?`,
        answerValue: fmtFrac(1, d, 'partition-anchored'),
        templateId: 'd_frac_times_whole_v1',
        params: { k: 1, n: 1, d },
        validation: 'equivalent-fraction',
        hints: [
          'How many matching parts does the whole thing hold?',
          'Write that count below the line, and one single part sits above it.',
        ],
        errorTags: ['concept-misconception', 'fact-recall'],
      };
    },
  }),
  C15,
);

// ---------------------------------------------------------------------------
// Equivalence — one point, two rulers
// ---------------------------------------------------------------------------

/**
 * THE anchor item: a journey marked one way, then re-marked finer, with a
 * landmark that cannot move. Renaming UPWARD.
 *
 * The picture draws the OLD ruler and flags the landmark on it — the given the
 * prompt already states, asserted against the item's own `mark` param. The new
 * ruler is never drawn, so the answer stays the child's; a line partitioned into
 * the NEW count would let them count sub-ticks and be done.
 */
const sitRemarkTheTrail = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'frac-equiv-line',
    draw: (r) => {
      const d1 = r.pick([2, 3, 4, 5, 6] as const);
      // The finer ruler stays inside the partitions a Level-C child has a WORD
      // for (twelfths at the outside); a re-marking into eighteenths is arithmetic
      // this week has no business teaching. Computed, never redrawn.
      const k = r.int(2, Math.min(4, Math.max(2, Math.floor(12 / d1))));
      const d2 = d1 * k;
      const n1 = coprimeIn(r, d1, 1, d1 - 1);
      const s = r.pick(JOURNEY_SCENES);
      const spot = r.pick(LANDMARKS);
      return {
        prompt: `[image: a line for the whole ${s.whole} marked into ${countNoun(d1, 'equal stretches')}, with a flag standing on the ${spot} at the ${fmtFrac(n1, d1, 'partition-anchored')} mark] The keepers marked a ${s.whole} into ${countNoun(d1, 'equal stretches')}, and the ${spot} stands at the ${fmtFrac(n1, d1, 'partition-anchored')} mark. They rub those marks out and mark the same ${s.whole} into ${countNoun(d2, 'equal stretches')} instead. How many of the new stretches lie between the ${s.from} and the ${spot}?`,
        answerValue: String(n1 * k),
        templateId: 'd_frac_equiv_v1',
        params: { n1, d1, d2, mark: fmtFrac(n1, d1, 'partition-anchored'), whole: s.whole, spot },
        acceptableForms: [fmtFrac(n1 * k, d2, 'partition-anchored')],
        hints: [
          'Has the landmark itself moved, or only the marks drawn underneath it?',
          'Work out how many new stretches fit inside one old stretch, then take that many for every old stretch you pass.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const d1 = numOf(p, 'd1');
    return numberLine(
      {
        min: 0,
        max: 1,
        step: 1,
        partition: d1,
        labels: 'all',
        labelAs: 'fraction',
        marks: [{ at: numOf(p, 'n1') / d1, label: strOf(p, 'spot'), style: 'flag' }],
      },
      {
        alt: `a line for the whole ${strOf(p, 'whole')} marked into ${countNoun(d1, 'equal stretches')}, with a flag standing on the ${strOf(p, 'spot')} at the ${strOf(p, 'mark')} mark`,
        asserts: assertsParam('mark', 'mark'),
      },
    );
  },
);

/**
 * Renaming DOWNWARD, and on a built whole rather than a journey: the links are
 * gathered into equal bunches, so the painted run of links acquires a coarser
 * name. The grid shows the chain with the painted links coloured — the count the
 * prompt already states — and draws no bunch boundaries, so the regrouping,
 * which is the question, stays with the child.
 */
const sitGatherIntoBunches = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'frac-equiv-regroup',
    draw: (r) => {
      const groups = r.pick([3, 4] as const);
      // Keep the drawn chain inside what one row of cells can still be counted
      // along at a glance — sixteen links is the ceiling, not twenty.
      const per = groups === 4 ? r.int(3, 4) : r.int(3, 5);
      const whole = groups * per;
      const kept = r.int(1, groups - 1);
      const painted = kept * per;
      const s = r.pick(MADE_SCENES);
      const name = one(r);
      return {
        prompt: `[image: a ${s.whole} of ${countNoun(whole, s.piece)} with the first ${countNoun(painted, s.piece)} coloured] ${name}'s ${s.whole} has ${countNoun(whole, s.part)}. ${name} gathers them into ${countNoun(groups, 'equal ' + s.group)}. The gold paint runs along the first ${countNoun(painted, s.piece)}. How many whole ${unitFor(2, s.group)} has the paint covered?`,
        answerValue: String(kept),
        templateId: 'd_frac_equiv_v1',
        params: { n1: painted, d1: whole, d2: groups, piece: s.piece, whole: s.whole },
        units: s.group,
        hints: [
          'Does the paint stop part-way along a group, or exactly at the end of one?',
          'Count how many pieces sit in a single group, then see how many of those groups the paint uses up.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'd1'), shaded: numOf(p, 'n1') },
      {
        alt: `a ${strOf(p, 'whole')} of ${countNoun(numOf(p, 'd1'), strOf(p, 'piece'))} with the first ${countNoun(numOf(p, 'n1'), strOf(p, 'piece'))} coloured and no groups drawn on it`,
        asserts: assertsParam('n1', 'shaded'),
      },
    ),
);

// ---------------------------------------------------------------------------
// Comparison and benchmark, as arithmetic
// ---------------------------------------------------------------------------

/**
 * The bigger-bottom trap turned into a MEASUREMENT the child can check: one
 * whole, two people's markings, and the question asks for the length of a single
 * stretch on the finer marking. The numbers do the arguing — a twelfth of the
 * run really does come out shorter than a third of it.
 *
 * The bar shows the whole length uncut and asserts it. Drawing either marking
 * would answer the question.
 */
const sitTwoMaps = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'unit-fraction-size',
    draw: (r) => {
      const d1 = r.pick([2, 3, 4] as const);
      let k = r.int(2, 3);
      // Two-into-two leaves a four-way cut, which is too near the two-way one to
      // make the point; one deterministic step (kit §E2.4). The cap keeps the
      // finer partition at twelfths or below.
      if (d1 === 2 && k === 2) k = 3;
      const d2 = d1 * k;
      const per = r.int(2, 4);
      const len = d2 * per;
      const s = r.pick(COURSE_SCENES);
      const [first, second] = two(r);
      return {
        prompt: `[image: one unbroken bar standing for the whole ${len} m ${s.whole}] A ${s.whole} runs ${countNoun(len, 'm')} from the ${s.from} to the ${s.to}. ${first} marks it into ${countNoun(d1, 'equal stretches')}, so one of ${first}'s stretches is ${fmtFrac(1, d1, 'partition-anchored')} of the whole ${s.whole}. ${second} marks the same ${s.whole} into ${countNoun(d2, 'equal stretches')}, so one of ${second}'s stretches is ${fmtFrac(1, d2, 'partition-anchored')} of it. How long is ONE of ${second}'s stretches?`,
        answerValue: String(per),
        templateId: 'd_div_v1',
        params: { a: len, b: d2, whole: s.whole },
        units: 'm',
        hints: [
          'Which of the two markings chops the whole thing into more pieces, and what does that do to one piece?',
          'Give every stretch on that marking an equal slice of the full length, then read off what a single stretch is worth.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) =>
    barModel(
      [{ label: `the whole ${strOf(p, 'whole')}`, segments: [{ value: numOf(p, 'a'), label: countNoun(numOf(p, 'a'), 'm') }] }],
      {
        scaleMax: numOf(p, 'a'),
        alt: `one unbroken bar standing for the whole ${countNoun(numOf(p, 'a'), 'm')} ${strOf(p, 'whole')}, with no stretches marked on it`,
        asserts: assertsParam('a', 'bar:0'),
      },
    ),
);

/**
 * Where the half-way mark actually LIVES on a partitioned whole — the fact the
 * benchmark reasoning rests on, and worth an item of its own before a child is
 * asked to lean anything on it.
 *
 * The figure is the empty number line: both ends named and nothing in between,
 * which is the given. A line already carrying its stretches would let the child
 * count to the middle, and the middle is the answer.
 */
const sitHalfWayCone = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'benchmark-half',
    draw: (r) => {
      const stretches = 2 * r.int(3, 10);
      const s = r.pick(JOURNEY_SCENES);
      const name = one(r);
      return {
        prompt: `[image: a bare line for the whole ${s.whole}, with the two ends named and nothing marked in between] ${name} wants a marker post standing exactly half way along a ${s.whole} that carries ${countNoun(stretches, 'equal stretches')}. How many stretches from the ${s.from} does the post stand?`,
        answerValue: String(stretches / 2),
        templateId: 'd_div_v1',
        params: { a: stretches, b: 2, whole: s.whole, from: s.from, to: s.to },
        units: 'stretches',
        hints: [
          'How many stretches should be left on each side of the post?',
          'Split the stretches into two matching halves and count the stretches in one of them.',
        ],
        errorTags: ['procedure-slip', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    numberLine(
      { min: 0, max: numOf(p, 'a'), step: numOf(p, 'a'), labels: 'all' },
      {
        alt: `a bare line for the whole ${strOf(p, 'whole')}, running from 0 at the ${strOf(p, 'from')} to ${countNoun(numOf(p, 'a'), 'stretches')} at the ${strOf(p, 'to')}, with nothing marked in between`,
      },
    ),
);

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so this
 * ladder is never reached by two routes (kit §E2.2).
 *
 * The probe is the week's benchmark and it is a genuine call: the drawn fraction
 * lands on either side of half. NO FIGURE, on purpose — a line already carrying
 * the stretches would let the child SEE which side of half the walk finishes on
 * instead of deciding it.
 */
const sitStretchesWalked = situation({
  situationType: 'part-whole',
  cognitiveOp: 'frac-rename-count',
  draw: (r) => {
    const d = r.pick([3, 4, 5, 6, 8] as const);
    const k = r.int(2, 3);
    const whole = d * k;
    const n = coprimeIn(r, d, 1, d - 1);
    const s = r.pick(JOURNEY_SCENES);
    const name = one(r);
    return {
      prompt: `${name} sets off along a ${s.whole} that carries ${countNoun(whole, 'equal stretches')}, and ${s.move} ${fmtFrac(n, d, 'partition-anchored')} of the way along it. How many stretches has ${name} covered?`,
      answerValue: String(n * k),
      templateId: 'd_frac_equiv_v1',
      params: { n1: n, d1: d, d2: whole },
      units: 'stretches',
      hints: [
        'Which number in the fraction says how many pieces the whole journey was broken into?',
        'Cut the journey into that many matching parts, count the stretches in one part, then take as many parts as the top number asks for.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const sitStretchesWalkedEstimate = withEstimateFirst(
  sitStretchesWalked,
  // "the journey", not "the walk": the scene's own verb may be runs or rides,
  // and a probe is fixed text — it has to fit every scene the base can draw.
  'will the journey cover more than half of the stretches, or fewer than half of them?',
);

// ---------------------------------------------------------------------------
// Multi-step — "rename, THEN compare" (the C16 recipe row) and its siblings.
//
// The rename is this week's move and the second step is a prior week's, so each
// chain declares `usesPriorSkill`. In every one the first stated quantity is the
// chain's `initN` and each step's operand is a number the prose states.
// ---------------------------------------------------------------------------

/**
 * The recipe's multi-step, and the only honest way to end a comparison on a
 * computed number at this band: rename one child's fraction into the trail's own
 * stretches, then set it beside the other child's count of the very same
 * stretches. Renaming to a shared unit IS what makes the comparison possible.
 */
const msRenameThenCompare = multiStep({
  situationType: 'comparison',
  usesPriorSkill: true,
  draw: (r) => {
    const d = r.pick([3, 4, 5, 6] as const);
    const k = r.int(2, 4);
    const whole = d * k;
    // The renamed count must be worth renaming: a fraction that comes out at two
    // stretches leaves exactly one possible answer, and the comparison stops
    // being one. Raising the floor of the numerator when the ruler is coarse
    // keeps the renamed count at three stretches or more.
    const n = coprimeIn(r, d, k === 2 ? 2 : 1, d - 1);
    const ahead = n * k;
    // The second child must be genuinely behind, and by at least one stretch, or
    // "how many more" has no answer worth asking for.
    const behind = r.int(1, Math.max(1, ahead - 1));
    const s = r.pick(JOURNEY_SCENES);
    const [first, second] = two(r);
    return {
      prompt: `${first} and ${second} set off along the same ${s.whole}, which carries ${countNoun(whole, 'equal stretches')}. ${first} ${s.move} ${fmtFrac(n, d, 'partition-anchored')} of the way along it, and ${second} ${s.move} ${countNoun(behind, 'stretches')}. How many more stretches has ${first} covered than ${second}?`,
      initN: whole,
      steps: [
        { op: 'mul', n, d },
        { op: 'sub', n: behind, d: 1 },
      ],
      units: 'stretches',
      hints: [
        'Are the two journeys described in the same units, or does one of them still need turning into stretches?',
        'Turn the fraction into a count of stretches first, then set the two counts side by side and find the gap.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/** Rename into the whole's own parts, then add a few more of them. */
const msRenameThenAdd = multiStep({
  situationType: 'combine',
  usesPriorSkill: true,
  draw: (r) => {
    const d = r.pick([3, 4, 5, 6] as const);
    const k = r.int(2, 3);
    const whole = d * k;
    // Hold the first coat back from the last part but one, so what is left after
    // it (`room`) is always at least three: the second coat can then be two or
    // more AND still stop short of the end. A story whose answer is "all of
    // them" can be got right by noticing the thing is full.
    const n = coprimeIn(r, d, 1, k === 2 ? d - 2 : d - 1);
    const painted = n * k;
    const room = whole - painted;
    let extra = r.int(2, Math.max(2, Math.min(5, room - 1)));
    // An extra equal to the first coat reads as a second helping of the same
    // fraction, which blurs the boundary the item is drawing. One deterministic
    // step, and only when there is room for it (kit §E2.4).
    if (extra === painted && room - 1 >= 3) extra = extra === 2 ? 3 : 2;
    const s = r.pick(MADE_SCENES);
    const name = one(r);
    return {
      prompt: `${name} makes a ${s.whole} from ${countNoun(whole, s.part)}, paints ${fmtFrac(n, d, 'partition-anchored')} of it gold, then paints ${extra} more ${unitFor(extra, s.piece)} gold. How many ${unitFor(2, s.piece)} are gold?`,
      initN: whole,
      steps: [
        { op: 'mul', n, d },
        { op: 'add', n: extra, d: 1 },
      ],
      units: s.piece,
      hints: [
        'Does the question ask about the first coat of paint, or about everything gold at the end?',
        'Turn the fraction into a count of parts, then bring in the few that were painted afterwards.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * Inverse-start (the Level-C ceiling lift, F3): the stated quantity is the
 * SHARE and the whole is the unknown, so the opening move is the one the
 * sentence order does not hand over. The picture shows the known share and
 * asserts its size — a given here, not the answer.
 */
const msWholeFromOneShare = withFigure(
  multiStep({
    situationType: 'part-whole',
    usesPriorSkill: true,
    posing: 'inverse-start',
    draw: (r) => {
      const d = r.pick([3, 4, 5, 6] as const);
      const walked = r.int(3, 6);
      const s = r.pick(JOURNEY_SCENES);
      const name = one(r);
      return {
        prompt: `${name} ${s.move} ${countNoun(walked, 'stretches')} of a ${s.whole} and reaches the ${fmtFrac(1, d, 'partition-anchored')} mark. How many stretches of the ${s.whole} are still ahead of ${name}?`,
        initN: walked,
        steps: [
          { op: 'mul', n: d, d: 1 },
          { op: 'sub', n: walked, d: 1 },
        ],
        units: 'stretches',
        hints: [
          'Is the number you are given one piece of the journey, or the whole journey?',
          'Copy that piece once for every piece the whole journey holds, then take off the part already behind.',
        ],
        errorTags: ['task-comprehension', 'representation-misread'],
      };
    },
  }),
  (p) =>
    barModel(
      [{ label: 'the stretches already behind', segments: [{ value: numOf(p, 'initN') }] }],
      {
        scaleMax: numOf(p, 'initN'),
        alt: `one bar standing for the ${countNoun(numOf(p, 'initN'), 'stretches')} already covered, with the rest of the journey not drawn`,
        asserts: assertsParam('initN', 'bar:0'),
      },
    ),
);

// ---------------------------------------------------------------------------
// Discrimination — the week's two claims, each forced as a CHOICE
//
// Neither carries a figure. Their options are text, and a drawing of the two
// cuts held to one scale answers the question outright — which is exactly why
// that drawing belongs in the lesson script and not here.
// ---------------------------------------------------------------------------

/**
 * THE trap, made a choice (FILL-ARCHITECTURE §5 row C16). Same top number, two
 * different numbers underneath, one whole of the same size in both hands. The
 * first distractor IS the bigger-bottom reading, computed from the item's own
 * drawn partitions; the second is the child who decides the cut makes no
 * difference at all.
 */
const discrimBiggerPiece = discrimination({
  variant: 'structural',
  cognitiveOp: 'frac-compare-choice',
  draw: (r) => {
    const few = r.pick([2, 3, 4, 5] as const);
    const many = r.pick([6, 8, 10, 12] as const);
    const thing = r.pick(CUT_SCENES);
    const [first, second] = two(r);
    return {
      // Gender-free by construction: the names are drawn from a mixed pool, so a
      // "cuts hers" written into the template is wrong for half of every class.
      prompt: `${first} and ${second} have a ${thing} each, and the two are exactly the same length. ${first} cuts one of them into ${countNoun(few, 'matching pieces')}, and ${second} cuts the other into ${countNoun(many, 'matching pieces')}. Each of them picks up ONE piece. Which fraction names the bigger piece?`,
      correct: fmtFrac(1, few, 'partition-anchored'),
      distractors: [
        {
          text: fmtFrac(1, many, 'partition-anchored'),
          errorTag: 'concept-misconception',
          rationale: 'Picks the fraction with the bigger number underneath. That number counts how many pieces one whole was broken into, and breaking one whole into more of them makes every piece smaller.',
        },
        {
          text: 'the two pieces are the same size',
          errorTag: 'representation-misread',
          rationale: 'Reads two different cuts of the same-sized whole as if the number of pieces made no difference to how big a piece is.',
        },
      ],
      hints: [
        'If one whole thing is cut into more pieces, what happens to the size of a single piece?',
        'Picture the same length broken into a handful of pieces and then into a great many, and look at one piece each time.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * Equivalence made a choice, and posed as TWO MAPS of one place rather than as a
 * re-marking — deliberately a different sentence from `sitRemarkTheTrail` rather
 * than the same one with new numbers. The given here is a COUNT of small
 * stretches, not a fraction, so the only fractions on the page are the options
 * and the child has to build the name rather than edit one.
 *
 * The two wrong options are the two ways of getting half the renaming right: the
 * child who finds the second map's count and then writes the FIRST map's total
 * below it, and the child who counts the stretches on the far side of the
 * landmark instead of the near side. Both are proper fractions by construction —
 * the obvious third option, the first map's count over the second map's total,
 * would print "4/2" on some draws, which is not a wrong answer so much as
 * gibberish, and no child is tempted by gibberish.
 */
const discrimSameSpot = discrimination({
  variant: 'structural',
  cognitiveOp: 'frac-equiv-choice',
  draw: (r) => {
    // Halves are excluded: with only two stretches on the second map the
    // "stretches still ahead" option would BE the answer (1/2 either way).
    const d1 = r.pick([3, 4, 5] as const);
    // Same ceiling as the other renaming items: twelfths at the outside.
    const k = r.int(2, Math.min(4, Math.max(2, Math.floor(12 / d1))));
    const d2 = d1 * k;
    const n1 = coprimeIn(r, d1, 1, d1 - 1);
    const m = n1 * k;
    const s = r.pick(JOURNEY_SCENES);
    const spot = r.pick(LANDMARKS);
    const name = one(r);
    return {
      prompt: `${name} is drawing a map of a ${s.whole}. On the first map the ${s.whole} is chopped into ${countNoun(d2, 'equal stretches')}, and the ${spot} sits ${countNoun(m, 'stretches')} along. ${name} draws a second map of the same ${s.whole} with only ${countNoun(d1, 'stretches')} on it. Which fraction belongs beside the ${spot} on the second map?`,
      correct: fmtFrac(n1, d1, 'partition-anchored'),
      distractors: [
        {
          text: fmtFrac(n1, d2, 'partition-anchored'),
          errorTag: 'procedure-slip',
          rationale: 'Counts the second map\'s stretches correctly and then writes the FIRST map\'s total below the line, so the fraction is built from two maps at once.',
        },
        {
          text: fmtFrac(d1 - n1, d1, 'partition-anchored'),
          errorTag: 'task-comprehension',
          rationale: 'Counts the stretches still ahead of the landmark instead of the ones already behind it, so the fraction names the part of the journey the landmark has NOT reached.',
        },
      ],
      hints: [
        'Does the landmark itself sit somewhere different on the second map, or only get a different name?',
        'Work out how many of the first map\'s stretches fit inside one stretch of the second, then count the second map\'s stretches up to the landmark.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives BOTH numbers)
//
// See the file header for why this is the rename-by-subtracting slip and not the
// bigger-bottom trap: `correct` is stretches ÷ partition (the honest count of
// small stretches in one part) and `wrong` is stretches − partition, the child
// who reaches for the two numbers and takes one from the other. The repair tool
// is the week's own anchor — a third of a journey stops short of the half-way
// mark, and nine of twelve stretches runs well past it.
// ---------------------------------------------------------------------------

const eaRenamedBySubtracting = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const d = r.pick([3, 4, 5, 6] as const);
    // correct = (d·k) ÷ d = k; wrong = (d·k) − d = d(k−1), so the slip is
    // (k−1)/k of the whole journey. THREE is the floor for k, not two: at k = 2
    // the slip lands EXACTLY on the half-way mark, and the repair this item asks
    // for — "use the half-way mark to show the number cannot be right" — would
    // be an argument the picture does not actually support. From k = 3 the slip
    // is two thirds of the way along or further, while the stated fraction is a
    // third of the way or less, so the benchmark separates them every time.
    const k = r.int(3, 4);
    return { a: d * k, b: d, op: '/', wrongOp: '-' };
  },
  build: (v, p, r) => {
    const stretches = Number(p.a);
    const d = Number(p.b);
    const s = r.pick(JOURNEY_SCENES);
    const name = one(r);
    return {
      prompt: `${name} marks a ${s.whole} into ${countNoun(stretches, 'equal stretches')}. A student was asked how many of those stretches make ${fmtFrac(1, d, 'partition-anchored')} of the whole ${s.whole}, and wrote ${v.wrong}.`,
      extension: `Draw the ${s.whole} with all of its equal stretches, ring the ones that really do make that fraction of it, write how many there are, and use the half-way mark to say in one sentence why the student's number cannot be right.`,
      hints: [
        'Is the fraction in this question a big part of the whole journey, or a small one?',
        'Break the stretches into as many matching groups as the number below the line asks for, take one group, and hold it against the half-way mark.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
      answerKeywords: ['half-way mark', 'matching groups', 'less than half'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC16 = makeWeekBuilder({
  level: 'C',
  week: 16,
  conceptId: 'equivalent-comparing-fractions',
  conceptName: 'Equivalent & comparing fractions',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [C9, C12, C15],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the number line and its half-way mark',
  conceptFamily: 'operation',
  deepeningDelta:
    'C15 gave a child the name for one equal part of one whole and stopped there: every fraction it wrote was read off the cut in front of it, and no two fractions were ever set against each other. C16 puts TWO rulers on one whole. Renaming enters in both directions — a journey re-marked finer, and equal parts gathered into groups — and comparing enters as a decision the child has to defend, either by giving both fractions the same size of piece or by leaning each on the half-way mark. The bigger-bottom trap, which cannot appear at all while there is only one cut on the page, is the misconception the week is built around. Fractions of a SET of separate objects stay closed until C17.',
  explanation: {
    hook:
      'Mark a trail into three long stretches; a friend marks the same trail into twelve short ones. Your bench has not budged, but it has two names now. And here is what catches almost everybody: twelve is a much bigger number than three, and yet a twelfth is a much smaller piece.',
    whyBeforeHow:
      'Every fraction has one place of its own along a journey, and rubbing out the marks and drawing finer ones cannot shift it, because cutting each stretch into smaller ones changes what the pieces are CALLED and never changes where the mark sits. That is why the number line and its half-way mark settle every question this week asks: put both fractions on it, and the one further from the start is the larger, whatever the numbers underneath happen to say. The number below the line counts how many pieces one whole was broken into, so a bigger number below the line means MORE pieces cut out of the same whole — and more pieces from one whole means every piece is smaller. Eighths are smaller than thirds, every single time.',
    script: [
      {
        say: 'Watch me give one mark two names. Here is a trail cut into four equal stretches, and my flag stands at the 1/4 mark. I am not going to move that flag at all — I am only going to change the marks drawn underneath it.',
        visual: 'A line for the whole trail in four equal stretches, with a flag one stretch along.',
        figure: numberLine(
          {
            min: 0, max: 1, step: 1, partition: 4, labels: 'all', labelAs: 'fraction',
            marks: [{ at: 1 / 4, label: 'flag', style: 'flag' }],
          },
          { alt: 'a line for the whole trail marked into four equal stretches, with a flag standing at the first mark' },
        ),
      },
      {
        say: 'Now I cut every stretch in half, so the same trail carries eight equal stretches. Look hard at the flag: it has not moved one step, and yet it now stands at the 2/8 mark. Same place, new name — and that is the whole of what makes two fractions equal.',
        visual: 'The identical trail in eight equal stretches, the flag standing exactly where it was.',
        figure: numberLine(
          {
            min: 0, max: 1, step: 1, partition: 8, labels: 'all', labelAs: 'fraction',
            marks: [{ at: 1 / 4, label: 'flag', style: 'flag' }],
          },
          { alt: 'the same line for the whole trail, now marked into eight equal stretches, with the flag standing in exactly the same place' },
        ),
      },
      {
        say: 'Here is the trap, drawn to one scale. These two strips are the same length. I cut the first into three matching pieces and the second into eight. Eight is the bigger number — and one eighth is plainly the shorter piece. More pieces out of one whole always means smaller pieces.',
        visual: 'One strip cut into three, above the same strip cut into eight, both to the same scale.',
        figure: barModel(
          [
            { label: 'cut into thirds', segments: [{ value: 8 }, { value: 8 }, { value: 8 }] },
            { label: 'cut into eighths', segments: Array.from({ length: 8 }, () => ({ value: 3 })) },
          ],
          { scaleMax: 24, alt: 'two strips of the same length, the first cut into three matching pieces and the second into eight matching pieces' },
        ),
      },
      {
        say: 'One habit before I decide anything: I check each mark against the half-way flag. Does it get past the middle of the journey, or stop short of it? If one fraction is past half way and the other is not, I already know which is larger and I have not worked out a single sum.',
        visual: 'A trail in eight equal stretches with the half-way flag standing at its middle mark.',
        figure: numberLine(
          {
            min: 0, max: 1, step: 1, partition: 8, labels: 'all', labelAs: 'fraction',
            marks: [{ at: 0.5, label: 'half way', style: 'flag' }],
          },
          { alt: 'a line for the whole trail marked into eight equal stretches, with a flag standing at the middle mark' },
        ),
      },
    ],
    summary:
      'Two fractions are equal when they name the same place: re-marking the ruler gives a mark a new name, never a new place. To compare, give both fractions the same size of piece, or lean each one on the half-way mark. A bigger number below the line means more pieces cut from one whole, so each piece is smaller.',
    vocabulary: [
      { term: 'equivalent fractions', kidGloss: 'two names for exactly the same place' },
      { term: 'rename', kidGloss: 'give a fraction a new name by cutting every piece the same way' },
      { term: 'half-way mark', kidGloss: 'the landmark exactly between the start and the end' },
      { term: 'compare', kidGloss: 'decide which of two amounts is the larger one' },
    ],
  },
  guidedExamples: [
    {
      ...ge(16, 1, 'modeled', 'A trail is marked into 4 equal stretches and a bench stands at the 3/4 mark. The keepers re-mark the same trail into 8 equal stretches. Which mark stands beside the bench now?', [
        {
          teacherSay:
            'First I notice what is actually changing here. The bench is bolted to the ground, so it cannot go anywhere; the only thing being rubbed out and drawn again is the marks underneath it, twice as close together as before.',
        },
        {
          teacherSay: 'Every old stretch has been cut into two, so each mark I had is now twice as many stretches along the count. What does that make the 3/4 mark?',
          expected: '6/8',
        },
      ], '6/8'),
      visual: 'The trail in four equal stretches, with the bench flagged three stretches along.',
      figure: numberLine(
        {
          min: 0, max: 1, step: 1, partition: 4, labels: 'all', labelAs: 'fraction',
          marks: [{ at: 0.75, label: 'the bench', style: 'flag' }],
        },
        { alt: 'a line for the whole trail marked into four equal stretches, with the bench flagged three stretches along', asserts: assertsAnswer },
      ),
    },
    {
      ...ge(16, 2, 'completion', 'Two strips of card are exactly the same length. One is cut into 3 matching pieces, the other into 8. Which is the bigger piece: 1/3 of a strip or 1/8 of a strip?', [
        { teacherSay: 'Which of the two strips had to give up more pieces?', expected: 'the one cut into 8' },
        { childDo: 'Say what happens to the size of one piece when the same whole is cut into more of them.', expected: 'every piece gets smaller' },
      ], '1/3'),
      visual: 'One strip cut into three, above the same strip cut into eight, both to the same scale.',
      figure: barModel(
        [
          { label: 'cut into 3', segments: [{ value: 8 }, { value: 8 }, { value: 8 }] },
          { label: 'cut into 8', segments: Array.from({ length: 8 }, () => ({ value: 3 })) },
        ],
        { scaleMax: 24, alt: 'two strips of the same length, the first cut into three matching pieces and the second into eight matching pieces' },
      ),
    },
    {
      ...ge(16, 3, 'prompted', 'Which mark is further along the trail: 5/8 of the way, or 1/2 of the way? Use the half-way flag, not a calculation.', [
        { childDo: 'Find the half-way flag on the eighths ruler first, then say which side of it the other mark falls on.', expected: '5/8' },
      ], '5/8'),
      visual: 'A trail in eight equal stretches with the half-way flag standing at its middle mark.',
      figure: numberLine(
        {
          min: 0, max: 1, step: 1, partition: 8, labels: 'all', labelAs: 'fraction',
          marks: [{ at: 0.5, label: 'half way', style: 'flag' }],
        },
        { alt: 'a line for the whole trail marked into eight equal stretches, with a flag standing at the middle mark' },
      ),
    },
    // Independent stage: no picture. Choosing a shared size of stretch is the
    // task, so a ruler on the page would make that choice for the child.
    ge(16, 4, 'independent', 'A trail carries 12 equal stretches. Ben stops at the 9/12 mark and Ria stops at the 2/3 mark. Who has gone further? Solve cold.', [
      { childDo: 'Give both marks the same size of stretch, then put them side by side.', expected: 'Ben' },
    ], 'Ben — 2/3 of the trail is the 8/12 mark, and 9/12 is one stretch past it'),
  ],
  days: [
    // Day 1 — concept echo: renaming a mark, the half-way mark, and the trap met
    // as a measured length. Single-step only, on top of three warm-ups.
    [
      { gen: wNameOnePart, diff: 2 },
      { gen: wCompareNumbers, diff: 2 },
      { gen: wShareEqually, diff: 2 },
      { gen: sitRemarkTheTrail, diff: 2 },
      { gen: sitHalfWayCone, diff: 2 },
      { gen: sitTwoMaps, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first metacognition and THE
    // discrimination enter, renaming turns downward, and the first chain arrives.
    [
      { gen: wFactRecall, diff: 2 },
      { gen: wShareEqually, diff: 2 },
      { gen: sitStretchesWalkedEstimate, diff: 3 },
      { gen: discrimBiggerPiece, diff: 3 },
      { gen: sitGatherIntoBunches, diff: 3 },
      { gen: msRenameThenAdd, diff: 4 },
    ],
    // Day 3 — interleave: both discriminations back to back against the
    // rename-then-compare two-step, so the page shape never says what is coming.
    [
      { gen: wCompareNumbers, diff: 2 },
      { gen: discrimBiggerPiece, diff: 4 },
      { gen: discrimSameSpot, diff: 3 },
      { gen: msRenameThenCompare, diff: 4 },
      { gen: sitRemarkTheTrail, diff: 3 },
      { gen: sitGatherIntoBunches, diff: 4 },
    ],
    // Day 4 — word problems: three genuine two-steps, including the inverse-start
    // one, beside the metacognition and the measured trap.
    [
      { gen: msRenameThenCompare, diff: 4 },
      { gen: msRenameThenAdd, diff: 4 },
      { gen: msWholeFromOneShare, diff: 5 },
      { gen: sitStretchesWalkedEstimate, diff: 3 },
      { gen: sitTwoMaps, diff: 4 },
    ],
    // Day 5 — non-computational: the error-analysis, the benchmark sort, and the
    // claim that generalises the trap (+ a ramped warm-up).
    [
      { gen: wFactRecall, diff: 2 },
      { gen: eaRenamedBySubtracting, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Four walkers stop on the same trail, and each one measures it their own way: one stops 1/4 of the way along, one 3/8 of the way, one 4/8 of the way and one 5/6 of the way. Put each walker under "not yet half way", "exactly half way" or "past half way", and write one short reason for each. You may use the half-way mark, and you may not work out any sums.',
          value: 'not yet half way: 1/4 and 3/8; exactly half way: 4/8; past half way: 5/6',
          acceptableForms: ['1/4', '3/8', '4/8', '5/6', 'half way', 'half-way mark'],
          keywords: true,
          hints: [
            'Which of these four walkers do you think turned back before the middle of the trail?',
            'For each one, halve the number below the line and see whether the number on top has got that far.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: a fraction with a bigger number below the line names a smaller amount. In one sentence, explain how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Stretches the matching-tops rule to every pair of fractions at once, so a mark five eighths along a trail would have to fall behind a mark one half along, when it is past it.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Turns the rule upside down, so one piece of a chain cut into many would have to beat one piece of the same chain cut into a few.',
            },
          ],
          hints: [
            'Does the number below the line tell you how BIG each piece is, or how MANY pieces the whole was broken into?',
            'Try a pair with matching tops first, then try one mark that stops short of half way against one that runs past it.',
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
    'For grown-ups: this week rests on one surprise — a bigger number below the line means a SMALLER piece. If your child says an eighth beats a third, do not correct the words; take one strip of paper, fold it into three, take an identical strip, fold it into eight, and lay one piece of each side by side. Two seconds of folding does what ten minutes of explaining cannot. The other habit worth praising is the half-way check: "is that past the middle, or not yet?" settles most comparisons without any arithmetic at all.',
  ],
  puzzle: (r) => {
    // Which marks of the fine ruler are ALSO marks of the coarse one — a search
    // with a completeness argument attached, which is a move no day item makes.
    const d1 = r.pick([3, 4] as const);
    const k = r.pick([2, 3] as const);
    const d2 = d1 * k;
    const pairs: string[] = [];
    for (let j = 1; j < d1; j++) pairs.push(`${j}/${d1} = ${j * k}/${d2}`);
    const names = pairs.flatMap((p) => p.split(' = '));
    const s = r.pick(JOURNEY_SCENES);
    return {
      id: 'C16-PZ-01',
      title: 'Puzzle Grove: The Marks That Meet',
      puzzleType: 'logic' as const,
      prompt: `[image: a line for the whole ${s.whole} marked into ${countNoun(d2, 'equal stretches')}, named in ${partitionWord(d2)}] This ${s.whole} is marked into ${countNoun(d2, 'equal stretches')}. Long ago it was marked into ${countNoun(d1, 'equal stretches')} instead, and every one of those old marks sits exactly on top of one of the marks you can see. Find every mark between the ${s.from} and the ${s.to} that carries BOTH an old name and a new name, write its two names, and say how you know you have not missed one.`,
      figure: numberLine(
        { min: 0, max: 1, step: 1, partition: d2, labels: 'all', labelAs: 'fraction' },
        { alt: `a line for the whole ${s.whole} marked into ${countNoun(d2, 'equal stretches')}, with every mark named in ${partitionWord(d2)} and nothing flagged on it` },
      ),
      answer: {
        value: pairs.join('; '),
        acceptableForms: [...pairs, ...names],
        validation: 'short-text-keyword' as const,
      },
      hintLadder: [
        'Could an old mark land part-way along one of the new stretches, or must it land on a mark?',
        'Walk from the start in equal jumps of the new stretches, and write both names down every time you land on an old mark.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'] as const,
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Multiplication and its facts — what a rename is read off',
    sourceWeek: C12,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sitRemarkTheTrail, diff: 3 },
    { gen: msRenameThenCompare, diff: 4 },
    { gen: sitTwoMaps, diff: 3 },
    { gen: msRenameThenAdd, diff: 4 },
    { gen: sitGatherIntoBunches, diff: 3 },
    { gen: msWholeFromOneShare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step — renaming a mark upward on a re-marked journey (number-line figure, old ruler asserted), the trap as a measured stretch length (whole-length bar asserted), and renaming downward by gathering parts into groups (painted-count grid asserted). 02/04/06: two-step — rename then compare against a stated count, rename then add more parts, and the inverse-start whole-from-one-share, whose bar is redrawn from its own fresh share. Every fraction is drawn in lowest terms on both forms. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'bigger-bottom-bigger',
      description: 'Judges a fraction larger because the number below the line is larger, missing that the number counts how many pieces one whole was broken into, so more of them means each is smaller.',
      exampleWrongAnswer: '1/8 chosen as the bigger piece against 1/3',
      distractorRationale: 'Offer the unit fraction with the larger number below the line as "the bigger piece".',
      reteachPointer: 'explanation/script[2] (one strip cut into three beside the same strip cut into eight, drawn to one scale)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'renamed-by-subtracting',
      description: 'Reaches for the two numbers and takes one from the other instead of working out how many small stretches fit inside one big one, so a rename lands far from where it should.',
      exampleWrongAnswer: '1/3 of a trail of 12 stretches given as 9 stretches',
      distractorRationale: 'Offer the fraction whose top number was left alone while the number below it changed.',
      reteachPointer: 'explanation/script[3] (hold the answer against the half-way flag before accepting it)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'one-number-renamed',
      description: 'Changes one half of the fraction and leaves the other, so the mark slides along the journey instead of holding still while its name changes.',
      exampleWrongAnswer: 'the 3/4 mark renamed into eighths as 3/8',
      distractorRationale: 'Offer the fraction that kept its top number while the number below it grew.',
      reteachPointer: 'guidedExamples/C16-GE-01 (every old stretch is cut into more, so the count grows by that same factor)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-the-rename',
      description: 'Renames correctly and answers with that number, forgetting the comparison, the addition or the "how many are left" the last sentence actually asks for.',
      exampleWrongAnswer: 'reports the stretches walked and never finds the gap between the two walkers',
      distractorRationale: 'Offer the first-step-only result on any two-step item.',
      reteachPointer: 'Day-4 word problems (rename first, then answer the question the last sentence asks)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Equivalent and comparing fractions — showing that re-marking a journey gives a spot a new name without moving it, renaming a fraction both finer and coarser, comparing two fractions by giving them the same size of piece or by leaning each on the half-way mark, and meeting the surprise that a bigger number below the line means a smaller piece.',
    improvingCandidates: [
      'renaming a mark when the ruler underneath it changes',
      'deciding which of two fractions is larger without guessing from the numbers below the line',
      'checking a fraction against the half-way mark before accepting an answer',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'the bigger-bottom surprise — more pieces cut from one whole means every piece is smaller, and folding two strips of paper settles it in seconds',
      },
      {
        errorTag: 'representation-misread',
        text: 'renaming by working out how many small stretches fit inside a big one, rather than by pulling the two numbers apart',
      },
      {
        errorTag: 'procedure-slip',
        text: 'changing BOTH halves of a fraction together when renaming, so the mark holds still',
      },
      {
        errorTag: 'task-comprehension',
        text: 'carrying a two-step story through to its last sentence instead of stopping at the rename',
      },
    ],
    homeFocus: {
      praiseLine:
        'You renamed both fractions into the same size of stretch before you compared them, and you checked each one against the half-way mark first — that is exactly the move this week is built on.',
      questionForChild: 'Would you rather have one slice of an orange split into 4, or one slice of the same orange split into 8 — and how do you know?',
      schoolSyncHook: 'If your child\'s class uses fraction strips or a fraction wall where we use a number line, tell us and we will match the model they see.',
    },
    vocabularyForParent: [
      'equivalent fractions (two names for the same place, like 1/4 and 2/8)',
      'rename (cut every piece the same way to give a fraction a new name)',
      'the half-way mark (the landmark that settles most comparisons without any arithmetic)',
    ],
  },
});
