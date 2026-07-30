/**
 * Level E · Week 13 — "One-step equations" (conceptId: one-step-equations).
 *
 * FILL-ARCHITECTURE §6 row E13: anchor "the balance — undo ONE move"; key
 * multi-step "solve, then plug the answer back in (check-back native)";
 * error-analysis "adds to both sides where it should subtract"; discrimination
 * "which inverse move"; Day-5 signature "write the equation from a balance
 * story".
 *
 * THE WEEK'S CLAIM. An equation is not an instruction to compute; it is a claim
 * that two amounts are the same amount. That single idea decides everything
 * else the week does:
 *  - a move is legal only if it lands on BOTH sides, because a move on one side
 *    alone destroys the claim the equation was making;
 *  - a one-step equation performs exactly one operation on the unknown, so
 *    exactly one move undoes it — and that move is its INVERSE, not a repeat of
 *    it (which is legal, keeps the balance, and gets nowhere: precisely the slip
 *    `eaWrongInverse` shows);
 *  - the check is therefore not an extra chore bolted to the end. Substituting
 *    the value back is the only evidence that the number written is the number
 *    the equation was talking about, which is why every multi-step item here
 *    ships through `withCheckBack` rather than carrying a check as decoration.
 *
 * The three Level-E ceiling lifts each land on a different item:
 *  - INVERSE-START — `msSolveThenCheck` (the family's, the stated count is the
 *    RESULT of a move) and `msSolveThenUse` (the stated time belongs to a whole
 *    batch, so the opening move is a division the sentence order never asks for);
 *  - CHECK-BACK — both of those, wrapped; the check is the week's own rule used
 *    backwards, so the metacognition is the content rather than a frame around it;
 *  - HAS-DISTRACTOR — `msOpenedCanisters`, which states a bench count that is
 *    never used and is exactly the number a child is tempted to divide by.
 *
 * FOUR AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. THE BALANCE ITSELF IS RATIONED TO WHERE IT TEACHES. C19's puzzle ("The
 *     Level Balance") already carries a pan-balance day surface — a parcel, gram
 *     weights and identical washers — and a repeated real-world frame across two
 *     weeks is the corpus's documented weakness (kit §E2.8, L24). But E13's
 *     recipe NAMES the balance as its anchor and its Day-5 signature, so it
 *     cannot be dropped. It is therefore placed where C19 does not go and where
 *     it does the most work: the lesson script, all four guided examples, one
 *     equal-arm discrimination (`discrimWhichEquation`) and the Day-5 written
 *     item. Every other day item wears a different frame — a garden path, a
 *     cable winder, a canister delivery, plus the family's lockers and trays —
 *     so the balance is the MODEL the week reasons with, never its scenery.
 *
 *  2. THE NAMED MISCONCEPTION IS CODE-DERIVABLE, so kit §E2.3's reframing
 *     protocol is not needed. `e_alg_verify_inverse_v1` computes both values
 *     from the same params: the truth by the inverse, the slip by repeating the
 *     equation's own move. The Day-5 error-analysis is the recipe's item exactly
 *     as written, with nothing invented.
 *
 *  3. `oneStepEquation('div')` IS REACHABLE ONLY THROUGH `withEstimateFirst`
 *     (kit §E2.2). The metacognition wrapper does not touch the hint ladder, so
 *     serving that generator both raw and wrapped would spend two of the week's
 *     three allowed ladder slots on one wording. The division shape is also the
 *     one where an estimate genuinely decides something — a child who predicts
 *     that the whole set outweighs one share will never multiply by mistake.
 *
 *  4. ANSWER-IN-PROMPT AUDIT. Every equation this week emits was checked against
 *     the leak the algebra family found in seven of its own generators (`x + 8 =
 *     16` hands over the 8). The family clears its four one-step draws with
 *     `clearOf`; the four local generators clear theirs by CONSTRUCTION and the
 *     argument is written beside each draw — a flagstone is at least 30 cm long
 *     while the path holds at most 9 of them; a spool's batch time is at least
 *     20 minutes while the batch counts stay under 10; an opened canister holds
 *     at least 24 screws while the workshop has at most 12 benches. No draw here
 *     can print the number it is asking for.
 *
 * Retrieval is backward-only into the three skills a one-step equation actually
 * runs on: E11 evaluate-at-a-value (the substitution the check IS, one week
 * early), D2 subtraction fluency (the additive inverse) and D16/D15 exact
 * division and multiplication (the multiplicative pair). The E11 warm-up is
 * placed on Day 1 and Day 5 rather than Day 1 and Day 2 — the `MACHINES` pool it
 * draws from holds three frames, so consecutive days opened with the same
 * sentence and two new numbers. No gate sees that; a reader does.
 */

