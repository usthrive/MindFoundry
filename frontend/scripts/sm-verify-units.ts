/**
 * sm-verify-units — the deterministic gate for the Singapore Method engine (BUILD-PLAN
 * stage 1; ENGINE-SPEC §5.1; EXEMPLAR-G1-U02 §10 item 1).
 *
 * Run (from frontend/): npx tsx scripts/sm-verify-units.ts
 *
 * At 200 seeds (seed = i × 13 + 3) it asserts:
 *   templates   every G1-U02 template and the four outside templates (plus their structural
 *               variants: each box place, each story kind, each sign, the error story form,
 *               the placement part) build with 0 throws and 0 invalid under the validator;
 *   ladders     each template's ladder is the same at every seed;
 *   twins       a W1 fix-it twin (same template, fresh seed) builds, validates, keeps the
 *               structure and changes the numbers;
 *   forms       the entry check, the chapter check (15 points, sections, part points add up)
 *               and the placement pair: 0 invalid, no repeated operand tuple, no demo fact;
 *               a re-sit form is disjoint from form A (QG-4);
 *   measures    over the 200 seeds of each template: numeric rank of the key (no rank > 40 %),
 *               display position of the key (no position > 40 % on four choices, > 60 % on
 *               two), truth rows true-first (≤ 60 %), answer entropy (no constant key);
 *   QG-5 list   the enablement list is printed and every validation kind emitted is on it.
 * Broken controls (each must fire, or the gate is unproven): (a) a corrupted bond-parts
 * key; (b) a pool value whose named rule gives another number; (c) a ladder rung 2 with
 * the key; (d) a numeric pool with every value above the key (rank gate); (e) a check form
 * that reuses a demo fact; and (f) a spoken line with the asked value, (g) a re-sit equal
 * to form A, (h) a validation kind missing from the enablement list, (i) "1 ducks",
 * (j) an 11-word sentence and the word "wrong", (k) an error item whose shown answer two
 * rules make (so the rule could not be named), and (l)–(n) the stage-1 review's controls and
 * (o) a shape hint holding the key (run 2: the shape-hint check, every hinted item at 200 seeds).
 * Prints PASS/FAIL lines; exits non-zero on any failure.
 */
import { allSMTemplates, buildItem } from '../src/modules/school-math/engine/registry'
import {
  validateItem, validateForm, formsDisjoint, enablementLines, QG5_ENABLEMENT, canonAnswer, operandSignature, type SMViolation,
} from '../src/modules/school-math/engine/validator'
import { chapterCheck, entryCheck, placementPair, fixItTwin } from '../src/modules/school-math/engine/assemble'
import { G1_U02, demoFacts } from '../src/modules/school-math/curriculum/grade1'
import { contentCanon, numericRank } from '../src/modules/school-math/engine/lib/choices'
import { ladderFor } from '../src/modules/school-math/engine/lib/ladders'
import { reviewRules } from '../src/modules/school-math/engine/lib/item'
import { sentencesOf } from '../src/modules/school-math/engine/lib/text'
import type { SMItem, SMPart } from '../src/modules/school-math/types'

const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const pct = (n: number, d: number) => (d ? (100 * n) / d : 0)
const fmtDist = (m: Map<string | number, number>, d: number) => [...m.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0]))).map(([k, v]) => `${k}:${pct(v, d).toFixed(0)}%`).join(' ')
const firstViolations = (vs: SMViolation[], n = 3) => vs.slice(0, n).map((v) => `[${v.gate}] ${v.path}: ${v.message}`).join(' | ')

// ---------------------------------------------------------------------------
console.log('\nQG-5 enablement list (L50: every kind emitted must be here; nothing skipped silently)')
for (const l of enablementLines()) console.log(`    ${l}`)

// ---------------------------------------------------------------------------
console.log('\ntemplates — 200 seeds each, every structural variant')
interface Variant { templateId: string; label: string; options?: Record<string, unknown>; partsOnly?: string[]; role?: SMItem['role'] }
const variants: Variant[] = []
for (const d of allSMTemplates()) variants.push({ templateId: d.id, label: d.id })
const extra: Variant[] = [
  ...['1', '2', '3', '4'].map((p) => ({ templateId: 'sm.g1u02.l5.box_any_place', label: `box_any_place place ${p}`, options: { place: p } })),
  { templateId: 'sm.g1u02.l6.which_bond_story', label: 'which_bond_story join', options: { kind: 'join' } },
  { templateId: 'sm.g1u02.l6.which_bond_story', label: 'which_bond_story takeaway', options: { kind: 'takeaway' } },
  { templateId: 'sm.g1u02.l4.sign_decides', label: 'sign_decides +', options: { op: '+' } },
  { templateId: 'sm.g1u02.l4.sign_decides', label: 'sign_decides −', options: { op: '-' } },
  { templateId: 'sm.g1u02.l4.error_take_away', label: 'error_take_away story form (L6)', options: { story: true } },
  { templateId: 'sm.g1u02.l4.empty_part_bond', label: 'empty_part_bond placement part 1', partsOnly: ['p1'], role: 'placement' },
  { templateId: 'sm.g1u02.l4.empty_part_bond', label: 'empty_part_bond asked smaller', options: { asked: 'smaller' } },
  { templateId: 'sm.g1u02.l4.empty_part_bond', label: 'empty_part_bond asked larger', options: { asked: 'larger' } },
  // run 2: the day assembler's blind-habit balance forces the asked part on these too
  ...(['smaller', 'larger'] as const).flatMap((a) => [
    { templateId: 'sm.g1u02.l4.sub_pad', label: `sub_pad asked ${a}`, options: { asked: a } },
    { templateId: 'sm.g1u02.l4.sign_decides', label: `sign_decides − asked ${a}`, options: { op: '-', asked: a } },
    { templateId: 'sm.g1u02.l6.takeaway_story', label: `takeaway_story asked ${a}`, options: { asked: a } },
    ...['1', '2', '3'].map((pl) => ({ templateId: 'sm.g1u02.l5.box_any_place', label: `box_any_place place ${pl} asked ${a}`, options: { place: pl, asked: a } })),
  ]),
  { templateId: 'sm.g1u01.l4.one_more_less', label: 'one_more_less before', options: { dir: 'before' } },
  { templateId: 'sm.g1u01.l4.one_more_less', label: 'one_more_less after', options: { dir: 'after' } },
]
variants.push(...extra)

