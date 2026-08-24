/**
 * Level E · Week 17 — "Percent applications" (conceptId: percent-applications).
 *
 * FILL-ARCHITECTURE §6 row E17: anchor "percent-of as scaling"; key multi-step
 * "price → discount → tax (native chains)"; error-analysis "40% off then 20% off
 * = 60% off"; discrimination "percent-of vs percent-off"; Day-5 signature
 * "best-deal tournament". Catalog: "Tax, tip, discount, markup, simple interest;
 * percent change", Day-5 "Store-sale forensics: is '40% off then 20% off' 60%
 * off? Prove".
 *
 * THE WEEK'S CLAIM, and it is a promotion rather than a new idea. E3 met a
 * percent as a COUNT out of a hundred — a share written over a total the
 * quantity itself never has to reach. E17 puts that share to work, and the whole
 * week turns on one sentence: a percent is a MULTIPLIER.
 *
 *  - "25% off" does not mean subtract twenty-five. It means KEEP seventy-five
 *    per hundred, and keeping is one multiplication. The reduction and the price
 *    paid are the two parts of one whole, and the sign names one of them.
 *  - A charge added is the same move run upward. A 5% charge is not an extra
 *    kind of arithmetic; it is keeping a hundred and five per hundred.
 *  - So two changes in a row MULTIPLY, and that is why the recipe's error is an
 *    error. Forty off then twenty off is keep sixty, then keep eighty of THAT —
 *    which keeps forty-eight per hundred, so fifty-two came off, not sixty. The
 *    second cut is smaller than it looks because it acts on a smaller price.
 *  - And a multiplier runs backwards. If a sale price is seven tenths of the
 *    ticket price, one tenth of the ticket is the sale price shared into seven,
 *    and the ticket is ten of those.
 *
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. NEITHER OF THE RECIPE'S TWO NAMED PERCENT CHOICE-ITEMS IS SERVED, AND FOR
 *     THE THIRD WEEK RUNNING THE REASON IS MEASURED RATHER THAN ARGUED. Both were
 *     swept over 5,000 draws before a line of this week was written:
 *
 *       · `percentOfVsPercentOff` — the recipe's OWN discrimination — offers
 *         {paid, cut, the marked price}. The marked price is printed in the
 *         prompt, is the largest of the three on every draw, and is keyed on
 *         0.0% of them: an L38 permanently unkeyable card and a free strike.
 *         What is left is a pair, and the key is the larger of that pair
 *         whenever the percent is under a half — five of its six pool values.
 *         "Strike the biggest, take the larger of the rest" scores 83.9% with
 *         no arithmetic. Measured rank: smallest 16.1% · middle 83.9% ·
 *         largest 0.0%.
 *       · `stackedPercentTrap` — measured rank: smallest 0.0% · middle 49.5% ·
 *         largest 50.5%. Its own header records the middle/largest balance as a
 *         deliberate repair (the direction of the change is drawn), and that
 *         repair is real. What it never closed is the other end: the truth is
 *         NEVER the smallest, so a child may discard one card unread on every
 *         exposure and a three-way page is a coin flip. Worse, and reported
 *         separately below, the rank is not merely unbalanced but READABLE.
 *
 *     `bb-answer-entropy-test` reports neither, because in both the keyed TEXT
 *     moves on every draw and no option sits at a fixed position. Both are
 *     shared files; both are reported upward, not edited. E15 and E16 each found
 *     the same class of defect in their own recipe-named discrimination, so this
 *     is now three for three: ASSUME THE NEXT ONE IS GUESSABLE UNTIL MEASURED.
 *
 *  2. THE DISCRIMINATION IS REBUILT SO THAT IT HAS NO RANK TO EXPLOIT AT ALL.
 *     The first replacement drafted here kept the library's shape — three
 *     amounts, with the rank drawn first and realised, which is what E16 did —
 *     and it did not survive its own arithmetic: with options {pay, part,
 *     price-less-the-percent-in-dollars} the key's rank is a deterministic
 *     function of two visible surfaces (is the percent over a half, is the price
 *     over a hundred), and the second of those is an artefact of the distractor
 *     rather than anything this week teaches.
 *
 *     `discrimWhichSign` inverts the item instead. The child is told the marked
 *     price and the amount actually handed over, and chooses WHICH SIGN was on
 *     the goods. All three signs carry the SAME numeral — "30% off the marked
 *     price", "pay 30% of the marked price", "30 dollars off the marked price" —
 *     so there is no rank among the options, no larger and no smaller, and the
 *     only way through is to run each sign and see which lands on the amount
 *     paid. Which sign is true is drawn independently of the price and percent,
 *     so each is keyed on exactly a third. The card list is enumerated at module
 *     load and every triple where two signs would produce the SAME amount is
 *     dropped, because such an item would have two right answers and no gate
 *     would say so (kit §E2.7).
 *
 *  3. THE ESTIMATE-FIRST PROBE ASKS FOR A DIRECTION, WHICH IS THE ONE THING ON
 *     THE PAGE NO SIZE CAN CARRY. E15 spent three attempts establishing that a
 *     probe about a MAGNITUDE cannot be made unguessable while it stays
 *     estimable — six draw variants bottomed out at 62.3% — and E16 established
 *     the cure: let a DRAWN WORD decide the answer and print the same numerals
 *     in both branches. `sitShelfPrice` draws whether a dealer RAISES or LOWERS
 *     the price it paid, prints the same two numbers in the same two places
 *     either way, and asks: will the shelf price be more than the dealer paid,
 *     or less? No number on the page moves with the answer, and the two branch
 *     words are the same length.
 *
 *     A second probe was drafted and rejected: "after a cut and then a charge,
 *     will the final be above or below the ticket price?" That reads as a shape
 *     question and is not one. The final beats the start exactly when the charge
 *     exceeds the cut divided by what the cut leaves, so "which percent is
 *     bigger" answers it correctly whenever the cut is the bigger of the two —
 *     always — and fails only inside a narrow band. It is a magnitude probe in a
 *     shape costume, which is precisely E15's finding.
 *
 *  4. THE RECIPE'S ERROR-ANALYSIS IS BUILT ON A TRUTH THAT HAS BEEN REGISTERED
 *     AND UNUSED SINCE THE FAMILY WAS WRITTEN. `ratio_verify_stacked_pct_v1`
 *     computes exactly this week's named misconception — two reductions applied
 *     in turn against the two added together — and no week has ever called it,
 *     because `erroranalysis.ts` once resolved verify ids against Level-D's
 *     `LIB_VERIFY_DEFS` alone. That was fixed: `verifyTruth()` consults the
 *     REGISTRY first and falls back. Two comments in `lib/ratio.ts` still state
 *     the old limitation as current (reported below, not edited). So the recipe's
 *     own item ships, with the student's shown figure code-computed by the same
 *     function that computes the truth, and nothing authored.
 *
 *  5. THE SECOND AND THIRD CHAINS ARE THE TWO THINGS `msDiscountThenTax` IS NOT.
 *     The library chain is forward and multiplicative: a cut, then a charge, both
 *     acting on money. `msRecoverTicketPrice` is INVERSE-START — the stated
 *     amount is the RESULT of the change, so the opening move is the undoing, and
 *     it is genuinely two steps rather than one wearing two operators: the amount
 *     paid is a known number of per-hundreds of the ticket price, so the child
 *     shares it into that many to find ONE per cent and then takes a hundred of
 *     them. (The decimal chain evaluator divides only by whole numbers, which is
 *     what rules out a single division by 0.7 and, as it happens, forces the
 *     method that is E3's own anchor run backwards.) `msShareTheService` adds a
 *     percent and then shares the total, so the percent is not the last word.
 *
 *     None of the three is the flat-fee-plus-rate shape. E14 books tickets with a
 *     booking fee, E15 orders against a budget with a delivery charge, and E16
 *     runs a call-out charge through four different businesses; a fourth Level-E
 *     week on a fixed fee would be one idea in five coats. A percentage service
 *     charge is not a fixed fee — it is the week's own multiplier — and that is
 *     the reason it is here.
 *
 *  7. WHAT THE FOUR LOCAL DECISION ITEMS ACTUALLY MEASURE, since decision 1 ends
 *     by saying to assume the next one is guessable until measured, and that
 *     applies to this week's own items as much as to the library's. Read off
 *     SERVED packs, never off the draw (L39):
 *
 *       - the probe, 1,200 served items: above one 51.5% / below one 48.5%.
 *         Every blind habit at chance -- always-above 51.5%, big-percent 48.2%,
 *         big-price 51.7%, longer-body 51.5%, more-numerals 48.5%. The deciding
 *         words are "increased" and "decreased", nine letters each, so even the
 *         length of the branch word carries nothing.
 *       - `discrimWhichSign`, 3,000 served items: 32.2% / 31.8% / 36.1% across
 *         the three signs, against a 33.3% floor. All three options print the
 *         same numeral on 100.0% of items, and the rank of the true sign's
 *         amount among the three amounts the three signs would charge is
 *         32.0 / 34.1 / 33.9 over 1,200. The best single-form guess is 2.8 over
 *         chance, under the corpus's five-point bar -- and it is NOT in the draw,
 *         which is uniform by construction. It appears between the draw and the
 *         page: the percent pool is symmetric about a half, so "35% off" and
 *         "pay 65% of" print the SAME two numbers, the two percent branches
 *         collide with each other in the pack-level uniqueness filter, and the
 *         dollars branch never does. The second serving in a pack is more skewed
 *         than the first (36.7% against 35.5%), which is that filter's signature.
 *
 *         THE OBVIOUS REPAIR IS WORSE THAN THE DEFECT, and it is worth recording
 *         why. Making the pool asymmetric -- every percent under a half -- removes
 *         the collision outright and installs a far larger leak in its place:
 *         with no percent above fifty, everything a "pay X% of" sign charges is
 *         under half the marked price and everything the other two charge is over
 *         it, so "is the amount paid less than half?" names that sign on a third
 *         of draws with no arithmetic at all. The symmetry is load-bearing.
 *       - `bestDealTournament`, 600 served items: 34.3% / 32.0% / 33.7% across
 *         the three forms; "pick the biggest printed numeral" 36.3%, "pick the
 *         smallest" 21.5%.
 *       - `percentClaimASN`, 600 served items: always 32.7%, sometimes 32.5%,
 *         never 34.8%, so "answer sometimes and read nothing" sits at chance.
 *       - the mastery slots, 1,200 forms each: key-in-prompt 0.0% on all six.
 *         Key-is-largest 0.0/0.0/0.0/51.1/0.0/48.8 and key-is-smallest
 *         38.3/0.0/0.0/0.0/0.0/3.4 -- the two slots that move do so because their
 *         direction is drawn, and no slot's answer is knowable from its size.
 *
 *  6. ANSWER-IN-PROMPT AUDIT, argued per generator rather than assumed. The
 *     marked price is never $100 in any local draw, because at $100 the reduction
 *     IS the percent and the answer stands in its own sentence — the defect E3's
 *     author found the expensive way in `eaPercentPointDrop`. Beyond that, every
 *     bound is written beside the draw that carries it: a shelf price is a
 *     multiple of twenty against percents of ten to forty, so no draw makes the
 *     answer equal the percent · a reduced copy is at most four fifths of a
 *     width that starts at forty centimetres · a ticket price recovered from a
 *     sale is at least ninety against a percent of at most eighty · a year of
 *     interest is at most six per cent of at least three hundred · a shared meal
 *     is at least forty-four a head against a party of at most six.
 *
 * Retrieval reaches back to the week this one promotes — E3's share of a count
 * and E3's percent written as a decimal, which IS the multiplier — plus the two
 * decimal moves D20 taught that the multiplier is spent and undone by.
 */

