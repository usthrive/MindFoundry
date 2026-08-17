/**
 * Level E · Week 11 — "Algebraic expressions" (conceptId: algebraic-expressions).
 * The second G6 / `algebra.ts` week, and the one the whole algebra thread stands on.
 *
 * FILL-ARCHITECTURE §6 row E11: anchor "variable as an any-number bag"; key
 * multi-step "evaluate at several x"; error-analysis "3 more than twice n"
 * written `2(n + 3)`; discrimination "2n vs n² vs n+2"; Day-5 signature "one
 * expression, three stories". NOT R-flagged: every item below is computable and
 * nothing ships as manual-review except the error-analysis, whose truth is
 * code-recomputed by `e_alg_verify_misgroup_v1`.
 *
 * THE WEEK'S CLAIM. A letter in an expression is not a name, a label or a
 * missing number waiting to be found. It is a bag that ANY number can be in, and
 * every consequence the week teaches falls out of that one reading:
 *  - an expression is therefore not a question. `4n + 7` is a machine, and it
 *    has no value at all until a number goes in. That is why the week's core
 *    move is evaluating the SAME expression at several different values rather
 *    than at one: a single substitution looks like arithmetic with a letter in
 *    the way, and three of them look like a machine;
 *  - because the bag can hold any number, two expressions that look alike can
 *    behave nothing alike, and you cannot tell which of them is larger until you
 *    know what is in the bag. `2n`, `n^2` and `n + 2` are the week's three
 *    machines, and the honest answer to "which is biggest" is another question;
 *  - and because the bag is any number, the words that describe the machine have
 *    to be read for their STRUCTURE and not their order. "3 more than twice n"
 *    says double first and then add, and the bracket in `2(n + 3)` says the
 *    opposite — which is the week's named slip, and the reason the error-analysis
 *    is the recipe's own item rather than a relocated one.
 *
 * The three Level-E ceiling lifts each land on their own item, never doubled up:
 *  - INVERSE-START — `msQuireCount`: the stated count is what the machine HANDED
 *    BACK, so the opening move is a subtraction the sentence order never asks
 *    for, and the second is the division that undoes the scaling;
 *  - HAS-DISTRACTOR — `msFramesOut` states a count of swaging presses (or
 *    lunellum knives, or crimping tools) that the chain never spends, and it is a
 *    plausible divisor rather than scenery a child can safely ignore;
 *  - ESTIMATE-FIRST — `msTwoPlansEstimate`, reachable ONLY through the wrapper
 *    (kit §E2.2), and its probe is a coin flip BY CONSTRUCTION (decision 4).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  1. THE RECIPE'S DISCRIMINATION HAD NO GENERATOR, AND IT IS A LOADED GUN.
 *     `lib/algebra.ts::expressionMeaningTrap` once claimed in its docstring to be
 *     "E11's `2n vs n² vs n+2` family"; it is not, and the claim was corrected
 *     before this week was written. It does `an + b` vs `a(n + b)` vs `bn + a` —
 *     grouping and role-swap, which is this week's ERROR-ANALYSIS family, not its
 *     discrimination. Nothing in `lib/` compares three expressions that GROW
 *     differently, so `discrimWhichMachine` and `discrimBiggerAtN` are built here.
 *
 *     The arithmetic they are built around: for every n ≥ 3 the order
 *     `n^2 > 2n > n + 2` is FIXED, so a "which of these is biggest" page over
 *     those three is answered 100% by "tap the squared one" without evaluating
 *     anything — the same shape as `groupingToTarget`'s bracket, which E10 refused
 *     to serve for exactly this reason. Everything the week wants noticed lives at
 *     n ∈ {0, 1, 2}: at 2 all three agree, at 1 the order reverses, at 0 two of
 *     them collide. So:
 *       · `discrimWhichMachine` NEVER asks which is biggest. It states a value and
 *         asks which machine produced it, and the keyed machine is drawn in exact
 *         thirds, independently of the numbers — so "the squared one", "the
 *         biggest", "the smallest" and "the middle" all sit at a third BECAUSE the
 *         truth rotates, not because any rank belongs to a fixed card (it does
 *         not; see the note on the generator). It is also built so that no numeral
 *         printed on a card can appear in the prompt, which is the surface §2a of
 *         the delta was written about (see decision 2 and LEGAL_MULTIPLIERS);
 *       · `discrimBiggerAtN` IS the ordering question, and it survives because it
 *         compares only TWO machines and offers "they hand back the same amount"
 *         as a live third card. Over `a·n` against `n^2` all three verdicts are
 *         reachable — the multiplying one wins below the crossing, the squaring
 *         one above it, and they meet exactly at it — so no card is offered more
 *         often than it is keyed (the L38 repair E3 earned and E5, E10 inherited).
 *         Its cards carry NO numerals at all, deliberately: the two expressions
 *         are stated in the PROMPT and the cards name the machines in words, so a
 *         prompt↔card numeral correspondence is structurally impossible;
 *       · the always/sometimes/never item keys three FIXED verdict words and draws
 *         which claim is asked, so "answer sometimes and read nothing" and "tap
 *         the longest card" are each worth a third;
 *       · every evaluate item in the week is free-entry. There is no rank because
 *         there is no list.
 *
 *  2. THE SURFACE NO CENSUS CAN SEE, AND WHAT EACH CARD SET DOES ABOUT IT. The
 *     guessability census compares cards to CARDS — rank, identity, length and
 *     structural shape. It never compares the PROMPT to the cards. In a
 *     translation item every card can carry the same numerals, so their ORDER, or
 *     the mere fact that one of them also appears in the question, is a
 *     correspondence readable without any algebra; it cost `expressionMeaningTrap`
 *     a 50.6%-against-33.3% strategy that a clean census had already passed.
 *     Both card generators here are built so the surface cannot exist:
 *       · `discrimWhichMachine` prints `k` and the target value on the prompt and
 *         `a` and `2` on the cards. `LEGAL_MULTIPLIERS` excludes a = k, a = k²
 *         and a = k(k−1), and k starts at 3 — which together PROVE that neither
 *         card numeral is ever the prompt's, whichever machine is keyed;
 *       · `discrimBiggerAtN` has no numerals on any card at all;
 *       · the always/sometimes/never cards are three verdict words.
 *     Measured over 3,000 draws apiece, same-order / opposite-order /
 *     leads-with-the-first-number never apply on either generator; the numbers are
 *     in the report.
 *
 *  3. THE ERROR-ANALYSIS IS THE RECIPE'S OWN ITEM, NOT A RELOCATED ONE, and it is
 *     worth being exact about why, because two weeks written shortly before this
 *     one (E4's inverted fraction, E5's "LCM = just multiply them") both had to
 *     relocate theirs under kit §E2.3. The verify library varies the OPERATION
 *     over a fixed ordered operand pair, so a misconception that swaps two
 *     OPERANDS cannot be expressed — that gap is real and is untouched by this
 *     week. E11's slip is not of that kind: `2(n + 3)` changes how far the
 *     multiplication REACHES over the same ordered pair, which is
 *     operation-shaped, and `e_alg_verify_misgroup_v1` computes both values from
 *     the same params (`a·x + b` correct, `a·(x + b)` wrong). Its guard throws
 *     when a = 1 or b = 0, which is exactly when the two readings coincide, so
 *     `eaMisgroupedBracket` draws a ≥ 2 and b ≥ 1 and can never show a "wrong"
 *     value that equals the key.
 *
 *  4. THE ESTIMATE PROBE IS A COIN FLIP BY CONSTRUCTION, AND THE CONSTRUCTION IS
 *     b09's, NOT A HOPEFUL DRAW (kit §E2.9a). `msTwoPlans` sets two designs for
 *     the same run of bays against each other: one uses more pieces per bay and
 *     fewer at the ends, the other the reverse, so which is cheaper depends on how
 *     many bays there are — the week's whole point, as one page. The probe asks
 *     which design ends up using fewer pieces.
 *       Two independent fair coins decide the page. The first decides whether the
 *     end-piece gap is above or below the per-bay gap multiplied by the bay count
 *     — that is, which DESIGN wins. The second decides which of the two is called
 *     Plan One. Because the naming coin is independent of everything else, the
 *     probe's answer is Plan One exactly half the time whatever the numbers do,
 *     and no reading of the per-bay counts, the end counts or the bay count can
 *     beat a coin. The stronger habit — "the design with the smaller per-bay count
 *     wins" — is the branch coin, so it also sits at a half. Both measured and
 *     reported.
 *
 *  5. ANSWER-IN-PROMPT AUDIT, one generator at a time, with the bound written
 *     beside the draw that carries it. Nothing here uses a redraw loop; each bound
 *     is an inequality the pool cannot break (kit §E2.4, L19):
 *       · `sitGantryLength` answers with `a·x + b`, which exceeds `b` by `a·x`,
 *         exceeds `a` by `a(x − 1) + b` and exceeds `x` by `x(a − 1) + b` — above
 *         all three printed numbers on every draw;
 *       · `msTwoStints` answers with `a(x1 + x2) + 2b`, at least 58, while the
 *         largest number the prompt states is at most 18;
 *       · `msQuireCount` answers with the quire count, 11 to 39, above both the
 *         per-quire count (≤5) and the endpaper count (≤9), and strictly below the
 *         stated total (which exceeds it by at least the count plus six);
 *       · `msFramesOut` answers with at least 69 while the prompt's largest number
 *         is at most 32;
 *       · `msTwoPlans` answers with the cheaper total, proved above the larger end
 *         count in the header comment on the generator itself;
 *       · the puzzle states a multiplier and asks WHERE two machines meet, so its
 *         answer is a pair of positions rather than a value.
 *     The library generators this week serves were measured at difficulty 3 over
 *     3,000 draws by the orchestrator before authoring began: `evaluateAtX` gives
 *     197 distinct answers with a top share of 1.6% and never prints its own
 *     answer; `msEvaluateThenShare` gives 38, top share 5.0%. The served slots are
 *     re-measured in the report.
 *
 *  6. FIGURE LAW as applied here (kit §F.7 / §E2.5). `GATE_PROFILE.E`'s
 *     `pictorialPerDay` is 0, and this week earns no figure on an assessed item:
 *     a bar drawn as "so many of these, then this much more" IS the value of a
 *     linear expression, and a table of n against three outputs IS the answer to
 *     the discrimination. Both pictures therefore live in the lesson script and
 *     the modeled guided example, where the answer is already on the page.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SHARED-FILE FINDINGS — REPORTED, NOT FIXED (`lib/` is the orchestrator's)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  A. `AnswerSpec.requireSimplestForm` is dead code — declared in `types.ts`,
 *     read by `answers.ts::checkAnswer`, set by nothing, and unreachable from a
 *     week module because neither `SituationDraw` nor `MultiStepDraw` carries a
 *     field for it. E5 reported it and E10 confirmed it; this is a third
 *     confirmation, not a new finding. Nothing in this week promises a simplest
 *     form, so nothing here depends on it.
 *
 *  B. `lib/items.ts::classify` keys ONE authored card, so a week that authors a
 *     single always/sometimes/never claim ships two cards that are offered on
 *     100% of draws and keyed on 0% — the L38 permanently unkeyable card in its
 *     most literal form. E3 measured it, E10 worked around it, and this week does
 *     the same: `expressionClaimVerdict` is local and DRAWS the claim. Reported
 *     again because the third occurrence is what makes it a library problem
 *     rather than three authors' preference.
 *
 *  C. `lib/algebra.ts::msEvaluateThenShare` has a thin answer space and one
 *     over-the-bar blind strategy, and both were measured on served packs rather
 *     than inferred. Its answer is `a·k + m` with `a ∈ 5..9`, `k ∈ 4..6` and
 *     `m ∈ 2..6`, so 38 distinct values is all it can reach — against 194 for
 *     `evaluateAtX` on the same page. Served three times a pack (a daily slot plus
 *     both mastery forms), 8.3% of 800 packs repeated an answer across the three.
 *     And in a Form-A mastery slot, "add up every number on the page" landed on
 *     its key on 7.0% of 800 forms, against about 2.5% for a blind guess in a
 *     38-value space — over the L51 five-point bar, in a certifying slot.
 *     Neither is a fault in the generator's mathematics and no gate objects to
 *     either. This week works around both by serving it EXACTLY ONCE, on Day 4,
 *     and certifying the local has-distractor chain instead (see the note on
 *     `mastery` below). Reported so the next week that reaches for it knows what
 *     it costs in a mastery slot.
 *
 *  D. `lib/items.ts::writeExprChoice` (D21's word→expression item, served here as
 *     a warm-up) CARRIES A PROMPT↔CARD CORRESPONDENCE of exactly the class the
 *     census cannot see, and it is worth about ten points. Measured directly on
 *     the generator at difficulty 3 over 3,000 draws:
 *
 *         "tap the card that STARTS with the phrase's first number"
 *             42.6%  vs 33.3% chance   (+9.3, on the 65.4% of draws it applies)
 *         "…the card that ENDS with the phrase's last number"
 *             27.5%  vs 33.3% chance   (−5.8)  ← so striking that card also pays
 *
 *     The cause is structural. Two of its three phrasings — "twice the sum of a
 *     and b" and "two more than the sum of a and b" — print `a` first, and only
 *     one card, `a + b + 2`, begins with `a`; the third phrasing, "b more than
 *     twice a", prints `b` first and no card begins with `b`. So on two thirds of
 *     draws the rule names a single card and is right on half of those. Rotating
 *     which phrase is asked (which that generator already does, and correctly)
 *     fixes the card-identity surface and cannot touch this one, because this one
 *     compares the PROMPT to the cards. The repair is the same shape as the one
 *     `expressionMeaningTrap` received: give each reading BOTH numeral orders and
 *     draw the order independently of the key. Re-measured here for contrast,
 *     `expressionMeaningTrap` sits at 33.0–33.9% on all six of the same surfaces,
 *     so the repair works. REPORTED, NOT FIXED — `lib/` is the orchestrator's, and
 *     the item is served here only as a non-certifying retrieval warm-up.
 *
 * Retrieval reaches backwards only, and to four places: D21 for reading a phrase
 * into an expression and for the order of operations that every substitution then
 * runs on, D15 for the product the scaling step is, D16 for the exact division the
 * inverse-start chain performs, and E10 for the power — because `n^2` is one of
 * this week's three machines and a child who cannot value a power cannot compare
 * it with anything. Day 1's warm-ups are ORDERED so the LAST of them is the D21
 * order-of-operations line: `applyRetrievalRamp` moves a pack's final Day-1
 * warm-up onto Day 5 after every gate has run, and Day 5 is otherwise entirely
 * prose, so the ramped item lands there as the one short computation rather than
 * as a second reading task beside three others.
 */

