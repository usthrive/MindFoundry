/**
 * Level E · Week 5 — "GCF, LCM & decimals" (conceptId: gcf-lcm-decimal-fluency).
 *
 * FILL-ARCHITECTURE §6 row E5: anchor "factor rectangles / common ladders"; key
 * multi-step "GCF then simplify"; error-analysis "LCM = just multiply them";
 * discrimination "GCF story vs LCM story (tiles vs meeting buses)"; Day-5
 * signature "one number pair, both tools". NOT R-flagged — every item below is
 * computable, and nothing ships as manual-review.
 *
 * THE WEEK'S CLAIM. Every number in this week is a COUNT OF A PIECE, and the
 * whole week is about choosing the piece. That single idea unifies what looks
 * like two unrelated halves:
 *  - the greatest common factor is the largest piece BOTH numbers can be
 *    counted in. It has to fit inside each of them, so it can never be larger
 *    than either — a fact about what the word means, not a rule to memorise;
 *  - the least common multiple is the first count both of their patterns
 *    REACH. It has to be reachable by each of them, so it can never be smaller
 *    than either. That is the mirror of the same sentence, read from the other
 *    end, and it is why the two tools sit in one week rather than two;
 *  - and a decimal point does exactly this job on a single number: it says
 *    which digit is counting which size of piece. Line two decimals up wrongly
 *    and you have added a count of tenths to a count of hundredths, which is
 *    the same mistake as measuring two rods with two different rulers and
 *    subtracting the readings.
 *
 * So the anchor is FACTOR RECTANGLES AND THE COMMON LADDER, and it is one
 * picture seen twice. Lay an a-by-b rectangle out in equal squares and the
 * largest square that fits both ways is the greatest common factor; walk the
 * two counting patterns down a hundred chart and the first square they both
 * land on is the least common multiple. The ladder — divide both by a shared
 * factor, again, until nothing is shared — is the same picture written down.
 *
 * DEEPENING vs D3 (BB-G1). D3 asked whether a number is prime, listed factor
 * pairs of ONE number, and named the kth multiple of ONE number. Every question
 * there lived inside a single number. This week every question needs TWO, and
 * that is the whole difference: a factor is only interesting here if it is
 * shared, a multiple only if it is reached twice. It is also where the two
 * words stop being interchangeable — D3 could let "factor" and "multiple" sit
 * side by side as vocabulary, and this week makes choosing between them the
 * assessed decision. The decimal strand is the catalog's own consolidation
 * ("multi-digit decimal operations"), and its deepening is likewise structural:
 * D14 and D20 posed decimal arithmetic bare or one step at a time, and here it
 * arrives inside chains, inside a placement decision with three live candidates,
 * and under an estimate that has to be made before the working.
 *
 * Each Level-E ceiling lift is carried by its own item, never doubled up:
 *  - INVERSE-START — `msBunchesRebuild`: the number of identical bundles IS the
 *    greatest common factor, and the story states it. Both deliveries have to be
 *    rebuilt out of it before anything can be compared, and no sentence asks for
 *    that;
 *  - CHECK-BACK — the same item, wrapped, because the honest check on a
 *    rebuilt pair is whether that many identical bundles is really as many as
 *    the two totals allow;
 *  - HAS-DISTRACTOR — `msJointArrival` states a ticket-office opening time in
 *    MINUTES, the same unit as the answer, and never spends it;
 *  - ESTIMATE-FIRST — `sitNextTogetherEstimate`, reachable ONLY through the
 *    wrapper (kit §E2.2), and its probe is a coin flip BY CONSTRUCTION (below).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SEVEN AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  1. THE SURFACE TRAP THIS TOPIC IS BUILT ON, AND HOW EVERY CARD SET DODGES IT.
 *     GCF(a,b) ≤ min(a,b) ≤ max(a,b) ≤ LCM(a,b) is arithmetic, not a
 *     construction choice. So ANY item that offers numbers as cards and asks
 *     "which is the GCF?" is won outright by "pick the smallest", and the LCM
 *     twin by "pick the largest" — the shape that shipped three times in this
 *     program (`ratio.additiveVsMultiplicativeGrowth`, `money.totalChoice`,
 *     `stats.symbolCountVsValue`, all at or near 100%). The week therefore
 *     contains NO card set whose options are a GCF and an LCM:
 *       · the recipe's discrimination (`discrimWhichTool`) keys a METHOD
 *         DESCRIPTION, not a value. Its three cards are fixed strings, so
 *         `parseValue` cannot rank them and neither can a child;
 *       · the Day-5 "one number pair, both tools" item is WRITTEN, with no
 *         cards at all, exactly because that page is where the two ranks would
 *         otherwise sit side by side;
 *       · every GCF and LCM value item is FREE-ENTRY, so there is no rank;
 *       · and the numeric card set the week does carry (`discrimPointPlace`)
 *         draws its offsets so the key is largest / middle / smallest in equal
 *         thirds.
 *     The named misconception is the rank-breaker as well as the content: the
 *     product a·b is larger than the LCM whenever the two numbers share a
 *     factor, which every draw in this week does (decision 2).
 *
 *  2. EVERY DRAWN PAIR SHARES A FACTOR, AND NEITHER NUMBER DIVIDES THE OTHER.
 *     Both halves are load-bearing and both were chosen against a measured
 *     strategy rather than for tidiness:
 *       · if one number divides the other, the GCF IS the smaller number and
 *         the LCM IS the larger, so "say the smaller" and "say the larger"
 *         answer the free-entry items for free;
 *       · if the two are coprime, "just multiply them" IS the LCM, and the
 *         week's own named misconception becomes a correct method.
 *     The pool is therefore built from a shared factor g ≥ 2 and two COPRIME
 *     co-factors u, v ≥ 2 (a = g·u, b = g·v). Then g < min(a,b) < max(a,b) <
 *     lcm < a·b on every single draw, with no exceptions to remember.
 *     Divisibility is also flat ACROSS the discrimination's three story types
 *     (decision 3), so "do these two share a factor?" — a surface a child can
 *     read without knowing which tool the story wants — says nothing.
 *
 *  3. `discrimWhichTool` DRAWS THE STORY TYPE FROM THREE, ONE PER CARD, and the
 *     third type is what makes the set honest. The natural pair of cards — the
 *     GCF reading and the LCM reading — leaves "the two numbers multiplied by
 *     each other" offered on every draw and keyed on none: the L38 permanently
 *     unkeyable card, found eight times in this program and twice in the two
 *     weeks written immediately before this one. The repair is not to drop the
 *     card but to give it its own story. A nursery with a benches of b trays
 *     really does want a × b, so the week's named misconception is met where it
 *     is RIGHT before it is met where it is wrong — which is what a
 *     misconception is: a good idea in the wrong place. Measured: no card above
 *     the third, no rank (the cards are prose), the correct rule at 100%.
 *
 *  4. THE RECIPE'S ERROR-ANALYSIS MISCONCEPTION — LCM "just multiply them" — IS
 *     NOT DERIVABLE FROM THE VERIFY LIBRARY, and the reason is structural
 *     rather than a missing case. Every verify template in the corpus varies the
 *     OPERATION over a FIXED ORDERED OPERAND PAIR:
 *     `d_verify_binop_misconception_v1` returns binop(a,b,op) against
 *     binop(a,b,wrongOp); `d_verify_frac_v1` / `d_verify_dec_v1` vary the
 *     fraction or decimal move over one pair. "Just multiply them" is not a
 *     different operation over the same pair — it is the SAME operation over a
 *     different second operand (a·b where lcm(a,b) belonged), so no choice of
 *     op and wrongOp can produce it. Four re-framings were tried and written
 *     out before this was accepted: (a,b) = (a·b, g) with op '/' gives the LCM
 *     correctly and no wrongOp gives a·b; (a/g, b) with op '*' likewise; the
 *     common-ladder slip (forgetting to multiply the shared factor back in)
 *     needs a·b/g² from an operand pair that cannot produce it; and choosing
 *     operands so that lcm(a,b) happens to equal a plain binop of a and b is
 *     the reverse-engineered coincidence kit §E2.3 forbids.
 *     So kit §E2.3's third option is taken, E4's precedent: the misconception is
 *     MOVED to where it can be shown honestly. It is a live, evaluable card on
 *     `discrimWhichTool` — where it is also the correct answer to its own story
 *     — it is the first entry in the mistakeBank, it is the 'sometimes' claim on
 *     the Day-5 always/sometimes/never item, and it is the trap the puzzle is
 *     built to spring. Day 5's error-analysis carries a DERIVABLE slip instead
 *     (decision 5). Nothing is faked and nothing is quietly dropped. Reported as
 *     a library gap, not fixed here.
 *
 *  5. THE DAY-5 ERROR-ANALYSIS IS THE DECIMAL-ALIGNMENT SLIP, and it is chosen
 *     because it is the week's other half told in the week's own words. Two
 *     amounts written to different numbers of places are added as digit strings,
 *     so a count of tenths lands on a count of hundredths — the same error as
 *     comparing two numbers counted in different-sized pieces, which is the
 *     sentence the whole week turns on. It is derivable exactly
 *     (`d_verify_dec_v1`, wrongMode 'right-align'), so QG-11 recomputes both the
 *     shown value and the truth. Its transform is D14's; what is E5's is the
 *     EXTENSION, which asks not for the sum but for what a digit's place tells
 *     you about the size of the piece it counts — the week's claim, applied to
 *     the strand that looks least like it.
 *
 *  6. NO GCF OR LCM ITEM CARRIES A `generator` SPEC, AND THAT IS DELIBERATE.
 *     There is no registered template anywhere in the corpus whose `answerFor`
 *     computes a greatest common factor or a least common multiple, so QG-5
 *     cannot audit one. Two dishonest ways out were available and both were
 *     refused: shipping an unregistered id (silently skipped by QG-5, and a hard
 *     fail in `bb-verify-packs` step 3c), or dressing the answer up in
 *     `d_multistep_rat_v1` as "start at a, multiply by b/g" — which would pass
 *     an audit whose only operand IS the answer, a green pin with no power over
 *     the claim it appears to check. The arithmetic instead runs through
 *     `compute.ts`'s own `gcd` and `lcm` (never a second implementation), and
 *     the absence of a generator spec is the honest surface: nothing on these
 *     items claims an audit that is not happening. The four multi-step items DO
 *     ship audited chains — but note precisely what that buys: the chain
 *     re-derives the arithmetic that FOLLOWS the shared factor, with the factor
 *     itself as a drawn operand. Reported as a library gap (a `d_gcf_v1` /
 *     `d_lcm_v1` pair in `lib/compute.ts` would close it in two lines).
 *
 *  7. ANSWER-IN-PROMPT AUDIT, one generator at a time, with the bound written
 *     beside the draw that carries it. Every co-factor is at least two, so:
 *     the shared factor is strictly below both printed numbers and the least
 *     common multiple strictly above both, on every draw of every item · the
 *     tile count u·v is stepped clear of both sides by a POOL FILTER (u ≠ g and
 *     v ≠ g), not a redraw · the braid share reduces to u/(u+v), whose two
 *     tokens are below the printed lengths because the shared factor is at
 *     least two · the joint-arrival answer is at least twenty-four minutes while
 *     the unspent opening time is at most twenty · the rebuilt-bundle difference
 *     is n·(u−v) with |u−v| ≥ 2 enforced by a pool filter, and every collision
 *     with a printed number is provably a |u−v| = 1 case · the simplest-form
 *     share is drawn from a list built with its own collision already removed ·
 *     the decimal chain's operands are enumerated before the pick. The library
 *     generators this week serves were measured at difficulty 3 over 3,000 draws
 *     by the orchestrator's guessability census before authoring began; the
 *     served slots are re-measured in the report.
 *
 * SHARED-FILE FINDING, REPORTED AND NOT FIXED. `AnswerSpec.requireSimplestForm`
 * is declared in `types.ts` and read by `answers.ts::checkAnswer` — and is set
 * by NOTHING anywhere in the corpus. So every "write it in its simplest form"
 * item ever shipped (D12, E1, E3, and both of this week's) is graded by value
 * alone: 12/28 is marked correct against a key of 3/7, and the simplify half of
 * "GCF then simplify" is never actually assessed. It is not fixable from a week
 * module either, because `SituationDraw` and `MultiStepDraw` have no field to
 * pass the flag through, so turning it on would mean bypassing the two factories
 * that own these item types — which is the silent simplification the kit forbids.
 * The flag is a declared-and-read enablement that reads an empty set (L50).
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5): `GATE_PROFILE.E.pictorialPerDay`
 * is 0, and this week earns no figure on an assessed item — a factor rectangle
 * with its tile drawn IS the greatest common factor, and a hundred chart with
 * the common multiples shaded IS the least common multiple, so either picture on
 * an assessed page hands over the answer the item asks for (L33). The pictures
 * therefore live in the lesson script and the modeled guided example, where the
 * answer is already on the page.
 *
 * Retrieval reaches backwards only, and to four places: D3 for factor pairs,
 * multiples and prime/composite (the single-number vocabulary this week makes
 * shared), D13 for rounding a decimal, D14 for column subtraction of decimals,
 * and D20 for decimal × decimal. Day 1's warm-ups are ORDERED so the LAST of
 * them is the D3 multiple: `applyRetrievalRamp` moves a pack's final Day-1
 * warm-up onto Day 5 after every gate has run, and Day 5 already carries the
 * decimal-multiplication format, so leaving either decimal warm-up last would
 * have put two decimal warm-ups on one served page with nothing able to see it.
 */

