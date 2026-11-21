/**
 * sm-day-assembly-test — the lesson day, the practice day and the wrong-work review
 * (EXEMPLAR-G1-U02 §3; BUILD-PLAN §13 W1–W3; ENGINE-SPEC §4.3–§4.4).
 *
 * Run (from frontend/): npx tsx scripts/sm-day-assembly-test.ts
 *
 * Real content: lesson days L1–L6 at 200 seeds; whole simulated units (sm-lib-sim) at 60
 * seeds, each with 8 practice days after the check so 2 / 7 / 21-day comebacks come due.
 * Each rule is a CHECKER applied to the real days and then to a broken fixture, which must
 * fire (a checker whose control does not fire is unproven = FAIL):
 *   lesson   N (5; 6 on L4 and L6), one demo slot not in N and never an item, starter source
 *            (entry line on L1–L2, the previous lesson's exit from L3), steps in CPA order
 *            (L4 step 2 = l4.empty_part_bond), the explain step on L4 / L6 (story form on L6),
 *            the two exits, roles, no demo fact, no repeated operand tuple or fact family
 *   practice N 8; current / returns / preview shares 5 / 2 / ≤ 1; comebacks ≤ 2 (Grade 1);
 *            current from the lesson just taught and the one before; adds and take-aways side
 *            by side from L4; the unknown at the start, a part and the result from L5; one or
 *            two stories from L6; no lesson-only template; previews ≤ 2 a unit, never two
 *            days running
 *   freeze   the same inputs give a byte-identical manifest and hash; items rebuild from it
 *   W1       a fix-it twin follows a rung-4 item, role review, id -FX-, not in N
 *   W2       look again: practice days only, ≤ 2, first-try misses only, his answer shown, a
 *            rung-4 miss as a fresh twin, [] after "take the rest"; the day's score unchanged
 *   W3       practice misses become comebacks only at rung 3 or 4; a review answer is never
 *            clean and never a miss
 * Controls: a G1 day with 3 comebacks · a preview two days running · a look-again that
 * re-serves an item answered right · a comeback ledger that counts a review answer as clean ·
 * a rung-2 practice miss scheduled as a comeback · a lesson-only template on a practice day ·
 * a fix-it twin counted in N · a lesson day with no demo · a manifest that does not rebuild.
 */
import { G1_U02, demoFacts } from '../src/modules/school-math/curriculum/grade1'
import {
  attemptFrom, countsInN, dayManifestHash, dayScore, fixItAfterShown, fixItAttempt, fixItTwin, fixSeed, itemsFromManifest, lessonDay, lookAgain,
  practiceDay, queueAfterShown, recentServed, LOOK_AGAIN_LINE,
} from '../src/modules/school-math/engine/assemble'
import { comebackLedger, daysBetween, factFamily, seenSignatures } from '../src/modules/school-math/engine/scheduler'
import { allSMTemplates, buildItem, getSMTemplate } from '../src/modules/school-math/engine/registry'
import { askedNumbers, operandSignature, validateItem } from '../src/modules/school-math/engine/validator'
import { sameFact } from '../src/modules/school-math/engine/lib/item'
import type { SMAttempt, SMDay, SMItem, SMUnit } from '../src/modules/school-math/types'
import { simulateUnit, instantOn } from './sm-lib-sim'

const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
const SIM_SEEDS = SEEDS.slice(0, 60)
let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const control = (fired: boolean, msg: string) => say(fired, `control fired: ${msg}`)
const T = (s: string) => `sm.g1u02.${s}`
const clone = <X>(x: X): X => JSON.parse(JSON.stringify(x))
const unit: SMUnit = G1_U02

const ENTRY = ['sm.g1u01.l1.count_set', 'sm.g1u01.l4.one_more_less', 'sm.g1u01.l3.match_more']

// ---------------------------------------------------------------------------
// checkers
// ---------------------------------------------------------------------------

/** One day's items: valid, no repeated operand tuple, no fact family twice (unless the slot says it was the only fresh draw, W5 first). */
function dayHygiene(items: SMItem[], sources: string[] = []): string[] {
  const out: string[] = []
  const sigs = new Set<string>()
  const fams = new Set<string>()
  for (const [i, it] of items.entries()) {
    const v = validateItem(it)
    if (v.length) out.push(`${it.templateId} invalid: [${v[0].gate}] ${v[0].message}`)
    const sig = operandSignature(it)
    if (sigs.has(sig)) out.push(`operand tuple ${sig} twice in one day`)
    sigs.add(sig)
    if (it.fact) {
      const f = factFamily(it.fact)
      if (fams.has(f) && !/only fresh draw|older:/.test(sources[i] ?? '')) out.push(`fact family ${f} twice in one day (one answer gives another)`)
      fams.add(f)
    }
  }
  return out
}

