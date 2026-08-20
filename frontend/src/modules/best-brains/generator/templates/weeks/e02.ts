/**
 * Level E · Week 2 — "Rates & unit rates" (conceptId: rates-unit-rates).
 *
 * FILL-ARCHITECTURE §6 row E2: anchor "the for-ONE price"; key multi-step "unit
 * rate → total; better-buy chain"; error-analysis "compares totals, not rates";
 * discrimination "cheaper-per-unit vs cheaper-total"; Day-5 signature "design
 * the better deal".
 *
 * THE WEEK'S CLAIM. A rate compares two quantities of different kinds, and two
 * rates written over different amounts are not comparable as they stand. The
 * only ground every offer can be brought to is ONE, so the week's whole method
 * is: divide to reach one, compare there, then multiply back to check. That
 * decides everything below:
 *  - the till answers a DIFFERENT question from value. What is handed over
 *    depends on how many you are buying as well as on the rate, so the cheaper
 *    ticket and the better value are separate facts and either can belong to
 *    either offer. Every discrimination in the week is built on that split;
 *  - the same split exists where there is no money at all — "made more
 *    altogether" is not "worked faster", it can just mean "ran for longer" —
 *    which is why the second discrimination leaves the shop entirely;
 *  - the check-back is not decoration. A for-one price taken as many times as
 *    the pack holds must rebuild the ticket price, and if it does not, the
 *    division went the wrong way. That is why the family's rate chain is served
 *    only through `withCheckBack`.
 *
 * The three Level-E ceiling lifts each land on a different item:
 *  - INVERSE-START — `msPumpThenDrum`: the litres the story hands over are the
 *    RESULT of the rate, so the opening move is a division nothing in the
 *    sentence order asks for;
 *  - HAS-DISTRACTOR — `msPosterOrder` states a hall's seating that is never
 *    used (and `msPumpThenDrum` states a tank count that is never used);
 *  - CHECK-BACK / ESTIMATE-FIRST — `msUnitRateThenTotalCheck` and
 *    `sitMinutesPerUnitEstimate`, each reachable ONLY through its wrapper
 *    (kit §E2.2), so neither spends two ladder slots on one wording.
 *
 * FIVE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. THE RECIPE'S ERROR-ANALYSIS IS NOT CODE-DERIVABLE, so §E2.3's protocol is
 *     used — and the third option, not a fabrication. "Compares totals, not
 *     rates" produces a CHOICE (a pack name), not a number, and `errorAnalysis`
 *     needs a {correct, wrong} pair where `wrong` is embedded in the prompt and
 *     re-derived by QG-11. Every route was checked before giving up on it:
 *     `d_verify_binop_misconception_v1` varies the OPERATION over ONE operand
 *     pair, and a totals-vs-rates comparison needs FOUR numbers (two totals,
 *     two counts) — `total_A − total_B` against `total_A/n_A − total_B/n_B` is
 *     not one binop of one pair, and forcing it would mean inventing operands
 *     with no referent in the story (the b03 trap, kit §E2.12).
 *     `d_verify_ratchain_v1` is correct-only; `ratio_verify_*` carry E1's and
 *     E17's misconceptions, not E2's; and `lib/` is not ours to extend.
 *     So the misconception is carried WHERE IT CAN BE SHOWN HONESTLY: as
 *     `betterBuy`'s code-computed "till" distractor (the shipped card IS the
 *     output of comparing totals), as `discrimSteadierRate`'s "produced more
 *     altogether" card, as the Day-5 Always/Sometimes/Never claim, and as a
 *     mistakeBank entry with its own distractor recipe. Day 5's error-analysis
 *     is then the DERIVABLE COMPLEMENTARY SLIP on the same anchor —
 *     `eaUnitPriceMultiplied`, the for-one price reached by multiplying the
 *     pack price instead of dividing it, whose shown wrong number is a real
 *     `binop` output re-derived by QG-11. Nothing is invented.
 *
 *  2. `totalFromUnitPrice` IS SERVED ON DAY SLOTS ONLY, NEVER ON A MASTERY
 *     SLOT. Measured over 2,500 draws it prints its own answer in its own
 *     prompt on 4.4% of them, and the cause is exact: its price-for-one is
 *     drawn from `r.int(6, 24) * 10` cents, which includes 100, and at exactly
 *     one dollar a kilogram the cost of k kilograms IS k — the number already
 *     standing in the sentence. Re-measured on the two slots this week actually
 *     serves it, over 800 packs: 4.13% on Day 1 and 5.38% on Day 4. That is a
 *     shared-file defect, reported and not fixed (§ SHARED-FILE DEFECTS below).
 *     Keeping it off Form A/B keeps it out of the instrument that certifies a
 *     child.
 *
 *  3. THE TWO DISCRIMINATIONS ARE NOT THE SAME QUESTION TWICE. `betterBuy` is
 *     the recipe's own contrast — cheaper per item against cheaper at the till,
 *     in money, choosing a MINIMUM. `discrimSteadierRate` moves the identical
 *     structure out of the shop: two machines, two run lengths, choosing a
 *     MAXIMUM, where the trap card is "made more altogether" and a second trap
 *     card is "finished sooner". A child who has learned "divide by the pack
 *     size" as a shopping rule has learned nothing that answers it. Both draw
 *     their winning side in equal thirds, so neither can be beaten by a habit.
 *
 *  4. NO DAY ITEM CARRIES A FIGURE, and that is a choice rather than an
 *     omission. `GATE_PROFILE.E.pictorialPerDay` is 0 — band E earns its
 *     pictures where they teach. Every picture in this week shows a for-one
 *     split, and a for-one split drawn beside an assessed item is the strategy
 *     the item exists to ask for (kit §E2.5 / §F.7). So the bars live in the
 *     lesson script and the guided examples, where the answer is already on the
 *     page, and the one figure a day item does carry is the E1 warm-up's, which
 *     belongs to its own generator.
 *
 *  5. ANSWER-IN-PROMPT AUDIT, generator by generator. `unitRate`, `unitPrice`
 *     and `msUnitRateThenTotal` were measured clean over 2,500 draws each. The
 *     four local generators clear theirs BY CONSTRUCTION and the argument is
 *     written beside each draw: one piece takes 2–9 minutes while the run holds
 *     12–20 pieces (disjoint ranges) · the box saving is 15–40 cents while
 *     every price on the page is at least 65 cents · the tank ends with at
 *     least 38 litres while every count printed is at most 16 · the print order
 *     comes to at least $7.80 while the flat fee is at most $9, the poster
 *     count at most 14 and the hall's seating at least 40. No draw here can
 *     print the number it is asking for. `totalFromUnitPrice` is the single
 *     exception and is confined per decision 2.
 *
 * SHARED-FILE DEFECTS FOUND, REPORTED AND NOT FIXED (kit: agents report, the
 * orchestrator repairs): `lib/ratio.ts::totalFromUnitPrice` draws
 * `eachCents = r.int(6, 24) * 10`, which includes 100. On that draw the item
 * reads "Rice costs $1 for one kilogram… what do k kilograms cost?" and the
 * answer is k, already printed. 1 draw in 19 by construction; 4.4% measured.
 * The one-line repair is to draw the cents from a set that excludes 100.
 *
 * Retrieval is backward-only into the four skills a unit rate actually runs on:
 * E1 equivalent ratios (the direct ancestor — a rate is the ratio table's row
 * for one), D16 exact division (the move that reaches one), D20 decimal
 * multiplication (the move that builds back up in money) and D15 multiplication
 * fluency.
 */

