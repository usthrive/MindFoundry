/**
 * The deterministic validator on `SMItem` (ENGINE-SPEC §5.1; the Best Brains QG gates
 * re-cut for multi-part items).
 *
 *   S-*      structure: the template resolves, the role is one the template allows, parts
 *            and reveal rules are well formed, the key is among the choices.
 *   QG-1     no repeated operand tuple within one day or form (validateForm).
 *   QG-3     every distractor, row and review line names a rule that exists.
 *   QG-4     form disjointness (formsDisjoint): a re-sit shares no operand tuple by index.
 *   QG-5     answerFor recompute for EVERY validation kind used. The enablement list is
 *            explicit; a part whose kind is not on it is a violation, never skipped (L50).
 *   QG-11    verifyFor: every pool value, choice, truth row, review line and the error
 *            item's shown answer re-derived from its named rule; pool values on the
 *            rule's side of the key; truth rows that are number sentences re-evaluated.
 *   QG-12c   number/noun and article agreement ("1 ducks", "a apple", "3 duck").
 *   SM-READ  every child-facing sentence ≤ 10 words; never the word "wrong"; no person name.
 *   SM-LADDER four rungs, rung 1 a question, rungs 1–3 carry no key, the ladder number-free.
 *   SM-SPOKEN no spoken line contains an asked value that is not printed for the child.
 *   SM-FIG   every number a figure prints is a given (the asked circle stays empty, L33);
 *            a bond the child fills starts with the asked circle empty.
 *   SM-FIGSHAPE every figure passes the shared library's `checkFigureShape`.
 *   SM-ENTER every review answer can be entered on its part's surface (a number on a pad or bond;
 *            a split on the counters; a sentence only on chips).
 *   SM-TWOFACE a truth row about a number's role (whole / part) agrees with the bond drawn.
 *   SM-HINT  a shape hint shares no number with the item.
 *   SM-DEMO  a check, entry or placement item never uses a demo fact (EXEMPLAR §1).
 */

import { personNames } from '../../best-brains/generator/surface'
import type {
  ChoiceContent, SMAnswer, SMExpected, SMFact, SMItem, SMPart, SMRole, SMTruthRow, SMVerify,
} from '../types'
import { getSMTemplate } from './registry'
import { contentCanon } from './lib/choices'
import { RULES, ruleMakes, sameAct, sideHolds } from './lib/misconceptions'
import { evalSentence, normSentence, numbersIn, sentencesOf, wordCount } from './lib/text'
import { sameFact } from './lib/item'
import { GRADE1_UNITS } from '../curriculum/grade1'
import { printedNumbers } from './lib/figures'
import { checkFigureShape } from '../../best-brains/figures/assert'

/**
 * Roles a template may be served in. Beyond its own `uses`: a lesson's exit template is
 * the next lesson's starter (EXEMPLAR §3), and a comeback is a fresh draw of an item
 * family missed on a check or a practice day (W3), so any template served on a check,
 * a practice day or as a return may come back. Lesson-only templates never do.
 */
export function roleAllowed(uses: readonly SMRole[], role: SMRole): boolean {
  if (uses.includes(role)) return true
  if (role === 'starter') return uses.includes('exit')
  if (role === 'comeback') return uses.some((u) => u === 'check' || u === 'practice' || u === 'return')
  return false
}

export interface SMViolation {
  gate: string
  path: string
  message: string
}

// ---------------------------------------------------------------------------
// QG-5 enablement list (L50: explicit, printed, and a missing kind is reported)
// ---------------------------------------------------------------------------

export interface EnablementEntry {
  recompute: 'full' | 'kind-only'
  note: string
}

/** Every validation kind the engine may emit, and how QG-5 audits it. */
export const QG5_ENABLEMENT: Readonly<Record<string, EnablementEntry>> = {
  number: { recompute: 'full', note: 'typed value recomputed from params' },
  split: { recompute: 'full', note: 'whole, excluded pair and same-as-part link recomputed; any split of the whole is right' },
  'bond-parts': { recompute: 'full', note: 'whole, parts, asked circles and his-split link recomputed' },
  'sentence-match': { recompute: 'full', note: 'the set of true sentences for the model recomputed' },
  'choice-key': { recompute: 'full', note: "the key choice's content recomputed and found under the stored key" },
  'truth-set': { recompute: 'full', note: 'each row truth recomputed in served order' },
  'paper-ack': { recompute: 'full', note: 'the set of true sentences recomputed (the drawing is never graded)' },
  ack: { recompute: 'kind-only', note: 'never graded by design (DD17 "tell it back"); the kind is checked, nothing else' },
}

