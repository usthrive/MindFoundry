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
import { buildD01 } from './templates/weeks/d01';
import { buildD02 } from './templates/weeks/d02';
import { buildD03 } from './templates/weeks/d03';
import { buildD04 } from './templates/weeks/d04';
import { buildD05 } from './templates/weeks/d05';
import { buildD06 } from './templates/weeks/d06';
import { buildD07 } from './templates/weeks/d07';
import { buildD08 } from './templates/weeks/d08';
import { buildD09 } from './templates/weeks/d09';
import { buildD10 } from './templates/weeks/d10';
import { buildD11 } from './templates/weeks/d11';
import { buildD12 } from './templates/weeks/d12';
import { buildD13 } from './templates/weeks/d13';
import { buildD14 } from './templates/weeks/d14';
import { buildD15 } from './templates/weeks/d15';
import { buildD16 } from './templates/weeks/d16';
// D17 is served by the static fixture MFM-D17 (spec §4.3 worked pack).
import { buildD18 } from './templates/weeks/d18';
import { buildD19 } from './templates/weeks/d19';
import { buildD20 } from './templates/weeks/d20';
import { buildD21 } from './templates/weeks/d21';
import { buildD22 } from './templates/weeks/d22';
import { buildD23 } from './templates/weeks/d23';
import { buildD24 } from './templates/weeks/d24';

/**
 * Default content version stamped on template-generated packs.
 * 1.1.0 — LS1-R4 retrieval ramp (see applyRetrievalRamp). Learners pinned at
 * 1.0.0 keep regenerating their original packs (DD15 versioned pointers).
 */
export const CONTENT_VERSION = '1.1.0';

type WeekBuilder = (packSeed: number, contentVersion: string) => WeeklyConceptPack;

const WEEK_BUILDERS: ReadonlyMap<string, WeekBuilder> = new Map<string, WeekBuilder>([
  ['A1', buildA01],
  ['A2', buildA02],
  ['B1', buildB01],
  ['B2', buildB02],
  ['C1', buildC01],
  ['C2', buildC02],
  // Level D — full level (23 template weeks; D17 is the static fixture).
  ['D1', buildD01],
  ['D2', buildD02],
  ['D3', buildD03],
  ['D4', buildD04],
  ['D5', buildD05],
  ['D6', buildD06],
  ['D7', buildD07],
  ['D8', buildD08],
  ['D9', buildD09],
  ['D10', buildD10],
  ['D11', buildD11],
  ['D12', buildD12],
  ['D13', buildD13],
  ['D14', buildD14],
  ['D15', buildD15],
  ['D16', buildD16],
  ['D18', buildD18],
  ['D19', buildD19],
  ['D20', buildD20],
  ['D21', buildD21],
  ['D22', buildD22],
  ['D23', buildD23],
  ['D24', buildD24],
]);

/** (level, week) cells generated from seeded templates. */
export const GENERATED_WEEKS: ReadonlyArray<{ level: BBLevel; week: number }> = [
  { level: 'A', week: 1 },
  { level: 'A', week: 2 },
  { level: 'B', week: 1 },
  { level: 'B', week: 2 },
  { level: 'C', week: 1 },
  { level: 'C', week: 2 },
  // Level D — weeks 1–16 and 18–24 (week 17 = MFM-D17 fixture).
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24].map(
    (week) => ({ level: 'D' as const, week }),
  ),
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
  const pack = builder(packSeed, contentVersion);
  if (versionAtLeast(contentVersion, 1, 1)) applyRetrievalRamp(pack);
  return pack;
}

function versionAtLeast(version: string, major: number, minor: number): boolean {
  const m = version.match(/^(\d+)\.(\d+)/);
  if (!m) return false;
  const [vMajor, vMinor] = [Number(m[1]), Number(m[2])];
  return vMajor > major || (vMajor === major && vMinor >= minor);
}

/**
 * LS1-R4 — retrieval ramp across the week (contentVersion ≥ 1.1.0, template
 * cells only; fixtures stay verbatim). The 1.0.0 authored day-mix is
 * front-loaded (Day 1 ≈33% retrieval, Days 4–5 25%); the research default
 * wants the retrieval share ramping ~20% → ~40% late-week instead. The
 * cheapest QG-legal move: relocate Day 1's LAST retrieval warm-up to Day 5
 * (re-minted into the D5 id slot). Result on the 2-retrieval Day-1 weeks:
 * D1 1/5 (20%) · D2–3 1/6 · D4 1/4 · D5 2/5 (40%). Pack-wide share is
 * unchanged, so the QG-2 20–30% gate still holds (QG gates win — a mix the
 * gates can't absorb is logged and skipped, per the addendum); per-day item
 * counts stay within the 3–8 structural bounds. Deterministic: no RNG draws.
 */
function applyRetrievalRamp(pack: WeeklyConceptPack): void {
  const day1 = pack.days.find((d) => d.day === 1);
  const day5 = pack.days.find((d) => d.day === 5);
  if (!day1 || !day5) return;
  const day1Retrieval = day1.items.filter((i) => i.isRetrieval);
  // Only ramp when Day 1 keeps ≥1 warm-up and Day 5 stays within QG-8 bounds.
  if (day1Retrieval.length < 2 || day5.items.length >= 8) return;
  const moved = day1Retrieval[day1Retrieval.length - 1];
  day1.items = day1.items.filter((i) => i !== moved);
  const { level, week } = pack.identity;
  day5.items = [
    ...day5.items,
    { ...moved, id: `${level}${week}-D5-${String(day5.items.length + 1).padStart(2, '0')}` },
  ];
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
