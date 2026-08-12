/**
 * Level A · Week 10 — "Writing numbers 11–20" (conceptId: writing-numbers-11-20).
 *
 * FILL-ARCHITECTURE §3 row A10: anchor "ten and 3 more"; core forms "write
 * teens" and "frame→numeral"; perceptual discrimination **13 vs 31**; puppet
 * error-analysis "writes 31 for thirteen"; Day-5 "numeral↔set match". Catalog
 * row: numeral writing 11–20 with the ten-frame-plus-extras representation, and
 * count-and-colour with close distractors as the non-computational focus.
 *
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 *
 *  - **A two-digit numeral records a STRUCTURE, and the ORDER of the two marks
 *    is what carries it.** The 1 in 13 is not a one. It is the ten that was
 *    counted before anything else, standing in the place reserved for tens. Put
 *    the same two marks down the other way and the page says something else
 *    entirely. Every core item here ends in a numeral chosen or written for a
 *    picture whose ten is visible, so the mark is never separable from the
 *    structure it is standing for.
 *  - **THE CHILD WHO WRITES 31 FOR THIRTEEN HAS HEARD THE WORD PERFECTLY.**
 *    "Thir-teen" says the extras first and the ten second, and a four-year-old
 *    who writes what they heard, in the order they heard it, gets 31. That is
 *    not carelessness; it is the English number name arguing with the English
 *    place-value convention, and teens are the only place the two disagree.
 *    So it is the discrimination, it is the puppet's slip, and it is the week.
 *  - **A9 OWNS THE EAR; A10 OWNS THE HAND.** A9's trap is thirteen against
 *    thirty, which differ by one soft syllable and are told apart by listening
 *    (`numeralTrap('teen-ty')`). This week's trap is thirteen against
 *    thirty-one, which sound nothing alike and are told apart by looking at
 *    which part of the picture came first. Nothing in this file asks a child to
 *    hear a difference, and nothing in A9 asks them to order two marks.
 *  - **No page here is words only.** `GATE_PROFILE.A` spends the multi-step
 *    quota on `pictorialPerDay`, so each of Days 1–4 draws its pictures out of
 *    the values its own items compute with.
 *  - **No timers.** `sprint: null`.
 *  - **Twenty-one per cent of the daily pages face backwards** — four items,
 *    one on each of Days 1–4, each from a different earlier week in a different
 *    format: a teen collection counted with nothing grouping it (A9), a small
 *    set named by its numeral (A4), the step before a teen on a number path
 *    (A6), and two rows matched object for object (A5).
 *
 * ── TWELVE DISCLOSURES ──────────────────────────────────────────────────────
 *
 * 1. **THE SWAP OF A TEEN IS NOT A TEEN, AND THAT ONE FACT DECIDES THE WHOLE
 *    DISCRIMINATION.** 13 swapped is 31, which sits outside 11–20 — so on any
 *    page whose picture is always a teen, the swapped numeral is offered every
 *    time and keyed never. That is the permanently-dead card of L38, and it is
 *    worse than dead here: a child who learns "never tap the big one" scores
 *    full marks on the very item built to test whether they can read a numeral's
 *    order. A9 hit the mirror image of this and recorded it (its own family trap
 *    can never key a -ty), so the shape is known.
 *
 *    `whichNumberSaysIt` therefore lets the PICTURE be either arrangement. One
 *    stack of ten with `o` loose blocks beside it is the teen `10 + o`; `o`
 *    stacks with one loose block is `10o + 1`; the two are the same pair of
 *    digits in the two orders, and which one is drawn is settled by an
 *    independent coin. Both numerals are on the page every time, each is the
 *    truth on half the draws, and neither can be struck out unread. The picture
 *    is towers of blocks rather than frames because a double ten-frame holds
 *    twenty at most (`figures/assert.ts`: "frames must be 1 or 2") and thirty-one
 *    will not go in it — the same reason `numeralTrap('digit-swap')` draws
 *    towers for A22.
 *
 *    What that costs, said plainly: on half its draws this slot keys a numeral
 *    past twenty, which is past the range the week teaches a child to WRITE. The
 *    child is never asked to name it. They are asked which of three numerals
 *    describes a picture of stacks and loose blocks, and the answer to that is
 *    readable by anyone who knows the first mark counts the stacks. There is no
 *    way to show what 31 MEANS without drawing three tens, and a discrimination
 *    that never shows it is a discrimination the misconception survives.
 *
 * 2. **THE THIRD CARD IS DRAWN FROM THE SAME SIX NUMERALS, AND ITS SIDE IS WHAT
 *    ROTATES THE ANSWER'S SEAT.** With `o` running 2–4 the slot's whole key set
 *    is {12, 13, 14, 21, 31, 41}, each keyed on exactly one draw in six. The
 *    third card is another member of that set, so nothing on the page is
 *    unkeyable, and it is taken from below the truth or above it by a fair coin
 *    wherever both sides exist. Two cells have only one side (12 has nothing
 *    below it in the set, 41 nothing above), and those two are exactly what pays
 *    for the ends: the truth lands lowest on the twelve page and highest on the
 *    forty-one page by force, and the four free cells split evenly, which puts
 *    each seat at one third. Worked out before the code was written and measured
 *    afterwards — the numbers are in the report.
 *
 * 3. **THE PUPPET'S NUMBER STAYS IN THE PROMPT AND OFF THE CARDS.** Row A10's
 *    slip is `a_verify_teen_write_v1` exactly — the registry reverses the digit
 *    string and refuses a palindrome, so eleven is out at the source and the
 *    misconception value is recomputed rather than authored. But the reversal of
 *    a teen is at least twenty-one, so offering it as a card would put a numeral
 *    on the page that this slot can never key (disclosure 1's shape again,
 *    manufactured by the form). A13 met the same wall at its own puppet and
 *    withheld the number; this file does the same. The slip is SHOWN — the
 *    prompt says what the puppet wrote, which is what QG-11 checks — and the
 *    three cards are the truth and two honest miscounts of the loose counters,
 *    all inside 12–19.
 *
 *    A local generator rather than `puppetSlip({slip: 'teen-writing'})`, and the
 *    reason is measured rather than stylistic: the family branch offers its
 *    third card as `n ± 1` unclamped, so a drawn twelve can offer eleven and a
 *    drawn nineteen can offer twenty — neither of which its own key set
 *    ({12…19}) contains. It also names the ten in its accessible name.
 *
 * 4. **AUTHORED CARDS ON EVERY CERTIFYING SLOT (L53), AND THE ARITHMETIC AUDIT
 *    THEY SWITCH OFF IS REBUILT HERE.** A pre-reader cannot type: a numeric
 *    band-A page with no `choices` is handed to `tapOptionsFor`, which invents
 *    buttons from the answer alone and cannot know that a slot draws 11–20. So
 *    the cards are written here — and QG-5 re-derives an `answerFor` for five
 *    numeric validations, of which `choice-key` is not one, so
 *    `a_frame_read_v1`, `a_teen_ten_and_v1`, `a_teen_extra_v1`,
 *    `a_numeral_for_set_v1`, `a_count_v1` and `a_neighbour_v1` stop being
 *    audited the moment they get cards. `withCards` replaces that audit with a
 *    second derivation of its own: the key is recomputed from the item's stored
 *    params by a function written in this file, compared with what the generator
 *    keyed, and compared again with what the picture actually draws. Any drift
 *    throws at every seed rather than shipping on one.
 *
 * 5. **EVERY SLOT'S CARD SET IS THE IMAGE OF ITS OWN DRAW POOL.** Nothing below
 *    declares a list of numerals by hand — five of the six weeks before this one
 *    shipped a permanently dead card past a clean two-hundred-seed sweep by
 *    doing exactly that, and a hand-written list cannot know when a pool moves.
 *    Each slot exports the SET its own answer function returns over its own
 *    cells, built at module load, and `threeCards` refuses any value outside it.
 *    For the record: the frame read, the composed teen, the counted sets, the
 *    three stories and the Day-5 match all key 11–20; the decomposition keys
 *    1–9; the puppet keys 12–19; the discrimination keys the six of disclosure
 *    2; the warm-ups key 11–19, 6–10, 11–18 and their own group kinds.
 *
 * 6. **THE GUIDED EXAMPLES COUNT NOTHING IN THEIR BRACKETS, ON PURPOSE.**
 *    `makeWeekBuilder` rebuilds any DAY item whose prompt's numeric tokens match
 *    a guided example's, and does NOT apply that filter to the mastery forms —
 *    so a two-numeral example silently removes a cell from a day slot while
 *    leaving its mastery twin able to key it, and the cards, computed from the
 *    full pool, then carry a numeral that day slot can never serve. A13 found
 *    and reported it. Nothing here needs the workaround: all four examples
 *    describe their drawing instead of counting it, so three of them carry no
 *    numeral at all and the fourth carries one, and the filter's two-token
 *    minimum is never reached. Every day slot offers exactly what it can key.
 *
 * 7. **NO DIGIT AND NO NUMBER WORD IN ANY ACCESSIBLE NAME (L48).** At band A the
 *    alt is not a fallback for the picture, it IS the picture, and
 *    `speakablePrompt` plays it BEFORE the question. This week's answers run
 *    11–20, so "ten", "twenty" and every word between them are live hazards, and
 *    so is the word "one" hiding inside "the top one". Every alt in the file is
 *    built by `alt()`, which throws at module load on a digit or on any word
 *    from zero to twenty — plus thirty and forty (this week's discrimination can
 *    key both), and once, twice, single, double, pair, couple, dozen and both,
 *    which are numbers wearing coats.
 *
 *    Four library generators are wrapped in `withPlainAlt` because their own alt
 *    speaks the ten: `teenTenAnd` renders "a full frame of ten and 3 counters
 *    more" — a digit AND a number word AND the question's own two givens in
 *    order — and `teenExtra` renders "a full frame of ten and some more
 *    counters". `tenFrameRead`, `tenFrameEmpty` and `partnersHiding` were
 *    repaired centrally after A13 measured the ten-frame's name keying its own
 *    answer on a fifth of A12's frame items; the two teen generators were not
 *    reached by that repair. **Recorded for the orchestrator, not fixed here.**
 *
 *    The `[image: …]` brackets keep their counts. They are what `signatureOf`
 *    signs for operand freshness, `promptText` strips them before anything is
 *    shown, and `speakablePrompt` prefers the figure alt over them wherever a
 *    figure exists — which is everywhere in this file that a bracket appears.
 *
 * 8. **WHERE THE TRUTH STANDS IS SETTLED BEFORE THE WRONG NUMBERS ARE, AND THE
 *    WEIGHTS ARE SOLVED RATHER THAN GUESSED.** Every card must be a value its
 *    own slot can key, so all three live inside the slot's range — and a
 *    contiguous range pins its own ends: the lowest value has nothing beneath it
 *    and is always the smallest numeral on the page, the highest is always the
 *    largest, and the runners-up can never reach the far seat. Left uniform, the
 *    middle seat starves.
 *
 *    `seatTable` fixes it by iterative proportional fitting: start from a flat
 *    spread over each key's REACHABLE seats, then alternately rescale the three
 *    seat columns to their target third and renormalise each key's row, until
 *    the marginals settle. The result is rounded to integer weights out of a
 *    thousand by largest remainder and checked at module load — if a key set
 *    cannot reach a flat third the module refuses to load rather than shipping a
 *    tilt. One solver serves all seven carded slots, and the served rates are in
 *    the report rather than in this paragraph.
 *
 * 9. **SEVEN LOCAL GENERATORS, EACH NAMING THE FAMILY GAP IT FILLS.**
 *    `whichNumberSaysIt` (disclosure 1: the family's digit-swap trap draws its
 *    tens digit from 2–4, so no draw of it can produce a teen — it is A22's
 *    cell, not this one); `puppetSwapsTheDigits` (disclosure 3);
 *    `numeralForSet` and `readTheFrames` (`howManyChoice` builds its cards from
 *    n ± 1 and n ± 2 unclamped, which at a floor of eleven offers nine and ten
 *    and at a ceiling of twenty offers twenty-one and twenty-two — values no
 *    draw of this week can key; and `tenFrameRead` asks "how many counters are
 *    in the frame", singular, beside a picture of two, which A9 caught by
 *    reading its own generated week); `writeTheTeen` (nothing in
 *    `lib/earlynumber.ts` asks a child to WRITE a numeral — `tenFrameBuild`
 *    draws counters, not marks); `numberStory` (the family's only word problems
 *    join or take away, neither of which this week has taught); and
 *    `writeAndTell` (the Day-5 oral half). All seven keep the family's contract:
 *    a templateId that resolves in the registry, a picture built by
 *    `lib/figures` from the item's own values, quantities through `lib/format`,
 *    and an `authorMeta` stamp.
 *
 * 10. **THE ANCHOR IS DECLARED AS "a ten and some more" AND THE RECIPE'S OWN
 *    SENTENCE IS THE WEEK'S CORE QUESTION.** §6.9 requires the declared
 *    `conceptualAnchor` to appear verbatim inside `whyBeforeHow`, which is prose
 *    read aloud to a pre-reader; "ten and 3 more" carries a bare digit into a
 *    spoken sentence, which is the one thing this week is teaching a child to
 *    WRITE rather than hear. The recipe's phrase is not lost — it is
 *    `teenTenAnd`'s own prompt, "Ten and 3 more. What number?", which runs on
 *    Day 1 and on mastery slot 04.
 *
 * 11. **THE PUPPET PAGE TEACHES AND DOES NOT CERTIFY, AND THE ARITHMETIC SAYS
 *    SO.** Its prompt names the number the puppet wrote, so "tap one of the
 *    other two" is worth half a page against a third for a guess — the shape of
 *    every error-analysis item in the family, worth having on Day 3 and not
 *    worth promoting a child on. Withholding the reversal from the cards
 *    (disclosure 3) closes the wider hole, which is that the reversal is always
 *    the largest numeral on such a page and therefore always the one to avoid.
 *
 * 12. **FOUR THINGS ONLY READING THE GENERATED WEEK FOUND**, every one of them
 *    past a clean two-hundred-seed sweep.
 *      · **THE WHOLE OF DAY 4 AND MASTERY SLOT 06 SHIPPED AS BARE NUMERALS.**
 *        All three stories validated `exact-numeric` with no `choices`, so the
 *        display layer would have manufactured their buttons — on the four pages
 *        where the ten has to be made with nothing on the page grouping it, and
 *        on a slot that certifies. `cardedStory` closes it; A9 recorded the same
 *        escape on its own Day 4, and it is invisible for the same reason both
 *        times: a numeric page with no cards looks finished.
 *      · **THE DIGIT-SWAP CARD NAMED THIRTEEN ON PAGES ABOUT TWELVE.** The
 *        rationale spelled out "thir-teen" while sitting on the twelve and
 *        fourteen draws of the same slot. The account is identical for all of
 *        them, so it is now written without an example in it.
 *      · **THE NUMBER-PATH WARM-UP CALLED A NON-COUNT A MISCOUNT.** Its cards
 *        come out of the same range as its question, so one of them is routinely
 *        the number the question itself named — and "met something twice" is not
 *        what a child did there. `PATH_CARD` separates the three cases: no step
 *        taken, a step the wrong way, a walk gone too far.
 *      · **THREE DOUBLE-FRAME PICTURES ON ONE PAGE SET, TWO ON THE SAME COUNT.**
 *        The composed teen signs on the EXTRAS and the frame read on the TOTAL
 *        while drawing the identical picture, so no guard could see it.
 *        `freshFrames` signs on what the picture HOLDS, and it is applied to the
 *        day slots only: nine frame draws against ten counts would leave whichever
 *        slot drew last holding the leftover, which is the marginal defect a wide
 *        signature exists to prevent, so the mastery forms draw free and are kept
 *        apart by the pack's own surface guard instead. Measured over 600 packs
 *        afterwards: 0.0% of packs repeat a frame count anywhere, 0.0% within a
 *        day.
 *
 * 13. **WHAT THE BLIND-STRATEGY SWEEP SAYS, AND THE ONE NUMBER THAT IS MEANT TO
 *    BE HIGH.** Over 36,000 numeric card draws the truth is the smallest numeral
 *    on 33.1% of them, the middle on 33.6% and the largest on 33.2%, with every
 *    individual slot inside 30.0-36.7% and the first card correct on 30.8-35.6%
 *    — three cards, and no seat worth taking without counting.
 *
 *    The misconception is measured two ways, because it has two forms and only
 *    one of them is executable at this age. Writing the LOOSE count first and the
 *    stacks second — the visual habit, "put the little pile down first" — is
 *    correct on 0.0% of discrimination draws and on 8.9-11.5% of the frame slots,
 *    where all of it is eleven reading the same either way round. Saying the
 *    number and writing its parts in the SPOKEN order is correct on 49.3-51.0% of
 *    discrimination draws, and that is not a leak: it is right precisely on the
 *    pictures with more than one stack, where the English name and the written
 *    order agree, and to execute it a child must already know that three stacks
 *    and a loose one is called thirty-one, which is A22's content. On every other
 *    slot in the week the same strategy produces a numeral that is not on the page
 *    at all, except on the 18-25% of draws where the truth is eleven or twenty and
 *    reversing it changes nothing.
 *
 *    The rule the week TEACHES — find the ten, then count on and write ten and
 *    what is left — is correct on 100% of every slot that asks for a whole
 *    numeral, and on 49.0-50.7% of the discrimination, which is the half of its
 *    pictures that hold exactly one ten. That is the sanity check that the week
 *    is learnable rather than merely unguessable.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  countArrangement,
  howManyChoice,
  neighbourNumber,
  setForNumeral,
  teenExtra,
  teenTenAnd,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsAnswerOf, assertsParam, counterGroups, counters, tenFrame } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn per item. No line below writes one of these in by hand (kit §F.3). */
