/**
 * Level B · Week 5 — "Make ten to add" (conceptId: make-ten-to-add).
 *
 * FILL-ARCHITECTURE §4 row B5: anchor "fill the frame, carry the spill";
 * multi-step "8+5 via 8+2+3 — the bridge IS the two-step"; error-analysis
 * "bridges to 12 (miscounts the spill)"; discrimination "needs-a-bridge vs not
 * (8+5 vs 8+1)"; Day-5 signature "show the bridge two ways".
 *
 * The neat thing about this week is that nothing had to be contrived to reach
 * the multi-step quota. The strategy IS two moves — take enough to fill the ten,
 * then bring the rest over — so `msBridge` ships a genuine two-op chain whose
 * two steps are the two halves of the anchor, and `msDaisyDays` adds a second,
 * plainer two-step (a bridging sum, then one more day's picking) so the child
 * meets the bridge inside a longer chain as well as alone.
 *
 * CONCEPT FAMILY (kit §A): `'operation'`, the full row — ≥2 multi-step items
 * week-wide. Declaring 'place-value' would have been a dodge here: the concept
 * is an addition strategy, and its own recipe hands it the two-step.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5). Every ten-frame is built from
 * the item's own drawn count and asserts a GIVEN — the counters the child was
 * handed — never the answer:
 *  - `fillTheFrame` / `spillOver` / `needsBridge` / `msBridge` all draw the
 *    frame as it is BEFORE the bridge, asserted against the item's own param.
 *    That is the whole point of the picture on this week: a frame with 8 in it
 *    shows exactly how many more fit before it spills, and it shows it without
 *    counting the spill for anyone.
 *  - no assessed item is ever drawn AFTER the bridge. The finished double frame
 *    appears only in the lesson script and in the modeled guided example, where
 *    the answer is already on the page.
 *  - `msDaisyDays` and the Day-5 items carry no figure at all: by then the frame
 *    is meant to be in the child's head, and a picture of daisies would assert
 *    nothing the arithmetic uses.
 *
 * ⚠ VERIFY-LIBRARY LIMIT, disclosed per kit §E2.3. The recipe's error is a
 * bridge whose SPILL is miscounted — 8 + 5 answered 13 − 1 = 12. No shipped
 * verify template can derive that from the addends: `d_verify_binop_misconception_v1`
 * varies the OPERATION over one fixed pair, and no pair (x, y) has x + y and
 * x ∘ y one apart for the totals this week uses (the only integer solutions are
 * (3,2) and (2,3), far below a bridging sum). The first fallback in the kit's
 * order — find an identity that makes the recipe's own value derivable — was
 * therefore taken through a DIFFERENT registered template rather than
 * abandoning the value: `a_verify_count_slip_v1` in `slip:'skip-count'` mode is
 * the corpus's registered "the count stopped one short" transform, and it
 * returns exactly {correct: n, wrong: n − 1}. Fed the item's own true total it
 * produces the recipe's 12 for the recipe's 8 + 5, code-derived, with the
 * misconception NAMED by the template rather than invented by the prompt — a
 * count of the spill that stops one short is precisely what that transform
 * models. The addends ride in the same params so the prose and the truth are
 * drawn together; the template reads only `n` and `slip`.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): sentences ≤15 words;
 * `ten-frame`, `spill` and `partner of ten` glossed in `explanation.vocabulary`
 * before any item leans on them; metacognition in its intro form — the B row's
 * own "will it pass 10?" prediction, drawn over a pool that genuinely contains
 * both answers so the call is never a formality; error-analysis written-lite,
 * one sentence; and the sprint begins, ungraded and self-referenced, on the
 * partners of ten mastered back in A13.
 *
 * Retrieval is backward-only into A13 (partners of 10 — the fact every bridge
 * runs on), A23 (teen numbers as ten and some more — the form every bridge
 * lands in) and B4 (count on — how the spill is carried).
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, tenFrame } from '../lib/figures';
import { partnersHiding, teenExtra, teenTenAnd } from '../lib/earlynumber';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A13 = { level: 'A' as const, week: 13 };
const A23 = { level: 'A' as const, week: 23 };
const B4 = { level: 'B' as const, week: 4 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so a comparison story cannot compare someone with themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// Context frames
//
// Three small pools, one per register, chosen fresh against the weeks already
// written (kit §E2.8): the frame pages talk about counters, the walking-story
// pages about what a child finds on a path, and the threading page about bells.
// Nothing here collides with a sibling week's declared nouns.
// ---------------------------------------------------------------------------

/** Things found on a walk — the comparison story. */
const FOUND = ['feathers', 'ladybirds', 'twigs'] as const;
/** Things picked over several days — the longer chain. */
const PICKED = ['daisies', 'buttercups', 'poppies'] as const;

