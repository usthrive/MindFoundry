/**
 * Level A · Week 13 — "Partners of 10" (conceptId: partners-of-10).
 *
 * FILL-ARCHITECTURE §3 row A13: anchor "ten-frame hiding"; core form partner of
 * 10; perceptual discrimination "partner-of-5 vs partner-of-10"; puppet
 * error-analysis "uses the 5-partner for 10"; Day-5 "partner-pairs match".
 * Catalog row: compose/decompose 6–10 with ten-frame bonds, and a
 * two-part icon puzzle for ten as the non-computational focus.
 *
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 *
 *  - **A bond is a STRUCTURE, not a fact.** Six and four go together the way
 *    three and two do, and what makes that visible is the frame: a full row and
 *    whatever is missing after it. So every core page here is the same object
 *    read a different way — a frame with a card on it, a frame with gaps in it,
 *    the same frame written as a sentence with a box in it.
 *  - **THE WHOLE HAS TO BE READ OFF THE PICTURE, NOT ASSUMED.** That is the
 *    week's real risk and its real content. A child arriving from A12 has spent
 *    five days learning that the missing part is what gets you to five. Show
 *    that child a frame of ten and the habit answers before the eyes do. So the
 *    discrimination puts the SAME shown count against the small frame and
 *    against the big one, with nothing else changed, and offers the other
 *    frame's partner as a card on every single draw — keyed when the frame is
 *    that frame, and never keyed when it is not. The lure cannot be struck out,
 *    because half the time it is the answer.
 *  - **THE PARTNER OF A PARTNER.** Ten is not just a bigger five. It is a row
 *    plus a row, so a partner of ten is a full row plus a partner of five, and a
 *    child who can see that has the whole of Level B's bridging in embryo. The
 *    puzzle is built on exactly this: colour a row, colour some more, and what
 *    stays plain is a partner of five living inside a partner of ten.
 *  - **No page here is words only.** At this band the picture is not an aid to
 *    the question, it is the question, which is why the profile spends the
 *    multi-step quota on it. Each of Days 1–4 draws its frames out of the values
 *    the item computes with, and no cover anywhere in the week is countable
 *    (disclosure 6).
 *  - **No timers.** `sprint: null`.
 *  - **Twenty-eight per cent of the daily pages face backwards** — five items,
 *    one to a day, each from a different earlier week and a different format:
 *    the parent bond itself (A12), a filled frame read at a glance (A2), the
 *    number one step back along the path (A6), a teen taken apart as a full
 *    frame and a few over (A9), and two rows matched object for object (A5).
 *
 * ── ELEVEN DISCLOSURES ──────────────────────────────────────────────────────
 *
 * 1. **A LIBRARY FRAME ANNOUNCES ITS CAPACITY OUT LOUD, AND OF ALL 24 WEEKS THIS
 *    IS THE ONE WHERE THAT BITES.** `frameName()` in
 *    `lib/earlynumber.ts` renders a ten-frame's accessible name as "a ten-frame"
 *    — deliberately, on the argument that a frame's capacity is a structural
 *    fact a child SEES and a taught vocabulary word. At band A the alt is not a
 *    fallback: `speakablePrompt(prompt, figure.alt)` plays it, and it wins over
 *    the prompt, so it is the first thing a pre-reader receives. A18 recorded
 *    the same finding from the other side and repaired it locally.
 *
 *    Two separate risks, and this file closes both rather than choosing:
 *      · **Every alt in the pack is rebuilt number-free.** Not only the ones
 *        that could key their own number — ALL of them, including the warm-ups
 *        the library builds and including the empty-frame pictures. The frame is
 *        named by SIZE instead of by capacity: "the big frame" and "the small
 *        frame". That keeps the discrimination audible (the frame is the only
 *        thing that changes, so a child listening rather than looking must still
 *        be told which one it is) while saying no number at all. Every alt
 *        string in this file is built by `alt()`, which throws at module load on
 *        a digit or on any word from zero to twenty — plus once, twice, single,
 *        double, pair, dozen and both, which are numbers wearing coats.
 *      · **No slot in this week can key ten.** Proved rather than asserted: each
 *        slot's key set is enumerated from its own draw pool at module load
 *        (disclosure 2), and `TEN_IS_NEVER_KEYED` checks all of them. A partner
 *        of ten is 1–9 by arithmetic; the warm-ups are ranged so the frame-read
 *        tops out at nine and the teen read at nine; the puzzle keys a partner
 *        of five. So even a leaked "ten" could not name an answer.
 *    Barring ten from the slots alone would have left "ten" spoken over pages
 *    where it is a distractor-shaped near miss; quietening the alts alone would
 *    have left the word in the QUESTION of the box sentence, where it is a
 *    stated given and belongs. Both, therefore.
 *
 * 2. **WHICH NUMERALS A SLOT MAY OFFER IS COMPUTED FROM ITS OWN POOL (L38).**
 *    Four of the five weeks before this one shipped a card that no draw could
 *    ever key, past a clean 200-seed sweep, because a card list was declared by
 *    hand and a pool was narrowed later. Nothing here declares a card list. Each
 *    slot exports the SET of values its own answer function returns over its own
 *    cells, computed when the module loads, and `buildChoices` refuses any value
 *    outside it. The sets, for the record:
 *      · the hiding game, the box sentence, the gap page, both stories and the
 *        Day-5 pairing all key 1–9;
 *      · the frame discrimination keys {1,2,3,4,6,7,8,9} — FIVE IS UNREACHABLE
 *        there, because the shown part runs 1–4 and neither `5 − s` nor
 *        `10 − s` can land on five, and an interval-shaped card list would have
 *        offered it on a fifth of that slot's draws and keyed it on none;
 *      · the puppet keys {6,7,8,9};
 *      · the warm-ups key {1,2,3,4} (partners of five), {6,7,8,9} (frame read),
 *        {2,…,9} (the number before) and {1,…,9} (the teen read).
 *
 *    **One numeral in the week is deliberately kept off the tap targets, and
 *    the form itself is what puts it there.** `said = 5 − s` is at most four
 *    while the truth is at least six, so it is never in that slot's key set and
 *    is therefore never a tap target — it is SAID in the prompt and the child
 *    has to produce the answer rather than avoid a card. Nothing is lost by
 *    that: the five-partner slip is a live, keyable card on the discrimination
 *    and on every partner page in the week, which is where a child holding it
 *    meets it as a temptation.
 *
 * 3. **NO REGISTERED TRANSFORM CAN PRODUCE THE PAIR THE RECIPE ASKS FOR, AND THE
 *    ENUMERATION THAT SHOWS IT IS BELOW.** Row A13 names the slip "uses the
 *    5-partner for 10": with `s` showing, the truth is `10 − s` and the puppet
 *    says `5 − s`, a FIXED offset of five. Taken in the kit §E2.3 order:
 *
 *    *First, the identity hunt, which §E2.3 puts ahead of everything else.*
 *    Exactly one registered transform can put a gap of more than a single count
 *    between its two outputs: `d_verify_binop_misconception_v1`, which holds an
 *    operand pair still and swaps the sign between them. Writing the pair as `(x, y)` and enumerating all four
 *    operations against `{10 − s, 5 − s}`:
 *      · `x − y = 10 − s` with `x + y = 5 − s` gives `x = 7.5 − s`, never whole;
 *      · `x + y = 10 − s` with `x − y = 5 − s` gives the same half-integer;
 *      · `x · y = 10 − s` with `x − y = 5 − s` has an integer solution at
 *        exactly one cell, `s = 4` → `(3, 2)`, a pair with no referent in a
 *        frame holding four counters;
 *      · `x · y = 10 − s` with `x + y = 5 − s` and both division forms have no
 *        integer solution at any cell in range.
 *    The band's own transforms are worse, not better: `a_verify_count_slip_v1`
 *    returns `{n, n ± 1}` and `a_verify_countback_slip_v1` returns
 *    `{a − b, a − b + 1}` — an offset of one, which matches the recipe on no
 *    cell at all. So the pair is unreachable. (What IS reachable, and worth
 *    recording because it looks like a near miss: `{a: 5, b: 5 − s, op: '+',
 *    wrongOp: '-'}` computes `{10 − s, s}` exactly — the true partner beside
 *    the part on show. That is A12's headline misconception, not this week's,
 *    and using it would have quietly replaced the recipe's slip with its
 *    parent's while looking fully pinned.)
 *
 *    *So, §E2.3's second option: reframe until the misconception value is
 *    genuinely computed.* It is. `5 − s` is the number of BARE CELLS IN THE TOP
 *    ROW — a region the figure actually draws, counted by the same subtraction
 *    the item is about, applied to the wrong half of the frame. `puppetStopsAtTheRow`
 *    derives it in code from the one drawn `s` (`ROW - shown`), never authors
 *    it, and throws if it is not a whole number in range or if it collides with
 *    the truth. This is C17's move: the shown error is a real output, read off
 *    a real part of the picture.
 *
 *    *What is pinned and what is not, stated plainly.* The item registers
 *    `d_verify_binop_v1` with `{a: 10, b: shown, op: '-'}`, so QG-11 recomputes
 *    the TRUTH from the params and compares it with the card keyed correct —
 *    the D6 class is closed. The slip is pinned by this file instead: one drawn
 *    `shown` writes the figure's counters, the truth and the puppet's number in
 *    a single expression, and a local invariant re-derives the slip as the
 *    frame's own top-row gap and throws on disagreement. A transform returning
 *    `{correct, wrong}` for a fixed offset would pin it in the registry.
 *    **Recorded for the orchestrator: `earlynumber` wants a
 *    `a_verify_row_partner_slip_v1` — `{correct: total − shown, wrong:
 *    row − shown}` — which is a four-line addition and would serve every later
 *    bridging week as well as this one.**
 *
 * 4. **AUTHORED CARDS ARE COMPULSORY AT THIS BAND (L53), AND THEY SWITCH OFF SIX
 *    TEMPLATES' ARITHMETIC AUDIT AS A SIDE EFFECT.** Nobody who cannot read can
 *    use a keyboard, and leaving a numeric band-A page without `choices` hands
 *    it to `tapOptionsFor`, which manufactures buttons at render time out of the
 *    answer alone — with no way of knowing what values that slot's question can
 *    take. So the cards are written here. What that costs is the registry
 *    re-check: QG-5 re-derives an `answerFor` for five numeric validations and
 *    `choice-key` is not one of them, so `a_partner_hidden_v1`,
 *    `a_partner_box_v1`, `a_frame_empty_v1`, `a_frame_read_v1`,
 *    `a_neighbour_v1` and `a_teen_extra_v1` stop being audited the moment the
 *    cards go on. `withCards` replaces that with a second derivation of its own:
 *    the key is worked out again from the item's stored params and compared with
 *    the number the family generator wrote, and any disagreement throws at every
 *    seed at once. Three page types dodge the problem entirely by pinning
 *    `d_verify_binop_v1`, which registers a `verifyFor` and is therefore audited
 *    even as a choice item — the discrimination, the puppet and the Day-5
 *    pairing. **A fifth week now wants the same thing, so it goes up again: the
 *    `earlynumber` partner and frame templates need verify twins.**
 *
 * 5. **DAY 5 PAIRS RATHER THAN ENUMERATES, AND THE REASON IS WHERE THE ANSWER
 *    GETS TYPED.** An answer validated as `'set'` is listed in `needsTypedEntry`
 *    and lands on a text box, which at this band means a keyboard in front of a
 *    child who cannot spell. That routing is still open — a12 raised it — so
 *    nothing here keys a set. It does not have to: §3 gives A13 "partner-pairs
 *    match" rather than "show all the ways", and `pairThatMakesTen` is exactly
 *    that, three numerals beside a run of loose objects. It earns its place
 *    twice over, because it is also the only page in the week with no frame
 *    beneath the bond. What the enumeration was for survives in the Day-5 oral
 *    page, where a child makes a bond of their own and says both of its parts.
 *
 * 6. **ONE CARD ACROSS THE HIDDEN RUN, NEVER ONE LID PER COUNTER.** With the
 *    default `coverStyle` the picture puts a separate lid on each covered cell,
 *    and lids can be counted — which answers the question without anybody
 *    finding a partner. `partnersHiding` and `partnerBox` pass `'single'` on
 *    their own; the discrimination, the Day-4 story, the four guided examples
 *    and all four script segments pass it here, so no page in the week offers a
 *    child something to count instead of reasoning.
 *
 * 7. **NOTHING IS ASSERTED ON THE PUZZLE'S PICTURE, AND THAT IS THE HONEST
 *    CHOICE.** The frame is drawn full, and what the page asks for only comes
 *    into existence once a crayon has been used — so the three quantities a
 *    ten-frame can report (filled, hidden, empty) are all quantities of a
 *    picture taken BEFORE the question is answered. Pointing the assertion at
 *    the ten that IS in the picture would set QG-13 comparing an honest drawing
 *    against a correct answer and calling them a contradiction, which is a worse
 *    outcome than no claim at all. The pairing is safe anyway: a single drawn
 *    `k` becomes both the numeral the prompt says and the `5 − k` the key holds.
 *    **Seconding a12's ask to the orchestrator: the ten-frame has no selector
 *    for cells the child has not yet marked.**
 *
 * 8. **SIX PAGE TYPES ARE BUILT IN THIS FILE, AND EACH ONE NAMES THE FAMILY GAP
 *    IT FILLS.** `frameOrRow`: no `earlynumber` generator varies the CAPACITY
 *    while holding the shown count still, and that variation is the whole of the
 *    recipe's discrimination. `puppetStopsAtTheRow`: `PuppetSlip` is a closed
 *    union — double-count, skip-count, count-back-start, teen-writing — and no
 *    member of it is a partner error. `pairThatMakesTen`: every partner
 *    generator in the family draws a frame, and this page must not.
 *    `deskStory` and `shortStory`: there is no story generator at all, and the
 *    family's word problems join or take away, which this week has not taught.
 *    `buildAndName`: the family's Day-5 oral form sorts and tells, which is a
 *    different act from making a bond. All six are ordinary family items in
 *    every mechanical respect — a resolvable templateId, a picture from
 *    `lib/figures`, quantities through `lib/format`, an `authorMeta` stamp.
 *
 * 9. **SEVEN THINGS THE MEASUREMENTS FOUND, EVERY ONE OF WHICH HAD ALREADY PASSED
 *    A CLEAN 200-SEED SWEEP.**
 *      · **THE DISCRIMINATION WAS BEATABLE BY SIZE ALONE.** With the shown
 *        count fixed at 1–4, a ten-frame page keys 6–9 and a five-frame page
 *        keys 1–4, so "big frame, big card" is a rule that needs no bond. The
 *        first pool made it worse: the other frame's partner is BELOW the key on
 *        every ten-frame draw and ABOVE it on every five-frame draw, so a third
 *        card taken from the same side pinned the key to an extreme. The third
 *        card's side is now drawn per page, which brings the key back through
 *        all three ranks; the size rule still scores, and the number is in the
 *        report rather than in a footnote, because it encodes a real partial
 *        insight (a bigger whole has bigger partners) and it does not certify.
 *      · **THE PUPPET'S NUMBER WAS AN UNKEYABLE CARD.** Offering `5 − s`
 *        beside a truth that is always at least six is the L38 shape
 *        manufactured by the form itself. It is now withheld from the cards and
 *        kept in the prompt (disclosure 2).
 *      · **FOUR CELLS COLLAPSED TO TWO ON THE PUPPET PAGE.** With both the shown
 *        part and the puppet's number in the prompt, the tokens were
 *        `{s, 5 − s}` — and `{1,4}` and `{4,1}` COMMUTE, so `drawUniqueItem`
 *        read two different cells as one surface. The scene bracket now counts
 *        nothing and the puppet's number is the only numeral on the page, which
 *        gives all four cells their own signature. (A12 recorded the identical
 *        failure at the parent concept; it is a property of the form, not of a
 *        careless draw.)
 *      · **THE GUIDED EXAMPLES WERE EATING THE DRAW POOL, AND THAT PRODUCED FIVE
 *        DEAD CARDS ON THE DAY PAGES.** This is the L38 instance nobody has
 *        written down. `makeWeekBuilder` rebuilds any DAY item whose numeric
 *        tokens match a guided example's and does NOT apply that filter to the
 *        mastery forms, so a two-numeral example removes a cell from a day slot
 *        while leaving its mastery twin able to key it. Measured on the first
 *        build: A13-D1-01 offered the numeral two on 89.5% of draws and keyed it
 *        on none, and four more day slots carried a card at 17-41% that they
 *        could never key. Three of the four examples now describe their drawing
 *        instead of counting it — the right band-A form regardless — and the
 *        fourth, which has to print "4 and ▢ make 10", pays for itself with a
 *        split card set (disclosure 2's `BOX_DAY_KEYS`). Every day slot now
 *        offers exactly what it can key.
 *      · **THE TRUTH SAT ON ONE SEAT, TWICE, FROM TWO DIFFERENT CAUSES.** The
 *        first pool carried only `key ± 1` for the miscounts, so a partner of
 *        nine had five honest values below it and none above; the seats that
 *        could not be reached fell back onto whichever seat the fallback order
 *        named. Sending both extremes to the middle put the truth there on
 *        44-46% of certifying slots ("tap the middle one", 5.6% of whole mastery
 *        forms). Sending each extreme to the other put it at the top on 47-49%
 *        ("tap the biggest", 6.5%). Neither was a dealing bug — the pool was
 *        asymmetric — so the pool now carries two cells either side of the truth
 *        and all four rank habits measure 30-39% per slot.
 *      · **THE DISCRIMINATION'S THIRD CARD NAMED ITS OWN FRAME.** Every page
 *        prints the pair {5 − s, 10 − s} whichever frame it drew, so that pair
 *        is ambiguous by construction — but a third card taken only from beside
 *        the TRUTH gave the frame away, and 72.3% of that slot's card sets had
 *        exactly one value that had ever been keyed. Offering the rival
 *        partner miscounted by a cell makes those sets reachable from either
 *        frame: 22.7%.
 *      · **HALF OF ALL PACKS NEVER SHOWED A CHILD BOTH FRAMES.** Four fair coins,
 *        four discrimination pages, and 50.0% of packs put both DAY pages on the
 *        same frame — so on those packs the A12 habit is right twice or wrong
 *        twice and is never actually tested. The frames are dealt per pack now
 *        (see the deal below the key sets): measured over 800 packs, 0.0% put
 *        both day pages or both mastery forms on the same frame, and the small
 *        frame still takes 50.0% of discrimination pages overall.
 *
 * 10. **WHAT ONLY READING THE GENERATED WEEK FOUND.**
 *      · The puppet page first drew a covered frame and asked what "fills the
 *        frame", which is false of a frame that is already full behind a card —
 *        two defensible answers, the §E2.7 class. It now draws bare cells.
 *      · The Day-4 pair both asked for a missing part in the same words. One now
 *        asks what is under a card on a frame the child watched being filled,
 *        and the other asks what is missing from a frame that was never full.
 *      · The gap page and the story both said "empty". The countable page counts
 *        BOXES and the story counts COUNTERS, which is the same number reached
 *        from the two ends of the bond and is worth hearing said both ways.
 *      · The lesson script named the frame's capacity in a stage direction while
 *        the alt beside it did not, so a reader would have seen the two
 *        disagree; the directions now describe the drawing.
 *
 * 11. **THE DEEPENING IS DECLARED, AND BB-G1 REALLY DOES FIRE HERE.**
 *    `conceptFamily('partners-of-10')` strips the trailing magnitude and returns
 *    `partners-of`, which is what `partners-of-5` returns, so `priorSameFamily`
 *    finds A12 and the §6.13 precondition demands a `deepeningDelta`. It is
 *    stated in the blueprint. Worth recording that this is the first band-A week
 *    where the ledger's family key behaves as intended — a17 and a18 both had to
 *    ship a delta the gate could not have asked them for.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  neighbourNumber,
  partnerBox,
  partnersHiding,
  teenExtra,
  tenFrameEmpty,
  tenFrameRead,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswerOf, assertsParam, counters, tenFrame } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** People, taken from this list at draw time. No line below writes one in. */
