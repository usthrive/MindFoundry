/**
 * G2 — analog clock reading, elapsed time (B12, B17, C18)
 *
 * Contract every family in this directory follows:
 *  - generators return an `ItemGen` (see lib/items.ts) and stamp `authorMeta`;
 *  - every computational item names a `templateId` registered in the array
 *    below, so QG-5 re-derives its answer from the same params the generator
 *    used and a wrong answer key is structurally impossible;
 *  - embedded-claim items (discrimination / error-analysis) register a
 *    `verifyFor` instead, which QG-11 calls the same way;
 *  - prose is interpolated ONLY through lib/format.ts, never a bare `${…}`;
 *  - figures come from lib/figures.ts and are built from the item's OWN drawn
 *    values, so QG-13 can prove the picture agrees with the answer.
 *
 * `registry.ts` spreads `CLOCK_TEMPLATE_DEFS`, so nothing else needs editing when
 * a template is added here.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS FAMILY SHIPS
 *
 *  read the face      `readClock(g)`            face → time      clock_read_v1
 *  set the hands      `drawHands(g)`            time → face      clock_set_hands_v1
 *  elapsed (1 step)   `elapsedMinutes(g)`       two times → mins clock_elapsed_v1
 *  elapsed (2 steps)  `elapsedThenMore(g)`      chain            d_multistep_rat_v1
 *  the misread trap   `whichTimeChoice(g, ms)`  discrimination   clock_verify_time_v1
 *  the misread shown  `misreadClockEA(m, g)`    error-analysis   clock_verify_time_v1
 *
 * `g` is the week's granularity: B12 reads hours and halves, B17 adds the
 * quarters, C18 goes to the single minute. The misconception set is chosen the
 * same way — `hand-swap` and `minute-as-hour` belong to B12, `quarter-flip` to
 * B17, `hour-drift` ("2:55 read as 3:55") to C18 — and `misreadTime` REFUSES to
 * apply a mode to a face it cannot describe rather than inventing a distractor.
 *
 * TIME IS NOT A NUMBER, which has two consequences worth stating plainly:
 *  - a time-valued answer validates as `short-text-keyword` ("3:30" or "half
 *    past 3"), which sits outside QG-5's numeric audit list. The registry entry
 *    is still the single source of the answer — every generator here computes it
 *    through `digitalTime`, the same function `clock_read_v1.answerFor` calls —
 *    but corpus-level re-derivation covers only the ELAPSED forms, whose answers
 *    are plain minute counts. Teaching QG-5 to audit a time-valued validation is
 *    a validator change, and belongs to whoever owns that file.
 *  - `format.ts` carries no time renderer, so `digitalTime` / `spokenTime` /
 *    `minutesPastPhrase` below are this family's single interpolation authority
 *    for a time, exactly as `fmtMoney` is for currency. They are the natural
 *    promotion into format.ts the moment a second family prints a time.
 */

import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import type { ItemDraft } from '../shared';
import { num, str, type AnswerDef, type VerifyDef, type VerifyResult } from './compute';
import { discrimination } from './discrimination';
import { errorAnalysis } from './erroranalysis';
import { clock as clockFigure, clockAlt } from './figures';
import { countNoun } from './format';
import { multiStep, type ItemGen } from './multistep';
import { situation } from './situations';

// ---------------------------------------------------------------------------
// Times — values, granularity, and this family's rendering authority
// ---------------------------------------------------------------------------

export interface Time {
  /** 1–12, as the face is read (never 0, never 13+). */
  h: number;
  /** 0–59. */
  m: number;
}

/** How finely a week's clocks are read (FILL-ARCHITECTURE §4/§5). */
export type ClockGranularity = 'hour' | 'half' | 'quarter' | 'five' | 'minute';

const FIVES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

/** The minute values a granularity may land on. */
export function minutesFor(g: ClockGranularity): number[] {
  switch (g) {
    case 'hour': return [0];
    case 'half': return [0, 30];
    case 'quarter': return [0, 15, 30, 45];
    case 'five': return [...FIVES];
    case 'minute': return Array.from({ length: 60 }, (_, i) => i);
  }
}

