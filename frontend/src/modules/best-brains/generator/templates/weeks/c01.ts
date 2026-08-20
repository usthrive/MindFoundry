/**
 * Level C · Week 1 — "Place value to 1,000" (conceptId: place-value-to-1000).
 *
 * FILL-ARCHITECTURE §5 row C1: anchor "the hundreds-tens-ones chart";
 * multi-step "build then compare"; error-analysis "reads 407 as forty-seven";
 * discrimination "face value vs place value"; Day-5 signature "number riddles
 * ('I have 4 hundreds, 0 tens…')".
 *
 * WHAT THIS WEEK IS ABOUT, AND WHAT THE PAGES ARE BUILT FROM. A digit has two
 * numbers attached to it — the one you see (its FACE) and the one it is worth
 * (its VALUE) — and the only thing that separates them is which column the digit
 * is standing in. So every core item on these pages turns on a column rather
 * than on an arithmetic move:
 *   - two ways of BUILDING a three-digit number, one from bundle counts
 *     ("3 boxes of a hundred, 4 bags of ten, 6 loose") and one from the column
 *     VALUES themselves ("600 and 50 and 7"), which is the same number said in
 *     the two languages this week has to keep straight;
 *   - the EMPTY column, which is where the concept either lands or collapses —
 *     a story with hundreds and ones and nothing in between, and a number
 *     written from its spoken name where the words never mention the tens;
 *   - the digit's WORTH, asked directly, then again as a choice whose wrong
 *     options are both computed from the item's own digits.
 *
 * ⚠ THE VERIFY-LIBRARY LIMIT, DECLARED (FANOUT kit §E2.3). The recipe's
 * error-analysis is "reads 407 as forty-seven" — a number whose empty column is
 * not counted, so the digits close up and 100h + o is read as 10h + o. That
 * value is not derivable from any registered verify. The only whole-number
 * misconception template varies the OPERATION over ONE fixed operand pair, and
 * solving `a op b = 100h + o` together with `a op' b = 10h + o` over {+,−,×,÷}
 * has exactly one family of solutions: `b = 45h`, `a = 55h + o` with op '+' and
 * wrongOp '−' (for 407: 227 + 180 and 227 − 180). Those operands are not the
 * story's own numbers and the transform is "subtracted where the story joins" —
 * i.e. a C3/C4 arithmetic item wearing this week's answer. Fabricating the
 * number is forbidden, so per the kit's §E2.3 order:
 *   - the 407-as-forty-seven misread is shown where it CAN be computed honestly:
 *     it is the second option in `discrimWorthOfDigit`, derived from that item's
 *     own hundreds digit (h × 10 is exactly what the hundreds digit is worth
 *     once a column has been lost); it is the subject of the Day-5
 *     Always/Sometimes/Never claim; and it is named in the mistake bank;
 *   - Day 5's GENERATED error-analysis carries the same number's sibling slip,
 *     which IS derivable and is the same misconception one step along: the
 *     hundreds and ones digits written into each other's columns across the
 *     empty tens ("six hundred four" set down as 406). `a_verify_teen_write_v1`
 *     re-derives it from the item's own number by reversing its digits, so the
 *     zero stays in the tens column in both readings and only the two spoken
 *     digits move. It is the A10 "writes 31 for thirteen" slip at three digits,
 *     which is the documented ancestor of this week's trap (FILL-ARCHITECTURE
 *     A22 "24 vs 42", B1 "106 vs 160", B2 "3t2o vs 2t3o").
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7 / §E2.5). The `place-value-chart`
 * primitive was built for this week, and the discipline it needs is precise,
 * because on a place-value page the chart can BE the answer:
 *   - on "how much is this digit worth?" the chart holds the number the story
 *     already stated and `showValues` stays OFF — printing each column's value
 *     under it would print the answer;
 *   - on the multi-step tally, `showValues` is ON, because there the chart holds
 *     the count the board ALREADY SHOWS and the answer is two changes further
 *     on: the face-vs-value display is a given, not a giveaway;
 *   - the charts that hold a finished, built number live in the lesson script
 *     and the modeled example, where the answer is already on the page.
 * Every chart is built from the item's own `generator.params` and asserts
 * against them, so QG-13 re-derives what each picture claims.
 *
 * Retrieval is Level B ONLY — C1 is the first week of the level, so there is no
 * earlier Level-C cell to draw on. B2 (tens and ones) is the direct ancestor,
 * B3 (comparing) is what the multi-step's second half runs on, and B13/B14 keep
 * the two-digit arithmetic underneath the three-digit stories quick.
 */

