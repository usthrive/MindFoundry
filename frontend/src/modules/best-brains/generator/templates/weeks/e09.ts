/**
 * Level E · Week 9 — "× ÷ rational numbers" (conceptId: muldiv-rational-numbers).
 *
 * FILL-ARCHITECTURE §6 row E9: anchor "continue the table downward (the honest
 * why)"; key multi-step "sign chains"; error-analysis "neg × neg = neg";
 * discrimination "count-the-signs"; Day-5 signature "why neg × neg is positive
 * (pattern argument)". Flag **R-lite**: every computational strand of this week
 * is code-keyed, and the one task that cannot be — the ARGUMENT for why the sign
 * flips — ships as an honestly flagged open part (decision 4).
 *
 * THE WEEK'S CLAIM. The sign rule is not a decree; it is the only sign that lets
 * a multiplication table keep the pattern it already had. Everything below is
 * built to force that reading rather than announce it:
 *  - a row of a table with the second factor held fixed changes by exactly that
 *    factor every line. 3 x -6, 2 x -6, 1 x -6, 0 x -6 climbs -18, -12, -6, 0 —
 *    six every line, all the way. One more line down and the climb does not stop
 *    at zero, because nothing in the row was ever about zero: -1 x -6 = 6. That
 *    is the whole of the "why", and it is a COMPUTATION, so this week can key it;
 *  - the row is served in both directions, so the flip is never a one-way trick.
 *    `patternRow('down')` runs the first factor down past zero and
 *    `patternRow('up')` runs it up past zero, and the second factor's own sign is
 *    drawn — so the four combinations key a positive product exactly half the
 *    time and a negative one the other half (measured below);
 *  - two discriminations attack the reflex from opposite ends. `countTheSignsTrap`
 *    (the family's, the recipe's own) asks the child to PRODUCE the sign of a
 *    product from the COUNT of its negative factors. `discrimRuleTransfer` asks
 *    the question the week after E8 has to survive: the same pair of numbers,
 *    added and multiplied, and only one of the two operations lets two negatives
 *    climb over zero;
 *  - the error-analysis is the family's own `eaNegTimesNeg`, whose shown wrong
 *    product is re-derived by `e_verify_int_mul_v1` from the same two operands
 *    the prompt prints;
 *  - three genuine chains, one per posing shape the E band owes: a FORWARD
 *    repeat-then-place (a glacier snout), an INVERSE-START where the stated
 *    reading is the RESULT of the whole chain (an observatory clock), and a
 *    HAS-DISTRACTOR share-then-scale carrying a second aisle's stock level, which
 *    is stated, is a signed reading in the same units, and is never used.
 *
 * ---------------------------------------------------------------------------
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3).
 *
 *  1. `countTheSignsTrap` IS SERVED THROUGH A LOCAL BALANCING FILTER, and the
 *     shared-file measurement behind it is reported rather than patched.
 *     Measured over 3,000 served items, the repaired library generator keys
 *     positive on 40.2%, negative on 40.4% and zero on 19.5% — because the
 *     parity coin splits the non-zero draws evenly and the zero plant takes one
 *     draw in five. Two blind strategies therefore score 40% on a three-option
 *     page that concedes 33.3% to a coin, and one of the two — "always say
 *     negative" — is the exact reflex this week exists to defeat. `evenSigns`
 *     draws the target key uniformly and keeps the first draw the library itself
 *     produces with that key, so nothing is fabricated, the conditional
 *     distribution of the factors inside each class is untouched, and all three
 *     cards land on a third (measured below). It is a lib/integers.ts matter and
 *     is reported, not fixed here.
 *
 *  2. NEITHER DISCRIMINATION CERTIFIES. Both live on Days 2 and 3, where they
 *     are taught and practised; the mastery form carries none of them. A
 *     three-option page hands a guesser a third of a slot before any reasoning
 *     starts, and this week certifies only where a signed value has to be
 *     produced from nothing. Same call E7 made, for the same reason.
 *
 *     The six slots are three produced values — the table row carried DOWNWARD
 *     past zero, the same row carried UPWARD past zero, and a signed rate
 *     repeated — and three chains. `signedDivideStory` was on the form and came
 *     off it on a measurement: its divisor is always a positive period count, so
 *     the quotient keeps the stated total's sign on 100.0% of served items and
 *     the SIGN half of a signed division is free there. That is correct
 *     mathematics rather than a guess, which is why it keeps its two daily slots;
 *     it is simply not what this week should certify on. The two row
 *     configurations replace it and cancel each other's reflex: on the downward
 *     row the answer takes the held factor's sign on 0.0% of items and on the
 *     upward row on 100.0%, so a child copying a sign is right half the time
 *     across the pair and a child applying the sign rule is right every time.
 *
 *  3. THE SIGN BALANCE IS DESIGNED, NOT OBSERVED. This is the one week whose
 *     whole subject is which side of zero an answer lands on, so a slot that
 *     keys negative most of the time would teach the reflex the week is against.
 *     Every free-entry generator here draws the answer's SIDE OF ZERO on a fair
 *     coin before anything else: `patternRow` draws the held factor's sign,
 *     `msGlacierSnout` draws the finishing position, `msClockDrift` draws the
 *     drift, `msDepotLine` draws the weekly movement, and the family's two
 *     stories draw their rate with `signed()`. The per-slot measurement is in
 *     the report, and no slot sits outside 46–54% negative.
 *
 *  4. THE DAY-5 ARGUMENT IS OPEN, AND IT IS FLAGGED (the R-lite contract).
 *     "Why is neg x neg positive?" has no computable answer: an argument is not
 *     a value, and no gate can invent one. So `whyTheRowKeepsClimbing` ships as
 *     `short-text-keyword` against the parts a pattern argument actually has —
 *     the constant step, the step carrying on past zero, and the value the row
 *     forces — and it is stated here that keyword grading can confirm those
 *     parts are PRESENT and cannot confirm the argument is VALID. What makes the
 *     week R-lite rather than R is that the argument's own evidence is
 *     computable and is on the same page: `patternRow` is code-keyed through
 *     `e_int_mul_v1`, and it sits beside the open item on Day 5 as well as on
 *     Days 1 and 4 and the mastery form. Every other item in the week, on all
 *     five days and both mastery forms, re-derives its answer through a
 *     registered templateId.
 *
 *  5. ONE SLOT IS A TABLE ROW RATHER THAN A STORY, AND THAT IS THE ANCHOR.
 *     `patternRow` prints four worked lines of a multiplication table and asks
 *     for a fifth. It is not dressed as a real-world situation because the
 *     object of study is the table itself — the recipe's own anchor is "continue
 *     the table downward (the honest why)". Its `situationType` is
 *     `rate-of-change`, which is the honest one: a row with its second factor
 *     held fixed changes by exactly that factor every line, and the item asks
 *     the child to carry that rate on. It prints no number equal to its own
 *     answer at any seed, and the argument is small: the shown products run
 *     0, k, 2k … t·k while the asked line sits at j·k with j > t, so the answer's
 *     size is larger than every product on the page and larger than both factors.
 *
 *  6. THE FRAMES ARE NEW AGAINST E6, E7 AND E8, AND THE TEMPERATURE FRAME IS
 *     DELIBERATELY LEFT TO THE LIBRARY. `signedMultiplyStory` and
 *     `signedDivideStory` both log a change in degrees per hour/day/week/round,
 *     so this week already carries two temperature surfaces before a line of it
 *     is written; a third would be piling on a frame E6 has already worked
 *     (weather stations, cold stores) and would be the L24 repeat. The three
 *     local chains therefore run on a glacier snout against a rock marker, an
 *     observatory clock against a master clock, and the aisles of a depot
 *     against the counts they are meant to hold — none of which appears in E6,
 *     E7 or E8 (see the cross-week token scan in the report).
 *
 * ---------------------------------------------------------------------------
 * Retrieval is backward-only into the four skills a signed product actually runs
 * on. D15 and D16 supply the two UNSIGNED operations the week is about to hand
 * signs to — every product and every quotient here is one of those with a side
 * of zero attached, and nothing about the digits changes. E8 supplies the single
 * signed MOVE, which is what a product repeats: a total change of five moves of
 * -3 is the E8 move done five times, and the multiplication is the shortcut. E6
 * supplies absolute value, which is exactly the part of a signed number the sign
 * rule leaves alone — the digits of a product are settled before its sign is,
 * and separating the two is the week's whole discipline.
 */