export function enablementLines(): string[] {
  return Object.entries(QG5_ENABLEMENT).map(([k, e]) => `${k.padEnd(15)} ${e.recompute.padEnd(9)} ${e.note}`)
}

function sortNums(xs: Array<number | string>): string {
  return xs.map(String).sort().join(',')
}

export function canonAnswer(a: SMAnswer | SMExpected): string {
  switch (a.kind) {
    case 'number': return `number:${a.value}`
    case 'split': return `split:${a.whole}|not:${a.notPair ? sortNums(a.notPair) : ''}|same:${a.sameAsPart ?? ''}`
    case 'bond-parts': return `bond:${a.whole}|${a.parts ? sortNums(a.parts) : 'his-split'}|asked:${[...a.asked].sort().join(',')}|same:${a.sameAsPart ?? ''}`
    case 'sentence-match': return `sentence:${a.accepts.map(normSentence).sort().join(' ; ')}`
    case 'paper-ack': return `paper:${a.accepts.map(normSentence).sort().join(' ; ')}`
    case 'truth-set': return `truth:${a.value}`
    case 'ack': return 'ack'
    case 'choice-key': return 'key' in a ? `key:${a.key}` : `content:${a.content}`
  }
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const choicesOf = (p: SMPart) => (p.surface.kind === 'choices' ? p.surface.choices : [])
const rowsOf = (p: SMPart): SMTruthRow[] => (p.surface.kind === 'truth' ? p.surface.rows : [])

/** The numbers a part asks the child to produce that are not printed for him. */
export function askedNumbers(item: SMItem, p: SMPart): number[] {
  const given = new Set(item.givens)
  const out: number[] = []
  const a = p.answer
  if (a.kind === 'number') out.push(a.value)
  if (a.kind === 'bond-parts') {
    if (a.asked.includes('whole') && typeof a.whole === 'number') out.push(a.whole)
    if (a.asked.includes('part') && a.parts) for (const x of a.parts) if (typeof x === 'number') out.push(x)
  }
  if (a.kind === 'sentence-match' || a.kind === 'paper-ack') for (const s of a.accepts) out.push(...numbersIn(s))
  if (a.kind === 'choice-key') {
    const c = choicesOf(p).find((x) => x.key === a.key)
    if (c && c.content.kind === 'number') out.push(c.content.value)
  }
  return [...new Set(out)].filter((n) => !given.has(n))
}

/** The numeric key of a part, for side checks and review-line collisions (null when not one number). */
function numericKey(p: SMPart): number | null {
  const a = p.answer
  if (a.kind === 'number') return a.value
  if (a.kind === 'choice-key') {
    const c = choicesOf(p).find((x) => x.key === a.key)
    return c && c.content.kind === 'number' ? c.content.value : null
  }
  if (a.kind === 'bond-parts' && a.asked.length === 1 && a.asked[0] === 'whole' && typeof a.whole === 'number') return a.whole
  if (a.kind === 'bond-parts' && a.asked.length === 1 && a.asked[0] === 'part' && a.parts && typeof a.whole === 'number') {
    // the part that is not shown: the whole minus the shown part
    const shown = a.parts.find((x) => typeof x === 'number')
    return typeof shown === 'number' ? a.whole - shown : null
  }
  return null
}

/** Run a rule check; a rule that cannot read its inputs is a violation, never a crash. */
function safe<T>(fn: () => T, fallback: T, onError: (m: string) => void): T {
  try { return fn() } catch (e) { onError((e as Error).message); return fallback }
}

function hasToken(text: string, n: number): boolean {
  return new RegExp(`(?<!\\d)${n}(?!\\d)`).test(text)
}

/** Every child-facing string with its path (prompt, parts, choices, rows, ladder, review lines, spoken lines). */
function childStrings(item: SMItem): Array<{ path: string; text: string }> {
  const out: Array<{ path: string; text: string }> = [{ path: 'prompt', text: item.prompt }]
  item.parts.forEach((p, i) => {
    if (p.prompt) out.push({ path: `parts[${i}].prompt`, text: p.prompt })
    choicesOf(p).forEach((c, j) => out.push({ path: `parts[${i}].choices[${j}]`, text: c.text }))
    rowsOf(p).forEach((r, j) => out.push({ path: `parts[${i}].rows[${j}]`, text: r.text }))
    p.reviewRules.forEach((r, j) => out.push({ path: `parts[${i}].review[${j}]`, text: r.line }))
  })
  item.ladder.forEach((r, i) => out.push({ path: `ladder[${i}]`, text: r.say }))
  item.spokenLines.forEach((s, i) => out.push({ path: `spoken[${i}]`, text: s }))
  return out
}

// --- QG-12 surface agreement (ported from best-brains/generator/validator.ts, which does not export them) ---
const ONE_PLURAL_G = /(?<![\d.])(?<!than )(?<!the )(?<![\d/],\s)\b1 ([a-z]{3,}(?:s|es))\b/g
const NOT_A_PLURAL_NOUN = new Set(['times', 'makes', 'takes', 'gives', 'means', 'stays', 'leaves', 'shares', 'moves', 'sits', 'goes', 'shows', 'turns', 'always', 'across', 'plus', 'less', 'hops'])
const ARTICLE_VOWEL = /\ba (8|11|18|8\d)\b/
const A_BEFORE_VOWEL_WORD = /\ba ([aeiou][a-z]{2,})\b/
const AN_BEFORE_CONSONANT_WORD = /\ban ([b-df-hj-np-tv-z][a-z]{2,})\b/
const CONSONANT_SOUND_VOWEL_WORD = /^(uni|use|usu|euro|ewe|one|once)/i
const VOWEL_SOUND_CONSONANT_WORD = /^(hour|honest|honou?r|heir)/i
const BROKEN_SINGULAR = /\b(buse|boxe|dishe|batche|benche|inche|glasse)\b/i
/** A count above one before a singular count noun this module uses ("3 duck"). */
const MANY_SINGULAR = /\b([2-9]|10) (?:more )?(duck|bird|apple|boat|shell|sticker|balloon|counter|group|row|part|thing)\b(?!s)/

function surfaceAgreement(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(ONE_PLURAL_G)) if (!NOT_A_PLURAL_NOUN.has(m[1])) out.push(`"1 ${m[1]}" takes a singular noun`)
  if (ARTICLE_VOWEL.test(text)) out.push('"a" before a vowel-sound numeral')
  const aw = A_BEFORE_VOWEL_WORD.exec(text)
  if (aw && !CONSONANT_SOUND_VOWEL_WORD.test(aw[1])) out.push(`"a ${aw[1]}" needs "an"`)
  const an = AN_BEFORE_CONSONANT_WORD.exec(text)
  if (an && !VOWEL_SOUND_CONSONANT_WORD.test(an[1])) out.push(`"an ${an[1]}" needs "a"`)
  if (BROKEN_SINGULAR.test(text)) out.push('broken singular')
  const ms = MANY_SINGULAR.exec(text)
  if (ms) out.push(`"${ms[0]}" needs a plural noun`)
  return out
}