import { asWarmup, divideExact, evalExpr, multiply, reasoning, writeExprChoice } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { drawUniqueItem } from '../lib/guard';
import { withEstimateFirst } from '../lib/metacog';
import { article, countNoun, fmtInt, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel } from '../lib/figures';
import {
  evaluateAtX,
  evaluatePower,
  expressionMeaningTrap,
  factoredExpr,
  linearExpr,
  linearValue,
  msEvaluateThenShare,
} from '../lib/algebra';
import { makeChoices } from '../shared';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };
const D21 = { level: 'D' as const, week: 21 };
const E10 = { level: 'E' as const, week: 10 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §F.3). */
const one = (r: Rng): string => r.pick(NAMES);

/**
 * The squaring machine, written the way the whole corpus writes a power.
 *
 * `lib/algebra.ts::power` takes two NUMBERS, so it cannot render a variable base;
 * this is the one-line local equivalent. The caret is not a stylistic choice —
 * three shared gates read prose character by character and the corpus has no
 * superscript glyph anywhere in a served prompt, so `n²` would be the only one.
 */
const SQUARE = 'n^2';

// ---------------------------------------------------------------------------
// THE MACHINE POOLS — enumerated once at module load, never resampled
//
// Every pool below is a fixed list built at import time, so a draw is one pick
// off it and never a retry loop. A loop would consume a variable number of rng
// draws and make every LATER item in the pack depend on which seed this one
// landed on (kit §E2.4, L19).
// ---------------------------------------------------------------------------

/** The values of n that `discrimWhichMachine` and `discrimBiggerAtN` feed in. */
const FEED_LO = 3;
const FEED_HI = 9;

/**
 * For each fed value `k`, every multiplier `a` that keeps the three machines
 * `a·n`, `n^2` and `n + a` pairwise DISTINCT at `k` and keeps every card numeral
 * off the prompt.
 *
 * Four conditions, and each one is an equality the item could not survive:
 *   · a ≠ k        — otherwise `a·k = k²` and two cards share the keyed value;
 *   · a ≠ k(k−1)   — otherwise `k² = k + a` and two cards share it;
 *   · a ≠ k²       — otherwise the printed target IS a card's numeral on the
 *                    draw that keys the squaring machine (k = 3, a = 9 is the
 *                    only case in range, and it is the §2 surface exactly);
 *   · k ≥ 3        — which also keeps the numeral 2 on the `n^2` card off the
 *                    prompt, and keeps `a·k ≠ k + a` (that equality needs
 *                    a = k/(k−1), an integer above one only at k = 2).
 * `a·k` versus `k + a` needs no condition: for a ≥ 2 and k ≥ 3 the first exceeds
 * the second by a(k − 1) − k ≥ 2(k − 1) − k = k − 2 > 0.
 *
 * Because EVERY entry admits all three machines as the key, `k` and `a` can be
 * drawn before the key is used and their distributions are identical whichever
 * machine is keyed — which is what makes the key rotation worth exactly a third
 * on every readable surface rather than approximately a third.
 */
const LEGAL_MULTIPLIERS: ReadonlyArray<readonly [number, readonly number[]]> = (() => {
  const out: Array<readonly [number, readonly number[]]> = [];
  for (let k = FEED_LO; k <= FEED_HI; k++) {
    const legal: number[] = [];
    for (let a = 2; a <= 9; a++) {
      if (a === k) continue;
      if (a === k * (k - 1)) continue;
      if (a === k * k) continue;
      legal.push(a);
    }
    if (!legal.length) throw new Error(`E11: no legal multiplier for a feed of ${k}`);
    out.push([k, legal]);
  }
  return out;
})();

/**
 * MODULE-LOAD PROOF, not a comment. For every legal (k, a) the three machine
 * values must be pairwise distinct AND neither card numeral may equal either
 * number the prompt prints, whichever machine is keyed. If a future edit widens
 * a range, this throws at import rather than shipping a two-answer card page.
 */
for (const [k, multipliers] of LEGAL_MULTIPLIERS) {
  for (const a of multipliers) {
    const vals = [a * k, k * k, k + a];
    if (new Set(vals).size !== 3) {
      throw new Error(`E11: the three machines collide at n=${k}, a=${a} — ${vals.join(', ')}`);
    }
    for (const target of vals) {
      if (target === a || target === 2 || k === a || k === 2) {
        throw new Error(`E11: a card numeral reaches the prompt at n=${k}, a=${a}, target=${target}`);
      }
    }
  }
}

