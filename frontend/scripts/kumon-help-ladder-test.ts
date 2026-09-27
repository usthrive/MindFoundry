/**
 * kumon-help-ladder-test — the help ladder teaches; it never hands over the answer
 * before the table rung.
 *
 * Run (from frontend/): npx tsx scripts/kumon-help-ladder-test.ts
 *
 * WHY (owner, 2026-09-26): "I like the table. It should just not be the only
 * option. There should be a progression of hints that helps him learn." Help on
 * a times-table sheet is now 1 think → 2 use a fact you know → 3 count it → 4 the
 * table (src/components/tables/helpLadder.ts). The ladder is only worth having if
 * the first three rungs make the child do the last step himself, so for every
 * fact 0..12 × 0..12 this asserts:
 *
 *   no-answer   rungs 1–3 never print the product (exempt only when the product
 *               IS one of the fact's own numbers, e.g. 1 × 7 — unavoidable);
 *   true-sums   every "x × y = z", "x + y" doubling and "Double x is y" printed
 *               is arithmetically true;
 *   count       rung 3 shows at most three multiples, all correct, never the last;
 *   short       every sentence ≤ 14 words (a seven-year-old reads it, or hears it);
 *   sources     StudyPage offers the table's own button only on the ordered
 *               sheets (where the table IS the lesson) or when no fact is asked,
 *               opens the ladder through `openHelpRung`, records the rung on both
 *               paths, and opens the table at rung 4.
 *
 * Each check runs on the real ladder and on a deliberately broken control.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { helpLadderFor, type HelpLadderContent, type LadderFact } from '../src/components/tables/helpLadder'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => {
  checks++
  if (!ok) failures++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`)
}

type Gen = (f: LadderFact) => HelpLadderContent
const FACTS: LadderFact[] = []
for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) FACTS.push({ a, b })

const numbersIn = (t: string) => (t.match(/\d+/g) ?? []).map(Number)
const sentences = (t: string) => t.split(/(?<=[.!?…:])\s+/).filter((x) => x.trim())
const wordCount = (s: string) => (s.match(/[A-Za-z]+|\d+/g) ?? []).length

function findings(gen: Gen): string[] {
  const out: string[] = []
  for (const f of FACTS) {
    const c = gen(f)
    const product = f.a * f.b
    const exempt = product === f.a || product === f.b
    const rungs: Array<[string, string]> = [['think', c.think], ['route', c.route], ['count', c.count]]
    for (const [name, text] of rungs) {
      if (!text || !text.trim()) { out.push(`${f.a}×${f.b} ${name}: empty`); continue }
      if (!exempt && numbersIn(text).includes(product)) out.push(`${f.a}×${f.b} ${name} states the answer ${product}: "${text}"`)
      for (const m of text.matchAll(/(\d+) × (\d+) = (\d+)/g)) {
        if (Number(m[1]) * Number(m[2]) !== Number(m[3])) out.push(`${f.a}×${f.b} ${name}: false sum "${m[0]}"`)
      }
      for (const m of text.matchAll(/Double (\d+) is (\d+)/g)) {
        if (Number(m[1]) * 2 !== Number(m[2])) out.push(`${f.a}×${f.b} ${name}: false double "${m[0]}"`)
      }
      for (const s of sentences(text)) if (wordCount(s) > 14) out.push(`${f.a}×${f.b} ${name}: ${wordCount(s)}-word sentence "${s}"`)
    }
    // The count rung: correct multiples of the group size, at most three, never the last.
    const m = c.count.match(/:\s*([\d,\s]+)…/)
    if (m) {
      const terms = m[1].split(',').map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x))
      if (terms.length > 3) out.push(`${f.a}×${f.b} count shows ${terms.length} terms`)
      terms.forEach((t, i) => { if (t !== (i + 1) * c.size) out.push(`${f.a}×${f.b} count term ${i + 1} is ${t}, want ${(i + 1) * c.size}`) })
      if (terms.length >= c.groups) out.push(`${f.a}×${f.b} count reaches the last term`)
    }
    if (c.groups * c.size !== product) out.push(`${f.a}×${f.b}: groups × size is ${c.groups}×${c.size}, not the asked fact`)
  }
  return out
}

console.log(`\ncontent — every fact 0..12 × 0..12 (${FACTS.length} facts)`)
const real = findings(helpLadderFor)
say(real.length === 0, `real ladder${real.length ? ': ' + real.slice(0, 4).join(' | ') + (real.length > 4 ? ` … +${real.length - 4}` : '') : ''}`)
{
  const leaky: Gen = (f) => { const c = helpLadderFor(f); return { ...c, route: `${c.route} So ${f.a} × ${f.b} = ${f.a * f.b}.` } }
  const falseSum: Gen = (f) => { const c = helpLadderFor(f); return f.a === 6 && f.b === 7 ? { ...c, route: '5 × 7 = 36. Add one more 7.' } : c }
  const countToEnd: Gen = (f) => {
    const c = helpLadderFor(f)
    const all = Array.from({ length: c.groups }, (_, i) => (i + 1) * c.size)
    return c.groups > 1 ? { ...c, count: `Count by ${c.size}s: ${all.join(', ')}… Count ${c.groups} numbers.` } : c
  }
  const wordy: Gen = (f) => { const c = helpLadderFor(f); return { ...c, think: `${c.think} It is a very long sentence that keeps going on and on for a young reader.` } }
  say(findings(leaky).length > 0, 'control fires: a route that finishes with the answer')
  say(findings(falseSum).length > 0, 'control fires: a route with a false sum (5 × 7 = 36)')
  say(findings(countToEnd).length > 0, 'control fires: a count rung that counts all the way to the answer')
  say(findings(wordy).length > 0, 'control fires: a sentence too long for a seven-year-old')
}

// Spot-check the teaching itself on the facts he struggled with (×6..×9).
console.log('\nsample rungs')
for (const f of [{ a: 6, b: 7 }, { a: 9, b: 8 }, { a: 7, b: 4 }, { a: 8, b: 6 }]) {
  const c = helpLadderFor(f)
  console.log(`  ${f.a} × ${f.b}:  ${c.think}  |  ${c.route}  |  ${c.count}`)
}

// ---------------------------------------------------------------------------
console.log('\nsources — StudyPage wires the ladder and keeps the table as its last rung')
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')
const study = fs.readFileSync(path.join(SRC, 'pages/StudyPage.tsx'), 'utf8')

function sourceFindings(src: string): string[] {
  const out: string[] = []
  if (!/tableSupport && \(tableSupport\.support === 'open' \|\| !askedFact\) && \(/.test(src)) {
    out.push("the table's own button is offered on every sheet — the ladder is bypassed")
  }
  if (!/<HelpLadder[\s\S]{0,400}onClimb=\{openHelpRung\}/.test(src)) out.push('the ladder is not rendered through openHelpRung')
  const fn = src.match(/const openHelpRung = [\s\S]{0,700}?\n  \}/)?.[0] ?? ''
  if (!/markHelpRung\(rung\)/.test(fn)) out.push('openHelpRung does not record the rung on the grid')
  if (!/singleEvidenceRef\.current\.helpRung/.test(fn)) out.push('openHelpRung does not record the rung on the one-problem path')
  if (!/rung === 4\) setShowTable\(true\)/.test(fn)) out.push('rung 4 does not open the table')
  if (!/setHelpRung\(0\)/.test(src)) out.push('the ladder is not reset for a new problem')
  return out
}
const srcReal = sourceFindings(study)
say(srcReal.length === 0, `real StudyPage${srcReal.length ? ': ' + srcReal.join('; ') : ''}`)
{
  const bypass = study.replace("tableSupport && (tableSupport.support === 'open' || !askedFact) && (", 'tableSupport && (')
  say(bypass !== study && sourceFindings(bypass).length > 0, "control fires: the table's button back on every sheet")
  const unrecorded = study.replace('worksheetViewRef.current?.markHelpRung(rung)', '')
  say(unrecorded !== study && sourceFindings(unrecorded).length > 0, 'control fires: a rung opened but never recorded')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
