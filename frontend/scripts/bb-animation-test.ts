/**
 * The micro-animation gate (MICRO-ANIMATIONS-SPEC §4).
 *
 * Run: npx tsx scripts/bb-animation-test.ts   (from frontend/)
 *
 * Motion on a teaching picture is dangerous in a specific way: it can end
 * somewhere other than the picture that passed every other gate. Every check
 * here exists to make one of the seven hard laws impossible to break quietly:
 *
 *   L1  the animated figure's RESTING markup is byte-identical to the static
 *       one — proved by stripping the animation-only attributes and comparing,
 *       with a negative control so the comparison is known to have power;
 *   L2  nothing loops (read out of the stylesheet, not asserted in a comment);
 *   L3  a reduced-motion render carries no animation at all — the still, at
 *       once, with a liveness check on the flag itself;
 *   L4  every figure's motion finishes inside 900ms, computed per element from
 *       the same CSS the browser reads;
 *   L5  `animate` is passed from LessonRoom and nowhere else — a static scan
 *       with its own positive and negative controls;
 *   L6  no animation library, no SMIL, no second render path;
 *   L7  only opacity, transform and the stroke-dash pair are ever touched.
 *
 * The cases below are the FIVE ANIMATED TYPES with their branches (a `becomes`
 * pair and a `beside` pair, hops and no hops, a written result and a blank one,
 * each connector), plus one case per un-animated type to prove the scope
 * really is five. They are deliberately this file's own list rather than an
 * import from `bb-figure-render-test`: that suite exits the process as it
 * finishes, and a green battery is not worth refactoring to save a duplicate
 * array.
 */

import React from 'react';
import { renderToStaticMarkup as R } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import BBFigureView from '../src/modules/best-brains/components/figures/BBFigureView';
import {
  ANIM_CSS, BUDGET_MS, DUR, MAX_TIER, STEP, prefersReducedMotion,
} from '../src/modules/best-brains/components/figures/anim';
import { checkFigureShape } from '../src/modules/best-brains/figures/assert';
import type { BBFigure } from '../src/modules/best-brains/figures/types';

const F = (type: any, alt: string, params: any, extra: any = {}): BBFigure =>
  ({ type, alt, params, ...extra }) as BBFigure;

