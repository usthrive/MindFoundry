/**
 * Multi-step word-problem synthesizer (CONTENT-GENERATOR-FIX-SPEC §4.2, fix #1 —
 * the dominant BB-G7 kill). A multi-step item composes an ordered chain of ≥2
 * exact rational operations over ONE real context; its answer is the folded
 * chain (lib/compute.ts::evalRatChain), and the SAME chain ships in
 * `generator.params` so QG-5 re-derives it and the assembler reads
 * `stepCount = steps.length` from the data itself — never a hand-set label.
 *
 * A week supplies concept-specific `draw` closures (prose + the operand chain);
 * this factory owns the structure (answer computation, authorMeta stamping,
 * surface-uniqueness, the registered templateId).
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import type { TupleGuard, ItemDraft } from '../shared';
import { drawUniqueItem } from './guard';
import { evalDecChain, evalRatChain, formatFrac, type DecStep, type RatStep } from './compute';
import { valueForms } from './format';
import type { AuthorMeta, SituationType } from './meta';

export type ItemGen = (rng: Rng, guard: TupleGuard, difficulty: number) => ItemDraft;

export interface MultiStepDraw {
  /** Prompt prose; must state the full multi-step situation (≥2 operations). */
  prompt: string;
  /** Initial value of the chain (numerator; use whole numbers with initD=1). */
  initN: number;
  /** Initial denominator (default 1). */
  initD?: number;
  /** The ordered op-chain — length is the DERIVED step-count (≥2). */
  steps: RatStep[];
  units?: string;
  /** Orient → locate hint ladder (rung-1 an algorithm-free orienting question). */
  hints: [string, string];
  errorTags: ErrorTag[];
  /** 'exact-numeric' (whole result) or 'equivalent-fraction' (fractional result). */
  validation?: 'exact-numeric' | 'equivalent-fraction';
  acceptableForms?: string[];
}

export interface MultiStepCfg {
  situationType: SituationType;
  /** Cognitive-operation class for BB-G5 clustering (default 'multi-step'). */
  cognitiveOp?: string;
  /** True when ≥1 step invokes a strictly-prior-week skill (BB-W13 substrate). */
  usesPriorSkill?: boolean;
  /** How the problem is POSED (AuthorMeta.posing); default 'forward'. */
  posing?: AuthorMeta['posing'];
  draw: (r: Rng) => MultiStepDraw;
}

/**
 * Build a multi-step word-problem generator. The composed answer and the derived
 * step-count come from the same chain the item ships, so a "one-step arithmetic
 * with a name attached" item cannot masquerade as multi-step (its chain would
 * have length 1 and the factory throws).
 */
export function multiStep(cfg: MultiStepCfg): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = cfg.draw(r);
      const initD = d.initD ?? 1;
      if (d.steps.length < 2) {
        throw new Error('multiStep requires a chain of ≥2 operations (single-op is not multi-step)');
      }
      // NOTE: prose↔computation consistency (the D10 "forgot initD" class) cannot be
      // guarded syntactically — in valid problems the first fraction is often an
      // OPERAND ("3/8 of 48", "one whole plot… fills 2/6", "7 cups… 1/2-cup scoop"),
      // not the initial. The style gate reads the prose and is the check for it.
      const result = formatFrac(evalRatChain(d.initN, initD, d.steps));
      const meta: AuthorMeta = {
        stepCount: d.steps.length,
        cognitiveOp: cfg.cognitiveOp ?? 'multi-step',
        situationType: cfg.situationType,
        ...(cfg.usesPriorSkill ? { usesPriorSkill: true } : {}),
        ...(cfg.posing ? { posing: cfg.posing } : {}),
      };
      const acceptableForms =
        d.acceptableForms ?? (d.units ? valueForms(result, d.units) : []);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: d.prompt,
        answer: {
          value: result,
          acceptableForms,
          validation: d.validation ?? 'exact-numeric',
          ...(d.units ? { units: d.units } : {}),
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_multistep_rat_v1',
          params: { initN: d.initN, initD, steps: d.steps },
          seed: r.uint(),
        },
        hintLadder: d.hints,
        errorTags: d.errorTags,
        authorMeta: meta,
      };
      return draft;
    });
}

export interface MultiStepDecDraw {
  prompt: string;
  /** Initial decimal value as a string ('12.5'). */
  init: string;
  /** The ordered decimal op-chain (≥2); 'div' operands must be whole numbers. */
  steps: DecStep[];
  units?: string;
  hints: [string, string];
  errorTags: ErrorTag[];
  acceptableForms?: string[];
}

/** Decimal multi-step generator — same contract as multiStep, exact decimal answer. */
export function multiStepDec(cfg: {
  situationType: SituationType;
  cognitiveOp?: string;
  usesPriorSkill?: boolean;
  posing?: AuthorMeta['posing'];
  draw: (r: Rng) => MultiStepDecDraw;
}): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = cfg.draw(r);
      if (d.steps.length < 2) {
        throw new Error('multiStepDec requires a chain of ≥2 operations');
      }
      const result = evalDecChain(d.init, d.steps);
      const meta: AuthorMeta = {
        stepCount: d.steps.length,
        cognitiveOp: cfg.cognitiveOp ?? 'multi-step',
        situationType: cfg.situationType,
        ...(cfg.usesPriorSkill ? { usesPriorSkill: true } : {}),
        ...(cfg.posing ? { posing: cfg.posing } : {}),
      };
      const acceptableForms = d.acceptableForms ?? (d.units ? valueForms(result, d.units) : []);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: d.prompt,
        answer: { value: result, acceptableForms, validation: 'exact-numeric', ...(d.units ? { units: d.units } : {}) },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_multistep_dec_v1', params: { init: d.init, steps: d.steps }, seed: r.uint() },
        hintLadder: d.hints,
        errorTags: d.errorTags,
        authorMeta: meta,
      };
      return draft;
    });
}
