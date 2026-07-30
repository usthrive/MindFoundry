/**
 * Level B · Week 17 — "Time: quarter hours" (conceptId: time-quarter-hours).
 *
 * FILL-ARCHITECTURE §4 row B17 (family G2, `lib/clock.ts`): anchor "the minute
 * hand's journey"; multi-step "schedule ordering"; error-analysis "quarter-to
 * read as quarter-past"; discrimination "quarter-past vs quarter-to"; Day-5
 * signature "order a day's schedule".
 *
 * Family: `lib/clock.ts` at **'quarter' granularity** — o'clock, quarter past,
 * half past, quarter to — and the one misconception its header assigns to this
 * week: `quarter-flip` (a quarter TO the coming hour turned into a quarter PAST
 * it). `hand-swap` and `minute-as-hour` belong to B12, `hour-drift` to C18; this
 * week never draws them, and `misreadTime` would refuse them on most of these
 * faces anyway.
 *
 * WHAT THIS WEEK ADDS TO B12, and why the addition is one idea and not two.
 * B12 read a face by NAMING two hand positions: straight up is an o'clock,
 * straight down is half past. Four fixed pictures, two of them, and the child
 * could memorise both. The quarters break that, because a quarter is a quarter OF
 * something — and the something is the minute hand's journey round the face. Once
 * the journey is the unit, "quarter past" and "quarter to" stop being two more
 * pictures and become two ways of measuring one trip: how much of it has gone,
 * and how much of it is left. That is also the first week in which a clock is
 * spoken BACKWARDS from the hour it is heading to, which is why the trap below is
 * this week's and no other's.
 *
 * THE TRAP, MADE REAL RATHER THAN ASSERTED. At quarter to four the long hand is
 * at the 9 and the short hand has crept three quarters of the way from the 3 to
 * the 4 — the renderer drifts it truly (h·30 + m·0.5), so on the page it very
 * nearly touches the 4. Everything about the picture invites "four", and the
 * quarter-flip is exactly what a child who accepts that invitation produces:
 * 3:45 read as 4:15. The week therefore shows the trap four different ways, each
 * one code-derived:
 *  - `whichTime` (family `whichTimeChoice`) — the flip as a forced two-way
 *    choice between 3:45 and 4:15, both of them `misreadTime`'s own values;
 *  - `spokenFormChoice` — the same face in WORDS, where the flip sits beside a
 *    second real error, the quarter counted from the wrong end (3:45 heard as
 *    quarter past 3): the quarter still to come read as the quarter already gone;
 *  - `eaQuarterFlip` (family `misreadClockEA`) — the flip shown and argued about,
 *    its wrong value recomputed by QG-11 from the item's own {h, m};
 *  - the Day-5 schedule, where "quarter to 11" has to be recognised as belonging
 *    to the ten o'clock hour before three activities can be put in order.
 *
 * CONCEPT FAMILY (kit §A). Declared **'operation'**, the stricter row, and met:
 * four genuine multi-step slots from two chains. B12 declared 'place-value'
 * because reading a clock had no two-step of its own to give and had to borrow
 * one; at the quarters that changes, because four marks in the hour make a stretch
 * something you MEASURE rather than recite. `msScheduleOrder` is the recipe's own
 * "schedule ordering" — three starts printed out of order, so the first move is to
 * FIND the earliest and no step can be read off the sentence order.
 * `msFillTheHour` is the same arithmetic posed the other way round: the first move
 * uncovers a length nobody states, and the second joins a stated one to it.
 *
 * Both chains are FLOORED so that neither step can be a no-op, and that floor is
 * the week's one substantive departure from the family — see `msFillTheHour`,
 * where the measurement that forced it is recorded. Every start on these pages is
 * a quarter mark, never the o'clock.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Every clock is built from the
 * item's own drawn {h, m} — the pair its answer is computed from — so the face
 * cannot disagree with the answer. Four postures:
 *  - "what time is it?" / "which of these names it?" — the clock IS the question,
 *    so it shows the time and asserts it. Reading it is the task, and `clockAlt`
 *    names where the hands POINT, never what time that makes.
 *  - "how far has the long hand travelled?" — the same sanctioned case with a
 *    different selector: the picture asserts its minutes-past against the answer,
 *    because the answer IS that reading.
 *  - "draw the hands for quarter to six" — `hands: 'none'`. An empty face claims
 *    nothing, so it carries no assertion; the drawing is the child's.
 *  - the two chains — the face states a GIVEN the prose also states (where the
 *    block starts, or the latest start on a mixed-up plan) and asserts it against
 *    the chain's own `initN`, never against the answer.
 *
 * ⚠ NOT FULLY COMPUTABLE (FILL-ARCHITECTURE §7). "B17 draw-the-hands" ships its
 * computable core — the time written in numerals, code-computed by
 * `clock_set_hands_v1` — plus the flagged drawing, a manual-review capture. No
 * answer is faked for the drawing; the numerals are what is scored. The Day-5
 * schedule-ordering production is `short-text-keyword` for the same reason.
 *
 * KNOWN FAMILY LIMITS, recorded for whoever owns `lib/clock.ts`. Three, each
 * found by reading generated pages rather than by a gate.
 *
 * 1. `elapsedThenMore` has no FLOOR on its start, so at 'quarter' 41.6% of draws
 *    begin at the o'clock and step one subtracts zero (measured over 200 packs).
 *    C18 reported the same missing floor from the other side — implausibly short
 *    events — and asked for a `minDuration` option. The same option fixes both:
 *    with a floor this week would use the family's chain instead of its own.
 *
 * 2. The `quarter-flip` distractor RATIONALE in the family
 *    ("A quarter TO the coming hour turned into a quarter PAST it") is written for
 *    one direction, but `misreadTime` flips both ways — at a quarter past it turns
 *    a PAST into a TO and carries the hour BACK. So the teacher-facing sentence
 *    describes only half of `whichTimeChoice`'s draws. Nothing the child sees is
 *    wrong; the diagnosis label is. A direction-aware rationale (this week writes
 *    one for its own version) would fix it.
 *
 * 3. `misreadClockEA`'s extension and hint ladder are written for a HAND error
 *    ("say which hand was read first", "which of the two hands names the hour?").
 *    That is exactly right for B12's hand-swap and it is only half of a
 *    quarter-flip, whose second half is directional — which SIDE of the hour the
 *    quarter sits on. It stays serviceable here (the wrong hour in 4:15 really
 *    does come from the short hand, so naming that hand is a genuine step), and
 *    the missing half is carried by `spokenFormChoice` and the Day-5 claim
 *    instead. A `mode`-aware extension would let this week's most important item
 *    ask its own question.
 *
 * Retrieval is backward-only into B12 (the same face one scale coarser), B13
 * (addition within 100) and B14 (subtraction within 100) — the counting on and
 * back that every quarter-hour stretch on these pages runs on.
 */

