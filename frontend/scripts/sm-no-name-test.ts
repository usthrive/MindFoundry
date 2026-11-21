/**
 * sm-no-name-test — no child's name anywhere the module reaches (BUILD-PLAN §8.1;
 * ENGINE-SPEC §6.5; LEARNINGS S1).
 *
 * Run (from frontend/): MF_NO_NAME_LIST=<path> npx tsx scripts/sm-no-name-test.ts
 *
 * The names are on a LOCAL list that never enters the repo: the owner creates the file (one
 * name per line) and gives the build only its path, in the environment variable
 * MF_NO_NAME_LIST. The gate FAILS CLOSED, with a plain message, when the variable is unset,
 * the file is missing, or it holds no name. It never prints the list or a match: only
 * counts and where.
 *
 * Content half: whole-word, case-insensitive matching over every generated surface (200
 * seeds, simulated units included), every file under frontend/src/modules/school-math/, and
 * every text file under modules/school-math/ (binary files are counted, not read).
 * Broken control: a fixture string built at run time from the list's first line must be
 * found; it prints only "planted name found: yes".
 * Payload half: school-math has no payload builder that leaves the device yet (the gate
 * searches its source for network calls and lists any it finds). What will leave the device
 * at stage 5 is the attempt record; its keys are checked structurally against an allowed
 * set with no name field. Control: a payload fixture with a `childName` key must fail.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { attemptFrom } from '../src/modules/school-math/engine/assemble'
import { buildItem } from '../src/modules/school-math/engine/registry'
import { FIXED_LINES, generatedCorpus, itemTexts } from './sm-lib-corpus'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(HERE, '../src/modules/school-math')
const MOD = resolve(HERE, '../../modules/school-math')
let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

// ---------------------------------------------------------------------------
// payload half (runs whether or not the list exists)
// ---------------------------------------------------------------------------

/** The keys an attempt record may carry when it leaves the device (BUILD-PLAN §5.2; no name field). */
export const ALLOWED_PAYLOAD_KEYS = new Set([
  'itemId', 'templateId', 'unitId', 'lessonId', 'role', 'skillIds', 'firstTryCorrect', 'tries', 'answers', 'firstTryMs',
  'scaffoldVisible', 'ladderRung', 'dayKind', 'localDay', 'createdAt', 'signature', 'options', 'comebackKey',
])

export function payloadProblems(payload: Record<string, unknown>): string[] {
  const out: string[] = []
  const walk = (o: unknown, path: string) => {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (/name/i.test(k)) out.push(`${path}${k} is a name field`)
      walk(v, `${path}${k}.`)
    }
  }
  for (const k of Object.keys(payload)) if (!ALLOWED_PAYLOAD_KEYS.has(k)) out.push(`key ${k} is not on the allowed list`)
  walk(payload, '')
  return out
}

function filesUnder(dir: string): string[] {
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    const st = statSync(p)
    if (st.isDirectory()) out.push(...filesUnder(p))
    else out.push(p)
  }
  return out
}

console.log('\npayload half — what leaves the device')
{
  const src = filesUnder(SRC).filter((f) => /\.(ts|tsx)$/.test(f))
  const NET = /\bfetch\(|supabase|\.insert\(|\.upsert\(|functions\.invoke|XMLHttpRequest|sendBeacon/
  const builders = src.filter((f) => NET.test(readFileSync(f, 'utf8'))).map((f) => f.slice(SRC.length + 1))
  console.log(`    school-math source files that call the network: ${builders.length ? builders.join(', ') : 'none (no payload builder exists yet; records are in memory until stage 5)'}`)
  const it = buildItem('sm.g1u02.l4.sub_pad', { seed: 3, role: 'practice' })
  const rec = attemptFrom(it, { dayKind: 'practice', localDay: '2026-11-24', createdAt: '2026-11-24T21:00:00.000Z', comebackKey: 'k' }, { firstTryCorrect: false, answers: ['9'] })
  const p = payloadProblems(rec as unknown as Record<string, unknown>)
  say(builders.length === 0 && p.length === 0, `the attempt record's keys (${Object.keys(rec).length}) are all on the allowed set, none a name field${p.length ? ' — ' + p.join('; ') : ''}`)
  const fx = { ...rec, childName: 'fixture' } as unknown as Record<string, unknown>
  say(payloadProblems(fx).length > 0, 'control fired: a payload fixture with a childName key fails')
}

// ---------------------------------------------------------------------------
// content half (fails closed without the list)
// ---------------------------------------------------------------------------

function finish(): never {
  console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-no-name-test: ${checks - failures}/${checks} checks`)
  process.exit(failures === 0 ? 0 : 1)
}

console.log('\ncontent half — the local no-name list')
const path = process.env.MF_NO_NAME_LIST
if (!path) {
  say(false, 'MF_NO_NAME_LIST is not set: the gate fails closed. The owner creates the list (one name per line, outside the repo) and sets MF_NO_NAME_LIST to its path (BUILD-PLAN §8.1).')
  finish()
}
if (!existsSync(path as string)) {
  say(false, 'MF_NO_NAME_LIST points to no file: the gate fails closed (the path is not printed back).')
  finish()
}
const names = readFileSync(path as string, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
if (!names.length) {
  say(false, 'the no-name list holds no name: the gate fails closed.')
  finish()
}
console.log(`    list read: ${names.length} name(s) (never printed)`)
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const patterns = names.map((n) => new RegExp(`(?<![A-Za-z0-9])${esc(n)}(?![A-Za-z0-9])`, 'i'))
const hits = (text: string) => patterns.some((re) => re.test(text))

{
  const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
  const corpus = generatedCorpus(SEEDS, SEEDS.slice(0, 40))
  let strings = 0
  const found: string[] = []
  for (const { surface, item } of corpus) for (const t of itemTexts(item)) { strings++; if (hits(t.text)) found.push(`${surface} ${item.templateId} ${t.path}`) }
  for (const l of FIXED_LINES) { strings++; if (hits(l.text)) found.push(`fixed ${l.path}`) }
  say(found.length === 0, `generated surfaces: ${corpus.length} items, ${strings} strings — matches ${found.length}${found.length ? ' at ' + found.slice(0, 5).join('; ') : ''}`)

  const srcFiles = filesUnder(SRC)
  const srcHits = srcFiles.filter((f) => hits(readFileSync(f, 'utf8'))).map((f) => f.slice(SRC.length + 1))
  say(srcHits.length === 0, `frontend/src/modules/school-math/: ${srcFiles.length} files — files with a match ${srcHits.length}${srcHits.length ? ': ' + srcHits.join(', ') : ''}`)

  const modFiles = filesUnder(MOD)
  let binary = 0
  const modHits: string[] = []
  for (const f of modFiles) {
    const buf = readFileSync(f)
    if (buf.subarray(0, 8000).includes(0)) { binary++; continue }
    if (hits(buf.toString('utf8'))) modHits.push(f.slice(MOD.length + 1))
  }
  say(modHits.length === 0, `modules/school-math/: ${modFiles.length - binary} text files scanned (${binary} binary files counted, not read) — files with a match ${modHits.length}${modHits.length ? ': ' + modHits.join(', ') : ''}`)

  // broken control: a fixture string planted from the list's first line, built now
  const planted = buildItem('sm.g1u02.l6.join_story', { seed: 3 })
  planted.prompt = `There are 3 ducks. ${names[0]} sees 2 more.`
  const pf = itemTexts(planted).some((t) => hits(t.text))
  say(pf, `control fired: planted name found: ${pf ? 'yes' : 'no'}`)
}
finish()
