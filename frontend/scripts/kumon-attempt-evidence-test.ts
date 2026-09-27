/**
 * kumon-attempt-evidence-test — every Kumon attempt carries first-try evidence.
 *
 * Run (from frontend/): npx tsx scripts/kumon-attempt-evidence-test.ts
 *
 * WHY (2026-09-26, docs/BRIEF-2026-09-26-RECALL-NOT-LOOKUP.md, P0). One child's
 * Level C record read 419 of 419 correct; 305 were right on the first try, the
 * times table sat open with no record of it, and every `time_spent` was 0 —
 * the worksheet grid passed a literal 0 and never passed the table flag. A zero
 * like that is a blind sensor, not a fact about the child. This gate asserts
 * the sensors exist and work:
 *
 *   clock      the dwell clock times only the ACTIVE problem, pauses while the
 *              app is hidden, and stops at the page's first check.
 *   ledger     table exposure is recorded per active problem before the first
 *              check; a reveal implies shown; nothing moves after the check.
 *   payload    every EVIDENCE_KEY reaches `hints_used`; unknown time is null.
 *   sources    every `saveProblemAttempt(` call in StudyPage passes a real time
 *              (never a literal 0) and an `evidence:`; the grid builds evidence;
 *              StudyPage feeds the grid the table's visibility and mode, and
 *              routes the card's reveal to it.
 *
 * Each check runs once on the real code and once on a deliberately broken
 * control that must be caught (a gate never seen to fail is unproven).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as real from '../src/services/attemptEvidence'
import {
  EVIDENCE_KEYS,
  evidencePayload,
  firstTrySeconds,
  type AttemptEvidence,
  type DwellClock,
  type ScaffoldLedger,
} from '../src/services/attemptEvidence'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => {
  checks++
  if (!ok) failures++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`)
}

// ---------------------------------------------------------------------------
// clock
// ---------------------------------------------------------------------------
interface ClockImpl {
  dwellStart: () => DwellClock
  dwellSwitch: (c: DwellClock, k: string | null, now: number) => DwellClock
  dwellFreeze: (c: DwellClock, keys: string[], now: number) => DwellClock
  dwellMs: (c: DwellClock, k: string) => number | null
}

/** One page, three problems, a trip away from the app, a first check, then retries. */
function clockFindings(impl: ClockImpl): string[] {
  const out: string[] = []
  let c = impl.dwellStart()
  c = impl.dwellSwitch(c, 'p1', 0)
  c = impl.dwellSwitch(c, 'p2', 5_000) // p1: 5 s
  c = impl.dwellSwitch(c, null, 7_000) // p2: 2 s, then the app is hidden
  c = impl.dwellSwitch(c, 'p2', 60_000) // back after 53 s away — not problem time
  c = impl.dwellSwitch(c, 'p3', 62_000) // p2: +2 s = 4 s
  c = impl.dwellFreeze(c, ['p1', 'p2', 'p3'], 65_000) // p3: 3 s; first check
  c = impl.dwellSwitch(c, 'p1', 70_000) // retry work on p1 — not first-try time
  c = impl.dwellSwitch(c, 'p2', 90_000)
  c = impl.dwellFreeze(c, [], 95_000)
  const want: Record<string, number> = { p1: 5_000, p2: 4_000, p3: 3_000 }
  for (const [k, v] of Object.entries(want)) {
    const got = impl.dwellMs(c, k)
    if (got !== v) out.push(`${k}: ${got} ms, want ${v}`)
  }
  if (impl.dwellMs(c, 'never-active') !== null) out.push('a never-active problem must read null, not 0')
  return out
}

console.log('\nclock — time on the active problem, paused while away, frozen at the first check')
const clockReal = clockFindings(real)
say(clockReal.length === 0, `real dwell clock${clockReal.length ? ': ' + clockReal.join('; ') : ''}`)
{
  // Control A: the away time is counted (no pause on hide).
  const noPause: ClockImpl = { ...real, dwellSwitch: (c, k, now) => real.dwellSwitch(c, k ?? c.activeKey, now) }
  // Control B: freezing does nothing, so retries pile into first-try time.
  const noFreeze: ClockImpl = { ...real, dwellFreeze: (c, _keys, now) => real.dwellSwitch(c, c.activeKey, now) }
  // Control C: the pre-P0 behaviour — every problem is 0.
  const zero: ClockImpl = { ...real, dwellMs: () => 0 }
  say(clockFindings(noPause).length > 0, 'control fires: a clock that counts time away from the app')
  say(clockFindings(noFreeze).length > 0, 'control fires: a clock that keeps timing after the first check')
  say(clockFindings(zero).length > 0, 'control fires: the pre-P0 grid, where every time is 0')
}

