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
 * rules make (so the rule could not be named).
 * Prints PASS/FAIL lines; exits non-zero on any failure.
 */
import { allSMTemplates, buildItem } from '../src/modules/school-math/engine/registry'
import {
  validateItem, validateForm, formsDisjoint, enablementLines, QG5_ENABLEMENT, canonAnswer, operandSignature, type SMViolation,
} from '../src/modules/school-math/engine/validator'
import { chapterCheck, entryCheck, placementPair, fixItTwin } from '../src/modules/school-math/engine/assemble'
import { G1_U02, demoFacts } from '../src/modules/school-math/curriculum/grade1'
import { contentCanon, numericRank } from '../src/modules/school-math/engine/lib/choices'
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
}

// ---------------------------------------------------------------------------
console.log(`\nitems built ${totalItems}, throws ${totalThrows}, invalid ${totalInvalid}`)
console.log(`${failures === 0 ? 'PASS' : 'FAIL'} sm-verify-units: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