const FOLK = ['Aurel', 'Dilan', 'Eira', 'Gita', 'Hedda', 'Kirra', 'Lumi', 'Mattis'] as const;
const someone = (r: Rng): string => r.pick(FOLK);

/** The numerals this week teaches a child to write. */
const LO = 11;
const HI = 20;
/** The part of a teen that is already counted before the marks are made. */
const TEN = 10;
/** Both frames packed. What the apparatus keeps suggesting whatever is in it. */
const FULL = 20;

// ---------------------------------------------------------------------------
// The sentence length rule that has a gate behind it
//
// Two limits are in play and they measure different things. `earlynumber`'s
// `ask()` caps a PROMPT taken whole, so it lets a two-sentence prompt of nine
// words each through and never sees a hint at all. `bb-readability-test` walks
// every child-facing surface one sentence at a time, and that is the one that
// fails a build. This mirrors its splitter and its word counter, and every
// authored line in the file is pushed through it, so an eleventh word throws
// when the module loads or when the item is drawn.
//
// A figure's accessible name is deliberately outside it: that string is what a
// child who cannot see the picture has INSTEAD of the picture, and a length cap
// on it buys brevity by taking the drawing away. It has its own gate below.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A10: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** `[image: scene] question` — the bracket feeds the guard, the question is read. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Help rungs: measured, and free of names and numerals by how they are written. */
function ladder(...rungs: string[]): string[] {
  return rungs.map(say);
}

// ---------------------------------------------------------------------------
// ACCESSIBLE NAMES ARE WRITTEN HERE AND THEY COUNT NOTHING (disclosure 7)
// ---------------------------------------------------------------------------

const SPOKEN_NUMBER =
  /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|once|twice|single|couple|pair|double|dozen|both)\b/i;

function alt(text: string): string {
  if (/\d/.test(text)) {
    throw new Error(`A10 alt: a digit is spoken ahead of the question in "${text}"`);
  }
  const hit = SPOKEN_NUMBER.exec(text);
  if (hit) {
    throw new Error(`A10 alt: the number word "${hit[0]}" is spoken ahead of the question in "${text}"`);
  }
  return text;
}

/** The two frames, however full they happen to be. */
const FRAMES_ALT = alt('the frames, with counters set out along them');
/** The picture the digit-order page decides on. */
const STACKS_ALT = alt('tall stacks of blocks, and loose blocks beside them');
/** A pile, a line, a windowbox — the layout and the kind, never the count. */
function looseAlt(noun: string, look: string): string {
  return alt(`some ${noun} ${look}`);
}
/** Groups laid side by side for a matching page. */
function groupsAlt(nouns: readonly string[]): string {
  const named = nouns.length <= 1 ? nouns[0] : `${nouns.slice(0, -1).join(', ')} and ${nouns[nouns.length - 1]}`;
  return alt(`groups laid side by side: ${named}`);
}

