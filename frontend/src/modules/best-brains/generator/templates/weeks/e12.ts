/**
 * Level E · Week 12 — "Equivalent expressions" (conceptId: equivalent-expressions).
 *
 * FILL-ARCHITECTURE §6 row E12: anchor "test-at-many-values vs true-for-all";
 * key multi-step "evaluate both at drawn x (computable core)"; error-analysis
 * "2(x+3) = 2x+3 (distribute once)"; discrimination "equal-at-one-x vs
 * equal-at-ALL-x"; Day-5 signature "prove-in-general: flagged open part".
 * Flag **R** — the general argument ships as `manual-review`, never as a faked
 * computable answer (§7).
 * Catalog: "Distributive property; factor/expand; combine like terms", Day-5
 * '"Are these always equal?" — test with numbers, then argue in general'.
 *
 * THE WEEK'S CLAIM, and it is the first genuinely LOGICAL idea in the ladder.
 * E11 evaluated an expression at a value. E12 asks whether two expressions are
 * the same expression wearing different clothes — and the answer turns out to be
 * a question about EVIDENCE rather than about arithmetic:
 *
 *  - Two expressions are equivalent when they agree for EVERY value, not for the
 *    value you happened to try. Nothing about a single agreement rules out the
 *    two coming apart at the next value up.
 *  - So testing is lopsided, and the lopsidedness is the whole week. One value
 *    where they DISAGREE settles it forever: they are not the same, and no
 *    further testing can rescue them. One value where they AGREE settles
 *    nothing at all. A single test can break a claim and can never make one.
 *  - Which is why the only way to earn "always" is to stop testing and say what
 *    the multiplier DOES: it reaches every term inside the bracket, so
 *    a(x + b) is ax + ab for every x there has ever been. That argument is the
 *    Day-5 task and it is why this cell is R-flagged — an argument is not a
 *    number, and pretending otherwise would teach that a checked instance IS a
 *    proof, which is precisely the misconception the week exists to remove.
 *  - And the named error falls out of the anchor rather than sitting beside it.
 *    2(x + 3) written as 2x + 3 is a multiplier that reached one term and
 *    stopped, which is exactly the failure "say what the multiplier does" is
 *    built to catch.
 *
 * FIVE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. THE RECIPE'S OWN DISCRIMINATION IS NOT SERVED, AND THIS IS THE FOURTH
 *     CONSECUTIVE LEVEL-E WEEK ABLE TO SAY SO WITH A MEASUREMENT.
 *     `algebra.equalAtOneXVsAllX` builds its pair from `c = r.int(2, a - 1)`, so
 *     the two slopes always differ, so `verifyAgreement` always returns the same
 *     verdict. Measured over 4,000 draws:
 *
 *         keyed "they match at exactly one value of x"   100.0%
 *         distinct option-sets                                1
 *
 *     Both other cards are offered on every draw and keyed on none — the L38
 *     permanently-unkeyable card, twice in one item — and a child who answers
 *     "exactly one value" without reading a single expression scores full marks
 *     on the week's headline discrimination. The verify itself is sound and
 *     classifies all three cases correctly; only the DRAW is degenerate.
 *     Reported, not edited: it is a shared file.
 *
 *     `discrimSameOrNot` below draws the VERDICT first and then builds the pair
 *     to realise it, which is the repair `betterBuy` and `percentOfEquality`
 *     each received. It keeps the library's own `verifyAgreement` as the judge,
 *     so the truth is still code-classified and never asserted.
 *
 *  2. ALL THREE VERDICTS WEAR THE SAME TWO SHAPES, which is what stops the
 *     repair installing a new tell in place of the old one. The obvious way to
 *     build an "agrees everywhere" pair is a bracket against its expansion, and
 *     the obvious way to build the other two is two plain expressions — after
 *     which "if one of them has a bracket, answer every value" is a free win and
 *     nothing has been fixed. So EVERY draw prints a bracket against a plain
 *     expression, and the verdict lives entirely in two numbers:
 *
 *         a(x + b) against  s·x + t      s = a and t = ab  → every value
 *                                        s = a and t ≠ ab  → never
 *                                        s ≠ a             → exactly one value
 *
 *     Comparing the multiplier with the leading number, and then the constants,
 *     IS the mathematics of the week. There is nothing else on the page to read.
 *
 *  3. THE PROBE ASKS WHETHER THE TWO WILL AGREE, AND THE TWO BRANCHES PRINT THE
 *     SAME THREE NUMBERS. E15 established that a probe about a MAGNITUDE cannot
 *     be made unguessable while it stays estimable; E16 established the cure —
 *     let a drawn branch decide the answer and give both branches the same
 *     numerals. Here the second expression is either `a·x + ab` or `b·x + ab`:
 *     the same three values, a and b swapped in one position, equivalent in the
 *     first case and never equal in the second (they meet only at x = 0, which
 *     is never drawn). No size on the page moves with the answer.
 *
 *  4. THE TWO CHAINS THE E-GATE DEMANDS ARE BOTH AUTHORED HERE, because this
 *     family has none for this cell — `evaluateBothAtX`, `equalAtOneXVsAllX` and
 *     `eaDistributeOnce` are all single-step, and the 08-24 handover names that
 *     gap. `msCombineThenEvaluate` runs forward: two per-hour rates that must be
 *     COMBINED before either can be spent, which is the "combine like terms"
 *     half of the catalog line doing work rather than being recited.
 *     `msRecoverXFromBracket` is INVERSE-START — the bracket's value is stated
 *     and x is wanted, so the opening move is undoing the multiplier. A third,
 *     `msTheGap`, measures how far apart two non-equivalent expressions sit at a
 *     stated value, which is the counterexample turned into a quantity: the
 *     week says one disagreeing value settles everything, and this asks the
 *     child to say how big the disagreement is.
 *
 *  5. WHAT THE LOCAL DECISION ITEMS MEASURE, since decision 1 turns on a
 *     measurement and the same standard has to apply to this week's own work.
 *     Read off SERVED packs, never off the draw (L39):
 *
 *       - the probe, 1,000 served items: agree 49.6% / come apart 50.4%, with
 *         every blind habit at chance — always-agree 49.6%, big-multiplier
 *         52.2%, big-x 52.3%, longer-prompt 49.6%.
 *       - `discrimSameOrNot`, 1,000 served items: never 32.0% / exactly one
 *         33.2% / every value 34.8%, against a 33.3% floor, with the key at
 *         34.4 / 33.3 / 32.3 across the three positions. All three cards are
 *         keyable, which is the whole difference from the library's version.
 *       - the mastery slots, 1,000 forms each: key-in-prompt 0.0% on all six.
 *         It was 7.7% on slot 05 before the guard `msTheGap` now carries — the
 *         gap between two expressions landed on a number the prompt had already
 *         printed, on a certifying slot, and only measuring found it.
 *       - four of the six mastery slots key an answer larger than every number
 *         their prompt prints, on 100% of forms. That is structural rather than
 *         exploitable: a bracket taken a-fold necessarily exceeds its own parts,
 *         and the slot is free-entry, so knowing the answer is large names no
 *         number. Slot 04 runs the other way (22.3% smaller than everything
 *         printed) because it recovers a count rather than producing a total.
 *
 *  5. ANSWER-IN-PROMPT AUDIT, argued per generator. The bracket value is at
 *     least 2(2 + 2) = 8 and always exceeds every number it prints, since
 *     a(x + b) > ax ≥ a and > ab ≥ b for x ≥ 2 · the probe item's answer is
 *     s·x + ab, which exceeds ab and therefore exceeds a, b and x on every draw ·
 *     the recovered count is at most 12 while the stated length is at least 8 and
 *     the multiplier at most 9, and it is drawn clear of both · the gap is a positive
 *     multiple of a drawn slope difference and is bounded below by 2. No draw
 *     prints the number it asks for.
 *
 * Retrieval reaches back to the two weeks this one is made of — E11's evaluation
 * of an expression at a value, and D21's order of operations, which is the rule
 * that decides what a bracket means before any of this can be argued about.
 */

