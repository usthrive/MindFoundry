/**
 * bb-week-status-test — a week that has not moved forward after Day 5 says where
 * it is at, and a week that missed its second re-check closes and moves on.
 *
 * Run (from frontend/): npx tsx scripts/bb-week-status-test.ts
 *
 * WHY (owner, 2026-10-15). After the second re-check missed, the app promised "a
 * real teacher from our team" — none existed — and the week stayed open forever:
 * every day green, no button. And while a week waited, the home screen said only
 * "just the renaming step is wobbly" (the spec's example skill, every week) and
 * the mistake's adult slug. The owner asked for a call-out the child can show:
 * what is going on and what moving on needs. This asserts, on the owner's son's
 * real week 4 (seed 645474193):
 *
 *   facts    held (6/6 held by Day 4 at 40%), the second round (4/6), and a closed
 *            week; the bar is 5 of 6 on every served form; the next step opens
 *            tomorrow on the day of the check, today after;
 *   words    the child's lines carry counts and what moving on needs — never a
 *            percent, "review", "wrong", "fail" or "teacher"; the grown-up's
 *            carry the numbers, the held day, the questions missed with HIS
 *            answers, one thing to try and the pack's own question to ask;
 *   misses   the card lists the LATEST sitting's misses only (the second re-check
 *            has its own ids);
 *   sources  the hub shows the card and opens the next week from a closed one; no
 *            screen or report still promises a teacher; the spec's "renaming"
 *            example is gone; the migration patches exactly the old sentence.
 *
 * Every check runs on the real code and on a broken control that must fire.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator'
import { MASTERY_THRESHOLD_PCT } from '../src/modules/best-brains/constants'
import { latestSittingMisses, statusLines, weekStatus, type WeekStatus } from '../src/modules/best-brains/session/weekStatus'
import type { AttemptRow } from '../src/modules/best-brains/session/checkReview'
import type { MasteryAttempt, WeekState } from '../src/modules/best-brains/types'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

const SEED = 645474193
const pack = generatePack('B', 4, SEED, '1.2.0')
/** His real week-4 row (read 2026-10-15). */
const DAYS: WeekState['dayProgress'] = {
  lesson: { state: 'done', completedAt: '2026-10-02T23:07:56.166Z' },
  '1': { state: 'done', completedAt: '2026-10-02T23:07:56.166Z' },
  '2': { state: 'done', accuracyPct: 100, completedAt: '2026-10-06T00:18:17.406Z' },
  '3': { state: 'done', accuracyPct: 100, completedAt: '2026-10-07T23:57:38.505Z' },
  '4': { state: 'done', accuracyPct: 40, completedAt: '2026-10-10T01:38:01.568Z' },
  '5': { state: 'done', completedAt: '2026-10-13T01:18:12.130Z' },
} as WeekState['dayProgress']
const FORM_A: MasteryAttempt = { form: 'A', cycle: 0, scorePct: 100, attemptedAt: '2026-10-13T01:18:12.066Z', stabilityHold: true, dominantErrorTags: [] }
const FORM_B1: MasteryAttempt = { form: 'B', cycle: 1, scorePct: 67, attemptedAt: '2026-10-14T23:57:19.538Z', stabilityHold: false, dominantErrorTags: ['concept-misconception', 'task-comprehension'] }
const FORM_B2: MasteryAttempt = { form: 'B', cycle: 2, scorePct: 50, attemptedAt: '2026-10-17T16:00:00.000Z', stabilityHold: false, dominantErrorTags: ['task-comprehension'] }
const ws = (state: WeekState['state'], attempts: MasteryAttempt[], extra: Partial<WeekState['mastery']> = {}): WeekState => ({
  childId: 'x', level: 'B', week: 4, packSeed: SEED, contentVersion: '1.2.0', state, lessonSegment: null,
  dayProgress: DAYS, mastery: { attempts, ...extra },
})
const HELD = ws('near_miss_cycle1', [FORM_A])
const NOW = ws('cycle2', [FORM_A, FORM_B1])
const CLOSED = ws('escalated', [FORM_A, FORM_B1, FORM_B2], { escalatedAt: FORM_B2.attemptedAt })
const day = (iso: string, plusDays = 0) => { const d = new Date(iso); d.setDate(d.getDate() + plusDays); return d }

