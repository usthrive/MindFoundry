/**
 * Level E · Week 15 — "Inequalities" (conceptId: inequalities).
 *
 * FILL-ARCHITECTURE §6 row E15: anchor "the tipping balance + a ray of answers";
 * key multi-step "solve then graph"; error-analysis "flips the symbol when
 * adding"; discrimination "open vs closed dot; < vs ≤"; Day-5 signature
 * "ASN: adding to both sides keeps the tip".
 *
 * THE WEEK'S CLAIM, and it is the third turn of one idea. E13 said an equation
 * is a claim that two amounts are the SAME, so every move lands on both sides.
 * E14 said an expression built by two moves comes apart in the reverse order,
 * and that a division is only a legal move when it reaches every term. E15 lets
 * the beam rest over instead of level, and almost nothing changes:
 *
 *  - An inequality claims that one side OUTWEIGHS the other. The move rule is
 *    unchanged, and for the same reason: change one side alone and the claim you
 *    were reading stops being the claim you are now reading.
 *  - No move this week performs can turn the symbol round. Taking the same
 *    amount off both pans lightens both by the same amount, so the heavier pan
 *    is still the heavier pan; sharing both pans into the same positive number
 *    of equal parts shrinks both in the same proportion, so it is still the
 *    heavier pan. That is the whole content of the Day-5 claim, and it is why
 *    the week's named slip — flipping the symbol while adding — is a slip and
 *    not an occasionally-correct habit. The family enforces the condition that
 *    makes this true: `inequalityBound` refuses a coefficient that is not
 *    positive, so no draw here can reach the move that DOES turn a symbol round.
 *  - What is genuinely new is the ANSWER. It is not a number, it is a set: every
 *    value from a boundary outwards. So the answer form is a {symbol, bound}
 *    pair and it gets drawn, and one number — the boundary itself — is either in
 *    the set or out of it. That single value is the entire difference between
 *    `<` and `≤`, and it is what the open and the filled circle are FOR.
 *
 * The lesson therefore does not teach "flip when you multiply by a negative" as
 * a rule with the negative case removed. It teaches the honest positive-only
 * statement — every move you can make this year keeps the tip — and says plainly
 * that one move exists which does not, and that it arrives with negative
 * multipliers. A child who is told the boundary of a rule does not have to
 * unlearn the rule later.
 *
 * FIVE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. THE FAMILY'S OWN DISCRIMINATION IS NOT SERVED, AND THE REASON IS MEASURED.
 *     `openOrClosedDotTrap` offers the correct reading (right dot, right
 *     direction) against exactly its two one-feature neighbours (wrong dot /
 *     right direction, right dot / wrong direction). Over three options and two
 *     binary features that makes the key the MAJORITY on both features every
 *     time, so "take the circle two of them agree on and the direction two of
 *     them agree on" is correct on every draw without reading the inequality.
 *     Measured at 100% over 4,000 draws; `bb-answer-entropy-test` cannot see it,
 *     because the keyed text moves, no option is dead and the key sits at no
 *     fixed rank or position. The item is reported upward, not edited — it is a
 *     shared file. `discrimBoundaryPicture` below asks the recipe's question
 *     with the same three readings available but the PAIRING drawn (kit §E2.11):
 *     the third honest wrong reading is the picture of the symbol turned round,
 *     which is the week's own named slip, and rotating which two of the three
 *     are offered drops every fixed feature-parity strategy to 1/3 — chance.
 *
 *  2. THE ESTIMATE-FIRST PROBE ASKS ABOUT THE SHAPE OF THE ANSWER, NOT ITS SIZE,
 *     and that choice was forced by measurement (kit §E2.9a).
 *
 *     The probe this week wanted first was a magnitude one: a footbridge with a
 *     load limit, a party named in the story, and "will the whole party cross in
 *     one go?" asked before any arithmetic. Two draws were built and measured.
 *     Drawing the LIMIT first and placing the party either side of the boundary
 *     served 52.8/47.3 — and "a big party has to split" answered it 66.6% of the
 *     time. Rebuilding it b09's way, drawing the PARTY first so its size carries
 *     no information, moved that habit to 49.8% and moved the same signal onto
 *     the limit: "a big number on the sign means it crosses" then scored 67.1%.
 *
 *     That is not a draw defect, it is conservation. The probe's answer is a
 *     function of the three numbers on the page, so unless it stops being
 *     estimable, one of them has to carry the bit. Six draw variants and a
 *     shared-load term (which dilutes the limit with a quantity independent of
 *     the answer) were simulated over 200,000 rows each: the best of them still
 *     left 62.3%, above the ~60% the corpus's own b11 repair settled at, and it
 *     bought that by rating one footbridge at four tonnes and another at a
 *     hundred and twenty kilos.
 *
 *     So the probe moved instead of the draw. The silo's rule is stated in
 *     English, and whether a load standing exactly on the stated limit is
 *     allowed is decided by which sentence was drawn — not by how big any number
 *     is. It has no magnitude for a habit to read: the two answers arrive with
 *     the two rules, one each, and the only way to answer it is to read the
 *     sentence, which is precisely what the week is teaching. It is also the
 *     better probe for this cell. E15's failure mode is not misjudging a size,
 *     it is getting the SHAPE of the answer wrong — the symbol turned round, the
 *     wrong circle drawn — so committing to the shape before solving is the
 *     commitment worth demanding. `sitSiloHeadroom` is reachable ONLY through
 *     the wrapper (kit §E2.2), so its ladder is spent once.
 *
 *     The footbridge item stays, unwrapped: the party it names is a stated
 *     quantity the question never uses, and drawing it either side of the
 *     boundary keeps it from being a number a child can ignore on sight.
 *
 *  3. THE TWO CHAINS CARRY THE TWO DOTS INTO REAL QUANTITIES. The sapling order
 *     is the CLOSED dot — the school may spend all of its money, so the boundary
 *     count is itself affordable and the answer IS the boundary. The reservoir is
 *     the OPEN dot — the water must rise PAST the mark, so the day that reaches
 *     it exactly is not yet the day, and the answer is one beyond the boundary.
 *     Both are exact by construction; neither needs a floor or a rounding rule,
 *     which is the trap kit §E2.7 warns about (a computable answer that admits
 *     two defensible readings). The strictness is stated in the prose of each,
 *     not left to be inferred.
 *
 *  4. THE TWO WRITE-THE-INEQUALITY SITUATIONS DRAW THEIR SYMBOL FROM ENGLISH,
 *     never from a printed glyph. "Has to raise at least" against "has to raise
 *     more than", and "must never go over" against "must always stay under", are
 *     ordinary sentences that differ by exactly one number — the boundary — and
 *     that is the same distinction the circles draw. It also means the symbol
 *     cannot be copied off the page: on these two items it has to be decided.
 *
 *  5. NAMES COME FROM THE CORPUS CAST. `assemble.ts` refuses to let one child
 *     star in two unrelated stories on a page, and it detects that through
 *     `surface.ts::PERSON_NAMES` — so a week drawing from a private pool is
 *     outside the guard it is relying on. This week draws the twelve the guard
 *     knows, which are also the twelve the algebra family draws, so the check
 *     covers the library items and the local ones together.
 *
 *  6. ANSWER-IN-PROMPT AUDIT, done by construction and argued per generator.
 *     `solveInequality`, `readInequalityGraph` and `eaFlipWhenAdding` clear
 *     theirs in the family. The five local generators clear theirs by range: a
 *     wristband raises at most 9 credits while the count needed is at least 12;
 *     a silo already holds at least 260 tonnes while the headroom is at most 240;
 *     a walker is counted at 55 kg or more while the bridge takes at most 26 of
 *     them, and the party differs from that count whichever way the flip fell;
 *     the delivery charge is at most 19 credits while the sapling count is at
 *     least 20 and the field edge at least 65 m; the rain adds at most 5 cm a day
 *     and the water stands 26 m deep or more, while the answer is 6 to 25 days.
 *     No draw prints the number it asks for. The three frames were dressed at the
 *     END of the week, not the start (kit §E2.8).
 *
 * Retrieval reaches back to the three moves an inequality solve performs and one
 * fact it runs on: E13's single undo and E14's double undo — the SAME arithmetic
 * this week does, with an equals sign in place of the symbol, which is the point
 * the warm-ups exist to make — E11's evaluation, which is how a candidate value
 * is tested for membership, and D16's exact division, the second inverse.
 */