import {
  asWarmup,
  decAddSub,
  decMultiply,
  decRound,
  factorPair,
  multipleFill,
  primeChoice,
  reasoning,
} from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep, multiStepDec } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { drawUniqueItem } from '../lib/guard';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { article, countNoun } from '../lib/format';
import { addDec, formatDec, gcd, lcm, mulDec } from '../lib/compute';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, barModel, columnMethod, hundredChart } from '../lib/figures';
import { makeChoices } from '../shared';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D3 = { level: 'D' as const, week: 3 };
const D13 = { level: 'D' as const, week: 13 };
const D14 = { level: 'D' as const, week: 14 };
const D15 = { level: 'D' as const, week: 15 };
const D20 = { level: 'D' as const, week: 20 };

// ---------------------------------------------------------------------------
// THE NUMBER PAIR — the one object every GCF/LCM item in the week draws from
//
// A pair is (g, u, v): the shared factor and two COPRIME co-factors, giving
// a = g·u and b = g·v. Decision 2 above records why both constraints exist and
// what each of them kills. The invariants they buy, on every draw:
//
//     2 ≤ g < min(a, b) < max(a, b) < lcm(a, b) < a·b
//
// so no size heuristic — "say the smaller", "say the larger", "multiply them" —
// can ever be right, and none of them can ever be a near miss either.
// ---------------------------------------------------------------------------

/** Coprime co-factor pairs, both ≥ 2, u < v. */
const COFACTORS: ReadonlyArray<readonly [number, number]> = [
  [2, 3], [2, 5], [2, 7], [2, 9], [2, 11],
  [3, 4], [3, 5], [3, 7], [3, 8], [3, 10], [3, 11],
  [4, 5], [4, 7], [4, 9], [4, 11],
  [5, 6], [5, 7], [5, 8], [5, 9], [5, 11],
  [6, 7], [7, 8], [7, 9], [8, 9],
];

/**
 * The shared factors the week draws. Nineteen of them rather than a handful:
 * the greatest common factor IS the answer to four of the week's items, so the
 * size of this list is the size of their answer space, and a short list is the
 * `decPlaceValue` shape (nine distinct answers, top at 11.9%) applied to a
 * certifying slot rather than a warm-up.
 */
const SHARED_FACTORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 24];

/** Both printed numbers stay under this; the least common multiple under the next. */
const MAX_SIDE = 120;
const MAX_LCM = 400;

interface ToolPair {
  g: number;
  u: number;
  v: number;
}

/**
 * Every legal (g, u, v), filtered by a per-generator predicate. Enumerated ONCE
 * at module load, so a draw is two picks off a fixed list and never a resample
 * loop — the nudge-collapse signature the guessability census exists to catch
 * cannot arise (kit §E2.4).
 */
function buildPool(keep: (u: number, v: number, g: number) => boolean): ToolPair[] {
  const out: ToolPair[] = [];
  for (const g of SHARED_FACTORS) {
    for (const [u, v] of COFACTORS) {
      if (g * v > MAX_SIDE || g * u * v > MAX_LCM) continue;
      if (!keep(u, v, g)) continue;
      out.push({ g, u, v });
    }
  }
  if (!out.length) throw new Error('E5: a tool-pair pool came out empty — check MAX_SIDE / MAX_LCM');
  return out;
}

const POOL_ANY = buildPool(() => true);
/**
 * THE POOL FOR EVERY ITEM WHOSE ANSWER IS THE SHARED FACTOR, and the filter on
 * it was earned by measurement rather than reasoned out in advance.
 *
 * A shared factor always divides the DIFFERENCE of the two numbers, and it
 * EQUALS that difference exactly when the two co-factors are consecutive. With
 * consecutive pairs left in, "just subtract the two numbers" answered 36.2% of
 * served greatest-common-factor slots (2,500 measured) — a reflex a struggling
 * child genuinely reaches for, readable without doing any of the mathematics,
 * and invisible to every gate because each answer was correct. Requiring a
 * co-factor gap of at least two makes the shared factor strictly smaller than
 * the difference on every draw, so subtracting is never even close.
 *
 * The same filter is what keeps `msBunchesRebuild`'s answer, g·(u−v), clear of
 * the three numbers its prompt prints (§7 of the header).
 */
const POOL_GCF = buildPool((u, v) => v - u >= 2);
/**
 * The estimate probe's two halves. The probe asks whether two cycles meet again
 * BEFORE the slower of them has run three times — that is, whether
 * lcm = g·u·v is below or above 3·g·max(u,v), which is decided entirely by
 * min(u, v) against 3. So the two pools are min = 2 (they meet sooner) and
 * min ≥ 4 (they meet later); min = 3 is excluded from this generator alone,
 * because there the meeting falls exactly ON the third run and the probe would
 * have no honest answer.
 */
const POOL_MEET_SOON = buildPool((u) => u === 2);
const POOL_MEET_LATE = buildPool((u) => u >= 4);
/** Joint arrivals are counted in minutes and taken up to four times over. */
const POOL_JOINT = buildPool((u, v, g) => g * u * v <= 90);
/**
 * Anything measured in centimetres keeps its shorter side at twelve or more.
 * Without the floor the draw serves a 6 cm by 10 cm splashback and a 4 cm
 * length of copper wire — arithmetically impeccable and not a thing.
 */
const POOL_PANEL = buildPool((u, v, g) => u !== g && v !== g && g * Math.min(u, v) >= 12);
const POOL_LENGTH = buildPool((u, v, g) => g * Math.min(u, v) >= 12);

/**
 * Draw uniformly over the SHARED FACTOR, then over that factor's pairs — for
 * items whose ANSWER is the shared factor, so their answer space is flat.
 */
function drawByFactor(r: Rng, pool: ToolPair[]): ToolPair {
  const gs = [...new Set(pool.map((p) => p.g))];
  const g = r.pick(gs);
  return r.pick(pool.filter((p) => p.g === g));
}

/**
 * Draw uniformly over the CO-FACTOR PAIR, then over the factors that admit it —
 * for items whose answer is built from u and v (a tile count, a share), so that
 * THEIR answer space is the flat one. Flattening the axis the answer lives on
 * is the whole point; flattening the other axis would concentrate it, because
 * a large shared factor admits only the small co-factor pairs.
 */
function drawByCofactor(r: Rng, pool: ToolPair[]): ToolPair {
  const keys = [...new Set(pool.map((p) => `${p.u}:${p.v}`))];
  const key = r.pick(keys);
  return r.pick(pool.filter((p) => `${p.u}:${p.v}` === key));
}

interface Sides {
  a: number;
  b: number;
  g: number;
  /** The co-factor of `a`, and of `b` — which of u, v each is depends on the flip. */
  ua: number;
  ub: number;
  l: number;
}

/** Print the pair in a drawn order, so the larger number is not always second. */
function sidesOf(r: Rng, p: ToolPair): Sides {
  const flip = r.chance(0.5);
  const ua = flip ? p.v : p.u;
  const ub = flip ? p.u : p.v;
  return { a: p.g * ua, b: p.g * ub, g: p.g, ua, ub, l: p.g * p.u * p.v };
}

