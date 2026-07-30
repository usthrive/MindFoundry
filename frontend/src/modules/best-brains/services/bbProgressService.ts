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
  MasteryForm,
  ParentSummarySeed,
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
  lesson_segment: number | null;
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
    lessonSegment: row.lesson_segment ?? null,
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
    .select('child_id, level, week, pack_seed, content_version, state, lesson_segment, day_progress, mastery, started_at, completed_at')
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
    .select('child_id, level, week, pack_seed, content_version, state, lesson_segment, day_progress, mastery, started_at, completed_at')
    .single();
  if (insertError) {
    // Concurrent init (two tabs): fall back to the row that won.
    if (insertError.code === '23505') {
      const { data: existing, error: refetchError } = await supabase
        .from('bb_week_state')
        .select('child_id, level, week, pack_seed, content_version, state, lesson_segment, day_progress, mastery, started_at, completed_at')
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
    .select('child_id, level, week, pack_seed, content_version, state, lesson_segment, day_progress, mastery, started_at, completed_at')
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
    .select('child_id, level, week, pack_seed, content_version, state, lesson_segment, day_progress, mastery, started_at, completed_at')
    .single();
  if (error) throw error;
  return mapWeekState(data as WeekStateRow);
}

/**
 * Merge one day's progress entry into day_progress JSONB (read-merge-write;
 * per-child single-writer in practice). Keys "1".."5"; the extra "lesson" key
 * marks the Day-1 lesson+guided gate.
 */
/**
 * Where the lesson got to, so it resumes at a segment boundary on any device.
 *
 * This lived in `sessionStorage`, which dies with the tab — so a child who closed
 * the app part-way through Ms. Wren's explanation restarted it from the hook. It
 * is a single small integer, written on each Continue and cleared when the lesson
 * is pinned, so it is sent fire-and-forget: a slow write must never sit between a
 * child and the next thing she says.
 */
export async function saveLessonSegment(
  state: WeekState,
  segment: number | null,
): Promise<void> {
  const { error } = await supabase
    .from('bb_week_state')
    .update({ lesson_segment: segment })
    .eq('child_id', state.childId)
    .eq('level', state.level)
    .eq('week', state.week);
  if (error) throw error;
}

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
    .select('child_id, level, week, pack_seed, content_version, state, lesson_segment, day_progress, mastery, started_at, completed_at')
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

/**
 * Advance the enrollment pointer to the next week (WeekResolve "reveal next
 * week" — the cycle turns; the hub paces days from there). Gates stay intact:
 * callers only invoke this from a PASSED/FAST_TRACK week.
 */
export async function advanceToNextWeek(childId: string, nextWeek: number): Promise<void> {
  const { error } = await supabase
    .from('bb_enrollment')
    .update({ current_week: Math.min(24, Math.max(1, nextWeek)) })
    .eq('child_id', childId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Mastery scoring (server-side RPC — the client can never write a verdict)
// ---------------------------------------------------------------------------

export interface MasteryAnswerInput {
  itemId: string;
  answer: string;
  correct: boolean;
  errorTag?: ErrorTag;
}

export interface MasteryScoreResult {
  /** DD1 state the RPC transitioned the week into. */
  state: WeekMasteryState;
  scorePct: number;
  /** Parent-facing verdict written to bb_parent_reports. */
  verdict: 'passed' | 'one_more_round' | 'escalated';
  /** LS1-R5: true when the check passed but a practice day held the verdict back. */
  stabilityHold: boolean;
}

/**
 * Score a mastery check server-side (SECURITY DEFINER RPC): the server
 * recomputes the percent, applies DD1 + the LS1-R5 stability rule, writes the
 * bb_week_state transition + mastery JSONB, and upserts the weekly parent
 * report (E102 frame; verdict + % parent-only). A DB trigger rejects any
 * client-side write of verdict states, so this call is the only path.
 */
export async function scoreMasteryCheck(
  state: WeekState,
  form: MasteryForm,
  answers: MasteryAnswerInput[],
  summarySeed: ParentSummarySeed,
): Promise<MasteryScoreResult> {
  const { data, error } = await supabase.rpc('bb_score_mastery_check', {
    p_child_id: state.childId,
    p_level: state.level,
    p_week: state.week,
    p_form: form,
    p_answers: answers.map((a) => ({
      itemId: a.itemId,
      answer: a.answer.slice(0, 500),
      correct: a.correct,
      errorTag: a.errorTag ?? null,
    })),
    p_summary_seed: summarySeed,
  });
  if (error) throw error;
  const row = data as { state: WeekMasteryState; score_pct: number; verdict: MasteryScoreResult['verdict']; stability_hold: boolean };
  return {
    state: row.state,
    scorePct: row.score_pct,
    verdict: row.verdict,
    stabilityHold: row.stability_hold,
  };
}

// ---------------------------------------------------------------------------
// Sprints (DD11 — self-referenced history only, never a grade)
// ---------------------------------------------------------------------------

/**
 * Correct-counts of this child's completed sprints of one sprint id, keyed by
 * sprint ordinal (attempt_no convention, see session/sprintLogic.ts). Powers
 * "you versus your own last time" and the C-band personal sparkline — this
 * child only, by construction.
 */
export async function getSprintHistory(
  childId: string,
  packId: string,
  sprintId: string,
): Promise<number[]> {
  const { data, error } = await supabase
    .from('bb_item_attempts')
    .select('attempt_no, correct')
    .eq('child_id', childId)
    .eq('pack_id', packId)
    .like('item_id', `${sprintId}#%`)
    .is('day', null);
  if (error) throw error;
  const byOrdinal = new Map<number, number>();
  for (const row of data as Array<{ attempt_no: number; correct: boolean }>) {
    if (row.correct) byOrdinal.set(row.attempt_no, (byOrdinal.get(row.attempt_no) ?? 0) + 1);
    else if (!byOrdinal.has(row.attempt_no)) byOrdinal.set(row.attempt_no, 0);
  }
  return [...byOrdinal.entries()].sort((a, b) => a[0] - b[0]).map(([, count]) => count);
}

// ---------------------------------------------------------------------------
// Treasure chest (parked items derived from the append-only attempt log)
// ---------------------------------------------------------------------------

export interface ParkedItemRef {
  itemId: string;
  missCount: number;
  lastMissedAt: string;
  errorTag?: ErrorTag;
}

/**
 * Parked daily-practice items for a pack (Flow 7): an item is parked when it
 * holds ≥2 misses, its latest attempt is still a miss, it re-parked at most
 * twice (≥4 total misses folds the skill into warm-up rotation instead —
 * never an ever-growing pile), and it isn't stale (>14 days silently retires).
 * Mastery-check and sprint slots (MA/MB/FS/PZ) never park.
 */
export async function listParkedItems(childId: string, packId: string): Promise<ParkedItemRef[]> {
  const { data, error } = await supabase
    .from('bb_item_attempts')
    .select('item_id, correct, error_tag, created_at')
    .eq('child_id', childId)
    .eq('pack_id', packId)
    .order('created_at');
  if (error) throw error;

  const byItem = new Map<string, { misses: number; lastCorrect: boolean; lastAt: string; tag?: ErrorTag }>();
  for (const row of data as Array<{ item_id: string; correct: boolean; error_tag: ErrorTag | null; created_at: string }>) {
    if (!/-D\d-/.test(row.item_id)) continue; // daily slots only
    const entry = byItem.get(row.item_id) ?? { misses: 0, lastCorrect: false, lastAt: row.created_at };
    if (!row.correct) {
      entry.misses += 1;
      if (row.error_tag) entry.tag = row.error_tag;
    }
    entry.lastCorrect = row.correct;
    entry.lastAt = row.created_at;
    byItem.set(row.item_id, entry);
  }

  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const parked: ParkedItemRef[] = [];
  for (const [itemId, e] of byItem) {
    if (e.misses >= 2 && e.misses < 4 && !e.lastCorrect && new Date(e.lastAt).getTime() >= cutoff) {
      parked.push({ itemId, missCount: e.misses, lastMissedAt: e.lastAt, errorTag: e.tag });
    }
  }
  return parked.sort((a, b) => a.itemId.localeCompare(b.itemId));
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
