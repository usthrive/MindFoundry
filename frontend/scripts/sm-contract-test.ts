/**
 * sm-contract-test — every module describes itself with its OWN contract kinds, never one
 * borrowed from another module (school-math BUILD-PLAN v2 stage 0; HANDOFF §7 "new kinds,
 * never an overloaded one").
 *
 * Run (from frontend/): npx tsx scripts/sm-contract-test.ts
 *
 * Asserts, on the real registry:
 *   owned      each descriptor kind a module uses (unit kind, placement, session generator,
 *              progress schema, parent report) is on that module's own list below;
 *   unshared   no kind is used by two modules;
 *   tables     each module's progress tables carry its prefix (bb_, sm_), so its records can
 *              never be read as another module's.
 * Broken controls (each must fail, or the gate is unproven): a fixture module that reuses
 * 'bb-week-state'; a fixture whose school-math progress table lacks the sm_ prefix; a fixture
 * where school-math and Kumon both claim 'parent-selected' (the v1 overload this stage fixed).
 */
import { MODULE_REGISTRY } from '../src/modules/core/registry'
import type { MindFoundryModule, ModuleId } from '../src/modules/core/contract'

const OWNED: Record<ModuleId, readonly string[]> = {
  kumon: ['worksheet', 'parent-selected', 'worksheet-generator', 'kumon-worksheet-progress', 'dashboard-metrics'],
  'best-brains': ['week', 'diagnostic-adaptive', 'weekly-pack-generator', 'bb-week-state', 'bb-weekly-narrative'],
  'school-math': ['chapter-unit', 'placement-ladder', 'chapter-unit-generator', 'sm-device-local', 'sm-skill-state', 'sm-scorecard'],
}
const TABLE_PREFIX: Partial<Record<ModuleId, string>> = { 'best-brains': 'bb_', 'school-math': 'sm_' }

function kindsOf(m: MindFoundryModule): string[] {
  return [
    ...new Set(m.levels.map((l) => l.unitKind)),
    m.placement.kind,
    m.sessionGenerator.kind,
    m.progressSchema.kind,
    m.parentReportSchema.kind,
  ]
}

/** Returns the list of violations for a registry (empty = pass). */
export function contractViolations(reg: Record<string, MindFoundryModule>): string[] {
  const out: string[] = []
  const usedBy = new Map<string, string>()
  for (const [id, m] of Object.entries(reg)) {
    const owned = OWNED[id as ModuleId] ?? []
    for (const k of kindsOf(m)) {
      if (!owned.includes(k)) out.push(`${id}: kind '${k}' is not one of its own kinds`)
      const prev = usedBy.get(k)
      if (prev && prev !== id) out.push(`kind '${k}' is used by both ${prev} and ${id}`)
      usedBy.set(k, id)
    }
    const prefix = TABLE_PREFIX[id as ModuleId]
    if (prefix) {
      for (const t of m.progressSchema.tables) {
        if (!t.startsWith(prefix)) out.push(`${id}: progress table '${t}' lacks the ${prefix} prefix`)
      }
    }
  }
  return out
}

let failed = 0
function expect(label: string, ok: boolean, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`)
  if (!ok) failed++
}

// 1. The real registry.
const real = contractViolations(MODULE_REGISTRY)
expect('real registry: every module uses only its own kinds, no kind shared, tables prefixed', real.length === 0, real.join('; '))
console.log(`      modules checked: ${Object.keys(MODULE_REGISTRY).join(', ')}`)

// 2. Broken controls — each must produce at least one violation.
const sm = MODULE_REGISTRY['school-math']
const controls: Array<[string, Record<string, MindFoundryModule>]> = [
  ['school-math reuses bb-week-state', { ...MODULE_REGISTRY, 'school-math': { ...sm, progressSchema: { kind: 'bb-week-state', tables: [] } } }],
  ['school-math progress table without sm_ prefix', { ...MODULE_REGISTRY, 'school-math': { ...sm, progressSchema: { kind: 'sm-skill-state', tables: ['item_attempts'] } } }],
  ['school-math claims Kumon\'s parent-selected', { ...MODULE_REGISTRY, 'school-math': { ...sm, placement: { ...sm.placement, kind: 'parent-selected' } } }],
]
for (const [label, reg] of controls) {
  const v = contractViolations(reg)
  expect(`broken control fires: ${label}`, v.length > 0, v[0] ?? 'no violation found')
}

console.log(failed === 0 ? '\nsm-contract-test: PASS' : `\nsm-contract-test: FAIL (${failed})`)
process.exit(failed === 0 ? 0 : 1)
