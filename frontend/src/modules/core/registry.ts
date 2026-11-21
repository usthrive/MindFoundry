/**
 * Mind Foundry module registry.
 *
 * Two entries today:
 *  - 'kumon'       — the live Kumon-style practice module, described declaratively.
 *                    Existing Kumon code is NOT refactored; this entry only imports
 *                    its published types/constants.
 *  - 'best-brains' — the Foundry Method module (Best Brains-inspired). Skeleton
 *                    references in increment 1; generator/screens land in later
 *                    increments.
 */

import { LEVEL_ORDER } from '@/services/generators/types';
import type { ConceptRef, MindFoundryModule, ModuleId } from './contract';
import {
  BB_LEVELS,
  BB_LEVEL_DISPLAY_NAMES,
  WEEKS_PER_LEVEL,
} from '../best-brains/constants';
import { CONCEPT_CATALOG } from '../best-brains/content/catalog';

// ---------------------------------------------------------------------------
// Kumon module (existing, live) — declarative description only
// ---------------------------------------------------------------------------

const kumonModule: MindFoundryModule = {
  id: 'kumon',
  displayName: 'Kumon Method',
  description:
    'Worksheet-based math practice ladder (levels 7A through O plus X electives): ' +
    'daily sessions, repetition-driven mastery, graduated hints.',
  entryRoute: '/study',
  status: 'live',
  levels: LEVEL_ORDER.map((id, ordinal) => ({
    id,
    displayName: `Level ${id}`,
    ordinal,
    unitKind: 'worksheet' as const,
    unitCount: 200,
  })),
  placement: {
    kind: 'parent-selected',
    recheckSupported: false,
    description:
      'Starting level chosen during onboarding from age/grade; adjustable by the parent. ' +
      'No in-app diagnostic placement exists for this module.',
  },
  conceptCatalog(): ConceptRef[] {
    // Honest: Kumon concepts are implicit in the per-level problem generators
    // (services/generators/*) and concept-intro animations; no formal catalog
    // has been extracted. Returning [] until/unless one is derived.
    return [];
  },
  sessionGenerator: {
    kind: 'worksheet-generator',
    entry: 'frontend/src/services/generators',
    deterministic: false,
  },
  progressSchema: {
    kind: 'kumon-worksheet-progress',
    tables: [
      'practice_sessions',
      'problem_attempts',
      'worksheet_progress',
      'daily_practice',
      'mastery_status',
      'concept_intros_viewed',
    ],
  },
  parentReportSchema: {
    kind: 'dashboard-metrics',
    cadence: 'continuous',
    requiresAcknowledgement: false,
  },
};

// ---------------------------------------------------------------------------
// Best Brains-inspired module ("Foundry Method") — increment 1 skeleton
// ---------------------------------------------------------------------------

const bestBrainsModule: MindFoundryModule = {
  id: 'best-brains',
  // User-facing label for this private build. Neutral codename is "Foundry Method" —
  // revert to it for any public/commercial release (avoid using the Best Brains trademark
  // as a product feature name). The module id stays 'best-brains' internally.
  displayName: 'Best Brains Method',
  description:
    'Weekly concept mastery: one new concept per week, taught by a teacher persona, ' +
    'practiced in 5–15 minute daily doses, gated by an 85% weekly mastery check with ' +
    'a corrective reteach loop, and narrated to parents in a weekly report.',
  entryRoute: '/foundry',
  // Increment 5: full child journey + parent view + module card shipped.
  status: 'live',
  levels: BB_LEVELS.map((id, ordinal) => ({
    id,
    displayName: BB_LEVEL_DISPLAY_NAMES[id],
    ordinal,
    unitKind: 'week' as const,
    unitCount: WEEKS_PER_LEVEL,
  })),
  placement: {
    kind: 'diagnostic-adaptive',
    route: '/foundry/placement',
    estimatedMinutes: 25,
    recheckSupported: true,
    description:
      'Adaptive mastery-band placement (DD5): 4–6 items per exit-skill cluster; ' +
      '≥80% steps up, <50% steps down; places at the highest level held at ≥80%. ' +
      'Re-checkable after two failed corrective cycles (DD1).',
  },
  conceptCatalog(): ConceptRef[] {
    // Increment 2: ported from CURRICULUM-MAP.md (5 levels × 24-week concept tables).
    return CONCEPT_CATALOG.map((c) => ({
      conceptId: c.conceptId,
      conceptName: c.conceptName,
      levelId: c.level,
      position: c.week,
    }));
  },
  sessionGenerator: {
    kind: 'weekly-pack-generator',
    entry: 'frontend/src/modules/best-brains/generator', // generatePack(level, week, seed, contentVersion)
    deterministic: true, // seeded WeeklyConceptPack regeneration (templateId + params + seed)
  },
  progressSchema: {
    kind: 'bb-week-state',
    tables: ['bb_enrollment', 'bb_week_state', 'bb_item_attempts', 'bb_parent_reports'],
  },
  parentReportSchema: {
    kind: 'bb-weekly-narrative',
    cadence: 'weekly',
    requiresAcknowledgement: true,
  },
};

