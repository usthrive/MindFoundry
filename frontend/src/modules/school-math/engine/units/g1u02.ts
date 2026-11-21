/**
 * G1-U02 — Number bonds; + and − within 10. Every template of EXEMPLAR-G1-U02 §4 (L1–L6).
 *
 * Each template:
 *   - draws its numbers from a seeded stream within the stated constraints (redraws, never
 *     patches) and honours `ctx.force` (fixtures), `ctx.options` (box place, story kind,
 *     which part is asked) and `ctx.avoidFacts` (checks never use a demo fact);
 *   - computes its keys in `build`, and again, separately, in `answerFor` (QG-5);
 *   - makes every wrong value it shows or names from a named rule, re-derived in
 *     `verifyFor` (QG-11);
 *   - can be built again at a fresh seed for the W1 fix-it twin (same template, new numbers).
 *
 * No person names: stories use things and animals; error items say "a child wrote".
 * Child-facing sentences are ≤ 10 words and never use the word "wrong".
 */

import type { Rng } from '../../../best-brains/generator/rng'
import type {
  BondShape, SMBuildCtx, SMExpected, SMFact, SMFigure, SMPart, SMReviewRule, SMSurface, SMTemplateDef, SMTruthRow, SMVerify, SMAnswer,
} from '../../types'
import { contentCanon, orderChoices, pickNumeric, type Draft, type PoolValue } from '../lib/choices'
import { add, sub, MINUS, ruleValue } from '../lib/misconceptions'
import { BOND_SPOKEN, blocked, drawInt, makeItem, num, option, redraw, reviewRules, reviewText, str } from '../lib/item'
import { G1U02_SETTINGS, getSetting, joinStory, takeawayStory, thereAre, someLeave } from '../lib/contexts'
import { evalSentence, thing } from '../lib/text'

const UNIT = 'G1-U02'
const LES = (n: number) => `G1-U02-L${n}`
const K = (n: number) => `G1-U02-K${n}`
const ID = (s: string) => `sm.g1u02.${s}`

// ---------------------------------------------------------------------------
// small builders
// ---------------------------------------------------------------------------

function part(
  id: string, surface: SMSurface, answer: SMAnswer, skillIds: string[],
  opts: { prompt?: string; after?: string; review?: SMReviewRule[]; points?: number } = {},
): SMPart {
  return {
    id, prompt: opts.prompt, surface, answer,
    reveal: opts.after ? `after-part:${opts.after}` : 'with-item',
    skillIds, points: opts.points, reviewRules: opts.review ?? [],
  }
}

const bond = (whole: BondShape['whole'], x: BondShape['parts'][0], y: BondShape['parts'][1]): BondShape => ({ whole, parts: [x, y] })
const bondFig = (b: BondShape, spoken = BOND_SPOKEN): SMFigure => ({ kind: 'number-bond', bond: b, spoken })
const groupsFig = (groups: number[], shape = 'counter'): SMFigure =>
  ({ kind: 'groups', shape, groups, spoken: groups.length === 1 ? 'one group' : 'two groups' })
const truthValue = (rows: SMTruthRow[]) => rows.map((r) => (r.truth ? 'T' : 'F')).join('')
const keyOf = (choices: { key: string; rule: string | null }[]) => {
  const k = choices.find((c) => c.rule === null)
  if (!k) throw new Error('no key among choices')
  return k.key
}
const isCheck = (ctx: SMBuildCtx) => ctx.role === 'check'
const pts = (ctx: SMBuildCtx, n: number) => (isCheck(ctx) ? n : undefined)
const fact = (whole: number, x: number, y: number): SMFact => ({ whole, parts: [x, y] })
/** The sentence in both orders (one, when the parts are equal). */
const bothOrders = (a: number, b: number, w: number | string) => [...new Set([add(a, b, w), add(b, a, w)])]

/** The shown part p for a find-the-part item, honouring the blind-habit option (asked part smaller or larger). */
function drawShownPart(rng: Rng, ctx: SMBuildCtx, w: number, asked: 'smaller' | 'larger' | undefined): number | null {
  const want = asked ?? (rng.chance(0.5) ? 'smaller' : 'larger')
  const ok = (p: number) => (want === 'smaller' ? w - p <= p : w - p > p)
  const forced = ctx.force?.p
  if (typeof forced === 'number') return forced
  const cands: number[] = []
  for (let p = 1; p <= w - 1; p++) if (ok(p)) cands.push(p)
  return cands.length ? rng.pick(cands) : null
}

/** Truth rows: two true and two false from a pool, shuffled (L51). */
function pickRows(rng: Rng, trues: SMTruthRow[], falses: SMTruthRow[], nTrue: number, nFalse: number): SMTruthRow[] {
  return rng.shuffle([...rng.shuffle(trues).slice(0, nTrue), ...rng.shuffle(falses).slice(0, nFalse)])
}

// ===========================================================================
// L1 — split a set into two parts
// ===========================================================================

const l1SplitAny: SMTemplateDef = {
  id: ID('l1.split_any'), unitId: UNIT, lessonId: LES(1), skillIds: [K(1)], uses: ['step', 'practice'], ladderFamily: 'split',
  build(rng, ctx) {
    const w = drawInt(rng, ctx, 'w', 3, 10)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(1), ctx, skillIds: [K(1)], modelRung: 'build', formatCode: 'N-I4',
      prompt: `Split ${thing(w, 'counter')} into two parts.`,
      figures: [{ kind: 'counters', count: w, layout: 'two-circles', tappable: true, spoken: 'counters and two circles' }],
      parts: [
        part('p1', { kind: 'counter-split', id: 'N-I4', whole: w }, { kind: 'split', whole: w }, [K(1)],
          { prompt: 'Move the counters into the two circles.' }),
        part('p2', { kind: 'sentence', id: 'N-I8', text: `${w} is □ and □.`, input: 'pad' },
          { kind: 'split', whole: w, sameAsPart: 'p1' }, [K(1)], { prompt: 'Now fill in the sentence.', after: 'p1' }),
      ],
      ladderFamily: 'split', params: { w }, givens: [w],
    })
  },
  answerFor: (p) => ({ p1: { kind: 'split', whole: num(p, 'w') }, p2: { kind: 'split', whole: num(p, 'w'), sameAsPart: 'p1' } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w') } }),
}

const l1SplitAnotherWay: SMTemplateDef = {
  id: ID('l1.split_another_way'), unitId: UNIT, lessonId: LES(1), skillIds: [K(1)], uses: ['step', 'practice'], ladderFamily: 'split',
  build(rng, ctx) {
    const { w, a, b } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 4, 10)
      const a = drawInt(rng, ctx, 'a', 1, w - 1)
      const b = w - a
      return a !== b && b >= 1 ? { w, a, b } : null
    })
    const lo = Math.min(a, b), hi = Math.max(a, b)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(1), ctx, skillIds: [K(1)], modelRung: 'build', formatCode: 'N-I4',
      prompt: `Here is one way to split ${w}. Use different numbers.`,
      figures: [groupsFig([a, b]), { kind: 'counters', count: w, layout: 'two-circles', tappable: true, spoken: 'counters and two circles' }],
      parts: [
        part('p1', { kind: 'counter-split', id: 'N-I4', whole: w }, { kind: 'split', whole: w, notPair: [a, b] }, [K(1)],
          { prompt: 'Move the counters another way.', review: [reviewText('split.same-pair', `${lo},${hi}`)] }),
      ],
      ladderFamily: 'split', params: { w, a, b }, givens: [w, a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'split', whole: num(p, 'w'), notPair: [num(p, 'a'), num(p, 'b')] } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w'), sa: num(p, 'a'), sb: num(p, 'b') } }),
}

