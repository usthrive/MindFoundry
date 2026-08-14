/**
 * Level E · Week 8 — "Adding & subtracting integers" (conceptId: addsub-integers).
 *
 * FILL-ARCHITECTURE §6 row E8: anchor "zero pairs"; key multi-step "signed
 * chains"; error-analysis "-5 + 3 = -8 (adds magnitudes)"; discrimination
 * "minus-a-negative vs minus-a-positive"; Day-5 signature "write a story where
 * -(-3) is real". No R flag: every computational strand of this week is
 * code-keyed, and the one generative task is graded as prose (decision 4).
 *
 * THE WEEK'S CLAIM. A signed sum is not two numbers glued together — it is a
 * CANCELLATION followed by whatever survives it. One positive and one negative
 * annihilate each other exactly, and everything the week teaches falls out of
 * that single fact:
 *  - when the two signs DISAGREE the cancelling eats the smaller amount whole,
 *    so the sizes SUBTRACT and the survivor's sign wins. That is precisely where
 *    "-5 + 3 = -8" fails: the method is right, and it is being run in the one
 *    regime it does not belong to;
 *  - when the two signs AGREE nothing cancels, so the sizes really do add. The
 *    week says so out loud, on the Day-5 claim, because a rule that is never
 *    allowed to be right anywhere is a rule a child will smuggle back in;
 *  - subtracting is removing, and removing a negative removes something that was
 *    pulling downwards, so the total climbs. -(-3) is not a sign trick. It is a
 *    debt cancelled, a penalty struck off, a negative counter lifted out of the
 *    tray, and the Day-5 signature asks the child to produce one.
 *
 * The two named models of the catalogue row are kept apart and made to meet:
 * the COUNTER TRAY does the cancelling (a positive and a negative lift out
 * together), the NUMBER LINE does the moving (a signed move is a walk with a
 * direction), and the puzzle is the reconciliation the catalogue asks for — one
 * tray, two methods, one answer, and an argument for why they cannot disagree.
 *
 * The three E-band ceiling lifts land on three different chains:
 *  - INVERSE-START — `msBalloonPairCheck`: the height the log states belongs to
 *    the OTHER balloon, and the stated gap is the result of a subtraction, so the
 *    opening move undoes it. Nothing in the sentence order says so.
 *  - CHECK-BACK — the same chain, wrapped: an answer that does not rebuild the
 *    logged height was never a solution.
 *  - HAS-DISTRACTOR — `msCanalStretch`: the upper stretch's level is stated, is a
 *    genuine reading on the same signed scale as the answer, and is never used.
 *
 * ---------------------------------------------------------------------------
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3).
 *
 *  1. `minusNegativeTrap` — the family's own E8 discrimination, and the recipe's
 *     own — IS NOT SERVED. Its three options are `a + b`, `a - b` and `a`, drawn
 *     with `a = negative(2,12)` and `b = int(3,12)`, so `b > 0` on every draw and
 *     the three values stand in the fixed order `a - b < a < a + b`. The keyed
 *     option is therefore the LARGEST number on the page on 100.0% of 3,000
 *     draws (measured), and "pick the biggest" certifies it every time — the
 *     CONSTANT_NUMERIC_RANK defect of kit §E2.11, in its commonest shape. It is a
 *     shared-file matter, so it is reported and not patched.
 *
 *     The local `minusInstructionTrap` stands in its place and carries the same
 *     contrast. It draws the keyed value's RANK first and builds the operands to
 *     fit, so no positional reflex beats a coin; it draws WHICH PAIR of numbers
 *     shares a magnitude, so no eyeball reflex does either; and its distractors
 *     are the misconception the recipe names (both instructions carried out as
 *     one move), the slip that keeps a subtraction above zero by turning it
 *     round, and — on the middle cell — the two of them compounded.
 *
 *  2. EVERY REFLEX ON THIS PAGE WAS MEASURED, THEN DESIGNED AGAINST. Three of
 *     them beat chance on the first build and none of them does now, over 1,600
 *     served items: "add the two sizes and keep the first sign" fell from 39.5%
 *     to 0.0%, "the answer keeps the sign it started from" from 72.4% to 32.9%,
 *     and the week's own habit — "every minus makes it smaller" — from 36.8% to
 *     31.9%. A fourth needed no measurement to predict and every measurement to
 *     price: with the truth offered beside its own mirror, spotting the two
 *     options with matching digits and flipping a coin is worth one in two
 *     without reading a word. Drawing which pair matches — the truth's mirror on
 *     the extreme cells, a distractor's on the middle one — puts that at 33.7%.
 *     Each fix is written beside the draw it belongs to.
 *
 *  3. ZERO IS A KEYED ANSWER, AND IT IS KEPT AWAY FROM EVERY UNIT. The anchor is
 *     the zero pair, so an answer of nothing has to be reachable: `sitZeroPairTray`
 *     draws its value uniformly across a window that contains zero, and
 *     `discrimWhereItLands` keys "exactly at zero" on one draw in three. Both are
 *     UNITLESS by construction, and so is `sitMoveToZero` — because `countNoun`
 *     renders a keyed -1 as "-1 points" and QG-12c's singular scan has no left
 *     boundary for a minus sign, so a unit-bearing surface is the one place a
 *     near-zero answer cannot go. The unit-bearing generators this week serves
 *     either hold their answers clear of ±1 already (the family's two stories and
 *     its chain) or carry a unit that never inflects (`m`, `cm`).
 *
 *  4. THE DAY-5 SIGNATURE IS GENERATIVE, SO IT IS GRADED AS PROSE. "Write a story
 *     where -(-3) is real" has no computable answer and no gate can invent one,
 *     so `storyForMinusMinus` ships as `short-text-keyword` against the settings
 *     a removal of a negative actually has (a debt cancelled, a penalty struck
 *     off, a charge refunded) plus the number sentence it produces. The week is
 *     NOT R-flagged and does not become so: every computational item on all five
 *     days and both mastery forms re-derives its answer through a registered
 *     templateId, and the open task sits in the noncomputational strand beside
 *     the error-analysis, exactly as Level D established.
 *
 *  5. ONE SLOT PRINTS ITS ANSWER'S MAGNITUDE, AND THAT IS THE TASK.
 *     `sitMoveToZero` states where a slider sits and asks for the single move
 *     back to zero, so the digits are handed over and the SIGN is the whole of
 *     the work — the same call E7 made for `namePointFromMoves`, and the same one
 *     the family's own `oppositeValue` has always made. It will appear in the
 *     report-only answer-in-prompt census and it is stated here with the
 *     measurement rather than dressed around. It is a Day-1 concept-echo item and
 *     it is deliberately NOT on the mastery form.
 *
 *  6. THE SEA-LEVEL FRAMES ARE KEPT OFF ONE PAGE. The family's `signedChainStory`
 *     logs a submersible against sea level and E6's `oppositeValue` — served here
 *     as a warm-up — logs a height against sea level, so the two never share a
 *     day: the warm-up sits on Day 2 and the chain on Days 3 and 4. Every
 *     authored frame in this week is new against E6 and E7 (see the cross-week
 *     scan in the report); the retrieval slots are the one place E6's frames are
 *     deliberately reused, which is what a retrieval slot is for.
 *
 * ---------------------------------------------------------------------------
 * Retrieval is backward-only into the four skills a signed sum actually runs on.
 * E6 supplies two of them and they are the two halves of the anchor: the OPPOSITE
 * of a reading is the zero pair named on one line, and the GAP between two
 * readings is the size a mixed-sign sum is left holding once the cancelling has
 * finished. D2 supplies the other two, and they are the two unsigned moves a
 * signed sum reduces to: the sizes ADD when the signs agree, and they SUBTRACT
 * when the signs disagree. A child who can do both already can do every sum this
 * week sets; what is new is deciding which of the two is called for.
 */