export function checkLessonDay(day: SMDay, lessonIndex: number): string[] {
  const lesson = unit.lessons[lessonIndex - 1]
  const out: string[] = []
  const m = day.manifest
  const slots = m.slots
  const demo = slots.filter((s) => s.role === 'demo')
  if (demo.length !== 1) out.push(`${demo.length} demo slots (one expected)`)
  if (demo.some((s) => s.inN || s.templateId || day.items[s.index] !== null)) out.push('the demo is counted in N or carries an item')
  if (!day.demo || day.demo.lessonId !== lesson.id) out.push('the day carries no demo for its lesson')
  const explainDay = !!lesson.explainTemplate
  const wantN = 5 + (explainDay ? 1 : 0)
  if (m.n !== wantN) out.push(`N ${m.n}, expected ${wantN}`)
  if (m.n !== slots.filter((s) => s.inN).length) out.push('manifest N disagrees with its slots')
  const starters = slots.filter((s) => s.role === 'starter')
  if (starters.length !== 1) out.push(`${starters.length} starters`)
  for (const s of starters) {
    if (lessonIndex <= 2 && !ENTRY.includes(s.templateId!)) out.push(`L${lessonIndex} starter ${s.templateId} is not from the entry-check line`)
    if (lessonIndex >= 3 && !unit.lessons[lessonIndex - 2].exitTemplates.includes(s.templateId!)) out.push(`L${lessonIndex} starter ${s.templateId} is not the previous lesson's exit`)
  }
  const steps = slots.filter((s) => s.role === 'step')
  const cpa = lesson.cpaSteps.filter((t) => t !== lesson.explainTemplate)
  const stepIds = steps.map((s) => s.templateId)
  const want = [...cpa.slice(0, 2), ...(explainDay ? [lesson.explainTemplate] : [])]
  if (JSON.stringify(stepIds) !== JSON.stringify(want)) out.push(`steps ${stepIds.join(', ')} ≠ CPA order ${want.join(', ')}`)
  if (lessonIndex === 4 && stepIds[1] !== T('l4.empty_part_bond')) out.push('L4 step 2 is not l4.empty_part_bond')
  if (lessonIndex === 6) {
    const ex = steps.find((s) => s.templateId === T('l4.error_take_away'))
    if (!ex || ex.options?.story !== true) out.push('L6 explain is not the story form')
  }
  const exits = slots.filter((s) => s.role === 'exit')
  if (exits.length !== 2 || exits.some((s) => !lesson.exitTemplates.includes(s.templateId!))) out.push(`exits ${exits.map((s) => s.templateId).join(', ')} are not the lesson's`)
  const order = slots.map((s) => s.role)
  if (order.indexOf('demo') > order.indexOf('step') || order.lastIndexOf('step') > order.indexOf('exit')) out.push(`slot order ${order.join(' > ')}`)
  const items = day.items.filter((x): x is SMItem => x !== null)
  items.forEach((it, i) => { if (it.role !== slots.filter((s) => s.role !== 'demo')[i].role) out.push(`item ${it.id} role ≠ slot role`) })
  const lessonDemo = unit.lessonExampleNumbers.filter((d) => d.lessonId === lesson.id).flatMap((d) => d.facts)
  for (const it of items) if (it.fact && lessonDemo.some((f) => sameFact(f, it.fact!))) out.push(`${it.templateId} uses the lesson's demo fact`)
  return [...out, ...dayHygiene(items, slots.filter((s) => s.role !== 'demo').map((s) => s.source))]
}

const LESSON_OF = (t: string) => getSMTemplate(t)!.lessonId
const ADD = new Set([T('l3.join_bond'), T('l3.add_pad'), T('l5.missing_addend_choice'), T('l6.join_story'), T('l6.paper_bond')])
const TAKE = new Set([T('l4.empty_part_bond'), T('l4.sub_pad'), T('l4.missing_part_choice'), T('l4.error_take_away'), T('l6.takeaway_story')])
const BOTH = new Set([T('l5.four_facts'), T('l5.equals_truth')])
const STORIES = new Set([T('l6.join_story'), T('l6.takeaway_story'), T('l6.which_bond_story'), T('l6.paper_bond')])

function opOf(it: SMItem): 'add' | 'take' | 'both' | null {
  if (BOTH.has(it.templateId)) return 'both'
  if (ADD.has(it.templateId)) return 'add'
  if (TAKE.has(it.templateId)) return 'take'
  if (it.templateId === T('l4.sign_decides')) return it.generator.params.op === '+' ? 'add' : 'take'
  if (it.templateId === T('l5.box_any_place')) return ['1', '2'].includes(String(it.generator.params.place)) ? 'add' : 'take'
  return null
}

/** Where the unknown sits: the result, a part, or the start (□ − p = k). */
function unknownAt(it: SMItem): Set<string> {
  const t = it.templateId
  const s = new Set<string>()
  if ([T('l3.add_pad'), T('l3.join_bond'), T('l4.sub_pad'), T('l4.sign_decides'), T('l6.join_story'), T('l6.takeaway_story')].includes(t)) s.add('result')
  if ([T('l4.empty_part_bond'), T('l4.missing_part_choice'), T('l5.missing_addend_choice')].includes(t)) s.add('part')
  if (t === T('l5.four_facts')) { s.add('result'); s.add('part') }
  if (t === T('l5.box_any_place')) s.add(it.generator.params.place === '4' ? 'start' : 'part')
  return s
}

export function checkPracticeDay(day: SMDay, lessonIndex: number, cap = 2): string[] {
  const out: string[] = []
  const slots = day.manifest.slots
  const items = day.items.filter((x): x is SMItem => x !== null)
  if (day.manifest.n !== 8) out.push(`N ${day.manifest.n}, expected 8`)
  if (slots.some((s) => s.role === 'demo')) out.push('a practice day has a demo slot')
  const count = (r: string) => slots.filter((s) => s.role === r).length
  const comebacks = count('comeback'), returns = count('return'), preview = count('preview'), current = count('practice')
  if (comebacks > cap) out.push(`${comebacks} comebacks (cap ${cap} in Grade 1)`)
  if (comebacks + returns > 2) out.push(`${comebacks + returns} returns (share 2)`)
  if (preview > 1) out.push(`${preview} previews`)
  if (current !== 8 - comebacks - returns - preview) out.push(`current ${current}`)
  if (current < 5) out.push(`current share ${current} < 5`)
  if (slots.some((s) => !['practice', 'return', 'comeback', 'preview'].includes(s.role))) out.push('a role outside practice / return / comeback / preview')
  for (const it of items) if (it.lessonOnly || getSMTemplate(it.templateId)!.uses.length === 1 && getSMTemplate(it.templateId)!.uses[0] === 'step') out.push(`lesson-only template ${it.templateId} on a practice day`)
  const cur = items.filter((it) => it.role === 'practice')
  const allowed = new Set([unit.lessons[lessonIndex - 1].id, unit.lessons[Math.max(0, lessonIndex - 2)].id])
  for (const it of cur) if (!allowed.has(LESSON_OF(it.templateId))) out.push(`current item from ${LESSON_OF(it.templateId)} (not the lesson just taught or the one before)`)
  if (lessonIndex >= 4) {
    const ops = new Set(cur.map(opOf))
    if (!(ops.has('add') || ops.has('both')) || !(ops.has('take') || ops.has('both'))) out.push('no adds and take-aways side by side')
  }
  if (lessonIndex >= 5) {
    const at = new Set(cur.flatMap((it) => [...unknownAt(it)]))
    // the start (□ − p = k) now comes round with the box's place over the days (checked across days below)
    for (const p of ['part', 'result']) if (!at.has(p)) out.push(`the unknown is never at the ${p}`)
  }
  if (lessonIndex >= 6) {
    const st = cur.filter((it) => STORIES.has(it.templateId)).length
    if (st < 1 || st > 2) out.push(`${st} stories (one or two)`)
  }
  for (const it of items.filter((x) => x.role === 'preview')) if (it.label !== 'try a new one') out.push('preview not labelled "try a new one"')
  return [...out, ...dayHygiene(items, slots.map((s) => s.source))]
}

