/**
 * Level B · Week 21 — "Measuring length" (conceptId: measuring-length).
 *
 * FILL-ARCHITECTURE §4 row B21: anchor "units end-to-end, no gaps"; multi-step
 * "measure two, compare"; error-analysis "gaps-and-overlaps count";
 * discrimination "same object, different units → different numbers"; Day-5
 * signature "measure with two units + why differ". Catalog focus: "Inches and
 * centimeters; ruler technique; estimate-then-measure" and "Measurement
 * detective: why did two children get different answers?".
 *
 * WHAT THIS WEEK IS FOR. A measurement is a COUNT — of equal units, laid end to
 * end, with nothing missed and nothing counted twice. Everything else in the
 * week falls out of that one sentence:
 *   1. a GAP lets the line of units reach further than the units themselves, so
 *      too few get counted;
 *   2. an OVERLAP makes each unit add less than its own length, so too many get
 *      counted;
 *   3. MIXED units break it for exactly the same reason — the count stops
 *      meaning one thing;
 *   4. and the deepest one: the UNIT DECIDES THE NUMBER. A short unit fits more
 *      times along the same object, so the same comb is 15 cubes and 5
 *      paperclips, and neither count is a mistake. A child who believes "bigger
 *      number means longer" has missed the whole idea, so that belief is put on
 *      the page three times: as the discrimination's own distractor, as the
 *      Always/Sometimes/Never claim, and as the Day-5 production.
 *
 * THE TWO-UNITS ITEM CARRIES REAL WEIGHT, by design rather than by assertion.
 * `discWhichUnitCounted` is served twice in the daily core (Days 2 and 3, at
 * rising difficulty) and again in the mastery check, and two things keep it
 * honest. It is PINNED — the draw posts `{a: 3, b: paperclips, op: '*'}` into
 * `d_verify_binop_v1`, so QG-11 recomputes the cube count from the paperclip
 * count and PROVES that the two numbers on the page really are two measurements
 * of one length; without that, the item would be asserting the very thing it
 * asks the child to believe. And WHICH UNIT is asked for rotates per draw
 * (measured 610 / 590 over 300 packs), because the cube count is always the
 * bigger number and a child who met the page twice could otherwise pass it by
 * picking the bigger one — which is the belief the page exists to unseat. On the
 * paperclip branch the pin flips to `{a: cubes, b: 3, op: '/'}`, so the keyed
 * number is still recomputed rather than trusted. Its third option ("one of them
 * must be mistaken") is the misconception in its own words, and it is the option
 * a child who thinks a length has one number will reach for.
 *
 * ONE MEASURING SYSTEM, AND IT IS REAL. A cube is one centimeter wide (a
 * base-ten unit cube) and a small paperclip is three centimeters, so a
 * paperclip is exactly three cubes. That is stated in the lesson and every
 * number in the pack obeys it: the six things on the measuring table are a glue
 * stick (9), a lollipop (12), a comb (15), a toothbrush (18), a paintbrush (21)
 * and a hairbrush (24) — each a real length in centimeters AND a whole number of
 * paperclips. Every other quantity was checked the same way: a runner bean
 * 13–22 cm, a courgette at a vegetable show 9–28 cm, a leek 15–28 cm, a
 * cucumber 11–21 cm, a worm 5–14 cm, the zip on a wash bag 12–18 cm, a
 * cabbage caterpillar 4–6 cm, a beanstalk on the windowsill 41–90 cm. Nothing in
 * this pack is a pencil that is 40 cm long, and reading the generated week is
 * what caught the two that were: a nine-centimeter cabbage caterpillar and an
 * eighteen-centimeter zip hung on a coat, whose real zip is three times that.
 * The end-of-build re-scan then moved that zip a second time: c08 finds pebbles
 * in one coat pocket and b18 finds loose hairbands in another, so it now runs
 * along a wash bag, which no week has opened.
 *
 * NO × AND NO ÷ ANYWHERE CHILD-FACING. C6/C9 own those symbols; B21 lays
 * paperclips end to end and swaps each one for the cubes that fill it.
 * `sitPaperclipsToCubes` names the registered `d_mul_v1` and
 * `msPaperclipsThenCubes` carries an internal `{op:'mul'}` step — that is the
 * library's only way to say "this unit again, once per unit", and it is what
 * makes both answers code-computed rather than authored. No prompt in this pack
 * contains a `×` or a `÷`, and every one states the move as laying units down.
 * (b19 and b20 made the same declaration; it is repeated rather than assumed.)
 *
 * VERIFY-LIBRARY LIMIT AND HOW IT WAS CLOSED (kit §E2.3, and it was the FIRST
 * branch that paid: hunt for an algebraic identity before reframing anything).
 * The recipe's error is a child whose GAPS make the count come out short, so
 * the shown wrong number must be the number of units LAID and the truth must be
 * that number plus the units lost in the gaps. No registered transform returns
 * an operand unchanged — until the operand pair is chosen so that it does. With
 * `b = 1`, `d_verify_binop_misconception_v1` over `{op:'+', wrongOp:'*'}` gives
 *   correct = a + 1   (the gap is one unit's worth of length, so it counts)
 *   wrong   = a × 1 = a   (the gap is treated as free, so the count is untouched)
 * — which is EXACTLY the misconception, arithmetically. Both numbers are real
 * transform outputs over the story's own two quantities (the cubes laid down,
 * and the one gap), nothing is fabricated, and the recipe's intended item
 * survives whole. The `wrongOp` in the params is the DERIVATION, not the
 * diagnosis: the diagnosis lives in the mistakeBank ("a gap is counted as free")
 * and is what the child has to supply. The price is that `b` is pinned at one
 * gap, which costs nothing — a pack carries exactly one error-analysis item, and
 * one gap in a line of cubes is what a six-year-old actually leaves.
 *   The OVERLAP half of the recipe cannot be derived the same way (an overlap of
 * half a unit is not a story a six-year-old is told), so it is shown where it
 * CAN be shown honestly: `discGapsAndOverlaps` puts a gap-layer, an
 * overlap-layer and a touching-layer side by side and asks which count comes out
 * smallest — or biggest, rotating per draw. No number is invented there because
 * no number is stated; the child reasons about what one unit adds. Disclosed
 * here rather than buried in a comment.
 *
 * CONCEPT FAMILY: 'operation', the full row (≥2 multi-step week-wide; four
 * multi-step items here). Declaring 'place-value' would have been a dodge — the
 * recipe hands this week its own two-step and it is the point.
 * `msMeasureThenCompare` measures two things and holds them against each other,
 * which is the recipe's own chain. `msPaperclipsThenCubes` changes the unit and
 * then finishes the last bit in cubes, which is the two-unit idea doing work
 * rather than being discussed. Measuring first and comparing second is a
 * different job from changing the unit first and adding second; a child who has
 * met only one of them has learnt a scene rather than a method.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). `barModel` draws an object
 * against a row of unit lengths, which is this week's anchor exactly — and that
 * makes it a scaffold that can perform the assessed move, so it is rationed:
 *   - the lesson script uses it freely (the object beside its cubes, the same
 *     line with a gap in it, and the same comb against BOTH units), because
 *     there the answer is already on the page and watching the count change IS
 *     the teaching;
 *   - on assessed pages it appears three times and never shows the answer.
 *     `sitCubeTrain` draws the row of cubes the child was told was laid down —
 *     not the bean, whose length is the question. `sitPaperclipsToCubes` draws
 *     ONE paperclip above the three cubes that fill it, which is the relation
 *     the prose has already stated. `sitLeekWhole` draws the white part only;
 *     the whole leek is what is asked for;
 *   - the two discriminations, both chains, the size prediction and every Day-5
 *     page carry NO picture on purpose. Two layouts drawn side by side answer
 *     "whose count is smallest?" by letting the child count them, and a drawn
 *     worm beside "will ten cubes reach the tail?" settles the prediction before
 *     it is made.
 * Every assessed figure asserts one of the item's OWN generator params, so a
 * picture that contradicted its item would fail QG-13 rather than merely be
 * unlikely.
 *
 * A GAP, DRAWN HONESTLY. `barModel` segments are additive, so the script's gap
 * is a segment with `fill:'none'` — the line still spans the glue stick, and one
 * of its nine places holds no cube. An overlap cannot be drawn that way without
 * lying about the total, so the overlap segment of the lesson carries a stage
 * direction and no figure. Said out loud because a missing picture in a week
 * about pictures looks like an oversight.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): every child-facing
 * sentence ≤15 words, counted rather than estimated; `measure`, `unit`, `end to
 * end`, `gap`, `centimeter` and `inch` glossed in `explanation.vocabulary`
 * before any item leans on them; metacognition in its intro form — the B row's
 * own "will it pass …?" call, made over a worm whose cube count genuinely lands
 * on both sides of ten; error-analysis written-lite, one sentence; the sprint
 * ungraded and self-referenced. No gendered pronoun appears in any prompt,
 * because every name is drawn.
 *
 * FRAMES, re-checked against the weeks directory at the END of the build (kit
 * §E2.8), not at the start, and with plain substring greps rather than word
 * boundaries. The scan earned its keep six times:
 *   - b14 already measures A PAPER STREAMER in centimeters and cuts a length off
 *     it, and c19's own B21 warm-up cuts centimeters off A ROLL OF RIBBON. Those
 *     are the two obvious length scenes and both are spoken for, so nothing here
 *     is cut, and no ribbon or streamer appears;
 *   - c16's measured stretch is a LONG JUMP RUN-UP, which killed a sports-day
 *     standing-jump comparison that had reached its second draft;
 *   - a bunting scene died to c12 (strings of bunting on the school fence) and a
 *     school-fair scene to b14 and c05;
 *   - CRAYONS and PENCILS, the two objects a measuring week reaches for first,
 *     are in six and seventeen files respectively — b20's header warned that
 *     "crayons" hides behind "crayon", and it does. Neither appears here;
 *   - 'shelf' is in twenty files (b19 stands matchboxes on one), 'bookmark' in
 *     two, 'postcard' in three, 'envelope', 'straw', 'chalk', 'leaf', 'feather',
 *     'twig', 'carrot', 'teaspoon', 'eraser', 'domino', 'craft stick' and
 *     'conker' all had holders. Every one was dropped rather than repeated;
 *   - b19 counts FORKS in trays, which is why the leek is pulled and not laid on
 *     the cutlery drawer.
 * What is kept returns ZERO hits across all sixty-three authored weeks: a runner
 * bean, a courgette at a vegetable show, a leek, a cucumber, a worm, the zip on
 * a wash bag, a caterpillar on a cabbage, a beanstalk on a windowsill, a pegboard,
 * a glue stick, a lollipop, a comb, a toothbrush, a paintbrush, a hairbrush.
 * TWO DISCLOSED NEAR-MISSES, flagged here rather than buried:
 *   - PAPERCLIPS. c19 uses a paperclip as its 1-gram MASS benchmark, and c19 is
 *     the week that cites B21 as its ancestor. The same everyday object is used
 *     here for a different property — its LENGTH — which is the honest reason a
 *     paperclip is the classroom's standard nonstandard unit at both bands. Kept
 *     deliberately; a paperclip that weighs a gram and measures three
 *     centimeters is one object, not two frames;
 *   - CUBES. b02 snaps ten loose cubes into a rod for place value, and b20/c07
 *     count them as generic counters. Cubes here are a LENGTH unit laid end to
 *     end. Like buttons and blocks, they are classroom apparatus rather than a
 *     scene, which is why the corpus can share them and cannot share a car park.
 *
 * Retrieval is backward-only and every warm-up is load-bearing: B18 (hops of two
 * along a path — the count that gets you along a long row of units quickly), B13
 * (addition within 100, which is what joining two lengths is), B14 (subtraction
 * within 100, which is what "how much taller" is, and the sprint's own skill)
 * and B20 (rows of the same size — the equal-groups structure that "each
 * paperclip is three cubes" leans on).
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswerOf, assertsParam, barModel, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };
const B18 = { level: 'B' as const, week: 18 };
const B20 = { level: 'B' as const, week: 20 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so a comparison is never between someone and themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];
/** Three DIFFERENT names, for the three ways of laying a line of cubes. */
const three = (r: Rng): [string, string, string] =>
  r.shuffle([...NAMES]).slice(0, 3) as [string, string, string];

