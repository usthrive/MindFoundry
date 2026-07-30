/**
 * Level C · Week 22 — "Quadrilateral families" (conceptId: quadrilateral-families).
 *
 * FILL-ARCHITECTURE §5 row C22: anchor "property nesting"; multi-step "classify
 * then justify"; error-analysis "a tilted square is a diamond, not a square";
 * discrimination "Always/Sometimes/Never across the hierarchy"; Day-5 signature
 * "**a square IS a rectangle** — sort and defend (figure R)".
 *
 * THE DEEP IDEA IS THAT THE CATEGORIES NEST, so the week is built to make
 * "is it a square or a rectangle?" feel like the false choice it is:
 *  - no item ever asks a card to pick ONE family. Every question is either "how
 *    many cards pass this test", "which hoops does this card belong in", or
 *    "name every family this card has earned" — forms in which the honest answer
 *    can be *both*, and often is (discrimBothHoops draws a square one time in
 *    three, and its correct option is "both hoops");
 *  - the arithmetic IS the nesting. `sitRectangleCount` asks for the rectangles
 *    and the honest total is the squares PLUS the longer-than-wide cards; the
 *    metacognition item asks the same question on the rhombus side. A child who
 *    sorts into exclusive bins gets a smaller number, every time;
 *  - the two-step items are the recipe's "classify then justify": the classify
 *    decides WHICH piles enter the chain, and the second step is the family's
 *    own defining property doing arithmetic work (four corners per card, or a
 *    corner count divided back into cards). Both carry a pile the chain must
 *    NOT consume, so "use every number" fails here.
 *
 * DEGREES ARE DELIBERATELY ABSENT. C is the band that meets quadrilaterals by
 * ATTRIBUTE ("classify by sides/angles; attribute language"); protractor work
 * and the 360° angle sum belong to D23, which already owns them. So the whole
 * week reasons in two child-visible tests — "four square corners?" and "four
 * sides the same length?" — and every figure is drawn with `showArcs: false`,
 * which suppresses the degree labels while `showRightMarks` still stamps the
 * square-corner marks. The picture speaks the same language the prose does.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7), and the one real constraint the
 * primitive imposes. `AngleFig` CONSTRUCTS a quadrilateral's vertices from its
 * angles, choosing the tangential (most even) member of the family — so
 * 90/90/90/90 always draws a true SQUARE, and a rectangle that is longer than
 * it is wide simply cannot be drawn from angles alone. Rather than let a picture
 * contradict its own prose, this week draws only the shapes the primitive draws
 * truthfully:
 *  - the TILTED SQUARE (angles 90×4, `sideMarks` [1,1,1,1], `rotation: 45`) —
 *    the week's headline misconception made real on the page instead of
 *    asserted in prose. Its item states the two properties in words, so the
 *    ticks and the corner marks assert GIVENS, never the answer;
 *  - the RHOMBUS (`lean`/180−`lean` alternating, four ticks, no square corners),
 *    drawn from the item's own drawn `lean` param;
 *  - one non-parallelogram in the lesson script, whose alt claims only what is
 *    true at any orientation.
 * Every other shape is described by its properties in prose. Notably the
 * "both hoops" discrimination carries NO figure at all: it must offer a square
 * and a longer-than-wide rectangle with the same surface, and a picture on only
 * one of them would leak the answer by its presence.
 *
 * ⚠ VERIFY-LIBRARY NOTE (FANOUT kit §E2.3, documented here rather than buried).
 * The recipe's error-analysis is "a tilted square is a diamond, not a square" —
 * a NAMING slip, and every {correct, wrong} verify template in the registry
 * returns numbers. `a_shape_name_v1` derives a name from a corner count but is
 * correct-only, so it cannot back an `errorAnalysis`. The item is therefore
 * REFRAMED onto the quantity the misconception genuinely changes: the COUNT of
 * squares on a wall where exactly one square is standing on its corner. Leaving
 * that one out returns a count one short, which is precisely what
 * `a_verify_count_slip_v1`'s 'skip-count' mode computes — so both the shown
 * number and the keyed truth come from the template, nothing is fabricated, and
 * the misconception on the page is the recipe's own. (C20 uses the same template
 * on a different quantity — a partial row — with different prose.)
 *
 * THE TRAPEZOID IS DEFINED, NOT ASSUMED. "One pair of parallel sides" is used
 * only as a card that FAILS the parallelogram test; the week never asks a
 * nesting question about it, so the inclusive/exclusive definition argument
 * never becomes load-bearing. The vocabulary states the reading in use.
 *
 * WHAT THIS WEEK DOES NOT TAKE FROM ITS NEIGHBOURS. C20 owns covering-and-
 * counting and C21 owns the border-versus-covering choice; no item here counts
 * squares inside a shape, and the single item that touches a length
 * (`sitEqualSideDivide`) does so as SHARING — one cord split among four sides
 * the family guarantees are equal — with no covering anywhere on the page to
 * choose between. Contexts are hand-bound (shape cards, hoops, a shape wall,
 * name tags) and share no place with either neighbour.
 *
 * Retrieval is backward-only into C3 (± within 1,000), C10 (the ×/÷ fact
 * families the corner counts and the cord-share lean on), C12 (the fact table)
 * and C20 (rectangles measured, the week where this week's shapes last appeared).
 */

