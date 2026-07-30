/**
 * Figure RENDER suite — proves the ten primitives actually draw (B1.0).
 *
 * QG-13 audits the figure DATA; nothing audited the drawing, and "the field has
 * a value" is precisely the illusion that let 76/76 lesson visuals ship as
 * italic prose (L27). So this renders every primitive across every size and
 * asserts what a picture must satisfy to reach a child:
 *
 *   - it renders at all, and renders the SAME twice (purity — a figure is a
 *     pure function of the item's drawn values or the whole guarantee is void);
 *   - no NaN/undefined leaks into a coordinate;
 *   - no red and no raw hex reaches a child surface (R3 child-safe law: the
 *     module skin only remaps SEMANTIC classes, so a literal colour in a shared
 *     component leaks straight through it);
 *   - the accessible name survives, so a screen reader hears one description
 *     rather than a soup of shapes;
 *   - and the triangle it draws IS the triangle it labels — recomputed from the
 *     emitted polygon, because a figure that lies destroys the very week
 *     ("classify by the LARGEST angle") it exists to teach.
 *
 * It also writes a gallery for human review; pass a path as argv[2].
 *
 * Run: npx tsx scripts/bb-figure-render-test.ts
 */
import React from 'react';
import { renderToStaticMarkup as R } from 'react-dom/server';
import BBFigureView from '../src/modules/best-brains/components/figures/BBFigureView';
import { checkFigureShape, figureValue } from '../src/modules/best-brains/figures/assert';
import type { BBFigure } from '../src/modules/best-brains/figures/types';
import { FIGURE_TYPES } from '../src/modules/best-brains/figures/types';
import fs from 'node:fs';

const F = (type: any, alt: string, params: any, extra: any = {}): BBFigure =>
  ({ type, alt, params, ...extra }) as BBFigure;

