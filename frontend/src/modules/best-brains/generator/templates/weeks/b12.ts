/**
 * Level B · Week 12 — "Time: hour & half hour" (conceptId: time-hour-half-hour).
 *
 * The Level-B v2 EXEMPLAR. FILL-ARCHITECTURE §4 row B12: anchor "the short hand
 * tells the hour story"; multi-step "(n/a — reads)"; error-analysis "reads the
 * long hand as the hour"; discrimination "the hand-swap trap"; Day-5 signature
 * "match times ↔ daily events; draw hands (figure R)".
 *
 * Family: `lib/clock.ts` at **'half' granularity** — o'clock and half past only,
 * and the two misconceptions its header assigns to this week: `hand-swap` (the
 * hands trade jobs) and `minute-as-hour` (the numeral the long hand points at,
 * read as the hour). `quarter-flip` belongs to B17 and `hour-drift` to C18; this
 * week never draws them, and `misreadTime` would refuse them anyway.
 *
 * The week's whole claim is that the two hands have DIFFERENT JOBS, and that the
 * short one carries the story, so the content is built to force that reading
 * rather than assert it:
 *  - at half past, the drawn hour hand genuinely sits BETWEEN two numerals
 *    (the renderer drifts it h·30 + m·0.5), so `whereIsShortHand` asks the child
 *    to say where it sits — the one page where the drift is the question, and
 *    the page that makes the hand-swap trap visible instead of asserted;
 *  - a generated discrimination whose every wrong option is a named
 *    misconception's real output (`misreadTime`), beside a generated
 *    error-analysis whose shown wrong time is the same machinery's output for
 *    `minute-as-hour` — QG-11 re-derives both from the item's own {h, m};
 *  - the Day-5 matching page builds its schedule OUT OF the misreads: the event
 *    a hand-swapper would choose is really on the plan, at the time that
 *    misconception really produces. Nothing on that page is invented.
 *
 * CONCEPT FAMILY (kit §A). Declared `'place-value'`, which is the honest bucket
 * for a reading/representation concept — the §4 recipe itself writes the
 * multi-step column "(n/a — reads)". Per the same rule the week composes with
 * strictly-prior-week skills (`usesPriorSkill: true`, documented in
 * `deepeningDelta`) and ships **three multi-step slots from two generators**, so
 * it clears the operation-family row (≥2 week-wide) as well as its own (≥1). A
 * Level-B week that genuinely cannot reach two should declare 'place-value' and
 * stop at one; this one can, so it does both.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Every clock is built from the
 * item's own drawn {h, m} — the same pair its answer is computed from — so the
 * face cannot disagree with the answer. Three postures, and the difference
 * matters:
 *  - "what time is it?" — the clock IS the question, so it shows the time and
 *    asserts it (`of:'time'`). Correct, not a giveaway: reading it is the task.
 *  - "draw the hands for half past 3" — `hands:'none'`. An empty face claims
 *    nothing, so it carries no assertion; the drawing is the child's.
 *  - the schedule/short-hand pages — the picture states a GIVEN (which minute
 *    mark the long hand has reached), asserted against the item's own `m`. It
 *    never asserts the answer, because the answer is an event or a position.
 *  The two multi-step pages show WHEN the block starts. On the hour chain that
 *  start IS `initN`, so the face asserts against it; on the duration chain the
 *  arithmetic never consumes the start, so that face asserts NOTHING rather than
 *  claim a coincidence (30 minutes past ≠ a 30-minute stretch).
 *
 * ⚠ NOT FULLY COMPUTABLE (FILL-ARCHITECTURE §7). "B12 draw-the-hands" ships its
 * computable core — the time written in numerals, code-computed by
 * `clock_set_hands_v1` — plus the flagged drawing, which is a manual-review
 * capture. No answer is faked for the drawing; the numerals are what is scored.
 *
 * KNOWN FAMILY LIMIT, recorded for B17/C18: `elapsedThenMore` collapses at
 * 'half'. Its granularity has two marks, so `requiresTwoMarks` passes, but the
 * draw can only produce start 0 → finish 30, making step one a subtraction of
 * zero. This week therefore writes its own chains and uses `clock_elapsed_v1`
 * only for the single honest question that granularity supports: how many
 * minutes an o'clock-to-half-past block lasts.
 *
 * Retrieval is backward-only into B2 (tens and ones), B3 (comparing), B4 (count
 * on) and B10 (adding tens) — the counting and tens work every schedule sum on
 * this week's pages runs on.
 */

