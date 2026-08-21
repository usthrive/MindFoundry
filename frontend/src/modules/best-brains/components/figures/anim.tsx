/**
 * Micro-animations for the lesson figures — the whole vocabulary, in one file.
 *
 * THE LOAD-BEARING DECISION (MICRO-ANIMATIONS-SPEC §0): motion is a PATH TO the
 * verified still, never a replacement for it. The figure system's own history
 * argues against animation — `786f8a8`: "Stepping the lesson IS the motion, and
 * a pre-reader can dwell on the middle state, which a playing animation denies
 * him." That argument is honoured here rather than overruled, and the honouring
 * is STRUCTURAL, not a promise:
 *
 *   - Animation is ADDITIVE. Every class below is applied to an element the
 *     static render already draws, at the coordinates it already has. There is
 *     no second render path, so there is no second picture to drift.
 *   - Every keyframe's `to` is the element's OWN resting state — opacity 1, an
 *     identity transform, a dash pattern that covers the whole path — and the
 *     fill mode is `backwards`, so when the animation ends nothing at all
 *     remains applied and the element rests as the static render draws it.
 *     `bb-animation-test` strips these classes and byte-compares the markup
 *     against the `animate={false}` render to keep that true (L1).
 *   - Only opacity, transform and the stroke-dash pair are ever touched (L7).
 *     Nothing is redrawn as something else; no text changes mid-flight.
 *   - Nothing loops (L2), nothing overshoots, one ease-out family (L4).
 *
 * WHY DELAYS ARE CLASSES, NOT INLINE STYLES. A stagger tier is `bb-a-d3`, and
 * the delay it means is declared once in the stylesheet below. That keeps the
 * per-element addition to a `class` attribute (trivially strippable for the L1
 * comparison), and it lets the gate compute each figure's true worst-case
 * duration by reading the same CSS the browser reads, rather than trusting a
 * number in a comment.
 *
 * ORDER IN `ANIM_CSS` IS LOAD-BEARING: the `.bb-a-<kind>` rules use the
 * `animation` shorthand, which resets `animation-delay` to 0, so the
 * `.bb-a-d<n>` rules must come after them to win the cascade. The gate asserts
 * that ordering.
 */

import type { CSSProperties, ReactElement } from 'react';

/** The prop the five animated primitives take. Default false, everywhere. */
export interface AnimProps {
  /**
   * Lesson surfaces only (L5) — LessonRoom is the sole caller, enforced by the
   * gate's static scan, not by convention. Item surfaces never animate:
   * watching a carry digit appear IS the answer on an assessed page.
   */
  animate?: boolean;
}

export type AnimKind = 'fade' | 'draw' | 'drop' | 'land';

/** Milliseconds between stagger tiers; tier n waits n × STEP. */
export const STEP = 70;

/** Highest tier any treatment may use. */
export const MAX_TIER = 9;

/** L4's ceiling: no figure's motion may finish later than this. */
export const BUDGET_MS = 900;

/**
 * Durations, chosen so that the worst legal combination — the last tier plus
 * the longest animation — still lands inside the budget:
 * 9 × 70ms + 260ms = 890ms ≤ 900ms. That is what makes any tier assignment
 * safe by construction rather than by arithmetic in a reviewer's head.
 */
export const DUR: Record<AnimKind, number> = { fade: 240, draw: 260, drop: 220, land: 240 };

/**
 * A dash-length safety margin. `--bb-len` must be at least the path's true
 * length or the resting state keeps a visible gap — an L1 break that no markup
 * comparison could catch, since it lives in the geometry rather than the tags.
 * Lengths here are estimates by design (no measurement is allowed in a
 * primitive), so they are rounded UP.
 */
const LEN_MARGIN = 1.04;

/**
 * `backwards`, NOT `both` — and this is the fix that makes L1 true in PIXELS
 * rather than only in tags.
 *
 * Backwards fill holds the `from` frame during the delay (which is what makes a
 * stagger possible) and then, once the animation ends, applies NOTHING: the
 * element rests in its own natural state, which IS the static render. With
 * `both` the final frame stays applied for ever, and a permanently-applied
 * `opacity: 1` or identity `transform` is not free — Chrome rasterises those
 * elements through a compositing path that drops sub-pixel text antialiasing.
 * The markup was identical and the picture still came out different; a
 * screenshot comparison caught 7,395 pixels of it across seven figures.
 *
 * Every animation here is authored so the last keyframe and the natural state
 * are the same picture (opacity 1, identity transform, a dash covering the
 * whole path), so the hand-off at the end is invisible.
 */
const KIND_RULES: Record<AnimKind, string> = {
  // Arrives. Rests at the element's own opacity.
  fade: `.bb-a-fade{animation:bb-a-fade ${DUR.fade}ms ease-out backwards}`,
  // Draws itself along its own path. The last frame is a dash covering the
  // whole length, which is what the undashed resting stroke already looks
  // like. Only ever applied to strokes that are SOLID in the still.
  draw: `.bb-a-draw{animation:bb-a-draw ${DUR.draw}ms ease-out backwards}`,
  // Falls a few units into place (a carry digit written above its column).
  drop: `.bb-a-drop{animation:bb-a-drop ${DUR.drop}ms ease-out backwards}`,
  // Settles onto a landing point. `fill-box` so the scale is about the mark
  // itself; both properties are inert once no transform is being applied.
  land: `.bb-a-land{animation:bb-a-land ${DUR.land}ms ease-out backwards;transform-box:fill-box;transform-origin:center}`,
};

/**
 * The stylesheet, inlined into each animated figure's own `<svg>` (L6: no
 * library, no SMIL, no new dependency — CSS the browser already runs).
 *
 * `stroke-dashoffset` runs from −len to 0 rather than +len to 0 so the stroke
 * grows from its START: an arrow must grow towards its head, an underline must
 * run the way a hand moves.
 */
