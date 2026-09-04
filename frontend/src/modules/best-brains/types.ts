/**
 * Best Brains-inspired module ("Foundry Method") — domain types.
 *
 * Part 1 mirrors the WeeklyConceptPack JSON schema (QUESTION-GENERATOR-SPEC.md §2,
 * draft-07, schemaVersion "1.0") EXACTLY — field names, enums, optionality and
 * nullability match the schema. Constraints TypeScript cannot express (regex
 * patterns, min/max counts, conditional requirements) are noted in comments and
 * enforced by the pack validator / quality gates (QG-1..QG-10), not the type system.
 *
 * Part 2 defines the DD1 mastery state machine, placement, and progress-view types
 * per METHODOLOGY-MODEL.md §5 and SCREEN-SPECS.md data sources.
 */

// ===========================================================================
// Part 1 — WeeklyConceptPack (mirror of the JSON schema)
// ===========================================================================

import type { BBFigure } from './figures/types';

export type { BBFigure } from './figures/types';

/** Neutral level codes (DD2). Distinct from KumonLevel — never mix the ladders. */
export type BBLevel = 'A' | 'B' | 'C' | 'D' | 'E';

/** Week index within a level: 1–24. */
export type BBWeek = number;

/** Presentation band (identity.band). */
export type BBBand = 'beginner' | 'intermediate' | 'transition' | 'advanced';

/** Strand labels (identity.strandTags items, per E25). */
export type StrandTag =
  | 'number-sense-counting'
  | 'addition-subtraction'
  | 'multiplication-division'
  | 'decimals-fractions'
  | 'probability-statistics'
  | 'algebra-geometry';

/** Reference to a Level × Week cell of the curriculum graph. */
export interface WeekRef {
  level: BBLevel;
  /** 1–24 */
  week: BBWeek;
}

/** Closed DD7 error taxonomy. Extensions go in `subtype`, never new tags. */
export type ErrorTag =
  | 'fact-recall'
  | 'procedure-slip'
  | 'concept-misconception'
  | 'representation-misread'
  | 'task-comprehension';

/**
 * 1–3 rungs: (1) orienting question, (2) locate the step/model, (3) worked SIMILAR
 * example. Never contains the item's literal answer (QG-5).
 */
export type HintLadder = string[];

export type AnswerValidation =
  | 'exact-numeric'
  | 'equivalent-numeric'
  | 'equivalent-fraction'
  | 'number-sentence'
  | 'choice-key'
  | 'short-text-keyword'
  | 'ordered-list'
  | 'set'
  | 'manual-review';

export interface AnswerSpec {
  /** Canonical answer as string (uniform for numbers, fractions, text). */
  value: string;
  /** Additional accepted surface forms (equivalents, commuted sentences, spelled-out numbers). */
  acceptableForms: string[];
  validation: AnswerValidation;
  /** Required unit, if any; missing/wrong unit is treated as a procedure-slip prompt (§3.4). */
  units?: string;
  /** default false */
  requireSimplestForm?: boolean;
  /** default false; for number-sentence: reject commuted forms when order is the taught point. */
  orderMatters?: boolean;
}

export interface Choice {
  /** Single letter A–F. */
  key: string;
  text: string;
  isCorrect: boolean;
  /** REQUIRED on distractors by QG-3 (schema cannot express conditionally). */
  errorTag?: ErrorTag;
  rationale?: string;
}

/** Seeded template instantiation for reproducible regeneration (§3.1). */
export interface GeneratorSpec {
  templateId: string;
  params: Record<string, unknown>;
  /** Non-negative integer. Same (templateId, params, seed) → byte-identical item. */
  seed: number;
}

export type ItemType =
  | 'computation'
  | 'word-problem'
  | 'representation'
  | 'reasoning'
  | 'error-analysis'
  | 'classification'
  | 'drawing'
  | 'fluency';

export type ItemStrand = 'computational' | 'noncomputational';

