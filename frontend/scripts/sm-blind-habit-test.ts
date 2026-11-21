/**
 * sm-blind-habit-test — "the answer is always the bigger part" must not be a habit a
 * child can learn from a day (EXEMPLAR-G1-U02 §3; ENGINE-SPEC §6.8; L51).
 *
 * Run (from frontend/): npx tsx scripts/sm-blind-habit-test.ts
 *
 * Over WHOLE practice days (not per template): 200 simulated children (sm-lib-sim), the
 * practice days after L4, L5 and L6, each with its real history (comebacks and returns
 * included). A missing-part item is one with a shown part and the other part asked:
 * l4.empty_part_bond, l4.sub_pad, l4.sign_decides (−), l5.box_any_place (□ in places
 * 1–3), l6.takeaway_story, and the two choice items whose pools need the larger part,
 * l4.missing_part_choice and l5.missing_addend_choice. On EVERY day, the answer is bigger
 * than the shown part on ≤ 60 % of its missing-part items (the max day is printed), and none
 * is a double (8 − 4 = □), where copying the shown part would pass.
 * Truth rows: balanced per item (as many true as false, or the error item's 3 + 3) and
 * shuffled (true-first on ≤ 60 % of items; no one row pattern on > 40 %).
 * Controls: the same days rebuilt by an assembler without the alternation (every `asked`
 * removed) must break the 60 % line on some day; truth rows always true-first must fail.
 */
import { G1_U02 } from '../src/modules/school-math/curriculum/grade1'
import { itemsFromManifest } from '../src/modules/school-math/engine/assemble'
import type { SMDayManifest, SMItem } from '../src/modules/school-math/types'
import { simulateUnit } from './sm-lib-sim'

const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const T = (s: string) => `sm.g1u02.${s}`
const num = (it: SMItem, k: string) => Number(it.generator.params[k])

/** { shown, key } for a missing-part item, else null. */
export function missingPart(it: SMItem): { shown: number; key: number } | null {
  const t = it.templateId
  if ([T('l4.empty_part_bond'), T('l4.sub_pad'), T('l4.missing_part_choice'), T('l6.takeaway_story')].includes(t)) return { shown: num(it, 'p'), key: num(it, 'w') - num(it, 'p') }
  if (t === T('l4.sign_decides')) return it.generator.params.op === '-' ? { shown: num(it, 'p'), key: num(it, 'w') - num(it, 'p') } : null
  if (t === T('l5.missing_addend_choice')) return { shown: num(it, 'a'), key: num(it, 'w') - num(it, 'a') }
  if (t === T('l5.box_any_place')) {
    const w = num(it, 'w'), a = num(it, 'a'), b = w - a, place = String(it.generator.params.place)
    if (place === '1') return { shown: a, key: b }
    if (place === '2' || place === '3') return { shown: b, key: a }
    return null
  }
  return null
}

export function biggerShare(items: SMItem[]): { bigger: number; n: number } {
  const mp = items.map(missingPart).filter((x): x is { shown: number; key: number } => x !== null)
  return { bigger: mp.filter((x) => x.key > x.shown).length, n: mp.length }
}

const without = (m: SMDayManifest): SMDayManifest => ({
  ...m, slots: m.slots.map((s) => {
    if (!s.options) return s
    const { asked: _drop, ...rest } = s.options as Record<string, unknown>
    void _drop
    return { ...s, options: Object.keys(rest).length ? rest : undefined }
  }),
})

// ---------------------------------------------------------------------------
console.log('\nwhole practice days after L4, L5, L6 — 200 simulated children')
let days = 0, worst = 0, worstAt = '', over = 0, overCtl = 0, worstCtl = 0, doubles = 0, mpItems = 0
const hist = new Map<string, number>()
const truthParts: Array<{ rows: boolean[] }> = []
const AFTER = new Set(['G1-U02-L4', 'G1-U02-L5', 'G1-U02-L6'])
for (const seed of SEEDS) {
  const { days: sim } = simulateUnit(G1_U02, seed, { extraPractice: 0 })
  for (const d of sim) {
    if (d.kind !== 'practice' || !AFTER.has(d.lessonId) || !d.day) continue
    days++
    const { bigger, n } = biggerShare(d.items)
    const share = n ? bigger / n : 0
    const key = n ? `${bigger}/${n}` : '0/0'
    hist.set(key, (hist.get(key) ?? 0) + 1)
    if (share > worst) { worst = share; worstAt = `seed ${seed} ${d.dayKey} (after ${d.lessonId.slice(-2)}): ${bigger} of ${n}` }
    if (share > 0.6) over++
    doubles += d.items.map(missingPart).filter((x) => x && x.key === x.shown).length
    mpItems += n
    // control: the same manifest without the alternation
    const ctlItems = itemsFromManifest(without(d.day.manifest)).filter((x): x is SMItem => x !== null)
    const c = biggerShare(ctlItems)
    const cs = c.n ? c.bigger / c.n : 0
    worstCtl = Math.max(worstCtl, cs)
    if (cs > 0.6) overCtl++
    for (const it of d.items) for (const p of it.parts) if (p.surface.kind === 'truth') truthParts.push({ rows: p.surface.rows.map((r) => r.truth) })
  }
}
console.log(`    days by "answer bigger / missing-part items": ${[...hist.entries()].sort().map(([k, v]) => `${k}: ${v}`).join(' · ')}`)
say(over === 0, `${days} practice days: the answer is the bigger part on ≤ 60 % of each day's missing-part items — max day ${(100 * worst).toFixed(0)} % (${worstAt}); days over 60 %: ${over}`)

say(doubles === 0, `no missing-part item on those days is a double (the shown part = the answer, so copying it passes): ${doubles} of ${mpItems}`)

console.log('\ntruth rows — balanced and shuffled')
{
  const unbalanced = truthParts.filter((p) => p.rows.filter(Boolean).length * 2 !== p.rows.length).length
  const trueFirst = truthParts.filter((p) => p.rows[0]).length
  const pat = new Map<string, number>()
  for (const p of truthParts) { const k = p.rows.map((x) => (x ? 'T' : 'F')).join(''); pat.set(k, (pat.get(k) ?? 0) + 1) }
  const top = Math.max(...pat.values())
  say(unbalanced === 0, `${truthParts.length} truth items on those days: every one has as many true rows as false — off ${unbalanced}`)
  say(trueFirst / truthParts.length <= 0.6, `true-first on ${(100 * trueFirst / truthParts.length).toFixed(0)} % of items (≤ 60 %)`)
  say(top / truthParts.length <= 0.4, `the commonest row pattern holds ${(100 * top / truthParts.length).toFixed(0)} % of items (≤ 40 %; ${pat.size} patterns)`)
}

console.log('\nbroken controls — each must fire')
say(overCtl > 0, `control fired: the same days without the alternation break the line on ${overCtl} of ${days} days (max ${(100 * worstCtl).toFixed(0)} %)`)
{
  const broken = truthParts.map((p) => ({ rows: [...p.rows].sort((x, y) => Number(y) - Number(x)) }))
  const tf = broken.filter((p) => p.rows[0]).length / broken.length
  say(tf > 0.6, `control fired: rows always true-first give true-first on ${(100 * tf).toFixed(0)} % (> 60 % fails)`)
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-blind-habit-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
