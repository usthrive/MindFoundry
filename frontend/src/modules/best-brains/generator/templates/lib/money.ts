/**
 * G3 — coin counting, paying, two-ways-to-make (B16, E2/E17 prose)
 *
 * Contract every family in this directory follows:
 *  - generators return an `ItemGen` (see lib/items.ts) and stamp `authorMeta`;
 *  - every computational item names a `templateId` registered in the array
 *    below, so QG-5 re-derives its answer from the same params the generator
 *    used and a wrong answer key is structurally impossible;
 *  - embedded-claim items (discrimination / error-analysis) register a
 *    `verifyFor` instead, which QG-11 calls the same way;
 *  - prose is interpolated ONLY through lib/format.ts, never a bare `${…}`;
 *  - figures come from lib/figures.ts and are built from the item's OWN drawn
 *    values, so QG-13 can prove the picture agrees with the answer.
 *
 * `registry.ts` spreads `MONEY_TEMPLATE_DEFS`, so nothing else needs editing when
 * a template is added here.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS FAMILY SHIPS
 *
 *  count a set        `countCoins()`        set → cents        money_coin_total_v1
 *  pay: what is short `payShortfall()`      set + price        money_short_by_v1
 *  pay: fewest coins  `payFewestCoins()`    price → coins      money_fewest_coins_v1
 *  spend (2 steps)    `spendChain()`        chain              d_multistep_rat_v1
 *  two ways to make N `twoWaysToMake()`     set answer         money_coin_combo_v1
 *  more coins ≠ more  `moreValueChoice()`   discrimination     money_verify_more_value_v1
 *  which total is it  `totalChoice()`       discrimination     money_verify_coin_total_v1
 *  the miscount shown `miscountEA(mode)`    error-analysis     money_verify_coin_total_v1
 *
 * EVERY amount here is an integer number of CENTS, end to end: the params, the
 * arithmetic, the answers. Nothing in this family ever holds a fractional
 * dollar, so the "$0.5" class of defect has no way in — a float never exists to
 * be rendered. Dollars appear only at the surface, through `centsLabel`.
 *
 * CURRENCY RENDERING. `format.ts` is the interpolation authority and owns the
 * dollar forms (`money`, `wholeMoney`, `bill`); it has no cents renderer, and
 * the B band needs one ("25¢" below a dollar, "$1" at or above it —
 * FILL-ARCHITECTURE §2 G3). `centsLabel` below is that one function, and it
 * DELEGATES every dollar-shaped amount straight back to format.ts rather than
 * formatting one itself. It is the obvious promotion into format.ts (as
 * `fmtMoney`'s cents arm) the moment a second family needs it; editing that file
 * was out of scope for this build.
 */

import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import type { ItemDraft } from '../shared';
import { num, str, type AnswerDef, type VerifyDef, type VerifyResult } from './compute';
import { frame } from './contexts';
import { discrimination } from './discrimination';
import { errorAnalysis } from './erroranalysis';
import {
  coinNoun,
  coinSet as coinSetFigure,
  coinSetAlt,
  normalizeCoins,
  type CoinCents,
  type CoinEntry,
} from './figures';
import { article, countNoun, money, unitFor, wholeMoney } from './format';
import { multiStep, type ItemGen } from './multistep';
import { situation } from './situations';

// ---------------------------------------------------------------------------
// Cents — the family's arithmetic, and the one place a `¢` is written
// ---------------------------------------------------------------------------

/** The denominations a B-band money week uses, largest first (counting order). */
export const DENOMINATIONS: readonly CoinCents[] = [25, 10, 5, 1];

/** What a coin list is WORTH, in cents. */
export function totalCents(coins: readonly CoinEntry[]): number {
  return coins.reduce((sum, c) => sum + c.cents * c.count, 0);
}

/** How MANY coins a list holds — the other number, and the misconception. */
export function coinCount(coins: readonly CoinEntry[]): number {
  return coins.reduce((sum, c) => sum + c.count, 0);
}

