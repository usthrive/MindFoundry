/**
 * Week-pack ASSEMBLER — turns a compact per-week blueprint (identity + authored
 * prose + a choice of shared item generators) into a complete, deterministic
 * WeeklyConceptPack. This is what makes 24 weeks tractable: a week builder is a
 * small composition, not a 600-line bespoke file.
 *
 * The assembler owns every mechanical quality gate so the author cannot get
 * them wrong:
 *  - fixed DD3 day skeleton (QG-8 focus order; 6/6/6/4/4 items; page counts);
 *  - one shared pack-wide surface guard (QG-1 / QG-4 surface disjointness);
 *  - Form A / Form B built from the SAME generators + difficulties per index
 *    (QG-4 isomorph class), off separate RNG streams (fresh surfaces);
 *  - a preflight that mirrors the numeric gates (retrieval share 20–30% / QG-2,
 *    per-day dose 5–15 min / QG-6, distractor-tag coverage / QG-3+QG-9) and
 *    throws a precise error at authoring time if a blueprint drifts out of band.
 */

import type {
  BBBand,
  Explanation,
  FluencySprint,
  GuidedExample,
  GuidedExampleStep,
  MistakeBankEntry,
  PackDay,
  PackItem,
  PackPresentation,
  ParentSummarySeed,
  Puzzle,
  StrandTag,
  WeekRef,
  WeeklyConceptPack,
  FadeLevel,
} from '../../../types';
import { FAST_TRACK_PCT, MASTERY_THRESHOLD_PCT, SPRINT_DURATION_SECONDS } from '../../../constants';
import { streamRng, type Rng } from '../../rng';
import { contentId, makeDay, makeMasteryItems, TupleGuard } from '../shared';
import type { ItemDraft } from '../shared';
import type { ItemGen } from './items';

const LEVEL = 'D' as const;
const FOCI = ['concept-echo', 'fluency-application', 'fluency-application', 'word-problems', 'noncomputational'] as const;
const BAND_MINUTES_BASE: Record<string, number> = { beginner: 0.8, intermediate: 1.0, transition: 1.1, advanced: 1.2 };
const DAY_OVERHEAD = 2.5;

export interface SlotGen {
  gen: ItemGen;
  diff: number;
}

export interface SprintConfig {
  skill: string;
  sourceWeek: WeekRef;
  itemCount: number;
  scheduledDay: number;
  templateId: string;
  params: Record<string, unknown>;
}

export interface WeekBlueprint {
  week: number;
  conceptId: string;
  conceptName: string;
  band?: BBBand;
  strandTags: StrandTag[];
  prerequisiteWeeks: WeekRef[];
  presentation?: PackPresentation;
  explanation: Explanation;
  guidedExamples: GuidedExample[];
  puzzle: (rng: Rng, guard: TupleGuard) => Puzzle;
  sprint: SprintConfig | null;
  mistakeBank: MistakeBankEntry[];
  parentSummarySeed: ParentSummarySeed;
  isomorphNotes: string;
  /** Exactly 5 day plans; each an ordered list of {gen, diff}. Sizes 6/6/6/4/4. */
  days: SlotGen[][];
  /** Exactly 6 mastery slot generators (Form A & Form B share these). */
  mastery: SlotGen[];
}

/** Guided-example builder with the correct `D<week>-GE-0n` id. */
export function ge(
  week: number,
  n: number,
  fadeLevel: FadeLevel,
  prompt: string,
  steps: GuidedExampleStep[],
  answer: string,
): GuidedExample {
  return { id: contentId(LEVEL, week, 'GE', n), fadeLevel, prompt, steps, answer };
}

function dosePasses(band: string, items: PackItem[]): number {
  const base = BAND_MINUTES_BASE[band] ?? 1.0;
  return DAY_OVERHEAD + items.reduce((acc, it) => acc + base + 0.25 * it.difficulty, 0);
}

