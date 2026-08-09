/**
 * Level C · Week 5 — "Two-step +/− stories" (conceptId: two-step-add-sub-stories).
 *
 * FILL-ARCHITECTURE §5 row C5: anchor "the plan before the math"; the concept IS
 * multi-step and **inverse-start enters here**; error-analysis "does the steps in
 * sentence order when that is the wrong order"; discrimination "which operation
 * comes FIRST"; Day-5 signature "write-the-question production".
 *
 * The week's whole claim is that a two-step story is decided BEFORE any
 * arithmetic happens, so the content is built to force the planning move rather
 * than decorate it:
 *  - two `posing: 'inverse-start'` items (C5 is where the ceiling lifts): the
 *    stated quantity is the RESULT of the first change, so the opening move is
 *    the inverse the sentence order does not hand over — a rack counted AFTER
 *    the caps went out, and a combined total that never names either part;
 *  - two discriminations that are the content, not an add-on: one asks which
 *    calculation comes FIRST in a plain three-clause story, the other asks
 *    whether a "before this morning" question undoes a change or repeats it;
 *  - a generated error-analysis whose shown wrong number is the genuine output of
 *    following the story's joining word instead of planning — the student's
 *    ARITHMETIC is correct (208 + 75 really is 283), which is exactly why the
 *    item cannot be answered by re-checking the digits;
 *  - a Day-1 "hidden middle" item: the story runs on past the moment the question
 *    names, so the child has to stop where the plan stops. That is the two-step
 *    idea with only one step of load.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7): every figure on a DAY ITEM shows
 * what the child already KNOWS — the bar the story starts from, the whole with
 * one part named, the count marked on a line — and asserts it against the item's
 * own drawn param. A bar model is the natural anchor for a two-step story, and
 * its honest form here is the STRUCTURE (whole, named part, blank part), never a
 * completed calculation: the picture is the plan, the arithmetic stays the
 * child's. The pictures that show a whole two-step journey live where the answer
 * is already on the page — the lesson script and the guided examples.
 *
 * Retrieval is backward-only into C2/C3/C4 (compare, round, ± within 1,000) and
 * into B15 compare-and-change stories — the single-step ancestor of every
 * comparison this week composes.
 */

import { addWhole, asWarmup, classify, compareWhole, reasoning, roundWhole, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, wholeMoney } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswerOf, assertsParam, barModel, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B14 = { level: 'B' as const, week: 14 };
const B15 = { level: 'B' as const, week: 15 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two distinct names, for the comparison warm-up. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep) have no figure slot, and lib/
// is not ours to edit, so this wrapper does what `withEstimateFirst` does: it
// works entirely inside the returned closure, takes no new rng draw, and leaves
// the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It reads
// the drafted item's `generator.params` — the very numbers the answer was
// computed from — so the figure law ("built from the item's own drawn values")
// holds by construction, exactly as it does for a figure built inside a
// generator. (Pattern copied from c06, the Level-C exemplar.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
interface ChainStep {
  op: string;
  n: number;
  d: number;
}
const numOf = (p: Params, k: string): number => Number(p[k]);
const stepsOf = (p: Params): ChainStep[] => (p.steps as ChainStep[]) ?? [];

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000, the arithmetic one line of every plan runs on. */
const wAdd = asWarmup(addWhole(105, 480), C3);
/** C4 — subtraction within 1,000, the other line. */
const wSub = asWarmup(subWhole(120, 940), C4);
/** C2 — compare, so "how many more" keeps its meaning. */
const wCompare = asWarmup(compareWhole(3), C2);
/** C2 — rounding, which is what the Day-5 size check leans on. */
const wRound = asWarmup(roundWhole(1, 108, 986), C2);

/**
 * B15 — the compare-and-change story in its ONE-step form. This is the ancestor
 * of the week: a comparison the child can already do in a single line, so the
 * new load is the planning, never the arithmetic.
 */
