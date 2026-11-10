/**
 * sheetPass — when a Kumon sheet moves on (ruling R1, 2026-11-10).
 *
 * WHY. Until now every finished sheet advanced (`currentWorksheet + 1`) and the
 * "80%" in the record only labelled the row, measured on FINAL answers (retries
 * included) and on totals a reload double-counted. Re-scored under this rule,
 * the owner's son's C15–C55 sittings would have repeated 32 times out of 42,
 * mostly on time: right answers, still worked out rather than recalled (C30:
 * 974 s for ten facts). Kumon's own rule is accuracy AND speed; this is it.
 *   docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md (R1), docs/TUTORING-PRINCIPLES.md §2.
 *
 * THE RULE
 *  - A sheet PASSES when at least 8 in 10 of its problems are right on their
 *    FIRST check with no help opened before it (no help-ladder rung, no tap to
 *    uncover the fact; a table simply open on an ordered sheet is the sheet,
 *    not help), AND the sheet took at most 2 × the standard time for its run of
 *    sheets with the app in view (corrections included, as in Kumon; a lesson
 *    shown before the sheet is not).
 *  - Not passed → the same sheet again, its numbers in a new order or new.
 *  - The third sitting in a run that does not pass moves on anyway, and the
 *    parent's page logs it. The parent can move on, repeat or go back at any time.
 *  - A time that was not measured never holds a child back: the sheet is then
 *    judged on first try alone, and the record says so.
 *
 * Pure: no database, no React. The gate is scripts/kumon-pass-rule-test.ts.
 */
import { getSctForSheet } from './sct'

export const PASS_FIRST_TRY_PER_TEN = 8
export const MAX_TRIES = 3

// ---------------------------------------------------------------------------
// The time allowed: generous on a new skill, tightening sheet by sheet
// ---------------------------------------------------------------------------

/**
 * Owner, 2026-11-10: "start with 10 min per sheet so he has good time and then slowly
 * decline to reach 5 min" — on his stacked sheets (standard 2 min) that is 5× the
 * standard falling to 2.5×, 30 s less with each new sheet of the skill (C56 10 min,
 * C57 9½ … 5 min from the eleventh sheet). Other runs use the same multiples of their
 * own standard (times tables 7½ → 3¾ min). A repeat keeps its sheet's allowance.
 */
export const TIME_START_FACTOR = 5
export const TIME_FLOOR_FACTOR = 2.5
export const TIME_STEP_FACTOR = 0.25

export function timeFactorAt(position: number): number {
  const p = Math.max(1, Math.floor(position || 1))
  return Math.max(TIME_FLOOR_FACTOR, TIME_START_FACTOR - TIME_STEP_FACTOR * (p - 1))
}

/**
 * Where a NEW kind of work begins — a new times table, stacked multiplication, 3–4
 * digits, division, remainders, long division — and the time allowance starts
 * generous again. The bigger-number steps inside stacked multiplication (C61, C71, …)
 * are the same method and do not restart it. Levels not listed: their sheet 1.
 */
export const SKILL_STARTS: Record<string, number[]> = {
  C: [1, 11, 15, 21, 25, 31, 35, 41, 45, 51, 101, 111, 121, 161, 181],
  D: [1, 51, 131, 141, 161],
}

export function skillStart(level: string, worksheet: number): number {
  const starts = (SKILL_STARTS[level] ?? [1]).filter((x) => x <= worksheet)
  return starts.length ? Math.max(...starts) : 1
}

/**
 * Where this sheet sits in its skill: 1 + the sheets of the skill before it that were
 * actually WORKED under this rule (they have a sitting). Counting worked sheets, not
 * sheet numbers, is what lets a child already partway through a skill when the rule
 * began — him, at C56 of a skill that starts at C51 — begin at the generous end.
 */
export function skillPosition(level: string, worksheet: number, rows: Array<{ worksheet_number: number; sittings?: unknown }>): number {
  const from = skillStart(level, worksheet)
  const worked = new Set<number>()
  for (const r of rows) {
    if (r.worksheet_number < from || r.worksheet_number >= worksheet || !Array.isArray(r.sittings)) continue
    if ((r.sittings as SheetEvent[]).some((e) => e && e.kind === 'sitting')) worked.add(r.worksheet_number)
  }
  return 1 + worked.size
}

// ---------------------------------------------------------------------------
// One problem
// ---------------------------------------------------------------------------