export interface PackItem {
  /** Pattern: <Level><Week>-<slot>-<nn>, e.g. "B14-D3-06" (slots D1–D5, GE, PZ, FS, MA, MB). */
  id: string;
  type: ItemType;
  /** May embed asset placeholders like [image: 3 red apples, 2 green apples]. */
  prompt: string;
  /** 2–6 choices when the item is multiple-choice. */
  choices?: Choice[];
  answer: AnswerSpec;
  /** 1–5, band-relative (§3.3). */
  difficulty: number;
  strand: ItemStrand;
  /** Spaced-retrieval warm-up slot (DD8 [DIVERGENCE]); styled as "warm-up", never "review". */
  isRetrieval: boolean;
  /** REQUIRED when isRetrieval=true (schema if/then); strictly earlier week (QG-2). */
  retrievalSource?: WeekRef;
  hintLadder: HintLadder;
  /** 1–3 unique tags from the closed DD7 enum. */
  errorTags: ErrorTag[];
  generator?: GeneratorSpec;
  /**
   * The item's picture, drawn from the item's OWN computed values so it cannot
   * contradict its answer (QG-13 re-derives what the picture asserts, exactly as
   * QG-5 re-derives the answer). Presentation only — never load-bearing for
   * identity; the authored `[image: …]` direction stays in `prompt`.
   */
  figure?: BBFigure;
}

// --- Teacher explanation -----------------------------------------------------

export interface ExplanationSegment {
  say: string;
  /**
   * Asset/manipulative direction; visual-first per E60. When `figure` is set
   * this is the picture's caption/accessible name rather than a stage direction
   * to an artist — until B1.0 it was the ONLY thing here, and it rendered as
   * italic prose in a dashed box (LEARNINGS L27).
   */
  visual?: string;
  /** The drawn picture for this segment of the lesson. */
  figure?: BBFigure;
}

export interface VocabularyEntry {
  term: string;
  kidGloss: string;
}

export interface Explanation {
  /** Opening story/wonder moment (DD4 session script). */
  hook: string;
  /** The concept's WHY, stated before any procedure (E5). */
  whyBeforeHow: string;
  /**
   * THE PICTURE THAT SHOWS THE WHY IN ACTION.
   *
   * `LessonRoom` speaks four surfaces to the child — hook, whyBeforeHow, the
   * script segments, then summary — but only `script` segments could carry a
   * figure, so the longest and most abstract minute of every lesson was the one
   * with nothing to look at. Measured 2026-08-31 across 117 served weeks: the
   * why-segment averages 137 words (about a minute of speech) and 450 of 472
   * script segments have a picture while all 117 why-segments had none.
   *
   * Owner ruling, same day: the length is right and stays — the why is the
   * point of the lesson — PROVIDED it is shown in action rather than only said.
   * Hence a figure of its own rather than a shorter argument. It animates on
   * the way in like any other lesson figure, so "ten ones become one ten" is
   * something the child watches happen.
   *
   * Optional: a week without one keeps the old behaviour exactly.
   */
  whyFigure?: BBFigure;
  /** 2–6 segments. */
  script: ExplanationSegment[];
  summary: string;
  /** 1–6 entries. */
  vocabulary: VocabularyEntry[];
}

// --- Guided examples ---------------------------------------------------------

export type FadeLevel = 'modeled' | 'completion' | 'prompted' | 'independent';

export interface GuidedExampleStep {
  /** At least one of teacherSay / childDo is required (schema anyOf). */
  teacherSay?: string;
  childDo?: string;
  expected?: string;
  /** Picture for THIS step — how a teacher builds the model as they narrate. */
  figure?: BBFigure;
}

export interface GuidedExample {
  id: string;
  fadeLevel: FadeLevel;
  prompt: string;
  /** 1–8 steps. */
  steps: GuidedExampleStep[];
  answer: string;
  /**
   * The example's picture caption / accessible name. Before B1.0 the schema had
   * no visual slot at all (0/96 guided examples carried one) — the worst gap in
   * the corpus, since a worked example is exactly where a teacher draws.
   */
  visual?: string;
  /** The drawn picture pinned beside the worked example. */
  figure?: BBFigure;
}