const wCompareStory = asWarmup(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'sub',
    draw: (r) => {
      const [n1, n2] = two(r);
      const big = r.int(160, 620);
      const small = r.int(45, big - 60);
      return {
        prompt: `${n1} has ${countNoun(big, 'stamps')}. ${n2} has ${countNoun(small, 'stamps')}. How many more stamps does ${n1} have than ${n2}?`,
        answerValue: String(big - small),
        templateId: 'd_sub_v1',
        params: { a: big, b: small },
        units: 'stamps',
        hints: [
          'Is the question asking for a whole collection? Or for the gap between two of them?',
          'Lay the two collections side by side. Read off how far the longer one reaches past the shorter.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B15,
);

// ---------------------------------------------------------------------------
// Single-step stories — the two lines a plan is built out of, plus the item
// that isolates the planning move with only one line of arithmetic.
// ---------------------------------------------------------------------------

/** Join. The plainest one-line story, so the contrast with a two-step is sharp. */
const sitFestival = situation({
  situationType: 'combine',
  cognitiveOp: 'add',
  draw: (r) => {
    const morning = r.int(126, 470);
    const afternoon = r.int(126, 470);
    return {
      prompt: `A festival counted ${countNoun(morning, 'visitors')} before lunch and ${countNoun(afternoon, 'visitors')} after lunch. How many visitors came to the festival that day?`,
      answerValue: String(morning + afternoon),
      templateId: 'd_add_v1',
      params: { a: morning, b: afternoon },
      units: 'visitors',
      hints: [
        'Does this story put two counts together, or take one away from the other?',
        'Draw the two counts end to end on one bar. Then read what the whole bar holds.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** Separate. Same one-line shape, opposite move — the second half of every plan. */
const sitBakery = situation({
  situationType: 'part-whole',
  cognitiveOp: 'sub',
  draw: (r) => {
    const baked = r.int(320, 940);
    const sold = r.int(115, baked - 80);
    return {
      prompt: `A bakery baked ${countNoun(baked, 'rolls')} at dawn and sold ${countNoun(sold, 'rolls')} before lunch. How many rolls are still on the trays?`,
      answerValue: String(baked - sold),
      templateId: 'd_sub_v1',
      params: { a: baked, b: sold },
      units: 'rolls',
      hints: [
        'Is the question about everything that was baked, or only about what is still there?',
        'Start from the whole batch and take off the part that has gone.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * The hidden middle, isolated. The story runs on PAST the moment the question
 * names ("later she gave some away"), so the child must stop the plan where the
 * question stops — the two-step idea carrying only one line of arithmetic, which
 * is why it belongs on Day 1 and not on Day 4.
 *
 * `cognitiveOp: 'hidden-middle'` is its own BB-G5 cluster on purpose: recovering
 * an unstated intermediate is a different cognitive move from adding, even when
 * the sum is the same sum.
 */
const sitHiddenMiddle = situation({
  situationType: 'multi-stage',
  cognitiveOp: 'hidden-middle',
  draw: (r) => {
    const had = r.int(145, 520);
    const found = r.int(64, 245);
    const name = one(r);
    return {
      prompt: `${name} had ${countNoun(had, 'shells')} in a collection box. On the beach that afternoon ${name} found another ${countNoun(found, 'shells')}. They all went into the box. Later in the week some of the shells were given away. How many shells were in the box just BEFORE any were given away?`,
      answerValue: String(had + found),
      templateId: 'd_add_v1',
      params: { a: had, b: found },
      units: 'shells',
      hints: [
        'Which moment in this story does the question ask about? The very end, or a moment part-way through?',
        'Stop reading at the moment the question names. Work out only what has happened up to there.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: the week's own form. Two are posed FORWARD (the changes arrive in
// the order they happen) and two INVERSE-START (the stated quantity is the
// result, so the opening move is an inverse the sentence order hides).
// ---------------------------------------------------------------------------

/**
 * Forward: a start, something arrives, something leaves. Figure = the START bar
 * only — the quantity the child already knows — so the picture anchors the plan
 * without performing either line of it.
 */
const msStoreRoom = withFigure(
  multiStep({
    situationType: 'multi-stage',
    draw: (r) => {
      const start = r.int(180, 520);
      const arrive = r.int(85, 260);
      const leave = r.int(70, Math.min(240, start + 85 - 60));
      return {
        prompt: `[image: one bar for the ${start} cartons the store room begins with] A store room holds ${countNoun(start, 'cartons')}. A delivery brings ${countNoun(arrive, 'cartons')} in. Later that day ${countNoun(leave, 'cartons')} go out to the shops. How many cartons are in the store room then?`,
        initN: start,
        steps: [
          { op: 'add', n: arrive, d: 1 },
          { op: 'sub', n: leave, d: 1 },
        ],
        units: 'cartons',
        hints: [
          'Which change happens first in this story, and which one happens after it?',
          'Deal with the delivery first, then take off what goes out — one line each.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const start = numOf(p, 'initN');
    return barModel(
      [{ label: 'in the store room at the start', segments: [{ value: start, label: String(start) }] }],
      {
        alt: `one bar for the ${countNoun(start, 'cartons')} already in the store room; the delivery and the load that goes out are not drawn`,
        asserts: assertsParam('initN'),
      },
    );
  },
);

/** Forward, in money: one amount, two purchases off it. The change story. */
const msFairMoney = multiStep({
  situationType: 'money-change',
  draw: (r) => {
    const purse = r.pick([30, 40, 50, 60, 80] as const);
    const p1 = r.int(7, 18);
    const p2 = r.int(11, Math.min(26, purse - p1 - 6));
    const name = one(r);
    const item = r.pick(['a raffle ticket', 'a plant', 'a jar of jam', 'a badge'] as const);
    return {
      prompt: `${name} takes ${wholeMoney(purse)} to the school fair. ${name} buys ${item} for ${wholeMoney(p1)}. ${name} also buys a book for ${wholeMoney(p2)}. How much money does ${name} have left?`,
      initN: purse,
      steps: [
        { op: 'sub', n: p1, d: 1 },
        { op: 'sub', n: p2, d: 1 },
      ],
      units: 'dollars',
      acceptableForms: [wholeMoney(purse - p1 - p2)],
      hints: [
        'Does the question ask what was spent, or what is still in the purse?',
        'Take each purchase off the starting amount, one at a time.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * INVERSE-START #1 (PEDAGOGY-CEILING-REVIEW F3). The count the story hands you
 * is the count NOW, so both changes have to be run backwards: the caps that were
 * put out come OFF, the caps that were sold go BACK ON. Every joining word in
 * the sentence points the opposite way to the calculation it asks for, which is
 * the whole reason the plan has to be written before the math.
 *
 * Figure = a number line with only the count the child was GIVEN marked on it.
 * The line's length depends on that count alone, so it cannot leak the answer,
 * and the picture says the one true thing about the story's shape: you are
 * starting from the END and walking back.
 */
const msCapRack = withFigure(
  multiStep({
    situationType: 'multi-stage',
    posing: 'inverse-start',
    usesPriorSkill: true,
    draw: (r) => {
      const putOut = r.int(45, 140);
      const sold = r.int(35, 125);
      const now = r.int(putOut + 95, 470);
      return {
        prompt: `[image: a number line with the ${now} caps on the rack now marked on it] The rack in the sports shop holds ${countNoun(now, 'caps')} NOW. Earlier today the shopkeeper put out ${countNoun(putOut, 'caps')}. Before that, ${countNoun(sold, 'caps')} were sold. How many caps were on the rack when the shop opened?`,
        initN: now,
        steps: [
          { op: 'sub', n: putOut, d: 1 },
          { op: 'add', n: sold, d: 1 },
        ],
        units: 'caps',
        hints: [
          'Does this count come from the start of the day? Or from the end of it?',
          'Walk the story backwards. Undo the most recent change first, then the one before it.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const now = numOf(p, 'initN');
    const max = Math.ceil((now + 20) / 50) * 50;
    return numberLine(
      {
        min: 0,
        max,
        step: 50,
        labels: 'majors',
        marks: [{ at: now, label: String(now), style: 'flag' }],
      },
      {
        alt: `a number line from 0 to ${max} with the ${countNoun(now, 'caps')} now on the rack marked on it`,
        asserts: assertsParam('initN', 'mark:0'),
      },
    );
  },
);

/**
 * INVERSE-START #2, in the part-whole family. The story states a COMBINED total
 * and names one part; the other part — the one the question is really about —
 * has to be uncovered before the second line can even be attempted.
 *
 * Figure = the part-whole bar: whole braced, one part named, the rest left
 * blank. That is the plan drawn, and it hands over nothing: the blank part is
 * not the answer (the answer is two moves further on), and no number labels it.
 */
const msBottleTops = withFigure(
  multiStep({
    situationType: 'part-whole',
    posing: 'inverse-start',
    usesPriorSkill: true,
    draw: (r) => {
      const total = r.int(430, 940);
      const classB = r.int(140, Math.floor(total / 2));
      const classA = total - classB;
      const given = r.int(55, classA - 60);
      return {
        prompt: `[image: one long bar for all ${total} bottle tops, with the ${classB} that Class B collected marked off at one end] Class A and Class B collected ${countNoun(total, 'bottle tops')} altogether. Class B collected ${countNoun(classB, 'bottle tops')}. Class A then gave ${countNoun(given, 'bottle tops')} to the recycling van. How many bottle tops does Class A have left?`,
        initN: total,
        steps: [
          { op: 'sub', n: classB, d: 1 },
          { op: 'sub', n: given, d: 1 },
        ],
        units: 'bottle tops',
        hints: [
          'Which amount does this story name outright? Which one has to be uncovered before you can go on?',
          'Take the named part off the whole first. That uncovers the part the question is really about.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) => {
    const total = numOf(p, 'initN');
    const known = stepsOf(p)[0]?.n ?? 0;
    return barModel(
      [
        {
          label: 'both classes together',
          segments: [
            { value: known, label: String(known) },
            { value: total - known, fill: 'none' },
          ],
          total: String(total),
        },
      ],
      {
        scaleMax: total,
        alt: `one long bar for all ${countNoun(total, 'bottle tops')}, with the ${countNoun(known, 'bottle tops')} Class B collected marked off at one end and the rest of the bar left blank`,
        asserts: assertsParam('initN'),
      },
    );
  },
);

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so the
 * generator is never drawn twice with the same hint ladder (the dedup gate is
 * seed-invariant and counts normalized ladders across the whole core).
 *
 * The probe is a genuine call: a cut and a join pull in opposite directions, so
 * "longer or shorter?" cannot be answered by reflex — it needs the two numbers
 * compared before either is used.
 */
const msWireCut = multiStep({
  situationType: 'measurement',
  draw: (r) => {
    const len = r.int(320, 880);
    const cut = r.int(85, 260);
    const join = r.int(40, 195);
    const name = one(r);
    return {
      prompt: `A workshop has a wire ${countNoun(len, 'cm')} long. ${name} cuts ${countNoun(cut, 'cm')} off one end. Then ${name} joins a new piece ${countNoun(join, 'cm')} long onto the other end. How long is the wire now?`,
      initN: len,
      steps: [
        { op: 'sub', n: cut, d: 1 },
        { op: 'add', n: join, d: 1 },
      ],
      units: 'cm',
      hints: [
        'Is the question about the piece that was cut off? Or about the wire left in the workshop?',
        'Take the cut off first, then join the new piece onto what remains.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const msWireCutEstimate = withEstimateFirst(
  msWireCut,
  'will the wire end up longer or shorter than it was at the start?',
);

// ---------------------------------------------------------------------------
// Discrimination — "which operation comes FIRST", forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * The recipe's discrimination. A plain three-clause story, and the only question
 * asked is which calculation opens the plan. Both distractors are real plans a
 * child writes: one starts from the change the story mentions LAST, the other
 * fuses the two changes into a single number and never touches the start.
 */
const discrimWhichFirst = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-operation',
  draw: (r) => {
    const start = r.int(240, 780);
    const gave = r.int(45, 160);
    let bought = r.int(45, 160);
    // Two distractors that print the same number would offer the child a
    // choice between two identical options.
    if (gave + bought === start - gave) bought += 1;
    if (bought === gave) bought = gave === 160 ? 45 : bought + 1;
    const name = one(r);
    return {
      prompt: `${name} started the week with ${countNoun(start, 'stickers')} in an album. ${name} gave ${countNoun(gave, 'stickers')} to a friend. Then ${name} bought another ${countNoun(bought, 'stickers')}. You want to know how many stickers are in the album now. Which calculation comes FIRST?`,
      correct: `${start} − ${gave}`,
      distractors: [
        {
          text: `${start} + ${bought}`,
          errorTag: 'task-comprehension',
          rationale: 'Opens with the change the story mentions last, so the stickers that were given away are still sitting in the album.',
        },
        {
          text: `${gave} + ${bought}`,
          errorTag: 'concept-misconception',
          rationale: 'Fuses the two changes into one number, which loses the order they happened in and never touches the amount the album started with.',
        },
      ],
      hints: [
        'Which of these things happened to the album first?',
        'Follow the story in time order. Write only the move that the first change asks for.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * The inverse-start discrimination: does a "before this morning" question undo
 * the change, or repeat it? The add distractor IS the output of reading the
 * joining word as an instruction; the bare-count distractor is the child who
 * never acts on the change at all.
 */
const discrimUndoOrDo = discrimination({
  variant: 'structural',
  cognitiveOp: 'plan-order',
  draw: (r) => {
    const now = r.int(260, 880);
    const added = r.int(45, 170);
    return {
      prompt: `A jar holds ${countNoun(now, 'marbles')} now. This morning ${countNoun(added, 'marbles')} were dropped into the jar. Which of these tells how many marbles were in the jar before this morning?`,
      correct: `${now} − ${added}`,
      distractors: [
        {
          text: `${now} + ${added}`,
          errorTag: 'concept-misconception',
          rationale: 'Reads the word for dropping marbles in as an instruction to add, even though the count the story gives already has those marbles inside it.',
        },
        {
          text: String(now),
          errorTag: 'task-comprehension',
          rationale: 'Answers with the count taken after this morning, so the change the question asks you to look past is never undone.',
        },
      ],
      hints: [
        'Was the count in this story taken before the change, or after it?',
        'To reach an earlier moment, undo the change the story describes rather than repeating it.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's error: the steps done in SENTENCE order when that is the wrong
// order. The verify template supplies the honest pair — the truth is the inverse
// (a − b) and the shown wrong value is the genuine output of following the
// story's joining word (a + b). What makes this the week's item rather than an
// arithmetic item: the student's ADDITION IS CORRECT. There is nothing to find
// by re-checking the digits, so the only way in is to read the story again and
// ask which moment the count belongs to.
// ---------------------------------------------------------------------------

const eaSentenceOrder = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(180, 460), b: r.int(45, 130), op: '-', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A bus pulled up at the school carrying ${countNoun(Number(p.a), 'riders')}. At the stop just before the school, ${countNoun(Number(p.b), 'riders')} had climbed on. A student worked out how many riders the bus carried before that stop. The student wrote ${p.a} + ${p.b} = ${v.wrong}.`,
    extension: 'Write the plan this story really needs. Work out how many riders the bus carried before that stop. Then say in one sentence which words the student was following.',
    hints: [
      'Does this count belong to the moment before the riders climbed on? Or the moment after?',
      'Draw the bus twice, once for each moment. Decide which of the two drawings should be the fuller one.',
    ],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC05 = makeWeekBuilder({
  level: 'C',
  week: 5,
  conceptId: 'two-step-add-sub-stories',
  conceptName: 'Two-step +/− stories',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [B15, C3, C4],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the plan before the math',
  conceptFamily: 'operation',
  deepeningDelta:
    'C3 and C4 taught the two calculations one at a time, with the operation named by the page. C5 supplies neither: the child decides how many steps there are, which one opens, and — new this week — whether the stated quantity is a starting point at all or the RESULT of a change that has to be undone first.',
  explanation: {
    hook:
      'Every two-step story hides a number in the middle that nobody says out loud. Find it and the story falls open. Reach for your pencil before you find it, and you are guessing.',
    whyBeforeHow:
      'A two-step story keeps one number to itself. That hidden middle number has to be found before anything else. So the first move in a two-step story is never arithmetic. It is choosing which question to answer first. That is why this week we write the plan before the math. Sentences do not always run in the order the work does. A story can hand you the ending amount first. Then it describes the changes that made it. When that happens, joining words are asking you to take away. Plan first and the two calculations are easy ones you already own. Compute first and the arithmetic can be perfect. The answer will still be the answer to a different question.',
    script: [
      {
        say: 'Watch what I do before I write anything at all. A store room holds 348 cartons. A delivery brings 126 more in. Then 95 cartons go out. I say my plan out loud first. Line one is the delivery. Line two is the load that leaves. Only then do I pick up my pencil.',
        visual: 'Three bars: the start, the start with the delivery added, and the bar after the load leaves.',
        figure: barModel(
          [
            { label: 'at the start', segments: [{ value: 348, label: '348' }] },
            { label: 'after the delivery', segments: [{ value: 348 }, { value: 126, label: '126', fill: 'hatch' }], total: '474' },
            { label: 'after the load leaves', segments: [{ value: 379, label: '379' }], total: '379' },
          ],
          { scaleMax: 474, alt: 'three bars: 348 at the start, 348 with 126 added on making 474, and 379 once 95 have gone out' },
        ),
      },
      {
        say: 'Now notice the 474. Nobody in that story ever said it. It is the number hiding in the middle. It only exists because I did the first line. Every two-step story has one, and uncovering it is the entire job of step one.',
        visual: 'One bar of 348 and 126 joined, braced as the middle number 474.',
        figure: barModel(
          [
            { label: 'the hidden middle', segments: [{ value: 348, label: '348' }, { value: 126, label: '126' }], total: '474' },
          ],
          { scaleMax: 474, alt: 'a bar of 348 joined to a bar of 126, braced together as 474 — the number the story never says' },
        ),
      },
      {
        say: 'Here is the story that tries to trip me. A rack holds 208 caps NOW, and 75 of them were put out this morning. The words "put out" pull me towards adding. But the 208 already has those 75 standing in it. So my first line has to take them off. The sentence order and the plan run opposite ways.',
        visual: 'A number line with a backward hop from the count now to the count before the caps went out.',
        figure: numberLine(
          {
            min: 0,
            max: 250,
            step: 50,
            labels: 'majors',
            marks: [
              { at: 133, label: '133', style: 'flag' },
              { at: 208, label: '208', style: 'flag' },
            ],
            hops: [{ from: 208, to: 133, label: 'undo the 75' }],
          },
          { alt: 'a number line from 0 to 250 with a backward hop from 208 to 133' },
        ),
      },
      {
        say: 'One more habit before the arithmetic. I ask roughly how big the answer ought to be. More cartons came in than went out. So a sensible ending sits a little above where I started. Say my answer landed far below 348. I would check my plan first, not my columns.',
        visual: 'The starting bar beside a sensible ending bar, only a little longer.',
        figure: barModel(
          [
            { label: 'at the start', segments: [{ value: 348, label: '348' }] },
            { label: 'a sensible ending', segments: [{ value: 379, label: '379' }] },
          ],
          { scaleMax: 474, alt: 'two bars side by side: 348 at the start and 379 at the end, only a little longer' },
        ),
      },
    ],
    summary:
      'Read the whole story before you write anything. Find the number hidden in the middle. Decide which question comes first. Write the plan before the math. Then work the two lines in that order. Check that your answer is the size the story led you to expect.',
    vocabulary: [
      { term: 'two-step story', kidGloss: 'a story that needs two calculations, one after the other' },
      { term: 'the plan', kidGloss: 'the two questions you decide to answer, written down before any working' },
      { term: 'hidden middle number', kidGloss: 'the number a two-step story never says — step one uncovers it' },
      { term: 'undo', kidGloss: 'work a change backwards to reach the count that came before it' },
    ],
  },
  guidedExamples: [
    {
      ...ge(5, 1, 'modeled', 'A store room holds 348 cartons. A delivery brings 126 more in. Later that day 95 cartons go out to the shops. How many cartons are in the store room then?', [
        {
          teacherSay:
            'Watch me read the whole story before I write a thing. Two changes happen, and they happen in an order: first cartons arrive, then cartons leave. So my plan has two lines. I know which line is which before I touch a number.',
        },
        {
          teacherSay: 'Line one only, then — the store room and the delivery arriving. What is the middle number that gives me?',
          expected: '474',
        },
      ], '379'),
      visual: 'The store room bar after the delivery, and the shorter bar left once the load has gone.',
      figure: barModel(
        [
          { label: 'after the delivery', segments: [{ value: 348, label: '348' }, { value: 126, label: '126' }], total: '474' },
          { label: 'after the load leaves', segments: [{ value: 379, label: '379' }], total: '379' },
        ],
        { scaleMax: 474, alt: 'a bar of 348 and 126 joined making 474, above a bar of 379 once 95 have gone out', asserts: assertsAnswerOf('bar:1') },
      ),
    },
    {
      ...ge(5, 2, 'completion', 'A rack holds 208 caps now. Earlier today the shopkeeper put out 75 caps, and before that 46 caps were sold. How many caps were on the rack when the shop opened?', [
        { teacherSay: 'Which end of the story does the 208 come from — the beginning, or the end?', expected: 'the end' },
        { childDo: 'Walk the story backwards one change at a time. Then say what the rack held when the shop opened.', expected: '179' },
      ], '179'),
      visual: 'A number line with the count now, and the backward hops that reach the opening count.',
      figure: numberLine(
        {
          min: 0,
          max: 250,
          step: 50,
          labels: 'majors',
          // COMPLETION fade: the child produces 179, so the line shows the
          // count it is given (208) and the direction of travel, and leaves the
          // destination unknown. Labelling it would answer the step (L33).
          marks: [
            { at: 179, style: 'unknown' },
            { at: 208, label: '208', style: 'flag' },
          ],
          hops: [{ from: 208, to: 179, label: 'wind the day back' }],
        },
        { alt: 'a number line from 0 to 250 with the count now at 208 and a backward hop to an unknown opening count' },
      ),
    },
    // "a book" second: the generator's second purchase is always a book, so the
    // GE must show a story shape the generator can actually produce.
    ge(5, 3, 'prompted', 'Ria takes $50 to the school fair. Ria buys a raffle ticket for $12 and a book for $19. How much money does Ria have left?', [
      { childDo: 'Say the plan out loud first, then work the two lines in that order.', expected: '19' },
    ], '$19'),
    {
      // Independent stage: the WHOLE and the one named part, nothing else.
      // Uncovering the unnamed part IS the task here, so labelling the blank
      // segment would hand the child the plan the item exists to ask for.
      ...ge(5, 4, 'independent', 'Two crates hold 486 apples altogether. The first crate holds 213 apples. Then 95 apples are taken out of the second crate. How many apples are left in the second crate? Solve cold.', [
        { childDo: 'Uncover the second crate first, then deal with what is taken out.', expected: '178' },
      ], '178'),
      visual: 'One long bar for both crates, with the first crate marked off and the second left blank.',
      figure: barModel(
        [
          {
            label: 'both crates',
            segments: [{ value: 213, label: '213' }, { value: 273, fill: 'none' }],
            total: '486',
          },
        ],
        { scaleMax: 486, alt: 'one long bar of 486 for both crates, with 213 marked off at one end for the first crate and the rest of the bar left blank' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the two single lines a plan is built from, plus the
    // hidden-middle item that isolates the planning move. No two-step load yet.
    [
      { gen: wAdd, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: wCompareStory, diff: 2 },
      { gen: sitFestival, diff: 2 },
      { gen: sitBakery, diff: 3 },
      { gen: sitHiddenMiddle, diff: 3 },
    ],
    // Day 2 — fluency + application: the first discrimination, the estimate-first
    // metacognition, and the first genuine two-step story.
    [
      { gen: wSub, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: discrimWhichFirst, diff: 3 },
      { gen: msWireCutEstimate, diff: 4 },
      { gen: msStoreRoom, diff: 4 },
      { gen: sitHiddenMiddle, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations against the week's first
    // inverse-start story and a forward money two-step, so the child cannot tell
    // from the page shape which kind of plan is coming.
    [
      { gen: wCompare, diff: 2 },
      { gen: discrimUndoOrDo, diff: 3 },
      { gen: discrimWhichFirst, diff: 4 },
      { gen: msCapRack, diff: 4 },
      { gen: msFairMoney, diff: 4 },
      { gen: sitFestival, diff: 3 },
    ],
    // Day 4 — word problems: four two-steps, two of them inverse-start, with one
    // single-step story mixed in so "it must be two steps" never becomes the cue.
    [
      { gen: msStoreRoom, diff: 4 },
      { gen: msBottleTops, diff: 5 },
      { gen: msCapRack, diff: 5 },
      { gen: msFairMoney, diff: 4 },
      { gen: sitBakery, diff: 3 },
    ],
    // Day 5 — non-computational: the sentence-order error-analysis, the
    // write-the-question production, and the claim that settles when sentence
    // order and plan order agree (+ a ramped warm-up).
    [
      { gen: wRound, diff: 2 },
      { gen: eaSentenceOrder, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Here is a situation, and one number that comes out of it. At a book fair there are 38 storybooks and 24 puzzle books on the table. Then 12 books are sold before lunch. Working through this situation in two steps lands on the number 50. Write the QUESTION that 50 answers. Then write the two steps of the plan that reach it.',
          value: 'how many books are still on the table after lunch — put the two kinds of book together, then take off the ones that were sold',
          acceptableForms: ['how many', 'left', 'still', 'on the table', 'together', 'take off'],
          keywords: true,
          hints: [
            'Which two numbers have to meet before that number can appear?',
            'Say the situation out loud in two steps, and name what each step produces.',
          ],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? In a two-step story, the first step uses the two numbers that appear first. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Treats the order of the sentences as the order of the plan — but a story can state the ending amount first and describe the changes afterwards.',
            },
            {
              text: 'never',
              errorTag: 'task-comprehension',
              rationale: 'Rules out all the plain stories where the numbers really do arrive in the order the plan needs them.',
            },
          ],
          hints: [
            'Think of a story whose very first number is the amount at the END.',
            'Try one story that runs forwards. Try another that hands you the ending amount. See whether one rule covers both.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
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
    'For grown-ups: if your child gets a two-step story wrong, do not look at the arithmetic first — ask them to tell you the plan in two sentences. Nine times in ten the columns were fine and the plan was the thing that slipped, and a child who can say the plan out loud can nearly always fix the rest alone.',
  ],
  puzzle: (r) => {
    const start = r.int(180, 460);
    const out = r.int(45, Math.min(150, start - 60));
    const drovein = r.int(40, 150);
    const end = start - out + drovein;
    return {
      id: 'C5-PZ-01',
      title: 'Puzzle Grove: The Missing Middle',
      puzzleType: 'logic',
      prompt: `A car park held ${countNoun(start, 'cars')} at nine o'clock. During the morning some cars drove out. At lunchtime ${countNoun(drovein, 'cars')} drove in. At one o'clock the car park held ${countNoun(end, 'cars')}. How many cars drove out during the morning? How can you be sure that no other number would work?`,
      answer: {
        value: String(out),
        acceptableForms: [countNoun(out, 'cars')],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which number in this story is the one nobody tells you?',
        'Work back from the one-o\'clock count. Take off the cars that drove in at lunchtime. Then hold what is left beside the nine-o\'clock count.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Subtraction within 100 — the second line of most plans',
    sourceWeek: B14,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 24, max: 98, regroup: 'mixed' },
  },
  mastery: [
    { gen: sitFestival, diff: 3 },
    { gen: msStoreRoom, diff: 3 },
    { gen: sitHiddenMiddle, diff: 3 },
    { gen: msCapRack, diff: 4 },
    { gen: sitBakery, diff: 3 },
    { gen: msBottleTops, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step stories — join, hidden-middle (the plan without the second line), and separate. 02/04/06: two-step stories — one forward, and two inverse-start (wind the day back, and uncover a part of a stated whole), with the start-bar, number-line and part-whole figure affordances preserved. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'follows-the-words',
      description: 'Treats the story\'s joining and taking words as instructions in the order they are written, so a story that states the ending amount is added to when it should be taken from.',
      exampleWrongAnswer: '"208 caps now, after 75 were put out" answered as 283',
      distractorRationale: 'Offer the result of following the story\'s words in the order they appear.',
      reteachPointer: 'explanation/script[2] (the count already has the change standing inside it)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-the-middle',
      description: 'Answers with the hidden middle number and stops, or opens the plan with the change the story mentions last so the first change is never used.',
      exampleWrongAnswer: 'a two-step store-room story answered as 474, the middle number',
      distractorRationale: 'Offer the hidden middle number, and the result of opening with the last change named.',
      reteachPointer: 'guidedExamples/C5-GE-01 (line two is where the question is finally answered)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'second-line-slip',
      description: 'Chooses the right plan and the right order, then slips on the regrouping in one of the two lines.',
      exampleWrongAnswer: 'the second line of a plan, 474 take away 95, answered as 389',
      distractorRationale: 'Offer the result that is ten out on the second line.',
      reteachPointer: 'guidedExamples/C5-GE-03 (say each line aloud before writing it), then the 2-minute subtraction sprint',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'wrong-quantity-read',
      description: 'Reports a quantity the story mentions rather than the one the question names — the amount spent when the question asked for the amount left, or one part of a whole when the question asked for the other.',
      exampleWrongAnswer: 'a "how much is left?" money story answered with the total spent',
      distractorRationale: 'Offer a quantity the story really does mention, but not the one the question names.',
      reteachPointer: 'explanation/script[3] (check the size of your answer against the story before you write it down)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Two-step addition and subtraction stories — reading the whole story before writing anything, uncovering the number hidden in the middle, deciding which operation comes FIRST, and handling the tricky stories that hand you the ending amount and ask what came before it.',
    improvingCandidates: [
      'writing the plan before starting any arithmetic',
      'uncovering the number hidden in the middle of a story',
      'working a story backwards when it gives the ending amount',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'stories that state the ending amount — the joining words in those point backwards, and the bar picture makes that visible in a second',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was actually asked, rather than the middle number the first line produced',
      },
      {
        errorTag: 'procedure-slip',
        text: 'the regrouping inside each line once the plan is settled — the sprints keep that part quick',
      },
      {
        errorTag: 'representation-misread',
        text: 'tracking which quantity in a story the question is pointing at',
      },
    ],
    homeFocus: {
      praiseLine:
        'You read the whole story and checked which question had to be answered first before you wrote a single number — that planning move is the heart of this week.',
      questionForChild: 'A shelf holds 40 books now, after 15 were put back this morning. How many were on the shelf before — and did you add or take away to find it?',
      schoolSyncHook: 'If your child\'s class writes two-step plans in a particular layout — numbered lines, or a bar picture — tell us and we will match it.',
    },
    vocabularyForParent: [
      'two-step story (two calculations, and the order matters)',
      'the hidden middle number (the one the story never says out loud)',
      'undoing a change (working backwards from the amount at the end)',
    ],
  },
});
