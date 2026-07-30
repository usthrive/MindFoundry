/**
 * Level C · Week 9 — "Meeting division" (conceptId: meeting-division).
 *
 * FILL-ARCHITECTURE §5 row C9: anchor "sharing vs grouping — two meanings";
 * multi-step "share then leftover"; error-analysis "12 ÷ 3 = 9 (take 3 away)";
 * discrimination "sort a sharing story from a grouping story"; Day-5 signature
 * "write one story of each meaning".
 *
 * The duality IS the week, not a footnote, so the content is built to make the
 * child commit to a meaning before any arithmetic happens:
 *  - every computational item is posed so that ONE of the two facts is given and
 *    the other is wanted — sharing hands you the number of groups, grouping hands
 *    you the size of a group — and the hint ladders name that choice, never the
 *    operation;
 *  - two discriminations carry the content rather than decorate it: a cross-op
 *    trap whose distractor IS the take-away misconception the Day-5 error-analysis
 *    then shows worked, and a structural SORT that asks a story to name itself
 *    ("a grouping story… so the answer counts the bags");
 *  - five genuine two-step items — share then the leftover, group then more
 *    groups, one `inverse-start` whose stated quantity is the RESULT of the
 *    sharing (so the opening move is the multiply that undoes it), and one
 *    carrying a quantity that must be left alone;
 *  - a Day-5 production that writes one story of EACH meaning for a single
 *    division, and an Always/Sometimes/Never that gives the two meanings their
 *    honest hearing: the number is always the same, what it counts never is.
 *
 * FACT FIDELITY: divisors and group sizes are drawn from {2, 3, 4, 5, 10} only.
 * C7 taught ×2/×5/×10 and C8 taught ×3/×4; ×6–×9 arrive in C11/C12. A division
 * whose fact the child has not met yet would make this week a fact-recall week by
 * accident, and the meanings — the actual content — would be what got dropped.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7, §E2.5): the two meanings have two
 * different honest pictures, and that is itself the lesson. A GROUPING story can
 * show ONE group and assert its SIZE (the given), because the size is what the
 * story hands over; a SHARING story cannot — the size of a share is exactly the
 * answer — so it shows the undivided WHOLE and asserts the total. No day item's
 * picture performs the split. The pictures that do show a completed division live
 * where the answer is already on the page: the lesson script and the guided
 * examples.
 *
 * Retrieval is backward-only into C3/C4 (± within 1,000), C6 (equal groups — the
 * multiplication this week undoes) and C7 (counting in equal steps, the fastest
 * honest route to a quotient).
 */

import { addWhole, asWarmup, classify, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor, wholeMoney } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswerOf, assertsParam, barModel, counterGroups, counters, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C6 = { level: 'C' as const, week: 6 };
const C7 = { level: 'C' as const, week: 7 };
const C8 = { level: 'C' as const, week: 8 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/**
 * The divisors and group sizes this week is allowed to use — the facts C6–C8
 * have actually taught. See the FACT FIDELITY note in the header.
 */
const TAUGHT = [2, 3, 4, 5, 10] as const;
/** The subset that reads naturally as "a few friends / a few containers". */
const SMALL_TAUGHT = [2, 3, 4, 5] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep / discrimination) have no figure
// slot, and lib/ is not ours to edit, so this wrapper does what `withEstimateFirst`
// does: it works entirely inside the returned closure, takes no new rng draw, and
// leaves the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It
// reads the drafted item's `generator.params` — the very numbers the answer was
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
const wAdd = asWarmup(addWhole(118, 462), C3);
/** C4 — subtraction within 1,000. */
const wSub = asWarmup(subWhole(134, 908), C4);

/**
 * C6 — equal groups, in its array form. This is the exact multiplication every
 * division this week undoes, so it is the warm-up that earns its place: the
 * child rebuilds the picture on Monday that gets taken apart on Tuesday.
 */
