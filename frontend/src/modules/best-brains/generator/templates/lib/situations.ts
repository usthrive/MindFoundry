/**
 * Situation taxonomy (CONTENT-GENERATOR-FIX-SPEC §4.1, fix #2). Replaces the
 * noun-swap bank with a factory that stamps a SituationType on a (single-step)
 * word problem, so a week can present ≥3 genuinely DIFFERENT situation families
 * (rate, area, sharing, comparison, measurement, money-change, combine,
 * part-whole …) that differ in operation/step-structure — not one template with
 * the proper noun swapped. Multi-step situations come from multistep.ts (also
 * SituationType-stamped); together they satisfy the BB-W5 variety gate.
 *
 * The answer is code-computed via a REGISTERED templateId (so QG-5 audits it).
 */

import type { AnswerValidation, ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import type { TupleGuard, ItemDraft } from '../shared';
import { drawUniqueItem } from './guard';
import { valueForms } from './format';
import type { AuthorMeta, SituationType } from './meta';
import type { ItemGen } from './multistep';

export interface SituationDraw {
  prompt: string;
  /** Code-computed answer value (must equal the registered templateId's answerFor over params). */
  answerValue: string;
  /** A REGISTERED templateId whose answerFor re-derives answerValue (QG-5). */
  templateId: string;
  params: Record<string, unknown>;
  units?: string;
  validation?: AnswerValidation;
  acceptableForms?: string[];
  hints: [string, string];
  errorTags: ErrorTag[];
}

export interface SituationCfg {
  situationType: SituationType;
  /** Registered cognitive-op class for BB-G5 clustering (e.g. 'mul','div-interpret'). */
  cognitiveOp: string;
  usesPriorSkill?: boolean;
  draw: (r: Rng) => SituationDraw;
}

export function situation(cfg: SituationCfg): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = cfg.draw(r);
      const meta: AuthorMeta = {
        stepCount: 1,
        cognitiveOp: cfg.cognitiveOp,
        situationType: cfg.situationType,
        ...(cfg.usesPriorSkill ? { usesPriorSkill: true } : {}),
      };
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: d.prompt,
        answer: {
          value: d.answerValue,
          // valueForms, not `${value} ${units}` — a drawn count of 1 printed
          // "1 marbles" into the accepted-answer list, and money answers need
          // their 2-decimal surfaces enumerated (POLISH-PASS-SPEC §P1/§P5).
          acceptableForms: d.acceptableForms ?? (d.units ? valueForms(d.answerValue, d.units) : []),
          validation: d.validation ?? 'exact-numeric',
          ...(d.units ? { units: d.units } : {}),
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: d.templateId, params: d.params, seed: r.uint() },
        hintLadder: d.hints,
        errorTags: d.errorTags,
        authorMeta: meta,
      };
      return draft;
    });
}