/** [name, figure, animates?] — `animates` is what this gate expects to see. */
const CASES: Array<[string, BBFigure, boolean]> = [
  // --- 1. base-ten blocks: the trade -----------------------------------------
  ['base-ten · ten ones magnetize into a rod (B2 flagship)', F('base-ten-blocks', 'ten loose cubes, then the one fused rod they become', { state: { rods: 0, ones: 10 }, then: { rods: 1, ones: 0, label: '10' }, connector: 'becomes', highlight: 'ones' }), true],
  ['base-ten · ten rods become a flat (rods highlight)', F('base-ten-blocks', 'ten rods, then the flat they become', { state: { rods: 10, ones: 0, label: '10 tens' }, then: { flats: 1, rods: 0, ones: 0, label: '100' }, connector: 'becomes', highlight: 'rods' }), true],
  ['base-ten · BESIDE is a comparison — never moves', F('base-ten-blocks', 'one flat, two rods and three cubes beside four rods and one cube', { state: { flats: 1, rods: 2, ones: 3, label: '123' }, then: { rods: 4, ones: 1, label: '41' }, connector: 'beside', showColumns: true }), false],
  ['base-ten · a single state has nothing to become', F('base-ten-blocks', 'four fused rods and seven loose cubes', { state: { rods: 4, ones: 7 }, showNumeral: true }), false],
  // --- 2. number line: the hops ---------------------------------------------
  ['number-line · one count-on hop (A17/B4)', F('number-line', 'a hop of three from five to eight', { min: 0, max: 12, marks: [{ at: 5 }], hops: [{ from: 5, to: 8, label: '+3' }] }), true],
  ['number-line · two hops, each with its landing', F('number-line', 'a hop of three then a hop of four', { min: 0, max: 12, marks: [{ at: 2 }, { at: 5 }, { at: 9, style: 'flag', label: '9' }], hops: [{ from: 2, to: 5, label: '+3' }, { from: 5, to: 9, label: '+4' }] }), true],
  ['number-line · four hops share the last tier (budget, not stagger)', F('number-line', 'four hops of two along a line to ten', { min: 0, max: 10, marks: [{ at: 2 }, { at: 4 }, { at: 6 }, { at: 8 }], hops: [{ from: 0, to: 2 }, { from: 2, to: 4 }, { from: 4, to: 6 }, { from: 6, to: 8 }] }), true],
  ['number-line · marks with no hops just arrive (C2)', F('number-line', 'a line from 0 to 100 counting by tens with a flag at 47', { min: 0, max: 100, step: 10, marks: [{ at: 47, style: 'flag', label: '47' }] }), true],
  ['number-line · the unknown mark (E6)', F('number-line', 'a line from minus ten to ten with dots at minus eight and three', { min: -10, max: 10, step: 2, marks: [{ at: -8 }, { at: 3, style: 'unknown' }] }), true],
  ['number-line · a bare ruler has nothing to say', F('number-line', 'a line from 0 to 2 cut into twenty-fourths', { min: 0, max: 2, partition: 24, labels: 'ends' }), false],
  // --- 3. column method: the algorithm in order ------------------------------
  ['column-method · the carry (D2/B13)', F('column-method', 'forty-seven plus twenty-six in columns, the carried one small above the tens', { op: '+', rows: [{ cells: ['1', ''], role: 'carry' }, { cells: ['4', '7'], role: 'operand' }, { cells: ['2', '6'], role: 'operand' }, { cells: ['7', '3'], role: 'result' }] }), true],
  ['column-method · borrow struck out (D2)', F('column-method', 'a subtraction with the tens digit struck and rewritten', { op: '−', rows: [{ cells: ['7', '13'], role: 'carry' }, { cells: ['8', '3'], role: 'operand', struck: [0, 1] }, { cells: ['2', '7'], role: 'operand' }, { cells: ['5', '6'], role: 'result' }] }), true],
  ['column-method · BLANK result ends the sequence at the rule', F('column-method', 'thirty-four plus twenty-five ruled off, the answer not yet written', { op: '+', rows: [{ cells: ['3', '4'], role: 'operand' }, { cells: ['2', '5'], role: 'operand' }, { cells: ['', ''], role: 'result' }] }), true],
  ['column-method · a highlighted column and a carry (×)', F('column-method', 'twenty-three times four with the ones column highlighted', { op: '×', highlightCols: [1], rows: [{ cells: ['1', ''], role: 'carry' }, { cells: ['2', '3'], role: 'operand' }, { cells: ['', '4'], role: 'operand' }, { cells: ['9', '2'], role: 'result' }] }), true],
  ['column-method · decimal alignment (D14)', F('column-method', 'two decimals stacked with the points in one line', { op: '+', pointAfterCol: 0, rows: [{ cells: ['2', '4', ''], role: 'operand' }, { cells: ['1', '3', '5'], role: 'operand' }, { cells: ['3', '7', '5'], role: 'result' }] }), true],
  // --- 4. math sentence: the pen-marks ---------------------------------------
  ['math-sentence · the take-away line, underlined (A16)', F('math-sentence', 'the line five minus two equals three written out large', { tokens: [{ text: '5' }, { text: '−' }, { text: '2' }, { text: '=' }, { text: '3', mark: 'underline' }] }), true],
  ['math-sentence · ring the step that goes first, box the blank (D21)', F('math-sentence', 'three plus four times two, the times step ringed', { tokens: [{ text: '3' }, { text: '+' }, { text: '4', mark: 'ring' }, { text: '×', mark: 'ring' }, { text: '2', mark: 'ring' }, { text: '=' }, { text: '▢', mark: 'box' }] }), true],
  ['math-sentence · a phrase reads-as its expression (E11)', F('math-sentence', 'the words three more than twice n, and under them the expression 2n plus 3', { tokens: [{ text: '3' }, { text: 'more' }, { text: 'than' }, { text: 'twice' }, { text: 'n', mark: 'underline' }], then: { connector: 'reads-as', tokens: [{ text: '2n' }, { text: '+' }, { text: '3' }] } }), true],
  ['math-sentence · one line becomes another', F('math-sentence', 'eight plus five, becoming eight plus two plus three', { tokens: [{ text: '8' }, { text: '+' }, { text: '5', mark: 'ring' }], then: { connector: 'becomes', tokens: [{ text: '8' }, { text: '+' }, { text: '2' }, { text: '+' }, { text: '3' }] } }), true],
  ['math-sentence · AND stacks two peers, no arrow', F('math-sentence', 'three plus four equals seven, and seven minus four equals three', { tokens: [{ text: '3' }, { text: '+' }, { text: '4' }, { text: '=' }, { text: '7' }], then: { connector: 'and', tokens: [{ text: '7' }, { text: '−' }, { text: '4' }, { text: '=' }, { text: '3' }] } }), true],
  ['math-sentence · a plain line with no pen-mark', F('math-sentence', 'six times three equals eighteen', { tokens: [{ text: '6' }, { text: '×' }, { text: '3' }, { text: '=' }, { text: '18' }] }), false],
  // --- 5. bar model: the brace ----------------------------------------------
  ['bar-model · missing addend, braced total (B7)', F('bar-model', 'a bar of thirteen split into eight and an unknown part', { bars: [{ segments: [{ value: 8, label: '8', fill: 'solid' }, { value: 5, label: '?', fill: 'hatch' }], total: '13' }] }), true],
  ['bar-model · twelve unit parts, brace underneath', F('bar-model', 'twelve equal parts braced as twelve in all', { bars: [{ segments: Array.from({ length: 12 }, () => ({ value: 1, fill: 'soft' as const })) }], brace: { label: '12 in all' } }), true],
  ['bar-model · two bars, brace at the side', F('bar-model', 'two bars bracketed together as twenty in all', { bars: [{ label: 'Maya', segments: [{ value: 6, label: '6' }] }, { label: 'Ben', segments: [{ value: 14, label: '14' }] }], brace: { label: '20 in all' } }), true],
  ['bar-model · times as many, to scale (D4)', F('bar-model', 'one short bar for Maya and four copies of it for Ben', { bars: [{ label: 'Maya', segments: [{ value: 6, label: '6' }] }, { label: 'Ben', segments: [{ value: 6 }, { value: 6 }, { value: 6 }, { value: 6 }], total: '?' }], scaleMax: 24 }), true],
  ['bar-model · bars with no brace do not move', F('bar-model', 'a four by four bar of parts', { bars: [{ segments: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }] }] }), false],
  // --- the eight types with no motion designed for them ----------------------
  ['area-grid · the four rooms (D8)', F('area-grid', 'a rectangle split into four rooms: 600, 80, 180 and 24', { rows: 2, cols: 2, rowLabels: ['20', '6'], colLabels: ['30', '4'], cellLabels: ['600', '80', '180', '24'] }), false],
  ['ten-frame · seven counters (A2)', F('ten-frame', 'a ten frame with seven counters', { filled: 7 }), false],
  ['counters · a join story (A14)', F('counters', 'three apples and two apples', { groups: [{ count: 3, icon: 'apple' }, { count: 2, icon: 'apple' }], relation: 'join' }), false],
  ['place-value · periods (D1)', F('place-value-chart', 'a place value chart showing 507036 grouped in threes', { digits: '507036', showPeriods: true }), false],
  ['clock · 2:55, the hour hand has drifted (C18)', F('clock', 'a clock reading five to three', { h: 2, m: 55, marks: 'minutes' }), false],
  ['coin-set · 63 cents (B16)', F('coin-set', 'two quarters, a dime and three pennies', { coins: [{ cents: 25, count: 2 }, { cents: 10, count: 1 }, { cents: 1, count: 3 }] }), false],
  ['coordinate-grid · first quadrant (D22)', F('coordinate-grid', 'a grid with a point at three across and seven up', { xMin: 0, xMax: 10, yMin: 0, yMax: 10, points: [{ x: 3, y: 7, label: '(3,7)' }] }), false],
  ['angle · triangle 40/60/80 (D23)', F('angle-figure', 'a triangle with angles forty, sixty and eighty degrees', { shape: 'triangle', angles: [40, 60, 80], labels: ['A', 'B', 'C'] }), false],
];

