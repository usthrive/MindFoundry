/**
 * Best Brains figure schema (B1.0 — the figure renderer).
 *
 * WHY THIS EXISTS (LEARNINGS L27): the curriculum is "concrete model first" and
 * every figure in it was a *stage direction* — 76/76 lesson-script `visual`
 * fields rendered as italic prose, 0/96 guided examples had a visual slot at
 * all, and Level A printed the literal characters `[image: 3 acorns in a row]`
 * to a pre-reader. A schema field whose only consumer is a placeholder is not
 * implemented. This module is the data half of the fix; `components/figures/`
 * draws it.
 *
 * THE LAW (the `answerFor` discipline applied to pictures): a figure is built
 * from the item's OWN drawn values, so it cannot disagree with its answer. That
 * guarantee is structural where a generator builds the figure, and CHECKED by
 * QG-13, which recomputes the quantity the picture asserts and compares it with
 * the item's answer or generator params — exactly as QG-5 recomputes answers.
 *
 * Rendering vs identity (L29): a figure is PRESENTATION. `answer.value` and
 * `generator.params` stay canonical; `prompt` keeps its authored `[image: …]`
 * direction (which is what QG-1/QG-4 sign for freshness) and the UI strips it
 * from the visible line while feeding it to the picture's accessible name.
 */

// ---------------------------------------------------------------------------
// Per-type parameter shapes
// ---------------------------------------------------------------------------

/** Position style for a marked value. */
export type MarkStyle = 'point' | 'open' | 'flag' | 'unknown';

/**
 * Number line with an optional partition — the spine of fraction equivalence
 * (D9's "the mark does not move when the partition changes"), count-on/back
 * hops (A17, B4), rounding neighbourhoods (C2) and integer order (E6).
 */
export interface NumberLineParams {
  min: number;
  max: number;
  /** Major tick interval in whole units. Default 1. */
  step?: number;
  /** Sub-divide each major interval into this many equal parts. Default 1. */
  partition?: number;
  /** Which ticks carry a printed label. Default 'majors'. */
  labels?: 'all' | 'majors' | 'ends' | 'none';
  /** Label sub-ticks as n/partition rather than as decimals. Default 'number'. */
  labelAs?: 'number' | 'fraction';
  marks?: Array<{ at: number; label?: string; style?: MarkStyle }>;
  hops?: Array<{ from: number; to: number; label?: string }>;
}

export type BarFill = 'solid' | 'soft' | 'none' | 'hatch';

/**
 * Bar / tape model — the D4 comparison anchor ("times as many" stacks whole
 * bars), part-whole and missing-addend (B7), fraction-of-a-set (C17).
 */
export interface BarModelParams {
  bars: Array<{
    label?: string;
    segments: Array<{ value: number; label?: string; fill?: BarFill }>;
    /** Brace label printed over this bar; '?' renders as the unknown. */
    total?: string;
  }>;
  /** Value that spans the full drawing width, so bars are mutually to scale. */
  scaleMax?: number;
  /** A brace spanning every bar (the combined total). */
  brace?: { label: string };
}

/**
 * Area / array grid — the four-rooms multiplication model (D8), fraction of a
 * fraction (D18, double-shaded), area vs perimeter (C21), arrays (B20).
 */
export interface AreaGridParams {
  rows: number;
  cols: number;
  /** Shade the first n rows (and/or cols); their overlap is double-shaded. */
  shadedRows?: number;
  shadedCols?: number;
  /** Or shade an arbitrary cell count, filled row-major. */
  shaded?: number;
  /**
   * Shade SPECIFIC cells by 0-based row-major index — which `shaded` cannot
   * express, because it fills a prefix.
   *
   * This exists for the hundred chart. B1/B10/B13 ship items that say "Ben
   * shades 44, 54, 64 and 74 on the hundred chart" and "start at 38, move down
   * one row, then right one square", and the squares they name are scattered,
   * never a prefix. Before this the chart could not be drawn at all, so those
   * pages named a chart the child was never shown — found by a real
   * six-year-old opening the app, not by any gate.
   *
   * Ignored when absent, so every existing area-grid is byte-identical.
   */
  shadedCells?: number[];
  /** Group labels down the side / across the top ("20", "6" for the rooms). */
  rowLabels?: string[];
  colLabels?: string[];
  /** Text inside each room, row-major (partial products). */
  cellLabels?: string[];
  /** Print row × col counts beside the grid. */
  showCounts?: boolean;
}

