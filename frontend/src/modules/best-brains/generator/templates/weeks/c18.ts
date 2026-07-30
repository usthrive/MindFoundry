/**
 * Level C · Week 18 — "Time to the minute" (conceptId: time-to-the-minute).
 *
 * FILL-ARCHITECTURE §5 row C18 (family G2, `lib/clock.ts`): anchor "the minute
 * marks ride in fives"; multi-step "elapsed within the hour (2-step)";
 * error-analysis "2:55 read as 3:55 — the hour-hand drift"; discrimination
 * "5-minute marks vs single minutes"; Day-5 signature "schedule + elapsed
 * production".
 *
 * The week's whole claim is that a clock face carries TWO scales at once — twelve
 * numerals that are worth five minutes each, and sixty single marks — and that
 * the short hand does not wait on its numeral while the long hand travels. The
 * content is built to force both readings rather than assert them:
 *  - the hour-drift trap appears three times, each time as EVIDENCE rather than
 *    prose: as a forced two-way choice (`whichTimeChoice`, where at 2:53 the only
 *    two candidates a child ever produces are 2:53 and 3:53), as the Day-5
 *    error-analysis (`misreadClockEA`, whose shown wrong time is `misreadTime`'s
 *    own output and is re-derived by QG-11), and inside every drawn face, because
 *    the renderer drifts the hour hand by `h·30 + m·0.5`;
 *  - a structural discrimination that separates the two scales directly: the long
 *    hand k small marks past the numeral n, with one distractor counting those
 *    marks in FIVES and the other stopping at the numeral — the two things a
 *    child actually does;
 *  - six genuine two-step items across three shapes: elapsed-then-more (the
 *    family's own chain), a comparison of two durations, and an inverse-start
 *    that hands the child the FINISHING time and asks what the clock said before
 *    any of it began.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7 / §E2.5). On a "what time is it?"
 * item the clock IS the question, so a face showing the time is correct — what it
 * must never do is NAME the time, which is why `clockAlt` describes hand
 * POSITIONS and every figure below is built from the same `{h,m}` its answer is
 * computed from. On every other item the face asserts a GIVEN the prose already
 * states (the start of an event, the finishing time a backwards story hands you),
 * never the quantity being asked for; and "draw the hands for…" ships
 * `hands: 'none'`, because an empty face claims nothing.
 *
 * ONE DELIBERATE OVERRIDE OF THE FAMILY'S DEFAULTS — `toTheMinute` below. Every
 * `lib/clock.ts` figure is built with `marks: 'five'`, which is right for B12 and
 * B17 (their times only ever land on the twelve numerals) but leaves a C18 face
 * UNDER-DETERMINED: a child cannot read 2:53 off a dial with twelve ticks on it,
 * so the picture would stop being evidence for exactly the week that needs it
 * most. `toTheMinute` re-skins the figure the family built — same `{h,m}`, same
 * alt, same assertion, only the tick granularity changes — to `marks: 'minutes'`,
 * which the renderer draws as sixty ticks with the twelve fives standing proud.
 * That is the anchor, drawn.
 *
 * ONE DELIBERATE GRANULARITY CHOICE, and it is the one thing the family could not
 * do for this week. Both family ELAPSED generators draw their start and their
 * finish independently, with no duration FLOOR. At B17's 'quarter' that is
 * invisible (the coarsest possible gap is 15 minutes); at C18's own 'minute' it
 * puts "the science lesson begins at 3:37 and finishes at 3:38" on the page, and
 * even at 'five' it produces a five-minute swimming lesson in 27% of
 * `elapsedMinutes` draws and 15% of `elapsedThenMore` draws — measured, not
 * estimated. Six of the family's nine events cannot survive that. So the two
 * family elapsed generators are served at 'quarter', the finest setting at which
 * every draw is a believable school activity, and they act as the bridge from
 * B17: the count the child can already do, on the marks they already know.
 * ALL of this week's to-the-minute elapsed work is carried by items that set
 * their own floor — `msLongerBy` (durations ≥25 and ≥10 minutes), `msBackToStart`
 * (≥20 and ≥5), `sitFinishTime` (≥12) and `sitMinutesToHour`. A `minDuration`
 * option on the family's two elapsed draws would let C18 use them at 'minute',
 * which is where they belong.
 *
 * Retrieval is backward-only into B17 (quarter hours — the same face, one scale
 * coarser), C7 (the ×5 facts the minute marks ride on), and B13/B14 (± within
 * 100, which is exactly the arithmetic an elapsed count runs on).
 */

