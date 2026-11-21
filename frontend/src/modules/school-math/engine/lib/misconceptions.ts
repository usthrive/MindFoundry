/**
 * The misconception library (ENGINE-SPEC §3.4; EXEMPLAR-G1-U02 §5).
 *
 * Every wrong value the engine shows or names — a choice-pool value, the error item's
 * shown answer, a review line that names his likely rule — is made by a rule here, as a
 * pure function of the item's own numbers. The validator (QG-11) re-derives each one, so
 * a value whose named rule gives another number cannot ship (S5, L34).
 *
 * Argument names (each template's `verifyFor` returns them):
 *   w whole · p shown / taken part · k the key (the missing part) · a, b two parts ·
 *   seen the number a box-copier copies · story 0 join / 1 take-away · n a U01/U04 number ·
 *   before 1 "just before" / 0 "just after" · top, bottom, spreadTop the matched rows.
 *
 * Each rule's honest condition is in its code: `values` returns [] when the rule cannot
 * honestly be named on this draw, and `side` is checked against the key wherever a pool
 * shows the value (`sideHolds`).
 */

import type { BondCell, BondShape, ChoiceContent } from '../../types'

export type RuleArgs = Record<string, number>
export type Side = 'below' | 'above' | 'either' | 'none'

export interface MisRule {
  id: string
  /** What the child does (plain words; for the grown-up and the judges). */
  what: string
  /** Where the value sits beside the key, when the rule makes a number. */
  side: Side
  /** The review line (child-facing; number-free; ≤ 10 words a sentence; never "wrong"). */
  line: string
  /** Number rules: the value(s) this rule gives on these numbers; [] = not honest here. */
  values?: (a: RuleArgs) => number[]
  /** Content rules (pairs, bonds, sentences, pictures, rows): does this content come from the rule? */
  check?: (c: ChoiceContent, a: RuleArgs) => boolean
}

const has = (a: RuleArgs, k: string) => typeof a[k] === 'number' && Number.isFinite(a[k])
const need = (a: RuleArgs, ...ks: string[]) => {
  for (const k of ks) if (!has(a, k)) throw new Error(`rule args missing '${k}'`)
}

/** Sentences are written with the true minus sign and single spaces. */
export const MINUS = '−'
export const add = (x: number | string, y: number | string, z: number | string) => `${x} + ${y} = ${z}`
export const sub = (x: number | string, y: number | string, z: number | string) => `${x} ${MINUS} ${y} = ${z}`

function sameMultiset(cells: BondCell[], want: BondCell[]): boolean {
  if (cells.length !== want.length) return false
  const a = cells.map(String).sort()
  const b = want.map(String).sort()
  return a.every((x, i) => x === b[i])
}
const isNum = (c: BondCell): c is number => typeof c === 'number'
const bondOf = (c: ChoiceContent): BondShape | null => (c.kind === 'bond' ? c.bond : null)

