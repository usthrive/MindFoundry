/**
 * Item-template registry (QUESTION-GENERATOR-SPEC §3.1).
 *
 * Every generated item carries a GeneratorSpec { templateId, params, seed }.
 * The registry maps templateId → an `answerFor(params)` function so the
 * validator's QG-5 arithmetic checker can independently recompute the canonical
 * answer of any generated (or spec-fixture) item whose template is registered.
 *
 * Templates without a closed-form single answer (sprint set generators,
 * choice-key items, manual-review items) register `answerFor: undefined` —
 * the arithmetic audit skips them.
 */

import { LIB_TEMPLATE_DEFS, LIB_VERIFY_DEFS } from './lib/compute';
import { CLOCK_TEMPLATE_DEFS } from './lib/clock';
import { MONEY_TEMPLATE_DEFS } from './lib/money';
import { RATIO_TEMPLATE_DEFS } from './lib/ratio';
import { INTEGER_TEMPLATE_DEFS } from './lib/integers';
import { ALGEBRA_TEMPLATE_DEFS } from './lib/algebra';
import { STATS_TEMPLATE_DEFS } from './lib/stats';
import { EARLYNUMBER_TEMPLATE_DEFS } from './lib/earlynumber';
import type { VerifyResult } from './lib/compute';

type Params = Record<string, unknown>;

export interface TemplateDef {
  id: string;
  /** Recompute the canonical answer string for the arithmetic audit (QG-5). */
  answerFor?: (params: Params) => string;
  /** Recompute the CORRECT answer of an embedded-claim item (discrimination /
   *  error-analysis) so QG-11 can confirm the isCorrect option / stated true
   *  answer is actually true and any shown "wrong" value is a real misconception
   *  output (FIX-SPEC §5/§7). */
  verifyFor?: (params: Params) => VerifyResult;
}

function n(params: Params, key: string): number {
  const v = params[key];
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new Error(`template param '${key}' missing or non-numeric`);
  }
  return v;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/**
 * frac_addsub_unlike_v1 answer, matching the spec's sample usage: params carry
 * denominators (d1, d2) with optional numerators (n1, n2; default 1 = unit
 * fractions, as in fixture MFM-D17) and op '+' | '-'. Canonical answer is the
 * un-reduced common-denominator form over lcm(d1, d2) — equivalence-validated.
 */
function fracAddSub(params: Params): string {
  const d1 = n(params, 'd1');
  const d2 = n(params, 'd2');
  const n1 = typeof params.n1 === 'number' ? params.n1 : 1;
  const n2 = typeof params.n2 === 'number' ? params.n2 : 1;
  const op = params.op === '-' ? -1 : 1;
  const lcm = (d1 * d2) / gcd(d1, d2);
  const num = n1 * (lcm / d1) + op * n2 * (lcm / d2);
  return `${num}/${lcm}`;
}

/**
 * Built LAZILY, on first lookup.
 *
 * The families import `erroranalysis.ts`, which imports this file — a cycle. If
 * this array were evaluated at module scope (it was), then importing ANY family
 * module before the registry threw
 * `ReferenceError: Cannot access 'X_TEMPLATE_DEFS' before initialization`,
 * because the family's `const` is still in its temporal dead zone while the
 * spread runs. Two independent authors hit it, and one worked around it by
 * ordering imports inside a week file — a fix that has to be remembered by
 * every future consumer, which is not a fix.
 *
 * Deferring the spread to first call closes it: by the time anything asks for a
 * template, every family module has finished evaluating. `erroranalysis.ts`
 * already made its half of the cycle lazy for the same reason; this is the
 * other half.
 */