function allSkillIds(): Set<string> {
  return new Set(GRADE1_UNITS.flatMap((u) => u.skills.map((s) => s.id)))
}
const SKILL_IDS = allSkillIds()
const UNITS_WITH_SKILLS = new Set(GRADE1_UNITS.filter((u) => u.skills.length).map((u) => u.id))

// ---------------------------------------------------------------------------
// validateItem
// ---------------------------------------------------------------------------

export function validateItem(item: SMItem, base = item.id): SMViolation[] {
  const out: SMViolation[] = []
  const add = (gate: string, path: string, message: string) => out.push({ gate, path: `${base}.${path}`, message })

  // --- S: structure, registry, roles ---------------------------------------
  const def = getSMTemplate(item.templateId)
  if (!def) { add('S-REG', 'templateId', `template "${item.templateId}" does not resolve`); return out }
  if (item.generator.templateId !== item.templateId) add('S-REG', 'generator', 'generator.templateId differs from templateId')
  if (item.unitId !== def.unitId || item.lessonId !== def.lessonId) add('S-REG', 'lessonId', `item says ${item.unitId}/${item.lessonId}, template ${def.unitId}/${def.lessonId}`)
  if (item.role !== 'review' && !roleAllowed(def.uses, item.role)) add('S-ROLE', 'role', `role "${item.role}" is not one this template is served in (${def.uses.join(', ')})`)
  if (item.lessonOnly && !['step', 'review'].includes(item.role)) add('S-ROLE', 'role', `lesson-only template served as "${item.role}"`)
  if (item.ladderFamily !== def.ladderFamily) add('S-REG', 'ladderFamily', `ladder family ${item.ladderFamily} ≠ template's ${def.ladderFamily}`)
  // SM-SCREEN: a help line names only things the screen has (stage-1 review: a "make a list"
  // item said "move some to the other circle" with no circles on the screen).
  const hasCircles = item.figures.some((f) => f.type === 'number-bond' || (f.type === 'counters' && f.interaction === 'drag-into-two-circles'))
    || item.parts.some((pt) => pt.surface.kind === 'bond' || pt.surface.kind === 'counter-split'
      || (pt.surface.kind === 'choices' && pt.surface.choices.some((c) => (c as { content?: { kind?: string } }).content?.kind === 'bond')))
  item.ladder.forEach((r, i) => {
    if (/circle/i.test(r.say) && !hasCircles) add('SM-SCREEN', `ladder[${i}]`, `"${r.say}" names circles; this screen has none`)
  })
  // SM-MINPART: stories never use a part of 1 ("1 apple and 1 more" is not a story worth a bond).
  if (item.ladderFamily === 'story' && item.fact && item.fact.parts.some((x) => x < 2)) {
    add('SM-MINPART', 'fact', `story uses a part of ${Math.min(...item.fact.parts)}`)
  }
  if (UNITS_WITH_SKILLS.has(item.unitId)) {
    for (const s of [...item.skillIds, ...item.parts.flatMap((p) => p.skillIds)]) if (!SKILL_IDS.has(s)) add('S-SKILL', 'skillIds', `unknown skill ${s}`)
  }
  if (item.parts.length === 0) add('S-PART', 'parts', 'item has no parts')
  const seenIds: string[] = []
  item.parts.forEach((p, i) => {
    if (seenIds.includes(p.id)) add('S-PART', `parts[${i}].id`, `duplicate part id ${p.id}`)
    if (p.reveal !== 'with-item') {
      const ref = p.reveal.slice('after-part:'.length)
      if (!seenIds.includes(ref)) add('S-PART', `parts[${i}].reveal`, `reveals after "${ref}", which is not an earlier part`)
    }
    if (p.surface.kind === 'ack' && p.surface.lookAgain && !seenIds.includes(p.surface.lookAgain.reopens)) {
      add('S-PART', `parts[${i}].surface`, `"${p.surface.lookAgain.label}" re-opens "${p.surface.lookAgain.reopens}", which is not an earlier part`)
    }
    if (p.surface.kind === 'ack' && (p.points ?? 0) > 0) add('S-PART', `parts[${i}].points`, 'an ack part is never scored')
    seenIds.push(p.id)
  })

  // --- QG-5: answerFor recompute (enablement list explicit) ----------------
  let expected: Record<string, SMExpected> | null = null
  try { expected = def.answerFor(item.generator.params) } catch (e) { add('QG-5', 'generator', `answerFor threw: ${(e as Error).message}`) }
  item.parts.forEach((p, i) => {
    const path = `parts[${i}].answer`
    const en = QG5_ENABLEMENT[p.answer.kind]
    if (!en) { add('QG-5', path, `validation kind "${p.answer.kind}" is not on the QG-5 enablement list (never skipped silently)`); return }
    selfCheck(item, p, path, add)
    if (!expected) return
    const exp = expected[p.id]
    if (!exp) { add('QG-5', path, `answerFor gives nothing for part ${p.id}`); return }
    if (exp.kind !== p.answer.kind) { add('QG-5', path, `kind ${p.answer.kind} ≠ recomputed ${exp.kind}`); return }
    if (en.recompute === 'kind-only') return
    if (p.answer.kind === 'choice-key' && exp.kind === 'choice-key') {
      const keyKey = p.answer.key
      const c = choicesOf(p).find((x) => x.key === keyKey)
      const got = c ? contentCanon(c.content) : '(no such choice)'
      if (got !== exp.content) add('QG-5', path, `choice under key ${keyKey} is ${got}, recomputed key is ${exp.content}`)
      return
    }
    if (canonAnswer(p.answer) !== canonAnswer(exp)) add('QG-5', path, `stored ${canonAnswer(p.answer)} ≠ recomputed ${canonAnswer(exp)}`)
  })

  // --- QG-3 / QG-11: rules exist and re-derive -----------------------------
  let v: SMVerify | null = null
  try { v = def.verifyFor(item.generator.params) } catch (e) { add('QG-11', 'generator', `verifyFor threw: ${(e as Error).message}`) }
  for (const r of item.misconceptionRules) if (!RULES[r]) add('QG-3', 'misconceptionRules', `unknown rule ${r}`)
  item.parts.forEach((p, i) => {
    const key = numericKey(p)
    const args = v ? (v.partArgs?.[p.id] ?? v.args) : {}
    const err = (path: string) => (m: string) => add('QG-11', path, `rule could not be re-derived: ${m}`)
    // choices
    const cs = choicesOf(p)
    const canons = cs.map((c) => contentCanon(c.content))
    if (new Set(canons).size !== canons.length) add('QG-11', `parts[${i}].choices`, 'two choices show the same thing')
    cs.forEach((c, j) => {
      const path = `parts[${i}].choices[${j}]`
      if (c.rule === null) return
      if (!RULES[c.rule]) { add('QG-3', path, `distractor "${c.text}" names unknown rule ${c.rule}`); return }
      if (v && !safe(() => ruleMakes(c.rule!, c.content, args), false, err(path))) add('QG-11', path, `distractor "${c.text}" is not what rule ${c.rule} makes on ${JSON.stringify(args)}`)
      if (c.content.kind === 'number' && key !== null && !sideHolds(c.rule, c.content.value, key)) {
        add('QG-11', path, `value ${c.content.value} is on the wrong side of the key ${key} for rule ${c.rule} (${RULES[c.rule].side})`)
      }
    })
    if (cs.length && cs.filter((c) => c.rule === null).length !== 1) add('QG-3', `parts[${i}].choices`, 'exactly one choice must be the key (rule null)')
    // truth rows
    rowsOf(p).forEach((r, j) => {
      const path = `parts[${i}].rows[${j}]`
      if (v) {
        const t = v.truth?.[r.id]
        if (t === undefined) add('QG-11', path, `verifyFor has no truth for row "${r.id}"`)
        else if (t !== r.truth) add('QG-11', path, `row "${r.text}" stated ${r.truth}, recomputed ${t}`)
      }
      const ev = evalSentence(r.text)
      if (ev !== null && ev !== r.truth) add('QG-11', path, `row "${r.text}" evaluates ${ev}, stated ${r.truth}`)
      if (r.rule) {
        if (!RULES[r.rule]) add('QG-3', path, `row names unknown rule ${r.rule}`)
        else if (v) {
          const rule = RULES[r.rule]
          const content: ChoiceContent = { kind: 'sentence', text: r.text }
          const rid = r.rule
          const ok = safe(() => (rule.check ? ruleMakes(rid, content, args)
            : rule.values ? rule.values(args).includes(Number(r.text.split('=').pop()!.trim())) : false), false, err(path))
          if (!ok) add('QG-11', path, `row "${r.text}" is not what rule ${r.rule} makes`)
        }
      }
    })
    // review lines
    const vals: Array<number | string> = []
    p.reviewRules.forEach((rr, j) => {
      const path = `parts[${i}].review[${j}]`
      const rule = RULES[rr.rule]
      if (!rule) { add('QG-3', path, `review line names unknown rule ${rr.rule}`); return }
      if (rr.line !== rule.line) add('QG-3', path, `review line text is not rule ${rr.rule}'s line`)
      if (vals.includes(rr.value)) add('QG-11', path, `two review rules give ${rr.value}: the rule cannot be named`)
      vals.push(rr.value)
      if (!v) return
      if (typeof rr.value === 'number') {
        const rv = rr.value
        if (!rule.values || !safe(() => rule.values!(args).includes(rv), false, err(path))) add('QG-11', path, `review value ${rr.value} is not what ${rr.rule} gives on ${JSON.stringify(args)}`)
        if (key !== null && rr.value === key) add('QG-11', path, `review value ${rr.value} equals the key`)
      } else {
        const pm = /^(\d+),(\d+)$/.exec(rr.value)
        const content: ChoiceContent = pm ? { kind: 'pair', a: Number(pm[1]), b: Number(pm[2]) } : { kind: 'sentence', text: rr.value }
        if (!safe(() => ruleMakes(rr.rule, content, args), false, err(path))) add('QG-11', path, `review value "${rr.value}" is not what ${rr.rule} makes`)
      }
    })
  })
  if (v?.shownWrong) {
    const { rule, value } = v.shownWrong
    if (item.generator.params.X !== value) add('QG-11', 'generator.params.X', `shown answer ${String(item.generator.params.X)} ≠ ${value} from rule ${rule}`)
    if (!hasToken(item.prompt, value)) add('QG-11', 'prompt', `prompt does not show the rule's value ${value}`)
    if (!item.misconceptionRules.includes(rule)) add('QG-3', 'misconceptionRules', `shown-answer rule ${rule} not listed`)
    // the shown value must name its rule alone: no other number rule gives it on these numbers
    const others = Object.values(RULES).filter((r) => r.id !== rule && !sameAct(r.id, rule) && r.values).filter((r) => {
      try { return r.values!(v!.args).includes(value) } catch { return false }
    })
    if (others.length) add('QG-11', 'generator.params.X', `shown answer ${value} is also made by ${others.map((r) => r.id).join(', ')}: its rule cannot be named`)
  }
  // every rule used is listed
  const used = new Set<string>()
  item.parts.forEach((p) => { choicesOf(p).forEach((c) => c.rule && used.add(c.rule)); rowsOf(p).forEach((r) => r.rule && used.add(r.rule)); p.reviewRules.forEach((r) => used.add(r.rule)) })
  for (const r of used) if (!item.misconceptionRules.includes(r)) add('QG-3', 'misconceptionRules', `rule ${r} used but not listed`)

  // --- QG-12c / SM-READ -----------------------------------------------------
  for (const { path, text } of childStrings(item)) {
    for (const m of surfaceAgreement(text)) add('QG-12c', path, `${m}: "${text}"`)
    if (/\bwrong\b/i.test(text)) add('SM-READ', path, `child-facing text uses "wrong": "${text}"`)
    for (const s of sentencesOf(text)) if (wordCount(s) > 10) add('SM-READ', path, `${wordCount(s)} words (> 10): "${s}"`)
    const names = personNames(text)
    if (names.size) add('SM-READ', path, `person name ${[...names].join(', ')} in "${text}"`)
  }

  // --- SM-LADDER --------------------------------------------------------------
  if (item.ladder.length !== 4) add('SM-LADDER', 'ladder', `ladder has ${item.ladder.length} rungs, needs 4`)
  if (!item.ladder[0]?.say.includes('?')) add('SM-LADDER', 'ladder[0]', 'rung 1 is not a question')
  const keys = new Set<number>()
  for (const p of item.parts) { const k = numericKey(p); if (k !== null) keys.add(k); askedNumbers(item, p).forEach((n) => keys.add(n)) }
  item.ladder.forEach((r, i) => {
    if (/\d/.test(r.say)) add('SM-LADDER', `ladder[${i}]`, `rung ${i + 1} carries a number (ladders are number-free): "${r.say}"`)
    if (i < 3) for (const k of keys) if (hasToken(r.say, k)) add('SM-LADDER', `ladder[${i}]`, `rung ${i + 1} contains the key ${k}`)
    if (!r.show) add('SM-LADDER', `ladder[${i}]`, 'rung has no screen action')
  })

  // --- SM-SPOKEN: no spoken line carries an asked value ---------------------
  const asked = new Set(item.parts.flatMap((p) => askedNumbers(item, p)))
  item.spokenLines.forEach((s, i) => {
    for (const n of asked) if (hasToken(s, n)) add('SM-SPOKEN', `spoken[${i}]`, `spoken line says the asked value ${n}: "${s}"`)
  })
  // a sentence key is never read aloud either
  item.parts.forEach((p) => {
    if (p.answer.kind !== 'choice-key') return
    const keyKey = p.answer.key
    const c = choicesOf(p).find((x) => x.key === keyKey)
    if (c?.content.kind === 'sentence') item.spokenLines.forEach((s, i) => { if (s.includes(c.text)) add('SM-SPOKEN', `spoken[${i}]`, `spoken line reads the key sentence "${c.text}"`) })
  })

  // --- SM-FIG: printed numbers are givens; the asked circle is empty ---------
  const givens = new Set(item.givens)
  item.figures.forEach((f, i) => {
    for (const n of printedNumbers(f)) if (!givens.has(n)) add('SM-FIG', `figures[${i}]`, `figure prints ${n}, which is not a given (an asked value?)`)
    // the shared library's own well-formedness check (one definition of each figure)
    for (const m of checkFigureShape(f)) add('SM-FIGSHAPE', `figures[${i}]`, m)
    if (!f.spoken || f.spoken !== f.alt) add('SM-FIGSHAPE', `figures[${i}]`, 'a figure says its spoken line and uses it as its accessible name')
  })
  item.parts.forEach((p, i) => {
    if (p.surface.kind !== 'bond' || p.surface.mode !== 'fill' || p.answer.kind !== 'bond-parts') return
    const st = p.surface.start
    if (p.answer.asked.includes('whole') && st.whole !== 'empty') add('SM-FIG', `parts[${i}].surface`, 'the whole is asked but its circle is not empty')
    if (p.answer.asked.includes('part') && !st.parts.includes('empty')) add('SM-FIG', `parts[${i}].surface`, 'a part is asked but no part circle is empty')
  })

  // --- SM-ENTER: every misconception answer is one he can enter on that part ---
  // (main session's read of the run-2 dump: four_facts' pad carried "if he answers a − w = b")
  item.parts.forEach((p, i) => {
    for (const [j, r] of p.reviewRules.entries()) {
      const why = enterableProblem(p, r.value)
      if (why) add('SM-ENTER', `parts[${i}].review[${j}]`, `review value "${r.value}" (${r.rule}) cannot be entered: ${why}`)
    }
  })

  // --- SM-TWOFACE: a truth row's claim about a number's role agrees with the bond drawn -------
  // (LEARNINGS S6; an error item drew the child's bond with w in a part circle and keyed
  // "w is a part" false)
  const bonds = item.figures.filter((f) => f.type === 'number-bond')
  item.parts.forEach((p, i) => {
    if (p.surface.kind !== 'truth') return
    p.surface.rows.forEach((r, j) => {
      const m = /^(\d+) is (a part|the whole)\.$/.exec(r.text)
      if (!m) return
      const n = Number(m[1])
      for (const f of bonds) {
        if (f.type !== 'number-bond') continue
        const b = f.params.bond
        const pictured = m[2] === 'a part' ? b.parts.includes(n) : b.whole === n
        if (pictured !== r.truth) add('SM-TWOFACE', `parts[${i}].rows[${j}]`, `row "${r.text}" is keyed ${r.truth}, but the bond drawn says ${pictured}`)
      }
    })
  })

  // --- SM-HINT ----------------------------------------------------------------
  item.parts.forEach((p, i) => {
    if (p.surface.kind !== 'sentence' || !p.surface.shapeHint) return
    const own = new Set([...item.givens, ...askedNumbers(item, p), ...(item.fact ? [item.fact.whole, ...item.fact.parts] : [])])
    const shared = numbersIn(p.surface.shapeHint).filter((n) => own.has(n))
    if (shared.length) add('SM-HINT', `parts[${i}].surface.shapeHint`, `shape hint "${p.surface.shapeHint}" shares ${shared.join(', ')} with the item`)
  })

  return out
}

