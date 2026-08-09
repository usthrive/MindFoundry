/**
 * Level C · Week 8 — "Facts: ×3, ×4" (conceptId: facts-3-4).
 *
 * FILL-ARCHITECTURE §5 row C8: anchor "double, then double again"; multi-step
 * "a fact chain"; error-analysis "adds a group instead of doubling";
 * discrimination "×3 vs ×4 seen as an array slice"; Day-5 signature "which facts
 * can doubling reach?".
 *
 * The week's whole claim is that ×4 need never be memorised — it is a doubling
 * done twice — and that ×3 is the same move with one group brought in at the
 * end. So the content is built to make the child perform the two moves rather
 * than read about them:
 *  - the anchor item hands over the FIRST doubling as a drawn, finished block
 *    (two rows of a four-row wall) and asks for the whole wall, so the two
 *    doublings sit on the page as separate moves — one shown, one done;
 *  - the metacognition probe is the week's own call, made before any arithmetic:
 *    is this a total doubling twice can reach, or does it need a group added?
 *  - two discriminations carry the content: one asks which calculation walks
 *    from a two-crate count to a four-crate count (its sharp distractor IS the
 *    add-a-group misconception), the other reads ×3 as the ×4 array with one
 *    whole row lifted off;
 *  - four fact chains, one of them the pure double-double, one posed goal-first
 *    (the question precedes the data) and one carrying a quantity that is not
 *    used at all;
 *  - several items run PAST the times table on purpose (4 × 12, doubling 20
 *    twice), because a fact you can rebuild is not bounded by a fact you have
 *    memorised — that is the Day-5 production's payoff.
 *
 * WHERE THE RECIPE AND THE SHIPPED VERIFY LIBRARY DISAGREE (kit §E2.3, declared
 * here rather than buried). The recipe names "adds a group instead of doubling"
 * as the Day-5 error: the child with the double who reaches ×4 by adding one
 * more group and lands on ×3. That needs a verify template returning
 * {correct: 4n, wrong: 3n} from one operand pair, and none exists —
 * `d_verify_binop_misconception_v1` varies the OPERATION over a fixed pair, and
 * 4n/3n is not an operation swap (the only pair where a×b = 4n and a+b = 3n is
 * the degenerate 2×4). Fabricating the number was never an option, so:
 *  - the add-a-group misconception is shown where it CAN be shown honestly — it
 *    is the sharp distractor in `discrimDoubleAgain`, it is what the second
 *    script segment's size-check is about, and it carries its own mistake-bank
 *    entry with a real reteach pointer;
 *  - Day 5's generated error-analysis takes the complementary slip that IS
 *    derivable and is squarely this week's: the SECOND doubling written as an
 *    "add 2". The student's arithmetic is correct, so nothing can be found by
 *    re-checking the digits — the only way in is to say what doubling a count
 *    actually does to it.
 * (C7 owns the bare ×2-vs-+2 contrast; what belongs to C8 is that the slip here
 * happens mid-chain, to a number the child has just built.)
 *
 * FIGURE LAW as applied here (kit §F.7, §E2.5): every figure on a DAY ITEM draws
 * a quantity the story has already handed over — the wheels on one vehicle, the
 * block of the wall that is already up, the bar the doubling starts from — and
 * asserts it against the item's own drawn param. The picture that shows a whole
 * double-double journey, one bar becoming two becoming four, lives where the
 * answer is already on the page: the lesson script and the guided examples.
 *
 * Retrieval is backward-only into C3/C4 (± within 1,000) and into C7, whose ×2
 * ladder is the single move this week compounds.
 */

import { addWhole, asWarmup, classify, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, wholeMoney } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsAnswerOf, assertsParam, barModel, counters } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B20 = { level: 'B' as const, week: 20 };
const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C6 = { level: 'C' as const, week: 6 };
const C7 = { level: 'C' as const, week: 7 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/**
 * The two facts this week owns. Every core item is a ×3 or a ×4 seen from one
 * side or the other, so the doubling route is always the shortest honest one.
 */
const THIS_WEEK = [3, 4] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep) have no figure slot, and lib/
// is not ours to edit, so this wrapper does what `withEstimateFirst` does: it
// works entirely inside the returned closure, takes no new rng draw, and leaves
// the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It reads
// the drafted item's `generator.params` — the very numbers the answer was
// computed from — so the figure law ("built from the item's own drawn values")
// holds by construction. (Pattern copied from c06, the Level-C exemplar.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000. */
const wAdd = asWarmup(addWhole(132, 471), C3);
/** C4 — subtraction within 1,000. */
const wSub = asWarmup(subWhole(148, 862), C4);