const SIZES = ['sm', 'md', 'lg'] as const;

let failures = 0;
let checks = 0;
function check(cond: boolean, label: string): boolean {
  checks++;
  if (!cond) {
    failures++;
    console.error(`  FAIL  ${label}`);
  }
  return cond;
}

const render = (fig: BBFigure, size: string, animate?: boolean): string =>
  R(React.createElement(BBFigureView as any, animate === undefined
    ? { figure: fig, size }
    : { figure: fig, size, animate }));

// ---------------------------------------------------------------------------
// The strip: everything animation adds to the markup, and nothing else.
// ---------------------------------------------------------------------------
const STYLE_BLOCK = /<style data-anim="1">[\s\S]*?<\/style>/g;
const HAS_STYLE = /<style data-anim="1">/;
const HAS_ANIM_CLASS = /class="bb-a-/;
const ANIM_CLASS = / class="bb-a-[^"]*"/g;
const LEN_STYLE = / style="--bb-len[^"]*"/g;
const strip = (h: string): string =>
  h.replace(STYLE_BLOCK, '').replace(ANIM_CLASS, '').replace(LEN_STYLE, '');

/** Every tag in a document, with its attribute text. */
function tags(html: string): Array<{ name: string; attrs: string }> {
  return [...html.matchAll(/<([a-zA-Z][\w-]*)((?:"[^"]*"|[^>"])*)>/g)]
    .map((m) => ({ name: m[1], attrs: m[2] }));
}

