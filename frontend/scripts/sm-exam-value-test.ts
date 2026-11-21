/**
 * sm-exam-value-test — no number from the first learner's school test on any surface
 * (ENGINE-SPEC §6.1; BUILD-PLAN §8.2; EXAM-COVERAGE §4; LEARNINGS S3, S4).
 *
 * Run (from frontend/): npx tsx scripts/sm-exam-value-test.ts
 *
 * The list is READ AT RUN TIME from modules/school-math/research/phase0/EXAM-READING.md:
 * the section "Exam values for the no-exam-items gate" (every operand, key and printed
 * choice) plus the written answers in that file's reading table. It is never copied into
 * code, content or fixtures, and this gate never prints a value: only counts and positions.
 *
 *   Tier 1  every three-digit value on the list (round hundreds excepted) never appears on
 *           any surface: not an operand, key, choice, pool value, teacher line, ladder rung,
 *           spoken line or figure label.
 *   Tier 2  every value on the list is never an operand, a key or a printed choice on the
 *           surfaces of the ENABLEMENT LIST below (explicit, printed, L50). No Grade 1 surface
 *           is on it, honestly, so Grade 1 is checked at tier 1 only.
 * Broken controls (BUILD-PLAN §7 stage 1): a tier-1 fixture built at run time from the list
 * (an item whose second addend is the test's Q4 second addend) must fail; a tier-2 fixture
 * whose lesson id is on the enablement list, carrying a tier-2 value as its key, must fail;
 * an enablement entry with an unknown surface id must be REPORTED, not skipped.
 */
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { buildItem } from '../src/modules/school-math/engine/registry'
import type { SMItem } from '../src/modules/school-math/types'
import { FIXED_LINES, generatedCorpus, itemNumbers } from './sm-lib-corpus'
import { numbersIn } from '../src/modules/school-math/engine/lib/text'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../modules/school-math')
let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

// ---------------------------------------------------------------------------
// the list, read at run time (values stay in memory; never printed)
// ---------------------------------------------------------------------------

interface ExamList { all: Set<number>; tier1: Set<number>; q4SecondAddend: number | null; lines: number; answers: number }

