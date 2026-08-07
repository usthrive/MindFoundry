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

/**
 * A causal clause IS the reasoning the child is supposed to supply. A probe
 * containing one has already answered itself — which is exactly how the v2
 * corpus satisfied the metacognition gate without the child ever estimating
 * (PEDAGOGY-CEILING-REVIEW F1: "the wrapper narrates the insight instead of
 * eliciting it"; LEARNINGS L25).
 */
const TELLS = /\b(because|since|so that|so a\b|so the\b|always|never|remember that|which means)\b/i;

function markMetacog(meta: AuthorMeta | undefined): AuthorMeta {
  return meta ? { ...meta, isMetacog: true } : { stepCount: 1, cognitiveOp: 'reasoning', isMetacog: true };
}

function assertVerbal(text: string, where: string): void {
  if (DIGIT.test(text)) {
    throw new Error(`metacog ${where} must be VERBAL (no digits, review M3): "${text}"`);
  }
}

/**
 * A probe must ELICIT, not narrate: it asks a question the child answers before
 * working, and it must not hand over the reason or name the move under test.
 * Both checks are structural, so the failure mode cannot creep back in.
 */
function assertElicits(text: string, where: string): void {
  if (!text.trim().endsWith('?')) {
    throw new Error(`metacog ${where} must be a QUESTION the child answers (end it with '?'): "${text}"`);
  }
  const tell = TELLS.exec(text);
  if (tell) {
    throw new Error(
      `metacog ${where} states the reasoning ("${tell[0]}") instead of asking for it — the child must supply the why: "${text}"`,
    );
  }
}

/**
 * Deterministic lead-in variety: keyed off the drafted prompt, never a new rng
 * draw. Each lead is a COMPLETE sentence, because the band-B/C length law
 * (FILL-ARCHITECTURE §2, ≤15 words) counts an em-dash as a separator inside one
 * sentence: "Make a call before you work it out — <probe>" welded eight words
 * onto every probe and put whole weeks over the ceiling. A short closed
 * sentence leaves the probe to stand on its own word count.
 */
const PROBE_LEAD = ['Think before you solve.', 'Predict first.', 'Make a call first.'] as const;

/** Probes are authored lowercase (mid-sentence style); they now open a sentence. */
function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Prepend an eliciting estimate-first probe. `probe` is a QUESTION with a
 * decidable answer ("will the answer land above or below an even split?"), not
 * a statement of what the answer will be.
 */
export function withEstimateFirst(base: ItemGen, probe: string): ItemGen {
  assertVerbal(probe, 'estimate probe');
  assertElicits(probe, 'estimate probe');
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const lead = PROBE_LEAD[d.prompt.length % PROBE_LEAD.length];
    return {
      ...d,
      // "Decide, then solve." closes with a period, not a colon: a colon would
      // weld its three words onto the inner prompt's first sentence, which is
      // exactly the length-law failure the leads above were rebuilt to avoid.
      prompt: `${lead} ${sentenceCase(probe)} Decide, then solve. ${d.prompt}`,
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
      // Closed lead sentence for the same reason as PROBE_LEAD above: a colon
      // would weld these words onto the benchmark's first sentence and count
      // them against its ≤15-word budget.
      prompt: `${d.prompt} After you solve, check yourself. ${sentenceCase(benchmark)}`,
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
      // Closed lead sentence — same rationale as PROBE_LEAD and withReasonableness.
      prompt: `${d.prompt} Then check your answer. ${sentenceCase(check)}`,
      authorMeta: markMetacog(d.authorMeta),
    };
  };
}
