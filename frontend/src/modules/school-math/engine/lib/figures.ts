/**
 * Figure constructors. Every figure shape comes from the shared figure library
 * (best-brains/figures/types.ts; one definition), and every `spoken` line from the
 * library's `partWholeSpoken` unless a template names its own (the error item's
 * "a child's number bond"). `alt` (the accessible name) is the spoken line: it never
 * names a value the child is asked for (ENGINE-SPEC §6.4).
 */

import type { BondShape, SMFigure, SMInteraction } from '../../types'
import { partWholeSpoken } from '../../../best-brains/figures/prompt'

/** Countable counters, used only where counting is the step (EXEMPLAR §4). */
export function countersFig(count: number, arrangement: 'scatter' | 'row', interaction: SMInteraction, spoken: string): SMFigure {
  return { type: 'counters', alt: spoken, spoken, params: { groups: [{ count }], arrangement }, interaction }
}

/** A bond; `childWork` marks a child's own (possibly false) bond in an error item. */
export function bondFig(bond: BondShape, opts: { spoken?: string; childWork?: boolean } = {}): SMFigure {
  const spoken = opts.spoken ?? partWholeSpoken({ type: 'number-bond', params: { bond } })
  return { type: 'number-bond', alt: spoken, spoken, params: opts.childWork ? { bond, childWork: true } : { bond } }
}

/** Fixed shapes, each carrying its number; nothing countable (L33). */
export function groupsFig(groups: number[], shape = 'counter'): SMFigure {
  const spoken = partWholeSpoken({ type: 'groups', params: { shape, groups } })
  return { type: 'groups', alt: spoken, spoken, params: { shape, groups } }
}

export function splitListFig(whole: number, rows: Array<{ first: number; second: number | null }>): SMFigure {
  const spoken = partWholeSpoken({ type: 'split-list', params: { whole, rows } })
  return { type: 'split-list', alt: spoken, spoken, params: { whole, rows } }
}

export function matchRowsFig(top: { count: number; spread: boolean }, bottom: { count: number; spread: boolean }): SMFigure {
  const spoken = partWholeSpoken({ type: 'match-rows', params: { top, bottom } })
  return { type: 'match-rows', alt: spoken, spoken, params: { top, bottom } }
}

export function sceneFig(setting: string, shape: string, groups: number[]): SMFigure {
  const spoken = partWholeSpoken({ type: 'scene', params: { setting, shape, groups } })
  return { type: 'scene', alt: spoken, spoken, params: { setting, shape, groups } }
}

export function trackFig(cells: Array<number | null>): SMFigure {
  const spoken = partWholeSpoken({ type: 'track-window', params: { cells } })
  return { type: 'track-window', alt: spoken, spoken, params: { cells } }
}

/** The numbers a figure prints for the child (SM-FIG: each must be a given). */
export function printedNumbers(f: SMFigure): number[] {
  const nums = (xs: unknown[]) => xs.filter((x): x is number => typeof x === 'number')
  switch (f.type) {
    case 'number-bond': return nums([f.params.bond.whole, ...f.params.bond.parts])
    case 'groups':
    case 'scene': return f.params.groups
    case 'split-list': return [f.params.whole, ...nums(f.params.rows.flatMap((r) => [r.first, r.second]))]
    case 'track-window': return nums(f.params.cells)
    case 'match-rows': return []
    case 'counters': return []
  }
}
