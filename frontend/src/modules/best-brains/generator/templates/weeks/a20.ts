/**
 * Level A · Week 20 — "Weight & capacity" (conceptId: weight-and-capacity).
 *
 * Built on the same assembler and the same G8 family as a01, a02, a11 and a12,
 * and deliberately sharing nothing else with them: the objects, the units, the
 * scenes, the help, the puppet's mistake and the parent's page are all new here,
 * and a token-overlap scan against all 77 week files backs that up.
 *
 * FILL-ARCHITECTURE §3 row A20: anchor "a balance tilts down = heavier"; core forms heavier/lighter and holds-more; perceptual
 * discrimination "big balloon vs small stone — bigger is NOT heavier"; puppet
 * error-analysis "says the bigger one is heavier"; Day-5 predict-then-sort plus
 * an oral R-flagged part.
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **How big a thing looks tells you nothing about how heavy it is.** That
 *    single belief is what a four-year-old brings, and removing it is the whole
 *    week. So it is attacked from four sides, and each of the four is a PER-PACK
 *    guarantee rather than a pool average: the three pair pages are dealt one
 *    big-and-heavy, one big-and-light and one either way; the three three-way
 *    pages take the biggest, the middling and the smallest object as their
 *    answer, one each; the puppet reasons from size out loud and is caught; and
 *    the capacity strand runs the same trap on HEIGHT — where a child of this
 *    age reads "more" off a tall thin shape — with its four pages dealt so the
 *    taller container really holds more on one or two of them and never more.
 *    A pool balanced across thousands of packs still hands SOME child a week
 *    that points one way throughout, which is exactly what an independent
 *    reader drew, twice; only a per-pack deal removes that.
 *  - **A weight is a COUNT, and that is what makes it arguable.** Everything
 *    here is settled by counting a common unit — the blocks a thing balances,
 *    the cups a container fills — so a disagreement is never a matter of who
 *    looks harder. Six of the fourteen core items are that count on its own,
 *    with nothing to compare it to, because the measuring has to become
 *    ordinary before comparing can mean anything.
 *  - **Nothing here can be answered off the sentence alone.** Band A trades the
 *    multi-step quota for `pictorialPerDay: 1`, and at this concept that is not
 *    a concession: the counts live in the drawing and nowhere else, so a child
 *    who does not look at the rows has nothing to go on. Days 1–4 carry a figure
 *    on every non-retrieval item, each drawn from that item's own numbers.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **A warm-up a day, five in all — 26.3% of the daily items.** No two share a
 *    shape and no two come from the same earlier week, and each is something a
 *    measurement stops working without: counting a laid-out group (A2), matching
 *    two rows one for one, which is where "more" stopped meaning "longer" (A5),
 *    ranking three groups by how many (A6), reading a missing part off a stated
 *    whole (A13), and splitting a number into ten and some more (A10).
 *
 * ── TEN DISCLOSURES (FANOUT kit §E2.3: document the choice in the header) ──
 *
 * 1. **NOTHING HERE DRAWS A BALANCE, and the recipe's anchor is therefore
 *    ENACTED rather than pictured.** Row A20's anchor is "a balance tilts down =
 *    heavier". No primitive draws a two-pan balance: `figures.ts` offers
 *    counters, ten-frames, number lines, bar models, grids, place-value charts,
 *    clocks, coins, coordinate grids and angle figures, and a tilted beam is
 *    none of them. What the family shipped instead — and it is a better model at
 *    this age, not a substitute — is comparison through a COMMON UNIT
 *    (`compareMeasure`, `lib/earlynumber.ts`): the rock balances seven blocks,
 *    the feather two. A count is arguable and a tilt is not, and the count is
 *    the thing a five-year-old can carry into Level B.
 *
 *    So the balance appears exactly where it can be honest: in the `hook`, the
 *    lesson script's spoken lines and `scaffoldNotes`, which tell the grown-up
 *    to build one out of a coat hanger and two cups and to let the child work
 *    it. Every DRAWN surface, and therefore every assessed item, shows the row
 *    of blocks that balanced the thing — which is what the balance leaves
 *    behind. The blueprint's `conceptualAnchor` is "the blocks that balance it" for the
 *    same reason: the §6.9 gate demands the anchor be named in `whyBeforeHow`,
 *    and naming an object the child never sees would be the L27 defect
 *    (content authored against a surface that does not exist). Recorded for the
 *    orchestrator: a two-pan balance primitive would serve A20 and B6/B7/B15,
 *    which are the balance-scale algebra weeks.
 *
 * 2. **`compareMeasure` IS USED, and a MEASURED library defect is worked around
 *    locally rather than inherited.** The family generator the recipe points at
 *    keys the FIRST THING IT NAMES on 73.0% of draws — measured over 4,000 seeds
 *    at all three attributes, and identical at each because the bias is in the
 *    draw, not the pool (`earlynumber.ts:1341-1343`: `a` is drawn 4–9 and `b`
 *    2–8, and the tie nudge sends four of the five ties to `a` as well). At band
 *    A that is a page a child scores by tapping whatever the audio names first.
 *    For a WEIGHT week it is worse than that: `SCENES.weight` pairs are
 *    `bag/ball`, `book/leaf` and `rock/feather`, and in every one the
 *    first-named thing is the obviously heavier one — so the shipped generator
 *    teaches "the thing that looks heavier is heavier" 73% of the time, which is
 *    precisely the misconception A20 exists to remove.
 *
 *    Reported with a one-line fix; meanwhile `weighPair` below draws the same
 *    comparison through the same registered `a_compare_measure_v1` transform,
 *    with the naming order drawn and the pool balanced. Measured over 2,000
 *    packs across its three slots: "tap whatever is named first" wins 49.3-51.6%
 *    and "tap the bigger thing" wins 48.9-51.6%, on a page whose chance floor is
 *    50%. Nothing about the library is changed and nothing about it is silently
 *    depended on.
 *
 * 3. **THE RECIPE'S PUPPET SLIP IS NOT A NUMBER, so no `verifyFor` in the
 *    library can produce it — and it does not need to.** Row A20's slip is "says
 *    the bigger one is heavier". Its output is an OBJECT, not a value: applied
 *    to a drawn trio it names whichever thing the trio declares physically
 *    biggest. Every {correct, wrong} transform registered for this band returns
 *    a pair of NUMBERS (`a_verify_count_slip_v1` gives `{n, n ± 1}`,
 *    `a_verify_countback_slip_v1` gives `{a − b, a − b + 1}`,
 *    `a_verify_teen_write_v1` reverses digits), so none of them can express it,
 *    and forcing one to would mean inventing operands with no referent in the
 *    picture — the §E2.12 fabrication-with-extra-steps class.
 *
 *    It is not needed because nothing is invented either way. The puppet's
 *    answer is READ OFF THE DRAWN TRIO by code (`trio.big`), exactly as a11's
 *    Pip alternates from the last thing on the strip; and the TRUTH — the only
 *    half a wrong key could corrupt — is recomputed by the registered
 *    `a_pick_extreme_v1`, which re-finds the largest count independently of
 *    anything this file believes. QG-11 checks the keyed option against it at
 *    every seed. What is lost is the D8 half of the audit (the prompt is not
 *    checked for a recomputed misconception value) because there is no
 *    misconception VALUE; what is gained is the recipe's own slip on the page
 *    instead of a borrowed one.
 *
 * 4. **THE PUPPET PAGE HAS A 50% FLOOR AND THAT IS THE FORM'S CEILING, not a
 *    defect that went unnoticed.** On any error-analysis item the puppet is
 *    never right, so a child who has learnt that eliminates one option for free.
 *    Three options therefore floor at a coin flip, which is what a01 and a12
 *    both measured and argued; the only way past it is to let the puppet
 *    sometimes be correct, and then it is not error analysis. Two things push
 *    against it. The page is three-way rather than two-way, which is the whole
 *    difference between a 50% floor and a free answer - a two-option "which is
 *    heavier" page with the puppet's pick named in the prompt is scored 100% by
 *    elimination alone, so that page is not in this week. And the remaining two
 *    options are the middling and the smallest thing, drawn so the truth is each
 *    of them about half the time: measured over 2,000 packs across the three
 *    puppet slots, "the smallest thing" wins 49.9-52.4% and "the middling thing"
 *    47.6-50.1%, so "the little one is the secret heavy one" is worth exactly a
 *    coin as well. "Tap whatever is named first" wins 31.7-33.6%.
 *
 * 5. **THE PUPPET'S PICK CAN NEVER BE RIGHT, AND THE REST OF THE WEEK IS WHAT
 *    STOPS THAT BECOMING A NEW FALSE RULE.** Because the puppet reasons from
 *    size and error analysis requires him to be wrong, the biggest thing is
 *    never the answer on his page. Read alone, that page teaches the mirror
 *    falsehood — "the big one never wins" — which is as wrong as the belief the
 *    week attacks and is the L43 shape (a rule stated as one instance invites
 *    its mirror). So it is measured on every OTHER page, where the honest target
 *    is not 50% but whatever chance is worth on that page. Measured over 2,000
 *    packs: on the two-option pairs "tap the bigger one" wins 48.9-51.6% against
 *    a 50% floor; on the three-way weighing form 33.0-34.3% against 33.3%; on the
 *    pouring pages "tap the taller one" wins 36.6-39.6%, ABOVE 33.3% rather than
 *    below it. So the mirror rule is worth nothing anywhere except on the
 *    puppet's own page, and that page is 3 of the 15 slots that carry choices.
 *    Aggregated over all 26,000 comparison draws the bigger or taller thing is
 *    correct 31.2% of the time against a chance-weighted 37.2%, and 42.1% with
 *    the puppet's pages left out - the whole of the gap is his, and it is what
 *    error analysis costs. The pair pool carries three big-and-heavy entries
 *    against three big-and-light ones, which is what holds the pair pages at
 *    their floor.
 *
 * 6. **THE MASTERY SET WAS BUDGETED FOR ANSWER-SPACE WIDTH BEFORE ANY DAY WAS
 *    WRITTEN**, because this week's natural forms are narrow: a "which is
 *    heavier" question has exactly two answers, and a unit count runs 2–9. That
 *    is the shape that manufactures a dead option or a fixed rank in a slot that
 *    CERTIFIES a child (a11 lost a round to it; a12 budgeted around it), so:
 *
 *    - **Half the mastery set is answered by typing a number.** Slots 01, 03 and
 *      05 offer nothing to choose between — count the blocks, count the cups,
 *      count the blocks a story heaped up — so there is no rank to sit at and no
 *      option to strike out. That is not dodging the gate: producing the measurement is the
 *      week's own computational skill, and the recipe's noncomputationalFocus
 *      ("predict-then-check") only means anything if the check is a real count.
 *    - **The other three are all THREE-option**, and the plain two-way
 *      "which is heavier" page — the recipe's core form — teaches on Days 1–3
 *      and certifies nothing. This is a11's disclosure-8 split, for the same
 *      reason: a two-option page is a coin flip for a child who knows nothing,
 *      and a mastery slot is where a child is promoted.
 *    - **Measured across 2,000 packs and all 15 choice slots**: not one option
 *      is offered on half the draws while never being keyed (the worst is a
 *      thing-name at 26.4%, and it is a name rather than a strategy); the key
 *      never sits at a fixed position (30.9-35.1% at each of three, 49.1-50.9%
 *      at each of two); the keyed option is the Nth thing named in the prompt
 *      31.1-35.5% of the time on the three-way pages and 48.8-51.3% on the
 *      two-way ones; and no blind habit beats its own page's chance floor by
 *      more than eight points. The weighing free-entry slots serve every value
 *      2-9 on 10.6-14.5% of draws and the pouring ones on 7.2-16.6% - less flat,
 *      and the price of disclosure 10: a container's capacity is the pack's
 *      property now rather than a fresh draw per page, so its distribution
 *      follows the pouring schedule instead of being uniform. No value is ever
 *      dead and no slot has a modal answer above 16.6%, so the trade is worth
 *      it.
 *
 * 7. **`a_compare_sets_v1` CARRIES THE "LIGHTER" AND "HOLDS LESS" QUESTIONS, and
 *    the reuse is recorded rather than buried.** `a_compare_measure_v1` returns
 *    `a > b ? thingA : thingB` — the heavier one, always — so it cannot key a
 *    "which is lighter?" page, and it returns `thingB` on a tie rather than
 *    naming the tie. `a_compare_sets_v1` does both: it takes `{a, b, nounA,
 *    nounB, which}` and computes "of two counts, name the noun with more or
 *    with fewer, or say they are the same". That is exactly what comparing two
 *    unit measurements is; the id names sets because sets are where the family
 *    first needed it. Reusing a registered transform for a structurally
 *    identical claim is the corpus's own convention (a11 ran four different
 *    questions through `a_numeral_for_set_v1`; a12 ran its count-on slip through
 *    the count-back template), and the alternative — keying a lighter-than or a
 *    tie by hand — is the D6 class the registry exists to make impossible. An
 *    `a_compare_units_v1` alias would document it better; noted for the
 *    orchestrator.
 *
 * 8. **Eight thin local generators, and why each is not in the family.**
 *    `unitCount` (the family measures nothing on its own — `compareMeasure`
 *    always compares two things, and "how many blocks balance this?" is the act
 *    the comparing is built out of), `weighPair` and `holdsMore` (the fixed
 *    library draw of disclosure 2, and no family generator offers a tie or a
 *    "holds less" polarity), `heaviestOfThree` and `puppetPicksBiggest` (the
 *    family's `pickExtreme` ranks drawn SETS of countable things by their own
 *    size, not three objects by a measurement taken of them, and `PuppetSlip` is
 *    a closed union of 'double-count' | 'skip-count' | 'count-back-start' |
 *    'teen-writing' with no size slip in it), the two Day-4 story forms
 *    (`weighStory`, `fillStory` — the family has no story generator at all) and
 *    `sortByWeight` (`sortAndTell` sorts groups by their own count, which is a
 *    different act from sorting objects by a measurement). None departs from how
 *    the family builds an item — each names a templateId the registry resolves,
 *    draws its picture through `lib/figures`, renders every quantity through
 *    `lib/format` and stamps its `authorMeta`. Recorded for the orchestrator.
 *
 * 9. **The Day-5 sort ships OPEN, and the puzzle carries no `asserts`.**
 *    FILL-ARCHITECTURE §7 lists A20 by name among the A-band oral Day-5s: the
 *    computable core is the predict-then-count page, and the "tell how you know"
 *    is the flagged part. `sortByWeight` therefore validates `manual-review`
 *    behind `a_sort_and_tell_v1`, which registers no `answerFor` — the order is
 *    checkable by an adult with the page in front of them, and the telling is
 *    not checkable at all. It is also the item that satisfies the §6.12
 *    dual-strand coupling gate. Separately, the puzzle's answer is "how many
 *    rows are longer than the first one", and `figureValue` for a `counters`
 *    figure offers `count`, `group:k` and `remaining` — none of them is that
 *    quantity, so pointing the assertion anywhere would make QG-13 report a
 *    contradiction between a truthful picture and a correct answer. It is left
 *    off rather than aimed somewhere it does not belong; what guarantees the
 *    pair instead is that the answer is recounted from the same drawn array the
 *    picture is built from. The missing selector (a "groups above a threshold"
 *    counters quantity) is recorded.
 *
 * 10. **EVERY BALANCE CLAIM IN THIS FILE IS A PER-PACK DEAL, because a marginal
 *    is not what a child meets — and this one was learned the expensive way.**
 *    The first build of A20 balanced its pools and MEASURED the balance across
 *    thousands of packs, which is what the kit asks for and what the earlier
 *    report showed. An independent reader then read two packs end to end and
 *    found all three of the things a marginal cannot see: the taller container
 *    genuinely held more on six of the eight scored pouring pages it could see;
 *    the biggest object was never the heaviest on any of the twelve three-way
 *    pages; and the same sock balanced 4 blocks, then 2, then 3 on consecutive
 *    days. Every one of those was consistent with a healthy average, and the
 *    header claimed the averages as if they were guarantees.
 *
 *    So the balances are now DEALT before the pages are built, out of the pack's
 *    own `TupleGuard`, and each is measured as a per-pack property over 500
 *    packs rather than as a rate over draws:
 *      · one count per named thing, for the whole pack — 0 of 500 packs carry a
 *        thing with two different counts (was 29 of 200 before the registry);
 *      · the three three-way pages take the biggest, middling and smallest
 *        object as their answer, one each — 500 of 500;
 *      · the four pouring pages take the four container pairs, one each, dealt
 *        so the taller really holds more on one or two of them and never on
 *        three or four, with exactly one genuine tie — 500 of 500, 500 of 500
 *        and 500 of 500;
 *      · the three pair pages are dealt one big-and-heavy, one big-and-light and
 *        one either way.
 *
 *    TWO THINGS THAT ONLY SHOWED UP ONCE THE DEALS EXISTED, both recorded
 *    because they are the reason a schedule is harder than it looks. A schedule
 *    must be consumed ONCE PER ITEM, not once per attempt: `drawUniqueItem`
 *    rebuilds an item whose surface collides, and `makeWeekBuilder` rebuilds one
 *    that echoes a guided example or duplicates a Form-A core — so a naive
 *    schedule spends the next page's slot on a rebuild. Every schedule here is
 *    therefore taken outside the retry loop, the guided-example surfaces are
 *    reserved so that rebuild never fires, and the puppet's params carry what he
 *    picked so his page can never be mistaken for the plain three-way page. Each
 *    of those was found by measuring the schedule itself — 17 packs in 400 were
 *    asking for a fourth size before the last of them was fixed.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { drawFresh, makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  countArrangement,
  partnerBox,
  pickExtreme,
  teenExtra,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsParam, counterGroups, counters } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn fresh per item; never hardcode a name that is also in this pool (kit §F.3). */