export interface FirstCheck {
  /** Right on its first check. */
  firstTryRight: boolean
  /** Highest help-ladder rung opened before that check (0 = none). */
  helpRung: number
  /** He tapped to uncover the asked fact on the table before that check. */
  tableRevealed: boolean
}

/** Right on the first check with nothing opened before it — the only answer that counts toward a pass. */
export function firstTryUnaided(c: FirstCheck): boolean {
  return c.firstTryRight && (c.helpRung ?? 0) === 0 && !c.tableRevealed
}

/**
 * The sheet's first checks, keyed by the problem's PLACE on the sheet ("page:index"),
 * not by its id. A page shown twice (a reload used to re-serve page 2 with new ids)
 * is still ten places: the first time he met a place is the one that counts.
 */
export interface SheetLedger {
  /** "level:worksheet:variant" — a ledger never leaks into another sitting. */
  sheet: string
  unaided: Record<string, boolean>
  /** Right in the end (after retries), for the totals; not part of the rule. */
  finallyRight: Record<string, boolean>
}

export function ledgerStart(sheet: string): SheetLedger {
  return { sheet, unaided: {}, finallyRight: {} }
}

export function ledgerRecord(l: SheetLedger, place: string, unaided: boolean, finallyRight: boolean): SheetLedger {
  if (place in l.unaided) return l
  return { ...l, unaided: { ...l.unaided, [place]: unaided }, finallyRight: { ...l.finallyRight, [place]: finallyRight } }
}

/** A problem on the one-at-a-time path that came right after a retry (its first check stays as it was). */
export function ledgerFinal(l: SheetLedger, place: string, right: boolean): SheetLedger {
  if (!(place in l.unaided) || l.finallyRight[place] === right) return l
  return { ...l, finallyRight: { ...l.finallyRight, [place]: right } }
}

export function sheetKey(level: string, worksheet: number, variant: number): string {
  return `${level}:${worksheet}:${variant}`
}

export function ledgerCounts(l: SheetLedger): { problems: number; firstTry: number; finallyRight: number } {
  const places = Object.keys(l.unaided)
  return {
    problems: places.length,
    firstTry: places.filter((p) => l.unaided[p]).length,
    finallyRight: places.filter((p) => l.finallyRight[p]).length,
  }
}

// ---------------------------------------------------------------------------
// The record of a sheet (worksheet_progress.sittings, newest last)
// ---------------------------------------------------------------------------

export type SheetOutcome = 'pass' | 'repeat' | 'moved_on'
export type ParentAction = 'parent_move_on' | 'parent_repeat' | 'parent_go_back'
export type Reason = 'first_try' | 'time'

export interface SittingRecord {
  kind: 'sitting'
  at: string
  outcome: SheetOutcome
  /** Which try of the current run this was (1, 2, 3). */
  tryNumber: number
  problems: number
  firstTry: number
  /** Seconds with the app in view; null when the clock did not run. */
  seconds: number | null
  /** The time this sitting was allowed (the declining allowance, 2026-11-10). */
  limitSeconds?: number
  sctSeconds: number
  /** seconds ÷ (standard time for this many problems); null when unmeasured. */
  timeRatio: number | null
  focusScore: number | null
  reasons: Reason[]
  sessionId?: string | null
}

export interface ParentRecord {
  kind: 'parent'
  at: string
  outcome: ParentAction
  from?: number
  to?: number
}

export type SheetEvent = SittingRecord | ParentRecord

/** Sittings in the sheet's current run that did not pass: trailing 'repeat's since anything else. */
export function nonPassesInRun(events: SheetEvent[] | null | undefined): number {
  let n = 0
  for (let i = (events ?? []).length - 1; i >= 0; i--) {
    const e = events![i]
    if (e.kind === 'sitting' && e.outcome === 'repeat') n++
    else break
  }
  return n
}

// ---------------------------------------------------------------------------
// The decision
// ---------------------------------------------------------------------------

export interface SheetDecisionInput {
  level: string
  worksheet: number
  problems: number
  firstTry: number
  /** Seconds with the app in view; null or 0 = not measured. */
  seconds: number | null
  /** Sittings of this run already not passed (nonPassesInRun). */
  priorNonPasses: number
  /** Where the sheet sits in its skill (skillPosition): 1 = the most generous time. */
  position: number
}