// ---------------------------------------------------------------------------
// ledger
// ---------------------------------------------------------------------------
interface LedgerImpl {
  scaffoldStart: () => ScaffoldLedger
  scaffoldObserve: (l: ScaffoldLedger, k: string | null, visible: boolean) => ScaffoldLedger
  scaffoldReveal: (l: ScaffoldLedger, k: string | null) => ScaffoldLedger
  scaffoldFreeze: (l: ScaffoldLedger, keys: string[]) => ScaffoldLedger
  scaffoldHelp: (l: ScaffoldLedger, k: string | null, rung: number) => ScaffoldLedger
}

function ledgerFindings(impl: LedgerImpl): string[] {
  const out: string[] = []
  let l = impl.scaffoldStart()
  l = impl.scaffoldObserve(l, 'p1', true) // table open on p1 ("open" sheet)
  l = impl.scaffoldObserve(l, 'p2', false) // table closed on p2
  l = impl.scaffoldReveal(l, 'p3') // tapped to uncover on p3 (card was covered)
  l = impl.scaffoldHelp(l, 'p2', 2) // help ladder: "use a fact you know"
  l = impl.scaffoldHelp(l, 'p2', 1) // reopened at rung 1 — the highest stays
  l = impl.scaffoldFreeze(l, ['p1', 'p2', 'p3', 'p4'])
  l = impl.scaffoldHelp(l, 'p2', 4) // the table during a retry — teaching, not evidence
  l = impl.scaffoldObserve(l, 'p2', true) // looked during a retry — teaching, not evidence
  l = impl.scaffoldReveal(l, 'p4')
  const expect: Array<[string, boolean, boolean]> = [
    ['p1', true, false],
    ['p2', false, false],
    ['p3', true, true],
    ['p4', false, false],
  ]
  if ((l.rung.p2 ?? 0) !== 2) out.push(`p2 help rung ${l.rung.p2 ?? 0}, want 2 (highest before the first check)`)
  if ((l.rung.p1 ?? 0) !== 0) out.push(`p1 help rung ${l.rung.p1}, want 0`)
  for (const [k, shown, revealed] of expect) {
    if (!!l.shown[k] !== shown) out.push(`${k} shown=${!!l.shown[k]}, want ${shown}`)
    if (!!l.revealed[k] !== revealed) out.push(`${k} revealed=${!!l.revealed[k]}, want ${revealed}`)
  }
  return out
}

console.log('\nledger — was the table there before the first check?')
const ledgerReal = ledgerFindings(real)
say(ledgerReal.length === 0, `real scaffold ledger${ledgerReal.length ? ': ' + ledgerReal.join('; ') : ''}`)
{
  // Control A: the pre-P0 rule — only a tap counts, an open table is invisible.
  const tapOnly: LedgerImpl = { ...real, scaffoldObserve: (l) => l }
  // Control B: retries overwrite the first-try record.
  const noFreeze: LedgerImpl = { ...real, scaffoldFreeze: (l) => l }
  say(ledgerFindings(tapOnly).length > 0, 'control fires: an always-open table that records nothing (the invisible peek)')
  say(ledgerFindings(noFreeze).length > 0, 'control fires: a look during a retry leaking into first-try evidence')
  const lastRung: LedgerImpl = { ...real, scaffoldHelp: (l, k, rung) => (k && !l.frozen[k] ? { ...l, rung: { ...l.rung, [k]: rung } } : l) }
  say(ledgerFindings(lastRung).length > 0, 'control fires: a help record that keeps the LAST rung instead of the highest')
}

// ---------------------------------------------------------------------------
// payload
// ---------------------------------------------------------------------------
console.log('\npayload — what reaches problem_attempts.hints_used')
const sample: AttemptEvidence = {
  firstTryMs: 2_600,
  triedAnswers: ['42', '48'],
  scaffoldMode: 'open',
  scaffoldShownBeforeFirstCheck: true,
  scaffoldRevealedBeforeFirstCheck: false,
  helpRungBeforeFirstCheck: 2,
}
const payload = evidencePayload(sample)
const missing = EVIDENCE_KEYS.filter((k) => !(k in payload))
say(missing.length === 0, `every EVIDENCE_KEY is written${missing.length ? ' — missing ' + missing.join(', ') : ''}`)
say(firstTrySeconds(sample) === 3, 'time_spent is first-try seconds, rounded (2.6 s → 3)')
say(firstTrySeconds({ ...sample, firstTryMs: null }) === null && evidencePayload({ ...sample, firstTryMs: null }).firstTryMs === null,
  'an unmeasured time is stored as NULL, never 0 (time_spent is nullable)')
{
  const dropped = (e: AttemptEvidence) => {
    const p = evidencePayload(e) as Record<string, unknown>
    delete p.scaffoldShownBeforeFirstCheck
    return p
  }
  const m = EVIDENCE_KEYS.filter((k) => !(k in dropped(sample)))
  say(m.length > 0, 'control fires: a payload that drops the table flag')
}

