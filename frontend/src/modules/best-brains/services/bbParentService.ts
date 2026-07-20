/**
 * Best Brains-inspired module — parent-surface reads/writes (increment 5).
 *
 * The parent surface is read-mostly (PARENT-FLOWS surface law): reports are
 * written ONLY by the bb_score_mastery_check RPC; the parent's sole report
 * write is the acknowledge tap (column-level UPDATE grant on acknowledged_at).
 * Settings live in bb_enrollment.settings (ParentControls / SchoolSync);
 * trends derive from bb_week_state (mastery attempts + day_progress) and
 * bb_item_attempts (DD7 tags) — every stored signal is parent-visible (P12).
 */

import { supabase } from '@/lib/supabase';
import type {
  BBEnrollment,
  BBEnrollmentSettings,
  BBLevel,
  BBParentReport,
  ErrorTag,
  ReportNarrative,
  ReportVerdict,
  WeekState,
} from '../types';

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

interface ReportRow {
  child_id: string;
  level: BBLevel;
  week: number;
  narrative: ReportNarrative;
  verdict: ReportVerdict;
  percent: number;
  acknowledged_at: string | null;
  created_at: string;
}

const REPORT_COLS = 'child_id, level, week, narrative, verdict, percent, acknowledged_at, created_at';

function mapReport(row: ReportRow): BBParentReport {
  return {
    childId: row.child_id,
    level: row.level,
    week: row.week,
    narrative: row.narrative,
    verdict: row.verdict,
    percent: row.percent,
    acknowledgedAt: row.acknowledged_at ?? undefined,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Reports (Flow 2 — the weekly ritual)
// ---------------------------------------------------------------------------

/** All of one child's weekly reports, newest first (ReportHistory / ParentHome). */
export async function listReports(childId: string): Promise<BBParentReport[]> {
  const { data, error } = await supabase
    .from('bb_parent_reports')
    .select(REPORT_COLS)
    .eq('child_id', childId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ReportRow[]).map(mapReport);
}

export async function getReport(
  childId: string,
  level: BBLevel,
  week: number,
): Promise<BBParentReport | null> {
  const { data, error } = await supabase
    .from('bb_parent_reports')
    .select(REPORT_COLS)
    .eq('child_id', childId)
    .eq('level', level)
    .eq('week', week)
    .maybeSingle();
  if (error) throw error;
  return data ? mapReport(data as ReportRow) : null;
}

/**
 * The acknowledge tap (E15 sign-off ritual). The only report write a client
 * can make — the DB grants UPDATE on acknowledged_at alone. Idempotent-safe:
 * a second tap simply re-stamps; callers guard on acknowledgedAt to keep the
 * first timestamp.
 */
export async function acknowledgeReport(
  childId: string,
  level: BBLevel,
  week: number,
): Promise<string> {
  const stamp = new Date().toISOString();
  const { error } = await supabase
    .from('bb_parent_reports')
    .update({ acknowledged_at: stamp })
    .eq('child_id', childId)
    .eq('level', level)
    .eq('week', week);
  if (error) throw error;
  return stamp;
}

// ---------------------------------------------------------------------------
// Enrollment reads across children (ParentHome strips)
// ---------------------------------------------------------------------------

interface EnrollmentRow {
  child_id: string;
  level: BBLevel;
  placed_at: string | null;
  placement_result: BBEnrollment['placementResult'] | null;
  current_week: number;
  settings: BBEnrollmentSettings;
}

const ENROLLMENT_COLS = 'child_id, level, placed_at, placement_result, current_week, settings';

function mapEnrollment(row: EnrollmentRow): BBEnrollment {
  return {
    childId: row.child_id,
    level: row.level,
    placedAt: row.placed_at ?? undefined,
    placementResult: row.placement_result ?? undefined,
    currentWeek: row.current_week,
    settings: row.settings,
  };
}

/** Enrollments for a set of children (unenrolled children simply absent). */
export async function listEnrollments(childIds: string[]): Promise<Map<string, BBEnrollment>> {
  if (childIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from('bb_enrollment')
    .select(ENROLLMENT_COLS)
    .in('child_id', childIds);
  if (error) throw error;
  return new Map((data as EnrollmentRow[]).map((r) => [r.child_id, mapEnrollment(r)]));
}

/**
 * Merge a settings patch into bb_enrollment.settings (ParentControls /
 * SchoolSync). Read-merge-write; every change takes effect next session,
 * never mid-session (the child's FoundrySession reads settings at load).
 */
export async function updateEnrollmentSettings(
  childId: string,
  patch: Partial<BBEnrollmentSettings> & Record<string, unknown>,
): Promise<BBEnrollmentSettings> {
  const { data, error } = await supabase
    .from('bb_enrollment')
    .select('settings')
    .eq('child_id', childId)
    .single();
  if (error) throw error;
  const merged = { ...(data.settings as BBEnrollmentSettings), ...patch };
  const { error: updateError } = await supabase
    .from('bb_enrollment')
    .update({ settings: merged })
    .eq('child_id', childId);
  if (updateError) throw updateError;
  return merged;
}

// ---------------------------------------------------------------------------
// Read-only week-state view (never initializes rows from the parent surface)
// ---------------------------------------------------------------------------

interface WeekStateRow {
  child_id: string;
  level: BBLevel;
  week: number;
  pack_seed: number;
  content_version: string | null;
  state: WeekState['state'];
  day_progress: WeekState['dayProgress'];
  mastery: WeekState['mastery'];
  started_at: string | null;
  completed_at: string | null;
}

const WEEK_STATE_COLS =
  'child_id, level, week, pack_seed, content_version, state, day_progress, mastery, started_at, completed_at';

function mapWeekState(row: WeekStateRow): WeekState {
  return {
    childId: row.child_id,
    level: row.level,
    week: row.week,
    packSeed: Number(row.pack_seed),
    contentVersion: row.content_version ?? undefined,
    state: row.state,
    dayProgress: row.day_progress ?? {},
    mastery: row.mastery ?? { attempts: [] },
    startedAt: row.started_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
  };
}

/** All week cycles of a level, read-only (ParentHome strip / Trends / MasteryMap). */
export async function listWeekStatesReadOnly(childId: string, level: BBLevel): Promise<WeekState[]> {
  const { data, error } = await supabase
    .from('bb_week_state')
    .select(WEEK_STATE_COLS)
    .eq('child_id', childId)
    .eq('level', level)
    .order('week');
  if (error) throw error;
  return (data as WeekStateRow[]).map(mapWeekState);
}

// ---------------------------------------------------------------------------
// Sprint history (TrendsView fluency panel — self-referenced, ungraded)
// ---------------------------------------------------------------------------

export interface SprintWeekCounts {
  packId: string;
  /** Correct counts per sprint run (attempt_no ordinal within the week). */
  counts: number[];
}

/** Completed sprint runs across all weeks (item_id `<sprintId>#<nn>`, day NULL). */
export async function listSprintCounts(childId: string): Promise<SprintWeekCounts[]> {
  const { data, error } = await supabase
    .from('bb_item_attempts')
    .select('pack_id, item_id, attempt_no, correct')
    .eq('child_id', childId)
    .is('day', null)
    .like('item_id', '%-FS-%');
  if (error) throw error;
  const byPack = new Map<string, Map<number, number>>();
  for (const row of data as Array<{ pack_id: string; attempt_no: number; correct: boolean }>) {
    const pack = byPack.get(row.pack_id) ?? new Map<number, number>();
    pack.set(row.attempt_no, (pack.get(row.attempt_no) ?? 0) + (row.correct ? 1 : 0));
    byPack.set(row.pack_id, pack);
  }
  return [...byPack.entries()].map(([packId, ordinals]) => ({
    packId,
    counts: [...ordinals.entries()].sort((a, b) => a[0] - b[0]).map(([, n]) => n),
  }));
}

// ---------------------------------------------------------------------------
// Mistake patterns (DD7 tags in parent language — PatternsView)
// ---------------------------------------------------------------------------

export interface MissGroup {
  errorTag: ErrorTag;
  /** Misses carrying this tag inside the window. */
  count: number;
  /** Misses within the last 7 days (pattern-vs-one-off framing). */
  countThisWeek: number;
  lastMissedAt: string;
  /** Packs (weeks) the tag appeared in, e.g. ["MFM-C1"]. */
  packIds: string[];
}

/**
 * Recent misses grouped by DD7 primary tag (last `windowDays`, daily work +
 * checks). Item-level right/wrong never surfaces day-by-day (P9) — this view
 * is the weekly-rhythm aggregate the reports draw from.
 */
export async function listMissGroups(childId: string, windowDays = 28): Promise<MissGroup[]> {
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('bb_item_attempts')
    .select('pack_id, error_tag, created_at')
    .eq('child_id', childId)
    .eq('correct', false)
    .not('error_tag', 'is', null)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const groups = new Map<ErrorTag, MissGroup>();
  for (const row of data as Array<{ pack_id: string; error_tag: ErrorTag; created_at: string }>) {
    const g = groups.get(row.error_tag) ?? {
      errorTag: row.error_tag,
      count: 0,
      countThisWeek: 0,
      lastMissedAt: row.created_at,
      packIds: [],
    };
    g.count += 1;
    if (new Date(row.created_at).getTime() >= weekAgo) g.countThisWeek += 1;
    if (!g.packIds.includes(row.pack_id)) g.packIds.push(row.pack_id);
    groups.set(row.error_tag, g);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count);
}
