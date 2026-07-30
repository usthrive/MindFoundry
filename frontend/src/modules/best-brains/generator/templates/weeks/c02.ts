/**
 * Level C · Week 2 — "Compare & round" (conceptId: compare-and-round).
 *
 * FILL-ARCHITECTURE §5 row C2: anchor "number-line neighbourhoods"; multi-step
 * "round two then compare"; error-analysis "rounds 45 down because 4 is small";
 * discrimination "which ten is NEARER vs which digit is bigger"; Day-5 signature
 * an Always/Sometimes/Never on whether rounding to the nearest ten leaves a zero
 * in the ones place.
 *
 * WHAT THIS WEEK IS ACTUALLY ABOUT, AND WHY THE LINE IS THE ANCHOR. Rounding is
 * taught almost everywhere as a digit rule — look at the next digit along, five
 * or more goes up — and a child who owns only that rule cannot say why, cannot
 * repair it when it slips, and cannot tell a tie from a decision. So nothing in
 * this week is decided by reading a digit. Every rounding item here is posed as
 * a question about DISTANCE: a count sits between two neighbouring tens (or two
 * neighbouring hundreds) and the job is to say which of the two is the shorter
 * walk away. The digit rule is then something the child can DERIVE from the
 * picture rather than something they have to be given, which is exactly the
 * relationship the discrimination items make the child act on: `discrimNearerTen`
 * pins the case where the digit-reading child and the measuring child part
 * company, and `discrimWhichLandmark` pins the case where the two landmark sizes
 * pull opposite ways.
 *
 * THE HALFWAY CASE, AND THE CONVENTION THIS WEEK ADOPTS (declared, per the brief).
 * At a count ending in 5 the two walks are exactly the same length, so nothing
 * about the number decides it: the answer is a CONVENTION, not a fact. This week
 * adopts **round half UP** — a tie goes to the greater neighbour — for three
 * reasons: it is what the shipped `roundInt` computes (`Math.round` on the
 * scaled magnitude), so the code-computed answers and the taught rule cannot
 * drift apart; it is the rule the child will meet in every school scheme at this
 * band; and it is stated to the child AS an agreement ("mathematicians agreed"),
 * never as something the numbers themselves say. Both places where a tie appears
 * — `sitHalfway` and the Day-5 error-analysis — say so in the hint ladder rather
 * than hiding it, because a child who thinks the tie was measured has learned
 * something false.
 *
 * ⚠ THE VERIFY-LIBRARY LIMIT — AND WHY THIS WEEK'S RECIPE ESCAPES IT (kit §E2.3).
 * The recipe's error-analysis is "rounds 45 down because 4 is small", and the
 * shown wrong value must be a real misconception OUTPUT, never a fabricated
 * number. The verify library has no rounding transform, so the first reading is
 * that this cannot be generated. It can: at a halfway value the two neighbouring
 * tens are exactly `n + 5` and `n − 5`, so
 *   `{ a: n, b: 5, op: '+', wrongOp: '-' }` over `d_verify_binop_misconception_v1`
 * returns `correct` = the upper neighbour (what the convention requires) and
 * `wrong` = the lower neighbour (what the wrong-digit child writes) — both
 * code-derived, both genuinely the two candidate answers, nothing invented. The
 * operands are not arbitrary either: 5 IS the distance to each neighbour, which
 * is the very quantity the week's number line draws. This is the kit's
 * "spend ten minutes looking for the identity first" rule paying out.
 *
 * MULTI-STEP, AND HOW ROUNDING RIDES IN THE CHAIN. `multiStep` composes exact
 * rational operations, so a rounding move is expressed as what it is on the
 * anchor: the HOP from the count to its nearer neighbour. `msRoundedGap` is the
 * recipe's own multi-step — tidy two counts to the nearest ten, then measure the
 * distance between the tidied numbers — and its chain is (hop the first count to
 * its neighbour) → (take off the second count) → (hop back by the second count's
 * own remainder), which folds exactly to `round(a) − round(b)`. `msRoundedTotal`
 * does the same at the hundred and joins instead of comparing. The hop operands
 * are not stated in the prose because they are not stated in the world either:
 * they are the child's own measurement, and the prose states the instruction
 * ("every figure written in the weather log is rounded to the nearest ten")
 * that produces them.
 * The arithmetic a child performs is only ever: measure a hop, and add or
 * subtract multiples of ten or a hundred — no three-digit column work, which
 * arrives in C3/C4 and must not be assumed here.
 *
 * `conceptFamily: 'place-value'` — comparing and rounding carry no within-concept
 * two-step, so both multi-steps compose with strictly-prior skills (counting on
 * and back in tens and hundreds, B10/B18, and place-by-place comparison, C1) and
 * both declare `usesPriorSkill`.
 *
 * FIGURE LAW as applied here (kit §F.7, §E2.5). The number line is the anchor,
 * and a neighbourhood line drawn to scale would ANSWER a "which ten is nearer?"
 * item at a glance — so no assessed nearest-ten or nearest-hundred item carries
 * one. The two that do are the two where the picture cannot hand anything over:
 * `sitHalfway`, where the count is drawn exactly at the midpoint of its own two
 * neighbours (the picture poses the tie; only the convention resolves it), and
 * `msRoundedGap`, whose line is a hundred wide with ticks every fifty, so the
 * two counts are placed but neither of their tens can be read off — and whose
 * asked quantity is two moves further on. Every full worked journey lives in the
 * lesson script and the guided examples, where the answer is already printed.
 *
 * WHAT WAS KEPT FROM THE OLD (v1) c02: its content coverage — compare with the
 * hundreds seat first, order three numbers including the permuted-digit trap,
 * round to the nearest ten and hundred, the halfway case, the "which counts
 * could this label be hiding?" range question, and the estimation-jar puzzle
 * spirit. Its structure, its prompts and its hint sentences are gone.
 *
 * Retrieval is backward-only into C1 (digit value, expanded form — what a digit
 * is worth where it stands, which is what makes one neighbour nearer than the
 * other) and into B13/B14 (adding and subtracting within 100, the arithmetic the
 * hops run on).
 */

