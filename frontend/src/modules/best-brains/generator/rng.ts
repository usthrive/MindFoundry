/**
 * Seeded, dependency-free PRNG for deterministic WeeklyConceptPack generation.
 *
 * Design (QUESTION-GENERATOR-SPEC §3.1): same inputs → byte-identical output.
 * Every pack section draws from a NAMED SUB-STREAM (`streamRng(packSeed, name)`),
 * so inserting/reordering draws in one section can never cascade into another
 * section's numbers.
 *
 * Implementation: xmur3 string hash → mulberry32 32-bit generator. Both are
 * public-domain reference algorithms; no external deps, stable across JS engines
 * (only >>> , Math.imul, no float trig).
 */

/** xmur3 string hash — seeds mulberry32 from an arbitrary stream label. */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/** mulberry32 — small fast 32-bit PRNG, uniform in [0, 1). */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seeded random stream. All methods are deterministic per (seed, stream). */
export class Rng {
  private readonly next: () => number;
  private readonly label: string;

  constructor(packSeed: number, stream: string) {
    this.label = `${packSeed}:${stream}`;
    const seedFn = xmur3(this.label);
    this.next = mulberry32(seedFn());
  }

  /** Uniform float in [0, 1). */
  float(): number {
    return this.next();
  }

  /** Uniform integer in [min, max] (inclusive). */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Uniform pick from a non-empty array. */
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  /** True with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Fisher–Yates shuffle (returns a new array; input untouched). */
  shuffle<T>(arr: readonly T[]): T[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  /** Non-negative 31-bit integer, e.g. for GeneratorSpec.seed provenance. */
  uint(): number {
    return Math.floor(this.next() * 2147483647);
  }
}

/** Named sub-stream factory — one stream per pack section / item slot. */
export function streamRng(packSeed: number, stream: string): Rng {
  return new Rng(packSeed, stream);
}
