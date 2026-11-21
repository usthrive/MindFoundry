/**
 * sm-spoken-answer-test — the read-aloud never says what the child is asked to find
 * (ENGINE-SPEC §6.4; L48; extends the idea of bb-spoken-answer-test).
 *
 * Run (from frontend/): npx tsx scripts/sm-spoken-answer-test.ts
 *
 * For every Grade 1 item (200 seeds, every surface, simulated days, fix-it twins, look again),
 * part by part, in reveal order: while part k is open, no line the read-aloud can say — the
 * prompt, every figure's `spoken` and `alt`, the open parts' prompts and sentences, ladder
 * rungs 1–3, the review lines of the open part, the check-screen lines, the review's opening
 * line, the look-again line — contains the value asked in part k or in any part not yet
 * committed (an asked circle, a typed blank, a key choice). Rung 4 shows the answer by design.
 * On error-analysis items, no line said before the fix is committed names the repair: not
 * the right answer, and not the claim rows (they appear only after the fix).
 * Controls: a bond figure whose `spoken` names the missing part; a review line that reads the
 * key of a part he has not re-attempted; an error item whose pre-fix line names the repair.
 */
import { askedNumbers } from '../src/modules/school-math/engine/validator'
import { buildItem } from '../src/modules/school-math/engine/registry'
import { REVIEW_OPENING_LINE } from '../src/modules/school-math/engine/assemble'
import type { SMItem, SMPart } from '../src/modules/school-math/types'
import { FIXED_LINES, generatedCorpus } from './sm-lib-corpus'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const has = (text: string, n: number) => new RegExp(`(?<!\\d)${n}(?!\\d)`).test(text)

/** The values a part asks for that are not printed for the child (a key choice included). */
function askedOf(it: SMItem, p: SMPart): number[] {
  const out = askedNumbers(it, p)
  if (p.answer.kind === 'choice-key' && p.surface.kind === 'choices') {
    const key = p.answer.key
    const c = p.surface.choices.find((x) => x.key === key)
    if (c?.content.kind === 'number' && !it.givens.includes(c.content.value)) out.push(c.content.value)
  }
  return [...new Set(out)]
}

/** Lines the read-aloud can say while part `k` is open (earlier parts committed). */
function linesWhileOpen(it: SMItem, k: number, extra: string[]): Array<{ path: string; text: string }> {
  const out: Array<{ path: string; text: string }> = [{ path: 'prompt', text: it.prompt }]
  it.figures.forEach((f, i) => { out.push({ path: `figures[${i}].spoken`, text: f.spoken }, { path: `figures[${i}].alt`, text: f.alt }) })
  const open = it.parts[k]
  // every part visible now: committed ones, the open one, and later parts revealed with the item
  it.parts.forEach((p, i) => {
    const visible = i <= k || p.reveal === 'with-item'
    if (!visible) return
    if (p.prompt) out.push({ path: `parts[${i}].prompt`, text: p.prompt })
    if (p.surface.kind === 'sentence' && p.surface.input === 'pad') out.push({ path: `parts[${i}].sentence`, text: p.surface.text })
    if (p.surface.kind === 'pad' && p.surface.text) out.push({ path: `parts[${i}].pad`, text: p.surface.text })
    if (p.surface.kind === 'truth' && i <= k) p.surface.rows.forEach((r, j) => out.push({ path: `parts[${i}].rows[${j}]`, text: r.text }))
  })
  open.reviewRules.forEach((r, j) => out.push({ path: `parts[${k}].review[${j}]`, text: r.line }))
  it.ladder.slice(0, 3).forEach((r, i) => out.push({ path: `ladder[${i}]`, text: r.say }))
  extra.forEach((t, i) => out.push({ path: `fixed[${i}]`, text: t }))
  return out
}