import { addWhole, asWarmup, classify, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { canonicalSigned } from '../lib/compute';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsParam, numberLine } from '../lib/figures';
import {
  distanceBetween,
  eaAddsMagnitudes,
  oppositeValue,
  signedAddSubStory,
  signedChainStory,
} from '../lib/integers';
import type { Rng } from '../../rng';
import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const D2 = { level: 'D' as const, week: 2 };
const E6 = { level: 'E' as const, week: 6 };

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
 * not depend on what it drew. That is what keeps every later item in the pack
 * independent of this one (L19). Same shape as e07's `magnitudeApartFrom` — an
 * API borrowed, not prose.
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
 * which side of it a quantity finishes on, and a line cropped to its own marks
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
 * picture and the answer come from one draw. Identical in mechanism to e01's,
 * e06's, e07's and the integer family's internal one; see e07's note on why
 * reading the params back is the guarantee rather than a way round it.
 */
function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params as Params) } : d;
  };
}

/**
 * redrawUntil — the standing rejection filter over a shared generator's own
 * draw (e06's `belowZero`, e07's `redrawUntil`), bounded so an unsatisfiable
 * condition degrades to the library's behaviour instead of hanging.
 *
 * Used ONCE below, and only because a measured defect in a shared file would
 * otherwise reach the page.
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
 * E6 — the gap between two readings on one line. Once a mixed-sign sum has done
 * its cancelling, the size it is left holding IS that gap, so this is the answer
 * to half of this week's sums met a week early with the signs stripped off.
 *
 * SERVED THROUGH A REJECTION FILTER, because `distanceBetween` draws one reading
 * ON zero one time in five, and a gap measured from zero is the other reading
 * itself: "Ava records 8 degrees and Ben records 0 degrees. How many degrees
 * apart are the two readings?" prints its own answer. Measured over 600 served
 * items before the filter: the key appears verbatim in the prompt on 11.3% of
 * them. It is a lib/integers.ts matter and is reported rather than patched here.
 *
 * The filter re-runs the generator's OWN draw and keeps the first pair straddling
 * zero, so nothing is fabricated and the accepted item is one the family itself
 * produced. It also happens to be the shape this week wants: a gap that runs
 * through zero is exactly the count a mixed-sign sum performs, and its answer is
 * larger than either reading, so no seed can leak.
 */
const wGapBetween = asWarmup(
  redrawUntil(distanceBetween(), (p) => Number(p.a) * Number(p.b) < 0),
  E6,
);
/**
 * E6 — the opposite of a reading: the same distance from zero, the other side.
 * A number and its opposite are the zero pair written on a line rather than
 * lifted out of a tray, which is the anchor arriving before the week names it.
 */
const wOppositeOf = asWarmup(oppositeValue(), E6);
/**
 * D2 — the unsigned addition a signed sum reduces to when the two signs AGREE
 * and nothing cancels.
 *
 * The window is 180–460 rather than a wider one so no total needs a thousands
 * separator, and `addWhole` cannot leak by construction: a sum of two positive
 * operands exceeds both of them, so no seed can print its own answer.
 */
const wAddSameWay = asWarmup(addWhole(180, 460), D2);
/**
 * D2 — the unsigned subtraction a signed sum reduces to when the two signs
 * DISAGREE and the cancelling eats the smaller amount whole.
 *
 * The window's top is under twice its floor on purpose. `subWhole` draws both
 * operands from one range and orders them, so any range reaching twice its floor
 * can print `418 - 209`, whose answer is already standing beside it; keeping 470
 * under 480 makes the difference provably smaller than the number taken away.
 */
const wGapAsSubtraction = asWarmup(subWhole(240, 470), D2);

// ---------------------------------------------------------------------------
// Single-step: the anchor, in both of the week's models
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR, in the counter model. Positive and negative counters cancel one
 * for one, and what survives is the tray's value.
 *
 * THE VALUE IS DRAWN FIRST and the two counts are built from it, which is what
 * makes zero reachable without making it a favourite. Drawing the two counts
 * instead and subtracting would pile the distribution up in the middle — the
 * difference of two uniform counts is triangular, so a tray worth nothing would
 * have turned up several times as often as one worth nine either way, on the one
 * item whose whole subject is that nothing is a perfectly good answer. Drawing
 * the value uniformly over -9…9 gives 19 outcomes at about a nineteenth each,
 * and zero is one of them rather than the shape of the draw.
 *
 * UNITLESS, deliberately. The value can land on -1, and `countNoun` would render
 * that as "-1 points" while QG-12c's singular scan has no left boundary for the
 * minus sign (decision 3). With no `units` the accepted-answer list is empty and
 * a near-zero key is safe.
 *
 * WHICH KIND IS NAMED FIRST IS DRAWN. Named positives-first on every draw, the
 * answer is the first printed number less the second on 100% of them, so "take
 * the second number from the first" reaches it without ever reading which pile
 * is which — and reading which pile is which is the entire content of the item.
 * With the order drawn, that habit produces the right size and the wrong sign on
 * half the draws, and the two nouns become load-bearing.
 *
 * No leak: the prompt prints the two COUNTS, both of which are at least two and
 * both of which exceed the value they differ by whenever the value is positive —
 * and the pair count is drawn clear of a positive value outright.
 */