// LOAD-ORDER IMPORT, not an API one — and it must stay first.
//
// `lib/clock.ts` sits in an import CYCLE with `registry.ts`: registry spreads
// `CLOCK_TEMPLATE_DEFS` in its module body, and clock reaches back to registry
// through `lib/erroranalysis.ts`. Whichever of the two is entered first decides
// whether the cycle resolves. Entering at registry is safe (erroranalysis reads
// the registry lazily, at call time, exactly as its own comment promises).
// Entering at clock is NOT: registry's body then runs while clock is still in
// its temporal dead zone and throws `Cannot access 'CLOCK_TEMPLATE_DEFS' before
// initialization`. A harness that imports this week before it imports the
// validator enters at clock — so the week touches the registry first and the
// cycle resolves in the safe direction. Reported upstream; the real fix belongs
// to whoever owns registry.ts (defer the family spreads, or resolve them lazily
// the way `verifyTruth` already does).
import '../registry';

import { addWhole, asWarmup, classify, multiply, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import {
  digitalTime,
  drawHands,
  elapsedMinutes,
  elapsedThenMore,
  misreadClockEA,
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
import { assertsAnswer, assertsParam, clock as clockFigure, clockAlt } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { ItemDraft } from '../shared';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B12 = { level: 'B' as const, week: 12 };
const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };
const B17 = { level: 'B' as const, week: 17 };
const C7 = { level: 'C' as const, week: 7 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/**
 * Things a school timetable really contains, each already carrying whatever
 * article it needs so no prompt has to assemble one. The context-frame registry
 * carries no time frames, so nothing here can collide with a declared frame.
 */
const EVENTS = [
  'story time', 'choir practice', 'the reading circle', 'the school assembly',
  'the science lesson', 'football practice', 'the class quiz', 'the art lesson',
  'the swimming lesson',
] as const;

/** Sentence-initial form of an event name. */
const opens = (event: string): string => event[0].toUpperCase() + event.slice(1);

/** Two DIFFERENT events, for the comparison story. */
const twoEvents = (r: Rng): [string, string] => r.shuffle([...EVENTS]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// The three local decorators.
//
// `lib/` is not ours to edit, and the shipped primitives have no figure slot, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt (and therefore the
// QG-1/QG-4 surface signature) is untouched. The figure law holds by
// construction in each case — the picture is rebuilt from values that came out
// of the item's own draw, never from a second one.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

/**
 * The C18 face. Takes the figure the clock family already built — same `{h,m}`,
 * same accessible name, same `asserts` clause — and turns the sixty single-minute
 * ticks on. See the header: at this granularity a twelve-tick dial cannot be
 * read, and a picture that cannot be read is not evidence.
 */
function toTheMinute(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const f = d.figure;
    if (!f || f.type !== 'clock') return d;
    return { ...d, figure: { ...f, params: { ...f.params, marks: 'minutes' } } };
  };
}

/** Attach a picture rebuilt from the item's OWN `generator.params`. */
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
 * always holds that same draw. (The pattern `lib/clock.ts` uses internally, which
 * it does not export.)
 */
interface Slot<P> {
  last: P | null;
}
const slot = <P,>(): Slot<P> => ({ last: null });

function withDrawn<P>(box: Slot<P>, base: ItemGen, decorate: (drawn: P) => Partial<ItemDraft>): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    if (box.last === null) throw new Error('c18/withDrawn: the draw posted nothing to decorate from');
    return { ...d, ...decorate(box.last) };
  };
}

/** The week's own face, for the items that build their picture from scratch. */
const face = (h: number, m: number, asserts?: BBFigure['asserts']): BBFigure =>
  clockFigure({ h, m }, { marks: 'minutes', ...(asserts ? { asserts } : {}) });

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** B17 — the same face one scale coarser, so the new precision has something to stand on. */
const wQuarterClock = toTheMinute(asWarmup(readClock('quarter'), B17));
/** C7 — the ×5 table, which is what "count round in fives" is made of. */
const wFives = asWarmup(multiply(2, 12, 5, 5), C7);
/** B14 — two-digit subtraction: the arithmetic every elapsed count runs on. */
const wSubMinutes = asWarmup(subWhole(22, 58), B14);
/** B13 — and its partner, for counting on to a finishing time. */
const wAddMinutes = asWarmup(addWhole(11, 44), B13);