export function spokenProblems(it: SMItem, extra: string[] = []): string[] {
  const out: string[] = []
  it.parts.forEach((p, k) => {
    // values still to be found: this part's and every later part's
    const pending = new Set(it.parts.slice(k).flatMap((q) => askedOf(it, q)))
    for (const l of linesWhileOpen(it, k, extra)) for (const n of pending) if (has(l.text, n)) out.push(`part ${p.id} open: ${l.path} says ${n}`)
  })
  // error items: nothing before the fix names the repair
  if (it.templateId.endsWith('error_take_away')) {
    const fix = it.parts[0]
    const k = fix.answer.kind === 'number' ? fix.answer.value : null
    const rows = it.parts.slice(1).flatMap((p) => (p.surface.kind === 'truth' ? p.surface.rows.map((r) => r.text) : []))
    for (const l of linesWhileOpen(it, 0, extra)) {
      // the right answer, unless it is a number printed for him anyway (at w = 2p the answer equals the part taken)
      if (k !== null && !it.givens.includes(k) && has(l.text, k)) out.push(`before the fix: ${l.path} names the right answer`)
      for (const r of rows) if (l.text.includes(r)) out.push(`before the fix: ${l.path} reads a claim row`)
      if (/should be|right answer is|it is \d/i.test(l.text)) out.push(`before the fix: ${l.path} states the repair`)
    }
  }
  return out
}

// ---------------------------------------------------------------------------
console.log('\nevery Grade 1 item, part by part, with the check-screen, review and look-again lines')
const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
const corpus = generatedCorpus(SEEDS, SEEDS.slice(0, 40))
const extra = FIXED_LINES.map((l) => l.text)
{
  const bySurface = new Map<string, { n: number; bad: number; first: string }>()
  for (const { surface, item } of corpus) {
    const e = bySurface.get(surface) ?? { n: 0, bad: 0, first: '' }
    e.n++
    const p = spokenProblems(item, extra)
    if (p.length) { e.bad++; if (!e.first) e.first = `${item.id}: ${p[0]}` }
    bySurface.set(surface, e)
  }
  for (const [s, e] of bySurface) say(e.bad === 0, `${s.padEnd(13)} ${String(e.n).padStart(6)} items — off ${e.bad}${e.first ? ' — ' + e.first : ''}`)
  const errors = corpus.filter((c) => c.item.templateId.endsWith('error_take_away')).length
  console.log(`    error-analysis items checked for a pre-fix repair: ${errors}`)
}

console.log('\nbroken controls — each must fire')
{
  // a bond figure whose spoken names the missing part
  const a = buildItem('sm.g1u02.l4.empty_part_bond', { seed: 3 })
  const k = Number(a.generator.params.w) - Number(a.generator.params.p)
  const fa: SMItem = { ...a, figures: a.figures.map((f) => ({ ...f, spoken: `a number bond; the missing part is ${k}` })) }
  say(spokenProblems(fa, extra).some((p) => /figures\[0\]\.spoken/.test(p)), 'control fired: a bond figure whose spoken names the missing part')
  // a review line that reads the key of a part he has not re-attempted (the sentence part after the bond)
  const b = buildItem('sm.g1u02.l4.empty_part_bond', { seed: 3 })
  const kb = Number(b.generator.params.w) - Number(b.generator.params.p)
  const fb: SMItem = JSON.parse(JSON.stringify(b))
  fb.parts[0].reviewRules = [...fb.parts[0].reviewRules, { rule: 'bond.repeat-shown', value: -1, line: `${REVIEW_OPENING_LINE} The sentence needs ${kb}.` }]
  say(spokenProblems(fb, extra).some((p) => /review/.test(p)), 'control fired: a review line that reads the key of a part not yet re-attempted')
  // an error item whose pre-fix line names the repair
  const c = buildItem('sm.g1u02.l4.error_take_away', { seed: 3 })
  const ck = c.parts[0].answer.kind === 'number' ? c.parts[0].answer.value : -1
  const fc: SMItem = JSON.parse(JSON.stringify(c))
  fc.parts[0].prompt = `Fix it. It should be ${ck}.`
  say(spokenProblems(fc, extra).some((p) => /before the fix/.test(p)), 'control fired: an error item whose pre-fix line names the repair')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-spoken-answer-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