/** Why a review value cannot be entered on this part's surface (null = it can). */
export function enterableProblem(p: SMPart, value: number | string): string | null {
  const s = p.surface
  if (typeof value === 'number') {
    if (s.kind === 'pad' || s.kind === 'bond' || (s.kind === 'sentence' && s.input === 'pad')) return null
    return `a number is typed on a pad or a bond, not on ${s.kind}${s.kind === 'sentence' ? ` (${s.input})` : ''}`
  }
  if (/^\d+,\d+$/.test(value)) return s.kind === 'counter-split' ? null : `a split is made on the counters, not on ${s.kind}`
  if ((s.kind === 'sentence' && s.input === 'chips') || s.kind === 'paper') return null
  return `a sentence is built from chips, not on ${s.kind}${s.kind === 'sentence' ? ` (${s.input})` : ''}`
}

function selfCheck(item: SMItem, p: SMPart, path: string, add: (g: string, p: string, m: string) => void): void {
  const a = p.answer
  const earlier = (id: string) => item.parts.slice(0, item.parts.indexOf(p)).find((q) => q.id === id)
  switch (a.kind) {
    case 'number':
      if (!Number.isInteger(a.value) || a.value < 0) add('QG-5', path, `key ${a.value} is not a whole number`)
      break
    case 'split':
      if (a.whole < 2) add('QG-5', path, `cannot split ${a.whole} into two parts of at least 1`)
      if (a.notPair && a.notPair[0] + a.notPair[1] !== a.whole) add('QG-5', path, `excluded pair ${a.notPair} does not make ${a.whole}`)
      if (a.sameAsPart && earlier(a.sameAsPart)?.answer.kind !== 'split') add('QG-5', path, `same-as-part "${a.sameAsPart}" is not an earlier split part`)
      break
    case 'bond-parts': {
      if (!a.asked.length) add('QG-5', path, 'bond asks nothing')
      if (a.parts && typeof a.whole === 'number' && a.parts.every((x) => typeof x === 'number')) {
        const s = (a.parts as number[]).reduce((x, y) => x + y, 0)
        if (s !== a.whole) add('QG-5', path, `bond key: parts ${a.parts.join(' and ')} do not make the whole ${a.whole}`)
      }
      if (a.parts && typeof a.whole === 'number') for (const x of a.parts) if (typeof x === 'number' && x >= a.whole) add('QG-5', path, `part ${x} is not smaller than the whole ${a.whole}`)
      if (!a.parts && !a.sameAsPart) add('QG-5', path, 'bond with no parts and no split to copy')
      if (a.sameAsPart && earlier(a.sameAsPart)?.answer.kind !== 'split') add('QG-5', path, `same-as-part "${a.sameAsPart}" is not an earlier split part`)
      break
    }
    case 'sentence-match':
      if (!a.accepts.length) add('QG-5', path, 'no accepted sentence')
      for (const s of a.accepts) if (evalSentence(s) === false) add('QG-5', path, `accepted sentence "${s}" is false`)
      break
    case 'paper-ack':
      for (const s of a.accepts) if (evalSentence(s) !== true) add('QG-5', path, `accepted sentence "${s}" is not a true full sentence`)
      break
    case 'choice-key': {
      const cs = choicesOf(p)
      const keyKey = a.key
      if (!cs.some((c) => c.key === keyKey)) add('QG-5', path, `key ${keyKey} is not among the choices`)
      else if (cs.find((c) => c.key === keyKey)!.rule !== null) add('QG-5', path, `key ${keyKey} carries a misconception rule`)
      break
    }
    case 'truth-set': {
      const rows = rowsOf(p)
      const want = rows.map((r) => (r.truth ? 'T' : 'F')).join('')
      if (a.value !== want) add('QG-5', path, `truth key ${a.value} ≠ rows ${want}`)
      if (rows.length && (rows.every((r) => r.truth) || rows.every((r) => !r.truth))) add('QG-5', path, 'rows are all true or all false (L51)')
      break
    }
    case 'ack':
      break
  }
}