/** A paperclip is as long as this many cubes. Stated in the lesson; obeyed everywhere. */
const CLIP_CUBES = 3;

/**
 * The measuring table — six real things, each a plausible length in centimeters
 * AND a whole number of paperclips (a cube is one centimeter, a paperclip three).
 * Six distinct lengths, so two draws never land on the same operand surface.
 */
const TABLE = [
  { thing: 'glue stick', cubes: 9 },
  { thing: 'lollipop', cubes: 12 },
  { thing: 'comb', cubes: 15 },
  { thing: 'toothbrush', cubes: 18 },
  { thing: 'paintbrush', cubes: 21 },
  { thing: 'hairbrush', cubes: 24 },
] as const;

// ---------------------------------------------------------------------------
// Decorators — a picture, or a pinned truth, built from the item's OWN values.
//
// The shipped primitives carry no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so
// the QG-1/QG-4 surface signature the guard already registered is unchanged).
//
// `withFigure` rebuilds from the drafted item's `generator.params` — the very
// numbers its answer was computed from — which is what makes a contradicting
// picture unbuildable rather than merely unlikely. `withPin` covers the one case
// the params cannot: `discrimination()` emits no generator spec at all, so its
// draw closure posts what it drew into a one-slot box the decorator reads
// immediately afterwards. `drawUniqueItem` returns the draft its LAST build call
// produced, so the box always holds that same draw. (Pattern from c06/b15/b19.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface Pin {
  params: Params;
  seed: number;
}

function pinSlot(): { last: Pin | null } {
  return { last: null };
}