import { asWarmup, classify } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, clock as clockFigure, clockAlt } from '../lib/figures';
import {
  digitalTime,
  drawHands,
  misreadClockEA,
  misreadTime,
  readClock,
  spokenTime,
  whichTimeChoice,
} from '../lib/clock';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B2 = { level: 'B' as const, week: 2 };
const B3 = { level: 'B' as const, week: 3 };
const B4 = { level: 'B' as const, week: 4 };
const B10 = { level: 'B' as const, week: 10 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Events — the context frames a time week actually needs.
//
// `contexts.ts` carries no time frames (clock.ts says so in its header), so
// nothing here can collide with another week's declared frames. The pools are
// split by WHEN they are plausible, because the Day-5 matching page puts a real
// hour beside every event: a six o'clock slot may hold football practice and may
// not hold the school assembly.
// ---------------------------------------------------------------------------

const SCHOOL_EVENTS = [
  'story time', 'the reading circle', 'the art lesson', 'the science lesson',
  'the class quiz', 'the school assembly', 'the spelling game',
] as const;

/** Events an after-school hour can honestly hold. */
const CLUB_EVENTS = ['football practice', 'swimming club', 'choir practice'] as const;

/**
 * Hours the school day runs, on a 12-hour face.
 *
 * A face carries no morning or afternoon, so the hour a story names is the only
 * thing keeping it believable: the school assembly cannot start at 5, and the
 * six o'clock slot on the Day-5 plan can only hold a club. Every generator in
 * this file that PRINTS an hour beside an event draws from a pool like this one.
 */
const SCHOOL_HOURS = [8, 9, 10, 11, 1, 2, 3] as const;

/** Sentence-initial form of an event name. */
const opens = (event: string): string => event[0].toUpperCase() + event.slice(1);

/** Two DIFFERENT school events, drawn together so one story cannot use one twice. */
const twoEvents = (r: Rng): [string, string] => r.shuffle([...SCHOOL_EVENTS]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// withFigure / withDrawnClock — attach a picture built from the item's OWN values.
//
// The shipped primitives have no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all work inside the returned closure,
// no new rng draw, prompt untouched (so the QG-1/QG-4 surface signature the
// guard registered is unchanged). `withFigure` rebuilds from the drafted item's
// `generator.params` — the very numbers the answer came from. `withDrawnClock`
// covers the case `discrimination()` creates: it emits no generator spec at all,
// so the draw closure posts what it drew into a one-slot box which the decorator
// reads immediately afterwards (`drawUniqueItem` returns the draft its LAST
// build call produced, so the box always holds that same draw).
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface DrawnTime {
  h: number;
  m: number;
  seed: number;
}

function timeSlot(): { last: DrawnTime | null } {
  return { last: null };
}

/** The posted draw, or a loud failure — never a silently different picture. */
function posted(box: { last: DrawnTime | null }, who: string): DrawnTime {
  if (!box.last) throw new Error(`b12/${who}: the draw posted no time to build the clock from`);
  return box.last;
}

/**
 * Give a choice item the clock it was drawn from, plus the generator spec that
 * pins the picture's params to the item's own draw. `clock_read_v1` is the
 * template that names them: it carries no `verifyFor`, so QG-11 does not try to
 * read a worked claim off an item that makes none (that machinery belongs to
 * `whichTimeChoice`, whose answer IS a time), while QG-13 still proves the face
 * shows the minute mark the item drew.
 */
function withDrawnClock(
  box: { last: DrawnTime | null },
  base: ItemGen,
  build: (t: DrawnTime) => BBFigure,
): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const drawn = posted(box, 'withDrawnClock');
    return {
      ...d,
      generator: { templateId: 'clock_read_v1', params: { h: drawn.h, m: drawn.m }, seed: drawn.seed },
      figure: build(drawn),
    };
  };
}

/**
 * Figure only, from the posted draw — for `multiStep`, which ships the op-chain
 * in its params but not the hour those minutes belong to. The item keeps its own
 * generator spec (the chain QG-5 re-derives the answer from).
 */