/** "3:05" — the numeral form, always two minute digits. */
export function digitalTime(h: number, m: number): string {
  return `${h === 0 ? 12 : h}:${String(m).padStart(2, '0')}`;
}

/** The next hour round the face (12 → 1). */
function nextHour(h: number): number {
  return h === 12 ? 1 : h + 1;
}

/**
 * How a child SAYS the time: "3 o'clock", "half past 3", "quarter to 4",
 * "20 minutes past 3", "5 minutes to 4". Minute counts go through `countNoun`,
 * so a one-minute gap never prints "1 minutes".
 */
export function spokenTime(h: number, m: number): string {
  if (m === 0) return `${h} o'clock`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 30) return `half past ${h}`;
  if (m === 45) return `quarter to ${nextHour(h)}`;
  if (m < 30) return `${countNoun(m, 'minutes')} past ${h}`;
  return `${countNoun(60 - m, 'minutes')} to ${nextHour(h)}`;
}

/**
 * "45 minutes past 3" — the always-counted form.
 *
 * `spokenTime` names the quarters and the half, which is right in prose but
 * makes the minute count vanish from the sentence. Where a prompt's FIRST stated
 * quantity has to BE the minutes past the hour — the multi-step chain below
 * starts there — this is the form that states it.
 */
export function minutesPastPhrase(h: number, m: number): string {
  if (m === 0) return `${h} o'clock`;
  return `${countNoun(m, 'minutes')} past ${h}`;
}

// ---------------------------------------------------------------------------
// The misreads — every distractor in this family is one of these, by name
// ---------------------------------------------------------------------------

/**
 * The four ways a child reads a clock wrong, each named by FILL-ARCHITECTURE:
 *
 *  hand-swap       reads the long hand as the hour and the short hand as the
 *                  minutes (B12's named trap: 3:30 → 6:15).
 *  minute-as-hour  reads the numeral the long hand points at as the hour and
 *                  stops there (B12's EA: 3:30 → "6 o'clock").
 *  quarter-flip    turns a quarter TO the coming hour into a quarter PAST it,
 *                  and back (B17: 3:45 → 4:15).
 *  hour-drift      the short hand has drifted almost to the next numeral, so
 *                  the hour is read one too far (C18: 2:55 → 3:55).
 */
export type ClockMisread = 'hand-swap' | 'minute-as-hour' | 'quarter-flip' | 'hour-drift';

/**
 * The time a child ACTUALLY lands on under `mode` — computed, never authored.
 *
 * It THROWS when the mode cannot describe this face (a hand-swap needs the long
 * hand on a numeral; a quarter-flip needs a quarter). A silent fallback would
 * ship a "distractor" no misconception produces, which is the exact failure
 * class the verify templates exist to make impossible.
 */
export function misreadTime(h: number, m: number, mode: ClockMisread): Time {
  const no = (why: string): never => {
    throw new Error(`clock misread '${mode}' does not apply to ${digitalTime(h, m)} — ${why}`);
  };
  switch (mode) {
    case 'hand-swap': {
      if (m === 0 || m % 5 !== 0) return no('the long hand is not on a numeral, so there is no hour to read from it');
      if (h > 11) return no('the short hand would have to become 60 minutes');
      if (m === h * 5) return no('the swap lands back on the same time');
      return { h: m / 5, m: h * 5 };
    }
    case 'minute-as-hour': {
      if (m === 0 || m % 5 !== 0) return no('the long hand is not on a numeral');
      return { h: m / 5, m: 0 };
    }
    case 'quarter-flip': {
      if (m === 15) return { h: h === 1 ? 12 : h - 1, m: 45 };
      if (m === 45) return { h: nextHour(h), m: 15 };
      return no('there is no quarter to flip');
    }
    case 'hour-drift': {
      if (m < 35) return no('the short hand has not drifted near the next numeral');
      return { h: nextHour(h), m };
    }
  }
}

/** True when `mode` describes a real misread of this face. */
function applies(t: Time, mode: ClockMisread): boolean {
  try {
    misreadTime(t.h, t.m, mode);
    return true;
  } catch {
    return false;
  }
}

