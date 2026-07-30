/**
 * Level C · Week 3 — "Addition within 1,000" (conceptId: addition-within-1000).
 *
 * FILL-ARCHITECTURE §5 row C3: anchor "column + regroup"; multi-step "three
 * addends; add-then-estimate check"; error-analysis "carry dropped across the
 * hundreds"; discrimination "one-regroup vs two-regroup"; Day-5 signature "two
 * strategies for one sum".
 *
 * THE HAZARD THIS WEEK CARRIES, AND WHAT WAS DONE ABOUT IT. The concept IS the
 * written algorithm, so the lazy version of this week is five pages of column
 * sums wearing five different nouns. Depth here therefore comes from WHERE the
 * trade happens and WHY, and the content is built on a single drawn primitive —
 * `columns(r, shape)` — that produces a sum with a NAMED regroup structure:
 *   `none` (every column settles) · `ones` (one trade, low) · `tens` (one trade,
 *   and it is the one that crosses into the hundreds) · `both` (two trades) ·
 *   `through-zero` (the trade lands in a column holding a zero and still fills
 *   it, so the carry travels two columns).
 * Every situation in the week names its shape, so the pages differ by their
 * arithmetic STRUCTURE and not by their nouns. The metacognition item draws its
 * shape fresh each time and asks the child to say, BEFORE computing, whether any
 * column will need a trade at all — a question that is only a real question
 * because the shape genuinely varies.
 *
 * ⚠ THE VERIFY-LIBRARY LIMIT, DECLARED (FANOUT kit §E2.3). The recipe's
 * error-analysis is "a carry DROPPED across the hundreds", i.e. a total that is
 * exactly one hundred short. That value is not derivable: `errorAnalysis` may
 * only show a number a registered `verifyFor` recomputes, and the only whole-
 * number template varies the OPERATION over one fixed pair. Solving
 * `a op b = X` together with `a op' b = X − 100` over {+,−,×,÷} forces either
 * b = 50 (so the shown slip reads as a plain subtraction, which is C5's item,
 * not this week's) or a degenerate ×1 whose "misconception transform" is not
 * anything a child does. Fabricating the number is forbidden, so per the kit's
 * §E2.3 order:
 *   - the DROPPED carry is shown where it can be computed honestly — it is a
 *     code-derived option in `discrimWhichTotal` (the total a sum reaches when
 *     the traded hundred never lands), it is the subject of the Day-5
 *     Always/Sometimes/Never claim, and it is named in the mistake bank;
 *   - Day 5's generated error-analysis carries the complementary slip at the SAME
 *     boundary, which IS derivable and whose transform is genuinely the child's
 *     move: the hundred traded out of the tens is taken OFF the hundreds line
 *     rather than joined to it (op '+' vs wrongOp '−' over the hundreds line and
 *     the traded hundred). Addition and subtraction algorithms are learned in the
 *     same fortnight — C3 beside C4 — and a trade sent the wrong way across that
 *     boundary is the interference this pair of weeks produces.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7): a picture on an assessed item
 * shows a GIVEN. The place-value charts hold ONE stated addend, so the chart
 * teaches what a column is worth and can never total anything; the comparison
 * bar draws the amount the story names and leaves the whole braced as unknown;
 * the three-addend bar draws the three stated days at a scale set by the LONGEST
 * DAY, never by the total, so no axis can be read for the answer. Pictures that
 * carry a finished sum live in the lesson script and in the modeled guided
 * example, where the answer is already printed.
 *
 * Retrieval is backward-only into B13 (two-digit column addition with
 * regrouping — the exact algorithm this week widens by one column) and into
 * C1/C2 (digit value, rounding, comparison), the three skills the estimate check
 * runs on.
 */

