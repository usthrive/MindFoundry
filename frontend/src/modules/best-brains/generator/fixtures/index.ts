/**
 * Fixture loader — serves the spec's worked sample packs (ported verbatim from
 * QUESTION-GENERATOR-SPEC §4) when (level, week) matches.
 *
 * Fixtures are STATIC: the same pack is returned for every seed, pinned at
 * their authored contentVersion (1.0.0). `generatePack` consults this loader
 * first and falls back to seeded templates otherwise.
 *
 * TWO ROLES, DELIBERATELY SEPARATED (2026-08-11, `build/D17-RECIPE-PROPOSAL.md`
 * option A). A fixture is both (a) the pack SERVED for its cell and (b) a pinned
 * CALIBRATION/regression artifact — the style-gate thresholds, QG-11's v1 mode
 * and several regression suites are defined against these exact packs. Those
 * roles are independent, and conflating them had a cost: because `generatePack`
 * resolves fixtures BEFORE builders, any generated week for a fixture-backed
 * cell is unreachable — `weeks/b14.ts` has been authored, wired and served to
 * nobody since it was written.
 *
 * `ALL_FIXTURES` is the calibration set and never shrinks. `SERVED_FIXTURES` is
 * the (smaller) set that still answers `getFixture`. D17 has left the served set
 * now that `weeks/d17.ts` exists; MFM_D17 itself is untouched and still exported.
 */

import type { BBLevel, WeeklyConceptPack } from '../../types';
import { MFM_A15 } from './mfm-a15';
import { MFM_B14 } from './mfm-b14';
import { MFM_D17 } from './mfm-d17';

/** Every pinned fixture — the calibration/regression set. Never shrinks. */
export const ALL_FIXTURES: readonly WeeklyConceptPack[] = [MFM_A15, MFM_B14, MFM_D17];

/**
 * Fixtures that still SERVE their cell. A fixture leaves this list when a
 * generated week takes the cell over; it stays in `ALL_FIXTURES` forever.
 */
const SERVED_FIXTURES: readonly WeeklyConceptPack[] = [MFM_A15, MFM_B14];

/** (level, week) pairs served from fixtures. */
export const FIXTURE_WEEKS: ReadonlyArray<{ level: BBLevel; week: number }> = SERVED_FIXTURES.map(
  (p) => ({ level: p.identity.level, week: p.identity.week }),
);

/** Deep-cloned fixture for (level, week), or undefined when none serves it. */
export function getFixture(level: BBLevel, week: number): WeeklyConceptPack | undefined {
  const found = SERVED_FIXTURES.find((p) => p.identity.level === level && p.identity.week === week);
  return found ? structuredClone(found) : undefined;
}

/** Deep-cloned fixture by id from the CALIBRATION set, served or not. */
export function getPinnedFixture(level: BBLevel, week: number): WeeklyConceptPack | undefined {
  const found = ALL_FIXTURES.find((p) => p.identity.level === level && p.identity.week === week);
  return found ? structuredClone(found) : undefined;
}

export { MFM_A15, MFM_B14, MFM_D17 };