/**
 * School Math (working id `school-math`): the Singapore-style, school-aligned module.
 * Curriculum, specs and decisions: modules/school-math/ (start at meta/NEXT-STEPS.md).
 * Version 1 (2026-11-20) is the Grade 2 subtraction test prep served as a static page
 * inside the app (public/school-math/test-prep.html) with a scorecard view; records stay
 * on the device, keyed per child. Version 2 moves records to `sm_` tables.
 * Program names are used only descriptively in docs; the card shows a neutral name.
 */
const schoolMathModule: MindFoundryModule = {
  id: 'school-math',
  // User-facing label for this private build (owner, 2026-11-20), matching "Kumon Method" and
  // "Best Brains Method". "Singapore Math" is a trademark of Singapore Math Inc.: for any
  // public/commercial release revert to a neutral name. The module id stays 'school-math'.
  displayName: 'Singapore Method',
  description:
    'Practice that matches the school\'s math: models he builds (bars, bonds, place-value ' +
    'charts), questions in the school\'s test formats, and test prep timed to the next test.',
  entryRoute: '/school-math',
  // Shown on a device once the parent opens /school-math there (see SchoolMathRoutes).
  status: 'in-development',
  levels: [1, 2, 3, 4, 5].map((g, ordinal) => ({
    id: `G${g}`,
    displayName: `Grade ${g}`,
    ordinal,
    unitKind: 'chapter-unit' as const,
    unitCount: [13, 14, 12, 10, 10][ordinal],
  })),
  placement: {
    // Its own kind (never Kumon's 'parent-selected'). Not built yet: version 1 has no
    // placement; the Grade 1 ladder is BUILD-PLAN v2 stage 4.
    kind: 'placement-ladder',
    recheckSupported: true,
    description:
      'Version 1: no placement (the parent opens the test prep). Version 2: a short ladder ' +
      'test through the grade\'s units, read aloud, feedback held, early stop; placed-out ' +
      'units come back as returns to confirm (DD25).',
  },
  conceptCatalog(): ConceptRef[] {
    return [];
  },
  sessionGenerator: {
    kind: 'chapter-unit-generator',
    entry: 'frontend/public/school-math/test-prep.html', // seeded generators; answers computed by code
    deterministic: true,
  },
  progressSchema: {
    kind: 'sm-device-local',
    tables: [],
  },
  parentReportSchema: {
    kind: 'sm-scorecard',
    cadence: 'continuous',
    requiresAcknowledgement: false,
  },
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const MODULE_REGISTRY: Record<ModuleId, MindFoundryModule> = {
  kumon: kumonModule,
  'best-brains': bestBrainsModule,
  'school-math': schoolMathModule,
};

export function getModule(id: ModuleId): MindFoundryModule {
  return MODULE_REGISTRY[id];
}

export function listModules(): MindFoundryModule[] {
  return Object.values(MODULE_REGISTRY);
}