export const RULES: Record<string, MisRule> = {
  'bond.repeat-shown': {
    id: 'bond.repeat-shown', what: 'writes the part he can see in the empty part', side: 'below',
    line: 'That part is shown. Find the hidden part.',
    values: (a) => { need(a, 'p'); return [a.p] },
  },
  'bond.whole-as-part': {
    id: 'bond.whole-as-part', what: "puts the whole in a part's place", side: 'above',
    line: 'The whole circle holds everything.',
    values: (a) => { need(a, 'w'); return [a.w] },
    check: (c, a) => {
      if (c.kind === 'sentence') {
        // which_sentence: "w + a = b" — the whole written where a part goes.
        need(a, 'w', 'a', 'b')
        return c.text === add(a.w, a.a, a.b)
      }
      const bond = bondOf(c)
      if (!bond) return false
      if (has(a, 'story') && a.story === 1) {
        // take-away story: the whole sits in a part circle, the taken part in the whole.
        need(a, 'w', 'p')
        return bond.whole === a.p && sameMultiset(bond.parts, [a.w, '?'])
      }
      need(a, 'w')
      return bond.whole !== a.w && bond.parts.some((x) => x === a.w)
    },
  },
  'bond.added': {
    id: 'bond.added', what: 'adds the whole and the shown part', side: 'above',
    line: 'We are finding a part. A part is smaller.',
    values: (a) => { need(a, 'w', 'p'); return [a.w + a.p] },
  },
  'bond.sum-off-by-one': {
    id: 'bond.sum-off-by-one', what: 'a bond whose parts make one more or one fewer than the whole (a counting slip)', side: 'none',
    line: 'Check that the two parts make the whole.',
    check: (c, a) => {
      if (c.kind === 'pair') {
        need(a, 'w')
        return c.a >= 1 && c.b >= 1 && Math.abs(c.a + c.b - a.w) === 1
      }
      const bond = bondOf(c)
      if (!bond) return false
      if (has(a, 'story')) {
        if (a.story === 0) {
          need(a, 'a', 'b')
          if (bond.whole !== '?') return false
          const [x, y] = bond.parts
          if (!isNum(x) || !isNum(y)) return false
          return (sameMultiset([x, y], [a.a, a.b + 1]) || sameMultiset([x, y], [a.a, a.b - 1])
            || sameMultiset([x, y], [a.a + 1, a.b]) || sameMultiset([x, y], [a.a - 1, a.b])) && x >= 1 && y >= 1
        }
        // a take-away bond whose WHOLE is off by one is bond.whole-off-by-one (Opus re-check)
        return false
      }
      need(a, 'w')
      const [x, y] = bond.parts
      return bond.whole === a.w && isNum(x) && isNum(y) && x >= 1 && y >= 1 && Math.abs(x + y - a.w) === 1
    },
  },
  'bond.whole-off-by-one': {
    id: 'bond.whole-off-by-one', what: 'a take-away story bond with the whole one more or one fewer than the story start (a counting slip on the start)', side: 'none',
    line: 'How many were there at the start?',
    check: (c, a) => {
      const bond = bondOf(c)
      if (!bond || !has(a, 'story') || a.story !== 1) return false
      need(a, 'w', 'p')
      return isNum(bond.whole) && Math.abs(bond.whole - a.w) === 1 && bond.whole > a.p && sameMultiset(bond.parts, [a.p, '?'])
    },
  },
  'count.stop-short': {
    id: 'count.stop-short', what: 'counts on from the part and stops one word before the whole', side: 'below',
    line: 'Count on again. Stop when you say the whole.',
    values: (a) => { need(a, 'k'); return a.k - 1 >= 1 ? [a.k - 1] : [] },
  },
  // L1 (splitting) comes before L2 teaches "the whole" (Opus re-check): the same act, L1's words
  'count.stop-short-split': {
    id: 'count.stop-short-split', what: 'counts on from the first number and stops one word early', side: 'below',
    line: 'Count on again. Stop at the number we split.',
    values: (a) => { need(a, 'k'); return a.k - 1 >= 1 ? [a.k - 1] : [] },
  },
  'count.start-counted': {
    id: 'count.start-counted', what: 'counts on with the start counted as the first word', side: 'above',
    line: 'Start at the part. Do not count it again.',
    values: (a) => { need(a, 'k'); return [a.k + 1] },
  },
  'add.count-first-twice': {
    id: 'add.count-first-twice', what: 'counts all and counts the first object twice', side: 'above',
    line: 'Count the first part once. Then count on.',
    values: (a) => { need(a, 'a', 'b'); return [a.a + a.b + 1] },
  },
  'add.stop-short': {
    id: 'add.stop-short', what: 'counts on and stops one early', side: 'below',
    line: 'Count on all of the other part.',
    values: (a) => { need(a, 'a', 'b'); return a.a + a.b - 1 >= 1 ? [a.a + a.b - 1] : [] },
  },
  'add.subtracted': {
    id: 'add.subtracted', what: 'takes away on a + item', side: 'below',
    line: 'Look at the sign. It says put together.',
    values: (a) => { need(a, 'a', 'b'); return a.a !== a.b ? [Math.abs(a.a - a.b)] : [] },
  },
  'add.part-from-sum': {
    id: 'add.part-from-sum', what: 'a sentence with a part equal to the whole plus a part', side: 'none',
    line: 'The whole is the biggest number.',
    check: (c, a) => { need(a, 'w', 'a', 'b'); return c.kind === 'sentence' && c.text === add(a.b, a.w, a.a) },
  },
  'sub.added': {
    id: 'sub.added', what: 'adds whenever two numbers appear', side: 'above',
    line: 'Look at the sign. Taking away leaves less.',
    values: (a) => { need(a, 'w', 'p'); return [a.w + a.p] },
  },
  // The concrete take-away step (l4.take_away) shows counters and an empty pad, no sign, so
  // "look at the sign" points at nothing (main-session teacher read, 2026-11-21). Same value
  // as sub.added; the line speaks about the counters instead.
  'take.added': {
    id: 'take.added', what: 'adds the counters taken away instead of taking them', side: 'above',
    line: 'We take some away. Fewer are left.',
    values: (a) => { need(a, 'w', 'p'); return [a.w + a.p] },
  },
  'sub.bigger-than-whole': {
    id: 'sub.bigger-than-whole', what: 'a take-away whose answer is bigger than its start', side: 'none',
    line: 'Taking away leaves less than the start.',
    check: (c, a) => {
      need(a, 'w', 'a', 'b')
      return c.kind === 'sentence' && c.text === sub(Math.max(a.a, a.b), Math.min(a.a, a.b), a.w)
    },
  },
  'box.copy-seen': {
    id: 'box.copy-seen', what: 'copies a number already in the sentence into the box', side: 'below',
    line: 'That number is in the sentence already.',
    values: (a) => { need(a, 'seen'); return [a.seen] },
  },
  'sub.subtracted-seen': {
    id: 'sub.subtracted-seen', what: 'on □ − p = k, takes away the two numbers he sees', side: 'below',
    line: 'The box is the whole. The whole is the biggest.',
    // he takes away the two numbers he sees, the larger minus the smaller (Opus re-check); never 0
    values: (a) => { need(a, 'p', 'k', 'seen'); const v = Math.abs(a.k - a.p); return v > 0 ? [v] : [] },
  },
  'fact.order-swapped': {
    id: 'fact.order-swapped', what: 'reads w − a = b, so writes a − w = b', side: 'none',
    line: 'In a take-away, the whole comes first.',
    check: (c, a) => { need(a, 'w', 'a', 'b'); return c.kind === 'sentence' && c.text === sub(a.a, a.w, a.b) },
  },
  'split.same-pair': {
    id: 'split.same-pair', what: 'gives the shown split again (or its turnaround) as another way', side: 'none',
    line: 'That way is shown already. Try other numbers.',
    check: (c, a) => {
      if (c.kind !== 'pair') return false
      if (has(a, 'm')) {
        // missing_split_choice: a row already in the list (sums to w, first part not the missing row's).
        need(a, 'w')
        return c.a >= 1 && c.b >= 1 && c.a + c.b === a.w && c.a !== a.m
      }
      need(a, 'sa', 'sb')
      return (c.a === a.sa && c.b === a.sb) || (c.a === a.sb && c.b === a.sa)
    },
  },
  'story.wrong-operation': {
    id: 'story.wrong-operation', what: 'takes away in a join story, adds in a take-away story', side: 'either',
    line: 'Look at the bond. Is the whole missing, or a part?',
    values: (a) => {
      need(a, 'story')
      if (a.story === 0) { need(a, 'a', 'b'); return a.a !== a.b ? [Math.abs(a.a - a.b)] : [] }
      need(a, 'w', 'p')
      return [a.w + a.p]
    },
  },
  'story.unknown-in-wrong-circle': {
    id: 'story.unknown-in-wrong-circle', what: 'puts "?" in a part when the whole is asked, or the reverse', side: 'none',
    line: 'Is the whole missing, or a part?',
    check: (c, a) => {
      const bond = bondOf(c)
      if (!bond) return false
      need(a, 'story')
      if (a.story === 0) {
        need(a, 'a', 'b')
        return (bond.whole === a.a && sameMultiset(bond.parts, [a.b, '?']))
          || (bond.whole === a.b && sameMultiset(bond.parts, [a.a, '?']))
      }
      need(a, 'w', 'p')
      return bond.whole === '?' && sameMultiset(bond.parts, [a.w, a.p])
    },
  },
  // --- U01 / U04 rules for the outside templates -----------------------------
  'count.double-touch': {
    id: 'count.double-touch', what: 'counts one object twice', side: 'above',
    line: 'Touch each one only once.',
    values: (a) => { need(a, 'n'); return [a.n + 1] },
  },
  'count.skip': {
    id: 'count.skip', what: 'skips one object', side: 'below',
    line: 'Touch every one. Do not skip any.',
    values: (a) => { need(a, 'n'); return a.n - 1 >= 1 ? [a.n - 1] : [] },
  },
  'order.before-after-swap': {
    id: 'order.before-after-swap', what: 'says the number after when asked for before, or the reverse', side: 'either',
    line: 'Before is on the left. After is on the right.',
    values: (a) => { need(a, 'n', 'before'); return [a.before === 1 ? a.n + 1 : a.n - 1] },
  },
  'teen.count-slip': {
    id: 'teen.count-slip', what: 'counts the extra ones one too many or one too few', side: 'none',
    line: 'Count the extra ones again.',
    values: (a) => { need(a, 'n'); return [10 + a.n - 1, 10 + a.n + 1] },
    check: (c, a) => { need(a, 'n'); return c.kind === 'picture' && c.fullTen && c.ones >= 1 && Math.abs(c.ones - a.n) === 1 },
  },
  'teen.ones-only': {
    id: 'teen.ones-only', what: 'sees only the ones and forgets the ten', side: 'none',
    line: 'Look for the full ten too.',
    values: (a) => { need(a, 'n'); return [a.n] },
    check: (c, a) => { need(a, 'n'); return c.kind === 'picture' && !c.fullTen && c.ones === a.n },
  },
  /** U01 L3's row: "the spread-out row has more" (GRADE-1 U01 L3 wrong-answer column). */
  'match.spread-looks-more': {
    id: 'match.spread-looks-more', what: 'picks the spread-out row because it looks longer', side: 'none',
    line: 'Match them one to one. Do not look at length.',
    check: (c, a) => {
      need(a, 'top', 'bottom', 'spreadTop')
      if (c.kind !== 'row') return false
      const spreadRow = a.spreadTop === 1 ? 'top' : 'bottom'
      const spreadCount = a.spreadTop === 1 ? a.top : a.bottom
      const otherCount = a.spreadTop === 1 ? a.bottom : a.top
      return c.which === spreadRow && spreadCount < otherCount
    },
  },
  /** U01 L3: "more" and "fewer" mixed up, when the spread row really has more. */
  'match.more-fewer-swap': {
    id: 'match.more-fewer-swap', what: 'picks the row with fewer (the words more and fewer mixed up)', side: 'none',
    line: 'More means the row with some left over.',
    check: (c, a) => {
      need(a, 'top', 'bottom', 'spreadTop')
      if (c.kind !== 'row') return false
      const fewerRow = a.top < a.bottom ? 'top' : 'bottom'
      const spreadRow = a.spreadTop === 1 ? 'top' : 'bottom'
      return c.which === fewerRow && fewerRow !== spreadRow
    },
  },
}