const NAMES = ['Anya', 'Rafi', 'Sena', 'Milo', 'Ines', 'Kofi', 'Dara', 'Bram'] as const;
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Ten words, counted the way the GATE counts them
//
// Two ceilings exist and they are not the same ceiling. `earlynumber`'s `ask()`
// weighs a whole prompt string, so a three-sentence puppet page trips a limit it
// never actually breaks — and no ceiling of any kind reaches a hint rung or a
// guided-example step. What `bb-readability-test` weighs is one SENTENCE at a
// time on every surface a child hears, and that is the measurement this file has
// to satisfy. Its splitter and its word counter are mirrored here and every
// authored string is pushed through them, so an eleventh word throws at module
// load rather than waiting for a reviewer to count.
//
// Alt text does not come through here. It is the whole of what a screen-reader
// child has instead of the picture, and this week's pictures are rows of units
// that belong to named things: shortening them means dropping either the row or
// the thing it was measured from, and the pairing of the two is the item.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A20: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** The scene rides in a bracket; only the question after it is a sentence with a ceiling. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Rungs, each pushed through the ceiling. Nothing here names a child or a quantity. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Swap in help written for THIS week, without reaching into `lib/`.
 *
 * A hint ladder may appear at most twice across the fourteen non-retrieval core
 * items, which puts a floor of seven distinct ladders under the week and made
 * the ladder count a design input rather than an afterthought (kit §E "A-band
 * lessons", item 1); eleven are shipped. That is only the arithmetic reason. The
 * pedagogical one is that the help genuinely wants to differ: a heap of blocks
 * wants "choose where to start", a line of cups wants "one at a time", and a
 * comparison wants "stop looking and start counting" — none of which the shared
 * family could say without saying it in all 24 A weeks at once, which is exactly
 * the sameness `bb-cross-week-test` reads the corpus to find.
 *
 * The closure rewrites one field of a draft that has already been built, and
 * draws nothing itself, so the prompt QG-1 and QG-4 sign for freshness is
 * untouched.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Bring an earlier week's own item back, flagged as today's warm-up.
 *
 * Band A sets no minimum on warm-up formats, so nothing obliges these to exist
 * and each has to be worth the minute it takes. What decided the five is what a
 * measurement actually rests on: a count of a unit laid against a thing, and a
 * comparison of two such counts. Take away reliable counting of a laid-out group
 * and the block row means nothing; take away one-to-one matching and "more"
 * collapses back into "longer", which is the very confusion this week runs on;
 * take away ranking three groups and the three-way weighing page is
 * unapproachable. The other two are the number sense underneath: a part read off
 * a stated whole, and ten-and-some-more.
 *
 * Their help arrives untouched from the week that wrote it, and on purpose. A
 * warm-up is supposed to sound like where it came from, and re-voicing it into
 * this week's register would quietly remove the thing that makes it retrieval.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The things this week weighs and fills, and the PACK REGISTRY that fixes
// what each of them weighs
// ===========================================================================

/**
 * ONE COUNT PER NAMED THING, FOR THE WHOLE PACK — and it is enforced, not hoped
 * for.
 *
 * The first build of this week drew every page's counts independently. Every
 * page was internally honest and every ordering it asserted was physically
 * right, so nothing caught what an independent reader caught immediately: the
 * SAME sock balanced 4 blocks on one page, 2 on the next and 3 on the one after,
 * and the same kite weighed 3 blocks in Form B slot 02 and 5 in slot 06 of the
 * same sitting. Measured afterwards over 200 packs, 14.5% of packs carried at
 * least one object with two different counts. In the week whose whole claim is
 * that COUNTING SETTLES IT, a count that changes page to page is the most
 * corrosive thing on offer, and the header note that said it could not happen
 * was aspirational rather than true.
 *
 * The fix is a registry keyed on the pack's own `TupleGuard` — the one object
 * every generator in a pack shares. The first time a thing is drawn its count is
 * chosen and written down; every later appearance reads it back. Lookups consume
 * no rng, so nothing about draw order changes what a later page shows.
 *
 * WHY THAT IS SAFE FOR THE ORDERINGS. A registry alone would deadlock: two
 * objects already written down with the wrong relative counts could not then be
 * compared. So each named object also carries a WEIGHT BAND, and the bands are
 * disjoint count ranges. The constraint poset this week declares — six pairs and
 * six trios — has height three (no chain of four), so three bands are enough,
 * and every declared structure spans three distinct bands in the right order.
 * A count drawn inside a band therefore cannot contradict any comparison the
 * week can pose, whatever order the pages happen to be built in.
 */
type Band = 'H' | 'M' | 'L';

/** Disjoint by construction: any H beats any M, and any M beats any L. */
const BAND_RANGE: Record<Band, readonly [number, number]> = { L: [2, 4], M: [5, 6], H: [7, 9] };

/**
 * Every object this week compares, with the band its weight sits in.
 *
 * Assigned by hand from the declared pairs and trios below and checked against
 * all twelve: `stone > sponge > balloon` reads H > M > L, `brick > pillow` reads
 * H > M, and so on. Two objects sharing a band never appear in the same
 * structure, which is why they may share a count without asserting anything.
 */
const WEIGHT_BAND: Record<string, Band> = {
  stone: 'H', brick: 'H', book: 'H', shoe: 'H', log: 'H', suitcase: 'H',
  sponge: 'M', cushion: 'M', key: 'M', scarf: 'M', melon: 'M', jar: 'M', pillow: 'M',
  balloon: 'L', kite: 'L', 'paper bag': 'L', sock: 'L', acorn: 'L', button: 'L', grape: 'L', leaf: 'L',
};

/**
 * Read a number out of the pack registry, or compute it once and store it.
 *
 * The guard is a set of strings, so a stored number is probed for rather than
 * fetched. Deliberate: it means the registry needs no new shared machinery and
 * no `lib/` file changes, and a probe is free of rng.
 */
function packNumber(guard: TupleGuard, key: string, make: () => number): number {
  for (let v = 2; v <= 9; v++) if (guard.taken(`${key}=${String(v)}`)) return v;
  const v = make();
  guard.add(`${key}=${String(v)}`);
  return v;
}

/**
 * The two guided examples that print a pair of numbers, reserved before either
 * strand deals its pages.
 *
 * `makeWeekBuilder` REDRAWS any day item whose numeric tokens match a guided
 * example's, so a page that happens to print the modeled example's numbers is
 * silently rebuilt — and a rebuild re-enters the generator, which would spend
 * the next page's slot in a pre-dealt schedule. Reserving the two surfaces here
 * means the deal simply never produces them, so the redraw never fires and the
 * schedules stay exact. (It is also what stopped the first build's guided
 * examples from biasing a blind habit by four points; the same mechanism, met
 * from the other side.)
 */
function reserveGuidedExampleSurfaces(guard: TupleGuard): void {
  guard.add('classification|2,4'); // GE-01: the balloon and the stone
  guard.add('classification|5,9'); // GE-02: the tall vase and the wide tin
  // GE-04's three numbers. Reserved as a SORTED signature, which is what
  // `drawUniqueItem` matches on, so any trio whose counts are that multiset is
  // refused inside the freshness loop — where a redraw costs nothing — instead
  // of reaching the assembler's echo check, where a rebuild would re-enter the
  // generator and spend the next page's scheduled size.
  guard.add('classification|2,4,8');
}

/** True once per pack for a given key — the "has this already been set up?" test. */
function firstTime(guard: TupleGuard, key: string): boolean {
  if (guard.taken(key)) return false;
  guard.add(key);
  return true;
}

/**
 * How many blocks this named object balances, fixed for the whole pack.
 *
 * A band value that no other object in the same band has taken yet is preferred,
 * which costs nothing (a band's objects never share a page, so they may share a
 * count) and buys a great deal: two different trios are then far less likely to
 * print the same three numbers, which is what the pack-wide freshness guard has
 * to redraw around. Bands hold two or three values against six or eight objects,
 * so this runs out and falls back to a plain draw — deliberately, because
 * exhausting it must not change what the object weighs.
 */
function claimBandValue(guard: TupleGuard, band: Band, r: Rng): number {
  const [lo, hi] = BAND_RANGE[band];
  const free: number[] = [];
  for (let v = lo; v <= hi; v++) if (!guard.taken(`a20:band:${band}:${String(v)}`)) free.push(v);
  const v = free.length > 0 ? r.pick(free) : r.int(lo, hi);
  guard.add(`a20:band:${band}:${String(v)}`);
  return v;
}

function blocksOf(r: Rng, guard: TupleGuard, name: string): number {
  const band = WEIGHT_BAND[name];
  return packNumber(guard, `a20:w:${name}`, () => claimBandValue(guard, band, r));
}

/**
 * SIZE AND WEIGHT ARE DECLARED SEPARATELY, and the pool is balanced on purpose.
 *
 * `big` is the thing a four-year-old would point at as the bigger one; `heavier`
 * says which of the two actually is. Three entries make the big one heavier and
 * three make it lighter. Every weight here is a fact a child of four already
 * owns — nobody has to be told that a pillow is lighter than a brick — which is
 * what makes the surprise land rather than merely being asserted by the numbers.
 */
interface Pair {
  big: string;
  small: string;
  heavier: 'big' | 'small';
}

const WEIGHT_PAIRS: readonly Pair[] = [
  { big: 'balloon', small: 'stone', heavier: 'small' },
  { big: 'pillow', small: 'brick', heavier: 'small' },
  { big: 'kite', small: 'shoe', heavier: 'small' },
  { big: 'melon', small: 'grape', heavier: 'big' },
  { big: 'log', small: 'leaf', heavier: 'big' },
  { big: 'suitcase', small: 'sock', heavier: 'big' },
];

/**
 * WHICH WAY EACH PAIR PAGE FALLS IS SCHEDULED PER PACK, not left to the marginal.
 *
 * Three pair pages are served to a child, and a pool that is balanced ACROSS
 * packs still hands one child in eight three pages that all point the same way.
 * The schedule fixes one page to a big-and-heavy pair, one to a big-and-light
 * pair, and draws the third — so "just pick the bigger one" is right on one or
 * two of the three in EVERY pack, never on none and never on all.
 */
function weighPairSetup(r: Rng, guard: TupleGuard): void {
  if (!firstTime(guard, 'a20:pairsched')) return;
  reserveGuidedExampleSurfaces(guard);
  const sides = r.shuffle(['big', 'small', r.chance(0.5) ? 'big' : 'small']);
  const usedPairs = new Set<string>();
  sides.forEach((side, slot) => {
    const open = WEIGHT_PAIRS.filter((p) => p.heavier === side && !usedPairs.has(p.big));
    const pair = r.pick(open.length > 0 ? open : WEIGHT_PAIRS.filter((p) => p.heavier === side));
    usedPairs.add(pair.big);
    const heavy = pair.heavier === 'big' ? pair.big : pair.small;
    const light = pair.heavier === 'big' ? pair.small : pair.big;
    const [hLo, hHi] = BAND_RANGE[WEIGHT_BAND[heavy]];
    const [lLo, lHi] = BAND_RANGE[WEIGHT_BAND[light]];
    // Counts inside each object's band, stepped deterministically until this
    // page's pair of numbers is one no other page in the pack has taken. The
    // step never leaves the band, so the ordering the objects declare survives
    // it; a bounded walk, never a redraw loop (kit §E2.4).
    let hv = claimBandValue(guard, WEIGHT_BAND[heavy], r);
    let lv = claimBandValue(guard, WEIGHT_BAND[light], r);
    const span = (hHi - hLo + 1) * (lHi - lLo + 1);
    for (let k = 0; k < span; k++) {
      if (!guard.taken(`classification|${[String(hv), String(lv)].sort().join(',')}`)) break;
      lv = lv === lHi ? lLo : lv + 1;
      if (k % (lHi - lLo + 1) === lHi - lLo) hv = hv === hHi ? hLo : hv + 1;
    }
    guard.add(`a20:w:${heavy}=${String(hv)}`);
    guard.add(`a20:w:${light}=${String(lv)}`);
    guard.add(`classification|${[String(hv), String(lv)].sort().join(',')}`);
    guard.add(`a20:pairslot:${String(slot)}=${pair.big}`);
  });
}

/** The pair this page shows — one slot of the schedule, by turn, wrapping. */
function nextWeighPair(guard: TupleGuard): Pair {
  for (let turn = 0; ; turn++) {
    if (guard.taken(`a20:pairturn:${String(turn)}`)) continue;
    guard.add(`a20:pairturn:${String(turn)}`);
    const slot = turn % 3;
    const named = WEIGHT_PAIRS.find((p) => guard.taken(`a20:pairslot:${String(slot)}=${p.big}`));
    if (named) return named;
    return WEIGHT_PAIRS[slot];
  }
}

/**
 * Three things whose sizes a child can rank at a glance, LISTED HEAVIEST FIRST.
 *
 * THE WHOLE ORDER IS DECLARED, not just the winner. An earlier build declared
 * only which of the three was heaviest and let the other two counts fall where
 * the draw put them — so a page could print "the acorn balances 6 blocks, the
 * melon balances 3", which is not a surprise, it is a falsehood. The bands above
 * now carry the ordering, so every ordering a page asserts is one a grown-up
 * would agree with, and the independent reader confirmed the physics.
 *
 * The heaviest is the biggest thing in two entries, the middling one in two and
 * the smallest in two — and `heaviestSize` below turns that pool property into a
 * per-pack guarantee.
 */
interface Weighable {
  name: string;
  size: 'big' | 'mid' | 'small';
}

const WEIGHT_TRIOS: ReadonlyArray<readonly [Weighable, Weighable, Weighable]> = [
  [{ name: 'stone', size: 'small' }, { name: 'sponge', size: 'mid' }, { name: 'balloon', size: 'big' }],
  [{ name: 'brick', size: 'small' }, { name: 'cushion', size: 'mid' }, { name: 'kite', size: 'big' }],
  [{ name: 'book', size: 'mid' }, { name: 'key', size: 'small' }, { name: 'paper bag', size: 'big' }],
  [{ name: 'shoe', size: 'mid' }, { name: 'scarf', size: 'big' }, { name: 'sock', size: 'small' }],
  [{ name: 'log', size: 'big' }, { name: 'melon', size: 'mid' }, { name: 'acorn', size: 'small' }],
  [{ name: 'suitcase', size: 'big' }, { name: 'jar', size: 'mid' }, { name: 'button', size: 'small' }],
];

/**
 * THE THIRDS ARE ENFORCED PER PACK, because a marginal third is not what a child
 * meets.
 *
 * A pool in which the biggest thing is heaviest on a third of draws still gives
 * 29.6% of children three three-way pages in a row where it never is — and an
 * independent reader drew exactly that, twice, and was right to call it. The
 * three non-puppet three-way pages now take one size each: one keyed on the
 * biggest object, one on the middling one, one on the smallest. So the isomorph
 * note's claim of thirds is true of every pack rather than of the average.
 *
 * THE PUPPET'S PAGES ARE EXEMPT AND STAY EXEMPT. He reasons from size and error
 * analysis requires him to be mistaken, so the biggest thing can never be the
 * answer there — that is the form, not a defect, and it is declared here rather
 * than left for a reader to rediscover.
 */
function heaviestSize(r: Rng, guard: TupleGuard): 'big' | 'mid' | 'small' {
  const sizes = ['big', 'mid', 'small'] as const;
  if (firstTime(guard, 'a20:h3sched')) {
    r.shuffle([...sizes]).forEach((sz, i) => guard.add(`a20:h3order:${String(i)}=${sz}`));
  }
  for (let turn = 0; ; turn++) {
    if (guard.taken(`a20:h3turn:${String(turn)}`)) continue;
    guard.add(`a20:h3turn:${String(turn)}`);
    const slot = turn % sizes.length;
    return sizes.find((sz) => guard.taken(`a20:h3order:${String(slot)}=${sz}`)) ?? sizes[slot];
  }
}

/**
 * CAPACITY RUNS THE SAME TRAP ON HEIGHT, which is where it actually bites at
 * this age: a tall narrow shape reads as "more" long before a wide one does.
 *
 * Unlike weight, which of the two holds more is genuinely free — a tall bottle
 * may hold more or less than a wide dish, and neither is a fact anyone has to
 * know — so this is the strand where a TIE is honest. Each pair is disjoint from
 * the others, which is what lets the whole strand be scheduled in one go.
 *
 * None of these containers is in `compareMeasure`'s own capacity pool
 * (jug/mug, pot/cup, bucket/bowl), so a week that later serves the family
 * generator does not collide with this one.
 */
const CAPACITY_PAIRS: ReadonlyArray<{ tall: string; wide: string }> = [
  { tall: 'tall bottle', wide: 'wide dish' },
  { tall: 'tall vase', wide: 'wide tin' },
  { tall: 'tall glass', wide: 'wide pan' },
  { tall: 'tall carton', wide: 'wide tub' },
];

/**
 * THE WHOLE POURING STRAND IS DEALT IN ONE GO, once per pack.
 *
 * Drawing each page's outcome independently left the taller container genuinely
 * holding more on six of eight scored pages across two sampled packs — a page
 * that rewards the exact belief the strand exists to remove, and the same class
 * of defect this file refused to inherit from `compareMeasure`. The mistakeBank
 * claimed the opposite in writing.
 *
 * So the four pairs are dealt a schedule: one tie, one the tall one wins, one
 * the wide one wins, and one drawn. "The taller holds more" is therefore true on
 * one or two of the four pairs in EVERY pack — never three, never four — and a
 * tie is reachable on exactly one pair in every pack, so the third option is
 * live for every child rather than for some of them.
 *
 * Setting the counts here as well is what makes a container hold the same amount
 * everywhere in the pack, including on the measuring pages that never compare it
 * to anything.
 */
function capacitySetup(r: Rng, guard: TupleGuard): void {
  if (!firstTime(guard, 'a20:capsched')) return;
  reserveGuidedExampleSurfaces(guard);
  const outcomes = r.shuffle(['tall', 'wide', 'tie', r.chance(0.5) ? 'tall' : 'wide']);
  // The order the four pairs reach the child, drawn so the pouring pages are not
  // always the same containers on the same days.
  r.shuffle(CAPACITY_PAIRS.map((p) => p.tall)).forEach((t, i) => guard.add(`a20:caporder:${String(i)}=${t}`));
  // Three DISTINCT winning counts and three distinct losing ones, so the four
  // pages cannot land on the same pair of numbers as each other; the tie page
  // prints one number twice, which no decided page can.
  const his = r.shuffle([6, 7, 8, 9]).slice(0, 3);
  const los = r.shuffle([2, 3, 4, 5]).slice(0, 3);
  const tie = r.int(3, 8);
  let decided = 0;
  CAPACITY_PAIRS.forEach((pair, i) => {
    const outcome = outcomes[i];
    let hi = his[decided];
    let lo = los[decided];
    // The one decided pair a guided example could echo, stepped off it.
    if (hi === 9 && lo === 5) lo = 4;
    if (outcome !== 'tie') decided++;
    const tall = outcome === 'tie' ? tie : outcome === 'tall' ? hi : lo;
    const wide = outcome === 'tie' ? tie : outcome === 'tall' ? lo : hi;
    guard.add(`a20:c:${pair.tall}=${String(tall)}`);
    guard.add(`a20:c:${pair.wide}=${String(wide)}`);
    // RESERVE THE SURFACE, so no weighing page can later draw the same pair of
    // numbers. `drawUniqueItem` signs a two-number classification prompt on its
    // sorted tokens, and both strands are classification items — so without this
    // a pouring page and a weighing page could collide, and the pouring page
    // (whose counts are fixed by the pack) would have no way to move. Setting up
    // the whole strand before the first weighing comparison is drawn is what
    // makes both strands' surfaces disjoint by construction rather than by luck.
    guard.add(`classification|${[String(tall), String(wide)].sort().join(',')}`);
  });
}

/** How many cups this container fills, fixed for the whole pack. */
function cupsOf(r: Rng, guard: TupleGuard, name: string): number {
  capacitySetup(r, guard);
  for (let v = 2; v <= 9; v++) if (guard.taken(`a20:c:${name}=${String(v)}`)) return v;
  throw new Error(`A20: no capacity registered for "${name}"`);
}

/**
 * The four pouring pages take the four pairs, one each, in the pack's own order.
 *
 * A TURN COUNTER RATHER THAN A FREE LIST, because a schedule that hands out
 * "whatever is left" degrades badly if it is ever called a fifth time: the first
 * build did exactly that and served one pack the tie pair twice, once in each
 * mastery form, which QG-4 caught. Counting turns and wrapping means call five
 * gets the FIRST pair back rather than a repeat of call four, so two adjacent
 * pages can never coincide however the assembler decides to rebuild one.
 */
function nextCapacityPair(guard: TupleGuard): { tall: string; wide: string } {
  for (let turn = 0; ; turn++) {
    if (guard.taken(`a20:capturn:${String(turn)}`)) continue;
    guard.add(`a20:capturn:${String(turn)}`);
    const slot = turn % CAPACITY_PAIRS.length;
    const tall = CAPACITY_PAIRS.map((p) => p.tall).find((t) => guard.taken(`a20:caporder:${String(slot)}=${t}`));
    return CAPACITY_PAIRS.find((p) => p.tall === tall) ?? CAPACITY_PAIRS[slot];
  }
}

/**
 * Single things to weigh, when nothing is being compared to anything — and they
 * are all CONTAINERS on purpose.
 *
 * A measuring page wants a wide answer space, which means "the acorn balances 9
 * blocks" would be a legal draw if the pool held acorns. Nobody knows what is
 * inside a sack, so any count is honest and the child's own knowledge never
 * contradicts the page; the objects a child DOES have an opinion about live in
 * the comparison items, where the bands govern them. These eight are dealt a
 * PERMUTATION of 2–9 once per pack, so each holds a different count, each count
 * appears once, and the puzzle can rank four of them without any two tying.
 */
const WEIGH_ALONE = ['bag', 'backpack', 'basket', 'boot', 'purse', 'sack', 'lunchbox', 'toy box'] as const;

function containerBlocks(r: Rng, guard: TupleGuard, name: string): number {
  if (firstTime(guard, 'a20:contsched')) {
    const perm = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9]);
    WEIGH_ALONE.forEach((n, i) => guard.add(`a20:w:${n}=${String(perm[i])}`));
  }
  for (let v = 2; v <= 9; v++) if (guard.taken(`a20:w:${name}=${String(v)}`)) return v;
  throw new Error(`A20: no weight registered for "${name}"`);
}

