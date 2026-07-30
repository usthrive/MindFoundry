/**
 * Level C · Week 19 — "Mass & liquid volume" (conceptId: mass-liquid-volume).
 *
 * FILL-ARCHITECTURE §5 row C19: anchor "benchmark units"; multi-step "combine
 * then compare"; error-analysis "reads the wrong scale interval";
 * discrimination "g vs kg choice"; Day-5 signature "estimate-first IS the
 * content — a benchmark hunt".
 *
 * THE CLAIM THIS WEEK MAKES is that measuring is a JUDGEMENT before it is a
 * calculation. The arithmetic here is one line of adding or subtracting the
 * child has owned since C3; what is new — and what nearly every measurement
 * mistake in the world is made of — is knowing how big the units are. So the
 * hard items are deliberately not the sums:
 *  - two judgement items carry the week. One asks which unit turns a bare
 *    number into a sensible mass; the other asks which everyday thing an amount
 *    matches. Neither can be answered by computing anything, and both are the
 *    ones set at the top difficulties;
 *  - four benchmarks are taught by name and then used everywhere — a paperclip
 *    is about 1 g, a bag of sugar about 1 kg, a teaspoon about 5 ml, a big
 *    bottle about 2 l. They are named in the lesson, leaned on in the hints,
 *    used as the estimate-first probe, and hunted for at home on Day 5;
 *  - the metacognition gate is met by the content rather than by a wrapper
 *    bolted on: the estimate-first probe asks whether two books will come to
 *    more than a bag of sugar, which is a benchmark call and nothing else.
 *
 * UNITS ARE THE WHOLE POINT, so they are handled at the source. Every quantity
 * goes through `lib/format.ts` (`countNoun`/`fmtInt` — never a bare `${…}`),
 * and the unit set is exact: g and kg for mass, ml and l for capacity. The
 * split between them is deliberate:
 *  - every COMPUTED answer is in g or ml, because those are the units a
 *    one-step measurement problem at this band lands in, and `answer.units` is
 *    set on each one so `valueForms` builds "460 g", never "460";
 *  - kg and l appear where the week's real work is — the unit-choice item, the
 *    benchmark match, the Always/Sometimes/Never claim and the home hunt — so
 *    the big units are met as JUDGEMENTS, not as conversion drill. This week
 *    contains no unit-conversion item at all; 1 kg = 1,000 g and 1 l = 1,000 ml
 *    are taught in the lesson as the size of the benchmark, which is what a
 *    Year-3 child actually needs them for.
 * A mass answered in milliliters is the failure this week exists to prevent, so
 * that exact wrong answer is on the page as a priced distractor twice — in the
 * unit-choice item and in the mistake bank — and nowhere else.
 *
 * VERIFY-LIBRARY NOTE (FANOUT kit §E2.3, documented here rather than buried in
 * a comment). The recipe's error-analysis is "reads the wrong scale interval".
 * Its honest output is (marks × the interval the student assumed), a product of
 * a pair no story states, so `d_verify_binop_misconception_v1` cannot express it
 * — over one fixed operand pair it can only offer a×b vs a+b, and "adds the
 * number of marks to the size of one mark" is not a slip any child makes. The
 * registry does carry this misconception honestly: `stat_verify_graph_scale_v1`
 * computes `count × key` against `count`, which is exactly a scale read with an
 * interval of one instead of the interval the marks are worth. So the item is a
 * jug whose small lines stand for 20, 50 or 100 ml each, and the reader writes
 * down the NUMBER OF LINES the water has passed. Both numbers come from the
 * verify template; nothing is fabricated; the recipe's misconception is the one
 * on the page. (C23 uses the same truth for a pictograph key, which is the same
 * mathematics in a different world — a scale is a key, printed sideways.) The
 * extension then turns the slip into the week's own check: a teaspoon holds
 * about 5 ml, so a jug of "6 ml" was refutable before any arithmetic began.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7 and §E2.5). A scale drawn with
 * the pointer on it answers a scale-reading item outright, so:
 *  - the assessed scale item draws the stretch of dial around the pointer and
 *    marks only the NUMBERED LINE the child was handed, asserting it against
 *    the item's own param. The picture teaches what a divided scale looks like
 *    and leaves the reading to the child;
 *  - the watering-can chain marks only the can's full line — the capacity the
 *    story states — never the room that is left, which is the answer;
 *  - the picture with the pointer on it appears once, in the modeled guided
 *    example, where the answer is already written on the page;
 *  - the benchmark and unit-choice items carry no picture by design. A drawing
 *    of a paperclip beside a bag of sugar would do the comparing that IS the
 *    task.
 *
 * Contexts are hand-bound (a place and a real container in one literal) rather
 * than drawn from `lib/contexts.ts`, whose frames are count frames; this week
 * weighs and pours. Every mass and volume in the file was checked against the
 * real world: the kitchen scale runs to 1,000 g and the things on it are a bag
 * of pasta or a block of cheese, never a cat; the jug and the watering can hold
 * what jugs and watering cans hold.
 *
 * Retrieval is backward-only into B21 (measuring length — the week where a
 * number first had to carry a unit), C2 (rounding, the substrate of every
 * estimate), C3/C4 (± within 1,000, the one line of arithmetic these problems
 * run on) and C10 (the ÷ facts a fair share of dough is read off).
 */