// ---------------------------------------------------------------------------
// The bridging draw
//
// A pair that GENUINELY crosses ten: the first number is 6–9, and the second is
// large enough that the frame fills and something is left over. Both bounds are
// computed, so every draw is legal on its first attempt — no redraw loop, which
// would consume a variable number of rng draws and break seed-stability for
// every later item in the pack (kit §E2.4).
// ---------------------------------------------------------------------------

interface Pair {
  /** What is already in the frame. */
  a: number;
  /** What arrives. */
  b: number;
  /** How many of `b` fit before the frame is full — the partner of ten. */
  fill: number;
  /** How many are left over once the frame is full. */
  spill: number;
}

function bridgePair(r: Rng): Pair {
  const a = r.int(6, 9);
  const b = r.int(11 - a, 9); // 11 - a is the smallest b that still spills
  return { a, b, fill: 10 - a, spill: a + b - 10 };
}

// ---------------------------------------------------------------------------
// withFigure / withDrawnFrame — a picture built from the item's OWN values.
//
// The shipped primitives have no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so
// the QG-1/QG-4 surface signature the guard already registered is unchanged).
// `withFigure` rebuilds from the drafted item's `generator.params` — the very
// numbers its answer was computed from. `withDrawnFrame` covers the case
// `discrimination()` creates: it emits no generator spec at all, so the draw
// closure posts what it drew into a one-slot box which the decorator reads
// immediately afterwards (`drawUniqueItem` returns the draft its LAST build call
// produced, so the box always holds that same draw).
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface DrawnFrame {
  /** Counters in the frame at the moment the picture is taken. */
  n: number;
  seed: number;
}

function frameSlot(): { last: DrawnFrame | null } {
  return { last: null };
}

/** The posted draw, or a loud failure — never a silently different picture. */
function posted(box: { last: DrawnFrame | null }, who: string): DrawnFrame {
  if (!box.last) throw new Error(`b05/${who}: the draw posted no frame to build the picture from`);
  return box.last;
}

/**
 * Give a choice item the frame it was drawn from, plus the generator spec that
 * pins the picture's params to the item's own draw. `a_frame_read_v1` is the
 * template that names them: it carries no `verifyFor`, so QG-11 does not go
 * looking for a worked claim on an item that makes none, and its `answerFor` is
 * never consulted either (the arithmetic audit skips choice-key items) — while
 * QG-13 still proves the drawn frame holds the count the item drew.
 */
function withDrawnFrame(
  box: { last: DrawnFrame | null },
  base: ItemGen,
  build: (f: DrawnFrame) => BBFigure,
): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const drawn = posted(box, 'withDrawnFrame');
    return {
      ...d,
      generator: { templateId: 'a_frame_read_v1', params: { n: drawn.n }, seed: drawn.seed },
      figure: build(drawn),
    };
  };
}

/** The frame as it stands BEFORE the bridge — the picture every page here shows. */
const frameBefore = (n: number, asserts: ReturnType<typeof assertsParam>): BBFigure =>
  tenFrame(n, {
    alt: `a ten-frame holding ${countNoun(n, 'counters')}, with the rest of its boxes empty`,
    asserts,
  });

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * A13 — the hiding game for partners of ten, served straight from the family.
 * This is the single fact the whole week runs on: a child who knows what fills
 * the frame has already done step one of every bridge.
 */
const wPartnersOfTen = asWarmup(partnersHiding({ total: 10 }), A13);

/** A23 — ten and some more, which is the shape every bridge lands in. */
const wTenAndSome = asWarmup(teenTenAnd(), A23);

/**
 * A23 read the other way: this teen number is ten and HOW many more?
 *
 * It is here for a reason found by reading the generated week rather than by any
 * gate. The partners-of-ten hiding game keeps all of its numbers inside its
 * picture, so the sentence a child SEES is the same sentence every time it is
 * served — fine on one day, a repeated page on two. Serving a second A23 form
 * instead keeps four distinct warm-up formats and gives every retrieval page its
 * own words, while landing on exactly the skill a finished bridge needs: reading
 * thirteen as ten and three.
 */
const wTeenExtra = asWarmup(teenExtra(), A23);

/**
 * B4 — counting on, the move that carries the spill over the ten.
 *
 * Deliberately set on a board, not a number path: B6 (written alongside this
 * week) retrieves the same B4 skill with a frog hopping along a line, and two
 * neighbouring weeks should not open with the same picture (kit §E2.8). "Piece"
 * rather than "counter", too — a counter means something specific for five days
 * here, and it is not a board-game token.
 */
