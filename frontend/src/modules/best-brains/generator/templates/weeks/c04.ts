/**
 * Level C · Week 4 — "Subtraction within 1,000" (conceptId: subtraction-within-1000).
 *
 * FILL-ARCHITECTURE §5 row C4: anchor "breaking across a zero"; multi-step
 * "subtract, then check by adding back"; error-analysis "302 − 158, the borrow
 * across zero"; discrimination "where the borrow lands"; Day-5 signature
 * "error-hunt gallery".
 *
 * THE RISK THIS WEEK CARRIES, AND WHAT WAS DONE ABOUT IT. The concept IS the
 * written algorithm, so five pages of column subtractions in costume is the easy
 * failure. Depth here comes from WHERE the trade happens and WHY, so every
 * computational generator commits to a STRUCTURAL SITUATION rather than to a
 * noun, and the four situations are the week's real content:
 *   no trade at all · one trade in the ones · two trades with tens to spare ·
 *   a trade that has to travel across an empty tens column.
 * Two items ask the child to decide the structure BEFORE any arithmetic — a
 * discrimination that counts how many columns will have to be broken open, and
 * an estimate-first item whose probe is exactly that prediction — so "will this
 * need a trade?" is a question the child answers, not a step they perform.
 *
 * A WORDING TRAP WORTH RECORDING (found by reading the generated week, not by a
 * gate). The first draft of that prediction item asked "how much trading will
 * 601 − 462 need?", and that question has two defensible answers on precisely
 * the case the week exists for: two BREAKS (a hundred into ten tens, then a ten
 * into ten ones) but one CASCADE, begun at the ones. The arithmetic was right
 * and the question was not askable. Both discriminations are now phrased on
 * quantities that survive an empty column — how many columns are BROKEN OPEN,
 * and which is the FIRST place with something to lend. See `columnsBrokenOpen`.
 *
 * ERROR-ANALYSIS NOTE — how the recipe's misconception was reached HONESTLY
 * (kit §E2 trap 3; the same wall C13 and C17 hit). The named error is the
 * borrow across a zero: facing 302 − 158 a child takes the smaller digit from
 * the larger in every column and writes 256. No shipped verify template can
 * produce that number — `d_verify_binop_misconception_v1`, the only whole-number
 * truth returning a `wrong`, varies the OPERATION over one fixed operand pair —
 * and fabricating it was never an option (kit §F.1).
 *
 * There is, however, an identity that makes the misconception genuinely
 * computable. Take the minuend to be a whole number of hundreds, a = 100h, and
 * the subtrahend to be two digits, b = 10t + o. Then the column-by-column
 * smaller-from-larger flip writes o in the ones (|0 − o|), t in the tens
 * (|0 − t|) and h in the hundreds, giving 100h + 10t + o — which is exactly
 * a + b. So `{a: 100h, b: 10t + o, op: '-', wrongOp: '+'}` hands the item a
 * `correct` that is the true difference across TWO zeros and a `wrong` that is
 * precisely what the flip produces. Nothing is invented, both numbers are
 * re-derived by QG-11, and the round-hundred minuend is the purest form of the
 * recipe's case rather than a softer one. The item's prose names the three
 * digits the student wrote, so the working on the page is the flip and not an
 * addition read backwards.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7): every figure on a DAY ITEM
 * shows a quantity the prompt has already stated — the place-value chart of the
 * number being subtracted FROM (whose point is the empty column, not the
 * answer), the starting bar of a two-step story whose answer is two moves away,
 * the count a comparison begins from. Figures that show a whole journey — the
 * rename 703 = 600 + 90 + 13, the difference and the check that rebuilds the
 * start — live where the answer is already on the page: the lesson script and
 * the modeled/completion guided examples.
 *
 * DAY 5 IS A GALLERY, not one error twice. Exhibit one is the student who never
 * traded; exhibit two is a student whose subtraction is sound and whose CHECK
 * was run the wrong way, taking the same amount off a second time instead of
 * putting it back. Both `wrong` values are code-derived (see
 * `eaCheckedBySubtracting` for the second identity), the two hunts demand
 * different reasoning, and the two-methods page — column versus counting up —
 * then asks the child to judge rather than to find.
 *
 * `posing: 'inverse-start'` is deliberately ABSENT: that ceiling lifts at C5 and
 * this week must not spend it early. The one posing lift used is
 * `has-distractor`, on the lake-count two-step (Day 4 and mastery slot 6).
 *
 * Retrieval is backward-only into C1 (digit VALUE — the substrate of every
 * trade), C2 (compare and round, which is where the size check comes from),
 * C3 (addition within 1,000, which is also the add-back check) and B14
 * (subtraction within 100 with regrouping — the same trade, one place smaller).
 */

