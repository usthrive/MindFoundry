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

// ---------------------------------------------------------------------------
// Kumon module (existing, live) — declarative description only
// ---------------------------------------------------------------------------

const kumonModule: MindFoundryModule = {
  id: 'kumon',
  displayName: 'Kumon-Style Practice',
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
  displayName: 'Foundry Method',
  description:
    'Weekly concept mastery: one new concept per week, taught by a teacher persona, ' +
    'practiced in 5–15 minute daily doses, gated by an 85% weekly mastery check with ' +
    'a corrective reteach loop, and narrated to parents in a weekly report.',
  entryRoute: '/foundry',
  status: 'in-development',
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
    // Filled in increment 2 from CURRICULUM-MAP.md (Level × Week concept tables).
    return [];
  },
  sessionGenerator: {
    kind: 'weekly-pack-generator',
    entry: 'frontend/src/modules/best-brains/generator', // built in increment 2
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

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const MODULE_REGISTRY: Record<ModuleId, MindFoundryModule> = {
  kumon: kumonModule,
  'best-brains': bestBrainsModule,
};

export function getModule(id: ModuleId): MindFoundryModule {
  return MODULE_REGISTRY[id];
}

export function listModules(): MindFoundryModule[] {
  return Object.values(MODULE_REGISTRY);
}
