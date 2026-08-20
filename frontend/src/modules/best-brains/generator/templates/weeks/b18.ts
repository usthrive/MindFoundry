/**
 * Level B · Week 18 — "Skip counting 2s, 5s, 10s" (conceptId: skip-counting-2-5-10).
 *
 * FILL-ARCHITECTURE §4 row B18: anchor "hops on the line"; multi-step
 * "skip-count then add extras (pre-×, `usesPriorSkill`)"; error-analysis "loses
 * the pattern mid-stream"; discrimination "2s vs 5s pattern spot"; Day-5
 * signature "pattern-hunt production".
 *
 * WHAT THIS WEEK IS FOR. It is the seed C7 later formalises, so it plants two
 * things and no notation:
 *   1. a skip count is a run of EQUAL hops — the hop never changes size, which
 *      is why the count can be trusted at all;
 *   2. the LANDING NUMBERS are worth looking at. A fives count swings between
 *      numbers ending in five and numbers ending in zero. A tens count only ever
 *      ends in zero. A twos count hops straight over the number in between.
 * Noticing that is real mathematics and it is the whole content of Day 5: the
 * production asks the child to write a count out, look at what it skipped, and
 * say WHY the count has no choice.
 *
 * NO × NOTATION ANYWHERE. C7 owns the symbol; B18 owns the count it names. The
 * two multi-step chains do carry an internal `{op:'mul'}` step in their params —
 * that is the op-chain library's only way to say "this quantity again, once per
 * group", and it is what makes the answer code-computed rather than authored. No
 * child-facing string in this pack contains a `×`, and every prompt states the
 * move as a count ("hops along in fives"), which is exactly how the child
 * performs it. Declared here rather than left to be discovered.
 *
 * NO VERIFY-LIBRARY LIMIT HERE, which is worth recording because three of the
 * first five Level-C weeks hit one (kit §E2.3). The recipe's error is a count
 * that loses the pattern mid-stream, and its own worked instance — …20, 25, 30,
 * 34 — is a landing that falls exactly one short. `a_verify_count_slip_v1` in
 * `slip:'skip-count'` mode is the corpus's registered "the count stopped one
 * short" transform and returns {correct: n, wrong: n − 1}. Fed the count's true
 * landing number it produces the recipe's own arithmetic, code-derived, with the
 * misconception NAMED by the template rather than invented by the prompt.
 * Nothing had to be reframed and nothing was fabricated.
 *
 * CONCEPT FAMILY: `'operation'`, the full row (≥2 multi-step week-wide).
 * Declaring 'place-value' would have been a dodge — the recipe hands this week
 * its own two-step, and it is the pre-multiplication move: run the count, then
 * bring in the ones the count never reached.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Two families, both built from
 * the item's own drawn values, both asserting a GIVEN:
 *   - `firstTwoHops` draws the number line with only the FIRST TWO hops on it,
 *     flagged with the numbers they land on, and the tick labels switched off.
 *     So the picture states the hop SIZE — which the prose states too — and
 *     stops. It never draws the landing the item asks for, and it never labels
 *     the ladder the child is meant to climb. Every drawn item takes at least
 *     four hops, so the second flag can never be the answer.
 *   - `oneGroup` draws ONE group and asserts its SIZE against the item's own
 *     param: the five arms of a single starfish, the ten satsumas in one net,
 *     the two socks in one pair. The unit of the count is the thing worth
 *     drawing; the total never is, because the total is the question.
 * The pictures that show a finished count live in the lesson script and the
 * modeled guided example, where the answer is already on the page. The
 * prediction item and the discrimination carry NO picture on purpose: a number
 * line beside "will it pass twenty?" answers it, and a number line beside "which
 * count reaches all three?" answers that too.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): prompt sentences ≤15
 * words; `skip count`, `hop` and `landing number` glossed in
 * `explanation.vocabulary` before any item leans on them; metacognition in its
 * intro form — the B row's own "will it pass …?" prediction, drawn over a pool
 * that genuinely holds both answers (a twos count of a few minutes never reaches
 * twenty, a tens count nearly always does); error-analysis written-lite, one
 * sentence; the sprint ungraded and self-referenced.
 *
 * FRAMES, re-checked against the weeks directory at the END of the build (kit
 * §E2.8), not at the start. That scan earned its keep three times:
 *   - c08 pegs number cards along a WASHING LINE, counting on in steps, with the
 *     last card blown away. The first draft of the twos page hung socks on a
 *     washing line; it now counts pairs in a sock drawer, and no item in this
 *     week asks for a missing number in a written run at all (c07 owns the
 *     smudged number mid-run, c08 the last card gone).
 *   - c07 and c08 both lay equal-length objects end to end and ask how long the
 *     line is (dominoes, domino tiles). The prediction item was that shape; it is
 *     now a snail crawling for a number of minutes, which is a rate over time and
 *     not a row of objects.
 *   - c09 shares a bowl of cherries into pots and its script deals counters onto
 *     plates. Cherries-on-plates was the prediction frame before the snail.
 * Everything kept — starfish, satsumas, socks, a grasshopper, hairband cards —
 * appears nowhere else in the corpus.
 *
 * Retrieval is backward-only into B4 (count back along the number path — the
 * single move a hop is made of), A22 (counting in tens, the first skip count the
 * child ever met), B16 (counting a purse of nickels, which is a fives count
 * wearing money) and B10 (adding a whole ten, the arithmetic a tens count runs
 * on).
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
import {
  assertsAnswer,
  assertsParam,
  coinName,
  coinSet,
  coinSetAlt,
  counterGroups,
  numberLine,
  type CoinEntry,
} from '../lib/figures';
import type { BBFigure, FigureAssertion } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A22 = { level: 'A' as const, week: 22 };
const B4 = { level: 'B' as const, week: 4 };
const B5 = { level: 'B' as const, week: 5 };
const B10 = { level: 'B' as const, week: 10 };
const B16 = { level: 'B' as const, week: 16 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/** The three counts this week owns. */
const STEPS = [2, 5, 10] as const;
type Step = (typeof STEPS)[number];