/** One line of evidence per misconception, for the distractor's rationale. */
const MISREAD_RATIONALE: Record<ClockMisread, string> = {
  'hand-swap': 'The hands have traded jobs — the long hand read as the hour, the short hand as the minutes.',
  'minute-as-hour': 'The numeral the long hand points at, read as the hour and stopped there.',
  'quarter-flip': 'A quarter past and a quarter to have been swapped for one another.',
  'hour-drift': 'The short hand has nearly reached the next numeral, so the hour is read one too far.',
};

/**
 * The quarter flip runs BOTH ways — `misreadTime` turns a quarter-to into a
 * quarter-past and vice versa — so a rationale naming only one direction is
 * wrong for a teacher half the time. The generic line above is always true;
 * this names the actual direction when the drawn time settles it.
 */
function misreadRationale(mode: ClockMisread, m: number): string {
  if (mode !== 'quarter-flip') return MISREAD_RATIONALE[mode];
  return m === 45
    ? 'A quarter TO the coming hour turned into a quarter PAST the hour shown.'
    : 'A quarter PAST the hour shown turned into a quarter TO the coming hour.';
}

// ---------------------------------------------------------------------------
// Registered templates (QG-5 answers / QG-11 truths)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;

/** The drawn time, re-read from the item's own params — and never trusted blind. */
function readTime(p: Params): Time {
  const h = num(p, 'h');
  const m = num(p, 'm');
  if (!Number.isInteger(h) || h < 1 || h > 12) throw new Error(`clock: h=${h} is not a whole hour 1–12`);
  if (!Number.isInteger(m) || m < 0 || m > 59) throw new Error(`clock: m=${m} is not a whole minute 0–59`);
  return { h, m };
}

/** Minutes from `m` to `m2` inside ONE hour — the B17/C18 elapsed form. */
function elapsedWithinHour(p: Params): string {
  const { m } = readTime(p);
  const m2 = num(p, 'm2');
  if (!Number.isInteger(m2) || m2 < 0 || m2 > 59) throw new Error(`clock: m2=${m2} is not a whole minute 0–59`);
  if (m2 <= m) throw new Error(`clock_elapsed_v1: the finish (${m2}) must fall later in the SAME hour than the start (${m})`);
  return String(m2 - m);
}

/**
 * The true time, plus — when the params name a misconception — the time that
 * misconception really produces.
 *
 * One template serves both embedded-claim item types, and the ABSENCE of
 * `wrongMode` is what keeps them apart: a discrimination item must NOT return a
 * `wrong`, because QG-11 then requires the prompt to display it, and a
 * discrimination's wrong answers live in its options.
 */
function verifyTime(p: Params): VerifyResult {
  const { h, m } = readTime(p);
  const correct = digitalTime(h, m);
  if (p.wrongMode === undefined) return { correct };
  const w = misreadTime(h, m, str(p, 'wrongMode') as ClockMisread);
  return { correct, wrong: digitalTime(w.h, w.m) };
}

export const CLOCK_TEMPLATE_DEFS: Array<AnswerDef | VerifyDef> = [
  /** Read the face: {h,m} → "3:30". */
  { id: 'clock_read_v1', answerFor: (p) => { const t = readTime(p); return digitalTime(t.h, t.m); } },
  /** Set the hands from a spoken time, then write it: {h,m} → "3:30". */
  { id: 'clock_set_hands_v1', answerFor: (p) => { const t = readTime(p); return digitalTime(t.h, t.m); } },
  /** Elapsed minutes within one hour: {h,m,m2} → "35". */
  { id: 'clock_elapsed_v1', answerFor: elapsedWithinHour },
  /** The truth behind a clock claim: {h,m[,wrongMode]} → {correct[,wrong]}. */
  { id: 'clock_verify_time_v1', verifyFor: verifyTime },
];

// ---------------------------------------------------------------------------
// Drawing times
// ---------------------------------------------------------------------------

