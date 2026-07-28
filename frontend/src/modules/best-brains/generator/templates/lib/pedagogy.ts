/**
 * v2 PEDAGOGICAL PREFLIGHT (CONTENT-GENERATOR-FIX-SPEC §6). The authoring-time
 * gates that make "structurally polished, pedagogically hollow" content
 * impossible to ship — the same depth checks the adversarial style stage applies,
 * moved upstream. Runs ONLY when a blueprint declares `pedagogyContract: 'v2'`;
 * every gate throws a precise `D<week>: …` error at generation time.
 *
 * Gates read the authoring-time `authorMeta` on the DRAFTS (before it is stripped
 * for emit). Missing authorMeta is treated defensively (single-step, its own
 * cluster) so a partially-stamped week cannot crash a gate — it fails honestly
 * instead. Thresholds are calibrated to ACCEPT a D17-equivalent, not exceed it.
 */

import type {
  BBLevel,
  Explanation,
  GuidedExample,
  ParentSummarySeed,
  Puzzle,
} from '../../../types';
import type { ItemDraft } from '../shared';
import type { AuthorMeta } from './meta';
import { priorSameFamily } from './ledger';

/** Concepts where a genuine WITHIN-concept 2-step is intrinsically hard; they
 *  satisfy §6.1 with ≥1 week-wide multi-step (composed with a prior-week op). */
const PLACE_VALUE_FAMILY = new Set([
  'place-value-to-1000000',
  'factors-multiples-primes',
  'fraction-equivalence-comparison',
  'meeting-decimals',
  'decimal-place-value-thousandths',
  'coordinate-plane-q1-patterns',
  'angles-shape-hierarchies',
  'volume-ready-level-e',
]);

const NARRATION = /\bI\b|\bI'?m\b|I need|I can'?t|I'?ll|watch|notice|on purpose|the trick|let me|first,?\s|stuck|so that tells me|here'?s why/i;
const ALGORITHM_VERB_START = /^(line up|add |subtract|multiply|divide|break |carry|borrow|regroup|rename|round |cross-multiply|combine the|flip |invert)/i;
const ORIENTING_START = /^(picture|think|which|what|how|why|estimate|compare|imagine|is |are |does |do |count|before|first|read )/i;
const CAUSAL = /because|since|so that|that is why|that'?s why|the reason|so you|which is why|so we/i;
const PRAISE_BANNED = /\bfast\b|\brecord\b|\bsmart\b|\bgenius\b|\bclever\b|good job|great!|so quick|speedy/i;
const PRAISE_MOVE = /drew|estimat|checked|traded|renamed|split|noticed|compared|counted|found|caught|lined up|regroup|pictured|reasoned|explained|sorted|matched|broke|shared/i;
const METACOG_SCRIPT = /estimate|about\b|reasonable|near\b|benchmark|check\b|sensible|roughly|ballpark/i;

export interface PedagogyContext {
  level: BBLevel;
  week: number;
  conceptId: string;
  conceptualAnchor?: string;
  deepeningDelta?: string;
  explanation: Explanation;
  guidedExamples: GuidedExample[];
  parentSummarySeed: ParentSummarySeed;
  /** 5 arrays of day drafts (index i = Day i+1). */
  dayDrafts: ItemDraft[][];
  puzzle: Puzzle;
  puzzleMeta?: AuthorMeta;
}

function meta(d: ItemDraft): AuthorMeta {
  return d.authorMeta ?? { stepCount: 1, cognitiveOp: 'unknown' };
}

