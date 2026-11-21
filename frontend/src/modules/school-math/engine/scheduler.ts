/**
 * The scheduler: comebacks (W3), returns by weakness (DD10), previews (DD24).
 * ENGINE-SPEC §4.4–§4.5; EXEMPLAR-G1-U02 §3; BUILD-PLAN §13.
 *
 * COMEBACKS are ported from Best Brains `session/comebacks.ts` onto SM attempts:
 *   - sources: every CHECK miss, and every PRACTICE-DAY first-try miss whose ladder reached
 *     rung 3 or 4 (W3; a miss fixed at rung 1–2 was a slip he repaired, not a gap);
 *   - a `review` answer is never a miss source and never clean;
 *   - due 2, 7, 21 local days after the last event (the miss, then each clean answer),
 *     counted on the attempt's LOCAL day key, never the UTC date;
 *   - clean = a comeback answered right on the first try, unaided (no rung, no scaffold);
 *     two clean on one day are one day's evidence; settled after three clean in a row;
 *     a miss sends it back to the 2-day step;
 *   - check misses are served before practice misses; at most 2 a day in Grade 1, 3 from
 *     Grade 2 (`comebackCap`).
 * The ledger is derived from the log (no table of its own here; `sm_comebacks` is its stage-5
 * projection, and the DB's `source = 'practice'` check is a stage-5 migration).
 *
 * RETURNS and COMEBACKS are fresh draws (W5): the surface signature differs from every item
 * of that skill the child saw in the last 21 days.
 */

import type { SMAttempt, SMItem, SMRole, SMUnit } from '../types'
import { allSMTemplates, buildItem, getSMTemplate } from './registry'
import { operandSignature } from './validator'
import { inLogOrder, skillStatus, type SkillStatus } from './mastery'
import { GRADE1_UNITS } from '../curriculum/grade1'

// ---------------------------------------------------------------------------
// Local days (ported from best-brains/session/comebacks.ts `localDay` / `addDays`)
// ---------------------------------------------------------------------------

const pad2 = (n: number) => String(n).padStart(2, '0')

/** The LOCAL calendar day of an instant (the device's clock), YYYY-MM-DD. */
export function localDayKey(at: string | Date): string {
  const d = typeof at === 'string' ? new Date(at) : at
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return localDayKey(new Date(y, m - 1, d + n, 12))
}

/** Whole days from `a` to `b` (local day keys). */
export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split('-').map(Number)
  const [y2, m2, d2] = b.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

// ---------------------------------------------------------------------------
// Comebacks
// ---------------------------------------------------------------------------

export const COMEBACK_STEPS_DAYS = [2, 7, 21] as const
export const FRESH_WINDOW_DAYS = 21

/** Comebacks a day may hold: 2 in Grade 1 (EXEMPLAR §3), 3 from Grade 2 (ENGINE §4.4). */
export function comebackCap(grade: number): number {
  return grade <= 1 ? 2 : 3
}

export interface SMComebackEntry {
  /** Item family: the template and its structural options (not the blind-habit `asked`). */
  key: string
  templateId: string
  unitId: string
  skillIds: string[]
  options?: Record<string, unknown>
  source: 'check' | 'practice'
  originItemId: string
  missedDay: string
  rounds: number
  /** Clean comebacks in a row (0..3). */
  step: number
  lastDay: string
  settled: boolean
  dueOn: string | null
}

const STRUCTURAL = ['place', 'kind', 'op', 'story', 'dir', 'rule']

export function structuralOptions(options: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!options) return undefined
  const out: Record<string, unknown> = {}
  for (const k of STRUCTURAL) if (options[k] !== undefined) out[k] = options[k]
  return Object.keys(out).length ? out : undefined
}

export function familyKey(templateId: string, options?: Record<string, unknown>): string {
  const s = structuralOptions(options)
  return s ? `${templateId}|${JSON.stringify(s)}` : templateId
}

/** W3: which first-try misses become comebacks. */
export function missSource(a: SMAttempt): 'check' | 'practice' | null {
  if (a.role === 'review' || a.firstTryCorrect) return null
  if (a.role === 'check') return 'check'
  if (a.dayKind === 'practice' && (a.role === 'practice' || a.role === 'return') && a.ladderRung >= 3) return 'practice'
  return null
}