import { asWarmup, decDivideWhole, decMultiply } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStepDec } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { article, countNoun, money, wholeMoney } from '../lib/format';
import { fracToDec } from '../lib/compute';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel } from '../lib/figures';
import { drawUniqueItem } from '../lib/guard';
import { makeChoices } from '../shared';
import {
  msDiscountThenTax,
  percentConversion,
  percentOfCount,
  percentOffPrice,
  percentOfValue,
  percentOffValue,
} from '../lib/ratio';
import type { ItemDraft } from '../shared';
import type { ItemGen } from '../lib/multistep';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D16 = { level: 'D' as const, week: 16 };
const D20 = { level: 'D' as const, week: 20 };
const E2 = { level: 'E' as const, week: 2 };
const E3 = { level: 'E' as const, week: 3 };

/**
 * The corpus cast (`surface.ts::PERSON_NAMES`), drawn rather than hardcoded
 * (kit §F.3) and deliberately this list rather than a private one, so the
 * assembler's one-child-per-page guard can see these items.
 */
const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/**
 * Marked prices, in whole dollars. NEVER 100 — at a hundred the reduction IS the
 * percent, so the answer would stand in the question's own sentence. Every value
 * is a multiple of twenty, which with percents that are multiples of five keeps
 * `base · pct / 100` a whole number of dollars on every draw.
 */
const PRICES = [40, 60, 80, 120, 140, 160, 180, 200] as const;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** E3 — the share of a count. The thing this week promotes into a multiplier. */
const wPercentOf = asWarmup(percentOfCount(), E3);
/**
 * E3 — the percent written as a decimal, which IS this week's multiplier seen a
 * fortnight before it had a job. Nothing about the item changes; what changes is
 * that 0.75 is now the whole of "25% off" rather than a second spelling.
 */
const wPctToDecimal = asWarmup(percentConversion('to-decimal'), E3);
/** D20 — decimal × decimal: the move a percent turns into. */
const wDecMultiply = asWarmup(decMultiply(true), D20);
/** D20 — exact decimal ÷ whole: the move that undoes it. */
const wDecDivide = asWarmup(decDivideWhole(), D20);

// ---------------------------------------------------------------------------
// The two halves of one whole — what comes off, and what is left
// ---------------------------------------------------------------------------

/** Photographic kit, priced in the range a club discount would be quoted on. */
const CAMERA_KIT = ['tripod', 'camera bag', 'lens hood', 'light meter', 'flash gun'] as const;

/**
 * PERCENT-OF: the SIZE of the reduction, asked in its own right. MONEY-CHANGE.
 *
 * Day 1 carries this beside `percentOffPrice`, which asks for the other half of
 * the same whole, and that pairing is the concept echo: one sign, two questions,
 * two different numbers, and the sign alone does not say which one is wanted.
 *
 * No leak by construction: the reduction is at most three quarters of a price
 * that is at least forty, so it clears the percent on every draw except at a
 * marked price of a hundred, which `PRICES` does not contain.
 */
