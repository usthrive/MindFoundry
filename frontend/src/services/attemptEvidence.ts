/**
 * attemptEvidence — what actually happened on one problem, recorded so the app
 * can tell "knows it" from "finished it".
 *
 * WHY (2026-09-26, docs/BRIEF-2026-09-26-RECALL-NOT-LOOKUP.md, phase P0).
 * The owner's son reached Kumon Level C sheet 50 with 419 of 419 answers
 * recorded correct. Only 305 were right on the first try; he read the times
 * table on the sheets where it sits open; and every per-question time was 0.
 * The worksheet grid — the mode he works in — saved `time_spent: 0` by design
 * and never passed the table flag at all, so the three things a tutor would
 * look at first (first try, time, scaffold) were missing or blind.
 *
 * This module is the pure half: a dwell clock that times each problem while it
 * is the child's ACTIVE problem, up to the page's first check (first-try time,
 * not retry time), and the scaffold exposure of each problem over the same
 * window. It records only. What counts as "known" (first try, no scaffold,
 * within fluency time, on two days) is decided later, by owner ruling; see
 * docs/TUTORING-PRINCIPLES.md §2.
 *
 * Nothing here is shown to the child. No timer, no score, no copy changes.
 */

/** The times-table card's support on a sheet (level-c.ts `getTimesTableSupport`). */
export type ScaffoldMode = 'open' | 'tap' | 'covered'

/** One problem's evidence, gathered up to the first check of its page. */
export interface AttemptEvidence {
  /** Milliseconds the problem was the child's active problem before its page's first check. */
  firstTryMs: number | null
  /** Every answer submitted for it, in order (the first is the first try). */
  triedAnswers: string[]
  /** The sheet's table support, or null when the sheet has no table. */
  scaffoldMode: ScaffoldMode | null
  /** The table was on screen while this was the active problem, before the first check. */
  scaffoldShownBeforeFirstCheck: boolean
  /** The child tapped to uncover the asked fact while this was active, before the first check. */
  scaffoldRevealedBeforeFirstCheck: boolean
  /**
   * Highest rung of the help ladder he opened before the first check: 0 none,
   * 1 think, 2 use a fact he knows, 3 count it, 4 the table. Over days this is
   * the number that should fall — the plainest record of learning there is.
   */
  helpRungBeforeFirstCheck: number
}

// ---------------------------------------------------------------------------
// Dwell clock — time on the active problem, per key, with pauses
// ---------------------------------------------------------------------------

/**
 * The clock every duration here is read from. MONOTONIC on purpose: the wall
 * clock (`Date.now()`) can jump when a device re-syncs its time, and on
 * 2026-09-26 the browser proof caught it jumping 10–12 s BACKWARDS mid-sheet,
 * which would have written negative or inflated first-try times. Durations
 * always come from `performance.now()`; wall time is only for timestamps.
 */
export function monotonicNow(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now()
}

/**
 * `key` identifies a problem (its generated id, unique per sheet attempt). The clock runs
 * for exactly one key at a time; switching keys closes the running interval.
 * `frozen` keys never accumulate again (their page has been checked).
 */
export interface DwellClock {
  activeKey: string | null
  since: number | null
  ms: Record<string, number>
  frozen: Record<string, true>
}

export function dwellStart(): DwellClock {
  return { activeKey: null, since: null, ms: {}, frozen: {} }
}

function close(clock: DwellClock, now: number): Record<string, number> {
  if (clock.activeKey === null || clock.since === null || clock.frozen[clock.activeKey]) return clock.ms
  const add = Math.max(0, now - clock.since)
  return { ...clock.ms, [clock.activeKey]: (clock.ms[clock.activeKey] ?? 0) + add }
}

/** Make `key` the running problem (null = nothing running, e.g. page hidden). */
export function dwellSwitch(clock: DwellClock, key: string | null, now: number): DwellClock {
  const ms = close(clock, now)
  return { ...clock, ms, activeKey: key, since: key === null ? null : now }
}

