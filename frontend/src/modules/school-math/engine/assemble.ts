/**
 * Assembly (BUILD-PLAN stage 1a; EXEMPLAR-G1-U02 §3, §7; ENGINE-SPEC §4.3–§4.8):
 *   - forms: the chapter check, the entry check, the placement pair (run 1);
 *   - days (run 2): the LESSON day and the PRACTICE day, each a frozen manifest (slot →
 *     template, seed, stream, role, options) that rebuilds byte for byte (`dayManifestHash`);
 *   - wrong-work review (BUILD-PLAN §13): W1 the fix-it twin after a shown answer
 *     (`fixItTwin`, `fixItAfterShown`, `queueAfterShown`), W2 "look again" at the end of a
 *     practice day (`lookAgain`), and the day's score, which review answers never change
 *     (`dayScore`).
 *
 * Every check, entry and placement item avoids the unit's demo facts (EXEMPLAR §1) and no
 * two items of one form share an operand tuple (QG-1): a collision is redrawn on the next
 * stream, never patched. A re-sit (`priorForms`) shares no operand tuple with any earlier
 * form (QG-4, freshForm). A day holds no repeated operand tuple and no fact family twice
 * (one answer must not hand over another), and a lesson day never uses its own demo's fact.
 */

import type {
  ModelRung, SMAttempt, SMCheckForm, SMCheckRow, SMDay, SMDayKind, SMDayManifest, SMDaySlot, SMEntryForm, SMItem,
  SMLesson, SMPlacementPair, SMRole, SMSlotRole, SMUnit,
} from '../types'
import { streamRng } from '../../best-brains/generator/rng'
import { skillStates, type SkillStatus } from './mastery'
import {
  comebackCap, comebackLedger, daysBetween, dueComebacks, factFamily, freshDraw, previewDecision, returnCandidates, returnTemplates,
  seenSignatures, weakestFirst, type SMComebackEntry,
} from './scheduler'
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
function drawFresh(templateId: string, base: Parameters<typeof buildItem>[1], taken: Set<string>, tries = 60, accept: (it: SMItem) => boolean = () => true): SMItem {
  for (let t = 0; t < tries; t++) {
    const item = buildItem(templateId, { ...base, stream: `${base.stream}#${t}` })
    const sig = operandSignature(item)
    if (!taken.has(sig) && accept(item)) { taken.add(sig); return item }
  }
  throw new Error(`${templateId}: no fresh draw in ${tries} tries`)
}

const rankOf = (list: string[], x: string) => (list.includes(x) ? list.indexOf(x) : list.length)

/** An item served to the child (from his attempts): a check never repeats one exactly. */
export interface RecentItem { templateId: string; signature: string }

/** The items he was served in the last `days` local days before `dayKey` (Opus re-check: last 7). */
export function recentServed(attempts: readonly SMAttempt[], dayKey: string, days = 7): RecentItem[] {
  return attempts.filter((a) => a.localDay < dayKey && daysBetween(a.localDay, dayKey) <= days).map((a) => ({ templateId: a.templateId, signature: a.signature }))
}

export function chapterCheck(unit: SMUnit, seed: number, priorForms: SMCheckForm[] = [], recent: readonly RecentItem[] = []): SMCheckForm {
  const formLabel = String.fromCharCode(65 + priorForms.length)
  // Demo facts are never drawn; and no two items on one form share a fact family (main-session
  // review of the stage-1 dump: A1, A2 and C7 all landed on 10 = 8 + 2, so working out one item
  // answered two more). Each drawn item's fact joins the avoid list for the items after it.
  // Within 10, with no demo fact, only about ten fact families exist for eight items, so the
  // order rows are drawn in decides what the late rows can get. A fixed order made the late rows
  // near-deterministic (A2 = 8 = 6 + 2 at three gate seeds: Opus re-check), so the 2-point rows
  // are drawn in an order shuffled by the seed; the 1-point quick sums (B5b, B5a) come last, ask
  // for parts of 2 or more and no double first, and fall back to a part of 1 (never a double)
  // only when nothing else is left. A row never repeats an item he was served in the last 7
  // days (same template, same numbers); practice may share fact families with the check. The
  // form is served in the blueprint's order A1 … C7.
  const blueprint = blueprintFor(unit)
  const seen = new Set(recent.map((r) => `${r.templateId}|${r.signature}`))
  const notRecent = (it: SMItem) => !seen.has(`${it.templateId}|${operandSignature(it)}`)
  const notDouble = (it: SMItem) => !it.fact || it.fact.parts[0] !== it.fact.parts[1]
  const twoPoint = blueprint.filter((b) => b.points >= 2)
  const quick = ['B5b', 'B5a'].map((sec) => blueprint.find((b) => b.section === sec)).filter((b): b is Blueprint => !!b)
  const tryOrder = (order: Blueprint[]): Map<string, SMItem> => {
    const taken = new Set<string>(priorForms.flatMap((f) => f.rows.map((r) => operandSignature(r.item))))
    const avoid = [...demoFacts(unit)]
    const drawn = new Map<string, SMItem>()
    for (const b of order) {
      const base = { seed, role: 'check' as const, stream: `CK:${formLabel}:${b.section}`, options: b.options, avoidFacts: avoid }
      let item: SMItem
      if (b.points >= 2) item = drawFresh(b.templateId, { ...base, minPart: 2 }, taken, 200, notRecent)
      else {
        try { item = drawFresh(b.templateId, { ...base, minPart: 2 }, taken, 60, (it) => notDouble(it) && notRecent(it)) } catch {
          item = drawFresh(b.templateId, { ...base, stream: `${base.stream}:p1`, minPart: 1 }, taken, 200, (it) => notDouble(it) && notRecent(it))
        }
      }
      if (item.fact) avoid.push(item.fact)
      drawn.set(b.section, item)
    }
    return drawn
  }
  let drawn: Map<string, SMItem> | null = null
  const rng = streamRng(seed, `sm:ck-order:${formLabel}`)
  for (let attempt = 0; attempt < 8 && !drawn; attempt++) {
    try { drawn = tryOrder([...rng.shuffle(twoPoint), ...quick]) } catch { drawn = null }
  }
  // the most constrained rows first: the story, the error item, the pooled choices
  if (!drawn) {
    const SAFE = ['C7', 'B6', 'A1', 'A3', 'B4', 'A2']
    drawn = tryOrder([...[...twoPoint].sort((x, y) => rankOf(SAFE, x.section) - rankOf(SAFE, y.section)), ...quick])
  }
  const rows: SMCheckRow[] = blueprint.map((b) => ({ section: b.section, points: b.points, item: drawn!.get(b.section)!, category: b.category, note: b.note }))
  return { unitId: unit.id, kind: 'chapter-check', seed, rows, totalPoints: rows.reduce((s, r) => s + r.points, 0) }
}