import { addWhole, asWarmup, classify, compareWhole, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { an, countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, barModel } from '../lib/figures';
import { drawUniqueItem } from '../lib/guard';
import { drawFresh, numberWords } from '../shared';
import type { ItemDraft } from '../shared';
import type { BBFigure, FigureAssertion, PlaceName } from '../../../figures/types';

const ge = makeGe('C');

const B2 = { level: 'B' as const, week: 2 };
const B3 = { level: 'B' as const, week: 3 };
const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

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
// lib/figures.ts exposes no helper for; it emits the same schema and the same
// `asserts` clause QG-13 re-derives. (Pattern established by c03/c04/c14.)
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

/** The columns of a stated count, named in order — the chart's spoken form. */
function columnsAlt(value: number, noun: string): string {
  const s = String(value);
  return `a hundreds-tens-ones chart with the ${countNoun(value, noun)} set out column by column: ${s[0]} in the hundreds, ${s[1]} in the tens, ${s[2]} in the ones`;
}

/** The same chart with each column's WORTH printed under its digit. */
function columnsWorthAlt(value: number, noun: string): string {
  const s = String(value);
  return `a hundreds-tens-ones chart with the ${countNoun(value, noun)} set out column by column, each column's worth printed beneath its digit: ${s[0]} in the hundreds over ${Number(s[0]) * 100}, ${s[1]} in the tens over ${Number(s[1]) * 10}, ${s[2]} in the ones over ${s[2]}`;
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups — Level B only (C1 opens the level), and exempt from the
// pedagogy gates. Four formats, so no day ever runs two of a kind.
// ---------------------------------------------------------------------------

/**
 * B2 — tens and ones, the ancestor of everything on these pages. Two columns is
 * the whole idea the week widens to three, so this is the warm-up that carries
 * the concept rather than the arithmetic.
 */
const wTensOnes = asWarmup(
  (rng, guard, difficulty): ItemDraft =>
    drawUniqueItem(rng, guard, (r) => {
      const t = r.int(2, 9);
      const o = r.int(1, 9);
      return {
        type: 'computation',
        prompt: `${countNoun(t, 'tens')} and ${countNoun(o, 'ones')} make what number?`,
        answer: { value: String(10 * t + o), acceptableForms: [], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'tens_ones_compose_v1', params: { t, o }, seed: r.uint() },
        hintLadder: [
          'Which of these two amounts belongs in the column on the left?',
          'Count the tens in tens first, then put the loose ones on the end.',
        ],
        errorTags: ['fact-recall'],
      };
    }),
  B2,
);

/** B3 — comparing two-digit numbers, the move the week's multi-step ends on. */
const wCompareTwoDigit = asWarmup(compareWhole(2), B3);

/** B13 — addition within 100, so the tally stories never stall on the sum. */
const wAddWithin100 = asWarmup(addWhole(14, 78), B13);

/** B14 — subtraction within 100, the gap-finding half of "how many more". */
const wSubWithin100 = asWarmup(subWhole(23, 96), B14);

// ---------------------------------------------------------------------------
// Single-step core — five angles on one claim: the column sets the worth
// ---------------------------------------------------------------------------

/**
 * BUILD FROM BUNDLES. The story hands over three COUNTS ("3 boxes, 4 bags, 6
 * loose") and the child has to hear each count as a column. This is the plainest
 * form of the week and it opens Day 1.
 *
 * No figure: the answer IS the number laid out in its columns, so a chart here
 * would be the answer key with a border around it.
 */
const sitBuildFromBundles = situation({
  situationType: 'combine',
  cognitiveOp: 'pv-compose',
  draw: (r) => {
    const h = r.int(2, 9);
    const t = r.int(1, 9);
    const o = r.int(1, 9);
    return {
      prompt: `A play crate of toy bricks arrives. It holds ${countNoun(h, 'boxes')} of 100 bricks. It holds ${countNoun(t, 'bags')} of 10 bricks. It also holds ${countNoun(o, 'loose bricks')}. How many bricks are in the crate altogether?`,
      answerValue: String(100 * h + 10 * t + o),
      templateId: 'compose_3digit_v1',
      params: { h, t, o },
      units: 'bricks',
      hints: [
        'Which pack is worth the most? Which column does each pack fill?',
        'Give each pack size a column: hundreds, tens, ones. Then read the three digits straight across.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * THE EMPTY COLUMN. Hundreds and ones, and nothing at all between them — the
 * shape the whole week is built to survive. A child who writes only what the
 * story mentions writes a two-digit number and loses a hundred from every
 * digit standing left of the gap.
 */
const sitZeroTens = situation({
  situationType: 'part-whole',
  cognitiveOp: 'pv-placeholder',
  draw: (r) => {
    const h = r.int(2, 9);
    const o = r.int(1, 9);
    return {
      prompt: `The sewing room ran out of bags of ten last week. Nobody could open one. The button jar was filled from ${countNoun(h, 'sealed tubes')} of 100. Then it was topped up with ${countNoun(o, 'single buttons')}. What count goes on the jar's label?`,
      answerValue: String(100 * h + o),
      templateId: 'compose_3digit_v1',
      params: { h, t: 0, o },
      units: 'buttons',
      hints: [
        'What if a column with nothing in it is left out? What happens to the digits beside it?',
        'Stand a zero in the column the story never mentions. Then the digits around it keep their own columns.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * BUILD FROM COLUMN VALUES. The same build, said in the other language: the
 * story states 600 and 50 and 7 rather than six, five and seven of something.
 * Holding both languages against one number is the face-and-value pair the week
 * exists to separate.
 */
const sitBuildFromValues = situation({
  situationType: 'combine',
  cognitiveOp: 'pv-expand',
  draw: (r) => {
    const h = r.int(1, 9);
    const t = r.int(1, 9);
    const o = r.int(1, 9);
    return {
      prompt: `A cafe counts up its straws before opening. The big box still holds ${countNoun(h * 100, 'straws')}. A part-used packet has ${countNoun(t * 10, 'straws')}. The jar by the till holds ${countNoun(o, 'straws')}. How many straws does the cafe have in all?`,
      answerValue: String(100 * h + 10 * t + o),
      templateId: 'expanded_3digit_v1',
      params: { h, t, o },
      units: 'straws',
      hints: [
        'What size is each of these three amounts made of — hundreds, tens, or ones?',
        'Slot each amount into the column its size names. Then read the columns across as one count.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});

/**
 * THE DIGIT'S WORTH, asked straight. The number is given, the digit is named,
 * and the only thing left to do is find its column and say what that column
 * makes it worth.
 *
 * Figure = the chart holding the count the story already stated, with
 * `showValues` OFF. The picture puts the three column names on the page beside
 * the digits; it cannot hand over the answer, because the answer is the number
 * that would be PRINTED UNDER a column and no column has anything printed under
 * it here.
 */
const sitDigitWorth = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'pv-digit-value',
    draw: (r) => {
      const digit = r.int(1, 9);
      const place = r.pick([10, 100] as const);
      // The named digit must appear EXACTLY ONCE, or "the 7" names two columns.
      const others = DIGITS.filter((d) => d !== digit);
      const nonZero = others.filter((d) => d !== 0);
      const h = place === 100 ? digit : r.pick(nonZero);
      const t = place === 10 ? digit : r.pick(others);
      const o = r.pick(others);
      const n = 100 * h + 10 * t + o;
      return {
        prompt: `[image: a hundreds-tens-ones chart holding the count the run gave out] A fun run gave out ${countNoun(n, 'wristbands')}. How much is the ${digit} in that count worth?`,
        answerValue: String(digit * place),
        templateId: 'digit_value_v1',
        params: { n, digit, place },
        hints: [
          'Which of the three columns is this digit standing in?',
          'Name the column out loud first. Then say how many of that size the digit counts.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) => {
    const n = numOf(p, 'n');
    return placeValueChart(n, {
      alt: columnsAlt(n, 'wristbands'),
      asserts: assertsParam('n', 'value'),
    });
  },
);

/**
 * SPOKEN NAME → NUMERAL. The one item where the child has to supply a digit the
 * words never say: "six hundred four" names two columns and leaves the third to
 * be worked out.
 *
 * Drawn through `drawFresh` on the VALUE rather than through the prompt-token
 * guard, because this prompt carries its number in words and therefore has no
 * numeric tokens at all — nothing for the surface guard to hold on to, and Form
 * A and Form B could otherwise land on the same number.
 */
const sitNameToNumeral: ItemGen = (rng, guard, difficulty) => {
  const n = drawFresh(
    rng,
    guard,
    // Half the draws leave the tens column empty on purpose: a spoken name that
    // never mentions the tens is the week's trap, and a uniform draw would put
    // it in front of the child only one page in ten.
    (r) => 100 * r.int(1, 9) + (r.chance(0.5) ? 0 : 10 * r.int(1, 9)) + r.int(0, 9),
    (v) => `c1-name-to-numeral:${v}`,
  );
  return {
    type: 'representation',
    prompt: `A stationery office writes every stock count into its book in words. The paper-clip page reads "${numberWords(n)}". Write that count as a numeral for the shelf label.`,
    answer: { value: String(n), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'write_words_3digit_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'How many columns does a count with a hundreds part need?',
      'Set the hundreds part down first. Then fill in whatever the rest of the words name. Any column the words skip still gets a zero.',
    ],
    errorTags: ['representation-misread', 'procedure-slip'],
  };
};

// ---------------------------------------------------------------------------
// Multi-step — the recipe's "build then compare", and the count that ripples
// ---------------------------------------------------------------------------

/**
 * BUILD THEN COMPARE (the C1 multi-step). The board is filled in by column, so
 * the first move is to turn three column values into one count; the second is to
 * hold that count against a number from a year ago. `usesPriorSkill` because the
 * comparison is B3's move and the subtraction underneath it is B14's — a
 * place-value-family week composes with a strictly-prior skill by design.
 *
 * Served ONLY through the estimate-first wrapper (kit §E2.2): the same generator
 * offered raw as well would ship two identical hint ladders. The probe asks for
 * the SIZE of the gap, not its direction — this year's board is always the
 * larger, so "above or below?" would have one answer for every seed and the
 * child would learn the answer instead of the estimate. The drawn gap straddles
 * a hundred, so the call is real and it can only be made by building the count
 * and sizing it against the earlier one.
 */
const msBuildThenCompare = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'build-then-compare',
  usesPriorSkill: true,
  draw: (r) => {
    const h = r.int(3, 9);
    const t = r.int(1, 9);
    const o = r.int(1, 9);
    const built = 100 * h + 10 * t + o;
    const gap = r.int(24, 168);
    return {
      prompt: `A library keeps its reading-challenge total on a hundreds-tens-ones board. It is filled in one column at a time. This year the hundreds column is worth ${countNoun(h * 100, 'bookmarks')}. The tens column is worth ${countNoun(t * 10, 'bookmarks')}. The ones column is worth ${countNoun(o, 'bookmarks')}. Last year the challenge finished on ${countNoun(built - gap, 'bookmarks')}. How many more bookmarks does this year's board show than last year's?`,
      initN: h * 100,
      steps: [
        { op: 'add', n: t * 10, d: 1 },
        { op: 'add', n: o, d: 1 },
        { op: 'sub', n: built - gap, d: 1 },
      ],
      units: 'bookmarks',
      hints: [
        'Which count has to be built before the two years can be compared?',
        'Gather the three columns into one count first. Then measure the distance between that count and the earlier one.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const msBuildThenCompareEstimate = withEstimateFirst(
  msBuildThenCompare,
  'will the two boards land more than a hundred apart, or less?',
);

/**
 * THE COUNT THAT RIPPLES. The board already stands at nine tens and a high ones
 * digit, so a handful more sales fills the ones, which fills the tens, which
 * changes the HUNDREDS digit — a column a child would swear nobody had touched.
 * Two changes, so the ripple has to be carried through both.
 *
 * Figure = the chart of the count the board ALREADY SHOWS, with `showValues` on.
 * That is the one place in the week where printing each column's worth is safe
 * and useful: it is a given the story states outright, and the answer is two
 * changes further down the page.
 */
const msRippleCount = withFigure(
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'pv-ripple',
    usesPriorSkill: true,
    draw: (r) => {
      const h = r.int(2, 8);
      const o = r.int(4, 8);
      const n = 100 * h + 90 + o;
      const k = r.int(10 - o, 9);
      const j = r.int(11, 40);
      return {
        prompt: `[image: a hundreds-tens-ones chart holding the count the board already shows] A fruit stall's tally board shows ${countNoun(n, 'punnets')} sold so far today. In the last hour the front counter sells another ${countNoun(k, 'punnets')}. The gate stall then sells another ${countNoun(j, 'punnets')}. What does the tally board show once both are added on?`,
        initN: n,
        steps: [
          { op: 'add', n: k, d: 1 },
          { op: 'add', n: j, d: 1 },
        ],
        units: 'punnets',
        hints: [
          'Which column of this count is already filled right up to its top digit?',
          'Add the first amount on. Watch what the ones column hands to its neighbour. Then add the second amount to whatever the board reads by then.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const n = numOf(p, 'initN');
    return placeValueChart(n, {
      showValues: true,
      alt: columnsWorthAlt(n, 'punnets'),
      asserts: assertsParam('initN', 'value'),
    });
  },
);

// ---------------------------------------------------------------------------
// Discrimination — face value against place value, twice
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DISCRIMINATION. The digit is named, its column is named, and the
 * only question is what the two together make it worth. Both wrong options are
 * computed from this item's own hundreds digit and both are real:
 *   - the bare digit is the face-value read, the answer of a child for whom a
 *     column is decoration;
 *   - the digit times ten is the 407-as-forty-seven read — a hundreds digit
 *     counted one column too far right, which is exactly what a lost column
 *     costs. It is shown here, computed, rather than asserted about anyone's
 *     working (see the file header on why Day 5 cannot generate it).
 */
const discrimWorthOfDigit = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const h = r.int(2, 9);
    const others = DIGITS.filter((d) => d !== h);
    const t = r.pick(others);
    const o = r.pick(others);
    return {
      prompt: `In the number ${100 * h + 10 * t + o}, the digit ${h} is standing in the hundreds column. Which of these is what that digit is WORTH?`,
      correct: String(h * 100),
      distractors: [
        {
          text: String(h),
          errorTag: 'concept-misconception',
          rationale: 'Reads the digit\'s face as its worth, so the column it is standing in never enters the answer at all.',
        },
        {
          text: String(h * 10),
          errorTag: 'representation-misread',
          rationale: 'Counts the digit in the column to its right — the read that turns a three-column number into a two-column one when a column has been lost.',
        },
      ],
      hints: [
        'How many of what does one digit in the hundreds column stand for?',
        'Say the column\'s name out loud. Then say how many of that size the digit counts. The two together give the worth.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The same contrast turned inside out: the WORTH is fixed and the child hunts
 * for the number in which the digit earns it. Every option carries the same
 * digit, so nothing about the digits' faces can decide it — only the columns
 * can. Both wrong numbers are built from the item's own drawn digit.
 */
const discrimWhichNumber = discrimination({
  variant: 'structural',
  cognitiveOp: 'column-hunt',
  draw: (r) => {
    const d = r.int(2, 9);
    const others = DIGITS.filter((x) => x !== d);
    const nonZero = others.filter((x) => x !== 0);
    return {
      prompt: `Which of these three numbers holds ${an(d)} ${d} that is worth ${d * 10}?`,
      correct: String(100 * r.pick(nonZero) + 10 * d + r.pick(others)),
      distractors: [
        {
          text: String(100 * d + 10 * r.pick(others) + r.pick(others)),
          errorTag: 'concept-misconception',
          rationale: 'Picks the number where the digit sits one column further left, so it is worth ten times what the question asked for.',
        },
        {
          text: String(100 * r.pick(nonZero) + 10 * r.pick(others) + d),
          errorTag: 'representation-misread',
          rationale: 'Picks the number where the digit stands in the ones column and is therefore worth only its face.',
        },
      ],
      hints: [
        'Which column makes a digit worth ten of itself?',
        'Point at the named digit in each number in turn. Say the column underneath it before you choose.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 non-computational items
// ---------------------------------------------------------------------------

/**
 * THE NUMBER RIDDLE (the C1 Day-5 signature). Two columns are named outright and
 * the third has to be deduced from the digit total, so the child works from
 * clues about columns rather than from an arithmetic instruction. The empty tens
 * column is stated as a clue, which is what makes the deduction possible at all.
 *
 * `drawFresh` on the digit pair, because two riddles sharing digits would read
 * as the same riddle even when the totals differ.
 */
const riddleEmptyColumn: ItemGen = (rng, guard, difficulty) => {
  const { h, o } = drawFresh(
    rng,
    guard,
    (r) => ({ h: r.int(1, 9), o: r.int(1, 9) }),
    (v) => `c1-riddle:${v.h}:${v.o}`,
  );
  return {
    type: 'reasoning',
    prompt: `Riddle: I am a three-digit number. My tens column is empty. My hundreds digit is ${h}. All my digits together add up to ${h + o}. Which number am I?`,
    answer: { value: String(100 * h + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'pv_riddle_v1', params: { n: 100 * h + o }, seed: rng.uint() },
    hintLadder: [
      'Which of my three columns have I told you about? Which one is still a secret?',
      'Take the digits you were handed away from the total. Put whatever is left in the column that is still open.',
    ],
    errorTags: ['task-comprehension', 'concept-misconception'],
  };
};

/**
 * DAY-5 ERROR-ANALYSIS (generated; QG-11 re-derives both numbers). See the file
 * header for why the shown slip is the two spoken digits written into each
 * other's columns rather than a column simply closing up: only the former is
 * derivable from a registered verify, and its transform — the digits of a
 * spoken number set down in the wrong order — is the same misconception the
 * child brought up from Level A, now with an empty column between the two
 * digits that moved.
 */
const eaSwappedColumns = errorAnalysis({
  verifyTemplateId: 'a_verify_teen_write_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const h = r.int(1, 9);
    const drawnO = r.int(1, 9);
    // Two equal digits would reverse to the same number, and the verify template
    // refuses to certify a slip that is really the truth. One deterministic step
    // rather than a redraw loop (kit §E2.4).
    const o = drawnO === h ? (h === 9 ? 1 : h + 1) : drawnO;
    return { n: 100 * h + o, h, o };
  },
  build: (v, p) => ({
    prompt: `A costume room has a sequin drawer with a numeral label. The stock book behind it spells the same count out. The book's line reads "${numberWords(Number(p.n))}" sequins. Setting the label to match, a student wrote ${v.wrong} on it.`,
    extension: 'Write the numeral those words really name. Then say which column each spoken digit belongs in.',
    hints: [
      'Which columns do these words name? Which column do they leave unmentioned?',
      'Draw three empty columns. Fill only the ones the words name. Then decide what stands in the column they walked past.',
    ],
    errorTags: ['representation-misread', 'concept-misconception'],
    answerKeywords: ['hundreds column', 'ones column', 'the zero holds the tens'],
  }),
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC01 = makeWeekBuilder({
  level: 'C',
  week: 1,
  conceptId: 'place-value-to-1000',
  conceptName: 'Place value to 1,000',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B2, B3, B13],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the hundreds-tens-ones chart',
  conceptFamily: 'place-value',
  deepeningDelta:
    'B2 built two-digit numbers out of bundles and sticks, where a digit only ever had two jobs to choose between and a written number never had a gap in it. C1 opens a third column, and with it the two things two columns can hide: a digit can now be worth a hundred times its face, and a number can have a column with nothing counted in it at all. So the question stops being "how many tens and how many ones?" and becomes "which column is this digit standing in, and what does the column with nothing in it still have to say?"',
  presentation: {
    audioFirst: false,
    oneOperationPerPage: false,
    scaffoldNotes:
      'Labelled hundreds-tens-ones columns beside the symbols on Days 1-2 (E53), with each column\'s worth printed underneath only where the worth is a given and not the question; bundle imagery (box of a hundred, bag of ten, loose one) on Day 1; the column labels fade from Day 3, and the chart returns unlabelled on Day 5.',
  },
  explanation: {
    hook:
      'The digit 4 can be worth four, or forty, or four hundred. Nothing about the 4 has changed. Only one thing moved. It is the column the 4 was standing in.',
    whyBeforeHow:
      'Ten ones bundle into one ten. Ten tens bundle into one hundred. Every bundle is worth ten of the bundle on its right. So the hundreds-tens-ones chart gives each size a column. Then the position of a digit does all the work. That is why ten digits can name every number up to a thousand. A digit has a face, which is the mark you see. It also has a worth. The worth is its face times whatever the column holds. It is also why an empty column still needs a zero. The zero is not nothing. It holds every digit to its left in the column it earned. Rub the zero out and those digits slide one column right. A four hundred quietly becomes a forty.',
    script: [
      {
        say: 'Watch me build a number one column at a time. Three hundreds go in the left column. Four tens go in the middle. Six ones go on the right. Look at my 3 the moment I put it down. On its own it means three. Standing in that column it means three hundred. I say that out loud every time. It is the only thing this whole week is about.',
        visual: 'A hundreds-tens-ones chart filling from the left, with each column\'s worth appearing beneath its digit.',
        figure: placeValueChart(346, {
          showValues: true,
          alt: 'a hundreds-tens-ones chart holding 346, with 3 in the hundreds over 300, 4 in the tens over 40 and 6 in the ones over 6',
        }),
      },
      {
        say: 'Now here is 484. It has two of the same digit in it. Both 4s look identical. One of them is worth a hundred times the other. The 4 on the left is four hundred. The 4 on the right is four. Neither digit is bigger than the other. One of them is just standing somewhere better.',
        visual: 'The two 4s of 484 lit in turn, with the worth of each column printed beneath.',
        figure: placeValueChart(484, {
          showValues: true,
          highlight: 'hundreds',
          alt: 'a hundreds-tens-ones chart holding 484 with the hundreds column ringed, 4 in the hundreds over 400, 8 in the tens over 80 and 4 in the ones over 4',
        }),
      },
      {
        say: 'Here is the one that catches people. Four hundred seven. I have four hundreds and seven ones. There is nothing at all in the tens. The tens column still has to be filled in. A zero goes there. Say I skip it and write just the 4 and the 7. My four hundred has walked into the tens column. It has turned into forty.',
        visual: 'An empty tens column with a zero sliding into it; the digits either side stay where they are.',
        figure: placeValueChart(407, {
          showValues: true,
          alt: 'a hundreds-tens-ones chart holding 407, with 4 in the hundreds over 400, 0 in the tens over 0 and 7 in the ones over 7',
        }),
      },
      {
        say: 'One habit before I write any three-digit number down. I check roughly how big it ought to be. The hundreds column alone can tell me. Four hundreds and a few tens must land near four hundred and fifty. So say my answer came out as forty-seven. I would not hunt for a slip in my digits. I would go and count my columns.',
        visual: 'Two bars to one scale: the size the answer ought to be, and the size forty-seven really is.',
        // The size check drawn rather than described. Both bars are lengths of
        // the same kind, so one scale is honest here: 47 comes out a tenth of
        // the bar it was mistaken for, which is the whole reason a rough size
        // catches a lost column before any digit is re-checked.
        figure: barModel(
          [
            { label: 'about four hundred and fifty', segments: [{ value: 450 }], total: '450' },
            { label: 'forty-seven', segments: [{ value: 47 }], total: '47' },
          ],
          { alt: 'a long bar for about four hundred and fifty and, to the same scale, a very short bar for forty-seven' },
        ),
      },
    ],
    summary:
      'Three columns: hundreds, tens, ones. The column a digit stands in decides what it is worth. Read a digit\'s face and its worth as two different things. Every column gets a digit, even when nothing was counted in it. The zero is what holds the other digits in place.',
    vocabulary: [
      { term: 'column (place)', kidGloss: 'hundreds, tens or ones — where a digit stands, which decides what it is worth' },
      { term: 'face', kidGloss: 'the mark you see: the 4 in 407 has a face of four' },
      { term: 'worth (value)', kidGloss: 'what a digit really counts: the 4 in 407 is worth four hundred' },
      { term: 'placeholder zero', kidGloss: 'the 0 that fills a column nothing was counted in, so the other digits stay put' },
    ],
  },
  guidedExamples: [
    {
      ...ge(1, 1, 'modeled', 'Build the number that is 3 hundreds, 4 tens and 6 ones. Say what each digit is worth.', [
        {
          teacherSay:
            'Watch me before I write a single digit. I do not start with the number. I start with the columns. I say what each one will hold. Hundreds on the left, tens in the middle, ones on the right. I do that first for a reason. The moment a digit lands in a column, it stops being a mark. It starts being an amount. I want to know which amount before I commit.',
        },
        {
          teacherSay: 'Three hundreds, four tens, six ones. How many columns is this number going to need?',
          expected: '3',
        },
      ], '346'),
      visual: 'The finished number in a hundreds-tens-ones chart, with each column\'s worth printed beneath its digit.',
      figure: placeValueChart(346, {
        showValues: true,
        alt: 'a hundreds-tens-ones chart holding the finished number 346, with 3 in the hundreds over 300, 4 in the tens over 40 and 6 in the ones over 6',
        asserts: assertsAnswer,
      }),
    },
    ge(1, 2, 'completion', 'Write the number that is 5 hundreds and 2 ones. Nothing at all is counted in the tens.', [
      { teacherSay: 'The tens column has nothing to put in it. Does that mean this number only needs two columns?', expected: 'no' },
      { childDo: 'Stand a zero in the column nothing was counted in. Then read all three digits across.', expected: '502' },
    ], '502'),
    {
      ...ge(1, 3, 'prompted', 'How much is the 7 in 273 worth?', [
        { childDo: 'Name the column the digit is standing in. Then say how many of that size it counts.', expected: '70' },
      ], '70'),
      // The chart holds the number the question GIVES and prints no worths: the
      // worth of a column is precisely what is being asked for here (L33).
      visual: 'A hundreds-tens-ones chart holding 273, with the tens column ringed.',
      figure: placeValueChart(273, {
        highlight: 'tens',
        alt: 'a hundreds-tens-ones chart holding 273 with the tens column ringed: 2 in the hundreds, 7 in the tens, 3 in the ones',
      }),
    },
    ge(1, 4, 'independent', 'Write "eight hundred nine" as a numeral. Solve cold.', [
      { childDo: 'Give every column a digit. Then check that no column was left out.', expected: '809' },
    ], '809'),
  ],
  days: [
    // Day 1 — concept echo: the four single-step readings of one idea, in the
    // order a column is met — build it, say it in worths, weigh one digit, and
    // then the column with nothing in it.
    [
      { gen: wTensOnes, diff: 2 },
      { gen: wAddWithin100, diff: 2 },
      { gen: sitBuildFromBundles, diff: 2 },
      { gen: sitBuildFromValues, diff: 2 },
      { gen: sitDigitWorth, diff: 3 },
      { gen: sitZeroTens, diff: 3 },
    ],
    // Day 2 — fluency + application: the face-versus-worth choice, the
    // predict-first two-step, and the number that arrives spoken rather than
    // written.
    [
      { gen: wCompareTwoDigit, diff: 2 },
      { gen: wSubWithin100, diff: 2 },
      { gen: discrimWorthOfDigit, diff: 3 },
      { gen: msBuildThenCompareEstimate, diff: 4 },
      { gen: sitNameToNumeral, diff: 3 },
      { gen: sitDigitWorth, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations against the rippling count, so
    // the page shape never says whether a column is about to be weighed or
    // crossed.
    [
      { gen: wTensOnes, diff: 2 },
      { gen: discrimWhichNumber, diff: 3 },
      { gen: discrimWorthOfDigit, diff: 4 },
      { gen: msRippleCount, diff: 4 },
      { gen: sitZeroTens, diff: 3 },
      { gen: sitBuildFromBundles, diff: 3 },
    ],
    // Day 4 — word problems: both multi-steps beside the two single-step builds
    // that are most easily mis-columned, so "it must be two steps" never becomes
    // the cue.
    [
      { gen: wAddWithin100, diff: 2 },
      { gen: msRippleCount, diff: 4 },
      { gen: msBuildThenCompareEstimate, diff: 5 },
      { gen: sitNameToNumeral, diff: 3 },
      { gen: sitBuildFromValues, diff: 3 },
    ],
    // Day 5 — non-computational: the swapped columns, the number riddle, and the
    // claim that settles what a placeholder zero is actually for.
    [
      { gen: wCompareTwoDigit, diff: 2 },
      { gen: eaSwappedColumns, diff: 4 },
      { gen: riddleEmptyColumn, diff: 3 },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? Take a three-digit number with a 0 in its tens column. Rub that 0 out. It still names the same amount. In one sentence, say how you know.',
          correct: 'never',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Treats the zero as decoration on some numbers but not others, though every digit standing left of it loses a whole column the moment it goes.',
            },
            {
              text: 'always',
              errorTag: 'representation-misread',
              rationale: 'Reads a zero as nothing at all, so rubbing it out looks harmless — but the hundreds digit then finds itself standing in the tens column.',
            },
          ],
          hints: [
            'What is a zero doing in a column where nothing was counted?',
            'Write one such number down and rub the zero out. Read both of them aloud before you decide.',
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
    'For grown-ups: when a three-digit number comes out wrong, ask how far off it is before you look at the digits. Ten times too small, or a whole hundred adrift, and the counting was almost certainly fine; it was a column that went missing. The question that fixes it is not "count it again" but "which column is that digit standing in?", and a child who can answer that out loud can usually repair the rest alone.',
  ],
  puzzle: (r) => {
    // Two nonzero cards and a zero. The zero cannot lead, so the search is not
    // "all six arrangements" — and saying WHY it cannot lead is the argument the
    // puzzle is really asking for. A search plus a completeness claim; nothing
    // on Day 1 asks for either.
    const [a, b] = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2);
    const built = [100 * a + 10 * b, 100 * a + b, 100 * b + 10 * a, 100 * b + a].sort((x, y) => x - y);
    return {
      id: 'C1-PZ-01',
      title: 'Puzzle Grove: The Card That Cannot Lead',
      puzzleType: 'logic',
      prompt: `You have three digit cards: ${a}, ${b} and 0. Using each card exactly once, build EVERY three-digit number you can. List them all. Then say how you know none is missing.`,
      answer: {
        value: built.join(', '),
        acceptableForms: built.map(String),
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Which of your three cards can never take the left-hand column? What would the number turn into if it did?',
        'Settle the left-hand column first. Put one card there and list what the other two can do. Then swap the leading card and do the same again.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Addition within 100 — the two-column arithmetic under every three-digit story',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 11, max: 88, regroup: 'mixed' },
  },
  mastery: [
    { gen: sitBuildFromBundles, diff: 3 },
    { gen: msRippleCount, diff: 4 },
    { gen: sitDigitWorth, diff: 3 },
    { gen: msBuildThenCompare, diff: 4 },
    { gen: sitZeroTens, diff: 3 },
    { gen: sitNameToNumeral, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step readings of one number — built from bundle counts, one named digit weighed against its column (place-value-chart affordance preserved), and the count whose tens column holds nothing. 02/04/06: the two multi-steps (a count built column by column then measured against an earlier one, and a count whose ripple crosses two columns, with its worth-printing chart preserved) and the spoken name written as a numeral. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'face-for-worth',
      description: 'Answers with the digit itself instead of what its column makes it worth, so the 4 in 465 is reported as "4" rather than as four hundred.',
      exampleWrongAnswer: 'the worth of the 4 in 465 given as 4',
      distractorRationale: 'Offer the bare digit wherever an item asks what a digit is worth.',
      reteachPointer: 'explanation/script[1] (two identical digits, one worth a hundred times the other)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'column-lost',
      description: 'Reads or writes a number with a column missing, so the digits close up and every digit left of the gap is counted one column too far right — 407 read as forty-seven, or the two spoken digits of a number set down in each other\'s columns.',
      exampleWrongAnswer: '407 read aloud as forty-seven',
      distractorRationale: 'Offer the digit counted in the column to its right, which is what a lost column costs it.',
      reteachPointer: 'explanation/script[2] (skip the tens column and four hundred walks into it and becomes forty)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'placeholder-dropped',
      description: 'Writes only the columns the story or the words happen to mention, leaving a column with nothing counted in it with no digit at all.',
      exampleWrongAnswer: '"six hundred four" written as 64',
      distractorRationale: 'Offer the numeral with the unmentioned column simply omitted.',
      reteachPointer: 'guidedExamples/C1-GE-02 (a column nothing was counted in still needs its zero)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'wrong-quantity-answered',
      description: 'Answers with a count the story mentions rather than the one the question names — one column instead of the whole number, or this year\'s total when the question asked how much bigger it is than last year\'s.',
      exampleWrongAnswer: 'a "how many more than last year?" board story answered with this year\'s total',
      distractorRationale: 'Offer a count the story genuinely states, but not the one the question points at.',
      reteachPointer: 'explanation/summary (read what the question is pointing at before writing the count down)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'column-value-slip',
      description: 'Loses hold of what a stated column amount is made of, so six hundred is slotted back into a chart as a six or as a sixty.',
      exampleWrongAnswer: 'the six hundred in "six hundred and fifty and seven" put into the tens column',
      distractorRationale: 'Offer the stated amount slotted into a neighbouring column.',
      reteachPointer: 'explanation/script[0] (a digit stops being a mark and starts being an amount the moment it lands in a column)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Place value to 1,000 — building three-digit numbers from hundreds, tens and ones and from the column amounts themselves, telling a digit\'s face apart from what it is worth (the 4 in 407 is worth four hundred, not four), writing a spoken number as a numeral, and the column that has nothing counted in it and still needs its zero.',
    improvingCandidates: [
      'naming what a digit is worth from the column it stands in',
      'writing a zero into a column nothing was counted in',
      'building one count from three column amounts before comparing it with another',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'the face-and-worth pair — a digit\'s worth comes from its column, and two identical digits in one number are almost never worth the same',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping every digit in its own column when a number is read aloud, which is what stops 407 being heard as forty-seven',
      },
      {
        errorTag: 'procedure-slip',
        text: 'writing the placeholder zero where a column was never counted into',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the count the question names, rather than one the story happens to mention on the way',
      },
      {
        errorTag: 'fact-recall',
        text: 'holding on to what a stated column amount is made of when it is slotted back into a chart',
      },
    ],
    homeFocus: {
      praiseLine:
        'You noticed that the same digit is not worth the same in two different numbers, and you checked which column each one was standing in before you wrote anything down — that noticing is the whole of this week.',
      questionForChild: 'In the number 484, both digits on the outside are 4s. Is one of them worth more than the other, and how can you tell?',
      schoolSyncHook: 'If your child\'s class calls these columns "places" or "seats" rather than columns, tell us and we will use the same word here.',
    },
    vocabularyForParent: [
      'place value (the column a digit stands in decides what it is worth)',
      'face and worth (the 4 you see, versus the four hundred it counts)',
      'placeholder zero (fills a column nothing was counted in, so the other digits stay put)',
    ],
  },
});
