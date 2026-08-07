/**
 * Level C · Week 14 — "Multiply by tens" (conceptId: multiply-by-tens).
 *
 * FILL-ARCHITECTURE §5 row C14: anchor "3 × 4 tens"; multi-step "multiply then
 * add"; error-analysis "the zero dropped (3 × 40 = 12)"; discrimination
 * "3 × 40 against 3 × 4"; Day-5 signature "how many zeros, and WHY".
 *
 * THE CLAIM THIS WEEK MAKES. A ten is one thing you can count. So multiplying by
 * a ten does not multiply the number — it multiplies the COUNT OF TENS, and the
 * answer is a fact the child already owns wearing a new place: 3 × 40 is 3 × 4
 * tens, which is 12 tens, which is 120. The week is written against the trick a
 * child otherwise learns here, because "add a zero" is a rule about a MARK and
 * this is a fact about a UNIT — the rule survives exactly as long as the numbers
 * are whole, and dies at the first decimal. So the content is built to make the
 * unit visible rather than the mark:
 *  - the anchor item hands over the digit fact and draws it in a place-value
 *    chart, so the child can see that the answer is those same digits standing
 *    one column to the left and nothing else;
 *  - a second item draws one group AS TENS (a bar cut into ten-segments), which
 *    is the same claim in the other representation;
 *  - the sharp pair is a discrimination between counting the things and counting
 *    the rows of ten they come in, and a second one that puts "ten TIMES" against
 *    "ten more" — the additive misreading of place value, which is the belief the
 *    dropped zero and the appended zero both grow out of;
 *  - three chains: tens-then-a-loose-remainder (where the answer stops ending in
 *    zero), tens-minus-tens (where it does not), and an inverse-start whose
 *    opening move is dividing a stated total BY TEN to discover how many tens it
 *    was made of;
 *  - Day 5 asks the "why" the recipe names — not "how many zeros" as a count, but
 *    what the zero is doing standing in the ones column.
 *
 * THE ERROR-ANALYSIS, and why its verify template comes from another family
 * (kit §E2.3, declared here rather than buried). The recipe names "the zero
 * dropped": 3 × 40 answered 12. I spent the ten minutes §E2.3's first bullet
 * asks for, hunting the C4-style identity that would make it derivable from
 * `d_verify_binop_misconception_v1` (correct = a op b, wrong = a wrongOp b over
 * ONE operand pair). It is not there, and the reason is structural rather than
 * unlucky: the zero-drop of a·b is a·b/10, so an operation swap reproduces it
 * only where a ∘ b = a·b/10 — for '+' that is (a−10)(b−10) = 100, whose whole
 * solution set ((12,60), (15,30), (20,20) …) sits outside a single-digit ×
 * multiple-of-ten band; for '−' it is a = 10b/(10−b), which admits only
 * 10 × 5, 40 × 8 and 90 × 9. Worse, every such pair is AMBIGUOUS by construction:
 * where the swap output equals the zero-drop output, the shown number has two
 * readings and the item can no longer diagnose one (kit §E2.7).
 *
 * `stat_verify_graph_scale_v1` expresses the misconception EXACTLY and honestly.
 * Its transform is `{count, key} → {correct: count·key, wrong: count}` — a count
 * of units reported as a bare count, with the worth of one unit thrown away.
 * With `key = 10` and `count` = the number of tens, `correct` is the true product
 * and `wrong` is that product with its ten missing, both code-computed by a
 * registered template. The arithmetic is plain whole-number arithmetic and the
 * misconception is the week's own, despite the template living in the stats
 * family, where C23 will meet the graph-symbol instance of the same slip
 * ("3 symbols read as 3"). Nothing is invented; and the student's own working
 * line in the prompt is TRUE — "3 × 4 tens is 12 tens" is right — so there is no
 * digit to re-check and the only way into the item is to say what the 12 counts.
 *
 * FIGURE LAW as applied here (kit §F.7, §E2.5). Two day items carry a picture and
 * each shows a GIVEN:
 *  - the anchor's place-value chart holds the digit fact the prose has already
 *    handed over, asserted against the item's own drawn param. It shows which
 *    column each digit stands in — the reason the answer is what it is — and it
 *    cannot leak, because the chart reads the fact and the answer is ten times it;
 *  - the tens-bar draws ONE group cut into its tens, asserted against the stated
 *    group size. How many groups there are is still the child's to use.
 * The pictures that show a finished journey — an array of tens counted out, the
 * digits standing in their new columns — live where the answer is already on the
 * page: the lesson script and the guided examples.
 *
 * Retrieval is backward-only into C2 (rounding to the nearest ten, the arithmetic
 * an estimate runs on), C3 (addition within 1,000), C7 (the ×10 fact this week
 * generalises) and C9 (sharing, whose inverse move Day 4 needs).
 */

