/**
 * The outside templates G1-U02 needs (EXEMPLAR-G1-U02 §4 "Outside the unit"; BUILD-PLAN
 * stage 1b): the three U01 templates its entry check and returns use, and the U04 preview.
 * They become part of G1-U01 / G1-U04 at the Grade 1 fan-out.
 *
 * The count in `count_set` and the rows in `match_more` are never printed as numbers: the
 * child counts or matches them. Their ladders (`count`, `match`, `order`, `teen`) are
 * authored in the §6 shape (engine/lib/ladders.ts).
 */

import type { SMPart, SMTemplateDef } from '../../types'
import { contentCanon, orderChoices, type Draft } from '../lib/choices'
import { drawInt, makeItem, num, option, reviewRules, str } from '../lib/item'

const ID1 = (s: string) => `sm.g1u01.${s}`

function onePart(p: Omit<SMPart, 'id' | 'reveal' | 'reviewRules'> & { reviewRules?: SMPart['reviewRules'] }): SMPart {
  return { id: 'p1', reveal: 'with-item', reviewRules: p.reviewRules ?? [], ...p }
}

const countSet: SMTemplateDef = {
  id: ID1('l1.count_set'), unitId: 'G1-U01', lessonId: 'G1-U01-L1', skillIds: ['G1-U01-K1'],
  uses: ['entry', 'return', 'starter', 'warm'], ladderFamily: 'count',
  build(rng, ctx) {
    const n = drawInt(rng, ctx, 'n', 4, 10)
    return makeItem({
      templateId: this.id, unitId: 'G1-U01', lessonId: 'G1-U01-L1', ctx, skillIds: ['G1-U01-K1'], modelRung: 'build', formatCode: 'T2',
      prompt: 'Touch each counter once. How many counters are there?',
      figures: [{ kind: 'counters', count: n, layout: 'scattered', tappable: true, spoken: 'some counters' }],
      parts: [onePart({ surface: { kind: 'pad', id: 'T8' }, answer: { kind: 'number', value: n }, skillIds: ['G1-U01-K1'],
        reviewRules: reviewRules({ n }, n, ['count.double-touch', 'count.skip']) })],
      ladderFamily: 'count', params: { n }, givens: [],
    })
  },
  answerFor: (p) => ({ p1: { kind: 'number', value: num(p, 'n') } }),
  verifyFor: (p) => ({ args: { n: num(p, 'n') } }),
}

const matchMore: SMTemplateDef = {
  id: ID1('l3.match_more'), unitId: 'G1-U01', lessonId: 'G1-U01-L3', skillIds: ['G1-U01-K3'],
  uses: ['entry', 'return', 'starter', 'warm'], ladderFamily: 'match',
  build(rng, ctx) {
    const more = drawInt(rng, ctx, 'more', 4, 9)
    const fewer = more - drawInt(rng, ctx, 'gap', 1, 3)
    // L51: the spread-out row is the bigger on half the draws, and on top on half the draws.
    const spreadIsMore = rng.chance(0.5)
    const spreadTop = rng.chance(0.5)
    const spreadCount = spreadIsMore ? more : fewer
    const compactCount = spreadIsMore ? fewer : more
    const top = spreadTop ? spreadCount : compactCount
    const bottom = spreadTop ? compactCount : spreadCount
    const keyRow = top > bottom ? 'top' : 'bottom'
    const otherRow = keyRow === 'top' ? 'bottom' : 'top'
    const row = (which: 'top' | 'bottom', rule: string | null): Draft => ({ text: `the ${which} row`, content: { kind: 'row', which }, rule })
    const distractorRule = spreadIsMore ? 'match.more-fewer-swap' : 'match.spread-looks-more'
    // Rows are places on the screen, so they keep their order: top row first.
    const drafts = [row(keyRow, null), row(otherRow, distractorRule)].sort((x, y) => (x.text < y.text ? 1 : -1))
    const choices = drafts.map((d, i) => ({ key: i === 0 ? 'A' : 'B', text: d.text, content: d.content, rule: d.rule }))
    const key = choices.find((c) => c.rule === null)!.key
    return makeItem({
      templateId: this.id, unitId: 'G1-U01', lessonId: 'G1-U01-L3', ctx, skillIds: ['G1-U01-K3'], modelRung: 'read', formatCode: 'N-F8',
      prompt: 'Which row has more?',
      figures: [{ kind: 'match-rows', top: { count: top, spread: spreadTop }, bottom: { count: bottom, spread: !spreadTop }, spoken: 'two rows of counters' }],
      parts: [onePart({ surface: { kind: 'choices', id: 'T1', choices, numeric: false, pictures: false }, answer: { kind: 'choice-key', key }, skillIds: ['G1-U01-K3'] })],
      ladderFamily: 'match', params: { top, bottom, spreadTop: spreadTop ? 1 : 0 }, givens: [],
    })
  },
  answerFor: (p) => ({ p1: { kind: 'choice-key', content: contentCanon({ kind: 'row', which: num(p, 'top') > num(p, 'bottom') ? 'top' : 'bottom' }) } }),
  verifyFor: (p) => ({ args: { top: num(p, 'top'), bottom: num(p, 'bottom'), spreadTop: num(p, 'spreadTop') } }),
}

