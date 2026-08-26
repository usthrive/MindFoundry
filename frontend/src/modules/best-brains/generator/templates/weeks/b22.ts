/**
 * Level B · Week 22 — "Halves & quarters" (conceptId: halves-and-quarters).
 *
 * FILL-ARCHITECTURE §4 row B22: anchor "fair fold"; multi-step "fold then count
 * parts"; error-analysis "shades 1 of 2 UNequal parts as half"; discrimination
 * "2 parts vs 2 EQUAL parts"; Day-5 signature "fold-and-tell (figure R)".
 * Catalog focus: "Partition circles/rectangles; equal vs unequal shares" and
 * "Equal-share sort with tricky non-congruent halves".
 *
 * WHAT THIS WEEK IS FOR. A half is not one of two pieces. It is one of two EQUAL
 * pieces — so a shape cut lopsidedly has two parts and no halves at all. A child
 * who counts pieces without checking whether they match has exactly the
 * misconception this week exists to catch, and every page is built to make the
 * check unavoidable rather than to mention it:
 *   1. the NAME follows the fold, not the count. Fold once and check that the
 *      two parts land on top of each other, and only then are they halves. Fold
 *      twice and check again, and only then are the four parts quarters;
 *   2. so a cut with two parts of different sizes has no half in it. The pieces
 *      are still there; not one of them is a half. That sentence is the week, and
 *      it is on the page four times — in the lesson, in the discrimination, in
 *      the generated error-analysis and in the Day-5 fold;
 *   3. and the deepest one, which the catalog names as this week's tricky bit:
 *      two halves must be the same SIZE, not the same SHAPE. Four squares in a
 *      row and four squares in a block are both one half of an eight-square
 *      cloth. A child who believes halves must look alike will refuse a real
 *      half, so that belief gets its own script segment, the Always/Sometimes/
 *      Never claim, and the puzzle.
 *
 * SCOPE, AND STAYING UNDER C15. C15 ("Meeting fractions") owns fraction
 * NOTATION and the general d-way partition — "1/3 needs three EQUAL thirds" is
 * its discrimination, and its own B22 warm-up is what it treats as this week's
 * output. So B22 plants the seed and stops short of the notation: **no prompt,
 * hint, choice, answer or figure in this pack contains a fraction written as
 * n/d.** Halves and quarters are named in WORDS ("one half", "one quarter"), the
 * only partitions are two and four, and every numeric answer is a count — of the
 * equal parts in one half, of the parts a fold makes, of the squares that rebuild
 * a whole. Naming a mark on a number line, naming d-ths, comparing fractions and
 * renaming them are all left closed. What C15 inherits is the CHECK, which is
 * why its `wHalfQuarter` warm-up can assume a child who already asks "do the
 * parts match?" before naming anything.
 *
 * NO × AND NO ÷ ANYWHERE CHILD-FACING. C6/C9 own those symbols; B22 folds and
 * deals out. `sitWholeFromQuarter` names the registered `d_mul_v1` and three
 * chains carry internal `{op:'div'}` / `{op:'mul'}` steps — that is the op-chain
 * library's only way to say "share this fairly" and "one part for each", and it
 * is what makes both answers code-computed rather than authored. No prompt in
 * this pack contains a `×` or a `÷`, and every one states the move as something
 * the child does with their hands. (b19, b20 and b21 each made the same
 * declaration; it is repeated rather than assumed.)
 *
 * VERIFY-LIBRARY LIMIT AND HOW IT WAS CLOSED (kit §E2.3, and again it was the
 * FIRST branch that paid — hunt for an algebraic identity before reframing).
 * The recipe's error is a child who colours one of two UNEQUAL parts and calls
 * it a half, so the shown wrong number must be the size of the part they
 * coloured and the truth must be the size of a real half. No registered
 * transform returns "one side of an unfair cut" — until the operands are chosen
 * so that it does. With `b = 2`, `d_verify_binop_misconception_v1` over
 * `{op:'/', wrongOp:'-'}` gives
 *   correct = a ÷ 2   (the whole shared into two equal parts — a real half)
 *   wrong   = a − 2   (the whole with 2 parts taken off one end — the big piece)
 * — which is EXACTLY the misconception, arithmetically, as long as the story
 * says the split leaves 2 parts on one side. Then `a − 2` is not a fabricated
 * number: it is the piece the child coloured, counted. Both numbers are real
 * transform outputs over the story's own two quantities (the whole, and the 2
 * parts on the short side), nothing is invented, and the recipe's intended item
 * survives whole. The `wrongOp` is the DERIVATION, not the diagnosis: the
 * diagnosis lives in the mistakeBank ("named from the number of parts alone")
 * and is what the child has to supply. The price is that the short side is
 * pinned at two parts, which costs nothing — a pack carries exactly one
 * error-analysis item, and two parts is small enough that the unfairness is
 * plain and large enough that `a − 2` never lands on `a ÷ 2` (that needs a = 4,
 * and `a` is drawn from 10 upwards). Disclosed here rather than buried in a
 * comment.
 *
 * CONCEPT FAMILY: 'operation', the full row (≥2 multi-step week-wide; two chains
 * here, each served twice in core and once in mastery). Declaring 'place-value'
 * would have been a dodge — the recipe hands this week its own two-step and it
 * is the point. `msFoldThenCount` folds, folds again and counts what one part
 * holds, which is the recipe's own chain. `msHalfThenLeft` takes one half and
 * then takes a few more parts, so the second move is a genuine subtraction on
 * the result of the first. Halving and then halving again is a different job
 * from halving and then taking away; a child who has met only one of them has
 * learnt a sequence rather than a plan.
 *
 * FIGURE LAW as applied here (kit §F.7 / §E2.5), and this is the week where the
 * pictures carry the mathematics, so three things are worth stating:
 *
 *  1. THE UNEQUAL CUT **CAN** BE DRAWN, and it is drawn. `areaGrid` cells are
 *     equal by construction, so a grid cannot show an unfair partition — that is
 *     the wall C15's author reported. But `barModel` segments are drawn to a
 *     shared scale from their own `value`s, so segments `[3, 1]` really do draw
 *     one whole cut into two parts where the first is three times the second.
 *     C15 found this and used it; b21 found the opposite (an OVERLAP cannot be
 *     drawn, because segments are additive and the total would lie). Nothing in
 *     this week needs an overlap. So the trap is a REAL picture here, twice: the
 *     lesson's failed fold, and the Day-5 error-analysis, whose bar is built
 *     from the verify params themselves — `[a − 2, 2]`, summing to the whole `a`
 *     the item asserts. The trap did not have to be moved to a described choice.
 *  2. WHAT AN ASSESSED FIGURE ASSERTS — never the answer. `sitHalfTheSquares`
 *     asserts the grid's CELL COUNT, which is the partition the prompt already
 *     states; `sitWholeFromQuarter` draws ONE quarter and asserts its length,
 *     which is the given, while the whole is the question; the error-analysis
 *     bar asserts the whole the story hands over, not the half it asks for.
 *     Every one of those is something the child was already told.
 *  3. WHERE THE COMPLETED PICTURE LIVES. The finished namings — one half
 *     coloured, one quarter coloured, two halves of different shapes held
 *     against each other — live in the lesson script and the guided examples,
 *     where the answer is already on the page and watching the fold IS the
 *     teaching. Both chains, both discriminations and the metacognition item carry
 *     NO picture on purpose: a drawn row of squares beside "how many squares does
 *     one part hold?" is answered by counting, and a drawn fold beside "who has
 *     made halves?" is answered by looking. Day 5 is the one exception, and it is
 *     the error-analysis named in point 1 above: its bar shows the UNFAIR cut,
 *     which is the claim the child is asked to judge rather than the answer they
 *     are asked to find. (This sentence used to read "every Day-5 page carries no
 *     picture", which contradicted point 1 and the code both — the kind of stale
 *     line that invites the next author to delete a correct figure on the
 *     header's authority.)
 *
 * ONE THING THE PRIMITIVES GENUINELY CANNOT DRAW, said out loud because a
 * missing picture in a week about pictures reads as an oversight: a NON-CONGRUENT
 * half. `areaGrid` shades in reading order (`shaded: 4` fills the first four
 * cells), so an L-shaped or scattered half cannot be expressed, and `cellLabels`
 * is a label array rather than a per-cell fill. Script segment 3 therefore draws
 * the two halves as two bars of EQUAL LENGTH — which is the honest half of the
 * claim, and the half that is mathematical — and the stage direction carries the
 * difference in shape. The puzzle leans on the same limit deliberately: it hands
 * the child a plain grid and asks how many squares one half takes, precisely
 * because the ARRANGEMENT is free and no single picture could be the answer.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): every child-facing
 * sentence ≤15 words, counted rather than estimated; `half`, `halves`,
 * `quarter`, `equal parts`, `the fair fold` and `the whole` glossed in
 * `explanation.vocabulary` before any item leans on them; metacognition in its
 * intro form — the B row's own "will it pass …?" call, made over a share that
 * genuinely lands on both sides of five; error-analysis written-lite, one
 * sentence; the sprint ungraded and self-referenced. No gendered pronoun appears
 * in any prompt, because every name is drawn.
 *
 * FRAMES, re-checked against the weeks directory at the END of the build (kit
 * §E2.8), not at the start, and with plain substring greps rather than word
 * boundaries. The scan earned its keep repeatedly:
 *   - c15 is the dangerous neighbour, not a distant one. Its CUT_SCENES are a
 *     ribbon, a cake, a pizza, a paper strip, a chocolate bar and a loaf of
 *     bread; its PANEL_SCENES are a quilt, a flag, a wall and a window; it
 *     paints parts GOLD, it shares a tray of FUDGE, and its puzzle is a strip
 *     with one long piece. Every one of those is spoken for, and not one appears
 *     here — which is why this week's wholes are a flapjack, a shortbread, a
 *     cornbread and a brownie rather than the cake and pizza a halves week
 *     reaches for first;
 *   - 'strip of paper' hits c15 AND c16, so no paper strip is folded here even
 *     though it is the obvious apparatus;
 *   - 'sandwich' is c15's, 'melon' is c19's, 'pancake' survived but 'pie',
 *     'sheet', 'card', 'tray', 'bun', 'mat', 'tile', 'board' and 'sticker' are
 *     in six to sixty files each and were all dropped;
 *   - b19 counts things in TWOS and shares them fairly by two, which is this
 *     week's direct ancestor and the reason its warm-up here is a DOUBLE rather
 *     than a share: two weeks running the same dealing action would read as one
 *     page written twice. b19 also owns sponges, and b20 owns scarves.
 * What is kept returns ZERO hits across all sixty-three authored weeks: a
 * flapjack, a shortbread, a cornbread, a brownie, a towel, a pillowcase, a
 * placemat, a tablecloth, and a stained glass panel. The same re-scan caught
 * four siblings that landed WHILE this file was being written (b05, b12, b13 and
 * b18 were all touched after b21); none of them holds any noun used here.
 *
 * THE END-OF-BUILD PASS ALSO RE-READ EVERY HINT AGAINST THE CORPUS, by token
 * overlap against all 11,500-odd authored strings in the weeks directory rather
 * than by eye, and it earned its keep immediately: the B20 warm-up's second rung
 * had come out WORD FOR WORD identical to b21's own pegboard rung ("count on in
 * row-sized jumps, one jump for every row") — copied unconsciously while
 * borrowing that warm-up's SHAPE, which is exactly the plagiarism kit §E2.6 says
 * the per-pack gates cannot see. Seven rungs were rewritten in that pass (the
 * exact match plus six above 0.4 overlap against c17, c06, c09, c10 and d20).
 * Nothing now exceeds 0.4 except one pair of everyday phrases.
 * TWO DISCLOSED NEAR-MISSES, flagged here rather than buried:
 *   - FOLDING PAPER. c15's Day-5 asks the child to fold a strip of paper into
 *     three equal parts, and this week's Day-5 asks them to fold a paper square
 *     into halves and then quarters. The action is shared on purpose: the fold
 *     is the anchor the recipe names, C15 is the week that inherits it, and a
 *     paper square folded into two is not the same page as a paper strip folded
 *     into three. Paper is apparatus, like b21's cubes, not a scene;
 *   - EQUAL SQUARES. c15 reads fractions off wholes "made of equal squares", and
 *     four of this week's wholes are rows of equal squares or slices too. The
 *     difference is what is asked: c15 names the part, B22 counts it, and B22
 *     never writes a fraction. Kept deliberately, because a whole with visible
 *     equal parts is what makes "do they match?" checkable by a six-year-old.
 *
 * Retrieval is backward-only and every warm-up is load-bearing: B19 (doubles —
 * two matching parts put back together is a half read backwards), B20 (rows of
 * the same size, which is where "all the parts match" was first counted) and B14
 * (subtraction within 100, which is what "how many are left" is, and the second
 * move of one chain).
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
import { areaGrid, assertsAnswer, assertsParam, barModel } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };
const B19 = { level: 'B' as const, week: 19 };
const B20 = { level: 'B' as const, week: 20 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so nobody ever takes a share from themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];
/** Three DIFFERENT names, for the three folds the discrimination judges. */
const three = (r: Rng): [string, string, string] =>
  r.shuffle([...NAMES]).slice(0, 3) as [string, string, string];

