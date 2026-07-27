/**
 * Metacognition weaver (CONTENT-GENERATOR-FIX-SPEC §4.5, fix #8). Wraps a core
 * generator with an estimate-first / reasonableness / check-back frame so the
 * metacognitive habit lives in Day 2–4 CORE items, not only warm-ups (BB-W12).
 *
 * Determinism / surface safety (review M3): all work happens inside the returned
 * closure (modeled on `asWarmup`), there is NO wrap-time or new rng draw, and the
 * injected benchmark prose is VERBAL — it must contain no digits, so the prompt's
 * numeric-token list (and thus the QG-1/QG-4 surface signature the guard
 * registered on the inner draft) is unchanged.
 */

import type { AuthorMeta } from './meta';
import type { ItemGen } from './multistep';

const DIGIT = /[0-9]/;

function markMetacog(meta: AuthorMeta | undefined): AuthorMeta {
  return meta ? { ...meta, isMetacog: true } : { stepCount: 1, cognitiveOp: 'reasoning', isMetacog: true };
}

function assertVerbal(text: string, where: string): void {
  if (DIGIT.test(text)) {
    throw new Error(`metacog ${where} must be VERBAL (no digits, review M3): "${text}"`);
  }
}

/** Prepend a verbal estimate-first prompt ("about how big should the answer be?"). */
export function withEstimateFirst(base: ItemGen, benchmark: string): ItemGen {
  assertVerbal(benchmark, 'estimate benchmark');
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return {
      ...d,
      prompt: `Estimate first — ${benchmark} Then solve: ${d.prompt}`,
      authorMeta: markMetacog(d.authorMeta),
    };
  };
}

/** Append a verbal reasonableness check against a benchmark. */
export function withReasonableness(base: ItemGen, benchmark: string): ItemGen {
  assertVerbal(benchmark, 'reasonableness benchmark');
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return {
      ...d,
      prompt: `${d.prompt} After you solve, check: ${benchmark}`,
      authorMeta: markMetacog(d.authorMeta),
    };
  };
}

/** Append a verbal plug-back / rebuild check ("does your answer rebuild the start?"). */
export function withCheckBack(base: ItemGen, check: string): ItemGen {
  assertVerbal(check, 'check-back prompt');
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return {
      ...d,
      prompt: `${d.prompt} Then check your answer: ${check}`,
      authorMeta: markMetacog(d.authorMeta),
    };
  };
}
