/**
 * Sprint item realizer (DD11) — turns a pack's FluencySprint GeneratorSpec
 * into the 10–30 timed items the SprintRun screen serves (increment-2 deferred
 * this: packs carry generator specs, never sprint item arrays, per schema).
 *
 * Deterministic: same GeneratorSpec → identical item list (seeded sub-stream
 * off spec.seed). Covers every sprint template registered so far: the four
 * seed-week generators (add_within_10_facts_v1, numeral_writing_v1,
 * add_within_100_facts_v1, sub_within_100_facts_v1) and the two fixture
 * generators (add_tens_2digit_v1 from MFM-B14, mult_facts_v1 from MFM-D17).
 *
 * Sprint items are ungraded and self-referenced (DD11): answers are checked
 * only to count "how many you got" against your own last time.
 */

import type { FluencySprint } from '../types';
import { streamRng, type Rng } from './rng';
import { numberWords } from './templates/shared';

export interface SprintItem {
  /** Attempt-log id: `<sprintId>#<nn>` (the '-FS-' infix marks sprint rows). */
  id: string;
  prompt: string;
  /** Canonical numeric answer as a string. */
  answer: string;
}

type Params = Record<string, unknown>;

function num(params: Params, key: string, fallback: number): number {
  const v = params[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function range(params: Params, key: string, fallback: [number, number]): [number, number] {
  const v = params[key];
  if (Array.isArray(v) && v.length === 2 && v.every((x) => typeof x === 'number')) {
    return [v[0] as number, v[1] as number];
  }
  return fallback;
}

/** Draw an (a, b) pair avoiding immediate repeats of the same surface. */
function freshPair(_rng: Rng, draw: () => [number, number], seen: Set<string>): [number, number] {
  for (let tries = 0; tries < 24; tries++) {
    const [a, b] = draw();
    const key = `${a},${b}`;
    if (!seen.has(key)) {
      seen.add(key);
      return [a, b];
    }
  }
  // Small domains (e.g. facts within 10) legitimately repeat once exhausted.
  seen.clear();
  return draw();
}

function buildPrompts(sprint: FluencySprint, rng: Rng): Array<{ prompt: string; answer: string }> {
  const { templateId, params } = sprint.generator;
  const out: Array<{ prompt: string; answer: string }> = [];
  const seen = new Set<string>();
  const count = Math.min(30, Math.max(10, sprint.itemCount));

  for (let i = 0; i < count; i++) {
    switch (templateId) {
      case 'add_within_10_facts_v1': {
        const min = num(params, 'min', 1);
        const max = num(params, 'max', 9);
        const sumMax = num(params, 'sumMax', 10);
        const [a, b] = freshPair(
          rng,
          () => {
            const x = rng.int(min, Math.min(max, sumMax - min));
            const y = rng.int(min, Math.min(max, sumMax - x));
            return [x, y];
          },
          seen,
        );
        out.push({ prompt: `${a} + ${b} = ?`, answer: String(a + b) });
        break;
      }
      case 'add_within_100_facts_v1': {
        const min = num(params, 'min', 11);
        const max = num(params, 'max', 88);
        const [a, b] = freshPair(
          rng,
          () => {
            const x = rng.int(min, max);
            const y = rng.int(1, Math.max(1, Math.min(max, 99 - x)));
            return [x, y];
          },
          seen,
        );
        out.push({ prompt: `${a} + ${b} = ?`, answer: String(a + b) });
        break;
      }
      case 'sub_within_100_facts_v1': {
        const min = num(params, 'min', 21);
        const max = num(params, 'max', 95);
        const [a, b] = freshPair(
          rng,
          () => {
            const x = rng.int(min, max);
            const y = rng.int(1, x - 1);
            return [x, y];
          },
          seen,
        );
        out.push({ prompt: `${a} − ${b} = ?`, answer: String(a - b) });
        break;
      }
      case 'add_tens_2digit_v1': {
        // Fixture MFM-B14 params: baseRange, tensRange, noCross100.
        const [baseLo, baseHi] = range(params, 'baseRange', [21, 69]);
        const [tensLo, tensHi] = range(params, 'tensRange', [10, 30]);
        const noCross = params.noCross100 !== false;
        const [a, b] = freshPair(
          rng,
          () => {
            const base = rng.int(baseLo, baseHi);
            const tensMax = noCross ? Math.min(tensHi, 99 - base) : tensHi;
            const tens = Math.floor(rng.int(tensLo, Math.max(tensLo, tensMax)) / 10) * 10;
            return [base, Math.max(10, tens)];
          },
          seen,
        );
        out.push({ prompt: `${a} + ${b} = ?`, answer: String(a + b) });
        break;
      }
      case 'mult_facts_v1': {
        const [lo, hi] = range(params, 'factorRange', [2, 9]);
        const [a, b] = freshPair(rng, () => [rng.int(lo, hi), rng.int(lo, hi)], seen);
        out.push({ prompt: `${a} × ${b} = ?`, answer: String(a * b) });
        break;
      }
      case 'numeral_writing_v1': {
        const min = num(params, 'min', 0);
        const max = num(params, 'max', 20);
        const [n] = freshPair(rng, () => [rng.int(min, max), 0], seen);
        out.push({ prompt: `Write "${numberWords(n)}" as a number.`, answer: String(n) });
        break;
      }
      default:
        throw new Error(`Unknown sprint template '${templateId}' (register it in sprintItems.ts)`);
    }
  }
  return out;
}

/** Realize the sprint's timed item list from its GeneratorSpec (10–30 items). */
export function realizeSprintItems(sprint: FluencySprint): SprintItem[] {
  const rng = streamRng(sprint.generator.seed, `sprint:${sprint.generator.templateId}`);
  return buildPrompts(sprint, rng).map((p, i) => ({
    id: `${sprint.id}#${String(i + 1).padStart(2, '0')}`,
    ...p,
  }));
}
