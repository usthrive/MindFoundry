/**
 * Skill states — a pure function of the attempt log (ENGINE-SPEC §4.6; METHODOLOGY §4;
 * TAD §2). The log is the record; `sm_skill_state` is only a projection of this.
 *
 *   not started → learning (first served)
 *   learning → known      two separate LOCAL days, each with a first-try right answer,
 *                         no scaffold visible, within the skill's fluency time
 *   known → learning      a miss on a return (or a comeback)
 *   learning → stuck      6 practice days on which the skill was served without one clean day
 *   stuck → learning      a clean day
 *   stuck → parked        the parent parks it (an input event), allowed only after 6 more
 *   parked → learning     a parked skill's return answered right
 *
 * Readings this module makes (each stated in testing/STAGE1-RUN2-NOTES.md):
 *   - Evidence roles. Only `practice`, `return` and `comeback` answers earn "knows" (TAD §2:
 *     "knows" is earned on practice days and returns). Starter, step, exit, entry, warm,
 *     placement, preview and review answers never do.
 *   - A check pass "is one day's evidence, never knows" (ENGINE §4.6): a first-try right,
 *     scaffold-free check answer can supply ONE of the two days, never both, and never alone.
 *   - Days are the attempt's `localDay` (the device's calendar day), never the UTC date.
 *   - Fluency: 1.5 × the median of the first six first-try-right, scaffold-free evidence
 *     times. Until six exist, no time limit applies (the condition is waived). It is
 *     recomputed at the first attempt of each later calendar month from the last six such
 *     times, and may fall by at most a fifth per month (rising is not limited).
 *   - "Already knows" (DD24, EXEMPLAR §3): two first-try right `preview` or `placement`
 *     answers on separate local days. It cuts a later lesson's steps to one; it is not "known".
 *   - A return miss resets the qualifying days: a skill moved back needs two new days.
 */

import type { SMAttempt, SMRole, SMSkillState } from '../types'

export const EVIDENCE_ROLES: readonly SMRole[] = ['practice', 'return', 'comeback']
/** A check pass counts as one day's evidence at most (ENGINE §4.6). */
export const ONE_DAY_ROLES: readonly SMRole[] = ['check']
/** Roles that are not "served" for a skill (a review re-answer is teaching, not serving; the demo is never an attempt). */
const NOT_SERVED: readonly SMRole[] = ['review']
export const STALL_DAYS = 6
export const PARK_AFTER = 12
export const FLUENCY_FACTOR = 1.5
export const FLUENCY_SAMPLE = 6
export const FLUENCY_MAX_FALL = 0.8

export interface MasteryEvent {
  kind: 'park'
  skillId: string
  localDay: string
}

export interface SkillStatus {
  skillId: string
  state: SMSkillState
  /** The local days that count toward "known" now, with the role kind that earned each. */
  qualifyingDays: Array<{ day: string; via: 'practice' | 'check' }>
  /** Distinct local days on which the skill was served (any role but review). */
  servedDays: string[]
  /** Practice days served without a clean day, since the last clean day. */
  practiceDaysSinceClean: number
  /** Was known, then a return miss moved it back. */
  movedBack: boolean
  alreadyKnows: boolean
  /** The fluency time in effect now (ms); null = no limit yet (fewer than six times). */
  fluencyMs: number | null
  lastServedDay: string | null
  /** Parent park events ignored because the skill was not eligible (shown, never silent). */
  ignoredEvents: MasteryEvent[]
}

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

const month = (day: string) => day.slice(0, 7)

/** Attempts in log order (createdAt; ties keep their order). */
export function inLogOrder(attempts: readonly SMAttempt[]): SMAttempt[] {
  return attempts.map((a, i) => ({ a, i })).sort((x, y) => x.a.createdAt.localeCompare(y.a.createdAt) || x.i - y.i).map((x) => x.a)
}

const unaided = (a: SMAttempt) => a.firstTryCorrect && !a.scaffoldVisible

