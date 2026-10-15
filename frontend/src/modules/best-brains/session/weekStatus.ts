/**
 * weekStatus — "where this week is at", for a week that has not moved forward
 * after Day 5 (owner, 2026-10-15: "include a call-out or a short summary … what
 * is going on and what is needed to move forward so that he can show me and then
 * as parent I can work with him").
 *
 * WHY. With every day tile green and no button to press, the child's home screen
 * said only "So close — just the renaming step is wobbly" (a canonical example
 * string that named the wrong skill for most weeks) and "Still strengthening:
 * <the mistake's adult slug>". Nothing said what had happened, what moving on
 * needs, or what a grown-up could do. The owner's son finished week 4's check 6
 * of 6, was held because Day 4's practice was 40%, then scored 4 of 6 on the
 * re-check — and none of that was on any screen he could show.
 *
 * Pure: the facts come from the week row (its mastery attempts and day
 * accuracies) and the pack; the misses of the latest sitting from the attempt
 * log. The child's lines carry counts, never a percent; the grown-up's lines carry
 * the numbers and dates, the questions missed with the child's own answers, and
 * one thing to do together.
 */
import { MASTERY_THRESHOLD_PCT, STABILITY_MIN_PCT } from '../constants';
import { promptText } from '../figures/prompt';
import { answerAsShown, checkMissesFrom, type AttemptRow } from './checkReview';
import { formBForCycle } from './freshForm';
import { COMEBACK_STEPS_DAYS } from './comebacks';
import type { ErrorTag, MasteryAttempt, PackItem, WeekState, WeeklyConceptPack } from '../types';

export type WeekStatusKind = 'held' | 'one-more-round' | 'second-round' | 'moved-on';

export interface CheckFact {
  form: 'A' | 'B';
  cycle: number;
  at: string;
  right: number;
  total: number;
  /** Practice days that held a passing check (LS1-R5), with their accuracy. */
  heldBy: Array<{ day: number; pct: number }>;
}

export interface WeekStatus {
  kind: WeekStatusKind;
  week: number;
  daysDone: number;
  checks: CheckFact[];
  total: number;
  /** Right answers out of `total` that move a week on. */
  needed: number;
  /** The next step is open today (false: it opens tomorrow). */
  nextReady: boolean;
  /** The latest sitting's most common mistake type. */
  tag?: ErrorTag;
  /** The pack's own question for the grown-up to ask (parentSummarySeed.homeFocus). */
  questionForChild?: string;
}

export interface StatusMiss {
  item: PackItem;
  answer: string;
}

function isToday(iso: string | undefined, now: Date): boolean {
  return !!iso && new Date(iso).toDateString() === now.toDateString();
}

/** The status of a week that is not moving forward; null for any other week. */
export function weekStatus(ws: WeekState, pack: WeeklyConceptPack, now: Date = new Date()): WeekStatus | null {
  if (ws.state !== 'near_miss_cycle1' && ws.state !== 'cycle2' && ws.state !== 'escalated') return null;
  const attempts: MasteryAttempt[] = ws.mastery.attempts ?? [];
  const last = attempts[attempts.length - 1];
  if (!last) return null;
  const total = pack.masteryCheck.formA.length;
  const needed = Math.ceil((MASTERY_THRESHOLD_PCT * total) / 100);
  const heldDays: Array<{ day: number; pct: number }> = [];
  for (const d of [2, 3, 4]) {
    const e = ws.dayProgress[String(d)];
    if (e?.state === 'done' && typeof e.accuracyPct === 'number' && e.accuracyPct < STABILITY_MIN_PCT) {
      heldDays.push({ day: d, pct: e.accuracyPct });
    }
  }
  const checks: CheckFact[] = attempts.map((a) => ({
    form: a.form,
    cycle: a.cycle,
    at: a.attemptedAt,
    right: Math.round((a.scorePct * total) / 100),
    total,
    heldBy: a.stabilityHold ? heldDays : [],
  }));
  const kind: WeekStatusKind =
    ws.state === 'escalated'
      ? 'moved-on'
      : ws.state === 'cycle2'
        ? 'second-round'
        : last.stabilityHold
          ? 'held'
          : 'one-more-round';
  const closedAt = kind === 'moved-on' ? (ws.mastery.escalatedAt ?? last.attemptedAt) : last.attemptedAt;
  return {
    kind,
    week: ws.week,
    daysDone: [1, 2, 3, 4, 5].filter((d) => ws.dayProgress[String(d)]?.state === 'done').length,
    checks,
    total,
    needed,
    nextReady: !isToday(closedAt, now),
    tag: last.dominantErrorTags?.[0],
    questionForChild: pack.parentSummarySeed?.homeFocus?.questionForChild,
  };
}

/** The questions of the latest sitting, so its misses are that sitting's alone. */
export function latestSittingItems(ws: WeekState, pack: WeeklyConceptPack): PackItem[] {
  const attempts = ws.mastery.attempts ?? [];
  const last = attempts[attempts.length - 1];
  if (!last || last.form === 'A') return pack.masteryCheck.formA;
  return formBForCycle(pack, ws.packSeed, ws.contentVersion, last.cycle).items;
}

/** The latest sitting's misses with the child's own answers (the review's reader). */
export function latestSittingMisses(rows: AttemptRow[], ws: WeekState, pack: WeeklyConceptPack): StatusMiss[] {
  const attempts = ws.mastery.attempts ?? [];
  const last = attempts[attempts.length - 1];
  if (!last) return [];
  const items = latestSittingItems(ws, pack);
  return checkMissesFrom(rows, last.form)
    .map((m) => ({ item: items.find((i) => i.id === m.itemId), answer: m.answer }))
    .filter((m): m is StatusMiss => !!m.item);
}