/**
 * A cents amount as band B writes it: `¢` below a dollar, `$` at or above one.
 *
 * The `$` arms delegate to `format.ts` (`wholeMoney` for a round dollar, `money`
 * for dollars-and-cents), which is what keeps "$0.5" impossible: this function
 * cannot produce a one-decimal amount because it never divides — it hands
 * format.ts an exact two-digit cents string built from integer arithmetic.
 */
export function centsLabel(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error(`centsLabel(): ${cents} is not a whole number of cents`);
  }
  if (cents < 100) return `${cents}¢`;
  if (cents % 100 === 0) return wholeMoney(cents / 100);
  return money(`${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`);
}

/** The accepted written forms of a cents answer ("42¢", "42 cents"). */
function centsForms(cents: number): string[] {
  return [centsLabel(cents), countNoun(cents, 'cents')];
}

/** Coin values (largest first) as a coin-set entry list. */
function asEntries(coins: readonly CoinCents[]): CoinEntry[] {
  return normalizeCoins(coins.map((cents) => ({ cents, count: 1 })));
}

/**
 * The fewest coins that make `cents` exactly. Greedy is provably optimal for the
 * US set {25,10,5,1}, which is why "take the biggest coin that fits" is a rule a
 * child can be taught rather than a heuristic that sometimes fails.
 */
export function fewestCoins(cents: number): CoinCents[] {
  if (!Number.isInteger(cents) || cents < 1) throw new Error(`fewestCoins(): ${cents} is not a payable amount`);
  const out: CoinCents[] = [];
  let left = cents;
  for (const d of DENOMINATIONS) {
    while (left >= d) {
      out.push(d);
      left -= d;
    }
  }
  return out;
}

/** Every multiset of EXACTLY `count` coins worth exactly `cents`. */
function combosOfSize(cents: number, count: number): CoinCents[][] {
  const out: CoinCents[][] = [];
  const acc: CoinCents[] = [];
  const walk = (idx: number, left: number, n: number): void => {
    if (n === 0) {
      if (left === 0) out.push([...acc]);
      return;
    }
    if (idx >= DENOMINATIONS.length) return;
    const d = DENOMINATIONS[idx];
    if (d * n < left) return;                       // even all-of-the-largest falls short
    for (let k = Math.min(n, Math.floor(left / d)); k >= 0; k--) {
      for (let i = 0; i < k; i++) acc.push(d);
      walk(idx + 1, left - d * k, n - k);
      acc.length -= k;
    }
  };
  walk(0, cents, count);
  return out;
}

// ---------------------------------------------------------------------------
// Registered templates (QG-5 answers / QG-11 truths)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;

const VALID_CENTS = new Set<number>([1, 5, 10, 25, 50, 100]);

/**
 * The coin list, re-read from the item's own params. Validated rather than
 * trusted: a denomination that does not exist, or a count the picture could not
 * draw, is a broken item and says so here instead of surfacing as a strange
 * total three gates later.
 */
function readCoins(p: Params, key = 'coins'): CoinEntry[] {
  const raw = p[key];
  if (!Array.isArray(raw) || raw.length === 0) throw new Error(`money: params.${key} must be a non-empty coin list`);
  const coins = raw.map((c) => {
    const entry = c as { cents?: unknown; count?: unknown };
    const cents = entry.cents;
    const count = entry.count;
    if (typeof cents !== 'number' || !VALID_CENTS.has(cents)) throw new Error(`money: ${String(cents)}¢ is not a coin`);
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 1) {
      throw new Error(`money: a coin entry needs a whole count ≥ 1, got ${String(count)}`);
    }
    return { cents: cents as CoinCents, count };
  });
  if (coinCount(coins) > 20) throw new Error('money: more than 20 coins is more than a child can count at a glance');
  return coins;
}