import { addWhole, asWarmup, classify, divideExact, multiply, reasoning, rectArea } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import type { ItemDraft } from '../lib/assemble';
import { shapeFigure } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C3 = { level: 'C' as const, week: 3 };
const C10 = { level: 'C' as const, week: 10 };
const C12 = { level: 'C' as const, week: 12 };
const C20 = { level: 'C' as const, week: 20 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// withFigureOf — attach a picture built from the item's OWN drawn values.
//
// The shipped primitives have no figure slot and `lib/` is not ours to edit, so
// this works the way `withEstimateFirst` does: everything happens inside the
// returned closure, no new rng draw is taken, and the prompt (and with it the
// QG-1/QG-4 surface signature) is left untouched. It is handed the whole DRAFT
// rather than only `generator.params`, because this week attaches pictures to
// two different item shapes: a `situation()` whose figure is built from its
// drawn params, and a `discrimination()` — which carries no generator spec, and
// whose figure is therefore built from the fixed properties its own prose
// states on every seed ("four sides the same length, four square corners,
// standing on a corner"). Those are the item's own drawn values too; they
// simply do not vary.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigureOf(base: ItemGen, build: (draft: ItemDraft) => BBFigure | null): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const fig = build(d);
    return fig ? { ...d, figure: fig } : d;
  };
}

// ---------------------------------------------------------------------------
// The two tests, in the words the whole week uses, and the pictures that show
// them. `showArcs: false` keeps the degree labels off a Level-C page; the
// square-corner marks are drawn independently of it.
// ---------------------------------------------------------------------------

const CORNERS_TEST = 'four square corners';
const SIDES_TEST = 'four sides the same length';

/** What a child sees when a square is tipped onto a corner. Never its name. */
const TILT_SCENE =
  'a four-sided shape balanced on one of its corners, with one tick on every side to show that all four sides match, and a small square drawn inside every corner';

const tiltedSquareFig = (): BBFigure =>
  shapeFigure(
    { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], rotation: 45, showArcs: false },
    { alt: TILT_SCENE },
  );

const flatSquareFig = (): BBFigure =>
  shapeFigure(
    { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], showArcs: false },
    {
      alt: 'a four-sided shape sitting flat on one side, with one tick on every side to show that all four sides match, and a small square drawn inside every corner',
    },
  );

/** The rhombus scene — four matching sides, and corners that lean. */
const RHOMBUS_SCENE =
  'a four-sided shape sitting flat on one side, with one tick on every side to show that all four sides match, and corners that lean over instead of being square';

const rhombusFig = (lean: number): BBFigure =>
  shapeFigure(
    { shape: 'quadrilateral', angles: [lean, 180 - lean, lean, 180 - lean], sideMarks: [1, 1, 1, 1], showArcs: false },
    { alt: RHOMBUS_SCENE },
  );

/**
 * A quadrilateral that is nobody's special case. The alt claims only what is
 * true of it at ANY orientation: the renderer picks its own resting position,
 * so a claim about a "bottom" side would be a claim this file cannot keep.
 */
const plainQuadFig = (): BBFigure =>
  shapeFigure(
    { shape: 'quadrilateral', angles: [60, 120, 120, 60], showArcs: false },
    {
      alt: 'a four-sided shape with one pair of sides running the same way as each other and one pair that does not, and not a square corner on it',
    },
  );

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

const wAdd = asWarmup(addWhole(118, 476), C3);
const wMul = asWarmup(multiply(3, 9, 3, 9), C12);
const wDiv = asWarmup(divideExact(3, 9, 3, 9), C10);
/** C20 — the week rectangles were last on the page, measured rather than named. */
const wArea = asWarmup(rectArea(), C20);

// ---------------------------------------------------------------------------
// The nesting counts. Both ask for a FAMILY total, and both are only right if
// the special members are counted in — that is the whole item.
// ---------------------------------------------------------------------------

