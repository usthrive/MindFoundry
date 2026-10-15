/**
 * bb-fresh-form-test — the second re-check asks new questions.
 *
 * Run (from frontend/): npx tsx scripts/bb-fresh-form-test.ts
 *
 * WHY (owner "go", 2026-10-14). The corrective loop's second re-check served the
 * same six questions as the first — and after the first, the child goes over the
 * paper, where a question still missed after both steps is shown with its answer.
 * The owner's son was re-checked on a question whose answer he had just been
 * shown. `session/freshForm.ts` now draws the second re-check slot by slot from the
 * week's own builder at derived seeds. This asserts, for every served week × 3 seeds:
 *
 *   fresh      cycle 2 is a NEW set (every prompt and numeric surface differs from
 *              Form A and from the first re-check), except a named list of weeks
 *              that cannot produce one — a ratchet: the list may shrink, never grow;
 *   blueprint  slot i of the new set is the same template as slot i of the first
 *              (same skill, new numbers), the set has the same size, and the ids are
 *              re-minted past the first set (…-MB-07…) so the attempt log never
 *              conflates two questions;
 *   stable     the same child gets the same set on every call (a reload re-serves it);
 *   cycle 1    is the pack's own Form B, unchanged;
 *   sources    FreshProblems serves `formBForCycle` for the week's cycle, and the
 *              strengthening screen can find the second re-check's questions.
 *
 * Each check runs on the real code and on a broken control that must fire.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator'
import { distinctFrom, formBForCycle, type FormForCycle } from '../src/modules/best-brains/session/freshForm'
import type { WeeklyConceptPack } from '../src/modules/best-brains/types'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

/** Weeks that cannot produce a fresh second re-check. A15 is a fixture with no builder. */
const NO_FRESH_ALLOWED = new Set(['A15'])
const SEEDS = [12345, 1262874861, 424242]

type Select = (pack: WeeklyConceptPack, seed: number, cycle: number) => FormForCycle

function findings(select: Select): string[] {
  const out: string[] = []
  for (const c of AVAILABLE_WEEKS) {
    for (const seed of SEEDS) {
      const pack = generatePack(c.level, c.week, seed)
      const cell = `${c.level}${c.week}`
      const one = select(pack, seed, 1)
      if (JSON.stringify(one.items) !== JSON.stringify(pack.masteryCheck.formB)) out.push(`${cell}@${seed}: cycle 1 is not the pack's own Form B`)
      const two = select(pack, seed, 2)
      if (!two.fresh) {
        if (!NO_FRESH_ALLOWED.has(cell)) out.push(`${cell}@${seed}: no fresh second re-check`)
        continue
      }
      const first = pack.masteryCheck.formB
      if (two.items.length !== first.length) out.push(`${cell}@${seed}: second set has ${two.items.length} questions, first had ${first.length}`)
      if (!distinctFrom(two.items, [...pack.masteryCheck.formA, ...first])) out.push(`${cell}@${seed}: second set repeats a question already served`)
      two.items.forEach((it, i) => {
        const want = first[i]?.id.replace(/(\d+)$/, (n) => String(Number(n) + first.length).padStart(2, '0'))
        if (it.id !== want) out.push(`${cell}@${seed}: slot ${i + 1} id ${it.id}, want ${want}`)
        const a = first[i]?.generator?.templateId
        const b = it.generator?.templateId
        if (a && b && a !== b) out.push(`${cell}@${seed}: slot ${i + 1} changed skill (${a} → ${b})`)
      })
      if (JSON.stringify(select(pack, seed, 2).items) !== JSON.stringify(two.items)) out.push(`${cell}@${seed}: not stable across calls`)
    }
  }
  return out
}

const real: Select = (pack, seed, cycle) => formBForCycle(pack, seed, undefined, cycle)

console.log(`\nfresh second re-check — ${AVAILABLE_WEEKS.length} weeks × ${SEEDS.length} seeds`)
const r = findings(real)
say(r.length === 0, `real selector${r.length ? ': ' + r.slice(0, 5).join('; ') + (r.length > 5 ? ` … +${r.length - 5}` : '') : ''}`)
{
  // Control A: the pre-2026-10-14 behaviour — the second re-check repeats the first.
  const same: Select = (pack) => ({ items: pack.masteryCheck.formB, fresh: true })
  say(findings(same).length > 0, 'control fires: a second re-check that repeats the first set')
  // Control B: new questions, but the ids are not re-minted.
  const sameIds: Select = (pack, seed, cycle) => {
    const f = real(pack, seed, cycle)
    return cycle < 2 || !f.fresh ? f : { ...f, items: f.items.map((it, i) => ({ ...it, id: pack.masteryCheck.formB[i].id })) }
  }
  say(findings(sameIds).length > 0, 'control fires: new questions under the old ids')
  // Control C: one slot keeps the question the child was already asked.
  const leaky: Select = (pack, seed, cycle) => {
    const f = real(pack, seed, cycle)
    return cycle < 2 || !f.fresh ? f : { ...f, items: [{ ...f.items[0], prompt: pack.masteryCheck.formB[0].prompt }, ...f.items.slice(1)] }
  }
  say(findings(leaky).length > 0, 'control fires: one slot repeats a question already served')
  // Control D: an unlisted week that gets no fresh set.
  const lazy: Select = (pack, seed, cycle) => (pack.identity.level === 'B' && pack.identity.week === 4 && cycle === 2 ? { items: pack.masteryCheck.formB, fresh: false } : real(pack, seed, cycle))
  say(findings(lazy).length > 0, 'control fires: a week dropping to the old set without being on the list')
}

// ---------------------------------------------------------------------------
console.log('\nsources — the second re-check serves it, and the review can find it')
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/modules/best-brains')
const fresh = fs.readFileSync(path.join(SRC, 'screens/FreshProblems.tsx'), 'utf8')
const strengthen = fs.readFileSync(path.join(SRC, 'screens/StrengthenPlan.tsx'), 'utf8')
function sourceFindings(f: string, s: string): string[] {
  const out: string[] = []
  if (!/formBForCycle\(pack, weekState\.packSeed, weekState\.contentVersion, formCycle\)/.test(f)) out.push('FreshProblems does not ask for the cycle\'s form')
  if (!/const formCycle = weekState\?\.state === 'cycle2' \? 2 : 1/.test(f)) out.push('FreshProblems does not derive the cycle from the week state')
  if (!/const items = form\?\.items/.test(f)) out.push('FreshProblems still serves pack.masteryCheck.formB directly')
  if (!/formBForCycle\([^)]*, 2\)\.items/.test(s)) out.push('StrengthenPlan cannot find the second re-check\'s questions (its review would skip them)')
  return out
}
const sr = sourceFindings(fresh, strengthen)
say(sr.length === 0, `real screens${sr.length ? ': ' + sr.join('; ') : ''}`)
{
  const direct = fresh.replace('const items = form?.items ?? pack.masteryCheck.formB;', 'const items = pack.masteryCheck.formB;')
  say(direct !== fresh && sourceFindings(direct, strengthen).length > 0, 'control fires: the re-check serving the old set directly')
  const blind = strengthen.replace(/\.\.\.cycle2\]/, ']')
  const blind2 = blind.replace(/formBForCycle\([^)]*, 2\)\.items/, '[]')
  say(blind2 !== strengthen && sourceFindings(fresh, blind2).length > 0, 'control fires: a strengthening screen blind to the second set')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