export type CounterIcon =
  | 'dot' | 'star' | 'apple' | 'duck' | 'fish' | 'leaf'
  | 'block' | 'shell' | 'flower' | 'ball';

/** Ten-frame (or five-frame / double frame) — the Level A + B number anchor. */
export interface TenFrameParams {
  /** 1 or 2 frames. Default 1. */
  frames?: number;
  /** Cells per frame. 10, or 5 for a five-frame. Default 10. */
  size?: number;
  filled: number;
  /** Counters under a cover — the partners-of-N hiding game (A12/A13). */
  hidden?: number;
  /**
   * How the hidden counters are covered. 'cells' gives each one its own cover,
   * which is countable — fine as a band-A scaffold, fatal when the item asks
   * "how many are hiding?", since the child can count the covers instead of
   * reasoning about the partner. 'single' draws one continuous cover with one
   * '?'. Default 'cells'.
   */
  coverStyle?: 'cells' | 'single';
  icon?: CounterIcon;
}

/**
 * Loose counter groups — counting arrangements (A1/A2), join/take-away story
 * pictures (A14/A16), the scattered-vs-row conservation trap (A1/A5).
 */
export interface CountersParams {
  /**
   * `spread` multiplies the SPACING of one row without changing counter size,
   * and it exists for exactly one lesson: the A5 conservation trap, "a long row
   * of 5 beside a tight row of 6 — which is MORE?".
   *
   * Before it, `compare` derived a single pitch from the longest row and started
   * every row at the same left edge, so inside one figure more counters ALWAYS
   * occupied more width — which made the trap structurally undrawable even
   * though this file and `CountersFig` both advertised it. A1/A2 worked around
   * it across two script figures; A5, whose whole recipe IS the trap, could not.
   *
   * The counters stay the SAME SIZE in every row (`r` is derived from the
   * unscaled pitch). Only the gaps change. That distinction is the pedagogy: the
   * misconception under test is "it takes up more room, so it's more", and
   * growing the counters themselves would pose a different — and dishonest —
   * illusion. Default 1 in every row, which reproduces the previous layout
   * exactly, so no existing figure moves.
   */
  groups: Array<{ count: number; icon?: CounterIcon; label?: string; spread?: number }>;
  /** Default 'row'. 'scatter' is deterministic, not random. */
  arrangement?: 'row' | 'rows' | 'scatter' | 'ring' | 'stack';
  /** How the groups relate: a join plus, a remove slash, or a comparison rule. */
  relation?: 'none' | 'join' | 'remove' | 'compare';
  /** Counters drawn crossed out (taken away) at the end of the last group. */
  crossedOut?: number;
  /**
   * Draw the one-to-one threads between compared rows. DEFAULT FALSE, and that
   * default is pedagogy, not taste: pairing the rows performs the matching the
   * child is being asked to perform. Turn it on to MODEL the strategy in a
   * lesson script or a worked example; leave it off on anything that assesses.
   */
  showPairs?: boolean;
  /**
   * Ring the unmatched leftovers. DEFAULT FALSE — the ring points straight at
   * the answer to "how many more?".
   */
  markExtra?: boolean;
}

export type PlaceName =
  | 'millions' | 'hundred-thousands' | 'ten-thousands' | 'thousands'
  | 'hundreds' | 'tens' | 'ones'
  | 'tenths' | 'hundredths' | 'thousandths';

/** Place-value chart — D1/D13/C1/B2, and the periods bands D1 teaches by name. */
export interface PlaceValueChartParams {
  /** The number as digits, most significant first; may carry one '.'. */
  digits: string;
  /** Explicit column list; default derived from the digit string. */
  places?: PlaceName[];
  highlight?: PlaceName;
  /** Print each digit's VALUE under its column (face vs value, C1). */
  showValues?: boolean;
  /** Draw the thousands-period bands (D1 reads big numbers in threes). */
  showPeriods?: boolean;
}

/** Analog clock — B12 (hour/half), B17 (quarters), C18 (to the minute). */
export interface ClockParams {
  /** 1–12 (0 accepted and shown as 12). */
  h: number;
  /** 0–59. */
  m: number;
  /** Tick granularity drawn on the face. Default 'five'. */
  marks?: 'hours' | 'five' | 'minutes' | 'none';
  /** Print the 1–12 numerals. Default true. */
  numerals?: boolean;
  /** 'none' = the draw-the-hands task (B12/B17 Day-5). Default 'both'. */
  hands?: 'both' | 'hour' | 'minute' | 'none';
  /** Emphasise one hand — the hand-swap trap lives here. */
  highlight?: 'hour' | 'minute';
}