/** Single containers to fill; the same eight the pouring pages compare. */
const FILL_ALONE = CAPACITY_PAIRS.flatMap((p) => [p.tall, p.wide]);

// ---------------------------------------------------------------------------
// The spoken scenes
//
// `lib/earlynumber.ts` sets the law: an alt says what a picture LOOKS like and
// never the quantity the item wants. At this band the alt is not a fallback —
// every screen plays `speakablePrompt(prompt, figure.alt)` aloud and the alt
// beats the bracket, so it is the first thing a four-year-old receives.
//
// The pressure in THIS week is not the answer, it is the data. Both counts read
// aloud ARE the comparison, which is why `compareMeasure`'s shipped alt names
// the two things and the unit and stops there. So do these. What they add is the
// ORDER: the alt lists the rows in the order the picture draws them, because a
// pre-reader cannot read the labels and the spoken list is the only way to know
// which row belongs to which thing.
//
// THEY ARE ALSO SHORT, and that is a band law rather than a preference. These
// were the longest alts in Level A at 13–17 words, and an alt is the first thing
// a four-year-old HEARS, before the question — so it is held to the same ten
// words the question is, with the worst case measured rather than assumed (10
// words, four rows of two-word container names). The generous alt-length
// allowance in `bb-readability-test` exists for rich pictures a screen-reader
// child cannot otherwise get at; a row of counters is not one of those.
//
// The `[image: …]` bracket keeps its numbers. It is never displayed and never
// spoken, and it is what QG-1 and QG-4 sign to keep operand surfaces fresh.
// ---------------------------------------------------------------------------