// ---------------------------------------------------------------------------
// sources
// ---------------------------------------------------------------------------
console.log('\nsources — every save path carries the evidence')
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), 'utf8')

/** Each `saveProblemAttempt(` call's full argument text. */
function saveCalls(src: string): string[] {
  const out: string[] = []
  let i = 0
  while ((i = src.indexOf('saveProblemAttempt(', i)) !== -1) {
    const before = src.slice(Math.max(0, i - 20), i)
    if (/function\s+$|import[^;]*$/.test(before)) { i += 1; continue }
    let depth = 0
    let j = i + 'saveProblemAttempt'.length
    for (; j < src.length; j++) {
      if (src[j] === '(') depth++
      else if (src[j] === ')') { depth--; if (depth === 0) break }
    }
    out.push(src.slice(i, j + 1))
    i = j
  }
  return out
}

/** The sixth positional argument (timeSpent) of a call, comments stripped. */
function timeArg(call: string): string {
  const body = call.slice(call.indexOf('(') + 1, -1).replace(/\/\/[^\n]*/g, '')
  const args: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of body) {
    if ('({['.includes(ch)) depth++
    if (')}]'.includes(ch)) depth--
    if (ch === ',' && depth === 0) { args.push(cur.trim()); cur = '' } else cur += ch
  }
  args.push(cur.trim())
  return args[5] ?? ''
}

function sourceFindings(study: string, grid: string): string[] {
  const out: string[] = []
  const calls = saveCalls(study)
  if (calls.length === 0) out.push('no saveProblemAttempt calls found in StudyPage')
  calls.forEach((c, n) => {
    if (/^0$/.test(timeArg(c))) out.push(`StudyPage save #${n + 1} passes a literal 0 for time`)
    if (!/evidence\s*:/.test(c)) out.push(`StudyPage save #${n + 1} passes no evidence`)
  })
  if (!/problemAttempts[\s\S]{0,900}evidence\s*:\s*\{/.test(grid)) out.push('WorksheetView builds attempts without evidence')
  if (!/<WorksheetView[\s\S]{0,2500}scaffoldVisible=/.test(study)) out.push('StudyPage does not tell the grid when the table is visible')
  if (!/<WorksheetView[\s\S]{0,2500}scaffoldMode=/.test(study)) out.push('StudyPage does not tell the grid the table mode')
  if (!/onReveal=\{[\s\S]{0,400}markScaffoldReveal\(\)/.test(study)) out.push("the card's reveal never reaches the grid")
  // Durations must come from the monotonic clock: the wall clock jumped 10–12 s
  // backwards during the 2026-09-26 browser proof.
  const wallInGrid = (grid.match(/dwell(?:Switch|Freeze)\([^)]*Date\.now\(\)|const now = Date\.now\(\)[\s\S]{0,120}dwellFreeze/g) ?? []).length
  if (wallInGrid > 0) out.push(`WorksheetView times ${wallInGrid} dwell step(s) with the wall clock`)
  if (/shownAt:\s*Date\.now\(\)|Date\.now\(\)\s*-\s*e\.shownAt/.test(study)) out.push('StudyPage times the single-problem path with the wall clock')
  return out
}

const study = read('pages/StudyPage.tsx')
const grid = read('components/worksheet/WorksheetView.tsx')
const srcReal = sourceFindings(study, grid)
say(srcReal.length === 0, `real sources (${saveCalls(study).length} save calls)${srcReal.length ? ': ' + srcReal.join('; ') : ''}`)
{
  // Control: the pre-P0 grid save, verbatim shape.
  const pre = study.replace(
    /firstTrySeconds\(attempt\.evidence\),/,
    '0,  // timeSpent per problem not tracked in worksheet mode',
  ).replace(/evidence: attempt\.evidence,/, '')
  say(sourceFindings(pre, grid).length > 0, 'control fires: the pre-P0 grid save (literal 0, no evidence)')
  const noProps = study.replace(/scaffoldVisible=\{[^}]*\}/, '')
  say(sourceFindings(noProps, grid).length > 0, 'control fires: a grid never told the table is open')
  const noEvidenceGrid = grid.replace(/evidence: \{/, 'evidenceX: {')
  say(sourceFindings(study, noEvidenceGrid).length > 0, 'control fires: a grid that drops evidence')
  const wallGrid = grid.replace(/activeProblemKey : null, monotonicNow\(\)\)/, 'activeProblemKey : null, Date.now())')
  say(wallGrid !== grid && sourceFindings(study, wallGrid).length > 0, 'control fires: a dwell step timed with the jumping wall clock')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
