/**
 * Level B · Week 6 — "The balanced equal sign" (conceptId: balanced-equal-sign).
 *
 * FILL-ARCHITECTURE §4 row B6: anchor "balance scale"; multi-step "both-sides
 * totals"; error-analysis "says 3 + 4 = 7 + 2 is fine because 3 + 4 is 7";
 * discrimination the "= means the answer comes next" trap ("is 8 = 3 + 5 OK?");
 * Day-5 signature "true/false equation sort".
 *
 * One of B's four on-thread algebra weeks (B6, B7, B8, B15), and the one the
 * other three stand on. The misconception it exists to kill — that `=` announces
 * an answer rather than asserting a balance — is invisible for as long as every
 * equation a child meets has its answer on the right, so this week refuses to
 * write one. Every core page puts either an add on BOTH sides, or the single
 * number FIRST, or the unknown somewhere other than last:
 *
 *   - `judgeBothSides` and `pickTrueSentence` show `a + b = c + d`, where the
 *     conventional reading ("the number after = is the answer") gives the WRONG
 *     verdict on half the draws by construction: the false ones are drawn as
 *     `a + b = (a+b) + e`, which is literally the recipe's `3 + 4 = 7 + 2`;
 *   - `totalFirstAllowed` writes the total first (`t = p + q`) and offers the
 *     "that is not allowed" option beside the two honest verdicts, so a child
 *     holding the operator view has somewhere to put it and is caught;
 *   - the balance-scale stories put the unknown on the LEFT of the sentence as
 *     often as on the right, because a pan is a pan.
 *
 * THE ANCHOR IS DRAWN, NOT DESCRIBED. `barModel` shows two pans of one scale in
 * the script and in three of the four guided examples — the places where the
 * answer is already on the page and a full worked journey belongs (kit §E2.5).
 * On ASSESSED items the picture states a GIVEN and never the answer:
 *   - `buildTheOtherSide` draws the two heaps ALREADY on the left pan and
 *     asserts the first heap against the item's own `a`;
 *   - `bagOnTheOtherSide` and `msThreeOnTheLeft` draw the pan that can be
 *     counted end to end and leave the closed bag out of the picture entirely —
 *     an empty box drawn to true length is still the answer, measured;
 *   - `msBalanceGap` is the one assessed page that draws BOTH pans, and it can:
 *     nothing is hidden there, the scale is honestly tilted, and the answer is
 *     the gap, which no length hands over at this band.
 *
 * ⚠ VERIFY-LIBRARY LIMIT, and the choice made (kit §E2.3, documented here rather
 * than buried). The recipe's error-analysis child JUDGES `3 + 4 = 7 + 2` to be
 * fine. The verify library varies the OPERATION over one fixed operand pair, so
 * for a shown wrong value of "the left total, copied straight after the =" it
 * would have to return the FIRST operand — no template does, and no honest pair
 * produces it. Rather than fabricate the number, this week does two things:
 *   - the judgment itself — the exact `a + b = (a+b) + e` sentence — is where it
 *     CAN be shown honestly, as a code-selected discrimination option and as the
 *     Day-5 sort's distractor, so the recipe's item is on the page twice;
 *   - the Day-5 error-analysis shows the same misconception's OTHER documented
 *     output, which is derivable: given `a + b = ▢ + c`, the child who reads `=`
 *     as "and then" runs the total straight along the line and writes
 *     `a + b + c`. Over the pair (a+b, c) that is `+`, while the true box value
 *     is `−` — one operand pair, two real operations, so
 *     `d_verify_binop_misconception_v1` re-derives BOTH and neither is invented.
 * Both responses come from one belief about the equals sign, which is why the
 * week can split them across two pages without splitting the idea.
 *
 * CONCEPT FAMILY: 'operation'. The week could have claimed 'place-value' (its
 * concept is a symbol's meaning) and stopped at one multi-step; it clears the
 * harder row instead, with three multi-step slots from two generators, because
 * "total this side, then see what the other side still owes" IS the concept and
 * is genuinely two steps.
 *
 * Retrieval is backward-only into B1 (numbers to 120), B2 (tens and ones), B4
 * (count on) and B5 (make ten to add) — the totalling every page here runs on.
 */

