/**
 * Level B · Week 23 — "Bar graphs & line plots" (conceptId: bar-graphs-line-plots).
 *
 * FILL-ARCHITECTURE §4 row B23: anchor "bars are stacked counts"; multi-step
 * "read two bars, combine"; error-analysis "reads the tallest bar for the asked
 * category"; discrimination "tallest vs asked-for"; Day-5 signature "build a
 * line plot from data (figure R)". Family G7 (`lib/stats.ts`).
 * Catalog focus: "Build and read graphs; one-step 'how many more' questions"
 * and "Ask-your-own-question: write a question a graph can answer".
 *
 * WHAT THIS WEEK IS FOR. A bar is not a picture of size. It is a stack of
 * counts, one square for one thing, so a bar can be READ rather than admired —
 * and the bar you must read is the one the question names, which is very often
 * not the one your eye goes to. Every page is built to make that second
 * sentence unavoidable:
 *   1. the bar is built from single squares, in the figure as well as in the
 *      lesson, so "how many?" is settled by counting and never by judging. That
 *      is what makes a graph honest to a six-year-old: nothing has to be
 *      estimated off an axis they cannot yet read;
 *   2. so the tallest bar is only the answer when the question asks for it. A
 *      child who reads the bar that stands out has exactly the misconception
 *      this week exists to catch, and it is on the page four times — in the
 *      lesson, in the discrimination, in the generated error-analysis, and in
 *      the Always/Sometimes/Never claim that finally gives it a hearing;
 *   3. and a line plot counts the same way with the axis turned inside out: the
 *      NUMBER on the line is what was counted, and the DOTS above it are how
 *      many times that count happened. Reading the label instead of the stack is
 *      the same slip wearing a different coat, which is why the plot gets its own
 *      discrimination rather than a mention.
 *
 * SCOPE — TWO NEIGHBOURS, BOTH OF WHICH THIS WEEK COULD HAVE COLLIDED WITH.
 *
 *  1. C23 ("Scaled graphs") owns THE KEY. Its whole claim is that one symbol
 *     stands for a group ("each star is worth 5"), its discrimination is symbol
 *     count vs value, and its own header describes B23 as "the same displays
 *     with every key silently equal to one, which is precisely the habit this
 *     week has to break". So B23 keeps that key at one and never names it:
 *     **no prompt, hint, choice, figure or answer in this pack contains a scale,
 *     a key, a symbol worth more than one thing, or a pictograph.** Every square
 *     is one thing and every dot is one thing. The `key: 1` param that rides in
 *     `generator.params` is there because the registered G7 templates take it —
 *     it is never spoken to the child, and multiplying by it is a no-op, which is
 *     also why nothing here needs a × sign.
 *  2. B15 ("Compare & change stories") owns THE QUESTION "how many more". Its
 *     discrimination is "'more' as add vs 'how many more' as subtract" and its
 *     anchor is the comparison bar. B23 must ask "how many more" — the catalog
 *     names it — so the split is by where the two numbers COME FROM: B15 hands
 *     both counts over in the sentence and asks which move the words want; B23
 *     hands over neither and asks the child to extract them from a display
 *     first. So this pack never re-litigates "more than" vs "how many more",
 *     never draws a comparison bar model, and never states the two counts it
 *     wants compared. B15 is instead the WARM-UP, which is where a settled skill
 *     belongs.
 *
 * NO ×, NO ÷ AND NO FRACTION NOTATION ANYWHERE CHILD-FACING. The B23 row grants
 * none of them, C6/C9 own the operation symbols and C15 owns `n/d`. Every
 * computation in this pack is an add or a take-away, which is what a bar graph
 * of counts naturally asks for, and every chain is spelled out as something the
 * child does to the display. (b19, b20, b21 and b22 each made the same
 * declaration; it is repeated rather than assumed.)
 *
 * VERIFY-LIBRARY LIMIT — THERE WASN'T ONE, AND THAT IS WORTH SAYING OUT LOUD
 * (kit §E2.3 / LEARNINGS L36: prove impossibility FIRST). Seven weeks in a row
 * reported that their recipe's misconception could not be produced by a
 * registered transform, so the reflex is now to reach for the workaround. This
 * week's misconception is already in the library and named after it:
 * `stat_verify_graph_read_v1` returns `{correct: counts[index], wrong: max(counts)}`
 * and THROWS when the named entry is the tallest, so it cannot be misused to
 * assert a claim that is really true. Nothing was reframed and nothing was
 * relocated. What that template made possible, and what is worth copying:
 *   - the Day-5 error-analysis shows the tallest count as the student's number
 *     and keys the named bar's count, both code-derived from one draw;
 *   - the SAME transform pins BOTH discriminations (kit §F.1 / QG-11). The
 *     bar-graph one offers all three bar heights, so its keyed option is
 *     recomputed from the display; the line-plot one offers the dot count, the
 *     label and the tallest stack, and the transform's own `wrong` IS the
 *     tallest-stack option. A wrong key is therefore structurally impossible on
 *     the two pages that carry the week's trap.
 *
 * CONCEPT FAMILY: 'operation', the full row (≥2 multi-step week-wide; two chains
 * here, each served twice in core and once in mastery). Declaring 'place-value'
 * would have been a dodge: the recipe hands this week its own two-step ("read
 * two bars, combine") and the display is what makes it two steps rather than
 * one. `msAllBarsTotal` reads three bars and folds them into one total, so no
 * single reading finishes it. `msTwoBarsThenCompare` folds two bars together and
 * then measures that against a third, so the second move works on the result of
 * the first — and it is the chain the catalog's "how many more" question becomes
 * once the numbers have to be found before they can be compared.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5 / L33). This is a week ABOUT a
 * picture, so the usual formula — "the figure asserts a given, never the answer"
 * — needs stating carefully rather than repeating:
 *
 *  1. THE DISPLAY IS THE GIVEN, AND IT IS THE ONLY GIVEN. On every bar-graph
 *     item the counts live in the figure (and in its accessible name), NOT in the
 *     visible prose. That is deliberate: a prompt that also lists "5 beetles, 8
 *     earwigs and 3 ants" turns a graph read into a list read, and the child
 *     never has to track across from a label to its own bar — which is the
 *     entire skill, and the exact step the week's misconception lives in. The
 *     numbers still sit inside the `[image: …]` bracket, so QG-1/QG-4 sign the
 *     operand surface as usual and QG-11 can find the value a claim shows; the
 *     bracket never reaches the child (`figures/prompt.ts` strips it).
 *  2. WHAT IS ASSERTED. `sitBarValue` asserts `answer` against the NAMED bar
 *     (`bar:k`) — the one place in the pack where a figure legitimately carries
 *     the answer, because on a graph read the answer is what the picture is FOR,
 *     and asserting it proves the drawn bar and the keyed count are the same
 *     number. Every other graph figure asserts `param:bar0`, the first bar of
 *     the display: a quantity the item was handed, never one it asks for. No
 *     figure marks the asked bar, prints a total, draws the gap between two bars
 *     or labels a bar with its own number — all four would perform the step
 *     being assessed.
 *  3. BARS OF SINGLE SQUARES, and this is pedagogy rather than decoration.
 *     `barModel` lays segments to a shared scale from their own values, so
 *     `Array(n)` segments of value 1 draw a bar of n countable cells with the
 *     dividing lines showing. A Level-B child has no numeric axis to read
 *     against, so a solid bar would have to be judged; a stack of squares can be
 *     counted, which is what "bars are stacked counts" MEANS. The shared
 *     `scaleMax` is what keeps the comparison honest across bars.
 *
 * WHAT IS DELIBERATELY NOT DRAWN, in a week about drawings:
 *  - THE LINE PLOT. It cannot be drawn honestly by any of the ten primitives, and
 *    this was measured rather than assumed. `counters` with `arrangement:'stack'`
 *    comes closest and fails on the one property a line plot must have: group
 *    boxes are centred vertically on a shared band (`by = top + (bandH − h)/2`),
 *    so a short stack FLOATS in the middle of the row instead of sitting on the
 *    line — a plot whose dots do not start from the axis is a picture of nothing.
 *    `areaGrid` shades in reading order, so it cannot fill columns to different
 *    heights either. Drawing the plot as a BAR chart was rejected as the worse
 *    lie: the week's second discrimination is precisely that a line plot's axis
 *    carries what was counted, which a bar chart's category axis does not. So
 *    every line-plot item states its plot in prose, exactly as `lib/stats.ts`
 *    and c23 report for the chart primitives they lack, and the Day-5 BUILD is
 *    the flagged part FILL-ARCHITECTURE §7 already lists for this cell
 *    (manual-review; a person looks at the child's plot).
 *  - THE PUZZLE'S GRAPH. Two bars, a total and a difference, and no picture: a
 *    drawn pair of unit bars would let the child count the answer off the page
 *    instead of deducing it, which is the whole puzzle. Stated in prose and left
 *    undrawn on purpose, not for want of a primitive.
 *  - THE COMPLETED READS. Tracking a finger across from a label, and the gap
 *    between two bars, live in the lesson script and the guided examples, where
 *    the answer is already on the page and watching the read IS the teaching.
 *    Both chains, both discriminations and the metacognition item carry the
 *    display and nothing else.
 *
 * ACCESSIBILITY, DISCLOSED. A faithful accessible name for a bar graph has to
 * pair each label with its count ("5 beetles, 8 earwigs and 3 ants"), the way a
 * data table would, so a screen-reader child meets the tallest-bar trap only as
 * arithmetic and not as a visual pull. That is the honest trade and it is the
 * right one: the alternative is an alt text that withholds the data, which
 * would leave that child no page at all (L40's rule — never trim alt text to
 * satisfy a law written for sentences).
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): every child-facing
 * sentence ≤15 words, counted rather than estimated; `bar graph`, `a bar`,
 * `line plot`, `a dot` and `in all` glossed in `explanation.vocabulary` before
 * any item leans on them; metacognition in its intro form — the B row's own
 * "will it pass ten?" call, and the SIDE is drawn before the numbers are, so the
 * probe is a coin flip by construction rather than by luck (L41: b16's probe was
 * right 70% of the time for a child who always said "more"); error-analysis
 * written-lite, one sentence; the sprint ungraded and self-referenced. No
 * gendered pronoun appears in any prompt, because every name is drawn.
 *
 * FRAMES, re-checked against the weeks directory at the END of the build (kit
 * §E2.8) with plain substring greps, not word boundaries:
 *   - c23 is the dangerous neighbour. Its display subjects are books/stars,
 *     laps/circles, tickets/squares and litres/drops, and it counts them over
 *     MONDAY to FRIDAY (as do b05, b13, b21 and `lib/stats.ts` itself). Not one
 *     of those appears here — which is why this week's graphs count what a class
 *     found on a walk rather than what happened on each day of the week, and why
 *     no weekday name is used anywhere in the pack;
 *   - 'tally' belongs to c01/c07/c10/c23 and is not used; 'pictograph', 'key',
 *     'symbol' and 'scale' are C23's and are not used;
 *   - b15 owns the comparison bar and the words "more than"; b06 owns the word
 *     "bar" in its balance-beam sense (its bar is a beam that tips). A graph bar
 *     is a different object and the two weeks never meet, but the collision is
 *     recorded rather than hoped over;
 *   - what is kept returns ZERO hits across all sixty-three authored weeks:
 *     robins, sparrows, wrens, starlings, poppies, dandelions, thistles,
 *     earwigs, centipedes, a bird table, a meadow, a log pile, and pea pods.
 *     ('daisies' and 'beetles' each appear once elsewhere, in c-level prose that
 *     never counts them on a display; 'ants' and 'pods' likewise.) Plurals were
 *     checked against `format.ts` as well as against the corpus: 'magpies' was
 *     dropped because `unitFor` singularises it to "magpy", and 'woodlice' and
 *     'goldfish' because they inflect wrongly in the other direction.
 *
 * THE END-OF-BUILD PASS, and what each half of it caught. Recorded because the
 * next author's cheapest win is knowing which sweeps pay:
 *   - THE PROSE SWEEP found six sentences over the Level-B ceiling, five of them
 *     hint rungs and all of them a comma where a full stop belonged ("Say the
 *     jumps out loud one at a time, and keep track of how many you have made" =
 *     18 words). Splitting each into two sentences took the week to 0.00%.
 *   - THE CORPUS SCAN (token overlap of every string here against all 7,600-odd
 *     authored strings in the weeks directory, not by eye) earned its keep six
 *     times over, and every hit was a HOUSE FORMULA borrowed unconsciously while
 *     copying an exemplar's shape: the B13 warm-up's second rung had come out as
 *     b22's ("start at one baker's pile, then count the other pile on top of
 *     it"), the B15 warm-up's first rung was 0.56 against b15's OWN hint — the
 *     one week whose voice this must not borrow — and the error-analysis
 *     extension, the parent strengthening line and the school-sync hook were each
 *     a three-week-old template with the nouns swapped. All six rewritten. What
 *     is left above 0.45 is the Always/Sometimes/Never STEM (five weeks share it;
 *     it is a question format, not a voice) and one internal error message that
 *     is deliberately identical across b19/b21/b22/b23 so it can be grepped.
 *   - READING IT found the two things no gate did. A generated plot printed
 *     "Above the 6 there are 6 dots" — true, honest, and a sentence that makes a
 *     seven-year-old stop; the dot pool now excludes every number on the line, so
 *     no column can hold as many dots as the number it sits above. And three
 *     stage directions promised marks the attached figure does not draw (a finger
 *     tracking across a label, a thought bubble, the overhang "marked off").
 *     `LessonRoom` shows the figure OR the direction, never both, so nothing
 *     contradicted itself on screen — but a teacher reads both. Two directions
 *     were rewritten to describe the drawing, and the third was answered by
 *     DRAWING it: script segment 2 now hatches the five earwig squares that hang
 *     past the ant bar, which is the pack's only marked figure and lives where a
 *     scaffold belongs.
 *   - MEASURING THE PROBE, because no gate can (L41): over 600 exposures the
 *     two-bar total passes ten 300 times and falls short 300 times, and lands on
 *     exactly ten never. The mastery discrimination keys the smallest of its
 *     three options 151 times in 300 — a coin flip on the axis that would
 *     otherwise be a tell.
 *
 * Retrieval is backward-only and every warm-up is load-bearing: B13 (addition
 * within 100 — what "in all" does once two bars have been read), B15 (the
 * comparison difference, which is this week's ancestor and now its second step)
 * and B18 (counting on in twos, which is how a child counts a stack of squares
 * or a column of dots without losing their place).
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
// MUST be imported BEFORE '../lib/stats' — c23's author found the cycle the hard
// way (the registry spreads STATS_TEMPLATE_DEFS, so entering lib/stats first can
// re-enter it through the registry while its own defs array is still in its
// temporal dead zone). Both sides are lazy now; the ordering is kept as cheap
// insurance and as a signpost for the next G7 consumer.
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswerOf, assertsParam, barModel } from '../lib/figures';
import { distinctSet } from '../lib/stats';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B13 = { level: 'B' as const, week: 13 };
const B15 = { level: 'B' as const, week: 15 };
const B18 = { level: 'B' as const, week: 18 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so nobody ever checks their own counting. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/**
 * THE GRAPHS — what a nature club counted on a walk, one bar per KIND.
 *
 * A bar graph needs categories that are genuinely separate things, which is what
 * makes "which bar does the question name?" a real question. Kinds rather than
 * days: weekday labels are spoken for six times over in the corpus (b05, b13,
 * b21, c07, c23 and `lib/stats.ts`), and a kind also lets the prompt name the
 * category in the same breath as the thing counted ("how many earwigs?").
 *
 * `unit` is the collective the whole graph counts, for the total items and for
 * the accessible name. Every kind pluralises and singularises correctly through
 * `format.ts` — checked, not assumed (see the header on 'magpies').
 */
