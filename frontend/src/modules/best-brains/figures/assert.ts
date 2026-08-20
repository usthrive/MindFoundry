/**
 * Figure truth — the `answerFor` discipline applied to pictures (B1.0).
 *
 * Two independent guarantees, in the L28 order (library first, scan second):
 *
 *  1. `checkFigureShape` — the picture is INTERNALLY honest: a mark sits inside
 *     its own number line, a shaded count fits its grid, a triangle's angles
 *     sum to 180°, a clock reads a real time. A figure that fails this draws a
 *     lie regardless of what item it hangs on.
 *
 *  2. `figureValue` — the quantity the picture ASSERTS, recomputed from the
 *     figure's own params. QG-13 compares it with the item's canonical
 *     `answer.value` / `generator.params`, so a figure cannot contradict the
 *     answer it illustrates. This is the same move QG-5 makes for answers and
 *     QG-11 makes for embedded claims.
 *
 * Both are pure and dependency-free so the validator, the generator library and
 * the React renderers can all use them.
 */

import type { BBFigure } from './types';

// ---------------------------------------------------------------------------
// Small numeric helpers (kept local: this module must stay dependency-free)
// ---------------------------------------------------------------------------

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

/** Exact-ish rational rendering of `v` in `d`ths, reduced. */
function asFraction(v: number, d: number): string {
  const n = Math.round(v * d);
  if (n % d === 0) return String(n / d);
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}

function isInt(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n);
}

function isNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

function withCommas(digits: string): string {
  const [whole, frac] = digits.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac === undefined ? grouped : `${grouped}.${frac}`;
}

// ---------------------------------------------------------------------------
// 1. Well-formedness — the picture cannot draw an impossibility
// ---------------------------------------------------------------------------