/** Clean = a comeback right on the first try, unaided; never a review answer. */
export function isClean(a: SMAttempt): boolean {
  return a.role === 'comeback' && a.firstTryCorrect && a.ladderRung === 0 && !a.scaffoldVisible
}

export function comebackLedger(attempts: readonly SMAttempt[]): SMComebackEntry[] {
  const byKey = new Map<string, SMComebackEntry>()
  const lastCleanDay = new Map<string, string>()
  for (const a of inLogOrder(attempts)) {
    const src = missSource(a)
    if (src) {
      const key = familyKey(a.templateId, a.options)
      const prev = byKey.get(key)
      byKey.set(key, {
        key, templateId: a.templateId, unitId: a.unitId, skillIds: a.skillIds,
        options: structuralOptions(a.options),
        source: prev?.source === 'check' || src === 'check' ? 'check' : 'practice',
        originItemId: a.itemId, missedDay: a.localDay, rounds: prev?.rounds ?? 0,
        step: 0, lastDay: a.localDay, settled: false, dueOn: null,
      })
      lastCleanDay.delete(key)
      continue
    }
    if (a.role !== 'comeback' || !a.comebackKey) continue
    const e = byKey.get(a.comebackKey)
    if (!e || e.settled) continue
    e.rounds += 1
    e.lastDay = a.localDay
    if (!isClean(a)) {
      e.step = 0
      lastCleanDay.delete(e.key)
    } else if (lastCleanDay.get(e.key) !== a.localDay) {
      e.step += 1
      lastCleanDay.set(e.key, a.localDay)
    }
    e.settled = e.step >= COMEBACK_STEPS_DAYS.length
  }
  return [...byKey.values()].map((e) => ({ ...e, dueOn: e.settled ? null : addDays(e.lastDay, COMEBACK_STEPS_DAYS[e.step]) }))
}

/** Serving order: check misses first; then under-way ones (most overdue first); then newest miss first. */
export function comebackOrder(a: SMComebackEntry, b: SMComebackEntry): number {
  const src = Number(b.source === 'check') - Number(a.source === 'check')
  if (src !== 0) return src
  const started = Number(b.rounds > 0) - Number(a.rounds > 0)
  if (started !== 0) return started
  return a.rounds > 0 ? (a.dueOn ?? '').localeCompare(b.dueOn ?? '') : b.missedDay.localeCompare(a.missedDay) || a.key.localeCompare(b.key)
}

/** Today's comebacks: due, not yet served today, at most `cap` counting any served today. */
export function dueComebacks(ledger: readonly SMComebackEntry[], attempts: readonly SMAttempt[], today: string, cap: number): SMComebackEntry[] {
  const servedToday = new Set(attempts.filter((a) => a.role === 'comeback' && a.localDay === today && a.comebackKey).map((a) => a.comebackKey as string))
  const room = Math.max(0, cap - servedToday.size)
  const due = ledger.filter((e) => !e.settled && e.dueOn !== null && e.dueOn <= today && !servedToday.has(e.key))
  return [...due].sort(comebackOrder).slice(0, room)
}

/** Signatures of every item of these skills the child met in the last 21 days (W5). */
export function seenSignatures(attempts: readonly SMAttempt[], skillIds: readonly string[], today: string): Set<string> {
  return new Set(attempts
    .filter((a) => a.skillIds.some((s) => skillIds.includes(s)) && daysBetween(a.localDay, today) <= FRESH_WINDOW_DAYS && daysBetween(a.localDay, today) >= 0)
    .map((a) => a.signature))
}

/** new · older (no fresh draw: met in the last 21 days, BB's ComebackKind) · family (fresh, but its fact family is already on today's list). */
export type FreshKind = 'new' | 'older' | 'family'

/**
 * A fresh draw of a template: its signature differs from every one in `seen` and `taken`
 * (and its fact family from `families`, when given). After `tries` new draws fail, an
 * `older` one (not in `taken`, not the most recent seen) is accepted and marked.
 */
