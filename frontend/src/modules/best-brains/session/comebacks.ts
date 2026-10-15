/**
 * comebacks — a question missed on a weekly check comes back later, with new
 * numbers, until he knows it (owner, 2026-10-15).
 *
 * WHY. The pass bar is 5 of 6. The owner's point: a child can miss for a reason
 * that is not the maths — on 2026-10-14 his son missed a 31-word hopscotch
 * question the app itself tagged "didn't understand what the question asked" —
 * so a week should not stall on one question, and a concept passed at 5 of 6 must
 * not quietly disappear either. A miss is a promise to come back to it. Before
 * this, the only later practice was the pack's own warm-ups: fixed in advance, the
 * same for every child, blind to what HE missed. And after a second missed
 * re-check the week simply stopped (the "a teacher will help" dead end).
 *
 * THE LEDGER is derived from the attempt log, like the review (checkReview.ts):
 * no new table. One entry per (week, check slot) ever missed on a check, at this
 * level — Form A, the first re-check and the second (whose ids run -MB-07..12)
 * all map to slots 1..6, so a skill missed twice in one week is one entry. A
 * review re-answer (`review: …`) is teaching, not evidence, and never counts.
 *
 * THE SCHEDULE: the first comeback is due 2 days after the miss, then 7 days
 * after a clean answer, then 21 days after the next. Clean = right on the FIRST
 * try with no hint showing. A miss sends it back to the 2-day step. It settles
 * after the third clean answer in a row — each on a different day by
 * construction, the last weeks after the miss (the "not forgotten" test). At most
 * COMEBACKS_PER_DAY are served on one day.
 *
 * THE QUESTION is built fresh each round from the week's own builder (the
 * freshForm.ts method): the same slot's template — same skill — at a derived
 * seed, kept only if it differs from every check question of that week and from
 * every earlier round's question (in the few weeks whose space for a skill is
 * that small, an older one — ComebackKind). Ids are `B4-CB-05-2` (week, slot, round): no
 * `-M` (the review's reader takes `%-M%`), no `-D<n>-` (the treasure chest's), so
 * no other reader of the log ever mistakes a comeback for its own row.
 */
import { buildShadowedPack } from '../generator/packGenerator';
import { distinctFrom, formBForCycle } from './freshForm';
import { REVIEW_PREFIX } from './checkReview';
import type { BBLevel, PackItem, WeeklyConceptPack } from '../types';

/** Days until the next comeback, by clean answers in a row (0, 1, 2). */
export const COMEBACK_STEPS_DAYS = [2, 7, 21] as const;
/** Comebacks served on one calendar day, at most. */
export const COMEBACKS_PER_DAY = 2;
/** Every served check form has six questions (bb-comeback-test asserts it). */
export const CHECK_FORM_SIZE = 6;

/** The attempt-log fields the ledger reads, across a level's packs. */
export interface LoggedAnswer {
  pack_id: string;
  item_id: string;
  answer: string;
  correct: boolean;
  attempt_no: number;
  hint_rungs_used: number;
  created_at: string;
}

export interface ComebackEntry {
  /** `B4:5` — week and check slot. */
  key: string;
  level: BBLevel;
  week: number;
  /** 1..6 */
  slot: number;
  /** The check question most recently missed in this slot, e.g. `B4-MB-05`. */
  originId: string;
  missedAt: string;
  /** Comeback rounds answered so far (the next one is rounds + 1). */
  rounds: number;
  /** Clean comebacks in a row since the last miss (0..3). */
  step: number;
  /** The last event: the miss, or the last comeback answer. */
  lastAt: string;
  settled: boolean;
  /** Local calendar day (YYYY-MM-DD) the next comeback is due; null once settled. */
  dueOn: string | null;
}

const CHECK_ID = /^([A-E])(\d{1,2})-M([AB])-(\d{2})$/;
const COMEBACK_ID = /^([A-E])(\d{1,2})-CB-(\d{2})-(\d+)$/;

const pad2 = (n: number) => String(n).padStart(2, '0');

export function comebackId(level: BBLevel, week: number, slot: number, round: number): string {
  return `${level}${week}-CB-${pad2(slot)}-${round}`;
}