import { addWhole, asWarmup, classify, digitValue, expandedForm, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { roundInt } from '../lib/compute';
import type { RatStep } from '../lib/compute';
import { assertsAnswerOf, assertsParam, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B10 = { level: 'B' as const, week: 10 };
const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };
const C1 = { level: 'C' as const, week: 1 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Drawn primitives
//
// Every range below is closed by construction, and each branch takes the SAME
// number of draws, so no shape ever needs a redraw loop: a loop consumes a
// variable number of rng draws and makes every later item in the pack depend on
// this one (kit §E2.4 / L19).
//
// Three families of value, kept disjoint on purpose so two generators can never
// contend for the same surface signature:
//   · `decidedByTen`   ones digit in {1,2,3,4,6,7,8,9} — a nearest-TEN question
//                      with a real answer (never a tie, never already on a ten);
//   · `decidedByHundred` tens digit ≠ 5 and the value never an exact hundred —
//                      a nearest-HUNDRED question with a real answer;
//   · `tie`            ones digit 5 — the halfway case, where only the
//                      convention can answer.
// ---------------------------------------------------------------------------

/** A ones digit that leaves the nearest ten genuinely decidable. */
const OFF_TEN = [1, 2, 3, 4, 6, 7, 8, 9] as const;
/** A tens digit that leaves the nearest hundred genuinely decidable. */
const OFF_FIFTY = [0, 1, 2, 3, 4, 6, 7, 8, 9] as const;

/** 3-digit count whose nearest ten is a decision, not a tie. Never reaches 1,000. */
function decidedByTen(r: Rng): number {
  return 100 * r.int(1, 8) + 10 * r.int(0, 9) + r.pick(OFF_TEN);
}

/**
 * 3-digit count inside the given hundreds, whose nearest hundred is a decision
 * and which is never an exact hundred itself. The exact-hundred case has to be
 * excluded rather than tolerated: it is a count that is already where it would
 * be rounded to, so the hop to its neighbour has no length, and an item asking a
 * child to measure a walk of nothing is not asking anything (kit §E2.4).
 */
function decidedByHundredIn(r: Rng, hLo: number, hHi: number): number {
  const h = r.int(hLo, hHi);
  const t = r.pick(OFF_FIFTY);
  // One draw either way, so the stream advances identically down both branches.
  const o = t === 0 ? r.int(1, 9) : r.int(0, 9);
  return 100 * h + 10 * t + o;
}

/** The whole 3-digit range, for the single-step nearest-hundred item. */
function decidedByHundred(r: Rng): number {
  return decidedByHundredIn(r, 1, 8);
}

/**
 * 3-digit count sitting EXACTLY halfway between its two tens, with a small tens
 * digit — so a child reading the digit to the left of the ones has a reason to
 * say "down", which is the misconception the week is built to meet.
 */
function tie(r: Rng): number {
  return 100 * r.int(1, 8) + 10 * r.int(1, 4) + 5;
}

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep) carry no figure slot and lib/
// is not ours to edit, so this wrapper does what `withEstimateFirst` does: it
// works entirely inside the returned closure, takes no new rng draw, and leaves
// the prompt — and therefore the QG-1/QG-4 surface signature — untouched. It
// reads the drafted item's `generator.params`, the very numbers the answer was
// computed from, so "a figure is built from the item's own drawn values" holds
// by construction. (Pattern established by c05/c06.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
interface ChainStep {
  op: string;
  n: number;
  d: number;
}
const numOf = (p: Params, k: string): number => Number(p[k]);
const stepsOf = (p: Params): ChainStep[] => (p.steps as ChainStep[]) ?? [];

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/** The hop from a count to a neighbour, as a chain step. Never zero-length. */
function hop(from: number, to: number): RatStep {
  return to >= from ? { op: 'add', n: to - from, d: 1 } : { op: 'sub', n: from - to, d: 1 };
}

/** The hop UNDONE — used to take a second count back off a running total. */
function unhop(from: number, to: number): RatStep {
  return to >= from ? { op: 'sub', n: to - from, d: 1 } : { op: 'add', n: from - to, d: 1 };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C1 — what a digit is WORTH where it stands, which is what makes one neighbour nearer. */
const wDigitValue = asWarmup(digitValue(3), C1);
/** C1 — expanded form, the same fact said the other way round. */
const wExpanded = asWarmup(expandedForm(3), C1);
/** B13 — adding within 100, the arithmetic a hop along the line runs on. */
const wAddTwoDigit = asWarmup(addWhole(14, 42), B13);
/** B14 — subtracting within 100, the other direction of the same hop. */
const wSubTwoDigit = asWarmup(subWhole(24, 96), B14);

// ---------------------------------------------------------------------------
// Single-step situations — reporting a count roundly, and putting counts in order
// ---------------------------------------------------------------------------

/**
 * Nearest TEN, in a setting where a rounded number is what actually gets
 * displayed. No figure: a neighbourhood line drawn to scale would answer this
 * item at a glance (kit §F.7).
 */
const sitVoteBoard = situation({
  situationType: 'measurement',
  cognitiveOp: 'round-to-ten',
  draw: (r) => {
    const n = decidedByTen(r);
    return {
      prompt: `The school council counted the votes for the new playground plan and got ${countNoun(n, 'votes')}. Every number the council writes up outside the hall is rounded to the nearest ten. What number does the council write up?`,
      answerValue: String(roundInt(n, 1)),
      templateId: 'd_round_v1',
      params: { n, place: 1 },
      units: 'votes',
      hints: [
        'Which two tens does this count sit between?',
        'Count the steps from the count up to one of them and down to the other; the shorter walk names the number that goes up on the board.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Nearest HUNDRED. Same reporting move, one landmark size wider — which is the
 * whole of what makes the two-landmark discrimination a real question later in
 * the week.
 */
const sitGateFigure = situation({
  situationType: 'measurement',
  cognitiveOp: 'round-to-hundred',
  draw: (r) => {
    const n = decidedByHundred(r);
    return {
      prompt: `A football club prints Saturday's gate in its programme, always to the nearest hundred. This Saturday the gate counted ${countNoun(n, 'fans')} in. What figure does the programme print?`,
      answerValue: String(roundInt(n, 2)),
      templateId: 'd_round_v1',
      params: { n, place: 2 },
      units: 'fans',
      hints: [
        'Is this count standing in the first half of its hundred, or the second half?',
        'Find the two hundreds it lies between and the midpoint between them; which side of that midpoint the count falls on is the whole decision.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

/**
 * THE TIE. The count sits exactly halfway between its two tens, so measuring
 * cannot settle it and the convention has to.
 *
 * Figure = the neighbourhood, and this is the ONE assessed rounding item where
 * that is honest: the picture shows the count dead centre between its two
 * neighbours, which is a true statement of the given and resolves nothing. It
 * poses the question the item exists to ask — what do you do when neither walk
 * is shorter? — instead of answering it.
 */
const sitHalfway = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'round-tie',
    draw: (r) => {
      const n = tie(r);
      const name = one(r);
      return {
        prompt: `[image: a number line running from the ten below this count to the ten above it, with the count flagged between them] ${name}'s class keeps a walking-challenge chart, and each day's step count is written on it to the nearest ten. On Wednesday the class counter read ${countNoun(n, 'steps')}. What number goes on the chart for Wednesday?`,
        answerValue: String(roundInt(n, 1)),
        templateId: 'd_round_v1',
        params: { n, place: 1 },
        units: 'steps',
        hints: [
          'How far is this count from the ten below it, and how far from the ten above it?',
          'Count both walks. When they come out exactly equal, measuring has nothing left to say and the agreed rule for a tie is what decides.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const n = numOf(p, 'n');
    return numberLine(
      {
        min: n - 5,
        max: n + 5,
        step: 5,
        labels: 'ends',
        marks: [{ at: n, label: String(n), style: 'flag' }],
      },
      {
        alt: `a number line from ${fmtInt(n - 5)} to ${fmtInt(n + 5)} with ${fmtInt(n)} flagged exactly in the middle, the same distance from each end`,
        asserts: assertsParam('n', 'mark:0'),
      },
    );
  },
);

/**
 * ORDERING, plain. Three counts from three different hundreds, so the hundreds
 * settle it on their own — the baseline the permuted-digit version is heard
 * against.
 */
const sitOrderPlain = situation({
  situationType: 'comparison',
  cognitiveOp: 'order-three',
  draw: (r) => {
    const hs = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3);
    const nums = hs.map((h) => 100 * h + r.int(0, 99));
    const sorted = nums.slice().sort((x, y) => x - y);
    return {
      prompt: `Three groups on a school bug hunt counted the ladybirds they could find: ${nums.map((n) => fmtInt(n)).join(', ')}. Write the three counts in order, smallest first.`,
      answerValue: sorted.join(', '),
      templateId: 'order_three_v1',
      params: { a: nums[0], b: nums[1], c: nums[2] },
      validation: 'ordered-list',
      acceptableForms: [sorted.join(' ')],
      hints: [
        'Which place do you look at first when two counts are stood side by side?',
        'Sort on the hundreds; only when two counts share a hundred does the next place along get a say.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * ORDERING, with the trap. All three numbers are built from the SAME three
 * digits, so the digit faces are identical and only the places they sit in can
 * decide anything. This is the compare-side twin of the week's rounding
 * discrimination: reading a digit is not the same as reading a number.
 */
const sitOrderTricky = situation({
  situationType: 'comparison',
  cognitiveOp: 'order-same-digits',
  draw: (r) => {
    const [x, y, z] = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    const nums = r.shuffle([100 * x + 10 * y + z, 100 * y + 10 * z + x, 100 * z + 10 * x + y]);
    const sorted = nums.slice().sort((a, b) => a - b);
    return {
      prompt: `Three shops on one street have door numbers built from the very same three digits: ${nums.map((n) => fmtInt(n)).join(', ')}. Write the three door numbers in order, smallest first.`,
      answerValue: sorted.join(', '),
      templateId: 'order_three_v1',
      params: { a: nums[0], b: nums[1], c: nums[2] },
      validation: 'ordered-list',
      acceptableForms: [sorted.join(' ')],
      hints: [
        'Do the same three digits always make the same number, wherever they are standing?',
        'Read each number by what its digits are worth in the places they occupy, not by which digit looks biggest, and then set the three out in order.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Multi-step — the recipe's "round two, then compare", and its joining twin
// ---------------------------------------------------------------------------

/**
 * THE C2 MULTI-STEP: round two counts to the nearest ten, then compare the two
 * rounded numbers. Both counts sit inside the same hundred, and their tens are
 * far enough apart that the tidied gap is a genuine multiple of ten (never
 * nothing at all), so "how many more?" is a question about the tidied numbers
 * and not about the raw ones.
 *
 * The chain is the picture: hop the first count to its nearer ten, take off the
 * second count, then undo the second count's own hop — which folds exactly to
 * (first tidied) − (second tidied). See the file header on why a rounding move
 * rides in a rational chain as a hop.
 *
 * Figure = a line one hundred wide with ticks every fifty, carrying both counts
 * the story hands over. The ticks are too coarse to read either count's nearer
 * ten off, and the asked quantity is two moves past that anyway.
 */
const msRoundedGap = withFigure(
  multiStep({
    situationType: 'comparison',
    cognitiveOp: 'round-then-compare',
    usesPriorSkill: true,
    draw: (r) => {
      const h = r.int(1, 8);
      const wetter = 100 * h + 10 * r.int(6, 8) + r.pick(OFF_TEN);
      const drier = 100 * h + 10 * r.int(1, 3) + r.pick(OFF_TEN);
      const tidyWetter = roundInt(wetter, 1);
      const tidyDrier = roundInt(drier, 1);
      return {
        // The question names the LOG's gap, not the true one: the tidied
        // difference is not the real difference in rainfall, and a prompt asking
        // "how much more rain fell?" would have a code-computed answer to a
        // question it was not asking (kit §E2.7).
        prompt: `[image: a number line carrying the two rainfall totals the log holds] The rain gauge at a school weather station measured ${countNoun(wetter, 'mm')} of rain last year and ${countNoun(drier, 'mm')} the year before. Every figure written in the weather log is rounded to the nearest ten. How many more millimetres does the log show for last year than for the year before?`,
        initN: wetter,
        steps: [hop(wetter, tidyWetter), { op: 'sub', n: drier, d: 1 }, unhop(drier, tidyDrier)],
        units: 'mm',
        hints: [
          'Which figures does the log hold — the measurements exactly as the gauge gave them, or rounded ones?',
          'Take each measurement to its nearer ten first, and only then find the distance between the two rounded figures.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const wetter = numOf(p, 'initN');
    const drier = stepsOf(p)[1]?.n ?? wetter;
    const floor = Math.floor(wetter / 100) * 100;
    return numberLine(
      {
        min: floor,
        max: floor + 100,
        step: 50,
        labels: 'majors',
        marks: [
          { at: wetter, label: String(wetter), style: 'flag' },
          { at: drier, label: String(drier), style: 'flag' },
        ],
      },
      {
        alt: `a number line from ${fmtInt(floor)} to ${fmtInt(floor + 100)} marked every fifty, with last year's ${countNoun(wetter, 'mm')} and the year before's ${countNoun(drier, 'mm')} both flagged on it`,
        asserts: assertsParam('initN', 'mark:0'),
      },
    );
  },
);

/**
 * The joining twin, one landmark size wider: round two counts to the nearest
 * hundred, then put the tidied numbers together. The arithmetic the child
 * performs is counting hundreds, which C1 already owns — three-digit column
 * addition is C3's week and is deliberately not assumed here.
 *
 * METACOGNITION. This generator is served ONLY through the estimate-first
 * wrapper, so it can never appear twice with the same hint ladder (kit §E2.2).
 * The probe is a real call and not a rehearsal of the answer: whether a rounded
 * total lands above or below the exact one depends on which way each count went,
 * so a child has to look at both counts before working — which is the habit that
 * makes an estimate worth having.
 */
const msRoundedTotal = multiStep({
  situationType: 'combine',
  cognitiveOp: 'round-then-combine',
  usesPriorSkill: true,
  draw: (r) => {
    // Kept in separate hundreds, and capped so the two rounded figures can never
    // total more than nine hundred — the ceiling this band works inside.
    const sat = decidedByHundredIn(r, 1, 2);
    const sun = decidedByHundredIn(r, 4, 5);
    return {
      // As with `msRoundedGap`, the question names the REPORTED total and not the
      // real one — 'how many star jumps were done?' would be a different
      // question from the one this item computes (kit §E2.7).
      prompt: `A sponsored star-jump weekend counted ${countNoun(sat, 'star jumps')} on Saturday and ${countNoun(sun, 'star jumps')} on Sunday. The sponsors are given each day's figure to the nearest hundred. What do the two figures the sponsors are given come to altogether?`,
      initN: sat,
      steps: [hop(sat, roundInt(sat, 2)), { op: 'add', n: sun, d: 1 }, hop(sun, roundInt(sun, 2))],
      units: 'star jumps',
      hints: [
        'How many separate jobs does this report need before one number can be written down?',
        'Take each day to its nearer hundred on its own, and only then put the two tidied figures together.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const msRoundedTotalEstimate = withEstimateFirst(
  msRoundedTotal,
  'will the total of the two tidied figures land above or below the total of the exact counts?',
);

// ---------------------------------------------------------------------------
// Discrimination — the week's two "notice it before you compute it" traps
// ---------------------------------------------------------------------------

/**
 * THE RECIPE'S DISCRIMINATION: which ten is NEARER, against which digit is
 * BIGGER.
 *
 * The draw is pinned to the case that separates the two readings, and it is
 * pinned in BOTH directions by a coin flip, so the answer is not quietly always
 * the lower neighbour — a pattern a child would learn from the page rather than
 * from the mathematics:
 *   · large tens digit, small ones digit → the nearer ten is BELOW, while a
 *     child reading the digit to the left of the ones hears "big, go up";
 *   · small tens digit, large ones digit → the nearer ten is ABOVE, while the
 *     same child hears "small, stay put".
 * Both wrong options are computed from this item's own digits: the far
 * neighbour, and the correctly-worked WRONG landmark, which is the other way
 * this question gets missed.
 *
 * (The tens digit stays inside 1–3 / 6–8 so no option can coincide with another
 * — a child must never be offered the same number twice.)
 */
const discrimNearerTen = discrimination({
  variant: 'structural',
  cognitiveOp: 'nearer-neighbour',
  draw: (r) => {
    const h = r.int(1, 8);
    const upward = r.chance(0.5);
    const t = upward ? r.int(1, 3) : r.int(6, 8);
    const o = upward ? r.int(6, 9) : r.int(1, 4);
    const n = 100 * h + 10 * t + o;
    const below = 100 * h + 10 * t;
    const nearer = upward ? below + 10 : below;
    const farther = upward ? below : below + 10;
    return {
      prompt: `Which ten is ${fmtInt(n)} nearer to?`,
      correct: fmtInt(nearer),
      distractors: [
        {
          text: fmtInt(farther),
          errorTag: 'concept-misconception',
          rationale: 'Decides by the SIZE of the digit to the left of the ones — a large one read as an instruction to go up, a small one as an instruction to stay — instead of by which of the two tens is fewer steps away.',
        },
        {
          text: fmtInt(roundInt(n, 2)),
          errorTag: 'task-comprehension',
          rationale: 'Answers with the nearest HUNDRED: the rounding is done correctly, but to a landmark the question did not ask for.',
        },
      ],
      hints: [
        'Does the size of a digit tell you how far away a ten is?',
        'Put the count on a line between its two tens and count the steps each way; the shorter journey is the answer, whatever the digits look like.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The second trap, and the reason the week teaches two landmark sizes together:
 * the two digits are drawn so that the nearest TEN and the nearest HUNDRED pull
 * OPPOSITE ways — a large ones digit beside a small tens digit, or the reverse.
 * So a child who has learned "look at the next digit" without learning WHICH
 * next digit lands on a wrong number for a reason they can see. Flipped by a
 * coin toss, again so the answer is never quietly always the lower hundred.
 */
const discrimWhichLandmark = discrimination({
  variant: 'structural',
  cognitiveOp: 'which-landmark',
  draw: (r) => {
    const h = r.int(1, 8);
    const upward = r.chance(0.5);
    const t = upward ? r.int(6, 9) : r.int(1, 4);
    const o = upward ? r.int(1, 4) : r.int(6, 9);
    const n = 100 * h + 10 * t + o;
    const correct = upward ? 100 * h + 100 : 100 * h;
    const otherHundred = upward ? 100 * h : 100 * h + 100;
    return {
      prompt: `Rounded to the nearest hundred, which number does ${fmtInt(n)} land on?`,
      correct: fmtInt(correct),
      distractors: [
        {
          text: fmtInt(otherHundred),
          errorTag: 'concept-misconception',
          rationale: 'Reads the ONES digit as the decider for a hundred — a large one sent up, a small one kept down — when the ones digit only ever decides which TEN a count is nearest to.',
        },
        {
          text: fmtInt(roundInt(n, 1)),
          errorTag: 'task-comprehension',
          rationale: 'Rounds to the nearest ten — correctly — when the question named the hundred, so the answer is tidied to the wrong-sized landmark.',
        },
      ],
      hints: [
        'How wide is the stretch this question is asking about — a ten, or a hundred?',
        'Name the two hundreds the count lies between, then decide which half of that stretch it is standing in.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's own error: 45 rounded DOWN because the 4 looks small — the child
// who reads the wrong digit. See the file header for the identity that makes it
// code-derivable (at a tie the two neighbours are exactly n+5 and n−5, so the
// operation-swap template produces precisely the two candidate answers).
//
// The item is deliberately the week's hardest reading: the student's rounding is
// not merely a slip in the wrong direction, it is a tie that the student thought
// was a measurement. So the child has to say both things — what the two walks
// come to, and what settles a draw.
// ---------------------------------------------------------------------------

const eaTieRoundedDown = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const n = tie(r);
    return { a: n, b: 5, op: '+', wrongOp: '-', n, tens: Math.floor(n / 10) % 10 };
  },
  build: (v, p, r) => {
    const n = Number(p.n);
    const tens = Number(p.tens);
    const name = one(r);
    return {
      prompt: `${name}'s class ran a sponsored spell for the school library, and the certificate prints the number of words spelled correctly to the nearest ten. The class spelled ${countNoun(n, 'words')} correctly. A student filling in the certificate put ${v.wrong} on it, and gave this reason: "the ${tens} in the middle is only a small digit, so it goes down."`,
      extension: 'Write the number the certificate has to show, and explain in one sentence what the two walks — to the ten below and to the ten above — have to do with the decision.',
      hints: [
        'Which two tens is this count standing between, and is it closer to either one of them?',
        'Walk to each neighbour in turn and count the steps both ways; if neither walk is shorter, ask what the class agreed to do about a draw.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: ['the same distance', 'halfway', 'exactly in the middle', 'the ones digit', 'the agreed rule'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC02 = makeWeekBuilder({
  level: 'C',
  week: 2,
  conceptId: 'compare-and-round',
  conceptName: 'Compare & round',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [B13, B14, C1],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the two neighbours on the number line',
  conceptFamily: 'place-value',
  deepeningDelta:
    'C1 settled what a three-digit number IS: three places, each worth ten of the one to its right, so 407 is four hundreds and seven ones and never "forty-seven". C2 puts those numbers on a line and asks two new questions about them — which of two numbers is further along it, and which landmark a number is standing nearest to. That second question is the new idea: it makes a number\'s SIZE, rather than its digits, the thing being reasoned about, and it introduces the first piece of mathematics this child meets that is settled by agreement rather than by proof — what to do when a count sits exactly halfway between two neighbours.',
  explanation: {
    hook:
      'A sign at the gate says "about 400". The turnstile clicked a different number all day long. So which counts is that sign allowed to be standing in for — and which ones could never be hiding behind it?',
    whyBeforeHow:
      'Rounding is not a rule about digits. It is a question about distance: every count sits somewhere between the two neighbours on the number line that could stand in for it — the ten below it and the ten above, or the hundred below and the hundred above — and because one of those two is nearly always fewer steps away than the other, that closer neighbour is the tidy number we can swap in without saying anything very untrue. Comparing works the same way and for the same reason: the further along the line a number sits, the bigger it is, which is why the first place where two numbers differ settles the whole contest and no later digit can overturn it. Once you can see a number sitting between its two neighbours, the digit rules stop being things to remember and start being things you can read off the picture. Only one case cannot be read off it: when a count lands exactly in the middle, both walks are the same length and the number itself has no opinion. That one is settled by an agreement — mathematicians decided a tie goes UP — and knowing it is an agreement rather than a fact is part of knowing it.',
    script: [
      {
        say: 'Here is 372, and here are its two neighbours, the tens it is sitting between: 370 on one side and 380 on the other. I am not going to look at any digit yet. I am going to ask how far it is to each neighbour, because that is the actual question rounding asks.',
        visual: 'A number line from 370 to 380 with 372 flagged near the left-hand end.',
        figure: numberLine(
          {
            min: 370,
            max: 380,
            step: 5,
            labels: 'all',
            marks: [{ at: 372, label: '372', style: 'flag' }],
          },
          { alt: 'a number line from 370 to 380 with 372 flagged close to the 370 end' },
        ),
      },
      {
        say: 'Two steps back to 370. Eight steps on to 380. Two is a shorter walk than eight, so 372 rounds to 370 — and notice that I never needed the rule. Now watch what the rule actually is: the ones digit told me how far I had walked from the ten below. Small ones digit, short walk back, stay where you are.',
        visual: 'The same line with both hops drawn and counted — two steps back, eight steps on.',
        figure: numberLine(
          {
            min: 370,
            max: 380,
            step: 5,
            labels: 'all',
            marks: [{ at: 372, label: '372', style: 'flag' }],
            hops: [
              { from: 372, to: 370, label: 'two steps' },
              { from: 372, to: 380, label: 'eight steps' },
            ],
          },
          { alt: 'a number line from 370 to 380 with a short hop from 372 back to 370 and a long hop from 372 on to 380' },
        ),
      },
      {
        say: 'Now a hard one: 845. The two tens either side are 840 and 850, and the walk to each is five steps. Five and five. Nothing about this number can break the tie — so mathematicians agreed on one: a count sitting exactly in the middle goes UP. That is an agreement, not a discovery, and 845 goes to 850 because we all said so.',
        visual: 'A number line from 840 to 850 with 845 flagged exactly at the midpoint and both five-step hops drawn.',
        figure: numberLine(
          {
            min: 840,
            max: 850,
            step: 5,
            labels: 'all',
            marks: [{ at: 845, label: '845', style: 'flag' }],
            hops: [
              { from: 845, to: 840, label: 'five steps' },
              { from: 845, to: 850, label: 'five steps' },
            ],
          },
          { alt: 'a number line from 840 to 850 with 845 flagged at the midpoint and two hops of equal length drawn, one to each end' },
        ),
      },
      {
        say: 'One last habit, and it is the reason any of this is useful. Before I add two counts I round them and check roughly where the answer belongs: about 200 and about 500 is about 700, so a total near seven hundred is sensible and a total of ninety is not. Rounding is how you know an answer is the right SIZE before you know whether it is exactly right.',
        visual: 'Two counts on a line, each with an arrow to its nearer hundred, held beside the sensible total.',
        figure: numberLine(
          {
            min: 0,
            max: 800,
            step: 100,
            labels: 'majors',
            marks: [
              { at: 187, label: '187', style: 'flag' },
              { at: 512, label: '512', style: 'flag' },
            ],
            hops: [
              { from: 187, to: 200, label: 'to its nearer hundred' },
              { from: 512, to: 500, label: 'to its nearer hundred' },
            ],
          },
          { alt: 'a number line from 0 to 800 marked every hundred, with 187 flagged and hopping to 200 and 512 flagged and hopping to 500' },
        ),
      },
    ],
    summary:
      'Put the number between its two neighbours before you decide anything. Count the walk each way; the shorter walk names the tidy number, and the digit rule is just that measurement written down. When both walks are the same length there is nothing left to measure, so the agreement takes over and the tie goes up. To compare, run along the line from the biggest place: the first place where two numbers differ has already settled it.',
    vocabulary: [
      { term: 'round', kidGloss: 'swap a count for the tidy neighbour it is standing nearest to' },
      { term: 'neighbours', kidGloss: 'the two tidy numbers a count is sitting between — the one below it and the one above' },
      { term: 'nearer', kidGloss: 'fewer steps away along the line; this is what rounding is really asking' },
      { term: 'a tie', kidGloss: 'a count sitting exactly in the middle, where both walks are the same length and the agreed rule sends it up' },
    ],
  },
  guidedExamples: [
    {
      ...ge(2, 1, 'modeled', 'Round 372 to the nearest ten.', [
        {
          teacherSay:
            'Watch what I do before I decide anything at all. I put 372 on a line between the two tens it is sitting inside — one below it, one above it. Now I am not remembering a rule, I am measuring: how far is it to each of those two?',
        },
        {
          teacherSay: 'Back to the ten below is two steps. On to the ten above is eight steps. Which of those two walks is the shorter one?',
          expected: '370',
        },
      ], '370'),
      visual: 'The finished line, with the short hop back to the nearer ten drawn and labelled.',
      figure: numberLine(
        {
          min: 370,
          max: 380,
          step: 5,
          labels: 'all',
          marks: [
            { at: 372, label: '372', style: 'flag' },
            { at: 370, label: '370', style: 'point' },
          ],
          hops: [{ from: 372, to: 370, label: 'the shorter walk' }],
        },
        {
          alt: 'a number line from 370 to 380 with 372 flagged and a short hop drawn back to 370',
          asserts: assertsAnswerOf('mark:1'),
        },
      ),
    },
    {
      ...ge(2, 2, 'completion', 'Round 845 to the nearest ten. Look hard at this one before you write.', [
        { teacherSay: 'This count is sitting exactly in the middle of its two tens. Can measuring the two walks settle it?', expected: 'no' },
        { childDo: 'Use the agreement the class made about a tie, and write the number that goes on the label.', expected: '850' },
      ], '850'),
      // COMPLETION fade: the child produces 850, so the picture shows only the
      // neighbourhood it was GIVEN — the two ends and the count sitting midway.
      // Marking the destination would answer the step (L33).
      visual: 'A number line from 840 to 850 with 845 flagged at the midpoint and neither end chosen.',
      figure: numberLine(
        {
          min: 840,
          max: 850,
          step: 5,
          labels: 'ends',
          marks: [{ at: 845, label: '845', style: 'flag' }],
        },
        { alt: 'a number line labelled 840 at one end and 850 at the other, with 845 flagged exactly halfway between them' },
      ),
    },
    ge(2, 3, 'prompted', 'Round 268 to the nearest hundred.', [
      { childDo: 'Say which two hundreds it is sitting between, then which half of that stretch it is standing in.', expected: '300' },
    ], '300'),
    {
      ...ge(2, 4, 'independent', 'A survey book takes every count to the nearest ten. Two counts came in today: 434 and 388. Tidy both, then say how many more the first is than the second. Solve cold.', [
        { childDo: 'Tidy each count on its own first, and only then measure between the two tidied numbers.', expected: '40' },
      ], '40'),
      visual: 'Both counts flagged on one line, with no tidying done for you.',
      figure: numberLine(
        {
          min: 350,
          max: 450,
          step: 50,
          labels: 'majors',
          marks: [
            { at: 434, label: '434', style: 'flag' },
            { at: 388, label: '388', style: 'flag' },
          ],
        },
        { alt: 'a number line from 350 to 450 marked every fifty, with 434 and 388 both flagged on it' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: report one count roundly at each landmark size, and
    // put three counts in order. Nothing here needs two moves.
    [
      { gen: wDigitValue, diff: 2 },
      { gen: wExpanded, diff: 2 },
      { gen: wAddTwoDigit, diff: 2 },
      { gen: sitVoteBoard, diff: 2 },
      { gen: sitOrderPlain, diff: 3 },
      { gen: sitGateFigure, diff: 3 },
    ],
    // Day 2 — fluency + application: the nearer-vs-bigger-digit trap, the tie,
    // and the estimate-first two-step.
    [
      { gen: wSubTwoDigit, diff: 2 },
      { gen: wAddTwoDigit, diff: 2 },
      { gen: discrimNearerTen, diff: 3 },
      { gen: sitHalfway, diff: 3 },
      { gen: msRoundedTotalEstimate, diff: 4 },
      { gen: sitVoteBoard, diff: 3 },
    ],
    // Day 3 — interleave: both traps against the week's own multi-step and the
    // permuted-digit ordering, so the page shape never says what is coming.
    [
      { gen: wDigitValue, diff: 2 },
      { gen: discrimWhichLandmark, diff: 4 },
      { gen: discrimNearerTen, diff: 4 },
      { gen: sitOrderTricky, diff: 3 },
      { gen: msRoundedGap, diff: 4 },
      { gen: sitGateFigure, diff: 3 },
    ],
    // Day 4 — word problems: both multi-steps, with single-step work mixed in so
    // "it must be two moves" never becomes the cue.
    [
      { gen: msRoundedGap, diff: 4 },
      { gen: msRoundedTotalEstimate, diff: 5 },
      { gen: sitOrderTricky, diff: 4 },
      { gen: sitHalfway, diff: 4 },
      { gen: sitOrderPlain, diff: 3 },
    ],
    // Day 5 — non-computational: the wrong-digit error-analysis, the range
    // question behind every rounded label, and the claim about what rounding
    // leaves in the ones place.
    [
      { gen: wExpanded, diff: 2 },
      { gen: eaTieRoundedDown, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'A sign at a gate shows a count rounded to the nearest hundred, and it reads 400. The real count was a whole number. Write the SMALLEST whole number the sign could be standing in for, and the LARGEST, then write one sentence saying how you know that nothing outside those two could be hiding behind it.',
          value: 'the smallest is 350 and the largest is 449',
          acceptableForms: ['350', '449', '350 and 449', 'from 350 to 449'],
          keywords: true,
          hints: [
            'Which counts are close enough to that sign for it to be telling the truth?',
            'Start at the sign\'s own number and walk outward in both directions, stopping at the last count that still has it as the nearer neighbour.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: when a count is rounded to the nearest ten, the number written down has a 0 in its ones place. Write one sentence explaining how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Treats a count that was already standing on a ten as an exception, as though a number that does not have to move has not been rounded at all — but the number written down is still a ten, and still ends in a zero.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Hears the claim as being about the ORIGINAL count\'s ones digit, which of course keeps whatever digit it started with, rather than about the tidied number that gets written down.',
            },
          ],
          hints: [
            'What do all the numbers you can possibly land on after rounding to a ten have in common?',
            'Write out a handful of your own rounded answers, including one for a count that was already sitting on a ten, and look at the last digit of every one of them.',
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
    'For grown-ups: if a rounded answer comes back wrong, ask "how far is it to each neighbour?" rather than "which digit do you look at?". Nearly every rounding mistake at this age is a child reading a digit they were never meant to read, and the question about distance repairs it in one go — where re-stating the digit rule only gives them a second rule to mix up with the first. The one case where distance genuinely cannot decide is a count ending in 5: that is a tie, and our class agreement is that a tie goes up.',
  ],
  puzzle: (r) => {
    // Two clues at two landmark sizes at once — a search with a completeness
    // argument, which no core item asks for. The ten named always ends in 50, so
    // the two clues genuinely interact: the ten-clue admits ten counts, and the
    // hundred-clue keeps exactly the five of them on its own side of the middle.
    const h = r.int(2, 8);
    const ten = 100 * h + 50;
    const upward = r.chance(0.5);
    // round-half-up: the ten 50 rounds to the hundred ABOVE it, so the counts
    // that satisfy both clues are the five at whichever end of the ten-clue's
    // run sits on the named hundred's side.
    const hundred = upward ? 100 * (h + 1) : 100 * h;
    const first = upward ? ten : ten - 5;
    const answers = [0, 1, 2, 3, 4].map((k) => String(first + k));
    return {
      id: 'C2-PZ-01',
      title: 'Puzzle Grove: Two Signs, One Number',
      puzzleType: 'logic',
      prompt: `A whole number is hiding behind two signs at once. Rounded to the nearest ten it is ${fmtInt(ten)}. Rounded to the nearest hundred it is ${fmtInt(hundred)}. Write down EVERY whole number it could be, then say how you know that none is missing from your list.`,
      answer: {
        value: answers.join(', '),
        acceptableForms: answers,
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'Which of the two signs pins the hiding number down to fewer places?',
        'Write out every number the ten-sign allows — walk from the middle of the run outward in both directions — then test each one against the hundred-sign and keep only the survivors.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'constraint-search' },
  sprint: {
    skill: 'Adding tens — the hop this week does all its measuring in',
    sourceWeek: B10,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'add_tens_2digit_v1',
    params: { baseRange: [23, 71], tensRange: [10, 20], noCross100: true },
  },
  mastery: [
    { gen: sitVoteBoard, diff: 3 },
    { gen: msRoundedGap, diff: 4 },
    { gen: sitOrderTricky, diff: 3 },
    { gen: msRoundedTotalEstimate, diff: 4 },
    { gen: sitGateFigure, diff: 3 },
    { gen: sitHalfway, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05/06: single-step work — a count reported to the nearest ten, three door numbers built from one set of digits put in order, a count reported to the nearest hundred, and the tie that only the agreement can settle (its midpoint number-line affordance preserved). 02/04: the two multi-steps — two counts tidied to the nearest ten and then compared (with its hundred-wide line), and two counts tidied to the nearest hundred and then joined, kept inside its estimate-first frame so the ladder never doubles. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'reads-a-digit-not-a-distance',
      description: 'Decides a rounding by the SIZE of a digit rather than by which neighbour is fewer steps away — so a count with a large tens digit is sent up to the next ten, and a count with a large ones digit is sent up to the next hundred, whichever landmark was asked for.',
      exampleWrongAnswer: '273 rounded to the nearest ten given as 280',
      distractorRationale: 'Offer the neighbour a digit-reader would pick — the far one — computed from the item\'s own digits.',
      reteachPointer: 'explanation/script[1] (the ones digit only tells you how far you have walked from the ten below)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'wrong-landmark-size',
      description: 'Rounds correctly, but to the landmark the question did not name — the nearest ten when a hundred was asked for, or the other way round — so the arithmetic is sound and the answer is still not an answer to this question.',
      exampleWrongAnswer: '348 to the nearest hundred given as 350',
      distractorRationale: 'Offer the correctly-rounded WRONG place, computed from the item\'s own value.',
      reteachPointer: 'explanation/summary (put the number between its two neighbours — and check which size of neighbour was asked for)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'tie-sent-down',
      description: 'Sends a count that is sitting exactly halfway between two neighbours down to the lower one, usually while reading the digit to the left of the ones as evidence that it belongs there.',
      exampleWrongAnswer: '845 to the nearest ten given as 840',
      distractorRationale: 'Offer the lower neighbour on any count ending in 5 — it is a real candidate, and only the agreement rules it out.',
      reteachPointer: 'explanation/script[2] (both walks are five steps, so the agreement decides) + guidedExamples/C2-GE-02',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'digit-face-beats-place',
      description: 'Compares or orders numbers by which digit LOOKS biggest rather than by the place each digit is standing in, so numbers built from the same digits are read as the same size.',
      exampleWrongAnswer: '351 placed after 513 because the 5 is the biggest digit in both',
      distractorRationale: 'Offer an order that is right about the digits and wrong about the places.',
      reteachPointer: 'explanation/whyBeforeHow (the first place where two numbers differ has already settled it)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Comparing numbers up to 1,000 place by place, putting three of them in order, and rounding to the nearest ten and the nearest hundred — done throughout as a question about DISTANCE on a number line ("which neighbour is fewer steps away?") rather than as a rule about digits, including the halfway case, where both walks are equal and an agreement rather than a measurement decides.',
    improvingCandidates: [
      'putting a count between its two neighbours before deciding anything',
      'checking which size of landmark the question asked for',
      'handling a count that sits exactly halfway between two neighbours',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'measuring the walk to each neighbour instead of judging by how big a digit looks — this is the one habit the whole week rests on',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading which landmark was asked for, a ten or a hundred, before starting',
      },
      {
        errorTag: 'procedure-slip',
        text: 'counts ending in 5, where neither walk is shorter and our agreed rule sends the tie up',
      },
      {
        errorTag: 'representation-misread',
        text: 'comparing by the place a digit stands in rather than by which digit looks biggest',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the steps to each neighbour before you chose one, and you checked which landmark the question had asked for — that is measuring rather than guessing, and it is exactly what this week is built on.',
      questionForChild: 'A sign says "about 300 people". What is the smallest real count it could be standing in for, and the biggest?',
      schoolSyncHook: 'Schools differ on the halfway case in wording only — some say "5 or more rounds up", some say "a tie goes up". We teach it as an agreement either way; tell us the phrase your child\'s class uses and we will match it.',
    },
    vocabularyForParent: [
      'neighbours (the tidy numbers a count sits between — the ten or hundred below it and the one above)',
      'nearer (fewer steps away on the number line; the actual question rounding asks)',
      'a tie (a count exactly halfway between two neighbours, where the agreed rule sends it up)',
    ],
  },
});
