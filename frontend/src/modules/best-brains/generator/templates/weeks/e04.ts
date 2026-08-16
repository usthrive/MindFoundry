/**
 * Level E · Week 4 — "Dividing fractions" (conceptId: dividing-fractions).
 *
 * FILL-ARCHITECTURE §6 row E4: anchor "scooping (how many 1/3s in 2?)"; key
 * multi-step "scoops in one whole → in k wholes"; error-analysis "inverts the
 * wrong fraction"; discrimination "÷ by a fraction < 1 makes MORE"; Day-5
 * signature "why invert-and-multiply (instance computable)". **R-lite** (§7):
 * the week ships a computable instance of the two routes agreeing, and flags
 * ONLY the general argument as manual-review.
 *
 * THE WEEK'S CLAIM. Division asks how many of one amount fit inside another,
 * and nothing in that question requires either amount to be a whole. That
 * single idea decides everything below:
 *  - the anchor is the measuring-out question — how many of one amount fit
 *    inside another — because it is the only reading of division that survives
 *    a fractional divisor. "Share it out between 2/3 people" means nothing;
 *    "how many 2/3s fit" means exactly what it says, and can be counted;
 *  - once the question is read that way the week's headline follows without a
 *    rule: measuring with something smaller than one whole gives a count LARGER
 *    than the amount measured, and measuring with something larger than one
 *    whole gives a smaller one. That is why the recipe's discrimination is the
 *    centre of the week rather than a garnish on it;
 *  - and it is why this week owns two methods where D19 owned one. Rename both
 *    amounts over a single bottom number and the division becomes a division of
 *    the two TOP numbers — a whole-number count of the same-sized piece. That
 *    renaming is the honest reason invert-and-multiply works, and the Day-5
 *    pair is built on it.
 *
 * DEEPENING vs D19 (BB-G1). D19 divided a whole by a UNIT fraction and a unit
 * fraction by a whole, and its scoop was always a 1/d of a stated cup. Every
 * computational item here allows BOTH amounts to be fractions, and the divisor
 * is drawn non-unit wherever the item is E4's own — so "count the bottom
 * numbers" (which answers every D19 draw) answers none of these. The one place
 * the unit-fraction shape still appears is Day 1, on purpose, as the bridge: the
 * library's `fracDivide` and D19's own story warm-up, met once and left behind.
 *
 * Each Level-E ceiling lift is carried by its own item, never doubled up:
 *  - INVERSE-START — `msLinseedHull`: the stated litres are what a PART of the
 *    hull took, so the whole has to be rebuilt from a fraction of itself before
 *    anything can be taken off it, and no sentence asks for that;
 *  - HAS-DISTRACTOR — `msTwineLengths` states the size of the batch the hank
 *    came from, never spends it, and it is the seductive kind of spare number
 *    because the story invites a division by it;
 *  - ESTIMATE-FIRST — `sitTrucklesEstimate`, reachable ONLY through the wrapper
 *    (kit §E2.2), and its probe is a coin flip BY CONSTRUCTION (below);
 *  - REASONABLENESS — `msLinseedHullCheck`, wrapped, because the one check that
 *    catches a flip made the wrong way round is the SIZE of the result.
 *
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. THE RECIPE'S ERROR-ANALYSIS MISCONCEPTION — "inverts the wrong fraction"
 *     — IS NOT DERIVABLE FROM THE VERIFY LIBRARY, and it is not derivable for a
 *     structural reason rather than a missing case. Flipping the dividend
 *     instead of the divisor returns the RECIPROCAL of the true quotient:
 *     (b/a)×(c/d) = 1 ÷ [(a/b)×(d/c)]. Every verify template in the library
 *     varies the OPERATION over a fixed ordered operand pair
 *     (`d_verify_binop_misconception_v1`) or the fraction move over one pair
 *     (`d_verify_frac_v1`, modes tops-bottoms / wrong-op-add / wrong-op-mul /
 *     num-only); none of them swaps the operands' ORDER, which is what this
 *     misconception is. Ten minutes were spent on kit §E2.3's first option (an
 *     algebraic identity making it derivable anyway): forcing the tops-bottoms
 *     output to equal the reciprocal needs (u+v)·uv = (u_d·v_d)², whose
 *     solutions are reverse-engineered coincidences with no referent in a story
 *     — fabrication with extra steps, which the kit names and forbids.
 *     So kit §E2.3's third option is taken, C13's precedent: the misconception
 *     is MOVED to where it can be shown honestly — it is a live card on
 *     `discrimSameAnswer`, written as a real expression a child can evaluate,
 *     and it is the first entry in the mistakeBank — and Day 5 carries a
 *     DERIVABLE complementary slip instead (decision 2). Nothing is faked and
 *     nothing is quietly dropped. Reported as a library gap, not fixed here.
 *
 *  2. THE DAY-5 ERROR-ANALYSIS IS THE COMMON-DENOMINATOR SLIP, and it is E4's
 *     own rather than a re-run of D19's. Both amounts are renamed over one
 *     bottom number — correctly, and that renaming is GIVEN — and the student
 *     then applies the half-remembered headline ("dividing by a fraction turns
 *     into multiplying") to the two counts that renaming produced. It is
 *     derivable exactly: `d_verify_binop_misconception_v1` with op '/' and
 *     wrongOp '*' over the two renamed numerators, so the shown value and the
 *     true count are both recomputed by QG-11. It is also the slip whose SIZE
 *     gives it away, which is the habit the estimate-first item drills — so the
 *     extension asks for that, not for a repetition of the arithmetic.
 *
 *  3. `discrimSizeOfQuotient` DRAWS THE OUTCOME FIRST, AND IT DRAWS THE
 *     OPERATION TOO. The recipe names "÷ by a fraction < 1 makes MORE", and an
 *     item that only ever divides teaches a shortcut instead of the idea: with
 *     division alone, "the top is smaller than the bottom, so it grows" answers
 *     every draw without ever meeting a fraction worth more than one. The item
 *     therefore draws the OUTCOME first, then the OPERATION (× or ÷) in equal
 *     halves, and only then builds an operand on the correct side of one whole
 *     to match. The outcome draw is WEIGHTED rather than uniform, and the
 *     reason is measured — see `OUTCOME_POOL` below, where the number that
 *     forced it is written out. Measured over 1,600 served slots: no card and
 *     no surface strategy above 40.3%, the two half-rules at 59.3% and 62.3%,
 *     the correct rule at 100%. The 'same' outcome is reached by an operand
 *     written n/n; nothing else can produce it, and reading n/n as one whole is
 *     the mathematics rather than a tell.
 *
 *  4. `discrimSameAnswer` CARRIES FOUR CARDS, NOT THREE, and the fourth card is
 *     what makes the set honest. The three natural cards — flip the divisor
 *     (true), flip the dividend, flip neither — leave the no-flip card
 *     strikeable on sight by any child who knows only that SOMETHING gets
 *     flipped, which turns a three-way page into a coin flip at 50%. Adding
 *     "flip both" restores it: all four values are provably distinct (they
 *     coincide only when the two fractions are equal or the divisor is one,
 *     both excluded by the draw), every card carries the same four numerals in
 *     a different arrangement, and no arrangement can be struck without doing
 *     the mathematics. Chance is 25% and every named surface strategy measured
 *     at or below a third.
 *
 *  5. ANSWER-IN-PROMPT AUDIT, one generator at a time, with the bound written
 *     beside the draw that carries it: the canvas holds at least ten panels
 *     while every number printed beside them is at most nine · a mould takes
 *     m·d kilograms while the resin already poured is m·c and c is strictly
 *     less than d · a curd yield of c·m kilograms cannot equal m·d truckles
 *     unless c equals d, which the draw excludes, and cannot equal c or d
 *     because a multiple of d is never coprime to it · the strap count is at
 *     least twelve while every printed number is at most nine · the two
 *     subtraction chains clear their own tokens by a deterministic step, never
 *     a redraw (kit §E2.4). The library generators this week serves were
 *     measured at difficulty 3 over 3,000 draws by the orchestrator's
 *     guessability census before authoring began, and the served slots are
 *     re-measured in the report.
 *
 *  6. `storyFracDivide` IS SERVED AS A WARM-UP AND NOWHERE ELSE. It is D19's
 *     own story generator and belongs in this week only as retrieval; it also
 *     carries just 14 distinct answers over 3,000 draws (top answer 15.6%), so
 *     it is kept off every certifying slot. Its served key table is reported.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5): `GATE_PROFILE.E.pictorialPerDay`
 * is 0, and this week earns no figure on an assessed item — the measuring-out
 * picture IS the count, so drawing it hands over the answer the item asks for.
 * The pictures therefore live in the lesson script and the first three guided
 * examples, where the answer is already on the page; the independent example
 * draws only the amount it was given.
 *
 * Retrieval reaches backwards only, and to four places: D19 for dividing by a
 * unit fraction (the shape this week generalises), D18 for fraction × fraction
 * (what a division becomes), D11 for whole × fraction, and D9 for renaming a
 * fraction to a new bottom number — which is the first move of the
 * common-denominator route. Day 1's warm-ups are ORDERED so the LAST of them is
 * the D9 renaming: `applyRetrievalRamp` moves a pack's final Day-1 warm-up onto
 * Day 5 after every gate has run, and Day 5 already carries the whole ×
 * fraction format, so leaving either multiplication warm-up last would have put
 * two multiplication warm-ups on one served page with nothing able to see it.
 */