// --- Days --------------------------------------------------------------------

export type DayFocus =
  | 'concept-echo'
  | 'fluency-application'
  | 'word-problems'
  | 'noncomputational';

export interface PackDay {
  /** 1–5; array index i = Day i+1. */
  day: number;
  /** DD3 template order enforced by QG-8, not schema. */
  focus: DayFocus;
  /** 1–3 pages. */
  pageCount: number;
  /** 3–8 items. */
  items: PackItem[];
  /** Parent-facing pedagogy strip; beginner band Day 5 only (E57). */
  teacherNoteStrip?: string;
}

// --- Puzzle ------------------------------------------------------------------

export type PuzzleType =
  | 'logic'
  | 'pattern'
  | 'math-art'
  | 'game'
  | 'estimation'
  | 'construction'
  | 'error-analysis';

/** Weekly non-computational transfer of the SAME concept (strand-coupling law, DD12/E26). */
export interface Puzzle {
  id: string;
  /** Presented under the module's own "Puzzle Grove" mark [original design]. */
  title: string;
  puzzleType: PuzzleType;
  prompt: string;
  answer: AnswerSpec;
  hintLadder: HintLadder;
  errorTags?: ErrorTag[];
  /** The puzzle's picture (grids, paths, nets), same law as PackItem.figure. */
  figure?: BBFigure;
}

// --- Fluency sprint ----------------------------------------------------------

/** null for Level A (sprints begin at Level B, per DD11). */
export interface FluencySprint {
  id: string;
  skill: string;
  /** Must be mastered ≥2 weeks prior; never the current concept (DD11). */
  sourceWeek: WeekRef;
  /** const 120 */
  durationSeconds: 120;
  /** 10–30 */
  itemCount: number;
  /** 2 or 3 */
  scheduledDay: number;
  /** const true */
  selfReferenced: true;
  /** const false */
  graded: false;
  generator: GeneratorSpec;
}

// --- Mastery check -----------------------------------------------------------

export interface MasteryCheck {
  /** DD1 band 80–90; default 85. [DIVERGENCE vs evidenced ~45–62% bracket, E31/E98] */
  passThresholdPct: number;
  /** const 95 */
  fastTrackPct: 95;
  /** 6–10 items; lives on Day 5. */
  formA: PackItem[];
  /** 6–10 items; parallel isomorphs, index-paired with formA; corrective loop only. */
  formB: PackItem[];
  /** Per-index isomorph class + parameter constraints. */
  isomorphNotes: string;
}

// --- Mistake bank ------------------------------------------------------------

export interface MistakeBankEntry {
  errorTag: ErrorTag;
  /** Optional finer label [original design extension of DD7]. */
  subtype?: string;
  description: string;
  exampleWrongAnswer: string;
  /** How to build an MC distractor that traps exactly this error. */
  distractorRationale: string;
  /** Which explanation segment / guided example the DD1 micro-reteach replays. */
  reteachPointer: string;
}

// --- Parent summary seed (E102 4-field frame) --------------------------------

export interface StrengtheningByTagEntry {
  errorTag: ErrorTag;
  text: string;
}

export interface HomeFocus {
  praiseLine: string;
  questionForChild: string;
  /** Optional, ≤1/month (per E103). */
  schoolSyncHook?: string;
}

export interface ParentSummarySeed {
  /** Parent-plain concept description; opens the weekly report (E102 field 1). */
  whatWeWorkedOn: string;
  /** ≥2 evidence-slots the report generator fills from telemetry (E102 field 3 / E48). */
  improvingCandidates: string[];
  /** ≥2 growth-area texts per dominant DD7 tag (E102 field 2). */
  strengtheningByTag: StrengtheningByTagEntry[];
  /** E102 field 4, realized as conversation-not-grading (E71). */
  homeFocus: HomeFocus;
  vocabularyForParent: string[];
}

// --- Identity + presentation -------------------------------------------------

