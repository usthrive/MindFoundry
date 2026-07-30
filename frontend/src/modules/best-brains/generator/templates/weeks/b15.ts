/**
 * Level B · Week 15 — "Compare & change stories" (conceptId: compare-and-change-stories).
 *
 * FILL-ARCHITECTURE §4 row B15: anchor "comparison bars"; multi-step "2-step by
 * construction"; error-analysis "subtracts when 'more' appears in comparison";
 * discrimination "'more' as add vs 'how many more' as subtract"; Day-5 signature
 * "write both questions for one picture".
 *
 * One of B's four on-thread algebra weeks (B6, B7, B8, B15) and the one that is
 * least about arithmetic. Every number on these pages is small on purpose: the
 * sums stay where B5 and B9 left them, and the whole difficulty is what the
 * sentence is asking for. That is not a softening of the week, it IS the week —
 * a comprehension week wearing arithmetic clothes.
 *
 * THE ONE IDEA. Two words, "more than", do two different jobs:
 *   - "Ria has 5 more magnets than Leo" HANDS you the gap and asks for the whole
 *     longer bar. Add.
 *   - "How many more magnets does Ria have than Leo?" hands you both bars and
 *     asks for the gap. Subtract.
 * A child who matches on the word instead of reading the question gets one of
 * them right by luck and the other wrong every single time, so the content is
 * built so that luck cannot carry them:
 *   - `chooseTheMove` draws the two prose forms on a coin flip and offers the
 *     SAME three numbers either way (a+b, a−b, a). The correct option moves with
 *     the question, so a child holding "more means add" — or "more means take
 *     away" — is wrong on half the draws by construction;
 *   - `whichQuestionTheGapAnswers` fixes the picture and moves the question the
 *     other way round: here are two bars, which question does the GAP answer?
 *   - `mixedAsk` (the metacognition carrier) asks for the size of the answer
 *     BEFORE any working: bigger or smaller than the height the story opens
 *     with? On the "taller than" draws it is bigger and on the "how much taller"
 *     draws it is smaller, so the probe is a real call and not a formality;
 *   - both multi-step chains put a "more" that ADDS and a "more" that SUBTRACTS
 *     inside one story;
 *   - the Day-5 error-analysis is the recipe's child, and its draw is deliberately
 *     tight (the gap is within six of the first count) so that the keyword answer
 *     lands somewhere a six-year-old can SEE is impossible: the child who is said
 *     to have more ends up with two-to-six against the other child's fourteen-to-
 *     twenty. Nothing about the arithmetic is wrong — 18 − 15 really is 3 — which
 *     is exactly why re-checking the digits cannot rescue it.
 *
 * NO VERIFY-LIBRARY LIMIT HERE, which is worth recording because three of the
 * first five Level-C weeks hit one (kit §E2.3). The recipe's misconception is an
 * operation swap over one fixed operand pair — the true move is `+`, the shown
 * move is `−` — so `d_verify_binop_misconception_v1` re-derives BOTH the true
 * count and the shown wrong count from the item's own operands. Nothing had to be
 * reframed and nothing was invented.
 *
 * CONCEPT FAMILY: 'operation', the full row. The week could not honestly claim
 * 'place-value' — its own recipe says the multi-step is there "by construction",
 * and it is: `msCompareThenChange` builds a comparison and then changes it, and
 * `msChangeThenCompare` changes one collection and then compares. Both are two
 * genuine moves that a child performs in that order, and `stepCount` is read off
 * the chain rather than claimed.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). `barModel` draws bars to one
 * shared scale with the space between them showing, so the comparison bar model
 * is not described on these pages — it is drawn. What each posture may show:
 *   - `howManyMore` and `whichQuestionTheGapAnswers` draw BOTH bars at their
 *     stated lengths, both labelled. The answer is the gap, and no length, label
 *     or brace names it — that is the one quantity the picture withholds.
 *   - `moreThanValue` draws the shorter bar labelled, and the longer bar as the
 *     matched part (unlabelled) plus the stated extra (labelled). Both numbers in
 *     the picture are numbers the story states outright; the longer bar's TOTAL,
 *     which is what the item asks for, is never written down.
 *   - the two chains draw the comparison the story OPENS with. On
 *     `msChangeThenCompare` the drawn gap is deliberately not the answer — the
 *     story moves one bar afterwards — so the picture cannot be measured instead
 *     of read, and a child who stops at the drawn gap has made a mistake the
 *     mistakeBank names.
 *   - `chooseTheMove` carries NO picture, on purpose. It is the one page whose
 *     whole job is reading the sentence, and a bar model beside it would let the
 *     child answer off the drawing without ever reading the question.
 *   - the finished comparison, with the answer written on it, appears only in the
 *     lesson script and the modeled guided example.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): prompt sentences ≤15
 * words; "comparison bars", "the gap", "how many more" and "more than" glossed in
 * `explanation.vocabulary` before any item leans on them; metacognition in its
 * intro form (a size prediction made before working); error-analysis written-lite,
 * one sentence; the sprint ungraded and self-referenced.
 *
 * Retrieval is backward-only into B7 (missing addends — a part hidden inside a
 * whole, which is what a gap is), B9 (story problems within 20 — where "more"
 * marks a CHANGE and really does add, which is half the evidence this week
 * weighs), B13 (addition within 100) and B14 (subtraction within 100).
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswerOf, assertsParam, barModel } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B7 = { level: 'B' as const, week: 7 };
const B9 = { level: 'B' as const, week: 9 };
const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so a comparison never compares someone with themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/**
 * Things two children can each own a pile of, and count.
 *
 * The pool was chosen by scanning every authored week for its nouns (kit §E2.8):
 * shells, stickers, marbles, beads, buttons, cards, stamps, badges, conkers,
 * acorns, bottle tops and pebbles are all claimed elsewhere, several many times
 * over, and a comparison week that borrowed them would read as a page lifted from
 * a sibling. Everything here is small, hard, of a size, and genuinely collected.
 *
 * RE-CHECKED AT THE END, per kit §E2.8, and it earned its keep: b13 and b17 did
 * not exist when this week was started, and by the time it was finished b13 had
 * claimed pom-poms, clothes pegs and lolly sticks for its art box and b17 had
 * planted sunflower seeds. All four were in use here and all four were re-dressed
 * — the sixth collection, the puzzle's noun and the plant frame.
 */