// ---------------------------------------------------------------------------
// Reading and writing a face — the family's own generators, at 'minute'
// ---------------------------------------------------------------------------

/** Face → time. The clock IS the question here (kit §E2.5's sanctioned case). */
const readMinute = toTheMinute(readClock('minute'));

/** Time → face, then written in numerals. The face arrives empty (`hands:'none'`). */
const setHands = toTheMinute(drawHands('minute'));

/**
 * Elapsed in one step — the bridge item. Served at 'quarter' (see the header note
 * on the missing duration floor), so it counts a gap the child met in B17, on a
 * face that has this week's sixty marks drawn on it.
 */
const elapsedBridge = toTheMinute(elapsedMinutes('quarter'));

/**
 * The recipe's multi-step, from the family: a stretch, then one more stretch.
 * Same granularity, same reason — the child's first two-step should carry the
 * planning load and nothing else.
 */
const msThenMore = toTheMinute(elapsedThenMore('quarter'));

/**
 * The drift as a forced CHOICE. One misread is named, and that is the point: at
 * 2:53 the only two times a child ever produces are 2:53 and 3:53, so a third
 * option could only be a straw man to eliminate. Every wrong option here is
 * `misreadTime`'s real output, and `clock_verify_time_v1` proves the option keyed
 * correct is the one the drawn face actually shows.
 */
const drivenByDrift = toTheMinute(whichTimeChoice('minute', ['hour-drift']));

/** The drift shown and argued about — the week's single most important item. */
const eaHourDrift = toTheMinute(misreadClockEA('hour-drift', 'minute'));

// ---------------------------------------------------------------------------
// Discrimination — the two scales on one face, forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * The recipe's discrimination: 5-minute marks vs single minutes. The long hand
 * sits `k` small marks past the numeral `n`, and the two distractors are the two
 * real readings of that position — counting the small marks in fives (the
 * one-scale-fits-all error), and stopping at the numeral (never counting them at
 * all). The nudge keeps the fives-misread inside the same hour, so all three
 * options are times a clock can show.
 */