export interface SheetDecision {
  outcome: SheetOutcome
  passed: boolean
  firstTryOk: boolean
  timeOk: boolean
  timeMeasured: boolean
  /** Standard time for ten problems of this run. */
  sctSeconds: number
  /** The most time that passes, for this many problems. */
  limitSeconds: number
  /** The allowance as a multiple of the standard (timeFactorAt(position)). */
  timeFactor: number
  timeRatio: number | null
  reasons: Reason[]
  tryNumber: number
  /** The position moves on (pass, or the run's last try). */
  advance: boolean
}

export function decideSheet(i: SheetDecisionInput): SheetDecision {
  const sctSeconds = getSctForSheet(i.level, i.worksheet)
  const n = Math.max(1, i.problems)
  const scaled = (sctSeconds * n) / 10
  const timeFactor = timeFactorAt(i.position)
  const limitSeconds = Math.round(timeFactor * scaled)
  const timeMeasured = i.seconds !== null && i.seconds > 0
  const timeRatio = timeMeasured ? Math.round((i.seconds! / scaled) * 100) / 100 : null
  // Integer form of "at least 80%": 8 of 10, 12 of 15, 16 of 20.
  const firstTryOk = i.problems > 0 && i.firstTry * 10 >= PASS_FIRST_TRY_PER_TEN * i.problems
  const timeOk = !timeMeasured || i.seconds! <= timeFactor * scaled
  const passed = firstTryOk && timeOk
  const tryNumber = Math.max(0, i.priorNonPasses) + 1
  const outcome: SheetOutcome = passed ? 'pass' : tryNumber >= MAX_TRIES ? 'moved_on' : 'repeat'
  const reasons: Reason[] = []
  if (!firstTryOk) reasons.push('first_try')
  if (!timeOk) reasons.push('time')
  return { outcome, passed, firstTryOk, timeOk, timeMeasured, sctSeconds, limitSeconds, timeFactor, timeRatio, reasons, tryNumber, advance: outcome !== 'repeat' }
}

export function sittingRecord(
  d: SheetDecision,
  s: { problems: number; firstTry: number; seconds: number | null; focusScore: number | null; sessionId?: string | null; at?: string },
): SittingRecord {
  return {
    kind: 'sitting',
    at: s.at ?? new Date().toISOString(),
    outcome: d.outcome,
    tryNumber: d.tryNumber,
    problems: s.problems,
    firstTry: s.firstTry,
    seconds: d.timeMeasured ? Math.round(s.seconds!) : null,
    limitSeconds: d.limitSeconds,
    sctSeconds: d.sctSeconds,
    timeRatio: d.timeRatio,
    focusScore: s.focusScore,
    reasons: d.reasons,
    sessionId: s.sessionId ?? null,
  }
}

/**
 * The columns a sitting writes on its worksheet_progress row. `status` stays inside
 * the table's CHECK (not_started / in_progress / completed): 'completed' means
 * PASSED; a sheet moved on without passing stays 'in_progress' and its sittings say so.
 */
export function mergeSitting(
  existing: { sittings?: unknown; times_attempted?: number | null; best_score?: number | null; completed_at?: string | null } | null,
  s: SittingRecord,
  finallyRight: number,
): {
  sittings: SheetEvent[]
  status: 'in_progress' | 'completed'
  times_attempted: number
  first_try_correct: number
  problems_total: number
  best_score: number
  best_score_total: number
  sct_seconds: number
  time_vs_sct: number | null
  avg_focus_score: number | null
  completed_at?: string
} {
  const prior = Array.isArray(existing?.sittings) ? (existing!.sittings as SheetEvent[]) : []
  const sittings = [...prior, s]
  const focus = sittings.filter((e): e is SittingRecord => e.kind === 'sitting' && typeof e.focusScore === 'number').map((e) => e.focusScore as number)
  return {
    sittings,
    status: s.outcome === 'pass' ? 'completed' : (existing?.completed_at ? 'completed' : 'in_progress'),
    times_attempted: (existing?.times_attempted ?? 0) + 1,
    first_try_correct: s.firstTry,
    problems_total: s.problems,
    // Right in the end, out of the sheet's PROBLEMS (was: retries in the total).
    best_score: Math.max(existing?.best_score ?? 0, finallyRight),
    best_score_total: s.problems,
    sct_seconds: s.sctSeconds,
    time_vs_sct: s.timeRatio === null ? null : Math.min(999.99, s.timeRatio),
    avg_focus_score: focus.length ? Math.round((focus.reduce((a, b) => a + b, 0) / focus.length) * 100) / 100 : null,
    ...(s.outcome === 'pass' && !existing?.completed_at ? { completed_at: s.at } : {}),
  }
}