/**
 * The FOLDABLES — flat cloth things that really can be folded, each printed with
 * a row of equal squares.
 *
 * The squares matter twice over. They make "do the parts match?" something a
 * child can settle by counting rather than by opinion, and they pin the fold
 * DIRECTION: to make the squares land on top of each other you have to fold
 * across the row, so "how many squares are in one half?" has exactly one answer
 * (kit §E2.7 — a computable answer is not the same as an askable question).
 * Every whole starts with a consonant sound, so the article is always "a".
 */
const FOLDABLES = [
  { whole: 'tablecloth', part: 'equal squares', piece: 'squares' },
  { whole: 'towel', part: 'equal squares', piece: 'squares' },
  { whole: 'placemat', part: 'equal squares', piece: 'squares' },
  { whole: 'pillowcase', part: 'equal squares', piece: 'squares' },
] as const;

/**
 * The CUT WHOLES — one baked thing, already cut into a row of equal pieces.
 *
 * Kept apart from the FOLDABLES because the VERB has to be honest: nobody folds
 * a flapjack and nobody eats a placemat. Anything that is shared out, taken or
 * eaten draws from here; anything that is folded draws from FOLDABLES. c15's own
 * reading pass found the cost of mixing them (a ribbon that had been eaten), so
 * the split is structural rather than remembered.
 */
const CUT_WHOLES = [
  { whole: 'flapjack', part: 'equal fingers', piece: 'fingers' },
  { whole: 'shortbread', part: 'equal fingers', piece: 'fingers' },
  { whole: 'cornbread', part: 'equal slices', piece: 'slices' },
  { whole: 'brownie', part: 'equal squares', piece: 'squares' },
] as const;

