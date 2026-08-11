/**
 * Level A · Week 6 — "Ordering numbers to 10" (conceptId: ordering-numbers-to-10).
 *
 * The sixth Level-A cell, and the first one whose anchor is a LINE rather than a
 * heap: a01 and a02 count things, a12 hides them, a20 weighs them, and this week
 * puts the numbers themselves in a row and asks where each one lives. Nothing
 * a child or a parent receives here is borrowed from a sibling week: a
 * token-overlap scan of all 123 runtime strings against the 8,763 in the other
 * 78 week files leaves one hit above 0.40, and it is a Level-B sentence that
 * happens to share the words "card", "number" and "missing" with this one.
 *
 * FILL-ARCHITECTURE §3 row A6: anchor "the number path"; core forms next/before
 * and order-three-cards; perceptual discrimination "forward vs backward
 * neighbour"; puppet error-analysis "puts 7 right after 5"; Day-5 "fix the
 * mixed-up path".
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **The counting words are a PATH, and every number has one spot on it.**
 *    That is the whole idea, and it is why every drawn surface in the week is
 *    the same line: the ticks never move, the numbers never swap places, and a
 *    question is answered by walking rather than by remembering. This is the
 *    first Level-A week whose anchor is the number-line primitive rather than
 *    counters or a frame, so the picture carries the concept directly.
 *  - **Forward and backward are two different questions over one picture.**
 *    That is the recipe's discrimination and it is real mathematics: a child who
 *    hears only the number and not the direction says the next one every time
 *    and is right half the week. So `whichWay` draws BOTH gaps — one either side
 *    of the number shown — and lets the words alone decide which one is wanted.
 *    Every other path item draws only the gap it asks about, which is what makes
 *    the two-gap page the harder one.
 *  - **A gap in the path is findable, not guessable.** Two of the eleven forms
 *    hand over a stretch of path with a number lifted out of it, and so does the
 *    puzzle. WHERE the hole falls is drawn, so on a four-long run it is at the
 *    front a quarter of the time, at the back a quarter, and in the middle half
 *    (measured 24.2% / 24.0% / 51.8% over 3,000 packs; the five-long run runs
 *    19.0% / 19.3% / 61.6%, which is the same rotation over one more interior
 *    spot). "Say the next number" therefore fails
 *    three times in four, "say the one before" three times in four, and reading
 *    the path is the only method that never fails.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **A quarter of the daily work is older work** — five items of nineteen
 *    (26.3%), one opening each day, and no format repeated. Ordering is a late
 *    skill built on early ones, so each warm-up is a piece of what a path needs
 *    to mean anything: a count you can trust over a scattered group (A1), a
 *    numeral read straight off a full frame (A2), two rows settled by pairing
 *    them off instead of by which looks longer (A5), a named numeral tracked
 *    back to the group that holds it (A4), and a ring counted without losing
 *    the place you began at (A1).
 *
 * ── TEN DISCLOSURES (FANOUT kit §E2.3: document the choice in the header) ──
 *
 * 1. **WHAT THE SIX CERTIFYING SLOTS WOULD ASK WAS DECIDED BEFORE ANY DAY HAD
 *    CONTENT**, because the answer space here is the tightest in the band. "What
 *    comes after 6?" admits exactly one number, and that number is standing next
 *    to one the question has already said out loud. Offer three of those on a
 *    page and a rank appears whether the author wanted one or not — which is how
 *    a11 lost a round and why a12 and a20 both spent their mastery budget the
 *    same way. So:
 *
 *    - **Only one of the six mastery slots offers anything to choose between.**
 *      The other five are typed numbers. Nothing to rank, nothing to eliminate,
 *      and the answer of each one moves across the range rather than sitting in
 *      a pocket: re-measured over 3,000 packs with the pair ledger of disclosure
 *      10 in place, the four mend slots key all ten values (3-18% each), the two
 *      two-gap slots key all ten (4-17% each), and the four story slots key
 *      eight (5-19% each). Those are the same spreads the slots had before the
 *      ledger existed, which is not luck — it is what `ROOM` was swept to buy,
 *      and the sweep is beside `deal`. Nor is it a dodge: SAYING the
 *      number is the skill the week is for, and picking it out of three is a
 *      weaker thing.
 *    - **The slot that does offer options is the puppet page**, three-way, with
 *      its floor argued in disclosure 4.
 *    - **The ranking page stays on the teaching days.** `rankThree` is the
 *      recipe's "order 3 cards" in a tappable shape, and it is honest — but a
 *      three-group page is a page where the longest row is often the answer, and
 *      length is a look rather than a count: measured over 3,000 packs, "tap the
 *      longest row" wins 48.8-49.2% against a 33.3% floor. That is the family's
 *      own known trap — `pickExtreme` tags its distractors "judged by how the
 *      group looks, not by counting" — and it is not worse than the numeral
 *      version it replaced, which measured 47.9-49.6% for "tap the biggest
 *      number". It runs on Days 2 and 3 and no child is promoted on it.
 *
 * 2. **`neighbourNumber`'s `between` TAKES THE LOWER BOUND, NOT THE MIDDLE, and
 *    the item that reads otherwise keys the wrong number.** `a_neighbour_v1`
 *    computes `n + 1` for `kind: 'between'` and the generator gives the path
 *    `[n, n + 2]`, so `n` is the SMALLER of the two numbers shown. Every
 *    between-shaped item in this file — the family generator on Day 2 and the
 *    local `mailStory` — passes the lower bound as `n` and is checked by QG-11
 *    against the same transform. Recorded because the parameter's name says
 *    nothing about which end it means, and an author reading only the option
 *    type would have a one-off week.
 *
 * 3. **THE RECIPE'S PUPPET SLIP IS DERIVABLE, AND ITS MIRROR IS TOO — which is
 *    what lets the puppet page carry the week's own discrimination.** Row A6's
 *    slip is "puts 7 right after 5": asked what follows a number, the puppet
 *    skips one and lands two along. Called `g` the number he stepped from, the
 *    truth is `g + 1` and his answer is `g + 2` — an offset of exactly one from
 *    the truth, which is what `a_verify_count_slip_v1` computes. Passing
 *    `{ n: g + 1, slip: 'double-count' }` returns `{ correct: g + 1,
 *    wrong: g + 2 }`, both halves recomputed by QG-11 from params rather than
 *    taken on trust, and the template's own words for the slip ("the count ran
 *    one too far") are literally what a skipped counting word does.
 *
 *    The BACKWARD branch is the same identity walked the other way: asked what
 *    comes before `g` the puppet says `g − 2`, so `{ n: g − 1,
 *    slip: 'skip-count' }` returns `{ correct: g − 1, wrong: g − 2 }`. Nothing
 *    is invented on either branch. The gain is not tidiness: with only the
 *    forward slip the truth could never be the largest number on the page, and
 *    with both it lands middle, low and high in turn (disclosure 4). The
 *    id says counting where this page says stepping, which is a naming
 *    mismatch and not a mathematical one — the transform's job is "a value and
 *    that value off by one", and that is exactly the claim being made. Level A
 *    has done this before in both directions (a12's count-ON slip through the
 *    count-BACK template, a20's measurement through `a_compare_sets_v1`), so it
 *    is written down here rather than left for a reader to notice. A
 *    registry alias — `a_verify_step_slip_v1` pointing at the same function —
 *    would let the page read as the thing it is; noted for the orchestrator.
 *
 * 4. **HALF OF THE PUPPET PAGE IS FREE, AND NO VERSION OF THIS FORM IS BETTER
 *    THAN THAT.** Error analysis needs the puppet to be mistaken, so his number
 *    is never the answer, so a child who has spotted that has removed one option
 *    without doing anything. Measured here: his number is on the page and
 *    unkeyed on 100% of draws, which leaves a coin. Three earlier A weeks report
 *    the same arithmetic. Letting him be right sometimes would fix it and would
 *    stop the item being error analysis, so what is done instead is to stop the
 *    floor being the ceiling. There is no two-option version anywhere in the
 *    week — with the puppet's number printed in the sentence, two options is not
 *    a coin, it is a giveaway. And the third option alternates between two real
 *    slips that fall on OPPOSITE sides of the truth: a step taken the wrong way
 *    down the path, which is the mistake the whole week is about, and a stride
 *    that cleared two numbers where the puppet cleared one. With the puppet's
 *    own direction drawn as well, the answer is the middle number of the three
 *    about half the time and each of the outer two about a quarter — measured,
 *    not hoped for, and the figures are in the report.
 *
 * 5. **THE FIGURE SHOWS WHERE THE ANSWER SITS AND NEVER WHICH NUMBER IT IS, and
 *    on a number path that distinction is the whole safety argument.** Every
 *    path here prints `labels: 'none'`, so no tick carries a number by default;
 *    each GIVEN number is a labelled point, and the answer is an `unknown` mark
 *    that draws a dashed ring and a question mark with no label at all. So the
 *    picture states the data, marks the empty spot, and leaves the counting to
 *    the child — and `asserts` proves the empty spot is drawn at exactly the
 *    answer's position, so a picture that pointed at the wrong tick would fail
 *    QG-13 rather than ship. The alts are the sharper half of the same problem,
 *    because band A autoplays `speakablePrompt(prompt, figure.alt)` and the alt
 *    beats the bracket: an alt listing a path's labelled marks would read the
 *    neighbours out, and on a one-gap page that is the answer minus a step. So
 *    every alt in this file describes the PATH and never its contents — except
 *    `mendThePath`, whose alt reads the run aloud on purpose, because there the
 *    shown numbers are the item's data and the answer is by construction the one
 *    number the run does not contain.
 *
 *    A NUMBER WORD IN AN ALT IS A NUMBER (`bb-spoken-answer-test` G3). No alt
 *    AUTHORED here contains "one", "two" or any other counting word; three of
 *    them had to be rewritten to get there, and the same slip is still live in
 *    the library generator this week calls, which is the defect reported at the
 *    foot of this header. Measured with the gate's own rules over 12,800
 *    assessed surfaces from 400 packs: zero disclosures.
 *
 * 6. **THE BLIND HABIT THIS WEEK EXISTS TO PUNISH IS "ALWAYS STEP FORWARD", and
 *    it is measured rather than assumed** (LEARNINGS L51). A child who hears the
 *    number and not the direction answers `n + 1` every time. So the direction is
 *    DRAWN, independently, on every form that has one — `whichWay`, `padStory`,
 *    the puppet's own step and `rankThree`'s most-or-fewest — and the mend items
 *    rotate the gap through the front, middle and back of the run, which is the
 *    same fix applied to a form that has no direction word at all. Measured over
 *    3,000 packs, and re-measured after the pair ledger of disclosure 10 — which
 *    is why the population is now spelled out rather than named: across the
 *    twelve pages a pack serves that state ONE number and SAY a direction word
 *    (the two family steps, the four two-gap pages, the three frog pages and the
 *    three puppet pages) "always step forward" wins 50.6% and "always step back"
 *    49.4% (n=36,000), and no one of those twelve slots sits outside 48-55%
 *    forward. Over every `a_neighbour_v1` item in the week the two directions
 *    are drawn 30.3% and 30.1% of the time with `between` taking the rest; the
 *    puppet steps forward on 51.7% of his pages and backward on 48.3%; and the
 *    ranking page asks for the smallest group 49.1% of the time. One rate is
 *    deliberately NOT held to 50%: `stepBetween` is answered by "one more than
 *    the smaller number shown" on every draw, and that is the mathematics of
 *    between rather than a shortcut — a child doing it is doing the week.
 *    Separately, `rankThree` keys an extreme by definition, which
 *    `bb-answer-entropy-test` exempts; an exempted item is unmeasured rather
 *    than proven safe (L51), so it is measured here anyway and kept out of the
 *    certifying slots (disclosure 1).
 *
 * 7. **Six local generators, with the reason the family could not supply each.**
 *    `whichWay` — `earlynumber.ts` has no path with a gap on both sides, and
 *    without both gaps the drawing settles the direction before the sentence
 *    gets a chance to. `mendThePath` — the family reads one neighbour off one
 *    given number; a run with a hole in it is a search rather than a step, and
 *    it is what row A6 asks Day 5 for. `rankThreeGroups` — the thinnest of the
 *    six, and the family is doing the work: it draws one coin and hands off to
 *    `pickExtreme`, because `which` is bound at construction there and a fixed
 *    `which` is an ALWAYS_MAX slot by construction. `puppetStepsPast` —
 *    `PuppetSlip` is a
 *    closed union of 'double-count' | 'skip-count' | 'count-back-start' |
 *    'teen-writing', and stepping is not among them. `padStory` and `mailStory`
 *    — there is no story generator in the family at all. Each of the six is
 *    built the family's way even so: a registry-resolvable templateId, a picture
 *    from `lib/figures`, every quantity rendered by `lib/format`, `authorMeta`
 *    stamped. Recorded for the orchestrator.
 *
 * 8. **ONE ITEM SHIPS WITH NO KEY, AND THE PUZZLE'S PICTURE CLAIMS NOTHING.**
 *    The band's production stance (FILL-ARCHITECTURE §3) is that the making is
 *    checkable and the telling is not, and §6.12 wants exactly one
 *    non-computational item that asks a child to justify something. Both land on
 *    `fixAndTell`. Its order comes out of the drawn run in code and an adult can
 *    read it off the page; the sentence the child says about it cannot be
 *    graded by anything, so `a_sort_and_tell_v1` — the family's marker for this
 *    shape — registers nothing and the item validates `manual-review`. That
 *    routes to a typed box (`AnswerEntry.tsx`), which is an adult writing down
 *    what a four-year-old says, and it is the shape a12 and a20 already ship for
 *    their own Day-5 production tasks. The puzzle is a separate case. Its
 *    drawing is the bare path the cards get laid along, and a number line with
 *    no marks has no quantity at all — `figureValue` can return `mark` or
 *    `mark:k` and there are none. So there is nothing to assert, and aiming the
 *    assertion at something else to have one would be worse than having none.
 *    The picture and the key are tied together a different way: the missing card
 *    is FOUND by scanning the dealt cards for the value that is absent, never
 *    read back off the index that was dropped.
 *
 * 9. **TWO ITEMS SHIPPED A CAPTION WHERE A PICTURE BELONGS, AND BOTH WERE
 *    RE-FORMED RATHER THAN PERMITTED.** `bb-verify-packs` failed this week on
 *    three surfaces — the two `firstOrLastCard` slots and `fixAndTell` — each
 *    carrying an `[image: number cards …]` direction with no `figure` behind it.
 *    Root cause: **no primitive in `figures.ts` renders a numeral glyph.** It is
 *    the same wall that blocks A3 (L49), and it means the phrase "number card"
 *    cannot appear as a SCENE anywhere in the corpus, only as an object a
 *    grown-up is holding. At band A a bracket with nothing behind it is read to a
 *    child who cannot read, which is the L27 harm the gate exists to stop.
 *
 *    The obvious repair was tried on paper and rejected: draw the three card
 *    values as labelled marks on a number path. It fails for a reason worth
 *    writing down, because it will come back on any ordering week. **A number
 *    line maps value monotonically to distance, so any faithful placement of
 *    three numbers encodes their order geometrically** — the marks come out
 *    left-to-right in exactly the order asked for, and "which does the path
 *    reach first?" is answered by "the leftmost", which needs no numeral read at
 *    all. Labelling fewer of the marks does not help: unlabelled marks cannot be
 *    matched to cards, so the item stops being answerable rather than stops
 *    being guessable. An ordering question posed OVER a number line is answered
 *    BY the number line.
 *
 *    So the tappable ranking moved off numerals and onto three drawn groups
 *    (`rankThreeGroups`, above), which the family builds and which a20 already
 *    retrieves from this week; and `fixAndTell` kept its numerals — they are in
 *    the sentence, where a grown-up hears them and lays real cards out — and
 *    gained the picture it was always about: the empty path the cards go back
 *    onto, drawn to the run's own extent so a correct lay-out fills it exactly.
 *    Nothing was added to `FIGURE_DEBT`; the Level-A un-migrated count went
 *    7 → 4, which is the four A15 fixture surfaces and nothing of this week's.
 *
 * 10. **THE MASTERY NOTES CLAIMED A FRESHNESS NOTHING ENFORCED, AND IT WAS FALSE
 *     ON EVERY SEED MEASURED.** `isomorphNotes` used to end "no number, direction
 *     or run is reused from Form A or from the daily pages". Nothing in the file
 *     or the assembler checked it. Measured over 500 packs: a certifying page
 *     repeated a daily page's (number, direction) pair on 99.4% of them, and two
 *     slots INSIDE one form repeated each other on 74.6% — at seed 33, MA-02 and
 *     MA-03 were both "the number before 4", which is a mastery check asking one
 *     question twice. The surface guard did not catch it because it signs on the
 *     numbers a prompt PRINTS, and a four-long run missing its first number and a
 *     five-long run missing its first number print different lists while asking
 *     for the same number in the same direction.
 *
 *     The claim is now half enforced and half rewritten, and WHICH half is which
 *     was decided by counting rather than by preference.
 *
 *     THE WEEK'S WHOLE ANSWER SPACE IS 26 PAIRS: `after` 1-9, `before` 2-10,
 *     `between` 1-8, the ranges being what a 1-10 path allows. A pack serves 23
 *     pages that carry one — eleven on the days and twelve certifying — so the
 *     old claim asked for 23 distinct pairs out of 26, at 88% saturation.
 *     A maximum-matching probe says a seating always exists (0 failures in 20,000
 *     packs), but only as a global assignment solved before any page is drawn.
 *     A per-page dealer walking its own grid cannot find it: measured over 30,000
 *     packs, plain greedy leaves some page with nothing free on 23.8% of them,
 *     and 15.3% with the `between` axis reserved. Reordering the mastery slots
 *     most-constrained-first — a real change to the arc a child works through —
 *     only reaches 1.0%. Three of the eleven daily pages are `neighbourNumber`
 *     instances that choose their own number inside `lib/`, which this file may
 *     not edit, so the daily half of the space cannot be steered at all. The
 *     mastery-versus-daily half of the old claim is therefore NOT enforceable
 *     from here, and it has been rewritten rather than faked.
 *
 *     Restrict it to the twelve certifying pages and it becomes free: 12 pairs
 *     out of 26, measured 0 failures in 30,000 packs and PROVEN by the counting
 *     argument beside `deal`. That half is enforced, and it is the half the
 *     seed-33 defect lived in. What the daily pages get instead is a preference
 *     with a measured price, swept rather than assumed (the table beside `deal`):
 *     certifying pages repeat a daily page's pair on 12.4% of pages against
 *     34.9% with no preference at all (33.5% before this file had a ledger), and
 *     the certifying slots keep the answer spread disclosure 1 selects them for.
 *     Stated the other way round, because the flattering unit is the misleading
 *     one: 88.7% of packs still contain at least one certifying page that
 *     repeats a daily pair, down from 99.4%. Twelve pages at 12.4% each is
 *     almost every pack. The per-PAGE rate is what fell by a factor of nearly
 *     three, and that is all this preference is claimed to do.
 *
 *     Nothing outside the mastery forms moved. Verified item by item against the
 *     pre-ledger builder over 2,000 packs: 0 of 38,000 daily items, 0 of 2,000
 *     puzzles, and no guided example or explanation changed. Every certifying
 *     slot did move, on 38.5% (MA-01) to 93.3% (MB-06) of packs — the gradient is
 *     the ledger filling up — and that is the honest cost of the guarantee.
 *
 * ── SHARED-LIBRARY DEFECT FOUND HERE, SINCE FIXED IN THE LIBRARY ───────────
 * `neighbourNumber`'s scene used to read "a number path with one number
 * missing", and it is the figure's alt as well as the bracket. The
 * spoken-answer gate normalises "one" to 1 (G3), so any draw keying 1 spoke the
 * answer before the question was asked — reachable through `kind: 'before'`
 * with `min <= 2`, measured at 479/4000 draws against 0/4000 for three
 * controls. No shipped week was hitting it (a11 and a12 both use
 * `kind: 'after'`). It now reads "a number path with a gap in it"
 * (`earlynumber.ts:723`) and the leak is gone at every `min`. This week's
 * before-instance keeps `min: 3` anyway: it is no longer load-bearing, and it
 * is still the right floor, because an answer of 1 on a "what comes before"
 * page asks a four-year-old to step onto a spot the path barely shows.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { drawFresh, makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  countArrangement,
  howManyChoice,
  neighbourNumber,
  pickExtreme,
  setForNumeral,
  tenFrameRead,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswerOf, assertsParam, numberLine } from '../lib/figures';
import { fmtInt } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** One name per item, drawn. Nothing in this pool is ever written into a string (kit §F.3). */
const NAMES = ['Nell', 'Osric', 'Tamsin', 'Juno', 'Emeka', 'Wren', 'Halla', 'Piet'] as const;
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Ten words, counted the way the GATE counts them
//
// Two ceilings exist and they are not the same one. `earlynumber`'s `ask()`
// weighs a whole prompt string, so this week's three-sentence puppet page trips
// a limit it never actually breaks, and no ceiling of any kind reaches a hint
// rung, a guided-example step or the puzzle. What `bb-readability-test` weighs
// is one SENTENCE at a time on every surface a child hears, and that is the
// measurement this file has to satisfy. Its splitter and its word counter are
// mirrored here and every authored string is pushed through them, so an
// eleventh word throws at module load rather than waiting for a reviewer.
//
// Alt text does not come through here, and at this band that exemption is
// load-bearing in the opposite direction: the alt is the FIRST thing the child
// hears, so it is governed by disclosure 5 rather than by a word count.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A6: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** The bracket carries the picture; the ceiling applies to what follows it. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Rungs, each pushed through the ceiling. Nothing here names a child or a number. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Re-voice a generator's help for this week without touching `lib/`.
 *
 * Two reasons, and the arithmetic one came first. No ladder may be served more
 * than twice across the fourteen non-retrieval core items, so fourteen items
 * cannot be built out of fewer than seven ladders, and that number had to be
 * known before the days were laid out (kit §E "A-band lessons", item 1). Eleven
 * are shipped. The better reason is that the advice is genuinely not the same
 * from page to page: a single gap wants "stand on the number and take one
 * step", two gaps want "settle which way BEFORE you move", and a run with a
 * hole in it wants "say it out loud until your voice and the page fall out of
 * step". A shared ladder in `lib/` would have to say one of those in all
 * twenty-four A weeks at once — which is the flatness `bb-cross-week-test`
 * exists to surface.
 *
 * It replaces one field of an already-built draft and takes no draw of its own,
 * so the prompt that QG-1 and QG-4 sign for freshness comes through unchanged.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Reopen an older week's item as today's first page.
 *
 * The band sets no floor on warm-up variety, so none of these is compulsory and
 * each has to pay for the minute it costs. They were chosen by asking what
 * "after" and "before" quietly assume. They assume a count that does not slip,
 * or the number path is a chant rather than a place. They assume a numeral can
 * be attached to a real amount, or 7 is a shape on a card. And they assume
 * "more" has already stopped meaning "longer", because a path is a line and a
 * child who reads lines by length will read this one that way too.
 *
 * The help comes through exactly as the source week wrote it. That is the
 * point: a warm-up should sound like somewhere the child has been, and dressing
 * it in this week's voice would quietly turn retrieval back into new work.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ---------------------------------------------------------------------------