/**
 * "blocks: the balloon row, then the stone row" — the unit, the order, and no
 * count anywhere.
 *
 * A NUMBER WORD IN AN ALT IS A NUMBER (`bb-spoken-answer-test` G3, and the reason
 * `ARRANGEMENT_ALT` exists in `lib/earlynumber.ts`). An earlier draft read "one
 * for the key and one for the paper bag", and the puzzle's read "then one each";
 * running the gate's own rules over this week found the puzzle speaking its own
 * answer of 1 on 23 distinct pages. No alt in this file now contains a number
 * word of any kind.
 */
function rowAlt(unit: 'blocks' | 'cups', names: readonly string[]): string {
  if (names.length === 2) return `${unit}: the ${names[0]} row, then the ${names[1]} row`;
  const last = names[names.length - 1];
  return `${unit}: the ${names.slice(0, -1).join(', ')} and ${last} rows`;
}

// ===========================================================================
// Local generator 1 — measure one thing against the unit
// ===========================================================================

/**
 * How many blocks balance it; how many cups fill it. One thing, one row of
 * units, nothing to compare.
 *
 * This is the act every other item in the week is built out of, and the family
 * has no generator for it: `compareMeasure` always weighs two things against
 * each other, which is the second lesson rather than the first. A child who
 * cannot say what a thing weighs cannot argue about which of two is heavier, so
 * this runs on Days 1 and 2 before any comparison is certified, and it is what
 * three of the six mastery slots certify (disclosure 6).
 *
 * FRESHNESS ON THE THING, NOT ON THE COUNT. `drawUniqueItem` signs a one-token
 * prompt as `<type>|1tok|<n>`, and this week draws seven weight measurements out
 * of a range of eight values — the a01 failure exactly, where the guard emptied
 * the pool before the mastery slots drew and pinned one of them to a single
 * answer. So the guard is moved off the number entirely: every item that
 * measures something registers `thing:<attr>:<name>` in ONE namespace shared
 * with the Day-4 stories, so a pack never weighs the same object twice and never
 * fills the same container twice (seven weight items against eight things, five
 * capacity items against eight containers — both fit, which is why mastery slot 05
 * is the weighing story rather than the pouring one). The count is then drawn
 * freely and stays uniform: measured over 2,000 packs, every value 2–9 is
 * keyed on 10.8–14.0% of draws in every slot (and every value 3–9 on 12.3–16.3%
 * in the two story slots, whose range starts a step higher), and the prompt is distinct by construction because the
 * thing's name is in it.
 *
 * Reading a generated week is what produced this. The first version signed on
 * {count, thing} and served "How many cups fill the wide pan?" beside "Ines
 * fills the wide pan with cups" in the SAME mastery form — legal at every gate,
 * and obviously repetitive to anyone reading the page.
 */