import { addWhole, asWarmup, classify, compareWhole, digitValue, reasoning, roundWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, barModel } from '../lib/figures';
import type { BBFigure, FigureAssertion, PlaceName } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B13 = { level: 'B' as const, week: 13 };
const C1 = { level: 'C' as const, week: 1 };
const C2 = { level: 'C' as const, week: 2 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// columns() — the week's drawn primitive
//
// A 3-digit + 3-digit sum whose REGROUP STRUCTURE is chosen, not left to luck.
// Every range below is closed by construction (lo ≤ hi for every draw), so a
// shape never needs a redraw loop: a loop would consume a variable number of rng
// draws and make every later item in the pack depend on this one (L19).
//
// Two invariants hold for every shape: both addends are genuine 3-digit numbers,
// and the total stays under 1,000 — the ceiling the week is named for.
// ---------------------------------------------------------------------------

type Shape = 'none' | 'ones' | 'tens' | 'both' | 'through-zero';

interface Sum {
  a: number;
  b: number;
  total: number;
  /** How many columns hand a unit on to the next one. */
  trades: number;
}

function columns(r: Rng, shape: Shape): Sum {
  let o1: number;
  let o2: number;
  let t1: number;
  let t2: number;
  let h1: number;
  let h2: number;
  switch (shape) {
    case 'none':
      // Every column settles inside nine: nothing moves anywhere.
      o1 = r.int(1, 4); o2 = r.int(1, 9 - o1);
      t1 = r.int(1, 4); t2 = r.int(1, 9 - t1);
      h1 = r.int(1, 4); h2 = r.int(1, 9 - h1);
      break;
    case 'ones':
      // The ones fill a ten; the tens have room to receive it and stop there.
      o1 = r.int(3, 9); o2 = r.int(10 - o1, 9);
      t1 = r.int(1, 4); t2 = r.int(1, 8 - t1);
      h1 = r.int(1, 4); h2 = r.int(1, 9 - h1);
      break;
    case 'tens':
      // The ones settle, so the ONLY trade is the one crossing into the hundreds.
      o1 = r.int(1, 4); o2 = r.int(1, 9 - o1);
      t1 = r.int(3, 9); t2 = r.int(10 - t1, 9);
      h1 = r.int(1, 4); h2 = r.int(1, 8 - h1);
      break;
    case 'both':
      // Two trades, one after the other — the second one only settled once the
      // first has arrived.
      o1 = r.int(3, 9); o2 = r.int(10 - o1, 9);
      t1 = r.int(3, 9); t2 = r.int(Math.max(1, 9 - t1), 9);
      h1 = r.int(1, 4); h2 = r.int(1, 8 - h1);
      break;
    default:
      // through-zero: the ten arrives in a column where one addend holds nothing
      // at all, and that column STILL fills, so the trade travels two places.
      o1 = r.int(3, 9); o2 = r.int(10 - o1, 9);
      t1 = 9; t2 = 0;
      h1 = r.int(1, 4); h2 = r.int(1, 8 - h1);
      break;
  }
  // "counted 493 pencils and 493 pencils" reads like a typo even though the
  // arithmetic is sound. Nudged in the HUNDREDS digit, deterministically and in
  // one step: the hundreds column is the only one whose value none of the shapes
  // above constrain, so the chosen regroup structure survives untouched, and
  // h1 + h2 only ever falls (or rises from two to three), so the sum stays under
  // a thousand. A redraw loop here would consume a variable number of draws and
  // break seed-stability for every later item in the pack (L19).
  let hb = h2;
  if (h1 * 100 + t1 * 10 + o1 === h2 * 100 + t2 * 10 + o2) hb = h2 > 1 ? h2 - 1 : 2;
  const a = h1 * 100 + t1 * 10 + o1;
  const b = hb * 100 + t2 * 10 + o2;
  const onesTrade = o1 + o2 >= 10 ? 1 : 0;
  const tensTrade = t1 + t2 + onesTrade >= 10 ? 1 : 0;
  return { a, b, total: a + b, trades: onesTrade + tensTrade };
}

// ---------------------------------------------------------------------------
// withFigure / placeValueChart
//
// The shipped primitives (situation / multiStep) carry no figure slot and lib/
// is not ours to edit, so the wrapper does what `withEstimateFirst` does: all of
// it happens inside the returned closure, it takes no new rng draw, and it
// leaves the prompt — and therefore the QG-1/QG-4 surface signature — untouched.
// It reads the drafted item's `generator.params`, the very numbers the answer
// was computed from, so "built from the item's own drawn values" holds by
// construction. `placeValueChart` is the local builder for the one figure family
// lib/figures.ts does not yet expose a helper for; it emits the same schema and
// the same `asserts` clause QG-13 re-derives.
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

/** "hundreds, tens and ones" written for a chart of ONE stated number. */
function chartAlt(value: number, noun: string): string {
  const s = String(value);
  return `a hundreds-tens-ones chart holding the ${countNoun(value, noun)} the story counts, with ${s[0]} in the hundreds column, ${s[1]} in the tens and ${s[2]} in the ones`;
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** B13 — the same algorithm one column narrower. Sums stay inside a hundred. */
const wAddTwoDigit = asWarmup(addWhole(16, 49), B13);
/** C1 — what a digit is WORTH where it stands, which is why a trade is a trade. */
const wDigitValue = asWarmup(digitValue(3), C1);
/** C2 — rounding to the nearest hundred, the arithmetic the size check runs on. */
const wRoundHundred = asWarmup(roundWhole(2, 118, 962), C2);
/** C2 — comparison, so "is that total the right size?" stays a real question. */
const wCompare = asWarmup(compareWhole(3), C2);

// ---------------------------------------------------------------------------
// Single-step situations — one per REGROUP STRUCTURE, so the pages differ by
// where the trade lands rather than by what the story is about.
// ---------------------------------------------------------------------------

/** No trade anywhere. The baseline the other four are heard against. */
const sitNoRegroup = situation({
  situationType: 'combine',
  cognitiveOp: 'add-columns',
  draw: (r) => {
    const { a, b, total } = columns(r, 'none');
    return {
      prompt: `A village library shelves ${countNoun(a, 'picture books')} in the front room and ${countNoun(b, 'picture books')} in the back room. How many picture books does the library shelve in all?`,
      answerValue: String(total),
      templateId: 'd_add_v1',
      params: { a, b },
      units: 'picture books',
      hints: [
        'Does any column in this sum fill right up to ten, or does every one of them settle where it is?',
        'Work the columns from the right and read each one on its own — nothing here has to be handed on.',
      ],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

/** One trade, and it is the low one: ten ones become a single ten. */
const sitOnesRegroup = situation({
  situationType: 'part-whole',
  cognitiveOp: 'add-regroup-ones',
  draw: (r) => {
    const { a, b, total } = columns(r, 'ones');
    const name = one(r);
    return {
      prompt: `${name} sorts the craft club's bead tub into two kinds. There are ${countNoun(a, 'wooden beads')} and ${countNoun(b, 'glass beads')}. How many beads are in the tub altogether?`,
      answerValue: String(total),
      templateId: 'd_add_v1',
      params: { a, b },
      units: 'beads',
      hints: [
        'How many can one column hold before it has made something bigger?',
        'Count the ones first; the moment they reach ten, that ten is no longer a ones amount and belongs next door.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

/**
 * One trade, and it is the HIGH one — the tens fill without any help from the
 * ones, so the only unit that moves is the hundred crossing into the hundreds
 * column. This is the boundary the whole week turns on.
 *
 * Figure = a place-value chart of the FIRST stated distance. It is a given, it
 * totals nothing, and it puts the three column names on the page in the order
 * the child will work them.
 */
const sitTensRegroup = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'add-regroup-tens',
    draw: (r) => {
      const { a, b, total } = columns(r, 'tens');
      const name = one(r);
      return {
        prompt: `[image: a hundreds-tens-ones chart holding the ${countNoun(a, 'metres')} of the first stretch] ${name} walks a canal path in two stretches. The first stretch is ${countNoun(a, 'm')} and the second is ${countNoun(b, 'm')}. How far does ${name} walk in all?`,
        answerValue: String(total),
        templateId: 'd_add_v1',
        params: { a, b },
        units: 'm',
        hints: [
          'Which of the three columns here is the one that fills right up, and what sits to the left of it?',
          'Ten tens are worth one hundred, so a full tens column sends a single hundred one place to the left.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'a');
    return placeValueChart(a, {
      showValues: true,
      alt: chartAlt(a, 'metres'),
      asserts: assertsParam('a', 'value'),
    });
  },
);

/**
 * Two trades, one behind the other — and the second one is only settled once the
 * first has arrived, which is the sequencing a child has to feel before the
 * algorithm means anything.
 *
 * Posed as a COMPARISON (an amount stated as "more than" another), so the week
 * is not five join stories in a row. Figure = the comparison bar: the stated
 * amount drawn, the extra drawn beside it, and the whole braced as the unknown.
 * Both segments are givens; the brace is the question, not the answer.
 */
const sitTwoRegroups = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'add-regroup-twice',
    draw: (r) => {
      const { a, b, total } = columns(r, 'both');
      return {
        prompt: `[image: two bars — the ${countNoun(a, 'house points')} the first house earned, and beneath it that same length with the ${countNoun(b, 'house points')} extra drawn on its end] Over the whole term the Blue house earned ${countNoun(a, 'house points')}. The Green house earned ${countNoun(b, 'house points')} MORE than the Blue house. How many house points did the Green house earn?`,
        answerValue: String(total),
        templateId: 'd_add_v1',
        params: { a, b },
        units: 'house points',
        hints: [
          'Is the second house\'s total being told to you, or being described against the first house\'s?',
          'Lay the extra amount on the end of the score you were given, then work the columns from the right and hand on each full one.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'a');
    const b = numOf(p, 'b');
    return barModel(
      [
        { label: 'the score you were told', segments: [{ value: a, label: String(a) }] },
        {
          label: 'that score and the extra',
          segments: [
            { value: a, fill: 'soft' },
            { value: b, label: String(b), fill: 'hatch' },
          ],
          total: '?',
        },
      ],
      {
        alt: `two bars: the ${countNoun(a, 'house points')} the first house earned, and below it the same length with the ${countNoun(b, 'house points')} extra hatched on the end, the whole bar braced with a question mark`,
        asserts: assertsParam('a', 'bar:0'),
      },
    );
  },
);

/**
 * The trade arrives in a column where one addend holds NOTHING — and that column
 * still fills, so the unit travels two places in one move. A zero column is the
 * case children read as "nothing happens here", which is exactly when a carry
 * goes missing.
 *
 * Figure = the chart of the addend that carries the empty column, so the zero is
 * on the page as a fact about the number rather than as a hint about the work.
 */
const sitThroughZero = withFigure(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add-regroup-through-zero',
    draw: (r) => {
      const { a, b, total } = columns(r, 'through-zero');
      return {
        prompt: `[image: a hundreds-tens-ones chart holding the ${countNoun(b, 'visitors')} of the second morning] A museum turnstile counted ${countNoun(a, 'visitors')} on Saturday morning and ${countNoun(b, 'visitors')} on Sunday morning. How many visitors went through the turnstile across the two mornings?`,
        answerValue: String(total),
        templateId: 'd_add_v1',
        params: { a, b },
        units: 'visitors',
        hints: [
          'What does an empty column mean when something is handed into it from the right?',
          'A column with nothing of its own can still fill up once the ten arrives, and then it hands one on in its turn.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) => {
    const b = numOf(p, 'b');
    return placeValueChart(b, {
      showValues: true,
      alt: chartAlt(b, 'visitors'),
      asserts: assertsParam('b', 'value'),
    });
  },
);

/**
 * METACOGNITION — the PREDICT item, served ONLY through the estimate-first
 * wrapper so the generator is never drawn twice with the same ladder (kit §E2.2).
 *
 * The shape is drawn fresh every time from all four structures, so "will any
 * column need a regroup?" cannot be answered by reflex or by the page's habits:
 * the child has to look at the ones and the tens BEFORE picking up a pencil,
 * which is the single habit that stops a carry from going missing.
 */
const sitPredictRegroup = situation({
  situationType: 'combine',
  cognitiveOp: 'predict-regroup',
  draw: (r) => {
    const shape = r.pick(['none', 'ones', 'tens', 'both'] as const);
    const { a, b, total } = columns(r, shape);
    const name = one(r);
    return {
      prompt: `${name}'s club packed ${countNoun(a, 'seed packets')} in the morning and ${countNoun(b, 'seed packets')} in the afternoon. How many seed packets did the club pack that day?`,
      answerValue: String(total),
      templateId: 'd_add_v1',
      params: { a, b },
      units: 'seed packets',
      hints: [
        'Before any working: which pair of digits in this sum is the pair most likely to fill a column?',
        'Read each column as a pair and ask whether it reaches ten; only then work the sum and see whether your call held.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});
const sitPredictEstimate = withEstimateFirst(
  sitPredictRegroup,
  'will any column in this sum fill right up and hand a unit on, or will every column settle where it is?',
);

// ---------------------------------------------------------------------------
// Multi-step — the recipe's three addends, and the missing-addend form that
// stops the week from being five pages of the same page.
// ---------------------------------------------------------------------------

/**
 * THREE ADDENDS (the C3 multi-step). Two joins in a row, which is where a child
 * discovers that the running total has to be carried in the head or on the page
 * between the lines.
 *
 * Figure = the three stated days as three bars, drawn to a scale set by the
 * LONGEST DAY. Nothing about the total is drawn or measurable: three separate
 * bars cannot be read as one length, and the axis they share is one day wide.
 */
const msThreeDays = withFigure(
  multiStep({
    situationType: 'multi-stage',
    draw: (r) => {
      const d1 = r.int(126, 288);
      const d2 = r.int(134, 296);
      const d3 = r.int(118, 274);
      return {
        prompt: `[image: three bars, one for each day, drawn against the longest of the three] A pop-up bookshop sold ${countNoun(d1, 'books')} on Friday, ${countNoun(d2, 'books')} on Saturday and ${countNoun(d3, 'books')} on Sunday. How many books did the shop sell over the three days?`,
        initN: d1,
        steps: [
          { op: 'add', n: d2, d: 1 },
          { op: 'add', n: d3, d: 1 },
        ],
        units: 'books',
        hints: [
          'How many joins does this story ask for, and what has to be written down between them?',
          'Put the first two together and keep that total in front of you, then bring the third day to it.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const d1 = numOf(p, 'initN');
    const steps = (p.steps as Array<{ n: number }>) ?? [];
    const d2 = steps[0]?.n ?? 0;
    const d3 = steps[1]?.n ?? 0;
    const widest = Math.max(d1, d2, d3);
    return barModel(
      [
        { label: 'first day', segments: [{ value: d1, label: String(d1) }] },
        { label: 'second day', segments: [{ value: d2, label: String(d2) }] },
        { label: 'third day', segments: [{ value: d3, label: String(d3) }] },
      ],
      {
        scaleMax: widest,
        alt: `three separate bars drawn to the same scale — ${countNoun(d1, 'books')} for the first day, ${countNoun(d2, 'books')} for the second and ${countNoun(d3, 'books')} for the third`,
        asserts: assertsParam('initN', 'bar:0'),
      },
    );
  },
);

/**
 * The missing-addend form, grown to three digits (B7's little sibling all the
 * way up). A target is stated first, two amounts arrive, and the question is
 * what is still owed — so the child adds within a thousand and then measures the
 * result against something, which is the whole reason the week teaches a size
 * check at all.
 */
const msShortOfTarget = multiStep({
  situationType: 'part-whole',
  usesPriorSkill: true,
  draw: (r) => {
    const target = r.pick([600, 700, 800, 900] as const);
    const first = r.int(118, 264);
    const second = r.int(126, 271);
    return {
      prompt: `A school hall is collecting ${countNoun(target, 'tins')} for a food drive. One class brings in ${countNoun(first, 'tins')} and another brings in ${countNoun(second, 'tins')}. How many more tins does the hall still need?`,
      initN: target,
      steps: [
        { op: 'sub', n: first, d: 1 },
        { op: 'sub', n: second, d: 1 },
      ],
      units: 'tins',
      hints: [
        'Which number in this story is the amount already in, and which is the amount wanted in the end?',
        'Put the two classes together first so there is one amount to hold against the target, then find the gap.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's two "notice it before you compute it" traps
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DISCRIMINATION: one regroup or two.
 *
 * The draw is pinned to the case that separates the two readings — the two tens
 * digits make exactly nine, so the tens column fills ONLY once the ten traded up
 * from the ones has arrived. A child who sizes each column from its own two
 * digits therefore lands on "the ones column only", and that is the dropped
 * carry showing itself where it can be shown honestly: the option is computed
 * from this item's own digits, not asserted about anyone's working.
 */
const discrimWhichColumns = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const o1 = r.int(3, 9);
    const o2 = r.int(10 - o1, 9);
    const t1 = r.int(1, 8);
    const t2 = 9 - t1;
    const h1 = r.int(1, 4);
    const h2 = r.int(1, 8 - h1);
    const a = h1 * 100 + t1 * 10 + o1;
    const b = h2 * 100 + t2 * 10 + o2;
    return {
      prompt: `Here is a sum set out in columns: ${a} + ${b}. Which of its columns need a regroup?`,
      correct: 'the ones column and the tens column',
      distractors: [
        {
          text: 'the ones column only',
          errorTag: 'concept-misconception',
          rationale: 'Sizes the tens column from its own two digits, which stop one short of ten — so the ten handed up from the ones is never counted into it.',
        },
        {
          text: 'neither column',
          errorTag: 'procedure-slip',
          rationale: 'Writes each column\'s whole total straight into that column, so no column ever has to hand anything on to the next.',
        },
      ],
      hints: [
        'Which column is worked first, and what does it pass on to the one beside it?',
        'Size the ones column, hand on whatever it fills, and only then decide whether the tens column reaches ten.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * THE SIZE CHECK, as a choice — the recipe's "add-then-estimate" move turned
 * into something a child can win without computing exactly.
 *
 * Both wrong totals are computed in code from this item's own digits and both
 * are real: one is the total a sum reaches when the hundred traded out of the
 * tens never lands, the other is the total when nothing is handed on at all.
 * Rounding each addend to the nearest hundred separates them, which is exactly
 * what the check is for.
 */
const discrimWhichTotal = discrimination({
  variant: 'structural',
  cognitiveOp: 'estimate-check',
  draw: (r) => {
    const { a, b, total } = columns(r, 'both');
    return {
      prompt: `Round each number to the nearest hundred and use that to size the total of ${a} + ${b}. Only one of these totals sits where your estimate says it must. Which one is it?`,
      correct: String(total),
      distractors: [
        {
          text: String(total - 100),
          errorTag: 'concept-misconception',
          rationale: 'The total a sum lands on when the hundred handed up out of the tens column never reaches the hundreds — the answer comes out one whole hundred light.',
        },
        {
          text: String(total - 110),
          errorTag: 'procedure-slip',
          rationale: 'The total a sum lands on when every column keeps only its last digit and passes nothing on, so both trades are lost at once.',
        },
      ],
      hints: [
        'About how big should this total be, before a single column is added?',
        'Round each number to its nearest hundred, add those two, and see which of the offered totals could sit that close to it.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header for why the shown slip is the traded hundred sent the
// WRONG WAY across the boundary rather than a hundred simply dropped: only the
// former is derivable from a registered verify, and its transform — a subtraction
// where the trade calls for a join — is genuinely the move a child makes in the
// fortnight when the addition and subtraction algorithms arrive together.
//
// The working is shown by PARTS (hundreds line, tens line, ones line), which is
// the second of the two strategies this week teaches, so the item reads as a
// piece of real working rather than as a riddle about a digit.
// ---------------------------------------------------------------------------

const eaCarryWrongWay = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const h1 = r.int(1, 4);
    const drawnH2 = r.int(1, 8 - h1);
    // The tens fill on their own, so the ONE trade in this sum is the hundred
    // crossing the boundary the item is about.
    const t1 = r.int(3, 9);
    const t2 = r.int(Math.max(1, 10 - t1), 9);
    const o1 = r.int(1, 4);
    const o2 = r.int(1, 9 - o1);
    // Same one-step distinctness nudge the shapes use: two identical addends read
    // as a typo in a sentence that lists them side by side.
    const h2 = h1 * 100 + t1 * 10 + o1 === drawnH2 * 100 + t2 * 10 + o2
      ? (drawnH2 > 1 ? drawnH2 - 1 : 2)
      : drawnH2;
    return { a: (h1 + h2) * 100, b: 100, op: '+', wrongOp: '-', h1, h2, t1, t2, o1, o2 };
  },
  build: (v, p, r) => {
    const h1 = Number(p.h1);
    const h2 = Number(p.h2);
    const t1 = Number(p.t1);
    const t2 = Number(p.t2);
    const o1 = Number(p.o1);
    const o2 = Number(p.o2);
    const first = h1 * 100 + t1 * 10 + o1;
    const second = h2 * 100 + t2 * 10 + o2;
    const hundredsLine = (h1 + h2) * 100;
    const tensLine = (t1 + t2) * 10;
    const onesLine = o1 + o2;
    const studentTotal = Number(v.wrong) + (tensLine - 100) + onesLine;
    const name = one(r);
    return {
      prompt: `${name}'s class counted the school's pencil stock — ${countNoun(first, 'pencils')} in one box and ${countNoun(second, 'pencils')} in another — and added the two boxes by parts. A student wrote three lines — hundreds ${hundredsLine}, tens ${tensLine}, ones ${onesLine} — and then said that the tens line was holding a whole hundred that had to move. The student's finished hundreds line read ${v.wrong}, and the total given was ${countNoun(studentTotal, 'pencils')}.`,
      extension: 'Write the hundreds line as it has to stand, finish the total, and say in one sentence which direction the hundred inside the tens line travels.',
      hints: [
        'Which of the three lines is too big for the column it is written in, and where does the amount it cannot hold belong?',
        'Set the hundreds line down twice — once with the travelling hundred joined to it and once with it taken away — and decide which of the two the columns will allow.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: ['to the left', 'joined', 'added to the hundreds'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC03 = makeWeekBuilder({
  level: 'C',
  week: 3,
  conceptId: 'addition-within-1000',
  conceptName: 'Addition within 1,000',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [B13, C1, C2],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the column and its regroup',
  conceptFamily: 'operation',
  deepeningDelta:
    'A15 added inside ten, where a sum never outgrows the space it is written in, and B13 opened the trade in two columns with base-ten blocks on the table. C3 adds a third column, and with it the thing that only appears at three digits: a trade can happen in more than one place, in more than one order, and a trade can arrive in a column that holds a zero and fill it. So the question stops being "can you carry?" and becomes "where does this sum need a carry, and how do you know before you write?"',
  explanation: {
    hook:
      'Ten ones will not fit in the ones column. Something has to move — and the whole of this week is knowing which column it leaves, which column it lands in, and how you could have said so before you started.',
    whyBeforeHow:
      'A column can only hold nine, because the moment it reaches ten it has built one whole unit of the column to its LEFT, and that unit does not belong where it was made. That is why every page this week is about one thing: the column and its regroup. Each column counts a different size — hundreds, tens, ones — and adding only ever puts like with like, so ten ones become one ten and ten tens become one hundred, and the unit that is built always travels leftward, never back. Knowing WHERE a sum will need a trade also tells you roughly how big the answer has to be before a single digit is written, which is why a total that lands a whole hundred away from what you expected is not a mystery: it is telling you which trade went missing.',
    script: [
      {
        say: 'Watch how I set this out before I add anything. 348 and 275. I write them one under the other so that hundreds sit over hundreds, tens over tens, ones over ones. I do that first because a column is only allowed to add things of the same size, and if the columns are crooked the sum is wrong before it starts.',
        visual: 'A hundreds-tens-ones chart holding 348, with the three column names written across the top.',
        figure: placeValueChart(348, {
          showValues: true,
          alt: 'a hundreds-tens-ones chart holding 348, with 3 in the hundreds column, 4 in the tens and 8 in the ones',
        }),
      },
      {
        say: 'Ones first: 8 and 5. That is thirteen ones, and thirteen will not fit in a column that stops at nine. Ten of those ones have just built one whole ten, so the ten goes and stands in the tens column and three ones stay behind. Notice what I did NOT do — I did not write thirteen in the ones place.',
        visual: 'Thirteen ones with ten of them ringed and lifted into the tens column, three left standing.',
        figure: barModel(
          [
            { label: 'the ones I have', segments: [{ value: 8, label: '8' }, { value: 5, label: '5', fill: 'hatch' }], total: '13' },
            { label: 'one ten leaves, three stay', segments: [{ value: 10, label: 'one ten' }, { value: 3, label: '3', fill: 'none' }] },
          ],
          { scaleMax: 13, alt: 'a bar of 8 joined to a bar of 5 making 13, and beneath it the same length split into one ten and three ones' },
        ),
      },
      {
        say: 'Now the tens, and this is the column that matters most. 4 tens and 7 tens, and the ten that just arrived, make twelve tens. Ten of those twelve are one hundred, so a hundred crosses into the hundreds column and two tens stay. A carry never disappears — it changes its name and moves one place to the left.',
        visual: 'The tens column holding twelve tens, with ten of them lifted across into the hundreds and two left standing.',
        figure: barModel(
          [
            {
              label: 'the tens I have',
              segments: [
                { value: 40, label: '4 tens' },
                { value: 70, label: '7 tens', fill: 'hatch' },
                { value: 10, label: 'the ten that arrived' },
              ],
              total: '12 tens',
            },
            {
              label: 'one hundred leaves, two tens stay',
              segments: [
                { value: 100, label: 'one hundred' },
                { value: 20, label: '2 tens', fill: 'none' },
              ],
            },
          ],
          { scaleMax: 120, alt: 'a bar of 4 tens, 7 tens and the ten that arrived, braced as twelve tens, and beneath it the same length split into one hundred and two tens' },
        ),
      },
      {
        say: 'One habit before any of that, though. I round each number to the nearest hundred to check roughly how big the answer ought to be: about three hundred and about three hundred is about six hundred. So a sensible total starts with a six, and if mine had come out in the five hundreds I would go looking for a trade that never arrived rather than checking my digits.',
        visual: 'Two rounded bars of about three hundred each, held beside the finished total.',
        figure: barModel(
          [
            { label: 'about', segments: [{ value: 300, label: 'about 300' }, { value: 300, label: 'about 300', fill: 'hatch' }], total: 'about 600' },
            { label: 'the real total', segments: [{ value: 623, label: '623' }] },
          ],
          { scaleMax: 623, alt: 'a bar of about three hundred joined to another making about six hundred, beside a bar of 623' },
        ),
      },
    ],
    summary:
      'Line the columns up by size, then work from the right. Any column that reaches ten has built one unit of the column to its left, so that unit moves there and the rest stays. Before you start, round each number to the nearest hundred so you know roughly where the total must land — a total a whole hundred adrift is a trade that never made the journey.',
    vocabulary: [
      { term: 'column', kidGloss: 'the place a digit stands in — hundreds, tens or ones — which decides what it is worth' },
      { term: 'regroup (carry)', kidGloss: 'when a column reaches ten, it has made one of the next thing along, so that one moves left' },
      { term: 'trade', kidGloss: 'swapping ten of something for one of the next size up' },
      { term: 'size check', kidGloss: 'rounding both numbers first so you know roughly how big the answer should be' },
    ],
  },
  guidedExamples: [
    {
      ...ge(3, 1, 'modeled', 'Work out 348 + 275 in columns.', [
        {
          teacherSay:
            'Watch me before I add anything at all. I round both numbers to the nearest hundred first — about three hundred and about three hundred — so I already know the answer wants to be somewhere near six hundred. Now the columns cannot surprise me.',
        },
        {
          teacherSay: 'Ones first: 8 and 5 make thirteen ones, so one ten walks left and three stay. Tens next — 4 tens, 7 tens and the ten that arrived. How many tens is that?',
          expected: '12',
        },
      ], '623'),
      visual: 'The finished sum in a hundreds-tens-ones chart, with both carries marked above their columns.',
      figure: placeValueChart(623, {
        showValues: true,
        alt: 'a hundreds-tens-ones chart holding the finished total 623, with 6 in the hundreds column, 2 in the tens and 3 in the ones',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(3, 2, 'completion', 'Work out 396 + 207 in columns. Watch the tens column.', [
        { teacherSay: 'The second number has nothing at all in its tens column. Does that mean the tens column has no work to do?', expected: 'no' },
        { childDo: 'Take the ones column first, hand on whatever it fills, and then finish the sum.', expected: '603' },
      ], '603'),
      // COMPLETION fade: the child produces 603, so the picture holds the number
      // they were GIVEN — the addend with the empty tens column — and stops there.
      visual: 'A hundreds-tens-ones chart holding 207, its tens column standing empty.',
      figure: placeValueChart(207, {
        showValues: true,
        alt: 'a hundreds-tens-ones chart holding 207, with 2 in the hundreds column, 0 in the tens and 7 in the ones',
      }),
    },
    ge(3, 3, 'prompted', 'Work out 431 + 256 in columns.', [
      { childDo: 'Before you add: say out loud whether any column here will need a trade, then work it and see whether you were right.', expected: '687' },
    ], '687'),
    {
      ...ge(3, 4, 'independent', 'Work out 465 + 279 in columns, then check the size of your answer by rounding. Solve cold.', [
        { childDo: 'Say where each trade lands before you make it.', expected: '744' },
      ], '744'),
      visual: 'A hundreds-tens-ones chart holding 465 — the first number only.',
      figure: placeValueChart(465, {
        showValues: true,
        alt: 'a hundreds-tens-ones chart holding 465, with 4 in the hundreds column, 6 in the tens and 5 in the ones',
      }),
    },
  ],
  days: [
    // Day 1 — concept echo: the three plainest structures in order, so the first
    // page a child meets is a ladder of WHERE, not a stack of sums.
    [
      { gen: wAddTwoDigit, diff: 2 },
      { gen: wDigitValue, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: sitNoRegroup, diff: 2 },
      { gen: sitOnesRegroup, diff: 3 },
      { gen: sitTensRegroup, diff: 3 },
    ],
    // Day 2 — fluency + application: the which-columns trap, the predict-first
    // item, and the zero column, which is where a carry is likeliest to vanish.
    [
      { gen: wRoundHundred, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: discrimWhichColumns, diff: 3 },
      { gen: sitPredictEstimate, diff: 4 },
      { gen: sitThroughZero, diff: 4 },
      { gen: sitOnesRegroup, diff: 3 },
    ],
    // Day 3 — interleave: the size check meets the column check, against the
    // week's first multi-step, so the page shape never says which is coming.
    [
      { gen: wAddTwoDigit, diff: 2 },
      { gen: discrimWhichTotal, diff: 3 },
      { gen: discrimWhichColumns, diff: 4 },
      { gen: msThreeDays, diff: 4 },
      { gen: sitTensRegroup, diff: 3 },
      { gen: sitPredictEstimate, diff: 4 },
    ],
    // Day 4 — word problems: two multi-steps beside the two- and no-trade
    // structures, so "it must need a carry" never becomes the cue.
    [
      { gen: msThreeDays, diff: 4 },
      { gen: msShortOfTarget, diff: 5 },
      { gen: sitTwoRegroups, diff: 4 },
      { gen: sitThroughZero, diff: 4 },
      { gen: sitNoRegroup, diff: 3 },
    ],
    // Day 5 — non-computational: the wrong-way trade, the two-strategies
    // production, and the claim about what a missing trade costs.
    [
      { gen: wRoundHundred, diff: 2 },
      { gen: eaCarryWrongWay, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Here is one sum: 268 + 157. Work it out twice. First in columns, working right to left. Then by parts: add the hundreds, then the tens, then the ones, and put those three lines together. Write both totals, then write one sentence saying where the SAME trade shows up in each method.',
          value: 'both methods reach the same total, and the ten built in the ones and the hundred built in the tens have to move left in both — the columns hand them on straight away, the parts method carries them inside the lines',
          acceptableForms: ['same total', 'both', 'carry', 'trade', 'moves left', 'hundred'],
          keywords: true,
          hints: [
            'Do the two methods work the columns in the same order, or in opposite orders?',
            'Find the ten that is built in the ones in each method, and point to where each one puts it.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: if one trade is left out of a column sum, the total written down is SMALLER than the real total. In one sentence, say how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Treats the size of the loss as depending on which column was missed, though a trade only ever carries value up to a bigger column and losing it can only take value away.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads a missing trade as leaving the total too big, as though the ten had been counted in two columns at once rather than in neither.',
            },
          ],
          hints: [
            'When a column hands a unit on, is the total being given something or losing something?',
            'Work one sum twice — once with the trade made and once with it left out — and hold the two totals side by side.',
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
    'For grown-ups: when a three-digit sum comes out wrong, look at how far off it is before you look at the digits. Out by exactly one hundred, or exactly ten, and the arithmetic is almost certainly fine — a trade simply never made the journey to the next column. Asking "which column built something it could not keep?" fixes that in a way that re-adding the whole sum never does.',
  ],
  puzzle: (r) => {
    // One digit is hidden, and the child has to find EVERY digit that would make
    // the tens column fill. The ones column always fills here, so the ten that
    // arrives from the right is part of the reckoning — which is exactly the
    // thing a child forgets when they size a column by its own two digits.
    const h1 = r.int(1, 4);
    const h2 = r.int(1, 8 - h1);
    const o1 = r.int(3, 9);
    const o2 = r.int(10 - o1, 9);
    const t2 = r.int(1, 7);
    const lowest = 9 - t2; // hidden + t2 + 1 ≥ 10
    const b = h2 * 100 + t2 * 10 + o2;
    const answers: string[] = [];
    for (let d = lowest; d <= 9; d++) answers.push(String(d));
    return {
      id: 'C3-PZ-01',
      title: 'Puzzle Grove: The Column That Tips',
      puzzleType: 'logic',
      prompt: `One digit of this sum has been covered by a leaf: ${h1}▢${o1} + ${b}. Find EVERY digit that could be hiding under the leaf and still leave the TENS column needing a regroup. Then say how you know that no digit is missing from your list.`,
      answer: {
        value: answers.join(', '),
        acceptableForms: answers,
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Which column has to be settled before the tens column can be sized at all?',
        'Work the ones column first and see what it hands across; then ask how small the hidden digit is allowed to be before the tens column stops filling, and walk upward from there.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Addition within 100 — the same trade, one column narrower',
    sourceWeek: B13,
    itemCount: 18,
    scheduledDay: 2,
    templateId: 'add_within_100_facts_v1',
    params: { min: 14, max: 79 },
  },
  mastery: [
    { gen: sitNoRegroup, diff: 3 },
    { gen: msThreeDays, diff: 3 },
    { gen: sitTensRegroup, diff: 3 },
    { gen: msShortOfTarget, diff: 4 },
    { gen: sitThroughZero, diff: 4 },
    { gen: sitTwoRegroups, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step sums chosen for their regroup STRUCTURE — no trade at all, the single trade that crosses into the hundreds, and the trade that lands in a column holding a zero — with the place-value-chart affordance preserved on the last two. 02/04/06: the two multi-steps (three addends joined in turn, and a target with two amounts against it) and the comparison sum that trades twice, with its part-and-extra bar. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'carry-never-lands',
      description: 'Sizes each column from its own two digits, so a ten handed up from the column to the right is never counted in — the column looks as though it settled, and the total comes out a whole hundred or a whole ten short.',
      exampleWrongAnswer: 'a sum whose true total is 734 written as 634',
      distractorRationale: 'Offer the total a sum reaches when a trade is built but never arrives in the next column.',
      reteachPointer: 'explanation/script[2] (a carry changes its name and moves one place left; it never disappears)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'nothing-handed-on',
      description: 'Writes each column\'s whole total into that column, so a two-digit column result is squeezed in and no trade is made anywhere.',
      exampleWrongAnswer: 'the ones column of 8 and 5 written as 13 in the ones place',
      distractorRationale: 'Offer the total a sum reaches when every column keeps only what it can hold and passes nothing on.',
      reteachPointer: 'guidedExamples/C3-GE-01 (thirteen ones do not fit; ten of them are one ten and they leave)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'empty-column-skipped',
      description: 'Reads a column holding a zero as a column with no work in it, so a trade arriving there is not added on and cannot be handed further left.',
      exampleWrongAnswer: 'a sum across an empty tens column answered ten short',
      distractorRationale: 'Offer the total that results from stepping over a zero column instead of adding into it.',
      reteachPointer: 'guidedExamples/C3-GE-02 (an empty tens column still has work to do)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'wrong-quantity-answered',
      description: 'Answers with an amount the story mentions rather than the one the question names — one part instead of the whole, or the amount already collected instead of the amount still owed.',
      exampleWrongAnswer: 'a "how many more are still needed?" story answered with the amount already brought in',
      distractorRationale: 'Offer a quantity the story genuinely names, but not the one the question points at.',
      reteachPointer: 'explanation/summary (check the size of your total against the story before you write it down)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Adding three-digit numbers in columns — lining the places up, spotting BEFORE working where a column will fill and hand a unit to its left, following a trade across the hundreds and through a column holding a zero, joining three amounts in turn, and rounding first so a total that lands a hundred adrift is caught straight away.',
    improvingCandidates: [
      'saying where a sum will need a trade before starting to add',
      'following a carry into the next column and adding it in',
      'rounding both numbers first to check the size of a total',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'counting the carry into the column it arrives in — a total that is out by exactly one hundred is nearly always this',
      },
      {
        errorTag: 'procedure-slip',
        text: 'handing on a full column instead of squeezing its whole total into one place',
      },
      {
        errorTag: 'representation-misread',
        text: 'columns holding a zero, which still take a trade and can still fill',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the amount the question names, rather than an amount the story happens to mention',
      },
    ],
    homeFocus: {
      praiseLine:
        'You looked at the columns and said where the sum would need a trade before you wrote anything, and then you checked the size of your total against your estimate — those two habits are what this week is built on.',
      questionForChild: 'In 465 + 279, which column fills up first, and where does what it builds go?',
      schoolSyncHook: 'If your child\'s class writes the little carried digit above the column or below the line, tell us and we will lay ours out the same way.',
    },
    vocabularyForParent: [
      'column (hundreds, tens or ones — the place that decides what a digit is worth)',
      'regroup or carry (a column reached ten, so one unit of the next size moves left)',
      'size check (rounding both numbers first to know roughly where the total belongs)',
    ],
  },
});
