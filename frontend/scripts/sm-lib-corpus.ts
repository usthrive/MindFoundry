/**
 * sm-lib-corpus — every Grade 1 surface the engine generates, with every string and number
 * a child can meet on it, for the content gates (sm-exam-value-test, sm-no-name-test,
 * sm-spoken-answer-test, sm-readability-test). Not a gate itself.
 *
 * Surfaces: every template and structural variant at the seeds; the entry check, the
 * chapter check and a re-sit, the placement pair; lesson days L1–L6; whole simulated units
 * (lesson and practice days with comebacks, returns and previews); the fix-it after a shown
 * answer (W1); "look again" (W2); and the fixed lines (check screen, review opening, look
 * again).
 */
import { allSMTemplates, buildItem } from '../src/modules/school-math/engine/registry'
import {
  CHECK_SCREEN_LINES, LOOK_AGAIN_LINE, LOOK_AGAIN_OWN_LINE, REVIEW_OPENING_LINE, attemptFrom, chapterCheck, entryCheck,
  fixItAfterShown, lessonDay, lookAgain, placementPair,
} from '../src/modules/school-math/engine/assemble'
import { G1_U02 } from '../src/modules/school-math/curriculum/grade1'
import { printedNumbers } from '../src/modules/school-math/engine/lib/figures'
import { numbersIn } from '../src/modules/school-math/engine/lib/text'
import type { SMItem, SMRole } from '../src/modules/school-math/types'
import { simulateUnit, instantOn } from './sm-lib-sim'

export interface CorpusItem { surface: string; item: SMItem }

export const VARIANTS: Array<{ templateId: string; options?: Record<string, unknown>; partsOnly?: string[]; role?: SMRole }> = [
  ...['1', '2', '3', '4'].map((p) => ({ templateId: 'sm.g1u02.l5.box_any_place', options: { place: p } })),
  ...['1', '2', '3'].flatMap((p) => ['smaller', 'larger'].map((a) => ({ templateId: 'sm.g1u02.l5.box_any_place', options: { place: p, asked: a } }))),
  { templateId: 'sm.g1u02.l6.which_bond_story', options: { kind: 'join' } },
  { templateId: 'sm.g1u02.l6.which_bond_story', options: { kind: 'takeaway' } },
  { templateId: 'sm.g1u02.l4.sign_decides', options: { op: '+' } },
  ...['smaller', 'larger'].map((a) => ({ templateId: 'sm.g1u02.l4.sign_decides', options: { op: '-', asked: a } })),
  { templateId: 'sm.g1u02.l4.error_take_away', options: { story: true } },
  { templateId: 'sm.g1u02.l4.empty_part_bond', partsOnly: ['p1'], role: 'placement' },
  ...['smaller', 'larger'].flatMap((a) => ['empty_part_bond', 'sub_pad'].map((t) => ({ templateId: `sm.g1u02.l4.${t}`, options: { asked: a } }))),
  ...['smaller', 'larger'].map((a) => ({ templateId: 'sm.g1u02.l6.takeaway_story', options: { asked: a } })),
  { templateId: 'sm.g1u01.l4.one_more_less', options: { dir: 'before' } },
  { templateId: 'sm.g1u01.l4.one_more_less', options: { dir: 'after' } },
]

export function generatedCorpus(seeds: number[], simSeeds: number[]): CorpusItem[] {
  const out: CorpusItem[] = []
  const push = (surface: string, item: SMItem | null) => { if (item) out.push({ surface, item }) }
  for (const seed of seeds) {
    for (const d of allSMTemplates()) push('template', buildItem(d.id, { seed }))
    for (const v of VARIANTS) push('template', buildItem(v.templateId, { seed, options: v.options, partsOnly: v.partsOnly, role: v.role }))
    for (const p of entryCheck(G1_U02, seed).pairs) for (const it of p.items) push('entry', it)
    const ck = chapterCheck(G1_U02, seed)
    for (const r of ck.rows) push('check', r.item)
    for (const r of chapterCheck(G1_U02, seed, [ck]).rows) push('check-resit', r.item)
    for (const it of placementPair(G1_U02, seed).items) push('placement', it)
    for (const l of G1_U02.lessons) for (const it of lessonDay(G1_U02, l.id, seed, { dayKey: '2026-11-24' }).items) push('lesson-day', it)
  }
  for (const seed of simSeeds) {
    const { days } = simulateUnit(G1_U02, seed, { extraPractice: 6 })
    for (const d of days) {
      if (d.kind !== 'lesson' && d.kind !== 'practice') continue
      for (const it of d.items) push(`${d.kind}-day`, it)
      for (const it of d.items.slice(0, 3)) { const f = fixItAfterShown(it, d.items); if (f.kind !== 'none') push('fix-it', f.item) }
      if (d.kind === 'practice') {
        const miss = d.items.map((it, k) => attemptFrom(it, { dayKind: 'practice', localDay: d.dayKey, createdAt: instantOn(d.dayKey, k) }, { firstTryCorrect: false, answers: ['(his answer)'], ladderRung: k % 2 ? 4 : 2 }))
        for (const la of lookAgain(d.items, miss, 2, { dayKind: 'practice' })) push('look-again', la.item)
      }
    }
  }
  return out
}