function allDefs(): TemplateDef[] {
  return [
  // --- Templates named in the spec's worked packs -------------------------
  { id: 'count_on_v1', answerFor: (p) => String(n(p, 'start') + n(p, 'hop')) },
  { id: 'add_within_10_pictures_v1', answerFor: (p) => String(n(p, 'a') + n(p, 'b')) },
  {
    id: 'sub_2digit_regroup_v1',
    answerFor: (p) => String(n(p, 'minuend') - n(p, 'subtrahend')),
  },
  { id: 'frac_addsub_unlike_v1', answerFor: fracAddSub },
  { id: 'add_tens_2digit_v1' }, // sprint set generator — no single answer
  { id: 'mult_facts_v1' }, // sprint set generator — no single answer

  // --- Level A templates (increment-2 seed content) -----------------------
  { id: 'count_objects_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'ten_frame_count_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'last_number_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'count_story_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'count_out_draw_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'numeral_choice_v1' }, // choice-key — audit skipped
  { id: 'match_set_v1' }, // choice-key — audit skipped
  { id: 'sort_count_v1', answerFor: (p) => String(n(p, 'target')) },
  { id: 'pattern_next_v1' }, // choice-key — audit skipped

  // --- Level B templates ---------------------------------------------------
  { id: 'number_after_v1', answerFor: (p) => String(n(p, 'n') + 1) },
  { id: 'number_before_v1', answerFor: (p) => String(n(p, 'n') - 1) },
  { id: 'number_between_v1', answerFor: (p) => String(n(p, 'a') + 1) },
  { id: 'fill_path_v1', answerFor: (p) => String(n(p, 'start') + 2) },
  { id: 'read_write_words_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'next_after_choice_v1' }, // choice-key — audit skipped
  {
    id: 'tens_ones_compose_v1',
    answerFor: (p) => String(10 * n(p, 't') + n(p, 'o')),
  },
  { id: 'tens_ones_decompose_v1', answerFor: (p) => String(Math.floor(n(p, 'n') / 10)) },
  { id: 'expanded_form_2digit_v1', answerFor: (p) => String(n(p, 'tens') + n(p, 'ones')) },
  { id: 'rebundle_v1', answerFor: (p) => String(10 * n(p, 't') + n(p, 'o')) },
  { id: 'which_shows_choice_v1' }, // choice-key — audit skipped
  { id: 'tens_ones_riddle_v1', answerFor: (p) => String(10 * n(p, 't') + n(p, 'o')) },
  { id: 'numeral_writing_v1' }, // sprint set generator

  // --- Level C templates ---------------------------------------------------
  {
    id: 'compose_3digit_v1',
    answerFor: (p) => String(100 * n(p, 'h') + 10 * n(p, 't') + n(p, 'o')),
  },
  {
    id: 'expanded_3digit_v1',
    answerFor: (p) => String(100 * n(p, 'h') + 10 * n(p, 't') + n(p, 'o')),
  },
  { id: 'digit_value_v1', answerFor: (p) => String(n(p, 'digit') * n(p, 'place')) },
  { id: 'digit_value_choice_v1' }, // choice-key — audit skipped
  { id: 'write_words_3digit_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'pv_riddle_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'compare_symbol_choice_v1' }, // choice-key — audit skipped
  {
    id: 'order_three_v1',
    answerFor: (p) => {
      const values = [n(p, 'a'), n(p, 'b'), n(p, 'c')].sort((x, y) => x - y);
      return values.join(', ');
    },
  },
  { id: 'round_ten_v1', answerFor: (p) => String(Math.round(n(p, 'n') / 10) * 10) },
  { id: 'round_hundred_v1', answerFor: (p) => String(Math.round(n(p, 'n') / 100) * 100) },
  { id: 'add_within_100_v1', answerFor: (p) => String(n(p, 'a') + n(p, 'b')) },

  // --- Hundred-chart / sequence reasoning (Level B) -------------------------
  { id: 'chart_below_v1', answerFor: (p) => String(n(p, 'n') + 10) },
  { id: 'chart_column_v1', answerFor: (p) => String(n(p, 'a') + 40) },
  { id: 'chart_walk_v1', answerFor: (p) => String(n(p, 'n') + 11) },
  { id: 'next_two_v1', answerFor: (p) => `${n(p, 'n') + 2}, ${n(p, 'n') + 3}` },
  { id: 'number_riddle_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'add_within_10_facts_v1' }, // sprint set generator
  { id: 'sub_within_100_facts_v1' }, // sprint set generator
  { id: 'add_within_100_facts_v1' }, // sprint set generator

  // --- Retrieval (warm-up) templates — backward-only sources (QG-2) --------
  { id: 'retr_add_within_10_v1', answerFor: (p) => String(n(p, 'a') + n(p, 'b')) },
  { id: 'retr_sub_within_10_v1', answerFor: (p) => String(n(p, 'a') - n(p, 'b')) },
  { id: 'retr_partners_of_10_v1', answerFor: (p) => String(10 - n(p, 'a')) },
  { id: 'retr_teen_ten_ones_v1', answerFor: (p) => String(10 + n(p, 'o')) },
  { id: 'retr_count_by_tens_v1', answerFor: (p) => String(n(p, 'start') + 30) },
  { id: 'retr_skip_count_v1', answerFor: (p) => String(n(p, 'start') + 2 * n(p, 'k')) },
  { id: 'retr_add_within_100_v1', answerFor: (p) => String(n(p, 'a') + n(p, 'b')) },
  { id: 'retr_sub_within_100_v1', answerFor: (p) => String(n(p, 'a') - n(p, 'b')) },
  { id: 'retr_count_objects_v1', answerFor: (p) => String(n(p, 'n')) },
  { id: 'retr_numeral_choice_v1' }, // choice-key — audit skipped
  { id: 'retr_number_after_v1', answerFor: (p) => String(n(p, 'n') + 1) },
  { id: 'retr_tens_ones_v1', answerFor: (p) => String(10 * n(p, 't') + n(p, 'o')) },
  { id: 'retr_digit_value_v1', answerFor: (p) => String(n(p, 'digit') * n(p, 'place')) },
  { id: 'retr_chart_below_v1', answerFor: (p) => String(n(p, 'n') + 10) },
  { id: 'retr_word_sub_v1', answerFor: (p) => String(n(p, 'a') - n(p, 'b')) },

  // --- Level D template library (generator/templates/lib/compute.ts) -------
  // Spread the shared Level-D answer definitions so QG-5 can recompute them,
  // and the verify (QG-11 truth) definitions for embedded-claim item types.
  ...LIB_TEMPLATE_DEFS,
  ...LIB_VERIFY_DEFS,

  // --- Level A/B/C/E generator families (FILL-ARCHITECTURE §2) -------------
  // Each family owns its own defs array and is spread here exactly once, so a
  // new family never needs a second file edited — and families can be built in
  // parallel without colliding on this one.
  ...CLOCK_TEMPLATE_DEFS,
  ...MONEY_TEMPLATE_DEFS,
  ...RATIO_TEMPLATE_DEFS,
  ...INTEGER_TEMPLATE_DEFS,
  ...ALGEBRA_TEMPLATE_DEFS,
  ...STATS_TEMPLATE_DEFS,
  ...EARLYNUMBER_TEMPLATE_DEFS,
  ];
}

let registry: ReadonlyMap<string, TemplateDef> | null = null;

function templates(): ReadonlyMap<string, TemplateDef> {
  if (!registry) registry = new Map(allDefs().map((d) => [d.id, d]));
  return registry;
}

/** The whole registry. Prefer `getTemplate`; this exists for enumeration. */
export const TEMPLATE_REGISTRY: ReadonlyMap<string, TemplateDef> = {
  get size() { return templates().size; },
  get(id: string) { return templates().get(id); },
  has(id: string) { return templates().has(id); },
  keys() { return templates().keys(); },
  values() { return templates().values(); },
  entries() { return templates().entries(); },
  forEach(cb: (v: TemplateDef, k: string, m: ReadonlyMap<string, TemplateDef>) => void, thisArg?: unknown) {
    templates().forEach(cb, thisArg);
  },
  [Symbol.iterator]() { return templates()[Symbol.iterator](); },
} as ReadonlyMap<string, TemplateDef>;

export function getTemplate(id: string): TemplateDef | undefined {
  return templates().get(id);
}
