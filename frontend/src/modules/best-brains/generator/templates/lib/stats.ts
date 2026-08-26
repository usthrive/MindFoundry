/**
 * G7 — centre/spread, graph reads, probability (E21-E23, B23, C23)
 *
 * Contract every family in this directory follows:
 *  - generators return an `ItemGen` (see lib/items.ts) and stamp `authorMeta`;
 *  - every computational item names a `templateId` registered in the array
 *    below, so QG-5 re-derives its answer from the same params the generator
 *    used and a wrong answer key is structurally impossible;
 *  - embedded-claim items (discrimination / error-analysis) register a
 *    `verifyFor` instead, which QG-11 calls the same way;
 *  - prose is interpolated ONLY through lib/format.ts, never a bare `${…}`;
 *  - figures come from lib/figures.ts and are built from the item's OWN drawn
 *    values, so QG-13 can prove the picture agrees with the answer.
 *
 * `registry.ts` spreads `STATS_TEMPLATE_DEFS`, so nothing else needs editing when
 * a template is added here.
 *
 * ---------------------------------------------------------------------------
 * THE DRAWN-ARRAY LAW (FILL-ARCHITECTURE §2, G7). A statistics item's data set
 * is not "some numbers" — its SHAPE is the content, and leaving that shape to
 * chance is how a week that means to teach a clean fair-share mean ends up
 * asking for 7.3333…, or how a median item lands on a data set whose unsorted
 * middle happens to BE the median, quietly disarming the very trap the item
 * exists to spring. So every set here is CONSTRUCTED to the shape the item
 * needs and the construction proves it, rather than sampling and hoping:
 *
 *   `balancedSet`   pairs each +d with a −d about the target mean, so the sum
 *                   is exactly mean·n by algebra — the mean is whole BY
 *                   CONSTRUCTION, never by a rejection loop that might not
 *                   terminate on some seed;
 *   `distinctSet`   draws without replacement, so an odd-length median is
 *                   unambiguous (no tie can occur at the middle);
 *   `modeSet`       gives exactly one value a strictly dominant count;
 *   `unsortedMiddle`
 *                   guarantees the as-written middle DIFFERS from the median,
 *                   so "median without sorting" is a live error at every seed.
 *
 * A fractional mean is available (`balancedSet` with a half-step target) but is
 * a deliberate blueprint choice, exactly as the spec requires — the week asks
 * for it; it is never an accident of the draw.
 *
 * DISTRACTOR LAW: every wrong option is a named misconception's real output —
 *   MEDIAN WITHOUT SORTING    `stat_verify_median_v1`
 *   READS THE TALLEST BAR     `stat_verify_graph_read_v1` (B23)
 *   3 SYMBOLS READ AS 3       `stat_verify_graph_scale_v1` (C23 — the key says
 *                             each symbol is worth 5, so the row is worth 15)
 *   PAST TRIALS CHANGE THE NEXT
 *                             `stat_verify_next_trial_v1` (E23)
 *
 * ⚠ FIGURE GAP (reported upward, not worked around): the ten figure primitives
 * include no bar chart, pictograph, tally chart or histogram. Every graph-read
 * generator here therefore computes its reads off explicit `counts` / `key` /
 * `index` params carried in the item's OWN `generator.params`, and STATES the
 * display in prose. When a chart primitive lands, those params are already the
 * figure's params — the display is the only missing half. No primitive was
 * invented and no existing primitive was bent into pretending to be a chart.
 *
 * WEEK AUTHORS: distractor `errorTag`s used here are `concept-misconception`,
 * `representation-misread`, `task-comprehension` and `procedure-slip`; bank
 * every tag your chosen items emit.
 */

import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';
import {
  formatFrac,
  fracToDec,
  num,
  reduceFrac,
  type AnswerDef,
  type VerifyDef,
} from './compute';
import { discrimination } from './discrimination';
import { errorAnalysis } from './erroranalysis';
import { barModel, numberLine } from './figures';
import { countNoun, unitFor } from './format';
import { multiStep, type ItemGen } from './multistep';
import { numberWords } from '../shared';
import { situation } from './situations';

// ---------------------------------------------------------------------------
// Exact summary statistics — one implementation, used by BOTH the generator and
// the registry's answerFor, so the two can never drift apart
// ---------------------------------------------------------------------------

/** Read a `values` param, failing loudly (audit-catchable) when malformed. */
function statValues(p: Record<string, unknown>): number[] {
  const v = p.values;
  if (!Array.isArray(v) || v.length === 0 || v.some((x) => typeof x !== 'number' || !Number.isFinite(x))) {
    throw new Error("template param 'values' must be a non-empty array of numbers");
  }
  return v as number[];
}

function intList(p: Record<string, unknown>, key: string): number[] {
  const v = p[key];
  if (!Array.isArray(v) || v.length === 0 || v.some((x) => typeof x !== 'number' || !Number.isFinite(x))) {
    throw new Error(`template param '${key}' must be a non-empty array of numbers`);
  }
  return v as number[];
}