const COLLECTIONS = [
  'fridge magnets', 'foil stars', 'toy dinosaurs', 'wooden animals', 'hair clips', 'keyrings',
] as const;

/** Things that grow, for the one comparison this week measures rather than counts. */
const PLANTS = ['bean plant', 'tomato plant', 'pea plant'] as const;

// ---------------------------------------------------------------------------
// Decorators — a picture, or a pinned truth, built from the item's OWN values.
//
// The shipped primitives carry no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so the
// QG-1/QG-4 surface signature the guard already registered is unchanged).
//
// `withFigure` rebuilds from the drafted item's `generator.params` — the very
// numbers the answer was computed from, which is what makes a contradicting
// picture unbuildable rather than merely unlikely. `withPin` / `withPostedFigure`
// cover the two cases where the params are not enough: `discrimination()` emits
// no generator spec at all, and `multiStep()` emits only its op-chain, so the
// draw closure posts what it drew into a one-slot box which the decorator reads
// immediately afterwards. `drawUniqueItem` returns the draft its LAST build call
// produced, so the box always holds that same draw.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

interface Pin {
  params: Params;
  seed: number;
  figure?: BBFigure;
}

function pinSlot(): { last: Pin | null } {
  return { last: null };
}

/** The posted draw, or a loud failure — never a silently different picture. */
function posted(box: { last: Pin | null }, who: string): Pin {
  if (!box.last) throw new Error(`b15/${who}: the draw posted nothing to build from`);
  return box.last;
}

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/**
 * Give a choice item the generator spec that lets the gates read it.
 *
 * On `chooseTheMove` the pinned template is `d_verify_binop_v1`, which carries a
 * `verifyFor`: QG-11 therefore recomputes the operation the story really needs
 * from the item's own operands and PROVES the option keyed correct is the one it
 * produces. That is the whole reason this item can flip its question form on a
 * coin toss and still be trustworthy — no branch decides its own truth.
 */
function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = posted(box, 'withPin');
    return {
      ...d,
      generator: { templateId, params: pin.params, seed: pin.seed },
      ...(pin.figure ? { figure: pin.figure } : {}),
    };
  };
}

/** Figure only, from the posted draw — for `multiStep`, which keeps its own spec. */
function withPostedFigure(box: { last: Pin | null }, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = posted(box, 'withPostedFigure');
    return pin.figure ? { ...d, figure: pin.figure } : d;
  };
}

/** An authored item's authored picture — same numbers, stated in its own prompt. */
function withStaticFigure(base: ItemGen, figure: BBFigure): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), figure });
}

// ---------------------------------------------------------------------------
// The comparison bar model — the anchor, in its three honest postures
// ---------------------------------------------------------------------------

/** A collection the story states outright: one bar, its length written on it. */
const statedBar = (label: string, value: number): {
  label: string;
  segments: Array<{ value: number; label?: string; fill?: 'solid' | 'soft' | 'none' | 'hatch' }>;
} => ({ label, segments: [{ value, label: String(value) }] });

/**
 * The longer bar of a "more than" story: the part that matches the other bar,
 * then the extra the story hands over. The matched part carries no number — it is
 * read off the bar above it — and the total is never written, because the total
 * is what the item is asking for.
 */
const matchedPlusExtra = (label: string, matched: number, extra: number): {
  label: string;
  segments: Array<{ value: number; label?: string; fill?: 'solid' | 'soft' | 'none' | 'hatch' }>;
} => ({
  label,
  segments: [
    { value: matched, fill: 'soft' },
    { value: extra, label: String(extra), fill: 'hatch' },
  ],
});

/** Two stated collections side by side. The space at the end stays unnamed. */
function twoStatedBars(
  first: string,
  firstValue: number,
  second: string,
  secondValue: number,
  noun: string,
  asserts?: ReturnType<typeof assertsParam>,
): BBFigure {
  return barModel([statedBar(`${first}'s ${noun}`, firstValue), statedBar(`${second}'s ${noun}`, secondValue)], {
    scaleMax: Math.max(firstValue, secondValue),
    alt: `two bars to one scale, the top one ${firstValue} long and the bottom one ${secondValue} long`,
    ...(asserts ? { asserts } : {}),
  });
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B7 — a whole with one part named and the other hidden. It opens the week
 * because that is what a gap is: the part of a collection that the other child
 * has no match for. The child has met the shape before; only the picture changes.
 */
const wNotGold = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'missing-part',
    draw: (r) => {
      const total = r.int(12, 19);
      const shown = r.int(4, 9);
      return {
        prompt: `A box holds ${countNoun(total, 'party hats')}. ${shown} of them are gold. How many party hats are not gold?`,
        answerValue: String(total - shown),
        templateId: 'a_partner_box_v1',
        params: { total, shown },
        units: 'party hats',
        hints: [
          'How many party hats are in the box altogether?',
          'Hold the gold ones back, then count the hats still left in the box.',
        ],
        errorTags: ['task-comprehension', 'fact-recall'],
      };
    },
  }),
  B7,
);

/** B14 — subtraction within a hundred, the arithmetic every gap runs on. */
const wEmptyHooks = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'sub',
    draw: (r) => {
      const hooks = r.int(42, 78);
      const used = r.int(15, hooks - 12);
      return {
        prompt: `The cloakroom has ${countNoun(hooks, 'coat hooks')}. ${used} of them hold a coat. How many coat hooks are empty?`,
        answerValue: String(hooks - used),
        templateId: 'retr_sub_within_100_v1',
        params: { a: hooks, b: used },
        units: 'coat hooks',
        hints: [
          'Does the question ask about the hooks in use, or the ones going spare?',
          'Start from all the hooks and take off the ones already holding a coat.',
        ],
        errorTags: ['procedure-slip', 'task-comprehension'],
      };
    },
  }),
  B14,
);