/**
 * Overwrite a library generator's accessible name from outside `lib/`.
 *
 * One field moves and nothing else does — the params, the picture's quantities
 * and its assertion all survive, so QG-13 goes on proving exactly what it
 * proved. Used only where the library's own alt speaks a number (disclosure 7).
 */
function withPlainAlt(base: ItemGen, spoken: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.figure) {
      throw new Error('A10 withPlainAlt: nothing is drawn on this page, so there is no spoken name to replace');
    }
    return { ...draft, figure: { ...draft.figure, alt: alt(spoken) } };
  };
}

/** Give a library generator help written for this concept, without editing it. */
function withLadder(base: ItemGen, rungs: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: rungs });
}

/**
 * Mark an earlier week's item as this week's warm-up.
 *
 * `GATE_PROFILE.A.warmupFormats` is zero — retrieval is allowed here, never
 * demanded — so each of the four has to earn its page. All four are load-bearing
 * for what A10 asks: a teen counted with nothing grouping it (A9) is the
 * quantity the numeral has to record; a small set named by its numeral (A4) is
 * this exact act one digit down; the step before a teen on a path (A6) is where
 * teen numerals sit in relation to each other; and two rows matched object for
 * object (A5) is the reason a numeral is worth writing at all. Their hints stay
 * as the library wrote them: a warm-up should sound like the week it came from.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// KEY SETS, BUILT FROM THE POOLS THEMSELVES (disclosure 5)
// ===========================================================================

function setOver<T>(cells: readonly T[], keyOf: (cell: T) => number): ReadonlySet<number> {
  return new Set(cells.map(keyOf));
}

function span(lo: number, hi: number): number[] {
  const out: number[] = [];
  for (let v = lo; v <= hi; v++) out.push(v);
  return out;
}

/** Every numeral this week teaches, and what the wide slots key. */
const TEEN_CELLS = span(LO, HI);
const TEEN_KEYS = setOver(TEEN_CELLS, (n) => n);
/** The extras alone — what the SECOND mark of a teen records. */
const EXTRA_CELLS = span(LO, HI - 1);
const EXTRA_KEYS = setOver(EXTRA_CELLS, (n) => n - TEN);
/** The puppet's page: eleven reads the same reversed, so it is out at the source. */
const PUPPET_CELLS = span(12, 19);
const PUPPET_KEYS = setOver(PUPPET_CELLS, (n) => n);
/** The step before a teen (A6's warm-up). */
const BEFORE_CELLS = span(12, 19);
const BEFORE_KEYS = setOver(BEFORE_CELLS, (n) => n - 1);
/** A teen collection counted loose (A9's warm-up). */
const LOOSE_CELLS = span(LO, HI - 1);
const LOOSE_KEYS = setOver(LOOSE_CELLS, (n) => n);
/** A small set named by its numeral (A4's warm-up). */
const SMALL_CELLS = span(6, 10);
const SMALL_KEYS = setOver(SMALL_CELLS, (n) => n);

/**
 * The digit-order page: one stack and `o` loose, or `o` stacks and one loose.
 *
 * `o` stops at four because the swapped picture draws `o` stacks of ten and a
 * child has to be able to look at it — four stacks and a loose block is
 * forty-one blocks on the page, which is where `numeralTrap`'s own digit-swap
 * branch stops for the same reason.
 */
const SWAP_ONES = [2, 3, 4] as const;
const SWAP_CELLS: ReadonlyArray<{ o: number; teenShown: boolean }> = SWAP_ONES.flatMap((o) => [
  { o, teenShown: true },
  { o, teenShown: false },
]);
const swapValue = (o: number, teenShown: boolean): number => (teenShown ? TEN + o : 10 * o + 1);
const SWAP_KEYS = setOver(SWAP_CELLS, (c) => swapValue(c.o, c.teenShown));

// ===========================================================================
// WHICH SEAT THE TRUTH TAKES (disclosure 8)
// ===========================================================================

/** Weights per seat, in thousandths, so a seeded draw needs one integer. */
const SEAT_DENOM = 1000;
type SeatWeights = readonly [number, number, number];

/**
 * Which of the three seats a key can physically occupy, given what its own pool
 * can put beside it. Lowest needs two cards above; middle needs one on each
 * side; highest needs two below.
 */
function reachableSeats(key: number, pool: readonly number[]): [boolean, boolean, boolean] {
  const below = pool.filter((v) => v < key).length;
  const above = pool.filter((v) => v > key).length;
  return [above >= 2, below >= 1 && above >= 1, below >= 2];
}

/**
 * Solve for per-key seat weights whose MARGINAL over the slot's keys is a flat
 * third, by iterative proportional fitting.
 *
 * The rows are the keys and the columns are the three seats. Start each row flat
 * over the seats it can reach; then scale every column so its average lands on a
 * third, renormalise every row so it is still a probability, and repeat. Where a
 * flat marginal is unreachable the fit cannot converge and the check below
 * refuses to load the module — which is the point of doing it here rather than
 * discovering a tilt in a report.
 */
function seatTable(
  keys: readonly number[],
  poolOf: (key: number) => number[],
  who: string,
): ReadonlyMap<number, SeatWeights> {
  const reach = keys.map((k) => reachableSeats(k, poolOf(k)));
  reach.forEach((r, i) => {
    if (!r.some(Boolean)) {
      throw new Error(`A10 seatTable(${who}): a key of ${String(keys[i])} cannot sit anywhere among three cards`);
    }
  });
  let rows = reach.map((r) => {
    const live = r.filter(Boolean).length;
    return r.map((ok) => (ok ? 1 / live : 0));
  });
  for (let pass = 0; pass < 400; pass++) {
    const column = [0, 1, 2].map((j) => rows.reduce((acc, row) => acc + row[j], 0) / keys.length);
    rows = rows.map((row) => {
      const scaled = row.map((v, j) => (column[j] > 1e-12 ? v / column[j] : 0));
      const total = scaled.reduce((a, b) => a + b, 0);
      if (total < 1e-12) throw new Error(`A10 seatTable(${who}): a key lost every seat during the fit`);
      return scaled.map((v) => v / total);
    });
  }
  for (const j of [0, 1, 2]) {
    const share = rows.reduce((acc, row) => acc + row[j], 0) / keys.length;
    if (Math.abs(share - 1 / 3) > 0.005) {
      throw new Error(
        `A10 seatTable(${who}): seat ${String(j + 1)} settles at ${(share * 100).toFixed(1)}%, not a flat third`,
      );
    }
  }
  // Largest remainder, so the integer weights still sum to the denominator and a
  // seat that is unreachable keeps a weight of zero.
  const table = new Map<number, SeatWeights>();
  keys.forEach((k, i) => {
    const raw = rows[i].map((v) => v * SEAT_DENOM);
    const floors = raw.map((v) => Math.floor(v));
    let left = SEAT_DENOM - floors.reduce((a, b) => a + b, 0);
    const order = [0, 1, 2].sort((a, b) => raw[b] - floors[b] - (raw[a] - floors[a]));
    for (const j of order) {
      if (left <= 0) break;
      if (rows[i][j] > 0) {
        floors[j] += 1;
        left -= 1;
      }
    }
    table.set(k, [floors[0], floors[1], floors[2]]);
  });
  return table;
}

/** Cards that sit within two of the truth — a count lost or run on by a step. */
function nearPool(key: number, keys: ReadonlySet<number>): number[] {
  return [key - 2, key - 1, key + 1, key + 2].filter((v) => keys.has(v));
}
/** The frame pages add the apparatus's own capacity, which really is the answer
 *  whenever both frames fill. */
function framePool(key: number, keys: ReadonlySet<number>): number[] {
  return [...new Set([...nearPool(key, keys), FULL])].filter((v) => v !== key && keys.has(v));
}

const TEEN_SEATS = seatTable(TEEN_CELLS, (k) => nearPool(k, TEEN_KEYS), 'counted sets');
const FRAME_SEATS = seatTable(TEEN_CELLS, (k) => framePool(k, TEEN_KEYS), 'the frames');
const EXTRA_SEATS = seatTable([...EXTRA_KEYS].sort((a, b) => a - b), (k) => nearPool(k, EXTRA_KEYS), 'the extras');
const PUPPET_SEATS = seatTable(PUPPET_CELLS, (k) => nearPool(k, PUPPET_KEYS), 'the puppet');
const BEFORE_SEATS = seatTable([...BEFORE_KEYS].sort((a, b) => a - b), (k) => nearPool(k, BEFORE_KEYS), 'the path');
const LOOSE_SEATS = seatTable([...LOOSE_KEYS].sort((a, b) => a - b), (k) => nearPool(k, LOOSE_KEYS), 'a loose teen');
const SMALL_SEATS = seatTable([...SMALL_KEYS].sort((a, b) => a - b), (k) => nearPool(k, SMALL_KEYS), 'a small set');

function dealSeat(r: Rng, table: ReadonlyMap<number, SeatWeights>, key: number, who: string): 0 | 1 | 2 {
  const weights = table.get(key);
  if (!weights) throw new Error(`A10 dealSeat(${who}): no seat weights for a key of ${String(key)}`);
  const t = r.int(0, SEAT_DENOM - 1);
  if (t < weights[0]) return 0;
  if (t < weights[0] + weights[1]) return 1;
  return 2;
}

// ===========================================================================
// THE CARDS
// ===========================================================================

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Three numerals, all of them keyable, with the truth in the seat it was dealt.
 *
 * Nothing here is written down: the pool is the slot's own key set, so every
 * numeral on the page is what some other draw of that same slot really keys and
 * none can be crossed out unread. The seat is settled BEFORE the wrong values
 * are chosen, because a range decides its own ends otherwise (disclosure 8), and
 * each wrong card is explained from its VALUE rather than from the branch that
 * chose it — an explanation taken from the branch can drift away from the number
 * it is attached to.
 */
function threeCards(
  r: Rng,
  key: number,
  pool: readonly number[],
  keys: ReadonlySet<number>,
  seats: ReadonlyMap<number, SeatWeights>,
  why: (v: number) => Card,
  who: string,
): { choices: ReturnType<typeof makeChoices>['choices']; correctKey: string } {
  const live = [...new Set(pool)].filter((v) => v !== key && keys.has(v));
  const below = live.filter((v) => v < key);
  const above = live.filter((v) => v > key);
  const seat = dealSeat(r, seats, key, who);
  const twoOf = (from: number[]) => (from.length <= 2 ? [...from] : r.shuffle([...from]).slice(0, 2));
  const oneOf = (from: number[]) => (from.length === 1 ? from[0] : r.pick(from));
  const values = seat === 0 ? twoOf(above) : seat === 2 ? twoOf(below) : [oneOf(below), oneOf(above)];
  if (values.length !== 2 || new Set(values).size !== 2) {
    throw new Error(`A10 threeCards(${who}): a key of ${String(key)} could not find two honest cards`);
  }
  const shown = [key, ...values].sort((a, b) => a - b);
  if (shown.indexOf(key) !== seat) {
    throw new Error(
      `A10 threeCards(${who}): dealt seat ${String(seat + 1)} but ${String(key)} printed at ${String(shown.indexOf(key) + 1)} of ${shown.join('/')}`,
    );
  }
  return makeChoices(r, String(key), values.map(why));
}