/** Price minus what is already held — and proof the picture holds it. */
function shortBy(p: Params): string {
  const coins = readCoins(p);
  const have = totalCents(coins);
  const stated = num(p, 'haveCents');
  // The figure asserts `haveCents`; this is where that shortcut is checked back
  // against the coins themselves, so a picture can never quietly hold a
  // different amount from the one the answer was computed against.
  if (stated !== have) throw new Error(`money_short_by_v1: the coins make ${have}¢ but haveCents says ${stated}`);
  const price = num(p, 'price');
  if (price <= have) throw new Error(`money_short_by_v1: ${price}¢ is not more than the ${have}¢ already held`);
  return String(price - have);
}

/** The unique `count`-coin way to make `cents`, named in drawing order. */
function comboAnswer(p: Params): string {
  const cents = num(p, 'cents');
  const count = num(p, 'count');
  const all = combosOfSize(cents, count);
  if (all.length !== 1) {
    throw new Error(`money_coin_combo_v1: ${count} coins make ${cents}¢ in ${all.length} ways — this item needs exactly one`);
  }
  return all[0].map((c) => coinNoun(c)).join(', ');
}

/**
 * What the coins are worth, plus — when the params name a misconception — what
 * that misconception really produces.
 *
 *  nickel-as-1  the nickel counted as one (of anything): the B16 named slip.
 *  count-coins  the NUMBER of coins answered instead of their value.
 *
 * As in the clock family, omitting `wrongMode` returns the truth only: a
 * discrimination item must not carry a `wrong`, because QG-11 would then require
 * the prompt to display it, and a discrimination's wrong answers are its options.
 */
function verifyCoinTotal(p: Params): VerifyResult {
  const coins = readCoins(p);
  const correct = totalCents(coins);
  if (p.wrongMode === undefined) return { correct: String(correct) };
  const mode = str(p, 'wrongMode');
  let wrong: number;
  switch (mode) {
    case 'nickel-as-1':
      wrong = coins.reduce((sum, c) => sum + (c.cents === 5 ? 1 : c.cents) * c.count, 0);
      break;
    case 'count-coins':
      wrong = coinCount(coins);
      break;
    default:
      throw new Error(`money_verify_coin_total_v1: unknown wrongMode '${mode}'`);
  }
  if (wrong === correct) {
    throw new Error(`money_verify_coin_total_v1: '${mode}' lands on the true total (${correct}¢) — no error would be shown`);
  }
  return { correct: String(correct), wrong: String(wrong) };
}

/** Which of two coin piles is worth more — decided by cents, never by count. */
function verifyMoreValue(p: Params): VerifyResult {
  const aCents = num(p, 'aCents');
  const bCents = num(p, 'bCents');
  if (aCents === bCents) throw new Error('money_verify_more_value_v1: the two piles are worth the same — there is no MORE to pick');
  return { correct: aCents > bCents ? str(p, 'aLabel') : str(p, 'bLabel') };
}

export const MONEY_TEMPLATE_DEFS: Array<AnswerDef | VerifyDef> = [
  /** Count a coin set: {coins} → "42" (cents). */
  { id: 'money_coin_total_v1', answerFor: (p) => String(totalCents(readCoins(p))) },
  /** How much more is needed: {coins, haveCents, price} → "18" (cents). */
  { id: 'money_short_by_v1', answerFor: shortBy },
  /** Fewest coins that pay a price exactly: {cents} → "4" (coins). */
  { id: 'money_fewest_coins_v1', answerFor: (p) => String(fewestCoins(num(p, 'cents')).length) },
  /** The one `count`-coin way to make an amount: {cents, count} → "dime, dime, nickel, nickel". */
  { id: 'money_coin_combo_v1', answerFor: comboAnswer },
  /** The truth behind a coin-total claim: {coins[,wrongMode]} → {correct[,wrong]}. */
  { id: 'money_verify_coin_total_v1', verifyFor: verifyCoinTotal },
  /** The truth behind a which-is-worth-more claim: {aCents,bCents,aLabel,bLabel}. */
  { id: 'money_verify_more_value_v1', verifyFor: verifyMoreValue },
];

// ---------------------------------------------------------------------------
// Drawing coins
// ---------------------------------------------------------------------------