const population = new Map<string, SMItem[]>()
const kindsEmitted = new Set<string>()
let totalItems = 0, totalThrows = 0, totalInvalid = 0
for (const v of variants) {
  let throws = 0, invalid = 0
  const items: SMItem[] = []
  let firstBad = ''
  for (const seed of SEEDS) {
    let it: SMItem
    try {
      it = buildItem(v.templateId, { seed, options: v.options, partsOnly: v.partsOnly, role: v.role })
    } catch (e) { throws++; if (!firstBad) firstBad = `seed ${seed} threw: ${(e as Error).message}`; continue }
    items.push(it)
    it.parts.forEach((p) => kindsEmitted.add(p.answer.kind))
    const vs = validateItem(it)
    if (vs.length) { invalid++; if (!firstBad) firstBad = `seed ${seed}: ${firstViolations(vs)}` }
  }
  totalItems += items.length; totalThrows += throws; totalInvalid += invalid
  if (v.label === v.templateId) population.set(v.templateId, items)
  say(throws === 0 && invalid === 0, `${v.label.padEnd(42)} built ${String(items.length).padStart(3)}  throws ${throws}  invalid ${invalid}${firstBad ? `  — ${firstBad}` : ''}`)
}
const unlisted = [...kindsEmitted].filter((k) => !QG5_ENABLEMENT[k])
say(unlisted.length === 0, `validation kinds emitted (${[...kindsEmitted].sort().join(', ')}) are all on the enablement list${unlisted.length ? `; missing: ${unlisted.join(', ')}` : ''}`)

// ---------------------------------------------------------------------------
console.log('\nladders — the same at every seed (number-free, role-based)')
{
  const varying: string[] = []
  for (const [id, items] of population) {
    const ls = new Set(items.map((i) => JSON.stringify(i.ladder)))
    if (ls.size !== 1) varying.push(`${id} (${ls.size} ladders)`)
  }
  say(varying.length === 0, `every template's ladder is seed-invariant${varying.length ? ': ' + varying.join(', ') : ''}`)
}

// ---------------------------------------------------------------------------
console.log('\ntwins — W1 fix-it: same template, fresh seed, same structure, new numbers')
{
  const bad: string[] = []
  for (const [id, items] of population) {
    for (const it of items.slice(0, 40)) {
      try {
        const tw = fixItTwin(it, it.generator.seed + 100003)
        const vs = validateItem(tw)
        if (tw.templateId !== id) bad.push(`${id}: twin is ${tw.templateId}`)
        else if (tw.role !== 'review' || !tw.id.includes('-FX-')) bad.push(`${id}: twin role/id not marked review -FX-`)
        else if (operandSignature(tw) === operandSignature(it)) bad.push(`${id}: twin reuses the numbers`)
        else if (JSON.stringify(tw.generator.options) !== JSON.stringify(it.generator.options)) bad.push(`${id}: twin lost the structure options`)
        else if (vs.length) bad.push(`${id}: ${firstViolations(vs, 1)}`)
      } catch (e) { bad.push(`${id}: ${(e as Error).message}`) }
      if (bad.length > 4) break
    }
  }
  say(bad.length === 0, `twins for every template (40 items each)${bad.length ? ': ' + bad.join(' | ') : ''}`)
}

// ---------------------------------------------------------------------------
console.log('\nforms — entry check, chapter check, placement pair (200 seeds each)')
{
  const demo = demoFacts(G1_U02)
  let ecBad = 0, ckBad = 0, plBad = 0, ptsBad = 0, reBad = 0
  let ecFirst = '', ckFirst = '', plFirst = '', reFirst = ''
  for (const seed of SEEDS) {
    try {
      const ec = entryCheck(G1_U02, seed)
      const items = ec.pairs.flatMap((p) => p.items)
      const vs = validateForm(items, 'entry', demo, 'EC')
      const sameStructure = ec.pairs.every((p) => p.items[0].templateId === p.items[1].templateId)
      if (vs.length || ec.pairs.length !== 3 || !sameStructure || items.some((i) => i.role !== 'entry')) { ecBad++; if (!ecFirst) ecFirst = firstViolations(vs) || 'pair shape' }
    } catch (e) { ecBad++; if (!ecFirst) ecFirst = (e as Error).message }
    try {
      const ck = chapterCheck(G1_U02, seed)
      const items = ck.rows.map((r) => r.item)
      const vs = validateForm(items, 'check', demo, 'CK')
      if (vs.length) { ckBad++; if (!ckFirst) ckFirst = firstViolations(vs) }
      const partPts = ck.rows.every((r) => r.item.parts.reduce((s, p) => s + (p.points ?? 0), 0) === r.points)
      const sections = ck.rows.map((r) => r.section).join(',') === 'A1,A2,A3,B4,B5a,B5b,B6,C7'
      const b5b = ck.rows.find((r) => r.section === 'B5b')!.item.generator.params.place === '4'
      if (ck.totalPoints !== 15 || !partPts || !sections || !b5b || items.some((i) => i.role !== 'check')) ptsBad++
      const re = chapterCheck(G1_U02, seed, [ck])
      const dv = [...formsDisjoint(items, re.rows.map((r) => r.item)), ...validateForm(re.rows.map((r) => r.item), 'check', demo, 'CK-B')]
      if (dv.length) { reBad++; if (!reFirst) reFirst = firstViolations(dv) }
    } catch (e) { ckBad++; if (!ckFirst) ckFirst = (e as Error).message }
    try {
      const pl = placementPair(G1_U02, seed)
      const vs = validateForm(pl.items, 'placement', demo, 'PL')
      const typed = pl.items.every((i) => i.parts.length === 1 && i.parts[0].answer.kind === 'bond-parts' && i.role === 'placement')
      if (vs.length || !typed) { plBad++; if (!plFirst) plFirst = firstViolations(vs) || 'not one typed bond part' }
    } catch (e) { plBad++; if (!plFirst) plFirst = (e as Error).message }
  }
  say(ecBad === 0, `entry check G1-U02-EC: 3 pairs, same structure per pair, role entry — invalid ${ecBad}/200${ecFirst ? ' — ' + ecFirst : ''}`)
  say(ckBad === 0, `chapter check G1-U02-CK: 0 invalid, no repeated operand tuple, no demo fact — invalid ${ckBad}/200${ckFirst ? ' — ' + ckFirst : ''}`)
  say(ptsBad === 0, `chapter check: 15 points, sections A1…C7, part points add up per row, B5b is □ − p = k — off ${ptsBad}/200`)
  say(reBad === 0, `chapter check re-sit (form B) disjoint from form A (QG-4) and valid — off ${reBad}/200${reFirst ? ' — ' + reFirst : ''}`)
  say(plBad === 0, `placement pair: two typed bond parts (part 1 only), role placement — invalid ${plBad}/200${plFirst ? ' — ' + plFirst : ''}`)
}