/** What a figure this file emits actually holds, for the picture-versus-key check. */
function figureHolds(draft: ItemDraft): number | null {
  const fig = draft.figure;
  if (!fig) return null;
  if (fig.type === 'ten-frame') return fig.params.filled;
  if (fig.type === 'counters') return fig.params.groups.reduce((acc, g) => acc + g.count, 0);
  return null;
}

interface CardSpec {
  /** The key, recomputed from the item's own stored params (disclosure 4). */
  keyOf: (params: Record<string, unknown>) => number;
  keys: ReadonlySet<number>;
  seats: ReadonlyMap<number, SeatWeights>;
  poolOf: (key: number) => number[];
  why: (v: number, key: number) => Card;
  tags: ErrorTag[];
  /** How many things the item's own picture must draw, given that key. */
  drawn?: (key: number) => number;
  who: string;
}

/**
 * Fit a generator with the cards a band-A page needs, and rebuild the audit that
 * putting cards on it takes away.
 *
 * The key is worked out a second time from the stored params by a function in
 * this file, then compared with what the generator keyed and with what the
 * picture draws. A disagreement between the library and this week throws at
 * every seed instead of surviving on one.
 */
function withCards(base: ItemGen, spec: CardSpec): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error(`A10 withCards(${spec.who}): no generator params reached this page, so nothing can be recomputed`);
    const key = spec.keyOf(params);
    // What the generator itself keyed. A generator that already ships cards keys
    // a LETTER, so the value has to be read back off the option it marked
    // correct — comparing this week's re-derivation with "B" would pass nothing
    // and prove nothing.
    const keyedAs =
      draft.answer.validation === 'choice-key'
        ? draft.choices?.find((c) => c.isCorrect)?.text
        : draft.answer.value;
    if (String(key) !== keyedAs) {
      throw new Error(
        `A10 withCards(${spec.who}): the page keyed "${String(keyedAs)}" but this week recomputes ${String(key)}`,
      );
    }
    if (!spec.keys.has(key)) {
      throw new Error(`A10 withCards(${spec.who}): a key of ${String(key)} is outside the slot's own key set`);
    }
    if (spec.drawn) {
      const held = figureHolds(draft);
      if (held !== spec.drawn(key)) {
        throw new Error(
          `A10 withCards(${spec.who}): the answer is ${String(key)} but the picture draws ${String(held)}, not ${String(spec.drawn(key))}`,
        );
      }
    }
    const { choices, correctKey } = threeCards(
      rng,
      key,
      spec.poolOf(key),
      spec.keys,
      spec.seats,
      (v) => spec.why(v, key),
      spec.who,
    );
    return {
      ...draft,
      choices,
      answer: {
        value: correctKey,
        acceptableForms: [String(key), ...draft.answer.acceptableForms.filter((f) => f !== String(key))],
        validation: 'choice-key',
      },
      errorTags: spec.tags,
    };
  };
}

/**
 * DON'T DRAW THE SAME PAIR OF FRAMES TWICE ON ONE PAGE SET (disclosure 12).
 *
 * The composed teen prints the EXTRAS as its only numeral and the frame read
 * prints the TOTAL, so two pages built on the identical picture sign into
 * different namespaces and the pack guard waves both through. The signature
 * here is taken from what the picture holds instead, which is the surface a
 * child actually meets. Bounded and deterministic, never a loop that runs until
 * it succeeds, and applied innermost so a redraw costs no card draws.
 */
function freshFrames(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 8 && guard.taken(`a10:frames|${String(figureHolds(draft))}`); k++) {
      draft = base(rng, guard, difficulty);
    }
    guard.add(`a10:frames|${String(figureHolds(draft))}`);
    return draft;
  };
}

// ===========================================================================
// WHAT A WRONG NUMERAL MEANS, SAID IN ITS OWN PICTURE'S TERMS
// ===========================================================================

/**
 * Teacher-facing, so these are not word-capped — the child only ever sees a
 * numeral. `over` describes a total that has run past the drawing, `under` one
 * that stopped short of it, and `capacity` the frame answering for its contents.
 */
interface Voice {
  over: (k: number) => string;
  under: (k: number) => string;
  capacity?: string;
}

/** How far out the mark was, in words, never as a bare digit. */
const stepWord = (k: number): string => numberWords(k);

const FRAME_VOICE: Voice = {
  over: (k) =>
    `${stepWord(k)} past what the frames hold: the ten was kept, then the counting on among the extras ran ${stepWord(k)} too far.`,
  under: (k) =>
    `${stepWord(k)} short of what the frames hold: the ten was kept and the extras beside it were left ${stepWord(k)} unnamed.`,
  capacity:
    'How much the drawing COULD hold, recorded where what it does hold belongs. A pair of frames is built to take twenty and says so whether or not it is full.',
};

const PILE_VOICE: Voice = {
  over: (k) =>
    `${stepWord(k)} too many for the pile: with nothing grouping the ten, ${k === 1 ? 'a thing' : 'more than one thing'} came round again before the mark was made.`,
  under: (k) =>
    `${stepWord(k)} too few for the pile: the ten was made and then the tail of the heap was hurried, so ${k === 1 ? 'one thing' : 'a few things'} never reached the paper.`,
};

const LINE_VOICE: Voice = {
  over: (k) =>
    `${stepWord(k)} beyond the row: whatever the voice was saying when the finger ran out of things is what reached the paper.`,
  under: (k) =>
    `${stepWord(k)} inside the row: the ten was made and then the far end of the row was abandoned before it was reached.`,
};

const EXTRA_VOICE: Voice = {
  over: (k) =>
    `The full frame leaks into the second mark: ${k === 1 ? 'a counter' : 'two counters'} still inside the packed ten ${k === 1 ? 'is' : 'are'} counted as though outside it.`,
  under: (k) =>
    `The hand covering the packed ten covered ${k === 1 ? 'one of the extras' : 'two of the extras'} as well, so ${k === 1 ? 'it' : 'they'} never reached the second mark.`,
};

/** One voice, read off the VALUE rather than off the branch that produced it. */
function voiceOf(voice: Voice): (v: number, key: number) => Card {
  return (v, key) => {
    if (voice.capacity && v === FULL && key !== FULL) {
      return { text: String(v), errorTag: 'representation-misread', rationale: voice.capacity };
    }
    return v > key
      ? { text: String(v), errorTag: 'procedure-slip', rationale: voice.over(v - key) }
      : { text: String(v), errorTag: 'procedure-slip', rationale: voice.under(key - v) };
  };
}

/**
 * The number path is not a count, so a miscount is the wrong account of it.
 *
 * Found by reading the generated week: the path warm-up asks what comes before a
 * given number and its cards are drawn from the same range, so one of them is
 * routinely the number the question itself names. "Met something twice" is not
 * what a child did there - they stayed put, or they walked too far - and a
 * rationale a teacher cannot believe is worse than a plain one.
 */
const PATH_CARD = (v: number, key: number): Card => ({
  text: String(v),
  errorTag: v > key ? 'concept-misconception' : 'procedure-slip',
  rationale:
    v === key + 1
      ? 'The number the question itself named - no step was taken along the path at all.'
      : v > key
        ? `${stepWord(v - key - 1)} ${v - key - 1 === 1 ? 'step' : 'steps'} FORWARD of the number named - the walk taken the wrong way along the path.`
        : `${stepWord(key - v)} too far back - the walk carried on past the step the question stops at.`,
});

/** Warm-up cards get the plainest account there is: a count that lost its place. */
const PLAIN_CARD = (v: number, key: number): Card => ({
  text: String(v),
  errorTag: 'procedure-slip',
  rationale:
    v > key
      ? `${stepWord(v - key)} past the truth - a count that met something twice on the way through.`
      : `${stepWord(key - v)} short of the truth - a count that stepped over something on the way through.`,
});

const NUMERAL_TAGS: ErrorTag[] = ['representation-misread', 'procedure-slip'];

// ===========================================================================
// Local generator 1 — WHICH NUMBER SAYS IT (the week's discrimination)
// ===========================================================================

/** "Two stacks and three loose blocks" — what a numeral CLAIMS about a picture. */
function readsAs(v: number): string {
  const stacks = Math.floor(v / 10);
  const loose = v % 10;
  return `${countNoun(stacks, 'stacks')} of ten and ${countNoun(loose, 'loose blocks')}`;
}

/**
 * A pile of blocks is drawn as stacks of ten plus loose ones, and the child taps
 * the numeral that says what is there.
 *
 * The two digits are the same on every draw and only their ORDER changes, so
 * nothing about the size or the shape of a numeral survives as a shortcut: which
 * arrangement is drawn is a coin, so the teen is the answer on half the pages and
 * the swapped numeral on the other half (disclosure 1). The third card is another
 * member of the same six, taken from whichever side of the truth the seat needs
 * (disclosure 2).
 *
 * Registered on `a_numeral_trap_v1`, the transform the family's own symbol traps
 * use, so QG-11 recomputes the truth from the params rather than believing this
 * file; and the drawing asserts its own total against the keyed numeral.
 */