export interface PackIdentity {
  level: BBLevel;
  /** 1–24 */
  week: BBWeek;
  /** kebab-case, e.g. "addition-within-10". */
  conceptId: string;
  /** ≤80 chars. */
  conceptName: string;
  band: BBBand;
  /** 1–3 unique strand labels (E25). */
  strandTags: StrandTag[];
  /** Feeds the curriculum graph (METHODOLOGY-MODEL §8). */
  prerequisiteWeeks: WeekRef[];
}

export interface PackPresentation {
  /** Required true for Level A. */
  audioFirst?: boolean;
  /** Early Level A format, per E62. */
  oneOperationPerPage?: boolean;
  /** Band scaffold conventions in play (e.g. labeled place-value columns per E53). */
  scaffoldNotes?: string;
}

// --- The pack ----------------------------------------------------------------

/**
 * One WeeklyConceptPack = the complete authored content for one Level × Week cell.
 * Packs are IMMUTABLE once assigned (QG-10) and are NOT stored server-side:
 * they regenerate deterministically from (level, week, pack_seed, contentVersion).
 */
export interface WeeklyConceptPack {
  schemaVersion: '1.0';
  /** Pattern: MFM-<Level><Week>, e.g. "MFM-B14". Original code scheme. */
  packId: string;
  /** Semver; any content change bumps this (versioned content pointers, DD15 vs E87). */
  contentVersion: string;
  identity: PackIdentity;
  presentation?: PackPresentation;
  explanation: Explanation;
  /** 3–5, ordered by fade (modeled first); pinned to the packet front all week (E99). */
  guidedExamples: GuidedExample[];
  /** Exactly 5 entries; index i = Day i+1. */
  days: PackDay[];
  puzzle: Puzzle;
  /** null for Level A. */
  fluencySprint: FluencySprint | null;
  masteryCheck: MasteryCheck;
  /** 3–10 entries. */
  mistakeBank: MistakeBankEntry[];
  parentSummarySeed: ParentSummarySeed;
}

// ===========================================================================
// Part 2 — DD1 mastery state machine (METHODOLOGY-MODEL §5)
// ===========================================================================

/**
 * The ONLY mastery state space (SCREEN-SPECS global law). Transitions live in
 * constants.ts (WEEK_STATE_TRANSITIONS); the platform computes them — the teacher
 * persona can never alter a score or a state.
 *
 *  not_started       — week not yet begun
 *  in_week           — Days 1–5 in progress
 *  mastery_check     — Form A being taken / awaiting score
 *  passed            — gate cleared (≥ passThresholdPct)
 *  near_miss_cycle1  — Form A < threshold; corrective cycle 1 (micro-reteach → Form B)
 *  cycle2            — cycle-1 Form B < threshold; corrective cycle 2 (new angle)
 *  escalated         — cycle-2 Form B < threshold; live teacher + placement re-check
 *  fast_track        — cycle-1 Form B ≥ 95%; passed with fast-track credit
 */
export type WeekMasteryState =
  | 'not_started'
  | 'in_week'
  | 'mastery_check'
  | 'passed'
  | 'near_miss_cycle1'
  | 'cycle2'
  | 'escalated'
  | 'fast_track';

export type MasteryForm = 'A' | 'B';

/** One scored mastery-check attempt (Form A once, Form B once per corrective cycle). */
export interface MasteryAttempt {
  form: MasteryForm;
  /** 0 for Form A; 1 or 2 for corrective-cycle Form B servings. */
  cycle: number;
  /** 0–100, objective items only. */
  scorePct: number;
  attemptedAt: string; // ISO timestamp
  /** Dominant DD7 tags among misses — selects the micro-reteach content. */
  dominantErrorTags?: ErrorTag[];
}

/** Mirror of bb_week_state.mastery JSONB. */
export interface WeekMasteryRecord {
  attempts: MasteryAttempt[];
  /** Present once the week resolves. */
  finalScorePct?: number;
  /** Set when state = escalated. */
  escalatedAt?: string;
  placementRecheckRequested?: boolean;
}

