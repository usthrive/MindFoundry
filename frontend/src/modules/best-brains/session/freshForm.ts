/**
 * freshForm — the second strengthening round re-checks with NEW questions.
 *
 * WHY (owner "go", 2026-10-14). The corrective loop is: weekly check (Form A) →
 * strengthening → re-check (Form B) → if still short, strengthening again →
 * re-check again. The second re-check served the SAME six Form B questions as
 * the first. Since 2026-09-26 the child goes over the paper after every check,
 * and a question still missed after both guiding steps is shown with its answer —
 * so on 2026-10-14 the owner's son had seen the answer to one of the very
 * questions he would be re-checked on. A pass there could be memory, not
 * understanding: exactly the "finished, not knows" failure.
 *
 * Cycle 2 now draws Form B again from the week's own builder at a seed derived
 * from the child's pack seed, keeps it only if EVERY question differs from both
 * earlier checks (prompt and numeric surface), and re-mints the ids
 * (`B4-MB-07`..`12`) so the attempt log never confuses two different questions.
 * Deterministic per child, so a reload serves the same set. A week whose builder
 * cannot produce a distinct set (or a fixture-only week with no builder) keeps the
 * cycle-1 set — `bb-fresh-form-test` lists those weeks.
 */
import { buildShadowedPack } from '../generator/packGenerator';
import { surfaceSignature } from '../generator/surface';
import type { PackItem, WeeklyConceptPack } from '../types';

export interface FormForCycle {
  items: PackItem[];
  /** True when these questions are new to this child this week. */
  fresh: boolean;
}

/** Seed for the n-th try at a cycle-2 form: deterministic, far from the pack seed. */
export function cycle2Seed(packSeed: number, attempt: number): number {
  return (packSeed ^ Math.imul(0x9e3779b1, attempt + 1)) >>> 0;
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

/** Every candidate question differs from every question already served this week. */
export function distinctFrom(candidate: PackItem[], seen: PackItem[]): boolean {
  const prompts = new Set(seen.map((i) => norm(i.prompt)));
  const sigs = new Set(seen.map((i) => surfaceSignature(i)).filter((s): s is string => s !== null));
  const own = new Set<string>();
  for (const item of candidate) {
    const p = norm(item.prompt);
    if (prompts.has(p) || own.has(p)) return false;
    own.add(p);
    const sig = surfaceSignature(item);
    if (sig !== null && sigs.has(sig)) return false;
  }
  return true;
}

/** Re-mint ids past the cycle-1 set: B4-MB-01..06 → B4-MB-07..12. */
function remint(items: PackItem[], offset: number): PackItem[] {
  return items.map((item) => {
    const m = item.id.match(/^(.*-MB-)(\d+)$/);
    if (!m) return item;
    return { ...item, id: `${m[1]}${String(Number(m[2]) + offset).padStart(2, '0')}` };
  });
}

const MAX_TRIES = 12;

/**
 * The Form B a child is served in `cycle` (1 = the first re-check, 2 = the second).
 * `packSeed`/`contentVersion` are the week row's, so this is stable across reloads.
 *
 * Filled SLOT BY SLOT: each slot takes the first try whose question is new to the
 * child this week AND comes from the same template as the first re-check's slot —
 * same skill, new numbers. (The blueprint is NOT always seed-independent: in A24
 * slot 6 switches template with the seed, which the gate caught on first run.) Whole-set retries failed on the
 * small Level-A spaces (a five-frame has only so many pictures): A12 never found a
 * clean set in 6 tries, but every slot found a new question within 4.
 */
export function formBForCycle(
  pack: WeeklyConceptPack,
  packSeed: number,
  contentVersion: string | undefined,
  cycle: number,
): FormForCycle {
  const first = pack.masteryCheck.formB;
  if (cycle < 2) return { items: first, fresh: true };
  const seen: PackItem[] = [...pack.masteryCheck.formA, ...first];
  const chosen: Array<PackItem | null> = first.map(() => null);
  for (let attempt = 0; attempt < MAX_TRIES && chosen.some((c) => c === null); attempt++) {
    let candidate: PackItem[];
    try {
      candidate = buildShadowedPack(pack.identity.level, pack.identity.week, cycle2Seed(packSeed, attempt), contentVersion)
        .masteryCheck.formB;
    } catch {
      break; // no builder for this week (a fixture-only cell)
    }
    if (candidate.length !== first.length) continue;
    candidate.forEach((item, i) => {
      if (chosen[i] !== null) return;
      const want = first[i]?.generator?.templateId;
      if (want && item.generator?.templateId && item.generator.templateId !== want) return;
      const already = chosen.filter((c): c is PackItem => c !== null);
      if (distinctFrom([item], [...seen, ...already])) chosen[i] = item;
    });
  }
  if (chosen.some((c) => c === null)) return { items: first, fresh: false };
  return { items: remint(chosen as PackItem[], first.length), fresh: true };
}