function whichNumberSaysIt(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const o = r.pick(SWAP_ONES);
      const teenShown = r.chance(0.5);
      const stacks = teenShown ? 1 : o;
      const loose = teenShown ? o : 1;
      const total = swapValue(o, teenShown);
      const swapped = swapValue(o, !teenShown);
      if (10 * stacks + loose !== total) {
        throw new Error(`A10 whichNumberSaysIt: ${String(stacks)} stacks and ${String(loose)} loose is not ${String(total)}`);
      }
      const others = [...SWAP_KEYS].filter((v) => v !== total && v !== swapped);
      const under = others.filter((v) => v < total);
      const over = others.filter((v) => v > total);
      // One side is empty on exactly two of the six cells, and taking the only
      // side there is what pays the ends back; everywhere else a fair coin.
      const third =
        under.length === 0
          ? r.pick(over)
          : over.length === 0
            ? r.pick(under)
            : r.chance(0.5)
              ? r.pick(under)
              : r.pick(over);
      // FOUND BY READING THE GENERATED WEEK: this named thirteen out loud, which
      // is false of the twelve and fourteen pages it also lands on. The account
      // is the same for all of them, so it is now written without an example.
      const swapWhy = teenShown
        ? 'The parts written in the order the teen NAME says them: every teen word gives the extras before the ten, and this numeral is that order put on paper.'
        : 'The stacks and the loose block written the other way round, which would name a teen - and a teen holds exactly one stack.';
      const thirdWhy = `That numeral claims ${readsAs(third)}, which is not what has been laid out here.`;
      const { choices, correctKey } = makeChoices(r, String(total), [
        { text: String(swapped), errorTag: 'concept-misconception' as ErrorTag, rationale: swapWhy },
        { text: String(third), errorTag: 'representation-misread' as ErrorTag, rationale: thirdWhy },
      ]);
      const scene = `${countNoun(total, 'blocks')}: ${countNoun(stacks, 'stacks')} of ten and ${countNoun(loose, 'loose blocks')}`;
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(scene, 'Tap the number these blocks make.'),
        figure: counterGroups(
          [
            ...Array.from({ length: stacks }, () => ({ count: 10, noun: 'blocks' })),
            { count: loose, noun: 'blocks' },
          ],
          { arrangement: 'towers', alt: STACKS_ALT, asserts: assertsAnswer },
        ),
        choices,
        answer: { value: correctKey, acceptableForms: [String(total)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_numeral_trap_v1', params: { n: total, trap: 'digit-swap', stacks, loose }, seed: r.uint() },
        hintLadder: ladder('How many whole stacks are standing here?', 'Stacks decide the front mark. Loose ones decide the back.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'read-the-order', isDiscrimination: true },
      };
      // The audit QG-5 stops running once the answer is a tapped key.
      if (figureHolds(draft) !== total) {
        throw new Error(`A10 whichNumberSaysIt: the picture draws ${String(figureHolds(draft))} blocks against a key of ${String(total)}`);
      }
      if (!SWAP_KEYS.has(third) || !SWAP_KEYS.has(swapped)) {
        throw new Error('A10 whichNumberSaysIt: a card was offered that no draw of this page can key');
      }
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — READ THE FRAMES, then choose the mark for them
// ===========================================================================

/**
 * The recipe's second core form: a teen laid out as a packed ten and its extras,
 * labelled with the numeral a child would write for it.
 *
 * Not `tenFrameRead`: its question reads "How many counters are in the frame?",
 * singular, beside a picture of two — a sentence a pre-reader HEARS while looking
 * at something that disagrees with it, which A9 found by reading its own
 * generated week. The question here also asks for the MARK rather than the count,
 * which is the difference between this week and the one before it.
 */
function readTheFrames(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(`${countNoun(n, 'counters')} across the frames`, 'Which number belongs with these frames?'),
        figure: tenFrame(n, { size: 10, frames: 2, alt: FRAMES_ALT, asserts: assertsParam('n') }),
        answer: { value: String(n), acceptableForms: [numberWords(n)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_read_v1', params: { n }, seed: r.uint() },
        hintLadder: ladder('Which frame has no empty cells left?', 'That whole frame is worth the first mark.'),
        errorTags: NUMERAL_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'mark-for-the-frames' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — a counted set, and the mark for it
// ===========================================================================

interface SetShape {
  /** What the child is asked. Never a sentence any other week in the corpus uses. */
  question: string;
  /** What the `[image: …]` bracket says. The count stays: it feeds the guard. */
  bracket: (n: number, noun: string) => string;
  /** The SPOKEN name: layout and kind, and never a quantity. */
  look: string;
  arrangement: string;
  voice: Voice;
}

const SET_SHAPES: Record<'pile' | 'rows', SetShape> = {
  pile: {
    question: 'Tap the number for this heap.',
    bracket: (n, noun) => `${countNoun(n, noun)} tipped out in a heap`,
    look: 'tipped out in a heap',
    arrangement: 'scattered',
    voice: PILE_VOICE,
  },
  rows: {
    question: 'Tap the number for these rows.',
    bracket: (n, noun) => `${countNoun(n, noun)} set out in two rows`,
    look: 'set out in a row with another row beneath it',
    arrangement: 'in two rows',
    voice: LINE_VOICE,
  },
};

/**
 * A set with nothing grouping its ten, ending in the numeral a child would write.
 *
 * Not `howManyChoice`: it builds its cards from n ± 1 and n ± 2 without clamping,
 * so at a floor of eleven it offers nine and ten and at a ceiling of twenty it
 * offers twenty-one — numerals no draw of this week can key, which is the dead
 * card §E2.11 forbids and the one most easily avoided. Registered on
 * `a_numeral_for_set_v1`, whose `verifyFor` recomputes the truth from the same
 * `n` the drawing is built from.
 */
function numeralForSet(which: 'pile' | 'rows', rungs: string[]): ItemGen {
  const shape = SET_SHAPES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const noun = r.pick(COUNTABLE_NOUNS);
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(shape.bracket(n, noun), shape.question),
        figure: counters(n, noun, {
          arrangement: shape.arrangement,
          alt: looseAlt(noun, shape.look),
          asserts: assertsParam('n'),
        }),
        answer: { value: String(n), acceptableForms: [numberWords(n)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun, arrangement: shape.arrangement }, seed: r.uint() },
        hintLadder: rungs,
        errorTags: NUMERAL_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: `mark-for-a-${which}` },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — WRITE the teen (the week's own act)
// ===========================================================================

/**
 * The child counts the picture and writes the two marks with a finger.
 *
 * `manual-review` is both the honest validation and the right INPUT: at band A
 * `AnswerEntry` renders a manual-review page as one oversized "I did it!"
 * acknowledgement, so a four-year-old never meets a keyboard and the writing
 * happens on paper, where a numeral can be formed. The truth is still
 * code-computed — it is the drawn `n`, recomputed by `a_frame_read_v1` and
 * `a_count_v1` — so the grown-up marking it has the number in front of them.
 *
 * The picture may assert its own answer here because the page does not ask the
 * child to CHOOSE the number: it asks them to put the marks down in order, and
 * nothing on the page shows that order.
 */
function writeTheTeen(kind: 'frames' | 'line'): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      if (kind === 'frames') {
        const draft: ItemDraft = {
          type: 'drawing',
          prompt: scenePrompt(`${countNoun(n, 'counters')} across the frames`, 'Write the number these frames make.'),
          figure: tenFrame(n, { size: 10, frames: 2, alt: FRAMES_ALT, asserts: assertsAnswer }),
          answer: {
            value: String(n),
            acceptableForms: [numberWords(n), `${countNoun(n, 'counters')} written down`],
            validation: 'manual-review',
          },
          difficulty,
          strand: 'computational',
          isRetrieval: false,
          generator: { templateId: 'a_frame_read_v1', params: { n }, seed: r.uint() },
          hintLadder: ladder('Which part of this picture is already a ten?', 'That part goes down first. The rest follows.'),
          errorTags: ['concept-misconception', 'procedure-slip'],
          authorMeta: { stepCount: 1, cognitiveOp: 'write-the-marks' },
        };
        return draft;
      }
      const noun = r.pick(COUNTABLE_NOUNS);
      const draft: ItemDraft = {
        type: 'drawing',
        prompt: scenePrompt(`${countNoun(n, noun)} lined up end to end`, `Make a ten. Then write the number.`),
        figure: counters(n, noun, {
          arrangement: 'in a row',
          alt: looseAlt(noun, 'lined up end to end'),
          asserts: assertsAnswer,
        }),
        answer: {
          value: String(n),
          acceptableForms: [numberWords(n), `${countNoun(n, noun)} written down`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_count_v1', params: { n, noun, arrangement: 'in a row' }, seed: r.uint() },
        hintLadder: ladder('Break ten away from the end of the line.', 'Now you have a ten and a few more.'),
        errorTags: ['procedure-slip', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'group-then-write' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — help the puppet, who wrote the parts in the wrong order
// ===========================================================================

/** The digit string reversed — the registry's own slip, recomputed here to check it. */
function reversed(n: number): number {
  return Number(String(n).split('').reverse().join(''));
}

/**
 * The band-A error-analysis form on the week's own misconception.
 *
 * A NAMED puppet wrote the two marks in the order the teen name says them, the
 * child fixes it by TAPPING, the word "wrong" never appears, and the number the
 * puppet wrote is recomputed by the registered `a_verify_teen_write_v1` — which
 * QG-11 then requires the prompt to show. Nothing about the slip is authored:
 * eleven reads the same reversed and the registry refuses it, so the pool starts
 * at twelve.
 *
 * The reversal is NOT a card (disclosure 3): it is at least twenty-one, which no
 * draw of this page can key. The three cards are the truth and two honest
 * miscounts of the extras, so the seat rotates and there is no "avoid the big
 * one" to be learned instead of counting.
 */
function puppetSwapsTheDigits(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const n = r.pick(PUPPET_CELLS);
      const wrote = reversed(n);
      if (wrote === n || wrote <= HI) {
        throw new Error(`A10 puppetSwapsTheDigits: ${String(n)} reversed is ${String(wrote)}, which is no slip at all`);
      }
      const { choices, correctKey } = threeCards(
        r,
        n,
        nearPool(n, PUPPET_KEYS),
        PUPPET_KEYS,
        PUPPET_SEATS,
        (v) => voiceOf(FRAME_VOICE)(v, n),
        'the puppet',
      );
      const draft: ItemDraft = {
        type: 'error-analysis',
        // The puppet's number is stated on purpose - that is the form, and it is
        // the value the registry recomputes. The question then has to ask for
        // something: a page that only reports what the puppet did asks nothing.
        prompt: scenePrompt(
          `${countNoun(n, 'counters')} across the frames`,
          `${puppet} wrote ${String(wrote)}. Tap what the frames really say.`,
        ),
        figure: tenFrame(n, { size: 10, frames: 2, alt: FRAMES_ALT, asserts: assertsParam('n') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_verify_teen_write_v1', params: { n }, seed: r.uint() },
        hintLadder: ladder('What was counted before anything else here?', 'The part counted first is written first.'),
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-order-fix', isErrorAnalysis: true },
      };
      if (figureHolds(draft) !== n) {
        throw new Error(`A10 puppetSwapsTheDigits: the frames draw ${String(figureHolds(draft))} against a truth of ${String(n)}`);
      }
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — the Day-4 real-world pages
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null because a single-step picture inside a real
 * situation IS the band-A word problem, not a watered-down two-step. The family
 * has no counting-story generator — its word problems join or take away, and
 * this week has taught neither — so the three frames live here.
 *
 * The sentence names the KIND and the place and never the quantity: the only
 * place the number exists is the drawing. Scanned against the whole weeks
 * directory at the END of the build (§E2.8), because a shelf, a doorstep, a
 * beach towel, a market stall, a tree stump, a box lid, a picnic rug, a garden
 * path, a mat, a ledge, a tray, a sill, a bench, a basket, a stool and a raft
 * were all claimed by weeks written before or beside this one.
 */
interface StoryFrame {
  line: (name: string, noun: string) => string;
  ask: string;
  bracket: (n: number, noun: string) => string;
  look: string;
  arrangement: string;
  nouns: readonly string[];
  voice: Voice;
  rungs: string[];
}

const STORY_FRAMES: Record<'pinboard' | 'apron' | 'windowbox', StoryFrame> = {
  pinboard: {
    line: (name, noun) => `${name} pins some ${unitFor(2, noun)} across a pinboard.`,
    ask: 'Which number belongs under them?',
    bracket: (n, noun) => `${countNoun(n, noun)} pinned across a pinboard`,
    look: 'pinned in a line across a pinboard',
    arrangement: 'in a row',
    nouns: ['stars', 'leaves', 'flowers'],
    voice: LINE_VOICE,
    rungs: ['Work from one end of the pinboard steadily.', 'Pause at the tenth. Then finish the rest.'],
  },
  apron: {
    line: (name, noun) => `${name} tips some ${unitFor(2, noun)} out of an apron.`,
    ask: 'What should the label say?',
    bracket: (n, noun) => `${countNoun(n, noun)} tipped out of an apron`,
    look: 'tipped out of an apron in a jumble',
    arrangement: 'scattered',
    nouns: ['shells', 'buttons', 'blocks'],
    voice: PILE_VOICE,
    rungs: ['Move each thing away once it has a number.', 'Build a ten out of them before writing.'],
  },
  windowbox: {
    line: (name, noun) => `${name} plants some ${unitFor(2, noun)} in a windowbox.`,
    ask: 'Which number goes on the tag?',
    bracket: (n, noun) => `${countNoun(n, noun)} standing in two rows in a windowbox`,
    look: 'standing in a row with another row behind it in a windowbox',
    arrangement: 'in two rows',
    nouns: ['flowers', 'leaves'],
    voice: LINE_VOICE,
    rungs: ['Do the back row before the front one.', 'The tenth one marks where the extras begin.'],
  },
};

function numberStory(which: 'pinboard' | 'apron' | 'windowbox'): ItemGen {
  const frame = STORY_FRAMES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const noun = r.pick(frame.nouns);
      const name = someone(r);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(frame.bracket(n, noun), `${frame.line(name, noun)} ${frame.ask}`),
        figure: counters(n, noun, {
          arrangement: frame.arrangement,
          alt: looseAlt(noun, frame.look),
          asserts: assertsParam('n'),
        }),
        answer: { value: String(n), acceptableForms: [numberWords(n)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_numeral_for_set_v1',
          params: { n, noun, arrangement: frame.arrangement, place: which },
          seed: r.uint(),
        },
        hintLadder: ladder(...frame.rungs),
        errorTags: ['task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: `label-the-${which}`, situationType: 'part-whole' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 7 — Day 5: write it, then say what the first mark stands for
// ===========================================================================

/**
 * The oral half of the band-A Day-5 signature, on this week's own idea.
 *
 * The child counts a loose pile, writes the two marks, and then TELLS a grown-up
 * what the first one stands for — which is the only place the difference between
 * knowing the shape and knowing the structure can actually be heard. The pile and
 * the numeral are code-derived; the telling is the honest not-fully-computable
 * part (§7), so the page validates `manual-review` rather than pretending to
 * grade it. It is also the week's justification-demanding non-computational item,
 * which is what the strand-coupling check looks for.
 */
function writeAndTell(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const noun = r.pick(COUNTABLE_NOUNS);
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(
          `${countNoun(n, noun)} gathered in a jumble`,
          'Make the marks for this. Say what the first one counts.',
        ),
        figure: counters(n, noun, {
          arrangement: 'scattered',
          alt: looseAlt(noun, 'gathered in a jumble'),
          asserts: assertsAnswer,
        }),
        answer: {
          value: String(n),
          acceptableForms: [numberWords(n), `${countNoun(n, noun)} written down`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_count_v1', params: { n, noun, arrangement: 'scattered' }, seed: r.uint() },
        hintLadder: ladder('Group ten of them before any mark goes down.', 'Point at each mark and name what it counts.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'write-and-name-the-parts' },
      };
      return draft;
    });
}

// ===========================================================================
// The generators, bound to this week's ranges and given its voice
// ===========================================================================

/** CERTIFIES (mastery 01) — the anchor, read off the apparatus and labelled. */
const frameNumeral = withCards(readTheFrames(), {
  keyOf: (p) => Number(p.n),
  keys: TEEN_KEYS,
  seats: FRAME_SEATS,
  poolOf: (k) => framePool(k, TEEN_KEYS),
  why: voiceOf(FRAME_VOICE),
  tags: NUMERAL_TAGS,
  drawn: (k) => k,
  who: 'the frame read',
});
const frameNumeralDay = freshFrames(frameNumeral);

/** CERTIFIES (mastery 04) — the recipe's own sentence: ten and some more.
 *  `o` runs to ten so the slot reaches twenty and its cards match every other
 *  teen slot in the week. */
const tenAndMore = withLadder(
  withCards(withPlainAlt(teenTenAnd({ min: 1, max: 10 }), FRAMES_ALT), {
    keyOf: (p) => TEN + Number(p.o),
    keys: TEEN_KEYS,
    seats: FRAME_SEATS,
    poolOf: (k) => framePool(k, TEEN_KEYS),
    why: voiceOf(FRAME_VOICE),
    tags: NUMERAL_TAGS,
    drawn: (k) => k,
    who: 'the composed teen',
  }),
  ladder('How much is already counted before you start?', 'Write that part first, then add the rest after it.'),
);
const tenAndMoreDay = freshFrames(tenAndMore);

/** The teen taken apart: what the SECOND mark records. Its own range, its own seats. */
const extrasAsk = withLadder(
  withCards(withPlainAlt(teenExtra({ min: LO, max: HI - 1 }), FRAMES_ALT), {
    keyOf: (p) => Number(p.n) - TEN,
    keys: EXTRA_KEYS,
    seats: EXTRA_SEATS,
    poolOf: (k) => nearPool(k, EXTRA_KEYS),
    why: voiceOf(EXTRA_VOICE),
    tags: ['representation-misread', 'concept-misconception'],
    drawn: (k) => k + TEN,
    who: 'the extras',
  }),
  ladder('Rest your palm over the packed frame.', 'What is left uncovered is the second mark.'),
);
const extrasAskDay = freshFrames(extrasAsk);

/** CERTIFIES (mastery 02) — a heap, where nothing has grouped the ten for you. */
const pileNumeral = withCards(
  numeralForSet('pile', ladder('Push a group of ten to one side.', 'Now the pile has two parts to name.')),
  {
    keyOf: (p) => Number(p.n),
    keys: TEEN_KEYS,
    seats: TEEN_SEATS,
    poolOf: (k) => nearPool(k, TEEN_KEYS),
    why: voiceOf(PILE_VOICE),
    tags: NUMERAL_TAGS,
    drawn: (k) => k,
    who: 'a heap',
  },
);

/** The same act on two tidy rows — Day 5, where the counting is easiest and the
 *  order of the marks is all that is being asked about. */
const rowsNumeral = withCards(
  numeralForSet('rows', ladder('Where does the tenth thing sit in these rows?', 'Everything after it belongs to the second mark.')),
  {
    keyOf: (p) => Number(p.n),
    keys: TEEN_KEYS,
    seats: TEEN_SEATS,
    poolOf: (k) => nearPool(k, TEEN_KEYS),
    why: voiceOf(LINE_VOICE),
    tags: NUMERAL_TAGS,
    drawn: (k) => k,
    who: 'two rows',
  },
);

/** CERTIFIES (mastery 03) — the week's discrimination. */
const digitOrder = whichNumberSaysIt();

const writeFromFrames = freshFrames(writeTheTeen('frames'));
const writeFromLine = writeTheTeen('line');
const puppetPage = freshFrames(puppetSwapsTheDigits());

/**
 * The three real-world pages, each with the cards a band-A page needs.
 *
 * FOUND BY READING THE GENERATED WEEK, not by any gate, and it is disclosure 4's
 * own rule broken on the day that most needed it: the first build shipped all
 * three stories AND mastery slot 06 as `exact-numeric` with no `choices` at all,
 * so `AnswerEntry` would have handed each of them to `tapOptionsFor` and invented
 * their buttons at render time - from a function with no way of knowing the slot
 * draws 11-20, on the four pages of the week where the count has to be made with
 * nothing on the page grouping it. A9 recorded the identical escape on its own
 * Day 4; the reason it is easy to miss both times is that a bare numeric page
 * looks finished. Every misconception-faithful card this file writes elsewhere
 * was being thrown away on them.
 *
 * Each takes the voice of its own picture: a line runs past its end, a heap
 * meets things twice.
 */
function cardedStory(which: 'pinboard' | 'apron' | 'windowbox'): ItemGen {
  return withCards(numberStory(which), {
    keyOf: (p) => Number(p.n),
    keys: TEEN_KEYS,
    seats: TEEN_SEATS,
    poolOf: (k) => nearPool(k, TEEN_KEYS),
    why: voiceOf(STORY_FRAMES[which].voice),
    tags: ['task-comprehension', 'procedure-slip'],
    drawn: (k) => k,
    who: `the ${which}`,
  });
}

/** CERTIFIES (mastery 06) — the transfer page, with no frame anywhere on it. */
const storyPinboard = cardedStory('pinboard');
const storyApron = cardedStory('apron');
const storyWindowbox = cardedStory('windowbox');

/** CERTIFIES (mastery 05) — the recipe's Day-5 match, numeral to set. */
const matchTheTeen = withLadder(
  setForNumeral({ min: LO, max: HI, groups: 3 }),
  ladder('Keep the number you heard in your head.', 'Count a group right through before judging it.'),
);

const day5Tell = writeAndTell();

// --- the four warm-ups: one week, one format and one day each ----------------
const warmLooseTeen = warmUp(
  withCards(countArrangement({ min: LO, max: HI - 1, arrangement: 'in a ring' }), {
    keyOf: (p) => Number(p.n),
    keys: LOOSE_KEYS,
    seats: LOOSE_SEATS,
    poolOf: (k) => nearPool(k, LOOSE_KEYS),
    why: PLAIN_CARD,
    tags: ['procedure-slip'],
    drawn: (k) => k,
    who: 'a teen in a ring',
  }),
  9,
);
const warmSmallSet = warmUp(
  withCards(howManyChoice({ min: 6, max: 10, arrangement: 'in two rows' }), {
    keyOf: (p) => Number(p.n),
    keys: SMALL_KEYS,
    seats: SMALL_SEATS,
    poolOf: (k) => nearPool(k, SMALL_KEYS),
    why: PLAIN_CARD,
    tags: ['procedure-slip'],
    drawn: (k) => k,
    who: 'a small set',
  }),
  4,
);
const warmStepBefore = warmUp(
  withCards(neighbourNumber({ kind: 'before', min: 12, max: 19 }), {
    keyOf: (p) => Number(p.n) - 1,
    keys: BEFORE_KEYS,
    seats: BEFORE_SEATS,
    poolOf: (k) => nearPool(k, BEFORE_KEYS),
    why: PATH_CARD,
    tags: ['concept-misconception', 'procedure-slip'],
    who: 'the step before',
  }),
  6,
);
const warmFewerRow = warmUp(compareSets({ which: 'fewer', min: 6, max: 10 }), 5);

// ===========================================================================
// The week
// ===========================================================================

export const buildA10 = makeWeekBuilder({
  level: 'A',
  week: 10,
  conceptId: 'writing-numbers-11-20',
  conceptName: 'Writing numbers 11–20',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 4 },
    { level: 'A', week: 9 },
  ],
  pedagogyContract: 'v2',
  // Band A spends the §6.1 multi-step row on the pictorial rule, so this
  // selector is inert here; it is declared because the kit asks every non-D
  // blueprint to name its family, and putting two marks in an order is a
  // representation skill rather than an operation.
  conceptFamily: 'place-value',
  conceptualAnchor: 'a ten and some more',
  deepeningDelta:
    'A4 established that a numeral RECORDS HOW MANY: count a set, hold the number, and put down the mark that stands for it - one count, one mark, and the only thing that could go wrong with the mark was its shape, which is why six against nine was that week\'s whole discrimination. A10 keeps the act and changes what the mark is made of. A teen numeral is TWO marks, and they are not two halves of a picture of the quantity: the first one counts tens and the second counts what is left over, so the numeral records a STRUCTURE rather than a total. That is new, and three things follow from it that A4 has no version of. The order of the two marks is now load-bearing - the same pair written the other way round is a different number, which is why this week can have a discrimination at all and why it is 13 against 31 rather than a shape. The error is no longer in the hand but in the ear feeding the hand: "thir-teen" says the extras first and the ten second, so a child who writes exactly what they heard writes 31, and that is the puppet\'s slip. And the ten has to be MADE before anything can be written on the loose pages, where nothing has grouped it, so the counting and the writing stop being separable. A4 asked "is that the shape you meant?"; A10 asks "is that mark in the place that means ten?".',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt is spoken, not read; one question fills a page; targets are finger-sized. Writing happens on paper beside the tablet, with a chunky pencil, because a teen numeral is two marks in a fixed order and the hand learns the order by making it. Say the two parts out loud in the order they are written - "one ten, then three" - every single time, and let the child watch which part of the picture you touch as you say each mark. Ten real counters in a tray and a handful loose beside them beat anything on the screen. Writing 31 for thirteen is not carelessness; it is what the word says, so name that out loud rather than correcting the mark. Mascot present.',
  },
  explanation: {
    hook: say(
      'Say thirteen out loud. You hear three at the front. But the ten came first! So the ten is written first.',
    ),
    whyBeforeHow: say(
      'A teen number is a ten and some more. We write it with two marks, not one. The ten goes first because we counted it first. Then the extras go after it. So the order of the two marks carries the meaning. Swap them over and you have made a different number.',
    ),
    script: [
      {
        say: say('Here is a packed frame. That is our ten. Watch.'),
        visual: 'A frame packed to its last cell, with an empty frame beside it.',
        figure: tenFrame(10, { size: 10, frames: 2, alt: alt('a packed frame beside an empty frame') }),
      },
      {
        say: say('Three wait outside it. Thirteen. This ten, then those three.'),
        visual: 'The packed frame with three counters begun in the second frame.',
        figure: tenFrame(13, { size: 10, frames: 2, alt: alt('a packed frame, with a few counters started in the next') }),
      },
      {
        // The discrimination, taught where both pictures are available and the
        // answer is already on the page (disclosure 1).
        say: say('Here are three whole stacks and one loose. Thirty-one!'),
        visual: 'A row of three block towers, with a single block left over.',
        figure: counterGroups(
          [
            { count: 10, noun: 'blocks' },
            { count: 10, noun: 'blocks' },
            { count: 10, noun: 'blocks' },
            { count: 1, noun: 'blocks' },
          ],
          { arrangement: 'towers', alt: STACKS_ALT },
        ),
      },
      {
        say: say('Same two marks. Other way round. Look how different!'),
        visual: 'The thirteen frames again, held beside the three stacks.',
        figure: tenFrame(13, { size: 10, frames: 2, alt: alt('the packed frame and its few extras, back again') }),
      },
    ],
    summary: say(
      'Find the ten. Give it the front mark. Count what is left over. That number goes behind. Read your marks back in order.',
    ),
    vocabulary: [
      { term: 'teen number', kidGloss: 'a number past ten but not yet twenty' },
      { term: 'two marks', kidGloss: 'the pair of digits a teen number needs' },
      { term: 'first mark', kidGloss: 'the one standing for the whole packed ten' },
      { term: 'the extras', kidGloss: 'the ones outside the packed frame' },
    ],
  },
  guidedExamples: [
    {
      ...ge(10, 1, 'modeled', scenePrompt('the frames with counters across them', 'Which number belongs with these frames?'), [
        {
          teacherSay: say('My eyes go to the packed frame before anything else. I have my first mark already.'),
          expected: '10',
        },
        { childDo: say('Count what sits outside it with me.'), expected: '4' },
        { teacherSay: say('So my first mark is the ten. Then the four.') },
      ], '14'),
      visual: 'A frame with every cell taken, and a small group started beside it.',
      figure: tenFrame(14, { size: 10, frames: 2, alt: FRAMES_ALT, asserts: assertsAnswer }),
    },
    {
      ...ge(10, 2, 'completion', scenePrompt('a packed frame and a few counters beside it', 'Ten and 7 more. What number?'), [
        { teacherSay: say('I will start. The packed frame is the first mark.') },
        { childDo: say('Now put the extras down after it.'), expected: '17' },
        { teacherSay: say('Seventeen. The ten leads and the extras follow.') },
      ], '17'),
      visual: 'A frame packed solid, with seven counters started in the frame beside it.',
      figure: tenFrame(17, { size: 10, frames: 2, alt: FRAMES_ALT, asserts: assertsAnswer }),
    },
    {
      ...ge(10, 3, 'prompted', scenePrompt('stacks of blocks with a loose one beside them', 'Tap the number these blocks make.'), [
        { teacherSay: say('Count the tall stacks. Not the loose ones yet.'), expected: '2' },
        { childDo: say('Now say the stacks first, then the rest.'), expected: '21' },
      ], '21'),
      visual: 'Two tall stacks of ten blocks standing beside one loose block.',
      figure: counterGroups(
        [
          { count: 10, noun: 'blocks' },
          { count: 10, noun: 'blocks' },
          { count: 1, noun: 'blocks' },
        ],
        { arrangement: 'towers', alt: STACKS_ALT, asserts: assertsAnswer },
      ),
    },
    {
      ...ge(10, 4, 'independent', scenePrompt('shells gathered in a jumble', 'Make a ten. Then write the number.'), [
        { childDo: say('Slide ten aside, then count the rest.'), expected: '16' },
      ], '16'),
      visual: 'Sixteen shells gathered in a jumble, with ten slid to one side.',
      figure: counters(16, 'shells', {
        arrangement: 'scattered',
        alt: looseAlt('shells', 'gathered in a jumble'),
        asserts: assertsAnswer,
      }),
    },
  ],
  days: [
    // Day 1 — concept echo: the ten is already counted, so it gets the first
    // mark. Composed, read, and then written by hand.
    [
      { gen: warmLooseTeen, diff: 1 },
      { gen: tenAndMoreDay, diff: 2 },
      { gen: frameNumeralDay, diff: 2 },
      { gen: writeFromFrames, diff: 3 },
    ],
    // Day 2 — the frames go away. The ten has to be made before either mark can
    // be written, and the order of the two marks meets its trap.
    [
      { gen: warmSmallSet, diff: 2 },
      { gen: pileNumeral, diff: 2 },
      { gen: digitOrder, diff: 3 },
      { gen: writeFromLine, diff: 3 },
    ],
    // Day 3 — the second mark named on its own, the trap again, and a puppet who
    // wrote the parts in the order the word says them.
    [
      { gen: warmStepBefore, diff: 2 },
      { gen: extrasAskDay, diff: 2 },
      { gen: digitOrder, diff: 3 },
      { gen: puppetPage, diff: 3 },
    ],
    // Day 4 — single-step real-world pictures (the band-A form of G7), each one
    // ending in a written or chosen numeral.
    [
      { gen: warmFewerRow, diff: 2 },
      { gen: storyPinboard, diff: 2 },
      { gen: storyApron, diff: 3 },
      { gen: storyWindowbox, diff: 3 },
    ],
    // Day 5 — the match run both ways, then write one and say what its parts are.
    [
      { gen: matchTheTeen, diff: 2 },
      { gen: rowsNumeral, diff: 3 },
      { gen: day5Tell, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    "For grown-ups: there is one mistake this week is built around, and it is not a mistake about numbers. Ask a four-year-old to write thirteen and a great many of them write 31. They have heard the word perfectly. English says the parts of a teen backwards - thir-teen gives you the three before the ten - while the writing gives you the ten before the three, and teens are the only place in the whole number system where the name and the marks disagree. So do not treat 31 as carelessness. Say out loud what happened: \"you wrote what you heard, and the word says it backwards\". Then rebuild it from the picture rather than the sound - point at the packed ten, say \"this one goes first\", point at the loose ones, say \"these go after\". Two things help at home. Keep ten of something in a pot and the spare ones loose beside it, so the ten is a THING and not a word. And when you write a teen down together, touch the ten as you make the first mark and the extras as you make the second, every time, in that order; the hand learns the order long before the reasoning does. Expect eleven and twelve to be the hardest to say and the easiest to write, and nineteen the other way round.",
  ],
  /**
   * The band-A production puzzle, and the catalog's Day-5 non-computational
   * focus: count and colour, with close distractors.
   *
   * Every page in the core hands the child ONE thing to count. Here there are
   * three, and their counts sit one apart, so no group can be rejected by
   * looking - each has to be counted through and matched against the numeral
   * before a crayon is picked up. That is a move the core never asks for, and it
   * is where "the numeral names exactly one of these" gets tested.
   *
   * `manual-review`, because nothing can grade a crayon, and because `Puzzle`
   * carries no `choices` field at all in `types.ts` - left as `exact-numeric` it
   * would fall through to `tapOptionsFor`, which invents buttons from the answer
   * alone. The number the colouring must come to is in `answer.value` for the
   * grown-up and for any audit.
   */
  puzzle: (r, guard) => {
    // The middle count is drawn away from the ends so both neighbours are inside
    // 11-20, and away from any total the days already coloured a page with.
    let n = r.int(LO + 1, HI - 1);
    for (let k = 0; k < 10 && guard.taken(`a10:colour|${String(n)}`); k++) n = r.int(LO + 1, HI - 1);
    guard.add(`a10:colour|${String(n)}`);
    const counts = r.shuffle([n - 1, n, n + 1]);
    const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
    const target = counts.indexOf(n);
    return {
      id: 'A10-PZ-01',
      title: 'Puzzle Grove: Colour the One It Names',
      puzzleType: 'construction',
      prompt: [
        `[image: ${counts.map((c, i) => countNoun(c, nouns[i])).join(', ')}]`,
        say(`Only one group holds ${String(n)}.`),
        say('Count all three. Colour that one.'),
      ].join(' '),
      figure: counterGroups(
        counts.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
        // A puzzle carries no `generator`, so there are no params to point at:
        // the claim is made against the ANSWER, which is the count of that group.
        { alt: groupsAlt(nouns), asserts: assertsAnswerOf(`group:${String(target)}`) },
      ),
      answer: {
        value: String(n),
        acceptableForms: [`the ${nouns[target]} coloured`, numberWords(n)],
        validation: 'manual-review',
      },
      hintLadder: ladder('Do these groups really hold the same?', 'Finish counting one group before starting another.'),
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'count-three-then-colour-one' },
  sprint: null,
  mastery: [
    { gen: frameNumeral, diff: 2 },
    { gen: pileNumeral, diff: 3 },
    { gen: digitOrder, diff: 3 },
    { gen: tenAndMore, diff: 2 },
    { gen: matchTheTeen, diff: 3 },
    { gen: storyPinboard, diff: 3 },
  ],
  isomorphNotes:
    'Form B answers Form A slot for slot - the same generator at the same difficulty in each place, with its numbers drawn off a separate stream - and every slot is a tap on cards written into this file, so no certifying page is left as a bare numeral for the display layer to build buttons around. 01 reads a teen off the packed frame and its extras and asks for the mark. 02 does the same for a heap where nothing has grouped the ten. 04 is the week\'s own sentence, a stated ten and some more, answered with the numeral. 06 is a real-world page with no frame anywhere on it, which is the hardest transfer the week asks. On all four of those the cards are drawn from 11-20, the same range the picture is drawn from, so every numeral offered is one that slot really keys on some other draw; the frame pages carry twenty as an ordinary member of the pool, live rather than a lure, because both frames genuinely fill on a tenth of the draws. WHICH SEAT the truth will take is settled by weights before any wrong number is chosen, because eleven has nothing beneath it in the range and twenty nothing above it, and a range left to itself starves its middle seat. 03 is the discrimination and it is the reason the week exists: one stack of ten with some loose blocks, or that many stacks with one loose block, decided by a coin, with both readings of the same two digits on the page every time - so the numeral past twenty is the answer half the time, nothing can be struck out for being big, and no size, position or shape survives as a shortcut. 05 names a teen and asks which of three counted groups holds it. Form B is kept off Form A\'s ground by the assembler, which rebuilds any Form-B page whose template and params match its Form-A twin, and by the pack-wide surface guard, which refuses a repeated numeral surface anywhere in the pack; what is NOT separately enforced is the count-and-kind pairing inside a page, and rather than claim it away: measured over 600 packs, 5.1% of the five pairings Form B prints also appear somewhere in Form A. Closing that would put a second rejection axis on a draw pool this week deliberately keeps single, which is how a slot ends up holding whatever the earlier slots did not want.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'writes-the-parts-in-the-name-order',
      description:
        'Writes 31 for thirteen. The child has heard the word correctly and written its parts in the order they were said - "thir-teen" gives the extras first and the ten second. Teens are the only numbers whose spoken name and written marks disagree about which part comes first, which is why this error appears here and nowhere else in the level.',
      exampleWrongAnswer: 'a packed frame with 3 counters beside it, labelled 31',
      distractorRationale:
        'Offer both readings of the same two digits on every draw of the discrimination, and let the PICTURE decide which of them is true - one stack and some loose blocks, or that many stacks and one loose block, on a coin. The swapped numeral is therefore the answer half the time, so it can never be struck out on sight, and a child who taps it out of habit is right about as often as a guess. It is deliberately NOT offered on the teen pages: the swap of a teen is past twenty, and no draw of a page keying 11-20 could ever make it true.',
      reteachPointer: 'explanation/script[2] (what thirty-one actually looks like when it is built)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'writes-only-the-extras',
      description:
        'Writes 7 for seventeen - the packed ten stops being counted at all once it is full, and only what is left over reaches the paper. It is the commonest teen error at this age and it is the exact opposite of the swap: one child drops the ten, the other puts it second.',
      exampleWrongAnswer: 'a packed frame with 7 counters beside it, labelled 7',
      distractorRationale:
        'No slot that keys 11-20 could ever key a lone digit, so dealing one there would train a child to cross short numbers out on sight instead of counting anything. The TASK carries it instead: on Day 3 the extras stop being bait and become the question, on a page whose cards all run 1 to 9 and every one of which some draw makes true.',
      reteachPointer: 'guidedExamples/A10-GE-01 (find the packed frame first - that is the first mark)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'writes-what-the-apparatus-holds',
      description:
        'Labels any part-filled pair of frames twenty, because twenty is what the drawing is built to hold. The apparatus gets recorded where its contents belong, and the tidier the frames look the likelier it is.',
      exampleWrongAnswer: 'the frames holding 16 counters, labelled 20',
      distractorRationale:
        'The capacity is dealt as an ordinary card wherever a frame is drawn, and calling it a lure would be untrue: a tenth of every frame slot\'s draws really do pack both frames, so a child who reaches for it by habit is right about as often as one who guesses, and a child who learns to ignore it loses at the same rate.',
      reteachPointer: 'explanation/script[0] (a packed frame is the ten - count what is beside it)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-count-before-the-marks',
      description:
        'Reads a heap or a row correctly and then puts down a total that is a step or two out, because it slipped on the way from the last object to the paper. Nobody eyeballs a collection past ten, so the slip cannot be caught by looking at it again - only by counting it again.',
      exampleWrongAnswer: '18 buttons tipped out of an apron, labelled 17',
      distractorRationale:
        'One and two either side of the truth, all four drawn from 11-20 so each is a numeral the same slot really keys. The pairing rotates rather than sitting on one side, so the truth lands lowest, middle and highest in turn and no rank can be tapped without counting.',
      reteachPointer: 'Day-4 pages: make the ten first, then count on out loud to the end',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'counts-on-without-making-a-ten',
      description:
        'Counts a loose pile straight through from one and writes whatever number the count lands on, with no ten made anywhere. Often the number is right; what is missing is the structure the two marks are supposed to record, and it shows up the moment the child is asked what their first mark stands for.',
      exampleWrongAnswer: 'counts a jumble of 15 shells one by one, then cannot say what the 1 counts',
      distractorRationale:
        'It produces no wrong numeral of its own, so no card can carry it and none pretends to. It is met by the TASK: the loose pages ask for a ten to be made before a mark is written, the puzzle needs three groups counted before one is coloured, and Day 5 asks out loud what the first mark counts.',
      reteachPointer: 'explanation/whyBeforeHow (the ten goes first because we counted it first)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Writing the numbers 11 to 20, where a numeral stops being a single squiggle and becomes a pair of them whose ORDER decides what it says. We met a teen as a packed ten with some extras beside it, and practised putting the ten down first and the extras after it. We spent time on the one thing that makes teens hard: the word says the parts backwards, so thirteen sounds like three-and-ten while it is written ten-then-three. We also met three stacks and one loose block, so we could see what 31 actually means, and matched teen numerals to groups by counting rather than by guessing.',
    improvingCandidates: [
      'putting the ten mark down before the extras mark',
      'making a ten out of a loose pile before writing anything',
      'telling 13 from 31 by looking at what came first',
      'saying what each of the two marks stands for',
      'counting past ten without losing the place',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'writing the ten before the extras, even though the word says them the other way round',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping the packed ten in the number rather than writing only what is left over',
      },
      {
        errorTag: 'procedure-slip',
        text: 'carrying the total from the last object across to the paper without it slipping',
      },
      {
        errorTag: 'task-comprehension',
        text: 'making the ten first, so the marks have something to record',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted right past ten, and you checked which part came first before you put your marks down.',
      questionForChild: 'Show me ten fingers and some more. Which part gets written first?',
      schoolSyncHook: 'Let us know the wording their class uses for teen numbers, and the pages will follow it.',
    },
    vocabularyForParent: [
      'teen number (11 to 19 - a full ten with a few ones written after it)',
      'digit (one written mark; a teen number needs two of them)',
      'place (which slot a digit sits in - the first slot counts tens)',
      'reversal (writing 31 for thirteen - the parts in the order the word says them)',
    ],
  },
});
