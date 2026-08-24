/**
 * Level E · Week 16 — "Proportional relationships" (conceptId:
 * proportional-relationships).
 *
 * FILL-ARCHITECTURE §6 row E16: anchor "through-the-origin line"; key multi-step
 * "find k then predict"; error-analysis "reads any increasing table as
 * proportional"; discrimination "proportional vs additive table"; Day-5
 * signature "is this relationship proportional? defend".
 *
 * THE WEEK'S CLAIM, and it closes the arc E13–E15 opened. Those three weeks
 * solved sentences with one unknown, and every one of them had the same shape:
 * something was scaled, and then a loose amount was joined on. E16 stops solving
 * and starts CLASSIFYING, and the question it asks is exactly about that loose
 * amount — because a proportional relationship is the case where it is ZERO.
 *
 *  - One number does the whole job. Divide any output by its own input and a
 *    proportional relationship hands back the same number every time. That
 *    number is k, and the relationship is y = kx.
 *  - So the graph is a straight line THROUGH THE ORIGIN, and the reason is
 *    arithmetic rather than convention: put x = 0 into y = kx and you get 0.
 *    Nothing in, nothing out.
 *  - And the misconception the recipe names falls straight out of that. "It goes
 *    up steadily, so it is proportional" is wrong because y = kx + c goes up
 *    steadily too, draws a perfectly straight line, and is not proportional: its
 *    line starts at c instead of at nothing, and its ratio y:x changes at every
 *    single row. Steady growth is not proportionality. Growth FROM NOTHING is.
 *
 * That gives the week a test a child can actually run, and it is one question:
 * what does this relationship give for none at all? A courier that charges a
 * call-out fee answers "thirty credits" and is not proportional however steady
 * its per-parcel price. A stall selling matting by the metre answers "nothing"
 * and is. The origin test is cheaper than any table check and it is the anchor.
 *
 * FIVE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3):
 *
 *  1. THE FAMILY'S OWN DISCRIMINATION IS NOT SERVED, FOR THE SECOND WEEK RUNNING,
 *     AND AGAIN THE REASON IS MEASURED. `proportionalVsAdditiveTable` builds its
 *     three tables as x·k (the key), x + c and x·k + c. Since c is positive the
 *     scattered table always outruns the proportional one, and on the last row
 *     the additive table always trails it — so the key sits strictly BETWEEN the
 *     two distractors on every single draw. "Pick the middle table by its last
 *     number" is correct 100% of the time over 4,000 draws, with no mathematics
 *     performed. That is kit §E2.11's named defect ("one below and one above on
 *     EVERY draw → pick the middle wins"), and it is structural rather than
 *     unlucky. `bb-guessability-test` does flag the generator, but under its
 *     card-identity metric, which also flags items whose repeated option texts
 *     are legitimate — the rank defect itself is unreported. Reported upward,
 *     not edited: it is a shared file.
 *
 *     `discrimWhichTableIsProportional` below asks the recipe's question with the
 *     same two honest misreadings, but draws the RANK first and then picks the
 *     distractor constants to realise it, so the proportional table lands lowest,
 *     middle and highest in turn.
 *
 *  2. THE ESTIMATE-FIRST PROBE IS THE ORIGIN TEST, ASKED BEFORE ANY ARITHMETIC.
 *     E15 learned this the expensive way: a probe about a MAGNITUDE cannot be
 *     made unguessable while it stays estimable, because its answer is a function
 *     of the numbers on the page and one of them always carries the bit. A probe
 *     about the SHAPE of the relationship has no magnitude in it at all. The
 *     courier draws between a story with a call-out charge and one without, and
 *     the probe asks what the cost comes to for none at all — decided by which
 *     sentence was drawn, never by how big any number is.
 *
 *     It is also the best possible probe for this cell, because the origin test
 *     IS the week's method. `sitDeliveryTotal` is reachable only through the
 *     wrapper (kit §E2.2), so its ladder is spent once.
 *
 *  3. `unitRate` IS SERVED AS A WARM-UP, AND IT IS THE SAME SUM AS THE WEEK'S
 *     HEADLINE. E2 asks "how many per minute?"; `constantOfProportionality` asks
 *     "what is the constant of proportionality?" — and they divide the same two
 *     numbers. That is not an accident to hide, it is the deepening: k is the
 *     unit rate a child already owns, given a name, a letter and a whole
 *     relationship to live in. But the two are kept on DIFFERENT DAYS, because
 *     `unitRate`, `constantOfProportionality` and `msFindKThenPredict` all draw
 *     from the family's four-frame RATES pool, and two of them on one page prints
 *     "A printer … at a steady rate" twice with new numbers. Every day carries at
 *     most one RATES item; that constraint, not taste, fixed the day plan.
 *
 *  4. THE ANCHOR IS DRAWN, NOT ONLY DESCRIBED. `sitGraphPoint` ships a
 *     coordinate grid with the origin, one known point and the segment joining
 *     them — the through-the-origin line, built from the item's own params. The
 *     segment STOPS at the known point: continuing it to the asked input would
 *     draw the answer (kit §F.7), so the picture shows the line the child is
 *     given and not the reading they owe.
 *
 *  5. ANSWER-IN-PROMPT AUDIT, done by construction and argued per generator.
 *     The four library generators clear theirs in the family. The four local ones
 *     clear theirs by range: matting is 11–24 credits a metre over 15–39 metres,
 *     so the total clears both; a cutter's rate is 4–9 m a minute against 90–360
 *     m of hedging, so the minutes clear the rate and fall short of the length;
 *     the courier's per-parcel charge is 3–9 credits under a 12–40 credit
 *     call-out, so no total is either; a press yields 2–7 litres per crate over
 *     6–13 crates, so the litres clear the crate count. No draw prints the number
 *     it asks for.
 *
 * Retrieval reaches back to the two weeks this one is made of — E1's equivalent
 * ratio (a proportional table is a column of equal ratios) and E2's unit rate (k
 * itself) — plus the two arithmetic moves k is found and used by, D16's exact
 * division and D15's product.
 */