const GRAPH_SCENES = [
  { board: 'the bird-table graph', unit: 'birds', kinds: ['robins', 'sparrows', 'wrens', 'starlings'] },
  { board: 'the meadow graph', unit: 'flowers', kinds: ['poppies', 'daisies', 'dandelions', 'thistles'] },
  { board: 'the log-pile graph', unit: 'minibeasts', kinds: ['beetles', 'earwigs', 'ants', 'centipedes'] },
] as const;

/**
 * THE LINE PLOT — one apparatus, all week, on purpose.
 *
 * Pea pods are the frame every plot here uses: the NUMBER on the line is how
 * many peas were in a pod, and each DOT is one pod. Keeping it fixed is a
 * teaching decision rather than a shortcut. The display itself is the new thing
 * this week, and a child who has to relearn the scene on every page is spending
 * their attention on the scene. (b22 pinned its Day-5 apparatus the same way.)
 */
const POD = { holder: 'pods', inside: 'peas' } as const;

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);
const numsOf = (p: Params, k: string): number[] => (p[k] as number[]).map(Number);
const strsOf = (p: Params, k: string): string[] => (p[k] as string[]).map(String);

// ---------------------------------------------------------------------------
// Decorators — a picture, or a pinned truth, built from the item's OWN values.
//
// The shipped primitives carry no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so
// the QG-1/QG-4 surface signature the guard already registered is unchanged).
//
// `withFigure` rebuilds from the drafted item's `generator.params` — the very
// numbers its answer was computed from — which is what makes a contradicting
// picture unbuildable rather than merely unlikely. Two cases cannot be served
// that way and each gets its own one-slot box, posted by the draw closure and
// read immediately afterwards:
//   - `discrimination()` emits no generator spec at all, so `withPin` supplies
//     one (this is what puts the keyed count under QG-11);
//   - `multiStep()` owns its params completely ({initN, initD, steps}), so a
//     figure needs the display back out of a box — and then it can assert
//     `param:initN` against the very bar the chain starts from.
// `drawUniqueItem` returns the draft its LAST build call produced, so the box
// always holds that same draw. (Pattern from c06/b15/b19/b21/b22.)
// ---------------------------------------------------------------------------

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface Pin {
  params: Params;
  seed: number;
}