/** His real check rows for week 4, with his review re-answers. */
const ROWS: AttemptRow[] = [
  ...['20', '11', '6', '11', '9', 'B'].map((a, i) => ({ item_id: `B4-MA-0${i + 1}`, answer: a, correct: true, attempt_no: 1, created_at: `2026-10-13T01:1${i}:00Z` })),
  { item_id: 'B4-MB-01', answer: '13', correct: true, attempt_no: 1, created_at: '2026-10-14T23:53:55Z' },
  { item_id: 'B4-MB-04', answer: '6', correct: false, attempt_no: 1, created_at: '2026-10-14T23:55:45Z' },
  { item_id: 'B4-MB-05', answer: '9', correct: false, attempt_no: 1, created_at: '2026-10-14T23:56:48Z' },
  { item_id: 'B4-MB-04', answer: 'review: 5', correct: false, attempt_no: 2, created_at: '2026-10-14T23:57:38Z' },
  { item_id: 'B4-MB-05', answer: 'review: 3', correct: true, attempt_no: 2, created_at: '2026-10-14T23:58:38Z' },
]

// ---------------------------------------------------------------------------
console.log('\nfacts — his week 4, three moments')
type StatusFn = typeof weekStatus
function factFindings(fn: StatusFn): string[] {
  const out: string[] = []
  const h = fn(HELD, pack, day('2026-10-13T12:00:00Z', 1))
  if (h?.kind !== 'held') out.push(`after the held check: ${h?.kind}`)
  if (h?.checks[0].right !== 6 || h?.checks[0].heldBy.map((x) => `${x.day}:${x.pct}`).join() !== '4:40') out.push(`held check reads ${JSON.stringify(h?.checks[0])}`)
  if (h?.needed !== 5 || h?.total !== 6 || h?.daysDone !== 5) out.push(`bar ${h?.needed}/${h?.total}, days ${h?.daysDone}`)
  const n = fn(NOW, pack, day(FORM_B1.attemptedAt, 1))
  if (n?.kind !== 'second-round' || n?.checks[1].right !== 4 || n?.checks[1].heldBy.length !== 0) out.push(`his state now reads ${n?.kind} ${JSON.stringify(n?.checks[1])}`)
  if (!n?.nextReady) out.push('the day after the re-check, the next round is not ready')
  if (fn(NOW, pack, new Date(FORM_B1.attemptedAt))?.nextReady) out.push('on the re-check\'s own day, the next round claims to be ready')
  const c = fn(CLOSED, pack, day(FORM_B2.attemptedAt, 1))
  if (c?.kind !== 'moved-on' || c?.checks.length !== 3 || c?.checks[2].right !== 3) out.push(`a closed week reads ${c?.kind} ${c?.checks.length}`)
  if (fn(ws('passed', [FORM_A]), pack) !== null || fn(ws('in_week', []), pack) !== null) out.push('a moving week shows a status')
  if (n?.questionForChild !== pack.parentSummarySeed.homeFocus.questionForChild) out.push('the pack\'s own question for the grown-up is missing')
  return out
}
const fReal = factFindings(weekStatus)
say(fReal.length === 0, `real status${fReal.length ? ': ' + fReal.join('; ') : ''}`)
{
  const noHold: StatusFn = (w, p, now) => weekStatus({ ...w, mastery: { ...w.mastery, attempts: w.mastery.attempts.map((a) => ({ ...a, stabilityHold: false })) } }, p, now)
  say(factFindings(noHold).length > 0, 'control fires: a status blind to the stability hold')
  const sameDay: StatusFn = (w, p) => weekStatus(w, p, day('2030-01-01T00:00:00Z'))
  say(factFindings(sameDay).length > 0, 'control fires: a status that ignores the calendar')
}
{
  const bad: string[] = []
  for (const c of AVAILABLE_WEEKS) {
    const p = generatePack(c.level, c.week, 12345)
    const total = p.masteryCheck.formA.length
    const need = Math.ceil((MASTERY_THRESHOLD_PCT * total) / 100)
    if (need !== 5 || p.masteryCheck.formB.length !== total) bad.push(`${c.level}${c.week}: ${need} of ${total}`)
  }
  say(bad.length === 0, `the bar reads 5 of 6 on all ${AVAILABLE_WEEKS.length} served weeks${bad.length ? ': ' + bad.slice(0, 4).join(', ') : ''}`)
}

