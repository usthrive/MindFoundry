/**
 * Surface-uniqueness primitive — the mechanism that makes QG-1 (no duplicate
 * operand surfaces) and the surface half of QG-4 (Form B disjoint from Form A)
 * pass BY CONSTRUCTION for the composed Level-D week builders.
 *
 * The validator flags two child-answered items as a duplicate surface when they
 * share the same format class (`item.type`) AND the same numeric-token list.
 * `drawUniqueItem` computes each drafted item's commuted signature with the
 * SAME `commutedSignature` the validator uses, and redraws until the signature
 * is unused across the WHOLE pack (one guard per pack, shared by every day, the
 * puzzle, and both mastery forms). Items with fewer than two numeric tokens have
 * a null signature and are never guarded (the validator never flags them).
 *
 * Deterministic: redraws advance the seeded stream, so the same seed always
 * lands on the same accepted draft.
 */

import type { Rng } from '../../rng';
import { commutedSignature, numericTokens } from '../../surface';
import { TupleGuard } from '../shared';
import type { ItemDraft } from '../shared';

/**
 * Signature used to keep items distinct across a pack. For ≥2-token items this
 * is exactly the validator's commuted signature (so QG-1/QG-4 pass). For
 * single-token items it is a `1tok`-namespaced signature: the validator never
 * flags those, but redrawing them still guarantees Form A/B prompt-distinctness
 * (the verify harness requires formB[i].prompt !== formA[i].prompt). Zero-token
 * prose items return null and are accepted as-is.
 */
function signatureOf(draft: ItemDraft): string | null {
  const commuted = commutedSignature({ prompt: draft.prompt, type: draft.type });
  if (commuted !== null) return commuted;
  const tokens = numericTokens(draft.prompt);
  return tokens.length === 1 ? `${draft.type}|1tok|${tokens[0]}` : null;
}

export function drawUniqueItem(
  rng: Rng,
  guard: TupleGuard,
  build: (r: Rng) => ItemDraft,
  maxTries = 80,
): ItemDraft {
  let draft = build(rng);
  for (let i = 0; i < maxTries; i++) {
    const sig = signatureOf(draft);
    if (sig === null || !guard.taken(sig)) {
      if (sig !== null) guard.add(sig);
      return draft;
    }
    draft = build(rng);
  }
  const sig = signatureOf(draft);
  if (sig !== null) guard.add(sig);
  return draft;
}
