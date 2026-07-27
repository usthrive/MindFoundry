/**
 * Authoring-time pedagogical metadata (CONTENT-GENERATOR-FIX-SPEC §3).
 *
 * `AuthorMeta` is attached to the INTERNAL item draft so the v2 pedagogical
 * preflight (assemble.ts §6) can gate on per-item facts the shipped `PackItem`
 * schema does not carry (solution step-count, situation family, whether an item
 * is a discrimination trap / error-analysis / metacognition carrier). It is the
 * ONLY field stripped before emit — the "truth" for the QG-11 claim audit rides
 * in the already-shipped `generator.params`, so there is no closure to thread.
 *
 * CONTRACT (review B5 / M-labels): these fields are DERIVED by their owning
 * generator, never hand-set by a week blueprint:
 *   - `stepCount` is stamped only by lib/multistep.ts (= the number of chained
 *     compute ops it composed); every other generator stamps 1.
 *   - `is*` flags are stamped only by their owning primitive
 *     (discrimination.ts / erroranalysis.ts / metacog.ts).
 *   - `cognitiveOp` is the item's registered operation class, so the assembler's
 *     BB-G5 clustering keys on the same cognitive reality the LLM judge measures,
 *     not a free-text label.
 */

/** Word-problem situation family (BB-W5 situation library). */
export type SituationType =
  | 'rate'
  | 'area'
  | 'sharing'
  | 'comparison'
  | 'measurement'
  | 'money-change'
  | 'combine'
  | 'multi-stage'
  | 'rate-of-change'
  | 'part-whole';

export interface AuthorMeta {
  /** Number of DISTINCT chained operations the solution requires (1 = single-step).
   *  Only lib/multistep.ts may stamp >= 2. */
  stepCount: number;
  /** Registered cognitive-operation class for BB-G5 clustering (e.g. 'mul',
   *  'div-interpret', 'add-frac-unlike', 'compare', 'classify-shape',
   *  'choose-operation'). NOT a free-text surface label. */
  cognitiveOp: string;
  /** Word problems only — the BB-W5 situation family. */
  situationType?: SituationType;
  /** Operation-choice / structural-contrast trap (set only by discrimination.ts). */
  isDiscrimination?: boolean;
  /** Analyze-a-worked-error item (set only by erroranalysis.ts). */
  isErrorAnalysis?: boolean;
  /** Carries estimate-first / reasonableness / check-back (set only by metacog.ts). */
  isMetacog?: boolean;
  /** True when >= 1 solution step invokes a strictly-prior-week skill (BB-W13 substrate). */
  usesPriorSkill?: boolean;
}

/** A single cognitive-operation class → its human label, for evidence messages. */
export const COGNITIVE_OP_LABELS: Record<string, string> = {
  // whole-number
  'pv-expand': 'place-value composition',
  'pv-digit-value': 'digit value',
  round: 'rounding',
  compare: 'comparison',
  add: 'addition',
  sub: 'subtraction',
  mul: 'multiplication',
  'div-exact': 'exact division',
  'div-remainder': 'division with remainder',
  'div-interpret': 'interpreting a remainder',
  'mul-compare': 'multiplicative comparison',
  // number theory
  'factor-pair': 'factor pair',
  multiple: 'multiple',
  'prime-composite': 'prime / composite',
  // fractions
  'frac-equiv': 'equivalent fraction',
  'frac-compare': 'fraction comparison',
  'frac-add-like': 'add/subtract like fractions',
  'frac-add-unlike': 'add/subtract unlike fractions',
  'frac-times-whole': 'fraction × whole',
  'frac-times-frac': 'fraction × fraction',
  'frac-divide': 'fraction division',
  // decimals
  'dec-compare': 'decimal comparison',
  'dec-pv': 'decimal place value',
  'dec-round': 'decimal rounding',
  'dec-add': 'decimal add/subtract',
  'dec-mul': 'decimal multiplication',
  'dec-div': 'decimal division',
  'frac-dec-convert': 'fraction ↔ decimal',
  // expressions / patterns / geometry
  'eval-expr': 'evaluate expression',
  'write-expr': 'write expression',
  'pattern-term': 'pattern term',
  plot: 'coordinate plotting',
  angle: 'angle arithmetic',
  'classify-triangle': 'triangle classification',
  volume: 'volume',
  area: 'area',
  // pedagogical item classes
  'choose-operation': 'operation choice (discrimination)',
  'structural-contrast': 'structural discrimination',
  'error-analysis': 'error analysis',
  'multi-step': 'multi-step problem',
  reasoning: 'open reasoning',
};
