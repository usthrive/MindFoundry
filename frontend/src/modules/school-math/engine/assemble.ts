/**
 * Assembly for stage 1, run 1 (minimal): the chapter check, the entry check, the
 * placement pair, and the W1 fix-it twin (BUILD-PLAN §13).
 *
 * Lesson-day and practice-day assembly, the scheduler (returns, comebacks, previews,
 * `weakness()`) and mastery are run 2 (BUILD-PLAN stage 1a); they are not stubbed here
 * because nothing in this run calls them.
 *
 * Every check, entry and placement item avoids the unit's demo facts (EXEMPLAR §1) and no
 * two items of one form share an operand tuple (QG-1): a collision is redrawn on the next
 * stream, never patched. A re-sit (`priorForms`) shares no operand tuple with any earlier
 * form (QG-4, freshForm).
 */

import type { SMCheckForm, SMCheckRow, SMEntryForm, SMItem, SMPlacementPair, SMUnit } from '../types'
import { demoFacts } from '../curriculum/grade1'
import { buildItem, getSMTemplate } from './registry'
import { operandSignature } from './validator'

const T = (s: string) => `sm.g1u02.${s}`

interface Blueprint {
  section: string
  points: number
  templateId: string
  options?: Record<string, unknown>
  category: SMCheckRow['category']
  note: string
}

/** G1-U02-CK (EXEMPLAR §7; GRADE-1 §4.1): 15 points, A 2 / B 2 / C 3. */
const G1U02_CK: Blueprint[] = [
  { section: 'A1', points: 2, templateId: T('l4.missing_part_choice'), category: 'concepts and procedures', note: 'five-value pool, three ranks' },
  { section: 'A2', points: 2, templateId: T('l3.which_sentence'), category: 'concepts and procedures', note: 'sentence choices' },
  { section: 'A3', points: 2, templateId: T('l5.missing_addend_choice'), category: 'concepts and procedures', note: 'five-value pool, three ranks' },
  { section: 'B4', points: 2, templateId: T('l3.join_bond'), category: 'concepts and procedures', note: '1 the whole, 1 the sentence' },
  { section: 'B5a', points: 1, templateId: T('l4.sub_pad'), category: 'concepts and procedures', note: 'take away' },
  { section: 'B5b', points: 1, templateId: T('l5.box_any_place'), options: { place: '4' }, category: 'concepts and procedures', note: 'unknown start: □ − p = k' },
  { section: 'B6', points: 2, templateId: T('l4.error_take_away'), category: 'reasoning', note: '1 the fix, 1 the rows (all six right = 1 point)' },
  { section: 'C7', points: 3, templateId: T('l6.join_story'), category: 'concepts and procedures', note: '1 the bond, 1 the sentence, 1 the answer' },
]

function blueprintFor(unit: SMUnit): Blueprint[] {
  if (unit.id === 'G1-U02') return G1U02_CK
  throw new Error(`no chapter-check blueprint for ${unit.id} yet (Grade 1 fan-out)`)
}

/** Build with redraws until the operand tuple is unused in `taken`. */
function drawFresh(templateId: string, base: Parameters<typeof buildItem>[1], taken: Set<string>, tries = 60): SMItem {
  for (let t = 0; t < tries; t++) {
    const item = buildItem(templateId, { ...base, stream: `${base.stream}#${t}` })
    const sig = operandSignature(item)
    if (!taken.has(sig)) { taken.add(sig); return item }
  }
  throw new Error(`${templateId}: no fresh draw in ${tries} tries`)
}

const rankOf = (list: string[], x: string) => (list.includes(x) ? list.indexOf(x) : list.length)