export const ANIM_CSS = [
  '@keyframes bb-a-fade{from{opacity:0}to{opacity:1}}',
  '@keyframes bb-a-draw{from{stroke-dasharray:var(--bb-len);stroke-dashoffset:calc(var(--bb-len) * -1)}'
    + 'to{stroke-dasharray:var(--bb-len);stroke-dashoffset:0}}',
  '@keyframes bb-a-drop{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}',
  '@keyframes bb-a-land{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}',
  KIND_RULES.fade,
  KIND_RULES.draw,
  KIND_RULES.drop,
  KIND_RULES.land,
  // Delay tiers LAST: the shorthand above resets animation-delay.
  ...Array.from({ length: MAX_TIER + 1 }, (_, n) => `.bb-a-d${n}{animation-delay:${n * STEP}ms}`),
  // L3, as a runtime backstop to the render-time check in BBFigureView: a child
  // who should not see motion gets the finished picture, at once. No fade
  // substitute — `animation:none` leaves every element in its natural state,
  // which IS the still.
  '@media (prefers-reduced-motion:reduce){.bb-a-fade,.bb-a-draw,.bb-a-drop,.bb-a-land{animation:none}}',
].join('\n');

/**
 * Does this environment ask for less motion? Read once per render, in
 * `BBFigureView`, so a primitive stays a pure function of its props.
 *
 * Deliberately reads `globalThis.matchMedia` rather than `window`: the gate
 * sets the flag without pretending to be a browser, and a non-DOM render (the
 * figure suites) answers false without a guard at every call site.
 */
export function prefersReducedMotion(): boolean {
  const mm = (globalThis as { matchMedia?: (q: string) => { matches?: boolean } }).matchMedia;
  if (typeof mm !== 'function') return false;
  try {
    return !!mm('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** What `anim()` adds to an element: a class, and for a draw, its path length. */
export interface AnimAttrs {
  className?: string;
  style?: CSSProperties;
}

const NONE: AnimAttrs = Object.freeze({});

/**
 * The animation attributes for one element, or nothing at all when the figure
 * is static. Spread onto an element the static render already draws:
 *
 *   <line {...anim(A, 'draw', 2, lineLen(x1, y1, x2, y2))} x1={…} … />
 *
 * When `on` is false this is an empty object, so the static markup is
 * byte-identical to what it was before animation existed — that is the
 * default on every surface except LessonRoom.
 */
export function anim(on: boolean | undefined, kind: AnimKind, tier: number, len?: number): AnimAttrs {
  if (!on) return NONE;
  const t = Math.max(0, Math.min(MAX_TIER, Math.round(tier)));
  const className = `bb-a-${kind} bb-a-d${t}`;
  if (kind !== 'draw') return { className };
  const raw = Number.isFinite(len) && (len as number) > 0 ? (len as number) : 0;
  const padded = Math.max(1, Math.round(raw * LEN_MARGIN * 10) / 10 + 1);
  return { className, style: { '--bb-len': String(padded) } as CSSProperties };
}

/** The stylesheet, emitted inside an animated figure's own SVG (never otherwise). */
export function AnimStyle({ on }: { on?: boolean }): ReactElement | null {
  return on ? <style data-anim="1">{ANIM_CSS}</style> : null;
}

// --- path lengths, for the draw-on ------------------------------------------
// Estimates only, and never used for positioning — a primitive may not measure.

export function lineLen(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

/** Ramanujan's approximation — good to ~1e-5 for the ring's aspect ratios. */
export function ellipseLen(rx: number, ry: number): number {
  const a = Math.abs(rx);
  const b = Math.abs(ry);
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}

/**
 * Quadratic Bézier length, as the sum of its subdivided control polygons.
 *
 * THE BOUND MUST BE AN OVER-ESTIMATE, because the two errors are not
 * symmetric: too LONG only means the stroke finishes drawing slightly before
 * its window closes, while too SHORT leaves a dash gap in the RESTING picture —
 * an L1 break living in the geometry, where no markup comparison could ever see
 * it. A number-line hop can be very peaked (a short jump under a tall arc), and
 * the obvious chord/polygon mean under-estimates exactly those.
 *
 * A curve is never longer than its own control polygon, so subdividing and
 * summing keeps the guarantee while converging down onto the true length —
 * eight pieces land within a fraction of a percent, which is why the draw does
 * not visibly finish early.
 */
export function quadLen(
  x0: number, y0: number, cx: number, cy: number, x1: number, y1: number,
): number {
  const N = 8;
  const at = (t: number): [number, number] => {
    const u = 1 - t;
    return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1];
  };
  // The two de Casteljau midpoints; the sub-curve on [a,b] has control point
  // lerp(lerp(P0,P1,a), lerp(P1,P2,a), b).
  const lo = (t: number): [number, number] => [x0 + (cx - x0) * t, y0 + (cy - y0) * t];
  const hi = (t: number): [number, number] => [cx + (x1 - cx) * t, cy + (y1 - cy) * t];

  let total = 0;
  for (let i = 0; i < N; i += 1) {
    const a = i / N;
    const b = (i + 1) / N;
    const q0 = at(a);
    const q2 = at(b);
    const la = lo(a);
    const ma = hi(a);
    const q1: [number, number] = [la[0] + (ma[0] - la[0]) * b, la[1] + (ma[1] - la[1]) * b];
    total += Math.hypot(q1[0] - q0[0], q1[1] - q0[1]) + Math.hypot(q2[0] - q1[0], q2[1] - q1[1]);
  }
  return total;
}