export function freshDraw(
  templateId: string, args: { seed: number; role: SMRole; stream: string; options?: Record<string, unknown>; minPart?: number },
  seen: Set<string>, taken: Set<string>, families?: Set<string>, tries = 64, accept: (item: SMItem) => boolean = () => true,
): { item: SMItem; stream: string; kind: FreshKind } {
  // fallbacks, best first: a fact family new to today but met in the last 21 days ("older");
  // then, only if nothing else exists, a family already on today's list
  let olderDraw: { item: SMItem; stream: string } | null = null
  let familyDraw: { item: SMItem; stream: string } | null = null
  let lastDraw: { item: SMItem; stream: string } | null = null
  for (let t = 0; t < tries; t++) {
    const stream = `${args.stream}#${t}`
    const item = buildItem(templateId, { seed: args.seed, role: args.role, stream, options: args.options, minPart: args.minPart })
    const sig = operandSignature(item)
    if (taken.has(sig) || !accept(item)) continue
    const fam = item.fact ? factFamily(item.fact) : null
    const famClash = !!(families && fam && families.has(fam))
    const stale = seen.has(sig)
    if (famClash && !stale) { if (!familyDraw) familyDraw = { item, stream }; continue }
    if (stale && !famClash) { if (!olderDraw) olderDraw = { item, stream }; continue }
    if (stale && famClash) { if (!lastDraw) lastDraw = { item, stream }; continue }
    return { item, stream, kind: 'new' }
  }
  // W5 (fresh numbers on every second look) outranks the day's one-family-once rule
  if (familyDraw) return { ...familyDraw, kind: 'family' }
  if (olderDraw) return { ...olderDraw, kind: 'older' }
  if (lastDraw) return { ...lastDraw, kind: 'older' }
  throw new Error(`${templateId}: no draw outside today's items in ${tries} tries`)
}

export function factFamily(f: { whole: number; parts: [number, number] }): string {
  return `${f.whole}:${[...f.parts].sort((a, b) => a - b).join(',')}`
}

// ---------------------------------------------------------------------------
// Weakness (ENGINE §4.5): one rank tuple, compared key by key; smaller = weaker
// ---------------------------------------------------------------------------

/**
 * The seven keys, in order (each oriented so that a SMALLER value is WEAKER):
 *   1 state: stuck 0 · learning with a miss in its last 3 served days 1 · little evidence
 *     (fewer than two served days) 2 · learning 3 · known with a return miss (moved back) 4 ·
 *     known 5 · parked 6 · not started 7
 *   2 −(first-try misses over its last 3 served days)
 *   3 −(highest ladder rung used on its last 3 items)
 *   4 −(scaffold visible on a first try in its last 3 items: 1 / 0)
 *   5 −(slow: first-try right but over its fluency time, count in its last 3 items)
 *   6 −(days since last served)
 *   7 curriculum order (earlier lesson first)
 * Counts only; never a percentage (TAD §3.14).
 */
export type WeaknessTuple = [number, number, number, number, number, number, number]
export const WEAKNESS_KEYS = ['state', 'misses', 'rung', 'scaffold', 'slow', 'days-since', 'curriculum-order'] as const

const SKILL_ORDER: string[] = GRADE1_UNITS.flatMap((u) => u.skills.map((s) => s.id))

export function curriculumOrder(skillId: string): number {
  const i = SKILL_ORDER.indexOf(skillId)
  return i < 0 ? SKILL_ORDER.length : i
}

export function stateRank(st: SkillStatus, missInLast3: boolean): number {
  if (st.state === 'stuck') return 0
  // "known with a return miss (moved back)" is its own rung of the list, below plain
  // learning: it is read before the recent-miss rung, because the return miss that moved
  // it back is always recent (reading in STAGE1-RUN2-NOTES).
  if (st.state === 'learning' && st.movedBack) return 4
  if (st.state === 'learning' && missInLast3) return 1
  if (st.state !== 'not-started' && st.servedDays.length < 2) return 2
  if (st.state === 'learning') return 3
  if (st.state === 'known') return 5
  if (st.state === 'parked') return 6
  return 7
}