/** The fixed lines every Grade 1 day can say. */
export const FIXED_LINES: Array<{ path: string; text: string }> = [
  ...CHECK_SCREEN_LINES.map((t, i) => ({ path: `check-screen[${i}]`, text: t })),
  { path: 'review-opening', text: REVIEW_OPENING_LINE },
  { path: 'look-again', text: LOOK_AGAIN_LINE },
  { path: 'look-again-own', text: LOOK_AGAIN_OWN_LINE },
]

/** Every string on an item that a child can see or hear, with its path. */
export function itemTexts(it: SMItem): Array<{ path: string; text: string }> {
  const out: Array<{ path: string; text: string }> = [{ path: 'prompt', text: it.prompt }]
  if (it.label) out.push({ path: 'label', text: it.label })
  it.figures.forEach((f, i) => {
    out.push({ path: `figures[${i}].alt`, text: f.alt }, { path: `figures[${i}].spoken`, text: f.spoken })
    if (f.type === 'scene') out.push({ path: `figures[${i}].setting`, text: f.params.setting }, { path: `figures[${i}].shape`, text: f.params.shape })
    if (f.type === 'groups') out.push({ path: `figures[${i}].shape`, text: f.params.shape })
  })
  it.parts.forEach((p, i) => {
    const b = `parts[${i}]`
    if (p.prompt) out.push({ path: `${b}.prompt`, text: p.prompt })
    const s = p.surface
    if (s.kind === 'sentence') { out.push({ path: `${b}.sentence`, text: s.text }); if (s.shapeHint) out.push({ path: `${b}.shapeHint`, text: s.shapeHint }); (s.chips ?? []).forEach((c, j) => out.push({ path: `${b}.chips[${j}]`, text: c })) }
    if (s.kind === 'pad' && s.text) out.push({ path: `${b}.pad`, text: s.text })
    if (s.kind === 'choices') s.choices.forEach((c, j) => out.push({ path: `${b}.choices[${j}]`, text: c.text }))
    if (s.kind === 'truth') s.rows.forEach((r, j) => out.push({ path: `${b}.rows[${j}]`, text: r.text }))
    if (s.kind === 'paper') { out.push({ path: `${b}.paper.button`, text: s.button }); s.chips.forEach((c, j) => out.push({ path: `${b}.chips[${j}]`, text: c })) }
    if (s.kind === 'ack') { out.push({ path: `${b}.ack`, text: s.label }); if (s.lookAgain) out.push({ path: `${b}.ack.lookAgain`, text: s.lookAgain.label }) }
    p.reviewRules.forEach((r, j) => out.push({ path: `${b}.review[${j}]`, text: r.line }))
  })
  it.ladder.forEach((r, i) => out.push({ path: `ladder[${i}]`, text: r.say }))
  it.spokenLines.forEach((t, i) => out.push({ path: `spoken[${i}]`, text: t }))
  if (it.methodLink) out.push({ path: 'methodLink', text: it.methodLink.sentence })
  return out
}

/** Every number on an item: operands, keys, choices and pool values, figure labels, and every number in its strings. */
export function itemNumbers(it: SMItem): Array<{ path: string; value: number }> {
  const out: Array<{ path: string; value: number }> = []
  const add = (path: string, v: unknown) => { if (typeof v === 'number' && Number.isFinite(v)) out.push({ path, value: v }) }
  it.givens.forEach((g, i) => add(`givens[${i}]`, g))
  for (const [k, v] of Object.entries(it.generator.params)) {
    if (Array.isArray(v)) v.forEach((x, i) => add(`params.${k}[${i}]`, x)); else add(`params.${k}`, v)
  }
  it.figures.forEach((f, i) => printedNumbers(f).forEach((n) => add(`figures[${i}]`, n)))
  it.parts.forEach((p, i) => {
    const a = p.answer
    if (a.kind === 'number') add(`parts[${i}].key`, a.value)
    if (a.kind === 'bond-parts') { add(`parts[${i}].key.whole`, a.whole); (a.parts ?? []).forEach((x) => add(`parts[${i}].key.part`, x)) }
    if (a.kind === 'split') add(`parts[${i}].key.whole`, a.whole)
    if (p.surface.kind === 'choices') p.surface.choices.forEach((c, j) => {
      const ct = c.content
      if (ct.kind === 'number') add(`parts[${i}].choices[${j}]`, ct.value)
      if (ct.kind === 'pair') { add(`parts[${i}].choices[${j}]`, ct.a); add(`parts[${i}].choices[${j}]`, ct.b) }
      if (ct.kind === 'bond') [ct.bond.whole, ...ct.bond.parts].forEach((x) => add(`parts[${i}].choices[${j}]`, x))
      if (ct.kind === 'picture') add(`parts[${i}].choices[${j}]`, ct.ones)
    })
    p.reviewRules.forEach((r, j) => add(`parts[${i}].review[${j}].value`, r.value))
  })
  for (const t of itemTexts(it)) numbersIn(t.text).forEach((n) => add(t.path, n))
  return out
}