// ---------------------------------------------------------------------------
console.log('\nmeasures — over the 200 seeds of each template')
const choicePart = (it: SMItem): SMPart | undefined => it.parts.find((p) => p.surface.kind === 'choices')

/** Rank gate: the key's numeric rank among the served values; fails when any rank > 40 %. */
export function rankGate(items: SMItem[]): { dist: Map<number, number>; ok: boolean; n: number } {
  const dist = new Map<number, number>()
  for (const it of items) {
    const p = choicePart(it)
    if (!p || p.surface.kind !== 'choices' || p.answer.kind !== 'choice-key') continue
    const key = p.answer.key
    const kc = p.surface.choices.find((c) => c.key === key)!
    if (kc.content.kind !== 'number') continue
    const vals = p.surface.choices.map((c) => (c.content.kind === 'number' ? c.content.value : NaN))
    const r = numericRank(kc.content.value, vals)
    dist.set(r, (dist.get(r) ?? 0) + 1)
  }
  const n = [...dist.values()].reduce((s, x) => s + x, 0)
  return { dist, ok: n > 0 && [...dist.values()].every((x) => pct(x, n) <= 40), n }
}

function positionGate(items: SMItem[]): { dist: Map<string, number>; ok: boolean; n: number; width: number } {
  const dist = new Map<string, number>()
  let width = 0
  for (const it of items) {
    const p = choicePart(it)
    if (!p || p.surface.kind !== 'choices' || p.answer.kind !== 'choice-key') continue
    width = p.surface.choices.length
    dist.set(p.answer.key, (dist.get(p.answer.key) ?? 0) + 1)
  }
  const n = [...dist.values()].reduce((s, x) => s + x, 0)
  const cap = width <= 2 ? 60 : 40
  return { dist, ok: n > 0 && [...dist.values()].every((x) => pct(x, n) <= cap), n, width }
}

function entropyBits(values: string[]): number {
  const m = new Map<string, number>()
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1)
  return [...m.values()].reduce((h, c) => { const p = c / values.length; return h - p * Math.log2(p) }, 0)
}

{
  console.log('  choice-rank gate list (L50: what each choice template is held to)')
  for (const [id, items] of population) {
    const p = items[0] && choicePart(items[0])
    if (!p || p.surface.kind !== 'choices') continue
    const mode = p.surface.numeric ? 'numeric rank + display order'
      : p.surface.pictures ? 'display order only — picture choices have no numeric rank'
      : p.surface.choices.length === 2 ? 'display order only — two rows are places on the screen (≤ 60 %)'
      : 'display order only — non-number choices (pairs, bonds, sentences)'
    console.log(`    ${id.padEnd(40)} ${mode}`)
  }
  for (const [id, items] of population) {
    const p = items[0] && choicePart(items[0])
    if (!p || p.surface.kind !== 'choices') continue
    if (p.surface.numeric) {
      const rg = rankGate(items)
      say(rg.ok, `${id}: numeric rank of the key (0 = smallest) ${fmtDist(rg.dist, rg.n)} (n ${rg.n}; none > 40 %)`)
    }
    const pg = positionGate(items)
    say(pg.ok, `${id}: display position of the key ${fmtDist(pg.dist, pg.n)} (${pg.width} choices; none > ${pg.width <= 2 ? 60 : 40} %)`)
  }
  for (const [id, items] of population) {
    const truthParts = items.flatMap((it) => it.parts.filter((p) => p.surface.kind === 'truth'))
    if (!truthParts.length) continue
    const trueFirst = truthParts.filter((p) => p.surface.kind === 'truth' && p.surface.rows[0].truth).length
    const rows = truthParts.flatMap((p) => (p.surface.kind === 'truth' ? p.surface.rows : []))
    const trues = rows.filter((r) => r.truth).length
    say(pct(trueFirst, truthParts.length) <= 60, `${id}: truth rows true-first ${pct(trueFirst, truthParts.length).toFixed(0)}% (≤ 60 %); rows true ${pct(trues, rows.length).toFixed(0)}%`)
  }
  const flat: string[] = []
  for (const [id, items] of population) {
    const keys = items.map((it) => {
      const p = it.parts.find((q) => q.answer.kind !== 'ack')!
      if (p.answer.kind === 'choice-key') {
        const k = p.answer.key
        const c = p.surface.kind === 'choices' ? p.surface.choices.find((x) => x.key === k) : undefined
        return c ? contentCanon(c.content) : 'none'
      }
      return canonAnswer(p.answer)
    })
    const h = entropyBits(keys)
    const distinct = new Set(keys).size
    if (distinct < 2) flat.push(id)
    console.log(`    ${id.padEnd(40)} answer entropy ${h.toFixed(2)} bits, ${distinct} distinct keys`)
  }
  say(flat.length === 0, `answer entropy: no template has a constant key${flat.length ? ' — constant: ' + flat.join(', ') : ''}`)

  // information lines (the day-level blind-habit gate is run 2's sm-blind-habit-test)
  for (const id of ['sm.g1u02.l4.empty_part_bond', 'sm.g1u02.l4.sub_pad', 'sm.g1u02.l5.box_any_place']) {
    const items = population.get(id)!
    let bigger = 0, n = 0
    for (const it of items) {
      const p = it.generator.params as Record<string, number | string>
      if (id.endsWith('box_any_place') && p.place === '4') continue
      const w = Number(p.w), a = Number(p.a ?? 0)
      let shown: number, key: number
      if (id.endsWith('box_any_place')) {
        const b = w - a
        shown = p.place === '1' ? a : b
        key = p.place === '1' ? b : a
      } else { shown = Number(p.p); key = w - shown }
      n++; if (key > shown) bigger++
    }
    console.log(`    info ${id.padEnd(36)} answer bigger than the shown part: ${pct(bigger, n).toFixed(0)}% of ${n}`)
  }
  const sd = population.get('sm.g1u02.l4.sign_decides')!
  console.log(`    info sm.g1u02.l4.sign_decides               + on ${pct(sd.filter((i) => i.generator.params.op === '+').length, sd.length).toFixed(0)}% of draws`)
}

