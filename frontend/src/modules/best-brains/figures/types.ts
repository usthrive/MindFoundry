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
  /**
   * A shaded RAY (2026-11-17, E15): the line coloured from `from` to the edge,
   * with an arrow — "shade everything to the right of it". It was drawn as a hop,
   * which says "one jump", not "every number from here on".
   */
  ray?: { from: number; dir: 'right' | 'left' };
}

/** Tally marks (C7, 2026-11-17): strokes in gates of five, four upright and one across. */
export interface TallyParams {
  count: number;
}

/** A circle cut into pieces: the pizza / cake fraction model (C15, 2026-11-17). */
export interface FractionCircleParams {
  /** Relative size of each piece, in order round the circle; all equal for equal parts. */
  parts: number[];
  /** Indices of the pieces coloured in. */
  shaded?: number[];
}

/** A pictograph (C23, 2026-11-17): one row of symbols per label, and its key. */
export interface PictographParams {
  rows: Array<{ label: string; count: number }>;
  symbol: 'star' | 'circle' | 'square' | 'drop';
  /** "Each ★ stands for 10 books." */
  key: { worth: number; unit: string };
}

/** A number track (B4, 2026-11-17): numbered squares in a row — not a line of ticks. */
export interface NumberTrackParams {
  min: number;
  max: number;
  /** Squares a counter stands on. */
  counters?: number[];
  /** A flag on the square a journey ends on. */
  flag?: number;
  /** Hops from square to square. */
  hops?: Array<{ from: number; to: number }>;
}

