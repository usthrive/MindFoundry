/**
 * Level E · Week 14 — "Two-step equations" (conceptId: two-step-equations).
 *
 * FILL-ARCHITECTURE §6 row E14: anchor "undo in REVERSE order"; multi-step
 * native to the concept; error-analysis "divides before un-adding";
 * discrimination "which move first"; Day-5 signature "one equation, two
 * solution paths".
 *
 * THE WEEK'S CLAIM, and it is sharper than "reverse order". E13 established
 * that a move is legal when it lands on both sides. E14 hands the child an
 * expression built by TWO moves and asks which comes off first — and the honest
 * answer is that the order is a matter of reliability, not of law:
 *
 *  - Peeling in reverse (take the loose amount off, then undo the scaling)
 *    always works, because the last move made is the first one available.
 *  - Dividing first ALSO works — but only if the division reaches every term on
 *    both sides. `4x + 12 = 40` divided through becomes `x + 3 = 10`, and the
 *    12 became a 3 on the way.
 *  - The week's named slip lives exactly in the gap between those two: the child
 *    divides the total by the multiplier and then takes the loose amount off
 *    what that leaves. `40 ÷ 4 = 10`, then `10 − 12`. The division touched the
 *    total and the scaled part, and walked past the 12 as if it were not there.
 *
 * So the lesson does not teach "reverse order" as a decree. It shows the reverse
 * peel as the route that cannot go wrong, shows the divide-first route working
 * when the division is complete, and puts the slip beside them as the case where
 * a side was divided in pieces. That is also why the Day-5 signature is worth
 * its place: a child who can run both paths to the same answer has understood
 * what the multiplier is attached to, which is the thing the slip misreads.
 *
 * FOUR AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. THE MISSING TRANSFORM WAS ADDED, NOT ROUTED AROUND. E14's recipe names a
 *     verify-backed error-analysis, and `errorAnalysis` refuses an authored
 *     wrong value — it recomputes both numbers from a registered transform. No
 *     transform existed for a step-order slip (the kit records the gap, and two
 *     earlier weeks relocated their error-analysis because of it), so E14 was
 *     the only cell in the E10–E15 run whose named misconception had no home.
 *     `e_alg_verify_step_order_v1` now computes it: `(c − b)/a` against
 *     `c/a − b`, both exact, differing by `b(a − 1)/a`. This is the same call
 *     `verifyMisgroup` records making for E11, for the same reason — the
 *     recipe's intended item beats a borrowed one. The library gap that remains
 *     is the OPERAND swap, and it is untouched by this.
 *
 *  2. THE SLIP'S ARITHMETIC CONSTRAINS THE DRAW, AND THE CHILD CANNOT SEE IT.
 *     `c/a − b` is only a whole number when the multiplier divides the total,
 *     which (given `c = a·x + b`) means it must divide the loose amount too. So
 *     the error-analysis draws `b` as a multiple of `a`. `3x + 12 = 42` is an
 *     entirely ordinary equation; nothing on the page hints that its numbers
 *     were chosen so a wrong answer would come out whole. Every other equation
 *     the week ships is unconstrained.
 *
 *  3. THE ESTIMATE-FIRST GENERATOR IS REACHABLE ONLY THROUGH ITS WRAPPER (kit
 *     §E2.2). The river-trip situation is served exclusively through
 *     `withEstimateFirst`, so its ladder is spent once rather than twice. It is
 *     the right shape for an estimate: a fixed charge plus a charge per person
 *     is the one place where committing to a size before any arithmetic rules
 *     the two-step slip out — the slip's value and the true count fall on
 *     opposite sides of the boundary the probe asks about.
 *
 *  4. ANSWER-IN-PROMPT AUDIT, done by construction, argued per generator. The
 *     family's `twoStepEquation`, `whichMoveFirst` and `msTwoStepUndo` clear
 *     their solutions with `clearOf`. The four local generators clear theirs by
 *     range: a cut length of guttering is at least 12 cm while the cuts number
 *     at most 9; a ticket costs at least 11 while the booking fee is at most 9;
 *     a storage unit holds at least 14 crates while the yard has at most 9
 *     units; a craft box holds at least 15 skeins while the shelves number at
 *     most 8. No draw prints the number it asks for.
 *
 *     The three local frames were re-dressed at the END of the week, not the
 *     start (kit §E2.8): the first drafts cut a RIBBON (twenty-two sibling
 *     weeks already use one), hired a COACH (e03 fills one with passengers) and
 *     counted MOSAIC pieces (e10 builds a mosaic border on this very a·x + b
 *     shape). None of those was a mathematical collision; all three were the
 *     repeated real-world scene L24 warns about.
 *
 * Retrieval reaches back to the four skills a two-step equation runs on: E13's
 * single undo (the move this week performs twice), E11's evaluation (the check),
 * D2 subtraction and D16 exact division (the two inverses themselves). The E13
 * warm-up is deliberately the SUBTRACTION shape — the first move of every
 * reverse peel this week asks for.
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
  eaStepOrder,
  equationText,
  evaluateAtX,
  msTwoStepUndo,
  oneStepEquation,
  twoStepEquation,
  whichMoveFirst,
} from '../lib/algebra';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D2 = { level: 'D' as const, week: 2 };
const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };
const E11 = { level: 'E' as const, week: 11 };
const E13 = { level: 'E' as const, week: 13 };

const NAMES = ['Ines', 'Otto', 'Rafi', 'Suki', 'Dara', 'Milo', 'Freya', 'Jonas', 'Nadia', 'Emre', 'Talia', 'Bruno'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §F.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * E13 — the single undo, in its subtractive shape.
 *
 * The shape is chosen, not drawn: the first move of every reverse peel this
 * week performs is "take the loose amount off both sides", so the warm-up is
 * that move standing alone, one week after it was the whole lesson.
 */
