/**
 * Sprint bookkeeping (DD11) — pure helpers shared by the offer site
 * (PracticePage) and the sprint screens.
 *
 * Conventions:
 *  - Completed sprints live in day_progress under keys "sprint-1"/"sprint-2"
 *    (DayProgressEntry-shaped: state 'done' + completedAt) — the ≤2/week
 *    budget reads these.
 *  - A same-day decline is a localStorage politeness flag only (P11: no
 *    record of declining is ever shown or stored server-side).
 *  - Attempt rows for sprint items use item_id `<sprintId>#<nn>` (the '-FS-'
 *    infix marks sprint telemetry), day NULL, and attempt_no = the sprint's
 *    ordinal within the week (1 or 2) — which is what makes the
 *    self-referenced "you versus your own last time" comparison queryable.
 */

import type { DayProgress } from '../types';
import { SPRINTS_PER_WEEK_MAX } from '../constants';
import type { BBEnrollment, WeeklyConceptPack, WeekState } from '../types';

export function sprintsUsedThisWeek(dayProgress: DayProgress): number {
  let n = 0;
  for (let i = 1; i <= SPRINTS_PER_WEEK_MAX; i++) {
    if (dayProgress[`sprint-${i}`]?.state === 'done') n += 1;
  }
  return n;
}

export function sprintDeclineKey(packId: string): string {
  return `bb-sprint-declined-${packId}`;
}

export function declinedToday(packId: string): boolean {
  try {
    return localStorage.getItem(sprintDeclineKey(packId)) === new Date().toDateString();
  } catch {
    return false;
  }
}

/**
 * The SprintGate offer law (Flow 5): pack carries a sprint, today is its
 * scheduled day (2 or 3), Level B+ only, parent hasn't opted out, budget
 * unspent, and no decline earlier today.
 */
export function sprintEligible(
  enrollment: BBEnrollment,
  weekState: WeekState,
  pack: WeeklyConceptPack,
  day: number,
): boolean {
  const sprint = pack.fluencySprint;
  if (!sprint) return false;
  if (enrollment.level === 'A') return false; // DD11: never at Level A
  if (enrollment.settings.sprintOptOut) return false; // parent boundary (P11)
  if (day !== sprint.scheduledDay) return false;
  if (sprintsUsedThisWeek(weekState.dayProgress) >= SPRINTS_PER_WEEK_MAX) return false;
  if (declinedToday(pack.packId)) return false; // never re-ask same day
  return true;
}
