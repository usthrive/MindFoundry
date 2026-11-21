/**
 * The School Math template registry (ENGINE-SPEC §2.2): templateId → definition, the same
 * shape as Best Brains' registry, so QG-5 (answerFor) and QG-11 (verifyFor) run on every
 * emitted item. Every emitted item's templateId must resolve (FIX-SPEC §5).
 *
 * `buildItem` is the one way to make an item: it opens the seeded stream
 * `sm:<unit>:<template>:<stream>` (rng.ts, imported read-only) and calls the template.
 */

import { streamRng } from '../../best-brains/generator/rng'
import type { SMBuildCtx, SMItem, SMRole, SMTemplateDef } from '../types'
import { G1U02_TEMPLATES } from './units/g1u02'
import { G1U01_RETURN_TEMPLATES, PREVIEW_TEMPLATES } from './units/g1u01-returns'

let registry: ReadonlyMap<string, SMTemplateDef> | null = null

function all(): ReadonlyMap<string, SMTemplateDef> {
  if (!registry) {
    const defs = [...G1U02_TEMPLATES, ...G1U01_RETURN_TEMPLATES, ...PREVIEW_TEMPLATES]
    const m = new Map<string, SMTemplateDef>()
    for (const d of defs) {
      if (m.has(d.id)) throw new Error(`duplicate template id ${d.id}`)
      m.set(d.id, d)
    }
    registry = m
  }
  return registry
}

export function getSMTemplate(id: string): SMTemplateDef | undefined {
  return all().get(id)
}

export function allSMTemplates(): SMTemplateDef[] {
  return [...all().values()]
}

/** Templates of one unit (the outside templates are listed under their own units). */
export function unitTemplates(unitId: string): SMTemplateDef[] {
  return allSMTemplates().filter((d) => d.unitId === unitId)
}

export interface BuildArgs extends Partial<Omit<SMBuildCtx, 'seed' | 'role'>> {
  seed: number
  role?: SMRole
}

/** Build one item of a template at a seed. Role defaults to the template's first use. */
export function buildItem(templateId: string, args: BuildArgs): SMItem {
  const def = getSMTemplate(templateId)
  if (!def) throw new Error(`unknown template ${templateId}`)
  const ctx: SMBuildCtx = {
    role: args.role ?? def.uses[0],
    seed: args.seed,
    stream: args.stream ?? 'main',
    options: args.options,
    force: args.force,
    avoidFacts: args.avoidFacts,
    minPart: args.minPart,
    partsOnly: args.partsOnly,
  }
  const rng = streamRng(ctx.seed, `sm:${def.unitId}:${def.id}:${ctx.stream}`)
  return def.build.call(def, rng, ctx)
}
