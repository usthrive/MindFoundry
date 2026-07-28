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

import type { BBFigure, CounterIcon, FigureAssertion, MarkStyle } from '../../../figures/types';

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
export function arrangementFor(text: string): 'row' | 'rows' | 'scatter' | 'ring' {
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

/** Several groups side by side — sort/match/compare pictures. */
export function counterGroups(
  groups: Array<{ count: number; noun: string; label?: string }>,
  opts: { arrangement?: string; relation?: 'none' | 'join' | 'remove' | 'compare'; alt: string; asserts?: FigureAssertion } = { alt: '' },
): BBFigure {
  return {
    type: 'counters',
    alt: opts.alt,
    params: {
      groups: groups.map((g) => ({ count: g.count, icon: iconFor(g.noun), ...(g.label ? { label: g.label } : {}) })),
      arrangement: arrangementFor(opts.arrangement ?? 'row'),
      ...(opts.relation ? { relation: opts.relation } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/** A ten-frame (or five-frame, or double frame) holding `filled` counters. */
export function tenFrame(
  filled: number,
  opts: { frames?: number; size?: 5 | 10; hidden?: number; icon?: CounterIcon; alt?: string; asserts?: FigureAssertion } = {},
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
    rowLabels?: string[]; colLabels?: string[]; cellLabels?: string[]; showCounts?: boolean;
  },
  opts: { alt: string; asserts?: FigureAssertion },
): BBFigure {
  return { type: 'area-grid', alt: opts.alt, params, ...(opts.asserts ? { asserts: opts.asserts } : {}) };
}

/** Shorthand for the two assertions templates actually use. */
export const assertsAnswer: FigureAssertion = { equals: 'answer' };
export const assertsParam = (key: string, of?: string): FigureAssertion => ({
  equals: `param:${key}` as const,
  ...(of ? { of } : {}),
});