const FOLK = ['Zaid', 'Perla', 'Emrys', 'Nkiru', 'Sorcha', 'Gunnar', 'Fionn', 'Bertil'] as const;
const someone = (r: Rng): string => r.pick(FOLK);

/** The whole this week takes apart. */
const WHOLE = 10;
/** Half of it, and the reason a ten-frame is not just a long five-frame. */
const ROW = 5;

// ---------------------------------------------------------------------------
// The word limit that actually has a gate behind it
//
// There are two limits and they measure different objects. `earlynumber`'s
// `ask()` caps a prompt taken whole; `bb-readability-test` walks each
// child-facing surface a clause at a time. Only the second one fails a build,
// so this file keeps its own copy of that splitter and pushes every authored
// line through it. A limit enforced when the module loads is enforced. A limit
// a reviewer is supposed to spot is not.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A13: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** The bracket feeds the freshness guard and is never read out; the question is what gets counted. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Help rungs. Each one is measured, and none carries a name, a numeral or a draw. */
function ladder(...rungs: string[]): string[] {
  return rungs.map(say);
}

// ---------------------------------------------------------------------------
// ACCESSIBLE NAMES ARE WRITTEN HERE, AND THEY COUNT NOTHING (disclosure 1)
//
// What reaches a pre-reader first is the picture's accessible name, played out
// loud ahead of the question. So a number inside one arrives before the child
// has been asked anything at all: the answer on some draws, a strong steer on
// the rest. `alt()` refuses digits, refuses every word from zero to twenty, and
// refuses the handful of words that count without looking numeric.
//
// Frames are described by how big they LOOK rather than by how much they hold.
// A child working from the audio can still do the week's discrimination, since
// the two pages differ in exactly the thing the name carries — and "the big
// frame" carries it while giving away nothing.
// ---------------------------------------------------------------------------

