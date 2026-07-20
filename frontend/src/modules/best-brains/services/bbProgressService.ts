/**
 * Best Brains-inspired module — persistence service (increment 3).
 *
 * All reads/writes for bb_enrollment, bb_week_state, bb_item_attempts.
 * Packs are NEVER persisted: bb_week_state stores only (pack_seed,
 * content_version); screens regenerate via generatePack (DD15 law).
 *
 * DD1 state transitions go through transitionWeekState(), which validates
 * against WEEK_STATE_TRANSITIONS — an illegal transition throws (the machine
 * is the only mastery state space).
 */

import { supabase } from '@/lib/supabase';
import { CONTENT_VERSION } from '../generator/packGenerator';
import { WEEK_STATE_TRANSITIONS } from '../constants';
import type {
  BBEnrollment,
  BBEnrollmentSettings,
  BBLevel,
  DayProgress,
  DayProgressEntry,
  ErrorTag,
  PlacementResult,
  WeekMasteryRecord,
  WeekMasteryState,
  WeekState,
} from '../types';

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

interface EnrollmentRow {
  child_id: string;
  level: BBLevel;
  placed_at: string | null;
  placement_result: PlacementResult | null;
  current_week: number;
  settings: BBEnrollmentSettings;
}

interface WeekStateRow {
  child_id: string;
  level: BBLevel;
  week: number;
  pack_seed: number;
  content_version: string | null;
  state: WeekMasteryState;
  day_progress: DayProgress;
  mastery: WeekMasteryRecord;
  started_at: string | null;
  completed_at: string | null;
}

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

// ---------------------------------------------------------------------------
// Enrollment
// ---------------------------------------------------------------------------

