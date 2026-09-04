/**
 * Level B · Week 3 — "Comparing numbers" (conceptId: comparing-numbers).
 *
 * FILL-ARCHITECTURE §4 row B3: anchor "tens first"; multi-step "+10 then
 * compare"; error-analysis "compares by the ones digit (39 > 41)";
 * discrimination "39 vs 41"; Day-5 signature "true/false symbol sort".
 * Catalog cell: computational focus "Compare 2-digit numbers with <, >, =;
 * order three numbers"; non-computational focus "True/false comparison claims —
 * prove or fix each".
 *
 * WHAT THIS WEEK IS FOR. A two-digit number is not a pair of digits to be judged
 * side by side. It is a count of whole tens with some singles left over, and that
 * is the only reason one place can outrank another. So the week has exactly one
 * rule and it is a rule about WORTH, not about size of digit:
 *
 *     read the tens first, and only a tie hands the decision to the ones.
 *
 * Everything on the page exists to make that rule unavoidable:
 *   1. a number is DRAWN as its tens and its singles (`placeValueBar`), so "3
 *      tens and 9 singles" is something a six-year-old can see is shorter than
 *      "4 tens and 1 single" without being told;
 *   2. the ones digit is made to point the WRONG WAY on purpose. On every draw
 *      where the tens settle the comparison, the number with MORE ones is the
 *      smaller number — the recipe's own 39-vs-41 — so a child reading ones is
 *      wrong every single time rather than wrong half the time;
 *   3. and the tie case is drawn just as often, because a rule with no exception
 *      is a rule nobody has to think about. Half of every pair here shares its
 *      tens, and then the ones DO decide. That is what makes "will the tens
 *      settle it?" a real question and the week's metacognition probe.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OWNERSHIP — this is an EARLY week, so almost everything downstream depends on
 * what is settled here. Stated rather than assumed (kit §E2.8).
 *
 * B3 OWNS (introduces AND assesses):
 *   · comparing two two-digit numbers by place — tens first, ones only on a tie;
 *   · the words **greater** and **less**, and the signs **>**, **<**, **=** —
 *     which sign makes a sentence true, and which way the open end faces. The
 *     catalog cell grants the three signs by name, and c01 retrieves exactly this
 *     skill from B3 (`asWarmup(compareWhole(2), B3)`), so it has to be TAUGHT
 *     here, not assumed;
 *   · ordering three two-digit numbers, least first;
 *   · the COMPARISON sense of "between" — the number that is greater than one
 *     number and less than another. b12 retrieves this from B3 by name
 *     (`number_between_v1`, "which number sits between 47 and 49"), so `sitBetween`
 *     teaches it on the same registered template;
 *   · the two misreadings that make comparison hard at this age, both held up
 *     for rejection: the ones digit deciding on its own, and the tens deciding
 *     on their own (matching tens read as "the same number").
 *
 * B3 USES BUT DOES NOT TEACH (prior skills appearing inside a chain, all
 * `usesPriorSkill`):
 *   · **B2 — tens and ones.** Every number here is read as tens and singles and
 *     no page teaches how to build one. B2 is the warm-up and the sprint, which
 *     is where a settled skill belongs;
 *   · **B1 — the number path in rows of ten, and its "+10" step.** Both
 *     multi-step chains move a count on by one whole ten and then by a few
 *     singles, which is B1's own chart chain (47 → +10 → +1) doing the
 *     arithmetic while the COMPARISON does the thinking. B1 is the second
 *     warm-up format;
 *   · **A22 — counting in tens**, the fact that makes a ten worth ten. Third
 *     warm-up format.
 *
 * B3 DELIBERATELY LEAVES TO A LATER WEEK THAT ALREADY OWNS IT:
 *   1. **B4 owns counting on and back**, and its discrimination is "on vs back
 *      FROM THE STORY". So no page here asks the child to decide a direction from
 *      the words: every change in this week arrives ("ten more go on"), and the
 *      one wrong-direction slip on the page is inside the Day-5 error-analysis,
 *      where the child's job is to notice a stated result, not to choose a move.
 *   2. **B6 owns the equal sign as a balance** ("= means the answer comes next").
 *      `=` appears here only between two whole numbers that are the same number,
 *      never with an addition on either side, and nothing in this pack argues
 *      about what may stand to the right of it.
 *   3. **B10 owns adding tens** (40 + 30) and **B11 owns two-digit + one-digit
 *      across a ten** (38 + 6). Both chains here add exactly ONE ten, and every
 *      singles step is bounded so it never crosses a ten — `k ≤ 9 − (ones digit)`
 *      by construction, so no page can turn into either week's lesson.
 *   4. **B14 owns two-digit subtraction and B15 owns "how many more".** This week
 *      never measures a gap. It says which count is greater, not by how much: no
 *      difference is asked for anywhere, no comparison bar model is drawn, and the
 *      words "how many more" do not appear.
 *   5. **B19 owns the other ones-digit trap** ("15 is even, it ends in a 5's
 *      count"). The ones digit is unreliable here for SIZE only; parity is never
 *      mentioned.
 *   6. **B23 owns "tallest vs asked-for" and B16 owns "more coins ≠ more money".**
 *      Both are cousins of this week's trap wearing a different display. No graph
 *      and no coin appears in this pack.
 *   7. **C1 owns three-digit place value ("face vs value") and C2 owns rounding
 *      and ordering with a hundreds column.** Every number here is two digits, so
 *      a column with nothing in it — C1's whole point — cannot arise. c02 also
 *      owns `order_three_v1` at its own band; this week's ordering item is at two
 *      digits, in its own frame and its own voice, and pins the tie inside a
 *      shared ten rather than inside a shared hundred.
 *
 * WHICH SYMBOLS A CHILD MAY SEE HERE, exhaustively: `>`, `<` and `=`, all three
 * granted by name in the B3 catalog cell, and nothing else. No `×`, no `÷` and no
 * `n/d` — the B3 row grants none of those, they belong to C6, C9 and C15, and the
 * arithmetic on these pages is entirely adding, written out as moves the child
 * makes in order rather than as an expression. (b19 onward each state this for
 * their own row; it is stated again rather than inherited.)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠ VERIFY-LIBRARY LIMIT, AND THE IMPOSSIBILITY PROVED FIRST (kit §E2.3;
 * LEARNINGS L34/L36 — "prove X is impossible BEFORE reaching for the escape
 * hatch", because seven weeks in a row reached for it and then C4 found the
 * identity).
 *
 * THE RECIPE'S MISCONCEPTION IS A SELECTION, NOT A COMPUTATION, and that is what
 * defeats the library. Asked "which of 39 and 41 is greater?", a child comparing
 * ones digits answers **39** — one of the two numbers it was handed. The value is
 * not a function of an operand pair under some other operation; it is the same
 * quantity read under a different RULE. Every registered transform that returns a
 * `wrong` at all varies something else:
 *   · `d_verify_binop_misconception_v1` — the only whole-number two-valued
 *     transform: it varies the OPERATION over one fixed operand pair. To get
 *     {correct: A, wrong: B} out of it you must solve `x ∘ y = A` and
 *     `x ∘' y = B`; over {+, −} the unique integer solution is
 *     `(x, y) = ((A+B)/2, (A−B)/2)` and over the other op pairs there is
 *     generically none. For 41 and 39 that is (40, 1) — a pair with no referent
 *     in the story, whose named misconception would be "subtracted instead of
 *     adding". The two numbers would be right and the mechanism would be a
 *     fiction: exactly the fabrication §E2.3 forbids, with extra steps.
 *   · `e_verify_int_compare_v1` is the library's ONE comparison-misconception
 *     transform ("−8 > −3 because 8 > 3"), and it is a STRUCTURAL NULL at Level
 *     B: it keys `wrong` to the larger magnitude, and for positive a, b the
 *     larger magnitude IS the larger number, so its own guard
 *     (`wrong === correct` ⇒ throw) fires on every draw a two-digit week could
 *     make. Worth recording — the transform reads as if it were built for this.
 *   · `d_verify_frac_v1` / `d_verify_dec_v1` need fraction or decimal operands
 *     (both notations banned at this band); `e_verify_int_addsub_v1`,
 *     `e_verify_int_mul_v1` and `e_verify_point_v1` are signed-arithmetic and
 *     coordinate transforms; `a_verify_count_slip_v1` and
 *     `a_verify_countback_slip_v1` return n ± 1; `a_verify_teen_write_v1`
 *     reverses the digits of ONE number (B1/B2's misconception, not this one);
 *     `clock_verify_time_v1`, `money_verify_coin_total_v1` and the four
 *     `stat_verify_*` transforms are all family-specific. Every remaining
 *     verify in the registry — including `a_compare_sets_v1`, `a_pick_extreme_v1`
 *     and `e_int_compare_symbol_v1`, the three that DO model a comparison — is
 *     correct-only and so cannot serve `errorAnalysis` at all.
 * The digit-sum reading of the same slip (39 → 3 + 9 = 12) was checked too and is
 * no better: `correct = 10t + o` and `wrong = t + o` have no common operand pair
 * either, except at the single degenerate point t = o = 5.
 *
 * SO THE MISCONCEPTION IS RELOCATED, per §E2.3's third option, and it is
 * relocated to FOUR surfaces rather than one — it is the week's whole content, so
 * it had better be everywhere except the one place it cannot be honest:
 *   · `discOnesTrap` — three counts, and the count holding the extreme ONES digit
 *     is never the answer. Pinned by `a_pick_extreme_v1`, so the keyed option is
 *     recomputed from the counts themselves (kit §F.1 / QG-11);
 *   · `discSymbol` — the `=` option is exactly the complementary slip (the tens
 *     matched, so the numbers were called the same), and it is genuinely correct
 *     on a third of draws. Pinned by `e_int_compare_symbol_v1`, which recomputes
 *     the true sign from the two operands;
 *   · `asnMoreOnes` — the claim itself, given a hearing: "the number with more
 *     ones is the greater number" is SOMETIMES true, and saying when is the
 *     week's rule stated by the child instead of by the page;
 *   · the mistakeBank, whose first entry is the misconception by name so the
 *     reteach path exists even though no generated item can show its value.
 *
 * AND DAY 5 GETS THE COMPLEMENTARY SLIP THAT IS DERIVABLE, as §E2.3 requires.
 * `eaTenTheWrongWay` uses `d_verify_binop_misconception_v1` with
 * `{a: startCount, b: 10, op: '+', wrongOp: '-'}`: `correct` is the count after
 * ten arrive and `wrong` is the count if the ten went the other way. Both are
 * code-derived from the item's own operands and the op-swap IS the named slip, so
 * nothing is invented. It is a comparison item and not a counting one, because
 * the draw guarantees `a < other < a + 10`: under the slip the other tray really
 * does hold more, and after the fix it really does not. Fixing the arithmetic
 * FLIPS the comparison, which is the only reason the slip is worth an error
 * analysis in this week rather than in B4's.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GUESSABILITY, MEASURED NOT ASSUMED (kit §E2.11 — and a comparison week is the
 * hardest case, because a comparison item keys the extreme BY DEFINITION and no
 * distractor can ever overshoot it: on "which count is greatest?" every other
 * option is smaller, necessarily. The gate knows this and exempts the shape; that
 * exemption is not what this week relies on).
 *   · **THE ASK ROTATES, so the relation rotates with it** (L39: rotate the
 *     relation, not just the numbers). `discOnesTrap` asks for the GREATEST on
 *     half its draws and the LEAST on the other half, so the keyed option is the
 *     largest number on offer about half the time and the smallest about half the
 *     time — "pick the biggest" is a coin flip rather than a strategy, and on the
 *     "least" draws both distractors OVERSHOOT the answer. Measured over 240
 *     day-slot draws and 160 mastery draws: see the numbers in the report.
 *   · **NO DEAD OPTION.** `discSymbol` offers `>`, `<` and `=` on every single
 *     draw, so `=` had to be reachable or a child would learn to strike it out
 *     (the b05/b13/D1 defect). The RELATION is therefore drawn FIRST, one of
 *     three, and the two numbers are built to satisfy it — equal numbers on a
 *     third of draws. Nothing here is offered-always and keyed-never, so
 *     `DECLARED_LURES` needed no new entry.
 *   · **NO ORDINAL TELL.** Every option on both discriminations is a numeral or a
 *     sign, so there is no "second thing named" to key; the three counts are
 *     shuffled into the prompt independently of their order by size.
 *   · **NO CONSTANT ANSWER OR POSITION.** Both discriminations draw fresh
 *     operands per seed and `makeChoices` shuffles.
 *   The ASN claim's answer is fixed at "sometimes" — that is a fact about the
 *   claim, not a draw — and it lives in a Day-5 teaching slot, never in mastery,
 *   which is the distinction the gate itself draws (L42).
 *
 * THE METACOGNITION PROBE, AND ITS MEASURED SPLIT (kit §E2.9, LEARNINGS L41 —
 * b16's probe was right 70% of the time for a child who always said "more", and
 * no gate can see that because a probe has no answer key). The probe is
 * **"will the tens settle it?"** — five words, well inside the seven-word budget
 * the shared lead-in leaves. Its answer is a coin flip BY CONSTRUCTION and not by
 * luck: `drawPair` takes `tensSettle` as an argument and the caller draws that
 * side FIRST, so exactly half of all pairs have different tens (the tens settle
 * it) and half share their tens (the ones decide). The measured split is in the
 * report. The probe is also the week's rule turned into a question, which is why
 * it is worth asking at all: a child who answers it has already decided which
 * place to read.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5 / L33 — "the most dangerous figure
 * is not a wrong one, it is a helpful one"). A comparison week is the sharpest
 * case of that law, because **any faithful picture of BOTH numbers to one scale
 * performs the comparison the item is assessing.** So:
 *   1. **WHERE A FIGURE APPEARS AT ALL IT DRAWS EXACTLY ONE NUMBER**, and it is
 *      always the FIRST one named — a choice that carries no information about
 *      which number is greater. The bar shows that number's tens as long blocks
 *      and its singles as small ones, which MODELS the anchor (a number is tens,
 *      then leftovers) without settling anything. Each one asserts `param:first`
 *      or `param:a` — a quantity the item was handed, never one it asks for. Four
 *      generators carry one: both discriminations, the ordering item and the
 *      Day-5 error analysis, so every working day of the week shows a picture.
 *   2. **BOTH BARS ARE DRAWN ONLY WHERE THE ANSWER IS ALREADY ON THE PAGE** —
 *      the lesson script and the guided examples. Even there the shared
 *      `scaleMax` is honest rather than helpful: 63 against 68 differ by five
 *      hundredths of the width, so the picture states the two numbers and still
 *      leaves the reading to be done.
 *   3. **THREE THINGS ARE DELIBERATELY NOT DRAWN.** Neither multi-step carries a
 *      figure: `multiStep` owns its params, so the only number a picture could
 *      rebuild from them is `initN` — the count the COMPARISON selected — and
 *      drawing it would announce which pile was the fuller one, i.e. would answer
 *      the first of the two steps. Drawing the other count instead would announce
 *      it just as loudly by elimination, so there is no honest picture for either
 *      item and they have none. `sitBetween` HAD one and lost it on reading: a bar
 *      for the lower card plus one single block is the answer, so the picture
 *      turned the item into adding a block to a drawing. And the puzzle is
 *      undrawn, because a picture of the smudged tin's count is the puzzle.
 *   4. Nothing is marked, ringed, paired or hatched anywhere in the pack: no
 *      `showPairs`, no `markExtra`, no crossed-out run. The one-to-one match is
 *      A5's tool and this week's numbers are far past what it can carry.
 *
 * ACCESSIBILITY, DISCLOSED. A bar's accessible name pairs the number with the way
 * it is built ("a bar for 39, built from 3 ten-blocks and 9 single blocks"), which
 * is the same given a sighted child reads off the picture — the tens and the
 * singles, not which number is greater. A screen-reader child therefore does the
 * identical work.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1). Sentence length is
 * measured rather than eyeballed and comes in at 0.00% over the fifteen-word
 * ceiling. `tens`, `ones`, `greater`, `less` and `the same` are all glossed in
 * `explanation.vocabulary`, and no item uses one of them before it has been.
 * Metacognition takes its intro form: a prediction committed to before any working
 * happens. The error analysis wants one sentence back, not a paragraph. The sprint
 * is ungraded and self-referenced. And no prompt contains a gendered pronoun,
 * because every name on every page is drawn.
 *
 * FRAMES, re-checked against the whole weeks directory at the END of the build
 * (kit §E2.8) with plain substring greps: the collectors'-club things —
 * `chestnuts`, `sequins`, `buckles`, `apricots`, `thimbles` — return zero or one
 * incidental hit across every authored week, and each singularises correctly
 * through `format.ts` (checked, not assumed). The containers (`tray`, `tin`,
 * `bag`, `pile`, `shelf`) are ordinary corpus furniture and are used as furniture,
 * never as the thing being counted. b05 owns feathers/ladybirds/twigs and
 * daisies/buttercups/poppies; c02 owns ladybirds and door numbers; b13 owns number
 * cards and b16 craft sticks — none of those appears here.
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswerOf, assertsParam, barModel, hundredChart } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A22 = { level: 'A' as const, week: 22 };
const B1 = { level: 'B' as const, week: 1 };
const B2 = { level: 'B' as const, week: 2 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so nobody ever compares their own count with itself. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/**
 * WHAT THE CLUB COUNTS.
 *
 * Small, countable, collectable things that a child can plausibly own forty or
 * eighty of, drawn fresh against the corpus (see the header). One flat pool
 * rather than one pool per register: the week's variety has to come from the
 * NUMBERS and from what is being asked of them, and a page that changed its
 * world as well would spend a six-year-old's attention on the world.
 */
