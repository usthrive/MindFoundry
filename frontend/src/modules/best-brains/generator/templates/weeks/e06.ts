/**
 * Level E · Week 6 — "Negative numbers" (conceptId: negative-numbers).
 *
 * FILL-ARCHITECTURE §6 row E6: anchor "elevator / mirror line"; key multi-step
 * "temp drop then rise"; error-analysis "−8 > −3 because 8 > 3"; discrimination
 * "bigger magnitude, smaller number"; Day-5 signature "order a mixed weather
 * week". No R flag: every strand of this week is computable.
 *
 * THE WEEK'S CLAIM. A negative number is a POSITION, not a size wearing a minus
 * sign. Everything below is built to force that reading rather than announce it:
 *  - the shaft of a lift is the anchor because it carries both facts at once and
 *    keeps them apart. Level four below ground is FURTHER from the ground floor
 *    than level two below ground, and it is LOWER than it. Distance out and
 *    position along are two different measurements of one place, and the week's
 *    named misconception is exactly the collapse of the second into the first;
 *  - two discriminations attack that collapse from opposite ends. The symbol
 *    item asks the child to PRODUCE an order across six shapes of pair — both
 *    below zero, one either side with the magnitudes drawn each way round, one
 *    reading sitting on zero against each side of it, and two readings that
 *    agree — so no single reflex survives the set, and the mix each surface gets
 *    is a parameter rather than a coin flip. The cold-store item asks them to
 *    DETECT the one description that pairs the right physics with the wrong
 *    arithmetic ("the colder reading and the larger number"), which is what a
 *    child holding the misconception actually writes;
 *  - the error-analysis is the family's own `eaMagnitudeOrder`, whose shown
 *    wrong reading is re-derived by `e_verify_int_compare_v1` and refuses any
 *    pair on which the misconception has no distinct output;
 *  - three genuine chains, one per posing shape the E band owes: a forward
 *    fall-then-rise (the recipe's headline), an INVERSE-START balance that hands
 *    over the END of the term and asks for its beginning, and a HAS-DISTRACTOR
 *    lift run carrying the depth of the shaft, which is stated, is a level
 *    number on the same line as the answer, and is never used.
 *
 * THREE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. `compareNegativesTrap` — the family's own E6 discrimination — IS NOT
 *     SERVED, and a local `compareSignedTrap` stands in its place. Its three
 *     options are `<`, `>` and `=`, and its draw takes `big = int(5,15)` with
 *     `small = int(1, big-1)`, so the two readings can never coincide and `=` is
 *     offered on every exposure and correct at no seed — the L38 permanently
 *     unkeyable card, in the shape `compareWhole` was repaired for in the Level-D
 *     library ("ONE DRAW IN FIVE MAKES THE TWO NUMBERS EQUAL"). The local
 *     generator keeps the recipe's bite (three draws in eight, on the daily
 *     pages, are two readings below zero with different magnitudes), keys `=` on
 *     the shape where two stations agree, and adds the shapes that stop "compare
 *     the digits, then flip" from being a winning rule on its own.
 *
 *  2. `absoluteValue` IS DELIBERATELY ABSENT FROM THE MASTERY FORM, although it
 *     is named in the catalogue row and is served twice on the daily pages.
 *     "Ignore the sign and report the digits" is the CORRECT answer to an
 *     absolute-value item, so every mastery slot it occupied would hand a free
 *     certifying point to the one strategy this week exists to defeat. It is
 *     taught, practised and pictured; it is not what the week certifies on.
 *
 *  3. THE READINGS ARE NEVER GLOSSED. Band E carries full precise vocabulary
 *     unglossed, so `absolute value`, `opposite` and `integer` are defined once
 *     in the lesson and then used. The one convention a prompt does state is the
 *     signed BALANCE — that money owed is written below zero — because a signed
 *     balance is a bookkeeping convention rather than a mathematical fact, and a
 *     child cannot recover it from the number line.
 *
 * Retrieval is backward-only into the three Level-D skills a signed reading
 * actually runs on: D1 comparing and ordering (the symbol convention, and the
 * place-by-place habit that is about to meet its first exception), D2 the
 * subtraction that measures a gap, and D16 exact division — the move the puzzle
 * needs, since a pair of opposites splits its gap evenly across zero. D1 supplies
 * two formats rather than one (compare and round) because "which of the two
 * neighbours is this nearer?" is a distance-along-the-line reading, which is what
 * absolute value formalises.
 */

import { asWarmup, classify, compareWhole, divideExact, reasoning, roundWhole, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withCheckBack, withEstimateFirst } from '../lib/metacog';
import { cmpFrac } from '../lib/compute';
import { article, countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsParam, numberLine } from '../lib/figures';
import {
  absoluteValue,
  distanceBetween,
  eaMagnitudeOrder,
  oppositeValue,
  orderTemperatures,
  temperatureSwing,
} from '../lib/integers';
import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const D1 = { level: 'D' as const, week: 1 };
const D2 = { level: 'D' as const, week: 2 };
const D16 = { level: 'D' as const, week: 16 };

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// `multistep.ts` carries no figure slot and lib/ is not this week's to edit, so
// the wrapper reads the finished draft's `generator.params` — the very numbers
// the answer was folded from. There is no second draw and therefore no second
// source of truth, which is what QG-13 audits. (Same shape as the wrapper the
// integer family uses internally, and as e01's.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/**
 * Redraw until the item actually contains a reading below zero.
 *
 * The integer family draws its sign with a fair coin, which is right for a
 * generator serving four weeks and wrong for two SLOTS in this one. Read at seed
 * 1301, both absolute-value items had landed on positive readings, so both asked
 * a child to copy the number in front of them, and the distance item compared
 * two readings on the same side of zero — four items on the page with no
 * negative number anywhere in them. The wrapper is a rejection filter, not a
 * second draw: it re-runs the generator's own draw, so nothing is fabricated and
 * the accepted item is one the family itself produced. Only the slots that need
 * the constraint carry it, so a positive reading is still met where it teaches.
 */