const wCountOn = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add',
    draw: (r) => {
      const start = r.int(7, 16);
      const hop = r.pick([2, 3, 4] as const);
      const name = one(r);
      return {
        prompt: `${name}'s piece is on square ${start} of a board game. ${name} moves it ${countNoun(hop, 'squares')} on. Which square is that?`,
        answerValue: String(start + hop),
        templateId: 'count_on_v1',
        params: { start, hop },
        hints: [
          'Which square is the piece on before it moves?',
          'Touch each square you pass, and say its number as you go.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B4,
);

// ---------------------------------------------------------------------------
// The two halves of the anchor, isolated — one page each
// ---------------------------------------------------------------------------

/**
 * FILL THE FRAME. The partner of ten, asked in its most concrete form — the
 * empty boxes. The picture states what the child was handed (the counters
 * already in) and leaves the empty boxes to be counted, which is the answer, so
 * the frame shows the question without answering it.
 *
 * B6 retrieves this same skill next week in its abstracted form ("how many more
 * counters would fill it?"), which is the right order: the boxes are countable
 * here, and by then they should not need to be.
 */
const fillTheFrame = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'partner-of-ten',
    draw: (r) => {
      // 5 is left out of the pool deliberately. A half-full frame is the one
      // count where the counters IN it and the boxes left over are the same
      // number, so a child who reads the wrong quantity off the picture still
      // scores — the one draw where the item stops diagnosing anything. Excluded
      // at the source rather than nudged, so no rng draw is ever wasted (§E2.4).
      const filled = r.pick([2, 3, 4, 6, 7, 8, 9] as const);
      const name = one(r);
      return {
        prompt: `[image: a ten-frame holding ${countNoun(filled, 'counters')}] A ten-frame holds 10 counters, and ${name} has dropped ${countNoun(filled, 'counters')} in. How many empty boxes are left to fill?`,
        answerValue: String(10 - filled),
        templateId: 'a_frame_empty_v1',
        params: { filled, cap: 10 },
        units: 'boxes',
        hints: [
          'Is this frame nearly full, or nearly empty?',
          'Cover the counters with one hand, then count what is left showing.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  (p) => frameBefore(numOf(p, 'filled'), assertsParam('filled')),
);

/**
 * CARRY THE SPILL. The other half: the frame fills, and the question is about
 * what could NOT go in.
 *
 * The registered template is `d_sub_v1`, and its `a` and `b` are the two
 * operands of the subtraction the child actually performs — the pile that
 * arrives, less the boxes that were free. They are deliberately NOT the story's
 * first two numbers, which is why they are named here rather than left to be
 * inferred. `inFrame` is an extra param carried for the picture alone: the
 * template reads only `a` and `b`, and QG-13 reads only `inFrame`, so the frame
 * is pinned to the count the story starts from.
 */
const spillOver = withFigure(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'spill-count',
    draw: (r) => {
      const { a, b, fill, spill } = bridgePair(r);
      const name = one(r);
      return {
        prompt: `[image: a ten-frame holding ${countNoun(a, 'counters')}] ${name}'s ten-frame already holds ${countNoun(a, 'counters')}. ${name} tips in ${countNoun(b, 'counters')} more. The frame fills right up. How many counters are left outside it?`,
        answerValue: String(spill),
        templateId: 'd_sub_v1',
        params: { a: b, b: fill, inFrame: a },
        units: 'counters',
        hints: [
          'How many boxes were free before the counters were tipped in?',
          'Fill those free boxes first, then count the counters that had nowhere to go.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (p) => frameBefore(numOf(p, 'inFrame'), assertsParam('inFrame')),
);

// ---------------------------------------------------------------------------
// Stories where the bridge is the way through, not the subject
// ---------------------------------------------------------------------------

/** A comparison whose answer crosses ten — the bridge inside a different shape. */
const foundMoreThan = situation({
  situationType: 'comparison',
  cognitiveOp: 'add',
  draw: (r) => {
    const { a, b } = bridgePair(r);
    const [first, second] = two(r);
    const noun = r.pick(FOUND);
    return {
      prompt: `${first} found ${countNoun(a, noun)} on the woodland path. ${second} found ${countNoun(b, `more ${noun}`)} than ${first}. How many ${noun} did ${second} find?`,
      answerValue: String(a + b),
      templateId: 'd_add_v1',
      params: { a, b },
      units: noun,
      hints: [
        'Does the second child end up with fewer than the first, or with more?',
        'Start at the first count and go up to ten, then bring the rest on.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * Metacognition, in the Level-B intro form the fill spec names: a "will it pass
 * ten?" prediction, made before any adding happens.
 *
 * The pool is drawn so that the answer is genuinely in doubt: the first number
 * runs 5–9 and the second 3–9, which crosses ten most of the time but not all of
 * it (6 of the 35 pairs stop short). A probe whose answer is always yes trains
 * nothing but the word — and the hint has to survive both cases too, which is
 * why its second rung is conditional rather than an instruction to bridge.
 *
 * The base is served ONLY through the wrapper (kit §E2.2): a generator used both
 * raw and wrapped ships two identical hint ladders, which spends two of the
 * three the dedup allows on one idea.
 */
const threadBellsBase = situation({
  situationType: 'combine',
  cognitiveOp: 'add',
  draw: (r) => {
    const first = r.int(5, 9);
    const more = r.int(3, 9);
    const name = one(r);
    return {
      prompt: `${name} threads ${countNoun(first, 'bells')} onto a string. Then ${name} threads ${countNoun(more, 'more bells')} on. How many bells are on the string?`,
      answerValue: String(first + more),
      templateId: 'd_add_v1',
      params: { a: first, b: more },
      units: 'bells',
      hints: [
        'Is either of these numbers close to ten already?',
        'Build the ten first if the two piles can reach it, then add the rest.',
      ],
      errorTags: ['fact-recall', 'procedure-slip'],
    };
  },
});

const predictPastTen = withEstimateFirst(threadBellsBase, 'will this total climb past ten?');

// ---------------------------------------------------------------------------
// Discrimination — needs a bridge, or does not
//
// The recipe's contrast, drawn so that both sums start from the SAME number: one
// spills over the edge of the frame and one stops short of it, so the only thing
// that can decide the question is the second number against the empty boxes.
// The third option is the child who has learnt "this week is the bridge week"
// and applies it to everything.
// ---------------------------------------------------------------------------

const needsBridgeBox = frameSlot();
const needsBridge = withDrawnFrame(
  needsBridgeBox,
  discrimination({
    variant: 'structural',
    cognitiveOp: 'bridge-or-not',
    draw: (r) => {
      // 6–8 leaves room for a second number that still stops short of ten.
      const held = r.int(6, 8);
      // ONE IN THREE DRAWS MAKES "both sums" THE ANSWER. Without this the third
      // option was offered on every exposure and keyed on none, so a child who
      // met the page twice learnt to strike it out — and the page collapsed to a
      // two-way choice it could win by reading the bigger second number. A dead
      // option is worse than no option: it teaches its own elimination.
      const bothBridge = r.int(1, 3) === 1;
      const big = r.int(11 - held, 9);
      // On the both-bridge branch the two second numbers must still differ, or
      // the page prints the same sum twice. Computed from `big` rather than
      // re-drawn, so the rng stream lands in the same place either way.
      const smallRaw = bothBridge ? r.int(11 - held, 9) : r.int(1, 9 - held);
      const small = bothBridge && smallRaw === big
        ? (big === 9 ? 11 - held : big + 1)
        : smallRaw;
      // AND WHICH SUM IS PRINTED FIRST NOW ROTATES. The bridging sum used to be
      // listed first every time, so the answer was the first thing named in the
      // prompt in 100% of draws — a child could score it without reading either
      // number. Caught by scripts/bb-answer-entropy-test.ts, not by any per-pack
      // gate, because the keyed TEXT varied on every seed.
      const bigFirst = r.int(0, 1) === 0;
      const [shownA, shownB] = bigFirst ? [big, small] : [small, big];
      needsBridgeBox.last = { n: held, seed: r.uint() };
      return {
        // Every option the child can choose is named in the prompt, so the page
        // reads as one question rather than a question plus a surprise third
        // door — and the sums stay in the prompt, which is where QG-1 reads the
        // operand surface from.
        prompt: `[image: a ten-frame holding ${countNoun(held, 'counters')}] A ten-frame holds 10 counters, and it has ${countNoun(held, 'counters')} in it now. Two sums start from this frame: ${held} + ${shownA} and ${held} + ${shownB}. Which has to make a ten first — one of them, or both sums?`,
        correct: bothBridge ? 'both sums' : `${held} + ${big}`,
        distractors: (
          bothBridge
            ? [
              {
                text: `${held} + ${shownA}`,
                errorTag: 'concept-misconception' as const,
                rationale: 'Picks one sum and stops, though both second numbers are bigger than the empty boxes waiting in the frame.',
              },
              {
                text: `${held} + ${shownB}`,
                errorTag: 'concept-misconception' as const,
                rationale: 'Picks one sum and stops, though both second numbers are bigger than the empty boxes waiting in the frame.',
              },
            ]
            : [
              {
                text: `${held} + ${small}`,
                errorTag: 'concept-misconception' as const,
                rationale: 'That sum stops short of the last box, so nothing spills over and there is no ten to build.',
              },
              {
                text: 'both sums',
                errorTag: 'task-comprehension' as const,
                rationale: 'Treats every sum as a bridge, including the ones that fit inside the frame with boxes to spare.',
              },
            ]
        ).filter((d) => d.text !== (bothBridge ? 'both sums' : `${held} + ${big}`)),
        hints: [
          'How many empty boxes are waiting in this frame?',
          'Hold each second number against the empty boxes and see which ones overflow.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  (f) => frameBefore(f.n, assertsParam('n')),
);

// ---------------------------------------------------------------------------
// Multi-step — the bridge IS the two-step (kit §A / FILL-ARCHITECTURE §4)
// ---------------------------------------------------------------------------

/**
 * The week's own two-step. The chain is the strategy: add the partner of ten,
 * then add the spill. Nothing is contrived — those two additions are what a
 * child doing this properly performs, in that order, and `stepCount` is read off
 * the chain rather than claimed.
 *
 * The prose states the two quantities the story gives (what is in the frame,
 * what arrives) and NOT the split, because deciding the split is the work. The
 * picture shows the frame at the moment the story opens, which is `initN`, so it
 * asserts against the chain's own starting value.
 */
const msBridge = withFigure(
  multiStep({
    situationType: 'combine',
    cognitiveOp: 'multi-step',
    usesPriorSkill: true,
    draw: (r) => {
      const { a, b, fill, spill } = bridgePair(r);
      const name = one(r);
      return {
        prompt: `[image: a ten-frame holding ${countNoun(a, 'counters')}] ${name} has ${countNoun(a, 'counters')} in a ten-frame and ${countNoun(b, 'loose counters')} beside it. ${name} fills the frame first, then brings the rest across. How many counters does ${name} have in all?`,
        initN: a,
        steps: [
          { op: 'add', n: fill, d: 1 },
          { op: 'add', n: spill, d: 1 },
        ],
        units: 'counters',
        hints: [
          'How many of the loose counters does the frame still have room for?',
          'Slide that many in to make the ten, then count the leftovers on.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  (p) => frameBefore(numOf(p, 'initN'), assertsParam('initN')),
);

/**
 * The second two-step, and a plainer one: a bridging sum with one more day's
 * picking on the end. The bridge is buried in step one instead of being the
 * whole item, which is where it has to survive if the strategy is to be worth
 * anything — and the last step composes B4's count on.
 *
 * The last day's picking is bounded so the running total stays inside 20, which
 * is the range a ten-frame pair can still picture.
 *
 * No figure: the arithmetic here never consumes a frame, and a picture of
 * daisies would assert nothing the item asks about.
 */
const msDaisyDays = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'multi-step',
  usesPriorSkill: true,
  draw: (r) => {
    const { a, b } = bridgePair(r);
    const last = r.int(2, Math.min(5, 20 - a - b));
    const name = one(r);
    const noun = r.pick(PICKED);
    return {
      prompt: `${name} picked ${countNoun(a, noun)} on Monday and ${countNoun(b, noun)} on Tuesday. On Wednesday ${name} picked ${countNoun(last, `more ${noun}`)}. How many ${noun} did ${name} pick in the three days?`,
      initN: a,
      steps: [
        { op: 'add', n: b, d: 1 },
        { op: 'add', n: last, d: 1 },
      ],
      units: noun,
      hints: [
        'Which two days does this story ask you to put together first?',
        'Join the first two days into one number, then count Wednesday on from there.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the ⚠ note in the file header for why the truth comes from
// `a_verify_count_slip_v1`. The shown value is the genuine output of a count
// that stops one short — which is what miscounting the spill is — and the true
// total is code-computed from the same params, so neither can be fabricated.
// The addends ride along in the params purely so the prose is drawn from the
// same place as the truth.
// ---------------------------------------------------------------------------

const eaMiscountedSpill = errorAnalysis({
  verifyTemplateId: 'a_verify_count_slip_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const { a, b } = bridgePair(r);
    return { n: a + b, slip: 'skip-count', a, b };
  },
  build: (v, p) => ({
    prompt: `Ravi worked out ${p.a} + ${p.b} on a ten-frame. He slid counters across until the frame was full. Then he counted the ones still outside and wrote ${v.wrong}.`,
    extension: 'Work out the total yourself. Then write one sentence telling Ravi which counters to check again.',
    hints: [
      'How many counters move across to fill the frame, and how many stay outside?',
      'Build the same frame yourself and count the outside ones slowly, touching each one.',
    ],
    errorTags: ['procedure-slip', 'concept-misconception'],
  }),
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB05 = makeWeekBuilder({
  level: 'B',
  week: 5,
  conceptId: 'make-ten-to-add',
  conceptName: 'Make ten to add',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [A13, A23, B4],
  pedagogyContract: 'v2',
  conceptualAnchor: 'fill the frame, carry the spill',
  conceptFamily: 'operation',
  deepeningDelta:
    'A13 taught the partners of ten as a game with a covered frame, and A23 taught that a teen number is ten and some more. B5 puts those two facts end to end and makes them a method: the partner of ten is now something you go looking for inside a second number, and the teen number is where the method lands. B4 supplies the last step — counting the spill on from ten.',
  explanation: {
    hook:
      'Some sums feel heavy. 8 + 5 is one of them. But ten and 3 is easy, and this week you learn to turn one into the other.',
    whyBeforeHow:
      'Ten is the easiest number in the world to add to. Ten and 3 is thirteen — the number almost says itself. That is why we build a ten on purpose before we add. The move is this: fill the frame, carry the spill. A ten-frame holds ten counters and not one more. Put 8 in, and only 2 boxes stay empty. So only 2 of the 5 can climb in. The other 3 spill over the edge. Now the sum reads ten and 3, which every child can say. Nothing was added and nothing was lost on the way. The 5 was split on purpose: the part that fits, and the part that is left.',
    script: [
      {
        say: 'Watch me add 8 + 5. I drop 8 counters into the frame. Two boxes are still empty. So I take 2 counters out of the 5 and slide them in. Full frame. That is my ten.',
        visual: 'A ten-frame with 8 counters in it and 2 empty boxes waiting.',
        figure: tenFrame(8, { alt: 'a ten-frame holding 8 counters, with 2 boxes still empty' }),
      },
      {
        say: 'Now look at my hand. Three counters are left over. Ten and 3. That is thirteen. The 5 never disappeared — 2 of it went into the frame and 3 stayed outside.',
        visual: 'A full frame beside a second frame holding the 3 that spilled over.',
        figure: tenFrame(13, { frames: 2, alt: 'a full ten-frame beside a second frame holding 3 counters' }),
      },
      {
        say: 'Here is where counts go astray. The frame is full, and my picture stops there. What is left is in my hand. Count those slowly. Miss one and the answer lands one short — 12, not thirteen.',
        visual: 'A ten-frame filled right up, with nothing drawn outside it.',
        figure: tenFrame(10, { alt: 'a ten-frame filled right up, with nothing drawn beside it' }),
      },
      {
        say: 'One more habit before I start. I check the size of the answer first. 8 is close to ten, so this total has to finish past ten. If it came out under ten I would go back and look again.',
        visual: 'A ten-frame with 8 counters, and the answer line marked past ten.',
        figure: tenFrame(8, { alt: 'a ten-frame holding 8 counters, nearly full' }),
      },
    ],
    summary:
      'Find the number that fills the frame to ten. Take that much out of the other number and slide it across. Then read the ten and the spill: ten and 3 is thirteen. Check your answer really did finish past ten.',
    vocabulary: [
      { term: 'ten-frame', kidGloss: 'a box with ten spaces in it, in two rows of five' },
      { term: 'make ten', kidGloss: 'build a ten first, because ten is the easiest number to add to' },
      { term: 'the spill', kidGloss: 'the counters left over once the frame is full' },
      { term: 'partner of ten', kidGloss: 'the number that fills the rest of the frame' },
    ],
  },
  guidedExamples: [
    {
      ...ge(5, 1, 'modeled', 'Work out 8 + 5. Use a ten-frame and make a ten first.', [
        {
          teacherSay:
            'Watch me. I put 8 counters in the frame, and I can see 2 boxes still empty. So I take 2 counters out of the 5 and slide them in. My frame is full now, and full means ten.',
        },
        {
          teacherSay: 'Now I look at what is still in my hand. Ten, and that many more — what do I write down?',
          expected: '13',
        },
      ], '13'),
      visual: 'A full ten-frame beside a second frame holding the 3 that were left over.',
      figure: tenFrame(13, {
        frames: 2,
        alt: 'a full ten-frame beside a second frame holding 3 counters',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(5, 2, 'completion', 'Work out 9 + 5 on the ten-frame.', [
        { teacherSay: 'The frame is holding 9 counters. How many more would fill it?', expected: '1' },
        { childDo: 'Slide that many across, then say the ten and the counters left outside.', expected: '14' },
      ], '14'),
      visual: 'A ten-frame with 9 counters and one empty box.',
      figure: tenFrame(9, { alt: 'a ten-frame holding 9 counters, with 1 box still empty' }),
    },
    ge(5, 3, 'prompted', 'Work out 7 + 8. Say the split out loud before you write anything.', [
      { childDo: 'Name the counters that fill the frame first, then count the spill on.', expected: '15' },
    ], '15'),
    {
      ...ge(5, 4, 'independent', 'Nina picked 9 poppies in the morning and 7 more after lunch. How many poppies did Nina pick? Solve cold.', [
        { childDo: 'Build the ten first, then bring the rest over.', expected: '16' },
      ], '16'),
    },
  ],
  days: [
    // Day 1 — concept echo: the two halves of the anchor on their own pages, and
    // one story that needs the bridge without naming it. Single-step only.
    [
      { gen: wPartnersOfTen, diff: 2 },
      { gen: wTenAndSome, diff: 2 },
      { gen: fillTheFrame, diff: 2 },
      { gen: spillOver, diff: 3 },
      { gen: foundMoreThan, diff: 3 },
    ],
    // Day 2 — fluency + application: the prediction, the bridge-or-not trap, and
    // the week's first two-step, against the fill-the-frame page it is built on.
    [
      { gen: wCountOn, diff: 2 },
      { gen: predictPastTen, diff: 3 },
      { gen: needsBridge, diff: 3 },
      { gen: msBridge, diff: 4 },
      { gen: fillTheFrame, diff: 3 },
    ],
    // Day 3 — interleave: the trap and the prediction again, beside the longer
    // chain and the spill page, so the shape of the page never signals the task.
    [
      { gen: wTeenExtra, diff: 3 },
      { gen: needsBridge, diff: 4 },
      { gen: predictPastTen, diff: 4 },
      { gen: msDaisyDays, diff: 4 },
      { gen: spillOver, diff: 3 },
    ],
    // Day 4 — word problems: both two-steps, with the comparison story mixed in
    // so "it must be two steps" never becomes the cue.
    [
      { gen: wCountOn, diff: 3 },
      { gen: msBridge, diff: 4 },
      { gen: msDaisyDays, diff: 5 },
      { gen: foundMoreThan, diff: 3 },
    ],
    // Day 5 — the signature: the miscounted spill analysed, the bridge shown two
    // ways, and the claim that settles what the splitting does to the total.
    [
      { gen: wTenAndSome, diff: 2 },
      { gen: eaMiscountedSpill, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Here is one sum: 7 + 6. It can be made into a ten in two different ways. Way one: move 3 across from the 6 to fill the 7. Way two: move 4 across from the 7 to fill the 6. Work out both ways. Do they land on the same number? Write one sentence saying how you know.',
          value: 'both ways land on 13 — the same counters are being split in a different place, so the total cannot change',
          acceptableForms: ['13', 'thirteen', 'the same', 'both'],
          keywords: true,
          hints: [
            'Which number in this sum is nearer to ten? Does the other one work too?',
            'Draw the frame twice, filled from each number in turn, and compare the answers.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? Making a ten first changes the answer to a sum. Write one sentence saying how you know.',
          correct: 'never',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Reads the split as if it brought new counters in, when the counters were only moved between two piles.',
            },
            {
              text: 'sometimes',
              errorTag: 'task-comprehension',
              rationale: 'Leaves room for the total to shift on some sums, so the strategy would have to be checked every time.',
            },
          ],
          hints: [
            'Does moving counters from one pile to the other make any new ones appear?',
            'Try one sum both ways on the frame, and see if the answers ever differ.',
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
    'For grown-ups: if your child answers one short — 12 for 8 + 5 — do not correct the total. Ask two questions instead: how many counters moved across, and how many stayed in your hand? Nearly every slip this week happens while the leftovers are being counted, and hearing the two amounts said separately usually settles it. An egg box and a handful of buttons at the kitchen table works as well as any worksheet.',
  ],
  puzzle: (r) => {
    const { a, b } = bridgePair(r);
    const name = one(r);
    const total = a + b;
    return {
      id: 'B5-PZ-01',
      title: 'Puzzle Grove: The Frame That Filled Up',
      puzzleType: 'logic',
      prompt: `[image: a full ten-frame beside a second frame holding the counters that spilled over] ${name} began with ${countNoun(a, 'counters')} in a ten-frame. Then ${name} tipped in a handful more, and the frames now hold ${countNoun(total, 'counters')} altogether. How many counters were in that handful? Say how the full frame helped you find it.`,
      figure: tenFrame(total, {
        frames: 2,
        alt: 'a full ten-frame beside a second frame holding the counters that spilled over',
      }),
      answer: {
        value: String(b),
        acceptableForms: [countNoun(b, 'counters')],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which of these two counts was in the frame before the handful arrived?',
        'Work out how many boxes the handful filled, then how many it left outside.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  // Running the bridge BACKWARDS: the total is given and the second number is
  // the unknown, so the frame has to be read as evidence rather than followed as
  // a recipe. Two moves, and a move no Day-1 page makes.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'bridge-back' },
  sprint: {
    skill: 'Partners of ten — the fact every bridge runs on',
    sourceWeek: A13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'retr_partners_of_10_v1',
    params: { total: 10, min: 1, max: 9 },
  },
  mastery: [
    { gen: fillTheFrame, diff: 3 },
    { gen: msBridge, diff: 4 },
    { gen: spillOver, diff: 3 },
    { gen: msDaisyDays, diff: 4 },
    { gen: foundMoreThan, diff: 3 },
    { gen: needsBridge, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: the two halves of the anchor as single-step pages — how many fill the frame, and how many are left outside once it does (the before-the-bridge frame picture preserved on both). 02/04: the two two-steps — the bridge itself as a partner-then-spill chain, and a bridging sum with one more day added on. 05: the comparison story that needs a bridge without naming it. 06: the bridge-or-not choice, with both sums starting from the same number. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'spill-reuses-the-fill',
      description: 'Bridges correctly to ten, then carries the number that filled the frame across a second time, as though the two parts of the split were the same part.',
      exampleWrongAnswer: '9 + 6 answered as 11 — the 1 that filled the frame counted again as the leftovers',
      distractorRationale: 'Offer the total that comes from adding the fill to ten instead of the spill.',
      reteachPointer: 'explanation/script[1] (2 of it went into the frame and 3 stayed outside — two different parts)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'spill-count-slip',
      description: 'Chooses the right split, then loses one counter while counting the leftovers on from ten, so the total finishes one short.',
      exampleWrongAnswer: '8 + 5 answered as 12, one short of the true total',
      distractorRationale: 'Offer the total one short of the truth.',
      reteachPointer: 'explanation/script[2] (the frame is full, so count what is left in your hand slowly)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'bridges-everything',
      description: 'Applies the bridge to every sum, including ones that finish inside the frame with boxes to spare, and reports a ten that was never reached.',
      exampleWrongAnswer: '8 + 1 worked as though a ten had to be built first',
      distractorRationale: 'Offer "both sums" where only the sum that overflows the frame needs a ten built.',
      reteachPointer: 'explanation/whyBeforeHow (the frame holds ten and not one more — a sum that fits needs no bridge)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'partner-of-ten-unsure',
      description: 'Knows the strategy but has to count the empty boxes one at a time, so the partner of ten arrives too slowly for the rest of the method to hold together.',
      exampleWrongAnswer: 'the partner of 7 given as 4',
      distractorRationale: 'Offer a partner one out from the true one, which is what counting the empty boxes hastily produces.',
      reteachPointer: 'guidedExamples/B5-GE-01 (see the empty boxes as one amount), then the 2-minute partners-of-ten sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Adding past ten by building a ten first — finding what fills a ten-frame, splitting the second number into the part that fits and the part that spills, and reading the answer as ten and some more.',
    improvingCandidates: [
      'finding the partner of ten without counting the empty boxes',
      'splitting the second number into the part that fits and the part that spills',
      'reading a finished bridge as ten and some more',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping the two parts of the split apart — the counters that go in are not the counters that stay out',
      },
      {
        errorTag: 'task-comprehension',
        text: 'noticing when a sum fits inside ten and needs no bridge at all',
      },
      {
        errorTag: 'fact-recall',
        text: 'the partners of ten, which the two-minute sprint keeps quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You split the second number to build a ten first, and then counted the leftovers on — that is exactly the move this week is built on.',
      questionForChild: 'You have 8 counters in the frame and 6 in your hand. How many go in, how many stay out, and what does that make?',
      schoolSyncHook: 'If your child\'s class says "bridging through ten" rather than "make ten", tell us and we will match the words they hear.',
    },
    vocabularyForParent: [
      'ten-frame (a box of ten spaces, in two rows of five)',
      'partner of ten (the number that fills the rest of the frame)',
      'the spill (what is left over once the frame is full)',
    ],
  },
});