// ---------------------------------------------------------------------------
// True path lengths, measured INDEPENDENTLY of the renderer's own estimates.
//
// This is the half of L1 that lives in the geometry rather than the markup: a
// draw-on rests solid only if its dash covers the whole path, and `--bb-len`
// shorter than the real length leaves a permanent gap in the resting picture —
// which the byte comparison cannot see, because the markup is identical either
// way. Every drawn shape must be measurable here; a shape this cannot measure
// fails rather than being skipped quietly.
// ---------------------------------------------------------------------------
const num = (attrs: string, name: string): number | null => {
  const m = new RegExp(`${name}="(-?[\\d.]+)"`).exec(attrs);
  return m ? Number(m[1]) : null;
};

function ellipsePerimeter(rx: number, ry: number): number {
  let s = 0;
  let px = rx;
  let py = 0;
  for (let i = 1; i <= 720; i += 1) {
    const t = (i / 720) * 2 * Math.PI;
    const x = rx * Math.cos(t);
    const y = ry * Math.sin(t);
    s += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return s;
}

function quadArc(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number): number {
  let s = 0;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= 400; i += 1) {
    const t = i / 400;
    const u = 1 - t;
    const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
    const y = u * u * y0 + 2 * u * t * cy + t * t * y1;
    s += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return s;
}

/** The measured length of a drawn shape, or null if this gate cannot measure it. */
function trueLen(name: string, attrs: string): number | null {
  if (name === 'line') {
    const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map((a) => num(attrs, a));
    return x1 === null || y1 === null || x2 === null || y2 === null ? null : Math.hypot(x2 - x1, y2 - y1);
  }
  if (name === 'ellipse') {
    const rx = num(attrs, 'rx');
    const ry = num(attrs, 'ry');
    return rx === null || ry === null ? null : ellipsePerimeter(rx, ry);
  }
  if (name === 'path') {
    const d = /d="([^"]*)"/.exec(attrs)?.[1] ?? '';
    const q = /^M\s*(-?[\d.]+)\s+(-?[\d.]+)\s*Q\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s*$/.exec(d.trim());
    if (!q) return null;
    const [x0, y0, cx, cy, x1, y1] = q.slice(1).map(Number);
    return quadArc(x0, y0, cx, cy, x1, y1);
  }
  return null;
}

function animClasses(attrs: string): string[] {
  const m = /class="([^"]*)"/.exec(attrs);
  if (!m) return [];
  return m[1].split(/\s+/).filter((c) => c.startsWith('bb-a-'));
}

console.log('Best Brains micro-animation gate — MICRO-ANIMATIONS-SPEC §4\n');

// ---------------------------------------------------------------------------
// 0. The cases are well-formed figures by the shape gate's own rules.
// ---------------------------------------------------------------------------
for (const [name, fig] of CASES) {
  const probs = checkFigureShape(fig);
  check(probs.length === 0, `${name}: case is well-formed — ${probs[0] ?? ''}`);
}

