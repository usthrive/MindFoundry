/**
 * checkReview — going over the paper after the weekly check (owner "go",
 * 2026-09-26; docs/BRIEF-2026-09-26-RECALL-NOT-LOOKUP.md P5).
 *
 * WHY. The check holds feedback on purpose, so it measures rather than teaches.
 * But nothing afterwards ever showed a child WHICH answers were missed. The
 * owner's son chose 47 over 54 ("which count is the greatest?") — the biggest
 * ONES digit, in the week whose whole idea is "compare the tens first" — and
 * the app said nothing, then sent him to a reteach chosen by his most common
 * mistake type. A tutor goes over the paper: each miss comes back, with the
 * child's own answer, the question read again, one guiding step, and another
 * go. The score never changes.
 *
 * This module is the pure half: which answers of a check were misses, and
 * which of those have already been gone over. The attempt log is the record.
 * The check writes each answer once per sitting — Form A with attempt_no 1,
 * Form B with attempt_no = its cycle (1 or 2), so attempt_no does NOT mark a
 * check answer. The `review: ` prefix does: every review re-answer carries it
 * (and no error tag, so a review slip never feeds the parent's miss patterns).
 */
import type { ErrorTag, MasteryForm, PackItem } from '../types';

/** The attempt-log fields the review reads. */
export interface AttemptRow {
  item_id: string;
  answer: string;
  correct: boolean;
  attempt_no: number;
  created_at: string;
}

export interface CheckMiss {
  itemId: string;
  /** What the child answered on the check (a choice key for choice items). */
  answer: string;
  /** A review re-answer already exists for this miss. */
  reviewed: boolean;
}

export const REVIEW_PREFIX = 'review: ';

/** Item ids of a form carry its slot: `B3-MA-05` (Form A), `B3-MB-02` (Form B). */
export function isFormItem(itemId: string, form: MasteryForm): boolean {
  return itemId.includes(`-M${form}-`);
}

/**
 * The misses of the LATEST sitting of `form`, and whether each was reviewed:
 * per item, the latest answer that is not a review re-answer.
 */
export function checkMissesFrom(rows: AttemptRow[], form: MasteryForm): CheckMiss[] {
  const sorted = [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const first = new Map<string, AttemptRow>();
  for (const r of sorted) {
    if (!isFormItem(r.item_id, form)) continue;
    if (!r.answer.startsWith(REVIEW_PREFIX)) first.set(r.item_id, r);
  }
  const misses: CheckMiss[] = [];
  for (const [itemId, r] of first) {
    if (r.correct) continue;
    const reviewed = sorted.some(
      (x) => x.item_id === itemId && x.answer.startsWith(REVIEW_PREFIX) && x.created_at >= r.created_at,
    );
    misses.push({ itemId, answer: r.answer, reviewed });
  }
  return misses.sort((a, b) => a.itemId.localeCompare(b.itemId));
}

/** What the child's answer looked like on screen (a choice key → its text). */
export function answerAsShown(item: PackItem, answer: string): string {
  const choice = item.choices?.find((c) => c.key.toLowerCase() === answer.trim().toLowerCase());
  return choice ? choice.text : answer;
}

/** The guiding steps the review may show before the answer: the item's first two rungs. */
export function reviewSteps(item: PackItem): string[] {
  return (item.hintLadder ?? []).slice(0, 2).filter((s) => s && s.trim());
}

/**
 * The strengthening screen names the skill to strengthen in the child's words.
 * It used the mistake bank's subtype slug ("compares-by-the-ones-digit"), which
 * names the MISTAKE, in adult shorthand, as if it were the skill.
 */
export function skillInChildWords(tag: ErrorTag | undefined): string {
  switch (tag) {
    case 'concept-misconception':
      return "this week's big idea";
    case 'task-comprehension':
      return 'reading every part of the question';
    case 'procedure-slip':
      return 'each step, one at a time';
    case 'representation-misread':
      return 'reading the signs and pictures carefully';
    case 'fact-recall':
      return 'the quick facts';
    default:
      return 'one step of this week';
  }
}