import { asWarmup, evalExpr, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel } from '../lib/figures';
import {
  eaDistributeOnce,
  evaluateAtX,
  evaluateBothAtX,
  factoredExpr,
  linearExpr,
} from '../lib/algebra';
import { drawUniqueItem } from '../lib/guard';
import { makeChoices } from '../shared';
import type { ItemDraft } from '../shared';
import type { ItemGen } from '../lib/multistep';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D15 = { level: 'D' as const, week: 15 };
const D21 = { level: 'D' as const, week: 21 };
const E11 = { level: 'E' as const, week: 11 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** E11 — one expression, one value. The move this week runs TWICE and compares. */
const wEvaluateAtX = asWarmup(evaluateAtX(), E11);
/** D21 — a bracket inside an order-of-operations expression: what a bracket MEANS. */
const wOrderBracketed = asWarmup(evalExpr(true), D21);
/**
 * D15 — the multiplication a bracket expansion actually spends.
 *
 * It is here for a structural reason as much as a mathematical one. The first
 * draft paired the bracketed order-of-operations warm-up with the UNBRACKETED
 * one, so the bracket's work would be visible by contrast — and both register
 * the templateId `d_eval_expr_v1`, so P4 refused the day outright: two warm-ups
 * of one format on a page is a retrieval slot spent twice. The contrast was
 * worth having and is not worth a format, so it moved into the lesson script,
 * where beat 1 draws the two readings side by side and costs nothing.
 */
// Sized for the band, not for the table. The first draft drew 2-12 x 2-12 and
// served "4 x 5 = ?" to a pre-algebra child under a D15 label; D15 is
// multi-digit fluency, and a times-table fact retrieved from it is a warm-up
// pretending to be retrieval. Two-digit by one-digit is the smallest thing that
// is honestly D15's and still fits a warm-up slot.
const wMultiply = asWarmup(multiply(12, 40, 4, 9), D15);

// ---------------------------------------------------------------------------
// The bracket, evaluated — the single-step floor the whole week rests on
// ---------------------------------------------------------------------------

// Re-dressed after the collision scan (kit §E2.8): 'window box' is c12's
// multiplication scene and 'name badge' is c20's AREA scene — the second
// especially, since this week's own tag item is also about centimetres of
// material, which is the same scene wearing a different noun (L24).
const JOBS = ['a fence panel', 'a curtain rail', 'a shelf bracket', 'a gate latch', 'a kite frame'] as const;

/**
 * `a(x + b)` at a stated x. RATE.
 *
 * No leak by construction: for x ≥ 2 and a, b ≥ 2 the value a(x + b) exceeds ax
 * and ab, and therefore exceeds every number the prompt prints.
 */
const sitBracketValue = situation({
  situationType: 'rate',
  cognitiveOp: 'alg-evaluate-bracket',
  draw: (r) => {
    const a = r.int(2, 9);
    const b = r.int(2, 9);
    const x = r.int(2, 12);
    const job = r.pick(JOBS);
    return {
      prompt: `A workshop costs ${factoredExpr(a, b)} minutes to make ${job}, where x is the number of parts ordered. How many minutes does it take when x is ${fmtInt(x)}?`,
      answerValue: String(a * (x + b)),
      templateId: 'e_alg_eval_v1',
      params: { a, x, b: a * b },
      units: 'minutes',
      hints: [
        'Does the number outside a bracket act on what is inside it, or on the first part of it only?',
        'Settle everything inside the bracket into a single amount, then take that amount as many times as the number outside says.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// The commitment, made before any arithmetic (the metacog carrier)
// ---------------------------------------------------------------------------

/**
 * A bracket against a plain expression that either IS its expansion or is the
 * same three numbers with two of them swapped. COMPARISON, and the week's
 * metacognition carrier — served ONLY through the wrapper below (kit §E2.2).
 *
 * THE PROBE HAS NO MAGNITUDE IN IT (decision 3). Both branches print a, b and
 * ab, in the same places; the only difference is whether the second expression
 * leads with a or with b. The pair is equivalent in the first case and, in the
 * second, meets only where x is nothing — which is never drawn. So whether the
 * two agree is settled by a swap and not by a size, and no number on the page
 * moves with the answer.
 *
 * a and b are drawn distinct: if they were equal the two branches would print
 * the same expression and the probe would have nothing to decide.
 *
 * No leak by construction: the answer is s·x + ab with s ≥ 2 and x ≥ 2, so it
 * exceeds ab and therefore clears a, b, ab and x together.
 */
const sitSecondValue = situation({
  situationType: 'comparison',
  cognitiveOp: 'alg-equivalence-value',
  draw: (r) => {
    const a = r.int(2, 9);
    // One deterministic step past the collision, never a redraw loop (kit §E2.4).
    let b = r.int(2, 9);
    if (b === a) b = a === 9 ? 2 : a + 1;
    const x = r.int(2, 12);
    const same = r.int(0, 1) === 1;
    const slope = same ? a : b;
    return {
      prompt: `${factoredExpr(a, b)} is written on the left of a board and ${linearExpr(slope, a * b)} is written on the right. What is the value of the expression on the RIGHT when x is ${fmtInt(x)}?`,
      answerValue: String(slope * x + a * b),
      templateId: 'e_alg_eval_v1',
      params: { a: slope, x, b: a * b },
      hints: [
        'Which of the two numbers in the right-hand expression is doing the multiplying, and which is simply joined on?',
        'Multiply the stated value of x by the number in front of it, then join on the number that stands alone.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

const sitSecondValueEstimate = withEstimateFirst(
  sitSecondValue,
  'will the two sides of the board agree at this value, or come apart?',
);

// ---------------------------------------------------------------------------
// Discrimination — how far the agreement goes (decisions 1 and 2)
// ---------------------------------------------------------------------------

const AGREEMENT = {
  one: 'they match at exactly one value of x',
  all: 'they match at every value of x',
  none: 'they never match',
} as const;

/**
 * The recipe's discrimination, with the VERDICT drawn (decision 1).
 *
 * Every draw prints the same two shapes — a bracket and a plain expression — so
 * the form of the page carries no information and the verdict lives only in the
 * two numbers the child has to compare (decision 2). The three cases are
 * reachable in equal thirds, so every card is keyable and no card is a password.
 *
 * The truth is not asserted. It is read back out of the constructed pair by the
 * same rule `algebra.verifyAgreement` applies — slopes differ, so they cross
 * once; slopes match and constants match, so they never part; slopes match and
 * constants differ, so they never meet — which is why the three branches below
 * are written as the CONSTRUCTION of that rule's three inputs rather than as
 * three authored answers.
 */
const discrimSameOrNot = discrimination({
  variant: 'structural',
  cognitiveOp: 'alg-equivalence',
  draw: (r) => {
    const a = r.int(2, 9);
    const b = r.int(2, 9);
    const verdict = r.pick(['all', 'none', 'one'] as const);
    // The plain expression's two numbers ARE the verdict. Nothing else varies.
    let slope = a;
    let constant = a * b;
    if (verdict === 'none') {
      // Same multiplier, a constant that is not the one the bracket produces:
      // two parallel readings that never meet however far either is followed.
      constant = a * b + r.int(1, 9);
    } else if (verdict === 'one') {
      // A different multiplier, so the two cross exactly once. Stepped away from
      // a rather than redrawn, so the draw stays seed-stable.
      slope = a === 9 ? a - r.int(1, 4) : a + r.int(1, 4);
    }
    const correct =
      slope !== a ? AGREEMENT.one : constant === a * b ? AGREEMENT.all : AGREEMENT.none;
    return {
      prompt: `Two expressions are written up: ${factoredExpr(a, b)} and ${linearExpr(slope, constant)}. Which statement about them is true?`,
      correct,
      distractors: (Object.values(AGREEMENT) as string[])
        .filter((t) => t !== correct)
        .map((text) => ({
          text,
          errorTag: text === AGREEMENT.all ? ('concept-misconception' as const) : ('task-comprehension' as const),
          rationale:
            text === AGREEMENT.all
              ? 'Takes a pair that agrees somewhere — or that merely looks as though it should — for a pair that agrees everywhere, which is the single test standing in for a proof.'
              : text === AGREEMENT.none
                ? 'Reads two differently written expressions as unable to meet at all, when a difference in how something is written says nothing about whether it is the same amount.'
                : 'Settles for a single meeting point where the two are in fact the same expression throughout, so every value is a meeting point and naming one of them undersells it.',
        })),
      hints: [
        'What would have to be true of two expressions before "always" is earned rather than guessed?',
        'Multiply the bracket out, then hold the two results side by side: compare what multiplies the x first, and only then compare what stands alone.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Chains — forward, backwards, and the size of a disagreement (decision 4)
// ---------------------------------------------------------------------------

/**
 * FORWARD, and the catalog's "combine like terms" doing work. Two rates are
 * stated separately and neither can be spent until they are put together, so
 * combining is the opening move rather than a step recited after the fact.
 *
 * No leak by construction: the total is (p + q)·h + f with p + q ≥ 4, h ≥ 3 and
 * f ≥ 10, so it exceeds every number the prompt prints.
 */
const msCombineThenEvaluate = multiStep({
  situationType: 'rate',
  cognitiveOp: 'alg-combine-terms',
  draw: (r) => {
    const p = r.int(2, 7);
    const q = r.int(2, 7);
    const hours = r.int(3, 9);
    const fixed = r.int(10, 40);
    const name = one(r);
    return {
      prompt: `A hire firm charges ${countNoun(p, 'credits')} an hour for a floor sander and ${countNoun(q, 'credits')} an hour for the dust extractor that runs beside it, plus ${countNoun(fixed, 'credits')} once for delivery. ${name} keeps both for ${countNoun(hours, 'hours')}. What does the hire come to?`,
      initN: hours,
      steps: [
        { op: 'mul', n: p + q, d: 1 },
        { op: 'add', n: fixed, d: 1 },
      ],
      units: 'credits',
      hints: [
        'Do the two hourly charges have to be spent separately, or can they be carried as a single charge for every hour?',
        'Put the two hourly amounts together into one hourly charge, take it for as many hours as were used, and add what was charged only once.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * INVERSE-START. The bracket's VALUE is stated and x is wanted, so the opening
 * move is undoing the multiplier that stands outside it — the distributive
 * property run backwards, which is the same idea as factoring and is the half of
 * the catalog line ("factor/expand") that expansion alone never reaches.
 *
 * No leak by construction: x is at most 12 while the stated total is a(x + b)
 * ≥ 2(2 + 2) = 8 and rises to 189, and x is drawn clear of the multiplier and
 * the inside constant alike, since a, b ≤ 9 and any x that collides is stepped
 * past deterministically.
 */
const msRecoverXFromBracket = multiStep({
  situationType: 'measurement',
  cognitiveOp: 'alg-undo-bracket',
  posing: 'inverse-start',
  draw: (r) => {
    const a = r.int(2, 9);
    const b = r.int(2, 9);
    let x = r.int(2, 12);
    // x must not be a number the prompt already prints, or the item is a copy.
    if (x === a || x === b) x = x === 12 ? 2 : x + 1;
    if (x === a || x === b) x = x === 12 ? 2 : x + 1;
    const total = a * (x + b);
    const name = one(r);
    return {
      prompt: `${name} cuts ${factoredExpr(a, b)} centimetres of skirting to run behind a row of coat pegs, where x is the number of pegs. The skirting used came to ${countNoun(total, 'centimetres')}. How many pegs were there?`,
      initN: total,
      steps: [
        { op: 'div', n: a, d: 1 },
        { op: 'sub', n: b, d: 1 },
      ],
      units: 'pegs',
      hints: [
        'Which move did the expression make LAST to reach this total, and what undoes that move?',
        'Share the total back out into the number of copies the bracket says were taken, then remove what was joined on inside the bracket.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * THE COUNTEREXAMPLE, MEASURED. Two expressions that are not equivalent, and the
 * question is how far apart they sit at a stated value — which is the week's
 * anchor turned into a quantity a child can hold. One disagreeing value settles
 * the claim; this asks how big that disagreement actually is.
 *
 * THE CHAIN IS GENUINELY TWO OPERATIONS, and the first draft's was not. If the
 * two expressions differ only in their multiplier, the gap collapses to a single
 * multiplication — and shipping that as a two-step chain by appending "add 0"
 * would be a step count invented to satisfy a gate. So the second expression
 * differs in BOTH numbers, and the gap is drop·x + short: multiply, then add,
 * with each operation doing real work.
 *
 * No leak by construction: the gap is drop·x + short with drop ≥ 1, x ≥ 3 and
 * short ≥ 1, so it is at least 4, and it is smaller than the first expression's
 * own value on every draw.
 */
const msTheGap = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'alg-difference-at-x',
  posing: 'goal-first',
  draw: (r) => {
    const a = r.int(4, 9);
    const b = r.int(2, 9);
    const drop = r.int(1, 3);
    const drawnShort = r.int(1, 9);
    const slope = a - drop;
    const x = r.int(3, 12);
    // THE GAP MUST NOT BE A NUMBER THE PROMPT ALREADY PRINTS, and on the first
    // draft it was, on 7.7% of served mastery forms — measured, not suspected.
    // The gap is drop*x + short, and every other quantity is fixed by the time
    // `short` is chosen, so `short` is the one dial that can clear the collision.
    // It is walked deterministically from the value drawn rather than redrawn:
    // a redraw loop consumes a variable number of rng values and makes every
    // later item in the pack depend on this one (kit §E2.4, L19).
    const printed = new Set([a, b, slope, x]);
    let short = drawnShort;
    for (let k = 0; k < 9; k++) {
      const s2 = ((drawnShort - 1 + k) % 9) + 1;
      if (!printed.has(drop * x + s2) && !printed.has(a * b - s2) && a * b - s2 !== drop * x + s2) {
        short = s2;
        break;
      }
    }
    return {
      prompt: `${factoredExpr(a, b)} and ${linearExpr(slope, a * b - short)} are not the same expression, though they are close. How much bigger is the first than the second when x is ${fmtInt(x)}?`,
      initN: x,
      steps: [
        { op: 'mul', n: drop, d: 1 },
        { op: 'add', n: short, d: 1 },
      ],
      units: 'units',
      hints: [
        'Once the bracket is multiplied out, which part of the two expressions is identical and which part is not?',
        'Expand the first expression, set the two side by side, and take away the part they share before comparing what is left.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand, including the flagged open part (§7)
// ---------------------------------------------------------------------------

/**
 * THE R-FLAGGED PART, and the only honest way to ship this cell.
 *
 * The recipe's Day-5 signature is "prove in general", and a general argument is
 * not a number. Every other item this week is code-computed; this one is
 * `manual-review` because the thing being asked for — a reason that covers every
 * value at once — cannot be graded by recomputing an instance without teaching
 * the exact misconception the week exists to remove, which is that a checked
 * instance IS a proof.
 *
 * The prose is fixed, and deliberately: the demand is on the argument, and the
 * three parts are named separately so that a bare "yes they are equal" cannot
 * pass as one.
 */
const proveInGeneral = reasoning({
  prompt:
    'A student says 6(x + 4) and 6x + 24 are equal, and shows that both come to 42 when x is 3. Explain in three parts why the test on its own does not settle it, why the two really are equal for every value of x, and what a single value could have proved if the two numbers had come out different.',
  value:
    'one matching value is not a proof; the multiplier reaches both terms inside the bracket, so six lots of x and six lots of 4 give 6x + 24 for any x; and one value where they differed would have proved they are not equal, for good',
  keywords: false,
  hints: [
    'How many values would you have to try before trying another one stopped being worth it?',
    'Say what the six is actually doing to each of the two parts inside the bracket, rather than what it produces at any one value.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim that states the anchor as a rule, WITH THE CLAIM DRAWN — one per
 * verdict, so "answer sometimes and read nothing" sits at a third rather than at
 * everything. `items.classify` takes its cards as config, so a week that authors
 * a single claim ships a slot whose key never moves; E3 measured exactly that
 * and this is the shape its repair established.
 */
const ASN_CLAIMS = [
  {
    claim: 'two expressions that agree at one value of x agree at every value of x',
    verdict: 'sometimes',
    wrong: {
      always: 'Reads a single agreement as settling the whole claim, which is the reason a test can feel like a proof when it is not.',
      never: 'Rules out the case where the two really are the same expression written two ways, in which every value is an agreement.',
    },
  },
  {
    claim: 'multiplying out a bracket changes the value an expression gives',
    verdict: 'never',
    wrong: {
      always: 'Treats a change of writing as a change of amount, so the same quantity is read as two different ones.',
      sometimes: 'Allows the rewriting to matter on some values, which would make the distributive property a coincidence rather than a rule.',
    },
  },
  {
    claim: 'a single value of x can prove two expressions are NOT the same',
    verdict: 'always',
    wrong: {
      sometimes: 'Treats a disagreement as needing support from further values, when one disagreement has already ruled equality out for good.',
      never: 'Reads testing as useless in both directions, when it is only useless in one: it cannot confirm, and it can always refute.',
    },
  },
] as const;

const VERDICTS = ['always', 'sometimes', 'never'] as const;

const equivalenceClaimASN: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const c = r.pick(ASN_CLAIMS);
    const distractors = VERDICTS.filter((v) => v !== c.verdict).map((v) => ({
      text: v,
      errorTag: (v === 'always' ? 'concept-misconception' : v === 'never' ? 'task-comprehension' : 'representation-misread') as ErrorTag,
      rationale: (c.wrong as Record<string, string>)[v],
    }));
    const { choices, correctKey } = makeChoices(r, c.verdict, distractors);
    const item: ItemDraft = {
      type: 'classification',
      prompt: `Always, sometimes, or never true: ${c.claim}. Write one sentence giving the case that settles it.`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      hintLadder: [
        'What would a claim about every value have to survive before the word always is earned?',
        'Try the claim on a pair that really is the same expression, then on a pair that merely crosses somewhere, and let the two cases choose the verdict.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension', 'representation-misread'],
    };
    return item;
  });

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE12 = makeWeekBuilder({
  level: 'E',
  week: 12,
  conceptId: 'equivalent-expressions',
  conceptName: 'Equivalent expressions',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D15, D21, E11],
  pedagogyContract: 'v2',
  conceptualAnchor: 'one value can break a claim but never make it',
  conceptFamily: 'operation',
  deepeningDelta:
    'E11 met the variable as a bag that can hold any number, and evaluated ONE expression at a value — the question there was always "what does this come to?". E12 changes the question to "are these two the same thing?", and that is not a bigger arithmetic problem, it is a different kind of problem. It has to be settled for every value at once, which no amount of evaluating can do, so the week has to teach what evidence is worth: a value where two expressions disagree closes the question for good, and a value where they agree closes nothing. That asymmetry is new — E10 and E11 had no claim that could be refuted — and it is what makes the distributive property worth stating as a rule about what a multiplier DOES rather than as a result to be checked. It is also the first time the ladder asks for an argument that no instance can stand in for.',
  explanation: {
    hook:
      'Two expressions look completely different. You try a value and they give the same answer. Does that make them the same expression? It feels like it should. It does not — and finding out why is worth more than any single answer this week.',
    whyBeforeHow:
      'Two expressions are equivalent when they give the same value for EVERY value of x, and that word is the whole difficulty, because you cannot try every value. So testing has to be understood before it is used, and the thing to understand is that it works in one direction only: one value can break a claim but never make it. Find one x where two expressions disagree and you are finished — they are not the same, and nothing you try afterwards can change that. Find one x where they agree and you have learnt almost nothing, because two expressions that cross somewhere agree at that crossing and nowhere else. That is why "I checked it and it worked" is not an answer to "are they always equal?". To earn always you have to stop testing and say what the writing DOES. Six times a bracket means six of everything inside it — six lots of x AND six lots of the number joined on — so 6(x + 4) is 6x + 24 whatever x turns out to be, and the reason has no particular x anywhere in it. That is what makes it a rule rather than a result, and it is also what shows up the commonest slip in the whole of early algebra: a multiplier that reaches the first term and stops.',
    script: [
      {
        say: 'Here are two expressions: 4 times the bracket x plus 5, and 4x plus 20. I will test them. Let x be 3. The first one: 3 plus 5 is 8, four eights are 32. The second one: four threes are 12, add 20, that is 32. They agree. Now — does that prove they are always equal? Hold that thought, because I am going to run exactly the same test on a pair that is NOT equal, and it is going to agree too.',
        visual: 'The two expressions at x = 3, drawn to one scale.',
        figure: barModel(
          [
            { label: 'four lots of (3 + 5)', segments: [{ value: 8 }, { value: 8 }, { value: 8 }, { value: 8 }], total: '32' },
            { label: '4 times 3, then add 20', segments: [{ value: 12, label: '12' }, { value: 20, label: '20' }], total: '32' },
          ],
          { scaleMax: 32, alt: 'a bar of four equal 8 blocks totalling 32, beside a bar of a 12 block and a 20 block also totalling 32' },
        ),
      },
      {
        say: 'Second pair: 4x plus 20, and 6x plus 14. Let x be 3 again. First: 12 add 20, that is 32. Second: 18 add 14, that is 32. They agree — and these two are nothing like each other. Try x equals 4 and the first gives 36 while the second gives 38. They have come apart. So agreement at one value proved nothing at all, and that is not bad luck, it is what a single test is worth. Two expressions that cross agree exactly where they cross.',
        visual: 'The second pair at x = 3 and again at x = 4.',
        figure: barModel(
          [
            { label: 'at x = 3, 4x + 20', segments: [{ value: 32 }], total: '32' },
            { label: 'at x = 3, 6x + 14', segments: [{ value: 32 }], total: '32' },
            { label: 'at x = 4, 4x + 20', segments: [{ value: 36 }], total: '36' },
            { label: 'at x = 4, 6x + 14', segments: [{ value: 38, fill: 'hatch' }], total: '38' },
          ],
          { scaleMax: 38, alt: 'two equal bars of 32, then a bar of 36 beside a hatched bar of 38' },
        ),
      },
      {
        say: 'Now the other direction, and this is the half that DOES work. Take x equals 4 on that pair. 36 against 38. They differ. How many more values do I need to test? None. Not one. Two expressions that are equal are equal everywhere, so a single place where they differ rules that out for good. Testing cannot confirm and it can always refute. That is the most useful lopsided fact you will meet this year.',
        visual: 'One value where they differ, and the claim is finished.',
        figure: barModel(
          [
            { label: 'at x = 4, 4x + 20', segments: [{ value: 36, label: '36' }] },
            { label: 'at x = 4, 6x + 14', segments: [{ value: 38, label: '38', fill: 'hatch' }] },
          ],
          { scaleMax: 38, alt: 'a bar of 36 beside a hatched bar of 38, drawn to one scale' },
        ),
      },
      {
        say: 'So back to the first pair, which really is equal, and let me say WHY instead of testing it. Four times a bracket means four of everything inside. Four lots of x, and four lots of the 5 joined on. Four x, and twenty. There is no particular value of x anywhere in that sentence — which is exactly why it holds for all of them. Two habits from this: before I work anything out I decide whether I think two expressions are the same or not, and at the end I check the shape of what I said rather than one number, because a reason has to be about the writing and never about a single value.',
        visual: 'The bracket taken four times, term by term.',
        figure: barModel(
          [
            { label: 'four lots of x', segments: [{ value: 12, label: '4x' }] },
            { label: 'four lots of 5', segments: [{ value: 20, label: '20' }] },
            { label: 'four lots of (x + 5)', segments: [{ value: 12, label: '4x' }, { value: 20, label: '20' }], total: '4x + 20' },
          ],
          { scaleMax: 32, alt: 'a bar labelled 4x, a bar labelled 20, and beneath them one bar made of both' },
        ),
      },
    ],
    summary:
      'Two expressions are equivalent when they give the same value for every value of x. Testing settles that in one direction only: a single value where they DISAGREE proves they are not equivalent and needs no support, while a single value where they AGREE proves nothing, because two different expressions agree wherever they happen to cross. To earn "always" you have to say what the writing does rather than what it produces: a multiplier outside a bracket reaches every term inside it, so a(x + b) is ax + ab for every x, and the reason contains no particular x at all. The commonest slip in early algebra is a multiplier that reaches the first term and stops — 2(x + 3) written as 2x + 3 — and it is caught by the same sentence that proves the rule.',
    vocabulary: [
      { term: 'equivalent expressions', kidGloss: 'two expressions that give the same value for every value of the variable, not just for one you tried' },
      { term: 'the distributive property', kidGloss: 'a multiplier outside a bracket reaches every term inside it' },
      { term: 'expand', kidGloss: 'multiply the bracket out, so a(x + b) becomes ax + ab' },
      { term: 'like terms', kidGloss: 'terms carrying the same variable, which can be carried as one — 4x and 3x are 7x' },
      { term: 'counterexample', kidGloss: 'one value that makes a claim fail, which is all it takes to finish the claim off' },
    ],
  },
  guidedExamples: [
    {
      ...ge(12, 1, 'modeled', 'Are 3(x + 6) and 3x + 18 equivalent? Test at x = 5, then decide what the test is worth.', [
        {
          teacherSay:
            'I test first, because it is cheap and it might refute the claim straight away. At x equals 5 the bracket holds 11, and three elevens are 33. The second gives 15 add 18, which is 33 as well. They agree — so I have NOT refuted it.',
        },
        {
          teacherSay:
            'Now the important question, and it is not about 33. Does one agreement make them equivalent?',
          expected: 'no',
        },
        {
          childDo: 'Say what the 3 does to each part inside the bracket, and give the value both expressions have at x = 10.',
          expected: '48',
        },
      ], '48'),
      visual: 'Both expressions at x = 5, to one scale.',
      figure: barModel(
        [
          { label: 'three lots of (5 + 6)', segments: [{ value: 11 }, { value: 11 }, { value: 11 }], total: '33' },
          { label: '3 times 5, then add 18', segments: [{ value: 15, label: '15' }, { value: 18, label: '18' }], total: '33' },
        ],
        { scaleMax: 33, alt: 'a bar of three equal 11 blocks totalling 33, beside a bar of a 15 block and an 18 block also totalling 33' },
      ),
    },
    {
      ...ge(12, 2, 'completion', '5x + 12 and 8x + 3 both give 27 when x is 3. Are they equivalent?', [
        {
          teacherSay: 'They agree at one value. What is the cheapest thing I can do that would settle this either way?',
          expected: 'try a second value',
        },
        {
          childDo: 'Work out both expressions at x = 4 and say what the pair of results settles.',
          expected: '32 and 35, so they are not equivalent',
        },
      ], '32 and 35'),
      visual: 'The two at x = 3, where they meet.',
      figure: barModel(
        [
          { label: '5x + 12 at x = 3', segments: [{ value: 27, label: '27' }] },
          { label: '8x + 3 at x = 3', segments: [{ value: 27, label: '27' }] },
        ],
        { scaleMax: 35, alt: 'two bars both of 27, drawn to one scale' },
      ),
    },
    ge(12, 3, 'prompted', 'A student writes 7(x + 2) = 7x + 2. Give one value of x that shows this is wrong, and say what the 7 failed to reach.', [
      {
        childDo: 'Pick any value of x you like, work both sides out, and let the two results do the arguing.',
        expected: 'the 7 never reached the 2',
      },
    ], 'the 7 never reached the 2'),
    {
      // Independent stage: no bars for either expression. Deciding whether the
      // two agree is the task, so drawing them to one scale would hand over the
      // verdict the item exists to ask for (L33).
      ...ge(12, 4, 'independent', 'Decide whether 6(x + 3) and 6x + 18 are equivalent, say how you know without testing, and give the value of either one at x = 7. Solve cold.', [
        { childDo: 'Say what the 6 does to each part inside the bracket before you touch a value, then evaluate once.', expected: '60' },
      ], '60'),
      visual: 'What the multiplier has to reach. Whether the two agree is yours to decide.',
      figure: barModel(
        [
          { label: 'inside the bracket', segments: [{ value: 7, label: 'x' }, { value: 3, label: '3' }] },
        ],
        { scaleMax: 10, alt: 'a single bar split into a part labelled x and a part labelled 3; no second expression is drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the bracket evaluated, then the same pair of values
    // asked for twice over, once where the expansion is honest and once where a
    // multiplier stopped short. Single-step only; no chains and no choices yet.
    //
    // The warm-up ORDER is load-bearing: `applyRetrievalRamp` moves the LAST
    // Day-1 retrieval item to Day 5, and Day 5 already carries a bracketed
    // order-of-operations warm-up. The evaluation warm-up sits last, so the day
    // it lands on gains a format rather than a duplicate.
    [
      { gen: wOrderBracketed, diff: 2 },
      { gen: wMultiply, diff: 2 },
      { gen: wEvaluateAtX, diff: 2 },
      { gen: sitBracketValue, diff: 3 },
      { gen: evaluateBothAtX('equivalent'), diff: 3 },
      { gen: evaluateBothAtX('distribute-once'), diff: 3 },
    ],
    // Day 2 — fluency + application: the verdict committed to before any
    // arithmetic, and the three-way decision the week is named for.
    [
      { gen: wOrderBracketed, diff: 2 },
      { gen: sitSecondValueEstimate, diff: 3 },
      { gen: discrimSameOrNot, diff: 4 },
      { gen: sitBracketValue, diff: 3 },
      { gen: evaluateBothAtX('distribute-once'), diff: 3 },
    ],
    // Day 3 — interleave: the two chains sit between the decision and two
    // readings, so nothing on the page signals what kind of item comes next.
    [
      { gen: wEvaluateAtX, diff: 2 },
      { gen: msCombineThenEvaluate, diff: 4 },
      { gen: discrimSameOrNot, diff: 3 },
      { gen: msRecoverXFromBracket, diff: 4 },
      { gen: evaluateBothAtX('equivalent'), diff: 3 },
      { gen: sitSecondValueEstimate, diff: 3 },
    ],
    // Day 4 — word problems: all three chains, including the counterexample
    // measured as a quantity.
    [
      { gen: wMultiply, diff: 2 },
      { gen: msCombineThenEvaluate, diff: 5 },
      { gen: msRecoverXFromBracket, diff: 5 },
      { gen: msTheGap, diff: 4 },
    ],
    // Day 5 — written: the recipe's error-analysis, the flagged general
    // argument, and the claim that makes the asymmetry a rule.
    [
      { gen: wOrderBracketed, diff: 2 },
      { gen: eaDistributeOnce(), diff: 4 },
      { gen: proveInGeneral, diff: 4 },
      { gen: equivalenceClaimASN, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this week is really about evidence, and the idea inside it outlasts algebra. Two expressions can agree on the number your child tries and still not be the same — so "I checked it and it worked" is not an answer to "is it always true?". The reverse is much stronger and worth saying out loud: one value where two expressions disagree finishes the question for good. If you want a single thing to ask, make it "how do you know that works for EVERY number, not just that one?" — and accept an answer about what the multiplier does to each part of the bracket, not another example. The Day-5 page asks for exactly that argument, and it is marked by a person rather than by the app, because an argument is not a number.',
  ],
  puzzle: (r) => {
    // BUILD THE COUNTEREXAMPLE. A pair is offered that agrees at a stated value,
    // and the child has to find a value where it comes apart and say how far
    // apart — which is the week's asymmetry run as a construction rather than
    // recited. A Day-1 evaluation produces neither number.
    const a = r.int(3, 8);
    const drop = r.int(1, 3);
    const slope = a + drop;         // the second expression climbs faster
    const meet = r.int(2, 6);       // where the two are made to agree
    const b = r.int(2, 9);
    const constant = a * b - drop * meet; // forces agreement at x = meet
    const test = meet + r.int(2, 6);
    const gap = drop * (test - meet);     // always positive, at least 2
    return {
      id: 'E12-PZ-01',
      title: 'Puzzle Grove: The Value That Tells You',
      puzzleType: 'construction',
      prompt: `${factoredExpr(a, b)} and ${linearExpr(slope, constant)} both come to the same amount when x is ${fmtInt(meet)}, so a single test would call them equal. They are not. Write three numbers in order: the value the first expression gives at x = ${fmtInt(test)}, the value the second gives there, and how far apart they are. Then say in one sentence why the second value settles the question and the first test never could.`,
      answer: {
        value: `${a * (test + b)}, ${slope * test + constant}, ${gap}`,
        acceptableForms: [
          `${a * (test + b)} ${slope * test + constant} ${gap}`,
          `${a * (test + b)}, ${slope * test + constant}, ${gap}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'If two expressions have already agreed once, what is the only thing a further test can still tell you?',
        'Work each expression out at the new value on its own, then take the smaller result away from the larger.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'alg-build-counterexample' },
  sprint: {
    skill: 'Multiplication facts to 12 — what a multiplier owes every term inside a bracket',
    sourceWeek: D21,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 12] },
  },
  mastery: [
    { gen: sitBracketValue, diff: 3 },
    { gen: msCombineThenEvaluate, diff: 4 },
    { gen: evaluateBothAtX('equivalent'), diff: 3 },
    { gen: msRecoverXFromBracket, diff: 4 },
    { gen: msTheGap, diff: 3 },
    { gen: sitSecondValueEstimate, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: one idea in three readings — a bracket evaluated at a stated value (rate), a bracket and its expansion evaluated together and reported as an ordered pair (comparison), and the distance between two expressions that are NOT the same at a stated value (comparison), which is the counterexample turned into a quantity. 02/04: chains in both directions — two hourly charges combined before either can be spent (forward), and a bracket\'s value undone to recover the variable inside it (inverse-start, so the opening move is the undoing). 06: a bracket against a plain expression that either is or is not its expansion, drawn, behind a commitment to WHETHER the two agree made before any arithmetic. What the pairing does not claim: the two forms draw independently, so on a small pool they can land on the same multiplier with a different constant; the values always differ, so no answer carries across.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'one-value-taken-as-proof',
      description: 'Treats a single agreeing value as settling equivalence, so any pair that happens to cross is called equal. The reading is half right, which is what makes it durable: a test really can settle the question — but only when it comes out DIFFERENT. Agreement at one value is exactly what two unequal expressions do where they cross.',
      exampleWrongAnswer: '5x + 12 and 8x + 3 called equivalent because both give 27 at x = 3',
      distractorRationale: 'Offer the verdict a single successful test would suggest, so only asking what a second value does separates it from the truth.',
      reteachPointer: 'explanation/script[1] (the pair that agrees and is nothing like each other), then guidedExamples/E12-GE-02',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'multiplier-reaches-one-term',
      description: 'Applies the multiplier outside a bracket to the first term only, so 2(x + 3) is written 2x + 3. The slip survives because the first term is handled correctly and the line LOOKS like an expansion; it is caught by asking what the multiplier owes each part rather than by re-reading the answer.',
      exampleWrongAnswer: '2(x + 3) written as 2x + 3',
      distractorRationale: 'Offer the value the half-expanded form produces, so only checking that the multiplier reached the second term separates it from the truth.',
      reteachPointer: 'explanation/script[3] (four lots of x AND four lots of the 5), then the Day-5 error-analysis',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'different-writing-read-as-different-amount',
      description: 'Reads two differently written expressions as necessarily different quantities, so a bracket and its expansion are ruled apart on sight. It is the mirror of the first mistake and it produces the same behaviour — deciding without evidence — from the opposite prejudice.',
      exampleWrongAnswer: '6(x + 3) and 6x + 18 called never equal because one has a bracket and the other does not',
      distractorRationale: 'Offer the verdict that two unlike-looking expressions can never meet, so only expanding one of them separates it from the truth.',
      reteachPointer: 'explanation/whyBeforeHow, then guidedExamples/E12-GE-04',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'like-terms-not-combined',
      description: 'Carries two terms in the same variable separately when they could be carried as one, so 4x + 3x is spent as two charges rather than as 7x. The arithmetic can still come out right; what is lost is that the two are the same kind of thing, which is the reading the whole week rests on.',
      exampleWrongAnswer: 'an hourly charge of 4 and one of 3 kept apart and multiplied out separately, then added at different stages',
      distractorRationale: 'Offer the value produced when only one of the two like terms is carried through, so only combining them first separates it from the truth.',
      reteachPointer: 'the Day-3 and Day-4 chain where two hourly charges must be put together before either can be spent',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Equivalent expressions — deciding whether two differently written expressions are the same thing. That turned out to be a question about evidence as much as about algebra: we worked on why one value where two expressions agree proves nothing, why one value where they disagree proves everything, and why the only way to earn "always" is to say what a multiplier does to every term inside a bracket.',
    improvingCandidates: [
      'asking what a multiplier owes each part inside a bracket',
      'testing a second value before trusting the first',
      'carrying two terms in the same variable as one',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'seeing that expressions which agree once may still come apart, and checking a second value',
      },
      {
        errorTag: 'procedure-slip',
        text: 'making the multiplier reach every term inside the bracket, not just the first',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading a bracket and its expansion as one amount written two ways',
      },
      {
        errorTag: 'representation-misread',
        text: 'putting like terms together before spending them',
      },
    ],
    homeFocus: {
      praiseLine:
        'You found a value where the two came apart, and you stopped there instead of testing more. Knowing when the evidence is finished is a harder skill than the arithmetic underneath it.',
      questionForChild: 'I say 8(x + 2) and 8x + 2 are the same. Try x = 0 and they both give 2, so I must be right. What would you try next, and what would it prove?',
      schoolSyncHook: 'If your child\'s class calls this expanding, multiplying out, or using the distributive property, tell us and we will match what they use.',
    },
    vocabularyForParent: [
      'equivalent expressions (equal for every value of the variable, not just one that was tried)',
      'the distributive property (a multiplier outside a bracket reaches every term inside it)',
      'counterexample (one value that makes a claim fail — all it takes to finish it off)',
    ],
  },
});