const l1ListSplits: SMTemplateDef = {
  id: ID('l1.list_splits'), unitId: UNIT, lessonId: LES(1), skillIds: [K(2)], uses: ['step', 'practice'], ladderFamily: 'list',
  build(rng, ctx) {
    const w = drawInt(rng, ctx, 'w', 4, 7)
    const firsts = Array.from({ length: w - 1 }, (_, i) => i + 1)
    const nOpen = rng.int(2, Math.min(3, w - 2))
    const open = rng.shuffle(firsts).slice(0, nOpen).sort((x, y) => x - y)
    const rows = firsts.map((f) => ({ first: f, second: open.includes(f) ? null : w - f }))
    const parts = open.map((f, i) => {
      const k = w - f
      return part(`p${i + 1}`, { kind: 'pad', id: 'T8', text: `${f} and □` }, { kind: 'number', value: k }, [K(2)],
        { review: reviewRules({ k }, k, ['count.stop-short', 'count.start-counted']) })
    })
    const givens = [w, ...rows.flatMap((r) => (r.second === null ? [r.first] : [r.first, r.second]))]
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(1), ctx, skillIds: [K(2)], modelRung: 'build', formatCode: 'L16',
      prompt: `Make a list of the ways to split ${w}.`,
      figures: [{ kind: 'split-list', whole: w, rows, spoken: 'a list of the ways to split' }],
      parts, ladderFamily: 'list', params: { w, open }, givens,
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w')
    const open = p.open as number[]
    return Object.fromEntries(open.map((f, i) => [`p${i + 1}`, { kind: 'number', value: w - f } as SMExpected]))
  },
  verifyFor: (p) => {
    const w = num(p, 'w')
    const open = p.open as number[]
    return { args: { w }, partArgs: Object.fromEntries(open.map((f, i) => [`p${i + 1}`, { w, k: w - f }])) }
  },
}

const l1MissingSplitChoice: SMTemplateDef = {
  id: ID('l1.missing_split_choice'), unitId: UNIT, lessonId: LES(1), skillIds: [K(2)], uses: ['practice', 'exit'], ladderFamily: 'list',
  build(rng, ctx) {
    const w = drawInt(rng, ctx, 'w', 5, 8)
    const m = drawInt(rng, ctx, 'm', 1, w - 1)
    const pair = (a: number, b: number, rule: string | null): Draft => ({ text: `${a} and ${b}`, content: { kind: 'pair', a, b }, rule })
    const key = pair(m, w - m, null)
    const lower = w - m - 1 >= 1 ? pair(m, w - m - 1, 'bond.sum-off-by-one') : pair(m - 1, w - m, 'bond.sum-off-by-one')
    const upper = pair(m, w - m + 1, 'bond.sum-off-by-one')
    const f = m + 1 <= w - 1 ? m + 1 : m - 1
    const listed = pair(f, w - f, 'split.same-pair')
    const choices = orderChoices(ctx.seed, `${this.id}:${ctx.stream}`, key, [lower, upper, listed])
    const rows = Array.from({ length: w - 1 }, (_, i) => i + 1).filter((x) => x !== m).map((x) => ({ first: x, second: w - x }))
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(1), ctx, skillIds: [K(2)], modelRung: 'read', formatCode: 'T1',
      prompt: `Here is a list of ways to split ${w}. Which way is missing?`,
      figures: [{ kind: 'split-list', whole: w, rows, spoken: 'a list of the ways to split' }],
      parts: [part('p1', { kind: 'choices', id: 'T1', choices, numeric: false, pictures: false }, { kind: 'choice-key', key: keyOf(choices) }, [K(2)])],
      ladderFamily: 'list', params: { w, m }, givens: [w, ...rows.flatMap((r) => [r.first, r.second])],
    })
  },
  answerFor: (p) => ({ p1: { kind: 'choice-key', content: contentCanon({ kind: 'pair', a: num(p, 'm'), b: num(p, 'w') - num(p, 'm') }) } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w'), m: num(p, 'm') } }),
}

// ===========================================================================
// L2 — build a number bond
// ===========================================================================

const EMPTY_BOND = bond('empty', 'empty', 'empty')

const l2BondFromSplit: SMTemplateDef = {
  id: ID('l2.bond_from_split'), unitId: UNIT, lessonId: LES(2), skillIds: [K(3)], uses: ['step', 'practice', 'return'], ladderFamily: 'bond-build',
  build(rng, ctx) {
    const w = drawInt(rng, ctx, 'w', 3, 10)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(2), ctx, skillIds: [K(3)], modelRung: 'build', formatCode: 'N-I2',
      prompt: `Split ${thing(w, 'counter')} into two parts. Then build the bond.`,
      figures: [{ kind: 'counters', count: w, layout: 'two-circles', tappable: true, spoken: 'counters and two circles' }],
      parts: [
        part('p1', { kind: 'counter-split', id: 'N-I4', whole: w }, { kind: 'split', whole: w }, [K(3)],
          { prompt: 'Move the counters into the two circles.' }),
        part('p2', { kind: 'bond', id: 'N-I2', mode: 'build', start: EMPTY_BOND },
          { kind: 'bond-parts', whole: w, parts: null, asked: ['orientation', 'whole', 'part'], sameAsPart: 'p1' }, [K(3)],
          { prompt: 'Tap the whole circle. Then fill in the bond.', after: 'p1', review: reviewRules({ w }, -1, ['bond.whole-as-part']) }),
      ],
      ladderFamily: 'bond-build', params: { w }, givens: [w],
    })
  },
  answerFor: (p) => ({
    p1: { kind: 'split', whole: num(p, 'w') },
    p2: { kind: 'bond-parts', whole: num(p, 'w'), parts: null, asked: ['orientation', 'whole', 'part'], sameAsPart: 'p1' },
  }),
  verifyFor: (p) => ({ args: { w: num(p, 'w') } }),
}

const l2BondGiven: SMTemplateDef = {
  id: ID('l2.bond_given'), unitId: UNIT, lessonId: LES(2), skillIds: [K(3)], uses: ['step'], ladderFamily: 'bond-build',
  build(rng, ctx) {
    const w = drawInt(rng, ctx, 'w', 3, 10)
    const a = drawInt(rng, ctx, 'a', 1, w - 1)
    const b = w - a
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(2), ctx, skillIds: [K(3)], modelRung: 'build', formatCode: 'N-I2',
      prompt: `${thing(w, 'counter')}: ${a} here, ${b} there. Build the bond.`,
      figures: [groupsFig([a, b])],
      parts: [part('p1', { kind: 'bond', id: 'N-I2', mode: 'build', start: EMPTY_BOND },
        { kind: 'bond-parts', whole: w, parts: [a, b], asked: ['orientation', 'whole', 'part'] }, [K(3)],
        { prompt: 'Tap the whole circle. Then fill in the bond.', review: reviewRules({ w }, -1, ['bond.whole-as-part']) })],
      ladderFamily: 'bond-build', params: { w, a }, givens: [w, a, b], fact: fact(w, a, b), lessonOnly: true,
    })
  },
  answerFor: (p) => ({ p1: { kind: 'bond-parts', whole: num(p, 'w'), parts: [num(p, 'a'), num(p, 'w') - num(p, 'a')], asked: ['orientation', 'whole', 'part'] } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w') } }),
}

const bondText = (b: BondShape) => `${b.whole} on top; ${b.parts[0]} and ${b.parts[1]} below`

const l2WhichBond: SMTemplateDef = {
  id: ID('l2.which_bond'), unitId: UNIT, lessonId: LES(2), skillIds: [K(4)], uses: ['practice', 'exit', 'check'], ladderFamily: 'bond-build',
  build(rng, ctx) {
    const { w, a, b } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 4, 10)
      const a = drawInt(rng, ctx, 'a', 1, w - 1)
      const b = w - a
      return blocked(ctx, fact(w, a, b)) ? null : { w, a, b }
    })
    const d = (bd: BondShape, rule: string | null): Draft => ({ text: bondText(bd), content: { kind: 'bond', bond: bd }, rule })
    const key = d(bond(w, a, b), null)
    const wap = d(bond(a, w, b), 'bond.whole-as-part')
    const plus = d(bond(w, a, b + 1), 'bond.sum-off-by-one')
    const minus = b >= 2 ? d(bond(w, a, b - 1), 'bond.sum-off-by-one') : d(bond(w, a - 1, b), 'bond.sum-off-by-one')
    const choices = orderChoices(ctx.seed, `${this.id}:${ctx.stream}`, key, [wap, plus, minus])
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(2), ctx, skillIds: [K(4)], modelRung: 'read', formatCode: 'T1',
      prompt: `Which bond shows ${w}?`, figures: [],
      parts: [part('p1', { kind: 'choices', id: 'T1', choices, numeric: false, pictures: false }, { kind: 'choice-key', key: keyOf(choices) }, [K(4)], { points: pts(ctx, 2) })],
      ladderFamily: 'bond-build', params: { w, a }, givens: [w], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'choice-key', content: contentCanon({ kind: 'bond', bond: bond(num(p, 'w'), num(p, 'a'), num(p, 'w') - num(p, 'a')) }) } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w'), a: num(p, 'a'), b: num(p, 'w') - num(p, 'a') } }),
}