export function chapterCheck(unit: SMUnit, seed: number, priorForms: SMCheckForm[] = []): SMCheckForm {
  const formLabel = String.fromCharCode(65 + priorForms.length)
  const taken = new Set<string>(priorForms.flatMap((f) => f.rows.map((r) => operandSignature(r.item))))
  // Demo facts are never drawn; and no two items on one form share a fact family (main-session
  // review of the stage-1 dump: A1, A2 and C7 all landed on 10 = 8 + 2, so working out one item
  // answered two more). Each drawn item's fact joins the avoid list for the items after it.
  // The 1-point quick sums (B5a, B5b) may use a part of 1; every other row keeps parts of 2 or
  // more. Within 10, with no demo fact, only about ten fact families exist for eight
  // items, so the most constrained rows are drawn first (the story, the error item, the two
  // pooled choice items); the form is still served in the blueprint's order A1 … C7.
  const avoid = [...demoFacts(unit)]
  const blueprint = blueprintFor(unit)
  const FIRST = ['C7', 'B6', 'A1', 'A3', 'B4']
  const order = [...blueprint].sort((x, y) => rankOf(FIRST, x.section) - rankOf(FIRST, y.section))
  const drawn = new Map<string, SMItem>()
  for (const b of order) {
    const item = drawFresh(b.templateId, { seed, role: 'check', stream: `CK:${formLabel}:${b.section}`, options: b.options, avoidFacts: avoid, minPart: b.points >= 2 ? 2 : 1 }, taken, 200)
    if (item.fact) avoid.push(item.fact)
    drawn.set(b.section, item)
  }
  const rows: SMCheckRow[] = blueprint.map((b) => ({ section: b.section, points: b.points, item: drawn.get(b.section)!, category: b.category, note: b.note }))
  return { unitId: unit.id, kind: 'chapter-check', seed, rows, totalPoints: rows.reduce((s, r) => s + r.points, 0) }
}

const ENTRY_PAIRS: Record<string, Array<{ skill: string; templateId: string; opensLesson: string; options?: (seed: number) => Record<string, unknown> }>> = {
  'G1-U02': [
    { skill: 'count a set to 10', templateId: 'sm.g1u01.l1.count_set', opensLesson: 'G1-U01-L1' },
    // the pair keeps one structure: both "just before" or both "just after"
    { skill: 'one more and one less', templateId: 'sm.g1u01.l4.one_more_less', opensLesson: 'G1-U01-L4', options: (s) => ({ dir: s % 2 ? 'before' : 'after' }) },
    { skill: 'more or fewer by matching', templateId: 'sm.g1u01.l3.match_more', opensLesson: 'G1-U01-L3' },
  ],
}

export function entryCheck(unit: SMUnit, seed: number): SMEntryForm {
  const spec = ENTRY_PAIRS[unit.id]
  if (!spec) throw new Error(`no entry check for ${unit.id} yet`)
  const taken = new Set<string>()
  const pairs = spec.map((p) => {
    const mk = (i: number) => drawFresh(p.templateId, { seed, role: 'entry', stream: `EC:${p.templateId}:${i}`, options: p.options?.(seed) }, taken)
    return { skill: p.skill, opensLesson: p.opensLesson, items: [mk(0), mk(1)] as [SMItem, SMItem] }
  })
  return { unitId: unit.id, kind: 'entry-check', seed, pairs }
}

/** BUILD-PLAN §6: the unit's core skill, typed (not chosen), × 2 at the placement seed. */
export function placementPair(unit: SMUnit, seed: number): SMPlacementPair {
  if (unit.id !== 'G1-U02') throw new Error(`no placement pair for ${unit.id} yet`)
  const taken = new Set<string>()
  const avoid = demoFacts(unit)
  const mk = (i: number) => drawFresh(T('l4.empty_part_bond'), { seed, role: 'placement', stream: `PL:${i}`, partsOnly: ['p1'], avoidFacts: avoid }, taken)
  return { unitId: unit.id, kind: 'placement-pair', seed, items: [mk(0), mk(1)] }
}

/**
 * W1 (BUILD-PLAN §13): after a rung-4 item, a same-template twin at a fresh seed, with the
 * same structure (options, parts kept) and different numbers. Role `review`, never
 * "knows" evidence.
 */
export function fixItTwin(item: SMItem, freshSeed: number): SMItem {
  if (!getSMTemplate(item.templateId)) throw new Error(`unknown template ${item.templateId}`)
  const taken = new Set<string>([operandSignature(item)])
  return drawFresh(item.templateId, {
    seed: freshSeed, role: 'review', stream: `FX:${item.generator.stream}`,
    options: item.generator.options, partsOnly: item.generator.partsOnly,
  }, taken)
}