// ---------------------------------------------------------------------------
// 1. L2/L4/L7 — read the stylesheet itself, not a promise about it.
// ---------------------------------------------------------------------------
console.log('— L2/L4/L7: the stylesheet');
{
  const kindDur = new Map<string, number>();
  for (const m of ANIM_CSS.matchAll(/\.bb-a-([a-z]+)\{animation:bb-a-\1 (\d+)ms ([a-z-]+) ([a-z]+)/g)) {
    kindDur.set(m[1], Number(m[2]));
    check(m[3] === 'ease-out', `L4: .bb-a-${m[1]} uses the ease-out family (found "${m[3]}")`);
    // Forwards fill would leave opacity/transform applied for ever, which costs
    // sub-pixel text antialiasing — an L1 break in the pixels, not the tags.
    check(m[4] === 'backwards', `L1: .bb-a-${m[1]} rests with nothing applied (fill mode "${m[4]}")`);
  }
  const delays = new Map<string, number>();
  for (const m of ANIM_CSS.matchAll(/\.bb-a-(d\d+)\{animation-delay:(\d+)ms\}/g)) {
    delays.set(m[1], Number(m[2]));
  }
  check(kindDur.size === 4, `four animation kinds declared (found ${kindDur.size})`);
  check(delays.size === MAX_TIER + 1, `${MAX_TIER + 1} delay tiers declared (found ${delays.size})`);
  for (const [kind, ms] of kindDur) {
    check(ms === (DUR as Record<string, number>)[kind], `.bb-a-${kind} duration matches DUR (${ms}ms)`);
  }
  for (const [d, ms] of delays) {
    check(ms === Number(d.slice(1)) * STEP, `.bb-a-${d} delay is tier × ${STEP}ms (${ms}ms)`);
  }

  // The worst LEGAL combination, independent of any case: last tier + longest.
  const worst = MAX_TIER * STEP + Math.max(...kindDur.values());
  check(worst <= BUDGET_MS, `L4: worst legal combination ${worst}ms ≤ ${BUDGET_MS}ms`);

  // Cascade order is load-bearing: `animation` resets animation-delay, so the
  // tier rules must come after the kind rules or every stagger is silently 0.
  const lastKind = Math.max(...[...kindDur.keys()].map((k) => ANIM_CSS.indexOf(`.bb-a-${k}{`)));
  const firstDelay = Math.min(...[...delays.keys()].map((d) => ANIM_CSS.indexOf(`.bb-a-${d}{`)));
  check(firstDelay > lastKind, 'L4: delay rules follow the kind rules in source order');

  // L2: once, never looping.
  check(!/infinite|alternate|animation-iteration-count/.test(ANIM_CSS), 'L2: no loop, no alternate, no iteration count');
  // L4: one ease-out family, and no way to overshoot. Every timing function in
  // the sheet is named and checked — a substring scan for "back" would flag the
  // `backwards` fill mode, which is the opposite of a defect.
  const timings = [...ANIM_CSS.matchAll(/(cubic-bezier\([^)]*\)|steps\([^)]*\)|ease-in-out|ease-in|ease-out|linear|\bease\b)/g)]
    .map((m) => m[1]);
  check(timings.length > 0, 'L4: the stylesheet declares its timing functions');
  for (const t of new Set(timings)) check(t === 'ease-out', `L4: every timing function is ease-out (found "${t}")`);
  check(!/cubic-bezier|steps\(/.test(ANIM_CSS), 'L4: no custom curve — an overshoot can only come from one');
  // L6: CSS only — no SMIL, no library.
  check(!/<animate|requestAnimationFrame/.test(ANIM_CSS), 'L6: no SMIL, no JS timeline');

  // L7: only opacity, transform and the stroke-dash pair are ever touched, and
  // every keyframe's `to` is the element's own resting state.
  const ALLOWED_PROPS = new Set(['opacity', 'transform', 'stroke-dasharray', 'stroke-dashoffset']);
  const RESTING: Record<string, string> = {
    opacity: '1', transform: 'none', 'stroke-dashoffset': '0',
  };
  for (const m of ANIM_CSS.matchAll(/@keyframes (bb-a-[a-z]+)\{from\{([^}]*)\}to\{([^}]*)\}\}/g)) {
    const [, name, from, to] = m;
    for (const decl of `${from};${to}`.split(';').filter(Boolean)) {
      const prop = decl.slice(0, decl.indexOf(':')).trim();
      check(ALLOWED_PROPS.has(prop), `L7: ${name} touches only allowed properties (found "${prop}")`);
    }
    for (const decl of to.split(';').filter(Boolean)) {
      const prop = decl.slice(0, decl.indexOf(':')).trim();
      const value = decl.slice(decl.indexOf(':') + 1).trim();
      if (prop === 'transform') {
        // identity only: translateY(0) / scale(1)
        check(/^(translate[XY]\(0(px)?\)|scale\(1\))$/.test(value), `L1: ${name} rests at an identity transform (found "${value}")`);
      } else if (prop === 'stroke-dasharray') {
        check(value === 'var(--bb-len)', `L1: ${name} rests with the dash covering the whole path`);
      } else {
        check(value === RESTING[prop], `L1: ${name} rests at ${prop}:${RESTING[prop]} (found "${value}")`);
      }
    }
  }
  check(/@media \(prefers-reduced-motion:reduce\)\{[^}]*animation:none\}/.test(ANIM_CSS), 'L3: the stylesheet itself disables motion under reduced-motion');
}