/** B13 — addition within a hundred, the other line. */
const wJamJars = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add',
    draw: (r) => {
      const onTable = r.int(24, 58);
      const carried = r.int(13, 29);
      return {
        prompt: `A jumble sale table holds ${countNoun(onTable, 'jam jars')}. Another ${countNoun(carried, 'jam jars')} arrive. How many jam jars are on the table?`,
        answerValue: String(onTable + carried),
        templateId: 'retr_add_within_100_v1',
        params: { a: onTable, b: carried },
        units: 'jam jars',
        hints: [
          'Do the jars that arrive join the table, or leave it?',
          'Add the tens of the new jars first, then let the ones follow.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B13,
);

/**
 * B9 — a plain CHANGE story, and it is here doing real work rather than warming
 * fingers. Its "more" is an instruction: cupcakes really do arrive, and the count
 * really does grow. Half of what this week asks a child to weigh is that stories
 * like this one exist, so the word cannot be trusted on its own.
 */
const wCupcakeStall = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'change-add',
    draw: (r) => {
      const out = r.int(7, 14);
      const added = r.int(3, 6);
      const name = one(r);
      return {
        prompt: `${name} put ${countNoun(out, 'cupcakes')} on the stall. Then ${name} added ${countNoun(added, 'more cupcakes')}. How many cupcakes are on the stall?`,
        answerValue: String(out + added),
        templateId: 'd_add_v1',
        params: { a: out, b: added },
        units: 'cupcakes',
        hints: [
          'Does the stall end up with fewer cupcakes, or with more?',
          'Count on from the first tray, one cupcake for each new one.',
        ],
        errorTags: ['task-comprehension', 'fact-recall'],
      };
    },
  }),
  B9,
);

// ---------------------------------------------------------------------------
// The two questions, one on each page — the concept echo
// ---------------------------------------------------------------------------

/**
 * "…has 5 more than…" — the ADD. The story hands over the gap and asks for the
 * whole longer bar, so the picture draws exactly what was handed over: the
 * shorter bar with its length on it, and the longer bar as that same length again
 * plus the stated extra. The longer bar's total is the answer and no number
 * anywhere names it.
 *
 * `who` / `other` / `units` ride along in the params so the picture can label
 * what it draws with the names the prose used. `d_add_v1` reads a and b only, so
 * the extra keys are inert to QG-5 and load-bearing for the figure.
 */
