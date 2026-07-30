/**
 * Level B · Week 16 — "Money" (conceptId: money).
 *
 * FILL-ARCHITECTURE §4 row B16: anchor "count coins by value order"; multi-step
 * "pay then count what's left"; error-analysis "counts a nickel as 1";
 * discrimination "3 pennies vs 1 dime (more coins ≠ more money)"; Day-5
 * signature "two ways to make 25¢ (set answer)".
 *
 * Family: `lib/money.ts` (G3). Every generator it ships is used here —
 * `countCoins` (the anchor read), `payFewestCoins` (the value-order rule as a
 * strategy), `payShortfall` and `spendChain` (the money-change pair),
 * `twoWaysToMake` (the Day-5 set answer), `moreValueChoice` and `totalChoice`
 * (the two discriminations), `miscountEA('nickel-as-1')` (the recipe's named
 * slip). The week adds three items of its own: the metacognitive change item,
 * the saving chain, and the Always/Sometimes/Never claim that settles the trap.
 *
 * THE WEEK'S CLAIM is that a pile of coins carries TWO numbers — how many coins
 * there are, and how much money they make — and that only the second one is the
 * money. Everything here is built to force that reading rather than assert it:
 *  - value order is the strategy, not a tidy habit: `payFewestCoins` is answered
 *    by "take the biggest coin that still fits", which is provably optimal for
 *    {25,10,5,1}, so the child is taught a rule that always works rather than a
 *    heuristic that sometimes does;
 *  - the size trap is DRAWN, not described. `coin-set` renders a dime smaller
 *    than a nickel, and `moreValueChoice` ships with `showValues:false`, so a
 *    child who could read "10¢" off the dime is no longer being asked the
 *    question. The contrast table cuts both ways (sometimes the many-coin pile
 *    really is worth more), so "fewer coins always wins" cannot be learned as a
 *    replacement rule either — which is exactly why the Day-5 claim is
 *    SOMETIMES, and why the week's own pages are the evidence for it;
 *  - the error-analysis shows a total a real misconception really produces:
 *    `money_verify_coin_total_v1` recomputes the nickel-as-1 count from the same
 *    coins the picture is drawn from, and QG-11 re-derives both numbers.
 *
 * CONCEPT FAMILY (kit §A). Declared `'operation'` — money at this band IS
 * addition and subtraction wearing coins, so the week owes the full row (≥2
 * multi-step) and pays it three times over: `spendChain` twice (pay, pay, count
 * what is left) and `saveJarChain` once (the same move run forwards). Both
 * compose strictly-prior-week arithmetic and are marked `usesPriorSkill`.
 *
 * CURRENCY (FILL-ARCHITECTURE §2 G3; QG-12a). Every amount on every page is an
 * integer number of cents from end to end, and reaches prose only through
 * `centsLabel` — `¢` below a dollar, and `$` at or above one, where it delegates
 * to `format.ts`. A fractional dollar never exists in this week, so "$0.5" has
 * no way in. The saving chain is the one page that crosses a dollar (its jar can
 * finish anywhere from 71¢ to $1.32), which is deliberate: it is where a
 * six-year-old meets the fact that a hundred cents has a second name, and it is
 * the only place in the week where the `$` arm of `centsLabel` is exercised.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Every coin item carries a
 * `coin-set` built from the same coin list its answer sums, in three postures:
 *  - "how much is this?" — the picture IS the question, so it shows the coins
 *    and asserts their total (`of:'cents'`). Reading it is the task; the alt
 *    names the coins and never their worth, so a child on a screen reader does
 *    the same work as a child looking at the page;
 *  - "how much is left / how much more?" — the picture states the GIVEN (what
 *    the purse holds) and asserts against that param, never against the answer;
 *  - the coin BANK on `payFewestCoins` and on the puzzle asserts nothing: a bank
 *    is an offer of coins, and it makes no claim about the price.
 *
 * KNOWN FAMILY LIMIT, recorded for E2/E17: `drawPurse` inside `lib/money.ts` is
 * private and capped at 95¢, so a family item can never cross a dollar. This
 * week therefore draws its own purses for the two items it wrote itself
 * (`purse` below) — deterministically, with no redraw loop (kit §E2.4): every
 * combination of the four draws is legal by construction, so nothing is ever
 * rejected and re-rolled.
 *
 * Retrieval is backward-only into B2 (tens and ones — a dime IS a bundle of
 * ten), B10 (adding tens — counting dimes), B13 (addition within 100) and B14
 * (subtraction within 100), which are the four pieces of arithmetic every coin
 * page on this week runs on.
 */

