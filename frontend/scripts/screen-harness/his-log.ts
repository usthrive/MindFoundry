/**
 * The owner's son's real Best Brains record at Level B, read from bb_week_state and
 * bb_item_attempts on 2026-10-15 — shared by the screen harness (main.tsx) and the
 * photo driver (bb-moving-on-visual.ts) so the two can never disagree. The child
 * is 'harness' here; no name.
 *
 * `hisLog(true)` adds a HYPOTHETICAL second re-check of week 4 (3 of 6 — the two
 * slots he missed before missed again, plus one) to show a closed week. It has not
 * happened.
 */
import type { DayProgress, MasteryAttempt } from '../../src/modules/best-brains/types';

export const B4_SEED = 645474193;

export const B4_DAYS: DayProgress = {
  lesson: { state: 'done', completedAt: '2026-10-02T23:07:56.166Z' },
  '1': { state: 'done', completedAt: '2026-10-02T23:07:56.166Z' },
  '2': { state: 'done', accuracyPct: 100, completedAt: '2026-10-06T00:18:17.406Z' },
  '3': { state: 'done', accuracyPct: 100, completedAt: '2026-10-07T23:57:38.505Z' },
  '4': { state: 'done', accuracyPct: 40, completedAt: '2026-10-10T01:38:01.568Z' },
  '5': { state: 'done', completedAt: '2026-10-13T01:18:12.130Z' },
} as DayProgress;

export const B4_A: MasteryAttempt = { form: 'A', cycle: 0, scorePct: 100, attemptedAt: '2026-10-13T01:18:12.066Z', stabilityHold: true, dominantErrorTags: [] };
export const B4_B1: MasteryAttempt = { form: 'B', cycle: 1, scorePct: 67, attemptedAt: '2026-10-14T23:57:19.538Z', stabilityHold: false, dominantErrorTags: ['concept-misconception', 'task-comprehension'] };
/** Hypothetical (see the header). */
export const B4_B2: MasteryAttempt = { form: 'B', cycle: 2, scorePct: 50, attemptedAt: '2026-10-14T23:59:00.000Z', stabilityHold: false, dominantErrorTags: ['task-comprehension'] };

export interface LogRow {
  child_id: string; pack_id: string; item_id: string; answer: string; correct: boolean;
  attempt_no: number; hint_rungs_used: number; created_at: string; day: number | null; error_tag: string | null;
}

const att = (pack_id: string, item_id: string, answer: string, correct: boolean, created_at: string, attempt_no = 1, hint_rungs_used = 0): LogRow =>
  ({ child_id: 'harness', pack_id, item_id, answer, correct, attempt_no, hint_rungs_used, created_at, day: null, error_tag: null });

export function hisLog(withSecondRecheck = false): LogRow[] {
  const rows: LogRow[] = [
    att('MFM-B1', 'B1-MA-02', '41', false, '2026-07-21T16:00:00Z'),
    att('MFM-B1', 'B1-MA-01', '17', false, '2026-07-30T18:00:00Z'),
    att('MFM-B1', 'B1-MA-04', '6', false, '2026-07-30T18:03:00Z'),
    att('MFM-B1', 'B1-MA-02', '51', false, '2026-08-12T16:00:00Z'),
    att('MFM-B1', 'B1-MA-03', '8', false, '2026-08-12T16:01:00Z'),
    att('MFM-B1', 'B1-MA-04', '2', false, '2026-08-12T16:02:00Z'),
    att('MFM-B1', 'B1-MB-02', '5', false, '2026-08-13T02:20:00Z'),
    att('MFM-B2', 'B2-MA-02', '6', false, '2026-08-26T16:00:00Z'),
    att('MFM-B2', 'B2-MA-04', 'B', false, '2026-08-26T16:01:00Z'),
    att('MFM-B2', 'B2-MA-05', '4', false, '2026-08-26T16:02:00Z'),
    att('MFM-B2', 'B2-MA-06', '4', false, '2026-08-26T16:03:00Z'),
    att('MFM-B3', 'B3-MA-05', 'C', false, '2026-09-26T16:55:00Z'),
    att('MFM-B3', 'B3-MA-06', '5', false, '2026-09-26T16:56:00Z'),
    att('MFM-B3', 'B3-MB-04', '70', false, '2026-09-28T23:12:00Z'),
    ...['20', '11', '6', '11', '9', 'B'].map((a, i) => att('MFM-B4', `B4-MA-0${i + 1}`, a, true, `2026-10-13T01:1${i}:00Z`)),
    att('MFM-B4', 'B4-MB-01', '13', true, '2026-10-14T23:53:55Z'),
    att('MFM-B4', 'B4-MB-02', '6', true, '2026-10-14T23:54:41Z'),
    att('MFM-B4', 'B4-MB-03', '14', true, '2026-10-14T23:55:01Z'),
    att('MFM-B4', 'B4-MB-04', '6', false, '2026-10-14T23:55:45Z'),
    att('MFM-B4', 'B4-MB-05', '9', false, '2026-10-14T23:56:48Z'),
    att('MFM-B4', 'B4-MB-06', 'A', true, '2026-10-14T23:57:18Z'),
    att('MFM-B4', 'B4-MB-04', 'review: 5', false, '2026-10-14T23:57:38Z', 2, 1),
    att('MFM-B4', 'B4-MB-04', 'review: 46', false, '2026-10-14T23:58:17Z', 2, 2),
    att('MFM-B4', 'B4-MB-05', 'review: 3', true, '2026-10-14T23:58:38Z', 2, 1),
  ];
  if (withSecondRecheck) {
    ['8', '15', '3'].forEach((a, i) => rows.push(att('MFM-B4', `B4-MB-0${7 + i}`, a, true, `2026-10-14T23:58:5${i}Z`)));
    ['6', '9', 'B'].forEach((a, i) => rows.push(att('MFM-B4', `B4-MB-${10 + i}`, a, false, `2026-10-14T23:58:5${3 + i}Z`)));
  }
  return rows;
}

export function weekRows() {
  return [
    { level: 'B', week: 1, pack_seed: 895570878, state: 'passed' },
    { level: 'B', week: 2, pack_seed: 1551373962, state: 'fast_track' },
    { level: 'B', week: 3, pack_seed: 1262874861, state: 'passed' },
    { level: 'B', week: 4, pack_seed: B4_SEED, state: 'cycle2' },
  ].map((r) => ({ child_id: 'harness', content_version: '1.2.0', lesson_segment: null, day_progress: {}, mastery: { attempts: [] }, started_at: null, completed_at: null, ...r }));
}