/** Human-readable problems with the figure itself; empty array = well-formed. */
export function checkFigureShape(fig: BBFigure): string[] {
  const e: string[] = [];
  const bad = (m: string) => e.push(m);

  if (!fig.alt || !fig.alt.trim()) bad('alt is required — it is the picture\'s accessible name');
  if (fig.asserts && !fig.asserts.equals) bad('asserts.equals is required when asserts is present');
  if (fig.asserts && !/^(answer|param:.+)$/.test(fig.asserts.equals)) {
    bad(`asserts.equals "${fig.asserts.equals}" must be "answer" or "param:<key>"`);
  }

  switch (fig.type) {
    case 'number-line': {
      const p = fig.params;
      if (!isNum(p.min) || !isNum(p.max)) bad('min and max must be finite numbers');
      else if (p.max <= p.min) bad(`max (${p.max}) must exceed min (${p.min})`);
      if (p.step !== undefined && (!isNum(p.step) || p.step <= 0)) bad('step must be > 0');
      if (p.partition !== undefined && (!isInt(p.partition) || p.partition < 1 || p.partition > 24)) {
        bad('partition must be a whole number 1–24');
      }
      for (const m of p.marks ?? []) {
        if (!isNum(m.at)) bad('a mark has a non-numeric position');
        else if (m.at < p.min - 1e-9 || m.at > p.max + 1e-9) bad(`mark at ${m.at} falls outside the line ${p.min}–${p.max}`);
      }
      for (const h of p.hops ?? []) {
        if (h.from < p.min - 1e-9 || h.from > p.max + 1e-9 || h.to < p.min - 1e-9 || h.to > p.max + 1e-9) {
          bad(`hop ${h.from}→${h.to} falls outside the line ${p.min}–${p.max}`);
        }
      }
      break;
    }
    case 'bar-model': {
      const p = fig.params;
      if (!p.bars?.length) bad('bar-model needs at least one bar');
      p.bars?.forEach((b, i) => {
        if (!b.segments?.length) bad(`bar ${i} has no segments`);
        b.segments?.forEach((s, j) => {
          if (!isNum(s.value) || s.value < 0) bad(`bar ${i} segment ${j} has a negative or non-numeric value`);
        });
      });
      if (p.scaleMax !== undefined) {
        const widest = Math.max(...(p.bars ?? []).map((b) => b.segments.reduce((a, s) => a + (s.value || 0), 0)), 0);
        if (p.scaleMax + 1e-9 < widest) bad(`scaleMax ${p.scaleMax} is smaller than the widest bar (${widest})`);
      }
      break;
    }
    case 'area-grid': {
      const p = fig.params;
      if (!isInt(p.rows) || p.rows < 1 || p.rows > 40) bad('rows must be a whole number 1–40');
      if (!isInt(p.cols) || p.cols < 1 || p.cols > 40) bad('cols must be a whole number 1–40');
      if (p.shadedRows !== undefined && (p.shadedRows < 0 || p.shadedRows > p.rows)) bad(`shadedRows ${p.shadedRows} exceeds rows ${p.rows}`);
      if (p.shadedCols !== undefined && (p.shadedCols < 0 || p.shadedCols > p.cols)) bad(`shadedCols ${p.shadedCols} exceeds cols ${p.cols}`);
      if (p.shaded !== undefined && (p.shaded < 0 || p.shaded > p.rows * p.cols)) bad(`shaded ${p.shaded} exceeds the ${p.rows * p.cols} cells`);
      if (p.rowLabels && p.rowLabels.length !== p.rows) bad(`rowLabels has ${p.rowLabels.length} entries for ${p.rows} rows`);
      if (p.colLabels && p.colLabels.length !== p.cols) bad(`colLabels has ${p.colLabels.length} entries for ${p.cols} cols`);
      if (p.cellLabels && p.cellLabels.length !== p.rows * p.cols) {
        bad(`cellLabels has ${p.cellLabels.length} entries for ${p.rows * p.cols} cells`);
      }
      break;
    }
    case 'ten-frame': {
      const p = fig.params;
      const size = p.size ?? 10;
      const frames = p.frames ?? 1;
      if (size !== 5 && size !== 10) bad('ten-frame size must be 5 or 10');
      if (!isInt(frames) || frames < 1 || frames > 2) bad('frames must be 1 or 2');
      const cap = size * frames;
      if (!isInt(p.filled) || p.filled < 0) bad('filled must be a whole number ≥ 0');
      else if (p.filled + (p.hidden ?? 0) > cap) bad(`filled+hidden (${p.filled + (p.hidden ?? 0)}) exceeds the ${cap} cells`);
      if (p.hidden !== undefined && (!isInt(p.hidden) || p.hidden < 0)) bad('hidden must be a whole number ≥ 0');
      break;
    }
    case 'counters': {
      const p = fig.params;
      if (!p.groups?.length) bad('counters needs at least one group');
      let total = 0;
      p.groups?.forEach((g, i) => {
        if (!isInt(g.count) || g.count < 0 || g.count > 30) bad(`group ${i} count must be a whole number 0–30`);
        else total += g.count;
      });
      if (p.crossedOut !== undefined && (p.crossedOut < 0 || p.crossedOut > total)) {
        bad(`crossedOut ${p.crossedOut} exceeds the ${total} counters drawn`);
      }
      break;
    }
    case 'place-value-chart': {
      const p = fig.params;
      if (!/^\d+(\.\d+)?$/.test(p.digits ?? '')) bad(`digits "${p.digits}" must be a plain numeral (no separators)`);
      else {
        const count = p.digits.replace('.', '').length;
        if (p.places && p.places.length !== count) bad(`places has ${p.places.length} entries for ${count} digits`);
        if (count > 10) bad('place-value-chart supports at most 10 digit columns');
      }
      if (p.highlight && p.places && !p.places.includes(p.highlight)) bad(`highlight "${p.highlight}" is not one of the chart's places`);
      break;
    }
    case 'base-ten-blocks': {
      const p = fig.params;
      for (const [name, s] of [['state', p.state], ['then', p.then]] as const) {
        if (!s) continue;
        if (!isInt(s.rods) || s.rods < 0) bad(`${name}.rods must be a whole number ≥ 0`);
        if (!isInt(s.ones) || s.ones < 0) bad(`${name}.ones must be a whole number ≥ 0`);
        if (s.flats !== undefined && (!isInt(s.flats) || s.flats < 0)) bad(`${name}.flats must be a whole number ≥ 0`);
        // A drawing is bounded by the page, not by arithmetic.
        if (s.rods > 12) bad(`${name}.rods ${s.rods} will not fit the figure width`);
        if (s.ones > 20) bad(`${name}.ones ${s.ones} will not fit the figure width`);
      }
      // 'becomes' asserts a REGROUPING, and a regrouping conserves the quantity.
      // A picture claiming ten ones become two tens would teach the opposite of
      // the lesson, so it is a shape error rather than a matter of taste.
      if (p.then && (p.connector ?? 'becomes') === 'becomes') {
        const before = (p.state.flats ?? 0) * 100 + p.state.rods * 10 + p.state.ones;
        const after = (p.then.flats ?? 0) * 100 + p.then.rods * 10 + p.then.ones;
        if (before !== after) bad(`'becomes' must conserve the quantity: ${before} → ${after}`);
      }
      break;
    }
    case 'clock': {
      const p = fig.params;
      if (!isInt(p.h) || p.h < 0 || p.h > 12) bad('h must be a whole number 0–12');
      if (!isInt(p.m) || p.m < 0 || p.m > 59) bad('m must be a whole number 0–59');
      break;
    }
    case 'coin-set': {
      const p = fig.params;
      if (!p.coins?.length) bad('coin-set needs at least one coin entry');
      let n = 0;
      p.coins?.forEach((c, i) => {
        if (![1, 5, 10, 25, 50, 100].includes(c.cents)) bad(`coin ${i} has a non-existent denomination ${c.cents}¢`);
        if (!isInt(c.count) || c.count < 1) bad(`coin ${i} count must be a whole number ≥ 1`);
        else n += c.count;
      });
      if (n > 20) bad(`${n} coins is more than a child can count at a glance (max 20)`);
      break;
    }
    case 'coordinate-grid': {
      const p = fig.params;
      if (p.xMax <= p.xMin) bad(`xMax (${p.xMax}) must exceed xMin (${p.xMin})`);
      if (p.yMax <= p.yMin) bad(`yMax (${p.yMax}) must exceed yMin (${p.yMin})`);
      if (p.step !== undefined && (!isNum(p.step) || p.step <= 0)) bad('step must be > 0');
      for (const pt of p.points ?? []) {
        if (pt.x < p.xMin || pt.x > p.xMax || pt.y < p.yMin || pt.y > p.yMax) {
          bad(`point (${pt.x},${pt.y}) falls outside the grid`);
        }
      }
      for (const s of p.segments ?? []) {
        for (const [x, y] of [s.from, s.to]) {
          if (x < p.xMin || x > p.xMax || y < p.yMin || y > p.yMax) bad(`segment endpoint (${x},${y}) falls outside the grid`);
        }
      }
      break;
    }
    case 'angle-figure': {
      const p = fig.params;
      if (p.degrees !== undefined && (p.degrees <= 0 || p.degrees >= 360)) bad(`degrees ${p.degrees} must be between 0 and 360`);
      if (p.shape === 'angle' && p.degrees === undefined) bad("shape 'angle' needs `degrees`");
      const angles = p.angles;
      if (angles) {
        const unknowns = angles.filter((a) => a === null).length;
        if (unknowns > 1) bad('at most one angle may be the unknown (null)');
        const known = angles.filter((a): a is number => a !== null);
        if (known.some((a) => a <= 0 || a >= 180)) bad('every drawn interior angle must be strictly between 0° and 180°');
        // The picture may not lie about the angle sum it is used to teach.
        const expected = p.shape === 'triangle' ? 180 : p.shape === 'quadrilateral' ? 360 : null;
        if (expected !== null) {
          const want = p.shape === 'triangle' ? 3 : 4;
          if (angles.length !== want) bad(`${p.shape} needs exactly ${want} angles, got ${angles.length}`);
          else if (unknowns === 0 && Math.abs(known.reduce((a, b) => a + b, 0) - expected) > 0.5) {
            bad(`${p.shape} angles sum to ${known.reduce((a, b) => a + b, 0)}°, not ${expected}° — the figure is impossible`);
          } else if (unknowns === 1 && known.reduce((a, b) => a + b, 0) >= expected) {
            bad(`the known angles already total ${known.reduce((a, b) => a + b, 0)}° — no room for the unknown in a ${p.shape}`);
          }
        }
      }
      if (p.shape === 'polygon' && p.sides !== undefined && (!isInt(p.sides) || p.sides < 3 || p.sides > 12)) {
        bad('polygon sides must be a whole number 3–12');
      }
      if (p.sideMarks && p.angles && p.sideMarks.length !== p.angles.length) {
        bad(`sideMarks has ${p.sideMarks.length} entries for ${p.angles.length} sides`);
      }
      break;
    }
  }
  return e;
}

