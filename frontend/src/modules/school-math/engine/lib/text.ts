/**
 * Small text helpers: counted nouns, number sentences, and the word counter the
 * readability rule uses (≤ 10 words a sentence; symbols are not words).
 *
 * Counted nouns go through Best Brains' `countNoun` (imported read-only). Two nouns it
 * does not know are kept the same in the plural here ("1 fish", "3 fish"); every other
 * noun is passed straight through.
 */

import { countNoun, unitFor } from '../../../best-brains/generator/templates/lib/format'
import { MINUS } from './misconceptions'

const SAME_PLURAL = new Set(['fish', 'sheep'])

/** "1 duck", "4 ducks", "3 fish". */
export function thing(n: number, noun: string): string {
  return SAME_PLURAL.has(noun) ? `${n} ${noun}` : countNoun(n, noun)
}

/** The noun alone, agreeing with n. */
export function nounFor(n: number, noun: string): string {
  return SAME_PLURAL.has(noun) ? noun : unitFor(n, noun)
}

/** Normalise a typed or built sentence: true minus, single spaces, □ for a blank. */
export function normSentence(s: string): string {
  return s.replace(/-/g, MINUS).replace(/\?/g, '□').replace(/\s*([+−=])\s*/g, ' $1 ').replace(/\s+/g, ' ').trim()
}

function evalSide(side: string): number | null {
  const toks = side.trim().split(/\s+/)
  if (toks.length % 2 === 0) return null
  let acc = Number(toks[0])
  if (!Number.isFinite(acc)) return null
  for (let i = 1; i < toks.length; i += 2) {
    const v = Number(toks[i + 1])
    if (!Number.isFinite(v)) return null
    if (toks[i] === '+') acc += v
    else if (toks[i] === MINUS) acc -= v
    else return null
  }
  return acc
}

/** Is a full number sentence true? null when it has a blank or does not parse. */
export function evalSentence(s: string): boolean | null {
  const n = normSentence(s)
  if (n.includes('□')) return null
  const sides = n.split('=')
  if (sides.length !== 2) return null
  const l = evalSide(sides[0])
  const r = evalSide(sides[1])
  if (l === null || r === null) return null
  return l === r
}

/** The sentences of a text (split after . ? !). */
export function sentencesOf(text: string): string[] {
  return text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean)
}

/** Words in a sentence: tokens with a letter or digit (+, −, =, □ are not words). */
export function wordCount(sentence: string): number {
  return sentence.split(/\s+/).filter((t) => /[A-Za-z0-9]/.test(t)).length
}

/** Numeric tokens in a line. */
export function numbersIn(text: string): number[] {
  return (text.match(/\d+/g) ?? []).map(Number)
}