/** Previews: at most 2 a unit, never on two module days running. */
export function checkPreviewSeries(days: Array<{ dayKey: string; previews: number }>): string[] {
  const out: string[] = []
  const total = days.reduce((s, d) => s + d.previews, 0)
  if (total > 2) out.push(`${total} previews in the unit`)
  for (let i = 1; i < days.length; i++) if (days[i].previews && days[i - 1].previews) out.push(`previews on ${days[i - 1].dayKey} and ${days[i].dayKey}, two days running`)
  return out
}

/** W2: the look-again list against the day's attempts. */
export function checkLookAgain(list: ReturnType<typeof lookAgain>, items: SMItem[], attempts: SMAttempt[], cap: number): string[] {
  const out: string[] = []
  if (list.length > cap) out.push(`${list.length} look-again items (cap ${cap})`)
  for (const la of list) {
    const a = attempts.find((x) => x.itemId === la.fromItemId)
    if (!a) { out.push(`look-again ${la.item.id} has no first answer`); continue }
    if (a.firstTryCorrect) out.push(`look-again re-serves ${la.fromItemId}, answered right first try`)
    if (la.item.role !== 'review' || !la.item.id.endsWith('-LA-')) out.push(`look-again ${la.item.id} not role review / -LA-`)
    if (countsInN(la.item)) out.push('a look-again item counts in N')
    if (la.startRung !== 1) out.push('look again does not start at rung 1')
    const src = items.find((i) => i.id === la.fromItemId)!
    if (a.ladderRung >= 4) {
      if (!la.twin || operandSignature(la.item) === operandSignature(src)) out.push(`${la.fromItemId}: the answer was shown, but the same numbers come back`)
    } else {
      if (la.twin || la.ownAnswer !== a.answers[0]) out.push(`${la.fromItemId}: his own answer is not shown with the same question`)
      if (operandSignature(la.item) !== operandSignature(src)) out.push(`${la.fromItemId}: look again changed the question`)
    }
    if (fixItAttempt(src, attempts, a.localDay)?.firstTryCorrect) out.push(`${la.fromItemId}: its fix-it twin was answered right first try, yet it comes back to look again`)
    const keys = la.item.parts.flatMap((p) => askedNumbers(la.item, p))
    for (const k of keys) if (new RegExp(`(?<!\\d)${k}(?!\\d)`).test(la.line)) out.push(`look-again line says the key ${k}`)
  }
  return out
}

/** W1: the screen after a shown item is its fix-it (review, -FX-, not in N; a twin keeps the template, new numbers). */
export function checkFixItQueue(q: SMItem[], index: number, shown: SMItem, fix: ReturnType<typeof fixItAfterShown>): string[] {
  const out: string[] = []
  if (fix.kind === 'none') return out
  const placed = q[index + 1]
  if (placed !== fix.item) out.push('the fix-it is not the next screen')
  if (placed.role !== 'review' || !placed.id.includes('-FX-')) out.push(`fix-it ${placed.id} is not role review / -FX-`)
  if (countsInN(placed)) out.push('the fix-it counts in N')
  if (q.filter(countsInN).length !== q.length - 1) out.push('N changed when the fix-it was inserted')
  if (validateItem(placed).length) out.push(`fix-it invalid: ${validateItem(placed)[0].message}`)
  if (fix.kind === 'twin' && (placed.templateId !== shown.templateId || operandSignature(placed) === operandSignature(shown))) out.push('the twin is not the same template with new numbers')
  return out
}

// ---------------------------------------------------------------------------
console.log('\nlesson days L1–L6 — 200 seeds each')
{
  for (let l = 1; l <= 6; l++) {
    let bad = 0
    let first = ''
    for (const seed of SEEDS) {
      try {
        const d = lessonDay(unit, unit.lessons[l - 1].id, seed, { dayKey: '2026-11-24' })
        const p = checkLessonDay(d, l)
        if (p.length) { bad++; if (!first) first = `seed ${seed}: ${p[0]}` }
      } catch (e) { bad++; if (!first) first = `seed ${seed} threw: ${(e as Error).message}` }
    }
    const d3 = lessonDay(unit, unit.lessons[l - 1].id, 3, { dayKey: '2026-11-24' })
    say(bad === 0, `L${l}: N ${d3.manifest.n}, slots ${d3.manifest.slots.map((s) => s.role).join(' > ')} — off ${bad}/200${first ? ' — ' + first : ''}`)
  }
}

console.log('\nlesson day — "already knows" cuts the steps to one; a stuck skill re-opens its concrete step one rung lower')
{
  const knows = Object.fromEntries(unit.skills.map((s) => [s.id, { skillId: s.id, state: 'learning' as const, qualifyingDays: [], servedDays: ['2026-11-01', '2026-11-02'], practiceDaysSinceClean: 0, movedBack: false, alreadyKnows: true, fluencyMs: null, lastServedDay: null, ignoredEvents: [] }]))
  const cut = lessonDay(unit, 'G1-U02-L3', 3, { dayKey: '2026-11-24', states: knows })
  const steps = cut.manifest.slots.filter((s) => s.role === 'step')
  say(steps.length === 1 && steps[0].templateId === T('l3.join_bond') && cut.manifest.slots.some((s) => s.role === 'starter') && cut.manifest.slots.filter((s) => s.role === 'exit').length === 2,
    `L3 with every skill "already knows": one step (${steps.map((s) => s.templateId).join(', ')}), starter and exits kept, N ${cut.manifest.n}`)
  const stuck = { ...knows }
  for (const k of Object.keys(stuck)) stuck[k] = { ...stuck[k], alreadyKnows: false }
  stuck['G1-U02-K3'] = { ...stuck['G1-U02-K3'], state: 'stuck' as never }
  const re = lessonDay(unit, 'G1-U02-L4', 3, { dayKey: '2026-11-24', states: stuck })
  const ro = re.manifest.slots.find((s) => s.reopens)
  say(!!ro && ro.templateId === T('l2.bond_from_split') && ro.modelRung === 'label' && ro.inN && re.manifest.n === 7,
    `L4 with K3 stuck: re-opens ${ro?.templateId} at model rung "${ro?.modelRung}" (one below build), N ${re.manifest.n} (6 + 1)`)
}