function drawTime(r: Rng, g: ClockGranularity): Time {
  return { h: r.int(1, 12), m: r.pick(minutesFor(g)) };
}

/**
 * An elapsed item needs two DIFFERENT marks inside one hour to run between.
 * At 'hour' granularity there is only the o'clock, so the week wants a coarser
 * item, not a broken one — say so when the generator is built rather than
 * failing on whichever seed first tries to draw the second time.
 */
function requiresTwoMarks(who: string, g: ClockGranularity): void {
  if (minutesFor(g).length < 2) {
    throw new Error(`${who}: '${g}' granularity has a single minute mark — elapsed time needs at least two (use 'half' or finer)`);
  }
}

/**
 * A time every one of `modes` can genuinely misread. Rejection sampling first
 * (so the draw stays varied), then a deterministic scan of the face — the
 * fallback matters because a seed that never happened to land on a workable time
 * would otherwise throw for one child's pack and not another's.
 */
function drawMisreadableTime(r: Rng, g: ClockGranularity, modes: readonly ClockMisread[]): Time {
  const ok = (t: Time) => modes.every((mode) => applies(t, mode));
  for (let i = 0; i < 40; i++) {
    const t = drawTime(r, g);
    if (ok(t)) return t;
  }
  for (const h of [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, 12]) {
    for (const m of minutesFor(g)) {
      if (ok({ h, m })) return { h, m };
    }
  }
  throw new Error(`clock: no ${g}-granularity time supports the misread(s) [${modes.join(', ')}]`);
}

// ---------------------------------------------------------------------------
// Figure attachment
//
// Both helpers exist to obey ONE rule: the picture is built from the values the
// answer came from, never from a second draw. They differ only in where those
// values can be read back from.
// ---------------------------------------------------------------------------

/**
 * Rebuild the picture from the item's own `generator.params` — the very object
 * QG-5 recomputes the answer from. Nothing can drift: for the figure to disagree
 * with the answer, the params would have to disagree with themselves.
 */
function withFigure(gen: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = gen(rng, guard, difficulty);
    if (!draft.generator) {
      throw new Error('clock/withFigure: the wrapped generator ships no generator.params to rebuild the picture from');
    }
    return { ...draft, figure: build(draft.generator.params) };
  };
}

/** A one-slot box holding what the draw closure drew. */
interface Slot<P> {
  last: P | null;
}

function slot<P>(): Slot<P> {
  return { last: null };
}

/**
 * The same rule where the factory does NOT ship the drawn values:
 * `discrimination()` emits no generator spec at all, and `multiStep()` ships the
 * op-chain but not the hour its minutes belong to. The draw closure posts what
 * it drew into `box`, which the decorator reads immediately afterwards —
 * `drawUniqueItem` returns the draft its LAST `build` call produced, so the box
 * always holds that same draw (a redraw overwrites it before it can be read).
 */
function withDrawn<P>(box: Slot<P>, gen: ItemGen, decorate: (drawn: P) => Partial<ItemDraft>): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = gen(rng, guard, difficulty);
    if (box.last === null) throw new Error('clock/withDrawn: the draw posted nothing to decorate from');
    return { ...draft, ...decorate(box.last) };
  };
}

// ---------------------------------------------------------------------------
// Contexts (kept small and time-shaped; the context-frame registry carries no
// time frames, so nothing here can collide with a week's declared frames)
// ---------------------------------------------------------------------------

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

const EVENTS = [
  'story time', 'choir practice', 'swimming', 'the reading circle', 'the school assembly',
  'the science lesson', 'football practice', 'the class quiz', 'the art lesson',
] as const;

/** Sentence-initial form of an event name. */
function opens(event: string): string {
  return event[0].toUpperCase() + event.slice(1);
}

// ---------------------------------------------------------------------------
// The generators
// ---------------------------------------------------------------------------

/**
 * Read the face (B12 hours/halves, B17 quarters, C18 to the minute).
 *
 * The clock IS the question here, so a figure showing the time is correct — what
 * it must not do is NAME the time, and `clockAlt` describes hand positions for
 * exactly that reason.
 */