import { asWarmup, classify, divideExact, multiply, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { canonicalSigned } from '../lib/compute';
import { article, countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsParam, mathSentence, numberLine } from '../lib/figures';
import {
  absoluteValue,
  countTheSignsTrap,
  eaNegTimesNeg,
  signedAddSubStory,
  signedDivideStory,
  signedMultiplyStory,
} from '../lib/integers';
import type { Rng } from '../../rng';
import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };
const E6 = { level: 'E' as const, week: 6 };
const E8 = { level: 'E' as const, week: 8 };

type Params = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Draw helpers
// ---------------------------------------------------------------------------

/**
 * A value in `lo`…`hi` that is never one of `avoid`, in exactly ONE rng step.
 *
 * A bijection, not a redraw loop (kit §E2.4): the shortened range is mapped onto
 * the full one with the forbidden values skipped in order, so every admissible
 * value stays equally likely and the number of rng steps the draw consumes does
 * not depend on what it drew — which is what keeps every later item in the pack
 * independent of this one (L19). Same API as e07's `magnitudeApartFrom` and
 * e08's `apartFrom`; borrowed as a shape, not as prose.
 */
function apartFrom(r: Rng, lo: number, hi: number, ...avoid: number[]): number {
  const banned = [...new Set(avoid.filter((v) => v >= lo && v <= hi))].sort((a, b) => a - b);
  let v = r.int(lo, hi - banned.length);
  for (const b of banned) if (v >= b) v += 1;
  return v;
}

/** A signed value of magnitude `lo`…`hi`, negative on a fair coin. */
function signedMag(r: Rng, lo: number, hi: number): number {
  const mag = r.int(lo, hi);
  return r.int(0, 1) === 0 ? -mag : mag;
}

/**
 * A number-line window that certainly contains `values` AND zero.
 *
 * Zero is forced into every window on purpose: this week's whole subject is
 * which side of it a product finishes on, and a line cropped to its own marks
 * would hide the only landmark that matters. `checkFigureShape` wants max > min
 * with every mark inside, which the padding guarantees.
 */
function lineWindow(values: number[]): { min: number; max: number; step: number } {
  const lo = Math.min(...values, 0);
  const hi = Math.max(...values, 0);
  const pad = Math.max(1, Math.round((hi - lo) / 8));
  const span = hi + pad - (lo - pad);
  return { min: lo - pad, max: hi + pad, step: span <= 14 ? 1 : span <= 40 ? 5 : span <= 120 ? 10 : 25 };
}

/**
 * withFigure — the standing wrapper for attaching a picture to a generator whose
 * factory has no figure slot. It re-reads the drafted item's own params, so the
 * picture and the answer come from one draw and there is no second source of
 * truth for QG-13 to catch disagreeing. Identical in mechanism to e01's, e06's,
 * e07's, e08's and the integer family's internal one.
 */
function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params as Params) } : d;
  };
}

/**
 * keyedAs — a bounded rejection filter that levels a CHOICE generator's key
 * distribution without touching what it draws inside each class.
 *
 * It draws the wanted key first, then re-runs the base generator's own draw and
 * keeps the first item that keys it. Nothing is fabricated: every accepted item
 * is one the shared library itself produced, and conditioning on the key leaves
 * the factors drawn inside that class exactly as they were. Bounded at 24, so a
 * key the generator cannot reach degrades to the library's own behaviour instead
 * of hanging; the expected cost is 3.30 base draws per served item (measured
 * over 5,000), because the rarest of the three keys turns up one draw in five,
 * and 0.16% of draws fall through the bound and keep the library's own.
 *
 * The key is read off `answer.acceptableForms[0]`, which is where
 * `discrimination()` puts the canonical correct option text — that factory ships
 * no `generator` block, so the params a filter would normally read are not there.
 *
 * Used ONCE below, and only because a measured defect in a shared file would
 * otherwise reach the page (decision 1). Same shape as e06's `belowZero`, e07's
 * and e08's `redrawUntil`.
 */
function keyedAs(base: ItemGen, keys: readonly string[], tries = 24): ItemGen {
  return (rng, guard, difficulty) => {
    const want = keys[rng.int(0, keys.length - 1)];
    let d = base(rng, guard, difficulty);
    for (let i = 0; i < tries && d.answer.acceptableForms?.[0] !== want; i++) {
      d = base(rng, guard, difficulty);
    }
    return d;
  };
}

/**
 * redrawUntil — the standing rejection filter over a shared generator's own draw
 * (e06's `belowZero`, e07's and e08's `redrawUntil`), bounded for the same
 * reason. Used ONCE, on a warm-up whose unfiltered form asks the child to copy
 * out the number in front of them.
 */