// ---------------------------------------------------------------------------
console.log(`\nwhole units — ${SIM_SEEDS.length} simulated children, 6 lesson days, 6 practice days, the check, 8 practice days after`)
const sims = SIM_SEEDS.map((seed) => ({ seed, ...simulateUnit(unit, seed, { extraPractice: 8 }) }))
{
  let bad = 0, first = '', practiceDays = 0, maxCb = 0, withPreview = 0, withReturn = 0
  let previewBad = 0, previewFirst = ''
  for (const s of sims) {
    const series: Array<{ dayKey: string; previews: number }> = []
    for (const d of s.days) {
      series.push({ dayKey: d.dayKey, previews: d.items.filter((i) => i.role === 'preview').length })
      if (d.kind !== 'practice' || !d.day) continue
      practiceDays++
      const li = unit.lessons.findIndex((l) => l.id === d.lessonId) + 1
      const p = checkPracticeDay(d.day, li)
      if (p.length) { bad++; if (!first) first = `seed ${s.seed} ${d.dayKey} (after L${li}): ${p[0]}` }
      maxCb = Math.max(maxCb, d.items.filter((i) => i.role === 'comeback').length)
      if (d.items.some((i) => i.role === 'preview')) withPreview++
      if (d.items.some((i) => i.role === 'return')) withReturn++
    }
    const pv = checkPreviewSeries(series)
    if (pv.length) { previewBad++; if (!previewFirst) previewFirst = `seed ${s.seed}: ${pv[0]}` }
  }
  say(bad === 0, `practice days: ${practiceDays} checked; shares, roles, lessons, mixing, stories — off ${bad}${first ? ' — ' + first : ''}`)
  say(maxCb <= 2, `comebacks on one day: at most ${maxCb} (cap 2 in Grade 1)`)
  say(previewBad === 0, `previews: ≤ 2 a unit, never two days running — off ${previewBad}/${sims.length}${previewFirst ? ' — ' + previewFirst : ''}; days with a preview ${withPreview}, with a weakest-skill return ${withReturn}`)
  let lbad = 0, lfirst = ''
  for (const s of sims) for (const d of s.days) {
    if (d.kind !== 'lesson' || !d.day) continue
    const li = unit.lessons.findIndex((l) => l.id === d.lessonId) + 1
    const p = checkLessonDay(d.day, li)
    // a simulated child can be stuck or "already knows": then N and steps differ by design
    const real = p.filter((x) => !/^N |^steps |^manifest N/.test(x) || !d.day!.manifest.slots.some((sl) => sl.reopens || /already knows/.test(sl.source)))
    if (real.length) { lbad++; if (!lfirst) lfirst = `seed ${s.seed} ${d.dayKey}: ${real[0]}` }
  }
  say(lbad === 0, `lesson days inside the simulated units — off ${lbad}${lfirst ? ' — ' + lfirst : ''}`)
}

/** W5: a comeback or return is new to him (21 days, its skills), or its slot says "older" (no fresh draw existed). */
export function staleUnmarked(day: SMDay, before: SMAttempt[]): { stale: number; unmarked: string[]; n: number } {
  let stale = 0, n = 0
  const unmarked: string[] = []
  day.manifest.slots.forEach((s, i) => {
    const it = day.items[i]
    if (!it || (s.role !== 'comeback' && s.role !== 'return')) return
    n++
    if (!seenSignatures(before, it.skillIds, day.manifest.dayKey).has(operandSignature(it))) return
    stale++
    if (!/older:/.test(s.source)) unmarked.push(`${day.manifest.dayKey} ${it.templateId}`)
  })
  return { stale, unmarked, n }
}
console.log('\nW5 — comebacks and returns are fresh: new to him in 21 days, or marked "older"')
{
  let stale = 0, n = 0
  const unmarked: string[] = []
  const older = new Map<string, number>()
  for (const s of sims) for (const d of s.days) {
    if (d.kind !== 'practice' || !d.day) continue
    const r = staleUnmarked(d.day, s.attempts.filter((a) => a.localDay < d.dayKey))
    stale += r.stale; n += r.n; unmarked.push(...r.unmarked)
    for (const sl of d.day.manifest.slots) if (/older:/.test(sl.source)) older.set(sl.templateId!, (older.get(sl.templateId!) ?? 0) + 1)
  }
  say(unmarked.length === 0, `${n} comebacks and returns: ${n - stale} new to him, ${stale} older (no fresh draw in the template's space) — unmarked stale ${unmarked.length}${unmarked.length ? ': ' + unmarked.slice(0, 3).join('; ') : ''}`)
  console.log(`    "older" draws by template (small spaces): ${[...older.entries()].map(([k, v]) => `${k.replace(/^sm\.g1u0\d\./, '')} ${v}`).join(', ') || 'none'}`)
}

// ---------------------------------------------------------------------------
console.log('\nfreeze — the same inputs give the same manifest; items rebuild from it (resume after reload)')
{
  let bad = 0
  for (const s of sims.slice(0, 20)) {
    for (const d of s.days) {
      if (!d.day) continue
      const before = s.attempts.filter((a) => a.localDay < d.dayKey)
      const again = d.kind === 'lesson'
        ? lessonDay(unit, d.lessonId, s.seed, { dayKey: d.dayKey, attempts: before })
        : practiceDay(unit, { dayKey: d.dayKey, lessonId: d.lessonId, attempts: before }, d.day.manifest.seed)
      const reloaded = itemsFromManifest(JSON.parse(JSON.stringify(d.day.manifest)))
      if (JSON.stringify(again.manifest) !== JSON.stringify(d.day.manifest) || again.hash !== d.day.hash
        || dayManifestHash(d.day.manifest) !== d.day.hash || JSON.stringify(reloaded) !== JSON.stringify(d.day.items)) bad++
    }
  }
  say(bad === 0, `20 units × every lesson and practice day: manifest, hash and rebuilt items identical — off ${bad}`)
}