const ENTRY_PAIRS: Record<string, Array<{ skill: string; templateId: string; opensLesson: string; options?: (seed: number, i: number) => Record<string, unknown> }>> = {
  'G1-U02': [
    { skill: 'count a set to 10', templateId: 'sm.g1u01.l1.count_set', opensLesson: 'G1-U01-L1' },
    // the pair keeps one structure: both "just before" or both "just after"
    { skill: 'one more and one less', templateId: 'sm.g1u01.l4.one_more_less', opensLesson: 'G1-U01-L4', options: (s) => ({ dir: s % 2 ? 'before' : 'after' }) },
    // the row with more is on top on one item and below on the other (Opus re-check)
    { skill: 'more or fewer by matching', templateId: 'sm.g1u01.l3.match_more', opensLesson: 'G1-U01-L3', options: (s, i) => ({ keyRow: (s + i) % 2 ? 'top' : 'bottom' }) },
  ],
}

/** The numbers of an entry item, as a set to compare a pair by (structure flags left out). */
function pairNumbers(it: SMItem): string {
  return Object.entries(it.generator.params).filter(([k, v]) => typeof v === 'number' && k !== 'spreadTop').map(([, v]) => v as number).sort((a, b) => a - b).join(',')
}

export function entryCheck(unit: SMUnit, seed: number): SMEntryForm {
  const spec = ENTRY_PAIRS[unit.id]
  if (!spec) throw new Error(`no entry check for ${unit.id} yet`)
  const taken = new Set<string>()
  const pairs = spec.map((p) => {
    // the two items of a pair share a structure but never their numbers (seed 29 drew top 5 /
    // bottom 7 twice, only the spread row moved: Opus re-check)
    const first = drawFresh(p.templateId, { seed, role: 'entry', stream: `EC:${p.templateId}:0`, options: p.options?.(seed, 0) }, taken)
    const second = drawFresh(p.templateId, { seed, role: 'entry', stream: `EC:${p.templateId}:1`, options: p.options?.(seed, 1) }, taken, 60,
      (it) => pairNumbers(it) !== pairNumbers(first))
    return { skill: p.skill, opensLesson: p.opensLesson, items: [first, second] as [SMItem, SMItem] }
  })
  return { unitId: unit.id, kind: 'entry-check', seed, pairs }
}