import { asWarmup, classify } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { withEstimateFirst } from '../lib/metacog';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { frame } from '../lib/contexts';
import { article, countNoun, unitFor } from '../lib/format';
import {
  assertsAnswer,
  assertsParam,
  coinName,
  coinNoun,
  coinSet as coinSetFigure,
  coinSetAlt,
  normalizeCoins,
} from '../lib/figures';
import type { CoinCents, CoinEntry } from '../lib/figures';
import {
  centsLabel,
  countCoins,
  miscountEA,
  moreValueChoice,
  payFewestCoins,
  payShortfall,
  spendChain,
  totalCents,
  totalChoice,
  twoWaysToMake,
} from '../lib/money';
import type { ItemDraft } from '../shared';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B2 = { level: 'B' as const, week: 2 };
const B10 = { level: 'B' as const, week: 10 };
const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/** The shop the money family already buys from, so the week reads as one place. */
const SHOP_NOUNS = frame('shop-change').nouns;

/** "an eraser" / "a pencil" — the article decided by sound, in format.ts. */
const anItem = (noun: string): string => article(unitFor(1, noun));

/** The accepted written forms of a cents answer ("42¢", "42 cents"). */
const centsForms = (cents: number): string[] => [centsLabel(cents), countNoun(cents, 'cents')];

// ---------------------------------------------------------------------------
// Purses this week draws for itself
//
// One draw per denomination, with ranges chosen so EVERY combination is already
// legal: 2–7 coins (countable at a glance, drawable in one row) worth 11¢–77¢.
// Nothing is ever rejected, so there is no redraw loop to make a later item's
// operands depend on this one (kit §E2.4 / L19).
// ---------------------------------------------------------------------------

function purse(r: Rng, quarters: readonly number[]): CoinEntry[] {
  return normalizeCoins([
    { cents: 25, count: r.pick(quarters) },
    { cents: 10, count: r.int(1, 2) },
    { cents: 5, count: r.int(0, 1) },
    { cents: 1, count: r.int(1, 2) },
  ]);
}

/** Purses for the two week-local money items: 36¢–77¢, always holding a quarter. */
const WITH_QUARTERS = [1, 2] as const;
/** Purses for the puzzle: 11¢–52¢, so the hidden coin still matters to the total. */
const MAYBE_QUARTER = [0, 1] as const;

// ---------------------------------------------------------------------------
// withDrawn — attach a picture built from the item's OWN drawn coins
//
// `situation()` and `multiStep()` ship the numbers their answers come from, but
// not the coin LIST those numbers were counted off (the params carry a total, or
// a chain). So the draw closure posts what it drew into a one-slot box and the
// decorator reads it immediately afterwards — `drawUniqueItem` returns the draft
// of its LAST build call, so the box always holds that same draw. All work
// happens inside the returned closure and the prompt is untouched, so the
// QG-1/QG-4 surface signature the guard registered is unchanged.
// ---------------------------------------------------------------------------

interface Box<T> {
  last: T | null;
}

function box<T>(): Box<T> {
  return { last: null };
}

function withDrawn<T>(b: Box<T>, base: ItemGen, decorate: (drawn: T) => Partial<ItemDraft>): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (b.last === null) throw new Error('b16/withDrawn: the draw posted no coins to build the picture from');
    return { ...draft, ...decorate(b.last) };
  };
}