// ---------------------------------------------------------------------------
// Words — the child's, then the parent's
// ---------------------------------------------------------------------------

/**
 * What the child reads when a sheet ends. A repeat carries no score and no clock,
 * and never the word "failed"; a pass names the count, never a percent.
 */
export function childSheetMessage(
  d: SheetDecision,
  sheet: { level: string; worksheet: number; next: number; problems: number; firstTry: number; newNumbers: boolean },
): string {
  if (d.outcome === 'repeat') return repeatBanner(sheet.newNumbers, d.reasons)
  if (d.outcome === 'moved_on') return `Time for a new sheet: ${sheet.level}${sheet.next}.`
  return `🎉 ${sheet.level}${sheet.worksheet} done!\n✅ ${sheet.firstTry} of ${sheet.problems} right the first time\nNext: ${sheet.level}${sheet.next}`
}

/**
 * The line on top of a repeated sheet (and the end-of-sheet message that leads to it).
 * It names the GOAL in a child's words, never a score or a clock (review, 2026-11-10):
 * most repeats are right answers that were worked out — "Good work!" first, then the
 * aim, recall ("pop right into your head"); a repeat on first try asks him to look
 * before he checks. `reasons` empty (unknown) reads as the first-try line.
 */
export function repeatBanner(newNumbers: boolean, reasons: Reason[] = []): string {
  const sheet = newNumbers ? 'Same sheet, new numbers' : 'Same sheet again'
  const timeOnly = reasons.length === 1 && reasons[0] === 'time'
  return timeOnly
    ? `Good work! ${sheet} — let's see if the answers pop right into your head.`
    : `${sheet} — take a good look at each one before you check.`
}

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0)

/** 345 → "5:45" (the parent reads time in minutes, as the owner set it). */
export function mmss(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** A sitting's time for the parent: "4:20 of 9:00" (taken of allowed). */
function timeText(s: SittingRecord): string {
  if (s.seconds === null) return 'time not measured'
  if (typeof s.limitSeconds === 'number') return `${mmss(s.seconds)} of ${mmss(s.limitSeconds)}`
  return s.timeRatio === null ? mmss(s.seconds) : `${s.timeRatio.toFixed(1)}× standard`
}

/** "C52: moved on after 3 tries — first try 60%, 7:30 of 6:00" */
export function movedOnLogLine(level: string, worksheet: number, s: SittingRecord): string {
  return `${level}${worksheet}: moved on after ${s.tryNumber} tries — first try ${pct(s.firstTry, s.problems)}%, ${timeText(s)}`
}

/**
 * One sitting for the parent's list: "Not yet · try 1 of 3" over "6 of 10 first try ·
 * 4:20 of 9:00 · focus 92%" (time taken of time allowed). What fell short is flagged (missedFirstTry / missedTime)
 * for the page to mark, rather than spelled out in a line that wraps on a phone.
 */
export function parentSittingLine(s: SittingRecord): {
  score: string
  time: string
  focus: string | null
  outcome: string
  missedFirstTry: boolean
  missedTime: boolean
} {
  return {
    score: `${s.firstTry} of ${s.problems} first try`,
    time: timeText(s),
    focus: s.focusScore === null ? null : `focus ${Math.round(s.focusScore)}%`,
    outcome:
      s.outcome === 'pass' ? (s.tryNumber > 1 ? `Passed on try ${s.tryNumber}` : 'Passed')
      : s.outcome === 'repeat' ? `Not yet · try ${s.tryNumber} of ${MAX_TRIES}`
      : `Moved on · try ${s.tryNumber} of ${MAX_TRIES}`,
    missedFirstTry: s.reasons.includes('first_try'),
    missedTime: s.reasons.includes('time'),
  }
}

/** A parent's move, as the parent's list shows it (written on the sheet the child was moved FROM). */
export function parentActionLine(level: string, worksheet: number, e: ParentRecord): string {
  if (e.outcome === 'parent_move_on') return `${level}${worksheet}: you moved on to ${level}${e.to}`
  if (e.outcome === 'parent_repeat') return `${level}${worksheet}: you set ${level}${e.to} to repeat`
  return `${level}${worksheet}: you moved back to ${level}${e.to}`
}