// ---------------------------------------------------------------------------
console.log('\nwords — what the child reads, what the grown-up reads')
type LinesFn = typeof statusLines
const CHILD_BANNED = /%|\breview\b|\bwrong\b|\bfail|\bteacher\b|\btest\b|\bgrade\b/i
function wordFindings(fn: LinesFn): string[] {
  const out: string[] = []
  const misses = latestSittingMisses(ROWS, NOW, pack)
  const now = fn(weekStatus(NOW, pack, day(FORM_B1.attemptedAt, 1))!, misses)
  const held = fn(weekStatus(HELD, pack, day(FORM_A.attemptedAt, 1))!, [])
  const closed = fn(weekStatus(CLOSED, pack, day(FORM_B2.attemptedAt, 1))!, [])
  for (const [name, l] of [['now', now], ['held', held], ['closed', closed]] as const) {
    for (const c of l.child) if (CHILD_BANNED.test(c.text)) out.push(`${name}: child line "${c.text}"`)
    if (CHILD_BANNED.test(l.title) || CHILD_BANNED.test(l.speak)) out.push(`${name}: title or read-aloud "${l.title}"`)
    if (/teacher/i.test(l.grownUp.map((g) => (typeof g === 'string' ? g : `${g.question} ${g.answer}`)).join(' '))) out.push(`${name}: the grown-up part promises a teacher`)
  }
  const kid = now.child.map((c) => c.text).join(' | ')
  if (!/To move on: 5 of 6 right/.test(kid)) out.push(`no "what moving on needs" for the child: ${kid}`)
  if (!/New questions: 4 of 6 right/.test(kid) || !/Last page: all 6 right!/.test(kid)) out.push(`the child's checks read: ${kid}`)
  if (!/Day 4's practice was tricky/.test(held.child.map((c) => c.text).join(' '))) out.push('the held week does not say why it waits')
  const adult = now.grownUp.map((g) => (typeof g === 'string' ? g : `“${g.question.replace(/\s+/g, ' ')}” — answered ${g.answer}`)).join(' | ')
  if (!/6\/6 — held: Day 4 practice was 40% \(every practice day needs 75%\+\)/.test(adult)) out.push(`the grown-up's held line: ${adult}`)
  if (!/Re-check: 4\/6 \(moving on needs 5\)/.test(adult)) out.push('the grown-up does not see 4/6 against 5')
  if (!/Which square is Ava on at the end\?” — answered 6/.test(adult) || !/— answered 9/.test(adult)) out.push('the missed questions with his answers are not listed')
  if (!/Try together: /.test(adult) || !/Ask: “Before you count anything/.test(adult) || !/How did you get 6\?/.test(adult)) out.push('no thing to try / question to ask')
  if (/To move on/.test(closed.child.map((c) => c.text).join(' '))) out.push('a closed week still says "to move on"')
  if (!/on to the next idea/i.test(closed.title) || !/come back in warm-ups/.test(closed.child.map((c) => c.text).join(' '))) out.push('a closed week does not say it moved on and what comes back')
  return out
}
const wReal = wordFindings(statusLines)
say(wReal.length === 0, `real words${wReal.length ? ': ' + wReal.join('; ') : ''}`)
{
  const pct: LinesFn = (s, m) => { const l = statusLines(s, m); return { ...l, child: l.child.map((c) => ({ ...c, text: c.text.replace(/(\d) of 6 right/, (_, d) => `${Math.round((Number(d) / 6) * 100)}%`) })) } }
  say(wordFindings(pct).length > 0, 'control fires: a child line with a percent')
  const noGoal: LinesFn = (s, m) => { const l = statusLines(s, m); return { ...l, child: l.child.filter((c) => c.mark !== 'goal') } }
  say(wordFindings(noGoal).length > 0, 'control fires: a card that never says what moving on needs')
  const noMisses: LinesFn = (s) => statusLines(s, [])
  say(wordFindings(noMisses).length > 0, 'control fires: a grown-up part without the missed questions')
}

// ---------------------------------------------------------------------------
console.log('\nmisses — the latest sitting only')
function missFindings(fn: typeof latestSittingMisses): string[] {
  const out: string[] = []
  const a = fn(ROWS, NOW, pack).map((m) => `${m.item.id}:${m.answer}`).join(',')
  if (a !== 'B4-MB-04:6,B4-MB-05:9') out.push(`after the first re-check: ${a}`)
  // A second re-check (ids -MB-07..12): its misses only — not the first one's.
  const second: AttemptRow[] = [...ROWS, { item_id: 'B4-MB-10', answer: '4', correct: false, attempt_no: 2, created_at: '2026-10-17T16:01:00Z' }]
  const b = fn(second, ws('escalated', [FORM_A, FORM_B1, FORM_B2]), pack).map((m) => m.item.id).join(',')
  if (b !== 'B4-MB-10') out.push(`after the second re-check: ${b}`)
  return out
}
const mReal = missFindings(latestSittingMisses)
say(mReal.length === 0, `real reader${mReal.length ? ': ' + mReal.join('; ') : ''}`)
{
  const allB: typeof latestSittingMisses = (rows, w, p) =>
    latestSittingMisses(rows, { ...w, mastery: { attempts: w.mastery.attempts.map((x) => ({ ...x, cycle: 1 })) } }, p)
      .concat(latestSittingMisses(rows, w, p))
  say(missFindings(allB).length > 0, 'control fires: a card that lists the first re-check\'s misses after the second')
}

// ---------------------------------------------------------------------------
console.log('\nsources — the card is on the home screen; nothing promises a teacher')
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'src/modules/best-brains')
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), 'utf8')
const MIG = path.resolve(ROOT, '../supabase/migrations/20261015000001_bb_closed_week_moves_on.sql')
interface Srcs { hub: string; strengthen: string; copy: string; parentCopy: string; parentHome: string; migration: string }
const real: Srcs = {
  hub: read('screens/ThisWeekHub.tsx'),
  strengthen: read('screens/StrengthenPlan.tsx'),
  copy: read('copy.ts'),
  parentCopy: read('parentCopy.ts'),
  parentHome: read('screens/parent/ParentHome.tsx'),
  migration: fs.readFileSync(MIG, 'utf8'),
}
function sourceFindings(s: Srcs): string[] {
  const out: string[] = []
  if (!/\{status && <WeekStatusCard status=\{status\} band=\{band\} misses=\{statusMisses\} \/>\}/.test(s.hub)) out.push('the hub does not show the status card')
  if (/subtype\??\.replace\(/.test(s.hub)) out.push('the hub names the skill with the mistake\'s adult slug')
  if (!/const weekClosed = weekPassed \|\| escalated;/.test(s.hub) || !/weekClosed && !isToday\(closedAt\)/.test(s.hub)) out.push('a closed week cannot open the next one')
  if (/teacher/i.test(s.strengthen.replace(/\/\*\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''))) out.push('the strengthen screen still mentions a teacher')
  if (!/<WeekStatusCard status=\{status\} band=\{band\} misses=\{cardMisses\} \/>/.test(s.strengthen)) out.push('a closed week\'s strengthen screen does not show where it is at')
  const copyCode = s.copy.replace(/\/\*\*[\s\S]*?\*\//g, '')
  if (/teacher from our team|teacher friend/i.test(copyCode)) out.push('child copy still promises a teacher')
  if (/renaming step is wobbly|fighting you: renaming/.test(copyCode)) out.push('the spec\'s "renaming" example is back in the near-miss line')
  if (/escalated: 'Extra support'/.test(s.parentCopy)) out.push('the parent label still reads "Extra support"')
  if (!/<ComebackSummary /.test(s.parentHome) || !/stalledLine\(stalled\)/.test(s.parentHome)) out.push('the parent home lacks the week line or the comeback list')
  if (!/old_text constant text := 'After two strengthening rounds, a teacher from our team is stepping in and we are re-checking the starting point\. That is the system working as designed\.';/.test(s.migration)) out.push('the migration does not target the exact old sentence')
  if (!/RAISE EXCEPTION 'expected exactly 1 occurrence/.test(s.migration)) out.push('the migration does not assert the occurrence count')
  if (/teacher/i.test(s.migration.match(/new_text constant text := '([^;]*)';/)?.[1] ?? 'teacher')) out.push('the new report sentence mentions a teacher')
  return out
}
const sReal = sourceFindings(real)
say(sReal.length === 0, `real sources${sReal.length ? ': ' + sReal.join('; ') : ''}`)
{
  const slug = { ...real, hub: real.hub.replace('const status = weekStatus(weekState, pack);', "const status = weekStatus(weekState, pack); const s2 = pack.mistakeBank[0]?.subtype?.replace(/-/g, ' ');") }
  say(slug.hub !== real.hub && sourceFindings(slug).length > 0, 'control fires: the adult slug back on the hub')
  const stuck = { ...real, hub: real.hub.replace('const weekClosed = weekPassed || escalated;', 'const weekClosed = weekPassed;') }
  say(stuck.hub !== real.hub && sourceFindings(stuck).length > 0, 'control fires: a closed week that never opens the next')
  const promise = { ...real, copy: real.copy.replace("B: 'This week is done for now", "B: 'A real teacher from our team wants to look at this with you. This week is done for now") }
  say(promise.copy !== real.copy && sourceFindings(promise).length > 0, 'control fires: the teacher promise back in the copy')
  const renaming = { ...real, copy: real.copy.replace("So close — one step is still wobbly.", 'So close — just the renaming step is wobbly.') }
  say(renaming.copy !== real.copy && sourceFindings(renaming).length > 0, 'control fires: the "renaming" example back')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