// ---------------------------------------------------------------------------
console.log('\nW1 — fix-it after a shown answer (rung 4)')
{
  const noTwin: string[] = []
  let bad = 0
  let n = 0
  for (const d of allSMTemplates()) {
    for (const seed of SEEDS.slice(0, 40)) {
      const it = buildItem(d.id, { seed })
      const queue = [buildItem(T('l3.add_pad'), { seed: seed + 1 }), it, buildItem(T('l4.sub_pad'), { seed: seed + 2 })]
      const { queue: q, fix } = queueAfterShown(queue, 1)
      n++
      if (fix.kind === 'none') { if (!noTwin.includes(d.id)) noTwin.push(`${d.id} (${fix.reason})`); continue }
      if (fix.kind !== 'twin' && !noTwin.includes(d.id)) noTwin.push(`${d.id} (explain-back)`)
      if (checkFixItQueue(q, 1, it, fix).length) bad++
    }
  }
  say(bad === 0, `${n} shown items: the next screen is a review twin (-FX-, same template, new numbers), never counted in N — off ${bad}`)
  console.log(`    templates with no twin: ${noTwin.length ? noTwin.join('; ') : 'none (every template makes a twin)'}`)
}

// ---------------------------------------------------------------------------
console.log('\nW2 — look again; W3 — which misses come back; the score never changes')
const day = '2026-12-03'
let W2_TWIN: { items: SMItem[]; atts: SMAttempt[] } | null = null
const pd = sims[0].days.find((d) => d.kind === 'practice' && d.items.length >= 6)!
const fixtureAttempts = (items: SMItem[]): SMAttempt[] => items.map((it, k) => attemptFrom(it, { dayKind: 'practice', localDay: day, createdAt: instantOn(day, k) }, {
  firstTryCorrect: k % 3 === 0, answers: [k % 3 === 0 ? '(right)' : `(his answer ${k})`], ladderRung: ([0, 1, 4, 0, 2, 3, 0, 4] as const)[k % 8],
}))
{
  const items = pd.items
  const atts = fixtureAttempts(items)
  const la = lookAgain(items, atts, 2, { dayKind: 'practice' })
  const p = checkLookAgain(la, items, atts, 2)
  say(p.length === 0 && la.length === 2, `look again on a practice day: ${la.length} items (${la.map((x) => (x.twin ? 'fresh twin' : 'same question, his answer shown')).join('; ')})${p.length ? ' — ' + p[0] : ''}`)
  const allMiss = items.map((it, k) => attemptFrom(it, { dayKind: 'practice', localDay: day, createdAt: instantOn(day, k) }, { firstTryCorrect: false, answers: ['x'], ladderRung: 4 }))
  const la4 = lookAgain(items, allMiss, 2, { dayKind: 'practice' })
  say(la4.length === 2 && la4.every((x) => x.twin && x.ownAnswer === null) && checkLookAgain(la4, items, allMiss, 2).length === 0, 'every miss shown at rung 4: look again serves fresh-number twins (W5)')
  say(lookAgain(items, atts, 2, { dayKind: 'practice', tookRest: true }).length === 0, 'he takes the rest: no look again')
  say(lookAgain(items, atts, 2, { dayKind: 'lesson' }).length === 0, 'lesson day: no look again (W1 only)')
  const before = dayScore(items, atts)
  const review = la.map((x, k) => attemptFrom(x.item, { dayKind: 'practice', localDay: day, createdAt: instantOn(day, 40 + k) }, { firstTryCorrect: true, answers: ['review: right'] }))
  const shownFix = fixItAfterShown(items[1])
  const fixAtt = shownFix.kind === 'none' ? [] : [attemptFrom(shownFix.item, { dayKind: 'practice', localDay: day, createdAt: instantOn(day, 50) }, { firstTryCorrect: true })]
  const after = dayScore([...items, ...la.map((x) => x.item), ...(shownFix.kind === 'none' ? [] : [shownFix.item])], [...atts, ...review, ...fixAtt])
  say(before.right === after.right && before.of === after.of, `day score ${before.right} of ${before.of} before review answers, ${after.right} of ${after.of} after (unchanged)`)
}
{
  // W3: a practice miss at each rung; a check miss; a review answer on a comeback
  const it = buildItem(T('l4.sub_pad'), { seed: 3, role: 'practice' })
  const mk = (rung: 0 | 1 | 2 | 3 | 4, d: string, extra: Partial<SMAttempt> = {}) => ({ ...attemptFrom(it, { dayKind: 'practice', localDay: d, createdAt: instantOn(d, rung) }, { firstTryCorrect: false, ladderRung: rung }), ...extra })
  const rungs = [1, 2, 3, 4].map((r) => comebackLedger([mk(r as 1 | 2 | 3 | 4, '2026-12-01')]).length)
  say(rungs.join(',') === '0,0,1,1', `practice misses at rungs 1,2,3,4 become comebacks: ${rungs.join(',')} (only 3 and 4)`)
  const ck = buildItem(T('l4.sub_pad'), { seed: 5, role: 'check' })
  const ckMiss = attemptFrom(ck, { dayKind: 'check', localDay: '2026-12-01', createdAt: instantOn('2026-12-01', 0) }, { firstTryCorrect: false, ladderRung: 0 })
  const led = comebackLedger([ckMiss])
  say(led.length === 1 && led[0].source === 'check' && led[0].dueOn === '2026-12-03', `a check miss on 2026-12-01 comes back on ${led[0]?.dueOn} (2 days), source ${led[0]?.source}`)
}