const oneMoreLess: SMTemplateDef = {
  id: ID1('l4.one_more_less'), unitId: 'G1-U01', lessonId: 'G1-U01-L4', skillIds: ['G1-U01-K4'],
  uses: ['entry', 'return', 'starter'], ladderFamily: 'order',
  build(rng, ctx) {
    const dir = option(ctx, 'dir', ['before', 'after'] as const) ?? (rng.chance(0.5) ? 'before' : 'after')
    const n = dir === 'before' ? drawInt(rng, ctx, 'n', 2, 10) : drawInt(rng, ctx, 'n', 1, 9)
    const key = dir === 'before' ? n - 1 : n + 1
    const start = Math.min(Math.max(n - 2, 1), 6)
    const cells = Array.from({ length: 5 }, (_, i) => start + i).map((v) => (v === key ? null : v))
    return makeItem({
      templateId: this.id, unitId: 'G1-U01', lessonId: 'G1-U01-L4', ctx, skillIds: ['G1-U01-K4'], modelRung: 'read', formatCode: 'T8',
      prompt: `What number comes just ${dir} ${n}?`,
      figures: [{ kind: 'number-track', cells, spoken: 'a number track' }],
      parts: [onePart({ surface: { kind: 'pad', id: 'T8' }, answer: { kind: 'number', value: key }, skillIds: ['G1-U01-K4'],
        reviewRules: reviewRules({ n, before: dir === 'before' ? 1 : 0 }, key, ['order.before-after-swap']) })],
      ladderFamily: 'order', params: { n, dir }, givens: [n, ...cells.filter((c): c is number => c !== null)],
    })
  },
  answerFor: (p) => ({ p1: { kind: 'number', value: str(p, 'dir') === 'before' ? num(p, 'n') - 1 : num(p, 'n') + 1 } }),
  verifyFor: (p) => ({ args: { n: num(p, 'n'), before: str(p, 'dir') === 'before' ? 1 : 0 } }),
}

const tenAndSome: SMTemplateDef = {
  id: 'sm.preview.g1u04.ten_and_some', unitId: 'G1-U04', lessonId: 'G1-U04-L1', skillIds: ['G1-U04-K1'],
  uses: ['preview'], ladderFamily: 'teen',
  build(rng, ctx) {
    const n = drawInt(rng, ctx, 'n', 2, 8)
    const pic = (fullTen: boolean, ones: number, rule: string | null): Draft => ({
      text: fullTen ? `a full ten frame and ${ones} more` : `${ones} on their own`, content: { kind: 'picture', fullTen, ones }, rule,
    })
    const choices = orderChoices(ctx.seed, `${this.id}:${ctx.stream}`, pic(true, n, null), [
      pic(true, n - 1, 'teen.count-slip'), pic(true, n + 1, 'teen.count-slip'), pic(false, n, 'teen.ones-only'),
    ])
    return makeItem({
      templateId: this.id, unitId: 'G1-U04', lessonId: 'G1-U04-L1', ctx, skillIds: ['G1-U04-K1'], modelRung: 'read', formatCode: 'T2',
      prompt: `Which picture shows 10 and ${n}?`, spokenPrompt: `Which picture shows ten and ${n}?`, figures: [],
      parts: [onePart({ surface: { kind: 'choices', id: 'T1', choices, numeric: false, pictures: true }, answer: { kind: 'choice-key', key: choices.find((c) => c.rule === null)!.key }, skillIds: ['G1-U04-K1'] })],
      ladderFamily: 'teen', params: { n }, givens: [10, n], label: 'try a new one',
    })
  },
  answerFor: (p) => ({ p1: { kind: 'choice-key', content: contentCanon({ kind: 'picture', fullTen: true, ones: num(p, 'n') }) } }),
  verifyFor: (p) => ({ args: { n: num(p, 'n') } }),
}

export const G1U01_RETURN_TEMPLATES: readonly SMTemplateDef[] = [countSet, matchMore, oneMoreLess]
export const PREVIEW_TEMPLATES: readonly SMTemplateDef[] = [tenAndSome]