// ---------------------------------------------------------------------------
console.log('\nshape hints — no hint holds the key, the blank\'s value, or any of the item\'s numbers')
/** Independent of the validator's SM-HINT: every number the item shows or asks. */
function hintProblems(it: SMItem): string[] {
  const out: string[] = []
  for (const p of it.parts) {
    if (p.surface.kind !== 'sentence' || !p.surface.shapeHint) continue
    const own = new Set<number>([...it.givens, ...(it.fact ? [it.fact.whole, ...it.fact.parts] : [])])
    for (const q of it.parts) if (q.answer.kind === 'number') own.add(q.answer.value)
    for (const n of (p.surface.text.match(/\d+/g) ?? []).map(Number)) own.add(n)
    for (const v of Object.values(it.generator.params)) if (typeof v === 'number') own.add(v)
    const shared = (p.surface.shapeHint.match(/\d+/g) ?? []).map(Number).filter((n) => own.has(n))
    if (shared.length) out.push(`${it.id}: hint "${p.surface.shapeHint}" shares ${shared.join(', ')}`)
  }
  return out
}
{
  const hinted: SMItem[] = []
  for (const place of ['1', '2', '3', '4']) for (const seed of SEEDS) hinted.push(buildItem('sm.g1u02.l5.box_any_place', { seed, options: { place } }))
  for (const [, items] of population) for (const it of items) if (it.parts.some((p) => p.surface.kind === 'sentence' && p.surface.shapeHint)) hinted.push(it)
  const probs = hinted.flatMap(hintProblems)
  say(hinted.length > 0 && probs.length === 0, `${hinted.length} items with a shape hint — problems ${probs.length}${probs.length ? ': ' + probs.slice(0, 2).join('; ') : ''}`)
}

// ---------------------------------------------------------------------------
console.log('\nreachable review answers and one-faced truth rows (main session read, 2026-11-21)')
{
  let reviews = 0, rows = 0, enter = 0, twoFace = 0
  for (const [, items] of population) for (const it of items) {
    reviews += it.parts.reduce((t, p) => t + p.reviewRules.length, 0)
    rows += it.parts.reduce((t, p) => t + (p.surface.kind === 'truth' ? p.surface.rows.length : 0), 0)
    const vs = validateItem(it)
    enter += vs.filter((v) => v.gate === 'SM-ENTER').length
    twoFace += vs.filter((v) => v.gate === 'SM-TWOFACE').length
  }
  say(enter === 0, `SM-ENTER: ${reviews} review answers, each enterable on its part (a number on a pad or bond, a split on the counters, a sentence on chips) — off ${enter}`)
  say(twoFace === 0, `SM-TWOFACE: ${rows} truth rows; none claims a role (whole / part) the drawn bond contradicts — off ${twoFace}`)
  const xw = SEEDS.map((seed) => buildItem('sm.g1u02.l4.error_take_away', { seed, options: { rule: 'bond.whole-as-part' } }))
  const balanced = xw.every((it) => { const r = it.parts[1].surface.kind === 'truth' ? it.parts[1].surface.rows : []; return r.length === 6 && r.filter((x) => x.truth).length === 3 && r.some((x) => /^Taking away \d+ leaves \d+\.$/.test(x.text)) })
  say(balanced && xw.every((it) => validateItem(it).length === 0), `error items with X = w (200 seeds): 3 true / 3 false, "Taking away p leaves w." in place of "w is a part", valid`)
}

// ---------------------------------------------------------------------------
console.log('\nchoice items — no rung below 4 places numbers or the "?" for him (Fable gate SM-H10)')
// ring-answer-* (incl. ring-answer-bond) is allowed at rung 4 only; place-whole joined the list in
// the ACCEPT follow-up (l2.which_bond wore bond-build's "the whole goes here")
const PLACING = /^(place-known-numbers|place-whole|fill-.*|show-one-split-.*|ring-answer-.*)$/
/** Rung 2–3 words that ask him to put something on a screen (wrong on a screen of choices). */
const PLACING_WORDS = /\b(fill|place|put|move|drag)\b|goes here/i
/** On an item with a choice part, rungs 1–3 never show a placing action, and rungs 2–3 never tell him to place or fill. */
function placingRungs(it: SMItem): string[] {
  if (!it.parts.some((p) => p.surface.kind === 'choices')) return []
  return it.ladder.slice(0, 3).flatMap((r, i) => [
    ...(PLACING.test(r.show) ? [`${it.templateId} rung ${i + 1} shows ${r.show}`] : []),
    ...(i >= 1 && PLACING_WORDS.test(r.say) ? [`${it.templateId} rung ${i + 1} says "${r.say}"`] : []),
  ])
}
{
  let n = 0
  const bad: string[] = []
  for (const [, items] of population) for (const it of items) { if (it.parts.some((p) => p.surface.kind === 'choices')) n++; bad.push(...placingRungs(it)) }
  for (const kind of ['join', 'takeaway']) for (const seed of SEEDS) bad.push(...placingRungs(buildItem('sm.g1u02.l6.which_bond_story', { seed, options: { kind } })))
  say(bad.length === 0, `${n} choice items (and which_bond_story, both story kinds, 200 seeds each): no placing screen below rung 4, no "place / fill" words at rungs 2–3 — off ${bad.length}${bad.length ? ': ' + [...new Set(bad)].slice(0, 3).join('; ') : ''}`)
  console.log(`    choice templates and their ladders: ${[...population].filter(([, its]) => its[0]?.parts.some((p) => p.surface.kind === 'choices')).map(([id, its]) => `${id.replace(/^sm\.(g1u0\d|preview)\./, '')} (${its[0].ladderFamily})`).join(', ')}`)
}