const NUMBER_WORD =
  /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|once|twice|single|double|pair|dozen|both)\b/i;

function alt(text: string): string {
  if (/\d/.test(text)) {
    throw new Error(`A13 alt: a digit is spoken before the question in "${text}"`);
  }
  const hit = NUMBER_WORD.exec(text);
  if (hit) {
    throw new Error(`A13 alt: the number word "${hit[0]}" is spoken before the question in "${text}"`);
  }
  return text;
}

const BIG_COVERED = alt('the big frame, part of it hidden beneath a card');
const BIG_GAPPY = alt('the big frame, part filled with counters and part left bare');
const BIG_FULL = alt('the big frame with a counter in every cell');
const BIG_EMPTY = alt('the big frame with nothing in it yet');
const SMALL_COVERED = alt('the small frame, part of it hidden beneath a card');
const TEEN_ALT = alt('a filled frame beside a frame holding a short run of counters');
const looseAlt = (noun: string): string => alt(`some ${noun} laid out in a line`);

/**
 * Overwrite a shared generator's accessible name from outside `lib/`.
 *
 * One field moves and nothing else does. Since QG-13 audits the assertion
 * against the params, and both survive untouched, the picture goes on proving
 * precisely what it proved before.
 */
function withPlainAlt(base: ItemGen, spoken: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.figure) {
      throw new Error('A13 withPlainAlt: this page draws nothing, so it has no alt to quieten');
    }
    return { ...draft, figure: { ...draft.figure, alt: alt(spoken) } };
  };
}

/** Fit a shared generator with help written for this concept, without editing it. */
function withLadder(base: ItemGen, rungs: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: rungs });
}

/** Stamp a generator with the week it came from, so the day opens by looking back. */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// KEY SETS, COMPUTED FROM THE POOLS (disclosure 2)
// ===========================================================================

/**
 * A slot may offer a numeral only if some draw of that slot can key it.
 *
 * Declaring a card list by hand is how four weeks in a row shipped a permanently
 * dead option past a clean seed sweep: the pool moves and the list does not.
 * These sets are the IMAGE of each slot's own answer function over its own
 * cells, built when the module loads, so they cannot drift from what the slot
 * actually does.
 */
function keysOver<T>(cells: readonly T[], keyOf: (cell: T) => number): ReadonlySet<number> {
  return new Set(cells.map(keyOf));
}

const SHOWN_CELLS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
/** Every page whose whole is ten and whose shown part runs the full range. */
const PARTNER_KEYS = keysOver(SHOWN_CELLS, (s) => WHOLE - s);

/** The discrimination: the same shown count against each capacity. */
const FRAME_CELLS: ReadonlyArray<{ cap: 5 | 10; shown: number }> = [1, 2, 3, 4].flatMap((shown) => [
  { cap: 5 as const, shown },
  { cap: 10 as const, shown },
]);
const FRAME_KEYS = keysOver(FRAME_CELLS, (c) => c.cap - c.shown);

/** The puppet only has a slip while the top row is not yet full. */
const PUPPET_CELLS = [1, 2, 3, 4] as const;
const PUPPET_KEYS = keysOver(PUPPET_CELLS, (s) => WHOLE - s);

/**
 * THE ASSEMBLER'S GUIDED-EXAMPLE FILTER PUNCHES A HOLE IN A DAY SLOT'S KEY SET,
 * AND IT IS AN L38 DEFECT NOBODY HAS REPORTED BEFORE (disclosure 9).
 *
 * `makeWeekBuilder` rebuilds any DAY item whose prompt's numeric tokens match a
 * guided example's, and it does not apply that filter to the mastery forms. So a
 * two-numeral example silently removes one cell from every day slot that shares
 * its token list, while leaving the same slot's mastery twin able to key it —
 * and the cards, computed from the full pool, then carry a numeral that day slot
 * can never key. Measured on the first build: five day slots offered a numeral
 * on 17-41% of draws and keyed it on none, past a clean 200-seed sweep.
 *
 * Three of this week's four examples now describe the DRAWING instead of
 * counting it, which is the right band-A form anyway (the picture carries the
 * count; the bracket says what is on the screen) and leaves their token lists
 * empty, so they block nothing. The fourth cannot: A13-GE-02 IS the algebra
 * sentence, and "4 and ▢ make 10" has to print its numerals. That example
 * therefore costs the box-sentence DAY pages the one cell it prints, and the two
 * uses of that generator are split so each offers exactly what it can key —
 * the day pages from the narrowed set, the mastery pages from the full one.
 */
const GE_BOX_SHOWN = 4;
const BOX_DAY_KEYS = keysOver(
  SHOWN_CELLS.filter((s) => s !== GE_BOX_SHOWN),
  (s) => WHOLE - s,
);

/** The warm-ups, each keyed over the range this week hands it. */
const SMALL_PARTNER_KEYS = keysOver([1, 2, 3, 4], (s) => ROW - s);
const FRAME_READ_KEYS = keysOver([6, 7, 8, 9], (n) => n);
const BEFORE_KEYS = keysOver([3, 4, 5, 6, 7, 8, 9, 10], (n) => n - 1);
const TEEN_KEYS = keysOver([11, 12, 13, 14, 15, 16, 17, 18, 19], (n) => n - WHOLE);

/**
 * The claim of disclosure 1's second half, checked rather than asserted: with
 * "ten" spoken over some pictures as a taught vocabulary word, no slot in the
 * week may be able to key it.
 */
const TEN_IS_NEVER_KEYED = [
  PARTNER_KEYS,
  BOX_DAY_KEYS,
  FRAME_KEYS,
  PUPPET_KEYS,
  SMALL_PARTNER_KEYS,
  FRAME_READ_KEYS,
  BEFORE_KEYS,
  TEEN_KEYS,
].every((set) => !set.has(WHOLE));
if (!TEN_IS_NEVER_KEYED) {
  throw new Error('A13: a slot can key the whole, so naming the frame would hand the answer over');
}

// ===========================================================================
// THE CARD DEALER
// ===========================================================================

// ===========================================================================
// THE FRAME IS SHARED OUT ACROSS THE PACK BEFORE ANY PAGE IS BUILT
// ===========================================================================