/** whole_part_truth rows: id → (text, truth) from the bond's numbers. */
function wholePartRows(w: number, a: number, b: number): Record<string, { text: string; truth: boolean }> {
  return {
    'whole-w': { text: `${w} is the whole.`, truth: true },
    'part-a': { text: `${a} is a part.`, truth: a !== w },
    'part-b': { text: `${b} is a part.`, truth: b !== w },
    'whole-a': { text: `${a} is the whole.`, truth: a === w },
    'part-w': { text: `${w} is a part.`, truth: w === a || w === b },
    'whole-b': { text: `${b} is the whole.`, truth: b === w },
  }
}

const l2WholePartTruth: SMTemplateDef = {
  id: ID('l2.whole_part_truth'), unitId: UNIT, lessonId: LES(2), skillIds: [K(3)], uses: ['exit', 'practice'], ladderFamily: 'truth',
  build(rng, ctx) {
    const { w, a, b } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 4, 10)
      const a = drawInt(rng, ctx, 'a', 1, w - 1)
      const b = w - a
      return a !== b ? { w, a, b } : null
    })
    const all = wholePartRows(w, a, b)
    const mk = (id: string): SMTruthRow => ({ id, text: all[id].text, truth: all[id].truth })
    const rows = pickRows(rng, ['whole-w', 'part-a', 'part-b'].map(mk), ['whole-a', 'part-w', 'whole-b'].map(mk), 2, 2)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(2), ctx, skillIds: [K(3)], modelRung: 'read', formatCode: 'truth',
      prompt: 'Look at the bond. Is each row true?',
      figures: [bondFig(bond(w, a, b))],
      parts: [part('p1', { kind: 'truth', id: 'N-I10', rows }, { kind: 'truth-set', value: truthValue(rows) }, [K(3)])],
      ladderFamily: 'truth', params: { w, a, rows: rows.map((r) => r.id) }, givens: [w, a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w'), a = num(p, 'a')
    const all = wholePartRows(w, a, w - a)
    return { p1: { kind: 'truth-set', value: (p.rows as string[]).map((id) => (all[id].truth ? 'T' : 'F')).join('') } }
  },
  verifyFor: (p) => {
    const w = num(p, 'w'), a = num(p, 'a'), b = w - a
    const all = wholePartRows(w, a, b)
    return { args: { w, a, b }, truth: Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v.truth])) }
  },
}

// ===========================================================================
// L3 — add by putting the parts together
// ===========================================================================

function drawAddends(rng: Rng, ctx: SMBuildCtx, what: string, distinct = false): { a: number; b: number; w: number } {
  return redraw(what, () => {
    const a = drawInt(rng, ctx, 'a', 1, 9)
    const b = drawInt(rng, ctx, 'b', 1, 9)
    const w = a + b
    if (w > 10) return null
    if (distinct && a === b) return null
    if (blocked(ctx, fact(w, a, b))) return null
    return { a, b, w }
  })
}

const ADD_REVIEW = ['add.count-first-twice', 'add.stop-short']

const l3JoinBond: SMTemplateDef = {
  id: ID('l3.join_bond'), unitId: UNIT, lessonId: LES(3), skillIds: [K(5)], uses: ['step', 'practice', 'return', 'check'], ladderFamily: 'add',
  build(rng, ctx) {
    const { a, b, w } = drawAddends(rng, ctx, this.id)
    const review = reviewRules({ a, b }, w, ADD_REVIEW)
    const check = isCheck(ctx)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(3), ctx, skillIds: check ? [K(3), K(5)] : [K(5)], modelRung: 'build', formatCode: 'L7',
      prompt: 'Put the two groups together. Fill in the bond.',
      figures: [groupsFig([a, b]), bondFig(bond('empty', a, b))],
      parts: [
        part('p1', { kind: 'bond', id: 'N-I2', mode: 'fill', start: bond('empty', a, b) },
          { kind: 'bond-parts', whole: w, parts: [a, b], asked: ['whole'] }, check ? [K(3)] : [K(5)],
          { prompt: 'What goes in the whole circle?', review, points: pts(ctx, 1) }),
        part('p2', { kind: 'sentence', id: 'N-I8', text: '□ □ □ = □', input: 'chips', chips: [String(a), String(b), String(w), '+', MINUS, '='] },
          { kind: 'sentence-match', accepts: bothOrders(a, b, w) }, [K(5)],
          { prompt: 'Now make the sentence.', after: 'p1', review, points: pts(ctx, 1) }),
      ],
      ladderFamily: 'add', params: { a, b }, givens: [a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => {
    const a = num(p, 'a'), b = num(p, 'b'), w = a + b
    return { p1: { kind: 'bond-parts', whole: w, parts: [a, b], asked: ['whole'] }, p2: { kind: 'sentence-match', accepts: bothOrders(a, b, w) } }
  },
  verifyFor: (p) => ({ args: { a: num(p, 'a'), b: num(p, 'b') } }),
}

const l3AddPad: SMTemplateDef = {
  id: ID('l3.add_pad'), unitId: UNIT, lessonId: LES(3), skillIds: [K(5)], uses: ['step', 'practice', 'return', 'exit', 'check'], ladderFamily: 'add',
  build(rng, ctx) {
    const { a, b, w } = drawAddends(rng, ctx, this.id)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(3), ctx, skillIds: [K(5)], modelRung: 'unaided', formatCode: 'T8',
      prompt: 'Add.', figures: [],
      parts: [part('p1', { kind: 'pad', id: 'T8', text: add(a, b, '□') }, { kind: 'number', value: w }, [K(5)],
        { review: reviewRules({ a, b }, w, ADD_REVIEW), points: pts(ctx, 1) })],
      ladderFamily: 'add', params: { a, b }, givens: [a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'number', value: num(p, 'a') + num(p, 'b') } }),
  verifyFor: (p) => ({ args: { a: num(p, 'a'), b: num(p, 'b') } }),
}

const l3WhichSentence: SMTemplateDef = {
  id: ID('l3.which_sentence'), unitId: UNIT, lessonId: LES(3), skillIds: [K(4)], uses: ['practice', 'check'], ladderFamily: 'four-facts',
  build(rng, ctx) {
    const { a, b, w } = drawAddends(rng, ctx, this.id, true)
    const s = (text: string, rule: string | null): Draft => ({ text, content: { kind: 'sentence', text }, rule })
    const key = s(add(a, b, w), null)
    const others = [
      s(add(w, a, b), 'bond.whole-as-part'),
      s(sub(Math.max(a, b), Math.min(a, b), w), 'sub.bigger-than-whole'),
      s(add(b, w, a), 'add.part-from-sum'),
    ]
    const choices = orderChoices(ctx.seed, `${this.id}:${ctx.stream}`, key, others)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(3), ctx, skillIds: [K(4)], modelRung: 'read', formatCode: 'T1',
      prompt: 'Which sentence matches the bond?',
      figures: [bondFig(bond(w, a, b))],
      parts: [part('p1', { kind: 'choices', id: 'T1', choices, numeric: false, pictures: false }, { kind: 'choice-key', key: keyOf(choices) }, [K(4)], { points: pts(ctx, 2) })],
      ladderFamily: 'four-facts', params: { a, b }, givens: [w, a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'choice-key', content: contentCanon({ kind: 'sentence', text: add(num(p, 'a'), num(p, 'b'), num(p, 'a') + num(p, 'b')) }) } }),
  verifyFor: (p) => ({ args: { a: num(p, 'a'), b: num(p, 'b'), w: num(p, 'a') + num(p, 'b') } }),
}

