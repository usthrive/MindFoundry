/**
 * Mind Foundry Module Interface Contract
 * --------------------------------------
 * Declarative registry metadata + typed capability surfaces that every
 * Mind Foundry learning module describes itself with.
 *
 * IMPORTANT: this contract is DESCRIPTIVE, not a runtime plugin system.
 * Existing modules (Kumon-style practice) are described here declaratively;
 * their internals are NOT refactored to conform. New modules (Best Brains /
 * "Foundry Method") are built against this contract from day one.
 *
 * Fields marked optional are aspirational for modules that predate the
 * contract — a module may honestly omit what it does not yet formalize.
 */

/** Stable module identifier. Also used as prefix conventions elsewhere (e.g. `bb_` tables). */
export type ModuleId = 'kumon' | 'best-brains';

export type ModuleStatus = 'live' | 'in-development' | 'paused';

/**
 * One rung of a module's level ladder.
 * The unit of work differs per module (Kumon: worksheet; Best Brains: week).
 */
export interface LevelDescriptor {
  /** Level code as stored in the DB (e.g. Kumon '7A'..'O', Best Brains 'A'..'E'). */
  id: string;
  /** Human-readable name shown to parents. Child surfaces may show only the neutral code. */
  displayName: string;
  /** 0-based position in the ladder (lower = earlier). */
  ordinal: number;
  /** What one unit of progress is inside this level. */
  unitKind: 'worksheet' | 'week';
  /** How many units the level contains (Kumon: 200 worksheets; Best Brains: 24 weeks). */
  unitCount: number;
}

/** How a child's starting point in the module is determined. */
export interface PlacementDescriptor {
  /**
   * 'diagnostic-adaptive' — an in-app adaptive placement walk (Best Brains DD5).
   * 'parent-selected'    — parent/onboarding picks the starting level (current Kumon flow).
   */
  kind: 'diagnostic-adaptive' | 'parent-selected';
  /** Route of the placement experience, if the module has a dedicated one. */
  route?: string;
  /** Honest expected duration of placement, in minutes. */
  estimatedMinutes?: number;
  /** Whether the module supports re-checking placement later (Best Brains: DD1 escalation). */
  recheckSupported: boolean;
  description: string;
}

/** A named concept a module can teach, addressable within its level ladder. */
export interface ConceptRef {
  conceptId: string;
  conceptName: string;
  /** Level the concept lives in (LevelDescriptor.id). */
  levelId: string;
  /** Unit index within the level (week number / worksheet number), when known. */
  position?: number;
}

/** How the module produces the content of a study session. */
export interface SessionGeneratorDescriptor {
  /**
   * 'worksheet-generator'  — per-level problem generators assembling worksheets (Kumon).
   * 'weekly-pack-generator'— seeded WeeklyConceptPack generation (Best Brains).
   */
  kind: 'worksheet-generator' | 'weekly-pack-generator';
  /** Source location of the generator entry point (documentation pointer, not a dynamic import). */
  entry: string;
  /** True when the same inputs (template + params + seed) reproduce byte-identical content. */
  deterministic: boolean;
}

/** Where and how the module persists learner progress. */
export interface ProgressSchemaDescriptor {
  /**
   * 'kumon-worksheet-progress' — sessions/attempts/worksheet_progress/mastery_status tables.
   * 'bb-week-state'            — bb_-prefixed tables keyed on (child, level, week) with the
   *                              DD1 mastery state machine.
   */
  kind: 'kumon-worksheet-progress' | 'bb-week-state';
  /** Supabase tables owned/used by the module for progress. */
  tables: string[];
}

/** What the module surfaces to parents. */
export interface ParentReportSchemaDescriptor {
  /**
   * 'dashboard-metrics'   — charts/streaks/accuracy dashboard (Kumon ProgressDashboard).
   * 'bb-weekly-narrative' — weekly narrative report + acknowledge ritual (Best Brains DD6/E102).
   */
  kind: 'dashboard-metrics' | 'bb-weekly-narrative';
  /** Cadence the parent-facing artifact is produced on. */
  cadence: 'continuous' | 'weekly';
  /** Whether the parent explicitly acknowledges each report (Best Brains sign-off ritual). */
  requiresAcknowledgement: boolean;
}

/**
 * The Mind Foundry module contract.
 * One instance per module, registered in `registry.ts`.
 */
export interface MindFoundryModule {
  id: ModuleId;
  displayName: string;
  description: string;
  /** Route the module card on PracticeModulesPage navigates to. */
  entryRoute: string;
  status: ModuleStatus;
  levels: LevelDescriptor[];
  placement: PlacementDescriptor;
  /**
   * Enumerate the concepts the module teaches. May legitimately return [] for
   * modules whose concepts are implicit in generators rather than cataloged
   * (current Kumon state), or whose catalog ships in a later increment.
   */
  conceptCatalog(): ConceptRef[];
  sessionGenerator: SessionGeneratorDescriptor;
  progressSchema: ProgressSchemaDescriptor;
  parentReportSchema: ParentReportSchemaDescriptor;
}