function unitCount(opts: { attr: 'weight' | 'capacity'; framing: 'plain' | 'predict' }): ItemGen {
  const { attr, framing } = opts;
  const unit = attr === 'weight' ? 'blocks' : 'cups';
  const pool: readonly string[] = attr === 'weight' ? WEIGH_ALONE : FILL_ALONE;
  return (rng, guard, difficulty) => {
    // The THING is drawn; its count is read out of the pack registry, so the
    // same sack weighs the same on every page it appears on.
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ thing: r.pick(pool), seed: r.uint() }),
      (v) => `thing:${attr}:${v.thing}`,
    );
    const { thing } = draw;
    const n = attr === 'weight' ? containerBlocks(rng, guard, thing) : cupsOf(rng, guard, thing);
    const scene =
      attr === 'weight'
        ? `${countNoun(n, unit)} balance the ${thing}`
        : `${countNoun(n, unit)} fill the ${thing}`;
    // Derived from `unit`, never spelled out twice: a 'predict' weighing page
    // would otherwise ask about cups, and no gate reads the noun in a question.
    const ask =
      attr === 'weight' ? `How many blocks balance the ${thing}?` : `How many cups fill the ${thing}?`;
    const question = framing === 'predict' ? `Guess first, then count. ${ask}` : ask;
    const draft: ItemDraft = {
      type: 'computation',
      prompt: scenePrompt(scene, question),
      // ASKS: how many units. So the alt names the unit and the thing it was
      // measured from, and never how many of them there are.
      figure: counters(n, unit, {
        arrangement: 'in a row',
        alt: attr === 'weight' ? `the blocks that balance the ${thing}` : `the cups that fill the ${thing}`,
        asserts: assertsAnswer,
      }),
      answer: {
        value: String(n),
        acceptableForms: [numberWords(n), countNoun(n, unit)],
        validation: 'exact-numeric',
        units: unit,
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_count_v1', params: { n, noun: unit, thing }, seed: draw.seed },
      hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
      errorTags: ['procedure-slip', 'task-comprehension'],
      authorMeta: {
        stepCount: 1,
        cognitiveOp: attr === 'weight' ? 'measure-in-blocks' : 'measure-in-cups',
      },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 2 — heavier, or lighter, of two
// ===========================================================================

/**
 * The recipe's core form, and the trap inside it.
 *
 * Two things, each with the row of blocks it balanced, and the question names a
 * direction. A child who reads the sizes and stops is right half the time and no
 * oftener, because the pool holds as many big-and-heavy pairs as big-and-light
 * ones — which is the only defence a two-option page has, and it is worth
 * stating that it IS a two-option page: guessing scores 50% here and this form
 * therefore teaches on Days 1–3 and certifies nothing (disclosure 6).
 *
 * WHICH THING IS NAMED FIRST IS DRAWN, independently of everything else, so
 * "tap whatever the audio says first" is worth a coin too (measured 50.2%). That
 * is the library defect of disclosure 2 designed out rather than inherited: the
 * shipped `compareMeasure` names the winner first on 73.0% of draws.
 *
 * TWO POLARITIES, TWO TEMPLATES, and the reason is disclosure 7.
 * `a_compare_measure_v1` returns the heavier thing by construction, so it keys
 * the "heavier" draws and cannot key the "lighter" ones; `a_compare_sets_v1`
 * takes a direction and does both. Each polarity is its own bound instance with
 * its own ladder, which is also how the ladder budget is spent.
 *
 * The distractor is the other thing, and its rationale names which of two real
 * errors it is: the child who chose by size, or the child who has over-learnt
 * this very week and now believes the small thing is always the secret heavy one.
 * Both are worth catching and the second is the one nobody warns you about.
 */
function weighPair(opts: { ask: 'heavier' | 'lighter' }): ItemGen {
  const { ask } = opts;
  return (rng, guard, difficulty) => {
    // WHICH WAY THIS PAGE FALLS COMES FROM THE PACK SCHEDULE, so a child never
    // meets three pair pages that all reward the same habit — one is drawn from
    // the big-and-heavy pairs, one from the big-and-light ones and one either
    // way, and the three pairs and their two numbers were settled together
    // before any of the pages was built. There is no freshness retry here for
    // the same reason the pouring pages have none: the counts are the pack's,
    // so a retry could not move the surface, and the setup made all three
    // surfaces distinct and reserved them instead.
    weighPairSetup(rng, guard);
    const pair = nextWeighPair(guard);
    return ((r: Rng) => {
      const heavyThing = pair.heavier === 'big' ? pair.big : pair.small;
      const lightThing = pair.heavier === 'big' ? pair.small : pair.big;
      // Naming order, drawn and independent of everything above.
      const bigFirst = r.chance(0.5);
      const thingA = bigFirst ? pair.big : pair.small;
      const thingB = bigFirst ? pair.small : pair.big;
      const a = blocksOf(r, guard, thingA);
      const b = blocksOf(r, guard, thingB);
      const winner = ask === 'heavier' ? heavyThing : lightThing;
      const loser = ask === 'heavier' ? lightThing : heavyThing;
      const loserIsBig = loser === pair.big;
      const rationale =
        ask === 'heavier'
          ? loserIsBig
            ? 'Chose the big one, because big looks heavy - the rows of blocks say otherwise.'
            : 'Over-corrected: small does not always mean heavy either. The blocks decide it.'
          : loserIsBig
            ? 'Answered the other question - that is the one the blocks make heavier.'
            : 'Assumed the little thing must be the light one, without counting.';
      const { choices, correctKey } = makeChoices(r, `the ${winner}`, [
        {
          text: `the ${loser}`,
          errorTag: (ask === 'heavier'
            ? 'concept-misconception'
            : loserIsBig
              ? 'task-comprehension'
              : 'concept-misconception') as ErrorTag,
          rationale,
        },
      ]);
      const scene = `the ${thingA} balances ${countNoun(a, 'blocks')}, the ${thingB} balances ${countNoun(b, 'blocks')}`;
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, `Which one is ${ask}?`),
        figure: counterGroups(
          [
            { count: a, noun: 'blocks', label: thingA },
            { count: b, noun: 'blocks', label: thingB },
          ],
          {
            relation: 'compare',
            alt: rowAlt('blocks', [thingA, thingB]),
            asserts: assertsParam('a', 'group:0'),
          },
        ),
        choices,
        answer: {
          value: correctKey,
          acceptableForms: [`the ${winner}`, winner],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator:
          ask === 'heavier'
            ? {
              templateId: 'a_compare_measure_v1',
              params: { a, b, attr: 'weight', thingA, thingB },
              seed: r.uint(),
            }
            : {
              templateId: 'a_compare_sets_v1',
              params: { a, b, nounA: thingA, nounB: thingB, which: 'fewer' },
              seed: r.uint(),
            },
        hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: `compare-weight-${ask}`, isDiscrimination: true },
      };
      return draft;
    })(rng);
  };
}

// ===========================================================================
// Local generator 3 — which container holds more, and the tie
// ===========================================================================

/**
 * The holds-more form, with height doing what size does on the weight pages.
 *
 * A tall narrow container reads as "more" to a child of four however wide the
 * other one is, so the two shapes are named in the scene and which of them
 * actually holds more is drawn — one row of cups each, counted. One draw in five
 * makes them equal, which is why "they hold the same" is a live answer rather
 * than a permanent decoy: EXACTLY ONE of a pack's four pouring pages is a tie,
 * dealt rather than drawn, so every child meets one - measured, it is keyed on
 * 23.9-26.6% of draws across the four slots and offered on all of them, well
 * clear of the rate at which `bb-answer-entropy-test` calls an option dead. It is
 * also the third of this band's comparison vocabulary that a two-option page has
 * nowhere to put.
 *
 * With the polarity drawn as well, "always tap the tall one" is worth 36.7-40.7%
 * on a page whose chance floor is 33.3%, "always tap whatever is named first"
 * 36.3-38.1%, and "always say they are the same" 23.9-26.6%.
 */