/** One skill's status from the whole attempt log (attempts of other skills are ignored). */
export function skillStatus(skillId: string, attempts: readonly SMAttempt[], events: readonly MasteryEvent[] = []): SkillStatus {
  const mine = inLogOrder(attempts).filter((a) => a.skillIds.includes(skillId))
  const st: SkillStatus = {
    skillId, state: 'not-started', qualifyingDays: [], servedDays: [], practiceDaysSinceClean: 0,
    movedBack: false, alreadyKnows: false, fluencyMs: null, lastServedDay: null, ignoredEvents: [],
  }
  const times: number[] = []
  let fluencyMonth: string | null = null
  const previewDays = new Set<string>()
  const myEvents = events.filter((e) => e.skillId === skillId)

  const days = [...new Set(mine.map((a) => a.localDay))]
  // events on days with no attempts still apply, in day order
  for (const e of myEvents) if (!days.includes(e.localDay)) days.push(e.localDay)
  days.sort()

  for (const day of days) {
    const today = mine.filter((a) => a.localDay === day)
    let practiceServed = false
    let practiceClean = true
    for (const a of today) {
      if (NOT_SERVED.includes(a.role)) continue
      // A preview or placement answer never moves a skill (ENGINE §4.4: a preview miss never
      // makes it "learning"); two right ones on separate days mark "already knows".
      if (a.role === 'preview' || a.role === 'placement') {
        if (a.firstTryCorrect) previewDays.add(day)
        continue
      }
      if (!st.servedDays.includes(day)) st.servedDays.push(day)
      st.lastServedDay = day
      if (st.state === 'not-started') st.state = 'learning'

      // fluency in effect for THIS attempt: from earlier times only
      if (times.length >= FLUENCY_SAMPLE) {
        if (fluencyMonth === null) {
          st.fluencyMs = FLUENCY_FACTOR * median(times.slice(0, FLUENCY_SAMPLE))
          fluencyMonth = month(day)
        } else if (month(day) > fluencyMonth) {
          const fresh = FLUENCY_FACTOR * median(times.slice(-FLUENCY_SAMPLE))
          st.fluencyMs = Math.max(fresh, (st.fluencyMs as number) * FLUENCY_MAX_FALL)
          fluencyMonth = month(day)
        }
      }
      const inTime = st.fluencyMs === null || a.firstTryMs <= st.fluencyMs
      const evidence = EVIDENCE_ROLES.includes(a.role)

      if (evidence && unaided(a)) times.push(a.firstTryMs)

      // a miss on a return moves a known skill back (or a parked skill's return right brings it back)
      if ((a.role === 'return' || a.role === 'comeback') && !a.firstTryCorrect && st.state === 'known') {
        st.state = 'learning'
        st.movedBack = true
        st.qualifyingDays = []
      }
      if ((a.role === 'return' || a.role === 'comeback') && a.firstTryCorrect && st.state === 'parked') {
        st.state = 'learning'
        st.practiceDaysSinceClean = 0
      }

      // qualifying days toward "known"
      if (st.state === 'learning' || st.state === 'stuck') {
        const counted = st.qualifyingDays.some((q) => q.day === day)
        if (evidence && unaided(a) && inTime && !counted) st.qualifyingDays.push({ day, via: 'practice' })
        else if (ONE_DAY_ROLES.includes(a.role) && unaided(a) && inTime && !counted && !st.qualifyingDays.some((q) => q.via === 'check')) {
          st.qualifyingDays.push({ day, via: 'check' })
        }
        if (st.qualifyingDays.length >= 2 && st.qualifyingDays.some((q) => q.via === 'practice')) {
          st.state = 'known'
          st.practiceDaysSinceClean = 0
        }
      }

      // the stall rule reads practice days only
      if (a.dayKind === 'practice' && EVIDENCE_ROLES.includes(a.role)) {
        practiceServed = true
        if (!unaided(a)) practiceClean = false
      }
    }
    if (practiceServed) {
      if (practiceClean) {
        st.practiceDaysSinceClean = 0
        if (st.state === 'stuck') st.state = 'learning'
      } else if (st.state === 'learning' || st.state === 'stuck') {
        st.practiceDaysSinceClean++
        if (st.state === 'learning' && st.practiceDaysSinceClean >= STALL_DAYS) st.state = 'stuck'
      }
    }
    for (const e of myEvents.filter((x) => x.localDay === day)) {
      if (e.kind === 'park' && st.state === 'stuck' && st.practiceDaysSinceClean >= PARK_AFTER) st.state = 'parked'
      else st.ignoredEvents.push(e)
    }
  }
  st.alreadyKnows = previewDays.size >= 2
  return st
}

/** Every listed skill's status (a projection, rebuildable at any time). */
export function skillStates(skillIds: readonly string[], attempts: readonly SMAttempt[], events: readonly MasteryEvent[] = []): Record<string, SkillStatus> {
  return Object.fromEntries(skillIds.map((s) => [s, skillStatus(s, attempts, events)]))
}
