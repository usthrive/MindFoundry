/**
 * Error-analysis generator (CONTENT-GENERATOR-FIX-SPEC §4.4, fix #7) — the
 * first-class "analyze-a-worked-error" item, AND the structural cure for the
 * D6/D8 bug class (a keyed-wrong answer / a fabricated anchor number).
 *
 * The factory recomputes the truth from a registered `verifyFor` (lib/compute.ts
 * LIB_VERIFY_DEFS): `correct` = the code-computed answer, `wrong` = the genuine
 * output of a NAMED misconception transform. It hands BOTH to the week's `build`
 * closure, so the shown "wrong" number is provably a real misconception result
 * and the stated true answer is code-computed — neither can be fabricated. The
 * verify params ship in `generator.params`, so QG-11 re-derives the same truth
 * and confirms the item embeds `wrong` and keys `correct` (never the reverse).
 *
 * Emitted as `type:'error-analysis'`, `strand:'noncomputational'` (so it couples
 * the two strands, BB-G2), with a written-explanation answer + extension prompt.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import type { ItemDraft } from '../shared';
import { drawUniqueItem } from './guard';
import { LIB_VERIFY_DEFS, type VerifyResult } from './compute';
import type { AuthorMeta } from './meta';
import type { ItemGen } from './multistep';

const VERIFY = new Map(LIB_VERIFY_DEFS.map((d) => [d.id, d.verifyFor]));

export interface ErrorAnalysisProse {
  /** The worked-error prompt; MUST embed the shown wrong value and require a written explanation. */
  prompt: string;
  /** Extension prompt appended to deepen the analysis (BB-W7 signature). */
  extension: string;
  /** Orient → locate hints (must not leak the true answer). */
  hints: [string, string];
  errorTags: ErrorTag[];
  /** Extra accepted keyword forms for the written answer (beyond `correct`). */
  answerKeywords?: string[];
}

export interface ErrorAnalysisCfg {
  /** A registered verify templateId whose verifyFor returns {correct, wrong}. */
  verifyTemplateId: string;
  cognitiveOp?: string;
  /** Draw the serializable verify params (operands + op selectors). */
  drawParams: (r: Rng) => Record<string, unknown>;
  /** Build the prose from the code-recomputed truth — guarantees prose ↔ code agreement. */
  build: (v: Required<VerifyResult>, params: Record<string, unknown>, r: Rng) => ErrorAnalysisProse;
}

export function errorAnalysis(cfg: ErrorAnalysisCfg): ItemGen {
  const verifyFor = VERIFY.get(cfg.verifyTemplateId);
  if (!verifyFor) {
    throw new Error(`errorAnalysis: unknown verify templateId "${cfg.verifyTemplateId}"`);
  }
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const params = cfg.drawParams(r);
      const v = verifyFor(params);
      if (v.wrong === undefined) {
        throw new Error(`errorAnalysis: verify "${cfg.verifyTemplateId}" produced no misconception value`);
      }
      const prose = cfg.build({ correct: v.correct, wrong: v.wrong }, params, r);
      const meta: AuthorMeta = {
        stepCount: 1,
        cognitiveOp: cfg.cognitiveOp ?? 'error-analysis',
        isErrorAnalysis: true,
      };
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: `${prose.prompt} ${prose.extension} (Written explanation required.)`,
        answer: {
          value: `the true answer is ${v.correct}; the error was the misconception, not the method`,
          acceptableForms: [v.correct, ...(prose.answerKeywords ?? [])],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: cfg.verifyTemplateId, params, seed: r.uint() },
        hintLadder: prose.hints,
        errorTags: prose.errorTags,
        authorMeta: meta,
      };
      return draft;
    });
}