function pinSlot(): { last: Pin | null } {
  return { last: null };
}

/** Give a choice item the generator spec that lets QG-11 recompute its claim. */
function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = box.last;
    if (!pin) throw new Error('b23/withPin: the draw posted nothing to build from');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

/** What a display drew, for the figures whose item params cannot carry it. */
interface Shown {
  board: string;
  unit: string;
  labels: string[];
  counts: number[];
  /** Which display bar the chain's `initN` came from. */
  firstIdx: number;
}

function shownSlot(): { last: Shown | null } {
  return { last: null };
}

function withShownFigure(
  box: { last: Shown | null },
  base: ItemGen,
  build: (s: Shown) => BBFigure,
): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const s = box.last;
    if (!s) throw new Error('b23/withShownFigure: the draw posted no display to draw');
    return { ...d, figure: build(s) };
  };
}

// ---------------------------------------------------------------------------
// The display, drawn — bars of single squares, to one shared scale
// ---------------------------------------------------------------------------

/** "5 beetles, 8 earwigs and 3 ants" — the display in the order it is drawn. */
const entryList = (labels: readonly string[], counts: readonly number[]): string => {
  const parts = labels.map((l, i) => countNoun(counts[i], l));
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
};

/**
 * The accessible name of a bar graph, which for these items is also the ONLY
 * place the data is written down (see the header, figure law 1). It says how the
 * bars are built, then pairs every label with its count — the way a data table
 * would — because a name that withheld the counts would leave a screen-reader
 * child no page at all.
 */
const graphAlt = (board: string, unit: string, labels: readonly string[], counts: readonly number[]): string =>
  `${board}, with one square for every ${unitFor(1, unit)}: ${entryList(labels, counts)}`;

/**
 * One bar per kind, each bar a stack of single squares.
 *
 * `scaleMax` is the tallest bar, so one square is the same width in every bar on
 * the page — without that a bar model teaches nothing (see `BarModelFig`). No
 * segment carries a number: printing a bar's own count beside it would do the
 * reading the item is asking for.
 */
const barGraph = (
  labels: readonly string[],
  counts: readonly number[],
  opts: { alt: string; asserts?: BBFigure['asserts'] },
): BBFigure =>
  barModel(
    labels.map((label, i) => ({
      label,
      segments: Array.from({ length: counts[i] }, () => ({ value: 1 })),
    })),
    {
      scaleMax: Math.max(...counts),
      alt: opts.alt,
      ...(opts.asserts ? { asserts: opts.asserts } : {}),
    },
  );

/** The same graph, rebuilt from an item's own params. */
const graphFromParams = (p: Params, asserts?: BBFigure['asserts']): BBFigure => {
  const labels = strsOf(p, 'labels');
  const counts = numsOf(p, 'counts');
  return barGraph(labels, counts, {
    alt: graphAlt(strOf(p, 'board'), strOf(p, 'unit'), labels, counts),
    ...(asserts ? { asserts } : {}),
  });
};

/** Three kinds and three counts off one scene — the shape every graph item draws. */
interface Drawn {
  board: string;
  unit: string;
  labels: string[];
  counts: number[];
}

const drawGraph = (r: Rng, counts: number[]): Drawn => {
  const scene = r.pick(GRAPH_SCENES);
  return {
    board: scene.board,
    unit: scene.unit,
    labels: r.shuffle([...scene.kinds]).slice(0, counts.length),
    counts,
  };
};

/** The serializable half of a display, for `generator.params`. */
const graphParams = (d: Drawn): Params => ({
  counts: d.counts,
  labels: d.labels,
  key: 1,
  board: d.board,
  unit: d.unit,
  // The first bar of the display, so a figure can assert a quantity the item was
  // HANDED rather than one it asks for (kit §E2.5).
  bar0: d.counts[0],
});

// ---------------------------------------------------------------------------
// The line plot, stated — the display no primitive can draw (see the header)
// ---------------------------------------------------------------------------

interface Plot {
  /** The consecutive numbers along the line: how many peas a pod held. */
  values: number[];
  /** How many pods sit above each number. */
  dots: number[];
  /** Which position the question asks about. */
  askedPos: number;
}

/**
 * A three-column line plot, built so nothing has to be redrawn (kit §E2.4).
 *
 * The order of construction is the guarantee, and each step earns its place:
 *  1. the numbers along the line are CONSECUTIVE, because a line plot's axis is
 *     a number line and a gappy one would be a different display;
 *  2. the asked position is chosen BEFORE the dots, so the dot counts can then
 *     be drawn from a pool that excludes the asked number itself — which is what
 *     keeps "the label" and "the dots above it" two different options on the
 *     discrimination instead of one duplicated one;
 *  3. `avoidTallest` places the biggest stack away from the asked column, which
 *     is what `stat_verify_graph_read_v1` requires before it will call the
 *     tallest read a misconception at all.
 * Both branches of every choice consume the same draws, so the stream lands in
 * the same place whichever way it falls.
 */
