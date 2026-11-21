/**
 * Helpers every template uses: seeded draws with redraw, the demo-fact screen, review
 * lines by rule (collisions dropped), and the item scaffold that fills the fields the
 * gates read (spoken lines, rule list, ladder).
 */

import type { Rng } from '../../../best-brains/generator/rng'
import type {
  ModelRung, SMBuildCtx, SMChoice, SMFact, SMFigure, SMItem, SMPart, SMReviewRule, SMTruthRow,
} from '../../types'
import { getRule, ruleValue, type RuleArgs } from './misconceptions'
import { ladderFor } from './ladders'
import { sentencesOf } from './text'

/** A draw that the caller asked to fix (fixtures, the dump) or a uniform integer. */
export function drawInt(rng: Rng, ctx: SMBuildCtx, name: string, lo: number, hi: number): number {
  const f = ctx.force?.[name]
  if (typeof f === 'number') return f
  return rng.int(lo, hi)
}

export function option<T extends string>(ctx: SMBuildCtx, name: string, allowed: readonly T[]): T | undefined {
  const v = ctx.options?.[name]
  if (v === undefined) return undefined
  if (typeof v !== 'string' || !(allowed as readonly string[]).includes(v)) {
    throw new Error(`option ${name}=${String(v)} not one of ${allowed.join(', ')}`)
  }
  return v as T
}

/** Keep drawing until the attempt returns a value; throw after `tries` (a draw constraint that cannot be met). */
export function redraw<T>(what: string, attempt: (i: number) => T | null, tries = 400): T {
  for (let i = 0; i < tries; i++) {
    const v = attempt(i)
    if (v !== null) return v
  }
  throw new Error(`${what}: no draw met the constraints in ${tries} tries`)
}

export function sameFact(x: SMFact, y: SMFact): boolean {
  if (x.whole !== y.whole) return false
  const a = [...x.parts].sort((p, q) => p - q)
  const b = [...y.parts].sort((p, q) => p - q)
  return a[0] === b[0] && a[1] === b[1]
}

/** True when the draw lands on a fact the caller must avoid (a demo fact on a check). */
export function blocked(ctx: SMBuildCtx, fact: SMFact | undefined): boolean {
  if (!fact) return false
  if (ctx.minPart && fact.parts.some((p) => p < (ctx.minPart as number))) return true
  if (!ctx.avoidFacts) return false
  return ctx.avoidFacts.some((f) => sameFact(f, fact))
}

/**
 * Review lines for a typed answer: one per rule that gives an honest value on this draw.
 * A value equal to the key, or shared by two rules (the rule could not be named), is
 * dropped — never patched.
 */
export function reviewRules(args: RuleArgs, key: number, rules: string[]): SMReviewRule[] {
  const drafts: SMReviewRule[] = []
  for (const rule of rules) {
    const v = ruleValue(rule, args)
    if (v === null || v < 0 || v === key) continue
    drafts.push({ rule, value: v, line: getRule(rule).line })
  }
  return drafts.filter((d) => drafts.filter((e) => e.value === d.value).length === 1)
}

/** A review line whose value is a pair or a sentence (checked by the rule's content check). */
export function reviewText(rule: string, value: string): SMReviewRule {
  return { rule, value, line: getRule(rule).line }
}

export interface ItemSpec {
  templateId: string
  unitId: string
  lessonId: string
  ctx: SMBuildCtx
  skillIds: string[]
  modelRung: ModelRung
  formatCode: string
  prompt: string
  /** The prompt as read aloud, when it differs from the printed one (e.g. "ten and 5"). */
  spokenPrompt?: string
  figures: SMFigure[]
  parts: SMPart[]
  ladderFamily: string
  params: Record<string, unknown>
  givens: number[]
  fact?: SMFact
  lessonOnly?: boolean
  label?: string
  /** Rules the item names that are not on a choice, row or review line. */
  extraRules?: string[]
}

function choicesOf(p: SMPart): SMChoice[] {
  return p.surface.kind === 'choices' ? p.surface.choices : []
}
function rowsOf(p: SMPart): SMTruthRow[] {
  return p.surface.kind === 'truth' ? p.surface.rows : []
}

/** Assemble an SMItem: parts filtered by `partsOnly`, spoken lines and rule list derived. */
export function makeItem(s: ItemSpec): SMItem {
  let parts = s.parts
  if (s.ctx.partsOnly) {
    const keep = new Set(s.ctx.partsOnly)
    parts = parts.filter((p) => keep.has(p.id)).map((p) => ({ ...p, reveal: 'with-item' as const }))
    if (parts.length === 0) throw new Error(`${s.templateId}: partsOnly kept no part`)
  }
  const ladder = ladderFor(s.ladderFamily)
  const rules = new Set<string>(s.extraRules ?? [])
  for (const p of parts) {
    for (const c of choicesOf(p)) if (c.rule) rules.add(c.rule)
    for (const r of rowsOf(p)) if (r.rule) rules.add(r.rule)
    for (const r of p.reviewRules) rules.add(r.rule)
  }
  const spoken: string[] = []
  spoken.push(...sentencesOf(s.spokenPrompt ?? s.prompt))
  for (const f of s.figures) spoken.push(f.spoken)
  for (const p of parts) {
    if (p.prompt) spoken.push(...sentencesOf(p.prompt))
    // A sentence with a typed blank is read aloud; a chip-built sentence is not (its chips are).
    if ((p.surface.kind === 'sentence' && p.surface.input === 'pad') || (p.surface.kind === 'pad' && p.surface.text)) {
      spoken.push(p.surface.text as string)
    }
    for (const r of rowsOf(p)) spoken.push(r.text)
    for (const r of p.reviewRules) spoken.push(...sentencesOf(r.line))
  }
  for (const r of ladder) spoken.push(...sentencesOf(r.say))
  const { seed, stream, role } = s.ctx
  return {
    id: `${s.templateId}@${seed}/${stream}${role === 'review' ? '-FX-' : ''}`,
    unitId: s.unitId,
    lessonId: s.lessonId,
    templateId: s.templateId,
    role,
    modelRung: s.modelRung,
    skillIds: s.skillIds,
    formatCode: s.formatCode,
    prompt: s.prompt,
    figures: s.figures,
    parts,
    misconceptionRules: [...rules].sort(),
    spokenLines: [...new Set(spoken)],
    ladderFamily: s.ladderFamily,
    ladder,
    generator: { templateId: s.templateId, params: s.params, seed, stream, options: s.ctx.options, partsOnly: s.ctx.partsOnly },
    givens: s.givens,
    fact: s.fact,
    lessonOnly: !!s.lessonOnly,
    label: s.label,
  }
}

/** Read a numeric param (throws, audit-catchable, when missing). */
export function num(p: Record<string, unknown>, k: string): number {
  const v = p[k]
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`param '${k}' missing or non-numeric`)
  return v
}

export function str(p: Record<string, unknown>, k: string): string {
  const v = p[k]
  if (typeof v !== 'string') throw new Error(`param '${k}' missing or not text`)
  return v
}

export const BOND_SPOKEN = 'a number bond: a whole and two parts'
