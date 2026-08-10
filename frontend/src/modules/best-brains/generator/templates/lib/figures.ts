/**
 * Figure builders for week templates (B1.0; B1.1 extends this with the rest of
 * the families).
 *
 * The law these enforce by construction: a figure is built from the SAME drawn
 * values the item computes its answer from, so the picture cannot contradict
 * the answer. Every builder therefore takes the item's own numbers — never a
 * separately-drawn quantity — and stamps the `asserts` clause that lets QG-13
 * re-derive what the picture claims and compare it with `answer.value` or
 * `generator.params`.
 *
 * This is the `format.ts` pattern applied to pictures: a template that can only
 * build a figure through these helpers cannot build a lying one, and QG-13 is
 * the backstop proving no template bypassed them (L28).
 */

import type { AngleFigureParams, BBFigure, CounterIcon, FigureAssertion, MarkStyle } from '../../../figures/types';
// The coin picture NAMES its coins ("1 penny", "3 pennies") in its accessible
// name, so it renders that phrase through the same authority every prompt uses.
import { countNoun } from './format';

/**
 * Noun → glyph. Level-A prompts name concrete things ("count the acorns"), so a
 * picture of generic dots beside that sentence is a small lie a five-year-old
 * can see. Week templates draw their nouns from `DRAWABLE_NOUNS`, so every
 * pictured noun has a glyph; anything else falls back to a plain counter.
 */
const NOUN_ICON: Record<string, CounterIcon> = {
  ducks: 'duck', stars: 'star', apples: 'apple', fish: 'fish', leaves: 'leaf',
  shells: 'shell', flowers: 'flower', balls: 'ball', blocks: 'block',
  buttons: 'dot', counters: 'dot', dots: 'dot',
};

/** The nouns a counting week may draw and still be drawn honestly. */
export const DRAWABLE_NOUNS = [
  'ducks', 'stars', 'apples', 'fish', 'leaves', 'shells', 'flowers', 'balls', 'blocks', 'buttons',
] as const;

export function iconFor(noun: string): CounterIcon {
  return NOUN_ICON[noun.toLowerCase()] ?? 'dot';
}

/** Prompt arrangement wording → the counters layout that matches it. */
export function arrangementFor(text: string): 'row' | 'rows' | 'scatter' | 'ring' | 'stack' {
  // Checked FIRST and matched on its own words: a tens-tower is a stack, and no
  // existing arrangement string ("in a row", "in two rows", "scattered",
  // "curvy") contains either word, so nothing already authored changes shape.
  if (/tower|stack|column/i.test(text)) return 'stack';
  if (/two rows|rows/i.test(text)) return 'rows';
  if (/scatter|spread/i.test(text)) return 'scatter';
  if (/curvy|circle|ring|around/i.test(text)) return 'ring';
  return 'row';
}