/**
 * Rules that name the same act in two settings (adding the two numbers he sees: in a bond,
 * `bond.added`; in a sentence, `sub.added`). They always give the same value, so one
 * never makes the other ambiguous.
 */
export const SAME_ACT: ReadonlyArray<readonly [string, string]> = [
  ['bond.added', 'sub.added'],
  // take.added: the same act on the counters step (no sign shown), so the same value
  ['sub.added', 'take.added'],
  ['bond.added', 'take.added'],
  // count.stop-short-split: L1's words for count.stop-short (the same act, the same value)
  ['count.stop-short', 'count.stop-short-split'],
]

export function sameAct(x: string, y: string): boolean {
  return SAME_ACT.some(([a, b]) => (a === x && b === y) || (a === y && b === x))
}

export function getRule(id: string): MisRule {
  const r = RULES[id]
  if (!r) throw new Error(`unknown misconception rule '${id}'`)
  return r
}

/** The values a number rule gives on these args ([] when it cannot be named honestly). */
export function ruleValues(id: string, args: RuleArgs): number[] {
  const r = getRule(id)
  if (!r.values) throw new Error(`rule '${id}' makes no number`)
  return r.values(args)
}

/** The single value of a number rule, or null when the rule is not honest on this draw. */
export function ruleValue(id: string, args: RuleArgs): number | null {
  const v = ruleValues(id, args)
  return v.length === 1 ? v[0] : null
}

/** Does `value` sit on the rule's declared side of the key? ('none'/'either' always hold.) */
export function sideHolds(id: string, value: number, key: number): boolean {
  const s = getRule(id).side
  if (s === 'below') return value < key
  if (s === 'above') return value > key
  return true
}

/**
 * Does this choice content come from the rule? Number content checks the rule's values;
 * other content uses the rule's content check.
 */
export function ruleMakes(id: string, content: ChoiceContent, args: RuleArgs): boolean {
  const r = getRule(id)
  if (content.kind === 'number') return !!r.values && r.values(args).includes(content.value)
  if (content.kind === 'picture' && !r.check && r.values) {
    return r.values(args).includes((content.fullTen ? 10 : 0) + content.ones)
  }
  return !!r.check && r.check(content, args)
}