/**
 * For the ordering item, the (fed value, multiplier) pairs that produce each
 * verdict — drawn so the FED VALUE's distribution is identical on all three.
 *
 * This is b09's construction rather than a hopeful draw. `a·n` beats `n^2` below
 * the crossing, loses above it, and meets it exactly at it, so the verdict is
 * decided entirely by how `a` stands against `n`. Draw the verdict first and then
 * the fed value, and the fed value would carry the verdict with it ("a big number
 * means the squaring one"). Draw the FED VALUE first from a window where all
 * three verdicts are reachable — every k in 3..8 admits a multiplier above it, a
 * multiplier below it, and itself — and the fed value says nothing at all; the
 * child has to hold it against the multiplier, which is the mathematics.
 *
 * The upper bound is 8 rather than 9 because a verdict of "the multiplying one"
 * needs a multiplier strictly above the fed value and the multiplier pool stops
 * at 9.
 */
const ORDER_LO = 3;
const ORDER_HI = 8;

// ---------------------------------------------------------------------------
// Scenery. Each pool was grepped against the whole weeks directory and against
// the local pools of E10 and E13 — the algebra weeks a learner meets nearest
// this one — on the day this week was finished (kit §E2.8). Nothing here repeats
// a scene either of them uses, and nothing repeats `lib/algebra.ts`'s own
// MACHINES pool, which `evaluateAtX` already spends on these same pages.
// ---------------------------------------------------------------------------

/**
 * A structure whose length is so much per section plus a fixed pair of ends.
 *
 * Every `ends` string is PLURAL, because the prompt below reads "… together add
 * n metres". The first draft carried 'the ramp at each shore', which served "the
 * ramp at each shore together add 12 metres" on a third of seeds — no gate reads
 * subject-verb agreement, and only reading the served pack does (kit §E2.10).
 */
const SPAN_SCENES = [
  { thing: 'gantry', unit: 'metres', per: 'section', ends: 'the two end frames' },
  { thing: 'pontoon walkway', unit: 'metres', per: 'float', ends: 'the ramps at the two shores' },
  { thing: 'sighting mast', unit: 'metres', per: 'sleeve', ends: 'the foot and the finial' },
  { thing: 'aqueduct', unit: 'metres', per: 'arch', ends: 'the abutments at the two banks' },
  { thing: 'groyne', unit: 'metres', per: 'panel', ends: 'the two anchor piles' },
] as const;

/**
 * A job done in separate runs, each run paying its own set-up over again.
 *
 * FIVE SCENES, NOT THREE, AND THE COUNT IS THE POINT. Each of these three pools
 * feeds a generator served on TWO daily pages, so a three-entry pool repeats a
 * scene across the week on a third of seeds — and a repeat here is not a fresh
 * item, it is the same opening sentence with two numbers changed. E13 recorded
 * exactly this on `lib/algebra.ts`'s three-frame MACHINES pool ("consecutive days
 * opened with the same sentence and two new numbers"); read in a served pack at
 * seed 4242, `msQuireCount` opened Day 3 and Day 4 with the same bindery.
 * Five entries take the repeat rate to a fifth, and no gate reads either number.
 */
const RUN_SCENES = [
  { who: 'A ropewalk', unit: 'yarns', per: 'pass', setup: 'lead-in' },
  { who: 'A hurdle maker', unit: 'withies', per: 'row', setup: 'binding' },
  { who: 'A trellis builder', unit: 'battens', per: 'tier', setup: 'base frame' },
  { who: 'A net braider', unit: 'meshes', per: 'round', setup: 'head rope' },
  { who: 'A besom binder', unit: 'birch twigs', per: 'course', setup: 'stake row' },
] as const;

/** Something built in equal parts with a fixed extra — met from the far end. */
const GATHER_SCENES = [
  { who: 'A bindery', unit: 'sheets', per: 'quire', extra: 'endpapers', whole: 'book' },
  { who: 'A lath crew', unit: 'laths', per: 'bay', extra: 'corner run', whole: 'wall' },
  // Not 'hoops': c22 serves "Two hoops lie on the mat … which hoop does that card
  // belong in?", so the word is already a sorting manipulative in this corpus.
  { who: 'A pergola builder', unit: 'purlins', per: 'span', extra: 'end pair', whole: 'walkway' },
  { who: 'A cooper', unit: 'staves', per: 'ring', extra: 'head boards', whole: 'cask' },
  { who: 'A wheelwright', unit: 'spokes', per: 'felloe', extra: 'nave pair', whole: 'wheel' },
] as const;

/** A store counted by containers, with something on the bench that is not spent. */
const STORE_SCENES = [
  { who: 'A rope loft', unit: 'ferrules', per: 'reel', spare: 'in the drawer', idle: 'swaging presses' },
  { who: 'A vellum works', unit: 'folios', per: 'sheaf', spare: 'on the bench', idle: 'lunellum knives' },
  { who: 'A gabion yard', unit: 'mesh panels', per: 'basket', spare: 'in the stack', idle: 'crimping tools' },
] as const;

/** Two designs for the same run — the comparison frame. */
const DESIGN_SCENES = [
  { where: 'A trackway crew', thing: 'boarded path', unit: 'sleepers', per: 'section' },
  { where: 'A pier yard', thing: 'guard rail', unit: 'stanchions', per: 'bay' },
  { where: 'A stonemason', thing: 'colonnade', unit: 'balusters', per: 'arch' },
] as const;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * E10 — a power, valued. `n^2` is one of this week's three machines and the only
 * one whose value a child can get wrong for a reason that has nothing to do with
 * variables, so it is met once as pure arithmetic before it is met as a machine.
 */
const wPower = asWarmup(evaluatePower(), E10);
/**
 * D21 — the order of operations with no brackets in it: the convention every
 * substitution then runs on, since `a·n + b` is settled multiply-first.
 */
const wOrderPlain = asWarmup(evalExpr(false), D21);
/** D21 — a phrase read into an expression, at the level below this week's. */
const wWriteExpr = asWarmup(writeExprChoice(), D21);
/**
 * D15 — the product itself, so a substitution never stalls on the arithmetic.
 *
 * The two ranges are DISJOINT (3–12 against 13–24) because `multiply` draws its
 * two factors independently, and a warm-up whose factors can coincide is a
 * warm-up that can print `12 × 12` — a square, in the week where the squaring
 * machine is one of three things being told apart.
 */
const wProduct = asWarmup(multiply(3, 12, 13, 24), D15);
/**
 * D16 — exact division, the second move of the inverse-start chain.
 *
 * Divisor and quotient ranges are DISJOINT for the same reason: overlapping
 * ranges let the two coincide and print `49 ÷ 7 = ?`, whose answer is a square
 * root standing in a week that is not about square roots.
 */
const wDivide = asWarmup(divideExact(3, 9, 11, 19), D16);

// ---------------------------------------------------------------------------
// Evaluating — the week's core move, in its own frames
// ---------------------------------------------------------------------------

/**
 * A LENGTH, not an output: the same substitution the family's `evaluateAtX`
 * performs, met in a frame where the fixed part is visibly fixed.
 *
 * `evaluateAtX` states a rate per minute plus a set-up run, so the constant is a
 * thing that happened once. Here the constant is a thing that is THERE — two end
 * frames that no number of sections can change — which is the reading a child
 * needs before the same expression can mean three different stories on Day 5.
 * The variable is `n` rather than the family's `x`, so a page carrying both shows
 * the letter itself changing while the machine does not.
 *
 * The per-section length and the end allowance are drawn from DISJOINT windows
 * (3–9 against 11–20) because they are the same unit, and two same-unit
 * quantities that can coincide read as one quantity stated twice (kit §E2.4).
 *
 * No leak by construction: the answer exceeds the section length by `a(x − 1) + b`,
 * exceeds the end allowance by `a·x`, and exceeds the section count by
 * `x(a − 1) + b` — all three positive on every draw.
 */
