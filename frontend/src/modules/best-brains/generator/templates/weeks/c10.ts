/**
 * Level C · Week 10 — "Fact families ×/÷" (conceptId: fact-families-mul-div).
 *
 * FILL-ARCHITECTURE §5 row C10: anchor "the part-part-whole triangle";
 * multi-step "family then a missing factor"; error-analysis "12 ÷ 3 = 36";
 * discrimination "which member is missing"; Day-5 signature "missing-factor =
 * division (on-thread)".
 *
 * The claim of the week is that ONE triple {a, b, ab} is a single object with
 * four readings, so the content is built so that choosing the reading — not
 * computing — is the work:
 *  - every computational item is posed by covering ONE corner of the triangle,
 *    and the hint ladders name the corner, never the operation. Cover the top
 *    and both parts are in your hands, so you multiply; cover a bottom corner
 *    and you hold the whole and one part, so the whole gets broken up. Four of
 *    the eight core generators hand over the PRODUCT and one factor and ask for
 *    the other — the missing-factor move the week is named after, and the reason
 *    they all resolve through `d_factor_pair_v1`, whose registered `answerFor`
 *    is literally n ÷ f: the week's thesis is enforced by the template registry.
 *  - two discriminations carry the idea rather than decorate it. One asks which
 *    sentence COMPLETES a family whose other three are on the board (the recipe
 *    row), and its "multiply the two biggest" distractor is the same slip the
 *    Day-5 error-analysis then shows worked. The other asks where the empty box
 *    belongs for a stated question — the deep item, because the three options are
 *    all built from the same three numbers and only one of them can be solved.
 *  - five genuine two-step items: build the family then repack it at a new group
 *    size (the recipe's own shape), one `inverse-start` whose first move is the
 *    division that undoes a total the story never breaks down for you, and one
 *    carrying a quantity that must be left alone.
 *  - Day 5 makes "a missing factor IS a division" the point, not an aside: the
 *    error-analysis shows a divide answered with a multiply, the production
 *    writes the family out and then argues why a covered bottom corner can only
 *    be reached by dividing, and the Always/Sometimes/Never settles where the
 *    biggest number of a family is allowed to appear.
 *
 * FACT FIDELITY (inherited from C9 and tightened): every factor a child has to
 * recall comes from {2, 3, 4, 5, 10} — the facts C7 and C8 taught — with the
 * partner factor free up to 10 via the commutativity C7 also taught. ×6–×9 are
 * C11/C12. A family built on an untaught fact would quietly turn this into a
 * fact-recall week, and the four readings — the actual content — are what would
 * get dropped.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7, §E2.5). C9's honest picture was
 * the undivided WHOLE; C10's is one PART, and that inversion is the week. Every
 * day-item figure draws a single group at its stated size and asserts that size
 * against the item's own param, so the picture shows a corner the child was
 * handed and can never show how many of those groups fit — which on four of
 * these items is exactly the answer. The one variation is the brace: on the item
 * where the TOP corner is covered the bar carries a '?' over it, so the picture
 * says which corner is being hunted without saying what is there. Completed
 * families are drawn only where the answer is already on the page — the lesson
 * script and the guided examples.
 *
 * Retrieval is backward-only into C3/C4 (± within 1,000), C6 (equal groups — the
 * multiplication half of every family here) and C9 (grouping — the division
 * half). The two are deliberately served on the same morning in Day 1: the whole
 * week is about their being one fact, and the warm-ups are where the child last
 * met them as two.
 */