const THINGS = ['chestnuts', 'sequins', 'buckles', 'apricots', 'thimbles'] as const;

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

/** "39, 45 and 51" — three counts read out the way they are printed. */
const listOf = (ns: readonly number[]): string =>
  `${ns.slice(0, -1).map(fmtInt).join(', ')} and ${fmtInt(ns[ns.length - 1])}`;

// ---------------------------------------------------------------------------
// The pair draw — the one place the week's mathematics is decided
// ---------------------------------------------------------------------------

interface Pair {
  a: number;
  b: number;
}

/**
 * Two two-digit numbers whose ORDER is fixed in advance, so nothing about the
 * comparison is left to luck.
 *
 * `aIsBigger` says which way round they come out. `tensSettle` says which of the
 * week's two cases this draw is:
 *   · TRUE  — the tens differ, AND the ones are then made to point the WRONG way
 *             (the bigger number carries the smaller ones digit). This is the
 *             recipe's 39-vs-41, generated rather than quoted;
 *   · FALSE — the tens are equal, so the ones genuinely decide. Half the draws,
 *             because a rule whose exception never turns up is a rule nobody has
 *             to think about — and because the metacognition probe asks exactly
 *             this and must be a coin flip (L41).
 *
 * Bounds, all computed so every draw is legal on its first attempt — no redraw
 * loop, which would consume a variable number of rng draws and unpick
 * seed-stability for every later item in the pack (kit §E2.4):
 *   · the tens of the first number run 3–6 and shift by at most 2, so no number
 *     ever falls below ten or above 89 and neither chain can pass 99;
 *   · the ones cap at 7, which leaves room for the multi-step singles step to add
 *     at least two more without crossing a ten (B11's territory, not this week's).
 * Four draws are taken on every path, whichever way the two flags fall.
 */