{
  // W2 after W1: a rung-4 miss whose fix-it twin he answered right is not looked at again
  const items = pd.items
  const miss = (k: number, rung: 0 | 1 | 2 | 3 | 4) => attemptFrom(items[k], { dayKind: 'practice', localDay: day, createdAt: instantOn(day, k) }, { firstTryCorrect: false, answers: [`(his answer ${k})`], ladderRung: rung })
  const right = (k: number) => attemptFrom(items[k], { dayKind: 'practice', localDay: day, createdAt: instantOn(day, k) }, { firstTryCorrect: true, answers: ['(right)'] })
  const tw0 = fixItAfterShown(items[0]), tw2 = fixItAfterShown(items[2])
  if (tw0.kind === 'none' || tw2.kind === 'none') throw new Error('fixture needs twins')
  const twinRight = attemptFrom(tw0.item, { dayKind: 'practice', localDay: day, createdAt: instantOn(day, 20) }, { firstTryCorrect: true })
  const twinMissed = attemptFrom(tw2.item, { dayKind: 'practice', localDay: day, createdAt: instantOn(day, 21) }, { firstTryCorrect: false, ladderRung: 2 })
  const atts = [miss(0, 4), twinRight, right(1), miss(2, 4), twinMissed, miss(3, 1), ...items.slice(4).map((_, k) => right(k + 4))]
  const la = lookAgain(items, atts, 2, { dayKind: 'practice' })
  const from = la.map((x) => items.findIndex((i) => i.id === x.fromItemId))
  say(JSON.stringify(from) === '[2,3]' && checkLookAgain(la, items, atts, 2).length === 0,
    `slot 1 (twin right) is skipped; slot 3 (twin missed) comes back as a fresh twin; slot 4 next — look again takes slots ${from.map((x) => x + 1).join(', ')}`)
  W2_TWIN = { items, atts }
}
// W3 checkers that take a ledger function, so a broken ledger can be shown to fail them
type Ledger = typeof comebackLedger
function reviewNeverClean(ledger: Ledger): string[] {
  const ck = buildItem(T('l4.sub_pad'), { seed: 5, role: 'check' })
  const miss = attemptFrom(ck, { dayKind: 'check', localDay: '2026-12-01', createdAt: instantOn('2026-12-01', 0) }, { firstTryCorrect: false })
  const key = comebackLedger([miss])[0].key
  const rv = { ...buildItem(T('l4.sub_pad'), { seed: 9, role: 'review' }) }
  const reviewAns = attemptFrom(rv, { dayKind: 'practice', localDay: '2026-12-03', createdAt: instantOn('2026-12-03', 0), comebackKey: key }, { firstTryCorrect: true })
  const e = ledger([miss, reviewAns]).find((x) => x.key === key)!
  return e.step === 0 && e.rounds === 0 ? [] : [`a review answer moved the comeback to step ${e.step}`]
}
function rungTwoNotComeback(ledger: Ledger): string[] {
  const it = buildItem(T('l4.sub_pad'), { seed: 3, role: 'practice' })
  const a = attemptFrom(it, { dayKind: 'practice', localDay: '2026-12-01', createdAt: instantOn('2026-12-01', 0) }, { firstTryCorrect: false, ladderRung: 2 })
  return ledger([a]).length === 0 ? [] : ['a practice miss fixed at rung 2 was scheduled as a comeback']
}
say(reviewNeverClean(comebackLedger).length === 0, 'a review answer is never a clean comeback answer')
say(rungTwoNotComeback(comebackLedger).length === 0, 'a practice miss fixed at rung 2 is not a comeback')

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
console.log('\nW1 twins keep clear of the day\'s fact families (Fable gate: a twin drew a later slot\'s fact)')
type TwinFn = (it: SMItem, day: SMItem[]) => { item: SMItem; marked: boolean } | null
const realTwin: TwinFn = (it, day) => { const f = fixItAfterShown(it, day); return f.kind === 'twin' ? { item: f.item, marked: !!f.note } : null }
/** Twins whose fact family repeats another item of the day, unmarked. */
export function twinClashes(fn: TwinFn): { n: number; clash: number; marked: number } {
  let n = 0, clash = 0, marked = 0
  for (const s of sims.slice(0, 30)) for (const d of s.days) {
    if (d.kind !== 'practice' && d.kind !== 'lesson') continue
    const fams = d.items.filter((x) => x.fact).map((x) => factFamily(x.fact!))
    for (const it of d.items) {
      const tw = fn(it, d.items)
      if (!tw || !tw.item.fact) continue
      n++
      if (tw.marked) { marked++; continue }
      if (fams.includes(factFamily(tw.item.fact))) clash++
    }
  }
  return { n, clash, marked }
}
{
  const r = twinClashes(realTwin)
  say(r.clash === 0, `${r.n} fix-it twins on 30 units' lesson and practice days: none repeats a fact family of the day (${r.marked} marked as the only fresh draw) — clashes ${r.clash}`)
}

// missing-addend vs sum (Opus re-check, seed 70001: twin "4 + 6 = □" after "4 + □ = 10")
function addendSumClashes(twin: (it: SMItem, day: SMItem[]) => SMItem | null): number {
  let clash = 0
  for (const seed of SEEDS) {
    const ma = buildItem(T('l5.missing_addend_choice'), { seed, role: 'practice', force: { w: 10, a: 4 } })
    const shown = buildItem(T('l3.add_pad'), { seed: seed + 7, role: 'practice' })
    const tw = twin(shown, [ma, shown])
    if (tw?.fact && factFamily(tw.fact) === factFamily(ma.fact!)) clash++
  }
  return clash
}
{
  const c = addendSumClashes((it, day) => { const f = fixItAfterShown(it, day); return f.kind === 'twin' && !f.note ? f.item : null })
  say(c === 0, `a sum's fix-it twin never lands on the family of the day's missing-addend item (10 = 4 + 6), 200 seeds — clashes ${c}`)
}

/** A check row that repeats exactly (same template, same numbers) an item served in the last 7 days. */
export function checkRepeats(rows: SMItem[], recent: Array<{ templateId: string; signature: string }>): string[] {
  const seen = new Set(recent.map((r) => `${r.templateId}|${r.signature}`))
  return rows.filter((it) => seen.has(`${it.templateId}|${operandSignature(it)}`)).map((it) => `${it.templateId} ${operandSignature(it)} was served in the last 7 days`)
}
console.log('\nthe chapter check never repeats an item he was served in the last 7 days (Opus re-check)')
{
  let bad = 0, n = 0, sharedFam = 0
  for (const sm of sims) {
    const ckDay = sm.days.find((d) => d.kind === 'check')!
    const before = sm.attempts.filter((a) => a.localDay < ckDay.dayKey)
    const recent = recentServed(before, ckDay.dayKey)
    n += ckDay.items.length
    bad += checkRepeats(ckDay.items, recent).length
    const fams = new Set(before.filter((a) => daysBetween(a.localDay, ckDay.dayKey) <= 7).map((a) => a.signature))
    sharedFam += ckDay.items.filter((it) => fams.has(operandSignature(it))).length
  }
  say(bad === 0, `${sims.length} simulated checks, ${n} rows: none repeats a served item exactly — repeats ${bad} (rows sharing numbers with a DIFFERENT recent template, allowed: ${sharedFam})`)
}