/** Day-tile progress, mirror of bb_week_state.day_progress JSONB (keys "1".."5"). */
export type DayTileState = 'locked' | 'today' | 'partial' | 'done';

export interface DayProgressEntry {
  state: DayTileState;
  /** Item ids completed so far (resume-at-item support). */
  completedItemIds?: string[];
  minutesSpent?: number;
  completedAt?: string;
  /**
   * First-attempt accuracy for the day's graded items, 0–100 (LS1-R5: the
   * mastery stability rule reads this; the scoring RPC falls back to deriving
   * it from bb_item_attempts for legacy rows). Never child-visible (P6).
   */
  accuracyPct?: number;
}

export type DayProgress = Record<string, DayProgressEntry>;

/** One row of bb_week_state, camel-cased for app use. */
export interface WeekState {
  childId: string;
  /**
   * The last lesson segment the child reached, or null when the lesson has not
   * been started (or has been pinned). Persisted so LessonRoom resumes across a
   * closed tab and across devices; it was sessionStorage, which did neither.
   */
  lessonSegment?: number | null;
  level: BBLevel;
  week: BBWeek;
  /** Deterministic pack regeneration seed — packs are never stored. */
  packSeed: number;
  /** Pinned pack contentVersion for this learner (DD15 versioned pointers). */
  contentVersion?: string;
  state: WeekMasteryState;
  dayProgress: DayProgress;
  mastery: WeekMasteryRecord;
  startedAt?: string;
  completedAt?: string;
}

// ===========================================================================
// Placement (DD5)
// ===========================================================================

export type ClusterDecision = 'step_up' | 'step_down' | 'probe_adjacent' | 'hold';

/** Result of one 4–6-item exit-skill cluster during the placement walk. */
export interface PlacementClusterResult {
  clusterId: string;
  level: BBLevel;
  itemsServed: number;
  itemsCorrect: number;
  /** 0–1 */
  accuracy: number;
  decision: ClusterDecision;
}

/** Mirror of bb_enrollment.placement_result JSONB. */
export interface PlacementResult {
  placedLevel: BBLevel;
  /** Week 1, or mid-level entry when front-block skills are mastered (DD5). */
  entryWeek: BBWeek;
  clusterResults: PlacementClusterResult[];
  /** 2–3 evidenced strengths, named by concept (StartingPoint / PlacementStory). */
  strengths: string[];
  completedAt: string;
  /** True when this run was a DD1-triggered placement re-check. */
  isRecheck: boolean;
  /** A-band safety exit / abandonment ends at the safest lower placement. */
  endedBySafetyExit?: boolean;
}

// ===========================================================================
// Enrollment & settings
// ===========================================================================

export type SessionLengthSetting = 'short' | 'standard' | 'full'; // ≈5 / ≈10 / ≈15 min — hard cap 15

/** Mirror of bb_enrollment.settings JSONB (ParentControls). */
export interface BBEnrollmentSettings {
  /** DD11/P11 — hides SprintGate and the TrendsView fluency panel. */
  sprintOptOut: boolean;
  sessionLength: SessionLengthSetting;
  /** 0–6 (Sunday–Saturday); day the new week reveals. */
  weekRevealDay?: number;
  /** Day/time for the module's single weekly report notification. */
  reportNotificationDay?: number;
  /** Accelerated mode: 2–4 concept-cycles/calendar-week; mastery gates stay intact. */
  acceleratedMode?: boolean;
  /** Decorative persona voice toggle (instruction TTS is never removable — P10). */
  personaVoiceEnabled?: boolean;
  soundEffectsEnabled?: boolean;
}

/** One row of bb_enrollment, camel-cased for app use. */
export interface BBEnrollment {
  childId: string;
  level: BBLevel;
  placedAt?: string;
  placementResult?: PlacementResult;
  currentWeek: BBWeek;
  settings: BBEnrollmentSettings;
}

// ===========================================================================
// Item attempts (telemetry)
// ===========================================================================

