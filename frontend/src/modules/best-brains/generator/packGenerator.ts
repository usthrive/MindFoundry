/**
 * Deterministic WeeklyConceptPack generator — the module's session-generator
 * entry point (SessionGeneratorDescriptor kind 'weekly-pack-generator').
 *
 * `generatePack(level, week, packSeed, contentVersion)` is a PURE function:
 * packs are never stored; `bb_week_state.pack_seed` + `content_version` are
 * the regeneration inputs (increment-1 handoff / DD15 versioned pointers).
 *
 * Resolution order:
 *  1. Fixture loader — the spec's three worked packs (A15, B14, D17) are
 *     served verbatim for their (level, week); they are static, so the seed
 *     does not vary their surface, and they stay pinned at their authored
 *     contentVersion (1.0.0).
 *  2. Seeded week templates — increment-2 seed content covers the natural
 *     post-placement entry weeks: A1, A2, B1, B2, C1, C2.
 */

import type { BBLevel, PackDay, WeeklyConceptPack } from '../types';
import { getFixture, FIXTURE_WEEKS } from './fixtures';
import { buildA01 } from './templates/weeks/a01';
import { buildA02 } from './templates/weeks/a02';
import { buildB01 } from './templates/weeks/b01';
import { buildB02 } from './templates/weeks/b02';
import { buildC01 } from './templates/weeks/c01';
import { buildC02 } from './templates/weeks/c02';

/** Default content version stamped on template-generated packs. */
export const CONTENT_VERSION = '1.0.0';

type WeekBuilder = (packSeed: number, contentVersion: string) => WeeklyConceptPack;

const WEEK_BUILDERS: ReadonlyMap<string, WeekBuilder> = new Map<string, WeekBuilder>([
  ['A1', buildA01],
  ['A2', buildA02],
  ['B1', buildB01],
  ['B2', buildB02],
  ['C1', buildC01],
  ['C2', buildC02],
]);

/** (level, week) cells generated from seeded templates. */
export const GENERATED_WEEKS: ReadonlyArray<{ level: BBLevel; week: number }> = [
  { level: 'A', week: 1 },
  { level: 'A', week: 2 },
  { level: 'B', week: 1 },
  { level: 'B', week: 2 },
  { level: 'C', week: 1 },
  { level: 'C', week: 2 },
];

/** All (level, week) cells with servable content (templates + fixtures). */
export const AVAILABLE_WEEKS: ReadonlyArray<{ level: BBLevel; week: number; source: 'template' | 'fixture' }> = [
  ...GENERATED_WEEKS.map((w) => ({ ...w, source: 'template' as const })),
  ...FIXTURE_WEEKS.map((w) => ({ ...w, source: 'fixture' as const })),
];

export function hasPackContent(level: BBLevel, week: number): boolean {
  return WEEK_BUILDERS.has(`${level}${week}`) || getFixture(level, week) !== undefined;
}

/**
 * Generate the WeeklyConceptPack for a curriculum cell.
 *
 * Deterministic: same (level, week, packSeed, contentVersion) → deep-equal
 * pack. Fixture-backed cells ignore packSeed/contentVersion (static, pinned).
 *
 * @throws when no content exists for (level, week) yet.
 */
export function generatePack(
  level: BBLevel,
  week: number,
  packSeed: number,
  contentVersion: string = CONTENT_VERSION,
): WeeklyConceptPack {
  const fixture = getFixture(level, week);
  if (fixture) return fixture;
  const builder = WEEK_BUILDERS.get(`${level}${week}`);
  if (!builder) {
    const available = AVAILABLE_WEEKS.map((w) => `${w.level}${w.week}`).join(', ');
    throw new Error(
      `No pack content for ${level} week ${week} (increment 2 covers: ${available})`,
    );
  }
  return builder(packSeed, contentVersion);
}

/**
 * Convenience for session screens: the Day-N slice of a pack (1-based).
 * Day tiles / "today's content" read pack.days via this accessor.
 */
export function getPackDay(pack: WeeklyConceptPack, day: number): PackDay {
  const found = pack.days.find((d) => d.day === day);
  if (!found) throw new Error(`Pack ${pack.packId} has no day ${day}`);
  return found;
}
