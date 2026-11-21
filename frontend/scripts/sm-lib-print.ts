/**
 * sm-lib-print — the readable item printer shared by the dumps (sm-dump-unit, sm-dump-days).
 * Not a gate. `out` collects the lines; `w` writes one.
 */
import { validateItem } from '../src/modules/school-math/engine/validator'
import type { BondShape, SMFigure, SMItem, SMPart } from '../src/modules/school-math/types'

export const out: string[] = []
export const w = (s = '') => { out.push(s) }

export const cell = (c: BondShape['whole']) => (c === 'empty' ? '[ ]' : String(c))
export const bondStr = (b: BondShape) => `whole ${cell(b.whole)}; parts ${cell(b.parts[0])} and ${cell(b.parts[1])}`

const INTERACTION: Record<string, string> = {
  'tap-to-count': 'he taps each one (it dims)',
  'tap-to-take-away': 'he taps the ones he takes away',
  'drag-into-two-circles': 'he drags them into two circles',
}

export function figure(f: SMFigure): string {
  switch (f.type) {
    case 'counters': return `counters: ${f.params.groups.map((g) => g.count).join(' + ')}, ${f.params.arrangement ?? 'row'}${f.interaction ? `; ${INTERACTION[f.interaction]}` : ''}`
    case 'number-bond': return `number bond${f.params.childWork ? " (a child's own bond, shown as the mistake)" : ''}: ${bondStr(f.params.bond)}`
    case 'groups': return `groups (fixed ${f.params.shape} shapes carrying numbers): ${f.params.groups.join(' and ')}`
    case 'split-list': return `list for ${f.params.whole}: ${f.params.rows.map((r) => `${r.first} and ${r.second ?? '□'}`).join(' · ')}`
    case 'match-rows': return `two rows matched one to one: top ${f.params.top.count}${f.params.top.spread ? ' (spread out)' : ''}, bottom ${f.params.bottom.count}${f.params.bottom.spread ? ' (spread out)' : ''}; nothing ringed`
    case 'track-window': return `number track: ${f.params.cells.map((c) => (c === null ? '□' : c)).join(' ')}`
    case 'scene': return `scene (${f.params.setting}): fixed ${f.params.shape} shapes carrying ${f.params.groups.join(' and ')}`
  }
}

export function surface(p: SMPart): string {
  const s = p.surface
  switch (s.kind) {
    case 'counter-split': return `N-I4 drag ${s.whole} counters into two circles`
    case 'bond': return `N-I2 bond (${s.mode}) starting ${bondStr(s.start)}`
    case 'sentence': return `N-I8 sentence "${s.text}" (${s.input}${s.chips ? `; chips ${s.chips.join(' ')}` : ''}${s.shapeHint ? `; shape hint "${s.shapeHint}"` : ''})`
    case 'pad': return `pad${s.text ? ` "${s.text}"` : ''}`
    case 'choices': return `T1 ${s.choices.length} choices${s.numeric ? ' (numbers)' : s.pictures ? ' (pictures)' : ''}`
    case 'truth': return `truth rows (${s.rows.length})`
    case 'paper': return `N-I11 paper: button "${s.button}", then chips ${s.chips.join(' ')}`
    case 'ack': return s.lookAgain
      ? `buttons "${s.label}" / "${s.lookAgain.label}" (the second re-opens ${s.lookAgain.reopens}; never graded, never a new try)`
      : `ack button "${s.label}" (never graded)`
  }
}

export function key(p: SMPart): string {
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

export function item(it: SMItem, indent = '') {
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