function drawPlot(r: Rng, avoidTallest: boolean): Plot {
  const base = r.int(3, 6);
  const values = [base, base + 1, base + 2];
  const askedPos = r.int(0, 2);
  // No column may hold as many dots as the number it sits above. Excluding the
  // asked label is what keeps "the label" and "the dots above it" two different
  // options on the discrimination; excluding the other two as well is a reading
  // fix, found by reading a generated plot that said "above the 6 there are 6
  // dots" — true, honest, and a sentence that makes a seven-year-old stop.
  const pool = [2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) => !values.includes(v));
  const [hi, mid, lo] = r.shuffle(pool).slice(0, 3).sort((a, b) => b - a);
  const dots: number[] = [0, 0, 0];
  const others = [0, 1, 2].filter((p) => p !== askedPos);
  // Where the tallest stack goes, and what the asked column holds.
  const hiPos = avoidTallest ? r.pick(others) : r.int(0, 2);
  const askedIsMid = r.chance(0.5);
  if (hiPos === askedPos) {
    dots[askedPos] = hi;
    dots[others[0]] = askedIsMid ? mid : lo;
    dots[others[1]] = askedIsMid ? lo : mid;
  } else {
    dots[hiPos] = hi;
    dots[askedPos] = askedIsMid ? mid : lo;
    dots[others.find((p) => p !== hiPos)!] = askedIsMid ? lo : mid;
  }
  return { values, dots, askedPos };
}

/** The plot as a child reads it — one short sentence per column. */
const plotProse = (plot: Plot): string =>
  [
    `A line plot counts the ${POD.inside} in each pod.`,
    `One dot stands for one pod.`,
    ...plot.values.map((v, i) => `Above the ${v} there are ${countNoun(plot.dots[i], 'dots')}.`),
  ].join(' ');

/** The plot's params, in the shape `stat_verify_graph_read_v1` reads. */
const plotParams = (plot: Plot): Params => ({
  counts: plot.dots,
  key: 1,
  index: plot.askedPos,
  values: plot.values,
});

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B13 — addition within 100, which is what "in all" turns into once two bars
 * have been read. Framed as two walks rather than as a graph: a warm-up should
 * be recognisably the earlier week's own page, so the child arrives at the
 * display with the arithmetic already settled.
 */