export function readClock(g: ClockGranularity = 'quarter'): ItemGen {
  return withFigure(
    situation({
      situationType: 'measurement',
      cognitiveOp: 'read-clock',
      draw: (r) => {
        const { h, m } = drawTime(r, g);
        const who = r.pick(NAMES);
        const event = r.pick(EVENTS);
        return {
          prompt: `[image: ${clockAlt(h, m)}] ${who} looks up at the clock as ${event} begins. What time does the clock show?`,
          answerValue: digitalTime(h, m),
          templateId: 'clock_read_v1',
          params: { h, m },
          validation: 'short-text-keyword',
          acceptableForms: [spokenTime(h, m)],
          hints: [
            'Which hand is the shorter one? Which part of the time does that hand tell you?',
            'Say the hour from the short hand first. Then count round the face in fives for the minutes.',
          ],
          errorTags: ['representation-misread', 'concept-misconception'],
        };
      },
    }),
    (p) => {
      const t = readTime(p);
      return clockFigure(t, { marks: 'five', asserts: { of: 'time', equals: 'answer' } });
    },
  );
}

/**
 * Set the hands to a spoken time, then write it in numerals (B12/B17 Day-5).
 *
 * `hands:'none'` is the point: the drawing is the child's job, so the face
 * arrives empty — and an empty face claims nothing, which is why this is the one
 * figure in the family with no assertion. The written numerals are the
 * computable core; the drawing is the flagged part (FILL-ARCHITECTURE §7).
 */
export function drawHands(g: ClockGranularity = 'quarter'): ItemGen {
  return withFigure(
    situation({
      situationType: 'measurement',
      cognitiveOp: 'set-clock-hands',
      draw: (r) => {
        const { h, m } = drawTime(r, g);
        const who = r.pick(NAMES);
        return {
          prompt: `[image: ${clockAlt(h, m, 'none')}] ${who} needs a clock that shows ${spokenTime(h, m)}. Draw the two hands on the face, then write that time in numerals.`,
          answerValue: digitalTime(h, m),
          templateId: 'clock_set_hands_v1',
          params: { h, m },
          validation: 'short-text-keyword',
          acceptableForms: [spokenTime(h, m)],
          hints: [
            'Does the hour belong to the short hand or to the long one?',
            'Place the short hand on its number first. Then swing the long hand round to the minutes.',
          ],
          errorTags: ['representation-misread', 'procedure-slip'],
        };
      },
    }),
    (p) => {
      const t = readTime(p);
      return clockFigure(t, { marks: 'five', hands: 'none' });
    },
  );
}

/**
 * Elapsed minutes inside one hour (B17 schedules, C18's core).
 *
 * The answer is a COUNT of minutes, not a time, so it validates numerically and
 * QG-5 re-derives it. The picture shows the START — which the prose also states,
 * the model beside the symbols that is the B/C band's own scaffold — and asserts
 * the minutes it is drawn at against the item's `m`.
 */