// ---------------------------------------------------------------------------
// forms: QG-1, demo facts, QG-4
// ---------------------------------------------------------------------------

/** The operand tuple QG-1 compares: the printed givens, or (nothing printed) the drawn numbers. */
export function operandSignature(item: SMItem): string {
  if (item.givens.length >= 2) return `g:${item.givens.join(',')}`
  const nums = Object.entries(item.generator.params).filter(([, x]) => typeof x === 'number').map(([k, x]) => `${k}=${x}`)
  return `${item.templateId}|${item.givens.join(',')}|${nums.join(',')}`
}

export type FormKind = 'check' | 'entry' | 'placement' | 'day'

export function validateForm(items: SMItem[], kind: FormKind, demo: SMFact[] = [], base = kind): SMViolation[] {
  const out: SMViolation[] = []
  items.forEach((it, i) => out.push(...validateItem(it, `${base}[${i}]`)))
  const seen = new Map<string, number>()
  items.forEach((it, i) => {
    const sig = operandSignature(it)
    if (seen.has(sig)) out.push({ gate: 'QG-1', path: `${base}[${i}]`, message: `operand tuple ${sig} repeats item ${seen.get(sig)}` })
    else seen.set(sig, i)
  })
  if (kind === 'check') {
    // SM-FAMILY: no two items on one check share a fact family (stage-1 review: A1, A2 and C7 all
    // landed on 10 = 8 + 2, so working out one answered two more). SM-MINPART: no part of 1 on an
    // item worth 2 points or more (the 1-point quick sums may use one).
    const fam = new Map<string, number>()
    items.forEach((it, i) => {
      if (!it.fact) return
      const key = `${it.fact.whole}:${[...it.fact.parts].sort((p, q) => p - q).join(',')}`
      if (fam.has(key)) out.push({ gate: 'SM-FAMILY', path: `${base}[${i}]`, message: `fact family ${it.fact.whole} = ${it.fact.parts.join(' + ')} repeats item ${fam.get(key)}` })
      else fam.set(key, i)
      const itemPoints = it.parts.reduce((t, pt) => t + (pt.points ?? 0), 0)
      if (itemPoints >= 2 && it.fact.parts.some((x) => x < 2)) out.push({ gate: 'SM-MINPART', path: `${base}[${i}]`, message: `check item uses a part of ${Math.min(...it.fact.parts)}` })
    })
  }
  if (kind !== 'day') {
    items.forEach((it, i) => {
      if (it.fact && demo.some((d) => sameFact(d, it.fact!))) {
        out.push({ gate: 'SM-DEMO', path: `${base}[${i}]`, message: `uses the demo fact ${it.fact.whole} = ${it.fact.parts.join(' + ')}` })
      }
    })
  }
  return out
}

/** QG-4: a fresh form pairs with the earlier one by index (same template) and shares no operand tuple. */
export function formsDisjoint(a: SMItem[], b: SMItem[]): SMViolation[] {
  const out: SMViolation[] = []
  if (a.length !== b.length) return [{ gate: 'QG-4', path: 'forms', message: `forms differ in length (${a.length} vs ${b.length})` }]
  const sigsA = new Set(a.map(operandSignature))
  b.forEach((it, i) => {
    if (it.templateId !== a[i].templateId) out.push({ gate: 'QG-4', path: `formB[${i}]`, message: `template ${it.templateId} ≠ form A's ${a[i].templateId}` })
    if (sigsA.has(operandSignature(it))) out.push({ gate: 'QG-4', path: `formB[${i}]`, message: `operand tuple ${operandSignature(it)} reuses form A` })
    if (JSON.stringify(it.generator.params) === JSON.stringify(a[i].generator.params)) out.push({ gate: 'QG-4', path: `formB[${i}]`, message: 'same numbers as form A' })
  })
  return out
}