export function sumOf(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

/** The mean, exact: an integer when the set divides, else a terminating decimal. */
export function meanOf(values: readonly number[]): string {
  return fracToDec(sumOf(values), values.length);
}

/** The median, exact — the two middles of an even set average to a clean half. */
export function medianOf(values: readonly number[]): string {
  const s = [...values].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 === 1 ? String(s[(n - 1) / 2]) : fracToDec(s[n / 2 - 1] + s[n / 2], 2);
}

/**
 * The mode. Ties break to the SMALLEST value so the function is total over its
 * param space (an audit must never throw on data a generator could produce);
 * `modeSet` makes the mode strictly dominant, so the tiebreak never fires on
 * generated content.
 */
export function modeOf(values: readonly number[]): string {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = Math.min(...values);
  let bestCount = 0;
  for (const [v, c] of [...counts.entries()].sort((a, b) => a[0] - b[0])) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return String(best);
}

export function rangeOf(values: readonly number[]): string {
  return String(Math.max(...values) - Math.min(...values));
}

// ---------------------------------------------------------------------------
// Guarded data-set construction (see THE DRAWN-ARRAY LAW above)
// ---------------------------------------------------------------------------

/**
 * `n` distinct values whose mean is EXACTLY `mean`. Deltas are drawn as ± pairs
 * from distinct magnitudes, so the sum is `mean·n` by algebra and every value is
 * distinct — no rejection loop, no seed where the guarantee fails.
 * Requires `spread ≥ ⌊n/2⌋` (distinct magnitudes available) and `mean > spread`
 * (every value stays positive).
 */
export function balancedSet(r: Rng, n: number, mean: number, spread: number): number[] {
  const pairs = Math.floor(n / 2);
  if (spread < pairs) throw new Error(`balancedSet: spread ${spread} cannot supply ${pairs} distinct deltas`);
  if (mean <= spread) throw new Error(`balancedSet: mean ${mean} must exceed the spread ${spread} to stay positive`);
  const magnitudes = r.shuffle(Array.from({ length: spread }, (_, i) => i + 1)).slice(0, pairs);
  const deltas: number[] = [];
  for (const d of magnitudes) deltas.push(d, -d);
  if (n % 2 === 1) deltas.push(0);
  return r.shuffle(deltas).map((d) => mean + d);
}

/**
 * `balancedSet` at odd n ALWAYS CONTAINS ITS OWN MEAN (the zero delta), and two
 * consumers want opposite things from that fact. E21's `compareTheTwoCentres`
 * NEEDS the symmetry — "they come out the same" is genuinely true on a
 * balanced pool, which is what makes that card keyable at all — so
 * `balancedSet` keeps it. `meanOfSet` was WOUNDED by it: "which of these five
 * is the mean" was answerable by inspection on 100.0% of 4,200 draws (two
 * lattices, 2026-08-25), on the item that teaches the mean as a fair share
 * that need not be a member of its data.
 *
 * This sibling produces the mean-free shape for odd n: the largest chosen
 * magnitude's pair is skewed by a drawn offset e — {+(dmax+e), −dmax, −e} or
 * its mirror — so the sum still lands exactly on `mean`·n, no element equals
 * the mean, and the gap between mean and median VARIES in size and sign (a
 * constant gap would be a new 100% rule — "sort, take the middle, add one" —
 * on the level that teaches medians; the first draft had exactly that and a
 * design challenge caught it). Even n simply delegates: pairs of ±d with
 * d ≥ 1 never contain the mean.
 *
 * Odd n draws magnitudes from 2..spread so the ±e element cannot collide,
 * which needs spread − 1 ≥ pairs, and the mirrored branch needs
 * mean > spread·2 at worst; both are asserted, not assumed.
 */
export function balancedSetMeanFree(r: Rng, n: number, mean: number, spread: number): number[] {
  if (n % 2 === 0) return balancedSet(r, n, mean, spread);
  const pairs = Math.floor(n / 2);
  if (spread - 1 < pairs) throw new Error(`balancedSetMeanFree: spread ${spread} cannot supply ${pairs} magnitudes from 2..${spread}`);
  const magnitudes = r.shuffle(Array.from({ length: spread - 1 }, (_, i) => i + 2)).slice(0, pairs);
  const dmax = Math.max(...magnitudes);
  const ePool = Array.from({ length: spread }, (_, i) => i + 1).filter((v) => !magnitudes.includes(v));
  const e = ePool[r.int(0, ePool.length - 1)];
  const mirror = r.int(0, 1) === 1;
  if (mean <= dmax + e) throw new Error(`balancedSetMeanFree: mean ${mean} must exceed ${dmax + e} to stay positive`);
  const deltas: number[] = [];
  for (const d of magnitudes) {
    if (d === dmax) continue;
    deltas.push(d, -d);
  }
  deltas.push(...(mirror ? [-(dmax + e), dmax, e] : [dmax + e, -dmax, -e]));
  return r.shuffle(deltas).map((d) => mean + d);
}

/** `n` DISTINCT values from [lo, hi] — an odd-length median is then unambiguous. */
export function distinctSet(r: Rng, n: number, lo: number, hi: number): number[] {
  const span = hi - lo + 1;
  if (span < n) throw new Error(`distinctSet: [${lo}, ${hi}] cannot supply ${n} distinct values`);
  return r.shuffle(Array.from({ length: span }, (_, i) => lo + i)).slice(0, n);
}

/** `n` values with exactly one strictly-dominant mode. */
export function modeSet(r: Rng, n: number, lo: number, hi: number): number[] {
  const base = distinctSet(r, n - 1, lo, hi);
  const repeated = base[r.int(0, base.length - 1)];
  return r.shuffle([...base, repeated]);
}

/**
 * The same values, reordered so the middle of the list AS WRITTEN is not the
 * median. Values are distinct, so exactly one position holds the median: if it
 * is the middle one, swap it to the front and the trap is live again.
 */
export function unsortedMiddle(values: readonly number[]): number[] {
  const n = values.length;
  const mid = (n - 1) / 2;
  if (!Number.isInteger(mid) || mid < 1) return [...values];
  const median = Number(medianOf(values));
  if (values[mid] !== median) return [...values];
  const out = [...values];
  [out[mid], out[0]] = [out[0], out[mid]];
  return out;
}

// ---------------------------------------------------------------------------
// Draw pools
// ---------------------------------------------------------------------------

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

/** What a graph can count, bound to the symbol its key uses. */
const GRAPH_SUBJECTS = [
  { thing: 'books', symbol: 'stars' },
  { thing: 'laps', symbol: 'circles' },
  { thing: 'tickets', symbol: 'squares' },
  { thing: 'litres', symbol: 'drops' },
] as const;

const SCORE_SETTINGS = [
  { what: 'spelling scores', over: 'tests' },
  { what: 'quiz scores', over: 'rounds' },
  { what: 'daily reading minutes', over: 'days' },
] as const;

/** Coloured contents of a bag / spinner, drawn as a bound pair. */
const CHANCE_ITEMS = [
  { holder: 'A bag', unit: 'counters', target: 'red', other: 'blue' },
  { holder: 'A jar', unit: 'marbles', target: 'green', other: 'yellow' },
  { holder: 'A tin', unit: 'buttons', target: 'silver', other: 'wooden' },
] as const;

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** A comma-separated data list as a child reads it. */
function listOf(values: readonly number[]): string {
  return values.join(', ');
}

/**
 * Attach a figure computed from the drafted item's OWN `generator.params` — no
 * new rng draw (modeled on `asWarmup`), so the item's surface signature and the
 * pack's per-seed byte-stability are untouched.
 */
function withFigure(base: ItemGen, build: (params: Record<string, unknown>) => BBFigure | null): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const fig = d.generator ? build(d.generator.params) : null;
    return fig ? { ...d, figure: fig } : d;
  };
}

// ===========================================================================
// E21 — centre and spread
// ===========================================================================

/**
 * Mean as fair-share redistribution. `clean` is the blueprint's decision, not
 * the draw's luck: `true` guarantees a whole-number mean, `false` deliberately
 * lands on a half so the week can teach that a mean need not be a member of its
 * own data set.
 */
export function meanOfSet(opts: { n?: number; clean?: boolean; memberMean?: boolean } = {}): ItemGen {
  const n = opts.n ?? 5;
  const clean = opts.clean ?? true;
  // `memberMean: true` opts back INTO the balanced construction whose mean sits
  // in its own data — e21's Day-1 item chose that shape deliberately ("a
  // balanced set really does have mean = median; the coincidence is honest, and
  // it certifies nothing", e21 header decision 1) and a lib default must not
  // overrule a week's recorded decision. The DEFAULT is mean-free, because
  // "which of these is the mean" being answerable by inspection on 100% of
  // draws is a defect everywhere the choice was NOT deliberate.
  const memberMean = opts.memberMean ?? false;
  // A deliberately fractional mean must still TERMINATE as a decimal, or the
  // exact-arithmetic contract has nowhere to land. Checked at factory time, so
  // a bad blueprint fails on every seed rather than on one unlucky learner's.
  if (!clean && ![2, 4, 5, 8, 10, 20].includes(n)) {
    throw new Error(`meanOfSet: a fractional mean needs n with only 2s and 5s in it, got ${n}`);
  }
  return withFigure(
    situation({
      situationType: 'sharing',
      cognitiveOp: 'mean',
      draw: (r) => {
        const setting = r.pick(SCORE_SETTINGS);
        const name = r.pick(NAMES);
        const centre = r.int(10, 24);
        // Mean-free unless the week opted into the balanced coincidence (see
        // memberMean above): by default the mean this item asks for must not be
        // sitting in its own data.
        const build = memberMean ? balancedSet : balancedSetMeanFree;
        const balanced = build(r, n, centre, Math.max(3, Math.floor(n / 2) + 2));
        // The blueprint decides the shape: a balanced set means the mean is the
        // centre exactly; nudging one value by 1 puts the mean off it by 1/n —
        // still exact, and the week asked for it.
        const values = clean ? balanced : balanced.map((v, i) => (i === 0 ? v + 1 : v));
        return {
          prompt: `${name} recorded these ${setting.what} over ${countNoun(n, setting.over)}: ${listOf(values)}. What is the mean?`,
          answerValue: meanOf(values),
          templateId: 'stat_mean_v1',
          params: { values },
          hints: [
            'If every value were shared out so they all matched, what would each one become?',
            'Pool the whole data set into one total, then split that total evenly across the values.',
          ],
          errorTags: ['procedure-slip', 'concept-misconception'],
        };
      },
    }),
    (p) => {
      const values = statValues(p);
      return barModel(
        values.map((v) => ({ segments: [{ value: v, label: String(v) }] })),
        {
          scaleMax: Math.max(...values),
          alt: `one bar for each of the ${values.length} recorded values, drawn to a single scale`,
        },
      );
    },
  );
}