// ---------------------------------------------------------------------------
console.log('\nstory frames — each story kind uses all three frames (Fable ACCEPT follow-up)')
/** Frame shares of a story template over the seeds; problems when any frame is unused or under 15 %. */
function frameProblems(frames: number[], id: string): string[] {
  const c = [0, 1, 2].map((f) => frames.filter((x) => x === f).length)
  return c.some((x) => x < 0.15 * frames.length) ? [`${id} frames ${c.join('/')}`] : []
}
const storyFrames = (id: string) => SEEDS.map((seed) => Number(buildItem(id, { seed }).generator.params.frame))
{
  for (const id of ['sm.g1u02.l6.join_story', 'sm.g1u02.l6.takeaway_story', 'sm.g1u02.l6.which_bond_story', 'sm.g1u02.l6.paper_bond']) {
    const f = storyFrames(id)
    say(frameProblems(f, id).length === 0, `${id}: frames 0 / 1 / 2 on ${[0, 1, 2].map((x) => f.filter((y) => y === x).length).join(' / ')} of 200 (each ≥ 15 %)`)
  }
}

// ---------------------------------------------------------------------------
console.log('\nchapter-check slots — key and part entropy; the error item\'s rule (Fable ACCEPT follow-up)')
/** The part he is shown or takes away, per check row (rows whose two parts are both given have none). */
const SHOWN_PART: Record<string, string> = { A1: 'p', A3: 'a', B5a: 'p', B5b: 'a', B6: 'p' }
function slotKey(it: SMItem): string {
  const p = [...it.parts].reverse().find((q) => q.answer.kind !== 'ack')!
  const a = p.answer
  if (a.kind === 'number') return String(a.value)
  if (a.kind === 'choice-key' && p.surface.kind === 'choices') { const k = a.key; return contentCanon(p.surface.choices.find((c) => c.key === k)!.content) }
  return canonAnswer(a)
}
type SlotRow = { keys: string[]; parts: number[]; fams: string[] }
/**
 * The shown-part line: 40 % of forms; 50 % for A1 / A3, whose honest pool has three shown parts
 * (2, 3, 4) over seven facts (4 / 2 / 1): holding p = 2 under 40 % pushes the one p = 4 fact
 * (10 and 4) over the 25 % family line, which the Opus re-check made the primary measure.
 */
const PART_LINE: Record<string, number> = { A1: 0.5, A3: 0.5 }
const topShare = (xs: Array<string | number>) => (xs.length ? Math.max(...[...new Set(xs)].map((v) => xs.filter((x) => x === v).length)) / xs.length : 0)
/** Problems: one fact family on > 25 % of forms (rows whose pool has ≥ 5 families), or a shown part over its line. */
function slotProblems(rows: Map<string, SlotRow>): string[] {
  const out: string[] = []
  for (const [sec, r] of rows) {
    if (new Set(r.fams).size >= 5 && topShare(r.fams) > 0.25) out.push(`${sec}: one fact family on ${(100 * topShare(r.fams)).toFixed(0)} % of forms`)
    if (new Set(r.fams).size < 5 && new Set(r.keys).size < 2) out.push(`${sec}: the key never changes`)
    const line = PART_LINE[sec] ?? 0.4
    if (r.parts.length && topShare(r.parts) > line) out.push(`${sec}: one shown part on ${(100 * topShare(r.parts)).toFixed(0)} % of forms (line ${100 * line} %)`)
  }
  return out
}
/** Problems: an error rule on < 15 % of servings. */
function ruleProblems(rules: string[]): string[] {
  return ['sub.added', 'count.start-counted', 'bond.whole-as-part'].filter((r) => rules.filter((x) => x === r).length < 0.15 * rules.length).map((r) => `${r} on ${(100 * rules.filter((x) => x === r).length / rules.length).toFixed(0)} %`)
}
const ckRows = new Map<string, SlotRow>()
const errRules: string[] = []
{
  for (const seed of SEEDS) {
    for (const r of chapterCheck(G1_U02, seed).rows) {
      const e = ckRows.get(r.section) ?? { keys: [], parts: [], fams: [] }
      e.keys.push(slotKey(r.item))
      e.fams.push(r.item.fact ? `${r.item.fact.whole}:${[...r.item.fact.parts].sort((x, y) => x - y).join(',')}` : 'none')
      if (SHOWN_PART[r.section]) e.parts.push(Number(r.item.generator.params[SHOWN_PART[r.section]]))
      ckRows.set(r.section, e)
      if (r.section === 'B6') errRules.push(String(r.item.generator.params.rule))
    }
    errRules.push(String(buildItem('sm.g1u02.l4.error_take_away', { seed }).generator.params.rule))
    errRules.push(String(buildItem('sm.g1u02.l4.error_take_away', { seed, options: { story: true } }).generator.params.rule))
  }
  const pct = (xs: Array<string | number>) => { const m = new Map<string, number>(); xs.forEach((x) => m.set(String(x), (m.get(String(x)) ?? 0) + 1)); return [...m].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k.replace(/^n:/, '')}:${(100 * v / xs.length).toFixed(0)}%`).join(' ') }
  for (const [sec, r] of ckRows) console.log(`    ${sec.padEnd(4)} families ${new Set(r.fams).size}, top family ${pct(r.fams).split(' ')[0]}${r.parts.length ? `  · shown part ${pct(r.parts)}` : ''}`)
  const sp = slotProblems(ckRows)
  say(sp.length === 0, `200 forms: no fact family on > 25 % of a row's forms (pools of ≥ 5 families); no shown part over its line${sp.length ? ' — ' + sp.join('; ') : ''}`)
  const rp = ruleProblems(errRules)
  say(rp.length === 0, `error items (${errRules.length}: template, story form, CK B6): rule shares ${pct(errRules)} (each ≥ 15 %)${rp.length ? ' — ' + rp.join('; ') : ''}`)
}