export function makeWeekBuilder(bp: WeekBlueprint): (packSeed: number, contentVersion: string) => WeeklyConceptPack {
  if (bp.days.length !== 5) throw new Error(`D${bp.week}: needs 5 day plans, has ${bp.days.length}`);
  if (bp.mastery.length !== 6) throw new Error(`D${bp.week}: needs 6 mastery slots, has ${bp.mastery.length}`);
  const band: BBBand = bp.band ?? 'transition';

  return (packSeed, contentVersion) => {
    const guard = new TupleGuard();
    const dayStreams = [1, 2, 3, 4, 5].map((i) => streamRng(packSeed, `d${i}`));

    const days: PackDay[] = bp.days.map((plan, i) =>
      makeDay(
        LEVEL,
        bp.week,
        i + 1,
        FOCI[i],
        2,
        plan.map(({ gen, diff }) => gen(dayStreams[i], guard, diff)),
      ),
    );

    const puzzle = bp.puzzle(streamRng(packSeed, 'pz'), guard);

    const maRng = streamRng(packSeed, 'ma');
    const mbRng = streamRng(packSeed, 'mb');
    const formA = makeMasteryItems(LEVEL, bp.week, 'MA', bp.mastery.map(({ gen, diff }) => gen(maRng, guard, diff)));
    const formB = makeMasteryItems(LEVEL, bp.week, 'MB', bp.mastery.map(({ gen, diff }) => gen(mbRng, guard, diff)));

    let fluencySprint: FluencySprint | null = null;
    if (bp.sprint) {
      const fs = streamRng(packSeed, 'fs');
      fluencySprint = {
        id: contentId(LEVEL, bp.week, 'FS', 1),
        skill: bp.sprint.skill,
        sourceWeek: bp.sprint.sourceWeek,
        durationSeconds: SPRINT_DURATION_SECONDS,
        itemCount: bp.sprint.itemCount,
        scheduledDay: bp.sprint.scheduledDay,
        selfReferenced: true,
        graded: false,
        generator: { templateId: bp.sprint.templateId, params: bp.sprint.params, seed: fs.uint() },
      };
    }

    // --- Preflight: mechanical gates, thrown early with a precise message ----
    preflight(bp, band, days, [...formA, ...formB]);

    return {
      schemaVersion: '1.0',
      packId: `MFM-${LEVEL}${bp.week}`,
      contentVersion,
      identity: {
        level: LEVEL,
        week: bp.week,
        conceptId: bp.conceptId,
        conceptName: bp.conceptName,
        band,
        strandTags: bp.strandTags,
        prerequisiteWeeks: bp.prerequisiteWeeks,
      },
      presentation: bp.presentation ?? {
        audioFirst: false,
        oneOperationPerPage: false,
        scaffoldNotes: 'Transition band: models/number-line scaffolds introduced then explicitly faded within the week; written explanation on Day 5.',
      },
      explanation: bp.explanation,
      guidedExamples: bp.guidedExamples,
      days,
      puzzle,
      fluencySprint,
      masteryCheck: {
        passThresholdPct: MASTERY_THRESHOLD_PCT,
        fastTrackPct: FAST_TRACK_PCT,
        formA,
        formB,
        isomorphNotes: bp.isomorphNotes,
      },
      mistakeBank: bp.mistakeBank,
      parentSummarySeed: bp.parentSummarySeed,
    };
  };
}

function preflight(bp: WeekBlueprint, band: string, days: PackDay[], masteryItems: PackItem[]): void {
  const tag = `D${bp.week}`;
  const dailyItems = days.flatMap((d) => d.items);
  const retrieval = dailyItems.filter((it) => it.isRetrieval).length;
  const share = retrieval / dailyItems.length;
  if (share < 0.2 - 1e-9 || share > 0.3 + 1e-9) {
    throw new Error(`${tag}: retrieval share ${(share * 100).toFixed(1)}% outside 20–30% (${retrieval}/${dailyItems.length})`);
  }
  days.forEach((d, i) => {
    const minutes = dosePasses(band, d.items);
    if (minutes < 5 || minutes > 15) {
      throw new Error(`${tag}: day ${i + 1} dose ${minutes.toFixed(1)} min outside 5–15 (${d.items.length} items)`);
    }
  });
  // Distractor-tag coverage for non-retrieval choice items (QG-3/QG-9).
  const bankTags = new Set(bp.mistakeBank.map((m) => m.errorTag));
  const check = (items: readonly PackItem[]) => {
    for (const it of items) {
      if (it.isRetrieval || !it.choices) continue;
      for (const c of it.choices) {
        if (!c.isCorrect && c.errorTag && !bankTags.has(c.errorTag)) {
          throw new Error(`${tag}: distractor tag "${c.errorTag}" on ${it.id} not covered by mistakeBank`);
        }
      }
    }
  };
  check(dailyItems);
  check(masteryItems);
}

export type { ItemDraft };
