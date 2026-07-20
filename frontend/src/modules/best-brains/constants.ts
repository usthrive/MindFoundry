/**
 * Best Brains-inspired module ("Foundry Method") — binding constants.
 *
 * Sources: METHODOLOGY-MODEL.md (constitution), DESIGN-DEFAULTS.md rows cited inline.
 * These values are LAW for the module; screens/generators/state machines read them
 * from here, never re-declare them.
 */

import type { BBLevel, WeekMasteryState } from './types';

/** Module id as registered in the core module registry. */
export const BB_MODULE_ID = 'best-brains' as const;

// ---------------------------------------------------------------------------
// Level ladder (DD2: neutral letter codes, never grade numbers on child surfaces)
// ---------------------------------------------------------------------------

export const BB_LEVELS: readonly BBLevel[] = ['A', 'B', 'C', 'D', 'E'] as const;

export const BB_LEVEL_DISPLAY_NAMES: Record<BBLevel, string> = {
  A: 'Level A',
  B: 'Level B',
  C: 'Level C',
  D: 'Level D',
  E: 'Level E',
};

/** 24 weekly concepts per level, two blocks of 12 with a mid-level checkpoint (METHODOLOGY §2). */
export const WEEKS_PER_LEVEL = 24;
/** Mid-level checkpoint week (METHODOLOGY §2 / CURRICULUM-MAP). */
export const CHECKPOINT_WEEK = 12;
/** Day-numbered practice days per week (DD3). */
export const DAYS_PER_WEEK = 5;

// ---------------------------------------------------------------------------
// DD1 mastery gate — the un-overridable advancement law
// ---------------------------------------------------------------------------

/** Pass threshold as a fraction (DD1: 85%, band 80–90, tune in-band only). */
export const MASTERY_THRESHOLD = 0.85;
/** Pass threshold as a percent, matching pack.masteryCheck.passThresholdPct. */
export const MASTERY_THRESHOLD_PCT = 85;
/** DD1 tuning band bounds — passThresholdPct may only move within [80, 90]. */
export const MASTERY_BAND_MIN_PCT = 80;
export const MASTERY_BAND_MAX_PCT = 90;
/** Form B ≥95% on the first corrective pass skips cycle two (DD1 fast-track). */
export const FAST_TRACK_THRESHOLD = 0.95;
export const FAST_TRACK_PCT = 95;
/** Two failed corrective cycles → escalate to live teacher + placement re-check (DD1). */
export const MAX_CORRECTIVE_CYCLES = 2;

/**
 * Legal DD1 state transitions (METHODOLOGY §5 pseudocode + SCREEN-SPECS routing map).
 * Any transition not listed here is a bug — the machine is the ONLY mastery state space.
 */
export const WEEK_STATE_TRANSITIONS: Record<WeekMasteryState, readonly WeekMasteryState[]> = {
  not_started: ['in_week'],
  in_week: ['mastery_check'],
  // Form A scored: >=85 pass, <85 near-miss cycle 1.
  mastery_check: ['passed', 'near_miss_cycle1'],
  // Cycle 1 Form B: >=95 fast-track, >=85 pass, <85 cycle 2.
  near_miss_cycle1: ['fast_track', 'passed', 'cycle2'],
  // Cycle 2 Form B: >=85 pass, <85 escalate (live teacher + placement re-check).
  cycle2: ['passed', 'escalated'],
  // Escalation resolves via intervention/re-check, then the week may still pass.
  escalated: ['passed'],
  passed: [],
  fast_track: [],
};

/** Terminal "week is owned" states — both count as mastered, indistinguishable in warmth. */
export const PASSED_STATES: readonly WeekMasteryState[] = ['passed', 'fast_track'];

/** States inside the DD1 corrective loop (the hub shows the dual-thread line). */
export const CORRECTIVE_STATES: readonly WeekMasteryState[] = ['near_miss_cycle1', 'cycle2'];