function redrawUntil(base: ItemGen, holds: (params: Params) => boolean, tries = 12): ItemGen {
  return (rng, guard, difficulty) => {
    let d = base(rng, guard, difficulty);
    for (let i = 0; i < tries && d.generator && !holds(d.generator.params as Params); i++) {
      d = base(rng, guard, difficulty);
    }
    return d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * D15 — the unsigned product. Every multiplication this week sets is one of
 * these with a side of zero attached, and the digits do not change when it is:
 * separating the size of a product from its sign is the whole discipline, so the
 * size is practised on its own first.
 *
 * `multiply` cannot leak by construction: a product of two operands each at
 * least three exceeds both of them, so no seed can print its own answer.
 */
const wProductSize = asWarmup(multiply(12, 40, 3, 9), D15);
/**
 * D16 — the unsigned exact quotient, which is the other half of the same point.
 *
 * Divisor and quotient ranges are DISJOINT on purpose. `divideExact` draws the
 * two independently, so overlapping ranges let them coincide and print a warm-up
 * whose answer is one of the numerals already in its own question.
 */
const wQuotientSize = asWarmup(divideExact(14, 28, 3, 9), D16);
/**
 * E8 — one signed move. A product is that move repeated, which is the whole of
 * what the multiplication is a shortcut for, so the single move is met the day
 * before the shortcut is named.
 */
const wOneSignedMove = asWarmup(signedAddSubStory('+'), E8);
/**
 * E6 — absolute value: how far a reading lies from zero, with its side of zero
 * set aside. That is precisely the part of a product the sign rule never touches.
 *
 * SERVED THROUGH A REJECTION FILTER. `absoluteValue` weights its draw three
 * negative readings to one positive (the library's own note explains why), and
 * on a positive reading |n| = n, so the answer is the number already printed in
 * the prompt, sign and all. Measured over 3,000 raw draws: the key is a numeric
 * token of its own prompt on 25.1% of them (its DIGITS are on the page on 100%,
 * which is what absolute value is). The residual positive draw is a fact
 * about distance the E6 week has to teach; in an E9 warm-up whose whole job is
 * to separate a size from a sign it is a copy-it-out item, so the filter keeps
 * the first reading the generator itself produces below zero.
 */
const wDistanceFromZero = asWarmup(redrawUntil(absoluteValue(), (p) => Number(p.n) < 0), E6);

// ---------------------------------------------------------------------------
// The anchor — one row of a table, continued past zero
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR, and the honest "why" (decision 5).
 *
 * Four worked lines of one multiplication row are printed with the second factor
 * held fixed, and a fifth is asked for on the far side of zero. The row changes
 * by exactly the held factor every line — that is what a row of a table IS — so
 * the answer is settled by carrying the same step on, and the sign flip is a
 * CONSEQUENCE rather than a rule. It is the recipe's own anchor, and unlike the
 * argument it supports (decision 4) it is a computation, so it is code-keyed
 * through `e_int_mul_v1` like everything else in the week.
 *
 * SERVED IN BOTH DIRECTIONS, as two configurations with two hint ladders.
 * `'down'` runs the first factor down through zero and `'up'` runs it up through
 * zero, so the flip is never a one-way trick learned in one direction; and the
 * §6.5 dedup gate counts ladder TEMPLATES, so two configurations sharing a
 * ladder would spend the week's whole allowance for this item on one wording.
 *
 * THE HELD FACTOR'S SIGN IS DRAWN, which is what keeps the slot's key balanced.
 * With the held factor always negative, `'down'` keys a positive product on
 * every draw and `'up'` keys a negative one on every draw, so each configuration
 * would teach a sign by repetition rather than by argument — on the one item in
 * the week whose entire job is that the sign is not a habit. Drawing it puts
 * both configurations at a coin (measured; see the per-slot table in the report).
 *
 * NO LEAK, at any seed, and the argument is small. The printed products run
 * 0, k, 2k … t·k in size, the printed factors run 0 … t and j, and the held
 * factor is k. The answer is j·k with j > t and k ≥ 2, so it is larger than
 * every product on the page, larger than the held factor, and larger than j
 * itself. Unitless deliberately: a keyed value carries no noun, so the ±1
 * rendering trap the family's header records cannot arise here.
 */
type RowDir = 'down' | 'up';

const patternRow = (dir: RowDir): ItemGen =>
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'int-mul-pattern',
    draw: (r) => {
      const size = r.int(2, 9);
      const held = r.int(0, 1) === 0 ? -size : size;
      // How many worked lines are shown, and how far past zero the asked line
      // sits. `j > t` is what keeps the answer's size off the page.
      // FOUR OR FIVE WORKED LINES, not three. A row of three lines shows two
      // gaps, which is the smallest number from which a constant step can be
      // read at all, and the item's whole demand is that the step is constant —
      // so the child is being asked to trust a pattern the page barely
      // establishes. Read at seed 1301: "2 x -3 = -6, 1 x -3 = -3, 0 x -3 = 0"
      // is the evidence for an argument that has to carry four lines past zero.
      //
      // The asked line is also drawn clear of the HELD factor's size, because
      // the same seed served "the line whose first factor is -3" in a row whose
      // second factor was also -3: mathematically fine, and a sentence with two
      // different jobs for one printed number. No gate reads for that.
      const shownDepth = r.int(3, 4);
      const askedDepth = apartFrom(r, shownDepth + 1, 7, size);
      const factors: number[] = [];
      for (let n = shownDepth; n >= 0; n--) factors.push(dir === 'down' ? n : -n);
      const asked = dir === 'down' ? -askedDepth : askedDepth;
      const lines = factors
        .map((n) => `${fmtInt(n)} x ${fmtInt(held)} = ${fmtInt(canonicalSigned(n * held))}`)
        .join(', ');
      const step = dir === 'down' ? 'drops the first factor by one' : 'lifts the first factor by one';
      return {
        prompt: `Here is one row of a multiplication table, with the second factor held at ${fmtInt(held)}. Each line ${step}: ${lines}. Keep the row running the same way and write the product on the line whose first factor is ${fmtInt(asked)}.`,
        answerValue: String(canonicalSigned(asked * held)),
        templateId: 'e_int_mul_v1',
        params: { a: asked, b: held },
        hints:
          dir === 'down'
            ? [
                'What does the product do each time the first factor drops by one line?',
                'Carry that same step on past the zero line, one line at a time, until you reach the line the question names.',
              ]
            : [
                'By how much does the product change each time the first factor climbs by one line?',
                'Run the row on upward, one line at a time, keeping every step the same size all the way past zero.',
              ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  });

const rowDownward = patternRow('down');
const rowUpward = patternRow('up');

// ---------------------------------------------------------------------------
// The family's two signed stories
// ---------------------------------------------------------------------------

/** A signed rate repeated over a run of periods — the family's E9 product. */
const signedRateStory = signedMultiplyStory();
/**
 * A signed total shared back across the periods that made it — the family's E9
 * quotient, SERVED THROUGH A REJECTION FILTER.
 *
 * `signedDivideStory` clears its rate against the period count by SIGNED value
 * (`rate === k`), so a rate of -5 standing beside a run of 5 periods passes the
 * clearance and still prints the answer's digits: the prompt reads "Over 5 days
 * … a total change of -25 degrees", and 5 is on the page. Measured over 3,000
 * raw draws: the answer's DIGITS are a token of its own prompt on 6.8% of them
 * (the answer itself, sign included, on 0.0%), and the slots this week served it
 * on measured 6.1% to 7.8% over 800 served packs. On this week the sign is the
 * work and the digits are half of it, so a page handing them over on one item in
 * fourteen is worth cleaning up. It serves Days 1 and 4 only; it is off the
 * mastery form for the separate reason given in decision 2.
 *
 * The filter re-runs the generator's OWN draw and keeps the first pair whose
 * rate does not share a size with the period count, so nothing is fabricated and
 * the accepted item is one the family itself produced. It is a lib/integers.ts
 * matter and is reported, not patched here.
 */
const signedShareStory = redrawUntil(
  signedDivideStory(),
  (p) => Math.abs(Number(p.a) / Number(p.b)) !== Number(p.b),
);

// ---------------------------------------------------------------------------
// Discrimination — the sign of a product, and which rule it belongs to
// ---------------------------------------------------------------------------

/**
 * PRODUCE the sign, from the count of negative factors. The family's own, the
 * recipe's own, served through the balancing filter of decision 1.
 *
 * The three keys — positive, negative and zero — land on a third each, so
 * "always say negative", "always say positive" and "always say zero" are each
 * worth exactly what a three-option page concedes to a coin. Which matters here
 * more than anywhere: "always negative" is the reflex a week on signed products
 * exists to defeat, and a page that pays it 40% is teaching it.
 */
const countTheSignsBalanced = keyedAs(countTheSignsTrap(), ['positive', 'negative', 'zero'] as const);

/** Which side of zero a result lands on, in the words the cards use. */
const sideOf = (v: number): string => (v > 0 ? 'above zero' : 'below zero');
/** The card text for a (sum, product) pair — derived, never hand-authored. */
const landingCard = (sum: number, product: number): string =>
  `the sum lands ${sideOf(sum)} and the product lands ${sideOf(product)}`;

/**
 * Each card's belief, and the slip that genuinely produces it whichever draw it
 * is attached to. Keyed on the card TEXT rather than on the shape, because the
 * card is a distractor under two of the three shapes and a rationale that named
 * one of them would be describing a move that did not produce the option it is
 * attached to — the DD7 bookkeeping e07 and e08 both had to repair.
 */
const LANDING_RATIONALE: Record<string, { tag: ErrorTag; text: string }> = {
  'the sum lands below zero and the product lands above zero': {
    tag: 'concept-misconception',
    text: 'Reads the pair as two amounts both pulling downwards, which is the one case that holds a sum below zero and lifts a product above it, without checking that this pair is that case.',
  },
  'the sum lands below zero and the product lands below zero': {
    tag: 'concept-misconception',
    text: 'Takes a minus sign anywhere in the pair as holding both answers below zero, so the multiplication is never allowed to climb back over it.',
  },
  'the sum lands above zero and the product lands below zero': {
    tag: 'representation-misread',
    text: 'Reads one of the two amounts as pulling upwards and lets it win the addition on its own, while the remaining minus sign is left to settle the multiplication.',
  },
};

/**
 * DETECT which rule is on the page. The same two numbers, added and multiplied,
 * and only one of the two operations lets a pair of negatives climb over zero.
 *
 * This is the discrimination the week AFTER E8 has to survive, and it is the
 * commonest interference in the whole band: a child who has just been given
 * "two negatives make a positive" carries it back into the addition it does not
 * belong to. Both answers are computable from the two numbers printed, so the
 * correct rule — work them both out and read the two signs — passes every draw;
 * what fails is applying one sign rule to both operations.
 *
 * THE KEY IS DRAWN FIRST, as a pair shape, one third each:
 *  - `both-below`  two negatives: the sum stays below zero, the product climbs;
 *  - `larger-below` one either side with the negative carrying the larger size:
 *                  both answers land below zero;
 *  - `larger-above` one either side with the positive carrying the larger size:
 *                  the sum climbs and the product does not.
 * Every card is offered on every draw and keyed on a third of them, so no card
 * is dead (L38) and no card is a house favourite. Which of the two numbers is
 * written first is drawn as well, so "the first number's sign decides the sum"
 * is worth a coin flip on the two mixed shapes rather than the answer.
 *
 * THE FOURTH SIGN PAIR IS DELIBERATELY OFF THE PAGE. Two positives would land
 * both answers above zero, which is a true and reachable statement about
 * numbers — and a card no draw in this item can key, because a both-positive
 * pair carries none of the week's contrast and is not drawn. Offering it anyway
 * is exactly the permanently-unkeyable card L38 is about, so the card set is the
 * three statements the three shapes reach, and no more.
 */
const discrimRuleTransfer = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'int-sign-rule-scope',
  draw: (r) => {
    const shape = r.pick(['both-below', 'larger-below', 'larger-above'] as const);
    let p: number;
    let q: number;
    if (shape === 'both-below') {
      const big = r.int(3, 9);
      const small = r.int(2, big - 1);
      [p, q] = [-big, -small];
    } else if (shape === 'larger-below') {
      const big = r.int(3, 9);
      const small = r.int(2, big - 1);
      [p, q] = [-big, small];
    } else {
      const big = r.int(3, 9);
      const small = r.int(2, big - 1);
      [p, q] = [big, -small];
    }
    // Which number is written first, drawn — the sum and the product are both
    // commutative, so the order carries no mathematics and every bit of it a
    // child could read is a tell.
    const [first, second] = r.int(0, 1) === 0 ? [p, q] : [q, p];
    const truth = landingCard(p + q, p * q);
    const pool = [
      landingCard(-1, 1),
      landingCard(-1, -1),
      landingCard(1, -1),
    ];
    return {
      prompt: `Two numbers are written on one card: ${fmtInt(first)} and ${fmtInt(second)}. One calculation adds them; another multiplies them. Which of these describes where the two answers land?`,
      correct: truth,
      // DERIVED FROM THE TRUTH, never hard-coded beside it — the mistake this
      // library has now made three times, most recently in the very generator
      // served above. Whichever statement the draw makes true drops out of the
      // distractor list on its own.
      distractors: pool
        .filter((text) => text !== truth)
        .map((text) => ({
          text,
          errorTag: LANDING_RATIONALE[text].tag,
          rationale: LANDING_RATIONALE[text].text,
        })),
      hints: [
        'Do these two calculations have any reason to send their answers to the same side of zero?',
        'Work the addition out on a line through zero, then work the multiplication out as a repeated move, and read off where each one finishes.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: three chains, one per posing shape
// ---------------------------------------------------------------------------

/**
 * FORWARD — a signed rate repeated, then placed. The snout of a glacier is
 * logged against a rock marker, it moves the same signed amount every year, and
 * the question is where it stands after a run of years. The chain multiplies the
 * yearly movement out and then puts it on the reading it started from, which is
 * the week's own move applied to a position: a CHANGE may be multiplied, and a
 * POSITION may only be added to one.
 *
 * THE FINISHING POSITION IS DRAWN FIRST and the opening reading is solved for.
 * Drawing the opening reading and the yearly movement instead — the obvious way
 * round — leaves the finish wherever the arithmetic puts it, and since the total
 * movement is usually larger than any sensible opening reading, the finish then
 * agrees in sign with the yearly movement far more often than not. Deciding
 * where the snout ends and then asking what opening reading gets it there costs
 * the construction nothing and puts the answer's side of zero on a coin.
 *
 * No leak, and the argument is small: the total movement is at least four, so
 * the opening reading can never equal the finish, and the two candidate year
 * counts are tried in turn until the finish differs from every other number the
 * prompt prints. Changing the year count moves the opening reading with it and
 * leaves the answer exactly where it was.
 *
 * Metres never inflect, so a keyed value of one is safe here where it would not
 * be on a counted noun (the ±1 note in the family header).
 */
const msGlacierSnout = multiStep({
  situationType: 'measurement',
  cognitiveOp: 'int-rate-placed',
  draw: (r) => {
    const finish = signedMag(r, 2, 12);
    // THE CLEARANCES ARE ON MAGNITUDES, NOT ON SIGNED VALUES, and that is not a
    // detail. `numericTokens` — the tokenizer QG-1 and the answer-in-prompt
    // census both read prompts with — does not capture a minus sign, so a
    // finishing position of -7 standing beside a yearly movement of 7 prints the
    // answer's digits as surely as a 7 would. Cleared on signed values only, this
    // draw printed the answer's size on 15.4% of served items (measured, 800
    // packs); on magnitudes it is 0.0%.
    const perYearMag = apartFrom(r, 3, 6, Math.abs(finish));
    const perYear = r.int(0, 1) === 0 ? -perYearMag : perYearMag;
    // THE WHOLE RUN MUST OUTWEIGH THE FINISH BY A CLEAR MARGIN, and that is the
    // fix for a sign habit rather than a leak.
    //
    // Drawn without it, the run of years was short often enough that the opening
    // reading kept the finishing reading's own sign, and the finish is the
    // answer: "the answer sits on the side the first reading is on" scored 62.8%
    // of served items and "the answer sits on the side of the biggest number on
    // the page" 71.4% (measured, 1,200 packs) — habits that need no arithmetic
    // at all and that b11's shipped pool put at 60%. Insisting the run outweighs
    // the finish by at least twelve metres makes the opening reading sit on the
    // side the MOVEMENT came from, which is drawn independently of the finish, so
    // both habits fall back to a coin. It also makes the story better: a glacier
    // that has travelled a long way and ended up near its marker.
    const clearance = Math.abs(finish) + 12;
    const first = Math.max(4, Math.ceil(clearance / perYearMag));
    const years =
      [first, first + 1, first + 2].find(
        (y) =>
          perYearMag * y >= clearance &&
          Math.abs(finish) !== y &&
          Math.abs(finish - perYear * y) !== Math.abs(finish),
      ) ?? first;
    const open = finish - perYear * years;
    const marker = r.pick(['rock marker', 'boundary cairn', 'survey post', 'painted band']);
    return {
      prompt: `A glacier's snout is logged against ${article(marker)}, so ice that has pulled back short of it is written below zero and ice that has pushed out past it is written above. The survey opened with the snout at ${countNoun(open, 'm')}. It then moved ${countNoun(perYear, 'm')} every year for ${countNoun(years, 'years')}. Where does the snout stand at the end of that run?`,
      initN: perYear,
      steps: [
        { op: 'mul', n: years, d: 1 },
        { op: 'add', n: open, d: 1 },
      ],
      units: 'm',
      hints: [
        'Which number in this log names a place at the marker, and which one names a change to a place?',
        'Take the yearly movement as many times as the survey ran, then set that whole movement on the reading the survey opened with.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * INVERSE-START. The reading the story hands over is the RESULT of the whole
 * chain: the clock's closing figure is where the drift has already carried it,
 * so the opening move is to take the opening figure back off it, and the second
 * is to share what is left across the days. Nothing in the sentence order says
 * either — it names the closing reading first and the opening one last.
 *
 * THE CLOSING FIGURE'S SIDE OF ZERO IS DRAWN INDEPENDENTLY OF THE DRIFT'S, and
 * the opening figure is solved for. Built the other way round — an opening
 * figure drawn and the closing one computed — the run's total drift usually
 * outweighs the opening figure, so the closing figure carries the drift's own
 * sign, and the drift is the answer: "the answer sits on the side the first
 * reading is on" scored 89.3% of served items (measured, 1,200 packs). That is a
 * rule needing no arithmetic at all, on the slot whose answer is a signed rate.
 * Drawing the closing figure's side first breaks it: the child now has to take
 * one reading off the other before any sign is decidable.
 *
 * Served only through the check-back wrapper: on a recovered rate the honest
 * check is not whether the division came out even but whether running the drift
 * forward over the same days rebuilds the reading the log states.
 */
const msClockDrift = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'int-rate-from-total',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const drift = signedMag(r, 2, 9);
    const days = apartFrom(r, 2, 9, Math.abs(drift));
    const closeSign = r.int(0, 1) === 0 ? -1 : 1;
    const baseMag = apartFrom(r, 2, 20, Math.abs(drift));
    // SIX CANDIDATE CLOSING FIGURES against five forbidden outcomes, so one
    // always clears them — no loop, and no rng consumed by the choice. Moving the
    // closing figure moves the opening figure with it and leaves the DRIFT, which
    // is the answer, exactly where it was.
    //
    // What is being cleared: an opening figure inside a second of zero, which
    // `countNoun` renders "-1 seconds" while QG-12c's singular scan has no left
    // boundary for the minus sign and reads it as "1 seconds" (the ±1 note in
    // the family header — the closing-figure form of this was found at seed 224);
    // and either figure carrying the answer's DIGITS, which is a magnitude test
    // rather than a signed one, because the tokenizer the census reads prompts
    // with does not see a minus sign (see `msGlacierSnout` above).
    //
    // The count is not arbitrary. The closing figure's size is strictly
    // increasing across the candidates, so "the closing figure carries the
    // drift's digits" kills at most one; the opening figure moves monotonically
    // with it, so "inside a second of zero" and "carries the drift's digits" kill
    // at most two each. Five, against six candidates.
    const shift =
      [0, 4, 9, 15, 22, 30].find((k) => {
        const c = closeSign * (baseMag + k);
        const o = c - drift * days;
        return Math.abs(o) >= 2 && Math.abs(o) !== Math.abs(drift) && Math.abs(c) !== Math.abs(drift);
      }) ?? 0;
    const close = closeSign * (baseMag + shift);
    const open = close - drift * days;
    const room = r.pick(['dome clock', 'transit clock', 'tower clock', 'vault clock']);
    return {
      prompt: `An observatory logs every clock against its master clock, so a clock running behind the master is written below zero. Its ${room} closed the run at ${countNoun(close, 'seconds')}, having opened it at ${countNoun(open, 'seconds')}. The run lasted ${countNoun(days, 'days')} and the clock drifted by the same amount every day. What was the daily drift?`,
      initN: close,
      steps: [
        { op: 'sub', n: open, d: 1 },
        { op: 'div', n: days, d: 1 },
      ],
      units: 'seconds',
      hints: [
        'Does the reading this log hands you belong to the start of the run or to the end of it?',
        'Take the opening figure back off the closing one to find what the whole run drifted, then share that drift equally across the days.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const msClockDriftCheck = withCheckBack(
  msClockDrift,
  'run the daily drift you found forward across the same days from the opening figure — does it land on the reading the log closed with?',
);

/**
 * HAS-DISTRACTOR. Two aisles of a depot, each logged against the count of pallets
 * it is meant to hold, and only one of them is worked on. The other aisle's level
 * is the seductive kind of spare quantity: it is a signed reading, it is in the
 * same units, it stands in the same sentence, and it is exactly the number a
 * child who spends everything the story mentions will fold into the chain.
 * Folding it in is also the illegal move this week has to rule out — a LEVEL is
 * a position and only a CHANGE may be shared or scaled, so one aisle's
 * level can play no part in what the other aisle does next.
 *
 * The chain shares a stated total movement into a weekly one, scales it to a
 * different run of weeks and only then sets it on the level the line is standing
 * at — a division, then a multiplication, then an addition, which is the glacier
 * chain's order reversed and one step longer, so a child cannot read the shape
 * of the week off the shape of its first chain.
 *
 * THE FINISHING LEVEL IS DRAWN FIRST, on a fair coin, and the level the line
 * aisle stands at now is solved for. Two things depend on it. The estimate probe
 * splits evenly, so committing to a side is a real commitment rather than a
 * guess dressed as one; and the coming run is made to outweigh the finish by a
 * clear margin, so the level the aisle stands at now sits on the side the
 * MOVEMENT came from — which is drawn independently of the finish. Without that
 * margin the answer keeps the sign of the biggest number on the page, and an
 * earlier build of this item measured exactly that: 97.4% of served items, a
 * rule needing no arithmetic at all.
 *
 * No leak, by construction. The weekly movement is at least three and the coming
 * run at least four weeks, so the movement is at least twelve and the level now
 * is at least twelve from the finish — while the finish itself is at most nine,
 * so neither the level nor the stated total (also at least twelve) can carry the
 * answer's digits. The two runs are drawn apart from each other and from the
 * answer's size, and the spare aisle's level is drawn apart from it outright.
 */
const msDepotLine = multiStep({
  situationType: 'rate',
  cognitiveOp: 'int-rate-rescaled',
  posing: 'has-distractor',
  draw: (r) => {
    const finish = signedMag(r, 2, 9);
    const perWeekMag = apartFrom(r, 3, 9, Math.abs(finish));
    const perWeek = r.int(0, 1) === 0 ? -perWeekMag : perWeekMag;
    const clearance = Math.abs(finish) + 12;
    const first = Math.max(4, Math.ceil(clearance / perWeekMag));
    const nextRun =
      [first, first + 1, first + 2].find(
        (n) => perWeekMag * n >= clearance && Math.abs(finish) !== n,
      ) ?? first;
    // Both runs start at four, so the stated total is at least twelve and can
    // never carry the answer's digits either.
    const pastRun = apartFrom(r, 4, 9, nextRun, Math.abs(finish));
    const total = perWeek * pastRun;
    const nowLevel = finish - perWeek * nextRun;
    // The spare level: a signed reading in the same units, on the same scale,
    // drawn apart from the answer's size so the number that is never used can
    // never BE the answer.
    const spare = apartFrom(r, 2, 14, Math.abs(finish)) * (r.int(0, 1) === 0 ? -1 : 1);
    return {
      prompt: `A depot logs every aisle against the count of pallets it is meant to hold, so an aisle standing short is written below zero. The front aisle stands at ${countNoun(nowLevel, 'pallets')} and the back aisle stands at ${countNoun(spare, 'pallets')}. Over the past ${countNoun(pastRun, 'weeks')} the front aisle moved a total of ${countNoun(total, 'pallets')}, by the same amount every week. If it keeps moving by that same weekly amount for the next ${countNoun(nextRun, 'weeks')}, where will the front aisle stand then?`,
      initN: total,
      steps: [
        { op: 'div', n: pastRun, d: 1 },
        { op: 'mul', n: nextRun, d: 1 },
        { op: 'add', n: nowLevel, d: 1 },
      ],
      units: 'pallets',
      hints: [
        'Of the four quantities in this log, how many describe a movement, and how many describe somewhere a line is standing?',
        'Share the stated total across the weeks it covers to reach one week\'s movement, take that as many times as the coming run lasts, and set the whole of it on the level the front aisle is standing at.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});
const msDepotLineEstimate = withEstimateFirst(
  msDepotLine,
  'will the front aisle finish the coming weeks above the count it should hold, or below it?',
);

// Both figured chains show the child the reading they are handed and nothing
// else: the picture asserts a GIVEN, never the answer (kit §E2.5).
const msGlacierSnoutFigured = withFigure(msGlacierSnout, (p) => {
  // The opening reading is the chain's SECOND operand — the position the
  // repeated movement is finally set on. It is read off the item's own shipped
  // chain rather than redrawn, so the picture and the answer still come from one
  // draw; there is simply no scalar param for `assertsParam` to bind to, which
  // is why this figure carries no assertion (e07's decision 3, same mechanism).
  const steps = p.steps as Array<{ op: string; n: number; d: number }>;
  const open = steps[1].n;
  return numberLine(
    { ...lineWindow([open, 0]), marks: [{ at: open, label: fmtInt(open), style: 'flag' }] },
    {
      alt: 'a line through the marker with the reading the survey opened with flagged, and the run of years left undrawn',
    },
  );
});
const msClockDriftFigured = withFigure(msClockDriftCheck, (p) => {
  const close = Number(p.initN);
  return numberLine(
    { ...lineWindow([close, 0]), marks: [{ at: close, label: fmtInt(close), style: 'point' }] },
    {
      alt: 'a line through the master clock\'s reading with the closing figure plotted and the opening figure left off',
      asserts: assertsParam('initN', 'mark:0'),
    },
  );
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * THE DAY-5 SIGNATURE, and the one task in this week with no computable answer
 * (decision 4).
 *
 * It asks for an ARGUMENT, not a value: what the row does between its lines,
 * what that same step has to do on the line below zero, and the product the row
 * is therefore forced to take. The three demands are named separately so that a
 * bare value with no argument behind it, or an argument that never reaches a
 * value, cannot pass as an answer — and the keyword list accepts the several
 * ways a child can name a constant step rather than one authored wording.
 *
 * Keyword grading can confirm that the parts of the argument are PRESENT. It
 * cannot confirm that the argument is VALID, and nothing in this stack can; that
 * is what the R-lite flag means and why the week's certification rests entirely
 * on the code-keyed strand, which includes the row itself.
 *
 * Fixed prose. The demand is on the reasoning, and a drawn operand would only
 * change which digits the child has to build the same argument around.
 */
const whyTheRowKeepsClimbing = reasoning({
  prompt:
    'A classmate accepts every line of this row: 3 x -5 = -15, 2 x -5 = -10, 1 x -5 = -5, 0 x -5 = 0. They still say the next line down has to be -1 x -5 = -5, because two minus signs cannot make something climb. Write the argument that settles it. Your argument has to say what the product does between one line of this row and the next, say what that same step must do on the line below zero, and finish with the product the row forces -1 x -5 to take. An answer that only quotes the sign rule does not count.',
  value:
    'each line of the row adds 5 to the product, all the way from -15 up to 0, so the line below zero adds 5 again and -1 x -5 has to be 5 if the row is to keep the step it has had throughout',
  acceptableForms: [
    'adds 5 each line',
    'goes up by 5',
    'climbs by 5',
    'the same step',
    'the step does not change',
    'keeps the pattern',
    'carries on past zero',
    '-1 x -5 = 5',
    'has to be 5',
  ],
  keywords: true,
  hints: [
    'What is the same about every gap between one line of this row and the next?',
    'Measure that gap once, then ask what the row would have to do at zero for the gap to stop being the same.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim that generalises the week's headline instead of restating it, and
 * the one item on the page that makes a child check BOTH regimes.
 *
 * The rule everybody quotes is about two minus signs, and stated that way it
 * looks like a trick reserved for negatives. It is not: it is a rule about the
 * two factors AGREEING, and it has always covered a pair of positives as well —
 * which is why the row of the table settles both cases at once. Testing the
 * claim means trying a pair from each side of zero and finding the same verdict
 * twice, and that is what turns the trick back into a fact. It also sets the
 * boundary `discrimRuleTransfer` polices from the other side: agreement lifts a
 * PRODUCT over zero and does nothing of the kind to a sum.
 *
 * THE VERDICT WAS CHOSEN ON A MEASUREMENT, not on taste. This slot was first
 * authored as a `sometimes` claim about a negative factor dragging a number
 * down, and the served measurement killed it: of the three verdict words
 * `sometimes` is the LONGEST, so "pick the longest option" scored 100.0% of
 * 1,200 served items, and so did the hedge itself. `always` is neither the
 * longest word nor the shortest, so all three string reflexes — hedge, longest,
 * shortest — score 0.0% here (measured). The tell is a property of the verdict
 * vocabulary rather than of any draw, so it is reported upward: E1 and E13 key
 * `sometimes` and carry it as built.
 *
 * Of the Level-E weeks already built, E1 and E13 key `sometimes`, E21 and E8 key
 * `always`, and E6 and E7 key `never`. This makes `always` three, which is the
 * lightest of the three costs available: a hedger is left scoring two weeks in
 * seven, and hedging is the habit the corpus has actually documented.
 */
const claimSameSideProduct = classify({
  prompt:
    'Always, sometimes, or never true: multiplying two integers that lie on the same side of zero gives a product above zero. In one sentence, name the pairs you tested your verdict against.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale:
        'Lets the minus signs settle it rather than the agreement between them, so a pair standing below zero is thought to keep its minus sign on some occasions and lose it on others.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale:
        'Reads the claim as being about any multiplication with a minus sign in it and sends every such product below zero, so a pair that agrees is never allowed to climb over it.',
    },
  ],
  hints: [
    'Which pairs would you have to try before a verdict about "the same side of zero" is safe?',
    'Build one pair from below zero and one from above it, multiply each pair out, and see whether the two products end up making the same case.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE09 = makeWeekBuilder({
  level: 'E',
  week: 9,
  conceptId: 'muldiv-rational-numbers',
  conceptName: '× ÷ rational numbers',
  strandTags: ['number-sense-counting', 'multiplication-division'],
  prerequisiteWeeks: [D15, D16, E6, E8],
  pedagogyContract: 'v2',
  conceptualAnchor: 'one row of a multiplication table, carried on past zero',
  conceptFamily: 'operation',
  deepeningDelta:
    'E8 made a signed MOVE the object of study: a sum became a cancellation and a subtraction became a lifting-out, and every question it asked was about one move at a time. E9 asks what happens when the same move is made over and over. A product stops being a bigger addition and becomes a repeated signed move, so the digits of the answer are settled by the sizes and its side of zero is settled by how many of the factors pull downwards — two separate questions about one answer, and counting the minus signs answers the second without touching the first. Division enters as that repetition undone, which is why it obeys the same count. The one fact E8 cannot supply is the one the week is named for: with both factors below zero there is no move to repeat downwards at all, and the row of the table the product belongs to settles it, because a row that has climbed by the same step on every line has no reason to stop climbing at zero.',
  explanation: {
    hook:
      'Write out three fives, two fives, one five, no fives. The answers fall 15, 10, 5, 0 — down by five every time. Now write one line more. The falling does not stop at zero, and where it goes next is the whole of this week.',
    whyBeforeHow:
      'The sign rule is not something anybody decided. It is the only sign that lets a multiplication table stay a multiplication table, and the model to reason with is one row of a multiplication table, carried on past zero. Hold the second factor still and run the first factor down a line at a time: 3 x -6 is -18, 2 x -6 is -12, 1 x -6 is -6, 0 x -6 is 0. Look at what the products are doing rather than at what they are. They climb by six, every single line, because dropping the first factor by one drops one whole copy of the -6 out of the total. That is not a rule about signs; it is what a row of a table is. So take one more line. The first factor drops to -1, one more copy of -6 comes out, and the product climbs by six again, to 6. Nobody chose that. The row chose it, and the row was fixed before any minus sign turned up. Once you can see it, the shortcut everybody quotes falls out on its own: each negative factor turns the answer over to the other side of zero, so two of them turn it over twice and land it back where it started. That is why counting the minus signs is enough, and why a zero anywhere among the factors ends the argument early — a product with a zero factor is nothing at all, however the other signs are counted. Division follows because it is the same row read backwards: if a total of -42 was made by seven equal moves, each move can only have been -6.',
    script: [
      {
        say: 'Watch the row rather than the answers. Three sixes below zero is minus eighteen. Two sixes below zero is minus twelve. One is minus six. None at all is nothing. Now say what the products are doing as I go down: up six, up six, up six. Every line, the same six. That is not a coincidence about these numbers — dropping the first factor by one takes one whole copy of the minus six out, so the total has to climb by exactly six.',
        visual: 'The four products marked on one line, with equal hops of six between them climbing towards zero.',
        figure: numberLine(
          {
            min: -20,
            max: 8,
            step: 2,
            marks: [
              { at: -18, label: '-18', style: 'point' },
              { at: -12, label: '-12', style: 'point' },
              { at: -6, label: '-6', style: 'point' },
              { at: 0, label: '0', style: 'point' },
            ],
          },
          { alt: 'a number line with four marks below and at zero, evenly spaced six apart' },
        ),
      },
      {
        say: 'One more line, then. The first factor drops to minus one. One more copy of the minus six comes out, so the product climbs by six again. From nothing, six is six. And notice what I did not do: I did not decide anything about two minus signs. I kept the row doing what it had been doing since before any minus sign turned up. If minus one times minus six were minus six, this row would have to stop climbing at zero and turn round, and nothing on the page gives it a reason to.',
        visual: 'The same line with one more hop of six carrying the row past zero to the positive side.',
        figure: numberLine(
          {
            min: -20,
            max: 8,
            step: 2,
            marks: [{ at: 0, label: '0', style: 'flag' }],
            hops: [{ from: 0, to: 6, label: 'one more line down the row' }],
          },
          { alt: 'a number line with zero flagged and one hop of six carrying on above it' },
        ),
      },
      {
        say: 'Here is the shortcut, and now it is a consequence rather than a rule. Every negative factor turns the answer over to the other side of zero. One of them, and the answer is over the far side. Two, and it has been turned over twice and is back where it began. So I count the minus signs and I do not care what they are attached to. Odd count, below zero. Even count, above it. And if any factor is nothing at all, I stop counting, because the whole product is nothing whatever the other signs are doing.',
        visual: 'Three ringed negative factors making −12, and under them a line whose ringed nought makes the product nought whatever the signs do.',
        // Both halves of the say on one still, as two peer lines under `and`:
        // neither line becomes the other, they are two cases of one rule. Three
        // rings on the top line is the odd count that put the answer below zero;
        // the single ring on the nought is the factor that stops the counting.
        // The numbers are the row's own — the minus six of segments one and two,
        // and the minus one that carried it past zero.
        figure: mathSentence(
          [
            { text: '−1', mark: 'ring' }, { text: '×' }, { text: '−2', mark: 'ring' },
            { text: '×' }, { text: '−6', mark: 'ring' }, { text: '=' }, { text: '−12' },
          ],
          {
            then: {
              connector: 'and',
              tokens: [
                { text: '−1' }, { text: '×' }, { text: '0', mark: 'ring' },
                { text: '×' }, { text: '−6' }, { text: '=' }, { text: '0' },
              ],
            },
            alt:
              'minus one times minus two times minus six equals minus twelve, with a ring round each of the three ' +
              'negative factors, and under it minus one times nought times minus six equals nought, with a ring ' +
              'round the nought',
          },
        ),
      },
      {
        say: 'One habit before any arithmetic, and it takes about two seconds. I estimate the SIDE, and only the side: I count the minus signs, say out loud whether the answer is going above zero or below it, and then I work out the digits. Then I check the digits against the call. An answer that comes back on the other side from the one I named has not been unlucky. It tells me I have slipped, and I go and look for it instead of writing it down.',
        visual: 'The two minus signs ringed with the answer still an empty box, and under it the call made first: above zero, then 6.',
        // The order of the habit is the order of the picture. The top line has
        // both signs ringed and its answer still a box, because at that moment
        // the digits genuinely have not been worked out; the line under it names
        // the SIDE before it writes the number. It is the row's own last step
        // from segment two, so the child is watching the habit run on a result
        // they already believe rather than on a fresh sum.
        figure: mathSentence(
          [
            { text: '−1', mark: 'ring' }, { text: '×' }, { text: '−6', mark: 'ring' },
            { text: '=' }, { text: '▢', mark: 'box' },
          ],
          {
            then: {
              connector: 'becomes',
              tokens: [
                { text: 'above' }, { text: 'zero,' }, { text: 'then' },
                { text: '6', mark: 'underline' },
              ],
            },
            alt:
              'minus one times minus six equals an empty box, with a ring round each minus sign, and under it the ' +
              'call made before the digits: above zero, then six, with the six underlined',
          },
        ),
      },
    ],
    summary:
      'A row of a multiplication table changes by its held factor on every line, and it has no reason to stop doing so at zero. Carrying the row on past zero is what forces a product of two negatives to be positive: the step that has climbed on every line climbs once more. Everything else follows. Each negative factor turns a product over to the other side of zero, so an odd count of them lands it below zero and an even count lands it above; a single zero factor ends the argument, because that product is nothing however the other signs are counted. The digits of a product are settled by the sizes and its side of zero by the count, and the two questions are answered separately. Division obeys the same count, because it is the row read backwards.',
    vocabulary: [
      { term: 'factor', kidGloss: 'one of the numbers being multiplied; each one carries a size and a side of zero, and the two do different jobs' },
      { term: 'product', kidGloss: 'what a multiplication gives, whose size comes from the sizes of the factors and whose side of zero comes from how many of them are negative' },
      { term: 'quotient', kidGloss: 'what a division gives; it obeys the same sign count as a product, because dividing undoes multiplying' },
      { term: 'rational number', kidGloss: 'any number that can be written as one whole number over another, which is every number this week multiplies or divides' },
      { term: 'reciprocal', kidGloss: 'the number a value multiplies with to make one; dividing by a number is multiplying by its reciprocal, and the sign count is unchanged' },
    ],
  },
  guidedExamples: [
    {
      ...ge(9, 1, 'modeled', 'Use the row 3 x -4, 2 x -4, 1 x -4, 0 x -4 to work out -2 x -4. Say how you decided.', [
        {
          teacherSay:
            'Let me say the thing I am not going to do, because it is where most of the trouble starts. I am not going to reach for a rule about two minus signs. I am going to write the row out and watch it. Minus twelve, minus eight, minus four, nothing. What is the row doing to the products as I go down it?',
          expected: 'climbing by 4 each line',
        },
        {
          teacherSay:
            'Four every line, from the very top of the row. So say what the line below zero has to be — the one whose first factor is -1.',
          expected: '4',
        },
        {
          childDo: 'Take the row one line further and write the product it forces where the first factor is -2.',
          expected: '8',
        },
      ], '8'),
      visual: 'The four worked products marked on one line, evenly spaced, climbing towards zero.',
      figure: numberLine(
        {
          min: -14,
          max: 4,
          step: 2,
          marks: [
            { at: -12, label: '-12', style: 'point' },
            { at: -8, label: '-8', style: 'point' },
            { at: -4, label: '-4', style: 'point' },
            { at: 0, label: '0', style: 'point' },
          ],
        },
        { alt: 'a number line carrying four evenly spaced marks below and at zero, and nothing drawn above it' },
      ),
    },
    {
      ...ge(9, 2, 'completion', 'A product has four factors. Three of them are below zero and one is above. Which side of zero does the product land on, and how do you know without multiplying anything?', [
        {
          teacherSay: 'What does each factor below zero do to the side the answer lands on?',
          expected: 'turns it over',
        },
        { childDo: 'Count the turns and say where the answer finishes.', expected: 'below zero' },
      ], 'below zero'),
      visual: 'Four factors in a row with the minus signs ringed and the count written underneath.',
    },
    ge(9, 3, 'prompted', 'One division has the same digits as another: -63 ÷ 9 and -63 ÷ -9. Give both quotients, and name the single thing that differs between the two.', [
      {
        childDo: 'Settle the digits once, then count the factors below zero in each division separately.',
        expected: '-7 and 7',
      },
    ], '-7 and 7'),
    {
      // Independent stage: the opening reading alone. Deciding which side of zero
      // the run finishes on IS the task here, so drawing the repeated move would
      // hand over the plan the item exists to ask for (L33).
      ...ge(9, 4, 'independent', 'A sensor logged at -3 against its reference falls a further 4 every hour for 5 hours. Where does it read then? Solve cold.', [
        {
          childDo: 'Name the side of zero the run has to finish on before you work anything out, then repeat the hourly move and place it on the opening reading.',
          expected: '-23',
        },
      ], '-23'),
      visual: 'The opening reading on its own. Five repeats of the hourly move are not drawn, because working out where they land is the item.',
      figure: numberLine(
        {
          min: -28,
          max: 6,
          step: 5,
          marks: [{ at: -3, label: '-3', style: 'flag' }],
        },
        { alt: 'a number line through zero showing only the opening reading, with none of the hourly moves drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the row carried down past zero, one signed product
    // and one signed quotient. Single-step throughout; no chain and no choice yet.
    [
      { gen: wProductSize, diff: 2 },
      { gen: wQuotientSize, diff: 2 },
      { gen: wOneSignedMove, diff: 2 },
      { gen: rowDownward, diff: 3 },
      { gen: signedRateStory, diff: 3 },
      { gen: signedShareStory, diff: 3 },
    ],
    // Day 2 — fluency + application: both discriminations enter, against the
    // estimate-first depot run and the row read the other way.
    [
      { gen: wDistanceFromZero, diff: 2 },
      { gen: wProductSize, diff: 2 },
      { gen: msDepotLineEstimate, diff: 3 },
      { gen: countTheSignsBalanced, diff: 3 },
      { gen: discrimRuleTransfer, diff: 3 },
      { gen: rowUpward, diff: 3 },
    ],
    // Day 3 — interleave: the two chains of different shapes sit between the two
    // discriminations, so nothing on the page announces which work is coming.
    [
      { gen: wQuotientSize, diff: 2 },
      { gen: countTheSignsBalanced, diff: 3 },
      { gen: msGlacierSnoutFigured, diff: 4 },
      { gen: msClockDriftFigured, diff: 4 },
      { gen: discrimRuleTransfer, diff: 3 },
      { gen: signedRateStory, diff: 3 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus the row
    // and a quotient, so a two-step reflex is never the winning read of a page.
    [
      { gen: msGlacierSnoutFigured, diff: 5 },
      { gen: msClockDriftFigured, diff: 5 },
      { gen: msDepotLineEstimate, diff: 4 },
      { gen: rowDownward, diff: 4 },
      { gen: signedShareStory, diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, the row as
    // the computable half of the pattern argument, the argument itself as the
    // flagged open part, and the claim about what a negative factor really does.
    [
      { gen: wOneSignedMove, diff: 2 },
      { gen: eaNegTimesNeg(), diff: 4 },
      { gen: rowUpward, diff: 3 },
      { gen: whyTheRowKeepsClimbing, diff: 3 },
      { gen: claimSameSideProduct, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the answer to watch for this week is a minus sign that should not be there. "Two negatives make a positive" is easy to say and easy to distrust, because nothing about it explains itself — and a rule a child cannot see the reason for is one they will drop the moment the question looks unfamiliar. Rather than repeating the rule, write a row out together with the second number held still: 3 times minus four, then 2 times minus four, then 1, then 0. Ask what the answers are doing, not what they are. Once your child says "going up by four every time", ask what the next line down has to be — and let the row answer instead of you.',
  ],
  puzzle: (r) => {
    // The week's move run BACKWARDS, and it needs the sign count used as a
    // DEDUCTION rather than as a check. A day item hands over the factors and
    // asks for the product; here the product is known, one factor is hidden, and
    // both its size and its side of zero have to be recovered — the side from
    // counting what the visible cards do not account for, which is the argument
    // the tail asks for in words.
    // The hidden number's size is drawn from a window DISJOINT from the two
    // visible ones, so "copy one of the numbers you can see" is never the
    // answer, and the product is larger than all three, so the prompt cannot
    // print its own key at any seed.
    const hidden = signedMag(r, 6, 12);
    const a = signedMag(r, 2, 5);
    const b = signedMag(r, 2, 5);
    const product = a * b * hidden;
    return {
      id: 'E9-PZ-01',
      title: 'Puzzle Grove: The Factor Nobody Wrote Down',
      puzzleType: 'logic',
      prompt: `Three whole numbers, none of them zero, multiply together to make ${fmtInt(product)}. Two of the three are ${fmtInt(a)} and ${fmtInt(b)}. What is the third number? Then say how you could have named that number's side of zero before you divided anything at all.`,
      answer: {
        value: String(canonicalSigned(hidden)),
        acceptableForms: [String(canonicalSigned(hidden))],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'How much of that product do the two numbers you have been given already account for?',
        'Multiply the two you know to find their share of the product, then share the whole product out between that and whatever is left.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'int-factor-from-product' },
  sprint: {
    skill: 'Single-digit multiplication facts — the size of a product, settled before its side of zero is',
    sourceWeek: D15,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: rowDownward, diff: 3 },
    { gen: msGlacierSnoutFigured, diff: 4 },
    { gen: rowUpward, diff: 3 },
    { gen: msClockDriftFigured, diff: 4 },
    { gen: signedRateStory, diff: 3 },
    { gen: msDepotLineEstimate, diff: 4 },
  ],
  isomorphNotes:
    'Slots pair by index across the two forms: identical generator, identical difficulty, operands drawn from a separate stream so no surface is shared with Form A or with any daily page. The odd slots ask for a signed value produced from nothing: the product one row of a multiplication table is forced to take on a line below zero (01); the product the same row is forced to take on a line above zero (03); and the total change a stated signed rate makes over a run of periods (05). Slots 01 and 03 are the same generator run in opposite directions on purpose — on the downward row the answer takes the held factor\'s sign on none of its forms and on the upward row on all of them, so a child who copies a sign scores exactly half across the pair while a child who applies the sign rule scores both. The even slots run a chain: repeat a glacier snout\'s yearly movement and set it on the reading the survey opened with (02); recover a clock\'s daily drift from the readings a run opened and closed at, with the rebuild named (04, inverse-start, check-back); and share one depot aisle\'s stated movement into a weekly rate, scale it to a different run of weeks and set it on the level that aisle is standing at, with a second aisle\'s level stated and never used (06, has-distractor, estimate-first). Neither discrimination is on the form: a three-option page concedes a third of a slot before any reasoning starts, and this week certifies only where a signed value has to be produced. Every slot keys a value on either side of zero on roughly half of its forms — measured across 1,200 forms, no slot sits outside 48 to 53 per cent negative and the six pooled sit at 50.2 — which matters more here than in any other week, because the reflex this one exists to defeat is exactly a habit about signs.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'neg-times-neg-kept-negative',
      description:
        'Multiplies two numbers below zero and keeps the minus sign, so -4 x -6 is reported as -24. It is not carelessness: a minus sign has meant "go down" in every calculation the child has ever met, and two of them look like more of the same. What is missing is any reason for the rule that replaces it, which is why quoting the rule back does not shift it — the row of the table has to do the arguing.',
      exampleWrongAnswer: '-4 x -6 answered as -24',
      distractorRationale:
        'Offer the product with its minus sign carried straight through, which is what a child who reads each minus sign as an instruction rather than as a turn writes down.',
      reteachPointer:
        'explanation/script[0] (what the products are doing, line by line) beside script[1] (one more line, and the climb does not stop at zero)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'sign-rule-carried-into-addition',
      description:
        'Carries "two negatives make a positive" back into an addition or a subtraction, so -6 + -3 is reported as 9. It is the price of learning this week\'s rule at all, and it appears within days: the rule is true, and the child has no way of knowing which operations it is a rule ABOUT. Both operations have to be on the same page for the boundary to be visible.',
      exampleWrongAnswer: '-6 + -3 answered as 9',
      distractorRationale:
        'Offer the landing that follows from applying the multiplication sign rule to the addition as well, which puts a sum of two amounts pulling the same way on the wrong side of zero.',
      reteachPointer:
        'the Day-2 pair of calculations on one card (the same two numbers, added and multiplied) then explanation/summary',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'signs-counted-instead-of-sizes',
      description:
        'Settles the side of zero correctly and then lets the count of minus signs interfere with the digits — reporting a size that belongs to a different pair of factors, or losing a factor from the count altogether on a chain of three or four. The two questions a product asks are answered separately, and this is what happens when they are run together.',
      exampleWrongAnswer: 'a total change of -56 shared over 8 periods reported as -8',
      distractorRationale:
        'Offer the right side of zero carrying a size the factors on the page do not make, so only a reading of the digits separates it from the answer.',
      reteachPointer: 'guidedExamples/E9-GE-03 (settle the digits once, then count the factors below zero) then the Day-1 quotient',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'levels-scaled-like-changes',
      description:
        'Multiplies or divides a quantity that was never a movement in the first place. A signed rate may be repeated and a signed total may be shared; a signed LEVEL may only be moved to. When two lines of a log stand side by side in the same units, nothing on the surface separates the one that can be scaled from the one that cannot, and a child who has learned that a problem uses all its numbers has no reason to look.',
      exampleWrongAnswer: 'the back aisle\'s stated level folded into the run of movements made by the front aisle',
      distractorRationale:
        'Offer the number a child reaches by treating the other aisle\'s reading as though it were one more movement to be shared or scaled, so the size stays believable and only the reading of what each quantity IS separates it from the answer.',
      reteachPointer: 'explanation/summary (the two questions a product asks, answered separately) then the Day-2 depot log, where the number that is never used is the one belonging to the other aisle',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Multiplying and dividing with negative numbers — reading a row of a multiplication table as evidence rather than taking the sign rule on trust, settling the size of a product separately from its side of zero, counting the negative factors to decide that side, spotting that a single zero factor ends the question, and following signed rates through repeats and shares.',
    improvingCandidates: [
      'settling how big a product is and which side of zero it lands on as two separate questions',
      'counting the factors below zero rather than reciting a rule about two minus signs',
      'keeping the multiplication sign rule out of additions and subtractions',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reading a row of a times table as the reason a product of two negatives climbs above zero, so the rule has evidence behind it rather than authority',
      },
      {
        errorTag: 'task-comprehension',
        text: 'telling apart the operations the two-negatives rule is about from the ones it is not, because it is true of multiplying and dividing and false of adding',
      },
      {
        errorTag: 'procedure-slip',
        text: 'answering the two questions a product asks one at a time — how big it is, and which side of zero it lands on',
      },
      {
        errorTag: 'representation-misread',
        text: 'asking of each number in a problem whether it says where something IS or how far it has moved, because only the second kind can be shared, scaled or repeated',
      },
    ],
    homeFocus: {
      praiseLine:
        'You wrote the row out and noticed what the products were doing before you decided anything about the signs, and you checked the side of zero against the call you made first.',
      questionForChild:
        'If losing 3 points a round for 4 rounds costs you 12 points, what happens to your score when those same 4 rounds of losses are cancelled — and how would you write that as a multiplication?',
      schoolSyncHook:
        'Some classes teach the sign rules as a table to memorise and some build them from a pattern. Tell us which your child meets and we will lead with that one, so the page and the classroom agree.',
    },
    vocabularyForParent: [
      'factor (one of the numbers being multiplied; it carries a size and a side of zero, and they do different jobs)',
      'product (what a multiplication gives; its side of zero comes from how many factors are negative)',
      'reciprocal (the number a value multiplies with to make one — dividing by a number is multiplying by its reciprocal)',
    ],
  },
});