/** One thing to do together, by the latest sitting's mistake type (parent words). */
export const TRY_TOGETHER: Record<ErrorTag, string> = {
  'task-comprehension':
    'Read one story problem aloud together. Before any maths, ask them to say in their own words what the question wants.',
  'concept-misconception':
    'Act one out with objects or a drawn number line, then let them do the next one on their own.',
  'procedure-slip': 'Ask them to say each step out loud as they do it, then check the answer by going back.',
  'representation-misread': 'Before any maths, ask them to tell you what the picture shows.',
  'fact-recall': 'Two minutes of quick facts out loud, a few days this week.',
};

export interface StatusLine {
  mark: 'done' | 'fact' | 'goal' | 'next';
  text: string;
}

/** A missed question as the grown-up reads it; the card keeps its authored lines (whitespace-pre-line). */
export interface MissedLine {
  question: string;
  answer: string;
}

export interface StatusLines {
  title: string;
  child: StatusLine[];
  grownUp: Array<string | MissedLine>;
  /** What the read-aloud button says: the child's lines. */
  speak: string;
}

const shortDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function checkName(c: CheckFact): string {
  if (c.form === 'A') return 'Last page';
  return c.cycle >= 2 ? 'New questions, second try' : 'New questions';
}

/** The card's words. Child lines: counts, never a percent. Grown-up lines: the numbers. */
export function statusLines(s: WeekStatus, misses: StatusMiss[] = []): StatusLines {
  const child: StatusLine[] = [];
  child.push({
    mark: s.daysDone === 5 ? 'done' : 'fact',
    text: s.daysDone === 5 ? 'All 5 practice days done' : `${s.daysDone} of 5 practice days done`,
  });
  s.checks.forEach((c, i) => {
    const all = c.right === c.total;
    const latest = i === s.checks.length - 1;
    child.push({ mark: all ? 'done' : 'fact', text: `${checkName(c)}: ${all ? `all ${c.total} right!` : `${c.right} of ${c.total} right`}` });
    for (const h of c.heldBy) {
      child.push({
        mark: 'fact',
        text: latest
          ? `Day ${h.day}'s practice was tricky, so Ms. Wren wants one more look first.`
          : `Day ${h.day}'s practice was tricky, so Ms. Wren asked for one more look.`,
      });
    }
  });
  if (s.kind === 'moved-on') {
    child.push({ mark: 'next', text: 'This week is done for now — on to the next idea!' });
    child.push({ mark: 'next', text: 'The tricky questions will come back in warm-ups, with new numbers.' });
    child.push({ mark: 'next', text: s.nextReady ? 'The next idea is ready.' : 'The next idea opens tomorrow.' });
  } else {
    child.push({ mark: 'goal', text: `To move on: ${s.needed} of ${s.total} right on brand-new questions.` });
    child.push({
      mark: 'next',
      text:
        s.kind === 'second-round'
          ? `Next: one more practice round, then ${s.total} brand-new questions — the last try this week.`
          : `Next: a short practice round, then ${s.total} brand-new questions.`,
    });
    child.push({ mark: 'next', text: s.nextReady ? 'Ready now.' : 'It opens tomorrow.' });
  }

  const grownUp: Array<string | MissedLine> = [];
  for (const c of s.checks) {
    const name = c.form === 'A' ? 'Weekly check' : c.cycle >= 2 ? 'Second re-check' : 'Re-check';
    let line = `${shortDate(c.at)} · ${name}: ${c.right}/${c.total}`;
    if (c.heldBy.length) {
      line += ` — held: ${c.heldBy.map((h) => `Day ${h.day} practice was ${h.pct}%`).join(', ')} (every practice day needs ${STABILITY_MIN_PCT}%+)`;
    } else if (c.right < s.needed) {
      line += ` (moving on needs ${s.needed})`;
    }
    grownUp.push(line);
  }
  if (s.kind === 'moved-on') {
    grownUp.push(
      `After two practice rounds the week closes, so they keep moving. The missed questions come back as warm-ups with new numbers — in ${COMEBACK_STEPS_DAYS[0]} days, a week, then 3 weeks — until they are right each time without help.`,
    );
  }
  if (misses.length) {
    grownUp.push(`Missed on the last try (${misses.length}):`);
    for (const m of misses) {
      grownUp.push({ question: promptText(m.item.prompt).trim(), answer: answerAsShown(m.item, m.answer) || '(blank)' });
    }
  }
  if (s.tag) grownUp.push(`Try together: ${TRY_TOGETHER[s.tag]}`);
  const ask: string[] = [];
  if (s.questionForChild) ask.push(`“${s.questionForChild}”`);
  if (misses[0]) ask.push(`“How did you get ${answerAsShown(misses[0].item, misses[0].answer) || 'that'}?” — then let them check it with you.`);
  if (ask.length) grownUp.push(`Ask: ${ask.join(' ')}`);

  const title = s.kind === 'moved-on' ? `Week ${s.week}: on to the next idea` : `Week ${s.week}: what's next`;
  const speak = [title, ...child.map((l) => l.text)].join('. ').replace(/\.\./g, '.').replace(/!\./g, '!');
  return { title, child, grownUp, speak };
}