/**
 * Median. The list is written in an order whose middle is NOT the median, so
 * "median without sorting" fails here at every seed rather than at most of them.
 */
export function medianOfSet(opts: { n?: number } = {}): ItemGen {
  const n = opts.n ?? 5;
  return situation({
    situationType: 'combine',
    cognitiveOp: 'median',
    draw: (r) => {
      const values = unsortedMiddle(distinctSet(r, n, 8, 40));
      const day = r.pick(DAYS);
      return {
        prompt: `A shop counted its visitors on ${countNoun(n, 'days')}, starting on ${day}: ${listOf(values)}. What is the median number of visitors?`,
        answerValue: medianOf(values),
        templateId: 'stat_median_v1',
        params: { values },
        units: 'visitors',
        hints: [
          'Does the middle of a list as written mean the same thing as the middle of the data?',
          'Put the values in order along a line first, then look at the one standing in the centre.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  });
}

/** Mode — one value is drawn to dominate strictly, so "most common" is decidable. */
export function modeOfSet(opts: { n?: number } = {}): ItemGen {
  const n = opts.n ?? 6;
  return situation({
    situationType: 'combine',
    cognitiveOp: 'mode',
    draw: (r) => {
      const values = modeSet(r, n, 3, 15);
      return {
        prompt: `A class recorded how many books each of ${countNoun(n, 'readers')} finished: ${listOf(values)}. What is the mode?`,
        answerValue: modeOf(values),
        templateId: 'stat_mode_v1',
        params: { values },
        units: 'books',
        hints: [
          'Which value turns up more often than any other?',
          'Tally how many times each value appears, then read off the tallest tally.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  });
}

/** Range — the spread statistic, deliberately paired against the centre ones. */
export function rangeOfSet(opts: { n?: number } = {}): ItemGen {
  const n = opts.n ?? 5;
  return situation({
    situationType: 'measurement',
    cognitiveOp: 'range',
    draw: (r) => {
      const values = distinctSet(r, n, 4, 32);
      return {
        prompt: `The midday temperatures for ${countNoun(n, 'days')}, in degrees Celsius, were ${listOf(values)}. What is the range?`,
        answerValue: rangeOf(values),
        templateId: 'stat_range_v1',
        params: { values },
        units: 'degrees',
        hints: [
          'Is the range asking where the data sits, or how far it stretches?',
          'Find the two ends of the data and measure the gap between them.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/** Mean vs median on skewed data — the E21 discrimination, decided by the numbers. */
export function meanVsMedianOnSkew(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'compare-centres',
    draw: (r) => {
      // A BALANCED SET IS DRAWN A THIRD OF THE TIME, and it has to be.
      //
      // Every draw used to carry an outlier, and the generator went to trouble
      // to keep "they come out the same" genuinely false — which made that card
      // permanently unkeyable (L38). It was offered on 100% of draws and could
      // never be right, so a child learns to strike it, and what is left is a
      // coin toss between two cards on an item that is supposed to teach when a
      // far-off value moves a summary and when it does not. A set symmetric
      // about its middle answers that honestly: mean and median coincide
      // EXACTLY, by integer construction, and the skewed draws mean something
      // because the balanced ones exist to contrast with.
      const SAME = 'they come out the same';
      if (r.chance(1 / 3)) {
        const mid = r.int(20, 60);
        const [near, far] = r.shuffle([r.int(2, 6), r.int(7, 12)]);
        // Symmetric about `mid`: the two gaps cancel in the sum, so the mean is
        // mid, and mid is the third of five sorted values, so the median is too.
        const balanced = r.shuffle([mid - far, mid - near, mid, mid + near, mid + far]);
        return {
          prompt: `A data set reads ${listOf(balanced)}. Which summary comes out larger for it, the mean or the median?`,
          correct: SAME,
          distractors: [
            { text: 'the mean', errorTag: 'concept-misconception', rationale: 'Expects the mean to be pulled off centre even where the values balance either side of the middle.' },
            { text: 'the median', errorTag: 'concept-misconception', rationale: 'Expects the middle value to sit off the fair share even where the values balance either side of it.' },
          ],
          hints: [
            'Which summary has to move when one value sits far away from the rest?',
            'Locate the value in the middle, then judge whether the far-off value pulls the fair share past it.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        };
      }
      const cluster = distinctSet(r, 4, 10, 18);
      const high = r.chance(0.5);
      const drawn = high ? r.int(60, 90) : r.int(1, 3);
      // The outlier sits outside the cluster, so nudging it cannot move the
      // median — which makes this the safe way to break an exact tie and keep
      // "they come out the same" genuinely false ON THIS BRANCH.
      const median = Number(medianOf([...cluster, drawn]));
      const outlier = sumOf(cluster) + drawn === median * 5 ? drawn + (high ? 1 : -1) : drawn;
      const values = r.shuffle([...cluster, outlier]);
      const sum = sumOf(values);
      // Exact integer comparison — sum vs median·n, never a float division.
      const meanIsLarger = sum > median * values.length;
      return {
        prompt: `A data set reads ${listOf(values)}. Which summary comes out larger for it, the mean or the median?`,
        correct: meanIsLarger ? 'the mean' : 'the median',
        distractors: [
          {
            text: meanIsLarger ? 'the median' : 'the mean',
            errorTag: 'concept-misconception',
            rationale: 'Misses which summary a single far-off value drags with it — only one of the two is pulled by the extreme.',
          },
          {
            text: SAME,
            errorTag: 'representation-misread',
            rationale: 'Treats a lopsided data set as if it were evenly balanced about its centre.',
          },
        ],
        hints: [
          'Which summary has to move when one value sits far away from the rest?',
          'Locate the value in the middle, then judge whether the far-off value pulls the fair share past it.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

// ===========================================================================
// E21 multi-step — mean-first chains (the first stated number IS the chain's init)
// ===========================================================================

/** Add a point and watch the mean move: total → add → re-share. */
export function msMeanAfterExtraValue(): ItemGen {
  return multiStep({
    situationType: 'sharing',
    cognitiveOp: 'mean',
    draw: (r) => {
      const n = r.pick([4, 5, 6, 8]);
      const mean = r.int(6, 14);
      const newMean = mean + r.int(1, 3);
      const added = (n + 1) * newMean - n * mean;
      const setting = r.pick(SCORE_SETTINGS);
      return {
        prompt: `A set of ${numberWords(n)} ${setting.what} has a mean of ${mean}. One more value of ${added} is recorded. What is the mean of all ${numberWords(n + 1)} values?`,
        initN: mean,
        steps: [
          { op: 'mul', n, d: 1 },
          { op: 'add', n: added, d: 1 },
          { op: 'div', n: n + 1, d: 1 },
        ],
        hints: [
          'Can a new mean be found without first rebuilding what the old values added up to?',
          'Turn the mean back into a total, fold the new value in, then share the bigger total across the bigger set.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/**
 * The inverse-start form: the stated mean is the RESULT of the sharing, so the
 * opening move is to undo it (PEDAGOGY-CEILING-REVIEW F3).
 */
export function msMissingValueFromMean(): ItemGen {
  return multiStep({
    situationType: 'part-whole',
    cognitiveOp: 'mean',
    posing: 'inverse-start',
    usesPriorSkill: true,
    draw: (r) => {
      const n = r.pick([5, 7]);
      const mean = r.int(9, 18);
      const values = balancedSet(r, n, mean, Math.floor(n / 2) + 2);
      const known = values.slice(0, -1);
      const setting = r.pick(SCORE_SETTINGS);
      return {
        prompt: `A set of ${numberWords(n)} ${setting.what} has a mean of ${mean}. ${cap(numberWords(n - 1))} of the values are ${listOf(known)}. What is the remaining value?`,
        initN: mean,
        steps: [
          { op: 'mul', n, d: 1 },
          { op: 'sub', n: sumOf(known), d: 1 },
        ],
        hints: [
          'Does the stated mean tell you a single value, or something about all of them together?',
          'Rebuild the total the mean implies, then take away everything already accounted for.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  });
}

// ===========================================================================
// B23 / C23 / E22 — graph reads (computed off the item's own params)
// ===========================================================================

/**
 * A read off a bar graph (`mode:'bar'`, key 1) or a scaled pictograph
 * (`mode:'pictograph'`, key 2/5/10 — C23's "the key tells the worth").
 *
 * BLOCKED ON A CHART PRIMITIVE for display: the counts, labels and key ride in
 * `generator.params` and the display is stated in prose. Nothing here invents a
 * primitive; when a bar-chart/pictograph primitive lands, these params are its
 * params and only the drawing is added.
 */
export function graphRead(
  kind: 'value' | 'difference' | 'combine',
  mode: 'bar' | 'pictograph' = 'bar',
): ItemGen {
  return situation({
    situationType: 'comparison',
    cognitiveOp: `graph-${kind}`,
    draw: (r) => {
      const subject = r.pick(GRAPH_SUBJECTS);
      const labels = r.shuffle([...DAYS]).slice(0, 3);
      const counts = distinctSet(r, 3, 2, 9);
      const key = mode === 'pictograph' ? r.pick([2, 5, 10]) : 1;
      const display =
        mode === 'pictograph'
          ? `A pictograph shows ${subject.thing}. ${labels[0]} has ${countNoun(counts[0], subject.symbol)}. ${labels[1]} has ${countNoun(counts[1], subject.symbol)}. ${labels[2]} has ${countNoun(counts[2], subject.symbol)}. The key says each ${unitFor(1, subject.symbol)} stands for ${countNoun(key, subject.thing)}.`
          : `A bar graph shows ${subject.thing}. ${labels[0]} is at ${counts[0]}, ${labels[1]} at ${counts[1]} and ${labels[2]} at ${counts[2]}.`;
      // WHICH TWO ENTRIES ARE COMPARED IS DRAWN, then ordered so a "how many
      // more" question is never negative. Comparing the top two by construction
      // meant the gap was the smallest of the three available, and free-entry
      // answers piled up: "1" on 36.2% of difference draws over six reachable
      // answers. Any pair of the three keeps the question honest and spreads the
      // gap across its real range.
      const order = [0, 1, 2].sort((a, b) => counts[b] - counts[a]);
      const pair = r.shuffle([0, 1, 2]).slice(0, 2);
      let [hi, lo] = counts[pair[0]] > counts[pair[1]] ? pair : [pair[1], pair[0]];
      // A ONE-SYMBOL GAP ON A KEYED DISPLAY HANDS OVER THE ANSWER (2026-08-25):
      // (hi − lo) = 1 makes the answer equal the KEY, which the prompt prints —
      // measured on 24-26% of difference draws, served by C23. Deterministic
      // switch to the max-gap pair (three distinct counts guarantee a gap ≥ 2);
      // no rng consumed, so every later item in the pack is untouched.
      if (kind === 'difference' && mode === 'pictograph' && counts[hi] - counts[lo] === 1) {
        [hi, lo] = [order[0], order[2]];
      }
      if (kind === 'difference') {
        return {
          prompt: `${display} How many more ${subject.thing} does ${labels[hi]} show than ${labels[lo]}?`,
          answerValue: String((counts[hi] - counts[lo]) * key),
          templateId: 'stat_graph_diff_v1',
          params: { counts, labels, key, i: hi, j: lo },
          units: subject.thing,
          hints: [
            'Does the question want one amount, or the gap between two?',
            'Read each of the two amounts in full first, then compare them.',
          ],
          errorTags: ['task-comprehension', 'representation-misread'],
        };
      }
      if (kind === 'combine') {
        return {
          prompt: `${display} How many ${subject.thing} do ${labels[hi]} and ${labels[lo]} show altogether?`,
          answerValue: String((counts[hi] + counts[lo]) * key),
          templateId: 'stat_graph_total_v1',
          params: { counts, labels, key, indices: [hi, lo] },
          units: subject.thing,
          hints: [
            'Which parts of the display does this question actually use?',
            'Turn each of the two entries into its amount, then join the two amounts.',
          ],
          errorTags: ['task-comprehension', 'procedure-slip'],
        };
      }
      // 'value' — deliberately never the tallest entry, so the tallest-bar
      // misread produces a genuinely different number. It used to be the
      // SHORTEST entry specifically, which pinned the answer to the minimum of
      // three distinct draws from 2–9: "2" came up on 38.1% of draws against a
      // 16.7% uniform share, so answering 2 without reading the display scored
      // more than twice what it should. Either of the two shorter entries keeps
      // the tallest-misread property and spreads the answer.
      const index = order[r.int(1, 2)];
      return {
        prompt: `${display} How many ${subject.thing} does ${labels[index]} show?`,
        answerValue: String(counts[index] * key),
        templateId: 'stat_graph_value_v1',
        params: { counts, labels, key, index },
        units: subject.thing,
        hints: [
          'Which entry does the question name — and is it the one that stands out?',
          'Find the named entry first, then read what the display says that entry is worth.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  });
}

/**
 * A histogram read — E22's computable core. The bins are equal-width intervals
 * and the question spans two of them, so the child must notice that a histogram
 * bar reports a GROUP, not a value. Also blocked on a chart primitive for
 * display; the bin counts ride in `generator.params`.
 */
export function histogramBinRead(): ItemGen {
  return situation({
    situationType: 'part-whole',
    cognitiveOp: 'graph-combine',
    draw: (r) => {
      const drawn = distinctSet(r, 4, 3, 18);
      const width = r.pick([5, 10]);
      const edges = [0, width, width * 2, width * 3];
      // THE ANSWER IS WALKED OFF THE PAGE (2026-08-25): c0 + c1 collided with
      // a printed numeral on 22.6% of draws — the band edges are multiples of
      // 5 or 10 and the counts run 3-18, so the collision is structural, not
      // unlucky (E22 measured it, declined to serve this item, and authored
      // its core locally with exactly this walk).
      const counts = clearOfPage(
        drawn, 1, 3, 18,
        (c) => c[0] + c[1],
        (c) => [...c, width, width * 2, ...edges, ...edges.map((e) => e + width - 1)],
      );
      const bins = edges.map((e, i) => `${e}–${e + width - 1} has ${counts[i]}`).join(', ');
      return {
        prompt: `A histogram groups reading times in minutes into equal intervals ${countNoun(width, 'minutes')} wide: ${bins}. How many readers took less than ${countNoun(width * 2, 'minutes')}?`,
        answerValue: String(counts[0] + counts[1]),
        templateId: 'stat_graph_total_v1',
        params: { counts, key: 1, indices: [0, 1] },
        units: 'readers',
        hints: [
          'Does one bar of a histogram stand for a single reader, or for everyone inside an interval?',
          'Decide which intervals the question covers, then join the counts of just those bars.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  });
}

/**
 * Replace ONE drawn count so an item's answer is not a numeral its prompt
 * already prints — hoisted verbatim from `weeks/e22.ts`'s `clearOfThePage`
 * (2026-08-25), where its every design decision is documented against
 * measurements: each slot is tried in turn because walking only one left a
 * residue (2 leaks in 3,200 served items, on a mastery slot); the walk is a
 * bounded DETERMINISTIC step and never a redraw loop (kit §E2.4, L19 — a loop
 * consumes a variable number of rng values and makes every later item in the
 * pack depend on this one); `printedBy` is the CALLER's to supply because the
 * printed set is not the same on every item (a hidden band's own count is the
 * answer and is NOT printed). If no replacement clears the page the drawn
 * counts stand rather than the build failing.
 */
export function clearOfPage(
  counts: readonly number[],
  slot: number,
  lo: number,
  hi: number,
  answerOf: (c: readonly number[]) => number,
  printedBy: (c: readonly number[]) => readonly number[],
): number[] {
  const range = hi - lo + 1;
  for (let off = 0; off < counts.length; off++) {
    const s = (slot + off) % counts.length;
    const start = counts[s];
    for (let k = 0; k < range; k++) {
      const cand = lo + ((start - lo + k) % range);
      if (counts.some((c, j) => j !== s && c === cand)) continue;
      const trial = counts.map((c, j) => (j === s ? cand : c));
      if (!printedBy(trial).includes(answerOf(trial))) return trial;
    }
  }
  return [...counts];
}

/** B23/C23 multi-step: read two entries, combine, then apply the key. */
export function msGraphCombineWithKey(): ItemGen {
  return multiStep({
    situationType: 'combine',
    cognitiveOp: 'graph-combine',
    draw: (r) => {
      const subject = r.pick(GRAPH_SUBJECTS);
      const labels = r.shuffle([...DAYS]).slice(0, 2);
      const [c1, c2] = distinctSet(r, 2, 2, 9);
      const key = r.pick([2, 5, 10]);
      return {
        prompt: `On a pictograph, ${labels[0]} shows ${countNoun(c1, subject.symbol)} and ${labels[1]} shows ${countNoun(c2, subject.symbol)}. Each ${unitFor(1, subject.symbol)} stands for ${countNoun(key, subject.thing)}. How many ${subject.thing} do the two days show altogether?`,
        initN: c1,
        steps: [
          { op: 'add', n: c2, d: 1 },
          { op: 'mul', n: key, d: 1 },
        ],
        units: subject.thing,
        hints: [
          'Do the symbols on the display count the things themselves, or stand in for them?',
          'Gather the symbols from both entries first, then let the key turn symbols into amounts.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  });
}

/** C23 — symbol count vs the value the key gives it. */
export function symbolCountVsValue(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'graph-value',
    draw: (r) => {
      const subject = r.pick(GRAPH_SUBJECTS);
      // WHERE THE TRUTH SITS AMONG THE CARDS IS DRAWN FIRST.
      // Both distractors this item shipped with — the symbol count alone, and
      // the count ADDED to the key — are necessarily below count × key for every
      // legal draw, so "tap the biggest number" keyed 3000 of 3000 against a 33%
      // baseline. Two further misconceptions on this item genuinely land ABOVE
      // the truth (a symbol counted twice; every symbol assumed to be worth ten),
      // which is what makes all three ranks reachable.
      const want = r.pick(['largest', 'middle', 'smallest'] as const);
      // "Every symbol is worth ten" only overshoots while the key is under ten.
      const key = want === 'largest' ? r.pick([2, 5, 10]) : r.pick([2, 5]);
      const count = r.int(3, 7);
      const day = r.pick(DAYS);
      const IGNORES_KEY = {
        text: String(count),
        errorTag: 'representation-misread' as const,
        rationale: 'Reads the symbols as the amount and leaves the key doing no work at all.',
      };
      const ADDS_KEY = {
        text: String(count + key),
        errorTag: 'concept-misconception' as const,
        rationale: 'Joins the symbol count and the key as if the key were an extra amount to add on.',
      };
      const COUNTS_ONE_TWICE = {
        text: String((count + 1) * key),
        errorTag: 'procedure-slip' as const,
        rationale: 'One symbol in the row counted twice, then valued correctly.',
      };
      const ALL_SYMBOLS_TEN = {
        text: String(count * 10),
        errorTag: 'concept-misconception' as const,
        rationale: 'Every symbol taken to be worth ten, whatever the key says.',
      };
      return {
        prompt: `On a pictograph, each ${unitFor(1, subject.symbol)} stands for ${countNoun(key, subject.thing)}. The row for ${day} shows ${countNoun(count, subject.symbol)}. Which number is the amount of ${subject.thing} for that row?`,
        correct: String(count * key),
        distractors: want === 'largest'
          ? [IGNORES_KEY, ADDS_KEY]
          : want === 'middle'
            ? [IGNORES_KEY, ALL_SYMBOLS_TEN]
            : [COUNTS_ONE_TWICE, ALL_SYMBOLS_TEN],
        hints: [
          'What job is the key doing on a pictograph?',
          'Say out loud what one symbol is worth. Then account for every symbol in the row.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  });
}

/** B23 — the tallest bar vs the bar actually asked for. */
export function tallestVsAskedBar(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'graph-value',
    draw: (r) => {
      const subject = r.pick(GRAPH_SUBJECTS);
      const labels = r.shuffle([...DAYS]).slice(0, 3);
      // TWO DEFECTS, ONE DRAW, both invisible to a correctness gate.
      //
      // (1) The question always named the SHORTEST bar, so its answer was the
      //     smallest card on 67.7% of draws and never the largest — the item
      //     that teaches "read the bar you were asked for" could be scored by
      //     never reading it. The named bar is now drawn from the two that are
      //     not the tallest, which is the only constraint the lesson needs.
      // (2) The "how many more" distractor is a DIFFERENCE of two counts, and on
      //     9.4% of draws it landed on a count already on a card — the same text
      //     offered twice in one set. Distinct heights were never enough; the
      //     gap has to be distinct from them too.
      // The rank asked for is fixed BEFORE the redraw, or the loop would be
      // checking one bar's gap and the item would then ship another's.
      //
      // The question names ANY of the three bars, including the tallest. Naming
      // only the shorter ones left the tallest permanently unkeyable, so "never
      // the bar that stands out" scored without reading the question — the exact
      // reflex this item exists to break, rewarded. When the tallest IS the one
      // asked for, the lure becomes the shortest bar: still "you read a bar you
      // were not asked about", which is the whole discrimination, and now a
      // child who has learnt to dodge the tall bar is caught by it.
      // WHERE THE KEY SITS AMONG THE CARDS IS DRAWN FIRST (2026-08-25) — the
      // construction symbolCountVsValue established in this same file. The
      // previous draw picked WHICH bar was asked and let the rank fall out,
      // and the rank fell out crooked: middle 40.9-42.4% over two lattices,
      // nine points past the corpus bar, because asking the tallest forces
      // key-largest (both other cards are smaller by construction) while
      // asking the middle bar against the tallest usually leaves the gap
      // below it. Ranks are now reachable by construction:
      //   largest  → ask the tallest (lure = shortest; both cards below key);
      //   middle   → ask the middle bar with T < 2M (gap lands below key);
      //   smallest → ask the middle bar with T > 2M (gap lands above key).
      // The middle bar keeps the tallest as its lure, so the lesson — read the
      // bar you were asked for, not the one that stands out — is untouched.
      // Each branch consumes the SAME three int draws and nudges
      // deterministically, which also retires the 40-iteration redraw loop the
      // first version used (a variable-rng loop, the exact shape kit §E2.4
      // forbids — it made every later item in the pack depend on this one).
      const want = r.int(0, 2); // 0 smallest · 1 middle · 2 largest
      const d1 = r.int(0, 7);
      const d2 = r.int(0, 7);
      const d3 = r.int(0, 7);
      let T: number, M: number, S: number;
      if (want === 2) {
        T = 7 + (d1 % 8);                        // 7..14
        M = 4 + (d2 % (T - 4));                  // 4..T−1
        S = 3 + (d3 % (M - 3 || 1));             // 3..M−1 (M ≥ 4 in every branch)
        if (T === 2 * S) S = S > 3 ? S - 1 : S + 1;   // keep the gap card off S
        if (S >= M) S = M - 1;                   // only reachable via the nudge above
      } else if (want === 1) {
        T = 9 + (d1 % 6);                        // 9..14
        const mLo = Math.floor(T / 2) + 1;       // T < 2M
        M = mLo + (d2 % (T - mLo));              // mLo..T−1
        S = 3 + (d3 % (M - 3 || 1));             // gap ≠ key holds by T < 2M strict
        if (S >= M) S = M - 1;
      } else {
        T = 11 + (d1 % 4);                       // 11..14
        const mHi = Math.ceil(T / 2) - 1;        // T > 2M
        M = 4 + (d2 % Math.max(1, mHi - 3));     // 4..mHi
        S = 3 + (d3 % (M - 3 || 1));
        if (S >= M) S = M - 1;
      }
      const slots = r.shuffle([0, 1, 2]);
      const counts: number[] = [];
      counts[slots[0]] = T; counts[slots[1]] = M; counts[slots[2]] = S;
      const order = [0, 1, 2].sort((a, b) => counts[b] - counts[a]);
      const asked = want === 2 ? order[0] : order[1];
      const tallest = want === 2 ? order[2] : order[0];
      return {
        prompt: `A bar graph shows ${subject.thing}. ${labels[0]} is at ${counts[0]}, ${labels[1]} at ${counts[1]} and ${labels[2]} at ${counts[2]}. Which number answers "how many for ${labels[asked]}"?`,
        correct: String(counts[asked]),
        distractors: [
          {
            text: String(counts[tallest]),
            errorTag: 'representation-misread',
            rationale: want === 2
              ? 'Reads a different bar from the one the question names.'
              : 'Reads the bar that stands out rather than the bar the question names.',
          },
          {
            text: String(Math.abs(counts[tallest] - counts[asked])),
            errorTag: 'task-comprehension',
            rationale: 'Answers "how many more" — a comparison the question did not ask for.',
          },
        ],
        hints: [
          'Which label does the question point at?',
          'Put a finger on the named label first, and only then look up its height.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  });
}

/** E22 — a bar graph counts named categories; a histogram groups intervals. */
export function barGraphVsHistogram(): ItemGen {
  return discrimination({
    variant: 'structural',
    cognitiveOp: 'classify-display',
    draw: (r) => {
      const people = r.int(30, 90);
      const width = r.pick([5, 10, 20]);
      const askIntervals = r.chance(0.5);
      return {
        prompt: askIntervals
          ? `A survey of ${countNoun(people, 'people')} is drawn two ways. Which display sorts the ages into equal intervals ${countNoun(width, 'years')} wide?`
          : `A survey of ${countNoun(people, 'people')} is drawn two ways. Which display counts how many people chose each named activity?`,
        correct: askIntervals ? 'the histogram' : 'the bar graph',
        distractors: [
          {
            text: askIntervals ? 'the bar graph' : 'the histogram',
            errorTag: 'concept-misconception',
            rationale: 'Swaps the two displays: one counts separate named groups, the other counts everything falling inside a numeric interval.',
          },
          {
            text: 'either one, they show the same thing',
            errorTag: 'representation-misread',
            rationale: 'Treats a display whose bars can be reordered freely and one whose bars sit on a number line as interchangeable.',
          },
        ],
        hints: [
          'Can the bars of this display be shuffled into any order and still be honest?',
          'Ask what sits along the bottom of each display: names, or a number line cut into equal pieces.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  });
}

// ===========================================================================
// E23 — probability
// ===========================================================================

/**
 * Probability as a reduced fraction. The 0–1 line is cut into the item's OWN
 * number of equal outcomes — a picture of the sample space, carrying no mark,
 * so it frames the question without answering it.
 */
export function probabilityOfEvent(): ItemGen {
  return withFigure(
    situation({
      situationType: 'part-whole',
      cognitiveOp: 'probability',
      draw: (r) => {
        const item = r.pick(CHANCE_ITEMS);
        const favorable = r.int(2, 5);
        let other = r.int(2, 7);
        // NEVER EXACTLY A HALF (2026-08-25): equal colour counts key 1/2 on
        // 15.8% of draws — marking the "either it happens or it doesn't, so
        // fifty-fifty" misconception CORRECT one time in six, on the item E23
        // serves. One deterministic step, never a redraw loop (kit §E2.4).
        // E23's own redrawUntil(notAHalf) filter predates this and becomes a
        // no-op the moment this lands.
        if (other === favorable) other = other === 7 ? 6 : other + 1;
        const total = favorable + other;
        return {
          prompt: `${item.holder} holds ${countNoun(favorable, `${item.target} ${item.unit}`)} and ${countNoun(other, `${item.other} ${item.unit}`)}. One is taken out without looking. What is the probability that it is ${item.target}?`,
          answerValue: formatFrac(reduceFrac(favorable, total)),
          templateId: 'stat_prob_v1',
          params: { favorable, total },
          validation: 'equivalent-fraction',
          acceptableForms: [],
          hints: [
            'How many outcomes are possible altogether, and how many of them count as a win?',
            'Put the winning outcomes over every outcome the draw could produce.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        };
      },
    }),
    (p) => {
      const total = Number(p.total);
      return numberLine(
        { min: 0, max: 1, partition: total, labels: 'ends' },
        { alt: `the certainty line from 0 to 1, cut into ${total} equal steps — one for each possible outcome` },
      );
    },
  );
}

/** The complement — the other half of E23's "P as fraction; complement". */
export function complementProbability(): ItemGen {
  return situation({
    situationType: 'part-whole',
    cognitiveOp: 'complement',
    draw: (r) => {
      const total = r.pick([6, 8, 9, 10, 12]);
      let favorable = r.int(2, total - 2);
      // Same half-guard as probabilityOfEvent above: the complement of a half
      // IS a half, so with favorable·2 == total this item keyed the named
      // misconception's own answer on 16.1% of draws. One deterministic step.
      if (favorable * 2 === total) favorable = favorable === total - 2 ? favorable - 1 : favorable + 1;
      const item = r.pick(CHANCE_ITEMS);
      return {
        prompt: `A spinner is cut into ${countNoun(total, 'equal parts')}, and ${countNoun(favorable, 'parts')} are ${item.target}. What is the probability that one spin does NOT land on ${item.target}?`,
        answerValue: formatFrac(reduceFrac(total - favorable, total)),
        templateId: 'stat_prob_complement_v1',
        params: { favorable, total },
        validation: 'equivalent-fraction',
        acceptableForms: [],
        hints: [
          'What do the chance of a thing happening and the chance of it not happening add up to?',
          'Count the parts that would disappoint you, and put those over all the parts.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });
}

/**
 * E23 — "either it happens or it does not, so it must be half".
 *
 * @deprecated MEASURED UNSERVABLE (E23 pre-sweep, 6,000 draws): the "1/2" card
 * is offered on every draw and keyed on none — and it is ALWAYS the middle
 * option by algebra, not luck: the other two cards are p and 1 − p, so 1/2
 * lies strictly between them on every legal draw (p = 1/2 is excluded by this
 * generator's own guard). "Strike the middle, take the smaller" scores 90.3%.
 * No draw parameter can fix it — a live 1/2 card and a complement distractor
 * are mutually exclusive (when p = 1/2 they collapse onto one value), so the
 * repair is a redesign: see e23.ts `discrimWhichChance`, which enumerates the
 * card set by key-rank at module load and keys "1/2" on 12.1% of draws. Any
 * future week wanting this item should port that design; serving this one
 * ships a page that gets WORSE once a child spots the dead card.
 */
export function eitherOrFiftyFifty(): ItemGen {
  return discrimination({
    variant: 'cross-op',
    cognitiveOp: 'probability',
    draw: (r) => {
      const total = r.pick([5, 6, 8, 9, 10]);
      const drawn = r.int(2, 3);
      // Never exactly half the spinner, so the "50-50" option is genuinely wrong
      // and the complement distractor cannot collide with the correct answer.
      const favorable = drawn * 2 === total ? 2 : drawn;
      return {
        // Plain interpolation, not countNoun: countNoun pluralises the LAST
        // word of its phrase, so countNoun(2, 'of them') printed "2 of thems"
        // on every draw (found by E23's pre-sweep; the sibling call in
        // eaPastTrialsChangeNext escapes only because its count is always 1).
        prompt: `A spinner has ${countNoun(total, 'equal parts')}, and ${favorable} of them are green. Which fraction gives the probability of landing on green?`,
        correct: formatFrac(reduceFrac(favorable, total)),
        distractors: [
          {
            text: '1/2',
            errorTag: 'concept-misconception',
            rationale: 'Counts only "it happens" and "it does not" as the two outcomes, as if they were equally likely whatever the spinner looks like.',
          },
          {
            text: formatFrac(reduceFrac(total - favorable, total)),
            errorTag: 'task-comprehension',
            rationale: 'Gives the chance of the spin missing green — the complement, not the event asked for.',
          },
        ],
        hints: [
          'Are the two things that could happen here equally likely?',
          'Count the parts that win and compare that with the number of parts on the whole spinner.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  });
}

// ===========================================================================
// Error analysis — the shown "wrong" is a named misconception's real output
// ===========================================================================

/** E21 — MEDIAN WITHOUT SORTING. */
export function eaMedianWithoutSorting(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'stat_verify_median_v1',
    cognitiveOp: 'median',
    drawParams: (r) => ({ values: unsortedMiddle(distinctSet(r, 5, 6, 40)) }),
    build: (v, p) => ({
      prompt: `A student was asked for the median of ${listOf(intList(p, 'values'))} and wrote ${v.wrong}.`,
      extension: 'Lay the values out along a line, then write the median the line shows.',
      hints: [
        'Does the median depend on the order the values happen to be written in?',
        'Arrange the data from smallest to largest before deciding which value stands in the middle.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    }),
  });
}

/** C23 — 3 SYMBOLS READ AS 3 when the key says each symbol is worth 5. */
export function eaSymbolScaleIgnored(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'stat_verify_graph_scale_v1',
    cognitiveOp: 'graph-value',
    drawParams: (r) => ({ count: r.int(3, 7), key: r.pick([2, 5, 10]) }),
    build: (v, p, r) => {
      const subject = r.pick(GRAPH_SUBJECTS);
      const day = r.pick(DAYS);
      return {
        prompt: `On a pictograph, the key says each ${unitFor(1, subject.symbol)} stands for ${countNoun(Number(p.key), subject.thing)}. The row for ${day} shows ${countNoun(Number(p.count), subject.symbol)}, and a student wrote that the row stands for ${countNoun(Number(v.wrong), subject.thing)}.`,
        extension: 'Write what that row is really worth, then say what the key would have to read for the student\'s number to be right.',
        hints: [
          'What does one symbol on this display stand for?',
          'Take the symbols one at a time and count on by what the key says each is worth.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  });
}

/** B23 — READS THE TALLEST BAR rather than the bar the question names. */
export function eaTallestBarRead(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'stat_verify_graph_read_v1',
    cognitiveOp: 'graph-value',
    drawParams: (r) => {
      const counts = distinctSet(r, 3, 3, 14);
      const order = [0, 1, 2].sort((a, b) => counts[b] - counts[a]);
      // EITHER NON-TALLEST BAR, drawn — never order[order.length − 1], which
      // named the SHORTEST every draw, so the true answer was the minimum of
      // three draws from 3–14 and "write the smallest number printed" scored
      // 100% (measured 2026-08-25; the same defect the 2026-08-15 sweep
      // repaired in tallestVsAskedBar, whose error-analysis twin this is —
      // e22 applied this exact repair locally rather than serve it).
      return { counts, key: 1, index: order[r.int(1, 2)] };
    },
    build: (v, p, r) => {
      const subject = r.pick(GRAPH_SUBJECTS);
      const labels = r.shuffle([...DAYS]).slice(0, 3);
      const counts = intList(p, 'counts');
      const index = num(p, 'index');
      const entries = labels.map((l, i) => `${l} at ${counts[i]}`).join(', ');
      return {
        prompt: `A bar graph of ${subject.thing} shows ${entries}. Asked how many ${subject.thing} ${labels[index]} shows, a student wrote ${v.wrong}.`,
        extension: 'Write the number the graph really gives for that day, and say how the two bars differ.',
        hints: [
          'Which label was the question about?',
          'Track across from the named label to its own bar before reading any height.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  });
}

/** E23 — PAST TRIALS CHANGE THE NEXT ONE (the gambler's fallacy). */
export function eaPastTrialsChangeNext(): ItemGen {
  return errorAnalysis({
    verifyTemplateId: 'stat_verify_next_trial_v1',
    cognitiveOp: 'probability',
    drawParams: (r) => {
      const total = r.pick([4, 5, 8, 10]);
      const favorable = 1;
      // A recent run whose observed rate differs from the real one, so the
      // student's number is a genuine (and genuinely different) claim.
      const pastTrials = r.pick([6, 9, 12]);
      let pastHits = r.int(2, 4);
      // The student's claim has to BE a different number from the spinner's own
      // chance, or there is no misconception to analyse and the verify template
      // rightly refuses. Nudged deterministically rather than redrawn: a redraw
      // loop consumes a variable number of rng draws, which would make every
      // later item in the pack seed-dependent on this one (LEARNINGS L19).
      // Only one pastHits value can collide for a given (pastTrials, total), so
      // a single step is always enough.
      if (pastHits * total === pastTrials * favorable) pastHits = pastHits === 4 ? 2 : pastHits + 1;
      return { favorable, total, pastHits, pastTrials };
    },
    build: (v, p) => ({
      prompt: `A spinner has ${countNoun(num(p, 'total'), 'equal parts')}, and just ${countNoun(num(p, 'favorable'), 'of them')} is green. In the last ${countNoun(num(p, 'pastTrials'), 'spins')} it landed on green ${countNoun(num(p, 'pastHits'), 'times')}. A student wrote that the probability of green on the very next spin is ${v.wrong}.`,
      extension: 'Write the probability of green on the next spin, and explain what the spinner does and does not remember.',
      hints: [
        'Does the spinner keep any record of where it stopped before?',
        'Look at the spinner itself and count the parts that win against all the parts there are.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    }),
  });
}

// ===========================================================================
// Template registry — QG-5 answers and QG-11 truths for everything above
// ===========================================================================

/** The value a graph entry stands for: its symbol count times the key. */
function graphValue(p: Record<string, unknown>): string {
  const counts = intList(p, 'counts');
  const i = num(p, 'index');
  const entry = counts[i];
  if (entry === undefined) throw new Error(`graph index ${i} is outside the ${counts.length} entries`);
  return String(entry * num(p, 'key'));
}

function graphDiff(p: Record<string, unknown>): string {
  const counts = intList(p, 'counts');
  const a = counts[num(p, 'i')];
  const b = counts[num(p, 'j')];
  if (a === undefined || b === undefined) throw new Error('graph difference names an entry the display does not have');
  return String((a - b) * num(p, 'key'));
}

function graphTotal(p: Record<string, unknown>): string {
  const counts = intList(p, 'counts');
  const idx = Array.isArray(p.indices) ? (p.indices as number[]) : counts.map((_, i) => i);
  const total = idx.reduce((acc, i) => {
    const entry = counts[i];
    if (entry === undefined) throw new Error(`graph index ${i} is outside the ${counts.length} entries`);
    return acc + entry;
  }, 0);
  return String(total * num(p, 'key'));
}

export const STATS_TEMPLATE_DEFS: Array<AnswerDef | VerifyDef> = [
  // --- centre and spread ----------------------------------------------------
  /** Mean of a drawn array — exact, whole or terminating by construction. */
  { id: 'stat_mean_v1', answerFor: (p) => meanOf(statValues(p)) },
  /** Median of a drawn array (the two middles of an even set average exactly). */
  { id: 'stat_median_v1', answerFor: (p) => medianOf(statValues(p)) },
  /** Mode — the strictly dominant value the draw guarantees. */
  { id: 'stat_mode_v1', answerFor: (p) => modeOf(statValues(p)) },
  /** Range — the distance between the two ends of the data. */
  { id: 'stat_range_v1', answerFor: (p) => rangeOf(statValues(p)) },
  // --- graph reads (counts × key; display awaits a chart primitive) ---------
  /** One entry's value: its symbol/bar count scaled by the display's key. */
  { id: 'stat_graph_value_v1', answerFor: graphValue },
  /** "How many more": the gap between two entries, in the key's units. */
  { id: 'stat_graph_diff_v1', answerFor: graphDiff },
  /** The combined value of selected entries (all of them when `indices` is absent). */
  { id: 'stat_graph_total_v1', answerFor: graphTotal },
  // --- probability ----------------------------------------------------------
  /** P(event) as a reduced fraction. */
  { id: 'stat_prob_v1', answerFor: (p) => formatFrac(reduceFrac(num(p, 'favorable'), num(p, 'total'))) },
  /** P(not event) — the complement, also reduced. */
  {
    id: 'stat_prob_complement_v1',
    answerFor: (p) => formatFrac(reduceFrac(num(p, 'total') - num(p, 'favorable'), num(p, 'total'))),
  },

  /**
   * HISTOGRAM BAR READ AS ONE VALUE (added 2026-08-25; e22.ts header decision 4
   * records why it is not derivable from any existing verify — the two
   * identities that LOOK like solutions, c0 = 2·c1 with +/− and c0 = c1² with
   * +/÷, are killed by measurement: the first admits seven pairs over counts
   * 4-19 with correct ÷ wrong taking exactly ONE value, three, so "treble what
   * the student wrote" scores 100%; the second admits two pairs in the range).
   * correct = the two-band span, wrong = the single named band. c0 ≠ c1 is
   * guarded at the def, not the caller, so a future non-distinct caller cannot
   * enable the double-it tell.
   */
  {
    id: 'stat_verify_bin_span_v1',
    verifyFor: (p) => {
      const c0 = num(p, 'c0');
      const c1 = num(p, 'c1');
      if (c0 < 1) throw new Error('bin span: the other band must hold at least one reading, or the span IS the named band');
      if (c0 === c1) throw new Error('bin span: equal bands make the miss exactly half the truth — a doubling tell');
      return { correct: String(c0 + c1), wrong: String(c1) };
    },
  },

  // --- verify truths (QG-11) ------------------------------------------------
  /** MEDIAN WITHOUT SORTING: the true median vs the middle of the list as written. */
  {
    id: 'stat_verify_median_v1',
    verifyFor: (p) => {
      const values = statValues(p);
      if (values.length % 2 === 0) throw new Error('the median-without-sorting claim needs an odd-length set');
      return { correct: medianOf(values), wrong: String(values[(values.length - 1) / 2]) };
    },
  },
  /** 3 SYMBOLS READ AS 3: the keyed value vs the bare symbol count. */
  {
    id: 'stat_verify_graph_scale_v1',
    verifyFor: (p) => {
      const count = num(p, 'count');
      const key = num(p, 'key');
      if (key <= 1) throw new Error('a scale misread needs a key worth more than one');
      return { correct: String(count * key), wrong: String(count) };
    },
  },
  /** READS THE TALLEST BAR: the named entry's value vs the display's tallest. */
  {
    id: 'stat_verify_graph_read_v1',
    verifyFor: (p) => {
      const counts = intList(p, 'counts');
      const key = num(p, 'key');
      const index = num(p, 'index');
      const tallest = Math.max(...counts);
      if (counts[index] === tallest) throw new Error('the tallest-bar misread needs a named entry that is not the tallest');
      return { correct: String(counts[index] * key), wrong: String(tallest * key) };
    },
  },
  /** PAST TRIALS CHANGE THE NEXT: the spinner's own chance vs the observed run. */
  {
    id: 'stat_verify_next_trial_v1',
    verifyFor: (p) => {
      const correct = formatFrac(reduceFrac(num(p, 'favorable'), num(p, 'total')));
      const wrong = formatFrac(reduceFrac(num(p, 'pastHits'), num(p, 'pastTrials')));
      if (correct === wrong) throw new Error("the observed run must differ from the spinner's real chance");
      return { correct, wrong };
    },
  },
];