// ===========================================================================
// L4 — subtract: take away, or find the missing part
// ===========================================================================

const MISSING_REVIEW = ['bond.repeat-shown', 'bond.whole-as-part', 'sub.added', 'count.stop-short', 'count.start-counted']

const l4TakeAway: SMTemplateDef = {
  id: ID('l4.take_away'), unitId: UNIT, lessonId: LES(4), skillIds: [K(6)], uses: ['step'], ladderFamily: 'missing-part',
  build(rng, ctx) {
    const w = drawInt(rng, ctx, 'w', 4, 10)
    const p = drawInt(rng, ctx, 'p', 1, w - 1)
    const k = w - p
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(4), ctx, skillIds: [K(6)], modelRung: 'build', formatCode: 'L1',
      prompt: `Take away ${thing(p, 'counter')}. How many are left?`,
      figures: [{ kind: 'counters', count: w, layout: 'row', tappable: true, spoken: 'a row of counters' }],
      parts: [part('p1', { kind: 'pad', id: 'T8' }, { kind: 'number', value: k }, [K(6)],
        { prompt: 'Tap the ones you take away. Then type how many.', review: reviewRules({ w, p }, k, ['sub.added']) })],
      ladderFamily: 'missing-part', params: { w, p }, givens: [w, p], fact: fact(w, p, k), lessonOnly: true,
    })
  },
  answerFor: (p) => ({ p1: { kind: 'number', value: num(p, 'w') - num(p, 'p') } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w'), p: num(p, 'p'), k: num(p, 'w') - num(p, 'p') } }),
}

const ASKED = ['smaller', 'larger'] as const

const l4EmptyPartBond: SMTemplateDef = {
  id: ID('l4.empty_part_bond'), unitId: UNIT, lessonId: LES(4), skillIds: [K(6)], uses: ['step', 'practice', 'return', 'placement'], ladderFamily: 'missing-part',
  build(rng, ctx) {
    const asked = option(ctx, 'asked', ASKED)
    const { w, p, k } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 3, 10)
      const p = drawShownPart(rng, ctx, w, asked)
      if (p === null) return null
      const k = w - p
      return blocked(ctx, fact(w, p, k)) ? null : { w, p, k }
    })
    const shownLeft = rng.chance(0.5)
    const start = shownLeft ? bond(w, p, 'empty') : bond(w, 'empty', p)
    const review = reviewRules({ w, p, k }, k, MISSING_REVIEW)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(4), ctx, skillIds: [K(6)], modelRung: 'build', formatCode: 'N-I2',
      prompt: 'Find the missing part.',
      figures: [bondFig(start)],
      parts: [
        part('p1', { kind: 'bond', id: 'N-I2', mode: 'fill', start }, { kind: 'bond-parts', whole: w, parts: [p, k], asked: ['part'] }, [K(6)],
          { prompt: 'What goes in the empty circle?', review }),
        part('p2', { kind: 'sentence', id: 'N-I8', text: sub(w, p, '□'), input: 'pad' }, { kind: 'number', value: k }, [K(6)],
          { prompt: 'Now finish the sentence.', after: 'p1', review }),
      ],
      ladderFamily: 'missing-part', params: { w, p, shownLeft }, givens: [w, p], fact: fact(w, p, k),
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w'), s = num(p, 'p'), k = w - s
    return { p1: { kind: 'bond-parts', whole: w, parts: [s, k], asked: ['part'] }, p2: { kind: 'number', value: k } }
  },
  verifyFor: (p) => ({ args: { w: num(p, 'w'), p: num(p, 'p'), k: num(p, 'w') - num(p, 'p') } }),
}

const l4SubPad: SMTemplateDef = {
  id: ID('l4.sub_pad'), unitId: UNIT, lessonId: LES(4), skillIds: [K(6)], uses: ['practice', 'return', 'check'], ladderFamily: 'missing-part',
  build(rng, ctx) {
    const asked = option(ctx, 'asked', ASKED)
    const { w, p, k } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 3, 10)
      const p = drawShownPart(rng, ctx, w, asked)
      if (p === null) return null
      const k = w - p
      return blocked(ctx, fact(w, p, k)) ? null : { w, p, k }
    })
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(4), ctx, skillIds: [K(6)], modelRung: 'unaided', formatCode: 'T8',
      prompt: 'Take away.', figures: [],
      parts: [part('p1', { kind: 'pad', id: 'T8', text: sub(w, p, '□') }, { kind: 'number', value: k }, [K(6)],
        { review: reviewRules({ w, p }, k, ['sub.added']), points: pts(ctx, 1) })],
      ladderFamily: 'missing-part', params: { w, p }, givens: [w, p], fact: fact(w, p, k),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'number', value: num(p, 'w') - num(p, 'p') } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w'), p: num(p, 'p'), k: num(p, 'w') - num(p, 'p') } }),
}

/** A numeric four-choice part from a pool of honest rule values (METHODOLOGY §7). */
function numericChoicePart(ctx: SMBuildCtx, rng: Rng, label: string, key: number, pool: PoolValue[], skill: string[], points?: number): SMPart | null {
  const picked = pickNumeric(rng, key, pool)
  if (!picked) return null
  const keyDraft: Draft = { text: String(key), content: { kind: 'number', value: key }, rule: null }
  const others: Draft[] = picked.chosen.map((v) => ({ text: String(v.value), content: { kind: 'number', value: v.value }, rule: v.rule }))
  const choices = orderChoices(ctx.seed, label, keyDraft, others)
  return part('p1', { kind: 'choices', id: 'T1', choices, numeric: true, pictures: false }, { kind: 'choice-key', key: keyOf(choices) }, skill, { points })
}

function poolOf(args: Record<string, number>, rules: string[]): PoolValue[] {
  const out: PoolValue[] = []
  for (const rule of rules) {
    const v = ruleValue(rule, args)
    if (v !== null) out.push({ rule, value: v })
  }
  return out
}

const MISSING_POOL = ['bond.repeat-shown', 'count.stop-short', 'count.start-counted', 'bond.whole-as-part', 'bond.added']