const CASES: Array<[string, BBFigure]> = [
  // --- number line ---------------------------------------------------------
  ['number-line · 6/8 on an eighths line (D9)', F('number-line', 'a 0 to 1 line cut into eighths with a dot on six eighths', { min: 0, max: 1, partition: 8, labelAs: 'fraction', marks: [{ at: 0.75, label: '6/8' }] })],
  ['number-line · the SAME point renamed 3/4', F('number-line', 'the same line cut into quarters, the dot has not moved', { min: 0, max: 1, partition: 4, labelAs: 'fraction', marks: [{ at: 0.75, label: '3/4' }] })],
  ['number-line · rounding neighbourhood (C2)', F('number-line', 'a line from 0 to 100 counting by tens with a flag at 47', { min: 0, max: 100, step: 10, marks: [{ at: 47, style: 'flag', label: '47' }] })],
  ['number-line · negative order (E6)', F('number-line', 'a line from minus ten to ten with dots at minus eight and three', { min: -10, max: 10, step: 2, marks: [{ at: -8 }, { at: 3, style: 'unknown' }] })],
  ['number-line · count-on hop (A17/B4)', F('number-line', 'a hop of three from five to eight', { min: 0, max: 12, marks: [{ at: 5 }], hops: [{ from: 5, to: 8, label: '+3' }] })],
  ['number-line · a crowded partition degrades', F('number-line', 'a line from 0 to 2 cut into twenty-fourths', { min: 0, max: 2, partition: 24, labels: 'ends' })],
  // --- bar model -----------------------------------------------------------
  ['bar-model · times as many, to scale (D4)', F('bar-model', 'one short bar for Maya and four copies of it for Ben', { bars: [{ label: 'Maya', segments: [{ value: 6, label: '6' }] }, { label: 'Ben', segments: [{ value: 6 }, { value: 6 }, { value: 6 }, { value: 6 }], total: '?' }], scaleMax: 24 })],
  ['bar-model · missing addend (B7)', F('bar-model', 'a bar of thirteen split into eight and an unknown part', { bars: [{ segments: [{ value: 8, label: '8', fill: 'solid' }, { value: 5, label: '?', fill: 'hatch' }], total: '13' }] })],
  ['bar-model · twelve unit parts with a brace', F('bar-model', 'twelve equal parts braced as twelve in all', { bars: [{ segments: Array.from({ length: 12 }, () => ({ value: 1, fill: 'soft' as const })) }], brace: { label: '12 in all' } })],
  // --- area grid -----------------------------------------------------------
  ['area-grid · the four rooms (D8)', F('area-grid', 'a rectangle split into four rooms: 600, 80, 180 and 24', { rows: 2, cols: 2, rowLabels: ['20', '6'], colLabels: ['30', '4'], cellLabels: ['600', '80', '180', '24'] })],
  ['area-grid · a fraction of a fraction (D18)', F('area-grid', 'three rows of five shaded one way and two columns the other, six squares double shaded', { rows: 4, cols: 5, shadedRows: 3, shadedCols: 2 })],
  ['area-grid · an array (B20/C20)', F('area-grid', 'six rows of eight squares', { rows: 6, cols: 8, showCounts: true })],
  ['area-grid · seven of sixteen shaded', F('area-grid', 'a four by four grid with seven squares shaded', { rows: 4, cols: 4, shaded: 7 })],
  // --- ten frame + counters ------------------------------------------------
  ['ten-frame · seven counters (A2)', F('ten-frame', 'a ten frame with seven counters', { filled: 7 })],
  ['ten-frame · thirteen in a double frame (A9)', F('ten-frame', 'two ten frames, one full and three more', { frames: 2, filled: 13, icon: 'star' })],
  ['ten-frame · the hiding game, one cover (A12)', F('ten-frame', 'a five frame with two counters showing and the rest under one cover', { size: 5, filled: 2, hidden: 3, coverStyle: 'single' })],
  ['counters · a join story (A14)', F('counters', 'three apples and two apples', { groups: [{ count: 3, icon: 'apple' }, { count: 2, icon: 'apple' }], relation: 'join' })],
  ['counters · scattered four (A1 conservation)', F('counters', 'four counters spread out', { groups: [{ count: 4 }], arrangement: 'scatter' })],
  ['counters · compare, ASSESSING (no scaffold — the default)', F('counters', 'a row of five above a row of six', { groups: [{ count: 5, label: 'row A' }, { count: 6, label: 'row B' }], relation: 'compare' })],
  ['counters · compare, MODELLING the strategy (opt-in scaffolds)', F('counters', 'a row of five paired one-to-one against a row of six, the extra one ringed', { groups: [{ count: 5, label: 'row A' }, { count: 6, label: 'row B' }], relation: 'compare', showPairs: true, markExtra: true })],
  ['counters · take away three of seven (A16)', F('counters', 'seven ducks with three crossed out', { groups: [{ count: 7, icon: 'duck' }], crossedOut: 3, relation: 'remove' })],
  // --- place value ---------------------------------------------------------
  ['place-value · periods (D1)', F('place-value-chart', 'a place value chart showing 507036 grouped in threes', { digits: '507036', showPeriods: true })],
  ['place-value · face vs value (C1)', F('place-value-chart', 'a chart showing 407 with the hundreds column highlighted', { digits: '407', showValues: true, highlight: 'hundreds' })],
  ['place-value · thousandths (D13)', F('place-value-chart', 'a chart showing 3 point 475', { digits: '3.475' })],
  // --- clock ---------------------------------------------------------------
  ['clock · three o\'clock (B12)', F('clock', 'a clock reading three o clock', { h: 3, m: 0 })],
  ['clock · 2:55, the hour hand has drifted (C18)', F('clock', 'a clock reading five to three', { h: 2, m: 55, marks: 'minutes' })],
  ['clock · quarter to eight (B17)', F('clock', 'a clock reading quarter to eight', { h: 7, m: 45, marks: 'five', numerals: false })],
  ['clock · draw the hands (B12 Day-5)', F('clock', 'an empty clock face', { h: 9, m: 15, hands: 'none' })],
  // --- coins ---------------------------------------------------------------
  ['coin-set · 63 cents (B16)', F('coin-set', 'two quarters, a dime and three pennies', { coins: [{ cents: 25, count: 2 }, { cents: 10, count: 1 }, { cents: 1, count: 3 }] })],
  ['coin-set · three pennies vs one dime (the trap)', F('coin-set', 'three pennies', { coins: [{ cents: 1, count: 3 }] })],
  ['coin-set · one dime', F('coin-set', 'one dime', { coins: [{ cents: 10, count: 1 }] })],
  ['coin-set · jumbled on the table', F('coin-set', 'a dollar, a half dollar and four nickels jumbled', { coins: [{ cents: 100, count: 1 }, { cents: 50, count: 1 }, { cents: 5, count: 4 }], arrangement: 'scatter' })],
  // --- coordinate grid -----------------------------------------------------
  ['coordinate-grid · first quadrant (D22)', F('coordinate-grid', 'a grid with a point at three across and seven up', { xMin: 0, xMax: 10, yMin: 0, yMax: 10, points: [{ x: 3, y: 7, label: '(3,7)' }] })],
  ['coordinate-grid · four quadrants (E7)', F('coordinate-grid', 'a four quadrant grid with two points', { xMin: -5, xMax: 5, yMin: -5, yMax: 5, points: [{ x: -3, y: 2 }, { x: 3, y: -2, style: 'open' }] })],
  ['coordinate-grid · a path segment', F('coordinate-grid', 'a line from one one to four five', { xMin: 0, xMax: 6, yMin: 0, yMax: 6, points: [{ x: 1, y: 1 }, { x: 4, y: 5, style: 'unknown' }], segments: [{ from: [1, 1], to: [4, 5], label: 'path' }] })],
  // --- angles --------------------------------------------------------------
  ['angle · 45 degrees', F('angle-figure', 'an angle of forty five degrees', { shape: 'angle', degrees: 45 })],
  ['angle · 135 degrees (obtuse)', F('angle-figure', 'an angle of one hundred thirty five degrees', { shape: 'angle', degrees: 135 })],
  ['triangle · 40/60/80, classify by the LARGEST (D23)', F('angle-figure', 'a triangle with angles forty, sixty and eighty degrees', { shape: 'triangle', angles: [40, 60, 80], labels: ['A', 'B', 'C'] })],
  ['triangle · find the third angle', F('angle-figure', 'a right triangle with a fifty five degree angle and one unknown', { shape: 'triangle', angles: [90, 55, null], showRightMarks: true })],
  ['quadrilateral · the tilted square (A7/C22)', F('angle-figure', 'a square turned on its corner, still a square', { shape: 'quadrilateral', angles: [90, 90, 90, 90], rotation: 45, sideMarks: [1, 1, 1, 1] })],
  ['polygon · a hexagon', F('angle-figure', 'a six sided shape', { shape: 'polygon', sides: 6 })],
];

