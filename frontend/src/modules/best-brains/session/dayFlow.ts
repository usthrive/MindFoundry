/**
 * dayFlow — ONE answer to "which screen serves which of today's items", shared
 * by WarmUp, PracticePage and PuzzleGrove so the three can never disagree.
 *
 * WHY (2026-09-04, REPORT-2026-09-04-SCREEN-LAYER-QA §3). WarmUp promises "2–4
 * fast retrieval items" (DD8) but the pack gives it exactly ONE on 81% of Level
 * A days and 70% of Level B days, so a whole screen — opener, question, "All
 * warmed up!" — was built around a single question. A parent watching saw "only
 * 1–2 questions on Day 2"; the day had five. And Day 1, which has no warm-up
 * screen at all (Lesson → Guided → practice), simply never showed its retrieval
 * items: one to two questions a week generated and dropped, at every level.
 *
 * The rule: a warm-up screen exists only when it has its 2–4 items. Otherwise
 * the retrieval items join the day's work as its FIRST questions — the same
 * item, the same DD13 feedback, one continuous run. `total` is what the
 * day-level counter ("Question k of N") reads on every screen.
 */

import type { BBBand, PackDay, PackItem, WeeklyConceptPack } from '../types';

export interface DayFlow {
  /** Items the WarmUp screen serves; empty means "no warm-up screen today". */
  warmup: PackItem[];
  /** Items the work screen serves (PracticePage on Days 1–4, PuzzleGrove on Day 5). */
  work: PackItem[];
  /** Every question the child meets today: warm-up + work. */
  total: number;
}

/** WarmUp's own contract (DD8). */
export const WARMUP_MIN_ITEMS = 2;

export function dayFlow(packDay: PackDay): DayFlow {
  const retrieval = packDay.items.filter((i) => i.isRetrieval);
  const rest = packDay.items.filter((i) => !i.isRetrieval);
  // Day 1 has no warm-up route (the lesson opens the day); a warm-up screen on
  // Days 2–5 only when it holds its 2+ items.
  const separate = packDay.day >= 2 && retrieval.length >= WARMUP_MIN_ITEMS;
  return separate
    ? { warmup: retrieval, work: rest, total: packDay.items.length }
    : { warmup: [], work: [...retrieval, ...rest], total: packDay.items.length };
}

/**
 * Pages per day — `PackDay.pageCount` is a NUMBER OF PAGES everywhere it is
 * read (types.ts, QG-6, PracticePage's sprint boundary). Band A works one
 * operation to a page (E62), so its count is the work screen's item count; the
 * other bands carry two pages. Stamped ONCE per pack by `restampPageCounts`,
 * after every step that moves items between days (the LS1-R4 retrieval ramp),
 * because a count taken inside the builder is stale by the time the pack is
 * served — that was the 2026-09-04 defect's second life.
 */
export function pagesPerDay(band: BBBand, workItems: number): number {
  return band === 'beginner' ? Math.max(1, workItems) : 2;
}

export function restampPageCounts(pack: WeeklyConceptPack): void {
  for (const day of pack.days) day.pageCount = pagesPerDay(pack.identity.band, dayFlow(day).work.length);
}