/**
 * Give a choice item the generator spec that lets the gates read it.
 *
 * Used once here, on the two-units discrimination, and it is the reason that
 * item can be trusted: the pinned template is `d_verify_binop_v1` fed the
 * paperclip count and the size of one paperclip, so QG-11 recomputes the cube
 * count and proves the two numbers the page shows are two measurements of ONE
 * length rather than two numbers the author liked the look of.
 */
function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = box.last;
    if (!pin) throw new Error('b21/withPin: the draw posted nothing to build from');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

// ---------------------------------------------------------------------------
// The anchor, drawn — units laid end to end, and nothing else
// ---------------------------------------------------------------------------

/** "a row of 15 cubes, touching, with no gaps" — the alt and the prompt's tag. */
const cubeRowAlt = (n: number): string => `a row of ${countNoun(n, 'cubes')}, touching, with no gaps`;

/**
 * A row of `n` cubes and no object beside it.
 *
 * This is the anchor picture, and it deliberately does NOT show the thing being
 * measured: the whole question is where that thing ends. Drawing both would
 * answer it by looking.
 */
const cubeRow = (n: number, key: string): BBFigure =>
  barModel([{ label: 'the cubes laid down', segments: Array.from({ length: n }, () => ({ value: 1 })) }], {
    alt: cubeRowAlt(n),
    asserts: assertsParam(key, 'bar:0'),
  });

/** One paperclip above the cubes that fill it — the unit relation the prose states. */
const clipAlt = `one paperclip laid above a row of ${countNoun(CLIP_CUBES, 'cubes')} of the same length`;

const clipAgainstCubes = (key: string): BBFigure =>
  barModel(
    [
      { label: 'one paperclip', segments: [{ value: CLIP_CUBES }] },
      { label: 'cubes', segments: Array.from({ length: CLIP_CUBES }, () => ({ value: 1 })) },
    ],
    { alt: clipAlt, asserts: assertsParam(key, 'bar:0') },
  );

/**
 * One part of a two-part object, measured off in cubes — a given, never the whole.
 *
 * The accessible name carries the count, so a child who cannot see the drawing is
 * handed exactly what a child who can see it is handed: the part, not the total.
 */
const leekPartAlt = (n: number): string =>
  `the white part of the leek, ${countNoun(n, 'cubes')} long`;

const onePart = (n: number, label: string, key: string): BBFigure =>
  barModel([{ label, segments: Array.from({ length: n }, () => ({ value: 1 })) }], {
    alt: leekPartAlt(n),
    asserts: assertsParam(key, 'bar:0'),
  });

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B18 — hops of two along a path, and it opens the week on purpose.
 *
 * A long row of units is slow to count one at a time, and the fast way is the
 * count B18 has just taught. No scene at all: it is a move along the number
 * itself, and this week has enough things lying end to end already.
 */
