/**
 * Fixture loader — serves the spec's three worked sample packs (ported
 * verbatim from QUESTION-GENERATOR-SPEC §4) when (level, week) matches.
 *
 * Fixtures are STATIC: the same pack is returned for every seed, pinned at
 * their authored contentVersion (1.0.0). `generatePack` consults this loader
 * first and falls back to seeded templates otherwise.
 */

import type { BBLevel, WeeklyConceptPack } from '../../types';
import { MFM_A15 } from './mfm-a15';
import { MFM_B14 } from './mfm-b14';
import { MFM_D17 } from './mfm-d17';

const FIXTURES: readonly WeeklyConceptPack[] = [MFM_A15, MFM_B14, MFM_D17];

/** (level, week) pairs served from fixtures. */
export const FIXTURE_WEEKS: ReadonlyArray<{ level: BBLevel; week: number }> = FIXTURES.map(
  (p) => ({ level: p.identity.level, week: p.identity.week }),
);

/** Deep-cloned fixture for (level, week), or undefined when none exists. */
export function getFixture(level: BBLevel, week: number): WeeklyConceptPack | undefined {
  const found = FIXTURES.find((p) => p.identity.level === level && p.identity.week === week);
  return found ? structuredClone(found) : undefined;
}

export { MFM_A15, MFM_B14, MFM_D17 };