import { asWarmup, classify, decMultiply, divideExact, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep, multiStepDec } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { countNoun, money, wholeMoney } from '../lib/format';
import { formatDec } from '../lib/compute';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel } from '../lib/figures';
import {
  betterBuy,
  eaUnitPriceMultiplied,
  equivalentRatioFill,
  msUnitRateThenTotal,
  totalFromUnitPrice,
  unitPrice,
  unitRate,
} from '../lib/ratio';
import { numberWords } from '../shared';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };
const D20 = { level: 'D' as const, week: 20 };
const E1 = { level: 'E' as const, week: 1 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §F.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Money surfaces
//
// `lib/format.ts` owns the rendering; this is only the all-or-none cents rule of
// §P1 applied across the amounts that share ONE prose string (a string that
// mentions cents anywhere prints every amount with cents, the way a receipt
// does). Amounts are integer CENTS everywhere below — never a float, because a
// price with an IEEE754 tail is not a price (G4's arithmetic law).
// ---------------------------------------------------------------------------

/** A whole number of cents as its canonical dollar string ("450" → "4.5"). */
const dollars = (cents: number): string => formatDec(cents, 2);

/** Every amount in one string rendered the same way (§P1 all-or-none). */
function cash(cents: readonly number[]): string[] {
  const anyCents = cents.some((c) => c % 100 !== 0);
  return cents.map((c) => (anyCents ? money(dollars(c)) : wholeMoney(c / 100)));
}

// ---------------------------------------------------------------------------
// Draw pools — bound to the frame that can truthfully carry them. None of these
// nouns is used by the G4 family's own pools (pens / sponges / notebooks /
// batteries, printers / pumps / conveyors / looms), so a week that serves both
// never prints the same shop twice.
// ---------------------------------------------------------------------------

/** Priced goods for the better-buy chain and the deal-design puzzle. */
const WARES = [
  { one: 'candle', many: 'candles' },
  { one: 'plant pot', many: 'plant pots' },
  { one: 'roof tile', many: 'roof tiles' },
  { one: 'chalk stick', many: 'chalk sticks' },
] as const;

/** Steady machines working through identical pieces — the minutes-per-one frame. */
const HAULS = [
  { machine: 'A hoist', many: 'identical crates', single: 'crate' },
  { machine: 'A packing line', many: 'identical cartons', single: 'carton' },
  { machine: 'A kiln', many: 'identical trays', single: 'tray' },
  { machine: 'A cutting press', many: 'identical panels', single: 'panel' },
] as const;

/** Paired machines for the speed discrimination — two of a kind, told apart by
 *  a neutral label, so neither name carries a hint about which is quicker. */
const RIGS = [
  { first: 'the blue press', second: 'the grey press', out: 'sheets' },
  { first: 'the yard pump', second: 'the roof pump', out: 'litres' },
  { first: 'the wide loom', second: 'the narrow loom', out: 'centimetres' },
  { first: 'the upper belt', second: 'the lower belt', out: 'crates' },
] as const;

const capitalise = (s: string): string => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** E1 — the equivalent-ratio fill. A unit rate is that table's row for ONE,
 *  met a week before the week that makes it the only comparable row. */
const wRatioEquiv = asWarmup(equivalentRatioFill(), E1);
/**
 * D16 — exact division: the move that reaches one.
 *
 * The divisor and quotient ranges are DISJOINT on purpose. `divideExact` draws
 * the two independently, so overlapping ranges let them coincide and print a
 * warm-up whose answer is already standing on its own line — in the one week
 * whose whole subject is not reading a rate off the page.
 */
const wDivide = asWarmup(divideExact(4, 9, 12, 24), D16);
/** D20 — decimal × whole, which is exactly the move that rebuilds a total from
 *  a price for one, and therefore the arithmetic every check-back runs on. */
const wDecMultiply = asWarmup(decMultiply(false), D20);
/** D15 — the product itself, so building a total back up never stalls. */
const wMultiply = asWarmup(multiply(4, 12, 11, 19), D15);

// ---------------------------------------------------------------------------
// Single-step rates
//
// Three come from the G4 family: the unit rate off a steady machine, the unit
// PRICE (the week's anchor in money), and the rate scaled back up to a total.
// The fourth is local, and it is the rate read the OTHER way round — minutes
// for one piece rather than pieces in one minute — which is the same pair of
// quantities producing a different for-one figure. It is the week's
// estimate-first carrier, so it is reachable only through the wrapper (§E2.2).
// ---------------------------------------------------------------------------

/**
 * Minutes for ONE piece.
 *
 * No leak by construction: one piece takes 2–9 minutes while the run holds
 * 12–20 pieces, so the answer can equal neither the count nor the total (the
 * total is at least twice the count). The 2–9 window is also what makes the
 * estimate-first probe a genuine coin flip — four of its eight values sit
 * nearer a minute and four nearer ten.
 */
const sitMinutesPerUnit = situation({
  situationType: 'measurement',
  cognitiveOp: 'unit-rate-inverse',
  draw: (r) => {
    const haul = r.pick(HAULS);
    const per = r.int(2, 9);
    const count = r.int(12, 20);
    const total = per * count;
    return {
      prompt: `${haul.machine} worked steadily through ${countNoun(count, haul.many)} in ${countNoun(total, 'minutes')}. How many minutes did one ${haul.single} take?`,
      answerValue: String(per),
      templateId: 'ratio_unit_rate_v1',
      params: { total: String(total), count },
      units: 'minutes',
      hints: [
        'Which of the two amounts here measures the whole run, and which one measures a single piece of it?',
        'Share the whole stretch of time out evenly between the pieces that filled it.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});
const sitMinutesPerUnitEstimate = withEstimateFirst(
  sitMinutesPerUnit,
  'is the time for a single one nearer to a minute or nearer to ten minutes?',
);

// ---------------------------------------------------------------------------
// Multi-step: four shapes, so "two steps" never becomes one template
// ---------------------------------------------------------------------------

/**
 * THE FAMILY'S HEADLINE CHAIN (§6 row E2, "unit rate → total"): a pack price
 * divided down to one, then built up to the number wanted. Served ONLY through
 * the check-back wrapper, because the honest check on a rate is not "is the
 * arithmetic right" but "does my price for one, taken as many times as the pack
 * holds, rebuild the ticket price" — the week's rule used backwards.
 */
const msUnitRateThenTotalCheck = withCheckBack(
  msUnitRateThenTotal(),
  'take your price for one as many times as the pack holds — does it rebuild the ticket price the story states?',
);

/**
 * THE BETTER-BUY CHAIN (§6 row E2). Two prices that cannot be compared as they
 * stand: one covers a single item, the other a whole box. The chain therefore
 * goes UP before it comes DOWN — build the loose price to a whole box, take the
 * box price off that, and share what is left across the box — and the answer is
 * the saving on ONE, which is the only figure either offer can be stated in.
 *
 * Exact by construction: the per-item saving is DRAWN and the box price is built
 * from it, so the closing division is never a rounding opportunity. No leak: the
 * saving is 12–45 cents while the loose price is at least 125 and the box price
 * at least $4.80. The loose price never lands on a whole dollar (it is a
 * multiple of ten plus five), so every amount on the page prints with cents.
 *
 * The saving is drawn to the CENT, not to the nickel. At a five-cent step the
 * slot carried six possible answers and served its commonest on 18.7% of draws —
 * a shape the fill was explicitly told not to certify on, and this generator
 * holds a mastery slot. Whole cents cost nothing (a box price built from an
 * integer per-item saving is an integer either way) and take the slot to 34
 * answers with a top share of 4.3–4.6% across its four servings.
 */
const msBoxSavingPerItem = multiStepDec({
  situationType: 'comparison',
  cognitiveOp: 'rate-better-buy-chain',
  draw: (r) => {
    const ware = r.pick(WARES);
    const looseCents = 5 + 10 * r.int(12, 20);   // 125–205c loose, never whole dollars
    const perItemSave = r.int(12, 45);           // 12–45c cheaper in the box
    const boxCount = r.pick([6, 8, 10, 12]);
    const boxCents = (looseCents - perItemSave) * boxCount;
    const [loose, box] = cash([looseCents, boxCents]);
    return {
      prompt: `A shop sells ${ware.many} loose at ${loose} each, or in a box of ${numberWords(boxCount)} for ${box}. How much less does one ${ware.one} cost when the box is bought?`,
      init: dollars(looseCents),
      steps: [
        { op: 'mul', v: String(boxCount) },
        { op: 'sub', v: dollars(boxCents) },
        { op: 'div', v: String(boxCount) },
      ],
      units: 'dollars',
      hints: [
        'Can two prices be set against each other while one of them covers a box and the other covers a single item?',
        'Bring the loose price up to a whole box first, take the box price off that, and then share what is left across the box.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The litres the story hands over
 * are the RESULT of the pump's rate, not the rate itself, so the opening move
 * is a division the sentence order never asks for: recover what one minute
 * delivers, and only then build the new run. The yard's tank count is stated,
 * is never used, and is exactly the number a child is tempted to divide by.
 *
 * No leak by construction: the drum's contribution is capped strictly below
 * what the pump delivers in the minutes the first run has over the second, so
 * the answer is always smaller than the stated total; and the answer is at
 * least 38 litres while every count printed is at most 16.
 */
const msPumpThenDrum = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'rate-run-then-top-up',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const perMinute = r.int(6, 15);
    const runSecond = r.int(3, 7);
    const runFirst = runSecond + r.int(5, 9);
    const total = perMinute * runFirst;
    // poured < perMinute·(runFirst − runSecond), so the answer stays under the
    // stated total. The floor is always ≥ 2 (6 litres a minute over 5 spare
    // minutes already clears 30), so the range never inverts.
    const poured = 10 * r.int(2, Math.min(9, Math.floor((perMinute * (runFirst - runSecond)) / 10) - 1));
    const tanks = r.int(3, 6);
    const name = one(r);
    return {
      prompt: `A pump ran steadily and delivered ${countNoun(total, 'litres')} in ${countNoun(runFirst, 'minutes')}. The yard it stands in holds ${countNoun(tanks, 'storage tanks')}. ${name} then runs the pump into an empty tank for ${countNoun(runSecond, 'minutes')} and tips in another ${countNoun(poured, 'litres')} from a drum. How many litres are in that tank?`,
      initN: total,
      steps: [
        { op: 'div', n: runFirst, d: 1 },
        { op: 'mul', n: runSecond, d: 1 },
        { op: 'add', n: poured, d: 1 },
      ],
      units: 'litres',
      hints: [
        'Does the stated number of litres describe one minute of pumping, or a whole run of it?',
        'Recover what a single minute delivers, take as many of those as the new run lasts, and then bring in what came out of the drum.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3), and the shape that shows a rate
 * is not the whole story: one part of this charge grows with the order and one
 * part does not, so scaling everything is wrong and scaling nothing is wrong.
 * The hall's seating is stated and never used.
 *
 * No leak by construction: the total is at least $7.80 while the flat fee is at
 * most $9 and the poster count at most 14; the seating is at least 40, and the
 * total can never reach 40 (fourteen posters at two dollars plus nine is 37).
 */
const msPosterOrder = multiStepDec({
  situationType: 'money-change',
  cognitiveOp: 'rate-plus-fixed-charge',
  posing: 'has-distractor',
  draw: (r) => {
    const eachCents = 10 * r.int(8, 20);      // 80c–$2.00 a poster
    const posters = r.int(6, 14);
    const setupCents = 100 * r.int(3, 9);     // a flat $3–$9
    const seats = r.int(40, 90);
    const name = one(r);
    const [each, setup] = cash([eachCents, setupCents]);
    return {
      prompt: `A print shop charges ${each} for each poster and a flat ${setup} for setting up the job. ${name} orders ${countNoun(posters, 'posters')} for a hall that seats ${countNoun(seats, 'people')}. What is the whole charge?`,
      init: dollars(eachCents),
      steps: [
        { op: 'mul', v: String(posters) },
        { op: 'add', v: dollars(setupCents) },
      ],
      units: 'dollars',
      hints: [
        'Which amount in this order grows with the number of posters, and which one is charged once whatever the order?',
        'Build the poster cost up from the price of a single one, then bring in the charge that does not depend on how many were ordered.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the totals-vs-rates split, from inside and outside the shop
//
// `betterBuy` (the family's, the recipe's own) is the money form: cheaper at
// the till against cheaper for each one, choosing a minimum. The item below is
// the same split with the shop taken away: two machines, two run lengths,
// choosing a MAXIMUM, with "made more altogether" and "finished sooner" as the
// two honest wrong readings. Neither can be answered by the other's habit.
// ---------------------------------------------------------------------------

/**
 * Which machine worked faster.
 *
 * The winning side is DRAWN in equal thirds and the runs are built to match —
 * the construction that repaired `betterBuy`, `countTheSignsTrap` and
 * `compareNegativesTrap`.
 *
 * BUT A DRAWN WINNER IS NOT ENOUGH, and this item measured why (kit §E2.9a,
 * b11's lesson in its own shape). The first construction drew which machine ran
 * LONGER independently of which was FASTER, which sounds neutral and is not: the
 * faster machine then ran longer half the time — and so certainly made more —
 * and made more anyway on a quarter of the remaining draws. "Pick the one that
 * made more altogether" scored 40.8% against a 33.3% floor, which is the very
 * misconception the item exists to break being rewarded.
 *
 * So the ALIGNMENT is what is drawn, in halves: on half the draws the faster
 * machine also made more, and on the other half the run lengths are built so the
 * slower machine's total is strictly the larger. Measured after: "made more
 * altogether", "ran for longer" and "finished sooner" all sit at 33–34%.
 *
 * The two wrong cards are derived from the drawn numbers, never from a fixed
 * list: the card's rationale states the reading that actually produces it on
 * this draw, which is why a card can carry "produced more altogether" on one
 * seed and "finished sooner" on the next.
 */
const discrimSteadierRate = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'compare-rates-nonmoney',
  draw: (r) => {
    const rig = r.pick(RIGS);
    const outcome = r.pick(['first', 'second', 'tie'] as const);
    const slow = r.int(5, 9);
    const fast = slow + r.int(1, 3);
    // Whether the higher RATE also carries the higher TOTAL — drawn, capped at
    // half. Both branches consume exactly one further draw, so the two paths
    // stay in step and the pack is bit-stable per seed.
    const totalsAgree = r.chance(0.5);
    const shortRun = r.int(4, 8);
    const longRun = totalsAgree
      ? shortRun + r.int(2, 7)
      // Long enough that the slower machine's total strictly exceeds the
      // faster one's: slow·longRun ≥ slow·(shortRun·fast/slow) + slow.
      : Math.ceil((shortRun * fast) / slow) + r.int(1, 4);
    const flip = r.chance(0.5);   // which side carries the longer run on a tie
    const rateFirst = outcome === 'second' ? slow : outcome === 'first' ? fast : slow;
    const rateSecond = outcome === 'first' ? slow : outcome === 'second' ? fast : slow;
    const fasterTime = totalsAgree ? longRun : shortRun;
    const slowerTime = totalsAgree ? shortRun : longRun;
    const timeFirst =
      outcome === 'tie' ? (flip ? longRun : shortRun) : outcome === 'first' ? fasterTime : slowerTime;
    const timeSecond =
      outcome === 'tie' ? (flip ? shortRun : longRun) : outcome === 'first' ? slowerTime : fasterTime;
    const outFirst = rateFirst * timeFirst;
    const outSecond = rateSecond * timeSecond;
    const same = 'they were working at the same rate';
    const sameCard = {
      text: same,
      errorTag: 'task-comprehension' as const,
      rationale: 'Treats two runs of different lengths as one comparison, without bringing either of them down to what happens in a single minute.',
    };
    /** The honest reading that produces this machine's card ON THIS DRAW. */
    const machineCard = (which: 'first' | 'second') => {
      const text = which === 'first' ? rig.first : rig.second;
      const mine = which === 'first' ? outFirst : outSecond;
      const other = which === 'first' ? outSecond : outFirst;
      const myTime = which === 'first' ? timeFirst : timeSecond;
      const otherTime = which === 'first' ? timeSecond : timeFirst;
      if (mine > other) {
        return {
          text,
          errorTag: 'concept-misconception' as const,
          rationale: 'Names the machine that produced more altogether, which settles how much was made and leaves how fast it was made untouched.',
        };
      }
      if (myTime < otherTime) {
        return {
          text,
          errorTag: 'representation-misread' as const,
          rationale: 'Names the machine that finished sooner, reading the clock on its own without asking how much came off it in that time.',
        };
      }
      // GUARD, not a live branch. Under the pool above a distractor machine
      // either carries the larger total or carries both the smaller total and
      // the shorter run, so the two branches above are exhaustive — this one
      // exists so that widening the pool later cannot ship a rationale that is
      // false of the draw it is printed on.
      return {
        text,
        errorTag: 'representation-misread' as const,
        rationale: 'Names the machine that spent longer at work, which measures time on the job rather than the pace of it.',
      };
    };
    const correct = outcome === 'tie' ? same : outcome === 'first' ? rig.first : rig.second;
    const distractors =
      outcome === 'tie'
        ? [machineCard('first'), machineCard('second')]
        : outcome === 'first'
          ? [machineCard('second'), sameCard]
          : [machineCard('first'), sameCard];
    return {
      prompt: `Two machines each ran at a steady rate. ${capitalise(rig.first)} made ${countNoun(outFirst, rig.out)} in ${countNoun(timeFirst, 'minutes')}, and ${rig.second} made ${countNoun(outSecond, rig.out)} in ${countNoun(timeSecond, 'minutes')}. Which one was working faster?`,
      correct,
      distractors,
      hints: [
        'Which comparison decides speed — the amount that came off each machine, or the amount for each minute it ran?',
        'Bring both runs down to a single minute, then set the two results beside each other.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * THE DAY-5 SIGNATURE (§6 row E2, "design the better deal"). The week run
 * backwards: instead of judging a deal that exists, build one to a stated
 * per-item advantage and a stated ceiling at the till. Fixed prose, because the
 * demand is on the design and the writing rather than on fresh arithmetic — and
 * the two parts are named separately so a price with no sentence, or a sentence
 * with no price, cannot pass as an answer.
 */
const designTheDeal = reasoning({
  prompt:
    'A market stall sells beeswax candles loose at $1.60 each. The stall wants to add a box of eight that beats the loose price by 20 cents on every candle, and the box must not cost more than $12.00 at the till. Write the price the box has to carry. Then write one sentence for the stall\'s sign that tells a shopper what the box saves them on a single candle, with the saving given as an amount rather than as a comparing word.',
  value: 'the box carries $11.20 — eight candles at $1.40 each, twenty cents under the loose price, and $1.60 saved across the box',
  acceptableForms: ['11.20', '$11.20', '1.40', '$1.40 each', 'twenty cents', '$1.60 saved'],
  keywords: true,
  hints: [
    'What has to be settled about a single candle before anything can be said about the box?',
    'Fix the price for one candle first, build the box price from it, and then hold that against the limit at the till.',
  ],
  errorTags: ['task-comprehension', 'concept-misconception'],
});

/**
 * The claim that separates a rate from a total. A price for one is transitive
 * across any equal order — that is precisely what makes it the ground both
 * offers can be brought to — while the amount handed over at the till is not,
 * because it depends on how many are bought as well as on the rate. The keyed
 * verdict is ALWAYS: "sometimes" here is the reading that lets a comparison
 * flip once the order grows, which is the misconception the week exists to
 * break rather than the answer to it.
 */
const cheaperForOneStays = classify({
  prompt:
    'Always, sometimes, or never true: if one shop charges less than another for a single item, it also charges less for any equal number of those items. In one sentence, name what your verdict rests on.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale: 'Lets the comparison flip once the order grows, as though a price for one stopped applying when more are bought — the reading that makes a bigger pack look better without any working.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Denies that a price for one settles anything about a larger order, which throws away the one figure that makes two offers comparable at all.',
    },
  ],
  hints: [
    'If every single item costs less at one shop, what could a larger order there ever do to the comparison?',
    'Take a price for one at each shop, order the same number from both, and see whether any order size can turn the comparison round.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE02 = makeWeekBuilder({
  level: 'E',
  week: 2,
  conceptId: 'rates-unit-rates',
  conceptName: 'Rates & unit rates',
  strandTags: ['multiplication-division', 'decimals-fractions'],
  prerequisiteWeeks: [D16, D20, E1],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the for-one price',
  conceptFamily: 'operation',
  deepeningDelta:
    'E1 built a ratio table and proved that every row of it is the first row taken some number of times, so any row could stand for the relationship. E2 picks ONE of those rows and makes it the only row worth writing: the row for a single unit. That is a genuine narrowing rather than a repeat — a ratio table lets two mixes be compared at any shared term, while two OFFERS almost never share a term, so the unit row stops being a convenience and becomes the only ground they have. It also brings in the quantity E1 never had to name: the total handed over, which moves with the size of the order as well as with the relationship, and is therefore the thing a rate has to be told apart from.',
  explanation: {
    hook:
      'One shop sells candles in a box of five, another in a box of eight, and the bigger box costs more. That tells you which till takes more money. It tells you nothing at all about which shop is charging more for a candle.',
    whyBeforeHow:
      'A rate compares two quantities of different kinds — dollars against candles, litres against minutes — and two rates written over different amounts cannot be compared as they stand, because a price for five and a price for eight are answers to two different questions. Bringing both to the same amount is what makes them comparable, and the one amount every offer can be brought to is a single item. That is why we work with the for-one price: divide each total by the number it covers, and the two results are finally measurements of the same thing. Once both offers are stated for one, the comparison is ordinary, and the smaller figure stays the smaller one for any equal number bought. The trap is that the till answers a different question. What is handed over depends on how much you are buying as well as on the rate, so the cheaper ticket and the better value are separate facts, and either one of them can belong to either offer.',
    script: [
      {
        say: 'Watch me turn a box price into something I can compare. A box of five candles costs $4.00. I do not hold that four dollars against anything yet, because it belongs to five candles and I want a number that belongs to one. So I break it into five equal shares, and each share is eighty cents. That eighty cents is the for-one price, and it is the only figure here that describes a candle rather than a box.',
        visual: 'The box price as one bar, cut into five equal shares of eighty cents.',
        figure: barModel(
          [
            { label: 'the box price, in cents', segments: [{ value: 400, label: '400' }], total: '400' },
            {
              label: 'the same box price, shared between five candles',
              segments: [{ value: 80, label: '80' }, { value: 80 }, { value: 80 }, { value: 80 }, { value: 80 }],
              total: '400',
            },
          ],
          { scaleMax: 400, alt: 'a bar of 400 cents for the box, and beneath it the same length cut into five equal parts of 80 cents' },
        ),
      },
      {
        say: 'Now the trap every shop sign is built on. Beside that box of five at $4.00 there is a box of eight at $6.00. The bigger box takes more money at the till, so a shopper who reads only the tickets calls the small box the cheaper one. But eight candles for $6.00 is seventy-five cents each, and seventy-five cents is under eighty. The dearer box is the better buy. Cheaper at the till and cheaper for each one are two different questions, and only one of them is about value.',
        visual: 'The two for-one prices drawn to one scale, beneath the two ticket prices they came from.',
        figure: barModel(
          [
            { label: 'one candle from the box of five, in cents', segments: [{ value: 80, label: '80' }] },
            { label: 'one candle from the box of eight, in cents', segments: [{ value: 75, label: '75' }] },
          ],
          { scaleMax: 80, alt: 'a bar of 80 cents beside a slightly shorter bar of 75 cents, the two for-one prices' },
        ),
      },
      {
        say: 'The same move works where there is no money in the story at all. One pump moved 120 litres in 8 minutes; another moved 90 litres in 5 minutes. The first pump moved more altogether, so it looks like the stronger one. Bring each down to a single minute, though, and the first gives 15 litres a minute while the second gives 18. More altogether was never faster. Here it only means the first pump ran for longer.',
        visual: 'What each pump delivers in one minute, drawn to one scale beside the totals they came from.',
        figure: barModel(
          [
            { label: 'the first pump, litres in one minute', segments: [{ value: 15, label: '15' }] },
            { label: 'the second pump, litres in one minute', segments: [{ value: 18, label: '18' }] },
          ],
          { scaleMax: 18, alt: 'a bar of 15 litres beside a longer bar of 18 litres, the two rates for a single minute' },
        ),
      },
      {
        say: 'One habit before any of the dividing, and one after. Before: I estimate the size the for-one price has to be. A box of ten at about six dollars has to land near sixty cents a candle, so an answer of six dollars, or of six cents, is not a slip in my arithmetic — it is a slip in what I was working out at all. After: I check back. My price for one, taken as many times as the box holds, has to rebuild the price on the ticket. If it does not, the division went the wrong way round, and I have found that before anyone else has to.',
        visual: 'The for-one price laid down as many times as the box holds, rebuilding the ticket price.',
        figure: barModel(
          [
            { label: 'the price on the ticket, in cents', segments: [{ value: 400, label: '400' }], total: '400' },
            {
              label: 'the for-one price laid down five times',
              segments: [{ value: 80 }, { value: 80 }, { value: 80 }, { value: 80 }, { value: 80 }],
              total: '400',
            },
          ],
          { scaleMax: 400, alt: 'a bar of 400 cents for the ticket price beside five 80-cent blocks that together reach the same length' },
        ),
      },
    ],
    summary:
      'A rate compares two quantities of different kinds, and a unit rate states that comparison for exactly one of them — the for-one price, the litres in one minute, the minutes for one crate. Two offers can only be judged against each other once both are stated for one, because the totals they show answer a different question: what is paid at the till, or how much came off a machine, depends on how many and how long as well as on the rate. Divide to reach one, compare there, and then multiply the for-one figure back up to check that it rebuilds the total you were given.',
    vocabulary: [
      { term: 'rate', kidGloss: 'a comparison of two quantities of different kinds, such as dollars for each kilogram or litres for each minute' },
      { term: 'unit rate', kidGloss: 'the rate written for exactly one of the second quantity — the amount for ONE' },
      { term: 'unit price', kidGloss: 'the unit rate of a price: what a single item costs, whatever size the pack it came in' },
      { term: 'better buy', kidGloss: 'the offer with the lower unit price, which is not always the offer with the lower ticket price' },
      { term: 'steady rate', kidGloss: 'a rate that does not change during the run, so every equal stretch of it does an equal amount of work' },
    ],
  },
  guidedExamples: [
    {
      ...ge(2, 1, 'modeled', 'A pack of six notebooks costs $5.40. Every notebook in the pack costs the same. What does one notebook cost?', [
        {
          teacherSay:
            'Let me settle what I am being asked before I touch a number. I have one price, and it belongs to six notebooks together. The question wants a price that belongs to a single notebook — so the figure I am after is smaller than the one I was handed, and the six is what tells me how much smaller.',
        },
        {
          teacherSay:
            'Six equal shares of $5.40, then. Before I divide I make a rough call so I know what I am looking for: five dollars shared six ways is under a dollar, so my answer starts with a zero. What is the exact share?',
          expected: '0.90',
        },
        {
          childDo: 'Take that price for one, count six of them, and hold the result against the price on the packet.',
          expected: '5.40',
        },
      ], '0.90'),
      visual: 'The packet price as one bar, cut into the six equal shares the six notebooks stand on.',
      figure: barModel(
        [
          { label: 'the packet price, in cents', segments: [{ value: 540, label: '540' }], total: '540' },
          {
            label: 'the same price shared between six notebooks',
            segments: [{ value: 90, label: '90' }, { value: 90 }, { value: 90 }, { value: 90 }, { value: 90 }, { value: 90 }],
            total: '540',
          },
        ],
        { scaleMax: 540, alt: 'a bar of 540 cents for the packet, and beneath it the same length cut into six equal parts of 90 cents' },
      ),
    },
    {
      ...ge(2, 2, 'completion', 'A shop sells the same batteries in a pack of four for $3.00 and in a pack of ten for $7.00. Which pack is the better buy?', [
        {
          teacherSay: 'Which question does "the better buy" answer — which pack costs less to walk out with, or which pack costs less for each battery?',
          expected: 'which costs less for each battery',
        },
        {
          childDo: 'Work out what one battery costs under each offer, then keep the smaller of the two figures.',
          expected: 'the pack of ten',
        },
      ], 'the pack of ten, at 70 cents a battery against 75 cents'),
      visual: 'The two for-one prices drawn to one scale. The ticket prices are the ones you are given.',
      figure: barModel(
        [
          { label: 'one battery from the pack of four, in cents', segments: [{ value: 75, label: '75' }] },
          { label: 'one battery from the pack of ten, in cents', segments: [{ value: 70, label: '70' }] },
        ],
        { scaleMax: 75, alt: 'a bar of 75 cents beside a slightly shorter bar of 70 cents, the two prices for a single battery' },
      ),
    },
    ge(2, 3, 'prompted', 'Rope is sold by the metre at the same price throughout. Eighteen metres cost $22.50. What do seven metres cost?', [
      {
        childDo: 'Find what a single metre costs first, then take as many of those as the question asks for.',
        expected: '8.75',
      },
    ], '8.75'),
    {
      // Independent stage: the two stated prices only. Deciding to build the
      // loose price up to a whole tray BEFORE comparing anything is the task
      // here, so drawing the tray total would hand over the plan the item
      // exists to ask for (L33).
      ...ge(2, 4, 'independent', 'A garden centre sells plant pots loose at $1.35 each, or in a tray of twelve for $13.20. How much less does one pot cost when the tray is bought? Solve cold.', [
        {
          childDo: 'Bring the loose price up to a whole tray before you compare anything, then share the gap you find across the tray.',
          expected: '0.25',
        },
      ], '0.25'),
      visual: 'The loose price for a single pot. The tray is yours to work out.',
      figure: barModel(
        [
          { label: 'one pot bought loose, in cents', segments: [{ value: 135, label: '135' }] },
        ],
        { scaleMax: 135, alt: 'a single bar of 135 cents for one loose pot; the tray is not drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the rate read three ways (the amount in one minute,
    // the price of one item, one item's price scaled back up to a total).
    // Single-step only; no chain, no choice and no trap yet.
    [
      { gen: wRatioEquiv, diff: 2 },
      { gen: wDivide, diff: 2 },
      { gen: wDecMultiply, diff: 2 },
      { gen: unitRate(), diff: 3 },
      { gen: unitPrice(), diff: 3 },
      { gen: totalFromUnitPrice(), diff: 3 },
    ],
    // Day 2 — fluency + application: both discriminations (the shop one and the
    // machine one), the estimate-first rate, and the week's first chain.
    [
      { gen: wMultiply, diff: 2 },
      { gen: wDivide, diff: 2 },
      { gen: sitMinutesPerUnitEstimate, diff: 3 },
      { gen: betterBuy(), diff: 3 },
      { gen: discrimSteadierRate, diff: 3 },
      { gen: msUnitRateThenTotalCheck, diff: 4 },
    ],
    // Day 3 — interleave: the better-buy trap sits between two single-step
    // rates and two differently-shaped chains, so nothing on the page signals
    // which kind of work is coming next.
    [
      { gen: wDecMultiply, diff: 2 },
      { gen: betterBuy(), diff: 3 },
      { gen: unitPrice(), diff: 3 },
      { gen: unitRate(), diff: 3 },
      { gen: msBoxSavingPerItem, diff: 4 },
      { gen: msPosterOrder, diff: 3 },
    ],
    // Day 4 — word problems: three chains (one with the check named, one
    // inverse-start, one that goes up before it comes down) plus two
    // single-step items, so "it must be multi-step" never becomes the cue.
    [
      { gen: msUnitRateThenTotalCheck, diff: 5 },
      { gen: msPumpThenDrum, diff: 5 },
      { gen: msBoxSavingPerItem, diff: 5 },
      { gen: sitMinutesPerUnitEstimate, diff: 4 },
      { gen: totalFromUnitPrice(), diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the for-one price found by
    // multiplying, the deal the child has to design, and the claim that says
    // exactly how far a price for one carries (+ a ramped warm-up).
    [
      { gen: wRatioEquiv, diff: 2 },
      { gen: eaUnitPriceMultiplied(), diff: 4 },
      { gen: designTheDeal, diff: 3 },
      { gen: cheaperForOneStays, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the habit worth watching for this week is reading a shelf by its tickets. Faced with two packs, most of us compare what we would hand over, which is a real question and a different one — it moves with how much we are buying. If you are in a shop together, try asking what ONE of the thing costs under each offer before either of you looks at which ticket is smaller. The unit price is usually printed in small type under the shelf label, so the answer is there to check against.',
  ],
  puzzle: (r) => {
    // A rate AUDIT (the CURRICULUM-MAP Day-5 non-computational focus for this
    // cell: "find the trap in a deal"). Three offers for one thing, one of them
    // wearing a sign — and whether the sign is telling the truth is DRAWN, so a
    // child cannot learn "the sign always lies" and score without working.
    // The keyed answer is the lowest of the three for-one prices, which moves
    // with every draw whichever way the sign falls.
    const ware = r.pick(WARES);
    // Drawn to the cent: at a five-cent step the puzzle had 17 possible answers
    // and served its commonest on 9.5% of draws.
    const middle = r.int(60, 130);               // 60c–$1.30 a piece
    const step = r.int(8, 30);                   // the gap between offers, 8c–30c
    const smallPack = r.pick([4, 5]);
    const bigPack = r.pick([8, 10, 12]);
    const signHonest = r.chance(0.5);
    const looseEach = middle + step;             // loose is always the dearest
    const smallEach = signHonest ? middle : middle - step;
    const bigEach = signHonest ? middle - step : middle;
    const best = middle - step;
    const [loose, smallPrice, bigPrice, bestPrice] = cash([
      looseEach,
      smallEach * smallPack,
      bigEach * bigPack,
      best,
    ]);
    return {
      id: 'E2-PZ-01',
      title: 'Puzzle Grove: The Sign That Says Save',
      puzzleType: 'error-analysis',
      prompt: `A shop offers ${ware.many} three ways: loose at ${loose} each, a pack of ${numberWords(smallPack)} for ${smallPrice}, or a pack of ${numberWords(bigPack)} for ${bigPrice} under a sign reading BEST VALUE. Work out what one ${ware.one} costs under each of the three offers. Write the lowest of those three amounts. Then write one sentence saying whether the sign has earned its place, and how you know.`,
      answer: {
        value: bestPrice,
        acceptableForms: [dollars(best), bestPrice, `${best} cents`],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'What would each of these three offers have to be turned into before any two of them could be set side by side?',
        'Divide each pack price by the number the pack holds, and leave the loose price alone — it is already the price of one.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'rate-audit' },
  sprint: {
    skill: 'Multiplication facts to 12 — the pairing every for-one price is checked against',
    sourceWeek: D15,
    itemCount: 20,
    scheduledDay: 2,
    templateId: 'mult_facts_v1',
    params: { factorRange: [3, 12] },
  },
  mastery: [
    { gen: unitPrice(), diff: 3 },
    { gen: msUnitRateThenTotalCheck, diff: 4 },
    { gen: unitRate(), diff: 3 },
    { gen: msBoxSavingPerItem, diff: 4 },
    { gen: betterBuy(), diff: 3 },
    { gen: msPumpThenDrum, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step and single-decision rate work — the price of one item out of a pack, the amount a steady machine makes in one minute, and the better buy between two pack offers whose winning side is drawn in equal thirds (so Form B can key the other side, or a tie, without changing the slot). 02/04/06: chains — a pack price divided to one and rebuilt to a stated quantity with the check named, a loose price raised to a whole box and shared back down to the saving on one, and a pump rate recovered from a completed run before a new run and a poured amount are combined (inverse-start, carrying a tank count that goes deliberately unused). No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'compares-totals-not-rates',
      description: 'Judges two offers or two machines on the totals they state — the smaller ticket, the larger output — instead of bringing both to what happens for ONE. The totals are real numbers and they answer a real question; they just answer a different one, because a total moves with how much was bought or how long the run lasted as well as with the rate.',
      exampleWrongAnswer: 'a pack of four at $3.00 called the better buy over a pack of ten at $7.00, because three is less than seven',
      distractorRationale: 'Offer the side the totals point at — the smaller ticket price, or the larger output — on a draw where the rates point the other way, so only the for-one figure separates the two options.',
      reteachPointer: 'explanation/script[1] (cheaper at the till and cheaper for each one are two questions) beside script[2] (the same split with no money in it), then guidedExamples/E2-GE-02',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'division-inverted',
      description: 'Chooses the right move and then runs it the wrong way round: multiplies the pack price by the pack size to reach the price of one, or divides a price for one by the number bought to reach a total. The arithmetic is clean and the size of the answer is impossible, which is exactly what the estimate-first and check-back habits are for.',
      exampleWrongAnswer: 'a pack of six at $4.20 giving a price of $25.20 for a single item',
      distractorRationale: 'Offer the value the inverted operation genuinely produces on the same two numbers, so the two options differ only in which way the division ran.',
      reteachPointer: 'explanation/script[3] (estimate the size first, then rebuild the ticket price), then guidedExamples/E2-GE-01',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-one-quantity-of-the-rate',
      description: 'Settles a rate question on one of the two quantities alone: the machine that finished sooner is called the faster one, or the one that ran longest is, without either output being brought into it. A rate is a pair, and no single member of the pair can answer for it.',
      exampleWrongAnswer: 'a machine that made 36 sheets in 9 minutes called faster than one that made 45 sheets in 5 minutes, because it worked for longer',
      distractorRationale: 'Offer the machine picked out by the clock alone on a draw where the run lengths and the outputs disagree, so time on the job and pace come apart.',
      reteachPointer: 'explanation/script[2] (more altogether only meant it ran for longer), then the Day-2 machine comparison',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'uses-every-number',
      description: 'Treats "use what you are given" as the whole instruction, so a figure that furnishes the scene — how many seats the hall has, how many tanks stand in the yard — is drafted into the working as one more division. The same reflex scales a charge that is made once, because the order grew and everything on the page grew with it.',
      exampleWrongAnswer: 'a print order with the flat setting-up charge multiplied by the number of posters',
      distractorRationale: 'Build the option a solver reaches by spending the spare quantity — an extra division by the seating, or a flat charge grown along with the order it does not depend on.',
      reteachPointer: 'guidedExamples/E2-GE-04 (settle what each price covers before any of it is compared), then explanation/script[3]',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Rates and unit rates — working out what one item, one minute or one kilogram costs or produces, using that for-one figure to compare two offers that cover different amounts, telling the cheapest ticket apart from the best value, and checking every answer by building the for-one figure back up to the total it came from.',
    improvingCandidates: [
      'dividing a pack price down to what a single item costs',
      'comparing two offers on their for-one price rather than on their ticket price',
      'checking a rate by multiplying it back up to the total the problem stated',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'comparing offers on what one costs rather than on what the whole pack costs — the two questions come apart the moment the packs are different sizes',
      },
      {
        errorTag: 'procedure-slip',
        text: 'running the division the right way round, with a rough estimate of the answer\'s size settled before the working starts',
      },
      {
        errorTag: 'representation-misread',
        text: 'reading a rate as the pair it is, instead of settling it on the time alone or the amount alone',
      },
      {
        errorTag: 'task-comprehension',
        text: 'spending only the figures a rate question is built on — a hall\'s seating and a one-off charge are scenery, not steps',
      },
    ],
    homeFocus: {
      praiseLine:
        'You brought both offers down to what one of them costs before you compared anything, and you checked your for-one price by building it back up to the ticket — that is the pair of moves the whole week turns on.',
      questionForChild: 'If a box of six costs the same as five loose ones, is the box worth taking — and what did you work out to decide?',
      schoolSyncHook: 'Some classes say "per kilogram", some write the slash form, and some say "for each kilogram" all year. Send us whichever one your child is hearing and their pages will use it.',
    },
    vocabularyForParent: [
      'rate (a comparison of two quantities of different kinds, such as dollars for each kilogram)',
      'unit rate (the same comparison stated for exactly one — the for-one price)',
      'better buy (the offer with the lower price per item, which is not always the smaller ticket)',
    ],
  },
});