/**
 * A count named in words, never as a digit followed by an "s".
 *
 * Two reasons. A six-year-old reads "fives" faster than "5s", and it keeps the
 * prompt's numeric-token surface (which QG-1 signs for freshness) carrying only
 * the numbers the picture and the arithmetic actually use.
 */
const COUNT_NAME: Record<Step, string> = { 2: 'twos', 5: 'fives', 10: 'tens' };
/** The same three counts as choosable options — the discrimination's answer set. */
const COUNT_OPTION: Record<Step, string> = {
  2: 'counting in twos',
  5: 'counting in fives',
  10: 'counting in tens',
};

// ---------------------------------------------------------------------------
// withFigure — a picture built from the item's OWN generator params
//
// The shipped primitives (`situation` / `multiStep`) carry no figure slot and
// lib/ is not ours to edit, so this does what `withEstimateFirst` does: all the
// work happens inside the returned closure, no new rng draw is taken, and the
// prompt is untouched (so the QG-1/QG-4 surface signature the guard already
// registered is unchanged). It rebuilds from the drafted item's
// `generator.params` — the very numbers its answer was computed from — which is
// what makes a contradicting picture unbuildable rather than merely unlikely.
// (Pattern established by c06 and reused by every A/B/C week since.)
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
// The anchor, drawn — hops on the number line
// ---------------------------------------------------------------------------

/** "…the first two hops of the count drawn from 0, landing on 5 and then on 10" */
const hopsAlt = (step: number): string =>
  `a number line with the first two hops of the count drawn from 0, landing on ${step} and then on ${2 * step}`;

/**
 * The line as it is at the START of the count: two hops down, the rest to go.
 *
 * `labels: 'none'` is the load-bearing setting. With the ticks labelled, a child
 * could read the landing number straight off the ladder and never take a hop —
 * the number-line twin of a ten-frame drawn after the bridge. So the only numbers
 * printed on this picture are the two the first two hops land on, which the prose
 * has already handed over as the size of a hop.
 */
function firstTwoHops(step: number, reach: number, asserts: FigureAssertion): BBFigure {
  return numberLine(
    {
      min: 0,
      max: reach,
      step,
      labels: 'none',
      marks: [
        { at: step, label: String(step), style: 'flag' },
        { at: 2 * step, label: String(2 * step), style: 'flag' },
      ],
      hops: [
        { from: 0, to: step, label: 'one hop' },
        { from: step, to: 2 * step, label: 'another hop' },
      ],
    },
    { alt: hopsAlt(step), asserts },
  );
}

/** ONE group of the count, labelled and asserted against the item's own param. */
const oneGroup = (n: number, label: string, alt: string, asserts: FigureAssertion): BBFigure =>
  counterGroups([{ count: n, noun: 'counters', label }], { alt, asserts });

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B4 — one step back along the number path.
 *
 * It opens the week because a hop is built out of exactly this: single steps,
 * taken without losing the place. Deliberately set on a paper number path and
 * run BACKWARDS, because B5 already retrieves B4 as a counter moving on along a
 * board (kit §E2.8), and two weeks should not open with the same move.
 */