// ---------------------------------------------------------------------------
// 2. L1 — the animated figure rests at exactly the verified still.
// ---------------------------------------------------------------------------
console.log('— L1: end-state identity');
let l1Comparisons = 0;
for (const [name, fig, expectAnim] of CASES) {
  for (const size of SIZES) {
    const still = render(fig, size, false);
    const moving = render(fig, size, true);
    l1Comparisons++;
    check(strip(moving) === still, `L1 ${name} @${size}: stripped animation === the static render`);
    // Default off: an untouched call site draws what it drew before.
    check(render(fig, size) === still, `${name} @${size}: animate defaults to false`);
    // Scope: only the five treatments may move, and only where designed.
    check(HAS_ANIM_CLASS.test(moving) === expectAnim, `${name} @${size}: ${expectAnim ? 'animates' : 'does NOT animate'}`);
  }
}

// Negative control: the comparison must be able to FAIL. A real geometry
// change must survive the strip, or the check above proves nothing.
{
  const [, fig] = CASES[0];
  const moving = render(fig, 'md', true);
  const tampered = moving.replace(/width="(\d+(\.\d+)?)"/, (s, w) => s.replace(w, String(Number(w) + 1)));
  check(tampered !== moving, 'negative control: the tamper actually changed the markup');
  check(strip(tampered) !== render(fig, 'md', false), 'negative control: L1 comparison detects a geometry change');
  // And the strip must not be a blunt instrument that deletes everything.
  check(strip(moving).length > 0.5 * moving.length, 'negative control: the strip removes attributes, not the picture');
}

// ---------------------------------------------------------------------------
// 3. L4 — per-figure worst-case timing, from the emitted classes.
// ---------------------------------------------------------------------------
console.log('— L4: the 900ms budget, per figure');
// Controls for the measuring stick itself, before anything is measured with it.
{
  const l = trueLen('line', 'x1="0" y1="0" x2="3" y2="4"');
  check(l !== null && Math.abs(l - 5) < 1e-9, 'geometry control: a 3-4-5 line measures 5');
  const ring = trueLen('ellipse', 'rx="10" ry="10"');
  check(ring !== null && Math.abs(ring - 2 * Math.PI * 10) < 0.01, 'geometry control: a circle of r=10 measures 2πr');
  // A short jump drawn with a tall arc — the shape whose length is easiest to
  // under-estimate, and the one that would rest with a visible gap.
  // A short jump under a tall arc: the apex sits at half the control height, so
  // this curve is ~81 units long over a 10-unit chord. Any estimator that rounds
  // it towards the chord would leave four fifths of the hop missing at rest.
  const arc = trueLen('path', 'd="M 0 0 Q 5 -80 10 0"');
  check(arc !== null && arc > 78 && arc < 84, `geometry control: a peaked arc measures ${arc?.toFixed(1)} over a 10-unit chord`);
  check(trueLen('rect', 'x="0" y="0" width="5" height="5"') === null, 'geometry control: an unmeasurable shape is reported, never skipped');
}
{
  const kindDur = new Map<string, number>();
  for (const m of ANIM_CSS.matchAll(/\.bb-a-([a-z]+)\{animation:bb-a-\1 (\d+)ms/g)) kindDur.set(m[1], Number(m[2]));
  const delays = new Map<string, number>();
  for (const m of ANIM_CSS.matchAll(/\.bb-a-(d\d+)\{animation-delay:(\d+)ms\}/g)) delays.set(m[1], Number(m[2]));

  let slowest = 0;
  let slowestName = '(nothing animates)';
  let drawsMeasured = 0;
  /** The tightest dash-vs-path ratio seen; below 1 would rest with a gap. */
  let slack = Infinity;
  for (const [name, fig, expectAnim] of CASES) {
    for (const size of SIZES) {
      const html = render(fig, size, true);
      const body = html.replace(STYLE_BLOCK, '');
      let worst = 0;
      let animated = 0;
      for (const t of tags(body)) {
        const cs = animClasses(t.attrs);
        if (cs.length === 0) continue;
        animated++;
        const kinds = cs.filter((c) => kindDur.has(c.slice(5)));
        const tiers = cs.filter((c) => delays.has(c.slice(5)));
        check(kinds.length === 1 && tiers.length === 1,
          `L4 ${name} @${size}: <${t.name}> carries exactly one kind and one tier (${cs.join(' ')})`);
        if (kinds.length !== 1 || tiers.length !== 1) continue;
        // A draw with no length would animate a dash pattern of nothing; a draw
        // whose length is SHORT of the real path rests with a gap in it.
        if (kinds[0] === 'bb-a-draw') {
          const st = /style="([^"]*)"/.exec(t.attrs);
          const ok = check(!!st && /^--bb-len:\d+(\.\d+)?$/.test(st[1]),
            `L4 ${name} @${size}: <${t.name}> draw carries its own path length (${st?.[1] ?? 'none'})`);
          if (ok) {
            const declared = Number(st![1].split(':')[1]);
            const actual = trueLen(t.name, t.attrs);
            drawsMeasured++;
            if (check(actual !== null, `L1 ${name} @${size}: <${t.name}> is a shape this gate can measure`)) {
              check(declared >= actual!,
                `L1 ${name} @${size}: <${t.name}> rests solid — dash ${declared} ≥ path ${actual!.toFixed(1)}`);
              slack = Math.min(slack, declared / actual!);
            }
          }
        }
        worst = Math.max(worst, delays.get(tiers[0].slice(5))! + kindDur.get(kinds[0].slice(5))!);
      }
      check(worst <= BUDGET_MS, `L4 ${name} @${size}: motion finishes at ${worst}ms ≤ ${BUDGET_MS}ms`);
      // Classes with no stylesheet to define them would be inert, not additive.
      check(animated === 0 || HAS_STYLE.test(html),
        `${name} @${size}: ${animated} animated element(s) come with their stylesheet`);
      if (expectAnim && worst > slowest) { slowest = worst; slowestName = `${name} @${size}`; }
    }
  }
  console.log(`  slowest figure: ${slowest}ms — ${slowestName}`);
  console.log(`  ${drawsMeasured} drawn strokes measured; tightest dash/path ratio ${slack.toFixed(3)} (must be ≥ 1)`);
}

