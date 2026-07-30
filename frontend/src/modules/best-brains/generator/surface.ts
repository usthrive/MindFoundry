/**
 * Operand-surface extraction shared by the validator (QG-1/QG-4) and the
 * verification script.
 *
 * A "surface signature" is the ordered list of numeric tokens (mixed numbers,
 * fractions, decimals, integers — in that match priority) appearing in an item
 * prompt, keyed by the item's format class (its `type`). Two child-answered
 * items with the same format class and identical ordered token lists count as
 * the same surface (QG-1); commuted pairs (same multiset, different order) are
 * tracked separately, per the spec's "commuted pairs … allowed only ≥2 days
 * apart" rule.
 */

import type { PackItem } from '../types';

// Comma-grouped forms are matched FIRST and normalised below, so a signature
// is identical whether or not thousands separators are rendered (P6).
const NUM_TOKEN = /\d+\s\d+\/\d+|\d+\/\d+|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d+|\d+/g;

/** Ordered numeric tokens of a prompt (includes [image: …] placeholder text). */
export function numericTokens(prompt: string): string[] {
  return (prompt.match(NUM_TOKEN) ?? []).map((t) => t.replace(/,/g, ''));
}

/** Ordered surface signature, or null when the prompt has <2 numeric tokens. */
export function surfaceSignature(item: Pick<PackItem, 'prompt' | 'type'>): string | null {
  const tokens = numericTokens(item.prompt);
  if (tokens.length < 2) return null;
  return `${item.type}|${tokens.join(',')}`;
}

/** Order-insensitive (commuted) signature, or null when <2 numeric tokens. */
export function commutedSignature(item: Pick<PackItem, 'prompt' | 'type'>): string | null {
  const tokens = numericTokens(item.prompt);
  if (tokens.length < 2) return null;
  return `${item.type}|${tokens.slice().sort().join(',')}`;
}