export async function getEnrollment(childId: string): Promise<BBEnrollment | null> {
  const { data, error } = await supabase
    .from('bb_enrollment')
    .select('child_id, level, placed_at, placement_result, current_week, settings')
    .eq('child_id', childId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapEnrollment(data as EnrollmentRow) : null;
}

/**
 * Enroll (or re-place) a child from a completed placement walk (Flow 1).
 * Writes placed level + entry week; StartingPoint calls this once.
 */
export async function enroll(childId: string, placement: PlacementResult): Promise<BBEnrollment> {
  const payload = {
    child_id: childId,
    level: placement.placedLevel,
    placed_at: placement.completedAt,
    placement_result: placement,
    current_week: placement.entryWeek,
  };
  const { data, error } = await supabase
    .from('bb_enrollment')
    .upsert(payload, { onConflict: 'child_id' })
    .select('child_id, level, placed_at, placement_result, current_week, settings')
    .single();
  if (error) throw error;
  return mapEnrollment(data as EnrollmentRow);
}

// ---------------------------------------------------------------------------
// Week state
// ---------------------------------------------------------------------------

/** Random non-negative 31-bit pack seed (packs regenerate from it forever). */
function newPackSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

/**
 * Fetch the (child, level, week) cycle row, creating it on first touch with a
 * fresh pack seed + the current content version (pinned thereafter — DD15).
 */
export async function getOrInitWeekState(
  childId: string,
  level: BBLevel,
  week: number,
): Promise<WeekState> {
  const { data, error } = await supabase
    .from('bb_week_state')
    .select('child_id, level, week, pack_seed, content_version, state, day_progress, mastery, started_at, completed_at')
    .eq('child_id', childId)
    .eq('level', level)
    .eq('week', week)
    .maybeSingle();
  if (error) throw error;
  if (data) return mapWeekState(data as WeekStateRow);

  const insert = {
    child_id: childId,
    level,
    week,
    pack_seed: newPackSeed(),
    content_version: CONTENT_VERSION,
  };
  const { data: created, error: insertError } = await supabase
    .from('bb_week_state')
    .insert(insert)
    .select('child_id, level, week, pack_seed, content_version, state, day_progress, mastery, started_at, completed_at')
    .single();
  if (insertError) {
    // Concurrent init (two tabs): fall back to the row that won.
    if (insertError.code === '23505') {
      const { data: existing, error: refetchError } = await supabase
        .from('bb_week_state')
        .select('child_id, level, week, pack_seed, content_version, state, day_progress, mastery, started_at, completed_at')
        .eq('child_id', childId)
        .eq('level', level)
        .eq('week', week)
        .single();
      if (refetchError) throw refetchError;
      return mapWeekState(existing as WeekStateRow);
    }
    throw insertError;
  }
  return mapWeekState(created as WeekStateRow);
}

/** All week cycles of a level for one child (JourneyMap shelf / hub context). */
export async function listWeekStates(childId: string, level: BBLevel): Promise<WeekState[]> {
  const { data, error } = await supabase
    .from('bb_week_state')
    .select('child_id, level, week, pack_seed, content_version, state, day_progress, mastery, started_at, completed_at')
    .eq('child_id', childId)
    .eq('level', level)
    .order('week');
  if (error) throw error;
  return (data as WeekStateRow[]).map(mapWeekState);
}

/**
 * DD1 transition — validates against WEEK_STATE_TRANSITIONS and throws on any
 * illegal edge. `startedAt`/`completedAt` stamped on the relevant edges.
 */
export async function transitionWeekState(
  current: WeekState,
  next: WeekMasteryState,
  mastery?: WeekMasteryRecord,
): Promise<WeekState> {
  const legal = WEEK_STATE_TRANSITIONS[current.state];
  if (!legal.includes(next)) {
    throw new Error(`Illegal DD1 transition ${current.state} -> ${next} (week ${current.level}${current.week})`);
  }
  const patch: Record<string, unknown> = { state: next };
  if (current.state === 'not_started' && next === 'in_week') {
    patch.started_at = new Date().toISOString();
  }
  if (next === 'passed' || next === 'fast_track') {
    patch.completed_at = new Date().toISOString();
  }
  if (mastery) patch.mastery = mastery;

  const { data, error } = await supabase
    .from('bb_week_state')
    .update(patch)
    .eq('child_id', current.childId)
    .eq('level', current.level)
    .eq('week', current.week)
    .select('child_id, level, week, pack_seed, content_version, state, day_progress, mastery, started_at, completed_at')
    .single();
  if (error) throw error;
  return mapWeekState(data as WeekStateRow);
}

/**
 * Merge one day's progress entry into day_progress JSONB (read-merge-write;
 * per-child single-writer in practice). Keys "1".."5"; the extra "lesson" key
 * marks the Day-1 lesson+guided gate.
 */
export async function updateDayProgress(
  state: WeekState,
  dayKey: string,
  entry: DayProgressEntry,
): Promise<WeekState> {
  const merged: DayProgress = { ...state.dayProgress, [dayKey]: entry };
  const { data, error } = await supabase
    .from('bb_week_state')
    .update({ day_progress: merged })
    .eq('child_id', state.childId)
    .eq('level', state.level)
    .eq('week', state.week)
    .select('child_id, level, week, pack_seed, content_version, state, day_progress, mastery, started_at, completed_at')
    .single();
  if (error) throw error;
  return mapWeekState(data as WeekStateRow);
}

// ---------------------------------------------------------------------------
// Item attempts (append-only telemetry)
// ---------------------------------------------------------------------------

export interface RecordAttemptInput {
  childId: string;
  packId: string;
  itemId: string;
  answer: string;
  correct: boolean;
  /** Hint rungs revealed before this attempt (0–3). */
  hintRungsUsed: number;
  attemptNo: number;
  /** 1–5 for daily work; null for placement / Form B / sprints. */
  day: number | null;
  errorTag?: ErrorTag;
}

/** Append one attempt row. Fire-and-forget friendly: failures are logged, never thrown. */
export async function recordItemAttempt(input: RecordAttemptInput): Promise<void> {
  const { error } = await supabase.from('bb_item_attempts').insert({
    child_id: input.childId,
    pack_id: input.packId,
    item_id: input.itemId,
    answer: input.answer.slice(0, 500),
    correct: input.correct,
    hint_rungs_used: Math.min(3, Math.max(0, input.hintRungsUsed)),
    attempt_no: Math.max(1, input.attemptNo),
    day: input.day,
    error_tag: input.errorTag ?? null,
  });
  if (error) {
    // Telemetry must never break the child's session (offline queues arrive in a later increment).
    console.error('[bb] attempt insert failed', error.message);
  }
}