function holdsMore(): ItemGen {
  return (rng, guard, difficulty) => {
    // The four pouring pages take the four pairs, one each, and each pair's
    // outcome was dealt by `capacitySetup` before any of them was built - so
    // "the taller holds more" is true on one or two of the four in EVERY pack
    // and a tie lands on exactly one of them.
    //
    // NO FRESHNESS RETRY HERE, and that is the point rather than an omission.
    // A pair's two counts are fixed by the pack, so a retry could not change the
    // surface even if it wanted to; what keeps the four pages distinct is that
    // they take four different pairs whose count pairs were dealt distinct, and
    // `capacitySetup` reserved all four surfaces in the shared guard before any
    // weighing page drew. Both halves of QG-1 and QG-4 are therefore satisfied
    // by construction instead of by redrawing.
    const pair = nextCapacityPair(guard);
    return ((r: Rng) => {
      const tallN = cupsOf(r, guard, pair.tall);
      const wideN = cupsOf(r, guard, pair.wide);
      const tallFirst = r.chance(0.5);
      const thingA = tallFirst ? pair.tall : pair.wide;
      const thingB = tallFirst ? pair.wide : pair.tall;
      const a = tallFirst ? tallN : wideN;
      const b = tallFirst ? wideN : tallN;
      const askMore = r.chance(0.5);
      const SAME = 'they hold the same';
      const winner =
        tallN === wideN ? SAME : askMore ? (tallN > wideN ? pair.tall : pair.wide) : tallN < wideN ? pair.tall : pair.wide;
      const shapeWrong = (thing: string) => ({
        text: `the ${thing}`,
        errorTag: (thing === pair.tall ? 'concept-misconception' : 'representation-misread') as ErrorTag,
        rationale:
          thing === pair.tall
            ? 'Judged by height - a tall narrow shape looks like it holds more.'
            : 'Judged by width instead of counting the cups poured in.',
      });
      const tieWrong = {
        text: SAME,
        errorTag: 'task-comprehension' as ErrorTag,
        rationale: 'Called it a tie without counting either row of cups.',
      };
      const { choices, correctKey } =
        winner === SAME
          ? makeChoices(r, SAME, [shapeWrong(pair.tall), shapeWrong(pair.wide)])
          : makeChoices(r, `the ${winner}`, [
            shapeWrong(winner === pair.tall ? pair.wide : pair.tall),
            tieWrong,
          ]);
      const scene = `the ${thingA} fills ${countNoun(a, 'cups')}, the ${thingB} fills ${countNoun(b, 'cups')}`;
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, askMore ? 'Which one holds more?' : 'Which one holds less?'),
        figure: counterGroups(
          [
            { count: a, noun: 'cups', label: thingA },
            { count: b, noun: 'cups', label: thingB },
          ],
          {
            relation: 'compare',
            alt: rowAlt('cups', [thingA, thingB]),
            asserts: assertsParam('a', 'group:0'),
          },
        ),
        choices,
        answer: {
          value: correctKey,
          // "they are the same" is `a_compare_sets_v1`'s own word for a tie, so
          // it rides in the accepted list and QG-11 recomputes the tie rather
          // than trusting it.
          acceptableForms: winner === SAME ? [SAME, 'they are the same'] : [`the ${winner}`, winner],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_compare_sets_v1',
          params: { a, b, nounA: thingA, nounB: thingB, which: askMore ? 'more' : 'fewer' },
          seed: r.uint(),
        },
        hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'compare-capacity', isDiscrimination: true },
      };
      return draft;
    })(rng);
  };
}

// ===========================================================================
// Local generators 4 and 5 — three things, with and without the puppet
// ===========================================================================

/**
 * One trio, each member's count read out of the pack registry, and the display
 * order drawn afterwards.
 *
 * The counts are not drawn here at all any more: the trio is listed heaviest
 * first and its three members sit in three different weight bands, so whatever
 * the registry already holds for them - or draws for them now - is guaranteed to
 * come out in the trio's declared order. That is what makes a page's ordering
 * true of the objects AND consistent with every other page in the pack at the
 * same time.
 *
 * The DISPLAY order is shuffled independently, which is what keeps the answer
 * off a fixed place in the spoken list.
 */
function layOutTrio(r: Rng, guard: TupleGuard, trio: readonly [Weighable, Weighable, Weighable]) {
  const entries = trio.map((t) => ({ name: t.name, rank: t.size, count: blocksOf(r, guard, t.name) }));
  const shown = r.shuffle(entries);
  return { entries, shown, heaviest: entries[0], biggest: entries.find((e) => e.rank === 'big')! };
}

/** Why a wrong thing was picked, said in terms of the size a child can see. */
function sizeRationale(rank: 'big' | 'mid' | 'small'): { errorTag: ErrorTag; rationale: string } {
  if (rank === 'big') {
    return {
      errorTag: 'concept-misconception',
      rationale: 'The biggest thing, chosen by size - the rows of blocks name another winner.',
    };
  }
  if (rank === 'mid') {
    return {
      errorTag: 'procedure-slip',
      rationale: 'A middle guess, made before every row had been counted to the end.',
    };
  }
  return {
    errorTag: 'representation-misread',
    rationale: 'A little thing can be heavy, but this row of blocks is not the longest.',
  };
}

function trioScene(shown: ReadonlyArray<{ name: string; count: number }>): string {
  return shown.map((e) => `the ${e.name} balances ${countNoun(e.count, 'blocks')}`).join(', ');
}

function trioFigure(shown: ReadonlyArray<{ name: string; count: number }>) {
  return counterGroups(
    shown.map((e) => ({ count: e.count, noun: 'blocks', label: e.name })),
    {
      relation: 'compare',
      alt: rowAlt('blocks', shown.map((e) => e.name)),
      asserts: assertsParam('a', 'group:0'),
    },
  );
}

/**
 * Three things, three rows of blocks, and the heaviest is as often the biggest
 * thing as the middling one or the smallest.
 *
 * This is the form that CERTIFIES the week's discrimination (disclosure 6). It
 * is three-way rather than two-way, every option is keyed on about a third of
 * draws, and there is no rank to sit at because the options are names rather
 * than numbers. Measured over 2,000 packs across its three slots against a 33.3%
 * chance floor: "the biggest thing" wins 32.8-34.3%, "the middling one"
 * 31.9-35.1%, "the smallest one" 32.1-34.0% and "whatever is named first"
 * 31.8-35.3% - which is what it looks like when no habit is worth anything. What it asks is also strictly more than the pair form asks: a
 * pair can be settled by seeing which row runs further, while three rows have to
 * be counted and held.
 *
 * The truth is recomputed by the registered `a_pick_extreme_v1`, which re-finds
 * the largest count from the same array the picture is drawn from, so a keyed
 * option that is not the heaviest fails QG-11 rather than shipping.
 */
function heaviestOfThree(): ItemGen {
  return (rng, guard, difficulty) => {
    // ONE SIZE EACH, PER PACK. The three non-puppet three-way pages take the
    // big, the middling and the small heaviest between them, in a drawn order,
    // so the isomorph note's claim of thirds is true of the pack a child
    // actually receives rather than of the average over thousands. Taken once
    // per item so a freshness redraw swaps to the OTHER trio of the same size
    // rather than spending the next page's size.
    const want = heaviestSize(rng, guard);
    return drawUniqueItem(rng, guard, (r) => {
      const trio = r.pick(WEIGHT_TRIOS.filter((t) => t[0].size === want));
      const { shown, heaviest } = layOutTrio(r, guard, trio);
      const { choices, correctKey } = makeChoices(
        r,
        `the ${heaviest.name}`,
        shown
          .filter((e) => e.name !== heaviest.name)
          .map((e) => ({ text: `the ${e.name}`, ...sizeRationale(e.rank) })),
      );
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(trioScene(shown), 'Which one is heaviest?'),
        figure: trioFigure(shown),
        choices,
        answer: {
          value: correctKey,
          acceptableForms: [`the ${heaviest.name}`, heaviest.name],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_pick_extreme_v1',
          params: {
            a: shown[0].count,
            counts: shown.map((e) => e.count),
            nouns: shown.map((e) => e.name),
            which: 'biggest',
          },
          seed: r.uint(),
        },
        hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'heaviest-of-three', isDiscrimination: true },
      };
      return draft;
    });
  };
}

/**
 * A NAMED puppet answered from the sizes, which is the recipe's slip word for
 * word: "says the bigger one is heavier".
 *
 * Nothing is invented. The puppet's answer is the entry the drawn trio declares
 * physically biggest — so it is the named misconception applied by
 * code to this page's own objects (disclosure 3), and the truth beside it is
 * recomputed by the registered `a_pick_extreme_v1` from the counts the picture
 * is built from. The word "wrong" never appears; "Oh no!" and "picked" are the
 * band's form.
 *
 * ONLY THE TRIOS WHERE SIZE MISLEADS ARE DRAWN HERE, because an error-analysis
 * puppet has to be mistaken. That makes the biggest thing never the answer on
 * this page, which would be a new false rule if this page were the only one —
 * disclosure 5 measures the rate on every OTHER page instead, where it is at or
 * above chance. The two remaining options here are the middling and the smallest
 * thing, and the truth is each of them about half the time (measured 47.6-50.1%
 * and 49.9-52.4% over 2,000 packs).
 */
function puppetPicksBiggest(): ItemGen {
  const MISLEADING = WEIGHT_TRIOS.filter((t) => t[0].size !== 'big');
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const trio = r.pick(MISLEADING);
      const { shown, heaviest, biggest } = layOutTrio(r, guard, trio);
      const puppet = r.pick(PUPPETS);
      const { choices, correctKey } = makeChoices(
        r,
        `the ${heaviest.name}`,
        shown
          .filter((e) => e.name !== heaviest.name)
          .map((e) =>
            e.rank === 'big'
              ? {
                text: `the ${e.name}`,
                errorTag: 'concept-misconception' as ErrorTag,
                rationale: 'The puppet\'s answer: the biggest thing, picked by looking and not counting.',
              }
              : { text: `the ${e.name}`, ...sizeRationale(e.rank) },
          ),
      );
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(
          trioScene(shown),
          `Oh no! ${puppet} picked the ${biggest.name}, the biggest one. Which one is really heaviest?`,
        ),
        figure: trioFigure(shown),
        choices,
        answer: {
          value: correctKey,
          acceptableForms: [`the ${heaviest.name}`, heaviest.name],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_pick_extreme_v1',
          params: {
            a: shown[0].count,
            counts: shown.map((e) => e.count),
            nouns: shown.map((e) => e.name),
            which: 'biggest',
            // WHAT THE PUPPET SAID, recorded in the params rather than only in
            // the prompt. It is the misconception this page exists to show, so
            // the page is not reproducible from its params without it — and it
            // also keeps this item's identity distinct from the plain three-way
            // item, which shares the template. Without that, `makeWeekBuilder`'s
            // Form-B core-collision check could see the two as the same item and
            // rebuild one, which cost the size schedule a slot on 4% of packs
            // (measured) before it was found.
            puppetPicked: biggest.name,
          },
          seed: r.uint(),
        },
        hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — the Day-4 real-world measuring pictures
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: one pictured real-world move is
 * what a four-year-old's word problem IS, rather than a two-step with a step
 * taken out. The family carries no story generator, so both forms live here.
 *
 * What the story adds is a PERSON doing the measuring, and the units arrive the
 * way they really do — tipped into a pan in a heap, poured into a container one
 * at a time. The heap is the point of the weighing story: a jumbled pile is
 * harder to keep a place in than a line, which is the counting difficulty A1
 * built and this week borrows rather than re-teaches.
 */
function weighStory(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ thing: r.pick(WEIGH_ALONE), name: one(r), seed: r.uint() }),
      (v) => `thing:weight:${v.thing}`,
    );
    const { thing, name } = draw;
    const n = containerBlocks(rng, guard, thing);
    const draft: ItemDraft = {
      type: 'word-problem',
      prompt: scenePrompt(
        `${countNoun(n, 'blocks')} heaped up beside the ${thing}`,
        `${name} balances the ${thing} with blocks. How many blocks?`,
      ),
      figure: counters(n, 'blocks', {
        arrangement: 'scattered',
        alt: `a heap of the blocks that balanced the ${thing}`,
        asserts: assertsAnswer,
      }),
      answer: {
        value: String(n),
        acceptableForms: [numberWords(n), countNoun(n, 'blocks')],
        validation: 'exact-numeric',
        units: 'blocks',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_count_v1', params: { n, noun: 'blocks', thing }, seed: draw.seed },
      hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
      errorTags: ['procedure-slip', 'representation-misread'],
      authorMeta: { stepCount: 1, cognitiveOp: 'weigh-story', situationType: 'part-whole' },
    };
    return draft;
  };
}