interface PurseSpec {
  /** Lowest acceptable value, cents. Default 12. */
  min?: number;
  /** Highest acceptable value, cents. Default 95 — this band stays under a dollar. */
  max?: number;
  /** Most coins the picture may hold. Default 7. */
  maxCoins?: number;
  /** Denominations that MUST appear (a nickel, for the nickel-as-1 misconception). */
  needs?: readonly CoinCents[];
}

/** A purse the child can count at a glance, and the picture can draw honestly. */
function drawPurse(r: Rng, spec: PurseSpec = {}): CoinEntry[] {
  const { min = 12, max = 95, maxCoins = 7, needs = [] } = spec;
  for (let i = 0; i < 40; i++) {
    const coins = normalizeCoins([
      { cents: 25, count: r.int(0, 2) },
      { cents: 10, count: r.int(0, 3) },
      { cents: 5, count: r.int(0, 2) },
      { cents: 1, count: r.int(0, 4) },
    ]);
    const n = coinCount(coins);
    const value = totalCents(coins);
    if (n < 2 || n > maxCoins) continue;
    if (value < min || value > max) continue;
    if (!needs.every((d) => coins.some((c) => c.cents === d))) continue;
    return coins;
  }
  // Deterministic fallback — 42¢ in five coins, one of every denomination, so it
  // satisfies every constraint this family asks for at any seed.
  return normalizeCoins([
    { cents: 25, count: 1 }, { cents: 10, count: 1 }, { cents: 5, count: 1 }, { cents: 1, count: 2 },
  ]);
}

/**
 * The (amount, coin-count) pairs where "make it with exactly this many coins"
 * has ONE answer, and that answer is not the fewest-coins way already pictured.
 *
 * Built once, by enumeration, so the Day-5 set answer is unique by construction
 * rather than by an author's confidence that it is.
 */
interface TwoWayCase {
  cents: number;
  count: number;
  combo: CoinCents[];
  shown: CoinCents[];
}

const TWO_WAY_CASES: readonly TwoWayCase[] = (() => {
  const out: TwoWayCase[] = [];
  for (let cents = 11; cents <= 95; cents++) {
    const shown = fewestCoins(cents);
    if (shown.length < 2 || shown.length > 4) continue;
    for (let count = shown.length + 1; count <= 6; count++) {
      const all = combosOfSize(cents, count);
      if (all.length !== 1) continue;
      out.push({ cents, count, combo: all[0], shown });
    }
  }
  return out;
})();

// ---------------------------------------------------------------------------
// Figure attachment (same two helpers as the clock family, same single rule:
// the picture is built from the values the answer came from)
// ---------------------------------------------------------------------------

/** Rebuild the picture from the item's own `generator.params` — the object QG-5
 *  recomputes the answer from, so figure and answer cannot drift apart. */
function withFigure(gen: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = gen(rng, guard, difficulty);
    if (!draft.generator) {
      throw new Error('money/withFigure: the wrapped generator ships no generator.params to rebuild the picture from');
    }
    return { ...draft, figure: build(draft.generator.params) };
  };
}

interface Slot<P> {
  last: P | null;
}

function slot<P>(): Slot<P> {
  return { last: null };
}

/**
 * The same rule where the factory does not ship the drawn values:
 * `discrimination()` emits no generator spec, and `multiStep()` ships the chain
 * but not the coins its opening amount was drawn as. The draw closure posts what
 * it drew; `drawUniqueItem` returns the draft of its LAST build call, so the box
 * holds that same draw when the decorator reads it.
 */
function withDrawn<P>(box: Slot<P>, gen: ItemGen, decorate: (drawn: P) => Partial<ItemDraft>): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = gen(rng, guard, difficulty);
    if (box.last === null) throw new Error('money/withDrawn: the draw posted nothing to decorate from');
    return { ...draft, ...decorate(box.last) };
  };
}

// ---------------------------------------------------------------------------
// Contexts — the shop-change frame (POLISH §P3 rotation ledger)
// ---------------------------------------------------------------------------

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const SHOP_NOUNS = frame('shop-change').nouns;

