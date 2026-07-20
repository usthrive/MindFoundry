/**
 * Best Brains-inspired module — week/day derivation logic (pure).
 *
 * The daily-unlock law (P1/E46/E79): day tiles unlock one per calendar day,
 * in order, with NO early unlock — finishing early never opens tomorrow.
 * Day labels are day-numbers, never weekday names (DD3): a missed day simply
 * shifts, nothing "breaks".
 */

import type { DayProgress, DayProgressEntry, DayTileState } from '../types';
import { BAND_SESSION_CAPS, DAYS_PER_WEEK } from '../constants';
import type { SessionLengthSetting } from '../types';
import type { InteractionBand } from '../copy';

/** Key used inside day_progress for the Day-1 lesson+guided gate. */
export const LESSON_KEY = 'lesson';

export function isLessonComplete(dayProgress: DayProgress): boolean {
  return dayProgress[LESSON_KEY]?.state === 'done';
}

function isDone(entry: DayProgressEntry | undefined): boolean {
  return entry?.state === 'done';
}

function completedToday(entry: DayProgressEntry | undefined, now: Date): boolean {
  if (!entry?.completedAt) return false;
  const d = new Date(entry.completedAt);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export interface DerivedTiles {
  /** Tile state per day 1..5. */
  tiles: Record<number, DayTileState>;
  /** The single actionable day, or null when the week's days are all done or resting. */
  todayDay: number | null;
  /** True when today's actionable day is locked only because yesterday finished today. */
  restingUntilTomorrow: boolean;
  daysDone: number;
}

/**
 * Derive the five day tiles from stored progress + the clock.
 * Law: the first not-done day is "today" IFF the previous day was not
 * completed on the same calendar day; otherwise it rests until tomorrow.
 */
export function deriveTiles(dayProgress: DayProgress, now: Date = new Date()): DerivedTiles {
  const tiles: Record<number, DayTileState> = {};
  let todayDay: number | null = null;
  let resting = false;

  for (let day = 1; day <= DAYS_PER_WEEK; day++) {
    const entry = dayProgress[String(day)];
    if (isDone(entry)) {
      tiles[day] = 'done';
      continue;
    }
    if (todayDay === null && !resting) {
      const prev = day === 1 ? undefined : dayProgress[String(day - 1)];
      const prevDone = day === 1 || isDone(prev);
      if (prevDone && !completedToday(prev, now)) {
        todayDay = day;
        tiles[day] = entry?.state === 'partial' ? 'partial' : 'today';
        continue;
      }
      if (prevDone && completedToday(prev, now)) {
        // Finished a day today → the next tile rests until the morning (P1).
        resting = true;
      }
    }
    tiles[day] = 'locked';
  }

  const daysDone = Object.values(tiles).filter((t) => t === 'done').length;
  return { tiles, todayDay, restingUntilTomorrow: resting, daysDone };
}

/**
 * LS1-R1 — session-length setting → minutes under the AGE-BANDED cap
 * (replaces the flat 15-min cap): short ≈5, standard = band target
 * (8/12/15), full = band hard cap (10/15/20). No setting extends the hard
 * cap (E45 — "more isn't better here — consistency is").
 */
export function sessionCapMinutes(
  setting: SessionLengthSetting | undefined,
  band: InteractionBand = 'B',
): number {
  const caps = BAND_SESSION_CAPS[band];
  const map: Record<SessionLengthSetting, number> = {
    short: 5,
    standard: caps.target,
    full: caps.hard,
  };
  return Math.min(map[setting ?? 'standard'], caps.hard);
}

/**
 * Route-level day-unlock guard (fixes the increment-3 known limitation):
 * a deep link to /foundry/day/N/* is legal only when tile N is the actionable
 * day under the daily-unlock law. Completed days stay reachable read-only via
 * the hub, never via day routes.
 */
export function isDayActionable(dayProgress: DayProgress, day: number, now: Date = new Date()): boolean {
  const { tiles } = deriveTiles(dayProgress, now);
  return tiles[day] === 'today' || tiles[day] === 'partial';
}
