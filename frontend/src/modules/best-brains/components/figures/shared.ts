/**
 * Shared drawing contract for the Best Brains figure primitives (B1.0).
 *
 * Every primitive is a PURE function of its params: same params → identical
 * SVG. No randomness, no time, no measurement, no state, no external assets.
 * That is what lets a figure be generated from the item's own drawn values and
 * checked by QG-13 (`figures/assert.ts`).
 *
 * COLOUR LAW. Use `FIG` only. Two reasons, both load-bearing:
 *  - the module skin remaps *semantic* utility classes under `.mf-foundry`; a
 *    literal `red-*` class or a raw hex in a shared component leaks straight
 *    through it onto a child surface, and the child-safe law (R3) forbids a red
 *    mark on a child surface;
 *  - `/test-foundry` renders packs OUTSIDE `.mf-foundry`, so every token here
 *    carries a literal fallback and the pictures survive either context.
 *
 * CONTRAST LAW. Never encode a distinction in hue alone — shade + hatch, or
 * shade + outline. A double-shaded region (D18's fraction of a fraction) must
 * read as different from a single-shaded one in greyscale.
 */

import type { BBFigureType, FigureOf } from '../../figures/types';

/** The module palette, as CSS variables with literal fallbacks. */
export const FIG = {
  ink: 'var(--mf-ink, #2B3238)',
  inkMuted: 'var(--mf-ink-muted, #66717A)',
  inkFaint: 'var(--mf-ink-faint, #A9A093)',
  line: 'var(--mf-line, #E7E1D7)',
  surface: 'var(--mf-surface, #FFFFFF)',
  fill: 'var(--mf-fill, #F1EBE1)',
  fillSoft: 'var(--mf-fill-soft, #F5F2EC)',
  primary: 'var(--mf-primary, #3B7B78)',
  primaryDeep: 'var(--mf-primary-deep, #2C5E5C)',
  primarySoft: 'var(--mf-primary-soft, #E4F0EE)',
  accent: 'var(--mf-accent, #E39A57)',
  accentDeep: 'var(--mf-accent-deep, #B9773B)',
  accentSoft: 'var(--mf-accent-soft, #FBEEDD)',
  /** Neutral lavender — the module's "attention" hue. NEVER red. */
  attention: 'var(--mf-attention, #8B819B)',
  attentionSoft: 'var(--mf-attention-soft, #F0EDF4)',
} as const;

/** Stroke weights, so every primitive reads as one hand. */
export const STROKE = { hair: 1, thin: 1.5, base: 2, bold: 3, heavy: 4 } as const;

/** Type scale in viewBox units (primitives are drawn ~320 units wide). */
export const TEXT = { tiny: 9, small: 11, body: 13, large: 17, huge: 24 } as const;

export const FONT =
  "var(--mf-font-child, 'Avenir Next', Avenir, Seravek, 'Trebuchet MS', Verdana, sans-serif)";

/**
 * Render size. The interaction band picks it (`A` draws big for small hands and
 * unpractised eyes); primitives may use it to drop optional labels, never to
 * drop information the item depends on.
 */
export type FigureSize = 'sm' | 'md' | 'lg';

/** Props every primitive takes. `params` is that figure type's own shape. */
export interface FigurePartProps<T extends BBFigureType> {
  params: FigureOf<T>['params'];
  size: FigureSize;
}

/** Standard nominal drawing width in viewBox units. */
export const W = 320;

/** A stable id fragment for defs (patterns/markers) — no randomness allowed. */
export function defId(kind: string, key: string | number): string {
  return `mf-fig-${kind}-${key}`;
}

/** Round to 2dp so serialized SVG is byte-stable across platforms. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