// The spoken scenes — see disclosure 5
//
// Each of these is both the `[image: …]` bracket and the figure's alt, because
// at this band they describe the same drawing and there is nothing in one that
// the other must hide: none of them names a number, and none of them contains a
// counting word that `bb-spoken-answer-test` would read as one.
// ---------------------------------------------------------------------------

/**
 * The validator's OWN operand signature, computed from the numbers an item will
 * print — because two different draws of this week's forms can print the same
 * set of numbers.
 *
 * `drawUniqueItem` builds the draft first and signs it with `commutedSignature`,
 * which is exactly right; the forms below cannot use it, because they need the
 * guard consulted BEFORE the numbers are chosen (their one-token cousins would
 * otherwise drain a ten-value pool — see `stepEitherWay`). So they sign
 * themselves, and the signature has to be the validator's rather than a private
 * one. Measured: a private `{start, hole}` signature let Form B reprint Form A's
 * numbers, because a run of 5–9 missing its first number and a run of 6–10
 * missing its last both print 6, 7, 8, 9. QG-4 caught it at seed 120; the fix is
 * to sign on what is PRINTED, which is what the gate compares.
 *
 * Mirrors `generator/surface.ts` exactly, lexicographic sort included: the
 * tokens arrive there as strings, so "10" sorts before "4" and this must too.
 */