const l4MissingPartChoice: SMTemplateDef = {
  id: ID('l4.missing_part_choice'), unitId: UNIT, lessonId: LES(4), skillIds: [K(6)], uses: ['practice', 'exit', 'check', 'placement'], ladderFamily: 'missing-part',
  build(rng, ctx) {
    const built = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 6, 10)
      const p = drawInt(rng, ctx, 'p', 2, Math.floor((w - 2) / 2))
      if (p < 2 || 2 * p > w - 2) return null
      const k = w - p
      if (blocked(ctx, fact(w, p, k))) return null
      const pc = numericChoicePart(ctx, rng, `${this.id}:${ctx.stream}`, k, poolOf({ w, p, k }, MISSING_POOL), [K(6)], pts(ctx, 2))
      return pc ? { w, p, k, pc } : null
    })
    const { w, p, k, pc } = built
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(4), ctx, skillIds: [K(6)], modelRung: 'read', formatCode: 'T1',
      prompt: 'What is the missing part?',
      figures: [bondFig(bond(w, p, 'empty'))],
      parts: [pc], ladderFamily: 'missing-part', params: { w, p }, givens: [w, p], fact: fact(w, p, k),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'choice-key', content: contentCanon({ kind: 'number', value: num(p, 'w') - num(p, 'p') }) } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w'), p: num(p, 'p'), k: num(p, 'w') - num(p, 'p') } }),
}

const l4SignDecides: SMTemplateDef = {
  id: ID('l4.sign_decides'), unitId: UNIT, lessonId: LES(4), skillIds: [K(5), K(6)], uses: ['practice', 'return'], ladderFamily: 'sign',
  build(rng, ctx) {
    const op = option(ctx, 'op', ['+', '-'] as const) ?? (rng.chance(0.5) ? '+' : '-')
    if (op === '+') {
      const { a, b, w } = drawAddends(rng, ctx, this.id)
      return makeItem({
        templateId: this.id, unitId: UNIT, lessonId: LES(4), ctx, skillIds: [K(5)], modelRung: 'unaided', formatCode: 'T8',
        prompt: 'Look at the sign.', figures: [],
        parts: [part('p1', { kind: 'pad', id: 'T8', text: add(a, b, '□') }, { kind: 'number', value: w }, [K(5)],
          { review: reviewRules({ a, b }, w, ['add.subtracted']) })],
        ladderFamily: 'sign', params: { op, a, b }, givens: [a, b], fact: fact(w, a, b),
      })
    }
    const { w, p, k } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 2, 10)
      const p = drawInt(rng, ctx, 'p', 1, w - 1)
      return p >= 1 && p < w && !blocked(ctx, fact(w, p, w - p)) ? { w, p, k: w - p } : null
    })
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(4), ctx, skillIds: [K(6)], modelRung: 'unaided', formatCode: 'T8',
      prompt: 'Look at the sign.', figures: [],
      parts: [part('p1', { kind: 'pad', id: 'T8', text: sub(w, p, '□') }, { kind: 'number', value: k }, [K(6)],
        { review: reviewRules({ w, p }, k, ['sub.added']) })],
      ladderFamily: 'sign', params: { op, w, p }, givens: [w, p], fact: fact(w, p, k),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'number', value: str(p, 'op') === '+' ? num(p, 'a') + num(p, 'b') : num(p, 'w') - num(p, 'p') } }),
  verifyFor: (p): SMVerify => (str(p, 'op') === '+'
    ? { args: { a: num(p, 'a'), b: num(p, 'b') } }
    : { args: { w: num(p, 'w'), p: num(p, 'p'), k: num(p, 'w') - num(p, 'p') } }),
}

const ERROR_RULES = ['sub.added', 'count.start-counted', 'bond.whole-as-part'] as const

/** The six error rows (EXEMPLAR §4 l4.error_take_away): id → text, truth. */
function errorRows(w: number, p: number, X: number): Record<string, { text: string; truth: boolean }> {
  const k = w - p
  const rows: Record<string, { text: string; truth: boolean }> = {
    'whole-w': { text: `${w} is the whole.`, truth: true },
    'leaves-less': { text: `Taking away leaves less than ${w}.`, truth: k < w },
    'part-w': { text: `${w} is a part.`, truth: false },
    'minus-joins': { text: `The ${MINUS} sign means put together.`, truth: false },
    'whole-p': { text: `${p} is the whole.`, truth: p === w },
  }
  if (X > w) rows['x-too-big'] = { text: `${X} is more than ${w}. It cannot be what is left.`, truth: X > w }
  else rows['together-more'] = { text: `${p} and ${X} together make more than ${w}.`, truth: p + X > w }
  return rows
}

const l4ErrorTakeAway: SMTemplateDef = {
  id: ID('l4.error_take_away'), unitId: UNIT, lessonId: LES(4), skillIds: [K(10)], uses: ['step', 'practice', 'check'], ladderFamily: 'error',
  build(rng, ctx) {
    const story = ctx.options?.story === true
    const forcedRule = option(ctx, 'rule', ERROR_RULES)
    const { w, p, k, rule, X } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 5, 10)
      const p = drawInt(rng, ctx, 'p', 2, w - 1)
      const k = w - p
      if (p < 2 || blocked(ctx, fact(w, p, k))) return null
      const rule = forcedRule ?? rng.pick(ERROR_RULES)
      const X = ruleValue(rule, { w, p, k })
      if (X === null || X === k) return null
      // The shown answer must name one rule only: at w = 2p − 1, k + 1 = p is also
      // bond.repeat-shown, and k + 1 = k − 1 never; so X may equal neither p nor k − 1.
      if (X === p || X === k - 1) return null
      return { w, p, k, rule, X }
    })
    const setting = story ? (ctx.options?.setting ? getSetting(String(ctx.options.setting)) : rng.pick(G1U02_SETTINGS)) : null
    const all = errorRows(w, p, X)
    const rowIds = rng.shuffle(Object.keys(all))
    const rows: SMTruthRow[] = rowIds.map((id) => ({ id, text: all[id].text, truth: all[id].truth, }))
    const wrote = `A child wrote ${sub(w, p, X)}.`
    const prompt = setting ? `${thereAre(setting, w)} ${someLeave(setting, p)} ${wrote}` : wrote
    const figures: SMFigure[] = [bondFig(bond(w, p, X), "a child's number bond")]
    if (setting) figures.unshift({ kind: 'scene', setting: setting.id, shape: setting.shape, groups: [w], spoken: 'one group' })
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(4), ctx, skillIds: [K(10)], modelRung: 'read', formatCode: 'T12',
      prompt, figures,
      parts: [
        part('p1', { kind: 'pad', id: 'T8', text: sub(w, p, '□') }, { kind: 'number', value: k }, [K(10)],
          { prompt: 'Fix it. What is the right answer?', points: pts(ctx, 1), review: reviewRules({ w, p, k }, k, ['sub.added']) }),
        part('p2', { kind: 'truth', id: 'N-I10', rows }, { kind: 'truth-set', value: truthValue(rows) }, [K(10)],
          { prompt: 'Now tap true or false for each row.', after: 'p1', points: pts(ctx, 1) }),
      ],
      ladderFamily: 'error', params: { w, p, rule, X, rows: rowIds, story, setting: setting?.id ?? null }, givens: [w, p, X], fact: fact(w, p, k),
      extraRules: [rule],
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w'), s = num(p, 'p'), X = num(p, 'X')
    const all = errorRows(w, s, X)
    return { p1: { kind: 'number', value: w - s }, p2: { kind: 'truth-set', value: (p.rows as string[]).map((id) => (all[id].truth ? 'T' : 'F')).join('') } }
  },
  verifyFor: (p) => {
    const w = num(p, 'w'), s = num(p, 'p'), k = w - s, rule = str(p, 'rule')
    const X = ruleValue(rule, { w, p: s, k })
    if (X === null) throw new Error(`error rule ${rule} not honest on w=${w}, p=${s}`)
    // Truth of each row, recomputed from w, p and the X the rule makes (not the stored X).
    const truth: Record<string, boolean> = {
      'whole-w': true,
      'leaves-less': w - s < w,
      'part-w': false,
      'minus-joins': false,
      'whole-p': s === w,
      'x-too-big': X > w,
      'together-more': s + X > w,
    }
    return { args: { w, p: s, k }, truth, shownWrong: { rule, value: X } }
  },
}