import { addWhole, asWarmup, classify, divideExact, reasoning, roundWhole, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B21 = { level: 'B' as const, week: 21 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C10 = { level: 'C' as const, week: 10 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two distinct names, for the side-by-side comparison. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/**
 * A quantity, always through `lib/format.ts`: `fmtInt` groups the thousands a
 * jug of soup runs into and `countNoun` agrees the unit. The measurement units
 * this week uses (g, kg, ml, l) are invariant, so this is also the one place
 * that guarantees "1 g" never prints as "1 grams".
 */
const qty = (n: number, unit: string): string => countNoun(fmtInt(n), unit);

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// `situation` and `multiStep` have no figure slot and `lib/` is not ours to
// edit, so this works the way `withEstimateFirst` does: everything happens
// inside the returned closure, no extra rng draw is taken, and the prompt is
// left byte-identical (so the QG-1/QG-4 surface signature is untouched). It
// reads the drafted item's `generator.params` — the very numbers the answer was
// computed from — so "a figure is built from the item's own drawn values" holds
// by construction rather than by care. (Established by c06, c05 and c20.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/** The numbered lines on a kitchen scale run 100 g apart, in 5 equal steps. */
const MAJOR = 100;
const STEPS_PER_MAJOR = 5;
const STEP_WORTH = MAJOR / STEPS_PER_MAJOR; // 20 g

/** What a child can see of the dial — never where the pointer stopped. */
const scaleScene = (anchor: number): string =>
  `the stretch of the kitchen scale between the ${qty(anchor - MAJOR, 'g')} and ${qty(anchor + MAJOR, 'g')} lines, with four small steps in every gap`;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000: pouring two amounts into one container. */
const wAdd = asWarmup(addWhole(124, 470), C3);
/** C4 — subtraction within 1,000: how much is left, and how much heavier. */
const wSub = asWarmup(subWhole(135, 940), C4);
/** C2 — rounding, which is what a rough answer leans on. */
const wRound = asWarmup(roundWhole(2, 118, 962), C2);
/** C10 — the ÷ FACT family, which is how a batch gives back one portion. */
const wShare = asWarmup(divideExact(4, 9, 3, 9), C10);

/**
 * B21 — measuring length. The ancestor of this week: the first time a measured
 * number had to carry a unit, and the first time a child estimated before
 * reaching for a tool. The quantity is a length on purpose — cm measures how
 * long, g measures how heavy, ml measures how much a container holds, and
 * meeting all three inside one week is what makes the third one land.
 */
const wRibbon = asWarmup(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'sub',
    draw: (r) => {
      const len = r.int(46, 95);
      const cut = r.int(8, 30);
      const name = one(r);
      return {
        prompt: `A roll of ribbon is ${countNoun(len, 'cm')} long. ${name} cuts ${countNoun(cut, 'cm')} off one end. How long is the ribbon now?`,
        answerValue: String(len - cut),
        templateId: 'd_sub_v1',
        params: { a: len, b: cut },
        units: 'cm',
        hints: [
          'Is the question about the piece cut off, or the piece still on the roll?',
          'Measure from nought again after the cut, and read where the ribbon now ends.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B21,
);

// ---------------------------------------------------------------------------
// Reading a measuring tool — the one skill this week's arithmetic sits on
// ---------------------------------------------------------------------------

/**
 * Things that plausibly sit between 220 g and 780 g on a kitchen scale — the
 * range the anchor draw is floored to, so no reading ever comes out as a
 * hundred-gram bag of carrots.
 */
const WEIGHED_THINGS = [
  'bag of pasta',
  'block of cheese',
  'box of strawberries',
  'jar of honey',
  'bag of carrots',
] as const;

/**
 * Read a kitchen scale. The dial is divided, so the reading is a two-part look:
 * find what one small step is worth, then count on from the numbered line the
 * pointer has passed. FIGURE = the stretch of dial around the pointer with the
 * NUMBERED line marked (the given), never the pointer (the answer).
 */
const sitScaleMass = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'read-scale',
    draw: (r) => {
      const anchor = MAJOR * r.int(2, 7);
      const steps = r.int(1, STEPS_PER_MAJOR - 1);
      const thing = r.pick(WEIGHED_THINGS);
      const name = one(r);
      return {
        prompt: `[image: ${scaleScene(anchor)}] ${name} puts a ${thing} on the kitchen scale. The numbered lines are ${qty(MAJOR, 'g')} apart. Each gap is split into ${countNoun(STEPS_PER_MAJOR, 'equal steps')}. The pointer has passed the ${qty(anchor, 'g')} line and stopped ${countNoun(steps, 'steps')} further on. What is the mass of the ${thing}?`,
        answerValue: String(anchor + steps * STEP_WORTH),
        templateId: 'd_add_v1',
        params: { a: anchor, b: steps * STEP_WORTH, steps, per: STEP_WORTH },
        units: 'g',
        hints: [
          'What is one small step on this scale worth?',
          'Share the gap between two numbered lines out among its steps, then count on in that amount from the line the pointer has passed.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const anchor = numOf(p, 'a');
    return numberLine(
      {
        min: anchor - MAJOR,
        max: anchor + MAJOR,
        step: MAJOR,
        partition: STEPS_PER_MAJOR,
        labels: 'majors',
        marks: [{ at: anchor, label: fmtInt(anchor), style: 'flag' }],
      },
      { alt: scaleScene(anchor), asserts: assertsParam('a', 'mark:0') },
    );
  },
);

// ---------------------------------------------------------------------------
// One-step measurement problems — one line of arithmetic, four situations
// ---------------------------------------------------------------------------

/**
 * Each frame names its container in one word, so the question can end on that
 * word. "How much is left in it?" was the first draft, and "it" could be read
 * as the glass that was just poured — a computable answer to an unaskable
 * question (kit §E2.7).
 */
const LIQUIDS = [
  { vessel: 'carton', stuff: 'apple juice', into: 'a glass' },
  { vessel: 'bottle', stuff: 'milk', into: 'a bowl of cereal' },
  { vessel: 'flask', stuff: 'soup', into: 'a mug' },
  { vessel: 'jug', stuff: 'lemonade', into: 'a beaker' },
] as const;

/** Part-whole in milliliters: a full container, one pour taken out of it. */
const sitPourOut = situation({
  situationType: 'part-whole',
  cognitiveOp: 'pour-out',
  draw: (r) => {
    const full = r.pick([500, 750, 900, 1000] as const);
    const poured = r.int(120, 350);
    const s = r.pick(LIQUIDS);
    const name = one(r);
    return {
      prompt: `A ${s.vessel} holds ${qty(full, 'ml')} of ${s.stuff}. ${name} pours ${qty(poured, 'ml')} of it into ${s.into}. How much ${s.stuff} is left in the ${s.vessel}?`,
      answerValue: String(full - poured),
      templateId: 'd_sub_v1',
      params: { a: full, b: poured },
      units: 'ml',
      hints: [
        'Which amount does the question point at — the part poured out, or the part still inside?',
        'Picture the level before the pour and after it, and work out how far it has dropped.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** Comparison in grams: two parcels side by side, and the gap between them. */
const sitHeavierBy = situation({
  situationType: 'comparison',
  cognitiveOp: 'compare-mass',
  draw: (r) => {
    const heavy = r.int(400, 900);
    const light = r.int(150, heavy - 80);
    const [n1, n2] = two(r);
    return {
      prompt: `${n1} posts a parcel with a mass of ${qty(heavy, 'g')}. ${n2} posts one with a mass of ${qty(light, 'g')}. How much heavier is ${n1}'s parcel? Give your answer in grams.`,
      answerValue: String(heavy - light),
      templateId: 'd_sub_v1',
      params: { a: heavy, b: light },
      units: 'g',
      hints: [
        'Are these two parcels being put together, or set side by side?',
        'Line the two masses up from the same starting point and read off the bit the heavier one has spare.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/** Sharing in grams: a batch dealt out into equal portions. */
const sitPortions = situation({
  situationType: 'sharing',
  cognitiveOp: 'share-mass',
  usesPriorSkill: true,
  draw: (r) => {
    const per = r.pick([50, 60, 75, 80, 100, 120] as const);
    const portions = r.int(4, 8);
    // Each frame names its own portion, so the question can ask for a mass the
    // child can point at rather than for an abstract "share".
    const s = r.pick([
      { batch: 'bread dough', into: 'rolls', portion: 'one roll' },
      { batch: 'cake mixture', into: 'paper cases', portion: 'the mixture in one case' },
      { batch: 'birdseed', into: 'feeders', portion: 'the seed in one feeder' },
    ] as const);
    const name = one(r);
    return {
      prompt: `${name} shares ${qty(per * portions, 'g')} of ${s.batch} equally between ${countNoun(portions, s.into)}. What is the mass of ${s.portion}?`,
      answerValue: String(per),
      templateId: 'd_div_v1',
      params: { a: per * portions, b: portions },
      units: 'g',
      hints: [
        'Do all the shares end up the same size?',
        'Picture the batch cut into equal lumps, and work out what one lump is worth.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so its
 * ladder appears once per use rather than twice (kit §E2.2). The probe is a
 * benchmark call and nothing else: two books drawn in this range can land
 * either side of a bag of sugar, so the prediction cannot be made by reflex,
 * and making it IS the week's content.
 */
const sitBooksBase = situation({
  situationType: 'combine',
  cognitiveOp: 'combine-mass',
  draw: (r) => {
    const first = r.int(250, 850);
    const second = r.int(250, 850);
    const name = one(r);
    return {
      prompt: `${name} packs two books into a bag. One has a mass of ${qty(first, 'g')} and the other has a mass of ${qty(second, 'g')}. What is the mass of the two books together?`,
      answerValue: String(first + second),
      templateId: 'd_add_v1',
      params: { a: first, b: second },
      units: 'g',
      hints: [
        'Which is the bigger amount — one book on its own, or both of them in the bag?',
        'Put the two masses together, and keep the unit on the number as you write it down.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});
const sitBooksEstimate = withEstimateFirst(
  sitBooksBase,
  'will the two books together come to more than a bag of sugar, or less?',
);

// ---------------------------------------------------------------------------
// Multi-step: combine, then compare. Every operand a chain uses is stated in
// its own prompt, and the first stated quantity is the chain's initN.
// ---------------------------------------------------------------------------

/**
 * Combine then compare, in milliliters: two pours are put together and held
 * against what the can takes when it is full. The question asks for the ROOM
 * that is left, so neither pour on its own answers it.
 */
const msCanRoom = withFigure(
  multiStep({
    situationType: 'part-whole',
    cognitiveOp: 'combine-then-compare',
    draw: (r) => {
      const full = r.pick([1500, 2000, 2500] as const);
      const first = r.int(300, 700);
      const second = r.int(250, 650);
      const name = one(r);
      return {
        prompt: `[image: the watering can's scale, with its full line marked] A watering can holds ${qty(full, 'ml')} when it is full. ${name} tips in ${qty(first, 'ml')} from one bottle and ${qty(second, 'ml')} from another. How much more will the can take?`,
        initN: full,
        steps: [
          { op: 'sub', n: first, d: 1 },
          { op: 'sub', n: second, d: 1 },
        ],
        units: 'ml',
        hints: [
          'How much has gone into the can so far, and how much will it hold in all?',
          'Put the two bottles together into one amount first, then hold that amount against what the can takes.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const full = numOf(p, 'initN');
    return numberLine(
      {
        min: 0,
        max: full,
        step: 500,
        labels: 'majors',
        marks: [{ at: full, label: fmtInt(full), style: 'flag' }],
      },
      {
        alt: `the watering can's scale from empty up to its full line at ${qty(full, 'ml')}; what is in the can is not drawn`,
        asserts: assertsParam('initN', 'mark:0'),
      },
    );
  },
);

/**
 * Combine then compare, in grams — the recipe's own shape at its plainest. One
 * basket holds two things, the other holds one, and the question is the gap
 * between them, so the first basket must be made into a single amount before
 * the comparison can happen at all.
 */
const msBasketCompare = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'combine-then-compare',
  usesPriorSkill: true,
  draw: (r) => {
    // Packaged food carries a printed mass, and printed masses are round — so
    // these three are drawn in fives. A 377 g can of beans is arithmetically
    // fine and has never existed on a shelf.
    const beans = 5 * r.int(40, 90);
    const pasta = 5 * r.int(50, 100);
    const flour = 5 * r.int(60, Math.min(120, Math.floor((beans + pasta - 100) / 5)));
    const name = one(r);
    return {
      prompt: `${name} puts a ${qty(beans, 'g')} can of beans and a ${qty(pasta, 'g')} bag of pasta into one basket. The next basket holds a ${qty(flour, 'g')} bag of flour on its own. How much heavier is the first basket?`,
      initN: beans,
      steps: [
        { op: 'add', n: pasta, d: 1 },
        { op: 'sub', n: flour, d: 1 },
      ],
      units: 'g',
      hints: [
        'Which basket has more than one thing in it?',
        'Weigh the two-item basket up as a single amount first, then set that amount beside the other one.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Inverse-start (C's F3 ceiling, open since C5): the amount the story hands you
 * is what is left AFTER both bowls were served, so every word about serving
 * points the opposite way to the move it needs — the soup has to go back in.
 */
const msPanBefore = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'wind-back-volume',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const now = r.int(600, 1200);
    const firstBowl = r.int(250, 400);
    const secondBowl = r.int(250, 400);
    const name = one(r);
    return {
      prompt: `A pan holds ${qty(now, 'ml')} of soup now. ${name} filled one bowl from it with ${qty(firstBowl, 'ml')}, and before that another bowl took ${qty(secondBowl, 'ml')}. How much soup was in the pan at the start?`,
      initN: now,
      steps: [
        { op: 'add', n: firstBowl, d: 1 },
        { op: 'add', n: secondBowl, d: 1 },
      ],
      units: 'ml',
      hints: [
        'Was the soup measured before the bowls were filled, or after them?',
        'Every bowlful that was served has to go back into the pan before the starting amount can show.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// The judgement items — the deep end of this week, and no arithmetic in either
// ---------------------------------------------------------------------------

/**
 * The recipe's "g vs kg choice". A number with no unit is not a measurement,
 * and the three ways of finishing it are the three ways this goes wrong: the
 * right size, a thousand times out, and not a mass at all.
 *
 * Each entry's number is realistic in ITS unit and absurd in the other, so the
 * choice is always decidable by feel rather than by rule.
 */
const MASS_LABELS = [
  { thing: 'a paperclip', n: 1, unit: 'g' },
  { thing: 'a pencil', n: 7, unit: 'g' },
  { thing: 'a slice of bread', n: 35, unit: 'g' },
  { thing: 'an egg', n: 60, unit: 'g' },
  // Not a chocolate bar: the benchmark pool below already owns a small one at
  // 50 g, and two chocolate bars of different masses in one pack reads as a
  // contradiction even though both are true.
  { thing: 'a full pencil case', n: 180, unit: 'g' },
  { thing: 'a bag of potatoes', n: 2, unit: 'kg' },
  { thing: 'a watermelon', n: 3, unit: 'kg' },
  { thing: 'a full school bag', n: 4, unit: 'kg' },
  { thing: 'a cat', n: 5, unit: 'kg' },
] as const;

const discrimUnitOnTheLabel = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-unit',
  draw: (r) => {
    const e = r.pick(MASS_LABELS);
    const other = e.unit === 'g' ? 'kg' : 'g';
    return {
      prompt: `Which unit turns the number ${fmtInt(e.n)} into a sensible mass for ${e.thing}?`,
      correct: qty(e.n, e.unit),
      distractors: [
        {
          text: qty(e.n, other),
          errorTag: 'concept-misconception',
          rationale:
            e.unit === 'g'
              ? `A kilogram is a thousand grams, so this makes ${e.thing} a thousand times heavier than it is.`
              : `A gram is a thousandth of a kilogram, so this makes ${e.thing} a thousand times lighter than it is.`,
        },
        {
          text: qty(e.n, 'ml'),
          errorTag: 'task-comprehension',
          rationale: `Milliliters measure how much liquid a container holds, so they cannot say how heavy ${e.thing} is.`,
        },
      ],
      hints: [
        'Picture holding this thing. Is it a light one or a heavy one?',
        'Hold it in your mind against a paperclip and then against a bag of sugar, and see which one it sits nearer.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * "Is this estimate sensible?" turned into a decidable question: which
 * everyday thing IS this amount? Both distractors are real objects the child
 * knows — one far under the amount and one far over — so the item can only be
 * answered by having a feel for the unit, which is the thing being taught.
 */
const BENCHMARKS = [
  { verb: 'has a mass of', n: 1, unit: 'g', match: 'a paperclip', under: 'a single grain of rice', over: 'a bag of potatoes' },
  { verb: 'has a mass of', n: 50, unit: 'g', match: 'a small bar of chocolate', under: 'a feather', over: 'a laptop' },
  { verb: 'has a mass of', n: 1, unit: 'kg', match: 'a bag of sugar', under: 'a teaspoon', over: 'a packed suitcase' },
  { verb: 'holds', n: 5, unit: 'ml', match: 'a teaspoon of medicine', under: 'one drip from a tap', over: 'a mug of tea' },
  { verb: 'holds', n: 250, unit: 'ml', match: 'a mug of tea', under: 'a spoonful of vanilla', over: 'a watering can' },
  { verb: 'holds', n: 1, unit: 'l', match: 'a carton of milk', under: 'an egg cup of vinegar', over: 'a fish tank' },
  { verb: 'holds', n: 2, unit: 'l', match: 'a big bottle of lemonade', under: 'a thimble of water', over: 'a bath' },
] as const;

const discrimBenchmarkMatch = discrimination({
  variant: 'structural',
  cognitiveOp: 'benchmark-match',
  draw: (r) => {
    const e = r.pick(BENCHMARKS);
    return {
      prompt: `Which of these ${e.verb} about ${qty(e.n, e.unit)}?`,
      correct: e.match,
      distractors: [
        {
          text: e.under,
          errorTag: 'concept-misconception',
          rationale: 'Picks something far under the amount named — it would take a great many of them to reach it.',
        },
        {
          text: e.over,
          errorTag: 'representation-misread',
          rationale: 'Picks something far over the amount named, which reads the unit as a much bigger one than it is.',
        },
      ],
      hints: [
        'Is the amount in this question a small one or a large one?',
        'Take each thing in turn and picture it beside the amount named, until one of them fits.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the VERIFY-LIBRARY NOTE in the file header: `stat_verify_graph_scale_v1`
// computes count × key against count, which is a scale read with an interval of
// one instead of the interval its lines are worth — the recipe's misconception,
// code-derived. The extension hands the child the week's own check: a teaspoon
// settles this reading before any arithmetic starts.
// ---------------------------------------------------------------------------

const eaScaleInterval = errorAnalysis({
  verifyTemplateId: 'stat_verify_graph_scale_v1',
  cognitiveOp: 'read-scale-interval',
  drawParams: (r) => ({ key: r.pick([20, 50, 100]), count: r.int(3, 8) }),
  build: (v, p, r) => {
    const key = Number(p.key);
    const count = Number(p.count);
    const name = one(r);
    return {
      prompt: `${name} pours some water into a measuring jug and asks a friend to read it. The small lines on this jug stand for ${qty(key, 'ml')} each. The water has risen past ${countNoun(count, 'lines')}. On the record sheet the friend writes ${qty(Number(v.wrong), 'ml')}.`,
      extension:
        'Work out the real amount for yourself. Then write one sentence saying what a teaspoon would have told you about the number on the sheet.',
      hints: [
        'What does one small line on this jug stand for?',
        'Count up in the amount a single line is worth, taking that amount once for every line the water has passed.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
      answerKeywords: ['ml', 'each line', 'lines', 'teaspoon'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC19 = makeWeekBuilder({
  level: 'C',
  week: 19,
  conceptId: 'mass-liquid-volume',
  conceptName: 'Mass & liquid volume',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B21, C3, C4],
  pedagogyContract: 'v2',
  conceptualAnchor: 'benchmark units',
  conceptFamily: 'operation',
  deepeningDelta:
    'B21 measured length, where the child could lay the ruler alongside the thing and SEE the answer. Mass and capacity cannot be seen at all: the child has to trust a tool, which means reading a divided scale, and has to judge the answer without one, which means carrying a few known amounts around in their head. The new load is therefore not the arithmetic — that is C3 and C4 unchanged — but the units themselves: which one a quantity belongs in, how big each one is, and the fact that grams and milliliters answer two different questions and can never stand in for one another.',
  explanation: {
    hook:
      'Two children argue about which is heavier: a big bag of popcorn or a small can of beans. Looking will not settle it, and neither will lifting them if you are both stubborn. This week you get the thing that does settle it — a number with the right unit after it.',
    whyBeforeHow:
      'A number on its own is not a measurement, because the same number means wildly different things depending on what it counts: 4 could be four grams, which is a couple of paperclips, or four kilograms, which is a full school bag. So before we measure anything we stock up on benchmark units — a paperclip is about 1 g, a bag of sugar is about 1 kg, a teaspoon holds about 5 ml, a big bottle holds about 2 l. Four amounts you can feel are enough to judge almost anything, since every new amount can be held up against one of them and asked "nearer this, or nearer that?" And the two families never swap: grams and kilograms say how HEAVY something is, milliliters and liters say how MUCH a container holds. That is why the unit is written down beside the number every single time — the number says how many, and the unit says how many of what.',
    script: [
      {
        say: 'Watch me guess before I measure. I pick up this jar and I do not reach for the scale yet — I hold it against something I already know. A paperclip is about a gram. A bag of sugar is about a kilogram. So I ask myself one question: is this jar nearer the paperclip or nearer the sugar? Nearer the sugar, so my answer is going to be in hundreds of grams, and I know that before I have measured anything at all.',
        visual: 'A jar held in one hand, a bag of sugar in the other.',
      },
      {
        say: 'Now the scale, and here is the trap on every scale ever made: the little lines do not stand for one. Look at this dial. The numbered lines are a hundred grams apart, and each gap has five equal steps in it, so one step is twenty grams. Watch me count on from four hundred in twenties — four hundred and twenty, four hundred and forty, four hundred and sixty. Three steps, sixty grams, not three grams.',
        visual: 'The stretch of dial around the pointer, with the four hundred line and the pointer marked.',
        figure: numberLine(
          {
            min: 300,
            max: 500,
            step: 100,
            partition: 5,
            labels: 'majors',
            marks: [
              { at: 400, label: '400', style: 'flag' },
              { at: 460, label: '460', style: 'point' },
            ],
          },
          { alt: 'a scale from 300 to 500 marked every 100, with four small steps in each gap, and the pointer three steps past 400' },
        ),
      },
      {
        say: 'Liquid works the same way, in a jug instead of on a pan. This jug is marked in hundreds of milliliters, and the thousand mark has a name of its own: that is one liter. A big bottle of water holds about two of them, and a mug holds about a quarter of one. So when I read a jug I read the lines first, and then I ask whether my answer sounds like a bottle, a mug or a teaspoon.',
        visual: 'A jug scale from empty to the liter mark.',
        figure: numberLine(
          {
            min: 0,
            max: 1000,
            step: 500,
            partition: 5,
            labels: 'majors',
            marks: [{ at: 1000, label: '1,000', style: 'flag' }],
          },
          { alt: 'a jug scale from 0 to 1,000 ml, marked every 100, with the 1,000 line flagged as one liter' },
        ),
      },
      {
        say: 'Before I write any measurement down I check it against a benchmark, and it takes me one second. If my answer says a mug of tea holds two liters I stop, because a mug is nowhere near a big bottle. If it says a cat has a mass of five grams I stop, because five grams is a few paperclips. Estimating first is not a soft version of measuring — it is what tells me whether the measuring went right.',
        visual: 'A mug and a large bottle side by side, nowhere near the same size.',
      },
      {
        say: 'One last thing, and it is the one that costs people marks. Grams and kilograms say how heavy something is. Milliliters and liters say how much a container holds. They are not two sizes of the same thing, so a mass can never be written in milliliters — a number with the wrong kind of unit after it is not a wrong answer, it is not an answer at all.',
        visual: 'Two labels: one reading grams and kilograms, the other milliliters and liters.',
      },
    ],
    summary:
      'Mass is measured in grams and kilograms; how much a container holds is measured in milliliters and liters. To read any scale, work out what one small line is worth first, then count on in that amount from the numbered line below it. Keep four benchmarks in your head — a paperclip, a bag of sugar, a teaspoon, a big bottle — and hold every answer up against one of them before you write it down. And always write the unit: the number on its own says nothing.',
    vocabulary: [
      { term: 'mass', kidGloss: 'how heavy something is, measured in grams and kilograms' },
      { term: 'capacity', kidGloss: 'how much a container holds, measured in milliliters and liters' },
      { term: 'benchmark', kidGloss: 'an everyday thing whose size you know by heart, used to judge others' },
      { term: 'kilogram (kg)', kidGloss: '1,000 g — about a bag of sugar' },
      { term: 'liter (l)', kidGloss: '1,000 ml — about a big carton of juice' },
      { term: 'scale', kidGloss: 'the line of marks on a dial or a jug that a measurement is read off' },
    ],
  },
  guidedExamples: [
    {
      ...ge(19, 1, 'modeled', 'A bag of rice is on the kitchen scale. The numbered lines are 100 g apart, and each gap is split into 5 equal steps. The pointer has passed the 400 g line and stopped 3 steps further on. What is the mass of the rice?', [
        {
          teacherSay:
            'Watch what I settle before I read a single number off this dial. The numbered lines jump by a hundred grams, and there are five equal steps between them, so one step is not one gram. What is one step worth here?',
          expected: '20',
        },
        {
          teacherSay:
            'Now I start at the four hundred line and count on in twenties, saying it out loud so I cannot lose my place — four hundred and twenty, four hundred and forty. Where does the third step land me?',
          expected: '460',
          figure: numberLine(
            {
              min: 300,
              max: 500,
              step: 100,
              partition: 5,
              labels: 'majors',
              marks: [
                { at: 460, label: '460', style: 'flag' },
                { at: 400, label: '400', style: 'point' },
              ],
            },
            { alt: 'the dial from 300 to 500 with the pointer three small steps past the 400 line', asserts: assertsAnswer },
          ),
        },
        {
          teacherSay:
            'Four hundred and sixty grams. I say the unit as I write it, because four hundred and sixty on its own could be anything at all, and I check it once against a bag of sugar — a bit under, which is about right for rice in a bag this size.',
        },
      ], '460 g'),
      visual: 'The dial around the pointer, with the 400 line and the pointer marked.',
    },
    {
      ...ge(19, 2, 'completion', 'A jug is marked every 100 ml. The juice stands 4 lines above the 500 ml line. How much juice is in the jug?', [
        { teacherSay: 'Does one line on this jug stand for a single milliliter, or for a hundred of them?', expected: 'a hundred' },
        { childDo: 'Count on from the line the juice has passed, one line at a time, saying the running amount out loud.', expected: '900' },
      ], '900 ml'),
      visual: 'The jug scale, with the 500 ml line marked and the juice level left for you.',
      figure: numberLine(
        {
          min: 0,
          max: 1000,
          step: 500,
          partition: 5,
          labels: 'majors',
          // COMPLETION fade: the child produces the reading, so the picture shows
          // the line they were GIVEN and stops there. Drawing the juice level
          // would answer the step it is asking for (L33).
          marks: [{ at: 500, label: '500', style: 'flag' }],
        },
        { alt: 'a jug scale from 0 to 1,000 ml marked every 100, with the 500 ml line flagged and no juice level drawn' },
      ),
    },
    ge(19, 3, 'prompted', 'A watering can holds 2,000 ml when it is full. 700 ml is tipped in from one bottle and 450 ml from another. How much more will the can take?', [
      { childDo: 'Put the two bottles together into one amount first, then hold that amount against what the can takes.', expected: '1,150' },
    ], '850 ml'),
    {
      // Independent stage: no picture at all. Deciding which unit a bare number
      // belongs in is a judgement about the real world, and a drawing of a
      // school bag beside a bag of sugar would make it a looking task.
      ...ge(19, 4, 'independent', 'The mass of a full school bag is written down as 4, and the unit is missing. Is that 4 g, 4 kg or 4 ml? Solve cold.', [
        { childDo: 'Hold the bag in your mind against a paperclip and then against a bag of sugar, and say which it sits nearer.', expected: 'the bag of sugar' },
      ], '4 kg'),
      visual: 'No picture — this one is decided by what you already know about a school bag.',
    },
  ],
  days: [
    // Day 1 — concept echo: read a divided scale, and the two one-line
    // measurement stories the rest of the week composes. Single-step throughout.
    [
      { gen: wAdd, diff: 2 },
      { gen: wSub, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: sitScaleMass, diff: 2 },
      { gen: sitPourOut, diff: 3 },
      { gen: sitHeavierBy, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first benchmark call, the
    // unit-choice trap, and the week's first combine-then-compare chain.
    [
      { gen: wShare, diff: 2 },
      { gen: sitBooksEstimate, diff: 3 },
      { gen: discrimUnitOnTheLabel, diff: 4 },
      { gen: msCanRoom, diff: 4 },
      { gen: sitScaleMass, diff: 3 },
      { gen: sitPortions, diff: 3 },
    ],
    // Day 3 — interleave: both judgement items on one page beside a chain and
    // two one-line stories, so the page shape never says which kind is coming.
    // The two choice items are kept apart on the page — back to back they read
    // as one exercise asked twice.
    [
      { gen: wRibbon, diff: 2 },
      { gen: discrimBenchmarkMatch, diff: 4 },
      { gen: msBasketCompare, diff: 4 },
      { gen: discrimUnitOnTheLabel, diff: 4 },
      { gen: sitPourOut, diff: 3 },
      { gen: sitHeavierBy, diff: 3 },
    ],
    // Day 4 — word problems: three chains, one of them inverse-start, with the
    // estimate-first item and a one-line share mixed in so "it must be two
    // steps" never becomes the cue.
    [
      { gen: msPanBefore, diff: 5 },
      { gen: msCanRoom, diff: 4 },
      { gen: msBasketCompare, diff: 4 },
      { gen: sitBooksEstimate, diff: 4 },
      { gen: sitPortions, diff: 3 },
    ],
    // Day 5 — non-computational: the scale-interval error-analysis, the
    // benchmark hunt the recipe asks for, and the claim that generalises it.
    [
      { gen: wRound, diff: 2 },
      { gen: eaScaleInterval, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Go on a benchmark hunt at home. Find one thing with a mass of about 1 g. Find one with a mass of about 1 kg. Find one that holds about 1 l. Write down what you chose for each. Then write one sentence saying how you decided, without using any scale or jug.',
          value:
            'three sensible finds, each judged against a known benchmark — a paperclip for the gram, a bag of sugar for the kilogram, a carton of milk for the liter',
          acceptableForms: ['paperclip', 'bag of sugar', 'carton', 'bottle', 'about', 'compared'],
          keywords: true,
          hints: [
            'Which everyday things do you already know the mass of?',
            'Hold the thing in one hand and something you know in the other, and let your hands do the comparing.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: an amount written in kilograms is heavier than an amount written in grams. Say in one sentence how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Lets the name of the unit decide on its own, but a small number of kilograms can sit below a large number of grams.',
            },
            {
              text: 'never',
              errorTag: 'task-comprehension',
              rationale: 'Rules out all the ordinary cases where the kilogram amount really is the heavier of the two.',
            },
          ],
          hints: [
            'Can you think of a small number of kilograms and a large number of grams?',
            'Try a light thing measured in kilograms beside a heavy thing measured in grams, and see which one wins.',
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
    'For grown-ups: the arithmetic in this week is last year\'s, so if an answer comes out strange the unit is nearly always the culprit rather than the sum. The cure is a kitchen, not a worksheet. Hand your child the sugar and a paperclip and ask which one a gram feels like; fill a jug to the liter line and pour it into a mug so they see how many mugs it takes. Children who can feel a kilogram never write that a cat has a mass of five grams, and children who cannot will keep doing it however many sums they get right.',
  ],
  puzzle: (r) => {
    const each = r.pick([10, 20, 25, 50] as const);
    const washers = r.int(4, 9);
    const weight = r.pick([100, 200, 300] as const);
    const parcel = weight + washers * each;
    const name = one(r);
    return {
      id: 'C19-PZ-01',
      title: 'Puzzle Grove: The Level Balance',
      puzzleType: 'logic',
      prompt: `A pan balance is exactly level. On the left pan sits ${name}'s parcel, with a mass of ${qty(parcel, 'g')}. On the right pan sit a ${qty(weight, 'g')} weight and a handful of identical washers. Every washer has a mass of ${qty(each, 'g')}. How many washers are on the right pan? Then say how you know that no other number of washers would leave the balance level.`,
      answer: {
        value: String(washers),
        acceptableForms: [countNoun(washers, 'washers')],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'What has to be true about the two pans of a balance that is sitting level?',
        'Take the weight off the right pan, take the same amount off the parcel side, and see how many washers fill the gap that is left.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Addition within 100 — the counting-on that walks a scale from one line to the next',
    sourceWeek: C3,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 12, max: 96, regroup: 'mixed' },
  },
  mastery: [
    { gen: sitScaleMass, diff: 3 },
    { gen: msCanRoom, diff: 4 },
    { gen: sitHeavierBy, diff: 3 },
    { gen: msBasketCompare, diff: 4 },
    { gen: sitPortions, diff: 3 },
    { gen: msPanBefore, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the three one-line forms the week teaches — a divided kitchen scale read in grams (with its dial figure preserved, marking only the numbered line the child is handed), a side-by-side comparison of two masses, and a batch of dough shared into equal portions. 02/04: the two combine-then-compare chains, one holding two pours against what a can takes and one holding a two-item basket against a single-item one. 06: the inverse-start chain, where the stated amount is what is left after both bowls were served. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'wrong-scale-interval',
      description: 'Reads a divided scale by counting its lines, so every reading comes back in units of one instead of the amount a line is worth.',
      exampleWrongAnswer: 'a jug whose lines are 50 ml apart, filled past 6 of them, read as 6 ml',
      distractorRationale: 'Offer the number of lines the pointer or the water has passed.',
      reteachPointer: 'explanation/script[1] (the little lines do not stand for one)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'unit-size-unfelt',
      description: 'Gives a mass or a capacity in the wrong-sized unit — grams where the thing needs kilograms, or the reverse — so the amount is a thousand times out and the answer is never checked against anything.',
      exampleWrongAnswer: 'a full school bag given a mass of 4 g',
      distractorRationale: 'Offer the same number carrying the other unit of that family.',
      reteachPointer: 'explanation/script[0] (nearer the paperclip, or nearer the sugar?)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'mass-answered-as-capacity',
      description: 'Answers a "how heavy" question with a liquid measure, or a "how much does it hold" question with grams, treating the two families of unit as interchangeable.',
      exampleWrongAnswer: 'a watermelon given a mass of 3 ml',
      distractorRationale: 'Offer the same number carrying a milliliter label on a mass question.',
      reteachPointer: 'explanation/script[4] (two families of unit, two different questions)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'one-line-lost',
      description: 'Plans a combine-then-compare story correctly and then stops at the combined amount, or slips on the regrouping in one of the two lines.',
      exampleWrongAnswer: 'a can holding 2,000 ml with 700 ml and 450 ml tipped in, answered as 1,150 ml',
      distractorRationale: 'Offer the combined amount that the second line was meant to be taken from.',
      reteachPointer: 'guidedExamples/C19-GE-03 (the two bottles first, then the can), then the 2-minute addition sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Mass and liquid volume — reading a divided scale by working out what one small line is worth, adding and comparing masses in grams and amounts in milliliters, and above all judging which unit an amount belongs in by holding it against something known: a paperclip, a bag of sugar, a teaspoon, a big bottle.',
    improvingCandidates: [
      'working out what one line on a scale is worth before reading anything off it',
      'choosing between grams and kilograms by picturing the thing being weighed',
      'writing the unit beside every measured number',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'reading a divided scale — the small lines almost never stand for one, and finding out what they do stand for is the whole job',
      },
      {
        errorTag: 'concept-misconception',
        text: 'the size of each unit, which is what the four household benchmarks are for',
      },
      {
        errorTag: 'task-comprehension',
        text: 'keeping how-heavy apart from how-much-it-holds, so a mass never comes back in milliliters',
      },
    ],
    homeFocus: {
      praiseLine:
        'You compared the parcel with a bag of sugar before you wrote a number down — that is the move that catches a wrong measurement in one second.',
      questionForChild: 'Which do you think is heavier, our kettle when it is full or your school bag — and what did you compare each one with?',
      schoolSyncHook: 'If your child\'s class writes units out in full (grams, kilograms) rather than as g and kg, tell us and we will match them.',
    },
    vocabularyForParent: [
      'mass (how heavy something is: grams and kilograms)',
      'capacity (how much a container holds: milliliters and liters)',
      'benchmark (a known everyday amount used to judge a new one)',
    ],
  },
});