// ---------------------------------------------------------------------------
console.log('\nOpus re-check — entry pairs, placement, review-line collisions, story nouns')
/** Entry pairs: the two items differ in numbers; match_more's key row is top on one, bottom on the other. */
function entryPairProblems(pairs: Array<{ items: [SMItem, SMItem] }>): string[] {
  const nums = (it: SMItem) => Object.entries(it.generator.params).filter(([k, v]) => typeof v === 'number' && k !== 'spreadTop').map(([, v]) => v as number).sort((a, b) => a - b).join(',')
  const out: string[] = []
  for (const p of pairs) {
    const [x, y] = p.items
    if (nums(x) === nums(y)) out.push(`${x.templateId}: both items use ${nums(x)}`)
    if (x.templateId === 'sm.g1u01.l3.match_more') {
      const row = (it: SMItem) => (Number(it.generator.params.top) > Number(it.generator.params.bottom) ? 'top' : 'bottom')
      if (row(x) === row(y)) out.push(`match_more: the row with more is ${row(x)} on both`)
    }
  }
  return out
}
/** Placement items: never a double. */
const placementDoubles = (items: SMItem[]) => items.filter((it) => it.fact && it.fact.parts[0] === it.fact.parts[1]).map((it) => it.id)
/** empty_part_bond: an answer equal to the shown part (when it is not the key) and one equal to the whole each get a line. */
function reviewGaps(it: SMItem): string[] {
  const w = Number(it.generator.params.w), p = Number(it.generator.params.p), k = w - p
  const out: string[] = []
  for (const part of it.parts) {
    const vals = part.reviewRules.map((r) => r.value)
    if (p !== k && !vals.includes(p)) out.push(`${it.id} ${part.id}: no line for ${p} (the shown part)`)
    if (!vals.includes(w)) out.push(`${it.id} ${part.id}: no line for ${w} (the whole)`)
  }
  return out
}
/** A story sentence that drops its thing ("2 more are tied on."): every story sentence names the noun. */
const NOUNS = ['duck', 'bird', 'apple', 'boat', 'shell', 'fish', 'sticker', 'balloon']
function storyNounGaps(it: SMItem): string[] {
  return sentencesOf(it.prompt).slice(0, 2).filter((x) => !NOUNS.some((n) => new RegExp(`\\b${n}s?\\b`).test(x))).map((x) => `${it.templateId}: "${x}" names no thing`)
}
{
  let eBad = 0, eFirst = '', pBad = 0, rBad = 0, rFirst = '', nBad = 0, nFirst = ''
  for (const seed of SEEDS) {
    const e = entryPairProblems(entryCheck(G1_U02, seed).pairs); if (e.length) { eBad++; if (!eFirst) eFirst = `seed ${seed}: ${e[0]}` }
    pBad += placementDoubles(placementPair(G1_U02, seed).items).length
    for (const asked of [undefined, 'smaller', 'larger']) { const g = reviewGaps(buildItem('sm.g1u02.l4.empty_part_bond', { seed, options: asked ? { asked } : undefined })); if (g.length) { rBad++; if (!rFirst) rFirst = g[0] } }
    for (const t of ['l6.join_story', 'l6.takeaway_story', 'l6.which_bond_story', 'l6.paper_bond']) for (const it of [buildItem(`sm.g1u02.${t}`, { seed })]) { const g = storyNounGaps(it); if (g.length) { nBad++; if (!nFirst) nFirst = g[0] } }
  }
  say(eBad === 0, `entry check, 200 seeds: each pair's items differ in numbers; match_more's row with more is top on one, bottom on the other — off ${eBad}${eFirst ? ' — ' + eFirst : ''}`)
  say(pBad === 0, `placement pair, 200 seeds: no double (the shown part is never the answer) — doubles ${pBad}`)
  say(rBad === 0, `empty_part_bond, 600 draws: an answer of the shown part or of the whole always gets a review line (one kept by priority on a tie) — off ${rBad}${rFirst ? ' — ' + rFirst : ''}`)
  say(nBad === 0, `stories, 800 draws: both story sentences name their thing — off ${nBad}${nFirst ? ' — ' + nFirst : ''}`)
  // controls
  const cl = <X>(x: X): X => JSON.parse(JSON.stringify(x))
  const ec = entryCheck(G1_U02, 29).pairs.map((p) => ({ items: [p.items[0], p.items[0]] as [SMItem, SMItem] }))
  say(entryPairProblems(ec).length >= 3, '(w) entry pairs whose two items are the same draw fail (numbers, and the match_more row)')
  const dbl = buildItem('sm.g1u02.l4.empty_part_bond', { seed: 3, role: 'placement', partsOnly: ['p1'], force: { w: 4, p: 2 } })
  say(placementDoubles([dbl]).length === 1, '(x) a placement item with whole 4, shown 2 (a double) fails')
  // the old drop-both rule on a draw where two rules tie (p = 1: start-counted gives k + 1 = w)
  const tie = cl(buildItem('sm.g1u02.l4.empty_part_bond', { seed: 3, force: { w: 6, p: 1 } }))
  const old = reviewRules({ w: 6, p: 1, k: 5 }, 5, ['bond.repeat-shown', 'bond.whole-as-part', 'bond.added', 'count.stop-short', 'count.start-counted'], 'drop-both')
  tie.parts[0].reviewRules = old
  say(reviewGaps(tie).length > 0, `(y) the old drop-both review lines on whole 6, shown 1 lose the line for 6: ${reviewGaps(tie)[0] ?? ''}`)
  const st = cl(buildItem('sm.g1u02.l6.join_story', { seed: 3 }))
  st.prompt = 'The party has 5 balloons. 2 more are tied on. How many balloons are there now?'
  say(storyNounGaps(st).length > 0, '(z) a story sentence without its thing ("2 more are tied on.") fails')
}