// ===========================================================================
// L5 — four facts; "=" is "is the same as"
// ===========================================================================

function drawBondDistinct(rng: Rng, ctx: SMBuildCtx, what: string, lo: number): { w: number; a: number; b: number } {
  return redraw(what, () => {
    const w = drawInt(rng, ctx, 'w', lo, 10)
    const a = drawInt(rng, ctx, 'a', 1, w - 1)
    const b = w - a
    if (a === b || blocked(ctx, fact(w, a, b))) return null
    return { w, a, b }
  })
}

const l5FourFacts: SMTemplateDef = {
  id: ID('l5.four_facts'), unitId: UNIT, lessonId: LES(5), skillIds: [K(7)], uses: ['step', 'practice', 'return'], ladderFamily: 'four-facts',
  build(rng, ctx) {
    const { w, a, b } = drawBondDistinct(rng, ctx, this.id, 3)
    const sentences: Array<[string, number]> = [[add(a, b, '□'), w], [add(b, a, '□'), w], [sub(w, a, '□'), b], [sub(w, b, '□'), a]]
    const parts = sentences.map(([text, key], i) => part(`p${i + 1}`, { kind: 'sentence', id: 'N-I8', text, input: 'pad' }, { kind: 'number', value: key }, [K(7)],
      { after: i ? `p${i}` : undefined, review: i === 2 ? [reviewText('fact.order-swapped', sub(a, w, b))] : [] }))
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(5), ctx, skillIds: [K(7)], modelRung: 'read', formatCode: 'N-I8',
      prompt: 'Write the four facts of the bond.',
      figures: [bondFig(bond(w, a, b))],
      parts, ladderFamily: 'four-facts', params: { w, a }, givens: [w, a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w'), a = num(p, 'a'), b = w - a
    return { p1: { kind: 'number', value: w }, p2: { kind: 'number', value: w }, p3: { kind: 'number', value: b }, p4: { kind: 'number', value: a } }
  },
  verifyFor: (p) => ({ args: { w: num(p, 'w'), a: num(p, 'a'), b: num(p, 'w') - num(p, 'a') } }),
}

function equalsRows(w: number, a: number, b: number): Record<string, { text: string; truth: boolean; rule?: string }> {
  const rows: Record<string, { text: string; truth: boolean; rule?: string }> = {
    'whole-first': { text: `${w} = ${a} + ${b}` , truth: true },
    turnaround: { text: add(a, b, `${b} + ${a}`), truth: true },
    'take-part': { text: sub(w, a, b), truth: true },
    'order-swapped': { text: sub(a, w, b), truth: false, rule: 'fact.order-swapped' },
    'whole-is-diff': { text: `${w} = ${Math.max(a, b)} ${MINUS} ${Math.min(a, b)}`, truth: false },
    'plus-one': { text: add(a, b, w + 1), truth: false, rule: 'add.count-first-twice' },
  }
  // The stated truth of every row is its computed value, never an authored flag.
  for (const r of Object.values(rows)) {
    const v = evalSentence(r.text)
    if (v === null) throw new Error(`equals row does not parse: ${r.text}`)
    r.truth = v
  }
  return rows
}

const l5EqualsTruth: SMTemplateDef = {
  id: ID('l5.equals_truth'), unitId: UNIT, lessonId: LES(5), skillIds: [K(8)], uses: ['step', 'practice', 'exit'], ladderFamily: 'truth',
  build(rng, ctx) {
    const { w, a, b } = drawBondDistinct(rng, ctx, this.id, 4)
    const all = equalsRows(w, a, b)
    const mk = (id: string): SMTruthRow => ({ id, text: all[id].text, truth: all[id].truth, rule: all[id].rule })
    const rows = pickRows(rng, ['whole-first', 'turnaround', 'take-part'].map(mk), ['order-swapped', 'whole-is-diff', 'plus-one'].map(mk), 2, 2)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(5), ctx, skillIds: [K(8)], modelRung: 'read', formatCode: 'truth',
      prompt: 'Look at the bond. Is each sentence true?',
      figures: [bondFig(bond(w, a, b))],
      parts: [part('p1', { kind: 'truth', id: 'N-I10', rows }, { kind: 'truth-set', value: truthValue(rows) }, [K(8)])],
      ladderFamily: 'truth', params: { w, a, rows: rows.map((r) => r.id) }, givens: [w, a, b, w + 1], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w'), a = num(p, 'a')
    const all = equalsRows(w, a, w - a)
    return { p1: { kind: 'truth-set', value: (p.rows as string[]).map((id) => (all[id].truth ? 'T' : 'F')).join('') } }
  },
  verifyFor: (p) => {
    const w = num(p, 'w'), a = num(p, 'a'), b = w - a
    // Truth recomputed by arithmetic, independent of the row builder.
    const truth: Record<string, boolean> = {
      'whole-first': w === a + b, turnaround: a + b === b + a, 'take-part': w - a === b,
      'order-swapped': a - w === b, 'whole-is-diff': w === Math.max(a, b) - Math.min(a, b), 'plus-one': a + b === w + 1,
    }
    return { args: { w, a, b, k: w }, truth }
  },
}

/** Small facts for the shape hint (EXEMPLAR §4: numbers unrelated to the item). */
const HINT_FACTS: Array<[number, number, number]> = []
for (let x = 1; x <= 9; x++) for (let y = 1; x + y <= 10; y++) if (x !== y) HINT_FACTS.push([x, y, x + y])

const PLACES = ['1', '2', '3', '4'] as const
type Place = (typeof PLACES)[number]

/** The box sentence for each place, its key, and the rule inputs for its review lines. */
function boxPlace(place: Place, w: number, a: number, b: number) {
  switch (place) {
    case '1': return { text: add(a, '□', w), key: b, shown: a, args: { w, p: a, k: b, seen: a }, rules: ['box.copy-seen', 'bond.added'] }
    case '2': return { text: add('□', b, w), key: a, shown: b, args: { w, p: b, k: a, seen: b }, rules: ['box.copy-seen', 'bond.added'] }
    case '3': return { text: sub(w, '□', b), key: a, shown: b, args: { w, p: b, k: a, seen: b }, rules: ['box.copy-seen', 'bond.added'] }
    case '4': return { text: sub('□', a, b), key: w, shown: a, args: { w, p: a, k: b, seen: a }, rules: ['box.copy-seen', 'sub.subtracted-seen'] }
  }
}
function hintText(place: Place, x: number, y: number, z: number): string {
  switch (place) {
    case '1': return add(x, y, z)
    case '2': return add(x, y, z)
    case '3': return sub(z, x, y)
    case '4': return sub(z, x, y)
  }
}

const l5BoxAnyPlace: SMTemplateDef = {
  id: ID('l5.box_any_place'), unitId: UNIT, lessonId: LES(5), skillIds: [K(6), K(8)], uses: ['step', 'practice', 'check'], ladderFamily: 'four-facts',
  build(rng, ctx) {
    const place: Place = option(ctx, 'place', PLACES) ?? rng.pick(PLACES)
    const asked = place === '4' ? undefined : (option(ctx, 'asked', ASKED) ?? (rng.chance(0.5) ? 'smaller' : 'larger'))
    const d = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 3, 10)
      const a = drawInt(rng, ctx, 'a', 1, w - 1)
      const b = w - a
      const bp = boxPlace(place, w, a, b)
      if (asked === 'smaller' && !(bp.key <= bp.shown)) return null
      if (asked === 'larger' && !(bp.key > bp.shown)) return null
      if (blocked(ctx, fact(w, a, b))) return null
      const used = new Set([w, a, b])
      const hints = HINT_FACTS.filter(([x, y, z]) => !used.has(x) && !used.has(y) && !used.has(z))
      if (!hints.length) return null
      return { w, a, b, bp, hint: rng.pick(hints) }
    })
    const { w, a, b, bp, hint } = d
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(5), ctx, skillIds: [K(6), K(8)], modelRung: 'unaided', formatCode: 'N-I8',
      prompt: 'What number goes in the box?', figures: [],
      parts: [part('p1', { kind: 'sentence', id: 'N-I8', text: bp.text, input: 'pad', shapeHint: hintText(place, ...hint) },
        { kind: 'number', value: bp.key }, [K(6), K(8)], { review: reviewRules(bp.args, bp.key, bp.rules), points: pts(ctx, 1) })],
      ladderFamily: 'four-facts', params: { w, a, place, hint }, givens: place === '4' ? [a, b] : [w, bp.shown], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w'), a = num(p, 'a')
    return { p1: { kind: 'number', value: boxPlace(str(p, 'place') as Place, w, a, w - a).key } }
  },
  verifyFor: (p) => {
    const w = num(p, 'w'), a = num(p, 'a')
    return { args: boxPlace(str(p, 'place') as Place, w, a, w - a).args }
  },
}