function readExamList(): ExamList {
  const md = readFileSync(resolve(ROOT, 'research/phase0/EXAM-READING.md'), 'utf8')
  const lines = md.split('\n')
  const start = lines.findIndex((l) => /^## Exam values for the no-exam-items gate/.test(l))
  if (start < 0) throw new Error('EXAM-READING.md has no "Exam values for the no-exam-items gate" section')
  const section: string[] = []
  for (let i = start + 1; i < lines.length && !/^## /.test(lines[i]); i++) section.push(lines[i])
  const all = new Set<number>()
  // a digit next to a box (a digit-box item) is not a value; the question label is not a value
  const clean = (s: string) => s.replace(/\S*□\S*/g, ' ').replace(/\bQ\d+[a-z]?\b/g, ' ')
  let q4: number | null = null
  const qLines = section.filter((l) => /^- Q\d/.test(l))
  for (const l of qLines) {
    for (const n of numbersIn(clean(l))) all.add(n)
    const m = /^- Q4:\s*(\d+)\s*\+\s*(\d+)\s*=/.exec(l)
    if (m) q4 = Number(m[2])
  }
  // the written answers in the reading table (its "His answer" column)
  const tStart = lines.findIndex((l) => /^## Reading table/.test(l))
  let answers = 0
  if (tStart >= 0) {
    const header = lines.slice(tStart + 1).find((l) => l.startsWith('| #'))
    const col = header ? header.split('|').map((c) => c.trim()).findIndex((c) => /^His answer/.test(c)) : -1
    for (let i = tStart + 1; i < lines.length && !/^## /.test(lines[i]); i++) {
      const cells = lines[i].split('|').map((c) => c.trim())
      if (col < 0 || !/^\d/.test(cells[1] ?? '')) continue
      for (const n of numbersIn(clean(cells[col] ?? ''))) { all.add(n); answers++ }
    }
  }
  const tier1 = new Set([...all].filter((n) => n >= 100 && n <= 999 && n % 100 !== 0))
  return { all, tier1, q4SecondAddend: q4, lines: qLines.length, answers }
}

// ---------------------------------------------------------------------------
// the enablement list (EXAM-COVERAGE §4; explicit, L50)
// ---------------------------------------------------------------------------

export const ENABLEMENT: readonly string[] = [
  // (1) exam-skill lessons
  'G2-U02-L1', 'G2-U02-L3', 'G2-U02-L4', 'G2-U02-L5', 'G2-U02-L6',
  'G2-U03-L1', 'G2-U03-L2', 'G2-U03-L3', 'G2-U03-L4', 'G2-U03-L5', 'G2-U03-L6',
  'G2-U06-L1', 'G2-U06-L2', 'G2-U06-L3', 'G2-U06-L4', 'G2-U07-S1',
  // (2) "also practised in"
  'G2-U04-L1', 'G2-U04-L2', 'G2-U04-L3', 'G2-U04-L5', 'G2-U04-L6', 'G2-U05-L3', 'G2-U05-L5', 'G2-U07-L4', 'G2-U13-L5', 'G4-U03-L4',
  // (3)–(7) the probe, the chapter checks, the mock, the 2-day review, exam-skill returns and comebacks
  'probe:G2', 'G2-U02-CK', 'G2-U05-CK', 'G4-U03-CK:A3', 'G4-U03-CK:B6', 'mock:G2', 'review-2day:G2-U01',
  'returns:exam-skills', 'comebacks:exam-skills',
  // TEST-PREP-SPEC §7: every test-prep item and mock
  'test-prep:items', 'test-prep:mock',
]

const NAMED = new Set(['probe:G2', 'mock:G2', 'review-2day:G2-U01', 'returns:exam-skills', 'comebacks:exam-skills', 'test-prep:items', 'test-prep:mock'])

/** Report every entry that does not name a real surface (never skipped silently). */
export function unknownEntries(list: readonly string[]): string[] {
  const grades = new Map<number, string>()
  const gradeText = (g: number) => {
    if (!grades.has(g)) { try { grades.set(g, readFileSync(resolve(ROOT, `design/curriculum/GRADE-${g}.md`), 'utf8')) } catch { grades.set(g, '') } }
    return grades.get(g)!
  }
  const lessonCount = (unit: string) => {
    const g = Number(unit[1])
    const row = gradeText(g).split('\n').find((l) => l.startsWith(`| ${unit} |`))
    if (!row) return -1
    const m = /^(\d+)/.exec(row.split('|').map((c) => c.trim())[5] ?? '')
    return m ? Number(m[1]) : -1
  }
  const out: string[] = []
  for (const e of list) {
    if (NAMED.has(e)) continue
    let m = /^(G[1-5]-U\d{2})-L(\d+)$/.exec(e)
    if (m) { const n = lessonCount(m[1]); if (n < 0 || Number(m[2]) > n) out.push(e); continue }
    m = /^(G[1-5]-U\d{2})-S\d+$/.exec(e)
    if (m) { if (!gradeText(Number(e[1])).includes(e)) out.push(e); continue }
    m = /^(G[1-5]-U\d{2})-CK(:[A-C]\d+[ab]?)?$/.exec(e)
    if (m) { if (lessonCount(m[1]) < 0) out.push(e); continue }
    out.push(e)
  }
  return out
}

const enabled = (it: SMItem, surface: string) => ENABLEMENT.includes(it.lessonId) || ENABLEMENT.includes(surface)

/** Hits: tier 1 anywhere; tier 2 as an operand, key or printed choice on an enabled surface. */
export function scan(items: Array<{ surface: string; item: SMItem }>, list: ExamList): { tier1: string[]; tier2: string[]; numbers: number; tier2Items: number } {
  const tier1: string[] = [], tier2: string[] = []
  let numbers = 0, tier2Items = 0
  for (const { surface, item } of items) {
    const nums = itemNumbers(item)
    numbers += nums.length
    for (const n of nums) if (list.tier1.has(n.value)) tier1.push(`${surface} ${item.id} ${n.path}`)
    if (enabled(item, surface)) {
      tier2Items++
      for (const n of nums) {
        const printed = /^givens|^params|\.key|\.choices|^figures/.test(n.path)
        if (printed && list.all.has(n.value)) tier2.push(`${surface} ${item.id} ${n.path}`)
      }
    }
  }
  return { tier1, tier2, numbers, tier2Items }
}

// ---------------------------------------------------------------------------
const list = readExamList()
console.log(`\nthe list (read at run time; values never printed): ${list.lines} question lines, ${list.answers} written-answer numbers → ${list.all.size} distinct values, ${list.tier1.size} at tier 1`)
say(list.all.size > 0 && list.tier1.size > 0 && list.q4SecondAddend !== null, 'the list was found and parsed (tier-1 values present; the Q4 line located)')

console.log('\nthe enablement list it enforced (tier 2):')
for (const e of ENABLEMENT) console.log(`    ${e}`)
const unknown = unknownEntries(ENABLEMENT)
say(unknown.length === 0, `every enablement entry names a real surface — unknown: ${unknown.length ? unknown.join(', ') : 'none'}`)
console.log('    Grade 1 surfaces on it: none (no Grade 1 lesson is an exam-skill lesson); Grade 1 is checked at tier 1 only')

console.log('\nevery Grade 1 surface — 200 seeds; 40 simulated units')
const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
const corpus = generatedCorpus(SEEDS, SEEDS.slice(0, 40))
const res = scan(corpus, list)
const fixedHits = FIXED_LINES.filter((l) => numbersIn(l.text).some((n) => list.tier1.has(n))).length
const bySurface = new Map<string, number>()
for (const c of corpus) bySurface.set(c.surface, (bySurface.get(c.surface) ?? 0) + 1)
console.log(`    items by surface: ${[...bySurface.entries()].map(([k, v]) => `${k} ${v}`).join(' · ')}`)
say(res.tier1.length === 0 && fixedHits === 0, `tier 1: ${res.numbers} numbers on ${corpus.length} items and ${FIXED_LINES.length} fixed lines — hits ${res.tier1.length + fixedHits}${res.tier1.length ? ' at ' + res.tier1.slice(0, 5).join('; ') : ''}`)
say(res.tier2Items === 0 && res.tier2.length === 0, `tier 2: Grade 1 items on the enablement list ${res.tier2Items} (expected 0), hits ${res.tier2.length}`)

console.log('\nbroken controls — each must fire')
{
  // tier 1: an item whose second addend is the test's Q4 second addend (built from the list, now)
  const base = buildItem('sm.g1u02.l3.add_pad', { seed: 3 })
  const v = list.q4SecondAddend as number
  const fx: SMItem = JSON.parse(JSON.stringify(base))
  fx.generator.params = { ...fx.generator.params, b: v }
  fx.givens = [fx.givens[0], v]
  if (fx.parts[0].surface.kind === 'pad') fx.parts[0].surface.text = `${fx.givens[0]} + ${v} = □`
  const t1 = scan([{ surface: 'fixture', item: fx }], list)
  say(t1.tier1.length > 0, `control fired: a tier-1 fixture (the Q4 second addend as an addend) is caught at ${t1.tier1.length} positions (${[...new Set(t1.tier1.map((h) => h.split(' ').pop()))].join(', ')})`)
  // tier 2: an item on an enabled lesson id carrying a one- or two-digit list value as its key
  const small = [...list.all].filter((n) => n < 100)
  const t2v = small[0]
  const fx2: SMItem = JSON.parse(JSON.stringify(base))
  fx2.lessonId = 'G2-U04-L1'
  if (fx2.parts[0].answer.kind === 'number') fx2.parts[0].answer.value = t2v
  const t2 = scan([{ surface: 'fixture', item: fx2 }], list)
  say(t2.tier2Items === 1 && t2.tier2.some((h) => h.endsWith('.key')), `control fired: a tier-2 fixture on enabled lesson G2-U04-L1 with a list value as its key is caught (${t2.tier2.length} positions; the tier-2 path runs)`)
  // an unknown surface id in the enablement list is reported, not skipped
  const bad = unknownEntries([...ENABLEMENT, 'G2-U99-L1', 'G2-U04-L9', 'mock:G9'])
  say(bad.length === 3, `control fired: unknown enablement entries are reported (${bad.join(', ')})`)
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-exam-value-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