// ---------------------------------------------------------------------------
console.log('\nbroken controls — each must fire')
const fires = (vs: SMViolation[], gate: string) => vs.some((v) => v.gate === gate)
const clone = (it: SMItem): SMItem => JSON.parse(JSON.stringify(it))
{
  // (a) corrupted bond-parts key
  const a = clone(buildItem('sm.g1u02.l3.join_bond', { seed: 3 }))
  const ans = a.parts[0].answer
  if (ans.kind === 'bond-parts' && typeof ans.whole === 'number') ans.whole += 1
  say(fires(validateItem(a), 'QG-5'), '(a) a corrupted bond-parts key (the whole + 1) fires QG-5')

  // (b) a pool value whose named rule gives another number
  const b = clone(buildItem('sm.g1u02.l4.missing_part_choice', { seed: 16 }))
  const bp = b.parts[0]
  if (bp.surface.kind === 'choices') {
    const vals = new Set(bp.surface.choices.map((c) => (c.content.kind === 'number' ? c.content.value : -1)))
    const d = bp.surface.choices.find((c) => c.rule !== null)!
    let nv = 1
    while (vals.has(nv)) nv++
    d.content = { kind: 'number', value: nv }
    d.text = String(nv)
  }
  say(fires(validateItem(b), 'QG-11'), '(b) a pool value relabelled to a number its rule does not give fires QG-11')

  // (c) a ladder rung 2 containing the key
  const c = clone(buildItem('sm.g1u02.l4.sub_pad', { seed: 29 }))
  const key = c.parts[0].answer.kind === 'number' ? c.parts[0].answer.value : 0
  c.ladder[1] = { ...c.ladder[1], say: `The answer is ${key}.` }
  say(fires(validateItem(c), 'SM-LADDER'), `(c) a ladder rung 2 saying the key (${key}) fires SM-LADDER`)

  // (d) a numeric pool with every value above the key: the rank gate must fail
  const broken = population.get('sm.g1u02.l4.missing_part_choice')!.map((it) => {
    const x = clone(it)
    const p = x.parts[0]
    const w = Number(x.generator.params.w), s = Number(x.generator.params.p), k = w - s
    if (p.surface.kind === 'choices' && p.answer.kind === 'choice-key') {
      const keyKey = p.answer.key
      const keyChoice = p.surface.choices.find((q) => q.key === keyKey)!
      const above = [
        { rule: 'count.start-counted', value: k + 1 }, { rule: 'bond.whole-as-part', value: w }, { rule: 'bond.added', value: w + s },
      ]
      let j = 0
      p.surface.choices = p.surface.choices.map((q) => (q === keyChoice ? q : { ...q, rule: above[j].rule, content: { kind: 'number', value: above[j].value }, text: String(above[j++].value) }))
      x.misconceptionRules = [...new Set([...x.misconceptionRules, ...above.map((a) => a.rule)])].sort()
    }
    return x
  })
  const stillValid = broken.every((it) => validateItem(it).length === 0)
  const rg = rankGate(broken)
  say(!rg.ok, `(d) every pool value above the key: rank gate fails (${fmtDist(rg.dist, rg.n)}) though each item alone is valid (${stillValid})`)

  // (e) a check form that reuses a demo fact
  const ck = chapterCheck(G1_U02, 3)
  const items = ck.rows.map((r) => r.item)
  // 7 = 3 + 4 cannot be an A1 draw (2p ≤ w − 2), so the L1 demo fact 6 = 2 + 4 is planted
  items[0] = buildItem('sm.g1u02.l4.missing_part_choice', { seed: 3, role: 'check', force: { w: 6, p: 2 } })
  say(fires(validateForm(items, 'check', demoFacts(G1_U02)), 'SM-DEMO'), '(e) a check form with the demo fact 6 = 2 + 4 at A1 fires SM-DEMO')

  // (f) a spoken line with the asked value
  const f = clone(buildItem('sm.g1u02.l4.missing_part_choice', { seed: 42 }))
  const fk = Number(f.generator.params.w) - Number(f.generator.params.p)
  f.spokenLines.push(`The missing part is ${fk}.`)
  say(fires(validateItem(f), 'SM-SPOKEN'), '(f) a spoken line naming the missing part fires SM-SPOKEN')

  // (g) a re-sit identical to form A
  say(formsDisjoint(items.slice(1), items.slice(1)).length > 0, '(g) a re-sit equal to form A fires QG-4')

  // (h) a validation kind missing from the enablement list
  const h = clone(buildItem('sm.g1u02.l3.add_pad', { seed: 3 }))
  ;(h.parts[0].answer as unknown as { kind: string }).kind = 'digit-boxes'
  say(validateItem(h).some((v) => v.gate === 'QG-5' && v.message.includes('enablement list')), '(h) an answer kind missing from the enablement list is reported, not skipped')

  // (i) "1 ducks"
  const i = clone(buildItem('sm.g1u02.l6.join_story', { seed: 3 }))
  i.prompt = 'There are 1 ducks on the pond. 3 more ducks come.'
  say(fires(validateItem(i), 'QG-12c'), '(i) "1 ducks" fires QG-12c')

  // (j) an 11-word sentence and the word "wrong"
  const j = clone(buildItem('sm.g1u02.l3.add_pad', { seed: 3 }))
  j.parts[0].prompt = 'This is a very long sentence that has far too many words.'
  const j2 = clone(j); j2.parts[0].prompt = 'That is wrong.'
  say(fires(validateItem(j), 'SM-READ') && fires(validateItem(j2), 'SM-READ'), '(j) an 11-word sentence and the word "wrong" each fire SM-READ')

  // (k) an error item whose shown answer two rules make (w = 2p − 1: k + 1 = p)
  const k = clone(buildItem('sm.g1u02.l4.error_take_away', { seed: 3, options: { rule: 'count.start-counted' } }))
  Object.assign(k.generator.params, { w: 5, p: 3, X: 3 })
  k.prompt = 'A child wrote 5 − 3 = 3.'
  say(validateItem(k).some((v) => v.gate === 'QG-11' && v.message.includes('cannot be named')), '(k) a shown answer two rules make (5 − 3 = 3: start counted, or the shown part) fires QG-11')

  // (l) a check form whose A2 shares A1's fact family (the stage-1 dump's 10 = 8 + 2 three times)
  const ckL = chapterCheck(G1_U02, 3).rows.map((r) => clone(r.item))
  ckL[1].fact = { whole: ckL[0].fact!.whole, parts: [...ckL[0].fact!.parts].reverse() as [number, number] }
  say(fires(validateForm(ckL, 'check', [], 'CK-l'), 'SM-FAMILY'), '(l) a check form with two items of one fact family fires SM-FAMILY')

  // (m) a "make a list" item carrying the split ladder ("move some to the other circle")
  const m = clone(buildItem('sm.g1u02.l1.list_splits', { seed: 3 }))
  m.ladder = clone(buildItem('sm.g1u02.l1.split_any', { seed: 3 })).ladder
  say(fires(validateItem(m), 'SM-SCREEN'), '(m) a list item whose ladder names circles it does not show fires SM-SCREEN')

  // (n) a story whose fact has a part of 1, and a check item with a part of 1
  const n1 = clone(buildItem('sm.g1u02.l6.join_story', { seed: 3 }))
  n1.fact = { whole: 2, parts: [1, 1] }
  say(fires(validateItem(n1), 'SM-MINPART'), '(n) a story with a part of 1 fires SM-MINPART')
  const n2 = chapterCheck(G1_U02, 3).rows.map((r) => clone(r.item))
  n2[3].fact = { whole: 5, parts: [1, 4] }
  say(fires(validateForm(n2, 'check', [], 'CK-n'), 'SM-MINPART'), '(n) a check item with a part of 1 fires SM-MINPART')

  // (o) a shape hint equal to the key (the shape-hint check, and the validator's SM-HINT)
  const o = clone(buildItem('sm.g1u02.l5.box_any_place', { seed: 3, options: { place: '1' } }))
  const ok0 = o.parts[0].answer.kind === 'number' ? o.parts[0].answer.value : 0
  if (o.parts[0].surface.kind === 'sentence') o.parts[0].surface.shapeHint = `${ok0} + 1 = ${ok0 + 1}`
  say(hintProblems(o).length > 0 && fires(validateItem(o), 'SM-HINT'), `(o) a shape hint holding the key (${ok0}) fails the shape-hint check and fires SM-HINT`)

  // (p) the old four_facts p3: "if he answers a − w = b" on a pad that takes one number
  const pf = clone(buildItem('sm.g1u02.l5.four_facts', { seed: 3 }))
  const pw = Number(pf.generator.params.w), pa = Number(pf.generator.params.a)
  pf.parts[2].reviewRules = [{ rule: 'fact.order-swapped', value: `${pa} − ${pw} = ${pw - pa}`, line: 'In a take-away, the whole comes first.' }]
  say(fires(validateItem(pf), 'SM-ENTER'), '(p) the old four_facts p3 review ("a − w = b" on a pad) fires SM-ENTER')

  // (q) the old error rows on an X = w draw: "w is a part" keyed false beside a bond with w in a part circle
  const q = clone(buildItem('sm.g1u02.l4.error_take_away', { seed: 3, options: { rule: 'bond.whole-as-part' } }))
  const qw = Number(q.generator.params.w)
  if (q.parts[1].surface.kind === 'truth') {
    const r = q.parts[1].surface.rows.find((x) => x.id === 'leaves-w')!
    Object.assign(r, { id: 'part-w', text: `${qw} is a part.`, truth: false })
  }
  // (r) the old which_bond_story ladder (the story family: rung 3 places the known numbers)
  const r0 = clone(buildItem('sm.g1u02.l6.which_bond_story', { seed: 3 }))
  r0.ladder = ladderFor('story')
  say(placingRungs(r0).length > 0, `(r) which_bond_story with the old story ladder fails: ${placingRungs(r0).join('; ')}`)
  // (s) l2.which_bond with its old bond-build ladder (rung 3 places the whole, "fill the parts")
  const s0 = clone(buildItem('sm.g1u02.l2.which_bond', { seed: 3 }))
  s0.ladder = ladderFor('bond-build')
  say(placingRungs(s0).length >= 2, `(s) l2.which_bond with the old bond-build ladder fails: ${placingRungs(s0).join('; ')}`)
  // (t) every story served in one frame
  say(frameProblems(SEEDS.map(() => 0), 'one-frame builder').length > 0, '(t) a story builder that always uses frame 0 fails the frame check')
  // (u) the old B5b (□ − 1 = k on most forms) and a key that never changes
  const u = new Map(ckRows)
  const b5b = ckRows.get('B5b')!, a2 = ckRows.get('A2')!
  u.set('B5b', { ...b5b, parts: b5b.parts.map((x, i) => (i % 5 < 4 ? 1 : x)) })
  u.set('A2', { ...a2, fams: a2.fams.map((f, i) => (i % 10 < 3 ? '8:2,6' : f)) })
  const up = slotProblems(u)
  say(up.some((x) => /^B5b/.test(x)) && up.some((x) => /^A2: one fact family/.test(x)), `(u) a B5b taking 1 on 80 % of forms and an A2 on one family 30 % of the time both fail: ${up.join('; ')}`)
  // (v) an error-rule choice that never shows sub.added
  say(ruleProblems(errRules.map((r) => (r === 'sub.added' ? 'count.start-counted' : r))).length > 0, '(v) an error-rule choice without sub.added fails (each rule ≥ 15 %)')
  say(fires(validateItem(q), 'SM-TWOFACE'), `(q) the old row "${qw} is a part." keyed false beside the child's bond (whole ${qw}, a part ${qw}) fires SM-TWOFACE`)
}

// ---------------------------------------------------------------------------
console.log(`\nitems built ${totalItems}, throws ${totalThrows}, invalid ${totalInvalid}`)
console.log(`${failures === 0 ? 'PASS' : 'FAIL'} sm-verify-units: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