const wPanes = asWarmup(
  situation({
    situationType: 'area',
    cognitiveOp: 'mul',
    draw: (r) => {
      const rows = r.int(2, 6);
      const cols = r.pick(TAUGHT);
      return {
        prompt: `A tall window is made of ${countNoun(rows, 'rows')} of glass panes, with ${countNoun(cols, 'panes')} in every row. How many panes are in the window?`,
        answerValue: String(rows * cols),
        templateId: 'd_mul_v1',
        params: { a: rows, b: cols },
        units: 'panes',
        hints: [
          'Are all the rows in this window the same size, or does one of them differ?',
          'Find what a single row holds, then build the window up one whole row at a time.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  C6,
);

/** C7 — counting in equal steps, the fastest honest route to a quotient. */
const wCountOn = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add',
    draw: (r) => {
      const step = r.pick([2, 5, 10] as const);
      const k = r.int(3, 7);
      const name = one(r);
      return {
        prompt: `${name} is counting in ${step}s and has just said ${step * (k - 1)}. Which number does ${name} say next?`,
        answerValue: String(step * k),
        templateId: 'd_multiple_v1',
        params: { base: step, k },
        hints: [
          'Is this count going up by the same amount every time, or by a changing one?',
          'Say the count aloud from its beginning and carry it one step past where it stopped.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  C7,
);

// ---------------------------------------------------------------------------
// SHARING — the number of groups is given, the size of a share is wanted.
// The picture can only show the undivided whole (see the FIGURE LAW note).
// ---------------------------------------------------------------------------

const sitShareCards = withFigure(
  situation({
    situationType: 'sharing',
    cognitiveOp: 'div-share',
    draw: (r) => {
      const players = r.pick(SMALL_TAUGHT);
      // ONE draw, over a range derived from the player count already drawn, so
      // the pile is never token-sized however few players there are: dealing 9
      // cards between 3 is as thin a share as dealing 6 between 2.
      const each = r.int(Math.max(3, Math.ceil(15 / players)), 10);
      const total = players * each;
      const name = one(r);
      return {
        prompt: `[image: the whole pile of ${countNoun(total, 'cards')}, not yet dealt] ${name} deals ${countNoun(total, 'picture cards')} out equally between ${countNoun(players, 'players')}. How many cards does one player get?`,
        answerValue: String(each),
        templateId: 'd_div_v1',
        params: { a: total, b: players },
        units: 'cards',
        hints: [
          'Does this story tell you how many players there are, or how many cards one player ends up with?',
          'Deal the pile out one card to each player at a time, and count what a single player is holding when the pile runs out.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) =>
    barModel(
      [{ label: 'the whole pile', segments: [{ value: numOf(p, 'a'), label: String(numOf(p, 'a')) }] }],
      {
        alt: `one bar for the whole pile of ${countNoun(numOf(p, 'a'), 'cards')}, not yet split into shares`,
        asserts: assertsParam('a'),
      },
    ),
);

/** Sharing carried in money: identical items, a total price, one price wanted. */
const sitPaintPots = situation({
  situationType: 'rate',
  cognitiveOp: 'div-share',
  draw: (r) => {
    const pots = r.pick(SMALL_TAUGHT);
    // A two-pot set has to be worth boxing; below that the "price of the whole
    // set vs price of one pot" question stops having two plausible answers.
    const each = r.int(pots === 2 ? 5 : 3, 9);
    const name = one(r);
    return {
      prompt: `${name} buys a boxed set of ${countNoun(pots, 'paint pots')} for ${wholeMoney(pots * each)}. Every pot in the set costs the same. How much does one pot cost?`,
      answerValue: String(each),
      templateId: 'd_div_v1',
      params: { a: pots * each, b: pots },
      units: 'dollars',
      // Whole dollars everywhere in this item, so the accepted forms are stated
      // rather than left to the money default (which would print cents beside a
      // bare-dollar prompt).
      acceptableForms: [wholeMoney(each)],
      hints: [
        'Which price does this story give you — the price of the whole set, or the price of one pot?',
        'Split the set price into as many equal parts as there are pots, and read off one part.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * Sharing that does not come out even. C9 meets the leftover as a plain fact of
 * fair sharing — what is still in your hand — and stops there; the "q R r"
 * notation and the four interpretations belong to D6/D7.
 */
const sitLeftover = situation({
  situationType: 'sharing',
  cognitiveOp: 'div-leftover',
  draw: (r) => {
    const friends = r.pick([3, 4, 5] as const);
    const each = r.int(3, 8);
    const over = r.int(1, friends - 1);
    const name = one(r);
    return {
      prompt: `${name} shares ${countNoun(friends * each + over, 'conkers')} equally between ${countNoun(friends, 'cousins')}, handing out as many as can be given fairly. How many conkers are left in ${name}'s hand?`,
      answerValue: String(over),
      templateId: 'd_interpret_rem_v1',
      params: { a: friends * each + over, b: friends, mode: 'remainder' },
      units: 'conkers',
      hints: [
        'Is the question asking what each cousin ends up with, or what nobody could take?',
        'Hand them out in full rounds, and stop the moment there are too few for another full round.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// GROUPING — the size of a group is given, the number of groups is wanted.
// Here the picture CAN show one group and assert its size (kit §E2.5).
// ---------------------------------------------------------------------------

const sitGroupTubes = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'div-group',
    draw: (r) => {
      const perTube = r.pick([3, 4, 5] as const);
      const tubes = r.int(4, 9);
      const name = one(r);
      return {
        prompt: `[image: one full tube holding ${countNoun(perTube, 'balls')}] ${name} packs ${countNoun(perTube * tubes, 'tennis balls')} into tubes, and every tube holds ${countNoun(perTube, 'balls')}. How many tubes does ${name} fill?`,
        answerValue: String(tubes),
        templateId: 'd_div_v1',
        params: { a: perTube * tubes, b: perTube },
        units: 'tubes',
        hints: [
          'Does this story tell you how many tubes there are, or how many balls one tube holds?',
          'Fill one tube, then keep filling tubes that size until the balls run out, and count the tubes you filled.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'b'), 'balls', {
      alt: `one full tube holding ${countNoun(numOf(p, 'b'), 'balls')}`,
      asserts: assertsParam('b'),
    }),
);

/** Grouping measured along a LENGTH rather than counted out of a pile. */
const sitRibbonBows = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'div-group',
    draw: (r) => {
      const piece = r.pick([3, 4, 5, 10] as const);
      const parcels = r.int(4, 9);
      return {
        prompt: `[image: one parcel length of ${countNoun(piece, 'cm')} marked at the start of a tape] A florist has a ribbon ${countNoun(piece * parcels, 'cm')} long and cuts it into equal pieces, one for each parcel. Every piece is ${countNoun(piece, 'cm')} long. How many parcels can be tied?`,
        answerValue: String(parcels),
        templateId: 'd_div_v1',
        params: { a: piece * parcels, b: piece },
        units: 'parcels',
        hints: [
          'Which length does this story hand you — the whole ribbon, or the piece one parcel needs?',
          'Lay the piece length along the ribbon again and again, and count how many times it fits before the ribbon ends.',
        ],
        errorTags: ['representation-misread', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const piece = numOf(p, 'b');
    // The tape's length depends ONLY on the piece length (never on how many
    // pieces there are), so the ruler cannot leak the count the item asks for.
    const max = 10 * Math.ceil((piece * 6) / 10);
    return numberLine(
      {
        min: 0,
        max,
        step: 5,
        labels: 'majors',
        marks: [{ at: piece, label: String(piece), style: 'flag' }],
        hops: [{ from: 0, to: piece, label: 'one parcel' }],
      },
      {
        alt: `a tape from 0 to ${max} with one parcel length of ${countNoun(piece, 'cm')} marked from 0`,
        asserts: assertsParam('b', 'mark:0'),
      },
    );
  },
);

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so the
 * generator is never drawn twice with the same hint ladder (kit §E2.2).
 *
 * The probe is a genuine call: whether there are more groups than there are
 * things in a group flips with the numbers, so it cannot be answered by reflex —
 * and answering it is exactly the size-sense a first division week is for.
 */
const sitPhotoPages = situation({
  situationType: 'rate',
  cognitiveOp: 'div-group',
  draw: (r) => {
    const perPage = r.pick([3, 4, 5, 10] as const);
    const pages = r.int(4, 9);
    const name = one(r);
    return {
      prompt: `${name} has ${countNoun(perPage * pages, 'photos')} for an album. Each page holds ${countNoun(perPage, 'photos')}, and every page is filled right up. How many pages does ${name} use?`,
      answerValue: String(pages),
      templateId: 'd_div_v1',
      params: { a: perPage * pages, b: perPage },
      units: 'pages',
      hints: [
        'Is the number this story repeats the number of pages, or the number of photos on one page?',
        'Fill one page, then count on in that page-size until every photo has a home.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const sitPhotoPagesEstimate = withEstimateFirst(
  sitPhotoPages,
  'will there be more pages than there are photos on one page, or fewer?',
);

// ---------------------------------------------------------------------------
// Multi-step: "share then leftover" (the C9 recipe row) and its three siblings
// ---------------------------------------------------------------------------

/**
 * The recipe's own shape. The equal shares are made first; the pegs that never
 * made it into the sharing are dealt with afterwards, and they land in ONE bag —
 * so the question is about a single share, not about the whole.
 */
const msShareThenLeftover = multiStep({
  situationType: 'sharing',
  draw: (r) => {
    const bags = r.pick(SMALL_TAUGHT);
    const each = r.int(Math.max(3, Math.ceil(12 / bags)), 9);
    // The loose pegs must not amount to another whole share: "shares 8 into each
    // bag, then adds 8 more" reads as an extra bag, which blurs exactly the
    // boundary this item exists to draw.
    let loose = r.int(2, 9);
    if (loose === each) loose = each === 2 ? 3 : each - 1;
    const name = one(r);
    return {
      prompt: `${name} shares ${countNoun(bags * each, 'tent pegs')} equally between ${countNoun(bags, 'kit bags')}. The ${countNoun(loose, 'tent pegs')} still rolling about in the car boot then all go into one of those bags. How many tent pegs are in that bag?`,
      initN: bags * each,
      steps: [
        { op: 'div', n: bags, d: 1 },
        { op: 'add', n: loose, d: 1 },
      ],
      units: 'tent pegs',
      hints: [
        'Which bag is the last question about — all of them, or the one the loose pegs went into?',
        'Make the equal shares first; the loose ones only join in once the sharing is finished.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/** The grouping sibling: make the groups, then more groups arrive. */
const msGroupThenMore = multiStep({
  situationType: 'part-whole',
  draw: (r) => {
    const perTeam = r.pick([3, 4, 5] as const);
    const teams = r.int(4, 8);
    // The arriving count must not print the same numeral as the team size, or
    // the sentence reads as though the teams arrived one player at a time.
    let extra = r.int(2, 4);
    if (extra === perTeam) extra = perTeam === 4 ? 2 : 4;
    return {
      prompt: `A club has ${countNoun(perTeam * teams, 'players')}. The coach puts them into teams of ${countNoun(perTeam, 'players')}. Then ${countNoun(extra, 'teams')} travel in from a club across town. How many teams play in the tournament?`,
      initN: perTeam * teams,
      steps: [
        { op: 'div', n: perTeam, d: 1 },
        { op: 'add', n: extra, d: 1 },
      ],
      units: 'teams',
      hints: [
        'What does the first sentence give you — how many teams there are, or how big a team is?',
        'Build the teams from the players first, then add the ones that arrive already built.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3; the ceiling C5 lifted). The
 * quantity the story hands over — what one pot ended up holding — is the RESULT
 * of the sharing, so the opening move is the multiply that undoes it. This is
 * the item that makes ÷ and × the same fact seen from two ends, which is what
 * C10 will name outright.
 */
const msInverseShare = multiStep({
  situationType: 'multi-stage',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const pots = r.pick(SMALL_TAUGHT);
    const each = r.int(Math.max(4, Math.ceil(12 / pots)), 9);
    const eaten = r.int(3, Math.min(8, pots * each - 2));
    const name = one(r);
    return {
      prompt: `${name} shared a bowl of cherries equally into ${countNoun(pots, 'pots')}, and every pot ended up holding ${countNoun(each, 'cherries')}. ${name} then ate ${countNoun(eaten, 'cherries')}. How many cherries are left in the pots?`,
      initN: pots,
      steps: [
        { op: 'mul', n: each, d: 1 },
        { op: 'sub', n: eaten, d: 1 },
      ],
      units: 'cherries',
      hints: [
        'Does this story tell you how many were in the bowl to start with, or only what one pot ended up holding?',
        'Rebuild the bowl from the pots first — that is the only way to reach a number the last sentence can act on.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Same two-step shape, posed with a quantity that is NOT used
 * (F3 `has-distractor`): every item in the corpus consuming every number it
 * states quietly teaches "use all the numbers", and children do learn it.
 */
const msCaseWithSpare = multiStep({
  situationType: 'multi-stage',
  posing: 'has-distractor',
  draw: (r) => {
    const cases = r.pick([3, 4, 5] as const);
    const each = r.int(4, 9);
    // Leave at least two behind: a case emptied to a single fossil reads as an
    // arithmetic accident rather than a museum.
    const lifted = r.int(2, each - 2);
    const others = r.int(6, 9);
    const name = one(r);
    return {
      prompt: `A museum has ${countNoun(cases * each, 'fossils')}. ${name} shares them equally between ${countNoun(cases, 'display cases')}, then lifts ${countNoun(lifted, 'fossils')} out of one case for a school visit. A poster by the entrance lists ${countNoun(others, 'other museums')} in the city. How many fossils are left in that case?`,
      initN: cases * each,
      steps: [
        { op: 'div', n: cases, d: 1 },
        { op: 'sub', n: lifted, d: 1 },
      ],
      units: 'fossils',
      hints: [
        'Every number here is counting something — which of them are counting fossils?',
        'Share out only what the question is about, then handle the case that was opened; one number never enters the working at all.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's point, forced as a CHOICE
// ---------------------------------------------------------------------------

const BOWL_SCENES = [
  { group: 'bowls', noun: 'grapes' },
  { group: 'jars', noun: 'buttons' },
  { group: 'nets', noun: 'oranges' },
  { group: 'trugs', noun: 'onions' },
] as const;

/**
 * The cross-op trap. The subtract option IS the output of the misconception the
 * Day-5 error-analysis then shows worked, so the two items are the same claim
 * met twice: once as a choice, once as somebody else's writing.
 */
const discrimWhichCalc = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-operation',
  draw: (r) => {
    const groups = r.pick(SMALL_TAUGHT);
    const each = r.int(Math.max(3, Math.ceil(12 / groups)), 10);
    const s = r.pick(BOWL_SCENES);
    const name = one(r);
    return {
      prompt: `${name} has ${countNoun(groups * each, s.noun)} and ${countNoun(groups, s.group)}. The same number of ${s.noun} goes into every ${unitFor(1, s.group)}. Which calculation finds how many ${s.noun} go into one ${unitFor(1, s.group)}?`,
      correct: `${groups * each} ÷ ${groups}`,
      distractors: [
        {
          text: `${groups * each} − ${groups}`,
          errorTag: 'concept-misconception',
          rationale: 'Takes the second number off the pile one single time, which removes a few items from the whole rather than splitting the whole into equal parts.',
        },
        {
          text: `${groups * each} × ${groups}`,
          errorTag: 'task-comprehension',
          rationale: 'Copies the whole pile that many times over, so the amount grows in a story that is breaking one amount up.',
        },
      ],
      hints: [
        'Does this story break one pile into equal parts, or take a piece off it once?',
        'Set the containers out empty, then deal the pile round them until nothing is left in your hand.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The recipe's discrimination: SORT the story. The two variants are the same
 * two numbers and the same total — only the role of the second number moves —
 * so the child cannot sort by arithmetic and has to read.
 */
const discrimSortStory = discrimination({
  variant: 'structural',
  cognitiveOp: 'sort-meaning',
  draw: (r) => {
    const size = r.pick([3, 4, 5] as const);
    const count = r.int(4, 9);
    const isGrouping = r.chance(0.5);
    const name = one(r);
    // ONE container noun across both variants on purpose: if the wrong option
    // only reads awkwardly ("the size of one table"), a child can reject it on
    // grammar and never do the sorting. Both options must be fluent either way,
    // so the only thing that separates them is the mathematics.
    const opening = isGrouping
      ? `${name} has ${countNoun(size * count, 'balloons')} and packs them into party bags with ${countNoun(size, 'balloons')} in every bag.`
      : `${name} has ${countNoun(size * count, 'balloons')} and shares them equally between ${countNoun(size, 'party bags')}.`;
    const grouping = 'a grouping story — it says how many balloons go in one bag, so the answer counts the bags';
    const sharing = 'a sharing story — it says how many bags there are, so the answer counts the balloons in one bag';
    return {
      prompt: `${opening} Which kind of division story is this?`,
      correct: isGrouping ? grouping : sharing,
      distractors: [
        {
          text: isGrouping ? sharing : grouping,
          errorTag: 'concept-misconception',
          rationale: 'Hands the stated number to the other role, swapping "how many groups there are" with "how big a group is" — the one move that changes what the answer counts.',
        },
        {
          text: 'either one — both numbers are there, so the story can be read whichever way you like',
          errorTag: 'task-comprehension',
          rationale: 'Treats the numbers as the whole story and the words as decoration, when the words are the only thing deciding which quantity the answer names.',
        },
      ],
      hints: [
        'Which fact does this story hand you outright — how many groups there are, or how big one group is?',
        'The fact you were NOT given is the one your answer will count; name it before you choose.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's error: division read as "take that number away". The verify
// template supplies the honest pair — the truth is the quotient, the shown wrong
// value is the genuine output of subtracting. What makes it the week's item:
// the student's SUBTRACTION is correct, so there is nothing to find by checking
// the digits, and the only way in is to ask what the story was doing.
// ---------------------------------------------------------------------------

const eaTakeAway = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  // q ≥ 3 keeps the misconception genuinely wrong: a − b equals a ÷ b only at
  // 4 ÷ 2, the single pair where taking away and sharing collide.
  drawParams: (r) => {
    const b = r.pick([3, 4, 5] as const);
    const q = r.int(3, 9);
    return { a: b * q, b, op: '/', wrongOp: '-' };
  },
  build: (v, p) => ({
    prompt: `A lunch club shares ${countNoun(Number(p.a), 'carrot sticks')} equally between ${countNoun(Number(p.b), 'lunch boxes')}. Asked how many carrot sticks go into one box, a student wrote ${p.a} − ${p.b} = ${v.wrong}.`,
    extension: 'Work out how many carrot sticks really go into one box, then write one sentence saying what the student did to the pile.',
    hints: [
      'If the student\'s move were the right one, would every box end up with the same amount?',
      'Draw the boxes and deal the sticks round them, then look again at what the student\'s move did to the pile.',
    ],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC09 = makeWeekBuilder({
  level: 'C',
  week: 9,
  conceptId: 'meeting-division',
  conceptName: 'Meeting division',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [C6, C7, C8],
  pedagogyContract: 'v2',
  conceptualAnchor: 'sharing and grouping — the two meanings',
  conceptFamily: 'operation',
  deepeningDelta:
    'C6–C8 built equal groups and then made the facts quick, always in the same direction: the number of groups and the size of a group were both given, and the total was wanted. C9 turns that around. One of the two is now missing, and which one is missing decides what the answer counts — so for the first time the child has to read a story for its structure before any fact can help.',
  explanation: {
    hook:
      '12 counters shared between 3 friends gives 4. 12 counters made into groups of 3 gives 4 again — and the two fours are not the same thing. One of them counts counters in a hand; the other counts the groups themselves.',
    whyBeforeHow:
      'A division story always holds two facts and asks you for the third, and because only ONE of those facts is ever handed to you, the same division sign ends up doing two different jobs. If the story tells you how many groups there are, you are sharing, and the answer counts what one group gets. If it tells you how big each group is, you are grouping, and the answer counts the groups. So we give the two jobs their own names: sharing and grouping — the two meanings a single division sign carries. The arithmetic is identical either way, which is exactly why the number can never tell you which story you are in; only the words can. Read for the fact you were given, and the meaning of your answer follows from it.',
    script: [
      {
        say: 'Watch me share. I have 12 counters and 3 plates, and I deal them out one at a time, round and round, until my hand is empty. Every plate ended up with 4. I knew how many plates there were before I started — what I did not know was how many counters one plate would hold.',
        visual: 'Three plates, each holding four counters.',
        figure: counterGroups(
          [
            { count: 4, noun: 'counters', label: 'plate' },
            { count: 4, noun: 'counters', label: 'plate' },
            { count: 4, noun: 'counters', label: 'plate' },
          ],
          { alt: 'three plates, each holding four counters' },
        ),
      },
      {
        say: 'Now the same 12 counters, and a different question. This time nobody tells me how many plates to use — I am told to make groups of 3 and keep going until the counters run out. I made 4 groups. Notice what changed: I was handed the SIZE of a group, and the number of groups is what I found.',
        visual: 'Four groups of three counters.',
        figure: counterGroups(
          [
            { count: 3, noun: 'counters', label: 'group' },
            { count: 3, noun: 'counters', label: 'group' },
            { count: 3, noun: 'counters', label: 'group' },
            { count: 3, noun: 'counters', label: 'group' },
          ],
          { alt: 'four groups of three counters' },
        ),
      },
      {
        say: 'Both times I wrote 12 ÷ 3, and both times the answer was 4. But the first 4 was counters sitting on one plate, and the second 4 was whole groups. Same number, different thing counted — and if I cannot say which one I am holding, I cannot answer the question that was asked.',
        visual: 'One bar of twelve split into three shares of four, above the same bar split into four groups of three.',
        figure: barModel(
          [
            { label: 'shared between 3 plates', segments: [{ value: 4, label: '4' }, { value: 4, label: '4' }, { value: 4, label: '4' }], total: '12' },
            { label: 'made into groups of 3', segments: [{ value: 3 }, { value: 3 }, { value: 3 }, { value: 3 }], total: '12' },
          ],
          { scaleMax: 12, alt: 'a bar of twelve split into three shares of four, above the same bar split into four groups of three' },
        ),
      },
      {
        say: 'One habit before I work any division out: I ask myself roughly how big the answer ought to be. Sharing 12 between 3 must give each plate less than 12 and more than 1 — so an answer of 9 would be far too large, and I would check my thinking rather than my counting. Then I check at the end by counting the groups back up: 4, 8, 12.',
        visual: 'A number line from zero to twelve with four equal jumps of three marked along it.',
        figure: numberLine(
          {
            min: 0,
            max: 12,
            step: 3,
            labels: 'majors',
            hops: [
              { from: 0, to: 3, label: 'one group' },
              { from: 3, to: 6 },
              { from: 6, to: 9 },
              { from: 9, to: 12 },
            ],
          },
          { alt: 'a number line from 0 to 12 with four equal jumps of three counted along it' },
        ),
      },
    ],
    summary:
      'Division splits an amount into equal parts. Read the story for the fact you were given: if you know how many groups, you are sharing and your answer counts what one group gets; if you know how big a group is, you are grouping and your answer counts the groups. Check by counting the groups back up to the total, and say out loud what your answer counts before you write it down.',
    vocabulary: [
      { term: 'division (÷)', kidGloss: 'breaking an amount into equal parts' },
      { term: 'sharing', kidGloss: 'you know how many groups — you work out how many are in one group' },
      { term: 'grouping', kidGloss: 'you know how big a group is — you work out how many groups there are' },
      { term: 'left over', kidGloss: 'what is still in your hand when no group can fairly take any more' },
    ],
  },
  guidedExamples: [
    {
      ...ge(9, 1, 'modeled', 'Pia deals 24 picture cards out equally between 4 players. How many cards does one player get?', [
        {
          teacherSay:
            'Watch what I hunt for first. The story hands me the number of players, so the thing I do not know is what one player ends up holding — that tells me I am sharing, and I can deal the cards out round and round until the pile is gone.',
        },
        {
          teacherSay: 'One card to each player uses 4 cards, so every full round costs me 4. How many full rounds can I deal before the pile runs out?',
          expected: '6',
        },
      ], '6'),
      visual: 'Four hands, each holding six cards.',
      figure: counterGroups(
        [
          { count: 6, noun: 'counters', label: 'player' },
          { count: 6, noun: 'counters', label: 'player' },
          { count: 6, noun: 'counters', label: 'player' },
          { count: 6, noun: 'counters', label: 'player' },
        ],
        { alt: 'four groups of six counters, one group for each player', asserts: assertsAnswerOf('group:0') },
      ),
    },
    {
      ...ge(9, 2, 'completion', 'A florist has 45 cm of ribbon and cuts it into equal pieces. Each parcel needs 5 cm. How many parcels can be tied?', [
        { teacherSay: 'Which of these two lengths is the size of ONE piece?', expected: '5 cm' },
        { childDo: 'Count up in that piece length until you reach the whole ribbon, and count how many jumps it took.', expected: '9' },
      ], '9'),
      visual: 'A tape from zero to forty-five with the first parcel length marked off.',
      figure: numberLine(
        {
          min: 0,
          max: 45,
          step: 5,
          labels: 'majors',
          marks: [{ at: 45, label: '45', style: 'flag' }],
          hops: [{ from: 0, to: 5, label: 'one parcel' }],
        },
        { alt: 'a tape from 0 to 45 with the first parcel length of 5 cm marked off from 0' },
      ),
    },
    ge(9, 3, 'prompted', 'Ben shares 29 conkers equally between 4 cousins, handing out as many as can be given fairly. How many conkers are left in his hand?', [
      { childDo: 'Hand them out in full rounds, then say what is still in your hand when another full round cannot be made.', expected: '1' },
    ], '1'),
    {
      // Independent stage: ONE team only. Deciding which meaning the first
      // sentence uses IS the task here, so drawing the other teams would hand
      // the child the very thing the item exists to ask for.
      ...ge(9, 4, 'independent', 'A club has 36 players. The coach puts them into teams of 4, and then 2 more teams travel in from a club across town. How many teams play in the tournament? Solve cold.', [
        { childDo: 'Decide which fact the first two sentences give you before you calculate anything.', expected: '11' },
      ], '11'),
      visual: 'One team of four players. The rest of the teams are yours to work out.',
      figure: counters(4, 'counters', { alt: 'four counters standing for the four players in one team' }),
    },
  ],
  days: [
    // Day 1 — concept echo: both meanings, three models, single-step only.
    [
      { gen: wAdd, diff: 2 },
      { gen: wPanes, diff: 2 },
      { gen: wCountOn, diff: 2 },
      { gen: sitShareCards, diff: 2 },
      { gen: sitGroupTubes, diff: 3 },
      { gen: sitRibbonBows, diff: 3 },
    ],
    // Day 2 — fluency + application: the cross-op trap, the estimate-first
    // metacognition, and the first "share then leftover" two-step. One warm-up
    // only, because every other format ran on Day 1 and a retrieval that
    // reappears the very next morning reads as a re-run, not a recall.
    [
      { gen: wSub, diff: 2 },
      { gen: discrimWhichCalc, diff: 3 },
      { gen: sitPhotoPagesEstimate, diff: 3 },
      { gen: msShareThenLeftover, diff: 4 },
      { gen: sitShareCards, diff: 3 },
      { gen: sitPaintPots, diff: 3 },
    ],
    // Day 3 — interleave: the SORT arrives beside the cross-op trap and a
    // grouping two-step, so the page shape never signals which meaning is next.
    [
      { gen: wCountOn, diff: 2 },
      { gen: discrimSortStory, diff: 3 },
      { gen: discrimWhichCalc, diff: 4 },
      { gen: msGroupThenMore, diff: 4 },
      { gen: sitGroupTubes, diff: 3 },
      { gen: sitLeftover, diff: 3 },
    ],
    // Day 4 — word problems: three two-steps (one inverse-start, one carrying a
    // quantity to leave alone) with two single-step stories mixed in.
    [
      { gen: msShareThenLeftover, diff: 4 },
      { gen: msInverseShare, diff: 5 },
      { gen: msCaseWithSpare, diff: 5 },
      { gen: sitRibbonBows, diff: 4 },
      { gen: sitPaintPots, diff: 3 },
    ],
    // Day 5 — non-computational: the take-away error-analysis, the write-one-of-
    // each production, and the claim that settles the two meanings honestly.
    [
      { gen: wAdd, diff: 2 },
      { gen: eaTakeAway, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'One division, two stories. Write a SHARING story for 30 ÷ 5 — a story where you already know there are 5 groups. Then write a GROUPING story for 30 ÷ 5 — a story where you already know each group holds 5. Work out both, then write one sentence saying what your answer counts in each of your stories.',
          value: 'a sharing story gives the number of groups, so the answer counts what one group gets; a grouping story gives the size of a group, so the answer counts the groups',
          acceptableForms: ['shares', 'shared', 'equally', 'groups of', 'how many groups', 'in each', 'one group'],
          keywords: true,
          hints: [
            'Which fact does a sharing story hand you before you start, and which fact does a grouping story hand you?',
            'Write the first story so the number of groups is already known, then write the second so the size of a group is already known.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: a sharing story and a grouping story built from the same two numbers land on the same answer. In one sentence, explain how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Hedges on something that holds for every pair of numbers — both stories set the same division going, and only the roles of the two numbers move.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads two different-looking pictures as two different totals, when the counting that produces them is the same counting.',
            },
          ],
          hints: [
            'Do the two stories set you the same calculation, or two different ones?',
            'Deal one pile out into equal shares, then count the same pile into groups of that size, and hold the two results side by side.',
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
    'For grown-ups: division does two jobs, and this week is about telling them apart. When your child gets a division story wrong, do not start with the number — ask "what will your answer count: how many in each group, or how many groups?" Nine times in ten the arithmetic was fine and the meaning was what slipped, and a child who can name what the answer counts can nearly always fix the rest alone.',
  ],
  puzzle: (r) => {
    // Deterministic construction, never a redraw loop (kit §E2.4): pick the two
    // leftovers, then solve for the one number below forty that produces both.
    // Sharing between 4 and between 5 pins a number to a 20-wide window, and the
    // puzzle's stated range is 19 wide — so exactly one number can work, which is
    // what makes the "how do you know none is missing" half answerable.
    const overFour = r.int(1, 3);
    const overFive = r.int(1, 4);
    let x = 1;
    for (let k = 1; k < 20; k++) {
      if (k % 4 === overFour && k % 5 === overFive) {
        x = k;
        break;
      }
    }
    const total = 20 + x;
    const name = one(r);
    return {
      id: 'C9-PZ-01',
      title: 'Puzzle Grove: The Leftover Clue',
      puzzleType: 'logic',
      prompt: `${name} has more than 20 acorns and fewer than 40. Shared equally between 4 friends, ${countNoun(overFour, 'acorns')} would be left over. Shared equally between 5 friends, ${countNoun(overFive, 'acorns')} would be left over. How many acorns does ${name} have, and how can you be sure that no other number in that range would work?`,
      answer: {
        value: String(total),
        acceptableForms: [countNoun(total, 'acorns')],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which numbers in that range would leave the right amount over when they are shared between the smaller group of friends?',
        'Write that short list out, then test each number on it against the second clue and see how few survive.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Multiplication facts ×2, ×5, ×10 — the facts every division undoes',
    sourceWeek: C7,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 10] },
  },
  mastery: [
    { gen: sitShareCards, diff: 3 },
    { gen: msShareThenLeftover, diff: 3 },
    { gen: sitGroupTubes, diff: 3 },
    { gen: msGroupThenMore, diff: 4 },
    { gen: sitRibbonBows, diff: 3 },
    { gen: msInverseShare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step division — one sharing story and two grouping stories (a count and a length), the three models the week teaches, with the whole-bar and one-group figure affordances preserved. 02/04/06: two-step division — share then the leftover, group then more groups, and an inverse-start story whose stated quantity is the result of the sharing. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'took-away-instead-of-shared',
      description: 'Reads a division as a take-away, subtracting the second number from the first once rather than breaking the whole amount into equal parts.',
      exampleWrongAnswer: '12 shared between 3 answered as 9',
      distractorRationale: 'Offer the result of subtracting the second stated number from the first.',
      reteachPointer: 'explanation/script[0] (the pile is dealt out round and round, never lifted off once)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'meanings-swapped',
      description: 'Swaps the two meanings — reads "groups of five" as "five groups" — so the answer names the wrong quantity even when the calculation is right.',
      exampleWrongAnswer: '40 balloons packed into party bags of 5 answered as "5 bags"',
      distractorRationale: 'Offer the reading that hands the stated number to the other role.',
      reteachPointer: 'explanation/script[2] (one story fixes how many groups, the other fixes how big a group is)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-a-quantity-the-story-gave',
      description: 'Reports a quantity the story already stated — the total, or the number of containers — rather than the one the question names, or stops before the second half of a two-step story.',
      exampleWrongAnswer: 'a "how many are left in your hand?" story answered with what each cousin received',
      distractorRationale: 'Offer a quantity the story really does state, but not the one the question asks for.',
      reteachPointer: 'guidedExamples/C9-GE-02 (name what the answer will count before working it out)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'lost-the-count',
      description: 'Chooses the right meaning, then loses the thread while dealing out or counting the groups up, landing one group over or one group short.',
      exampleWrongAnswer: '30 shared between 5 answered as 7',
      distractorRationale: 'Offer the share that is one group short.',
      reteachPointer: 'guidedExamples/C9-GE-01 (say the running total aloud once per round), then the 2-minute multiplication sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Meeting division — the two meanings one division sign carries. Sharing (you know how many groups, you find what one group gets) and grouping (you know how big a group is, you find how many groups), told apart in stories, plus what it means when some are left over.',
    improvingCandidates: [
      'naming what the answer will count before working a division out',
      'reading a story for the fact it gives you, rather than for the numbers',
      'counting the groups back up to the total as a check',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping division apart from taking away — dealing counters out onto plates settles it in seconds',
      },
      {
        errorTag: 'representation-misread',
        text: 'tracking which number is the size of a group and which one counts the groups',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was actually asked, including the second half of a two-step story',
      },
    ],
    homeFocus: {
      praiseLine:
        'You drew the groups before you counted, and you said out loud what your answer counted — the size of one share, or the number of shares — and naming that is the whole move this week is built on.',
      questionForChild: 'If 12 grapes are shared between 3 bowls, what does your answer count — and would the answer count something different if I had said "bowls of 3"?',
      schoolSyncHook: 'If your child\'s class writes this as 12 ÷ 3 or as a sharing picture, tell us and we will match the form they use.',
    },
    vocabularyForParent: [
      'sharing (how many groups is known — find what one group gets)',
      'grouping (how big a group is is known — find how many groups)',
      'left over (what is still in your hand when no group can fairly take more)',
    ],
  },
});