function fillStory(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ thing: r.pick(FILL_ALONE), name: one(r), seed: r.uint() }),
      (v) => `thing:capacity:${v.thing}`,
    );
    const { thing, name } = draw;
    const n = cupsOf(rng, guard, thing);
    const draft: ItemDraft = {
      type: 'word-problem',
      prompt: scenePrompt(
        `${countNoun(n, 'cups')} poured into the ${thing}`,
        `${name} fills the ${thing} with cups. How many cups?`,
      ),
      figure: counters(n, 'cups', {
        arrangement: 'in a row',
        alt: `the cups poured into the ${thing}, lined up`,
        asserts: assertsAnswer,
      }),
      answer: {
        value: String(n),
        acceptableForms: [numberWords(n), countNoun(n, 'cups')],
        validation: 'exact-numeric',
        units: 'cups',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_count_v1', params: { n, noun: 'cups', thing }, seed: draw.seed },
      hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
      errorTags: ['task-comprehension', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: 'fill-story', situationType: 'part-whole' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 7 — Day-5 sort three, and say how you knew
// ===========================================================================

/**
 * The telling half of the Day-5 signature (disclosure 9), with no key.
 *
 * The order itself is code-derived from the drawn counts and is on the page for
 * an adult to check; what has no key is the telling, and that is the half
 * FILL-ARCHITECTURE §7 lists A20 for. `a_sort_and_tell_v1` registers neither an
 * `answerFor` nor a `verifyFor` — it is the family's marker for exactly this
 * shape — so nothing pretends to grade a sentence a child says out loud. It is
 * also the one item in the week carrying a justification demand, which is what
 * §6.12 wants.
 *
 * Lightest FIRST rather than heaviest, deliberately: the shortest row is the
 * hardest one to notice, so starting there forces all three to be counted before
 * anything is moved.
 */
function sortByWeight(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const trio = r.pick(WEIGHT_TRIOS);
      const { shown } = layOutTrio(r, guard, trio);
      const order = shown.slice().sort((x, y) => x.count - y.count).map((e) => e.name);
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(trioScene(shown), 'Sort them, lightest first. Tell how you know.'),
        figure: trioFigure(shown),
        answer: { value: order.join(', '), acceptableForms: [], validation: 'manual-review' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_sort_and_tell_v1',
          params: { a: shown[0].count },
          seed: r.uint(),
        },
        hintLadder: hints('Placeholder ladder, replaced by withHints below.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'sort-by-weight' },
      };
      return draft;
    });
}

// ===========================================================================
// The generators, bound and given this week's voice
// ===========================================================================

const blocksFor = withHints(
  unitCount({ attr: 'weight', framing: 'plain' }),
  hints('Touch a block, say a number, move on.', 'Say nothing twice and skip nothing.'),
);
const cupsFor = withHints(
  unitCount({ attr: 'capacity', framing: 'plain' }),
  hints('Every cup poured in counts as one.', 'Count the cups, never the container.'),
);
const predictThenCount = withHints(
  unitCount({ attr: 'capacity', framing: 'predict' }),
  hints('A guess is fine. Counting settles it.', 'Now go along the line, one cup at a time.'),
);

const heavierPair = withHints(
  weighPair({ ask: 'heavier' }),
  hints('Stop looking at the size. Count instead.', 'Whichever row of blocks runs further wins.'),
);
const lighterPair = withHints(
  weighPair({ ask: 'lighter' }),
  hints('Count both rows before you choose.', 'The lighter thing needed fewer blocks.'),
);

const whichHoldsMore = withHints(
  holdsMore(),
  hints('Tall does not always mean more inside.', 'Count every cup in both rows.'),
);

const heaviestThing = withHints(
  heaviestOfThree(),
  hints('Look away from the sizes for a moment.', 'Count each row, then hold all three numbers.'),
);

const puppetMixUp = withHints(
  puppetPicksBiggest(),
  hints('Count with the puppet, row by row.', 'Big and heavy are not the same thing.'),
);

const blockStory = withHints(
  weighStory(),
  hints('The heap is jumbled, so pick a starting block.', 'Slide each counted block out of the heap.'),
);
const cupStory = withHints(
  fillStory(),
  hints('Start at one end of the line of cups.', 'The last number you say is the answer.'),
);

const sortThem = withHints(
  sortByWeight(),
  hints('Nothing moves until all three rows are counted.', 'Put the shortest row of blocks first.'),
);

// --- the five warm-ups, one format and one source week each ----------------
// Floors, not defaults. `countArrangement` in two rows needs enough counters for
// a second row to exist; `compareSets` and `pickExtreme` need room for three
// honestly different groups. Ranges chosen so no drawn page contradicts its own
// description, which is the class of defect a01 and a12 both found by reading.
const warmCountRows = warmUp(countArrangement({ min: 6, max: 10, arrangement: 'in two rows' }), 2);
const warmMatchRows = warmUp(compareSets({ which: 'fewer', min: 3, max: 8 }), 5);
const warmMostGroup = warmUp(pickExtreme({ which: 'biggest', min: 2, max: 9 }), 6);
const warmMissingPart = warmUp(partnerBox({ total: 10 }), 13);
const warmTenAndMore = warmUp(teenExtra({ min: 11, max: 19 }), 10);

// ===========================================================================
// The week
// ===========================================================================

export const buildA20 = makeWeekBuilder({
  level: 'A',
  week: 20,
  conceptId: 'weight-and-capacity',
  conceptName: 'Weight & capacity',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 5 },
    { level: 'A', week: 19 },
  ],
  pedagogyContract: 'v2',
  // Disclosure 1: the balance is enacted at home and spoken in the lesson; what
  // every drawn surface shows is what the balance leaves behind.
  conceptualAnchor: 'the blocks that balance it',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Build the balance before you open the app: a coat hanger with a paper cup taped to each end will do, and so will your two hands held out flat. Put the thing in one cup and drop identical blocks into the other until they rest level, then count the blocks together. Let your child choose what to weigh, and weigh at least one thing that is big and light - that is the whole week in one moment. For the pouring pages, one small cup and a jug of water at the sink beats anything on a screen. Mascot present.',
  },
  explanation: {
    hook: say(
      'A stone is small. A balloon is huge. Which one is heavier? Do not guess. Blocks will tell us the truth.',
    ),
    whyBeforeHow: say(
      'Big things are not always heavy. A balloon is big and light. So we cannot tell by looking. We count the blocks that balance it. More blocks means heavier, because every block weighs the same. Cups work the same way for holding.',
    ),
    script: [
      {
        say: say('A stone sits on one pan. Blocks fill the other pan.'),
        visual: 'A balance: a stone in one pan, a row of blocks in the other.',
        figure: counters(6, 'blocks', { arrangement: 'in a row', alt: 'the blocks that balance the stone' }),
      },
      {
        say: say('The pans rest level. Six blocks balance this little stone.'),
        visual: 'The same balance, level, with the six blocks counted one by one.',
        figure: counters(6, 'blocks', { arrangement: 'in a row', alt: 'the same blocks, counted along the row' }),
      },
      {
        // The discrimination, TAUGHT where two pictures are available and the
        // answer is already on the page (kit §E2.5).
        say: say('Now the balloon. It is far bigger than the stone. Only two blocks balance it.'),
        visual: 'The balance again, with a huge balloon lifting against just two blocks.',
        figure: counters(2, 'blocks', { arrangement: 'in a row', alt: 'the blocks that balance the balloon' }),
      },
      {
        say: say('Big does not mean heavy. Cups tell us who holds more.'),
        visual: 'Two containers, each beside the row of cups poured into it.',
        figure: counterGroups(
          [
            { count: 3, noun: 'cups', label: 'tall bottle' },
            { count: 6, noun: 'cups', label: 'wide dish' },
          ],
          { relation: 'compare', alt: rowAlt('cups', ['tall bottle', 'wide dish']) },
        ),
      },
    ],
    summary: say(
      'Big does not mean heavy. Count the blocks that balance each thing. More blocks means heavier. For holding, count the cups instead.',
    ),
    vocabulary: [
      { term: 'heavier', kidGloss: 'takes more blocks to balance it' },
      { term: 'lighter', kidGloss: 'takes fewer blocks to balance it' },
      { term: 'balance', kidGloss: 'when the two pans rest level, neither one down' },
      { term: 'holds more', kidGloss: 'takes more cups to fill it right up' },
      { term: 'block', kidGloss: 'one small weight, and they are all alike' },
    ],
  },
  guidedExamples: [
    {
      ...ge(20, 1, 'modeled', scenePrompt('the balloon balances 2 blocks, the stone balances 4 blocks', 'Which one is heavier?'), [
        { teacherSay: say('Watch me. The balloon is huge. Should I just guess?') },
        { childDo: say('Count the balloon blocks with me.'), expected: '2' },
        { childDo: say('Now count the stone blocks.'), expected: '4' },
        { teacherSay: say('Four blocks beat two. The little stone is heavier.') },
      ], 'the stone'),
      visual: 'Two rows of blocks: a short one for the balloon, a long one for the stone.',
      figure: counterGroups(
        [
          { count: 2, noun: 'blocks', label: 'balloon' },
          { count: 4, noun: 'blocks', label: 'stone' },
        ],
        { relation: 'compare', alt: rowAlt('blocks', ['balloon', 'stone']) },
      ),
    },
    {
      ...ge(20, 2, 'completion', scenePrompt('the tall vase fills 5 cups, the wide tin fills 9 cups', 'Which one holds more?'), [
        { teacherSay: say('The vase is tall, so it looks like more.') },
        { childDo: say('Count the cups for each one.'), expected: '5 and 9' },
        { teacherSay: say('Nine cups beat five. The wide tin holds more.') },
      ], 'the wide tin'),
      visual: 'Two rows of cups, one for the tall vase and a longer one for the wide tin.',
      figure: counterGroups(
        [
          { count: 5, noun: 'cups', label: 'tall vase' },
          { count: 9, noun: 'cups', label: 'wide tin' },
        ],
        { relation: 'compare', alt: rowAlt('cups', ['tall vase', 'wide tin']) },
      ),
    },
    {
      ...ge(20, 3, 'prompted', scenePrompt('9 blocks balance the brick', 'How many blocks balance the brick?'), [
        { teacherSay: say('Touch every block once as you count.') },
        { childDo: say('Count them out loud, right to the end.'), expected: '9' },
      ], '9'),
      visual: 'One row of blocks, the ones that balanced the brick.',
      figure: counters(9, 'blocks', {
        arrangement: 'in a row',
        alt: 'the blocks that balance the brick',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(20, 4, 'independent', scenePrompt('the kite balances 2 blocks, the book 8 blocks, the key 4 blocks', 'Which one is heaviest?'), [
        { childDo: say('Count all three rows. Then choose.'), expected: 'the book' },
      ], 'the book'),
      visual: 'Three rows of blocks, one each for the kite, the book and the key.',
      figure: counterGroups(
        [
          { count: 2, noun: 'blocks', label: 'kite' },
          { count: 8, noun: 'blocks', label: 'book' },
          { count: 4, noun: 'blocks', label: 'key' },
        ],
        { relation: 'compare', alt: rowAlt('blocks', ['kite', 'book', 'key']) },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: measuring one thing, in both units, then the first
    // comparison the measuring makes possible.
    [
      { gen: warmCountRows, diff: 1 },
      { gen: blocksFor, diff: 2 },
      { gen: cupsFor, diff: 2 },
      { gen: heavierPair, diff: 2 },
    ],
    // Day 2 — the trap arrives on both strands: size on the blocks pages,
    // height on the pouring ones.
    [
      { gen: warmMostGroup, diff: 2 },
      { gen: blocksFor, diff: 2 },
      { gen: heavierPair, diff: 3 },
      { gen: whichHoldsMore, diff: 3 },
    ],
    // Day 3 — three things at once, the other direction ("lighter"), and the
    // puppet who answers from the sizes.
    [
      { gen: warmMatchRows, diff: 2 },
      { gen: heaviestThing, diff: 3 },
      { gen: lighterPair, diff: 3 },
      { gen: puppetMixUp, diff: 3 },
    ],
    // Day 4 — the same moves inside a story someone is living: blocks tipped
    // into a pan, cups poured into a container, and one real choice to make.
    [
      { gen: warmMissingPart, diff: 2 },
      { gen: blockStory, diff: 2 },
      { gen: cupStory, diff: 3 },
      { gen: whichHoldsMore, diff: 3 },
    ],
    // Day 5 — guess before you count, then sort three things and say how you knew.
    [
      { gen: warmTenAndMore, diff: 2 },
      { gen: predictThenCount, diff: 3 },
      { gen: sortThem, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: at this age "heavy" and "big" are the same word in a child\'s head, and no amount of telling separates them - lifting does. Hold out both hands, put a crumpled newspaper in one and an apple in the other, and let your child feel it before anyone says anything. Then count something. A coat hanger with a cup taped to each end is a real balance, and identical blocks, coins or dry pasta are real units; the only rule is that the units are all the same, which is worth saying out loud because it is the idea underneath every ruler your child will ever use. Two things look like errors and are not. If your child recounts a row after you have both counted it, that is the stage they are at, not carelessness - ask again straight afterwards rather than correcting. And if they now insist the SMALL thing is always the heavy one, they have swapped one rule for another; weigh something big and heavy next, and let the blocks settle it. For pouring, the sink is the classroom: one small cup, and count out loud together as it goes in.',
  ],
  /**
   * A colouring page whose colouring cannot be done without the measuring:
   * which rows get blue is decided by holding one row's count in your head and
   * testing every other row against it.
   *
   * It is the move no day makes. Every day this week compares two things or
   * ranks three; here one row is fixed as the mark and the rest are searched
   * against it, so the child meets the idea that a measurement can be a
   * STANDARD rather than one side of an argument. The answer is recounted from
   * the same drawn array the picture is built from, so the two cannot disagree
   * (disclosure 9 explains why no `asserts` clause points at it).
   */
  puzzle: (r, guard) => {
    // FOUR OF THE CLOSED CONTAINERS, and their counts come from the pack
    // registry, so the sack the puzzle ranks is the same weight as the sack a
    // day page weighed. Their contents are unknown, so any ranking among them is
    // honest - which is why the puzzle does not use the named objects, whose
    // ordering a child already has an opinion about.
    const all = r
      .shuffle([...WEIGH_ALONE])
      .slice(0, 4)
      .map((name) => ({ name, count: containerBlocks(r, guard, name) }))
      .sort((x, y) => y.count - x.count);
    // The benchmark is never the heaviest, so at least one row always beats it
    // and the page is never "color nothing".
    const mark = all[r.int(1, 3)];
    const others = r.shuffle(all.filter((row) => row.name !== mark.name));
    // Recounted from the drawn rows rather than read off the mark's position —
    // two routes to one number, so a dealing bug throws the answer off rather
    // than hiding inside it.
    const answer = others.filter((row) => row.count > mark.count).length;
    const rows = [mark, ...others];
    const scene = rows.map((row) => `the ${row.name} balances ${countNoun(row.count, 'blocks')}`).join(', ');
    return {
      id: 'A20-PZ-01',
      title: 'Puzzle Grove: Heavier Than That One',
      puzzleType: 'math-art',
      prompt: [
        `[image: ${scene}]`,
        say(`The ${mark.name} comes first.`),
        say(`It balances ${countNoun(mark.count, 'blocks')}.`),
        say('Color the heavier ones blue.'),
        say('How many did you color?'),
      ].join(' '),
      // No `asserts` — see header disclosure 9. The picture's own quantities are
      // the row lengths; the item asks how many of them beat the first one,
      // which no counters selector can express.
      figure: counterGroups(
        rows.map((row) => ({ count: row.count, noun: 'blocks', label: row.name })),
        {
          relation: 'compare',
          alt: rowAlt('blocks', rows.map((row) => row.name)),
        },
      ),
      answer: {
        value: String(answer),
        acceptableForms: [numberWords(answer)],
        validation: 'exact-numeric',
      },
      hintLadder: hints('Find the first row and count it.', 'Hold that number while you count the next row.'),
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'measure-against-a-mark' },
  sprint: null,
  mastery: [
    { gen: blocksFor, diff: 2 },
    { gen: heaviestThing, diff: 3 },
    { gen: cupsFor, diff: 2 },
    { gen: whichHoldsMore, diff: 3 },
    { gen: blockStory, diff: 3 },
    { gen: puppetMixUp, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh things and counts off a separate stream. 01: how many blocks balance one thing, typed as a number. 02: three things measured in blocks, heaviest tapped. The three pages of this shape in a pack take one size each - one keyed on the biggest object, one on the middling one, one on the smallest - so the thirds are a property of the pack a child receives, not an average over thousands of them (measured: 500 of 500 packs). 03: how many cups fill one container, typed as a number. 04: two containers, one tall and one wide, asked either way round. The four pouring pages in a pack take the four container pairs one each, dealt so the taller one really holds more on one or two of them and never on three or four, and so exactly one of the four is a genuine tie (measured: 500 of 500 packs). 05: a weighing story whose blocks arrive in a heap rather than a line, so keeping a place is the work. 06: the puppet who answers from the sizes, with the two honest alternatives beside his. Three of the six take a typed number rather than a tap, because a heavier-or-lighter question has exactly two answers and a two-option page certifies a coin flip; the plain two-way form teaches on Days 1-3 and certifies nothing. Every named thing has ONE count for the whole pack: the sack that balances 6 blocks on Monday balances 6 on Friday and 6 in both mastery forms, and a container fills the same number of cups wherever it appears (measured over 500 packs: 0 with any thing carrying two different counts).',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'bigger-means-heavier',
      description:
        'Answers with the bigger thing whenever weight is asked about. It is not laziness: size is the only evidence a picture offers until something is measured, and almost everything a small child lifts happens to follow the rule.',
      exampleWrongAnswer: 'a balloon balancing 2 blocks called heavier than a stone balancing 8',
      distractorRationale:
        'Offer the other thing on every comparison, and SCHEDULE each pack so the bigger one really is heavier on one or two of its three pair pages and on exactly one of its three three-way pages - so the habit is punished without teaching the mirror rule that big things are always light.',
      reteachPointer: 'explanation/script[2] (the huge balloon that only two blocks balance)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'taller-means-more',
      description:
        'Reads a tall narrow container as holding more than a wide one, and a short row of counters as a small number. Height and length stand in for quantity long before counting is trusted.',
      exampleWrongAnswer: 'a tall bottle taking 3 cups called fuller than a wide dish taking 6',
      distractorRationale:
        'Offer the tall container on every pouring comparison, and deal the four pouring pages of a pack so the taller one really holds more on one or two of them - never on three or four - with one of the four a genuine tie. The shape then settles nothing in any pack, not merely on average.',
      reteachPointer: 'guidedExamples/A20-GE-02 (the tall vase that holds less than the wide tin)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'stops-counting-early',
      description:
        'Counts the first row properly and then guesses at the rest, or loses the place in a heap. Three rows is more than a child of four can hold, so the slip lands on whichever row is counted last.',
      exampleWrongAnswer: 'the middle row chosen after only the first row was counted to the end',
      distractorRationale:
        'Offer the row that was not counted, and heap the blocks rather than lining them up on the story page so keeping a place is the real work.',
      reteachPointer: 'guidedExamples/A20-GE-03 (touch every block once, right to the end)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-other-direction',
      description:
        'Gives the heavier thing when the question asked for the lighter one, or the fuller container when it asked which holds less. Once the comparing game is familiar the child stops listening for the direction.',
      exampleWrongAnswer: 'asked which is lighter, gives the thing with the longer row of blocks',
      distractorRationale:
        'Put heavier and lighter, holds more and holds less, over pictures a child cannot tell apart, and let the direction alone decide who wins.',
      reteachPointer: 'explanation/script[3] (big does not mean heavy - and cups answer a different question)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Weighing and filling - and finding out that how big something looks tells you nothing about how heavy it is. We balanced things against identical blocks and counted the blocks, poured cups into containers and counted those, and then used those counts to settle which of two things is heavier or which holds more. We also met a puppet who answers by looking instead of counting, and put him right.',
    improvingCandidates: [
      'reaching the last unit in a row instead of stopping partway',
      'settling heavier and lighter by counting instead of by looking',
      'noticing that a tall narrow container need not hold more than a wide one',
      'listening for whether a question wants the heavier one or the lighter one',
      'putting three things in order from lightest to heaviest',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'separating big from heavy - we will keep weighing one big light thing and one small heavy thing side by side',
      },
      {
        errorTag: 'representation-misread',
        text: 'trusting the count over the shape, now that tall containers and wide ones are both on the page',
      },
      {
        errorTag: 'task-comprehension',
        text: 'hearing which direction a question asks for, since heavier and lighter arrive over the same picture',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted both rows of blocks before you chose, and you caught the big light one instead of trusting how it looked.',
      questionForChild: 'Which is heavier - your shoe, or the big empty cereal box?',
      schoolSyncHook: 'If they weigh with cubes, conkers or a bucket balance at nursery, tell us and the pictures will use it.',
    },
    vocabularyForParent: [
      'heavier / lighter (settled by counting a unit, never by size)',
      'balance (the two pans rest level when the weights match)',
      'capacity (what a container will take before it overflows)',
      'nonstandard unit (any repeated object used to measure - blocks, cups, hands)',
    ],
  },
});