const sitRectangleCount = situation({
  situationType: 'combine',
  cognitiveOp: 'classify-count',
  draw: (r) => {
    const a = r.int(2, 7);
    const b = r.int(2, 7);
    const name = one(r);
    return {
      prompt: `${name} lays shape cards out on the board: ${countNoun(a, 'cards')} with ${CORNERS_TEST} and ${SIDES_TEST}, and ${countNoun(b, 'cards')} with ${CORNERS_TEST} and two sides longer than the other two. How many of the cards on the board are rectangles?`,
      answerValue: String(a + b),
      templateId: 'd_add_v1',
      params: { a, b },
      units: 'cards',
      hints: [
        'Does a card have to give up being a square before it can count as a rectangle?',
        'Hold each group against the one thing the rectangle family asks for, and keep every group that has it.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The same move on the other side of the hierarchy, and the week's metacognition
 * carrier — so it is reachable ONLY through the estimate-first wrapper (kit
 * §E2.2: serving a generator raw and wrapped ships two identical hint ladders).
 * A third pile is stated and must NOT be counted.
 */
const sitRhombusCountBase = situation({
  situationType: 'combine',
  cognitiveOp: 'classify-count-rhombus',
  draw: (r) => {
    const a = r.int(2, 6);
    const b = r.int(2, 6);
    const c = r.int(2, 6);
    const name = one(r);
    return {
      prompt: `${name} tips a box of shape cards onto the mat: ${countNoun(a, 'cards')} with ${SIDES_TEST} and ${CORNERS_TEST}, ${countNoun(b, 'cards')} with ${SIDES_TEST} and not one square corner, and ${countNoun(c, 'cards')} with two sides longer than the other two. How many of the cards are rhombuses?`,
      answerValue: String(a + b),
      templateId: 'd_add_v1',
      params: { a, b, c },
      units: 'cards',
      hints: [
        'Which piles pass the matching-sides test, and is there a pile that never could?',
        'Gather every pile whose four sides match, and leave the pile with a longer pair where it is.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});
const sitRhombusCountEstimate = withEstimateFirst(
  sitRhombusCountBase,
  'will every card in the box join the rhombus family, or will some of them be left outside it?',
);

/** The family property doing arithmetic: four corners a card, whatever its name. */
const sitCornerRate = situation({
  situationType: 'rate',
  cognitiveOp: 'quad-corners',
  draw: (r) => {
    const k = r.int(3, 12);
    const name = one(r);
    return {
      prompt: `Every quadrilateral carries the same number of corners, whichever family it belongs to. ${name} cuts out ${countNoun(k, 'quadrilateral cards')} for a sorting game. How many corners is that in all?`,
      answerValue: String(4 * k),
      templateId: 'd_mul_v1',
      params: { a: k, b: 4 },
      units: 'corners',
      hints: [
        'Do the different families change how many corners a card brings with it?',
        'Every card brings the same four corners, so take four once for each card in the pile.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});

/** Inside the family: the members that carry the extra property, and the rest. */
const sitSquaresNotSquares = situation({
  situationType: 'part-whole',
  cognitiveOp: 'family-minus-special',
  draw: (r) => {
    const total = r.int(8, 16);
    const sq = r.int(2, total - 3);
    const name = one(r);
    return {
      // countNoun is the interpolation authority, so every quantity here names a
      // COUNTABLE NOUN and nothing else: an earlier draft passed it the phrase
      // "of them" and the pluraliser printed "4 of thems".
      prompt: `Every card in ${name}'s folder has ${CORNERS_TEST}. The folder holds ${countNoun(total, 'cards')} in all, and ${countNoun(sq, 'cards')} also have ${SIDES_TEST}. How many of the cards are rectangles that are not squares?`,
      answerValue: String(total - sq),
      templateId: 'd_sub_v1',
      params: { a: total, b: sq },
      units: 'cards',
      hints: [
        'Which family does every card in the folder already belong to, before anything else is checked?',
        'Take the cards carrying the extra matching-sides property out of the folder, and count what is still there.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * SHARING, not perimeter (C21 owns the border-versus-covering choice). One cord
 * is split among four sides that the rhombus family GUARANTEES are equal — the
 * property is what makes the division legal, and it is the only reason the
 * question has one answer.
 */
const sitEqualSideDivide = withFigureOf(
  situation({
    situationType: 'sharing',
    cognitiveOp: 'equal-side-share',
    usesPriorSkill: true,
    draw: (r) => {
      const side = r.int(4, 12);
      const lean = r.pick([60, 65, 70, 75, 80]);
      const name = one(r);
      return {
        prompt: `[image: ${RHOMBUS_SCENE}] A rhombus has ${SIDES_TEST}. ${name} bends one straight piece of gold cord ${countNoun(4 * side, 'centimeters')} long into a rhombus name badge, with none of the cord left over. How long is one side of the badge?`,
        answerValue: String(side),
        templateId: 'd_div_v1',
        params: { a: 4 * side, b: 4, lean },
        units: 'centimeters',
        hints: [
          'What does knowing the four sides match let you do with one whole length of cord?',
          'Deal the cord out into four equal shares, one for each of the matching sides.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (d) => (d.generator ? rhombusFig(numOf(d.generator.params, 'lean')) : null),
);

// ---------------------------------------------------------------------------
// Multi-step — the recipe's "classify then justify". The classify decides which
// piles enter the chain; the second move is the family property doing the work.
// Each chain states a pile it must NOT consume.
// ---------------------------------------------------------------------------

const msRectanglesThenCorners = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'classify-then-count',
  posing: 'has-distractor',
  usesPriorSkill: true,
  draw: (r) => {
    const a = r.int(2, 6);
    const b = r.int(2, 6);
    const c = r.int(2, 6);
    const name = one(r);
    return {
      prompt: `${name}'s tray holds ${countNoun(a, 'cards')} with ${CORNERS_TEST} and ${SIDES_TEST}, ${countNoun(b, 'cards')} with ${CORNERS_TEST} and two sides longer than the other two, and ${countNoun(c, 'cards')} with ${SIDES_TEST} and not one square corner. How many corners do the rectangle cards have altogether?`,
      initN: a,
      steps: [
        { op: 'add', n: b, d: 1 },
        { op: 'mul', n: 4, d: 1 },
      ],
      units: 'corners',
      hints: [
        'Which of the three piles pass the rectangle test, and which pile falls short of it?',
        'Gather the piles that pass first, and only then give each of those cards its four corners.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const msParallelogramHoop = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'family-gather',
  posing: 'has-distractor',
  draw: (r) => {
    const a = r.int(2, 6);
    const b = r.int(2, 6);
    const c = r.int(2, 6);
    const d = r.int(2, 6);
    // A drawn name earns its place here: this generator runs on two consecutive
    // days, and without one the two pages were the same sentence with new
    // numbers — the one duplication no per-pack gate reports.
    const name = one(r);
    return {
      prompt: `${name} labels a sorting hoop on the mat PARALLELOGRAMS. Beside it lie ${countNoun(a, 'cards')} with ${SIDES_TEST} and ${CORNERS_TEST}, ${countNoun(b, 'cards')} with ${CORNERS_TEST} and two sides longer than the other two, ${countNoun(c, 'cards')} with ${SIDES_TEST} and not one square corner, and ${countNoun(d, 'cards')} with just one pair of parallel sides. How many of the cards belong inside the hoop?`,
      initN: a,
      steps: [
        { op: 'add', n: b, d: 1 },
        { op: 'add', n: c, d: 1 },
      ],
      units: 'cards',
      hints: [
        'Which piles have both pairs of their sides running the same way, and which pile manages only one?',
        'Add up every pile whose opposite sides run in matching pairs, and leave the pile that manages one pair outside.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Inverse-start (C's F3 ceiling): the stated quantity is the RESULT of the
 * family property, so the opening move undoes it — corners back into cards —
 * and only then can the nesting be used to name what is left.
 */
const msCornersToSquares = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'corners-back-to-cards',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const cards = r.int(4, 9);
    const longer = r.int(2, cards - 2);
    const name = one(r);
    return {
      prompt: `${name} counts ${countNoun(4 * cards, 'corners')} in all across a pile of shape cards. Every card in the pile has ${CORNERS_TEST}, and ${countNoun(longer, 'cards')} in the pile have two sides longer than the other two. How many of the cards are squares?`,
      initN: 4 * cards,
      steps: [
        { op: 'div', n: 4, d: 1 },
        { op: 'sub', n: longer, d: 1 },
      ],
      units: 'cards',
      hints: [
        'What can a corner count tell you about how many cards are sitting in the pile?',
        'Turn the corners back into cards by grouping them in fours, then set aside the cards carrying a longer pair.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination. Three of them, because a week about nesting has to keep
// offering the choice that is not a choice.
// ---------------------------------------------------------------------------

const HOOP_BOTH = 'both hoops';
const HOOP_CORNERS = 'the square-corners hoop only';
const HOOP_SIDES = 'the matching-sides hoop only';

const HOOP_CARDS = [
  { card: 'a square', correct: HOOP_BOTH },
  { card: 'a rectangle that is longer than it is wide', correct: HOOP_CORNERS },
  { card: 'a rhombus with not one square corner', correct: HOOP_SIDES },
] as const;

/** Why a wrong hoop is wrong for THIS card — each rationale is that option's own output. */
function hoopRationale(correct: string, option: string): { errorTag: ErrorTag; rationale: string } {
  if (correct === HOOP_BOTH) {
    return option === HOOP_CORNERS
      ? {
          errorTag: 'concept-misconception',
          rationale: 'Stops at the first test the card passes and never runs the second — this card matches on its sides as well.',
        }
      : {
          errorTag: 'representation-misread',
          rationale: 'Reads the matching sides and leaves out the square corners the very same card is carrying.',
        };
  }
  if (option === HOOP_BOTH) {
    return {
      errorTag: 'task-comprehension',
      rationale: 'Puts the card in a hoop it fails: one of the two tests is not passed by this card at all.',
    };
  }
  return {
    errorTag: 'concept-misconception',
    rationale: 'Picks the single test this card does not pass and ignores the one it does.',
  };
}

const discrimBothHoops = discrimination({
  variant: 'structural',
  cognitiveOp: 'family-membership',
  draw: (r) => {
    const s = r.pick(HOOP_CARDS);
    const name = one(r);
    const others = [HOOP_CORNERS, HOOP_SIDES, HOOP_BOTH].filter((o) => o !== s.correct);
    return {
      prompt: `Two hoops lie on the mat. One takes every shape with ${CORNERS_TEST}. The other takes every shape with ${SIDES_TEST}. ${name} holds up a card showing ${s.card}. Which hoop does that card belong in?`,
      correct: s.correct,
      distractors: others.map((o) => ({ text: o, ...hoopRationale(s.correct, o) })),
      hints: [
        'Does a card have to pick one hoop, or is it allowed to pass both tests at once?',
        'Run the two tests on the card one after the other, and keep every hoop whose test it passes.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * The headline misconception, made real on the page. The prompt STATES the two
 * properties, so the ticks and the square-corner marks in the picture assert
 * givens rather than the answer; what the picture adds is the tilt, which is the
 * only thing on the card that changed.
 */
const discrimNameTilted = withFigureOf(
  discrimination({
    variant: 'structural',
    cognitiveOp: 'name-the-shape',
    draw: (r) => {
      const noun = r.pick(['card', 'tile', 'sticker', 'paper shape'] as const);
      const name = one(r);
      return {
        prompt: `[image: ${TILT_SCENE}] ${name} turns a ${noun} until it is balanced on one of its corners. All four of its sides are the same length, and all four of its corners are square corners. What is the ${noun} now?`,
        correct: 'a square',
        distractors: [
          {
            text: 'a diamond, and not a square',
            errorTag: 'representation-misread',
            rationale: 'Lets a turn rename the shape, when turning a card leaves every side length and every corner exactly as it was.',
          },
          {
            text: 'a rhombus, and not a square',
            errorTag: 'concept-misconception',
            rationale: 'Reads the matching sides and stops there; a shape carrying the square corners as well has earned the square name too.',
          },
        ],
        hints: [
          'What can turning a card change about it, and what can it never change?',
          'Check the two things a square needs on the card as it lies now, and see whether the turn touched either of them.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  () => tiltedSquareFig(),
);

// --- Always / Sometimes / Never, derived from a property model ---------------
//
// Each family is declared as the properties every member MUST carry and the
// properties no member CAN carry; everything else is optional. The verdict is
// then read off that model rather than authored, so a claim and its answer
// cannot drift apart. Note what the model itself teaches: inside a nesting
// hierarchy "never" is rare, and it only ever comes from a property that
// contradicts a required one (a square cannot have a longer pair of sides).

const P_CORNERS = CORNERS_TEST;
const P_SIDES = SIDES_TEST;
const P_OPPOSITE = 'its opposite sides the same length';
const P_LONGER = 'two sides longer than the other two';

interface Family {
  name: string;
  must: readonly string[];
  cannot: readonly string[];
}

const FAMILIES: readonly Family[] = [
  { name: 'square', must: [P_CORNERS, P_SIDES, P_OPPOSITE], cannot: [P_LONGER] },
  { name: 'rectangle', must: [P_CORNERS, P_OPPOSITE], cannot: [] },
  { name: 'rhombus', must: [P_SIDES, P_OPPOSITE], cannot: [P_LONGER] },
  { name: 'parallelogram', must: [P_OPPOSITE], cannot: [] },
  { name: 'quadrilateral', must: [], cannot: [] },
] as const;

const PROPERTIES = [P_CORNERS, P_SIDES, P_OPPOSITE, P_LONGER] as const;
const VERDICTS = ['always', 'sometimes', 'never'] as const;

function verdictFor(f: Family, prop: string): (typeof VERDICTS)[number] {
  if (f.must.includes(prop)) return 'always';
  if (f.cannot.includes(prop)) return 'never';
  return 'sometimes';
}

function asnRationale(correct: string, option: string, family: string): { errorTag: ErrorTag; rationale: string } {
  if (correct === 'always') {
    return option === 'sometimes'
      ? { errorTag: 'concept-misconception', rationale: `Treats a required property as an optional extra, when the ${family} family asks for it every single time.` }
      : { errorTag: 'task-comprehension', rationale: `Rules out a property that every ${family} is carrying already.` };
  }
  if (correct === 'sometimes') {
    return option === 'always'
      ? { errorTag: 'concept-misconception', rationale: `Promotes an optional extra into a requirement: some members of the ${family} family have it and some do not.` }
      : { errorTag: 'representation-misread', rationale: `Rules out a property that some members of the ${family} family really do carry.` };
  }
  return option === 'always'
    ? { errorTag: 'concept-misconception', rationale: `Allows a property that would stop the shape being a ${family} at all.` }
    : { errorTag: 'task-comprehension', rationale: `Leaves the door open to a property no ${family} can carry and keep its name.` };
}

const discrimAsn = discrimination({
  variant: 'structural',
  cognitiveOp: 'always-sometimes-never',
  draw: (r) => {
    const f = r.pick(FAMILIES);
    const prop = r.pick(PROPERTIES);
    const correct = verdictFor(f, prop);
    const others = VERDICTS.filter((v) => v !== correct);
    return {
      prompt: `Always, sometimes, or never true: a ${f.name} has ${prop}.`,
      correct,
      distractors: others.map((o) => ({ text: o, ...asnRationale(correct, o, f.name) })),
      hints: [
        'Is this property one the family demands of every member, one it merely allows, or one it rules out?',
        'Try to picture a member of the family without the property, and then one with it — whichever you cannot build settles the claim.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers).
// See the ⚠ note in the file header for why the naming slip is posed as a count.
// ---------------------------------------------------------------------------

const eaTiltedSquareSkipped = errorAnalysis({
  verifyTemplateId: 'a_verify_count_slip_v1',
  cognitiveOp: 'count-family-members',
  drawParams: (r) => ({ n: r.int(4, 8) + 1, slip: 'skip-count' }),
  build: (v, p, r) => {
    const flat = Number(p.n) - 1;
    const name = one(r);
    return {
      prompt: `[image: ${TILT_SCENE}] On ${name}'s shape wall there are ${countNoun(flat, 'cards')} that each show ${SIDES_TEST} and ${CORNERS_TEST}, sitting flat on a bottom edge. One more card shows ${SIDES_TEST} and ${CORNERS_TEST} too, but it is pinned up balanced on a corner. A student counted the squares on the wall and wrote ${v.wrong}.`,
      extension:
        'Look again at the card that is balanced on a corner, decide for yourself which families it belongs to, and write one sentence saying what a turn can and cannot change about a shape.',
      hints: [
        'Does turning a card change the length of its sides or the kind of corners it has?',
        'Hold the turned card up against the two things a square needs, and then count the wall again.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: ['square', 'turned', 'corners', 'sides the same length'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC22 = makeWeekBuilder({
  level: 'C',
  week: 22,
  conceptId: 'quadrilateral-families',
  conceptName: 'Quadrilateral families',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [C3, C10, C20],
  pedagogyContract: 'v2',
  conceptualAnchor: 'property nesting',
  conceptFamily: 'place-value',
  deepeningDelta:
    'C20 and C21 measured rectangles — covered them, walked round them — but never asked what makes one a rectangle in the first place. C22 turns the same shapes into a question about MEMBERSHIP: a name is earned by properties, the families sit inside one another rather than side by side, and one card can honestly hold several names at once. The new load is that answers stop being exclusive, and that a turn changes a picture without changing a single property.',
  explanation: {
    hook:
      'Two children argue over one card. "That is a square." "No, it is a rectangle." They are both right, and nobody has to give in — shape families are not separate boxes, they sit one inside another, and a card can honestly wear several names at once.',
    whyBeforeHow:
      'A shape\'s name is not a label somebody hands it — it is earned by the properties the shape carries, so a card belongs to every family whose tests it passes rather than to one box picked for it. That is why the families sit inside one another instead of side by side: the rectangle family asks for four square corners, the rhombus family asks for four sides the same length, and a card that carries both passes both tests at once, which is exactly what makes a square a rectangle AND a rhombus. This is property nesting — the more properties a card carries, the deeper inside the families it sits, and the fewer other cards keep it company. It also means that "is it a square or a rectangle?" is a false choice, because no square ever stops being a rectangle in order to be a square. And turning a card changes none of it: a turn moves a shape without touching one side length or one corner, so a square balanced on its corner is still every bit a square.',
    script: [
      {
        say: 'Here is my first card. Four straight sides, four corners — and that alone earns it the family name quadrilateral. Every card I show you today has that name, whatever else it turns out to be.',
        visual: 'A four-sided card with one pair of sides running the same way and one pair that does not.',
        figure: plainQuadFig(),
      },
      {
        say: 'Now watch me run two tests on this next card. Test one: are all four corners square corners? Yes — so it has earned the name rectangle. Test two: are all four sides the same length? Yes again — so the very same card has earned the name rhombus as well. One card, both names, and the name we give a card that passes both is square.',
        visual: 'A card marked with a tick on every side and a small square in every corner.',
        figure: flatSquareFig(),
      },
      {
        say: 'Here is the same card, and all I have done is turn it until it balances on a corner. I did not cut it and I did not stretch it. The sides are the lengths they were, the corners are the corners they were, so every test it passed a moment ago it passes now. A turn changes the picture, never the shape.',
        visual: 'The same card, balanced on one of its corners.',
        figure: tiltedSquareFig(),
      },
      {
        say: 'This card passes only one test. Its four sides do match, so it is a rhombus — but lean in and you will see its corners are not square corners, so the rectangle family will not take it, and neither will the square family. Passing one test is not passing both.',
        visual: 'A four-sided card with matching sides and leaning corners.',
        figure: rhombusFig(70),
      },
      {
        say: 'So before I write a name on any card I check it against every test, not just the first one that fits — and I check whether I have stopped too early. If I have written down only one name, I ask myself which wider families that name is sitting inside.',
        visual: 'One card with a name tag long enough for several names.',
      },
    ],
    summary:
      'A shape earns its family names by the properties it carries, and the families nest: every square is a rectangle and a rhombus, every rectangle and every rhombus is a parallelogram, and all of them are quadrilaterals. Run every test, not just the first one that fits — and remember that turning a card changes the picture and nothing else.',
    vocabulary: [
      { term: 'quadrilateral', kidGloss: 'any flat shape with four straight sides' },
      { term: 'square corner', kidGloss: 'a corner shaped like the corner of a book, marked with a small square' },
      { term: 'rhombus', kidGloss: 'a quadrilateral whose four sides are all the same length' },
      { term: 'parallelogram', kidGloss: 'a quadrilateral with two pairs of parallel sides — sides that run the same way and never meet' },
      { term: 'trapezoid', kidGloss: 'a quadrilateral with just one pair of parallel sides, so it never joins the parallelogram family' },
      { term: 'property nesting', kidGloss: 'families sitting inside one another, so one shape can hold several names at once' },
    ],
  },
  guidedExamples: [
    {
      ...ge(22, 1, 'modeled', 'A card has four square corners and four sides the same length. Name it — and name every family it has earned.', [
        {
          teacherSay:
            'Watch me name this card by testing it instead of guessing at it. Test one: are all four corners square corners? I take them one at a time, and every one of them is — so the rectangle family has to take this card. What do you think test two is going to ask about?',
          expected: 'the sides',
        },
        {
          teacherSay:
            'Test two: are all four sides the same length? They are, so the rhombus family takes it too. Notice I have not chosen between the two names. A card that passes both tests keeps both, and it earns a third name of its own.',
          expected: 'square',
          figure: flatSquareFig(),
        },
        {
          teacherSay:
            'Now I turn the card until it balances on a corner. Nothing has been cut and nothing has been stretched, so every test it passed a moment ago it still passes. The picture moved; the shape did not.',
          expected: 'square',
          figure: tiltedSquareFig(),
        },
        {
          childDo: 'Say every family name this one card has earned, widest family last.',
          expected: 'square, rectangle, rhombus, parallelogram, quadrilateral',
        },
      ], 'a square — and also a rectangle, a rhombus, a parallelogram and a quadrilateral'),
      visual: 'One card, tested twice, and then turned.',
    },
    {
      ...ge(22, 2, 'completion', 'A card has four square corners and two sides longer than the other two. Which family names has it earned?', [
        { teacherSay: 'Which of the two tests does this card pass — the square-corners test, the matching-sides test, or both of them?', expected: 'the square-corners test' },
        { childDo: 'Name the families this card has earned, then name the one family it just misses.', expected: 'rectangle, parallelogram, quadrilateral' },
      ], 'a rectangle, and so also a parallelogram and a quadrilateral — but not a rhombus and not a square'),
      visual: 'A card whose corners pass and whose sides do not match.',
    },
    {
      ...ge(22, 3, 'prompted', 'A card has four sides the same length and not one square corner. Which family names has it earned?', [
        { childDo: 'Run both tests on the card, then say which names it keeps and which it loses.', expected: 'rhombus, parallelogram, quadrilateral' },
      ], 'a rhombus, and so also a parallelogram and a quadrilateral — but not a rectangle and not a square'),
      visual: 'A card with matching sides and leaning corners.',
      figure: rhombusFig(65),
    },
    ge(22, 4, 'independent', 'Four cards lie on the table: one with four square corners and matching sides, one with four square corners and a longer pair of sides, one with matching sides and no square corners, and one with just one pair of parallel sides. How many of them belong in the hoop labelled PARALLELOGRAMS? Solve cold.', [
      { childDo: 'Decide for each card whether both pairs of its sides run the same way, then count the cards that go in.', expected: '3' },
    ], '3 cards — only the card with a single pair of parallel sides stays outside'),
  ],
  days: [
    // Day 1 — concept echo: one card, one test at a time, and the tilt met early
    // because it is the misconception the rest of the week is built against.
    [
      { gen: wAdd, diff: 2 },
      { gen: wArea, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: sitCornerRate, diff: 2 },
      { gen: sitRectangleCount, diff: 3 },
      { gen: discrimNameTilted, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first predict, the two-hoop
    // trap, the first classify-then-count chain and the family-property share.
    [
      { gen: wDiv, diff: 2 },
      { gen: sitRhombusCountEstimate, diff: 3 },
      { gen: discrimBothHoops, diff: 3 },
      { gen: msRectanglesThenCorners, diff: 4 },
      { gen: sitEqualSideDivide, diff: 3 },
      { gen: sitCornerRate, diff: 3 },
    ],
    // Day 3 — interleave: the Always/Sometimes/Never claim beside the two-hoop
    // trap and the tilt, with a gathering chain between them.
    [
      { gen: wMul, diff: 2 },
      { gen: discrimAsn, diff: 3 },
      { gen: discrimBothHoops, diff: 4 },
      { gen: msParallelogramHoop, diff: 4 },
      { gen: sitRectangleCount, diff: 3 },
      { gen: discrimNameTilted, diff: 4 },
    ],
    // Day 4 — word problems: both forward chains, the inverse-start chain, and
    // the two single-step items that live inside one family.
    [
      { gen: msRectanglesThenCorners, diff: 4 },
      { gen: msParallelogramHoop, diff: 4 },
      { gen: msCornersToSquares, diff: 5 },
      { gen: sitSquaresNotSquares, diff: 4 },
      { gen: sitEqualSideDivide, diff: 4 },
    ],
    // Day 5 — non-computational: the tilted-square error hunt, the computable
    // sort, and the defence written out (+ a ramped warm-up).
    [
      { gen: wAdd, diff: 2 },
      { gen: eaTiltedSquareSkipped, diff: 4 },
      {
        gen: classify({
          prompt:
            'Four cards are laid out. Card 1 has four square corners and two sides longer than the other two. Card 2 has four square corners and four sides the same length. Card 3 has four sides the same length and not one square corner. Card 4 has just one pair of parallel sides. Which cards go in the box labelled RECTANGLES?',
          correct: 'card 1 and card 2',
          distractors: [
            {
              text: 'card 1 only',
              errorTag: 'concept-misconception',
              rationale: 'Leaves the square outside the rectangle box, as though earning an extra property costs a shape the family it already belonged to.',
            },
            {
              text: 'card 1, card 2 and card 3',
              errorTag: 'representation-misread',
              rationale: 'Lets four matching sides stand in for four square corners, and the rectangle box asks for the corners.',
            },
          ],
          hints: [
            'What is the one thing the rectangle box insists on, and which cards can show it?',
            'Test each card against that one requirement in turn, and let a card in whatever else it also happens to be.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt:
            'A friend keeps one box for squares and one box for rectangles, and insists every card goes in exactly one box. Write two or three sentences telling your friend why the square cards honestly belong in the rectangle box as well, and then name the one extra thing a square carries that the other rectangles do not.',
          value:
            'a square has four square corners, which is everything the rectangle box asks for, so every square is also a rectangle; the extra thing a square carries is that all four of its sides are the same length',
          hints: [
            'Can one card sit in two boxes at once, or must it choose?',
            'Write down what the rectangle box asks for, hold a square card against that list, and then look for what the square brings on top.',
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
    'For grown-ups: the surprise this week is that "square or rectangle?" is a trick question — a square is a rectangle, and it stays one. If your child says a tipped square is a diamond, do not correct the word; turn the card back upright, ask what changed, and then turn it again. Nothing changed, and that is the whole idea. At home, a good question is "what else is this?" — a window pane is a rectangle, a parallelogram and a quadrilateral all at once, and collecting all its names is more useful than picking one.',
  ],
  puzzle: (r) => {
    const CARDS = [
      { desc: `${SIDES_TEST} and ${CORNERS_TEST}`, names: ['square', 'rectangle', 'rhombus', 'parallelogram', 'quadrilateral'] },
      { desc: `${CORNERS_TEST} and two sides longer than the other two`, names: ['rectangle', 'parallelogram', 'quadrilateral'] },
      { desc: `${SIDES_TEST} and not one square corner`, names: ['rhombus', 'parallelogram', 'quadrilateral'] },
      { desc: 'two pairs of parallel sides, two sides longer than the other two, and not one square corner', names: ['parallelogram', 'quadrilateral'] },
    ];
    const pick = r.pick(CARDS);
    const name = one(r);
    return {
      id: 'C22-PZ-01',
      title: 'Puzzle Grove: The Long Name Tag',
      puzzleType: 'logic',
      prompt: `A name tag on a shape card has room for EVERY family the card belongs to, not just one. ${name}'s card has ${pick.desc}. Fill in the tag with every family name that honestly fits this one card, and be ready to say how you know your list has nothing missing from it.`,
      answer: { value: pick.names.join(', '), acceptableForms: pick.names, validation: 'short-text-keyword' as const },
      hintLadder: [
        'How could you be sure a family name is missing from your tag rather than simply not fitting?',
        'Start from the widest family and work inwards, keeping every name whose tests the card still passes.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'] as ErrorTag[],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'name-every-family' },
  sprint: {
    skill: 'Multiplication facts — the substrate the corner counts run on',
    sourceWeek: C12,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sitRectangleCount, diff: 3 },
    { gen: sitCornerRate, diff: 3 },
    { gen: msRectanglesThenCorners, diff: 4 },
    { gen: sitEqualSideDivide, diff: 3 },
    { gen: msCornersToSquares, diff: 4 },
    { gen: msParallelogramHoop, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: the nesting total (a family count that is only right when its special members are counted in). 02: the defining property as a rate (four corners a card). 03: forward two-step — classify which piles are rectangles, then take four corners for each. 04: single-step share of one length among four sides the family guarantees are equal. 05: inverse-start two-step — a corner count turned back into cards, then the special members named. 06: forward two-step gather of every pile that passes the parallelogram test, with one pile that does not. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'families-as-exclusive-boxes',
      description: 'Treats the families as separate boxes rather than nested ones, so a square is barred from the rectangle family (or a rhombus from the parallelogram family) for being too special.',
      exampleWrongAnswer: 'a tray of squares and longer rectangles answered with only the longer rectangles counted',
      distractorRationale: 'Offer the total that leaves the special members of the family out.',
      reteachPointer: 'explanation/script[1] (one card passing both tests and keeping both names)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'turn-renames-the-shape',
      description: 'Lets the orientation decide the name, so the same card is one shape sitting flat and a different shape balanced on a corner.',
      exampleWrongAnswer: 'a square tipped onto its corner named a diamond and not a square',
      distractorRationale: 'Offer the name a child reads off the tilted picture rather than off the properties.',
      reteachPointer: 'explanation/script[2] (the same card turned, with nothing cut and nothing stretched)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'one-test-only',
      description: 'Runs the first property test, finds it passes, and never runs the second — so a name is awarded or refused on half the evidence.',
      exampleWrongAnswer: 'a card with four matching sides called a square without its corners ever being checked',
      distractorRationale: 'Offer the verdict that follows from running a single test.',
      reteachPointer: 'guidedExamples/C22-GE-01 (both tests run, one after the other)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'pile-lost',
      description: 'Sorts the families correctly but then loses a pile while combining them, or forgets that every card in the pile carries the same four corners.',
      exampleWrongAnswer: 'the corner total for a tray of seven rectangle cards answered as though only one pile counted',
      distractorRationale: 'Offer the total with one qualifying pile left out of the combining step.',
      reteachPointer: 'guidedExamples/C22-GE-04 (count the cards that go in, then use what each one carries)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Quadrilateral families and how they nest — naming a shape by the properties it carries (four square corners? four sides the same length?), discovering that one card can honestly be a square, a rectangle, a rhombus, a parallelogram and a quadrilateral all at once, and holding on to that name when the card is turned on its corner.',
    improvingCandidates: [
      'running every property test before naming a shape, not just the first one that fits',
      'counting the special members in when a family total is asked for',
      'keeping a shape\'s name when the shape is turned',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'letting one card hold several family names at once, instead of choosing between them',
      },
      {
        errorTag: 'representation-misread',
        text: 'reading a shape from its properties rather than from the way it happens to be sitting',
      },
      {
        errorTag: 'task-comprehension',
        text: 'finishing the second test before deciding, so a name is never given on half the evidence',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked both of a shape\'s tests before you named it, and you sorted the tilted card by what it is made of rather than by how it was sitting — that is exactly the move that keeps these families straight.',
      questionForChild: 'Our kitchen window pane — how many different family names can you honestly give it, and what would have to change for it to earn one more?',
      schoolSyncHook: 'If your child\'s class defines a trapezoid as having exactly one pair of parallel sides or at least one pair, tell us and we will use the same wording.',
    },
    vocabularyForParent: [
      'quadrilateral (any shape with four straight sides)',
      'rhombus (four sides the same length)',
      'parallelogram (two pairs of parallel sides)',
      'nesting (families sitting inside one another, so one shape holds several names)',
    ],
  },
});
