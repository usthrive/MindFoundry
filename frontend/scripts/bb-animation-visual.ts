/**
 * The pixel half of L1 — run by hand, NOT part of the battery.
 *
 * Run: npx tsx scripts/bb-animation-visual.ts [outdir]   (from frontend/)
 * Needs a real browser (`/usr/bin/google-chrome`), which is why it is not
 * wired into the battery: `bb-animation-test` must stay runnable anywhere.
 *
 * WHY THIS EXISTS. `bb-animation-test` proves the resting MARKUP is identical
 * to the static render. That is not the same claim as the resting PICTURE being
 * identical, and the difference is not academic: the first implementation used
 * `animation-fill-mode: both`, so every animated element kept an `opacity: 1`
 * or an identity `transform` applied for ever. Identical tags, and 7,395
 * different pixels across seven figures — Chrome rasterises a composited
 * element without sub-pixel text antialiasing. The markup gate could not see
 * it; a screenshot could. (The fix was `backwards`, which applies nothing once
 * the animation ends; `bb-animation-test` now checks the fill mode too.)
 *
 * Three claims, each measured:
 *   1. the motion actually plays (a mid-flight frame differs from the still);
 *   2. it RESTS on the still, pixel for pixel;
 *   3. under reduced motion the still shows immediately — this one renders the
 *      classes on purpose, bypassing BBFigureView's render-time check, so it is
 *      the stylesheet's backstop being tested rather than the React guard.
 */
import React from 'react';
import { renderToStaticMarkup as R } from 'react-dom/server';
import fs from 'node:fs';
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import BBFigureView from '../src/modules/best-brains/components/figures/BBFigureView';

const F = (type: any, alt: string, params: any): any => ({ type, alt, params });

/** One figure per branch that actually moves. */
const FIGS: Array<[string, any]> = [
  ['base-ten becomes', F('base-ten-blocks', 'x', { state: { rods: 0, ones: 10 }, then: { rods: 1, ones: 0, label: '10' }, connector: 'becomes', highlight: 'ones' })],
  ['number-line hops', F('number-line', 'x', { min: 0, max: 12, marks: [{ at: 2 }, { at: 5 }, { at: 9, style: 'flag', label: '9' }], hops: [{ from: 2, to: 5, label: '+3' }, { from: 5, to: 9, label: '+4' }] })],
  ['column carry', F('column-method', 'x', { op: '+', rows: [{ cells: ['1', ''], role: 'carry' }, { cells: ['4', '7'], role: 'operand' }, { cells: ['2', '6'], role: 'operand' }, { cells: ['7', '3'], role: 'result' }] })],
  ['column borrow', F('column-method', 'x', { op: '−', rows: [{ cells: ['7', '13'], role: 'carry' }, { cells: ['8', '3'], role: 'operand', struck: [0, 1] }, { cells: ['2', '7'], role: 'operand' }, { cells: ['5', '6'], role: 'result' }] })],
  ['math-sentence marks', F('math-sentence', 'x', { tokens: [{ text: '3' }, { text: '+' }, { text: '4', mark: 'ring' }, { text: '=' }, { text: '▢', mark: 'box' }] })],
  ['math-sentence then', F('math-sentence', 'x', { tokens: [{ text: '8' }, { text: '+' }, { text: '5', mark: 'ring' }], then: { connector: 'becomes', tokens: [{ text: '8' }, { text: '+' }, { text: '2' }, { text: '+' }, { text: '3' }] } })],
  ['bar-model brace', F('bar-model', 'x', { bars: [{ segments: [{ value: 8, label: '8' }, { value: 5, label: '?', fill: 'hatch' }], total: '13' }] })],
];

/** Both pages share a layout, so any pixel difference is the motion, not reflow. */
const page = (animate: boolean) => `<!doctype html><meta charset="utf-8">
<body style="margin:0;background:#FAF7F2;font-family:ui-sans-serif,system-ui">
<div class="mf-foundry" style="width:900px;padding:20px">
${FIGS.map(([, f]) => `<div style="width:420px;background:#fff;padding:12px;margin:0 0 12px">${
  R(React.createElement(BBFigureView as any, { figure: f, size: 'lg', animate }))
}</div>`).join('')}
</div></body>`;

const OUT = process.argv[2] ?? '/tmp/bb-anim-visual';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const shot = async (html: string, waitMs: number, name: string, reduced = false): Promise<Buffer> => {
  const ctx = await browser.newContext({
    viewport: { width: 900, height: 1400 },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  await p.waitForTimeout(waitMs);
  const buf = await p.screenshot({ fullPage: true });
  fs.writeFileSync(`${OUT}/${name}.png`, buf);
  await ctx.close();
  return buf;
};

const still = await shot(page(false), 400, 'static');
const midFlight = await shot(page(true), 130, 'animated-130ms');
const atRest = await shot(page(true), 2000, 'animated-rest');
const reducedEarly = await shot(page(true), 60, 'reduced-60ms', true);
await browser.close();

const same = (a: Buffer, b: Buffer) => a.length === b.length && a.equals(b);
let bad = 0;
const say = (ok: boolean, msg: string) => { if (!ok) bad++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };

say(!same(midFlight, still), 'motion plays: the 130ms frame differs from the still');
say(same(atRest, still), 'L1 PIXELS: the rested figure is byte-identical to the static render');
say(same(reducedEarly, still), 'L3 backstop: reduced motion shows the still at 60ms');

/** When a resting comparison fails, say WHERE — a byte mismatch alone is unactionable. */
async function locate(a: Buffer, b: Buffer): Promise<void> {
  const A = await sharp(a).raw().toBuffer({ resolveWithObject: true });
  const B = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  if (A.info.width !== B.info.width || A.info.height !== B.info.height) {
    console.log(`  the two pages are different SIZES: ${A.info.width}×${A.info.height} vs ${B.info.width}×${B.info.height}`);
    return;
  }
  const { width, height, channels } = A.info;
  let n = 0;
  let worst = 0;
  const rows = new Set<number>();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      let d = 0;
      for (let c = 0; c < channels; c += 1) d = Math.max(d, Math.abs(A.data[i + c] - B.data[i + c]));
      if (d > 0) { n += 1; worst = Math.max(worst, d); rows.add(y); }
    }
  }
  const ys = [...rows].sort((p, q) => p - q);
  console.log(`  ${n} differing pixels (worst channel delta ${worst}), rows ${ys[0]}..${ys[ys.length - 1]}`);
}
if (bad) await locate(still, atRest);

console.log(`\nscreenshots → ${OUT}`);
process.exit(bad === 0 ? 0 : 1);