/**
 * A CONTRAST THAT IS TOSSED FOR RATHER THAN ARRANGED IS ABSENT FROM HALF THE
 * PACKS THAT SHIP.
 *
 * Four pages in this week ask the discrimination — Day 2, Day 3, and one slot in
 * each mastery form. Toss for the frame on each of them and one pack in two
 * gives a child two identical day pages: both big, or both small. On such a pack
 * the habit A12 installed is either correct twice running or mistaken twice
 * running, and either way nothing is discovered about whether the child looked.
 * The marginal over many packs is a flat 50/50 and says none of this; it is L52,
 * and the way it gets caught is by reading one pack end to end.
 *
 * The frames are therefore handed out in advance, through the `TupleGuard` that
 * every generator in a pack already shares, as two independent pairs. The day
 * pages split one frame each and a single coin says which day gets the small
 * one. The two mastery forms split one each the same way. The result is that
 * every pack, without exception, shows a child both frames in the working days
 * and both frames across the two forms.
 *
 * READING THE DEAL MUST NOT SPEND IT. Pages get rebuilt — `drawUniqueItem`
 * rebuilds on a surface clash, and the assembler rebuilds on a guided-example
 * echo or a Form-A core repeat — so a counter that ticks on every CALL would
 * quietly pass the next page a frame that belonged to somebody else. Neither
 * reader below ticks. The day reader is a function of the day number and the one
 * coin already stored in the guard; the mastery reader remembers its answer
 * against the form's rng object, which the assembler passes back untouched when
 * it rebuilds.
 */
type FrameSide = 'small' | 'big';

/** Which daily page gets the small frame — drawn once, then read back. */
function dailySmallDay(rng: Rng, guard: TupleGuard): 2 | 3 {
  if (guard.taken('a13:small-frame-day=2')) return 2;
  if (guard.taken('a13:small-frame-day=3')) return 3;
  const day: 2 | 3 = rng.chance(0.5) ? 2 : 3;
  guard.add(`a13:small-frame-day=${String(day)}`);
  return day;
}

const dailyFrame = (day: 2 | 3) => (rng: Rng, guard: TupleGuard): FrameSide =>
  dailySmallDay(rng, guard) === day ? 'small' : 'big';

const MASTERY_FRAME = new WeakMap<Rng, FrameSide>();

function masteryFrame(rng: Rng, guard: TupleGuard): FrameSide {
  const already = MASTERY_FRAME.get(rng);
  if (already) return already;
  let side: FrameSide;
  if (guard.taken('a13:mastery-frame-first=small')) side = 'big';
  else if (guard.taken('a13:mastery-frame-first=big')) side = 'small';
  else {
    side = rng.chance(0.5) ? 'small' : 'big';
    guard.add(`a13:mastery-frame-first=${side}`);
  }
  MASTERY_FRAME.set(rng, side);
  return side;
}

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/** Where the truth should sit among the three numerals on the page. */
type Seat = 'low' | 'mid' | 'high';

const SEATS = ['low', 'mid', 'high'] as const;

/**
 * Two honest cards, chosen so the truth lands at the requested seat.
 *
 * The rotation is per DRAW, not per slot: hashing a seat off an item id freezes
 * the rank inside a slot while spreading it across slots, which reads balanced
 * in aggregate and is a complete tell on the corrective pass. Where a seat
 * cannot be reached — a truth of nine has nothing above it in a nine-value key
 * set — the fallback order is fixed rather than redrawn, because a redraw loop
 * consumes a variable number of rng steps and makes every later page in the
 * pack depend on this one (kit §E2.4).
 */
function dealTwo(r: Rng, pool: readonly number[], key: number, want: Seat): [number, number] {
  const below = pool.filter((v) => v < key);
  const above = pool.filter((v) => v > key);
  // WHERE THE FALLBACK GOES IS WORTH MORE THAN THE REQUEST, and both directions
  // were measured. A pool that runs out on one side sends every unreachable
  // request somewhere, and whichever seat receives them wins: sending both
  // extremes to the middle put the truth there on 44-46% of the certifying slots
  // ("tap the middle one", 5.6% of whole forms), and sending each extreme to the
  // other put it at the top on 47-49% ("tap the biggest", 6.5%). Neither was a
  // dealing problem. It was a POOL problem — a partner of ten with two counters
  // showing has one honest value above it and five below — so the repair is a
  // symmetric pool (`partnerPool` carries two cells either side of the truth)
  // and the gentle fallback order, which then measures flat.
  const orders: Record<Seat, ReadonlyArray<readonly [number, number]>> = {
    low: [[0, 2], [1, 1], [2, 0]],
    mid: [[1, 1], [0, 2], [2, 0]],
    high: [[2, 0], [1, 1], [0, 2]],
  };
  for (const [nb, na] of orders[want]) {
    if (below.length >= nb && above.length >= na) {
      const picked = [...r.shuffle(below).slice(0, nb), ...r.shuffle(above).slice(0, na)];
      return [picked[0], picked[1]];
    }
  }
  throw new Error(`A13 dealTwo: fewer than two honest cards sit beside a truth of ${String(key)}`);
}

/** Distinct, keyable, not the truth — the only values a page may print. */
function livePool(pool: readonly number[], key: number, keySet: ReadonlySet<number>): number[] {
  return [...new Set(pool)].filter((v) => v !== key && keySet.has(v));
}

function threeCards(
  r: Rng,
  key: number,
  pool: readonly number[],
  keySet: ReadonlySet<number>,
  why: (v: number) => Card,
): { choices: ReturnType<typeof makeChoices>['choices']; correctKey: string } {
  const [x, y] = dealTwo(r, livePool(pool, key, keySet), key, r.pick(SEATS));
  return makeChoices(r, String(key), [why(x), why(y)]);
}

/**
 * Authored cards on a family generator, plus the arithmetic re-check the
 * `choice-key` switch takes away (disclosure 4).
 *
 * Working the key out a second time from the stored params, and refusing to
 * build the page if that disagrees with the number the shared generator wrote,
 * turns any drift between library and week into a throw at every seed instead of
 * one page nobody notices.
 */
function withCards(
  base: ItemGen,
  reKey: (params: Record<string, unknown>) => number,
  poolOf: (key: number, params: Record<string, unknown>) => number[],
  /**
   * `keys` is everything the generator can produce; `cards` is what THIS USE of
   * it may print. They differ on exactly one page type, and the reason is the
   * assembler's guided-example filter rather than anything about the concept.
   */
  sets: { keys: ReadonlySet<number>; cards: ReadonlySet<number> },
  why: (v: number, key: number, params: Record<string, unknown>) => Card,
  tags: ErrorTag[],
): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) {
      throw new Error('A13 withCards: this page carries no generator params to re-derive its key from');
    }
    const key = reKey(params);
    if (String(key) !== draft.answer.value) {
      throw new Error(
        `A13 withCards: ${draft.generator?.templateId ?? 'an item'} keyed "${draft.answer.value}", but this week recomputes ${String(key)}`,
      );
    }
    if (!sets.keys.has(key)) {
      throw new Error(`A13 withCards: a key of ${String(key)} is outside the slot's own key set`);
    }
    const { choices, correctKey } = threeCards(rng, key, poolOf(key, params), sets.cards, (v) => why(v, key, params));
    const carded: ItemDraft = {
      ...draft,
      choices,
      answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
      errorTags: tags,
    };
    return carded;
  };
}

// ===========================================================================
// THE MISTAKES THIS WEEK CAN NAME, AS CARDS
// ===========================================================================

/**
 * Every numeral offered anywhere in the core is one of these, and each is a
 * thing a four-year-old really says over a ten-frame.
 *
 * `rowPartner` is the week's own headline error and the reason the
 * discrimination exists; `onShow` is the parent week's, still alive one size up;
 * `spareRow` is what a child gives who has seen that a whole row is missing and
 * forgotten the gaps above it; the two `whisper` values are the count running on
 * a cell too far or stopping a cell short.
 */
const CARD_VOICE = {
  rowPartner: 'The partner of a ROW, given as the partner of the frame - the habit that came from the smaller frame.',
  onShow: 'The part that can be counted, handed back as the part that cannot - no bond was made anywhere on this page.',
  bottomRow: 'The counters sitting below the full row, read as though they were the gap.',
  spareRow: 'The empty row alone. A whole row is missing, but so are the cells above it.',
  ranOn: 'A cell too far. The count began on a cell that was already accounted for.',
  stoppedShort: 'A cell short. The counting gave up while the frame still had room.',
  ranOnFar: 'Two cells too far. Counting on started back among the counters instead of after them.',
  stoppedFar: 'Two cells short. The count reached the end of a row and treated it as the end of the frame.',
} as const;

/** A miscount by one reads differently from a miscount by two, so it says so. */
function slipCard(v: number, key: number, tag: ErrorTag = 'procedure-slip'): Card {
  const far = Math.abs(v - key) > 1;
  return {
    text: String(v),
    errorTag: tag,
    rationale: v > key ? (far ? CARD_VOICE.ranOnFar : CARD_VOICE.ranOn) : far ? CARD_VOICE.stoppedFar : CARD_VOICE.stoppedShort,
  };
}

/** The card voice for any page whose truth is a partner of the big frame. */
function partnerWhy(v: number, key: number, shown: number): Card {
  if (v === shown) return { text: String(v), errorTag: 'concept-misconception', rationale: CARD_VOICE.onShow };
  if (v === ROW - shown) return { text: String(v), errorTag: 'concept-misconception', rationale: CARD_VOICE.rowPartner };
  if (v === shown - ROW) return { text: String(v), errorTag: 'representation-misread', rationale: CARD_VOICE.bottomRow };
  if (v === ROW) return { text: String(v), errorTag: 'representation-misread', rationale: CARD_VOICE.spareRow };
  return slipCard(v, key);
}