import { asWarmup, classify } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsParam, barModel, tenFrame } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B1 = { level: 'B' as const, week: 1 };
const B2 = { level: 'B' as const, week: 2 };
const B4 = { level: 'B' as const, week: 4 };
const B5 = { level: 'B' as const, week: 5 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/**
 * Things a six-year-old can actually drop into a pan: small, hard, roughly of a
 * size, and countable. The pool was chosen by scanning every authored week for
 * its nouns (kit §E2.8) — cubes, beads, blocks, shells, buttons, counters,
 * marbles and tiles are all claimed elsewhere, several of them many times over,
 * and a balance week that borrowed them would read as a page from another week.
 */
const PAN_NOUNS = ['corks', 'chestnuts', 'walnuts', 'cotton reels', 'wooden discs'] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN drawn values.
//
// The shipped primitives carry no figure slot and lib/ is not ours to edit, so
// this does what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so
// the QG-1/QG-4 surface signature the guard already registered is unchanged).
// It rebuilds from the drafted item's `generator.params` — the very numbers the
// answer was computed from — which is what makes a contradicting picture
// unbuildable rather than merely unlikely.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

/** The n of the k-th step of a `multiStep` chain, read back off its own params. */
function stepN(p: Params, k: number): number {
  const steps = p.steps;
  if (!Array.isArray(steps) || steps[k] === undefined) {
    throw new Error(`b06/stepN: the chain has no step ${k} to draw from`);
  }
  return Number((steps[k] as { n: number }).n);
}

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/** A pan drawn as one bar, its heaps side by side — the shape every figure here uses. */
function pan(label: string, heaps: readonly number[]): {
  label: string;
  segments: Array<{ value: number; label: string }>;
} {
  return { label, segments: heaps.map((v) => ({ value: v, label: String(v) })) };
}

/**
 * "3 and 5 corks", "4, 4 and 7 walnuts" — a pan's heaps in words.
 *
 * The noun is named ONCE, at the end. Naming it per heap is what produced "4
 * walnuts, 4 walnuts and 7 walnuts", which is accurate, unreadable, and the kind
 * of sentence only reading the generated week catches. Every heap here is ≥2, so
 * the shared plural is always the right one.
 */
function heapWords(heaps: readonly number[], noun: string): string {
  if (heaps.length === 1) return countNoun(heaps[0], noun);
  const head = heaps.slice(0, -1).join(', ');
  return `${head} and ${heaps[heaps.length - 1]} ${unitFor(2, noun)}`;
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B5 — the partner that fills the frame. It is here because every page this week
 * asks "what does this side still owe?", and the ten-frame is where that
 * question was first asked with something the child could see.
 */
const wFillTheFrame = withFigure(
  asWarmup(
    situation({
      situationType: 'part-whole',
      cognitiveOp: 'partner-of-ten',
      draw: (r) => {
        const shown = r.int(2, 8);
        return {
          prompt: `A ten-frame already holds ${countNoun(shown, 'counters')}. How many more counters would fill it?`,
          answerValue: String(10 - shown),
          templateId: 'retr_partners_of_10_v1',
          params: { a: shown },
          units: 'counters',
          hints: [
            'Picture the frame full — how much of it is still bare?',
            'Run your eye along the empty cells, or name the partner that reaches ten.',
          ],
          errorTags: ['fact-recall', 'representation-misread'],
        };
      },
    }),
    B5,
  ),
  (p) => tenFrame(numOf(p, 'a'), { asserts: assertsParam('a') }),
);

/** B4 — counting on, the move a "how many more?" question turns into. */
const wFrogHops = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-on',
    draw: (r) => {
      const start = r.int(7, 16);
      const hop = r.pick([2, 3, 4] as const);
      return {
        prompt: `A frog sits on ${start} on the number path. It jumps forward ${countNoun(hop, 'times')}, one number each jump. Which number is the frog on now?`,
        answerValue: String(start + hop),
        templateId: 'count_on_v1',
        params: { start, hop },
        hints: [
          'Does a forward jump make the number grow, or shrink?',
          'Say the starting number out loud, then name the next number once for every jump.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B4,
);

/** B2 — a two-digit number is two parts, not two digits. */
const wBundledSticks = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'pv-compose',
    draw: (r) => {
      const t = r.int(2, 9);
      const o = r.int(1, 9);
      return {
        prompt: `${countNoun(t, 'bundles')} of ten sticks are put beside ${countNoun(o, 'loose sticks')}. Which number do the sticks make altogether?`,
        answerValue: String(10 * t + o),
        templateId: 'tens_ones_compose_v1',
        params: { t, o },
        hints: [
          'How many sticks travel together inside one bundle?',
          'Name the bundles as a tens number, then let the loose sticks fill the ones.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  B2,
);

/** B1 — the number that sits between two others, on the street the path became. */
const wHouseBetween = asWarmup(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'order',
    draw: (r) => {
      const a = r.int(21, 88);
      return {
        prompt: `Two houses on the number street are numbered ${a} and ${a + 2}. Which number belongs to the house standing between them?`,
        answerValue: String(a + 1),
        templateId: 'number_between_v1',
        params: { a },
        hints: [
          'Count from the smaller house number — what do you say next?',
          'Name the smaller number, then say the very next counting number and stop.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B1,
);

// ---------------------------------------------------------------------------
// The balance-scale stories — the anchor doing the work
// ---------------------------------------------------------------------------

/**
 * The concept echo. Two heaps sit on the left pan and the right pan is bare, so
 * the only question a balance can ask is: how much does the other side owe?
 *
 * The picture draws the two heaps that are ALREADY there and asserts the first
 * of them against the item's own `a`. It never draws the right pan, because the
 * right pan is the answer.
 */
const buildTheOtherSide = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'match-the-side',
    draw: (r) => {
      const a = r.int(3, 9);
      const b = r.int(2, 9);
      const noun = r.pick(PAN_NOUNS);
      const name = one(r);
      return {
        prompt: `[image: the left pan of a balance, holding ${heapWords([a, b], noun)} in two heaps] ${name} puts ${countNoun(a, noun)} on the left pan of a balance. Then ${b} more go beside them. The right pan is bare. How many ${unitFor(2, noun)} must go on the right pan to balance it?`,
        answerValue: String(a + b),
        templateId: 'd_add_v1',
        // `units` rides along in the params so the picture can NAME what it
        // draws. `d_add_v1` reads a and b only, so the extra key is inert to
        // QG-5 and load-bearing for the figure's accessible name.
        params: { a, b, units: noun },
        units: noun,
        hints: [
          'What has to be true about two pans before the bar between them sits level?',
          'Gather the loaded pan into one amount, and let the bare pan copy it.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'a');
    const b = numOf(p, 'b');
    const noun = strOf(p, 'units');
    return barModel([pan('the first heap', [a]), pan('the second heap', [b])], {
      scaleMax: a + b,
      brace: { label: 'the left pan' },
      alt: `the left pan of a balance, drawn as two heaps: ${heapWords([a, b], noun)}`,
      asserts: assertsParam('a', 'bar:0'),
    });
  },
);

/**
 * The same arithmetic with the unknown moved to the FRONT of the sentence — the
 * story form of `▢ = a + b`, and the page that makes `totalFirstAllowed` mean
 * something rather than merely being allowed. A bag on one pan is balanced by
 * two heaps on the other, and there is no side of a scale on which an unknown is
 * out of place.
 *
 * The picture is the pan that CAN be counted; the bag is left out of it, for the
 * reason given on `bagOnTheOtherSide`.
 */
const matchTheHeap = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'balance-unknown-left',
    draw: (r) => {
      const a = r.int(3, 9);
      const b = r.int(2, 9);
      const noun = r.pick(PAN_NOUNS);
      return {
        prompt: `[image: the right pan of a balance, holding ${heapWords([a, b], noun)} in two heaps] One closed bag sits on the left pan of a balance. The right pan holds ${countNoun(a, noun)} and ${b} more. The bar sits level. How many ${unitFor(2, noun)} are inside the bag?`,
        answerValue: String(a + b),
        templateId: 'd_add_v1',
        params: { a, b, units: noun },
        units: noun,
        hints: [
          'Does it matter which pan of a balance the hidden amount is sitting on?',
          'Weigh the pan you can see, and the bag has to come to exactly that.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'a');
    const b = numOf(p, 'b');
    const noun = strOf(p, 'units');
    return barModel([pan('the first heap', [a]), pan('the second heap', [b])], {
      scaleMax: a + b,
      brace: { label: 'the right pan' },
      alt: `the right pan of a balance, drawn as two heaps: ${heapWords([a, b], noun)}`,
      asserts: assertsParam('a', 'bar:0'),
    });
  },
);

/**
 * The same law read the other way round: the scale is ALREADY level, so the
 * closed bag is pinned to whatever the visible pan is short of.
 *
 * The picture is the pan that can be counted from end to end, and it asserts
 * that pan's total against the item's own `a` — a given, stated in the prose.
 * The bag is not drawn at all: an unlabelled box at true length is still the
 * answer to anyone who lays a finger against it (kit §F.7).
 */
const bagOnTheOtherSide = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'balance-unknown',
    draw: (r) => {
      const x = r.int(4, 9);
      const y = r.int(3, 8);
      const total = x + y;
      // The visible right-hand heap never COPIES a left-hand heap: with
      // `7 + 3` on the left and `7` in the open on the right, the bag can be
      // read off by matching heap to heap and no totalling ever happens. The
      // pool is built and picked from once — a redraw loop would consume a
      // variable number of draws and break seed-stability (kit §E2.4). It
      // cannot run dry: the range holds total-3 ≥ 4 values and excludes 2.
      const pool: number[] = [];
      for (let v = 2; v <= total - 2; v++) if (v !== x && v !== y) pool.push(v);
      const seen = r.pick(pool);
      const noun = r.pick(PAN_NOUNS);
      return {
        prompt: `[image: the left pan of a balance, holding ${heapWords([x, y], noun)} in two heaps] A balance is level. Its left pan holds ${countNoun(x, noun)} and ${y} more. Its right pan holds ${countNoun(seen, noun)} and one closed bag. How many ${unitFor(2, noun)} are inside the bag?`,
        answerValue: String(total - seen),
        templateId: 'd_sub_v1',
        // x and y ride along beside the pair `d_sub_v1` works over, so the
        // picture draws the SAME two heaps the prose named. Deriving a split
        // from (total, seen) instead would have drawn a pan that added up
        // correctly and disagreed with the sentence beside it, which no gate
        // reads — the figure law is about the drawn values, not just the sum.
        params: { a: total, b: seen, x, y, units: noun },
        units: noun,
        hints: [
          'Which pan can you count all the way, and which one hides something?',
          'Total the pan you can see. Take off the part already showing on the other.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const noun = strOf(p, 'units');
    const x = numOf(p, 'x');
    const y = numOf(p, 'y');
    return barModel([pan('the left pan', [x, y])], {
      scaleMax: x + y,
      alt: `the left pan of a balance, holding ${heapWords([x, y], noun)} in two heaps`,
      asserts: assertsParam('a'),
    });
  },
);

// ---------------------------------------------------------------------------
// Judging a sentence — where the conventional reading gives the wrong answer
// ---------------------------------------------------------------------------

/**
 * `a + b = c + d`, true on half the draws and false on the other half — and the
 * FALSE ones are built as `a + b = (a+b) + e`, the recipe's own `3 + 4 = 7 + 2`.
 * That is deliberate: a child reading the equals sign as "the answer comes next"
 * sees the left total sitting exactly where they expect it and calls the
 * sentence true, so on those draws the conventional reading is not merely
 * unhelpful, it is wrong. The true draws never reuse `a` or `b` on the right, so
 * "the same numbers again" is not an available shortcut either.
 *
 * The third option is the misconception in its bluntest form — that an add is
 * not allowed after an equals sign — and it is wrong on EVERY draw, which is the
 * point: the child who picks it has told us what they think `=` does.
 */
const judgeBothSides = discrimination({
  variant: 'structural',
  cognitiveOp: 'judge-equation',
  draw: (r) => {
    const a = r.int(3, 9);
    const b = r.int(4, 9);
    const total = a + b;
    const pool: number[] = [];
    for (let v = 2; v <= total - 2; v++) if (v !== a && v !== b) pool.push(v);
    // Both branches draw the same amount from the stream, so the seed lands in
    // the same place whichever sentence is built (kit §E2.4).
    const split = r.pick(pool);
    const extra = r.int(1, 4);
    const balanced = r.chance(0.5);
    const left = balanced ? split : total;
    const right = balanced ? total - split : extra;
    const yes = 'true — the two sides come to the same amount';
    const no = 'false — the two sides come to different amounts';
    const banned = 'not allowed — an equals sign cannot have an add after it';
    return {
      prompt: `Look at this number sentence: ${a} + ${b} = ${left} + ${right}. Is it true, or false?`,
      correct: balanced ? yes : no,
      distractors: [
        balanced
          ? {
              text: no,
              errorTag: 'procedure-slip' as const,
              rationale: 'Totals one side and stops short on the other, so a level pair is read as uneven.',
            }
          : {
              text: yes,
              errorTag: 'concept-misconception' as const,
              rationale: 'Takes the number straight after the equals sign as the answer to the left, and lets whatever follows it drop off the end.',
            },
        {
          text: banned,
          errorTag: 'representation-misread' as const,
          rationale: 'Turns down the SHAPE of the sentence without ever weighing the two sides.',
        },
      ],
      hints: [
        'Does the equals sign order you to work something out, or promise something?',
        'Gather the whole left side into one amount, then the whole right side.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The recipe's discrimination: is `8 = 3 + 5` acceptable? It is — and this item
 * refuses to make that a free point, because half the draws write a total that
 * is genuinely wrong. So "it is fine" and "it is not" are BOTH live, the child
 * has to weigh the sides to choose, and the standing third option ("the adding
 * has to come first") is the operator view with nowhere to hide.
 */
const totalFirstAllowed = discrimination({
  variant: 'structural',
  cognitiveOp: 'equation-shape',
  draw: (r) => {
    const p = r.int(2, 9);
    const q = r.int(3, 9);
    const off = r.pick([1, 2, 3] as const);
    const ok = r.chance(0.5);
    const stated = ok ? p + q : p + q + off;
    const yes = 'it is true — one side is worth the same as the other';
    const no = 'it is false — one side is worth more than the other';
    const banned = 'it is written the wrong way round — the adding has to come first';
    return {
      prompt: `This number sentence has a single number on the left: ${stated} = ${p} + ${q}. Which one of these is right about it?`,
      correct: ok ? yes : no,
      distractors: [
        ok
          ? {
              text: no,
              errorTag: 'procedure-slip' as const,
              rationale: 'Mis-totals the adding side by one heap, so a matching pair looks mismatched.',
            }
          : {
              text: yes,
              errorTag: 'task-comprehension' as const,
              rationale: 'Waves the sentence through on its shape alone and never weighs what each side is worth.',
            },
        {
          text: banned,
          errorTag: 'concept-misconception' as const,
          rationale: 'Holds that the equals sign must be followed by the answer, so a single number in front of it looks illegal.',
        },
      ],
      hints: [
        'Is there a rule about which side a single number must sit on?',
        'Work out what each side is worth, and let those two amounts settle it.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Completing a sentence whose box is NOT at the end (metacognition carrier)
// ---------------------------------------------------------------------------

/**
 * `a + b = ▢ + c` — the sentence this whole week is built to survive. The box
 * sits where a child expects the answer, and the answer is not what goes in it.
 *
 * Served ONLY through the estimate-first wrapper (kit §E2.2): a generator used
 * both raw and wrapped ships two identical hint ladders, which spends two of the
 * three the dedup allows for nothing. The probe is the Level-B intro form — a
 * call the child can make before working anything out, about which of two
 * numbers is the larger.
 */
const completeTheSentence = situation({
  situationType: 'part-whole',
  cognitiveOp: 'complete-equation',
  draw: (r) => {
    const a = r.int(3, 9);
    const c0 = r.int(2, 9);
    const b = r.int(2, 9);
    // The box must not land on the very number beside it. `6 + 6 = ▢ + 6` is
    // arithmetically fine and pedagogically dead — it can be answered by
    // copying, and it leaves the estimate-first probe ("more or less than the
    // number next to it?") with no answer at all. One deterministic step, never
    // a redraw loop; c ≥ 3 whenever 2c = a + b, since a + b ≥ 5 here.
    const c = 2 * c0 === a + b ? c0 - 1 : c0;
    const cap = Math.max(2, Math.min(c, a + b - 2));
    return {
      prompt: `Write the number that makes this sentence true: ${a} + ${b} = ▢ + ${cap}`,
      answerValue: String(a + b - cap),
      templateId: 'd_sub_v1',
      params: { a: a + b, b: cap },
      hints: [
        'Which side of this sentence can you already work out from end to end?',
        'Work out what the line must balance at, then see what the box still owes.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const predictBoxSize = withEstimateFirst(
  completeTheSentence,
  'will the box hold more or less than the number standing next to it?',
);

// ---------------------------------------------------------------------------
// Multi-step — totals on both sides, which is what a balance costs
// ---------------------------------------------------------------------------

/**
 * The tilted scale. Build the loaded pan, then measure what the light pan is
 * short of: two operations over one situation, and the only assessed page in the
 * week that draws BOTH pans — it can, because nothing on either pan is hidden,
 * the tilt in the drawing is the tilt in the prose, and the answer is the gap
 * between the bars rather than either of them.
 */
const msBalanceGap = withFigure(
  multiStep({
    situationType: 'comparison',
    cognitiveOp: 'multi-step',
    draw: (r) => {
      const a = r.int(4, 9);
      const b = r.int(3, 9);
      const total = a + b;
      // Same guard as `bagOnTheOtherSide`: the light pan never copies one of the
      // heaps on the heavy one, so the gap has to be worked out rather than
      // spotted. Pool size is total-3 ≥ 4 with two values removed.
      const pool: number[] = [];
      for (let v = 2; v <= total - 2; v++) if (v !== a && v !== b) pool.push(v);
      const c = r.pick(pool);
      const noun = r.pick(PAN_NOUNS);
      const name = one(r);
      return {
        prompt: `[image: a balance whose left pan holds ${heapWords([a, b], noun)} and whose right pan holds ${countNoun(c, noun)}, so the left pan hangs lower] ${name} drops ${countNoun(a, noun)} onto the left pan of a balance, then ${b} more. The right pan holds ${countNoun(c, noun)}, so it hangs higher. How many more ${unitFor(2, noun)} must go on the right pan to level the bar?`,
        initN: a,
        steps: [
          { op: 'add', n: b, d: 1 },
          { op: 'sub', n: c, d: 1 },
        ],
        units: noun,
        hints: [
          'Which pan is hanging lower, and what has to change before the bar sits level?',
          'Build the heavy pan into one amount, then see how far the other must climb.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'initN');
    const b = stepN(p, 0);
    const c = stepN(p, 1);
    return barModel([pan('the left pan', [a, b]), pan('the right pan', [c])], {
      scaleMax: a + b,
      alt: 'a balance drawn as two bars, the loaded left pan reaching well past the right one',
    });
  },
);

/**
 * Three heaps on one pan and a closed bag on the other: the same law under a
 * heavier load, and a three-link chain, so "total this side" is a real job
 * before the balance can say anything at all.
 *
 * The picture is the countable pan only. The bag stays out of it for the reason
 * `bagOnTheOtherSide` gives, and this page needs that discipline more, not less:
 * with the scale level, a drawn bag would sit at exactly the length the child is
 * being asked for.
 */
const msThreeOnTheLeft = withFigure(
  multiStep({
    situationType: 'combine',
    cognitiveOp: 'multi-step',
    draw: (r) => {
      const a = r.int(2, 7);
      const b = r.int(2, 7);
      const c = r.int(2, 7);
      const total = a + b + c;
      // The heap in the open on the right pan never copies one of the three, for
      // the reason given on `bagOnTheOtherSide`. The pool cannot run dry: the
      // range holds total-3 values and at most three distinct heaps come out of
      // it, and the tightest case (2, 2, 2) still leaves two.
      const pool: number[] = [];
      for (let v = 2; v <= total - 2; v++) if (v !== a && v !== b && v !== c) pool.push(v);
      const seen = r.pick(pool);
      const noun = r.pick(PAN_NOUNS);
      return {
        prompt: `[image: the left pan of a balance, holding ${heapWords([a, b, c], noun)} in three heaps] The left pan of a balance holds three heaps: ${heapWords([a, b, c], noun)}. The right pan holds ${countNoun(seen, noun)} and one closed bag. The bar sits level. How many ${unitFor(2, noun)} are inside the bag?`,
        initN: a,
        steps: [
          { op: 'add', n: b, d: 1 },
          { op: 'add', n: c, d: 1 },
          { op: 'sub', n: seen, d: 1 },
        ],
        units: noun,
        hints: [
          'How much sits on the pan you can count from end to end?',
          'Roll the three heaps into one amount. Then take off the part you can see.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  (p) =>
    barModel([pan('the left pan', [numOf(p, 'initN'), stepN(p, 0), stepN(p, 1)])], {
      scaleMax: numOf(p, 'initN') + stepN(p, 0) + stepN(p, 1),
      alt: 'the left pan of a balance, drawn as one bar cut into three heaps',
    }),
);

// ---------------------------------------------------------------------------
// Day 5 — the misread analysed, and the sort the recipe asks for
// ---------------------------------------------------------------------------

/**
 * The running-total slip, code-derived (see the file header for why this rather
 * than the judgment form). Over the pair (left total, c) the true box value is
 * the difference and the shown wrong value is the sum — one operand pair, two
 * genuine operations, so QG-11 re-derives both from the item's own params.
 *
 * The prompt shows the working and the claim and stops there. Naming the move
 * would leave nothing for the child to find, which is the whole item.
 */
const eaRunningTotal = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const x = r.int(3, 9);
    const y = r.int(2, 9);
    const c = r.int(2, x + y - 2);
    // a and b are the pair the verify template works over; x and y ride along so
    // the prose can name the sentence the pair came from.
    return { a: x + y, b: c, op: '-', wrongOp: '+', x, y };
  },
  build: (v, params, r) => {
    const x = numOf(params, 'x');
    const y = numOf(params, 'y');
    const c = numOf(params, 'b');
    const name = one(r);
    return {
      // The quote closes BEFORE the period ("…makes 12".) so the sentence
      // splitter sees the ender: with `."` the period hides inside the quote
      // and the extension's first question welds onto this sentence (22 words).
      prompt: `${name} had to fill the box in this sentence: ${x} + ${y} = ▢ + ${c}. Into the box went ${v.wrong}. ${name} read it out as "${x} and ${y} makes ${x + y}, and ${c} more makes ${v.wrong}".`,
      extension: `Is the sentence true now? Say what the equals sign promises about the two sides. Then write the number that keeps that promise.`,
      hints: [
        'What does an equals sign promise about the two sides of a line?',
        'Weigh the left side alone, then weigh the right side as it now stands.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: [
        'both sides must come to the same amount',
        'the equals sign means the same as, not the answer comes next',
      ],
    };
  },
});

/**
 * The Day-5 sort, in the form that keeps every option code-built: three
 * sentences, one true. The two false ones are the week's two misconceptions
 * doing what they really do — the left total written straight after the equals
 * sign with the line running on, and a second side that misses by a whisker.
 */
const pickTrueSentence = discrimination({
  variant: 'structural',
  cognitiveOp: 'sort-true-false',
  draw: (r) => {
    const a = r.int(3, 9);
    const b = r.int(4, 9);
    const total = a + b;
    const pool: number[] = [];
    for (let v = 2; v <= total - 2; v++) if (v !== a && v !== b) pool.push(v);
    const split = r.pick(pool);
    const off = r.int(1, 3);
    return {
      prompt: 'Sort these three number sentences. Exactly one of them is true — which one?',
      correct: `${a} + ${b} = ${split} + ${total - split}`,
      distractors: [
        {
          text: `${a} + ${b} = ${total} + ${off}`,
          errorTag: 'concept-misconception',
          rationale: 'Writes the left-hand total straight after the equals sign and then keeps adding along the same line.',
        },
        {
          text: `${a} + ${b} = ${split} + ${total - split + off}`,
          errorTag: 'procedure-slip',
          rationale: 'Splits the second side by a slip, so its two parts overshoot the amount the line has to balance at.',
        },
      ],
      hints: [
        'Which of these three lines could sit level on a balance?',
        'Weigh each side of every line, and keep the line whose two amounts match.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB06 = makeWeekBuilder({
  level: 'B',
  week: 6,
  conceptId: 'balanced-equal-sign',
  conceptName: 'The balanced equal sign',
  strandTags: ['addition-subtraction', 'algebra-geometry'],
  prerequisiteWeeks: [B1, B2, B4, B5],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the balance scale',
  conceptFamily: 'operation',
  deepeningDelta:
    'B4 and B5 taught the child to make a total; this week says what a total may then be written next to. The arithmetic is deliberately small — every sum stays inside twenty, where B5 left it — because the new load is the SHAPE of the sentence: an add on both sides, a total written first, a box that is not at the end. Nothing here asks for a harder calculation than the week before it, and every page asks a harder question about the equals sign.',
  explanation: {
    hook:
      'Two pans hang from one bar. Load one side and the bar tips, load both sides evenly and it sits flat. The equals sign is that bar, and it has been telling you so all along.',
    whyBeforeHow:
      'An equals sign is not a door that the answer walks through. It is the balance scale, because it makes one promise and only one. What sits on this side is worth the same as what sits on that side. So a sentence is allowed an add on BOTH sides. Put three and four on the left, and five and two on the right. The bar sits flat, so the sentence is true. It is also allowed a single number first and the adding after it. The promise never said which side had to be short. A box in the middle of a line is not asking for the answer. It is not asking what the part in front of it comes to. It is asking what that side still needs before the bar will sit flat. Read the sign as "is worth the same as". Then every number sentence turns into a scale you can check for yourself.',
    script: [
      {
        say: 'Watch me load this scale. Three corks on the left, and four corks beside them. Seven corks in one heap on the right. The bar sits flat. Both sides are worth the same, so the sentence underneath it is a true one.',
        visual: 'A balance: three corks and four corks on the left pan, seven corks on the right pan, the bar level.',
        figure: barModel([pan('the left pan', [3, 4]), pan('the right pan', [7])], {
          scaleMax: 7,
          alt: 'a balance with two heaps on the left pan and one heap on the right, the bar sitting level',
        }),
      },
      {
        say: 'Now watch me read the equals sign as "the answer comes next". I write three and four, then seven. My pencil keeps going. It puts two more on that same side. The left pan still holds seven. The right pan now holds nine. The bar tips. My line is not true any more. Nothing about it looked wrong while I was writing it.',
        visual: 'The same balance after two more corks land on the right pan: the right side hangs lower.',
        figure: barModel([pan('the left pan', [7]), pan('the right pan', [7, 2])], {
          scaleMax: 9,
          alt: 'a balance whose right pan now reaches further than the left, so the bar tips towards it',
        }),
      },
      {
        say: 'So before I decide anything, I check the two sides against each other. If one side has plainly more on it, the line cannot be true. I know that without working out the exact amounts.',
        visual: 'Two pans side by side, one plainly fuller than the other — no amounts written on either.',
        // Unlabelled deliberately: the say's whole point is knowing WITHOUT the
        // exact amounts, so the pans carry no numbers (pan() would print them).
        figure: barModel(
          [
            { label: 'one pan', segments: [{ value: 9 }] },
            { label: 'the other pan', segments: [{ value: 4 }] },
          ],
          { alt: 'two pans drawn to one scale, one plainly fuller than the other, with no amounts written' },
        ),
      },
      {
        say: 'One more, and this one surprises people. Eight on the left, all by itself. Five and three on the right. The bar sits flat, so this line is true as well. The single number may go first. The adding may follow the sign.',
        visual: 'A balance with one heap of eight on the left pan and heaps of five and three on the right, the bar level.',
        figure: barModel([pan('the left pan', [8]), pan('the right pan', [5, 3])], {
          scaleMax: 8,
          alt: 'a balance with one heap on the left pan and two heaps on the right, the bar sitting level',
        }),
      },
    ],
    summary:
      'The equals sign means "is worth the same as". Gather everything on the left, then gather everything on the right. Compare the two amounts: match means true, and no match means false. Both sides are allowed an add. The single number is allowed to come first. A box is asking what its own side still needs. It never asks what the other side comes to.',
    vocabulary: [
      { term: 'equals sign (=)', kidGloss: 'the two sides of the line are worth the same amount' },
      { term: 'balance', kidGloss: 'the bar sits flat, because neither pan is carrying more than the other' },
      { term: 'number sentence', kidGloss: 'a line of numbers with an equals sign somewhere in it' },
      { term: 'true sentence', kidGloss: 'a number sentence whose two sides really do come to the same amount' },
    ],
  },
  guidedExamples: [
    {
      ...ge(6, 1, 'modeled', 'Is this number sentence true? 5 + 2 = 4 + 3', [
        {
          teacherSay:
            'Watch me. I am not writing an answer. Nothing here is asking me for one. I look at the left side first. Five and two gather to seven. I hold that seven in my head. Now I turn to the far side.',
        },
        {
          teacherSay: 'Four and three are sitting over there. What does that side gather up to, and will my bar sit flat?',
          expected: '7',
        },
      ], 'true'),
      visual: 'A balance with heaps of five and two on the left pan and heaps of four and three on the right, the bar level.',
      figure: barModel([pan('the left pan', [5, 2]), pan('the right pan', [4, 3])], {
        scaleMax: 7,
        alt: 'a balance with two heaps on each pan, the bar sitting level',
      }),
    },
    {
      ...ge(6, 2, 'completion', 'Fill the box so this sentence is true: 6 + 3 = ▢ + 4', [
        {
          teacherSay: 'The left side gathers up to nine. The whole line balances at nine. There are already four on the other pan. What must the box bring to lift it to nine?',
          expected: '5',
        },
        { childDo: 'Say what each pan is worth once the box is filled. Check the two amounts.', expected: '5' },
      ], '5'),
      visual: 'A balance: heaps of six and three on the left pan, a heap of four and one unmarked box on the right.',
      figure: barModel([pan('the left pan', [6, 3]), { label: 'the right pan', segments: [{ value: 4, label: '4' }, { value: 5, label: '?', fill: 'none' }] }], {
        scaleMax: 9,
        alt: 'a balance with two heaps on the left pan, and on the right a heap of four beside an unmarked box',
      }),
    },
    {
      ...ge(6, 3, 'prompted', 'A balance is level. Its left pan holds 8 walnuts. Its right pan holds 5 walnuts and one closed bag. How many walnuts are inside the bag?', [
        { childDo: 'Match the two pans. Name what the right pan is still short of.', expected: '3' },
      ], '3'),
      visual: 'A balance: eight walnuts on the left pan, five walnuts and a closed bag on the right, the bar level.',
      figure: barModel([pan('the left pan', [8]), { label: 'the right pan', segments: [{ value: 5, label: '5' }, { value: 3, label: '?', fill: 'none' }] }], {
        scaleMax: 8,
        alt: 'a balance with one heap on the left pan, and on the right a heap of five beside an unmarked bag',
      }),
    },
    {
      // Independent: no picture at all. The child has met the scale three times
      // and now has to carry it in their head, which is the transfer this week
      // is for — the symbols are what they will meet on the page next year.
      ...ge(6, 4, 'independent', 'Write the number that makes this sentence true: 4 + 7 = ▢ + 5. Say how you checked. Solve cold.', [
        { childDo: 'Gather one side, then work out what the box owes on the other.', expected: '6' },
      ], '6'),
    },
  ],
  days: [
    // Day 1 — concept echo: load a pan and match it, then meet the same scale
    // with the hidden amount on the OTHER side, then a line with an add on both
    // sides. Single-step only, and the unknown already moves.
    [
      { gen: wFrogHops, diff: 2 },
      { gen: wBundledSticks, diff: 2 },
      { gen: buildTheOtherSide, diff: 2 },
      { gen: matchTheHeap, diff: 2 },
      { gen: judgeBothSides, diff: 3 },
    ],
    // Day 2 — fluency and application: the prediction, the total-written-first
    // trap, and the closed bag.
    [
      { gen: wHouseBetween, diff: 2 },
      { gen: wFillTheFrame, diff: 2 },
      { gen: predictBoxSize, diff: 3 },
      { gen: totalFirstAllowed, diff: 3 },
      { gen: bagOnTheOtherSide, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations against the week's first two-step
    // and the box that is not at the end, so the page shape signals nothing.
    [
      { gen: wFrogHops, diff: 3 },
      { gen: judgeBothSides, diff: 4 },
      { gen: totalFirstAllowed, diff: 4 },
      { gen: msBalanceGap, diff: 4 },
      { gen: predictBoxSize, diff: 4 },
    ],
    // Day 4 — word problems: both two-steps beside the single-step balances they
    // are built out of.
    [
      { gen: msBalanceGap, diff: 4 },
      { gen: msThreeOnTheLeft, diff: 4 },
      { gen: bagOnTheOtherSide, diff: 4 },
      { gen: matchTheHeap, diff: 3 },
    ],
    // Day 5 — the signature: the misread taken apart, the true/false sort, and
    // the claim that settles what the number after the equals sign really is.
    [
      { gen: wBundledSticks, diff: 2 },
      { gen: eaRunningTotal, diff: 4 },
      { gen: pickTrueSentence, diff: 3 },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? The number just after the equals sign is the answer to the part before it. Write one sentence saying how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Reads the equals sign as an order to write the answer next, which only ever fits the lines that stop there.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Throws out the familiar short line, where the next number really is the total — that line is true as well.',
            },
          ],
          hints: [
            'Can you think of a true line where the answer does not come next?',
            'Write a line of each kind, then pick the word that covers both.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: if your child says a line like 3 + 4 = 7 + 2 is fine, do not correct the arithmetic — it is not the arithmetic. Ask what each side is worth, one side at a time, and let the two answers sit next to each other. Children read the equals sign as "now write the answer" because every sum they have ever met put the answer there; a kitchen scale, or a coat hanger with pegs on both ends, undoes it faster than a page of practice.',
  ],
  puzzle: (r) => {
    // Cards {p-1, p, p+2, p+4} against a target of 2p+2. Exactly one pair reaches
    // it: p + (p+2). Every other pair is checked off in the header of this file's
    // sibling comment — (p-1)+p, (p-1)+(p+2), (p-1)+(p+4), p+(p+4), (p+2)+(p+4)
    // come to 2p-1, 2p+1, 2p+3, 2p+4 and 2p+6, and none of those is 2p+2. So the
    // puzzle has one answer by construction, not by a redraw loop.
    const p = r.int(3, 9);
    const target = 2 * p + 2;
    const noun = r.pick(PAN_NOUNS);
    const name = one(r);
    const cards = r.shuffle([p - 1, p, p + 2, p + 4]);
    return {
      id: 'B6-PZ-01',
      title: 'Puzzle Grove: The Two Cards That Balance',
      puzzleType: 'logic',
      prompt: `[image: a balance with ${countNoun(target, noun)} heaped on its left pan and its right pan bare, and four number cards laid out beside it] ${name} has loaded ${countNoun(target, noun)} onto the left pan of a balance. The right pan is bare. Four cards are laid out: ${cards.join(', ')}. Each card says how many ${unitFor(2, noun)} to drop onto the right pan. Choose the TWO cards that make the bar sit level. Say how you knew the other cards could not work.`,
      figure: barModel([pan('the left pan', [target])], {
        scaleMax: target,
        alt: `the left pan of a balance, loaded with ${countNoun(target, noun)}`,
      }),
      answer: {
        value: `${p} and ${p + 2}`,
        acceptableForms: [`${p + 2} and ${p}`, `${p}, ${p + 2}`, `${p + 2}, ${p}`],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'What does the bare pan have to come to before the bar will sit level?',
        'Take the cards two at a time, and keep the pair that reaches it exactly.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // Searching a set of cards for the pair that reaches a target is a move no
  // page this week makes: every core item is handed its numbers and asked to
  // weigh them, while the puzzle has to FIND its numbers first and then argue
  // that no other pair could have done it.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'balance-pair-search' },
  sprint: {
    skill: 'Adding within ten — the totalling every side of a sentence runs on',
    sourceWeek: B4,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_10_facts_v1',
    params: { maxSum: 10, allowZero: false },
  },
  mastery: [
    { gen: matchTheHeap, diff: 3 },
    { gen: msBalanceGap, diff: 4 },
    { gen: bagOnTheOtherSide, diff: 3 },
    { gen: msThreeOnTheLeft, diff: 4 },
    { gen: judgeBothSides, diff: 3 },
    { gen: totalFirstAllowed, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: the two single-step balances, deliberately one of each handedness — the hidden bag on the near pan, then the hidden bag on the far one. 02/04: the two chains — close the gap on a tilted scale, and total three heaps before the bag can be named. 05/06: the two judgments — a line with an add on both sides, and a line with its single number written first, each drawn true on half the seeds and false on the other half, so a form cannot be passed by guessing one verdict twice. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'equals-announces-the-answer',
      description: 'Reads the equals sign as an instruction to write the answer next, so the number after it is taken for the total of the part in front and whatever follows is never weighed.',
      exampleWrongAnswer: 'the line 3 + 4 = 7 + 2 accepted as true',
      distractorRationale: 'Offer the verdict "true" on a line whose right-hand side opens with the left-hand total, and the option that says an add may not follow an equals sign.',
      reteachPointer: 'explanation/script[1] (the pencil that kept going, and the bar that tipped)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'shape-not-amount',
      description: 'Judges a number sentence by the way it is laid out rather than by what its two sides are worth, so a total written first, or an add on both sides, is turned down unread.',
      exampleWrongAnswer: 'the line 8 = 3 + 5 turned down as written the wrong way round',
      distractorRationale: 'Offer a verdict about the sentence\'s SHAPE ("the adding has to come first", "an equals sign cannot have an add after it") beside the two honest verdicts.',
      reteachPointer: 'explanation/script[3] (the single number on the left, and the bar still flat)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-nearer-question',
      description: 'Gives the total of one side where the question asked what the other side still owes, so a balance problem is answered with a sum.',
      exampleWrongAnswer: 'a "how many are in the bag?" question answered with the whole of the left pan',
      distractorRationale: 'Offer the total of the countable pan where the question asked for the hidden part of the other one.',
      reteachPointer: 'guidedExamples/B6-GE-03 (name what the right pan is still short of, not what the left pan holds)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'one-heap-adrift',
      description: 'Chooses the right move and loses a heap on the way, landing a little above or below the amount the line has to balance at.',
      exampleWrongAnswer: 'a side worth 11 totalled as 10, so a true line is called false',
      distractorRationale: 'Offer the verdict that follows from a side totalled one or two adrift, and a second side whose parts overshoot by the same small amount.',
      reteachPointer: 'guidedExamples/B6-GE-01 (gather one side and hold it before turning to the other), then the 2-minute adding-within-ten sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'What the equals sign actually means — that the two sides of a number sentence are worth the same, not that the answer comes next. We weighed both sides of lines like 3 + 4 = 5 + 2, filled boxes that were not at the end of the line, wrote the total first, and used a balance scale to price what was hidden inside a closed bag.',
    improvingCandidates: [
      'weighing both sides of a line before saying whether it is true',
      'filling a box that sits in the middle of a sentence rather than at the end',
      'accepting a number sentence with its single number written first',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reading the equals sign as "is worth the same as" — a line can carry an add on both sides and still be perfectly true',
      },
      {
        errorTag: 'representation-misread',
        text: 'judging a number sentence by what its sides are worth rather than by the order the numbers happen to be written in',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was asked — what a pan is short of is not the same as what the other pan holds',
      },
    ],
    homeFocus: {
      praiseLine:
        'You totalled each side on its own and compared the two amounts before you decided — that is exactly the habit the equals sign asks for.',
      questionForChild: 'Is this line true: six and two on one side, five and three on the other? How did you check, and which side did you weigh first?',
      schoolSyncHook: 'If your child\'s class writes the answer box at the end of every sum, tell us — we will keep the balance-scale pages coming until the two habits meet.',
    },
    vocabularyForParent: [
      'equals sign (it means "is worth the same as", never "the answer comes next")',
      'balance (both sides of the line come to the same amount, so the bar sits flat)',
      'true number sentence (one whose two sides really do match)',
    ],
  },
});