const wHopsOfTwo = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-in-twos',
    draw: (r) => {
      const start = r.int(11, 38);
      const hops = r.int(4, 9);
      const name = one(r);
      return {
        prompt: `${name} starts at ${start} and takes ${countNoun(hops, 'hops')} of two. Which number does ${name} land on?`,
        answerValue: String(start + 2 * hops),
        templateId: 'retr_skip_count_v1',
        params: { start, k: hops },
        hints: [
          'Which way along the path do these hops go?',
          'Move two along for each hop, and count the hops as you go.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B18,
);

/**
 * B13 — addition within 100, which is what joining two lengths comes down to.
 *
 * Kept off the measuring table on purpose. b14 already cuts a paper streamer in
 * centimeters and c19's own B21 warm-up cuts a ribbon, so a third week doing
 * arithmetic on a cut length would read as the same page written three times
 * (kit §E2.8). The cabbages are counted, not measured.
 */
const wCabbagePlants = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-within-100',
    draw: (r) => {
      const first = 10 * r.int(2, 5) + r.int(3, 9);
      const second = 10 * r.int(1, 3) + r.int(3, 9);
      const name = one(r);
      return {
        prompt: `${name} counts ${countNoun(first, 'cabbage plants')} in one bed. The next bed holds ${countNoun(second, 'cabbage plants')}. How many cabbage plants is that in all?`,
        answerValue: String(first + second),
        templateId: 'retr_add_within_100_v1',
        params: { a: first, b: second },
        units: 'cabbage plants',
        hints: [
          'Which is more — one bed on its own, or both beds together?',
          'Take the bigger amount, then count the other one on, tens before ones.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B13,
);

/**
 * B14 — subtraction within 100, in centimeters, because plant heights are the
 * one length a six-year-old measures again and again over weeks. It is also the
 * sprint's skill, and the arithmetic every "how much longer" page on Day 1 runs.
 */
const wBeanstalkGrew = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'sub-within-100',
    draw: (r) => {
      const before = r.int(41, 62);
      const now = before + r.int(14, 29);
      const name = one(r);
      return {
        prompt: `On Monday ${name}'s beanstalk measured ${countNoun(before, 'centimeters')}. Today it measures ${countNoun(now, 'centimeters')}. How many centimeters has it grown?`,
        answerValue: String(now - before),
        templateId: 'retr_sub_within_100_v1',
        params: { a: now, b: before },
        units: 'centimeters',
        hints: [
          'Which measurement was taken first, and which one is bigger?',
          'Start both heights at the soil, and measure the extra bit at the top.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B14,
);

/**
 * B20 — rows of the same size. The structure "each paperclip is worth three
 * cubes" leans on it directly: equal groups, counted once per group.
 *
 * A pegboard rather than a wall, a roof or a tray: b20 owns letterboxes, solar
 * panels, ice-cube hollows, deckchairs and knitted rows, and none of them is
 * getting a second outing here (kit §E2.8).
 */
const wPegboardRows = asWarmup(
  situation({
    situationType: 'area',
    cognitiveOp: 'rows-total',
    draw: (r) => {
      const holes = r.int(4, 8);
      const rows = r.int(3, 6);
      const name = one(r);
      return {
        prompt: `${name} looks at the pegboard on the wall. It has ${countNoun(rows, 'rows')}, and every row holds ${countNoun(holes, 'holes')}. How many holes are on the board?`,
        answerValue: String(holes * rows),
        templateId: 'd_mul_v1',
        params: { a: holes, b: rows },
        units: 'holes',
        hints: [
          'What would you find out by counting just one row?',
          'Count on in row-sized jumps, one jump for every row.',
        ],
        errorTags: ['representation-misread', 'fact-recall'],
      };
    },
  }),
  B20,
);

// ---------------------------------------------------------------------------
// Single-step core — the count, the unit swap, the comparison and the join
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR: cubes laid end to end, and the question of where the object ends.
 *
 * The cubes overhang the tip of the bean, which is what really happens on a
 * table, and it forces the one decision the whole week rests on: a measurement
 * counts the units that lie ALONG the thing, not the units you happened to put
 * down. Two or three cubes stick out, never one, so the sentence never has to
 * read "the last 1 cube stick out".
 *
 * The figure draws the row that was laid and not the bean. A child who can see
 * the drawing is handed the count the prose already gave them; the answer stays
 * where it belongs.
 */
const sitCubeTrain = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'measure-end-to-end',
    draw: (r) => {
      const bean = r.int(13, 22);
      const over = r.int(2, 3);
      const laid = bean + over;
      const name = one(r);
      return {
        prompt: `[image: ${cubeRowAlt(laid)}] ${name} measures a runner bean from the garden. ${name} lays ${countNoun(laid, 'cubes')} along it, end to end. The last ${countNoun(over, 'cubes')} stick out past the tip. How many cubes long is the bean?`,
        answerValue: String(bean),
        templateId: 'd_sub_v1',
        params: { a: laid, b: over },
        units: 'cubes',
        hints: [
          'Where does the bean end, and where does the row of cubes end?',
          'Count only the cubes lying along the bean, and stop at the tip.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  }),
  (p) => cubeRow(numOf(p, 'a'), 'a'),
);

/**
 * THE UNIT SWAP: the same length, counted in the other unit.
 *
 * This is the week's deep idea in its plainest single-step form — a paperclip
 * count and a cube count for one object, with the child doing the swap. It is
 * not conversion drill because the number that comes out is the POINT: more
 * cubes than paperclips, every time, and the object never changed.
 *
 * The figure shows one paperclip above the three cubes that fill it. That is
 * the relation the first sentence states; the total is what is asked for.
 */
const sitPaperclipsToCubes = withFigure(
  situation({
    situationType: 'rate',
    cognitiveOp: 'unit-swap',
    draw: (r) => {
      const e = r.pick(TABLE);
      const clips = e.cubes / CLIP_CUBES;
      const name = one(r);
      return {
        prompt: `[image: ${clipAlt}] Each paperclip is as long as ${countNoun(CLIP_CUBES, 'cubes')}. ${name} lays ${countNoun(clips, 'paperclips')} end to end along a ${e.thing}. How many cubes long is the ${e.thing}?`,
        answerValue: String(e.cubes),
        templateId: 'd_mul_v1',
        params: { a: CLIP_CUBES, b: clips },
        units: 'cubes',
        hints: [
          'Which is longer, one cube or one paperclip?',
          'Swap each paperclip for the cubes that fill it, then count all the cubes.',
        ],
        errorTags: ['concept-misconception', 'fact-recall'],
      };
    },
  }),
  () => clipAgainstCubes('a'),
);

/**
 * THE COMPARISON, in centimeters — the grown-up unit, on a length nobody would
 * measure in cubes. A vegetable show is where two things of the same kind
 * genuinely get held against each other, and the numbers are the two-digit
 * subtraction B14 has just finished teaching.
 *
 * No picture. Two courgettes drawn side by side answer "how much longer" by
 * looking, which is the one thing this page asks the child to work out.
 */
const sitCourgetteLonger = situation({
  situationType: 'comparison',
  cognitiveOp: 'compare-length',
  draw: (r) => {
    const longer = r.int(17, 28);
    const shorter = r.int(9, longer - 4);
    const [first, second] = two(r);
    return {
      prompt: `${first} brings a courgette ${countNoun(longer, 'centimeters')} long to the vegetable show. ${second}'s courgette is ${countNoun(shorter, 'centimeters')} long. How much longer is ${first}'s courgette?`,
      answerValue: String(longer - shorter),
      templateId: 'd_sub_v1',
      params: { a: longer, b: shorter },
      units: 'centimeters',
      hints: [
        'Does this question ask for a total, or for a difference?',
        'Set them level at one end, then measure the bit that sticks out.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * THE JOIN: two parts of one thing, measured separately and put back together.
 *
 * A leek really does come in a white part and a green part, so the two lengths
 * are handed over by the vegetable rather than by the question. The figure draws
 * the WHITE part only and asserts its length; the whole leek is the answer and
 * is never drawn.
 */
const sitLeekWhole = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'join-parts',
    draw: (r) => {
      const white = r.int(9, 16);
      const green = r.int(6, 12);
      const name = one(r);
      return {
        prompt: `[image: ${leekPartAlt(white)}] ${name} pulls a leek from the school garden. Its white part is ${countNoun(white, 'cubes')} long. Its green part is ${countNoun(green, 'cubes')} long. How many cubes long is the whole leek?`,
        answerValue: String(white + green),
        templateId: 'd_add_v1',
        params: { a: white, b: green },
        units: 'cubes',
        hints: [
          'How many parts does this leek come in?',
          'Put the two parts back end to end, and count the whole length.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => onePart(numOf(p, 'a'), 'the white part', 'a'),
);

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form, a call made before any working
//
// The B row's own "will it …?" prediction, pointed at this week's own question:
// how many units will this take? A worm is the right thing to point it at
// because a worm is genuinely five to fourteen centimeters long, so the call
// lands on both sides of ten and a child who guesses is wrong half the time by
// construction. Estimating before measuring is the catalog's own phrase for this
// week, and it is what catches a slip before it is written down.
//
// The probe is deliberately SHORT. `metacog.ts` picks its own lead-in, and the
// longest of the three is eight words, so a probe over seven words puts the
// combined sentence past the Level-B ceiling however carefully the rest of the
// pack is written. That was measured, not guessed.
//
// The base is served ONLY through the wrapper (kit §E2.2): a generator used both
// raw and wrapped ships two identical hint ladders, which spends two of the
// three the dedup allows on one idea. No figure — a drawn worm beside "will it
// take more than ten cubes?" has answered the question.
// ---------------------------------------------------------------------------

const sitWormInTwoGoes = situation({
  situationType: 'part-whole',
  cognitiveOp: 'measure-in-two-goes',
  draw: (r) => {
    const firstRow = r.int(4, 9);
    const drawnRest = r.int(1, 5);
    // A worm of EXACTLY ten cubes makes the probe unanswerable: it is neither
    // more than ten nor fewer, and the child would be right whatever they said
    // (kit §E2.7 — a computable answer is not the same as an askable question).
    // Nudged by one DETERMINISTIC step, never a redraw (kit §E2.4).
    const rest = firstRow + drawnRest === 10 ? drawnRest + 1 : drawnRest;
    const name = one(r);
    return {
      prompt: `${name} finds a worm and measures it with cubes. A row of ${countNoun(firstRow, 'cubes')} does not reach the tail. ${countNoun(rest, 'more cubes')} finish it. How many cubes long is the worm?`,
      answerValue: String(firstRow + rest),
      templateId: 'd_add_v1',
      params: { a: firstRow, b: rest },
      units: 'cubes',
      hints: [
        'Did the first row of cubes reach all the way to the tail?',
        'Count the first row, then carry on counting with the cubes that finish it.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

const predictWorm = withEstimateFirst(
  sitWormInTwoGoes,
  'will ten cubes reach the tail?',
);

// ---------------------------------------------------------------------------
// Discriminations
//
// THE TWO-UNITS ITEM (the §4 row, and the deepest page in the week): one length,
// two counts, and the child has to decide which unit produced which number —
// with "one of them must be mistaken" sitting there as a real third door. See
// the file header for the pin that proves the two counts describe one length.
//
// THE LAYOUT ITEM: three ways of putting cubes down, and the question is which
// one comes out smallest — or biggest, rotating per draw so neither answer can
// be remembered. This is where the overlap lives, since it cannot be derived
// arithmetically at this band, and it is real reasoning: a gap makes each cube
// cover more ground, an overlap makes it cover less.
//
// Neither carries a picture: two layouts drawn side by side can be counted
// instead of reasoned about.
// ---------------------------------------------------------------------------

const unitBox = pinSlot();

const discWhichUnitCounted = withPin(
  unitBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'choose-the-unit',
    draw: (r) => {
      const e = r.pick(TABLE);
      const clips = e.cubes / CLIP_CUBES;
      // WHICH unit is asked for rotates per draw. Without this, the answer is
      // the bigger number every single time, and a child who has met the page
      // twice can pass it on that alone — which is the exact belief the item
      // exists to unseat. Both branches consume one `r.int` and one `r.uint`,
      // so the stream lands in the same place either way (kit §E2.4).
      const askCubes = r.int(0, 1) === 0;
      // The pinned truth, recomputed either way: the cube count from the
      // paperclip count and the size of a paperclip, or the paperclip count from
      // the cube count shared into paperclip-sized lengths. QG-11 therefore
      // proves the keyed number really is that unit's measurement of THIS length.
      unitBox.last = {
        params: askCubes
          ? { a: CLIP_CUBES, b: clips, op: '*' }
          : { a: e.cubes, b: CLIP_CUBES, op: '/' },
        seed: r.uint(),
      };
      const mistaken = {
        text: 'one of them must be mistaken',
        errorTag: 'concept-misconception' as const,
        rationale: 'Reads two different numbers for one length as a contradiction, though the two counts are in different units.',
      };
      return {
        prompt: `The same ${e.thing} is measured twice, once with cubes and once with paperclips. Each paperclip is as long as ${countNoun(CLIP_CUBES, 'cubes')}. One count is ${e.cubes}. The other is ${clips}. Which count came from the ${askCubes ? 'cubes' : 'paperclips'}? Or must one of them be mistaken?`,
        correct: String(askCubes ? e.cubes : clips),
        distractors: [
          askCubes
            ? {
              text: String(clips),
              errorTag: 'representation-misread' as const,
              rationale: 'Ties the bigger number to the bigger unit, so the paperclip count is read as the cube count.',
            }
            : {
              text: String(e.cubes),
              errorTag: 'representation-misread' as const,
              rationale: 'Ties the smaller number to the smaller unit, so the cube count is read as the paperclip count.',
            },
          mistaken,
        ],
        hints: [
          'Which unit here is the shorter one?',
          'Picture both lines laid along the same thing, and see which line needs more pieces.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
);

const discGapsAndOverlaps = discrimination({
  variant: 'structural',
  cognitiveOp: 'judge-the-layout',
  draw: (r) => {
    const e = r.pick(TABLE);
    const [touching, spaced, over] = three(r);
    // Both branches consume exactly one draw, so the stream lands in the same
    // place whichever question is asked (kit §E2.4 — never a redraw loop).
    const askSmallest = r.int(0, 1) === 0;
    const smallestOptions = [
      {
        text: touching,
        errorTag: 'concept-misconception' as const,
        rationale: 'Reads touching cubes as the tightest packing, so the correct layout is expected to use the fewest.',
      },
      {
        text: over,
        errorTag: 'representation-misread' as const,
        rationale: 'Reads an overlapping cube as covering more length, so fewer of them seem to be needed.',
      },
    ];
    const biggestOptions = [
      {
        text: touching,
        errorTag: 'concept-misconception' as const,
        rationale: 'Reads the correct layout as the one that must use the most cubes, without weighing what a gap does.',
      },
      {
        text: spaced,
        errorTag: 'representation-misread' as const,
        rationale: 'Reads a gap as more length to be filled, so the spaced-out line seems to need more cubes.',
      },
    ];
    return {
      prompt: `${touching}, ${spaced} and ${over} each measure the same ${e.thing} with cubes. ${touching} keeps every cube touching the next one. ${spaced} leaves a space between the cubes. ${over} lets each cube lie over the one before. Who ends up with the ${askSmallest ? 'smallest' : 'biggest'} count?`,
      correct: askSmallest ? spaced : over,
      distractors: askSmallest ? smallestOptions : biggestOptions,
      hints: [
        'Do all three of these lines have their cubes touching?',
        'Take each line in turn, and think about how much new length one cube adds.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — measure two things, then compare (FILL-ARCHITECTURE §4)
//
// Two chains, two genuine moves each, and `stepCount` is read off the chain
// rather than claimed. What differs is what the second move is FOR:
//   - MEASURE THEN COMPARE is the recipe's own shape. One thing is handed over
//     whole, the other has to be measured in two goes first, and only then can
//     the two be held against each other;
//   - CHANGE THE UNIT THEN FINISH puts the week's deep idea to work: the
//     paperclips become cubes, and the last bit is already in cubes.
// A child who has met only one of them has learnt a sequence rather than a plan.
// ---------------------------------------------------------------------------

/** The recipe's own two-step: measure two things, then compare them. */
const msMeasureThenCompare = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'measure-then-compare',
  usesPriorSkill: true,
  draw: (r) => {
    // Two DIFFERENT table entries, in a fixed number of draws: a "pick again
    // until they differ" loop would make every later item depend on how long it
    // ran (kit §E2.4).
    const i = r.int(0, TABLE.length - 1);
    const j = (i + 1 + r.int(0, TABLE.length - 2)) % TABLE.length;
    const a = TABLE[i];
    const b = TABLE[j];
    const [long, short] = a.cubes > b.cubes ? [a, b] : [b, a];
    // The shorter thing is measured in two goes, the FIRST of them the bigger:
    // a child lays down what they have and then fetches a few more, so "lays 5,
    // then 10 more reach the end" is arithmetically fine and describes nothing
    // that happens on a table. Both goes stay at three cubes or more.
    const firstGo = r.int(Math.ceil(short.cubes / 2), short.cubes - 3);
    const secondGo = short.cubes - firstGo;
    const [n1, n2] = two(r);
    return {
      prompt: `${n1} measures a ${long.thing}. It is ${countNoun(long.cubes, 'cubes')} long. ${n2} measures a ${short.thing}. ${n2} lays ${countNoun(firstGo, 'cubes')}, then ${countNoun(secondGo, 'more cubes')} reach the end. How much longer is the ${long.thing}?`,
      initN: long.cubes,
      steps: [
        { op: 'sub', n: firstGo, d: 1 },
        { op: 'sub', n: secondGo, d: 1 },
      ],
      units: 'cubes',
      hints: [
        'Which of these two things was measured in one go?',
        'Work out the second length first, then hold the two lengths side by side.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * The unit changed, then the last bit finished off.
 *
 * A cucumber is the right thing for it: eleven to twenty-one centimeters is a
 * real cucumber, and it is long enough that a child would reach for paperclips
 * first and cubes only for the end. Two cubes finish it, never one, so the
 * sentence never has to read "1 cube fill the last bit".
 */
const msPaperclipsThenCubes = multiStep({
  situationType: 'measurement',
  cognitiveOp: 'change-the-unit-then-add',
  usesPriorSkill: true,
  draw: (r) => {
    const clips = r.int(3, 6);
    const extra = r.int(2, 3);
    const name = one(r);
    return {
      prompt: `Each paperclip is as long as ${countNoun(CLIP_CUBES, 'cubes')}. ${name} lays ${countNoun(clips, 'paperclips')} end to end along a cucumber. Then ${countNoun(extra, 'cubes')} fill the last bit. How many cubes long is the cucumber?`,
      initN: CLIP_CUBES,
      steps: [
        { op: 'mul', n: clips, d: 1 },
        { op: 'add', n: extra, d: 1 },
      ],
      units: 'cubes',
      hints: [
        'What does one paperclip give you, counted in cubes?',
        'Change the paperclips into cubes first, then bring in the cubes at the end.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header for the derivation. The gap is worth one cube, so the
// truth is the cubes laid PLUS one and the shown number is the cubes laid — both
// real outputs of one transform over the story's own two quantities. Nothing is
// fabricated, and the recipe's intended item is untouched.
//
// The prompt shows the layout and the claim and stops. Naming what the gap did
// would BE the answer, so the extension asks about the gap and leaves the child
// to say the rest.
// ---------------------------------------------------------------------------

const eaGapsInTheLine = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(11, 17), b: 1, op: '+', wrongOp: '*' }),
  build: (v, p, r) => {
    const laid = Number(p.a);
    const name = one(r);
    return {
      prompt: `${name} lays ${countNoun(laid, 'cubes')} along the zip on a wash bag. ${name} leaves one gap in the line. The gap is as wide as one more cube. ${name} writes that the zip is ${countNoun(Number(v.wrong), 'cubes')} long.`,
      extension: `Write how many cubes long the zip really is. Then write one sentence to ${name} about the gap.`,
      hints: [
        'Does a line of cubes with a space in it still measure the zip?',
        'Fill the space with the cube it needs, then count the whole line again.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: [
        'the cubes have to touch',
        'the gap needs a cube too',
        'one more cube fits in the gap',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 production — the §4 signature: measure with two units, and say why the
// numbers differ. Authored rather than drawn: the task is the child's own table
// and the child's own two units, so there is no operand to generate, and the
// answer is the argument. Keyword-graded, because the sentence is the point and
// the two numbers depend on what they picked up.
// ---------------------------------------------------------------------------

const reasoningTwoUnits = reasoning({
  prompt:
    'Measure one thing on your table twice. First use cubes. Then use paperclips. Write both numbers down. Then write one sentence saying why the two numbers are not the same.',
  value:
    'the cube count is the bigger one, because a cube is shorter than a paperclip, so more cubes fit along the same length',
  acceptableForms: [
    'a cube is shorter',
    'more cubes fit',
    'a paperclip is longer',
    'the shorter unit needs more',
  ],
  keywords: true,
  hints: [
    'Before you measure, which unit do you think you will need more of?',
    'Lay each unit along the same thing, and count how many it takes.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim the whole week is built against, and its honest answer is the middle
 * one. Two different numbers for one length mean a slip when both children
 * counted the same unit, and mean nothing at all when they did not.
 *
 * Both distractors are real children's positions. 'Always' is where a child
 * lands who hears a length as having one number whatever is counted — the exact
 * belief the two-units page exists to unseat. 'Never' is the overcorrection: if
 * any two counts are fine, then gaps and overlaps stop mattering too.
 */
const asnDifferentNumbers = classify({
  prompt:
    'Always, sometimes, or never true? Two children measure the same door and write different numbers. So one of them has made a mistake. Write one sentence saying how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Hears a length as having one number whatever is counted, so a change of unit is read as a slip.',
    },
    {
      text: 'never',
      errorTag: 'representation-misread',
      rationale: 'Accepts any two counts as both fine, which leaves gaps and overlaps mattering to nothing.',
    },
  ],
  hints: [
    'Could two different numbers both be right for one length?',
    'Try it once with units that match, and once with units that do not.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB21 = makeWeekBuilder({
  level: 'B',
  week: 21,
  conceptId: 'measuring-length',
  conceptName: 'Measuring length',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B13, B14, B18, B20],
  pedagogyContract: 'v2',
  conceptualAnchor: 'units laid end to end with no gaps',
  conceptFamily: 'operation',
  deepeningDelta:
    'A19 compared lengths without ever putting a number on one: line two things up at the same start, and say which is longer. That is a judgement with two possible answers, and it needs no unit at all. B21 turns the judgement into a COUNT, and everything new arrives with the count. A unit has to be chosen, and choosing it changes the number without changing the thing — which is why the same comb is 15 cubes and 5 paperclips, and why a bigger number no longer means a longer object. The count can also now be WRONG in ways a comparison never could: a gap, an overlap, or a mixture of units all break it, and each one breaks it for the same reason. And the answer has to carry its unit, because the number on its own no longer says anything. C19 takes this and asks the same questions about mass and capacity, where nothing can be laid alongside anything.',
  explanation: {
    hook:
      'Two children measure the same door and get different numbers. Neither of them has made a mistake. This week you find out how that happens.',
    whyBeforeHow:
      'Measuring length is really counting. You choose a unit and you count how many fit. That is why a measurement is units laid end to end with no gaps. Because every unit is the same size, the count tells you the length. A gap lets your cubes reach further, so you count too few. An overlap makes each cube add less, so you count too many. Mixed units break it for the same reason: the count stops meaning one thing. The unit also decides the number. A short unit fits more times than a long one. So the same comb can be 15 cubes and 5 paperclips. Both counts are right. That is why a number on its own is not a measurement. You have to say what you counted.',
    script: [
      {
        say: 'Watch me measure this glue stick. I lay cubes along it, all the same size. Each cube touches the next one, with no gaps. Then I count them: nine.',
        visual: 'A glue stick with nine cubes laid along it, touching.',
        figure: barModel(
          [
            { label: 'the glue stick', segments: [{ value: 9 }] },
            { label: 'cubes, end to end', segments: Array.from({ length: 9 }, () => ({ value: 1 })) },
          ],
          { alt: 'a glue stick with nine cubes laid along it, touching, with no gaps' },
        ),
      },
      {
        say: 'Now watch what a gap does. I leave one space in the middle of my line. The line still reaches the end, but I have put down eight cubes. So my count comes out too small.',
        visual: 'The same glue stick, with eight cubes and one empty space.',
        figure: barModel(
          [
            { label: 'the glue stick', segments: [{ value: 9 }] },
            {
              label: 'cubes with a gap',
              segments: [
                { value: 1 },
                { value: 1 },
                { value: 1 },
                { value: 1 },
                { value: 1, fill: 'none' },
                { value: 1 },
                { value: 1 },
                { value: 1 },
                { value: 1 },
              ],
            },
          ],
          { alt: 'the same glue stick with eight cubes laid along it and one empty space in the line' },
        ),
      },
      {
        say: 'An overlap breaks it the other way. Each cube lies partly over the one before. So every cube adds less than its own length. Now I need more cubes than the true count.',
        visual: 'A line of cubes riding up over each other along the same glue stick.',
      },
      {
        say: 'Here is the part worth keeping. I measure this comb twice. With cubes I count 15. With paperclips I count 5. Nothing moved, so both counts are right.',
        visual: 'One comb, a row of cubes, and a row of paperclips.',
        figure: barModel(
          [
            { label: 'the comb', segments: [{ value: 15 }] },
            { label: 'cubes', segments: Array.from({ length: 15 }, () => ({ value: 1 })) },
            { label: 'paperclips', segments: Array.from({ length: 5 }, () => ({ value: CLIP_CUBES })) },
          ],
          { alt: 'one comb, a row of fifteen cubes and a row of five paperclips, all the same length' },
        ),
      },
      {
        say: 'One habit before I lay a single cube. About how many will this take? Then I check my guess against the count. Grown-ups use a ruler instead. Its centimeter marks are the same units, printed on a stick. One of our cubes is one centimeter. An inch is another unit, and one inch is longer than one centimeter.',
        visual: 'A ruler marked from 0 to 15, with a line at every centimeter.',
        figure: numberLine(
          { min: 0, max: 15, step: 5, partition: 5, labels: 'majors' },
          { alt: 'a ruler marked from 0 to 15, with a line at every centimeter' },
        ),
      },
    ],
    summary:
      'A measurement counts equal units laid end to end, with no gaps and no overlaps. A gap makes the count too small. An overlap makes it too big. The unit decides the number, so a short unit gives a bigger count. Always say the unit beside the number.',
    vocabulary: [
      { term: 'measure', kidGloss: 'find out how long something is, by counting units' },
      { term: 'unit', kidGloss: 'the same-sized thing you count along, such as a cube' },
      { term: 'end to end', kidGloss: 'each unit touching the next one, with no space between' },
      { term: 'gap', kidGloss: 'a space left between two units, where no unit is counted' },
      { term: 'centimeter', kidGloss: 'the small unit on a ruler; one of our cubes is one centimeter' },
      { term: 'inch', kidGloss: 'another unit on some rulers; one inch is longer than one centimeter' },
    ],
  },
  guidedExamples: [
    {
      ...ge(21, 1, 'modeled', 'A runner bean lies on the table. 12 cubes are laid along it, end to end. The last 2 cubes stick out past the tip. How many cubes long is the bean?', [
        {
          teacherSay:
            'Watch me. I lay my cubes along the bean, touching, with no gaps at all. Then I look hard at where the bean itself ends.',
        },
        {
          teacherSay: 'Two of my cubes lie past the tip. So how many are lying along the bean?',
          expected: '10',
        },
      ], '10'),
      // The bean may be drawn here: the answer is already on the page, and
      // seeing the two spare cubes past the tip IS the teaching.
      visual: 'The bean with twelve cubes laid along it, two of them past the tip.',
      figure: barModel(
        [
          { label: 'the bean', segments: Array.from({ length: 10 }, () => ({ value: 1 })) },
          { label: 'the cubes laid down', segments: Array.from({ length: 12 }, () => ({ value: 1 })) },
        ],
        {
          alt: 'a runner bean ten cubes long, with a row of twelve cubes laid along it',
          asserts: assertsAnswerOf('bar:0'),
        },
      ),
    },
    {
      ...ge(21, 2, 'completion', 'Each paperclip is as long as 3 cubes. 5 paperclips reach along a comb. How many cubes long is the comb?', [
        { teacherSay: 'How many cubes fill the space of one paperclip?', expected: '3' },
        { childDo: 'Swap every paperclip for its cubes, then count them all.', expected: '15' },
      ], '15'),
      // COMPLETION fade: the child produces 15, so the picture shows ONE
      // paperclip against its cubes. Drawing the whole comb would finish it.
      visual: 'One paperclip above the three cubes that fill it.',
      figure: barModel(
        [
          { label: 'one paperclip', segments: [{ value: CLIP_CUBES }] },
          { label: 'cubes', segments: Array.from({ length: CLIP_CUBES }, () => ({ value: 1 })) },
        ],
        { alt: 'one paperclip laid above a row of three cubes of the same length' },
      ),
    },
    ge(21, 3, 'prompted', 'One courgette is 19 centimeters long. Another is 12 centimeters long. How much longer is the first one?', [
      { childDo: 'Stand them side by side, then measure the bit that sticks out.', expected: '7' },
    ], '7 centimeters'),
    {
      // Independent: no picture at all. Deciding that the second thing has to be
      // measured BEFORE anything can be compared is the task, so a drawing of
      // either one would hand over the plan.
      ...ge(21, 4, 'independent', 'A paintbrush is 21 cubes long. A comb is measured with 9 cubes and then 6 more. How much longer is the paintbrush? Solve cold.', [
        { childDo: 'Work out the comb first, then hold the two lengths side by side.', expected: '6' },
      ], '6'),
      visual: 'No picture — this one is measured in your head.',
    },
  ],
  days: [
    // Day 1 — concept echo: the count, the unit swap, the comparison. Single-step
    // only, no trap and no chain yet.
    [
      { gen: wHopsOfTwo, diff: 2 },
      { gen: wCabbagePlants, diff: 2 },
      { gen: sitCubeTrain, diff: 2 },
      { gen: sitPaperclipsToCubes, diff: 3 },
      { gen: sitCourgetteLonger, diff: 3 },
    ],
    // Day 2 — fluency + application: the size call made before working, the
    // two-units page, the week's first chain, and the anchor beside them.
    [
      { gen: wBeanstalkGrew, diff: 2 },
      { gen: predictWorm, diff: 3 },
      { gen: discWhichUnitCounted, diff: 3 },
      { gen: msMeasureThenCompare, diff: 4 },
      { gen: sitCubeTrain, diff: 3 },
    ],
    // Day 3 — interleave: the layout judgement and the two-units page against
    // the unit-change chain, so the shape of a page never signals the task.
    [
      { gen: wPegboardRows, diff: 2 },
      { gen: discGapsAndOverlaps, diff: 4 },
      { gen: discWhichUnitCounted, diff: 4 },
      { gen: msPaperclipsThenCubes, diff: 4 },
      { gen: sitLeekWhole, diff: 3 },
    ],
    // Day 4 — word problems: both chains beside the single-step pages they are
    // built out of, so "it must need two steps" never becomes the cue.
    [
      { gen: wCabbagePlants, diff: 3 },
      { gen: msMeasureThenCompare, diff: 4 },
      { gen: msPaperclipsThenCubes, diff: 4 },
      { gen: sitPaperclipsToCubes, diff: 3 },
      { gen: predictWorm, diff: 4 },
    ],
    // Day 5 — the signature: the gap taken apart, one thing measured twice with
    // the difference explained, and the claim that settles what a number means.
    [
      { gen: wHopsOfTwo, diff: 2 },
      { gen: eaGapsInTheLine, diff: 4 },
      { gen: reasoningTwoUnits, diff: 3 },
      { gen: asnDifferentNumbers, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the useful question this week is never "how long is it?" but "how do you know?". Hand your child a handful of identical things — cubes, pasta shapes, coins, dominoes — and ask them to measure a shoe with them. Watch what happens at the two ends and watch for spaces in the middle; that is where nearly every wrong measurement comes from, and pointing at it costs seconds. Then measure the same shoe with something longer and let them meet the surprise head on: the number goes DOWN even though the shoe has not changed. Children who have felt that once stop believing that a bigger number always means a longer thing, and that belief is what makes rulers, scales and jugs make sense later. A tape measure in a drawer is worth more than any worksheet here.',
  ],
  puzzle: (r) => {
    // Every core page starts its count at the beginning of the thing. This one
    // starts in the middle of a ruler, because the first numbers have worn away
    // — so the child has to see that a measurement is the STEPS between two
    // marks and not the number the far end lands on. Two moves, neither of them
    // a Day-1 move, and the second one is an argument rather than a count.
    //
    // Deterministic construction: the start mark and the length are picked and
    // the far mark computed from them, so the pair is always consistent and the
    // question always has exactly one answer (kit §E2.4, §E2.7).
    // A cabbage caterpillar is three to six centimeters long, not nine, so the
    // length is drawn in that band and the far mark is computed from it.
    const start = r.int(3, 7);
    const len = r.int(4, 6);
    const end = start + len;
    const name = one(r);
    return {
      id: 'B21-PZ-01',
      title: 'Puzzle Grove: The Worn-Out Ruler',
      puzzleType: 'logic',
      prompt: `The first numbers on an old ruler have worn away. ${name} lays a caterpillar from the cabbages along it. One end of the caterpillar sits at the ${start} mark. The other end reaches the ${end} mark. How many centimeters long is the caterpillar? Then say why the second mark is not the answer.`,
      answer: {
        value: String(len),
        acceptableForms: [countNoun(len, 'centimeters')],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Does this caterpillar start at the very beginning of the ruler?',
        'Step along the centimeter marks from one end to the other, and count.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
  // Core pages count units from the start of the object. The puzzle is handed a
  // count that begins part-way along a scale, and then has to argue why the far
  // mark is not the length. A read and a justification, neither on Day 1.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'read-from-a-worn-start' },
  sprint: {
    skill: 'Subtraction within 100 — the move that answers how much longer',
    sourceWeek: B14,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 12, max: 96, subtrahendMax: 60 },
  },
  mastery: [
    { gen: sitCubeTrain, diff: 3 },
    { gen: msMeasureThenCompare, diff: 4 },
    { gen: sitPaperclipsToCubes, diff: 3 },
    { gen: msPaperclipsThenCubes, diff: 4 },
    { gen: sitCourgetteLonger, diff: 3 },
    { gen: discWhichUnitCounted, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the three single-step forms the week teaches — a row of cubes laid past the tip of a runner bean (its cube-row picture preserved, drawing the row and never the bean), one length swapped from paperclips into cubes (its one-paperclip picture preserved), and two courgettes compared in centimeters, which carries no picture on either form because a drawing would do the comparing. 02/04: the two chains, one measuring a second thing before it can be compared and one changing the unit before finishing in cubes. 06: the two-units choice, redrawn from a fresh object so a form cannot be passed by remembering which number was bigger last time; its pinned truth is recomputed from the fresh paperclip count. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'bigger-number-means-longer',
      description: 'Reads the number alone as the length, so a count made with a bigger unit is taken for a shorter object and two counts of one length look like a contradiction.',
      exampleWrongAnswer: 'a comb measured as 5 paperclips called shorter than the same comb measured as 15 cubes',
      distractorRationale: 'Offer the count made with the other unit, or the claim that one of the two counts must be mistaken.',
      reteachPointer: 'explanation/script[3] (nothing moved, so both counts are right)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'gap-counted-as-free',
      description: 'Lays the units down with spaces between them, or lets them overlap, and still counts the units — so the count comes out short when there are gaps and long when there are overlaps.',
      exampleWrongAnswer: 'a zip 18 cubes long recorded as 17 cubes, with one gap left in the line',
      distractorRationale: 'Offer the number of units actually put down, which is one short of the truth for every unit-sized gap.',
      reteachPointer: 'explanation/script[1] (the line still reaches the end, but I have put down eight cubes)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'reads-the-far-end',
      description: 'Reports the number the far end of the object lands on rather than the count of units along it, so a measurement that starts part-way along a scale comes back too big.',
      exampleWrongAnswer: 'a caterpillar between the 4 and the 13 mark reported as 13 centimeters',
      distractorRationale: 'Offer the mark the far end reaches, which is the truth only when the object starts at nought.',
      reteachPointer: 'guidedExamples/B21-GE-01 (I look hard at where the bean itself ends)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-count-along-the-row',
      description: 'Holds the method steady and loses the running total part-way along a long row of units, so the answer lands one or two units either side of the truth.',
      exampleWrongAnswer: 'a leek of 9 cubes and 8 cubes answered as 16 cubes',
      distractorRationale: 'Offer a total one unit away from the truth, which is what losing your place in a row costs.',
      reteachPointer: 'explanation/summary (a measurement counts equal units laid end to end), then the 2-minute subtraction sprint',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'unit-size-not-yet-quick',
      description: 'Knows that a paperclip is worth three cubes and rebuilds the swap from nothing every time it is needed, which leaves no attention over for the reasoning the swap was meant to serve.',
      exampleWrongAnswer: 'six paperclips answered as 15 cubes',
      distractorRationale: 'Offer a total one unit-size out from the truth, which is what a hurried rebuild produces.',
      reteachPointer: 'guidedExamples/B21-GE-02 (how many cubes fill the space of one paperclip?), plus the ungraded sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Measuring length — laying units end to end with no gaps and no overlaps, counting them to get a length, comparing two things once both are measured, reading centimeters off a ruler, and finding out that the same object gives two different numbers when it is measured with two different units.',
    improvingCandidates: [
      'laying units end to end, touching, before counting anything',
      'counting only the units that lie along the thing being measured',
      'saying the unit beside the number, every time',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'holding on to the idea that a bigger number can come from a smaller unit, not a longer object',
      },
      {
        errorTag: 'representation-misread',
        text: 'spotting a gap or an overlap in a line of units, which is where nearly every wrong measurement starts',
      },
      {
        errorTag: 'task-comprehension',
        text: 'counting the units along a thing rather than reading the number its far end happens to reach',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the running count steady along a long row, which the two-minute sprint keeps quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You lined your cubes up so they touched, and then counted them one at a time — that lining up is the whole of measuring.',
      questionForChild: 'How many cubes long is your shoe — and what would happen to your answer if you left spaces?',
      schoolSyncHook: 'If your child\'s class measures in inches rather than centimeters, tell us and we will match them.',
    },
    vocabularyForParent: [
      'unit (the same-sized thing being counted along — a cube, a paperclip, a centimeter)',
      'end to end (each unit touching the next, which is what makes the count a measurement)',
      'the unit decides the number (a shorter unit fits more times, so its count is bigger)',
    ],
  },
});
