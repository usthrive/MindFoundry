/**
 * sm-schema-test — the Singapore Method module's tables are its own and locked to the
 * child's parent (school-math BUILD-PLAN v2 stage 0, §5.2).
 *
 * Run (from frontend/): npx tsx scripts/sm-schema-test.ts
 *
 * Reads every supabase/migrations/*_sm_*.sql file and asserts, per CREATE TABLE:
 *   prefix      the table name starts with sm_;
 *   rls         ALTER TABLE <t> ENABLE ROW LEVEL SECURITY is present;
 *   policies    upsert tables have exactly SELECT, INSERT, UPDATE, DELETE policies; tables
 *               declared "-- sm:append-only <t>" have SELECT, INSERT, DELETE and NO UPDATE;
 *   ownership   every policy's expression is the house pattern on its OWN table
 *               (children c WHERE c.id = <t>.child_id AND c.user_id = auth.uid());
 *   declared    every append-only declaration names a table the file creates;
 *   no-overlap  no sm_ table is created by two files.
 * Broken controls (each must fail): a table without RLS; an append-only table with an UPDATE
 * policy; a table without the sm_ prefix; a policy that checks another table's child_id; an
 * upsert table missing its DELETE policy.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const MIGRATIONS = path.join(here, '../../supabase/migrations')

type Verb = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'

export function schemaViolations(sql: string, file = 'fixture'): { tables: string[]; problems: string[] } {
  const problems: string[] = []
  const body = sql.replace(/--[^\n]*/g, (c) => (c.includes('sm:append-only') ? c : ''))
  const tables = [...body.matchAll(/CREATE TABLE IF NOT EXISTS\s+(\w+)/gi)].map((m) => m[1])
  const appendOnly = new Set([...sql.matchAll(/--\s*sm:append-only\s+(\w+)/g)].map((m) => m[1]))
  for (const t of appendOnly) if (!tables.includes(t)) problems.push(`${file}: append-only declaration names '${t}', which this file does not create`)

  const policies = [...body.matchAll(/CREATE POLICY\s+"([^"]+)"\s+ON\s+(\w+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)\s+(USING|WITH CHECK)\s*\(([\s\S]*?)\);/gi)]
  for (const t of tables) {
    if (!t.startsWith('sm_')) problems.push(`${file}: table '${t}' lacks the sm_ prefix`)
    if (!new RegExp(`ALTER TABLE\\s+${t}\\s+ENABLE ROW LEVEL SECURITY`, 'i').test(body)) problems.push(`${file}: ${t} has no RLS`)
    const mine = policies.filter((p) => p[2] === t)
    const verbs = mine.map((p) => p[3].toUpperCase() as Verb)
    const want: Verb[] = appendOnly.has(t) ? ['SELECT', 'INSERT', 'DELETE'] : ['SELECT', 'INSERT', 'UPDATE', 'DELETE']
    for (const v of want) if (verbs.filter((x) => x === v).length !== 1) problems.push(`${file}: ${t} needs exactly one ${v} policy (has ${verbs.filter((x) => x === v).length})`)
    if (appendOnly.has(t) && verbs.includes('UPDATE')) problems.push(`${file}: append-only ${t} has an UPDATE policy`)
    const own = new RegExp(`EXISTS\\s*\\(\\s*SELECT 1 FROM children c WHERE c\\.id = ${t}\\.child_id AND c\\.user_id = auth\\.uid\\(\\)\\s*\\)`)
    for (const p of mine) if (!own.test(p[5])) problems.push(`${file}: policy "${p[1]}" is not the ownership pattern on ${t}`)
  }
  for (const p of policies) if (!tables.includes(p[2])) problems.push(`${file}: policy "${p[1]}" is on '${p[2]}', a table this file does not create`)
  return { tables, problems }
}

let failed = 0
function expect(label: string, ok: boolean, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`)
  if (!ok) failed++
}

// 1. The real migrations.
const files = fs.readdirSync(MIGRATIONS).filter((f) => /_sm_.*\.sql$/.test(f)).sort()
expect('at least one sm_ migration file exists', files.length > 0, files.join(', '))
const seen = new Map<string, string>()
let tableCount = 0
for (const f of files) {
  const { tables, problems } = schemaViolations(fs.readFileSync(path.join(MIGRATIONS, f), 'utf8'), f)
  tableCount += tables.length
  expect(`${f}: ${tables.length} tables, all sm_, RLS on, policies by the house pattern`, problems.length === 0 && tables.length > 0, problems.join('; '))
  for (const t of tables) {
    const prev = seen.get(t)
    expect(`${t} is created by one file only`, !prev, prev ? `also in ${prev}` : '')
    seen.set(t, f)
  }
}
console.log(`      tables checked: ${tableCount}`)

// 2. Broken controls, built from a small valid fixture.
const pol = (t: string, verb: Verb, clauseTable = t) => {
  const kw = verb === 'INSERT' ? 'WITH CHECK' : 'USING'
  return `CREATE POLICY "p ${verb} ${t}" ON ${t}\n  FOR ${verb} ${kw} (\n    EXISTS (SELECT 1 FROM children c WHERE c.id = ${clauseTable}.child_id AND c.user_id = auth.uid())\n  );\n`
}
const table = (t: string, opts: { rls?: boolean; verbs?: Verb[]; clauseTable?: string } = {}) =>
  `CREATE TABLE IF NOT EXISTS ${t} (id UUID, child_id UUID);\n` +
  (opts.rls === false ? '' : `ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;\n`) +
  (opts.verbs ?? (['SELECT', 'INSERT', 'UPDATE', 'DELETE'] as Verb[])).map((v) => pol(t, v, opts.clauseTable ?? t)).join('')

const good = table('sm_a') + '-- sm:append-only sm_b\n' + table('sm_b', { verbs: ['SELECT', 'INSERT', 'DELETE'] })
expect('valid fixture passes (the controls below are not failing for an unrelated reason)', schemaViolations(good).problems.length === 0, schemaViolations(good).problems.join('; '))
const controls: Array<[string, string]> = [
  ['a table without RLS', good + table('sm_c', { rls: false })],
  ['an append-only table with an UPDATE policy', '-- sm:append-only sm_d\n' + table('sm_d')],
  ['a table without the sm_ prefix', good + table('item_attempts')],
  ['a policy that checks another table\'s child_id', good + table('sm_e', { clauseTable: 'sm_a' })],
  ['an upsert table missing its DELETE policy', good + table('sm_f', { verbs: ['SELECT', 'INSERT', 'UPDATE'] })],
]
for (const [label, sql] of controls) {
  const { problems } = schemaViolations(sql)
  expect(`broken control fires: ${label}`, problems.length > 0, problems[0] ?? 'no violation found')
}

console.log(failed === 0 ? '\nsm-schema-test: PASS' : `\nsm-schema-test: FAIL (${failed})`)
process.exit(failed === 0 ? 0 : 1)