// LOAD-ORDER IMPORT, not an API one — and it must stay first. `lib/clock.ts` sits
// in an import CYCLE with `registry.ts` (registry spreads CLOCK_TEMPLATE_DEFS in
// its module body; clock reaches back through lib/erroranalysis.ts). Entering the
// cycle at registry is safe; entering at clock throws "Cannot access
// 'CLOCK_TEMPLATE_DEFS' before initialization". A harness that imports this week
// before the validator enters at clock — so the week touches registry first.
import '../registry';

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import {
  digitalTime,
  drawHands,
  elapsedMinutes,
  misreadClockEA,
  misreadTime,
  minutesPastPhrase,
  readClock,
  spokenTime,
  whichTimeChoice,
} from '../lib/clock';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsAnswerOf, assertsParam, clock as clockFigure, clockAlt } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { ItemDraft } from '../shared';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B12 = { level: 'B' as const, week: 12 };
const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// The day, and the hours each part of it can honestly occupy.
//
// A 12-hour face carries no morning or afternoon, so the hour a story names is
// the only thing keeping it believable — nobody eats breakfast at quarter past
// eight in the evening. Every session here ships the hours it can begin in, and
// the draw takes both together, so an implausible pairing is not merely unlikely
// but unreachable.
//
// The two pools differ in ONE requirement, and it is a requirement the prose
// creates rather than the mathematics. `SESSION_SLOTS` feeds the anchor item,
// which shows a clock 15 or 45 minutes into the hour a session began — so every
// entry has to be something that can still be going on three quarters of an hour
// later. `LESSON_EVENTS` feeds the mixed-up plan, which STATES how long the
// activity lasts (5–25 minutes), so a five-minute singing group is fine there and
// nowhere else.
// ---------------------------------------------------------------------------

interface DaySlot {
  event: string;
  /** Hours as the face reads them, 1–12. */
  hours: readonly number[];
}

const SESSION_SLOTS: readonly DaySlot[] = [
  { event: 'the number game', hours: [9, 10, 11] },
  { event: 'the library visit', hours: [10, 11, 2] },
  { event: 'the painting table', hours: [11, 1, 2] },
  { event: 'the pond visit', hours: [10, 11] },
  { event: 'the shape hunt', hours: [9, 1] },
  { event: 'the puppet show', hours: [2, 3] },
  { event: 'gym club', hours: [4, 5] },
  { event: 'the bike ride', hours: [4, 5] },
];

/** A session and an hour it can really begin in, drawn together. */
const drawSlot = (r: Rng): { event: string; h: number } => {
  const slot = r.pick(SESSION_SLOTS);
  return { event: slot.event, h: r.pick(slot.hours) };
};

/**
 * The parts of a school morning that can share one hour — the pool the mixed-up
 * plan is built from. Each one lasts minutes rather than hours, which is what
 * lets three of them start inside a single hour without overlapping.
 */
const LESSON_EVENTS = [
  'the number game', 'the library visit', 'the painting table', 'the singing group',
  'the pond visit', 'the shape hunt', 'the puppet show',
] as const;

/** Hours a school morning of three short activities can sit inside. */
const MORNING_HOURS = [9, 10, 11] as const;

/** Sentence-initial form of an event name. */
const opens = (event: string): string => event[0].toUpperCase() + event.slice(1);

/** Three DIFFERENT lesson slots, drawn together so one plan cannot list one twice. */
const threeLessons = (r: Rng): [string, string, string] =>
  r.shuffle([...LESSON_EVENTS]).slice(0, 3) as [string, string, string];