function printedSig(type: string, values: readonly number[]): string {
  return `${type}|${values.map((v) => String(v)).slice().sort().join(',')}`;
}

// ===========================================================================
// The (number, direction) ledger — dealt before the page, never redrawn
// ===========================================================================

/**
 * WHAT A PAGE OF THIS WEEK ACTUALLY ASKS is a number and a direction: "after 7",
 * "before 4", "between 5 and 7". Two pages carrying the same pair are the same
 * question in different clothes, however different the picture and the story
 * are, because the child says the same word.
 *
 * The mastery notes used to end "no number, direction or run is reused from
 * Form A or from the daily pages", and nothing enforced it. Measured over 500
 * packs before this ledger existed: a certifying page repeated a daily page's
 * pair on 99.4% of them, and two slots INSIDE one form repeated each other on
 * 74.6% — at seed 33, MA-02 and MA-03 were both "the number before 4". The
 * claim was false on every seed measured. It is now enforced where the draw
 * space allows and restated where it does not; the arithmetic of why is in
 * disclosure 10.
 *
 * The mechanism is a ledger kept in the pack's OWN surface guard, which every
 * generator already receives and which is one object per pack, shared by the
 * days, the puzzle and both mastery forms. Two namespaces, neither of which any
 * other week or gate reads:
 *  - `asked`   — written by EVERY path page in the week, daily ones included.
 *  - `claimed` — written by the twelve certifying pages only.
 * A certifying page must avoid every `claimed` pair (the hard rule) and prefers
 * to avoid the `asked` ones too (the soft one). Daily pages only record; their
 * numbers are untouched, which is why every day and the puzzle come out
 * byte-identical to before this file gained a ledger.
 */
type Dir = 'after' | 'before' | 'between';

/** What some page in this week has already asked. */
const asked = (n: number, dir: Dir): string => `a6:asked:${dir}:${String(n)}`;
/** What a certifying page has taken, and no other certifying page may have. */
const claimed = (n: number, dir: Dir): string => `a6:claimed:${dir}:${String(n)}`;

/**
 * The pair a built draft asks about, read back off the SAME params QG-11
 * recomputes the answer from — so the ledger cannot drift from the page. The
 * puppet's direction lives in his slip rather than in a `kind`: he steps
 * forward when he double-counts and backward when he skips (disclosure 3).
 */
function pairOf(draft: ItemDraft): readonly [number, Dir] | null {
  const spec = draft.generator;
  if (!spec) return null;
  const p = spec.params as { n?: unknown; kind?: unknown; slip?: unknown };
  if (typeof p.n !== 'number') return null;
  if (spec.templateId === 'a_neighbour_v1' && typeof p.kind === 'string') return [p.n, p.kind as Dir];
  if (spec.templateId === 'a_verify_count_slip_v1') return [p.n, p.slip === 'double-count' ? 'after' : 'before'];
  return null;
}

/** A daily page: records what it asked and changes nothing. Takes no rng draw. */
function records(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const p = pairOf(draft);
    if (p) guard.add(asked(p[0], p[1]));
    return draft;
  };
}

/** A certifying page: records AND claims, so no later certifying page repeats it. */
function certifies(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const p = pairOf(draft);
    if (p) {
      guard.add(asked(p[0], p[1]));
      guard.add(claimed(p[0], p[1]));
    }
    return draft;
  };
}

/**
 * DEAL THE PAIR BEFORE THE PAGE IS BUILT, out of the page's own parameter grid.
 *
 * NOT A REDRAW LOOP (kit §E2.4 / L19). The grid is a deterministic rotation of
 * the form's own parameters STARTING AT WHAT WAS DRAWN, walked with no call to
 * the rng at all, so the stream is left exactly where the draw left it and no
 * later item in the pack can be moved by this one. On the common path the first
 * candidate IS the drawn one and nothing happens.
 *
 * Pass one honours the soft rule as well as the hard one; pass two drops the
 * soft rule. Pass two cannot fail, and the reason is counting rather than luck:
 * every certifying form's grid holds at least eight distinct pairs, only twelve
 * certifying pages exist in a pack, so eleven pairs can be claimed before any
 * given page draws. The two forms with a grid of exactly eight — both `between`
 * only — compete for `between` against at most five other certifying pages (the
 * other mailbox page and the four path-mending ones), which leaves three of
 * their eight free in the worst case that can be constructed. The `grid[0]`
 * return is therefore unreachable; it is a value, not a fallback policy, and a
 * probe that forces it is in the report.
 *
 * A PREFERENCE WITH ONE WAY LEFT TO SATISFY IT IS NOT A PREFERENCE, and honouring
 * it there is what wrecks a slot's answer spread. Form B's pages draw last, off a
 * ledger holding twenty-two of the week's twenty-six pairs, so pass one was
 * routinely down to a single survivor — and a single survivor is always the same
 * corner of the same window. Measured over 3,000 packs: the last certifying page
 * keyed 8 on 31% of them, against 14-20% for that slot before this ledger
 * existed. Requiring `ROOM` still-open candidates means the page is choosing
 * rather than being cornered, and the whole frontier was swept rather than
 * guessed (3,000 packs each; worst per-slot answer mode against the share of
 * certifying pages that repeat a daily page's pair):
 *
 *      room  1 → 2.8% repeat, worst mode 31%   ← a preference taken under duress
 *      room  2 → 7.5% repeat, worst mode 22%
 *      room  3 → 12.4% repeat, worst mode 20%  ← shipped
 *      room  4 → 16.5% repeat, worst mode 20%
 *      no soft rule → 34.9% repeat, worst mode 21%
 *
 * Three is where the answer spread comes all the way back — 20% is what these
 * slots measured BEFORE the ledger, so the guarantee is bought at no cost to the
 * property disclosure 1 selects the certifying slots for — while still cutting
 * repetition of the week's own pages by a factor of nearly three. Past three the
 * repetition climbs and nothing is bought with it.
 */