import { addWhole, asWarmup, classify, compareWhole, digitValue, reasoning, roundWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor, wholeMoney } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswerOf, assertsParam, barModel, numberLine } from '../lib/figures';
import type { BBFigure, FigureAssertion, PlaceName } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B14 = { level: 'B' as const, week: 14 };
const C1 = { level: 'C' as const, week: 1 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two distinct names, for the comparison story. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// Structure draws — the week's real content.
//
// Each returns a (minuend, subtrahend) pair that EXHIBITS one trading structure
// by construction, so the pages can be built out of structures instead of out
// of nouns. Every draw is a fixed sequence of `r.int` calls with no redraw loop:
// a loop would consume a variable number of draws and make every later item in
// the pack depend on this one (kit §E2 trap 4).
// ---------------------------------------------------------------------------

interface Pair {
  a: number;
  b: number;
}

const build = (h: number, t: number, o: number): number => 100 * h + 10 * t + o;

/** Every top digit already big enough: the algorithm runs straight through. */
function drawNoTrade(r: Rng): Pair {
  const ah = r.int(4, 9);
  const at = r.int(3, 9);
  const ao = r.int(3, 9);
  return { a: build(ah, at, ao), b: build(r.int(1, ah - 1), r.int(1, at), r.int(1, ao)) };
}

/** Exactly one trade, in the ones; the tens can still pay once it has lent. */
function drawOnesTrade(r: Rng): Pair {
  const ao = r.int(0, 8);
  const at = r.int(2, 9);
  const ah = r.int(3, 9);
  return { a: build(ah, at, ao), b: build(r.int(1, ah - 1), r.int(1, at - 1), r.int(ao + 1, 9)) };
}

/** Two trades, with something standing in the tens for the first one to take. */
function drawTwoTrades(r: Rng): Pair {
  const ao = r.int(0, 8);
  const at = r.int(1, 8);
  const ah = r.int(4, 9);
  return { a: build(ah, at, ao), b: build(r.int(1, ah - 1), r.int(at, 9), r.int(ao + 1, 9)) };
}

/** THE WEEK: an empty tens column, so the trade has to come from the hundreds. */
function drawAcrossZero(r: Rng): Pair {
  const ah = r.int(3, 9);
  const ao = r.int(0, 7);
  return { a: build(ah, 0, ao), b: build(r.int(1, ah - 1), r.int(1, 8), r.int(ao + 1, 9)) };
}

/**
 * A zero in the tens where the ones can nevertheless pay for themselves. The
 * counter-example the Day-5 claim turns on: the zero is not the trigger, a
 * column that cannot pay is.
 */
function drawZeroTensOnesPay(r: Rng): Pair {
  const ah = r.int(3, 9);
  const ao = r.int(4, 9);
  return { a: build(ah, 0, ao), b: build(r.int(1, ah - 1), r.int(1, 8), r.int(1, ao)) };
}

/**
 * How many columns of `a` have to be BROKEN OPEN to take `b` away — that is,
 * how many columns lend.
 *
 * The wording matters and it cost a rewrite to find out. "How much trading does
 * this need?" has two defensible answers on exactly the case this week is about:
 * for 601 − 462 there are TWO breaks (a hundred into ten tens, then a ten into
 * ten ones) but only ONE cascade, begun at the ones. A child taught the long
 * borrow as a single move would answer "one" and be marked wrong by a convention
 * the page never stated. Counting LENDING COLUMNS is unambiguous, it is the same
 * number in every structure this week draws, and it is the anchor's own language:
 * breaking a column open is exactly what the lesson script shows.
 */
function columnsBrokenOpen(a: number, b: number): number {
  const onesShort = a % 10 < b % 10;
  const tensTop = (Math.floor(a / 10) % 10) - (onesShort ? 1 : 0);
  const tensShort = tensTop < Math.floor(b / 10) % 10;
  return (onesShort ? 1 : 0) + (tensShort ? 1 : 0);
}

// ---------------------------------------------------------------------------
// withFigure + the place-value chart.
//
// `withFigure` is the c05/c06 wrapper: the shipped primitives have no figure
// slot and lib/ is not ours to edit, so it works entirely inside the returned
// closure, takes no new rng draw and leaves the prompt (and therefore the
// QG-1/QG-4 surface signature) untouched. It reads the drafted item's
// `generator.params` — the very numbers the answer was computed from — so the
// figure law holds by construction.
//
// `placeValueChart` is the one primitive this week leans on that `lib/figures.ts`
// exports no builder for (the schema and QG-13's re-derivation both exist; only
// the convenience wrapper is missing, and lib/ is not ours to extend). It is
// built the same way every figures.ts builder is — from the item's own value —
// and every caller here passes a 3-digit minuend, which is what the fixed
// `places` list describes.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

const HTO: PlaceName[] = ['hundreds', 'tens', 'ones'];

function placeValueChart(
  value: number,
  opts: { alt: string; highlight?: PlaceName; asserts?: FigureAssertion },
): BBFigure {
  return {
    type: 'place-value-chart',
    alt: opts.alt,
    params: {
      digits: String(value),
      places: HTO,
      ...(opts.highlight ? { highlight: opts.highlight } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/**
 * What a child SEES in the chart, column by column — never "the number is 500",
 * which would be a caption rather than a description. An empty column is
 * described as empty rather than as holding a zero, because that is what makes
 * the week's question ("who can lend?") askable from the picture. The same
 * string is used for the prompt's `[image: …]` direction, so the two can never
 * drift apart.
 */
function chartAlt(value: number): string {
  const col = (d: number, name: string) => (d === 0 ? `nothing in the ${name} column` : `${d} in the ${name} column`);
  return `a place-value chart holding ${value}: ${col(Math.floor(value / 100), 'hundreds')}, ${col(Math.floor(value / 10) % 10, 'tens')} and ${col(value % 10, 'ones')}`;
}

function withFigure(base: ItemGen, make: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: make(d.generator.params) } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000, which is also the shape of the add-back check. */
const wAdd = asWarmup(addWhole(118, 462), C3);
/** C2 — rounding to the nearest hundred, the size check this week leans on. */
const wRound = asWarmup(roundWhole(2, 118, 972), C2);
/** C2 — comparing 3-digit numbers, so "which is bigger" stays automatic. */
const wCompare = asWarmup(compareWhole(3), C2);
/** C1 — the VALUE of a digit, which is what a trade actually moves. */
const wDigitValue = asWarmup(digitValue(3), C1);

/** B14 — the same trade one place smaller, in the story form it was learnt in. */
const wStallStock = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'sub',
    draw: (r) => {
      const ones = r.int(0, 6);
      const tens = r.int(4, 9);
      const a = tens * 10 + ones;
      const b = r.int(1, tens - 1) * 10 + r.int(ones + 1, 9);
      const noun = r.pick(['punnets', 'bunches'] as const);
      return {
        prompt: `A market stall set out ${countNoun(a, noun)} of strawberries at dawn. It sold ${countNoun(b, noun)} before noon. How many ${unitFor(2, noun)} are still on the stall?`,
        answerValue: String(a - b),
        templateId: 'd_sub_v1',
        params: { a, b },
        units: noun,
        hints: [
          'Does the question ask how many were sold? Or how many are still out on the stall?',
          'Take the sold amount off the dawn count. Trade one ten for ten ones if the ones column runs short.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B14,
);

// ---------------------------------------------------------------------------
// Single-step stories — one per STRUCTURE, so the page teaches where the trade
// falls rather than which noun is being counted.
// ---------------------------------------------------------------------------

// The OCCASION travels with the scene rather than being drawn beside it: a
// theatre does not print programmes "for the spring fair", and cross-drawing the
// two is the "1/4 of the marbles are ripe" defect one size down (contexts.ts).
const STOCK_SCENES = [
  { place: 'print shop', noun: 'leaflets', made: 'ran off', why: 'for the spring fair', gone: 'have already gone out to the shops', left: 'are still in the box' },
  { place: 'theatre', noun: 'programmes', made: 'printed', why: "for tonight's show", gone: 'have been handed to people at the door', left: 'are still on the counter' },
  { place: 'gallery', noun: 'postcards', made: 'ordered', why: 'for the new exhibition', gone: 'have been bought', left: 'are still in the rack' },
  { place: 'craft club', noun: 'name badges', made: 'made', why: 'for the open day', gone: 'have been pinned on', left: 'are still in the tin' },
  { place: 'seed swap', noun: 'envelopes', made: 'filled', why: 'for the plant sale', gone: 'have been taken', left: 'are still in the crate' },
] as const;

/** NO TRADE. The plainest structure, so the contrast with the others is sharp. */
const sitStraightThrough = situation({
  situationType: 'part-whole',
  cognitiveOp: 'sub',
  draw: (r) => {
    const { a, b } = drawNoTrade(r);
    const s = r.pick(STOCK_SCENES);
    return {
      prompt: `A ${s.place} ${s.made} ${countNoun(a, s.noun)} ${s.why}. Since then ${countNoun(b, s.noun)} ${s.gone}. How many ${unitFor(2, s.noun)} ${s.left}?`,
      answerValue: String(a - b),
      templateId: 'd_sub_v1',
      params: { a, b },
      units: s.noun,
      hints: [
        'Which number in this story is the whole batch? Which one is the part that has gone?',
        'Stand the whole batch above the part, with the columns lined up. Then work along from the ones. Watch whether every top digit can pay.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const COMPARE_SCENES = [
  { noun: 'lengths', verb: 'has swum', when: 'this term' },
  { noun: 'steps', verb: 'has climbed', when: 'on the tower stairs' },
  { noun: 'conkers', verb: 'has gathered', when: 'this autumn' },
  { noun: 'laps', verb: 'has cycled', when: 'on the track this year' },
] as const;

/**
 * ONE TRADE, in a comparison. The figure is a number line carrying ONLY the
 * smaller of the two stated counts, which is where a count-up starts: the hop
 * to the larger count is the work, and nothing on the line measures it.
 */
const sitHowManyMore = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare-difference',
    draw: (r) => {
      const { a, b } = drawOnesTrade(r);
      const s = r.pick(COMPARE_SCENES);
      const [n1, n2] = two(r);
      return {
        prompt: `[image: a number line with ${countNoun(b, s.noun)} marked on it] ${n1} ${s.verb} ${countNoun(a, s.noun)} ${s.when}. ${n2} ${s.verb} ${countNoun(b, s.noun)}. How many more ${unitFor(2, s.noun)} has ${n1} ${s.verb.replace('has ', '')} than ${n2}?`,
        answerValue: String(a - b),
        templateId: 'd_sub_v1',
        params: { a, b, noun: s.noun },
        units: s.noun,
        hints: [
          'Which of the two counts is the bigger one? How far would you travel from the smaller one up to it?',
          'Land on the nearest ten first, then on the nearest hundred. Collect the hops as you go.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const small = numOf(p, 'b');
    const max = Math.ceil((numOf(p, 'a') + 40) / 100) * 100;
    return numberLine(
      {
        min: 0,
        max,
        step: 100,
        labels: 'majors',
        marks: [{ at: small, label: String(small), style: 'flag' }],
      },
      {
        alt: `a number line from 0 to ${max} with ${countNoun(small, strOf(p, 'noun'))} marked on it`,
        asserts: assertsParam('b', 'mark:0'),
      },
    );
  },
);

const NURSERY_SCENES = [
  { noun: 'saplings', spot: 'polytunnel', gone: 'planted out along the new hedge' },
  { noun: 'bulbs', spot: 'store shed', gone: 'planted in the front borders' },
  { noun: 'cuttings', spot: 'cold frame', gone: 'moved out to the raised beds' },
  { noun: 'strawberry plants', spot: 'greenhouse', gone: 'carried out to the fruit cage' },
] as const;

/**
 * ACROSS THE ZERO — the week's own structure. The figure is a place-value chart
 * of the count the nursery STARTED with, a number the prompt states outright;
 * what it adds is the sight of an empty tens column, which is the thing the
 * child has to notice before any arithmetic and is not the answer to anything.
 */
const sitAcrossTheZero = withFigure(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'sub-across-zero',
    draw: (r) => {
      const { a, b } = drawAcrossZero(r);
      const s = r.pick(NURSERY_SCENES);
      return {
        prompt: `[image: ${chartAlt(a)}] A tree nursery counted ${countNoun(a, s.noun)} in the ${s.spot} on Monday. By Friday ${countNoun(b, s.noun)} had been ${s.gone}. How many ${unitFor(2, s.noun)} were still in the ${s.spot}?`,
        answerValue: String(a - b),
        templateId: 'd_sub_v1',
        params: { a, b },
        units: s.noun,
        hints: [
          'Look along the top number — is there a column with nothing standing in it?',
          'When the column next door is empty, reach past it. One hundred becomes ten tens. Then one of those tens becomes ten ones.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    placeValueChart(numOf(p, 'a'), {
      alt: chartAlt(numOf(p, 'a')),
      highlight: 'tens',
      asserts: assertsParam('a'),
    }),
);

const ROUTE_SCENES = [
  { subject: 'The charity walk', verb: 'runs', where: 'from the church to the harbour' },
  { subject: 'The coastal path', verb: 'stretches', where: 'from the lighthouse to the ferry slip' },
  { subject: 'The canal towpath', verb: 'runs', where: 'from the lock to the old mill' },
] as const;

/** TWO TRADES, with tens to spare — the structure that is long but never empty. */
const sitWalkLeft = situation({
  situationType: 'measurement',
  cognitiveOp: 'sub',
  draw: (r) => {
    const { a, b } = drawTwoTrades(r);
    const name = one(r);
    const s = r.pick(ROUTE_SCENES);
    return {
      prompt: `${s.subject} ${s.verb} ${countNoun(a, 'm')} ${s.where}. ${name} has already covered ${countNoun(b, 'm')}. How many metres are still to walk?`,
      answerValue: String(a - b),
      templateId: 'd_sub_v1',
      params: { a, b },
      units: 'm',
      hints: [
        'How many of the digits on top are smaller than the digit sitting underneath them?',
        'Work from the ones end. After each trade, look again at the column to the left. See what it is holding before you take from it.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * The metacognition base. Its structure is DRAWN — sometimes no trade at all,
 * sometimes an empty tens column — so the estimate-first probe is a genuine
 * call rather than a question whose answer is always yes. Served ONLY through
 * the wrapper, so its ladder is counted once (kit §E2 trap 2).
 */
const sitTripFund = situation({
  situationType: 'money-change',
  cognitiveOp: 'sub',
  draw: (r) => {
    const draw = r.pick([drawNoTrade, drawOnesTrade, drawTwoTrades, drawAcrossZero] as const);
    const { a, b } = draw(r);
    const club = r.pick(['swimming club', 'chess club', 'walking club'] as const);
    const spend = r.pick(['coach hire', 'a set of new kit', 'the hall booking'] as const);
    return {
      prompt: `The ${club} had ${wholeMoney(a)} in its trip fund. It spent ${wholeMoney(b)} on ${spend}. How many dollars are left in the fund?`,
      answerValue: String(a - b),
      templateId: 'd_sub_v1',
      params: { a, b },
      units: 'dollars',
      acceptableForms: [wholeMoney(a - b)],
      hints: [
        'Does the question want the amount that was spent? Or the amount still sitting in the fund?',
        'Take the spending off the fund one column at a time. Trade wherever a column cannot pay.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const sitTripFundPredict = withEstimateFirst(
  sitTripFund,
  'will any column need a trade, or is every top digit already big enough?',
);

// ---------------------------------------------------------------------------
// Multi-step: the recipe's "subtract, then check by adding back" and its two
// siblings. The check lives in the STORY here — something leaves and something
// comes back — which is the same move the child then uses as a check.
// ---------------------------------------------------------------------------

/**
 * Out, then back. The figure is the START bar only: the count the child was
 * handed, with neither change drawn, so the picture anchors the story without
 * performing either line of it.
 */
const LOAN_SCENES = [
  { subject: 'The book bus', noun: 'books', stop: 'the village stop' },
  { subject: 'The tool library', noun: 'garden tools', stop: 'the Saturday session' },
  { subject: 'The kit store', noun: 'life jackets', stop: 'the morning session' },
] as const;

const msOutThenBack = withFigure(
  multiStep({
    situationType: 'multi-stage',
    draw: (r) => {
      // A bespoke across-zero draw rather than `drawAcrossZero`, because a
      // LENDING story has a plausibility constraint the bare structure does not:
      // "started with 600, lends out 573" is arithmetically fine and nonsense as
      // a story. The subtrahend is capped near half the stock, and the return is
      // capped below what went out, so nothing comes back that never left.
      const ah = r.int(4, 9);
      const ao = r.int(0, 7);
      const a = build(ah, 0, ao);
      const b = build(r.int(1, Math.max(1, Math.floor(ah / 2) - 1)), r.int(1, 8), r.int(ao + 1, 9));
      const back = r.int(40, Math.min(150, b - 10));
      const s = r.pick(LOAN_SCENES);
      return {
        prompt: `[image: one bar for the ${a} that were there at the start] ${s.subject} started the day with ${countNoun(a, s.noun)}. It lends out ${countNoun(b, s.noun)} at ${s.stop}. Then ${countNoun(back, s.noun)} come back before closing time. How many ${unitFor(2, s.noun)} are there at closing time?`,
        initN: a,
        steps: [
          { op: 'sub', n: b, d: 1 },
          { op: 'add', n: back, d: 1 },
        ],
        units: s.noun,
        hints: [
          'Which of the two changes happens first? Does it leave more or fewer than the day began with?',
          'Deal with what goes out before what comes back. Write the middle number somewhere you can still see it.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  // The bar's words are noun-free on purpose: `multiStep` ships only the chain in
  // `generator.params`, so the figure cannot name the drawn scene without being
  // told twice — and a bar that says what it is FOR ("there at the start") says
  // the one thing the picture is actually claiming.
  (p) => {
    const start = numOf(p, 'initN');
    return barModel(
      [{ label: 'there at the start of the day', segments: [{ value: start, label: String(start) }] }],
      {
        alt: `one bar for the ${start} that were there at the start of the day; what goes out and what comes back are not drawn`,
        asserts: assertsParam('initN'),
      },
    );
  },
);

const BATCH_SCENES = [
  { subject: 'A museum', made: 'printed', noun: 'guide maps', when: 'for the half-term week', taker: 'Visitors took' },
  { subject: 'A garden centre', made: 'potted up', noun: 'herb plants', when: 'for the spring weekend', taker: 'Customers bought' },
  { subject: 'A youth club', made: 'ordered', noun: 'badges', when: 'for the summer challenge', taker: 'Members claimed' },
] as const;

/** Two amounts leave the same whole, so the second trade starts from a number
 *  nobody stated — the middle number the child has to write down. */
const msTakenTwice = multiStep({
  situationType: 'part-whole',
  draw: (r) => {
    const { a } = drawAcrossZero(r);
    // Both removals are drawn AGAINST the batch that is actually there, so the
    // pile can never run past zero — a museum cannot hand out maps it never
    // printed, and a negative count would print as "-1 guide maps".
    const first = r.int(58, Math.floor(a / 3));
    const second = r.int(46, Math.floor((a - first) / 2));
    const s = r.pick(BATCH_SCENES);
    return {
      prompt: `${s.subject} ${s.made} ${countNoun(a, s.noun)} ${s.when}. ${s.taker} ${countNoun(first, s.noun)} on Monday and another ${countNoun(second, s.noun)} on Tuesday. How many ${unitFor(2, s.noun)} were left after Tuesday?`,
      initN: a,
      steps: [
        { op: 'sub', n: first, d: 1 },
        { op: 'sub', n: second, d: 1 },
      ],
      units: s.noun,
      hints: [
        'How many separate times does something leave the pile in this story?',
        'Take the first amount off the starting batch. Write down what that leaves. Then take the second amount off that number.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * The same two-step shape carrying a quantity that is NOT used
 * (PEDAGOGY-CEILING-REVIEW F3 `has-distractor`): a corpus in which every item
 * consumes every number it states quietly teaches "use all the numbers".
 */
const DEPART_SCENES = [
  { subject: 'A bird reserve', noun: 'swans', at: 'on the lake at dawn', cue: 'Before the wardens arrived', left: 'flew off', left2: 'took off', spare: 'hides', spareWhere: 'for watchers along the shore' },
  { subject: 'A wildlife park', noun: 'ducks', at: 'on the big pond at dawn', cue: 'Before the keepers came round', left: 'flew off', left2: 'paddled away', spare: 'feeding stations', spareWhere: 'around the water' },
  { subject: 'A harbour', noun: 'boats', at: 'at their moorings at dawn', cue: 'Before the tide turned', left: 'sailed out', left2: 'slipped their moorings', spare: 'lifebuoys', spareWhere: 'along the harbour wall' },
] as const;

const msLakeCount = multiStep({
  situationType: 'multi-stage',
  posing: 'has-distractor',
  draw: (r) => {
    const { a } = drawAcrossZero(r);
    // Same guard as the museum item: both departures are drawn against the
    // birds that are genuinely on the water.
    const dawn = r.int(64, Math.floor(a / 3));
    const midday = r.int(52, Math.floor((a - dawn) / 2));
    const spare = r.int(3, 9);
    const s = r.pick(DEPART_SCENES);
    return {
      prompt: `${s.subject} counted ${countNoun(a, s.noun)} ${s.at}. ${s.cue}, ${countNoun(dawn, s.noun)} ${s.left}. Another ${countNoun(midday, s.noun)} ${s.left2} before midday. There are ${countNoun(spare, s.spare)} ${s.spareWhere}. How many ${unitFor(2, s.noun)} were still there after midday?`,
      initN: a,
      steps: [
        { op: 'sub', n: dawn, d: 1 },
        { op: 'sub', n: midday, d: 1 },
      ],
      units: s.noun,
      hints: [
        'Before you take anything away, ask what each number in this story is counting.',
        'Only counts that name the same thing as the question belong here. Leave the odd one where it is.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — WHERE the trade lands, and HOW MUCH trading is coming.
// Both are asked before any arithmetic, which is the point: the structure of a
// subtraction is readable off the digits, and reading it is the skill.
// ---------------------------------------------------------------------------

const LENDERS = {
  tens: 'the tens',
  hundreds: 'the hundreds',
  none: 'no place — the ones can already pay',
} as const;

const LENDER_WHY: Record<string, { errorTag: 'concept-misconception' | 'procedure-slip' | 'representation-misread'; rationale: string }> = {
  [LENDERS.tens]: {
    errorTag: 'procedure-slip',
    rationale: 'Turns to the column next door without first checking whether anything is standing in it to lend.',
  },
  [LENDERS.hundreds]: {
    errorTag: 'concept-misconception',
    rationale: 'Goes straight to the biggest place, even when the column right beside the ones has plenty to give.',
  },
  [LENDERS.none]: {
    errorTag: 'representation-misread',
    rationale: 'Reads the two ones digits as a pair without noticing which of them is the one on top.',
  },
};

/**
 * The recipe's discrimination — WHERE the trade comes from. "The FIRST place
 * with something to lend" is the phrasing that survives the across-zero case:
 * an empty tens column has nothing to give, so the search walks past it.
 */
const discrimWhereTheTradeComesFrom = discrimination({
  variant: 'structural',
  cognitiveOp: 'trade-location',
  draw: (r) => {
    const kind = r.pick(['ones', 'zero', 'ones', 'zero', 'none', 'zeroPay'] as const);
    const pair =
      kind === 'ones' ? drawOnesTrade(r)
        : kind === 'zero' ? drawAcrossZero(r)
          : kind === 'none' ? drawNoTrade(r)
            : drawZeroTensOnesPay(r);
    const correct =
      kind === 'ones' ? LENDERS.tens
        : kind === 'zero' ? LENDERS.hundreds
          : LENDERS.none;
    const others = [LENDERS.tens, LENDERS.hundreds, LENDERS.none].filter((t) => t !== correct);
    return {
      prompt: `Look at ${pair.a} − ${pair.b}. Which is the FIRST place with something to lend the ones column?`,
      correct,
      distractors: others.map((text) => ({ text, ...LENDER_WHY[text] })),
      hints: [
        'Is the ones digit on top big enough to pay for itself? Or will it have to ask for help?',
        'If it has to ask, look at the column beside it. A column standing empty has nothing to give. So keep looking left.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const BREAK_COUNTS = ['none at all', 'one column', 'two columns'] as const;

const BREAK_COUNT_WHY: Record<string, { errorTag: 'concept-misconception' | 'procedure-slip' | 'representation-misread'; rationale: string }> = {
  [BREAK_COUNTS[0]]: {
    errorTag: 'representation-misread',
    rationale: 'Judges the whole subtraction by the hundreds, where the top digit is comfortably the larger one.',
  },
  [BREAK_COUNTS[1]]: {
    errorTag: 'procedure-slip',
    rationale: 'Counts the first column that lends and stops, without asking whether that column had anything to give in the first place.',
  },
  [BREAK_COUNTS[2]]: {
    errorTag: 'concept-misconception',
    rationale: 'Treats a three-digit subtraction as something that always has to be broken open twice.',
  },
};

/**
 * Predict the structure BEFORE computing — the brief's prediction item. It
 * counts LENDING COLUMNS, for the reason set out on `columnsBrokenOpen`.
 */
const discrimHowManyBreaks = discrimination({
  variant: 'structural',
  cognitiveOp: 'trade-plan',
  draw: (r) => {
    const kind = r.pick(['none', 'ones', 'two', 'zero'] as const);
    const pair =
      kind === 'none' ? drawNoTrade(r)
        : kind === 'ones' ? drawOnesTrade(r)
          : kind === 'two' ? drawTwoTrades(r)
            : drawAcrossZero(r);
    const correct = BREAK_COUNTS[columnsBrokenOpen(pair.a, pair.b)];
    const others = BREAK_COUNTS.filter((t) => t !== correct);
    return {
      prompt: `Do not work this out yet. How many columns of ${pair.a} must be broken open to take ${pair.b} away?`,
      correct,
      distractors: others.map((text) => ({ text, ...BREAK_COUNT_WHY[text] })),
      hints: [
        'Which digits on top are already big enough to pay? Which of them are not?',
        'Settle the ones column first. A column that has just lent is left one smaller. Remember that before you judge the next one.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers).
//
// See the file header for the identity: with a round-hundred minuend and a
// two-digit subtrahend, the smaller-from-larger column flip IS a + b, so the
// shown wrong value is a genuine misconception output rather than an authored
// number. The prose names the three digits the student put in the columns, so
// what is on the page is the flip and not an addition.
// ---------------------------------------------------------------------------

const HALL_SCENES = [
  { place: 'A village hall', noun: 'chairs', out: 'was set out with', away: 'were carried back to the store' },
  { place: 'A garden centre', noun: 'pots', out: 'stacked', away: 'were taken out to the yard' },
  { place: 'A stationery cupboard', noun: 'pencils', out: 'held', away: 'were handed out to the classes' },
] as const;

const eaSmallerFromLarger = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(3, 9) * 100, b: r.int(1, 8) * 10 + r.int(1, 9), op: '-', wrongOp: '+' }),
  build: (v, p, r) => {
    const a = Number(p.a);
    const b = Number(p.b);
    const s = r.pick(HALL_SCENES);
    const name = one(r);
    return {
      prompt: `${s.place} ${s.out} ${countNoun(a, s.noun)}. Then ${countNoun(b, s.noun)} ${s.away}. ${name} worked the subtraction down the columns. ${name} put ${b % 10} in the ones and ${Math.floor(b / 10)} in the tens. Then ${a / 100} went in the hundreds. So the answer came out as ${v.wrong}.`,
      extension: `Work out how many ${unitFor(2, s.noun)} are really left. Write down the trade that must happen before the ones column can pay. Then say in one sentence what ${name} did in the ones column.`,
      hints: [
        'Which digit in the ones column was the one on top? Which one was underneath it?',
        'Rebuild the top number as hundreds, tens and ones. Keep going until the ones column has enough to pay. Then work the columns again.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: ['trade', 'break a hundred', 'the top digit was smaller'],
    };
  },
});

/**
 * The gallery's SECOND exhibit, and a different kind of error entirely: this
 * student's subtraction is sound and the CHECK is what went the wrong way.
 *
 * Honest by the same discipline as the first. With `op: '+'` over (difference,
 * amount taken away), `correct` is the rebuild — which must land on the number
 * the story started with, because that is the whole claim of the add-back check
 * — and `wrong` is what you genuinely get by taking the same amount away a
 * second time. Operands are drawn so the second removal never runs past zero,
 * since a Level-C child should not meet a negative on the page.
 *
 * It also puts the recipe's multi-step move ("subtract, then check by adding
 * back") on Day 5 as something to REASON about rather than perform.
 */
const eaCheckedBySubtracting = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const start = build(r.int(6, 9), 0, r.int(0, 7));
    const gone = build(r.int(1, 2), r.int(1, 8), r.int((start % 10) + 1, 9));
    // start ≥ 600 and gone ≤ 289, so the difference comfortably exceeds `gone`
    // and the shown check result stays positive.
    return { a: start - gone, b: gone, op: '+', wrongOp: '-' };
  },
  build: (v, p, r) => {
    const diff = Number(p.a);
    const gone = Number(p.b);
    const name = one(r);
    const scene = r.pick([
      { place: 'The seed library', noun: 'seed packets', verb: 'went out to gardeners' },
      { place: 'The garden centre', noun: 'plant labels', verb: 'were taken out to the beds' },
      { place: 'The ticket office', noun: 'wristbands', verb: 'were handed out at the gate' },
    ] as const);
    return {
      prompt: `${scene.place} counted ${countNoun(diff + gone, scene.noun)} on Monday. Then ${countNoun(gone, scene.noun)} ${scene.verb}. ${name} worked out that ${diff} were left. ${name} then checked that answer by writing ${diff} − ${gone} = ${v.wrong}.`,
      extension: `Carry out the check the way this week does it. Write down the number it lands on. Then say in one sentence what that number tells you. What does it say about the answer ${name} first wrote?`,
      hints: [
        'What is a check supposed to rebuild? The amount that went, or the count you began with?',
        'Put the amount that left back together with the amount that stayed. See which number you arrive at.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: ['adding back', 'put it back', 'rebuilds the starting count', 'the answer was right'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC04 = makeWeekBuilder({
  level: 'C',
  week: 4,
  conceptId: 'subtraction-within-1000',
  conceptName: 'Subtraction within 1,000',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [B14, C1, C3],
  pedagogyContract: 'v2',
  conceptualAnchor: 'breaking across a zero',
  conceptFamily: 'operation',
  deepeningDelta:
    'Level A took things away inside ten and Level B traded once, inside a hundred, where the column next door always had tens standing in it to lend. C4 keeps that same trade and puts a column in the way that has nothing to give, so the child has to reach one place further left and come back — and, for the first time, has a check worth doing, because a three-digit answer is no longer something you can see is right.',
  explanation: {
    hook:
      'Take 246 away from 703. The ones column turns to the tens for help. But the tens column is standing there empty. This week we find out where the help really comes from.',
    whyBeforeHow:
      'A zero is not an empty space in a number. It is a column with nothing standing in it yet. A column with nothing in it cannot lend anything to its neighbour. That is why the trade travels one place further left and comes back. That is what breaking across a zero means. One hundred becomes ten tens. Then one of those tens becomes ten ones. Now the ones column finally has something to take from. Nothing is created and nothing is lost on the way. 703 is still 703 after both trades. It is simply held as 6 hundreds, 9 tens and 13 ones. Before, it was 7 hundreds, 0 tens and 3 ones. That is also why putting your answer back together is such a good check. The pieces were only moved around. So adding back what you took away must land you where you started.',
    script: [
      {
        say: 'Watch what I do before I write a single digit. A gallery had 703 postcards and sold 246. I read the ones column first: three on top, six underneath. The three is the smaller one, so I know a trade is coming. Then I look next door for the ten I want. The tens column is empty.',
        visual: 'A place-value chart holding 703, with nothing standing in the tens column.',
        figure: placeValueChart(703, { alt: chartAlt(703), highlight: 'tens' }),
      },
      {
        say: 'So I reach past the empty column. I break one hundred into ten tens. That fills the tens column up. Then I break one of those tens into ten ones. Now the top row is holding 6 hundreds, 9 tens and 13 ones. That is still the same 703 I started with. It is just held in different pieces.',
        visual: 'One bar of 703 shown as 600, 90 and 13 standing side by side.',
        figure: barModel(
          [
            {
              label: 'the same number after both trades',
              segments: [
                { value: 600, label: '6 hundreds' },
                { value: 90, label: '9 tens' },
                { value: 13, label: '13 ones' },
              ],
              total: '703',
            },
          ],
          { scaleMax: 703, alt: 'one bar of 703 split into 600, 90 and 13' },
        ),
      },
      {
        say: 'Now the columns can pay. Thirteen ones take away six ones leaves seven. Nine tens take away four tens leaves five. Six hundreds take away two hundreds leaves four. The postcards left in the rack come to 457.',
        visual: 'The starting bar of 703 above the shorter bar of 457 that is left.',
        figure: barModel(
          [
            { label: 'in the rack at the start', segments: [{ value: 703, label: '703' }] },
            { label: 'left in the rack', segments: [{ value: 457, label: '457' }] },
          ],
          { scaleMax: 703, alt: 'a bar of 703 above a shorter bar of 457' },
        ),
      },
      {
        say: 'One habit before I move on. I ask roughly how big the answer ought to be. 703 take away about 250 should land near 450. And 457 sits right there. Then I check it properly by putting the postcards back. 457 + 246 = 703. That is exactly the number I began with, so the trades did their job.',
        visual: 'A number line with a hop from 457 back up to 703.',
        figure: numberLine(
          {
            min: 0,
            max: 800,
            step: 100,
            labels: 'majors',
            marks: [
              { at: 457, label: '457', style: 'flag' },
              { at: 703, label: '703', style: 'flag' },
            ],
            hops: [{ from: 457, to: 703, label: 'put the 246 back' }],
          },
          { alt: 'a number line from 0 to 800 with a hop from 457 back up to 703' },
        ),
      },
    ],
    summary:
      'Read the top number before you write anything. Find the first column that cannot pay. Trade from the place next door if it has something to give. If that column is empty, trade from the place beyond it. One hundred into ten tens, one ten into ten ones. The number never changes, only the pieces it is held in. Then add your answer back to what you took away. Check that you land where you started.',
    vocabulary: [
      { term: 'trade (regroup)', kidGloss: 'break one hundred into ten tens, or one ten into ten ones, without changing the number' },
      { term: 'breaking across a zero', kidGloss: 'when the column next door is empty, the trade comes from the place beyond it' },
      { term: 'difference', kidGloss: 'how far apart two numbers are — the thing a subtraction finds' },
      { term: 'check by adding back', kidGloss: 'put what you took away back on; you should land on the number you started with' },
    ],
  },
  guidedExamples: [
    {
      ...ge(4, 1, 'modeled', 'A gallery had 703 postcards in the rack and sold 246 of them. How many postcards are left in the rack?', [
        {
          teacherSay:
            'Watch me read before I write. I go to the ones column first. Three on top, six underneath. The top digit is the smaller one, so a trade is coming. Then I look next door for the ten I want. The tens column has nothing standing in it at all.',
        },
        {
          teacherSay:
            'So the trade starts at the hundreds. I break one hundred into ten tens, then one of those tens into ten ones. How many ones is the top row holding now?',
          expected: '13',
        },
      ], '457'),
      visual: 'The traded number beside the amount left in the rack.',
      figure: barModel(
        [
          {
            label: 'the same 703 after both trades',
            segments: [
              { value: 600, label: '6 hundreds' },
              { value: 90, label: '9 tens' },
              { value: 13, label: '13 ones' },
            ],
            total: '703',
          },
          { label: 'left in the rack', segments: [{ value: 457, label: '457' }], total: '457' },
        ],
        {
          scaleMax: 703,
          alt: 'a bar of 703 split into 600, 90 and 13, above a bar of 457',
          asserts: assertsAnswerOf('bar:1'),
        },
      ),
    },
    {
      ...ge(4, 2, 'completion', 'A depot began the week with 500 crates and sent out 328. How many crates are still in the depot?', [
        { teacherSay: 'Two columns on top have nothing standing in them here. Which place is the only one with anything to lend?', expected: 'the hundreds' },
        { childDo: 'Break one hundred down through the empty columns. Then work the three columns from the ones end.', expected: '172' },
      ], '172'),
      visual: 'A place-value chart holding 500, with both the tens and the ones columns empty.',
      figure: placeValueChart(500, { alt: chartAlt(500), highlight: 'tens' }),
    },
    ge(4, 3, 'prompted', 'A festival sold 462 wristbands on Saturday and 275 on Sunday. How many more wristbands were sold on Saturday?', [
      { childDo: 'Say which columns will need a trade before you start. Then work them from the ones end.', expected: '187' },
    ], '187'),
    {
      // Independent stage: the chart shows the count the story hands over and
      // nothing else. Deciding where the trade comes from IS the task here.
      ...ge(4, 4, 'independent', 'A ferry counted 806 passengers on Saturday and 259 on Sunday. How many more passengers were counted on Saturday? Solve cold, then check by adding back.', [
        { childDo: 'Work the difference. Then add your answer to the Sunday count and see where it lands.', expected: '547' },
      ], '547'),
      visual: 'A place-value chart holding the Saturday count.',
      figure: placeValueChart(806, { alt: chartAlt(806), highlight: 'tens' }),
    },
  ],
  days: [
    // Day 1 — concept echo: three structures, one item each, single-step only.
    // The child meets "no trade", "one trade" and "the empty column" on the
    // same page, which is what makes the structure visible at all.
    [
      { gen: wAdd, diff: 2 },
      { gen: wDigitValue, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: sitStraightThrough, diff: 2 },
      { gen: sitHowManyMore, diff: 3 },
      { gen: sitAcrossTheZero, diff: 3 },
    ],
    // Day 2 — fluency + application: the trade-location discrimination, the
    // estimate-first prediction, and the first two-step story.
    [
      { gen: wStallStock, diff: 2 },
      { gen: wRound, diff: 2 },
      { gen: discrimWhereTheTradeComesFrom, diff: 3 },
      { gen: sitTripFundPredict, diff: 3 },
      { gen: sitAcrossTheZero, diff: 4 },
      { gen: msOutThenBack, diff: 4 },
    ],
    // Day 3 — interleave: both discriminations against a long two-trade story
    // and a two-step, with a no-trade item mixed in so "it must need trading"
    // never becomes the cue.
    [
      { gen: wCompare, diff: 2 },
      { gen: discrimHowManyBreaks, diff: 3 },
      { gen: discrimWhereTheTradeComesFrom, diff: 4 },
      { gen: sitWalkLeft, diff: 3 },
      { gen: msTakenTwice, diff: 4 },
      { gen: sitStraightThrough, diff: 3 },
    ],
    // Day 4 — word problems: three two-steps (one carrying a count that must be
    // left alone) beside two single-step stories.
    [
      { gen: msTakenTwice, diff: 4 },
      { gen: msOutThenBack, diff: 4 },
      { gen: msLakeCount, diff: 5 },
      { gen: sitHowManyMore, diff: 4 },
      { gen: sitWalkLeft, diff: 4 },
    ],
    // Day 5 — the error-hunt gallery: two worked errors that are not the same
    // error twice (a student who never traded, and a student whose CHECK went
    // the wrong way), the two-methods comparison the child has to judge, and the
    // claim about what a zero really signals (+ a ramped warm-up).
    [
      { gen: wDigitValue, diff: 2 },
      { gen: eaSmallerFromLarger, diff: 4 },
      { gen: eaCheckedBySubtracting, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Work out 604 − 587 in two ways. First set it out in columns and trade wherever you need to. Then start at 587 and count up to 604 in easy hops. Collect the hops as you go. Write what you notice about the two answers. Then say which way you would choose for THESE two numbers.',
          value: 'both ways give the same difference, and counting up is the quicker one here because the two numbers sit close together, so the hops are short while the column way has to break a hundred all the way down',
          acceptableForms: ['same', 'counting up', 'close together', 'short hops', 'trade'],
          keywords: true,
          hints: [
            'Which of your two ways needed more writing, and why do you think that was?',
            'Look at how far apart the two numbers are. A short gap and a long gap suit different ways.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? The top number has a zero in its tens column. You have to break open the hundreds before you can take anything away. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Treats the zero itself as the trigger, when what forces a trade is a column that cannot pay — and the ones column often can.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads the empty column as one that can simply be skipped, so the trade that has to travel through it never happens.',
            },
          ],
          hints: [
            'Think of a top number with a zero in its tens. Can you find one where nothing has to be broken open?',
            'Try one where the top ones digit is the bigger of the two. Then try one where it is the smaller. See whether a single rule covers both.',
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
    'For grown-ups: if an answer comes out wrong this week, ask your child to add it back to the amount that was taken away before you look at anything else. If it does not rebuild the starting number, they already know the answer is off — and finding that out for themselves is worth more than being told. Nine times out of ten the slip is one column, and it is usually the one standing next to a zero.',
  ],
  puzzle: (r) => {
    const ah = r.int(4, 9);
    const ao = r.int(0, 6);
    const top = build(ah, 0, ao);
    const b = build(r.int(1, ah - 2), r.int(1, 8), r.int(ao + 1, 9));
    return {
      id: 'C4-PZ-01',
      title: 'Puzzle Grove: The Missing Top Line',
      puzzleType: 'logic',
      prompt: `A worked subtraction has lost its top line. All that is left on the page is: ▢▢▢ − ${b} = ${top - b}. What was the top number? How can you be sure no other number could have been there?`,
      answer: { value: String(top), acceptableForms: [], validation: 'exact-numeric' },
      hintLadder: [
        'What would putting the amount that was taken away back onto the answer tell you?',
        'Rebuild the missing line from the two numbers you can still see. Then work the subtraction forwards. Prove it lands on the answer that is printed.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'repair' },
  sprint: {
    skill: 'Subtraction within 100 — the trade this week has to make three times a page',
    sourceWeek: B14,
    itemCount: 18,
    scheduledDay: 2,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 23, max: 97 },
  },
  mastery: [
    { gen: sitAcrossTheZero, diff: 3 },
    { gen: msOutThenBack, diff: 3 },
    { gen: sitWalkLeft, diff: 3 },
    { gen: msTakenTwice, diff: 4 },
    { gen: sitHowManyMore, diff: 3 },
    { gen: msLakeCount, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step stories in three structures — an empty tens column, two trades with tens to spare, and a comparison with one trade — with the place-value-chart and number-line affordances preserved. 02/04/06: two-step stories — out-then-back (the add-back check living inside the story), two amounts leaving one whole, and a story carrying a count that must be left unused. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'smaller-from-larger',
      description: 'Takes the smaller digit from the larger one in any column where the top digit is the smaller, so no trade is ever made and the answer comes out too big.',
      exampleWrongAnswer: '300 − 76 answered as 376',
      distractorRationale: 'Offer the number the column-by-column digit flip produces.',
      reteachPointer: 'explanation/script[1] (the same number held as six hundreds, nine tens and thirteen ones)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'trade-not-recorded',
      description: 'Breaks a hundred into ten tens but leaves the hundreds digit as it was, so the difference comes out one hundred too large.',
      exampleWrongAnswer: '703 − 246 answered as 557',
      distractorRationale: 'Offer the difference one hundred above the true one.',
      reteachPointer: 'guidedExamples/C4-GE-01 (cross the hundreds digit out as the ten tens arrive)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'zero-column-skipped',
      description: 'Reads the empty tens column as a column with nothing to do and brings the digit underneath it straight down into the answer.',
      exampleWrongAnswer: '507 − 243 answered as 344',
      distractorRationale: 'Offer the answer that keeps the bottom digit standing in the empty column.',
      reteachPointer: 'explanation/script[0] (an empty column still has to be paid from somewhere)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'wrong-quantity-read',
      description: 'Reports a quantity the story states rather than the one the question names — the amount that went instead of the amount left, or the middle number of a two-step story.',
      exampleWrongAnswer: 'a "how many are left?" story answered with the amount taken away',
      distractorRationale: 'Offer a quantity the story really does mention, but not the one the question asks for.',
      reteachPointer: 'guidedExamples/C4-GE-04 (read the question again before the number goes down)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Subtraction within 1,000 — reading a subtraction before working it, deciding which columns will need a trade, and handling the hard case where the column next door is empty so the trade has to come from the hundreds. Every answer is checked by adding it back to what was taken away.',
    improvingCandidates: [
      'spotting which columns will need a trade before starting',
      'taking the trade from the hundreds when the tens column is empty',
      'checking an answer by adding it back to the amount that was taken away',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'columns where the top digit is the smaller one — the temptation is to swap them round, and the trade is what makes swapping unnecessary',
      },
      {
        errorTag: 'procedure-slip',
        text: 'recording the trade on the page, so the column it came from is not paid twice',
      },
      {
        errorTag: 'representation-misread',
        text: 'reading an empty column as a column that still has to be dealt with',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was actually asked, especially in a story where something leaves and something comes back',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked the ones column before you wrote anything down, and when the tens column had nothing to give you traded from the hundreds and said so out loud — that is exactly the move this week is built on.',
      questionForChild: 'If 400 people were at the fair and 137 went home before tea, how many were still there — and where did you have to get the trade from?',
      schoolSyncHook: 'If your child\'s class crosses digits out in a particular way, or calls this borrowing rather than trading, tell us and we will use their words.',
    },
    vocabularyForParent: [
      'trade / regroup (breaking one hundred into ten tens, or one ten into ten ones)',
      'breaking across a zero (an empty column has nothing to lend, so the trade comes from the place beyond it)',
      'checking by adding back (the answer plus what was taken away must rebuild the start)',
    ],
  },
});