export function pedagogicalPreflight(ctx: PedagogyContext): void {
  const tag = `D${ctx.week}`;
  const fail = (msg: string): never => {
    throw new Error(`${tag} [v2 pedagogy]: ${msg}`);
  };

  const days = ctx.dayDrafts;
  const day = (n: number) => days[n - 1] ?? [];
  const allDayItems = days.flat();
  const core = allDayItems.filter((d) => !d.isRetrieval); // non-retrieval core
  const coreDays24 = [...day(2), ...day(3), ...day(4)].filter((d) => !d.isRetrieval);
  const wordProblems = core.filter((d) => d.type === 'word-problem');

  // 6.1 — Multi-step density (week-wide + concept-conditional) -----------------
  const multiStep = core.filter((d) => meta(d).stepCount >= 2);
  const day4Multi = day(4).filter((d) => !d.isRetrieval && meta(d).stepCount >= 2);
  const placeValueFamily = PLACE_VALUE_FAMILY.has(ctx.conceptId);
  if (placeValueFamily) {
    if (multiStep.length < 1) {
      fail(`place-value-family concept needs ≥1 week-wide multi-step item (composed with a prior-week op); found 0`);
    }
  } else {
    if (multiStep.length < 2) {
      fail(`operation-family concept needs ≥2 genuine multi-step items week-wide; found ${multiStep.length}`);
    }
    if (day4Multi.length < 1) {
      fail(`Day 4 needs ≥1 genuine multi-step item (stepCount≥2); found ${day4Multi.length}`);
    }
  }

  // 6.2 — Anti-drill cluster floor --------------------------------------------
  const clusters = new Set(core.map((d) => `${meta(d).cognitiveOp}|${meta(d).stepCount}`));
  if (clusters.size < 2) {
    fail(`non-retrieval core collapses to ${clusters.size} solution structure(s); need ≥2 (BB-G5). Clusters: ${[...clusters].join(', ')}`);
  }

  // 6.3 — Discrimination trap by Day 3 ----------------------------------------
  const discrim23 = [...day(2), ...day(3)].filter((d) => meta(d).isDiscrimination);
  if (discrim23.length < 1) {
    fail(`no discrimination trap in Days 2–3 (BB-W5); need ≥1 (cross-op or within-concept structural)`);
  }

  // 6.4 — Modeled think-aloud + fade ------------------------------------------
  const ges = ctx.guidedExamples;
  if (!ges.length || ges[0].fadeLevel !== 'modeled') {
    fail(`guidedExamples[0] must be a 'modeled' example`);
  }
  const modeled = ges[0];
  const modeledSays = modeled.steps.map((s) => s.teacherSay ?? '').filter(Boolean);
  const hasNarration = modeledSays.some((s) => NARRATION.test(s) && s.length > 40);
  if (!hasNarration) {
    fail(`modeled GE (${modeled.id}) lacks a genuine first-person think-aloud (a narrated reasoning step, not a bare rule+answer)`);
  }
  const hasPredictPause = modeled.steps.some(
    (s) => (s.teacherSay && (s.expected !== undefined || s.teacherSay.includes('?'))) || (s.childDo !== undefined && s.expected !== undefined),
  );
  if (!hasPredictPause) {
    fail(`modeled GE (${modeled.id}) has no predict-pause (a step stating an expected value, or a '?' in the modeled narration)`);
  }
  if (!ges.some((g) => g.fadeLevel === 'completion')) {
    fail(`guided examples must include a 'completion'-tier example (monotonic fade modeled→completion→…→independent)`);
  }

  // 6.5 — Hint-ladder linter (orient→locate; no template repeats) --------------
  // Dedup is SEED-INVARIANT: hints are normalized (digits collapsed) before
  // counting, so a ladder that varies only by operand counts as ONE template.
  // This makes the gate deterministic across all seeds (it throws for every seed
  // or none — safe to run at pack-generation time). Authoring rule: use fixed,
  // role-based hints (no per-item names/numbers) and reuse a generator ≤2× in core.
  const ladderCounts = new Map<string, number>();
  const normHint = (h: string) => h.toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ').trim();
  for (const d of core) {
    const rung1 = (d.hintLadder[0] ?? '').trim();
    const orienting = rung1.endsWith('?') || ORIENTING_START.test(rung1);
    if (!orienting || ALGORITHM_VERB_START.test(rung1)) {
      fail(`hint rung-1 must be an algorithm-free orienting question — offending item prompts with "${rung1.slice(0, 60)}"`);
    }
    const key = d.hintLadder.map(normHint).join(' | ');
    ladderCounts.set(key, (ladderCounts.get(key) ?? 0) + 1);
  }
  for (const [key, n] of ladderCounts) {
    if (n > 2) fail(`hint ladder template repeated ${n}× across non-retrieval items (seed-invariant): "${key.slice(0, 60)}…"`);
  }

  // 6.6 — Situation variety ---------------------------------------------------
  const sitTypes = new Set(wordProblems.map((d) => meta(d).situationType).filter(Boolean));
  if (sitTypes.size < 3) {
    fail(`only ${sitTypes.size} distinct situationType(s) among word problems; need ≥3 (BB-W5). Types: ${[...sitTypes].join(', ')}`);
  }

  // 6.7 — Error-analysis present ----------------------------------------------
  const errorAnalysis = allDayItems.filter((d) => d.type === 'error-analysis' && d.strand === 'noncomputational');
  if (errorAnalysis.length < 1) {
    fail(`no error-analysis item (BB-W7); need ≥1 (noncomputational, with a written-argument answer)`);
  }

  // 6.8 — Metacognition woven -------------------------------------------------
  const metacog24 = coreDays24.filter((d) => meta(d).isMetacog);
  if (metacog24.length < 1) {
    fail(`no metacognition (estimate-first / reasonableness / check-back) in Days 2–4 core (BB-W12)`);
  }
  if (!ctx.explanation.script.some((seg) => METACOG_SCRIPT.test(seg.say))) {
    fail(`estimate-first / reasonableness is not modeled in any explanation.script segment (BB-W12 ceiling)`);
  }

  // 6.9 — Concept-first "why" -------------------------------------------------
  const why = ctx.explanation.whyBeforeHow;
  const anchor = ctx.conceptualAnchor?.trim();
  if (!anchor) fail(`v2 blueprint must declare a conceptualAnchor (the concrete model/idea named in whyBeforeHow)`);
  if (!CAUSAL.test(why.slice(0, Math.ceil(why.length * 0.6)))) {
    fail(`whyBeforeHow has no causal clause (because/since/so that/…) in its first 60% — it reads as a recipe, not reasoning (BB-W1)`);
  }
  if (anchor && !why.toLowerCase().includes(anchor.toLowerCase())) {
    fail(`whyBeforeHow does not name the declared conceptualAnchor "${anchor}"`);
  }

  // 6.10 — Puzzle remove-the-concept ------------------------------------------
  const pm = ctx.puzzleMeta;
  if (!pm) throw new Error(`${tag} [v2 pedagogy]: v2 blueprint must declare puzzleMeta {cognitiveOp, stepCount} for the remove-the-concept check`);
  const pKey = `${pm.cognitiveOp}|${pm.stepCount}`;
  // Scope note (L31): the adversarial style gate found two puzzles that were
  // verbatim clones of their OWN week's Day-2/3/4 template while passing this
  // Day-1-only test. Widening the check to all core days was tried and REVERTED:
  // 18 of 23 puzzles declare the generic cognitiveOp 'multi-step', which the core
  // also produces, so the widened gate fired on 14 weeks whose puzzles the judges
  // had assessed as genuinely distinct — it was measuring label coarseness, not
  // structure. Making this checkable needs a puzzle-OPERATION taxonomy (each
  // puzzle declaring the new move it demands: search / constraint / repair /
  // completeness-argument / deduction), which is authoring work scheduled with the
  // fill. Until then the whole-week judgment stays with the style gate, which
  // demonstrably catches it.
  const day1Keys = new Set(day(1).filter((d) => !d.isRetrieval).map((d) => `${meta(d).cognitiveOp}|${meta(d).stepCount}`));
  if (day1Keys.has(pKey)) {
    fail(`puzzle collapses to a Day-1 core structure (${pKey}) — it must apply the concept a genuinely new way (BB-G7 remove-the-concept)`);
  }

  // 6.11 — Praise / voice linter ----------------------------------------------
  const praise = ctx.parentSummarySeed.homeFocus.praiseLine ?? '';
  if (PRAISE_BANNED.test(praise)) {
    fail(`praiseLine uses speed/trait/generic praise (BB-W9): "${praise.slice(0, 60)}"`);
  }
  if (!PRAISE_MOVE.test(praise)) {
    fail(`praiseLine must name an observable strategy MOVE (drew/estimated/checked/traded/renamed/…): "${praise.slice(0, 60)}"`);
  }

  // 6.12 — Dual-strand coupling (justification demand) ------------------------
  const justifies = allDayItems.some(
    (d) => d.strand === 'noncomputational' && (['manual-review', 'short-text-keyword'].includes(d.answer.validation) || meta(d).stepCount > 1),
  );
  if (!justifies) {
    fail(`no non-computational item demands justification (BB-G2 coupling): need a manual-review/short-text explanation item`);
  }

  // 6.14 — Warm-up format variety (POLISH-PASS-SPEC §P4) ----------------------
  // Two warm-ups of the SAME format on one day read as a re-run of the same
  // exercise, which is exactly the impression the retrieval ramp exists to
  // avoid. Keyed on the blueprint's declared generator templateId, so this is
  // blueprint-structural and therefore seed-invariant (it throws for every seed
  // or for none).
  const warmupKey = (d: ItemDraft) => d.generator?.templateId ?? `authored:${d.type}`;
  for (let n = 1; n <= 5; n++) {
    const warmups = day(n).filter((d) => d.isRetrieval);
    const keys = warmups.map(warmupKey);
    const dupe = keys.find((k, i) => keys.indexOf(k) !== i);
    if (dupe) {
      fail(`Day ${n} serves two warm-ups of the same format (${dupe}); vary the retrieval format within a day (P4)`);
    }
  }
  const weekWarmupFormats = new Set(allDayItems.filter((d) => d.isRetrieval).map(warmupKey));
  if (weekWarmupFormats.size < 3) {
    fail(`only ${weekWarmupFormats.size} distinct warm-up format(s) across the week; need ≥3 (P4). Formats: ${[...weekWarmupFormats].join(', ')}`);
  }

  // 6.13 — Ledger precondition (deepening delta) ------------------------------
  const sameFamily = priorSameFamily(ctx.level, ctx.week, ctx.conceptId);
  if (sameFamily.length > 0 && !ctx.deepeningDelta?.trim()) {
    fail(
      `concept shares a family with prior week(s) ${sameFamily.map((e) => e.level + e.week).join(', ')} — blueprint must declare a deepeningDelta (BB-G1)`,
    );
  }
}