export function weakness(skillId: string, attempts: readonly SMAttempt[], today: string): WeaknessTuple {
  const st = skillStatus(skillId, attempts)
  const mine = inLogOrder(attempts).filter((a) => a.skillIds.includes(skillId) && a.role !== 'review' && a.role !== 'preview' && a.role !== 'placement')
  const last3Days = st.servedDays.slice(-3)
  const inLast3Days = mine.filter((a) => last3Days.includes(a.localDay))
  const misses = inLast3Days.filter((a) => !a.firstTryCorrect).length
  const last3Items = mine.slice(-3)
  const rung = last3Items.reduce((m, a) => Math.max(m, a.ladderRung), 0)
  const scaffold = last3Items.some((a) => a.scaffoldVisible) ? 1 : 0
  const slow = st.fluencyMs === null ? 0 : last3Items.filter((a) => a.firstTryCorrect && a.firstTryMs > (st.fluencyMs as number)).length
  const since = st.lastServedDay ? daysBetween(st.lastServedDay, today) : 0
  return [stateRank(st, misses > 0), -misses, -rung, -scaffold, -slow, -since, curriculumOrder(skillId)]
}

export function compareWeakness(a: WeaknessTuple, b: WeaknessTuple): number {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]
  return 0
}

/** Skills sorted weakest first. */
export function weakestFirst(skillIds: readonly string[], attempts: readonly SMAttempt[], today: string,
  weak: (s: string, a: readonly SMAttempt[], t: string) => WeaknessTuple = weakness): string[] {
  const t = new Map(skillIds.map((s) => [s, weak(s, attempts, today)]))
  return [...skillIds].sort((x, y) => compareWeakness(t.get(x)!, t.get(y)!))
}

// ---------------------------------------------------------------------------
// Returns
// ---------------------------------------------------------------------------

/** Templates a skill can return on: served as `return`, and the skill is one they earn. */
export function returnTemplates(skillId: string): string[] {
  return allSMTemplates().filter((d) => d.uses.includes('return') && d.skillIds.includes(skillId)).map((d) => d.id)
}

/**
 * Skills that may return on a practice day of `unit` after `lessonIndex` (1-based): the
 * skills of this unit's lessons before the current share (the lesson just taught and the
 * one before) and every earlier unit's skills, that have a return template and have been
 * served (or are a placed-out unit's confirm returns).
 */
export function returnCandidates(unit: SMUnit, lessonIndex: number, attempts: readonly SMAttempt[], confirmSkills: readonly string[] = []): string[] {
  const idx = (lessonId: string) => unit.lessons.findIndex((l) => l.id === lessonId) + 1
  const earlierUnits = GRADE1_UNITS.filter((u) => u.grade === unit.grade && u.id < unit.id)
  const earlierInUnit = unit.skills.filter((s) => s.lessonIds.every((l) => idx(l) >= 1 && idx(l) < lessonIndex - 1))
  return [...earlierUnits.flatMap((u) => u.skills), ...earlierInUnit]
    .filter((s) => returnTemplates(s.id).length > 0)
    .filter((s) => confirmSkills.includes(s.id) || skillStatus(s.id, attempts).state !== 'not-started')
    .map((s) => s.id)
}

// ---------------------------------------------------------------------------
// Previews (DD24): at most 2 a unit, never two days running
// ---------------------------------------------------------------------------

export const PREVIEW_PER_UNIT = 2

export const UNIT_PREVIEWS: Record<string, string> = {
  'G1-U02': 'sm.preview.g1u04.ten_and_some',
}

export function previewDecision(unit: SMUnit, attempts: readonly SMAttempt[], today: string): { allowed: boolean; templateId: string | null; reason: string } {
  const templateId = UNIT_PREVIEWS[unit.id] ?? null
  if (!templateId || !getSMTemplate(templateId)) return { allowed: false, templateId: null, reason: 'no preview for this unit' }
  const days = [...new Set(attempts.filter((a) => a.role === 'preview' && a.templateId === templateId).map((a) => a.localDay))].sort()
  if (days.length >= PREVIEW_PER_UNIT) return { allowed: false, templateId, reason: `cap reached (${days.length} of ${PREVIEW_PER_UNIT})` }
  const earlier = [...new Set(attempts.map((a) => a.localDay))].filter((d) => d < today).sort()
  const previousDay = earlier[earlier.length - 1]
  if (previousDay && days.includes(previousDay)) return { allowed: false, templateId, reason: 'a preview was served on the previous day' }
  if (days.includes(today)) return { allowed: false, templateId, reason: 'already served today' }
  return { allowed: true, templateId, reason: `preview ${days.length + 1} of ${PREVIEW_PER_UNIT}` }
}