let failures = 0;
const fail = (m: string) => { failures++; console.error('  FAIL ' + m); };

// 1. every type is exercised
for (const t of FIGURE_TYPES) {
  if (!CASES.some(([, f]) => f.type === t)) fail(`no case exercises ${t}`);
}

// 2. every case is a WELL-FORMED figure by its own gate
for (const [name, fig] of CASES) {
  const probs = checkFigureShape(fig);
  if (probs.length) fail(`${name}: not well-formed — ${probs[0]}`);
}

// 3. render checks across all three sizes
const NOISE = /NaN|undefined|Infinity/;
const RED = /\bred\b|crimson|firebrick|tomato/i;
for (const [name, fig] of CASES) {
  for (const size of ['sm', 'md', 'lg'] as const) {
    let html = '';
    try {
      html = R(React.createElement(BBFigureView as any, { figure: fig, size }));
    } catch (e) {
      fail(`${name} @${size} THREW: ${(e as Error).message}`);
      continue;
    }
    if (!html.includes('<svg')) fail(`${name} @${size}: no <svg> in output`);
    if (NOISE.test(html)) fail(`${name} @${size}: NaN/undefined/Infinity in output`);
    const noVars = html.replace(/var\([^)]*\)/g, '');
    if (RED.test(noVars)) fail(`${name} @${size}: a red colour leaked onto a child surface`);
    if (/#[0-9a-fA-F]{3,8}\b/.test(noVars)) fail(`${name} @${size}: raw hex colour outside a token fallback`);
    if (!html.includes('role="img"')) fail(`${name} @${size}: wrapper lost role="img"`);
    if (!html.includes(`aria-label="${fig.alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`)) {
      fail(`${name} @${size}: wrapper lost its accessible name`);
    }
    // purity
    const again = R(React.createElement(BBFigureView as any, { figure: fig, size }));
    if (html !== again) fail(`${name} @${size}: NOT PURE — two renders differ`);
  }
}