import { addWhole, asWarmup, classify, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { countNoun, wholeMoney } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel, counters } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C6 = { level: 'C' as const, week: 6 };
const C8 = { level: 'C' as const, week: 8 };
const C9 = { level: 'C' as const, week: 9 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/** The facts C7 and C8 taught — see the FACT FIDELITY note in the header. */
const TAUGHT = [2, 3, 4, 5, 10] as const;
/** The subset that also reads naturally as "a handful of containers". */
const SMALL_TAUGHT = [2, 3, 4, 5] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives have no figure slot and lib/ is not ours to edit, so
// this does what `withEstimateFirst` does: everything happens inside the
// returned closure, no new rng draw is taken, and the prompt (and therefore the
// QG-1/QG-4 surface signature) is untouched. It reads the drafted item's
// `generator.params` — the very numbers the answer was computed from — so the
// figure law holds by construction. (Pattern established by c06.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/**
 * A family whose two factors are equal collapses from four sentences to two —
 * true, interesting, and the whole subject of this week's puzzle, but not what a
 * day item should quietly model. Nudged deterministically, never redrawn: a loop
 * consumes a variable number of draws and every later item in the pack would
 * then depend on this one (kit §E2.4).
 */
function keepFactorsApart(a: number, b: number): number {
  if (a !== b) return b;
  return b === 3 ? 4 : 3;
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000. */
const wAdd = asWarmup(addWhole(137, 486), C3);
/** C4 — subtraction within 1,000. */
const wSub = asWarmup(subWhole(163, 872), C4);

/** C6 — equal groups: the multiplication that sits at the top of every triangle. */
const wCorridor = asWarmup(
  situation({
    situationType: 'rate',
    cognitiveOp: 'mul',
    draw: (r) => {
      const floors = r.int(3, 7);
      const doors = r.pick(TAUGHT);
      return {
        prompt: `A seaside hotel has ${countNoun(floors, 'floors')}, and there are ${countNoun(doors, 'doors')} along every floor. How many doors does the hotel have?`,
        answerValue: String(floors * doors),
        templateId: 'd_mul_v1',
        params: { a: floors, b: doors },
        units: 'doors',
        hints: [
          'Do all the floors of this hotel carry the same number of doors?',
          'Walk one floor. Then walk a floor just like it for every storey.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  C6,
);

/** C9 — grouping: the division that sits under one bottom corner. */
const wBundles = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'div-group',
    draw: (r) => {
      const per = r.pick(SMALL_TAUGHT);
      const bundles = r.int(4, 9);
      return {
        prompt: `A gardener ties ${countNoun(per * bundles, 'bamboo canes')} into equal bundles, with ${countNoun(per, 'canes')} in each bundle. How many bundles are tied?`,
        answerValue: String(bundles),
        templateId: 'd_div_v1',
        params: { a: per * bundles, b: per },
        units: 'bundles',
        hints: [
          'Which of the two amounts here is the pile the gardener started from?',
          'Tie one bundle. Keep tying bundles that size until the pile is gone. Then count them.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  C9,
);

// ---------------------------------------------------------------------------
// THE TOP CORNER IS COVERED — both parts given, the whole wanted.
// ---------------------------------------------------------------------------

const sitMarinaPontoons = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'mul',
    draw: (r) => {
      const perPontoon = r.pick(TAUGHT);
      const pontoons = keepFactorsApart(perPontoon, r.int(3, 9));
      return {
        prompt: `[image: one pontoon with ${countNoun(perPontoon, 'boats')} moored along it] The marina has ${countNoun(pontoons, 'pontoons')} running out into the water. ${countNoun(perPontoon, 'boats')} are moored along each one. How many boats are moored at the marina?`,
        answerValue: String(perPontoon * pontoons),
        templateId: 'd_mul_v1',
        params: { a: perPontoon, b: pontoons, group: 'pontoon' },
        units: 'boats',
        hints: [
          'Are both numbers here parts of the family, or is one the whole?',
          'Moor up one pontoon. Then repeat that pontoon once for every pontoon the marina puts out.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    barModel(
      [
        {
          label: `one ${strOf(p, 'group')}`,
          segments: [{ value: numOf(p, 'a'), label: String(numOf(p, 'a')) }],
          total: '?',
        },
      ],
      {
        alt: `a bar for one pontoon with ${countNoun(numOf(p, 'a'), 'boats')} moored along it, and a question mark where the whole marina would go`,
        asserts: assertsParam('a'),
      },
    ),
);

// ---------------------------------------------------------------------------
// A BOTTOM CORNER IS COVERED — the whole and one part given, the other part
// wanted. This is the missing factor, and `d_factor_pair_v1` computes it by
// dividing, which is the claim the week is making.
// ---------------------------------------------------------------------------

const sitJugglerBeanbags = withFigure(
  situation({
    situationType: 'sharing',
    cognitiveOp: 'missing-factor',
    draw: (r) => {
      const perJuggler = r.pick(SMALL_TAUGHT);
      const jugglers = keepFactorsApart(perJuggler, r.int(3, 9));
      return {
        prompt: `[image: one juggler holding ${countNoun(perJuggler, 'beanbags')}] The juggling club shares ${countNoun(perJuggler * jugglers, 'beanbags')} out equally, and everybody ends up holding ${countNoun(perJuggler, 'beanbags')}. How many jugglers came tonight?`,
        answerValue: String(jugglers),
        templateId: 'd_factor_pair_v1',
        params: { n: perJuggler * jugglers, f: perJuggler },
        units: 'jugglers',
        hints: [
          'Which of these two amounts is the whole set?',
          'Lift the whole set off the top corner. Break it into parts of the stated size.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    barModel(
      [{ label: 'one juggler', segments: [{ value: numOf(p, 'f'), label: String(numOf(p, 'f')) }] }],
      {
        alt: `a bar for one juggler holding ${countNoun(numOf(p, 'f'), 'beanbags')}`,
        asserts: assertsParam('f'),
      },
    ),
);

const sitLanternRows = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'missing-factor',
    draw: (r) => {
      const perRow = r.pick(TAUGHT);
      const rows = keepFactorsApart(perRow, r.int(3, 8));
      return {
        prompt: `[image: one row of the parade, ${countNoun(perRow, 'lanterns')} across] For the winter parade, ${countNoun(perRow * rows, 'lanterns')} are strung above the square in equal rows. There are ${countNoun(perRow, 'lanterns')} to a row. How many rows of lanterns hang above the square?`,
        answerValue: String(rows),
        templateId: 'd_factor_pair_v1',
        params: { n: perRow * rows, f: perRow },
        units: 'rows',
        hints: [
          'Which number counts every lantern above the square, and which counts one row?',
          'String a row of that width. Keep stringing rows the same width until no lanterns are left. Count as you go.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'f'), rowLabels: [String(numOf(p, 'f'))] },
      {
        alt: `one row of the parade, ${countNoun(numOf(p, 'f'), 'lanterns')} across`,
        asserts: assertsParam('f', 'cells'),
      },
    ),
);

/**
 * The measurement dress, and the base for the CHECK-BACK metacognition. Building
 * the whole back up from the answer is not a generic study habit here — it is the
 * fourth sentence of the same family, so the check and the content are one move.
 * Served ONLY through the wrapper, so the ladder is never counted twice (§E2.2).
 */
const sitTrackPieces = situation({
  situationType: 'measurement',
  cognitiveOp: 'missing-factor',
  draw: (r) => {
    const piece = r.pick(TAUGHT);
    const pieces = keepFactorsApart(piece, r.int(4, 9));
    return {
      prompt: `A straight run of model railway measures ${countNoun(piece * pieces, 'cm')} from end to end. It is built from equal straight pieces, and one piece is ${countNoun(piece, 'cm')} long. How many pieces make the run?`,
      answerValue: String(pieces),
      templateId: 'd_factor_pair_v1',
      params: { n: piece * pieces, f: piece },
      units: 'pieces',
      hints: [
        'Does this story measure the whole run, one piece, or both?',
        'Set a piece down at the start of the run. Step it along to the end. Keep a tally of the steps.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});
const sitTrackPiecesCheck = withCheckBack(
  sitTrackPieces,
  'does your count of pieces rebuild the whole run?',
);

/**
 * The money dress, and the base for the ESTIMATE-FIRST metacognition. The probe
 * is a real call — whether the count of things bought beats the price of one
 * flips with the numbers — and answering it is precisely the size-sense that
 * stops a missing factor being answered with a multiply.
 */
const sitRecorderPrice = situation({
  situationType: 'rate',
  cognitiveOp: 'missing-factor',
  draw: (r) => {
    const each = r.pick(TAUGHT);
    const bought = keepFactorsApart(each, r.int(3, 9));
    return {
      prompt: `The music room spends ${wholeMoney(each * bought)} on descant recorders. Every recorder costs the same, ${wholeMoney(each)}. How many recorders come back to the music room?`,
      answerValue: String(bought),
      templateId: 'd_factor_pair_v1',
      params: { n: each * bought, f: each },
      units: 'recorders',
      hints: [
        'Which amount on the receipt is the whole spend, and which is one recorder?',
        'Pay for one recorder out of the bill. Keep paying that amount until the bill is spent. Then count the recorders on the table.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const sitRecorderPriceEstimate = withEstimateFirst(
  sitRecorderPrice,
  'will the number of recorders come out above the price of one, or below?',
);

// ---------------------------------------------------------------------------
// Multi-step: "build the family, then find a missing factor" and its siblings
// ---------------------------------------------------------------------------

/**
 * The recipe's own shape. The multiply builds the whole from the parts the story
 * states; the divide then asks for a factor of that whole which the story never
 * mentions. Both halves live in one triple, which is why this reads as one idea
 * rather than two exercises.
 *
 * The bed size is a factor of the total BY CONSTRUCTION (the number of boxes is
 * drawn as a multiple of it), so no draw can produce a planting that does not
 * come out even, and no redraw loop is needed.
 */
const msPrizesThenHampers = multiStep({
  situationType: 'multi-stage',
  draw: (r) => {
    const perBox = r.pick(SMALL_TAUGHT);
    // A hamper the size of a box would let a child answer by counting boxes and
    // never meet the second family at all.
    const hamperSize = keepFactorsApart(perBox, r.pick(SMALL_TAUGHT));
    // Drawn before the clamp, never after, so the number of rng draws is fixed
    // whatever the hamper size turns out to be (kit §E2.4).
    let k = r.int(2, 3);
    if (hamperSize * k > 10) k = 2;
    const boxes = hamperSize * k;
    const name = one(r);
    return {
      prompt: `${name} opens ${countNoun(boxes, 'boxes')} of tombola prizes, with ${countNoun(perBox, 'prizes')} in every box. Every prize is then packed into a gift hamper, and one hamper takes ${countNoun(hamperSize, 'prizes')}. How many hampers does ${name} make up?`,
      initN: boxes,
      steps: [
        { op: 'mul', n: perBox, d: 1 },
        { op: 'div', n: hamperSize, d: 1 },
      ],
      units: 'hampers',
      hints: [
        'Which number does this story never say out loud?',
        'Tip every box into one heap first. Then break that heap into helpings of the stated size.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The stated total is the RESULT of
 * a multiplication the story never performs in front of you, and the number the
 * second sentence needs — how many hang on ONE rail — is nowhere on the page. So
 * the opening move is the division that undoes the total, i.e. a missing factor,
 * and only then can the question be answered.
 */
const msRailsThenSome = multiStep({
  situationType: 'rate',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const rails = r.pick([3, 4, 5] as const);
    const perRail = r.int(3, 9);
    const some = r.int(2, rails - 1);
    return {
      prompt: `${countNoun(rails * perRail, 'coats')} hang in the cloakroom on ${countNoun(rails, 'rails')}. Every rail holds the same number. How many coats hang on ${some} of those rails?`,
      initN: rails * perRail,
      steps: [
        { op: 'div', n: rails, d: 1 },
        { op: 'mul', n: some, d: 1 },
      ],
      units: 'coats',
      hints: [
        'Does the cloakroom ever tell you what a single rail is carrying?',
        'Find the single-rail number first. Only then take as many rails as the question wants.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Same two-step family shape, posed with a quantity that is NOT used
 * (F3 `has-distractor`): an item that consumes every number it states quietly
 * teaches "use all the numbers", and children do learn it.
 */
const msRosettesWithSpare = multiStep({
  situationType: 'multi-stage',
  posing: 'has-distractor',
  draw: (r) => {
    const perBoard = r.pick(SMALL_TAUGHT);
    const clubs = keepFactorsApart(perBoard, r.pick(SMALL_TAUGHT));
    let k = r.int(2, 3);
    if (clubs * k > 10) k = 2;
    const boards = clubs * k;
    const judges = r.int(6, 9);
    const name = one(r);
    return {
      prompt: `A dog show pins ${countNoun(perBoard, 'rosettes')} onto each of ${countNoun(boards, 'display boards')}. At the end of the day ${name} shares all the rosettes equally between ${countNoun(clubs, 'clubs')}. The programme lists ${countNoun(judges, 'judges')}. How many rosettes does one club take home?`,
      initN: perBoard,
      steps: [
        { op: 'mul', n: boards, d: 1 },
        { op: 'div', n: clubs, d: 1 },
      ],
      units: 'rosettes',
      hints: [
        'Before you begin, which of these numbers is counting something that is not a rosette?',
        'Gather every rosette into one heap. Then split that heap as the second sentence asks. One number will stay unused.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's point, forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * The recipe's discrimination: which member of the family is missing. Three
 * sentences are already on the board, so the child cannot arrive by computing —
 * every option is built from the same three numbers and every option is
 * arithmetically checkable. What separates them is which number is allowed to
 * stand at the front of a division, and which is allowed to stand alone at the
 * end of a multiply.
 */
const discrimCompleteFamily = discrimination({
  variant: 'structural',
  cognitiveOp: 'complete-family',
  draw: (r) => {
    const small = r.pick(SMALL_TAUGHT);
    const big = keepFactorsApart(small, r.int(3, 9));
    const whole = small * big;
    return {
      prompt: `Three sentences of one fact family are already on the board. They are ${small} × ${big} = ${whole}, ${big} × ${small} = ${whole} and ${whole} ÷ ${big} = ${small}. Which sentence completes the family?`,
      correct: `${whole} ÷ ${small} = ${big}`,
      distractors: [
        {
          text: `${small} ÷ ${whole} = ${big}`,
          errorTag: 'representation-misread',
          rationale: 'Begins the division at a bottom corner. The number being broken up is the one the other two built, and it is not the number this sentence starts from.',
        },
        {
          text: `${big} × ${whole} = ${small}`,
          errorTag: 'concept-misconception',
          rationale: 'Keeps the multiply sign and puts the whole where a part belongs — two numbers of a family multiplied together can never land on the smallest of the three.',
        },
      ],
      hints: [
        'Which corner has not yet stood alone after the equals sign?',
        'Cover each of the three numbers in turn. Read what the other two must do to reach it.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

const BOX_SCENES = [
  { container: 'rock pool', noun: 'limpets' },
  { container: 'toolbox', noun: 'spanners' },
  { container: 'kennel', noun: 'chew toys' },
  { container: 'wagon', noun: 'hay bales' },
] as const;

/**
 * The deep item. All three options are true-looking sentences over the same
 * three numbers, and only ONE of them can actually be solved from what the story
 * gives: the other two put the empty box where a number is already known, or
 * make the unknown the largest of the three. Naming where the box goes IS the
 * algebra thread this level carries (box-as-unknown), and it is the sentence
 * Day 5 then answers by dividing.
 */
const discrimBoxPlacement = discrimination({
  variant: 'structural',
  cognitiveOp: 'place-the-unknown',
  draw: (r) => {
    const per = r.pick(SMALL_TAUGHT);
    const holders = keepFactorsApart(per, r.int(3, 9));
    const whole = per * holders;
    const s = r.pick(BOX_SCENES);
    const name = one(r);
    return {
      prompt: `Every ${s.container} holds the same number of ${s.noun}. ${name} counts ${countNoun(holders, s.container)} and ${countNoun(whole, s.noun)} in all. Nobody has counted what a single ${s.container} holds. Which number sentence puts the empty box where ${name}'s question belongs?`,
      correct: `${holders} × ▢ = ${whole}`,
      distractors: [
        {
          text: `${whole} × ${holders} = ▢`,
          errorTag: 'task-comprehension',
          rationale: 'Multiplies the two amounts that have already been counted, so the box would hold more than everything there is — when what it stands for is smaller than either of them.',
        },
        {
          text: `▢ ÷ ${holders} = ${whole}`,
          errorTag: 'representation-misread',
          rationale: 'Sets the box up as the number being broken apart, which would make the uncounted amount the largest of the three instead of the smallest.',
        },
      ],
      hints: [
        'Which one of the three amounts in this story has nobody counted yet?',
        'Say the story aloud as a sentence with a gap in it. Then find the written sentence whose gap sits in the same place.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's error, exactly: 12 ÷ 3 answered 36. The verify template supplies
// the honest pair over ONE operand pair — the truth is the quotient, the shown
// value is the genuine product of the same two numbers — so nothing is
// fabricated. What makes it this week's item rather than C9's: the student has
// the right two numbers, in the right order, and has read the division sign as
// the family's other move. There is no slip in the working to find.
// ---------------------------------------------------------------------------

const eaMultipliedTheFamily = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const b = r.pick([3, 4, 5] as const);
    const q = r.int(3, 9);
    return { a: b * q, b, op: '/', wrongOp: '*' };
  },
  build: (v, p) => ({
    prompt: `A wildlife group has ${countNoun(Number(p.a), 'nesting boxes')} to put up. ${countNoun(Number(p.b), 'boxes')} go on each tree. Asked how many trees the group will need, a student wrote ${p.a} ÷ ${p.b} = ${v.wrong}.`,
    extension: 'Work out how many trees the group really needs. Then write one sentence about what the student did.',
    hints: [
      'Could hanging boxes on trees ever call for more trees than there are boxes?',
      'Draw the trees and hang the boxes on them. Then hold your count beside the number on the page.',
    ],
    errorTags: ['concept-misconception', 'fact-recall'],
  }),
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC10 = makeWeekBuilder({
  level: 'C',
  week: 10,
  conceptId: 'fact-families-mul-div',
  conceptName: 'Fact families ×/÷',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [C6, C8, C9],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the part-part-whole triangle',
  conceptFamily: 'operation',
  deepeningDelta:
    'B8 built fact families out of adding and taking away, where the three numbers sit in a line: two parts side by side and a whole across them. C10 rebuilds the same idea on a relationship that is not a line — the whole here is what the parts MAKE, not what they add up to — and adds the move B8 had no need of: with one bottom corner covered, the answer is a factor nobody has counted, and it is reached by dividing. C6 and C9 met the two operations one at a time; this is the week they stop being two.',
  explanation: {
    hook:
      'Three numbers — 4, 5 and 20 — and they will not leave each other alone. Turn them one way and they multiply. Turn them the other way and they divide. This week we meet the whole family at once. We learn which of its four sentences you can answer.',
    whyBeforeHow:
      'Two numbers multiplied together make a third. That is the only link the three of them have. That is why they fit into the part-part-whole triangle. One drawing, read four different ways. The bottom corners are the parts. The top corner is the whole those parts make. Which corner is covered decides everything. Cover the top and both parts are in your hands. So you put them together and multiply. Cover a bottom corner and you hold the whole and one part. Now the whole has to be broken up. Breaking a whole into equal parts is a division. That is why a missing factor is never a new kind of question. It is a division wearing a multiplication sign.',
    script: [
      {
        say: 'Watch me build one family from nothing. I lay out four counters in a row. Then another row of four. I keep going until there are five rows. Four, eight, twelve, sixteen, twenty. Three numbers came out of that: four, five and twenty. Every sentence I write next uses those three and nothing else.',
        visual: 'Five rows with four counters in each row.',
        figure: areaGrid(
          { rows: 5, cols: 4, rowLabels: ['4', '4', '4', '4', '4'] },
          { alt: 'five rows with four counters in each row, twenty counters in all' },
        ),
      },
      {
        say: 'Now the triangle. Twenty goes at the top, because twenty is what the other two made. Four and five go in the bottom corners. Cover the top corner and the two parts are still showing. So I put them together: 4 × 5 = 20. Turn the row the other way and I get 5 × 4 = 20. One covered corner, two sentences.',
        visual: 'A bar of twenty built from five equal parts of four.',
        figure: barModel(
          [
            {
              label: 'four, five times over',
              segments: [{ value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }],
              total: '20',
            },
          ],
          { scaleMax: 20, alt: 'a bar of twenty built from five equal parts of four' },
        ),
      },
      {
        say: 'Now I cover a bottom corner instead. What is left showing is twenty and five — the whole, and one of its parts. I cannot put those two together. Twenty fives would be an enormous number. The part I am hunting has to be smaller than twenty, not bigger. So the whole gets broken up into parts of five: 20 ÷ 5 = 4. Cover the other bottom corner and exactly the same move gives 20 ÷ 4 = 5.',
        visual: 'The same twenty counters with a single row of four marked off.',
        figure: areaGrid(
          { rows: 5, cols: 4, shadedRows: 1 },
          { alt: 'five rows of four counters with the first row marked off as one part' },
        ),
      },
      {
        say: 'One habit before I write any family sentence down. I check the size I am expecting. If I am hunting the top corner, my answer must be the biggest. If it is a bottom corner, my answer must be smaller than the top. An answer that breaks that is not telling me I counted badly. It is telling me I reached for the wrong move.',
        visual: 'The whole bar of twenty above a single part of four, drawn to the same scale.',
        figure: barModel(
          [
            { label: 'the whole', segments: [{ value: 20, label: '20' }] },
            { label: 'one part', segments: [{ value: 4, label: '4', fill: 'hatch' }] },
          ],
          { scaleMax: 20, alt: 'a long bar of twenty above a short bar of four, drawn to the same scale' },
        ),
      },
    ],
    summary:
      'One triple, four sentences. The two bottom corners multiply to make the top corner. Divide the top corner by either bottom corner and you get the other one. Read a story for the corner that is covered. If it is the top, multiply the parts. If it is a bottom corner, you are hunting a missing factor. A missing factor is found by dividing. Check any answer by multiplying the two smaller numbers back up.',
    vocabulary: [
      { term: 'fact family', kidGloss: 'the four number sentences that three numbers make together' },
      { term: 'fact triangle', kidGloss: 'the three numbers drawn in their corners: parts at the bottom, whole at the top' },
      { term: 'factor', kidGloss: 'one of the two numbers in a bottom corner' },
      { term: 'missing factor', kidGloss: 'a bottom corner nobody has told you — find it by dividing' },
    ],
  },
  guidedExamples: [
    {
      ...ge(10, 1, 'modeled', 'The bottom corners of a fact triangle show 4 and 5. What number belongs in the top corner?', [
        {
          teacherSay:
            'Watch which way I read this triangle first. Both bottom corners are showing. The bottom corners are the parts. So the number I am missing is the one they build together. I already have everything I need in my hands.',
        },
        {
          teacherSay: 'So I lay out a row of four, and another, until there are five rows. Four, eight, twelve… where does the fifth row leave me?',
          expected: '20',
        },
      ], '20'),
      visual: 'Five rows with four counters in each row.',
      figure: areaGrid(
        { rows: 5, cols: 4, rowLabels: ['4', '4', '4', '4', '4'] },
        { alt: 'five rows with four counters in each row', asserts: { of: 'cells', ...assertsAnswer } },
      ),
    },
    {
      ...ge(10, 2, 'completion', 'A fact triangle shows 30 at the top and 5 in one bottom corner. What number is hidden under the other bottom corner?', [
        { teacherSay: 'Which of these two numbers is the whole that the other two make?', expected: '30' },
        { childDo: 'Break that whole into parts the size of the corner you can see. Count the parts.', expected: '6' },
      ], '6'),
      visual: 'A bar of thirty split into six equal parts of five.',
      figure: barModel(
        [
          {
            label: 'the whole',
            segments: [{ value: 5 }, { value: 5 }, { value: 5 }, { value: 5 }, { value: 5 }, { value: 5 }],
            total: '30',
          },
        ],
        { scaleMax: 30, alt: 'a bar of thirty split into six equal parts of five' },
      ),
    },
    ge(10, 3, 'prompted', '32 lanterns are strung above the square in equal rows. Every row holds 4 lanterns. How many rows of lanterns are there?', [
      { childDo: 'Say which of the two numbers counts every lantern there is, before you calculate anything.', expected: '8' },
    ], '8'),
    {
      // Independent stage: ONE box only. Deciding to build the whole before
      // breaking it up IS the task here, so drawing the beds would hand the
      // child the plan the item exists to ask for.
      ...ge(10, 4, 'independent', '5 boxes of tombola prizes hold 4 prizes each. Every prize is then packed into a gift hamper, and one hamper takes 2 prizes. How many hampers are made up? Solve cold.', [
        { childDo: 'Build the whole first, then break the whole into the new size.', expected: '10' },
      ], '10'),
      visual: 'One box holding four prizes. The other boxes and the hampers are yours to work out.',
      figure: counters(4, 'prizes', { alt: 'one box holding four tombola prizes' }),
    },
  ],
  days: [
    // Day 1 — concept echo: the three corners, one item each, single-step only.
    // Both warm-ups come from the two weeks this one joins together.
    [
      { gen: wAdd, diff: 2 },
      { gen: wCorridor, diff: 2 },
      { gen: wBundles, diff: 2 },
      { gen: sitMarinaPontoons, diff: 2 },
      { gen: sitJugglerBeanbags, diff: 3 },
      { gen: sitLanternRows, diff: 3 },
    ],
    // Day 2 — fluency + application: both discriminations arrive, the check-back
    // metacognition (which is itself the family's fourth sentence), and the first
    // two-step.
    [
      { gen: wSub, diff: 2 },
      { gen: discrimCompleteFamily, diff: 3 },
      { gen: discrimBoxPlacement, diff: 3 },
      { gen: sitTrackPiecesCheck, diff: 3 },
      { gen: msPrizesThenHampers, diff: 4 },
      { gen: sitMarinaPontoons, diff: 3 },
    ],
    // Day 3 — interleave: the two discriminations swap order against the
    // inverse-start two-step, so the page shape never signals which corner is
    // covered next.
    [
      { gen: wCorridor, diff: 2 },
      { gen: discrimBoxPlacement, diff: 4 },
      { gen: discrimCompleteFamily, diff: 4 },
      { gen: msRailsThenSome, diff: 4 },
      { gen: sitLanternRows, diff: 3 },
      { gen: sitRecorderPriceEstimate, diff: 3 },
    ],
    // Day 4 — word problems: three two-steps (one inverse-start, one carrying a
    // quantity to leave alone) beside the two metacognition-carrying stories.
    [
      { gen: msPrizesThenHampers, diff: 4 },
      { gen: msRailsThenSome, diff: 5 },
      { gen: msRosettesWithSpare, diff: 5 },
      { gen: sitTrackPiecesCheck, diff: 4 },
      { gen: sitRecorderPriceEstimate, diff: 3 },
    ],
    // Day 5 — non-computational: the multiplied-a-division error-analysis, the
    // write-the-family production that names the week's algebra idea, and the
    // claim that fixes where the biggest number of a family may stand.
    [
      { gen: wBundles, diff: 2 },
      { gen: eaMultipliedTheFamily, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'A fact triangle has 30 at the top and 5 in one bottom corner. Write all four number sentences this triangle makes. Then cover the 5 as well. Write one sentence explaining why a covered bottom corner is always found by dividing. Never by multiplying.',
          value: 'a covered bottom corner is a missing factor; what is left showing is the whole and one part, so the whole has to be broken up, and that is a division',
          acceptableForms: ['divide', 'division', 'missing factor', 'break', 'the whole', 'part', 'smaller'],
          keywords: true,
          hints: [
            'Which corner of a triangle holds the biggest of the three numbers?',
            'Try both moves on the two numbers still showing. Which one could land on something smaller than the whole?',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? Build a fact family from two numbers, each bigger than one. The biggest of the three numbers can answer one of the family\'s division sentences. In one sentence, explain how you know.',
          correct: 'never',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Treats the three numbers as interchangeable, when the biggest one is the whole the other two build and can only stand at the front of a division.',
            },
            {
              text: 'sometimes',
              errorTag: 'representation-misread',
              rationale: 'Leaves room for a division that hands back more than it was given, which breaking an amount into equal parts cannot do.',
            },
          ],
          hints: [
            'Where does the biggest number of a family sit in the triangle?',
            'Write out both division sentences of a family you know well. Look at which number lands after the equals sign.',
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
    'For grown-ups: the four sentences are not four facts to learn — they are one fact asked four ways, and a child who sees that has halved what there is to remember. When a division stalls at home, do not reach for the division. Ask "what times what makes this number?" — that is the same question, and it is usually the one your child can already answer.',
  ],
  puzzle: (r) => {
    // The family that comes out short. When both bottom corners hold the same
    // number, two of the four sentences become twins and only two survive — an
    // honest edge of the week's own rule, which is why explaining it proves the
    // rule is understood rather than memorised. Deterministic: one draw picks
    // the worked example, and the answer is every other square below a hundred.
    const shown = r.pick(SMALL_TAUGHT);
    const others = [2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== shown);
    const triples = others.map((n) => `${n}, ${n} and ${n * n}`);
    const name = one(r);
    return {
      id: 'C10-PZ-01',
      title: 'Puzzle Grove: The Family That Came Up Short',
      puzzleType: 'pattern',
      prompt: `A fact family normally gives four different number sentences. ${name} builds one from ${shown}, ${shown} and ${shown * shown}. ${name} writes carefully and ends up with only two. Explain why this family comes up short. Then find two more triples below a hundred that do the same.`,
      answer: {
        value: triples.join('; '),
        acceptableForms: triples,
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'What has to be true about the two bottom corners here?',
        'Write the four sentences out for a family you know well. Now put the same number into both bottom corners. See which sentences become twins.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    // factorRange [2,5]: mult_facts_v1 draws BOTH factors from this range, so
    // [2,10] served ×6-×9 facts first taught in C11/C12 — a forward leak into a
    // timed sprint (FACT FIDELITY, header). [2,5] keeps every servable fact
    // inside the C7/C8 taught set.
    skill: 'Multiplication facts to five — the products a missing factor searches',
    sourceWeek: C8,
    itemCount: 16,
    scheduledDay: 2,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 5] },
  },
  mastery: [
    { gen: sitMarinaPontoons, diff: 3 },
    { gen: msPrizesThenHampers, diff: 3 },
    { gen: sitJugglerBeanbags, diff: 3 },
    { gen: msRailsThenSome, diff: 4 },
    { gen: sitLanternRows, diff: 3 },
    { gen: msRosettesWithSpare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step family members — one with the TOP corner covered (both parts given) and two with a BOTTOM corner covered (the whole and one part given, a missing factor wanted), with the one-group figure affordance preserved. 02/04/06: two-step families — build the whole then repack it at a new group size, an inverse-start whose first move is the division that undoes the stated total, and one carrying a quantity that never enters the working. Operand surfaces are drawn fresh per slot but uniqueness is NOT enforced across forms or days; where a fact space is small, a mastery item can coincide with the operands of a daily item.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'multiplied-a-missing-factor',
      description: 'Reaches for the family\'s multiply when the covered corner is a bottom one, so the two numbers given are multiplied together instead of the whole being broken up.',
      exampleWrongAnswer: '12 ÷ 3 answered as 36',
      distractorRationale: 'Offer the product of the two stated numbers on any item whose covered corner is a factor.',
      reteachPointer: 'explanation/script[2] (the part you are hunting has to be smaller than the whole, so the whole gets broken up)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'corners-swapped',
      description: 'Puts the whole into a bottom corner, or a part at the top, so a division starts from the wrong number and the answer names a quantity the family cannot hold.',
      exampleWrongAnswer: '20 ÷ 4 = 5 written as 4 ÷ 20 = 5',
      distractorRationale: 'Offer the division written the other way round, starting from a part instead of the whole.',
      reteachPointer: 'explanation/script[1] (the top corner is what the other two made; the bottom corners are the parts)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-a-number-already-given',
      description: 'Reports a quantity the story already stated — the whole, or the size of one group — rather than the corner the question left uncovered, or stops after the first half of a two-step family.',
      exampleWrongAnswer: 'a "how many rows?" story answered with the number of lanterns in a row',
      distractorRationale: 'Offer a number the story genuinely states, but not the one the question is missing.',
      reteachPointer: 'guidedExamples/C10-GE-02 (name which number is the whole before working anything out)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'family-reached-but-fact-slips',
      description: 'Picks the right corner and the right move, then lands one group out because the multiplication fact underneath it is not yet automatic.',
      exampleWrongAnswer: '30 ÷ 5 answered as 7',
      distractorRationale: 'Offer the factor that is one group off the true one.',
      reteachPointer: 'guidedExamples/C10-GE-01 (say the running total aloud once per row), then the 2-minute multiplication sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Fact families for × and ÷ — how three numbers sit in one triangle with the two factors at the bottom and their product at the top, how covering a different corner gives you a different one of the family\'s four sentences, and why a missing factor is found by dividing.',
    improvingCandidates: [
      'naming which corner of the triangle a story has covered before choosing a sign',
      'reading a story for the number nobody has counted yet',
      'checking an answer by building the whole back up from the parts',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reaching for the divide when the missing number is a factor — the size of the answer settles it in seconds',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping the whole at the top of the triangle and the parts at the bottom, so a division starts from the right number',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the corner that was actually left uncovered, including the second half of a two-step story',
      },
    ],
    homeFocus: {
      praiseLine:
        'You said which corner of the triangle was covered before you chose a sign, and then you checked your answer by building the whole back up — naming the covered corner is the move this whole week rests on.',
      questionForChild: 'If 4 and 5 sit in the bottom corners of a triangle, what is at the top — and if I covered the 4 instead, what would you do to get it back?',
      schoolSyncHook: 'If your child\'s class draws these as triangles, as number bonds, or as a box in an equation, tell us and we will match the form they use.',
    },
    vocabularyForParent: [
      'fact family (the four sentences three numbers make together)',
      'factor (one of the two numbers that multiply to make the product)',
      'missing factor (a factor nobody has told you — found by dividing)',
    ],
  },
});