/** One row of bb_item_attempts, camel-cased. Append-only telemetry. */
export interface BBItemAttempt {
  childId: string;
  /** e.g. "MFM-A15" */
  packId: string;
  /** e.g. "A15-D3-06" */
  itemId: string;
  answer: string;
  correct: boolean;
  /** 0–3 hint rungs revealed before this attempt. */
  hintRungsUsed: number;
  attemptNo: number;
  /** 1–5; null for Form B / sprint attempts. */
  day: number | null;
  /** DD7 tag logged on a miss, when diagnosable. */
  errorTag?: ErrorTag;
  createdAt: string;
}

// ===========================================================================
// Parent report (DD6 / E102 4-field frame)
// ===========================================================================

/** Parent-facing verdict labels: "Passed" / "One more round" — "Review" is never rendered. */
export type ReportVerdict = 'passed' | 'one_more_round' | 'escalated';

/** Mirror of bb_parent_reports.narrative JSONB — the E102 4-field frame. */
export interface ReportNarrative {
  /** E102 field 1. */
  whatWeWorkedOn: string;
  /** E102 field 3 — improvements noticed, evidence-cited. */
  improving: string;
  /** E102 field 2 — ONE skill + the program's plan. */
  strengthening: string;
  /** E102 field 4 — praise line + teach-it-back question (CoachCorner). */
  homeFocus: HomeFocus;
  /** 1–3 sentence teacher-voice narrative (≤1 behavior sentence). */
  teacherNarrative: string;
}

/** One row of bb_parent_reports, camel-cased. */
export interface BBParentReport {
  childId: string;
  level: BBLevel;
  week: BBWeek;
  narrative: ReportNarrative;
  verdict: ReportVerdict;
  /** Weekly-check % — appears exactly once, parent surface only (P6). */
  percent: number;
  /** Acknowledge-tap timestamp; the sign-off ritual (E15). */
  acknowledgedAt?: string;
  createdAt: string;
}

// ===========================================================================
// Child & parent progress views (SCREEN-SPECS data sources)
// ===========================================================================

/** JourneyMap trail stop — moves and effort, never scores (P4/P5). */
export type TrailStopStatus = 'mastered' | 'strengthening' | 'current' | 'upcoming';

export interface TrailStop {
  week: BBWeek;
  conceptId: string;
  conceptName: string;
  status: TrailStopStatus;
  isCheckpoint: boolean; // week 12
  isLevelExit: boolean; // week 24
}

/** Child-facing progress view (JourneyMap + ThisWeekHub). No %, no grades (P6). */
export interface ChildProgressView {
  level: BBLevel;
  currentWeek: BBWeek;
  trail: TrailStop[];
  /** Passed concepts on the Mastered Shelf. */
  masteredShelf: Array<{ conceptId: string; conceptName: string; week: BBWeek }>;
  /** Effort strip: days practiced this week (effort-framed, never "missed"). */
  daysPracticedThisWeek: number;
  dayTiles: DayProgress;
}

/** MasteryMap cell states — the adult twin of JourneyMap. */
export type MasteryCellState =
  | 'mastered'
  | 'mastered_after_strengthening'
  | 'strengthening_now'
  | 'upcoming';

export interface MasteryMapCell {
  week: BBWeek;
  conceptId: string;
  conceptName: string;
  state: MasteryCellState;
  passedAt?: string;
  correctiveCyclesUsed?: number;
}

/** Parent-facing progress view (ParentHome / TrendsView / MasteryMap). */
export interface ParentProgressView {
  childId: string;
  level: BBLevel;
  currentWeek: BBWeek;
  weekStrip: DayProgress;
  currentConceptName: string;
  reportState: 'in_progress' | 'ready' | 'acknowledged';
  /** Weekly-check first-pass % by week — the only % series anywhere (TrendsView). */
  accuracyByWeek: Array<{ week: BBWeek; firstPassPct: number }>;
  /** Warm-up retrieval accuracy on older material (DD8/DD14 retention curve). */
  retentionByWeek: Array<{ week: BBWeek; retrievalAccuracyPct: number }>;
  masteryMap: MasteryMapCell[];
}