console.log('\nstructure turns day to day (Fable gate D9): box place, sign, story kind — 200 simulated children')
interface Turned { boxPlaces: string[]; signs: string[]; stories: string[]; whichKinds: string[] }
function turnedOf(days: Array<{ kind: string; lessonId: string; day?: SMDay }>): Turned {
  const t: Turned = { boxPlaces: [], signs: [], stories: [], whichKinds: [] }
  for (const d of days) {
    if (d.kind !== 'practice' || !d.day || (d.lessonId !== 'G1-U02-L5' && d.lessonId !== 'G1-U02-L6')) continue
    const cur = d.day.manifest.slots.filter((sl) => sl.role === 'practice')
    const box = cur.find((sl) => sl.templateId === T('l5.box_any_place') && !/blind-habit/.test(sl.source))
    if (box) t.boxPlaces.push(String(box.options?.place))
    const sign = cur.find((sl) => sl.templateId === T('l4.sign_decides'))
    if (sign) t.signs.push(String(sign.options?.op))
    const story = cur.find((sl) => sl.templateId === T('l6.join_story') || sl.templateId === T('l6.takeaway_story'))
    if (story) t.stories.push(story.templateId!)
    const wb = cur.find((sl) => sl.templateId === T('l6.which_bond_story'))
    if (wb) t.whichKinds.push(String(wb.options?.kind))
  }
  return t
}
/** Problems with one child's turned structure; and population tallies for signs. */
export function turnProblems(t: Turned): string[] {
  const out: string[] = []
  if (new Set(t.boxPlaces).size < 3) out.push(`box places ${t.boxPlaces.join(',')} (fewer than 3 distinct)`)
  const alternates = (xs: string[]) => xs.every((x, i) => i === 0 || x !== xs[i - 1])
  if (t.stories.length >= 2 && !alternates(t.stories)) out.push(`story kinds ${t.stories.map((x) => x.split('.').pop()).join(',')} do not alternate`)
  if (t.whichKinds.length >= 2 && !alternates(t.whichKinds)) out.push(`which-bond kinds ${t.whichKinds.join(',')} do not alternate`)
  return out
}
const turnSims = SEEDS.map((seed) => ({ seed, ...simulateUnit(unit, seed, { extraPractice: 3 }) }))
{
  let bad = 0, first = ''
  const signs = new Set<string>(), boxAll = new Map<string, number>()
  for (const s of turnSims) {
    const t = turnedOf(s.days)
    t.signs.forEach((x) => signs.add(x))
    t.boxPlaces.forEach((x) => boxAll.set(x, (boxAll.get(x) ?? 0) + 1))
    const p = turnProblems(t)
    if (p.length) { bad++; if (!first) first = `seed ${s.seed}: ${p[0]}` }
  }
  say(bad === 0, `each child's L5–L6 practice days: ≥ 3 box places, story kind and which-bond kind alternate day to day — off ${bad}/200${first ? ' — ' + first : ''}`)
  say(signs.size === 2, `the sign item's first sign takes both values across children (${[...signs].join(', ')})`)
  say((boxAll.get('4') ?? 0) > 0, `the unknown start (place 4) is still served: box places served ${[...boxAll.entries()].sort().map(([k, v]) => `${k}: ${v}`).join(' · ')}`)
  const sample = turnedOf(turnSims[0].days)
  console.log(`    child seed ${turnSims[0].seed}: box places ${sample.boxPlaces.join(', ')} · stories ${sample.stories.map((x) => x.split('.').pop()).join(', ')} · which-bond ${sample.whichKinds.join(', ')}`)
}