const wOneStep = asWarmup(oneStepEquation('add'), E13);
/** E11 — evaluate at a value: the substitution both solution paths finish with. */
const wEvaluate = asWarmup(evaluateAtX(), E11);
/**
 * D2 — subtraction fluency, the first inverse.
 *
 * The window keeps the top under twice the floor for the reason E13 records:
 * `subWhole` draws both operands from one range and orders them, so a wider
 * window can print `294 − 147`, whose answer is already sitting beside it.
 */
const wSubtract = asWarmup(subWhole(420, 780), D2);
/**
 * D16 — exact division, the second inverse. Divisor and quotient ranges are
 * disjoint so the two can never coincide and print `144 ÷ 12` in a week whose
 * subject is not reading an answer off the page.
 */
const wDivide = asWarmup(divideExact(3, 9, 12, 19), D16);
/** D15 — the product, so undoing a scaling never stalls on the multiplication. */
const wProduct = asWarmup(multiply(4, 12, 5, 20), D15);

// ---------------------------------------------------------------------------
// The two-step equation in three frames
//
// The family's generator carries the bare shape (`multi-stage`). These two put
// the same structure into a measurement and a rate, because a child who can
// only solve the shape when it is written as a shape has learned a layout.
// ---------------------------------------------------------------------------

/**
 * A run of guttering cut into equal lengths with an offcut left over: the total
 * is stated, and one length is the unknown. MEASUREMENT.
 *
 * The frame is deliberately not a ribbon: twenty-two sibling weeks already cut,
 * compare or measure one (kit §E2.8), and a repeated real-world scene is the
 * corpus's documented weakness even when the mathematics underneath differs.
 *
 * No leak by construction: a length is 12–40 cm, the cut count is at most 9 and
 * the offcut at most 9 cm, so the answer is larger than every count and every
 * remnant the prompt prints, and smaller than the total it states.
 */