function drawPair(r: Rng, aIsBigger: boolean, tensSettle: boolean): Pair {
  const tA = r.int(3, 6);
  const oA = r.int(1, 5);
  const dTens = r.int(1, 2);
  // Where the ones sit. When the tens settle it the ones must MISLEAD, so the
  // number that ends up smaller is the one carrying more ones; when the tens tie
  // the ones must AGREE with the answer, because they are the answer.
  const bMoreOnes = tensSettle ? aIsBigger : !aIsBigger;
  const oB = bMoreOnes ? r.int(oA + 1, 7) : r.int(0, oA - 1);
  const tB = tensSettle ? (aIsBigger ? tA - dTens : tA + dTens) : tA;
  return { a: 10 * tA + oA, b: 10 * tB + oB };
}

// ---------------------------------------------------------------------------
// The picture — one number, built from its tens and its singles
// ---------------------------------------------------------------------------

/** One bar: the tens as long blocks, the leftovers as single ones. */
const barOf = (n: number) => ({
  label: fmtInt(n),
  segments: [
    ...Array.from({ length: Math.floor(n / 10) }, () => ({ value: 10, fill: 'solid' as const })),
    ...Array.from({ length: n % 10 }, () => ({ value: 1, fill: 'soft' as const })),
  ],
});

/**
 * What a sighted child reads off the bar: how the number is BUILT, never which
 * number is greater. A count with no leftovers says so in words rather than
 * printing "0 single blocks", which is not something anyone says.
 */
const barAlt = (n: number): string => {
  const singles = n % 10;
  const tail = singles === 0 ? 'no single blocks' : countNoun(singles, 'single blocks');
  return `a bar for ${fmtInt(n)}, built from ${countNoun(Math.floor(n / 10), 'ten-blocks')} and ${tail}`;
};

/** ONE number, drawn. The only figure any assessed item in this pack carries. */
const placeValueBar = (n: number, asserts?: BBFigure['asserts']): BBFigure =>
  barModel([barOf(n)], { alt: barAlt(n), ...(asserts ? { asserts } : {}) });

/**
 * TWO numbers to one shared scale — the lesson and the guided examples ONLY, and
 * never an assessed item (header, figure law 2). The shared `scaleMax` is what
 * makes a bar model mean anything, and it is also what makes this picture
 * unusable on a page that asks which number is greater.
 */
const twoBars = (x: number, y: number, alt: string, asserts?: BBFigure['asserts']): BBFigure =>
  barModel([barOf(x), barOf(y)], {
    scaleMax: Math.max(x, y),
    alt,
    ...(asserts ? { asserts } : {}),
  });

// ---------------------------------------------------------------------------
// Decorators — a picture, or a pinned truth, built from the item's OWN values
//
// Nothing in `lib/` may be edited and none of the shipped primitives has a figure
// slot, so a week that wants pictures decorates the draft after the fact. Two
// constraints make that safe, and both are copied from how `withEstimateFirst`
// behaves rather than from its wording: the decorator takes NO rng draw of its
// own, and it leaves `prompt` exactly as the guard first saw it — so the QG-1 and
// QG-4 signatures registered for this item still describe it.
//
// `withFigure` reads the drafted item's `generator.params` and builds the picture
// out of those, which is the whole trick: a figure whose only input is the numbers
// the answer was computed from has nothing left to disagree with.
//
// `withPin` exists because there is one case `withFigure` cannot reach. A
// `discrimination()` draft carries no `generator` field of any kind, so there are
// no params to read and — worse — no truth for QG-11 to recompute. The fix is a
// single mutable slot: the draw writes what it drew, `withPin` immediately reads
// it back and attaches it as the spec, and the keyed option is under audit from
// then on. Reading it immediately is what makes it safe. `drawUniqueItem` is free
// to run the draw several times over, and the value left in the slot always
// belongs to the run whose draft it returned.
// ---------------------------------------------------------------------------

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface Pin {
  params: Params;
  seed: number;
}

function pinSlot(): { last: Pin | null } {
  return { last: null };
}

/** Give a choice item the generator spec that lets QG-11 recompute its claim. */
function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = box.last;
    if (!pin) throw new Error('b03/withPin: the draw posted nothing to pin the claim on');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
//
// Three formats, and each one is a piece of machinery this week runs on rather
// than a general revision of last week:
//   B2 hands over "how many whole tens", which is the first thing every page here
//   reads; B1 hands over the step of one whole ten, which is the arithmetic both
//   chains do once the comparison has chosen where to start; A22 hands over the
//   fact underneath all of it — a ten is worth ten, so one ten outranks nine
//   singles.
// ---------------------------------------------------------------------------