import {
  asWarmup,
  fracDivide,
  fracEquivFill,
  fracTimesFrac,
  fracTimesWhole,
  reasoning,
  storyFracDivide,
} from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { drawUniqueItem } from '../lib/guard';
import { withEstimateFirst, withReasonableness } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { formatFrac, reduceFrac } from '../lib/compute';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel, numberLine } from '../lib/figures';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D9 = { level: 'D' as const, week: 9 };
const D11 = { level: 'D' as const, week: 11 };
const D15 = { level: 'D' as const, week: 15 };
const D18 = { level: 'D' as const, week: 18 };
const D19 = { level: 'D' as const, week: 19 };

// ---------------------------------------------------------------------------
// Fraction helpers, local — no rng is consumed by any of them
// ---------------------------------------------------------------------------

const frac = (n: number, d: number) => `${n}/${d}`;

/** The amount written as a quantity: "1 1/4 metres", "5/8 metres". */
const amount = (n: number, d: number, unit: string) => countNoun(formatFrac(reduceFrac(n, d)), unit);

/**
 * A PROPER fraction in lowest terms whose numerator is at least 2 — a genuine
 * NON-unit divisor, which is the whole difference between this week and D19.
 * The pools are enumerated rather than resampled, so exactly one rng draw is
 * consumed for the denominator and one for the numerator (kit §E2.4).
 */
const PROPER_NUMERATORS: Record<number, number[]> = {
  3: [2], 4: [3], 5: [2, 3, 4], 6: [5], 7: [2, 3, 4, 5, 6], 8: [3, 5, 7], 9: [2, 4, 5, 7, 8],
};
function properNonUnit(r: Rng): [number, number] {
  const d = r.pick([3, 4, 5, 6, 7, 8, 9]);
  return [r.pick(PROPER_NUMERATORS[d]), d];
}

/**
 * An IMPROPER fraction in lowest terms, worth between one and two wholes. It
 * exists for one reason: an item that only ever divides by less than one
 * teaches "a fraction makes it grow" instead of the idea, and the estimate
 * probe below would be answerable without reading anything.
 */
const IMPROPER_NUMERATORS: Record<number, number[]> = {
  2: [3], 3: [4, 5], 4: [5, 7], 5: [6, 7, 8, 9],
};
function improper(r: Rng): [number, number] {
  const d = r.pick([2, 3, 4, 5]);
  return [r.pick(IMPROPER_NUMERATORS[d]), d];
}

/** The numeric tokens a rendered amount will print (whole part and fraction parts). */
function tokensOfAmount(n: number, d: number): number[] {
  const f = reduceFrac(n, d);
  if (f.d === 1) return [f.n];
  if (f.n > f.d) return [Math.floor(f.n / f.d), f.n % f.d, f.d];
  return [f.n, f.d];
}

/**
 * The operand pair both bare-computation items draw, with its two degeneracies
 * stepped past DETERMINISTICALLY — no rng draw is consumed by the stepping, so
 * every item after these in the pack is unaffected by whether it fired (kit
 * §E2.4, L19). The two are:
 *
 *  - an EQUAL pair, whose quotient is one. It is the single draw a child can
 *    answer by noticing that the two sides of the page match, and it teaches
 *    nothing this week is for;
 *  - a quotient that prints as one of the four numbers already standing in the
 *    expression (4/5 ÷ 2/5 = 2, with the 2 in plain view). Measured on 1.3% of
 *    served slots before this clause; harmless-looking, and the sort of
 *    coincidence the audit exists to remove rather than to argue about.
 */
function divisionPair(r: Rng): [number, number, number, number] {
  const [n1, d1] = properNonUnit(r);
  let [n2, d2] = properNonUnit(r);
  for (let i = 0; i < 4; i++) {
    const q = formatFrac(reduceFrac(n1 * d2, d1 * n2));
    const degenerate = (n1 === n2 && d1 === d2) || [n1, d1, n2, d2].map(String).includes(q);
    if (!degenerate) break;
    d2 = d2 === 9 ? 3 : d2 + 1;
    const pool = PROPER_NUMERATORS[d2];
    n2 = pool[pool.length - 1];
  }
  return [n1, d1, n2, d2];
}

/**
 * Step `value` up until it clears a set of numbers already printed on the page.
 * DETERMINISTIC and bounded — it consumes no rng draw, so the items after it in
 * the pack are unaffected by whether it fires (kit §E2.4, L19).
 */