const ROOM = 3;

function deal<T>(guard: TupleGuard, grid: readonly T[], pairFor: (v: T) => readonly [number, Dir]): T {
  const unclaimed = grid.filter((v) => { const [n, dir] = pairFor(v); return !guard.taken(claimed(n, dir)); });
  const fresh = unclaimed.filter((v) => { const [n, dir] = pairFor(v); return !guard.taken(asked(n, dir)); });
  if (fresh.length >= ROOM) return fresh[0];
  if (unclaimed.length > 0) return unclaimed[0];
  return grid[0];
}

/**
 * NEAREST FIRST, NOT ROUND THE HOUSES — the ordering every grid below is built
 * with, and it is a measurement rather than a taste.
 *
 * The first version walked the window upward and wrapped, which is the obvious
 * thing and quietly loads one end: a crowded ledger sent Form B's frog page to
 * the answer 3 on 25% of packs and Form B's puppet page to 8 on 28%, against a
 * flat 12-17% for the same slots' honest draw. Walking OUT from what was drawn
 * — the drawn value, then one either side, then two — is symmetric, so a
 * displaced page lands beside its own draw instead of at a fixed corner of the
 * window. Re-measured: 8-19% and 12-19%. Both orderings are deterministic and
 * neither touches the rng; only one of them keeps the answer spread the
 * certifying slots are chosen for (disclosure 1).
 */
function outward(from: number, lo: number, hi: number): number[] {
  const at = Math.min(Math.max(from, lo), hi);
  const out: number[] = [at];
  for (let d = 1; d <= hi - lo; d++) {
    if (at + d <= hi) out.push(at + d);
    if (at - d >= lo) out.push(at - d);
  }
  return out;
}

/**
 * The stepping forms — `whichWay`, `padStory` and the puppet — share one grid
 * shape: a number window and a direction. The DRAWN direction is tried right
 * across the window before the other one is considered, because the direction
 * coin is a measured 50/50 the week depends on (disclosure 6) and a dealer that
 * flipped it first would quietly spend it.
 */
function dealStep(guard: TupleGuard, n0: number, f0: boolean, lo: number, hi: number): { n: number; forward: boolean } {
  const grid: Array<{ n: number; forward: boolean }> = [];
  for (const forward of [f0, !f0]) for (const n of outward(n0, lo, hi)) grid.push({ n, forward });
  return deal(guard, grid, (v) => [v.n, v.forward ? 'after' : 'before'] as const);
}

/** `mailStory` has no direction to spend: `between` is the whole of its grid. */
function dealBetween(guard: TupleGuard, lo0: number, lo: number, hi: number): number {
  return deal(guard, outward(lo0, lo, hi), (v) => [v, 'between'] as const);
}

/**
 * `mendThePath` carries its direction in WHERE the hole falls, so its grid is
 * the whole (start, hole) rectangle. The drawn hole is walked across every
 * start before another hole is tried, which is what keeps the front / middle /
 * back rotation — the thing that makes "say the next one" fail three times in
 * four — where the draw put it rather than where the ledger would prefer it.
 */
function dealRun(guard: TupleGuard, s0: number, h0: number, length: number): { start: number; hole: number } {
  const grid: Array<{ start: number; hole: number }> = [];
  for (const hole of outward(h0, 0, length - 1)) {
    for (const start of outward(s0, 1, 11 - length)) grid.push({ start, hole });
  }
  return deal(guard, grid, (v) => {
    const answer = v.start + v.hole;
    const kind: Dir = v.hole === 0 ? 'before' : v.hole === length - 1 ? 'after' : 'between';
    return [kind === 'before' ? answer + 1 : answer - 1, kind] as const;
  });
}

/** One number shown, one empty spot beside it. Which side is in the words. */
const GAP_BESIDE = 'a number path with a gap next to the number shown';
/** Both spots open — the discrimination page, where the picture decides nothing. */
const GAP_EACH_SIDE = 'a number path with a gap on each side of the number';
/** Two numbers shown with the spot between them still open. */
const GAP_BETWEEN = 'a number path with a gap between the numbers shown';
/**
 * The puzzle's surface: ticks and nothing else, waiting for cards — and it holds
 * exactly the run, so five cards laid on six spots leave ONE spot bare and the
 * page checks itself. The first draft drew a path two spots longer than the run
 * and three spots would have been left over, which is a different puzzle and not
 * an answerable one; found by reading a generated pack.
 */
const EMPTY_PATH = 'an empty number path with a spot for every card and a spot to spare';
/** The Day-5 path: exactly one spot per card, so a correct lay-out fills it. */
const CARD_PATH = 'an empty number path with a spot for every card';

// ===========================================================================
// Local generator 1 — forward or backward, over a path that shows both
// ===========================================================================

/**
 * THE WEEK'S DISCRIMINATION, and the reason it needs its own generator.
 *
 * The family's `neighbourNumber` draws the given number and ONE empty spot, on
 * the side the question asks about. That is right for a first meeting and it is
 * also a scaffold: the picture has already chosen the direction, so a child who
 * hears only the number can still point at the only hole on the page. Here BOTH
 * spots are drawn — one before the number, one after — and the words alone say
 * which is wanted. Nothing else changes: same registered `a_neighbour_v1`, same
 * answer, same free-entry numeric answer mode.
 *
 * WHICH DIRECTION IS DRAWN, independently of the number, so "always step
 * forward" — the habit this week exists to punish — is worth a coin here rather
 * than a free pass (disclosure 6).
 *
 * SIGNED ON {direction, number}, NEVER ON THE NUMBER BY ITSELF. A prompt
 * carrying a single numeral is registered by `drawUniqueItem` as
 * `<type>|1tok|<n>`, and a week that only ever says 1 to 10 has ten of those to
 * spend. a01 spent them and its last mastery slot came out keyed to one value on
 * three draws in four. This form draws four times a pack — Days 2 and 3, then
 * both mastery forms — so it registers `path:step:<direction>:<n>` instead,
 * which is sixteen surfaces rather than ten and leaves the number free to be
 * uniform (re-measured over 3,000 packs: every value 1–10 keyed on 4–17% of
 * draws in each of the four slots). The family's own instances stay in the
 * shared pool, which sees four draws a pack in total.
 *
 * The two certifying instances are additionally DEALT their (number, direction)
 * out of the pack's ledger before the page is built, so neither can repeat the
 * other or any of the four other certifying pages — disclosure 10 and `deal`.
 */