console.log('\nbroken controls — each must fire')
{
  const real = sims[0].days.find((d) => d.kind === 'practice' && d.day && d.lessonId === 'G1-U02-L5')!
  const li = 5
  // (a) a G1 day with 3 comebacks
  const a = clone(real.day!) as SMDay
  let flipped = 0
  for (const s of a.manifest.slots) if (flipped < 3 && s.role !== 'preview') { s.role = 'comeback'; flipped++ }
  a.items = a.items.map((it, i) => (it ? { ...it, role: a.manifest.slots[i].role as never } : it))
  control(checkPracticeDay(a, li).some((p) => /comebacks \(cap/.test(p)), 'a Grade 1 practice day with 3 comebacks fails the cap')
  // (b) a preview two days running
  control(checkPreviewSeries([{ dayKey: '2026-12-03', previews: 1 }, { dayKey: '2026-12-04', previews: 1 }]).length > 0, 'previews on two days running fail')
  // (c) a look-again that re-serves an item answered right
  const items = pd.items
  const atts = fixtureAttempts(items)
  const right = items.find((_, k) => k % 3 === 0)!
  const brokenLA = [{ item: { ...right, role: 'review' as const, id: `${right.id}-LA-` }, ownAnswer: '(right)', startRung: 1 as const, fromItemId: right.id, twin: false, line: LOOK_AGAIN_LINE }]
  control(checkLookAgain(brokenLA, items, atts, 2).some((p) => /answered right/.test(p)), 'a look-again re-serving an item answered right fails')
  // (d) a comeback ledger that counts a review answer as clean
  const reviewAsClean: Ledger = (as) => comebackLedger(as.map((x) => (x.role === 'review' ? { ...x, role: 'comeback' } : x)))
  control(reviewNeverClean(reviewAsClean).length > 0, 'a ledger that counts a review answer as clean fails')
  // (e) a rung-2 practice miss scheduled as a comeback
  const rung2Counts: Ledger = (as) => comebackLedger(as.map((x) => (x.ladderRung === 2 ? { ...x, ladderRung: 3 } : x)))
  control(rungTwoNotComeback(rung2Counts).length > 0, 'a ledger that schedules a rung-2 practice miss fails')
  // (f) a lesson-only template on a practice day
  const f = clone(real.day!) as SMDay
  const fi = f.manifest.slots.findIndex((s) => s.role === 'practice')
  const lo = buildItem(T('l4.take_away'), { seed: 77, role: 'step' })
  f.items[fi] = { ...lo, role: 'practice' }
  f.manifest.slots[fi].templateId = lo.templateId
  control(checkPracticeDay(f, li).some((p) => /lesson-only/.test(p)), 'a lesson-only template (l4.take_away) on a practice day fails')
  // (g) a fix-it twin counted in N
  const shown = items[0]
  const g = queueAfterShown([shown, items[1]], 0)
  if (g.fix.kind !== 'none') g.queue[1] = { ...g.queue[1], role: 'practice' }
  const gFix = g.fix.kind === 'none' ? g.fix : { ...g.fix, item: g.queue[1] }
  control(checkFixItQueue(g.queue, 0, shown, gFix as ReturnType<typeof fixItAfterShown>).some((p) => /counts in N|review/.test(p)), 'a fix-it twin served as practice (counted in N) fails')
  // (h) a lesson day with no demo
  const ld = lessonDay(unit, 'G1-U02-L2', 3, { dayKey: '2026-11-24' })
  const h = clone(ld)
  h.manifest.slots = h.manifest.slots.filter((s) => s.role !== 'demo')
  h.items = h.items.filter((x) => x !== null)
  control(checkLessonDay(h, 2).some((p) => /demo slots/.test(p)), 'a lesson day with no demo slot fails')
  // (i) a manifest that does not rebuild (a slot's stream changed)
  const i = clone(ld)
  const si = i.manifest.slots.find((s) => s.role === 'step')!
  si.stream = `${si.stream}-x`
  control(JSON.stringify(itemsFromManifest(i.manifest)) !== JSON.stringify(ld.items) && dayManifestHash(i.manifest) !== ld.hash, 'a manifest whose stream changed rebuilds different items and a different hash')
  // (k) a comeback that repeats numbers he met in the last 21 days, without the "older" mark
  const ks = sims.flatMap((sm) => sm.days.map((d) => ({ sm, d }))).find(({ d }) => d.kind === 'practice' && d.day && d.items.some((x) => x.role === 'comeback'))!
  const k = clone(ks.d.day!) as SMDay
  const ki = k.manifest.slots.findIndex((sl) => sl.role === 'comeback')
  const kBefore = ks.sm.attempts.filter((a) => a.localDay < ks.d.dayKey)
  const old = kBefore.find((a) => a.skillIds.some((x) => k.items[ki]!.skillIds.includes(x)))!
  k.manifest.slots[ki].source = 'comeback:check'
  k.items[ki] = { ...k.items[ki]!, givens: old.signature.startsWith('g:') ? old.signature.slice(2).split(',').map(Number) : k.items[ki]!.givens }
  const kr = staleUnmarked(k, [...kBefore, { ...old, signature: operandSignature(k.items[ki]!) }])
  control(kr.unmarked.length > 0, 'a comeback that repeats numbers he met in the last 21 days, unmarked, fails W5')
  // (l) a lookAgain that ignores the fix-it twin's result (it never sees the twin's answer)
  const wt = W2_TWIN!
  const blind = lookAgain(wt.items, wt.atts.filter((x) => x.role !== 'review'), 2, { dayKind: 'practice' })
  control(checkLookAgain(blind, wt.items, wt.atts, 2).some((p) => /fix-it twin was answered right/.test(p)), 'a look-again that ignores the fix-it twin\'s result re-serves a miss already fixed, and fails')
  // (m) the old fix-it twin, blind to the day's facts
  const oldTwin: TwinFn = (it) => { try { return { item: fixItTwin(it, fixSeed(it)), marked: false } } catch { return null } }
  const oc = twinClashes(oldTwin)
  control(oc.clash > 0, `the old fix-it twin (blind to the day) repeats a fact family of the day ${oc.clash} times`)
  // (n) the old pinned structure: every day the first box at the start, the same story and which-bond kind
  const pinned = turnSims.map((sm) => { const t = turnedOf(sm.days); return turnProblems({ boxPlaces: t.boxPlaces.map(() => '4'), signs: t.signs, stories: t.stories.map(() => T('l6.join_story')), whichKinds: t.whichKinds.map(() => 'join') }) })
  control(pinned.filter((p) => p.length).length === pinned.length, 'the old pinned structure (box always at the start, story kind fixed) fails for every child')
  // (o) the old twin on the missing-addend vs sum pair
  const oo = addendSumClashes((it) => { try { return fixItTwin(it, fixSeed(it)) } catch { return null } })
  control(oo > 0, `the old fix-it twin lands on the day's missing-addend family (10 = 4 + 6) ${oo} times in 200`)
  // (p) a check form that copies a practice item served 2 days earlier
  {
    const sm = sims[0]
    const ckDay = sm.days.find((d) => d.kind === 'check')!
    const twoBefore = sm.days.filter((d) => d.kind === 'practice' && daysBetween(d.dayKey, ckDay.dayKey) >= 2 && daysBetween(d.dayKey, ckDay.dayKey) <= 4).pop()!
    const copied = twoBefore.items.find((it) => ckDay.items.some((c) => c.templateId === it.templateId)) ?? twoBefore.items[0]
    const rows = ckDay.items.map((c) => (c.templateId === copied.templateId ? { ...copied, role: 'check' as const } : c))
    if (!rows.includes(copied) && !rows.some((r) => r.templateId === copied.templateId)) rows[0] = { ...copied, role: 'check' as const }
    const recent = recentServed(sm.attempts.filter((a) => a.localDay < ckDay.dayKey), ckDay.dayKey)
    control(checkRepeats(rows, recent).length > 0, `a check form that copies ${copied.templateId} served ${daysBetween(twoBefore.dayKey, ckDay.dayKey)} days earlier fails`)
  }
  // (j) a lesson day that uses its own demo's fact
  const j = clone(ld)
  const ji = j.items.findIndex((x) => x && x.role === 'step' && x.fact)
  j.items[ji] = { ...j.items[ji]!, fact: demoFacts(unit).find((x) => x.whole === 5)! }
  control(checkLessonDay(j, 2).some((p) => /demo fact/.test(p)), 'a lesson-day item with the lesson demo fact 5 = 2 + 3 fails')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-day-assembly-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