const wTwoWalks = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-within-100',
    draw: (r) => {
      const morning = r.int(23, 48);
      const later = r.int(16, 39);
      const [first, second] = two(r);
      const scene = r.pick(GRAPH_SCENES);
      return {
        prompt: `${first} counted ${countNoun(morning, scene.unit)} on the morning walk. ${second} counted ${countNoun(later, scene.unit)} on the afternoon walk. How many is that in all?`,
        answerValue: String(morning + later),
        templateId: 'retr_add_within_100_v1',
        params: { a: morning, b: later },
        units: scene.unit,
        hints: [
          'Do both walks belong in this answer, or only one of them?',
          'Hold the bigger count in your head, and count the smaller one on from there.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B13,
);

/**
 * B15 — the comparison difference, and it opens the week beside B13 on purpose.
 * B15 handed both counts over in the sentence; from Day 1 this week hands over
 * neither, so the last page on which "how many more" is a settled skill is this
 * warm-up. It is also the second move of `msTwoBarsThenCompare`.
 */
const wHowManyMore = asWarmup(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare-difference',
    draw: (r) => {
      const many = r.int(41, 78);
      const fewer = r.int(14, 38);
      const scene = r.pick(GRAPH_SCENES);
      const [big, small] = r.shuffle([...scene.kinds]).slice(0, 2);
      return {
        prompt: `A nature club found ${countNoun(many, big)} and ${countNoun(fewer, small)}. How many more ${big} than ${small} did the club find?`,
        answerValue: String(many - fewer),
        templateId: 'retr_word_sub_v1',
        params: { a: many, b: fewer },
        units: big,
        hints: [
          'Does this question want a whole count, or only the gap between two counts?',
          'Line the smaller count up against the bigger one, and read what is left over.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  B15,
);

/**
 * B18 — counting on in twos, which is how a child gets down a stack of squares
 * or a column of dots without losing their place. The bridge to this week is
 * mechanical and real: every bar here is built from single squares, and by Day 5
 * some of them are ten squares tall.
 */
const wCountOnInTwos = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'skip-count-twos',
    draw: (r) => {
      const start = r.int(4, 18);
      const jumps = r.int(4, 9);
      const name = one(r);
      return {
        prompt: `${name} counts a long row of squares in twos. The counting starts at ${start} and makes ${countNoun(jumps, 'jumps')} of two. Where does it stop?`,
        answerValue: String(start + 2 * jumps),
        templateId: 'retr_skip_count_v1',
        params: { start, k: jumps },
        hints: [
          'How much bigger does the number get on each single jump?',
          'Say each jump out loud, and keep count of the jumps you have made.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B18,
);

// ---------------------------------------------------------------------------
// Single-step core — one bar, the gap between two bars, and one column of dots
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR: find the bar the question names, and count its squares.
 *
 * The asked kind rotates over ALL THREE bars, tallest included. That matters:
 * pinning the question to the short bar would teach "the answer is the little
 * one", which is the same false rule as "the answer is the tallest" facing the
 * other way. The tallest-bar trap belongs on the pages built to spring it — the
 * discrimination and the error-analysis, where the transform guarantees the
 * named bar is NOT the tallest and the misread therefore produces a genuinely
 * different number.
 *
 * The figure asserts the ANSWER against the named bar. It is the one item where
 * that is right (header, figure law 2): on a graph read the picture is where the
 * answer lives, so the audit worth having is the one that proves the drawn bar
 * and the keyed count are the same number.
 */
const sitBarValue = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'graph-read-one',
    draw: (r) => {
      const d = drawGraph(r, distinctSet(r, 3, 2, 12));
      const index = r.int(0, 2);
      const kind = d.labels[index];
      return {
        prompt: `[image: ${graphAlt(d.board, d.unit, d.labels, d.counts)}] How many ${kind} does ${d.board} show?`,
        answerValue: String(d.counts[index]),
        templateId: 'stat_graph_value_v1',
        params: { ...graphParams(d), index },
        units: kind,
        hints: [
          'Which label is the question pointing at?',
          'Put a finger on that label, then count the squares in its own bar.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  }),
  (p) => graphFromParams(p, assertsAnswerOf(`bar:${numOf(p, 'index')}`)),
);

/**
 * THE GAP between two named bars — the catalog's "one-step how many more"
 * question, with the two numbers no longer handed over.
 *
 * The bigger bar is named first so the answer is never negative, which is the
 * band's own limit rather than a convenience. What the child has to do is read
 * two bars before either number exists, and that is the whole difference from
 * B15's version of this question.
 */
const sitBarGap = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'graph-read-gap',
    draw: (r) => {
      const d = drawGraph(r, distinctSet(r, 3, 2, 12));
      const pair = r.shuffle([0, 1, 2]).slice(0, 2);
      const [i, j] = pair.sort((a, b) => d.counts[b] - d.counts[a]);
      return {
        prompt: `[image: ${graphAlt(d.board, d.unit, d.labels, d.counts)}] How many more ${d.labels[i]} than ${d.labels[j]} does the graph show?`,
        answerValue: String(d.counts[i] - d.counts[j]),
        templateId: 'stat_graph_diff_v1',
        params: { ...graphParams(d), i, j },
        units: d.labels[i],
        hints: [
          'Are two bars being asked about here, or only one?',
          'Read both named bars in full, then hold one against the other.',
        ],
        errorTags: ['task-comprehension', 'representation-misread'],
      };
    },
  }),
  (p) => graphFromParams(p, assertsParam('bar0', 'bar:0')),
);

/**
 * ONE COLUMN OF A LINE PLOT — the same reading job with the axis inside out.
 *
 * The number on the line is how many peas were in a pod; the dots above it are
 * how many pods held that many. So "how many pods held 5 peas?" is answered by
 * the stack and never by the label, and a child who has only met bar graphs has
 * to notice that the display has changed what its numbers mean.
 *
 * Stated in prose, not drawn: no primitive can put a column of dots on a line
 * (see the header). The asked column rotates freely here, tallest included, for
 * the same reason `sitBarValue` does.
 */
const sitPlotColumn = situation({
  situationType: 'part-whole',
  cognitiveOp: 'plot-read-column',
  draw: (r) => {
    const plot = drawPlot(r, false);
    const asked = plot.values[plot.askedPos];
    return {
      prompt: `${plotProse(plot)} How many pods held ${countNoun(asked, POD.inside)}?`,
      answerValue: String(plot.dots[plot.askedPos]),
      templateId: 'stat_graph_value_v1',
      params: plotParams(plot),
      units: POD.holder,
      hints: [
        'On this plot, what is a single dot standing for?',
        'Find the number the question names, then count only the dots sitting above it.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form, a call made before any working
//
// The B row's own "will it pass ten?" prediction, pointed at this week's own
// two-bar total. The SIDE is drawn first and the two bars are then drawn on that
// side, so the answer is a coin flip BY CONSTRUCTION — which is the fix L41
// records after b16 shipped a probe a child could be right about 70% of the time
// by always saying "more". No gate can catch that: a probe has no answer key.
//
// The probe is deliberately SHORT. `metacog.ts` picks its own lead-in, and a
// probe over seven words puts the combined sentence past the Level-B ceiling
// however carefully the rest of the pack is written (kit §E2.9). This one is
// seven.
//
// The base is served ONLY through the wrapper (kit §E2.2): a generator used both
// raw and wrapped ships two identical hint ladders, which spends two of the
// three the dedup allows on one idea.
//
// The graph carries a THIRD bar the question never uses. A display is exactly
// where "use all the numbers" is learnt by accident, and a graph with a spare
// bar is the honest shape of the world rather than a trick.
// ---------------------------------------------------------------------------

const sitTwoBarsTotal = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'graph-read-two',
    draw: (r) => {
      // The SIDE first, then the numbers on it. A total of exactly ten would
      // make the probe unanswerable — the child would be right whatever they
      // said (kit §E2.7) — so neither branch can produce one.
      const overTen = r.int(0, 1) === 0;
      const a = overTen ? r.int(5, 9) : r.int(2, 4);
      const b = overTen ? r.int(6, 9) : r.int(2, 5);
      const spare = r.int(2, 12);
      const d = drawGraph(r, [a, b, spare]);
      return {
        prompt: `[image: ${graphAlt(d.board, d.unit, d.labels, d.counts)}] How many ${d.labels[0]} and ${d.labels[1]} does the graph show altogether?`,
        answerValue: String(a + b),
        templateId: 'stat_graph_total_v1',
        params: { ...graphParams(d), indices: [0, 1] },
        units: d.unit,
        hints: [
          'Which parts of this display does the question actually use?',
          'Read each of the two named bars on its own, then join the two counts.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => graphFromParams(p, assertsParam('bar0', 'bar:0')),
);

const predictTwoBarsTotal = withEstimateFirst(
  sitTwoBarsTotal,
  'will the two bars together pass ten?',
);

// ---------------------------------------------------------------------------
// Discriminations — the §4 row, twice, once per display
//
// THE NAMED BAR (the recipe's own, and the whole week on one page): three
// numbers are offered and they are the three BAR HEIGHTS, so nothing can be
// settled by arithmetic. The child has to track from a label across to its own
// bar. One distractor is the tallest bar, which is where an untrained eye goes;
// the other is the third bar, which is where a finger that slips a row lands.
// The keyed count is recomputed by `stat_verify_graph_read_v1` from the display's
// own counts, and that transform REFUSES a draw whose named bar is the tallest —
// so the trap cannot quietly become the truth.
//
// THE COLUMN, NOT THE LABEL (Day 3): the same slip on a line plot, where the
// number on the line is the loudest thing on the page and is never the answer.
// Its three options are the dots above the named number, the number itself, and
// the tallest stack — and that last one is the pinned transform's own `wrong`.
//
// Neither carries a picture of the answer: the bar-graph one carries the display
// and nothing else, and the plot cannot be drawn at all.
// ---------------------------------------------------------------------------

const namedBarBox = pinSlot();

const discNamedBar = withFigure(
  withPin(
    namedBarBox,
    'stat_verify_graph_read_v1',
    discrimination({
      variant: 'structural',
      cognitiveOp: 'choose-the-bar',
      draw: (r) => {
        const d = drawGraph(r, distinctSet(r, 3, 3, 14));
        const byHeight = [0, 1, 2].sort((a, b) => d.counts[b] - d.counts[a]);
        const [tallest, middle, shortest] = byHeight;
        // WHICH bar is named rotates between the two that are not the tallest.
        // Pinning it to the shortest would make the keyed number the smallest
        // option every time, and a child who has met the page twice could pass
        // it on that alone (kit §E2.11 — the relational invariant). Both
        // branches consume one `r.int` and one `r.uint`, so the stream lands in
        // the same place either way.
        const index = r.chance(0.5) ? middle : shortest;
        const other = index === middle ? shortest : middle;
        namedBarBox.last = {
          params: { ...graphParams(d), index },
          seed: r.uint(),
        };
        return {
          prompt: `[image: ${graphAlt(d.board, d.unit, d.labels, d.counts)}] Which number tells how many ${d.labels[index]} the graph shows?`,
          correct: String(d.counts[index]),
          distractors: [
            {
              text: String(d.counts[tallest]),
              errorTag: 'representation-misread' as const,
              rationale: 'Reads the bar that stands out on the page instead of the bar the question named.',
            },
            {
              text: String(d.counts[other]),
              errorTag: 'task-comprehension' as const,
              rationale: 'Loses hold of which label was asked for, so a neighbouring bar is read across by mistake.',
            },
          ],
          hints: [
            'Which label does the question point at?',
            'Track across from that label to its own bar, and only then count squares.',
          ],
          errorTags: ['representation-misread', 'task-comprehension'],
        };
      },
    }),
  ),
  (p) => graphFromParams(p, assertsParam('bar0', 'bar:0')),
);

const plotColumnBox = pinSlot();

const discPlotColumn = withPin(
  plotColumnBox,
  'stat_verify_graph_read_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'choose-the-column',
    draw: (r) => {
      const plot = drawPlot(r, true);
      const asked = plot.values[plot.askedPos];
      const tallest = Math.max(...plot.dots);
      plotColumnBox.last = { params: plotParams(plot), seed: r.uint() };
      return {
        prompt: `${plotProse(plot)} Which number tells how many pods held ${countNoun(asked, POD.inside)}?`,
        correct: String(plot.dots[plot.askedPos]),
        distractors: [
          {
            text: String(asked),
            errorTag: 'concept-misconception' as const,
            rationale: 'Reads the number written on the line, which says how many peas a pod held and not how many pods there were.',
          },
          {
            text: String(tallest),
            errorTag: 'representation-misread' as const,
            rationale: 'Takes the biggest stack of dots on the plot, whichever number that stack happens to sit above.',
          },
        ],
        hints: [
          'What is one dot on this plot standing for?',
          'Hold the named number still, and count upwards from it one dot at a time.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// Multi-step — read two bars, combine (FILL-ARCHITECTURE §4)
//
// Two chains, two genuine moves each, and `stepCount` is read off the chain
// rather than claimed. What differs is what the second move is FOR:
//   - ALL THREE BARS is the recipe's own shape carried to the whole display: no
//     single reading finishes it, and the last bar has to be folded into a
//     number that only exists after the first two are read;
//   - TWO BARS, THEN THE GAP puts the total to work. The combined bar is only
//     the start, and the question is how it stands against a third — which is
//     the catalog's "how many more" once the numbers must be found first.
// A child who has met only one of them has learnt a sequence rather than a plan.
//
// Both carry the display, and their figures assert `param:initN` against the bar
// the chain starts from — the strongest claim available when a factory owns the
// params (see the decorator note).
// ---------------------------------------------------------------------------

const allBarsBox = shownSlot();

const msAllBarsTotal = withShownFigure(
  allBarsBox,
  multiStep({
    situationType: 'combine',
    cognitiveOp: 'graph-total-all',
    draw: (r) => {
      const d = drawGraph(r, distinctSet(r, 3, 2, 11));
      allBarsBox.last = { ...d, firstIdx: 0 };
      return {
        prompt: `[image: ${graphAlt(d.board, d.unit, d.labels, d.counts)}] How many ${d.unit} does the whole graph show in all?`,
        initN: d.counts[0],
        steps: [
          { op: 'add', n: d.counts[1], d: 1 },
          { op: 'add', n: d.counts[2], d: 1 },
        ],
        units: d.unit,
        hints: [
          'How many bars does this question need, and how many are on the page?',
          'Read one bar and hold that count. Then bring in the next bar, then the last.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (s) =>
    barGraph(s.labels, s.counts, {
      alt: graphAlt(s.board, s.unit, s.labels, s.counts),
      asserts: assertsParam('initN', `bar:${s.firstIdx}`),
    }),
);

const gapBox = shownSlot();

const msTwoBarsThenGap = withShownFigure(
  gapBox,
  multiStep({
    situationType: 'comparison',
    cognitiveOp: 'graph-total-then-gap',
    usesPriorSkill: true,
    draw: (r) => {
      // The third bar is drawn from the pair's own total, so the two together
      // always reach past it and the last sentence never has to be answered
      // with nothing. No nudge and no redraw: the range itself is the guarantee.
      const a = r.int(3, 9);
      const b = r.int(3, 9);
      const c = r.int(2, a + b - 2);
      const d = drawGraph(r, [a, b, c]);
      gapBox.last = { ...d, firstIdx: 0 };
      return {
        prompt: `[image: ${graphAlt(d.board, d.unit, d.labels, d.counts)}] Put the ${unitFor(1, d.labels[0])} bar and the ${unitFor(1, d.labels[1])} bar together. How many more is that than the ${unitFor(1, d.labels[2])} bar?`,
        initN: a,
        steps: [
          { op: 'add', n: b, d: 1 },
          { op: 'sub', n: c, d: 1 },
        ],
        units: d.unit,
        hints: [
          'Which two bars are being joined, and which one are they measured against?',
          'Build the joined count first, then hold the last bar up against it.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (s) =>
    barGraph(s.labels, s.counts, {
      alt: graphAlt(s.board, s.unit, s.labels, s.counts),
      asserts: assertsParam('initN', `bar:${s.firstIdx}`),
    }),
);

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's error exactly, and the library already had it:
// `stat_verify_graph_read_v1` returns the named bar's count as `correct` and the
// tallest bar's count as `wrong`, and throws when the two would be the same bar.
// So the number the child is shown is the real output of the real misconception
// over this display, and the truth is recomputed from the same counts.
//
// The prompt shows the graph and the claim and stops. Naming what went wrong
// would BE the answer, so the extension asks about the two bars and leaves the
// child to say the rest.
//
// The figure is the display the claim was made about — a real drawn trap, not a
// described one, because the eye's pull towards the tallest bar is the whole
// mechanism and prose cannot reproduce it. It asserts the first bar, never the
// count the item asks for.
// ---------------------------------------------------------------------------

const eaTallestBar = errorAnalysis({
  verifyTemplateId: 'stat_verify_graph_read_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const counts = distinctSet(r, 3, 3, 14);
    const byHeight = [0, 1, 2].sort((a, b) => counts[b] - counts[a]);
    const index = r.chance(0.5) ? byHeight[1] : byHeight[2];
    const d = drawGraph(r, counts);
    return { ...graphParams(d), index };
  },
  build: (v, p, r) => {
    const labels = strsOf(p, 'labels');
    const kind = labels[numOf(p, 'index')];
    const name = one(r);
    return {
      prompt: `[image: ${graphAlt(strOf(p, 'board'), strOf(p, 'unit'), labels, numsOf(p, 'counts'))}] ${name} was asked how many ${kind} the graph shows. ${name} wrote ${countNoun(Number(v.wrong), kind)}.`,
      extension: `Write the count the ${unitFor(1, kind)} bar really shows. Then tell ${name} in one sentence how to check a bar.`,
      hints: [
        'Which label was the question about?',
        'Find that label first, and count the squares in the bar that belongs to it.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
      answerKeywords: [
        'track across from the label to its own bar',
        'that count belongs to a different bar',
        'the tallest bar was not the one named',
      ],
    };
  },
});

const eaTallestBarDrawn = withFigure(eaTallestBar, (p) =>
  graphFromParams(p, assertsParam('bar0', 'bar:0')),
);

// ---------------------------------------------------------------------------
// Day-5 production — the §4 signature: build a line plot, then ask a question
// of it (the catalog's "ask-your-own-question" move, on the child's own plot).
//
// Authored rather than drawn: the plot is the child's own, so there is no
// operand to generate, and the answer is the plot plus the question. The BUILD
// is the flagged part FILL-ARCHITECTURE §7 already lists for this cell, so it
// ships as `manual-review` — a person looks at the paper. The read/choose core
// of the week stays code-computed everywhere else.
//
// Six pods and only four distinct counts, deliberately: a plot whose every dot
// sits alone teaches nothing about stacking, and one number has to be reached
// three times before "the tallest stack" means anything on the page the child
// has drawn.
// ---------------------------------------------------------------------------

const reasoningBuildPlot = reasoning({
  prompt:
    'Six pods held these peas: 4, 6, 5, 4, 7, 4. Draw a line plot for them. Write the numbers along a line first. Then put one dot above a number for every pod. Now write one question your plot can answer.',
  value:
    'a plot whose numbers run along the line in order, with one dot per pod and three dots above the 4, plus a question the dots can answer',
  hints: [
    'What will one dot on your plot be standing for?',
    'Write the numbers along the line in order. Then take the pods one at a time.',
  ],
  errorTags: ['representation-misread', 'task-comprehension'],
});

/**
 * The claim the week's misconception really makes, given a hearing.
 *
 * "Sometimes" is the honest answer and both distractors are real children's
 * positions. A question that asks which kind there were MOST of is answered by
 * the tallest bar, and so is a question that happens to name it. Any other
 * question is not. 'always' is the child whose eye decides before the label is
 * read; 'never' is the overcorrection that throws away the one question the
 * tallest bar does settle.
 */
const asnTallestBar = classify({
  prompt:
    'Always, sometimes or never true? The tallest bar answers the question. Write one sentence saying how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'representation-misread',
      rationale: 'Lets the bar that stands out answer every question, so the label the question names is never read at all.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Rules the tallest bar out even when the question asks which kind there were most of, which is the one it does answer.',
    },
  ],
  hints: [
    'Is there a question the tallest bar is exactly the right answer to?',
    'Try two questions on one graph. Ask about the most, then ask about a named label.',
  ],
  errorTags: ['representation-misread', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB23 = makeWeekBuilder({
  level: 'B',
  week: 23,
  conceptId: 'bar-graphs-line-plots',
  conceptName: 'Bar graphs & line plots',
  strandTags: ['probability-statistics'],
  prerequisiteWeeks: [B13, B15, B18],
  pedagogyContract: 'v2',
  conceptualAnchor: 'bars are stacked counts',
  conceptFamily: 'operation',
  deepeningDelta:
    'B15 drew two collections as two bars and asked which question a story was asking, and B20 counted rows of the same size — but in both of those the counts arrived in the sentence, already named. B23 takes them away. The display now holds the numbers, so before any adding or comparing can start the child has to find the right bar and count it, and that is where everything new arrives. A bar is a stack of counts, one square for one thing, so it is read and never judged. The bar that answers the question is the one the question names, which is very often not the tallest, and no arithmetic can rescue a child who read the wrong row. A line plot then turns the same display inside out: the number on the line is what was counted, and the dots above it are how many times. C23 takes this exact reading job and puts a key under it, so that one symbol stands for five things and the counting has to change again.',
  explanation: {
    hook:
      'A bar is not a picture of how big something is. It is a stack of counts, one square for one thing. So a bar can be read.',
    whyBeforeHow:
      'A graph is a way of writing down counts so they can be compared at a glance, and that is exactly why bars are stacked counts: one square stands for one thing, so the height of a bar is not an opinion. It can be counted. Because every bar on the page is built from the same squares, two bars can be held against each other and the gap between them means something exact. Then comes the part that catches everybody. Your eye goes to the tallest bar, every time, because that is what eyes do. But the bar that answers a question is the bar the question NAMES, and the tallest bar is only that bar sometimes. So the order of work is fixed here: find the label first, track across to its own bar, and only then count. A line plot is the same idea with the numbers moved. The number on the line is what was counted, and each dot above it is one more time that count happened.',
    script: [
      {
        say: 'Watch me build a bar. I found 6 beetles, so I stack 6 squares. One square for one beetle, every time.',
        visual: 'One bar of six single squares, labelled for beetles.',
        figure: barGraph(['beetles'], [6], {
          alt: 'one bar built from six single squares, labelled for beetles',
        }),
      },
      {
        say: 'Now three bars on one graph. My eye jumps to the tall one. But I want the ants. So I find the ant label and track across from it.',
        visual: 'A three-bar log-pile graph, built from single squares, with nothing marked.',
        figure: barGraph(['beetles', 'earwigs', 'ants'], [6, 9, 4], {
          alt: 'a log-pile graph built from single squares: 6 beetles, 9 earwigs and 4 ants',
        }),
      },
      {
        say: 'Here is how many more. The earwig bar goes past the ant bar. I count only the squares that stick out past the end of the shorter bar.',
        visual: 'The earwig bar above the ant bar, to one scale, with the squares past the ant bar hatched.',
        // The only figure in this pack that MARKS anything. A hatched run is the
        // gap itself, which would answer a "how many more" item outright — so it
        // lives here, in the lesson, where the answer is already spoken and
        // watching the overhang IS the teaching (kit §F.7).
        figure: barModel(
          [
            {
              label: 'earwigs',
              segments: [
                ...Array.from({ length: 4 }, () => ({ value: 1 })),
                ...Array.from({ length: 5 }, () => ({ value: 1, fill: 'hatch' as const })),
              ],
            },
            { label: 'ants', segments: Array.from({ length: 4 }, () => ({ value: 1 })) },
          ],
          {
            scaleMax: 9,
            alt: 'the earwig bar of nine squares above the ant bar of four, with the last five earwig squares hatched',
          },
        ),
      },
      {
        say: 'A line plot moves the numbers. I counted the peas in each pod. Above the 5 I put one dot for every pod that held 5 peas. The dots are pods, not peas.',
        visual: 'A line plot: the numbers 4, 5 and 6 along a line, with a column of dots sitting on the line above each one.',
      },
      {
        say: 'One habit before I read any bar. About how many squares does it look like? I make a call, then I count to check. The counting is what settles it.',
        visual: 'One bar of seven single squares — guess the count first, then count the squares.',
        figure: barGraph(['sparrows'], [7], {
          alt: 'one bar built from seven single squares, labelled for sparrows',
        }),
      },
    ],
    summary:
      'One square stands for one thing, so a bar is counted and never judged. Find the label the question names, then read its own bar. The tallest bar is only the answer sometimes. On a line plot the numbers are what was counted, and the dots are how many times.',
    vocabulary: [
      { term: 'bar graph', kidGloss: 'counts written as bars, so they can be compared at a glance' },
      { term: 'a bar', kidGloss: 'a stack of squares, one square for one thing' },
      { term: 'line plot', kidGloss: 'a line of numbers with a dot above one of them for every thing counted' },
      { term: 'a dot', kidGloss: 'one thing counted, sitting above the number it belongs to' },
      { term: 'in all', kidGloss: 'every bar joined together, not one of them on its own' },
    ],
  },
  guidedExamples: [
    {
      ...ge(23, 1, 'modeled', 'A bird-table graph shows 4 robins, 7 sparrows and 3 wrens. How many robins does it show?', [
        {
          teacherSay:
            'Watch me. My eye wants the tall bar, so I do not count anything yet. First I find the label the question named.',
        },
        {
          teacherSay: 'Here is the robin label, and here is its own bar. How many squares?',
          expected: '4',
        },
      ], '4'),
      // The finished read may be shown here: the answer is already on the page,
      // and watching the finger track across IS the teaching.
      visual: 'The bird-table graph, with the robin bar first and four squares long.',
      figure: barGraph(['robins', 'sparrows', 'wrens'], [4, 7, 3], {
        alt: 'a bird-table graph built from single squares: 4 robins, 7 sparrows and 3 wrens',
        asserts: assertsAnswerOf('bar:0'),
      }),
    },
    {
      ...ge(23, 2, 'completion', 'A meadow graph shows 8 poppies, 5 daisies and 2 thistles. How many more poppies than thistles does it show?', [
        { teacherSay: 'Which two bars does this question need?', expected: 'the poppy bar and the thistle bar' },
        { childDo: 'Hold the thistle bar against the poppy bar, then count the squares that stick out.', expected: '6' },
      ], '6'),
      // COMPLETION fade: the child produces the gap, so the picture shows the
      // two bars to one scale and marks nothing.
      visual: 'The poppy bar and the thistle bar drawn one above the other, to the same scale.',
      figure: barGraph(['poppies', 'thistles'], [8, 2], {
        alt: 'the poppy bar of eight squares drawn above the thistle bar of two squares, to one scale',
      }),
    },
    {
      ...ge(23, 3, 'prompted', 'A log-pile graph shows 3 beetles, 9 earwigs and 6 centipedes. How many beetles and centipedes does it show altogether?', [
        { childDo: 'Read the two named bars one at a time, then join the counts.', expected: '9' },
      ], '9'),
      // Only the display is drawn. Drawing the two bars joined end to end would
      // do the joining the item is asking for.
      visual: 'The log-pile graph with all three bars, and nothing marked.',
      figure: barGraph(['beetles', 'earwigs', 'centipedes'], [3, 9, 6], {
        alt: 'a log-pile graph built from single squares: 3 beetles, 9 earwigs and 6 centipedes',
      }),
    },
    {
      // Independent, and no picture at all — this one is a line plot, which no
      // primitive can draw honestly (see the file header).
      ...ge(23, 4, 'independent', 'A line plot counts the peas in each pod. Above the 4 there are 3 dots. Above the 5 there are 8 dots. Above the 6 there are 2 dots. How many pods held 4 peas? Solve cold.', [
        { childDo: 'Decide what one dot stands for, then count only the dots above the named number.', expected: '3' },
      ], '3'),
      visual: 'No picture — read the plot from the words.',
    },
  ],
  days: [
    // Day 1 — concept echo: one bar read, the gap between two bars, and the
    // same job on a line plot. Single-step only, no trap and no chain.
    [
      { gen: wTwoWalks, diff: 2 },
      { gen: wHowManyMore, diff: 2 },
      { gen: sitBarValue, diff: 2 },
      { gen: sitBarGap, diff: 3 },
      { gen: sitPlotColumn, diff: 3 },
    ],
    // Day 2 — fluency + application: the size call made before working, the
    // named-bar trap, the whole-graph chain, and the anchor beside them.
    [
      { gen: wCountOnInTwos, diff: 2 },
      { gen: predictTwoBarsTotal, diff: 3 },
      { gen: discNamedBar, diff: 3 },
      { gen: msAllBarsTotal, diff: 4 },
      { gen: sitBarValue, diff: 3 },
    ],
    // Day 3 — interleave: the line-plot trap and the second chain against the
    // two single-step reads, so the shape of a page never signals the task.
    [
      { gen: wHowManyMore, diff: 2 },
      { gen: discPlotColumn, diff: 4 },
      { gen: msTwoBarsThenGap, diff: 4 },
      { gen: sitBarGap, diff: 3 },
      { gen: sitPlotColumn, diff: 3 },
    ],
    // Day 4 — word problems: both chains beside the size call and the named-bar
    // trap, so "it must need two steps" never becomes the cue.
    [
      { gen: wTwoWalks, diff: 3 },
      { gen: msAllBarsTotal, diff: 4 },
      { gen: msTwoBarsThenGap, diff: 4 },
      { gen: predictTwoBarsTotal, diff: 4 },
      { gen: discNamedBar, diff: 3 },
    ],
    // Day 5 — the signature: the tallest-bar read taken apart, a plot built from
    // real data and questioned, and the claim that settles what a tall bar means.
    [
      { gen: wCountOnInTwos, diff: 2 },
      { gen: eaTallestBarDrawn, diff: 4 },
      { gen: reasoningBuildPlot, diff: 3 },
      { gen: asnTallestBar, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the useful question this week is never "how many?" but "which bar are you reading?". Children read graphs with their eyes before they read them with their fingers, so the tall bar answers everything until somebody makes them slow down. Try it at home with any chart you can find — a weather chart, a sticker chart, the height marks on a door frame — and ask two questions about the same picture in a row: first "which one is the most?", then something about a label in the middle. The first question is the one the tall bar answers, and the second is the one that catches everybody. Then let your child build a bar themselves, one square per thing counted, and you will see why we never ask them to judge a height: a stack of squares can be counted, and a solid block can only be guessed at.',
  ],
  puzzle: (r) => {
    // A DEDUCTION, and the graph is deliberately not drawn: two bars, their
    // total and the gap between them, and the child has to find a pair of
    // heights that fits both facts at once. Drawing the bars would let them
    // count the answer off the page, which is the whole puzzle (see the header).
    //
    // Every core page is handed a display and asked to read it; this one is
    // handed two facts and asked to build the display. Deterministic
    // construction: the shorter bar and the gap are drawn, and the total is
    // computed from them, so the puzzle always has exactly one whole-number
    // answer and both bars are always at least two squares tall.
    const shorter = r.int(2, 9);
    const gap = r.int(2, 5);
    const total = 2 * shorter + gap;
    const scene = r.pick(GRAPH_SCENES);
    const [big, small] = r.shuffle([...scene.kinds]).slice(0, 2);
    const name = one(r);
    return {
      id: 'B23-PZ-01',
      title: 'Puzzle Grove: The Graph With No Numbers',
      puzzleType: 'logic',
      prompt: `${name} has a graph with two bars, and the squares are too faint to count. Together the two bars show ${countNoun(total, scene.unit)}. The ${unitFor(1, big)} bar has ${countNoun(gap, 'squares')} more than the ${unitFor(1, small)} bar. How many ${small} does the graph show?`,
      answer: {
        value: String(shorter),
        acceptableForms: [countNoun(shorter, small)],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Would the two bars be the same height, or is one of them taller?',
        'Try a height for the shorter bar. Then build the taller one and check the total.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // Core pages are handed a display and read it. The puzzle is handed no
  // display at all: two facts about a graph, and a pair of bar heights that has
  // to be searched for and then checked against both. A deduction, not a read,
  // and nothing on Day 1 has that shape.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'deduce-the-bars' },
  sprint: {
    skill: 'Subtraction within 100 — the move behind every "how many more" question',
    sourceWeek: { level: 'B', week: 14 },
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 24, max: 72 },
  },
  mastery: [
    { gen: sitBarValue, diff: 3 },
    { gen: msAllBarsTotal, diff: 4 },
    { gen: sitBarGap, diff: 3 },
    { gen: msTwoBarsThenGap, diff: 4 },
    { gen: sitPlotColumn, diff: 3 },
    { gen: discNamedBar, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: the two bar-graph reads the week teaches — one named bar counted on a fresh display, and the gap between two named bars — each carrying its own drawn graph (01 asserts the named bar against the key, 03 asserts the display it was handed). 05: the line-plot column, which carries no picture on either form because no primitive can draw a plot honestly. 02/04: the two chains, one folding all three bars into a total and one folding two bars and then measuring them against a third, both drawn from the display their chain starts in. 06: the named-bar trap, redrawn from a fresh graph so a form cannot be passed by remembering which bar was asked for last time; which of the two shorter bars is named rotates per draw, and its pinned truth is recomputed from the fresh counts. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'reads-the-tallest-bar',
      description: 'Answers a question about a named label with the tallest bar on the display, because that is where the eye lands before any label is read.',
      exampleWrongAnswer: 'a question about the ant bar answered with the height of the earwig bar',
      distractorRationale: 'Offer the tallest bar on the display, and the biggest stack of dots on a line plot.',
      reteachPointer: 'explanation/script[1] (I put my finger on the ant label and track across)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'reads-a-neighbouring-row',
      description: 'Loses hold of which label the question named while tracking across the display, so a bar next to the right one is read instead.',
      exampleWrongAnswer: 'a question about the third bar answered with the height of the second',
      distractorRationale: 'Offer the height of the display\'s third bar, and "never" on the claim that a tall bar can answer a question.',
      reteachPointer: 'guidedExamples/B23-GE-01 (here is the robin label, and here is its own bar)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'reads-the-label-not-the-dots',
      description: 'On a line plot, answers with the number written on the line rather than counting the dots above it, so what was counted is confused with how many times.',
      exampleWrongAnswer: 'a question about the pods that held 5 peas answered as 5 pods',
      distractorRationale: 'Offer the number written on the line, which the question has just said out loud.',
      reteachPointer: 'explanation/script[3] (the dots are pods, not peas)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-a-square-while-counting',
      description: 'Finds the right bar and then miscounts its squares by one, which is what losing your place in a tall stack costs.',
      exampleWrongAnswer: 'a bar of 9 squares read as 8',
      distractorRationale: 'Offer a count one square either side of the truth, which is what a hurried read of a tall bar produces.',
      reteachPointer: 'explanation/summary (a bar is counted and never judged), then the 2-minute subtraction sprint',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'differences-not-yet-quick',
      description: 'Reads both bars correctly and then rebuilds the difference from nothing every time it is needed, which leaves no attention over for the reading the difference was meant to serve.',
      exampleWrongAnswer: 'a gap of 6 squares between two correctly read bars given as 7',
      distractorRationale: 'Offer a gap one square away from the truth, which is what counting the difference on fingers costs.',
      reteachPointer: 'guidedExamples/B23-GE-02 (count the squares that stick out), plus the ungraded sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Bar graphs and line plots — building a bar as a stack of squares, one square for one thing, finding the bar a question names instead of the bar that stands out, reading how many more one bar shows than another, joining two or three bars into a total, and reading a line plot where the numbers say what was counted and the dots say how many times.',
    improvingCandidates: [
      'finding the bar the question names before counting anything',
      'reading how many more one bar shows than another',
      'reading a line plot, where the dots are what get counted',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'letting the label choose the bar, rather than letting the tallest bar choose the answer',
      },
      {
        errorTag: 'task-comprehension',
        text: 'holding on to which label was asked for while tracking across a display',
      },
      {
        errorTag: 'concept-misconception',
        text: 'on a line plot, counting the dots above a number instead of reading the number itself',
      },
      {
        errorTag: 'procedure-slip',
        text: 'reading a tall bar right to the top without losing your place — the sprint keeps that sharp',
      },
    ],
    homeFocus: {
      praiseLine:
        'You found the label the question named and counted its own bar, instead of taking the bar that stood out — that is the whole of this week.',
      questionForChild: 'On this graph, which bar should I read if I want to know about that one label?',
      schoolSyncHook: 'Many classes call a line plot a "dot plot". It is the same display, and we will use whichever word your child hears.',
    },
    vocabularyForParent: [
      'a bar (a stack of squares, one square for one thing — so it is counted, never judged)',
      'how many more (the squares one bar has past the end of another)',
      'line plot (numbers along a line, with one dot above a number for every thing counted)',
    ],
  },
});