export function elapsedMinutes(g: ClockGranularity = 'five'): ItemGen {
  requiresTwoMarks('elapsedMinutes', g);
  return withFigure(
    situation({
      situationType: 'measurement',
      cognitiveOp: 'elapsed-time',
      draw: (r) => {
        // THE DURATION IS DRAWN FIRST, then placed on the face.
        // Drawing the start mark uniformly and then a later mark uniformly is
        // not the same as drawing a uniform duration: a late start leaves almost
        // no room, so the shortest gap collects the mass of every cramped draw.
        // Measured on the five-minute face, "5 minutes" was the answer on 28.0%
        // of 3,000 draws against a 9.1% uniform share over the eleven durations
        // the item can reach — a child answering "five" without reading either
        // clock beat chance threefold. No repair loop was involved; the shape of
        // the draw did it, which is the quieter half of the nudge-collapse
        // family and worth naming separately.
        const pool = minutesFor(g);
        const last = pool[pool.length - 1];
        const step = pool[1] - pool[0];
        // The longest gap is excluded because it forces a start of :00, and a
        // start of :00 makes the finish time READ OUT the duration — drawing
        // durations uniformly without this took the answer-in-prompt rate from
        // roughly one draw in eleven to more than one in four. Starts of :00,
        // and starts that equal the duration, go for the same reason.
        const gap = r.pick(pool.filter((v) => v >= step && v < last));
        const starts = pool.filter((v) => v !== 0 && v !== gap && v + gap <= last);
        const m = r.pick(starts.length ? starts : pool.filter((v) => v !== 0 && v + gap <= last));
        const m2 = m + gap;
        // 12 is excluded so "the hour" never has to roll over in the prose; the
        // duration is excluded so the hour cannot print it either.
        const h = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((v) => v !== gap));
        const event = r.pick(EVENTS);
        return {
          prompt: `[image: ${clockAlt(h, m)}] ${opens(event)} begins at the time on the clock — ${spokenTime(h, m)}. It finishes at ${digitalTime(h, m2)}. How many minutes does it last?`,
          answerValue: String(m2 - m),
          templateId: 'clock_elapsed_v1',
          params: { h, m, m2 },
          units: 'minutes',
          hints: [
            'Is the question asking for a time of day, or for a number of minutes?',
            'Start at the first mark. Count on round the face until you reach the second one.',
          ],
          errorTags: ['task-comprehension', 'procedure-slip'],
        };
      },
    }),
    (p) => {
      const t = readTime(p);
      return clockFigure(t, { marks: 'five', asserts: { of: 'minutes-past', equals: 'param:m' } });
    },
  );
}

/**
 * Elapsed, then one more stretch — the gentle 2-step (B17 "schedule ordering",
 * C18 "elapsed within the hour (2-step)").
 *
 * The chain is `finish − start + extra`, every operand stated. That is why the
 * finish prints as "45 minutes past 3" and not "quarter to 4": the chain's
 * `initN` must BE the prompt's first stated quantity (the multiStep contract),
 * and the quarter-names hide the minute count. The pictured clock shows that
 * same finish and asserts against `initN`.
 */
export function elapsedThenMore(g: ClockGranularity = 'five'): ItemGen {
  requiresTwoMarks('elapsedThenMore', g);
  // Needs a start strictly after the hour AND a finish after that start, or
  // every draw degenerates. Said at construction time rather than failing on
  // whichever seed first tries it.
  {
    const starts = minutesFor(g).filter((v) => v > 0);
    if (starts.length < 2) {
      throw new Error(
        `elapsedThenMore: '${g}' granularity offers ${starts.length} mark(s) after the hour, so a two-stretch chain cannot avoid subtracting zero — the week wants a coarser item, not a broken one`,
      );
    }
  }
  const box = slot<Time>();
  return withDrawn(
    box,
    multiStep({
      situationType: 'multi-stage',
      cognitiveOp: 'elapsed-time',
      draw: (r) => {
        // A genuine two-step needs a start AFTER the hour. Starting at :00 makes
        // the first step "subtract zero" — a one-step problem wearing a
        // two-step label, which the gates cannot see because the arithmetic is
        // correct and the chain really does have two entries. Measured at
        // 'quarter' granularity before this fix: 41.6% of draws collapsed.
        const pool = minutesFor(g);
        const starts = pool.filter((v) => v > 0);
        const earliest = Math.min(...starts);
        const finishes = pool.filter((v) => v > earliest);
        const preferred = finishes.filter((v) => v >= 20);
        const m2 = r.pick(preferred.length ? preferred : finishes);
        const m = r.pick(starts.filter((v) => v < m2));
        const h = r.int(1, 11);
        const extra = r.pick([5, 10, 15, 20]);
        const event = r.pick(EVENTS);
        box.last = { h, m: m2 };
        return {
          prompt: `[image: ${clockAlt(h, m2)}] ${opens(event)} finishes at ${minutesPastPhrase(h, m2)}, the time on the clock. It began at ${digitalTime(h, m)}. Clearing up then takes ${countNoun(extra, 'minutes')}. How many minutes pass from the start until the clearing up is done?`,
          initN: m2,
          steps: [{ op: 'sub', n: m, d: 1 }, { op: 'add', n: extra, d: 1 }],
          units: 'minutes',
          hints: [
            'How many separate stretches of time does this question join together?',
            'Find the length of the first stretch, then add the stretch that follows it.',
          ],
          errorTags: ['task-comprehension', 'procedure-slip'],
        };
      },
    }),
    (t) => ({
      figure: clockFigure(t, { marks: 'five', asserts: { of: 'minutes-past', equals: 'param:initN' } }),
    }),
  );
}