/** One group of `n` countable things — the Level-A counting picture. */
export function counters(
  n: number,
  noun: string,
  opts: { arrangement?: string; alt?: string; asserts?: FigureAssertion } = {},
): BBFigure {
  return {
    type: 'counters',
    alt: opts.alt ?? `${n} ${n === 1 ? noun.replace(/s$/, '') : noun}`,
    params: { groups: [{ count: n, icon: iconFor(noun) }], arrangement: arrangementFor(opts.arrangement ?? 'row') },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/**
 * Several groups side by side — sort/match/compare pictures.
 *
 * `crossedOut` draws the last n counters struck through: the take-away picture
 * (A16/A17). It is emitted only when supplied, so an existing call is unchanged.
 *
 * NOTE what this builder deliberately does NOT expose: `showPairs` and
 * `markExtra`. Both perform part of what a comparison item asks the child to do
 * (thread the one-to-one match; ring the leftovers), so they stay opt-in for
 * MODELLING only and no assessed item can acquire them by accident.
 */
export function counterGroups(
  groups: Array<{ count: number; noun: string; label?: string; spread?: number }>,
  opts: {
    arrangement?: string;
    relation?: 'none' | 'join' | 'remove' | 'compare';
    crossedOut?: number;
    alt: string;
    asserts?: FigureAssertion;
  } = { alt: '' },
): BBFigure {
  return {
    type: 'counters',
    alt: opts.alt,
    params: {
      groups: groups.map((g) => ({
        count: g.count,
        icon: iconFor(g.noun),
        ...(g.label ? { label: g.label } : {}),
        // Emitted only when supplied, so every existing call produces a
        // byte-identical figure. See CountersParams.spread — it widens a row's
        // SPACING (not its counters) and exists for A5's conservation trap.
        ...(g.spread !== undefined ? { spread: g.spread } : {}),
      })),
      arrangement: arrangementFor(opts.arrangement ?? 'row'),
      ...(opts.relation ? { relation: opts.relation } : {}),
      ...(opts.crossedOut !== undefined ? { crossedOut: opts.crossedOut } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/**
 * A ten-frame (or five-frame, or double frame) holding `filled` counters.
 *
 * `coverStyle` matters pedagogically, not cosmetically: the default 'cells'
 * gives every hidden counter its own cover, which a child can COUNT — fine as a
 * scaffold, fatal on "how many are hiding?", where counting covers replaces the
 * partner reasoning the item exists for. Pass 'single' on any hiding-game item.
 */
export function tenFrame(
  filled: number,
  opts: {
    frames?: number;
    size?: 5 | 10;
    hidden?: number;
    coverStyle?: 'cells' | 'single';
    icon?: CounterIcon;
    alt?: string;
    asserts?: FigureAssertion;
  } = {},
): BBFigure {
  const cap = (opts.size ?? 10) * (opts.frames ?? 1);
  return {
    type: 'ten-frame',
    alt:
      opts.alt ??
      (opts.hidden
        ? `a frame of ${cap} with ${filled} counters showing and ${opts.hidden} hidden`
        : `a frame of ${cap} with ${filled} counters`),
    params: {
      filled,
      ...(opts.frames ? { frames: opts.frames } : {}),
      ...(opts.size ? { size: opts.size } : {}),
      ...(opts.hidden ? { hidden: opts.hidden } : {}),
      ...(opts.coverStyle ? { coverStyle: opts.coverStyle } : {}),
      ...(opts.icon ? { icon: opts.icon } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/** A number line, optionally partitioned, with marks and hops. */
export function numberLine(
  params: {
    min: number; max: number; step?: number; partition?: number;
    labels?: 'all' | 'majors' | 'ends' | 'none';
    labelAs?: 'number' | 'fraction';
    marks?: Array<{ at: number; label?: string; style?: MarkStyle }>;
    hops?: Array<{ from: number; to: number; label?: string }>;
  },
  opts: { alt: string; asserts?: FigureAssertion },
): BBFigure {
  return { type: 'number-line', alt: opts.alt, params, ...(opts.asserts ? { asserts: opts.asserts } : {}) };
}

/** Bars drawn to a shared scale — the comparison and part-whole anchor. */
export function barModel(
  bars: Array<{ label?: string; segments: Array<{ value: number; label?: string; fill?: 'solid' | 'soft' | 'none' | 'hatch' }>; total?: string }>,
  opts: { scaleMax?: number; brace?: { label: string }; alt: string; asserts?: FigureAssertion },
): BBFigure {
  return {
    type: 'bar-model',
    alt: opts.alt,
    params: { bars, ...(opts.scaleMax ? { scaleMax: opts.scaleMax } : {}), ...(opts.brace ? { brace: opts.brace } : {}) },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/** An area/array grid; `shadedRows`×`shadedCols` produces the double-shaded overlap. */
export function areaGrid(
  params: {
    rows: number; cols: number; shaded?: number; shadedRows?: number; shadedCols?: number;
    shadedCells?: number[];
    rowLabels?: string[]; colLabels?: string[]; cellLabels?: string[]; showCounts?: boolean;
  },
  opts: { alt: string; asserts?: FigureAssertion },
): BBFigure {
  return { type: 'area-grid', alt: opts.alt, params, ...(opts.asserts ? { asserts: opts.asserts } : {}) };
}

/**
 * A hundred chart — ten rows of ten, numbered `start`..`start + 99`, with any
 * squares in `highlight` shaded.
 *
 * WHY THIS EXISTS. B1, B10 and B13 ship items that say "On the hundred chart,
 * what number sits directly BELOW 21?", "Ben shades 44, 54, 64 and 74 on the
 * hundred chart" and "start at 38, move down one row, then right one square" —
 * with NO figure at all. Twenty-six such items across live Level B. A child was
 * being told to read a chart that was never on the screen, and the hint said
 * "Look at the shaded squares on the chart" beside nothing. Reported by the
 * owner's six-year-old, who opened the app and could not see it; no gate could,
 * because the figure census counts `[image: …]` brackets and these items carry
 * none.
 *
 * `highlight` takes the NUMBERS a week names, not indices, so a template can
 * never shade the wrong square by an off-by-one — the mapping to a row-major
 * index happens here, once.
 */
export function hundredChart(
  opts: { start?: number; highlight?: number[]; alt: string; asserts?: FigureAssertion },
): BBFigure {
  const start = opts.start ?? 1;
  const cells = Array.from({ length: 100 }, (_, i) => String(start + i));
  const highlight = (opts.highlight ?? [])
    .map((n) => n - start)
    .filter((i) => i >= 0 && i < 100);
  return areaGrid(
    { rows: 10, cols: 10, cellLabels: cells, ...(highlight.length ? { shadedCells: highlight } : {}) },
    opts,
  );
}

/**
 * A shape or a single opening — A7's flat shapes (`rotation` is the tilted
 * square that is still a square), C22's quadrilateral families, D23's angle sum.
 *
 * The renderer CONSTRUCTS the vertices from `angles`, so the drawn figure is the
 * one the params name: 90/90/90/90 draws a true square, and a rotation moves
 * those constructed points rather than skewing them.
 */
export function shapeFigure(
  params: AngleFigureParams,
  opts: { alt: string; asserts?: FigureAssertion },
): BBFigure {
  return { type: 'angle-figure', alt: opts.alt, params, ...(opts.asserts ? { asserts: opts.asserts } : {}) };
}

/** Shorthand for the two assertions templates actually use. */
export const assertsAnswer: FigureAssertion = { equals: 'answer' };
export const assertsParam = (key: string, of?: string): FigureAssertion => ({
  equals: `param:${key}` as const,
  ...(of ? { of } : {}),
});
/**
 * "…and the quantity I mean is THIS one" — the answer assertion with an explicit
 * selector, for pictures whose default quantity is not the one the item asks for
 * (a frame's hidden run, a strip's remaining counters, the gap in a number path).
 */
export const assertsAnswerOf = (of: string): FigureAssertion => ({ of, equals: 'answer' });

// ---------------------------------------------------------------------------
// Time and money pictures — G2 (B12/B17/C18) and G3 (B16)
// ---------------------------------------------------------------------------

/** What the face shows. 'none' is the draw-the-hands page (B12/B17 Day-5). */
export type ClockHands = 'both' | 'hour' | 'minute' | 'none';

/** Where the short hand sits, in the words a child would use. */
function hourHandAlt(h: number, m: number): string {
  const here = h === 0 ? 12 : h;
  const next = here === 12 ? 1 : here + 1;
  if (m === 0) return `the short hand points straight at the ${here}`;
  if (m < 20) return `the short hand is just past the ${here}`;
  if (m <= 40) return `the short hand is between the ${here} and the ${next}`;
  return `the short hand has nearly reached the ${next}`;
}

/** Where the long hand sits — by the numeral it points at, never by minutes. */
function minuteHandAlt(m: number): string {
  if (m === 0) return 'the long hand points straight up at the 12';
  if (m % 5 === 0) return `the long hand points at the ${m / 5}`;
  const lo = Math.floor(m / 5);
  return `the long hand is between the ${lo === 0 ? 12 : lo} and the ${lo + 1}`;
}

/**
 * What a child SEES on the face — where the hands point, never what time it is.
 *
 * The alt is the picture's accessible name and, at the audio-first band, part of
 * what is read aloud. On "what time does this clock show?" the picture IS the
 * question, so an alt reading "half past three" would hand the answer to exactly
 * the child who cannot see the drawing (L33 applied to a screen reader).
 */
export function clockAlt(h: number, m: number, hands: ClockHands = 'both'): string {
  if (hands === 'none') return 'a clock face with the numbers 1 to 12 and no hands drawn yet';
  const parts = [
    ...(hands === 'both' || hands === 'hour' ? [hourHandAlt(h, m)] : []),
    ...(hands === 'both' || hands === 'minute' ? [minuteHandAlt(m)] : []),
  ];
  return `a clock face where ${parts.join(', and ')}`;
}

/**
 * Analog clock face — B12 (hour/half), B17 (quarters), C18 (to the minute).
 *
 * Built from the item's own `{h, m}`, which is also what its `answerFor`
 * recomputes the time from, so face and answer are the same two numbers. The
 * renderer drifts the hour hand with the minutes (h·30 + m·0.5), which is what
 * makes C18's "2:55 read as 3:55" visible rather than merely described.
 */
export function clock(
  time: { h: number; m: number },
  opts: {
    marks?: 'hours' | 'five' | 'minutes' | 'none';
    numerals?: boolean;
    hands?: ClockHands;
    highlight?: 'hour' | 'minute';
    alt?: string;
    asserts?: FigureAssertion;
  } = {},
): BBFigure {
  const hands = opts.hands ?? 'both';
  return {
    type: 'clock',
    alt: opts.alt ?? clockAlt(time.h, time.m, hands),
    params: {
      h: time.h,
      m: time.m,
      ...(opts.marks ? { marks: opts.marks } : {}),
      ...(opts.numerals !== undefined ? { numerals: opts.numerals } : {}),
      ...(hands === 'both' ? {} : { hands }),
      ...(opts.highlight ? { highlight: opts.highlight } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/** The denominations the coin picture can draw. */
export type CoinCents = 1 | 5 | 10 | 25 | 50 | 100;
export interface CoinEntry {
  cents: CoinCents;
  count: number;
}

const COIN_NAME: Record<CoinCents, string> = {
  1: 'penny', 5: 'nickel', 10: 'dime', 25: 'quarter', 50: 'half dollar', 100: 'dollar coin',
};

/** A denomination's name on its own: "penny", "dime". */
export function coinNoun(cents: CoinCents): string {
  return COIN_NAME[cents];
}

/** A denomination named and correctly numbered: "1 penny", "3 pennies". */
export function coinName(cents: CoinCents, count = 1): string {
  return countNoun(count, COIN_NAME[cents]);
}

/**
 * Merge repeated denominations and order them the way `CoinSetFig` lays out a
 * row: highest value first, all of a kind together (the counting order the money
 * week teaches). Doing it here means the picture and its accessible name are
 * generated from ONE list in ONE order, so they cannot describe different piles.
 */
export function normalizeCoins(coins: readonly CoinEntry[]): CoinEntry[] {
  const merged = new Map<CoinCents, number>();
  for (const c of coins) {
    if (c.count <= 0) continue;
    merged.set(c.cents, (merged.get(c.cents) ?? 0) + c.count);
  }
  return [...merged.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([cents, count]) => ({ cents, count }));
}

/**
 * "1 dime and 3 pennies" — the coins in drawing order, and never their total:
 * on "how much money is this?" the total is precisely the answer.
 */
export function coinSetAlt(coins: readonly CoinEntry[]): string {
  const parts = normalizeCoins(coins).map((c) => coinName(c.cents, c.count));
  if (parts.length === 0) return 'an empty purse';
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/**
 * A set of coins — B16's money picture, and the "3 pennies vs 1 dime" trap.
 *
 * `showValues:false` is the trap setting: real coins do not print their worth in
 * a large font, and a child who can read "10¢" off the dime is no longer being
 * asked whether more coins mean more money.
 */
export function coinSet(
  coins: readonly CoinEntry[],
  opts: {
    showValues?: boolean;
    arrangement?: 'row' | 'scatter';
    alt?: string;
    asserts?: FigureAssertion;
  } = {},
): BBFigure {
  return {
    type: 'coin-set',
    alt: opts.alt ?? coinSetAlt(coins),
    params: {
      coins: normalizeCoins(coins),
      ...(opts.showValues !== undefined ? { showValues: opts.showValues } : {}),
      ...(opts.arrangement ? { arrangement: opts.arrangement } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}