/** A line plot (B23, 2026-11-17): one dot above a value for every thing that had it. */
export interface LinePlotParams {
  min: number;
  max: number;
  dots: Array<{ at: number; count: number }>;
  /** What one dot stands for ("pods"), written under the line. */
  label?: string;
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
  | 'block' | 'shell' | 'flower' | 'ball'
  /** 2026-11-17: C7/C8 drew bicycle wheels and chair legs as balls. */
  | 'wheel' | 'leg';

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

/** One base-ten quantity as physical pieces. */
export interface BaseTenState {
  /** Hundreds, drawn as 10×10 flats. */
  flats?: number;
  /** Tens, drawn as FUSED rods — a rod is one piece, not ten touching cubes. */
  rods: number;
  /** Loose ones cubes. */
  ones: number;
  /** Optional caption under this state ("before", "47", "Ria's"). */
  label?: string;
}

/**
 * Base-ten blocks — rods and loose cubes (B2 bundling, B14 trading, C1 place
 * value). The one thing `place-value-chart` cannot say: a chart shows the DIGITS
 * 4 and 7, this shows the four fused rods and seven loose cubes the digits are a
 * code FOR. B2's whole lesson is the moment ten ones become one ten, which is a
 * statement about the pieces and not about the notation.
 *
 * `then` exists because the authored lesson visuals are written as MOTION —
 * "ten cubes magnetize into a single rod", "ten flash and snap into a rod that
 * slides to the tens column". Nothing in this figure system animates, so the
 * honest static rendering of a change is the one a teacher draws on a
 * whiteboard: both states, with an arrow between them. The child sees what went
 * in and what came out, and can dwell on either for as long as they like —
 * which a pre-reader cannot do with a moving picture.
 */
export interface BaseTenBlocksParams {
  state: BaseTenState;
  /** A second state, drawn after the connector. */
  then?: BaseTenState;
  /** 'becomes' draws an arrow (a change); 'beside' draws a gap (a comparison). */
  connector?: 'becomes' | 'beside';
  /** Ring the pieces the lesson is about to act on. */
  highlight?: 'ones' | 'rods' | 'none';
  /** Draw labelled tens|ones columns (the E53 convention, Days 1–2). */
  showColumns?: boolean;
  /** Print the numeral each state makes. */
  showNumeral?: boolean;
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

/**
 * One token of a written mathematics line — a numeral, an operator, a word —
 * with the pen-mark a teacher would put on it while talking.
 *
 * WHY THIS PRIMITIVE EXISTS. The corpus's largest figure gap was never a shape:
 * it was the WRITING. "The carried 1 hops", "the parentheses glow", "5 − 2 = 3
 * appears under the picture" — scenes whose whole content is a line of
 * mathematics with one part emphasised. The band-A gap table asked for a
 * number-sentence primitive in the first Level-A fill (a14/a15/a17/a18) and
 * every level since has re-hit it. Marks are a teacher's pen, not animation:
 * ring what you are talking about, underline what was decided, box the blank.
 */
export interface SentenceToken {
  /** ≤ 8 characters; a numeral, operator, word, or '▢' for a blank. */
  text: string;
  mark?: 'ring' | 'underline' | 'box' | 'fade';
}

export interface MathSentenceParams {
  tokens: SentenceToken[];
  /** Optional second line under a connector; `and` stacks two peer lines (a fact family), no arrow. */
  then?: { tokens: SentenceToken[]; connector: 'becomes' | 'equals' | 'reads-as' | 'and' };
  /**
   * A written equation is SELF-AUDITED by the shape gate: when a line parses as
   * `a op b … = k` over plain numerals, a false one is refused — a lesson may
   * not put untrue mathematics on the board by accident. Error-analysis scenes
   * that show a wrong line ON PURPOSE must say so here, the same contract as
   * the verify library's wrong===correct guards: deliberate, never silent.
   */
  deliberate?: true;
}

/**
 * The vertical written algorithm as a still — the other half of the writing
 * gap. Rows are right-aligned columns of cells; '' holds a column open.
 * `carry` cells sit small above the top operand; `borrow` renders struck-out.
 * A `pointAfterCol` draws the decimal alignment line D14/E5 teach.
 */
export interface ColumnMethodParams {
  /** Right-aligned rows, top to bottom. Every row the same length. */
  rows: Array<{
    cells: string[];
    role: 'carry' | 'operand' | 'partial' | 'result';
    /** Struck through — the borrow/adjust notation. */
    struck?: number[];
  }>;
  /** Operator drawn beside the LAST operand row ('+', '−', '×'). */
  op?: '+' | '−' | '×';
  /** Draw the decimal point after this column index, aligned down all rows. */
  pointAfterCol?: number;
  /** Columns to shade — the column the say is talking about. */
  highlightCols?: number[];
  /** As on MathSentenceParams: a knowingly-wrong worked column must declare itself. */
  deliberate?: true;
}

// ---------------------------------------------------------------------------
// The figure union
/**
 * A pan balance (2026-11-17). Level B week 6 — "the balanced equal sign", whose
 * whole anchor is the balance scale — asked every question about "the left pan of
 * a balance … one closed bag … the bar sits level" and drew a BAR MODEL: boxes like
 * tens and ones, one pan only. A child told to look at a balance must see one: a
 * beam, two pans, the heaps on each, any closed bag (never its contents), and the
 * bar level or tipped exactly as the words say.
 */
export interface BalancePan {
  /** Heaps of things on the pan, each drawn as a pile with its count (see `countable`). */
  heaps?: number[];
  /** Closed bags — an amount nobody can see. Drawn as a sack with "?". Never the answer. */
  bags?: number;
  /**
   * Labelled weights ("40 g"), each a fixed-size weight block — the known side
   * of a balance in grams (E13, E15). Their numbers count toward the pan's sum.
   */
  weights?: number[];
  /**
   * Named things whose weight is not given (2026-11-17): a stone or a balloon
   * weighed in blocks (A20), a sealed box or identical tins (E13, E15). A box and
   * a tin are sealed, so they carry "?"; a stone and a balloon do not. Fixed size —
   * the drawing never measures them.
   */
  objects?: BalanceObject[];
}

export type BalanceObject = 'stone' | 'balloon' | 'box' | 'tin';

export interface BalanceParams {
  left: BalancePan;
  right: BalancePan;
  /** How the bar sits: level, or the heavier side hanging lower. */
  tilt: 'level' | 'left-down' | 'right-down';
  /** The thing being counted (a dot by default; 'block' draws countable squares — A20). */
  icon?: CounterIcon;
  /** The unit written on each weight block ("g"); none for bare numbers (E15). */
  unit?: string;
  /** Write each heap's count under it. Default true; false for "which pan is fuller?" without numbers. */
  showCounts?: boolean;
  /** What hides the unknown amount, as the words name it: a closed bag (default) or a covered dish (B7). */
  cover?: 'bag' | 'dish';
  /**
   * Draw each heap as COUNTABLE dots. Default false: a heap is one solid pile, the
   * same size whatever it holds, with its number written under it.
   *
   * WHY the default. On an assessed page the givens are already in the words, and
   * countable dots on both pans hand over the sum — "7, 4 and 5 against 12 and a
   * bag" becomes sixteen dots against twelve, counted, never added (L33: what does
   * this picture let the child skip?). So dots belong only where the answer is
   * already on the page: the lesson script and the modeled / completion guided
   * examples, where watching the heaps balance IS the teaching.
   * `bb-figure-kind-test` enforces the split.
   */
  countable?: boolean;
}

// ---------------------------------------------------------------------------

export type BBFigureType =
  | 'number-line'
  | 'bar-model'
  | 'area-grid'
  | 'ten-frame'
  | 'counters'
  | 'place-value-chart'
  | 'base-ten-blocks'
  | 'clock'
  | 'coin-set'
  | 'coordinate-grid'
  | 'angle-figure'
  | 'math-sentence'
  | 'column-method'
  | 'balance'
  | 'tally'
  | 'fraction-circle'
  | 'pictograph'
  | 'number-track'
  | 'line-plot';

export const FIGURE_TYPES: readonly BBFigureType[] = [
  'number-line', 'bar-model', 'area-grid', 'ten-frame', 'counters',
  'place-value-chart', 'base-ten-blocks', 'clock', 'coin-set', 'coordinate-grid', 'angle-figure',
  'math-sentence', 'column-method', 'balance',
  'tally', 'fraction-circle', 'pictograph', 'number-track', 'line-plot',
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
  /**
   * What the READ-ALOUD says about the picture, when it must say less than `alt`
   * (2026-11-17). Default: `alt`. A data display's accessible name lists every
   * value — a screen-reader child has no other way to the data — but the same
   * words spoken in front of "How many wrens does the graph show?" read the
   * answer out (B23: the check screen autoplays at bands A and B). `spoken`
   * names the display and its categories, never its values. See `figureScene`.
   */
  spoken?: string;
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
  | (FigureBase & { type: 'base-ten-blocks'; params: BaseTenBlocksParams })
  | (FigureBase & { type: 'clock'; params: ClockParams })
  | (FigureBase & { type: 'coin-set'; params: CoinSetParams })
  | (FigureBase & { type: 'coordinate-grid'; params: CoordinateGridParams })
  | (FigureBase & { type: 'angle-figure'; params: AngleFigureParams })
  | (FigureBase & { type: 'math-sentence'; params: MathSentenceParams })
  | (FigureBase & { type: 'column-method'; params: ColumnMethodParams })
  | (FigureBase & { type: 'balance'; params: BalanceParams })
  | (FigureBase & { type: 'tally'; params: TallyParams })
  | (FigureBase & { type: 'fraction-circle'; params: FractionCircleParams })
  | (FigureBase & { type: 'pictograph'; params: PictographParams })
  | (FigureBase & { type: 'number-track'; params: NumberTrackParams })
  | (FigureBase & { type: 'line-plot'; params: LinePlotParams });

/** Narrow a figure to one type (renderers take the concrete params shape). */
export type FigureOf<T extends BBFigureType> = Extract<BBFigure, { type: T }>;
