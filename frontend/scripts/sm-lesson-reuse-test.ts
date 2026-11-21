/**
 * sm-lesson-reuse-test (Grade 1 mode) — an answer remembered from the lesson is not evidence
 * (CURRICULUM-MAP §7 rule 12; EXEMPLAR-G1-U02 §1; ENGINE-SPEC §6.8).
 *
 * Run (from frontend/): npx tsx scripts/sm-lesson-reuse-test.ts
 *
 * Over every entry-check, chapter-check (form A and a re-sit) and placement item at 200 seeds:
 *   fact  no item uses a lesson demo's fact (the same whole with the same two parts; EXEMPLAR
 *         §1 asks "the same three numbers in the same structure" — the gate is stricter and
 *         counts either order of the parts);
 *   key   no check key is a number given in or worked out by a lesson demo of the unit —
 *         except, in Grade 1 mode, one-digit numbers and the Grade 1 facts within 20, which
 *         recur by design (rule 12's exemption). Within 10 every G1-U02 key is exempt; the
 *         gate counts them and runs the key path on a fixture so it is proven.
 * Controls: a check item copying a demo fact; a check key equal to a lesson's worked answer
 * (a fixture demo whose worked answer is outside the exemption).
 */
import { G1_U02, demoFacts } from '../src/modules/school-math/curriculum/grade1'
import { chapterCheck, entryCheck, placementPair } from '../src/modules/school-math/engine/assemble'
import { buildItem } from '../src/modules/school-math/engine/registry'
import { sameFact } from '../src/modules/school-math/engine/lib/item'
import type { SMDemo, SMItem } from '../src/modules/school-math/types'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

/** Grade 1 mode: one-digit numbers and facts within 20 recur by design. */
const exempt = (n: number, grade: number) => grade === 1 && n <= 20

function keysOf(it: SMItem): number[] {
  const out: number[] = []
  for (const p of it.parts) {
    const a = p.answer
    if (a.kind === 'number') out.push(a.value)
    if (a.kind === 'bond-parts') { if (typeof a.whole === 'number' && a.asked.includes('whole')) out.push(a.whole); if (a.asked.includes('part') && a.parts) for (const x of a.parts) if (typeof x === 'number' && !it.givens.includes(x)) out.push(x) }
    if (a.kind === 'choice-key' && p.surface.kind === 'choices') {
      const key = a.key
      const c = p.surface.choices.find((x) => x.key === key)
      if (c?.content.kind === 'number') out.push(c.content.value)
    }
  }
  return out
}

export function reuseProblems(items: Array<{ form: string; item: SMItem }>, demos: SMDemo[], grade = 1): { problems: string[]; keys: number; exemptKeys: number } {
  const facts = demos.flatMap((d) => d.facts)
  const demoNumbers = new Set(facts.flatMap((f) => [f.whole, ...f.parts]))
  const problems: string[] = []
  let keys = 0, exemptKeys = 0
  for (const { form, item } of items) {
    if (item.fact && facts.some((f) => sameFact(f, item.fact!))) problems.push(`${form} ${item.templateId}: uses the demo fact ${item.fact.whole} = ${item.fact.parts.join(' + ')}`)
    for (const k of keysOf(item)) {
      keys++
      if (exempt(k, grade)) { exemptKeys++; continue }
      if (demoNumbers.has(k)) problems.push(`${form} ${item.templateId}: key ${k} is a lesson demo's number`)
    }
  }
  return { problems, keys, exemptKeys }
}

console.log('\nentry check, chapter check (form A and a re-sit), placement pair — 200 seeds')
const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
const demos = G1_U02.lessonExampleNumbers
{
  const items: Array<{ form: string; item: SMItem }> = []
  for (const seed of SEEDS) {
    for (const p of entryCheck(G1_U02, seed).pairs) for (const it of p.items) items.push({ form: 'entry', item: it })
    const a = chapterCheck(G1_U02, seed)
    for (const r of a.rows) items.push({ form: `check ${r.section}`, item: r.item })
    for (const r of chapterCheck(G1_U02, seed, [a]).rows) items.push({ form: `re-sit ${r.section}`, item: r.item })
    for (const it of placementPair(G1_U02, seed).items) items.push({ form: 'placement', item: it })
  }
  const r = reuseProblems(items, demos)
  console.log(`    demo facts: ${demoFacts(G1_U02).map((f) => `${f.whole} = ${f.parts.join(' + ')}`).join(' · ')}`)
  say(r.problems.length === 0, `${items.length} items: no demo fact; keys ${r.keys} (${r.exemptKeys} exempt in Grade 1 mode, ≤ 20) — problems ${r.problems.length}${r.problems.length ? ': ' + r.problems.slice(0, 3).join('; ') : ''}`)
}

console.log('\nbroken controls — each must fire')
{
  const copy = buildItem('sm.g1u02.l3.add_pad', { seed: 3, role: 'check', force: { a: 3, b: 4 } })
  const r1 = reuseProblems([{ form: 'check B5a', item: copy }], demos)
  say(r1.problems.some((p) => /demo fact/.test(p)), 'control fired: a check item copying the L3 demo fact 7 = 3 + 4')
  // a fixture demo whose worked answer (34) is outside the Grade 1 exemption, and a check key equal to it
  const fixtureDemos: SMDemo[] = [{ lessonId: 'FIXTURE-L1', says: 'fixture', facts: [{ whole: 34, parts: [20, 14] }] }]
  const k34: SMItem = JSON.parse(JSON.stringify(buildItem('sm.g1u02.l3.add_pad', { seed: 3, role: 'check' })))
  if (k34.parts[0].answer.kind === 'number') k34.parts[0].answer.value = 34
  const r2 = reuseProblems([{ form: 'check', item: k34 }], fixtureDemos)
  say(r2.problems.some((p) => /key 34/.test(p)), 'control fired: a check key equal to a lesson\'s worked answer (fixture demo, 34)')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-lesson-reuse-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