function belowZero(base: ItemGen, holds: (p: Params) => boolean): ItemGen {
  return (rng, guard, difficulty) => {
    let d = base(rng, guard, difficulty);
    for (let i = 0; i < 12 && d.generator && !holds(d.generator.params as Params); i++) {
      d = base(rng, guard, difficulty);
    }
    return d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * D1 — the comparison symbols. The open side faces the greater number, and this
 * week is about to change which number that is without changing the rule.
 *
 * `compareWhole` is the one comparison generator in the Level-D library whose
 * `=` option is reachable (its draw makes the two numbers equal once in five),
 * which is why the fraction and decimal comparison warm-ups were passed over:
 * both nudge ties away, so both offer an option no seed can key.
 */
const wCompareSymbol = asWarmup(compareWhole(6), D1);
/**
 * D2 — the subtraction that measures a gap between two readings.
 *
 * The window is 300–560 rather than a wider one: `subWhole` draws both operands
 * from one range and orders them, so any range whose top reaches twice its floor
 * can print `418 − 209`, whose answer is already sitting beside it. Keeping the
 * top under twice the floor makes the difference provably smaller than the
 * number taken away, so no seed can leak.
 */
const wGapSub = asWarmup(subWhole(300, 560), D2);
/**
 * D16 — exact division. The puzzle needs it: a pair of opposites shares its gap
 * evenly across zero, so recovering the pair is a halving.
 *
 * Divisor and quotient ranges are disjoint on purpose. `divideExact` draws the
 * two independently, so overlapping ranges let them coincide and print a warm-up
 * whose answer is one of the numerals in its own question.
 */
const wShareEvenly = asWarmup(divideExact(12, 25, 3, 9), D16);
/** D1 — which of two neighbours a number is nearer: a distance read off the line. */
const wNearerHundred = asWarmup(roundWhole(2, 1230, 8790), D1);

// ---------------------------------------------------------------------------
// Multi-step: three chains, one per posing shape
// ---------------------------------------------------------------------------

/**
 * INVERSE-START. The figure the story hands over is the balance at the END of
 * the term, so the opening move is to take the term's two movements back OFF it,
 * each in the direction that undoes it — a grant paid in has to be subtracted,
 * a fee taken out has to be added, and nothing in the sentence order says so.
 *
 * The opening balance is drawn FIRST and the closing figure derived from it, so
 * the answer is never zero and never one dollar either way (a signed count of
 * one prints "-1 dollars" through `countNoun`, and QG-12c's singular scan has no
 * left boundary for a minus sign). The two movements are held apart, so the term
 * never cancels itself out and leaves a story with nothing in it.
 *
 * Served only through the check-back wrapper: the honest check on an undone
 * term is not "is the arithmetic right" but "does running the term forward from
 * the figure I wrote land back on the closing balance the story states".
 */
const msTermBalance = multiStep({
  situationType: 'money-change',
  cognitiveOp: 'int-balance-back',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    // The ANSWER first: the balance the term opened at, below zero two draws in
    // three, because a club that ends a term owing money usually began owing it.
    const openMag = r.int(4, 60);
    const open = r.int(0, 2) === 0 ? openMag : -openMag;
    // The term's net movement. Zero would make the two movements cancel and
    // leave a story with nothing in it; a closing figure inside a dollar of zero
    // would print a singular unit through `countNoun`.
    let delta = r.int(-40, 40);
    while (delta === 0 || Math.abs(open + delta) < 2) delta += 5;
    const close = open + delta;
    // The two movements are built from a shared base, so neither is ever pinned
    // to a floor: an earlier version clamped the smaller movement and printed
    // the same five-dollar grant on nearly every draw whose term ran down.
    //
    // The base is then walked up until neither movement equals the opening
    // figure (the answer) or the closing one. Read at seed 2029, a form printed
    // a closing balance of 40 dollars beside a payment of 40, and keyed the fee
    // that was already on the page — 1.1% of forms handed the answer over that
    // way. `delta` never moves here, so the answer itself is untouched.
    let base = r.int(12, 55);
    for (let i = 0; i < 12; i++) {
      const g = base + Math.max(delta, 0);
      const f = base + Math.max(-delta, 0);
      if (g !== open && f !== open && g !== close && f !== close) break;
      base += 1;
    }
    const grant = base + Math.max(delta, 0);
    const fee = base + Math.max(-delta, 0);
    const body = r.pick(['book club', 'cycling club', 'drama group', 'allotment society', 'chess club']);
    const gift = r.pick(['grant', 'donation', 'sponsorship', 'raffle payment']);
    const bill = r.pick(['hall fee', 'coach hire', 'kit bill', 'insurance charge']);
    return {
      // Every article runs through `article()` and none of them opens a
      // sentence, so a vowel-sound noun ("an allotment society", "an insurance
      // charge") cannot reach the page carrying the wrong one.
      prompt: `The accounts of ${article(body)} are kept as a signed balance, so money the group owes is written below zero. The account closed the term at ${countNoun(close, 'dollars')}. During the term ${article(gift)} of ${countNoun(grant, 'dollars')} was paid in and ${article(bill)} of ${countNoun(fee, 'dollars')} was taken out. What did the account stand at when the term opened?`,
      initN: close,
      steps: [
        { op: 'sub', n: grant, d: 1 },
        { op: 'add', n: fee, d: 1 },
      ],
      units: 'dollars',
      acceptableForms: [countNoun(open, 'dollars')],
      hints: [
        'Does the figure this story hands you belong to the opening of the term or to the close of it?',
        'Take the term\'s two movements back off the closing figure, each one travelling the way that undoes it.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const msTermBalanceCheck = withCheckBack(
  msTermBalance,
  'run the term forwards from the opening figure you found — does it land on the closing balance the story states?',
);

/**
 * HAS-DISTRACTOR. A service lift in a tower with basement levels: the ground
 * floor is zero, the run rises then descends, and the depth of the shaft is
 * stated and never used. It is the seductive kind of spare quantity, because it
 * is a level number on the same line as the answer and is always deeper than
 * anything the lift reaches — so a child who consumes every number the story
 * offers has a plausible place to put it.
 *
 * The finishing level is drawn before the descent, so it is never the ground
 * floor, never one level either side of it, and never the level the lift set out
 * from (a run that returns to its start reads as a non-problem). It finishes
 * below ground two draws in three.
 *
 * Served only through the estimate-first wrapper: which side of the ground floor
 * the run ends on is decidable before any arithmetic, and a child who commits to
 * that first cannot quietly drift across zero mid-calculation.
 */
const msHoistRun = withFigure(
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'int-level-run',
    posing: 'has-distractor',
    draw: (r) => {
      const start = -r.int(2, 7);
      const upTo = r.int(4, 11);
      const up = upTo - start;
      let finish = r.int(0, 2) === 0 ? r.int(2, upTo - 2) : -r.int(2, 8);
      if (finish === start) finish = start - 1;
      // Walk the finishing level off anything it must not be: the ground floor
      // or a single level either side of it, the level it set out from, and any
      // number the prompt already prints. The descent is the collision that
      // happens (finish and down meet at half the height of the loading bay),
      // and a level the child can read straight off the page is not a level
      // they had to walk to. Every step is downwards, so the walk terminates —
      // and the shaft depth below is measured AFTER it, so the stated bottom
      // stays deeper than anywhere the lift reaches.
      for (
        let i = 0;
        i < 12 && (Math.abs(finish) < 2 || finish === start || finish === upTo - finish || finish === up);
        i++
      ) {
        finish -= 1;
      }
      const down = upTo - finish;
      // The shaft is sunk deeper than the run ever travels, so the stated depth
      // is genuinely context and cannot be mistaken for a bound that bites.
      const deepest = -(Math.max(Math.abs(start), Math.abs(finish)) + r.int(2, 5));
      const site = r.pick(['tower', 'hospital', 'concert hall', 'shopping centre', 'city library']);
      const errand = r.pick(['loading bay', 'delivery dock', 'kitchen floor', 'sorting room']);
      return {
        prompt: `The service lift in ${article(site)} numbers the ground floor 0 and counts its basement levels downwards from there. It sets off from level ${fmtInt(start)}, rises ${countNoun(up, 'levels')} to the ${errand}, then goes down ${countNoun(down, 'levels')} to a store room. The shaft is sunk as far as level ${fmtInt(deepest)}. Which level does the lift finish on?`,
        initN: start,
        steps: [
          { op: 'add', n: up, d: 1 },
          { op: 'sub', n: down, d: 1 },
        ],
        hints: [
          'Which numbers in this story name a place in the shaft, and which name a journey between places?',
          'Set off from the level the lift starts on and walk each move out in turn, leaving alone the one that only reports how deep the shaft goes.',
        ],
        errorTags: ['task-comprehension', 'representation-misread'],
      };
    },
  }),
  (p) => {
    const start = Number(p.initN);
    return numberLine(
      {
        min: Math.min(start, 0) - 4,
        max: Math.max(start, 0) + 12,
        step: 2,
        marks: [{ at: start, label: fmtInt(start), style: 'flag' }],
      },
      {
        alt: 'a line through the ground floor with the level the lift sets off from flagged below it',
        asserts: assertsParam('initN', 'mark:0'),
      },
    );
  },
);
const msHoistRunEstimate = withEstimateFirst(
  msHoistRun,
  'will the lift finish above the ground floor or below it?',
);

// ---------------------------------------------------------------------------
// Discrimination — magnitude against value, from both ends
// ---------------------------------------------------------------------------

const MAGNITUDE_RATIONALE =
  'Ranks the pair by how far each reading has to travel to reach zero, so the reading with the longer journey is taken to be the greater of the two.';
const NO_ORDER_RATIONALE =
  'Reads the sentence as asking whether both stations reported weather rather than which reading stands higher, so no order gets chosen at all.';
const REVERSED_RATIONALE =
  'Faces the symbol the way the sentence is read rather than the way the two readings rank, so its wider end lands on whichever one happened to be written first.';

/**
 * PRODUCE the order. Six pair shapes exist and each defeats a different reflex,
 * so nothing short of reading positions survives a set of them:
 *  - `below`       two readings below zero — the recipe's own bite, where
 *                  comparing digits gives the wrong symbol every time;
 *  - `across-down` one either side of zero, the negative carrying the greater
 *                  magnitude, so comparing digits is wrong again;
 *  - `across-up`   one either side, the positive carrying the greater magnitude,
 *                  so comparing digits is RIGHT — which is what stops "compare
 *                  the digits, then flip" from being a rule that always works;
 *  - `zero-below`  a reading sitting ON zero against one below it, and
 *  - `zero-above`  the same against one above it. The mirror line is a reading
 *                  like any other, and no generator in the integer family ever
 *                  puts it into a comparison;
 *  - `level`       two stations agreeing — the only shape that keys `=`. Without
 *                  it that option is offered every time and correct at no seed,
 *                  which is the L38 card the family's own trap ships.
 *
 * The pool is a PARAMETER rather than a global coin flip, because the shape is
 * what decides whether the misconception can win the item and a certifying slot
 * cannot be left to chance. The mastery pool holds no shape a digit-comparison
 * can win except the one that keys `=`; the daily pool holds all six, so a child
 * meets every regime in practice. Read at one seed before this was split, both
 * mastery forms happened to draw `zero-above` and neither certified anything.
 *
 * Each distractor's rationale is chosen from the draw rather than from the
 * author's expectation: the symbol a magnitude reader genuinely produces is
 * computed and tagged as the misconception, and the remaining symbol takes the
 * error that actually yields it.
 */
type PairShape = 'below' | 'across-down' | 'across-up' | 'zero-below' | 'zero-above' | 'level';

/** Daily practice: every regime, with the below-zero bite carrying three draws in eight. */
const COMPARE_DAILY: readonly PairShape[] = [
  'below', 'below', 'below', 'across-down', 'across-up', 'zero-below', 'zero-above', 'level',
];
/**
 * The certifying pool. Four draws in six are shapes a digit-comparison loses, so
 * the misconception cannot pass the slot; the other two are the shapes where it
 * is RIGHT, so a blanket "compare the digits and flip" cannot pass it either.
 * Measured over 800 forms, comparing magnitudes keys this slot on 33% of them —
 * chance for a three-option item — and "the reading nearer zero is the greater"
 * on 67%, down from 100% before `across-up` was added.
 */
const COMPARE_MASTERY: readonly PairShape[] = ['below', 'below', 'below', 'across-down', 'across-up', 'level'];

const compareSignedTrap = (pool: readonly PairShape[]): ItemGen => discrimination({
  variant: 'structural',
  cognitiveOp: 'int-compare-position',
  draw: (r) => {
    const shape = r.pick(pool);
    let a: number;
    let b: number;
    if (shape === 'below') {
      const deep = r.int(4, 15);
      const shallow = r.int(2, deep - 1);
      [a, b] = r.int(0, 1) === 0 ? [-deep, -shallow] : [-shallow, -deep];
    } else if (shape === 'across-down') {
      const below = -r.int(6, 15);
      const above = r.int(2, Math.abs(below) - 1);
      [a, b] = r.int(0, 1) === 0 ? [below, above] : [above, below];
    } else if (shape === 'across-up') {
      const above = r.int(6, 15);
      const below = -r.int(2, above - 1);
      [a, b] = r.int(0, 1) === 0 ? [below, above] : [above, below];
    } else if (shape === 'zero-below' || shape === 'zero-above') {
      const other = shape === 'zero-below' ? -r.int(2, 14) : r.int(2, 14);
      [a, b] = r.int(0, 1) === 0 ? [0, other] : [other, 0];
    } else {
      const both = -r.int(2, 14);
      [a, b] = [both, both];
    }
    // One comparison primitive, one audit: the symbol comes from `cmpFrac`, the
    // same routine the integer family orders every reading with.
    const c = cmpFrac({ n: a, d: 1 }, { n: b, d: 1 });
    const correct = c < 0 ? '<' : c > 0 ? '>' : '=';
    const magGap = Math.abs(a) - Math.abs(b);
    const magSymbol = magGap < 0 ? '<' : magGap > 0 ? '>' : '=';
    const wrong = (['<', '>', '='] as const).filter((s) => s !== correct);
    const distractors =
      correct === '='
        ? [
            {
              text: '<',
              errorTag: 'representation-misread' as ErrorTag,
              rationale:
                'Drops the minus sign from the second reading, so a pair that agrees is read as one station below zero set against one above it.',
            },
            {
              text: '>',
              errorTag: 'concept-misconception' as ErrorTag,
              rationale:
                'Drops the minus sign from the first reading, so an identical pair is made to disagree by the sign alone.',
            },
          ]
        : wrong.map((s) => {
            if (s === magSymbol) {
              return { text: s, errorTag: 'concept-misconception' as ErrorTag, rationale: MAGNITUDE_RATIONALE };
            }
            if (s === '=') {
              return { text: s, errorTag: 'task-comprehension' as ErrorTag, rationale: NO_ORDER_RATIONALE };
            }
            return { text: s, errorTag: 'representation-misread' as ErrorTag, rationale: REVERSED_RATIONALE };
          });
    return {
      prompt: `Two weather stations logged ${countNoun(a, 'degrees')} and ${countNoun(b, 'degrees')} at the same hour. Which symbol makes ${fmtInt(a)} __ ${fmtInt(b)} true?`,
      correct,
      distractors,
      hints: [
        'Which way along a thermometer scale do the readings get greater?',
        'Set both readings on one line through zero, then turn the open side of the symbol towards whichever one you reach later climbing the scale.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/** One instance per pool, so the daily pages and the certifying form each hold
 *  a generator whose shape mix was chosen for the job it is doing. */
const compareOnThePage = compareSignedTrap(COMPARE_DAILY);
const compareOnTheForm = compareSignedTrap(COMPARE_MASTERY);

/**
 * DETECT the collapse. Both shelves are below zero and one is clearly the
 * colder, so the physics is never in doubt; what the three descriptions disagree
 * about is which of the two readings is the smaller NUMBER. The first distractor
 * is the misconception written out in full — the right shelf, the wrong
 * arithmetic — which is exactly what a child who has met only positive numbers
 * produces. The two readings are printed in a drawn order, so "the shelf named
 * first" decides nothing.
 */
const discrimColderReading = discrimination({
  variant: 'structural',
  cognitiveOp: 'int-colder-order',
  draw: (r) => {
    const deep = -r.int(7, 19);
    // At least three degrees apart, so which shelf is colder is not a judgement
    // call, and the item turns purely on how the two readings are ranked.
    const shallow = -r.int(2, Math.abs(deep) - 3);
    const [first, second] = r.int(0, 1) === 0 ? [deep, shallow] : [shallow, deep];
    return {
      prompt: `A cold store logs ${countNoun(first, 'degrees')} on one shelf and ${countNoun(second, 'degrees')} on another. Which description of that pair holds?`,
      correct: `${fmtInt(deep)} is the colder reading and the smaller number.`,
      distractors: [
        {
          text: `${fmtInt(deep)} is the colder reading and the larger number.`,
          errorTag: 'concept-misconception',
          rationale:
            'Gets the frost right and the order wrong: the shelf further below zero carries the larger digits, and larger digits are being read as a larger number.',
        },
        {
          text: `${fmtInt(shallow)} is the colder reading and the smaller number.`,
          errorTag: 'representation-misread',
          rationale:
            'Ranks the shelves by which reading carries the smaller digits, so the shelf nearer zero is handed the frost as well.',
        },
      ],
      hints: [
        'Which two separate facts does a description like these have to get right at the same time?',
        'Lay the two shelves out along a single thermometer scale; the direction you travel from one to the other answers both halves of the description together.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * Two slots that must show the child a reading below zero. The Day-1 absolute
 * value is left unconstrained — |a positive reading| is part of the concept and
 * is worth meeting once — but the Day-2 serving and the single distance item are
 * where the week is supposed to be crossing zero, so they are held to it.
 */
const absoluteBelowZero = belowZero(absoluteValue(), (p) => Number(p.n) < 0);
const distanceAcrossZero = belowZero(distanceBetween(), (p) => Number(p.a) * Number(p.b) < 0);

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * The recipe's Day-5 signature: order a mixed weather week, then defend the
 * order against the misconception by name. Fixed prose, because the demand is on
 * the defence rather than on the arithmetic — and the seven readings include
 * zero, which no generator in the family ever puts in front of a child.
 */
const orderTheWeatherWeek = reasoning({
  prompt:
    'A weather station logged one week of noon readings, Monday to Sunday, in degrees: -3, 4, -11, 0, -6, 2, -8. Write the seven readings out again, coldest first. Then write a defence of that order aimed at a reader who is certain -11 belongs at the warm end, on the grounds that eleven is the biggest number on the list. Your defence has to name what the line measures that the digits do not.',
  value:
    '-11, -8, -6, -3, 0, 2, 4 — the week runs from the reading furthest below zero up to the reading furthest above it, and the eleven counts a distance down from zero rather than a warmth',
  acceptableForms: ['-11, -8, -6, -3, 0, 2, 4', 'furthest below zero', 'distance from zero', 'left of zero', 'which side of zero'],
  keywords: true,
  hints: [
    'Which end of a thermometer does an ordering like this one have to start from?',
    'Lay all seven along one thermometer scale, then read them back starting at the cold end.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim that pins down the SECOND of the week's two measurements. Ordering
 * is settled everywhere else on the page — by both discriminations, by the
 * error-analysis and by the weather week above — so the written claim takes the
 * other half of the thesis: a distance counts steps, and a count of steps has
 * nowhere below nothing to go, whichever side of zero it was counted from.
 *
 * It is also the one item this week that punishes a habit no gate can see. The
 * two Level-E weeks already built both key `sometimes` on their always-sometimes-
 * never item, and a child who has learned that a hedged verdict is usually the
 * safe one should not be rewarded for it a third time.
 */
const claimDistanceBelowNothing = classify({
  prompt:
    'Always, sometimes, or never true: the distance a reading lies from zero is itself a negative amount. Name in one sentence the readings your verdict covers.',
  correct: 'never',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale:
        'Carries the minus sign out of the reading and into the measurement, so a reading below zero is thought to lie a negative way from zero rather than a positive way downwards.',
    },
    {
      text: 'sometimes',
      errorTag: 'task-comprehension',
      rationale:
        'Lets the side of zero decide the sign of the distance, which credits half the line with measuring backwards — but a distance counts steps, and a count of steps has nowhere below nothing to go.',
    },
  ],
  hints: [
    'Can a count of the steps between two places ever come out below nothing?',
    'Try one reading from each side of zero, tally the steps home in each case, and ask whether either tally could come out below nothing.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE06 = makeWeekBuilder({
  level: 'E',
  week: 6,
  conceptId: 'negative-numbers',
  conceptName: 'Negative numbers',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [D1, D2, D16],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the lift shaft with its mirror line at the ground floor',
  conceptFamily: 'operation',
  deepeningDelta:
    'D1 ordered whole numbers by reading them place by place from the left, and every number it ordered grew as its digits grew, so ordering and counting digits never once disagreed. D22 gave a number a position on a plotted axis, but only on the side of the origin where counting begins. E6 keeps the ordering and breaks the coincidence the whole of Level D rested on: past zero the digits count a journey away from the greater end of the line, so of two readings below zero the one with more of them is the smaller. Absolute value enters to hold what those digits really measure, and the opposite enters to name the reflection that carries a position across zero while leaving that measurement untouched.',
  explanation: {
    hook:
      'A lift with a basement passes the same floor number twice — once going down to it and once coming up. Only one of those two floors is below the street, and nothing in the number itself says which. The minus sign is what says it, and it is not telling you a size.',
    whyBeforeHow:
      'A negative number is not a size wearing a minus sign; it is a position, and the minus sign says which side of zero that position lies on. Every number met so far has grown as its digits grew, so ranking numbers by their digits has never once failed — and it fails on the first day it meets a reading below zero, because down there the digits count a journey away from the greater end of the line rather than an amount held. The lift shaft with its mirror line at the ground floor is where the week does its work: the ground floor is zero, the floors above it are counted upwards, the levels below it are counted downwards, and level four below ground is further from the ground floor than level two below ground and lower than it at the same time. Those are two separate facts about one position, and the week turns on keeping them apart. The distance out is called absolute value, it is what the digits were measuring all along, and it is never negative. The position along is what ordering asks about, and it runs one way only, from least on the left to greatest on the right, whatever the digits look like. The opposite of a reading is its reflection in that mirror line — the same distance out, the other side — which is why a reading and its opposite always share an absolute value and never share a position unless both of them are zero.',
    script: [
      {
        say: 'Ride a lift with me. The ground floor is zero. Two floors up is two, and two levels down is minus two. Here is the part worth stopping on: those two levels are the same distance from the ground floor, and they are not the same place. One is above the mirror line and one is below it. The distance is shared. The position is not, and only the position tells you which lift you would rather be standing in.',
        visual: 'The shaft drawn as one line through the ground floor, with a level marked the same distance either side of it.',
        figure: numberLine(
          {
            min: -5,
            max: 5,
            step: 1,
            marks: [
              { at: -2, label: '-2', style: 'point' },
              { at: 2, label: '2', style: 'point' },
            ],
          },
          { alt: 'a line through zero carrying a mark two steps below it and a mark two steps above it' },
        ),
      },
      {
        say: 'Now the pair that catches nearly everybody: minus eight and minus three. Eight beats three, so minus eight looks like the bigger of the two. Ride it instead of reading it. Minus eight sits deeper down the shaft than minus three, so a lift parked there has further to climb before it even reaches the street. Deeper is lower, and lower is the smaller number. The digits were reporting the length of that climb the whole time; they were never reporting a height.',
        visual: 'The two levels marked on one shaft, with the ground floor standing above both of them.',
        figure: numberLine(
          {
            min: -11,
            max: 3,
            step: 1,
            marks: [
              { at: -8, label: '-8', style: 'point' },
              { at: -3, label: '-3', style: 'point' },
            ],
          },
          { alt: 'a line through zero with a mark eight steps below zero and a mark three steps below zero' },
        ),
      },
      {
        say: 'Fold the shaft at the ground floor and every level lands on its opposite. Minus six folds onto six, and six folds straight back onto minus six. A reading and its opposite stand the same distance out and never on the same side, so the two of them together always measure a gap of twice that distance — which is the one measurement a fold cannot change.',
        visual: 'The line folded at zero, one level landing on its mirror image across the crease.',
        figure: numberLine(
          {
            min: -8,
            max: 8,
            step: 2,
            marks: [
              { at: -6, label: '-6', style: 'point' },
              { at: 6, label: '6', style: 'open' },
            ],
          },
          { alt: 'a line through zero with a solid mark six steps below zero and an open mark six steps above it' },
        ),
      },
      {
        say: 'One habit before any arithmetic. I estimate two things and only two: which side of zero the answer will land on, and roughly how far out. A reading that starts below zero, falls further away from it, then climbs back by less than it fell is still below zero, and I know that before I touch a digit. So if my working comes back with an answer above zero I have not been unlucky. I have made a mistake, and I go and find it rather than believing the page.',
        visual: 'A start below zero, a fall further away from it and a shorter climb back — all on one line.',
        figure: numberLine(
          {
            min: -14,
            max: 4,
            step: 2,
            marks: [{ at: -5, label: 'start', style: 'flag' }],
            hops: [
              { from: -5, to: -9, label: 'the fall' },
              { from: -9, to: -6, label: 'the climb' },
            ],
          },
          { alt: 'a line crossing zero, the opening reading flagged below it, with one long hop away and a shorter hop back' },
        ),
      },
    ],
    summary:
      'A negative number names a position below zero, not a size. Order runs one way along the line, from least on the left to greatest on the right, so of two readings below zero the one further from zero is the colder and the smaller, however large its digits. How far a reading sits from zero is a separate question with a separate name: absolute value, which is never negative. A reading\'s opposite is its reflection at zero, the same distance out on the other side. Every ordering, every comparison and every drop-and-rise this week is settled by where the readings sit, and never by how big they look.',
    vocabulary: [
      { term: 'integer', kidGloss: 'a whole number, its opposite, or zero — the whole line of them, with nothing between the marks' },
      { term: 'negative number', kidGloss: 'a number below zero, whose minus sign names the side of zero it lies on rather than its size' },
      { term: 'opposite', kidGloss: 'the number standing the same distance from zero on the other side; a number and its opposite together span twice that distance' },
      { term: 'absolute value', kidGloss: 'how far a number lies from zero, counted without regard to direction, and never negative' },
      { term: 'number line', kidGloss: 'the line every number has exactly one position on, running from least on the left to greatest on the right' },
    ],
  },
  guidedExamples: [
    {
      ...ge(6, 1, 'modeled', 'Which is the greater reading, -9 or -4? Say how you decided.', [
        {
          teacherSay:
            'Let me say my first instinct out loud, because it is worth catching before it does any damage. Nine is more than four, so something in me wants to call minus nine the greater one. I am not going to settle that in my head. I am going to put both readings in the shaft and look.',
        },
        {
          teacherSay:
            'Minus nine is nine levels below the ground floor. Minus four is four levels below it. Which of the two is further down the shaft?',
          expected: '-9',
        },
        {
          childDo: 'Set both levels against a single shaft and read off the one standing higher.',
          expected: '-4',
        },
      ], '-4'),
      visual: 'Both levels on one shaft, with the ground floor above them.',
      figure: numberLine(
        {
          min: -11,
          max: 2,
          step: 1,
          marks: [
            { at: -9, label: '-9', style: 'point' },
            { at: -4, label: '-4', style: 'point' },
          ],
        },
        { alt: 'a line through zero with a mark nine steps below zero and a mark four steps below zero' },
      ),
    },
    {
      ...ge(6, 2, 'completion', 'A survey drone logs its position as -15 m against sea level. Write the opposite of that reading, and say what the two readings share.', [
        {
          teacherSay: 'What has to change when a reading is swapped for its opposite, and what has to stay exactly as it was?',
          expected: 'the side changes; the distance from zero stays',
        },
        { childDo: 'Reflect the mark across zero and write the reading it lands on.', expected: '15' },
      ], '15'),
      visual: 'The logged position only. Where its reflection lands is yours to find.',
      figure: numberLine(
        {
          min: -20,
          max: 20,
          step: 5,
          marks: [{ at: -15, label: '-15', style: 'point' }],
        },
        { alt: 'a line crossing zero, the logged position marked below it and the far side left bare' },
      ),
    },
    ge(6, 3, 'prompted', 'Put these four readings in order, coldest first: -7, 3, -12, 0.', [
      {
        childDo: 'Set all four on one line through zero, then copy them off starting from the left-hand end.',
        expected: '-12, -7, 0, 3',
      },
    ], '-12, -7, 0, 3'),
    {
      // Independent stage: the dawn reading only. Deciding which side of zero
      // the day ends on IS the task here, so drawing the two moves would hand
      // over the plan the item exists to ask for (L33).
      ...ge(6, 4, 'independent', 'A ski-station thermometer stands at -4 degrees before dawn. The reading drops 5 degrees during the morning, then climbs 3 degrees by early afternoon. Where does it stand then? Solve cold.', [
        {
          childDo: 'Call which side of zero the afternoon reading lands on before you work anything out, then take the two moves one at a time.',
          expected: '-6',
        },
      ], '-6'),
      visual: 'The pre-dawn reading alone. Both moves are yours to walk out.',
      figure: numberLine(
        {
          min: -12,
          max: 4,
          step: 2,
          marks: [{ at: -4, label: '-4', style: 'flag' }],
        },
        { alt: 'a line crossing zero, the pre-dawn reading flagged below it and neither move drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: one position read three ways (its reflection, its
    // distance from zero, its place in an order). Single-step throughout.
    [
      { gen: wCompareSymbol, diff: 2 },
      { gen: wGapSub, diff: 2 },
      { gen: wShareEvenly, diff: 2 },
      { gen: oppositeValue(), diff: 3 },
      { gen: absoluteValue(), diff: 3 },
      { gen: orderTemperatures('asc'), diff: 3 },
    ],
    // Day 2 — fluency + application: the symbol discrimination and the
    // estimate-first lift run enter, against two single-step distance reads.
    //
    // Only one generator on this page draws a proper name. Two of them did until
    // a 400-seed scan found the same child logging a height in one item and a
    // temperature in the next on 4.2% of days — nothing in the library guards a
    // name across items, so the day plans keep the name-drawing generators apart
    // instead.
    [
      { gen: wNearerHundred, diff: 2 },
      { gen: wGapSub, diff: 2 },
      { gen: msHoistRunEstimate, diff: 3 },
      { gen: compareOnThePage, diff: 3 },
      { gen: distanceAcrossZero, diff: 3 },
      { gen: absoluteBelowZero, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations sit either side of two chains of
    // different shapes, so nothing on the page announces which work is coming.
    [
      { gen: wShareEvenly, diff: 2 },
      { gen: discrimColderReading, diff: 3 },
      { gen: temperatureSwing(), diff: 4 },
      { gen: msTermBalanceCheck, diff: 4 },
      { gen: orderTemperatures('desc'), diff: 3 },
      { gen: compareOnThePage, diff: 3 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus two
    // single-step items so a two-step reflex is never the winning read of a page.
    // The mirror-line item returns here rather than on Day 2, which is what keeps
    // the two name-drawing generators on different pages.
    [
      { gen: temperatureSwing(), diff: 5 },
      { gen: msTermBalanceCheck, diff: 5 },
      { gen: msHoistRunEstimate, diff: 5 },
      { gen: oppositeValue(), diff: 4 },
      { gen: orderTemperatures('asc'), diff: 4 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, the mixed
    // weather week ordered and defended, and the claim that keeps a distance
    // from ever being read as a negative amount (+ a ramped warm-up).
    [
      { gen: wCompareSymbol, diff: 2 },
      { gen: eaMagnitudeOrder(), diff: 4 },
      { gen: orderTheWeatherWeek, diff: 3 },
      { gen: claimDistanceBelowNothing, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: what looks like a wrong answer this week is usually a right rule pushed one step past where it works. Until now, every number your child has met grew as its digits grew, so -8 reads as more than -3 for exactly the reason 8 reads as more than 3. Marking the answer wrong leaves that rule sitting underneath, untouched. Ask instead where each reading would put a lift in a building with a basement, and let the two positions settle it between them.',
  ],
  puzzle: (r) => {
    // The week's move run BACKWARDS. A day item hands over a reading and asks
    // for its opposite; here the PAIR is hidden and only the gap between them is
    // given, so the pair has to be recovered by sharing that gap across zero.
    const half = r.int(3, 24);
    const gap = 2 * half;
    return {
      id: 'E6-PZ-01',
      title: 'Puzzle Grove: The Pair That Shares Zero',
      puzzleType: 'logic',
      prompt: `Two readings on one thermometer are opposites of each other. The gap between them measures ${countNoun(gap, 'degrees')}. Write the two readings, the colder one first. Then say why no pair of opposites can ever sit an odd number of degrees apart, however large the gap.`,
      answer: {
        value: `${fmtInt(-half)}, ${fmtInt(half)}`,
        acceptableForms: [
          `${fmtInt(-half)}, ${fmtInt(half)}`,
          `${fmtInt(-half)} and ${fmtInt(half)}`,
          `${fmtInt(half)}, ${fmtInt(-half)}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'Where must a pair of opposites stand in relation to zero?',
        'Zero sits halfway along the gap, so give each side of it an equal share of what the thermometer measured.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'int-opposite-from-gap' },
  sprint: {
    skill: 'Addition within 100 — the join that measures a gap running through zero, where the two distances add',
    sourceWeek: D2,
    itemCount: 20,
    scheduledDay: 2,
    templateId: 'add_within_100_facts_v1',
    params: { min: 12, max: 74 },
  },
  mastery: [
    { gen: oppositeValue(), diff: 3 },
    { gen: msTermBalanceCheck, diff: 4 },
    { gen: orderTemperatures('desc'), diff: 3 },
    { gen: temperatureSwing(), diff: 4 },
    { gen: compareOnTheForm, diff: 3 },
    { gen: msHoistRunEstimate, diff: 4 },
  ],
  isomorphNotes:
    'Slots pair by index across the two forms: identical generator, identical difficulty, operands drawn from a separate stream so no surface is shared with Form A or with any daily page. Odd slots read a position: reflect a logged height across zero (01), order four mixed readings warmest first (03), and choose the symbol that orders a drawn pair, whose four shapes — both below zero, one either side, one sitting on zero, and two that agree — are dealt by the generator rather than by the slot (05). Even slots run a chain: recover the balance a term opened at from the balance it closed at, with the plug-back named (02); carry a station through a fall and a rise across zero (04); and walk a lift up and down a shaft whose stated depth is never used (06). Three of the six key a value below zero on a typical form and three do not, so answering everything negative certifies nobody.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'magnitude-for-value',
      description:
        'Orders two readings by how far each sits from zero rather than by where each sits, so below zero the reading with the larger digits is taken to be the larger number. The rule is not careless — it is the rule every previous number obeyed — and it survives being corrected on single answers because the child sees no reason for the correction.',
      exampleWrongAnswer: '-8 called the warmer of -8 and -3, on the grounds that 8 beats 3',
      distractorRationale:
        'Offer the reading with the greater absolute value, which is exactly what a child ordering by digits writes down.',
      reteachPointer:
        'explanation/script[1] (the digits report the climb to the street, never a height) beside script[0] (one distance, two positions)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'sign-dropped',
      description:
        'Reads a signed reading as though the minus sign were decoration: the digits are used and the side of zero is discarded, so a position below zero is placed, ordered or compared as if it stood above zero.',
      exampleWrongAnswer: 'the opposite of -24 written as -24, since the digits did not change',
      distractorRationale:
        'Offer the number the digits alone produce: the right size, standing on the wrong side of zero.',
      reteachPointer: 'explanation/script[2] (the fold at zero moves the side and leaves the distance) then guidedExamples/E6-GE-02',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'distance-for-position',
      description:
        'Answers the question the week did not ask: reports how far a reading lies from zero when the question wanted the reading itself, or reports a position when the question wanted a gap. Both quantities are on the page and only one of them is asked for.',
      exampleWrongAnswer: 'a station 12 degrees below zero reported as 12 when the question asked what it reads',
      distractorRationale:
        'Offer the absolute value where the position was wanted, since it is the number the child has genuinely worked out.',
      reteachPointer: 'explanation/whyBeforeHow (the distance out and the position along) then guidedExamples/E6-GE-01',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'move-direction-lost',
      description:
        'Chooses the right moves and walks one of them the wrong way along the line — climbing where the story falls — or spends a quantity that was only ever scenery on a calculation nobody called for.',
      exampleWrongAnswer: 'a station falling 5 then rising 3 reported two degrees above its dawn reading',
      distractorRationale:
        'Offer the result of running one move backwards, which stays plausible in size and lands on the wrong side of the start.',
      reteachPointer: 'explanation/script[3] (call the side of zero first, then walk the moves) then the Day-4 word problems',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Negative numbers — reading a signed reading as a position rather than a size, ordering readings that run either side of zero, naming a number\'s opposite as its reflection at zero, measuring how far a reading lies from zero, and following a quantity through falls and rises that cross zero.',
    improvingCandidates: [
      'ordering readings that run either side of zero',
      'naming the opposite of a reading and saying what the pair share',
      'calling which side of zero an answer will land on before working it out',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'ranking readings by where they stand rather than by how big their digits are — the lift-shaft pictures make the two apart at a glance',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping the minus sign at work: it names the side of zero, and dropping it moves the answer to the wrong half of the line',
      },
      {
        errorTag: 'task-comprehension',
        text: 'telling apart the two questions a reading can answer — where it stands, and how far from zero it lies',
      },
      {
        errorTag: 'procedure-slip',
        text: 'walking each move the way the story sends it, and leaving alone any quantity the question never asked about',
      },
    ],
    homeFocus: {
      praiseLine:
        'You compared two readings by marking them on the line instead of by counting their digits, and you called which side of zero your answer would land on before you worked it out.',
      questionForChild:
        'If the freezer reads 6 degrees below zero and the doorstep reads 2 degrees below zero, which is the colder — and which is the smaller number?',
      schoolSyncHook:
        'If your child\'s class writes a negative reading as -6, as 6 below, or with the sign set high and small, let us know and we will write it their way.',
    },
    vocabularyForParent: [
      'integer (a whole number, its opposite, or zero)',
      'opposite (the number the same distance from zero on the other side)',
      'absolute value (how far a number lies from zero, never negative)',
    ],
  },
});
