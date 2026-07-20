/**
 * LS1-R3(b) — post-reveal fix-it material
 * (research/phase2-gaps/DESIGN-DEFAULTS-ADDENDUM-LS1.md).
 *
 * After a bottom-out answer reveal the day may not simply continue: the child
 * gets a near-transfer "fix-it" item when the item's surface supports one, or
 * an explain-back prompt otherwise. Increment 3 shipped the WarmUp site
 * (explain-back / band-A re-enactment); this module adds the TEMPLATE-BASED
 * near-transfer variant for the PracticePage reveal site.
 *
 * "Template supports it" is judged from the item surface: simple arithmetic
 * prompts (`a + b`, `a − b`, `a × b`) can be perturbed deterministically into
 * a same-structure neighbor (operands shifted, same operation, answer
 * recomputed). Anything else (word problems, representations, choices,
 * riddles) returns null → the caller falls back to explain-back.
 */

import type { PackItem } from '../types';

export interface NearTransferItem {
  prompt: string;
  answer: string;
}

/** Deterministic small hash off the item id (stable across renders). */
function idHash(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

const ARITHMETIC = /^\s*(\d{1,3})\s*([+\-−×x*])\s*(\d{1,3})\s*=\s*\?\s*$/;

/**
 * Build a near-transfer variant of a simple arithmetic item, or null when the
 * surface doesn't support one. The variant keeps the operation and magnitude
 * (operands shifted by 1–2, never colliding with the original surface) so it
 * exercises the same step that just got retaught — transfer, not memory.
 */
export function nearTransferVariant(item: PackItem): NearTransferItem | null {
  if (item.choices && item.choices.length > 0) return null;
  const m = item.prompt.match(ARITHMETIC);
  if (!m) return null;
  const a = Number(m[1]);
  const op = m[2];
  const b = Number(m[3]);
  const h = idHash(item.id);
  const shift = (h % 2) + 1; // 1 or 2

  let na = a + shift;
  let nb = b;
  let answer: number;
  let sym: string;
  if (op === '+') {
    sym = '+';
    answer = na + nb;
  } else if (op === '-' || op === '−') {
    sym = '−';
    // Keep the difference positive and the regroup character similar.
    if (na <= nb) na = nb + shift + 1;
    answer = na - nb;
  } else {
    sym = '×';
    // Multiplication: shift the smaller factor by 1 within single digits.
    na = a;
    nb = Math.max(2, Math.min(9, b + (h % 2 === 0 ? 1 : -1)));
    if (nb === b) nb = b + 1;
    answer = na * nb;
  }
  if (na === a && nb === b) return null;
  return { prompt: `${na} ${sym} ${nb} = ?`, answer: String(answer) };
}