// ---------------------------------------------------------------------------
// 4. L3 — reduced motion is the still, immediately.
// ---------------------------------------------------------------------------
console.log('— L3: reduced motion');
{
  check(prefersReducedMotion() === false, 'L3 liveness: the flag reads false before it is set');
  (globalThis as any).matchMedia = (q: string) => ({ matches: /prefers-reduced-motion/.test(q) });
  check(prefersReducedMotion() === true, 'L3 liveness: the flag reads true once set');
  let reducedChecked = 0;
  for (const [name, fig] of CASES) {
    for (const size of SIZES) {
      const html = render(fig, size, true);
      reducedChecked++;
      check(!/bb-a-/.test(html) && !/data-anim/.test(html), `L3 ${name} @${size}: no animation of any kind`);
      check(html === render(fig, size, false), `L3 ${name} @${size}: byte-identical to the static render`);
    }
  }
  delete (globalThis as any).matchMedia;
  check(prefersReducedMotion() === false, 'L3 liveness: the flag reads false again once cleared');
  console.log(`  ${reducedChecked} reduced-motion renders carried no motion`);
}

// ---------------------------------------------------------------------------
// 5. L5 — `animate` is passed from LessonRoom, and nowhere else.
// ---------------------------------------------------------------------------
console.log('— L5: lesson surfaces only');
const FIG_TAGS = [
  'BBFigureView', 'PromptFigure',
  'NumberLineFig', 'BarModelFig', 'BaseTenBlocksFig', 'ColumnMethodFig', 'MathSentenceFig',
];
const PRIMITIVES = ['NumberLineFig', 'BarModelFig', 'BaseTenBlocksFig', 'ColumnMethodFig', 'MathSentenceFig'];
/**
 * LessonRoom is the trigger; BBFigureView is the forwarder that hands the flag
 * to the five primitives. Any other file, or any other tag inside those two,
 * is a surface that must never move.
 */
const ALLOWED: Record<string, string[]> = {
  'src/modules/best-brains/screens/LessonRoom.tsx': ['BBFigureView'],
  'src/modules/best-brains/components/figures/BBFigureView.tsx': PRIMITIVES,
};