const ADDEND_POOL = ['box.copy-seen', 'count.stop-short', 'count.start-counted', 'bond.whole-as-part', 'bond.added']

const l5MissingAddendChoice: SMTemplateDef = {
  id: ID('l5.missing_addend_choice'), unitId: UNIT, lessonId: LES(5), skillIds: [K(8)], uses: ['practice', 'check'], ladderFamily: 'missing-part',
  build(rng, ctx) {
    const { w, a, k, pc } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 6, 10)
      const a = drawInt(rng, ctx, 'a', 2, Math.floor((w - 2) / 2))
      if (a < 2 || 2 * a > w - 2) return null
      const k = w - a
      if (blocked(ctx, fact(w, a, k))) return null
      const pc = numericChoicePart(ctx, rng, `${this.id}:${ctx.stream}`, k, poolOf({ w, p: a, k, seen: a }, ADDEND_POOL), [K(8)], pts(ctx, 2))
      return pc ? { w, a, k, pc } : null
    })
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(5), ctx, skillIds: [K(8)], modelRung: 'unaided', formatCode: 'T1',
      prompt: `Which number makes ${add(a, '□', w)} true?`, figures: [],
      parts: [pc], ladderFamily: 'missing-part', params: { w, a }, givens: [a, w], fact: fact(w, a, k),
    })
  },
  answerFor: (p) => ({ p1: { kind: 'choice-key', content: contentCanon({ kind: 'number', value: num(p, 'w') - num(p, 'a') }) } }),
  verifyFor: (p) => ({ args: { w: num(p, 'w'), p: num(p, 'a'), k: num(p, 'w') - num(p, 'a'), seen: num(p, 'a') } }),
}

// ===========================================================================
// L6 — join and take-away stories (DD17 routine: read → tell it back → what is asked → bond → check)
// ===========================================================================

const ACK = { kind: 'ack', label: 'I know what it says' } as const

function pickSetting(rng: Rng, ctx: SMBuildCtx) {
  return ctx.options?.setting ? getSetting(String(ctx.options.setting)) : rng.pick(G1U02_SETTINGS)
}

/** Stories never use a part of 1: "1 apple and 1 more apple" is not a story worth a bond (stage-1 review). */
const storyCtx = (ctx: SMBuildCtx): SMBuildCtx => ({ ...ctx, minPart: Math.max(ctx.minPart ?? 1, 2) })

const l6JoinStory: SMTemplateDef = {
  id: ID('l6.join_story'), unitId: UNIT, lessonId: LES(6), skillIds: [K(9), K(5)], uses: ['step', 'practice', 'check'], ladderFamily: 'story',
  build(rng, ctx0) {
    const ctx = storyCtx(ctx0)
    const s = pickSetting(rng, ctx)
    const { a, b, w } = drawAddends(rng, ctx, this.id)
    const chips = [String(a), String(b), '+', MINUS, '=', '□']
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(6), ctx, skillIds: [K(9), K(5)], modelRung: 'build', formatCode: 'T17',
      prompt: joinStory(s, a, b),
      figures: [{ kind: 'scene', setting: s.id, shape: s.shape, groups: [a, b], spoken: 'two groups' }],
      parts: [
        part('p0', { ...ACK }, { kind: 'ack' }, [], { prompt: 'Tell the story back.' }),
        part('p1', { kind: 'bond', id: 'N-I2', mode: 'label', start: EMPTY_BOND }, { kind: 'bond-parts', whole: '?', parts: [a, b], asked: ['unknown-place', 'part'] }, [K(9)],
          { prompt: 'Build the bond. Put the question mark in.', after: 'p0', points: pts(ctx, 1) }),
        part('p2', { kind: 'sentence', id: 'N-I8', text: '□ □ □ = □', input: 'chips', chips }, { kind: 'sentence-match', accepts: bothOrders(a, b, '□') }, [K(9)],
          { prompt: 'Make the sentence.', after: 'p1', points: pts(ctx, 1) }),
        part('p3', { kind: 'pad', id: 'T8' }, { kind: 'number', value: w }, [K(5)],
          { prompt: 'Now answer the question.', after: 'p2', points: pts(ctx, 1), review: reviewRules({ story: 0, a, b }, w, ['story.wrong-operation']) }),
      ],
      ladderFamily: 'story', params: { setting: s.id, a, b }, givens: [a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => {
    const a = num(p, 'a'), b = num(p, 'b')
    return {
      p0: { kind: 'ack' },
      p1: { kind: 'bond-parts', whole: '?', parts: [a, b], asked: ['unknown-place', 'part'] },
      p2: { kind: 'sentence-match', accepts: bothOrders(a, b, '□') },
      p3: { kind: 'number', value: a + b },
    }
  },
  verifyFor: (p) => ({ args: { story: 0, a: num(p, 'a'), b: num(p, 'b') } }),
}

const l6TakeawayStory: SMTemplateDef = {
  id: ID('l6.takeaway_story'), unitId: UNIT, lessonId: LES(6), skillIds: [K(9), K(6)], uses: ['step', 'practice', 'check'], ladderFamily: 'story',
  build(rng, ctx0) {
    const ctx = storyCtx(ctx0)
    const s = pickSetting(rng, ctx)
    const { w, p, k } = redraw(this.id, () => {
      const w = drawInt(rng, ctx, 'w', 4, 10)
      const p = drawInt(rng, ctx, 'p', 1, w - 1)
      return blocked(ctx, fact(w, p, w - p)) ? null : { w, p, k: w - p }
    })
    const chips = [String(w), String(p), '+', MINUS, '=', '□']
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(6), ctx, skillIds: [K(9), K(6)], modelRung: 'build', formatCode: 'T17',
      prompt: takeawayStory(s, w, p),
      figures: [{ kind: 'scene', setting: s.id, shape: s.shape, groups: [w], spoken: 'one group' }],
      parts: [
        part('p0', { ...ACK }, { kind: 'ack' }, [], { prompt: 'Tell the story back.' }),
        part('p1', { kind: 'bond', id: 'N-I2', mode: 'label', start: EMPTY_BOND }, { kind: 'bond-parts', whole: w, parts: [p, '?'], asked: ['whole', 'part', 'unknown-place'] }, [K(9)],
          { prompt: 'Build the bond. Put the question mark in.', after: 'p0', points: pts(ctx, 1) }),
        part('p2', { kind: 'sentence', id: 'N-I8', text: '□ □ □ = □', input: 'chips', chips }, { kind: 'sentence-match', accepts: [sub(w, p, '□')] }, [K(9)],
          { prompt: 'Make the sentence.', after: 'p1', points: pts(ctx, 1) }),
        part('p3', { kind: 'pad', id: 'T8' }, { kind: 'number', value: k }, [K(6)],
          { prompt: 'Now answer the question.', after: 'p2', points: pts(ctx, 1), review: reviewRules({ story: 1, w, p }, k, ['story.wrong-operation']) }),
      ],
      ladderFamily: 'story', params: { setting: s.id, w, p }, givens: [w, p], fact: fact(w, p, k),
    })
  },
  answerFor: (p) => {
    const w = num(p, 'w'), s = num(p, 'p')
    return {
      p0: { kind: 'ack' },
      p1: { kind: 'bond-parts', whole: w, parts: [s, '?'], asked: ['whole', 'part', 'unknown-place'] },
      p2: { kind: 'sentence-match', accepts: [sub(w, s, '□')] },
      p3: { kind: 'number', value: w - s },
    }
  },
  verifyFor: (p) => ({ args: { story: 1, w: num(p, 'w'), p: num(p, 'p') } }),
}