/** BUILD-PLAN §6: the unit's core skill, typed (not chosen), × 2 at the placement seed. */
export function placementPair(unit: SMUnit, seed: number): SMPlacementPair {
  if (unit.id !== 'G1-U02') throw new Error(`no placement pair for ${unit.id} yet`)
  const taken = new Set<string>()
  const avoid = demoFacts(unit)
  // never a double (whole 4, shown 2: copying the shown number scores), and a whole of 5 or more
  // when one is free (Opus re-check)
  const notDouble = (it: SMItem) => !it.fact || it.fact.parts[0] !== it.fact.parts[1]
  const mk = (i: number) => {
    const base = { seed, role: 'placement' as const, stream: `PL:${i}`, partsOnly: ['p1'], avoidFacts: avoid }
    try { return drawFresh(T('l4.empty_part_bond'), base, taken, 60, (it) => notDouble(it) && (it.fact?.whole ?? 0) >= 5) } catch {
      return drawFresh(T('l4.empty_part_bond'), { ...base, stream: `${base.stream}:any` }, taken, 60, notDouble)
    }
  }
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

/**
 * A fix-it twin that also keeps clear of every fact family already on the day (Fable gate:
 * a twin drew the same fact as a later slot). Same seed and stream names as `fixItTwin`, so
 * with nothing to avoid it is the same twin. When no such draw exists, the plain twin is used
 * and `familyRepeats` says so (as comebacks mark theirs).
 */
export function fixItTwinAvoiding(item: SMItem, freshSeed: number, dayItems: readonly SMItem[]): { item: SMItem; familyRepeats: boolean } {
  const fams = new Set(dayItems.filter((x) => x.fact).map((x) => factFamily(x.fact!)))
  if (item.fact) fams.add(factFamily(item.fact))
  const sig = operandSignature(item)
  for (let t = 0; t < 60; t++) {
    const cand = buildItem(item.templateId, {
      seed: freshSeed, role: 'review', stream: `FX:${item.generator.stream}#${t}`,
      options: item.generator.options, partsOnly: item.generator.partsOnly,
    })
    if (operandSignature(cand) === sig) continue
    if (cand.fact && fams.has(factFamily(cand.fact))) continue
    return { item: cand, familyRepeats: false }
  }
  return { item: fixItTwin(item, freshSeed), familyRepeats: true }
}

// ===========================================================================
// Days (stage 1 run 2): the lesson day and the practice day
// ===========================================================================

/** Decision T-2 (Grade 1): lesson N 5 (6 on the explain days), practice N 8; parent ranges. */
export const GRADE1_DAYS = { lessonN: 5, practiceN: 8, lessonRange: [4, 8], practiceRange: [6, 12] } as const

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

/** FNV-1a over the manifest's JSON, two lanes, as 16 hex digits (a reload must reproduce it). */
export function dayManifestHash(m: SMDayManifest): string {
  const json = JSON.stringify(m)
  let h1 = 0x811c9dc5, h2 = 0x01000193 ^ json.length
  for (let i = 0; i < json.length; i++) {
    const c = json.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0
    h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')
}

/** Rebuild a day's items from its frozen manifest (the one path every day takes; resume after reload). */
export function itemsFromManifest(m: SMDayManifest): Array<SMItem | null> {
  return m.slots.map((sl) => (sl.templateId && sl.role !== 'demo'
    ? buildItem(sl.templateId, { seed: sl.seed, role: sl.role as SMRole, stream: sl.stream, options: sl.options, minPart: sl.minPart })
    : null))
}

function finishDay(m: SMDayManifest, unit: SMUnit): SMDay {
  const items = itemsFromManifest(m)
  const demo = m.dayKind === 'lesson' ? unit.lessonExampleNumbers.find((d) => d.lessonId === m.lessonId) : undefined
  return { manifest: m, items, demo, hash: dayManifestHash(m) }
}

interface Plan {
  role: SMSlotRole
  inN: boolean
  templateId?: string
  options?: Record<string, unknown>
  source: string
  reopens?: string
  comebackKey?: string
  /** Fresh against the child's last 21 days of this skill (returns, comebacks, starters). */
  freshFor?: string[]
  /** Smallest part the fact may have (see SMDaySlot.minPart). */
  minPart?: number
}

const lessonIndexOf = (unit: SMUnit, lessonId: string) => {
  const i = unit.lessons.findIndex((l) => l.id === lessonId)
  if (i < 0) throw new Error(`${lessonId} is not a lesson of ${unit.id}`)
  return i + 1
}

// ---------------------------------------------------------------------------
// Blind-habit balance (EXEMPLAR §3): over a day's missing-part items, the answer is the
// bigger part on no more than 60 % (the assembler aims at half, deterministically).
// ---------------------------------------------------------------------------

/** Templates whose missing part can be forced smaller or larger (`asked`). */
const FORCEABLE = new Set([T('l4.empty_part_bond'), T('l4.sub_pad'), T('l5.box_any_place'), T('l4.sign_decides'), T('l6.takeaway_story')])
/** Templates whose pools need the larger missing part (they always ask it). */
const ALWAYS_LARGER = new Set([T('l4.missing_part_choice'), T('l5.missing_addend_choice')])
/** The forceable sibling that replaces an always-larger item when a day has too many. */
const SIBLING: Record<string, Array<{ templateId: string; options?: Record<string, unknown> }>> = {
  [T('l4.missing_part_choice')]: [{ templateId: T('l4.empty_part_bond') }, { templateId: T('l4.sub_pad') }],
  [T('l5.missing_addend_choice')]: [{ templateId: T('l5.box_any_place'), options: { place: '1' } }, { templateId: T('l5.box_any_place'), options: { place: '2' } }],
}

/** A planned slot that puts an add in front of him (so a day keeps adds beside take-aways). */
const ADDISH = (p: Plan): boolean =>
  [T('l3.join_bond'), T('l3.add_pad'), T('l5.missing_addend_choice'), T('l5.four_facts'), T('l5.equals_truth'), T('l6.join_story'), T('l6.paper_bond')].includes(p.templateId ?? '')
  || (p.templateId === T('l5.box_any_place') && ['1', '2'].includes(String(p.options?.place)))
  || (p.templateId === T('l4.sign_decides') && p.options?.op === '+')

/** Is this planned slot a missing-part item (a shown part, the other asked)? */
export function isMissingPartPlan(templateId: string | undefined, options?: Record<string, unknown>): 'forceable' | 'larger' | null {
  if (!templateId) return null
  if (ALWAYS_LARGER.has(templateId)) return 'larger'
  if (!FORCEABLE.has(templateId)) return null
  if (templateId === T('l5.box_any_place') && (options?.place === '4' || options?.place === undefined)) return options?.place === '4' ? null : 'forceable'
  if (templateId === T('l4.sign_decides') && options?.op !== '-') return null
  return 'forceable'
}

/**
 * Assign `asked` across the day: alternation smaller, larger, smaller … over the
 * forceable slots in slot order, with the larger answers capped so that, counting the
 * always-larger items, at most half the day's missing-part items have the bigger answer.
 * `compose` first swaps an always-larger current item for its forceable sibling while the
 * always-larger items alone would pass half (practice days only).
 */
export function balanceMissingParts(plans: Plan[], compose: boolean, swappable: (p: Plan) => boolean = (p) => p.role === 'practice'): void {
  // a comeback or return keeps its whole space for fresh numbers (W5): it is not forced, and
  // the balance counts it as a bigger-part answer whenever it can be one (the worst case)
  const unforced = (p: Plan) => p.role === 'comeback' || p.role === 'return'
  const kinds = () => plans.map((p) => {
    if (p.role === 'demo') return null
    const k = isMissingPartPlan(p.templateId, p.options)
    return k === 'forceable' && unforced(p) ? 'larger' : k
  })
  if (compose) {
    for (let guard = 0; guard < plans.length; guard++) {
      const k = kinds()
      const L = k.filter((x) => x === 'larger').length
      const F = k.filter((x) => x === 'forceable').length
      if (L === 0 || 2 * L <= L + F) break
      // first, turn a "+" sign item into a "−" one, when another add stays on the day (E90)
      const sign = plans.findIndex((p) => swappable(p) && p.templateId === T('l4.sign_decides') && p.options?.op === '+')
      if (sign >= 0 && plans.some((p, j) => j !== sign && swappable(p) && ADDISH(p))) {
        plans[sign] = { ...plans[sign], options: { ...plans[sign].options, op: '-' }, source: `${plans[sign].source} (blind-habit: −)` }
        continue
      }
      // the last one first: the lesson before's items sit last, so the lesson just taught keeps its own
      let i = -1
      for (let j = plans.length - 1; j >= 0 && i < 0; j--) if (k[j] === 'larger' && swappable(plans[j]) && SIBLING[plans[j].templateId!]) i = j
      if (i < 0) {
        // last: turn a current item of the same lesson into a forceable missing-part item
        // (never the start-unknown box, the paper bond, or the day's last add)
        const REPLACE: Record<string, { templateId: string; options?: Record<string, unknown> }> = {
          'G1-U02-L4': { templateId: T('l4.sub_pad') },
          'G1-U02-L5': { templateId: T('l5.box_any_place'), options: { place: '3' } },
          'G1-U02-L6': { templateId: T('l6.takeaway_story') },
        }
        let r = -1
        for (let j = plans.length - 1; j >= 0 && r < 0; j--) {
          const p = plans[j]
          if (!swappable(p) || k[j] !== null || !p.templateId || p.templateId === T('l6.paper_bond')) continue
          if (p.templateId === T('l5.box_any_place') && p.options?.place === '4') continue
          const lesson = getSMTemplate(p.templateId)?.lessonId ?? ''
          if (!REPLACE[lesson]) continue
          if (ADDISH(p) && !plans.some((q, x) => x !== j && swappable(q) && ADDISH(q))) continue
          r = j
        }
        if (r < 0) break
        const lesson = getSMTemplate(plans[r].templateId!)!.lessonId
        plans[r] = { ...plans[r], templateId: REPLACE[lesson].templateId, options: { ...(REPLACE[lesson].options ?? {}) }, source: `${plans[r].source} (blind-habit: a smaller part)` }
        continue
      }
      const onDay = new Set(plans.map((p) => p.templateId))
      const sibs = SIBLING[plans[i].templateId!]
      const sib = sibs.find((x) => !onDay.has(x.templateId)) ?? sibs[0]
      plans[i] = { ...plans[i], templateId: sib.templateId, options: { ...(sib.options ?? {}) }, source: `${plans[i].source} (blind-habit swap)` }
    }
  }
  const k = kinds()
  const L = k.filter((x) => x === 'larger').length
  const total = k.filter((x) => x !== null).length
  let largerQuota = Math.max(0, Math.floor(total / 2) - L)
  let next: 'smaller' | 'larger' = 'smaller'
  plans.forEach((p, j) => {
    if (k[j] !== 'forceable') return
    let asked: 'smaller' | 'larger' = next
    if (asked === 'larger' && largerQuota === 0) asked = 'smaller'
    if (asked === 'larger') largerQuota--
    p.options = { ...(p.options ?? {}), asked }
    // a forced smaller part is never 1 ("10 − 9 = □" three times a day is counting, not bonds)
    if (asked === 'smaller') p.minPart = Math.max(p.minPart ?? 1, 2)
    next = next === 'smaller' ? 'larger' : 'smaller'
  })
}

// ---------------------------------------------------------------------------
// Build a planned day
// ---------------------------------------------------------------------------

function buildPlanned(
  dayKind: SMDayKind, lessonId: string, dayKey: string, seed: number, plans: Plan[],
  attempts: readonly SMAttempt[], avoidFamilies: string[],
): { slots: SMDaySlot[]; items: Array<SMItem | null> } {
  const taken = new Set<string>()
  const families = new Set<string>(avoidFamilies)
  const slots: SMDaySlot[] = []
  const items: Array<SMItem | null> = []
  plans.forEach((p, index) => {
    const base = { index, role: p.role, inN: p.inN, seed, source: p.source }
    if (p.role === 'demo' || !p.templateId) {
      slots.push({ ...base, stream: 'DEMO' })
      items.push(null)
      return
    }
    const seen = p.freshFor ? seenSignatures(attempts, p.freshFor, dayKey) : new Set<string>()
    const label = `${dayKind}:${lessonId}:${index}`
    const d = freshDraw(p.templateId, { seed, role: p.role as SMRole, stream: label, options: p.options, minPart: p.minPart }, seen, taken, families, 200, noDouble)
    taken.add(operandSignature(d.item))
    if (d.item.fact) families.add(factFamily(d.item.fact))
    const note = d.kind === 'older' ? ' (older: no draw new to him in 21 days)' : d.kind === 'family' ? ' (its fact family repeats: the only fresh draw)' : ''
    const slot: SMDaySlot = { ...base, source: `${p.source}${note}`, templateId: p.templateId, stream: d.stream }
    if (p.options && Object.keys(p.options).length) slot.options = p.options
    if (p.reopens) { slot.reopens = p.reopens; slot.modelRung = rungBelow(d.item.modelRung) }
    if (p.comebackKey) slot.comebackKey = p.comebackKey
    if (p.minPart) slot.minPart = p.minPart
    slots.push(slot)
    items.push(d.item)
  })
  return { slots, items }
}

/**
 * The shown part and the asked part of a missing-part item (null for any other item). On a
 * day, no missing-part item is a double (8 − 4 = □): there the part he can see IS the answer,
 * so copying it (bond.repeat-shown) passes and the item proves nothing (teacher's read of the
 * run-2 dump; it also keeps "the smaller part" honest in the blind-habit balance).
 */
export function shownAndAsked(it: SMItem): { shown: number; asked: number } | null {
  const n = (k: string) => Number(it.generator.params[k])
  const t = it.templateId
  if ([T('l4.empty_part_bond'), T('l4.sub_pad'), T('l4.missing_part_choice'), T('l6.takeaway_story'), T('l4.take_away')].includes(t)) return { shown: n('p'), asked: n('w') - n('p') }
  if (t === T('l4.sign_decides')) return it.generator.params.op === '-' ? { shown: n('p'), asked: n('w') - n('p') } : null
  if (t === T('l5.missing_addend_choice')) return { shown: n('a'), asked: n('w') - n('a') }
  if (t === T('l5.box_any_place')) {
    const place = String(it.generator.params.place)
    if (place === '1') return { shown: n('a'), asked: n('w') - n('a') }
    if (place === '2' || place === '3') return { shown: n('w') - n('a'), asked: n('a') }
  }
  return null
}
const noDouble = (it: SMItem) => { const m = shownAndAsked(it); return !m || m.shown !== m.asked }

const RUNGS: ModelRung[] = ['read', 'label', 'build', 'unaided']
/** One model rung lower (DD6; the stall rule), never below `read`. */
export function rungBelow(r: ModelRung): ModelRung {
  return RUNGS[Math.max(0, RUNGS.indexOf(r) - 1)]
}

// ---------------------------------------------------------------------------
// Lesson day
// ---------------------------------------------------------------------------

/** The entry-check line's templates (G1-U02-EC): L1–L2 starters are fresh draws of these. */
const ENTRY_TEMPLATES: Record<string, string[]> = {
  'G1-U02': ['sm.g1u01.l1.count_set', 'sm.g1u01.l4.one_more_less', 'sm.g1u01.l3.match_more'],
}

export interface LessonDayCtx {
  /** The device's local day key (YYYY-MM-DD). */
  dayKey: string
  /** The parent's lesson-day N (4–8); Grade 1 default 5. */
  n?: number
  attempts?: readonly SMAttempt[]
  /** Skill states (from `skillStates`); computed from `attempts` when absent. */
  states?: Record<string, SkillStatus>
}

function stepTemplates(lesson: SMLesson): string[] {
  return lesson.cpaSteps.filter((t) => t !== lesson.explainTemplate)
}

/**
 * A lesson day (EXEMPLAR §3): starter · demo (not in N, never an attempt) · steps in CPA
 * order · on L4 and L6 the explain step (N + 1) · two exits. A lesson whose skills are all
 * "already knows" (or known) keeps one step, the built model. A stuck skill of an earlier
 * lesson re-opens its lesson's concrete step one model rung lower (N + 1).
 */
export function lessonDay(unit: SMUnit, lessonId: string, seed: number, ctx: LessonDayCtx): SMDay {
  const lesson = unit.lessons.find((l) => l.id === lessonId)
  if (!lesson) throw new Error(`${lessonId} is not a lesson of ${unit.id}`)
  const idx = lessonIndexOf(unit, lessonId)
  const attempts = ctx.attempts ?? []
  const states = ctx.states ?? skillStates(unit.skills.map((s) => s.id), attempts)
  const n = clamp(ctx.n ?? GRADE1_DAYS.lessonN, GRADE1_DAYS.lessonRange[0], GRADE1_DAYS.lessonRange[1])
  const starterCount = n >= 7 ? 2 : 1
  const exitCount = 2
  const stepCount = Math.max(1, n - starterCount - exitCount)
  const pick = streamRng(seed, `sm:lesson:${lessonId}`)
  const plans: Plan[] = []

  // starter(s): the entry-check line (L1–L2), else the previous lesson's exit template(s)
  const prev = idx >= 2 ? unit.lessons[idx - 2] : null
  const starterPool = idx <= 2 ? (ENTRY_TEMPLATES[unit.id] ?? []) : prev!.exitTemplates
  const start = pick.int(0, Math.max(0, starterPool.length - 1))
  for (let i = 0; i < starterCount && starterPool.length; i++) {
    const t = starterPool[(start + i) % starterPool.length]
    plans.push({ role: 'starter', inN: true, templateId: t, source: idx <= 2 ? 'entry-line' : 'prev-exit', freshFor: getSMTemplate(t)!.skillIds })
  }

  // the demo: the teacher's scripted screen, never an attempt, not in N
  plans.push({ role: 'demo', inN: false, source: 'demo' })

  // stall rule: one stuck skill of an earlier lesson re-opens its concrete step, one rung lower
  const stuck = unit.skills.filter((s) => states[s.id]?.state === 'stuck' && lessonIndexOf(unit, s.lessonIds[0]) < idx)
  if (stuck.length) {
    const s = stuck[0]
    const sl = unit.lessons.find((l) => l.id === s.lessonIds[0])!
    plans.push({ role: 'step', inN: true, templateId: sl.cpaSteps[0], source: `reopen:${s.id}`, reopens: s.id })
  }

  // steps: CPA order; "already knows" cuts to the built model alone
  const cpa = stepTemplates(lesson)
  const knowsAll = lesson.skills.every((sk) => states[sk]?.alreadyKnows || states[sk]?.state === 'known')
  if (knowsAll) {
    // the one step is the last CPA step that BUILDS a model (SM-H1: he builds before the abstract)
    const builds = cpa.filter((t) => buildItem(t, { seed, stream: 'probe' }).modelRung === 'build')
    const one = builds.length ? builds[builds.length - 1] : cpa[cpa.length - 1]
    plans.push({ role: 'step', inN: true, templateId: one, source: `cpa:${cpa.indexOf(one) + 1} (already knows: one step, the built model)` })
  } else {
    const more = lesson.templates.filter((t) => !cpa.includes(t) && t !== lesson.explainTemplate && getSMTemplate(t)!.uses.includes('step'))
    const order = [...cpa, ...more]
    for (let i = 0; i < stepCount; i++) plans.push({ role: 'step', inN: true, templateId: order[i % order.length], source: `cpa:${(i % order.length) + 1}` })
    if (lesson.explainTemplate) {
      plans.push({ role: 'step', inN: true, templateId: lesson.explainTemplate, options: idx === 6 ? { story: true } : undefined, source: 'explain (N + 1)' })
    }
  }

  // exits: the lesson's key point, unaided
  for (let i = 0; i < exitCount; i++) {
    plans.push({ role: 'exit', inN: true, templateId: lesson.exitTemplates[i % lesson.exitTemplates.length], source: 'exit' })
  }

  // the starter, steps and exits teach and test the idea: no part of 1 (a part of 1 is counting on
  // by one, not part-whole; teacher's read of the run-2 dump, as the checks and stories already)
  for (const p of plans) if (p.role === 'step' || p.role === 'exit' || p.role === 'starter') p.minPart = 2
  balanceMissingParts(plans, false)
  const avoid = unit.lessonExampleNumbers.filter((d) => d.lessonId === lessonId).flatMap((d) => d.facts).map(factFamily)
  const built = buildPlanned('lesson', lessonId, ctx.dayKey, seed, plans, attempts, avoid)
  const manifest: SMDayManifest = {
    unitId: unit.id, dayKind: 'lesson', lessonId, dayKey: ctx.dayKey, seed,
    n: built.slots.filter((s) => s.inN).length, slots: built.slots,
  }
  return finishDay(manifest, unit)
}

// ---------------------------------------------------------------------------
// Practice day
// ---------------------------------------------------------------------------

/** The just-taught lesson's share, in the teacher's order (cycled when N is larger). */
const JUST: Record<number, string[]> = {
  1: [T('l1.split_any'), T('l1.list_splits'), T('l1.missing_split_choice'), T('l1.split_another_way')],
  2: [T('l2.bond_from_split'), T('l2.which_bond'), T('l2.whole_part_truth')],
  3: [T('l3.join_bond'), T('l3.add_pad'), T('l3.which_sentence')],
  4: [T('l4.empty_part_bond'), T('l4.sub_pad'), T('l4.missing_part_choice'), T('l4.error_take_away'), T('l4.sign_decides')],
  5: [T('l5.box_any_place'), T('l5.missing_addend_choice'), T('l5.four_facts'), T('l5.equals_truth')],
  6: [], // stories, chosen below (one or two a day)
}
/** The lesson before's share, mixed so a day holds adds and take-aways side by side from L4 (E90). */
const PREV: Record<number, string[]> = {
  1: [],
  2: [T('l1.missing_split_choice'), T('l1.split_another_way'), T('l1.list_splits')],
  3: [T('l2.which_bond'), T('l2.bond_from_split'), T('l2.whole_part_truth')],
  4: [T('l3.add_pad'), T('l3.join_bond'), T('l3.which_sentence')],
  5: [T('l4.sign_decides'), T('l4.empty_part_bond'), T('l4.missing_part_choice'), T('l4.sub_pad')],
  6: [T('l5.box_any_place'), T('l5.missing_addend_choice'), T('l5.four_facts'), T('l5.equals_truth')],
}
/** The first practice day that may carry the U04 preview (it builds on the bonds of 10). */
export const PREVIEW_FROM_LESSON = 4

export interface PracticeDayCtx {
  dayKey: string
  /** The lesson just taught. */
  lessonId: string
  /** The attempt log before today. */
  attempts: readonly SMAttempt[]
  /** The parent's practice-day N (6–12); Grade 1 default 8. */
  n?: number
  /** A placed-out unit's skills that return to confirm (DD25). */
  confirmSkills?: string[]
}

export interface PracticeDayInfo {
  comebacks: SMComebackEntry[]
  returnSkills: string[]
  preview: { allowed: boolean; reason: string }
}

/**
 * A practice day (EXEMPLAR §3): current 5 (the lesson just taught and the one before), returns
 * 2 (due comebacks first, at most 2 a day in Grade 1, then the weakest earlier skills), and a
 * preview 0–1 ("try a new one"; at most 2 a unit, never two days running; else the slot goes
 * to current). Shares scale with the parent's N.
 */
export function practiceDay(unit: SMUnit, ctx: PracticeDayCtx, seed: number): SMDay & { info: PracticeDayInfo } {
  const idx = lessonIndexOf(unit, ctx.lessonId)
  const n = clamp(ctx.n ?? GRADE1_DAYS.practiceN, GRADE1_DAYS.practiceRange[0], GRADE1_DAYS.practiceRange[1])
  const returnSlots = n >= 10 ? 3 : 2
  const attempts = ctx.attempts
  const plans: Plan[] = []

  // returns: due comebacks first (capped), then the weakest earlier skills
  const cap = Math.min(comebackCap(unit.grade), returnSlots)
  const comebacks = dueComebacks(comebackLedger(attempts), attempts, ctx.dayKey, cap)
  for (const e of comebacks) {
    plans.push({ role: 'comeback', inN: true, templateId: e.templateId, options: e.options, source: `comeback:${e.source}`, comebackKey: e.key, freshFor: e.skillIds })
  }
  const weakest = weakestFirst(returnCandidates(unit, idx, attempts, ctx.confirmSkills), attempts, ctx.dayKey)
  const returnSkills = weakest.slice(0, returnSlots - comebacks.length)
  for (const sk of returnSkills) {
    const ts = returnTemplates(sk)
    const t = ts[streamRng(seed, `sm:return:${sk}`).int(0, ts.length - 1)]
    const options = t === T('l4.sign_decides') ? { op: sk === 'G1-U02-K5' ? '+' : '-' } : undefined
    plans.push({ role: 'return', inN: true, templateId: t, options, source: `weakest:${sk}`, freshFor: [sk] })
  }

  // preview: "try a new one"
  const pv = previewDecision(unit, attempts, ctx.dayKey)
  const preview = pv.allowed && idx >= PREVIEW_FROM_LESSON
  const previewReason = pv.allowed && !preview ? `not before the practice day after L${PREVIEW_FROM_LESSON}` : pv.reason

  // current: the lesson just taught and the one before
  const current = n - plans.length - (preview ? 1 : 0)
  // structure turns with the day, not the day's seed (Fable gate D9: a constant seed pinned the
  // same box place, sign and story kind every day): the turn is the number of practice days he
  // has already had, offset by his first day in the log, whatever seed each day is given
  const turn = structureTurn(attempts, ctx.dayKey)
  const justList = idx === 6 ? storyShare(attempts, turn) : JUST[idx]
  const prevList = PREV[idx]
  const justCount = idx === 1 ? current : idx === 6 ? Math.min(justList.length, current) : Math.ceil(current / 2)
  const cur: Plan[] = []
  for (let i = 0; i < justCount; i++) cur.push({ role: 'practice', inN: true, templateId: justList[i % justList.length], source: `current:L${idx}` })
  for (let i = 0; cur.length < current; i++) cur.push({ role: 'practice', inN: true, templateId: prevList[i % prevList.length], source: `current:L${idx - 1}` })
  // structure options: + and − alternate on the sign item and from day to day; the box's place
  // turns through all four (the start, □ − p = k, included) over four practice days
  const signFirst = turn % 2 === 0 ? '-' : '+'
  let signs = 0, boxes = 0
  for (const p of cur) {
    if (p.templateId === T('l4.sign_decides')) p.options = { op: signs++ % 2 === 0 ? signFirst : (signFirst === '+' ? '-' : '+') }
    if (p.templateId === T('l5.box_any_place')) {
      p.options = { place: BOX_TURN[(turn + boxes) % BOX_TURN.length] }
      boxes++
    }
    if (p.templateId === T('l6.which_bond_story')) p.options = { kind: turn % 2 === 0 ? 'takeaway' : 'join' }
  }
  // the day's order: the first half of the current items (fresh in memory), then the
  // comebacks and returns, then the rest of the current items, the preview last
  const ordered: Plan[] = [...cur.slice(0, Math.ceil(cur.length / 2)), ...plans, ...cur.slice(Math.ceil(cur.length / 2))]
  if (preview) ordered.push({ role: 'preview', inN: true, templateId: pv.templateId!, source: 'preview' })

  balanceMissingParts(ordered, idx >= 4)
  const built = buildPlanned('practice', ctx.lessonId, ctx.dayKey, seed, ordered, attempts, [])
  const manifest: SMDayManifest = {
    unitId: unit.id, dayKind: 'practice', lessonId: ctx.lessonId, dayKey: ctx.dayKey, seed,
    n: built.slots.filter((s) => s.inN).length, slots: built.slots,
  }
  return { ...finishDay(manifest, unit), info: { comebacks, returnSkills, preview: { allowed: preview, reason: previewReason } } }
}

/** The box's places in turn: the start first, then a part in each place. */
export const BOX_TURN = ['4', '1', '2', '3'] as const

/** The day's structure turn: practice days before today + an offset from his first logged day. */
export function structureTurn(attempts: readonly SMAttempt[], dayKey: string): number {
  const first = attempts.reduce<string | null>((m, a) => (m === null || a.localDay < m ? a.localDay : m), null)
  const offset = first ? first.split('').reduce((t, c) => t + (c >= '0' && c <= '9' ? Number(c) : 0), 0) : 0
  return offset + practiceDaysBefore(attempts, dayKey)
}

/** Practice days he has had before this day (distinct local days). */
export function practiceDaysBefore(attempts: readonly SMAttempt[], dayKey: string): number {
  return new Set(attempts.filter((a) => a.dayKind === 'practice' && a.localDay < dayKey).map((a) => a.localDay)).size
}

/** L6's share: one join or take-away story (turning day to day), and the paper bond once in the unit (else "which bond"). */
function storyShare(attempts: readonly SMAttempt[], turn: number): string[] {
  const story = turn % 2 === 0 ? T('l6.join_story') : T('l6.takeaway_story')
  const paperDone = attempts.some((a) => a.templateId === T('l6.paper_bond'))
  return [story, paperDone ? T('l6.which_bond_story') : T('l6.paper_bond')]
}

// ===========================================================================
// Wrong-work review (BUILD-PLAN §13)
// ===========================================================================

/** A deterministic fresh seed for an item's fix-it twin (stable across reloads). */
export function fixSeed(item: SMItem): number {
  let h = 2166136261
  for (let i = 0; i < item.id.length; i++) h = Math.imul(h ^ item.id.charCodeAt(i), 16777619) >>> 0
  return (h ^ 0x9e3779b1) >>> 0
}

export type FixIt =
  | { kind: 'twin'; item: SMItem; /** set when its fact family repeats one on the day (no other draw) */ note?: string }
  | { kind: 'explain-back'; item: SMItem }
  | { kind: 'none'; reason: string }

/**
 * W1: after a rung-4 item (the answer shown), the next screen. A same-template twin at a
 * fresh seed; where the template cannot make one, an explain-back (tap the true rows about
 * the bond just shown: `l2.whole_part_truth` on the item's own fact); else none, with why.
 * Role `review`, id `-FX-`, never in N, never "knows" evidence.
 */
export function fixItAfterShown(item: SMItem, dayItems: readonly SMItem[] = []): FixIt {
  try {
    const tw = fixItTwinAvoiding(item, fixSeed(item), dayItems)
    return tw.familyRepeats ? { kind: 'twin', item: tw.item, note: 'its fact family repeats one on the day: the only fresh draw' } : { kind: 'twin', item: tw.item }
  } catch (e) {
    const f = item.fact
    if (f && f.parts[0] !== f.parts[1] && f.whole >= 4) {
      const it = buildItem(T('l2.whole_part_truth'), { seed: fixSeed(item), role: 'review', stream: `FX-EB:${item.id}`, force: { w: f.whole, a: f.parts[0] } })
      return { kind: 'explain-back', item: it }
    }
    return { kind: 'none', reason: `${(e as Error).message}; no bond fact with two different parts for an explain-back` }
  }
}

/** The day's queue with the fix-it screen placed straight after the shown item (W1). */
export function queueAfterShown(queue: readonly SMItem[], index: number): { queue: SMItem[]; fix: FixIt } {
  const fix = fixItAfterShown(queue[index], queue)
  const out = [...queue]
  if (fix.kind !== 'none') out.splice(index + 1, 0, fix.item)
  return { queue: out, fix }
}

/** Items counted in N: every role but `review` (the fix-it twin, look again). */
export function countsInN(item: SMItem): boolean {
  return item.role !== 'review'
}

export interface LookAgainItem {
  item: SMItem
  /** The child's own first answer, shown beside the question; null when the item is a fresh twin. */
  ownAnswer: string | null
  /** The ladder starts at rung 1. */
  startRung: 1
  fromItemId: string
  /** True when the answer had been shown (rung 4): a fresh-number twin is served instead (W5). */
  twin: boolean
  /** The read-aloud opening line (number-free; never the key). */
  line: string
}

/** The check runner's spoken lines (feedback held, DD11) and the review's opening line (W4). Number-free. */
export const CHECK_SCREEN_LINES = ['Do each one as well as you can.', 'We will look at them together after.'] as const
export const REVIEW_OPENING_LINE = 'Let us go over this one together.'
export const LOOK_AGAIN_LINE = 'Let us look at this one again.'
export const LOOK_AGAIN_OWN_LINE = 'Here is what you wrote.'
const LOOK_AGAIN_ROLES: readonly SMRole[] = ['practice', 'return', 'comeback']

/** Re-label a review item `-LA-` (look again). */
function asLookAgain(item: SMItem, id: string): SMItem {
  return { ...item, role: 'review', id: `${id.replace(/-FX-$/, '')}-LA-` }
}

/**
 * W2 "look again", at the end of a PRACTICE day only: up to `cap` (2 in Grade 1) of the
 * day's first-try misses, one at a time, in the day's order (a miss whose W1 fix-it twin he
 * answered right first try is skipped: it has had its second look) — the same question with his
 * own answer shown, the ladder from rung 1. Never an item he answered right first try. An
 * item whose answer was shown (rung 4) comes back as a fresh-number twin (W5). Nothing when
 * he takes the rest. Role `review`, id `-LA-`, never in N; the day's score never changes.
 */
export function lookAgain(
  dayItems: readonly SMItem[], attempts: readonly SMAttempt[], cap: number,
  opts: { dayKind: SMDayKind; tookRest?: boolean },
): LookAgainItem[] {
  if (opts.tookRest || opts.dayKind !== 'practice') return []
  const out: LookAgainItem[] = []
  for (const it of dayItems) {
    if (out.length >= cap) break
    if (!LOOK_AGAIN_ROLES.includes(it.role)) continue
    const a = attempts.find((x) => x.itemId === it.id && x.role === it.role)
    if (!a || a.firstTryCorrect) continue
    // teacher decision (main session's read of the run-2 dump): a miss whose W1 fix-it twin he
    // then answered right first try has had its second look; look again moves on
    if (fixItAttempt(it, attempts, a.localDay)?.firstTryCorrect) continue
    if (a.ladderRung >= 4) {
      const tw = fixItTwinAvoiding(it, (fixSeed(it) ^ 0x51ed) >>> 0, dayItems).item
      out.push({ item: asLookAgain(tw, tw.id), ownAnswer: null, startRung: 1, fromItemId: it.id, twin: true, line: LOOK_AGAIN_LINE })
    } else {
      out.push({ item: asLookAgain(it, it.id), ownAnswer: a.answers[0] ?? null, startRung: 1, fromItemId: it.id, twin: false, line: `${LOOK_AGAIN_LINE} ${LOOK_AGAIN_OWN_LINE}` })
    }
  }
  return out
}

/** The answer to an item's W1 fix-it twin on that day (its id carries `FX:<the item's stream>` and `-FX-`), if any. */
export function fixItAttempt(item: SMItem, attempts: readonly SMAttempt[], localDay: string): SMAttempt | undefined {
  const mark = `/FX:${item.generator.stream}#`
  return attempts.find((x) => x.role === 'review' && x.localDay === localDay && x.templateId === item.templateId
    && x.itemId.endsWith('-FX-') && x.itemId.includes(mark) && x.itemId.startsWith(`${item.templateId}@`))
}

/** The day's score: first-try right among the items in N. Review answers never count. */
export function dayScore(dayItems: readonly SMItem[], attempts: readonly SMAttempt[]): { right: number; of: number } {
  const inN = dayItems.filter(countsInN)
  let right = 0
  for (const it of inN) {
    const a = attempts.find((x) => x.itemId === it.id && x.role !== 'review')
    if (a?.firstTryCorrect) right++
  }
  return { right, of: inN.length }
}

/** An attempt row for an item (the day flow's record; tests build fixtures with it). */
export function attemptFrom(
  item: SMItem,
  at: { dayKind: SMDayKind; localDay: string; createdAt: string; comebackKey?: string },
  outcome: { firstTryCorrect: boolean; answers?: string[]; tries?: number; firstTryMs?: number; scaffoldVisible?: boolean; ladderRung?: 0 | 1 | 2 | 3 | 4 },
): SMAttempt {
  const a: SMAttempt = {
    itemId: item.id, templateId: item.templateId, unitId: item.unitId, lessonId: item.lessonId, role: item.role,
    skillIds: item.skillIds, firstTryCorrect: outcome.firstTryCorrect, tries: outcome.tries ?? 1,
    answers: outcome.answers ?? [], firstTryMs: outcome.firstTryMs ?? 8000, scaffoldVisible: outcome.scaffoldVisible ?? false,
    ladderRung: outcome.ladderRung ?? 0, dayKind: at.dayKind, localDay: at.localDay, createdAt: at.createdAt,
    signature: operandSignature(item),
  }
  if (item.generator.options) a.options = item.generator.options
  if (at.comebackKey) a.comebackKey = at.comebackKey
  return a
}
