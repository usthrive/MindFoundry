/**
 * Choice order (METHODOLOGY-MODEL §7; ENGINE-SPEC §3.5; L43, L53).
 *
 * Two things rotate, and the gate measures both over 200 seeds:
 *   - DISPLAY ORDER: the key's displayed position is picked by a hash that has the key's
 *     own content folded into it, then the other choices are shuffled around it. A
 *     position never predicts the key.
 *   - NUMERIC RANK (number choices only): from a pool of honest misconception values, a
 *     target rank for the key is picked first among the ranks the pool can reach, then
 *     pool values that put the key there. Values that collide with the key or with each
 *     other are dropped (the rule could not be named); if what is left cannot make a
 *     four-choice set, the caller redraws its numbers. Nothing is patched by hand.
 */

import { streamRng, type Rng } from '../../../best-brains/generator/rng'
import type { ChoiceContent, SMChoice } from '../../types'

export const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

/** Canonical text of a choice's content (the key's identity for QG-5 and the order hash). */
export function contentCanon(c: ChoiceContent): string {
  switch (c.kind) {
    case 'number': return `n:${c.value}`
    case 'pair': return `pair:${c.a},${c.b}`
    case 'bond': return `bond:${c.bond.whole}|${c.bond.parts.map(String).sort().join(',')}`
    case 'sentence': return `s:${c.text}`
    case 'picture': return `pic:${c.fullTen ? 'ten+' : ''}${c.ones}`
    case 'row': return `row:${c.which}`
  }
}

export interface Draft {
  text: string
  content: ChoiceContent
  rule: string | null
}

/**
 * Serve the key and its distractors in display order. The key's position is picked by a
 * stream whose label carries the key's content (folded into the hash), so across seeds
 * each position holds the key about equally often.
 */
export function orderChoices(seed: number, label: string, key: Draft, others: Draft[]): SMChoice[] {
  const n = others.length + 1
  const r = streamRng(seed, `sm:order:${label}:${contentCanon(key.content)}`)
  const pos = r.int(0, n - 1)
  const rest = r.shuffle(others)
  const ordered: Draft[] = [...rest.slice(0, pos), key, ...rest.slice(pos)]
  return ordered.map((d, i) => ({ key: KEYS[i], text: d.text, content: d.content, rule: d.rule }))
}

export interface PoolValue {
  rule: string
  value: number
}

/** Ranks the key can take with `below` values under it and `above` over it (0 = smallest). */
export function reachableRanks(below: number, above: number, pick = 3): number[] {
  const out: number[] = []
  for (let r = 0; r <= pick; r++) if (below >= r && above >= pick - r) out.push(r)
  return out
}

/**
 * Pick three pool values for a numeric choice. Returns null when the honest pool cannot
 * make a set (the caller redraws its numbers). Collisions (with the key or each other,
 * or a negative value) are dropped, never patched.
 */
export function pickNumeric(rng: Rng, key: number, pool: PoolValue[]): { chosen: PoolValue[]; rank: number; dropped: PoolValue[] } | null {
  const counts = new Map<number, number>()
  for (const p of pool) counts.set(p.value, (counts.get(p.value) ?? 0) + 1)
  const kept: PoolValue[] = []
  const dropped: PoolValue[] = []
  for (const p of pool) {
    if (p.value === key || p.value < 0 || (counts.get(p.value) ?? 0) > 1) dropped.push(p)
    else kept.push(p)
  }
  const below = kept.filter((p) => p.value < key)
  const above = kept.filter((p) => p.value > key)
  const ranks = reachableRanks(below.length, above.length)
  if (ranks.length === 0) return null
  const rank = rng.pick(ranks)
  const chosen = [...rng.shuffle(below).slice(0, rank), ...rng.shuffle(above).slice(0, 3 - rank)]
  return { chosen, rank, dropped }
}

/** The key's numeric rank among a set of choice values (0 = smallest). */
export function numericRank(key: number, values: number[]): number {
  return values.filter((v) => v < key).length
}
