/**
 * kumon-pass-rule-test — a Kumon sheet moves on only when it is passed, Check is
 * never locked, no clock is shown to the child, and the record counts problems.
 *
 * Run (from frontend/): npx tsx scripts/kumon-pass-rule-test.ts
 *
 * WHY (2026-11-10, docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md, change set 1).
 * Every finished sheet advanced; the "80%" labelled a row, measured on final answers
 * out of totals a reload double-counted; Check stayed locked until every problem had
 * an answer, so a child on a touch pad typed a filler digit into each empty problem
 * to check the one he had done (31 of 70 on C51–C55); a blank on a checked page was
 * drawn red; re-checking an unchanged wrong answer climbed the hints; the child saw a
 * running stopwatch and a focus score. Rulings R1, R2 and R4 answer them. This gate:
 *
 *   rule       decideSheet: 8 in 10 first try with no help AND ≤ 2 × the standard
 *              time for the run of sheets; the third sitting of a run moves on; an
 *              unmeasured clock never holds a child back.
 *   his record re-scored: the owner's son's 42 sittings C15–C55 (numbers only) give
 *              10 passes and 32 repeats — the table shown to the owner on 2026-11-10.
 *   help       a help-ladder rung or a tap to uncover the fact is help; a table that
 *              is simply open on an ordered sheet is not.
 *   ledger     a sheet is counted by PLACE, so a page shown twice is still ten problems.
 *   run        the try count is the trailing repeats since anything else.
 *   record     mergeSitting: status 'completed' only on a pass, totals out of
 *              problems, avg_focus_score written, sittings appended.
 *   numbers    a repeated table sheet asks the same ten facts in a new order; an
 *              ordered sheet keeps its walk.
 *   check (R2) a blank is "not yet"; an unchanged wrong answer is not a new try.
 *   enter      the keyboard Enter rule reads the problem's SHAPE, never its answer.
 *   words      a repeat carries no score and no clock; a pass names a count, never %.
 *   sources    the wiring on the screens (timer only in Parent Mode, the decision
 *              drives the next sheet, the variant remounts the grid, the pad's Check
 *              follows R2, per-problem "checked", the restore page number, the
 *              monotonic timer and the lesson hold, the one move path, the parent card).
 *
 * Each check runs on the real code and on a deliberately broken control that must
 * be caught (a gate never seen to fail is unproven).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  childSheetMessage,
  decideSheet,
  firstTryUnaided,
  ledgerCounts,
  ledgerRecord,
  ledgerStart,
  mergeSitting,
  nonPassesInRun,
  repeatBanner,
  sittingRecord,
  skillPosition,
  skillStart,
  timeFactorAt,
  type SheetDecision,
  type SheetDecisionInput,
  type SheetEvent,
} from '../src/services/sheetPass'
import { getSctForSheet } from '../src/services/sct'
import { generateCProblem, getTimesTableSupport, repeatPlace } from '../src/services/generators/elementary-advanced/level-c'
import type { Problem } from '../src/services/generators/types'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => {
  checks++
  if (!ok) failures++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`)
}
type Decide = (i: SheetDecisionInput) => SheetDecision

// ---------------------------------------------------------------------------
console.log('\n# rule (R1) — first try AND the time allowed, which starts at 5× the standard and declines')
// [level, ws, problems, firstTry, seconds, priorNonPasses, position, outcome, label]
const CASES: Array<[string, number, number, number, number | null, number, number, 'pass' | 'repeat' | 'moved_on', string]> = [
  ['C', 56, 10, 9, 600, 0, 1, 'pass', 'his next sheet (first of the rule): 10 min allowed, 600 s passes'],
  ['C', 56, 10, 9, 601, 0, 1, 'repeat', '601 s does not'],
  ['C', 57, 10, 9, 570, 0, 2, 'pass', 'the next new sheet: 9½ min'],
  ['C', 57, 10, 9, 571, 0, 2, 'repeat', '…and not a second more'],
  ['C', 66, 10, 9, 300, 0, 11, 'pass', 'the eleventh sheet: 5 min'],
  ['C', 66, 10, 9, 301, 0, 11, 'repeat', '5 min is the floor it reaches'],
  ['C', 90, 10, 9, 300, 0, 40, 'pass', 'and it never goes below 5 min'],
  ['C', 40, 10, 8, 337, 0, 6, 'pass', 'a times table, sixth sheet: 3.75 × 90 s'],
  ['C', 40, 10, 7, 100, 0, 6, 'repeat', '7 of 10 first try, quick'],
  ['C', 53, 15, 12, 800, 0, 3, 'pass', '12 of 15 is 80%; 15 problems get 1.5× the time'],
  ['C', 53, 15, 11, 300, 0, 3, 'repeat', '11 of 15 is under 80%'],
  ['C', 56, 10, 6, 300, 1, 1, 'repeat', 'second try not passed → a third'],
  ['C', 56, 10, 6, 300, 2, 1, 'moved_on', 'third try not passed → moves on'],
  ['C', 56, 10, 9, 100, 2, 1, 'pass', 'a third try that passes is a pass'],
  ['C', 56, 10, 9, null, 0, 11, 'pass', 'a clock that did not run never holds him back'],
  ['C', 56, 10, 9, 0, 0, 11, 'pass', 'nor does a clock that read 0'],
  ['C', 56, 10, 7, null, 0, 1, 'repeat', 'unmeasured time: judged on first try alone'],
]
const ruleFindings = (decide: Decide): string[] =>
  CASES.filter(([level, worksheet, problems, firstTry, seconds, priorNonPasses, position, want]) =>
    decide({ level, worksheet, problems, firstTry, seconds, priorNonPasses, position }).outcome !== want,
  ).map((c) => c[8])
{
  const f = ruleFindings(decideSheet)
  say(f.length === 0, `${CASES.length} cases${f.length ? ': ' + f.join('; ') : ''}`)
  const d = decideSheet({ level: 'C', worksheet: 66, problems: 10, firstTry: 6, seconds: 301, priorNonPasses: 0, position: 11 })
  say(d.reasons.join(',') === 'first_try,time' && !d.advance && d.tryNumber === 1 && d.limitSeconds === 300, 'a repeat names both reasons, stays put, try 1, limit 300 s at the floor')
  say(getSctForSheet('C', 40) === 90 && getSctForSheet('C', 56) === 120 && getSctForSheet('C', 105) === 150 && getSctForSheet('B', 40) === 90, 'standard times by run: C40 90 s, C56 120 s, C105 150 s, other levels by level')
  const mins = [1, 2, 3, 6, 10, 11, 12, 40].map((p) => (timeFactorAt(p) * 120) / 60)
  say(mins.join() === '10,9.5,9,7.5,5.5,5,5,5', `stacked allowance by sheet of the skill: ${mins.join(' / ')} min (10 → 5, 30 s a sheet)`)
  // Controls
  const finalOnly: Decide = (i) => ({ ...decideSheet({ ...i, firstTry: i.problems }) })
  say(ruleFindings(finalOnly).length > 0, 'control fires: a rule on FINAL answers (every sheet ends all right)')
  const noTime: Decide = (i) => decideSheet({ ...i, seconds: null })
  say(ruleFindings(noTime).length > 0, 'control fires: a rule with no speed half')
  const neverMovesOn: Decide = (i) => decideSheet({ ...i, priorNonPasses: 0 })
  say(ruleFindings(neverMovesOn).length > 0, 'control fires: a rule that repeats forever')
  const blindClockFails: Decide = (i) => decideSheet({ ...i, seconds: i.seconds ? i.seconds : 99999 })
  say(ruleFindings(blindClockFails).length > 0, 'control fires: an unmeasured clock that holds him back')
  const neverDeclines: Decide = (i) => decideSheet({ ...i, position: 1 })
  say(ruleFindings(neverDeclines).length > 0, 'control fires: an allowance that never comes down')
  const startsStrict: Decide = (i) => decideSheet({ ...i, position: 40 })
  say(ruleFindings(startsStrict).length > 0, 'control fires: no generous start (5 min from the first sheet)')
}

console.log('\n# where a sheet sits in its skill')
{
  const sit = sittingRecord(decideSheet({ level: 'C', worksheet: 56, problems: 10, firstTry: 9, seconds: 100, priorNonPasses: 0, position: 1 }), { problems: 10, firstTry: 9, seconds: 100, focusScore: 100 })
  const parentOnly: SheetEvent = { kind: 'parent', at: '2026-11-10T00:00:00Z', outcome: 'parent_move_on', from: 57, to: 58 }
  const rows = [
    { worksheet_number: 50, sittings: [sit] },               // another skill (times tables)
    { worksheet_number: 52, sittings: [] },                  // before the rule: no sittings
    { worksheet_number: 56, sittings: [sit, sit, sit] },     // worked three times: one sheet
    { worksheet_number: 57, sittings: [parentOnly] },        // skipped by a parent: not worked
    { worksheet_number: 58, sittings: [sit] },
  ]
  const posFindings = (fn: typeof skillPosition): string[] => {
    const out: string[] = []
    if (fn('C', 56, rows) !== 1) out.push(`C56 (first worked sheet of the skill under the rule) → ${fn('C', 56, rows)}, want 1`)
    if (fn('C', 59, rows) !== 3) out.push(`C59 → ${fn('C', 59, rows)}, want 3 (C56 and C58 worked; repeats, a parent skip, earlier sheets and another skill do not count)`)
    if (fn('C', 101, rows) !== 1) out.push('a new kind of work (C101) starts generous again')
    return out
  }
  const pf = posFindings(skillPosition)
  say(pf.length === 0 && skillStart('C', 56) === 51 && skillStart('C', 66) === 51 && skillStart('C', 17) === 15, `C56 is sheet 1 for him; C59 is sheet 3; C101 starts again; C61's bigger numbers do not restart${pf.length ? ': ' + pf.join('; ') : ''}`)
  const bySheetNumber: typeof skillPosition = (level, ws) => ws - skillStart(level, ws) + 1
  say(posFindings(bySheetNumber).length > 0, 'control fires: counting sheet numbers (he would start C56 at sheet 6, with 7½ min)')
  const countsRepeats: typeof skillPosition = (level, ws, rs) => 1 + rs.filter((r) => r.worksheet_number >= skillStart(level, ws) && r.worksheet_number < ws).reduce((n, r) => n + (Array.isArray(r.sittings) ? r.sittings.length : 0), 0)
  say(posFindings(countsRepeats).length > 0, 'control fires: every sitting counted (a repeat would cut the time)')
}

// ---------------------------------------------------------------------------
console.log('\n# his record, re-scored (C15–C55, numbers only)')
// [sheet, date, problems met, problems worked (incl. pages the app re-served),
//  first try with no help (filler digits set aside), first try as recorded, seconds]
const HIS: Array<[number, string, number, number, number, number, number]> = [
  [15, 'Sep 26', 10, 10, 10, 10, 276], [16, 'Sep 26', 10, 10, 10, 10, 326], [17, 'Sep 26', 10, 10, 9, 9, 539],
  [18, 'Sep 28', 10, 10, 10, 10, 119], [19, 'Sep 28', 10, 10, 10, 10, 155], [20, 'Oct 01', 10, 10, 5, 5, 212],
  [21, 'Oct 01', 10, 10, 7, 7, 471], [22, 'Oct 01', 10, 15, 10, 10, 390], [23, 'Oct 02', 10, 10, 9, 9, 140],
  [24, 'Oct 02', 10, 10, 7, 7, 282], [25, 'Oct 05', 10, 10, 7, 7, 234], [26, 'Oct 05', 10, 10, 9, 9, 69],
  [27, 'Oct 05', 10, 10, 9, 9, 280], [28, 'Oct 06', 10, 10, 10, 10, 178], [29, 'Oct 06', 10, 15, 8, 6, 790],
  [30, 'Oct 07', 10, 10, 8, 8, 974], [31, 'Oct 11', 10, 10, 7, 7, 187], [32, 'Oct 11', 10, 10, 10, 10, 105],
  [33, 'Oct 12', 10, 10, 9, 9, 360], [34, 'Oct 12', 10, 10, 9, 9, 191], [35, 'Oct 14', 10, 20, 8, 8, 537],
  [36, 'Oct 16', 10, 10, 9, 9, 152], [37, 'Oct 16', 10, 10, 8, 7, 441], [38, 'Oct 19', 10, 10, 4, 4, 818],
  [39, 'Oct 19', 10, 10, 10, 10, 231], [40, 'Oct 25', 10, 15, 9, 9, 1077], [41, 'Oct 25', 10, 10, 5, 5, 164],
  [42, 'Oct 27', 10, 10, 9, 9, 124], [43, 'Oct 27', 10, 10, 6, 6, 264], [44, 'Oct 31', 10, 10, 5, 4, 635],
  [45, 'Oct 31', 10, 10, 8, 8, 103], [46, 'Nov 01', 10, 10, 6, 6, 128], [47, 'Nov 01', 10, 15, 10, 7, 312],
  [48, 'Nov 02', 10, 10, 8, 8, 574], [49, 'Nov 02', 10, 10, 8, 8, 819], [50, 'Nov 03', 10, 10, 9, 7, 321],
  [51, 'Nov 03', 10, 10, 8, 8, 903], [51, 'Nov 04', 10, 10, 8, 1, 342], [52, 'Nov 05', 20, 20, 11, 0, 564],
  [53, 'Nov 06', 15, 15, 10, 10, 946], [54, 'Nov 07', 15, 15, 11, 8, 510], [55, 'Nov 07', 10, 10, 9, 1, 139],
]
// Under the declining allowance (owner, 2026-11-10), as if the rule had run from each skill's first sheet.
const PASSED_SHOWN = [15, 16, 18, 19, 22, 23, 26, 27, 28, 32, 33, 34, 35, 36, 39, 42, 45, 47, 50, 51, 55]
// Time is scaled to the problems he met: the app's re-served pages are its fault, not his.
const rescore = (decide: Decide) =>
  HIS.map(([ws, , met, worked, firstTry, , seconds]) => ({ ws, d: decide({ level: 'C', worksheet: ws, problems: met, firstTry, seconds: (seconds * met) / worked, priorNonPasses: 0, position: ws - skillStart('C', ws) + 1 }) }))
{
  const r = rescore(decideSheet)
  const passed = r.filter((x) => x.d.passed).map((x) => x.ws)
  const time = r.filter((x) => !x.d.passed && x.d.reasons.join() === 'time').length
  const first = r.filter((x) => !x.d.passed && x.d.reasons.join() === 'first_try').length
  const both = r.filter((x) => x.d.reasons.length === 2).length
  say(passed.join() === PASSED_SHOWN.join() && passed.length === 21 && r.length - passed.length === 21,
    `21 of 42 sittings pass (${passed.map((w) => 'C' + w).join(' ')}), 21 repeat`)
  say(time === 8 && first === 9 && both === 4, `repeats: ${time} time only, ${first} first try only, ${both} both (shown: 8 / 9 / 4)`)
  const oldRule: Decide = (i) => ({ ...decideSheet(i), passed: true, outcome: 'pass', advance: true, reasons: [] })
  say(rescore(oldRule).filter((x) => x.d.passed).length !== 21, 'control fires: the old rule (every sheet advances) does not reproduce the table')
}

// ---------------------------------------------------------------------------
console.log('\n# help')
{
  const cases: Array<[boolean, number, boolean, boolean, string]> = [
    [true, 0, false, true, 'right, nothing opened'],
    [true, 1, false, false, 'right after "Help me" (rung 1)'],
    [true, 0, true, false, 'right after uncovering the fact on the table'],
    [false, 0, false, false, 'wrong first'],
  ]
  const helpFindings = (fn: typeof firstTryUnaided) => cases.filter(([r, h, t, want]) => fn({ firstTryRight: r, helpRung: h, tableRevealed: t }) !== want).map((c) => c[4])
  const f = helpFindings(firstTryUnaided)
  say(f.length === 0, `unaided means right with nothing opened before the check${f.length ? ': ' + f.join('; ') : ''}`)
  say(helpFindings((c) => c.firstTryRight && c.helpRung === 0).length > 0, 'control fires: a look at the table that is not counted as help')
  // An open table on an ordered sheet is the sheet: the ledger is fed the REVEAL flag, never "shown".
  const sp = read('src/pages/StudyPage.tsx')
  say(/tableRevealed: e\?\.scaffoldRevealedBeforeFirstCheck/.test(sp) && !/tableRevealed: e\?\.scaffoldShownBeforeFirstCheck/.test(sp), 'the ledger counts a tap to uncover, not a table that is simply open')
}

// ---------------------------------------------------------------------------
console.log('\n# ledger')
{
  const pages = (key: (page: number, i: number, reload: number) => string) => {
    let l = ledgerStart('C:22:0')
    // page 1, page 2, then page 2 shown again after a reload (new problem ids)
    for (const [page, reload] of [[1, 0], [2, 0], [2, 1]]) for (let i = 0; i < 5; i++) l = ledgerRecord(l, key(page, i, reload), true, true)
    return ledgerCounts(l)
  }
  const byPlace = pages((p, i) => `${p}:${i}`)
  say(byPlace.problems === 10 && byPlace.firstTry === 10, `a page shown twice is still ten problems (${byPlace.problems})`)
  const byId = pages((p, i, r) => `id-${p}-${i}-${r}`)
  say(byId.problems === 15, 'control fires: a ledger keyed by problem id counts the re-served page (15)')
  let l = ledgerStart('C:56:0')
  l = ledgerRecord(l, '1:0', false, false)
  l = ledgerRecord(l, '1:0', true, true)
  say(ledgerCounts(l).firstTry === 0, 'the first time he met a place is the one that counts')
}

// ---------------------------------------------------------------------------
console.log('\n# run of tries')
{
  const s = (outcome: 'pass' | 'repeat' | 'moved_on'): SheetEvent => sittingRecord(decideSheet({ level: 'C', worksheet: 56, problems: 10, firstTry: outcome === 'pass' ? 9 : 5, seconds: 100, priorNonPasses: 0, position: 1 }), { problems: 10, firstTry: 5, seconds: 100, focusScore: 100 })
  const repeat = { ...s('repeat'), outcome: 'repeat' as const }
  const pass = { ...s('pass'), outcome: 'pass' as const }
  const parent: SheetEvent = { kind: 'parent', at: '2026-11-10T00:00:00Z', outcome: 'parent_move_on', from: 56, to: 57 }
  const runCases: Array<[SheetEvent[], number]> = [[[], 0], [[repeat], 1], [[repeat, repeat], 2], [[repeat, pass, repeat], 1], [[repeat, repeat, parent], 0]]
  const runFindings = (fn: typeof nonPassesInRun) => runCases.filter(([e, want]) => fn(e) !== want).length
  say(runFindings(nonPassesInRun) === 0, 'tries in the run: trailing repeats; a pass or a parent move starts a new run')
  say(runFindings((e) => (e ?? []).filter((x) => x.kind === 'sitting' && x.outcome === 'repeat').length) > 0, 'control fires: counting every repeat ever')
}

// ---------------------------------------------------------------------------
console.log('\n# record')
{
  // A repeat (6 of 10 first try, all 10 right in the end), then a pass the next day.
  const recordFindings = (merge: typeof mergeSitting): string[] => {
    const out: string[] = []
    const d1 = decideSheet({ level: 'C', worksheet: 56, problems: 10, firstTry: 6, seconds: 300, priorNonPasses: 0, position: 1 })
    const r1 = merge(null, sittingRecord(d1, { problems: 10, firstTry: 6, seconds: 300, focusScore: 100, at: '2026-11-10T01:00:00Z' }), 10)
    const d2 = decideSheet({ level: 'C', worksheet: 56, problems: 10, firstTry: 9, seconds: 200, priorNonPasses: 1, position: 1 })
    const r2 = merge({ ...r1 }, sittingRecord(d2, { problems: 10, firstTry: 9, seconds: 200, focusScore: 80, at: '2026-11-11T01:00:00Z' }), 10)
    if (r1.status !== 'in_progress' || 'completed_at' in r1) out.push('a repeated sheet is recorded "completed"')
    if (r1.best_score_total !== 10 || r1.first_try_correct !== 6 || r1.times_attempted !== 1) out.push('totals not out of the sheet\'s problems')
    if (r2.status !== 'completed' || r2.completed_at !== '2026-11-11T01:00:00Z') out.push('the pass does not complete it')
    if (r2.sittings.length !== 2 || r2.avg_focus_score !== 90 || r2.time_vs_sct !== 1.67) out.push('sittings / avg_focus_score / time_vs_sct wrong')
    return out
  }
  const rf = recordFindings(mergeSitting)
  say(rf.length === 0, `a repeat is not "completed"; a pass completes it; totals out of problems; sittings append; avg_focus_score 100, 80 → 90; time_vs_sct 200/120 = 1.67${rf.length ? ': ' + rf.join('; ') : ''}`)
  // The pre-R1 completion: 80% of FINAL answers.
  const oldMerge: typeof mergeSitting = (e, s, right) => {
    const m = mergeSitting(e, s, right)
    return right >= s.problems * 0.8 ? { ...m, status: 'completed', completed_at: s.at } : m
  }
  say(recordFindings(oldMerge).length > 0, 'control fires: the old record that calls a repeated sheet completed (80% of final answers)')
}

// ---------------------------------------------------------------------------
console.log('\n# numbers on a repeat')
{
  const bij = [1, 2, 3, 4, 5].every((v) => new Set(Array.from({ length: 10 }, (_, i) => repeatPlace(i, v))).size === 10)
  say(bij && repeatPlace(4, 0) === 4, 'repeatPlace is a reordering of the ten places for every repeat; the first sitting is unchanged')
  const facts = (ws: number, v: number) => Array.from({ length: 10 }, (_, i) => (generateCProblem(ws, i, v) as Problem).operands!.join('×'))
  const sameSet = (a: string[], b: string[]) => [...a].sort().join() === [...b].sort().join()
  const tableSheets = Array.from({ length: 40 }, (_, k) => 11 + k).filter((ws) => getTimesTableSupport(ws))
  let reordered = 0, kept = 0, broken: number[] = []
  for (const ws of tableSheets) {
    const a = facts(ws, 0), b = facts(ws, 1)
    if (!sameSet(a, b)) broken.push(ws)
    if (getTimesTableSupport(ws)!.beat === 'ordered') { if (a.join() === b.join()) kept++ } else if (a.join() !== b.join()) reordered++
  }
  const ordered = tableSheets.filter((ws) => getTimesTableSupport(ws)!.beat === 'ordered').length
  say(broken.length === 0 && reordered === tableSheets.length - ordered && kept === ordered,
    `${tableSheets.length} table sheets: the same facts on a repeat; ${reordered} in a new order, ${kept} ordered sheets keep their walk${broken.length ? ' BROKEN ' + broken.join(',') : ''}`)
  const drop = (i: number, v: number) => (v ? (2 * i + v) % 10 : i)
  say(new Set(Array.from({ length: 10 }, (_, i) => drop(i, 1))).size !== 10, 'control fires: a "reorder" that drops facts')
}

// ---------------------------------------------------------------------------
console.log('\n# Check (R2)')
{
  const view = read('src/components/worksheet/WorksheetView.tsx')
  const body = (name: string) => { const i = view.indexOf(`export function ${name}`); const j = view.indexOf('\n}\n', i); return view.slice(i, j + 2) }
  const shim = path.join(ROOT, 'scripts/.pass-rule-shim.ts')
  fs.writeFileSync(shim, [
    "import type { Problem } from '../src/services/generators/types'",
    "type PageState = any",
    body('problemsToGrade'),
    body('getMinAnswerDigits'),
    body('isHorizontalAnswerUnfinished'),
  ].join('\n'))
  const H = await import(shim)
  fs.unlinkSync(shim)
  const page = {
    problems: [1, 2, 3, 4, 5],
    answers: { 0: '12', 1: '', 2: '35', 3: '40', 4: '7' },
    results: { 2: false, 3: false, 4: true } as Record<number, boolean>,
    lockedProblems: {},
    checkedAnswers: { 2: '35', 3: '39' } as Record<number, string>,
  }
  const want = [0, 3] // 0 new; 1 blank → not yet; 2 unchanged wrong → not a new try; 3 changed; 4 already right
  const got = H.problemsToGrade(page)
  say(got.join() === want.join(), `graded: the new answer and the changed one, not the blank, the unchanged or the right (${got.join()})`)
  const oldRule = (s: typeof page) => s.problems.map((_, i) => i).filter((i) => s.results[i] !== true)
  say(oldRule(page).join() !== want.join(), 'control fires: the old check that grades blanks and unchanged answers')
  say(H.problemsToGrade({ ...page, answers: { 1: '' }, results: {}, checkedAnswers: {} }).length === 0, 'nothing written → nothing to check (Check stays off, not "wrong")')

  console.log('\n# keyboard Enter (shape, never the answer)')
  const mk = (q: string, a: number, b: number, ans: number, fmt = 'horizontal', type = 'multiplication'): Problem =>
    ({ id: 'x', level: 'C', worksheetNumber: 1, type, subtype: 'x', difficulty: 1, displayFormat: fmt, question: q, correctAnswer: ans, operands: [a, b] }) as unknown as Problem
  say(H.getMinAnswerDigits(mk('7 × 10 = ___', 7, 10, 70)) === 2 && H.getMinAnswerDigits(mk('8 × ___ = 24', 8, 3, 3)) === 1 && H.getMinAnswerDigits(mk('', 81, 63, 5103, 'vertical')) === 3 && H.getMinAnswerDigits(mk('', 14, 6, 84, 'vertical')) === 2,
    'fewest digits: 7 × 10 → 2, a missing factor → 1, 81 × 63 total row → 3, 14 × 6 → 2')
  let traps = 0
  for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) if (H.getMinAnswerDigits(mk(`${a} × ${b} = ___`, a, b, a * b)) > String(a * b).length) traps++
  for (let a = 10; a <= 99; a++) for (let b = 10; b <= 99; b++) if (H.getMinAnswerDigits(mk('', a, b, a * b, 'vertical')) > String(a * b).length) traps++
  say(traps === 0, 'never holds back a complete answer (144 table facts, 8,100 two-digit products)')
  const sameShape = [mk('3 × 4 = ___', 3, 4, 12), mk('3 × 3 = ___', 3, 3, 9)]
  const unfinished = (fn: typeof H.isHorizontalAnswerUnfinished) => sameShape.map((p) => fn(p, '1'))
  say(unfinished(H.isHorizontalAnswerUnfinished).every((x: boolean) => x === false), '"1" on 3 × 4 and on 3 × 3 is treated alike (the answer is not read)')
  const leaky = (p: Problem, typed: string) => typed.length < String(p.correctAnswer).length
  const lk = unfinished(leaky)
  say(lk[0] !== lk[1], 'control fires: an Enter rule that reads the answer gives 3 × 4 away')
  const enterCases: Array<[Problem, string, boolean]> = [
    [mk('7 × 10 = ___', 7, 10, 70), '7', true], [mk('7 × 10 = ___', 7, 10, 70), '70', false],
    [mk('13 ÷ 4 = ___', 13, 4, 3, 'horizontal', 'division'), '3 R', true], [mk('13 ÷ 4 = ___', 13, 4, 3, 'horizontal', 'division'), '3 R 1', false],
    [mk('3 × 4 = ___', 3, 4, 12), '', false],
  ]
  say(enterCases.every(([p, t, w]) => H.isHorizontalAnswerUnfinished(p, t) === w), 'Enter waits on "7" for 7 × 10 and on "3 R"; moves on from "70", "3 R 1" and an empty box')
}

// ---------------------------------------------------------------------------
console.log('\n# words')
{
  const d = (outcome: 'pass' | 'repeat' | 'moved_on') => ({ ...decideSheet({ level: 'C', worksheet: 56, problems: 10, firstTry: 9, seconds: 100, priorNonPasses: 0, position: 1 }), outcome, advance: outcome !== 'repeat' })
  const msg = (o: 'pass' | 'repeat' | 'moved_on', fn = childSheetMessage) => fn(d(o), { level: 'C', worksheet: 56, next: o === 'repeat' ? 56 : 57, problems: 10, firstTry: 6, newNumbers: true })
  const wordFindings = (fn: typeof childSheetMessage): string[] => {
    const out: string[] = []
    const rep = msg('repeat', fn), mov = msg('moved_on', fn), pas = msg('pass', fn)
    if (/\d/.test(rep)) out.push(`repeat shows a number: "${rep}"`)
    // Clock words, not the idiom ("Time for a new sheet" is not a clock).
    if (/fail|wrong|second|minute|clock|timer|standard time|×|%/i.test(rep + mov)) out.push('a repeat or a move-on talks score, clock or failure')
    if (/\d+\s*of\s*\d+/.test(mov)) out.push('move-on shows a score')
    if (/%/.test(pas) || !/6 of 10/.test(pas)) out.push(`pass should name a count, never a percent: "${pas}"`)
    return out
  }
  const w = wordFindings(childSheetMessage)
  say(w.length === 0, `child words: "${msg('repeat')}" / "${msg('moved_on')}"${w.length ? ' — ' + w.join('; ') : ''}`)
  const scored: typeof childSheetMessage = (dd, s) => (dd.outcome === 'repeat' ? `You got ${s.firstTry} of ${s.problems}. Try again!` : childSheetMessage(dd, s))
  say(wordFindings(scored).length > 0, 'control fires: a repeat that reads out the score')
  say(repeatBanner(false).includes('again') && !repeatBanner(false).includes('new numbers'), 'an ordered sheet does not promise new numbers')
  // The repeat names the GOAL by its reason, in a child's words, never a score or clock.
  const goalFindings = (fn: typeof repeatBanner): string[] => {
    const out: string[] = []
    const slow = fn(true, ['time']), miss = fn(true, ['first_try']), both = fn(true, ['first_try', 'time'])
    if (slow === miss) out.push('a slow sheet and a missed sheet get the same words')
    if (!/Good work!/.test(slow) || !/pop right into your head/.test(slow)) out.push(`time only should praise, then name recall: "${slow}"`)
    if (!/take a good look/.test(miss) || both !== miss) out.push(`a first-try repeat should ask him to look before he checks: "${miss}"`)
    if (/\d|second|minute|clock|timer|quick|fast|hurry|%/i.test(slow + miss)) out.push('a repeat line talks numbers, clock or hurry')
    return out
  }
  const gf = goalFindings(repeatBanner)
  say(gf.length === 0, `the repeat names the goal: "${repeatBanner(true, ['time'])}" / "${repeatBanner(true, ['first_try'])}"${gf.length ? ' — ' + gf.join('; ') : ''}`)
  say(goalFindings((n) => repeatBanner(n)).length > 0, 'control fires: one line for every repeat (the reason ignored)')
}

// ---------------------------------------------------------------------------
console.log('\n# sources')
const S = {
  study: read('src/pages/StudyPage.tsx'),
  view: read('src/components/worksheet/WorksheetView.tsx'),
  timer: read('src/hooks/useEnhancedTimer.ts'),
  move: read('src/services/kumonPosition.ts'),
  dash: read('src/pages/ProgressDashboard.tsx'),
  card: read('src/components/parent/KumonSheetsCard.tsx'),
  edit: read('src/components/children/EditChildModal.tsx'),
  modal: read('src/components/session/TimeoutWarningModal.tsx'),
}
type Src = typeof S
function sourceFindings(s: Src): string[] {
  const out: string[] = []
  // R4: no clock in front of the child
  const timerUses = s.study.match(/<EnhancedTimerDisplay/g) ?? []
  if (timerUses.length !== 1 || !/\{parentMode && \(\s*<EnhancedTimerDisplay/.test(s.study)) out.push('the stopwatch / focus score can show to the child (R4)')
  if (/welcomeBackToast\.duration/.test(s.study.slice(s.study.indexOf('return ('))) ) out.push('the welcome-back toast reads out the time away')
  if (!/showCountdown=\{false\}/.test(s.study) || !/\{showCountdown && <div/.test(s.modal)) out.push('the idle warning shows the child a countdown')
  // R1: the decision drives the next sheet
  if (/const nextWorksheet = currentWorksheet \+ 1/.test(s.study)) out.push('the sheet always advances (currentWorksheet + 1 outside the decision)')
  if (!/else if \(c\.decision\.advance\) \{\s*nextWorksheet = currentWorksheet \+ 1/.test(s.study)) out.push('the next sheet does not come from the decision')
  if (!/positionMovedElsewhere\(\)/.test(s.study.slice(s.study.indexOf('const handleSessionComplete')))) out.push('finishing a sheet can write over a grown-up\'s move')
  if (!/key=\{`\$\{currentLevel\}-\$\{currentWorksheet\}-\$\{sheetVariant\}`\}/.test(s.study) || !/variant=\{sheetVariant\}/.test(s.study)) out.push('a repeated sheet does not remount with new numbers')
  if (!/recordFirstCheck\(attempt\.place,/.test(s.study)) out.push('the grid does not feed the sheet ledger by place')
  if (!/holdTimer\(showConceptIntro \|\| gridTeaching \|\| showTeaching\)/.test(s.study) || !/if \(holdRef\.current\) return/.test(s.timer)) out.push('a lesson or the app\'s teaching screen is timed as the sheet')
  if (!/onTeachingChange=\{setGridTeaching\}/.test(s.study) || !/onTeachingChange\?\.\(showTeaching\)/.test(s.view)) out.push('the grid does not report its teaching screen')
  if (!/onDismiss=\{dismissFeedback\}/.test(s.study)) out.push('the end-of-sheet message is dismissed by an inline callback (its timer re-arms every render)')
  if (/setRecapOpen\(true\), 1200\)/.test(s.study) || !/setRecapOpen\(true\), done\.holdMs \+ 300\)/.test(s.study)) out.push('the cohort recap covers the verdict')
  if (!/repeatBanner\(repeatServesNewNumbers, sheetRepeatReasons\)/.test(s.study)) out.push('the line on a repeated sheet ignores why it is repeated')
  if (/const now = Date\.now\(\)/.test(s.timer) || !/const now = monotonicNow\(\)/.test(s.timer)) out.push('the sheet clock ticks on the wall clock')
  // R2
  if (!/onCanCheckChange=\{setCanSubmitWorksheet\}/.test(s.study) || !/submitDisabled=\{!canSubmitWorksheet\}/.test(s.study)) out.push('the pad\'s Check does not follow R2')
  if (!/const canCheck = problemsToGrade\(currentPageState\)\.length > 0/.test(s.view) || !/const toGrade = new Set\(problemsToGrade\(currentPageState\)\)/.test(s.view)) out.push('Check / the check do not use problemsToGrade')
  if (!/isSubmitted=\{currentPageState\.results\[index\] !== undefined\}/.test(s.view)) out.push('a blank on a checked page is drawn as wrong')
  if (/disabled=\{!allAnswered/.test(s.view)) out.push('the grid\'s own Check waits for every answer')
  // records
  if (!/hintLevelReached: hintsReached\[index\] \|\| null/.test(s.view)) out.push('hintLevelReached is read after it is cleared')
  if (!/setPageStates\(\{ \[restoredPage\]: normalized \}\)/.test(s.view) || /setPageStates\(\{ 1: normalized \}\)/.test(s.view)) out.push('a restore puts every page back as page 1')
  if (!/normalized\.totalsBefore/.test(s.view)) out.push('a restore seeds the totals from the restored page itself')
  if (!/useEffect\(\(\) => \{\s*setEntryNudge\(null\)\s*\}, \[activeIndex, currentPage\]\)/.test(s.view)) out.push('the "Keep going" toast outlives its problem')
  // the one move path
  if (!/if \(m\.to < m\.from\) await clearConceptsFromWorksheet/.test(s.move)) out.push('a move back does not clear the seen intros')
  if (!/moveKumonPosition\(/.test(s.card) || !/<ParentVerification/.test(s.card) || !/<KumonSheetsCard/.test(s.dash)) out.push('the parent card is missing its controls or its parent check')
  if (!/moveKumonPosition\(/.test(s.edit) || !/moveKumonPosition\(/.test(s.study)) out.push('a sheet change elsewhere skips the move path')
  return out
}
{
  const f = sourceFindings(S)
  say(f.length === 0, `wiring${f.length ? ': ' + f.join('; ') : ''}`)
  const controls: Array<[string, Partial<Src>]> = [
    ['the stopwatch back in front of the child', { study: S.study.replace('{parentMode && (\n              <EnhancedTimerDisplay', '{(\n              <EnhancedTimerDisplay') }],
    ['the pre-R1 advance', { study: S.study.replace('else if (c.decision.advance) {\n      nextWorksheet = currentWorksheet + 1', 'else {\n      nextWorksheet = currentWorksheet + 1') }],
    ['a repeat that does not remount', { study: S.study.replace('key={`${currentLevel}-${currentWorksheet}-${sheetVariant}`}', 'key={`${currentLevel}-${currentWorksheet}`}') }],
    ['the locked Check', { view: S.view.replace('disabled={!canCheck || !sessionActive}', 'disabled={!allAnswered || !sessionActive}') }],
    ['blanks drawn wrong', { view: S.view.replace('isSubmitted={currentPageState.results[index] !== undefined}', 'isSubmitted={currentPageState.submitted}') }],
    ['the restore into page 1', { view: S.view.replace('setPageStates({ [restoredPage]: normalized })', 'setPageStates({ 1: normalized })') }],
    ['the empty hint record', { view: S.view.replace('hintLevelReached: hintsReached[index] || null', 'hintLevelReached: hintLevels[index] || null') }],
    ['the wall-clock timer', { timer: S.timer.replace('const now = monotonicNow()', 'const now = Date.now()') }],
    ['the teaching screen on the clock', { study: S.study.replace('holdTimer(showConceptIntro || gridTeaching || showTeaching)', 'holdTimer(showConceptIntro)') }],
    ['the inline dismiss', { study: S.study.replace('onDismiss={dismissFeedback}', 'onDismiss={() => setFeedback({ ...feedback, show: false })}') }],
    ['the recap over the verdict', { study: S.study.replace('setRecapOpen(true), done.holdMs + 300)', 'setRecapOpen(true), 1200)') }],
    ['a move back that keeps the seen intros', { move: S.move.replace('if (m.to < m.from) await clearConceptsFromWorksheet', 'if (false) await clearConceptsFromWorksheet') }],
    ['an unguarded parent card', { card: S.card.replace('<ParentVerification', '<div') }],
  ]
  for (const [name, patch] of controls) {
    const changed = Object.entries(patch).some(([k, v]) => v !== S[k as keyof Src])
    say(changed && sourceFindings({ ...S, ...patch }).length > 0, `control fires: ${name}`)
  }
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