// ---------------------------------------------------------------------------
// 2. The asserted quantity — recomputed from the figure's own params
// ---------------------------------------------------------------------------

/**
 * The quantity the picture claims, as every surface form that legitimately
 * expresses it (so a coin set may match "125", "$1.25" or "125¢"). QG-13 passes
 * when ANY form matches ANY accepted answer form — this is a CONTRADICTION
 * detector, so it is deliberately generous about punctuation and strict about
 * value.
 *
 * Selectors (`asserts.of`), default first:
 *   number-line       mark | mark:k
 *   bar-model         total | bar:k
 *   area-grid         shaded | cells | shaded-fraction
 *   ten-frame         filled | hidden | empty
 *   counters          count | group:k | remaining
 *   place-value-chart value | place:<name>
 *   clock             time | minutes-past
 *   coin-set          cents | count
 *   coordinate-grid   point | point:k
 *   angle-figure      angle | sum | missing
 */
export function figureValue(fig: BBFigure, selector?: string): string[] | null {
  const of = selector ?? fig.asserts?.of;
  // An UNRECOGNISED selector returns null rather than falling through to the
  // default. A typo must fail loudly: silently auditing a different quantity
  // than the author asked for is the figure twin of an unregistered templateId
  // skipping the QG-5 audit.
  if (of !== undefined && !SELECTORS[fig.type].some((re) => re.test(of))) return null;
  const idx = (prefix: string): number | null => {
    if (!of || !of.startsWith(`${prefix}:`)) return null;
    const n = Number(of.slice(prefix.length + 1));
    return Number.isInteger(n) ? n : null;
  };

  switch (fig.type) {
    case 'number-line': {
      const p = fig.params;
      const k = idx('mark') ?? 0;
      const m = (p.marks ?? [])[k];
      if (!m) return null;
      const d = p.partition ?? 1;
      return d > 1 ? [asFraction(m.at, d), String(m.at)] : [String(m.at)];
    }
    case 'bar-model': {
      const p = fig.params;
      const sum = (b: { segments: Array<{ value: number }> }) => b.segments.reduce((a, s) => a + s.value, 0);
      const k = idx('bar');
      if (k !== null) return p.bars[k] ? [String(sum(p.bars[k]))] : null;
      return [String(p.bars.reduce((a, b) => a + sum(b), 0))];
    }
    case 'area-grid': {
      const p = fig.params;
      const cells = p.rows * p.cols;
      const shaded = p.shaded ?? (p.shadedRows !== undefined || p.shadedCols !== undefined
        ? (p.shadedRows ?? p.rows) * (p.shadedCols ?? p.cols)
        : null);
      if (of === 'cells') return [String(cells)];
      if (of === 'shaded-fraction') {
        if (shaded === null) return null;
        const g = gcd(shaded, cells);
        return [`${shaded}/${cells}`, `${shaded / g}/${cells / g}`];
      }
      return shaded === null ? null : [String(shaded)];
    }
    case 'ten-frame': {
      const p = fig.params;
      const cap = (p.size ?? 10) * (p.frames ?? 1);
      if (of === 'hidden') return p.hidden === undefined ? null : [String(p.hidden)];
      if (of === 'empty') return [String(cap - p.filled - (p.hidden ?? 0))];
      return [String(p.filled)];
    }
    case 'counters': {
      const p = fig.params;
      const total = p.groups.reduce((a, g) => a + g.count, 0);
      const k = idx('group');
      if (k !== null) return p.groups[k] ? [String(p.groups[k].count)] : null;
      if (of === 'remaining') return [String(total - (p.crossedOut ?? 0))];
      return [String(total)];
    }
    case 'place-value-chart': {
      const p = fig.params;
      if (of?.startsWith('place:')) {
        const want = of.slice('place:'.length);
        const places = p.places ?? defaultPlaces(p.digits);
        const i = places.indexOf(want as (typeof places)[number]);
        if (i < 0) return null;
        const digit = Number(p.digits.replace('.', '')[i]);
        const worth = PLACE_WORTH[places[i]];
        const v = digit * worth;
        return [String(v), withCommas(String(v))];
      }
      return [p.digits, withCommas(p.digits)];
    }
    case 'base-ten-blocks': {
      const p = fig.params;
      const val = (s: typeof p.state) => (s.flats ?? 0) * 100 + s.rods * 10 + s.ones;
      // Default is what the child ends up with, which is what an item asks for.
      if (of === 'before') return [String(val(p.state))];
      if (of === 'rods') return [String((p.then ?? p.state).rods)];
      if (of === 'ones') return [String((p.then ?? p.state).ones)];
      return [String(val(p.then ?? p.state))];
    }
    case 'clock': {
      const p = fig.params;
      const h = p.h === 0 ? 12 : p.h;
      if (of === 'minutes-past') return [String(p.m)];
      return [`${h}:${String(p.m).padStart(2, '0')}`];
    }
    case 'coin-set': {
      const p = fig.params;
      if (of === 'count') return [String(p.coins.reduce((a, c) => a + c.count, 0))];
      const cents = p.coins.reduce((a, c) => a + c.cents * c.count, 0);
      const forms = [String(cents), `${cents}¢`];
      const dollars = `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
      forms.push(`$${dollars}`, dollars);
      if (cents % 100 === 0) forms.push(`$${cents / 100}`, String(cents / 100));
      return forms;
    }
    case 'coordinate-grid': {
      const p = fig.params;
      const k = idx('point') ?? 0;
      const pt = (p.points ?? [])[k];
      return pt ? [`(${pt.x},${pt.y})`, `(${pt.x}, ${pt.y})`] : null;
    }
    case 'angle-figure': {
      const p = fig.params;
      if (of === 'sum' && p.angles) {
        const known = p.angles.filter((a): a is number => a !== null);
        if (known.length !== p.angles.length) return null;
        return [String(known.reduce((a, b) => a + b, 0)), `${known.reduce((a, b) => a + b, 0)}°`];
      }
      // Default: a plain opening reads its `degrees`; a polygon with one unknown
      // vertex reads the angle the child is being asked to find.
      if (of === 'missing' || ((of === undefined || of === 'angle') && p.degrees === undefined)) {
        if (!p.angles) return null;
        const target = p.shape === 'triangle' ? 180 : p.shape === 'quadrilateral' ? 360 : null;
        if (target === null) return null;
        const known = p.angles.filter((a): a is number => a !== null);
        if (known.length !== p.angles.length - 1) return null;
        const miss = target - known.reduce((a, b) => a + b, 0);
        return [String(miss), `${miss}°`];
      }
      if (p.degrees !== undefined) return [String(p.degrees), `${p.degrees}°`];
      return null;
    }
  }
}

/** The selectors each figure type answers to; anything else is an authoring typo. */
const SELECTORS: Record<BBFigure['type'], RegExp[]> = {
  'number-line': [/^mark$/, /^mark:\d+$/],
  'bar-model': [/^total$/, /^bar:\d+$/],
  'area-grid': [/^shaded$/, /^cells$/, /^shaded-fraction$/],
  'ten-frame': [/^filled$/, /^hidden$/, /^empty$/],
  counters: [/^count$/, /^remaining$/, /^group:\d+$/],
  'place-value-chart': [/^value$/, /^place:[a-z-]+$/],
  'base-ten-blocks': [/^value$/, /^before$/, /^rods$/, /^ones$/],
  clock: [/^time$/, /^minutes-past$/],
  'coin-set': [/^cents$/, /^count$/],
  'coordinate-grid': [/^point$/, /^point:\d+$/],
  'angle-figure': [/^angle$/, /^sum$/, /^missing$/],
};

const PLACE_WORTH: Record<string, number> = {
  millions: 1e6, 'hundred-thousands': 1e5, 'ten-thousands': 1e4, thousands: 1e3,
  hundreds: 100, tens: 10, ones: 1, tenths: 0.1, hundredths: 0.01, thousandths: 0.001,
};

const WHOLE_PLACES = [
  'ones', 'tens', 'hundreds', 'thousands', 'ten-thousands', 'hundred-thousands', 'millions',
] as const;
const FRAC_PLACES = ['tenths', 'hundredths', 'thousandths'] as const;

/** Place columns implied by a digit string, most significant first. */
export function defaultPlaces(digits: string): Array<keyof typeof PLACE_WORTH> {
  const [whole, frac = ''] = digits.split('.');
  const w = WHOLE_PLACES.slice(0, whole.length).reverse();
  const f = FRAC_PLACES.slice(0, frac.length);
  return [...w, ...f] as Array<keyof typeof PLACE_WORTH>;
}