/** Every (tag, passes-animate) pair in a source file. */
function figureTagsPassingAnimate(src: string): string[] {
  const hits: string[] = [];
  for (const tag of FIG_TAGS) {
    const re = new RegExp(`<${tag}\\b`, 'g');
    for (const m of src.matchAll(re)) {
      // The tag's own attribute text: up to the first '>' that is not part of '=>'.
      let i = m.index! + m[0].length;
      let attrs = '';
      let depth = 0;
      while (i < src.length) {
        const c = src[i];
        if (c === '{') depth++;
        else if (c === '}') depth--;
        else if (c === '>' && depth === 0 && src[i - 1] !== '=') break;
        attrs += c;
        i++;
      }
      if (/(^|[\s{])animate\b/.test(attrs)) hits.push(tag);
    }
  }
  return hits;
}

// Negative and positive controls for the detector, before it is trusted.
{
  const probe = (s: string) => figureTagsPassingAnimate(s).length;
  check(probe('<BBFigureView figure={f} animate />') === 1, 'L5 control: bare `animate` is detected');
  check(probe('<PromptFigure prompt={p} figure={f} animate={true} />') === 1, 'L5 control: `animate={true}` is detected');
  check(probe('<BBFigureView\n  figure={f}\n  animate\n/>') === 1, 'L5 control: a multi-line tag is detected');
  check(probe('<BBFigureView figure={f} size="lg" />') === 0, 'L5 control: a clean call site is not flagged');
  check(probe('const animate = true;\n<BBFigureView figure={f} />') === 0, 'L5 control: `animate` outside the tag is not flagged');
  check(probe('<BBFigureView figure={f} onDone={() => x > 1} />') === 0, 'L5 control: an arrow function in props does not end the tag');
}

const SRC = path.resolve('src');
function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}
{
  const seen: Record<string, string[]> = {};
  let scanned = 0;
  for (const file of walk(SRC)) {
    scanned++;
    const rel = path.relative(path.resolve('.'), file).split(path.sep).join('/');
    const hits = figureTagsPassingAnimate(fs.readFileSync(file, 'utf8'));
    if (hits.length) seen[rel] = hits;
    for (const tag of hits) {
      check((ALLOWED[rel] ?? []).includes(tag),
        `L5: ${rel} passes animate to <${tag}> — lesson surfaces only`);
    }
  }
  console.log(`  ${scanned} source files scanned`);
  // Positive control: the trigger and the forwarder must actually be wired, or
  // this scan is passing because nothing animates anywhere.
  check((seen['src/modules/best-brains/screens/LessonRoom.tsx'] ?? []).length === 1,
    'L5: LessonRoom passes animate to exactly one BBFigureView');
  const fwd = seen['src/modules/best-brains/components/figures/BBFigureView.tsx'] ?? [];
  check(PRIMITIVES.every((p) => fwd.includes(p)),
    `L5: BBFigureView forwards animate to all five primitives (found ${fwd.length})`);
  check(Object.keys(seen).length === 2, `L5: exactly two files touch animate (found ${Object.keys(seen).join(', ') || 'none'})`);
}

// ---------------------------------------------------------------------------
// 6. L6 — no new dependency, no second render path.
// ---------------------------------------------------------------------------
console.log('— L6: no library, no parallel render');
{
  const FIG_DIR = path.resolve('src/modules/best-brains/components/figures');
  for (const f of fs.readdirSync(FIG_DIR).filter((n) => /\.tsx?$/.test(n))) {
    const src = fs.readFileSync(path.join(FIG_DIR, f), 'utf8');
    check(!/from '(framer-motion|gsap|animejs|react-spring|lottie[^']*)'/.test(src), `L6: ${f} imports no animation library`);
    check(!/<animate|<animateTransform|<set\b/.test(src), `L6: ${f} uses no SMIL`);
    check(!/setTimeout|setInterval|requestAnimationFrame/.test(src), `L6: ${f} runs no JS timeline`);
  }
}

// ---------------------------------------------------------------------------
// 7. Coverage, for the record: what the five treatments actually reach.
// ---------------------------------------------------------------------------
console.log('— corpus reach (informational)');
try {
  const gen: any = await import('../src/modules/best-brains/generator');
  const ANIMATED = new Set(['base-ten-blocks', 'number-line', 'column-method', 'math-sentence', 'bar-model']);
  const byType = new Map<string, number>();
  let segs = 0;
  let withFigure = 0;
  for (const cell of gen.AVAILABLE_WEEKS) {
    const pack = gen.generatePack(cell.level, cell.week, 12345);
    for (const s of pack.explanation.script as Array<{ figure?: BBFigure }>) {
      segs++;
      if (!s.figure) continue;
      withFigure++;
      byType.set(s.figure.type, (byType.get(s.figure.type) ?? 0) + 1);
    }
  }
  const animated = [...byType.entries()].filter(([t]) => ANIMATED.has(t)).reduce((a, [, n]) => a + n, 0);
  console.log(`  ${gen.AVAILABLE_WEEKS.length} packs · ${segs} lesson-script segments · ${withFigure} carry a figure`);
  console.log(`  ${animated}/${withFigure} of those are one of the five animated types`);
  for (const [t, n] of [...byType.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${ANIMATED.has(t) ? '▸' : ' '} ${t.padEnd(20)} ${n}`);
  }
} catch (e) {
  console.log(`  (census skipped: ${(e as Error).message})`);
}

console.log(`\n${CASES.length} figures × ${SIZES.length} sizes · ${l1Comparisons} L1 comparisons · ${checks} checks.`);
console.log(failures === 0 ? 'ALL ANIMATION CHECKS PASS' : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
