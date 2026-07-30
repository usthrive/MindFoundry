/**
 * Phase 7 persona harness — fixture data + scenario builders.
 *
 * HONESTY LAW (task rule): every fixture must describe a state the real app
 * could legitimately reach. Nothing here papers over a broken flow:
 *  - pack_seed is fixed and packs are regenerated with the REAL generator
 *    (imported from frontend/src — pure, no aliases), so completedItemIds,
 *    Form-A/B item ids, and parentSummarySeed text are the app's own.
 *  - day_progress entries obey the daily-unlock law in session/weekLogic.ts
 *    (done days completed on PRIOR calendar days so today's tile is live).
 *  - report narratives are assembled from the pack's own parentSummarySeed —
 *    the same source the production RPC uses.
 *  - the mock DB's write guards mirror the live guard trigger + column grant
 *    (see harness.ts) so a client-side bug fails here like it fails live.
 *
 * Fixture inventory (what each builder gives a runner):
 *  - CHILDREN: nora (5, band A), maya (8, band B), jordan (11, band C)
 *  - freshDb(children)                  → signed-in parent, no bb_ rows
 *                                         (placement flow; Flow 1)
 *  - stageMidWeek(db, child, L, W)     → in_week, lesson+days 1..N done on
 *                                         prior days, next day live today
 *  - stageDay5Ready(db, child, L, W)   → days 1–4 done, Day-5 live today
 *  - stageNearMiss(db, child, L, W)    → near_miss_cycle1 (Form A 67%),
 *                                         attempt yesterday → corrective CTA
 *                                         live today; report one_more_round
 *  - stagePassed(db, child, L, W)      → passed yesterday, 92%, report
 *                                         written and UNacknowledged
 *  - seedMissTelemetry(db, child, pack)→ honest bb_item_attempts rows incl.
 *                                         one parked (treasure-chest) item
 *
 * Level×week cells with real content (increment-2 coverage): A1 A2 B1 B2 C1
 * C2 (seeded templates) + A15 B14 D17 (spec fixtures). Any other cell shows
 * the app's calm "coming soon" note — do not stage scenarios there unless
 * that note is itself under test.
 */

import {
  generatePack,
  CONTENT_VERSION,
} from '../../../../frontend/src/modules/best-brains/generator/packGenerator';
import type {
  BBLevel,
  WeeklyConceptPack,
  ErrorTag,
} from '../../../../frontend/src/modules/best-brains/types';

// ---------------------------------------------------------------------------
// Identities
// ---------------------------------------------------------------------------

export const PARENT_USER_ID = '00000000-0000-4000-8000-0000000000ff';
export const PARENT_EMAIL = 'phase7.parent@mindfoundry.test';

export interface FixtureChild {
  id: string;
  name: string;
  age: number;
  grade_level: number;
  avatar: string;
}

/** The three Phase-7 student personas (STUDENT-SIMULATORS.md). */
export const CHILDREN: Record<'nora' | 'maya' | 'jordan', FixtureChild> = {
  nora: { id: '00000000-0000-4000-8000-00000000000a', name: 'Nora', age: 5, grade_level: 0, avatar: '🐥' },
  maya: { id: '00000000-0000-4000-8000-00000000000b', name: 'Maya', age: 8, grade_level: 2, avatar: '🦊' },
  jordan: { id: '00000000-0000-4000-8000-00000000000c', name: 'Jordan', age: 11, grade_level: 5, avatar: '🦉' },
};

/** Deterministic pack seed — same packs on every run, screenshots comparable. */
export const FIXED_PACK_SEED = 424242;

// ---------------------------------------------------------------------------
// Mock DB shape (snake_case rows, as PostgREST would return them)
// ---------------------------------------------------------------------------

export interface MockDb {
  user: Record<string, unknown>;
  children: Record<string, unknown>[];
  bb_enrollment: Record<string, unknown>[];
  bb_week_state: Record<string, unknown>[];
  bb_item_attempts: Record<string, unknown>[];
  bb_parent_reports: Record<string, unknown>[];
}

