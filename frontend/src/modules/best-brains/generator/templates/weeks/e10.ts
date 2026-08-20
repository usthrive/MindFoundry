/**
 * Level E · Week 10 — "Exponents & expressions" (conceptId:
 * exponents-numerical-expressions). The first G6 / `algebra.ts` week.
 *
 * FILL-ARCHITECTURE §6 row E10: anchor "repeated × vs repeated +"; key
 * multi-step "order-of-ops with exponents" AND a "grouping-required story (F5)";
 * error-analysis "3^4 = 12 (base × exponent)"; discrimination "2^3 vs 3^2";
 * Day-5 signature "insert grouping to hit a target (D21's sibling)". NOT
 * R-flagged: every item below is computable and nothing ships as manual-review
 * except the error-analysis, whose truth is code-recomputed.
 *
 * THE WEEK'S CLAIM. A power is not a new operation. It is a job the child
 * already has — multiplying — written down once instead of many times, and the
 * whole week is about what that shorthand does and does not permit:
 *  - the two numbers in a power do DIFFERENT jobs. The base says what is
 *    repeated; the exponent says how often. They are not a pair of operands the
 *    way the two numbers in 3 × 4 are, which is why 3^4 is not 12 and why 2^3 is
 *    not 3^2. That single asymmetry is the week's error-analysis and its
 *    discrimination, met from two directions;
 *  - because a power stands for a whole line of multiplication, it is settled
 *    before any multiplying or adding in the expression around it. The order of
 *    operations is not a table to memorise here — it is what the shorthand
 *    means;
 *  - and a bracket is the one thing that outranks it, because a bracket gathers
 *    loose parts into a single amount, and only a single amount can be raised.
 *    That is why the week ends where D21 ended — putting a bracket in to hit a
 *    stated target — with the power in the line this time.
 *
 * The three Level-E ceiling lifts each land on their own item, never doubled up:
 *  - INVERSE-START — `msStrandRecover`: the stated count belongs to a LATER
 *    pass, so the opening move is a division no sentence asks for, repeated as
 *    many times as the multiplication that built it;
 *  - HAS-DISTRACTOR — `msLooseAndTubes` states a count of clamps (or racks, or
 *    blocks) that the chain never spends;
 *  - ESTIMATE-FIRST — `msTwoCountersEstimate`, reachable ONLY through the
 *    wrapper (kit §E2.2), and its probe is a coin flip BY CONSTRUCTION
 *    (decision 3 below).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  1. THE SURFACE TRAP THIS TOPIC IS BUILT ON, AND WHAT EACH CARD SET DOES
 *     ABOUT IT. Exponentials grow fast, so on any "which is larger" page over
 *     powers, "pick the one with the bigger exponent" and "pick the one with
 *     the bigger base" are both readable without doing a single multiplication.
 *     Worse, on a grouping page the bracket ITSELF is readable. So:
 *       · the recipe's discrimination is the library's `powerBaseSwapTrap`,
 *         whose whole subject IS that ranking, and which the orchestrator
 *         repaired immediately before this week was written so that "they are
 *         equal" is keyed on a third of draws (2^4 = 4^2 = 16, the only
 *         non-trivial pair of positive integers with a^b = b^a). Measured over
 *         2,000 served packs, "among the two powers, take the one with the
 *         bigger exponent" keys 49.4% of its draws — because among distinct
 *         whole numbers, 2 and 3 is the ONLY pair where the bigger exponent
 *         loses. That is arithmetic, not a pool choice, and the item is served
 *         ONCE all week rather than twice because of it. Reported upward with
 *         the one repair that would work (weight the draw so the equal pair,
 *         the 2-and-3 pair and the rest each take a third, which lands the
 *         strategy on chance);
 *       · the recipe's Day-5 grouping item is the week's OWN
 *         `discrimBracketPlace`, not the library's `groupingToTarget`, and the
 *         reason is a 100.0% tell measured in the library generator — see the
 *         SHARED-FILE FINDING below and the comment on BRACKET_CASES. Every
 *         readable surface on the local one measures between 31.8% and 34.6%
 *         against a chance of 33.3%;
 *       · the always/sometimes/never item keys three FIXED verdict words and
 *         draws which claim is asked, so no verdict is offered more often than
 *         it is keyed (the L38 repair E3 earned and E5 inherited): measured
 *         34.8 always / 32.8 sometimes / 32.4 never over 3,000 served items,
 *         and every readable surface between 32.0% and 34.4%;
 *       · every power VALUE item in the week is free-entry. There is no rank
 *         because there is no list.
 *
 *  2. THE GROUPING-REQUIRED STORY (F5) IS A SQUARE WHOSE SIDE IS A SUM, and that
 *     is the only shape at this level where a bracket is forced by the
 *     situation rather than printed by the author. PEDAGOGY-CEILING-REVIEW F5
 *     records that D21 never told one: all four of its Day-4 stories were
 *     `a × b + c`, so the bracket — the point of the week — only ever appeared
 *     as bare computation. `msSquareEdge` states two pieces laid end to end
 *     along ONE edge of a square and asks for the whole square. Nothing in the
 *     prompt is bracketed; the child has to gather the edge before squaring it,
 *     and the ungrouped reading (`a + b^2`) is a real competing number rather
 *     than a decoy. It ships as a two-op chain — gather, then square — so the
 *     step count is derived from the arithmetic and not asserted.
 *
 *  3. THE ESTIMATE PROBE IS A COIN FLIP BY CONSTRUCTION, AND THE CONSTRUCTION IS
 *     b09's, NOT A HOPEFUL DRAW (kit §E2.9a). `msTwoCounters` sets a counter
 *     that CLIMBS by a fixed amount each turn against one that is MULTIPLIED
 *     each turn — the week's anchor made into one page — and asks what the
 *     higher counter reads at the end. The probe asks which of the two ends
 *     ahead.
 *       The base, the number of turns and the climb are all drawn BEFORE the
 *     outcome, so their distributions are IDENTICAL on both branches: no reading
 *     of "the exponent is big" or "the step is big" can answer the probe,
 *     because those numbers do not know which branch they are on. Only the
 *     STARTING number is set from the outcome, as the power minus the whole
 *     climb, offset by a small gap either way — and the two branches differ in
 *     it by twice that gap, against a spread of hundreds. Measured splits and
 *     the strongest readable habit are in the report.
 *
 *  4. THE RECIPE'S ERROR-ANALYSIS IS DERIVABLE, so kit §E2.3's reframing
 *     protocol is not needed — and it is worth saying why, because the two
 *     weeks written immediately before this one both hit the wall. The verify
 *     library varies the OPERATION over a fixed ordered operand pair, so a
 *     misconception that changes an OPERAND cannot be expressed. "3^4 = 12" is
 *     an operation change — a power read as a product over the same two numbers
 *     — and `e_alg_verify_power_v1` computes both values from the same params.
 *     The Day-5 error-analysis is the recipe's item exactly as written, with
 *     nothing invented and nothing relocated.
 *
 *  5. ANSWER-IN-PROMPT AUDIT, one generator at a time, with the bound written
 *     beside the draw that carries it. Nothing here uses a redraw loop; each
 *     bound is an inequality the pool cannot break (kit §E2.4, L19):
 *       · `sitCubeStack` prints one edge count, 3 to 9, and answers with its
 *         cube, 27 to 729 — above every printed number by construction;
 *       · `msSquareEdge` prints two distinct edge pieces, each 2 to 9, and
 *         answers with the square of their sum, which is at least 25;
 *       · `msLooseAndTubes` answers with the loose count PLUS a positive
 *         product, so the answer exceeds the largest number the prompt states;
 *       · `msStrandRecover` prints a base and a total; its answer is 6 to 15,
 *         stepped clear of the base, and the total is at least 24;
 *       · `msTwoCounters` answers with the larger of the two totals, which is
 *         proved above the start, the step, the turn count and the base in the
 *         header comment on the generator itself;
 *       · the puzzle states a number and asks for the powers that build it, so
 *         the answer is a set of expressions rather than a value.
 *     The library generators this week serves were measured at difficulty 3 over
 *     3,000 draws by the orchestrator's guessability census before authoring
 *     began; the served slots are re-measured in the report.
 *
 *  6. FIGURE LAW as applied here (kit §F.7 / §E2.5). `GATE_PROFILE.E`'s
 *     `pictorialPerDay` is 0, and this week earns no figure on an assessed
 *     item: a square drawn and ruled into its unit squares IS the answer to the
 *     grouping story, and a factor line drawn out IS the value of a power. Both
 *     pictures therefore live in the lesson script and the modeled guided
 *     example, where the answer is already on the page.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SHARED-FILE FINDINGS — REPORTED, NOT FIXED (`lib/` is the orchestrator's)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  A. `lib/algebra.ts::groupingToTarget` CARRIES A 100% FREE STRATEGY, and its
 *     key table cannot see it. Its three cards are `(a + b)^n`, `a + b^n` and
 *     `a^n + b^n`, and the keyed reading is the grouped one on every draw — so
 *     the key is the only card with a bracket in it, every time. Measured
 *     directly on the generator at difficulty 3: "tap the card with the
 *     brackets" keys 100.0% of 3,000 draws, and "tap the largest-valued card"
 *     keys 100.0% as well, the second for the arithmetic reason that gathering
 *     a sum before raising it always beats raising the parts. The top KEY share
 *     is 4.1%, which is the number a census reports and which looks fine — this
 *     is the brief's §4 warning exactly: the rank was never the problem, the
 *     surface was. The fix is structural, not numeric: rotate WHICH reading is
 *     keyed and make the cards three placements of one bracket, which is what
 *     this week's `discrimBracketPlace` does. Until then the generator is unsafe
 *     as a certifying slot in any week.
 *
 *  B. `lib/algebra.ts::SWAP_PAIRS` leans the exponent surface. Among distinct
 *     whole numbers above one, a^b > b^a for every pair except {2, 3}, so with
 *     the five unordered pairs drawn uniformly and the equal pair keyed a third
 *     of the time, "take the bigger exponent" keys about 53% in expectation and
 *     49.4% as served here. Weighting the draw into three equal parts — the
 *     equal pair, the {2, 3} pair, and everything else — would put it on chance
 *     without removing a single card.
 *
 *  C. `AnswerSpec.requireSimplestForm` is dead code, as E5 reported. Nothing in
 *     this week depends on it (no item here asks for a simplest form), so it is
 *     recorded only as a confirmation from a second week, not as a new finding.
 *
 * Retrieval reaches backwards only, and to three places: D21 for order of
 * operations (both with and without brackets) and for reading a phrase into an
 * expression, D15 for the product itself, and D16 for exact division — the move
 * `msStrandRecover` performs over and over. Day 1's warm-ups are ORDERED so the
 * LAST of them is the D16 division: `applyRetrievalRamp` moves a pack's final
 * Day-1 warm-up onto Day 5 after every gate has run, and Day 5 already carries
 * the D21 write-an-expression format, so leaving either order-of-operations
 * warm-up last would have put two items of the same format on one served page
 * with nothing able to see it.
 */

