/**
 * sm-ledgers-test — the coverage ledger, the prior-unit ledger and the method ledger
 * (ENGINE-SPEC §5.4–§5.5, §6.7; EXEMPLAR-G1-U02 §9; CURRICULUM-MAP §7 rule 8).
 *
 * Run (from frontend/): npx tsx scripts/sm-ledgers-test.ts
 *
 *   coverage    GRADE-1.md's U02 lesson table, "Item types" column, parsed at run time: every
 *               item type is served by templates of that lesson (registered, served there) or
 *               carries a reasoned deferral; debt = item types with neither, a ratchet at 0.
 *   prior-unit  every template uses only skills of its own unit or earlier units (the U04
 *               preview's own skill is its unit's).
 *   method      METHOD-LEDGER.md parsed at run time: every G1-U02 skill another module
 *               touches maps to rows that exist and carry a link sentence; any item that
 *               speaks a link sentence speaks exactly its row's sentence. Run 1 and run 2
 *               emit no link sentence (decision T-6: said only when the child is enrolled,
 *               read at day start in stage 5), so the gate checks the mapping and the rows,
 *               and proves the sentence check on a fixture.
 * Controls: a lesson item type with no template and no deferral; a ledger row removed; a
 * link sentence that differs from its row; a template that uses a later unit's skill.
 */
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { G1U02_COVERAGE, G1U02_METHOD_LINKS, COVERAGE_DEBT_BASELINE, type CoverageRow } from '../src/modules/school-math/curriculum/ledgers'
import { G1_U02 } from '../src/modules/school-math/curriculum/grade1'
import { allSMTemplates, buildItem, getSMTemplate } from '../src/modules/school-math/engine/registry'
import type { SMItem, SMTemplateDef } from '../src/modules/school-math/types'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../modules/school-math/design/curriculum')
let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

// ---------------------------------------------------------------------------
// coverage
// ---------------------------------------------------------------------------

