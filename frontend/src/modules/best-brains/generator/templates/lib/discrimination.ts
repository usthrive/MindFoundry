/**
 * Discrimination-trap generator (CONTENT-GENERATOR-FIX-SPEC §4.3, fix #3;
 * review M9). Emits a `classification` item where surface cues mislead and the
 * child must NOTICE which operation / structure applies. Two variants:
 *
 *  - 'cross-op'    — the trap is across operations (add-vs-multiply,
 *                    times-as-many-vs-more-than, longer-decimal-vs-larger).
 *  - 'structural'  — a same-operation contrast the child must notice
 *                    (rename-one vs rename-both, regroup vs no-regroup,
 *                    like vs unlike denominators) — the authentic discrimination
 *                    for fixed-operation weeks (D17-D3-05), blessed by BB-W5.
 *
 * The correct option is code-selected by the week's `draw`. The item does NOT
 * assert a specific worked result in its prompt (the child decides), so it needs
 * no `verifyFor` — that machinery is for verify-a-worked-answer items
 * (erroranalysis.ts). Stamps `authorMeta.isDiscrimination`.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import type { TupleGuard, ItemDraft } from '../shared';
import { makeChoices } from '../shared';
import { drawUniqueItem } from './guard';
import type { AuthorMeta } from './meta';
import type { ItemGen } from './multistep';

export interface DiscriminationDraw {
  prompt: string;
  /** Canonical correct option text (code-selected). */
  correct: string;
  correctForms?: string[];
  distractors: Array<{ text: string; errorTag: ErrorTag; rationale: string }>;
  hints: [string, string];
  errorTags: ErrorTag[];
}

export interface DiscriminationCfg {
  variant: 'cross-op' | 'structural';
  cognitiveOp?: string;
  draw: (r: Rng) => DiscriminationDraw;
}

export function discrimination(cfg: DiscriminationCfg): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const d = cfg.draw(r);
      const { choices, correctKey } = makeChoices(r, d.correct, d.distractors);
      const meta: AuthorMeta = {
        stepCount: 1,
        cognitiveOp: cfg.cognitiveOp ?? (cfg.variant === 'cross-op' ? 'choose-operation' : 'structural-contrast'),
        isDiscrimination: true,
      };
      const draft: ItemDraft = {
        type: 'classification',
        prompt: d.prompt,
        choices,
        answer: { value: correctKey, acceptableForms: [d.correct, ...(d.correctForms ?? [])], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        hintLadder: d.hints,
        errorTags: d.errorTags,
        authorMeta: meta,
      };
      return draft;
    });
}