const wStepBack = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-back',
    draw: (r) => {
      const start = r.int(12, 28);
      const back = r.int(2, 5);
      const name = one(r);
      return {
        prompt: `${name}'s marker is on ${start} on the paper number path. ${name} slides it back ${countNoun(back, 'places')}. Which number is it on now?`,
        answerValue: String(start - back),
        templateId: 'retr_word_sub_v1',
        params: { a: start, b: back },
        hints: [
          'Does sliding backwards make a number bigger or smaller?',
          'Touch each place you pass and say its number. Stop when you have used them all.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B4,
);

/**
 * A22 — counting in tens, the first skip count the child ever met. Posed on the
 * level's own model: a full ten-frame is one whole ten, so counting the frames
 * IS the tens count with nothing to remember.
 */
const wFullFrames = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'count-tens',
    draw: (r) => {
      const frames = r.int(2, 5);
      const name = one(r);
      return {
        prompt: `${name} fills ${countNoun(frames, 'ten-frames')} right up with counters. Count them in tens. How many counters is that?`,
        answerValue: String(10 * frames),
        templateId: 'a_count_tens_v1',
        params: { k: frames },
        units: 'counters',
        hints: [
          'How many counters does one full frame hold?',
          'Point at each frame in turn and take a whole ten as you pass it.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  A22,
);

/**
 * B16 — a purse of nickels, which is a fives count wearing money.
 *
 * The picture is the DATA here, not the answer in disguise: the child is handed
 * a pile of coins and has to count it, which is exactly B16's own design, and its
 * accessible name says which coins are there and never what they come to.
 */
const wNickelTin = asWarmup(
  withFigure(
    situation({
      situationType: 'combine',
      cognitiveOp: 'count-coins',
      draw: (r) => {
        const count = r.int(3, 8);
        const coins: CoinEntry[] = [{ cents: 5, count }];
        const total = 5 * count;
        const name = one(r);
        return {
          prompt: `[image: ${coinSetAlt(coins)}] ${name} tips ${coinName(5, count)} out of a tin. Count them in fives. How much money is that in cents?`,
          answerValue: String(total),
          templateId: 'money_coin_total_v1',
          params: { coins },
          units: 'cents',
          acceptableForms: [`${total}¢`, countNoun(total, 'cents')],
          hints: [
            'What is one of these coins worth on its own?',
            'Slide the coins along one at a time and take that much for each one.',
          ],
          errorTags: ['concept-misconception', 'fact-recall'],
        };
      },
    }),
    (p) => coinSet(p.coins as CoinEntry[], { asserts: { of: 'cents', equals: 'answer' } }),
  ),
  B16,
);

/** B10 — adding a whole ten, the arithmetic every rung of the tens count is. */
const wAddWholeTens = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-tens',
    draw: (r) => {
      const start = 10 * r.int(2, 5) + r.int(1, 9);
      const arriving = 10 * r.int(2, 4);
      const name = one(r);
      return {
        prompt: `A crate holds ${countNoun(start, 'satsumas')}. ${name} tips in ${countNoun(arriving, 'more satsumas')}, all in whole tens. How many satsumas are in the crate?`,
        answerValue: String(start + arriving),
        templateId: 'retr_add_within_100_v1',
        params: { a: start, b: arriving },
        units: 'satsumas',
        hints: [
          'Which part of the first number changes when whole tens arrive?',
          'Count the new tens on one at a time and leave the loose ones alone.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B10,
);

// ---------------------------------------------------------------------------
// Single-step core — one situation STRUCTURE per count, so the pages differ by
// what kind of story a count is hiding in, not by the noun on the page
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR ITSELF: equal hops along the number line, and the landing.
 *
 * `shown` rides in the params for the picture alone — `d_multiple_v1` reads
 * `base` and `k` only, and QG-13 reads only `shown`, so the second flag is pinned
 * to twice the item's own hop size and can never drift. The hop count starts at
 * four, so that flag is never the answer.
 */
const hopsOnTheLine = withFigure(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'hop-and-land',
    draw: (r) => {
      const step = r.pick(STEPS);
      const hops = r.int(4, 9);
      return {
        prompt: `[image: ${hopsAlt(step)}] A grasshopper hops along the number line in ${COUNT_NAME[step]}. It starts at 0. Which number does it land on after ${countNoun(hops, 'hops')}?`,
        answerValue: String(step * hops),
        templateId: 'd_multiple_v1',
        params: { base: step, k: hops, shown: 2 * step },
        hints: [
          'Is every hop in this count the same size, or do they change?',
          'Say the count out loud. Lift one finger for each hop, until your fingers run out.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  (p) => firstTwoHops(numOf(p, 'base'), numOf(p, 'base') * (numOf(p, 'k') + 1), assertsParam('shown', 'mark:1')),
);

/**
 * FIVES as a RATE: five arms to every starfish. The figure draws the arms of ONE
 * starfish and asserts that count — the unit of the count is the thing worth
 * drawing, and the total is the question.
 */
const armsOfTheStarfish = withFigure(
  situation({
    situationType: 'rate',
    cognitiveOp: 'count-in-fives',
    draw: (r) => {
      const found = r.int(3, 12);
      const name = one(r);
      return {
        prompt: `[image: the five arms of a single starfish] Every starfish has ${countNoun(5, 'arms')}. ${name} counts ${countNoun(found, 'starfish')} along the shore. How many arms is that in all?`,
        answerValue: String(5 * found),
        templateId: 'd_multiple_v1',
        params: { base: 5, k: found },
        units: 'arms',
        hints: [
          'Do all of these creatures have the same number of arms?',
          'Run the fives count along the shore, one number for each creature you pass.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  (p) => oneGroup(numOf(p, 'base'), 'one starfish', 'the five arms of a single starfish', assertsParam('base')),
);

/** TENS as a COMBINE: equal nets gathered into one bag. Figure = one net. */
const netsOfSatsumas = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'count-in-tens',
    draw: (r) => {
      const nets = r.int(3, 9);
      const name = one(r);
      return {
        prompt: `[image: one net and the ten satsumas inside it] A net at the greengrocer's holds ${countNoun(10, 'satsumas')}. ${name} carries ${countNoun(nets, 'nets')} to the till. How many satsumas is that?`,
        answerValue: String(10 * nets),
        templateId: 'd_multiple_v1',
        params: { base: 10, k: nets },
        units: 'satsumas',
        hints: [
          'Is the question about one net, or about everything on the counter?',
          'Take a whole ten for each net. Stop when the last net has had its turn.',
        ],
        errorTags: ['concept-misconception', 'fact-recall'],
      };
    },
  }),
  (p) => oneGroup(numOf(p, 'base'), 'one net', 'one net and the ten satsumas inside it', assertsParam('base')),
);

/**
 * TWOS as PART-WHOLE: a drawer whose whole is made of equal pairs.
 *
 * The drawer, not a washing line: c08 pegs number cards along a washing line and
 * counts on in steps, which is close enough to this week's content that sharing
 * the scene would read as one page written twice (kit §E2.8).
 */
const socksInPairs = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'count-in-twos',
    draw: (r) => {
      const pairs = r.int(4, 12);
      const name = one(r);
      return {
        prompt: `[image: one pair from the drawer and the two socks in it] Every pair in the sock drawer is ${countNoun(2, 'socks')}. ${name} counts ${countNoun(pairs, 'pairs')} in the drawer. How many socks is that?`,
        answerValue: String(2 * pairs),
        templateId: 'd_multiple_v1',
        params: { base: 2, k: pairs },
        units: 'socks',
        hints: [
          'How many socks does one pair make?',
          'Tap each pair in turn and take two of them along as you go.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  (p) => oneGroup(numOf(p, 'base'), 'one pair', 'one pair from the drawer and the two socks in it', assertsParam('base')),
);

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form ("will it pass …?"), before any working
//
// A snail crawling for a number of minutes, and not a row of equal objects: c07
// and c08 both lay dominoes end to end and ask how long the line is, so this is
// a RATE over time instead (kit §E2.8).
//
// The call is genuinely in doubt. A twos count of a few minutes never reaches
// twenty; a tens count nearly always does; a fives count sits on the fence. So
// the child has to look at the size of a hop AND at how many there are before
// picking up a pencil, which is the one habit that stops a count going astray.
//
// The base is served ONLY through the wrapper (kit §E2.2): a generator used both
// raw and wrapped ships two identical hint ladders, which spends two of the
// three the dedup allows on one idea. No figure, for the obvious reason — a
// marked number line beside "will it pass twenty?" answers the question.
// ---------------------------------------------------------------------------

const snailCrawl = situation({
  situationType: 'measurement',
  cognitiveOp: 'count-in-steps',
  draw: (r) => {
    const step = r.pick(STEPS);
    const minutes = r.int(3, 8);
    const name = one(r);
    return {
      prompt: `${name} watches a snail set off across the paving. It crawls ${countNoun(step, 'cm')} every minute. How far has it crawled after ${countNoun(minutes, 'minutes')}?`,
      answerValue: String(step * minutes),
      templateId: 'd_multiple_v1',
      params: { base: step, k: minutes },
      units: 'cm',
      hints: [
        'Which count steps along this trail one minute at a time?',
        'Take that step once for every minute, and read the number you stop on.',
      ],
      errorTags: ['task-comprehension', 'fact-recall'],
    };
  },
});

const predictSnailCrawl = withEstimateFirst(snailCrawl, 'will the snail crawl past twenty centimetres?');

// ---------------------------------------------------------------------------
// Discrimination — 2s or 5s? (FILL-ARCHITECTURE §4)
//
// The recipe's contrast, posed so that the GAP cannot answer it. The three
// numbers are not neighbours in any count, so there is nothing to measure
// between them: the only way in is to test each number against each count, which
// means reading its LAST DIGIT. That is the week's own mathematics, made into the
// only available method.
//
// The pools are chosen so exactly one count reaches all three:
//   - a fives run is built from ODD multiples of five, so the twos count (which
//     lands only on even numbers) and the tens count (only on numbers ending in
//     zero) both step over every one of them;
//   - a twos run is built from even numbers that no five divides, so the fives
//     count and the tens count both miss all three.
// "Counting in tens" is never the correct option, on purpose: every number the
// tens count reaches is also reached by the twos count AND the fives count, so
// keying it would key an item with three right answers. It earns its place as a
// distractor, which is where the child who reads any widely-spaced run as tens
// actually goes.
//
// Both pools hold six numbers, so `shuffle` consumes the same number of draws
// whichever branch is taken and the seed lands in the same place afterwards
// (kit §E2.4 — never a redraw loop).
// ---------------------------------------------------------------------------

/** Odd multiples of five: in the fives count, in neither of the others. */
const FIVES_ONLY = [15, 25, 35, 45, 55, 65] as const;
/** Even, and no five divides them: in the twos count, in neither of the others. */
const TWOS_ONLY = [12, 16, 24, 28, 32, 36] as const;

/** Multiples of ten: every one of the three counts lands on them. */
const TENS_ONLY = [20, 30, 40, 50, 60, 70] as const;

/**
 * WHY THE QUESTION ASKS FOR THE BIGGEST COUNT, not the only one.
 *
 * It used to read "only one of these counts reaches every one of them", and
 * `counting in tens` was then a LOGICALLY DEAD option: every multiple of ten is
 * also reached by twos and by fives, so no board can ever make tens the unique
 * count. Measured over 100 seeds it was offered on every exposure and keyed on
 * none — and a child who reasoned it out properly would notice, which is worse
 * than one who guessed.
 *
 * Widening the pool cannot fix that, because the impossibility is in the
 * arithmetic and not in the draw (LEARNINGS L36: prove impossibility first, then
 * reframe). So the question changed instead. "Which is the biggest count that
 * lands on every one of them?" is well defined on all three boards — on the
 * fives and twos boards only one count lands at all, and on a board of tens all
 * three land, so the biggest is tens. Every option is now reachable, and the
 * item has become the first quiet look at a shared count rather than a
 * three-door guess with one door nailed shut.
 */
const spotTheCount = discrimination({
  variant: 'structural',
  cognitiveOp: 'pattern-spot',
  draw: (r) => {
    const branch = r.int(1, 3); // 1 fives · 2 twos · 3 tens
    const pool = branch === 1 ? FIVES_ONLY : branch === 2 ? TWOS_ONLY : TENS_ONLY;
    const [a, b, c] = r
      .shuffle([...pool])
      .slice(0, 3)
      .sort((x, y) => x - y);
    const asksFives = branch === 1;
    // Every option the child can choose is named in the prompt, so the page reads
    // as one question rather than a question plus a surprise third door.
    return {
      prompt: `Three numbers are on the board: ${a}, ${b} and ${c}. Which is the biggest count that lands on all three — twos, fives or tens?`,
      correct: branch === 1 ? COUNT_OPTION[5] : branch === 2 ? COUNT_OPTION[2] : COUNT_OPTION[10],
      distractors: branch === 3
        ? [
            {
              text: COUNT_OPTION[2],
              errorTag: 'concept-misconception' as const,
              rationale: 'A count of twos does land on all three, but it is not the biggest count that does — tens land on them as well.',
            },
            {
              text: COUNT_OPTION[5],
              errorTag: 'concept-misconception' as const,
              rationale: 'A count of fives does land on all three, but tens land on them too, and a ten is the bigger step.',
            },
          ]
        : asksFives
        ? [
            {
              text: COUNT_OPTION[2],
              errorTag: 'concept-misconception' as const,
              rationale: 'A count of twos lands only on even numbers, and every number on this board finishes on a five.',
            },
            {
              text: COUNT_OPTION[10],
              errorTag: 'representation-misread' as const,
              rationale: 'Reads a widely spaced run as a tens run, though a count of tens lands only on numbers ending in a zero.',
            },
          ]
        : [
            {
              text: COUNT_OPTION[5],
              errorTag: 'representation-misread' as const,
              rationale: 'A count of fives lands only on numbers ending in a five or a zero, and none of these numbers ends in either.',
            },
            {
              text: COUNT_OPTION[10],
              errorTag: 'concept-misconception' as const,
              rationale: 'Reads a widely spaced run as a tens run, though the tens count would step straight over all three numbers.',
            },
          ],
      hints: [
        'What is at the end of each of these three numbers?',
        'Test the three numbers against one count at a time. Keep the biggest count that works.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — run the count, then bring in the extras (the pre-× move)
//
// Both chains are two genuine moves a child performs in that order, and
// `stepCount` is read off the chain rather than claimed. What differs between
// them is what the SECOND move is about: single steps taken past the last hop on
// the line, or loose ones that never made it into a group at all. A child who has
// only met one of those has learnt a story, not a method.
// ---------------------------------------------------------------------------

/**
 * The anchor's own two-step: equal hops, then single steps.
 *
 * The chain opens on the first quantity the picture states — the size of a hop —
 * which is also what the figure's mark asserts against, so the picture and the
 * arithmetic start from the same number by construction. The single steps are
 * bounded below the hop size, so the extras can never add up to another whole
 * hop; that would collapse the two moves into one and the item would stop
 * diagnosing anything.
 */
const msLineHops = withFigure(
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const step = r.pick(STEPS);
      const hops = r.int(4, 9);
      // Below the hop size, and at least one: 2 is the smallest step, so a single
      // step is the only legal extra there. Computed, so every draw is legal on
      // its first attempt (kit §E2.4).
      const extra = r.int(1, step - 1);
      return {
        prompt: `[image: ${hopsAlt(step)}] A counter starts at 0 on the number line and hops along in ${COUNT_NAME[step]}. After ${countNoun(hops, 'hops')} it moves on ${countNoun(extra, 'single steps')}. Which number is the counter on now?`,
        initN: step,
        steps: [
          { op: 'mul', n: hops, d: 1 },
          { op: 'add', n: extra, d: 1 },
        ],
        hints: [
          'Which part of this journey is made of equal hops, and which part is not?',
          'Finish the equal hops first and hold that number, then walk the single steps on.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const step = numOf(p, 'initN');
    const chain = p.steps as Array<{ n: number }>;
    return firstTwoHops(step, step * (chain[0].n + 1) + chain[1].n, assertsParam('initN', 'mark:0'));
  },
);

/**
 * The same two moves in a story, with the extras arriving as ones that never
 * joined a group. This is the shape the recipe is really after: the count carries
 * the whole groups, and the loose ones have to be brought in afterwards, by hand.
 *
 * The loose count stops below five so a fifth loose hairband is never really
 * another card — which is what would blur the boundary between the two moves.
 */
const msHairbandCards = withFigure(
  multiStep({
    situationType: 'combine',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const cards = r.int(3, 9);
      const loose = r.int(1, 4);
      const name = one(r);
      return {
        prompt: `[image: one card and the five hairbands on it] Every card on the stall holds ${countNoun(5, 'hairbands')}. ${name} buys ${countNoun(cards, 'cards')}, then finds ${countNoun(loose, 'loose hairbands')} in a coat pocket. How many hairbands does ${name} have?`,
        initN: 5,
        steps: [
          { op: 'mul', n: cards, d: 1 },
          { op: 'add', n: loose, d: 1 },
        ],
        units: 'hairbands',
        hints: [
          'Which of these arrived in whole groups, and which arrived on their own?',
          'Run the count along the whole groups first. Only then bring in the ones on their own.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) => oneGroup(numOf(p, 'initN'), 'one card', 'one card and the five hairbands on it', assertsParam('initN')),
);

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header: the recipe's own worked instance (…20, 25, 30, 34) is a
// landing that falls exactly one short, which is precisely what
// `a_verify_count_slip_v1` in `slip:'skip-count'` mode returns. So the shown
// number is the real output of a named transform and the true landing is
// code-computed from the same params. The step and the length ride along in the
// params purely so the written run and the truth are drawn together; the template
// reads only `n` and `slip`.
//
// Every number before the last one in the written run is CORRECT, which is what
// makes this an analysis rather than a hunt: the pattern holds all the way along
// and then it does not, and the child has to find where.
// ---------------------------------------------------------------------------

const eaLostThePattern = errorAnalysis({
  verifyTemplateId: 'a_verify_count_slip_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const step = r.pick(STEPS);
    const len = r.int(5, 7);
    return { n: step * len, slip: 'skip-count', step, len };
  },
  build: (v, p, r) => {
    const step = Number(p.step) as Step;
    const len = Number(p.len);
    const written = Array.from({ length: len - 1 }, (_, i) => String(step * (i + 1)));
    const name = one(r);
    return {
      prompt: `${name} counted in ${COUNT_NAME[step]} and wrote this down: ${written.join(', ')}, ${v.wrong}.`,
      extension: `Write the number that belongs at the end of ${name}'s count. Then tell ${name} in one sentence what every hop in a count must be.`,
      hints: [
        'How far apart are the numbers at the start of this count?',
        'Put a finger on each pair of numbers in turn. Measure the gap between them.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
      answerKeywords: [
        'every hop in a count is the same size',
        'the last hop was one too small',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 production — the pattern hunt, and the WHY (§4 signature)
//
// Authored rather than drawn: the child writes two lists and then argues from
// them, and the lists have to be the same two lists for every learner if the
// argument is going to be a shared one. The twos count is chosen because its
// "why" is the one a six-year-old can actually reach — a hop of two crosses the
// number in between, so there is no way for the count to stop on it.
// ---------------------------------------------------------------------------

const twosSkippedHunt = reasoning({
  prompt:
    'Count in twos from 2 and write down every number, up to twenty. Underneath, write the numbers your count hopped over. Then write one sentence: why can a count of twos never land on one?',
  value:
    'the count hops over 3, 5, 7, 9, 11, 13, 15, 17 and 19 — every hop is two long, so it crosses the number in between and cannot stop there',
  acceptableForms: [
    'every hop is two long',
    'it crosses the number in between',
    'it hops over the number in between',
    'the hop is too big to stop there',
  ],
  keywords: true,
  hints: [
    'What do you notice about the numbers your count hopped over?',
    'Put one finger on a landing number and one on the next. Count the numbers your hop crossed.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

/**
 * The claim that settles the fives pattern, and it is deliberately not the tidy
 * half of it. A child who has learnt "fives end in five" is right about every
 * other landing and wrong about the rest, so 'sometimes' is the only defensible
 * word — and saying why means describing the swing between five and zero, which
 * is the whole pattern rather than half of it.
 */
const asnFivesEndInFive = classify({
  prompt:
    'Always, sometimes, or never true? A number a count of fives lands on ends in a five. Write one sentence saying how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'representation-misread',
      rationale: 'Keeps half of the fives pattern and drops the other half, so every landing number ending in a zero is ruled out.',
    },
    {
      text: 'never',
      errorTag: 'concept-misconception',
      rationale: 'Rules out the landing numbers that really do end in a five, which is every other number the count reaches.',
    },
  ],
  hints: [
    'Can you find a fives landing number that does not end in a five?',
    'Write the fives count out as far as fifty. Then read the ends of the numbers.',
  ],
  errorTags: ['representation-misread', 'concept-misconception'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB18 = makeWeekBuilder({
  level: 'B',
  week: 18,
  conceptId: 'skip-counting-2-5-10',
  conceptName: 'Skip counting 2s, 5s, 10s',
  strandTags: ['multiplication-division', 'number-sense-counting'],
  prerequisiteWeeks: [A22, B4, B10, B16],
  pedagogyContract: 'v2',
  conceptualAnchor: 'hops on the number line',
  conceptFamily: 'operation',
  deepeningDelta:
    'A22 taught counting in tens off towers of ten, where the tens are already bundled and the count is a way of reading a picture. B18 takes the bundling away and puts the count on the number line, where nothing is grouped for you: the hop has to be held at the same size by the child, in twos and fives as well as tens. What is genuinely new is the second half — the landing numbers. A22 never asked what the numbers a count says have in common; this week that pattern becomes evidence a child can check an answer against, and the seed of the facts C7 will name.',
  explanation: {
    hook:
      'Counting to fifty one number at a time takes an age. This week you learn to hop there instead.',
    whyBeforeHow:
      'Counting one at a time is slow, and it is easy to lose your place. So we count in equal jumps instead. Picture hops on the number line. Every hop is exactly the same size. Each hop lands you further along the line. Because the hops never change size, the numbers you land on make a pattern. Count in fives and you land on 5, 10, 15, 20. Every one of those landing numbers ends in a five or a zero. Count in tens and every landing number ends in a zero. Count in twos and you hop straight over the number in between. So the landing numbers are worth watching. They tell you whether the count is still on its ladder. A fives count can never land on a number ending in three.',
    script: [
      {
        say: 'Watch me count in fives. I put my finger on 0. My first hop lands on 5, my next one on 10. I keep every hop exactly the same size, and that is the whole trick.',
        visual: 'A number line from 0 to 30 marked in fives, with the first two hops drawn from 0.',
        figure: numberLine(
          {
            min: 0,
            max: 30,
            step: 5,
            labels: 'majors',
            marks: [
              { at: 5, label: '5', style: 'flag' },
              { at: 10, label: '10', style: 'flag' },
            ],
            hops: [
              { from: 0, to: 5, label: 'one hop' },
              { from: 5, to: 10, label: 'another hop' },
            ],
          },
          { alt: 'a number line from 0 to 30 marked in fives, with the first two hops of five drawn from 0' },
        ),
      },
      {
        say: 'Now the whole count, out loud: 5, 10, 15, 20, 25, 30. Look at the end of each number. Five, zero, five, zero. The fives count keeps swapping between those two endings.',
        visual: 'The same line with every fives landing flagged, all the way to 30.',
        figure: numberLine(
          {
            min: 0,
            max: 30,
            step: 5,
            labels: 'majors',
            marks: [
              { at: 5, style: 'flag' },
              { at: 10, style: 'flag' },
              { at: 15, style: 'flag' },
              { at: 20, style: 'flag' },
              { at: 25, style: 'flag' },
              { at: 30, style: 'flag' },
            ],
          },
          { alt: 'a number line from 0 to 30 with every fives landing flagged' },
        ),
      },
      {
        say: 'Here is the twos count: 2, 4, 6, 8, 10. Notice where I do not land. Each hop is two long. It crosses the number in between, so there is nowhere to stop.',
        visual: 'A number line from 0 to 12 with every number labelled and only the twos landings flagged.',
        figure: numberLine(
          {
            min: 0,
            max: 12,
            step: 1,
            labels: 'all',
            marks: [
              { at: 2, style: 'flag' },
              { at: 4, style: 'flag' },
              { at: 6, style: 'flag' },
              { at: 8, style: 'flag' },
              { at: 10, style: 'flag' },
            ],
            hops: [
              { from: 0, to: 2, label: 'one hop' },
              { from: 2, to: 4, label: 'another hop' },
            ],
          },
          { alt: 'a number line from 0 to 12 with all the numbers shown and the twos landings flagged' },
        ),
      },
      {
        say: 'One habit before I write any answer down. I check the end of the number I landed on. A fives count that finishes on 32 has gone wrong somewhere. I would rather find that out myself.',
        visual: 'The fives landings 5 to 35 along one line — every landing ends in a five or a zero.',
        figure: numberLine(
          { min: 0, max: 35, step: 5, labels: 'all' },
          { alt: 'a line from 0 to 35 with every landing of five labelled: 5, 10, 15, 20, 25, 30, 35' },
        ),
      },
    ],
    summary:
      'Skip counting is a run of equal hops. Keep every hop the same size and keep count of the hops. Then check the number you landed on: a tens landing ends in a zero, a fives landing ends in a five or a zero, and a twos landing never lands on the number in between.',
    vocabulary: [
      { term: 'skip count', kidGloss: 'counting in equal jumps instead of one at a time' },
      { term: 'hop', kidGloss: 'one equal jump along the number line' },
      { term: 'landing number', kidGloss: 'a number the count stops on after a hop' },
      { term: 'the ending', kidGloss: 'the digit on the end of a number, which tells you which counts reach it' },
    ],
  },
  guidedExamples: [
    {
      ...ge(18, 1, 'modeled', 'Count in fives from 0. Which number does the seventh hop land on?', [
        {
          teacherSay:
            'Watch me. I start at 0 and I keep every hop the same size. Five, ten, fifteen, twenty. I say one number for each hop. I keep the hops on my fingers so I do not lose count.',
        },
        {
          teacherSay: 'Four fingers are up, so I have taken four hops. Three hops to go — where do they put me?',
          expected: '35',
        },
      ], '35'),
      visual: 'A number line to 40 marked in fives, with the seventh landing flagged.',
      figure: numberLine(
        {
          min: 0,
          max: 40,
          step: 5,
          labels: 'majors',
          marks: [{ at: 35, label: '35', style: 'flag' }],
          hops: [
            { from: 0, to: 5, label: 'one hop' },
            { from: 5, to: 10, label: 'another hop' },
          ],
        },
        {
          alt: 'a number line from 0 to 40 marked in fives, with the seventh landing flagged',
          asserts: assertsAnswer,
        },
      ),
    },
    {
      ...ge(18, 2, 'completion', "A net at the greengrocer's holds 10 satsumas. Esme carries 6 nets to the till. How many satsumas is that?", [
        { teacherSay: 'Which count does a story about equal nets of ten hand you?', expected: 'the tens' },
        { childDo: 'Take a whole ten for each net, and say the number the last net reaches.', expected: '60' },
      ], '60'),
      // COMPLETION fade: the child produces 60, so the picture shows only what a
      // single net holds. Drawing all six nets would finish the count for them.
      visual: 'One net and the ten satsumas inside it. The other nets are yours to count on.',
      figure: counterGroups([{ count: 10, noun: 'counters', label: 'one net' }], {
        alt: 'one net and the ten satsumas inside it',
      }),
    },
    ge(18, 3, 'prompted', 'Every pair in the sock drawer is 2 socks. Rafi counts 9 pairs. How many socks is that?', [
      { childDo: 'Tap each pair in turn and take two along as you go, right to the last pair.', expected: '18' },
    ], '18'),
    {
      // Independent: no picture at all, and the extras arrive after the hops.
      // Deciding that the equal hops are one job and the single steps another IS
      // the task, so any drawing of the two parts would hand over the plan.
      ...ge(18, 4, 'independent', 'A counter starts at 0 and hops along the number line in tens. After 4 hops it moves on 3 single steps. Which number is it on now? Solve cold.', [
        { childDo: 'Finish the equal hops first, then walk the single steps on from there.', expected: '43' },
      ], '43'),
    },
  ],
  days: [
    // Day 1 — concept echo: the anchor first, then the same count hiding in three
    // different kinds of story. Single-step only, no trap and no chain yet.
    [
      { gen: wStepBack, diff: 2 },
      { gen: wFullFrames, diff: 2 },
      { gen: hopsOnTheLine, diff: 2 },
      { gen: armsOfTheStarfish, diff: 3 },
      { gen: netsOfSatsumas, diff: 3 },
    ],
    // Day 2 — fluency + application: the size prediction, the 2s-or-5s spot, and
    // the week's first two-step, beside the twos page it is built on.
    [
      { gen: wNickelTin, diff: 2 },
      { gen: predictSnailCrawl, diff: 3 },
      { gen: spotTheCount, diff: 3 },
      { gen: msLineHops, diff: 4 },
      { gen: socksInPairs, diff: 3 },
    ],
    // Day 3 — interleave: the trap and the prediction again, against the second
    // chain and the anchor page, so the shape of a page never signals the task.
    [
      { gen: wAddWholeTens, diff: 2 },
      { gen: spotTheCount, diff: 4 },
      { gen: predictSnailCrawl, diff: 4 },
      { gen: msHairbandCards, diff: 4 },
      { gen: hopsOnTheLine, diff: 3 },
    ],
    // Day 4 — word problems: both chains beside the two single-step counts they
    // are built out of, so "it must need two steps" never becomes the cue.
    [
      { gen: wStepBack, diff: 3 },
      { gen: msLineHops, diff: 4 },
      { gen: msHairbandCards, diff: 4 },
      { gen: armsOfTheStarfish, diff: 3 },
      { gen: socksInPairs, diff: 3 },
    ],
    // Day 5 — the signature: the count that lost its hop taken apart, the twos
    // pattern hunted down and argued for, and the claim that settles the fives.
    [
      { gen: wFullFrames, diff: 2 },
      { gen: eaLostThePattern, diff: 4 },
      { gen: twosSkippedHunt, diff: 3 },
      { gen: asnFivesEndInFive, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: when a skip count comes out wrong, listen to it rather than checking the answer. Nearly every slip is one of two things — a hop that changed size somewhere in the middle, or the right hops counted the wrong number of times. Ask your child to say the count out loud while lifting one finger per hop; the two slips sound completely different, and the finger tells you which one it was. Stairs, socks and the fives on a clock face all give you a count to practise on without a worksheet in sight.',
  ],
  puzzle: (r) => {
    // A secret-number puzzle, and the clues do the work no core page asks for:
    // nothing here is a count to be run forward. Two counts have to be tested
    // against a range, and then the child has to argue that nothing else fits.
    //
    // Unique by construction. Between lo and hi the fives count reaches exactly
    // three numbers — hidden, hidden minus five and hidden plus five — and only
    // the middle one is even, because a multiple of ten is the one place the
    // fives and twos counts can meet. The next multiples of ten in either
    // direction fall outside the range, so no redraw loop is needed (kit §E2.4).
    const hidden = 10 * r.int(2, 8);
    const lo = hidden - 8;
    const hi = hidden + 8;
    return {
      id: 'B18-PZ-01',
      title: 'Puzzle Grove: The Number Behind the Code',
      puzzleType: 'logic',
      prompt: `[image: a bare number line running from ${lo} to ${hi} with nothing marked on it] A number is hiding, and there are three clues. A count of fives reaches it. A count of twos reaches it too. It is bigger than ${lo} and smaller than ${hi}. Which number is hiding? Then say how you know that no other number fits all three clues.`,
      figure: numberLine(
        { min: lo, max: hi, step: 1, labels: 'ends' },
        { alt: `a bare number line running from ${lo} to ${hi} with nothing marked on it` },
      ),
      answer: {
        value: String(hidden),
        acceptableForms: [String(hidden)],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which numbers can BOTH of these counts reach?',
        'Write down the fives landings inside this stretch. Cross out the ones a twos count misses.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  // Every core page is handed a count and asked to run it. The puzzle is handed
  // no count at all: it has to test two of them against a stretch of the line and
  // then argue for completeness. Two moves, and neither is a Day-1 move.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'clue-deduction' },
  sprint: {
    skill: 'Adding within ten — the single jump a twos or fives count repeats',
    sourceWeek: B5,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_10_facts_v1',
    params: { min: 1, max: 9 },
  },
  mastery: [
    { gen: hopsOnTheLine, diff: 3 },
    { gen: msLineHops, diff: 4 },
    { gen: armsOfTheStarfish, diff: 3 },
    { gen: msHairbandCards, diff: 4 },
    { gen: netsOfSatsumas, diff: 3 },
    { gen: spotTheCount, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: three single-step counts, one per structure — the anchor hops along the number line, fives as a rate (arms to a creature), tens as equal groups combined — with the first-two-hops line preserved on 01 and the one-group picture on 03/05. 02/04: the two chains, one finishing with single steps taken past the last hop and one with loose ones that never joined a group, both keeping their opening-quantity figure. 06: the 2s-or-5s spot, drawn as a fives run on half the seeds and a twos run on the other half, so a form cannot be passed by choosing one count twice. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'hop-changes-size',
      description: 'Starts the count correctly and then takes a hop of the wrong size, so the run holds the right pattern up to one place and the wrong one after it.',
      exampleWrongAnswer: 'a fives count written 5, 10, 15, 20, 25, 30, 34',
      distractorRationale: 'Offer the landing a count reaches when one hop falls a single step short of the rest.',
      reteachPointer: 'explanation/script[0] (I keep every hop exactly the same size)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'wrong-counts-pattern',
      description: 'Applies one count\'s landing pattern to another — reading "ends in a five or a zero" as a test for the tens count, or expecting every fives landing to end in a five.',
      exampleWrongAnswer: '45 offered as a number a count of tens reaches',
      distractorRationale: 'Offer a number that belongs to a neighbouring count rather than the one the item names.',
      reteachPointer: 'explanation/script[1] (the fives count keeps swapping between those two endings)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'lands-one-hop-out',
      description: 'Holds the hop size steady but loses track of how many hops have been taken, so the answer lands one whole group short or one over.',
      exampleWrongAnswer: 'seven hops of five answered as 30',
      distractorRationale: 'Offer the landing one whole hop away from the truth.',
      reteachPointer: 'guidedExamples/B18-GE-01 (keep the hops on your fingers so you do not lose count)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-before-the-extras',
      description: 'Runs the count over the whole groups and reports that, leaving out the single steps or the loose ones the question also asked for.',
      exampleWrongAnswer: 'a hops-then-single-steps journey answered with the last hop\'s landing',
      distractorRationale: 'Offer the landing of the equal hops alone, without the extras the second move brings in.',
      reteachPointer: 'guidedExamples/B18-GE-04 (finish the equal hops first, then walk the single steps on)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'count-not-yet-quick',
      description: 'Knows what to do and has to rebuild the count from its start every time, so the answer arrives too slowly for the rest of the method to hold together.',
      exampleWrongAnswer: 'the fives count restarted from 5 to reach the sixth landing',
      distractorRationale: 'Offer a landing one step out from the true one, which is what rebuilding a count in a hurry produces.',
      reteachPointer: 'explanation/summary (keep count of the hops), then the 2-minute adding-within-ten sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Skip counting in twos, fives and tens — running a count of equal hops along the number line, using it to count equal groups without counting every single thing, bringing in the extras that never joined a group, and reading the landing numbers as a pattern that can check an answer.',
    improvingCandidates: [
      'holding every hop in a count at the same size',
      'keeping track of how many hops have been taken',
      'checking the ending of a landing number before writing it down',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping the hop the same size the whole way along — a count that changes hop mid-run is the slip this week is built around',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping each count\'s pattern to itself, so the fives rule is not used to test the tens count',
      },
      {
        errorTag: 'task-comprehension',
        text: 'finishing a story that has extras on the end, rather than stopping when the equal groups run out',
      },
      {
        errorTag: 'fact-recall',
        text: 'the twos, fives and tens counts, which the two-minute sprint keeps quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted in equal hops and then checked the number you landed on — that check is the habit this whole week is built on.',
      questionForChild: 'If every net holds 10 satsumas, how many satsumas are in 6 nets — and which count did you use to get there?',
      schoolSyncHook: 'If your child\'s class calls this "counting in multiples" rather than "skip counting", tell us and we will use the words they hear.',
    },
    vocabularyForParent: [
      'skip count (counting in equal jumps: 5, 10, 15 …)',
      'hop (one equal jump along the number line)',
      'landing number (a number the count stops on, whose ending tells you which count it belongs to)',
    ],
  },
});