import { addWhole, asWarmup, classify, multiply, reasoning, roundWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor, wholeMoney } from '../lib/format';
import { frame } from '../lib/contexts';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel } from '../lib/figures';
import type { BBFigure, FigureAssertion, PlaceName } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C1 = { level: 'C' as const, week: 1 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C7 = { level: 'C' as const, week: 7 };
const C9 = { level: 'C' as const, week: 9 };
const C11 = { level: 'C' as const, week: 11 };
const C12 = { level: 'C' as const, week: 12 };
const C13 = { level: 'C' as const, week: 13 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/** The noun pool of a registry frame; the container word and grammar are local. */
const nounOf = (r: Rng, id: string): string => r.pick(frame(id).nouns);

/**
 * The tens digit of the multiplier, and the multiple of ten it names. Every core
 * item in this week draws this pair rather than a bare two-digit number, because
 * `t` — the COUNT of tens — is the thing the whole concept operates on, and an
 * item that never names it cannot ask about it.
 */
const tensOf = (t: number): number => 10 * t;

// ---------------------------------------------------------------------------
// withFigure / placeValueChart
//
// The shipped primitives (situation / multiStep) carry no figure slot and lib/
// is not ours to edit, so the wrapper does what `withEstimateFirst` does: all of
// it happens inside the returned closure, it takes no new rng draw, and it
// leaves the prompt — and therefore the QG-1/QG-4 surface signature — untouched.
// It reads the drafted item's `generator.params`, the very numbers the answer was
// computed from, so "built from the item's own drawn values" holds by
// construction. `placeValueChart` is the local builder for the one figure family
// lib/figures.ts exposes no helper for; it emits the same schema and the same
// `asserts` clause QG-13 re-derives. (Pattern established by c03/c04.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

function placeValueChart(
  value: number,
  opts: { highlight?: PlaceName; showValues?: boolean; alt: string; asserts?: FigureAssertion },
): BBFigure {
  return {
    type: 'place-value-chart',
    alt: opts.alt,
    params: {
      digits: String(value),
      ...(opts.highlight ? { highlight: opts.highlight } : {}),
      ...(opts.showValues !== undefined ? { showValues: opts.showValues } : {}),
    },
    ...(opts.asserts ? { asserts: opts.asserts } : {}),
  };
}

/** A two-digit chart read column by column, for the picture's accessible name. */
function twoDigitChartAlt(value: number): string {
  const s = String(value);
  return `a tens-and-ones chart holding the fact that is already known, with ${s[0]} standing in the tens column and ${s[1]} in the ones`;
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000, the join that finishes a two-part load. */
const wAdd = asWarmup(addWhole(105, 475), C3);

/**
 * C2 — rounding to the nearest ten. Not decoration: an estimate this week is
 * always a count of tens, so the week's size-check is built on Monday's warm-up.
 */
const wRoundTen = asWarmup(roundWhole(1, 112, 489), C2);

/** C7 — the ×10 fact in its plainest form, which is the whole week in one line. */
const wTenFact = asWarmup(multiply(2, 9, 10, 10), C7);

/** C9 — sharing a total into equal groups, the inverse move Day 4 opens with. */
const wJarShare = asWarmup(
  situation({
    situationType: 'sharing',
    cognitiveOp: 'div-exact',
    draw: (r) => {
      const per = r.int(3, 9);
      const jars = r.int(3, 9);
      const name = one(r);
      return {
        prompt: `${name} shares ${countNoun(per * jars, 'marbles')} equally between ${countNoun(jars, 'jars')}. How many marbles go into one jar?`,
        answerValue: String(per),
        templateId: 'd_div_v1',
        params: { a: per * jars, b: jars },
        units: 'marbles',
        hints: [
          'Is the question about the whole handful, or about one jar of it?',
          'Ask what number, taken once for every jar, would build the pile back up again.',
        ],
        errorTags: ['fact-recall', 'task-comprehension'],
      };
    },
  }),
  C9,
);

// ---------------------------------------------------------------------------
// Single-step situations — the same claim from five different angles
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR ITEM. The story hands over the digit fact, and the chart draws it —
 * so the two things the child has to hold are on the page as separate objects:
 * the fact, and the columns its digits stand in. The answer is that fact with
 * every digit one column to the left, which is the whole week; the picture makes
 * the columns visible and can never hand the answer over, because it reads the
 * small fact and the answer is ten times it.
 */
const sitKnownFactShift = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'mul',
    usesPriorSkill: true,
    draw: (r) => {
      let t = r.int(2, 9);
      const a = r.int(3, 9);
      // A one-digit fact would give the chart a single column and nothing to
      // shift. One deterministic step, never a redraw loop (kit §E2.4): only
      // (3,2) and (4,2) fall short, and stepping the tens digit clears both.
      if (a * t < 10) t += 2;
      const noun = nounOf(r, 'bead-craft');
      const name = one(r);
      return {
        prompt: `[image: a tens-and-ones chart holding the fact ${name} already knows] ${name} knows that ${a} × ${t} = ${a * t} without stopping to think. Every drawer in the bead shop holds ${countNoun(tensOf(t), noun)}. How many ${unitFor(2, noun)} are in ${countNoun(a, 'drawers')}?`,
        answerValue: String(a * tensOf(t)),
        templateId: 'd_mul_v1',
        params: { a, b: tensOf(t), known: a * t },
        units: noun,
        hints: [
          'Which small fact is hiding inside this one?',
          'Work the small fact first. Every one of those stands for a whole ten. Say what that many tens comes to.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) =>
    placeValueChart(numOf(p, 'known'), {
      showValues: true,
      highlight: 'tens',
      alt: twoDigitChartAlt(numOf(p, 'known')),
      asserts: assertsParam('known', 'value'),
    }),
);

/**
 * The same claim in the other representation: one group drawn AS TENS. The bar
 * is a given — the story states what a basket holds — and how many baskets there
 * are is still the child's to use, so nothing about the total is on the page.
 */
const sitBasketOfTens = withFigure(
  situation({
    situationType: 'rate',
    cognitiveOp: 'mul',
    draw: (r) => {
      const t = r.int(2, 9);
      const a = r.int(3, 9);
      const noun = nounOf(r, 'orchard');
      const name = one(r);
      return {
        prompt: `[image: one basket, drawn as its tens] A basket in the orchard packs ${countNoun(tensOf(t), noun)} — that is ${countNoun(t, 'tens')}. ${name} fills ${countNoun(a, 'baskets')}. How many ${unitFor(2, noun)} is that?`,
        answerValue: String(a * tensOf(t)),
        templateId: 'd_mul_v1',
        params: { a, b: tensOf(t), tens: t },
        units: noun,
        hints: [
          'Is a basket here holding single things, or bundles of ten?',
          'Count how many tens the baskets hold between them. Then read that many tens as a number.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  (p) =>
    barModel(
      [
        {
          label: 'one basket',
          segments: Array.from({ length: numOf(p, 'tens') }, () => ({ value: 10, label: '10' })),
          total: String(numOf(p, 'b')),
        },
      ],
      {
        scaleMax: numOf(p, 'b'),
        alt: `one bar cut into ${countNoun(numOf(p, 'tens'), 'equal parts')}, each part holding ten`,
        asserts: assertsParam('b'),
      },
    ),
);

/**
 * A LENGTH rather than a count, so "ten of them" has to be heard as a distance.
 * No picture: a drawn lap would only restate its own stated length, and the work
 * here is holding the unit steady while the count grows.
 */
const sitTrackLaps = situation({
  situationType: 'measurement',
  cognitiveOp: 'mul',
  draw: (r) => {
    const t = r.int(2, 9);
    const a = r.int(3, 9);
    const name = one(r);
    return {
      prompt: `One lap of the playground track measures ${countNoun(tensOf(t), 'm')}. ${name} runs ${countNoun(a, 'laps')} without stopping. How far does ${name} run?`,
      answerValue: String(a * tensOf(t)),
      templateId: 'd_mul_v1',
      params: { a, b: tensOf(t) },
      units: 'm',
      hints: [
        'How many tens of metres does a single lap cover?',
        'Take the short fact the two numbers make. Then let each one stand for ten metres.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The same equal-groups structure spread over TIME, which is the reading most
 * likely to be heard as an addition — a run of days feels like something being
 * added up rather than something being taken a number of times.
 */
const sitFairVisitors = situation({
  situationType: 'rate-of-change',
  cognitiveOp: 'mul',
  draw: (r) => {
    const t = r.int(2, 9);
    const a = r.int(3, 9);
    const noun = nounOf(r, 'attendance');
    const name = one(r);
    return {
      prompt: `${name} counts ${countNoun(tensOf(t), noun)} through the door of the school book fair. That happens on every day it opens. The fair runs for ${countNoun(a, 'days')}. How many ${unitFor(2, noun)} come to the fair in all?`,
      answerValue: String(a * tensOf(t)),
      templateId: 'd_mul_v1',
      params: { a, b: tensOf(t) },
      units: noun,
      hints: [
        'Does each day bring a different number through the door, or the same number again?',
        'Say how many tens arrive over the whole run. Then write that count of tens as a number.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, so its
 * ladder is counted once (kit §E2.2). The probe is this week's own size check:
 * a total built from tens can be bracketed before a single digit is written,
 * because the count of tens is a fact the child already owns.
 *
 * The bracket can never be a tie: a whole-dollar pass priced in tens and bought
 * in single-digit numbers cannot total exactly five hundred (that would need a
 * digit pair multiplying to fifty, and neither factor may reach ten).
 */
const sitPassPrice = situation({
  situationType: 'money-change',
  cognitiveOp: 'mul',
  draw: (r) => {
    const t = r.int(2, 9);
    const a = r.int(3, 9);
    const name = one(r);
    return {
      prompt: `A day pass to the water park costs ${wholeMoney(tensOf(t))}. ${name} buys ${countNoun(a, 'passes')} for the group. How much is that in all?`,
      answerValue: String(a * tensOf(t)),
      templateId: 'd_mul_v1',
      params: { a, b: tensOf(t) },
      units: 'dollars',
      acceptableForms: [wholeMoney(a * tensOf(t))],
      hints: [
        'Would it help to price one pass in tens of dollars first?',
        'Work the price and the number of passes as a small fact. Then let each one count ten dollars.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});
const sitPassPriceEstimate = withEstimateFirst(
  sitPassPrice,
  'will the passes come to more than five hundred dollars, or to less?',
);

// ---------------------------------------------------------------------------
// Multi-step — the recipe's "multiply then add", and the two chains that make
// the zero on the end an OUTCOME rather than a rule
// ---------------------------------------------------------------------------

/**
 * Tens, then a loose remainder. The first move is the week's; the second breaks
 * the run of tens, so the answer is the one on the page that does NOT end in a
 * zero — which is the evidence Day 5's "why" argument is built from.
 */
const msSacksAndBox = multiStep({
  situationType: 'multi-stage',
  draw: (r) => {
    // Tens only to fifty here, unlike the rest of the week: a sack nobody could
    // lift is a detail a child notices before the arithmetic (kit §E2.8), and
    // the concept does not need the top of the range to be exercised twice.
    const t = r.int(2, 5);
    const a = r.int(3, 9);
    const extra = r.int(3, 9);
    const noun = nounOf(r, 'weighing');
    const name = one(r);
    return {
      prompt: `Every ${unitFor(1, noun)} in the store weighs ${countNoun(tensOf(t), 'kg')}. ${name} loads ${countNoun(a, noun)} onto the trailer. Then a toolbox weighing ${countNoun(extra, 'kg')} goes on beside them. What weight is on the trailer?`,
      initN: tensOf(t),
      steps: [
        { op: 'mul', n: a, d: 1 },
        { op: 'add', n: extra, d: 1 },
      ],
      units: 'kg',
      hints: [
        'Which part of this load is made of equal tens, and which part is not?',
        'Settle the equal ones first. Bring the odd weight in only after that.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * Tens minus tens. Its twin above lands off the tens; this one stays on them, and
 * the pair together is the argument: the zero is there when nothing is left over
 * for the ones column, and gone the moment something is.
 */
const msPalletsThenOff = multiStep({
  situationType: 'combine',
  draw: (r) => {
    const t = r.int(2, 9);
    const a = r.int(3, 9);
    // Taken back off in whole tens, and never more than the smallest load this
    // item can build (three pallets of twenty), so the answer stays positive.
    const off = tensOf(r.int(2, 5));
    const noun = nounOf(r, 'water-jug');
    const name = one(r);
    return {
      prompt: `A pallet at the depot takes ${countNoun(tensOf(t), noun)}. ${name} loads ${countNoun(a, 'pallets')} onto the lorry, then lifts ${countNoun(off, noun)} back off. How many ${unitFor(2, noun)} are on the lorry?`,
      initN: tensOf(t),
      steps: [
        { op: 'mul', n: a, d: 1 },
        { op: 'sub', n: off, d: 1 },
      ],
      units: noun,
      hints: [
        'Are both moves in this story working in whole tens?',
        'Build the full load first. Take the returned amount off it. Then look at the ones column.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The stated quantity is the RESULT
 * of packing in tens, so the opening move is a division the sentence order never
 * offers: how many boxes there are has to be recovered from the total before a
 * single pencil can be taken out of each. That is this week's claim read
 * backwards — a whole number of tens tells you how many tens it was made of —
 * and it is the hardest honest thing the concept can ask.
 */
const msPencilBoxes = multiStep({
  situationType: 'sharing',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const boxes = r.int(12, 28);
    const each = r.int(2, 6);
    const noun = nounOf(r, 'shop-change');
    const name = one(r);
    return {
      prompt: `The stock cupboard holds ${countNoun(10 * boxes, noun)}, packed ten to a box. ${name} takes ${countNoun(each, noun)} out of every box for the art table. How many ${unitFor(2, noun)} go to the art table in all?`,
      initN: 10 * boxes,
      steps: [
        { op: 'div', n: 10, d: 1 },
        { op: 'mul', n: each, d: 1 },
      ],
      units: noun,
      hints: [
        'Does the story tell you how many boxes there are?',
        'Break the whole count into its tens to find the number of boxes. Only then take what is asked from each one.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the recipe's "3 × 40 against 3 × 4", forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DISCRIMINATION — 3 × 40 against 3 × 4, forced as a choice. What a
 * tray holds is deliberately NOT stated: the story gives the rows of ten and
 * nothing else, so the child has to build the forty before any option can be
 * matched, and the tempting one is the calculation made of the two numbers that
 * ARE printed. That option is not a slip of arithmetic — it is the right answer
 * measured in the wrong unit, which is the same mistake the dropped zero makes.
 * The third option takes a single row of ten from each tray, the other way to
 * leave the count in tens, and it is why this registers as a cross-op trap.
 */
const discrimCountTheRightThing = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-operation',
  draw: (r) => {
    const t = r.int(3, 9);
    const a = r.int(3, 9);
    const name = one(r);
    return {
      prompt: `A tray of eggs is packed in ${countNoun(t, 'rows')} of ten. ${name} stacks ${countNoun(a, 'trays')}. Which calculation gives the number of EGGS?`,
      correct: `${a} × ${tensOf(t)}`,
      distractors: [
        {
          text: `${a} × ${t}`,
          errorTag: 'representation-misread',
          rationale: 'Multiplies the two numbers the story prints, which counts the rows across the stacked trays. Every row holds ten eggs, so this is the right total measured in tens rather than in eggs.',
        },
        {
          text: `${a} × 10`,
          errorTag: 'task-comprehension',
          rationale: 'Takes one row of ten from every tray and leaves the rest of each tray uncounted.',
        },
      ],
      hints: [
        'How many eggs does one whole tray hold?',
        'Work out what one tray holds before you look at the options. Then find the calculation that uses that number.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * The sibling, and the sharpest sentence on the page: ten TIMES against ten MORE.
 * The additive misreading of place value is the belief both the dropped zero and
 * the appended zero grow out of, so it is put here as a claim to be chosen
 * between rather than warned against. The second distractor is the over-shift —
 * two places for one ten — which is the same misreading with the sign flipped.
 */
const discrimTenTimesNotTenMore = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const t = r.int(2, 9);
    const a = r.int(3, 9);
    const known = a * t;
    const name = one(r);
    return {
      prompt: `${name} works out ${a} × ${t} and lands on ${known}. Then ${name} works out ${a} × ${tensOf(t)}. Which sentence describes the second answer?`,
      correct: `ten times ${known}`,
      distractors: [
        {
          text: `ten more than ${known}`,
          errorTag: 'concept-misconception',
          rationale: 'Reads the change from ones to tens as an amount added on once, when every one of the groups grew by a factor of ten.',
        },
        {
          text: `a hundred times ${known}`,
          errorTag: 'procedure-slip',
          rationale: 'Shifts the answer two columns for a single ten, as though what each group holds had grown to a hundred.',
        },
      ],
      hints: [
        'Does a group ten times bigger add a fixed amount, or multiply?',
        'Try both calculations on a number small enough to count out. Then put the two answers side by side.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the header note. `stat_verify_graph_scale_v1` computes the truth as
// count × key — the number of tens, each worth ten — and the shown wrong value as
// the bare count, which is the genuine output of naming a count of tens as though
// it were a count of ones. Every line the student writes is TRUE, so re-checking
// the digits finds nothing; the only way in is to say what the number counts.
// ---------------------------------------------------------------------------

const eaTensCountedAsOnes = errorAnalysis({
  verifyTemplateId: 'stat_verify_graph_scale_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const t = r.int(2, 9);
    const a = r.int(3, 9);
    return { count: a * t, key: 10, a, t };
  },
  build: (v, p) => {
    const a = numOf(p, 'a');
    const t = numOf(p, 't');
    return {
      prompt: `A student was asked to work out ${a} × ${tensOf(t)}. Their page reads: ${a} groups of ${countNoun(t, 'tens')}. Then ${a} × ${t} is ${a * t}, so that is ${countNoun(a * t, 'tens')}. On the answer line the student has written ${v.wrong}.`,
      extension: 'Write down the number the answer line should carry. Then write one sentence saying what the student\'s figure was counting.',
      hints: [
        'What is the student counting when that number goes down on the line?',
        'Name the unit the count is in. Then say what that many are worth in single things.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC14 = makeWeekBuilder({
  level: 'C',
  week: 14,
  conceptId: 'multiply-by-tens',
  conceptName: 'Multiply by tens',
  strandTags: ['multiplication-division', 'number-sense-counting'],
  prerequisiteWeeks: [C1, C7, C11, C13],
  pedagogyContract: 'v2',
  conceptualAnchor: '3 × 4 tens',
  conceptFamily: 'operation',
  deepeningDelta:
    'C11 and C13 both built a hard fact out of an easy one, but the two facts always lived in the same place: 6 × 7 and 5 × 7 count the same kind of thing. C14 changes the UNIT instead of the fact. The digits do not move at all — 3 × 4 is still 3 × 4 — and what changes is what each of the twelve is worth, which is why the answer is the known fact standing one column to the left rather than a new fact to learn. That is also the first time a product has to be read as a count of something other than ones, which is what C15 will need when a fraction names a part.',
  explanation: {
    hook:
      'Nobody has to learn 3 × 40. If you know 3 × 4, you have known 3 × 40 all along. It is that same answer standing one place further left.',
    whyBeforeHow:
      'A ten is one thing you can count. That is why multiplying by a ten never needs a new fact. 3 × 40 is 3 × 4 tens. Every one of the three groups holds four TENS rather than four ones. So the counting is the counting you already do. Only the size of what you are counting has changed. Four tens taken three times is twelve tens, and twelve tens is 120. Look at what happened to the digits. Nothing was added to them. The 1 and the 2 are the digits of the fact you already owned. Each of them slid one column to the left. So the 2 that was worth two is now worth twenty. That left the ones column with nothing in it. The zero on the end is what says so. Hold on to that reason rather than the rule "add a zero". A zero added on is only a mark. What really happened is that every digit changed what it is worth.',
    script: [
      {
        say: 'Watch me meet 3 × 40. I do not know it, but I do know 3 × 4. So I look hard at what these groups are holding. Three groups, four in each. Except that every one of those four is a whole ten. So what I have laid out is twelve tens, not twelve.',
        visual: 'Three rows of four blocks, with a ten written inside every block.',
        figure: areaGrid(
          { rows: 3, cols: 4, cellLabels: Array.from({ length: 12 }, () => '10') },
          { alt: 'three rows of four blocks, with the number ten written inside every one of the twelve blocks' },
        ),
      },
      {
        say: 'Now I read twelve tens as a number. Ten tens make one hundred, and two tens are twenty. So twelve tens is 120. And look where the digits went. The 1 and the 2 are the digits of the fact I started from. Each has moved one column to the left. The 1 that stood for one ten now stands for one hundred. Nothing was added to my fact. It changed places.',
        visual: 'A place-value chart holding one hundred and twenty, with the tens column marked.',
        figure: placeValueChart(120, {
          showValues: true,
          highlight: 'tens',
          alt: 'a hundreds-tens-ones chart with 1 in the hundreds column, 2 in the tens and 0 in the ones, and the tens column marked',
        }),
      },
      {
        say: 'Before I write anything down I check that the size is sensible. Three fours is twelve. Three forties has to be about ten times that. So somewhere near a hundred, and nowhere near a thousand. My answer came out at 120. Straight away I could see it was the right size. That check costs nothing.',
        visual: 'A short bar for three fours beside a long bar for three forties.',
        figure: barModel(
          [
            { label: 'three fours', segments: [{ value: 12, label: '12' }] },
            { label: 'three forties', segments: [{ value: 120, label: '120' }] },
          ],
          { scaleMax: 120, alt: 'a very short bar of twelve beside a bar of one hundred and twenty, drawn to the same scale' },
        ),
      },
      {
        say: 'One last look at that zero. It is the part people turn into a trick. Here is my old fact on its own. The 2 sits in the ones column, worth two single things. In my new answer the ones column is empty. Twelve tens is a whole number of tens with nothing left over. The zero is not something I added. It reports that there is nothing in that column. Give my story one more single thing, and that column would not be zero.',
        visual: 'A place-value chart holding twelve, with the ones column marked.',
        figure: placeValueChart(12, {
          showValues: true,
          highlight: 'ones',
          alt: 'a tens-and-ones chart with 1 in the tens column and 2 in the ones, and the ones column marked',
        }),
      },
    ],
    summary:
      'Multiplying by a ten multiplies the COUNT of tens. So the answer is a fact you already know wearing a new place. Work the small fact. Then remember that each one of them is a ten. The digits slide one column to the left. The ones column is left empty. The zero on the end is what reports that. Change the story so something IS left over, and the zero goes.',
    vocabulary: [
      { term: 'a ten', kidGloss: 'a bundle of ten ones, counted as a single thing' },
      { term: 'multiple of ten', kidGloss: 'a number you land on counting in tens, like 20, 30 or 40' },
      { term: 'place', kidGloss: 'the column a digit stands in, which decides what that digit is worth' },
      { term: 'place holder', kidGloss: 'a zero standing in an empty column to keep the other digits where they belong' },
    ],
  },
  guidedExamples: [
    {
      ...ge(14, 1, 'modeled', 'A crate of oranges holds 30 oranges. How many oranges are in 6 crates?', [
        {
          teacherSay:
            'I do not know 6 × 30, so let me find the fact underneath it. Six threes I am sure of — that is 18. Now watch what the crates are actually holding: three TENS each, not three. So what I have just counted is eighteen tens.',
        },
        {
          teacherSay: 'Eighteen tens. What number is that?',
          expected: '180',
        },
        {
          childDo: 'Say what the 1 and the 8 are worth where they now stand.',
          expected: 'one hundred and eight tens',
        },
      ], '180'),
      visual: 'Six rows of three blocks, with a ten written inside every block.',
      figure: areaGrid(
        { rows: 6, cols: 3, cellLabels: Array.from({ length: 18 }, () => '10') },
        { alt: 'six rows of three blocks, with the number ten written inside every one of the eighteen blocks' },
      ),
    },
    {
      ...ge(14, 2, 'completion', 'A shelf holds 20 tins. How many tins are on 7 shelves?', [
        { teacherSay: 'The fact sitting underneath this one is seven twos. What is seven twos?', expected: '14' },
        { childDo: 'Now say what those fourteen are counting, and give the number of tins.', expected: '140' },
      ], '140'),
      visual: 'A place-value chart holding the answer, with the tens column marked.',
      figure: placeValueChart(140, {
        showValues: true,
        highlight: 'tens',
        alt: 'a hundreds-tens-ones chart with 1 in the hundreds column, 4 in the tens and 0 in the ones',
        asserts: assertsAnswer,
      }),
    },
    ge(14, 3, 'prompted', 'Ria works out 8 × 50. Name the fact she should start from. Say what it is counting, then give the answer.', [
      { childDo: 'Say the small fact out loud, then say what each one of them is worth.', expected: '400' },
    ], '400'),
    ge(14, 4, 'independent', 'A path is laid in 9 rows with 60 paving stones in every row. How many paving stones are in the path? Solve cold.', [
      { childDo: 'Work the fact underneath first, then decide what column each digit of it belongs in.', expected: '540' },
    ], '540'),
  ],
  days: [
    // Day 1 — concept echo: the claim in three single-step models, with the two
    // pictures that carry the place-value reason.
    [
      { gen: wAdd, diff: 2 },
      { gen: wRoundTen, diff: 2 },
      { gen: wJarShare, diff: 2 },
      { gen: sitBasketOfTens, diff: 2 },
      { gen: sitTrackLaps, diff: 3 },
      { gen: sitKnownFactShift, diff: 3 },
    ],
    // Day 2 — fluency + application: the size call made before any arithmetic,
    // and the unit trap.
    [
      { gen: wTenFact, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: sitPassPriceEstimate, diff: 3 },
      { gen: discrimCountTheRightThing, diff: 4 },
      { gen: sitFairVisitors, diff: 3 },
      { gen: sitBasketOfTens, diff: 3 },
    ],
    // Day 3 — interleave: both traps beside a chain and two plain facts, so the
    // shape of the page never tells the child which move is coming.
    [
      { gen: wRoundTen, diff: 2 },
      { gen: discrimTenTimesNotTenMore, diff: 4 },
      { gen: discrimCountTheRightThing, diff: 4 },
      { gen: msSacksAndBox, diff: 4 },
      { gen: sitKnownFactShift, diff: 3 },
      { gen: sitTrackLaps, diff: 3 },
    ],
    // Day 4 — word problems: the three chains, including the inverse-start one,
    // with two single-step stories mixed in so "it must be two steps" never
    // becomes the cue the child reads instead of the story.
    [
      { gen: msSacksAndBox, diff: 4 },
      { gen: msPencilBoxes, diff: 5 },
      { gen: msPalletsThenOff, diff: 4 },
      { gen: sitFairVisitors, diff: 4 },
      { gen: sitPassPriceEstimate, diff: 4 },
    ],
    // Day 5 — non-computational: the tens-counted-as-ones error analysis, the
    // why-the-zero argument, and the claim that kills the additive reading.
    [
      { gen: wJarShare, diff: 2 },
      { gen: eaTensCountedAsOnes, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Work out 4 × 20, 4 × 30 and 4 × 50. Every one of your three answers ends in a zero. Write one or two sentences saying WHY that zero has to be there. Say what the zero is doing in the answer. Say what would stand in its place if it were not a zero.',
          value:
            'each answer is a whole number of tens, so nothing at all is left over for the ones column; the zero holds that column empty, and any other digit there would mean some single ones were left over',
          acceptableForms: ['whole number of tens', 'nothing in the ones', 'ones column', 'holds the column', 'no ones left over'],
          keywords: true,
          hints: [
            'What would have to be left over for that last digit to change?',
            'Write each of your answers as a number of tens. Then look at the ones column of each one.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes or never true: 7 × 60 is ten more than 7 × 6. Choose one, then write a sentence giving your reason.',
          correct: 'never',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Reads the extra zero as an amount added on once to the answer, when it names a bigger unit inside every one of the groups.',
            },
            {
              text: 'sometimes',
              errorTag: 'representation-misread',
              rationale: 'Expects the relationship to depend on which numbers are used, when both calculations always have the same number of groups and each group is always ten times as big.',
            },
          ],
          hints: [
            'How much bigger does a group get when ones become tens?',
            'Work both calculations out on paper. Put the two answers side by side before you choose.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: your child will meet the shortcut "just add a zero" somewhere this year, and it works — until decimals arrive, where it quietly stops working and nobody can say why. So when a question like 6 × 40 comes up, ask "what is 6 × 4?" and then "and what is each of those worth?". The zero on the end is then something your child can explain rather than something they remember, and that explanation is what survives.',
  ],
  puzzle: (r) => {
    // A search whose payoff is a REASON: a second zero appears only when the two
    // digits make another ten between them, so the hunt is really for a five
    // beside an even number. The pools guarantee at least one hit (an even digit
    // is always present and fifty is always on the card), so the puzzle is never
    // empty and the completeness claim is always worth arguing.
    const evens = [2, 4, 6, 8] as const;
    const seedDigit = r.pick(evens);
    const rest = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9].filter((d) => d !== seedDigit)).slice(0, 3);
    const digits = [seedDigit, ...rest].sort((x, y) => x - y);
    const otherTens = r.shuffle([20, 30, 40, 60, 70, 80, 90]).slice(0, 3);
    const tens = [50, ...otherTens].sort((x, y) => x - y);
    const pairs: string[] = [];
    for (const d of digits) for (const T of tens) if ((d * T) % 100 === 0) pairs.push(`${d} × ${T}`);
    const name = one(r);
    return {
      id: 'C14-PZ-01',
      title: 'Puzzle Grove: The Second Zero',
      puzzleType: 'logic',
      prompt: `${name} is hunting for products that end in TWO zeros. The top row is ${digits.join(', ')}. The bottom row is ${tens.join(', ')}. One number must come from each row. Write down EVERY pair whose product ends in two zeros. Then explain how you know no pair is missing.`,
      answer: {
        // A `set`: the task is the whole list, and a child who finds the easy
        // pair has not yet made the argument the puzzle is asking for.
        value: pairs.join('; '),
        acceptableForms: [pairs.join(', '), pairs.join(' ')],
        validation: 'set',
      },
      hintLadder: [
        'A product from these rows already ends in one zero. What would have to happen for a second one to appear?',
        'Take one number from the top row. Try it against every number in the bottom row. Keep the two digits you multiply first in view.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'pattern-search' },
  sprint: {
    // mult_facts_v1 reads only factorRange (a `tables` param is silently
    // ignored and the range defaulted to [2,9]), so the old "×8 and ×9" label
    // was false as served. Declare the real range honestly.
    skill: 'Multiplication facts to nine — the digit facts a multiply-by-tens answer stands on',
    sourceWeek: C12,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sitKnownFactShift, diff: 3 },
    { gen: msSacksAndBox, diff: 4 },
    { gen: sitBasketOfTens, diff: 3 },
    { gen: msPencilBoxes, diff: 4 },
    { gen: sitTrackLaps, diff: 3 },
    { gen: msPalletsThenOff, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step multiplications by a ten in three representations — the handed-over digit fact with its place-value chart, one group drawn as its tens with the tens bar, and a length taken a number of times — with both figure affordances preserved. 02/04/06: the three chains — tens then a loose remainder, the inverse-start cupboard whose stated total must first be broken into its tens, and tens taken back off tens. Operand surfaces are drawn fresh per slot but uniqueness is NOT enforced across forms or days; where a fact space is small, a mastery item can coincide with the operands of a daily item.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'tens-counted-as-ones',
      description:
        'Works the digit fact correctly and then reports that count as the answer, so a number of TENS is written down as though it were a number of single things.',
      exampleWrongAnswer: '3 × 40 answered as 12',
      distractorRationale: 'Offer the product of the two digits on its own, with the ten stripped out of it.',
      reteachPointer: 'explanation/script[1] (twelve tens read as a number, with the digits one column to the left)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-the-wrong-unit',
      description:
        'Picks the calculation that counts the rows or the bundles rather than the things inside them, so the answer is right but measured in tens.',
      exampleWrongAnswer: '7 trays of 4 rows of ten answered as 28',
      distractorRationale: 'Offer the calculation built from the count of tens instead of the count of single things.',
      reteachPointer: 'guidedExamples/C14-GE-01 (name what has been counted before writing the number down)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'one-ten-per-group',
      description:
        'Takes a single ten out of each group rather than all the tens the group holds, leaving most of every group uncounted.',
      exampleWrongAnswer: '6 crates of 30 answered as 60',
      distractorRationale: 'Offer the count of groups multiplied by ten.',
      reteachPointer: 'explanation/script[0] (every block in the picture is a ten, and all of them count)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'shifted-two-places',
      description:
        'Moves the digits two columns for a single ten, as though what each group holds had grown to a hundred, so an extra zero arrives on the end.',
      exampleWrongAnswer: '3 × 40 answered as 1,200',
      distractorRationale: 'Offer the true product with one more zero written on it.',
      reteachPointer: 'explanation/script[2] (the size check: about ten times the small fact, and no more)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'no-fact-underneath',
      description:
        'Hunts for the whole multiplication by a ten as a single remembered fact and guesses when it will not come, rather than starting from the one-digit fact inside it.',
      exampleWrongAnswer: '8 × 50 answered as 450',
      distractorRationale: 'Offer a near-miss product of the kind an unsure recall produces.',
      reteachPointer: 'guidedExamples/C14-GE-03 (name the small fact first), then the 2-minute facts sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Multiplying by tens — 4 × 30, 7 × 60 and the like — worked out from place value rather than from a shortcut. A ten is one thing you can count, so 3 × 40 is 3 × 4 tens: the answer is a fact your child already knows, standing one column further to the left, and the zero on the end is a report that the ones column is empty.',
    improvingCandidates: [
      'naming the one-digit fact hiding inside a multiplication by tens',
      'saying what a counted number is counting before writing it down',
      'checking the size of an answer against the small fact it was built from',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reading a count of tens as a count of tens, so the answer goes down in single things',
      },
      {
        errorTag: 'representation-misread',
        text: 'telling the number of bundles apart from the number of things inside them',
      },
      {
        errorTag: 'procedure-slip',
        text: 'moving the digits one column for one ten, rather than two',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted in tens and then checked what each digit was worth before you wrote the answer down — that is exactly the move this week is built on.',
      questionForChild: 'What is 6 times 4? So what is 6 times 40 — and what is different about what each group is holding?',
      schoolSyncHook: 'If your child\'s class teaches this as "add a zero", tell us and we will keep both the shortcut and the reason in play so the reason is still there when decimals arrive.',
    },
    vocabularyForParent: [
      'a ten (a bundle of ten ones, counted as one thing)',
      'place (the column a digit stands in, which sets what it is worth)',
      'place holder (the zero that keeps an empty column open)',
    ],
  },
});