import { asWarmup, classify, divideExact, multiply, reasoning, subWhole } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel } from '../lib/figures';
import {
  eaWrongInverse,
  equationText,
  evaluateAtX,
  msSolveThenCheck,
  oneStepEquation,
  whichInverseMove,
} from '../lib/algebra';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const B6 = { level: 'B' as const, week: 6 };
const D2 = { level: 'D' as const, week: 2 };
const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };
const E11 = { level: 'E' as const, week: 11 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §F.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** E11 — evaluate an expression at a stated value. This IS the check-back move,
 *  met a week before the week that makes it evidence rather than exercise. */
const wEvaluate = asWarmup(evaluateAtX(), E11);
/**
 * D2 — subtraction fluency: the inverse the additive equations ask for.
 *
 * The window is 500–940 rather than a wider one for the same reason the division
 * warm-up below uses disjoint ranges. `subWhole` draws both operands from one
 * range and orders them, so any range whose top reaches twice its floor can draw
 * `294 − 147`, whose answer is the number beside it. Keeping the top under twice
 * the floor makes the difference provably smaller than the subtrahend, so no
 * seed can print the answer (it happened in 3 packs out of 2,000 before this).
 */
const wSubtract = asWarmup(subWhole(500, 940), D2);
/**
 * D16 — exact division, the inverse the scaling equations ask for.
 *
 * The divisor and quotient ranges are DISJOINT on purpose. `divideExact` draws
 * the two independently, so overlapping ranges let them coincide and print
 * `144 ÷ 12 = ?` — a warm-up whose answer is already on its own line, in the one
 * week whose whole subject is not reading an answer off the page. Nothing in the
 * shared library forbids it; keeping 3–9 clear of 11–16 does.
 */
const wDivide = asWarmup(divideExact(3, 9, 11, 16), D16);
/** D15 — the product itself, so undoing a scaling never stalls on the arithmetic. */
const wProduct = asWarmup(multiply(3, 15, 4, 24), D15);

// ---------------------------------------------------------------------------
// Single-step equations
//
// Three shapes come from the G6 family (add, sub, mul — the additive pair
// carries the family's bar picture); the division shape is served ONLY through
// the estimate-first wrapper (decision 3). The fourth generator is local: a
// scaling equation in a measurement frame, which is the same move wearing units
// a child has never solved it in.
// ---------------------------------------------------------------------------

const sitAddEquation = oneStepEquation('add');
const sitSubEquation = oneStepEquation('sub');
const sitMulEquation = oneStepEquation('mul');

const sitDivEquationEstimate = withEstimateFirst(
  oneStepEquation('div'),
  'is the whole set larger or smaller than what one group ends up holding?',
);

/**
 * A path of identical flagstones: the total length is stated, one stone is the
 * unknown, and the equation the prompt prints scales that unknown. Solved by the
 * one move that undoes a scaling.
 *
 * No leak by construction: a stone is 30–80 cm, the path holds 4–9 of them, so
 * the answer is larger than every count the prompt states and smaller than the
 * total it states. (The 5 cm step also keeps the totals under a thousand, so no
 * equation prints a thousands separator inside itself.)
 */
const sitEqualFlagstones = situation({
  situationType: 'measurement',
  cognitiveOp: 'alg-one-step-scale',
  draw: (r) => {
    const stones = r.int(4, 9);
    const each = 5 * r.int(6, 16);
    const total = stones * each;
    const name = one(r);
    return {
      prompt: `${name} lays a garden path from ${countNoun(stones, 'flagstones')}, all cut to the same length and set end to end with no gap between them. The finished path measures ${countNoun(total, 'cm')} from the first edge to the last. Solve ${equationText(stones, 0, total)} to find the length of one flagstone.`,
      answerValue: String(each),
      templateId: 'e_alg_one_step_v1',
      params: { op: 'mul', b: stones, c: total },
      units: 'cm',
      hints: [
        'Which is the stated measurement describing — every stone laid together, or a single one of them?',
        'Name what the path does to one stone, then undo exactly that on both sides until a single stone is left by itself.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the two decisions a one-step equation turns on
//
// `whichInverseMove` (the family's, the recipe's own) asks which move UNDOES the
// equation. This one asks the prior question: which equation the situation even
// IS. They attack the same confusion from opposite ends — a child who thinks a
// balance of equal tins is an addition will pick the wrong equation here and the
// wrong inverse there — and together they set up the Day-5 written item, where
// the child has to produce the equation with no options on the page.
// ---------------------------------------------------------------------------

/**
 * The anchor made literal. Identical sealed tins on one arm, weights on the
 * other, and three candidate equations: the scaling the balance performs, the
 * addition a child reads into "several tins", and the division that describes
 * the SOLVING rather than the situation.
 */
const discrimWhichEquation = discrimination({
  variant: 'structural',
  cognitiveOp: 'alg-write-equation',
  draw: (r) => {
    // 3–8 tins of 15–60 g: the arm is never a single tin (where every option
    // would collapse to the same equation) and the total stays under a thousand.
    const tins = r.int(3, 8);
    const each = 5 * r.int(3, 12);
    const total = tins * each;
    return {
      prompt: `An equal-arm balance is level. One arm carries ${countNoun(tins, 'sealed tins')}, every one of them the same mass; the other arm carries ${countNoun(total, 'g')} of weights. Taking x for the mass of one tin, which equation matches the balance?`,
      correct: equationText(tins, 0, total),
      distractors: [
        {
          text: equationText(1, tins, total),
          errorTag: 'concept-misconception',
          rationale: 'Reads the number of tins as an amount joined to the arm, so identical copies of the unknown turn into the unknown plus a fixed weight.',
        },
        {
          text: `x ÷ ${fmtInt(tins)} = ${fmtInt(total)}`,
          errorTag: 'procedure-slip',
          rationale: 'Writes the move that recovers one tin rather than the arrangement the balance is holding, so the equation states the undoing and not the situation.',
        },
      ],
      hints: [
        'What is the balance doing to the unknown mass — joining something to it, or holding copies of it?',
        'Describe the loaded arm in words before you look at the options, then keep the equation whose left side says that same thing.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step: solve, then USE — with the check-back native to each
//
// Both chains open on an inverse, which is what makes them plans rather than
// instructions: in each, the quantity the story hands over is the RESULT of a
// move, so nothing in the sentence order tells the child to undo it first.
// ---------------------------------------------------------------------------

/**
 * The family's E13 chain: recover the starting count from a reported total, then
 * build a second collection from it. Wrapped so the plug-back is asked for by
 * name — an answer that does not rebuild the reported count was never a solution.
 */
const msRecoverThenBuildCheck = withCheckBack(
  msSolveThenCheck(),
  'put the starting amount you recovered back into the first sentence — does it rebuild the count the story reported?',
);

/**
 * A cable winder: the stated time belongs to a whole batch of identical spools,
 * so the opening move is the division that recovers one spool's time, and only
 * then can the new batch be built. INVERSE-START.
 *
 * No leak by construction: one spool takes 10–25 minutes and the new batch is
 * 2–4 spools, so the answer is at least 20 — larger than any count the prompt
 * prints (at most 9) and smaller than the batch time it states (the first batch
 * is always the bigger of the two).
 */
const msSolveThenUse = multiStep({
  situationType: 'rate',
  cognitiveOp: 'alg-solve-then-use',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const perSpool = r.int(10, 25);
    const batch = r.int(5, 9);
    const want = r.int(2, 4);
    const total = perSpool * batch;
    const name = one(r);
    return {
      prompt: `A winding machine filled ${countNoun(batch, 'identical spools')} of cable in ${countNoun(total, 'minutes')}, and every spool takes the same time to fill. ${name} now has an order for ${countNoun(want, 'spools')}. How many minutes will that order take?`,
      initN: total,
      steps: [
        { op: 'div', n: batch, d: 1 },
        { op: 'mul', n: want, d: 1 },
      ],
      units: 'minutes',
      hints: [
        'Is the number of minutes here a measure of one spool, or of everything the machine wound?',
        'Recover what a single spool takes first, then build the new order up from that.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const msSolveThenUseCheck = withCheckBack(
  msSolveThenUse,
  'take one spool\'s time as many times as the first run needed — does it rebuild the total the story states?',
);

/**
 * HAS-DISTRACTOR. A delivery of identical canisters: the equation recovers what
 * one canister holds, and the opened ones are counted from there. The bench
 * count is stated, is never used, and is exactly the number the sentence invites
 * a child to divide by.
 *
 * No leak by construction: a canister holds 12–30 screws and at least two are
 * opened, so the answer is at least 24 — above the canister count (at most 9),
 * the opened count (at most 8) and the bench count (at most 16) — while the
 * delivery total is always larger, since the unopened canisters are real.
 *
 * The bench range starts at 10 for a second reason: a distractor that happens to
 * equal the canister count reads as the same quantity mentioned twice, and the
 * spare number stops looking spare. Disjoint ranges keep it visibly a different
 * thing without a redraw (kit §E2.4).
 */
const msOpenedCanisters = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'alg-solve-then-part',
  posing: 'has-distractor',
  draw: (r) => {
    const canisters = r.int(4, 9);
    const perCanister = r.int(12, 30);
    const opened = r.int(2, canisters - 1);
    const total = canisters * perCanister;
    const benches = r.int(10, 16);
    const name = one(r);
    return {
      prompt: `${name} takes delivery of ${countNoun(canisters, 'identical canisters')} of screws holding ${countNoun(total, 'screws')} altogether, for a workshop with ${countNoun(benches, 'benches')}. ${name} opens ${countNoun(opened, 'canisters')} and leaves the rest sealed. How many screws are in the opened canisters?`,
      initN: total,
      steps: [
        { op: 'div', n: canisters, d: 1 },
        { op: 'mul', n: opened, d: 1 },
      ],
      units: 'screws',
      hints: [
        'Which of the numbers here counts screws, and which one counts something the question never asks about?',
        'Work out what a single canister holds, then take only as many of those as were opened.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * The recipe's Day-5 signature: write the equation from a balance story, solve
 * it, and show the check. Fixed prose, because the demand is on the writing
 * rather than on the arithmetic — and the three parts are named separately so a
 * value with no equation and no check cannot pass as an answer.
 */
const writeTheEquation = reasoning({
  prompt:
    'An equal-arm balance is level. The left arm carries a sealed tin and a 45 g weight. The right arm carries 120 g of weights. Write the equation this balance states, using x for the mass of the tin. Then write the single move that solves it, applied to both arms, and finish with the check: the two sides worked out separately, landing on the same number. All three parts have to be on the page.',
  value:
    'x + 45 = 120; take 45 g off both arms; x = 75; the check gives 75 + 45 = 120 on the left against 120 on the right',
  acceptableForms: ['x + 45 = 120', '75', 'take 45 off both sides', 'subtract 45 from both sides', '75 + 45 = 120'],
  keywords: true,
  hints: [
    'Which arm of this balance carries the unknown, and what is sitting beside it there?',
    'Write each arm as an expression joined by an equals sign, then take the same amount off both of them.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim that separates LEGAL from USEFUL — the exact ground the week's named
 * misconception stands on. Adding the equation's own number to both sides is a
 * perfectly legal move that leaves the unknown no closer to standing alone.
 */
const legalIsNotProgress = classify({
  prompt:
    'Always, sometimes, or never true: applying the same move to both sides of an equation brings the unknown closer to standing alone. In one sentence, name the moves your verdict holds for.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Treats every legal move as progress, which is the reasoning behind repeating an equation\'s own move on both sides — the balance survives it and the unknown does not come free.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Over-corrects into denying that any move helps, which throws away the one move — the inverse — that the whole method is built on.',
    },
  ],
  hints: [
    'Is every move that keeps an equation true also a move that gets you somewhere?',
    'Try a legal move that leaves the unknown exactly as boxed in as before, then try the one that frees it, and see whether a single verdict covers both.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE13 = makeWeekBuilder({
  level: 'E',
  week: 13,
  conceptId: 'one-step-equations',
  conceptName: 'One-step equations',
  strandTags: ['algebra-geometry', 'addition-subtraction'],
  prerequisiteWeeks: [B6, D2, E11],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the balance that must stay level',
  conceptFamily: 'operation',
  deepeningDelta:
    'B6 asked whether an equals sign was telling the truth: both sides were fully written out, and the child\'s job was to judge. E11 wrote expressions containing a variable and evaluated them at values the item supplied. E13 joins the two and reverses the demand: one side now carries an unknown, the sentence is asserted TRUE, and the child has to find the single value that makes it so — then prove it by substituting that value back, which is E11\'s evaluation turned into evidence rather than exercise.',
  explanation: {
    hook:
      'Two arms of a balance sit level. Lift a weight off one of them and the beam swings — not because the maths changed, but because the sentence you were reading stopped being true. Everything this week is about is what you are allowed to do to a true sentence.',
    whyBeforeHow:
      'An equation is a claim that two amounts are the same amount, written two different ways. Solving one is not hunting for a number; it is removing whatever has been done to the unknown, and the removal has to happen on both sides at once, because the moment one side is changed alone the claim stops being true. That is why we work with the balance that must stay level: whatever is lifted off one arm is lifted off the other, whatever is added to one arm is added to the other, and the beam never moves. A one-step equation does exactly one thing to the unknown — it adds, it subtracts, it scales, it shares — so exactly one move undoes it, and the move that undoes it is its inverse. Repeating the equation\'s own move is legal, keeps the beam level, and gets you nowhere. And because the two sides were equal before your move and equal after it, the value you reach can be put back into the equation you started from and made to balance. That check is not a chore added to the end of the work. It is the only evidence that the number you wrote is the number the equation was talking about.',
    script: [
      {
        say: 'Watch a level balance while I take something off it. The left arm holds a sealed box and 40 g of weights; the right arm holds 70 g; the beam is level. I want that box standing alone, so I lift the 40 g off the left arm — and the instant I do, that arm is lighter and the beam tips. So I lift 40 g off the right arm as well. Both arms lost the same amount, the beam is level again, and now it tells me plainly: the box is 30 g.',
        visual: 'The two arms before the lift, drawn to one scale: the box and its weights against the single block of weights opposite.',
        figure: barModel(
          [
            { label: 'the left arm: the box and the weights', segments: [{ value: 30, label: 'the box' }, { value: 40, label: '40' }], total: '70' },
            { label: 'the right arm', segments: [{ value: 70, label: '70' }], total: '70' },
          ],
          { scaleMax: 70, alt: 'two bars of equal length: the left made of a 30 block for the box and a 40 block for the weights, the right a single 70 block' },
        ),
      },
      {
        say: 'Now the move that looks like work and is not. Some students see the 40 sitting there and add 40 to both arms. Nothing illegal happens — the left arm becomes the box with 80 g, the right becomes 110 g, and the beam stays perfectly level. But look at the box: it is buried under more weight than before, not less. Repeating a move never undoes it. Only its inverse does.',
        visual: 'The same two arms after adding to both, still level, with the box no nearer to standing alone.',
        figure: barModel(
          [
            { label: 'the left arm after adding to it', segments: [{ value: 30, label: 'the box' }, { value: 80, label: '80', fill: 'hatch' }], total: '110' },
            { label: 'the right arm after adding to it', segments: [{ value: 110, label: '110' }], total: '110' },
          ],
          { scaleMax: 110, alt: 'two bars of equal length again, the left now a 30 block for the box under an 80 block, the right a single 110 block' },
        ),
      },
      {
        say: 'A balance can also be undone by sharing. Five identical sealed tins on the left, 60 g of weights on the right, level. One tin is a fifth of what the left arm carries, so I take a fifth of the right arm too, and the beam holds. The rule has not changed at all — the same move, both arms. Only the move itself is different: this one is a division, because the equation scaled the unknown instead of adding to it.',
        visual: 'The five equal tins against the block of weights, with the fifth part of each side marked off.',
        figure: barModel(
          [
            { label: 'the left arm: five identical tins', segments: [{ value: 12 }, { value: 12 }, { value: 12 }, { value: 12 }, { value: 12 }], total: '60' },
            { label: 'the right arm', segments: [{ value: 60, label: '60' }], total: '60' },
          ],
          { scaleMax: 60, alt: 'a bar of five equal 12 blocks for the tins beside a single 60 block for the weights, the two bars the same length' },
        ),
      },
      {
        say: 'One habit before any of the arithmetic, and one after. Before: I work out roughly how big the answer has to be. If something was taken off the unknown, what is left is the smaller of the two, so the start has to be the larger — an answer below what was left cannot be right, whatever my working says. After: I put my value back into the equation I started from and work out each side on its own. If the two sides land on the same number, the check is done. If they do not, I have not failed to check my answer — I have found my mistake.',
        visual: 'The starting amount beside what is left of it after the subtraction, drawn to one scale.',
        figure: barModel(
          [
            { label: 'the amount at the start', segments: [{ value: 37, label: '37' }], total: '37' },
            { label: 'what is left once 12 is taken off', segments: [{ value: 25, label: '25' }] },
          ],
          { scaleMax: 37, alt: 'a bar of 37 for the starting amount beside a shorter bar of 25 for what remains after 12 is taken off' },
        ),
      },
    ],
    summary:
      'An equation claims that two amounts are equal, and every move you make has to keep that claim true — which means every move lands on both sides at once. A one-step equation does exactly one thing to the unknown, so undoing it takes exactly one inverse move: subtraction undoes addition, addition undoes subtraction, division undoes multiplication, multiplication undoes division. Repeating the equation\'s own move is legal and useless. Finish by putting your value back into the equation you started from: if both sides come out the same, the value is the one the equation was talking about.',
    vocabulary: [
      { term: 'equation', kidGloss: 'a statement that two expressions name the same number' },
      { term: 'solution', kidGloss: 'the value of the variable that makes an equation a true statement' },
      { term: 'inverse operation', kidGloss: 'the operation that undoes another: subtraction undoes addition, division undoes multiplication' },
      { term: 'both sides', kidGloss: 'the rule that any move made to one side of an equation must be made to the other, so the statement stays true' },
      { term: 'substitution', kidGloss: 'putting a value in place of the variable, which is how a solution is checked' },
    ],
  },
  guidedExamples: [
    {
      ...ge(13, 1, 'modeled', 'Solve x + 26 = 71, then check the value you find.', [
        {
          teacherSay:
            'Let me read what this equation is doing before I do anything to it. Something unknown has had 26 joined to it, and the result of that joining is 71. So my question is not what 26 and 71 make between them — it is what was standing there before the 26 arrived.',
        },
        {
          teacherSay:
            'Addition is undone by subtraction, so I take 26 off the left side. That alone would break the statement, so I take 26 off the right side in the same breath. What is the right side left holding?',
          expected: '45',
        },
        {
          childDo: 'Put that value in place of x in the equation we started with, and work the left side out on its own.',
          expected: '71',
        },
      ], '45'),
      visual: 'The whole and the joined part drawn to one scale; the gap between them is what the equation is asking for.',
      figure: barModel(
        [
          { label: 'the amount after 26 was joined', segments: [{ value: 45, label: '45' }, { value: 26, label: '26' }], total: '71' },
          { label: 'the amount that was joined', segments: [{ value: 26, label: '26' }] },
        ],
        { scaleMax: 71, alt: 'a bar of 71 split into a 45 part and a 26 part, beside a shorter bar of 26 for the amount joined' },
      ),
    },
    {
      ...ge(13, 2, 'completion', 'A number is multiplied by 7, and the result is 91. Write the equation and solve it.', [
        {
          teacherSay: 'Which operation has been done to the unknown here, and which single operation undoes that one?',
          expected: 'multiplication, undone by division',
        },
        {
          childDo: 'Write the equation, divide both sides by 7, then multiply your value by 7 and hold the product against 91.',
          expected: '13',
        },
      ], '13'),
      visual: 'Seven equal parts making up the stated total; one part is the unknown.',
      figure: barModel(
        [
          { label: 'seven equal groups', segments: [{ value: 13 }, { value: 13 }, { value: 13 }, { value: 13 }, { value: 13 }, { value: 13 }, { value: 13 }], total: '91' },
        ],
        { scaleMax: 91, alt: 'a bar of 91 divided into seven equal parts of 13' },
      ),
    },
    ge(13, 3, 'prompted', 'Solve x − 18 = 34, and show the check.', [
      {
        childDo: 'Name the move the equation makes on the unknown, apply its inverse to both sides, then test your value in the original equation.',
        expected: '52',
      },
    ], '52'),
    {
      // Independent stage: the givens only. Deciding that the stated amount is
      // one SHARE rather than the whole is the task here, so a picture of the
      // whole set would hand over the plan the item exists to ask for (L33).
      ...ge(13, 4, 'independent', 'A crate of seed trays is shared equally between 6 benches, and each bench ends with 14 trays. Write an equation for the number of trays in the crate, solve it, and show the check. Solve cold.', [
        { childDo: 'Decide first whether the number you were given is the whole crate or one bench\'s share, then write the equation that says so.', expected: '84' },
      ], '84'),
      visual: 'One bench\'s share only. The crate is yours to work out.',
      figure: barModel(
        [
          { label: 'what one bench ends with', segments: [{ value: 14, label: '14' }] },
        ],
        { scaleMax: 14, alt: 'a single bar of 14 for one bench\'s share; the crate is not drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: one move, undone, in three dresses (a joining, a
    // removal, a scaling). Single-step only; no chain and no choice yet.
    [
      { gen: wEvaluate, diff: 2 },
      { gen: wSubtract, diff: 2 },
      { gen: wDivide, diff: 2 },
      { gen: sitEqualFlagstones, diff: 3 },
      { gen: sitAddEquation, diff: 3 },
      { gen: sitSubEquation, diff: 3 },
    ],
    // Day 2 — fluency + application: both discriminations (which equation, which
    // inverse) against the solving itself, and the estimate-first division.
    [
      { gen: wProduct, diff: 2 },
      { gen: wSubtract, diff: 2 },
      { gen: whichInverseMove(), diff: 3 },
      { gen: sitDivEquationEstimate, diff: 3 },
      { gen: sitMulEquation, diff: 3 },
      { gen: discrimWhichEquation, diff: 4 },
    ],
    // Day 3 — interleave: the two check-back chains sit between single-step
    // solving and the two traps, so nothing on the page signals which is coming.
    [
      { gen: wDivide, diff: 2 },
      { gen: whichInverseMove(), diff: 3 },
      { gen: msRecoverThenBuildCheck, diff: 4 },
      { gen: sitMulEquation, diff: 3 },
      { gen: msSolveThenUseCheck, diff: 4 },
      { gen: discrimWhichEquation, diff: 3 },
    ],
    // Day 4 — word problems: three chains (two inverse-start with the check
    // named, one carrying a quantity that must be left unused) plus two
    // single-step items, so "it must be multi-step" never becomes the cue.
    [
      { gen: msRecoverThenBuildCheck, diff: 5 },
      { gen: msSolveThenUseCheck, diff: 5 },
      { gen: msOpenedCanisters, diff: 4 },
      { gen: sitDivEquationEstimate, diff: 4 },
      { gen: sitEqualFlagstones, diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, the balance
    // story written as an equation and checked, and the claim that separates a
    // legal move from a useful one (+ a ramped warm-up).
    [
      { gen: wEvaluate, diff: 2 },
      { gen: eaWrongInverse(), diff: 4 },
      { gen: writeTheEquation, diff: 3 },
      { gen: legalIsNotProgress, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the mistake worth watching for this week is not carelessness — it is a child doing something perfectly legal. Faced with a number joined to the unknown, they add that number to both sides. The equation stays true, so nothing warns them, and they are further from the answer than when they started. If you see it, do not correct the arithmetic. Ask what the equation is doing to the unknown, and what would undo it.',
  ],
  puzzle: (r) => {
    // The week's own move run BACKWARDS: instead of solving an equation to reach
    // a value, build the equations a value already solves. Each right-hand number
    // is the stated move applied to the solution itself.
    const share = r.int(2, 5);
    const part = r.int(11, 25);
    const solution = share * part;          // divisible by `share`, so the fourth equation is exact
    const joined = r.int(2, 9);
    const removed = r.int(2, 9);
    const scale = r.int(2, 5);
    // Every answer exceeds 9, and each stated operand is at most 9 — so no
    // right-hand number the puzzle asks for is already printed in it.
    return {
      id: 'E13-PZ-01',
      title: 'Puzzle Grove: Four Equations, One Answer',
      puzzleType: 'construction',
      prompt: `Four different one-step equations all have the same solution: x = ${fmtInt(solution)}. In the first, ${fmtInt(joined)} is joined to the unknown. In the second, ${fmtInt(removed)} is taken off it. In the third, the unknown is multiplied by ${fmtInt(scale)}. In the fourth, the unknown is divided by ${fmtInt(share)}. Each equation ends with a single number on its right-hand side. Write those four numbers, first to fourth. Then say in one sentence what all four equations share that the four numbers on their right do not show.`,
      answer: {
        value: `${solution + joined}, ${solution - removed}, ${scale * solution}, ${solution / share}`,
        acceptableForms: [
          `${solution + joined} ${solution - removed} ${scale * solution} ${solution / share}`,
          `${solution + joined}, ${solution - removed}, ${scale * solution}, ${solution / share}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'What has to be true of a number before it can be called the solution of an equation?',
        'Take each stated move and do it to the solution itself; whatever that produces is the number standing on the right.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'alg-build-from-solution' },
  sprint: {
    skill: 'Subtraction within 100 — the inverse move most of this week\'s equations ask for',
    sourceWeek: D2,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 21, max: 99, regroup: 'mixed' },
  },
  mastery: [
    { gen: sitEqualFlagstones, diff: 3 },
    { gen: msRecoverThenBuildCheck, diff: 4 },
    { gen: sitMulEquation, diff: 3 },
    { gen: msSolveThenUseCheck, diff: 4 },
    { gen: sitAddEquation, diff: 3 },
    { gen: msOpenedCanisters, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step equations — a scaling equation in a measurement frame (the flagstone path), a scaling equation posed as equal groups, and an additive equation carrying the family\'s part-and-whole picture. 02/04/06: chains — recover a starting count from a reported total and build a second collection from it (inverse-start, check-back named), recover one unit\'s time from a batch and rebuild a new batch (inverse-start, check-back named), and recover what one container holds while a stated quantity goes deliberately unused. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'repeats-the-move',
      description: 'Applies the equation\'s own move to both sides instead of its inverse — adding where the equation adds, multiplying where it multiplies. The move is legal and the equation stays true, so nothing signals the error; the unknown is simply further from standing alone than it was.',
      exampleWrongAnswer: 'x + 8 = 23 solved by adding 8 to both sides, giving x = 31',
      distractorRationale: 'Offer the value the equation\'s own move genuinely produces on the stated total, which is what a child who reads "do the same to both sides" as the whole rule will write.',
      reteachPointer: 'explanation/script[1] (legal, level, and no nearer the answer) beside script[0] (the inverse lifts the same amount off both arms)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'wrong-inverse-family',
      description: 'Chooses an inverse from the wrong operation family: divides to undo an addition, or subtracts to undo a scaling. The child has learned that solving means undoing, but reads the equation\'s join as multiplicative or its scaling as additive.',
      exampleWrongAnswer: 'x + 6 = 42 answered as 7, by dividing both sides by 6',
      distractorRationale: 'Offer the move that undoes the OTHER operation on the same stated number, so only a reading of what the equation actually does to the unknown separates it from the correct move.',
      reteachPointer: 'guidedExamples/E13-GE-02 (which operation was done, and which single one undoes it), then explanation/script[2]',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-before-the-check',
      description: 'Produces a value and stops, treating the substitution as an optional extra rather than the evidence that the value solves the equation — so an arithmetic slip in the middle of a chain travels all the way to the answer unchallenged.',
      exampleWrongAnswer: 'a recovered starting amount used to build a second total, with no line putting it back into the sentence it came from',
      distractorRationale: 'Offer the result of a chain whose first move went the wrong way, which survives every later step and is caught only by substituting back.',
      reteachPointer: 'explanation/script[3] (the habit before, and the habit after), then guidedExamples/E13-GE-01',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'uses-every-number',
      description: 'Consumes every quantity the story states, including one that belongs to the setting rather than to the question, so a spare number is folded into the working as an extra division or an extra step.',
      exampleWrongAnswer: 'the screws in the opened canisters divided again between the benches in the room',
      distractorRationale: 'Offer the value that follows from using the stated quantity that the question never asks about.',
      reteachPointer: 'guidedExamples/E13-GE-04 (decide what the given number is BEFORE writing the equation), then the Day-4 word problems',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'One-step equations — reading an equation as a statement that two amounts are equal, undoing the single operation done to the unknown by applying its inverse to both sides, telling that inverse apart from a repeat of the original move, and proving every answer by putting it back into the equation it came from.',
    improvingCandidates: [
      'naming what an equation does to the unknown before choosing a move',
      'applying the inverse to both sides in one step',
      'checking a solution by substituting it back into the original equation',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'undoing a move rather than repeating it — the balance pictures show why a repeat is allowed and still gets nowhere',
      },
      {
        errorTag: 'procedure-slip',
        text: 'matching the inverse to the operation family: subtraction for a joining, division for a scaling',
      },
      {
        errorTag: 'task-comprehension',
        text: 'finishing with the substitution check, so a slip is caught on the page rather than carried to the answer',
      },
      {
        errorTag: 'representation-misread',
        text: 'deciding which stated quantities the question actually needs, and leaving the others alone',
      },
    ],
    homeFocus: {
      praiseLine:
        'You named the move the equation had made before you touched it, and you checked your value by putting it back in — that is the pair of habits the whole week rests on.',
      questionForChild: 'If I tell you that some number with 9 added to it comes to 40, what is the number, and how could you prove to me that you are right?',
      schoolSyncHook: 'If your child\'s class writes the check as a separate line, as a substitution in brackets, or not at all, tell us and we will match what they use.',
    },
    vocabularyForParent: [
      'equation (a statement that two expressions name the same number)',
      'inverse operation (the operation that undoes another)',
      'solution (the value that makes the equation true — and substituting it back is how you prove it)',
    ],
  },
});