function stepClear(value: number, forbidden: (v: number) => boolean, tries = 4): number {
  let v = value;
  for (let i = 0; i < tries && forbidden(v); i++) v += 1;
  return v;
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** D19 — how many unit-fraction scoops fill a stated number of wholes. The
 *  shape this week generalises, met once as the bridge and never assessed. */
const wUnitScoop = asWarmup(storyFracDivide(), D19);
/** D18 — fraction × fraction, which is what a fraction division becomes the
 *  moment the divisor has been turned over. */
const wTimesFrac = asWarmup(fracTimesFrac(), D18);
/** D9 — renaming a fraction to a new bottom number: the first move of the
 *  common-denominator route, a level and a half before it becomes a method. */
const wEquivFill = asWarmup(fracEquivFill(), D9);
/** D11 — whole × fraction, so no chain here stalls on the arithmetic that
 *  follows a flip. */
const wTimesWhole = asWarmup(fracTimesWhole(), D11);

// ---------------------------------------------------------------------------
// Single-step division — both fractions, both meanings
//
// Two meanings are served, and they are not two dresses on one item. "How many
// of these fit in that" counts pieces and is the anchor. "This much fills that
// fraction of a thing, so how much fills the whole thing" recovers a size, and
// it is the meaning a fractional divisor makes available for the first time —
// the one D19 could not reach, because sharing between a fraction of a person
// is not a sentence.
// ---------------------------------------------------------------------------

/**
 * How many panels a length of canvas cuts into. The anchor's own question with
 * a non-unit divisor and a fractional length, which is exactly what D19's
 * scoop-count could not be.
 *
 * No leak by construction, and it is one line: the panel width is under a
 * whole, so the length in metres is strictly less than the number of panels;
 * the length's whole part is therefore below the answer, its fraction parts are
 * below the drawn bottom number, and no drawn number exceeds nine — while the
 * answer is at least ten. The floor is ten rather than nine because the
 * denominator pool reaches nine, and a nine-panel draw beside a ninth printed
 * the answer on 1.3% of served slots before it was measured.
 */
const sitPanelsFromCanvas = situation({
  situationType: 'measurement',
  cognitiveOp: 'frac-divide-count',
  draw: (r) => {
    const [c, d] = properNonUnit(r);
    const panels = r.int(10, 22);           // ≥ 10, and every printed number ≤ 9
    return {
      prompt: `A sailmaker has a length of canvas measuring ${amount(panels * c, d, 'metres')}. It is cut across into panels ${frac(c, d)} of a metre wide, with nothing left over. How many panels does the length make?`,
      answerValue: String(panels),
      templateId: 'd_frac_div_v1',
      params: { n1: panels * c, d1: d, n2: c, d2: d },
      units: 'panels',
      hints: [
        'Is the question asking how big one panel is, or how many of that one panel the whole length holds?',
        'Work out how many panel widths sit inside a single metre first, then carry that count along the whole length.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The size-recovering meaning: a stated amount fills a stated FRACTION of a
 * mould, so a whole mould takes more than the amount stated. This is the item
 * that makes "dividing can make it bigger" a fact about quantities rather than
 * a fact about symbols.
 *
 * No leak by construction: the resin already poured is c·m kilograms and the
 * answer is d·m, and c is strictly less than d, so the answer is always the
 * larger; and the answer exceeds both drawn numbers because m is at least
 * three.
 */
const sitResinPerMould = situation({
  situationType: 'rate',
  cognitiveOp: 'frac-divide-per-whole',
  draw: (r) => {
    const [c, d] = properNonUnit(r);
    const m = r.int(3, 7);
    return {
      prompt: `A boatyard pours ${countNoun(c * m, 'kg')} of resin into a mould and that fills ${frac(c, d)} of it. How many kilograms of resin does the whole mould take?`,
      answerValue: String(d * m),
      templateId: 'd_frac_div_v1',
      params: { n1: c * m, d1: 1, n2: c, d2: d },
      units: 'kg',
      hints: [
        'Does the amount already poured describe the whole mould, or only a named part of it?',
        'Find what one part of that size takes, then build the whole mould out of parts of that size.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * The estimate-first carrier, and THE PROBE IS A COIN FLIP BY CONSTRUCTION
 * rather than by hope (kit §E2.9a). The truckle weight is drawn on one side of
 * one whole or the other with equal probability, so whether the count comes out
 * above or below the weight of curd is decided by a fair draw and nothing about
 * the page leans. It is also the reason this generator exists beside the panel
 * count: an item whose divisor is always under one would let a child answer the
 * probe correctly for ever by noticing that it is a fraction.
 *
 * No leak by construction: the curd drawn is c·m kilograms and the count is
 * d·m, equal only if c equals d, which no draw produces; and the count is a
 * multiple of d, so it can never equal a numerator coprime to d.
 */
const sitTruckles = situation({
  situationType: 'sharing',
  cognitiveOp: 'frac-divide-count-either-side',
  draw: (r) => {
    const heavier = r.chance(0.5);
    const [c, d] = heavier ? improper(r) : properNonUnit(r);
    const m = r.int(4, 9);
    return {
      prompt: `A cheesemaker draws ${countNoun(c * m, 'kg')} of curd from the vat and presses all of it into truckles weighing ${amount(c, d, 'kg')} each. How many truckles is that?`,
      answerValue: String(d * m),
      templateId: 'd_frac_div_v1',
      params: { n1: c * m, d1: 1, n2: c, d2: d },
      units: 'truckles',
      hints: [
        'Is one truckle heavier or lighter than a single kilogram, and what does that settle before any working?',
        'Count how many truckles a single kilogram of curd would make, then carry that count across all the curd drawn.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const sitTrucklesEstimate = withEstimateFirst(
  sitTruckles,
  'will the truckles come out fewer in number than the kilograms of curd, or more?',
);

/**
 * The bare computation, both fractions general. The library's `fracDivide`
 * covers `k ÷ 1/d` and `1/d ÷ k` and nothing else, so the E4 form — a fraction
 * divided by a fraction, neither of them a unit — has no generator anywhere in
 * the corpus and is built here. Its operand pair comes from `divisionPair`,
 * which owns both of the draw's degeneracies.
 */
const divideGeneralPair: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const [n1, d1, n2, d2] = divisionPair(r);
    const result = reduceFrac(n1 * d2, d1 * n2);
    return {
      type: 'computation' as const,
      prompt: `${frac(n1, d1)} ÷ ${frac(n2, d2)} = ?`,
      answer: { value: formatFrac(result), acceptableForms: [frac(n1 * d2, d1 * n2)], validation: 'equivalent-fraction' as const },
      difficulty,
      strand: 'computational' as const,
      isRetrieval: false,
      generator: { templateId: 'd_frac_div_v1', params: { n1, d1, n2, d2 }, seed: r.uint() },
      hintLadder: [
        'Which of these two amounts is doing the measuring, and which one is being measured?',
        'Turn the measuring amount over, then take that many of the amount being measured.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  });

// ---------------------------------------------------------------------------
// Multi-step: three shapes, so "two steps" never becomes one template
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S HEADLINE CHAIN (§6 row E4, "scoops in one whole → in k wholes").
 * The whole here is one roll, not one metre, which is the E-level version of
 * it: the count per roll is itself a fraction division, so the first step is
 * the week's own move and the second scales it.
 *
 * No leak by construction: the strap count is at least twelve (four straps per
 * roll, three rolls), while the roll length is strictly under eleven metres,
 * its fraction parts are under nine, and the strap length and roll count are at
 * most nine and seven.
 */
const msStrapsFromWebbing = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'frac-divide-then-scale',
  draw: (r) => {
    const [c, d] = properNonUnit(r);
    const perRoll = r.int(4, 11);
    const rolls = r.int(3, 7);
    return {
      prompt: `A mill winds webbing onto rolls of ${amount(perRoll * c, d, 'metres')}. Every strap is cut ${frac(c, d)} of a metre long. How many straps can be cut from ${countNoun(rolls, 'rolls')}?`,
      initN: perRoll * c,
      initD: d,
      steps: [
        { op: 'div', n: c, d },
        { op: 'mul', n: rolls, d: 1 },
      ],
      units: 'straps',
      hints: [
        'Would you count the straps in a single roll first, or try to picture every roll at once?',
        'Measure one roll out in strap lengths, then carry that count across all the rolls.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3, the Level-E lift). Everything the
 * story states belongs to a PART of the hull; the amount the whole hull takes
 * is the quantity it never mentions. So the first move rebuilds the whole from
 * a fraction of itself — a division by a fraction under one, which makes the
 * amount grow — and only then can what is already brushed on be taken off.
 *
 * Served through the reasonableness wrapper, because the check that catches a
 * flip made the wrong way round is not the arithmetic but the SIZE: turning the
 * wrong fraction over would leave the rest of a hull needing less oil than a
 * part of it already took.
 *
 * No leak by construction: the answer is m·(d−c) and the oil already brushed on
 * is m·c, which coincide only when d = 2c — impossible for a fraction in lowest
 * terms with a numerator of at least two. The remaining coincidences (with the
 * two drawn numbers) are stepped past deterministically, never redrawn.
 */
const msLinseedHull = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'frac-divide-recover-whole',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const [c, d] = properNonUnit(r);
    const m0 = r.int(5, 11);
    const m = stepClear(m0, (v) => v * (d - c) === c || v * (d - c) === d);
    return {
      prompt: `A boatbuilder brushed ${countNoun(c * m, 'litres')} of linseed oil over ${frac(c, d)} of a hull, and the rest of the hull will take oil at the same rate. How many more litres will the rest of the hull take?`,
      initN: c * m,
      steps: [
        { op: 'div', n: c, d },
        { op: 'sub', n: c * m, d: 1 },
      ],
      units: 'litres',
      hints: [
        'Does the stated amount of oil describe the whole hull, or the part the fraction names?',
        'Rebuild the whole hull from the part that was named, then set aside the oil already brushed on.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const msLinseedHullCheck = withReasonableness(
  msLinseedHull,
  'hold your answer beside the oil already brushed on and say whether a share that size can be right.',
);

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3). The size of the batch the hank
 * came from is stated, is never used, and is exactly the number the sentence
 * invites a child to divide by — the same reflex that divides an amount by a
 * bottom number because it is standing there.
 *
 * No leak by construction: the answer is stepped clear of every number the
 * prompt prints, deterministically and without a redraw.
 */
const msTwineLengths = multiStep({
  situationType: 'combine',
  cognitiveOp: 'frac-divide-then-spend',
  posing: 'has-distractor',
  draw: (r) => {
    const [c, d] = properNonUnit(r);
    const pieces = r.int(12, 22);
    const batch = r.int(16, 20);
    const used0 = r.int(3, 6);
    // The count LEFT must clear every number the page prints — INCLUDING the
    // count used, which is printed and which the answer equals whenever exactly
    // half the lengths were spent. Measured at 10.3% of served slots before that
    // clause existed, and at 0.1% while the clearing was a bounded step: four
    // steps is not always enough when the printed set is dense. So the legal
    // values are enumerated and the first at or above the drawn one is taken —
    // deterministic, exhaustive, and it consumes no rng draw (kit §E2.4).
    const printed = new Set<number>([...tokensOfAmount(pieces * c, d), c, d, batch]);
    const legal: number[] = [];
    for (let v = 3; v <= 9 && v <= pieces - 3; v++) {
      if (!printed.has(pieces - v) && pieces - v !== v) legal.push(v);
    }
    const used = legal.find((v) => v >= used0) ?? legal[0] ?? used0;
    return {
      prompt: `A cabinetmaker's hank of twine measures ${amount(pieces * c, d, 'metres')} and is cut into lengths of ${frac(c, d)} of a metre. ${countNoun(used, 'of those lengths')} are used to bind a frame. The hank came from a batch of ${countNoun(batch, 'hanks')}. How many of the cut lengths are left?`,
      initN: pieces * c,
      initD: d,
      steps: [
        { op: 'div', n: c, d },
        { op: 'sub', n: used, d: 1 },
      ],
      units: 'lengths',
      hints: [
        'Which numbers here belong to the twine being cut, and which one describes where the hank came from?',
        'Measure the hank out in cut lengths first, then take away only the ones that were bound onto the frame.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the two decisions this week turns on
//
// One is about the SIZE of the answer before any working (the recipe's own),
// and one is about which multiplication a division becomes. Neither can be
// answered by the other's habit: the first never asks for a value, and the
// second never asks whether the value grew.
// ---------------------------------------------------------------------------

type Outcome = 'more' | 'less' | 'same';
const OUTCOMES: readonly Outcome[] = ['more', 'less', 'same'];
/**
 * The outcome pool, and it is WEIGHTED — measured, not chosen.
 *
 * Drawn in equal thirds, every card sat at a third and every surface strategy
 * sat at a third, which is what the bar asks for. But the two HALF-rules — "a
 * fraction under one makes it more" (true of division, false of multiplication)
 * and its mirror — then scored 70.1% and 66.4% over 800 served slots, because
 * the 'same' draw is a free point for both of them: every rule agrees that an
 * operand worth exactly one whole leaves the amount where it was, and a third
 * of the page was being handed to a child who had learned half the content.
 *
 * Rationing 'same' to a fifth is the only lever there is — nothing but n/n can
 * produce that outcome — and it takes the half-rules to 60%: a fifth of a free
 * point plus half of the rest. The card is still keyed on a fifth of draws, so
 * it is nowhere near the L38 line, and the two live outcomes stay level with
 * each other at two fifths apiece.
 */
const OUTCOME_POOL: readonly Outcome[] = ['more', 'more', 'less', 'less', 'same'];

/**
 * The card a child reaches for when they carry ONE half-rule instead of the
 * pair. Written per (operation, card) so the rationale describes this draw and
 * not a generic slip.
 */
function sizeRationale(op: '×' | '÷', card: Outcome): { tag: ErrorTag; text: string } {
  if (card === 'same') {
    return {
      tag: 'representation-misread',
      text: 'Reads any fraction as a near-enough whole, so an operation by one is expected whatever the fraction is really worth. Only a fraction worth exactly one whole leaves an amount where it was.',
    };
  }
  if (op === '÷') {
    return card === 'less'
      ? {
        tag: 'concept-misconception',
        text: 'Carries "dividing makes it smaller" from whole numbers, where it is always true because the divisor is always at least one. A divisor worth less than one whole measures the amount in pieces smaller than itself, and there are more of them.',
      }
      : {
        tag: 'procedure-slip',
        text: 'Applies this week\'s headline the moment a division appears, without reading the divisor against one whole. It grows the amount only while the divisor is worth less than one.',
      };
  }
  return card === 'more'
    ? {
      tag: 'concept-misconception',
      text: 'Carries "multiplying makes it bigger" from whole numbers, where it is always true because the multiplier is always at least one. Taking a part of an amount cannot leave more than the amount.',
    }
    : {
      tag: 'procedure-slip',
      text: 'Applies "a fraction makes it smaller" to a fraction that is worth more than one whole, so the reading stops at the shape of the number rather than its size.',
    };
}

/**
 * THE RECIPE'S DISCRIMINATION (§6 row E4). The outcome is drawn first, in equal
 * thirds; the operation is drawn second, in equal halves; the operand is then
 * built on whichever side of one whole makes that outcome true. So the page
 * carries no rank to exploit and no card that is offered more often than it is
 * keyed, and the one reading that answers it — the operation held against the
 * operand's size — is the reading the week exists to teach.
 */
const discrimSizeOfQuotient = discrimination({
  variant: 'structural',
  cognitiveOp: 'frac-size-of-result',
  draw: (r) => {
    const truth = r.pick(OUTCOME_POOL);
    const op: '×' | '÷' = r.chance(0.5) ? '÷' : '×';
    const amountValue = r.int(6, 40);
    // more: ÷ by less than one, or × by more than one. less: the mirror.
    // same: an operand worth exactly one whole, which only n/n can be.
    let n: number;
    let d: number;
    if (truth === 'same') {
      d = r.int(2, 9);
      n = d;
    } else if ((truth === 'more') === (op === '÷')) {
      [n, d] = properNonUnit(r);
    } else {
      [n, d] = improper(r);
    }
    const label: Record<Outcome, string> = {
      more: `more than ${amountValue}`,
      less: `less than ${amountValue}`,
      same: `the same as ${amountValue}`,
    };
    return {
      prompt: `Without working it out: is ${amountValue} ${op} ${frac(n, d)} more than ${amountValue}, less than ${amountValue}, or the same as ${amountValue}?`,
      correct: label[truth],
      distractors: OUTCOMES.filter((o) => o !== truth).map((o) => ({
        text: label[o],
        errorTag: sizeRationale(op, o).tag,
        rationale: sizeRationale(op, o).text,
      })),
      hints: [
        'Is the second number here worth more than one whole, less than one whole, or exactly one?',
        'Decide what the operation does to an amount when it meets a number on that side of one, and read the size off that.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
    };
  },
});

/**
 * WHICH MULTIPLICATION A DIVISION BECOMES — and the home of the recipe's own
 * error-analysis misconception, which the verify library cannot express
 * (decision 1). Every card is an honest expression built from the same four
 * numbers, so nothing is fabricated and nothing can be struck out on sight:
 *
 *  - turn the divisor over (the truth);
 *  - turn the DIVIDEND over, which is the recipe's slip, and returns the
 *    reciprocal of the true answer;
 *  - turn neither over, which multiplies by the divisor as it stands;
 *  - turn both over.
 *
 * All four values are distinct on every draw. Two of them coincide only if the
 * two fractions are equal or the divisor is worth exactly one, and the draw
 * produces neither: both fractions are proper and in lowest terms, and an equal
 * pair is stepped past.
 */
const discrimSameAnswer = discrimination({
  variant: 'structural',
  cognitiveOp: 'frac-divide-which-flip',
  draw: (r) => {
    const [a, b] = properNonUnit(r);
    let [c, d] = properNonUnit(r);
    if (a === c && b === d) {
      d = d === 9 ? 3 : d + 1;
      const pool = PROPER_NUMERATORS[d];
      c = pool[pool.length - 1];
    }
    return {
      prompt: `Which of these has the same answer as ${frac(a, b)} ÷ ${frac(c, d)}?`,
      correct: `${frac(a, b)} × ${frac(d, c)}`,
      distractors: [
        {
          text: `${frac(b, a)} × ${frac(c, d)}`,
          errorTag: 'procedure-slip',
          rationale: 'Turns over the amount being measured rather than the amount doing the measuring, which lands on the answer upside down — the count of wholes in one piece, not of pieces in the wholes.',
        },
        {
          text: `${frac(a, b)} × ${frac(c, d)}`,
          errorTag: 'concept-misconception',
          rationale: 'Keeps the divisor exactly as it stands and multiplies by it, which takes a PART of the amount when the question asked how many of that part fit inside it.',
        },
        {
          text: `${frac(b, a)} × ${frac(d, c)}`,
          errorTag: 'representation-misread',
          rationale: 'Turns both fractions over on the grounds that a division is being undone, so two moves are made where the method makes one.',
        },
      ],
      hints: [
        'Which of the two fractions is doing the measuring in this division?',
        'Say the division out loud as a question about how many fit, then keep the expression that asks the same question.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand, and the R-lite split
// ---------------------------------------------------------------------------

/**
 * THE ERROR-ANALYSIS (decision 2). The renaming is GIVEN and correct — both
 * lengths are counted in the same size of piece — so the analysis is not about
 * arithmetic but about what the two counts on that line are. The shown value is
 * the genuine output of `d_verify_binop_misconception_v1` under wrongOp '*',
 * and the true count is that template's own division, so QG-11 recomputes both.
 *
 * The true count is picked from the candidates that no number on the page
 * already prints, and the pool is built before the pick, so the choice consumes
 * exactly one draw whatever the earlier draws were.
 */
const eaCountedInPieces = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'frac-divide-common-denominator',
  drawParams: (r) => {
    const m = r.pick([8, 9, 10, 12]);
    const q = r.pick([2, 3, 4, 5]);
    const candidates = [3, 4, 5, 6, 7, 8].filter((t) => {
      const p = q * t;
      if (p > 3 * m) return false;                    // the rod stays under three metres
      const printed = new Set<number>([p, q, m, p * q, ...tokensOfAmount(p, m), ...tokensOfAmount(q, m)]);
      return !printed.has(t);
    });
    const t = r.pick(candidates.length ? candidates : [3]);
    return { a: q * t, b: q, op: '/', wrongOp: '*', m };
  },
  build: (v, p) => {
    const a = Number(p.a);
    const b = Number(p.b);
    const m = Number(p.m);
    return {
      prompt: `A jeweller's rod of solder measures ${amount(a, m, 'metres')} and every joint takes ${formatFrac(reduceFrac(b, m))} of a metre. A student wrote: "Both lengths are counted in ${m}ths — the rod is ${a} of them and a joint is ${b} of them — and dividing by a fraction turns into multiplying, so the rod makes ${a} × ${b} = ${v.wrong} joints."`,
      extension: 'Name what the two numbers in that multiplication are counting, write the number of joints the rod really makes, and finish with one sentence on how the size of the written answer could have been settled before any of the working.',
      hints: [
        'Once both lengths are counted in pieces of one size, what question is left to answer about the two counts?',
        'Picture the joints laid end to end along the rod, and ask how many of them the rod could possibly hold.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: ['how many fit', 'divide the counts'],
    };
  },
});

/**
 * THE R-LITE COMPUTABLE CORE (FILL-ARCHITECTURE §7). One division, both routes,
 * one answer — and the answer is code-computed by the registered division
 * template, so the instance of the equivalence is CHECKED rather than asserted.
 * The general argument is the next item, and it is flagged.
 */
const twoRoutesOneAnswer: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const [n1, d1, n2, d2] = divisionPair(r);
    const result = reduceFrac(n1 * d2, d1 * n2);
    return {
      type: 'computation' as const,
      prompt: `Work out ${frac(n1, d1)} ÷ ${frac(n2, d2)} along both routes. Route one: rename both fractions so they are counted in pieces of one size, then work out how many of the second count fit into the first. Route two: multiply the first fraction by the second one turned over. Write the single answer both routes reach.`,
      answer: { value: formatFrac(result), acceptableForms: [frac(n1 * d2, d1 * n2)], validation: 'equivalent-fraction' as const },
      difficulty,
      strand: 'computational' as const,
      isRetrieval: false,
      generator: { templateId: 'd_frac_div_v1', params: { n1, d1, n2, d2 }, seed: r.uint() },
      hintLadder: [
        'Before one amount can be counted off against another, what do the two of them have to share?',
        'Give both fractions the same bottom number for the first route, and take the second fraction upside down for the second.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  });

/**
 * THE R-LITE FLAGGED PART (FILL-ARCHITECTURE §7, and the CURRICULUM-MAP Day-5
 * focus for this cell: "Why does invert-and-multiply work? — explain with a
 * model"). The worked instance in the prompt is fixed and checkable by hand
 * (5/6 is 10 twelfths, and 10 twelfths measured in 5-twelfth pieces is 2; 5/6
 * multiplied by 12/5 is 60/30, which is 2). What is ASKED for is the general
 * argument, and no code can mark that — so the item ships as `manual-review`
 * exactly per the D-established convention, and the week does not pretend
 * otherwise anywhere in the report.
 */
const whyTurningOverWorks = reasoning({
  prompt:
    'Here is one division worked both ways. 5/6 ÷ 5/12: counted in twelfths it is 10 twelfths measured out in 5-twelfth pieces, which is 2 pieces. Turned over and multiplied it is 5/6 × 12/5, which is 60/30, and that is 2 as well. Now argue the general case in writing. Explain why giving two fractions the same bottom number always turns the division into a division of the two top numbers, and then why multiplying by the second fraction turned over must land on that same answer for ANY pair of fractions. Say what the bottom number of the turned-over fraction counts and what its top number does.',
  value:
    'both routes give 2; naming both amounts in pieces of one size makes them two counts of the same piece, so the question becomes how many of one count fit in the other and the bottom numbers cancel; turning the divisor over does those same two moves at once — its bottom number says how many pieces fit in one whole, and its top number gathers those pieces into groups of the size being measured with',
  keywords: false,
  hints: [
    'What changes about two fractions when they are renamed to the same bottom number, and what stays exactly as it was?',
    'Take the two routes one line at a time on the worked case, and say which line of one matches which line of the other.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE04 = makeWeekBuilder({
  level: 'E',
  week: 4,
  conceptId: 'dividing-fractions',
  conceptName: 'Dividing fractions',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D9, D18, D19],
  pedagogyContract: 'v2',
  conceptualAnchor: 'how many of one amount fit inside another',
  conceptFamily: 'operation',
  deepeningDelta:
    'D19 divided a whole number by a UNIT fraction and a unit fraction by a whole, and the scoop was always one part of a stated cup, so every answer could be reached by counting bottom numbers. E4 lifts both restrictions at once: either amount may be a fraction, and the divisor is drawn with a top number of its own, which is what turns a rule about scoops into a question about measuring. That is also what makes the size of the answer a decision rather than a certainty — D19 could tell a child that dividing by a fraction always gives more, and this week cannot, because a divisor worth more than one whole gives less. And it adds the second method D19 had no use for: renaming both amounts over one bottom number, which is the honest reason the flip works at all.',
  explanation: {
    hook:
      'Ask how many quarter-metre pieces a two-metre bar makes and nobody hesitates: eight. Ask how many two-thirds of a metre it makes and the same question suddenly looks like a different one. It is not. It is the only question division has ever asked.',
    whyBeforeHow:
      'Dividing has two readings, and only one of them survives a fractional divisor. The sharing reading — split this between that many — needs a whole number of shares, because there is no such thing as sharing something between two-thirds of a person. The measuring reading asks how many of one amount fit inside another, and it does not care in the slightest whether either amount is a whole. That is why every item this week is a measuring question, and why the size of the answer stops being a rule to remember: if the amount you measure with is smaller than one whole, more of them fit than there were wholes, so the count comes out larger; if it is larger than one whole, fewer fit, so the count comes out smaller. Nothing is being made bigger or smaller — you are counting a different-sized piece. And the measuring reading is also what explains the flip. Rename both amounts so they are counted in pieces of the same size, and the two fractions become two plain counts of that piece; the question is then how many of one count fit in the other, which is a whole-number division, and the bottom numbers have done their work and gone. Turning the second fraction over does exactly those two moves in one: its bottom number says how many pieces fit in a single whole, and its top number gathers those pieces into groups of the size you are measuring with. Estimate the size of the answer before any of it, because a flip made the wrong way round gives a result that is not slightly wrong but upside down.',
    script: [
      {
        say: 'Watch me measure rather than share. I have four metres of cord and I want to know how many two-third-metre lengths it makes. I do not share four between two-thirds — that sentence means nothing. I lay a two-third-metre length against the cord, then another, then another, and I count how many I laid. Each metre takes one and a half of them, so four metres take six. The answer is six, and I never used a rule to get it.',
        visual: 'Four metres marked in thirds, with six two-third lengths laid end to end along it.',
        figure: numberLine(
          {
            min: 0,
            max: 4,
            step: 1,
            partition: 3,
            labels: 'majors',
            hops: [
              { from: 0, to: 2 / 3 },
              { from: 2 / 3, to: 4 / 3 },
              { from: 4 / 3, to: 2 },
              { from: 2, to: 8 / 3 },
              { from: 8 / 3, to: 10 / 3 },
              { from: 10 / 3, to: 4 },
            ],
          },
          { alt: 'a line from 0 to 4 divided into thirds, with six equal hops of two thirds laid end to end along it' },
        ),
      },
      {
        say: 'Now the same picture told in one size of piece, because that is where the rule comes from. Four metres is twelve thirds. Each length I laid down is two thirds. So the whole question is: how many 2s fit in 12? Six. Once both amounts are counted in the same size of piece, the pieces stop mattering and I am dividing two ordinary counts. That is not a trick. That is what a common bottom number is for.',
        visual: 'The same four metres drawn as twelve thirds, grouped into six pairs.',
        figure: barModel(
          [
            {
              label: 'four metres, counted in thirds',
              segments: [
                { value: 2, label: '2' }, { value: 2, label: '2' }, { value: 2, label: '2' },
                { value: 2, label: '2' }, { value: 2, label: '2' }, { value: 2, label: '2' },
              ],
              total: '12',
            },
          ],
          { scaleMax: 12, alt: 'a bar of twelve thirds split into six equal groups of two thirds' },
        ),
      },
      {
        say: 'Here is the part worth carrying. Measuring with a piece smaller than one whole gives more pieces than there were wholes — six lengths out of four metres. Measuring with something larger than a whole gives fewer. Watch: the same four metres cut into lengths of one and a half metres. Each length swallows a metre and half of the next, so I get fewer lengths than metres. Two and two thirds of them, in fact. The operation did not change. The size of the thing I measured with did.',
        visual: 'Four metres measured out in one-and-a-half-metre lengths, ending part way through the third.',
        figure: barModel(
          [
            { label: 'four metres, measured in metre-and-a-half lengths', segments: [{ value: 3, label: '1 1/2' }, { value: 3, label: '1 1/2' }, { value: 2, label: 'part of a third', fill: 'hatch' }], total: '4 m' },
          ],
          { scaleMax: 8, alt: 'a bar of four metres split into two full lengths of one and a half metres and a shorter hatched remainder' },
        ),
      },
      {
        say: 'Two habits, and they take longer to describe than to do. Before I work anything out I estimate which side of the starting amount the answer has to land, by asking whether the amount I am measuring with is worth more than one whole or less. And after I have an answer I check it against that call. This matters more here than anywhere else in the year, because turning the wrong fraction over does not give a slightly wrong answer. It gives the answer upside down, and the size is the only thing on the page that says so.',
        visual: 'Two rough brackets: a divisor under one whole pointing above the starting amount, a divisor over one whole pointing below it.',
        figure: barModel(
          [
            { label: 'measured with a piece smaller than one whole', segments: [{ value: 6, label: 'more pieces' }] },
            { label: 'the amount you started with', segments: [{ value: 4, label: '4' }] },
            { label: 'measured with a piece larger than one whole', segments: [{ value: 3, label: 'fewer pieces' }] },
          ],
          { scaleMax: 6, alt: 'three bars to one scale: a long bar for measuring with a small piece, a middle bar for the starting amount, a short bar for measuring with a large piece' },
        ),
      },
    ],
    summary:
      'Dividing asks how many of one amount fit inside another, and that question does not need either amount to be whole. Because of it the answer\'s size is decided by one reading: measure with something worth less than one whole and the count comes out larger than the amount, measure with something worth more than one whole and it comes out smaller, and only a divisor worth exactly one leaves the amount where it was. Two routes get the count. Rename both amounts over one bottom number and divide the two top numbers; or multiply the first amount by the second one turned over, which does the same two moves at once. Estimate the size first: a fraction turned over the wrong way gives an answer that is upside down, and nothing but its size will tell you.',
    vocabulary: [
      { term: 'reciprocal', kidGloss: 'the fraction you get by turning one over — the amount that multiplies with it to make exactly one whole' },
      { term: 'dividend and divisor', kidGloss: 'the amount being measured, and the amount you are measuring it with' },
      { term: 'common denominator', kidGloss: 'one bottom number given to both fractions, so the two amounts are counts of the same size of piece' },
      { term: 'measuring division', kidGloss: 'the reading of division that asks how many of one amount fit inside another' },
      { term: 'unit fraction', kidGloss: 'a fraction with one on top, like 1/5 — one single piece of a whole cut into equal parts' },
    ],
  },
  guidedExamples: [
    {
      ...ge(4, 1, 'modeled', 'How many 2/3-metre lengths can be cut from a 4-metre cord?', [
        {
          teacherSay:
            'Let me settle which question this is before I touch a number. Nobody is sharing this cord between two-thirds of anything — that would not mean anything. I am measuring it: laying a two-third-metre length against the cord over and over and counting how many times it goes.',
        },
        {
          teacherSay:
            'I settle where the answer has to land before I count anything. The length I am measuring with is shorter than a metre, so more of them fit than there are metres — any count of four or under is already wrong. Now the counting: one metre takes one and a half of these lengths, so what do four metres take?',
          expected: '6',
        },
        {
          childDo: 'Put that count beside the call I made before counting, and say whether the two agree.',
          expected: '6',
        },
      ], '6'),
      visual: 'The four metres marked in thirds, with the two-third lengths laid along them.',
      figure: numberLine(
        {
          min: 0,
          max: 4,
          step: 1,
          partition: 3,
          labels: 'majors',
          hops: [
            { from: 0, to: 2 / 3 },
            { from: 2 / 3, to: 4 / 3 },
            { from: 4 / 3, to: 2 },
            { from: 2, to: 8 / 3 },
            { from: 8 / 3, to: 10 / 3 },
            { from: 10 / 3, to: 4 },
          ],
        },
        { alt: 'a line from 0 to 4 divided into thirds, with six equal hops of two thirds laid along it' },
      ),
    },
    {
      ...ge(4, 2, 'completion', 'A walker covers 1 1/2 kilometres in 3/5 of an hour at a steady pace. How far does the walker cover in a whole hour?', [
        {
          teacherSay: 'What does the stated distance belong to — the whole hour, or the part of it the fraction names?',
          expected: 'the part the fraction names',
        },
        {
          childDo: 'Work out what one fifth of an hour covers, then build the whole hour out of fifths.',
          expected: '2 1/2',
        },
      ], '2 1/2'),
      visual: 'Three fifths of an hour drawn against the whole hour it is part of.',
      figure: barModel(
        [
          { label: 'the part of the hour already walked', segments: [{ value: 3, label: '1 1/2 km' }] },
          { label: 'a whole hour', segments: [{ value: 3, label: '1 1/2 km' }, { value: 2, fill: 'none' }], total: '5 fifths' },
        ],
        { scaleMax: 5, alt: 'a bar of three fifths for the distance already walked beside a bar of five fifths for the whole hour, its last two fifths left empty' },
      ),
    },
    ge(4, 3, 'prompted', 'Work out 5/8 ÷ 5/6.', [
      {
        childDo: 'Name which fraction is doing the measuring, take it turned over, and multiply.',
        expected: '3/4',
      },
    ], '3/4'),
    {
      // Independent stage: the givens only. Deciding that the roll must be
      // measured out in strap lengths BEFORE anything is scaled is the task
      // here, so drawing the straps along the roll would hand over the plan the
      // item exists to ask for (L33).
      ...ge(4, 4, 'independent', 'A roll of webbing is 7 1/2 metres long and straps are cut 5/6 of a metre long. A workshop has four such rolls. How many straps can be cut altogether? Solve cold.', [
        { childDo: 'Settle how many straps a single roll gives before you look at the four.', expected: '36' },
      ], '36'),
      visual: 'One roll drawn at its stated length. The straps along it are not drawn.',
      figure: barModel(
        [
          { label: 'one roll of webbing', segments: [{ value: 15, label: '7 1/2 m' }] },
        ],
        { scaleMax: 15, alt: 'a single bar for one roll of webbing at seven and a half metres; the straps are not drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the measuring question, single-step only. The two
    // unit-fraction items are the bridge from D19 and are the last of them in
    // the week; everything after this point carries a divisor with a top number
    // of its own. No chain, no choice and no trap yet.
    //
    // The warm-ups are ORDERED so the LAST is the D9 renaming: the retrieval
    // ramp moves a pack's final Day-1 warm-up onto Day 5 after every gate has
    // run, and Day 5 already carries a whole × fraction warm-up.
    [
      { gen: wUnitScoop, diff: 2 },
      { gen: wTimesFrac, diff: 2 },
      { gen: wEquivFill, diff: 2 },
      { gen: fracDivide(), diff: 3 },
      { gen: divideGeneralPair, diff: 3 },
      { gen: sitPanelsFromCanvas, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first count whose divisor can
    // sit either side of one, the recipe's own discrimination, the
    // size-recovering meaning, and the week's first chain.
    [
      { gen: wTimesWhole, diff: 2 },
      { gen: wUnitScoop, diff: 2 },
      { gen: sitTrucklesEstimate, diff: 3 },
      { gen: discrimSizeOfQuotient, diff: 3 },
      { gen: sitResinPerMould, diff: 3 },
      { gen: msStrapsFromWebbing, diff: 4 },
    ],
    // Day 3 — interleave: both discriminations against bare computation, a
    // counting story and an inverse-start chain, so nothing on the page signals
    // which kind of work is coming next.
    [
      { gen: wTimesFrac, diff: 2 },
      { gen: discrimSameAnswer, diff: 3 },
      { gen: divideGeneralPair, diff: 3 },
      { gen: sitPanelsFromCanvas, diff: 3 },
      { gen: discrimSizeOfQuotient, diff: 4 },
      { gen: msLinseedHullCheck, diff: 4 },
    ],
    // Day 4 — word problems. Three chains sit here and no two are posed alike:
    // one measures then scales, one has to rebuild a whole before it can
    // subtract, one states a number it never spends. Two single-step items sit
    // among them so the length of a prompt predicts nothing.
    [
      { gen: msStrapsFromWebbing, diff: 5 },
      { gen: msLinseedHullCheck, diff: 5 },
      { gen: msTwineLengths, diff: 4 },
      { gen: sitTrucklesEstimate, diff: 4 },
      { gen: sitResinPerMould, diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the renamed counts, the two routes
    // reaching one answer (the computable core), and the argument that they
    // must always agree (the flagged part) (+ a ramped warm-up).
    [
      { gen: wTimesWhole, diff: 2 },
      { gen: eaCountedInPieces, diff: 4 },
      { gen: twoRoutesOneAnswer, diff: 3 },
      { gen: whyTurningOverWorks, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: what goes wrong this week rarely looks like a wrong answer. It looks like an upside-down one — 8 where the answer was 1/8, or 2/9 where it was 4 1/2. It happens when the wrong fraction gets turned over, and the arithmetic that follows is usually perfect, so nothing in the working looks wrong. Pointing at the flip is the one thing that does not help, because they can already do the flip. Ask instead whether the amount they were measuring with was worth more than a whole or less, and where that puts the answer next to the amount they started with. Size settles it in a sentence.',
  ],
  puzzle: (r) => {
    // THE WEEK'S MOVE RUN BACKWARDS: instead of being handed a piece size and
    // asked for a count, the solver is handed the COUNT and has to name the
    // piece. Two counts are asked for rather than one, so the last sentence has
    // something to generalise from — and both piece lengths come out fractional,
    // which is the point: a fixed length cut into more pieces makes each piece
    // smaller, the same relationship the week meets from the other side.
    const total = r.pick([6, 8, 9, 10, 12]);
    // BOTH piece lengths must come out fractional. A count that divides the
    // length exactly gives a whole-number piece, and a puzzle about dividing
    // fractions whose answer is "1 metre" has quietly removed its own concept —
    // seed 907 served exactly that before the pools were filtered. The pools are
    // built before the picks, so this costs no extra draw.
    const fewPool = [4, 5, 6, 7].filter((v) => total % v !== 0);
    const few = r.pick(fewPool);
    const manyPool = [few + 2, few + 3, few + 4, few + 5].filter((v) => total % v !== 0);
    const many = r.pick(manyPool);
    const first = formatFrac(reduceFrac(total, few));
    const second = formatFrac(reduceFrac(total, many));
    return {
      id: 'E4-PZ-01',
      title: 'Puzzle Grove: The Cutting List',
      puzzleType: 'construction',
      prompt: `A shopfitter has a length of oak beading measuring ${countNoun(total, 'metres')}. It has to be cut into pieces that are all the same length, with nothing left over. One order needs exactly ${countNoun(few, 'pieces')}; a second order needs exactly ${countNoun(many, 'pieces')}. Write the length of one piece for the first order, then the length of one piece for the second. Finish with one sentence saying what happens to the length of a piece as the number of pieces asked for grows, and why.`,
      answer: {
        value: `${first}, ${second}`,
        acceptableForms: [`${first} ${second}`, `${first}, ${second}`],
        validation: 'ordered-list',
      },
      hintLadder: [
        'If the whole length is fixed, what does asking for more pieces have to do to each one of them?',
        'Take the whole length and share it into the number of pieces the order asks for; the answer is one of those shares.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'frac-divide-name-the-piece' },
  sprint: {
    skill: 'Multiplication facts to 12 — the products a turned-over fraction asks for',
    sourceWeek: D15,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [3, 11] },
  },
  mastery: [
    { gen: sitPanelsFromCanvas, diff: 3 },
    { gen: msStrapsFromWebbing, diff: 4 },
    { gen: divideGeneralPair, diff: 3 },
    { gen: msLinseedHullCheck, diff: 4 },
    { gen: sitResinPerMould, diff: 3 },
    { gen: msTwineLengths, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: one move apiece — a length measured out in panel widths, a bare fraction ÷ fraction with neither amount a unit fraction, and an amount that fills a named fraction of a mould with the whole recovered from it. 02/04/06: chains — a roll measured out in strap lengths and then scaled across several rolls, a whole hull rebuilt from the part a fraction named before the oil already used is taken off (inverse-start, with the size check named), and a hank measured out in cut lengths before the ones already spent are removed (carrying a batch size the chain never spends). No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'procedure-slip',
      subtype: 'turns-over-the-dividend',
      description: 'Turns over the amount being measured rather than the amount doing the measuring, so the answer arrives upside down — the count of wholes inside one piece where the question asked for the count of pieces inside the wholes. Everything after the flip is usually flawless arithmetic, so no line of the working objects; the result\'s size is the only thing on the page that does.',
      exampleWrongAnswer: '3/4 ÷ 1/8 answered as 1/6, from a working that multiplied 4/3 by 1/8',
      distractorRationale: 'Offer the expression that turns over the first fraction and leaves the second as it stands, so both cards stand on the same four numbers and part company only over which of them was turned over.',
      reteachPointer: 'explanation/script[0] (which amount is doing the measuring) beside script[3] (the size is the only thing that says so)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'dividing-always-shrinks',
      description: 'Carries "dividing makes it smaller, multiplying makes it bigger" over from whole numbers, where both are true only because the second number is never below one. A divisor worth less than one whole makes the count larger, and a multiplier worth less than one whole makes the amount smaller; the reading fails on both halves at once.',
      exampleWrongAnswer: 'a 4-metre cord cut into 2/3-metre lengths judged to give fewer than four lengths',
      distractorRationale: 'Offer the side of the starting amount that a whole-number habit points at, on draws where the operand sits on the other side of one whole, so only reading the operand against one whole separates the options.',
      reteachPointer: 'explanation/script[2] (the same four metres measured with a smaller piece and a larger one), then guidedExamples/E4-GE-01',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'turns-over-both',
      description: 'Turns both fractions over, on the reasoning that a division is being undone and so everything must be reversed. It is the same reflex as reading a rule off the shape of a line rather than off what the line is doing, and it produces a value that is neither the answer nor the answer upside down.',
      exampleWrongAnswer: '2/3 ÷ 3/5 answered as 5/2 × 3/2',
      distractorRationale: 'Offer the expression with both fractions turned over, built from the same four numbers as the correct one, so the card cannot be struck out by its shape.',
      reteachPointer: 'explanation/script[1] (one size of piece, two plain counts), then the Day-3 which-multiplication item',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'uses-every-number',
      description: 'Counts a quantity as needed because it was stated. The size of the batch a hank came from furnishes the scene and belongs to no step, but a solver hunting for something to do with it will divide by it — and the same habit takes a stated amount for the whole thing when the sentence has called it a named part.',
      exampleWrongAnswer: 'a count of cut lengths divided a second time between the hanks in the batch',
      distractorRationale: 'Take the answer that appears once the unspent quantity is put to work, and the answer that appears when the part a fraction names is read as the whole thing.',
      reteachPointer: 'guidedExamples/E4-GE-02 (what the stated amount belongs to), then the Day-4 word problems',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Dividing fractions — reading a division as a question about how many of one amount fit inside another, measuring an amount out in fractional pieces, recovering a whole from the part a fraction names, deciding before any working whether an answer must come out larger or smaller than the amount you started with, and reaching the same answer by two routes: renaming both fractions over one bottom number, and multiplying by the second fraction turned over.',
    improvingCandidates: [
      'measuring an amount out in pieces that are themselves fractions',
      'deciding which of the two fractions gets turned over',
      'judging whether an answer must land above or below the starting amount before working it out',
    ],
    strengtheningByTag: [
      {
        errorTag: 'procedure-slip',
        text: 'turning over the amount that does the measuring rather than the amount being measured — the size check catches it when the working does not',
      },
      {
        errorTag: 'concept-misconception',
        text: 'letting the size of the divisor decide the size of the answer, instead of assuming that dividing always makes less',
      },
      {
        errorTag: 'representation-misread',
        text: 'making one move where the method asks for one, rather than reversing everything on the page',
      },
      {
        errorTag: 'task-comprehension',
        text: 'keeping to the quantities a division question actually needs, and telling a stated part from a stated whole',
      },
    ],
    homeFocus: {
      praiseLine:
        'You estimated which side of the starting amount the answer had to land before you worked anything out, and you checked it there afterwards — that pair of moves is what stops a turned-over fraction going unnoticed.',
      questionForChild: 'How many two-third-metre lengths can be cut from a four-metre cord — and is that more than four or fewer, before you work it out?',
      schoolSyncHook: 'Classes teach this either as "keep, change, flip" or as "give both fractions the same bottom number". Tell us which your child is being shown and these pages will lead with it.',
    },
    vocabularyForParent: [
      'reciprocal (a fraction turned over — the amount that multiplies with it to make one whole)',
      'divisor (the amount you are measuring with, and the one that gets turned over)',
      'common denominator (one bottom number for both fractions, so the two amounts are counts of the same size of piece)',
    ],
  },
});
