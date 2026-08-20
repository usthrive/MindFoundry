/**
 * Best Brains-inspired module — parent-surface canonical copy (increment 5).
 *
 * Register per TEACHER-PERSONA §6.2 / SCREEN-SPECS appendix H parent strings:
 * verdict labels "Passed" / "One more round" ("Review"/"Failed" never
 * rendered); consistency lines effort-framed ("{n} practice days this week",
 * never "missed"); the mastery gate explained plainly (threshold from
 * constants); DD7 tags translated with
 * the program's own plan attached (diagnosis-and-treatment, never
 * symptoms-for-the-parent-to-treat). Everything uncited is [original design]
 * in the same calm register.
 */

import type { BBLevel, ErrorTag, ReportVerdict } from './types';
import { MASTERY_THRESHOLD_PCT } from './constants';

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

/** The mastery-gate explainer (canonical; threshold sourced from constants so copy cannot drift). */
export const GATE_EXPLAINER = `we call it mastered at ${MASTERY_THRESHOLD_PCT}%+ — stricter than school, on purpose.`;

/**
 * DD7 tags in parent language, each with the program's plan (PARENT-FLOWS
 * Flow 5's fixed glosses).
 */
export const TAG_GLOSSES: Record<ErrorTag, { gloss: string; plan: string }> = {
  'fact-recall': {
    gloss: "a math fact that isn't automatic yet",
    plan: 'Warm-ups and optional sprints keep facts like this in practice until they come for free.',
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

/**
 * The PatternsView standing footer.
 *
 * The original read "You don't need to fix any of this — it's ours. If you want
 * to help, Coach corner has tonight's two lines." That framing came from the
 * instructor-led model, where the adult at home is not teaching and the message
 * to them is reassurance. This product is used differently: children work
 * through it with Ms. Wren on their own, and the parent is a like-instructor —
 * welcome to help, never required to.
 *
 * So the reassurance stays (nothing here is the parent's job, and nothing
 * counts their involvement) and the door opens. "Either way" carries the whole
 * distinction between available and mandated.
 */
export const PATTERNS_FOOTER =
  "All of it is handled either way — none of it is waiting on you. Where something has become a pattern, there is a move above you can borrow.";

/**
 * One thing a parent can actually DO per DD7 tag — the counterpart to
 * `TAG_GLOSSES[tag].plan`, which says what the PROGRAM does.
 *
 * Keyed by tag rather than by week deliberately. A per-week, per-tag version
 * would be sharper ("count with him from 87 and stop at 90") but costs two or
 * three authored lines in every one of the 100+ cells; these five cover the
 * whole corpus the day they land, and the recurring-tag signal can tell us
 * later which handful of weeks earn the sharper treatment.
 *
 * Each is a MOVE, not advice: something to say or ask in under a minute, at the
 * table, with no materials. None of them asks a parent to teach a method —
 * that is Ms. Wren's job and a second method taught at home is how a child ends
 * up with two half-rules.
 */
export const TAG_PARENT_MOVE: Record<ErrorTag, string> = {
  'fact-recall':
    'Slip these into dead time — the car, the queue — a few at a time, and let him answer without racing. Facts come free with exposure, not effort.',
  'procedure-slip':
    'Ask him to say the next step out loud BEFORE he does it. Slips happen when the step goes silent, and saying it is the whole fix.',
  'concept-misconception':
    'Ask him to teach you the rule, then try one example together where it does NOT work. Rebuilding beats correcting — and he has to hear his own rule to hear the gap in it.',
  'representation-misread':
    'Before any arithmetic, ask him to tell you what the picture shows. If he can describe it, the maths usually follows on its own.',
  'task-comprehension':
    'Have him say what the question is asking in his own words before he starts. Most of these are answered correctly — just to a different question.',
};

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