import { asWarmup, classify, divideExact, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel, coordinateGrid } from '../lib/figures';
import {
  constantOfProportionality,
  eaTableAsProportional,
  msFindKThenPredict,
  ratioTableCell,
  equivalentRatioFill,
  unitRate,
} from '../lib/ratio';
import type { ItemDraft } from '../shared';
import type { ItemGen } from '../lib/multistep';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };
const E1 = { level: 'E' as const, week: 1 };
const E2 = { level: 'E' as const, week: 2 };
const E14 = { level: 'E' as const, week: 14 };

/**
 * The corpus cast (`surface.ts::PERSON_NAMES`), drawn rather than hardcoded
 * (kit §F.3). Deliberately this list and not a private one, so the assembler's
 * one-child-per-page guard can see these items — the reason E15 records at its
 * decision 5.
 */
const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/**
 * Attach a figure built from the drafted item's OWN `generator.params`, so the
 * picture cannot disagree with the answer (the QG-13 law). Local because
 * `situations.ts` carries no figure slot and it is a shared file this week does
 * not own — the same wrapper `algebra.ts` and `ratio.ts` each keep privately.
 */
function withFigure(base: ItemGen, build: (params: Record<string, unknown>) => BBFigure | undefined): ItemGen {
  return (rng, guard, difficulty) => {
    const draft: ItemDraft = base(rng, guard, difficulty);
    if (!draft.generator) return draft;
    const figure = build(draft.generator.params as Record<string, unknown>);
    return figure ? { ...draft, figure } : draft;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** E1 — the equivalent ratio. A proportional table is a column of these. */
const wRatioFill = asWarmup(equivalentRatioFill(), E1);
/**
 * E2 — the unit rate, which IS k (decision 3). Kept off every day that carries
 * a RATES-pool core item, so the week never prints the same steady-rate sentence
 * twice on one page.
 */
const wUnitRate = asWarmup(unitRate(), E2);
/** D16 — exact division: the move that recovers k from a single pair. */
const wDivide = asWarmup(divideExact(3, 11, 13, 30), D16);
/** D15 — the product: the move that spends k once you have it. */
const wMultiply = asWarmup(multiply(4, 12, 6, 24), D15);

// ---------------------------------------------------------------------------
// y = kx, used in both directions
// ---------------------------------------------------------------------------

/**
 * A steady price by the metre: k is given and the child spends it. MONEY-CHANGE.
 *
 * No leak by construction: matting runs 11–24 credits a metre over 15–39 metres,
 * so the total is larger than both numbers the prompt prints.
 */
const sitPredictAtScale = situation({
  situationType: 'money-change',
  cognitiveOp: 'proportional-predict',
  draw: (r) => {
    const perMetre = r.int(11, 24);
    const metres = r.int(15, 39);
    const name = one(r);
    return {
      prompt: `A market stall sells rush matting at ${countNoun(perMetre, 'credits')} a metre, the same price however much you buy and nothing to pay on top. ${name} orders ${countNoun(metres, 'metres')}. What does that come to?`,
      answerValue: String(perMetre * metres),
      templateId: 'ratio_rate_total_v1',
      params: { rate: String(perMetre), count: metres },
      units: 'credits',
      hints: [
        'Does this stall charge anything at all before the first metre is cut?',
        'Take the price of a single metre as many times as there are metres.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

/**
 * The same relationship run BACKWARDS: a steady rate, a total, and the time it
 * takes. MEASUREMENT.
 *
 * A painted line, not a trimmed hedge: E15 plants a windbreak along a field edge
 * one week earlier, and two adjacent weeks pacing out a line of planting is one
 * scene wearing two nouns (kit §E2.8).
 *
 * No leak by construction: the cutter runs 4–9 m a minute over 90–360 m, so the
 * minutes are larger than the rate and smaller than the length.
 */
const sitTimeForLength = situation({
  situationType: 'measurement',
  cognitiveOp: 'proportional-recover',
  draw: (r) => {
    const perMinute = r.int(4, 9);
    const minutes = r.int(15, 40);
    const metres = perMinute * minutes;
    const name = one(r);
    return {
      prompt: `A line-marking machine paints a steady ${countNoun(perMinute, 'metres')} a minute and never pauses. ${name} has ${countNoun(metres, 'metres')} of track edge to mark. How many minutes will it take?`,
      answerValue: String(minutes),
      templateId: 'ratio_k_v1',
      params: { y: metres, x: perMinute },
      units: 'minutes',
      hints: [
        'Which of these two numbers describes one minute of work, and which describes the whole job?',
        'Share the whole length into stretches the size of one minute\'s painting, and count them.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// The origin test, committed to before any arithmetic (the metacog carrier)
// ---------------------------------------------------------------------------

/**
 * A courier that either charges a call-out or does not, drawn. MONEY-CHANGE, and
 * the week's metacognition carrier — served ONLY through the wrapper below
 * (decision 2).
 *
 * THE PROBE HAS NO MAGNITUDE IN IT. Whether the cost for none at all comes to
 * nothing or to something is decided by which of the two sentences was drawn,
 * so no size on the page can hint at it and the two answers arrive equally
 * often. That is E15's finding applied on the first attempt rather than the
 * third: a probe about the SHAPE of an answer is measurable and fixable, where
 * a probe about its SIZE cannot be made unguessable while it stays estimable.
 *
 * The two branches print the same three numbers in the same places; only the
 * clause about the call-out is added or absent. Both are computed by
 * `e_alg_eval_v1`, which folds `a·x + b` — the proportional branch is simply the
 * one where b is zero, which is the whole lesson stated in params.
 *
 * No leak by construction: a parcel costs 3–9 credits and the call-out is either
 * zero or 12–40, so the total clears every number printed.
 */
const sitDeliveryTotal = situation({
  situationType: 'money-change',
  cognitiveOp: 'proportional-classify-total',
  draw: (r) => {
    const perParcel = r.int(3, 9);
    const parcels = r.int(6, 18);
    // The call-out is stated in BOTH stories, and in the proportional one it is
    // stated as zero rather than left out. Omitting it printed two numbers where
    // the other story printed three, and "count the numbers" then answered the
    // probe 100% of the time — a child could sort the two kinds apart without
    // once reading what any number was for. Writing the zero also happens to be
    // the better teaching: the two stories are now the same sentence differing in
    // one value, which is exactly the week's claim about c.
    const b = r.int(0, 1) === 1 ? r.int(12, 40) : 0;
    const name = one(r);
    return {
      prompt: `A courier charges ${countNoun(b, 'credits')} to come out, whatever the load, and a further ${countNoun(perParcel, 'credits')} for every parcel carried. ${name} sends ${countNoun(parcels, 'parcels')}. What does the delivery come to?`,
      answerValue: String(perParcel * parcels + b),
      templateId: 'e_alg_eval_v1',
      params: { a: perParcel, x: parcels, b },
      units: 'credits',
      hints: [
        'Which of these charges is made once for the whole delivery, and which is made again for every parcel?',
        'Settle what the parcels themselves come to, then add anything that was charged before the first one was loaded.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const sitDeliveryTotalEstimate = withEstimateFirst(
  sitDeliveryTotal,
  'will a delivery of no parcels at all come to nothing, or to something?',
);

// ---------------------------------------------------------------------------
// The anchor, drawn (decision 4)
// ---------------------------------------------------------------------------

/**
 * One point, the origin, and the line joining them — then a reading further
 * along it. RATE-OF-CHANGE, and the only item in the week that puts the anchor
 * on the page as a picture rather than as a sentence.
 *
 * The segment stops at the KNOWN point. Continuing it to the asked input would
 * draw the answer the item exists to ask for (kit §F.7), so the picture carries
 * the given and the child carries the reading.
 *
 * No leak by construction: k is 3–9 and the known input 2–5, so the known output
 * is 6–45; the asked input is at least three beyond the known one, so the answer
 * exceeds every number printed.
 */
const sitGraphPoint = withFigure(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'proportional-read-graph',
    draw: (r) => {
      const k = r.int(3, 12);
      const x0 = r.int(2, 6);
      const x1 = x0 + r.int(3, 7);
      return {
        prompt: `The points of this relationship lie on one straight line through the origin. The line is drawn as far as ${fmtInt(x0)} hours, where it reaches ${countNoun(k * x0, 'litres')}. How many litres has it reached at ${fmtInt(x1)} hours?`,
        answerValue: String(k * x1),
        // NOT `ratio_table_cell_v1`, whose `answerFor` refuses a row that is not
        // a whole multiple of the first one. Meeting that would force the asked
        // hour to be a multiple of the given hour on every draw, which turns
        // reading a line into integer scaling — the one thing this item is not
        // for. The rate-total template folds k × hours directly, so the asked
        // hour stays free. `x0`/`y0` ride along for the figure, which is built
        // from these same params and so cannot disagree with the answer.
        templateId: 'ratio_rate_total_v1',
        params: { rate: String(k), count: x1, x0, y0: k * x0 },
        units: 'litres',
        hints: [
          'What is true of every point on a line that passes through the origin?',
          'Work out what one hour is worth from the point you were given, then take as many of those as the question asks.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const x0 = Number(p.x0);
    const y0 = Number(p.y0);
    const xMax = Number(p.count) + 1;
    const yMax = y0 + Math.max(4, Math.round(y0 / 2));
    return coordinateGrid(
      {
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        step: 1,
        points: [
          { x: 0, y: 0, label: '0', style: 'point' },
          { x: x0, y: y0, label: fmtInt(y0), style: 'point' },
        ],
        segments: [{ from: [0, 0], to: [x0, y0] }],
        showAxisLabels: true,
      },
      {
        alt: `a grid with hours across and litres up, a line drawn from the origin as far as the point ${fmtInt(x0)} hours ${fmtInt(y0)} litres, and no line beyond it`,
      },
    );
  },
);

// ---------------------------------------------------------------------------
// Discrimination — which table is the proportional one (decision 1)
// ---------------------------------------------------------------------------

/** Every table is read at the same three inputs, so the child compares like with like. */
const TABLE_INPUTS = [2, 5, 8] as const;
const tableText = (f: (x: number) => number): string =>
  TABLE_INPUTS.map((x) => `${fmtInt(x)} → ${fmtInt(f(x))}`).join(', ');

/**
 * The recipe's discrimination, with the RANK DRAWN.
 *
 * Two honest misreadings, both of them the week's content: a table that climbs
 * by a fixed amount added, and a table that climbs by a steady multiple with a
 * fixed start. What is drawn first is WHERE the proportional table's last output
 * should land among the three, and the distractor constants are then chosen to
 * put it there — so it is the smallest, the middle and the largest in turn, and
 * no rank habit beats chance. The library's own version fixes the key at the
 * middle on every draw (decision 1).
 */
const discrimWhichTableIsProportional = discrimination({
  variant: 'structural',
  cognitiveOp: 'classify-relationship',
  draw: (r) => {
    const X = TABLE_INPUTS[TABLE_INPUTS.length - 1];
    const k = r.int(5, 8);
    // 0 = the proportional table has the SMALLEST last output, 2 = the largest.
    const rank = r.int(0, 2);
    const belowAdd = rank > 0;   // the added-amount table trails the key
    const belowMul = rank > 1;   // the steady-multiple-plus-a-start table trails it too
    // A fixed amount added: below the key when the amount is small, above when it
    // is large enough to outrun the whole scaling.
    const c = belowAdd ? r.int(2, 9) : k * X - X + r.int(2, 9);
    // A steady multiple with a start: shallower to trail the key, steeper to lead
    // it. Its start is never zero, which is exactly what disqualifies it.
    //
    // The shallower slope is drawn one OR two steps below k, not fixed at one.
    // Fixed at k−1 the offset table's FIRST cell was 2(k−1) + d ≥ 2k for every
    // legal d, so it never dipped under the proportional table's opening 2k —
    // and "the smallest first cell is the proportional one" measured 50.5%
    // against a 33% floor. Two steps down puts that cell either side, which
    // costs nothing and closes the last rank the last-column rotation left open.
    // (Three steps of headroom, not two, so the shallower line can also open
    // BELOW the proportional one rather than only level with it.)
    const m = belowMul ? k - r.int(1, 3) : k + 1;
    const d = r.int(2, 7);
    return {
      prompt: 'Three tables were built from three different rules. Which one shows a proportional relationship?',
      correct: tableText((x) => k * x),
      distractors: [
        {
          text: tableText((x) => x + c),
          errorTag: 'concept-misconception',
          rationale: 'Climbs by the same amount added at every step, which looks steady and is not proportional: divide each output by its own input and the answer changes on every row.',
        },
        {
          text: tableText((x) => m * x + d),
          errorTag: 'representation-misread',
          rationale: 'Climbs by a steady multiple and then carries a fixed start on top of it, so its graph is a straight line that misses the origin — the exact relationship this week exists to tell apart from a proportional one.',
        },
      ],
      hints: [
        'What has to be the same in every single row of a proportional table?',
        'Divide each output by its own input, right along the table, and keep the one that gives you the same number every time.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — find k, then spend it
// ---------------------------------------------------------------------------

/**
 * HAS-DISTRACTOR. A press whose yield is proportional to what goes in, with a
 * barrel count that is stated, never used, and exactly the number a child is
 * invited to divide by.
 *
 * Olives, not apples: `ratio.ts` already carries "A cider press" with its juice
 * and its vat in the pool E5 draws from, so a cider press here would put one
 * scene into two Level-E weeks (kit §E2.8, L24).
 *
 * No leak by construction: a crate yields 2–7 litres and 6–13 crates go in, so
 * the answer is larger than the crate count, the yield and the barrel count, and
 * smaller than nothing else the prompt prints.
 */
const msOlivePress = multiStep({
  situationType: 'rate',
  cognitiveOp: 'proportional-scale-up',
  posing: 'has-distractor',
  draw: (r) => {
    const perCrate = r.int(2, 7);
    const firstCrates = r.int(3, 8);
    const crates = firstCrates * r.int(2, 4);
    const barrels = r.int(14, 22);
    const name = one(r);
    return {
      prompt: `An olive press gives the same yield from every crate of olives. ${name} put ${countNoun(firstCrates, 'crates')} through it and drew off ${countNoun(firstCrates * perCrate, 'litres')}. The barn holds ${countNoun(barrels, 'barrels')}. How many litres will ${countNoun(crates, 'crates')} give?`,
      initN: crates,
      steps: [
        { op: 'div', n: firstCrates, d: 1 },
        { op: 'mul', n: firstCrates * perCrate, d: 1 },
      ],
      units: 'litres',
      hints: [
        'Which of the numbers here count crates, which count litres, and which counts something the question never asks about?',
        'Work out how the bigger load compares with the first one, then grow the litres by that same comparison.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * The recipe's Day-5 signature: decide, and defend. Fixed prose, because the
 * demand is on the argument rather than the arithmetic — and the three parts are
 * named separately so a bare verdict cannot pass as an answer.
 */
const defendProportional = reasoning({
  prompt:
    'A boat yard charges 40 credits to launch a rowing boat, and 12 credits for every hour the boat is out. Say whether the relationship between hours and total cost is proportional. Defend your answer in three parts: what the cost comes to for no hours at all, what the total divided by the hours gives for 2 hours and then for 5 hours, and what those two answers together tell you.',
  value:
    'not proportional; no hours still costs 40; 64 ÷ 2 = 32 against 100 ÷ 5 = 20, so the cost per hour is not the same and the line starts at 40 rather than at the origin',
  acceptableForms: ['not proportional', '40', '32', '20', 'it starts at 40', 'does not go through the origin'],
  keywords: true,
  hints: [
    'What would this yard charge somebody who launched a boat and brought it straight back in?',
    'Work out the total for two different numbers of hours, divide each total by its own hours, and hold the two results against each other.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim that states the anchor as a rule. It keys NEVER — the first Level-E
 * Always/Sometimes/Never item to do so, after two SOMETIMES weeks and one
 * ALWAYS, so the reflex answer is wrong again this week for a different reason.
 * A starting amount is not a small blemish on proportionality; it is precisely
 * the thing that ends it.
 */
const proportionalNeverStarts = classify({
  prompt:
    'Always, sometimes, or never true: a proportional relationship can start from an amount that is not zero. In one sentence, name what a relationship with a starting amount is doing instead.',
  correct: 'never',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale: 'Treats the starting amount as a detail that some proportional relationships happen to carry, rather than as the one feature that rules proportionality out — which is the reading behind calling any steady climb proportional.',
    },
    {
      text: 'always',
      errorTag: 'representation-misread',
      rationale: 'Reads "starts from an amount" as describing the first row of the table rather than the value at an input of zero, so a relationship that simply begins its table part-way along looks like it has a start.',
    },
  ],
  hints: [
    'What does a proportional relationship give back when nothing at all goes in?',
    'Put an input of zero into the rule and see what comes out, then decide whether any other answer could belong to the same family.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE16 = makeWeekBuilder({
  level: 'E',
  week: 16,
  conceptId: 'proportional-relationships',
  conceptName: 'Proportional relationships',
  strandTags: ['algebra-geometry', 'multiplication-division'],
  prerequisiteWeeks: [E1, E2, E14],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the line that goes through the origin',
  conceptFamily: 'operation',
  deepeningDelta:
    'E1 and E2 built the machinery: a ratio survives multiplication of both terms, and a unit rate says what ONE of something is worth. E16 turns that pair into a claim about a whole relationship and gives it a test. The unit rate becomes k, the constant of proportionality, and the relationship becomes y = kx — which means the same k has to come back from every row, not just from the row it was found on. And because k multiplies the input and nothing is added to it, the graph is forced through the origin, which hands the child a one-question test that E1 and E2 had no reason to need: what does this give for none at all? That test is also what separates this week from E13 to E15, where every sentence had a loose amount joined on. A proportional relationship is exactly the case where that loose amount is zero.',
  explanation: {
    hook:
      'Two things grow together. One of them is paid for entirely by the other — nothing arrives before the first unit does, and nothing is held back. That is a particular kind of growing, it is commoner than any other, and it has a picture you can recognise across a room.',
    whyBeforeHow:
      'A relationship is proportional when one number does the whole job. Divide any output by its own input and a proportional relationship hands you back the same number every time, because that is what being proportional means: the output is always that number of times the input, written y = kx, and k is called the constant of proportionality. It is not a new idea so much as a unit rate promoted — what one of something is worth, made responsible for the whole relationship. And it forces a picture, which is why we work with the line that goes through the origin: put an input of zero into y = kx and the output is zero, so the line has nowhere to start except at nothing. That is the test worth having, because it is a single question and it settles the thing children most often get wrong. Going up steadily is NOT the same as being proportional. A hall that charges to open up and then charges by the hour also climbs steadily, and also draws a perfectly straight line — but its line starts partway up, its cost for no hours at all is not nothing, and the total divided by the hours gives a different answer every time you ask. One matching row proves nothing at all. The same k, from every row, or it is not proportional.',
    script: [
      {
        say: 'Here are two costs side by side for the same three hours of hire. On the left, a hall that simply charges twelve credits an hour: three hours, thirty-six credits. On the right, a hall that charges forty credits to open up and then twelve an hour: three hours, seventy-six credits. Both go up by twelve for every extra hour. Both are perfectly steady. Only one of them is proportional, and you cannot tell which by looking at how fast they climb.',
        visual: 'The two costs for the same three hours, to one scale — the right-hand bar carries a block that was there before the first hour.',
        figure: barModel(
          [
            { label: 'twelve an hour, nothing else', segments: [{ value: 12 }, { value: 12 }, { value: 12 }], total: '36' },
            { label: 'forty to open up, then twelve an hour', segments: [{ value: 40, label: '40', fill: 'hatch' }, { value: 12 }, { value: 12 }, { value: 12 }], total: '76' },
          ],
          { scaleMax: 76, alt: 'a bar of three equal 12 blocks totalling 36, beside a longer bar of a hatched 40 block followed by three 12 blocks totalling 76' },
        ),
      },
      {
        say: 'So I ask the question that separates them, and it takes one second. What does each one cost for no hours at all? The first costs nothing — no hours, no charge, and that is the whole bill. The second still costs forty, because the forty was never about the hours. That is the difference, and it is the only difference that matters. A proportional relationship gives nothing back for nothing put in.',
        visual: 'What each hall charges before a single hour is used.',
        figure: barModel(
          [
            { label: 'no hours, first hall', segments: [{ value: 0.01 }], total: '0' },
            { label: 'no hours, second hall', segments: [{ value: 40, label: '40', fill: 'hatch' }] },
          ],
          { scaleMax: 76, alt: 'an empty bar for the first hall, beside a hatched bar of 40 for the second' },
        ),
      },
      {
        say: 'Now watch what that does to the picture. I plot the first hall: one hour twelve, two hours twenty-four, three hours thirty-six, and the points march up a straight line that runs right back into the corner where both axes meet. That corner is the origin, and the line goes through it because zero hours cost zero credits. Every proportional relationship draws this line. If you can see the line and it misses the corner, the relationship is not proportional, and you have not had to do any arithmetic to know it.',
        visual: 'The first hall plotted: three points on a line running back into the origin.',
        figure: coordinateGrid(
          {
            xMin: 0, xMax: 4, yMin: 0, yMax: 48, step: 1,
            points: [
              { x: 0, y: 0, label: '0', style: 'point' },
              { x: 1, y: 12, style: 'point' },
              { x: 2, y: 24, style: 'point' },
              { x: 3, y: 36, label: '36', style: 'point' },
            ],
            segments: [{ from: [0, 0], to: [3, 36] }],
            showAxisLabels: true,
          },
          { alt: 'a grid with hours across and credits up, four points climbing in a straight line from the origin to 3 hours 36 credits' },
        ),
      },
      {
        say: 'Two habits, and the first one costs nothing. Before I work anything out I decide what SHAPE the relationship has, by asking what it gives for none at all — the words settle that, and no amount of arithmetic ever will. Then at the end I check k on a row I did not use. If I found k from the first row, I test it on the last one: does that output divided by that input give me the same number back? One row agreeing proves nothing, and I have seen a table where the first row agreed by luck and every other row disagreed. Two rows agreeing is evidence. Every row agreeing is the thing itself.',
        visual: 'The same k tested on a row it was not found on.',
        figure: barModel(
          [
            { label: 'the row k was found on', segments: [{ value: 12 }], total: '12' },
            { label: 'a row it was tested on', segments: [{ value: 12 }, { value: 12 }, { value: 12 }], total: '36' },
          ],
          { scaleMax: 36, alt: 'a single 12 block beside a bar of three 12 blocks totalling 36, drawn to the same scale' },
        ),
      },
    ],
    summary:
      'A relationship is proportional when one number k does the whole job: every output is k times its own input, written y = kx. Divide any output by its own input and a proportional relationship gives the same k back every time — from every row, not just the row you found it on. Because nothing is added to kx, an input of zero gives an output of zero, so the graph is a straight line through the origin. That is the fastest test there is, and it is the one that catches the mistake worth catching: a relationship can climb perfectly steadily, draw a perfectly straight line, and still not be proportional, because its line starts partway up instead of at nothing.',
    vocabulary: [
      { term: 'proportional relationship', kidGloss: 'one where every output is the same number of times its own input' },
      { term: 'constant of proportionality', kidGloss: 'that number, written k — the output for a single unit of the input' },
      { term: 'y = kx', kidGloss: 'the equation of every proportional relationship: input scaled by k, and nothing added' },
      { term: 'origin', kidGloss: 'the corner of a graph where both axes meet, at zero across and zero up' },
      { term: 'unit rate', kidGloss: 'what one of something is worth — the same number as k, met a fortnight earlier' },
    ],
  },
  guidedExamples: [
    {
      ...ge(16, 1, 'modeled', 'A pump moves water at a steady rate: 84 litres in 7 minutes. Find k, then say how many litres in 19 minutes.', [
        {
          teacherSay:
            'I read what kind of relationship this is before I touch the numbers. The pump was not doing anything before it started, so no litres arrive without minutes — nothing in, nothing out. That tells me it is proportional and that one number will describe all of it.',
        },
        {
          teacherSay:
            'So I want that number, and it is what a single minute is worth. I divide the litres by the minutes they took. What does that give me?',
          expected: '12',
        },
        {
          childDo: 'Test that k on the row you were given — multiply it by 7 and hold the result against 84 — then use it to answer the question that was asked.',
          expected: '228',
        },
      ], '228'),
      visual: 'The pump plotted at the row it was given, with the line running back to the origin.',
      figure: coordinateGrid(
        {
          xMin: 0, xMax: 8, yMin: 0, yMax: 96, step: 1,
          points: [
            { x: 0, y: 0, label: '0', style: 'point' },
            { x: 7, y: 84, label: '84', style: 'point' },
          ],
          segments: [{ from: [0, 0], to: [7, 84] }],
          showAxisLabels: true,
        },
        { alt: 'a grid with minutes across and litres up, a line from the origin to the point 7 minutes 84 litres' },
      ),
    },
    {
      ...ge(16, 2, 'completion', 'A table pairs 3 with 21, 5 with 35 and 8 with 56. Is it proportional, and what is k?', [
        {
          teacherSay: 'Testing one row would tell me almost nothing. What do I have to do to every row before I am entitled to call this proportional?',
          expected: 'divide each output by its own input and check they all agree',
        },
        {
          childDo: 'Run that check along all three rows, then state k and say what the relationship would give for an input of zero.',
          expected: '7',
        },
      ], '7'),
      visual: 'The three rows of the table, each as its own pair, drawn to one scale.',
      figure: barModel(
        [
          { label: '3 pairs with 21', segments: [{ value: 21, label: '21' }] },
          { label: '5 pairs with 35', segments: [{ value: 35, label: '35' }] },
          { label: '8 pairs with 56', segments: [{ value: 56, label: '56' }] },
        ],
        { scaleMax: 56, alt: 'three bars of 21, 35 and 56 drawn to one scale' },
      ),
    },
    ge(16, 3, 'prompted', 'A courier charges 25 credits for the call-out and 6 credits a parcel. Say whether the relationship between parcels and total cost is proportional, and give the reason in one sentence.', [
      {
        childDo: 'Work out what the courier charges for no parcels at all, and let that answer settle the question.',
        expected: 'not proportional — no parcels still costs 25',
      },
    ], 'not proportional'),
    {
      // Independent stage: the two given rows only. Deciding whether the rows
      // agree is the task, so a line drawn through them would hand over the
      // verdict the item exists to ask for (L33).
      ...ge(16, 4, 'independent', 'A relationship pairs 4 with 30 and 10 with 75. Decide whether it is proportional, state k if it is, and predict the output at 14. Solve cold.', [
        { childDo: 'Divide each output by its own input before you predict anything, and only trust a single k if both rows hand you the same one.', expected: '105' },
      ], '105'),
      visual: 'The two pairs you were handed. Whether one line joins them to the corner is yours to decide.',
      figure: barModel(
        [
          { label: '4 pairs with 30', segments: [{ value: 30, label: '30' }] },
          { label: '10 pairs with 75', segments: [{ value: 75, label: '75' }] },
        ],
        { scaleMax: 75, alt: 'two bars of 30 and 75 drawn to one scale; no line and no third row is shown' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: k found, k spent, k read off a line. Single-step
    // only; no chains and no choices yet. One RATES item, and it is the core one.
    [
      { gen: wRatioFill, diff: 2 },
      { gen: wMultiply, diff: 2 },
      { gen: wDivide, diff: 2 },
      { gen: constantOfProportionality(), diff: 3 },
      { gen: sitPredictAtScale, diff: 3 },
      { gen: sitGraphPoint, diff: 3 },
    ],
    // Day 2 — fluency + application: the origin test committed to before any
    // arithmetic, and the three-table decision. The RATES item here is the E2
    // warm-up, which is the same sum as Day 1's headline wearing its old name.
    [
      { gen: wDivide, diff: 2 },
      { gen: wUnitRate, diff: 2 },
      { gen: sitDeliveryTotalEstimate, diff: 3 },
      { gen: discrimWhichTableIsProportional, diff: 4 },
      { gen: sitTimeForLength, diff: 3 },
      { gen: sitGraphPoint, diff: 3 },
    ],
    // Day 3 — interleave: the two chains sit between the table decision and two
    // single-step readings, so nothing on the page signals what is coming next.
    [
      { gen: wRatioFill, diff: 2 },
      { gen: msFindKThenPredict(), diff: 4 },
      { gen: discrimWhichTableIsProportional, diff: 3 },
      { gen: msOlivePress, diff: 4 },
      { gen: ratioTableCell(), diff: 3 },
      { gen: sitPredictAtScale, diff: 3 },
    ],
    // Day 4 — word problems: both chains, the origin commitment again, and two
    // single-step items, so "it must be a chain" never becomes the cue.
    [
      { gen: msFindKThenPredict(), diff: 5 },
      { gen: msOlivePress, diff: 5 },
      { gen: sitDeliveryTotalEstimate, diff: 4 },
      { gen: ratioTableCell(), diff: 4 },
      { gen: sitTimeForLength, diff: 4 },
    ],
    // Day 5 — written: the one-row-agreed error-analysis, the defence the recipe
    // asks for, and the claim that makes the starting amount decisive.
    [
      { gen: wMultiply, diff: 2 },
      { gen: eaTableAsProportional(), diff: 4 },
      { gen: defendProportional, diff: 3 },
      { gen: proportionalNeverStarts, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the mistake this week exists to catch does not look like a mistake, because the child\'s reasoning is half right. They see a table climbing steadily and call it proportional — and steadiness really is part of it, so nothing feels wrong. The missing half is that the climb has to start from nothing. If you see it, do not correct the table. Ask what the relationship would give for none at all: a taxi that charges before it moves, a boat yard that charges to launch. That one question settles it every time, and it is the habit worth taking away from the week.',
  ],
  puzzle: (r) => {
    // ONE PAIR, TWO RELATIONSHIPS. The week's whole claim run as a construction:
    // a single row is consistent with infinitely many rules, so the child builds
    // the two readings it allows and measures the gap between them. A single
    // Day-1 reading produces none of the three numbers asked for.
    const k = r.int(5, 9);
    const x0 = r.int(3, 6);
    const y0 = k * x0;                 // the one pair both readings must honour
    const x1 = x0 + r.int(8, 12);      // where the two readings are compared
    // The second reading's start is a whole number of x0s, which is what keeps
    // its own multiple whole without a redraw: start = j·x0 forces m = k − j.
    // j runs 2 to k−2, so both readings climb by at least 2 and the gap between
    // them is never x1 itself.
    const j = r.int(2, k - 2);
    const start = j * x0;
    const m = k - j;
    const proportional = k * x1;
    const withStart = m * x1 + start;
    const gap = proportional - withStart;   // = j·x1, and always positive
    // What is provably absent from the prompt: the proportional reading, which is
    // at least 55 against a largest printed value of 54; and the second reading,
    // since withStart = y0 would force x1 = x0. The gap can coincide with the
    // stated output on some draws — which hands over nothing, because a child
    // cannot know which printed number to copy or where it would sit in the
    // ordered three.
    return {
      id: 'E16-PZ-01',
      title: 'Puzzle Grove: One Pair, Two Readings',
      puzzleType: 'construction',
      prompt: `A relationship pairs an input of ${fmtInt(x0)} with an output of ${fmtInt(y0)}. That single pair is all you are told, and it is not enough. Read it first as proportional, and second as a relationship that starts at ${fmtInt(start)} and then climbs by a steady multiple. Write three numbers in order: what the first reading gives at an input of ${fmtInt(x1)}, what the second reading gives at the same input, and the gap between them. Then say in one sentence why one pair could never have settled this.`,
      answer: {
        value: `${proportional}, ${withStart}, ${gap}`,
        acceptableForms: [
          `${proportional} ${withStart} ${gap}`,
          `${proportional}, ${withStart}, ${gap}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'How many different rules could pass through one single point on a graph?',
        'Build each reading on its own — find the multiple each one uses, then run both out to the input you were asked about.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'proportional-two-readings' },
  sprint: {
    skill: 'Exact division within the tables — the move that recovers k from a single pair',
    sourceWeek: D16,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'div_facts_v1',
    params: { min: 2, max: 12 },
  },
  mastery: [
    { gen: sitPredictAtScale, diff: 3 },
    { gen: msFindKThenPredict(), diff: 4 },
    { gen: sitTimeForLength, diff: 3 },
    { gen: msOlivePress, diff: 4 },
    { gen: sitGraphPoint, diff: 3 },
    { gen: sitDeliveryTotalEstimate, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: y = kx in three representations — k given and spent on a steady price (money-change), k given and the relationship run backwards to recover a time (measurement), and k read off a line drawn through the origin (rate-of-change, carrying the grid). 02/04: chains — recover k from one pair and predict at another input, and scale a proportional yield up from a first run while a stated barrel count goes deliberately unused. 06: a total that may or may not carry a one-off charge, behind a commitment to the shape of the answer made before any arithmetic. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'steady-climb-read-as-proportional',
      description: 'Takes a steadily rising table or a straight-line graph to be proportional, because the climb is even and nothing about it looks wrong. The half that is missing is where the climb starts: a relationship with a fixed amount already in place rises just as evenly, draws a line just as straight, and gives a different output-to-input ratio on every row.',
      exampleWrongAnswer: 'a yard charging 40 to launch and 12 an hour called proportional because every extra hour adds the same 12',
      distractorRationale: 'Offer the table or the total that a fixed start produces, so only the value at an input of zero — or a ratio taken twice — separates it from the proportional reading.',
      reteachPointer: 'explanation/script[1] (what each one costs for no hours at all), then script[2] (the line that misses the corner)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'one-row-taken-as-proof',
      description: 'Finds k from a single row and treats the relationship as settled, so a rule that happens to agree on one row is carried across the whole table. One pair is consistent with any number of rules; it is the rows the child did not use that decide.',
      exampleWrongAnswer: 'a rule confirmed on the row it was found on and never tested on a second one',
      distractorRationale: 'Offer the value a second, equally plausible rule through the same single pair produces, so the item turns on testing a row that was not used.',
      reteachPointer: 'guidedExamples/E16-GE-02 (the check run along every row), then the Day-5 error-analysis',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'k-inverted',
      description: 'Divides the input by the output instead of the output by its own input, so k arrives upside down — the minutes per litre where the question asked for litres per minute. The arithmetic is sound and the relationship really is proportional; only the direction of the division is wrong.',
      exampleWrongAnswer: 'a rate of 7 minutes per 84 litres reported as the constant of proportionality',
      distractorRationale: 'Offer the reciprocal reading of the same pair, so only attention to which quantity is being counted per unit of the other separates it from k.',
      reteachPointer: 'guidedExamples/E16-GE-01 (what a single minute is worth), then explanation/whyBeforeHow',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'spends-the-scenery',
      description: 'Uses every number the story states, including one that belongs to the setting rather than the question, so a barn\'s barrel count is folded in as an extra division. The tell is that the spare figure counts a different thing from the answer: barrels are not litres, and no arithmetic turns one into the other.',
      exampleWrongAnswer: 'the litres from a load of apples shared again between the barrels standing in the barn',
      distractorRationale: 'Offer what the stated but unwanted quantity produces when it is folded in as one more step.',
      reteachPointer: 'the two chains on Days 3 and 4, where the unused figure counts something the answer is not measured in',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Proportional relationships — recognising when one number describes a whole relationship, finding that number (the constant of proportionality, k) from a single pair and then testing it on rows it was not found on, writing the relationship as y = kx, and using the fastest test there is: what does this give for none at all?',
    improvingCandidates: [
      'testing k on a row it was not found on before trusting it',
      'asking what a relationship gives for an input of zero',
      'telling a steady climb apart from a proportional one',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'seeing why a straight, steady climb is not enough — the climb has to start from nothing',
      },
      {
        errorTag: 'representation-misread',
        text: 'treating one agreeing row as a hint rather than as proof, and checking a second',
      },
      {
        errorTag: 'procedure-slip',
        text: 'dividing the output by its own input, so k comes out the right way up',
      },
      {
        errorTag: 'task-comprehension',
        text: 'spotting when a stated figure counts containers while the answer counts what goes inside them, and leaving the barn out of the arithmetic',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked your constant on a row you had not used, and you noticed the charge that was there before anything started — that pair of habits is the whole week.',
      questionForChild: 'A taxi charges 3 credits the moment you get in, then 2 credits a kilometre. A bus charges 2 credits a kilometre and nothing to get on. Both go up by 2 for every kilometre — so what makes only one of them proportional?',
      schoolSyncHook: 'If your child\'s class writes the constant as "k", as a unit rate, or as the gradient of the line, tell us and we will match what they use.',
    },
    vocabularyForParent: [
      'proportional relationship (every output is the same number of times its own input)',
      'constant of proportionality (that number, k — the same as the unit rate)',
      'the origin (where a proportional graph must start: nothing in, nothing out)',
    ],
  },
});