/** Two distinct names, so a prompt never compares someone with themselves. */
function two(r: Rng): [string, string] {
  return r.shuffle([...NAMES]).slice(0, 2) as [string, string];
}

/** "an eraser" / "a pencil" — the article decided by sound, in format.ts. */
function anItem(noun: string): string {
  return article(unitFor(1, noun));
}

/** Sentence-initial form. */
function opens(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

/** The coins on offer when the child chooses what to pay with. */
const COIN_BANK: readonly CoinEntry[] = [
  { cents: 25, count: 1 }, { cents: 10, count: 1 }, { cents: 5, count: 1 }, { cents: 1, count: 1 },
];
const COIN_BANK_ALT = `one of each coin to choose from: ${coinSetAlt(COIN_BANK)}`;

// ---------------------------------------------------------------------------
// The generators
// ---------------------------------------------------------------------------

/**
 * Count a coin set (B16's core; the anchor is counting by value, largest first).
 *
 * The picture IS the question — the coins are the data the child adds — so it
 * shows the set and asserts its total against the answer. What it does not do is
 * say the total: `coinSetAlt` names the coins, never their worth.
 */
export function countCoins(spec: PurseSpec = {}): ItemGen {
  return withFigure(
    situation({
      situationType: 'combine',
      cognitiveOp: 'count-coins',
      draw: (r) => {
        const coins = drawPurse(r, spec);
        const total = totalCents(coins);
        const who = r.pick(NAMES);
        return {
          prompt: `[image: ${coinSetAlt(coins)}] ${who} tips these coins out of a money box. How much money is that in cents?`,
          answerValue: String(total),
          templateId: 'money_coin_total_v1',
          params: { coins },
          units: 'cents',
          acceptableForms: centsForms(total),
          hints: [
            'Which coin in the pile is worth the most? Is it the biggest one to look at?',
            'Start from the most valuable coin. Count on by what each coin is worth, not how many there are.',
          ],
          errorTags: ['concept-misconception', 'procedure-slip'],
        };
      },
    }),
    (p) => coinSetFigure(readCoins(p), { asserts: { of: 'cents', equals: 'answer' } }),
  );
}

/**
 * Pay for something, and find what is missing (B16 "pay then count what's left",
 * the money-change situation).
 *
 * The child must count the pictured purse before anything else can happen, so
 * the figure is the data — and it asserts against `haveCents`, which
 * `money_short_by_v1` independently recomputes from the coin list itself.
 */
export function payShortfall(): ItemGen {
  return withFigure(
    situation({
      situationType: 'money-change',
      cognitiveOp: 'money-change',
      draw: (r) => {
        const coins = drawPurse(r, { min: 12, max: 70 });
        const have = totalCents(coins);
        const price = have + r.int(3, 25);
        const who = r.pick(NAMES);
        const noun = r.pick(SHOP_NOUNS);
        return {
          prompt: `[image: ${coinSetAlt(coins)}] ${who} has these coins. ${opens(anItem(noun))} costs ${centsLabel(price)}. How many more cents does ${who} need?`,
          answerValue: String(price - have),
          templateId: 'money_short_by_v1',
          params: { coins, haveCents: have, price },
          units: 'cents',
          acceptableForms: centsForms(price - have),
          hints: [
            'Does the money in the picture cover the price, or fall short of it?',
            'Count the coins in the picture first. Then find the gap up to the price.',
          ],
          errorTags: ['task-comprehension', 'procedure-slip'],
        };
      },
    }),
    (p) => coinSetFigure(readCoins(p), { asserts: { of: 'cents', equals: 'param:haveCents' } }),
  );
}

/**
 * Choose the coins to pay with — the fewest that make the price exactly.
 *
 * The picture here is the COIN BANK (one of each), not a solution: the set the
 * child has to assemble is the answer, so drawing it would hand the item over.
 * That is also why this is the family's one unasserted coin figure — a bank
 * claims nothing about the price.
 */
export function payFewestCoins(): ItemGen {
  return withFigure(
    situation({
      situationType: 'part-whole',
      cognitiveOp: 'make-amount',
      draw: (r) => {
        // Prices whose greedy solution needs 3–5 coins: enough to reason about,
        // small enough to lay out.
        let price = r.int(11, 95);
        for (let i = 0; i < 30 && (fewestCoins(price).length < 3 || fewestCoins(price).length > 5); i++) {
          price = r.int(11, 95);
        }
        const noun = r.pick(SHOP_NOUNS);
        return {
          prompt: `[image: ${COIN_BANK_ALT}] ${opens(anItem(noun))} costs ${centsLabel(price)}. You may use quarters, dimes, nickels and pennies. What is the SMALLEST number of coins that pays it exactly?`,
          answerValue: String(fewestCoins(price).length),
          templateId: 'money_fewest_coins_v1',
          params: { cents: price },
          units: 'coins',
          hints: [
            'Which coin gets you closest to the price in one go?',
            'Take the largest coin that still fits. Keep filling what is left the same way.',
          ],
          errorTags: ['concept-misconception', 'procedure-slip'],
        };
      },
    }),
    () => coinSetFigure(COIN_BANK, { alt: COIN_BANK_ALT }),
  );
}

/**
 * Buy two things from a pictured purse — the gentle 2-step (B16 "pay then count
 * what's left").
 *
 * `initN` is the purse's value, which the prose states and the picture asserts,
 * so the chain's opening quantity, the sentence and the drawing are one number
 * in three places.
 */
export function spendChain(): ItemGen {
  const box = slot<CoinEntry[]>();
  return withDrawn(
    box,
    multiStep({
      situationType: 'money-change',
      cognitiveOp: 'money-change',
      draw: (r) => {
        const coins = drawPurse(r, { min: 45, max: 95 });
        const have = totalCents(coins);
        const first = r.int(5, Math.max(6, Math.floor((have - 5) / 2)));
        const second = r.int(5, Math.max(6, have - first - 3));
        box.last = coins;
        const who = r.pick(NAMES);
        const nouns = r.shuffle([...SHOP_NOUNS]).slice(0, 2);
        return {
          prompt: `[image: ${coinSetAlt(coins)}] ${who} starts with ${centsLabel(have)} in coins. Then ${who} buys ${anItem(nouns[0])} for ${centsLabel(first)} and ${anItem(nouns[1])} for ${centsLabel(second)}. How many cents are left?`,
          initN: have,
          steps: [{ op: 'sub', n: first, d: 1 }, { op: 'sub', n: second, d: 1 }],
          units: 'cents',
          acceptableForms: centsForms(have - first - second),
          hints: [
            'How many things are bought before the counting stops?',
            'Take the first price off the starting amount. Then take the second off what is left.',
          ],
          errorTags: ['task-comprehension', 'procedure-slip'],
        };
      },
    }),
    (coins) => ({
      figure: coinSetFigure(coins, { asserts: { of: 'cents', equals: 'param:initN' } }),
    }),
  );
}

/**
 * Two ways to make the same amount (B16's Day-5 signature, a SET answer).
 *
 * One way is pictured; the child builds the other under a coin-count constraint
 * that makes it unique — `TWO_WAY_CASES` was enumerated for exactly that, so
 * "the" answer really is the only one. The picture cannot leak it: it shows the
 * fewest-coins way, which by construction uses a different number of coins.
 */
export function twoWaysToMake(): ItemGen {
  return withFigure(
    situation({
      situationType: 'part-whole',
      cognitiveOp: 'make-amount',
      draw: (r) => {
        const c = r.pick(TWO_WAY_CASES);
        const [n1, n2] = two(r);
        return {
          prompt: `[image: ${coinSetAlt(asEntries(c.shown))}] ${n1} makes ${centsLabel(c.cents)} with these coins. ${n2} makes ${centsLabel(c.cents)} too, but uses exactly ${countNoun(c.count, 'coins')}. Which coins does ${n2} use?`,
          answerValue: c.combo.map((cents) => coinNoun(cents)).join(', '),
          templateId: 'money_coin_combo_v1',
          params: { cents: c.cents, count: c.count },
          validation: 'set',
          acceptableForms: [coinSetAlt(asEntries(c.combo))],
          hints: [
            'Can the same amount of money be made with coins of different sizes?',
            'Swap one large coin for smaller coins worth the same. Then count how many coins you hold.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        };
      },
    }),
    (p) => {
      const cents = num(p, 'cents');
      return coinSetFigure(asEntries(fewestCoins(cents)), { asserts: { of: 'cents', equals: 'param:cents' } });
    },
  );
}

/**
 * The contrast pairs. Each is two piles of DIFFERENT denominations (see
 * `moreValueChoice`), and the table deliberately cuts both ways: sometimes the
 * pile with more coins is worth less (the trap), sometimes it is worth more — so
 * "fewer coins always wins" cannot be learned as a rule either.
 */
const CONTRASTS: ReadonlyArray<readonly [CoinEntry, CoinEntry]> = [
  [{ cents: 1, count: 3 }, { cents: 10, count: 1 }],   // 3¢ vs 10¢ — the named B16 trap
  [{ cents: 1, count: 4 }, { cents: 5, count: 1 }],    // 4¢ vs 5¢
  [{ cents: 1, count: 6 }, { cents: 5, count: 1 }],    // 6¢ vs 5¢ — the many-coins pile wins
  [{ cents: 10, count: 2 }, { cents: 25, count: 1 }],  // 20¢ vs 25¢
  [{ cents: 10, count: 3 }, { cents: 25, count: 1 }],  // 30¢ vs 25¢ — wins again
  [{ cents: 5, count: 3 }, { cents: 10, count: 1 }],   // 15¢ vs 10¢
  [{ cents: 5, count: 1 }, { cents: 25, count: 1 }],   // 5¢ vs 25¢
];

/**
 * "3 pennies vs 1 dime" — B16's named discrimination: more coins ≠ more money.
 *
 * The contrast pairs use DISJOINT denominations, because the renderer groups a
 * row by denomination: two piles that shared a coin type would be drawn as one
 * merged pile, and the picture would then show something the question does not
 * ask about. `showValues:false` keeps the trap intact — a child reading "10¢"
 * off the dime is no longer being asked whether more coins mean more money.
 */
export function moreValueChoice(): ItemGen {
  const box = slot<{ coins: CoinEntry[]; params: Params; seed: number }>();
  return withDrawn(
    box,
    discrimination({
      variant: 'structural',
      cognitiveOp: 'compare-money',
      draw: (r) => {
        const pair = r.pick(CONTRASTS);
        // Mention the piles in the order the row draws them (highest coin
        // first), so the sentence and the picture agree; which pile WINS varies
        // across the table, so position never gives the answer away.
        const [first, second] = pair[0].cents >= pair[1].cents ? pair : [pair[1], pair[0]];
        const a = [first];
        const b = [second];
        const aCents = totalCents(a);
        const bCents = totalCents(b);
        const aLabel = coinSetAlt(a);
        const bLabel = coinSetAlt(b);
        const winner = aCents > bCents ? aLabel : bLabel;
        const loser = aCents > bCents ? bLabel : aLabel;
        const loserHasMoreCoins = (aCents > bCents ? b : a).reduce((s, c) => s + c.count, 0)
          > (aCents > bCents ? a : b).reduce((s, c) => s + c.count, 0);
        box.last = {
          coins: [...a, ...b],
          params: { aCents, bCents, aLabel, bLabel },
          seed: r.uint(),
        };
        return {
          prompt: `[image: ${coinSetAlt([...a, ...b])}] Which is worth MORE: ${aLabel} or ${bLabel}?`,
          correct: winner,
          distractors: [
            {
              text: loser,
              errorTag: 'concept-misconception' as const,
              rationale: loserHasMoreCoins
                ? 'The taller pile of coins — chosen by how many coins there are rather than by what each one is worth.'
                : 'The single bigger-value coin — chosen without adding up the smaller coins beside it.',
            },
            {
              text: 'they are worth the same',
              errorTag: 'task-comprehension' as const,
              rationale: 'Treats a pile of coins and a single coin as interchangeable without valuing either.',
            },
          ],
          hints: [
            'Does a pile with more coins in it always hold more money?',
            'Work out what each pile is worth in cents, then compare those two amounts.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        };
      },
    }),
    ({ coins, params, seed }) => ({
      generator: { templateId: 'money_verify_more_value_v1', params, seed },
      figure: coinSetFigure(coins, { showValues: false }),
    }),
  );
}

/**
 * "How much are these coins worth?" as a CHOICE, against the two named money
 * misconceptions: the coin COUNT answered instead of the value, and the nickel
 * counted as one. Both distractors are computed by the same code the verify
 * template runs, so each option is a real misconception's output.
 */
export function totalChoice(): ItemGen {
  const box = slot<{ coins: CoinEntry[]; seed: number }>();
  return withDrawn(
    box,
    discrimination({
      variant: 'structural',
      cognitiveOp: 'count-coins',
      draw: (r) => {
        const coins = drawPurse(r, { min: 16, max: 95, needs: [5] });
        box.last = { coins, seed: r.uint() };
        const total = totalCents(coins);
        const nickelAsOne = coins.reduce((sum, c) => sum + (c.cents === 5 ? 1 : c.cents) * c.count, 0);
        const seen = new Set<number>([total]);
        const distractors: Array<{ text: string; errorTag: ErrorTag; rationale: string }> = [];
        for (const [value, errorTag, rationale] of [
          [coinCount(coins), 'concept-misconception', 'The number of coins in the picture, answered in place of what they are worth.'],
          [nickelAsOne, 'concept-misconception', 'Every coin given its value except the nickel, which was counted as one.'],
        ] as const) {
          if (seen.has(value)) continue;
          seen.add(value);
          distractors.push({ text: centsLabel(value), errorTag, rationale });
        }
        return {
          prompt: `[image: ${coinSetAlt(coins)}] How much are these coins worth altogether?`,
          correct: centsLabel(total),
          correctForms: [String(total), countNoun(total, 'cents')],
          distractors,
          hints: [
            'Are you being asked how MANY coins there are, or how MUCH they are worth?',
            'Give each coin its own value, then add those values together.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        };
      },
    }),
    ({ coins, seed }) => ({
      generator: { templateId: 'money_verify_coin_total_v1', params: { coins }, seed },
      figure: coinSetFigure(coins, { asserts: { of: 'cents', equals: 'answer' } }),
    }),
  );
}

/** The miscounts a B16 error-analysis item can show, by name. */
export type CoinMiscount = 'nickel-as-1' | 'count-coins';

/**
 * A miscount shown and analysed (B16 Day 5).
 *
 * The wrong total in the prompt is `money_verify_coin_total_v1`'s output for the
 * named misconception over these very coins, which QG-11 recomputes: the
 * displayed error is a real one, and the true total cannot be keyed wrong. The
 * coins stay on the page because they are the evidence the child argues from.
 */
export function miscountEA(mode: CoinMiscount = 'nickel-as-1'): ItemGen {
  return withFigure(
    errorAnalysis({
      verifyTemplateId: 'money_verify_coin_total_v1',
      cognitiveOp: 'count-coins',
      drawParams: (r) => ({
        coins: drawPurse(r, { min: 16, max: 95, needs: mode === 'nickel-as-1' ? [5] : [] }),
        wrongMode: mode,
      }),
      build: (v, p, r) => ({
        prompt: `[image: ${coinSetAlt(readCoins(p))}] ${r.pick(NAMES)} counted these coins and wrote ${centsLabel(Number(v.wrong))}.`,
        extension: 'Count the pile yourself and write what it is really worth. What was each coin treated as?',
        hints: [
          'Which coin in this pile is worth more than its size suggests?',
          'Count the pile again, giving every coin its own value. Compare with what was written.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      }),
    }),
    (p) => coinSetFigure(readCoins(p), { asserts: { of: 'cents', equals: 'answer' } }),
  );
}