import { asWarmup, classify, divideExact, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel, numberLine } from '../lib/figures';
import {
  eaFlipWhenAdding,
  evaluateAtX,
  inequalityAnswer,
  inequalityForms,
  isInclusive,
  oneStepEquation,
  readInequalityGraph,
  solveInequality,
  twoStepEquation,
  type IneqSymbol,
} from '../lib/algebra';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D16 = { level: 'D' as const, week: 16 };
const E11 = { level: 'E' as const, week: 11 };
const E13 = { level: 'E' as const, week: 13 };
const E14 = { level: 'E' as const, week: 14 };

/**
 * The corpus cast (`surface.ts::PERSON_NAMES`), drawn rather than hardcoded
 * (kit §F.3) — and deliberately this list rather than a private one, so the
 * assembler's one-child-per-page guard can actually see these items (decision 5).
 */
const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/**
 * The two ways ordinary English states a FLOOR, and they differ by exactly one
 * number: the stated figure itself. Reaching a target is meeting it; beating it
 * is not (decision 4).
 */
const FLOOR_RULES: ReadonlyArray<{ clause: string; symbol: IneqSymbol }> = [
  { clause: 'has to raise at least', symbol: '≥' },
  { clause: 'has to raise more than', symbol: '>' },
];

/** The same contrast on a CEILING: going over it, against reaching it at all. */
const CEILING_RULES: ReadonlyArray<{ clause: string; symbol: IneqSymbol }> = [
  { clause: 'must never go over', symbol: '≤' },
  { clause: 'must always stay under', symbol: '<' },
];

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * E13 — one move undone, in its subtractive shape. Chosen, not drawn: this is
 * the identical line a one-step inequality asks for, with `=` where the symbol
 * will be. A child who solves it and then meets `x + 14 ≥ 31` has done the
 * arithmetic already and has only the claim left to think about.
 */
const wOneStep = asWarmup(oneStepEquation('sub'), E13);
/** E14 — the two moves undone in reverse order: the same for a two-step form. */
const wTwoStep = asWarmup(twoStepEquation(), E14);
/**
 * E11 — evaluate at a value. This is the membership test: putting a candidate
 * into the original inequality is how a child decides whether it is inside the
 * ray, and it is what the Day-5 error-analysis asks for by name.
 */
const wEvaluate = asWarmup(evaluateAtX(), E11);
/**
 * D16 — exact division, the second inverse. Divisor and quotient ranges are
 * disjoint for the reason E13 records: `divideExact` draws them independently,
 * so overlapping ranges can print `144 ÷ 12` and stand the answer beside the
 * question.
 *
 * The quotient window is wider than either sibling week's because this warm-up
 * is served twice. At 4-9 x 13-21 a read of the generated week turned up `80 ÷ 4`
 * on Day 2 and `80 ÷ 5` on Day 5 — two different questions that read as one
 * being asked again. The surface guard cannot see it: their token sets differ.
 */
const wDivide = asWarmup(divideExact(4, 9, 13, 30), D16);

// ---------------------------------------------------------------------------
// Writing the inequality from the sentence that states it
//
// The family's `solveInequality` hands the child the symbol already written and
// asks for the solution set. These two hand over a RULE in English and ask for
// both — which is where "at least" against "more than" stops being a reading
// exercise and becomes the boundary value.
// ---------------------------------------------------------------------------

/**
 * A club selling wristbands against a target it has to clear. RATE — the money
 * arrives per wristband — and a FLOOR, so the ray runs upwards.
 *
 * No leak by construction: a wristband raises 3–9 credits while the count needed
 * is 12–40, so the answer is larger than every price on the page, and the target
 * is at least three times the answer.
 */