// ---------------------------------------------------------------------------
// Decorators — a picture, or a pinned truth, built from the item's OWN values.
//
// The shipped primitives carry no figure slot and lib/ is not ours to edit, so
// these do what `withEstimateFirst` does: all the work happens inside the
// returned closure, no new rng draw is taken, and the prompt is untouched (so
// the QG-1/QG-4 surface signature the guard already registered is unchanged).
//
// `withFigure` rebuilds from the drafted item's `generator.params` — the very
// numbers its answer was computed from — which is what makes a contradicting
// picture unbuildable rather than merely unlikely. `withPin` covers the one case
// the params cannot: `discrimination()` emits no generator spec at all, so its
// draw closure posts what it drew into a one-slot box the decorator reads
// immediately afterwards. `drawUniqueItem` returns the draft its LAST build call
// produced, so the box always holds that same draw. (Pattern from c06/b15/b19/b21.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

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

/**
 * Give a choice item the generator spec that lets the gates read it.
 *
 * Used once here, on the half-or-quarter count, and it is the reason that item
 * can be trusted: the pinned template is `d_verify_binop_v1` fed the whole and
 * the number of matching parts, so QG-11 recomputes the keyed count and PROVES
 * the option marked correct really is one half (or one quarter) of THIS whole,
 * rather than a number the author liked the look of.
 */
function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = box.last;
    if (!pin) throw new Error('b22/withPin: the draw posted nothing to build from');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

// ---------------------------------------------------------------------------
// The anchor, drawn — a whole and its equal parts, and never the half
// ---------------------------------------------------------------------------

/** "a tablecloth with 12 equal squares in a row" — the alt and the prompt's tag. */
const rowAlt = (n: number, whole: string, part: string): string =>
  `a ${whole} with ${countNoun(n, part)} in a row`;

/**
 * The whole, with its equal parts showing and nothing coloured.
 *
 * This is the anchor picture, and it deliberately does NOT mark the fold: where
 * the middle falls is the whole question. Asserting the CELL COUNT ties the
 * drawing to the partition the prompt already states, so the picture can only
 * repeat a given.
 */
const wholeRow = (n: number, whole: string, part: string, key: string): BBFigure =>
  areaGrid(
    { rows: 1, cols: n },
    {
      alt: `${rowAlt(n, whole, part)}, with none of them coloured`,
      asserts: assertsParam(key, 'cells'),
    },
  );

/** One quarter on its own — a given, never the whole it is a quarter of. */
const onePartAlt = (n: number, whole: string, part: string): string =>
  `one quarter of the ${whole}, ${countNoun(n, part)} long`;

const onePart = (n: number, whole: string, part: string, key: string): BBFigure =>
  barModel(
    [{ label: 'one quarter', segments: Array.from({ length: n }, () => ({ value: 1 })) }],
    {
      scaleMax: n,
      alt: onePartAlt(n, whole, part),
      asserts: assertsParam(key, 'bar:0'),
    },
  );

/**
 * An UNFAIR cut, drawn honestly — `barModel` segments are laid to a shared
 * scale, so a long part beside a short one is a real picture of a real lie.
 *
 * The two segments sum to the whole, which is exactly the quantity the item
 * asserts, so the drawing cannot drift from the story it belongs to.
 */
const unfairCut = (whole: number, short: number, thing: string, part: string, key: string): BBFigure =>
  barModel(
    [{ label: 'the two parts', segments: [{ value: whole - short }, { value: short }] }],
    {
      scaleMax: whole,
      alt: `a ${thing} cut into two parts, one much longer than the other, ${countNoun(whole, part)} in all`,
      asserts: assertsParam(key, 'bar:0'),
    },
  );

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B19 — doubles, and it opens the week on purpose.
 *
 * A half read backwards IS a double: two matching parts put back together make
 * the whole. b19 taught the double as the shape of an even number, and that is
 * the fact a child leans on when they check a half by rebuilding it. Framed as a
 * count of baked things rather than a share, because b19 already deals things
 * out into twos and a second week doing the same action would read as one page
 * written twice (kit §E2.8).
 */
