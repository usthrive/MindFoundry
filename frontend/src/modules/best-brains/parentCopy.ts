/**
 * Best Brains-inspired module — parent-surface canonical copy (increment 5).
 *
 * Register per TEACHER-PERSONA §6.2 / SCREEN-SPECS appendix H parent strings:
 * verdict labels "Passed" / "One more round" ("Review"/"Failed" never
 * rendered); consistency lines effort-framed ("{n} practice days this week",
 * never "missed"); the 85% gate explained plainly; DD7 tags translated with
 * the program's own plan attached (diagnosis-and-treatment, never
 * symptoms-for-the-parent-to-treat). Everything uncited is [original design]
 * in the same calm register.
 */

import type { BBLevel, ErrorTag, ReportVerdict } from './types';

/** Parent-facing verdict labels — the only vocabulary across the household. */
export const VERDICT_LABELS: Record<ReportVerdict, string> = {
  passed: 'Passed',
  one_more_round: 'One more round',
  escalated: 'Extra support',
};

/** The acknowledge microcopy (canonical; {child} slot filled at render). */
export function ackLabel(childName: string): string {
  return `Seen it — ${childName} will know their week counted`;
}

/** The 85% gate explainer (canonical). */
export const GATE_EXPLAINER = "we call it mastered at 85%+ — stricter than school, on purpose.";

/**
 * DD7 tags in parent language, each with the program's plan (PARENT-FLOWS
 * Flow 5's fixed glosses).
 */
export const TAG_GLOSSES: Record<ErrorTag, { gloss: string; plan: string }> = {
  'fact-recall': {
    gloss: "a math fact that isn't automatic yet",
    plan: 'Warm-ups and optional sprints will resurface it until it comes for free.',
  },
  'procedure-slip': {
    gloss: 'knows the idea, skips a step under load',
    plan: 'Practice that points at the exact step, so the habit locks in.',
  },
  'concept-misconception': {
    gloss: 'a rule that needs rebuilding',
    plan: 'A short micro-reteach with the concrete model, then brand-new problems.',
  },
  'representation-misread': {
    gloss: 'misread the picture or graph, not the math',
    plan: 'Read-the-model-first practice before any computing starts.',
  },
  'task-comprehension': {
    gloss: 'answered a different question than asked',
    plan: 'Restate-the-task practice: say what the problem wants before solving it.',
  },
};

/** The PatternsView standing footer (canonical framing). */
export const PATTERNS_FOOTER =
  "You don't need to fix any of this — it's ours. If you want to help, Coach corner has tonight's two lines.";

/**
 * DD2 parent-only level↔age context sentences (the child sees only the
 * neutral letter). [original design], from CURRICULUM-MAP's band framing.
 */
export const LEVEL_CONTEXT: Record<BBLevel, string> = {
  A: 'Level A builds early number sense — counting, comparing, and first joining and taking-away stories (usually ages 4–6).',
  B: 'Level B builds numbers to 120 and real addition and subtraction with place value (usually ages 6–8).',
  C: 'Level C builds place value to 1,000, regrouping, and the first multiplication ideas (usually ages 7–9).',
  D: 'Level D builds multiplication, division, and fraction foundations (usually ages 8–10).',
  E: 'Level E builds fraction and decimal arithmetic and pre-algebra habits (usually ages 9–12).',
};

/** CoachCorner's fixed three-line etiquette footer (canonical). */
export const COACH_ETIQUETTE = [
  'Praise the move, not speed or smartness.',
  'Mid-"one more round," say "strengthening" — never "redo."',
  'Never quiz — ask to be taught.',
];