const sitFundWristbands = situation({
  situationType: 'rate',
  cognitiveOp: 'alg-inequality-write',
  draw: (r) => {
    const perBand = r.int(3, 9);
    const bound = r.int(12, 40);
    const target = perBand * bound;
    const rule = r.pick(FLOOR_RULES);
    const name = one(r);
    return {
      prompt: `${name}'s club is selling wristbands to pay for repairs to its clubhouse. Every wristband sold raises ${countNoun(perBand, 'credits')}, and the club ${rule.clause} ${countNoun(target, 'credits')} for the work to go ahead. Taking x for the number of wristbands sold, write the inequality this rule states and solve it.`,
      answerValue: inequalityAnswer(rule.symbol, bound),
      templateId: 'e_alg_inequality_v1',
      params: { a: perBand, b: 0, c: target, symbol: rule.symbol },
      validation: 'ordered-list',
      acceptableForms: inequalityForms(rule.symbol, bound),
      hints: [
        'Does this rule set a floor the takings have to clear, or a ceiling they have to stay under?',
        'Write what the wristbands raise altogether as an expression in x, then join it to the stated figure with the symbol the rule uses.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * A grain silo with room left in it. PART-WHOLE — what is in it and what may
 * still go in make up what it may hold — and a CEILING, so the ray runs down.
 *
 * This is the week's metacognition carrier, served ONLY through the estimate-
 * first wrapper below (decision 2). Its two rules differ by exactly one load —
 * the one standing on the stated limit — so the probe has a decidable answer
 * that no magnitude on the page can hint at.
 *
 * No leak by construction: the silo already holds 260–480 tonnes while the
 * headroom is 60–240, so the answer is smaller than both stated figures and
 * cannot equal either.
 */
const sitSiloHeadroom = situation({
  situationType: 'part-whole',
  cognitiveOp: 'alg-inequality-write',
  draw: (r) => {
    const held = 10 * r.int(26, 48);
    // Stepped in 5s rather than 10s: the headroom IS the answer, and a 19-value
    // answer set put the same bound on Form A and Form B of the mastery check
    // about one seed in nineteen — which is the corrective retest handing back
    // the number the child had just failed on. 37 values roughly halves it.
    const room = 5 * r.int(12, 48);
    const ceiling = held + room;
    const rule = r.pick(CEILING_RULES);
    const name = one(r);
    return {
      prompt: `A grain silo on ${name}'s farm already holds ${countNoun(held, 'tonnes')}, and the load standing in it ${rule.clause} ${countNoun(ceiling, 'tonnes')}. Taking x for the tonnes of grain still to be tipped in, write the inequality this rule states and solve it.`,
      answerValue: inequalityAnswer(rule.symbol, room),
      templateId: 'e_alg_inequality_v1',
      params: { a: 1, b: held, c: ceiling, symbol: rule.symbol },
      validation: 'ordered-list',
      acceptableForms: inequalityForms(rule.symbol, room),
      hints: [
        'Is the larger figure describing what is in the silo now, or the most that may ever stand in it?',
        'Write what the silo will be holding once the new grain is in, then set that against the stated limit with the symbol the rule uses.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const sitSiloHeadroomEstimate = withEstimateFirst(
  sitSiloHeadroom,
  'will a load standing exactly on the stated limit still be allowed, or is it the first one shut out?',
);

// ---------------------------------------------------------------------------
// The limit as a real quantity, with a number beside it that is not the answer
// ---------------------------------------------------------------------------

/**
 * An old footbridge with a load limit, and a party standing at the near end.
 *
 * The party is a stated quantity the question never uses — the item asks for the
 * greatest number the bridge takes, not whether this party fits — and it is
 * drawn a short distance either side of that number on a flip. Both halves of
 * that matter. A party that were always comfortably inside the limit would be a
 * number a child could dismiss on sight, and the point of a spare quantity is
 * that deciding it is spare has to be work.
 *
 * It carried this week's estimate-first probe until the probe was measured; what
 * that measurement found, and why the probe now sits on the silo instead, is
 * decision 2 in the header. It is worth reading before adding a magnitude probe
 * to any item in this family.
 *
 * No leak by construction: a walker counts as 55–90 kg while the answer is 4–26
 * walkers, so the answer is smaller than every weight printed, and it differs
 * from the party by at least one whichever way the flip fell.
 */
const sitFootbridgeParty = situation({
  situationType: 'measurement',
  cognitiveOp: 'alg-inequality-limit',
  draw: (r) => {
    const perWalker = r.int(55, 90);
    const party = r.int(8, 22);
    const gap = r.int(1, 4);
    const allowed = r.int(0, 1) === 0 ? party + gap : party - gap;
    const limit = perWalker * allowed;
    const name = one(r);
    return {
      prompt: `A sign on an old footbridge says the bridge carries at most ${countNoun(limit, 'kg')} at one time. Every walker with a rucksack is counted at ${countNoun(perWalker, 'kg')}. ${name} is leading a party of ${countNoun(party, 'walkers')} up to the crossing. What is the greatest whole number of walkers that may stand on the bridge at once?`,
      answerValue: String(allowed),
      templateId: 'e_alg_one_step_v1',
      params: { op: 'mul', b: perWalker, c: limit },
      units: 'walkers',
      hints: [
        'What is the figure on the sign describing — one walker, or everybody standing on the bridge together?',
        'Work out how many of those weights fit inside the stated limit, and count only whole walkers.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the one number the two circles disagree about
// ---------------------------------------------------------------------------

/**
 * The recipe's discrimination: `<` against `≤`, and which way the ray runs.
 *
 * THE PAIRING IS DRAWN (decision 1). Three honest wrong readings exist — the
 * boundary treated the other way, the ray sent the other way, and both at once,
 * which is the picture of the symbol turned round and so is this week's own
 * named slip. Offering a fixed two of the three would make the key the majority
 * on both features every time; drawing WHICH two puts the key in each role in
 * turn, so no fixed "go with the circle most of them show" habit beats chance.
 */
const discrimBoundaryPicture = discrimination({
  variant: 'structural',
  cognitiveOp: 'alg-inequality-picture',
  draw: (r) => {
    const symbol = r.pick(['>', '<', '≥', '≤'] as const);
    const bound = r.int(3, 24);
    const rightwards = symbol === '>' || symbol === '≥';
    // "open circle" / "filled circle", not a second vocabulary of rings and
    // dots: the figure alts on this week's graph items, the lesson script and
    // the vocabulary list all say circle, and a page that renames its own
    // picture halfway through the week is asking the child to translate twice.
    const mark = isInclusive(symbol) ? 'a filled circle' : 'an open circle';
    const otherMark = isInclusive(symbol) ? 'an open circle' : 'a filled circle';
    const side = rightwards ? 'right' : 'left';
    const otherSide = rightwards ? 'left' : 'right';
    const drawing = (m: string, s: string) => `${m} on ${fmtInt(bound)}, with everything to its ${s} shaded`;
    const wrong = [
      {
        text: drawing(otherMark, side),
        errorTag: 'concept-misconception' as const,
        rationale: 'Sends the shading the right way but treats the boundary value the opposite way — and that single value is the entire difference between a strict symbol and an inclusive one.',
      },
      {
        text: drawing(mark, otherSide),
        errorTag: 'representation-misread' as const,
        rationale: 'Marks the boundary correctly and then runs the ray the other way, so the shaded part holds exactly the values the inequality shuts out.',
      },
      {
        text: drawing(otherMark, otherSide),
        errorTag: 'procedure-slip' as const,
        rationale: 'This is the drawing of the same inequality with its symbol turned round — the week\'s named slip, carried through to the picture it produces.',
      },
    ];
    // Which TWO of the three are offered rotates, so the key is the majority
    // reading on both features only a third of the time.
    const drop = r.int(0, 2);
    return {
      prompt: `Which drawing shows every value that makes ${inequalityAnswer(symbol, bound)} true?`,
      correct: drawing(mark, side),
      distractors: wrong.filter((_, i) => i !== drop),
      hints: [
        'Is the marked value itself one of the answers, or only the values beyond it?',
        'Test the boundary value in the inequality, then test one value on each side of it, and shade whatever held.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — the two dots as real quantities (decision 3)
// ---------------------------------------------------------------------------

/**
 * THE CLOSED DOT. A school may spend all its money and not a credit more, so the
 * count that spends the budget exactly is allowed and the answer IS the
 * boundary. INVERSE-START: the money in hand is the RESULT of the delivery
 * charge and the saplings together, so the opening move is a subtraction the
 * sentence order never asks for.
 *
 * "Delivery charge", not the "carriage charge" it was first written as: C12's
 * bar model is built on railway CARRIAGES, and a word that means a train two
 * levels down and a freight cost here is one a child has to un-learn to read.
 *
 * The field edge is stated, is never used, and is exactly the number a child is
 * invited to divide by — a length of hedge and a count of saplings sit together
 * so naturally that spacing looks like the question.
 *
 * No leak by construction: the delivery charge is 12–19 credits and a sapling
 * 4–9, while the answer is 20–60; the money in hand is at least 92 and the field
 * edge at least 70, both above the answer's ceiling.
 */
const msSaplingOrder = multiStep({
  situationType: 'money-change',
  cognitiveOp: 'alg-inequality-budget',
  posing: 'inverse-start',
  draw: (r) => {
    const delivery = r.int(12, 19);
    const each = r.int(4, 9);
    const most = r.int(20, 60);
    const budget = delivery + each * most;
    // 28 values, not the 8 this was first drawn at: the field edge is served
    // three times a week, and eight values put the SAME length on two different
    // schools' windbreaks about a third of the time, which reads as a page
    // nobody proofread. The floor stays clear of the answer's ceiling of 60.
    const edge = 5 * r.int(13, 40);
    const name = one(r);
    return {
      prompt: `${name}'s school has ${countNoun(budget, 'credits')} set aside for a windbreak along a field edge ${countNoun(edge, 'metres')} long. The supplier adds a one-off delivery charge of ${countNoun(delivery, 'credits')} to an order, whatever its size, and charges ${countNoun(each, 'credits')} a sapling. The school may spend all of the money but not a credit more. What is the greatest whole number of saplings it can order?`,
      initN: budget,
      steps: [
        { op: 'sub', n: delivery, d: 1 },
        { op: 'div', n: each, d: 1 },
      ],
      units: 'saplings',
      hints: [
        'Which of these charges is made once for the whole order, and which one is made again for every sapling?',
        'Set the one-off charge aside from the money first, then see how many saplings what is left will buy.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msSaplingOrderCheck = withCheckBack(
  msSaplingOrder,
  'build the order back up from your count — does it land on the money the school has, without going past it?',
);

/**
 * THE OPEN DOT. The water has to rise PAST the mark, so the day that reaches the
 * mark exactly is not yet the day and the answer stands one beyond the boundary.
 * HAS-DISTRACTOR: the depth at the dam wall is stated, is never used, and is a
 * length in the same unit family as the rise, which is what makes it tempting.
 *
 * The day window is 20 values wide rather than the 10 it was first drawn at.
 * Ten made a free-entry numeric answer worth 10% to a child who had noticed the
 * range and guessed inside it — measured as ten distinct keys across 400 seeds,
 * which no gate reports because ten is not one.
 *
 * No leak by construction: the rain adds 3–5 cm a day and the level is already
 * 40–90 cm up, while the answer is 6–25 days; the stated mark is at least 55 cm
 * and the depth at the wall 26–38 m, so nothing on the page is the answer.
 */
const msReservoirDays = multiStep({
  situationType: 'rate-of-change',
  cognitiveOp: 'alg-inequality-days',
  posing: 'has-distractor',
  draw: (r) => {
    const perDay = r.int(3, 5);
    const days = r.int(5, 24);
    const risen = r.int(40, 90);
    const mark = risen + perDay * days;
    const depth = r.int(26, 38);
    const name = one(r);
    return {
      prompt: `The sluice on a reservoir may not be opened until the water has risen more than ${countNoun(mark, 'cm')} above its winter mark. ${name} records that it has risen ${countNoun(risen, 'cm')} so far, that steady rain is adding ${countNoun(perDay, 'cm')} a day, and that the water stands ${countNoun(depth, 'metres')} deep at the dam wall. What is the smallest whole number of days before the sluice may be opened?`,
      initN: mark,
      steps: [
        { op: 'sub', n: risen, d: 1 },
        { op: 'div', n: perDay, d: 1 },
        { op: 'add', n: 1, d: 1 },
      ],
      units: 'days',
      hints: [
        'How far does the water still have to come up before that rule is satisfied?',
        'Work out how many days bring it exactly level with the stated mark, then decide whether being level with it is enough.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * The recipe's key multi-step, written out: solve, then say what the picture of
 * the answer looks like. Fixed prose, because the demand is on describing a set
 * rather than on the arithmetic — and the four parts are named separately so a
 * bare value with no picture cannot pass as an answer.
 */
const solveThenDraw = reasoning({
  prompt:
    'Solve 3x + 7 ≤ 25. Then describe the drawing of its answers in three parts: which number the circle sits on, whether that circle is filled in or left open, and which way the shading runs from it. Finish by naming the largest whole number the drawing allows.',
  value:
    'x ≤ 6; the circle sits on 6, it is filled in because 6 itself works, the shading runs to the left, and the largest whole number allowed is 6',
  acceptableForms: ['x ≤ 6', 'x <= 6', '6', 'filled in', 'shaded to the left', 'to the left'],
  keywords: true,
  hints: [
    'Which values is a drawing of an answer set trying to show — one of them, or all of them at once?',
    'Solve first and read the boundary off your answer, then decide the circle from the symbol and the direction from which values are allowed.',
  ],
  errorTags: ['representation-misread', 'concept-misconception'],
});

/**
 * The recipe's Day-5 signature. The verdict is ALWAYS, and it is worth saying
 * why that is not pedantry: the two weeks before this one both ended on a
 * SOMETIMES, and a claim that turns out to be flatly true is the corrective for
 * a child who has started answering "sometimes" on reflex.
 *
 * The second sentence is what stops it being a guess — naming the condition
 * under which the verdict would change is the argument, and it is the same
 * boundary the header states: the same amount, on both sides.
 */
const addingKeepsTheTip = classify({
  prompt:
    'Always, sometimes, or never true: adding the same amount to both sides of an inequality leaves the same side the heavier one. In one sentence, say what would have to be different about the amounts added for your verdict to change.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale: 'Hears "inequalities can flip" as a warning attached to inequalities in general rather than to one particular move, so a step that cannot change which side is heavier is treated as one that might.',
    },
    {
      text: 'never',
      errorTag: 'procedure-slip',
      rationale: 'Takes the flip to be a rule that fires on every move, which is the reading that turns the symbol round while adding — the week\'s named slip stated as a law.',
    },
  ],
  hints: [
    'If two pans already differ, and you put the same weight on each, has anything happened to the difference between them?',
    'Try it on a true statement with a small difference, then on one with a large difference, and see whether a single verdict covers both.',
  ],
  errorTags: ['concept-misconception', 'procedure-slip'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE15 = makeWeekBuilder({
  level: 'E',
  week: 15,
  conceptId: 'inequalities',
  conceptName: 'Inequalities',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [E11, E13, E14],
  pedagogyContract: 'v2',
  conceptualAnchor: 'a tipped balance and a ray of answers',
  conceptFamily: 'operation',
  deepeningDelta:
    'E13 and E14 both solved a sentence asserting that two amounts are the SAME, and both ended on a single value. E15 asserts instead that one amount outweighs the other, and that changes two things and leaves everything else standing. The moves are unchanged, because taking the same amount off both pans, or sharing both pans into the same number of equal parts, cannot make the lighter pan the heavier one — so the arithmetic of E13 and E14 is performed here line for line. What is new is that the answer stops being a number and becomes a set with a boundary, and that the boundary value is either inside it or outside it. That one value is what the open and the filled circle exist to say, and it is why this week draws its answers instead of only writing them.',
  explanation: {
    hook:
      'A balance that is level tells you two amounts are equal. A balance that rests over tells you something too, and it is just as exact: this side is the heavier one. Now put the same weight on both pans and watch. The beam moves, and the message does not change.',
    whyBeforeHow:
      'An inequality is a claim that one side outweighs the other, and solving one is the same job as solving an equation: strip away whatever has been done to the unknown, one legal move at a time. A move is legal when it lands on both sides at once, because a change made to one side alone would change the claim you were reading into a different claim altogether. That is why this week works with a tipped balance and a ray of answers. The balance says what you may do. Take the same amount off both pans and both get lighter by the same amount, so the heavier pan is still the heavier pan. Share both pans into the same number of equal parts and both shrink in the same proportion, so it is still the heavier pan. Nothing you can do this week turns the symbol round — one move exists that does, and it arrives with negative multipliers, which is a later week and not this one. The ray says what an answer looks like. An equation names one value; an inequality names every value from a boundary outwards, so the answer is a set and it is worth drawing. And one number decides between two very similar sets: the boundary itself. If the boundary works, the circle on it is filled in and the answer is written with a symbol that says "or equal to". If it does not, the circle is left open and the boundary is the one value the ray stops just short of.',
    script: [
      {
        say: 'Here are two pans that are not level. The left holds a sealed box and thirty; the right holds fifty; and the left is the heavier side, so whatever is in the box, the box plus thirty comes to more than fifty. Now I take thirty off both pans, in one breath. The left is the box on its own. The right is twenty. And the left is still the heavier side, because I lightened both by the same amount. So the box is more than twenty.',
        visual: 'The two pans as they stand, to one scale. The left is the longer, and that is the whole message.',
        figure: barModel(
          [
            { label: 'the left pan: the box and the thirty', segments: [{ value: 34, label: 'the box' }, { value: 30, label: '30', fill: 'hatch' }], total: 'more than 50' },
            { label: 'the right pan', segments: [{ value: 50, label: '50' }] },
          ],
          { scaleMax: 64, alt: 'a longer left bar made of a block for the box and a hatched 30 block, beside a shorter right bar of 50' },
        ),
      },
      {
        say: 'Now look at what I have actually found, because it is not a number. More than twenty is a whole run of numbers — twenty-one, twenty-two, a hundred, every one of them. So I draw it. I put a circle on twenty and shade everything to the right of it. And I leave that circle open, hollow, because twenty is the one number the run does not include: twenty is not more than twenty.',
        visual: 'The boundary at twenty, ringed but not filled, with the line shaded away to the right.',
        figure: numberLine(
          {
            min: 14,
            max: 26,
            step: 2,
            marks: [{ at: 20, label: '20', style: 'open' }],
            hops: [{ from: 20, to: 26 }],
          },
          { alt: 'a number line with an open circle at 20 and the line shaded from there to the right' },
        ),
      },
      {
        say: 'Now here is the drawing the whole week turns on, and it is the one you have just seen with a single thing changed: the circle is filled in. That one is the picture of the box weighing twenty OR MORE. It holds every number the last drawing held and one more — twenty itself. One number is the entire difference between the two pictures, and it is the reason one circle is left open and this one is filled in. When you read a rule in words, that is what to hunt for: a target you have to beat leaves the circle open, and a limit you may simply reach fills it in.',
        visual: 'The same boundary as the drawing before it, with the circle now filled in, so the boundary value belongs to the set.',
        figure: numberLine(
          {
            min: 14,
            max: 26,
            step: 2,
            marks: [{ at: 20, label: '20', style: 'point' }],
            hops: [{ from: 20, to: 26 }],
          },
          { alt: 'a number line with a filled circle at 20 and the line shaded from there to the right' },
        ),
      },
      {
        say: 'Two habits, and the first one costs nothing. Before I work anything out I decide what SHAPE my answer is going to have — whether the amount sitting exactly on the stated limit is one of my answers or the first one shut out. The words settle that, and no amount of arithmetic ever will, so it is worth deciding while the words are still in front of me. I estimate the size roughly at the same time: a boundary bigger than the total I began with would stop me on sight. Then at the end I check, and an inequality gives me a better check than an equation does. I put the boundary itself back into the sentence I started from, and then one value on each side of it. The boundary tells me whether the circle is filled. The two neighbours tell me which way the shading runs. If all three agree with what I drew, the drawing is right.',
        visual: 'The boundary and one value on either side of it, the three points a check tests.',
        figure: numberLine(
          {
            min: 14,
            max: 26,
            step: 2,
            marks: [
              { at: 19, label: '19', style: 'point' },
              { at: 20, label: '20', style: 'open' },
              { at: 21, label: '21', style: 'point' },
            ],
          },
          { alt: 'a number line marking 19, 20 and 21, with the middle one ringed and the outer two filled' },
        ),
      },
    ],
    summary:
      'An inequality claims that one side outweighs the other, and every move you make has to keep that claim true — which means every move lands on both sides at once. Taking the same amount off both sides, and sharing both sides into the same number of equal parts, leave the heavier side heavier, so the symbol points the way it always pointed. What changes is the answer: it is a set, not a number, running from a boundary outwards. Read the words carefully to decide whether the boundary itself belongs — a target you must beat leaves the circle open, a limit you may reach fills it in — and finish by testing the boundary and one value on each side of it.',
    vocabulary: [
      { term: 'inequality', kidGloss: 'a statement that one expression is greater than, or less than, another' },
      { term: 'solution set', kidGloss: 'all the values that make a statement true, rather than the single one an equation names' },
      { term: 'boundary value', kidGloss: 'the value at the end of a solution set, which may or may not belong to it' },
      { term: 'strict inequality', kidGloss: 'one written with < or >, whose boundary value is not itself a solution — drawn with an open circle' },
      { term: 'inclusive inequality', kidGloss: 'one written with ≤ or ≥, whose boundary value is a solution — drawn with a filled circle' },
    ],
  },
  guidedExamples: [
    {
      ...ge(15, 1, 'modeled', 'Solve x + 14 ≥ 31, then draw the answers.', [
        {
          teacherSay:
            'I read what the sentence claims before I touch it. Something unknown, with fourteen joined to it, comes to thirty-one or more. So the two sides are not equal, and I am not hunting for one number — I am after every number that makes the claim hold.',
        },
        {
          teacherSay:
            'Fourteen is joined to the unknown, so I take fourteen off both sides in one move. Both sides drop by the same amount, so the side that was heavier is still the heavier one and the symbol does not move. What is the right side left holding?',
          expected: '17',
        },
        {
          // The drawing beside this example is the finished answer, so asking
          // the child to produce it would be asking them to copy the picture.
          // This asks the thing the picture does NOT settle.
          childDo: 'Look at the drawing beside this example. Name the smallest whole number it allows, and say which single number would drop out of the answer if the sentence had said "more than" instead.',
          expected: '17, and 17 itself is the number that would drop out',
        },
      ], 'x ≥ 17'),
      visual: 'The solved set: the boundary filled in, because seventeen itself works.',
      figure: numberLine(
        {
          min: 11,
          max: 23,
          step: 2,
          marks: [{ at: 17, label: '17', style: 'point' }],
          hops: [{ from: 17, to: 23 }],
        },
        { alt: 'a number line with a filled circle at 17 and the line shaded from there to the right' },
      ),
    },
    {
      ...ge(15, 2, 'completion', 'Solve 4x + 9 < 41 and name the largest whole number it allows.', [
        {
          teacherSay: 'Two moves are wrapped round the unknown here. Which one comes off first, and does either of them change which side is the heavier?',
          expected: 'take the 9 off first; neither move changes it',
        },
        {
          childDo: 'Finish the solve, then say which whole numbers are allowed and which is the largest of them.',
          expected: '7',
        },
      ], 'x < 8'),
      visual: 'The solved set: the boundary left open, because eight itself is not allowed.',
      figure: numberLine(
        {
          min: 2,
          max: 14,
          step: 2,
          marks: [{ at: 8, label: '8', style: 'open' }],
          hops: [{ from: 8, to: 2 }],
        },
        { alt: 'a number line with an open circle at 8 and the line shaded from there to the left' },
      ),
    },
    ge(15, 3, 'prompted', 'Solve 5x - 12 ≤ 43, then check your boundary and one value on each side of it.', [
      {
        childDo: 'Undo the two moves in the order that reaches the unknown, keeping the symbol pointing as it was, then test three values against the sentence you started from.',
        expected: 'x ≤ 11',
      },
    ], 'x ≤ 11'),
    {
      // Independent stage: the given only. Deciding that the cradle is weighed
      // ONCE while the sacks are weighed again and again is the task, so a
      // picture of the whole load would hand over the plan the item exists to
      // ask for (L33).
      //
      // Deliberately not a fee-plus-per-unit booking: E14's ticket window
      // already charges "a single booking fee ... not one fee per ticket" on
      // this exact shape, and two adjacent weeks wearing one frame is the
      // corpus's documented weakness (kit §E2.8, L24). The rating is a ceiling
      // that may be reached, so the closed dot is the question it ends on.
      ...ge(15, 4, 'independent', 'A goods lift is rated to carry at most 480 kg. The cradle it lifts weighs 40 kg on its own, and every sack loaded into the cradle weighs 22 kg. Write an inequality for the number of sacks, solve it, and say whether the largest number your answer allows is itself within the rating. Solve cold.', [
        { childDo: 'Decide first which of these weights is on the lift once and which is on it again for every sack, then write the inequality that says so.', expected: '20' },
      ], 'x ≤ 20'),
      visual: 'The weight that is on the lift whatever it carries. What the sacks add is yours to work out.',
      figure: barModel(
        [
          { label: 'the cradle, weighed once', segments: [{ value: 40, label: '40' }] },
        ],
        { scaleMax: 40, alt: 'a single bar of 40 for the empty cradle; the sacks it will carry are not drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the same three moves the last two weeks made, then
    // the same moves under a symbol instead of an equals sign, and the answer
    // drawn. No chains and no choices yet.
    [
      { gen: wOneStep, diff: 2 },
      { gen: wTwoStep, diff: 2 },
      { gen: wEvaluate, diff: 2 },
      { gen: solveInequality('one'), diff: 3 },
      { gen: sitFundWristbands, diff: 3 },
      { gen: readInequalityGraph(), diff: 3 },
    ],
    // Day 2 — fluency + application: the two-step form, the shape of the answer
    // committed to before any arithmetic, and the two circles put in contest.
    [
      { gen: wDivide, diff: 2 },
      { gen: wOneStep, diff: 2 },
      { gen: solveInequality('two'), diff: 3 },
      { gen: sitSiloHeadroomEstimate, diff: 3 },
      { gen: discrimBoundaryPicture, diff: 4 },
      { gen: readInequalityGraph(), diff: 3 },
    ],
    // Day 3 — interleave: the two chains sit between plain solving, a limit with
    // a spare number beside it and the picture trap, so nothing on the page
    // signals what is coming next.
    [
      { gen: wTwoStep, diff: 2 },
      { gen: solveInequality('one'), diff: 3 },
      { gen: msSaplingOrderCheck, diff: 4 },
      { gen: sitFootbridgeParty, diff: 3 },
      { gen: msReservoirDays, diff: 4 },
      { gen: discrimBoundaryPicture, diff: 3 },
    ],
    // Day 4 — word problems: the closed dot and the open dot as chains, beside
    // three single-step items, so "it must be a chain" never becomes the cue.
    [
      { gen: msSaplingOrderCheck, diff: 5 },
      { gen: msReservoirDays, diff: 5 },
      { gen: sitSiloHeadroomEstimate, diff: 4 },
      { gen: sitFundWristbands, diff: 4 },
      { gen: sitFootbridgeParty, diff: 4 },
    ],
    // Day 5 — written: the named slip analysed, the solved set described as a
    // drawing, and the claim that the week's whole method rests on.
    [
      { gen: wDivide, diff: 2 },
      { gen: eaFlipWhenAdding(), diff: 4 },
      { gen: solveThenDraw, diff: 3 },
      { gen: addingKeepsTheTip, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the mistake to watch for this week is a child turning the symbol round while taking a number off both sides. It usually comes from half-remembering that inequalities sometimes flip — which is true, but only for a move they have not met yet. If you see it, do not correct the symbol. Ask them to try one number that fits what they wrote in the sentence they started from, and let the test tell them. The other thing worth two minutes is the difference between a target you have to beat and a limit you may reach: it is one number, and it is the whole reason some circles on their page are filled in and some are not.',
  ],
  puzzle: (r) => {
    // Two rules at once, which is where a ray becomes a band. A single solve
    // produces none of the three numbers asked for, so this cannot collapse to
    // a Day-1 structure — and the two boundaries are deliberately of different
    // kinds, one to be beaten and one that may be reached.
    const lo = r.int(20, 40);            // strict lower boundary: x > lo
    const span = r.int(10, 18);
    const hi = lo + span;                // inclusive upper boundary: x ≤ hi
    const joined = r.int(2, 9);
    const scale = r.int(2, 5);
    const loose = r.int(2, 9);
    const stated = lo + joined;          // x + joined > stated
    const total = scale * hi + loose;    // scale·x + loose ≤ total
    // Every answer is provably absent from the numbers the puzzle prints: the
    // count (10–18) clears the three small operands and falls short of both
    // stated figures; the smallest allowed value equals `stated` only if the
    // joined amount were 1, which is never drawn; and the largest equals
    // `stated` only if the joined amount matched the span, which cannot happen
    // because the joined amount is at most 9 and the span at least 10.
    return {
      id: 'E15-PZ-01',
      title: 'Puzzle Grove: Two Rules, One Band',
      puzzleType: 'construction',
      prompt: `A whole number has to satisfy BOTH of these at once: x + ${fmtInt(joined)} > ${fmtInt(stated)}, and ${fmtInt(scale)}x + ${fmtInt(loose)} ≤ ${fmtInt(total)}. Write three numbers in order: the smallest whole number that satisfies both, the largest whole number that satisfies both, and how many whole numbers there are altogether. Then say in one sentence why the two ends of your band had to be worked out differently.`,
      answer: {
        value: `${lo + 1}, ${hi}, ${span}`,
        acceptableForms: [
          `${lo + 1} ${hi} ${span}`,
          `${lo + 1}, ${hi}, ${span}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'What does each rule on its own allow, before you ask what they allow together?',
        'Solve each one separately and draw both rays on the same line; the numbers you want are where the two shadings overlap.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'alg-inequality-band' },
  sprint: {
    skill: 'Multiplication facts — what a check puts a candidate value back through',
    sourceWeek: { level: 'D' as const, week: 15 },
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { min: 2, max: 12 },
  },
  mastery: [
    { gen: sitSiloHeadroomEstimate, diff: 3 },
    { gen: msSaplingOrderCheck, diff: 4 },
    { gen: sitFundWristbands, diff: 3 },
    { gen: msReservoirDays, diff: 4 },
    { gen: solveInequality('two'), diff: 3 },
    { gen: sitFootbridgeParty, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: a rule stated in English and turned into an inequality, once as a ceiling with room left under it (part-whole, carrying the estimate-first commitment to the shape of the answer) and once as a floor a fundraising total has to clear (rate) — between them they cover all four symbols. 02/04: chains — a budget that may be spent to the last credit, so the boundary count is itself affordable and the check-back is named, and a water level that has to be passed rather than reached, so the answer stands one day beyond the boundary. 05: a two-step inequality given symbolically, solved to a {symbol, bound} pair. 06: a stated load limit with a spare quantity beside it that the question never uses. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'flips-the-symbol-when-adding',
      description: 'Turns the inequality symbol round while adding to or subtracting from both sides, usually from half-remembering that inequalities sometimes flip. Both sides change by the same amount, so which side is heavier cannot have changed; the move that does turn a symbol round is not one this year offers.',
      exampleWrongAnswer: 'x + 5 > 12 answered as x < 7, by taking 5 off both sides and turning the symbol round on the way',
      distractorRationale: 'Offer the solution with its symbol reversed and its boundary correct, so only a reading of what the move did to the two sides separates it from the answer.',
      reteachPointer: 'explanation/script[0] (both pans lightened by the same amount) beside the Day-5 error-analysis',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'boundary-and-ray-confused',
      description: 'Draws or reads a solution set with the wrong treatment of the boundary — filling a circle that should be open, or opening one that should be filled — or sends the shading away from the values the inequality allows. The arithmetic is finished and correct; it is the picture of it that is wrong.',
      exampleWrongAnswer: 'x < 8 drawn with a filled circle on 8, so the one value the answer excludes is the one shown as included',
      distractorRationale: 'Offer the drawing that differs from the answer in exactly one feature — the circle, or the direction — so the page cannot be settled by matching the shape of the numbers.',
      reteachPointer: 'explanation/script[2] (the two drawings that differ by one number), then guidedExamples/E15-GE-02',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'reaching-counted-as-passing',
      description: 'Treats a target that has to be BEATEN as one that may simply be reached, so the value that lands exactly on the stated figure is offered as the answer. The arithmetic reaches the boundary correctly and then stops one short of the question.',
      exampleWrongAnswer: 'the day the water rises exactly level with the mark given as the day the sluice may be opened',
      distractorRationale: 'Offer the boundary itself where the question asks for the first value past it, so only the strictness of the stated rule separates the two.',
      reteachPointer: 'explanation/script[2] (a target you must beat against a limit you may reach), then the Day-4 word problems',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'spends-the-scenery',
      description: 'Spends every number the page prints, so a measurement that furnishes the scene — how far the windbreak runs, how deep the water stands at the dam wall — is drafted into the working as one more step. Both of this week\'s spare figures are stated in a different unit from the thing being counted, so the tell is available before any arithmetic: a length in metres cannot become a count of saplings, and a depth cannot become a number of days.',
      exampleWrongAnswer: 'the metres of field edge shared out between the saplings, as though the spacing were what was asked',
      distractorRationale: 'Offer what the spare measurement yields when it is folded in as an extra step, so the item turns on reading the units rather than on the arithmetic.',
      reteachPointer: 'the two chains on Days 3 and 4, whose unused figure is deliberately in a unit the answer cannot be measured in',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Inequalities — reading a statement that one amount outweighs another, solving it with the same moves an equation takes, understanding why none of those moves turns the symbol round, drawing the answer as a set of values rather than writing it as one, and deciding from the wording whether the value at the boundary belongs inside that set.',
    improvingCandidates: [
      'keeping the symbol pointing as it was while working on both sides',
      'telling a target that has to be beaten from a limit that may be reached',
      'drawing a solution set with the right circle and the right direction',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'seeing why taking the same amount off both sides cannot change which side is the heavier',
      },
      {
        errorTag: 'representation-misread',
        text: 'matching the drawing to the answer: the circle from the symbol, the shading from the values allowed',
      },
      {
        errorTag: 'procedure-slip',
        text: 'deciding whether the boundary value itself counts, and answering the question that was asked',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading the units on each figure before using it, so a length or a depth that only sets the scene stays out of the working',
      },
    ],
    homeFocus: {
      praiseLine:
        'You decided whether a number was inside the answer before you worked anything out, and you checked your boundary by testing a value on each side of it — that pair of habits is the whole week.',
      questionForChild: 'A ride says you have to be over 12 to go on it, and a rule at the pool says you have to be 12 or over to swim in the deep end. Who does exactly one of those two let in?',
      schoolSyncHook: 'If your child\'s class draws these answers with arrows rather than shading, or writes "3 < x" where we write "x > 3", tell us and we will match what they use.',
    },
    vocabularyForParent: [
      'inequality (a statement that one amount is greater or less than another, rather than equal to it)',
      'solution set (all the values that make it true — an inequality has a whole run of them, not one)',
      'boundary value (the value at the end of that run; the wording decides whether it belongs)',
    ],
  },
});
