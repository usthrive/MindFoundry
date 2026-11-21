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

import type { LibraryFigure, PartWholeFigure } from './types';
import { isPartWholeFigure } from './types';

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
export function checkFigureShape(fig: LibraryFigure): string[] {
  const e: string[] = [];
  const bad = (m: string) => e.push(m);

  if (!fig.alt || !fig.alt.trim()) bad('alt is required — it is the picture\'s accessible name');
  if (fig.asserts && !fig.asserts.equals) bad('asserts.equals is required when asserts is present');
  if (fig.asserts && !/^(answer|param:.+)$/.test(fig.asserts.equals)) {
    bad(`asserts.equals "${fig.asserts.equals}" must be "answer" or "param:<key>"`);
  }
  // Part-whole figures (school-math, 2026-11-21) are checked by their own branch;
  // every Best Brains figure takes the switch below exactly as before.
  if (isPartWholeFigure(fig)) {
    for (const m of partWholeShape(fig)) bad(m);
    return e;
  }

  switch (fig.type) {
    case 'number-line': {
      const p = fig.params;
      if (!isNum(p.min) || !isNum(p.max)) bad('min and max must be finite numbers');
      else if (p.max <= p.min) bad(`max (${p.max}) must exceed min (${p.min})`);
      if (p.step !== undefined && (!isNum(p.step) || p.step <= 0)) bad('step must be > 0');
      if (p.ray && (!isNum(p.ray.from) || p.ray.from < p.min || p.ray.from > p.max || !['right', 'left'].includes(p.ray.dir))) {
        bad(`a ray must start on the line (${p.min}–${p.max}) and run right or left`);
      }
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
    case 'math-sentence': {
      const p = fig.params;
      for (const [name, line] of [['tokens', p.tokens], ['then.tokens', p.then?.tokens]] as const) {
        if (!line) continue;
        if (line.length === 0) bad(`${name} is empty — a sentence needs at least one token`);
        if (line.length > 12) bad(`${name} has ${line.length} tokens — past 12 the type shrinks below reading size`);
        line.forEach((t, i) => {
          if (!t.text.trim()) bad(`${name}[${i}] is blank — use '▢' for an answer blank`);
          if (t.text.length > 8) bad(`${name}[${i}] "${t.text}" is ${t.text.length} chars — tokens cap at 8; split it`);
        });
        // SELF-AUDIT (the base-ten 'becomes'-conserves precedent): a line that
        // writes `a op b … = k` in plain numerals must be TRUE. Lesson figures
        // are audited with no answer target (validator passes null), so this is
        // the only gate that can see a lying equation on a lesson board — found
        // by the fill agent that had been told the audit existed when it did
        // not. A knowingly-wrong line declares `deliberate: true`.
        if (!p.deliberate && line !== undefined) {
          const s = sentenceEquation(line);
          if (s && Math.abs(s.value - s.claimed) > 1e-9) {
            bad(`${name} writes ${s.text} but the left side makes ${s.value} — a lesson may not show untrue mathematics; if the wrong line IS the lesson, declare deliberate: true`);
          }
        }
      }
      break;
    }
    case 'tally': {
      const n = fig.params.count;
      if (!isInt(n) || n < 0 || n > 60) bad(`a tally of ${n} — whole strokes, 0–60`);
      break;
    }
    case 'fraction-circle': {
      const { parts, shaded } = fig.params;
      if (!Array.isArray(parts) || parts.length < 2 || parts.length > 12) bad('a cut circle needs 2–12 pieces');
      (parts ?? []).forEach((w, k) => { if (!(typeof w === 'number' && w > 0)) bad(`piece ${k} must have a positive size`); });
      const seen = new Set<number>();
      for (const i of shaded ?? []) {
        if (!isInt(i) || i < 0 || i >= (parts?.length ?? 0)) bad(`shaded piece ${i} is not one of the ${parts?.length ?? 0} pieces`);
        if (seen.has(i)) bad(`piece ${i} is shaded twice`);
        seen.add(i);
      }
      break;
    }
    case 'pictograph': {
      const { rows, symbol, key } = fig.params;
      if (!rows?.length || rows.length > 6) bad('a pictograph needs 1–6 rows');
      for (const r of rows ?? []) {
        if (!r.label) bad('every pictograph row needs a label');
        if (!isInt(r.count) || r.count < 0 || r.count > 12) bad(`row "${r.label}" has ${r.count} symbols — 0–12 fit`);
      }
      if (!['star', 'circle', 'square', 'drop'].includes(symbol)) bad(`symbol "${symbol}" must be star, circle, square or drop`);
      if (!key || !isInt(key.worth) || key.worth < 1 || !key.unit) bad('a pictograph needs its key: a whole worth and a unit');
      break;
    }
    case 'number-track': {
      const { min, max, counters, flag, hops } = fig.params;
      if (!isInt(min) || !isInt(max) || max <= min) bad('a number track runs from a whole min to a larger whole max');
      if (max - min > 30) bad(`${max - min + 1} squares will not fit (max 31)`);
      const on = (v: number) => isInt(v) && v >= min && v <= max;
      for (const c of counters ?? []) if (!on(c)) bad(`counter on square ${c} is off the track ${min}–${max}`);
      if (flag !== undefined && !on(flag)) bad(`flag on square ${flag} is off the track`);
      for (const h of hops ?? []) {
        if (!on(h.from) || !on(h.to)) bad(`hop ${h.from}→${h.to} leaves the track`);
        else if (Math.abs(h.to - h.from) !== 1) bad(`hop ${h.from}→${h.to} skips squares — a track hop is one square`);
      }
      break;
    }
    case 'line-plot': {
      const { min, max, dots } = fig.params;
      if (!isInt(min) || !isInt(max) || max <= min) bad('a line plot runs from a whole min to a larger whole max');
      if (max - min > 12) bad(`${max - min + 1} values will not fit a line plot (max 13)`);
      const seen = new Set<number>();
      for (const d of dots ?? []) {
        if (!isInt(d.at) || d.at < min || d.at > max) bad(`dots at ${d.at} are off the line ${min}–${max}`);
        if (!isInt(d.count) || d.count < 0 || d.count > 12) bad(`${d.count} dots at ${d.at} — 0–12 stack`);
        if (seen.has(d.at)) bad(`two stacks at ${d.at}`);
        seen.add(d.at);
      }
      break;
    }
    case 'balance': {
      // A balance cannot draw an impossibility: with no closed bag the two sides
      // are fully visible, so a level bar needs equal sides and a tipped bar
      // needs the heavier side to be the one hanging lower (2026-11-17).
      const p = fig.params;
      const pans = [['left', p.left], ['right', p.right]] as const;
      for (const [name, pan] of pans) {
        if (!pan) { bad(`the ${name} pan is missing`); continue; }
        (pan.heaps ?? []).forEach((h, k) => {
          if (!isInt(h) || h < 0) bad(`${name} heap ${k} must be a whole number of things, got ${h}`);
          if (h > 99) bad(`${name} heap ${k} (${h}) is too many to draw as a heap`);
        });
        if (pan.bags !== undefined && (!isInt(pan.bags) || pan.bags < 0 || pan.bags > 3)) bad(`${name} bags must be 0–3`);
        (pan.weights ?? []).forEach((w, k) => {
          if (!(typeof w === 'number' && Number.isFinite(w) && w > 0)) bad(`${name} weight ${k} must be a positive amount, got ${w}`);
        });
        if ((pan.objects ?? []).length > 6) bad(`${name} pan holds more than 6 objects`);
        (pan.objects ?? []).forEach((o) => {
          if (!['stone', 'balloon', 'box', 'tin'].includes(o)) bad(`${name} object "${o}" must be stone, balloon, box or tin`);
        });
      }
      if (!['level', 'left-down', 'right-down'].includes(p.tilt)) bad(`tilt "${p.tilt}" must be level, left-down or right-down`);
      if (p.cover !== undefined && p.cover !== 'bag' && p.cover !== 'dish') bad(`cover "${p.cover}" must be bag or dish`);
      // Heaps and weights are known amounts; bags and objects are not.
      const sum = (pan?: { heaps?: number[]; weights?: number[] }) =>
        [...(pan?.heaps ?? []), ...(pan?.weights ?? [])].reduce((a, h) => a + h, 0);
      const things = (pan?: { heaps?: number[]; bags?: number; weights?: number[]; objects?: string[] }) =>
        (pan?.heaps?.length ?? 0) + (pan?.bags ?? 0) + (pan?.weights?.length ?? 0) + (pan?.objects?.length ?? 0);
      const unknown = (pan?: { bags?: number; objects?: string[] }) => (pan?.bags ?? 0) + (pan?.objects?.length ?? 0) > 0;
      if (things(p.left) + things(p.right) === 0) bad('a balance with nothing on either pan says nothing');
      // A pile is the same size whatever it holds, so without its written number it
      // carries no amount at all: an uncounted heap must be drawn as countable dots.
      if (p.showCounts === false && !p.countable && (p.left?.heaps ?? []).length + (p.right?.heaps ?? []).length > 0) {
        bad('heaps drawn as piles with no numbers say nothing about how much is on the pans — set countable, or show the counts');
      }
      if (!unknown(p.left) && !unknown(p.right)) {
        const l = sum(p.left), r = sum(p.right);
        if (p.tilt === 'level' && l !== r) bad(`the bar is drawn level but the pans hold ${l} and ${r}`);
        if (p.tilt === 'left-down' && !(l > r)) bad(`the left pan is drawn lower but holds ${l} against ${r}`);
        if (p.tilt === 'right-down' && !(r > l)) bad(`the right pan is drawn lower but holds ${r} against ${l}`);
      }
      break;
    }
    case 'column-method': {
      const p = fig.params;
      if (!p.rows?.length || p.rows.length < 2) bad('column-method needs at least two rows');
      // SELF-AUDIT, same contract as math-sentence: a plain two-operand + or −
      // with a COMPLETE result row must total. Partial rows, blank results (the
      // ruled-line-answer-not-written form) and × are left to the author.
      if (!p.deliberate && (p.op === '+' || p.op === '−')) {
        const operands = p.rows.filter((r) => r.role === 'operand');
        const res = p.rows.find((r) => r.role === 'result');
        const hasPartials = p.rows.some((r) => r.role === 'partial');
        const readRow = (cells: string[]): number | null => {
          let s = cells.join('');
          if (!/^\d+$/.test(s)) return null;
          if (p.pointAfterCol !== undefined) {
            const before = cells.slice(0, p.pointAfterCol + 1).join('').length;
            s = `${s.slice(0, before)}.${s.slice(before)}`;
          }
          return Number(s);
        };
        if (operands.length === 2 && res && !hasPartials) {
          const a = readRow(operands[0].cells);
          const b = readRow(operands[1].cells);
          const k = readRow(res.cells);
          if (a !== null && b !== null && k !== null) {
            const v = p.op === '+' ? a + b : a - b;
            if (Math.abs(v - k) > 1e-9) {
              bad(`the columns write ${a} ${p.op} ${b} = ${k}, but it makes ${v} — declare deliberate: true only if the wrong total IS the lesson`);
            }
          }
        }
      }
      const width = p.rows?.[0]?.cells.length ?? 0;
      if (width === 0) bad('rows need at least one column');
      if (width > 9) bad(`${width} columns will not fit the figure width (max 9)`);
      p.rows?.forEach((r, i) => {
        if (r.cells.length !== width) bad(`row ${i} has ${r.cells.length} cells; row 0 has ${width} — ragged rows misalign the columns`);
        if (r.role === 'carry') {
          // One digit for a carry; two for a borrow's rewritten "13 ones".
          r.cells.forEach((c, j) => { if (c && !/^\d{1,2}$/.test(c)) bad(`carry row ${i} cell ${j} "${c}" — a carry or borrow note is one or two digits`); });
        } else {
          // A column holds ONE digit — writing "47" in a cell defeats the whole
          // picture, which exists to show place columns as columns.
          r.cells.forEach((c, j) => { if (c.length > 1) bad(`row ${i} cell ${j} "${c}" is ${c.length} chars — a column holds a single digit`); });
        }
        for (const s of r.struck ?? []) {
          if (!isInt(s) || s < 0 || s >= width) bad(`row ${i} strikes column ${s}, outside 0–${width - 1}`);
        }
      });
      if (p.pointAfterCol !== undefined && (!isInt(p.pointAfterCol) || p.pointAfterCol < 0 || p.pointAfterCol >= width)) {
        bad(`pointAfterCol ${p.pointAfterCol} is outside the columns`);
      }
      for (const h of p.highlightCols ?? []) {
        if (!isInt(h) || h < 0 || h >= width) bad(`highlightCols entry ${h} is outside 0–${width - 1}`);
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
 *   balance           left | right | left:k | right:k   (the visible heaps; a bag is never a value)
 */
export function figureValue(fig: LibraryFigure, selector?: string): string[] | null {
  const of = selector ?? fig.asserts?.of;
  // An UNRECOGNISED selector returns null rather than falling through to the
  // default. A typo must fail loudly: silently auditing a different quantity
  // than the author asked for is the figure twin of an unregistered templateId
  // skipping the QG-5 audit.
  if (of !== undefined && !SELECTORS[fig.type].some((re) => re.test(of))) return null;
  if (isPartWholeFigure(fig)) return partWholeValue(fig, of);
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
    case 'math-sentence': {
      // 'value' evaluates a plain `a op b … = k` with × ÷ before + −, and
      // answers with the k the sentence claims ONLY when the left side really
      // reaches it — a figure asserting a false equation must fail its audit.
      // (Falsehood is also a SHAPE error unless declared deliberate — see
      // checkFigureShape; this path serves item-level assertions.)
      const p = fig.params;
      if (of !== undefined && of !== 'value') return null;
      const s = sentenceEquation(p.tokens);
      if (!s) return null;
      return Math.abs(s.value - s.claimed) < 1e-9 ? [String(s.claimed)] : [String(s.value)];
    }
    case 'tally': {
      if (of !== undefined && of !== 'count') return null;
      return [String(fig.params.count)];
    }
    case 'fraction-circle': {
      // 'pieces' (default): how many pieces; 'shaded': how many are coloured.
      if (of === 'shaded') return [String(fig.params.shaded?.length ?? 0)];
      if (of !== undefined && of !== 'pieces') return null;
      return [String(fig.params.parts.length)];
    }
    case 'pictograph': {
      // Default: what one symbol is worth (the key). 'symbols:k' = row k's symbol
      // count; 'row:k' = what row k stands for (count × worth).
      const p = fig.params;
      if (of === undefined || of === 'key') return [String(p.key.worth)];
      const m = /^(symbols|row):(\d+)$/.exec(of);
      const r = m ? p.rows[Number(m[2])] : undefined;
      if (!m || !r) return null;
      return [String(m[1] === 'symbols' ? r.count : r.count * p.key.worth)];
    }
    case 'number-track': {
      // Default: the first counter. 'counter:k', or 'flag'.
      const p = fig.params;
      if (of === 'flag') return p.flag === undefined ? null : [String(p.flag)];
      const k = of === undefined || of === 'counter' ? 0 : Number(/^counter:(\d+)$/.exec(of)?.[1] ?? NaN);
      const c = p.counters?.[k];
      return c === undefined ? null : [String(c)];
    }
    case 'line-plot': {
      // Default: every dot on the plot; 'at:v' = the stack above v.
      const p = fig.params;
      if (of === undefined || of === 'total') return [String(p.dots.reduce((a, d) => a + d.count, 0))];
      const m = /^at:(\d+)$/.exec(of);
      if (!m) return null;
      return [String(p.dots.find((d) => d.at === Number(m[1]))?.count ?? 0)];
    }
    case 'balance': {
      // The heaps you can see: a whole pan (left | right) or one heap (left:k | right:k).
      // Default: the left pan. A closed bag is never a value — it is the question.
      // A pan's value is its heaps plus its labelled weights; objects are unknown.
      const p = fig.params;
      const sum = (pan?: { heaps?: number[]; weights?: number[] }) =>
        [...(pan?.heaps ?? []), ...(pan?.weights ?? [])].reduce((a, h) => a + h, 0);
      if (of === undefined || of === 'left') return [String(sum(p.left))];
      if (of === 'right') return [String(sum(p.right))];
      const m = /^(left|right):(\d+)$/.exec(of);
      if (!m) return null;
      const h = (m[1] === 'left' ? p.left : p.right)?.heaps?.[Number(m[2])];
      return h === undefined ? null : [String(h)];
    }
    case 'column-method': {
      // The result row re-read as one number (with the drawn point, if any) —
      // so an item's answer can be audited against the algorithm's own total.
      const p = fig.params;
      if (of !== undefined && of !== 'result') return null;
      const res = p.rows.find((r) => r.role === 'result');
      if (!res) return null;
      let s = res.cells.join('');
      if (p.pointAfterCol !== undefined) {
        const digitsBefore = res.cells.slice(0, p.pointAfterCol + 1).join('').length;
        s = `${s.slice(0, digitsBefore)}.${s.slice(digitsBefore)}`;
      }
      if (!/^\d+(\.\d+)?$/.test(s)) return null;
      const n = Number(s);
      return [s, String(n)];
    }
  }
}

/**
 * Parse a written line as `a op b … = k` over plain numerals, or null when the
 * line is anything else (words, blanks, powers, brackets — all legitimately
 * unparseable and so unaudited). The corpus writes minus as U+2212, and the
 * first version of this parser accepted only ASCII '-' — a silent null on
 * every negative line, found by the fill agent working Level E. Both forms
 * are accepted everywhere a sign can occur.
 */
function sentenceEquation(
  tokens: ReadonlyArray<{ text: string }>,
): { value: number; claimed: number; text: string } | null {
  const NUM = /^[-−]?\d+(\.\d+)?$/;
  const toNum = (t: string) => Number(t.replace('−', '-'));
  const texts = tokens.map((t) => t.text.trim());
  const eq = texts.indexOf('=');
  if (eq <= 0 || eq !== texts.length - 2) return null;
  const left = texts.slice(0, eq);
  const claimed = texts[eq + 1];
  if (!NUM.test(claimed)) return null;
  const nums: number[] = [];
  const ops: string[] = [];
  for (const [i, t] of left.entries()) {
    if (i % 2 === 0) {
      if (!NUM.test(t)) return null;
      nums.push(toNum(t));
    } else {
      if (!['+', '−', '-', '×', '÷'].includes(t)) return null;
      ops.push(t);
    }
  }
  if (nums.length !== ops.length + 1 || nums.length === 0) return null;
  const n2: number[] = [nums[0]];
  const o2: string[] = [];
  for (const [i, op] of ops.entries()) {
    if (op === '×') n2[n2.length - 1] *= nums[i + 1];
    else if (op === '÷') n2[n2.length - 1] /= nums[i + 1];
    else { o2.push(op); n2.push(nums[i + 1]); }
  }
  let v = n2[0];
  for (const [i, op] of o2.entries()) v = op === '+' ? v + n2[i + 1] : v - n2[i + 1];
  return { value: v, claimed: toNum(claimed), text: texts.join(' ') };
}

/** The selectors each figure type answers to; anything else is an authoring typo. */
const SELECTORS: Record<LibraryFigure['type'], RegExp[]> = {
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
  'math-sentence': [/^value$/],
  'column-method': [/^result$/],
  balance: [/^left$/, /^right$/, /^left:\d+$/, /^right:\d+$/],
  tally: [/^count$/],
  'fraction-circle': [/^pieces$/, /^shaded$/],
  pictograph: [/^key$/, /^symbols:\d+$/, /^row:\d+$/],
  'number-track': [/^counter$/, /^counter:\d+$/, /^flag$/],
  'line-plot': [/^total$/, /^at:\d+$/],
  // part-whole figures (school-math)
  'number-bond': [/^whole$/, /^part:[01]$/],
  groups: [/^total$/, /^group:\d+$/],
  'split-list': [/^whole$/, /^row:\d+$/],
  'match-rows': [/^more$/, /^top$/, /^bottom$/],
  scene: [/^total$/, /^group:\d+$/],
  'track-window': [/^cell:\d+$/],
};

// ---------------------------------------------------------------------------
// Part-whole figures (school-math, 2026-11-21; types.ts "Part-whole figures")
// ---------------------------------------------------------------------------

const isCellNum = (c: unknown): c is number => typeof c === 'number';

/** Well-formedness of a part-whole figure; empty = well-formed. */
function partWholeShape(fig: PartWholeFigure): string[] {
  const e: string[] = [];
  const bad = (m: string) => e.push(m);
  switch (fig.type) {
    case 'number-bond': {
      const { whole, parts } = fig.params.bond;
      const cells = [whole, ...parts];
      if (parts.length !== 2) bad('a number bond has exactly two part circles');
      for (const c of cells) {
        if (isCellNum(c) ? !isInt(c) || c < 0 : c !== 'empty' && c !== '?') bad(`bond circle "${String(c)}" must be a whole number, 'empty' or '?'`);
      }
      if (cells.filter((c) => c === '?').length > 1) bad('a bond has at most one "?" (one unknown)');
      // A shown bond must be true — except a child's own bond in an error item
      // (`childWork`), which is the mistake the child is asked to find.
      if (isCellNum(whole) && !fig.params.childWork) {
        for (const p of parts) if (isCellNum(p) && p > whole) bad(`part ${p} is bigger than the whole ${whole}`);
        if (isCellNum(parts[0]) && isCellNum(parts[1]) && parts[0] + parts[1] !== whole) {
          bad(`parts ${parts[0]} and ${parts[1]} do not make the whole ${whole}`);
        }
      }
      break;
    }
    case 'groups':
    case 'scene': {
      const p = fig.params;
      if (!p.shape || !p.shape.trim()) bad('a group needs the shape its number is drawn on');
      if (fig.type === 'scene' && (!fig.params.setting || !fig.params.setting.trim())) bad('a scene needs its setting');
      if (!p.groups.length || p.groups.length > 3) bad('one to three groups');
      for (const g of p.groups) if (!isInt(g) || g < 0 || g > 100) bad(`group number ${g} must be a whole number 0–100`);
      break;
    }
    case 'split-list': {
      const { whole, rows } = fig.params;
      if (!isInt(whole) || whole < 2) bad('a split list needs a whole of at least 2');
      let last = 0;
      for (const r of rows) {
        if (!isInt(r.first) || r.first < 1 || r.first >= whole) bad(`row first part ${r.first} must be 1 to ${whole - 1}`);
        if (r.first <= last) bad('rows run in order, smallest first part first');
        last = r.first;
        if (r.second !== null && r.second !== whole - r.first) bad(`row ${r.first} and ${r.second} does not make ${whole}`);
      }
      break;
    }
    case 'match-rows': {
      for (const [name, row] of [['top', fig.params.top], ['bottom', fig.params.bottom]] as const) {
        if (!isInt(row.count) || row.count < 1 || row.count > 20) bad(`${name} row count must be 1–20`);
      }
      if (fig.params.top.count === fig.params.bottom.count) bad('matched rows of equal length have no "more"');
      break;
    }
    case 'track-window': {
      const cells = fig.params.cells;
      if (cells.length < 3 || cells.length > 12) bad('a track window shows 3–12 squares');
      // The printed squares are consecutive: square i is first + i.
      const firstNum = cells.findIndex(isCellNum);
      if (firstNum < 0) bad('a track window prints at least one number');
      else {
        const start = (cells[firstNum] as number) - firstNum;
        cells.forEach((c, i) => { if (isCellNum(c) && c !== start + i) bad(`square ${i} reads ${c}, not ${start + i}`); });
        if (start < 0) bad('a track window starts at 0 or above');
      }
      break;
    }
  }
  return e;
}

/** The quantity a part-whole figure shows; null for an asked (empty) circle or square. */
function partWholeValue(fig: PartWholeFigure, of: string | undefined): string[] | null {
  const one = (n: unknown) => (isCellNum(n) ? [String(n)] : null);
  const idx = (prefix: string): number | null => {
    const m = of ? new RegExp(`^${prefix}:(\\d+)$`).exec(of) : null;
    return m ? Number(m[1]) : null;
  };
  switch (fig.type) {
    case 'number-bond': {
      // Default: the whole. An empty or "?" circle has no value: it is the question.
      const b = fig.params.bond;
      const k = idx('part');
      return k === null ? one(b.whole) : one(b.parts[k]);
    }
    case 'groups':
    case 'scene': {
      const g = fig.params.groups;
      const k = idx('group');
      return k === null ? [String(g.reduce((a, x) => a + x, 0))] : one(g[k]);
    }
    case 'split-list': {
      const k = idx('row');
      if (k === null) return [String(fig.params.whole)];
      const r = fig.params.rows[k];
      return r ? one(r.second) : null;
    }
    case 'match-rows': {
      const { top, bottom } = fig.params;
      if (of === 'top') return [String(top.count)];
      if (of === 'bottom') return [String(bottom.count)];
      return [String(Math.max(top.count, bottom.count))];
    }
    case 'track-window': {
      const k = idx('cell');
      return k === null ? null : one(fig.params.cells[k]);
    }
  }
}

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