/**
 * "Which time does this clock show?" — the misread trap as a CHOICE (B12/B17
 * Days 2–3; C18's hour-drift contrast).
 *
 * Every wrong option is a named misconception's real output (`misreadTime`), and
 * the item carries `clock_verify_time_v1`, so QG-11 recomputes the truth from the
 * same `{h,m}` the face is drawn from and proves the option keyed correct is the
 * one the clock actually shows.
 */
export function whichTimeChoice(
  g: ClockGranularity = 'quarter',
  modes: readonly ClockMisread[] = ['hand-swap', 'minute-as-hour'],
): ItemGen {
  if (modes.length === 0) throw new Error('whichTimeChoice: name at least one misread to trap');
  const box = slot<Time & { seed: number }>();
  return withDrawn(
    box,
    discrimination({
      variant: 'structural',
      cognitiveOp: 'read-clock',
      draw: (r) => {
        const { h, m } = drawMisreadableTime(r, g, modes);
        box.last = { h, m, seed: r.uint() };
        const correct = digitalTime(h, m);
        const seen = new Set<string>([correct]);
        const distractors: Array<{ text: string; errorTag: ErrorTag; rationale: string }> = [];
        for (const mode of modes) {
          const w = misreadTime(h, m, mode);
          const text = digitalTime(w.h, w.m);
          if (seen.has(text)) continue;
          seen.add(text);
          distractors.push({
            text,
            errorTag: mode === 'hour-drift' ? 'concept-misconception' : 'representation-misread',
            rationale: misreadRationale(mode, m),
          });
        }
        return {
          prompt: `[image: ${clockAlt(h, m)}] Which time does this clock show?`,
          correct,
          correctForms: [spokenTime(h, m)],
          distractors,
          hints: [
            'Which hand travels all the way round the face in one hour?',
            'Name the hour from the short hand, then the minutes from the long hand. Find that pair in the list.',
          ],
          errorTags: ['representation-misread', 'concept-misconception'],
        };
      },
    }),
    ({ h, m, seed }) => ({
      generator: { templateId: 'clock_verify_time_v1', params: { h, m }, seed },
      figure: clockFigure({ h, m }, { marks: 'five', asserts: { of: 'time', equals: 'answer' } }),
    }),
  );
}

/**
 * A misread shown and analysed (B12/B17/C18 Day 5).
 *
 * The wrong time in the prompt is `misreadTime`'s output for the named
 * misconception, recomputed by QG-11 from the same params: the displayed error
 * cannot be fabricated, and the true time cannot be keyed wrong. The clock stays
 * on the page because it is the evidence the child argues from.
 */
export function misreadClockEA(mode: ClockMisread = 'hand-swap', g: ClockGranularity = 'quarter'): ItemGen {
  return withFigure(
    errorAnalysis({
      verifyTemplateId: 'clock_verify_time_v1',
      cognitiveOp: 'read-clock',
      drawParams: (r) => {
        const { h, m } = drawMisreadableTime(r, g, [mode]);
        return { h, m, wrongMode: mode };
      },
      build: (v, p, r) => ({
        prompt: `[image: ${clockAlt(num(p, 'h'), num(p, 'm'))}] ${r.pick(NAMES)} looked at this clock and wrote ${v.wrong}.`,
        extension: 'Write the time the clock really shows, and say which hand was read first.',
        hints: [
          'Which of the two hands is the one that names the hour?',
          'Read each hand in turn, then compare what you get with what was written.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      }),
    }),
    (p) => {
      const t = readTime(p);
      return clockFigure(t, { marks: 'five', asserts: { of: 'time', equals: 'answer' } });
    },
  );
}