import {
  asWarmup,
  divideExact,
  evalExpr,
  multiply,
  reasoning,
  writeExprChoice,
} from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { drawUniqueItem } from '../lib/guard';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, barModel } from '../lib/figures';
import {
  eaBaseTimesExponent,
  evaluatePower,
  orderOfOpsPower,
  power,
  powerBaseSwapTrap,
  powerValue,
} from '../lib/algebra';
import { discrimination } from '../lib/discrimination';
import { makeChoices } from '../shared';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D3 = { level: 'D' as const, week: 3 };
const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };
const D21 = { level: 'D' as const, week: 21 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §F.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// THE POWER POOLS — enumerated once at module load, never resampled
//
// Every pool below is a fixed list built at import time, so a draw is one pick
// off it and never a retry loop. A loop would consume a variable number of rng
// draws and make every LATER item in the pack depend on which seed this one
// landed on (kit §E2.4, L19).
// ---------------------------------------------------------------------------

/**
 * (base, exponent) pairs whose value a Level-E child will actually evaluate.
 *
 * (2, 2) IS ABSENT BY CONSTRUCTION, and for the same reason `lib/algebra.ts`
 * omits it from its own pool: 2^2 and 2 × 2 are the same number, so it is the
 * one pair on which "a power is not a product" has nothing at all to show. Any
 * item here that later grows an error-analysis or a contrast inherits the
 * exclusion rather than having to remember it.
 */
const POWER_POOL: ReadonlyArray<readonly [number, number]> = (() => {
  const out: Array<readonly [number, number]> = [];
  for (let base = 2; base <= 9; base++) {
    for (let exp = 2; exp <= 6; exp++) {
      if (base === 2 && exp === 2) continue;
      const v = powerValue(base, exp);
      if (v >= 8 && v <= 125) out.push([base, exp]);
    }
  }
  return out;
})();

/**
 * Pairs for the repeated-DIVISION recovery. The exponent is the number of
 * passes AFTER the first, so it is at least two — a single division would make
 * `msStrandRecover` a one-step item wearing a chain's clothes.
 *
 * The 64 ceiling is a TYPOGRAPHY bound, not a difficulty one. The stated total
 * is the answer times this value, and `countNoun` prints its count raw while
 * `fmtInt` groups anything from a thousand up — so a total of 3,024 would reach
 * the child as "3024 strands" on a page where every other large number carries
 * its separator. Fifteen times sixty-four is under a thousand on every draw.
 */
const SPLIT_POOL: ReadonlyArray<readonly [number, number]> = (() => {
  const out: Array<readonly [number, number]> = [];
  for (let base = 2; base <= 9; base++) {
    for (let exp = 2; exp <= 5; exp++) {
      const v = powerValue(base, exp);
      if (v <= 64) out.push([base, exp]);
    }
  }
  return out;
})();

/**
 * Pairs for the counter race. The power has to be large enough that a genuine
 * climb can be built underneath it on BOTH sides of the probe; the assertion
 * below is what proves that, rather than a comment claiming it.
 */
const RACE_POOL: ReadonlyArray<readonly [number, number]> = (() => {
  const out: Array<readonly [number, number]> = [];
  for (let base = 2; base <= 9; base++) {
    for (let turns = 2; turns <= 8; turns++) {
      const v = powerValue(base, turns);
      if (v >= 64 && v <= 800) out.push([base, turns]);
    }
  }
  return out;
})();

/**
 * The DISTINCT values the race pool can reach, drawn from uniformly — because
 * the value IS the answer on half the draws, so this is the axis the answer
 * space lives on and therefore the axis to flatten (E5's rule, earned there on
 * a shared factor).
 *
 * Picking the pair uniformly instead put 10.7% of served answers on 64, which
 * three different pairs reach (2^6, 4^3 and 8^2). Picking the value first and
 * then a pair that reaches it holds the top answer near a ninth of the power
 * branch, which is a twentieth of the slot. Measured both ways before the
 * change; the numbers are in the report.
 */
const RACE_VALUES: readonly number[] = [...new Set(RACE_POOL.map(([b, t]) => powerValue(b, t)))];

/** The widest gap the race ever opens between the two counters. */
const RACE_MAX_GAP = 15;
/** The smallest climb per turn the race ever states. */
const RACE_MIN_STEP = 4;

/**
 * MODULE-LOAD PROOF, not a comment. For every pair in the race pool, and for
 * the worst gap it can draw, there has to be a legal climb — otherwise one
 * branch of the probe would be unreachable for that pair and the two branches
 * would stop sharing a pool, which is the whole basis of decision 3.
 */
for (const [base, turns] of RACE_POOL) {
  const room = Math.floor((powerValue(base, turns) - RACE_MAX_GAP - 2) / turns);
  if (room < RACE_MIN_STEP) {
    throw new Error(`E10: the race pool admits no legal climb for ${power(base, turns)} — the probe would lean`);
  }
}

/**
 * Every way a square's edge can be laid as TWO DISTINCT pieces, indexed by the
 * edge, so `msSquareEdge` can draw the EDGE uniformly and a split second.
 *
 * The order matters and was measured. Drawing the two pieces uniformly puts the
 * edge on a triangular distribution — eight of the fifty-six ordered pairs make
 * an edge of eleven and only one makes an edge of five — so the ANSWER, which
 * is the edge squared, piled 14.1% of served slots on a single value. Drawing
 * the edge first and a split second flattens the axis the answer lives on to a
 * thirteenth apiece. The generator is served in the mastery forms, which is
 * where a concentrated answer space costs the most.
 */
const EDGE_SPLITS: ReadonlyArray<readonly [number, ReadonlyArray<readonly [number, number]>]> = (() => {
  const out: Array<readonly [number, ReadonlyArray<readonly [number, number]>]> = [];
  for (let edge = 5; edge <= 17; edge++) {
    const splits: Array<readonly [number, number]> = [];
    for (let first = 2; first <= 9; first++) {
      const second = edge - first;
      if (second >= 2 && second <= 9 && second !== first) splits.push([first, second]);
    }
    if (splits.length) out.push([edge, splits]);
  }
  return out;
})();

/**
 * BRACKET PLACEMENTS of one line, `a + b^n × c`, with their values.
 *
 * THIS ITEM EXISTS BECAUSE THE LIBRARY'S `groupingToTarget` CANNOT BE USED AS
 * THE WEEK'S CERTIFYING GROUPING ITEM, and the reason is worth writing down
 * because it is the §4 surface trap in its purest form. Its three cards are
 * `(a + b)^n`, `a + b^n` and `a^n + b^n`, and only the first of them carries a
 * bracket — on every draw, because the keyed reading is the grouped one every
 * time. "Tap the card with the brackets in it" therefore keys 100.0% of 3,000
 * measured draws, on the item whose entire subject is what a bracket does. The
 * same construction makes the key the largest-valued card on 100% of draws, for
 * the arithmetic reason that gathering a sum before raising it always produces
 * more than raising the parts. Neither is visible in a key table: its top key
 * share is 4.1%, which is what the census reports and what looks fine.
 * REPORTED UPWARD, NOT FIXED — `lib/` belongs to the orchestrator.
 *
 * So the week authors its own, and the repair is structural rather than a
 * better choice of numbers: the three cards are three PLACEMENTS OF ONE
 * BRACKET in one line, two of them bracketed and one not, and the placement
 * that is keyed is drawn in exact thirds. Then:
 *   · "the card with brackets" is right on two thirds of draws and picks
 *     between two cards, so it is worth exactly a third;
 *   · "the card with no brackets" is keyed exactly a third of the time;
 *   · the three cards are 13, 14 and 11 characters wide on every draw (all the
 *     operands are single digits by construction), so longest and shortest are
 *     each a fixed card and each therefore worth a third;
 *   · the three values are strictly ordered on every draw — gathering both
 *     loose numbers beats gathering the power's output beats gathering nothing
 *     — so largest, middle and smallest are each a fixed card, and each is
 *     worth a third for the same reason.
 * Every readable surface lands on chance BECAUSE the truth rotates, not because
 * the cards were shuffled.
 */
type Placement = 'sum-first' | 'power-then-sum' | 'as-it-stands';
const PLACEMENTS: readonly Placement[] = ['sum-first', 'power-then-sum', 'as-it-stands'];

interface BracketCase {
  a: number;
  b: number;
  n: number;
  c: number;
}

const BRACKET_CASES: BracketCase[] = (() => {
  const out: BracketCase[] = [];
  for (let a = 2; a <= 5; a++) {
    for (let b = 2; b <= 5; b++) {
      for (const n of [2, 3]) {
        for (let c = 2; c <= 4; c++) {
          // Under a thousand, so no card and no target carries a thousands
          // separator that `countNoun` would print and `fmtInt` would not.
          if (Math.pow(a + b, n) * c > 900) continue;
          out.push({ a, b, n, c });
        }
      }
    }
  }
  if (!out.length) throw new Error('E10: no legal bracket-placement cases');
  return out;
})();

/** The three readings of `a + b^n × c`, one per placement of a single bracket. */
function bracketText(p: Placement, k: BracketCase): string {
  const inner = power(k.b, k.n);
  switch (p) {
    case 'sum-first': return `(${fmtInt(k.a)} + ${fmtInt(k.b)})^${fmtInt(k.n)} × ${fmtInt(k.c)}`;
    case 'power-then-sum': return `(${fmtInt(k.a)} + ${inner}) × ${fmtInt(k.c)}`;
    case 'as-it-stands': return `${fmtInt(k.a)} + ${inner} × ${fmtInt(k.c)}`;
  }
}

function bracketValue(p: Placement, k: BracketCase): number {
  switch (p) {
    case 'sum-first': return powerValue(k.a + k.b, k.n) * k.c;
    case 'power-then-sum': return (k.a + powerValue(k.b, k.n)) * k.c;
    case 'as-it-stands': return k.a + powerValue(k.b, k.n) * k.c;
  }
}

/**
 * What each placement makes the power act on. Written per CARD rather than per
 * (truth, card) pair, because a bracket placement means the same thing wherever
 * it stands — and deliberately with no word about which reading comes out
 * larger, since a rationale that names the rank teaches the surface the item is
 * built to remove.
 */
const BRACKET_RATIONALE: Record<Placement, { tag: ErrorTag; text: string }> = {
  'sum-first': {
    tag: 'concept-misconception',
    text: 'Fences the two loose numbers together first, so the power acts on their whole sum rather than on the second number by itself, and the multiplier at the end reaches all of that.',
  },
  'power-then-sum': {
    tag: 'procedure-slip',
    text: 'Lets the power act on the second number alone and fences what it produces together with the first, so the multiplier at the end reaches both of them instead of one.',
  },
  'as-it-stands': {
    tag: 'representation-misread',
    text: 'Leaves the line exactly as it is written, so the power acts on the second number alone and the multiplier reaches only what the power produced, with the first number joined on at the very end.',
  },
};

/**
 * Numbers that can be written as a power in MORE THAN ONE way, with both the
 * base and the exponent above one. Enumerated by hand and re-derived in the
 * puzzle's own answer, so the two cannot disagree.
 */
const MULTI_POWER: ReadonlyArray<readonly [number, ReadonlyArray<readonly [number, number]>]> = [
  [16, [[2, 4], [4, 2]]],
  [64, [[2, 6], [4, 3], [8, 2]]],
  [81, [[3, 4], [9, 2]]],
  [256, [[2, 8], [4, 4], [16, 2]]],
  [512, [[2, 9], [8, 3]]],
  [625, [[5, 4], [25, 2]]],
  [729, [[3, 6], [9, 3], [27, 2]]],
];

// ---------------------------------------------------------------------------
// Scenery. Each pool was grepped against the whole weeks directory and against
// the local pools of E4, E5 and E13 — the weeks a learner meets nearest this
// one — on the day this week was finished (kit §E2.8). Nothing here repeats a
// scene any of them uses, and nothing repeats `lib/algebra.ts`'s own GROWTHS,
// COLLECTIONS, GROUPINGS or MACHINES pools, which the served library items on
// these same pages already spend.
// ---------------------------------------------------------------------------

/** A cube built out of identical cubes — the honest home of a third power. */
const CUBE_SCENES = [
  { who: 'A gallery', unit: 'oak blocks', shape: 'display cube' },
  { who: 'A salt works', unit: 'salt bricks', shape: 'cube stack' },
  { who: 'A stonemason', unit: 'granite setts', shape: 'cube plinth' },
] as const;

/** A square whose EDGE is two pieces laid end to end — the grouping frame (F5). */
const SQUARE_SCENES = [
  { who: 'A lacemaker', unit: 'lace squares', shape: 'square shawl' },
  { who: 'A groundsman', unit: 'turf squares', shape: 'square lawn' },
  // 'tesserae' is already a plural, and `countNoun` served "3 tesseraes" in the
  // mastery form. A unit noun in these pools has to survive `unitFor` in BOTH
  // directions, which a Latin plural does not.
  { who: 'A mosaicist', unit: 'glass chips', shape: 'square mosaic' },
] as const;

/** Loose stock beside closed containers — the order-of-operations frame. */
const STORE_SCENES = [
  { who: 'A kite-maker', unit: 'spars', many: 'capped tubes', one: 'tube', spare: 'clamps' },
  { who: 'A chandler', unit: 'wicks', many: 'capped drums', one: 'drum', spare: 'dipping racks' },
  { who: 'A fletcher', unit: 'shafts', many: 'tied bundles', one: 'bundle', spare: 'sanding blocks' },
] as const;

/** Something split again and again — the repeated-division frame. */
const SPLIT_SCENES = [
  { machine: 'a carding comb', unit: 'strands', verb: 'splits' },
  { machine: 'a fibre divider', unit: 'filaments', verb: 'divides' },
  { machine: 'a mica cleaver', unit: 'mica sheets', verb: 'peels' },
] as const;

/**
 * Two displays climbing side by side — the anchor, made into one page.
 *
 * The two labels are stored CAPITALISED because each of them opens a sentence
 * in the prompt below. The first draft stored them lowercase and served "A
 * board game is set going. the blue counter starts at 23 steps" on a third of
 * seeds — no gate sees a lowercase sentence, and only reading the served pack
 * does (kit §E2.10).
 */
const RACE_SCENES = [
  { where: 'A pinball table', a: 'The left dial', b: 'The right dial', unit: 'points', period: 'turn' },
  // The period is 'shot', not 'go': `countNoun` served "After 4 gos".
  { where: 'A fairground stall', a: 'The upper score wheel', b: 'The lower score wheel', unit: 'clicks', period: 'shot' },
  { where: 'A quiz machine', a: 'The upper window', b: 'The lower window', unit: 'marks', period: 'question' },
] as const;

/** Which pass the recovery story asks about, as a WORD — so it prints no digit. */
const ORDINAL_WORD: Record<number, string> = { 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth' };

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** D21 — order of operations with no brackets. The convention a power joins. */
const wOrderPlain = asWarmup(evalExpr(false), D21);
/** D21 — the same expression with a bracket in it, which changes the answer. */
const wOrderBracketed = asWarmup(evalExpr(true), D21);
/** D21 — a phrase read into an expression: the Day-5 written strand's substrate. */
const wWriteExpr = asWarmup(writeExprChoice(), D21);
/**
 * D15 — the product itself, so a line of factors never stalls on the arithmetic.
 *
 * The two ranges are DISJOINT (3–12 against 13–24) for the reason `divideExact`
 * needs it below: `multiply` draws its two factors independently, and a warm-up
 * whose two factors can coincide is a warm-up that can print `12 × 12`, which
 * is a square in the one week where a square is the thing being taught.
 */
const wProduct = asWarmup(multiply(3, 12, 13, 24), D15);
/**
 * D16 — exact division, the move the recovery chain performs over and over.
 *
 * Divisor and quotient ranges are DISJOINT on purpose. `divideExact` draws the
 * two independently, so overlapping ranges let them coincide and print
 * `81 ÷ 9 = ?` — whose answer is already on its own line, in a week whose
 * subject is that a power is not read off the page.
 */
const wDivide = asWarmup(divideExact(3, 9, 11, 19), D16);

// ---------------------------------------------------------------------------
// Powers, in their own stories — free-entry, because there is no honest way to
// offer power values as cards without offering their rank with them (decision 1)
// ---------------------------------------------------------------------------

/**
 * A THIRD power, where a third power actually lives: a cube built out of cubes.
 *
 * The exponent is not drawn, and that is the point — the child is not told
 * "three" anywhere, they have to see that a cube has three directions to fill.
 * The answer is re-derived by `e_alg_power_v1` from `{base, exp}`, so QG-5
 * audits it against the same params the prompt is built from.
 *
 * No leak by construction: the prompt prints one number, the edge count, which
 * runs 3 to 9; the answer is its cube, 27 to 729, and is above every printed
 * number on every draw.
 */
const sitCubeStack = situation({
  situationType: 'measurement',
  cognitiveOp: 'alg-power-cube',
  draw: (r) => {
    const scene = r.pick(CUBE_SCENES);
    const edge = r.int(3, 9);
    return {
      prompt: `${scene.who} builds one large ${scene.shape} out of identical ${scene.unit}, all the same size. The finished ${scene.shape} is ${countNoun(edge, scene.unit)} along its length, the same across its width and the same up its height. How many ${scene.unit} does it hold?`,
      answerValue: String(powerValue(edge, 3)),
      templateId: 'e_alg_power_v1',
      params: { base: edge, exp: 3 },
      units: scene.unit,
      hints: [
        'How many directions does a cube have to be filled in before it is full?',
        'Work out one flat layer first, then take as many of those layers as the height allows.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: four shapes, so "two steps" never becomes one template
// ---------------------------------------------------------------------------

/**
 * THE GROUPING-REQUIRED STORY (F5, and the recipe's second key multi-step).
 *
 * Two pieces are laid end to end along ONE edge of a square, and the square is
 * that same length on every edge. Nothing in the prompt carries a bracket; the
 * situation carries it. A child who squares the second piece and adds the first
 * — the `a + b^2` reading — gets a number that is genuinely on the table, which
 * is what makes this a story rather than a decoy.
 *
 * The chain is gather-then-square, so the step count is DERIVED from the
 * arithmetic the item ships rather than asserted beside it.
 *
 * No leak by construction: both pieces are drawn distinct from 2 to 9, so the
 * edge is 5 to 17 and the answer is 25 to 289 — above both printed numbers on
 * every draw.
 */
const msSquareEdge = multiStep({
  situationType: 'area',
  cognitiveOp: 'alg-square-a-sum',
  draw: (r) => {
    const scene = r.pick(SQUARE_SCENES);
    // The EDGE is drawn first and a split second, so the answer space — the
    // edge squared — is flat over its thirteen values rather than triangular.
    const [, splits] = r.pick(EDGE_SPLITS);
    const [first, second] = r.pick(splits);
    const name = one(r);
    return {
      prompt: `${name} is making one ${scene.shape}. Along one edge of it, a strip of ${countNoun(first, scene.unit)} is set end to end against a band of ${countNoun(second, scene.unit)}, and every edge of the ${scene.shape} is that same length. How many ${scene.unit} does the finished ${scene.shape} take?`,
      initN: first,
      steps: [
        { op: 'add', n: second, d: 1 },
        { op: 'mul', n: first + second, d: 1 },
      ],
      units: scene.unit,
      hints: [
        'What has to be gathered into a single length before a square can be built on it?',
        'Settle the whole edge as one amount, then lay that many rows of that many pieces.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * ORDER OF OPERATIONS WITH AN EXPONENT, AS A CHAIN — and HAS-DISTRACTOR
 * (PEDAGOGY-CEILING-REVIEW F3).
 *
 * The chain is the expression's own precedence written out: the power is
 * settled as its line of factors, then the multiplication runs, then the
 * addition finishes. So the arithmetic that answers the item and the rule the
 * item is about are ONE object, and the step count is whatever the power costs.
 *
 * The unspent quantity is a count of clamps, racks or blocks — a plausible
 * DIVISOR, which is the seductive kind rather than scenery a child ignores. Its
 * range (8 to 20) is disjoint from both the tube count (2 to 6) and the loose
 * count (27 to 48), so it never reads as the same quantity mentioned twice
 * (kit §E2.4).
 *
 * No leak by construction: the answer is the loose count PLUS a product of at
 * least sixteen, so it exceeds the largest number the prompt states.
 */
const msLooseAndTubes = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'alg-order-of-ops-chain',
  posing: 'has-distractor',
  draw: (r) => {
    const scene = r.pick(STORE_SCENES);
    const [base, exp] = r.pick(POWER_POOL);
    const tubes = r.int(2, 6);
    const loose = r.int(27, 48);
    const spare = r.int(8, 20);
    const name = one(r);
    return {
      prompt: `${name} keeps ${countNoun(loose, scene.unit)} loose in a rack and ${countNoun(tubes, scene.many)}, every ${unitFor(1, scene.one)} holding ${power(base, exp)} ${scene.unit}. The bench carries ${countNoun(spare, scene.spare)}. How many ${scene.unit} are there altogether?`,
      initN: base,
      steps: [
        ...Array.from({ length: exp - 1 }, () => ({ op: 'mul' as const, n: base, d: 1 })),
        { op: 'mul' as const, n: tubes, d: 1 },
        { op: 'add' as const, n: loose, d: 1 },
      ],
      units: scene.unit,
      hints: [
        'Does every number this story states belong to the count it is asking for?',
        'Turn the shorthand on the tubes into a plain count first, then let the multiplying run and the adding finish.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3, the Level-E lift), and the honest
 * inverse of a power at this level: repeated DIVISION.
 *
 * The count the story hands over belongs to a LATER pass, so nothing in the
 * sentence order says to undo anything — and undoing it once is not enough,
 * which is the part that makes the exponent visible. A child who divides by the
 * splitting number a single time has understood the operation and not the
 * shorthand.
 *
 * The pass is named as a WORD ('the fourth pass'), so the prompt carries no
 * digit for it: a numeral there would enter the item's operand surface and let
 * the freshness guard treat two genuinely different questions as one.
 *
 * No leak by construction: the answer is stepped clear of the splitting number
 * and runs 6 to 15, while the stated total is at least twenty-four.
 */
const msStrandRecover = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'alg-undo-a-power',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const scene = r.pick(SPLIT_SCENES);
    const [base, exp] = r.pick(SPLIT_POOL);
    // Stepped, not redrawn: the step consumes no rng draw, and one step always
    // clears a single forbidden value (kit §E2.4, L19). The forbidden value is
    // the splitting number itself — an answer that equals it reads as the count
    // the prompt already states.
    const drawn = r.int(6, 14);
    const opening = drawn === base ? drawn + 1 : drawn;
    const total = opening * powerValue(base, exp);
    return {
      prompt: `Every pass through ${scene.machine} ${scene.verb} each ${unitFor(1, scene.unit)} into ${countNoun(base, scene.unit)}. After the ${ORDINAL_WORD[exp + 1]} pass there are ${countNoun(total, scene.unit)}. How many were there after the first pass?`,
      initN: total,
      steps: Array.from({ length: exp }, () => ({ op: 'div' as const, n: base, d: 1 })),
      units: scene.unit,
      hints: [
        'Does the count the story gives you belong to the first pass, or to one a good way after it?',
        'Undo one pass at a time, and keep undoing until you are back at the first.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * THE ANCHOR, MADE INTO ONE PAGE: a counter that CLIMBS by the same amount each
 * turn against one that is MULTIPLIED each turn. The question asks what the
 * higher of the two reads at the end, so the child has to settle both — which
 * is repeated addition and repeated multiplication done side by side, which is
 * the whole week in one item.
 *
 * THE PROBE IS A COIN FLIP BY CONSTRUCTION (decision 3, kit §E2.9a). The base,
 * the turn count and the climb are all drawn BEFORE the outcome, so their
 * distributions are identical on both branches and no reading of them can
 * answer the probe. Only the STARTING number is set from the outcome — the
 * power minus the whole climb, offset by a small gap one way or the other — and
 * the two branches differ in it by twice that gap.
 *
 * No leak by construction, both branches:
 *  · when the multiplying counter wins, the answer is the power, and the start
 *    is the power minus the climb minus the gap (below it), the climb per turn
 *    is at most the power over the turn count (below it), and the turn count
 *    and the base are single digits against a power of at least sixty-four;
 *  · when the climbing counter wins, the answer is the power plus the gap,
 *    which is above the power and therefore above all of those, and it exceeds
 *    the start by exactly the whole climb.
 */
const msTwoCounters = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'alg-power-vs-repeated-add',
  draw: (r) => {
    const scene = r.pick(RACE_SCENES);
    const target = r.pick(RACE_VALUES);
    const [base, turns] = r.pick(RACE_POOL.filter(([b, t]) => powerValue(b, t) === target));
    const gap = r.int(2, RACE_MAX_GAP);
    // Proved non-empty for every pool entry at module load, above.
    const step = r.int(RACE_MIN_STEP, Math.floor((target - gap - 2) / turns));
    const multiplyingWins = r.chance(0.5);
    const start = target - step * turns + (multiplyingWins ? -gap : gap);
    return {
      prompt: `${scene.where} carries two displays, and both are running. ${scene.a} starts at ${countNoun(start, scene.unit)} and climbs ${countNoun(step, scene.unit)} every ${unitFor(1, scene.period)}. ${scene.b} starts at one ${unitFor(1, scene.unit)} and is multiplied by ${fmtInt(base)} every ${unitFor(1, scene.period)}. After ${countNoun(turns, scene.period)}, what does the higher of the two read?`,
      initN: multiplyingWins ? 1 : step,
      steps: multiplyingWins
        ? Array.from({ length: turns }, () => ({ op: 'mul' as const, n: base, d: 1 }))
        : [
            { op: 'mul' as const, n: turns, d: 1 },
            { op: 'add' as const, n: start, d: 1 },
          ],
      units: scene.unit,
      hints: [
        'Which of the two is growing by the same amount each time, and which is growing by copies of itself?',
        'Settle each one on its own all the way to the last turn, then hold the two totals against each other.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Reachable ONLY through the wrapper (kit §E2.2): the metacognition wrapper does
 * not touch the hint ladder, so serving this generator both raw and wrapped
 * would spend two of the week's three allowed ladder slots on one wording. The
 * raw form appears in the mastery forms, which the ladder dedup does not see and
 * where a scaffold does not belong anyway.
 */
const msTwoCountersEstimate = withEstimateFirst(
  msTwoCounters,
  'which of the two displays do you expect to end ahead?',
);

// ---------------------------------------------------------------------------
// Discrimination — where the bracket goes (the week's own, built here because
// the library's grouping item carries a 100% tell; see BRACKET_CASES above)
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DAY-5 SIGNATURE in its card form: one line, one bracket, three
 * places to put it — and a stated target that names exactly one of them.
 *
 * The PLACEMENT is drawn first, in exact thirds, and the operands are picked to
 * match; the target is then that placement's own value, computed here and never
 * authored. The three values are strictly ordered on every draw, so nothing
 * about their size can be read off the page without settling all three, and the
 * ordering is constant precisely so that "largest", "middle" and "smallest" are
 * each a fixed card whose key rotates away from it two thirds of the time.
 */
const discrimBracketPlace = discrimination({
  variant: 'structural',
  cognitiveOp: 'alg-place-the-bracket',
  draw: (r) => {
    const truth = r.pick(PLACEMENTS);
    const k = r.pick(BRACKET_CASES);
    return {
      prompt: `These three are the same line of numbers with a single pair of brackets in different places, or in no place at all. Which of them has the value ${fmtInt(bracketValue(truth, k))}?`,
      correct: bracketText(truth, k),
      distractors: PLACEMENTS.filter((p) => p !== truth).map((p) => ({
        text: bracketText(p, k),
        errorTag: BRACKET_RATIONALE[p].tag,
        rationale: BRACKET_RATIONALE[p].text,
      })),
      hints: [
        'Which numbers is the power acting on in each of these, and which numbers is it leaving alone?',
        'Settle each version in the order its own brackets ask for, and keep the one that lands on the stated value.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * THE DAY-5 SIGNATURE (§6 row E10, "insert grouping to hit a target — D21's
 * sibling"), in its written form: work the line out as it stands, then put ONE
 * bracket in to hit a stated target and show that it does.
 *
 * Fixed prose, because what is being assessed is the placement argument rather
 * than another piece of arithmetic — and because the three parts are named
 * separately, so a value with no bracketed line and no reason cannot pass as an
 * answer. `discrimBracketPlace` has already put the same move in front of the
 * child twice with candidates on the page, on Days 2 and 3; this is the day it
 * arrives with none.
 */
const insertTheBracket = reasoning({
  prompt:
    'Take the expression 2 + 3 ^ 2 × 4. Work out its value exactly as it stands. Then write the same expression with one pair of brackets added so that its value is 100, and work that version out to show that it is. Finish with one sentence naming what the brackets made happen first.',
  value:
    'as it stands the value is 38; with brackets, (2 + 3)^2 × 4 = 100; the brackets gather the two numbers into a single amount, and only a single amount can be raised to a power',
  acceptableForms: ['38', '100', '(2 + 3)^2 × 4', 'gather', 'single amount', 'before the power'],
  keywords: true,
  hints: [
    'Which part of the line as it stands is settled before anything else happens to it?',
    'Ask what the power would have to be acting on for the line to reach the target, and fence exactly that.',
  ],
  errorTags: ['procedure-slip', 'concept-misconception'],
});

/**
 * THE ALWAYS/SOMETIMES/NEVER CLAIM — AND THE CLAIM IS DRAWN, which is the point.
 *
 * `items.classify` takes its three cards as authored config, so a week that
 * authors one claim ships a slot whose key never moves: the two verdicts it does
 * not key are offered on 100% of draws and keyed on 0%, the L38 permanently
 * unkeyable card in its most literal form. E3 measured exactly that on its own
 * first version and repaired it by drawing the claim; this week inherits the
 * repair rather than the defect. "Answer sometimes and read nothing" falls to a
 * third, and so does "pick the longest card" — the always/sometimes/never tell,
 * since the three words are fixed strings of different lengths.
 *
 * The three claims are the three things this week most needs a learner to be
 * able to defend: the precedence a power carries (always), the base/exponent
 * swap with its single famous exception (sometimes), and the exponent spread
 * across a sum (never).
 */
type Verdict = 'always' | 'sometimes' | 'never';
const VERDICTS: readonly Verdict[] = ['always', 'sometimes', 'never'];

interface AsnClaim {
  claim: string;
  verdict: Verdict;
  wrong: Record<string, { tag: ErrorTag; text: string }>;
}

const ASN_CLAIMS: readonly AsnClaim[] = [
  {
    claim: 'in an expression with no brackets in it, the power is worked out before any multiplying or adding',
    verdict: 'always',
    wrong: {
      sometimes: {
        tag: 'procedure-slip',
        text: 'Treats the order as something that depends on where the power happens to sit in the line. Its position changes nothing: the power is shorthand for a line of factors, and that line has to be collected into one number before anything can be done with it.',
      },
      never: {
        tag: 'representation-misread',
        text: 'Reads the expression strictly left to right, which is how a sentence works and not how an expression does. The shorthand is settled first wherever it stands, and only then do the multiplying and the adding run.',
      },
    },
  },
  {
    claim: 'swapping the base and the exponent of a power changes its value, when the two numbers are different whole numbers above one',
    verdict: 'sometimes',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'Almost right, and the exception is the one worth knowing. Two to the fourth and four squared are both sixteen — the only pair of different whole numbers above one where the swap lands on the same value.',
      },
      never: {
        tag: 'task-comprehension',
        text: 'Over-corrects into treating the two numbers as a pair that trades places freely. Two cubed is eight and three squared is nine, so the swap usually does change the value, and reading the base and the exponent as interchangeable is the very thing this week is against.',
      },
    },
  },
  {
    claim: 'for two whole numbers above zero, squaring their sum gives the same value as squaring each of them and adding the two squares',
    verdict: 'never',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'Spreads the exponent across a sum, which a power does not do. Squaring the whole edge builds two extra rectangles between the two squares, and with both numbers above zero those rectangles always hold something.',
      },
      sometimes: {
        tag: 'task-comprehension',
        text: 'Looks for the friendly pair where it works out. There is none while both numbers are above zero: the gap between the two readings is twice the two numbers multiplied together, which is never nothing.',
      },
    },
  },
];

const powerClaimVerdict: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const c = r.pick(ASN_CLAIMS);
    const distractors = VERDICTS.filter((v) => v !== c.verdict).map((v) => ({
      text: v,
      errorTag: c.wrong[v].tag,
      rationale: c.wrong[v].text,
    }));
    const { choices, correctKey } = makeChoices(r, c.verdict, distractors);
    return {
      type: 'classification' as const,
      prompt: `Always, sometimes, or never true: ${c.claim}. Back your verdict in one sentence: give a case that decides it, or a reason if no single case can.`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' as const },
      difficulty,
      strand: 'noncomputational' as const,
      isRetrieval: false,
      hintLadder: [
        'Is a single case enough to prove a claim of this shape, or only ever enough to sink one?',
        'Test it on the smallest numbers you can find, then on a lopsided pair, and see whether one verdict covers both.',
      ],
      // The tags are the DRAWN claim's own two readings, not a fixed union of
      // all three claims': QG-9 caps an item at three, and a union would also
      // bank a tag no card on the served page actually carries.
      errorTags: distractors.map((d) => d.errorTag) as ErrorTag[],
      authorMeta: { stepCount: 1, cognitiveOp: 'alg-defend-power-claim' },
    };
  });

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE10 = makeWeekBuilder({
  level: 'E',
  week: 10,
  conceptId: 'exponents-numerical-expressions',
  conceptName: 'Exponents & numerical expressions',
  strandTags: ['algebra-geometry', 'multiplication-division'],
  prerequisiteWeeks: [D3, D15, D21],
  pedagogyContract: 'v2',
  conceptualAnchor: 'repeated multiplication set against repeated addition',
  conceptFamily: 'operation',
  deepeningDelta:
    'D21 settled the order of operations over three operations — brackets, then multiplying, then adding — and asked for expressions to be written from a phrase. Every symbol in it stood for one operation done once. E10 adds a symbol that stands for an operation done many times, and that changes what the order of operations is FOR: a power has to be collected into a single number before anything can be done with it, so it does not join the queue, it opens it. It also introduces the first pair of numbers in this curriculum that are not interchangeable — the base and the exponent do different jobs, where the two numbers in a product do the same one — and it gives D21\'s bracket a second job. In D21 a bracket decided which of two operations went first; here it decides what the power is even acting on, which is why the week ends on D21\'s own insert-the-bracket task with a power in the line.',
  explanation: {
    hook:
      'Put one grain of rice on the first square of a chessboard and double it on every square after. By the last square you owe more rice than has ever been grown. Add one grain per square instead and you owe sixty-four grains. The words "again and again" cover both of those, and this week is about telling them apart.',
    whyBeforeHow:
      'A power is not a new operation. It is a job you already have — multiplying — written down once instead of many times, and everything this week does follows from that. That is why the anchor is repeated multiplication set against repeated addition: the two sound alike in words and behave nothing alike in numbers. Three multiplied by four is three counted four times over, and it comes to twelve. Three to the fourth is three used as a factor four times over — three times three times three times three — and it comes to eighty-one. Since the shorthand hides a whole line of factors, the two small numbers in it are doing two different jobs: the base says what is repeated, and the exponent says how often. That is not true of the two numbers in a product, which is why swapping them there costs nothing and swapping them in a power usually changes the answer completely. It also settles the order of operations without a table to remember: a power stands for a line of multiplication, so that line has to be collected into a single number before any multiplying or adding around it can happen. Brackets are the one thing that outranks a power, and for the same reason — a bracket gathers loose parts into one amount, and only one amount can be raised. So before you work a power out, say roughly how big you expect it to be, because powers get away from you: the digits will look reasonable whatever you write, and only the size will object.',
    script: [
      {
        say: 'Watch me write the same two numbers down twice and get two completely different answers. Here is three times four. That is three counted four times over — three, six, nine, twelve. Now here is three to the fourth. Same two numbers, and it is not twelve. The little raised four is not joining the multiplication; it is COUNTING it. So I write the line out: three times three times three times three. Nine, twenty-seven, eighty-one. Twelve and eighty-one, out of the same two numbers, because in one of them the numbers do the same job and in the other they do not.',
        visual: 'The two readings side by side: four threes joined as a count, and four threes stacked as a line of factors.',
        figure: barModel(
          [
            { label: 'three counted four times over', segments: [{ value: 3 }, { value: 3 }, { value: 3 }, { value: 3 }], total: '12' },
            { label: 'three used as a factor four times over', segments: [{ value: 81, label: '81' }], total: '81' },
          ],
          { scaleMax: 81, alt: 'a short bar of four equal threes making twelve beside a long bar of eighty-one' },
        ),
      },
      {
        say: 'Now watch what happens when I swap the two numbers over. Two cubed is two times two times two, which is eight. Three squared is three times three, which is nine. Different answers, so the swap matters — the base and the exponent are not a pair that trades places. And here is the one place that catches everybody: two to the fourth is sixteen, and four squared is also sixteen. One pair, out of all the whole numbers there are. It is not a rule, it is a coincidence worth knowing about, and it is the only one.',
        visual: 'Four swapped pairs written out as their factor lines, with the two sixteens meeting at the end.',
      },
      {
        say: 'Here is why the order of operations puts a power first, and it is not because somebody decided so. Take two plus three squared times four. The three squared is standing in for three times three — it is a line of multiplication with a coat on. I cannot multiply by four until I know what I am multiplying, so I collect it: nine. Now four nines is thirty-six, and two more is thirty-eight. The power did not push in at the front of a queue. It was never in the queue; it was a number that had not been written out yet.',
        visual: 'The same line settled in three stages: the power collected, then the multiplication, then the addition.',
      },
      {
        say: 'One habit before the arithmetic and one after. Before: I estimate. A square whose edge is five and three together is not five squared plus three squared — I can see that on the drawing, because gathering the edge first builds two extra rectangles that the two separate squares leave out. Sixty-four, not thirty-four. After: I check the size against what I expected. Powers run away from you, so an answer that is roughly right in size is worth more than digits that look tidy, and if my answer is nowhere near my estimate I have found my mistake rather than failed to check it.',
        visual: 'An eight-by-eight square ruled into unit squares, with the five-by-five corner shaded and the two rectangles between the squares left plain.',
        figure: areaGrid(
          { rows: 8, cols: 8, shadedRows: 5, shadedCols: 5 },
          { alt: 'a square eight units on every side, ruled into unit squares, with a five-by-five block shaded in one corner and the rest left plain' },
        ),
      },
    ],
    summary:
      'A power is repeated multiplication written short: the base says what is repeated and the exponent says how often, and those are two different jobs, which is why a power is not the two numbers multiplied together and why swapping them usually changes the value. Because a power stands for a whole line of factors, it is collected into a single number before any multiplying or adding around it happens — that is what the order of operations is saying, not a rule to memorise. A bracket is the one thing that comes first, because it gathers loose parts into one amount and only one amount can be raised, which is why squaring a sum is not the same as squaring the parts and adding. Powers grow far faster than repeated adding does, so settle roughly how big an answer should be before writing it down.',
    vocabulary: [
      { term: 'power', kidGloss: 'a number written as a repeated multiplication of one factor, like 3^4' },
      { term: 'base', kidGloss: 'the number in a power that is repeated — the factor the line is made of' },
      { term: 'exponent', kidGloss: 'the raised number in a power, which counts how many times the base is used as a factor' },
      { term: 'squared', kidGloss: 'raised to the second power — a number multiplied by itself once' },
      { term: 'order of operations', kidGloss: 'the agreement that brackets are settled first, then powers, then multiplying and dividing, then adding and subtracting' },
    ],
  },
  guidedExamples: [
    {
      ...ge(10, 1, 'modeled', 'Work out 5 + 6 × 2^4.', [
        {
          teacherSay:
            'Let me read the line before I touch any of it. There is a five standing on its own, a six that is multiplying something, and a two with a raised four beside it. That last one is not a small sum waiting to happen — it is a line of multiplication that nobody has written out yet, and I cannot multiply by six until I know what number it comes to.',
        },
        {
          teacherSay:
            'So I collect it first. Two used as a factor four times over: two, four, eight, sixteen. Notice what I did NOT do — I did not take two times four and write eight. What does the six have to be multiplied by now?',
          expected: '16',
        },
        {
          childDo: 'Take six of that amount, then bring the five in at the end, and say roughly what size you expected before you check the total.',
          expected: '101',
        },
      ], '101'),
      visual: 'The line settled in three stages, with the collected power standing where the shorthand was.',
      figure: barModel(
        [
          { label: 'what the shorthand comes to', segments: [{ value: 16, label: '16' }] },
          { label: 'six of that amount', segments: [{ value: 96, label: '96' }] },
          { label: 'and the loose five brought in', segments: [{ value: 96, label: '96' }, { value: 5, label: '5', fill: 'soft' }], total: '101' },
        ],
        { scaleMax: 101, alt: 'three bars to one scale: sixteen, then ninety-six, then ninety-six with a five joined on to make a hundred and one' },
      ),
    },
    ge(10, 2, 'completion', 'A square tray has an edge made of a rail of 7 tiles set end to end against a rail of 5 tiles, and every edge of the tray is that same length. How many tiles cover the tray?', [
      {
        teacherSay: 'Is the number being squared here one of the two rails, or something the two of them make between them?',
        expected: 'the whole edge, 12',
      },
      {
        childDo: 'Settle the whole edge as a single length, then lay that many rows of that many tiles.',
        expected: '144',
      },
    ], '144'),
    ge(10, 3, 'prompted', 'Which is larger, 2^5 or 5^2, and by how much?', [
      {
        childDo: 'Write each one out as its full line of factors, work both lines out, and take the smaller from the larger.',
        expected: '2^5 is larger, by 7',
      },
    ], '2^5 is larger, by 7'),
    ge(10, 4, 'independent', 'Every pass through a splitter cuts each cord into 3 cords. After the third pass there are 63 cords. How many were there after the first pass? Solve cold.', [
      { childDo: 'Decide first how many passes stand between the count you were given and the one you want.', expected: '7' },
    ], '7'),
  ],
  days: [
    // Day 1 — concept echo: a power met three ways, all single-step, no chain and
    // no choice yet. The warm-ups are ORDERED so the LAST is the D16 division:
    // the retrieval ramp moves a pack's final Day-1 warm-up onto Day 5, and Day 5
    // already carries the D21 write-an-expression format.
    [
      { gen: wOrderPlain, diff: 2 },
      { gen: wProduct, diff: 2 },
      { gen: wDivide, diff: 2 },
      { gen: evaluatePower(), diff: 3 },
      { gen: sitCubeStack, diff: 3 },
      { gen: orderOfOpsPower(), diff: 3 },
    ],
    // Day 2 — fluency + application: both discriminations, the
    // grouping-required chain, the has-distractor chain and the estimate-first
    // counter race. Three of the four chains this week owns open here, and no
    // two of them are posed alike.
    //
    // `powerBaseSwapTrap` is served ONCE all week, here, and that is a measured
    // decision rather than a placement one: among the powers it offers, "pick
    // the one with the bigger exponent" keys about half of its draws, because
    // the only pair of distinct whole numbers where the bigger exponent loses
    // is 2 and 3. The item is still the recipe's named discrimination and the
    // home of the repaired equal-card, so it is met on the day the contrast is
    // introduced — and the week's SECOND discrimination is the week's own,
    // where every readable surface measures at chance.
    [
      { gen: wOrderBracketed, diff: 2 },
      { gen: powerBaseSwapTrap(), diff: 3 },
      { gen: discrimBracketPlace, diff: 3 },
      { gen: msSquareEdge, diff: 4 },
      { gen: msTwoCountersEstimate, diff: 4 },
      { gen: msLooseAndTubes, diff: 4 },
    ],
    // Day 3 — interleave: Day 1's three single-step shapes come back two days
    // later against the bracket discrimination and the inverse-start chain, so
    // nothing on the page signals which kind of work is coming next.
    [
      { gen: wProduct, diff: 2 },
      { gen: evaluatePower(), diff: 3 },
      { gen: orderOfOpsPower(), diff: 3 },
      { gen: sitCubeStack, diff: 3 },
      { gen: msStrandRecover, diff: 4 },
      { gen: discrimBracketPlace, diff: 3 },
    ],
    // Day 4 — word problems: four chains, no two posed alike (one carries a
    // quantity that is never spent, one hands back a count from a later pass,
    // one asks for a comparison after an estimate, one forces a gathering the
    // sentence never asks for), wearing four different frames.
    [
      { gen: msSquareEdge, diff: 4 },
      { gen: msTwoCountersEstimate, diff: 5 },
      { gen: msLooseAndTubes, diff: 5 },
      { gen: msStrandRecover, diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, the
    // insert-a-bracket task with no candidates on the page at all, and a drawn
    // always/sometimes/never claim (+ a ramped warm-up).
    [
      { gen: wWriteExpr, diff: 2 },
      { gen: eaBaseTimesExponent(), diff: 4 },
      { gen: insertTheBracket, diff: 4 },
      { gen: powerClaimVerdict, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the mistake to watch for this week is not carelessness. Faced with 3^4, a child writes 12 — and they are not guessing, they are applying the rule they already have, that two numbers side by side get multiplied. Nothing about the shorthand tells them otherwise, which is why it is so common. The fix is never to say "no, it is 81". Ask them to write the power out as a full line of threes, then count how many threes the line needs. Once they have seen that the raised number is counting the line rather than joining it, the error does not come back.',
  ],
  puzzle: (r) => {
    // THE WEEK'S MOVE RUN BACKWARDS, and a move no day item makes: every item on
    // the daily pages hands over a base and an exponent and asks for the value.
    // The puzzle hands over the VALUE and asks which powers build it — a search
    // under a constraint rather than an evaluation. It also lands the child on
    // the week's own discrimination without naming it: for sixteen the answer is
    // 2^4 and 4^2, the one pair where the swap changes nothing.
    const [value, forms] = r.pick(MULTI_POWER);
    const written = forms.map(([b, e]) => power(b, e));
    return {
      id: 'E10-PZ-01',
      title: 'Puzzle Grove: One Number, Several Powers',
      puzzleType: 'logic',
      prompt: `Some numbers can be written as a power in more than one way, with the base and the exponent both above one. ${fmtInt(value)} is one of them. Write every power that comes to ${fmtInt(value)}, smallest base first. Then say in one sentence how you knew you had found them all.`,
      answer: {
        value: written.join(', '),
        acceptableForms: [written.join(' '), written.join(', ')],
        validation: 'ordered-list',
      },
      hintLadder: [
        'What has to be true of a number before it can be reached by multiplying one single factor over and over?',
        'Take each possible base in turn from the smallest upward, and multiply it by itself until you land on the number or pass it.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'alg-power-decompose' },
  sprint: {
    skill: 'Multiplication facts to 12 — the facts every line of factors is built out of',
    sourceWeek: D15,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 12] },
  },
  mastery: [
    { gen: sitCubeStack, diff: 3 },
    { gen: msSquareEdge, diff: 4 },
    { gen: evaluatePower(), diff: 3 },
    { gen: msStrandRecover, diff: 4 },
    { gen: orderOfOpsPower(), diff: 3 },
    { gen: msTwoCounters, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: one move apiece — a cube built out of cubes (a third power with the exponent never stated), a growth counted as a power and then valued, and an order-of-operations line with a power standing in the middle of it. 02/04/06: chains — a square whose edge is two pieces laid end to end, so the gathering has to happen before the squaring; a count belonging to a later pass, undone by as many divisions as the splitting took; and a counter that climbs against a counter that is multiplied, settled side by side. The estimate-first scaffold is deliberately absent from the mastery form of the last of these: a check is a habit to teach, not a prop to assess with. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'base-times-exponent',
      description: 'Reads a power as the two numbers multiplied together, so 3^4 is answered 12. It is not a guess: side by side, two numbers get multiplied, and that is the rule the child already holds. Nothing about the shorthand contradicts it, which is why this is the commonest error on the topic by a distance and why it survives being corrected once.',
      exampleWrongAnswer: '3^4 given as 12, and 2^5 as 10',
      distractorRationale: 'Offer the product of the base and the exponent, computed from the same two numbers the power states, so only reading what the raised number is counting separates it from the true value.',
      reteachPointer: 'explanation/script[0] (the same two numbers, two different jobs), then guidedExamples/E10-GE-01',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'left-to-right-through-a-power',
      description: 'Works the line from left to right, so the adding or the multiplying that stands before a power runs first and the power is collected too late. Every individual step is done correctly, which is why nothing in the working looks wrong; the result is out by whatever the power was hiding.',
      exampleWrongAnswer: '2 + 3^2 × 4 answered as 100, by adding the 2 and the 3 before anything else',
      distractorRationale: 'Offer the value the line gives when it is settled strictly left to right, which is a number the child genuinely computed and can therefore recognise.',
      reteachPointer: 'explanation/script[2] (a power was never in the queue), then the Day-1 order-of-operations items',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'base-and-exponent-trade-places',
      description: 'Treats the base and the exponent as a pair that can swap without consequence, the way the two numbers in a product can. So 2^3 and 3^2 are read as the same question, and a power written the other way round is not noticed as a different number. The single pair where the swap really does leave the value alone — two to the fourth and four squared — makes the habit feel safer than it is.',
      exampleWrongAnswer: '2^5 and 5^2 given as equal, both answered 32',
      distractorRationale: 'Offer the swapped power as a live card, and key "they are equal" on the one pair where it is true, so no card is offered more often than it is keyed.',
      reteachPointer: 'explanation/script[1] (the swap, and the one coincidence), then guidedExamples/E10-GE-03',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'spreads-the-power-across-a-sum',
      description: 'Raises the parts instead of the whole: given a square whose edge is two pieces laid end to end, squares each piece and adds the two squares. The reading is structural rather than careless — it is the same instinct that makes multiplying spread across a sum, applied where it does not hold — and it is also why a story that REQUIRES a bracket teaches more than a line that prints one.',
      exampleWrongAnswer: 'a square edged by 5 and 3 answered as 34 rather than 64',
      distractorRationale: 'Offer the value the ungrouped reading really produces, which is a competing number rather than a decoy, so only gathering the edge first separates the two.',
      reteachPointer: 'explanation/script[3] (the two rectangles the separate squares leave out), then guidedExamples/E10-GE-02',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'loses-a-factor-in-the-line',
      description: 'Writes the line of factors out correctly and then multiplies along it with one factor too few or too many, so 2^5 comes out 16 or 64. The method is entirely sound; what fails is keeping count of the line while the arithmetic is running, which is exactly what gets harder as the exponent grows.',
      exampleWrongAnswer: '2^5 answered as 16',
      distractorRationale: 'Offer the value of the same base with one fewer factor in the line, so the two differ only in how many times the factor was used.',
      reteachPointer: 'guidedExamples/E10-GE-01 (collecting the line before anything else happens), then the Day-1 growth item',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Exponents — reading a power as a repeated multiplication rather than a second product, telling the job of the base from the job of the exponent, settling a power before the multiplying and adding around it, deciding when a story forces a bracket, and putting a bracket into an expression to reach a stated target.',
    improvingCandidates: [
      'writing a power out as its full line of factors before working it out',
      'collecting a power into one number before the rest of an expression runs',
      'gathering an amount inside brackets before raising it',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reading the raised number as a count of the factors rather than as one of them',
      },
      {
        errorTag: 'procedure-slip',
        text: 'settling the power first wherever it stands in the line, instead of working left to right',
      },
      {
        errorTag: 'representation-misread',
        text: 'noticing that the base and the exponent are not interchangeable, and knowing the one pair where the swap changes nothing',
      },
      {
        errorTag: 'task-comprehension',
        text: 'raising the whole gathered amount rather than raising the parts and adding them',
      },
      {
        errorTag: 'fact-recall',
        text: 'keeping count of how many factors the line needs while the multiplying is going on',
      },
    ],
    homeFocus: {
      praiseLine:
        'You wrote the power out as a full line of factors before you touched anything else, and you estimated the size of the answer before you checked it — those two habits are what keep powers from running away from you.',
      questionForChild: 'If I tell you that a number is three multiplied by itself four times over, and someone else says that is the same as three times four, how would you show them it is not?',
      schoolSyncHook: 'Some classes say "to the power of", some say "index", some say "exponent", and some write the raised number differently on the board. Tell us which your child meets and these pages will use it.',
    },
    vocabularyForParent: [
      'power (a repeated multiplication written short — 3^4 means three used as a factor four times)',
      'base (the number that is repeated) and exponent (the raised number, which counts how many times)',
      'order of operations (brackets first, then powers, then multiplying and dividing, then adding and subtracting)',
    ],
  },
});