// ---------------------------------------------------------------------------
// Scenery. Each pool was grepped against the whole weeks directory and against
// the local pools of E3 and E4 — the two weeks a learner meets immediately
// before this one — on the day this week was finished (kit §E2.8). Nothing here
// repeats a scene any of them uses.
// ---------------------------------------------------------------------------

/** Two kinds of one thing, split into identical sets — the GCF frame. */
const BUNDLE_SCENES = [
  { who: 'A glazier', one: 'clear panes', two: 'tinted panes', out: 'crates' },
  { who: 'A bookbinder', one: 'marbled sheets', two: 'plain sheets', out: 'folders' },
  { who: 'A cobbler', one: 'brass eyelets', two: 'steel eyelets', out: 'kits' },
  { who: 'A thatcher', one: 'reed sheaves', two: 'sedge sheaves', out: 'loads' },
] as const;

/**
 * Flat rectangles laid in equal squares — the factor-rectangle frame. Every
 * scene is something that is genuinely a few tens of centimetres across, and
 * the pool it draws from carries a 12 cm floor (POOL_PANEL): the first version
 * of this list held "a porch floor", which the draw was perfectly happy to
 * serve at 6 cm by 10 cm. Found by reading the served pack, not by a gate.
 */
const PANEL_SCENES = [
  { what: 'A terrazzo splashback', tile: 'stone' },
  { what: 'A marquetry panel', tile: 'veneer' },
  { what: 'A tea-tray inlay', tile: 'ceramic' },
  { what: 'A window sill facing', tile: 'slate' },
] as const;

/**
 * Two repeating cycles started together — the LCM frame.
 *
 * The bare infinitive is a FIELD rather than a strip of the third-person 's'.
 * Stripping it built "before they flashe together again" on every quayside-lamp
 * draw — a third of this generator's served items — and no gate saw it, because
 * a misspelling is not a validation failure. The hand-measurement harness found
 * it by failing to classify the item.
 */
const CYCLE_SCENES = [
  { one: 'A harbour foghorn', two: 'a channel bell', past: 'sounded', now: 'sounds', bare: 'sound' },
  { one: 'A cuckoo clock', two: 'a tower bell', past: 'chimed', now: 'chimes', bare: 'chime' },
  { one: 'A quayside lamp', two: 'a signal lamp', past: 'flashed', now: 'flashes', bare: 'flash' },
] as const;

/** Two lengths cut into equal pieces — the GCF-then-simplify frame. */
const BRAID_SCENES = [
  { one: 'gold braid', two: 'silver braid' },
  { one: 'linen tape', two: 'cotton tape' },
  { one: 'copper wire', two: 'brass wire' },
] as const;

/** Part-of-a-load records — the simplest-form frame. */
const CARGO_SCENES = [
  { who: 'A barge', many: 'crates', what: 'unloaded at the first lock' },
  { who: 'A trawler', many: 'boxes', what: 'packed with ice' },
  { who: 'A dredger', many: 'buckets', what: 'sieved for gravel' },
] as const;

/** Poured liquids to two different numbers of places — the decimal frame. */
const POUR_SCENES = [
  { who: 'A dye house', liquid: 'mordant', vessel: 'bath' },
  { who: 'A cider press', liquid: 'juice', vessel: 'vat' },
  { who: 'A perfumery', liquid: 'tincture', vessel: 'still' },
] as const;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** D3 — a factor pair of one number. The move this week makes shared. */
const wFactorPair = asWarmup(factorPair(), D3);
/** D3 — prime or composite: whether a number has any factor to share at all. */
const wPrime = asWarmup(primeChoice(), D3);
/** D3 — the kth multiple of one number, which is the counting pattern the least
 *  common multiple asks two numbers to walk at once. */
const wMultiple = asWarmup(multipleFill(), D3);
/** D13 — rounding a decimal to the hundredth, so the estimate habit this week
 *  leans on has its arithmetic already in hand. */
const wDecRound = asWarmup(decRound(2), D13);
/** D14 — column subtraction of decimals: the alignment the Day-5 error-analysis
 *  is about, met once as a working skill before it is met as a slip. */
const wDecSub = asWarmup(decAddSub(-1), D14);
/** D20 — decimal × decimal, the computation `discrimPointPlace` decides about. */
const wDecMul = asWarmup(decMultiply(true), D20);

// ---------------------------------------------------------------------------
// The two tools, bare
//
// Free-entry on purpose (decision 1): a card set of numbers here is won by
// "pick the smallest" and "pick the largest" respectively, and there is no
// construction that removes that while the options are still values.
// ---------------------------------------------------------------------------

/**
 * The greatest common factor of a drawn pair.
 *
 * No leak by construction, in one line: both co-factors are at least two, so
 * the answer is strictly smaller than both numbers the prompt prints. The draw
 * is factor-uniform, so the answer space is the nineteen shared factors evenly.
 */
const gcfBare: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const s = sidesOf(r, drawByFactor(r, POOL_GCF));
    return {
      type: 'computation' as const,
      prompt: `What is the greatest common factor of ${s.a} and ${s.b}?`,
      answer: { value: String(gcd(s.a, s.b)), acceptableForms: [], validation: 'exact-numeric' as const },
      difficulty,
      strand: 'computational' as const,
      isRetrieval: false,
      hintLadder: [
        'What would you have to be able to do with a number before it can count as shared by these two?',
        'Take the factors out of the pair one at a time, and stop when the two numbers left have nothing in common.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'] as ErrorTag[],
      authorMeta: { stepCount: 1, cognitiveOp: 'gcf-find' },
    };
  });

/**
 * The least common multiple of a drawn pair.
 *
 * No leak by construction: both co-factors are at least two, so the answer is
 * strictly larger than both printed numbers; and the shared factor is at least
 * two, so the answer is strictly smaller than their product — which is what
 * keeps the week's named misconception wrong on every draw rather than on most.
 */
const lcmBare: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const s = sidesOf(r, drawByFactor(r, POOL_ANY));
    return {
      type: 'computation' as const,
      prompt: `What is the least common multiple of ${s.a} and ${s.b}?`,
      answer: { value: String(lcm(s.a, s.b)), acceptableForms: [], validation: 'exact-numeric' as const },
      difficulty,
      strand: 'computational' as const,
      isRetrieval: false,
      hintLadder: [
        'Which of the two counting patterns here has further to travel before it can meet the other one?',
        'Walk the larger number up in steps of itself, and stop at the first step the smaller one also lands on.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'] as ErrorTag[],
      authorMeta: { stepCount: 1, cognitiveOp: 'lcm-find' },
    };
  });

// ---------------------------------------------------------------------------
// Single-step word problems — the two tools in their own stories
// ---------------------------------------------------------------------------

/**
 * The GCF as a count of identical sets. This is the reading that makes the
 * greatest common factor a NUMBER OF GROUPS rather than a size, and it is why
 * the inverse-start item below can hand it back as a given.
 *
 * No leak by construction: the answer is the shared factor, strictly below both
 * printed counts.
 */
const sitEqualBundles: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const scene = r.pick(BUNDLE_SCENES);
    const s = sidesOf(r, drawByFactor(r, POOL_GCF));
    return {
      type: 'word-problem' as const,
      prompt: `${scene.who} has ${countNoun(s.a, scene.one)} and ${countNoun(s.b, scene.two)}. They are packed into identical ${scene.out}, with none of either kind left over, and as many ${scene.out} as the two counts allow. How many ${scene.out} is that?`,
      answer: {
        value: String(gcd(s.a, s.b)),
        acceptableForms: [countNoun(gcd(s.a, s.b), scene.out)],
        validation: 'exact-numeric' as const,
        units: scene.out,
      },
      difficulty,
      strand: 'computational' as const,
      isRetrieval: false,
      hintLadder: [
        'If every set has to hold the same of each kind, what has the number of sets got to do to both of the counts?',
        'Look for the largest number of sets that leaves nothing over from either kind at the same time.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'] as ErrorTag[],
      authorMeta: { stepCount: 1, cognitiveOp: 'gcf-bundle', situationType: 'sharing' },
    };
  });

/**
 * The LCM as the first meeting of two cycles, and the week's ESTIMATE-FIRST
 * carrier — with the probe a coin flip BY CONSTRUCTION rather than by hope
 * (kit §E2.9a). The probe asks whether the two meet again before the slower of
 * them has run three times; that is decided entirely by the smaller co-factor
 * against three (see POOL_MEET_SOON / POOL_MEET_LATE), so the outcome is drawn
 * first and the pair is then built on the matching side. Nothing about the page
 * leans, and the exact-tie case is excluded rather than argued about.
 *
 * No leak by construction: the answer is the least common multiple, strictly
 * above both printed intervals.
 */
const sitNextTogether: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const scene = r.pick(CYCLE_SCENES);
    const soon = r.chance(0.5);
    const s = sidesOf(r, drawByFactor(r, soon ? POOL_MEET_SOON : POOL_MEET_LATE));
    return {
      type: 'word-problem' as const,
      prompt: `${scene.one} ${scene.now} every ${countNoun(s.a, 'seconds')} and ${scene.two} every ${countNoun(s.b, 'seconds')}. They ${scene.past} together just now. How many seconds pass before they ${scene.bare} together again?`,
      answer: {
        value: String(lcm(s.a, s.b)),
        acceptableForms: [countNoun(lcm(s.a, s.b), 'seconds')],
        validation: 'exact-numeric' as const,
        units: 'seconds',
      },
      difficulty,
      strand: 'computational' as const,
      isRetrieval: false,
      hintLadder: [
        'What has to be true of a moment before BOTH of these can be happening at it?',
        'Count forward in the longer of the two gaps, and stop at the first count the shorter gap also reaches.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'] as ErrorTag[],
      authorMeta: { stepCount: 1, cognitiveOp: 'lcm-meet', situationType: 'measurement' },
    };
  });
const sitNextTogetherEstimate = withEstimateFirst(
  sitNextTogether,
  'will they come together again before the slower of the two has run three times, or after?',
);

/**
 * THE RECIPE'S "GCF THEN SIMPLIFY", AS A SINGLE STEP. A share is stated over a
 * total and has to come back in lowest terms, which is a greatest common factor
 * used without ever being named — the form the skill takes for the rest of a
 * learner's life.
 *
 * Answered through the REGISTERED `ratio_part_whole_v1`, whose `answerFor` is
 * `formatFrac(reduceFrac(p, p + q))`, so QG-5 re-derives the reduced share from
 * the same params the prompt is built from. It is one of the four audited
 * generators in a week whose headline concept has no audit at all (decision 6).
 *
 * No leak by construction: the legal (p, q, m) triples are enumerated at module
 * load with the one collision that can arise — a reduced denominator equal to
 * the printed part — already removed, so the pick cannot land on it.
 */