/**
 * LS1-R5 (DD1.1) — mastery stability rule: the weekly verdict considers week
 * stability, not the check alone. Advance requires check ≥ MASTERY_THRESHOLD
 * AND no completed practice day materially below 0.80. "Materially below" is
 * implemented as first-attempt day accuracy < 75% (i.e., more than 5pp under
 * the 80% stability line). Mirrored in the bb_score_mastery_check RPC — the
 * SQL constant must match this one.
 */
export const STABILITY_MIN_PCT = 75;

// ---------------------------------------------------------------------------
// Daily dose & retention engine
// ---------------------------------------------------------------------------

/** Daily dose bounds in minutes (E12) — the CONTENT dose model (validator QG side). */
export const DAILY_DOSE_MIN_MINUTES = 5;
export const DAILY_DOSE_MAX_MINUTES = 15;

/**
 * LS1-R1 — age-banded session caps replace the flat 15-min cap:
 * target/hard-cap = 8/10 min (band A, 4–6), 12/15 (band B, 6–9),
 * 15/20 (band C, 9–12). The hard cap is un-extendable by any setting
 * (P1/E45: "more isn't better here — consistency is").
 */
export const BAND_SESSION_CAPS: Record<'A' | 'B' | 'C', { target: number; hard: number }> = {
  A: { target: 8, hard: 10 },
  B: { target: 12, hard: 15 },
  C: { target: 15, hard: 20 },
};

/**
 * LS1-R2 — adaptive stop rule (v1 heuristic): two distinct fatigue signals in
 * one session → warm early end; the concept resurfaces tomorrow (the day
 * stays partial). Signals: rolling first-attempt accuracy < 0.6 over the last
 * 5 items; ≥2 rapid guesses (<2s, wrong); hint ladder ridden to rung 3 on
 * ≥2 consecutive items.
 */
export const FATIGUE_ROLLING_WINDOW = 5;
export const FATIGUE_ACCURACY_FLOOR = 0.6;
export const FATIGUE_RAPID_GUESS_MS = 2000;
export const FATIGUE_RAPID_GUESS_COUNT = 2;
export const FATIGUE_DEEP_HINT_STREAK = 2;
/** Spaced-retrieval share of daily items (DD8 [DIVERGENCE]; QG-2). */
export const RETRIEVAL_SHARE_MIN = 0.2;
export const RETRIEVAL_SHARE_MAX = 0.3;
/** Expanding retrieval intervals for mastered concepts (DD8), in days. */
export const RETRIEVAL_INTERVALS_DAYS: readonly number[] = [7, 30, 90];

// ---------------------------------------------------------------------------
// Fluency sprints (DD11: ungraded, self-referenced, Level B+ only)
// ---------------------------------------------------------------------------

export const SPRINT_DURATION_SECONDS = 120;
export const SPRINTS_PER_WEEK_MAX = 2;
/** Sprint source skill must have been mastered at least this many weeks prior. */
export const SPRINT_SOURCE_MIN_WEEKS_PRIOR = 2;

// ---------------------------------------------------------------------------
// Placement (DD5)
// ---------------------------------------------------------------------------

/** ≥80% on a cluster steps up. */
export const PLACEMENT_STEP_UP_THRESHOLD = 0.8;
/** <50% on a cluster steps down. */
export const PLACEMENT_STEP_DOWN_THRESHOLD = 0.5;
export const PLACEMENT_ITEMS_PER_CLUSTER_MIN = 4;
export const PLACEMENT_ITEMS_PER_CLUSTER_MAX = 6;
/** Honest placement duration ceiling, minutes (DD5). */
export const PLACEMENT_MAX_MINUTES = 30;

// ---------------------------------------------------------------------------
// Monthly / level-exit tests (DD9)
// ---------------------------------------------------------------------------

/** Monthly test every N completed weeks. */
export const TEST_CADENCE_WEEKS = 4;
/** Level-exit test gate (same DD1 threshold; parallel-form retake). */
export const LEVEL_EXIT_THRESHOLD_PCT = 85;
