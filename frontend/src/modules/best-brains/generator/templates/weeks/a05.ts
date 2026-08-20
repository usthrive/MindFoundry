/**
 * Level A · Week 5 — "More, fewer, same" (conceptId: more-fewer-same).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber`. a01, a04, a11, a12 and
 * a20 were read for their ARCHITECTURE — the option/rank machinery, the per-pack
 * dealing, the counts-shown-never-said split. Every sentence, scene, name, hint
 * and rationale below was written for this week, and the cross-corpus
 * token-overlap scan that backs that up is in the report.
 *
 * FILL-ARCHITECTURE §3 row A5: anchor "one-to-one matching lines"; core form
 * "compare sets via pairing"; perceptual discrimination "longer-line-vs-more
 * (conservation — THE A trap)"; puppet error-analysis "says the spread-out row
 * has more"; Day-5 "sort pairs: more/fewer/same".
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **How long a row LOOKS tells you nothing about how many are in it.** That
 *    is the whole week, and it is the one belief every four-year-old brings. So
 *    every comparison figure in this file has exactly ONE row spread out, and
 *    which row that is, is drawn INDEPENDENTLY of which row has more. The trap
 *    therefore cuts both ways by construction rather than by good intentions:
 *    the long row has more as often as the short one does, and neither beats a
 *    guess (measured; the table is in disclosure 3).
 *  - **Matching one for one is what settles it.** Counting is A1's answer and it
 *    still works; pairing is A5's, and it is the one that survives into partners,
 *    into comparison bars and into subtraction. The lesson script and the guided
 *    examples DRAW the matching threads. No assessed item ever does.
 *  - **"The same" is a third of the concept, not an edge case.** A tie is drawn
 *    on one comparison page in three and on one puppet page in two, so the option
 *    is live everywhere it is offered, and the canonical conservation task — two
 *    rows of the SAME count, one pushed apart — is a page a child actually meets.
 *  - **Nothing here is answerable off the sentence.** The counts live only in the
 *    drawing. Band A trades the multi-step quota for `pictorialPerDay: 1`; every
 *    non-retrieval item on Days 1–4 carries a figure built from its own values.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Retrieval is 21.1%** (4 of 19 daily items), one warm-up on each of Days
 *    1–4, from A1, A2, A3 and A4 in four different formats.
 *
 * ── TEN DISCLOSURES (FANOUT kit §E2.3: document the choice in the header) ──
 *
 * 1. **THE TRAP IS DRAWN AT LAST, AND `spread` IS WHAT DRAWS IT.** Until
 *    2026-08-10 `CountersFig`'s compare branch derived a single pitch from the
 *    longest row and started every row at the same left edge, so inside one
 *    figure more counters ALWAYS occupied more width and A5's own recipe row was
 *    physically undrawable (L49 recorded it as the week's blocker). A per-group
 *    `spread` now multiplies ONE row's SPACING — never its counter size — so "a
 *    long row of 5 beside a tight row of 6" is a picture this file can emit.
 *    Every comparison figure here spreads exactly one row, and the spread is
 *    computed to make that row at least 35% WIDER than the other whatever the
 *    counts are (`spreadFor` below). The counters stay the same size in both
 *    rows, which is the pedagogy and not a detail: the misconception under test
 *    is "it takes up more room, so it is more", and bigger counters would pose a
 *    different illusion.
 *
 * 2. **NEITHER `compareSets` NOR `pickExtreme` IS USED, AND THE REASON IS
 *    MEASURED ARITHMETIC RATHER THAN TASTE.** Both family generators build their
 *    comparison figure through `counterGroups` with no `spread`, so the drawn
 *    width of a row is exactly proportional to its count. On `compareSets`
 *    ("Which row has more?") a child who taps the longer row is therefore right
 *    on every draw where the two rows differ — 80% of them, since the generator
 *    ties one draw in five — and on `pickExtreme` ("Tap the group with the
 *    fewest") tapping the shortest row is right 100% of the time. In any other
 *    week that is a harmless artefact of an honest picture. In THIS week it is
 *    the L51 defect exactly: guessing would reward the precise misconception the
 *    week exists to remove, and it would do so on a page the entropy gate exempts
 *    because comparison items key an extreme by definition. So the comparison
 *    forms are local, and they differ from the family's in one respect only —
 *    they spread a row. Recorded for the orchestrator: `compareSets` and
 *    `pickExtreme` would both be improved by an optional spread, and A5 is the
 *    week that proves it.
 *
 * 3. **THE BLIND HABITS, NAMED AND MEASURED (L51).** The question is not "is this
 *    guessable" but "does guessing reward the misconception I am teaching
 *    against". Six habits could, and each is measured over 2,000 packs against
 *    its own page's chance floor of 33.3%; the per-slot tables are in the report.
 *    The construction that puts them there is three independent draws — whether
 *    the two counts are EQUAL (one in three), which row is SPREAD (a coin), and
 *    which row is BIGGER (a coin) — so "the long row has more" is right on
 *    exactly the two thirds of draws that are not ties, halved. Served, over
 *    34,000 row-picking exposures: tap the long row 33.8%, tap the short row
 *    33.9%, tap the row named first 33.8%, always answer "they are the same"
 *    32.3%. Over 14,000 verdict exposures with the puppet's own pages set aside:
 *    always "more" 33.6%, always "fewer" 33.6%, always "the same" 32.8%, "the
 *    long row has more" 33.4%. And the joint distribution the mirror hides in —
 *    P(the spread row has more) 33.6%, P(the tight row has more) 34.0%, P(tie)
 *    32.4% over 48,000 non-puppet figures. So the spread row is the bigger one
 *    as often as it is the smaller one, and neither reading is learnable.
 *
 *    THE THREE-ROW PAGES NEEDED A DIFFERENT MECHANISM, and only reading a
 *    generated week found it. On the Day-5 sort and the puzzle, shuffling three
 *    fixed multipliers across three rows leaves the COUNT deciding most of the
 *    width order, because a row's width is count times spread: measured, "sort
 *    the rows by how long they are" gave the right order on 41.6% of Day-5 sorts
 *    against a 16.7% floor. The width ranking is now DRAWN first and the spreads
 *    solved to realise it (`scrambleWidths`), which puts it at 16.4% and puts
 *    each of the puzzle's three by-width pair rules at 33.0-33.6%. It also draws
 *    bigger counters than the shuffle did.
 *
 * 4. **THE PUPPET IS THE ONE PLACE THE SPREAD ROW NEVER WINS, AND THAT COSTS A
 *    MEASURED 67.2% ON TWO TEACHING PAGES.** His slip is the recipe's — he says
 *    the opened-out row has more — and error analysis requires it to be false, so
 *    on his two pages that row never holds more. The mirror rule "the SHORT row
 *    is the secret big one" therefore scores 67.2% there, against 33.8% on every
 *    other card page in the week and 33.8% across the twelve certifying slots,
 *    which the puppet never occupies. That is the A20 failure met head-on rather
 *    than avoided: A20 shipped "the biggest object is never the heaviest" on 12
 *    of 12 three-way pages and taught the mirror superstition wholesale. Here it
 *    is confined to two Day-3/Day-5 pages that certify nobody, it is named in the
 *    mistakeBank as an over-correction with its own card and rationale, and it is
 *    the price of error analysis: the only way to remove it is to let the puppet
 *    sometimes be right, and then it is not error analysis.
 *
 *    WHAT WAS FIXED RATHER THAN DISCLOSED. The first build asked about the row he
 *    names on every page, so "more" was a card offered on 100% of draws and keyed
 *    on 0.0% — a dead option in the one place this week shows the misconception by
 *    name, and the shape L38 calls worse than no option at all. Which row the
 *    QUESTION asks about is now drawn independently of the row he points at, so
 *    all three cards are keyed on about a third of draws (33.0 / 33.8 / 33.2) and
 *    "the puppet is mixed up" only pays after his claim has been mapped onto the
 *    row the question names. Nothing about his slip changed.
 *
 * 5. **THE VERDICT ITEMS RUN THROUGH `a_compare_sets_v1` WITH THE TWO COUNTS
 *    LABELLED, AND THE RELABELLING IS STATED HERE RATHER THAN BURIED.** The
 *    Day-5 signature is "sort pairs: more/fewer/same", so `sortVerdict` and the
 *    puppet page key one of three WORDS, not a noun. No registered transform in
 *    the corpus returns a comparison verdict — `a_compare_sets_v1` is the only
 *    comparison transform at this band and it returns the LABEL of the count with
 *    more (or "they are the same"), `a_pick_extreme_v1` returns the label of an
 *    extreme, and every {correct, wrong} transform returns numbers. Looking for
 *    the identity FIRST (L36, kit §E2.3) found one, and it is a relabelling
 *    rather than a fabrication: `a_compare_sets_v1` takes two counts and the
 *    LABEL attached to each, and answers "which label sits on the larger count,
 *    or are they equal". Label the asked row's count "more" and the other row's
 *    count "fewer", and its three outputs are exactly the three verdicts — a > b
 *    gives "more", a < b gives "fewer", a === b gives "they are the same". The
 *    transform still performs the entire comparison from the two drawn counts;
 *    nothing is invented and no number is authored.
 *
 *    THE HONEST COST, stated plainly: the emitted `generator.params` then read
 *    `nounA: "more"`, `nounB: "fewer"`, which is a true description of what the
 *    transform does with those fields and a misleading one to a human reading the
 *    pack, since every other caller puts a drawable noun there. An
 *    `a_compare_labels_v1` alias — the same function under a name that says what
 *    it does — would fix the reading without touching a line of behaviour, and it
 *    is recorded for the orchestrator. The alternative was to key the verdict by
 *    hand, which is the D6 class the registry exists to make impossible, or to
 *    ship the Day-5 signature as `manual-review`, which A5 has no licence for:
 *    FILL-ARCHITECTURE §7 lists the A-band oral Day-5s by name and A5 is not
 *    among them.
 *
 * 6. **EVERY CERTIFYING SLOT CARRIES AUTHORED CHOICES, AND SO DOES EVERY WARM-UP
 *    THAT COULD.** "Free-entry numeric" is not an answer mode at band A: a
 *    pre-reader cannot type, so `AnswerEntry` hands a choice-less numeric item to
 *    `tapOptionsFor`, which invents four buttons at render time from a function
 *    that cannot know the slot's answer range (L53). All six mastery slots and
 *    all fifteen non-retrieval day items here are `choice-key` with three
 *    authored options, or `manual-review`, which `AnswerEntry` short-circuits
 *    before it would reach the button-maker. Two of the four warm-ups arrive from
 *    the family as `exact-numeric` with no options — `countArrangement` and
 *    `tenFrameEmpty` — so `withRangeChoices` gives each of them the WHOLE range
 *    its own draw can produce: three counts for the row, three counts for the
 *    empty boxes. The option set is then constant while the key's rank moves with
 *    the picture, so no value on either page is ever unkeyable and no rank is the
 *    answer's home. Measured rates are in the report. Nothing is added to
 *    `DECLARED_LURES`: this week declares no lure, because it has none.
 *
 * 7. **THE FIGURE NEVER PERFORMS THE MATCHING, AND THAT LINE IS DRAWN IN CODE.**
 *    `showPairs` threads each counter to its partner and `markExtra` rings the
 *    leftovers; between them they ARE the answer to "which row has more" (L33's
 *    recorded example is this exact page, from the A15 fixture). `counterGroups`
 *    deliberately does not expose either, so an assessed item cannot acquire them
 *    by accident; this file turns them on through a local helper in the lesson
 *    script and the guided examples ONLY — the four surfaces where the answer is
 *    already on the page and the point is to model the strategy. Every one of the
 *    twenty-one assessed comparison figures leaves both off.
 *
 * 8. **Six thin local generators, and why each is not in the family.**
 *    `comparePair` and `compareStory` (disclosure 2 — the family's comparison
 *    cannot spread a row, and with no spread the picture answers the question),
 *    `sortVerdict` and `puppetSpread` (disclosure 5 — the family has no verdict
 *    form at all, and `PuppetSlip` is a closed union of 'double-count' |
 *    'skip-count' | 'count-back-start' | 'teen-writing' with no length-for-number
 *    slip in it), `sortRows` (`sortAndTell` sorts groups drawn at a shared pitch,
 *    so sorting them by LENGTH scores full marks — the same defect as disclosure
 *    2, one form along) and `withRangeChoices` (disclosure 6). None departs from
 *    how the family builds an item: each names a templateId the registry
 *    resolves, draws its picture through `lib/figures`, renders every quantity
 *    through `lib/format`, and stamps `authorMeta` for the preflight to read.
 *
 * 9. **"THE SAME" COULD PASS A CHILD THROUGH THE WEEK, AND A BALANCED POOL WAS
 *    NEVER GOING TO STOP IT.** Disclosure 3 measures every habit against its
 *    page's chance floor and every one of them sits on a third. That is the right
 *    measurement for a PAGE and the wrong one for a FORM. Six slots keying "the
 *    same" independently at a third is Binomial(6, 1/3), and measured over 600
 *    forms it put four or more sames in 8.8% of them and five or more in 0.2% —
 *    while `MASTERY_THRESHOLD_PCT` is 80, which is five of six. In that tail a
 *    child who taps "the same" on every page is promoted out of the week without
 *    comparing anything, and the judged seed 11 sat in it, keying "same" on eight
 *    of its twelve mastery slots. Every gate passed: `bb-answer-entropy` measures
 *    a SLOT across packs, so a card keyed on a third of draws is exemplary to it
 *    however those draws clump inside one sitting.
 *
 *    Fixed the way A20 fixed its balances (L52): `dealVerdicts` deals the count
 *    per FORM out of the pack's own guard BEFORE the first mastery page is built
 *    — `k` uniform on {1, 2, 3}, then k of the six slots chosen uniformly. Re-
 *    measured over 3,000 packs / 6,000 forms: four or more sames on **0.0%**,
 *    five or more on **0.0%**, observed maximum **3**, and the per-slot rate
 *    still a third (31.7–34.6%) because E[k] = 2 and the slots are drawn
 *    uniformly. Three of six is 50% against a pass mark of 80, so answering "the
 *    same" every time now fails EVERY form rather than almost every form. The
 *    floor of one is doing work too: "the same" is a live keyed card in every
 *    form, which is what this week's claim that a tie is a third of the concept
 *    actually requires. Seed 11 now reads ..SS.. / S...S. — two and two.
 *    Days and the puzzle are untouched, byte for byte over 200 seeds; both
 *    mastery forms move, because the deal spends six draws on their streams.
 *
 * 10. **THE `isomorphNotes` FRESHNESS SENTENCE WAS ARITHMETICALLY IMPOSSIBLE,
 *     AND THE ARITHMETIC IS SHORT.** It said "No count/noun pair is reused from
 *     Form A or from the daily pages", and measured over 300 packs it was false
 *     in 99.3% of them. It could not have been otherwise. A pair is (a count from
 *     3–9) × (one of the nine drawable kinds) = **63 surfaces**, and every
 *     comparison page prints TWO of them, every three-row page three. Counted on
 *     the assembled pack: **46.0 pairs are already printed on the five days and
 *     Form A** before Form B draws its first page — 73% of the space — and Form B
 *     then needs twelve more. There is no draw that satisfies the sentence.
 *
 *     Enforcing even the certifying half — Form B reprinting nothing Form A
 *     printed — was BUILT AND MEASURED before it was rejected, because "it looked
 *     expensive" is not a reason. A freshness redraw has to rebuild the whole
 *     page, and `drawUniqueItem` has already registered the rejected draft's
 *     surface by then, so each redraw permanently spends one of the seven
 *     signatures a tied page can carry. Result over 600 packs: Form B reprinted
 *     nothing from Form A (0 of 7,200 pairs) at a cost of **29 duplicate operand
 *     surfaces in 25 packs**, which is a QG-1 failure. Reverted. The sentence now
 *     says what is true and what is not: 16.8% of Form-B pairs recur from Form A
 *     and 40.6% from the days, over 3,000 packs. What DOES hold is separately
 *     enforced and is the guarantee that matters — `drawUniqueItem` signs every
 *     page on its two counts, so no two pages in a pack print the same pair of
 *     numbers in the same format class (0 duplicate surfaces over 3,000 packs),
 *     and a repeated (count, kind) lands in a different picture, on a different
 *     day, under a different question.
 */