const moreThanValue = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare-add',
    draw: (r) => {
      const a = r.int(11, 19);
      const b = r.int(4, 9);
      const [first, second] = two(r);
      const noun = r.pick(COLLECTIONS);
      return {
        prompt: `[image: two bars to one scale, the top one ${a} long and the lower one copying it before running ${b} further] ${first} has ${countNoun(a, noun)}. ${second} has ${countNoun(b, `more ${noun}`)} than ${first}. How many ${unitFor(2, noun)} does ${second} have?`,
        answerValue: String(a + b),
        templateId: 'd_add_v1',
        params: { a, b, units: noun, who: second, other: first },
        units: noun,
        hints: [
          'Which of these two children ends up with the bigger pile?',
          'Copy the first pile. Lay the extra ones on the end and count the lot.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => {
    const a = numOf(p, 'a');
    const b = numOf(p, 'b');
    const noun = strOf(p, 'units');
    return barModel(
      [statedBar(`${strOf(p, 'other')}'s ${noun}`, a), matchedPlusExtra(`${strOf(p, 'who')}'s ${noun}`, a, b)],
      {
        scaleMax: a + b,
        alt: `two bars to one scale: the top one ${a} long, and the lower one copying it before running ${b} further`,
        asserts: assertsParam('a', 'bar:0'),
      },
    );
  },
);

/**
 * "How many more…?" — the SUBTRACT. Same two words, same picture family, and the
 * question now points at the space rather than at either bar.
 *
 * This is the one assessed page that draws both bars at their full stated lengths
 * and it can: nothing is hidden, both numbers are in the prose, and the answer is
 * the gap between the two bars, which no length, label or brace hands over at
 * this band. Measuring it with a finger is not cheating — it is the anchor.
 */
const howManyMore = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare-gap',
    draw: (r) => {
      const big = r.int(14, 24);
      const small = r.int(5, big - 4);
      const [first, second] = two(r);
      const noun = r.pick(COLLECTIONS);
      return {
        prompt: `[image: two bars to one scale, the top one ${big} long and the bottom one ${small} long] ${first} has ${countNoun(big, noun)}. ${second} has ${countNoun(small, noun)}. How many more ${unitFor(2, noun)} does ${first} have than ${second}?`,
        answerValue: String(big - small),
        templateId: 'd_sub_v1',
        params: { a: big, b: small, units: noun, who: first, other: second },
        units: noun,
        hints: [
          'Is this question about a whole pile, or about the space between two piles?',
          'Line both piles up at one end, then count what sticks out past the shorter.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) =>
    twoStatedBars(
      strOf(p, 'who'),
      numOf(p, 'a'),
      strOf(p, 'other'),
      numOf(p, 'b'),
      strOf(p, 'units'),
      assertsParam('a', 'bar:0'),
    ),
);

// ---------------------------------------------------------------------------
// Discrimination — the same two words, and the answer that moves
// ---------------------------------------------------------------------------

/**
 * THE WEEK, on one page. A coin toss decides which of the two questions the story
 * asks, and the three options are the same three numbers either way: the two
 * counts joined, the space between them, and the count the story opened with. So
 * the correct option MOVES with the question, and neither "more means add" nor
 * "more means take away" survives more than half the draws.
 *
 * The third option is worth its place. On the gap draws it is the longer pile read
 * whole — the child who finds the bigger number and stops. On the "more than"
 * draws it is the first pile copied across, so the extra ones the story just
 * handed over are never counted.
 *
 * On the "more than" draws the take-away option is not merely wrong, it is
 * IMPOSSIBLE: the child said to have more ends up below the count they are meant
 * to beat. The rationale says so, because that is the check the week is teaching.
 *
 * NO PICTURE, on purpose. Every other page here shows the bars; this one is the
 * page where the sentence has to be read, and a bar model beside it would answer
 * the question before the child got to the words.
 */
const chooseTheMoveBox = pinSlot();
const chooseTheMove = withPin(
  chooseTheMoveBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'cross-op',
    cognitiveOp: 'choose-operation',
    draw: (r) => {
      const a = r.int(12, 20);
      const b = r.int(5, 9);
      const [first, second] = two(r);
      const noun = r.pick(COLLECTIONS);
      // Both branches draw the same amount from the stream, so the seed lands in
      // the same place whichever story is built (kit §E2.4).
      const asksGap = r.chance(0.5);
      const op = asksGap ? '-' : '+';
      chooseTheMoveBox.last = { params: { a, b, op }, seed: r.uint() };
      const joined = String(a + b);
      const space = String(a - b);
      const opening = String(a);
      // The framing line is FIXED across both branches, so it tells the child
      // what kind of page this is without hinting which move it wants — and it
      // keeps this page from reading as a re-run of `howManyMore`, whose sentence
      // the gap branch would otherwise share. "…than <the other child>" is spelt
      // out rather than left elliptical: a week about reading the question to the
      // end cannot itself ask "how many more does she have?" and trail off.
      const prompt = asksGap
        ? `Read this story, then pick the number that answers its question. ${first} has ${countNoun(a, noun)}. ${second} has ${countNoun(b, noun)}. How many more ${unitFor(2, noun)} does ${first} have than ${second}?`
        : `Read this story, then pick the number that answers its question. ${first} has ${countNoun(a, noun)}. ${second} has ${countNoun(b, `more ${noun}`)} than ${first}. How many ${unitFor(2, noun)} does ${second} have?`;
      return {
        prompt,
        correct: asksGap ? space : joined,
        distractors: asksGap
          ? [
              {
                text: joined,
                errorTag: 'concept-misconception' as const,
                rationale: 'Pushes the two piles together, when the question asked only for the space between them.',
              },
              {
                text: opening,
                errorTag: 'representation-misread' as const,
                rationale: 'Reports the longer pile whole, rather than the part of it that reaches past the shorter one.',
              },
            ]
          : [
              {
                text: space,
                errorTag: 'concept-misconception' as const,
                rationale: 'Reads the word more as an order to take away, and lands below the count this child is said to beat.',
              },
              {
                text: opening,
                errorTag: 'task-comprehension' as const,
                rationale: 'Copies the first pile across, so the extra ones the story hands over are never counted.',
              },
            ],
        hints: [
          'Which pile does the last sentence of this story ask you to name?',
          'Read that sentence again, and decide whether it wants a whole pile or a space.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
);

/**
 * The same discrimination turned around: the picture is fixed and the QUESTION
 * moves. Two bars, both lengths stated, and the child has to say which of three
 * questions the space at the end answers.
 *
 * The wrong options are the two real readings of a comparison picture: the bars
 * joined end to end, and the longer bar taken whole. Neither is a silly answer —
 * both are questions this very picture can answer — which is why choosing between
 * them is reading rather than guessing.
 *
 * Pinned to `d_sub_v1` so the picture's assertion has params to be checked
 * against. It carries no `verifyFor`, so QG-11 never goes hunting for a worked
 * claim on an item that makes none, and its `answerFor` is never consulted either
 * (the arithmetic audit skips choice-key items) — while QG-13 still proves the
 * top bar is drawn at the length the item drew.
 */
const gapQuestionBox = pinSlot();
const whichQuestionTheGapAnswers = withPin(
  gapQuestionBox,
  'd_sub_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'read-the-question',
    draw: (r) => {
      const big = r.int(13, 22);
      const small = r.int(6, big - 4);
      const [first, second] = two(r);
      const noun = r.pick(COLLECTIONS);
      gapQuestionBox.last = {
        params: { a: big, b: small },
        seed: r.uint(),
        figure: twoStatedBars(first, big, second, small, noun, assertsParam('a', 'bar:0')),
      };
      return {
        prompt: `[image: two bars to one scale, the top one ${big} long and the bottom one ${small} long] ${first} has ${countNoun(big, noun)}. ${second} has ${countNoun(small, noun)}. Which question does the space at the end of the top bar answer?`,
        correct: `How many more ${unitFor(2, noun)} does ${first} have than ${second}?`,
        distractors: [
          {
            text: `How many ${unitFor(2, noun)} do ${first} and ${second} have altogether?`,
            errorTag: 'concept-misconception',
            rationale: 'Joins the two bars end to end, but the space only measures where one bar reaches past the other.',
          },
          {
            text: `How many ${unitFor(2, noun)} does ${first} have?`,
            errorTag: 'representation-misread',
            rationale: 'Reads the whole length of the longer bar as though the space and the bar were the same thing.',
          },
        ],
        hints: [
          'Where do these two bars begin, and where does the shorter one stop?',
          'Put a finger on the space alone, then say what that piece of bar counts.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// Metacognition — the size of the answer, called before any working
// ---------------------------------------------------------------------------

/**
 * The Level-B intro form the fill spec names ("will it pass 10?"), in this week's
 * shape: before working anything out, will the answer be bigger or smaller than
 * the height the story opens with? On the "taller than" draws it is bigger and on
 * the "how much taller" draws it is smaller, so the call is genuinely in doubt and
 * a child who guesses one way is wrong about half the time.
 *
 * It measures rather than counts, which makes it the week's third situation
 * family and puts the two questions into a second vocabulary — "taller than" and
 * "how much taller" behave exactly as "more than" and "how many more" do, and a
 * child who has only ever met the word "more" has learnt a word, not an idea.
 *
 * Served ONLY through the wrapper (kit §E2.2): a generator used both raw and
 * wrapped ships two identical hint ladders, which spends two of the three the
 * dedup allows on one idea. No figure, for the obvious reason — two bars beside a
 * "bigger or smaller?" probe would answer it.
 */
const mixedAsk = situation({
  situationType: 'measurement',
  cognitiveOp: 'compare-either-way',
  draw: (r) => {
    const tall = r.int(14, 26);
    const taller = r.int(4, 9);
    const shorter = r.int(6, tall - 4);
    const [first, second] = two(r);
    const plant = r.pick(PLANTS);
    const asksHeight = r.chance(0.5);
    if (asksHeight) {
      return {
        prompt: `${first}'s ${plant} is ${countNoun(tall, 'cm')} tall. ${second}'s ${plant} is ${countNoun(taller, 'cm')} taller than ${first}'s. How tall is ${second}'s ${plant}?`,
        answerValue: String(tall + taller),
        templateId: 'd_add_v1',
        params: { a: tall, b: taller },
        units: 'cm',
        hints: [
          'Which of these two plants is the taller one?',
          'Say both heights, then decide if you want a whole height or just the space.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    }
    return {
      prompt: `${first}'s ${plant} is ${countNoun(tall, 'cm')} tall. ${second}'s ${plant} is ${countNoun(shorter, 'cm')} tall. How much taller is ${first}'s ${plant}?`,
      answerValue: String(tall - shorter),
      templateId: 'd_sub_v1',
      params: { a: tall, b: shorter },
      units: 'cm',
      hints: [
        'Which of these two plants is the taller one?',
        'Say both heights, then decide if you want a whole height or just the space.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const predictBiggerOrSmaller = withEstimateFirst(
  mixedAsk,
  'will the answer be bigger or smaller than the height the story opens with?',
);

// ---------------------------------------------------------------------------
// Multi-step — two steps by construction (FILL-ARCHITECTURE §4)
// ---------------------------------------------------------------------------

/**
 * COMPARE, then CHANGE. Build the second child's pile out of the first one, then
 * give some of it away: two operations that a child performs in that order, and
 * a chain whose length is read off the data rather than claimed.
 *
 * One story, two "more"s pulling opposite ways — the comparison adds, and the
 * giving-away takes off — which is what makes this the week's own two-step rather
 * than a bolted-on second sum.
 *
 * The picture draws the comparison the story OPENS with: the first pile stated,
 * and the second as that pile again plus the stated extra. The giving-away is not
 * drawn, so the answer is nowhere in the picture.
 */
const compareThenChangeBox = pinSlot();
const msCompareThenChange = withPostedFigure(
  compareThenChangeBox,
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'multi-step',
    draw: (r) => {
      const a = r.int(12, 20);
      const b = r.int(4, 9);
      const c0 = r.int(3, 9);
      // The amount given away must not equal the gap. It is arithmetically fine
      // and diagnostically dead: the second pile lands back on the first pile's
      // count, so a child who never read past the first sentence scores. Nudged
      // deterministically — a redraw loop would consume a variable number of rng
      // draws and break seed-stability for every later item (kit §E2.4) — and the
      // nudge stays inside the range because c0 ≥ 3 and b ≤ 9.
      const c = c0 === b ? c0 - 1 : c0;
      const [first, second] = two(r);
      const noun = r.pick(COLLECTIONS);
      compareThenChangeBox.last = {
        params: {},
        seed: 0,
        figure: barModel([statedBar(`${first}'s ${noun}`, a), matchedPlusExtra(`${second}'s ${noun}`, a, b)], {
          scaleMax: a + b,
          alt: `two bars to one scale at the start of the story: the top one ${a} long, and the lower one copying it before running ${b} further`,
          // The top bar is the chain's own opening value, so QG-13 re-derives it
          // from the figure and compares it with the item's `initN`.
          asserts: assertsParam('initN', 'bar:0'),
        }),
      };
      return {
        prompt: `[image: two bars to one scale at the start, the top one ${a} long and the lower one copying it before running ${b} further] ${first} has ${countNoun(a, noun)}. ${second} has ${countNoun(b, `more ${noun}`)} than ${first}. Then ${second} gives ${countNoun(c, noun)} away. How many ${unitFor(2, noun)} does ${second} have now?`,
        initN: a,
        steps: [
          { op: 'add', n: b, d: 1 },
          { op: 'sub', n: c, d: 1 },
        ],
        units: noun,
        hints: [
          'Whose pile does this story change, and does that pile grow or shrink?',
          'Build the second pile from the first one, then take off the ones that leave.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
);

/**
 * CHANGE, then COMPARE — and the hard way round, because the comparison lands
 * last. One pile grows, and only then does the question ask how far the other
 * still reaches past it. The "more" in the middle of this story adds to a pile
 * and therefore SUBTRACTS from the gap, which is the sharpest form of the week's
 * point that a story can carry.
 *
 * The chain opens on the first stated quantity, as it must, and 20 − 9 − 5 is the
 * same six a child reaches by settling the second pile first — the chain is an
 * order of evaluation, not a different sum.
 *
 * The picture draws the two piles as the story finds them. The space it shows is
 * deliberately NOT the answer: the second pile grows afterwards, so a child who
 * measures the drawn gap instead of reading to the end lands on a number the
 * mistakeBank names. The picture states the givens and nothing else.
 */
const changeThenCompareBox = pinSlot();
const msChangeThenCompare = withPostedFigure(
  changeThenCompareBox,
  multiStep({
    situationType: 'comparison',
    cognitiveOp: 'multi-step',
    draw: (r) => {
      const big = r.int(21, 30);
      const small = r.int(8, 14);
      // The win never wipes out the gap: big − small is at least 7, so the top of
      // this range always leaves two or more. Computed, so every draw is legal on
      // its first attempt — a redraw loop would consume a variable number of rng
      // draws and break seed-stability for every later item (kit §E2.4).
      const won = r.int(3, Math.min(8, big - small - 2));
      const [first, second] = two(r);
      const noun = r.pick(COLLECTIONS);
      changeThenCompareBox.last = {
        params: {},
        seed: 0,
        figure: twoStatedBars(first, big, second, small, noun, assertsParam('initN', 'bar:0')),
      };
      return {
        prompt: `[image: two bars to one scale before the win, the top one ${big} long and the bottom one ${small} long] ${first} has ${countNoun(big, noun)}. ${second} has ${countNoun(small, noun)}. Then ${second} wins ${countNoun(won, `more ${noun}`)}. How many more ${unitFor(2, noun)} does ${first} have than ${second} now?`,
        initN: big,
        steps: [
          { op: 'sub', n: small, d: 1 },
          { op: 'sub', n: won, d: 1 },
        ],
        units: noun,
        hints: [
          'Which pile is the bigger one once this story has finished?',
          'Settle the pile that changes first, then measure how far the other reaches past it.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's child: the word "more" appears, so they take away. The true move
// is `+` and the shown move is `−` over ONE operand pair, so
// `d_verify_binop_misconception_v1` returns both the true count and the genuine
// output of the misconception — nothing is fabricated, and the shown working is
// arithmetically CORRECT, which is the point. There is nothing to find by
// re-checking the digits.
//
// The draw keeps the gap within six of the first count, so the keyword answer
// lands somewhere a six-year-old can see is impossible: the child said to have
// more finishes with a handful against the other's fourteen or more.
// ---------------------------------------------------------------------------

const eaSubtractedOnMore = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const a = r.int(14, 20);
    const b = r.int(a - 6, a - 2);
    return { a, b, op: '+', wrongOp: '-' };
  },
  build: (v, params, r) => {
    const a = numOf(params, 'a');
    const b = numOf(params, 'b');
    const [first, second] = two(r);
    const noun = r.pick(COLLECTIONS);
    return {
      prompt: `${first} has ${countNoun(a, noun)}. ${second} has ${countNoun(b, `more ${noun}`)} than ${first}. A student worked out ${second}'s pile as ${a} − ${b} = ${v.wrong}.`,
      extension: `Work out how many ${unitFor(2, noun)} ${second} really has. Say what the words "more than" promise about the two piles. Then write one sentence for this student.`,
      hints: [
        'Which of these two children ends up with the bigger pile?',
        'Lay the two piles side by side, and check which way the story points.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: [
        'more than means the second pile is the bigger one',
        'the gap has to be added on, not taken off',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 production — write BOTH questions for one picture (the §4 signature)
//
// Authored rather than drawn, because the task is to produce two questions and
// the picture has to sit still while the child does it. The two bars are the ones
// the prompt names, so the figure is built from the item's own stated values, and
// it asserts nothing: the answers are the joined length and the space, and
// neither is written anywhere on it.
// ---------------------------------------------------------------------------

const writeBothQuestions = withStaticFigure(
  reasoning({
    prompt:
      'Two bars are drawn to one scale. The top bar is marked 15 and the bottom bar is marked 9. Write TWO questions about this picture. One must be answered by adding, and one by taking away. Then answer both of your own questions.',
    value:
      'a question about the two piles together, answered 24; and a question about how many more, answered 6',
    acceptableForms: ['24', '6', 'altogether', 'how many more'],
    keywords: true,
    hints: [
      'Which two different things can a picture like this one tell you?',
      'Point at both bars, then at the space alone, and write one question for each.',
    ],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }),
  barModel(
    [
      { label: 'the top bar', segments: [{ value: 15, label: '15' }] },
      { label: 'the bottom bar', segments: [{ value: 9, label: '9' }] },
    ],
    {
      scaleMax: 15,
      alt: 'two bars to one scale, the top one marked 15 and the bottom one marked 9',
    },
  ),
);

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB15 = makeWeekBuilder({
  level: 'B',
  week: 15,
  conceptId: 'compare-and-change-stories',
  conceptName: 'Compare & change stories',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [B7, B9, B13, B14],
  pedagogyContract: 'v2',
  conceptualAnchor: 'comparison bars',
  conceptFamily: 'operation',
  deepeningDelta:
    'B9 taught stories where something happens: a pile grows or shrinks, and the child follows the change. B15 hands them stories where NOTHING happens — two piles simply sit there being different sizes — and the whole question is which of two things the sentence wants. So the arithmetic deliberately does not advance. Every sum stays where B9 and B13 left it, because the new load is comprehension: the same two words, "more than", ask for a whole pile in one story and for the space between two piles in the next.',
  explanation: {
    hook:
      'Two piles. One question. And "more" is hiding in it twice, meaning two different things.',
    whyBeforeHow:
      'Draw both collections as comparison bars, one under the other, starting from the same line. Because the two bars start together, the space at the end means something exact. It is what one child has and the other does not. Now the two questions come apart. "How many more?" asks for that space. So you take the shorter count off the longer one. "Five more than" does not ask about a space at all. It hands you the space and asks for the whole longer bar. So you build that bar: the matched part first, then the extra on the end. The same two words sit in both stories, and the word is never the instruction. The comparison bars tell you which one you are being asked for, every time.',
    script: [
      {
        say: 'Watch me draw this one. Ines has 12 foil stars, so I draw a bar of 12. Omar has 5 more, so his bar copies hers and then runs 5 further.',
        visual: 'Two bars to one scale: 12 for Ines, and Omar copying it before running 5 further.',
        figure: barModel([statedBar("Ines's foil stars", 12), matchedPlusExtra("Omar's foil stars", 12, 5)], {
          scaleMax: 17,
          alt: 'two bars to one scale, the top one 12 long and the lower one copying it before running 5 further',
        }),
      },
      {
        say: 'Now watch me ask a different question about the very same picture. How many more has Omar got? I do not need his whole bar for that. I only need the piece on the end, past where Ines stops. That piece is 5.',
        visual: 'The same two bars, with the space at the end of the longer one picked out.',
        figure: barModel(
          [statedBar("Ines's foil stars", 12), { label: "Omar's foil stars", segments: [{ value: 12, fill: 'soft' }, { value: 5, label: '5', fill: 'hatch' }] }],
          {
            scaleMax: 17,
            brace: { label: 'the space at the end' },
            alt: 'the same two bars, with the piece at the end of the longer bar braced',
          },
        ),
      },
      {
        say: 'Here is the mistake I want you to see. The word "more" sits in both of my questions. Suppose I hunt for that word and take away every time. Then I get 12 take away 5, which is 7. But Omar has more stars than Ines, and 7 is fewer than 12. So the word was never the instruction.',
        visual: 'Ines at 12 beside a short bar of 7, falling well short of hers.',
        figure: barModel([statedBar("Ines's foil stars", 12), statedBar('the take-away answer', 7)], {
          scaleMax: 12,
          alt: 'two bars to one scale, the top one 12 long and the bottom one only 7 long',
        }),
      },
      {
        say: 'So before I work anything out, I check the size of the answer first. I ask which child should end up with more. Suppose my answer comes out smaller than that child already had. Then I go back and read the question again, not my counting.',
        visual: 'A finger travelling along the two bars, checking which reaches further.',
      },
    ],
    summary:
      'Draw both piles as comparison bars, starting from the same line. "How many more?" wants the space at the end, so you take away. "More than" hands you the space and wants the whole bar, so you add. Before you write, check which child should end up with more.',
    vocabulary: [
      { term: 'comparison bars', kidGloss: 'two bars drawn one under the other, both starting from the same line' },
      { term: 'the space', kidGloss: 'the piece on the end of the longer bar, past where the shorter one stops' },
      { term: 'how many more', kidGloss: 'a question about the space, never about a whole pile' },
      { term: 'more than', kidGloss: 'a question that hands you the space and asks for the whole longer bar' },
    ],
  },
  guidedExamples: [
    {
      ...ge(15, 1, 'modeled', 'Ines has 12 foil stars. Omar has 5 more foil stars than Ines. How many foil stars does Omar have?', [
        {
          teacherSay:
            'Watch me. I am not going to look at the word "more" and decide anything yet. I draw Ines first: a bar of 12. Now the story tells me Omar has 5 more, so I copy Ines\'s bar and I keep going for 5 after it.',
        },
        {
          teacherSay: 'The question wants Omar\'s whole bar, not the piece on the end. So what does that bar come to?',
          expected: '17',
        },
      ], '17'),
      visual: 'Two bars to one scale: 12 for Ines, and Omar copying it before running 5 further.',
      figure: barModel([statedBar("Ines's foil stars", 12), matchedPlusExtra("Omar's foil stars", 12, 5)], {
        scaleMax: 17,
        alt: 'two bars to one scale, the top one 12 long and the lower one copying it before running 5 further',
        asserts: assertsAnswerOf('bar:1'),
      }),
    },
    {
      ...ge(15, 2, 'completion', 'Ines has 14 fridge magnets. Omar has 9 fridge magnets. How many more fridge magnets does Ines have?', [
        { teacherSay: 'Both bars start at the same line. Which one reaches further along?', expected: 'Ines' },
        { childDo: 'Put a finger on the piece of the longer bar that sticks out, and count it.', expected: '5' },
      ], '5'),
      visual: 'Two bars to one scale, 14 for Ines above 9 for Omar, with the space at the end unmarked.',
      // COMPLETION fade: the child produces the 5, so both stated lengths are on
      // the page and the space is left bare. Bracing or labelling it would answer
      // the step the example exists to ask.
      figure: barModel([statedBar("Ines's fridge magnets", 14), statedBar("Omar's fridge magnets", 9)], {
        scaleMax: 14,
        alt: 'two bars to one scale, the top one 14 long and the bottom one 9 long',
      }),
    },
    ge(15, 3, 'prompted', "Rosa's bean plant is 18 cm tall. Jai's bean plant is 6 cm taller than Rosa's. How tall is Jai's bean plant?", [
      { childDo: 'Say which plant is taller, then decide whether you want a whole height or a space.', expected: '24' },
    ], '24'),
    {
      // Independent: no picture at all, and a story that compares AFTER it
      // changes. The child has built the bars three times and now has to carry
      // them in their head, which is the transfer this week is for.
      ...ge(15, 4, 'independent', 'Rosa has 16 toy dinosaurs. Jai has 9 toy dinosaurs. Rosa then gives 4 away. How many more toy dinosaurs does Rosa have than Jai now? Solve cold.', [
        { childDo: 'Settle the pile that changes first, then measure the space that is left.', expected: '3' },
      ], '3'),
    },
  ],
  days: [
    // Day 1 — concept echo: the two questions on their own pages, then the page
    // that asks which of them a picture's space answers. Single-step only, and
    // the same two words have already meant two things by the end of it.
    [
      { gen: wNotGold, diff: 2 },
      { gen: wEmptyHooks, diff: 2 },
      { gen: moreThanValue, diff: 2 },
      { gen: howManyMore, diff: 3 },
      { gen: whichQuestionTheGapAnswers, diff: 3 },
    ],
    // Day 2 — fluency and application: the size prediction, the choice where the
    // right move moves with the question, and the week's first two-step.
    [
      { gen: wJamJars, diff: 2 },
      { gen: wCupcakeStall, diff: 2 },
      { gen: predictBiggerOrSmaller, diff: 3 },
      { gen: chooseTheMove, diff: 3 },
      { gen: msCompareThenChange, diff: 4 },
    ],
    // Day 3 — interleave: both discriminations against the harder chain and the
    // prediction, so nothing about the shape of a page signals the task.
    [
      { gen: wEmptyHooks, diff: 3 },
      { gen: chooseTheMove, diff: 4 },
      { gen: whichQuestionTheGapAnswers, diff: 4 },
      { gen: msChangeThenCompare, diff: 4 },
      { gen: predictBiggerOrSmaller, diff: 4 },
    ],
    // Day 4 — word problems: both two-steps beside the two single-step questions
    // they are built out of, so "it must be two steps" never becomes the cue.
    [
      { gen: msCompareThenChange, diff: 4 },
      { gen: msChangeThenCompare, diff: 4 },
      { gen: moreThanValue, diff: 3 },
      { gen: howManyMore, diff: 3 },
    ],
    // Day 5 — the signature: the keyword answer taken apart, both questions
    // written for one picture, and the claim that settles what the word does.
    [
      { gen: wJamJars, diff: 2 },
      { gen: eaSubtractedOnMore, diff: 4 },
      { gen: writeBothQuestions, diff: 3 },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? The word "more" in a story tells you to add. Write one sentence saying how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Matches the word and stops reading, so every question about a space turns into a total.',
            },
            {
              text: 'never',
              errorTag: 'task-comprehension',
              rationale: 'Throws out the true stories where one child really does have five more than another.',
            },
          ],
          hints: [
            'Can you think of a story where that word does not mean adding?',
            'Write one story of each kind, then pick the word that covers both.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
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
    'For grown-ups: if your child answers one of these wrongly, do not check the adding — it is almost never the adding. Ask them to draw the two piles as two lines, one under the other, both starting at the same edge of the paper. Then ask which line the question is about, or whether it is about the bit of line left over. Children this age are taught to hunt for keywords, and "more" is the word that punishes them for it. Two rows of buttons on the table beats a page of practice.',
  ],
  puzzle: (r) => {
    // The two piles are fixed by construction: taking the extra ones off the
    // total leaves an even amount, and half of it is the shorter pile. Every
    // other pair either misses the total or misses the gap, so the puzzle has one
    // answer by construction and not by a redraw loop (kit §E2.4).
    const gap = r.pick([2, 4, 6] as const);
    const shorter = r.int(4, 9);
    const total = 2 * shorter + gap;
    const name = one(r);
    return {
      id: 'B15-PZ-01',
      title: 'Puzzle Grove: The Two Piles That Would Not Say',
      puzzleType: 'logic',
      prompt: `[image: one bar for all ${total} wooden pegs the two piles hold together] ${name} has split some wooden pegs into two piles. One pile holds ${countNoun(gap, 'more wooden pegs')} than the other. Together the two piles hold ${countNoun(total, 'wooden pegs')}. How many wooden pegs are in each pile? Say how you knew that no other pair of piles could work.`,
      figure: barModel([{ label: 'both piles together', segments: [{ value: total, label: String(total) }] }], {
        scaleMax: total,
        alt: `one bar for all ${total} wooden pegs the two piles hold together`,
      }),
      answer: {
        value: `${shorter} and ${shorter + gap}`,
        acceptableForms: [
          `${shorter + gap} and ${shorter}`,
          `${shorter}, ${shorter + gap}`,
          `${shorter + gap}, ${shorter}`,
        ],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'What happens to the total if you lift the extra ones off the bigger pile?',
        'Take the extra ones off the total, then split the rest into two equal piles.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  // Every core page is HANDED its two numbers and asked which one the question
  // wants. The puzzle is handed neither pile: it knows only a total and a gap, and
  // has to work back to the two piles and then argue that nothing else fits. Two
  // moves, and a move no Day-1 page makes.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'sum-and-gap-deduction' },
  sprint: {
    skill: 'Adding within a hundred — the line a "more than" story turns into',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 12, max: 79, regroup: 'mixed' },
  },
  mastery: [
    { gen: moreThanValue, diff: 3 },
    { gen: msCompareThenChange, diff: 4 },
    { gen: howManyMore, diff: 3 },
    { gen: msChangeThenCompare, diff: 4 },
    { gen: chooseTheMove, diff: 3 },
    { gen: whichQuestionTheGapAnswers, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: the two single-step questions — the whole longer pile from a stated gap, and the gap between two stated piles — with the comparison-bar affordance preserved on both (the extra segment labelled on 01, the space left bare on 03). 02/04: the two chains — compare then change, and change then compare, the second one drawn as the two piles BEFORE the win so the drawn space is not the answer. 05: the choice whose correct option moves with the question, drawn as a "how many more" story on half the seeds and a "more than" story on the other half, so a form cannot be passed by choosing one move twice. 06: the picture held still while the question moves. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'more-means-take-away',
      description: 'Reads the word "more" as an instruction to subtract wherever it appears, so a story that hands over a gap and asks for the whole longer pile is answered with the difference.',
      exampleWrongAnswer: '"Ken has 15 more than Zoe, who has 18" answered as 3',
      distractorRationale: 'Offer the difference of the two stated numbers where the question asked for the whole longer pile — it lands below the count that child is said to beat.',
      reteachPointer: 'explanation/script[2] (the take-away answer drawn short, well inside the other bar)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-nearer-question',
      description: 'Gives a quantity the story really does mention, but not the one the question names — the total where the space was wanted, or the count the story opened with instead of the pile it asks about.',
      exampleWrongAnswer: 'a "how many more?" question answered with the two piles added together',
      distractorRationale: 'Offer the two stated counts joined, and the count the story opens with, beside the quantity the question actually names.',
      reteachPointer: 'guidedExamples/B15-GE-02 (name the piece that sticks out, not the whole bar)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-the-bar-not-the-space',
      description: 'Reads the whole length of the longer bar where the question asked for the space at its end, treating the bar and the leftover piece as the same thing.',
      exampleWrongAnswer: 'a comparison of 22 against 15 answered as 22',
      distractorRationale: 'Offer the longer bar\'s own length where the question asked what it reaches past.',
      reteachPointer: 'explanation/script[1] (only the piece on the end, past where the shorter bar stops)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'stops-at-the-first-comparison',
      description: 'Chooses the right moves in the right order and then stops one step early, reporting the space the two piles started with rather than the space left once one of them has changed.',
      exampleWrongAnswer: 'a change-then-compare story answered with the gap before the second pile grew',
      distractorRationale: 'Offer the difference of the two counts the story states outright, before the change it goes on to describe.',
      reteachPointer: 'guidedExamples/B15-GE-04 (settle the pile that changes before you measure anything)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Comparison stories — drawing two collections as two bars from the same starting line, and working out which of two questions a story is asking. "How many more?" asks for the space between the bars and needs a take-away. "Six more than" hands you that space and asks for the whole longer bar, so it needs an add. We also met stories where one pile changes before the comparison is made.',
    improvingCandidates: [
      'reading a comparison story to the end before choosing add or take away',
      'drawing two piles as two bars that start from the same line',
      'naming the space between two bars rather than either bar',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'treating "more" as a word to read rather than an instruction to obey — it points both ways, depending on what the sentence goes on to ask',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was asked — the total of two piles and the space between them are different questions about the same picture',
      },
      {
        errorTag: 'representation-misread',
        text: 'telling a whole bar apart from the piece of it that sticks out past the other one',
      },
      {
        errorTag: 'procedure-slip',
        text: 'finishing a story that changes before it compares, rather than stopping at the first comparison',
      },
    ],
    homeFocus: {
      praiseLine:
        'You drew the two piles as two bars and compared them before you picked add or take away — that is exactly the habit this week is built on.',
      questionForChild: 'Ben has 14 stickers and Mia has 9. Now ask me two different questions about that, and tell me which one needs taking away.',
      schoolSyncHook: 'If your child\'s class calls these "bar models" or "comparison models", tell us and we will use the words they hear.',
    },
    vocabularyForParent: [
      'comparison bars (two bars drawn one under the other, both starting from the same line)',
      'the space (the piece on the end of the longer bar, past where the shorter one stops)',
      '"how many more" (a question about the space, never about a whole pile)',
    ],
  },
});