/**
 * C7 — the ×2 fact in its plainest form. This is not decoration: doubling is
 * the ONE move the whole week compounds, so Monday rebuilds by hand the thing
 * Tuesday starts leaning on.
 */
const wDoubles = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'mul',
    draw: (r) => {
      const each = r.int(3, 12);
      const name = one(r);
      return {
        prompt: `${name} finds ${countNoun(each, 'pebbles')} in one coat pocket. The other pocket holds exactly the same number. How many pebbles is that altogether?`,
        answerValue: String(each * 2),
        templateId: 'd_mul_v1',
        params: { a: each, b: 2 },
        units: 'pebbles',
        hints: [
          'Are the two pockets holding the same amount as each other?',
          'Say the first count out loud. Then count on the very same amount a second time.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  C7,
);

/** C7 — counting on in 5s and 10s, the other ladder that week left behind. */
const wPegLine = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'multiple',
    draw: (r) => {
      const step = r.pick([5, 10] as const);
      const cards = r.int(3, 8);
      const name = one(r);
      return {
        prompt: `${name} pegs ${countNoun(cards, 'number cards')} in a row along a washing line. The count goes on in ${step}s, and the first card shows ${step}. The last card blows away in the wind. What number was on it?`,
        answerValue: String(step * cards),
        templateId: 'd_multiple_v1',
        params: { base: step, k: cards },
        hints: [
          'Are the numbers along this line growing by the same jump every time?',
          'Begin at the first card. Take that same jump once for each card that follows it.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  C7,
);

// ---------------------------------------------------------------------------
// Single-step ×3 / ×4 situations
// ---------------------------------------------------------------------------

/**
 * The two facts carried by two real objects, so the numeral is never arbitrary:
 * a tricycle has three wheels and a go-kart has four, and the story says which
 * one is in the shed. Figure = ONE vehicle's wheels, which is the size of a
 * group and the one thing the story hands over.
 */
const sitWheelShed = withFigure(
  situation({
    situationType: 'rate',
    cognitiveOp: 'mul',
    draw: (r) => {
      const per = r.pick(THIS_WEEK);
      const vehicle = per === 3 ? 'tricycle' : 'go-kart';
      const fleet = r.int(3, 9);
      return {
        prompt: `[image: the ${per} wheels on one ${vehicle}] A repair shed has ${countNoun(fleet, vehicle)} in for a service. Every ${vehicle} runs on ${countNoun(per, 'wheels')}. How many wheels are there to check?`,
        answerValue: String(fleet * per),
        templateId: 'd_mul_v1',
        params: { a: fleet, b: per, vehicle },
        units: 'wheels',
        hints: [
          'Do all the vehicles in this shed run on the same number of wheels?',
          'Find what a single one of them needs. Then keep a running count as you work along the row.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'b'), 'balls', {
      alt: `the ${countNoun(numOf(p, 'b'), 'wheels')} on one ${String(p.vehicle)}`,
      asserts: assertsParam('b'),
    }),
);

/**
 * THE ANCHOR ITEM. The first doubling is already done and DRAWN — two of the
 * four rows are hanging, and the picture is exactly that block, asserted against
 * the count the prose states. The child supplies the second doubling. So the two
 * moves stand on the page as two separate things: one finished in front of them,
 * one still to make, which is the whole of "double, then double again".
 *
 * The picture cannot leak: it draws the block the story already named, and the
 * wall it belongs to is twice that.
 */
const sitGalleryWall = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'mul',
    draw: (r) => {
      // Up to twelve a row, so the finished wall runs past the four-times table
      // a child could have memorised — which is the point of a rebuilt fact.
      const perRow = r.int(3, 12);
      return {
        prompt: `[image: the two rows already hung, ${countNoun(perRow, 'frames')} in each] A gallery wall will hold ${countNoun(4, 'equal rows')} of ${countNoun(perRow, 'frames')}. The bottom two rows are up already, which is ${countNoun(perRow * 2, 'frames')} hanging. How many frames will the finished wall hold?`,
        answerValue: String(perRow * 4),
        templateId: 'd_mul_v1',
        params: { a: 4, b: perRow, half: perRow * 2 },
        units: 'frames',
        hints: [
          'Which part of this wall is finished, and which part is still to come?',
          'The block that is already hanging is half the wall. The rest of it is that same block over again.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const perRow = numOf(p, 'b');
    return areaGrid(
      { rows: 2, cols: perRow, rowLabels: [String(perRow), String(perRow)] },
      {
        alt: `the two rows already hung, ${countNoun(perRow, 'frames')} in each — ${countNoun(numOf(p, 'half'), 'frames')} in the block`,
        asserts: assertsParam('half', 'cells'),
      },
    );
  },
);

/**
 * The same two facts carried by a LENGTH rather than a count, so "three of it"
 * has to be heard as a distance and not as a pile. No figure: a drawn tile
 * would only restate its own stated length.
 */
const sitDominoLine = situation({
  situationType: 'measurement',
  cognitiveOp: 'mul',
  draw: (r) => {
    // A domino tile is a small object; past about nine centimetres the "set"
    // stops being one a child has ever handled.
    const len = r.int(4, 9);
    const tiles = r.pick(THIS_WEEK);
    const name = one(r);
    return {
      prompt: `Every tile in the domino set is ${countNoun(len, 'cm')} long. ${name} lays ${countNoun(tiles, 'tiles')} end to end in a straight line. How long is the line?`,
      answerValue: String(len * tiles),
      templateId: 'd_mul_v1',
      params: { a: len, b: tiles },
      units: 'cm',
      hints: [
        'How many times over does one tile\'s length appear in this line?',
        'Work out how far a single tile stretches. Then count that stretch off once for every tile in the line.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so the
 * generator is never drawn twice with the same hint ladder (kit §E2.2).
 *
 * The probe is the week's own decision, and it is a genuine call: a card for
 * four swims can be reached by doubling twice, a card for three cannot. The
 * child has to read the number of swims and classify the route BEFORE any
 * arithmetic — which is exactly the habit a rebuilt fact depends on.
 */
const sitSwimCard = situation({
  situationType: 'rate',
  cognitiveOp: 'mul',
  draw: (r) => {
    const price = r.int(2, 9);
    const swims = r.pick(THIS_WEEK);
    const name = one(r);
    return {
      prompt: `One swim at the pool costs ${wholeMoney(price)}. ${name} buys a card that pays for ${countNoun(swims, 'swims')}. How much does the card cost?`,
      answerValue: String(price * swims),
      templateId: 'd_mul_v1',
      params: { a: price, b: swims },
      units: 'dollars',
      // Whole dollars throughout this item, so the accepted forms are stated
      // rather than left to the money default (which would print cents beside a
      // bare-dollar prompt).
      acceptableForms: [wholeMoney(price * swims)],
      hints: [
        'Does the card charge the same for every swim? Or does the price change along the way?',
        'Settle one swim first. Then let that amount stand in for each of the others. Stop when the card is used up.',
      ],
      errorTags: ['fact-recall', 'task-comprehension'],
    };
  },
});
const sitSwimCardEstimate = withEstimateFirst(
  sitSwimCard,
  'can you reach this total by doubling twice, or is one more group needed?',
);

// ---------------------------------------------------------------------------
// Multi-step: the C8 recipe's "fact chain", in four postures
// ---------------------------------------------------------------------------

/**
 * The pure chain: the same move done twice to its own answer. This is the item
 * that shows a fact being BUILT — and the numbers run well past the four-times
 * table on purpose, because doubling twice does not stop where memory does.
 *
 * Figure = the bar the chain starts from, and nothing else: the second and
 * fourth-week bars ARE the two steps the item is asking for.
 */
const msPuzzleClub = withFigure(
  multiStep({
    situationType: 'rate-of-change',
    draw: (r) => {
      const first = r.int(7, 20);
      const name = one(r);
      return {
        prompt: `[image: one bar for the ${first} children who came in the first week] ${name} runs a puzzle club. In its first week ${countNoun(first, 'children')} came. In the second week twice that many came. In the third week the number doubled once more. How many children came in the third week?`,
        initN: first,
        steps: [
          { op: 'mul', n: 2, d: 1 },
          { op: 'mul', n: 2, d: 1 },
        ],
        units: 'children',
        hints: [
          'Does this club grow by the same AMOUNT each week? Or by the same MOVE each week?',
          'Reach the second week from the first. Then do the identical thing to the number you land on.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const first = numOf(p, 'initN');
    return barModel(
      [{ label: 'the first week', segments: [{ value: first, label: String(first) }] }],
      {
        alt: `one bar for the ${countNoun(first, 'children')} who came in the first week; the later weeks are not drawn`,
        asserts: assertsParam('initN'),
      },
    );
  },
);

/** A chain in measurement: the repeated part built up, then the one-off joined on. */
const msBridgeSpans = multiStep({
  situationType: 'measurement',
  draw: (r) => {
    const span = r.int(6, 14);
    const spans = r.pick(THIS_WEEK);
    // A ramp the length of a span reads as one more span, which blurs the very
    // boundary between the repeated part and the one-off part this item draws.
    let ramp = r.int(5, 20);
    if (ramp === span) ramp += 1;
    return {
      prompt: `A model bridge is built from equal spans, each ${countNoun(span, 'cm')} long. The bridge has ${countNoun(spans, 'spans')} in a line. A ramp ${countNoun(ramp, 'cm')} long is fixed at one end. How long is the model from end to end?`,
      initN: span,
      steps: [
        { op: 'mul', n: spans, d: 1 },
        { op: 'add', n: ramp, d: 1 },
      ],
      units: 'cm',
      hints: [
        'Which part of this model repeats, and which part appears only once?',
        'Build the repeated part up to its full length first. Then join on the piece that turns up only at the end.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * GOAL-FIRST posing (PEDAGOGY-CEILING-REVIEW F3, the posture C5 and C9 have not
 * used). The question arrives before a single number does, so the child reads
 * the story already knowing what is wanted and has to decide which numbers serve
 * it — the opposite reading order from every forward chain in the corpus.
 */
const msNewChairLegs = multiStep({
  situationType: 'multi-stage',
  posing: 'goal-first',
  draw: (r) => {
    const chairs = r.int(3, 7);
    const need = chairs * 4;
    // Leave a real order to place: a stack that already covers the whole batch
    // turns the second step into a formality.
    let cut = r.int(2, need - 6);
    // A batch of five chairs beside five legs reads as a coincidence rather
    // than a workshop. `chairs` is at least three, so stepping down once keeps
    // `cut` inside its own range.
    if (cut === chairs) cut -= 1;
    return {
      prompt: `How many more legs does the workshop still need to cut? Every chair takes ${countNoun(4, 'legs')}. ${countNoun(chairs, 'chairs')} are waiting to be finished. ${countNoun(cut, 'legs')} are already cut and stacked by the bench.`,
      initN: 4,
      steps: [
        { op: 'mul', n: chairs, d: 1 },
        { op: 'sub', n: cut, d: 1 },
      ],
      units: 'legs',
      hints: [
        'Which of these numbers tells you what ONE chair needs?',
        'Build up what the whole batch of chairs needs. Only then take off what is already stacked by the bench.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

/**
 * Same chain shape, posed with a quantity that is NOT used (F3 `has-distractor`).
 * The unused number here is a PRICE rather than a stray count — a number that
 * belongs to the story completely and still has no business in the working,
 * which is a harder thing to leave alone than an obviously foreign object.
 */
const msCampField = multiStep({
  situationType: 'part-whole',
  posing: 'has-distractor',
  draw: (r) => {
    const sleeps = r.pick(THIS_WEEK);
    const tents = r.int(3, 8);
    const hire = r.int(12, 40);
    // A caravan party exactly the size of a tentful reads as one more tent, and
    // the chain would look like a third multiply rather than an add.
    let extra = r.int(2, 6);
    if (extra === sleeps) extra += 1;
    return {
      prompt: `Every tent on the field sleeps ${countNoun(sleeps, 'campers')}, and ${countNoun(tents, 'tents')} are pitched. A tent costs ${wholeMoney(hire)} to hire for the weekend. Later ${countNoun(extra, 'campers')} arrive with a caravan and park on the same field. How many campers are staying on the field?`,
      initN: sleeps,
      steps: [
        { op: 'mul', n: tents, d: 1 },
        { op: 'add', n: extra, d: 1 },
      ],
      units: 'campers',
      hints: [
        'Does every number in this story count people?',
        'Work through the tents first, then the caravan. Set aside the number that measures something other than campers.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's point, forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * The cross-op trap, and the home of the recipe's misconception. The child is
 * standing on the double and is asked which move reaches four. The sharp
 * distractor IS "adds a group instead of doubling" — it reaches three crates and
 * stops one crate short — and it is offered beside the slip Day 5 then shows
 * worked, so the two halves of the same confusion are met from both sides.
 */
const discrimDoubleAgain = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-operation',
  draw: (r) => {
    // From four a crate upward: at two a crate the "add two" option and the
    // "add a crate" option print the same number, and the trap goes blind.
    const per = r.int(4, 12);
    const twice = per * 2;
    const name = one(r);
    return {
      prompt: `A shop stacks ${countNoun(per, 'tins')} in every crate. ${name} has already worked out that two crates hold ${countNoun(twice, 'tins')}. Which calculation takes ${name} from there to the number of tins in FOUR crates?`,
      correct: `${twice} + ${twice}`,
      distractors: [
        {
          text: `${twice} + ${per}`,
          errorTag: 'concept-misconception',
          rationale: 'Stands one more crate beside the two, which reaches three crates and stops a whole crate short of four.',
        },
        {
          text: `${twice} + 2`,
          errorTag: 'procedure-slip',
          rationale: 'Reads the second doubling as an instruction to add two, when doubling copies an amount rather than nudging it up by two.',
        },
      ],
      hints: [
        'What has to happen to the two-crate count before it becomes the four-crate count?',
        'Four crates are the two crates over again. Set an identical stack beside the one already counted.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * The recipe's own discrimination: ×3 read as the ×4 array with one slice gone.
 * A whole row of the path comes up, and the choice is whether the calculation
 * takes off a ROW or takes off the number of rows. The halving option is the
 * child who has learned this week's move and reaches for it once too often — it
 * undoes one doubling and leaves two rows, not three.
 */
const discrimRowLifted = discrimination({
  variant: 'structural',
  draw: (r) => {
    // Four slabs a row is excluded by construction, not by a nudge: there the
    // "take off a row" and "take off the number of rows" options would print the
    // same calculation and the child would be choosing between twins.
    const perRow = r.pick([3, 5, 6, 7, 8, 9, 10, 11, 12] as const);
    const all = perRow * 4;
    const name = one(r);
    return {
      prompt: `A path is laid in ${countNoun(4, 'rows')} with ${countNoun(perRow, 'slabs')} in every row. That is ${countNoun(all, 'slabs')} altogether. ${name} lifts one whole row to reach a pipe underneath. Which calculation tells how many slabs are still down?`,
      correct: `${all} − ${perRow}`,
      distractors: [
        {
          text: `${all} − 4`,
          errorTag: 'representation-misread',
          rationale: 'Takes away the number of rows rather than the slabs that make one row up.',
        },
        {
          text: `half of ${all}`,
          errorTag: 'concept-misconception',
          rationale: 'Undoes a doubling instead of lifting a single row, which clears two rows away and leaves two behind.',
        },
      ],
      hints: [
        'Does this calculation have to take away one row, or one slab?',
        'Picture the row that came up. It holds as many slabs as any other row. All of them have gone.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the header note. The truth is the second doubling (a × 2) and the shown
// wrong value is the genuine output of writing that doubling as an "add 2"
// (a + 2). The student's addition is correct, so re-checking the digits finds
// nothing; the only way in is to say what doubling does to a count.
// ---------------------------------------------------------------------------

const eaSecondDouble = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  // a is the TWO-row count the story states, so the item's own arithmetic and
  // its prose start from the same number.
  drawParams: (r) => {
    const perRow = r.int(4, 12);
    return { a: perRow * 2, b: 2, op: '*', wrongOp: '+' };
  },
  build: (v, p) => {
    return {
      prompt: `A market stall stands its plant pots in equal rows. Two of those rows hold ${countNoun(Number(p.a), 'pots')}. A student worked out how many pots stand in four rows. The student wrote ${p.a} + 2 = ${v.wrong}.`,
      extension: 'Work out how many pots really stand in four rows. Then write one sentence saying what the student did to the two-row count.',
      hints: [
        'What has to happen to a count to make it twice as big?',
        'Stand a second pair of rows beside the first pair. Then count what the whole stall holds.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC08 = makeWeekBuilder({
  level: 'C',
  week: 8,
  conceptId: 'facts-3-4',
  conceptName: 'Facts: ×3, ×4',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [B20, C6, C7],
  pedagogyContract: 'v2',
  conceptualAnchor: 'double, then double again',
  conceptFamily: 'operation',
  deepeningDelta:
    'C6 gave "groups of" its meaning and C7 made the easiest facts quick by leaning on a count the child already had — skip counting. C8 stops counting altogether. A fact is now BUILT out of a fact already owned: ×4 arrives as a doubling done to its own answer, and ×3 as that same doubling with one group brought in at the end. What is being practised is the chain rather than the recall, which is why several items here run past the times table a child of this age has had time to memorise.',
  explanation: {
    hook:
      'Nobody has to learn the four-times table. Four of anything is a double, doubled. And doubling is a move you have owned since before you could write.',
    whyBeforeHow:
      'Four of something is two of it counted twice over. That is true of every number there is. So you can reach any ×4 fact from a doubling you already own. Double, then double again. That is why this week is about one move rather than two tables. Threes work the same way, with a tail. Three of something is a double with one more group standing beside it. Once you can double, you are one small step from the threes as well. A fact you can rebuild does not run out where your memory does. It does not desert you on a morning when you cannot remember.',
    script: [
      {
        say: 'Watch me build a four-times fact without ever having learned one. Here is a shelf with six jars on it. I stand an identical shelf beside it. That is a double. Doubling is the one move I have owned for years.',
        visual: 'One shelf of six jars, and the same shelf again beside it.',
        figure: barModel(
          [
            { label: 'one shelf', segments: [{ value: 6, label: '6' }] },
            { label: 'two shelves', segments: [{ value: 6 }, { value: 6 }], total: '12' },
          ],
          { scaleMax: 24, alt: 'a bar of six for one shelf, and a bar of six and six for two shelves, twelve in all' },
        ),
      },
      {
        say: 'Now I do that same move to my own answer. Two shelves become four shelves: I double the double. Six, then twelve, then twenty-four — and I never recited a four-times table once.',
        visual: 'The two-shelf bar, and beneath it the same bar again to make four shelves.',
        figure: barModel(
          [
            { label: 'two shelves', segments: [{ value: 6 }, { value: 6 }], total: '12' },
            { label: 'four shelves', segments: [{ value: 6 }, { value: 6 }, { value: 6 }, { value: 6 }], total: '24' },
          ],
          { scaleMax: 24, alt: 'a bar of twelve for two shelves above a bar of twenty-four for four shelves' },
        ),
      },
      {
        say: 'Three is the awkward one, and here is why: three is not a doubling. Three shelves are a double with one more shelf standing beside it. So for a three-times fact I double first. Then I bring in one extra group.',
        visual: 'Three rows of six, with the first two rows shaded as the double inside the three.',
        figure: areaGrid(
          { rows: 3, cols: 6, shadedRows: 2, rowLabels: ['6', '6', '6'] },
          { alt: 'three rows of six jars, with the bottom two rows shaded to show the double sitting inside the three' },
        ),
      },
      {
        say: 'One habit before I double anything. I ask roughly where the answer ought to land. Four of something has to sit a long way past two of it. It is near enough the same distance again. Say my answer is only one group bigger than my double. Then I brought in a group where I meant to double. Then I check at the end by counting the groups back up.',
        visual: 'A bar of three shelves beside a bar of four shelves, so the gap between them is visible.',
        figure: barModel(
          [
            { label: 'three shelves', segments: [{ value: 6 }, { value: 6 }, { value: 6 }], total: '18' },
            { label: 'four shelves', segments: [{ value: 6 }, { value: 6 }, { value: 6 }, { value: 6 }], total: '24' },
          ],
          { scaleMax: 24, alt: 'a bar of eighteen for three shelves beside a longer bar of twenty-four for four shelves' },
        ),
      },
    ],
    summary:
      'Doubling is the one move this week runs on. Double, then double again, and four of anything is yours without a table. Double once and bring in one more group, and the threes are yours too. Before you write an answer down, check its size. Four of something should land a long way past the double. It should not land a single group past it.',
    vocabulary: [
      { term: 'double', kidGloss: 'the same amount again, put beside the first' },
      { term: 'double, then double again', kidGloss: 'the two moves that reach four of an amount' },
      { term: 'four times as many (×4)', kidGloss: 'a double that has been doubled' },
      { term: 'three times as many (×3)', kidGloss: 'a double with one more group standing beside it' },
    ],
  },
  guidedExamples: [
    {
      ...ge(8, 1, 'modeled', 'A gallery wall holds 4 equal rows of 6 frames. How many frames does the finished wall hold?', [
        {
          teacherSay:
            'Watch me refuse to look this fact up. I know six and six without thinking. So I take one row and its twin. That is two rows on the wall. I have not multiplied anything yet.',
        },
        {
          teacherSay: 'Two rows hold twelve. Four rows are those two rows over again — where does that land?',
          expected: '24',
        },
      ], '24'),
      visual: 'One row, then two rows, then four rows, each bar twice the one above it.',
      figure: barModel(
        [
          { label: 'one row', segments: [{ value: 6, label: '6' }] },
          { label: 'two rows', segments: [{ value: 6 }, { value: 6 }], total: '12' },
          { label: 'four rows', segments: [{ value: 6 }, { value: 6 }, { value: 6 }, { value: 6 }], total: '24' },
        ],
        {
          scaleMax: 24,
          alt: 'three bars: six for one row, twelve for two rows, and twenty-four for four rows',
          asserts: assertsAnswerOf('bar:2'),
        },
      ),
    },
    {
      ...ge(8, 2, 'completion', 'A sheet of stamps has 4 rows with 7 stamps in every row. How many stamps are on the sheet?', [
        { teacherSay: 'Which would you rather reach for here — a four-times fact, or two doublings?', expected: 'two doublings' },
        { childDo: 'Double the number in a row, then double what you get. Say how many stamps the sheet holds.', expected: '28' },
      ], '28'),
      visual: 'Four rows of seven stamps, with the bottom two rows shaded as the first doubling.',
      figure: areaGrid(
        { rows: 4, cols: 7, shadedRows: 2 },
        {
          alt: 'four rows of seven stamps, with the bottom two rows shaded to show the first doubling',
          asserts: { of: 'cells', ...assertsAnswer },
        },
      ),
    },
    ge(8, 3, 'prompted', 'Every tile in a domino set is 8 cm long. Pia lays 3 tiles end to end. How long is the line?', [
      { childDo: 'Double one tile to cover two of them, then bring in the third tile\'s length.', expected: '24 cm' },
    ], '24 cm'),
    {
      // Independent stage: ONE chair's legs. Working out what the whole batch
      // needs before anything comes off the stack IS the task here, so drawing
      // the other chairs would hand over the plan the item exists to ask for.
      ...ge(8, 4, 'independent', 'How many more legs does the workshop still need to cut? Every chair takes 4 legs. 6 chairs are waiting to be finished. 9 legs are already cut. Solve cold.', [
        { childDo: 'Work out what all the chairs need first, then take off what is already cut.', expected: '15' },
      ], '15'),
      visual: 'One chair\'s four legs. The rest of the batch is yours to work out.',
      figure: counters(4, 'balls', { alt: 'the four legs one chair takes' }),
    },
  ],
  days: [
    // Day 1 — concept echo: the two facts in three models, single-step only, with
    // the anchor item handing over its first doubling as a finished block.
    [
      { gen: wAdd, diff: 2 },
      { gen: wSub, diff: 2 },
      { gen: wDoubles, diff: 2 },
      { gen: sitWheelShed, diff: 2 },
      { gen: sitGalleryWall, diff: 3 },
      { gen: sitDominoLine, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first call about WHICH route,
    // the cross-op trap, and the pure double-double chain.
    [
      { gen: wPegLine, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: sitSwimCardEstimate, diff: 3 },
      { gen: discrimDoubleAgain, diff: 3 },
      { gen: msPuzzleClub, diff: 4 },
      { gen: sitWheelShed, diff: 3 },
    ],
    // Day 3 — interleave: the array-slice discrimination arrives beside the
    // cross-op trap and a measurement chain, so the page shape never tells the
    // child which of the two facts is coming.
    [
      { gen: wDoubles, diff: 2 },
      { gen: discrimRowLifted, diff: 3 },
      { gen: discrimDoubleAgain, diff: 4 },
      { gen: msBridgeSpans, diff: 4 },
      { gen: sitGalleryWall, diff: 3 },
      { gen: sitDominoLine, diff: 3 },
    ],
    // Day 4 — word problems: four fact chains, one goal-first and one carrying a
    // quantity to leave alone, with the estimate-first item mixed in so the page
    // never signals "this one is two steps".
    [
      { gen: msNewChairLegs, diff: 4 },
      { gen: msCampField, diff: 5 },
      { gen: msBridgeSpans, diff: 5 },
      { gen: msPuzzleClub, diff: 4 },
      { gen: sitSwimCardEstimate, diff: 4 },
    ],
    // Day 5 — non-computational: the second-doubling error-analysis, the
    // which-facts-can-doubling-reach production, and the claim that settles when
    // doubling and adding two could ever agree (+ a ramped warm-up).
    [
      { gen: wPegLine, diff: 2 },
      { gen: eaSecondDouble, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Someone in another class makes a claim. Anybody who can double never has to learn the four-times table. Choose three different numbers. Write out both doublings for each one. Then write one sentence about what a doubler still has to do. What if a question asks for THREE of something instead of four?',
          value: 'double the number and then double that answer to reach four of it; for three of it you double once and bring in one more group',
          acceptableForms: ['double', 'double again', 'twice', 'one more group', 'add one more group'],
          keywords: true,
          hints: [
            'Which of this week\'s two facts can doubling reach all on its own?',
            'Take one number all the way through both doublings. Then look at what is missing when only three groups are wanted.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? Doubling a number lands on the same answer as adding two to it. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Treats the two moves as two names for one move, when they only meet at a single number and part company everywhere else.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Rules out every number at once, including the one small number where the double and the add really do land together.',
            },
          ],
          hints: [
            'Could one special number make both moves land in the same place?',
            'Try the smallest numbers one at a time. Watch what happens to the gap between the two answers. See what the gap does as the numbers grow.',
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
    'For grown-ups: the four-times table is the one table nobody needs to memorise — four of something is a double, doubled. If your child stalls on a ×4 fact, do not supply the answer; ask "what is double that?" and then ask it again. Two easy questions get there every time, and a child who can rebuild a fact is never stuck for long.',
  ],
  puzzle: (r) => {
    // Deterministic construction, never a redraw loop (kit §E2.4): the track
    // length is picked, and the numbers both counters land on are computed from
    // it, so the answer and the "how do you know none is missing" half are
    // always consistent.
    const track = r.pick([30, 40, 50] as const);
    const shared: number[] = [];
    for (let n = 12; n <= track; n += 12) shared.push(n);
    const name = one(r);
    return {
      id: 'C8-PZ-01',
      title: 'Puzzle Grove: Where the Hops Meet',
      puzzleType: 'pattern',
      prompt: `${name} sets two counters at zero on a number track. One counter hops along in threes; the other hops along in fours. Find EVERY number up to ${track} that BOTH counters land on. Then say how you can be sure that none is missing.`,
      answer: {
        value: shared.join(', '),
        acceptableForms: [shared.join(' '), shared.join(', ')],
        validation: 'set',
      },
      hintLadder: [
        'Which numbers does the threes counter visit, and which numbers does the fours counter visit?',
        'Write both lists out to the end of the track. Then run a finger down them together. Mark every number that appears in both.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Small equal-groups products — reading a fact as groups of the same size',
    sourceWeek: C6,
    itemCount: 18,
    scheduledDay: 2,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 5] },
  },
  mastery: [
    { gen: sitWheelShed, diff: 3 },
    { gen: msPuzzleClub, diff: 3 },
    { gen: sitGalleryWall, diff: 3 },
    { gen: msNewChairLegs, diff: 4 },
    { gen: sitDominoLine, diff: 3 },
    { gen: msCampField, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step ×3 and ×4 — a count of groups, an array with its first doubling already hung, and a repeated length — the three models the week teaches, with the one-group and half-the-wall figure affordances preserved. 02/04/06: fact chains — the pure double-double, a goal-first order that states the question before any number, and a chain carrying a price that never enters the working. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'added-a-group-instead-of-doubling',
      description: 'Reaches four of something by setting one more group beside the double, which lands on three of it and stops a whole group short.',
      exampleWrongAnswer: 'four crates of 8 tins answered as 24',
      distractorRationale: 'Offer the double with one more group added to it.',
      reteachPointer: 'explanation/script[3] (four of something sits a long way past the double, not one group past it)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'doubled-as-plus-two',
      description: 'Writes the second doubling as an "add 2", so a chain that started correctly ends two past the number it began from rather than twice it.',
      exampleWrongAnswer: 'doubling a two-row count of 16 answered as 18',
      distractorRationale: 'Offer the count with two added to it instead of doubled.',
      reteachPointer: 'explanation/script[1] (the same move is done to the answer, not to the last digit of it)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'row-count-for-row-size',
      description: 'Swaps how many rows there are with how many things are in a row, so a whole row lifted from an array is costed as the number of rows.',
      exampleWrongAnswer: 'one row lifted from 4 rows of 7 answered as 24',
      distractorRationale: 'Offer the calculation that takes away the number of rows instead of the contents of one row.',
      reteachPointer: 'explanation/script[2] (what repeats down the array is the size of a row)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-the-double',
      description: 'Answers with the double and stops, or with what one group holds, rather than carrying the chain through to the quantity the question names.',
      exampleWrongAnswer: 'a four-row wall of 9 frames answered as 18, the block already hanging',
      distractorRationale: 'Offer the intermediate double the story has already stated.',
      reteachPointer: 'guidedExamples/C8-GE-01 (the second doubling is where the question is finally answered)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'reaches-for-memory-first',
      description: 'Hunts for a remembered ×3 or ×4 fact instead of rebuilding it, and guesses when the table runs out past the facts already learned.',
      exampleWrongAnswer: '4 × 12 answered as 44',
      distractorRationale: 'Offer a near-miss product of the kind an unsure recall produces.',
      reteachPointer: 'guidedExamples/C8-GE-02 (double the row, then double again — no table needed), then the 2-minute products sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Facts ×3 and ×4 — built rather than memorised. Four of something is a double doubled, and three of it is a double with one more group brought in, so this week practised the two moves and the size check that catches the difference between them.',
    improvingCandidates: [
      'reaching a four-times fact by doubling twice instead of hunting for it',
      'deciding which route a fact needs before starting any arithmetic',
      'checking that an answer landed a long way past the double',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'the difference between doubling a double and adding one more group — the second lands on three of something, not four',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the doubling move intact partway through a chain, when the numbers have grown',
      },
      {
        errorTag: 'representation-misread',
        text: 'tracking which number counts the rows and which one counts what is inside a row',
      },
      {
        errorTag: 'task-comprehension',
        text: 'carrying a chain through to the end rather than stopping at the number the story already handed over',
      },
    ],
    homeFocus: {
      praiseLine:
        'You reasoned your way to a four-times fact by doubling twice, and you checked that your answer had landed well past the double — that rebuilding move is the whole of this week.',
      questionForChild: 'What is double 7? And now double that — so what is 4 times 7, and did you need to remember it?',
      schoolSyncHook: 'If your child\'s class teaches the ×4 facts as a table to recite rather than as two doublings, tell us and we will practise them both ways.',
    },
    vocabularyForParent: [
      'double (the same amount again, beside the first)',
      'double, then double again (the two moves that reach four of an amount)',
      'three times as many (a double with one more group beside it)',
    ],
  },
});
