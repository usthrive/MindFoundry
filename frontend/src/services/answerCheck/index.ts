/**
 * Answer checking for string-valued answers (Levels G and up, plus remainders).
 *
 * The rule throughout: mark the MATHS, not the notation. A child who writes a
 * correct answer in a different but equivalent form is right, and must be told so.
 */
import { expressionsEquivalent } from './expression'

/** Relations that can appear on the left of an answer: =, <, >, ≤, ≥. */
const RELATIONS = ['≤', '≥', '<', '>', '='] as const
type Relation = typeof RELATIONS[number]

const canonicalRelation = (raw: string): Relation | null => {
  const r = raw.trim()
  if (r === '<=' || r === '≤') return '≤'
  if (r === '>=' || r === '≥') return '≥'
  if (r === '<') return '<'
  if (r === '>') return '>'
  if (r === '=') return '='
  return null
}

/** "x ≥ 3.2" → { lhs: 'x', rel: '≥', rhs: '3.2' }; null if there is no relation. */
function splitRelation(s: string): { lhs: string; rel: Relation; rhs: string } | null {
  const m = s.match(/^(.*?)(<=|>=|[≤≥<>=])(.*)$/)
  if (!m) return null
  const rel = canonicalRelation(m[2])
  if (!rel) return null
  return { lhs: m[1].trim(), rel, rhs: m[3].trim() }
}

/** "x = 6 or x = 5" → ['x = 6', 'x = 5'] — order carries no meaning. */
function splitAlternatives(s: string): string[] | null {
  const parts = s.split(/\s+or\s+/i).map(p => p.trim()).filter(Boolean)
  return parts.length > 1 ? parts : null
}

const normalizeLoose = (s: string) => s.replace(/\s+/g, '').toLowerCase()

/**
 * "13 R 1", "13r1" and "x² - 2x, remainder 2" all mean quotient-plus-remainder.
 * Returns the two parts, or null if the answer is not of that shape.
 */
function splitRemainder(s: string): { quotient: string; remainder: string } | null {
  const word = s.match(/^(.+?),\s*remainder\s+(.+)$/i)
  if (word) return { quotient: word[1].trim(), remainder: word[2].trim() }
  // Bare "R" only counts between two numbers — otherwise it would swallow the
  // variable r in an answer like "r = d/t".
  const letter = s.match(/^\s*(-?\d+)\s*[rR]\s*(-?\d+)\s*$/)
  if (letter) return { quotient: letter[1], remainder: letter[2] }
  // Polynomial quotient followed by " R n"
  const poly = s.match(/^(.+?)\s+[rR]\s+(-?[\d.]+)\s*$/)
  if (poly) return { quotient: poly[1].trim(), remainder: poly[2].trim() }
  return null
}

/**
 * Does the answer read as prose rather than maths? Those answers ("two complex
 * conjugate roots") are not something a keyboard can fairly ask a child to
 * reproduce, so they fall back to a forgiving text comparison.
 */
function isProse(s: string): boolean {
  return /[a-z]{4,}/i.test(s.replace(/\b(x|y|i|pi)\b/gi, ''))
}

/** Compare one side of a relation, or a bare expression. */
function sidesMatch(a: string, b: string): boolean {
  if (normalizeLoose(a) === normalizeLoose(b)) return true
  return expressionsEquivalent(a, b)
}

/**
 * Is `given` an acceptable answer for `expected`?
 *
 * Handles, in order: prose, alternatives ("x = 6 or x = 5"), relations
 * ("y = 5x + 2", "x ≥ 3.2"), remainders ("13 R 1"), and plain expressions.
 */
export function checkStringAnswer(given: string, expected: string): boolean {
  const g = given.trim()
  const e = expected.trim()
  if (!g) return false
  if (normalizeLoose(g) === normalizeLoose(e)) return true

  // Remainder answers, arithmetic ("13 R 1") and polynomial ("x² - 2x, remainder 2").
  // The two notations mean the same thing, so either is accepted for either.
  const gr = splitRemainder(g), er = splitRemainder(e)
  if (er) return !!gr && sidesMatch(gr.quotient, er.quotient) && sidesMatch(gr.remainder, er.remainder)
  if (gr) return false

  if (isProse(e)) return normalizeLoose(g) === normalizeLoose(e)

  // "x = 6 or x = 5" — a set of answers; the order the child lists them is their own.
  const eAlts = splitAlternatives(e)
  if (eAlts) {
    const gAlts = splitAlternatives(g) ?? [g]
    if (gAlts.length !== eAlts.length) return false
    const used = new Set<number>()
    return eAlts.every(ea =>
      gAlts.some((ga, idx) => {
        if (used.has(idx)) return false
        if (!checkStringAnswer(ga, ea)) return false
        used.add(idx)
        return true
      })
    )
  }

  const eRel = splitRelation(e)
  if (eRel) {
    const gRel = splitRelation(g)
    if (!gRel) return false
    if (gRel.rel !== eRel.rel) return false
    // The subject must be the same variable; only the value may be rewritten.
    if (normalizeLoose(gRel.lhs) !== normalizeLoose(eRel.lhs)) return false
    return sidesMatch(gRel.rhs, eRel.rhs)
  }
  if (splitRelation(g)) return false // child gave an equation where none was asked for

  return sidesMatch(g, e)
}