function withDrawnFigure(
  box: { last: DrawnTime | null },
  base: ItemGen,
  build: (t: DrawnTime) => BBFigure,
): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), figure: build(posted(box, 'withDrawnFigure')) });
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** B4 — counting on, the move every "how many hours later" question runs on. */
const wCountOn = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add',
    draw: (r) => {
      const start = r.int(8, 17);
      const hop = r.pick([2, 3] as const);
      const name = one(r);
      return {
        prompt: `${name} stands on ${start} on the number path. ${name} hops on ${countNoun(hop, 'steps')}. Where does ${name} land?`,
        answerValue: String(start + hop),
        templateId: 'count_on_v1',
        params: { start, hop },
        hints: [
          'Which way along the path do these hops go?',
          'Start on the number given, then count on one hop at a time.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B4,
);

/** B2 — tens and ones, so a two-digit number stays two parts, not two digits. */
const wTensOnes = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'pv-expand',
    draw: (r) => {
      const t = r.int(2, 9);
      const o = r.int(1, 9);
      return {
        prompt: `A number is built from ${countNoun(t, 'tens')} and ${countNoun(o, 'ones')}. Which number is it?`,
        answerValue: String(10 * t + o),
        templateId: 'tens_ones_riddle_v1',
        params: { t, o },
        hints: [
          'Which part of a two-digit number do the tens fill?',
          'Say the tens first, then drop the ones on the end.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  B2,
);

/** B10 — adding tens, the arithmetic the minute totals on Day 4 lean on. */
const wAddTens = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add',
    draw: (r) => {
      const shelf = r.int(21, 69);
      const more = 10 * r.int(1, 3);
      return {
        prompt: `A shelf holds ${countNoun(shelf, 'books')}. Then ${countNoun(more, 'more books')} arrive. How many books are on the shelf now?`,
        answerValue: String(shelf + more),
        templateId: 'add_within_100_v1',
        params: { a: shelf, b: more },
        units: 'books',
        hints: [
          'Do the books that arrive fill whole tens, or single ones?',
          'Count the tens on first, and leave the ones digit where it is.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B10,
);

/**
 * B3 — the number that sits BETWEEN two others. It is here for the obvious
 * reason (ordering keeps "earlier" and "later" honest) and for a quieter one:
 * "between" is the word this week needs for the short hand at half past, and a
 * child who has just used it on the number path meets it again on the face.
 */
const wBetween = asWarmup(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare',
    draw: (r) => {
      const a = r.int(21, 88);
      const name = one(r);
      return {
        prompt: `${name} is filling a number path. Which number sits between ${a} and ${a + 2}?`,
        answerValue: String(a + 1),
        templateId: 'number_between_v1',
        params: { a },
        hints: [
          'Which of the two numbers on the path comes first?',
          'Start on the smaller one and take a single step forward.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B3,
);

// ---------------------------------------------------------------------------
// Reading the face — the week's core act, in its two postures
// ---------------------------------------------------------------------------

/**
 * The anchor read (family generator). The clock shows the time and asserts it:
 * on "what time is it?" the picture IS the question, and its alt names where the
 * hands POINT, never what time that makes — so a child using a screen reader
 * does the same work as a child looking at the face.
 */
const readFace = readClock('half');

/**
 * Set the hands from a spoken time, then write it in numerals (family). The face
 * arrives empty (`hands:'none'`), so it asserts nothing: the drawing is the
 * child's, and it is the flagged manual part (FILL-ARCHITECTURE §7). The
 * numerals are the computable core.
 */
const setHands = drawHands('half');

/**
 * Metacognition, in the Level-B intro form. The B row of FILL-ARCHITECTURE names
 * it "will it pass 10?" predictions — the time version is a call the child can
 * make from ONE hand before reading anything: o'clock, or half past?
 *
 * The base is served ONLY through the wrapper (kit §E2.2): a generator used both
 * raw and wrapped ships two identical hint ladders, which spends two of the
 * three the dedup allows.
 */
const readHallBase = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'read-clock',
    draw: (r) => {
      const h = r.pick(SCHOOL_HOURS);
      const m = r.pick([0, 30] as const);
      const event = r.pick(SCHOOL_EVENTS);
      return {
        prompt: `[image: ${clockAlt(h, m)}] The hall clock shows when ${event} begins. Write that time in numerals.`,
        answerValue: digitalTime(h, m),
        templateId: 'clock_read_v1',
        params: { h, m },
        validation: 'short-text-keyword',
        acceptableForms: [spokenTime(h, m)],
        hints: [
          'Which of the two hands moves right round the face in one hour?',
          'Write the hour the short hand has passed, then the minutes the long hand shows.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  (p) => clockFigure({ h: numOf(p, 'h'), m: numOf(p, 'm') }, { marks: 'five', asserts: { of: 'time', equals: 'answer' } }),
);

const predictOClockOrHalf = withEstimateFirst(
  readHallBase,
  "is this an o'clock, or a half past?",
);

/**
 * How long an o'clock-to-half-past block lasts. The answer is the same every
 * time — deliberately: at this granularity the face has exactly ONE gap, and
 * naming it ("half an hour is 30 minutes") is the fact Day 4's minute totals are
 * built out of. What varies is the hour and the story, so no page repeats.
 *
 * The answer is a COUNT of minutes, not a time, so QG-5 re-derives it through
 * `clock_elapsed_v1`. The picture shows the START and asserts the minute mark it
 * is drawn at against the item's own `m`.
 */
const halfHourMinutes = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'elapsed-time',
    draw: (r) => {
      const h = r.pick(SCHOOL_HOURS);
      const event = r.pick(SCHOOL_EVENTS);
      return {
        prompt: `[image: ${clockAlt(h, 0)}] ${opens(event)} begins at ${h} o'clock, the time on the clock. It ends at half past ${h}. How many minutes does it last?`,
        answerValue: '30',
        templateId: 'clock_elapsed_v1',
        params: { h, m: 0, m2: 30 },
        units: 'minutes',
        hints: [
          'How far round the face does the long hand travel between those two times?',
          'Count on round the face in fives, from the top down to the long hand.',
        ],
        errorTags: ['task-comprehension', 'representation-misread'],
      };
    },
  }),
  (p) => clockFigure({ h: numOf(p, 'h'), m: numOf(p, 'm') }, { marks: 'five', asserts: assertsParam('m', 'minutes-past') }),
);

// ---------------------------------------------------------------------------
// Discrimination — the hand-swap trap, twice, from opposite sides
// ---------------------------------------------------------------------------

/**
 * "Which time does this clock show?" (family). Every wrong option is a named
 * misconception's genuine output: the hands swapped (half past 3 → 6:15) and the
 * long hand's numeral read as the hour (→ 6:00). The item carries
 * `clock_verify_time_v1`, so QG-11 recomputes the truth from the same {h, m} the
 * face is drawn from and proves the option keyed correct is the one the clock
 * actually shows.
 */
const whichTime = whichTimeChoice('half', ['hand-swap', 'minute-as-hour']);

/**
 * The other side of the same trap, and the page that makes it REAL: at half
 * past, where is the short hand?
 *
 * The renderer drifts the hour hand with the minutes, so on this face it truly
 * sits between two numerals — the child answers by looking, not by recalling a
 * rule. Both wrong options are the week's two misconceptions in their positional
 * form: the hand that "waits" on its number (so half past reads as an o'clock),
 * and the hand put where the LONG hand points (the swap itself).
 *
 * The alt names the TIME, which the prompt already states, and not the hand
 * positions — those are the question here, which is exactly the reason the
 * family's position-naming alt cannot be reused on this item.
 *
 * 5 and 6 are left out of the draw so the trap stays diagnostic: at half past 5
 * the short hand really is beside the 6, and "straight at the 6" would then be a
 * near-miss of position rather than the hand-swap it is meant to catch.
 */
const SHORT_HAND_HOURS = [1, 2, 3, 4, 7, 8, 9, 10, 11] as const;

const shortHandBox = timeSlot();
const whereIsShortHand = withDrawnClock(
  shortHandBox,
  discrimination({
    variant: 'structural',
    cognitiveOp: 'hand-position',
    draw: (r) => {
      const h = r.pick(SHORT_HAND_HOURS);
      const next = h + 1;
      shortHandBox.last = { h, m: 30, seed: r.uint() };
      return {
        prompt: `[image: a clock face showing half past ${h}, with both hands drawn] This clock shows half past ${h}. Where is the short hand sitting?`,
        correct: `between the ${h} and the ${next}`,
        distractors: [
          {
            text: `straight at the ${h}`,
            errorTag: 'concept-misconception',
            rationale: 'Holds the short hand on its number until the hour is over, but it creeps round the face all hour long.',
          },
          {
            text: 'straight at the 6',
            errorTag: 'representation-misread',
            rationale: 'Puts the short hand where the LONG hand points — the two hands have traded jobs.',
          },
        ],
        hints: [
          'Does the short hand jump from number to number, or creep round the face?',
          'Find the two numbers the short hand sits between. Name the one it has passed.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  (t) =>
    clockFigure(t, {
      marks: 'five',
      highlight: 'hour',
      alt: `a clock face showing half past ${t.h}, with both hands drawn and the short hand picked out`,
      asserts: assertsParam('m', 'minutes-past'),
    }),
);

// ---------------------------------------------------------------------------
// The Day-5 signature — match a time to the day's events
//
// The schedule is BUILT from the misreads, so every wrong option is an event
// that really is on the plan, at the time a named misconception really produces
// (`misreadTime`). The child who reads the long hand's 6 as the hour picks the
// six o'clock club; the child who reads the short hand and stops picks the event
// half an hour earlier. Nothing on the page is invented, and nothing implausible
// is scheduled: the six o'clock slot only ever holds an after-school club.
// ---------------------------------------------------------------------------

const scheduleBox = timeSlot();
const matchSchedule = withDrawnClock(
  scheduleBox,
  discrimination({
    variant: 'structural',
    cognitiveOp: 'match-time-event',
    draw: (r) => {
      const h = r.pick(SCHOOL_HOURS);
      // The long hand's numeral, read as an hour — computed, never assumed to be 6.
      const asHour = misreadTime(h, 30, 'minute-as-hour').h;
      const [now, earlier] = twoEvents(r);
      const club = r.pick(CLUB_EVENTS);
      // WHICH OF THE THREE PLAN TIMES THE CLOCK SHOWS NOW ROTATES.
      //
      // The face used to be half past h on every draw, so the answer was always
      // the SECOND event on the plan — measured at 800/800 exposures. Every
      // per-pack gate passed it and the keyed text looked healthy (seven
      // different events across the seeds); what was constant was the answer's
      // RANK on the page, which is exactly what a child notices. Found by
      // scripts/bb-answer-entropy-test.ts once it learned to measure that.
      //
      // The half-past branch is kept as the common case BECAUSE its two
      // distractors are exact misreads of this face — the long hand's 6 read as
      // an hour, and the short hand read alone. The two o'clock branches cannot
      // borrow those rationales, so they carry their own honest ones rather than
      // reusing a misread that does not apply to the face on the page.
      const branch = r.int(1, 4); // 1–2 half past, 3 the earlier hour, 4 the club hour
      const shownM = branch <= 2 ? 30 : 0;
      const shownH = branch === 4 ? asHour : h;
      scheduleBox.last = { h: shownH, m: shownM, seed: r.uint() };
      const keyed = branch <= 2 ? now : branch === 3 ? earlier : club;
      const OTHERS: Record<string, { text: string; errorTag: 'representation-misread' | 'concept-misconception' | 'task-comprehension'; rationale: string }[]> = {
        halfPast: [
          {
            text: club,
            errorTag: 'representation-misread',
            rationale: 'Reads the numeral the long hand points at as the hour, so this face is taken for six o\'clock.',
          },
          {
            text: earlier,
            errorTag: 'concept-misconception',
            rationale: 'Reads the hour off the short hand and stops there, so the half hour the long hand shows is never counted.',
          },
        ],
        earlierHour: [
          {
            text: now,
            errorTag: 'concept-misconception',
            rationale: 'Counts a half hour the long hand has not travelled yet, though it is still pointing straight up.',
          },
          {
            text: club,
            errorTag: 'task-comprehension',
            rationale: 'Picks a time from further down the plan without holding it against the hands on the face.',
          },
        ],
        clubHour: [
          {
            text: earlier,
            errorTag: 'task-comprehension',
            rationale: 'Matches the first line of the plan rather than the time the hands are showing.',
          },
          {
            text: now,
            errorTag: 'concept-misconception',
            rationale: 'Reads this face as a half past, though the long hand is pointing straight up.',
          },
        ],
      };
      return {
        // The plan runs in time order — h o'clock, half past h, the club at six —
        // so ordering the day is part of the page, not a separate exercise.
        prompt: `[image: ${clockAlt(shownH, shownM)}] Today's plan: ${earlier} at ${h} o'clock. Then ${now} at half past ${h}. Then ${club} at ${asHour} o'clock. The hall clock shows the time now. Which one starts now?`,
        correct: keyed,
        distractors: OTHERS[branch <= 2 ? 'halfPast' : branch === 3 ? 'earlierHour' : 'clubHour'],
        hints: [
          'Is the long hand pointing straight up, or straight down?',
          'Name the time on the clock first. Then hunt for that time in the plan.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  (t) => clockFigure(t, { marks: 'five', asserts: assertsParam('m', 'minutes-past') }),
);

// ---------------------------------------------------------------------------
// Multi-step — time composed with a strictly-prior-week skill (kit §A)
// ---------------------------------------------------------------------------

/** Starts a two-block morning or afternoon can hold without running past the 12. */
const HOUR_CHAIN_STARTS = [8, 9, 10, 1, 2] as const;

/**
 * The stretch pairs a minute total may use. At most one of them is a whole hour,
 * so the biggest total this week can print is 110 minutes — inside the numbers
 * to 120 a Level-B child owns from B1, which a 60 + 60 pair would leave behind.
 */
const STRETCH_PAIRS = [[30, 30], [30, 60], [60, 30]] as const;

/** Starts an after-school stretch of up to two hours can still sit inside. */
const MINUTE_CHAIN_STARTS = [8, 9, 10, 1] as const;

/**
 * Read the hour, then count on hours (composes B4 count-on). The clock hands the
 * child the start, the prose states it, and two stretches of the day are added
 * on — so the picture asserts against `initN`, the quantity it really shows.
 *
 * The draw keeps the finish inside the same face: the lengths are chosen first,
 * then the start is picked from the plausible hours that still land on or before
 * the 12 — so no story ever runs past the top and asks a six-year-old to begin
 * again at 1. Deterministic, and no redraw loop (kit §E2.4).
 */
const msHourCountOn = withFigure(
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const first = r.pick([1, 2] as const);
      const second = r.pick([1, 2] as const);
      const h = r.pick(HOUR_CHAIN_STARTS.filter((s) => s + first + second <= 12));
      const [openEvent, nextEvent] = twoEvents(r);
      return {
        prompt: `[image: ${clockAlt(h, 0)}] ${opens(openEvent)} begins at ${h} o'clock, the time on the clock. It lasts ${countNoun(first, 'hours')}. ${opens(nextEvent)} then lasts ${countNoun(second, 'hours')} more. At which hour does ${nextEvent} finish?`,
        initN: h,
        steps: [
          { op: 'add', n: first, d: 1 },
          { op: 'add', n: second, d: 1 },
        ],
        acceptableForms: [`${h + first + second} o'clock`, digitalTime(h + first + second, 0)],
        hints: [
          'Which hour does the day start from here, and how far does it move on?',
          'Count the hours on round the face one at a time. Stop where the story stops.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => clockFigure({ h: numOf(p, 'initN'), m: 0 }, { marks: 'five', asserts: assertsParam('initN') }),
);

/**
 * Order two events, then total the minutes (composes B10 adding tens). Half an
 * hour arrives as the 30 minutes the o'clock-to-half-past item measured, so the
 * two pages are one idea.
 *
 * The clock shows when the block begins. That start is a GIVEN the chain never
 * consumes, so this face asserts NOTHING: a "30 minutes past" mark is not a
 * "30-minute stretch", and pinning one to the other would be a coincidence
 * dressed as a proof.
 */
const minuteTotalBox = timeSlot();
const msMinuteTotal = withDrawnFigure(
  minuteTotalBox,
  multiStep({
    situationType: 'combine',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const [firstLen, secondLen] = r.pick(STRETCH_PAIRS);
      const tidy = r.pick([10, 15, 20] as const);
      const h = r.pick(MINUTE_CHAIN_STARTS);
      const [openEvent, nextEvent] = twoEvents(r);
      minuteTotalBox.last = { h, m: 30, seed: 0 };
      return {
        prompt: `[image: ${clockAlt(h, 30)}] ${opens(openEvent)} begins at the time on the clock. It lasts ${countNoun(firstLen, 'minutes')}. ${opens(nextEvent)} follows and lasts ${countNoun(secondLen, 'minutes')}. Tidying up then takes ${countNoun(tidy, 'minutes')}. How many minutes pass from the start until the tidying up is done?`,
        initN: firstLen,
        steps: [
          { op: 'add', n: secondLen, d: 1 },
          { op: 'add', n: tidy, d: 1 },
        ],
        units: 'minutes',
        hints: [
          'Does the question ask about one part of the plan, or about all of it?',
          'Join the first stretch to the one after it, then bring in the last stretch.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (t) => clockFigure(t, { marks: 'five' }),
);

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both times)
//
// The recipe's error: the long hand read as the hour. `misreadTime` computes
// what that child really writes (half past 3 → "6:00"), the prompt shows that
// value, and the true time is code-computed — neither can be fabricated. The
// clock stays on the page because it is the evidence the child argues from.
// ---------------------------------------------------------------------------

const misreadEA = misreadClockEA('minute-as-hour', 'half');

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB12 = makeWeekBuilder({
  level: 'B',
  week: 12,
  conceptId: 'time-hour-half-hour',
  conceptName: 'Time: hour & half hour',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B2, B4, B10],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the short hand tells the hour story',
  conceptFamily: 'place-value',
  deepeningDelta:
    'Reading a clock is a new representation, not a new operation, so the week has no two-step of its own to give. It borrows one: the hour chain counts on from the hour the clock hands over (B4 count on and count back), and the minute total adds whole tens of minutes end to end (B10 adding tens). Both are marked usesPriorSkill — the new load is the reading, never the arithmetic.',
  explanation: {
    hook:
      'Two hands, one face, and they do not do the same job. One sweeps right round while the other barely moves — and the slow one is the one that tells you the hour.',
    whyBeforeHow:
      'A clock has two hands because it has two things to tell you, and the short hand tells the hour story because it is the one that walks the whole day. It leaves the 3, creeps along, and only reaches the 4 when the hour is over. So when the short hand sits between two numbers, the hour is the one it has already passed. The long hand tells the rest of the story: straight up means no minutes have gone by, and straight down means half an hour has. Swap the two hands and you get a real time on a real clock — just not this one.',
    script: [
      {
        say: 'Watch me read this clock. I find the short hand first, every time. It points straight at the 3, so my hour is three. Now the long hand: straight up at the 12, so no minutes yet. Three o\'clock.',
        visual: 'A clock face with the short hand at the 3 and the long hand straight up.',
        figure: clockFigure({ h: 3, m: 0 }, { marks: 'five' }),
      },
      {
        say: 'Now half an hour goes by. Look what the short hand did — it did not wait on the 3. It crept along, and it is sitting between the 3 and the 4. It has passed the 3, so the hour is still three.',
        visual: 'The same clock at half past three: the short hand between the 3 and the 4, the long hand straight down.',
        figure: clockFigure({ h: 3, m: 30 }, { marks: 'five', highlight: 'hour' }),
      },
      {
        say: 'Here is the trap I want you to see. If I let the hands trade jobs, I read the long hand as the hour. Then I get this face instead. It is a real time — but it is not the time on my clock.',
        visual: 'The face the swapped reading would make: a quarter past six.',
        figure: clockFigure({ h: 6, m: 15 }, { marks: 'five' }),
      },
      {
        say: 'So before I write anything down, I check one thing. Is the long hand straight up, or straight down? Straight up is an o\'clock. Straight down is a half past. If my answer does not match that, I read the wrong hand.',
        visual: 'Two faces side by side: long hand straight up, and long hand straight down.',
        figure: clockFigure({ h: 8, m: 30 }, { marks: 'five', highlight: 'minute' }),
      },
    ],
    summary:
      'Find the short hand first: the hour is the number it has passed. Then read the long hand: straight up is an o\'clock, straight down is half past. Half an hour is 30 minutes. Check the long hand before you write.',
    vocabulary: [
      { term: 'hour hand', kidGloss: 'the short hand — it tells you which hour you are in' },
      { term: 'minute hand', kidGloss: 'the long hand — it tells you how far into the hour you are' },
      { term: "o'clock", kidGloss: 'the long hand is straight up: a new hour has just started' },
      { term: 'half past', kidGloss: 'the long hand is straight down: half an hour, or 30 minutes, has gone by' },
    ],
  },
  guidedExamples: [
    {
      ...ge(12, 1, 'modeled', "A clock's short hand points straight at the 9. Its long hand points straight up at the 12. What time is it?", [
        {
          teacherSay:
            'Watch me. I hunt for the short hand first, because that is the hand with the hour story. It points straight at the 9, so I am in the ninth hour. I have not looked at the long hand yet, and I am not going to guess it.',
        },
        {
          teacherSay: 'Now the long hand. It points straight up, so no minutes have gone by. What time do I write?',
          expected: '9:00',
        },
      ], '9:00'),
      visual: 'A clock face with the short hand at the 9 and the long hand straight up.',
      figure: clockFigure({ h: 9, m: 0 }, { marks: 'five', asserts: assertsAnswer }),
    },
    {
      ...ge(12, 2, 'completion', "A clock's short hand sits between the 4 and the 5. Its long hand points straight down at the 6. What time is it?", [
        { teacherSay: 'The short hand has left one number and not reached the next. Which one has it passed?', expected: '4' },
        { childDo: 'Say where the long hand points, then name the whole time.', expected: '4:30' },
      ], '4:30'),
      visual: 'A clock face at half past four, the short hand between the 4 and the 5.',
      figure: clockFigure({ h: 4, m: 30 }, { marks: 'five', asserts: assertsAnswer }),
    },
    {
      ...ge(12, 3, 'prompted', 'Draw the hands on this clock to show half past 2. Then write that time in numerals.', [
        { childDo: 'Place the short hand between two numbers first, then swing the long hand round.', expected: '2:30' },
      ], '2:30'),
      visual: 'An empty clock face, numbers 1 to 12, no hands drawn yet.',
      figure: clockFigure({ h: 2, m: 30 }, { marks: 'five', hands: 'none' }),
    },
    {
      // Independent stage: the clock gives the START and nothing else. Working
      // out where the hours land IS the task, so the face shows only what the
      // child was handed.
      ...ge(12, 4, 'independent', 'Swimming club begins at 9 o\'clock, the time on the clock. It lasts 2 hours. Story time then lasts 1 hour more. At which hour does story time finish? Solve cold.', [
        { childDo: 'Count the hours on from the start, one stretch at a time.', expected: '12' },
      ], '12'),
      visual: 'A clock face at nine o\'clock — the start, not the finish.',
      figure: clockFigure({ h: 9, m: 0 }, { marks: 'five' }),
    },
  ],
  days: [
    // Day 1 — concept echo: read a face, build a face, and measure the one gap
    // this granularity has. Single-step only.
    [
      { gen: wCountOn, diff: 2 },
      { gen: wTensOnes, diff: 2 },
      { gen: readFace, diff: 2 },
      { gen: setHands, diff: 2 },
      { gen: halfHourMinutes, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first prediction, then both
    // sides of the hand-swap trap.
    [
      { gen: wBetween, diff: 2 },
      { gen: wAddTens, diff: 2 },
      { gen: predictOClockOrHalf, diff: 3 },
      { gen: whichTime, diff: 3 },
      { gen: whereIsShortHand, diff: 3 },
    ],
    // Day 3 — interleave: the two discriminations against the week's first
    // two-step and the matching page, so the page shape never signals the task.
    [
      { gen: wCountOn, diff: 2 },
      { gen: whichTime, diff: 4 },
      { gen: whereIsShortHand, diff: 4 },
      { gen: msHourCountOn, diff: 4 },
      { gen: matchSchedule, diff: 3 },
    ],
    // Day 4 — word problems: both two-steps beside the two single-step reads
    // they are built out of.
    [
      { gen: msHourCountOn, diff: 4 },
      { gen: msMinuteTotal, diff: 4 },
      { gen: halfHourMinutes, diff: 3 },
      { gen: readFace, diff: 3 },
    ],
    // Day 5 — the signature: the misread analysed, the day's events matched, the
    // hands drawn, and the claim that settles what the long hand means.
    [
      { gen: wAddTens, diff: 2 },
      { gen: misreadEA, diff: 4 },
      { gen: matchSchedule, diff: 3 },
      { gen: setHands, diff: 3 },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? When the long hand points straight up, the time is an o\'clock. Write one sentence saying how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Lets the hands change jobs from clock to clock, but the long hand means the same thing on every face.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads the hand at the top as the hour hand, so the top of the face stops meaning a fresh hour.',
            },
          ],
          hints: [
            'Picture the long hand pointing straight up — what kind of time is that?',
            'Try a few clocks of your own. Does the rule hold on every one?',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: if your child reads half past three as six o\'clock, do not start with the answer — point at the short hand and ask which number it has gone past. The short hand settles it every time, and a child who reads that hand first almost never swaps the two again. Real clocks beat worksheets here: the oven, the car, the one in the hall.',
  ],
  puzzle: (r) => {
    const h = r.pick([1, 2, 3, 4, 7, 8, 9, 10, 11] as const);
    const next = h + 1;
    const name = one(r);
    return {
      id: 'B12-PZ-01',
      title: 'Puzzle Grove: The Missing Long Hand',
      puzzleType: 'logic',
      prompt: `[image: a clock face with only the short hand drawn, sitting exactly halfway between the ${h} and the ${next}] ${name} rubbed out the long hand by mistake. Only the short hand is left, sitting exactly halfway between the ${h} and the ${next}. What time is it? Say how the short hand told you.`,
      figure: clockFigure(
        { h, m: 30 },
        {
          marks: 'five',
          hands: 'hour',
          alt: `a clock face with only the short hand drawn, sitting exactly halfway between the ${h} and the ${next}`,
          asserts: assertsAnswer,
        },
      ),
      answer: {
        value: digitalTime(h, 30),
        acceptableForms: [spokenTime(h, 30)],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Which hour has the short hand already gone past?',
        'The short hand crosses one whole number every hour. What has half an hour done to it?',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
  // Reading the MINUTES off the hour hand is the reverse of every page this
  // week: two moves (name the hour it has passed, then read how far it has
  // crept), and a move no Day-1 item makes.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'hour-hand-deduction' },
  sprint: {
    skill: 'Adding tens — the arithmetic a day plan runs on',
    sourceWeek: B10,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_tens_2digit_v1',
    params: { baseRange: [21, 69], tensRange: [10, 30], noCross100: true },
  },
  mastery: [
    { gen: readFace, diff: 3 },
    { gen: msHourCountOn, diff: 3 },
    { gen: halfHourMinutes, diff: 3 },
    { gen: msMinuteTotal, diff: 4 },
    { gen: setHands, diff: 3 },
    { gen: matchSchedule, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the three single-step reads — name the time on a face, measure the o\'clock-to-half-past gap, and set the hands from a spoken time (the empty-face affordance preserved). 02/04: the two composed two-steps — count on the hours from the hour the clock gives, and total the minutes of two events plus the tidying up. 06: match the clock to the day\'s plan, with the misread events still on the plan. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'hands-swapped',
      description: 'Reads the long hand as the hour and the short hand as the minutes, so the two hands trade jobs.',
      exampleWrongAnswer: 'half past 3 read as 6:15',
      distractorRationale: 'Offer the time the two hands produce when their jobs are swapped.',
      reteachPointer: 'explanation/script[2] (the face the swapped reading would really make)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'hour-hand-waits',
      description: 'Believes the short hand stays on its number until the hour is over, so a half-past face is read as an o\'clock.',
      exampleWrongAnswer: 'half past 3 read as 3 o\'clock',
      distractorRationale: 'Offer the o\'clock reading of a half-past face, and the "straight at the hour" hand position.',
      reteachPointer: 'explanation/script[1] (the short hand crept between the two numbers)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'time-for-minutes',
      description: 'Answers a "how many minutes" question with a time of day, or stops at the first stretch of a two-part plan.',
      exampleWrongAnswer: 'a "how many minutes does it last?" question answered "half past 9"',
      distractorRationale: 'Offer a time of day where the question asked for a count of minutes.',
      reteachPointer: 'guidedExamples/B12-GE-04 (count the stretches on, and stop where the story stops)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'hour-count-slip',
      description: 'Chooses the right move but loses the thread while counting the hours on, landing one hour short or one over.',
      exampleWrongAnswer: 'two hours on from 9 o\'clock counted as 10 o\'clock',
      distractorRationale: 'Offer the hour one short of the true finish.',
      reteachPointer: 'guidedExamples/B12-GE-04 (say the hours out loud, one at a time), then the 2-minute adding-tens sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Telling the time to the hour and the half hour — finding the short hand first and reading the hour it has passed, reading the long hand for o\'clock or half past, drawing the hands, and matching times to the events of a day.',
    improvingCandidates: [
      'finding the short hand first and naming the hour it has passed',
      'reading the long hand for an o\'clock or a half past',
      'matching a time on a clock to an event in the day',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'keeping the two hands\' jobs apart — the short hand names the hour, and swapping them makes a real time on the wrong clock',
      },
      {
        errorTag: 'concept-misconception',
        text: 'noticing that the short hand creeps all hour long, so at half past it sits between two numbers',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was asked — a count of minutes is not a time of day',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked the short hand first and named the hour it had passed before you read the minutes — that is exactly the habit this week is built on.',
      questionForChild: 'The short hand is between the 5 and the 6 and the long hand is straight down. What time is it, and which hand told you the hour?',
      schoolSyncHook: 'If your child\'s class says "three thirty" rather than "half past three", tell us and we will match the words they hear.',
    },
    vocabularyForParent: [
      'hour hand (the short one — it names the hour it has passed)',
      'minute hand (the long one — straight up is an o\'clock, straight down is half past)',
      'half past (half an hour, or 30 minutes, after the hour)',
    ],
  },
});