const STORY_KINDS = ['join', 'takeaway'] as const

const l6WhichBondStory: SMTemplateDef = {
  id: ID('l6.which_bond_story'), unitId: UNIT, lessonId: LES(6), skillIds: [K(9)], uses: ['practice', 'exit'], ladderFamily: 'story',
  build(rng, ctx0) {
    const ctx = storyCtx(ctx0)
    const kind = option(ctx, 'kind', STORY_KINDS) ?? (rng.chance(0.5) ? 'join' : 'takeaway')
    const s = pickSetting(rng, ctx)
    const d = (bd: BondShape, rule: string | null): Draft => ({ text: bondText(bd), content: { kind: 'bond', bond: bd }, rule })
    const canon = (x: Draft) => contentCanon(x.content)
    const built = redraw(this.id, () => {
      if (kind === 'join') {
        const a = drawInt(rng, ctx, 'a', 1, 9), b = drawInt(rng, ctx, 'b', 1, 9)
        if (a + b > 10 || blocked(ctx, fact(a + b, a, b))) return null
        const key = d(bond('?', a, b), null)
        const pool: Draft[] = [d(bond(a, b, '?'), 'story.unknown-in-wrong-circle')]
        if (a !== b) pool.push(d(bond(b, a, '?'), 'story.unknown-in-wrong-circle'))
        pool.push(d(bond('?', a, b + 1), 'bond.sum-off-by-one'))
        if (b >= 2) pool.push(d(bond('?', a, b - 1), 'bond.sum-off-by-one'))
        else if (a >= 2) pool.push(d(bond('?', a - 1, b), 'bond.sum-off-by-one'))
        const uniq = pool.filter((x, i) => pool.findIndex((y) => canon(y) === canon(x)) === i && canon(x) !== canon(key))
        if (uniq.length < 3) return null
        return { key, others: rng.shuffle(uniq).slice(0, 3), params: { kind, setting: s.id, a, b }, prompt: joinStory(s, a, b), groups: [a, b], givens: [a, b], fact: fact(a + b, a, b) }
      }
      const w = drawInt(rng, ctx, 'w', 4, 10), p = drawInt(rng, ctx, 'p', 1, w - 1)
      if (blocked(ctx, fact(w, p, w - p))) return null
      const key = d(bond(w, p, '?'), null)
      const pool: Draft[] = [d(bond('?', w, p), 'story.unknown-in-wrong-circle'), d(bond(p, w, '?'), 'bond.whole-as-part'), d(bond(w + 1, p, '?'), 'bond.sum-off-by-one')]
      if (w - 1 > p) pool.push(d(bond(w - 1, p, '?'), 'bond.sum-off-by-one'))
      return { key, others: rng.shuffle(pool).slice(0, 3), params: { kind, setting: s.id, w, p }, prompt: takeawayStory(s, w, p), groups: [w], givens: [w, p], fact: fact(w, p, w - p) }
    })
    const choices = orderChoices(ctx.seed, `${this.id}:${ctx.stream}`, built.key, built.others)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(6), ctx, skillIds: [K(9)], modelRung: 'read', formatCode: 'T1',
      prompt: built.prompt,
      figures: [{ kind: 'scene', setting: s.id, shape: s.shape, groups: built.groups, spoken: built.groups.length === 1 ? 'one group' : 'two groups' }],
      parts: [part('p1', { kind: 'choices', id: 'T1', choices, numeric: false, pictures: false }, { kind: 'choice-key', key: keyOf(choices) }, [K(9)],
        { prompt: 'Which bond fits the story?' })],
      ladderFamily: 'story', params: built.params, givens: built.givens, fact: built.fact,
    })
  },
  answerFor: (p) => {
    const b = str(p, 'kind') === 'join' ? bond('?', num(p, 'a'), num(p, 'b')) : bond(num(p, 'w'), num(p, 'p'), '?')
    return { p1: { kind: 'choice-key', content: contentCanon({ kind: 'bond', bond: b }) } }
  },
  verifyFor: (p): SMVerify => (str(p, 'kind') === 'join'
    ? { args: { story: 0, a: num(p, 'a'), b: num(p, 'b') } }
    : { args: { story: 1, w: num(p, 'w'), p: num(p, 'p') } }),
}

const l6PaperBond: SMTemplateDef = {
  id: ID('l6.paper_bond'), unitId: UNIT, lessonId: LES(6), skillIds: [K(9)], uses: ['practice'], ladderFamily: 'story',
  build(rng, ctx0) {
    const ctx = storyCtx(ctx0)
    const s = pickSetting(rng, ctx)
    const { a, b, w } = drawAddends(rng, ctx, this.id)
    return makeItem({
      templateId: this.id, unitId: UNIT, lessonId: LES(6), ctx, skillIds: [K(9)], modelRung: 'build', formatCode: 'N-I11',
      prompt: joinStory(s, a, b),
      figures: [{ kind: 'scene', setting: s.id, shape: s.shape, groups: [a, b], spoken: 'two groups' }],
      parts: [part('p1', { kind: 'paper', id: 'N-I11', button: 'I drew it', chips: [String(a), String(b), String(w), '+', MINUS, '='] },
        { kind: 'paper-ack', accepts: bothOrders(a, b, w) }, [K(9)],
        { prompt: 'Draw a bond for this story on paper. Then make the sentence.' })],
      ladderFamily: 'story', params: { setting: s.id, a, b }, givens: [a, b], fact: fact(w, a, b),
    })
  },
  answerFor: (p) => {
    const a = num(p, 'a'), b = num(p, 'b')
    return { p1: { kind: 'paper-ack', accepts: bothOrders(a, b, a + b) } }
  },
  verifyFor: (p) => ({ args: { story: 0, a: num(p, 'a'), b: num(p, 'b') } }),
}

export const G1U02_TEMPLATES: readonly SMTemplateDef[] = [
  l1SplitAny, l1SplitAnotherWay, l1ListSplits, l1MissingSplitChoice,
  l2BondFromSplit, l2BondGiven, l2WhichBond, l2WholePartTruth,
  l3JoinBond, l3AddPad, l3WhichSentence,
  l4TakeAway, l4EmptyPartBond, l4SubPad, l4MissingPartChoice, l4SignDecides, l4ErrorTakeAway,
  l5FourFacts, l5EqualsTruth, l5BoxAnyPlace, l5MissingAddendChoice,
  l6JoinStory, l6TakeawayStory, l6WhichBondStory, l6PaperBond,
]

/** Exposed for the gate: the honest pools and error rules, so it can print what each template draws from. */
export const G1U02_POOLS = { missingPart: MISSING_POOL, missingAddend: ADDEND_POOL, errorRules: ERROR_RULES } as const
export type { SMVerify }