/**
 * Everything honest that can be offered beside a partner of the big frame.
 *
 * TWO CELLS EITHER SIDE, NOT ONE, and that is what keeps the truth off a fixed
 * seat. With only `key ± 1` for the miscounts, a partner of nine had four honest
 * values below it and none above, so half the pool could not reach the seat it
 * was dealt and the fallbacks piled onto one rank. Counting on from a cell
 * inside the counters rather than after them is a two-cell slip and a real one,
 * so the pool is symmetric wherever the key set allows it.
 */
function partnerPool(key: number, shown: number): number[] {
  const pool = [shown, ROW - shown, shown - ROW, key - 1, key + 1, key - 2, key + 2];
  // The empty row on its own is only a thing to see while the counters have not
  // yet reached the second row.
  if (shown < ROW) pool.push(ROW);
  return pool;
}

const PARTNER_TAGS: ErrorTag[] = ['concept-misconception', 'procedure-slip', 'representation-misread'];

// ===========================================================================
// Shared generators, tied to a whole of ten and re-voiced for this concept
// ===========================================================================

/**
 * The draw pool is nine wide and the week takes fourteen pages out of it, but
 * never fourteen out of one pool.
 *
 * `drawUniqueItem` signs a page on its format class together with the numerals
 * its prompt prints, and the partner forms here sign into four separate spaces:
 * the hiding game and the gap page share one, since both print a capacity and a
 * count; the box sentence has its own, because it prints four numerals; the two
 * stories have theirs, being a different format class; and the pairing page
 * prints one numeral only. So no slot ever inherits what an earlier slot left.
 */
const shownOf = (p: Record<string, unknown>): number => Number(p.shown);
const partnerKey = (p: Record<string, unknown>): number => Number(p.total) - Number(p.shown);

const hidingGame = withCards(
  withPlainAlt(
    withLadder(
      partnersHiding({ total: WHOLE }),
      ladder('The frame was full before the card came.', 'Count what shows. Then keep going to the end.'),
    ),
    BIG_COVERED,
  ),
  partnerKey,
  (key, p) => partnerPool(key, shownOf(p)),
  { keys: PARTNER_KEYS, cards: PARTNER_KEYS },
  (v, key, p) => partnerWhy(v, key, shownOf(p)),
  PARTNER_TAGS,
);

const hidingAgain = withCards(
  withPlainAlt(
    withLadder(
      partnersHiding({ total: WHOLE }),
      ladder('Fill the top row in your head first.', 'How much of the second row is still needed?'),
    ),
    BIG_COVERED,
  ),
  partnerKey,
  (key, p) => partnerPool(key, shownOf(p)),
  { keys: PARTNER_KEYS, cards: PARTNER_KEYS },
  (v, key, p) => partnerWhy(v, key, shownOf(p)),
  PARTNER_TAGS,
);

/**
 * The bond written down, with an empty box standing where the unseen number goes.
 *
 * One generator, built three times, and the third build exists for one reason:
 * A13-GE-02 has to print its own numerals, which costs the DAY pages one cell.
 * So the day builds deal from the values a day page can reach and the mastery
 * build — which the assembler's guided-example filter never touches — deals from
 * all nine.
 */
function boxPage(rungs: string[], cards: ReadonlySet<number>): ItemGen {
  return withCards(
    withPlainAlt(withLadder(partnerBox({ total: WHOLE }), rungs), BIG_COVERED),
    partnerKey,
    (key, p) => partnerPool(key, shownOf(p)),
    { keys: PARTNER_KEYS, cards },
    (v, key, p) => partnerWhy(v, key, shownOf(p)),
    PARTNER_TAGS,
  );
}

const boxSentence = boxPage(
  ladder('The box stands for the part nobody can see.', 'Whatever goes in it must finish the frame.'),
  BOX_DAY_KEYS,
);
const boxAgain = boxPage(
  ladder('Read the sentence slowly, right to the end.', 'The first number is given. The box is not.'),
  BOX_DAY_KEYS,
);
const boxMastery = boxPage(
  ladder('The box stands for the part nobody can see.', 'Whatever goes in it must finish the frame.'),
  PARTNER_KEYS,
);

/**
 * Monday's page, and the last one on which the missing part can simply be
 * counted. From Tuesday the same gaps are under a card and have to be reasoned
 * about instead.
 */
const gapsOpen = withCards(
  withPlainAlt(
    withLadder(
      tenFrameEmpty({ min: 1, max: WHOLE - 1, size: WHOLE }),
      ladder('Put a finger on each box with nothing in it.', 'Count only the fingers you used.'),
    ),
    BIG_GAPPY,
  ),
  (p) => Number(p.cap) - Number(p.filled),
  (key, p) => partnerPool(key, Number(p.filled)),
  { keys: PARTNER_KEYS, cards: PARTNER_KEYS },
  (v, key, p) => partnerWhy(v, key, Number(p.filled)),
  PARTNER_TAGS,
);

// ===========================================================================
// Local generator 1 — the frame decides the partner (the recipe's discrimination)
// ===========================================================================

/**
 * ONE shown count, TWO frames, and nothing else on the page changes.
 *
 * This is the week's whole risk in one slot. A child fresh from partners of five
 * answers `5 − s` on sight, and that answer is CORRECT on half of these pages
 * and wrong on the other half — so the lure cannot be eliminated, and the only
 * way through is to look at the frame before answering. Both frames are drawn
 * from the same shown count, both wear one card, and the alt names the frame by
 * size so a child listening rather than looking is still told which it is.
 *
 * WHY THE RIVAL PARTNER IS ON EVERY SINGLE PAGE. Put it only on the big-frame
 * pages and it becomes a numeral that is never once correct, which a child
 * learns to strike out for free. Put it on both and it is right precisely when
 * the frame is the one it belongs to. That difference is what separates a
 * discrimination from a subtraction with a decoy parked beside it.
 *
 * WHAT THIS SLOT CANNOT SHAKE, AND IT IS REPORTED RATHER THAN HIDDEN. With the
 * shown part held to 1–4 so that both frames can hold it, a big-frame page keys
 * six to nine and a small-frame page keys one to four, so "big frame, big
 * number" scores without a bond being made. It cannot be designed away without
 * giving up the one-thing-changes property the recipe asks for, and it is not
 * nothing pedagogically — a bigger whole really does have bigger partners. The
 * card that is NOT forced has its side drawn per page so the truth still moves
 * through all three seats, and the measured rate is in the report.
 */