/** Two DIFFERENT lesson slots, for the pair of back-to-back activities. */
const twoLessons = (r: Rng): [string, string] =>
  r.shuffle([...LESSON_EVENTS]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// The three local decorators.
//
// `lib/` is not ours to edit and the shipped primitives have no figure slot, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt (and therefore the
// QG-1/QG-4 surface signature the guard registered) is untouched. The figure law
// holds by construction in each case — the picture is rebuilt from values that
// came out of the item's OWN draw, never from a second one.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

/** Attach a picture rebuilt from the item's own `generator.params`. */
function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/**
 * The same rule where the factory ships no params to rebuild from:
 * `discrimination()` emits no generator spec at all, and `multiStep()` ships the
 * op-chain but not the HOUR its minutes belong to. The draw closure posts what it
 * drew into `box`, which the decorator reads immediately afterwards —
 * `drawUniqueItem` returns the draft its LAST `build` call produced, so the box
 * always holds that same draw (a redraw overwrites it before it can be read).
 */
interface Slot<P> {
  last: P | null;
}
const slot = <P,>(): Slot<P> => ({ last: null });

function withDrawn<P>(box: Slot<P>, base: ItemGen, decorate: (drawn: P) => Partial<ItemDraft>): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    if (box.last === null) throw new Error('b17/withDrawn: the draw posted nothing to decorate from');
    return { ...d, ...decorate(box.last) };
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B12 — the same face at the coarser scale. It is here so the new quarter marks
 * land on a reading the child already owns, and it is deliberately the FAMILY
 * generator: a warm-up that is literally last month's page, not a rewrite of it.
 */
const wReadHalfPast = asWarmup(readClock('half'), B12);

/** B13 — addition within 100, the counting on that a quarter-hour plan runs on. */
const wSeeds = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add',
    draw: (r) => {
      const done = r.int(24, 68);
      const more = r.pick([10, 15, 20, 25] as const);
      const name = one(r);
      return {
        prompt: `${name} has planted ${countNoun(done, 'sunflower seeds')}. Then ${name} plants ${countNoun(more, 'more seeds')}. How many seeds are planted now?`,
        answerValue: String(done + more),
        templateId: 'add_within_100_v1',
        params: { a: done, b: more },
        units: 'seeds',
        hints: [
          'Which of the two numbers is the one you count on FROM?',
          'Hold that number still, then count the new seeds on in tens.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B13,
);

/** B14 — subtraction within 100, the counting back an elapsed stretch runs on. */
const wRubberBands = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'sub',
    draw: (r) => {
      const total = r.int(42, 78);
      const taken = r.int(13, 29);
      const name = one(r);
      return {
        prompt: `A box holds ${countNoun(total, 'rubber bands')}. ${name} takes ${countNoun(taken, 'rubber bands')} out to make a chain. How many rubber bands are left in the box?`,
        answerValue: String(total - taken),
        templateId: 'd_sub_v1',
        params: { a: total, b: taken },
        units: 'rubber bands',
        hints: [
          'Is the box filling up here, or emptying?',
          'Take the tens out of the box first, then take the ones.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B14,
);

// ---------------------------------------------------------------------------
// Reading and writing a quarter-hour face — the family's own generators
// ---------------------------------------------------------------------------

/** Face → time, at the quarters. The clock IS the question (kit §E2.5's sanctioned case). */
const readFace = readClock('quarter');

/**
 * Spoken time → face, then written in numerals. The face arrives empty
 * (`hands: 'none'`), so it asserts nothing: the drawing is the child's, and it is
 * the flagged manual part (FILL-ARCHITECTURE §7). What makes this the week's
 * version rather than B12's is the spoken form the family prints — half of these
 * draws say "quarter to", and a child cannot place a hand for "quarter to seven"
 * without first deciding that the short hand does NOT go on the seven.
 */
const setHands = drawHands('quarter');

/** Elapsed inside one hour, measured in quarters. The answer is a COUNT of minutes. */
const elapsedQuarter = elapsedMinutes('quarter');

// ---------------------------------------------------------------------------
// The anchor, drawn and measured — the minute hand's journey
// ---------------------------------------------------------------------------

/**
 * How far round the face the long hand has travelled since the hour began.
 *
 * This is the anchor as a question. The child is not asked what time it is; they
 * are asked how much of one trip is behind the hand — which is the quantity the
 * words "quarter", "half" and "three quarters" are names for, and the quantity
 * every elapsed page on Day 4 counts in. It is measured from the top of the face,
 * so the chain is honest: `clock_elapsed_v1` over {m: 0, m2: the drawn minutes}
 * is literally "how far from the twelve to here", and QG-5 re-derives it.
 *
 * The picture shows the position and asserts its minutes-past against the answer,
 * because reading that position IS the task — the same sanctioned posture as
 * `readClock`, with the selector changed to name the quantity actually asked for.
 *
 * The draw is the QUARTERS ONLY, and the half hour is deliberately not in it. Two
 * reasons, and the second one is the one that matters: the half belongs to B12,
 * and — found by reading the generated page — the metacognition probe below asks
 * whether the hand has passed half way round the face, which at exactly
 * thirty minutes has no true answer — the hand has passed exactly half way, and
 * neither yes nor no is true. A probe a child cannot honestly answer is worse
 * than no probe.
 *
 * Served ONLY through that wrapper (kit §E2.2): a generator reachable both raw
 * and wrapped ships two identical hint ladders and spends two of the three the
 * dedup allows on one idea.
 */
const journeyBase = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'minute-hand-journey',
    draw: (r) => {
      const { event, h } = drawSlot(r);
      const m = r.pick([15, 45] as const);
      return {
        // Kept SHORT on purpose: `withEstimateFirst` prepends "Decide, then
        // solve:" to whatever sentence comes first, so a 14-word opener becomes a
        // 17-word one on the page.
        prompt: `[image: ${clockAlt(h, m)}] ${opens(event)} began on the hour. The long hand set off from the top. How many minutes has it travelled since?`,
        answerValue: String(m),
        templateId: 'clock_elapsed_v1',
        params: { h, m: 0, m2: m },
        units: 'minutes',
        hints: [
          'Where does the long hand always begin its trip round the face?',
          'Walk round from the top in fives, until you reach the long hand.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    clockFigure(
      { h: numOf(p, 'h'), m: numOf(p, 'm2') },
      { marks: 'five', highlight: 'minute', asserts: assertsAnswerOf('minutes-past') },
    ),
);

/**
 * Metacognition, in the Level-B intro form. FILL-ARCHITECTURE's B row names it
 * "will it pass 10?" predictions; the time version is a call the child can make
 * by LOOKING, before any counting: is the long hand more than half way round, or
 * less? The picture makes that decidable and the count then settles it, which is
 * what an estimate-first probe is for.
 */
const journeyEstimate = withEstimateFirst(
  journeyBase,
  // Six words, and the shortness is deliberate: the wrapper's longest lead-in is
  // itself nine, so anything longer breaks the band's fifteen-word ceiling on a
  // sentence the week does not fully control.
  'has the long hand passed half way?',
);

// ---------------------------------------------------------------------------
// Discrimination — quarter past against quarter to, in numerals and in words
// ---------------------------------------------------------------------------

/**
 * "Which time does this clock show?" (family). One misread is named, and that is
 * the point: on a quarter face the only other time a child ever produces is the
 * flip, so a third option could only be a straw man to eliminate. The wrong
 * option is `misreadTime`'s real output, and `clock_verify_time_v1` proves the
 * option keyed correct is the one the drawn face actually shows.
 */
const whichTime = whichTimeChoice('quarter', ['quarter-flip']);

/**
 * The same face in WORDS — and the item that separates the two halves of the
 * trap. Both wrong options are real, both are computed from the item's own draw,
 * and they fail differently:
 *  - the flip (`misreadTime`) moves the quarter to the far side of the hour AND
 *    the hour forward with it: quarter to four heard as quarter past four;
 *  - the same-hour version keeps the hour and counts the quarter from the wrong
 *    end: quarter to four heard as quarter past three. The quarter still to come,
 *    read as the quarter already gone. It needs no transform the family does not
 *    have — on a quarter face it is the other quarter, so it is one line of
 *    arithmetic on {h, m}, not an invented number.
 *
 * All three options are "quarter <direction> <hour>", so the grammar gives
 * nothing away; only the direction and the hour differ, which is the whole
 * discrimination.
 *
 * Both RATIONALES are direction-aware, because the flip runs both ways and a
 * single sentence cannot describe both. Found by reading the generated pages: at
 * a quarter past, the flip turns a PAST into a TO and carries the hour BACK, so
 * the one-directional sentence the family keeps for this misread ("a quarter TO
 * the coming hour turned into a quarter PAST it") describes only half the draws.
 * These two do not.
 */
const spokenBox = slot<{ h: number; m: number; seed: number }>();
const spokenFormChoice = withDrawn(
  spokenBox,
  discrimination({
    variant: 'structural',
    cognitiveOp: 'name-the-quarter',
    draw: (r) => {
      const h = r.int(1, 12);
      const m = r.pick([15, 45] as const);
      const flipped = misreadTime(h, m, 'quarter-flip');
      // The other quarter of the SAME hour: the direction error on its own.
      const sameHour = { h, m: m === 45 ? 15 : 45 };
      spokenBox.last = { h, m, seed: r.uint() };
      return {
        prompt: `[image: ${clockAlt(h, m)}] ${one(r)} looks up at the clock on the wall. Which of these names the time it shows?`,
        correct: spokenTime(h, m),
        correctForms: [digitalTime(h, m)],
        distractors: [
          {
            text: spokenTime(flipped.h, flipped.m),
            errorTag: 'representation-misread',
            rationale:
              m === 45
                ? 'A quarter TO the coming hour turned into a quarter PAST it, carrying the hour forward with it.'
                : 'A quarter PAST this hour turned into a quarter TO it, carrying the hour back with it.',
          },
          {
            text: spokenTime(sameHour.h, sameHour.m),
            errorTag: 'concept-misconception',
            rationale:
              m === 45
                ? 'Keeps the hour but counts the quarter that is still to come as the quarter that has gone.'
                : 'Keeps the hour but counts the quarter that has gone as the quarter that is still to come.',
          },
        ],
        hints: [
          'Is the long hand travelling away from the top, or back towards it?',
          'Name the quarter first, then say which hour that quarter is heading towards.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  ({ h, m, seed }) => ({
    generator: { templateId: 'clock_verify_time_v1', params: { h, m }, seed },
    figure: clockFigure({ h, m }, { marks: 'five', asserts: { of: 'time', ...assertsAnswer } }),
  }),
);

// ---------------------------------------------------------------------------
// Multi-step — the recipe's schedule ordering, and the family's chain
// ---------------------------------------------------------------------------

/**
 * A block, then the activity straight after it — the week's second chain, and the
 * one item here that had to be written rather than borrowed.
 *
 * B12 recorded that the family's `elapsedThenMore` COLLAPSES at 'half': one
 * possible draw, and step one becomes a subtraction of zero. Its hope was that
 * the quarters would fix it. Measured across 200 packs, they only half fix it:
 * the generator now has three starts and two finishes to choose between, but it
 * still has no floor on the start, so **41.6% of draws begin at the o'clock and
 * subtract ZERO** — a two-step item that is really one step, four times in ten.
 * The answer stays honest; the second step does not exist. That is the BB-G7
 * failure the multiStep factory exists to make impossible, arriving through the
 * back door, so this week does not serve that generator.
 *
 * What replaces it keeps the family's arithmetic (finish − start + the next
 * stretch) and floors the start at the quarter past, so step one always measures
 * a real block. It differs from `msScheduleOrder` in where the work is: there the
 * first move is ORDERING three stated starts; here the first move UNCOVERS a
 * length nobody states, and only then is a second, stated length joined to it.
 * And it asks for the two together as a share of the hour, so the ceiling matters
 * — the second activity is drawn so the pair cannot spill past the hour it claims
 * to fill.
 *
 * The face shows the FINISH of the first block, which the prose states, asserted
 * against the chain's own `initN`.
 */
/** The (start, finish) pairs of quarter marks a first block can run between. */
const BLOCK_PAIRS = [[15, 30], [15, 45], [30, 45]] as const;

const fillBox = slot<{ h: number; m: number }>();
const msFillTheHour = withDrawn(
  fillBox,
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'fill-the-hour',
    usesPriorSkill: true,
    draw: (r) => {
      const h = r.pick(MORNING_HOURS);
      const [start, finish] = r.pick(BLOCK_PAIRS);
      // The pair must still fit inside the hour it is measured against.
      const next = finish === 45 ? r.pick([5, 10, 15] as const) : r.pick([5, 10, 15, 20] as const);
      const [firstEvent, secondEvent] = twoLessons(r);
      fillBox.last = { h, m: finish };
      return {
        prompt: `[image: ${clockAlt(h, finish)}] ${opens(firstEvent)} was over at ${minutesPastPhrase(h, finish)}. That is the time on the clock. It had started at ${digitalTime(h, start)}. ${opens(secondEvent)} followed straight on and ran for ${countNoun(next, 'minutes')}. How many minutes of the hour did the two activities fill?`,
        initN: finish,
        steps: [
          { op: 'sub', n: start, d: 1 },
          { op: 'add', n: next, d: 1 },
        ],
        units: 'minutes',
        hints: [
          "Does the page tell you the first activity's length, or must you find it?",
          'Measure the first block between its two marks, then join the second one on.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  ({ h, m }) => ({
    figure: clockFigure({ h, m }, { marks: 'five', asserts: assertsParam('initN', 'minutes-past') }),
  }),
);

/**
 * SCHEDULE ORDERING — the §4 recipe's multi-step, and the reason it is not a
 * subtraction with scenery.
 *
 * The plan is printed out of order, latest start first. So the opening move is
 * not arithmetic at all: it is finding which of three quarter-hour starts is the
 * earliest, with a third time sitting in the middle that the answer never uses.
 * Only then can the stretch be measured, and only then can the last activity's
 * length be added on the end. Two operations, and the plan's own disorder is what
 * makes the first one necessary.
 *
 * The chain's `initN` must BE the prompt's first stated quantity (the multiStep
 * contract), which is why the target's start prints as "45 minutes past 10"
 * rather than "quarter to 11": the quarter names hide the minute count the chain
 * starts from. The other two starts print as numerals, so the page also asks the
 * child to hold two notations side by side.
 *
 * THE THREE STARTS ARE THE THREE QUARTER MARKS, and the o'clock is deliberately
 * not among them. Found by reading the generated pages: with all four marks in
 * the pool, three draws in four put the o'clock earliest, and subtracting a start
 * of ZERO makes step one a no-op — the exact collapse B12's header recorded for
 * `elapsedThenMore` at 'half', reappearing in a different item. Quarter past,
 * half past and quarter to are also the right three for a week named after them.
 *
 * The variety the fixed marks would otherwise cost is bought back by moving the
 * TARGET: the question asks about the second-starting activity or the third, so
 * the stretch to be measured is 15 or 30 minutes, and whichever start is not used
 * stays on the page as a quantity the answer never touches. `lasts` is then drawn
 * from a range that cannot make the target overlap the activity after it — one
 * deterministic branch, no redraw loop (kit §E2.4).
 */
const scheduleBox = slot<{ h: number; m: number }>();
const QUARTER_MARKS = [15, 30, 45] as const;
const msScheduleOrder = withDrawn(
  scheduleBox,
  multiStep({
    situationType: 'comparison',
    cognitiveOp: 'order-the-schedule',
    usesPriorSkill: true,
    draw: (r) => {
      const h = r.pick(MORNING_HOURS);
      // The target is the 2nd or the 3rd start, never the 1st — so the earliest
      // start is always the quarter past, and step one is never a subtraction of
      // nothing.
      const targetIdx = r.pick([1, 2] as const);
      const target = QUARTER_MARKS[targetIdx];
      const others = QUARTER_MARKS.filter((v) => v !== target);
      const early = others[0];
      const shown = r.shuffle([...others]);
      const [targetEvent, firstShown, secondShown] = threeLessons(r);
      // A 2nd-start activity has to finish before the 3rd one begins; a
      // 3rd-start activity has nothing after it to collide with.
      const lasts = targetIdx === 1 ? r.pick([5, 10, 15] as const) : r.pick([5, 10, 15, 20, 25] as const);
      scheduleBox.last = { h, m: target };
      return {
        prompt: `[image: ${clockAlt(h, target)}] Today's plan was copied out in the wrong order. ${opens(targetEvent)} starts at ${minutesPastPhrase(h, target)} — the time on the clock. It lasts ${countNoun(lasts, 'minutes')}. ${opens(firstShown)} starts at ${digitalTime(h, shown[0])}. ${opens(secondShown)} starts at ${digitalTime(h, shown[1])}. How many minutes from the earliest start on the plan until ${targetEvent} ends?`,
        initN: target,
        steps: [
          { op: 'sub', n: early, d: 1 },
          { op: 'add', n: lasts, d: 1 },
        ],
        units: 'minutes',
        hints: [
          'Which of the three starting times on this plan comes earliest?',
          'Put the starts in order, then measure from the first right to the end.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  ({ h, m }) => ({
    figure: clockFigure({ h, m }, { marks: 'five', asserts: assertsParam('initN', 'minutes-past') }),
  }),
);

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both times)
//
// The recipe's error, exactly: a quarter TO read as a quarter PAST. `misreadTime`
// computes what that child really writes (3:45 → "4:15"), the prompt shows that
// value, and the true time is code-computed — neither can be fabricated. The
// clock stays on the page because it is the evidence the child argues from, and
// because the whole argument turns on where the short hand actually is.
// ---------------------------------------------------------------------------

const eaQuarterFlip = misreadClockEA('quarter-flip', 'quarter');

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB17 = makeWeekBuilder({
  level: 'B',
  week: 17,
  conceptId: 'time-quarter-hours',
  conceptName: 'Time: quarter hours',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B12, B13, B14],
  pedagogyContract: 'v2',
  conceptualAnchor: "the minute hand's journey",
  conceptFamily: 'operation',
  deepeningDelta:
    'B12 read a face by naming two hand positions — long hand straight up is an o\'clock, straight down is half past — which a child can memorise as two pictures without ever thinking about movement. B17 makes the movement the object: the long hand takes one trip round the face every hour, and a quarter is a quarter OF that trip. That buys two things B12 could not have. The quarters give the week four marks instead of two, so an elapsed stretch can be measured rather than recited, and the two-step chains are the week\'s own rather than borrowed. And "quarter to" is the first time a clock is named from the hour it is heading TOWARDS, which is where the week\'s trap lives: at quarter to four the short hand has crept three quarters of the way to the 4, so the picture itself argues for the wrong hour.',
  explanation: {
    hook:
      'The long hand walks all the way round the face every hour. Cut that walk into four, and every quarter gets its own name.',
    whyBeforeHow:
      "A quarter is one of four equal parts, and the minute hand's journey gets quartered. The long hand goes once round the face every hour. A quarter of the way round is 15 minutes, so we say quarter past. Half way round is 30 minutes. Three quarters of the way round leaves only one quarter still to travel. That is when we change words. We stop counting what has gone and count what is left. Quarter to the next hour is the name for it. By then the short hand is three quarters of the way to the next number. It looks as if it has arrived, but it has not. The hour is still the number it has already passed.",
    script: [
      {
        say: 'Watch me send the long hand off from the top of the face. It walks a quarter of the way round and stops at the 3. A quarter of the hour has gone, so I say quarter past. Notice how little the short hand has moved.',
        visual: 'A clock face at quarter past five, with the long hand picked out at the 3.',
        figure: clockFigure({ h: 5, m: 15 }, { marks: 'five', highlight: 'minute' }),
      },
      {
        say: 'Now I let the long hand walk on. It passes the 6 and reaches the 9. Three quarters of its walk are behind it, and only one quarter is left. So I stop counting what has gone and count what is left instead. Quarter to six.',
        visual: 'The same clock at quarter to six, with the long hand picked out at the 9.',
        figure: clockFigure({ h: 5, m: 45 }, { marks: 'five', highlight: 'minute' }),
      },
      {
        say: 'Here is the one that catches everybody. Look at the short hand on that same face. It has crept nearly all the way to the 6. My eye wants to say six. But it only reaches the 6 when the long hand comes back to the top. The long hand is nowhere near the top. So which hour are we still inside?',
        visual: 'The quarter-to-six face again, with the short hand picked out just short of the 6.',
        figure: clockFigure({ h: 5, m: 45 }, { marks: 'five', highlight: 'hour' }),
      },
      {
        say: 'One habit before I write anything down. I check which side of the face the long hand is on. Coming down from the top means minutes past. Climbing back up to the top means minutes to. If my words and the long hand disagree, I read the face again.',
        visual: 'A clock at quarter past ten, the long hand on its way down from the top.',
        figure: clockFigure({ h: 10, m: 15 }, { marks: 'five' }),
      },
    ],
    summary:
      'The long hand walks round the face once an hour. A quarter of that walk is 15 minutes, so we say quarter past. Three quarters of the walk leaves one quarter still to go. That time is called quarter to the next hour. The short hand looks as if it has arrived early. The hour is always the number it has already passed.',
    vocabulary: [
      { term: 'quarter past', kidGloss: 'the long hand has walked a quarter of the way round: 15 minutes have gone' },
      { term: 'quarter to', kidGloss: 'the long hand has one quarter of its walk left: 15 minutes still to go' },
      { term: 'quarter of an hour', kidGloss: '15 minutes — one of the four equal parts of an hour' },
      { term: 'minute hand', kidGloss: 'the long hand: it takes one whole hour to walk round the face' },
    ],
  },
  guidedExamples: [
    {
      ...ge(17, 1, 'modeled', "A clock's long hand points at the 9. Its short hand has nearly reached the 4. What time is it?", [
        {
          teacherSay:
            'Watch me read the long hand first. It tells me where I am inside the hour. It has gone past the 6 and stopped at the 9. Three quarters of its walk are gone, so only one quarter is left. So this is a quarter TO an hour, and not a quarter past.',
        },
        {
          teacherSay:
            'Now the hour, and here I slow right down. The short hand has nearly reached the 4, so my eye says four. But it only reaches the 4 when the long hand comes back up. Which hour have we not finished yet?',
          expected: '3',
        },
      ], '3:45'),
      visual: 'A clock at quarter to four, the short hand almost touching the 4.',
      figure: clockFigure({ h: 3, m: 45 }, { marks: 'five', asserts: { of: 'time', ...assertsAnswer } }),
    },
    {
      ...ge(17, 2, 'completion', "A clock's long hand points at the 3. Its short hand is just past the 7. What time is it?", [
        { teacherSay: 'The long hand has walked one quarter of the way round from the top. Which quarter word does that give us?', expected: 'quarter past' },
        { childDo: 'Name the hour from the short hand, then write the whole time in numerals.', expected: '7:15' },
      ], '7:15'),
      visual: 'A clock at quarter past seven, the short hand only just past the 7.',
      figure: clockFigure({ h: 7, m: 15 }, { marks: 'five', asserts: { of: 'time', ...assertsAnswer } }),
    },
    {
      ...ge(17, 3, 'prompted', 'Draw the hands on this clock to show quarter to 6. Then write that time in numerals.', [
        { childDo: 'Send the long hand to the 9 first. Then decide how far the short hand has crept.', expected: '5:45' },
      ], '5:45'),
      visual: 'An empty clock face, numbers 1 to 12, no hands drawn yet.',
      figure: clockFigure({ h: 5, m: 45 }, { marks: 'five', hands: 'none' }),
    },
    {
      // Independent stage: the clock gives the START and nothing else. Counting
      // the quarters between the two times IS the task, so the face shows only
      // what the child was handed.
      ...ge(17, 4, 'independent', 'The library visit begins at quarter past 11 — the time on the clock. It ends at quarter to 12. How many minutes does it last? Solve cold.', [
        { childDo: 'Count the quarter marks the long hand travels between the two times.', expected: '30' },
      ], '30'),
      visual: 'A clock at quarter past eleven — the start of the visit, not the end.',
      figure: clockFigure({ h: 11, m: 15 }, { marks: 'five' }),
    },
  ],
  days: [
    // Day 1 — concept echo: the three new single-step acts (read the quarters,
    // build them, measure a gap between two of them), single-step only, with the
    // arithmetic the week runs on warmed up first — one sum that grows and one
    // that shrinks, which is the pair every elapsed count needs.
    //
    // The B12 face deliberately does NOT open this day. Found by reading the
    // generated page: `readClock` at 'quarter' can draw the half hour, so a
    // 'half' warm-up beside it printed the same sentence twice on Day 1, once
    // labelled Warm-up. The coarser face returns on Days 2 and 3 instead, where
    // it sits beside the quarters as a contrast rather than a repeat.
    [
      { gen: wSeeds, diff: 2 },
      { gen: wRubberBands, diff: 2 },
      { gen: readFace, diff: 2 },
      { gen: setHands, diff: 2 },
      { gen: elapsedQuarter, diff: 3 },
    ],
    // Day 2 — fluency + application: last month's face, then the journey measured
    // with a prediction first, then both sides of the quarter trap (numerals,
    // then words), then the week's first two-step.
    [
      { gen: wReadHalfPast, diff: 2 },
      { gen: journeyEstimate, diff: 3 },
      { gen: whichTime, diff: 3 },
      { gen: spokenFormChoice, diff: 3 },
      { gen: msFillTheHour, diff: 4 },
    ],
    // Day 3 — interleave: the two discriminations with the mixed-up plan between
    // them, so the shape of the page never tells the child which thinking is
    // coming next.
    [
      { gen: wReadHalfPast, diff: 2 },
      { gen: wSeeds, diff: 2 },
      { gen: whichTime, diff: 4 },
      { gen: msScheduleOrder, diff: 4 },
      { gen: spokenFormChoice, diff: 4 },
    ],
    // Day 4 — word problems: the two chains, kept apart by the single-step pages
    // they are built out of, so "it must be two steps" never becomes the cue and
    // no two finish-clocks sit side by side.
    [
      { gen: msScheduleOrder, diff: 4 },
      { gen: elapsedQuarter, diff: 3 },
      { gen: msFillTheHour, diff: 4 },
      { gen: readFace, diff: 3 },
      { gen: journeyEstimate, diff: 3 },
    ],
    // Day 5 — the signature: the flip analysed, the hands drawn, a day put in
    // order, and the claim that settles what "past" and "to" measure.
    [
      { gen: wRubberBands, diff: 2 },
      { gen: eaQuarterFlip, diff: 4 },
      { gen: setHands, diff: 3 },
      {
        gen: reasoning({
          prompt:
            'Here is part of one school morning, written in the wrong order. The pond visit starts at quarter to 11. The number game starts at quarter past 10. The library visit starts at half past 10. Write the three in the order they happen. Then write how many minutes there are between the first start and the last.',
          value:
            'the number game first, then the library visit, then the pond visit, with 30 minutes between the first start and the last',
          acceptableForms: ['number game', 'library visit', 'pond visit', '30', 'thirty'],
          keywords: true,
          hints: [
            'Which hour does a "quarter to" time belong to — the earlier one or the later?',
            'Write all three times in numerals first, then read them from the smallest.',
          ],
          errorTags: ['representation-misread', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? Quarter to an hour comes 30 minutes before quarter past that same hour. Write one sentence saying how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads a quarter to an hour as coming AFTER a quarter past it, so the 30 minutes run the wrong way.',
            },
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Lets the size of a quarter change from hour to hour, but every hour is quartered the same way.',
            },
          ],
          hints: [
            'Picture a quarter to an hour and a quarter past the same hour.',
            'Work both times out for one hour, then do the same for a different hour.',
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
    'For grown-ups: if your child reads quarter to four as quarter past four, do not start with the answer. Cover the short hand with your thumb and ask which side of the face the long hand is on. Going down from the top is past; climbing back up is to. Then uncover the short hand and ask whether it has actually REACHED the next number. It has not, and that settles the hour. Real clocks beat worksheets here — the oven, the car, the one in the hall.',
  ],
  puzzle: (r) => {
    // 12 is left out so the coming hour never has to roll round to 1 in the
    // riddle's own prose.
    const h = r.int(1, 11);
    const name = one(r);
    return {
      id: 'B17-PZ-01',
      title: 'Puzzle Grove: The Riddle of the Missing Quarter',
      puzzleType: 'logic',
      prompt: `[image: ${clockAlt(h, 30)}] ${name} found a clock riddle. It says: I come a quarter of an hour after the time shown here. My name uses the word "to", never the word "past". Which time am I? Write it in numerals, then say which hour I belong to.`,
      figure: clockFigure({ h, m: 30 }, { marks: 'five' }),
      // The hour ALONE is not an acceptable whole answer — the riddle asks for a
      // time, and naming the hour is the second half of the same question, not an
      // alternative to it.
      answer: {
        value: digitalTime(h, 45),
        acceptableForms: [spokenTime(h, 45)],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'How much of its walk round the face has the long hand left to do?',
        'Move the long hand on one quarter, then decide whether the hour has finished.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
  // Working FORWARDS from a shown time to a named one, and then deciding the
  // hour against what the picture suggests: two moves, and neither of them is a
  // move a Day-1 page makes (Day 1 reads a face, builds a face, or measures the
  // gap between two given times).
  puzzleMeta: { stepCount: 2, cognitiveOp: 'clock-riddle' },
  sprint: {
    skill: 'Addition within 100 — the counting on that a day plan runs on',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 12, max: 59, addends: [10, 15, 20, 30], noCross100: true },
  },
  mastery: [
    { gen: readFace, diff: 3 },
    { gen: msScheduleOrder, diff: 4 },
    { gen: elapsedQuarter, diff: 3 },
    { gen: msFillTheHour, diff: 4 },
    { gen: setHands, diff: 3 },
    { gen: spokenFormChoice, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the single-step face work — name the time on a quarter face, measure the gap between two quarter marks, and build a face from a spoken time (that one keeps its empty-face affordance and its manual-review drawing). 02/04: the two chains — a plan copied out in the wrong order, whose earliest start has to be found before anything can be measured, and a block whose length has to be uncovered before the activity after it can be joined on, each keeping the clock it asserts against. 06: the quarter named in words, with the flipped quarter and the wrong-end quarter both still on the page. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'quarter-flipped',
      description: 'Swaps a quarter TO an hour for a quarter PAST it, or the reverse, and carries the hour along with the swap.',
      exampleWrongAnswer: 'a clock at quarter to four read as 4:15 (and, the other way, quarter past four read as 3:45)',
      distractorRationale: 'Offer the time the face becomes when the quarter is flipped onto the far side of the hour, hour and all.',
      reteachPointer: 'explanation/script[1] (only one quarter of the walk is left, so we count what is left)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'quarter-counted-from-the-wrong-end',
      description: 'Keeps the hour but counts the quarter from the wrong end of it — what has gone and what is left, swapped over.',
      exampleWrongAnswer: 'a clock at quarter to four read as quarter past three',
      distractorRationale: 'Offer the other quarter of the same hour — the direction of the count reversed, the hour left alone.',
      reteachPointer: 'explanation/script[3] (which side of the face the long hand is on)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'time-for-minutes',
      description: 'Answers a how-many-minutes question with a time of day, or stops at the earliest start of a plan without measuring to the end.',
      exampleWrongAnswer: 'a "how many minutes does it last?" question answered "quarter to eleven"',
      distractorRationale: 'Offer a time of day where the question asked for a count of minutes.',
      reteachPointer: 'guidedExamples/B17-GE-04 (count the quarter marks between the two times)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'quarter-count-slip',
      description: 'Chooses the right move but loses the thread between the quarter marks, landing one quarter of an hour out.',
      exampleWrongAnswer: 'the stretch from quarter past two to quarter to three counted as 15 minutes',
      distractorRationale: 'Offer the count that is one quarter mark short of the true stretch.',
      reteachPointer: 'guidedExamples/B17-GE-04 (say the running count aloud at every quarter mark), then the 2-minute addition sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Telling the time to the quarter hour — reading quarter past and quarter to, drawing the hands for both, working out how many minutes a quarter-hour block lasts, and putting the starts of a day in order.',
    improvingCandidates: [
      'reading how far the long hand has travelled round the face',
      'telling a quarter past an hour from a quarter to the next one',
      'putting the starts of a morning in time order',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'keeping quarter to and quarter past apart — going down from the top is past, climbing back up is to',
      },
      {
        errorTag: 'concept-misconception',
        text: 'noticing that at a quarter to, the short hand has nearly reached the next number but has not got there',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was asked — a count of minutes is not a time of day',
      },
      {
        errorTag: 'procedure-slip',
        text: 'holding the count steady from one quarter mark to the next — the sprints keep that part quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked which side of the face the long hand was on before you named the time — that is exactly the habit this week is built on.',
      questionForChild: 'The long hand is on the 9 and the short hand has almost reached the 6. What time is it, and how do you know it is not nearly seven?',
      schoolSyncHook: 'If your child\'s class says "ten forty-five" rather than "quarter to eleven", tell us and we will match the words they hear.',
    },
    vocabularyForParent: [
      'quarter past (the long hand a quarter of the way round — 15 minutes gone)',
      'quarter to (the long hand with a quarter of its trip left — 15 minutes to go)',
      'quarter of an hour (15 minutes, one of the four equal parts of an hour)',
    ],
  },
});