/** Stop timing these keys for good (their page's first check has happened). */
export function dwellFreeze(clock: DwellClock, keys: string[], now: number): DwellClock {
  const ms = close(clock, now)
  const frozen = { ...clock.frozen }
  for (const k of keys) frozen[k] = true
  // Keep running on the same key only if it is not one we just froze.
  const stillActive = clock.activeKey !== null && !frozen[clock.activeKey]
  return { ms, frozen, activeKey: clock.activeKey, since: stillActive ? now : null }
}

/** Milliseconds recorded for a key, or null when it was never active before its check. */
export function dwellMs(clock: DwellClock, key: string): number | null {
  const v = clock.ms[key]
  return v === undefined ? null : Math.round(v)
}

// ---------------------------------------------------------------------------
// Scaffold exposure — was the table there while he worked this problem?
// ---------------------------------------------------------------------------

export interface ScaffoldLedger {
  shown: Record<string, true>
  revealed: Record<string, true>
  /** Highest help-ladder rung opened per problem before its first check. */
  rung: Record<string, number>
  frozen: Record<string, true>
}

export function scaffoldStart(): ScaffoldLedger {
  return { shown: {}, revealed: {}, rung: {}, frozen: {} }
}

/** Called when the child opens a rung of the help ladder; keeps the highest. */
export function scaffoldHelp(ledger: ScaffoldLedger, activeKey: string | null, rung: number): ScaffoldLedger {
  if (!activeKey || ledger.frozen[activeKey] || (ledger.rung[activeKey] ?? 0) >= rung) return ledger
  return { ...ledger, rung: { ...ledger.rung, [activeKey]: rung } }
}

/** Called whenever the active problem or the table's visibility changes. */
export function scaffoldObserve(ledger: ScaffoldLedger, activeKey: string | null, visible: boolean): ScaffoldLedger {
  if (!activeKey || !visible || ledger.frozen[activeKey] || ledger.shown[activeKey]) return ledger
  return { ...ledger, shown: { ...ledger.shown, [activeKey]: true } }
}

/** Called when the child taps to uncover the asked fact. Uncovering implies shown. */
export function scaffoldReveal(ledger: ScaffoldLedger, activeKey: string | null): ScaffoldLedger {
  if (!activeKey || ledger.frozen[activeKey]) return ledger
  return {
    ...ledger,
    shown: { ...ledger.shown, [activeKey]: true },
    revealed: { ...ledger.revealed, [activeKey]: true },
  }
}

export function scaffoldFreeze(ledger: ScaffoldLedger, keys: string[]): ScaffoldLedger {
  const frozen = { ...ledger.frozen }
  for (const k of keys) frozen[k] = true
  return { ...ledger, frozen }
}

// ---------------------------------------------------------------------------
// The stored shape
// ---------------------------------------------------------------------------

/**
 * The keys P0 adds to `problem_attempts.hints_used` (JSONB; no migration).
 * Exported so the evidence gate can assert every save path writes them.
 */
export const EVIDENCE_KEYS = [
  'firstTryMs',
  'triedAnswers',
  'scaffoldMode',
  'scaffoldShownBeforeFirstCheck',
  'scaffoldRevealedBeforeFirstCheck',
  'helpRungBeforeFirstCheck',
] as const

export function evidencePayload(e: AttemptEvidence): Record<(typeof EVIDENCE_KEYS)[number], unknown> {
  return {
    firstTryMs: e.firstTryMs,
    triedAnswers: e.triedAnswers.slice(0, 12).map((a) => String(a).slice(0, 40)),
    scaffoldMode: e.scaffoldMode,
    scaffoldShownBeforeFirstCheck: e.scaffoldShownBeforeFirstCheck,
    scaffoldRevealedBeforeFirstCheck: e.scaffoldRevealedBeforeFirstCheck,
    helpRungBeforeFirstCheck: e.helpRungBeforeFirstCheck,
  }
}

/**
 * `time_spent` column (integer seconds, nullable): the first-try time, rounded.
 * NULL when it was not measured — never 0, which is what made 419 blind rows
 * look like 419 instant answers.
 */
export function firstTrySeconds(e: AttemptEvidence | undefined): number | null {
  return e?.firstTryMs == null ? null : Math.max(0, Math.round(e.firstTryMs / 1000))
}
