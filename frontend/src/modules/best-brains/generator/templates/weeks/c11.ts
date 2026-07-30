/**
 * Level C · Week 11 — "Facts: ×6, ×7" (conceptId: facts-6-7).
 *
 * FILL-ARCHITECTURE §5 row C11: anchor "5s and one more group — the distributive
 * seed C13 later formalises"; multi-step "a near-fact estimate, then the exact
 * answer (metacognition)"; error-analysis "6 × 7 off by one group";
 * discrimination "6 × 7 against 6 × 6 + 6 — the same number reached two ways";
 * Day-5 signature "build a hard fact from an easy one".
 *
 * The week's claim is that nobody ever has to meet 6 × 7 cold. Six groups of
 * anything are five groups and one more group, and the fives have been the
 * child's since they first counted in them, so every six-times fact is a fact
 * already owned with one short step on the end — and the sevens are then the
 * sixes with one more step again. So the content is built to make the child
 * TAKE that step rather than read about it:
 *  - the anchor item hands over the five-group block as a drawn, finished
 *    quantity and asks for the whole set, so the known part and the missing
 *    part stand on the page as two separate things;
 *  - the metacognition probe is the near-fact decision itself, made before any
 *    arithmetic: how far past the five-group count does this story finish;
 *  - two discriminations carry the content — one asks which rebuild lands on
 *    the same total as the whole array (its picture is the array cut along the
 *    known block, so the split is seen rather than described), the other puts
 *    "one more group" against "one more" with the known fact sitting in the
 *    story as a live temptation to stop at;
 *  - three multi-step items, one of them posed `inverse-start`: the bench count
 *    is stated as the RESULT of five equal rows, so the opening move is a
 *    division the sentence order never offers;
 *  - Day 5 asks for the same hard fact built twice from two different easy
 *    facts, and then for the reason the two builds cannot disagree.
 *
 * POSING (PEDAGOGY-CEILING-REVIEW F3). C7 and C8 each spent `goal-first`, so
 * this week spends `inverse-start` — live since C5, but used here in a shape no
 * earlier C week has: the quantity handed over is a five-group total, and the
 * size of a group (the thing every rebuild starts from) has to be recovered
 * from it before the one-more-group step can happen at all.
 *
 * THE ERROR-ANALYSIS, and why it uses a verify template from another family
 * (kit §E2.3, declared here rather than buried). The recipe names "6 × 7 off by
 * one group". `d_verify_binop_misconception_v1` — the whole-number verify most
 * weeks reach for — varies the OPERATION over one fixed operand pair, and
 * "one group short" is not an operation swap: solving a + b = (a − 1)·b leaves
 * only the degenerate pairs. C7 and C8 both spent the operation swap already
 * (×10 read as +10, the second doubling written as an add-2), and a third one
 * in four weeks would be the same page three times.
 *
 * `e_alg_verify_distribute_v1` expresses this week's slip EXACTLY and honestly:
 * it returns `correct = a·(x + b)` against `wrong = a·x + b`. With a = the
 * group size, x = the groups already known and b = 1, the truth is the
 * six-group (or seven-group) fact and the shown wrong value is the genuine
 * output of adding ONE where one more GROUP belonged — the child who rebuilds
 * from the fact they are sure of and takes a single step instead of a whole
 * group. Nothing is invented; both numbers are computed by a registered
 * template, and the arithmetic is plain whole-number arithmetic despite the
 * template living in the algebra family (it is the same distributive fact C13
 * formalises, which is precisely what this week is seeding).
 *
 * FIGURE LAW as applied here (kit §F.7, §E2.5). Two day items carry a picture
 * and each shows a GIVEN:
 *  - the anchor's bar draws only the five groups the prose already counted, and
 *    asserts that block against the item's own drawn param. The sixth group is
 *    the child's move and is not on the page;
 *  - the rebuild discrimination's grid draws the whole array with the known
 *    block shaded — legitimate there and nowhere else, because that item's
 *    answer is a CHOICE of calculation, not a count, so the picture cannot hand
 *    over what is being asked. It is what makes the split visible rather than
 *    asserted in prose.
 * The pictures that show a whole rebuild finished — and the same rectangle cut
 * BOTH ways, five sevens and one more seven against six sixes and six more —
 * live where the answer is already on the page: the lesson script and the
 * guided examples.
 *
 * Retrieval is backward-only into C3/C4 (± within 1,000 — the recombine step),
 * into C7 (the ×5 fact, which is the launch pad the whole week jumps from) and
 * into C10 (fact families, where a missing factor was first met).
 */

