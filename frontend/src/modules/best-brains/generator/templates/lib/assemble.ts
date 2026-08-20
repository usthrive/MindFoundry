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
  BBLevel,
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
import { numericTokens, personNames } from '../../surface';
import type { ItemDraft } from '../shared';
import type { ItemGen } from './items';
import type { AuthorMeta } from './meta';
import { pedagogicalPreflight } from './pedagogy';

/**
 * The DD3 day template is the same shape at every level — what changes with the
 * level is the dose, the page count and the presentation defaults, not the arc.
 */
const FOCI = ['concept-echo', 'fluency-application', 'fluency-application', 'word-problems', 'noncomputational'] as const;
const BAND_MINUTES_BASE: Record<string, number> = { beginner: 0.8, intermediate: 1.0, transition: 1.1, advanced: 1.2 };
const DAY_OVERHEAD = 2.5;

/** Level → its presentation band (mirrors content/catalog.ts LEVEL_BANDS). */
const DEFAULT_BAND: Record<BBLevel, BBBand> = {
  A: 'beginner', B: 'intermediate', C: 'intermediate', D: 'transition', E: 'advanced',
};

/** Band A works one operation to a page (E62); the rest carry two. */
const PAGE_COUNT: Record<BBBand, number> = { beginner: 1, intermediate: 2, transition: 2, advanced: 2 };

const SCAFFOLD_NOTES: Record<BBBand, string> = {
  beginner:
    'All prompts read aloud; oversized tap targets and answer boxes; every page carries its picture; one operation per page; mascot present.',
  intermediate:
    'Concrete models shown beside the symbols and faded within the week; gloss audio available on every prompt; numeric pad with choice support.',
  transition:
    'Transition band: models/number-line scaffolds introduced then explicitly faded within the week; written explanation on Day 5.',
  advanced:
    'Advanced band: precise vocabulary unglossed, ruled explanation lines, symbolic and graphical answer forms; decoration minimal.',
};

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
  /**
   * Which level this week belongs to. Defaults to 'D' so the 23 Level-D
   * blueprints written before the assembler was level-parameterised are
   * byte-for-byte unaffected (verified against a pack-hash baseline).
   */
  level?: BBLevel;
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
  /** Exactly 5 day plans; each an ordered list of {gen, diff}. D sizes 6/6/6/4/4; band A runs 3–4. */
  days: SlotGen[][];
  /** Optional per-day parent strip. Band A carries one EVERY day (E57 / W7 A-form). */
  teacherNoteStrips?: Array<string | undefined>;
  /** Exactly 6 mastery slot generators (Form A & Form B share these). */
  mastery: SlotGen[];
  // --- v2 pedagogy contract (CONTENT-GENERATOR-FIX-SPEC) ---------------------
  /** 'v2' enables the pedagogical preflight (§6); default 'v1' = legacy (gates skipped). */
  pedagogyContract?: 'v1' | 'v2';
  /** The concrete model/idea named in whyBeforeHow (BB-W1 §6.9). Required for v2. */
  conceptualAnchor?: string;
  /** The explicit advance vs a shared-family prior week (BB-G1 §6.13). */
  deepeningDelta?: string;
  /** Which §6.1 multi-step row applies; defaults to the D-era conceptId lookup. */
  conceptFamily?: 'operation' | 'place-value';
  /** The puzzle's cognitive-op/step-count for the remove-the-concept check (§6.10). Required for v2. */
  puzzleMeta?: AuthorMeta;
}

/**
 * Guided-example builder bound to a level, so ids read `E13-GE-02`.
 * `ge` stays bound to 'D' — every Level-D week imports it by that name.
 * A new level's week opens with `const ge = makeGe('E');`.
 */
export function makeGe(level: BBLevel) {
  return (
    week: number,
    n: number,
    fadeLevel: FadeLevel,
    prompt: string,
    steps: GuidedExampleStep[],
    answer: string,
  ): GuidedExample => ({ id: contentId(level, week, 'GE', n), fadeLevel, prompt, steps, answer });
}

export const ge = makeGe('D');

function dosePasses(band: string, items: PackItem[]): number {
  const base = BAND_MINUTES_BASE[band] ?? 1.0;
  return DAY_OVERHEAD + items.reduce((acc, it) => acc + base + 0.25 * it.difficulty, 0);
}