function childRow(c: FixtureChild): Record<string, unknown> {
  return {
    id: c.id,
    user_id: PARENT_USER_ID,
    name: c.name,
    age: c.age,
    grade_level: c.grade_level,
    avatar: c.avatar,
    current_level: '7A', // Kumon-side field; untouched by the Foundry module
    current_worksheet: 1,
    questions_per_page_mode: 'standard',
    supplementary_practice: null,
    regroup_helper_mode: 'adaptive',
    tier: 'premium',
    streak: 0,
    total_problems: 0,
    total_correct: 0,
    created_at: '2026-07-01T09:00:00.000Z',
    updated_at: '2026-07-01T09:00:00.000Z',
  };
}

/** Signed-in parent + chosen children; NO bb_ rows (pre-placement state). */
export function freshDb(children: FixtureChild[]): MockDb {
  return {
    user: {
      id: PARENT_USER_ID,
      email: PARENT_EMAIL,
      full_name: 'Phase Seven Parent',
      user_type: 'parent',
      tier: 'premium',
      stripe_customer_id: null,
      subscription_status: 'active',
      subscription_ends_at: null,
      created_at: '2026-06-01T09:00:00.000Z',
      updated_at: '2026-06-01T09:00:00.000Z',
    },
    children: children.map(childRow),
    bb_enrollment: [],
    bb_week_state: [],
    bb_item_attempts: [],
    bb_parent_reports: [],
  };
}

// ---------------------------------------------------------------------------
// Time helpers — done days must sit on PRIOR calendar days (daily-unlock law)
// ---------------------------------------------------------------------------

