/**
 * sm-dump-unit — G1-U02 as plain readable text, for the owner and the authenticity judges.
 *
 * Run (from frontend/): npx tsx scripts/sm-dump-unit.ts > ../modules/school-math/testing/dump-g1u02-stage1.txt
 *
 * Prints every G1-U02 template (and the four outside templates) at seeds 3 and 16, then the
 * entry check, the placement pair and the chapter check at seed 3: the prompt, each figure,
 * each part (what the child does, the key, choices in served order with the rule that makes
 * each wrong one, truth rows, review lines by rule), the ladder and the spoken lines.
 */
import { allSMTemplates, buildItem } from '../src/modules/school-math/engine/registry'
import { chapterCheck, entryCheck, placementPair } from '../src/modules/school-math/engine/assemble'
import { G1_U02 } from '../src/modules/school-math/curriculum/grade1'
import { validateItem } from '../src/modules/school-math/engine/validator'
import type { BondShape, SMFigure, SMItem, SMPart } from '../src/modules/school-math/types'

const out: string[] = []
const w = (s = '') => out.push(s)

const cell = (c: BondShape['whole']) => (c === 'empty' ? '[ ]' : String(c))
const bondStr = (b: BondShape) => `whole ${cell(b.whole)}; parts ${cell(b.parts[0])} and ${cell(b.parts[1])}`

function figure(f: SMFigure): string {
  switch (f.kind) {
    case 'counters': return `counters: ${f.count}, ${f.layout}${f.tappable ? ', tappable' : ''}`
    case 'number-bond': return `number bond: ${bondStr(f.bond)}`
    case 'groups': return `groups (fixed ${f.shape} shapes carrying numbers): ${f.groups.join(' and ')}`
    case 'split-list': return `list for ${f.whole}: ${f.rows.map((r) => `${r.first} and ${r.second ?? '□'}`).join(' · ')}`
    case 'match-rows': return `two rows matched one to one: top ${f.top.count}${f.top.spread ? ' (spread out)' : ''}, bottom ${f.bottom.count}${f.bottom.spread ? ' (spread out)' : ''}; nothing ringed`
    case 'number-track': return `number track: ${f.cells.map((c) => (c === null ? '□' : c)).join(' ')}`
    case 'scene': return `scene (${f.setting}): fixed ${f.shape} shapes carrying ${f.groups.join(' and ')}`
  }
}

function surface(p: SMPart): string {
  const s = p.surface
  switch (s.kind) {
    case 'counter-split': return `N-I4 drag ${s.whole} counters into two circles`
    case 'bond': return `N-I2 bond (${s.mode}) starting ${bondStr(s.start)}`
    case 'sentence': return `N-I8 sentence "${s.text}" (${s.input}${s.chips ? `; chips ${s.chips.join(' ')}` : ''}${s.shapeHint ? `; shape hint "${s.shapeHint}"` : ''})`
    case 'pad': return `pad${s.text ? ` "${s.text}"` : ''}`
    case 'choices': return `T1 ${s.choices.length} choices${s.numeric ? ' (numbers)' : s.pictures ? ' (pictures)' : ''}`
    case 'truth': return `truth rows (${s.rows.length})`
    case 'paper': return `N-I11 paper: button "${s.button}", then chips ${s.chips.join(' ')}`
    case 'ack': return `ack button "${s.label}" (never graded)`
  }
}

function key(p: SMPart): string {
  const a = p.answer
  switch (a.kind) {
    case 'number': return String(a.value)
    case 'split': return `any two parts (≥ 1) that make ${a.whole}${a.notPair ? `, not ${a.notPair.join(' and ')} in either order` : ''}${a.sameAsPart ? `, the same split as ${a.sameAsPart}` : ''}`
    case 'bond-parts': return `whole ${a.whole}; parts ${a.parts ? a.parts.join(' and ') : `his split from ${a.sameAsPart}`}; graded: ${a.asked.join(', ')}`
    case 'sentence-match': return a.accepts.map((x) => `"${x}"`).join(' or ')
    case 'paper-ack': return `the sentence ${a.accepts.map((x) => `"${x}"`).join(' or ')}`
    case 'choice-key': return `choice ${a.key}`
    case 'truth-set': return a.value
    case 'ack': return '(not graded)'
  }
}

function item(it: SMItem, indent = '') {
  const vs = validateItem(it)
  w(`${indent}${it.id}  [${it.role}; ${it.formatCode}; ${it.modelRung}; skills ${it.skillIds.join(', ') || '—'}${it.label ? `; "${it.label}"` : ''}${it.lessonOnly ? '; lesson-only' : ''}]  validator: ${vs.length ? vs.length + ' violations' : 'clean'}`)
  w(`${indent}  prompt: ${it.prompt}`)
  for (const f of it.figures) w(`${indent}  figure: ${figure(f)}`)
  for (const p of it.parts) {
    w(`${indent}  part ${p.id}${p.reveal === 'with-item' ? '' : ` (${p.reveal})`}${p.points ? ` · ${p.points} pt` : ''}: ${p.prompt ? `"${p.prompt}" ` : ''}— ${surface(p)}`)
    if (p.surface.kind === 'choices') {
      for (const c of p.surface.choices) w(`${indent}      ${c.key}. ${c.text}${c.rule ? `   ← ${c.rule}` : '   ← KEY'}`)
    }
    if (p.surface.kind === 'truth') {
      for (const r of p.surface.rows) w(`${indent}      ${r.truth ? 'T' : 'F'}  ${r.text}${r.rule ? `   (${r.rule})` : ''}`)
    }
    w(`${indent}    key: ${key(p)}`)
    for (const r of p.reviewRules) w(`${indent}    if he answers ${r.value}: ${r.rule} — "${r.line}"`)
  }
  w(`${indent}  ladder (${it.ladderFamily}):`)
  it.ladder.forEach((r, i) => w(`${indent}    ${i + 1}. "${r.say}"${r.show !== 'none' ? ` [screen: ${r.show}]` : ''}`))
  w(`${indent}  spoken: ${it.spokenLines.map((s) => `"${s}"`).join(' · ')}`)
  w()
}

w('G1-U02 — stage 1, run 1 dump (generated by frontend/scripts/sm-dump-unit.ts)')
w('Seeds 3 and 16 for every template; entry check, placement pair and chapter check at seed 3.')
w('"←" names the misconception rule that makes each wrong choice. No child names; no exam values.')
w()
w('=== TEMPLATES ===')
w()
for (const d of allSMTemplates()) {
  w(`--- ${d.id}  (lesson ${d.lessonId}; served as ${d.uses.join(', ')})`)
  for (const seed of [3, 16]) item(buildItem(d.id, { seed }), '  ')
}

w('=== ENTRY CHECK G1-U02-EC (seed 3; feedback held; per pair: holds / does not hold / unclear) ===')
w()
for (const p of entryCheck(G1_U02, 3).pairs) {
  w(`pair: ${p.skill} (a failed pair opens ${p.opensLesson})`)
  for (const it of p.items) item(it, '  ')
}

w('=== PLACEMENT PAIR for U02 (seed 3; typed, part 1 only) ===')
w()
for (const it of placementPair(G1_U02, 3).items) item(it, '  ')

const ck = chapterCheck(G1_U02, 3)
w(`=== CHAPTER CHECK G1-U02-CK (seed 3; ${ck.totalPoints} points; feedback held; review after) ===`)
w()
for (const r of ck.rows) {
  w(`§ ${r.section} · ${r.points} pt · ${r.category} · ${r.note}`)
  item(r.item, '  ')
}

console.log(out.join('\n'))