export function makeWeekBuilder(bp: WeekBlueprint): (packSeed: number, contentVersion: string) => WeeklyConceptPack {
  const LEVEL: BBLevel = bp.level ?? 'D';
  const tag0 = `${LEVEL}${bp.week}`;
  if (bp.days.length !== 5) throw new Error(`${tag0}: needs 5 day plans, has ${bp.days.length}`);
  if (bp.mastery.length !== 6) throw new Error(`${tag0}: needs 6 mastery slots, has ${bp.mastery.length}`);
  const band: BBBand = bp.band ?? DEFAULT_BAND[LEVEL];
  // Band-A law (FILL-ARCHITECTURE §1): any timed element is a hard fail at A.
  if (LEVEL === 'A' && bp.sprint) throw new Error(`${tag0}: Level A must not carry a fluency sprint (no timers at band A)`);

  return (packSeed, contentVersion) => {
    const guard = new TupleGuard();
    const dayStreams = [1, 2, 3, 4, 5].map((i) => streamRng(packSeed, `d${i}`));

    // Generate all drafts FIRST (authorMeta intact), preserving the exact draw
    // order days1–5 → puzzle → formA → formB so the shared guard/stream
    // consumption — and thus v1 output — stays bit-stable (review M3).
    /**
     * An assessed item may not be the guided example worked on the same page.
     *
     * Guided examples are AUTHORED prose, so their operands never enter the
     * draw guard — and the style gate duly found a Day-1 item that was GE-01's
     * solved problem with the name changed, the answer sitting a few
     * centimetres above it. Compared on the prompt's numeric tokens, which is
     * what makes two items read as the same question to a child.
     *
     * Redrawing advances the seeded stream and fires only on a real collision,
     * so a pack without the defect is unchanged.
     */
    // TWO tokens minimum, matching `drawUniqueItem`'s own rule: a single shared
    // number is a coincidence, not the same question, and guarding on it would
    // redraw constantly for no pedagogical gain.
    const geTokens = new Set(
      bp.guidedExamples
        .map((g) => numericTokens(g.prompt))
        .filter((t) => t.length >= 2)
        .map((t) => t.join(',')),
    );
    const echoesAGuidedExample = (d: ItemDraft): boolean => {
      const t = numericTokens(d.prompt);
      return t.length >= 2 && geTokens.has(t.join(','));
    };
    /**
     * NO CHILD IS NAMED TWICE ON ONE DAY-PAGE.
     *
     * Every family draws its actors from one twelve-name cast (`PERSON_NAMES`),
     * independently and with no memory, so two name-drawing generators landing
     * on one day collided often: 492 of 2,970 day-pages — 16.6%, across 59 of
     * the 99 built cells — served a page where the same child stars in two
     * unrelated stories, and some served three. The reported figure was 4.2%;
     * this is the measured one.
     *
     * It is not a correctness fault and no gate fails it. It is a coherence
     * one: a child who meets "Mia records -9 degrees" and then "Mia measured
     * 0.33 litre" on the same sheet has been given a reason to look for a
     * connection that is not there, and the page reads as though nobody
     * proofread it.
     *
     * Fixed here rather than in the seven families because the collision is
     * BETWEEN generators — no single generator can see it, which is exactly why
     * every family shipped it. Same redraw shape as the guided-example echo
     * above and the Form-B core check below: it advances the seeded stream, so
     * the build stays deterministic, and it fires only on a real collision, so
     * a page that never had the defect is unchanged.
     *
     * Bounded and non-fatal by design. A day whose plan genuinely needs more
     * distinct actors than the cast can supply keeps its last draw rather than
     * failing the build — a repeated name is a blemish, and refusing to
     * generate the week over it would be the worse trade.
     *
     * MEASURED AFTER: 15 of 2,970 day-pages, 0.5%, down from 492. The residue
     * is three known holes, stated so the next reader does not mistake 0.5% for
     * a rounding error:
     *
     *  1. `weeks/b01.ts` and `weeks/b02.ts` do not call `makeWeekBuilder` at
     *     all — they hand-roll their pack — so this guard, the guided-example
     *     redraw above, the Form-B core check below and the band-A sprint
     *     refusal all skip them. Two of the ten residual cells are those weeks.
     *  2. `applyRetrievalRamp` (packGenerator.ts) moves a Day-1 warm-up onto
     *     Day 5 AFTER this runs, so that item was checked against Day 1's cast
     *     and never against Day 5's. Every residual B17/B3-shaped collision is
     *     a moved warm-up.
     *  3. Redraw exhaustion, as described above: a day of six name-drawing
     *     items can hold most of the cast before the last one draws, and a
     *     two-name generator then has about a 4.6% chance of missing 12 times.
     */
    const dayDrafts: ItemDraft[][] = bp.days.map((plan, i) => {
      const namedToday = new Set<string>();
      return plan.map(({ gen, diff }) => {
        let draft = gen(dayStreams[i], guard, diff);
        const repeatsAName = (d: ItemDraft): boolean =>
          [...personNames(d.prompt)].some((n) => namedToday.has(n));
        for (let k = 0; k < 12 && (echoesAGuidedExample(draft) || repeatsAName(draft)); k++) {
          draft = gen(dayStreams[i], guard, diff);
        }
        for (const n of personNames(draft.prompt)) namedToday.add(n);
        return draft;
      });
    });
    const puzzle = bp.puzzle(streamRng(packSeed, 'pz'), guard);
    const maRng = streamRng(packSeed, 'ma');
    const mbRng = streamRng(packSeed, 'mb');
    const formADrafts = bp.mastery.map(({ gen, diff }) => gen(maRng, guard, diff));

    /**
     * Form B must differ from Form A in its MATHEMATICAL CORE, not merely its
     * surface.
     *
     * `drawUniqueItem` guards on the prompt's numeric tokens, which is right for
     * QG-1 but too weak here: two mastery items can share every operand that
     * determines the answer and still look distinct because an UNUSED decoy
     * quantity differs. The style gate found the consequence — a Form-B slot
     * re-serving Form A's item verbatim, on the corrective path, to a child who
     * had just failed it. Every pack also asserts in `isomorphNotes` that no
     * operand surface is reused from Form A, so the collision made that
     * teacher-facing claim false.
     *
     * Redrawing advances the seeded stream, so this stays deterministic; it
     * fires ONLY on a genuine core collision, so a pack without the defect is
     * unchanged byte-for-byte.
     */
    const coreOf = (d: ItemDraft): string | null =>
      d.generator ? `${d.generator.templateId}|${JSON.stringify(d.generator.params)}` : null;
    const formACores = new Set(formADrafts.map(coreOf).filter((c): c is string => c !== null));
    const formBDrafts = bp.mastery.map(({ gen, diff }) => {
      let draft = gen(mbRng, guard, diff);
      for (let i = 0; i < 12; i++) {
        const core = coreOf(draft);
        if (core === null || !formACores.has(core)) break;
        draft = gen(mbRng, guard, diff);
      }
      return draft;
    });

    // v2 pedagogical preflight over the drafts (authorMeta present, pre-strip).
    if ((bp.pedagogyContract ?? 'v1') === 'v2') {
      pedagogicalPreflight({
        level: LEVEL,
        week: bp.week,
        conceptId: bp.conceptId,
        conceptFamily: bp.conceptFamily,
        conceptualAnchor: bp.conceptualAnchor,
        deepeningDelta: bp.deepeningDelta,
        explanation: bp.explanation,
        guidedExamples: bp.guidedExamples,
        parentSummarySeed: bp.parentSummarySeed,
        dayDrafts,
        puzzle,
        puzzleMeta: bp.puzzleMeta,
      });
    }

    // Assemble (makeDay / makeMasteryItems strip authorMeta on emit).
    const days: PackDay[] = dayDrafts.map((drafts, i) =>
      makeDay(LEVEL, bp.week, i + 1, FOCI[i], PAGE_COUNT[band], drafts, bp.teacherNoteStrips?.[i]),
    );
    const formA = makeMasteryItems(LEVEL, bp.week, 'MA', formADrafts);
    const formB = makeMasteryItems(LEVEL, bp.week, 'MB', formBDrafts);

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
    preflight(bp, LEVEL, band, days, [...formA, ...formB]);

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
        audioFirst: LEVEL === 'A',
        oneOperationPerPage: LEVEL === 'A',
        scaffoldNotes: SCAFFOLD_NOTES[band],
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

function preflight(bp: WeekBlueprint, level: BBLevel, band: string, days: PackDay[], masteryItems: PackItem[]): void {
  const tag = `${level}${bp.week}`;
  const dailyItems = days.flatMap((d) => d.items);
  const retrieval = dailyItems.filter((it) => it.isRetrieval).length;
  const share = retrieval / dailyItems.length;
  // A·W1 is the curriculum-graph origin: there is no earlier week to retrieve
  // from, so a zero share is legal there and only there (mirrors QG-2).
  const isOrigin = level === 'A' && bp.week === 1;
  if (!isOrigin && (share < 0.2 - 1e-9 || share > 0.3 + 1e-9)) {
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