import type { BBFigure, FigureAssertion } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  countArrangement,
  howManyChoice,
  setForNumeral,
  tenFrameEmpty,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsParam, counterGroups } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Eight names, one drawn per story. Nothing below hardcodes one of them (kit §F.3). */
const NAMES = ['Sofia', 'Idris', 'Runa', 'Pablo', 'Yara', 'Niko', 'Della', 'Corin'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/** Every row this week compares holds three to nine things. */
const LO = 3;
const HI = 9;
/** The widest gap between two compared rows: near-equal sets are where the trap lives. */
const MAX_GAP = 3;

// ---------------------------------------------------------------------------
// TEN WORDS, COUNTED THE WAY THE GATE COUNTS THEM
//
// Two ceilings exist and only one of them is the law. `earlynumber`'s `ask()`
// weighs a whole prompt string, so a two-sentence puppet page trips a limit it
// never breaks, and nothing at all weighs a hint rung, a guided-example step or
// the lesson's spoken lines. `bb-readability-test` weighs one SENTENCE at a time
// on every surface a child hears, and that is the measurement this file has to
// pass. Its splitter and its word counter are mirrored below and every authored
// string is pushed through them, so an eleventh word throws when the module
// loads or when the item is drawn — never at review time.
//
// Alt text does not come through here, and must not. It is the whole of what a
// screen-reader child has instead of the picture, and this week's pictures are
// two rows whose SPACING is the content; shortening them means dropping either
// the rows or the spacing, and the spacing is the item.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A5: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** The scene rides in a bracket; only the question after it is a capped sentence. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Rungs, each pushed through the ceiling. Nothing here names a child or a number. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Swap in help written for THIS week without reaching into `lib/`.
 *
 * A ladder may appear at most twice across the fifteen non-retrieval core items,
 * which puts a floor of eight distinct ladders under the week and made the
 * ladder count a design input rather than an afterthought (kit §E, A-band lesson
 * 1); twelve are shipped. The arithmetic is only half of it. The help genuinely
 * wants to differ: a first meeting wants "give everyone a partner", a spread
 * page wants "do not trust the gaps", a story wants "start at the same end", and
 * none of those could be said in the shared family without being said in all 24
 * Level-A weeks at once — which is the sameness `bb-cross-week-test` reads the
 * whole corpus to find.
 *
 * The closure rewrites one field of an already-built draft and draws nothing
 * itself, so the prompt QG-1 and QG-4 sign for freshness is untouched.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Bring an earlier week's own item back as today's warm-up.
 *
 * Band A sets no minimum on warm-up formats, so each of the four has to earn its
 * minute. What decided them is what comparing actually rests on: counting a row
 * without losing your place (A1), reading what is missing from a frame rather
 * than what is in it (A2), and putting a NAME on a count in both directions —
 * picture to numeral (A3) and numeral to picture (A4). Without the last two,
 * "more" has nothing to be more THAN.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The picture: two (or three) rows, one of them spread
// ===========================================================================

interface RowSpec {
  count: number;
  noun: string;
  /** Multiplies THIS row's spacing only. Omitted means a tight row. */
  spread?: number;
}

/**
 * How much to open a row out so that it is unmistakably the longer one.
 *
 * A row's drawn width is `count × pitch × spread`, and the counters keep the
 * unscaled pitch's radius, so opening a row lengthens it without growing
 * anything in it. The factor is whichever is larger of "three fifths again as
 * long as itself" and "45% longer than the other row", which means the spread
 * row reads as the long one whether it holds more things or fewer — and that is
 * the whole trick, because a child cannot then use length as a proxy for either.
 *
 * THE FLOOR OF 1.6 IS THE PROSE'S, not the pedagogy's. The comparison already
 * works at 1.35, which is what this shipped with until a generated week was read
 * back: at 1.35 the gap between two counters' edges roughly doubles, which the
 * eye reads as "looser" but which the alt was calling "spread far apart" — a
 * description doing more work than the picture. At 1.6 it is triple, and the
 * sentence a screen-reader child hears is true of the drawing.
 *
 * The ceiling matters for the drawing. With counts capped at nine and the gap
 * between two rows capped at three, the widest a row can ever be is 14.4 pitch
 * units, so `CountersFig` keeps a pitch near 17 and a counter radius near 6 —
 * no row is ever squeezed to a smudge to fit the frame.
 */
function spreadFor(spreadCount: number, otherCount: number): number {
  const wanted = Math.max(spreadCount * 1.6, otherCount * 1.45);
  return Math.round((wanted / spreadCount) * 100) / 100;
}

/**
 * The comparison picture.
 *
 * `showPairs` and `markExtra` are reachable ONLY through this helper and are
 * passed only by the lesson script and the guided examples (disclosure 7).
 * `counterGroups` does not expose them, which is what keeps them off every
 * assessed item by construction rather than by memory.
 */
function rowsFigure(
  rows: readonly RowSpec[],
  opts: { alt: string; asserts?: FigureAssertion; showPairs?: boolean; markExtra?: boolean },
): BBFigure {
  const base = counterGroups(
    rows.map((row) => ({
      count: row.count,
      noun: row.noun,
      label: row.noun,
      ...(row.spread !== undefined ? { spread: row.spread } : {}),
    })),
    { relation: 'compare', alt: opts.alt, ...(opts.asserts ? { asserts: opts.asserts } : {}) },
  );
  if (base.type !== 'counters' || (!opts.showPairs && !opts.markExtra)) return base;
  return {
    ...base,
    params: {
      ...base.params,
      ...(opts.showPairs ? { showPairs: true } : {}),
      ...(opts.markExtra ? { markExtra: true } : {}),
    },
  };
}

// ===========================================================================
// The draw — three independent coins, which is what puts the habits at chance
// ===========================================================================

interface Laid {
  /** Top row. */
  a: number;
  nounA: string;
  /** Bottom row. */
  b: number;
  nounB: string;
  /** True when the TOP row is the one opened out. */
  spreadTop: boolean;
  /** The multiplier the spread row carries. */
  spread: number;
}

/**
 * Two rows, laid out.
 *
 * THREE THINGS ARE DRAWN AND NONE OF THEM LOOKS AT THE OTHERS: whether the two
 * counts are EQUAL, which row is SPREAD, and which row is BIGGER. That
 * independence is the week's whole guarantee — it is why "tap the long row" and
 * "tap the short row" are each worth exactly one third on a three-option page,
 * and why neither the trap nor its mirror can be learnt.
 *
 * A tie is drawn ONE TIME IN THREE, which is the number that puts every habit
 * on the floor: two thirds of pages have a winner, a coin decides whether it is
 * the opened-out row, so "the long row has more" is right on a third of draws —
 * exactly what a card is worth to a guesser on a three-card page. It also makes
 * "the same" a real answer rather than an ornament, which the recipe's own title
 * demands. The puppet's page builds its own layout, because his claim has to be
 * false (see `puppetSpread`).
 */
function layOut(r: Rng, dealtTie?: boolean): Laid {
  const [nounA, nounB] = r.shuffle([...COUNTABLE_NOUNS]);
  const spreadTop = r.chance(0.5);
  // `dealtTie` is supplied ONLY by a mastery slot, whose verdict was dealt for
  // the whole form before any of its pages were built (`dealVerdicts`). A daily
  // page passes nothing and flips the coin here exactly as it always did, which
  // is why every daily draw in this week is unchanged.
  const tie = dealtTie ?? r.int(1, 3) === 1;

  let a: number;
  let b: number;
  if (tie) {
    a = r.int(LO, HI);
    b = a;
  } else {
    const gap = r.int(1, MAX_GAP);
    const small = r.int(LO, HI - gap);
    const big = small + gap;
    // Which row holds the bigger count — a coin that knows nothing about
    // `spreadTop`, and that independence is the week's whole guarantee.
    const topBigger = r.chance(0.5);
    a = topBigger ? big : small;
    b = topBigger ? small : big;
  }

  const spreadCount = spreadTop ? a : b;
  const otherCount = spreadTop ? b : a;
  return { a, nounA, b, nounB, spreadTop, spread: spreadFor(spreadCount, otherCount) };
}

function rowsOf(p: Laid): RowSpec[] {
  return [
    { count: p.a, noun: p.nounA, ...(p.spreadTop ? { spread: p.spread } : {}) },
    { count: p.b, noun: p.nounB, ...(p.spreadTop ? {} : { spread: p.spread }) },
  ];
}

/**
 * THE BRACKET KEEPS THE COUNTS AND THE ALT NEVER GETS THEM, and the split is
 * load-bearing at both ends.
 *
 * `promptText` strips the `[image: …]` bracket before anything reaches the
 * screen, and `speakablePrompt` prefers `figure.alt` over it, so the bracket
 * reaches nobody here — but it carries the two numeric tokens QG-1 and the
 * pack's uniqueness guard sign this item with, and emptying it would make
 * `signatureOf` return null and the item stop being guarded at all (L29, and
 * a01's own two-heap slot). The ALT is what a four-year-old actually HEARS,
 * before the question is even asked, so it names the two kinds and the two
 * LAYOUTS and no quantity whatever — and a number word is a number, so "a pair"
 * and "a handful" would be the same leak spelled differently.
 *
 * This week is the hardest case in the level for that rule, because the layout
 * is not decoration here: which row is opened out is the illusion under test, so
 * an alt that dropped it would leave a screen-reader child with no item at all.
 * Saying "one row is spread far apart, one is tight" gives away nothing, because
 * the spread row has more exactly as often as it has fewer.
 */
function sceneOf(p: Laid): string {
  const top = p.spreadTop
    ? `a row of ${countNoun(p.a, p.nounA)} spread far apart`
    : `a tight row of ${countNoun(p.a, p.nounA)}`;
  const bottom = p.spreadTop
    ? `a tight row of ${countNoun(p.b, p.nounB)}`
    : `a row of ${countNoun(p.b, p.nounB)} spread far apart`;
  return `${top} above ${bottom}`;
}

function altOf(p: Laid): string {
  const top = p.spreadTop
    ? `a row of ${unitFor(2, p.nounA)} spread far apart`
    : `a tight row of ${unitFor(2, p.nounA)}`;
  const bottom = p.spreadTop
    ? `a tight row of ${unitFor(2, p.nounB)}`
    : `a row of ${unitFor(2, p.nounB)} spread far apart`;
  return `${top} above ${bottom}`;
}

/** "they are the same" is what `a_compare_sets_v1` returns on an equal draw. */
const TIE_TRUTH = 'they are the same';

// ===========================================================================
// THE VERDICTS OF A MASTERY FORM ARE DEALT, NOT DRAWN ONE PAGE AT A TIME
// ===========================================================================

/**
 * A BALANCED POOL IS NOT A BALANCED PAGE, and this week is where that bites.
 *
 * Every certifying slot keys "the same" on a third of its draws, and the six are
 * independent, so the number of "same" answers a single child meets in one form
 * is Binomial(6, 1/3). Measured over 600 forms before this deal: 8.8% of forms
 * key it on four slots or more and 0.2% on five or more. The mastery pass mark is
 * MASTERY_THRESHOLD_PCT = 80, which is five of six — so in that tail a child who
 * taps "the same" on every page passes the week without comparing anything, and
 * seed 11 sat in it with eight of its twelve mastery slots keyed "same". A pool
 * balanced across thousands of packs is exactly the wrong instrument here: the
 * guarantee has to hold for the ONE form in front of the ONE child (the A20
 * lesson, applied to a verdict instead of a balance).
 *
 * So the count is dealt PER FORM, out of the pack's own `TupleGuard`, before any
 * mastery page is built, and it is capped at three of six. Two properties fall
 * out and both are exact rather than approximate:
 *
 *   · THE CAP. Three of six is 50%, and the pass mark is 80%, so "answer the
 *     same every time" cannot promote a child out of ANY form — not rarely, not
 *     in expectation, never.
 *   · THE MARGINAL IS UNTOUCHED. `k` is uniform on {1, 2, 3}, so E[k] = 2, and
 *     the k slots are chosen uniformly among the six — so every slot keys "the
 *     same" on exactly 2/6 = one third of its draws, which is what it was. No
 *     slot becomes the one where the tie cannot happen, and no rank moves.
 *
 * The floor of one is not decoration either: it makes "the same" a live, keyed
 * card in every single form, which is what this week's own claim that a tie is a
 * third of the concept requires. And it is a DEAL rather than a re-weighted
 * draw — the schedule is fixed before the first page exists, so nothing here can
 * be rescued by luck and nothing loops until it succeeds (L19).
 */
const MASTERY_SLOTS = 6;
const SAME_MIN = 1;
const SAME_MAX = 3;

/**
 * IS THERE STILL A TIE PAGE LEFT TO DRAW? — the one place the deal must yield.
 *
 * A tie prints ONE number twice, so a tied page's whole surface space is the
 * seven signatures `<type>|n,n` for n in 3–9, and `drawUniqueItem` refuses a
 * repeat across the pack. Left to itself that is self-correcting: the tie is
 * drawn INSIDE the guarded closure, so when the space fills, a redraw simply
 * comes back with a winner instead — which is why the unconstrained week tops
 * out at seven tied comparison pages (measured over 3,000 packs: 7 on 0.5% of
 * them, 8 on none) and never duplicates a surface.
 *
 * A DEALT tie has no such escape, and building it without this check proved it:
 * 29 duplicate operand surfaces in 25 of 600 packs, every one of them a
 * `classification|n,n` on a Form-B page, which is a QG-1 failure. So the deal
 * yields — if no tied signature is free for this page's format class, the page
 * draws a winner. That direction is always safe, because the whole point of the
 * cap is that a form may not carry TOO MANY ties; one fewer cannot break it.
 * Measured after the yield: 0 duplicate surfaces over 3,000 packs, and the yield
 * fires rarely enough to leave every slot's tie rate on its third.
 */
function tieRoomLeft(guard: TupleGuard, type: string): boolean {
  for (let n = LO; n <= HI; n++) if (!guard.taken(`${type}|${String(n)},${String(n)}`)) return true;
  return false;
}

/** The dealt verdict, after the surface space has had its say. */
function tieAfterYield(guard: TupleGuard, type: string, dealtTie?: boolean): boolean | undefined {
  return dealtTie === true && !tieRoomLeft(guard, type) ? false : dealtTie;
}

/** One draw per form, on the form's own stream, at its first page. Idempotent. */
function dealVerdicts(r: Rng, guard: TupleGuard, form: 'A' | 'B'): void {
  if (guard.taken(`a5:sched:${form}`)) return;
  guard.add(`a5:sched:${form}`);
  const k = r.int(SAME_MIN, SAME_MAX);
  const slots = Array.from({ length: MASTERY_SLOTS }, (_, i) => i);
  for (const slot of r.shuffle(slots).slice(0, k)) guard.add(`a5:tie:${form}:${String(slot)}`);
}

/**
 * A mastery slot: it knows which form it is in, so it can be dealt a verdict.
 *
 * FORM DETECTION IS THE WHOLE TRICK and it is a property of the assembler rather
 * than a guess: `makeWeekBuilder` builds Form A's six pages, in order, and only
 * then Form B's. So the FIRST time a given slot is entered in a pack it is Form
 * A, and every later entry is Form B — which is also why the assembler's own
 * Form-B core-collision rebuild cannot corrupt anything: a rebuilt Form-B page
 * is detected as Form B again and is dealt the same verdict, so the cap holds
 * whatever the assembler does above it.
 *
 * WHY THE SLOT TAKES A FACTORY. The dealt verdict has to reach `layOut` BEFORE
 * it draws — a verdict fixed after the fact would be a re-weighted draw with a
 * cap bolted on, which is the thing this deal exists not to be — and the
 * generator is built at module load. So the slot holds a `(dealtTie) => ItemGen`
 * and builds its generator once the deal is known. Nothing mutable is stored
 * anywhere: the schedule lives in the `TupleGuard` the whole pack already shares,
 * exactly as A20's balances do.
 *
 * IT DOES NOT ALSO POLICE OPERAND FRESHNESS, and that is measured rather than
 * lazy — see the isomorphNotes and disclosure 10 for the arithmetic. Briefly: a
 * freshness redraw here has to rebuild the whole page, and `drawUniqueItem` has
 * already REGISTERED the rejected draft's surface by the time this wrapper sees
 * it, so every redraw permanently spends one of the seven signatures a tie page
 * can have (`classification|n,n` for n in 3–9). Built and measured over 600
 * packs, that produced 29 duplicate operand surfaces in 25 packs — a QG-1
 * failure — to buy a claim the daily half could never support anyway. Reverted,
 * and the claim rewritten instead.
 */
function masteryPage(make: (dealtTie: boolean) => ItemGen, slot: number): ItemGen {
  const seen = `a5:mform|${String(slot)}`;
  return (rng, guard, difficulty) => {
    const form: 'A' | 'B' = guard.taken(seen) ? 'B' : 'A';
    guard.add(seen);
    dealVerdicts(rng, guard, form);
    return make(guard.taken(`a5:tie:${form}:${String(slot)}`))(rng, guard, difficulty);
  };
}

/**
 * Why a row that is not the answer might be tapped, read off the DRAW rather
 * than off the branch that produced it — so a rationale can never drift from the
 * option it explains. Teacher-facing, so it is not word-capped.
 */
function whyNotThisRow(
  isSpread: boolean,
  tied: boolean,
  which: 'more' | 'fewer',
): { errorTag: ErrorTag; rationale: string } {
  // Read off the DRAW, not off the branch: a card is either the length answer
  // taken straight (long tapped for "more", short tapped for "fewer") or the
  // over-correction that mirrors it. Which one it is depends on the polarity as
  // well as on the row, and getting that backwards would put the mirror's name
  // on the conservation slip half the time.
  const straight = (which === 'more') === isSpread;
  const tail = tied
    ? isSpread
      ? ' Nothing was added to that row — it was only opened out.'
      : ' Nothing was taken from that row — the other one was only opened out.'
    : '';
  return straight
    ? {
      errorTag: 'concept-misconception',
      rationale: `The conservation slip taken straight: the row's LENGTH was read as its number, so the wide gaps did the answering.${tail}`,
    }
    : {
      errorTag: 'concept-misconception',
      rationale: `The over-correction, and it is the mirror of the same belief: told that a long row is not a big one, the child decides a long row must be the small one.${tail}`,
    };
}

// ===========================================================================
// Local generator 1 — which row has more (or fewer)
// ===========================================================================

/**
 * The week's core form: two rows, one opened out, three cards to tap.
 *
 * Every option is keyable on some draw and each is keyed on about a third of
 * them: either noun when the counts differ, "they are the same" when they do
 * not. There is no never-correct card to strike out and no rank for the answer
 * to sit at, because the answer is a NOUN and the option order is shuffled.
 *
 * The truth is recomputed by the registered `a_compare_sets_v1`, which re-finds
 * the row with more from the two counts in `generator.params` and does not take
 * this file's word for anything; QG-11 checks the keyed option against it at
 * every seed. The bare noun rides in `acceptableForms` because the transform
 * returns "ducks" where the card reads "the ducks".
 */
function comparePair(opts: { which: 'more' | 'fewer'; dealtTie?: boolean }): ItemGen {
  const { which } = opts;
  return (rng, guard, difficulty) => {
    const dealtTie = tieAfterYield(guard, 'classification', opts.dealtTie);
    return drawUniqueItem(rng, guard, (r) => {
      const p = layOut(r, dealtTie);
      const tied = p.a === p.b;
      const winner = tied ? null : which === 'more' ? (p.a > p.b ? p.nounA : p.nounB) : p.a < p.b ? p.nounA : p.nounB;
      const truth = tied ? TIE_TRUTH : winner!;
      const correctText = tied ? TIE_TRUTH : `the ${winner!}`;

      const rowCard = (noun: string) => {
        const isSpread = noun === p.nounA ? p.spreadTop : !p.spreadTop;
        const { errorTag, rationale } = whyNotThisRow(isSpread, tied, which);
        return { text: `the ${noun}`, errorTag, rationale };
      };
      const wrongs = tied
        ? [rowCard(p.nounA), rowCard(p.nounB)]
        : [
          rowCard(winner === p.nounA ? p.nounB : p.nounA),
          {
            text: TIE_TRUTH,
            errorTag: 'representation-misread' as ErrorTag,
            rationale: 'Two rows that finish near the same place are read as the same number, without either being paired off.',
          },
        ];
      const { choices, correctKey } = makeChoices(r, correctText, wrongs);

      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(sceneOf(p), `Which row has ${which}?`),
        figure: rowsFigure(rowsOf(p), { alt: altOf(p), asserts: assertsParam('a', 'group:0') }),
        choices,
        answer: { value: correctKey, acceptableForms: [...new Set([correctText, truth])], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_compare_sets_v1',
          params: { a: p.a, b: p.b, nounA: p.nounA, nounB: p.nounB, which },
          seed: r.uint(),
        },
        hintLadder: hints('Match them up one for one.', 'Whichever row runs out first has fewer.'),
        errorTags: ['concept-misconception', 'representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'compare-rows', isDiscrimination: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 2 — the verdict card: more, fewer, or the same
// ===========================================================================

/**
 * The Day-5 signature, met from Day 2 onward: the child names the RELATION
 * rather than a row.
 *
 * Three things are drawn independently — the verdict, which row the question
 * names, and which row is opened out — so "answer more every time" is worth a
 * third, and so is "answer more when the named row is the long one". Both are
 * the chance floor for three cards.
 *
 * The keyed truth comes from `a_compare_sets_v1` with the two counts LABELLED
 * "more" and "fewer" (disclosure 5). The transform still does the comparing; the
 * labels are what turn its answer into the verdict.
 */
function sortVerdict(dealt?: boolean): ItemGen {
  return (rng, guard, difficulty) => {
    const dealtTie = tieAfterYield(guard, 'reasoning', dealt);
    return drawUniqueItem(rng, guard, (r) => {
      const [nounA, nounB] = r.shuffle([...COUNTABLE_NOUNS]);
      const spreadTop = r.chance(0.5);
      const askTop = r.chance(0.5);
      // A daily page draws all three verdicts evenly, as it always did. A mastery
      // page takes the verdict its FORM was dealt (`dealVerdicts`) and then draws
      // evenly between the two that remain, so "more", "fewer" and "the same" are
      // each still keyed on exactly a third of the slot's draws.
      const verdict =
        dealtTie === undefined
          ? ['more', 'fewer', 'same'][r.int(0, 2)]
          : dealtTie
            ? 'same'
            : ['more', 'fewer'][r.int(0, 1)];

      // The GAP is drawn first and the other row is then drawn from the counts
      // that leave the asked row inside 3-9. Drawing the other row first and
      // stepping the asked one off it pins that row to 6 on every draw — the
      // whole range collapses to one value, the pack's freshness guard runs out
      // of surfaces, and two mastery slots print the same two numbers. Measured:
      // it failed QG-1 at seed 211 before the order was inverted.
      const gap = r.int(1, MAX_GAP);
      const other =
        verdict === 'same' ? r.int(LO, HI) : verdict === 'more' ? r.int(LO, HI - gap) : r.int(LO + gap, HI);
      const asked = verdict === 'same' ? other : verdict === 'more' ? other + gap : other - gap;
      const a = askTop ? asked : other;
      const b = askTop ? other : asked;
      const spread = spreadFor(spreadTop ? a : b, spreadTop ? b : a);
      const p: Laid = { a, nounA, b, nounB, spreadTop, spread };
      const askedNoun = askTop ? nounA : nounB;

      const cardText = verdict === 'same' ? 'the same' : verdict;
      const truth = verdict === 'same' ? TIE_TRUTH : verdict;
      const askedIsSpread = askTop === spreadTop;
      const CARDS: Record<string, { text: string; errorTag: ErrorTag; rationale: string }> = {
        more: {
          text: 'more',
          errorTag: askedIsSpread ? 'concept-misconception' : 'representation-misread',
          rationale: askedIsSpread
            ? 'The named row is the opened-out one, so its length was read as its number — the conservation slip.'
            : 'The named row is the tight one and still called bigger, which is the guess "more" made without pairing.',
        },
        fewer: {
          text: 'fewer',
          errorTag: askedIsSpread ? 'representation-misread' : 'concept-misconception',
          rationale: askedIsSpread
            ? 'The opened-out row called smaller, which is what happens when gaps are mistaken for empty places.'
            : 'The mirror of the trap: the short row is assumed to hold less because it takes up less room.',
        },
        'the same': {
          text: 'the same',
          errorTag: 'procedure-slip',
          rationale: 'Pairing stopped before the ends of both rows, so the leftovers were never reached.',
        },
      };
      const wrongs = Object.values(CARDS).filter((c) => c.text !== cardText);
      const { choices, correctKey } = makeChoices(r, cardText, wrongs);

      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(sceneOf(p), `Do the ${askedNoun} have more, fewer, or the same?`),
        figure: rowsFigure(rowsOf(p), {
          alt: altOf(p),
          asserts: assertsParam('a', askTop ? 'group:0' : 'group:1'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [...new Set([cardText, truth])], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          // `a` is the NAMED row and `b` the other one, so the figure's assertion
          // follows the question rather than the drawing order. See disclosure 5
          // for why the two labels are the verdict words.
          templateId: 'a_compare_sets_v1',
          params: { a: asked, b: other, nounA: 'more', nounB: 'fewer', which: 'more' },
          seed: r.uint(),
        },
        hintLadder: hints('Give each one below a partner above.', 'Left over on top? Then the top row wins.'),
        errorTags: ['concept-misconception', 'representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'name-the-relation' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 3 — help the puppet (the recipe's own slip)
// ===========================================================================

/**
 * A named puppet says the opened-out row has more, and it never does.
 *
 * The word "wrong" never appears; the puppet is "mixed up" and the child settles
 * it by pairing. His claim is READ OFF THE DRAWN LAYOUT by code — it is whichever
 * row this item spread — so nothing about it is authored, and the TRUTH, the only
 * half a wrong key could corrupt, is recomputed by `a_compare_sets_v1`. That
 * transform returns no `wrong` value, and it does not need to: the slip's output
 * here is a ROW, not a number, exactly as A20's size slip was an OBJECT.
 */
function puppetSpread(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const [nounA, nounB] = r.shuffle([...COUNTABLE_NOUNS]);
      const spreadTop = r.chance(0.5);
      // WHICH ROW THE QUESTION ASKS ABOUT IS DRAWN, AND THAT IS WHAT KEEPS THE
      // PUPPET'S OWN CARD ALIVE (measured, and it is disclosure 4).
      //
      // The first build asked about the row he names on every page. His claim is
      // "the opened-out row has more" and error analysis requires it to be
      // false, so "more" was then a card offered on 100% of draws and keyed on
      // none of them — the dead-option shape L38 calls worse than no option at
      // all, in the one place this week shows the misconception by name. Drawing
      // the asked row instead leaves the slip untouched and makes every card
      // live: asked about the row he names, the answer is "fewer" or "the same";
      // asked about the other row it is "more" or "the same"; and the child has
      // to map his claim onto the row in the question before "the puppet is
      // mixed up" is worth anything.
      const askTop = r.chance(0.5);
      const tie = r.int(1, 3) === 1;
      const gap = r.int(1, MAX_GAP);
      // The row he points at NEVER holds more — that is what makes him wrong.
      const spreadCount = tie ? r.int(LO, HI) : r.int(LO, HI - gap);
      const otherCount = tie ? spreadCount : spreadCount + gap;
      const a = spreadTop ? spreadCount : otherCount;
      const b = spreadTop ? otherCount : spreadCount;
      const p: Laid = {
        a,
        nounA,
        b,
        nounB,
        spreadTop,
        spread: spreadFor(spreadTop ? a : b, spreadTop ? b : a),
      };
      const spreadNoun = spreadTop ? nounA : nounB;
      const askedNoun = askTop ? nounA : nounB;
      const asked = askTop ? a : b;
      const versus = askTop ? b : a;
      const askedIsSpread = askTop === spreadTop;

      const cardText = asked === versus ? 'the same' : asked > versus ? 'more' : 'fewer';
      const truth = asked === versus ? TIE_TRUTH : cardText;
      const CARDS: Record<string, { text: string; errorTag: ErrorTag; rationale: string }> = {
        more: {
          text: 'more',
          errorTag: 'concept-misconception',
          rationale: askedIsSpread
            ? 'The puppet\'s own belief, taken on trust: the row with the wide gaps is longer, so he reads it as the bigger number.'
            : 'The tight row called bigger without any pairing — "more" chosen because the question said the word.',
        },
        fewer: {
          text: 'fewer',
          errorTag: 'representation-misread',
          rationale: askedIsSpread
            ? 'Over-corrected. Told that long does not mean more, the child decides long must mean less instead.'
            : 'The wide gaps read as empty places, so the row with fewer gaps is judged the smaller one.',
        },
        'the same': {
          text: 'the same',
          errorTag: 'procedure-slip',
          rationale: 'Pairing stopped at the end of the shorter row, so the leftover partners were never met.',
        },
      };
      const wrongs = Object.values(CARDS).filter((c) => c.text !== cardText);
      const { choices, correctKey } = makeChoices(r, cardText, wrongs);

      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(
          sceneOf(p),
          `${puppet} says the ${spreadNoun} have more. Do the ${askedNoun} have more, fewer, or the same?`,
        ),
        figure: rowsFigure(rowsOf(p), {
          alt: altOf(p),
          asserts: assertsParam('a', askTop ? 'group:0' : 'group:1'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [...new Set([cardText, truth])], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_compare_sets_v1',
          params: { a: asked, b: versus, nounA: 'more', nounB: 'fewer', which: 'more' },
          seed: r.uint(),
        },
        hintLadder: hints('Go slowly and pair the rows with the puppet.', 'Gaps make a row long. They add nothing to it.'),
        errorTags: ['concept-misconception', 'representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — the Day-4 real-world picture problem
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family has no comparison story at all, so the three frames live here.
 *
 * Each frame supplies only a surface and a verb; the two kinds of thing are
 * DRAWN per item, so no scene in this week is welded to a noun and none can
 * collide with a sibling week's fixed cast.
 */
interface StoryFrame {
  /** The story sentence. Names the kinds and neither count. */
  line: (name: string, kindA: string, kindB: string) => string;
  ladder: string[];
}

const STORY_FRAMES: Record<'tray' | 'sill' | 'bench', StoryFrame> = {
  tray: {
    line: (name, kA, kB) => `${name} lays the ${kA} and ${kB} on a tray.`,
    ladder: ['Line them up and pair them off.', 'One left with no partner settles it.'],
  },
  sill: {
    line: (name, kA, kB) => `${name} lines up the ${kA} and ${kB} on a sill.`,
    ladder: ['Start at the same end of both rows.', 'Stop when one row has run out.'],
  },
  bench: {
    line: (name, kA, kB) => `${name} sets the ${kA} and ${kB} out on a bench.`,
    ladder: ['Point at one, then at its partner below.', 'Any with nobody to pair with? Those are spare.'],
  },
};

function compareStory(which: 'tray' | 'sill' | 'bench', opts: { ask: 'more' | 'fewer'; dealtTie?: boolean }): ItemGen {
  const frame = STORY_FRAMES[which];
  const { ask } = opts;
  return (rng, guard, difficulty) => {
    const dealtTie = tieAfterYield(guard, 'word-problem', opts.dealtTie);
    return drawUniqueItem(rng, guard, (r) => {
      const p = layOut(r, dealtTie);
      const name = one(r);
      const tied = p.a === p.b;
      const winner = tied ? null : ask === 'more' ? (p.a > p.b ? p.nounA : p.nounB) : p.a < p.b ? p.nounA : p.nounB;
      const truth = tied ? TIE_TRUTH : winner!;
      const correctText = tied ? TIE_TRUTH : `the ${winner!}`;

      const rowCard = (noun: string) => {
        const isSpread = noun === p.nounA ? p.spreadTop : !p.spreadTop;
        const { errorTag, rationale } = whyNotThisRow(isSpread, tied, ask);
        return { text: `the ${noun}`, errorTag, rationale };
      };
      const wrongs = tied
        ? [rowCard(p.nounA), rowCard(p.nounB)]
        : [
          rowCard(winner === p.nounA ? p.nounB : p.nounA),
          {
            text: TIE_TRUTH,
            errorTag: 'task-comprehension' as ErrorTag,
            rationale: 'The story is answered from the picture as a whole ("about the same") instead of from the pairing it asks for.',
          },
        ];
      const { choices, correctKey } = makeChoices(r, correctText, wrongs);

      const draft: ItemDraft = {
        type: 'word-problem',
        // NO GIVEN: the sentence names the two kinds and neither quantity, so the
        // only place either count exists is the drawing.
        // THE TRAY, THE SILL AND THE BENCH STAY IN THE STORY AND OUT OF THE
        // PICTURE. No primitive draws furniture, so an alt reading "on a tray"
        // would describe a surface that does not exist (the L27 class), and it
        // also said the phrase twice in the spoken line, once from the scene and
        // once from the sentence. The picture is two rows, so the alt is two
        // rows; where they were laid out is narration and lives in the question.
        prompt: scenePrompt(
          sceneOf(p),
          `${frame.line(name, unitFor(2, p.nounA), unitFor(2, p.nounB))} Which row has ${ask}?`,
        ),
        figure: rowsFigure(rowsOf(p), { alt: altOf(p), asserts: assertsParam('a', 'group:0') }),
        choices,
        answer: { value: correctKey, acceptableForms: [...new Set([correctText, truth])], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_compare_sets_v1',
          params: { a: p.a, b: p.b, nounA: p.nounA, nounB: p.nounB, which: ask },
          seed: r.uint(),
        },
        hintLadder: hints(...frame.ladder),
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'compare-story', situationType: 'comparison' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 5 — the Day-5 sort, with the telling left open
// ===========================================================================

/**
 * THE WIDTH ORDER OF A THREE-ROW FIGURE IS DRAWN, NOT INHERITED FROM THE COUNTS.
 *
 * Shuffling three fixed multipliers across three rows is not enough, and this is
 * the second thing reading a generated week found: a row's width is `count x
 * spread`, so with multipliers only reaching 1.85 the count still decides most
 * of the ordering. Measured over 3,000 packs, "sort the rows by how long they
 * are" gave the right order on 41.6% of Day-5 sorts against a 16.7% floor for
 * three cards — two and a half times chance, on the one page whose whole point
 * is that length does not order sets.
 *
 * So the ranking is drawn FIRST, uniformly over the six orders, and the spreads
 * are then solved to realise it: the rows take target widths of the largest
 * count times 1, 1.28 and 1.6 in the drawn order, and each row's multiplier is
 * its target divided by its own count. That is always at least 1 — no row is
 * ever compressed — because the narrowest target is the largest count itself.
 * Width order and count order are then independent by construction, so every
 * length rule is worth exactly its 1-in-6, and no two rows are ever drawn the
 * same width (they were, on 3.4% of puzzles, before this).
 *
 * It also draws BIGGER counters than the shuffle did: the widest row is now 1.6
 * times the largest count rather than 1.85 times it.
 */
const WIDTH_STEPS = [1, 1.28, 1.6] as const;

function scrambleWidths(r: Rng, counts: readonly number[]): number[] {
  const biggest = Math.max(...counts);
  const rank = r.shuffle(counts.map((_, i) => i));
  const spread: number[] = counts.map(() => 1);
  rank.forEach((row, place) => {
    spread[row] = Math.round(((biggest * WIDTH_STEPS[place]) / counts[row]) * 100) / 100;
  });
  return spread;
}

/**
 * Sort three rows fewest-first and SAY how you knew.
 *
 * The family's `sortAndTell` draws its three groups at a shared pitch, so
 * ordering them by length scores full marks and the sorting is never done. Here
 * each row carries its own spacing, drawn independently of its count, so the
 * lengths and the numbers disagree and the only way through is to count or to
 * pair. The order is checkable by an adult with the page in front of them; the
 * telling is the flagged open part, and it is also the item that satisfies the
 * dual-strand coupling gate.
 */
function sortRows(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // THREE CONSECUTIVE COUNTS, so that any width order is reachable: a row of
      // three can be drawn wider than a row of five, but nothing inside a spread
      // this week will draw a three wider than an eight.
      const base = r.int(LO, HI - 2);
      const counts = r.shuffle([base, base + 1, base + 2]);
      const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
      const spreads = scrambleWidths(r, counts);
      // A spread of exactly 1 IS the default, so it is left off rather than
      // written down — an emitted `spread: 1` draws the same picture and makes
      // a figure look parameterised where it is not.
      const rows: RowSpec[] = counts.map((c, i) => ({
        count: c,
        noun: nouns[i],
        ...(spreads[i] === 1 ? {} : { spread: spreads[i] }),
      }));
      const order = counts
        .map((c, i) => ({ c, noun: nouns[i] }))
        .sort((x, y) => x.c - y.c)
        .map((e) => e.noun);
      const scene = `three rows: ${counts.map((c, i) => countNoun(c, nouns[i])).join(', ')}`;

      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(scene, 'Sort the rows. Fewest first. Tell how you know.'),
        figure: rowsFigure(rows, {
          // Kinds and spacing, never the counts: the three counts said aloud ARE
          // the order the item asks for. "Spaced out differently" and not "with
          // different gaps", because two rows CAN come out on the same
          // multiplier — the solver fixes three distinct WIDTHS, not three
          // distinct spacings, and an alt has to be true of every draw it
          // describes rather than of the one that was read.
          alt: `three rows, spaced out differently: ${unitFor(2, nouns[0])}, ${unitFor(2, nouns[1])} and ${unitFor(2, nouns[2])}`,
          asserts: assertsParam('a', 'group:0'),
        }),
        answer: { value: order.join(', '), acceptableForms: [], validation: 'manual-review' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_sort_and_tell_v1', params: { a: counts[0] }, seed: r.uint() },
        hintLadder: hints('Numbers decide this order, not lengths.', 'Count all three rows first, then place them.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'sort-and-tell' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — give a family counting warm-up the buttons it needs
// ===========================================================================

/**
 * A band-A numeric item with no authored `choices` is not a free-entry page: it
 * is four buttons a render-time function invents, and that function cannot know
 * the slot's answer range (L53). Both `countArrangement` and `tenFrameEmpty`
 * arrive that way, so each is given THE WHOLE RANGE ITS OWN DRAW CAN PRODUCE as
 * its three options.
 *
 * That deletes the dead option rather than diluting it: with the range drawn
 * across exactly three values, every option is keyed on some draw and none can
 * be struck out unread. The set being constant carries no information — it is
 * the same three numerals whatever the picture holds — while the key's RANK
 * moves with the drawn count, which is the opposite of the fixed rank L43 is
 * about.
 *
 * It also takes back an audit it would otherwise lose. A choice-key answer is
 * not re-derived by QG-5, so the wrapper re-reads the item's own
 * `generator.params` and refuses to build if the picture and the key have parted
 * company. Takes no rng draw before `base` and leaves the prompt and the figure
 * untouched, so the surface QG-1 signs is unchanged.
 */
function withRangeChoices(
  base: ItemGen,
  opts: {
    lo: number;
    hi: number;
    from: (params: Record<string, unknown>) => number;
    /** `k` is HOW FAR out the option is — one too many is not the same slip as two. */
    over: (k: number) => string;
    under: (k: number) => string;
  },
): ItemGen {
  if (opts.hi - opts.lo !== 2) {
    throw new Error(
      `A5 withRangeChoices: the options ARE the drawn range, so it must hold three values (got ${String(opts.lo)}-${String(opts.hi)})`,
    );
  }
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error('A5 withRangeChoices: the item carries no generator params to re-check from');
    const n = opts.from(params);
    // A generator that already keys a CHOICE states its numeral in
    // `acceptableForms`, because `answer.value` is then a key letter. Both
    // shapes are re-checked against the picture; neither is trusted.
    const stated = [draft.answer.value, ...draft.answer.acceptableForms];
    if (!Number.isInteger(n) || !stated.includes(String(n))) {
      throw new Error(
        `A5 withRangeChoices: ${draft.generator?.templateId ?? 'an item'} keyed "${draft.answer.value}", but its picture gives ${String(n)}`,
      );
    }
    if (n < opts.lo || n > opts.hi) {
      throw new Error(
        `A5 withRangeChoices: an answer of ${String(n)} fell outside ${String(opts.lo)}-${String(opts.hi)}, so an option would be unreachable`,
      );
    }
    const wrongs: Array<{ text: string; errorTag: ErrorTag; rationale: string }> = [];
    for (let v = opts.lo; v <= opts.hi; v++) {
      if (v === n) continue;
      wrongs.push(
        v > n
          ? { text: String(v), errorTag: 'representation-misread' as ErrorTag, rationale: opts.over(v - n) }
          : { text: String(v), errorTag: 'procedure-slip' as ErrorTag, rationale: opts.under(n - v) },
      );
    }
    const { choices, correctKey } = makeChoices(rng, String(n), wrongs);
    return {
      ...draft,
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
    };
  };
}

// ===========================================================================
// The week's generators, bound and given this week's voice
// ===========================================================================

// --- the four warm-ups ------------------------------------------------------

/** A1 — count a row without losing your place. Three counts drawn, three offered. */
const warmCountRow = warmUp(
  withHints(
    withRangeChoices(countArrangement({ min: 3, max: 5, arrangement: 'in a row' }), {
      lo: 3,
      hi: 5,
      from: (p) => Number(p.n),
      over: (k) => `${k === 1 ? 'One' : 'Two'} too many: the pointing hand doubled back over ${k === 1 ? 'a counter' : 'two counters'} it had already had.`,
      under: (k) => `${k === 1 ? 'One' : 'Two'} too few: the row carried on past the place where the counting stopped.`,
    }),
    hints('Touch the first one and say one.', 'Do not stop until the row runs out.'),
  ),
  1,
);

/** A2 — the frame, read for what is MISSING. Seven to nine filled leaves one to three empty. */
const warmEmptyBoxes = warmUp(
  withHints(
    withRangeChoices(tenFrameEmpty({ min: 7, max: 9, size: 10 }), {
      lo: 1,
      hi: 3,
      from: (p) => Number(p.cap) - Number(p.filled),
      over: (k) => `${k === 1 ? 'One' : 'Two'} too many: ${k === 1 ? 'a box with a counter in it was' : 'two boxes with counters in them were'} counted as empty.`,
      under: (k) => `${k === 1 ? 'One' : 'Two'} too few: ${k === 1 ? 'an empty box at the end of the row was' : 'two empty boxes at the end of the row were'} passed over.`,
    }),
    hints('Some boxes are still waiting to be filled.', 'Touch each waiting box and say a number.'),
  ),
  2,
);

/**
 * A3 — picture to numeral: a count has a name.
 *
 * The family builds this page's options from the drawn count ±1 and ±2, which
 * at a floor of three offers "1" and at a ceiling of five offers "6" and "7" —
 * numbers no draw of the slot can ever key. Measured before the wrapper: 6 on
 * 26.3% of draws, 1 on 16.3%, 7 on 9.0%, all keyed 0.0%. It is retrieval and it
 * certifies nobody, but a rate nobody writes down is a rate nobody fixes, so it
 * gets the same three-value range the other two counting warm-ups get.
 */
const warmTapNumeral = warmUp(
  withHints(
    withRangeChoices(howManyChoice({ min: 3, max: 5 }), {
      lo: 3,
      hi: 5,
      from: (p) => Number(p.n),
      over: (k) => `${k === 1 ? 'One' : 'Two'} too many: ${k === 1 ? 'a thing was' : 'two things were'} met a second time and given a second number.`,
      under: (k) => `${k === 1 ? 'One' : 'Two'} too few: the numbers ran out before the row did.`,
    }),
    hints('Count the row first. Only then read the cards.', 'Your last number is the one to tap.'),
  ),
  3,
);

/** A4 — numeral to picture, the other direction. */
const warmFindGroup = warmUp(
  withHints(
    setForNumeral({ min: 6, max: 10, groups: 3 }),
    hints('Finish one group before you start another.', 'Only one group ends on that number.'),
  ),
  4,
);

// --- the core forms ---------------------------------------------------------

const meetPairing = withHints(
  comparePair({ which: 'more' }),
  hints('Give every one on top a partner below.', 'Some left with no partner? Those are spare.'),
);
const meetFewer = withHints(
  comparePair({ which: 'fewer' }),
  hints('Pair them off, then look at what is left.', 'Spare ones on top mean the top row is bigger.'),
);
const spreadTrap = withHints(
  comparePair({ which: 'more' }),
  hints('A row can be long and still be small.', 'Neither row can be judged by eye. Count them.'),
);
const spreadTrapFewer = withHints(
  comparePair({ which: 'fewer' }),
  hints('Do not trust the gaps between them.', 'Touch each one and say the numbers.'),
);
const verdictCard = withHints(
  sortVerdict(),
  hints('Find a partner for every single one.', 'Nothing spare on either side means they match.'),
);
const verdictCardDay5 = withHints(
  sortVerdict(),
  hints('Cover one row with your hand and think.', 'Then pair them off and see if you were right.'),
);
const puppetDay3 = puppetSpread();
const puppetDay5 = withHints(
  puppetSpread(),
  hints('Long rows can hold small numbers.', 'Count each row out loud and check.'),
);
const storyTray = compareStory('tray', { ask: 'more' });
const storySill = compareStory('sill', { ask: 'fewer' });
const storyBench = compareStory('bench', { ask: 'more' });
const sortThreeRows = sortRows();

// --- the six mastery slots, in their own voice ------------------------------
//
// Each is a FACTORY rather than a generator, because the verdict its form was
// dealt has to be known before the page draws (`masteryPage`). The ladders and
// the forms are exactly the ones the slots shipped with; nothing else changed.

const masteryPairMore = (dealtTie: boolean): ItemGen =>
  withHints(
    comparePair({ which: 'more', dealtTie }),
    hints('Look away from the gaps and find partners.', 'The row with a spare one has more.'),
  );
const masteryPairFewer = (dealtTie: boolean): ItemGen =>
  withHints(
    comparePair({ which: 'fewer', dealtTie }),
    hints('Pair the rows off from one end.', 'The row that stops first has fewer.'),
  );
const masteryVerdict = (dealtTie: boolean): ItemGen =>
  withHints(
    sortVerdict(dealtTie),
    hints('Match them off before you pick a card.', 'Spare ones on one side decide it.'),
  );
const masteryVerdictTwo = (dealtTie: boolean): ItemGen =>
  withHints(
    sortVerdict(dealtTie),
    hints('Count one row, then count the other.', 'Two numbers that match mean neither wins.'),
  );
const masteryStory = (dealtTie: boolean): ItemGen =>
  withHints(
    compareStory('sill', { ask: 'more', dealtTie }),
    hints('Read the story, then look at the rows.', 'Pair them off before you choose a card.'),
  );

// ===========================================================================
// The week
// ===========================================================================

export const buildA05 = makeWeekBuilder({
  level: 'A',
  week: 5,
  conceptId: 'more-fewer-same',
  conceptName: 'More, fewer, same',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 1 },
    { level: 'A', week: 2 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'matching them one for one',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Every comparison picture opens ONE row out, so a long row holds fewer as often as it holds more. Do this with real things before the screen: lay out two lines of buttons that match, then slide one line apart while the child watches, and ask again. If they change their answer, that is the whole week in one moment, and it is a normal one. Mascot present.',
  },
  explanation: {
    hook: say(
      'Two rows of buttons sit on the table. One row is long. One row is short. Which row has more? Your eyes say one thing. Counting says another. Let us find out who is right.',
    ),
    whyBeforeHow: say(
      'A long row can trick your eyes. It looks like more because it takes up more room. So we do not decide by looking. We decide by matching them one for one. Every one on top gets a partner below. A row with spare ones left over has more. If nobody is spare, the rows are the same.',
    ),
    script: [
      {
        say: say('Here are two rows. I give each apple a shell to pair with.'),
        visual: 'Four apples above four shells, with a thread joining each pair.',
        figure: rowsFigure(
          [{ count: 4, noun: 'apples' }, { count: 4, noun: 'shells' }],
          { alt: 'a row of apples above a row of shells, each one joined to its partner', showPairs: true },
        ),
      },
      {
        say: say('Now I slide the apples apart. That row looks much longer now!'),
        visual: 'The same four apples, pushed far apart. The four shells have not moved.',
        figure: rowsFigure(
          [{ count: 4, noun: 'apples', spread: 2.1 }, { count: 4, noun: 'shells' }],
          { alt: 'a row of apples spread far apart above a tight row of shells' },
        ),
      },
      {
        say: say('But nothing arrived. I pair them again. Every one still has a partner. Still the same!'),
        visual: 'The same spread-out apples, threaded to their shells. Nothing is left over.',
        figure: rowsFigure(
          [{ count: 4, noun: 'apples', spread: 2.1 }, { count: 4, noun: 'shells' }],
          { alt: 'the spread-out apples joined to the shells below them', showPairs: true },
        ),
      },
      {
        say: say('Here the tight row has a spare one. Short row, bigger number.'),
        visual: 'A tight row of six leaves above five spread-out stars, with the spare leaf ringed.',
        figure: rowsFigure(
          [{ count: 6, noun: 'leaves' }, { count: 5, noun: 'stars', spread: 1.75 }],
          {
            alt: 'a tight row of leaves above a row of stars spread far apart, with the leftover leaf ringed',
            showPairs: true,
            markExtra: true,
          },
        ),
      },
    ],
    summary: say(
      'Long is not the same as more. Match them one for one. A row with spare ones left over has more. If nobody is left over, they are the same.',
    ),
    vocabulary: [
      { term: 'more', kidGloss: 'this row has some left over after pairing' },
      { term: 'fewer', kidGloss: 'this row runs out first when you pair them' },
      { term: 'the same', kidGloss: 'everyone has a partner and nobody is spare' },
      { term: 'match', kidGloss: 'give each one exactly one partner in the other row' },
    ],
  },
  guidedExamples: [
    {
      ...ge(
        5,
        1,
        'modeled',
        scenePrompt('a tight row of 5 ducks above a row of 5 blocks spread far apart', 'Which row has more?'),
        [
          {
            teacherSay: say('Watch me. I pair the first duck with the first block.'),
            expected: 'one pair made',
          },
          { teacherSay: say('I keep going. Is anybody going to be left over?') },
          { childDo: say('Pair the rest with me and look for spares.'), expected: 'nobody is spare' },
          { teacherSay: say('Neither row has more. The long one only has gaps.') },
        ],
        'they are the same',
      ),
      visual: 'Five ducks in a tight row above five blocks spread far apart, joined in pairs.',
      figure: rowsFigure(
        [{ count: 5, noun: 'ducks' }, { count: 5, noun: 'blocks', spread: 1.7 }],
        { alt: 'a tight row of ducks above a row of blocks spread far apart, joined in pairs', showPairs: true },
      ),
    },
    {
      ...ge(
        5,
        2,
        'completion',
        scenePrompt('a row of 4 flowers spread far apart above a tight row of 6 buttons', 'Which row has more?'),
        [
          { teacherSay: say('I will start. Flower one goes with button one.') },
          { childDo: say('Pair off the rest and find who is spare.'), expected: 'two buttons are spare' },
          { teacherSay: say('The short row had spares. The buttons have more.') },
        ],
        'the buttons',
      ),
      visual: 'Four flowers spread far apart above a tight row of six buttons, joined in pairs.',
      figure: rowsFigure(
        [{ count: 4, noun: 'flowers', spread: 2.18 }, { count: 6, noun: 'buttons' }],
        {
          alt: 'a row of flowers spread far apart above a tight row of buttons, with the spare buttons ringed',
          showPairs: true,
          markExtra: true,
        },
      ),
    },
    {
      ...ge(
        5,
        3,
        'prompted',
        scenePrompt('a row of 7 shells spread far apart above a tight row of 5 stars', 'Which row has fewer?'),
        [
          { teacherSay: say('This time the long row really is the bigger one.') },
          { childDo: say('Pair them off. Which row runs out first?'), expected: 'the stars' },
        ],
        'the stars',
      ),
      visual: 'Seven shells spread far apart above a tight row of five stars.',
      figure: rowsFigure(
        [{ count: 7, noun: 'shells', spread: 1.6 }, { count: 5, noun: 'stars' }],
        { alt: 'a row of shells spread far apart above a tight row of stars', showPairs: true },
      ),
    },
    {
      ...ge(
        5,
        4,
        'independent',
        scenePrompt('a tight row of 8 leaves above a row of 6 balls spread far apart', 'Which row has more?'),
        [{ childDo: say('Pair them off on your own. Then choose.'), expected: 'the leaves' }],
        'the leaves',
      ),
      visual: 'A tight row of eight leaves above six balls spread far apart.',
      figure: rowsFigure(
        [{ count: 8, noun: 'leaves' }, { count: 6, noun: 'balls', spread: 1.94 }],
        { alt: 'a tight row of leaves above a row of balls spread far apart' },
      ),
    },
  ],
  days: [
    // Day 1 — the pairing anchor, blocked. One row is opened out from the very
    // first page, because the trick is the concept here rather than a twist
    // saved for later.
    [
      { gen: warmCountRow, diff: 1 },
      { gen: meetPairing, diff: 2 },
      { gen: meetPairing, diff: 2 },
      { gen: meetFewer, diff: 3 },
    ],
    // Day 2 — the trap named and worked, with the verdict card arriving.
    [
      { gen: warmEmptyBoxes, diff: 2 },
      { gen: spreadTrap, diff: 2 },
      { gen: verdictCard, diff: 3 },
      { gen: spreadTrapFewer, diff: 3 },
    ],
    // Day 3 — the same trap again, and the puppet who falls for it.
    [
      { gen: warmTapNumeral, diff: 2 },
      { gen: spreadTrap, diff: 3 },
      { gen: puppetDay3, diff: 3 },
      { gen: verdictCard, diff: 3 },
    ],
    // Day 4 — real-world single-step picture problems (the band-A form of G7).
    [
      { gen: warmFindGroup, diff: 2 },
      { gen: storyTray, diff: 3 },
      { gen: storySill, diff: 3 },
      { gen: storyBench, diff: 3 },
    ],
    // Day 5 — sort into more, fewer and the same; order three rows and say how.
    [
      { gen: verdictCardDay5, diff: 3 },
      { gen: sortThreeRows, diff: 3 },
      { gen: puppetDay5, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // Day-5 only. `validator.ts` (S-SCHEMA) rejects a strip on Days 1–4 and
    // `PuzzleGrove.tsx` renders Day 5's, hardcoded; the every-day strip
    // FILL-ARCHITECTURE rev 1 asked for was amended away on 2026-08-09, so this
    // is the spec as it stands rather than a deviation.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this week your child learns that a long row is not the same as a big row. Try it at the table. Lay out two lines of coins that match one for one, let your child agree they are the same, then slide one line apart while they watch and ask again. Most four-year-olds say the long line now has more, and they are not guessing or being careless — that is genuinely how it looks at this age, and telling them otherwise does very little. What works is pairing: put one finger on a coin in each line and move along together until one line runs out. Do it two or three times a week with buttons, socks, grapes, anything in pairs. The moment they stop trusting the length and start pairing off is the moment this concept lands, and it usually arrives all at once.',
  ],
  /**
   * The puzzle is a SEARCH, which is a move no page in this week makes: three
   * rows, three comparisons to run, and only one matching pair among them.
   *
   * Every row carries its own spacing, drawn independently of its count, so the
   * two rows that match are almost never the two that look alike — and no rule
   * about lengths ("the two widest", "the widest and the narrowest") is worth
   * more than a guess. The answer is recounted from the same drawn array the
   * picture is built from; it carries no `asserts` because "which two rows hold
   * the same number" is not a quantity `figureValue` can return for a counters
   * figure, and pointing the assertion somewhere it does not belong would make
   * QG-13 report a contradiction between a truthful picture and a correct
   * answer. A "rows with equal counts" selector is recorded for the orchestrator.
   */
  puzzle: (r) => {
    const twin = r.int(3, 7);
    const odd = r.pick([3, 4, 5, 6, 7].filter((v) => v !== twin));
    const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
    const oddSlot = r.int(0, 2);
    const counts = [0, 1, 2].map((i) => (i === oddSlot ? odd : twin));
    const spreads = scrambleWidths(r, counts);
    const twinNouns = nouns.filter((_, i) => i !== oddSlot);
    return {
      id: 'A5-PZ-01',
      title: 'Puzzle Grove: Find the Pair That Match',
      puzzleType: 'logic',
      prompt: [
        `[image: three rows: ${counts.map((c, i) => countNoun(c, nouns[i])).join(', ')}]`,
        say('Two rows hold the same number. Tap them both.'),
      ].join(' '),
      figure: rowsFigure(
        counts.map((c, i) => ({ count: c, noun: nouns[i], ...(spreads[i] === 1 ? {} : { spread: spreads[i] }) })),
        {
          alt: `three rows, spaced out differently: ${unitFor(2, nouns[0])}, ${unitFor(2, nouns[1])} and ${unitFor(2, nouns[2])}`,
        },
      ),
      answer: { value: twinNouns.join('; '), acceptableForms: [], validation: 'set' },
      hintLadder: hints('Wide gaps make a row look bigger than it is.', 'Count all three rows, then look for two numbers alike.'),
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'find-the-match' },
  sprint: null,
  mastery: [
    { gen: masteryPage(masteryPairMore, 0), diff: 2 },
    { gen: masteryPage(masteryVerdict, 1), diff: 3 },
    { gen: masteryPage(masteryPairFewer, 2), diff: 3 },
    { gen: masteryPage(masteryStory, 3), diff: 3 },
    { gen: masteryPage(masteryVerdictTwo, 4), diff: 3 },
    { gen: masteryPage(masteryPairMore, 5), diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh surfaces off a separate stream. Every slot is a tap with three authored cards, so no certifying page is left as a bare numeric for the display layer to invent buttons for. Every comparison picture opens exactly ONE row out, and which row that is, is drawn independently of which row holds more, so the long row has more on about a third of draws and has fewer on about a third. 01 and 06: which row has more, keyed on either row or on "they are the same". 02 and 05: the verdict card - more, fewer or the same about a named row, with the verdict drawn evenly across the three. 03: which row has fewer, the same form with the polarity turned round. 04: a story that names two kinds and neither count, so the numbers exist only in the drawing. NEITHER count is ever spoken: the figure alt, which is read aloud first at this band, names the two kinds and the two spacings and no quantity at all. HOW MANY SLOTS ANSWER "the same" IS DEALT PER FORM, NOT LEFT TO THE MARGINAL: one, two or three of the six, drawn before any page is built, so every slot still keys the tie on a third of its draws (31.7-34.6% measured over 3,000 packs) while no form can ever key it more than three times. The pass mark is five of six, so a child who taps "the same" on every page fails every form - which was not true before this deal: 8.8% of forms keyed four or more and 0.2% keyed five or more, and the second of those is a child promoted without comparing anything. Operand freshness is a different matter and this note used to overstate it. A count/noun pair is one of 63 (seven counts by nine kinds), each comparison page prints two of them, and 46.0 are printed on the days and Form A before Form B draws - so "no pair is reused" was arithmetically unreachable, and measured, 16.8% of Form-B pairs recur from Form A and 40.6% from a daily page. What IS guaranteed, and enforced by the pack-wide surface guard rather than asserted here, is that no two pages in the pack print the same PAIR of counts in the same format class (0 duplicate operand surfaces over 3,000 packs); a recurring count/kind arrives in a different picture, on a different day, under a different question.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'longer-means-more',
      description: 'Says the row that takes up more room has more in it — the conservation trap, and the belief this week exists to unseat. It is not carelessness: at four or five, length genuinely is the more obvious cue.',
      exampleWrongAnswer: 'five counters spread wide answered as more than six bunched together',
      distractorRationale: 'Every comparison picture opens ONE row out and offers both rows as cards, so the opened-out row is always there to be tapped. Measured over 34,000 exposures it is the keyed answer on 33.8% of them and a distractor on the rest, because which row is spread is drawn independently of which row holds more; offering it only when it is wrong would teach the mirror rule instead. Both readings carry the tag, and the rationale on each card says which of the two it is: the length answer taken straight, or the over-correction that mirrors it.',
      reteachPointer: 'explanation/script[2] (the same apples spread apart and paired off again)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'ends-alike-reads-equal',
      description: 'Reads two rows that finish near the same place as the same number, or reads the wide gaps in an opened-out row as missing things.',
      exampleWrongAnswer: 'six and seven called "the same" because both rows end near the edge',
      distractorRationale: '"They are the same" is offered on every comparison page and is genuinely keyed on one draw in three (measured 32.3% over 34,000 exposures), so it can never be struck out for free; on the verdict pages the same slip appears as the card that contradicts the drawn verdict, and on the warm-ups as a count one or two over.',
      reteachPointer: 'guidedExamples/A5-GE-02 (the spare buttons, ringed)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'pairing-loses-its-place',
      description: 'Begins pairing properly and then loses the thread — skips a partner in the wide gaps, or stops at the end of the shorter row before the leftovers are met.',
      exampleWrongAnswer: 'stops pairing at the end of the short row and reports no spares',
      distractorRationale: 'Offered on the verdict pages and the puppet page as the card that says "the same" when spares really were left over, and on the warm-ups as a count one or two short of the drawn row.',
      reteachPointer: 'explanation/script[3] (pairing carried right to the spare leaf)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-picture-not-the-question',
      description: 'Answers the story from the look of the whole page — "about the same" — instead of from the pairing the question asks for, or answers "more" on a page that asked which row has fewer.',
      exampleWrongAnswer: 'asked which row has fewer, taps the row with more',
      distractorRationale: 'Both polarities run all week and neither is the house default, so a child who answers the question they expected rather than the one asked lands on a card that is offered and is not keyed. The story pages also offer "they are the same" for the whole-page reading.',
      reteachPointer: 'Day-4 story pages: say the question back before any pairing begins',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Comparing two groups by matching them one for one — giving every object in the top row a partner in the bottom row, and reading the leftovers. We also met the idea that spreading a row out makes it longer without making it bigger, which is genuinely surprising at this age.',
    improvingCandidates: [
      'pairing two rows off one for one instead of judging by length',
      'noticing the leftovers and saying which row they belong to',
      'answering "the same" when two rows really do match',
      'counting both rows when the pairing gets hard to follow',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'trusting the pairing over the picture — we will keep sliding one row apart and asking again, because seeing it happen beats being told',
      },
      {
        errorTag: 'procedure-slip',
        text: 'carrying the pairing all the way to the end of the longer row, so the leftovers are actually found',
      },
      {
        errorTag: 'task-comprehension',
        text: 'listening for whether the question asked about more or about fewer before choosing',
      },
    ],
    homeFocus: {
      praiseLine:
        'You matched them one for one instead of going by how long the rows looked, and you found the spare one at the end.',
      questionForChild: 'If I slide these apart, is there still the same number — and how could you show me?',
      schoolSyncHook: 'Send us the things your child lines up at nursery — socks, snack cups, toy cars — and the pictures will use them.',
    },
    vocabularyForParent: [
      'more (this row has some left over after pairing)',
      'fewer (this row runs out first)',
      'the same (nobody is left without a partner)',
      'conservation (sliding a row apart leaves its number alone)',
    ],
  },
});