const marksBox = slot<{ h: number; m: number; seed: number }>();
const discrimMarks = withDrawn(
  marksBox,
  discrimination({
    variant: 'structural',
    cognitiveOp: 'count-minute-marks',
    draw: (r) => {
      const k = r.int(1, 4);
      let n = r.int(1, 9);
      if (n + k > 11) n = 11 - k;
      const m = n * 5 + k;
      const h = r.int(1, 12);
      marksBox.last = { h, m, seed: r.uint() };
      return {
        prompt: `[image: ${clockAlt(h, m)}] The long hand has moved ${countNoun(k, 'small marks')} past the ${n}. Which time does this clock show?`,
        correct: digitalTime(h, m),
        correctForms: [spokenTime(h, m)],
        distractors: [
          {
            text: digitalTime(h, (n + k) * 5),
            errorTag: 'representation-misread',
            rationale: 'Counts the small marks in fives as well, as though every mark round the face were worth five minutes.',
          },
          {
            text: digitalTime(h, n * 5),
            errorTag: 'task-comprehension',
            rationale: 'Stops at the numeral the long hand has just passed, so the single minutes after it are never counted.',
          },
        ],
        hints: [
          'How many minutes does ONE small mark between two numerals stand for?',
          'Count round in fives as far as the numeral, then count the small marks after it one at a time.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  }),
  ({ h, m, seed }) => ({
    generator: { templateId: 'clock_verify_time_v1', params: { h, m }, seed },
    figure: face(h, m, { of: 'time', ...assertsAnswer }),
  }),
);

// ---------------------------------------------------------------------------
// Single-step stories the family does not carry
// ---------------------------------------------------------------------------

/**
 * Start + duration → finishing time: the inverse of `readClock`, and the item
 * where a child WRITES a time to the minute rather than reading one.
 *
 * The picture shows the START, which the prose also states, and asserts it
 * against the item's own `start` param — the answer is the finish, two counts
 * further round the face, so the figure hands over nothing. The duration floor
 * (12 minutes) and the ceiling (the finish stays inside the hour) are drawn, not
 * filtered, so no seed can produce a two-minute art lesson or roll past the hour.
 */
const sitFinishTime = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'finish-time',
    draw: (r) => {
      const h = r.int(1, 12);
      const start = r.int(2, 24);
      const dur = r.int(12, 59 - start);
      const event = r.pick(EVENTS);
      return {
        prompt: `[image: ${clockAlt(h, start)}] ${opens(event)} begins at the time on the clock, ${minutesPastPhrase(h, start)}, and lasts ${countNoun(dur, 'minutes')}. What time does it finish?`,
        answerValue: digitalTime(h, start + dur),
        templateId: 'clock_read_v1',
        params: { h, m: start + dur, start, dur },
        validation: 'short-text-keyword',
        acceptableForms: [spokenTime(h, start + dur)],
        hints: [
          'Does the question ask how long something lasts, or what the clock will say when it ends?',
          'Start from the minutes the face already shows and count on by the length of the event.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => face(numOf(p, 'h'), numOf(p, 'start'), assertsParam('start', 'minutes-past')),
);

/**
 * "Minutes to" — the other half of how a clock is spoken, and the metacognition
 * carrier. Served ONLY through the estimate-first wrapper (kit §E2.2: the wrapper
 * does not change the hint ladder, so a generator reachable both ways would spend
 * two of its own dedup allowance on one idea).
 *
 * The probe is a real call: the drawn minutes straddle the half hour, so "more
 * than half an hour to wait?" cannot be answered by reflex.
 */
const sitMinutesToHour = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'minutes-to-the-hour',
    draw: (r) => {
      // 12 is excluded so the next hour never has to roll round to 1 in the prose.
      const h = r.int(1, 11);
      const m = r.int(18, 56);
      const event = r.pick(EVENTS);
      return {
        prompt: `[image: ${clockAlt(h, m)}] ${one(r)} looks up at the clock in the middle of ${event}. How many minutes are there until ${h + 1} o'clock?`,
        answerValue: String(60 - m),
        templateId: 'd_sub_v1',
        params: { a: 60, b: m, h },
        units: 'minutes',
        hints: [
          'Where does the long hand have to reach before the next hour begins?',
          'Count on round the face from the long hand up to the top of the clock.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => face(numOf(p, 'h'), numOf(p, 'b'), assertsParam('b', 'minutes-past')),
);
const sitMinutesToHourEstimate = withEstimateFirst(
  sitMinutesToHour,
  'will there be more than half an hour to wait, or less than half an hour?',
);

// ---------------------------------------------------------------------------
// Multi-step: elapsed within the hour, in three shapes
// ---------------------------------------------------------------------------

/**
 * Two durations held side by side. The chain is `finish − begin − other`: the
 * first line uncovers a length nobody states, and only then can the comparison
 * happen — which is what makes it two steps rather than one subtraction with
 * scenery.
 *
 * The finish prints as "52 minutes past 2" and not "8 minutes to 3" because the
 * chain's `initN` must BE the prompt's first stated quantity (the multiStep
 * contract), and the "minutes to" form hides that count. The pictured face shows
 * that same finish and asserts against `initN`.
 */
const longerBox = slot<{ h: number; m: number }>();
const msLongerBy = withDrawn(
  longerBox,
  multiStep({
    situationType: 'comparison',
    cognitiveOp: 'compare-durations',
    draw: (r) => {
      const h = r.int(1, 12);
      const finish = r.int(38, 59);
      const begin = r.int(2, finish - 25);
      const other = r.int(10, finish - begin - 5);
      const [e1, e2] = twoEvents(r);
      longerBox.last = { h, m: finish };
      return {
        prompt: `[image: ${clockAlt(h, finish)}] ${opens(e1)} finishes at ${minutesPastPhrase(h, finish)}, the time on the clock, and it began at ${digitalTime(h, begin)}. ${opens(e2)} lasts ${countNoun(other, 'minutes')}. How many minutes longer is ${e1} than ${e2}?`,
        initN: finish,
        steps: [
          { op: 'sub', n: begin, d: 1 },
          { op: 'sub', n: other, d: 1 },
        ],
        units: 'minutes',
        hints: [
          'Which two lengths of time is this question holding side by side?',
          'Work out how long the first one lasts, then take the length of the second off it.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  ({ h, m }) => ({ figure: face(h, m, assertsParam('initN', 'minutes-past')) }),
);

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The time the story hands you is the
 * time it ENDED, so both stretches have to be wound backwards, and every "and
 * then" in the sentence points the opposite way to the calculation it asks for.
 * Both intermediate values are real moments on the clock — the minute the event
 * began, then the minute the chairs came out — so no step of the chain is a
 * number that stands for nothing.
 */
const backBox = slot<{ h: number; m: number }>();
const msBackToStart = withDrawn(
  backBox,
  multiStep({
    situationType: 'part-whole',
    cognitiveOp: 'wind-the-clock-back',
    posing: 'inverse-start',
    usesPriorSkill: true,
    draw: (r) => {
      const h = r.int(1, 12);
      const main = r.int(20, 30);
      const setup = r.int(5, 10);
      const finish = r.int(main + setup + 3, 59);
      const event = r.pick(EVENTS);
      backBox.last = { h, m: finish };
      return {
        prompt: `[image: ${clockAlt(h, finish)}] ${opens(event)} finished at ${minutesPastPhrase(h, finish)}, the time on the clock. It lasted ${countNoun(main, 'minutes')}, and the ${countNoun(setup, 'minutes')} before it were spent setting out the chairs. At how many minutes past ${h} did the chair-setting begin?`,
        initN: finish,
        steps: [
          { op: 'sub', n: main, d: 1 },
          { op: 'sub', n: setup, d: 1 },
        ],
        units: 'minutes',
        hints: [
          'Does the time on this clock belong to the beginning of the story, or to its end?',
          'Wind the face back one stretch at a time, starting with the stretch nearest the end.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  ({ h, m }) => ({ figure: face(h, m, assertsParam('initN', 'minutes-past')) }),
);

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC18 = makeWeekBuilder({
  level: 'C',
  week: 18,
  conceptId: 'time-to-the-minute',
  conceptName: 'Time to the minute',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B12, B17, C7],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the minute marks ride in fives',
  conceptFamily: 'operation',
  deepeningDelta:
    'B12 read the hour and the half, B17 added the quarters — three weeks in which every time a clock showed landed on a numeral, so the numerals could be memorised as four fixed pictures. C18 removes that floor: the long hand may stop anywhere, which forces the two scales apart (numerals worth five, marks worth one), and the short hand stops being a pointer at a number and becomes a hand that creeps the whole way round while the long one travels.',
  explanation: {
    hook:
      'Two hands, twelve numbers, and sixty minutes to name — the numbers cannot possibly be minutes. So what are they worth, and where have the other forty-eight hiding places gone?',
    whyBeforeHow:
      'A clock face has sixty minutes on it but only twelve numerals, and that is exactly why the numerals cannot be read as minutes: the minute marks ride in fives, so the numeral 7 is not seven minutes, it is thirty-five, and the small marks in between are the single minutes it skipped. Count round in fives to the numeral, then count the small marks one at a time, and you can name any minute of the hour. The short hand needs the same care, because it does not sit on its numeral waiting for the hour to end — it creeps the whole way round while the long hand goes once round the face. That is why a time near the end of an hour is the dangerous one: the short hand is almost touching the next numeral, and naming the numeral it is NEAREST gives an hour that has not started yet.',
    script: [
      {
        say: 'Watch which hand I read first. The LONG hand tells me the minutes, so I start there and count round in fives — five, ten, fifteen, twenty, twenty-five, thirty, thirty-five. It is pointing at the 7, and the 7 is worth thirty-five minutes. The numerals ride in fives; they never mean themselves.',
        visual: 'A clock face with the long hand on the 7 and every single-minute mark drawn.',
        figure: clockFigure({ h: 4, m: 35 }, { marks: 'minutes', highlight: 'minute' }),
      },
      {
        say: 'Now a face where the long hand has gone past the 7 and stopped between two marks. I count in fives to the 7 — thirty-five — and then I count the little marks one at a time: thirty-six, thirty-seven, thirty-eight. The fives get me most of the way; the single marks finish the job.',
        visual: 'The same face with the long hand three small marks past the 7.',
        figure: clockFigure({ h: 4, m: 38 }, { marks: 'minutes', highlight: 'minute' }),
      },
      {
        say: 'Here is the one that catches everybody. Look at the SHORT hand — it is a whisker away from the 3. My eye wants to say three o\'clock. But the short hand only ARRIVES at the 3 when the long hand comes back to the top, and the long hand is nowhere near the top yet. So which hour are we still inside?',
        visual: 'A clock at five minutes to three: the short hand almost touching the 3, the long hand on the 11.',
        figure: clockFigure({ h: 2, m: 55 }, { marks: 'minutes', highlight: 'hour' }),
      },
      {
        say: 'One last habit, for the questions that ask how LONG something took. Before I count anything I check roughly how big the answer should be: if the long hand has travelled less than halfway round, the answer has to be under half an hour, and if I ever land above sixty I have counted right past the hour and must start again.',
        visual: 'A clock at ten past four, with the long hand only a sixth of the way round the face.',
        figure: clockFigure({ h: 4, m: 10 }, { marks: 'minutes' }),
      },
    ],
    summary:
      'The long hand tells the minutes: count round in fives to the numeral, then the single marks one at a time. The short hand tells the hour, and it creeps — near the end of an hour it is almost at the next numeral, so name the hour it has NOT reached yet. To find how long something lasts, count on from the first mark to the second, and check that the size of your answer makes sense.',
    vocabulary: [
      { term: 'minute mark', kidGloss: 'one of the sixty little marks round the edge — each one is a single minute' },
      { term: 'five-minute marks', kidGloss: 'the twelve numerals; each one is five minutes further round than the last' },
      { term: 'past and to', kidGloss: 'before the half hour we count minutes PAST the hour; after it we count minutes TO the next one' },
      { term: 'elapsed time', kidGloss: 'how many minutes pass between one time and another' },
    ],
  },
  guidedExamples: [
    {
      ...ge(18, 1, 'modeled', 'The short hand is almost touching the 3 and the long hand is on the 11. What time does the clock show?', [
        {
          teacherSay:
            'Watch me read this face in the right order, because the order is what keeps me safe. I take the LONG hand first: I count round in fives — five, ten, fifteen — all the way to the 11, and that lands me on fifty-five minutes. Fifty-five minutes of this hour have gone.',
        },
        {
          teacherSay:
            'Now the short hand, and here is where I slow down. It is a whisker from the 3, so my eye wants to say three. But it only reaches the 3 when the long hand comes back to the top, and the long hand still has five minutes to travel — so which hour have we not finished yet?',
          expected: '2',
        },
      ], '2:55'),
      visual: 'A clock at five minutes to three, with every minute mark drawn.',
      figure: clockFigure(
        { h: 2, m: 55 },
        {
          marks: 'minutes',
          alt: 'a clock face where the short hand has nearly reached the 3, and the long hand points at the 11',
          asserts: { of: 'time', ...assertsAnswer },
        },
      ),
    },
    {
      ...ge(18, 2, 'completion', 'The reading circle begins at 2:10 and finishes at 2:45. How many minutes does it last?', [
        { teacherSay: 'Which of these two times does the circle reach LAST?', expected: 'the finishing time' },
        { childDo: 'Count on round the face in fives from the first mark to the second, and say how many minutes that is.', expected: '35' },
      ], '35'),
      visual: 'A clock at ten past two — where the reading circle begins. The finishing mark is yours to count on to.',
      figure: clockFigure(
        { h: 2, m: 10 },
        { marks: 'minutes', alt: 'a clock face where the short hand is just past the 2, and the long hand points at the 2' },
      ),
    },
    ge(18, 3, 'prompted', 'The art lesson finished at 50 minutes past 3, and it began at 3:15. Tidying up then took 10 minutes more. How many minutes passed from the start of the lesson until the tidying was done?', [
      { childDo: 'Find the length of the lesson first, then bring in the stretch that follows it.', expected: '45' },
    ], '45'),
    {
      // Independent stage: the face and nothing else. Deciding which hand to read
      // first IS the task here, so no hand is highlighted and no count is begun.
      ...ge(18, 4, 'independent', 'The short hand has nearly reached the 8 and the long hand is three small marks past the 9. Write the time in numerals. Solve cold.', [
        { childDo: 'Read the long hand to its numeral in fives, then the marks after it, and only then name the hour.', expected: '7:48' },
      ], '7:48'),
      visual: 'A clock face with every minute mark drawn and neither hand marked out.',
      figure: clockFigure(
        { h: 7, m: 48 },
        {
          marks: 'minutes',
          alt: 'a clock face where the short hand has nearly reached the 8, and the long hand is between the 9 and the 10',
          asserts: { of: 'time', ...assertsAnswer },
        },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: read the face, count a gap on the five-marks, build a
    // face from a spoken time. Single-step only, and the B17 warm-up puts last
    // term's coarser reading on the same page as this week's finer one.
    [
      { gen: wQuarterClock, diff: 2 },
      { gen: wFives, diff: 2 },
      { gen: wSubMinutes, diff: 2 },
      { gen: readMinute, diff: 2 },
      { gen: elapsedBridge, diff: 3 },
      { gen: setHands, diff: 3 },
    ],
    // Day 2 — fluency + application: the two scales forced apart, the estimate-first
    // "minutes to" item, and the first genuine two-step.
    [
      { gen: wAddMinutes, diff: 2 },
      { gen: discrimMarks, diff: 3 },
      { gen: sitMinutesToHourEstimate, diff: 3 },
      { gen: sitFinishTime, diff: 3 },
      { gen: msLongerBy, diff: 4 },
      { gen: readMinute, diff: 3 },
    ],
    // Day 3 — interleave: the two discriminations (the drift, then the two
    // scales) alternating with a forward two-step and an inverse-start one, so
    // the shape of the page never tells the child which thinking is coming. The
    // two two-steps are kept apart because both draw a FINISH clock, and two
    // finish clocks side by side read as one item printed twice.
    [
      { gen: wQuarterClock, diff: 2 },
      { gen: drivenByDrift, diff: 3 },
      { gen: msThenMore, diff: 4 },
      { gen: discrimMarks, diff: 4 },
      { gen: msBackToStart, diff: 4 },
      { gen: setHands, diff: 3 },
    ],
    // Day 4 — word problems: three two-steps (one of them wound backwards from
    // the finishing time) with the two single-step stories between them, so
    // "it must be two steps" never becomes the cue and no two finish clocks are
    // ever adjacent.
    [
      { gen: msLongerBy, diff: 4 },
      { gen: sitFinishTime, diff: 4 },
      { gen: msThenMore, diff: 4 },
      { gen: sitMinutesToHourEstimate, diff: 3 },
      { gen: msBackToStart, diff: 5 },
    ],
    // Day 5 — non-computational: the hour-drift error-analysis, the schedule +
    // elapsed production, and the claim that settles what the short hand does
    // (+ a ramped warm-up).
    [
      { gen: wFives, diff: 2 },
      { gen: eaHourDrift, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Here is part of one morning. Story time runs from 10:05 to 10:35. The class then spends 5 minutes tidying, and the spelling quiz runs from 10:40 until 10:55. Write how many minutes story time lasts and how many minutes the quiz lasts. Then write one question about this morning that CANNOT be answered without using both of those lengths.',
          value: 'story time lasts 30 minutes and the quiz lasts 15 minutes, and a question needing both asks how many minutes of the morning the two together fill',
          acceptableForms: ['30', '15', 'both', 'together', 'altogether', 'how many minutes'],
          keywords: true,
          hints: [
            'Which two marks on the face does each part of the morning run between?',
            'Find the length of each part first, then look for a question that one length alone cannot answer.',
          ],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: when the long hand is pointing at the 11, the short hand is nearer to the next numeral than to the numeral that names the hour. In one sentence, explain how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Treats the short hand\'s creep as something that happens at certain hours, when it happens through every hour on the face.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads the short hand as though it jumped to its numeral and waited there until the hour was over.',
            },
          ],
          hints: [
            'Where has the short hand travelled to by the time the long hand comes back to the top?',
            'Picture the short hand at the start of an hour and again just before that hour ends, and say how far it has moved.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: if your child reads five to three as "three fifty-five", do not correct the number — cover the long hand with your thumb and ask what the short hand alone can prove. It can prove the hour has STARTED; it cannot prove the hour has finished. That one question fixes the mistake faster than any rule, and it is the same question that will keep them right on a station clock for the rest of their lives.',
  ],
  puzzle: (r) => {
    const h = r.int(1, 11);
    const start = r.int(2, 9);
    const window = 50;
    const first = r.int(12, 20);
    const second = r.int(12, 20);
    const changeover = 5;
    const left = window - first - second - changeover;
    const [e1, e2] = twoEvents(r);
    return {
      id: 'C18-PZ-01',
      title: 'Puzzle Grove: The Empty Minutes',
      puzzleType: 'logic',
      prompt: `[image: ${clockAlt(h, start)}] The school hall is free from ${minutesPastPhrase(h, start)} — the time on the clock — until ${minutesPastPhrase(h, start + window)}. ${opens(e1)} needs ${countNoun(first, 'minutes')} in the hall and ${e2} needs ${countNoun(second, 'minutes')}, and ${countNoun(changeover, 'minutes')} must be left empty between them so one group can leave before the other arrives. Both fit. How many minutes of the free time are still empty at the end — and how can you be sure that no other order of the two would leave more?`,
      figure: clockFigure(
        { h, m: start },
        { marks: 'minutes', alt: clockAlt(h, start) },
      ),
      answer: {
        value: String(left),
        acceptableForms: [countNoun(left, 'minutes')],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'How many minutes long is the free stretch, from its first mark to its last?',
        'Lay the two activities and the changeover end to end inside that stretch, then read what is still empty.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 3, cognitiveOp: 'schedule-fit' },
  sprint: {
    skill: 'Subtraction within 100 — the count from one minute mark to another',
    sourceWeek: B14,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 24, max: 59, regroup: 'mixed' },
  },
  mastery: [
    { gen: readMinute, diff: 3 },
    { gen: msLongerBy, diff: 4 },
    { gen: elapsedBridge, diff: 3 },
    { gen: msThenMore, diff: 4 },
    { gen: setHands, diff: 3 },
    { gen: msBackToStart, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step face work — read a face to the minute, count a gap that rides in fives, and build a face from a spoken time (that one keeps its empty-face affordance). 02/04/06: two-step elapsed work — compare two durations, a stretch and one more stretch, and an inverse-start story wound back from its finishing time, each keeping the finish-clock figure it asserts against. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'hour-hand-drift',
      description: 'Names the hour from the numeral the short hand is NEAREST, so a time close to the end of an hour is read one whole hour too far.',
      exampleWrongAnswer: 'a clock at 2:55 read as 3:55',
      distractorRationale: 'Offer the same minutes with the next hour in front of them.',
      reteachPointer: 'explanation/script[2] (the short hand only ARRIVES at the next numeral when the long hand comes back to the top)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'marks-counted-in-fives',
      description: 'Counts every mark round the face in fives, so the single-minute marks between the numerals are each read as five minutes.',
      exampleWrongAnswer: 'a long hand three marks past the 7 read as 7:50 instead of 7:38',
      distractorRationale: 'Offer the time reached by counting the single-minute marks in fives as well.',
      reteachPointer: 'explanation/script[1] (the fives get you to the numeral; the small marks finish the job)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-the-numeral',
      description: 'Reads the numeral the long hand has just passed and stops there, so the single minutes after it never reach the answer — or answers a "how long?" question with a time of day.',
      exampleWrongAnswer: 'a long hand three marks past the 7 read as 7:35',
      distractorRationale: 'Offer the time at the numeral the long hand has just passed.',
      reteachPointer: 'guidedExamples/C18-GE-01 (read the long hand all the way to where it actually stopped)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'elapsed-count-slip',
      description: 'Chooses the right two marks but loses the thread counting between them, landing five minutes out, or counts straight past the hour instead of stopping at it.',
      exampleWrongAnswer: 'the stretch from 2:15 to 2:50 counted as 30 minutes',
      distractorRationale: 'Offer the elapsed count that is one five-minute mark short.',
      reteachPointer: 'guidedExamples/C18-GE-02 (say the running count aloud at every numeral), then the 2-minute subtraction sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Time to the minute — reading and writing any time on an analog face (the numerals are worth five minutes each, the small marks one), watching the short hand creep so a time near the end of an hour is not read an hour too far, and working out how many minutes pass between two times inside the same hour.',
    improvingCandidates: [
      'counting round the face in fives to the numeral, then the single marks one at a time',
      'checking the short hand against the long one before naming the hour',
      'counting on from one time to another to find how long something lasted',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'times near the end of an hour — the short hand is almost at the next numeral, and it is the hour it has NOT reached that counts',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping the two scales on the face apart: the numerals ride in fives, the little marks are single minutes',
      },
      {
        errorTag: 'task-comprehension',
        text: 'telling a question about a TIME apart from a question about a LENGTH of time',
      },
      {
        errorTag: 'procedure-slip',
        text: 'holding the count steady from one mark to the next — the sprints keep that part quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted round the face in fives and then checked the short hand before you named the hour — that order is exactly what this week is built on.',
      questionForChild: 'When the long hand is on the 11 and the short hand is almost at the 6, what time is it — and how do you know it is not nearly seven?',
      schoolSyncHook: 'If your child\'s class says "five to three" where we write 2:55, tell us and we will lead with the spoken form.',
    },
    vocabularyForParent: [
      'the five-minute marks (the twelve numerals, each worth five minutes)',
      'minute marks (the sixty little marks — one minute each)',
      'elapsed time (how many minutes pass between two times)',
    ],
  },
});