function daysAgoAt(days: number, hour = 16): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 12, 0, 0);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Pack access (the app's own generator — determinism is the honesty anchor)
// ---------------------------------------------------------------------------

export function packFor(level: BBLevel, week: number, seed = FIXED_PACK_SEED): WeeklyConceptPack {
  return generatePack(level, week, seed, CONTENT_VERSION);
}

function dayItemIds(pack: WeeklyConceptPack, day: number): string[] {
  return pack.days[day - 1].items.map((i) => i.id);
}

// ---------------------------------------------------------------------------
// Enrollment
// ---------------------------------------------------------------------------

export interface EnrollOptions {
  /** Placement strengths shown on StartingPoint/PlacementStory. */
  strengths?: string[];
  sprintOptOut?: boolean;
  sessionLength?: 'short' | 'standard' | 'full';
  placedDaysAgo?: number;
}

export function enrollChild(
  db: MockDb,
  child: FixtureChild,
  level: BBLevel,
  currentWeek: number,
  opts: EnrollOptions = {},
): void {
  const placedAt = daysAgoAt(opts.placedDaysAgo ?? 7, 10);
  db.bb_enrollment = db.bb_enrollment.filter((r) => r.child_id !== child.id);
  db.bb_enrollment.push({
    child_id: child.id,
    level,
    placed_at: placedAt,
    placement_result: {
      placedLevel: level,
      entryWeek: 1,
      clusterResults: [
        { clusterId: `${level}-exit-1`, level, itemsServed: 5, itemsCorrect: 4, accuracy: 0.8, decision: 'hold' },
        { clusterId: `${level}-exit-2`, level, itemsServed: 5, itemsCorrect: 3, accuracy: 0.6, decision: 'hold' },
      ],
      strengths: opts.strengths ?? ['Counting and comparing', 'Number patterns'],
      completedAt: placedAt,
      isRecheck: false,
    },
    current_week: currentWeek,
    settings: {
      sprintOptOut: opts.sprintOptOut ?? false,
      sessionLength: opts.sessionLength ?? 'standard',
    },
    created_at: placedAt,
    updated_at: placedAt,
  });
}

// ---------------------------------------------------------------------------
// Week-state stages
// ---------------------------------------------------------------------------

function baseWeekRow(child: FixtureChild, level: BBLevel, week: number): Record<string, unknown> {
  return {
    child_id: child.id,
    level,
    week,
    pack_seed: FIXED_PACK_SEED,
    content_version: CONTENT_VERSION,
    state: 'not_started',
    day_progress: {},
    mastery: { attempts: [] },
    started_at: null,
    completed_at: null,
    created_at: daysAgoAt(6, 9),
    updated_at: daysAgoAt(0, 9),
  };
}

function putWeekRow(db: MockDb, row: Record<string, unknown>): void {
  db.bb_week_state = db.bb_week_state.filter(
    (r) => !(r.child_id === row.child_id && r.level === row.level && r.week === row.week),
  );
  db.bb_week_state.push(row);
}

/**
 * Mid-week: lesson + days 1..daysDone completed on prior calendar days, so
 * day (daysDone+1) is the live tile TODAY. daysDone must be 1..3.
 */
export function stageMidWeek(
  db: MockDb,
  child: FixtureChild,
  level: BBLevel,
  week: number,
  daysDone = 2,
): void {
  enrollChild(db, child, level, week);
  const pack = packFor(level, week);
  const row = baseWeekRow(child, level, week);
  const dp: Record<string, unknown> = {
    lesson: { state: 'done', completedAt: daysAgoAt(daysDone + 1) },
  };
  for (let d = 1; d <= daysDone; d++) {
    dp[String(d)] = {
      state: 'done',
      completedItemIds: dayItemIds(pack, d),
      minutesSpent: 9,
      completedAt: daysAgoAt(daysDone + 1 - d),
      accuracyPct: d === 1 ? 100 : 83, // honest, above the 75% stability floor
    };
  }
  row.state = 'in_week';
  row.started_at = daysAgoAt(daysDone + 1, 9);
  row.day_progress = dp;
  putWeekRow(db, row);
}

/** Days 1–4 done on prior days; Day 5 (puzzle + weekly check) live today. */
export function stageDay5Ready(db: MockDb, child: FixtureChild, level: BBLevel, week: number): void {
  enrollChild(db, child, level, week);
  const pack = packFor(level, week);
  const row = baseWeekRow(child, level, week);
  const dp: Record<string, unknown> = {
    lesson: { state: 'done', completedAt: daysAgoAt(5) },
  };
  for (let d = 1; d <= 4; d++) {
    dp[String(d)] = {
      state: 'done',
      completedItemIds: dayItemIds(pack, d),
      minutesSpent: 10,
      completedAt: daysAgoAt(5 - d),
      accuracyPct: [100, 83, 100, 80][d - 1],
    };
  }
  row.state = 'in_week';
  row.started_at = daysAgoAt(5, 9);
  row.day_progress = dp;
  putWeekRow(db, row);
}

/** Dominant tags used by the near-miss stage (match the misses it seeds). */
export const NEAR_MISS_TAGS: ErrorTag[] = ['concept-misconception', 'procedure-slip'];

/**
 * Near-miss: Form A taken YESTERDAY at 67% → near_miss_cycle1; the "one more
 * round" CTA is live today (the hub gates it to the next day). Report row
 * verdict one_more_round, unacknowledged. Narrative comes from the pack's own
 * parentSummarySeed, strengthening selected by dominant tag — same recipe as
 * the production RPC.
 */
export function stageNearMiss(db: MockDb, child: FixtureChild, level: BBLevel, week: number): void {
  enrollChild(db, child, level, week);
  const pack = packFor(level, week);
  const row = baseWeekRow(child, level, week);
  const dp: Record<string, unknown> = {
    lesson: { state: 'done', completedAt: daysAgoAt(6) },
  };
  for (let d = 1; d <= 5; d++) {
    dp[String(d)] = {
      state: 'done',
      completedItemIds: dayItemIds(pack, d),
      minutesSpent: 10,
      completedAt: daysAgoAt(6 - d),
      accuracyPct: d <= 4 ? [100, 83, 80, 83][d - 1] : undefined,
    };
  }
  row.state = 'near_miss_cycle1';
  row.started_at = daysAgoAt(6, 9);
  row.day_progress = dp;
  row.mastery = {
    attempts: [
      {
        form: 'A',
        cycle: 0,
        scorePct: 67,
        attemptedAt: daysAgoAt(1, 17),
        dominantErrorTags: NEAR_MISS_TAGS,
      },
    ],
  };
  putWeekRow(db, row);
  putReport(db, child, pack, 'one_more_round', 67, false, daysAgoAt(1, 17));
}

/** Passed yesterday at 92%; report written, UNacknowledged (the ritual is live). */
export function stagePassed(db: MockDb, child: FixtureChild, level: BBLevel, week: number): void {
  enrollChild(db, child, level, week);
  const pack = packFor(level, week);
  const row = baseWeekRow(child, level, week);
  const dp: Record<string, unknown> = {
    lesson: { state: 'done', completedAt: daysAgoAt(6) },
  };
  for (let d = 1; d <= 5; d++) {
    dp[String(d)] = {
      state: 'done',
      completedItemIds: dayItemIds(pack, d),
      minutesSpent: 9,
      completedAt: daysAgoAt(6 - d),
      accuracyPct: d <= 4 ? [100, 100, 83, 100][d - 1] : undefined,
    };
  }
  row.state = 'passed';
  row.started_at = daysAgoAt(6, 9);
  row.completed_at = daysAgoAt(1, 17);
  row.day_progress = dp;
  row.mastery = {
    attempts: [{ form: 'A', cycle: 0, scorePct: 92, attemptedAt: daysAgoAt(1, 17) }],
    finalScorePct: 92,
  };
  putWeekRow(db, row);
  putReport(db, child, pack, 'passed', 92, false, daysAgoAt(1, 17));
}

// ---------------------------------------------------------------------------
// Reports — assembled from the pack's own parentSummarySeed (RPC recipe)
// ---------------------------------------------------------------------------

function putReport(
  db: MockDb,
  child: FixtureChild,
  pack: WeeklyConceptPack,
  verdict: 'passed' | 'one_more_round' | 'escalated',
  percent: number,
  acknowledged: boolean,
  createdAt: string,
): void {
  const seed = pack.parentSummarySeed;
  const dominant = NEAR_MISS_TAGS[0];
  const strengthening =
    verdict === 'passed'
      ? seed.strengtheningByTag[0]?.text ?? ''
      : seed.strengtheningByTag.find((s) => s.errorTag === dominant)?.text ??
        seed.strengtheningByTag[0]?.text ??
        '';
  db.bb_parent_reports = db.bb_parent_reports.filter(
    (r) => !(r.child_id === child.id && r.level === pack.identity.level && r.week === pack.identity.week),
  );
  db.bb_parent_reports.push({
    child_id: child.id,
    level: pack.identity.level,
    week: pack.identity.week,
    narrative: {
      whatWeWorkedOn: seed.whatWeWorkedOn,
      improving: seed.improvingCandidates[0] ?? '',
      strengthening,
      homeFocus: seed.homeFocus,
      teacherNarrative:
        verdict === 'passed'
          ? `${child.name} settled into the weekly rhythm and closed the week with the concept owned.`
          : `${child.name} worked steadily all week; one step needs one more round, and the plan for it is already set.`,
    },
    verdict,
    percent,
    acknowledged_at: acknowledged ? daysAgoAt(0, 8) : null,
    created_at: createdAt,
    updated_at: createdAt,
  });
}

// ---------------------------------------------------------------------------
// Telemetry seeding (PatternsView / TreasureChest honesty)
// ---------------------------------------------------------------------------

let attemptSeq = 0;

function attemptRow(
  child: FixtureChild,
  packId: string,
  itemId: string,
  correct: boolean,
  opts: { day?: number | null; tag?: ErrorTag; hint?: number; attemptNo?: number; at?: string } = {},
): Record<string, unknown> {
  attemptSeq += 1;
  return {
    id: `p7-attempt-${attemptSeq}`,
    child_id: child.id,
    pack_id: packId,
    item_id: itemId,
    answer: correct ? 'fixture-correct' : 'fixture-miss',
    correct,
    hint_rungs_used: opts.hint ?? 0,
    attempt_no: opts.attemptNo ?? 1,
    day: opts.day === undefined ? 1 : opts.day,
    error_tag: opts.tag ?? null,
    created_at: opts.at ?? daysAgoAt(1),
  };
}

/**
 * Seed honest miss telemetry for a staged week:
 *  - one PARKED item (2 misses, latest still a miss) on the most recent done
 *    day → TreasureChest badge shows 1;
 *  - a resolved miss and clean rows → PatternsView shows a genuine mix.
 * Call AFTER a stage*() builder for the same (child, level, week).
 */
export function seedMissTelemetry(db: MockDb, child: FixtureChild, level: BBLevel, week: number): void {
  const pack = packFor(level, week);
  const d2 = dayItemIds(pack, 2);
  const parked = d2[d2.length - 1];
  const resolved = d2[0];
  db.bb_item_attempts.push(
    // parked: two misses, still unresolved
    attemptRow(child, pack.packId, parked, false, { day: 2, tag: 'concept-misconception', hint: 1, at: daysAgoAt(1, 15) }),
    attemptRow(child, pack.packId, parked, false, { day: 2, tag: 'concept-misconception', hint: 2, attemptNo: 2, at: daysAgoAt(1, 15) }),
    // resolved miss (miss → correct)
    attemptRow(child, pack.packId, resolved, false, { day: 2, tag: 'procedure-slip', hint: 1, at: daysAgoAt(1, 15) }),
    attemptRow(child, pack.packId, resolved, true, { day: 2, attemptNo: 2, at: daysAgoAt(1, 15) }),
    // clean rows
    attemptRow(child, pack.packId, d2[1], true, { day: 2, at: daysAgoAt(1, 15) }),
  );
}

// ---------------------------------------------------------------------------
// Ready-made scenarios (one per runner need; compose freely)
// ---------------------------------------------------------------------------

/** All three children pre-placement (placement runs). */
export function scenarioPlacement(): MockDb {
  return freshDb([CHILDREN.nora, CHILDREN.maya, CHILDREN.jordan]);
}

/** Nora (band A): Level A week 1 mid-week (day 2 live today, day 1 done). */
export function scenarioNoraMidWeek(): MockDb {
  const db = freshDb([CHILDREN.nora]);
  stageMidWeek(db, CHILDREN.nora, 'A', 1, 1);
  return db;
}

/** Maya (band B): Level B week 1 mid-week (day 3 live), with miss telemetry. */
export function scenarioMayaMidWeek(): MockDb {
  const db = freshDb([CHILDREN.maya]);
  stageMidWeek(db, CHILDREN.maya, 'B', 1, 2);
  seedMissTelemetry(db, CHILDREN.maya, 'B', 1);
  return db;
}

/** Maya: Day-5 ready (puzzle + weekly check today). */
export function scenarioMayaDay5(): MockDb {
  const db = freshDb([CHILDREN.maya]);
  stageDay5Ready(db, CHILDREN.maya, 'B', 1);
  return db;
}

/** Maya: near-miss corrective loop entry (reteach → Form B playable today). */
export function scenarioMayaNearMiss(): MockDb {
  const db = freshDb([CHILDREN.maya]);
  stageNearMiss(db, CHILDREN.maya, 'B', 1);
  seedMissTelemetry(db, CHILDREN.maya, 'B', 1);
  return db;
}

/**
 * Jordan (band C): Level D week 17 (spec fixture cell — the only authored
 * C-band interaction cell; levels D/E map to interaction band C). Mid-week
 * with day 3 live → the D17 sprint (scheduledDay 3) is offerable today.
 * NOTE: placement can only walk A→C (entry-week content), so a D-level
 * enrollment is fixture-only — flag it as such in findings if it behaves
 * differently from placed enrollments.
 */
export function scenarioJordanMidWeek(): MockDb {
  const db = freshDb([CHILDREN.jordan]);
  stageMidWeek(db, CHILDREN.jordan, 'D', 17, 2);
  return db;
}

/** Jordan: Day-5 ready at D17 (error-analysis Puzzle Grove + check). */
export function scenarioJordanDay5(): MockDb {
  const db = freshDb([CHILDREN.jordan]);
  stageDay5Ready(db, CHILDREN.jordan, 'D', 17);
  return db;
}

/** Parent surface: three children — passed+unacknowledged, near-miss, mid-week. */
export function scenarioParent(): MockDb {
  const db = freshDb([CHILDREN.nora, CHILDREN.maya, CHILDREN.jordan]);
  stagePassed(db, CHILDREN.maya, 'B', 1);
  stageNearMiss(db, CHILDREN.jordan, 'D', 17);
  stageMidWeek(db, CHILDREN.nora, 'A', 1, 1);
  seedMissTelemetry(db, CHILDREN.maya, 'B', 1);
  return db;
}