const sitAmountSaved = situation({
  situationType: 'money-change',
  cognitiveOp: 'percent-of',
  draw: (r) => {
    const base = r.pick(PRICES);
    // Capped at a half. The pool ran to 75% and served "Camera-club members are
    // given 75% off", which is not a club discount, it is a closing-down sale.
    // Nothing is protected by the high values here: the item is free-entry, so it
    // has no rank to rotate and no option to keep reachable.
    const pct = r.pick([10, 15, 20, 25, 30, 40, 50]);
    const kit = r.pick(CAMERA_KIT);
    return {
      prompt: `A ${kit} is priced at ${wholeMoney(base)}. Camera-club members are given ${pct}% off. How many dollars does that take off the price?`,
      answerValue: percentOfValue(String(base), pct),
      templateId: 'ratio_pct_of_v1',
      params: { base: String(base), pct },
      units: 'dollars',
      hints: [
        'Is this question asking what a member hands over, or what the club card takes off?',
        'Find the per-hundred share the sign names, and take that share of the marked price.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// The direction commitment, made before any arithmetic (the metacog carrier)
// ---------------------------------------------------------------------------

/** Second-hand goods a dealer buys in and prices up or down before selling. */
const DEALER_GOODS = ['writing desk', 'wicker chair', 'brass lantern', 'tin trunk', 'oak stool'] as const;

/**
 * A dealer who either RAISES or LOWERS what it paid, drawn. MONEY-CHANGE, and
 * the week's metacognition carrier — served ONLY through the wrapper below
 * (kit §E2.2), so its ladder is spent once.
 *
 * THE PROBE HAS NO MAGNITUDE IN IT (decision 3). Both branches print the same two
 * numerals in the same two places and differ in one six-letter word, so nothing
 * about any size on the page moves with the answer; "always say more" and "a big
 * percent means more" both sit at a coin flip. Whether the shelf price beats what
 * the dealer paid is settled by a word, and settling it is the commitment the
 * scaffold exists to demand.
 *
 * It is also the right probe for THIS cell rather than a probe that would fit
 * anywhere: the week's claim is that a percent scales, and the first thing a
 * scaling does — before any size question — is choose a direction.
 *
 * No leak by construction: prices are multiples of twenty from forty upward and
 * percents run ten to forty, so a raised price exceeds every printed number and a
 * lowered one is at least three fifths of forty, which clears the percent.
 */
const sitShelfPrice = situation({
  situationType: 'money-change',
  cognitiveOp: 'percent-change',
  draw: (r) => {
    const base = r.pick(PRICES);
    const pct = r.pick([10, 15, 20, 25, 30, 40]);
    const good = r.pick(DEALER_GOODS);
    const up = r.int(0, 1) === 1;
    return {
      // "raised" and "lowered" are the same length, and every other word and
      // numeral is identical across the two branches. E16 found its own probe
      // 100% guessable by COUNTING the numbers each branch printed; here the two
      // branches are one sentence differing in one word, so there is nothing to
      // count and nothing to compare.
      prompt: `A second-hand dealer paid ${wholeMoney(base)} for ${article(good)}. Before it goes on the shelf that price is ${up ? 'increased' : 'decreased'} by ${pct}%. What price does the ${good} carry on the shelf?`,
      // BOTH BRANCHES ARE percent-OF, and that is the week's claim stated in
      // params rather than only in prose. A price lowered by 30% is a price
      // scaled by the 70 per hundred that stays, and a price raised by 30% is
      // the same move with 130 — one template, one multiplier, the direction
      // living in the number. Two templateIds would also have split the mastery
      // slot: QG-4 pairs Form A with Form B by template, and a generator that
      // draws its own template cannot be paired at all.
      answerValue: percentOfValue(String(base), up ? 100 + pct : 100 - pct),
      templateId: 'ratio_pct_of_v1',
      params: { base: String(base), pct: up ? 100 + pct : 100 - pct },
      units: 'dollars',
      hints: [
        'Which price is this change being measured against — the one the dealer paid, or the one on the shelf?',
        'Settle how many per hundred of the price paid the shelf price comes to, then take that many hundredths of it.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * THE PROBE ASKS FOR THE MULTIPLIER, NOT THE DIRECTION, and that is a second
 * draft. "Will the shelf price be more than the dealer paid, or less?" carried
 * the same drawn bit and was answerable with no percent knowledge at all — a
 * child reads one English verb and is done. Asking which side of one the
 * multiplier falls carries exactly the same bit, so it is exactly as unguessable,
 * but it cannot be answered without translating a direction into this week's
 * anchor. Unguessable is necessary and it is not sufficient.
 */
const sitShelfPriceEstimate = withEstimateFirst(
  sitShelfPrice,
  'will the number you multiply by be above one, or below one?',
);

// ---------------------------------------------------------------------------
// A percent that is not about money at all
// ---------------------------------------------------------------------------

/**
 * MEASUREMENT. The same multiplier on a length, which is the whole argument for
 * calling a percent a scaling rather than a shopping rule: nothing here is
 * bought, and the arithmetic does not change. A copier is also the one machine a
 * child has met that IS a scaling, set in per-hundreds on its own front panel.
 *
 * NOT A KILN, which is what this item was first written as. `e02` already serves
 * "A kiln … identical trays" as a drawn scene, and `e11` carries a comment
 * recording that it avoided a kiln for exactly that reason — so a third Level-E
 * week firing something would have been the L24 repeated-frame defect with a
 * note in the corpus already warning about it. Found by the collision scan, which
 * is why that scan runs at the end (kit §E2.8).
 *
 * No leak by construction: a copy is at least four fifths of an original that
 * starts at forty centimetres, so it is at least thirty-two against a percent of
 * at most twenty; and the original is never a hundred, where taking the percent
 * off as CENTIMETRES would land on the right answer.
 */
const sitCopierReduce = situation({
  situationType: 'measurement',
  cognitiveOp: 'percent-off',
  draw: (r) => {
    // Eight widths for the same reason SIGN_GOODS has seven: with six, Days 1 and
    // 3 served the same 120-centimetre banner. Never 100 (see above).
    const len = r.pick([40, 60, 80, 120, 140, 160, 180, 200]);
    const pct = r.pick([5, 10, 15, 20]);
    return {
      prompt: `A banner is ${countNoun(len, 'centimetres')} wide. A large-format copier is set to reduce every length by ${pct}%. How many centimetres wide is the copy?`,
      answerValue: percentOffValue(String(len), pct),
      templateId: 'ratio_pct_off_v1',
      params: { base: String(len), pct },
      units: 'centimetres',
      hints: [
        'Is the percent on the copier naming the length that is lost, or the length that comes through?',
        'Settle how much of the width the setting takes off, then take that much off the width it started with.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// A percent that is paid rather than charged
// ---------------------------------------------------------------------------

/**
 * MONEY-CHANGE. Simple interest for a single year, which the catalog names and
 * which is percent-of wearing its most grown-up hat: the account pays a share of
 * what is in it, and the share is the whole of what the rate means.
 *
 * No leak by construction: the balance is at least three hundred and the rate at
 * most six per cent, so a year's interest is at least three times the rate and
 * can never equal it.
 */
const sitInterestYear = situation({
  situationType: 'money-change',
  cognitiveOp: 'percent-of',
  draw: (r) => {
    const balance = 100 * r.int(3, 18);
    const rate = r.pick([2, 3, 4, 5, 6]);
    const name = one(r);
    return {
      prompt: `${name} puts ${wholeMoney(balance)} into a savings account that pays ${rate}% a year. How much interest does the account pay after one year?`,
      answerValue: percentOfValue(String(balance), rate),
      templateId: 'ratio_pct_of_v1',
      params: { base: String(balance), pct: rate },
      units: 'dollars',
      hints: [
        'Does a rate of this size describe the whole of what is in the account, or a small part of it?',
        'Rewrite the rate as its per-hundred share, then take that share of the amount paid in.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — which sign was on the goods (decision 2)
// ---------------------------------------------------------------------------

// Seven, not five, and the reason is a served pack: with five, the Day-2 and
// Day-3 servings printed the same globe at two different prices about one pack in
// five — the repeated-object defect E16 found by reading two consecutive days.
const SIGN_GOODS = ['globe', 'wall mirror', 'floor lamp', 'chess set', 'record player', 'bird cage', 'picnic hamper'] as const;
const SIGN_PCTS = [20, 25, 30, 40, 60, 70, 75, 80] as const;

/**
 * Every (price, percent) pair on which the three signs name three DIFFERENT
 * amounts, enumerated once at module load rather than drawn and repaired.
 *
 * Two triples have to be excluded and both would be invisible to every gate:
 *  - a pair where two signs land on the same amount gives the item TWO right
 *    answers, and nothing in the battery checks that the distractors are false
 *    (kit §E2.7 — a computable answer is not the same as an askable question);
 *  - a pair where the dollars sign takes the price below twenty leaves a card
 *    that is not a price anybody would print.
 *
 * The list is the SAME for all three signs, and which sign is true is drawn
 * separately, so the truth is independent of the price and the percent by
 * construction and each sign is keyed on exactly a third.
 */
const SIGN_CARDS: Array<{ base: number; pct: number }> = [];
for (const base of PRICES) {
  for (const pct of SIGN_PCTS) {
    const off = (base * (100 - pct)) / 100;
    const share = (base * pct) / 100;
    const flat = base - pct;
    if (flat < 20) continue;
    if (off === share || off === flat || share === flat) continue;
    SIGN_CARDS.push({ base, pct });
  }
}
if (SIGN_CARDS.length < 24) {
  throw new Error(`E17 discrimSignWording: only ${SIGN_CARDS.length} legal price/percent cards`);
}

type SignKind = 'off' | 'share' | 'flat';
const SIGN_KINDS: readonly SignKind[] = ['off', 'share', 'flat'];

const signText = (kind: SignKind, pct: number): string =>
  kind === 'off'
    ? `${pct}% off the marked price`
    : kind === 'share'
      ? `pay ${pct}% of the marked price`
      : `${countNoun(pct, 'dollars')} off the marked price`;

const signValue = (kind: SignKind, base: number, pct: number): string =>
  kind === 'off'
    ? percentOffValue(String(base), pct)
    : kind === 'share'
      ? percentOfValue(String(base), pct)
      : String(base - pct);

/** Why a child lands on a sign that is not the one that was there. */
const SIGN_WRONG: Record<SignKind, { tag: ErrorTag; rationale: string }> = {
  off: {
    tag: 'task-comprehension',
    rationale:
      'Reads the percent as the part taken away when the amount handed over says it was not, so the reduction and the payment are swapped over and the sign that names one is credited with the other.',
  },
  share: {
    tag: 'concept-misconception',
    rationale:
      'Reads a sign naming the share still to be PAID as though it named the share taken off, which is the single commonest percent misreading there is: the same numeral describes two different amounts and only the word between it and the price says which.',
  },
  flat: {
    tag: 'representation-misread',
    rationale:
      'Takes the number on the sign for a number of dollars rather than a count out of a hundred, so the same figure is subtracted straight from the price whatever the price happens to be.',
  },
};

/**
 * The recipe's discrimination, inverted so that it has no rank (decision 2).
 *
 * ALL THREE OPTIONS CARRY THE SAME NUMERAL. There is no largest option and no
 * smallest, no bracketing pair and no middle to pick, so the entire family of
 * defects kit §E2.11 names cannot be expressed here — and neither can the one
 * that killed the library's version. What is left is the mathematics: run each
 * sign against the marked price and keep the one that lands on the amount paid.
 */
const discrimWhichSign = discrimination({
  variant: 'structural',
  cognitiveOp: 'percent-sign-identify',
  draw: (r) => {
    const truth = r.pick(SIGN_KINDS);
    const { base, pct } = r.pick(SIGN_CARDS);
    const good = r.pick(SIGN_GOODS);
    const name = one(r);
    return {
      prompt: `A ${good} was marked at ${wholeMoney(base)}, with one sign on it. ${name} handed over ${wholeMoney(Number(signValue(truth, base, pct)))} for it. Which sign was on the ${good}?`,
      correct: signText(truth, pct),
      distractors: SIGN_KINDS.filter((k) => k !== truth).map((k) => ({
        text: signText(k, pct),
        errorTag: SIGN_WRONG[k].tag,
        rationale: SIGN_WRONG[k].rationale,
      })),
      hints: [
        'Do these three signs name the same amount as each other, or three different ones?',
        'Take the marked price and run each sign over it in turn, then keep the sign that lands on the amount handed over.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Chains — forward, backwards, and one where the percent is not the last word
// ---------------------------------------------------------------------------

/** Kitchen goods, priced where a closing-down sale would put them. */
const KITCHEN_GOODS = ['stand mixer', 'copper pan set', 'knife block', 'coffee machine', 'slow cooker'] as const;

/**
 * INVERSE-START. The amount paid is stated and the TICKET price is wanted, so the
 * opening move is the undoing of a change that has already happened.
 *
 * It is two steps and not one wearing two operators (decision 5), and the two
 * steps are E3's own anchor run backwards: the amount paid is a known number of
 * per-hundreds of the ticket, so share it into that many to find ONE per cent,
 * then take a hundred of them. That decomposition is exact for every percent in
 * the pool, because `paid ÷ (100 ∓ pct)` is always the ticket price divided by a
 * hundred — and it is what the decimal chain evaluator can express, since it
 * divides by whole numbers only. A single division by 0.7 is not available, and
 * the method it rules out is the worse one anyway.
 *
 * WHETHER THE CHANGE WAS A CUT OR A CHARGE IS DRAWN, and that is a repair rather
 * than a flourish. Recovering only from a sale made the answer larger than every
 * number the prompt printed on 100.0% of served forms — measured on this slot,
 * not reasoned about — so the direction of the answer was settled before a child
 * read anything. With the change drawn, the ticket price sits above the amount
 * paid on about half of draws and below it on the rest, and it is also the truer
 * lesson: an inverse undoes a scaling whichever way the scaling went.
 *
 * A TICKET PRICE OF EXACTLY $100 IS EXCLUDED, and reading the served week is what
 * found it. At a hundred the amount paid is literally "a hundred minus the
 * percent", so the percent-as-dollars misconception — the one the week's own
 * discrimination exists to break — RECOVERS THE RIGHT ANSWER: pay $75 after 25%
 * off, add the 25 back as dollars, and $100 is correct. A certifying slot that
 * rewards the misconception it teaches against is the E3 author's $100 trap in a
 * new disguise, and no gate reports it.
 *
 * No leak by construction: a ticket price is at least a hundred and twenty while
 * the percent is at most forty, and no draw makes the amount paid equal the
 * percent (that would need a ticket of 25, 33.3 or 66.7, and tickets are
 * multiples of twenty).
 */
const msRecoverTicketPrice = multiStepDec({
  situationType: 'money-change',
  cognitiveOp: 'percent-recover',
  posing: 'inverse-start',
  draw: (r) => {
    // The two directions draw from different pools, because a sale of 40% is
    // ordinary and a counter charge of 40% is not — a served draw said "a counter
    // had added 40% to the ticket price" and no gate minds an implausible price.
    // Nothing leaks: which direction it was is printed in the sentence, so a
    // child has nothing to infer from the size of the percent.
    const cut = r.int(0, 1) === 1;
    const pct = cut ? r.pick([10, 15, 20, 25, 30, 40]) : r.pick([10, 15, 20, 25]);
    const perHundred = cut ? 100 - pct : 100 + pct;
    const ticket = 20 * r.int(6, 12);
    const paid = (ticket * perHundred) / 100;
    const good = r.pick(KITCHEN_GOODS);
    const name = one(r);
    return {
      prompt: `${name} paid ${wholeMoney(paid)} for ${article(good)}, after a ${cut ? 'sale had taken' : 'counter had added'} ${pct}% ${cut ? 'off' : 'to'} the ticket price. What did the ticket price say?`,
      init: String(paid),
      steps: [
        { op: 'div', v: String(perHundred) },
        { op: 'mul', v: '100' },
      ],
      units: 'dollars',
      hints: [
        'Is the amount handed over more of the ticket price than the ticket price itself, or less of it?',
        'Work out how many per-hundreds of the ticket price were actually paid, find what a single one of them is worth, and take a hundred of those.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * SHARING, and the chain where the percent is not the last word: a service charge
 * joins the bill and the total is then split, so a child who applies the percent
 * to a single share instead of the whole gets a different and wrong answer.
 *
 * A percentage charge, deliberately, and not a fixed one (decision 5).
 *
 * No leak by construction: the share before service is a multiple of twenty, so
 * each person pays at least forty-four — clear of the party size, clear of the
 * percent, and short of the bill.
 */
const msShareTheService = multiStepDec({
  situationType: 'sharing',
  cognitiveOp: 'percent-then-share',
  draw: (r) => {
    const party = r.pick([4, 5, 6]);
    const pct = r.pick([10, 15, 20, 25]);
    const each = 20 * r.int(2, 4);
    const bill = each * party;
    return {
      prompt: `A meal for ${countNoun(party, 'friends')} comes to ${wholeMoney(bill)} before a service charge of ${pct}% is added on. They agree to pay equal shares of the total. What does each one pay?`,
      init: String(bill),
      steps: [
        { op: 'mul', v: fracToDec(100 + pct, 100) },
        { op: 'div', v: String(party) },
      ],
      units: 'dollars',
      hints: [
        'Is the service charge worked out on what the whole table owes, or on what one person owes?',
        'Settle the total the table is asked for once the charge has joined it, and only then share that total out.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/** Luggage, for the sale that cuts twice. */
const LUGGAGE = ['cabin case', 'holdall', 'duffel bag', 'shoulder bag', 'hat box'] as const;

/**
 * Three of this week's noun pools open their sentence, where an article helper
 * cannot reach and the word must simply take "a". `article()` covers the two
 * pools that sit mid-sentence — which is what lets the dealer keep an oak stool —
 * but a vowel added to any of these three would print "a oak stool" and fail
 * QG-12c at some seed and not others. Caught at module load instead.
 */
for (const pool of [CAMERA_KIT, SIGN_GOODS, LUGGAGE]) {
  for (const noun of pool) {
    if (/^[aeiou]/i.test(noun)) {
      throw new Error(`E17: "${noun}" opens a sentence as "a ${noun}" — QG-12c wants "an"`);
    }
  }
}

/**
 * THE RECIPE'S OWN ERROR-ANALYSIS, on a truth registered and never called
 * (decision 4). `ratio_verify_stacked_pct_v1` returns the price two reductions
 * really leave as `correct` and the price of adding the two percents first as
 * `wrong`, both computed by the same function, so the figure the student is shown
 * is a real misconception's real output and the true answer is code-derived.
 *
 * The prompt names the TASK the student was doing and shows what they wrote. It
 * does not name the move, because the diagnosis is the child's answer and cannot
 * also be the question (`erroranalysis.ts` refuses a prompt that hands it over).
 */
const eaStackedPercent = errorAnalysis({
  verifyTemplateId: 'ratio_verify_stacked_pct_v1',
  cognitiveOp: 'percent-stacked',
  // Whole tens on BOTH reductions, so the single percent the extension asks for
  // is a whole number. The first draft drew 25s as well and produced pairs whose
  // honest answer is 32.5% off — mathematically fine, and a harder question than
  // the item was set to ask, on a page whose whole point is the comparison with
  // the two percents added. The recipe's own case, 40 then 20, stays in the pool.
  drawParams: (r) => ({
    base: String(r.pick([80, 120, 140, 160, 180, 200])),
    p1: r.pick([20, 30, 40]),
    p2: r.pick([10, 20, 30]),
  }),
  build: (v, p, r) => {
    const bag = r.pick(LUGGAGE);
    return {
      prompt: `A ${bag} priced at ${wholeMoney(Number(p.base))} was reduced by ${p.p1}% in a sale, and a fortnight later that new price was reduced by a further ${p.p2}%. A student worked out the price after both reductions and wrote ${wholeMoney(Number(v.wrong))}.`,
      // The extension does NOT ask for the single percent that matches the pair.
      // The Puzzle Grove asks exactly that, on this same day, and one idea in two
      // coats on one page is what reading a served week is for. What is left here
      // is the forensic question the recipe actually names.
      extension:
        'Write the price the two reductions really leave, then name which price the second reduction was measured against and say why that makes it worth less than its percent sounds.',
      hints: [
        'Which price is the second reduction measured against — the one on the first ticket, or the one the first reduction left?',
        'Settle the price after the first reduction, let the second one work on that amount, and hold the result against the figure on the page.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: [money(v.correct)],
    };
  },
});

/**
 * THE BEST-DEAL TOURNAMENT (the recipe's Day-5 signature). Three shops, one
 * telescope, three offers written in three different currencies of argument — a
 * percent off, a number of dollars off, and a percent still to pay — so no two
 * can be compared without turning them into the same kind of number first.
 *
 * WHAT IS DRAWN IS THE SHARE EACH SHOP LEAVES TO PAY, and then which FORM each
 * shop states it in — two independent shuffles, so the winning share and the
 * wording that carries it are unrelated and every form is keyed on a third.
 * That is what stops "the biggest number wins": the three figures live on three
 * different scales (a percent off runs 15 to 40, a share still to pay 60 to 85,
 * a dollars-off amount 18 to 96, so either of the last two can be the largest
 * figure on the page), and none of the scales predicts the winner.
 *
 * The marked price is never $100. At a hundred a dollars-off sign and a percent
 * sign say the same thing, and the comparison the item exists to demand — turn
 * them into the same kind of number first — is done before the child starts.
 */
const bestDealTournament = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'percent-compare-offers',
  draw: (r) => {
    const base = 20 * r.int(6, 12);
    // Three DISTINCT shares still to pay. The smallest is the best deal, and
    // which form states it is decided separately, below.
    const pays = r.shuffle([60, 65, 70, 75, 80, 85]).slice(0, 3);
    const forms = r.shuffle([...SIGN_KINDS]) as SignKind[];
    const offer = (kind: SignKind, pay: number): string =>
      kind === 'off'
        ? `${100 - pay}% off the marked price`
        : kind === 'share'
          ? `pay ${pay}% of the marked price`
          : `${countNoun((base * (100 - pay)) / 100, 'dollars')} off the marked price`;
    const best = pays.indexOf(Math.min(...pays));
    return {
      prompt: `The same telescope is marked at ${wholeMoney(base)} in three shops, and each shop states its offer a different way. Which offer leaves the least to pay?`,
      correct: offer(forms[best], pays[best]),
      distractors: pays
        .map((pay, i) => ({ pay, i }))
        .filter(({ i }) => i !== best)
        .map(({ pay, i }) => ({
          text: offer(forms[i], pay),
          errorTag: SIGN_WRONG[forms[i]].tag,
          rationale: SIGN_WRONG[forms[i]].rationale,
        })),
      hints: [
        'Are these three offers written in the same kind of number as each other?',
        'Turn every offer into the amount actually handed over at that shop, and only then set the three side by side.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The Always/Sometimes/Never item, WITH ITS CLAIM DRAWN — one claim per verdict,
 * so "answer sometimes and read nothing" falls from everything to a third and no
 * card is unreachable. `items.classify` takes its three cards as config, which
 * means a week that authors a single claim ships a slot whose key never moves;
 * E3 measured exactly that (400 of 400 packs keyed the same verdict) and this is
 * the shape its repair established.
 *
 * The three claims are the three things a learner most needs to be able to defend
 * in this cell: that a cut and a rise of the same percent do not cancel (always),
 * that two cuts do not add (never), and that a sale can take off more than it
 * leaves (sometimes — exactly when the percent passes a half).
 */
const ASN_CLAIMS = [
  {
    claim:
      'a price cut by a percent and then raised again by that same percent ends up below where it started',
    verdict: 'always',
    wrong: {
      sometimes: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'Treats the shortfall as something that happens to turn up on some numbers, when the rise is always measured against the smaller price the cut left, so it is always worth less than the cut was.',
      },
      never: {
        tag: 'procedure-slip' as ErrorTag,
        rationale:
          'Reads the two changes as cancelling because the two percents match, which is the reading this week exists to break: matching percents of different amounts are different amounts.',
      },
    },
  },
  {
    claim:
      'two reductions one after the other take off as much as the two percents added together would',
    verdict: 'never',
    wrong: {
      always: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'The week\'s named misconception stated as a rule: it adds the percents as though both were measured against the first price, when the second is measured against what the first reduction left.',
      },
      sometimes: {
        tag: 'representation-misread' as ErrorTag,
        rationale:
          'Allows the two readings to agree on some pair of percents, when the gap between them is the product of the two shares and so is never nothing while both reductions are real.',
      },
    },
  },
  {
    claim: 'the amount a sale takes off is larger than the amount left to pay',
    verdict: 'sometimes',
    wrong: {
      always: {
        tag: 'task-comprehension' as ErrorTag,
        rationale:
          'Reads every sale as taking off the greater part, which holds only once the percent has passed a half and fails on the ordinary sale a shopper meets.',
      },
      never: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'Rules out a reduction bigger than the remainder altogether, as though a percent could not name more than half of what it is taken from.',
      },
    },
  },
] as const;

const VERDICTS = ['always', 'sometimes', 'never'] as const;

const percentClaimASN: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const c = r.pick(ASN_CLAIMS);
    const distractors = VERDICTS.filter((v) => v !== c.verdict).map((v) => ({
      text: v,
      errorTag: (c.wrong as Record<string, { tag: ErrorTag; rationale: string }>)[v].tag,
      rationale: (c.wrong as Record<string, { tag: ErrorTag; rationale: string }>)[v].rationale,
    }));
    const { choices, correctKey } = makeChoices(r, c.verdict, distractors);
    const item: ItemDraft = {
      type: 'classification',
      prompt: `Always, sometimes, or never true: ${c.claim}. Write one sentence naming the case that settles it.`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      hintLadder: [
        'What would a claim about every sale have to survive before it has earned the word always?',
        'Try the claim on a small percent first and then on a large one, and let the pair of results choose the verdict.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
    };
    return item;
  });

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE17 = makeWeekBuilder({
  level: 'E',
  week: 17,
  conceptId: 'percent-applications',
  conceptName: 'Percent applications',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [D20, E2, E3],
  pedagogyContract: 'v2',
  conceptualAnchor: 'scaling by the part that is kept',
  conceptFamily: 'operation',
  deepeningDelta:
    'E3 met a percent as a count out of a hundred and gave one share three names — a percent, a decimal and a fraction — which made a share readable but left it inert: something a quantity HAS. E17 gives it a job. A percent here is an operator that acts on an amount, and the decimal E3 wrote as a second spelling turns out to be the whole of the operation: 25% off is one multiplication by 0.75, not a subtraction that needs the reduction found first. Three things follow that E3 had no reason to need. A charge added is the same move upward, so tax, tip and markup stop being separate rules. Two changes in a row multiply rather than add, which is why 40% off then 20% off is not 60% off — and that is the week\'s named error, falling straight out of the anchor rather than being learnt beside it. And because a multiplier can be undone, a ticket price can be recovered from a sale price, which E3 could not have asked.',
  explanation: {
    hook:
      'Nearly every sign in a shop window is doing arithmetic to a price, and the sign never says which arithmetic. Some signs name what comes off. Some name what is left. One number, two meanings, and the difference is what you actually hand over.',
    whyBeforeHow:
      'A percent takes an amount and makes it bigger or smaller by a fixed share, and because a share is a count out of a hundred, that is one multiplication rather than a rule to remember. Take 25% off and three quarters of the price stays, so the price paid is the price times 0.75 — the reduction never has to be found at all. That is what this week means by scaling by the part that is kept, and it is worth the change of habit because it makes every other percent question the same question. A 5% charge added? Scale to a hundred and five per hundred — above a hundred the part kept is all of it and a share more — so multiply by 1.05. A markup of 40%? Multiply by 1.4. There is no separate arithmetic for tax, for a tip, for a discount, for a sale: there is one multiplier, and the words on the sign tell you which one. Once a percent is a multiplier, the mistake this week exists to catch stops being surprising and starts being obvious. Forty per cent off and then twenty per cent off is not sixty per cent off. Keep sixty per hundred, then keep eighty per hundred of THAT, and forty-eight per hundred survives — so fifty-two came off, not sixty. The second reduction is worth less than it sounds because it is measured against a smaller price than the first one was. Percents in a row multiply, whenever each one acts on the amount the one before it left — which is what a second sign in a shop window always does.',
    script: [
      {
        say: 'Here is a price of eighty dollars and a sign that says thirty per cent off. I am going to draw both of the numbers that sign is talking about, because there are two and only one of them is what you pay. Thirty per hundred of eighty is twenty-four, and that is the part that goes. Seventy per hundred is fifty-six, and that is the part that stays. The sign printed one number. The till wants the other.',
        visual: 'The marked price split into the part the sign takes and the part still to pay.',
        figure: barModel(
          [
            { label: 'the marked price', segments: [{ value: 80, label: '80' }], total: '80' },
            {
              label: 'what the sign takes, and what is left',
              segments: [
                { value: 24, label: '24', fill: 'hatch' },
                { value: 56, label: '56' },
              ],
              total: '80',
            },
          ],
          { scaleMax: 80, alt: 'a bar of 80, and beneath it the same length split into a hatched 24 and a plain 56' },
        ),
      },
      {
        say: 'Now watch me stop doing it in two moves. I never actually wanted the twenty-four. I wanted the fifty-six, and the fifty-six is seventy per hundred of the price — so I can go straight there: eighty times nought point seven is fifty-six. One multiplication, no subtraction, nothing to hold in my head. And the same trick works upward. A five per cent charge added leaves a hundred and five per hundred, so I multiply by one point nought five. Every percent question in this week is one multiplication once you have decided which multiplier the words are asking for.',
        visual: 'The same answer reached in one move instead of two.',
        figure: barModel(
          [
            { label: 'find the part off, then take it away', segments: [{ value: 24, label: '24', fill: 'hatch' }, { value: 56, label: '56' }] },
            { label: 'keep seventy per hundred, in one move', segments: [{ value: 56, label: '56' }] },
          ],
          { scaleMax: 80, alt: 'a bar split into a hatched 24 and a plain 56, above a single plain bar of 56 drawn to the same scale' },
        ),
      },
      {
        say: 'Here is where that pays for itself. A hundred-dollar coat, forty per cent off, and then twenty per cent off the new price. Someone will always tell you that is sixty per cent off. Let us check. Forty off leaves sixty. Twenty off SIXTY is twelve, not twenty, because the second sign is measuring against sixty and not against a hundred — so we land on forty-eight. Sixty per cent off would have landed on forty. Those are not the same coat. The second reduction was worth less than it sounded, and it always is.',
        visual: 'Two reductions in turn, against the two percents added together.',
        figure: barModel(
          [
            { label: 'the ticket price', segments: [{ value: 100, label: '100' }], total: '100' },
            { label: 'after forty off', segments: [{ value: 60, label: '60' }], total: '60' },
            { label: 'then twenty off that', segments: [{ value: 48, label: '48' }], total: '48' },
            { label: 'what sixty off would have left', segments: [{ value: 40, label: '40', fill: 'hatch' }], total: '40' },
          ],
          { scaleMax: 100, alt: 'four bars to one scale reading 100, 60, 48 and a hatched 40' },
        ),
      },
      {
        say: 'Two habits, and the first one costs nothing. Before I touch a single number I decide which WAY the price is going — is this sign leaving me with more than I started with, or less? The words settle that, and no arithmetic ever will. Then at the end I check the size against the direction I committed to. If I decided the price should fall and my answer is bigger than the price I started with, I have multiplied by the wrong one of the two shares, and I have caught it without redoing the sum.',
        visual: 'The direction decided first, and the answer held against it afterwards.',
        figure: barModel(
          [
            { label: 'a price that is going down', segments: [{ value: 56, label: '56' }] },
            { label: 'the price it started from', segments: [{ value: 80, label: '80' }] },
          ],
          { scaleMax: 80, alt: 'a bar of 56 above a longer bar of 80, drawn to one scale' },
        ),
      },
    ],
    summary:
      'A percent is a multiplier. Taking 25% off means keeping 75 per hundred, so the price paid is the price times 0.75 in a single move, and adding a 5% charge means keeping 105 per hundred, so it is the price times 1.05. Discount, tax, tip, markup and interest are one piece of arithmetic wearing five names; the words on the sign only decide which multiplier you want. Because they are multipliers, two percents in a row MULTIPLY rather than add: 40% off then 20% off keeps 60 per hundred and then 80 per hundred of that, which keeps 48 — so 52% came off, not 60%. And because a multiplier can be undone, a ticket price can be recovered from a sale price by asking what share of it the sale price is. One warning comes with all of this: when the amount being scaled is itself a percent, say the counting is between them. A rate going from 4% to 6% has risen two percentage POINTS, and it has also risen by half — two true statements about one change, and only naming which you mean keeps them apart.',
    vocabulary: [
      { term: 'discount', kidGloss: 'the amount a sale takes off a price — not the amount you then pay' },
      { term: 'markup', kidGloss: 'the amount added to what something cost, to set the price it sells for' },
      { term: 'multiplier', kidGloss: 'the single number a percent turns into: 0.75 for 25% off, 1.05 for a 5% charge' },
      { term: 'percent change', kidGloss: 'a rise or a fall measured as a share of what you started with' },
      { term: 'interest', kidGloss: 'what an account pays for holding your money — a percent of the amount in it' },
      { term: 'percentage point', kidGloss: 'the gap between two percents: 4% rising to 6% is two percentage points, and a rise of half' },
    ],
  },
  guidedExamples: [
    {
      ...ge(17, 1, 'modeled', 'A coat is marked at $60 and the sign says 35% off. Find the amount taken off, and the amount handed over at the till.', [
        {
          teacherSay:
            'I read which way this is going before I touch the numbers. A sale takes something away, so whatever I end up handing over has to be smaller than sixty. That decision costs me nothing and it will catch a wrong multiplier later.',
        },
        {
          teacherSay:
            'The sign names the part that goes, so that part is thirty-five per hundred of sixty. What does that come to?',
          expected: '21',
        },
        {
          childDo: 'Now get the amount handed over without subtracting anything: work out what share of the price stays, and take that share of sixty.',
          expected: '39',
        },
      ], '39'),
      visual: 'Sixty split into the part the sign takes and the part still to pay.',
      figure: barModel(
        [
          { label: 'the marked price', segments: [{ value: 60, label: '60' }], total: '60' },
          {
            label: 'taken off, and left to pay',
            segments: [
              { value: 21, label: '21', fill: 'hatch' },
              { value: 39, label: '39' },
            ],
            total: '60',
          },
        ],
        { scaleMax: 60, alt: 'a bar of 60, and beneath it the same length split into a hatched 21 and a plain 39' },
      ),
    },
    {
      ...ge(17, 2, 'completion', 'A lamp costs a shop $50. It is marked up by 60%, and a 10% charge is added at the till. What does a customer pay?', [
        {
          teacherSay: 'Two changes, one after the other, and both of them go the same way. Which price is the ten per cent charge measured against — the fifty, or the marked-up price?',
          expected: 'the marked-up price',
        },
        {
          childDo: 'Work out the marked-up price first, then let the charge act on that amount, and say what a customer pays.',
          expected: '88',
        },
      ], '88'),
      visual: 'The cost, the marked-up price, and the amount at the till, to one scale.',
      figure: barModel(
        [
          { label: 'what the shop paid', segments: [{ value: 50, label: '50' }], total: '50' },
          { label: 'after the markup', segments: [{ value: 80, label: '80' }], total: '80' },
          { label: 'after the charge', segments: [{ value: 88, label: '88' }], total: '88' },
        ],
        { scaleMax: 88, alt: 'three bars to one scale reading 50, 80 and 88' },
      ),
    },
    ge(17, 3, 'prompted', 'A tent is marked at $200. One sign reads "20% off the marked price" and another reads "pay 20% of the marked price". Give the amount handed over under each sign, and say in one sentence which word does the work.', [
      {
        childDo: 'Take twenty per hundred of two hundred once, then decide for each sign whether that amount is the part that goes or the part that stays.',
        expected: '160 and 40',
      },
    ], '160 and 40'),
    {
      // Independent stage: the ticket price is the thing being asked for, so no
      // bar for it is drawn — a bar of the whole would hand over the answer the
      // item exists to ask for (L33). Only the part the sale left is shown.
      ...ge(17, 4, 'independent', 'A rug cost $84 in a sale, after 30% had been taken off its ticket price. Work out the ticket price. Solve cold.', [
        { childDo: 'Say what share of the ticket price eighty-four is, use that to find a single tenth of the ticket, and build the ticket from there.', expected: '120' },
      ], '120'),
      visual: 'What the sale left. What it was taken from is the question.',
      figure: barModel(
        [{ label: 'the sale price', segments: [{ value: 84, label: '84' }], total: '84' }],
        { scaleMax: 84, alt: 'a single bar of 84, with no bar drawn for the ticket price it came from' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo. One sign, two questions: the part that goes and the
    // part that stays, asked as separate single-step items, plus the same
    // multiplier on a length so it is never only a shopping rule. No chains, no
    // choices, nothing to decide between yet.
    // The warm-up ORDER is load-bearing, which nothing in the kit says and only
    // reading a served pack shows: `applyRetrievalRamp` moves the LAST Day-1
    // retrieval item to Day 5. With the decimal multiplication last, Day 5 was
    // served TWO decimal-multiplication warm-ups and no gate objected, because
    // warm-ups are exempt from the ladder dedup. The percent-to-decimal warm-up
    // sits last instead, so the day it lands on gains a format it did not have.
    [
      { gen: wDecMultiply, diff: 2 },
      { gen: wPercentOf, diff: 2 },
      { gen: wPctToDecimal, diff: 2 },
      { gen: percentOffPrice(), diff: 3 },
      { gen: sitAmountSaved, diff: 3 },
      { gen: sitCopierReduce, diff: 3 },
    ],
    // Day 2 — fluency + application: the direction committed to before any
    // arithmetic, the sign decision, and a percent that is paid rather than
    // charged, so "a percent means a sale" never becomes the cue.
    [
      { gen: wPctToDecimal, diff: 2 },
      { gen: wDecDivide, diff: 2 },
      { gen: sitShelfPriceEstimate, diff: 3 },
      { gen: discrimWhichSign, diff: 4 },
      { gen: sitInterestYear, diff: 3 },
      { gen: percentOffPrice(), diff: 3 },
    ],
    // Day 3 — interleave: the two hardest chains sit between the sign decision
    // and two single-step readings, so nothing on the page signals what is next.
    [
      { gen: wPercentOf, diff: 2 },
      { gen: msDiscountThenTax(), diff: 4 },
      { gen: discrimWhichSign, diff: 3 },
      { gen: msRecoverTicketPrice, diff: 4 },
      { gen: sitCopierReduce, diff: 3 },
      { gen: sitShelfPriceEstimate, diff: 3 },
    ],
    // Day 4 — word problems: all three chains, and two single-step items beside
    // them so "it must be a chain" is not the tell.
    [
      { gen: msDiscountThenTax(), diff: 5 },
      { gen: msRecoverTicketPrice, diff: 5 },
      { gen: msShareTheService, diff: 4 },
      { gen: sitInterestYear, diff: 4 },
      { gen: sitAmountSaved, diff: 4 },
    ],
    // Day 5 — written: the recipe's forensics, the tournament, and the claim
    // that makes the two-cuts rule general.
    [
      { gen: wDecMultiply, diff: 2 },
      { gen: eaStackedPercent, diff: 4 },
      { gen: bestDealTournament, diff: 4 },
      { gen: percentClaimASN, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the mistake this week catches is one most adults make too, so it is worth doing together rather than marking. A sale that takes 40% off and then a further 20% off has not taken 60% off — it has taken 52%, because the second reduction is measured against the price the first one left. If you want one question that does the whole week, it is this: "what is the sign leaving you to pay?" A child who answers in per-hundreds — "seventy-five of every hundred" — has the method, because that number is the only thing they need to multiply by. Real shop windows are the best worksheet there is for this, and they are free. One honest exception, in case it is asked: simple interest pays the same share of the STARTING amount every year, so those percents really do add. Changes multiply only when each one acts on the amount the one before it left — which is the whole rule, and the sale is just its commonest case.',
  ],
  puzzle: (r) => {
    // A CUT AND A CHARGE, REPLACED BY ONE SIGN. The catalog's "prove" run as a
    // construction: the child produces the single percent change that does the
    // work of two, which no Day-1 reading produces and which cannot be reached by
    // subtracting one percent from the other.
    //
    // A CHARGE, and not a second cut, and reading the served week is why. The
    // Day-5 error-analysis is already two successive reductions; a puzzle on the
    // same page doing two successive reductions is one idea printed twice, and on
    // some draws it would have printed the same two percents as well. Pairing the
    // cut with a charge also earns the puzzle something the error-analysis cannot
    // have: the single change comes out as a REDUCTION on some draws and as an
    // INCREASE on others, so which way the answer points is drawn rather than
    // settled before the child reads anything. Both percents are whole tens,
    // which keeps the single percent whole, and no pair in the two pools cancels.
    const base = r.pick([80, 120, 140, 160, 180, 200]);
    const cut = r.pick([10, 20, 30, 40]);
    const charge = r.pick([10, 20, 30]);
    const afterSale = percentOffValue(String(base), cut);
    const finalV = percentOfValue(afterSale, 100 + charge);
    const net = 100 - ((100 - cut) * (100 + charge)) / 100; // > 0 = off, < 0 = on
    // What is provably absent from the prompt: the single percent, whose size
    // over these pools runs 1 to 34 and never lands on 10, 20, 30 or 40; the
    // price after the sale, whose smallest value is 48 against a smallest printed
    // price of 80; and the amount at the till, smallest value 52.80.
    return {
      id: 'E17-PZ-01',
      title: 'Puzzle Grove: One Sign Instead of Two',
      puzzleType: 'construction',
      prompt: `A hall runner priced at ${wholeMoney(base)} was reduced by ${cut}% in a sale, and then a charge of ${charge}% was added to the sale price at the till. A shop two doors down wants to reach exactly the same amount at the till with ONE sign instead of two. Write three numbers in order: the price after the sale, the amount paid at the till, and the size of the single percent change that would have done the whole job. Then say in one sentence whether that single change is off the price or on it, and why it is not the two percents subtracted.`,
      answer: {
        value: `${afterSale}, ${finalV}, ${Math.abs(net)}`,
        acceptableForms: [
          `${afterSale} ${finalV} ${Math.abs(net)}`,
          `${afterSale}, ${finalV}, ${Math.abs(net)}`,
          // The first two entries are money and a child writes money with a sign
          // and two places. `ordered-list` matches surfaces, so the rendered form
          // is enumerated rather than assumed.
          `${money(afterSale)}, ${money(finalV)}, ${Math.abs(net)}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'Which price is the charge measured against — the one on the ticket, or the one the sale left?',
        'Take the two changes in turn to reach the amount at the till, then ask what share of the ORIGINAL price that amount is; how far that share sits from a hundred is the single percent.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'percent-single-equivalent' },
  sprint: {
    skill: 'Division facts to 12 — recovering a whole from the part a sale left of it',
    sourceWeek: D16,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'div_facts_v1',
    params: { min: 2, max: 12 },
  },
  // MASTERY SLOT 01 IS NOT `percentOffPrice`, for two reasons found by reading a
  // served form rather than by any gate. GARMENTS is a five-noun pool shared by
  // `percentOffPrice` AND `msDiscountThenTax`, so putting both on one form served
  // "A jacket is priced at $80" beside "A jacket is priced at $60" — the pool-size
  // constraint the day plan already respects (no day carries both) and the mastery
  // form did not. And `percentOffPrice` can draw a marked price of $100 with 50%
  // off, where the answer IS the percent printed in its own prompt; that is one
  // draw in sixty-four, tolerable on a practice page and not what a certifying
  // slot should carry. It still runs on Days 1 and 2.
  mastery: [
    { gen: sitAmountSaved, diff: 3 },
    { gen: msDiscountThenTax(), diff: 4 },
    { gen: sitCopierReduce, diff: 3 },
    { gen: msRecoverTicketPrice, diff: 4 },
    { gen: sitInterestYear, diff: 3 },
    { gen: sitShelfPriceEstimate, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: one multiplier in three settings — the SIZE of a members\' reduction rather than the price it leaves (money-change), the same reduction applied to a width on a copier so that nothing is bought (measurement), and a percent that is PAID rather than charged, as a year of interest on a balance (money-change). 02/04: chains in both directions — a discount and then a charge, each acting on the price the one before it left (forward, multi-stage), and a ticket price recovered from the amount a stated change left, where whether that change was a cut or a charge is drawn, so the answer sits above the stated amount on half of forms and below it on the rest (inverse-start). 06: a price increased or decreased, drawn, behind a commitment to the MULTIPLIER made before any arithmetic. Answers run both above and below the amount they start from across the six slots, so no size reflex spans the form. What the pairing does NOT claim: the two forms draw independently, so where a pool is small they can land on the same quantity carrying a different percent — the copier item has six widths and does this about one form in six. The percent always differs, so no answer carries across.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'percents-added-not-multiplied',
      description: 'Adds two successive percent changes and applies the total to the first amount, so 40% off followed by 20% off is treated as 60% off. What the reading misses is that the second change is measured against the amount the first one left, not against the amount printed on the first ticket — so a second reduction is always worth less than its percent suggests, and a second rise is always worth more.',
      exampleWrongAnswer: 'a hundred-dollar coat reduced twice called forty dollars when the two reductions really leave forty-eight',
      distractorRationale: 'Offer the amount the two percents produce when they are added and applied in one go, so only noticing which price the second change acts on separates it from the truth.',
      reteachPointer: 'explanation/script[2] (twenty off sixty is twelve, not twenty), then the Day-5 error-analysis',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'reduction-paid-swapped',
      description: 'Answers with the amount a sign takes off when the question wanted the amount handed over, or the other way about. The two are the two parts of one price and the sign prints only one number, so nothing on the page separates them except the words — which is why the same numeral can name a large amount or a small one.',
      exampleWrongAnswer: 'a sign reading twenty-five per cent off a hundred-and-sixty-dollar price answered with forty, the part that goes',
      distractorRationale: 'Offer the other part of the same price — the reduction where the payment was asked for, or the payment where the reduction was — so only reading what the question wants separates them.',
      reteachPointer: 'explanation/script[0] (the sign printed one number, the till wants the other), then guidedExamples/E17-GE-01',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'percent-taken-as-dollars',
      description: 'Subtracts the figure on the sign straight from the price as though it were a number of dollars, so "30% off" takes thirty dollars off whatever the price happens to be. The reading gives the right answer at a price of exactly a hundred and drifts further from it the further the price moves away, which is what lets it survive.',
      exampleWrongAnswer: 'thirty per cent off a hundred-and-eighty-dollar price answered with a hundred and fifty',
      distractorRationale: 'Offer the price with the percent figure subtracted as dollars, so only treating the percent as a share of THIS price rather than a fixed amount separates it.',
      reteachPointer: 'the Day-2 and Day-3 sign decision, where a dollars sign and a percent sign carry the same numeral',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'wrong-share-kept',
      description: 'Reaches for the one-multiplication method and multiplies by the wrong one of the two shares — by 0.25 where 0.75 was wanted, or by 0.95 where a five per cent charge called for 1.05. The method is right and the arithmetic is right; only the choice of multiplier is wrong, and the tell is that the answer sits on the wrong side of the price it started from.',
      exampleWrongAnswer: 'a price with a service charge added coming out smaller than the bill it was added to',
      distractorRationale: 'Offer the value the complementary share produces, so only deciding which way the change goes before multiplying separates the two.',
      reteachPointer: 'explanation/script[3] (decide the direction first, then hold the answer against it)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Percent applications — discounts, markups, service charges and a year of interest, all done as one piece of arithmetic: a percent is a multiplier, so taking 25% off means keeping three quarters and adding a 5% charge means keeping a hundred and five per hundred. We also worked on what happens when two percents come one after the other, and on recovering an original price from a sale price.',
    improvingCandidates: [
      'naming the multiplier a change calls for before reaching for it',
      'telling the amount a sign takes off from the amount it leaves to pay',
      'measuring a second percent against the price the first one left',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'seeing why two reductions in a row take off less than the two percents added together',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading what a question wants — the part taken off, or the part still to pay',
      },
      {
        errorTag: 'representation-misread',
        text: 'treating the number on a sign as a share of the price rather than a number of dollars',
      },
      {
        errorTag: 'procedure-slip',
        text: 'choosing the right multiplier, so an answer lands on the correct side of the price it started from',
      },
    ],
    homeFocus: {
      // NOT the two-clause "you <did X> before you <touched Y>, and you checked
      // <Z> — that pair of habits is the whole week" formula. E13, E14, E15 and
      // E16 all carry it; my own token-overlap scan caught this line matching
      // both E14's and E15's, which is the borrowing E16 recorded catching in
      // itself. Five consecutive weeks in one voice is a corpus defect, not a
      // house style, and the scan is the only thing that sees it.
      praiseLine:
        'You caught a multiplier pointing the wrong way and went back for the right one. Spotting that an answer has landed on the wrong side of the price it started from is the check this week is built on.',
      questionForChild: 'A shop takes 40% off a jacket in January, and then takes another 20% off the new price in February. A friend says that is 60% off altogether. What would you say back, and what is really off?',
      schoolSyncHook: 'If your child\'s class works discounts by finding the reduction first, or by multiplying by the part that is kept, tell us and we will match what they use.',
    },
    vocabularyForParent: [
      'discount (the amount a sale takes off — not the amount then paid)',
      'markup (the amount added to what something cost, to set its selling price)',
      'multiplier (the single number a percent becomes: 0.75 for 25% off, 1.05 for a 5% charge)',
      'percent change (a rise or a fall measured as a share of what you started with)',
      'percentage point (the gap between two percents — 4% to 6% is two points, and a rise of half)',
    ],
  },
});