const sitGutteringLengths = situation({
  situationType: 'measurement',
  cognitiveOp: 'alg-two-step',
  draw: (r) => {
    const pieces = r.int(3, 9);
    const each = r.int(12, 40);
    const tail = r.int(2, 9);
    const total = pieces * each + tail;
    const name = one(r);
    return {
      prompt: `${name} cuts ${countNoun(pieces, 'equal lengths')} from a run of guttering and is left with an offcut of ${countNoun(tail, 'cm')}. The whole run measured ${countNoun(total, 'cm')} before any cut was made. Solve ${equationText(pieces, tail, total)} to find one cut length.`,
      answerValue: String(each),
      templateId: 'e_alg_two_step_v1',
      params: { a: pieces, b: tail, c: total },
      units: 'cm',
      hints: [
        'Is the offcut one of the equal lengths, or is it what was left once they were cut?',
        'Set the leftover aside from both sides first, and see how much of the run the equal lengths themselves account for.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

/**
 * A booking that charges once and then per ticket. RATE.
 *
 * No leak by construction: a ticket is 11–45 while the booking fee is 2–9 and
 * the ticket count at most 9, so the answer clears every other number printed
 * except the total, which is always larger.
 */
const sitTicketWindow = situation({
  situationType: 'rate',
  cognitiveOp: 'alg-two-step',
  draw: (r) => {
    const tickets = r.int(3, 9);
    const each = r.int(11, 45);
    const fee = r.int(2, 9);
    const total = tickets * each + fee;
    const name = one(r);
    return {
      prompt: `${name} books ${countNoun(tickets, 'tickets')} for a concert. Every ticket costs the same, and the window adds a single booking fee of ${countNoun(fee, 'credits')} to the order, not one fee per ticket. The order came to ${countNoun(total, 'credits')}. Solve ${equationText(tickets, fee, total)} to find the price of one ticket.`,
      answerValue: String(each),
      templateId: 'e_alg_two_step_v1',
      params: { a: tickets, b: fee, c: total },
      units: 'credits',
      hints: [
        'How many times does the booking fee appear in this order — once, or once for every ticket?',
        'Take the charge that was only made once off both sides, then share what is left between the tickets.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * Crates shared between storage units, with a few crates kept back. PART-WHOLE.
 *
 * No leak by construction: a unit takes 14–60 crates while the units number at
 * most 9 and the kept-back count at most 12.
 */
const sitStorageUnits = situation({
  situationType: 'part-whole',
  cognitiveOp: 'alg-two-step',
  draw: (r) => {
    const units = r.int(3, 9);
    const each = r.int(14, 60);
    const kept = r.int(4, 12);
    const total = units * each + kept;
    const name = one(r);
    return {
      prompt: `A depot holds ${countNoun(total, 'crates')}. ${name} fills ${countNoun(units, 'storage units')} with the same number of crates in each and keeps ${countNoun(kept, 'crates')} back on the loading floor. Solve ${equationText(units, kept, total)} to find how many crates went into one unit.`,
      answerValue: String(each),
      templateId: 'e_alg_two_step_v1',
      params: { a: units, b: kept, c: total },
      units: 'crates',
      hints: [
        'Which of the crates in this depot are sitting inside the units, and which are not?',
        'Account for the crates that never went into a unit first, then share the rest equally.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * A river trip: one fixed charge for the guide, plus a charge for each paddler.
 * Served ONLY through the estimate-first wrapper (decision 3).
 *
 * Not a coach, deliberately — e03 already fills one with passengers and counts
 * its seats, and two Level-E weeks sharing a vehicle is the collision kit §E2.8
 * asks every author to scan for before reporting done.
 *
 * The estimate is the point. The two-step slip on this frame produces a value
 * that a child who has decided "somewhere around a dozen people" will refuse
 * before doing any arithmetic, which is what an estimate is FOR.
 *
 * THE PROBE HAD TO BE MEASURED, NOT REASONED ABOUT (kit §E2.9a). Its first
 * version asked whether the answer was nearer five or nearer fifty over a count
 * drawn 6–24 — so "nearer five" was correct on every single draw, and the
 * scaffold taught the guess instead of the commitment it exists to demand. No
 * gate can see that: a probe has no answer key. The count now straddles a dozen
 * and the boundary value itself is never drawn, over a window carrying eight
 * values on each side of it; the served figure is measured rather than assumed
 * from the draw, because a balanced draw can still reach the page unbalanced
 * once the freshness guard sits between them.
 *
 * No leak by construction, and without a nudge: the fare is 21–39 while the
 * paddler count is at most 20, so the two ranges cannot meet, and the hire
 * charge is a multiple of ten no smaller than 40.
 */
const sitKayakTrip = situation({
  situationType: 'rate',
  cognitiveOp: 'alg-two-step',
  draw: (r) => {
    const perHead = r.int(21, 39);
    const drawn = r.int(4, 20);
    // Never sit ON the boundary the probe asks about — a child cannot commit to
    // "below" or "above" when the truth is neither.
    const paddlers = drawn === 12 ? 13 : drawn;
    const hire = 10 * r.int(4, 15);
    const total = paddlers * perHead + hire;
    const name = one(r);
    return {
      prompt: `A river centre charges ${countNoun(hire, 'credits')} for the guide, whatever the size of the party, and every paddler pays a further ${countNoun(perHead, 'credits')} for a kayak. ${name}'s group was charged ${countNoun(total, 'credits')} in all. Solve ${equationText(perHead, hire, total)} to find how many paddlers went out.`,
      answerValue: String(paddlers),
      templateId: 'e_alg_two_step_v1',
      params: { a: perHead, b: hire, c: total },
      units: 'paddlers',
      hints: [
        'Does the guide\'s charge depend on how many people went out?',
        'Separate the charge that would stand for a party of one, then see how many kayaks the rest covers.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const sitKayakTripEstimate = withEstimateFirst(
  sitKayakTrip,
  'will the number of paddlers come out below a dozen, or above a dozen?',
);

// ---------------------------------------------------------------------------
// Discrimination — the two decisions the week turns on
//
// The family's `whichMoveFirst` asks which move to make. This one asks the
// question underneath it: what a division has to REACH before it is a legal
// move on a side. Together they separate "wrong order" from "incomplete
// division", which is the distinction the week's named slip depends on.
// ---------------------------------------------------------------------------

/**
 * Three first lines, all produced by dividing. One divided every term, one
 * divided the total only, one divided the scaled part only. The child picks the
 * line that is still the same equation.
 *
 * `b` is a multiple of `a` here so that the complete division prints whole
 * numbers — otherwise the correct option would be the only one carrying a
 * fraction, and the page could be answered on the shape of the numerals.
 */
const discrimWholeSideDivided = discrimination({
  variant: 'structural',
  cognitiveOp: 'alg-two-step',
  draw: (r) => {
    const a = r.int(2, 6);
    const k = r.int(2, 9);
    const b = a * k;
    const x = r.int(3, 15);
    const c = a * x + b;
    return {
      prompt: `${equationText(a, b, c)} is divided by ${fmtInt(a)} on both sides as the first move. Which line is still the same equation?`,
      correct: `x + ${fmtInt(k)} = ${fmtInt(c / a)}`,
      distractors: [
        {
          text: `x + ${fmtInt(b)} = ${fmtInt(c / a)}`,
          errorTag: 'procedure-slip',
          rationale: 'Divides the scaled part and the total but carries the loose amount across untouched, which is the arithmetic behind the week\'s named slip written out as a line.',
        },
        {
          text: `x + ${fmtInt(k)} = ${fmtInt(c)}`,
          errorTag: 'concept-misconception',
          rationale: 'Divides everything on the left and leaves the right side whole, so the move lands on one side only and the two sides stop naming the same amount.',
        },
      ],
      hints: [
        'When a side is divided, how much of that side has to be divided for the sentence to still be true?',
        'Take each term on both sides in turn and ask whether the division reached it.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — the chains, both opening on an inverse
// ---------------------------------------------------------------------------

/**
 * The family's E14 chain (a joining fee then a per-session charge), wrapped so
 * the plug-back is asked for by name. INVERSE-START + CHECK-BACK.
 */
const msTwoStepUndoCheck = withCheckBack(
  msTwoStepUndo(),
  'put your count back through the charges — does it rebuild the total the story states?',
);

/**
 * HAS-DISTRACTOR. Craft boxes filled equally from a delivery, with a few skeins
 * set aside and a shelf count that is never used — and the shelf count is
 * exactly the number the sentence invites a child to divide by.
 *
 * No leak by construction: a box holds 15–48 skeins while the boxes number at
 * most 8, the set-aside count at most 12 and the shelves at most 8; the
 * delivery total is always larger than one box's contents.
 */
const msCraftBoxes = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'alg-two-step-part',
  posing: 'has-distractor',
  draw: (r) => {
    const boxes = r.int(3, 8);
    const perBox = r.int(15, 48);
    const held = r.int(4, 12);
    const shelves = r.int(3, 8);
    const total = boxes * perBox + held;
    const name = one(r);
    return {
      prompt: `${name} unpacks a delivery of ${countNoun(total, 'yarn skeins')} in a studio with ${countNoun(shelves, 'shelves')}. ${countNoun(held, 'skeins')} are set aside for the sample cards and every remaining skein is shared equally between ${countNoun(boxes, 'craft boxes')}. How many skeins go into one craft box?`,
      initN: total,
      steps: [
        { op: 'sub', n: held, d: 1 },
        { op: 'div', n: boxes, d: 1 },
      ],
      units: 'skeins',
      hints: [
        'Which numbers here count skeins, and which one counts something the question never asks about?',
        'Settle what is left once the sample cards are taken out, then share only that between the boxes.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * The recipe's Day-5 signature: one equation, both routes, same answer. Fixed
 * prose, because the demand is on running two methods and comparing them rather
 * than on the arithmetic — and each route is named separately so a single
 * solution with no second path cannot pass as an answer.
 *
 * The numbers are chosen so the divide-first route stays whole (36 ÷ 4 = 9,
 * 20 ÷ 4 = 5): the point of the item is that both routes are available, and a
 * fraction appearing on one of them would argue the opposite.
 */
const twoPaths = reasoning({
  prompt:
    'Solve 4x + 20 = 36 twice. First, take the loose amount off both sides and then undo the scaling. Second, start by dividing both sides by 4 — every term on both sides — and finish from there. Write both routes out, state the value each one reaches, and say in one sentence what the second route had to do to the 20 that the first route never did.',
  value:
    'x = 4 by both routes; the first gives 4x = 16 then x = 4; the second gives x + 5 = 9 then x = 4; dividing every term turned the 20 into 5',
  acceptableForms: ['4', 'x = 4', '4x = 16', 'x + 5 = 9', 'the 20 became 5', '20 ÷ 4 = 5'],
  keywords: true,
  hints: [
    'Before you divide anything, ask what the multiplier is attached to and what it is not attached to.',
    'Run the first route to its answer, then start again from the original equation and divide every term on both sides.',
  ],
  errorTags: ['concept-misconception', 'procedure-slip'],
});

/**
 * The claim that separates the ORDER from the COMPLETENESS — the exact ground
 * the named slip stands on. Dividing first is not the error; dividing part of a
 * side is.
 */
const dividingFirstClaim = classify({
  prompt:
    'Always, sometimes, or never true: on a two-step equation, dividing both sides by the multiplier before anything else gets you to the right answer. In one sentence, name what has to be true of that division for your verdict to hold.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'never',
      errorTag: 'concept-misconception',
      rationale: 'Reads "undo in reverse order" as a law rather than as the route that cannot go wrong, so a complete division of every term — which is perfectly legal and reaches the same answer — is ruled out with the slip.',
    },
    {
      text: 'always',
      errorTag: 'procedure-slip',
      rationale: 'Treats dividing first as safe however it is carried out, which is precisely the reading that lets a child divide the total and walk past the loose amount.',
    },
  ],
  hints: [
    'Is the multiplier attached to everything on that side, or only to part of it?',
    'Try dividing every term of both sides, then try dividing only the totals, and see whether one verdict covers both.',
  ],
  errorTags: ['concept-misconception', 'procedure-slip'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE14 = makeWeekBuilder({
  level: 'E',
  week: 14,
  conceptId: 'two-step-equations',
  conceptName: 'Two-step equations',
  strandTags: ['algebra-geometry', 'multiplication-division'],
  prerequisiteWeeks: [D2, E11, E13],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the reverse of the order they went on',
  conceptFamily: 'operation',
  deepeningDelta:
    'E13 gave the unknown one thing to be freed from, so the only question was which inverse to use; the order question could not arise. E14 wraps the unknown twice — a scaling, then a joining — and the child must now decide WHICH undoing comes first. That turns a rule into a plan, and it opens the distinction E13 never needed: a move is legal when it lands on both sides, but a division is only that move when it reaches every term of the side it lands on. The week ends by running one equation down both legal routes to the same value, which is the evidence that the scaling was attached to the unknown and not to the whole side.',
  explanation: {
    hook:
      'Two things were done to a hidden number, one after the other, and you are looking at what came out. You cannot take the first one off first — it is underneath. Anything wrapped twice comes unwrapped in the opposite order to the way it went on.',
    whyBeforeHow:
      'A two-step equation is an expression that was built in two moves: the unknown was scaled, and then something was joined to the result. Those two moves come off in the reverse of the order they went on, because the move made LAST is the only one lying on the outside where you can reach it. Take the joined amount off both sides and what is left is the scaling standing alone; undo the scaling and the unknown stands alone. That route never fails, and it is the one to reach for. But it is worth knowing exactly why the other route works too, because the week\'s real trap hides beside it. You may divide both sides first — as long as the division reaches EVERY term on both sides. Four lots of the unknown plus twenty, divided by four, is the unknown plus five; the twenty became five on the way. What goes wrong is dividing the total by four and then taking the whole twenty off what that leaves, because that division touched two parts of the equation and walked past the third. The order is a matter of reliability. Completeness is a matter of truth.',
    script: [
      {
        say: 'Here is the equation as a picture. Four equal parts, all the same unknown size, and a loose twenty joined on the end; the whole bar measures thirty-six. The twenty is the move that was made last, so it is the one lying on the outside. I take it off both sides — off the bar, and off the thirty-six — and what is left is four equal parts making sixteen.',
        visual: 'The four equal parts and the loose twenty against the stated total, drawn to one scale.',
        figure: barModel(
          [
            { label: 'four equal parts and the loose amount', segments: [{ value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }, { value: 20, label: '20', fill: 'hatch' }], total: '36' },
            { label: 'the total', segments: [{ value: 36, label: '36' }] },
          ],
          { scaleMax: 36, alt: 'a bar of four equal parts followed by a hatched 20 block, the whole bar measuring 36, beside a single 36 bar' },
        ),
      },
      {
        say: 'Now the slip this week exists to defeat, and notice that it starts sensibly. A student sees four lots of something and divides the total by four: thirty-six shared four ways is nine. Then they take the twenty off the nine. But look at what that division did — it reached the four parts and it reached the total, and it went straight past the twenty as though the twenty were not sitting on that side at all. One side was divided in pieces, so the two sides stopped naming the same amount before any answer was reached.',
        visual: 'The same bar with only part of the side divided, so the two sides no longer measure alike.',
        figure: barModel(
          [
            { label: 'what the division reached', segments: [{ value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }], total: '16' },
            { label: 'the part it walked past', segments: [{ value: 20, label: '20', fill: 'hatch' }] },
          ],
          { scaleMax: 36, alt: 'a bar of four equal parts totalling 16 beside a separate hatched bar of 20, the two drawn to the same scale' },
        ),
      },
      {
        say: 'And here is the same equation down the other legal route, to show that dividing first was never the problem. I divide every term on both sides by four. The four parts become one part. The twenty becomes five. The thirty-six becomes nine. That reads: the unknown plus five is nine — and taking five off both sides leaves the unknown as four. Different route, same value, because this division reached everything.',
        visual: 'Every term of both sides at a quarter of its size, the two sides still measuring alike.',
        figure: barModel(
          [
            { label: 'every term divided by four', segments: [{ value: 4 }, { value: 5, label: '5', fill: 'hatch' }], total: '9' },
            { label: 'the total divided by four', segments: [{ value: 9, label: '9' }] },
          ],
          { scaleMax: 36, alt: 'a bar of one part and a hatched 5 block totalling 9, beside a single 9 bar, both a quarter of the earlier bars' },
        ),
      },
      {
        say: 'Two habits, and the first one costs nothing. Before I touch the arithmetic I ask roughly how big the unknown can be: the loose amount is already part of the total, so what the equal parts share is smaller than the total, and one part is smaller again. If my working hands me a value bigger than the total, I have not been unlucky — I have been wrong, and I knew the size before I started. Then at the end I put my value back and work each side out on its own. Two sides landing on the same number is the only evidence that the value is the one the equation was talking about.',
        visual: 'The total beside what the equal parts alone account for, drawn to one scale.',
        figure: barModel(
          [
            { label: 'the stated total', segments: [{ value: 36, label: '36' }] },
            { label: 'what the equal parts account for', segments: [{ value: 16, label: '16' }] },
          ],
          { scaleMax: 36, alt: 'a bar of 36 for the total beside a shorter bar of 16 for the part the equal shares account for' },
        ),
      },
    ],
    summary:
      'A two-step equation was built in two moves, so it comes apart in the opposite order: take off what was joined last, then undo the scaling underneath it. That route always works. Dividing first also works, but only when the division reaches every term on both sides — divide the total and leave the joined amount whole and the two sides stop naming the same amount, which is the week\'s trap. Estimate the size of the unknown before you start, and finish by putting your value back into the equation you began with.',
    vocabulary: [
      { term: 'two-step equation', kidGloss: 'an equation in which two operations have been applied to the variable, so two inverse moves are needed' },
      { term: 'inverse order', kidGloss: 'undoing operations in the reverse of the order they were applied, because the last one applied is the only one on the outside' },
      { term: 'term', kidGloss: 'one of the parts of an expression that are joined by plus or minus signs' },
      { term: 'coefficient', kidGloss: 'the number a variable is multiplied by' },
      { term: 'isolate', kidGloss: 'to get the variable standing alone on one side of the equation' },
    ],
  },
  guidedExamples: [
    {
      ...ge(14, 1, 'modeled', 'Solve 3x + 14 = 41, then check the value you find.', [
        {
          teacherSay:
            'I read the equation as a history before I do anything to it. Something unknown was multiplied by three, and then fourteen was joined to that result. The fourteen went on last, so the fourteen is the part lying on the outside.',
        },
        {
          teacherSay:
            'So I take fourteen off both sides. The left is now three lots of the unknown standing alone; the right is what the total has left. What is that?',
          expected: '27',
        },
        {
          childDo: 'Undo the scaling on both sides, then put your value back into the equation we started from and work the left side out.',
          expected: '9',
        },
      ], '9'),
      visual: 'Three equal parts and the joined fourteen against the stated total, to one scale.',
      figure: barModel(
        [
          { label: 'three equal parts and the joined amount', segments: [{ value: 9 }, { value: 9 }, { value: 9 }, { value: 14, label: '14', fill: 'hatch' }], total: '41' },
          { label: 'the total', segments: [{ value: 41, label: '41' }] },
        ],
        { scaleMax: 41, alt: 'a bar of three equal parts followed by a hatched 14 block making 41, beside a single 41 bar' },
      ),
    },
    {
      ...ge(14, 2, 'completion', 'Solve 5x + 15 = 70 by dividing both sides by 5 first.', [
        {
          teacherSay: 'If I divide this side by five, which parts of it does the division have to reach?',
          expected: 'both the 5x and the 15',
        },
        {
          childDo: 'Write the line that division leaves on both sides, then finish it and check your value in the original equation.',
          expected: '11',
        },
      ], '11'),
      visual: 'Every term at a fifth of its size; the two sides still measure alike.',
      figure: barModel(
        [
          { label: 'every term divided by five', segments: [{ value: 11 }, { value: 3, label: '3', fill: 'hatch' }], total: '14' },
          { label: 'the total divided by five', segments: [{ value: 14, label: '14' }] },
        ],
        { scaleMax: 70, alt: 'a bar of one part and a hatched 3 block totalling 14, beside a single 14 bar' },
      ),
    },
    ge(14, 3, 'prompted', 'Solve 6x − 11 = 43, and show the check.', [
      {
        childDo: 'Name which of the two moves was applied to the unknown last, undo that one on both sides first, then test your value in the original equation.',
        expected: '9',
      },
    ], '9'),
    {
      // Independent stage: the givens only. Deciding that the stated amount
      // belongs to ONE share rather than to the whole is the task, so a picture
      // of the whole would hand over the plan the item exists to ask for (L33).
      ...ge(14, 4, 'independent', 'A locker room has a flat charge of 8 credits plus the same charge for each of 7 lockers hired. The bill came to 92 credits. Write the equation, solve it, and show the check. Solve cold.', [
        { childDo: 'Decide first which charge was made once and which was made seven times, then write the equation that says so.', expected: '12' },
      ], '12'),
      visual: 'The one-off charge only. What each locker costs is yours to work out.',
      figure: barModel(
        [
          { label: 'the charge made only once', segments: [{ value: 8, label: '8' }] },
        ],
        { scaleMax: 8, alt: 'a single bar of 8 for the one-off charge; the locker charges are not drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the two-step shape in three dresses, no chains and
    // no choices yet. The three warm-ups are the moves it is made of.
    [
      { gen: wOneStep, diff: 2 },
      { gen: wSubtract, diff: 2 },
      { gen: wDivide, diff: 2 },
      { gen: twoStepEquation(), diff: 3 },
      { gen: sitGutteringLengths, diff: 3 },
      { gen: sitTicketWindow, diff: 3 },
    ],
    // Day 2 — fluency + application: which move first, what a division has to
    // reach, and the estimate-first frame where a size decided in advance rules
    // the slip out before any arithmetic.
    [
      { gen: wProduct, diff: 2 },
      { gen: wEvaluate, diff: 2 },
      { gen: whichMoveFirst(), diff: 3 },
      { gen: sitKayakTripEstimate, diff: 3 },
      { gen: twoStepEquation(), diff: 3 },
      { gen: sitStorageUnits, diff: 3 },
    ],
    // Day 3 — interleave: the two chains sit between single solving and the two
    // discriminations, so nothing on the page signals which is coming next.
    [
      { gen: wDivide, diff: 2 },
      { gen: whichMoveFirst(), diff: 3 },
      { gen: msTwoStepUndoCheck, diff: 4 },
      { gen: sitGutteringLengths, diff: 3 },
      { gen: msCraftBoxes, diff: 4 },
      { gen: discrimWholeSideDivided, diff: 4 },
    ],
    // Day 4 — word problems: two chains (one with the check named, one carrying
    // a quantity that must be left unused) plus two single two-step items, so
    // "it must be a chain" never becomes the cue.
    [
      { gen: msTwoStepUndoCheck, diff: 5 },
      { gen: msCraftBoxes, diff: 4 },
      { gen: sitKayakTripEstimate, diff: 4 },
      { gen: sitTicketWindow, diff: 4 },
      { gen: sitStorageUnits, diff: 4 },
    ],
    // Day 5 — written: the named slip analysed, one equation down both routes,
    // and the claim that separates the order from the completeness.
    [
      { gen: wEvaluate, diff: 2 },
      { gen: eaStepOrder(), diff: 4 },
      { gen: twoPaths, diff: 3 },
      { gen: dividingFirstClaim, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the mistake to watch for this week does not look like a mistake. Faced with four lots of something plus twenty, a child divides the total by four — a sensible first thought — and then takes the whole twenty off what that leaves. The division reached two parts of the equation and walked past the third. If you see it, do not correct the arithmetic. Ask which parts of that side the division was supposed to reach, and whether it reached all of them.',
  ],
  puzzle: (r) => {
    // The week's own comparison run as a construction: both legal routes on one
    // equation, each asked for by the line it produces. This cannot collapse to
    // a Day-1 structure — a single solve produces none of the three numbers.
    const a = r.int(3, 8);
    const k = r.int(3, 12);
    const b = a * k;              // divisible by `a`, so the divide-first route stays whole
    const x = r.int(4, 20);
    const c = a * x + b;
    return {
      id: 'E14-PZ-01',
      title: 'Puzzle Grove: One Equation, Two Roads',
      puzzleType: 'construction',
      prompt: `Take the equation ${equationText(a, b, c)}. Road one takes the loose amount off both sides first; road two divides every term on both sides by ${fmtInt(a)} first. Write three numbers in order: the number left on the right after road one's first move, the number left on the right after road two's first move, and the value of x that both roads reach. Then say in one sentence which number changed on road two that did not change on road one.`,
      answer: {
        value: `${c - b}, ${c / a}, ${x}`,
        acceptableForms: [
          `${c - b} ${c / a} ${x}`,
          `${c - b}, ${c / a}, ${x}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'What does a first move leave standing on each side, before anything else is done?',
        'Carry out each road\'s first move on both sides and write down what the right-hand side has become, then finish either road to reach x.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'alg-two-routes' },
  sprint: {
    skill: 'Exact division within the tables — the second of the two inverse moves this week performs',
    sourceWeek: D16,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'div_facts_v1',
    params: { min: 2, max: 12 },
  },
  mastery: [
    { gen: sitGutteringLengths, diff: 3 },
    { gen: msTwoStepUndoCheck, diff: 4 },
    { gen: sitTicketWindow, diff: 3 },
    { gen: msCraftBoxes, diff: 4 },
    { gen: sitStorageUnits, diff: 3 },
    { gen: sitKayakTripEstimate, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single two-step equations in three different structures — a run cut into equal lengths with an offcut (measurement), a per-item price under a single booking fee (rate), and equal shares with a quantity held back (part-whole). 02/04: chains — a joining charge recovered from a running total with the check named, and a delivery split after a held-back quantity is removed, carrying a stated count the question never uses. 06: the same two-step shape behind an estimate-first commitment. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'procedure-slip',
      subtype: 'divides-before-un-adding',
      description: 'Divides the total by the multiplier while the joined amount is still attached, then takes the whole joined amount off what that leaves. The division reached the scaled part and the total and walked past the loose term, so one side was divided in pieces and the two sides stopped naming the same amount.',
      exampleWrongAnswer: '4x + 20 = 36 answered as −11, by dividing 36 by 4 and then taking 20 off the 9',
      distractorRationale: 'Offer the value that dividing the total first and then removing the whole joined amount genuinely produces, so only a reading of what the division reached separates it from the solution.',
      reteachPointer: 'explanation/script[1] (the part the division walked past) beside script[2] (the same route done completely)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'undoes-in-the-order-written',
      description: 'Undoes the moves in the order they are read on the page rather than the reverse of the order they were applied, so the scaling is taken off first because it is written first. The child has the idea of undoing but not the idea that the last move made is the only one reachable.',
      exampleWrongAnswer: 'a solution reached by dividing by the coefficient before the joined amount was removed',
      distractorRationale: 'Offer the value produced by undoing in reading order, which differs from the solution by exactly the joined amount stretched over the multiplier.',
      reteachPointer: 'guidedExamples/E14-GE-01 (which move went on last), then explanation/script[0]',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'one-off-charge-read-as-per-item',
      description: 'Reads a quantity that appears once as though it applied to every group — the booking fee charged per ticket, the guide\'s charge counted for every paddler — so the equation is built with the loose amount multiplied along with the unknown.',
      exampleWrongAnswer: 'a per-ticket price found by dividing the whole order, booking fee included, between the tickets',
      distractorRationale: 'Offer the value that follows from sharing the entire stated total between the groups, which is what treating the one-off charge as part of every group produces.',
      reteachPointer: 'guidedExamples/E14-GE-04 (which charge was made once and which was made seven times), then the Day-4 word problems',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'uses-every-number',
      description: 'Consumes every quantity the story states, including one belonging to the setting rather than to the question, so a spare number is folded in as an extra division or an extra step.',
      exampleWrongAnswer: 'the skeins in one craft box divided again between the shelves in the studio',
      distractorRationale: 'Offer the value that follows from using the stated quantity the question never asks about.',
      reteachPointer: 'the Day-3 and Day-4 chains, where the stated count that goes unused is the point of the item',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Two-step equations — reading an equation as a history of two moves, undoing them in the reverse of the order they were applied, telling a complete division of both sides apart from one that reaches only part of a side, and proving every answer by putting it back into the equation it came from.',
    improvingCandidates: [
      'deciding which of two moves was applied to the unknown last',
      'taking the joined amount off both sides before undoing the scaling',
      'dividing every term of both sides when dividing is the first move',
    ],
    strengtheningByTag: [
      {
        errorTag: 'procedure-slip',
        text: 'making a division reach every term on the side it lands on, not just the totals',
      },
      {
        errorTag: 'concept-misconception',
        text: 'unwrapping in the reverse of the order the moves went on, rather than in reading order',
      },
      {
        errorTag: 'representation-misread',
        text: 'telling a charge made once apart from a charge made for every item',
      },
      {
        errorTag: 'task-comprehension',
        text: 'deciding which stated quantities the question needs, and leaving the others alone',
      },
    ],
    homeFocus: {
      praiseLine:
        'You worked out which move had gone on last before you touched the equation, and you checked your value by putting it back in — that pair of habits is the whole week.',
      questionForChild: 'If I think of a number, double it, add ten, and tell you I get thirty-two, what was my number — and which of my two moves would you undo first?',
      schoolSyncHook: 'If your child\'s class writes the two undoing steps on separate lines, or divides through first as a matter of course, tell us and we will match what they use.',
    },
    vocabularyForParent: [
      'two-step equation (two operations were applied to the variable, so two inverse moves undo it)',
      'inverse order (the last move applied is the first one undone)',
      'term (a part of an expression joined by a plus or minus — a division of a side must reach every one of them)',
    ],
  },
});