const wDoubleBake = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'double',
    draw: (r) => {
      const each = r.int(21, 48);
      const [first, second] = two(r);
      return {
        prompt: `${first} bakes ${countNoun(each, 'flapjacks')} for the stall. ${second} bakes the same number. How many flapjacks is that in all?`,
        answerValue: String(each + each),
        templateId: 'retr_add_within_100_v1',
        params: { a: each, b: each },
        units: 'flapjacks',
        hints: [
          'Did the two bakers make the same amount as each other?',
          'Start at one baker\'s pile, then count the other pile on top of it.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B19,
);

/**
 * B20 — rows of the same size, which is where "all the parts match" was first
 * counted. The structure "every part holds the same amount" leans on it
 * directly, and this week's wholes are rows of equal pieces.
 *
 * Placemats rather than a pegboard, a roof or a tray: b21 owns the pegboard and
 * b20 owns its own letterboxes, solar panels and deckchairs (kit §E2.8).
 */
const wRowsOfSame = asWarmup(
  situation({
    situationType: 'area',
    cognitiveOp: 'rows-total',
    draw: (r) => {
      const rows = r.int(3, 6);
      const drawnPer = r.int(4, 8);
      // Equal row and column counts would give this warm-up the same
      // "n, n" operand surface that `sitWholeFromQuarter` lives on, and that
      // generator's surface pool is small enough to be worth protecting. One
      // DETERMINISTIC step, never a redraw (kit §E2.4).
      const per = drawnPer === rows ? drawnPer + 1 : drawnPer;
      const name = one(r);
      return {
        prompt: `${name} lays out ${countNoun(rows, 'rows')} of placemats. Every row holds ${countNoun(per, 'placemats')}. How many placemats are laid out?`,
        answerValue: String(per * rows),
        templateId: 'd_mul_v1',
        params: { a: per, b: rows },
        units: 'placemats',
        hints: [
          'Are all the rows here the same length as each other?',
          'Take a single row on its own, then bring in the rest.',
        ],
        errorTags: ['representation-misread', 'fact-recall'],
      };
    },
  }),
  B20,
);

/**
 * B14 — subtraction within 100, which is what "how many are left" is, and the
 * second move of `msHalfThenLeft`. Kept on the baked wholes so the arithmetic
 * arrives in the world the week already lives in.
 */
const wWhatIsLeft = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'sub-within-100',
    draw: (r) => {
      const before = r.int(31, 68);
      const gone = r.int(12, 29);
      const s = r.pick(CUT_WHOLES);
      return {
        prompt: `A big tray held ${countNoun(before, s.piece)} of ${s.whole}. By home time ${countNoun(gone, s.piece)} had gone. How many were left?`,
        answerValue: String(before - gone),
        templateId: 'retr_sub_within_100_v1',
        params: { a: before, b: gone },
        units: s.piece,
        hints: [
          'Which number came first, the tray full or the tray at home time?',
          'Start at the full tray, and count back the ones that went.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B14,
);

// ---------------------------------------------------------------------------
// Single-step core — the fair fold, the whole rebuilt, and two of four
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR: one fold, checked, and the equal parts counted.
 *
 * The squares are what make the check real. "The squares land on top of each
 * other" is the fair-fold test in words a six-year-old can act on, and it also
 * settles which way the cloth was folded, so the count has exactly one answer.
 *
 * The figure draws the row of squares and colours none of them. A child who can
 * see the drawing is handed the partition the prose already gave them; where the
 * middle falls stays theirs.
 */
const sitHalfTheSquares = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'halve-the-parts',
    draw: (r) => {
      const s = r.pick(FOLDABLES);
      const w = 2 * r.int(4, 10);
      const name = one(r);
      return {
        prompt: `[image: ${rowAlt(w, s.whole, s.part)}] ${name} has a ${s.whole}. There are ${countNoun(w, s.part)} along it. ${name} folds it in half, so the squares land on top of each other. How many ${s.piece} are in one half?`,
        answerValue: String(w / 2),
        templateId: 'd_div_v1',
        params: { a: w, b: 2, whole: s.whole, part: s.part },
        units: s.piece,
        hints: [
          'Do both parts of a half hold the same amount as each other?',
          'Split the squares into two piles that match, then count one pile.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) => wholeRow(numOf(p, 'a'), strOf(p, 'whole'), strOf(p, 'part'), 'a'),
);

/**
 * THE WHOLE, REBUILT FROM ONE QUARTER — the week's inverse, and the only page
 * that runs the other way.
 *
 * A child who can only go from whole to part has half the idea. Here the part is
 * handed over and the whole is the question, which is also the check they will
 * use on every other page: four matching quarters must rebuild the thing.
 *
 * The figure draws ONE quarter and asserts its length. Drawing the whole would
 * be the answer.
 */
const sitWholeFromQuarter = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'whole-from-quarter',
    draw: (r) => {
      const s = r.pick(CUT_WHOLES);
      // 2 to 7, so the whole runs 8 to 28 pieces — and so this generator's
      // "n, n" operand surface stays clear of `sitHalfTheSquares`, whose wholes
      // start at 8. Six values for four draws a pack, which is what keeps the
      // mastery forms genuinely distinct rather than distinct by luck.
      const q = r.int(2, 7);
      const name = one(r);
      return {
        prompt: `[image: ${onePartAlt(q, s.whole, s.part)}] ${name} shares a ${s.whole} fairly into four matching parts. One of those parts holds ${countNoun(q, s.part)}. How many ${s.piece} does the whole ${s.whole} hold?`,
        answerValue: String(q * 4),
        templateId: 'd_mul_v1',
        params: { a: q, b: 4, whole: s.whole, part: s.part },
        units: s.piece,
        hints: [
          'How many matching parts does it take to rebuild the whole thing?',
          'Lay four parts of that size end to end, and count everything in them.',
        ],
        errorTags: ['task-comprehension', 'fact-recall'],
      };
    },
  }),
  (p) => onePart(numOf(p, 'a'), strOf(p, 'whole'), strOf(p, 'part'), 'a'),
);

/**
 * TWO OF THE FOUR — the quiet page that puts a half and a quarter on the same
 * whole without ever naming an equivalence.
 *
 * The child works out what two of four matching parts hold. That number is the
 * same as one half, and a child who notices has found something real; nothing
 * here says it, because renaming is C16's week and naming is C15's.
 *
 * No picture. A drawn whole in four parts is counted rather than reasoned about,
 * and counting it is the item.
 */
const sitTwoOfFour = situation({
  situationType: 'combine',
  cognitiveOp: 'two-of-four',
  draw: (r) => {
    const s = r.pick(CUT_WHOLES);
    // Never four parts of four: the prompt already states the 4 parts, so a
    // part of four pieces would give this item the "n, n" surface
    // `sitWholeFromQuarter` needs, on a pool small enough to run dry.
    const q = r.pick([3, 5, 6, 7, 8] as const);
    const [first, second] = two(r);
    return {
      prompt: `${first} cuts a ${s.whole} into 4 matching parts. Every part holds ${countNoun(q, s.part)}. ${second} takes two of the four parts. How many ${s.piece} does ${second} take?`,
      answerValue: String(q + q),
      templateId: 'd_add_v1',
      params: { a: q, b: q },
      units: s.piece,
      hints: [
        'Is one part being taken here, or more than one?',
        'Find what a single part holds, then put two of those together.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form, a call made before any working
//
// The B row's own "will it pass …?" prediction, pointed at this week's own
// question: how big is one share going to be? Four children round a baked whole
// is the right place for it, because the share genuinely lands on both sides of
// five and a child who guesses is wrong about half the time by construction.
//
// The probe is deliberately SHORT. `metacog.ts` picks its own lead-in, and the
// longest of the three runs to eight words, so a probe over seven words puts the
// combined sentence past the Level-B ceiling however carefully the rest of the
// pack is written. That was measured, not guessed.
//
// The base is served ONLY through the wrapper (kit §E2.2): a generator used both
// raw and wrapped ships two identical hint ladders, which spends two of the
// three the dedup allows on one idea. No figure — a drawn whole beside "will
// each child get over five pieces?" has answered the question.
// ---------------------------------------------------------------------------

const sitQuarterShare = situation({
  situationType: 'sharing',
  cognitiveOp: 'quarter-share',
  draw: (r) => {
    const s = r.pick(CUT_WHOLES);
    // THE PROBE'S SIDE IS DRAWN FIRST, so its answer is an exact coin flip.
    //
    // This was `4 * r.int(3, 8)` with a nudge off a share of five, which left
    // shares of {3,4,6,6,7,8} — "over five" on four of six draws, about 67%. A
    // child meeting the page twice per pack learns to say yes, which is the
    // recorded b16 defect (70/30) repeating: the scaffold then teaches the guess
    // instead of the commitment it exists to demand. No gate can catch it, because
    // a probe has no answer key. Found by reading, not measuring.
    //
    // Same ranges as before and the same single `r.int` after the side, so a share
    // of exactly five stays unreachable — it would make the probe unanswerable,
    // since the child would be right whatever they said (kit §E2.7) — and the seed
    // stream lands in the same place on either branch (kit §E2.4).
    // DRAWING THE SIDE FIRST IS NOT BY ITSELF PROOF — the split was measured, and
    // the first two attempts were not coin flips.
    //
    // `drawUniqueItem` retries when an item's operand surface collides with another
    // in the same pack, and a retry is not neutral: it discards the draw and takes
    // the next. Wholes that collide often are therefore suppressed. Measured per
    // share value, a whole of 8 came out at 85 draws against 125-167 for the rest,
    // because 8 and 4 are everywhere in a halves-and-quarters pack — which pushed
    // "over five" to 58% even with the side drawn first and both sides offering the
    // same number of values. So both sides now use mid-range wholes only (12, 16 and
    // 24, 28), which collide at similar rates. The lesson generalises: a balanced
    // draw can still yield an unbalanced page once a uniqueness filter sits between
    // them, so measure the SERVED distribution, never the intended one.
    const overFive = r.chance(0.5);
    const share = overFive ? r.int(6, 7) : r.int(3, 4);
    const w = 4 * share;
    const name = one(r);
    return {
      prompt: `${name} cuts a ${s.whole} into ${countNoun(w, s.part)}. Then 4 children share it fairly, part for part. How many ${s.piece} does each child get?`,
      answerValue: String(w / 4),
      templateId: 'd_div_v1',
      params: { a: w, b: 4 },
      units: s.piece,
      hints: [
        'Will one child end up with more than half of the whole?',
        'Give every child one part at a time, then look at what one child holds.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const predictQuarterShare = withEstimateFirst(
  sitQuarterShare,
  'will each child get over five pieces?',
);

// ---------------------------------------------------------------------------
// Discriminations
//
// THE FOLD JUDGEMENT (the §4 row, and the whole week in one page): three folds,
// and the child has to decide which one made halves — or which made quarters,
// rotating per draw. One fold leaves a part sticking out, so it makes two parts
// and no halves; one folds twice, so its parts match but there are four of them.
// Neither the equality check nor the part count settles it on its own, which is
// exactly the pair of things a half is.
//
// THE COUNT (Day 3 onward): the same idea carried into numbers, with the two
// slips a child actually makes standing beside the truth — the count made by
// folding twice when one fold was asked for, and the count made by taking the
// number of parts away instead of sharing into them. The keyed number is pinned
// and recomputed; see the header.
//
// Neither carries a picture: a drawn fold is judged by looking.
// ---------------------------------------------------------------------------

const discFairFold = discrimination({
  variant: 'structural',
  cognitiveOp: 'judge-the-fold',
  draw: (r) => {
    const s = r.pick(FOLDABLES);
    const [fair, unfair, twice] = three(r);
    // Both branches consume exactly one draw, so the stream lands in the same
    // place whichever question is asked (kit §E2.4 — never a redraw loop).
    const askHalves = r.int(0, 1) === 0;
    return {
      prompt: `${fair}, ${unfair} and ${twice} each fold a ${s.whole} of the same size. ${fair} folds once, and the two parts land on top of each other. ${unfair} folds once, and one part sticks out past the other. ${twice} folds twice, and all four parts land on top of each other. Who has made ${askHalves ? 'two halves' : 'four quarters'}?`,
      correct: askHalves ? fair : twice,
      distractors: askHalves
        ? [
          {
            text: unfair,
            errorTag: 'concept-misconception' as const,
            rationale: 'Counts two parts and stops there. A half needs two parts of the same size, and one part sticking out means they are not.',
          },
          {
            text: twice,
            errorTag: 'task-comprehension' as const,
            rationale: 'Reads any fair fold as halves. Four matching parts are quarters; only two matching parts are halves.',
          },
        ]
        : [
          {
            text: unfair,
            errorTag: 'concept-misconception' as const,
            rationale: 'Counts the parts a fold makes without checking that they match, so an unfair fold passes for a fair one.',
          },
          {
            text: fair,
            errorTag: 'task-comprehension' as const,
            rationale: 'Reads one fair fold as enough for quarters. One fold makes two parts; quarters need four matching parts.',
          },
        ],
      hints: [
        'Which of these folds ended with the parts sitting on top of each other?',
        'Take each fold in turn: check that the parts match, then count them.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const countBox = pinSlot();

const discHalfOrQuarterCount = withPin(
  countBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'choose-the-count',
    draw: (r) => {
      const s = r.pick(CUT_WHOLES);
      let t = 4 * r.int(3, 8);
      // WHICH part is asked for rotates per draw. Without this the answer is the
      // same share every time, and a child who has met the page twice could pass
      // it on that alone.
      const askHalf = r.int(0, 1) === 0;
      // WHERE THE KEY SITS AMONG THE CARDS IS ALSO DRAWN (2026-08-25), because
      // rotating the QUESTION was not enough: with the old fixed pairings the
      // fraction word pinned the rank outright — "quarter" keyed the smallest
      // card and "half" the middle one on 100.0% of 3,200 served forms, so a
      // child who knew only that a quarter is small scored a CERTIFYING slot
      // without ever counting a share (the E17 conditional-rank class; the
      // corpus-wide --strict run found it). The distractor PAIRING now rotates
      // through named misconceptions on both sides of the key — the count of
      // folds, the count of parts, the stop-after-one-fold share, the
      // take-the-parts-away misread, the doubled share — so the key lands low,
      // middle and high in turn under BOTH fraction words.
      //
      // THE RANK AND PAIRING ARE DERIVED FROM THE PIN SEED, NOT DRAWN, and a
      // measurement forced that: drawing them cost two extra rng values, which
      // shifted every later item in the pack and surfaced QG-1 operand
      // collisions on 23 of 400 seeds. The pin's own r.uint() was already in
      // the stream; deriving want/pick from its value keeps this generator's
      // rng consumption BYTE-IDENTICAL to the shipped week (r.pick, r.int ×2,
      // r.uint), so every other item in every pack is untouched. The seed is
      // never printed, so nothing on the page reads the rank.
      //
      // Two structural exclusions, stated: at t = 16 the parts-count card (4)
      // IS the quarter key, and on half-asks it collides with the quarter-share
      // card — so t folds up by one grade wherever that pairing is drawn; and
      // key-largest on quarter-asks needs both low cards under the key, so the
      // whole folds to at least 20 there. Given a small whole the key therefore
      // cannot land highest — bounded, printed here, and measured at well under
      // the gate's bar.
      const pinSeed = r.uint();
      const want = pinSeed % 3; // 0 smallest · 1 middle · 2 largest
      const pick = (pinSeed >> 2) % 2;
      if (!askHalf && want === 2 && t < 20) t += 16;          // 12→28, 16→32
      if (!askHalf && want === 1 && pick === 1 && t < 20) t += 16; // parts-card must sit UNDER the quarter key
      if (askHalf && want === 2 && t === 16) t = 20;
      // The pinned truth, recomputed either way: the whole shared into two
      // matching parts, or into four. QG-11 therefore PROVES the keyed count
      // really is one half (or one quarter) of THIS whole.
      countBox.last = {
        params: { a: t, b: askHalf ? 2 : 4, op: '/' },
        seed: pinSeed,
      };
      const FOLDS = {
        text: '2',
        errorTag: 'concept-misconception' as const,
        rationale: 'Counts the folds it takes to make quarters, not the pieces sitting in one share.',
      };
      const PARTS4 = {
        text: '4',
        errorTag: 'concept-misconception' as const,
        rationale: askHalf
          ? 'Folds twice out of habit and counts the parts that made, rather than the pieces in one half.'
          : 'Counts how many equal parts the folding makes, not how many pieces sit in one part.',
      };
      const OTHER_SHARE = {
        text: String(askHalf ? t / 4 : t / 2),
        errorTag: 'task-comprehension' as const,
        rationale: askHalf
          ? 'Folds twice when one fold was asked for, so the share named is a quarter of the whole.'
          : 'Stops after one fold, so the share named is a half of the whole rather than a quarter.',
      };
      const TAKE_AWAY = {
        text: String(askHalf ? t - 2 : t - 4),
        errorTag: 'representation-misread' as const,
        rationale: 'Reads the number of parts as an amount to take away, so the whole comes back almost untouched.',
      };
      const DOUBLED = {
        text: String(2 * t),
        errorTag: 'procedure-slip' as const,
        rationale: 'Doubles instead of halving, so the share comes out bigger than the whole thing being shared.',
      };
      const pair = askHalf
        ? want === 0 ? [TAKE_AWAY, DOUBLED]
          : want === 1 ? [OTHER_SHARE, pick === 0 ? TAKE_AWAY : DOUBLED]
          : [OTHER_SHARE, PARTS4]
        : want === 0 ? [OTHER_SHARE, TAKE_AWAY]
          : want === 1 ? [pick === 0 ? FOLDS : PARTS4, pick === 0 ? OTHER_SHARE : TAKE_AWAY]
          : [FOLDS, PARTS4];
      return {
        prompt: `A ${s.whole} is cut into ${countNoun(t, s.part)}. Which count is ${askHalf ? 'one half' : 'one quarter'} of the whole ${s.whole}?`,
        correct: String(askHalf ? t / 2 : t / 4),
        distractors: pair,
        hints: [
          'Would this share fill the whole thing, or only part of it?',
          'Picture the equal parts dealt into matching piles, and read off one pile.',
        ],
        errorTags: ['task-comprehension', 'representation-misread'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// Multi-step — fold, then count the parts (FILL-ARCHITECTURE §4)
//
// Two chains, two genuine moves each, and `stepCount` is read off the chain
// rather than claimed. What differs is what the second move is FOR:
//   - FOLD THEN FOLD AGAIN is the recipe's own shape. The first fold has to be
//     finished before the second can start, and the count comes last;
//   - HALF THEN TAKE AWAY puts the half to work: the share is only the start of
//     the story, and the question is about what survives it.
// A child who has met only one of them has learnt a sequence rather than a plan.
// ---------------------------------------------------------------------------

/** The recipe's own two-step: fold, fold again, then count what one part holds. */
const msFoldThenCount = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'fold-then-count',
  draw: (r) => {
    const s = r.pick(FOLDABLES);
    // 12 to 32 squares, so a checked cloth stays a checked cloth: one part ends
    // up holding 3 to 8 squares, which is a count a six-year-old can hold.
    const w = 4 * r.int(3, 8);
    const name = one(r);
    return {
      prompt: `A ${s.whole} has ${countNoun(w, s.part)} in a row. ${name} folds it in half, so the squares land on top of each other. Then ${name} folds it in half again. How many ${s.piece} does one part hold now?`,
      initN: w,
      steps: [
        { op: 'div', n: 2, d: 1 },
        { op: 'div', n: 2, d: 1 },
      ],
      units: s.piece,
      hints: [
        'How many parts are there after the first fold, and after the second?',
        'Work out one half first, then fold that half and share it again.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * The half taken, and then a few parts more.
 *
 * The second move is B14's subtraction working on the result of the first, which
 * is why `usesPriorSkill` is set: the chain genuinely leans on a strictly-prior
 * week rather than repeating this one twice. Never more than four parts more, so
 * something is always left and the last sentence never has to be answered with
 * nothing.
 */
const msHalfThenLeft = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'half-then-take',
  usesPriorSkill: true,
  draw: (r) => {
    const s = r.pick(CUT_WHOLES);
    const w = 2 * r.int(5, 10);
    const more = r.int(2, 4);
    const [first, second] = two(r);
    return {
      prompt: `A ${s.whole} is cut into ${countNoun(w, s.part)}. ${first} takes one half of it. Then ${second} takes ${countNoun(more, `more ${s.piece}`)}. How many ${s.piece} are left?`,
      initN: w,
      steps: [
        { op: 'div', n: 2, d: 1 },
        { op: 'sub', n: more, d: 1 },
      ],
      units: s.piece,
      hints: [
        'Which of these two took a share of the whole thing?',
        'Deal with the half first, then count back the last few that went.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header for the derivation. The split leaves two parts on the
// short side, so the truth is the whole shared into two and the shown number is
// the long piece — both real outputs of one transform over the story's own two
// quantities. Nothing is fabricated, and the recipe's intended item is untouched.
//
// The prompt shows the split and the claim and stops. Naming what the split did
// would BE the answer, so the extension asks about the two parts and leaves the
// child to say the rest. The scene is drawn in `drawParams` rather than in
// `build` so the figure can name the whole it belongs to.
//
// It says SPLITS rather than "draws a line", which reading the generated week is
// what caught: the whole has already been cut into fingers by the first
// sentence, so a line drawn across it is not a thing anyone could do to it.
// ---------------------------------------------------------------------------

const eaUnequalHalf = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const s = r.pick(CUT_WHOLES);
    return {
      a: 2 * r.int(5, 10),
      b: 2,
      op: '/',
      wrongOp: '-',
      whole: s.whole,
      part: s.part,
      piece: s.piece,
    };
  },
  build: (v, p, r) => {
    const whole = String(p.whole);
    const piece = String(p.piece);
    const name = one(r);
    return {
      prompt: `A ${whole} is cut into ${countNoun(Number(p.a), String(p.part))}. ${name} splits it into two parts, leaving ${countNoun(2, piece)} on one side. ${name} colours the longer part and calls it one half. ${name} writes that one half of the ${whole} holds ${countNoun(Number(v.wrong), piece)}.`,
      extension: `Write how many ${piece} one half really holds. Then write one sentence to ${name} about the two parts.`,
      hints: [
        'Does one half have to hold as much as the other half?',
        'Count every equal part, then deal them into two piles that match.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
      answerKeywords: [
        'the two parts have to match',
        'the split is not in the middle',
        'one half is the same as the other half',
      ],
    };
  },
});

const eaUnequalHalfDrawn = withFigure(eaUnequalHalf, (p) =>
  unfairCut(numOf(p, 'a'), numOf(p, 'b'), strOf(p, 'whole'), strOf(p, 'part'), 'a'),
);

// ---------------------------------------------------------------------------
// Day-5 production — the §4 signature: fold and tell.
//
// Authored rather than drawn: the paper is the child's own, so there is no
// operand to generate, and the answer is the argument. The FOLDING is the
// flagged part (§7 lists B22's fold there), so this ships as `manual-review` —
// a person reads the sentence and looks at the paper. The choose/identify core
// of the week stays code-computed everywhere else.
// ---------------------------------------------------------------------------

const reasoningFoldAndTell = reasoning({
  prompt:
    'Fold a paper square in half so the two parts match exactly. Colour one half. Now fold a second paper square in half twice. Colour one quarter. Write one sentence saying how you know your parts really match.',
  value:
    'the parts land exactly on top of each other when the paper is folded back, so they are the same size',
  hints: [
    'How could you show somebody that your two parts are the same size?',
    'Fold the paper back on itself, then say what the edges show.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim the catalog calls this week's tricky bit, and its honest answer is
 * the middle one.
 *
 * Fold a cloth down the middle and the two halves match shape for shape. Cut an
 * eight-square cloth into a row of four and a block of four and the halves are
 * the same SIZE and different SHAPES — and they are still halves. Both
 * distractors are real children's positions: 'always' is the child who will
 * refuse a real half because it looks wrong, and 'never' is the overcorrection
 * that throws away the fold they can actually check.
 */
const asnHalvesSameShape = classify({
  prompt:
    'Always, sometimes, or never true? The two halves of a shape are the same shape as each other. Write one sentence saying how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Expects halves to look alike, so a half made of a block is refused even when it holds the same amount.',
    },
    {
      text: 'never',
      errorTag: 'representation-misread',
      rationale: 'Rules out the plain fold down the middle as well, where the two halves really do match shape for shape.',
    },
  ],
  hints: [
    'Could two parts hold the same amount and still look different?',
    'Try one fold down the middle, then try cutting the same shape a different way.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB22 = makeWeekBuilder({
  level: 'B',
  week: 22,
  conceptId: 'halves-and-quarters',
  conceptName: 'Halves & quarters',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [B13, B14, B19, B20],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the fair fold',
  conceptFamily: 'operation',
  deepeningDelta:
    'A7 talked about equal corners and equal sides, and B19 shared a set of things fairly between two children — but in both of those the WHOLE was a collection, and nothing had to be cut. B22 partitions one single whole, which is where the trap lives: a collection either shares out evenly or it does not, while a shape can always be cut into two pieces, so counting the pieces stops being enough. Everything new arrives with that. The name now depends on a CHECK — fold, and see whether the parts land on top of each other — and a cut that fails the check leaves two parts and no halves at all. Folding twice brings quarters, so the same whole carries two names at once. And the check is about SIZE and not shape, which is why four squares in a row and four squares in a block can both be one half of the same cloth. C15 takes this exact check and widens it to any number of parts, adds the number line as a second whole, and only then writes a fraction down.',
  explanation: {
    hook:
      'Cut a shape into two parts and you have two parts. Make those two parts match and you have halves. This week is about that difference.',
    whyBeforeHow:
      'Two parts are not the same as two equal parts. A half is one of two EQUAL parts, so the cut has to be fair. That is why every page here starts at the fair fold. Fold, then check that the parts land on top of each other. Because all the parts are the same size, the name is true. Fold once and the two parts are halves. Fold twice and the four parts are quarters. A shape cut into two parts that do not match has no half at all. The pieces are still there. Not one of them is a half. Two halves can be different shapes, as long as they hold the same amount.',
    script: [
      {
        say: 'Watch me fold this towel in half. I bring the two ends together. The two parts land exactly on top of each other. So each part is one half.',
        visual: 'A towel drawn as two equal parts, with one part coloured.',
        figure: areaGrid(
          { rows: 1, cols: 2, shaded: 1 },
          { alt: 'a towel drawn as two equal parts, with one of them coloured' },
        ),
      },
      {
        say: 'Now watch a fold that fails. I fold the same towel, but one part sticks out past the other. There are still two parts. Not one of them is a half.',
        visual: 'The same towel folded into two parts, one much longer than the other.',
        figure: barModel(
          [{ label: 'the two parts', segments: [{ value: 3 }, { value: 1 }] }],
          {
            scaleMax: 4,
            alt: 'a towel folded into two parts, the longer one three times as long as the shorter one',
          },
        ),
      },
      {
        say: 'Fold once more and the halves become quarters. I fold my towel in half, and then in half again. Now four parts land on top of each other. One of those four parts is one quarter.',
        visual: 'A towel folded into four equal parts, with one part coloured.',
        figure: areaGrid(
          { rows: 2, cols: 2, shaded: 1 },
          { alt: 'a towel folded into four equal parts, with one of them coloured' },
        ),
      },
      {
        say: 'Here is the surprise. Halves do not have to be the same shape. This tablecloth has eight equal squares. Four squares in a row is one half. Four squares in a block is also one half. Both halves hold four squares, so both are halves.',
        visual: 'Two halves of the same tablecloth: a row of four squares, and a block of four squares.',
        figure: barModel(
          [
            { label: 'one half', segments: [{ value: 4, label: '4 squares' }] },
            { label: 'the other half', segments: [{ value: 4, label: '4 squares' }] },
          ],
          {
            scaleMax: 8,
            alt: 'two bars of exactly the same length, one for each half of the eight-square tablecloth',
          },
        ),
      },
      {
        say: 'One habit before I fold anything. About how many squares will one half hold? I make a call, then I fold and count to check. No ruler is needed here. The fold is the check.',
        visual: 'The whole tablecloth beside a bar half as long.',
        figure: barModel(
          [
            { label: 'the whole tablecloth', segments: [{ value: 12 }] },
            { label: 'one half of it', segments: [{ value: 6 }] },
          ],
          { scaleMax: 12, alt: 'the whole twelve-square tablecloth beside a bar half as long' },
        ),
      },
    ],
    summary:
      'A half is one of two EQUAL parts. A quarter is one of four EQUAL parts. Count the parts, then check that they match. Two parts that do not match make no halves. Two halves can look different and still be halves.',
    vocabulary: [
      { term: 'half', kidGloss: 'one of two equal parts of a whole' },
      { term: 'halves', kidGloss: 'the two equal parts a fair fold makes' },
      { term: 'quarter', kidGloss: 'one of four equal parts of a whole' },
      { term: 'equal parts', kidGloss: 'parts of one whole that are all exactly the same size' },
      { term: 'the fair fold', kidGloss: 'a fold where the parts land exactly on top of each other' },
      { term: 'the whole', kidGloss: 'the one thing being folded or cut, all of it' },
    ],
  },
  guidedExamples: [
    {
      ...ge(22, 1, 'modeled', 'A tablecloth has 12 equal squares in a row. It is folded in half, so the squares land on top of each other. How many squares are in one half?', [
        {
          teacherSay:
            'Watch me. I do not count anything yet. First I check that the two parts land exactly on top of each other.',
        },
        {
          teacherSay: 'They do match. So how many squares does one part hold?',
          expected: '6',
        },
      ], '6'),
      // The finished half may be coloured here: the answer is already on the
      // page, and seeing six squares under six squares IS the teaching.
      visual: 'The tablecloth of twelve squares, with the six squares of one half coloured.',
      figure: areaGrid(
        { rows: 1, cols: 12, shaded: 6 },
        {
          alt: 'a tablecloth of twelve equal squares with six of them coloured',
          asserts: assertsAnswer,
        },
      ),
    },
    {
      ...ge(22, 2, 'completion', 'A towel has 8 equal squares in a row. It is folded in half, and then in half again. How many squares does one part hold?', [
        { teacherSay: 'How many squares are in one half of this towel?', expected: '4' },
        { childDo: 'Fold that half in half again, then count the squares in one part.', expected: '2' },
      ], '2'),
      // COMPLETION fade: the child produces the 2, so the picture shows the two
      // coloured squares only after they have been counted.
      visual: 'The towel of eight squares, with the two squares of one quarter coloured.',
      figure: areaGrid(
        { rows: 1, cols: 8, shaded: 2 },
        {
          alt: 'a towel of eight equal squares with two of them coloured',
          asserts: assertsAnswer,
        },
      ),
    },
    {
      ...ge(22, 3, 'prompted', 'One quarter of a brownie holds 3 equal squares. How many squares does the whole brownie hold?', [
        { childDo: 'Count four matching quarters, one quarter at a time.', expected: '12' },
      ], '12'),
      // Only the quarter is drawn. Drawing the whole brownie would answer it.
      visual: 'One quarter of the brownie, three equal squares long.',
      figure: barModel(
        [{ label: 'one quarter', segments: [{ value: 1 }, { value: 1 }, { value: 1 }] }],
        { scaleMax: 3, alt: 'one quarter of the brownie, three equal squares long' },
      ),
    },
    {
      // Independent: no picture at all. Deciding that one part has to be worked
      // out before two of them can be counted IS the task here.
      ...ge(22, 4, 'independent', 'A shortbread is cut into 16 equal fingers. It is shared fairly into four matching parts. How many fingers are in two of those parts? Solve cold.', [
        { childDo: 'Work out one part first, then put two parts together.', expected: '8' },
      ], '8'),
      visual: 'No picture — work this one out in your head.',
    },
  ],
  days: [
    // Day 1 — concept echo: the fair fold counted, the whole rebuilt from one
    // quarter, and two of four parts. Single-step only, no trap and no chain.
    [
      { gen: wDoubleBake, diff: 2 },
      { gen: wRowsOfSame, diff: 2 },
      { gen: sitHalfTheSquares, diff: 2 },
      { gen: sitWholeFromQuarter, diff: 3 },
      { gen: sitTwoOfFour, diff: 3 },
    ],
    // Day 2 — fluency + application: the size call made before working, the fold
    // judgement, the week's own chain, and the anchor beside them.
    [
      { gen: wWhatIsLeft, diff: 2 },
      { gen: predictQuarterShare, diff: 3 },
      { gen: discFairFold, diff: 3 },
      { gen: msFoldThenCount, diff: 4 },
      { gen: sitHalfTheSquares, diff: 3 },
    ],
    // Day 3 — interleave: the count trap and the second chain against the two
    // single-step forms, so the shape of a page never signals the task.
    [
      { gen: wRowsOfSame, diff: 2 },
      { gen: discHalfOrQuarterCount, diff: 4 },
      { gen: msHalfThenLeft, diff: 4 },
      { gen: sitWholeFromQuarter, diff: 3 },
      { gen: sitTwoOfFour, diff: 3 },
    ],
    // Day 4 — word problems: both chains beside the size call and the count
    // trap, so "it must need two steps" never becomes the cue.
    [
      { gen: wDoubleBake, diff: 3 },
      { gen: msFoldThenCount, diff: 4 },
      { gen: msHalfThenLeft, diff: 4 },
      { gen: predictQuarterShare, diff: 4 },
      { gen: discHalfOrQuarterCount, diff: 3 },
    ],
    // Day 5 — the signature: the unfair cut taken apart, the fold done with real
    // paper and explained, and the claim that settles what a half must match.
    [
      { gen: wWhatIsLeft, diff: 2 },
      { gen: eaUnequalHalfDrawn, diff: 4 },
      { gen: reasoningFoldAndTell, diff: 3 },
      { gen: asnHalvesSameShape, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the useful question this week is never "is that a half?" but "how do you know?". Give your child a paper square and let them fold it — the fold is a proof they can carry out themselves, because the two parts either land on top of each other or they do not, and nothing else is needed to settle it. Then do it badly on purpose: fold so that one part sticks out, and ask whether the big piece is a half. Children who have said "no, that one is bigger" out loud once stop naming parts by counting them, and that is the whole of this week. The surprise worth saving for last is that two halves do not have to look alike. Cut a sandwich into two long strips and another into two triangles; both are halves, and a child who has met that will not be thrown when the shapes get harder.',
  ],
  puzzle: (r) => {
    // Every core page counts equal parts along a row. This one hands over a
    // GRID and asks how many squares one half takes — and then why two children
    // who colour different squares can both be right. So the arrangement is the
    // free part, which is precisely what no single picture could show, and the
    // second move is an argument rather than a count.
    //
    // Deterministic construction: an odd total has no whole half, so the column
    // count takes one step up when rows × cols comes out odd (kit §E2.4).
    //
    // THREE ROWS MINIMUM, and that is the puzzle rather than a detail. On a
    // two-row panel one half is exactly one row, so the obvious colouring is the
    // only one a child would look for and the argument at the end has nothing to
    // bite on — and worse, the answer would equal the column count the prompt
    // already states. From three rows up, no single row is a half.
    const rows = r.int(3, 4);
    const drawnCols = r.int(3, 8);
    const cols = (rows * drawnCols) % 2 === 1 ? drawnCols + 1 : drawnCols;
    const half = (rows * cols) / 2;
    const name = one(r);
    const alt = `a stained glass panel of ${countNoun(rows, 'rows')}, each holding ${countNoun(cols, 'equal squares')}`;
    return {
      id: 'B22-PZ-01',
      title: 'Puzzle Grove: The Two Fair Halves',
      puzzleType: 'logic',
      prompt: `[image: ${alt}] ${name} is making a stained glass panel. There are ${countNoun(rows, 'rows')} of ${countNoun(cols, 'equal squares')}. ${name} wants exactly one half of the panel to be blue. How many squares does ${name} paint blue? Then say why two children can both be right and paint different squares.`,
      figure: areaGrid({ rows, cols }, { alt }),
      answer: {
        value: String(half),
        acceptableForms: [countNoun(half, 'squares')],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'How many squares does the whole panel hold?',
        'Deal every square into two matching groups, then count one group.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
  // Core pages count along a row that is already cut. The puzzle is handed a
  // grid, has to work out the whole before it can halve it, and then argue why
  // the SHAPE of a half is free. A count and a justification, neither on Day 1.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'design-a-half' },
  sprint: {
    skill: 'Addition within 100 — putting the two matching parts back together',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 12, max: 48 },
  },
  mastery: [
    { gen: sitHalfTheSquares, diff: 3 },
    { gen: msFoldThenCount, diff: 4 },
    { gen: sitWholeFromQuarter, diff: 3 },
    { gen: msHalfThenLeft, diff: 4 },
    { gen: sitTwoOfFour, diff: 3 },
    { gen: discHalfOrQuarterCount, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: the three single-step forms the week teaches — the fair fold counted on a fresh cloth (its uncoloured row of squares preserved, drawing the partition and never the middle), the whole rebuilt from one quarter (its single-quarter picture preserved, and never the whole), and two of four matching parts, which carries no picture on either form because a drawing would do the counting. 02/04: the two chains, one folding twice before anything can be counted and one taking a half before taking a few parts more. 06: the half-or-quarter count, redrawn from a fresh whole so a form cannot be passed by remembering which share was asked for last time; its pinned truth is recomputed from the fresh partition. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'counts-parts-not-equal-parts',
      description: 'Names a part a half or a quarter from the number of parts alone, so a cut that leaves two parts of different sizes is read as halves.',
      exampleWrongAnswer: 'the longer of two unequal parts called one half of the whole',
      distractorRationale: 'Offer the fold that leaves one part sticking out past the other, and the count of the parts on the long side.',
      reteachPointer: 'explanation/script[1] (there are still two parts; not one of them is a half)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'halves-must-look-alike',
      description: 'Expects the two halves of a shape to be the same shape as each other, so a half made of a block is not accepted beside a half made of a row.',
      exampleWrongAnswer: 'a block of 4 squares denied as one half of an 8-square cloth',
      distractorRationale: 'Offer "never" on the claim that two halves are the same shape, and the count made by taking the number of parts away.',
      reteachPointer: 'explanation/script[3] (both halves hold four squares, so both are halves)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'half-and-quarter-swapped',
      description: 'Answers with the other named part — a quarter where a half was asked for, or one fold where the question needed two.',
      exampleWrongAnswer: 'one quarter of 20 equal slices answered as 10 slices',
      distractorRationale: 'Offer the share made by folding twice when one fold was asked for, and the fair fold that makes the wrong number of parts.',
      reteachPointer: 'guidedExamples/B22-GE-02 (fold that half in half again)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-share',
      description: 'Chooses the right move and then loses the count while dealing the equal parts out, so the answer lands one part either side of the truth.',
      exampleWrongAnswer: 'one half of 18 equal fingers answered as 8 fingers',
      distractorRationale: 'Offer a share one part away from the truth, which is what losing your place in the dealing costs.',
      reteachPointer: 'explanation/summary (count the parts, then check that they match), then the 2-minute addition sprint',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'doubles-not-yet-quick',
      description: 'Knows that two matching halves rebuild the whole and rebuilds the double from nothing every time it is needed, which leaves no attention over for the checking the double was meant to serve.',
      exampleWrongAnswer: 'four quarters of 3 squares each rebuilt as 9 squares',
      distractorRationale: 'Offer a rebuilt whole one part short, which is what a hurried count of the matching parts produces.',
      reteachPointer: 'guidedExamples/B22-GE-03 (count four matching quarters), plus the ungraded sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Halves and quarters — folding a whole so that the parts land on top of each other, naming one of two equal parts as a half and one of four as a quarter, counting the equal parts in one half or one quarter, rebuilding a whole from one of its parts, and telling two parts apart from two EQUAL parts.',
    improvingCandidates: [
      'checking that the parts match before naming a half or a quarter',
      'counting the equal parts that one half or one quarter holds',
      'rebuilding the whole thing from one of its matching parts',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'the difference between two parts and two EQUAL parts — one fold of the paper settles it',
      },
      {
        errorTag: 'representation-misread',
        text: 'accepting a half that holds the right amount even when it is not the right shape',
      },
      {
        errorTag: 'task-comprehension',
        text: 'keeping halves and quarters apart — one fold makes two parts, two folds make four',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the count steady while the equal parts are dealt out, which the two-minute sprint keeps quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You checked that the two parts landed on top of each other before you called one of them a half — that check is the whole of this week.',
      questionForChild: 'If I cut this in two and one piece is bigger, is the big piece a half?',
      schoolSyncHook: 'If your child\'s class says "fourths" where we say "quarters", tell us and we will use both.',
    },
    vocabularyForParent: [
      'equal parts (all exactly the same size — the check that comes before the name)',
      'a half (one of two equal parts; two parts on their own are not enough)',
      'a quarter (one of four equal parts, which is what folding in half twice makes)',
    ],
  },
});