export function parseCheckId(id: string): { level: BBLevel; week: number; form: 'A' | 'B'; slot: number } | null {
  const m = id.match(CHECK_ID);
  if (!m) return null;
  const n = Number(m[4]);
  // The second re-check re-mints its ids past the first set (-MB-07..12).
  const slot = n > CHECK_FORM_SIZE ? n - CHECK_FORM_SIZE : n;
  return { level: m[1] as BBLevel, week: Number(m[2]), form: m[3] as 'A' | 'B', slot };
}

export function parseComebackId(id: string): { level: BBLevel; week: number; slot: number; round: number } | null {
  const m = id.match(COMEBACK_ID);
  if (!m) return null;
  return { level: m[1] as BBLevel, week: Number(m[2]), slot: Number(m[3]), round: Number(m[4]) };
}

/** The LOCAL calendar day of an instant — the daily-unlock law's own clock. */
export function localDay(at: string | Date): string {
  const d = typeof at === 'string' ? new Date(at) : at;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return localDay(new Date(y, m - 1, d + n, 12));
}

/** Every slot ever missed on a check at `level`, with where its comebacks stand. */
export function comebackLedger(rows: LoggedAnswer[], level: BBLevel): ComebackEntry[] {
  const sorted = [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const byKey = new Map<string, ComebackEntry>();
  const lastCleanDay = new Map<string, string>();
  for (const r of sorted) {
    const check = parseCheckId(r.item_id);
    if (check) {
      if (check.level !== level || r.correct || r.answer.startsWith(REVIEW_PREFIX)) continue;
      const key = `${check.level}${check.week}:${check.slot}`;
      const prev = byKey.get(key);
      byKey.set(key, {
        key,
        level: check.level,
        week: check.week,
        slot: check.slot,
        originId: r.item_id,
        missedAt: r.created_at,
        rounds: prev?.rounds ?? 0,
        step: 0,
        lastAt: r.created_at,
        settled: false,
        dueOn: null,
      });
      lastCleanDay.delete(key);
      continue;
    }
    const cb = parseComebackId(r.item_id);
    // Only the FIRST answer of a round is evidence; the tries after a hint are teaching.
    if (!cb || cb.level !== level || r.attempt_no !== 1) continue;
    const e = byKey.get(`${cb.level}${cb.week}:${cb.slot}`);
    if (!e || e.settled || cb.round <= e.rounds) continue;
    e.rounds = cb.round;
    e.lastAt = r.created_at;
    const clean = r.correct && r.hint_rungs_used === 0;
    const day = localDay(r.created_at);
    if (!clean) {
      e.step = 0;
      lastCleanDay.delete(e.key);
    } else if (day !== lastCleanDay.get(e.key)) {
      // Two clean answers on one day are one day's evidence.
      e.step += 1;
      lastCleanDay.set(e.key, day);
    }
    e.settled = e.step >= COMEBACK_STEPS_DAYS.length;
  }
  return [...byKey.values()]
    .map((e) => ({
      ...e,
      dueOn: e.settled ? null : addDays(localDay(e.lastAt), COMEBACK_STEPS_DAYS[e.step]),
    }))
    .sort((a, b) => a.week - b.week || a.slot - b.slot);
}

/**
 * Today's comebacks: due ones, at most COMEBACKS_PER_DAY a day counting any
 * already answered today. Ones already under way come first (most overdue
 * first, so their spacing holds); then never-served ones, newest miss first.
 */
/** Serving order: under-way ones first, most overdue first; then never-served ones, newest miss first. */
export function comebackOrder(a: ComebackEntry, b: ComebackEntry): number {
  const started = Number(b.rounds > 0) - Number(a.rounds > 0);
  if (started !== 0) return started;
  return a.rounds > 0 ? (a.dueOn ?? '').localeCompare(b.dueOn ?? '') : b.missedAt.localeCompare(a.missedAt);
}

export function dueComebacks(ledger: ComebackEntry[], rows: LoggedAnswer[], now: Date = new Date()): ComebackEntry[] {
  const today = localDay(now);
  const servedToday = new Set<string>();
  for (const r of rows) {
    const cb = parseComebackId(r.item_id);
    if (cb && r.attempt_no === 1 && localDay(r.created_at) === today) servedToday.add(`${cb.level}${cb.week}:${cb.slot}`);
  }
  const room = Math.max(0, COMEBACKS_PER_DAY - servedToday.size);
  const due = ledger.filter((e) => !e.settled && e.dueOn !== null && e.dueOn <= today && !servedToday.has(e.key));
  due.sort(comebackOrder);
  return due.slice(0, room);
}

/** Seed for try `attempt` at round `round` of a slot: deterministic, apart from the re-check's seeds. */
export function comebackSeed(packSeed: number, slot: number, round: number, attempt: number): number {
  return (packSeed ^ Math.imul(0x85ebca6b, slot * 4096 + round * 64 + attempt + 1)) >>> 0;
}

/**
 * Tries per round. 12 (the re-check's number) left A14/A16/A24/B19/B21 slots short
 * on round 2 or 3 — one needed 51 — so a comeback looks further.
 */
const MAX_TRIES = 64;

/**
 * new    — a question he has never met: the rule.
 * older  — the week's whole space for this skill is used up (a handful of
 *          weeks: "partners of 5" has only so many), so a question he met longer
 *          ago comes back — never the one he missed, never last round's.
 * origin — the week has no builder (a fixture-only cell): the question he missed.
 */
export type ComebackKind = 'new' | 'older' | 'origin';

export interface ComebackQuestion {
  entry: ComebackEntry;
  item: PackItem;
  kind: ComebackKind;
}

/** Every check question a child of this week row can have met (Form A, both re-checks). */
export function checkItemsOf(pack: WeeklyConceptPack, packSeed: number, contentVersion: string | undefined): PackItem[] {
  return [
    ...pack.masteryCheck.formA,
    ...pack.masteryCheck.formB,
    ...formBForCycle(pack, packSeed, contentVersion, 2).items,
  ];
}

/** What a comeback needs to know about the question it brings back. */
export type ComebackOrigin = Pick<ComebackEntry, 'level' | 'week' | 'slot' | 'originId'>;

/**
 * Rounds 1..`upTo` of a slot's comebacks, in order, each kept apart from every
 * check question of the week and from the rounds before it. `pack`, `packSeed`,
 * `contentVersion` are the ORIGIN week's row, so a reload re-serves the same
 * questions. When the week's space for the skill is used up, see ComebackKind.
 */
export function comebackRounds(
  origin: ComebackOrigin,
  pack: WeeklyConceptPack,
  packSeed: number,
  contentVersion: string | undefined,
  upTo: number,
  checkItems: PackItem[] = checkItemsOf(pack, packSeed, contentVersion),
): Array<{ item: PackItem; kind: ComebackKind }> | null {
  const source = checkItems.find((i) => i.id === origin.originId);
  if (!source) return null;
  const formKey = origin.originId.includes('-MA-') ? 'formA' : 'formB';
  const want = source.generator?.templateId;
  const seen: PackItem[] = [...checkItems];
  const out: Array<{ item: PackItem; kind: ComebackKind }> = [];
  let previous: PackItem | null = null;
  for (let r = 1; r <= upTo; r++) {
    let pick: PackItem | null = null;
    const sameSkill: PackItem[] = [];
    for (let attempt = 0; attempt < MAX_TRIES && !pick; attempt++) {
      let candidate: PackItem | undefined;
      try {
        candidate = buildShadowedPack(origin.level, origin.week, comebackSeed(packSeed, origin.slot, r, attempt), contentVersion)
          .masteryCheck[formKey][origin.slot - 1];
      } catch {
        break; // no builder for this week (a fixture-only cell)
      }
      if (!candidate) continue;
      if (want && candidate.generator?.templateId !== want) continue;
      sameSkill.push(candidate);
      if (distinctFrom([candidate], seen)) pick = candidate;
    }
    let kind: ComebackKind = 'new';
    if (!pick) {
      const avoid: PackItem[] = previous ? [source, previous] : [source];
      pick = sameSkill.find((c) => distinctFrom([c], avoid)) ?? null;
      kind = pick ? 'older' : 'origin';
    }
    const id = comebackId(origin.level, origin.week, origin.slot, r);
    const chosen: PackItem = pick ?? source;
    seen.push(chosen);
    previous = chosen;
    out.push({ item: { ...chosen, id }, kind });
  }
  return out;
}

/** The question for an entry's next round (or round `round`). */
export function comebackQuestion(
  entry: ComebackEntry,
  pack: WeeklyConceptPack,
  packSeed: number,
  contentVersion: string | undefined,
  round: number = entry.rounds + 1,
): ComebackQuestion | null {
  const rounds = comebackRounds(entry, pack, packSeed, contentVersion, round);
  const last = rounds?.[round - 1];
  return last ? { entry, ...last } : null;
}