// ---------------------------------------------------------------------------
// withFreshPile — no two pages show the same handful of coins
//
// Found by reading the generated week, not by any gate: 88% of seeds put the
// SAME pile on two pages, and some put it twice on one day. The surface guard
// cannot see it, because it keys on the prompt's numeric tokens and the item
// TYPE — "[image: 2 quarters, 2 dimes and 2 nickels] How much is this?" and the
// error-analysis page showing that identical pile are different types with
// different token lists, so both pass. But the child sees one picture twice, and
// on the money week the picture IS the item.
//
// The key is namespaced and registered in the pack's OWN TupleGuard, which is
// the only per-pack scratch space a week builder is handed — module-level state
// would leak between packs and destroy seed-stability (L19). Redraws advance the
// seeded stream and the loop is bounded, so the same seed always lands on the
// same accepted draft.
// ---------------------------------------------------------------------------

/** The pack-scoped identity of a handful of coins. */
function pileKey(coins: readonly CoinEntry[]): string {
  return `b16-pile|${normalizeCoins(coins).map((c) => `${c.cents}x${c.count}`).join(',')}`;
}

function withFreshPile(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    let draft = base(rng, guard, difficulty);
    for (let i = 0; i < 12; i++) {
      const fig = draft.figure;
      // Only piles the child is asked to READ are guarded. `payFewestCoins`
      // draws the coin BANK — one of each, on purpose, every time — so it is
      // never wrapped and never registered.
      if (!fig || fig.type !== 'coin-set') return draft;
      const key = pileKey(fig.params.coins);
      if (!guard.taken(key)) {
        guard.add(key);
        return draft;
      }
      draft = base(rng, guard, difficulty);
    }
    return draft;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B2 — tens and ones, bundled. This is the week's quietest lesson: ten straws
 * tied together become one thing you count as "a ten", which is the whole idea
 * of a dime arriving a day early and without any coins in it.
 */
const wBundles = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'pv-decompose',
    draw: (r) => {
      const n = r.int(23, 89);
      const who = one(r);
      return {
        prompt: `${who} ties ${countNoun(n, 'craft sticks')} into bundles of ten. How many full bundles is that?`,
        answerValue: String(Math.floor(n / 10)),
        templateId: 'tens_ones_decompose_v1',
        params: { n },
        units: 'bundles',
        hints: [
          'How many single sticks does one whole bundle swallow up?',
          'The tens digit counts the finished bundles; the ones digit is what stays loose.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  B2,
);

/** B10 — adding tens, which is what counting a row of dimes turns out to be. */
const wTensSequence = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-by-tens',
    draw: (r) => {
      const start = r.int(12, 58);
      return {
        prompt: `These numbers climb in tens: ${start}, ${start + 10}, ${start + 20}, ▢. What number fills the box?`,
        answerValue: String(start + 30),
        templateId: 'retr_count_by_tens_v1',
        params: { start },
        hints: [
          'Which digit is doing the changing as this list grows?',
          'Put one more ten on the last number written. Leave the ones digit where it sits.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B10,
);

/** B13 — two-digit addition, the arithmetic under every coin total. */
const wJoinCollection = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add',
    draw: (r) => {
      const a = r.int(24, 58);
      const b = r.int(13, 39);
      const who = one(r);
      return {
        prompt: `${who} has ${countNoun(a, 'pine cones')} on the nature table. ${who} brings ${countNoun(b, 'pine cones')} more in. How many pine cones is that altogether?`,
        answerValue: String(a + b),
        templateId: 'add_within_100_v1',
        params: { a, b },
        units: 'pine cones',
        hints: [
          'Does this story push two groups together, or pull one apart?',
          'Join the tens first, then the ones. Trade ten loose ones for a fresh ten if needed.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B13,
);

/** B14 — two-digit subtraction, the arithmetic under every "what is left". */
const wTakeFromTray = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'sub',
    draw: (r) => {
      const minuend = r.int(52, 95);
      const subtrahend = r.int(14, 39);
      return {
        prompt: `A jar on the desk holds ${countNoun(minuend, 'paper clips')}. ${countNoun(subtrahend, 'paper clips')} are taken out to pin up a wall display. How many paper clips stay in the jar?`,
        answerValue: String(minuend - subtrahend),
        templateId: 'sub_2digit_regroup_v1',
        params: { minuend, subtrahend },
        units: 'paper clips',
        hints: [
          'Are the clips arriving in the jar, or leaving it?',
          'Begin with the whole jarful, then take the group that leaves away from it.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B14,
);

// ---------------------------------------------------------------------------
// Counting a pile — the week's core act (all four postures from the family)
// ---------------------------------------------------------------------------

/** The anchor read: a pile of coins, counted in value order. */
const readPurse = withFreshPile(countCoins());

/** The value-order rule stated as a strategy: which coins pay this exactly? */
const payExactly = payFewestCoins();

/** The gap up to a price the purse cannot yet reach. */
const shortBy = withFreshPile(payShortfall());

/** Two named misconceptions offered as options, each computed by the same code. */
const whichTotal = withFreshPile(totalChoice());

// ---------------------------------------------------------------------------
// Metacognition — the B-band prediction, in its money form
//
// The B row of FILL-ARCHITECTURE names the intro form "will it pass 10?". Ten is
// a coin here, so the prediction is a call a child can make by eye before any
// counting: will the change be worth more than one dime, or less? The base is
// served ONLY through the wrapper (kit §E2.2) — a generator used both raw and
// wrapped ships two identical hint ladders and spends two of the three the
// dedup allows.
//
// The change is nudged off ten deterministically, because a prediction whose
// honest answer is "exactly a dime" is a question with no option to choose.
// ---------------------------------------------------------------------------

const changeBox = box<CoinEntry[]>();

const changeLeftBase = withFreshPile(withDrawn(
  changeBox,
  situation({
    situationType: 'money-change',
    cognitiveOp: 'money-change',
    draw: (r) => {
      const coins = purse(r, WITH_QUARTERS);
      const have = totalCents(coins);
      // THE PROBE'S ANSWER IS A GENUINE COIN FLIP, by drawing the SIDE first.
      //
      // This was `r.int(3, 25)` with 10 remapped to 11, which left 7 outcomes
      // below a dime against 16 above it — so "more than one dime" was the honest
      // answer on about 70% of draws, and a child who always says "more" is mostly
      // right. That blunts the estimate-first probe, which exists to make the
      // child commit to a judgement. Nothing could catch it: a probe is prepended
      // prose with no keyed answer, so bb-answer-entropy-test.ts cannot see it.
      //
      // Both branches consume exactly one `r.int` after the side, so the seed
      // stream lands in the same place either way (kit §E2.4), and excluding a
      // change of exactly one dime now falls out of the ranges rather than needing
      // a remap — a dime itself is neither more nor less than a dime.
      const overADime = r.int(0, 1) === 1;
      const change = overADime ? r.int(11, 25) : r.int(3, 9);
      const price = have - change;
      changeBox.last = coins;
      const who = one(r);
      const noun = r.pick(SHOP_NOUNS);
      return {
        prompt: `[image: ${coinSetAlt(coins)}] ${who} carries these coins to the school shop and buys ${anItem(noun)} for ${centsLabel(price)}. How many cents does ${who} carry home?`,
        answerValue: String(change),
        templateId: 'd_sub_v1',
        params: { a: have, b: price },
        units: 'cents',
        acceptableForms: centsForms(change),
        hints: [
          'What stays in a hand once something has been paid for?',
          'Work out what the whole purse holds, then lift the price out of it.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (coins) => ({ figure: coinSetFigure(coins, { asserts: assertsParam('a', 'cents') }) }),
));

const predictChange = withEstimateFirst(
  changeLeftBase,
  'will the coins carried home be worth more than one dime, or less?',
);

// ---------------------------------------------------------------------------
// Multi-step — the money move run both ways
//
// `spendChain` (family) pays twice and counts what is left. This one runs the
// same machinery forwards: a jar is added to twice, and it is the one page where
// the total can pass a hundred cents and pick up its second name.
// ---------------------------------------------------------------------------

const jarBox = box<CoinEntry[]>();

const saveJarChain = withFreshPile(withDrawn(
  jarBox,
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'money-save',
    usesPriorSkill: true,
    draw: (r) => {
      const coins = purse(r, WITH_QUARTERS);
      const have = totalCents(coins);
      const dimes = r.int(1, 3);
      jarBox.last = coins;
      const who = one(r);
      return {
        prompt: `[image: ${coinSetAlt(coins)}] ${who} keeps these coins in a money jar — ${centsLabel(have)} in all. On Saturday ${who} adds a quarter, and on Sunday adds ${countNoun(dimes, 'dimes')} as well. How many cents are in the jar then?`,
        initN: have,
        steps: [
          { op: 'add' as const, n: 25, d: 1 },
          { op: 'add' as const, n: 10 * dimes, d: 1 },
        ],
        units: 'cents',
        acceptableForms: centsForms(have + 25 + 10 * dimes),
        hints: [
          'How many times does money go into the jar before the counting stops?',
          'Put the first day onto the starting amount, then put the second day onto that.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (coins) => ({ figure: coinSetFigure(coins, { asserts: assertsParam('initN', 'cents') }) }),
));

/** Pay twice, then count what is left (family) — the recipe's own two-step. */
const spendTwice = withFreshPile(spendChain());

// ---------------------------------------------------------------------------
// Discrimination — more coins ≠ more money, the defining trap of the week
// ---------------------------------------------------------------------------

const moreMoney = withFreshPile(moreValueChoice());

// ---------------------------------------------------------------------------
// Day 5 — the miscount analysed, the amount made two ways, the claim settled
// ---------------------------------------------------------------------------

/** The recipe's named slip: a nickel counted as one (of anything). */
const nickelAsOneEA = withFreshPile(miscountEA('nickel-as-1'));

/** The Day-5 signature: the same amount, a different handful (a set answer). */
const makeItAnotherWay = withFreshPile(twoWaysToMake());

/**
 * The claim the whole week is evidence for. SOMETIMES is the honest verdict and
 * the pages prove it both ways: three pennies lose to one dime, and six pennies
 * beat one nickel. A child who leaves with "more coins wins" and a child who
 * leaves with "fewer coins wins" have both learned a rule that fails.
 */
const moreCoinsClaim = classify({
  prompt:
    'Always, sometimes, or never true? A handful with more coins is worth more money than one with fewer coins. Write one sentence telling how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Answers with the number of coins in the handful rather than with what those coins are worth.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Swaps one blanket rule for the opposite one, so a heap of dimes is ruled out from beating a single nickel.',
    },
  ],
  hints: [
    'Picture a heap of small coins beside one large coin. Which side holds more pieces?',
    'Build two handfuls of your own. Put many small coins in one, and a few large coins in the other. Does the rule survive both?',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

/** The denominations the puzzle may hide. A hidden penny makes too small a gap. */
const HIDEABLE: readonly CoinCents[] = [5, 10, 25];

export const buildB16 = makeWeekBuilder({
  level: 'B',
  week: 16,
  conceptId: 'money',
  conceptName: 'Money',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B2, B10, B13, B14],
  pedagogyContract: 'v2',
  conceptualAnchor: 'counting coins in value order',
  conceptFamily: 'operation',
  deepeningDelta:
    'Money is not a new operation — it is the addition and subtraction of B13 and B14 wearing coins, where the numbers no longer arrive one per object. The new load is that each thing counted is worth a different amount, so the week composes strictly-prior skills for its two-step pages: the jar chain adds whole tens on (B10 adding tens), and the spending chain takes two prices off in turn (B14 subtraction within 100). Both are marked usesPriorSkill; what is genuinely new is the value order the counting runs in.',
  explanation: {
    hook:
      'Tip out a purse and you are holding two different numbers at once. One of them is how many coins are lying there. The other is how much money they make — and they are almost never the same number.',
    whyBeforeHow:
      'A coin does not tell you what it is worth by how big it is, because a dime is smaller than a nickel and worth twice as much. That is why a handful of coins cannot be counted like a handful of buttons: buttons are all worth one button each, and coins are not. Counting coins in value order settles it. Start with the coin worth the most, hold that number in your head, and count on by what each next coin is worth — never by how many coins are left to go. Three pennies are three coins and three cents. One dime is one coin and ten cents. So the taller pile is not the richer one, and the only way to know which is which is to count what each coin is worth.',
    script: [
      {
        say: 'Watch me count this pile. I do not reach for the biggest coin. I reach for the coin that is WORTH the most — the quarter. Twenty-five. The dime takes me to thirty-five. The two pennies bring me to thirty-seven cents.',
        visual: 'A quarter, a dime and two pennies laid out in a row, largest value first.',
        figure: coinSetFigure([
          { cents: 25, count: 1 },
          { cents: 10, count: 1 },
          { cents: 1, count: 2 },
        ]),
      },
      {
        say: 'Now here is the one that catches everybody. Three pennies against one dime. The pennies win on how many, and they lose on how much. That one little dime is worth more than all three pennies together.',
        visual: 'Three pennies beside one dime, with no values printed on the coins.',
        figure: coinSetFigure(
          [
            { cents: 10, count: 1 },
            { cents: 1, count: 3 },
          ],
          { showValues: false },
        ),
      },
      {
        say: 'The nickel is the one I go slowly over. It is fat and it sits next to the pennies. It looks like it belongs with them. It does not. One nickel is worth five. I count it as a five, never as a one.',
        visual: 'A nickel between a pile of pennies and a dime, drawn at true relative size.',
        figure: coinSetFigure([
          { cents: 10, count: 1 },
          { cents: 5, count: 1 },
          { cents: 1, count: 3 },
        ]),
      },
      {
        say: 'Before I write a total down, I check it once more. I start again from the coin worth the most. If my second count lands near my first one, I trust it. If the two counts are far apart, some coin got the wrong value.',
        visual: 'The same pile being counted a second time, starting again from the quarter.',
        figure: coinSetFigure([
          { cents: 25, count: 2 },
          { cents: 5, count: 1 },
          { cents: 1, count: 1 },
        ]),
      },
    ],
    summary:
      'Sort the coins with the most valuable first, then count on by what each coin is WORTH, not by how many coins there are. A quarter counts as twenty-five, a dime as ten, a nickel as five, a penny as one. A hundred cents is one dollar. More coins in the hand does not mean more money in the hand.',
    vocabulary: [
      { term: 'cent', kidGloss: 'the smallest amount of money we count in — one penny is worth one cent' },
      { term: 'nickel', kidGloss: 'the fat silver coin worth five cents — never count it as one' },
      { term: 'dime', kidGloss: 'the smallest silver coin, and worth ten cents — small but not cheap' },
      { term: 'value', kidGloss: 'what a coin is worth, which is not the same as how big it looks' },
    ],
  },
  guidedExamples: [
    {
      ...ge(16, 1, 'modeled', 'A purse holds one quarter, two dimes and one penny. How much money is that?', [
        {
          teacherSay:
            'Watch how I start. I hunt for the coin worth the most first, every time. A count that starts big never has to be unpicked. That is the quarter. I am at twenty-five already.',
        },
        {
          teacherSay:
            'Now the two dimes. I count on in tens from twenty-five: thirty-five, forty-five. One penny is still lying there. What do I write down?',
          expected: '46¢',
        },
      ], '46¢'),
      visual: 'A quarter, two dimes and a penny laid out in value order.',
      figure: coinSetFigure(
        [
          { cents: 25, count: 1 },
          { cents: 10, count: 2 },
          { cents: 1, count: 1 },
        ],
        { asserts: assertsAnswer },
      ),
    },
    {
      ...ge(16, 2, 'completion', 'A purse holds one quarter, one dime and two pennies. A sticker costs 45¢. How many more cents are needed?', [
        {
          teacherSay: 'I count the purse in value order and land on thirty-seven cents. The price is higher than that, so the question is how far the money still has to travel.',
        },
        { childDo: 'Count on from what the purse holds up to the price, and say how many cents that takes.', expected: '8¢' },
      ], '8¢'),
      visual: 'A quarter, a dime and two pennies beside a sticker marked with its price.',
      figure: coinSetFigure([
        { cents: 25, count: 1 },
        { cents: 10, count: 1 },
        { cents: 1, count: 2 },
      ]),
    },
    {
      ...ge(16, 3, 'prompted', 'One quarter makes 25¢. Make 25¢ a second way, using exactly three coins.', [
        {
          childDo: 'Swap the large coin for smaller coins that fill the same value, and keep going until you are holding three.',
          expected: 'dime, dime, nickel',
        },
      ], 'dime, dime, nickel'),
      visual: 'A single quarter, with an empty space beside it for the second handful.',
      figure: coinSetFigure([{ cents: 25, count: 1 }]),
    },
    {
      // Independent stage: the picture hands over the START and nothing more.
      // Working out what survives two purchases IS the task.
      ...ge(16, 4, 'independent', 'A purse holds 48¢ in coins. A pencil costs 20¢ and a badge costs 15¢. Both are bought. How many cents are left? Solve cold.', [
        { childDo: 'Pay for the first thing, count what the hand still holds, then pay for the second.', expected: '13¢' },
      ], '13¢'),
      visual: 'A quarter, two dimes and three pennies — the purse before anything is spent.',
      figure: coinSetFigure([
        { cents: 25, count: 1 },
        { cents: 10, count: 2 },
        { cents: 1, count: 3 },
      ]),
    },
  ],
  days: [
    // Day 1 — concept echo: count a pile in value order, choose the coins that
    // pay a price exactly, and find the gap when they do not. Single-step only.
    [
      { gen: wBundles, diff: 2 },
      { gen: wTensSequence, diff: 2 },
      { gen: readPurse, diff: 2 },
      { gen: payExactly, diff: 3 },
      { gen: shortBy, diff: 3 },
    ],
    // Day 2 — fluency + application: the prediction first, then both
    // discriminations, then a straight count so the page shape signals nothing.
    [
      { gen: wJoinCollection, diff: 2 },
      { gen: predictChange, diff: 3 },
      { gen: whichTotal, diff: 3 },
      { gen: moreMoney, diff: 3 },
      { gen: readPurse, diff: 3 },
    ],
    // Day 3 — interleave: the two traps beside the week's first two-step and a
    // shortfall, so nothing on the page announces which move is wanted.
    [
      { gen: wTakeFromTray, diff: 2 },
      { gen: moreMoney, diff: 4 },
      { gen: whichTotal, diff: 4 },
      { gen: spendTwice, diff: 4 },
      { gen: shortBy, diff: 3 },
    ],
    // Day 4 — word problems: the money move run both ways, beside the two
    // single-step pages it is built out of.
    [
      { gen: wTensSequence, diff: 2 },
      { gen: saveJarChain, diff: 4 },
      { gen: spendTwice, diff: 4 },
      { gen: payExactly, diff: 3 },
      { gen: predictChange, diff: 3 },
    ],
    // Day 5 — the signature: the miscount analysed, the amount made a second
    // way, and the claim the whole week is the evidence for.
    [
      { gen: wJoinCollection, diff: 2 },
      { gen: nickelAsOneEA, diff: 4 },
      { gen: makeItAnotherWay, diff: 3 },
      { gen: moreCoinsClaim, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: if your child says the pile with more coins is worth more, do not correct the total — put three pennies in one hand and a dime in the other and ask which one the shop would rather have. The dime being the SMALLEST silver coin is the part that feels unfair, and saying so out loud helps. Real coins beat worksheets here: a jar on the counter, sorted biggest-value first, counted out loud on the way to the shop.',
  ],
  puzzle: (r, guard) => {
    // The puzzle draws last, so its pile is checked against every page the week
    // has already shown — same bounded, deterministic redraw as `withFreshPile`.
    let shown = purse(r, MAYBE_QUARTER);
    for (let i = 0; i < 12 && guard.taken(pileKey(shown)); i++) shown = purse(r, MAYBE_QUARTER);
    guard.add(pileKey(shown));
    const hidden = r.pick(HIDEABLE);
    const total = totalCents(shown) + hidden;
    const who = one(r);
    return {
      id: 'B16-PZ-01',
      title: 'Puzzle Grove: The Coin Under the Cup',
      puzzleType: 'logic',
      prompt: `[image: ${coinSetAlt(shown)}] ${who} tips a purse onto the table. One single coin rolls under an upturned cup. The rest lie in the open. The whole purse is worth ${centsLabel(total)}. Which one coin is under the cup?`,
      figure: coinSetFigure(shown, {
        alt: `${coinSetAlt(shown)} lying in the open, beside an upturned cup covering one more coin`,
      }),
      answer: {
        value: coinNoun(hidden),
        acceptableForms: [coinName(hidden, 1), centsLabel(hidden), `a ${coinNoun(hidden)}`],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'What is the whole purse worth, and what can you already see on the table?',
        'Add up everything lying in the open. What must the hidden coin be worth to finish the purse?',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  // Every day page hands the child the coins and asks for a total. This one
  // hands over the TOTAL and asks for a coin — count what is visible, then name
  // the single coin that closes the gap. Two moves, and the reverse of the week.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'missing-coin' },
  sprint: {
    skill: 'Two-digit addition — the arithmetic under every coin total',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { addendRange: [11, 79], sumMax: 99, noCross100: true },
  },
  mastery: [
    { gen: readPurse, diff: 3 },
    { gen: shortBy, diff: 3 },
    { gen: spendTwice, diff: 4 },
    { gen: payExactly, diff: 3 },
    { gen: makeItAnotherWay, diff: 3 },
    { gen: whichTotal, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/02/04: the three single-step coin pages — count a pile in value order, find the gap up to a price the pile cannot reach, and name the smallest number of coins that pays a price exactly. 03: the two-step money-change chain (two things bought from one pictured purse). 05: the same amount made a second way under a coin-count constraint, which stays a set answer. 06: the total offered as a choice against the count-the-coins and nickel-as-one misconceptions, both recomputed by the verify template. No coin set or price reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'counts-coins-not-value',
      description: 'Answers with how many coins are in the pile instead of how much they are worth, so three pennies beat one dime.',
      exampleWrongAnswer: 'a pile of 1 dime, 1 nickel and 3 pennies given as 5¢',
      distractorRationale: 'Offer the NUMBER of coins in the picture as a cents amount, and the taller pile as the more valuable one.',
      reteachPointer: 'explanation/script[1] (three pennies beside one dime, with no values printed)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'nickel-as-one',
      description: 'Gives every coin its value except the nickel, which is counted as one because it sits beside the pennies and is the same colour as the dime.',
      exampleWrongAnswer: '3 dimes and 1 nickel counted as 31¢',
      distractorRationale: 'Offer the total the pile makes when only the nickel is valued at one.',
      reteachPointer: 'explanation/script[2] (the nickel is fat, and it is still worth five)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-other-question',
      description: 'Answers a "how much is left" question with the price, or a "how many more" question with the total already held — the right subtraction pointed the wrong way.',
      exampleWrongAnswer: 'a "how many more cents are needed?" question answered with what the purse already holds',
      distractorRationale: 'Offer the quantity the story states rather than the one it asks for.',
      reteachPointer: 'guidedExamples/B16-GE-02 (the purse is counted first, then the gap up to the price)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'value-order-lost',
      description: 'Chooses the right move but loses the running total part-way along the row, usually after starting from a small coin instead of the largest.',
      exampleWrongAnswer: 'a quarter, a dime and two pennies counted as 36¢',
      distractorRationale: 'Offer a total one coin short of the true one.',
      reteachPointer: 'guidedExamples/B16-GE-01 (start from the coin worth the most and count on), then the 2-minute addition sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Money — naming the four coins and what each is worth, counting a mixed handful by starting with the most valuable coin, paying a price with the fewest coins, working out how much more is needed or how much is left, and making the same amount two different ways.',
    improvingCandidates: [
      'counting a mixed handful by starting from the coin worth the most',
      'naming what each coin is worth rather than how big it looks',
      'making the same amount with a different handful of coins',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'holding apart the two numbers in a pile of coins — how many there are, and how much they are worth',
      },
      {
        errorTag: 'representation-misread',
        text: 'giving the nickel its five, even though it sits beside the pennies and looks bigger than the dime',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was asked — how much is left is not the same as how much was spent',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the handful starting from the coin worth the most, and you checked the total a second time before writing it down — that is exactly the habit this week is built on.',
      questionForChild: 'Three pennies in one hand and one dime in the other — which hand holds more money, and how do you know?',
      schoolSyncHook: 'If your child\'s class works in a different currency or names the coins differently, tell us and we will match the coins they handle.',
    },
    vocabularyForParent: [
      'value (what a coin is worth, as opposed to how big it is)',
      'nickel and dime (the pair that catches everyone — the smaller silver coin is the more valuable one)',
      'value order (counting a handful biggest-value first, which is what makes a mixed pile countable at all)',
    ],
  },
});