interface ShareTriple {
  p: number;
  q: number;
  m: number;
}
const SHARE_TRIPLES: ShareTriple[] = (() => {
  const out: ShareTriple[] = [];
  for (let p = 1; p <= 8; p++) {
    for (let q = 1; q <= 9; q++) {
      if (gcd(p, q) !== 1) continue;
      for (let m = 2; m <= 9; m++) {
        if (m * (p + q) > MAX_SIDE) continue;
        if (p + q === m * p) continue; // the reduced denominator would print as the part
        out.push({ p, q, m });
      }
    }
  }
  return out;
})();

const sitSimplestShare = situation({
  situationType: 'part-whole',
  cognitiveOp: 'gcf-simplify-share',
  draw: (r) => {
    const scene = r.pick(CARGO_SCENES);
    const t = r.pick(SHARE_TRIPLES);
    const part = t.m * t.p;
    const whole = t.m * (t.p + t.q);
    return {
      prompt: `${scene.who} carried ${countNoun(whole, scene.many)} and ${part} of them were ${scene.what}. What fraction of the ${scene.many} were ${scene.what}? Write the fraction in its simplest form.`,
      answerValue: `${t.p}/${t.p + t.q}`,
      templateId: 'ratio_part_whole_v1',
      params: { p: part, q: t.m * t.q },
      validation: 'equivalent-fraction',
      acceptableForms: [],
      hints: [
        'Which of these two numbers counts everything that was carried, and which counts only the part the sentence picks out?',
        'Set the named group against the whole load, then take out the largest number that divides the top and the bottom together.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: four shapes, so "two steps" never becomes one template
// ---------------------------------------------------------------------------

/**
 * THE FACTOR RECTANGLE, COUNTED. Find the largest square that tiles an a-by-b
 * rectangle, then say how many of them it takes — the anchor's own picture with
 * the picture taken away.
 *
 * Drawn by CO-FACTOR, because the answer is u·v and that is the axis its answer
 * space lives on. The chain audits the multiply that follows the shared factor,
 * with the factor itself as an operand (decision 6).
 *
 * No leak by construction: POOL_PANEL excludes u = g and v = g, which are the
 * only ways u·v can equal a printed side; it also carries the 12 cm floor.
 */
const msTileTheFloor = multiStep({
  situationType: 'area',
  cognitiveOp: 'gcf-then-count',
  draw: (r) => {
    const scene = r.pick(PANEL_SCENES);
    const s = sidesOf(r, drawByCofactor(r, POOL_PANEL));
    return {
      prompt: `${scene.what} measures ${countNoun(s.a, 'cm')} by ${countNoun(s.b, 'cm')}. It is laid with square ${scene.tile} tiles, all one size, with no tile cut and none overlapping, and each tile as large as the two sides allow. How many tiles does it take?`,
      initN: s.a,
      steps: [
        { op: 'div' as const, n: s.g, d: 1 },
        { op: 'mul' as const, n: s.ub, d: 1 },
      ],
      units: 'tiles',
      hints: [
        'Before anything can be counted here, what has the side of one tile got to do to each of the two measurements?',
        'Settle the largest tile that fits along both sides, then count the tiles along each side and put the two counts together.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * THE RECIPE'S KEY MULTI-STEP (§6 row E5, "GCF then simplify"), in its
 * two-quantity form. The greatest common factor decides the piece length; the
 * two piece counts it produces then have to be written as a share, and that
 * share is asked for in lowest terms — a second, quieter use of the same tool.
 *
 * Drawn by CO-FACTOR, because the answer is u/(u+v).
 *
 * No leak by construction: the reduced share is u/(u+v) exactly (u and v are
 * coprime, so u and u+v are too), and both of its tokens are strictly below the
 * printed lengths because the shared factor is at least two. The one algebraic
 * near miss — u+v equal to a printed length — forces one of the co-factors to
 * be 1, which the pool never produces.
 */
const msBraidPieces = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'gcf-then-simplify',
  usesPriorSkill: true,
  draw: (r) => {
    const scene = r.pick(BRAID_SCENES);
    const s = sidesOf(r, drawByCofactor(r, POOL_LENGTH));
    return {
      prompt: `A length of ${scene.one} measures ${countNoun(s.a, 'cm')} and a length of ${scene.two} measures ${countNoun(s.b, 'cm')}. Both are cut into equal pieces, all one length, with none left over and each piece as long as the two lengths allow. What fraction of all the pieces comes from the ${scene.one}? Write the fraction in its simplest form.`,
      initN: s.a,
      initD: 1,
      steps: [
        { op: 'div' as const, n: s.g, d: 1 },
        { op: 'div' as const, n: (s.a + s.b) / s.g, d: 1 },
      ],
      validation: 'equivalent-fraction' as const,
      hints: [
        'Which of the two lengths does the fraction you are asked for sit on top of, and which one is underneath?',
        'Cut both lengths into the longest piece they can share, count the pieces each one gives, and write the first count over the two counts together.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3), on the LCM side. The chain is
 * the common ladder written out: the least common multiple is the first
 * interval multiplied by whatever the second one contributes that the first
 * does not already supply, and the question then asks for several of them.
 *
 * The unspent quantity is a TICKET-OFFICE OPENING TIME IN MINUTES — the same
 * unit as the answer, which is what makes it the seductive kind rather than
 * scenery a child ignores.
 *
 * No leak by construction: the least common multiple is at least twelve and the
 * answer takes it at least twice, so the answer is at least twenty-four, while
 * the opening time is at most twenty and both intervals are below the least
 * common multiple.
 */
const ORDINAL_WORD: Record<number, string> = { 2: 'second', 3: 'third', 4: 'fourth' };

const msJointArrival = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'lcm-then-scale',
  posing: 'has-distractor',
  draw: (r) => {
    const s = sidesOf(r, drawByFactor(r, POOL_JOINT));
    // The answer is k·lcm and the product of the two intervals is g·lcm, so
    // "just multiply the two numbers" is right exactly when the ordinal equals
    // the shared factor. Measured at 6.5% of served slots before this line —
    // above the 5% line §2(b) of the brief calls a defect rather than residue.
    // Stepped, not redrawn: it consumes no rng draw (kit §E2.4, L19).
    const k0 = r.int(2, 4);
    const k = k0 === s.g ? (k0 === 4 ? 2 : k0 + 1) : k0;
    const opens = r.int(5, 20);
    return {
      prompt: `A tram passes the pier every ${countNoun(s.a, 'minutes')} and a funicular every ${countNoun(s.b, 'minutes')}, and one of each passed together at the start of the day. The ticket office opens ${countNoun(opens, 'minutes')} before the first of those. How many minutes after the start of the day is the ${ORDINAL_WORD[k]} time the two pass together again?`,
      initN: s.a,
      steps: [
        { op: 'mul' as const, n: s.ub, d: 1 },
        { op: 'mul' as const, n: k, d: 1 },
      ],
      units: 'minutes',
      hints: [
        'Which numbers here belong to the two services running, and which one belongs to the ticket office?',
        'Find the first moment both services land together, then take as many of those stretches as the question asks for.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3, the Level-E lift). The number of
 * identical bundles IS the greatest common factor of the two deliveries, and
 * the story states it — so everything the child is asked about has to be
 * rebuilt out of a quantity that is usually the thing being looked for. No
 * sentence asks for that rebuild; reading that the bundle count is what the two
 * totals share is the whole plan.
 *
 * Served through the check-back wrapper, because the honest check on a rebuilt
 * pair is not the arithmetic but whether that many identical bundles really is
 * as many as the two totals allow — the week's own rule, run forwards over the
 * answer the child has just produced.
 *
 * No leak by construction: POOL_GCF enforces a co-factor gap of at least two,
 * and every way the answer n·(u−v) can equal one of the three printed numbers
 * forces that gap to be exactly one.
 */
const msBunchesRebuild = multiStep({
  situationType: 'combine',
  cognitiveOp: 'gcf-inverse-rebuild',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const p = drawByFactor(r, POOL_GCF);
    const many = p.v;
    const few = p.u;
    return {
      prompt: `A mill divided a delivery into ${countNoun(p.g, 'identical bundles')}, using every reel and making as many bundles as the delivery allowed. Each bundle holds ${countNoun(many, 'linen reels')} and ${countNoun(few, 'cotton reels')}. How many more linen reels than cotton reels were delivered?`,
      initN: p.g,
      steps: [
        { op: 'mul' as const, n: many, d: 1 },
        { op: 'sub' as const, n: p.g * few, d: 1 },
      ],
      units: 'reels',
      hints: [
        'Does the number of bundles describe one kind of reel, or something the two deliveries have in common?',
        'Build each delivery back up out of its bundles, then set the two totals against each other.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const msBunchesRebuildCheck = withCheckBack(
  msBunchesRebuild,
  'take the two totals you rebuilt and say whether that many identical bundles really is as many as they allow.',
);

/**
 * The decimal strand's chain — the catalog's "multi-digit decimal operations
 * consolidation" placed where D14 and D20 could not put it: inside a two-step
 * story where the division has to happen before the addition, and where the
 * answer carries more decimal places than either operand.
 *
 * Answered through the REGISTERED `d_multistep_dec_v1`, on exact scaled
 * integers throughout — never a float (`lib/ratio.ts`'s header law, broken once
 * this program by drawing money in twenty-cent steps).
 *
 * No leak by construction: the legal amounts already in a vessel are enumerated
 * BEFORE the pick, with every value whose sum would print one of the prompt's
 * own numbers removed from the list — so the pick cannot land on one and no
 * draw is spent stepping past it.
 */
const decVesselChain = multiStepDec({
  situationType: 'measurement',
  cognitiveOp: 'dec-divide-then-add',
  draw: (r) => {
    const scene = r.pick(POUR_SCENES);
    const k = r.int(3, 8);
    const q = formatDec(r.int(12, 96), 1); // 1.2 – 9.6 litres per vessel
    const total = mulDec(q, String(k));
    const legal: string[] = [];
    for (let ei = 105; ei <= 495; ei += 5) {
      const held = formatDec(ei, 2);
      const sum = addDec(q, held);
      if (sum !== total && sum !== String(k) && sum !== held) legal.push(held);
    }
    const held = r.pick(legal);
    return {
      prompt: `${scene.who} shares ${countNoun(total, 'litres')} of ${scene.liquid} equally between ${countNoun(k, scene.vessel)}. Each ${scene.vessel} already held ${countNoun(held, 'litres')}. How many litres does one ${scene.vessel} hold now?`,
      init: total,
      steps: [
        { op: 'div' as const, v: String(k) },
        { op: 'add' as const, v: held },
      ],
      units: 'litres',
      hints: [
        'Which of these amounts belongs to all of the vessels together, and which one belongs to a single vessel?',
        'Share the poured amount out first, then bring in what a single vessel was already holding.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the two decisions this week turns on
//
// One is which of the week's tools a story is asking for (the recipe's own);
// one is where a decimal point belongs once the digits are settled. Neither can
// be answered by the other's habit: the first never asks for a value, and the
// second never asks which operation applies.
// ---------------------------------------------------------------------------

type Tool = 'gcf' | 'lcm' | 'product';
const TOOLS: readonly Tool[] = ['gcf', 'lcm', 'product'];

/**
 * The three cards. They are METHOD DESCRIPTIONS, not values, and that is the
 * whole design (decision 1): a card set of numbers on this topic is answered by
 * "pick the smallest" or "pick the largest" without reading a word. As prose
 * they carry no numeric rank at all, and their lengths are close enough that
 * "pick the longest card" is nothing but a third.
 */
const TOOL_CARD: Record<Tool, string> = {
  gcf: 'the largest number that is a factor of both',
  lcm: 'the smallest number that is a multiple of both',
  product: 'the two numbers multiplied by each other',
};

/**
 * The stories, one family per card, so every card is keyed on a third of draws
 * and none of them is the L38 permanently-unkeyable option (decision 3). All
 * three families draw the SAME pair pool, so "do these two share a factor?" —
 * the one thing about this topic a child can check without deciding anything —
 * is flat across the three and settles nothing.
 */
const TOOL_STORIES: Record<Tool, ReadonlyArray<(a: number, b: number) => string>> = {
  gcf: [
    (a, b) => `A glazier packs ${a} clear panes and ${b} tinted panes into identical crates, using every pane and making as many crates as the panes allow. How many crates is that?`,
    (a, b) => `A mason cuts ${article(a, 'cm rod')} and ${article(b, 'cm rod')} into equal pieces, with none left over and each piece as long as the two rods allow. How long is one piece?`,
    (a, b) => `A bookbinder splits ${a} marbled sheets and ${b} plain sheets into identical folders, using every sheet and making as many folders as the sheets allow. How many folders is that?`,
  ],
  // Deliberately NOT the foghorn / cuckoo / quayside scenes: those belong to
  // `sitNextTogether` and to the completion guided example, and a discrimination
  // card whose story is a served item's story with the numbers changed teaches a
  // child to recognise the sentence rather than to read it.
  lcm: [
    (a, b) => `Rivets come in strips of ${a} and grommets in strips of ${b}. A fitter needs the two counts to come out equal, using as few whole strips of each as possible. How many rivets is that?`,
    (a, b) => `A sprinkler turns full circle every ${a} seconds and a second sprinkler every ${b} seconds, and both faced the gate just now. How many seconds pass before both face the gate together again?`,
    (a, b) => `A ferris wheel seat returns to the platform every ${a} seconds and a carousel horse every ${b} seconds, and both were at the front just now. How many seconds pass before both are at the front at once?`,
  ],
  product: [
    (a, b) => `A nursery has ${a} benches with ${b} seed trays standing on each of them. How many seed trays is that?`,
    (a, b) => `A printing press runs ${a} sheets through the rollers ${b} times each. How many sheet passes is that?`,
    (a, b) => `A weaver threads ${a} frames and puts ${b} bobbins on every frame. How many bobbins is that?`,
  ],
};

/** The reading that lands on a card that is not the answer TO THIS STORY. */
function toolRationale(truth: Tool, card: Tool): { tag: ErrorTag; text: string } {
  if (card === 'product') {
    return {
      tag: 'concept-misconception',
      text: truth === 'gcf'
        ? 'Multiplies because two numbers are standing there. The product is a number both of them divide into, so it can be reached by both — but this question is asking what they are both BUILT from, and a product is larger than either.'
        : 'Multiplies because two numbers are standing there. The product is always a common multiple, so this looks safe, and it is the first common multiple only when the two share no factor at all — which is not the case here.',
    };
  }
  if (card === 'gcf') {
    return {
      tag: 'task-comprehension',
      text: truth === 'lcm'
        ? 'Reaches for what the two numbers share, when the question is about where their two counting patterns arrive together. What they share sits below both of them; a meeting point has to sit above both.'
        : 'Reaches for the shared factor, when the question here is not about splitting either number up at all — nothing is being divided and nothing is being matched.',
    };
  }
  return {
    tag: 'task-comprehension',
    text: truth === 'gcf'
      ? 'Reaches for where the two counting patterns meet, when the question is about the largest piece both numbers can be broken into. A meeting point sits above both numbers; this answer has to sit below them.'
      : 'Reaches for a meeting point, when nothing in this question repeats and nothing has to line up — the two numbers are a count of groups and a count within a group.',
  };
}

/**
 * THE RECIPE'S DISCRIMINATION (§6 row E5, "GCF story vs LCM story"). The story
 * TYPE is drawn first, in equal thirds; the scene and the numbers follow. So no
 * card is offered more often than it is keyed, nothing about the numbers leans,
 * and the one reading that answers the item — what the story is asking the two
 * numbers to do — is the reading the week exists to teach.
 */
const discrimWhichTool = discrimination({
  variant: 'structural',
  cognitiveOp: 'gcf-lcm-choose-tool',
  draw: (r) => {
    const truth = r.pick(TOOLS);
    const story = r.pick(TOOL_STORIES[truth]);
    const s = sidesOf(r, drawByFactor(r, POOL_ANY));
    return {
      prompt: `${story(s.a, s.b)} Which of these does that question ask you to work out?`,
      correct: TOOL_CARD[truth],
      distractors: TOOLS.filter((t) => t !== truth).map((t) => ({
        text: TOOL_CARD[t],
        errorTag: toolRationale(truth, t).tag,
        rationale: toolRationale(truth, t).text,
      })),
      hints: [
        'Is this question about breaking the two numbers up, about waiting for them to agree, or about neither?',
        'Say out loud what one of the answers would be a count of, and keep the description that matches.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * WHERE THE POINT BELONGS ONCE THE DIGITS ARE SETTLED — the decimal strand's
 * decision, and the one numeric card set in the week.
 *
 * THE FIRST VERSION OF THIS ITEM WAS BUILT BY SHIFTING THE ANSWER'S POINT, AND
 * IT IS WORTH RECORDING WHY THAT FAILED, BECAUSE THE RANK WAS FINE. Drawing the
 * offset pair from {both left, one each, both right} put the key largest,
 * middle and smallest in exact thirds — measured 34.3 / 31.3 / 34.3 over 600
 * served packs. And "pick the SHORTEST card" still scored 49.6%. Character
 * length is anti-correlated with value on a decimal (a smaller number carries a
 * leading zero and an extra place), so a balanced value rank does not buy a
 * balanced length rank: moving a point LEFT always adds a character while moving
 * it RIGHT often adds none, so the key ties for shortest on half the draws. A
 * search over seven offset menus put every one of them between 45% and 50% —
 * the surface is structural, not a bad choice of offsets. (Brief §4 exactly: the
 * rank was fixed and a second surface was still sitting there.)
 *
 * So the item is built the other way round. The DIGIT STRING is fixed at four
 * digits and the three cards are the three placements of the point strictly
 * INSIDE it — after the first, second or third digit. Every card is then five
 * characters long, and there is nothing left for a length strategy to read. The
 * true placement is drawn in thirds and the two factors are then built to match
 * it, so the key is smallest, middle and largest in exact thirds as well. The
 * only reading left is the one the item assesses: count the decimal places the
 * two factors carry between them and put the point that far from the right.
 */
interface PlaceCase {
  /** The four-digit product mantissa; never ends in 0, so nothing trims. */
  digits: number;
  /** The two factor mantissas and their scales. */
  ma: number;
  sa: number;
  mb: number;
  sb: number;
  /** Digits before the point in the true answer: 1, 2 or 3. */
  j: number;
}

/**
 * Enumerated once at module load. `ma·mb` must land on exactly four digits and
 * must not end in a zero — `formatDec` trims trailing zeros, and a trimmed
 * product would break the equal-length property the whole design rests on.
 */
const PLACE_CASES: PlaceCase[] = (() => {
  const out: PlaceCase[] = [];
  const scalePairs: ReadonlyArray<readonly [number, number]> = [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1]];
  for (let ma = 11; ma <= 99; ma++) {
    for (let mb = 11; mb <= 99; mb++) {
      const digits = ma * mb;
      if (digits < 1000 || digits > 9999 || digits % 10 === 0) continue;
      for (const [sa, sb] of scalePairs) {
        const j = 4 - (sa + sb);
        if (j < 1 || j > 3) continue;
        out.push({ digits, ma, sa, mb, sb, j });
      }
    }
  }
  if (!out.length) throw new Error('E5: no legal point-placement cases');
  return out;
})();

/** The four-digit string with the point after digit `j`. Always five characters. */
function placeAt(digits: number, j: number): string {
  const s = String(digits);
  return `${s.slice(0, j)}.${s.slice(j)}`;
}

function placeRationale(offset: number): { tag: ErrorTag; text: string } {
  return offset > 0
    ? {
      tag: 'representation-misread',
      text: 'Sets the point one place too far to the right, which is what happens when one of the decimal places the two factors carry between them goes uncounted — the answer then comes out ten times too large.',
    }
    : {
      tag: 'procedure-slip',
      text: 'Sets the point one place too far to the left, which is what happens when a place is counted that neither factor actually carries — the answer then comes out ten times too small.',
    };
}

const discrimPointPlace = discrimination({
  variant: 'structural',
  cognitiveOp: 'dec-place-the-point',
  draw: (r) => {
    // The placement is drawn FIRST and the factors are built to match it, so the
    // key is smallest / middle / largest in exact thirds rather than by luck.
    const j = r.int(1, 3);
    const c = r.pick(PLACE_CASES.filter((p) => p.j === j));
    const a = formatDec(c.ma, c.sa);
    const b = formatDec(c.mb, c.sb);
    const truth = placeAt(c.digits, j);
    const others = [1, 2, 3].filter((k) => k !== j);
    return {
      prompt: `Multiplying ${a} by ${b} gives the digits ${String(c.digits).split('').join(' ')}, in that order. Only the point is left to place. Which of these is the answer?`,
      correct: truth,
      distractors: others.map((k) => ({
        text: placeAt(c.digits, k),
        errorTag: placeRationale(k - j).tag,
        rationale: placeRationale(k - j).text,
      })),
      hints: [
        'How many digits sit to the right of the point in the two numbers being multiplied, counting both of them together?',
        'Count the decimal places the two factors carry between them, and leave exactly that many digits to the right of the point.',
      ],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * NEITHER MANTISSA MAY END IN A ZERO, AND THIS IS A CORRECTNESS BOUND RATHER
 * THAN A TIDINESS ONE.
 *
 * `formatDec` trims trailing zeros, so a drawn hundredths mantissa of 70 prints
 * as "0.7" — a number with ONE decimal place. Both operands then carry the same
 * number of places, right-justifying them changes nothing, and the "student
 * error" the item shows IS the correct answer: seed 77 served "2.5 litres and
 * 0.7 litres … wrote the total as 3.2 litres" beside a key of 3.2. That is the
 * D8 class — an error-analysis item whose error is not one — on about a tenth
 * of draws.
 *
 * QG-11 did not catch it and could not: it checks that the prompt SHOWS the
 * recomputed misconception value and that the answer CARRIES the recomputed
 * truth, and when the two coincide both checks pass on the same number. The
 * refusal belongs one layer down, in the verify itself, and `verifyDec` does
 * not have it — see the SHARED-FILE FINDING in the header. Found by reading the
 * served pack, exactly as the brief's §1 says it would be.
 *
 * With both mantissas coprime to ten the true total is 10·ma + mb hundredths
 * and the right-aligned one is ma + mb, which differ by 9·ma — never zero.
 */
const EA_TENTHS = Array.from({ length: 76 }, (_, i) => i + 21).filter((n) => n % 10 !== 0);
const EA_HUNDREDTHS = Array.from({ length: 81 }, (_, i) => i + 15).filter((n) => n % 10 !== 0);

/**
 * THE ERROR-ANALYSIS (decision 5). Two amounts written to different numbers of
 * places are added as digit strings, so tenths land on hundredths. The shown
 * value is the genuine output of `d_verify_dec_v1` under wrongMode
 * 'right-align' and the true total is that template's own addition, so QG-11
 * recomputes both. The extension asks for the week's claim rather than for the
 * arithmetic: what a digit's place says about the size of the piece it counts.
 */
const eaColumnAlignment = errorAnalysis({
  verifyTemplateId: 'd_verify_dec_v1',
  cognitiveOp: 'dec-add-align',
  drawParams: (r) => ({
    a: formatDec(r.pick(EA_TENTHS), 1),
    b: formatDec(r.pick(EA_HUNDREDTHS), 2),
    op: '+',
    wrongMode: 'right-align',
  }),
  build: (v, p, r) => {
    const scene = r.pick(POUR_SCENES);
    return {
      // The shown total goes through `countNoun` like every other quantity:
      // `formatDec` trims trailing zeros, so a right-aligned sum of exactly one
      // hundred hundredths prints as "1" and "1 litres" is not English. Caught
      // on seed 1238 by QG-12c, not by reasoning about it.
      prompt: `${scene.who} pours ${countNoun(String(p.a), 'litres')} from one measure of ${scene.liquid} and ${countNoun(String(p.b), 'litres')} from another into the same ${scene.vessel}. A student set the two amounts out in a column and wrote the total as ${countNoun(v.wrong, 'litres')}.`,
      extension: 'Write the total the two amounts really make, then name what every column of a written addition has to hold in common, and finish with one sentence saying what a digit\'s place tells you about the size of the piece it is counting.',
      hints: [
        'Which digits in these two amounts are counting pieces of the same size as each other?',
        'Give both amounts the same number of decimal places, then stand each digit under the digit counting the same size of piece.',
      ],
      errorTags: ['representation-misread', 'procedure-slip'],
      answerKeywords: ['line up the places', 'same place value'],
    };
  },
});

/**
 * THE DAY-5 SIGNATURE (§6 row E5, "one number pair, both tools"), and it is
 * WRITTEN rather than chosen — for the reason in decision 1. Put a greatest
 * common factor and a least common multiple of one pair on one page as cards
 * and the two answers are locked in rank forever: whichever is asked for, "pick
 * the smallest" or "pick the largest" wins outright. With no cards there is no
 * rank, and the item can ask for the thing that actually matters — not the two
 * values but the reason neither can escape its side of the pair.
 *
 * The pair is fixed prose, because what is being assessed is the argument
 * rather than another piece of arithmetic.
 */
const bothToolsOnePair = reasoning({
  prompt:
    'Take the pair 18 and 24. Write their greatest common factor, then their least common multiple. Then finish with two sentences: one saying why the first of those can never be larger than 18, and one saying why the second can never be smaller than 24. Argue from what each of the two words means, not from this pair.',
  value:
    'the greatest common factor is 6 and the least common multiple is 72; a common factor has to divide 18, so it cannot be larger than 18, and a common multiple has to be reached by counting in 24s, so it cannot be smaller than 24',
  acceptableForms: ['6', '72', 'factor', 'multiple', 'divides', 'cannot be larger', 'cannot be smaller'],
  keywords: true,
  hints: [
    'What has to be true of a number before it can be called a factor of one of these, and what has to be true before it can be called a multiple?',
    'Take the two words one at a time, and for each of them say what it forces about size before any working happens.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The always/sometimes/never claim — and THE CLAIM IS DRAWN, which is the point.
 *
 * `items.classify` takes its three cards as authored config, so a week that
 * authors one claim ships a slot whose key never moves: the two verdicts it
 * does not key are offered on 100% of draws and keyed on 0%, the L38
 * permanently-unkeyable card in its most literal form. E3 measured exactly that
 * on its own first version and repaired it by drawing the claim; this week
 * inherits the repair rather than the defect. Nothing about the page changes
 * for the child, "answer sometimes and read nothing" falls to a third, and
 * "pick the longest card" — the always/sometimes/never tell, since the three
 * words are fixed strings — falls to a third with it.
 *
 * The three claims are the three things this week most needs a learner to be
 * able to defend: the product law that ties the two tools together (always),
 * the week's named misconception in the one case where it is right
 * (sometimes), and the size law read from the wrong end (never).
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
    claim: 'multiplying two whole numbers together and multiplying their greatest common factor by their least common multiple give the same answer',
    verdict: 'always',
    wrong: {
      sometimes: {
        tag: 'concept-misconception',
        text: 'Takes it for a coincidence that holds on the friendly pairs. Every factor of the pair is counted exactly once between the shared part and the two leftovers, so the two products are the same two collections of factors written in a different order.',
      },
      never: {
        tag: 'representation-misread',
        text: 'Reads a product of two large numbers and a product of a small one with a large one as obviously different sizes. The shared factor is taken out of both numbers and put back once, which is exactly what makes the totals agree.',
      },
    },
  },
  {
    claim: 'multiplying two whole numbers together gives their least common multiple',
    verdict: 'sometimes',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'The product is certainly a common multiple, and stopping there is the commonest slip on this topic. It is the LEAST one only when the two numbers have no factor in common; share a factor and the product counts that factor twice over.',
      },
      never: {
        tag: 'task-comprehension',
        text: 'Over-corrects into refusing the product outright, which throws away the case that makes the rule make sense: two numbers with nothing shared between them really do meet for the first time at their product.',
      },
    },
  },
  {
    claim: 'the greatest common factor of two whole numbers is larger than the smaller of the two',
    verdict: 'never',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'Reads "greatest" as "large". The word is only saying which of the shared factors is being picked, and every one of them has to divide the smaller number, so none of them can be bigger than it.',
      },
      sometimes: {
        tag: 'task-comprehension',
        text: 'Reaches for the case where one number divides the other, but even there the shared factor is EQUAL to the smaller number rather than larger than it, so the claim still does not hold.',
      },
    },
  },
];

const toolClaimVerdict: ItemGen = (rng, guard, difficulty) =>
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
      prompt: `Always, sometimes, or never true: ${c.claim}. Then write one sentence that settles it — a pair of numbers if a pair is enough, and a reason if it is not.`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' as const },
      difficulty,
      strand: 'noncomputational' as const,
      isRetrieval: false,
      hintLadder: [
        'How many pairs of numbers would have to agree with this before the word always is earned, and how many would sink it?',
        'Try the claim on a pair that shares a factor and on a pair that shares nothing, and let the verdict cover both.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension', 'representation-misread'] as ErrorTag[],
      authorMeta: { stepCount: 1, cognitiveOp: 'gcf-lcm-defend-claim' },
    };
  });

// ---------------------------------------------------------------------------
// The puzzle — the week's move, run backwards
// ---------------------------------------------------------------------------

/** Distinct prime factors of n, for the puzzle's uniqueness filter. */
function distinctPrimes(n: number): number {
  let m = n;
  let count = 0;
  for (let f = 2; f * f <= m; f++) {
    if (m % f !== 0) continue;
    count++;
    while (m % f === 0) m /= f;
  }
  return m > 1 ? count + 1 : count;
}

/**
 * The co-factor pairs whose product has exactly TWO distinct prime factors.
 * That is what makes the puzzle's answer unique: the only ways to split u·v
 * into two coprime factors are {1, u·v} — which gives back the greatest common
 * factor and the least common multiple themselves, and is ruled out by the
 * puzzle's own sentence — and {u, v}.
 */
const PUZZLE_COFACTORS = COFACTORS.filter(([u, v]) => distinctPrimes(u * v) === 2);

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE05 = makeWeekBuilder({
  level: 'E',
  week: 5,
  conceptId: 'gcf-lcm-decimal-fluency',
  conceptName: 'GCF, LCM & decimal fluency',
  strandTags: ['multiplication-division', 'decimals-fractions'],
  prerequisiteWeeks: [D3, D14, D20],
  pedagogyContract: 'v2',
  conceptualAnchor: 'factor rectangles and the common ladder',
  conceptFamily: 'operation',
  deepeningDelta:
    'D3 asked its questions of ONE number at a time: is this number prime, what are its factor pairs, what is its fifth multiple. Every answer lived inside a single number, and "factor" and "multiple" could sit side by side as two words for two directions. E5 needs two numbers for every question, and that changes what the words are for: a factor is only interesting here if it is shared, a multiple only if it is reached twice, and choosing between the two becomes the assessed decision rather than a piece of vocabulary. It also introduces the size law the pair forces — the shared factor cannot escape below both numbers, the meeting point cannot escape above both — which is a fact about two numbers and has no statement at all inside one. The decimal strand consolidates D13, D14 and D20, and its advance is likewise structural: those weeks posed decimal arithmetic bare or one step at a time, and here it arrives inside chains, inside a placement decision with three live candidates, and under an estimate that has to be made before any working.',
  explanation: {
    hook:
      'Two numbers, 18 and 24. One question asks what the largest thing is that both of them are built out of. The other asks how far you have to count before their two patterns arrive at the same place. The answers are 6 and 72, and one of them can never be bigger than 18 while the other can never be smaller than 24. That is not a rule anybody has to remember.',
    whyBeforeHow:
      'Every number this week is a count of a piece, and the whole week is about choosing the piece. That is why the anchor is factor rectangles and the common ladder, and why one picture does both jobs. Lay 18 by 24 out as a rectangle and look for the largest square tile that fits exactly along both sides: because that tile has to fit inside 18, it can never be larger than 18, and the same sentence with 24 in it says the rest. That is the greatest common factor, and its size is settled by what the word means rather than by any working. Now walk the two counting patterns instead — 18, 36, 54 and 24, 48, 72 — and look for the first square they both land on. Because that number has to be reached by counting in 24s, it can never be smaller than 24. That is the least common multiple, and it is the same sentence read from the other end. The common ladder is those two pictures written down: divide both numbers by something they share, then again, until nothing is shared; what you divided out is the shared part, and what is left underneath is what each number brings that the other does not. Multiplying the two numbers together always gives a common multiple — it just gives one that counts the shared part twice, so it is the first one only when there is no shared part at all. And a decimal point is this same idea inside one number: it says which digit is counting which size of piece. Add two decimals with the columns out of line and you have added a count of tenths to a count of hundredths, which is the same mistake as measuring two rods with two different rulers and subtracting the readings. So estimate the size of a decimal answer before you write it, because the digits will look right either way and only the size will object.',
    script: [
      {
        say: 'Watch me find a shared piece rather than remember a rule. Here is a rectangle 8 centimetres by 12, and I want the largest square tile that covers it exactly, with nothing cut. A 4-centimetre square works: 4 fits along the 8 twice and along the 12 three times, so the tiles come out 2 by 3, and 2 × 3 = 6 tiles. Could I go larger? A 5 would not fit the 8. A 6 would not fit the 8 either. The tile has to fit inside BOTH, so it can never be bigger than the smaller side. That is the greatest common factor, and I have just drawn it.',
        visual: 'An 8 by 12 rectangle ruled into centimetre squares, with one 4 by 4 tile shaded in the corner.',
        figure: areaGrid(
          { rows: 8, cols: 12, shadedRows: 4, shadedCols: 4 },
          { alt: 'a rectangle eight squares deep and twelve squares wide, with a four-by-four block shaded in one corner to show the largest square tile that fits both sides' },
        ),
      },
      {
        say: 'Now the other question, on the same two numbers. Count in 6s and count in 8s, and mark every square where both counts land. The first one is 24. Not 48, not 72 — those are meetings too, but later ones. Here is the thing worth noticing: 6 × 8 = 48 is on that list, so multiplying always gets me A meeting. It just does not get me the FIRST one, because 6 and 8 both carry a 2 and multiplying counts that 2 twice over. Take the shared 2 out once and 24 is what is left.',
        visual: 'A hundred chart with the squares where the sixes and the eights both land picked out.',
        figure: hundredChart({
          highlight: [24, 48, 72, 96],
          alt: 'a hundred chart with 24, 48, 72 and 96 shaded — the numbers that both the sixes and the eights land on',
        }),
      },
      {
        say: 'Put the four numbers side by side and the sizes stop being something to memorise. The shared part, 2, sits below both 6 and 8, because it has to fit inside each of them. The first meeting, 24, sits above both, because each of them has to be able to count up to it. And the product, 48, sits above the first meeting, because it is carrying that shared 2 a second time. Nothing here is a rule. Every one of those positions is forced by what the word means.',
        visual: 'Four bars to one scale: the shared factor, the two numbers, the first meeting, and the product.',
        figure: barModel(
          [
            { label: 'what 6 and 8 share', segments: [{ value: 2, label: '2' }] },
            { label: 'the two numbers', segments: [{ value: 6, label: '6' }, { value: 2, label: '8', fill: 'soft' }] },
            { label: 'where they first meet', segments: [{ value: 24, label: '24' }] },
            { label: 'the two multiplied', segments: [{ value: 48, label: '48' }] },
          ],
          { scaleMax: 48, alt: 'four bars drawn to one scale: a very short bar for the shared factor, a short bar for the two numbers, a long bar for the first meeting, and the longest bar for the product' },
        ),
      },
      {
        say: 'And the decimals are the same idea inside one number. The point tells me which digit is counting which size of piece, so before I add 4.7 and 0.35 I make sure tenths are standing over tenths and hundredths over hundredths — 4.70 and 0.35. If I shove the digits right instead I am adding a count of tenths to a count of hundredths, and the answer comes out about five times too small. So I estimate first: 4.7 is near 5 and 0.35 is small, so I am expecting a bit over 5, and I check the answer against that call before I write it down. The digits will look right either way. The size is the only thing that objects.',
        visual: '4.70 stacked over 0.35 with the points in one line, the filler zero shaded in the hundredths place, and 5.05 under the line.',
        // ONE addition, not two. The say's wrong version is a picture of digits
        // in the wrong columns, and a figure drawing it would be a place-value
        // chart of a lie standing beside a place-value chart of the truth, with
        // nothing on the page saying which is which — a still cannot carry the
        // "if I shove the digits right instead" the way a sentence can. So the
        // correct alignment is drawn, the say names the rival, and the shaded
        // hundredths column is where the argument actually lives: 4.7 wearing
        // its filler zero is what gives the 5 a partner to be added to.
        figure: columnMethod(
          {
            op: '+',
            pointAfterCol: 0,
            rows: [
              { cells: ['1', '', ''], role: 'carry' },
              { cells: ['4', '7', '0'], role: 'operand' },
              { cells: ['0', '3', '5'], role: 'operand' },
              { cells: ['5', '0', '5'], role: 'result' },
            ],
            highlightCols: [2],
          },
          {
            alt:
              '4.70 stacked over 0.35 with the decimal points in one line, the filler zero standing over the 5 in ' +
              'the shaded hundredths column, a carried 1 above the ones, and 5.05 under the line',
          },
        ),
      },
    ],
    summary:
      'A greatest common factor is the largest piece two numbers can both be counted in, so it has to fit inside each of them and can never be larger than the smaller one. A least common multiple is the first count both of their patterns reach, so each of them has to be able to count up to it and it can never be smaller than the larger one. Multiplying the two together always gives a common multiple, but it counts anything they share twice over, so it is the first one only when they share nothing. The common ladder does both jobs at once: divide out what is shared until nothing is, and read the shared part and the leftovers off the ladder. The decimal half is the same sentence about one number — the point says which digit counts which size of piece, so columns line up by place and never by the right-hand end, and the size of a decimal answer should be settled before the digits are written.',
    vocabulary: [
      { term: 'greatest common factor', kidGloss: 'the largest number that divides both of two numbers exactly — the biggest piece they can both be counted in' },
      { term: 'least common multiple', kidGloss: 'the smallest number that both of two numbers divide into exactly — the first place their two counting patterns meet' },
      { term: 'common ladder', kidGloss: 'dividing both numbers by something they share, over and over, until nothing is shared' },
      { term: 'simplest form', kidGloss: 'a fraction with the greatest common factor of its top and bottom already taken out' },
      { term: 'decimal place', kidGloss: 'the position a digit sits in after the point, which says what size of piece that digit is counting' },
    ],
  },
  guidedExamples: [
    {
      ...ge(5, 1, 'modeled', 'What is the largest square tile that covers an 8 cm by 12 cm splashback exactly, and how many tiles does it take?', [
        {
          teacherSay:
            'Let me settle what kind of number I am looking for before I touch either measurement. The tile has to fit along the 8 with nothing over, and along the 12 with nothing over. So I am not hunting for a big number. I am hunting for a number that is a factor of both of them, and then taking the largest of those.',
        },
        {
          teacherSay:
            'I settle the size before I hunt. Whatever I find has to fit inside the 8, so it cannot be more than 8 — any answer above that is already wrong. Now the factors of 8 are 1, 2, 4 and 8, and I walk them down from the top: does 8 fit the 12? No. Does 4?',
          expected: '4',
        },
        {
          childDo: 'Count how many 4 cm tiles fit along each side, then put the two counts together.',
          expected: '6',
        },
      ], '6'),
      visual: 'The 8 by 12 splashback ruled into centimetre squares with one 4 by 4 tile shaded.',
      figure: areaGrid(
        { rows: 8, cols: 12, shadedRows: 4, shadedCols: 4 },
        { alt: 'a rectangle eight squares deep and twelve squares wide with a four-by-four block shaded in one corner' },
      ),
    },
    ge(5, 2, 'completion', 'A cuckoo clock chimes every 6 minutes and a tower bell every 8 minutes, and they chimed together just now. How many minutes pass before they chime together again?', [
      {
        teacherSay: 'Does the answer have to be a number the sixes reach, a number the eights reach, or both?',
        expected: 'both',
      },
      {
        childDo: 'Count up in eights and stop at the first count the sixes also reach.',
        expected: '24',
      },
    ], '24'),
    ge(5, 3, 'prompted', 'Write 42/70 in its simplest form.', [
      {
        childDo: 'Take out the largest number that divides the top and the bottom together, then write what is left.',
        expected: '3/5',
      },
    ], '3/5'),
    ge(5, 4, 'independent', 'Work out 4.6 × 0.35. Solve cold.', [
      { childDo: 'Settle how many decimal places the answer must carry before you place the point.', expected: '1.61' },
    ], '1.61'),
  ],
  days: [
    // Day 1 — concept echo: the two tools met one at a time, single-step only,
    // with D3's single-number vocabulary as the bridge. No chain, no choice and
    // no trap yet.
    //
    // The warm-ups are ORDERED so the LAST is the D3 multiple: the retrieval
    // ramp moves a pack's final Day-1 warm-up onto Day 5 after every gate has
    // run, and Day 5 already carries a decimal-multiplication warm-up.
    [
      { gen: wFactorPair, diff: 2 },
      { gen: wPrime, diff: 2 },
      { gen: wMultiple, diff: 2 },
      { gen: gcfBare, diff: 3 },
      { gen: lcmBare, diff: 3 },
      { gen: sitEqualBundles, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first meeting, the recipe's
    // own discrimination, the simplest-form share, and the week's first chain.
    [
      { gen: wDecRound, diff: 2 },
      { gen: wFactorPair, diff: 2 },
      { gen: sitNextTogetherEstimate, diff: 3 },
      { gen: discrimWhichTool, diff: 3 },
      { gen: sitSimplestShare, diff: 3 },
      { gen: msTileTheFloor, diff: 4 },
    ],
    // Day 3 — interleave: both discriminations against bare computation, the
    // decimal chain and the GCF-then-simplify chain, so nothing on the page
    // signals which kind of work is coming next.
    [
      { gen: wDecSub, diff: 2 },
      { gen: discrimPointPlace, diff: 3 },
      { gen: lcmBare, diff: 3 },
      { gen: discrimWhichTool, diff: 3 },
      { gen: decVesselChain, diff: 4 },
      { gen: msBraidPieces, diff: 4 },
    ],
    // Day 4 — word problems. Three chains sit here and no two are posed alike:
    // one measures then counts, one states a number it never spends, one hands
    // back the shared factor and asks for the two totals it came from. Two
    // single-step items sit among them so the length of a prompt predicts
    // nothing.
    [
      { gen: msJointArrival, diff: 5 },
      { gen: msBunchesRebuildCheck, diff: 5 },
      { gen: msTileTheFloor, diff: 4 },
      { gen: sitEqualBundles, diff: 4 },
      { gen: sitNextTogetherEstimate, diff: 4 },
    ],
    // Day 5 — written: the column-alignment error-analysis, one pair with both
    // tools and the size argument that goes with it, and a drawn
    // always/sometimes/never claim (+ a ramped warm-up).
    [
      { gen: wDecMul, diff: 2 },
      { gen: eaColumnAlignment, diff: 4 },
      { gen: bothToolsOnePair, diff: 4 },
      { gen: toolClaimVerdict, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the two words this week are almost the same shape, and that is the whole difficulty. "Greatest common factor" and "least common multiple" both start with a superlative and both end in a relationship, so a child who has understood everything can still reach for the wrong one under time. The fix is not more practice on either — it is the size question, asked before any working: must this answer be smaller than both of my numbers, or bigger than both? A factor has to fit inside them, so it is smaller. A multiple has to be reached by counting in them, so it is bigger. One sentence, asked first, sorts the two tools out for good — and it also catches the commonest slip of all, which is multiplying the two numbers together and stopping.',
  ],
  puzzle: (r) => {
    // THE WEEK'S MOVE RUN BACKWARDS. Every day item hands the solver two numbers
    // and asks for a shared factor or a meeting point; the puzzle hands over the
    // shared factor and the meeting point and asks for the two numbers. The move
    // that answers it is a SEARCH under two constraints, which is a thing no day
    // item asks for — and the trap it is built around is the week's own named
    // misconception, because a solver who believes the meeting point is just the
    // two numbers multiplied has no way in at all.
    const g = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
    const [u, v] = r.pick(PUZZLE_COFACTORS);
    const small = g * u;
    const large = g * v;
    const meet = g * u * v;
    return {
      id: 'E5-PZ-01',
      title: 'Puzzle Grove: The Two Wheels',
      puzzleType: 'logic',
      prompt: `Two toothed wheels drive a printing press, and their tooth counts are whole numbers. The largest number that is a factor of both counts is ${g}, and a marked tooth on each wheel comes back to the meshing point together for the first time after ${meet} teeth have passed. Neither wheel has ${g} teeth and neither has ${meet}. How many teeth does each wheel have? Write the smaller count first.`,
      answer: {
        value: `${small}, ${large}`,
        acceptableForms: [`${small} ${large}`, `${large}, ${small}`],
        validation: 'ordered-list',
      },
      hintLadder: [
        'If both counts are built out of the shared number, what is left of each of them once that shared number is taken out?',
        'Divide the meeting count by the shared number, then split what is left into two whole numbers with nothing in common.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'gcf-lcm-recover-pair' },
  sprint: {
    skill: 'Multiplication and division facts to 12 — the facts a common ladder asks for at every rung',
    sourceWeek: D15,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 12] },
  },
  mastery: [
    { gen: sitEqualBundles, diff: 3 },
    { gen: sitNextTogetherEstimate, diff: 3 },
    { gen: msTileTheFloor, diff: 4 },
    { gen: msJointArrival, diff: 4 },
    { gen: sitSimplestShare, diff: 3 },
    { gen: decVesselChain, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/02/05: one move apiece — two counts packed into as many identical sets as they allow (the shared factor as a count of groups), two cycles started together and asked when they next agree (the meeting point, with the size of the answer called before any working), and a part of a load written as a fraction of the whole in lowest terms. 03/04/06: chains — a rectangle laid in the largest square tile that fits both sides and then counted, a pair of services scaled to a later joint arrival while carrying an opening time the chain never spends, and a poured amount shared between vessels and then added to what each already held. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'multiply-them-for-the-multiple',
      description: 'Multiplies the two numbers together and calls the product the least common multiple. It is not a wild guess — the product IS a common multiple every time, so the answer always survives the check "do both numbers divide it", and the working is usually flawless. It is the LEAST one only when the two numbers share no factor at all; share one, and the product has counted that shared factor twice over, so it lands at a later meeting than the first.',
      exampleWrongAnswer: 'the first joint chime of a 6-minute and an 8-minute cycle given as 48 minutes rather than 24',
      distractorRationale: 'Offer the product as a live card on a story where it IS the answer, so the reading is met where it is right before it is met where it is wrong, and no card is offered more often than it is keyed.',
      reteachPointer: 'explanation/script[1] (multiplying gets a meeting, not the first one), then explanation/script[2] (why the product sits above it)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'wrong-tool-for-the-story',
      description: 'Picks between the two tools on the surface of the sentence rather than on what it is asking the two numbers to do. The words are almost the same shape — both a superlative and a relationship — so a child who understands both can still reach for the wrong one, especially under time. The tell is the size: a shared factor has to sit below both numbers and a meeting point above both, so the wrong tool is never a near miss.',
      exampleWrongAnswer: 'a question about packing two counts into identical crates answered with the first moment the two counts agree',
      distractorRationale: 'Offer the other tool\'s description, written as a method rather than a value, so nothing about the size or the shape of the cards separates them and only reading the story does.',
      reteachPointer: 'guidedExamples/E5-GE-01 (what kind of number the tile has to be), then the Day-2 which-tool item',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'stops-at-a-common-factor',
      description: 'Takes out a factor the two numbers share, sees that something has come out, and stops — so a fraction is left half-simplified and a ladder is left with a shared factor still sitting underneath it. Everything done was correct; what is missing is the check that nothing is left to share, which is the only line of the method that has no arithmetic in it.',
      exampleWrongAnswer: '42/70 written as 21/35, with the 7 still to come out',
      distractorRationale: 'Offer the value that appears when one shared factor has been removed and the check for a second one was never made.',
      reteachPointer: 'explanation/script[0] (walking the factors down from the top), then guidedExamples/E5-GE-03',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'right-justifies-the-columns',
      description: 'Lines two decimals up by their right-hand ends rather than by their points, so a count of tenths is added to a count of hundredths. It is the same error the whole week is about — setting two numbers side by side when they are counted in different sizes of piece — wearing a column instead of a story. Every digit added is added correctly, which is why nothing in the working looks wrong; the result is out by a factor of ten or more, which is why the size does.',
      exampleWrongAnswer: '4.7 + 0.35 written as 0.82',
      distractorRationale: 'Offer the value that appears when the decimal places the two factors carry between them are miscounted. Every card holds the same digits in the same order, so the only thing that separates them is where the point stands.',
      reteachPointer: 'explanation/script[3] (which digit counts which size of piece), then the Day-3 point-placement item',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Greatest common factors and least common multiples — finding the largest piece two numbers can both be counted in, finding the first count both of their patterns reach, telling which of the two a story is asking for, using a shared factor to write a fraction in its simplest form, and consolidating decimal arithmetic: lining columns up by place value, placing the point in a product, and settling the size of an answer before writing it.',
    improvingCandidates: [
      'choosing between a shared factor and a meeting point from what a story asks',
      'taking every shared factor out, rather than the first one found',
      'placing the decimal point from the places the two factors carry',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reaching for the first meeting of two counting patterns rather than multiplying the two numbers together and stopping',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading which of the two tools a question wants, and using the size of the answer as the check',
      },
      {
        errorTag: 'procedure-slip',
        text: 'carrying on until nothing is left shared, instead of stopping at the first factor that comes out',
      },
      {
        errorTag: 'representation-misread',
        text: 'lining decimals up by what each digit is counting rather than by the right-hand end',
      },
    ],
    homeFocus: {
      praiseLine:
        'You asked which side of your two numbers the answer had to land on, and you noticed straight away when a tool would have put it on the wrong side. That question is what keeps the two apart once the words start to look alike.',
      questionForChild: 'For 18 and 24 — which of your two answers this week had to come out smaller than 18, and which had to come out bigger than 24, and how do the words tell you that before you work either of them out?',
      schoolSyncHook: 'Some classes list factors and multiples, some run a division ladder, some draw prime factor trees. Say the word for whichever your child meets and these pages will start from it.',
    },
    vocabularyForParent: [
      'greatest common factor (the largest number that divides both — it can never be larger than the smaller number)',
      'least common multiple (the first number both of them count up to — it can never be smaller than the larger number)',
      'simplest form (a fraction whose top and bottom have had their greatest common factor taken out)',
    ],
  },
});