/** Coin set — B16 money, and the "more coins ≠ more money" discrimination. */
export interface CoinSetParams {
  coins: Array<{ cents: 1 | 5 | 10 | 25 | 50 | 100; count: number }>;
  /** Print each coin's value on its face. Default true. */
  showValues?: boolean;
  arrangement?: 'row' | 'scatter';
}

/** Coordinate grid — D22 (first quadrant), E7 (four quadrants, reflections). */
export interface CoordinateGridParams {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  /** Gridline interval. Default 1. */
  step?: number;
  points?: Array<{ x: number; y: number; label?: string; style?: MarkStyle }>;
  segments?: Array<{ from: [number, number]; to: [number, number]; label?: string }>;
  /** Print the axis number labels. Default true. */
  showAxisLabels?: boolean;
}

/**
 * Angle and shape figure — D23 (angle sum, classify by the LARGEST angle),
 * C22 (quadrilateral families), A7 (the rotated square that is still a square).
 */
export interface AngleFigureParams {
  shape: 'angle' | 'triangle' | 'quadrilateral' | 'polygon';
  /** For 'angle': the opening in degrees. */
  degrees?: number;
  /**
   * Interior angles in degrees in drawing order; exactly one may be `null`,
   * which draws as the unknown the item asks for.
   */
  angles?: Array<number | null>;
  /** Regular polygon side count when shape==='polygon'. Default 5. */
  sides?: number;
  /** Draw the angle arcs. Default true. */
  showArcs?: boolean;
  /** Draw the square corner mark on any 90° angle. Default true. */
  showRightMarks?: boolean;
  /** Vertex labels in drawing order. */
  labels?: string[];
  /** Tick counts per side showing equal sides (classification evidence). */
  sideMarks?: number[];
  /** Whole-figure rotation in degrees — the "tilted square" trap. */
  rotation?: number;
}

// ---------------------------------------------------------------------------
// The figure union
// ---------------------------------------------------------------------------

export type BBFigureType =
  | 'number-line'
  | 'bar-model'
  | 'area-grid'
  | 'ten-frame'
  | 'counters'
  | 'place-value-chart'
  | 'clock'
  | 'coin-set'
  | 'coordinate-grid'
  | 'angle-figure';

export const FIGURE_TYPES: readonly BBFigureType[] = [
  'number-line', 'bar-model', 'area-grid', 'ten-frame', 'counters',
  'place-value-chart', 'clock', 'coin-set', 'coordinate-grid', 'angle-figure',
] as const;

/**
 * What the picture claims, so QG-13 can prove it cannot contradict the item.
 *
 * `of` names the quantity inside the picture (type-specific selector, each with
 * a documented default — see `figureValue`); `equals` names the canonical thing
 * it must match: the item's own answer, or one of its generator params.
 *
 * A figure with no assertion is legal — many pictures are context, not claim —
 * but a figure that pictures the answer SHOULD carry one.
 */
export interface FigureAssertion {
  of?: string;
  equals: 'answer' | `param:${string}`;
}

interface FigureBase {
  /**
   * Plain-language description of the picture. REQUIRED — it is the SVG's
   * accessible name and (band A, audio-first) part of what is read aloud.
   * Never a stage direction to an artist; write what a child would see.
   */
  alt: string;
  /** Optional printed caption. Never load-bearing: band A cannot read it. */
  caption?: string;
  asserts?: FigureAssertion;
}

export type BBFigure =
  | (FigureBase & { type: 'number-line'; params: NumberLineParams })
  | (FigureBase & { type: 'bar-model'; params: BarModelParams })
  | (FigureBase & { type: 'area-grid'; params: AreaGridParams })
  | (FigureBase & { type: 'ten-frame'; params: TenFrameParams })
  | (FigureBase & { type: 'counters'; params: CountersParams })
  | (FigureBase & { type: 'place-value-chart'; params: PlaceValueChartParams })
  | (FigureBase & { type: 'clock'; params: ClockParams })
  | (FigureBase & { type: 'coin-set'; params: CoinSetParams })
  | (FigureBase & { type: 'coordinate-grid'; params: CoordinateGridParams })
  | (FigureBase & { type: 'angle-figure'; params: AngleFigureParams });

/** Narrow a figure to one type (renderers take the concrete params shape). */
export type FigureOf<T extends BBFigureType> = Extract<BBFigure, { type: T }>;