/** GRADE-1's U02 lesson table → lesson id → item-type tokens. */
export function parseItemTypes(md: string, unit = 'G1-U02'): Map<string, string[]> {
  const lines = md.split('\n')
  const start = lines.findIndex((l) => l.startsWith(`### ${unit} `))
  const out = new Map<string, string[]>()
  if (start < 0) return out
  const header = lines.slice(start).find((l) => l.startsWith('| Lesson'))!
  const col = header.split('|').map((c) => c.trim()).findIndex((c) => c === 'Item types')
  for (let i = start + 1; i < lines.length && !lines[i].startsWith('### '); i++) {
    const cells = lines[i].split('|').map((c) => c.trim())
    const m = /^L(\d+)$/.exec(cells[1] ?? '')
    if (!m) continue
    // evidence and notes in brackets are not item types: "T17 (picture-supported, E258)" is T17
    const toks = (cells[col] ?? '').replace(/\([^)]*\)/g, '').split(/[;,]/).map((t) => t.replace(/`/g, '').trim()).map((t) => /^([A-Z]+-?[A-Z]?\d+|truth)\b/.exec(t)?.[1]).filter((t): t is string => !!t)
    out.set(`${unit}-L${m[1]}`, toks)
  }
  return out
}

export function coverageDebt(types: Map<string, string[]>, ledger: CoverageRow[]): { debt: string[]; problems: string[] } {
  const debt: string[] = [], problems: string[] = []
  for (const [lessonId, toks] of types) {
    const row = ledger.find((r) => r.lessonId === lessonId)
    const lesson = G1_U02.lessons.find((l) => l.id === lessonId)
    for (const t of toks) {
      const by = row?.servedBy[t]
      if (by && by.length) {
        for (const id of by) {
          const d = getSMTemplate(id)
          if (!d) problems.push(`${lessonId} ${t}: template ${id} is not registered`)
          else if (!lesson?.templates.includes(id) && !lesson?.cpaSteps.includes(id)) problems.push(`${lessonId} ${t}: ${id} is not served in that lesson`)
        }
      } else if (!row?.deferred[t]) debt.push(`${lessonId} ${t}`)
    }
  }
  return { debt, problems }
}

console.log('\ncoverage ledger — GRADE-1 U02 "Item types" (read now) → templates')
const grade1 = readFileSync(resolve(ROOT, 'GRADE-1.md'), 'utf8')
const types = parseItemTypes(grade1)
{
  for (const [l, t] of types) console.log(`    ${l}: ${t.join(', ')}  →  ${t.map((x) => (G1U02_COVERAGE.find((r) => r.lessonId === l)?.servedBy[x] ?? ['—']).map((s) => s.replace('sm.g1u02.', '')).join(' + ')).join(' | ')}`)
  const { debt, problems } = coverageDebt(types, G1U02_COVERAGE)
  say(types.size === 6, `six U02 lessons parsed from GRADE-1.md (${types.size})`)
  say(debt.length <= COVERAGE_DEBT_BASELINE && problems.length === 0, `coverage debt ${debt.length} (ratchet ${COVERAGE_DEBT_BASELINE})${debt.length ? ': ' + debt.join(', ') : ''}; ledger problems ${problems.length}${problems.length ? ': ' + problems.join('; ') : ''}`)
  const unused = G1_U02.lessons.flatMap((l) => l.templates).filter((t) => !G1U02_COVERAGE.some((r) => Object.values(r.servedBy).some((v) => v.includes(t))))
  console.log(`    templates serving no listed item type (extra practice forms, allowed): ${unused.map((s) => s.replace('sm.g1u02.', '')).join(', ') || 'none'}`)
}

// ---------------------------------------------------------------------------
// prior-unit
// ---------------------------------------------------------------------------

const unitOf = (skill: string) => skill.slice(0, 6)
export function priorUnitProblems(defs: SMTemplateDef[], items: SMItem[] = []): string[] {
  const out: string[] = []
  for (const d of defs) for (const s of d.skillIds) if (unitOf(s) > d.unitId) out.push(`${d.id} (${d.unitId}) uses ${s}, a later unit's skill`)
  for (const it of items) for (const s of [...it.skillIds, ...it.parts.flatMap((p) => p.skillIds)]) if (unitOf(s) > it.unitId) out.push(`${it.id} uses ${s}`)
  return out
}
console.log('\nprior-unit ledger — templates use only skills of their unit or earlier')
{
  const items = allSMTemplates().flatMap((d) => [3, 16, 29].map((seed) => buildItem(d.id, { seed })))
  const p = priorUnitProblems(allSMTemplates(), items)
  say(p.length === 0, `${allSMTemplates().length} templates, ${items.length} items — problems ${p.length}${p.length ? ': ' + p.slice(0, 3).join('; ') : ''}`)
}

// ---------------------------------------------------------------------------
// method ledger
// ---------------------------------------------------------------------------

export function parseMethodLedger(md: string): Map<string, string> {
  const rows = new Map<string, string>()
  for (const l of md.split('\n')) {
    const cells = l.split('|').map((c) => c.trim())
    if (!/^[A-G]\d+$/.test(cells[1] ?? '')) continue
    const link = cells[cells.length - 2] ?? ''
    rows.set(cells[1], link.replace(/^"|"$/g, ''))
  }
  return rows
}

export function methodProblems(rows: Map<string, string>, links: Record<string, string[]>, items: SMItem[]): string[] {
  const out: string[] = []
  for (const [skill, ids] of Object.entries(links)) {
    if (!G1_U02.skills.some((s) => s.id === skill)) out.push(`${skill} is not a G1-U02 skill`)
    for (const id of ids) {
      if (!rows.has(id)) out.push(`${skill} → ${id}: no such METHOD-LEDGER row`)
      else if (!rows.get(id)) out.push(`${skill} → ${id}: the row has no link sentence`)
    }
  }
  for (const it of items) {
    if (!it.methodLink) continue
    const want = rows.get(it.methodLink.row)
    if (want === undefined) out.push(`${it.id} speaks a link for unknown row ${it.methodLink.row}`)
    else if (it.methodLink.sentence !== want) out.push(`${it.id} speaks a link sentence that differs from row ${it.methodLink.row}`)
    if (!it.skillIds.some((s) => (links[s] ?? []).includes(it.methodLink!.row))) out.push(`${it.id} links row ${it.methodLink.row}, which none of its skills map to`)
  }
  return out
}

console.log('\nmethod ledger — METHOD-LEDGER.md (read now) rows for the skills other modules touch')
const ledgerMd = readFileSync(resolve(ROOT, 'METHOD-LEDGER.md'), 'utf8')
const rows = parseMethodLedger(ledgerMd)
const sampleItems = allSMTemplates().flatMap((d) => [3, 16].map((seed) => buildItem(d.id, { seed })))
{
  for (const [s, ids] of Object.entries(G1U02_METHOD_LINKS)) console.log(`    ${s} → ${ids.join(', ')}`)
  const p = methodProblems(rows, G1U02_METHOD_LINKS, sampleItems)
  const speaking = sampleItems.filter((i) => i.methodLink).length
  say(rows.size > 0 && p.length === 0, `${rows.size} ledger rows parsed; every mapped row exists with a link sentence — problems ${p.length}${p.length ? ': ' + p.join('; ') : ''}`)
  console.log(`    items that speak a link sentence now: ${speaking} (T-6: said only when enrolled; the enrollment read is stage 5)`)
}

// ---------------------------------------------------------------------------
console.log('\nbroken controls — each must fire')
{
  const withExtra = new Map(types)
  withExtra.set('G1-U02-L3', [...(types.get('G1-U02-L3') ?? []), 'T99'])
  say(coverageDebt(withExtra, G1U02_COVERAGE).debt.includes('G1-U02-L3 T99'), 'control fired: a lesson item type with no template and no deferral is debt')
  const removed = G1U02_COVERAGE.filter((r) => r.lessonId !== 'G1-U02-L4')
  say(coverageDebt(types, removed).debt.length > 0, 'control fired: a coverage row removed leaves its item types as debt')
  const lessRows = new Map(rows); lessRows.delete('B2')
  say(methodProblems(lessRows, G1U02_METHOD_LINKS, []).some((p) => /B2/.test(p)), 'control fired: a METHOD-LEDGER row removed (B2) fails')
  const fx: SMItem = { ...buildItem('sm.g1u02.l3.add_pad', { seed: 3 }), methodLink: { row: 'B1', sentence: 'You know this from another place.' } }
  say(methodProblems(rows, G1U02_METHOD_LINKS, [fx]).some((p) => /differs/.test(p)), 'control fired: a link sentence that differs from its row fails')
  const good: SMItem = { ...fx, methodLink: { row: 'B1', sentence: rows.get('B1')! } }
  say(methodProblems(rows, G1U02_METHOD_LINKS, [good]).length === 0, 'and the same item speaking its row\'s exact sentence passes')
  const later = { ...getSMTemplate('sm.g1u02.l3.add_pad')!, skillIds: ['G1-U05-K1'] }
  say(priorUnitProblems([later]).length > 0, 'control fired: a G1-U02 template using a G1-U05 skill fails')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-ledgers-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