function stepEitherWay(certifying: boolean): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => {
        // The two draws, then the deal, then the provenance seed — in that order
        // on every instance, so the certifying build consumes the stream exactly
        // as the daily one does and the deal costs nothing (see `deal`).
        const n0 = r.int(2, 9);
        const f0 = r.chance(0.5);
        const dealt = certifying ? dealStep(guard, n0, f0, 2, 9) : { n: n0, forward: f0 };
        return { n: dealt.n, forward: dealt.forward, seed: r.uint() };
      },
      (v) => `path:step:${v.forward ? 'f' : 'b'}:${String(v.n)}`,
    );
    const { n, forward } = draw;
    const answer = forward ? n + 1 : n - 1;
    // Sorted by position, so the gap before the number is mark 0 and the gap
    // after it is mark 2. The assertion names the one the item asks for, which
    // is what proves the dashed spot is drawn where the answer belongs.
    const marks = [
      { at: n - 1, style: 'unknown' as const },
      { at: n, label: fmtInt(n), style: 'point' as const },
      { at: n + 1, style: 'unknown' as const },
    ];
    const draft: ItemDraft = {
      type: 'computation',
      prompt: scenePrompt(
        GAP_EACH_SIDE,
        `One step ${forward ? 'forward' : 'back'} from ${fmtInt(n)}. Which number?`,
      ),
      figure: numberLine(
        { min: n - 2, max: n + 2, step: 1, labels: 'none', marks },
        { alt: GAP_EACH_SIDE, asserts: assertsAnswerOf(forward ? 'mark:2' : 'mark:0') },
      ),
      answer: {
        value: String(answer),
        acceptableForms: [numberWords(answer)],
        validation: 'exact-numeric',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: {
        templateId: 'a_neighbour_v1',
        params: { n, kind: forward ? 'after' : 'before' },
        seed: draw.seed,
      },
      hintLadder: hints('Voice set below; this rung is never served.'),
      errorTags: ['task-comprehension', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'step-either-way', isDiscrimination: true },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 2 — a stretch of path with a hole in it
// ===========================================================================

/**
 * The recipe's Day-5 signature, and the form that punishes both habits at once.
 *
 * A run of consecutive numbers is drawn and one of them is lifted out. WHERE the
 * hole falls is drawn too, and that is the point: at the front there is no
 * number to step forward from, at the back there is none to step back from, and
 * in the middle either step reaches it. So neither "say the next one" nor "say
 * the one before" survives, and the only method that always works is reading the
 * path.
 *
 * THE ALT READS THE RUN OUT, and it is the one alt in the week that says any
 * numbers at all. It is safe by construction rather than by luck: the numbers
 * spoken are exactly the ones still on the path, and the answer is by definition
 * the one that is not. It is also necessary — a child using a screen reader has
 * no other way to receive the data, and the question deliberately carries none.
 *
 * The kind passed to `a_neighbour_v1` is READ OFF the hole's position rather
 * than chosen: a hole at the front is a `before` question about the number that
 * follows it, a hole at the back is an `after` about the number before it, and a
 * hole anywhere else is a `between` about the pair that straddles it. All three
 * are the transform's own semantics, so QG-5 recomputes the answer from params
 * that describe the picture truthfully (disclosure 2 on which end `between`
 * takes).
 */
function mendThePath(opts: { length: number; certifying: boolean }): ItemGen {
  const { length, certifying } = opts;
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => {
        const s0 = r.int(1, 11 - length);
        const h0 = r.int(0, length - 1);
        // Dealt BEFORE the signature is taken, so `drawFresh` signs the numbers
        // this page will actually print rather than the ones it first drew.
        const dealt = certifying ? dealRun(guard, s0, h0, length) : { start: s0, hole: h0 };
        return { start: dealt.start, hole: dealt.hole, seed: r.uint() };
      },
      // The numbers this draw will PRINT — every run value except the hole.
      (v) =>
        printedSig(
          'computation',
          Array.from({ length }, (_, i) => v.start + i).filter((_, i) => i !== v.hole),
        ),
    );
    const { start, hole } = draw;
    const run = Array.from({ length }, (_, i) => start + i);
    const answer = run[hole];
    const kind = hole === 0 ? 'before' : hole === length - 1 ? 'after' : 'between';
    // 'before' asks about the number ABOVE the hole, 'after' about the one
    // below it, 'between' about the lower of the straddling pair — the lower
    // bound in every case that has one (disclosure 2).
    const n = kind === 'before' ? answer + 1 : answer - 1;
    const marks = run.map((v, i) =>
      i === hole
        ? { at: v, style: 'unknown' as const }
        : { at: v, label: fmtInt(v), style: 'point' as const },
    );
    const scene = `a number path reading ${run.map((v, i) => (i === hole ? 'blank' : fmtInt(v))).join(', ')}`;
    const draft: ItemDraft = {
      type: 'computation',
      prompt: scenePrompt(scene, 'Which number fell off the path?'),
      figure: numberLine(
        { min: start - 1, max: start + length, step: 1, labels: 'none', marks },
        { alt: scene, asserts: assertsAnswerOf(`mark:${String(hole)}`) },
      ),
      answer: {
        value: String(answer),
        acceptableForms: [numberWords(answer)],
        validation: 'exact-numeric',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_neighbour_v1', params: { n, kind }, seed: draw.seed },
      hintLadder: hints('Voice set below; this rung is never served.'),
      errorTags: ['procedure-slip', 'fact-recall'],
      authorMeta: { stepCount: 1, cognitiveOp: 'mend-the-path' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 3 — ranking three, over a picture that can actually be drawn
// ===========================================================================

/**
 * The recipe's "order 3 cards", and the second thing it was.
 *
 * THE FIRST VERSION WAS THREE NUMERAL CARDS AND IT COULD NOT BE DRAWN — see
 * disclosure 9. Nothing in `figures.ts` renders a numeral glyph, so the item
 * printed an `[image: number cards laid face up in a row]` direction with no
 * picture behind it, which at this band is a caption read to a child who cannot
 * read. And the obvious repair — three labelled marks on a number path — makes
 * it worse rather than better: a number line maps value to distance, so the
 * three marks come out in order across the page and "which does the path reach
 * first?" is answered by "the leftmost one" without a numeral being read at all.
 *
 * So the ranking is done over three drawn GROUPS, which the family already
 * builds and which a20 already treats as belonging to this week (its
 * `warmMostGroup` retrieves `pickExtreme` from A6). What survives is the whole
 * of the mathematics: three quantities, ranked, with the winner named. The
 * numeral-card version of the task lives on Day 5 and in the puzzle, where real
 * cards are in a grown-up's hand and the path is drawn for them to lie on.
 *
 * WHICH END IS WANTED IS DRAWN HERE, and the family cannot do that: `pickExtreme`
 * binds `which` when it is constructed, so a single instance keys the largest
 * group — or the smallest — on 100% of draws, which is an ALWAYS_MAX slot by
 * construction (a01 carries two of them). One coin flip before delegating costs
 * nothing and removes it: measured 49.5% / 50.5% across the two day slots.
 */
const RANK_BIGGEST = pickExtreme({ which: 'biggest', min: 1, max: 10 });
const RANK_SMALLEST = pickExtreme({ which: 'smallest', min: 1, max: 10 });

function rankThreeGroups(): ItemGen {
  return (rng, guard, difficulty) =>
    (rng.chance(0.5) ? RANK_BIGGEST : RANK_SMALLEST)(rng, guard, difficulty);
}

// ===========================================================================
// Local generator 4 — the puppet who steps over a number
// ===========================================================================

/**
 * Row A6's slip, word for word: "puts 7 right after 5". The puppet steps and
 * lands two along instead of one, and both halves of that are recomputed by the
 * registered `a_verify_count_slip_v1` (disclosure 3) — the truth beside the
 * option keyed correct, and the slip beside the number printed in the prompt.
 * QG-11 checks both at every seed. The word "wrong" never appears; "Oh no!" is
 * the band's form.
 *
 * The direction of the puppet's step is drawn, so the page carries the week's
 * own discrimination rather than sitting beside it, and the third option is
 * drawn between two honest slips on OPPOSITE sides of the truth — see
 * disclosure 4 for what that buys and what it cannot.
 */
function puppetStepsPast(certifying: boolean): ItemGen {
  return (rng, guard, difficulty) => {
    // Ranges chosen so every option a branch can offer stays on a 0-10 path:
    // forward reaches g+3, backward reaches g-3, and neither may fall below 1.
    const draw = drawFresh(
      rng,
      guard,
      (r) => {
        const f0 = r.chance(0.5);
        const g0 = f0 ? r.int(2, 7) : r.int(4, 9);
        // The pair is the TRUTH and the puppet's direction, because that is what
        // the page asks for and what `a_verify_count_slip_v1` is given. Both
        // branches put the truth in 3-8, so one window serves the whole grid.
        const t0 = f0 ? g0 + 1 : g0 - 1;
        const dealt = certifying ? dealStep(guard, t0, f0, 3, 8) : { n: t0, forward: f0 };
        return {
          forward: dealt.forward,
          given: dealt.forward ? dealt.n - 1 : dealt.n + 1,
          seed: r.uint(),
        };
      },
      // The prompt prints the puppet's number and the number he stepped from, and
      // a forward step from 5 prints the same pair as a backward step from 7.
      (v) => printedSig('error-analysis', [v.given + (v.forward ? 2 : -2), v.given]),
    );
    const { forward, given } = draw;
    // Drawn OFF the stream rather than inside the freshness sample, so a retry
    // can never bias which flank the third option lands on (kit §E2.9a: a
    // uniqueness filter between the draw and the page is not neutral).
    const farSide = rng.chance(0.5);
    const truth = forward ? given + 1 : given - 1;
    const slipped = forward ? given + 2 : given - 2;
    const puppet = rng.pick(PUPPETS);
    const wrongWay = forward ? given - 1 : given + 1;
    const twoJump = forward ? given + 3 : given - 3;
    const third = farSide
      ? {
        text: fmtInt(twoJump),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'Stepped over two counting words where the puppet stepped over one.',
      }
      : {
        text: fmtInt(wrongWay),
        errorTag: 'concept-misconception' as ErrorTag,
        rationale: 'Stepped the other way along the path - the direction word was missed.',
      };
    const { choices, correctKey } = makeChoices(rng, fmtInt(truth), [
      {
        text: fmtInt(slipped),
        errorTag: 'procedure-slip',
        rationale: 'The puppet\'s answer: a counting word was stepped over, so the foot landed two along.',
      },
      third,
    ]);
    const marks = (forward
      ? [
        { at: given, label: fmtInt(given), style: 'point' as const },
        { at: truth, style: 'unknown' as const },
      ]
      : [
        { at: truth, style: 'unknown' as const },
        { at: given, label: fmtInt(given), style: 'point' as const },
      ]);
    const draft: ItemDraft = {
      type: 'error-analysis',
      prompt: scenePrompt(
        GAP_BESIDE,
        `Oh no! ${puppet} says ${fmtInt(slipped)} comes ${forward ? 'after' : 'before'} ${fmtInt(given)}. Tap the right number.`,
      ),
      figure: numberLine(
        {
          min: forward ? given - 1 : given - 2,
          max: forward ? given + 2 : given + 1,
          step: 1,
          labels: 'none',
          marks,
        },
        { alt: GAP_BESIDE, asserts: assertsParam('n', forward ? 'mark:1' : 'mark:0') },
      ),
      choices,
      answer: { value: correctKey, acceptableForms: [fmtInt(truth)], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      generator: {
        templateId: 'a_verify_count_slip_v1',
        params: { n: truth, slip: forward ? 'double-count' : 'skip-count' },
        seed: draw.seed,
      },
      hintLadder: hints('Voice set below; this rung is never served.'),
      errorTags: ['procedure-slip', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
    };
    return draft;
  };
}

// ===========================================================================
// Local generators 5 and 6 — the path inside a story someone is living
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null deliberately. A single pictured move IS the
 * word problem at four; a two-step with one step lifted out would be a smaller
 * version of somebody else's item. Neither of the two story forms could come
 * from the family, which has no story generator of any kind.
 *
 * A frog on a numbered lily pad, hopping one pad forward or one pad back. Over
 * the plain path item it adds a person, a place — and a number that is no use to
 * anyone. How many pads the pond has is stated and never wanted. A page that
 * spends every number it mentions is teaching, without meaning to, that the
 * numbers on a page are there to be used, and that lesson survives long after
 * this one. The pond is always bigger than any pad in play, so the spare number
 * is true as well as spare.
 */
function padStory(certifying: boolean): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const pads = r.int(9, 10);
      const n0 = r.int(2, 7);
      const f0 = r.chance(0.5);
      const dealt = certifying ? dealStep(guard, n0, f0, 2, 7) : { n: n0, forward: f0 };
      const { n, forward } = dealt;
      const answer = forward ? n + 1 : n - 1;
      const name = one(r);
      const marks = (forward
        ? [
          { at: n, label: fmtInt(n), style: 'point' as const },
          { at: answer, style: 'unknown' as const },
        ]
        : [
          { at: answer, style: 'unknown' as const },
          { at: n, label: fmtInt(n), style: 'point' as const },
        ]);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(
          GAP_BESIDE,
          `The pond has ${fmtInt(pads)} lily pads. ${name}'s frog sits on pad ${fmtInt(n)}. It hops ${forward ? 'forward' : 'back'} one pad. Which pad now?`,
        ),
        figure: numberLine(
          { min: n - 2, max: n + 2, step: 1, labels: 'none', marks },
          { alt: GAP_BESIDE, asserts: assertsAnswerOf(forward ? 'mark:1' : 'mark:0') },
        ),
        answer: {
          value: String(answer),
          acceptableForms: [numberWords(answer)],
          validation: 'exact-numeric',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_neighbour_v1',
          params: { n, kind: forward ? 'after' : 'before' },
          seed: r.uint(),
        },
        hintLadder: hints('Voice set below; this rung is never served.'),
        errorTags: ['task-comprehension', 'procedure-slip'],
        authorMeta: {
          stepCount: 1,
          cognitiveOp: 'hop-along-the-path',
          situationType: 'comparison',
          posing: 'has-distractor',
        },
      };
      return draft;
    });
}

/**
 * Two numbers given and the spot between them still empty — the recipe's third
 * core form, dressed as a walk down a lane of mailboxes.
 *
 * WHICH OF THE TWO IS NAMED FIRST IS DRAWN. That is not decoration: with the
 * smaller always spoken first, "add one to the first number you hear" answers
 * the page every time, and a child would learn the sentence rather than the
 * path. Drawn, it is worth a coin, and the mathematics — one more than the
 * SMALLER of the two — is what is left (disclosure 6). `n` is the lower bound,
 * whichever order the sentence names them in, because that is what
 * `a_neighbour_v1` means by `between` (disclosure 2).
 */
function mailStory(certifying: boolean): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const lo0 = r.int(1, 8);
      const lo = certifying ? dealBetween(guard, lo0, 1, 8) : lo0;
      const hi = lo + 2;
      const answer = lo + 1;
      const loFirst = r.chance(0.5);
      const name = one(r);
      const marks = [
        { at: lo, label: fmtInt(lo), style: 'point' as const },
        { at: answer, style: 'unknown' as const },
        { at: hi, label: fmtInt(hi), style: 'point' as const },
      ];
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(
          GAP_BETWEEN,
          `${name} passes mailbox ${fmtInt(loFirst ? lo : hi)} and mailbox ${fmtInt(loFirst ? hi : lo)}. One mailbox sits between them. Which number is on it?`,
        ),
        figure: numberLine(
          { min: lo - 1, max: hi + 1, step: 1, labels: 'none', marks },
          { alt: GAP_BETWEEN, asserts: assertsAnswerOf('mark:1') },
        ),
        answer: {
          value: String(answer),
          acceptableForms: [numberWords(answer)],
          validation: 'exact-numeric',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_neighbour_v1', params: { n: lo, kind: 'between' }, seed: r.uint() },
        hintLadder: hints('Voice set below; this rung is never served.'),
        errorTags: ['task-comprehension', 'fact-recall'],
        authorMeta: { stepCount: 1, cognitiveOp: 'gap-in-the-lane', situationType: 'comparison' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 7 — Day-5 production: put them back, and say how you knew
// ===========================================================================

/**
 * Row A6's Day-5 line is "fix the mixed-up path", and this is the half of it
 * that has no answer key (disclosure 8).
 *
 * Four cards out of one run, handed over jumbled. The order comes out of the
 * drawn run in code and is on the page for a grown-up to read; the reason the
 * child gives for it is a spoken sentence, and no transform grades spoken
 * sentences. `a_sort_and_tell_v1` registers neither an `answerFor` nor a
 * `verifyFor`, which is what makes it the right marker rather than a gap. This
 * is also the week's §6.12 justification item.
 *
 * The cards are RESHUFFLED until they are not already in order, deterministically
 * and at most twice: a "mixed-up path" that arrives tidy is not the task, and
 * one in twenty-four draws of four cards is.
 */
function fixAndTell(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const start = r.int(1, 7);
      const run = [start, start + 1, start + 2, start + 3];
      let shown = r.shuffle(run);
      // Deterministic, bounded, never a redraw loop (kit §E2.4).
      if (shown.every((v, i) => v === run[i])) shown = r.shuffle(run);
      if (shown.every((v, i) => v === run[i])) shown = [run[1], run[0], run[3], run[2]];
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(
          CARD_PATH,
          `These cards fell off the path: ${shown.map((v) => fmtInt(v)).join(', ')}. Put them in order, smallest first. Tell how you know.`,
        ),
        // The path the cards go back onto, drawn to the run's OWN extent: four
        // spots for four cards, so a correct lay-out fills it exactly and a
        // wrong one leaves a hole. No marks, so there is no quantity to assert
        // (disclosure 8) — and no mark means no number is printed anywhere, so
        // the picture cannot pre-empt the ordering it exists to receive.
        figure: numberLine(
          { min: start, max: start + 3, step: 1, labels: 'none' },
          { alt: CARD_PATH },
        ),
        answer: {
          value: run.map((v) => fmtInt(v)).join(', '),
          acceptableForms: [],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_sort_and_tell_v1', params: { a: shown[0] }, seed: r.uint() },
        hintLadder: hints('Voice set below; this rung is never served.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'rebuild-the-path' },
      };
      return draft;
    });
}

// ===========================================================================
// The generators, bound and given this week's voice
// ===========================================================================

/**
 * The family's own before/after/between, on the single-gap path.
 *
 * `min: 3` on the before-instance began as a workaround: the family's scene used
 * to say "a number path with one number missing", the spoken-answer gate reads
 * "one" as the value 1, and a draw of n = 2 keys 1 — so the alt spoke the answer
 * before the question. That is fixed in the library now (see the note at the
 * foot of the header), and the floor is kept for the pedagogical reason it also
 * always had: an answer of 1 leaves nothing to the left of it to step back from.
 */
// Each ladder is named once and served to both the daily instance and the
// certifying one, because a mastery page that helps differently from the page
// it certifies is testing the help rather than the child.
const L_AFTER = hints('Put a finger on the number you were given.', 'Take one step the way the counting goes.');
const L_BEFORE = hints('Find the number, then face the start of the path.', 'Step once that way and say what you land on.');
const L_BETWEEN = hints('Start on the smaller number that is shown.', 'One step along lands you in the gap.');
const L_WHICH_WAY = hints('Forward goes towards the big end of the path.', 'Back goes towards the start of the path.');
const L_MEND = hints('Say the path from its first number onwards.', 'Stop where your voice and the path disagree.');
const L_MEND_LONG = hints('Point at each number as you say it.', 'Say the missing word into the empty spot.');
const L_RANK = hints('No group is ruled out until it has been counted.', 'The bigger number sits further along the path.');
const L_PUPPET = hints('Say the counting words slowly beside the puppet.', 'A counting word was stepped over. Find it.');
const L_FROG = hints('Find where the story starts on the path.', 'One hop moves you exactly one spot.');
const L_LANE = hints('Both numbers are given. The gap sits between them.', 'Count on from the smaller number, just once.');
const L_SORT = hints('Find the smallest card and set it down first.', 'Then ask which card comes next after that.');

// --- the daily instances: they RECORD their pair and are otherwise untouched --
// The three family instances cannot be dealt to - `neighbourNumber` chooses its
// own number inside `lib/` - but they can be read, and `records` reads the same
// params QG-11 does without spending a draw. That is the whole reason the soft
// rule reaches them at all (disclosure 10).
const stepAfter = records(withHints(neighbourNumber({ kind: 'after', min: 1, max: 9 }), L_AFTER));
const stepBefore = records(withHints(neighbourNumber({ kind: 'before', min: 3, max: 10 }), L_BEFORE));
const stepBetween = records(withHints(neighbourNumber({ kind: 'between', min: 1, max: 8 }), L_BETWEEN));

const whichWay = records(withHints(stepEitherWay(false), L_WHICH_WAY));
const mendPath = records(withHints(mendThePath({ length: 4, certifying: false }), L_MEND));
const mendPathLong = records(withHints(mendThePath({ length: 5, certifying: false }), L_MEND_LONG));
const puppetMixUp = records(withHints(puppetStepsPast(false), L_PUPPET));
const frogHop = records(withHints(padStory(false), L_FROG));
const laneGap = records(withHints(mailStory(false), L_LANE));

// `rankThree` names no number and points in no direction - it ranks three drawn
// groups - so there is no pair for it to record, and `sortTheCards` hands over a
// whole run rather than asking about one spot. Neither takes a ledger wrapper.
const rankThree = withHints(rankThreeGroups(), L_RANK);
const sortTheCards = withHints(fixAndTell(), L_SORT);

// --- the six certifying instances: dealt a pair, then they claim it -----------
const whichWayCheck = certifies(withHints(stepEitherWay(true), L_WHICH_WAY));
const mendPathCheck = certifies(withHints(mendThePath({ length: 4, certifying: true }), L_MEND));
const mendPathLongCheck = certifies(withHints(mendThePath({ length: 5, certifying: true }), L_MEND_LONG));
const frogHopCheck = certifies(withHints(padStory(true), L_FROG));
const laneGapCheck = certifies(withHints(mailStory(true), L_LANE));
const puppetMixUpCheck = certifies(withHints(puppetStepsPast(true), L_PUPPET));

// --- the five warm-ups, one format and one source week each ----------------
// Floors and ceilings, not defaults. `countArrangement` in a ring needs three
// counters before there is a ring to go round (a01 measured a "ring of two"),
// `setForNumeral` and `compareSets` need room for genuinely different groups,
// and `tenFrameRead` is held above five so the frame is read as a ten rather
// than counted from nothing.
const warmTapNumeral = warmUp(howManyChoice({ min: 3, max: 5, arrangement: 'scattered' }), 1);
const warmReadFrame = warmUp(tenFrameRead({ min: 6, max: 10, size: 10 }), 2);
const warmMatchRows = warmUp(compareSets({ which: 'more', min: 3, max: 8 }), 5);
const warmWhichGroup = warmUp(setForNumeral({ min: 2, max: 9, groups: 3 }), 4);
const warmCountRing = warmUp(countArrangement({ min: 3, max: 5, arrangement: 'in a ring' }), 1);

// ===========================================================================
// The week
// ===========================================================================

export const buildA06 = makeWeekBuilder({
  level: 'A',
  week: 6,
  conceptId: 'ordering-numbers-to-10',
  conceptName: 'Ordering numbers to 10',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 2 },
    { level: 'A', week: 5 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the number path',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Make a real path before you open the app: ten paper plates, ten chalk squares on the step, or ten sticky notes along the hall, numbered 1 to 10. Let your child WALK it, saying each number as a foot lands. Then stand on a number and ask what is one step forward, and one step back, and let the feet answer before the mouth does. Turn a number over and see whether they can name what is hidden. The walking is the lesson; the screen only checks it. Mascot present.',
  },
  explanation: {
    hook: say(
      'Numbers stand in a line, like children waiting for lunch. Six always comes after five. Five always comes before six. The path never changes its mind.',
    ),
    whyBeforeHow: say(
      'Every number has its own spot on the number path. It sits there because counting always goes the same way. So we never have to guess what comes next. Step forward and the number grows by one. Step back and it shrinks by one. If a spot sits empty, walk to it. The path will tell you.',
    ),
    script: [
      {
        say: say('Here is the number path. Watch my finger walk along it.'),
        visual: 'A number path from 0 to 6 with every number printed.',
        figure: numberLine(
          { min: 0, max: 6, step: 1, labels: 'all' },
          { alt: 'a number path with all its numbers printed along it' },
        ),
      },
      {
        say: say('I stand on four. I step forward once. Five!'),
        visual: 'The same path, with a hop drawn from 4 to the next spot.',
        figure: numberLine(
          {
            min: 2,
            max: 7,
            step: 1,
            labels: 'all',
            marks: [{ at: 4, label: '4', style: 'point' }],
            hops: [{ from: 4, to: 5 }],
          },
          { alt: 'a number path with a hop drawn from the marked number to the next spot' },
        ),
      },
      {
        say: say('Now I stand on four again. I step back. Three!'),
        visual: 'The same path, with the hop drawn the other way, from 4 back one spot.',
        figure: numberLine(
          {
            min: 2,
            max: 7,
            step: 1,
            labels: 'all',
            marks: [{ at: 4, label: '4', style: 'point' }],
            hops: [{ from: 4, to: 3 }],
          },
          { alt: 'a number path where the hop curves backwards from the marked number' },
        ),
      },
      {
        say: say('A number fell off here. I walk along and find it.'),
        visual: 'A short path reading 4, 5, blank, 7 with the empty spot ringed.',
        figure: numberLine(
          {
            min: 3,
            max: 8,
            step: 1,
            labels: 'none',
            marks: [
              { at: 4, label: '4', style: 'point' },
              { at: 5, label: '5', style: 'point' },
              { at: 6, style: 'unknown' },
              { at: 7, label: '7', style: 'point' },
            ],
          },
          { alt: 'a number path reading 4, 5, blank, 7' },
        ),
      },
    ],
    summary: say(
      'Numbers always stand in the same order. Forward is one more. Back is one less. If a number goes missing, walk along and find it.',
    ),
    vocabulary: [
      { term: 'after', kidGloss: 'the next spot forward along the path' },
      { term: 'before', kidGloss: 'the spot you have just come from' },
      { term: 'between', kidGloss: 'the spot with a number on either side of it' },
      { term: 'number path', kidGloss: 'the counting numbers, standing in their own order' },
      { term: 'in order', kidGloss: 'each one in the spot the counting gives it' },
    ],
  },
  guidedExamples: [
    {
      ...ge(6, 1, 'modeled', scenePrompt(GAP_BESIDE, 'What number comes after 5?'), [
        {
          teacherSay: say('Watch my finger. I put it on five and hold it there.'),
        },
        {
          teacherSay: say('Which way is after? Towards the big end. So I go this way.'),
          expected: 'forward',
        },
        { childDo: say('Take one step along with me.'), expected: '6' },
        { teacherSay: say('Six. One step forward, one number bigger.') },
      ], '6'),
      visual: 'A number path with 5 marked and the spot after it empty.',
      figure: numberLine(
        {
          min: 3,
          max: 7,
          step: 1,
          labels: 'none',
          marks: [
            { at: 5, label: '5', style: 'point' },
            { at: 6, style: 'unknown' },
          ],
        },
        { alt: GAP_BESIDE, asserts: assertsAnswerOf('mark:1') },
      ),
    },
    {
      ...ge(6, 2, 'completion', scenePrompt(GAP_BESIDE, 'What number comes before 8?'), [
        { teacherSay: say('Before means back the way we came. I will start you.') },
        { childDo: say('Put a finger on eight and step back once.'), expected: '7' },
        { teacherSay: say('Seven. A step back makes the number smaller.') },
      ], '7'),
      visual: 'A number path with 8 marked and the spot before it empty.',
      figure: numberLine(
        {
          min: 6,
          max: 10,
          step: 1,
          labels: 'none',
          marks: [
            { at: 7, style: 'unknown' },
            { at: 8, label: '8', style: 'point' },
          ],
        },
        { alt: GAP_BESIDE, asserts: assertsAnswerOf('mark:0') },
      ),
    },
    {
      ...ge(6, 3, 'prompted', scenePrompt(GAP_BETWEEN, 'What number goes between 2 and 4?'), [
        { teacherSay: say('Two numbers are here. The empty spot sits in the middle.') },
        { childDo: say('Put your finger on the lower number. Step once.'), expected: '3' },
      ], '3'),
      visual: 'A number path with 2 and 4 marked and the spot between them empty.',
      figure: numberLine(
        {
          min: 1,
          max: 5,
          step: 1,
          labels: 'none',
          marks: [
            { at: 2, label: '2', style: 'point' },
            { at: 3, style: 'unknown' },
            { at: 4, label: '4', style: 'point' },
          ],
        },
        { alt: GAP_BETWEEN, asserts: assertsAnswerOf('mark:1') },
      ),
    },
    {
      ...ge(6, 4, 'independent', scenePrompt('a number path reading 6, blank, 8, 9', 'Which number fell off the path?'), [
        { childDo: say('Read the path out loud. Stop at the empty spot.'), expected: '7' },
      ], '7'),
      visual: 'A number path reading 6, blank, 8, 9.',
      figure: numberLine(
        {
          min: 5,
          max: 10,
          step: 1,
          labels: 'none',
          marks: [
            { at: 6, label: '6', style: 'point' },
            { at: 7, style: 'unknown' },
            { at: 8, label: '8', style: 'point' },
            { at: 9, label: '9', style: 'point' },
          ],
        },
        { alt: 'a number path reading 6, blank, 8, 9', asserts: assertsAnswerOf('mark:1') },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: one step forward, one step back, and the first
    // stretch of path with a hole in it.
    [
      { gen: warmTapNumeral, diff: 1 },
      { gen: stepAfter, diff: 1 },
      { gen: stepBefore, diff: 2 },
      { gen: mendPath, diff: 2 },
    ],
    // Day 2 — the discrimination arrives: one picture, two gaps, and only the
    // words to choose between them. Then the spot with a number either side.
    [
      { gen: warmReadFrame, diff: 2 },
      { gen: whichWay, diff: 2 },
      { gen: stepBetween, diff: 2 },
      { gen: rankThree, diff: 3 },
    ],
    // Day 3 — the discrimination again, three cards again, and the puppet who
    // steps over a number.
    [
      { gen: warmMatchRows, diff: 2 },
      { gen: whichWay, diff: 3 },
      { gen: rankThree, diff: 3 },
      { gen: puppetMixUp, diff: 3 },
    ],
    // Day 4 — the same walk inside a story someone is living: a frog on a pond,
    // a lane of mailboxes, and one more path to mend.
    [
      { gen: warmWhichGroup, diff: 2 },
      { gen: frogHop, diff: 2 },
      { gen: laneGap, diff: 3 },
      { gen: mendPath, diff: 3 },
    ],
    // Day 5 — a longer path to mend, then the fallen cards put back in order
    // with the reason said out loud.
    [
      { gen: warmCountRing, diff: 2 },
      { gen: mendPathLong, diff: 3 },
      { gen: sortTheCards, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: knowing the counting words is not the same as knowing the order, and this week is the gap between them. Most children can chant to ten long before they can answer "what comes after six?" without starting again at one — and starting again at one is not a mistake, it is the stage. Do not correct it; just ask again straight afterwards, and over a few weeks the chant shortens by itself. Make the path real. Ten paper plates down the hallway, or chalk squares on the step, numbered 1 to 10, and let your child walk it saying each number as a foot lands. Then stand on a number and ask for one step forward, and one step back. Feet answer this question far better than heads do. Two things are worth watching for. If they always say the next number up whatever you asked, they are hearing the number and not the direction word - say "back" more slowly and take the step with them. And if they can go forward but not back, walk the path in reverse a few times, which is the bit almost nobody practises. Turning one plate face down and asking what is hiding is the whole of Day 5, and it never stops being a good game.',
  ],
  /**
   * A build task rather than a colouring page, which FILL-ARCHITECTURE §3
   * sanctions alongside solve-and-colour — and it is the one move no day makes.
   *
   * Every day this week asks about ONE spot: the one after, the one before, the
   * one in the hole. Here five cards from a run of six are tipped out and the
   * child has to lay the whole thing down before anything can be noticed at all.
   * The missing card cannot be seen from any single card; it appears only once
   * the path exists. That is the difference between reading a path and building
   * one, and it is the last thing before Level B's hundred chart.
   *
   * The gap is never at either end (see the draw), because a run missing its
   * last card is not missing anything a child could name. The answer is
   * recomputed by scanning the dealt cards rather than read off the index that
   * was dropped (disclosure 8).
   */
  puzzle: (r) => {
    const start = r.int(1, 5);
    const run = [start, start + 1, start + 2, start + 3, start + 4, start + 5];
    // Interior only: with an end missing, "which card is missing" has no answer
    // a child could defend, because the run's own edge is what tells them.
    const holeAt = r.int(1, 4);
    const dealt = r.shuffle(run.filter((_, i) => i !== holeAt));
    // Two routes to one number: the answer is FOUND in the dealt cards rather
    // than remembered from the index, so a dealing bug throws it off rather
    // than hiding inside it.
    const lo = Math.min(...dealt);
    const hi = Math.max(...dealt);
    let missing = -1;
    for (let v = lo; v <= hi; v++) if (!dealt.includes(v)) missing = v;
    return {
      id: 'A6-PZ-01',
      title: 'Puzzle Grove: Lay the Path Back Out',
      puzzleType: 'construction',
      prompt: [
        `[image: ${EMPTY_PATH}]`,
        say('These cards belong on the path.'),
        say(`The cards are ${dealt.map((v) => fmtInt(v)).join(', ')}.`),
        say('Lay them out in order, smallest first.'),
        say('One card is missing. Which number is it?'),
      ].join(' '),
      // No `asserts` — see disclosure 8. The picture is the empty surface the
      // cards are laid along, and a number line with no marks has no quantity
      // for `figureValue` to return.
      // Exactly the run: six spots for five cards, so the bare spot IS the answer
      // once the cards are down, and nothing else on the line is empty.
      figure: numberLine(
        { min: start, max: start + 5, step: 1, labels: 'none' },
        { alt: EMPTY_PATH },
      ),
      answer: {
        value: String(missing),
        acceptableForms: [numberWords(missing)],
        validation: 'exact-numeric',
      },
      hintLadder: hints('Lay the cards out in counting order.', 'One counting word has no card. That is it.'),
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'build-the-run' },
  sprint: null,
  mastery: [
    { gen: whichWayCheck, diff: 2 },
    { gen: mendPathCheck, diff: 3 },
    { gen: mendPathLongCheck, diff: 3 },
    { gen: frogHopCheck, diff: 2 },
    { gen: laneGapCheck, diff: 3 },
    { gen: puppetMixUpCheck, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh numbers off a separate stream. 01: one number shown with a spot open on EACH side, so only the direction word says which is wanted - typed as a number. 02: a four-long stretch of path with one number lifted out, the hole falling at the front, the middle or the back in turn. 03: the same, five long. 04: a frog hopping one pad either way, with the size of the pond stated and never used. 05: two mailbox numbers named in a drawn order, with the spot between them open. 06: the puppet who steps over a counting word, going forward or backward, with an honest slip on each side of the truth. Five of the six take a typed number rather than a tap, because a before-or-after question has one answer sitting next door to a number the question already said, and a two- or three-option page over that space manufactures a rank a child can sit on; the one page that does offer options is the error-analysis page, whose floor is argued in the file header. FRESHNESS, STATED SO IT CAN BE CHECKED: every page here asks for one number in one direction - after it, before it, or between two - and those twelve pairs are twelve DIFFERENT ones. No two slots in a form repeat each other and no Form B slot repeats its Form A twin or any other Form A slot; the pair is dealt out of the pack\'s own ledger before the page is built, which is what stops MA-02 and MA-03 both coming out as "the number before 4". The daily pages are a preference rather than a promise: a certifying page takes a pair the week has not already served whenever three such pairs are still open to it, and repeats a daily page\'s pair on a measured 12.4% of certifying pages against 34.9% with no preference at all - though because there are twelve of them, most packs still contain one somewhere, so read that as "less of the week comes back" and not as "none of it does". It is not a promise because it cannot be one - the whole space is 26 pairs, the days spend eleven of them, and three of those eleven are drawn inside the shared library where this week cannot reach. No two path-mending pages print the same list of numbers, which the pack\'s surface guard does enforce.',
  mistakeBank: [
    {
      errorTag: 'task-comprehension',
      subtype: 'hears-the-number-not-the-direction',
      description:
        'Answers with the next number up whatever was asked. It is not carelessness: "and then?" is the only question most children have ever been asked about counting, so forward is the only direction the words have ever pointed in.',
      exampleWrongAnswer: 'asked what comes before 8, answers 9',
      distractorRationale:
        'Offer the other side of the number on every stepping page, and draw the direction so forward is right only half the time.',
      reteachPointer: 'explanation/script[2] (standing on the same number and stepping back instead)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'restarts-the-count-from-one',
      description:
        'Cannot enter the counting sequence in the middle, so every question is answered by chanting from one and listening for the number to go past. It gets the right answer slowly and fails the moment the path runs backwards.',
      exampleWrongAnswer: 'asked what comes after 7, counts "one, two, three…" and loses the place at six',
      distractorRationale:
        'Offer a number one or two off the truth, which is where a chant that has lost its place lands.',
      reteachPointer: 'guidedExamples/A6-GE-01 (a finger placed ON the number and held there)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'steps-over-a-counting-word',
      description:
        'Says the counting words faster than the feet move, so one word gets no spot and the step lands two along. The commonest slip in the middle of the path, where the words come easily.',
      exampleWrongAnswer: 'puts 7 right after 5',
      distractorRationale:
        'Offer the spot two along beside the spot one along, on both the puppet page and the mending pages.',
      reteachPointer: 'explanation/script[1] (a single hop drawn from the marked number to the next spot)',
    },
    {
      // Added when the ranking page moved onto drawn groups: `pickExtreme` tags
      // its distractors 'representation-misread', and a distractor tag with no
      // bank entry behind it is a preflight failure as well as an unexplained
      // wrong answer. It is on-thread rather than bolted on - a row's LENGTH
      // standing in for its count is the same substitution as a number's
      // POSITION standing in for its value, which is what the path is for.
      errorTag: 'representation-misread',
      subtype: 'reads-the-row-not-the-count',
      description:
        'Chooses among three groups by how far the row reaches instead of by counting it. Length is a good guess and it is not the same thing as a number, which is the whole reason a count is worth making.',
      exampleWrongAnswer: 'a spread-out row of 4 chosen over a tight row of 6 as "the most"',
      distractorRationale:
        'Offer the other two groups, drawn with counts close enough that the rows have to be counted rather than glanced at.',
      reteachPointer: 'explanation/script[0] (numbers standing in their own order, not in their own sizes)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'reads-the-gap-off-the-wrong-neighbour',
      description:
        'On a path with a hole in it, answers from whichever neighbour was noticed first instead of from both. Gives the number already showing, or its double-step, when the gap sits between two givens.',
      exampleWrongAnswer: 'a path reading 4, blank, 6 answered with 4',
      distractorRationale:
        'Put the hole at the front, in the middle and at the back in turn, so no single neighbour is ever the whole answer.',
      reteachPointer: 'guidedExamples/A6-GE-03 (starting on the smaller number and stepping once)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The number path - the idea that the counting numbers stand in a fixed order and every one of them has its own spot. We stepped forward and backward along it, found the number that sits between two others, put three cards in the order the path reaches them, and mended stretches of path with a number lifted out. We also met a puppet who says the counting words faster than his feet move, and put him right.',
    improvingCandidates: [
      'answering "what comes after?" without starting again at one',
      'hearing whether a question asks for forward or backward',
      'finding the number that sits between two given numbers',
      'reading a stretch of path and noticing where a number is missing',
      'putting a handful of number cards into counting order',
    ],
    strengtheningByTag: [
      {
        errorTag: 'task-comprehension',
        text: 'listening for the direction word, now that forward and backward arrive over the very same picture',
      },
      {
        errorTag: 'concept-misconception',
        text: 'stepping straight into the middle of the counting sequence instead of chanting up to it from one',
      },
      {
        errorTag: 'procedure-slip',
        text: 'letting one counting word land on exactly one spot, which is where the stepped-over number goes missing',
      },
    ],
    homeFocus: {
      praiseLine:
        'You found the empty spot by walking the path out loud, and you noticed the puppet had stepped over a number.',
      questionForChild: 'If you are standing on seven, what is one step back - and how did your feet know?',
      schoolSyncHook: 'If they use a number line, a hundred square or a number track at nursery, tell us and the pictures will match it.',
    },
    vocabularyForParent: [
      'before / after (one step back, one step forward along the counting order)',
      'between (the spot with a given number on either side of it)',
      'number path / number track (the counting numbers drawn in their own order)',
      'counting on (entering the sequence in the middle instead of restarting at one)',
    ],
  },
});