/** B2 — how many whole tens a two-digit number holds. */
const wTensOnLabel = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'pv-decompose',
    draw: (r) => {
      const n = r.int(21, 89);
      const thing = r.pick(THINGS);
      return {
        // "writes 39 thimbles on a label" was the first draft, and it says she
        // writes the thimbles. A label carries a NUMBER.
        prompt: `The label on a tin of ${thing} reads ${fmtInt(n)}. How many tens does that number have?`,
        answerValue: String(Math.floor(n / 10)),
        templateId: 'tens_ones_decompose_v1',
        params: { n },
        units: 'tens',
        hints: [
          'How many single things does one whole ten swallow up?',
          'The left-hand digit counts the whole tens. The right-hand one counts leftovers.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  B2,
);

/**
 * THE CHART THIS ITEM TALKS ABOUT, DRAWN (2026-08-31).
 *
 * The prompt says "a number path written in rows of ten" and asks what one step
 * straight DOWN lands on. That sentence names a shape, and until now nothing
 * drew it: a child who does not already picture the grid cannot tell what a
 * "row" is, let alone step down one. Reported by the owner's son on his own Day
 * 2, and it is the same class the `hundredChart` primitive was built for — its
 * docstring records twenty-six such items found by the same child a fortnight
 * earlier. B1 (where this is taught) and B10 (which retrieves it exactly as this
 * week does) both draw the chart; this warm-up was the one that was missed.
 *
 * Measured across the corpus at the time of the fix: core items carrying a
 * spatial chart reference were 88% drawn, retrieval warm-ups only 39% — the
 * unevenness is what says this is drift rather than a decision.
 *
 * THE LANDING ROW IS LEFT BLANK, which is the whole difference between a chart
 * that teaches and one that answers (`hundredChart`'s `blank`, L33). The child
 * sees ten to a row and a column standing under its neighbour — the structure
 * the reasoning needs — and still has to know that one row down is one whole ten
 * on. The start `n` is drawn 23-79 and the landing is `n + 10`, so the two are
 * always exactly one row apart and blanking the landing's row can never rub out
 * the number the prompt prints.
 */
const CHART_ALT = 'a hundred chart in rows of ten, with the row the step lands in left empty';

function chartRowOf(v: number): number[] {
  const first = Math.floor((v - 1) / 10) * 10 + 1;
  return Array.from({ length: 10 }, (_, i) => first + i);
}

// (`withFigure` is defined above with the pin helpers — it attaches a picture
// built from the item's own params, takes no rng draw, and so leaves every
// other item in the pack exactly where it was.)

/** B1 — one step down a path written in rows of ten, which is one whole ten on. */
const wStepDownARow = withFigure(
  asWarmup(
    situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'chart-step-down',
    draw: (r) => {
      const n = r.int(23, 79);
      const name = one(r);
      return {
        prompt: `A number path is written in rows of ten. ${name} stands on ${fmtInt(n)} and steps straight down one row. Which number does that step land on?`,
        answerValue: String(n + 10),
        templateId: 'chart_below_v1',
        params: { n },
        hints: [
          'How many numbers sit in one whole row of this path?',
          'Keep the last digit still, and count on one whole ten.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
        };
      },
    }),
    B1,
  ),
  (p) => hundredChart({ blank: chartRowOf(Number(p.n) + 10), alt: CHART_ALT }),
);

/** A22 — counting in tens, the fact that makes one ten outrank nine singles. */
const wBagsOfTen = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'count-tens',
    draw: (r) => {
      const bags = r.int(3, 8);
      const name = one(r);
      const thing = r.pick(THINGS);
      return {
        prompt: `Every full bag holds ten ${thing}. ${name} fills ${countNoun(bags, 'bags')}. How many ${thing} is that?`,
        answerValue: String(10 * bags),
        templateId: 'a_count_tens_v1',
        params: { k: bags },
        units: thing,
        hints: [
          'What does one whole bag hold?',
          'Say the tens out loud as you close each bag.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  A22,
);

// ---------------------------------------------------------------------------
// The anchor form — which sign makes the sentence true
//
// The catalog names the three signs, and c01 retrieves this exact skill from B3,
// so it is the form the week is built around and it opens Day 1.
//
// THE RELATION IS DRAWN FIRST. `>`, `<` and `=` are on the page every single
// time, so if `=` were never the answer a child would learn to strike it out and
// a three-way page would collapse to a coin flip (the b05/b13/D1 defect, kit
// §E2.11). Drawing the relation before the numbers makes each of the three the
// answer on about a third of draws, and it makes the `=` DISTRACTOR honest on the
// other two thirds: it is offered because "the tens matched, so the numbers
// matched" is a real child's reading, and half of all unequal pairs here do share
// their tens.
//
// The truth is recomputed by `e_int_compare_symbol_v1` from the two operands
// (kit §F.1 / QG-11), so a keyed sign that does not follow from the numbers is
// structurally impossible. It is an integers-family id, and that is deliberate
// rather than careless: it is the ONLY registered transform that recomputes a
// comparison SYMBOL from two operands, its arithmetic is sign-agnostic (a
// whole-number compare over denominator one), and Level B's own families register
// no compare-symbol truth at all — `compare_symbol_choice_v1` and
// `d_pv_compare_v1` are both registered with no `answerFor` and no `verifyFor`,
// so pinning to either would leave the claim unaudited.
//
// The figure draws the FIRST number only. Drawing both to one scale would settle
// the item (header, figure law 1).
// ---------------------------------------------------------------------------

const signBox = pinSlot();

const discSymbol = withFigure(
  withPin(
    signBox,
    'e_int_compare_symbol_v1',
    discrimination({
      variant: 'structural',
      cognitiveOp: 'choose-the-sign',
      draw: (r) => {
        const rel = r.int(0, 2);
        const tensSettle = r.chance(0.5);
        const pair = drawPair(r, rel === 0, tensSettle);
        const a = pair.a;
        // On an `=` draw the same number is written twice, which is the only
        // honest way to make that sign true. The pair draw still runs, so the
        // stream lands in the same place whichever relation came up.
        const b = rel === 2 ? pair.a : pair.b;
        const correct = rel === 0 ? '>' : rel === 1 ? '<' : '=';
        signBox.last = { params: { a, b, first: a }, seed: r.uint() };
        const distractors =
          rel === 2
            ? [
              {
                text: '>',
                errorTag: 'concept-misconception' as const,
                rationale: 'Expects the number written first to be the larger one, so a matching pair is never looked for.',
              },
              {
                text: '<',
                errorTag: 'representation-misread' as const,
                rationale: 'Expects the number written second to be the larger one, so a matching pair is never looked for.',
              },
            ]
            : [
              {
                text: rel === 0 ? '<' : '>',
                errorTag: 'representation-misread' as const,
                rationale: 'The sign is turned the wrong way round, so its open end faces the smaller number.',
              },
              {
                text: '=',
                errorTag: 'concept-misconception' as const,
                rationale: 'Stops as soon as the tens have been read, so two counts with matching tens are called the same.',
              },
            ];
        return {
          prompt: `A sign is missing from this sentence: ${fmtInt(a)} __ ${fmtInt(b)}. Which sign makes it true?`,
          correct,
          distractors,
          hints: [
            'Which of the two counts holds more whole tens?',
            'Decide which count is greater. Then point the open end at it.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        };
      },
    }),
  ),
  (p) => placeValueBar(numOf(p, 'first'), assertsParam('first', 'bar:0')),
);

// ---------------------------------------------------------------------------
// THE RECIPE'S DISCRIMINATION — 39 vs 41, generated
//
// Three counts with three DIFFERENT tens, so the tens settle the order outright;
// and three different ones digits arranged so that the count carrying the extreme
// ones digit is never the count the question wants. A child reading ones is
// therefore wrong on every draw, which is what makes this a trap rather than a
// coin flip.
//
// WHICH END IS ASKED FOR ROTATES (kit §E2.11, L39). Pinning it to "the greatest"
// would make the keyed option the largest number on offer every time, and a child
// who has met the page twice could pass it on that alone. Asking for the LEAST on
// half the draws also puts the only overshooting distractors this week can
// honestly carry on the page: on those draws both wrong options are BIGGER than
// the answer.
//
// The truth is recomputed by `a_pick_extreme_v1` from the counts and the asked
// end, so the keyed option is re-derived rather than trusted.
// ---------------------------------------------------------------------------

/**
 * Which ones digit each count gets, indexed by the count's rank in SIZE
 * (0 = smallest, 2 = largest) and holding the index into a sorted trio of ones
 * digits (0 = smallest ones digit). Only arrangements where the asked-for end
 * does NOT also carry the extreme ones digit are legal, so the two lists differ:
 * asking for the greatest forbids the biggest ones digit from the biggest count,
 * and asking for the least forbids the smallest ones digit from the smallest
 * count. Three arrangements survive either way, so one draw is taken on both
 * paths and the stream stays put.
 */
const ONES_BY_SIZE_GREATEST = [
  [2, 0, 1],
  [0, 2, 1],
  [1, 2, 0],
] as const;
const ONES_BY_SIZE_LEAST = [
  [1, 0, 2],
  [2, 0, 1],
  [1, 2, 0],
] as const;

const extremeBox = pinSlot();

const discOnesTrap = withFigure(
  withPin(
    extremeBox,
    'a_pick_extreme_v1',
    discrimination({
      variant: 'structural',
      cognitiveOp: 'choose-the-extreme',
      draw: (r) => {
        const askGreatest = r.chance(0.5);
        const thing = r.pick(THINGS);
        const tens = r.shuffle([3, 4, 5, 6, 7]).slice(0, 3).sort((x, y) => x - y);
        const ones = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y);
        const table = askGreatest ? ONES_BY_SIZE_GREATEST : ONES_BY_SIZE_LEAST;
        const bySize = table[r.int(0, 2)].map((oi, i) => 10 * tens[i] + ones[oi]);
        const answer = askGreatest ? bySize[2] : bySize[0];
        // The count a ones-only reader picks: most ones when the greatest is
        // wanted, fewest when the least is wanted. Never the answer, by the
        // arrangement tables above.
        const onesPick = bySize.reduce((best, n) =>
          (askGreatest ? n % 10 > best % 10 : n % 10 < best % 10) ? n : best,
        );
        const other = bySize.find((n) => n !== answer && n !== onesPick)!;
        const shown = r.shuffle([...bySize]);
        extremeBox.last = {
          params: {
            first: shown[0],
            counts: shown,
            nouns: shown.map((n) => String(n)),
            which: askGreatest ? 'biggest' : 'smallest',
          },
          seed: r.uint(),
        };
        return {
          prompt: `Three piles of ${thing} are counted: ${listOf(shown)}. Which count is the ${askGreatest ? 'greatest' : 'least'}?`,
          correct: String(answer),
          distractors: [
            {
              text: String(onesPick),
              errorTag: 'concept-misconception' as const,
              rationale: `Lets the ones digit decide on its own, so the count with the ${askGreatest ? 'most' : 'fewest'} ones is taken and the whole tens are never weighed.`,
            },
            {
              text: String(other),
              errorTag: 'task-comprehension' as const,
              rationale: 'Settles on a winner after reading only two of the three counts, so the third never gets a hearing.',
            },
          ],
          hints: [
            'Can a large ones digit hide inside a small count?',
            'Sort the three by their whole tens. Read the ones only for a tie.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        };
      },
    }),
  ),
  (p) => placeValueBar(numOf(p, 'first'), assertsParam('first', 'bar:0')),
);

// ---------------------------------------------------------------------------
// Ordering, and the number that sits between two others
//
// Both are B3's own ground and both are named by a later week that retrieves
// them: the catalog cell asks for "order three numbers", and b12 pulls
// `number_between_v1` back out of B3 to talk about the short hand sitting between
// two hours. So "between" here is the COMPARISON sense — greater than one number
// and less than another — and it is taught on the same registered template b12
// retrieves.
//
// The ordering item always puts TWO of its three counts inside one ten, so the
// tens narrow it down and then have to hand over: it is the tie case with a third
// number standing beside it. The figure draws the first count named, which is the
// count the child was handed and says nothing about the order.
// ---------------------------------------------------------------------------

const sitOrderThree = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'order-three-two-digit',
    draw: (r) => {
      const thing = r.pick(THINGS);
      const shared = r.int(3, 7);
      const dTens = r.int(1, 2);
      const apart = r.chance(0.5) ? shared - dTens : shared + dTens;
      const [o1, o2] = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2);
      const o3 = r.int(0, 9);
      const shown = r.shuffle([10 * shared + o1, 10 * shared + o2, 10 * apart + o3]);
      const sorted = [...shown].sort((x, y) => x - y);
      return {
        prompt: `The club table holds three tins of ${thing}. The counts are ${listOf(shown)}. Line the three counts up, least first.`,
        answerValue: sorted.join(', '),
        templateId: 'order_three_v1',
        params: { a: shown[0], b: shown[1], c: shown[2], first: shown[0] },
        validation: 'ordered-list',
        acceptableForms: [sorted.join(' ')],
        hints: [
          // "Which two are closest together?" was the first draft and it is not
          // always TRUE: with 50, 59 and 60 on the page the closest pair is 59
          // and 60, not the pair inside the shared ten. Asking about the tens
          // digit is answerable on every draw by construction.
          'Do any two of these counts share their tens digit?',
          'Start from the smallest ten and work up. A shared ten goes to the ones.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) => placeValueBar(numOf(p, 'first'), assertsParam('first', 'bar:0')),
);

/**
 * NO FIGURE, and this one was drawn first and then taken away — the L33 test
 * ("what does this picture let the child skip?") failed it on reading. A bar for
 * the lower card shows that count as its tens and its singles, and the answer is
 * that count plus one single block: the picture turns the whole item into adding
 * one block to a drawing. The item is short enough to hold in the head, which is
 * where "between" has to live before it can be used on a clock face.
 */
const sitBetween = situation({
  situationType: 'comparison',
  cognitiveOp: 'number-between',
  draw: (r) => {
    const a = r.int(24, 87);
    return {
      prompt: `Number cards hang in order along a line. One card has slipped off from between ${fmtInt(a)} and ${fmtInt(a + 2)}. What number was on it?`,
      answerValue: String(a + 1),
      templateId: 'number_between_v1',
      params: { a },
      hints: [
        'Which of the two cards left on the line comes first?',
        'Stand on the smaller card and take one single step forward.',
      ],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form, a call made before any working
//
// The probe is the week's rule turned into a question: **will the tens settle
// it?** A child who answers it has already decided which place to read, which is
// the whole of B3.
//
// ITS ANSWER IS A COIN FLIP BY CONSTRUCTION, not by luck. `tensSettle` is drawn
// FIRST and handed to `drawPair`, so exactly half of all pairs have different
// tens and half share them. That is the fix LEARNINGS L41 records after b16
// shipped a probe a child could be right about 70% of the time by always
// answering one way — and no gate can catch it, because a probe has no answer
// key.
//
// The probe is deliberately short. `metacog.ts` supplies its own lead-in, and a
// probe over seven words puts the combined sentence past the Level-B ceiling
// however carefully the rest of the pack is written (kit §E2.9). This one is
// five.
//
// The base is served through the wrapper on every DAILY page (kit §E2.2 — a
// generator offered raw as well would ship two identical hint ladders and spend
// two of the three the dedup allows on one idea). It appears raw exactly once, in
// mastery, which the ladder dedup exempts and where a scaffold does not belong: a
// check that hands the child the strategy is not checking the strategy.
// ---------------------------------------------------------------------------

const sitCompareTwoDigit = withFigure(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare-two-digit',
    draw: (r) => {
      const tensSettle = r.chance(0.5);
      const askGreater = r.chance(0.5);
      const pair = drawPair(r, r.chance(0.5), tensSettle);
      const [first, second] = two(r);
      const thing = r.pick(THINGS);
      const answer = askGreater ? Math.max(pair.a, pair.b) : Math.min(pair.a, pair.b);
      return {
        prompt: `${first} counts ${countNoun(pair.a, thing)}. ${second} counts ${countNoun(pair.b, thing)}. Write the ${askGreater ? 'greater' : 'smaller'} count.`,
        answerValue: String(answer),
        templateId: 'a_pick_extreme_v1',
        params: {
          counts: [pair.a, pair.b],
          nouns: [String(pair.a), String(pair.b)],
          which: askGreater ? 'biggest' : 'smallest',
          first: pair.a,
        },
        units: thing,
        hints: [
          'Which part of each count would you read first?',
          'Hold the two tens digits side by side. A tie passes it to the ones.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) => placeValueBar(numOf(p, 'first'), assertsParam('first', 'bar:0')),
);

const predictTensSettle = withEstimateFirst(sitCompareTwoDigit, 'will the tens settle it?');

// ---------------------------------------------------------------------------
// Multi-step — the §4 row's "+10 then compare", with the comparison FIRST
//
// The recipe's chain is a comparison and a change, and the order matters: if the
// change came first the comparison would be a garnish. Here it is the gate. The
// story says which pile the new ones go on only by DESCRIBING it — "the smaller
// pile", "the tray that holds neither the most nor the fewest" — so a child who
// compares wrongly starts the
// arithmetic from the wrong number and lands somewhere else entirely. `initN` is
// the comparison's output, which is what makes the chain genuinely two moves and
// not one move with a label on it.
//
// The two chains differ in the SELECTION, which is the week's content:
//   · TWO PILES, ONE EXTREME — and which extreme is asked for rotates, so "the
//     bigger one always changes" never becomes the cue;
//   · THREE TRAYS, THE MIDDLE ONE — which cannot be found without ordering all
//     three, and which no single comparison reaches.
// They also run their two moves in opposite orders (the ten then the singles, and
// the singles then the ten), so a child who has met one of them has learnt a plan
// rather than a sequence.
//
// WHAT THE ARITHMETIC IS BOUNDED TO, and why (see the header's scope notes):
// exactly ONE whole ten is ever added, so this is B1's chart step and not B10's
// adding-tens; and the singles step is capped at `9 − (ones digit)`, so it can
// never cross a ten, which is B11's lesson. Neither chain subtracts, so B4's
// count-back never appears.
//
// NEITHER CARRIES A FIGURE. The only number a figure could rebuild from
// `multiStep`'s params is `initN` — the count the comparison chose — so drawing
// it would answer the first step (header, figure law 3).
// ---------------------------------------------------------------------------

const msCompareThenChange = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'compare-then-change',
  usesPriorSkill: true,
  draw: (r) => {
    const tensSettle = r.chance(0.5);
    const changeBigger = r.chance(0.5);
    const pair = drawPair(r, true, tensSettle);
    const start = changeBigger ? pair.a : pair.b;
    const k = r.int(2, 9 - (start % 10));
    const [first, second] = two(r);
    const thing = r.pick(THINGS);
    const showAFirst = r.chance(0.5);
    const shownFirst = showAFirst ? pair.a : pair.b;
    const shownSecond = showAFirst ? pair.b : pair.a;
    return {
      prompt: `${first}'s pile holds ${countNoun(shownFirst, thing)}. ${second}'s pile holds ${countNoun(shownSecond, thing)}. Ten more ${thing} go on the ${changeBigger ? 'bigger' : 'smaller'} pile. Then ${fmtInt(k)} more ${thing} go on. How many ${thing} are on that pile now?`,
      initN: start,
      steps: [
        { op: 'add', n: 10, d: 1 },
        { op: 'add', n: k, d: 1 },
      ],
      units: thing,
      hints: [
        'Which pile does the story hand the new ones to?',
        'Settle the two piles first. Then count on the whole ten, then the rest.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * THREE TRAYS, AND THE ONE THAT IS NEITHER END. Three distinct tens make the
 * order decidable, so "neither the most nor the fewest" names exactly one tray
 * and the degenerate reading kit §E2.7 warns about cannot arise. The ones digits
 * cap at 7, which leaves the singles step room to add at least two without
 * crossing a ten.
 */
const msMiddleThenChange = multiStep({
  situationType: 'combine',
  cognitiveOp: 'order-then-change',
  usesPriorSkill: true,
  draw: (r) => {
    const thing = r.pick(THINGS);
    const tens = r.shuffle([3, 4, 5, 6, 7]).slice(0, 3).sort((x, y) => x - y);
    const ones = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 3);
    const bySize = tens.map((t, i) => 10 * t + ones[i]);
    const middle = bySize[1];
    const k = r.int(2, 9 - (middle % 10));
    const shown = r.shuffle([...bySize]);
    return {
      // "the middle-sized tray" was the first draft, and reading a generated page
      // killed it: with the counts printed as 30, 75 and 57 the tray holding 75
      // is the one printed in the middle, so a seven-year-old has two defensible
      // readings of one phrase (kit §E2.7 — a computable answer is not the same
      // as an askable question). Naming the two ends it is not leaves one.
      prompt: `Three trays of ${thing} sit on the club table. The counts are ${listOf(shown)}. Another ${fmtInt(k)} ${thing} go on the tray that holds neither the most nor the fewest. Then ten more go on. How many ${thing} are on that tray now?`,
      initN: middle,
      steps: [
        { op: 'add', n: k, d: 1 },
        { op: 'add', n: 10, d: 1 },
      ],
      units: thing,
      hints: [
        'Do you need all three counts here, or only two of them?',
        'Put the three counts in order first. Then make both moves in turn.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The derivable complementary slip the kit's third option asks for — see the
// header for why the recipe's own misconception cannot be generated and where it
// went instead. `{a, b: 10, op: '+', wrongOp: '-'}` returns the count after ten
// arrive and the count if the ten went the other way, both code-derived from the
// item's own operands, and the op-swap IS the named slip.
//
// WHY IT BELONGS IN A COMPARING WEEK. The draw guarantees
// `a < other < a + 10`, so the shown claim's second half — "the other tray still
// holds more" — is TRUE of the wrong number and FALSE of the right one. Repairing
// the arithmetic flips the comparison, so the child cannot finish by correcting a
// count: they have to say what the corrected count then means. A slip that
// changed only a number would belong to another week.
//
// The prompt shows the working and the claim and stops. Naming what went wrong
// would BE the answer, so the extension asks which tray holds more and leaves the
// child to say the rest.
//
// The figure is the first tray's ORIGINAL count — a quantity the story states
// outright, never the count the item asks for.
// ---------------------------------------------------------------------------

const eaTenTheWrongWay = withFigure(
  errorAnalysis({
    verifyTemplateId: 'd_verify_binop_misconception_v1',
    cognitiveOp: 'error-analysis',
    drawParams: (r) => {
      const a = 10 * r.int(3, 6) + r.int(1, 8);
      return { a, b: 10, op: '+', wrongOp: '-', other: a + r.int(2, 8), thing: r.pick(THINGS) };
    },
    build: (v, p, r) => {
      const thing = strOf(p, 'thing');
      const name = one(r);
      return {
        prompt: `${name} counts ${countNoun(numOf(p, 'a'), thing)} in one tray and ${countNoun(numOf(p, 'other'), thing)} in the other. Ten more ${thing} go into the first tray. ${name} writes that the first tray now holds ${countNoun(Number(v.wrong), thing)}. So the other tray still holds more.`,
        extension: `Write how many the first tray really holds. Then tell ${name} in one sentence which tray holds more.`,
        hints: [
          'Does a tray get fuller or emptier when ten more arrive?',
          'Count on ten from the first tray, then hold the two counts together.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
        answerKeywords: [
          'ten more has to make the tray fuller',
          'the count went down when it had to go up',
          'the first tray holds more once the ten arrive',
        ],
      };
    },
  }),
  (p) => placeValueBar(numOf(p, 'a'), assertsParam('a', 'bar:0')),
);

// ---------------------------------------------------------------------------
// Day-5 production — the §4 signature, and the catalog's own column 4:
// "true/false comparison claims — prove or fix each"
//
// Authored rather than drawn, and fixed on one set of three sentences. The demand
// is an argument about the SIGN, and an argument is only a shared one if every
// child is arguing about the same three claims (b19's proof and b20's completeness
// list made the same call). The three cases are chosen to cover the week's whole
// rule in one glance: one true `>` where the tens settle it, one false `<` where
// the tens settle it the other way, and one `=` between two counts that really do
// match. Ships as `manual-review`: what is being marked is the repair and the
// reason, and a person reads that.
// ---------------------------------------------------------------------------

const reasoningProveOrFix = reasoning({
  prompt:
    'Three sentences are on the board. 62 > 58. 71 < 68. 45 = 45. Write TRUE beside each sentence that is true. Fix the one that is not true by turning its sign round. Then write one sentence about how the tens helped.',
  value:
    'the first and third sentences are true, and the middle one is fixed to 71 > 68, with a reason that reads the tens first',
  hints: [
    'Which count in each sentence holds more whole tens?',
    'Read each sentence out loud. Then check which way its sign opens.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

/**
 * The recipe's misconception, given a hearing (header: the fourth surface it was
 * relocated to).
 *
 * "Sometimes" is the honest answer and both distractors are real children's
 * positions. When two counts share their tens the ones DO decide, and the claim
 * holds; when the tens differ the claim is worthless. 'always' is the child whose
 * eye stops at the last digit; 'never' is the overcorrection that throws away the
 * one case the ones settle — which is half of every pair this week draws.
 */
const asnMoreOnes = classify({
  prompt:
    'Always, sometimes or never true? The count with more ones is the greater count. Write one sentence to show how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Lets the last digit decide on its own, so a whole ten ends up counting for nothing at all.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Rules the ones out even when the tens match, which is the one case the ones do settle.',
    },
  ],
  hints: [
    'Can you find two counts where the ones do decide?',
    'Try a pair with matching tens. Then try a pair with different tens.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB03 = makeWeekBuilder({
  level: 'B',
  week: 3,
  conceptId: 'comparing-numbers',
  conceptName: 'Comparing numbers',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [A22, B1, B2],
  pedagogyContract: 'v2',
  conceptualAnchor: 'tens first',
  conceptFamily: 'operation',
  deepeningDelta:
    'B1 walked a number path and B2 took a two-digit number apart into tens and ones, but in both of those a number only ever had to be READ. Nothing was ever held against anything else. B3 puts two of them side by side, and that turns the tens and ones B2 named into a ranking: a whole ten outranks nine singles, so the tens are read first and the ones only get a say when the tens tie. That is the new demand, and it comes with a new answer mode — a sign rather than a number — and with the first idea in the level that a digit can be misleading. The count with more ones is very often the smaller count, which no page before this one had any reason to mention. C1 opens a third column and asks the same question with a place that can be empty; C2 then asks which of two tens a count is NEARER, which is comparison with a distance in it.',
  explanation: {
    hook:
      'Two numbers stand side by side. One of them is greater. The digits will not tell you which — but the tens will.',
    whyBeforeHow:
      'A two-digit number is not two digits sitting next to each other. It is a count of whole tens with some singles left over, and that is why comparing is done tens first: one whole ten is worth ten singles, so a single ten outranks every ones digit there is. Nine ones cannot catch one ten. So when two counts are held against each other, the tens are read first, and the count with more whole tens is the greater count no matter what its last digit says. That is where the trap lives, and it is worth naming out loud, because a six-year-old\'s eye goes to the last digit every time: 39 has more ones than 41, and 39 is still the smaller number. The ones are not useless — they are the tie-breaker. When two counts have the SAME number of tens, nothing else is left to decide it, and then the ones settle it completely. So the rule has two halves and a child needs both: read the tens first, and hand the decision to the ones only when the tens agree. The signs are just a way of writing down what you found. The open end of the sign always faces the greater count, and two counts that match take an equals sign, because nothing separates them.',
    script: [
      {
        say: 'Watch me build 39. Three ten-blocks, then nine single blocks. The nine singles look busy.',
        visual: 'One bar for 39: three long ten-blocks, then nine small single blocks.',
        figure: placeValueBar(39),
      },
      {
        say: 'Now 41 beside it. Four ten-blocks and one single. Four tens beat three tens. So 41 is greater.',
        visual: 'The 39 bar above the 41 bar, drawn to one shared scale.',
        figure: twoBars(39, 41, 'a bar for 39 above a bar for 41, drawn to one shared scale'),
      },
      {
        say: 'Here is the part everybody trips on. 39 has more ones than 41. It is still the smaller count.',
        visual: 'The same two bars, with nothing marked on either of them.',
        figure: twoBars(39, 41, 'the same two bars for 39 and 41, with nothing marked'),
      },
      {
        say: 'Now 63 and 68. Six tens each. The tens have run out of things to say. So the ones decide, and 68 wins.',
        visual: 'A bar for 63 above a bar for 68, almost the same length.',
        figure: twoBars(63, 68, 'a bar for 63 above a bar for 68, drawn to one shared scale'),
      },
      {
        say: 'One habit before I write any sign. I ask myself: will the tens settle it? Then I check the tens and find out.',
        visual: 'One bar for 74 — count the whole tens first, then the singles.',
        figure: placeValueBar(74),
      },
    ],
    summary:
      'A count is whole tens with singles left over, so read the tens first. More tens wins, whatever the last digit says. When the tens match, the ones settle it. The open end of the sign faces the greater count.',
    vocabulary: [
      { term: 'tens', kidGloss: 'how many whole tens a count holds — each one is worth ten singles' },
      { term: 'ones', kidGloss: 'the singles left over after every whole ten has been made' },
      { term: 'greater', kidGloss: 'the count that holds more' },
      { term: 'less', kidGloss: 'the count that holds fewer' },
      { term: 'the same', kidGloss: 'two counts with the same tens and the same ones' },
    ],
  },
  guidedExamples: [
    {
      ...ge(3, 1, 'modeled', 'Which count is greater, 39 or 41?', [
        {
          teacherSay:
            'Watch me. My eye goes straight to the 9, so I look away from it. I count whole tens first.',
        },
        {
          teacherSay: 'Three tens in one count, four tens in the other. Which count is greater?',
          expected: '41',
        },
      ], '41'),
      // The finished comparison may be shown here: the answer is already printed
      // on the page, and watching the tens get counted IS the teaching.
      visual: 'The 39 bar above the 41 bar, to one scale, with the four ten-blocks countable.',
      figure: twoBars(39, 41, 'a bar for 39 above a bar for 41, drawn to one shared scale', assertsAnswerOf('bar:1')),
    },
    {
      ...ge(3, 2, 'completion', 'Which count is greater, 63 or 68?', [
        { teacherSay: 'Both counts hold six whole tens. So what is left to decide it?', expected: 'the ones' },
        { childDo: 'Read the ones digit in each count, then name the greater count.', expected: '68' },
      ], '68'),
      // COMPLETION fade: the child produces the answer, so the two bars are drawn
      // to one scale and nothing is marked. Five in sixty-eight is a twentieth of
      // the width, so the picture states the counts and still leaves the reading.
      visual: 'A bar for 63 above a bar for 68, almost exactly as long as each other.',
      figure: twoBars(63, 68, 'a bar for 63 above a bar for 68, drawn to one shared scale'),
    },
    {
      ...ge(3, 3, 'prompted', 'Line these counts up, least first: 52, 47 and 58.', [
        { childDo: 'Sort them by whole tens. Two of them share a ten, so read those ones.', expected: '47, 52, 58' },
      ], '47, 52, 58'),
      // No picture. Three bars to one scale would lay the whole order out.
      visual: 'No picture — sort these from the numbers themselves.',
    },
    {
      ...ge(3, 4, 'independent', 'A sign is missing: 74 __ 71. Which sign makes it true? Work it out on your own.', [
        { childDo: 'Read the tens, then the ones, then choose the sign that makes it true.', expected: '>' },
      ], '>'),
      visual: 'No picture — this one is done from the numbers alone.',
    },
  ],
  days: [
    // Day 1 — concept echo: the sign, the number between two others, and three
    // counts put in order. Single-step throughout, and no chain anywhere.
    [
      { gen: wTensOnLabel, diff: 2 },
      { gen: wBagsOfTen, diff: 2 },
      { gen: discSymbol, diff: 2 },
      { gen: sitBetween, diff: 2 },
      { gen: sitOrderThree, diff: 3 },
    ],
    // Day 2 — fluency + application: the call made before working, the recipe's
    // own trap, and the first chain beside a settled single-step.
    [
      { gen: wStepDownARow, diff: 2 },
      { gen: predictTensSettle, diff: 3 },
      { gen: discOnesTrap, diff: 3 },
      { gen: msCompareThenChange, diff: 4 },
      { gen: sitBetween, diff: 3 },
    ],
    // Day 3 — interleave: the sign form beside the three-tray chain, so the shape
    // of a page never signals which job it wants.
    [
      { gen: wTensOnLabel, diff: 3 },
      { gen: discSymbol, diff: 3 },
      { gen: msMiddleThenChange, diff: 4 },
      { gen: predictTensSettle, diff: 4 },
    ],
    // Day 4 — word problems: both chains beside the trap and the ordering item,
    // so "it must need two steps" never becomes the cue.
    [
      { gen: wBagsOfTen, diff: 3 },
      { gen: msCompareThenChange, diff: 4 },
      { gen: msMiddleThenChange, diff: 4 },
      { gen: discOnesTrap, diff: 3 },
      { gen: sitOrderThree, diff: 3 },
    ],
    // Day 5 — the signature: a worked claim taken apart, three sentences proved
    // or repaired, and the ones-digit claim finally given a hearing.
    [
      { gen: wStepDownARow, diff: 2 },
      { gen: eaTenTheWrongWay, diff: 4 },
      { gen: reasoningProveOrFix, diff: 3 },
      { gen: asnMoreOnes, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the useful question this week is never "which is bigger?" but "which part did you read first?". A child\'s eye lands on the last digit of a number, every time, so 39 looks bigger than 41 until somebody makes them slow down and count whole tens. Try it at home with any two numbers you can find — house numbers, page numbers, the numbers on two bus stops — and ask for the tens out loud before anything else. Then try a pair that shares its tens, like sixty-three and sixty-eight, so your child meets the case where the last digit really is the decider. Both halves matter: a child who only knows "read the tens" is stuck the moment the tens match, and a child who only reads the last digit is wrong most of the time. If you have a handful of coins or buttons, build both counts in tens and singles and stand them side by side — the answer stops being an opinion the moment it can be counted.',
  ],
  puzzle: (r) => {
    // A SEARCH UNDER TWO COMPARISONS, and it is the only page in the week where
    // the count is not given. Every core page hands the child numbers and asks
    // which is greater; this one hands over two boundaries and a last digit and
    // asks which count fits all three facts at once. That is a different move
    // from anything on Day 1.
    //
    // Deterministic construction with exactly one answer: the window is at most
    // seven numbers wide, and two counts with the same ones digit are always ten
    // apart, so precisely one number inside the window ends in the named digit.
    const n = r.int(24, 87);
    const lo = n - r.int(2, 4);
    const hi = n + r.int(2, 4);
    const thing = r.pick(THINGS);
    const name = one(r);
    return {
      id: 'B3-PZ-01',
      title: 'Puzzle Grove: The Smudged Label',
      puzzleType: 'logic',
      prompt: `${name} has a tin of ${thing} with a smudged label. The count is greater than ${fmtInt(lo)} and less than ${fmtInt(hi)}. Its ones digit is ${fmtInt(n % 10)}. What is the count?`,
      answer: {
        value: String(n),
        acceptableForms: [countNoun(n, thing)],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which counts are allowed to sit in that gap at all?',
        'Write out every count in the gap. Then read the last digit of each.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // Core pages are handed their counts and asked which is greater. The puzzle is
  // handed no count at all: two boundaries and a last digit, and a count that has
  // to be searched for and then checked against all three facts. Nothing on Day 1
  // has that shape.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'find-the-smudged-count' },
  // B2 is the substrate this week reads from, but DD11 wants a sprint source
  // mastered ≥2 weeks back, and B2 is one week back. A22 is the honest choice
  // rather than the available one: counting in tens IS the fluency a tens-first
  // comparison runs on, and a child who has to rebuild "how many tens" from
  // scratch has no attention left for the comparison it was meant to serve.
  sprint: {
    skill: 'Counting in tens — the fluency a tens-first comparison runs on',
    sourceWeek: A22,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'retr_count_by_tens_v1',
    params: { start: 10, max: 90, step: 10 },
  },
  mastery: [
    { gen: discSymbol, diff: 3 },
    { gen: sitCompareTwoDigit, diff: 3 },
    { gen: sitOrderThree, diff: 3 },
    { gen: msCompareThenChange, diff: 4 },
    { gen: discOnesTrap, diff: 3 },
    { gen: msMiddleThenChange, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: the sign form on a fresh pair, with the relation drawn before the numbers so both forms can land on any of >, < or =, and its truth recomputed from the new operands. 02: write the greater or the smaller count, served RAW here rather than through the estimate-first wrapper the daily pages use — a check that hands over the strategy is not checking it. 03: three counts to be put in order, two of them inside one shared ten on both forms. 04/06: the two chains — two piles and one extreme, three trays and the one that is neither end — each starting from a count that only exists after the comparison is made, so a form cannot be passed by remembering which pile changed last time. 05: the ones-digit trap on a fresh trio, with the asked-for end rotating per draw, so the keyed option is the largest number on offer on about half of each form\'s draws and the smallest on the other half. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'compares-by-the-ones-digit',
      description:
        'Decides which of two counts is greater by reading their last digits, so a count with more ones is called the greater count even when it holds fewer whole tens.',
      exampleWrongAnswer: '39 called greater than 41, because 9 is more than 1',
      distractorRationale:
        'Offer the count carrying the extreme ones digit, and "always" on the claim that more ones means a greater count.',
      reteachPointer: 'explanation/script[2] (39 has more ones than 41, and is still the smaller count)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'sign-turned-the-wrong-way',
      description:
        'Works out which count is greater and then writes the sign facing the other way, so a true comparison is written down as a false sentence.',
      exampleWrongAnswer: '62 < 58 written for two counts that were compared correctly',
      distractorRationale: 'Offer the reversed sign, and the second-named count on a which-is-greater choice.',
      reteachPointer: 'explanation/summary (the open end of the sign faces the greater count)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-before-every-count-is-read',
      description:
        'Settles on an answer after reading two of three counts, or answers about the wrong end of the order, so the count the question actually named is never weighed.',
      exampleWrongAnswer: 'the greatest of three counts given when the least was asked for',
      distractorRationale:
        'Offer the third count that was never read, and "never" on the claim that the ones can decide.',
      reteachPointer: 'guidedExamples/B3-GE-03 (sort by whole tens, then read the shared ten\'s ones)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'ten-moves-the-wrong-way',
      description:
        'Reads "ten more" and takes ten off instead, so the count comes out twenty short and the comparison that follows flips the wrong way.',
      exampleWrongAnswer: '37 written for a tray of 47 that has just been given ten more',
      distractorRationale: 'Offer a count one whole ten below the truth, which is what a ten going the wrong way produces.',
      reteachPointer: 'explanation/script[4] (ask first whether the tens will settle it), and the B1 warm-up on Days 2 and 5',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'tens-count-not-yet-quick',
      description:
        'Rebuilds "how many tens" from scratch every time a count is met, which leaves no attention over for the comparison the tens count was meant to serve.',
      exampleWrongAnswer: 'a count of 8 whole tens reached by counting up in tens from the start',
      distractorRationale: 'Offer a tens count one either side of the truth, which is what recounting a long run of tens costs.',
      reteachPointer: 'explanation/vocabulary (tens), then the counting-in-tens sprint on Day 3',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Comparing two-digit numbers — reading the whole tens first and only letting the ones decide when the tens match, writing the greater, less and equals signs the right way round, putting three counts in order, finding the count that sits between two others, and working out which of two collections a change should be made to before making it.',
    improvingCandidates: [
      'reading the whole tens before looking at the last digit',
      'writing the sign so its open end faces the greater count',
      'putting three counts in order, least first',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'letting the whole tens decide first, rather than letting the last digit decide',
      },
      {
        errorTag: 'representation-misread',
        text: 'turning the sign the right way round once the greater count has been found',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading every count on the page, and answering about the end the question asked for',
      },
      {
        errorTag: 'procedure-slip',
        text: 'counting on a whole ten without losing the last digit — the sprint keeps that sharp',
      },
    ],
    homeFocus: {
      praiseLine:
        'You compared the whole tens before you looked at the last digit — that is the whole of this week.',
      questionForChild: 'Out of these two counts, which part are you going to read first?',
      schoolSyncHook:
        'Some classes say "more than" and "fewer than" where we say greater and less. They mean the same thing, and we will use whichever words your child hears.',
    },
    vocabularyForParent: [
      'tens (how many whole tens a count holds — one of them is worth ten singles)',
      'ones (the singles left over once every whole ten has been made)',
      'greater / less (which count holds more, and which holds fewer — decided tens first)',
    ],
  },
});