const sitZeroPairTray = situation({
  situationType: 'part-whole',
  cognitiveOp: 'int-zero-pair',
  draw: (r) => {
    const value = r.int(-9, 9);
    // The number of pairs that cancel. Held clear of a positive value, because
    // the smaller count IS the pair count and would otherwise print the answer.
    const pairs = apartFrom(r, 2, 9, value);
    const plus = pairs + Math.max(value, 0);
    const minus = pairs + Math.max(-value, 0);
    const positivesFirst = r.int(0, 1) === 0;
    const listed = positivesFirst
      ? `${countNoun(plus, 'positive counters')} and ${countNoun(minus, 'negative counters')}`
      : `${countNoun(minus, 'negative counters')} and ${countNoun(plus, 'positive counters')}`;
    return {
      prompt: `A counter tray holds ${listed}. Each positive counter is worth one point, and each negative counter takes one point away. A positive and a negative cancel each other out exactly. What is the tray worth once every pair that can cancel has been taken out?`,
      answerValue: String(canonicalSigned(value)),
      templateId: 'e_int_addsub_v1',
      params: { a: plus, b: -minus, op: '+' },
      hints: [
        'Which counters in this tray can pair off with one of the other kind, and which are left with nobody to cancel?',
        'Lift the pairs out two at a time, then count what is still in the tray and give the count the kind it belongs to.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * THE ANCHOR, in the line model, run backwards: a slider sits somewhere and
 * the child names the single move that returns it to zero.
 *
 * This is the zero pair as a MOVE rather than as a pile, which is the distinction
 * the whole week turns on — the E6 warm-up beside it asks for the opposite
 * POSITION, and the two questions have the same digits and different meanings.
 * The prompt therefore prints the answer's magnitude and asks for its sign, which
 * is decision 5: the digits are a given and the direction is the work. It is a
 * Day-1 concept-echo item and it certifies nothing.
 *
 * The registered params read the target and the current position: the move is
 * `0 - slider`, which is exactly what `e_int_addsub_v1` re-derives.
 */
const sitMoveToZero = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'int-move-to-zero',
    draw: (r) => {
      const slider = signedMag(r, 2, 24);
      return {
        prompt: `A slider sits at ${fmtInt(slider)} on a number line. What single move brings it to exactly zero? Write the move as a signed number.`,
        answerValue: String(canonicalSigned(-slider)),
        templateId: 'e_int_addsub_v1',
        params: { a: 0, b: slider, op: '-' },
        hints: [
          'Is the journey home to zero a climb or a drop from where this slider is sitting?',
          'Count the steps between the slider and zero, then hand that count the direction of the journey.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  // The GIVEN position only, and zero. Drawing the move would BE the answer.
  (p) => {
    const slider = Number(p.b);
    return numberLine(
      { ...lineWindow([slider]), marks: [{ at: slider, label: fmtInt(slider), style: 'point' }] },
      { alt: 'a number line with zero marked and the slider plotted, and the journey home left undrawn', asserts: assertsParam('b', 'mark:0') },
    );
  },
);

// ---------------------------------------------------------------------------
// Discrimination — the two decisions a signed move turns on
// ---------------------------------------------------------------------------

const SAME_MOVE_RATIONALE =
  'Carries out both instructions as one and the same move, so the minus sign standing in front of the second amount is read as decoration rather than as part of what is being taken away.';
const TURNED_ROUND_RATIONALE =
  'Takes the smaller amount from the larger to keep the working above zero, so the size comes out right and the answer lands on the wrong side of the line.';
const BOTH_SLIPS_RATIONALE =
  'Makes both slips at once: the two instructions are carried out as one and the same move, and then the subtraction is turned round to keep the working above zero, so the answer ends up the right distance from the start on the wrong side of it.';

/**
 * PRODUCE the landing. The recipe's own contrast — minus-a-negative against
 * minus-a-positive — with the two instructions side by side and only one of them
 * carried out (decision 1).
 *
 * THE KEYED VALUE'S RANK IS DRAWN, not left to fall out of the operands. Both
 * distractors are functions of the truth — `sameMove` sits one move of `amount`
 * on the far side of the start, and the second card is a sign flip of one or the
 * other — so which of the three numbers is largest is settled by two facts: which
 * instruction is carried out, and which side of zero the start lies on. The draw
 * fixes both, in three cells dealt one third each:
 *  - `low`    the positive amount is subtracted from a start too small to absorb
 *             it, so the landing crosses below zero and is the only negative
 *             number on the page;
 *  - `high`   the negative amount is subtracted from a start too shallow to hold
 *             it down, so the landing crosses above zero and is the only positive
 *             number on the page;
 *  - `middle` the start lies further from zero than the amount and on the side
 *             the instruction is pulling away from, so the landing stays put
 *             between the other two numbers. Which instruction that is, is drawn.
 * So "pick the biggest", "pick the middle" and "pick the smallest" each score
 * exactly what a three-option page concedes to a coin, and the negative amount is
 * the one carried out on half of all draws.
 *
 * TYING THE START'S SIDE OF ZERO TO THE INSTRUCTION IS WHAT DEFEATS THE WEEK'S
 * OWN MISCONCEPTION, and it was measured before it was designed. Left free, the
 * start's sign was independent of which instruction was asked about, and on the
 * draws where they happened to disagree "add the two sizes and keep the first
 * sign" landed on the truth: 39.5% of 1,600 served items, against the 33.3% a
 * coin gets. Fixed as above, that rule produces `sameMove` on every draw — a
 * distractor, always — so the week's named slip is now reliably wrong here rather
 * than intermittently lucky. Two further habits fall out of the same change:
 * "the answer keeps the sign of the number it started from" drops from 72.4% to
 * 32.9%, and "every minus makes it smaller" from 36.8% to 31.9%, because on the
 * draws where the habit is wrong there is now nothing below the start for it to
 * choose, and on the draws where it is right there are two.
 */
type RankTarget = 'low' | 'middle' | 'high';

const minusInstructionTrap = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'int-minus-negative',
  draw: (r) => {
    const rank = r.pick(['low', 'middle', 'high'] as const) as RankTarget;
    let amount: number;
    let start: number;
    let takesNegative: boolean;
    if (rank === 'middle') {
      // The landing sits between the other two numbers exactly when it and the
      // start lie on the same side of zero, with the start further out than the
      // amount being taken away.
      takesNegative = r.int(0, 1) === 0;
      amount = r.int(3, 14);
      // `gap` is the landing's own distance from zero; held clear of the amount
      // so the landing is never one of the numbers already printed.
      const gap = apartFrom(r, 2, 12, amount);
      start = takesNegative ? -(amount + gap) : amount + gap;
    } else {
      takesNegative = rank === 'high';
      // THE LANDING'S DISTANCE PAST ZERO IS DRAWN, and the amount is built from
      // it. Drawing the amount first and the start inside it — the obvious way
      // round — leaves the landing at `amount` minus the start, which piles the
      // key onto the small values: 24 distinct keys with 9.8% of them on "1"
      // (measured, 1,600 served items). Deciding how far past zero the move
      // carries, and then how far short of zero it started, spreads the key flat
      // across eleven distances either side and costs the construction nothing.
      const cross = r.int(2, 12);
      // The start's own distance from zero, held clear of the landing's, so no
      // printed number ever shares a magnitude with the answer.
      const stand = apartFrom(r, 2, 12, cross);
      amount = cross + stand;
      start = takesNegative ? -stand : stand;
    }
    const truth = takesNegative ? start + amount : start - amount;
    const sameMove = takesNegative ? start - amount : start + amount;
    // WHICH PAIR OF NUMBERS SHARES A MAGNITUDE IS DRAWN, and this is the fix for
    // a heuristic that needs no arithmetic at all.
    //
    // Every honest wrong landing here is either the truth with its sign flipped
    // or a number the prompt already prints, so a three-option page of them can
    // always be narrowed to two by eye. Offering the truth beside its own mirror
    // on every draw made that narrowing free: spot the two options with matching
    // digits, flip a coin, and score one in two rather than one in three, having
    // read nothing but the option list.
    //
    // So the mirror on the page is the TRUTH's on the extreme cells and the
    // DISTRACTOR's on the middle cell, where `sameMove` is offered beside its own
    // negative and the correct landing is the odd number out. There is always
    // exactly one matching pair, and it holds the answer on two draws in three —
    // which is what a three-option page concedes to a coin anyway, so the
    // heuristic is worth nothing and the child has to walk the move.
    const turnedRound = rank === 'middle' ? -sameMove : -truth;
    return {
      prompt: `A slider sits at ${fmtInt(start)} on a number line. Two instructions are written beside it: subtract ${fmtInt(amount)}, and subtract ${fmtInt(-amount)}. Which number does the slider end on when the instruction that subtracts a ${takesNegative ? 'negative' : 'positive'} amount is carried out?`,
      correct: String(canonicalSigned(truth)),
      distractors: [
        { text: String(canonicalSigned(sameMove)), errorTag: 'concept-misconception' as ErrorTag, rationale: SAME_MOVE_RATIONALE },
        {
          text: String(canonicalSigned(turnedRound)),
          errorTag: 'procedure-slip' as ErrorTag,
          // The rationale follows the CARD, because the card is not always the
          // same slip: on the middle cell it is `sameMove` turned round, which is
          // two slips compounded rather than one (e07's lesson, applied here).
          rationale: rank === 'middle' ? BOTH_SLIPS_RATIONALE : TURNED_ROUND_RATIONALE,
        },
      ],
      hints: [
        'Do these two instructions send the slider the same way along the line, or opposite ways?',
        'Read the instruction you were asked about as the undoing of a move, then walk that undoing out from where the slider is sitting.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const ABOVE_ZERO = 'above zero';
const AT_ZERO = 'exactly at zero';
const BELOW_ZERO = 'below zero';

/** Each landing described, with the slip that genuinely produces it. */
const LANDING_RATIONALE: Record<string, { tag: ErrorTag; text: string }> = {
  [ABOVE_ZERO]: {
    tag: 'concept-misconception',
    text: 'Reads the removal of a negative as a move that has to finish on the positive side of the line, so a total that climbs without ever reaching zero is placed above it anyway.',
  },
  [AT_ZERO]: {
    tag: 'task-comprehension',
    text: 'Takes any two corrections carrying opposite signs as a pair that cancels, so the total is left standing on zero whatever sizes the two corrections really had.',
  },
  [BELOW_ZERO]: {
    tag: 'concept-misconception',
    text: 'Reads every correction written with a minus sign as a move downwards, so a total that has been pulled back up over zero is left below it.',
  },
};

/**
 * DETECT which side the total finishes on — the certifying discrimination, and
 * the one no reflex can win.
 *
 * The answer is a SIDE OF ZERO rather than a number, so nothing numeric on the
 * page can be copied and no rank can be picked. Everything a guesser might reach
 * for is drawn to land on one third:
 *  - the key itself is drawn first, uniformly over above / exactly at / below,
 *    and the corrections are built to deliver it;
 *  - the starting total's side of zero is drawn INDEPENDENTLY of the key, on a
 *    fair coin, so "it finishes on the side it started" is worth exactly a third;
 *  - the week's own habit predicts "below zero" on every draw, because every
 *    draw carries a correction with a minus sign in it — so it is worth a third
 *    too, and a child holding it cannot pass this slot by holding it.
 * It is also the only place in the week where landing on zero is a DECISION
 * rather than an arithmetic output, which is why it is the anchor's certifying
 * slot and why it sits on the mastery form.
 *
 * Every draw carries exactly one correction whose amount is negative, so the
 * minus-a-negative move is always on the page; which of the two positions it
 * takes is drawn, so nothing is learnable from the order.
 */
const discrimWhereItLands = discrimination({
  variant: 'structural',
  cognitiveOp: 'int-side-of-zero',
  draw: (r) => {
    const target = r.pick([ABOVE_ZERO, AT_ZERO, BELOW_ZERO] as const);
    const finish = target === AT_ZERO ? 0 : target === ABOVE_ZERO ? r.int(2, 12) : -r.int(2, 12);
    // THE START IS DRAWN CLEAR OF THE FINISH, sign first and magnitude second so
    // that holding the two apart costs the start's side of zero nothing.
    //
    // Without it, a start that happened to equal the finish made the two
    // corrections exact opposites — "subtract 3, then subtract -3" — and the
    // item became a free pass: a child who notices the pair cancels answers from
    // the starting total alone, without walking either correction. Found by
    // reading a served pack, at 2.4% of draws; no gate sees it, because the
    // answer is right.
    const startNegative = r.int(0, 1) === 0;
    const startMag = apartFrom(r, 2, 15, (startNegative ? -1 : 1) === Math.sign(finish) ? Math.abs(finish) : -1);
    const start = startNegative ? -startMag : startMag;
    // The two corrections are SUBTRACTED, so together they must remove the whole
    // journey from start to finish. Building the second from a drawn amount and
    // the first from what is left keeps both non-zero in a fixed number of rng
    // steps: `second` is never zero because its magnitude is drawn at two or
    // more, and `first` is nudged once, away from zero, if the split lands on it.
    const drift = start - finish;
    let swing = r.int(2, 12);
    if (Math.abs(drift + swing) < 2) swing += 4;
    const first = drift + swing;
    const second = -swing;
    const order = r.int(0, 1) === 0 ? [first, second] : [second, first];
    const wrong = [ABOVE_ZERO, AT_ZERO, BELOW_ZERO].filter((t) => t !== target);
    return {
      prompt: `A running total stands at ${fmtInt(start)}. Two corrections are applied in turn: subtract ${fmtInt(order[0])}, then subtract ${fmtInt(order[1])}. Where does the running total finish?`,
      correct: target,
      distractors: wrong.map((t) => ({
        text: t,
        errorTag: LANDING_RATIONALE[t].tag,
        rationale: LANDING_RATIONALE[t].text,
      })),
      hints: [
        'Which of these two corrections pulls the total towards zero, and which one drives it further away?',
        'Walk both corrections out from the starting total in the order given, then hold the number you finish on against zero.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: two local chains beside the family's own
// ---------------------------------------------------------------------------

/**
 * INVERSE-START. The height the log states belongs to the LEAD balloon, and the
 * quantity that ties the two balloons together is a GAP — the result of taking
 * one height from the other. So the opening move is that subtraction undone, and
 * the sentence order never says so: it names the lead balloon's height first and
 * the chase balloon's climb last, with the move the child has to make in between
 * stated only as "higher than".
 *
 * THE ANSWER AND THE LOGGED HEIGHT ARE DRAWN INDEPENDENTLY, and the gap and the
 * climb are built to join them. Drawing the answer and then the two movements —
 * the obvious way round — leaves the logged height sitting a movement or two
 * either side of the answer, so the two agree in sign far more often than not:
 * measured at 81.5% of 1,200 served items, which hands a child who reads nothing
 * but the first number on the page four fifths of the answer's side of zero.
 * Deciding both ends first and solving for what joins them puts that at a coin
 * flip, and costs nothing: the key still ranges uniformly over a window
 * containing zero, and a balloon finishing level with the ridge stays a real and
 * instructive outcome.
 *
 * No leak, and the argument is small. The logged height is drawn at a different
 * distance from zero than the answer, so it can never BE the answer — which also
 * keeps the gap and the climb apart, since a gap equal to the climb would put the
 * chase balloon back on the lead balloon's own height. The gap and the climb are
 * then shifted together by whichever of three offsets clears the answer, which
 * leaves the difference between them, and therefore the answer, untouched.
 *
 * Units are metres, which never inflect, so a keyed ±1 is safe here where it
 * would not be on a counted noun (decision 3).
 *
 * Served only through the check-back wrapper: on a recovered height the honest
 * check is not whether the arithmetic is right but whether running the child's
 * own answer back through the story lands on the height the crew wrote down.
 */
const msBalloonPair = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'int-height-from-gap',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const answer = r.int(-12, 12);
    const leadMag = apartFrom(r, 2, 18, Math.abs(answer));
    const lead = r.int(0, 1) === 0 ? -leadMag : leadMag;
    // The gap must exceed the climb by exactly the distance from the answer up
    // to the logged height, which is what ties the two drawn ends together.
    const spread = lead - answer;
    let climb = r.int(3, 18);
    // One deterministic lift, only ever needed when the gap would fall short of
    // three; it raises both quantities and leaves their difference alone.
    if (climb + spread < 3) climb = 3 - spread;
    // Three candidate offsets against one forbidden value, so one always clears
    // it — no loop, and no rng consumed by the choice.
    const shift = [0, 5, 10].find((k) => climb + k !== answer && climb + spread + k !== answer) ?? 0;
    climb += shift;
    const gap = climb + spread;
    return {
      prompt: `A balloon crew logs every height against the ridge line, so a balloon below the ridge is written below zero. The lead balloon sits at ${countNoun(lead, 'm')} against the ridge, ${countNoun(gap, 'm')} higher than the chase balloon. The chase balloon then climbs ${countNoun(climb, 'm')}. What height against the ridge does the chase balloon stand at now?`,
      initN: lead,
      steps: [
        { op: 'sub', n: gap, d: 1 },
        { op: 'add', n: climb, d: 1 },
      ],
      units: 'm',
      hints: [
        'Which of the two balloons does the height in this log belong to, and which one is the question asking about?',
        'Step down from the logged height by the stated gap to reach the other balloon, then take its climb from there.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const msBalloonPairCheck = withCheckBack(
  msBalloonPair,
  'undo the climb, then put the gap back on top — where does that leave you against the height the crew wrote down?',
);

/**
 * HAS-DISTRACTOR. Two stretches of a canal, each logged against its own full
 * mark, and only one of them is worked on. The upper stretch's level is the
 * seductive kind of spare quantity: it is a signed reading on the same scale as
 * the answer, it is stated in the same units and the same sentence, and it is
 * exactly the number a child who spends everything the story mentions will fold
 * into the chain. Folding it in is also the specific illegal move this week has
 * to rule out — a level is a POSITION and only a CHANGE may be added to one, so
 * two positions never combine.
 *
 * THE FINISHING LEVEL IS DRAWN FIRST, on a fair coin, and the starting level's
 * side of zero is drawn independently of it. That is what makes the estimate
 * probe worth committing to: the probe splits evenly, and "it finishes on the
 * side it started" is worth a coin flip rather than the answer.
 *
 * No leak, and the argument is a small one. The two levels and the spare reading
 * are drawn apart from the answer outright; the rise and the fall are then
 * shifted together by whichever of three offsets clears both of them, which
 * leaves the difference between them — and therefore the answer — untouched.
 *
 * Served only through the estimate-first wrapper: which side of the full mark
 * the stretch ends on is decidable before any arithmetic, and it is the one
 * commitment that stops a child drifting across the mark mid-calculation.
 */
const msCanalStretch = multiStep({
  situationType: 'measurement',
  cognitiveOp: 'int-stretch-level',
  posing: 'has-distractor',
  draw: (r) => {
    const finish = signedMag(r, 2, 14);
    const startMag = apartFrom(r, 2, 14, Math.abs(finish));
    const start = r.int(0, 1) === 0 ? -startMag : startMag;
    const spareMag = apartFrom(r, 2, 14, Math.abs(finish), startMag);
    const spare = r.int(0, 1) === 0 ? -spareMag : spareMag;
    // The lock adds and the leak takes away; their difference is fixed by the
    // two levels, so shifting BOTH by the same offset leaves the answer alone.
    const delta = finish - start;
    let rise: number;
    let fall: number;
    if (delta >= 0) {
      fall = r.int(2, 12);
      rise = fall + delta;
    } else {
      rise = r.int(2, 12);
      fall = rise - delta;
    }
    // Three candidate offsets against at most two forbidden values, so one of
    // them always clears both — no loop, and no rng consumed by the choice.
    const shift = [0, 5, 10].find((k) => rise + k !== finish && fall + k !== finish) ?? 0;
    rise += shift;
    fall += shift;
    return {
      prompt: `A canal keeper logs each stretch of water against its own full mark, so water standing below the mark is written below zero. The lower stretch reads ${countNoun(start, 'cm')} and the upper stretch reads ${countNoun(spare, 'cm')}. A lock is worked and the lower stretch rises ${countNoun(rise, 'cm')}, then a leak takes ${countNoun(fall, 'cm')} back off it. What does the lower stretch read now?`,
      initN: start,
      steps: [
        { op: 'add', n: rise, d: 1 },
        { op: 'sub', n: fall, d: 1 },
      ],
      units: 'cm',
      hints: [
        'Which numbers in this log name a level of water, and which ones name a change to a level?',
        'Follow only the changes made to the stretch the question asks about, taking each one in the direction the log gives it.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});
const msCanalStretchEstimate = withEstimateFirst(
  msCanalStretch,
  'does the lower stretch end the day with water over its full mark, or under it?',
);

// Both local chains show the child the level they are handed and nothing else:
// the picture asserts a GIVEN, never the answer (kit §E2.5).
const msBalloonPairFigured = withFigure(msBalloonPairCheck, (p) => {
  const lead = Number(p.initN);
  return numberLine(
    { ...lineWindow([lead, 0]), marks: [{ at: lead, label: fmtInt(lead), style: 'flag' }] },
    { alt: 'a line through the ridge with the lead balloon\'s logged height flagged and the chase balloon undrawn', asserts: assertsParam('initN', 'mark:0') },
  );
});
const msCanalStretchFigured = withFigure(msCanalStretchEstimate, (p) => {
  const start = Number(p.initN);
  return numberLine(
    { ...lineWindow([start, 0]), marks: [{ at: start, label: fmtInt(start), style: 'flag' }] },
    { alt: 'a line through the full mark with the lower stretch\'s opening level flagged and neither change drawn', asserts: assertsParam('initN', 'mark:0') },
  );
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * THE DAY-5 SIGNATURE, and the one task in this week with no computable answer.
 *
 * It asks for a SETTING, not a calculation: somewhere that removing a negative
 * is a thing that happens to a person rather than a rule about signs. The three
 * demands are named separately so that a bare number sentence with no story
 * behind it, or a story with no number sentence in it, cannot pass as an answer
 * — and the keyword list accepts the settings a removal of a negative genuinely
 * has, rather than one authored wording (decision 4).
 *
 * Fixed prose. The demand is on the invention, and a drawn operand would only
 * change which digits the child has to build a world around.
 */
const storyForMinusMinus = reasoning({
  prompt:
    'Somewhere in the world, -(-3) is something that actually happens to somebody. Write that story. It has to name what the -3 is in your setting, say plainly what removing it does to the person it belongs to, and finish with the number sentence your story produces and the value that sentence lands on. A story in which the two minus signs are only a rule about signs does not count.',
  value:
    'a debt of 3 is written -3, so cancelling that debt is -(-3): a balance of -10 becomes -10 - (-3) = -7, and the person is better off by 3',
  acceptableForms: [
    'debt',
    'owed',
    'penalty',
    'refund',
    'fine is cancelled',
    'written off',
    'taken back off',
    'better off by 3',
    '- (-3) = 3',
    '-(-3) = 3',
  ],
  keywords: true,
  hints: [
    'Where in real life does somebody carry an amount that counts against them?',
    'Set that amount below zero, then say what happens to the person when it is taken away from them.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim that names the ONE regime in which the week's own misconception is
 * arithmetically right.
 *
 * Every other item on the page attacks "add the magnitudes"; this one hands it
 * back its proper territory, because a rule that is refused everywhere is a rule
 * a child smuggles back in unlabelled. When the two signs agree nothing cancels,
 * so both distances survive and the total stands further out than either part —
 * always, with no exception to hunt for, which is why the verdict is `always`.
 *
 * It keys `always`. Of the Level-E weeks already built, E1 and E13 key
 * `sometimes`, E21 keys `always` and E6 and E7 key `never`, so no verdict is
 * becoming the safe bet and a child who has learned that a hedged answer usually
 * pays is not rewarded for it here.
 */
const claimTwoNegatives = classify({
  prompt:
    'Always, sometimes, or never true: adding two negative numbers gives a total lying further from zero than either of the two numbers does. In one sentence, say what the two distances from zero do when the signs agree.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale:
        'Lets the two sizes settle it, as they genuinely do when the signs disagree, so a pair that agrees is thought to hand the answer to whichever number lies further out and leave the other one behind.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale:
        'Reads every addition as a climb towards the positive end of the line, so a second negative is expected to carry the total back towards zero rather than further from it.',
    },
  ],
  hints: [
    'When two amounts pull the same way, does either of them undo any part of the other?',
    'Try one pair that agrees in sign and one that disagrees, mark both totals on a line, and ask whether a single verdict covers the two.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE08 = makeWeekBuilder({
  level: 'E',
  week: 8,
  conceptId: 'addsub-integers',
  conceptName: 'Adding & subtracting integers',
  strandTags: ['number-sense-counting', 'addition-subtraction'],
  prerequisiteWeeks: [D2, E6],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the zero pair — one positive and one negative cancelling each other out exactly',
  conceptFamily: 'operation',
  deepeningDelta:
    'E6 gave a reading a side of zero and left it standing there: every question it asked was about where a number IS, and nothing in it ever moved. E6\'s one chain walked a temperature down and back up, but the walking was arithmetic the child already owned, dressed in signs. E8 makes the movement itself the object of study. A signed sum stops being two numbers to combine and becomes a cancellation followed by a survivor, which is why the sizes subtract when the signs disagree and add when they agree; and subtraction stops being "make it smaller", because removing something that was pulling downwards lets a total climb. D2\'s addition and subtraction are still the only arithmetic on the page — what is new is that the child, not the question, decides which of the two is called for.',
  explanation: {
    hook:
      'Put one counter worth a point into a tray, then one that takes a point away. The tray is worth nothing at all, and it is not empty. That pair is where every answer this week comes from.',
    whyBeforeHow:
      'A signed sum is not two numbers glued together. It is a cancellation, and then whatever survives it. The model to reason with is the zero pair — one positive and one negative cancelling each other out exactly — because once you can see the pairs lift out, every rule this week has stops being a rule and starts being a consequence. Put five negatives in a tray and three positives, and three of the five find partners and go; the two negatives left over are what the tray is worth, so the answer is -2 rather than -8, and the sizes have SUBTRACTED. Now put five negatives in with three more negatives, and nothing pairs off at all, because there is nothing of the other kind for anything to cancel with. All eight survive and the sizes really do add. That is the whole of it: the signs decide whether there is any cancelling to do, and only then do the sizes decide what is left. Subtraction is the same idea with one extra step. Taking something away means lifting it out of the tray, so lifting out a negative removes something that was holding the total down, and the total climbs. That is why -(-3) is not a trick played with two minus signs. It is a debt cancelled, and the person it belonged to is three better off than they were.',
    script: [
      {
        say: 'Two trays. In the first I put five negative counters and three positive ones. Watch what happens before I add anything up: a positive and a negative find each other and both leave the tray, and they do it three times over. Two negatives are left standing there with nobody to cancel them. So the tray is worth minus two. Notice what the three did — it did not join the five. It ate three of them.',
        visual: 'Five negative counters and three positive ones, with three pairs ringed and lifting out, leaving two negatives.',
        figure: numberLine(
          {
            min: -6,
            max: 2,
            step: 1,
            marks: [{ at: -5, label: '-5', style: 'flag' }],
            hops: [{ from: -5, to: -2, label: 'the three that cancel' }],
          },
          { alt: 'a number line with zero marked, a flag five below it, and one hop of three climbing back up towards it' },
        ),
      },
      {
        say: 'Second tray. Five negative counters, and now three more negative ones. Nothing pairs off. There is nothing of the other kind in the tray for anything to cancel with, so all eight counters survive and the tray is worth minus eight. Here is the part worth holding on to: adding the sizes together was never wrong. It was right in this tray and wrong in the first one, and the only thing that decided which was whether the two signs agreed.',
        visual: 'Eight negative counters, none of them paired, all still in the tray.',
        figure: numberLine(
          {
            min: -10,
            max: 2,
            step: 2,
            marks: [{ at: -5, label: '-5', style: 'flag' }],
            hops: [{ from: -5, to: -8, label: 'the three that cannot cancel' }],
          },
          { alt: 'a number line with zero marked, a flag five below it, and one hop of three heading further down away from it' },
        ),
      },
      {
        say: 'Now taking away, which is where most people lose their footing. A tray is worth minus ten. I reach in and lift out a counter worth minus three. What was that counter doing while it sat there? It was holding the tray down. Take it out and the tray goes up, to minus seven. Nothing strange happened. Removing something that was pulling downwards lets the total climb, and that is the whole of what a minus in front of a minus means.',
        visual: 'A tray worth minus ten with a negative three lifted out of it, and the total rising to minus seven.',
        figure: numberLine(
          {
            min: -13,
            max: 2,
            step: 1,
            marks: [{ at: -10, label: '-10', style: 'flag' }],
            hops: [{ from: -10, to: -7, label: 'the negative lifted out' }],
          },
          { alt: 'a number line with zero marked, a flag ten below it, and one hop of three climbing back up towards it' },
        ),
      },
      {
        say: 'Here is what I do before any arithmetic at all, and it takes about three seconds. I ask which side is winning. More pulling down than pulling up, and my answer is going to come out below zero — I have not worked a single thing out yet, and I already know that much about it. Then I hold my working up against the call. An answer that lands on the other side from the one I named does not surprise me. It tells me I have slipped somewhere, and I go and look instead of writing it down.',
        visual: 'The pull downwards outweighing the pull upwards, and a finish that never reaches zero.',
        figure: numberLine(
          {
            min: -12,
            max: 4,
            step: 2,
            marks: [{ at: -9, label: 'start', style: 'flag' }],
            hops: [{ from: -9, to: -3, label: 'the climb' }],
          },
          { alt: 'a number line with zero marked, the opening total flagged nine below it, and one climbing hop that stops short of zero' },
        ),
      },
    ],
    summary:
      'One positive and one negative cancel each other out exactly, and that single fact settles the week. When two signs disagree the cancelling eats the smaller amount whole, so the sizes subtract and the survivor keeps its own sign. When two signs agree nothing cancels, so the sizes add and the total lies further from zero than either part. Subtracting means lifting out: lift out a positive and the total falls, lift out a negative and the total climbs, because whatever was pulling it down has gone. Every sum this week sets is one of those three sentences wearing a story, and deciding which one it is comes before any arithmetic.',
    vocabulary: [
      { term: 'zero pair', kidGloss: 'one positive and one negative of the same size, which cancel each other out exactly and together are worth nothing' },
      { term: 'sum', kidGloss: 'what is left once every pair that can cancel has cancelled — not always bigger than what you started with' },
      { term: 'difference', kidGloss: 'what a subtraction leaves; it climbs when the amount removed was itself below zero' },
      { term: 'additive inverse', kidGloss: 'the partner a number cancels with completely, leaving nothing at all behind — every number has exactly one' },
      { term: 'magnitude', kidGloss: 'how far a number lies from zero, with its side of zero set aside — the part that adds or subtracts once the signs have decided which' },
    ],
  },
  guidedExamples: [
    {
      ...ge(8, 1, 'modeled', 'Work out -7 + 4. Say how you decided.', [
        {
          teacherSay:
            'Watch what my hand wants to do here, because it is worth catching before it gets anywhere. There is a seven on the page and there is a four, and my hand wants to shove them together and hang a minus sign off the front of the result. I am not settling this in my head. There is a smaller question to ask first, and it is this: does anything on this page cancel?',
        },
        {
          teacherSay:
            'Seven counters pulling down, four pulling up. Every one of those four finds a partner and both of them leave. How many of the seven are left with nobody to cancel them?',
          expected: '3',
        },
        {
          childDo: 'Give that count the kind of counter it belongs to, and write what the tray is worth.',
          expected: '-3',
        },
      ], '-3'),
      visual: 'Seven counters pulling down against four pulling up, with the four pairs lifting out.',
      figure: numberLine(
        {
          min: -9,
          max: 2,
          step: 1,
          marks: [{ at: -7, label: '-7', style: 'flag' }],
          hops: [{ from: -7, to: -3, label: 'the four that cancel' }],
        },
        { alt: 'a number line with zero marked, a flag seven below it, and one hop of four climbing back up towards it' },
      ),
    },
    {
      ...ge(8, 2, 'completion', 'A tray is worth -6. Two negative counters are lifted out of it. Write what the tray is worth now, and say which way the removal moved it.', [
        {
          teacherSay: 'What were those two counters doing to the tray while they sat in it?',
          expected: 'holding it down',
        },
        { childDo: 'Take their pull off the tray and write the value it is left with.', expected: '-4' },
      ], '-4'),
      visual: 'The tray before anything is lifted out of it. Where the removal sends it is yours to work out.',
      figure: numberLine(
        {
          min: -8,
          max: 2,
          step: 1,
          marks: [{ at: -6, label: '-6', style: 'point' }],
        },
        { alt: 'a number line with zero marked and the tray\'s opening value plotted below it, and no removal drawn' },
      ),
    },
    ge(8, 3, 'prompted', 'Work out 5 - 9, then work out 5 - (-9). Write both answers and say why they land on opposite sides of zero.', [
      {
        childDo: 'Take each subtraction as a lifting-out, and decide for each one whether what leaves was pulling up or pulling down.',
        expected: '-4 and 14',
      },
    ], '-4 and 14'),
    {
      // Independent stage: the opening total alone. Deciding which side of zero
      // the run finishes on IS the task here, so drawing the two moves would
      // hand over the plan the item exists to ask for (L33).
      ...ge(8, 4, 'independent', 'A running total stands at -12. It rises 15, then a charge of -4 is taken back off it. Where does the total finish? Solve cold.', [
        {
          childDo: 'Name which side is winning before you touch either move, then apply them in the order the story gives.',
          expected: '7',
        },
      ], '7'),
      visual: 'Where the total opens, and no more than that. What the two moves do to it is yours to find.',
      figure: numberLine(
        {
          min: -15,
          max: 9,
          step: 3,
          marks: [{ at: -12, label: '-12', style: 'flag' }],
        },
        { alt: 'a number line with zero marked, showing only where the total opens and neither of its two moves' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the zero pair in both of the week's models (lifted
    // out of a tray, walked back to zero on a line) and one signed removal.
    // Single-step throughout; no chain and no choice yet.
    [
      { gen: wGapBetween, diff: 2 },
      { gen: wAddSameWay, diff: 2 },
      { gen: wGapAsSubtraction, diff: 2 },
      { gen: sitZeroPairTray, diff: 3 },
      { gen: sitMoveToZero, diff: 3 },
      { gen: signedAddSubStory('-'), diff: 3 },
    ],
    // Day 2 — fluency + application: both discriminations enter, against the
    // estimate-first canal run and a second signed removal.
    //
    // The E6 opposite warm-up sits here rather than on Day 1 because it logs a
    // height against sea level and so does the family's chain, which runs on
    // Days 3 and 4 — the two never share a page (decision 6).
    [
      { gen: wOppositeOf, diff: 2 },
      { gen: wAddSameWay, diff: 2 },
      { gen: msCanalStretchFigured, diff: 3 },
      { gen: minusInstructionTrap, diff: 3 },
      { gen: discrimWhereItLands, diff: 3 },
      { gen: signedAddSubStory('-'), diff: 3 },
    ],
    // Day 3 — interleave: the two chains of different shapes sit between the two
    // discriminations, so nothing on the page announces which work is coming.
    [
      { gen: wGapAsSubtraction, diff: 2 },
      { gen: discrimWhereItLands, diff: 3 },
      { gen: signedChainStory(), diff: 4 },
      { gen: msBalloonPairFigured, diff: 4 },
      { gen: minusInstructionTrap, diff: 3 },
      { gen: signedAddSubStory('+'), diff: 3 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus two
    // single-step items so a two-step reflex is never the winning read of a page.
    [
      { gen: signedChainStory(), diff: 5 },
      { gen: msBalloonPairFigured, diff: 5 },
      { gen: msCanalStretchFigured, diff: 4 },
      { gen: sitZeroPairTray, diff: 4 },
      { gen: signedAddSubStory('+'), diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, the story a
    // removed negative really lives in, and the claim that hands "add the sizes"
    // back the one regime it belongs to (+ a ramped warm-up).
    [
      { gen: wGapBetween, diff: 2 },
      { gen: eaAddsMagnitudes(), diff: 4 },
      { gen: storyForMinusMinus, diff: 3 },
      { gen: claimTwoNegatives, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the answer to watch for this week is -8 where -2 belongs. It is not carelessness, and it is not a guess — it is the rule that has worked on every sum your child has ever met, run one step past where it works. Adding the two sizes together is exactly right when both numbers pull the same way, and exactly wrong when they pull against each other. Rather than marking the answer, put out a handful of coins for what is owed and a handful for what is held, and let the pairs cancel on the table.',
  ],
  puzzle: (r) => {
    // The week's move run BACKWARDS. A day item hands over the two counts and
    // asks what the tray is worth; here the tray is sealed — only its total
    // headcount and the number of pairs that came out of it are known — so the
    // survivors have to be recovered before they can be valued. The tail is the
    // catalogue's own signature: two models, one answer, and the reason they
    // cannot disagree.
    const pairs = r.int(3, 14);
    const leftover = r.int(2, 12);
    const total = 2 * pairs + leftover;
    return {
      id: 'E8-PZ-01',
      title: 'Puzzle Grove: The Tray That Owes',
      puzzleType: 'logic',
      prompt: `A sealed tray holds ${countNoun(total, 'counters')} altogether, some worth a point each and the rest taking a point away each. Every counter that can be matched with one of the other kind is taken out in pairs, and ${countNoun(pairs, 'pairs')} come out. Every counter still in the tray takes a point away. What is the tray worth? Then say why a child who instead walks the whole tray out along a number line, one step right for every counter worth a point and one step left for every counter that takes one away, has to finish in the same place.`,
      answer: {
        value: String(canonicalSigned(-leftover)),
        acceptableForms: [String(canonicalSigned(-leftover))],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'How many counters leave the tray when one whole pair is taken out of it?',
        'Take the paired counters off the headcount first, then give what is left the kind those survivors carry.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'int-value-from-pairs' },
  sprint: {
    skill: 'Subtraction within 100 — the take-away the sizes fall back on once a mixed pair has finished cancelling',
    sourceWeek: D2,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 24, max: 86 },
  },
  mastery: [
    { gen: sitZeroPairTray, diff: 3 },
    { gen: msBalloonPairFigured, diff: 4 },
    { gen: discrimWhereItLands, diff: 3 },
    { gen: signedChainStory(), diff: 4 },
    { gen: signedAddSubStory('-'), diff: 3 },
    { gen: msCanalStretchFigured, diff: 4 },
  ],
  isomorphNotes:
    'Slots pair by index across the two forms: identical generator, identical difficulty, operands drawn from a separate stream so no surface is shared with Form A or with any daily page. The odd slots ask what a signed quantity IS: what a counter tray is worth once every pair that can cancel has gone (01, free entry, and its key ranges over nineteen values including nothing at all); which side of zero two corrections leave a running total on (03, the one slot where landing on zero is a decision rather than an arithmetic output); and what a game score reads once a penalty below zero has been taken back off it (05). The even slots run a chain: recover a balloon\'s height from a stated gap and a climb, with the rebuild named (02, inverse-start, check-back); carry a submersible through a rise and a dive across sea level (04); and read a canal stretch after a rise and a leak, with a second stretch\'s level stated and never used (06, has-distractor, estimate-first). Every slot can key a value on either side of zero, so no answer here is a sign waiting to be guessed: measured across 1,600 forms, four of the five free-entry slots key a negative value on 46 to 52 per cent of them, the fifth on 77, and the submersible chain on 97 because it is a below-sea-level story and says so on its face. Slots 01 and 02 can also key nothing at all. Slot 03 is keyed above zero, at zero and below zero in equal thirds, so no sign reflex reaches it either.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'adds-the-magnitudes',
      description:
        'Combines the two sizes and hangs the first number\'s sign off the result, so -5 + 3 is reported as -8. The move is not careless: adding the sizes is exactly what a sum has always meant, and it stays correct whenever the two numbers pull the same way. What has gone missing is the prior question — whether anything on the page cancels — so the rule is being run in the one regime it does not belong to.',
      exampleWrongAnswer: 'a reading of -5 that rises 3 reported as -8',
      distractorRationale:
        'Offer the value the two sizes genuinely make when they are added and the first sign is kept, which is what a child who never asked whether anything cancels writes down.',
      reteachPointer:
        'explanation/script[0] (the three that cancel, and the two left standing) beside script[1] (the same addition, right, in the tray where nothing pairs off)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'subtraction-turned-round',
      description:
        'Takes the smaller amount from the larger to keep a subtraction above zero, so the size of the answer is right and its side of the line is not. It is the habit that made every earlier subtraction possible — you could not take nine from five — and this is the first week in which taking nine from five is an ordinary thing to do.',
      exampleWrongAnswer: '5 - 9 answered as 4',
      distractorRationale:
        'Offer the correct size standing on the wrong side of zero, so only a reading of which way the move actually travels separates it from the answer.',
      reteachPointer: 'guidedExamples/E8-GE-03 (the same two digits subtracted both ways round) then explanation/script[2]',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'every-minus-makes-it-smaller',
      description:
        'Reads any minus sign anywhere in a sentence as an instruction to go down, so removing a negative is walked the wrong way and a total that ought to climb is left below where it began. It also covers the opposite over-correction a week later, in which two minus signs are taken to cancel into no move at all and the total is left exactly where it started.',
      exampleWrongAnswer: 'a score of -12 with a penalty of -5 taken back off it reported as -17',
      distractorRationale:
        'Offer the landing that a downward reading of the removal produces: the same distance travelled, in the one direction the story did not take.',
      reteachPointer:
        'explanation/script[2] (what the counter was doing while it sat in the tray) then the Day-2 instruction pair',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'levels-added-to-levels',
      description:
        'Spends every quantity the story states, including one that names a POSITION rather than a change to one, so two readings are combined as though one of them were a move. Every number is in the same units and on the same signed scale, which is exactly what makes the spare one look usable.',
      exampleWrongAnswer: 'the upper stretch\'s level folded into the run of changes made to the lower one',
      distractorRationale:
        'Offer the value that follows from consuming the stated level the question never asks about, which stays plausible in size and on the right scale.',
      reteachPointer: 'guidedExamples/E8-GE-04 (decide what each stated number IS before moving anything) then the Day-4 word problems',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Adding and subtracting integers — reading a signed sum as a cancellation rather than a combination, telling apart the pairs that cancel from the pairs that cannot, following totals through rises and falls that cross zero, and working out what happens when an amount below zero is taken away rather than added.',
    improvingCandidates: [
      'asking whether anything cancels before adding or subtracting any sizes',
      'taking a removal of a negative amount as a climb rather than a drop',
      'naming which side is winning before any arithmetic is done',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'deciding whether the two amounts pull the same way or against each other, because that is what settles whether the sizes add or subtract',
      },
      {
        errorTag: 'procedure-slip',
        text: 'taking a larger amount from a smaller one and letting the answer go below zero, instead of turning the subtraction round to stay above it',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading a minus sign for what it is doing in the sentence — naming a side of zero, or naming a removal — rather than as a general instruction to go down',
      },
      {
        errorTag: 'representation-misread',
        text: 'telling a stated level apart from a stated change, and spending only the numbers the question actually calls for',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked whether anything cancelled before you added a single size, and you drew the move on a line rather than deciding it in your head.',
      questionForChild:
        'If you owe me 8 and I tear up 3 of what you owe, are you better off or worse off than before — and by how much?',
      schoolSyncHook:
        'If your child\'s teacher rewrites a subtracted negative as an addition before anything else is done, let us know. We will show that step on the page as well, so what your child reads here matches what they hear in class.',
    },
    vocabularyForParent: [
      'zero pair (one positive and one negative of the same size, cancelling each other out exactly)',
      'additive inverse (the partner a number cancels with completely, leaving nothing behind)',
      'magnitude (how far a number lies from zero, with its side of zero set aside)',
    ],
  },
});