import { addWhole, asWarmup, classify, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import type { DiscriminationDraw } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswerOf, assertsParam, barModel } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C6 = { level: 'C' as const, week: 6 };
const C7 = { level: 'C' as const, week: 7 };
const C8 = { level: 'C' as const, week: 8 };
const C10 = { level: 'C' as const, week: 10 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two distinct names, for the comparison item. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/**
 * The two facts this week owns. Every core item is a six-group or a seven-group
 * story, so the shortest honest route is always "a fact you have, plus one more
 * group" — five and one for the sixes, six and one for the sevens.
 */
const THIS_WEEK = [6, 7] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep) have no figure slot, and lib/
// is not ours to edit, so this wrapper does what `withEstimateFirst` does: it
// works entirely inside the returned closure, takes no new rng draw, and leaves
// the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It reads
// the drafted item's `generator.params` — the very numbers the answer was
// computed from — so the figure law ("built from the item's own drawn values")
// holds by construction. (Pattern established by c06, the Level-C exemplar.)
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
// discriminationFig — the same idea for a discrimination item.
//
// `discrimination()` ships no GeneratorSpec (its truth is the code-SELECTED
// correct option, not a recomputed product), so there are no `generator.params`
// for `withFigure` to read and no `asserts` clause QG-13 could check against.
// The figure is therefore built by the item's OWN draw closure, from the very
// numbers the prompt and the options were written from, and handed out beside
// the draft.
//
// Determinism (kit §E2.4): `drawUniqueItem` may build several drafts and returns
// the LAST one it built, and generation is synchronous, so `pending` always
// holds the figure belonging to the draft that is actually returned. No new rng
// draw is taken, and the state is per-generator rather than module-wide.
// ---------------------------------------------------------------------------