function frameOrRow(side: (rng: Rng, guard: TupleGuard) => FrameSide): ItemGen {
  return (rng, guard, difficulty) => {
    // Read here, once, outside the rebuild loop - a page built twice has to come
    // back holding the frame it held the first time.
    const cap: 5 | 10 = side(rng, guard) === 'small' ? ROW : WHOLE;
    return drawUniqueItem(rng, guard, (r) => {
      const shown = r.int(1, ROW - 1);
      const key = cap - shown;
      const otherFrame = (cap === WHOLE ? ROW : WHOLE) - shown;
      const forced: Card = {
        text: String(otherFrame),
        errorTag: 'concept-misconception',
        rationale:
          cap === WHOLE
            ? 'The partner the smaller frame would have wanted, used on a frame that holds more.'
            : 'The partner the bigger frame would have wanted, used on a frame that holds less.',
      };
      // The second card's side is DRAWN, so the truth is not pinned to an
      // extreme by the forced card always sitting on one side of it.
      //
      // AND IT IS DRAWN FROM BOTH NEIGHBOURHOODS, which is what stops the three
      // numerals naming their own answer. Every page here prints the pair
      // {5 − s, 10 − s} whichever frame it drew, so the pair alone is ambiguous
      // and the third card is the whole tell: taken only from beside the TRUTH
      // it says which frame this was, and 72.3% of this slot's card sets then
      // had exactly one value that had ever been keyed. Offering the other
      // frame's partner miscounted by a cell — both named mistakes at once, and
      // a thing a child really does — makes those sets reachable from either
      // frame.
      const spare = livePool(
        [shown, key - 1, key + 1, key - 2, key + 2, otherFrame - 1, otherFrame + 1],
        key,
        FRAME_KEYS,
      ).filter((v) => v !== otherFrame);
      const wantAbove = r.chance(0.5);
      const side = spare.filter((v) => (wantAbove ? v > key : v < key));
      const bank = side.length > 0 ? side : spare;
      const second = r.pick(bank);
      const secondCard: Card =
        second === shown
          ? { text: String(second), errorTag: 'representation-misread', rationale: CARD_VOICE.onShow }
          : Math.abs(second - otherFrame) === 1
            ? {
              text: String(second),
              errorTag: 'concept-misconception',
              rationale: 'The other frame\'s partner, and a cell out on top of it - both mistakes on one page.',
            }
            : slipCard(second, key);
      const { choices, correctKey } = makeChoices(r, String(key), [forced, secondCard]);
      const scene = `a frame of ${String(cap)} with ${countNoun(shown, 'counters')} showing and a card on the rest`;
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(scene, 'How many counters are under the card?'),
        figure: tenFrame(shown, {
          size: cap,
          hidden: key,
          coverStyle: 'single',
          alt: cap === WHOLE ? BIG_COVERED : SMALL_COVERED,
          asserts: assertsAnswerOf('hidden'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: cap, b: shown, op: '-', asks: 'frame' },
          seed: r.uint(),
        },
        hintLadder: ladder('Look at the frame before you look at the counters.', 'How many cells does this frame hold?'),
        errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'partner-for-this-frame', isDiscrimination: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 2 — the puppet who fills a row and calls the frame done
// ===========================================================================

/**
 * The band's error-analysis form: a puppet with a name, a slip, and a child who
 * has to say what the right number is.
 *
 * What this puppet does is count the empty cells in the first row and stop.
 *
 * His number is `ROW − shown`, which is not invented: it is the top row's own
 * gap, a region the figure draws, counted by the same subtraction the item asks
 * for and applied to half the frame. The truth is `WHOLE − shown` and QG-11
 * recomputes it from `{a, b, op}` and pins it to the card keyed correct. Both
 * numbers come out of one drawn `shown`, so they cannot come apart, and the
 * invariant below refuses any cell where the slip is not a real countable gap.
 * Nowhere on the page does the word "wrong" appear; the band's opening is
 * "Oh no!" and the child is asked for the number rather than for a judgement
 * (disclosure 3).
 *
 * HIS NUMBER IS NOT A TAP TARGET, and that is arithmetic rather than mercy. The
 * truth here is always at least six and his number is at most four, so offering
 * it would print a numeral this slot can never key — the L38 shape, made by the
 * form itself. It stays in the prompt, where a child has to reject it rather
 * than avoid it, and the same slip is a live keyable card on every other partner
 * page in the week.
 */
function puppetStopsAtTheRow(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const shown = r.pick(PUPPET_CELLS);
      const key = WHOLE - shown;
      const said = ROW - shown;
      if (said < 1 || said >= key) {
        throw new Error(`A13 puppet: a top-row gap of ${String(said)} is not a slip beside a truth of ${String(key)}`);
      }
      const puppet = r.pick(PUPPETS);
      const { choices, correctKey } = threeCards(r, key, [key - 1, key + 1, key - 2, key + 2], PUPPET_KEYS, (v) =>
        slipCard(v, key),
      );
      const draft: ItemDraft = {
        type: 'error-analysis',
        // ONE NUMERAL ON THE PAGE, and it is a freshness fix rather than a style
        // one: with the shown part in the bracket too, `{1,4}` and `{4,1}`
        // commute and two cells read as one surface (disclosure 9).
        prompt: scenePrompt(
          'a big frame part filled, with bare cells after the counters',
          `Oh no! ${puppet} counted the top row only and says ${String(said)}. Tap the number that fills the whole frame.`,
        ),
        figure: tenFrame(shown, { size: WHOLE, alt: BIG_GAPPY, asserts: assertsAnswerOf('empty') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: WHOLE, b: shown, op: '-', asks: 'puppet' },
          seed: r.uint(),
        },
        hintLadder: ladder('Two rows have to be filled, not just the top.', 'Count the bare cells right along both rows.'),
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-stopped-at-the-row', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — Day 5, where the bond has no frame under it
// ===========================================================================

/**
 * Loose objects and three numerals: which one goes with these to make ten?
 *
 * §3's Day-5 for this cell is "partner-pairs match" and the catalog's
 * non-computational focus is a two-part icon puzzle for ten. Both want the bond
 * without the scaffold, so this is the only page in the week with no frame on
 * it: nothing is arranged in rows, nothing has a capacity, and the whole is
 * carried by the question. `d_verify_binop_v1` recomputes the partner from the
 * drawn count, so the picture and the key cannot disagree.
 */
function pairThatMakesTen(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const shown = r.pick(SHOWN_CELLS);
      const key = WHOLE - shown;
      const noun = r.pick(COUNTABLE_NOUNS);
      const { choices, correctKey } = threeCards(r, key, partnerPool(key, shown), PARTNER_KEYS, (v) =>
        partnerWhy(v, key, shown),
      );
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(
          `${countNoun(shown, noun)} in a line`,
          'Tap the number that makes ten with these.',
        ),
        figure: counters(shown, noun, { arrangement: 'in a row', alt: looseAlt(noun), asserts: assertsParam('b') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: WHOLE, b: shown, op: '-', asks: 'pair' },
          seed: r.uint(),
        },
        hintLadder: ladder('Picture these dropped into a frame.', 'Which cells would still have nothing in them?'),
        errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'pair-to-ten' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generators 4 and 5 — Day 4, the same move inside somebody's afternoon
// ===========================================================================

/**
 * A word problem at four years old is one thing happening in a picture, which is
 * why the profile switches the two-step row off rather than shrinking it. There
 * is no story generator in `earlynumber`, so these two are built here; both draw
 * the frame at its real size, because a drawing can only be honest about what is
 * actually in it. All the story adds is somebody it is happening to.
 *
 * The two differ in where the whole comes from. In `deskStory` the child hears
 * the frame being filled, so ten arrives as something told before the card lands
 * and the hidden part is said nowhere. `shortStory` states nothing at all: the
 * frame was never full, and what the child works from is the gap they can see.
 */
function deskStory(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const shown = r.pick(SHOWN_CELLS);
      const key = WHOLE - shown;
      const name = someone(r);
      const scene = `a frame of ${String(WHOLE)} with ${countNoun(shown, 'counters')} showing and a card across it`;
      const { choices, correctKey } = threeCards(r, key, partnerPool(key, shown), PARTNER_KEYS, (v) =>
        partnerWhy(v, key, shown),
      );
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(scene, `${name} filled every cell. Now a card covers some. How many are under it?`),
        figure: tenFrame(shown, {
          size: WHOLE,
          hidden: key,
          coverStyle: 'single',
          alt: BIG_COVERED,
          asserts: assertsAnswerOf('hidden'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_partner_hidden_v1', params: { total: WHOLE, shown }, seed: r.uint() },
        hintLadder: ladder('Nothing was taken away. Something was laid on top.', 'Count what is left in sight, then carry on.'),
        errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'partner-under-a-card', situationType: 'part-whole' },
      };
      return draft;
    });
}

function shortStory(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const filled = r.pick(SHOWN_CELLS);
      const key = WHOLE - filled;
      const name = someone(r);
      const scene = `a frame of ${String(WHOLE)} with ${countNoun(filled, 'counters')} and bare cells after them`;
      const { choices, correctKey } = threeCards(r, key, partnerPool(key, filled), PARTNER_KEYS, (v) =>
        partnerWhy(v, key, filled),
      );
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(scene, `${name} needs every cell filled. How many counters are missing?`),
        figure: tenFrame(filled, { size: WHOLE, alt: BIG_GAPPY, asserts: assertsAnswerOf('empty') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_empty_v1', params: { filled, cap: WHOLE }, seed: r.uint() },
        hintLadder: ladder('Finish the row that is already started.', 'Then say how much of the other row is left.'),
        errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'counters-still-needed', situationType: 'part-whole' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — Day-5 oral: build a bond and name both of its parts
// ===========================================================================

/**
 * Day 5's open half: no key, no registered template, and both absences are the
 * design.
 *
 * The child picks the split, and a split nobody has made yet cannot be
 * recomputed by anything. Hanging a template on it would produce a number that
 * looks audited and is not, which is the one move the kit rules out flatly. The
 * frame gets drawn regardless, bare, and the audio describes a bare one. This is
 * also where §6.12's justification demand is met: it has to be a page whose
 * answer is spoken, and `pairThatMakesTen` cannot serve, because its answer is
 * computable on purpose.
 */
function buildAndName(): ItemGen {
  return (rng, guard, difficulty) =>
    // Nothing is drawn from the stream here - with no numeral in the prompt
    // there is no surface for the guard to sign. The wrapper stays anyway, so
    // the page keeps the shape every other page has and a later numbered
    // version of it would need no plumbing.
    drawUniqueItem(rng, guard, (_r) => {
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(
          'a big frame with nothing in it yet',
          'Make ten in the frame. Hide a part with your hand. Now name what is hidden and what shows.',
        ),
        figure: tenFrame(0, { size: WHOLE, alt: BIG_EMPTY }),
        answer: {
          value: 'the covered part and the visible part, both named aloud',
          acceptableForms: [],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        hintLadder: ladder('Choose how much of the frame to cover.', 'Name the covered part before you lift your hand.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'build-and-name' },
      };
      return draft;
    });
}

// ===========================================================================
// Five pages that face backwards, no two alike
// ===========================================================================

/**
 * Four things hold a bond of ten up, and any one of them going soft brings it
 * down — so all four return, alongside the thing that IS this bond one size
 * smaller.
 *
 * Putting A12 on Monday is a decision, not an ordering accident. Partners of
 * five are the skill this week extends AND the mistake it has to defeat, so the
 * child meets the small frame in the warm-up and the big one two pages later,
 * each named by size in the audio. The contrast arrives before anybody is
 * assessed on it. After that: A2 for reading a filled frame at a glance, A6 for
 * the step back along the number path, A9 for a teen taken apart as a full frame
 * and some over, A5 for matching row against row.
 *
 * Each keeps the help its own week wrote. Neither the per-pack ladder dedup nor
 * the corpus scan reaches a warm-up, and rewriting one in this week's register
 * would make it stop sounding like the week it is supposed to recall. The one
 * thing that does get replaced is the accessible name, because every frame in
 * the family announces its capacity (disclosure 1).
 */
const warmSmallFrame = warmUp(
  withCards(
    withPlainAlt(partnersHiding({ total: ROW }), SMALL_COVERED),
    (p) => Number(p.total) - Number(p.shown),
    (key) => [key - 1, key + 1, key - 2, key + 2],
    { keys: SMALL_PARTNER_KEYS, cards: SMALL_PARTNER_KEYS },
    (v, key) => slipCard(v, key),
    ['concept-misconception', 'fact-recall'],
  ),
  12,
);

const warmReadFrame = warmUp(
  withCards(
    withPlainAlt(tenFrameRead({ min: 6, max: WHOLE - 1, size: WHOLE }), BIG_GAPPY),
    (p) => Number(p.n),
    (key) => [key - 1, key + 1, key - 2, key + 2],
    { keys: FRAME_READ_KEYS, cards: FRAME_READ_KEYS },
    (v, key) => slipCard(v, key, v > key ? 'representation-misread' : 'procedure-slip'),
    ['representation-misread', 'procedure-slip'],
  ),
  2,
);

const warmBefore = warmUp(
  withCards(
    neighbourNumber({ kind: 'before', min: 3, max: WHOLE }),
    (p) => Number(p.n) - 1,
    (key) => [key - 1, key + 1, key + 2, key - 2],
    { keys: BEFORE_KEYS, cards: BEFORE_KEYS },
    (v, key) => slipCard(v, key, 'fact-recall'),
    ['fact-recall', 'concept-misconception'],
  ),
  6,
);

const warmTeen = warmUp(
  withCards(
    withPlainAlt(teenExtra({ min: 11, max: 19 }), TEEN_ALT),
    (p) => Number(p.n) - WHOLE,
    (key) => [key - 1, key + 1, key + 2, key - 2],
    { keys: TEEN_KEYS, cards: TEEN_KEYS },
    (v, key) => slipCard(v, key, v > key ? 'representation-misread' : 'concept-misconception'),
    ['concept-misconception', 'representation-misread'],
  ),
  9,
);

/** Already a three-card page in the family, and its alt names no count. */
const warmMatchRows = warmUp(compareSets({ which: 'fewer', min: 3, max: 9 }), 5);

// --- the pages that are built here -----------------------------------------
/**
 * Three places the discrimination appears, and each is handed its frame by where
 * it sits rather than by a coin thrown while it is being built. That is what
 * survives a rebuild.
 */
const frameTwo = frameOrRow(dailyFrame(2));
const frameThree = frameOrRow(dailyFrame(3));
const frameMastery = frameOrRow(masteryFrame);
const puppetPage = puppetStopsAtTheRow();
const pairPage = pairThatMakesTen();
const pairAgain = pairThatMakesTen();
const cardStory = deskStory();
const gapStory = shortStory();
const nameBoth = buildAndName();

// ===========================================================================
// The week
// ===========================================================================

export const buildA13 = makeWeekBuilder({
  level: 'A',
  week: 13,
  conceptId: 'partners-of-10',
  conceptName: 'Partners of 10',
  strandTags: ['number-sense-counting', 'addition-subtraction'],
  prerequisiteWeeks: [
    { level: 'A', week: 2 },
    { level: 'A', week: 12 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the ten-frame hiding game',
  deepeningDelta:
    'A12 settled that a number hides inside five and that the hidden part is FOUND rather than counted: the card slides, nothing leaves, and the part underneath is recoverable from the part on show. It could take that far and no further, because five is one row. Every A12 bond fits in a single line of cells, is subitised rather than read, has exactly four cells to meet, and leaves a missing part small enough to whisper on to. A13 moves the same structure to ten, where the frame is two rows deep and none of that holds. There are nine cells instead of four; a partner can equal its own twin; the whole is too big to see at a glance, so the ROW becomes the tool - a partner of ten is a full row plus a partner of five, which is the first time a child uses one bond inside another. And the parent week now supplies the error: knowing the partners of five is exactly what makes a child answer 3 for a frame of ten holding seven. So the week adds the discrimination A12 could not pose - the same shown count against the small frame and the big one, with nothing else changed - and gives the puppet the slip that only exists because A12 was taught.',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. An egg box with two rows of five beats anything on a screen this week: fill it, slide a postcard over part of it, ask, then lift the card EVERY time so the answer is checked rather than believed. Say the row out loud as you fill it - "that row is full, now the other one" - because the row is the tool the whole week rests on. Keep a five-cup box beside the ten-cup one and ask the same question over each; the difference between them is the point. Mascot present.',
  },
  explanation: {
    hook: say(
      'A big frame holds ten. A card slides over part of it. The counters under it did not leave. How many hide there?',
    ),
    whyBeforeHow: say(
      'Ten can split into two parts. Nothing leaves the frame, so we still have ten. We play the ten-frame hiding game. A card covers a part. Count the part you can see. The rest is its partner.',
    ),
    script: [
      {
        say: say('This frame holds ten. A row sits above another row.'),
        visual: 'A big frame with a counter in every cell, drawn as a row above a row.',
        figure: tenFrame(WHOLE, { size: WHOLE, alt: BIG_FULL }),
      },
      {
        say: say('Now a card slides across. Six still show. Four hide.'),
        visual: 'The same frame with a card lying over the last four cells.',
        figure: tenFrame(6, { size: WHOLE, hidden: 4, coverStyle: 'single', alt: BIG_COVERED }),
      },
      {
        // Where the two frames get CONTRASTED rather than tested - the answer
        // is on the page while it happens (kit §E2.5).
        say: say('Careful. A smaller frame holds less. Its partner is different.'),
        visual: 'A small frame with a card over part of it, beside the big one.',
        figure: tenFrame(3, { size: ROW, hidden: 2, coverStyle: 'single', alt: SMALL_COVERED }),
      },
      {
        say: say('Move the card. Now two show and eight hide. Still ten!'),
        visual: 'The big frame again, with the card slid nearly to the start.',
        figure: tenFrame(2, { size: WHOLE, hidden: 8, coverStyle: 'single', alt: BIG_COVERED }),
      },
    ],
    summary: say(
      'Ten splits into two parts. Count the part you can see. The rest is hiding. Look at the frame before you answer.',
    ),
    vocabulary: [
      { term: 'partner', kidGloss: say('the part that joins yours to make ten') },
      { term: 'ten-frame', kidGloss: say('a line of boxes above another line') },
      { term: 'row', kidGloss: say('one line of boxes across the frame') },
      { term: 'hiding', kidGloss: say('still in the frame, but under the card') },
      { term: 'make ten', kidGloss: say('two parts that come to ten together') },
    ],
  },
  guidedExamples: [
    {
      ...ge(
        13,
        1,
        'modeled',
        scenePrompt('a big frame with counters showing and a card over the rest', 'How many are hiding?'),
        [
          {
            teacherSay: say('Watch me carefully. I count only the counters I can see.'),
            expected: '6',
          },
          { childDo: say('Now whisper on with me to ten.'), expected: '7, 8, 9, 10' },
          { teacherSay: say('That was four whispers. So four are hiding.') },
        ],
        '4',
      ),
      visual: 'A big frame with counters showing and a card over the rest of the cells.',
      figure: tenFrame(6, {
        size: WHOLE,
        hidden: 4,
        coverStyle: 'single',
        alt: BIG_COVERED,
        asserts: assertsAnswerOf('hidden'),
      }),
    },
    {
      ...ge(
        13,
        2,
        'completion',
        scenePrompt('a big frame with counters and a covered box', 'Fill the box: 4 and ▢ make 10.'),
        [
          { teacherSay: say('The sentence already tells me one part.'), expected: '4' },
          { childDo: say('Finish the top row first. How many?'), expected: '1' },
          { teacherSay: say('Then a whole row is still empty. So six.') },
        ],
        '6',
      ),
      visual: 'A big frame with counters at the start and a card over the rest.',
      figure: tenFrame(4, {
        size: WHOLE,
        hidden: 6,
        coverStyle: 'single',
        alt: BIG_COVERED,
        asserts: assertsAnswerOf('hidden'),
      }),
    },
    {
      ...ge(
        13,
        3,
        'prompted',
        scenePrompt('a small frame with counters showing and a card over the rest', 'How many are hiding?'),
        [
          { teacherSay: say('Look at this frame first. It is the small one.') },
          { childDo: say('So how many can it hold?'), expected: '5' },
          { childDo: say('Now say the hidden part.'), expected: '2' },
        ],
        '2',
      ),
      visual: 'A small frame with a card over the last cells.',
      figure: tenFrame(3, {
        size: ROW,
        hidden: 2,
        coverStyle: 'single',
        alt: SMALL_COVERED,
        asserts: assertsAnswerOf('hidden'),
      }),
    },
    {
      ...ge(
        13,
        4,
        'independent',
        scenePrompt('the same counters again, in the bigger frame', 'How many are hiding?'),
        [{ childDo: say('Same counters, bigger frame. Say the hidden part.'), expected: '7' }],
        '7',
      ),
      visual: 'A big frame holding the same counters as the small one did, with a card over the rest.',
      figure: tenFrame(3, {
        size: WHOLE,
        hidden: 7,
        coverStyle: 'single',
        alt: BIG_COVERED,
        asserts: assertsAnswerOf('hidden'),
      }),
    },
  ],
  days: [
    // Day 1 - last week's bond first, then gaps that can still be counted, then
    // the same gaps with a card over them, then all of it as a sentence.
    [
      { gen: warmSmallFrame, diff: 2 },
      { gen: gapsOpen, diff: 2 },
      { gen: hidingGame, diff: 2 },
      { gen: boxSentence, diff: 2 },
    ],
    // Day 2 — the row becomes a tool, and the frame starts deciding the answer.
    [
      { gen: warmReadFrame, diff: 2 },
      { gen: hidingAgain, diff: 3 },
      { gen: frameTwo, diff: 3 },
      { gen: pairPage, diff: 3 },
    ],
    // Day 3 - the sentence a second time, both frames a second time, and a
    // puppet whose row-sized answer has to be talked out of him.
    [
      { gen: warmBefore, diff: 2 },
      { gen: boxAgain, diff: 3 },
      { gen: frameThree, diff: 3 },
      { gen: puppetPage, diff: 3 },
    ],
    // Day 4 — the same move inside somebody's day: one frame filled then
    // covered, one never filled at all.
    [
      { gen: warmTeen, diff: 2 },
      { gen: cardStory, diff: 3 },
      { gen: gapStory, diff: 3 },
    ],
    // Day 5 — the bond without a frame under it, then build one and say it.
    [
      { gen: warmMatchRows, diff: 2 },
      { gen: pairAgain, diff: 3 },
      { gen: nameBoth, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: partners of ten are the single most useful thing a child can carry into school arithmetic, and this week is about seeing them rather than reciting them. The equipment is an egg box. Cut it to two rows of five, fill it with buttons, and slide a postcard over part of it. Ask, then LIFT THE CARD every single time - a child who is never shown the answer simply learns to guess with more confidence. Two habits are worth building on purpose. First, fill the top row before anything goes in the bottom one; a full row is what makes a glance enough, and a scattered ten has to be counted every time. Second, say the row out loud: "the top row is full, and three more" is the sentence that turns into mental arithmetic two years from now. Expect one particular mix-up all week, and treat it as progress rather than error: your child has just spent a week on partners of five, so they will answer as though the frame were half its size. Do not correct it with words. Put the small frame and the big frame side by side, put the same buttons in each, and ask over both. The difference is visible, and seeing it is the lesson. Away from the table this lives in fingers, egg boxes, ten steps up the stairs and the ten dots on a domino pair.',
  ],
  /**
   * The band's permitted colour-it-in page, and it asks for something no day
   * page asks for: a bond sitting inside another bond.
   *
   * Through the working days a part of ten is handed over and its partner is
   * wanted back. Here nothing is missing to begin with — the frame is full — so
   * the child has to CREATE the split with a crayon, and the counters left
   * uncoloured turn out to be a partner of FIVE inside a partner of ten. That is
   * this week's deepening claim, reduced to something a four-year-old can do
   * with two colours.
   *
   * One drawn value writes the numeral in the prompt and the number in the key;
   * the drawing itself claims nothing (disclosure 7).
   */
  puzzle: (r) => {
    const k = r.int(1, ROW - 1);
    return {
      id: 'A13-PZ-01',
      title: 'Puzzle Grove: A Row and Some More',
      puzzleType: 'math-art',
      prompt: [
        '[image: a big frame with a counter in every cell]',
        say('Color the whole top row yellow.'),
        // "IN THE BOTTOM ROW" IS NOT DECORATION. Without it the instruction can
        // be read as colouring counters that are already yellow, which is the
        // §E2.7 class - a page with two defensible answers that no gate can see.
        say(`Now color ${countNoun(k, 'counters')} in the bottom row red.`),
        say('How many counters stay plain?'),
      ].join(' '),
      figure: tenFrame(WHOLE, { size: WHOLE, alt: BIG_FULL }),
      answer: {
        value: String(ROW - k),
        acceptableForms: [countNoun(ROW - k, 'counters')],
        validation: 'exact-numeric',
      },
      hintLadder: ladder('Colour the top row first, then stop.', 'Count only what has no colour on it.'),
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'colour-a-row-then-some' },
  sprint: null,
  mastery: [
    { gen: hidingGame, diff: 2 },
    { gen: boxMastery, diff: 2 },
    { gen: frameMastery, diff: 3 },
    { gen: cardStory, diff: 3 },
    { gen: pairPage, diff: 3 },
    { gen: puppetPage, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh cells off a separate stream. 01: how many hide under the card on a full frame. 02: the same bond written as a sentence with a box for the unknown. 03: the same shown count against the small frame or the big one, with the OTHER frame\'s partner offered on every draw - keyed exactly when the frame is that frame, so it can never be struck out. 04: a story whose frame the child watched being filled before the card arrived. 05: the bond with no frame under it at all, over loose objects. 06: the puppet who counts the bare cells of the top row and stops there. Every slot offers three authored numerals and each is a mistake this week can name - the partner of a ROW used as the partner of the frame, the part on show handed back, the counters below the full row, the empty row alone, and the count that ran a cell on or stopped a cell short. No slot offers a numeral it cannot key: the card set of every page is filtered against that slot\'s own key set, computed from its own draw pool. Nothing anywhere offers ten, because a partner of ten never is ten. The puppet\'s number is the one value kept off the tap targets, since it is always smaller than anything that slot can key.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'uses-the-row-partner-for-the-frame',
      description:
        'Answers with the partner of FIVE when the frame holds ten. Not carelessness and not a gap - it is last week working exactly as it was taught, on a picture that has quietly changed size underneath it.',
      exampleWrongAnswer: 'a big frame showing three counters answered "two are hiding"',
      distractorRationale:
        'Offer the partner of a row on every partner page in the week where an honest value exists for it. On the frame discrimination it is offered on 100% of draws AND keyed on the half of them where the frame really is the small one, so it cannot be eliminated by a child who has learned to distrust it - the only way past that page is to look at the frame. It heads this bank because it is the week\'s whole risk.',
      reteachPointer: 'guidedExamples/A13-GE-03 (the small frame, met immediately before the big one)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'answers-the-row-instead-of-the-gap',
      description:
        'Sees that a whole row is empty and answers with the row, forgetting the cells still bare above it. The row is the most solid thing on the page once a child starts using it, which is exactly why it becomes the answer.',
      exampleWrongAnswer: 'asked how many are hiding behind a card over seven cells, answers 5',
      distractorRationale:
        'Offer the empty row beside the parts on the pages where the counters have not yet reached the second row, which is where the mistake is actually available. It is keyable - a frame showing five keys five - so it is a live option rather than a decoy, and it is the mirror of the reteach: the row is a tool, not an answer.',
      reteachPointer: 'explanation/script[1] (the card slides across, six show and four hide)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'counts-a-cell-on-or-a-cell-short',
      description:
        'The count from the last counter to the end of the frame begins on the cell already counted, or gives up before the last bare cell. Ten cells is far enough that this stops being rare.',
      exampleWrongAnswer: 'whispering "six, seven, eight, nine, ten" from six showing and answering 5',
      distractorRationale:
        'Put a cell and two cells either side of the truth on the page, restricted to the sides that slot can actually key. Once a child starts counting on from the last full cell this becomes the common failure, and carrying both directions is what keeps the answer off a fixed seat among the three numerals.',
      reteachPointer: 'guidedExamples/A13-GE-01 (count what shows, then whisper on to ten)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-part-that-can-be-counted',
      description:
        'Hands back the number that can be counted when the question wanted the one that cannot. There is nothing to read under a card, so the only figure the picture supplies is the figure that gets said.',
      exampleWrongAnswer: 'asked what is under the card on a frame showing four, answers 4',
      distractorRationale:
        'Offer the part on show wherever it is not the truth. It is keyable at this whole - a frame showing five hides five - so it is never free to strike out, and it is the misconception the parent week spent five days on, which is why it is still here rather than retired.',
      reteachPointer: 'explanation/script[3] (move the card: two show and eight hide, still ten)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Number bonds to ten, on a frame built as a row above a row. The game was simple: fill it, slide a card across, and say what is underneath without looking. Two things came out of that. One is the habit of filling the top row before anything else, because a full row registers at a glance while ten loose counters have to be counted again every time. The other is that the SIZE of the frame decides the answer - we deliberately asked the identical question over a small frame and a big one, and last week\'s answers only fit the small one.',
    improvingCandidates: [
      'reading the frame before deciding which partner is wanted',
      'filling the top row first, so a glance is enough',
      'using a full row and then a partner of five to reach a partner of ten',
      'reaching the covered number by reasoning rather than by naming a likely one',
      'finding the partner of a number over loose objects, with no frame to lean on',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'noticing when the frame has changed size - last week\'s partners belong to a smaller frame, and this is the mix-up to expect all week',
      },
      {
        errorTag: 'representation-misread',
        text: 'counting the bare cells above the empty row as well as the row itself',
      },
      {
        errorTag: 'procedure-slip',
        text: 'beginning the count on the first EMPTY cell instead of the last full one, which is what puts the answer a cell out',
      },
    ],
    homeFocus: {
      praiseLine:
        'You looked at the frame first, noticed it was the big one, and worked out the part under the card before we lifted it.',
      questionForChild: 'Put four buttons in an egg box that holds ten. How many spaces?',
      schoolSyncHook:
        'Tell us which apparatus nursery uses for ten - numicon, rekenrek, bead string - and we will match it at home.',
    },
    vocabularyForParent: [
      'number bond (a whole held as its two pieces at once)',
      'partner of ten (whatever has to join your number to reach ten)',
      'ten-frame (ten cells, arranged as a row on top of a row)',
      'subitising (recognising a full row without counting along it)',
    ],
  },
});