// 4. the drawn triangle really is the labelled triangle
{
  const tri = (angles: number[]) => {
    const html = R(React.createElement(BBFigureView as any, { figure: F('angle-figure', 'triangle', { shape: 'triangle', angles }), size: 'md' }));
    const m = /points="([^"]+)"/.exec(html) ?? /<polygon[^>]*points="([^"]+)"/.exec(html);
    if (!m) { fail(`triangle ${angles}: no polygon points found in the SVG`); return; }
    const pts = m[1].trim().split(/\s+/).map((p) => p.split(',').map(Number) as [number, number]);
    if (pts.length !== 3) { fail(`triangle ${angles}: ${pts.length} vertices`); return; }
    const ang = (a: number[], b: number[], c: number[]) => {
      const v1 = [a[0] - b[0], a[1] - b[1]], v2 = [c[0] - b[0], c[1] - b[1]];
      const d = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1 as [number, number]) * Math.hypot(...v2 as [number, number]));
      return (Math.acos(Math.max(-1, Math.min(1, d))) * 180) / Math.PI;
    };
    const drawn = [ang(pts[2], pts[0], pts[1]), ang(pts[0], pts[1], pts[2]), ang(pts[1], pts[2], pts[0])];
    const sorted = [...drawn].sort((x, y) => x - y);
    const want = [...angles].sort((x, y) => x - y);
    const off = sorted.map((v, i) => Math.abs(v - want[i]));
    if (Math.max(...off) > 2) fail(`triangle ${angles}: DRAWN as ${drawn.map((d) => d.toFixed(1))} — the picture lies`);
    else console.log(`  ok  triangle ${angles} drawn as ${drawn.map((d) => d.toFixed(1)).join('/')}`);
  };
  tri([40, 60, 80]);
  tri([100, 40, 40]);
  tri([90, 45, 45]);
}

// 5. what each figure asserts, for the record
console.log('\n  asserted quantities:');
for (const [name, fig] of CASES.slice(0, 100)) {
  const v = figureValue(fig);
  if (v) console.log(`    ${name.padEnd(52)} → ${v[0]}`);
}

// 6. the gallery
const section = (title: string, body: string) =>
  `<section style="background:#fff;border:1px solid #E7E1D7;border-radius:14px;padding:14px 16px;margin:0 0 14px">
     <h3 style="margin:0 0 10px;font:600 13px/1.3 ui-sans-serif,system-ui;color:#66717A">${title}</h3>${body}</section>`;
const html = `<!doctype html><meta charset="utf-8"><title>BB figure gallery</title>
<body style="margin:0;background:#FAF7F2;font-family:ui-sans-serif,system-ui">
<div class="mf-foundry" style="max-width:900px;margin:0 auto;padding:24px 16px 80px">
<h1 style="font:700 22px/1.2 ui-sans-serif;color:#2B3238">Best Brains figure primitives — B1.0</h1>
<p style="color:#66717A;font-size:14px">Each drawn at size <code>md</code>. Greyscale copies follow for the contrast law.</p>
${CASES.map(([n, f]) => section(n, R(React.createElement(BBFigureView as any, { figure: f, size: 'md' })))).join('')}
<h2 style="font:700 18px/1.2 ui-sans-serif;color:#2B3238;margin-top:36px">Greyscale — no distinction may live in hue alone</h2>
<div style="filter:grayscale(1)">
${CASES.filter(([n]) => /double|fraction of a fraction|coin|hatch|missing addend|times as many/i.test(n))
  .map(([n, f]) => section(n, R(React.createElement(BBFigureView as any, { figure: f, size: 'md' })))).join('')}
</div>
<h2 style="font:700 18px/1.2 ui-sans-serif;color:#2B3238;margin-top:36px">Band A size (lg) — the audio-first band</h2>
${CASES.filter(([n]) => /A\d|A1|ten-frame|counters/i.test(n)).slice(0, 8)
  .map(([n, f]) => section(n, R(React.createElement(BBFigureView as any, { figure: f, size: 'lg' })))).join('')}
</div></body>`;
const out = process.argv[2] ?? '/tmp/bb-figure-gallery.html';
fs.writeFileSync(out, html);

console.log(`\n${CASES.length} figures × 3 sizes checked. ${failures === 0 ? 'ALL FIGURE CHECKS PASS' : `${failures} FAILURE(S)`}`);
console.log(`gallery → ${out}`);
process.exit(failures === 0 ? 0 : 1);