const sitGantryLength = situation({
  situationType: 'measurement',
  cognitiveOp: 'alg-evaluate-length',
  draw: (r) => {
    const scene = r.pick(SPAN_SCENES);
    const a = r.int(3, 9);
    const b = r.int(11, 20);
    const x = r.int(4, 12);
    const name = one(r);
    return {
      // `article`, never a hardcoded "a": the pool holds 'aqueduct', and QG-12c
      // caught "a aqueduct" on seed 3 the moment it was added. lib/format.ts is
      // the single interpolation authority for exactly this (kit §F.6).
      prompt: `${name} works out that every ${unitFor(1, scene.per)} of ${article(scene.thing)} adds ${countNoun(a, scene.unit)}, while ${scene.ends} together add ${countNoun(b, scene.unit)} however many ${unitFor(2, scene.per)} there are. So ${article(scene.thing)} of n ${unitFor(2, scene.per)} measures ${linearExpr(a, b, 'n')} ${scene.unit}. How long is ${article(scene.thing)} of ${countNoun(x, scene.per)}?`,
      answerValue: String(linearValue(a, x, b)),
      templateId: 'e_alg_eval_v1',
      params: { a, b, x },
      units: scene.unit,
      hints: [
        'Which part of this length changes when more sections are added, and which part never does?',
        'Put the given count in place of the letter, settle the multiplying part, then bring the fixed part in.',
      ],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: four shapes, so "two steps" never becomes one template
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S KEY MULTI-STEP — EVALUATE AT SEVERAL VALUES, in the one situation
 * where evaluating twice is what the story actually asks for.
 *
 * Two separate runs of the same job. Each run pays its own set-up, so the total
 * is the expression at the first count plus the expression at the second — and
 * the child who gathers the two counts and evaluates ONCE gets a genuinely
 * different number, which is the mistake this item exists to make visible rather
 * than to punish. Both readings are on the table, and only one of them matches
 * the story.
 *
 * The chain gathers, scales, and then brings the set-up in twice, so the step
 * count is DERIVED from the arithmetic the item ships rather than asserted.
 *
 * Both same-unit pairs are drawn from DISJOINT windows: the per-pass count
 * against the set-up count (4–9 against 11–18), and the two run lengths against
 * each other (2–6 against 7–11). Same-unit quantities that can coincide read as
 * one quantity stated twice, and two run lengths that can coincide would make
 * "one run of 5 and a second run of 5" a story about one run (kit §E2.4).
 *
 * No leak by construction: the answer is at least 4 × (2 + 7) + 2 × 11 = 58,
 * while the largest number the prompt can state is 18.
 */
const msTwoStints = multiStep({
  situationType: 'combine',
  cognitiveOp: 'alg-evaluate-twice',
  draw: (r) => {
    const scene = r.pick(RUN_SCENES);
    const a = r.int(4, 9);
    const b = r.int(11, 18);
    const first = r.int(2, 6);
    const second = r.int(7, 11);
    const name = one(r);
    return {
      prompt: `${scene.who} lays ${countNoun(a, scene.unit)} in every ${unitFor(1, scene.per)}, and every run begins with ${countNoun(b, scene.unit)} as its ${scene.setup}. So a run of n ${unitFor(2, scene.per)} uses ${linearExpr(a, b, 'n')} ${scene.unit}. ${name} works one run of ${countNoun(first, scene.per)} and, on a different day, a second run of ${countNoun(second, scene.per)}. How many ${scene.unit} do the two runs use altogether?`,
      initN: first,
      steps: [
        { op: 'add', n: second, d: 1 },
        { op: 'mul', n: a, d: 1 },
        { op: 'add', n: b, d: 1 },
        { op: 'add', n: b, d: 1 },
      ],
      units: scene.unit,
      hints: [
        'How many times does this story start a run, and what does starting one cost every time?',
        'Work the expression out for each run on its own, then put the two totals together.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3, the Level-E lift): the machine run
 * backwards, with nothing in the sentence order saying to run it backwards.
 *
 * The count the story hands over is what the expression HANDED BACK, not what
 * went into it, so the opening move is a subtraction no sentence asks for and the
 * second is the division that undoes the scaling. It is a solving move made
 * before solving has a notation — E13 formalises it as an equation on a balance,
 * and this week meets it as a story so that the notation arrives with the idea
 * already in hand.
 *
 * The per-part count and the fixed extra are the same unit and are drawn from
 * DISJOINT windows (2–5 against 6–9), so the prompt never states one amount
 * twice; and the ANSWER's window starts above both of them, so the count being
 * asked for is never a number already on the page (kit §E2.4).
 *
 * THE ANSWER WINDOW IS 11–39, AND ITS WIDTH IS THE POINT. This item's answer IS
 * the drawn count, so the number of distinct answers it can produce is exactly
 * the width of that window and nothing else — no other draw widens it. The first
 * version drew 10 to 18 and served NINE distinct answers over 1,000 measured
 * items, with a top share of 12.8% against a uniform 11.1%; that is thin
 * anywhere and it is a mastery slot, where a child could recognise the answer
 * space before recognising the question. Widening the window is the whole repair,
 * and the stated total stays under 205 so no draw reaches a thousands separator.
 *
 * No leak by construction: the answer runs 11 to 39, above the per-part count
 * (at most 5) and the fixed extra (at most 9), while the stated total is
 * `a·n + b`, which exceeds the answer by at least `n + 6`.
 */
const msQuireCount = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'alg-undo-an-expression',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const scene = r.pick(GATHER_SCENES);
    const a = r.int(2, 5);
    const b = r.int(6, 9);
    const n = r.int(11, 39);
    const total = a * n + b;
    return {
      prompt: `${scene.who} puts ${countNoun(a, scene.unit)} into every ${unitFor(1, scene.per)} and adds ${countNoun(b, scene.unit)} as the ${scene.extra}, so ${article(scene.whole)} of n ${unitFor(2, scene.per)} holds ${linearExpr(a, b, 'n')} ${scene.unit}. A finished ${scene.whole} holds ${countNoun(total, scene.unit)}. How many ${unitFor(2, scene.per)} does it have?`,
      initN: total,
      steps: [
        { op: 'sub', n: b, d: 1 },
        { op: 'div', n: a, d: 1 },
      ],
      units: scene.per,
      hints: [
        'Is the count you have been given what went into the expression, or what came out of it?',
        'Take off the part that never depended on the letter, then undo the scaling that is left.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3): a stated quantity the chain never
 * spends, and a plausible DIVISOR rather than scenery a child ignores.
 *
 * Every item in the v2 corpus consumed every number it mentioned, which quietly
 * teaches "use all the numbers" as a winning strategy. Here the idle count is
 * small and divisor-shaped — presses, knives, tools — so a child who reaches
 * for it reaches for a division rather than ignoring the sentence.
 *
 * ALL THREE SAME-UNIT QUANTITIES ARE DRAWN FROM DISJOINT WINDOWS: the per-container
 * count (12–16), the loose count (17–22) and the count already gone (24–32). The
 * first draft overlapped the last two and served "12 frames in the store … 12
 * frames have already gone out" — one number doing two jobs in one sentence, which
 * no gate reads and which kit §E2.4 exists for. The container count (7–11) and the
 * idle count (3–5) are different units again and clear of all three.
 *
 * No leak by construction: the answer is at least 12 × 7 + 17 − 32 = 69, while the
 * largest number the prompt can state is 32.
 */
const msFramesOut = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'alg-evaluate-then-remove',
  posing: 'has-distractor',
  draw: (r) => {
    const scene = r.pick(STORE_SCENES);
    const a = r.int(12, 16);
    const n = r.int(7, 11);
    const b = r.int(17, 22);
    const gone = r.int(24, 32);
    const idle = r.int(3, 5);
    const name = one(r);
    return {
      prompt: `${scene.who} keeps ${countNoun(a, scene.unit)} in every ${unitFor(1, scene.per)} and ${countNoun(b, scene.unit)} ${scene.spare}, so n ${unitFor(2, scene.per)} account for ${linearExpr(a, b, 'n')} ${scene.unit} in all. ${name} has ${countNoun(n, scene.per)} made up and ${countNoun(idle, scene.idle)} standing by. ${countNoun(gone, scene.unit)} have already gone out. How many ${scene.unit} are still there?`,
      initN: n,
      steps: [
        { op: 'mul', n: a, d: 1 },
        { op: 'add', n: b, d: 1 },
        { op: 'sub', n: gone, d: 1 },
      ],
      units: scene.unit,
      hints: [
        // Rewritten off E10's has-distractor rung, which this matched WORD FOR WORD
        // on a first pass. `bb-cross-week-test --strict` compares ladders and would
        // have caught this one; the six other hits in the same scan it would not.
        'Which of the amounts this story names is the expression actually built out of?',
        'Settle what the expression comes to for the count given, then take away what has left.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

/**
 * TWO EXPRESSIONS, ONE VALUE OF n — the week's claim as a single page, and the
 * carrier of the estimate-first probe.
 *
 * One design uses more pieces per bay and fewer at the ends; the other reverses
 * it. Which needs fewer pieces therefore depends entirely on how many bays there
 * are, and the child cannot know until they put the number in — which is the same
 * sentence as "you cannot tell which expression is bigger until you know what the
 * letter stands for", said about a shed rather than about algebra.
 *
 * THE PROBE IS A COIN FLIP BY CONSTRUCTION (decision 4, kit §E2.9a). Two
 * independent fair coins run the page. `lowRateWins` decides whether the
 * end-piece gap is above or below the per-bay gap multiplied by the bay count,
 * which decides which DESIGN uses fewer. `firstIsHighRate` decides which of the
 * two designs is printed as Plan One. Because the second coin is independent of
 * every number on the page, "Plan One" is the answer to the probe exactly half
 * the time whatever the numbers do, and "the plan with the smaller per-bay count"
 * is the first coin and therefore also exactly half.
 *
 * The per-bay counts (3–12) and the end counts (15 upward) are drawn from DISJOINT
 * windows even though they are the same unit. The first draft shared one window
 * and served "Plan One needs 5 stanchions for every section and 5 stanchions at
 * the ends", where one numeral does two jobs in a sentence whose whole point is
 * that the two jobs are different (kit §E2.4).
 *
 * No leak by construction, both branches. The largest number the prompt can print
 * is the larger end count, `fixedLow + df`, which is at least 17 and so above both
 * per-bay counts and the bay count:
 *  · when the higher per-bay design wins, the answer is `rateHigh·k + fixedLow`,
 *    and `rateHigh·k = rateLow·k + dr·k ≥ 12 + dr·k`, which is above
 *    `df ≤ dr·k + 6` — so the answer exceeds `fixedLow + df`;
 *  · when the lower per-bay design wins, the answer is `rateLow·k + fixedHigh`,
 *    which exceeds `fixedHigh` by `rateLow·k ≥ 12`.
 */
const msTwoPlans = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'alg-compare-two-expressions',
  draw: (r) => {
    const scene = r.pick(DESIGN_SCENES);
    const k = r.int(4, 9);
    const dr = r.int(2, 4);
    const rateLow = r.int(3, 8);
    const rateHigh = rateLow + dr;
    const fixedLow = r.int(15, 24);
    // COIN ONE — which design wins. Above the crossing the cheaper design is the
    // one with the smaller per-bay count; below it, the one with the smaller end
    // count. `dr · k` is at least 8, so the lower window never goes below 2.
    const lowRateWins = r.chance(0.5);
    const df = lowRateWins ? r.int(dr * k - 6, dr * k - 1) : r.int(dr * k + 1, dr * k + 6);
    const fixedHigh = fixedLow + df;
    // COIN TWO — which of the two is called Plan One. Independent of every number
    // above, which is what makes the probe a coin flip rather than a hope.
    const firstIsHighRate = r.chance(0.5);
    const planOne = firstIsHighRate ? { rate: rateHigh, fixed: fixedLow } : { rate: rateLow, fixed: fixedHigh };
    const planTwo = firstIsHighRate ? { rate: rateLow, fixed: fixedHigh } : { rate: rateHigh, fixed: fixedLow };
    const winner = lowRateWins ? { rate: rateLow, fixed: fixedHigh } : { rate: rateHigh, fixed: fixedLow };
    return {
      prompt: `${scene.where} is costing out ${article(scene.thing)} of n ${unitFor(2, scene.per)}. Plan One needs ${countNoun(planOne.rate, scene.unit)} for every ${unitFor(1, scene.per)} and ${countNoun(planOne.fixed, scene.unit)} at the ends, so it needs ${linearExpr(planOne.rate, planOne.fixed, 'n')} ${scene.unit} in all. Plan Two needs ${countNoun(planTwo.rate, scene.unit)} for every ${unitFor(1, scene.per)} and ${countNoun(planTwo.fixed, scene.unit)} at the ends, so it needs ${linearExpr(planTwo.rate, planTwo.fixed, 'n')} ${scene.unit} in all. For ${article(scene.thing)} of ${countNoun(k, scene.per)}, how many ${scene.unit} does the plan that needs fewer come to?`,
      initN: k,
      steps: [
        { op: 'mul', n: winner.rate, d: 1 },
        { op: 'add', n: winner.fixed, d: 1 },
      ],
      units: scene.unit,
      hints: [
        'Can you tell which plan needs fewer before you know how many sections there are?',
        'Work each plan out for the count given, keep the smaller total, and say which plan it belongs to.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Reachable ONLY through the wrapper (kit §E2.2): the metacognition wrapper does
 * not touch the hint ladder, so serving this generator both raw and wrapped on
 * the daily pages would spend two of the week's ladder slots on one wording. The
 * raw form appears in the mastery forms, which the ladder dedup does not see and
 * where a scaffold does not belong anyway.
 */
const msTwoPlansEstimate = withEstimateFirst(
  msTwoPlans,
  'which of the two plans do you expect to need fewer pieces?',
);

// ---------------------------------------------------------------------------
// Discrimination — the recipe's three machines, built here because nothing in
// `lib/` compares expressions that GROW differently (decision 1)
// ---------------------------------------------------------------------------

/**
 * What each machine DOES, written per CARD rather than per (truth, card) pair,
 * because a machine means the same thing whichever one is wanted — and
 * deliberately with no word about which of them comes out larger, since a
 * rationale that names the rank teaches the surface the item is built to remove.
 */
type Machine = 'scaled' | 'squared' | 'shifted';
const MACHINES: readonly Machine[] = ['scaled', 'squared', 'shifted'];

const MACHINE_RATIONALE: Record<Machine, { tag: ErrorTag; text: string }> = {
  scaled: {
    tag: 'representation-misread',
    text: 'Takes as many copies of the number as the multiplier says. The multiplier decides how many copies there are and the number decides how big each one is, so the two jobs stay separate.',
  },
  squared: {
    tag: 'concept-misconception',
    text: 'Uses the number twice as a factor, so the number decides how many copies there are as well as how big each one is, and both jobs move together whenever it changes.',
  },
  shifted: {
    tag: 'task-comprehension',
    text: 'Leaves the number as it is and sets a fixed amount beside it, so the same amount is added on however large or small the number happens to be.',
  },
};

/** The three machines as the child sees them, and as code evaluates them. */
function machineText(m: Machine, a: number): string {
  switch (m) {
    case 'scaled': return linearExpr(a, 0, 'n');
    case 'squared': return SQUARE;
    case 'shifted': return linearExpr(1, a, 'n');
  }
}

function machineValue(m: Machine, a: number, n: number): number {
  switch (m) {
    case 'scaled': return a * n;
    case 'squared': return n * n;
    case 'shifted': return n + a;
  }
}

/**
 * THE RECIPE'S DISCRIMINATION: `2n` against `n^2` against `n + 2`, asked in the
 * one direction that does not hand the answer over.
 *
 * The obvious form of this item — "which of these is biggest when n is 7" — is a
 * free 100% for "tap the squared one", because for every n ≥ 3 the order
 * `n^2 > 2n > n + 2` is fixed and nothing in the numbers can move it. So the
 * question is turned around: the VALUE is stated and the machine is asked for.
 * The keyed machine is drawn in exact thirds, INDEPENDENTLY of the fed value and
 * the multiplier, and that alone is what puts every readable surface on chance.
 *
 * Be exact about why, because the tempting explanation is wrong. It is NOT that
 * each rank belongs to a fixed card: the multiplier is drawn either side of the
 * fed value, so `a·n` and `n^2` change places between draws, and `n + a` is not
 * always the smallest either — at n = 3 with a = 7 or 8 the shifted machine
 * passes the squared one. The ranks move. What makes "the largest", "the middle",
 * "the smallest", "the squared one", "the longest card" and "the shortest card"
 * all worth a third is that the KEY is uniform over the three machines and knows
 * nothing about the draw, so whatever rank a machine happens to hold is keyed a
 * third of the time. Measured over 3,200 served items: largest 33.3%, middle
 * 32.4%, smallest 34.3%, squared card 32.2%, longest 33.9%, shortest 33.9%.
 *
 * `LEGAL_MULTIPLIERS` and its module-load proof are what make the prompt↔card
 * surface empty: the prompt prints the fed value and the target, the cards print
 * the multiplier and the two of the square, and no draw lets any of those four
 * numbers coincide.
 */
const discrimWhichMachine = discrimination({
  variant: 'structural',
  cognitiveOp: 'alg-match-machine',
  draw: (r) => {
    const truth = r.pick(MACHINES);
    const [k, multipliers] = r.pick(LEGAL_MULTIPLIERS);
    const a = r.pick(multipliers);
    return {
      prompt: `These three expressions are three different machines, and all three are fed the same number. When n stands for ${fmtInt(k)}, exactly one of them comes to ${fmtInt(machineValue(truth, a, k))}. Which one?`,
      correct: machineText(truth, a),
      distractors: MACHINES.filter((m) => m !== truth).map((m) => ({
        text: machineText(m, a),
        errorTag: MACHINE_RATIONALE[m].tag,
        rationale: MACHINE_RATIONALE[m].text,
      })),
      hints: [
        'What does each of these three do to the number it is fed, before any number is fed to it?',
        'Feed the given number to each machine in turn and keep the one that lands on the stated amount.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * THE ORDERING QUESTION, WHICH ONLY SURVIVES OVER TWO MACHINES.
 *
 * Over all three of the recipe's machines "which is biggest" has one answer for
 * every n ≥ 3 and cannot be asked honestly. Over two of them it can, because
 * `a·n` and `n^2` genuinely trade places: the multiplying one is ahead below the
 * crossing, the squaring one is ahead above it, and they meet exactly at it. All
 * three verdicts are reachable, so no card is offered more often than it is keyed
 * — which is the L38 repair, and it is also the week's whole claim, since the
 * only honest answer to "which is bigger" is "tell me what n is".
 *
 * THE CARDS CARRY NO NUMERALS AT ALL. Both expressions are stated in the prompt
 * and the cards name the machines in words, so the prompt↔card correspondence
 * that cost `expressionMeaningTrap` a 50.6% strategy cannot exist here in any
 * form — there is nothing on a card for a child to match against the question.
 *
 * The FED VALUE is drawn before the verdict is used and from a window where all
 * three verdicts are reachable, so its distribution is identical whichever
 * verdict is keyed and no reading of it alone can answer the item. What DOES
 * answer the item is holding the multiplier against the fed value, and that is
 * the mathematics rather than a surface: the item's content is precisely that
 * `a·n` and `n^2` change places at n = a.
 */
const SAME_CARD = 'they hand back the same amount';
const SCALED_CARD = 'the multiplying one';
const SQUARED_CARD = 'the squaring one';

type Verdict = 'scaled' | 'squared' | 'same';
const VERDICTS: readonly Verdict[] = ['scaled', 'squared', 'same'];

const VERDICT_CARD: Record<Verdict, string> = {
  scaled: SCALED_CARD,
  squared: SQUARED_CARD,
  same: SAME_CARD,
};

const VERDICT_RATIONALE: Record<Verdict, { tag: ErrorTag; text: string }> = {
  scaled: {
    tag: 'representation-misread',
    text: 'The multiplying machine is ahead only while the number fed in is smaller than its multiplier, because until then the multiplier is doing more work than the number can do for itself.',
  },
  squared: {
    tag: 'concept-misconception',
    text: 'The squaring machine is ahead once the number fed in passes the multiplier, because from there the number is a bigger multiplier of itself than the fixed one is.',
  },
  same: {
    tag: 'task-comprehension',
    text: 'The two meet at exactly one place above zero — where the number fed in equals the multiplier — and away from it one of them is always ahead of the other.',
  },
};

const discrimBiggerAtN = discrimination({
  variant: 'structural',
  cognitiveOp: 'alg-order-two-machines',
  draw: (r) => {
    // The FED VALUE first, from a window where all three verdicts are reachable
    // (b09's construction): every value from 3 to 8 admits a multiplier above it,
    // a multiplier below it, and itself.
    const n = r.int(ORDER_LO, ORDER_HI);
    const verdict = r.pick(VERDICTS);
    const a = verdict === 'same' ? n : verdict === 'scaled' ? r.int(n + 1, 9) : r.int(2, n - 1);
    return {
      prompt: `Two machines are fed the same number. One hands back ${linearExpr(a, 0, 'n')} and the other hands back ${SQUARE}. When n stands for ${fmtInt(n)}, which of them hands back more?`,
      correct: VERDICT_CARD[verdict],
      distractors: VERDICTS.filter((v) => v !== verdict).map((v) => ({
        text: VERDICT_CARD[v],
        errorTag: VERDICT_RATIONALE[v].tag,
        rationale: VERDICT_RATIONALE[v].text,
      })),
      hints: [
        'Could you answer this if nobody told you what the letter stands for?',
        'Put the given number into each machine in turn and set the two amounts side by side.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/** "twice n" reads better than "2 times a number n", and only at two. */
function timesPhrase(a: number): string {
  return a === 2 ? 'twice a number n' : `${fmtInt(a)} times a number n`;
}

/**
 * THE RECIPE'S ERROR-ANALYSIS, EXACTLY AS WRITTEN: "3 more than twice n" put down
 * as `2(n + 3)`.
 *
 * `e_alg_verify_misgroup_v1` computes both values from the same params — the
 * truth as `a·x + b` and the slip as `a·(x + b)` — so the number the student is
 * shown to have written is a real output of the named misconception and the true
 * answer is code-computed. Neither can be fabricated, and QG-11 re-derives both
 * from the params the item ships.
 *
 * The draw stays inside the template's guard rather than testing it: the two
 * readings differ by `b(a − 1)`, so they coincide exactly when a = 1 or b = 0,
 * and `a` starts at 2 and `b` at 1. That guard is not decoration — `verifyFrac`
 * and `verifyDec` shipped without one and put a student's "wrong" answer against
 * an identical key on a served page.
 */
const eaMisgroupedBracket = errorAnalysis({
  verifyTemplateId: 'e_alg_verify_misgroup_v1',
  cognitiveOp: 'alg-translate-a-phrase',
  drawParams: (r) => ({ a: r.int(2, 9), b: r.int(1, 9), x: r.int(2, 12) }),
  build: (v, p) => {
    const a = Number(p.a);
    const b = Number(p.b);
    const x = Number(p.x);
    return {
      // `factoredExpr`, never a bare `${a}(n + ${b})`: lib/format.ts is the single
      // interpolation authority for every quantity a prompt prints (kit §F.6), and
      // the factored form is exactly what it renders.
      prompt: `A student was asked to write "${fmtInt(b)} more than ${timesPhrase(a)}" as an expression and then find its value when n is ${fmtInt(x)}. They wrote ${factoredExpr(a, b, 'n')} on the next line and answered ${v.wrong}.`,
      extension: 'Write the expression the words really describe, work out the value it gives at that same number, and finish with one sentence saying what a bracket does to the order the words asked for.',
      hints: [
        'Which of the two things the phrase describes happens to the number first?',
        'Read the phrase from the inside out, build it one step at a time, and value each version at the number given.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: [`${a}n + ${b}`, 'multiply first', 'the bracket adds first'],
    };
  },
});

/**
 * THE DAY-5 SIGNATURE (§6 row E11, "one expression, three stories").
 *
 * Fixed prose, because what is being assessed is the reading rather than another
 * piece of arithmetic — and fixed on purpose, because the point only lands if the
 * three situations sit on the page together and the SAME expression is above all
 * of them. One machine, three referents: the letter counts bays in one, tiers in
 * the second and finished events in the third, and the single number the
 * expression produces means laths, nest holes and points in turn.
 *
 * That is the anchor stated backwards. If the variable is a bag that any number
 * can be in, then the expression cannot know what its own answer is about, and
 * three stories are the cleanest proof of it a child can hold.
 */
const threeStoriesOneExpression = reasoning({
  prompt:
    'Here is one expression: 5n + 8. Read it three times over, once for each of these. A lattice fence uses 8 laths in its end frame and 5 more laths for every bay. A dovecote has 8 nest holes in its doorway wall and 5 nest holes in every tier above it. A club points card gives 8 points for turning up and 5 points for every event finished. For each one, write down what n counts. Then work out the value of the expression when n is 6, and finish with one sentence saying what that single number means in each of the three.',
  value:
    'n counts bays, then tiers, then finished events; the value is 38 in all three, and it means 38 laths, 38 nest holes and 38 points, because the expression does not know which story it is in',
  acceptableForms: ['38', 'bays', 'tiers', 'finished events', 'laths', 'nest holes', 'points'],
  keywords: true,
  hints: [
    'What is the letter standing for in each of these three, and is it the same thing each time?',
    'Take one story at a time, name what is being counted, then value the expression once and read the answer back into all three.',
  ],
  errorTags: ['representation-misread', 'task-comprehension'],
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
 * third, and so does "tap the longest card", since the three verdict words are
 * fixed strings of different lengths.
 *
 * The three claims are the three things this week most needs a learner to be able
 * to defend, and each of them is a statement about EVERY number the bag can hold
 * rather than about one.
 */
interface AsnClaim {
  claim: string;
  verdict: 'always' | 'sometimes' | 'never';
  wrong: Record<string, { tag: ErrorTag; text: string }>;
}

const ASN_VERDICTS = ['always', 'sometimes', 'never'] as const;

const ASN_CLAIMS: readonly AsnClaim[] = [
  {
    claim: 'for a whole number n, the expression n + 2 comes to more than n itself does',
    verdict: 'always',
    wrong: {
      sometimes: {
        tag: 'procedure-slip',
        text: 'Treats the outcome as something that depends on how big the number is. The amount added on is fixed, so it does the same work at every size, and adding a positive amount to anything leaves you above where you started.',
      },
      never: {
        tag: 'representation-misread',
        text: 'Reads the letter as though it could stand for anything at all, including something that would swallow the two. Within whole numbers there is no such value, and the smallest one the bag can hold still comes out two ahead of itself.',
      },
    },
  },
  {
    claim: 'for a whole number n, the expression n^2 comes to more than the expression 2n does',
    verdict: 'sometimes',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'Reads a squaring machine as always the faster grower. It overtakes and then runs away, but it starts behind: at one it is below, and at zero and at two the two machines land on the same amount.',
      },
      never: {
        tag: 'task-comprehension',
        text: 'Over-corrects into treating the two as fixed in the other order. Past two the squaring machine is ahead and the gap only widens, so the claim holds for every whole number above two.',
      },
    },
  },
  {
    claim: 'for a whole number n above two, the expression n + 2 comes to more than the expression 2n does',
    verdict: 'never',
    wrong: {
      always: {
        tag: 'concept-misconception',
        text: 'Reads adding as the stronger move because the amount added is written next to the number. Doubling gives you the number all over again, and above two the number is worth more than the two you would have added.',
      },
      sometimes: {
        tag: 'task-comprehension',
        text: 'Looks for the friendly value where it works out. Below two there is one, but the claim has already ruled those out, and from three upward the doubling machine is ahead at every single value.',
      },
    },
  },
];

const expressionClaimVerdict: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const c = r.pick(ASN_CLAIMS);
    const distractors = ASN_VERDICTS.filter((v) => v !== c.verdict).map((v) => ({
      text: v,
      errorTag: c.wrong[v].tag,
      rationale: c.wrong[v].text,
    }));
    const { choices, correctKey } = makeChoices(r, c.verdict, distractors);
    return {
      type: 'classification' as const,
      prompt: `Always, sometimes, or never true: ${c.claim}. Then say in one sentence what settled it for you — the number that decided it, or why no single number could.`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' as const },
      difficulty,
      strand: 'noncomputational' as const,
      isRetrieval: false,
      hintLadder: [
        'Is one value of the letter enough to settle a claim about every value, or only ever enough to sink one?',
        'Try the claim at nought, at one and at two, then at something larger, and see whether one verdict covers them all.',
      ],
      // The tags are the DRAWN claim's own two readings, not a fixed union of all
      // three claims': QG-9 caps an item at three, and a union would also bank a
      // tag no card on the served page actually carries.
      errorTags: distractors.map((d) => d.errorTag) as ErrorTag[],
      authorMeta: { stepCount: 1, cognitiveOp: 'alg-defend-expression-claim' },
    };
  });

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE11 = makeWeekBuilder({
  level: 'E',
  week: 11,
  conceptId: 'algebraic-expressions',
  conceptName: 'Algebraic expressions',
  strandTags: ['algebra-geometry', 'multiplication-division'],
  prerequisiteWeeks: [D15, D16, D21, E10],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the variable as an any-number bag',
  conceptFamily: 'operation',
  deepeningDelta:
    'D21 wrote expressions from phrases and settled the order of operations over them, but every number in every one of them was already known — the expression was a way of recording arithmetic that had not been done yet, and doing it always finished the job. E11 puts a letter where one of those numbers was, and that changes what an expression IS: it stops being a delayed calculation and becomes a machine, with no value at all until something is fed to it. Three things follow that D21 had no way to say. An expression can now be evaluated many times over and give a different answer each time, which is why the week\'s core item substitutes at several values rather than one. Two expressions can now trade places, so "which is bigger" stops being a question about numbers and becomes a question about the letter. And the same expression can now describe several unrelated situations at once, which is where the week ends — because a machine that does not know what its own answer is about is exactly what a variable buys you.',
  explanation: {
    hook:
      'Write down a number, any number, and keep it to yourself. Double it, add ten, halve what you have, and take away the number you started with. You are thinking of five. Everybody is thinking of five, whatever they started with, and by Friday you will be able to say exactly why.',
    whyBeforeHow:
      'A letter in an expression is not a name and it is not a missing number waiting to be found. It is a bag, and any number at all can be in it — the anchor for this week is the variable as an any-number bag, and everything else follows from it. That is why 4n + 7 is not a question with an answer. It is a machine: feed it three and it hands back nineteen, feed it ten and it hands back forty-seven, and until something goes in it has no value to have. The two numbers in it are doing different jobs, and this is the part worth being slow about — the four is attached to the bag and scales whatever comes out of it, while the seven is attached to nothing and arrives the same size every time. Since the bag can hold any number, two machines that look alike can behave nothing alike: 2n and n^2 and n + 2 are three different machines, and asking which of them is biggest is not a question until somebody says what n is. At nought and at two, two of them agree; at one, the order reverses completely; from three upward it settles down and never changes again. So before you work any of them out, say roughly what size you expect the answer to be, because a substitution that has gone wrong looks exactly as tidy as one that has not, and the size is the only thing that will object. And when you read a machine out of words, read the words for their order and not their sequence: "three more than twice n" doubles first and adds second, so the doubling has to be written first, and a bracket round the adding says the opposite of what the words said.',
    script: [
      {
        say: 'Watch me build a machine and then feed it three different numbers. Here it is: four n plus seven. I have not made a mistake by leaving the letter there — the letter is the hole the number goes in. Feed it two: four twos are eight, and seven more is fifteen. Feed it five: four fives are twenty, and seven more is twenty-seven. Feed it ten: forty, and seven more is forty-seven. Notice what stayed still every single time. The seven. It never grew, because it is not attached to the bag, and the four never appeared on its own, because it is.',
        visual: 'The same expression fed three different numbers, with the fixed part drawn the same size in all three bars.',
        figure: barModel(
          [
            { label: 'fed two', segments: [{ value: 8, label: '8' }, { value: 7, label: '7', fill: 'soft' }], total: '15' },
            { label: 'fed five', segments: [{ value: 20, label: '20' }, { value: 7, label: '7', fill: 'soft' }], total: '27' },
            { label: 'fed ten', segments: [{ value: 40, label: '40' }, { value: 7, label: '7', fill: 'soft' }], total: '47' },
          ],
          { scaleMax: 47, alt: 'three bars to one scale, each ending with a seven of the same width while the part before it grows from eight to twenty to forty' },
        ),
      },
      {
        say: 'Now here are three machines side by side, and I want you to see me get this wrong on purpose. Two n, n squared, and n plus two. Which is biggest? I cannot tell you, and neither can anybody else, because nobody has said what n is. Feed all three a nought: nought, nought, and two — the adding one wins. Feed them a one: two, one, three — still the adding one, and the squaring one is now last. Feed them a two: four, four and four, all three level. Feed them a three: six, nine, five, and from here the squaring one is in front and stays in front for ever. Four answers to one question, and the only honest first move is to ask what is in the bag.',
        visual: 'A table of the three machines fed nought, one, two and three, with the row at two ruled across where all three land together.',
      },
      {
        say: 'Two habits, one before the arithmetic and one after. Before: I estimate. Feeding nine into six n plus five, I say to myself that six nines is somewhere near sixty, so I am expecting an answer in the high fifties — and then I work it out properly and get fifty-nine. If I had got fourteen I would have caught myself putting the nine in the wrong place. After: I check the size against what I expected, because a substitution that has gone wrong is just as tidy on the page as one that has not, and roughly right beats neatly wrong every time.',
        visual: 'The estimate written above the working, with the finished answer set beside it.',
      },
      {
        say: 'Last, the one that catches everybody. Three more than twice n. Watch the order: twice n first, then three more. So it is two n, then plus three — the doubling is written first because it happens first. Here is what a lot of people write instead: two, bracket, n plus three. Feed both a seven. Mine gives fourteen and three, which is seventeen. The bracket one adds first and gets ten, then doubles it and gets twenty. Twenty is not seventeen, and the bracket is the whole difference — it made the adding happen first, and the words never asked for that.',
        visual: 'The phrase written out with the doubling underlined first, set against the bracketed version and the two values they give at the same number.',
      },
    ],
    summary:
      'A letter in an expression stands for any number at all, so an expression is a machine rather than a question: it has no value until a number is fed to it, and a different one for every number fed. The part attached to the letter scales with whatever goes in, and the part attached to nothing arrives the same size every time. Because the letter can be anything, two expressions can trade places — 2n, n^2 and n + 2 agree at two, run in one order below it and the opposite order above it — so which is bigger is a question about the letter, not about the expressions. Reading words into an expression means reading their order: "three more than twice n" doubles first, and a bracket round the adding reverses that. And the same expression can describe several unrelated situations at once, which is exactly what makes it worth writing.',
    vocabulary: [
      { term: 'variable', kidGloss: 'a letter standing in for any number at all, not for one particular missing one' },
      { term: 'expression', kidGloss: 'a piece of mathematics with no equals sign — a machine that turns a number into another number' },
      { term: 'evaluate', kidGloss: 'to put a number in place of the letter and work out what the expression comes to' },
      { term: 'coefficient', kidGloss: 'the number attached to a letter, which says how many of that letter there are' },
      { term: 'constant term', kidGloss: 'the number attached to no letter, which stays the same whatever the letter stands for' },
    ],
  },
  guidedExamples: [
    {
      ...ge(11, 1, 'modeled', 'Work out the value of 6n + 13 when n is 8.', [
        {
          teacherSay:
            'Before I touch a number, let me read what I have got. There is a six sitting against the letter, so whatever goes into the bag gets taken six times over. There is a thirteen sitting on its own, so it is not going to move whatever I feed in. And there is an n, which today is eight — but only today.',
        },
        {
          teacherSay:
            'So I say roughly what to expect first. Six eights is near fifty, and there is a bit more to come, so I am looking for something in the low sixties. Now I substitute properly: what does the six become when the eight goes in?',
          expected: '48',
        },
        {
          childDo: 'Bring the fixed part in, then hold the total against the estimate before you write it down.',
          expected: '61',
        },
      ], '61'),
      visual: 'The scaled part and the fixed part drawn as two segments of one bar.',
      figure: barModel(
        [
          { label: 'six of the number fed in', segments: [{ value: 48, label: '48' }] },
          { label: 'and the part that never moves', segments: [{ value: 48, label: '48' }, { value: 13, label: '13', fill: 'soft' }], total: '61' },
        ],
        { scaleMax: 61, alt: 'a bar of forty-eight, then the same bar with a shorter thirteen joined on to make sixty-one' },
      ),
    },
    ge(11, 2, 'completion', 'Write "4 more than 3 times a number n" as an expression, then find its value when n is 9.', [
      {
        teacherSay: 'Which of the two things this phrase describes happens to the number first — the tripling, or the four being added on?',
        expected: 'the tripling, so 3n + 4',
      },
      {
        childDo: 'Put nine in place of the letter and settle the multiplying before the adding.',
        expected: '31',
      },
    ], '3n + 4, and 31'),
    ge(11, 3, 'prompted', 'Three machines: 2n, n^2 and n + 2. Fill in what each hands back when it is fed 0, then 1, then 2, then 5, and say at which of those four the three are level.', [
      {
        childDo: 'Work along one row at a time rather than down one machine at a time, so you can see the three amounts change places.',
        expected: '0/0/2, then 2/1/3, then 4/4/4, then 10/25/7 — level at 2',
      },
    ], 'level at 2'),
    // Not a kiln: e02 already serves "A kiln … identical trays" as a drawn scene,
    // and a guided example is authored prose that no per-pack gate compares across
    // weeks (kit §E2.13).
    ge(11, 4, 'independent', 'A salt house racks 7 blocks on every tier and 5 more on the drying floor, so a batch of n tiers holds 7n + 5 blocks. One batch used 3 tiers and a later batch used 6. How many blocks did the two batches hold between them? Solve cold.', [
      { childDo: 'Decide first how many times this story uses the drying floor.', expected: '73' },
    ], '73'),
  ],
  days: [
    // Day 1 — concept echo: the machine met three ways, all single-step, no chain
    // on the page at all. The warm-ups are ORDERED so the LAST is the D21
    // order-of-operations line: the retrieval ramp moves a pack's final Day-1
    // warm-up onto Day 5, and Day 5 is otherwise entirely prose, so a short
    // computation is the one thing that does not read as a fourth reading task.
    //
    // The two CARD items sit at positions 4 and 6 rather than 5 and 6. Both open
    // with a set of expressions, and served back to back they read as one exercise
    // asked twice; a situation item between them is enough to break that, and
    // nothing but reading the page shows it.
    [
      { gen: wPower, diff: 3 },
      { gen: wOrderPlain, diff: 2 },
      { gen: evaluateAtX(), diff: 3 },
      { gen: expressionMeaningTrap(), diff: 3 },
      { gen: sitGantryLength, diff: 3 },
      { gen: discrimWhichMachine, diff: 3 },
    ],
    // Day 2 — fluency + application: the ordering discrimination, the recipe's
    // key multi-step, and the estimate-first comparison. Two of the week's four
    // chains open here and neither is posed like the other.
    //
    // `wWriteExpr` is NOT here, and that is a reading decision rather than a
    // scheduling one: it asks "Which expression means …?" over three cards, and
    // `expressionMeaningTrap` asks the same sentence over three cards a few
    // centimetres below. Every gate passed the pair; the page did not.
    [
      { gen: wProduct, diff: 2 },
      { gen: wDivide, diff: 2 },
      { gen: discrimBiggerAtN, diff: 3 },
      { gen: msTwoStints, diff: 4 },
      { gen: msTwoPlansEstimate, diff: 4 },
      { gen: expressionMeaningTrap(), diff: 3 },
    ],
    // Day 3 — interleave: Day 1's two single-step shapes come back two days later
    // against the machine-matching discrimination and the inverse-start chain, so
    // nothing on the page signals which kind of work is coming next.
    [
      { gen: wWriteExpr, diff: 2 },
      { gen: wOrderPlain, diff: 2 },
      { gen: evaluateAtX(), diff: 3 },
      { gen: discrimWhichMachine, diff: 3 },
      { gen: msQuireCount, diff: 4 },
      { gen: sitGantryLength, diff: 3 },
    ],
    // Day 4 — word problems: four chains, no two posed alike (one evaluates the
    // same machine at two values, one states a count that is never spent, one
    // hands back what the machine produced, one evaluates then shares) wearing
    // four different frames.
    [
      { gen: wProduct, diff: 2 },
      { gen: msTwoStints, diff: 5 },
      { gen: msFramesOut, diff: 4 },
      { gen: msQuireCount, diff: 4 },
      { gen: msEvaluateThenShare(), diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, the one
    // expression read into three stories, a drawn always/sometimes/never claim,
    // and the ordering discrimination met once more with no chain around it
    // (+ the ramped warm-up).
    [
      { gen: eaMisgroupedBracket, diff: 4 },
      { gen: threeStoriesOneExpression, diff: 4 },
      { gen: expressionClaimVerdict, diff: 3 },
      { gen: discrimBiggerAtN, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the thing to listen for this week is your child treating the letter as a puzzle to be solved. Shown 4n + 7 they will often ask "but what IS n?", and the honest answer is that it is not anything yet — that is what makes it useful. If they get stuck, do not explain; feed the machine. Ask what it gives for two, then for five, then for ten, and write the three answers in a row. The moment they see the same seven turning up at the end of every line while the other part grows, the idea has landed, and the word "variable" is just a label for something they have now watched happen.',
  ],
  puzzle: (r) => {
    // THE WEEK'S CLAIM RUN AS A SEARCH, and a move no day item makes: every item
    // on the daily pages is handed a number and asked what a machine gives back.
    // The puzzle is handed two machines and asked WHERE they agree — a search
    // under a constraint, closed off with a completeness argument. It also lands
    // the child on the crossing that `discrimBiggerAtN` only ever shows them one
    // side of at a time.
    const a = r.int(3, 9);
    return {
      id: 'E11-PZ-01',
      // Not "Where The Machines Meet": that scored 0.67 against c07's "Puzzle
      // Grove: Where the Ladders Meet" in the cross-week scan, and a puzzle title
      // is exactly the kind of string `--strict` never looks at.
      title: 'Puzzle Grove: The Crossing Number',
      puzzleType: 'logic',
      prompt: `One machine hands back ${linearExpr(a, 0, 'n')} and another hands back ${SQUARE}. Fed most numbers they disagree. Find every whole number n at which the two hand back the same amount, smallest first. Then say in one sentence how you know there are no others.`,
      answer: {
        value: `0, ${fmtInt(a)}`,
        acceptableForms: [`0 ${fmtInt(a)}`, `0, ${fmtInt(a)}`],
        validation: 'ordered-list',
      },
      hintLadder: [
        'What would have to be true of a number for taking it a fixed number of times to be the same as taking it that many times?',
        'Try the small numbers in order, and watch which of the two is ahead before the meeting and which is ahead after it.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'alg-find-the-crossing' },
  sprint: {
    skill: 'Multiplication facts to 9 — the scaling step every substitution runs through before anything is added',
    sourceWeek: D15,
    itemCount: 20,
    scheduledDay: 2,
    templateId: 'mult_facts_v1',
    params: { factorRange: [3, 9] },
  },
  // SLOT 5 IS THE WEEK'S OWN CHAIN, NOT THE LIBRARY'S, AND THAT IS A MEASURED
  // DECISION. `msEvaluateThenShare` sat here first, and two things showed up in
  // the served packs: "add up every number on the page" landed on its key on
  // 7.0% of 800 Form-A slots (against ~2.5% for a blind guess in its answer
  // space), which is over the L51 bar in a certifying slot; and serving it three
  // times a pack spent most of its 38-value answer space, so 8.3% of packs
  // repeated an answer across the three. `msFramesOut` carries 103 distinct
  // answers over the same measurement, keeps the has-distractor lift inside the
  // certified set, and leaves the library chain served exactly once a week where
  // its narrow range costs nothing.
  mastery: [
    { gen: evaluateAtX(), diff: 3 },
    { gen: msTwoStints, diff: 4 },
    { gen: discrimWhichMachine, diff: 3 },
    { gen: msQuireCount, diff: 4 },
    { gen: msFramesOut, diff: 4 },
    { gen: msTwoPlans, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: one move apiece — a machine stated as a rate and valued at a given number of periods, and three machines against a stated output with the machine asked for. 02/04/05/06: chains — the same machine valued at two different counts with its fixed part paid twice; a count that is what the machine handed back, undone by a subtraction and then a division; a stock valued from its container count with a stated quantity that is never spent; and two machines set against each other at one count, with the smaller total asked for. The estimate-first scaffold is deliberately absent from the mastery form of the last of these: a check is a habit to teach, not a prop to assess with. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'bracket-the-words-never-asked-for',
      description: 'Writes "3 more than twice n" as 2(n + 3), gathering the number and the extra before scaling. It is not carelessness: the phrase names the three last, so the three gets written last, and a bracket is the only way to write it last and still have it there. What the reading loses is that "twice n" was already a finished amount before the three arrived.',
      exampleWrongAnswer: '"3 more than twice n" at n = 7 given as 20 rather than 17',
      distractorRationale: 'Offer the value the bracketed reading really produces at the same number, computed from the same two operands, so only reading the order of the phrase separates it from the true value.',
      reteachPointer: 'explanation/script[3] (the order the words asked for), then guidedExamples/E11-GE-02',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-the-letter-as-a-missing-number',
      description: 'Treats the letter as one particular number that has been hidden, so an expression looks like a question with a single right answer. The child then hunts for what n "really is" instead of feeding it something, and an expression that is evaluated twice at two different values reads as a contradiction rather than as the point.',
      exampleWrongAnswer: 'asked for 4n + 7 at n = 3 and again at n = 10, answers 19 both times',
      distractorRationale: 'Offer the value of the same expression at a different one of the counts the story states, so the two differ only in which number went into the bag.',
      reteachPointer: 'explanation/script[0] (one machine, three numbers fed in), then guidedExamples/E11-GE-01',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'evaluates-once-for-two-runs',
      description: 'Given two separate runs of the same job, gathers the two counts and puts the total through the expression once — so the fixed part is paid once where the story pays it twice. Every step is done correctly and the arithmetic is sound; what is missed is that the expression describes ONE run, and two runs are two of it.',
      exampleWrongAnswer: 'runs of 3 and of 6 put through 7n + 5 as a single run of 9, giving 68 where the story gives 73',
      distractorRationale: 'Offer the value the gathered reading really gives, which is the same expression evaluated at the summed count, so only noticing how many times the story starts a run separates the two.',
      reteachPointer: 'guidedExamples/E11-GE-04 (how many times the floor of the chamber is loaded), then the Day-4 two-run chain',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'adds-before-scaling-on-substitution',
      description: 'Substitutes correctly and then works the line strictly left to right, so the fixed part joins the number before the coefficient acts on it. Nothing about the working reads as careless — the substitution is right and so is each operation — and the answer comes out too big by the fixed part multiplied by one less than the coefficient.',
      exampleWrongAnswer: 'at n = 8, an answer of 126 for 6n + 13, from joining the 13 on before multiplying',
      distractorRationale: 'Offer what the same substitution comes to with the addition taken first: the child has really worked that number out, so meeting it as a card is meeting their own answer.',
      reteachPointer: 'explanation/whyBeforeHow (which number is attached to the bag), then the Day-1 order-of-operations warm-up',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'reads-the-squaring-machine-as-doubling',
      description: 'Values n^2 as though it were 2n, so both machines hand back the same amount at every number and the contrast the week is built on disappears. The two agree at nought and at two, which is enough to make the habit feel safe, and it survives being corrected once because most of the small numbers a child tries first are the ones where the gap is narrow.',
      exampleWrongAnswer: 'n^2 at n = 5 answered as 10',
      distractorRationale: 'Offer the doubled value beside the squared one at the same number, so only using the number twice as a factor separates them.',
      reteachPointer: 'explanation/script[1] (the three machines fed nought, one, two and three), then guidedExamples/E11-GE-03',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Algebraic expressions — reading a letter as any number rather than a hidden one, working an expression out at several different values, telling apart three expressions that grow at different rates, turning a phrase into an expression in the order the words actually give, and seeing one expression describe several unrelated situations at once.',
    improvingCandidates: [
      'putting a number in place of the letter and settling the scaling before the adding',
      'working the same expression out at two different values before deciding anything about it',
      'reading a phrase for the order its operations happen in rather than the order its numbers appear',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'writing the operation the words do first before the one they mention last, rather than reaching for a bracket',
      },
      {
        errorTag: 'representation-misread',
        text: 'reading a letter as a bag any number can go into, not as one particular number that is missing',
      },
      {
        errorTag: 'task-comprehension',
        text: 'noticing how many separate times a story runs an expression before working any of it out',
      },
      {
        errorTag: 'procedure-slip',
        text: 'letting the part attached to the letter act before the part attached to nothing arrives',
      },
      {
        errorTag: 'fact-recall',
        text: 'keeping a squaring machine and a doubling machine apart at the values where they nearly meet',
      },
    ],
    homeFocus: {
      praiseLine:
        'You estimated the size of the answer before you substituted, and when you had it you compared the two — that is the habit that catches a number put in the wrong place, and it caught one this week.',
      questionForChild: 'If I hand you the expression 5n + 8 and refuse to tell you what n is, what CAN you still tell me about it?',
      schoolSyncHook: 'Schools differ on this one more than on most: your child may be taught "variable" or "unknown" or "letter", and may be shown 4 × n, 4·n or 4n. Send us the wording and the notation their class uses and these pages will follow it.',
    },
    vocabularyForParent: [
      'variable (a letter standing for any number at all — not one particular hidden number)',
      'expression (a piece of mathematics with no equals sign; it has a value only once a number is fed in)',
      'coefficient (the number attached to a letter) and constant term (the number attached to nothing)',
    ],
  },
});