function discriminationFig(cfg: {
  variant: 'cross-op' | 'structural';
  cognitiveOp?: string;
  draw: (r: Rng) => DiscriminationDraw & { figure: BBFigure };
}): ItemGen {
  let pending: BBFigure | undefined;
  const base = discrimination({
    variant: cfg.variant,
    ...(cfg.cognitiveOp ? { cognitiveOp: cfg.cognitiveOp } : {}),
    draw: (r) => {
      const { figure, ...rest } = cfg.draw(r);
      pending = figure;
      return rest;
    },
  });
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return pending ? { ...d, figure: pending } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000: the recombine that finishes every rebuild. */
const wAdd = asWarmup(addWhole(124, 483), C3);
/** C4 — subtraction within 1,000, kept warm across a multiplication month. */
const wSub = asWarmup(subWhole(139, 907), C4);

/**
 * C7 — the ×5 fact, in the plainest form there is. This is not decoration: the
 * fives are the launch pad every rebuild this week jumps from, so Monday
 * rebuilds by hand the thing Tuesday starts leaning on.
 */
const wFiveFact = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'mul',
    draw: (r) => {
      // Up to nine to a page: a page of small prints, not an implausible wall
      // of them. The fives ladder is the point here, not the magnitude.
      const per = r.int(3, 9);
      const name = one(r);
      return {
        prompt: `${name} slides ${countNoun(per, 'photographs')} into every page of an album and fills ${countNoun(5, 'pages')}. How many photographs is that?`,
        answerValue: String(per * 5),
        templateId: 'd_mul_v1',
        params: { a: per, b: 5 },
        units: 'photographs',
        hints: [
          'Are the album pages carrying equal loads, or different ones?',
          'Say what a single page holds, then keep a running count as you turn through the five.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  C7,
);

/**
 * C10 — the missing factor. A fact family read backwards is the same reasoning
 * this week's inverse-start item needs on Day 4, met first in a warm-up where
 * nothing else is going on.
 */
const wMissingFactor = asWarmup(
  situation({
    situationType: 'sharing',
    cognitiveOp: 'div-exact',
    draw: (r) => {
      const per = r.int(3, 9);
      const groups = r.int(3, 9);
      const total = per * groups;
      const name = one(r);
      return {
        prompt: `${name} deals ${countNoun(total, 'cards')} out into ${countNoun(groups, 'equal piles')}. How many cards land in one pile?`,
        answerValue: String(per),
        templateId: 'd_div_v1',
        params: { a: total, b: groups },
        units: 'cards',
        hints: [
          'Is this question asking about the whole deal, or about one pile of it?',
          'Think of a fact whose two partners are the number of piles and the number dealt out.',
        ],
        errorTags: ['fact-recall', 'task-comprehension'],
      };
    },
  }),
  C10,
);

// ---------------------------------------------------------------------------
// Single-step facts — the same move seen from four different situations
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR ITEM. The five-group block is already counted and DRAWN, and the
 * bar is exactly that block, asserted against the count the prose states. The
 * child supplies the sixth group. So the two parts stand on the page as two
 * separate things — one finished in front of them, one still to make — which is
 * the whole of "five groups and one more group".
 *
 * The picture cannot leak: it draws the block the story already handed over,
 * and the answer is that block with one more group on it.
 */
const sitPlanterRow = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'mul',
    usesPriorSkill: true,
    draw: (r) => {
      // Four bulbs at least: a planter given three is a thin planter, and the
      // anchor item wants a five-group block worth handing over.
      const per = r.int(4, 12);
      const name = one(r);
      return {
        prompt: `[image: the five planters already filled] A line of ${countNoun(6, 'planters')} stands along the school path, and every planter takes ${countNoun(per, 'bulbs')}. ${name} has filled five of them, which is ${countNoun(5 * per, 'bulbs')} in the ground. How many bulbs will the whole line take?`,
        answerValue: String(6 * per),
        templateId: 'd_mul_v1',
        params: { a: 6, b: per, five: 5 * per },
        units: 'bulbs',
        hints: [
          'What has been counted here already, and what has not?',
          'Look at what a single planter takes, and carry the number the story hands you on by that much.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const per = numOf(p, 'b');
    const five = numOf(p, 'five');
    return barModel(
      [
        {
          label: 'the five planters already filled',
          segments: Array.from({ length: 5 }, () => ({ value: per, label: String(per) })),
          total: String(five),
        },
      ],
      {
        alt: `one bar cut into five equal parts, ${countNoun(per, 'bulbs')} in each — ${countNoun(five, 'bulbs')} in the block already planted`,
        asserts: assertsParam('five'),
      },
    );
  },
);

/**
 * The sixes carried by a real half-dozen, so the numeral is never arbitrary:
 * eggs come six to a carton, and here it is the number of CARTONS that is drawn.
 * That flips which side of the fact the six sits on, which is the small variety
 * a fact week lives or dies by.
 */
const sitEggCartons = situation({
  situationType: 'combine',
  cognitiveOp: 'mul',
  usesPriorSkill: true,
  draw: (r) => {
    const cartons = r.int(3, 12);
    return {
      prompt: `A farm shop packs ${countNoun(6, 'eggs')} to a carton, and ${countNoun(cartons, 'cartons')} are sold before lunch. How many eggs is that?`,
      answerValue: String(6 * cartons),
      templateId: 'd_mul_v1',
      params: { a: 6, b: cartons },
      units: 'eggs',
      hints: [
        'Which number in this story tells you how many eggs travel together?',
        'Land on the five-carton count first, then walk on one carton at a time until you reach the number the shop sold.',
      ],
      errorTags: ['fact-recall', 'representation-misread'],
    };
  },
});

/**
 * The sevens where they genuinely live: a week is seven days, so a habit kept
 * every day of it is a ×7 fact whether anyone names it or not. A LENGTH of time
 * rather than a pile, so "seven of it" has to be heard as a duration.
 */
const sitWeekPractice = situation({
  situationType: 'measurement',
  cognitiveOp: 'mul',
  usesPriorSkill: true,
  draw: (r) => {
    const per = r.int(4, 12);
    const name = one(r);
    return {
      prompt: `${name} is learning a tune and practises it for ${countNoun(per, 'minutes')} on every day of the week. How many minutes of practice does that come to over the ${countNoun(7, 'days')}?`,
      answerValue: String(7 * per),
      templateId: 'd_mul_v1',
      params: { a: 7, b: per },
      units: 'minutes',
      hints: [
        'Is the practice the same length on every one of those days?',
        'Reach the five-day total first, then walk the last two days on from it, a day at a time.',
      ],
      errorTags: ['fact-recall', 'task-comprehension'],
    };
  },
});

/**
 * The same two facts as a COMPARISON, which is the reading a child is most
 * likely to hear as an addition. Six or seven times as many is six or seven
 * helpings of what the first child has — and the rebuild works here too, since
 * seven helpings are five helpings and two more.
 */
const sitAcornHoard = situation({
  situationType: 'comparison',
  cognitiveOp: 'mul',
  usesPriorSkill: true,
  draw: (r) => {
    const per = r.int(3, 11);
    const times = r.pick(THIS_WEEK);
    const [first, second] = two(r);
    return {
      prompt: `${first} has gathered ${countNoun(per, 'acorns')} on the walk home. ${second} has gathered ${times} times as many. How many acorns has ${second} gathered?`,
      answerValue: String(per * times),
      templateId: 'd_mul_v1',
      params: { a: per, b: times },
      units: 'acorns',
      hints: [
        'Does the second child have a few more than the first, or several helpings of what the first has?',
        'Set the first hoard out, then keep setting out that same amount until there are as many helpings as the story names.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: the C11 recipe's "near-fact estimate, then the exact answer"
// ---------------------------------------------------------------------------

/**
 * THE METACOGNITION ITEM, and the recipe's multi-step row. The chain IS the
 * rebuild — five trays, then the trays that follow — so the estimate and the
 * exact answer are the item's own two moves rather than a frame around them.
 *
 * Served ONLY through the estimate-first wrapper, never raw, so its ladder is
 * counted once (kit §E2.2). The probe is the near-fact decision itself: naming
 * how far past the five-tray count the story finishes is what tells the child
 * which known fact to jump from, and it has to be settled before a single
 * multiplication happens.
 */
const msBakeryTrays = multiStep({
  situationType: 'multi-stage',
  usesPriorSkill: true,
  draw: (r) => {
    const per = r.int(4, 12);
    const trays = r.pick(THIS_WEEK);
    const extra = trays - 5;
    const steps =
      extra === 1
        ? [
            { op: 'mul' as const, n: 5, d: 1 },
            { op: 'add' as const, n: per, d: 1 },
          ]
        : [
            { op: 'mul' as const, n: 5, d: 1 },
            { op: 'add' as const, n: per, d: 1 },
            { op: 'add' as const, n: per, d: 1 },
          ];
    return {
      prompt: `A baker's tray holds ${countNoun(per, 'rolls')}. Five trays come out of the oven together, and ${extra === 1 ? 'one more tray follows' : 'two more trays follow'} a minute behind them. How many rolls have come out of the oven?`,
      initN: per,
      steps,
      units: 'rolls',
      hints: [
        'Which part of this bake is a count you already own, and which part is still to come?',
        'Finish the five-tray count before you let a single roll from the later trays into it.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const msBakeryEstimate = withEstimateFirst(
  msBakeryTrays,
  'does this story finish one whole tray past the five-tray count, or two?',
);

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3 — the posture C7 and C8 did not
 * spend). The number the story hands over is the RESULT of five equal rows, not
 * one row, so the opening move is a division the sentence order never offers:
 * the size of a group has to be recovered before the one-more-group step can
 * happen at all. That is the rebuild run backwards, and it is the hardest
 * honest thing this week can ask.
 */
const msGreenhouseBench = multiStep({
  situationType: 'sharing',
  usesPriorSkill: true,
  posing: 'inverse-start',
  draw: (r) => {
    const per = r.int(3, 12);
    const known = 5 * per;
    const name = one(r);
    return {
      prompt: `There are ${countNoun(known, 'seedlings')} on the greenhouse bench, standing in ${countNoun(5, 'equal rows')}. ${name} plants one more row in exactly the same way. How many seedlings are on the bench then?`,
      initN: known,
      steps: [
        { op: 'div' as const, n: 5, d: 1 },
        { op: 'add' as const, n: known, d: 1 },
      ],
      units: 'seedlings',
      hints: [
        'Does the story tell you what ONE row holds, or what the whole bench holds?',
        'Break the bench count into its five equal rows first, and only then bring in the row that has just been planted.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

/**
 * The third chain, and the plainest: a six-times or seven-times fact built up,
 * then a quantity taken off it. No picture — a drawn shelf would only restate
 * its own stated load, and the item's work is the fact, not the subtraction.
 */
const msPostcardRack = multiStep({
  situationType: 'rate-of-change',
  usesPriorSkill: true,
  draw: (r) => {
    const per = r.int(4, 12);
    const shelves = r.pick(THIS_WEEK);
    // A number sold that matches a shelf-load would read as a whole shelf
    // clearing, which blurs the boundary between the two steps this item draws.
    // One deterministic step, never a redraw loop (kit §E2.4); the nudged value
    // still cannot reach the smallest rack this item can build (four to a shelf
    // over six shelves), so the answer stays positive.
    let sold = r.int(3, 20);
    if (sold === per) sold += 1;
    return {
      prompt: `A postcard rack holds ${countNoun(per, 'postcards')} on every shelf, and ${countNoun(shelves, 'shelves')} are full when the shop opens. By closing time ${countNoun(sold, 'postcards')} have been sold. How many are still on the rack?`,
      initN: per,
      steps: [
        { op: 'mul' as const, n: shelves, d: 1 },
        { op: 'sub' as const, n: sold, d: 1 },
      ],
      units: 'postcards',
      hints: [
        'How many postcards were on the rack before anybody bought one?',
        'Fill the whole rack in your head first, and take the sold ones off only once it is full.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's point, forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DISCRIMINATION: the same total reached from a fact already
 * owned. The child is standing on the block they have counted and has to pick
 * the calculation that finishes the array.
 *
 * Its two distractors are the week's two live confusions side by side — a step
 * of the wrong SIZE (the number of rows brought in instead of what a row holds)
 * and last week's move reached for once too often (the known block doubled,
 * which lays a whole second blanket beside the first).
 *
 * This is the ONE item where a whole array may be drawn: its answer is a choice
 * of calculation rather than a count, so the picture cannot hand over what is
 * being asked, and shading the block the prose already stated is exactly what
 * makes the cut visible instead of merely described.
 */
const discrimRebuildTheArray = discriminationFig({
  variant: 'structural',
  draw: (r) => {
    const rows = r.pick(THIS_WEEK);
    // A blanket as many patches wide as it is deep would print "add the rows"
    // and "add a row" as the same calculation, and the trap would go blind.
    // Stepped once, deterministically, never redrawn (kit §E2.4): a collision
    // can only happen at six or seven, so one step up stays inside the range.
    let cols = r.int(3, 12);
    if (cols === rows) cols = rows + 1;
    const known = (rows - 1) * cols;
    const name = one(r);
    return {
      prompt: `A patchwork blanket is being sewn in ${countNoun(rows, 'rows')} with ${countNoun(cols, 'patches')} in every row. ${name} has counted ${countNoun(rows - 1, 'rows')} of it and reached ${countNoun(known, 'patches')}. Which of these lands on the number of patches in the whole blanket?`,
      correct: `${known} + ${cols}`,
      distractors: [
        {
          text: `${known} + ${rows}`,
          errorTag: 'representation-misread',
          rationale: 'Brings in the number of rows rather than the patches that make one row up, so the step onto the last row is the wrong size.',
        },
        {
          text: `${known} + ${known}`,
          errorTag: 'concept-misconception',
          rationale: 'Doubles the block already counted, which lays a whole second blanket beside the first when only the last row is missing.',
        },
      ],
      hints: [
        'What is missing from the count so far — a single patch, one row, or a whole second blanket?',
        'Read off how many patches make one row of this blanket, and add that much to the block already counted.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
      figure: areaGrid(
        { rows, cols, shadedRows: rows - 1 },
        {
          alt: `a blanket of ${countNoun(rows, 'rows')} with ${countNoun(cols, 'patches')} in each, the shaded part being the ${countNoun(rows - 1, 'rows')} already counted`,
        },
      ),
    };
  },
});

/**
 * The cross-op sibling, and the sharpest sentence on the page: one more GROUP
 * against one more. The story leaves the known fact lying in plain sight, so
 * both live slips are reachable — a child can add a single orange to it, or
 * simply hand it back as the answer. The drawn net holds at least four, so the
 * three options are never within two of each other.
 */
const discrimOneMoreNet = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-operation',
  draw: (r) => {
    const per = r.int(4, 12);
    const known = 5 * per;
    const name = one(r);
    return {
      prompt: `${name} already knows that ${countNoun(5, 'nets')} of oranges hold ${countNoun(known, 'oranges')} between them. A sixth net is filled in exactly the same way. Which number tells how many oranges the six nets hold?`,
      correct: String(6 * per),
      distractors: [
        {
          text: String(known + 1),
          errorTag: 'concept-misconception',
          rationale: 'Puts a single orange on the pile where a whole net went on, so the sixth net is counted as one thing rather than as a netful.',
        },
        {
          text: String(known),
          errorTag: 'task-comprehension',
          rationale: 'Hands back the count the story opened with, leaving the sixth net out of the total the question asks for.',
        },
      ],
      hints: [
        'Does one more net put one more orange on the pile, or a whole netful?',
        'Carry the five-net count on by as much as a single net holds, and stop there.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the header note. `e_alg_verify_distribute_v1` computes the truth as
// a·(x + 1) — the whole set of feeders — and the shown wrong value as a·x + 1,
// which is the genuine output of rebuilding from a known fact and stepping on
// by ONE where a whole group belonged. The student's addition is faultless, so
// re-checking the digits finds nothing; the only way in is to say what the
// figure 1 was standing for.
// ---------------------------------------------------------------------------

const eaOneNotOneGroup = errorAnalysis({
  verifyTemplateId: 'e_alg_verify_distribute_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const known = r.pick([5, 6] as const);
    // A feeder taking exactly as many scoops as there are known feeders would
    // print "5 × 5 + 1" and leave the child unable to say which five is which.
    // Stepped once, deterministically, never redrawn (kit §E2.4).
    let per = r.int(4, 12);
    if (per === known) per += 2;
    return { a: per, x: known, b: 1 };
  },
  build: (v, p) => {
    const per = Number(p.a);
    const known = Number(p.x);
    return {
      prompt: `A wildlife group hangs ${countNoun(known + 1, 'feeders')} along the hedge, and every feeder takes ${countNoun(per, 'scoops')} of seed. A student who is certain about ${countNoun(known, 'feeders')} wrote ${known} × ${per} + 1 = ${v.wrong}.`,
      extension: 'Work out how many scoops the whole hedge really takes, then write one sentence saying what the student put on top of the count they were certain of.',
      hints: [
        'Would one more feeder on the hedge really cost a single scoop of seed?',
        'Fill the feeders one at a time, taking a whole feeder-load of scoops for each, and see where the count finishes.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC11 = makeWeekBuilder({
  level: 'C',
  week: 11,
  conceptId: 'facts-6-7',
  conceptName: 'Facts: ×6, ×7',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [C6, C7, C8, C10],
  pedagogyContract: 'v2',
  conceptualAnchor: 'five groups and one more group',
  conceptFamily: 'operation',
  deepeningDelta:
    'C7 made the easy facts quick by leaning on a count the child already had, and C8 built ×4 out of a doubling done twice. Neither route reaches the sixes and sevens: the ladders are long enough to lose your place on, and doubling lands on 4 and 8 but never on 6 or 7. C11 changes what a fact is BUILT from — not a count and not a repeated move, but another fact, plus one more group. That is a smaller and more general step than doubling, it reaches every fact rather than a family of them, and it is the first appearance of the split C13 will state outright.',
  explanation: {
    hook:
      'There is no such thing as a fact you have to meet cold. Six of something is five of it with one more group beside it — and you have owned the fives since you were small.',
    whyBeforeHow:
      'Six groups of a number are five groups and one more group, and because the fives are already yours, every six-times fact is a fact you can answer with one short step on the end. That is why this week never asks you to memorise anything. Picture the last row of a blanket being sewn: the rows above it are the fact you were sure of, the row below the line is the step, and nothing on the blanket moved when you drew that line. The sevens follow from the sixes the same way, one more group again. Watch the size of that step, though — it is a whole group, never a single thing, and a number that lands only one past the fact you started from is a step that never happened. And when a fact matters, build it twice from two different easy facts: two routes that finish in the same place are worth more than one route you are hoping about.',
    script: [
      {
        say: 'Watch what I do when a fact will not come. I want six sevens and I cannot picture them at all. But five sevens I am certain of — 5 × 7 = 35, and that has been mine since we counted in fives. Six sevens are those five sevens with one more seven standing beside them, so 35 + 7 = 42. I did not remember six sevens. I built them.',
        visual: 'A bar of five sevens, a short bar of one more seven, and the two of them together.',
        figure: barModel(
          [
            { label: 'five sevens', segments: Array.from({ length: 5 }, () => ({ value: 7 })), total: '35' },
            { label: 'one more seven', segments: [{ value: 7, fill: 'hatch' }], total: '7' },
            { label: 'six sevens', segments: Array.from({ length: 6 }, () => ({ value: 7 })), total: '42' },
          ],
          { scaleMax: 42, alt: 'a bar of thirty-five, a short bar of seven, and a bar of forty-two made of six sevens' },
        ),
      },
      {
        say: 'Here are the same six sevens drawn as a block: six rows with seven in every row. I draw one line, between the fifth row and the sixth. On one side of it sit the five sevens I was sure of; on the other side sits a single row, and that row is the one more group. The block did not change when I drew the line, and that is exactly why the rebuild is safe rather than a trick.',
        visual: 'Six rows of seven, with five of the rows shaded as the block already known.',
        figure: areaGrid(
          { rows: 6, cols: 7, shadedRows: 5 },
          { alt: 'six rows of seven, with five of the rows shaded as the block already known and one row left plain' },
        ),
      },
      {
        say: 'Now watch me cut the very same block the other way. Six columns of six is 6 × 6 = 36, which I know cold, and the column left standing holds six more. So 36 + 6 = 42 as well. Two different cuts, two different easy facts, one answer — because it was one block all along and cutting a block never changes how much is in it.',
        visual: 'The same six rows of seven, cut down its length instead: six columns shaded, one column standing.',
        figure: areaGrid(
          { rows: 6, cols: 7, shadedCols: 6 },
          { alt: 'the same six rows of seven, with the first six columns shaded and one column left plain at the end' },
        ),
      },
      {
        say: 'One habit before any answer goes down: I check the size of my step. Six sevens have to land a whole seven past thirty-five, not one past it, so an answer of thirty-six would tell me I put a single thing on where a whole group belonged. I ask roughly where the answer ought to sit before I start, and then I look at where it actually landed.',
        visual: 'A long bar for the known fact and one more group, beside a barely longer bar for the known fact and one more thing.',
        figure: barModel(
          [
            { label: 'one more group', segments: [{ value: 35 }, { value: 7 }], total: '42' },
            { label: 'one more thing', segments: [{ value: 35 }, { value: 1, fill: 'hatch' }], total: '36' },
          ],
          { scaleMax: 42, alt: 'a bar of thirty-five and seven beside a bar of thirty-five and one' },
        ),
      },
    ],
    summary:
      'A hard fact is an easy fact with one more group on the end. Land on a fact you are sure of — the fives always work, and now the sixes do too — then step on by one whole group of the same size, never by one single thing. When the fact matters, reach it a second time from a different easy fact: if both routes finish in the same place, the answer is yours.',
    vocabulary: [
      { term: 'known fact', kidGloss: 'a fact you can answer without stopping to think about it' },
      { term: 'one more group', kidGloss: 'the step from one fact to the next along a row — another whole group of the same size' },
      { term: 'rebuild', kidGloss: 'reaching a fact you cannot remember by starting from one you can' },
      { term: 'six times as many (×6)', kidGloss: 'five groups and one more group' },
    ],
  },
  guidedExamples: [
    {
      ...ge(11, 1, 'modeled', 'A florist ties 6 bunches with 8 stems in every bunch. How many stems is that?', [
        {
          teacherSay:
            'Watch me refuse to guess at this. Six eights I am not sure of, but five eights I have known for ages — that is forty. So I put forty on the table and I look at what is still missing: one whole bunch, not one stem.',
        },
        {
          teacherSay: 'One more bunch is one more eight. Forty, and eight more on top of it — where does that land?',
          expected: '48',
        },
      ], '48'),
      visual: 'One bunch, five bunches, and six bunches, each bar built from the one above it.',
      figure: barModel(
        [
          { label: 'one bunch', segments: [{ value: 8, label: '8' }] },
          { label: 'five bunches', segments: Array.from({ length: 5 }, () => ({ value: 8 })), total: '40' },
          { label: 'six bunches', segments: Array.from({ length: 6 }, () => ({ value: 8 })), total: '48' },
        ],
        {
          scaleMax: 48,
          alt: 'three bars: eight for one bunch, forty for five bunches, and forty-eight for six bunches',
          asserts: assertsAnswerOf('bar:2'),
        },
      ),
    },
    {
      ...ge(11, 2, 'completion', 'A baker sets out 7 rows with 6 buns in every row. How many buns are on the tray?', [
        { teacherSay: 'Which easy fact sits exactly one group short of seven sixes?', expected: 'six sixes' },
        { childDo: 'Start from six sixes, bring in the one row still missing, and say how many buns are on the tray.', expected: '42' },
      ], '42'),
      visual: 'Seven rows of six buns, with six of the rows shaded as the fact already known.',
      figure: areaGrid(
        { rows: 7, cols: 6, shadedRows: 6 },
        {
          alt: 'seven rows of six buns, with six of the rows shaded as the fact already known',
          asserts: { of: 'cells', equals: 'answer' },
        },
      ),
    },
    ge(11, 3, 'prompted', 'A gardener plants 6 rows with 9 onion sets in every row. How many onion sets is that?', [
      { childDo: 'Name the easy fact you will start from, take one more group from there, and say the total.', expected: '54' },
    ], '54'),
    {
      // Independent stage: no picture at all. Deciding which fact to jump from
      // and how far past it to go IS the task here, so any drawing of the trays
      // would settle the plan the item exists to ask for.
      ...ge(11, 4, 'independent', 'A baker\'s tray holds 8 rolls. Five trays come out of the oven together, and two more trays follow a minute behind them. How many rolls have come out of the oven? Solve cold.', [
        { childDo: 'Settle the five trays first, then bring in the trays that follow, one tray at a time.', expected: '56' },
      ], '56'),
    },
  ],
  days: [
    // Day 1 — concept echo: the two facts in three situations, single-step only,
    // with the anchor item handing over its five-group block as a drawn given.
    [
      { gen: wAdd, diff: 2 },
      { gen: wFiveFact, diff: 2 },
      { gen: wMissingFactor, diff: 2 },
      { gen: sitPlanterRow, diff: 2 },
      { gen: sitEggCartons, diff: 3 },
      { gen: sitWeekPractice, diff: 3 },
    ],
    // Day 2 — fluency + application: the near-fact estimate made before any
    // arithmetic, the one-more-group trap, and the comparison reading.
    [
      { gen: wSub, diff: 2 },
      { gen: wFiveFact, diff: 2 },
      { gen: msBakeryEstimate, diff: 3 },
      { gen: discrimOneMoreNet, diff: 3 },
      { gen: sitAcornHoard, diff: 3 },
      { gen: sitPlanterRow, diff: 3 },
    ],
    // Day 3 — interleave: both traps arrive beside a chain and a plain fact, so
    // the page shape never tells the child which move is coming.
    [
      { gen: wMissingFactor, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: discrimRebuildTheArray, diff: 3 },
      { gen: discrimOneMoreNet, diff: 4 },
      { gen: msPostcardRack, diff: 4 },
      { gen: sitWeekPractice, diff: 3 },
    ],
    // Day 4 — word problems: all three chains, including the inverse-start one,
    // with two single-step facts mixed in so "it must be two steps" never
    // becomes the cue the child reads instead of the story.
    [
      { gen: msBakeryEstimate, diff: 4 },
      { gen: msGreenhouseBench, diff: 5 },
      { gen: msPostcardRack, diff: 4 },
      { gen: sitEggCartons, diff: 4 },
      { gen: sitAcornHoard, diff: 4 },
    ],
    // Day 5 — non-computational: the one-not-one-group error-analysis, the
    // build-a-hard-fact production, the claim that settles whether two routes
    // can disagree, and the argument for why the step works on every number.
    [
      { gen: wSub, diff: 2 },
      { gen: eaOneNotOneGroup, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Choose a fact from the six-times or seven-times row that you do NOT know by heart. Write down an easy fact you are certain of, write what you add to it, and write the answer you reach. Now reach the very same fact a second time, starting from a different easy fact, and write what you notice about the two answers you got.',
          value: 'start from a fact you are sure of and add one more group of the same size to reach the harder fact; a different easy fact needs a different number of groups added, and both routes land on the same number',
          acceptableForms: ['one more group', 'add a group', 'the same number', 'same answer', 'known fact'],
          keywords: true,
          hints: [
            'Which facts in the six-times and seven-times rows do you already answer without stopping to think?',
            'Take the fact you are certain of and add one whole group of the same size to it, then check where that lands.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes or never true: two children who build the same hard fact from two different easy facts finish with two different answers. In one sentence, say how you know.',
          correct: 'never',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Treats a rebuilt fact as belonging to the route that built it, so a different starting fact would be expected to finish somewhere else.',
            },
            {
              text: 'always',
              errorTag: 'representation-misread',
              rationale: 'Reads two different routes as two different questions, when both routes are counting the very same set of things.',
            },
          ],
          hints: [
            'Do two different paths across a room change how far apart its two walls are?',
            'Build one hard fact twice, starting from a different easy fact each time, and compare where the two builds finish.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt:
            'A friend says the one-more-group step only works because the numbers this week happen to be small. Write one sentence saying what stays the same every time you step from one fact to the next along a row, and why that would still be true for a row you have never practised.',
          value: 'each step along a row puts on one more group of exactly the same size, so the step is the same whatever the numbers are and the rebuild works for any row',
          acceptableForms: ['same size', 'one more group', 'every step', 'any row', 'always the same group'],
          keywords: true,
          hints: [
            'What is the same about every single step you take along a times-table row?',
            'Write out one row far enough to see the gaps, then look at what the gap between neighbours is made of.',
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
    'For grown-ups: the sixes and sevens are the facts children most often say they "just cannot do". They never have to. If 6 × 7 draws a blank, do not supply 42 — ask "what is 5 × 7?" and then "so what do you still need?". Two easy questions get there every time, and a child who can rebuild a fact stops being frightened of the table it lives in.',
  ],
  puzzle: (r) => {
    // A strip of consecutive multiples with both ends torn off. The new move is
    // DEDUCTION from a gap: nothing here is a fact to recall, and the strip
    // never says which table it came from — the difference between neighbours
    // is the only evidence there is.
    const step = r.pick(THIS_WEEK);
    const start = r.int(2, 6);
    const strip = [0, 1, 2, 3].map((k) => step * (start + k));
    const lost = [step * (start - 1), step * (start + 4)];
    const name = one(r);
    return {
      id: 'C11-PZ-01',
      title: 'Puzzle Grove: The Torn Strip',
      puzzleType: 'logic',
      prompt: `${name} finds a strip torn out of a times-table poster. The numbers left on it read ${strip.join(', ')}, and one number has been torn off each end. Write down BOTH of the missing numbers, then say which table the strip came from and how the strip itself told you.`,
      answer: {
        // A `set`, not a single value: the task is to rebuild both ends, and a
        // child who finds only the easier one has not finished the deduction.
        value: lost.join(', '),
        acceptableForms: [lost.join('; '), lost.join(' ')],
        validation: 'set',
      },
      hintLadder: [
        'How much does this strip grow by as your eye moves from one number to the number beside it?',
        'Step backwards by that same jump from the number at the front, and forwards by it from the number at the end.',
      ],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'pattern-search' },
  sprint: {
    skill: 'Multiplication facts ×3, ×4, ×5 — the known facts a rebuild starts from',
    sourceWeek: C8,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [3, 5] },
  },
  mastery: [
    { gen: sitPlanterRow, diff: 3 },
    { gen: msBakeryEstimate, diff: 3 },
    { gen: sitEggCartons, diff: 3 },
    { gen: msGreenhouseBench, diff: 4 },
    { gen: sitWeekPractice, diff: 3 },
    { gen: msPostcardRack, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step sixes and sevens — a part-whole with its five-group block already counted and drawn, a half-dozen carton where the six sits on the other side of the fact, and a week of equal practice sessions — with the one-block figure affordance preserved on the first. 02/04/06: the three chains — the estimate-first rebuild, the inverse-start bench whose stated quantity is a five-row result, and a rack filled then sold from. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'one-thing-not-one-group',
      description: 'Rebuilds from a known fact and steps on by a single thing where a whole group belongs, so the answer lands one past the fact already owned instead of a group past it.',
      exampleWrongAnswer: '6 planters of 7 bulbs answered as 36',
      distractorRationale: 'Offer the known fact with one added to it.',
      reteachPointer: 'explanation/script[3] (six sevens land a whole seven past thirty-five, not one past it)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'wrong-sized-step',
      description: 'Adds the number of GROUPS rather than what one group holds, so the step from the known fact to the next one is the wrong size.',
      exampleWrongAnswer: 'a 6-row blanket of 9 patches answered as 51',
      distractorRationale: 'Offer the known fact with the number of groups added to it.',
      reteachPointer: 'explanation/script[1] (the row below the line is the one more group, and it holds what every row holds)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-the-known-fact',
      description: 'Hands back the fact the story handed over, so the group the question actually adds is never counted at all.',
      exampleWrongAnswer: 'six nets of 8 oranges answered as 40',
      distractorRationale: 'Offer the known fact on its own, with nothing added.',
      reteachPointer: 'guidedExamples/C11-GE-01 (the fact is only finished once the last group is in)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'one-group-too-far',
      description: 'Takes one group too many on the way up, landing a whole group past the fact the question asked for.',
      exampleWrongAnswer: 'six sevens answered as 49',
      distractorRationale: 'Offer the product one group over.',
      reteachPointer: 'guidedExamples/C11-GE-02 (count the groups you have actually added, not the ones you have said)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'no-route-back',
      description: 'Hunts for a remembered six-times or seven-times fact and guesses when it will not come, rather than starting from a fact that is certain.',
      exampleWrongAnswer: 'seven eights answered as 54',
      distractorRationale: 'Offer a near-miss product of the kind an unsure recall produces.',
      reteachPointer: 'guidedExamples/C11-GE-03 (name the easy fact first, then take one step), then the 2-minute known-facts sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The ×6 and ×7 facts, built rather than memorised. Six of something is five of it and one more group; seven of it is six and one more group again. This week practised finding the easy fact to start from, taking a step of exactly the right size, and reaching the same fact twice from two different starting points as a check.',
    improvingCandidates: [
      'naming an easy fact to start from instead of guessing at a hard one',
      'stepping on by a whole group rather than by a single thing',
      'reaching the same fact a second way to check the first',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'the size of the step — one more group of the same size, not one more thing',
      },
      {
        errorTag: 'representation-misread',
        text: 'telling the number of groups apart from what one group holds, so the step is the right size',
      },
      {
        errorTag: 'task-comprehension',
        text: 'finishing the rebuild rather than handing back the fact the story already gave',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping count of the groups added, so the answer does not run one group over',
      },
      {
        errorTag: 'fact-recall',
        text: 'reaching for a certain fact when a hard one will not come',
      },
    ],
    homeFocus: {
      praiseLine:
        'You started from a fact you were already sure of and stepped on by one whole group, and then you checked it by building the same fact a second way — that rebuilding move is the whole of this week.',
      questionForChild: 'What is 5 times 7? So what is 6 times 7 — and what did you have to add to get there?',
      schoolSyncHook: 'If your child\'s class is learning the sixes and sevens as tables to recite rather than as facts to build, tell us and we will practise them both ways.',
    },
    vocabularyForParent: [
      'known fact (one your child answers without stopping to think)',
      'one more group (the step from one fact to the next along a row)',
      'rebuild (reaching a forgotten fact from one that is certain)',
    ],
  },
});
