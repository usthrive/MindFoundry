/**
 * Level A · Week 17 — "Subtraction within 10" (conceptId: subtraction-within-10).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber`. a16 is the week this
 * one grows out of and was read in full; a14 was read in full beside it; a12 was
 * read for its authored-choices ARCHITECTURE only. What is borrowed from all
 * three is machinery — a rank dealer, a per-pack deal, a cards wrapper round a
 * family generator, the habit of measuring what is SERVED. Not one sentence,
 * scene, name, place, ladder, gloss, rationale or note below is theirs; the
 * token-overlap scan across `weeks/` that backs that up is in the report.
 *
 * FILL-ARCHITECTURE §3 row A17: anchor "count-back on path"; core form "picture
 * sub, count-back"; perceptual discrimination "count-back vs count-on"; puppet
 * error-analysis "counts back starting at the start number (off-by-one)";
 * Day-5 "match story ↔ number sentence". Catalog: computational focus
 * "count-back; take-apart with pictures and numerals", non-computational Day-5
 * focus "solve-and-color with close distractors".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THE WEEK CLAIMS, AND HOW THE CONTENT FORCES IT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  - **Taking away stops being something you look at and becomes something you
 *    DO.** A16 handed the child a picture with the departed already struck out
 *    and asked what survived; the answer was there to be counted. Here nothing
 *    is struck out and nothing is missing: one number path, one flag on the
 *    number you start from, and a rule for walking backwards along it. The
 *    answer is not on the page — it is where the walk ends.
 *  - **The whole week hangs on where the count STARTS.** To take three off eight
 *    you say seven, six, five. You do not say eight, because eight is the place
 *    you are standing, not a step you have taken. That single rule is the
 *    lesson, the puppet's slip, a certifying slot of its own (`firstHop`), and
 *    the reason the puzzle asks a child to RING every number they say.
 *  - **The discrimination is a direction, not an operation.** A16 already asked
 *    whether a story removes or joins. This one gives the child a story that has
 *    already decided that, and asks which WAY along the path it sends them: same
 *    flag, same number of hops, one word different. Both outcomes are live keyed
 *    values, so no card can be struck out unread and no habit can answer the
 *    page from the picture.
 *  - **The numbers reach ten and the path is always the same path.** Every
 *    drawing in the week runs from end to end with every step numbered, so a
 *    child learns one instrument rather than a new picture each day. The
 *    take-apart half of the catalog's focus arrives as the one page where the
 *    path is put away: a covered frame, where the part you cannot see has to be
 *    worked out rather than counted (`hiddenPart`).
 *  - **Nothing here is answerable off the sentence, and nothing is spoken
 *    before it is asked.** All fifteen non-retrieval items on Days 1–4 carry a
 *    figure built from their own drawn numbers, and no figure `alt` in the file
 *    contains a digit or a number word — which matters because at this band the
 *    alt is autoplayed BEFORE the question.
 *  - **No timers.** `sprint: null`. A timed element at band A is a hard fail.
 *  - **Four of the nineteen daily items look backwards** (21.1%), one opening
 *    each of Days 1–4, four different formats from four different weeks: last
 *    week's cross-out (A16), the step back along the path (A6), the join that
 *    the count-on side of the discrimination rests on (A14), and reading a frame
 *    past five (A2), because this is the first week whose numbers go to ten.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCLOSURES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. **THE RECIPE'S PUPPET SLIP IS THE ONE THE FAMILY ALREADY COMPUTES.** Row
 *    A17's slip is "counts back starting AT the start number", and
 *    `a_verify_countback_slip_v1` is registered for exactly it: from `{a, b}` it
 *    returns `{correct: a − b, wrong: a − b + 1}`. So QG-11 checks both halves
 *    of every puppet page at every seed — the keyed option against the truth,
 *    and the prompt against the recomputed slip value — and a puppet who said a
 *    number the misconception does not produce fails the pack. Nothing is
 *    authored, nothing is reframed and nothing is fabricated. This is the third
 *    time in three weeks that this question has been asked and the first time
 *    the answer has cost nothing: a14 had to relocate its slip and a16 found its
 *    own in `d_verify_binop_misconception_v1`.
 *
 *    The PAGE is still local rather than `puppetSlip({slip: 'count-back-start'})`
 *    (disclosure 6), because the family draws that slip over a crossed-out row —
 *    A16's picture — and a week whose whole claim is that the method has moved
 *    onto the path cannot show its central error somewhere else.
 *
 * 2. **EVERY OTHER PAGE PINS `d_verify_binop_v1`, AND NOT THE FAMILY'S
 *    `a_takeaway_v1`, FOR THE REASON a14 AND a16 BOTH RECORDED.** `a_takeaway_v1`
 *    registers an `answerFor`, and QG-5 re-derives an `answerFor` only for the
 *    five numeric validations — never for `choice-key`. At this band a
 *    certifying page MUST be `choice-key`: a pre-reader cannot type, and a
 *    numeric band-A item with no authored choices falls through to
 *    `tapOptionsFor`, which invents four buttons from a function that cannot
 *    know the slot's answer range (L53). `d_verify_binop_v1` registers a
 *    `verifyFor`, which QG-11 runs on choice items, and `{a, b, op: '-'}`
 *    recomputes exactly the landing number from the two counts the story states.
 *    Same arithmetic, live audit. **Recorded for the orchestrator, now for the
 *    third week running: `earlynumber` wants verify twins for `a_join_v1` and
 *    `a_takeaway_v1`.** A17 adds a second, sharper request: there is no
 *    transform anywhere that expresses "the first number said in a count", so
 *    `firstHop` reaches its truth through `{a, b: 1, op: '-'}` — honest, because
 *    the first number said really is one less than the number you stand on, and
 *    the hop count rides in `hops` where it cannot be mistaken for an operand.
 *
 * 3. **THE MINUS SIGN IS WRITTEN AND SPOKEN, AND IT IS STILL NOT DRAWN ON AN
 *    ASSESSED PAGE.** `NumberLineFig` draws ticks, marks and hop arcs; it has no
 *    text channel for an operator, and `CountersFig` renders a relation's sign
 *    only BETWEEN two groups, which a one-group take-away has not got. a16
 *    established this and asked for a number-sentence primitive; a14 asked
 *    first. This week is where the absence finally bites, because §3 gives A17
 *    the Day-5 signature "match story ↔ number sentence" and there is no
 *    primitive that draws a numeral, an operator, an equals sign or an answer
 *    box. So the number sentence lives where a band-A sentence honestly can: in
 *    the OPTIONS the child taps and in the prompt that is read aloud to them
 *    (disclosure 7), in the lesson script, in that script's own written visual
 *    direction, in the vocabulary and in a guided example. **Recorded for the
 *    orchestrator: a `number-sentence` figure — a drawn row of numerals and
 *    operators with one blank box — is the single missing primitive that A14,
 *    A15, A17 and A18 have now each asked for in turn.**
 *
 * 4. **THE DISCRIMINATION IS A NUMBER RATHER THAN A VERDICT, AND ITS DIRECTION
 *    IS DEALT RATHER THAN DRAWN (L52).** `whichWay` draws one path and one flag,
 *    then tells one of two stories over it — `Baz counts back 2 hops.` or
 *    `Baz counts on 2 hops.` — and asks the same question either way: which
 *    number does he land on? The picture does not move. Both `start − hops` and
 *    `start + hops` are live keyed values, and the two directions have
 *    mirror-image option pools, so the key's rank rotates on both sides.
 *
 *    Four fair coins land the same way on one pack in eight, and a pack whose
 *    discrimination pages all count back is a pack where walking the wrong way
 *    was never once punished. So the two DAILY pages take one direction each
 *    (which day counts back is decided once per pack, from the pack's own
 *    guard), and each MASTERY FORM takes one of each across its two slots (which
 *    slot counts back is decided once per form, remembered against the form's
 *    own rng object so a page rebuilt by the freshness guard or by the
 *    assembler's echo check keeps the direction it already had rather than
 *    borrowing the other form's). Both are idempotent rather than consuming, for
 *    the reason a12 first recorded: a schedule spent per CALL hands the next page
 *    the wrong side.
 *
 *    THE PRICE, MEASURED. "Always count back" and "always count on" are exactly
 *    complementary here, so each takes exactly one of the two slots in every
 *    form and neither can be pushed below a half without deleting one of the two
 *    situations the week exists to contrast. That is a floor and not a defect;
 *    a14 and a16 reached the same one from their own contrasts. What the floor
 *    does NOT do is certify anybody — see disclosure 9.
 *
 * 5. **WHICH VALUES MAY BE OFFERED IS ARITHMETIC, NOT TASTE (L38), AND EVERY
 *    POOL IN THE FILE IS CLIPPED TO WHAT ITS OWN SLOT CAN KEY.** Each page type
 *    declares the closed interval its answer lives in and no card outside it is
 *    ever built:
 *      · landing pages (`countBack`, `hopStory`) key 1 through 9 — a count back
 *        of at least one from at most ten can never leave ten, so the numeral 10
 *        is never offered there even though the path runs to it;
 *      · `firstHop` keys 4 through 9, because the first number said is one below
 *        a start of five to ten;
 *      · `whichWay` keys 1 through 10 — both directions together reach every
 *        number on the path, which is why it is the only page in the week that
 *        may offer the numeral 10;
 *      · `hiddenPart` keys 1 through 9; the whole is on the page as a spoken
 *        given and is offered as a card whenever it is inside that range.
 *    Zero is offered nowhere and is nowhere the answer: a hop lands on zero only
 *    if you start where you finish, which no draw in the week makes.
 *
 *    **The one exception is structural and it is the puppet's own number.** An
 *    error-analysis page whose slip is "one step short" offers `a − b + 1` by
 *    construction, so the largest value it ever offers is one above the largest
 *    value it can ever key. On the puppet slot that value is 9, reachable only
 *    from the single pair (10 back 2), so it is offered on 1 draw in 14 — an
 *    order of magnitude below the rate at which a card becomes learnable, and
 *    unavoidable for a plus-one slip unless the puppet is sometimes right. a16
 *    reported the same shape from the other end and a01, a12 and a14 before it.
 *
 * 6. **EIGHT LOCAL GENERATORS, AND WHY NONE OF THEM IS IN THE FAMILY.**
 *    `pictureTakeAway` is the family's take-away page and it is served here only
 *    as a WARM-UP, wearing this week's cards and this week's alt: its own
 *    question is A16's and its picture is A16's. `countBack`, `firstHop` and
 *    `whichWay` are local because no family generator draws a number path with a
 *    starting flag and no hops — `neighbourNumber` draws the path but marks the
 *    ANSWER's position with a question mark, which is the opposite of what a
 *    count-back page may show. `puppetOnThePath` is local for the reason in
 *    disclosure 1. `hopStory` is local because the family has no story
 *    generator. `hiddenPart` is local because `partnersHiding` fixes the whole in
 *    its options and asks the family's own question; here the whole is drawn
 *    afresh between six and ten and the question is asked in words this week
 *    owns. `matchSentence` and `colourWhatIsLeft` are the Day-5 pair and have no
 *    family form at all. Every one of them builds an item the way the family
 *    does: a registered templateId, a picture from `lib/figures`, every quantity
 *    through `lib/format`, an `authorMeta` stamp for the preflight.
 *
 * 7. **THE DAY-5 MATCH PUTS THE NUMBER SENTENCE ON THE CARDS, WHICH IS THE ONLY
 *    PLACE IT CAN GO.** With no primitive to draw one (disclosure 3), a sentence
 *    can live in the prompt — spoken aloud at this band, which is honest — or on
 *    a tap target, which is short enough to be read to a child in one breath.
 *    `matchSentence` uses both: the story is spoken, and the three cards are
 *    `8 − 3`, `8 + 3` and `8 − 2`, one operator or one hop apart. That is the
 *    catalog's "close distractors" as literally as this band can carry them, and
 *    every one of the three card SHAPES is keyed on some draw — the direction
 *    card whenever the story counts on, the hop-count card whenever that hop
 *    count is the one drawn — so nothing here can be struck out unread.
 *
 *    **What could not be built: the colouring key.** The catalog's Day-5 phrase
 *    is "solve-and-color with close distractors", which wants regions labelled
 *    with an answer and its near neighbours so that colouring the wrong one
 *    shows. Nothing draws a labelled region or a numbered key, so the colouring
 *    page ships as what CAN be true — the child works out how many are left and
 *    colours that many of the drawn row — and the close distractors are carried
 *    by the match page beside it rather than invented as a picture that does not
 *    exist (the L27 class). `colourWhatIsLeft` validates as `manual-review`
 *    because nothing can grade a colouring; the number it must come to is still
 *    code-computed and recorded in `answer.value`, and the figure asserts the
 *    row it was drawn from, so an adult holding the page knows what right looks
 *    like.
 *
 * 8. **THE PUZZLE CARRIES NO `asserts`, AND THAT IS DELIBERATE.** It draws the
 *    path with a flag on the start and a dot on the finish and asks the child to
 *    RING every number they say on the way — so the quantity the picture can
 *    compute is a mark POSITION, and the quantity the item asks for is a COUNT
 *    of hops. `figureValue` has no selector for the second, and aiming the
 *    assertion at the first would put a truthful picture and a correct answer on
 *    opposite sides of QG-13. One drawn start and one drawn finish produce both
 *    the marks and the key, so they cannot disagree.
 *
 *    The puzzle is also the only place in the week where the off-by-one is a
 *    DOING task rather than a choosing one: a child who rings the number they
 *    are standing on ends with one ring too many and can see it.
 *
 * 9. **WHAT MEASURING FOUND, AND IT WAS SEVEN REAL DEFECTS.** Every one of them
 *    passed the 200-seed validator run and every one would have shipped.
 *      · **"ALWAYS COUNT BACK" CERTIFIED A FORM ON ITS OWN.** With the first
 *        mastery draft — landing page, direction, story, take-apart, puppet,
 *        direction — a child who subtracts whatever two numbers the page states
 *        and never decides anything scored the landing page, the story, the
 *        take-apart, the puppet and exactly one of the two direction pages: 5 of
 *        6, which IS the pass mark, on 100% of forms. That is L51 exactly (does
 *        guessing reward the misconception the week teaches against?), and the
 *        calibration is a16 at 0.0%, a14 at 2.0% and a03 at 2.4%. The take-apart
 *        page moved to Day 2 and the certifying slot became `firstHop`, whose
 *        key is one below the start and therefore never the difference — with
 *        hops of two or three only, so the two numbers can never coincide by
 *        accident the way `here = 2 × gone` did in a16. The habit now tops out
 *        at 4 of 6 and passes 0.0% of forms, while a child who reads the
 *        question still answers all six. The per-slot table is in the report.
 *      · **THE LANDING PAGES SAT AT A FIXED RANK, TWICE, IN OPPOSITE
 *        DIRECTIONS.** Every honest miscount of a backward walk except
 *        overshooting is LARGER than the landing number — the flag itself, the
 *        forward walk, the famous plus-one — so the first pool held one card
 *        below the key and three above, and the deal could not reach the top
 *        rank at all. Asking for the top every time then pinned the key THERE
 *        instead: 71% and 73% on the two landing slots, which is L43 mirrored,
 *        exactly as the rule's own history warns. The fix was the pool and not
 *        the target: carrying BOTH overshoots (one hop too many and two) gives
 *        each side something to work with, and a uniform target then measures
 *        32/37/31 and 30/39/32. The discrimination needed the same repair on its
 *        forward half, where the path's own ceiling of ten is what empties the
 *        pool: 18/56/26 before, 29/35/37 after.
 *      · **THE DAY-5 SENTENCE OFFERED CARDS IT COULD NEVER KEY.** Its third card
 *        is the right sign with the wrong hop count, and `8 − 3` can only be
 *        keyed if the walk (8 back 3) is drawable — which it is not, because
 *        eight forward by three leaves the path. Three such sentences were
 *        offered on 2.0–3.4% of that slot's draws and keyed on none. Starts are
 *        now capped at eight for that page and the mis-said hop count is drawn
 *        from the counts that same start could legally have used.
 *      · **A WARM-UP OFFERED A CARD IT COULD NEVER KEY.** The step-back warm-up
 *        drew its distractors as the neighbours of the answer, which put a card
 *        of one above the top of its own range on the high draws and a card
 *        below the bottom on the low ones. Every warm-up pool is now clipped to
 *        the interval its own question can reach, the same discipline the core
 *        pages use (disclosure 5).
 *      · **THE PUPPET'S THIRD CARD FIXED THE KEY IN THE MIDDLE.** His own number
 *        is always one above the truth, so a third card taken from below put the
 *        key at the middle rank on every draw where one existed — which is
 *        nearly all of them, and is `CONSTANT_NUMERIC_RANK` at rank 1, the shape
 *        the b04 measurement named. The side is now drawn, and the coin is
 *        weighted 65/35 towards the high side because a start of nine or ten
 *        leaves nothing above the puppet inside the interval the slot can key:
 *        a fair coin measured 37/63 and the weighted one measures 48/52.
 *      · **THE WORD "ONE" WAS IN EVERY PATH ALT.** The alt ended "a flag
 *        standing on one of them", and `bb-spoken-answer-test`'s G3 rule
 *        normalises a number word to its digit before comparing — correctly,
 *        since a pre-reader hears no difference. A landing number of 1 is
 *        reachable on the count-back pages, so on those draws the picture spoke
 *        the answer before the question was asked. Nothing measured it because
 *        the phrase reads as a pronoun; a blanket scan for digits AND number
 *        words across every alt in the week found it. The alt now ends "standing
 *        partway along it" and the scan is clean over 500 packs.
 *      · **THE LANDING PAGE AND THE DISCRIMINATION SHIPPED THE SAME SENTENCE.**
 *        Both draw the same picture and tell the same story, so with the same
 *        question they were the same page — and Day 2 serves one of each, so one
 *        pack in every one printed a page twice with different numbers. The
 *        stories still match word for word, which is what makes a discrimination
 *        a discrimination; the four questions no longer do (reach / finish on /
 *        say first / should be on).
 *
 * 10. **WHAT ONLY READING THE GENERATED WEEK FOUND.** Five things, and no gate
 *    sees any of them.
 *      · The first `countBack` question was "How many are left?", which is
 *        `pictureTakeAway`'s own sentence and would have carried the family's
 *        words into a fourth week. A count-back page does not ask what is left;
 *        it asks where you land, which is the whole point of moving the method
 *        onto a path.
 *      · The first path alt read "a number path with a hop back drawn on it",
 *        which is narration rather than description on the pages where no hop is
 *        drawn — and on the discrimination page it would have told the child the
 *        direction before the story did. It now says what every path page
 *        actually shows: numbered steps and a flag.
 *      · The three Day-4 stories first put their people on a stair, a stone and
 *        a square and then asked "how many are left?", which is the wrong
 *        question for a position: you are not left with a step, you are ON one.
 *        Each story now asks for the place, which is also why the path is the
 *        right picture for all three.
 *      · The puppet page said "Bo counts back and says 6", which leaves a child
 *        wondering how far Bo went. It now states the hops, so the page has
 *        everything the child needs and nothing they do not.
 *      · Every path page named its walker twice in two short sentences — "Danso
 *        stands on 4. Danso counts back 2 hops." — which is how nobody speaks.
 *        The two clauses are now one sentence of at most ten words, which reads
 *        aloud in one breath and is what the band's ceiling is actually for. The
 *        Day-4 stories and the colouring page were rewritten the same way.
 *
 * 11. **A SHARED TRANSFORM IS WHY FIVE PAGE TYPES CARRY A DISTINGUISHING PARAM.**
 *    The assembler compares a Form-B slot against every Form-A core on
 *    `{templateId, params}` alone, so two different questions that happen to
 *    hold the same two numbers read as one repeat and the draft is rebuilt —
 *    spending a freshness surface it then throws away. a16 found this at seed
 *    471 and worked around it the same way: every page here that pins
 *    `d_verify_binop_v1` carries one honest param naming what it asked
 *    (`on: 'path'`, `hops`, `told`, `place`, `part`, `sentence`, `colour`), so a
 *    landing page and a story that both drew eight-back-three are no longer the
 *    same question to the check. **Recorded for the orchestrator, seconding
 *    a16:** the collision check should include `type` and `cognitiveOp`, or a
 *    discarded draft should give its surface back.
 *
 * 12. **BB-G1 DOES NOT FIRE ON THIS WEEK AND IT SHOULD.** `deepeningDelta` is
 *    declared below and the pedagogical preflight would have accepted its
 *    absence: `conceptFamily('subtraction-within-10')` is `subtraction`, while
 *    `conceptFamily('meeting-subtraction')` is `meeting-subtraction`, so
 *    `priorSameFamily` returns an empty list and the §6.13 precondition never
 *    triggers. The same hole sits under A15, whose `addition-within-10` does not
 *    match A14's `meeting-addition`. **Recorded for the orchestrator: the
 *    ledger's family key should strip a leading `meeting-`**, which would make
 *    the two weeks that most obviously deepen a predecessor actually be gated as
 *    deepenings. Reported, not fixed — `lib/ledger.ts` is not this file's to
 *    change.
 */

import type { BBFigure, FigureAssertion } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  neighbourNumber,
  pictureJoin,
  pictureTakeAway,
  tenFrameRead,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswerOf, assertsParam, counters, mathSentence, numberLine, tenFrame } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Eight people, drawn fresh per story. Nothing below hardcodes one (kit §F.3). */
const WALKERS = ['Mirela', 'Danso', 'Aiko', 'Feliks', 'Nomi', 'Tove', 'Baz', 'Ines'] as const;

/** The path every picture in this week draws, end to end, every step numbered. */
const PATH_FROM = 0;
const PATH_TO = 10;

/**
 * The most hops any story asks for, and it is inherited rather than chosen.
 * A15 taught counting ON by one, two or three, so those are the walks a child
 * already owns; asking for four back would be teaching a second thing under
 * cover of the first.
 */
const MOST_HOPS = 3;

/**
 * EVERY COUNT-BACK THE WEEK MAY DRAW, HELD AS A PAIR RATHER THAN AS TWO
 * INDEPENDENT NUMBERS.
 *
 * `from` is the number the flag stands on and `hops` is how far back the story
 * walks, so `from − hops` is the landing number the page asks for. Drawing the
 * PAIR uniformly is what keeps the freshness machinery from running dry:
 * `drawUniqueItem` signs an item on its format class plus its sorted numeric
 * tokens, so each page type has exactly these surfaces, and drawing the two
 * numbers separately would make the large starts far commoner than the small.
 *
 * Twenty-one pairs, and the landing number runs from one to nine. It never
 * reaches ten, which is what fixes the option pools (disclosure 5), and it never
 * reaches zero, which is A18's to teach: a walk that ends where it began is a
 * different idea from a walk that ends somewhere.
 */
interface Walk {
  from: number;
  hops: number;
}

const BACK_WALKS: readonly Walk[] = (() => {
  const out: Walk[] = [];
  for (let from = 4; from <= PATH_TO; from++) {
    for (let hops = 1; hops <= MOST_HOPS; hops++) {
      if (from - hops >= 1) out.push({ from, hops });
    }
  }
  return out;
})();

/**
 * The walks the DISCRIMINATION may draw, which are not the same set.
 *
 * That page tells one of two stories over one flag, so its numbers have to work
 * in both directions at once: the backward walk must stay on the path and so
 * must the forward one. `from + hops ≤ 10` is the binding condition and it
 * leaves fifteen pairs, with the two directions between them reaching every
 * number the path holds — which is why this is the only page in the week
 * allowed to offer the numeral ten.
 */
const EITHER_WALKS: readonly Walk[] = BACK_WALKS.filter(
  (w) => w.from + w.hops <= PATH_TO && w.from <= 9,
);

/**
 * The walks the FIRST-HOP page may draw, and the restriction is the whole reason
 * that page defeats a habit.
 *
 * It asks which number the walker says on their first hop, which is one below
 * the flag whatever the story does afterwards. On a walk of ONE hop the first
 * number said is also the landing number, so a child who simply subtracts the
 * two numbers on the page is ticked by coincidence — the page's purpose exactly
 * reversed. Walks of one hop are therefore barred from it, and from nowhere
 * else. Starts begin at five so the answer stays inside the interval the slot
 * can key (disclosure 5).
 */
const FIRST_WALKS: readonly Walk[] = BACK_WALKS.filter((w) => w.hops >= 2 && w.from >= 5);

/**
 * The walks the DAY-5 SENTENCE MATCH may draw, and the restriction is L38 again
 * in an unfamiliar costume.
 *
 * Its third card is the right direction with the WRONG hop count — `8 − 3`
 * beside a story that hopped twice — and a card is only honest if some draw of
 * that slot keys it. A sentence card is keyed when its own numbers are the ones
 * the story used, so `8 − 3` needs the walk (8 back 3) to be drawable, which
 * `EITHER_WALKS` refuses because eight forward by three runs off the path.
 * Measured before the restriction: three such sentences were offered on two to
 * three per cent of draws each and could be keyed on none of them.
 *
 * A start of at most eight leaves every walk with a second legal hop count to
 * mis-say, and fourteen pairs to draw from.
 */
const SENTENCE_WALKS: readonly Walk[] = EITHER_WALKS.filter((w) => w.from + 2 <= PATH_TO);

/** The hop counts a sentence card may name for this start and still be keyable. */
function otherHops(w: Walk): number[] {
  return [1, 2, 3].filter((h) => h !== w.hops && w.from + h <= PATH_TO);
}

/**
 * The walks the PUPPET may draw. A walk of one hop makes his slip degenerate —
 * "counted back starting on the flag" would leave him standing on the flag and
 * saying the number the page already states — so the page would be answered by
 * "not the number he is on" without any counting at all.
 */
const PUPPET_WALKS: readonly Walk[] = BACK_WALKS.filter((w) => w.hops >= 2);

// ---------------------------------------------------------------------------
// THE WORD CAP, COUNTED THE WAY THE GATE COUNTS IT
//
// Two ceilings exist and only one is the law here. `earlynumber`'s `ask()`
// weighs a whole prompt, which would refuse this week's three-sentence puppet
// page for a length none of its sentences has. The readability gate weighs ONE
// SENTENCE wherever a child hears it, and the gate is the law. Its splitter and
// its counter are reproduced below and every authored child-facing string in the
// file passes through them, so an eleventh word stops the module loading or
// stops the page being built — never a reviewer counting on their fingers.
//
// Figure alts are deliberately not routed through it. An alt is the whole of
// what a child on a screen reader has instead of the drawing, and the only way
// to shorten one is to describe the picture less.
// ---------------------------------------------------------------------------

const MOST_WORDS = 10;

function spoken(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const words = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (words > MOST_WORDS) {
      throw new Error(
        `A17 word cap: ${String(words)} words in one breath, and the ceiling here is ${String(MOST_WORDS)} — "${sentence}"`,
      );
    }
  }
  return text;
}

/** The scene rides in a bracket that is never displayed; only the question is capped prose. */
function withScene(scene: string, question: string): string {
  return `[image: ${scene}] ${spoken(question)}`;
}

/** A ladder, every rung capped. No rung names a person, a puppet or a number. */
function ladder(...rungs: string[]): string[] {
  return rungs.map(spoken);
}

/**
 * Give a FAMILY generator this week's own help without touching `lib/`.
 *
 * No ladder may serve more than twice across the fifteen non-retrieval core
 * items, which puts a floor of eight distinct ladders under the week before a
 * single page is designed (kit §E, A-band lesson 1). Twenty-five ship here, one
 * per page and one per certifying slot, and no two are alike. The arithmetic is
 * only half the reason: the help genuinely differs, because "do not say the
 * number you are standing on" and "listen for which way the story goes" are not
 * the same nudge, and neither could live in the shared family without being said
 * in all twenty-four Level-A weeks at once.
 *
 * The closure rewrites one field of a finished draft and draws nothing itself,
 * so the prompt QG-1 and QG-4 sign is untouched. Local generators take their
 * ladder as a required ARGUMENT instead, so a page with no help does not compile.
 */
function withLadder(base: ItemGen, rungs: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: rungs });
}

/** Put an earlier week back in front of the child as a game, never as review. */
function asWarmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The pictures
// ===========================================================================

/**
 * NO ALT IN THIS FILE NAMES A NUMBER, AND AT THIS BAND THAT IS AN AUDIO RULE
 * BEFORE IT IS AN ACCESSIBILITY ONE.
 *
 * `speakablePrompt(prompt, figure.alt)` puts the scene in front of the question
 * and prefers the alt over the `[image: …]` bracket, and every band-A screen
 * autoplays the result — so a four-year-old hears the alt before they hear what
 * they are being asked. A number word is a number wherever it appears (L48), and
 * a14 shipped an alt whose "two groups of" spoke the answer on every draw whose
 * total was two. So the alt says what the drawing LOOKS like: a straight path,
 * every step numbered, one flag standing on it. Which step the flag is on stays
 * the child's to read.
 */
const PATH_ALT = 'a straight path with numbered steps and a flag standing partway along it';
const FRAME_ALT = 'a counting frame with a few counters in view and a cloth hiding the others';

/** The path as an assessed page draws it: the flag, and not one hop. */
function pathFigure(from: number, asserts: FigureAssertion): BBFigure {
  return numberLine(
    { min: PATH_FROM, max: PATH_TO, step: 1, labels: 'all', marks: [{ at: from, style: 'flag' }] },
    { alt: PATH_ALT, asserts },
  );
}

/**
 * The path as the LESSON draws it: the flag, the arcs and the landing dot.
 *
 * The hops belong here and nowhere else. A worked example already has its answer
 * on the page, so drawing the walk is modelling; drawing it on an assessed page
 * would put the arrowhead on the answer and turn a count into a read (kit §E2.5,
 * and L33 — the dangerous figure is the helpful one).
 */
function walkedFigure(from: number, hops: number, asserts?: FigureAssertion): BBFigure {
  const arcs = [];
  for (let i = 0; i < hops; i++) arcs.push({ from: from - i, to: from - i - 1 });
  return numberLine(
    {
      min: PATH_FROM,
      max: PATH_TO,
      step: 1,
      labels: 'all',
      marks: [
        { at: from, style: 'flag' as const },
        { at: from - hops, style: 'point' as const },
      ],
      hops: arcs,
    },
    { alt: 'a straight path with numbered steps, a flag, arcs hopping backwards and a dot where they end', ...(asserts ? { asserts } : {}) },
  );
}

// ===========================================================================
// Choosing the cards — the one dealer every counting page goes through
// ===========================================================================

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Two wrong values, with the truth's RANK aimed rather than left to fall.
 *
 * L43 states the defect as an invariant and not as a direction: the answer must
 * not sit at a fixed rank among the numbers on offer. Both ends are traps —
 * every distractor above makes "tap the smallest" a strategy, every distractor
 * below makes "tap the biggest" one, and one card either side makes "tap the
 * middle" one. A count-back page falls into the first of those by default,
 * because almost every honest miscount of a backward walk is larger than the
 * landing number.
 *
 * So a target rank is asked for — 0 puts the truth lowest, 1 in the middle, 2
 * highest — and when the drawn pair cannot reach it the deal steps to whichever
 * rank is nearest. Stepping rather than cycling matters: a cycle would pour
 * every unreachable target into the one shape that is always buildable.
 *
 * Deterministic throughout. Only the branch that succeeds draws, and which
 * branch that is depends solely on the pools, so the same seed always spends the
 * same number of draws (kit §E2.4 — never a redraw loop).
 */
function twoCards(r: Rng, below: readonly number[], above: readonly number[], aim: number): number[] {
  const shapes = [
    () => (above.length >= 2 ? r.shuffle(above).slice(0, 2) : null),
    () => (below.length >= 1 && above.length >= 1 ? [r.pick(below), r.pick(above)] : null),
    () => (below.length >= 2 ? r.shuffle(below).slice(0, 2) : null),
  ];
  const order = [0, 1, 2].sort((x, y) => Math.abs(x - aim) - Math.abs(y - aim));
  for (const shape of order) {
    const got = shapes[shape]();
    if (got) return got;
  }
  throw new Error('A17 twoCards: this walk cannot supply two honest wrong numbers');
}

/**
 * Each candidate once, in the order offered, with everything the slot can never
 * key thrown away (disclosure 5). `lo` and `hi` are the closed interval the
 * page's own answer lives in, so a card outside it is a card a child could learn
 * to strike out unread.
 */
function keyable(values: readonly number[], truth: number, lo: number, hi: number): number[] {
  const seen = new Set<number>([truth]);
  const out: number[] = [];
  for (const v of values) {
    if (v < lo || v > hi || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/** Split a pool around the truth, ready for the dealer. */
function around(values: readonly number[], truth: number): { below: number[]; above: number[] } {
  return {
    below: values.filter((v) => v < truth),
    above: values.filter((v) => v > truth),
  };
}

// ===========================================================================
// What a child was doing when they tapped something else
// ===========================================================================

/** The interval a landing page can key: a backward walk inside ten. */
const LANDING_RANGE = [1, 9] as const;

/**
 * Read off the VALUE and the drawn walk rather than off the branch that produced
 * them, so what is said about a card cannot drift from the card itself. The
 * tests run in the week's own order of importance: the plus-one first, because
 * it is what this week exists to prevent, then the two whole-page misreadings,
 * then the ordinary miscounts. Teacher-facing, so no word cap.
 */
function whyNotTheLanding(v: number, w: Walk): Card {
  const text = String(v);
  const land = w.from - w.hops;
  if (v === land + 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'The count set off ON the flag. Saying the starting number as the first hop spends a hop without moving, so the walk finishes one place above where the story sent it. It is the slip this week exists to prevent, and it is the one the puppet makes.',
    };
  }
  if (v === w.from) {
    return {
      text,
      errorTag: 'representation-misread',
      rationale: 'The flag given straight back. The story was taken as a description of where the walker is standing rather than as an instruction to set off, so no hop was ever taken.',
    };
  }
  if (v === w.from + w.hops) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'The hops climbed the path instead of descending it. Adding is the move a child owns best, and it lands them further out than the walker ever stood.',
    };
  }
  if (v === w.hops) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'How far the walk went, offered for where it finished. Two numbers are spoken in the story and this is the smaller of them, chosen without settling which of the two was wanted.',
    };
  }
  if (v === land - 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One hop too many. The counting words kept coming after the story had run out of hops, usually because the finger was still travelling.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'Out by two. The walk mislaid its place on the path, either by setting off from the wrong step or by letting the words and the feet drift apart.',
  };
}

/** The same job for the page that asks which number is said FIRST. */
function whyNotTheFirstHop(v: number, w: Walk): Card {
  const text = String(v);
  if (v === w.from) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'The number under the flag, said as though it were a hop. It is the place the walk begins from, not a place the walk has reached, and telling those apart is the whole of this page.',
    };
  }
  if (v === w.from - w.hops) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'The end of the walk given for the beginning of it. The counting was sound and the question was not read: this page asks about the first hop, not the last.',
    };
  }
  if (v === w.from + 1) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'One step the wrong way. Counting back was heard as counting, and the path was walked in the direction a child has practised more.',
    };
  }
  if (v === w.from - 2) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'Two steps taken in place of one, so the first number spoken skips straight over the number sitting directly under the flag.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'The place on the path is out by more than a step, which happens when the numbers are recited from memory instead of read off the drawing.',
  };
}

// ===========================================================================
// Local generator 1 — the count-back page (the week's core form)
// ===========================================================================

/**
 * One path, one flag, a stated number of hops backwards, and the landing number
 * to be found by walking.
 *
 * Nothing on the drawing marks where the walk ends, so the page cannot be read;
 * it has to be counted. The truth is recomputed by the registered
 * `d_verify_binop_v1` from the two numbers the story states (disclosure 2), and
 * QG-13 independently re-derives the flag's position and compares it with the
 * `from` the params carry — so the picture, the params and the key are pinned to
 * one another twice over.
 */
function countBack(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const w = r.pick(BACK_WALKS);
      const who = r.pick(WALKERS);
      const land = w.from - w.hops;
      const pool = keyable(
        [land + 1, w.from, w.from + w.hops, w.hops, land - 1, land - 2],
        land,
        LANDING_RANGE[0],
        LANDING_RANGE[1],
      );
      const { below, above } = around(pool, land);
      // A UNIFORM TARGET, BUT ONLY BECAUSE THE POOL WAS WIDENED TO CARRY IT.
      // Every honest miscount of a backward walk except overshooting sits ABOVE
      // the landing number, so the first version had one card below and three
      // above and could not reach the top rank at all; asking for the top every
      // time then pinned the key there instead (disclosure 9). Carrying BOTH
      // overshoots — one hop too many and two — gives the deal something on each
      // side and lets a uniform target actually rotate.
      const wrongs = twoCards(r, below, above, r.int(0, 2)).map((v) => whyNotTheLanding(v, w));
      const { choices, correctKey } = makeChoices(r, String(land), wrongs);
      const draft: ItemDraft = {
        type: 'computation',
        // FOUR PAGE TYPES DRAW THIS PICTURE AND THEY MUST NOT ASK IT ALIKE. The
        // first build gave the landing page and the discrimination the identical
        // sentence, so a Day 2 that served both read as one page printed twice
        // (disclosure 10). The stories still match word for word — that is what
        // makes the discrimination a discrimination — and the QUESTIONS now do
        // not: reach / finish on / say first / should be on.
        prompt: withScene(
          'a number path with a flag on the starting step',
          `${who} stands on ${String(w.from)} and counts back ${countNoun(w.hops, 'hops')}. Which number does ${who} reach?`,
        ),
        figure: pathFigure(w.from, assertsParam('a', 'mark')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(land)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: w.from, b: w.hops, op: '-', on: 'path' },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['procedure-slip', 'representation-misread', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'walk-back-to-the-landing' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — which number do you say FIRST?
// ===========================================================================

/**
 * The rule the whole method rests on, asked as a question in its own right.
 *
 * You do not say the number you are standing on. That is not a detail of the
 * procedure, it is the procedure: a child who says it has spent a hop without
 * moving and will land one place short every time, which is precisely what the
 * puppet does two pages later. So one slot asks for nothing but the first
 * number said.
 *
 * IT IS ALSO WHAT STOPS THE WEEK CERTIFYING ITS OWN HABIT (disclosure 9). The
 * key is one below the flag whatever the hops are, so "subtract whatever two
 * numbers the page states" is wrong here — as long as the walk is longer than
 * one hop, which `FIRST_WALKS` guarantees. Together with the one direction page
 * the habit must fail, that caps it at four of six and certifies nobody.
 *
 * `{a: from, b: 1, op: '-'}` is not a fudge: the first number said in a count
 * back really is one below the number you start from, and it is the only claim
 * the page makes. The hop count rides in `hops`, where the transform cannot
 * mistake it for an operand and the collision check can still tell this page
 * apart from a landing page that drew the same flag.
 */
function firstHop(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const w = r.pick(FIRST_WALKS);
      const who = r.pick(WALKERS);
      const said = w.from - 1;
      // `from − 3` is the last candidate rather than the first because it is the
      // least likely slip on the page — but it is what keeps a start of ten and
      // two hops from running out of honest cards once ten itself is clipped
      // away (disclosure 5). A pool that can fail on one pair in twelve is a
      // pool that throws on one seed in twelve.
      const pool = keyable(
        [w.from, w.from - w.hops, w.from + 1, w.from - 2, w.from - 3],
        said,
        4,
        9,
      );
      const { below, above } = around(pool, said);
      const wrongs = twoCards(r, below, above, r.int(0, 2)).map((v) => whyNotTheFirstHop(v, w));
      const { choices, correctKey } = makeChoices(r, String(said), wrongs);
      const draft: ItemDraft = {
        type: 'representation',
        prompt: withScene(
          'a number path with a flag on the starting step',
          `${who} stands on ${String(w.from)} and counts back ${countNoun(w.hops, 'hops')}. Which number does ${who} say first?`,
        ),
        figure: pathFigure(w.from, assertsParam('a', 'mark')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(said)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: w.from, b: 1, op: '-', hops: w.hops },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['procedure-slip', 'task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'name-the-first-hop' },
      };
      return draft;
    });
}

// ===========================================================================
// The discrimination — back along the path, or on along it?
// ===========================================================================

type Way = 'back' | 'on';

/**
 * WHICH DAILY DISCRIMINATION PAGE COUNTS BACK IS DECIDED ONCE PER PACK.
 *
 * Drawn per page, two fair coins land the same way on one pack in four, and a
 * pack whose Day-2 and Day-3 pages both count back is a pack where walking the
 * wrong way was never once punished. So the coin is spent at whichever of the
 * two pages is built first and read back afterwards — a pure function of the day
 * and the one token stored in the pack's guard, so a page rebuilt by
 * `drawUniqueItem` or by the assembler's echo check gets the direction it
 * already had rather than the other day's.
 */
function backDay(rng: Rng, guard: TupleGuard): 2 | 3 {
  if (guard.taken('a17:back-day=2')) return 2;
  if (guard.taken('a17:back-day=3')) return 3;
  const day: 2 | 3 = rng.chance(0.5) ? 2 : 3;
  guard.add(`a17:back-day=${String(day)}`);
  return day;
}

const dailyWay = (day: 2 | 3) => (rng: Rng, guard: TupleGuard): Way =>
  backDay(rng, guard) === day ? 'back' : 'on';

/**
 * One of each direction inside every mastery form, dealt rather than drawn.
 *
 * Keyed on the form's own rng object, because `makeWeekBuilder` gives Form A and
 * Form B separate streams and hands the SAME stream back on a rebuild — so a
 * rebuilt page finds the direction it was already given rather than the other
 * form's, which a plain counter could not distinguish. Nothing survives the
 * pack: the streams are new every time and the entries go with them.
 *
 * The guarantee is per FORM rather than per corpus. Every form a child sits
 * carries one page of each kind, so neither blind direction can take both.
 */
const FORM_BACK_SLOT = new WeakMap<Rng, number>();

/** The two slots the deal runs over, named here rather than inferred from build order. */
const WAY_SLOTS = [2, 6] as const;

function masteryWay(slot: (typeof WAY_SLOTS)[number]) {
  return (rng: Rng, _guard: TupleGuard): Way => {
    let backSlot = FORM_BACK_SLOT.get(rng);
    if (backSlot === undefined) {
      backSlot = rng.chance(0.5) ? WAY_SLOTS[0] : WAY_SLOTS[1];
      FORM_BACK_SLOT.set(rng, backSlot);
    }
    return backSlot === slot ? 'back' : 'on';
  };
}

/**
 * One path, one flag, one number of hops, two stories — the heart of the week.
 *
 * `Baz counts back 2 hops.` or `Baz counts on 2 hops.` The picture is identical,
 * the question is identical, and one word decides everything. Both landings are
 * live keyed values, so no card can be ruled out unread, and the two habits that
 * could answer the page without listening are exactly complementary.
 *
 * The two sides print the SAME NUMERALS, which is the b09 lesson (kit §E2.9a):
 * with identical operand surfaces the freshness guard has nothing to prefer
 * between them, so a redraw cannot quietly bend the deal.
 *
 * The option pools are mirror images. A backward walk's honest misreadings are
 * the flag, the forward landing and the plus-one; a forward walk's are the flag,
 * the backward landing and its own minus-one — the same off-by-one, met counting
 * the other way, which is worth a child seeing.
 */
function whichWay(side: (rng: Rng, guard: TupleGuard) => Way, rungs: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    // Taken once per item and OUTSIDE the freshness loop: a redraw may change
    // the numbers, it may not spend the other page's direction.
    const way = side(rng, guard);
    return drawUniqueItem(rng, guard, (r) => {
      const w = r.pick(EITHER_WALKS);
      const who = r.pick(WALKERS);
      const back = w.from - w.hops;
      const on = w.from + w.hops;
      const land = way === 'back' ? back : on;
      // BOTH OVERSHOOTS ON BOTH SIDES, and that is what makes the mirror work.
      // With one overshoot each, the backward pool held three cards above the
      // key and one below and the forward pool the reverse, so neither side
      // could reach the far rank and the key sat in the middle on nearly six
      // draws in ten. Carrying "one hop too many" AND "two hops too many" in the
      // direction the story actually went gives each side a second card on its
      // own thin end.
      const pool = keyable(
        way === 'back'
          ? [back + 1, w.from, on, back - 1, back - 2]
          : [on - 1, w.from, back, on + 1, on + 2],
        land,
        1,
        PATH_TO,
      );
      const { below, above } = around(pool, land);
      // The two directions pull the key to opposite ends, so the aim is drawn
      // once and MIRRORED — the forward page asks for the rank the backward page
      // did not, and neither side has to be flattened by hand.
      const aim = r.int(0, 2);
      const wrongs = twoCards(r, below, above, way === 'back' ? aim : 2 - aim).map((v) => {
        if (v === w.from) {
          return {
            text: String(v),
            errorTag: 'representation-misread' as ErrorTag,
            rationale: 'The flag given back exactly as it was drawn. The drawing was looked at and the story was not, so the walker never left the step they began on.',
          };
        }
        if (v === (way === 'back' ? on : back)) {
          return {
            text: String(v),
            errorTag: 'concept-misconception' as ErrorTag,
            rationale: 'The right number of hops, taken towards the wrong end of the path. A single word in the story settles the direction, and this is what a child answers when that word slips past them.',
          };
        }
        return v === (way === 'back' ? back + 1 : on - 1)
          ? {
            text: String(v),
            errorTag: 'procedure-slip' as ErrorTag,
            rationale: 'The count began on the flag, so one of the hops was spent standing still and the walk finished a place short of where the story sent it.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip' as ErrorTag,
            rationale: 'A hop or two too many, taken in the right direction. The counting words kept going after the story had stopped, which is the commonest slip once a walk is longer than two steps.',
          };
      });
      const { choices, correctKey } = makeChoices(r, String(land), wrongs);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: withScene(
          'a number path with a flag on the starting step',
          way === 'back'
            ? `${who} stands on ${String(w.from)} and counts back ${countNoun(w.hops, 'hops')}. Which number does ${who} finish on?`
            : `${who} stands on ${String(w.from)} and counts on ${countNoun(w.hops, 'hops')}. Which number does ${who} finish on?`,
        ),
        figure: pathFigure(w.from, assertsParam('a', 'mark')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(land)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `told` records which way the story sent the walker. The op already
          // says it on the forward draw and does not on the backward one, where
          // this page and three others would otherwise pin an identical core
          // (disclosure 11).
          params: { a: w.from, b: w.hops, op: way === 'back' ? '-' : '+', told: way },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['concept-misconception', 'representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'which-way-along-the-path', isDiscrimination: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 3 — the puppet who starts counting on the flag
// ===========================================================================

/**
 * A named puppet walks the path and says the first number too soon, so he stops
 * one place short — and his number is computed rather than authored:
 * `a_verify_countback_slip_v1` returns `{from − hops, from − hops + 1}` from the
 * page's own walk (disclosure 1). QG-11 checks both halves at every seed: the
 * keyed option against the truth, and the prompt against the misconception's own
 * output. The word "wrong" is nowhere on the page; what it says is what he did.
 *
 * His number is always one ABOVE the truth, so the key can never be the largest
 * card here — that is what an error-analysis page costs. The third card's side
 * is drawn rather than fixed, because taking it from below every time put the
 * key at the middle rank on nearly every draw (disclosure 9). A child who has
 * worked out that the puppet is never right still faces a choice of two, which
 * is the floor a01, a12, a14 and a16 all reported, and the only way past it is
 * to let him sometimes be right.
 */
function puppetOnThePath(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const w = r.pick(PUPPET_WALKS);
      const puppet = r.pick(PUPPETS);
      const land = w.from - w.hops;
      const said = land + 1;
      // The interval this slot keys is 1–8; `said` is allowed above it because it
      // is the misconception's own output and must be on the page (disclosure 5).
      // Everything else is split around the truth and around the puppet, because
      // a third card between them would sit at the same rank as his and make the
      // page a choice of two wearing three coats.
      const under = keyable([land - 1, land - 2, w.hops], land, 1, 8).filter((v) => v < land);
      const over = keyable([w.from, w.from + w.hops], land, 1, 8).filter((v) => v > said);
      // THE SIDE IS DRAWN, NOT FIXED, AND THE COIN IS WEIGHTED (disclosure 9).
      // The puppet's number is always one above the truth, so a third card taken
      // from below pins the key to the MIDDLE rank; taken from above it puts the
      // key at the bottom. A fair coin measured 37/63, because a start of nine or
      // ten leaves nothing above the puppet inside the interval this slot can
      // key and forces the middle on two draws in seven. Leaning towards the
      // high side by the same margin brings it back to roughly even. The key can
      // still never be the largest card here — that is what error analysis costs,
      // and the only way past it is to let the puppet sometimes be right.
      const third = under.length > 0 && (over.length === 0 || r.chance(0.35))
        ? r.pick(under)
        : r.pick(over.length > 0 ? over : under);
      const { choices, correctKey } = makeChoices(r, String(land), [
        {
          text: String(said),
          errorTag: 'procedure-slip',
          rationale: 'The puppet\'s own number: he counted the flag as his first hop, so he used a hop up without moving and finished one place short of the story.',
        },
        whyNotTheLanding(third, w),
      ]);
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: withScene(
          'a number path with a flag on the starting step',
          `${puppet} stands on ${String(w.from)} and counts back ${countNoun(w.hops, 'hops')}. ${puppet} says ${String(said)}. Tap the number ${puppet} should be on.`,
        ),
        figure: pathFigure(w.from, assertsParam('a', 'mark')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(land)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_verify_countback_slip_v1',
          params: { a: w.from, b: w.hops },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['procedure-slip', 'representation-misread', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'find-the-puppets-first-hop', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — take-apart, the one page where the path is put away
// ===========================================================================

/**
 * The catalog's second computational focus: take-apart with pictures and
 * numerals.
 *
 * A whole is spoken, a part is drawn, and the part that is NOT drawn has to be
 * worked out. This is the only page in the week whose answer cannot be reached
 * by walking, because there is nothing to walk along: the covered counters are
 * under one cloth, so counting them is not available and taking the whole apart
 * is. It is also the page that carries the week's numbers up to ten in a second
 * representation, which is what stops "count back" from being a trick that only
 * works on a picture of a path.
 *
 * `coverStyle: 'single'` is load-bearing and comes from a12's measurement: the
 * default draws one cover per hidden counter, and a child who can COUNT the
 * covers has not taken anything apart.
 */
function hiddenPart(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const whole = r.int(6, PATH_TO);
      const shown = r.int(1, whole - 1);
      const who = r.pick(WALKERS);
      const hiding = whole - shown;
      const pool = keyable([shown, whole, hiding + 1, hiding - 1], hiding, 1, 9);
      const { below, above } = around(pool, hiding);
      const wrongs = twoCards(r, below, above, r.int(0, 2)).map((v) => {
        if (v === shown) {
          return {
            text: String(v),
            errorTag: 'task-comprehension' as ErrorTag,
            rationale: 'The counters in view, handed over for the ones that are not. That number needed no working out, so nothing here was taken apart at all.',
          };
        }
        if (v === whole) {
          return {
            text: String(v),
            errorTag: 'concept-misconception' as ErrorTag,
            rationale: 'The whole group named as one of its own pieces. Spreading a cloth over some counters changes nothing about how many there are, and a child who answers this heard the total and stopped listening.',
          };
        }
        return v > hiding
          ? {
            text: String(v),
            errorTag: 'procedure-slip' as ErrorTag,
            rationale: 'Over by one. The count up from the visible counters set off a place late and claimed a cell the cloth does not cover.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip' as ErrorTag,
            rationale: 'Under by one. The count up from the visible counters stopped while there was still cloth left to account for.',
          };
      });
      const { choices, correctKey } = makeChoices(r, String(hiding), wrongs);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: withScene(
          'a counting frame with a cloth over part of it',
          `${who} has ${countNoun(whole, 'counters')}. Some are under the cloth. How many does it cover?`,
        ),
        figure: tenFrame(shown, {
          size: 10,
          hidden: hiding,
          coverStyle: 'single',
          alt: FRAME_ALT,
          asserts: assertsAnswerOf('hidden'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(hiding)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: whole, b: shown, op: '-', part: 'covered' },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['task-comprehension', 'concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'take-the-whole-apart' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — the Day-4 real-world walk
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family has no story generator, so this week's four places are set out below.
 *
 * All four are places where the numbers really are laid out in a line and a
 * person really does move along them, which is what makes the path the honest
 * picture rather than a diagram bolted on: stairs are numbered, stepping stones
 * are counted, hopscotch squares are chalked in order and bus stops come one
 * after another. Each frame supplies a place, a moving verb and a question; the
 * walk itself is DRAWN, so no scene is welded to a number.
 *
 * THE PLACE STAYS IN THE STORY AND OUT OF THE PICTURE. No primitive draws a
 * staircase or a stream, so an alt naming one would describe something that is
 * not on the screen (the L27 class). What is drawn is the path, so that is what
 * the alt says, and where it happens is narration that belongs in the question.
 */
type Place = 'stairs' | 'stones' | 'hopscotch' | 'stops';

interface Frame {
  line: (who: string, from: number, hops: number) => string;
  ask: string;
  rungs: string[];
}

/**
 * FOUR frames for three daily stories: the fourth belongs to the certifying
 * slot. With three, the mastery page would have to borrow one, and a pack that
 * visits the same staircase three times in a week looks short of ideas rather
 * than deliberate.
 */
const FRAMES: Record<Place, Frame> = {
  stairs: {
    line: (who, from, hops) => `${who} sits on stair ${String(from)} and climbs down ${countNoun(hops, 'stairs')}.`,
    ask: 'Which stair is under those feet now?',
    rungs: ['The bottom of the stairs holds the small numbers.', 'Go down one stair for each one counted.'],
  },
  stones: {
    line: (who, from, hops) => `${who} waits on stone ${String(from)} and hops back ${countNoun(hops, 'stones')}.`,
    ask: 'Which stone is holding those feet now?',
    rungs: ['Which stone did the story begin on?', 'Hop towards the bank, one stone each time.'],
  },
  hopscotch: {
    line: (who, from, hops) => `${who} lands on square ${String(from)} and jumps back ${countNoun(hops, 'squares')}.`,
    ask: 'Which chalk square is under those shoes?',
    rungs: ['The chalk squares are numbered in order.', 'Jump the other way, and count each jump.'],
  },
  stops: {
    line: (who, from, hops) => `${who} rides to stop ${String(from)} and goes back ${countNoun(hops, 'stops')}.`,
    ask: 'Which stop does the bus reach then?',
    rungs: ['The bus turns round and goes the other way.', 'Count the stops it passes, one at a time.'],
  },
};

function hopStory(place: Place): ItemGen {
  const frame = FRAMES[place];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const w = r.pick(BACK_WALKS);
      const who = r.pick(WALKERS);
      const land = w.from - w.hops;
      const pool = keyable(
        [land + 1, w.from, w.from + w.hops, w.hops, land - 1, land - 2],
        land,
        LANDING_RANGE[0],
        LANDING_RANGE[1],
      );
      const { below, above } = around(pool, land);
      const wrongs = twoCards(r, below, above, r.int(0, 2)).map((v) => whyNotTheLanding(v, w));
      const { choices, correctKey } = makeChoices(r, String(land), wrongs);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: withScene(
          'a number path with a flag on the starting step',
          `${frame.line(who, w.from, w.hops)} ${frame.ask}`,
        ),
        figure: pathFigure(w.from, assertsParam('a', 'mark')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(land)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: w.from, b: w.hops, op: '-', place },
          seed: r.uint(),
        },
        hintLadder: ladder(...frame.rungs),
        errorTags: ['procedure-slip', 'representation-misread', 'task-comprehension'],
        // 'part-whole' and not 'separate'. `SituationType` carries 'combine',
        // 'comparison' and 'part-whole' and has no SEPARATE member, so a walk
        // backwards along a path has to borrow the nearest thing the union can
        // say. a16 recorded this first and A18 will hit it next: the early-years
        // taxonomy is join / separate / part-part-whole / compare, and the second
        // of those still has no name in the type.
        authorMeta: { stepCount: 1, cognitiveOp: 'walk-back-in-a-story', situationType: 'part-whole' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generators 6 and 7 — the Day-5 pair
// ===========================================================================

/**
 * The recipe's Day-5: match the story to the number sentence (disclosure 7).
 *
 * A story is told over the path and three sentences are offered. The keyed one
 * says what happened; one goes the other way along the path and one takes the
 * wrong number of hops, so the three cards differ by exactly one symbol each and
 * a child has to hear both halves of the story to pick between them.
 *
 * NOTHING IN THE REGISTRY CAN READ A SENTENCE, so the pin proves the keyed
 * card's ARITHMETIC rather than the match: `d_verify_binop_v1` recomputes what
 * that sentence comes to, and the figure proves its first number is the one
 * under the flag. The match itself cannot come apart, because a single drawn
 * boolean writes the story's verb, the card's sign and the params' `op` in the
 * same expression — there is no path by which the three disagree.
 *
 * The direction is drawn here rather than dealt. This page certifies nothing and
 * a mastery form never sees it, so what matters is that both sentences are
 * reachable, which keeps either card from being learnable as "the one that is
 * never right".
 */
function matchSentence(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const w = r.pick(SENTENCE_WALKS);
      const who = r.pick(WALKERS);
      const forward = r.chance(0.5);
      const sign = forward ? '+' : '−';
      const other = forward ? '−' : '+';
      const missHops = r.pick(otherHops(w));
      const { choices, correctKey } = makeChoices(r, `${String(w.from)} ${sign} ${String(w.hops)}`, [
        {
          text: `${String(w.from)} ${other} ${String(w.hops)}`,
          errorTag: 'concept-misconception',
          rationale: 'The right numbers with the sign that sends them the other way. The sentence is being matched to the numbers it contains rather than to the move the story made.',
        },
        {
          text: `${String(w.from)} ${sign} ${String(missHops)}`,
          errorTag: 'procedure-slip',
          rationale: 'The right move with the wrong number of hops. The direction was heard and the count was not, which is what happens when only the first half of a story is listened to.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: withScene(
          'a number path with a flag on the starting step',
          forward
            ? `${who} stands on ${String(w.from)} and counts on ${countNoun(w.hops, 'hops')}. Tap the sentence for this walk.`
            : `${who} stands on ${String(w.from)} and counts back ${countNoun(w.hops, 'hops')}. Tap the sentence for this walk.`,
        ),
        figure: pathFigure(w.from, assertsParam('a', 'mark')),
        choices,
        answer: {
          // TWO SURFACES OF ONE CLAIM, and the second is what keeps the pin
          // alive. `d_verify_binop_v1` returns a NUMBER, so it cannot read a
          // sentence; recording the number the keyed sentence comes to lets
          // QG-11 recompute the arithmetic the card asserts. What that check
          // does NOT prove is the MATCH — see disclosure 7 for why the match
          // cannot come apart anyway.
          value: correctKey,
          acceptableForms: [`${String(w.from)} ${sign} ${String(w.hops)}`, String(forward ? w.from + w.hops : w.from - w.hops)],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: w.from, b: w.hops, op: forward ? '+' : '-', sentence: true },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'match-the-number-sentence', isDiscrimination: true },
      };
      return draft;
    });
}

/**
 * The catalog's Day-5 non-computational focus — solve and colour — in the only
 * form that exists (disclosure 7).
 *
 * The row is drawn by code, the answer is worked out by the child, and the
 * colouring is what shows it. `manual-review`, because nothing can grade a
 * crayon; the number the colouring must come to is recorded in `answer.value`
 * and the figure asserts the row it was drawn from, so the picture and the key
 * cannot part company. `'set'` was the other candidate and is the wrong one: it
 * sits in `needsTypedEntry` and puts a text box in front of a four-year-old,
 * which a12 reported and which is still open.
 */
function colourWhatIsLeft(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const w = r.pick(BACK_WALKS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const who = r.pick(WALKERS);
      const land = w.from - w.hops;
      const draft: ItemDraft = {
        type: 'drawing',
        prompt: withScene(
          `${countNoun(w.from, noun)} in a row`,
          `${who} had ${countNoun(w.from, noun)}. ${String(w.hops)} of them rolled away. Colour the ones still there.`,
        ),
        figure: counters(w.from, noun, {
          arrangement: 'in a row',
          alt: `a row of ${noun} side by side`,
          asserts: assertsParam('a'),
        }),
        answer: {
          value: String(land),
          acceptableForms: [`${countNoun(land, noun)} coloured`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: w.from, b: w.hops, op: '-', colour: true },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'colour-what-is-still-there' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 8 — give a family warm-up the cards and the alt it needs
// ===========================================================================

/**
 * At this band a numeric item with no authored `choices` does not become a
 * free-entry page. It becomes four buttons a render-time function guesses at
 * without knowing what range the slot's answer lives in (L53) — for a child who
 * could not type into a box anyway. All four warm-ups arrive from the family
 * that way, so each is handed three authored cards drawn from the honest
 * miscounts ITS OWN question produces, clipped to the interval that question can
 * reach, with the truth's rank put through the dealer the core pages use.
 *
 * It also takes back an audit that would otherwise be lost: QG-5 does not
 * re-derive an `answerFor` for a `choice-key` item, so the wrapper re-reads the
 * item's own `generator.params`, recomputes the answer independently, and
 * refuses to build if the picture and the key have parted company. Nothing is
 * drawn before `base` runs and neither the prompt nor the figure is touched, so
 * the surface QG-1 signs is the one the family produced.
 */
function withTapCards(
  base: ItemGen,
  truthOf: (params: Record<string, unknown>) => number,
  range: readonly [number, number],
  poolOf: (n: number, params: Record<string, unknown>) => number[],
  whyOf: (v: number, n: number, params: Record<string, unknown>) => Card,
): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error('A17 withTapCards: nothing to check against — this warm-up reached the wrapper without params');
    const n = truthOf(params);
    const stated = [draft.answer.value, ...draft.answer.acceptableForms];
    if (!Number.isInteger(n) || !stated.includes(String(n))) {
      throw new Error(
        `A17 withTapCards: ${draft.generator?.templateId ?? 'an item'} keys "${draft.answer.value}" while its own params compute ${String(n)}`,
      );
    }
    const { below, above } = around(keyable(poolOf(n, params), n, range[0], range[1]), n);
    const { choices, correctKey } = makeChoices(
      rng,
      String(n),
      twoCards(rng, below, above, rng.int(0, 2)).map((v) => whyOf(v, n, params)),
    );
    return {
      ...draft,
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
    };
  };
}

/**
 * REWRITE A FAMILY ALT THAT NAMES A QUANTITY, WITHOUT REACHING INTO `lib/`.
 *
 * Two of this week's four warm-ups arrive with a number inside the picture's
 * accessible name — `pictureTakeAway` says how many are crossed out, and
 * `tenFrameRead` names the frame's capacity, which is the answer itself on a
 * full frame. At this band the alt is autoplayed before the question, so the
 * bar the week holds itself to is absolute: no digit and no number word in any
 * alt, whether or not it happens to be the answer this draw (L48).
 *
 * The replacement describes the same drawing and says less, which is the only
 * honest direction to move an alt in. **Recorded for the orchestrator, and this
 * is a shared-library defect rather than a week's: `pictureTakeAway`,
 * `partnersHiding` and `joinOrTakeAway` all interpolate a count into their alt,
 * and `frameName` puts a number word into every ten-frame page in Level A.**
 * a14's repair of `pictureJoin` fixed one of the family; the rest are untouched.
 */
function withPlainAlt(base: ItemGen, altOf: (draft: ItemDraft) => string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.figure) {
      throw new Error('A17 withPlainAlt: this warm-up carries no figure, so it has no alt to repair');
    }
    // The spread keeps every param and the assertion untouched; only the alt
    // moves. The assertion is what QG-13 audits, and it is not read from prose.
    const figure = { ...draft.figure, alt: altOf(draft) } as BBFigure;
    return { ...draft, figure };
  };
}

/** The kind of thing a family prompt drew, read back so an alt can name it. */
function nounIn(draft: ItemDraft): string {
  return (
    COUNTABLE_NOUNS.find((n) => draft.prompt.includes(n) || draft.prompt.includes(unitFor(1, n))) ??
    'things'
  );
}

// ===========================================================================
// The week's generators, bound and given this week's voice
// ===========================================================================

// --- the four warm-ups ------------------------------------------------------

/**
 * A16 — last week's cross-out, on the day the method moves off it.
 *
 * Its cards are the two counts the picture holds and one whisper either side of
 * the truth. A take-away inside five leaves one, two, three or four and all four
 * are keyed across the seeds, so nothing here can be struck out before it is
 * read.
 */
const warmCrossOut = asWarmUp(
  withPlainAlt(
    withLadder(
      withTapCards(
        pictureTakeAway({ min: 2, max: 5 }),
        (p) => Number(p.a) - Number(p.b),
        [1, 4],
        // The two counts the picture holds, last week's headline slip (the two
        // added instead of taken apart) and one whisper either side. Without the
        // added pair, a take-away of one from two has a single honest card in
        // range and the deal has nothing to work with.
        (n, p) => [Number(p.a), Number(p.b), Number(p.a) + Number(p.b), n + 1, n - 1, n - 2],
        (v, n, p) => {
          if (v === Number(p.a) + Number(p.b)) {
            return {
              text: String(v),
              errorTag: 'concept-misconception',
              rationale: 'The two counts added. The marks were read as a second group arriving rather than as a group leaving, which is the slip A16 spent a week naming.',
            };
          }
          if (v === Number(p.a)) {
            return {
              text: String(v),
              errorTag: 'representation-misread',
              rationale: 'Every drawn thing counted, the marked ones included. A line through something has been taken for a decoration instead of for the reason it no longer belongs to the group.',
            };
          }
          if (v === Number(p.b)) {
            return {
              text: String(v),
              errorTag: 'task-comprehension',
              rationale: 'The marked run counted for a question about the run beside it. Which of the two the words wanted was never settled.',
            };
          }
          return v > n
            ? {
              text: String(v),
              errorTag: 'procedure-slip',
              rationale: 'Over by one. The finger kept travelling once it reached the marks and gave a number to the first thing that had already gone.',
            }
            : {
              text: String(v),
              errorTag: 'procedure-slip',
              rationale: 'Under by one or two. The finger arrived at the marks before the words did, leaving a standing thing with no number of its own.',
            };
        },
      ),
      ladder('Some of these have a mark on them.', 'Count the ones the mark missed.'),
    ),
    (d) => `a row of ${nounIn(d)} with a line through some of them`,
  ),
  16,
);

/**
 * A6 — one step backwards along the path, which is the atom this whole week is
 * built out of. Its pool is clipped to the interval its own question reaches:
 * a step back from three to nine lands between two and eight, so nine is never
 * offered and neither is one.
 */
const warmStepBack = asWarmUp(
  withLadder(
    withTapCards(
      neighbourNumber({ kind: 'before', min: 3, max: 9 }),
      (p) => Number(p.n) - 1,
      [2, 8],
      // The number already on the path, one forward, and two or three back. The
      // three-back candidate is what keeps a start of nine in cards once the
      // forward pair falls outside the interval this question can key.
      (n) => [n + 1, n + 2, n - 1, n - 2, n - 3],
      (v, n) => (v === n + 1
        ? {
          text: String(v),
          errorTag: 'task-comprehension',
          rationale: 'The number the question already gave, offered straight back. Nothing has moved, so no step has been taken.',
        }
        : v > n
          ? {
            text: String(v),
            errorTag: 'concept-misconception',
            rationale: 'A move up the path, when the question sent the walk the other way entirely.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'More than the single step that was asked for, so the walk overshot the empty place it was meant to fill.',
          }),
    ),
    ladder('The numbers shrink towards one end of this path.', 'Move that way once, and stay there.'),
  ),
  6,
);

/**
 * A14 — a join, on the day the count-ON side of the discrimination arrives. A
 * child who cannot put two groups together has nothing to be confused with, and
 * the confusion is the point of Day 3.
 */
const warmJoin = asWarmUp(
  withLadder(
    withTapCards(
      pictureJoin({ min: 1, max: 4, maxTotal: 5 }),
      (p) => Number(p.a) + Number(p.b),
      [2, 5],
      // A join of one and one totals two, which is the bottom of the interval
      // this question can key — so both the smaller group and the count-one-short
      // fall outside it and the over-counts are all that is left. Two of them are
      // carried for that draw alone.
      (n, p) => {
        const bigger = Math.max(Number(p.a), Number(p.b));
        return [bigger, n - 1, n + 1, n + 2, n - 2];
      },
      (v, n, p) => {
        if (v === Math.max(Number(p.a), Number(p.b))) {
          return {
            text: String(v),
            errorTag: 'task-comprehension',
            rationale: 'One bunch offered for both of them. The count halted at the end of the first bunch and the second was never reached at all.',
          };
        }
        return v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Over by one or two. Something near the join answered to two numbers as the count crossed from one bunch into the other.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Under by one or two. The words ran out before the things did, most often at the point where the two bunches meet.',
          };
      },
    ),
    ladder('Both these bunches stay in the picture.', 'One number has to cover them together.'),
  ),
  14,
);

/**
 * A2 — reading a frame past five, because this is the first week whose numbers
 * go to ten and a child who still counts every counter from one will never get
 * a walk of three finished. Held to six through nine, so the alt's repaired
 * wording cannot collide with a full frame.
 */
const warmFrame = asWarmUp(
  withPlainAlt(
    withLadder(
      withTapCards(
        tenFrameRead({ min: 6, max: 9 }),
        (p) => Number(p.n),
        [6, 9],
        (n) => [n + 1, n - 1, n + 2, n - 2],
        (v, n) => (v > n
          ? {
            text: String(v),
            errorTag: 'representation-misread',
            rationale: 'Over by one or two. The filled row was tallied and then tallied again as the eye dropped to the loose counters underneath.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Under by one or two. The tally of the loose counters gave up early, which is what happens when a filled row is not yet trusted as a single thing.',
          }),
      ),
      ladder('The top row of this frame is full.', 'Start from a full row and count on.'),
    ),
    () => 'a counting frame whose top row is full, with a few more counters beneath it',
  ),
  2,
);

// --- the core forms, each in its own voice ----------------------------------

const meetsTheWalk = countBack(
  ladder('Put a finger on the flag first.', 'Now step back, saying a number each time.'),
);
const walksAgain = countBack(
  ladder('The flag is where you begin, not where you stop.', 'Say a new number for every step back.'),
);
const walksOnDayTwo = countBack(
  ladder('Which way do the numbers get smaller?', 'Walk that way and count the steps.'),
);
const namesTheFirst = firstHop(
  ladder('You are standing on that number already.', 'So which one comes next going down?'),
);
const namesTheFirstAgain = firstHop(
  ladder('The first hop moves you off the flag.', 'Name the number you land on there.'),
);
const listenDayTwo = whichWay(
  dailyWay(2),
  // BOTH RUNGS MUST BE TRUE OF BOTH STORIES: the dedup gate stays seed-invariant
  // only while a slot's help holds still, so the help names the decision and
  // leaves the answer to the story.
  ladder('Listen again. Was it back, or on?', 'That one word decides which way you walk.'),
);
const listenDayThree = whichWay(
  dailyWay(3),
  ladder('Both stories set off from the very same flag.', 'The words alone decide where the feet go.'),
);
const puppetDayThree = puppetOnThePath(
  ladder('The puppet said a number without moving.', 'Start again and move on the very first count.'),
);
const puppetDayFive = puppetOnThePath(
  ladder('Walk beside the puppet and watch the first move.', 'One hop, one new number. Where does that end?'),
);
const takesApart = hiddenPart(
  ladder('You cannot count what the cloth is hiding.', 'Count on from what you can see instead.'),
);
const storyStairs = hopStory('stairs');
const storyStones = hopStory('stones');
const storyHopscotch = hopStory('hopscotch');
const matchesTheSentence = matchSentence(
  ladder('Say the story again in your head.', 'Which sign goes with the way they walked?'),
);
const coloursWhatIsLeft = colourWhatIsLeft(
  ladder('Count the whole row before you colour.', 'Leave the ones that rolled away plain.'),
);

// --- the six certifying slots -----------------------------------------------

const masteryWalk = countBack(
  ladder('Find the flag, then get ready to move.', 'Count the hops, and stop when the story does.'),
);
const masteryWayOne = whichWay(
  masteryWay(2),
  ladder('One word in that story changes everything.', 'Work out which way, then walk it.'),
);
const masteryStory = hopStory('stops');
const masteryFirst = firstHop(
  ladder('Nobody counts the place they are standing.', 'The first number said is the next one down.'),
);
const masteryPuppet = puppetOnThePath(
  ladder('Something went astray on the very first hop.', 'Walk it yourself and see where it ends.'),
);
const masteryWayTwo = whichWay(
  masteryWay(6),
  ladder('Repeat the story to yourself first.', 'Were the feet heading up, or heading down?'),
);

// ===========================================================================
// The week
// ===========================================================================

export const buildA17 = makeWeekBuilder({
  level: 'A',
  week: 17,
  conceptId: 'subtraction-within-10',
  conceptName: 'Subtraction within 10',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [
    { level: 'A', week: 15 },
    { level: 'A', week: 16 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'counting back along the path',
  /**
   * BB-G1 (§6.13). Declared because the week genuinely deepens A16, not because
   * the gate demands it — as disclosure 12 records, the ledger's family key does
   * not connect `meeting-subtraction` to `subtraction-within-10`, so the
   * precondition never fires and the absence of this string would have shipped.
   */
  deepeningDelta:
    'A16 met taking away as an ACTION performed on a picture: the whole group was drawn, the part that went was struck through, and what remained was there to be counted. Everything stayed inside five and every answer could be found by looking. A17 turns that action into a METHOD. The picture becomes one number path, nothing is struck out and nothing is removed, and the answer is not on the page at all — it is where a backward walk ends. Three things are new. The numbers reach ten, so counting every object from one stops being affordable and counting back from the number you are on starts paying. The procedure carries its own error, the off-by-one at the start, which a cross-out picture cannot even express; it is named in the lesson, made into a certifying slot of its own and given to the puppet. And the discrimination changes kind: A16 asked whether a story removes or joins, while A17 gives that away in the first sentence and asks which DIRECTION along the path it sends you, which is a question about the method rather than about the situation. The catalog\'s second half, take-apart with pictures and numerals, arrives as the page where the path is put away and part of a whole is hidden under a cloth, so the week\'s numbers are met in a second representation as well.',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt is spoken; a page carries a single question; the tap targets are large. Every picture in this week is the same number path, drawn end to end with every step numbered and a flag on the step the story starts from — no page ever draws the hops, because the hops are what the child is being asked to take. Do it on the floor before the screen: chalk or tape a line of numbers, stand your child on one of them, and say "count back three". Listen for what they say first. A child who says the number they are standing on has found the one mistake this week is about, and the fix is a single sentence: that one is where you are, not a step you took. Mascot present.',
  },
  explanation: {
    hook: spoken(
      'Mirela is standing on stair eight. She wants to climb down three stairs. Which stair will she be on? Let us walk it and find out.',
    ),
    whyBeforeHow: spoken(
      'Taking away can be walked, not only crossed out. We know because every step backwards is one less. So we start by counting back along the path. Put a finger on the number you are on. Then move it back, once for each one that goes.',
    ),
    script: [
      {
        say: spoken('Here is our number path. Mirela is on eight.'),
        visual: 'The number path from end to end, with a flag standing on the eight.',
        figure: numberLine(
          { min: PATH_FROM, max: PATH_TO, step: 1, labels: 'all', marks: [{ at: 8, style: 'flag' }] },
          { alt: PATH_ALT },
        ),
      },
      {
        say: spoken('Watch my finger. Three hops back: seven, six, five.'),
        visual: 'Three arcs hopping backwards from the eight, landing on the five.',
        figure: walkedFigure(8, 3),
      },
      {
        say: spoken('I did not say eight. Eight is where I began.'),
        visual: 'The flag standing on eight while the first arc leaves it — eight is a place, not a hop.',
        figure: walkedFigure(8, 1),
      },
      {
        say: spoken('She lands on five. We write it: 8 − 3 = 5.'),
        visual: 'The count-back sentence 8 − 3 = 5 written out large, with the 5 underlined.',
        // The three hops are drawn above; this is the line that records them.
        // The 5 is underlined because it is where the walk STOPPED — the
        // vocabulary entry "number sentence" three lines down is this picture.
        figure: mathSentence(
          [{ text: '8' }, { text: '−' }, { text: '3' }, { text: '=' }, { text: '5', mark: 'underline' }],
          { alt: 'the number sentence eight minus three equals five written out large, with the five underlined' },
        ),
      },
    ],
    summary: spoken(
      'Start on the number you are given. Do not say it. Say the next one down, and keep going. One number for every hop. Where you stop is the answer.',
    ),
    vocabulary: [
      { term: 'count back', kidGloss: 'say the numbers going down, one for each hop' },
      { term: 'number path', kidGloss: 'a line of numbers you can walk along' },
      { term: 'hop', kidGloss: 'a single jump onto the number next door' },
      { term: 'number sentence', kidGloss: 'numbers and signs that say what happened' },
    ],
  },
  guidedExamples: [
    {
      // Every guided-example bracket names three numbers, which is what a worked
      // example is for — and it keeps the assembler's echo check off the day
      // pages, since no generated item in this week ever prints three counts.
      ...ge(
        17,
        1,
        'modeled',
        withScene('a path with a flag on 9 and hops back to 7', 'Aiko stands on 9 and counts back 2 hops. Which number does Aiko reach?'),
        [
          {
            teacherSay: spoken('Watch my finger. I do not say the number I am on.'),
            expected: 'the finger resting on the flag, not moving yet',
          },
          { teacherSay: spoken('So what do I say on my very first hop?') },
          { childDo: spoken('Hop back and say the next number down.'), expected: '8' },
          { teacherSay: spoken('Then one more hop. That is two hops.'), expected: '7' },
        ],
        '7',
      ),
      visual: 'The path with a flag on the nine and two arcs hopping back to a dot on the seven.',
      figure: walkedFigure(9, 2, assertsAnswerOf('mark:1')),
    },
    {
      ...ge(
        17,
        2,
        'completion',
        withScene('a path with a flag on 6 and hops back to 3', 'Feliks stands on 6 and counts back 3 hops. Which number does Feliks reach?'),
        [
          { teacherSay: spoken('Three hops. The first one lands on five, so...') },
          { childDo: spoken('Keep hopping and counting until three are done.'), expected: '3' },
          { teacherSay: spoken('Three hops, three numbers said. You never said six.') },
        ],
        '3',
      ),
      visual: 'The path with a flag on the six and three arcs hopping back to a dot on the three.',
      figure: walkedFigure(6, 3, assertsAnswerOf('mark:1')),
    },
    {
      ...ge(
        17,
        3,
        'prompted',
        withScene('a path with a flag on 5 and hops on to 8', 'Nomi stands on 5 and counts on 3 hops. Which number does Nomi finish on?'),
        [
          { teacherSay: spoken('Careful. Nobody walked backwards in this one.') },
          { childDo: spoken('Hop the other way, three times, and count.'), expected: '8' },
          { teacherSay: spoken('The minus sign walks back. The plus sign walks on.') },
        ],
        '8',
      ),
      visual: 'The path with a flag on the five and three arcs hopping forwards to a dot on the eight.',
      figure: numberLine(
        {
          min: PATH_FROM,
          max: PATH_TO,
          step: 1,
          labels: 'all',
          marks: [
            { at: 5, style: 'flag' },
            { at: 8, style: 'point' },
          ],
          hops: [
            { from: 5, to: 6 },
            { from: 6, to: 7 },
            { from: 7, to: 8 },
          ],
        },
        {
          alt: 'a straight path with numbered steps, a flag, arcs hopping forwards and a dot where they end',
          asserts: assertsAnswerOf('mark:1'),
        },
      ),
    },
    {
      ...ge(
        17,
        4,
        'independent',
        withScene('a path with a flag on 10 and hops back to 8', 'Tove stands on 10 and counts back 2 hops. Which number does Tove reach?'),
        [{ childDo: spoken('Move off the flag on the first count.'), expected: '8' }],
        '8',
      ),
      visual: 'The path with a flag on the ten and two arcs hopping back to a dot on the eight.',
      figure: walkedFigure(10, 2, assertsAnswerOf('mark:1')),
    },
  ],
  days: [
    // Day 1 — the walk met, and the rule about where it starts.
    [
      { gen: warmCrossOut, diff: 2 },
      { gen: meetsTheWalk, diff: 2 },
      { gen: walksAgain, diff: 2 },
      { gen: namesTheFirst, diff: 3 },
    ],
    // Day 2 — the first page where the story picks the direction, and the whole
    // taken apart where no walking is possible.
    [
      { gen: warmStepBack, diff: 2 },
      { gen: walksOnDayTwo, diff: 2 },
      { gen: listenDayTwo, diff: 3 },
      { gen: takesApart, diff: 3 },
    ],
    // Day 3 — the direction again, the start rule again, and the puppet who
    // breaks it.
    [
      { gen: warmJoin, diff: 2 },
      { gen: listenDayThree, diff: 3 },
      { gen: namesTheFirstAgain, diff: 3 },
      { gen: puppetDayThree, diff: 3 },
    ],
    // Day 4 — one walk happening somewhere real, three times over.
    [
      { gen: warmFrame, diff: 2 },
      { gen: storyStairs, diff: 3 },
      { gen: storyStones, diff: 3 },
      { gen: storyHopscotch, diff: 3 },
    ],
    // Day 5 — say it as a sentence, colour what survived, settle the puppet.
    [
      { gen: matchesTheSentence, diff: 3 },
      { gen: coloursWhatIsLeft, diff: 2 },
      { gen: puppetDayFive, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // Day-5 only. `validator.ts` (S-SCHEMA) rejects a strip on Days 1–4 and
    // `PuzzleGrove.tsx` renders Day 5's, hardcoded; FILL-ARCHITECTURE §1 was
    // amended to match on 2026-08-09, so this is the spec and not a deviation.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: last week your child learned to see what is left. This week they learn to work it out without looking, by counting backwards, and there is exactly one thing worth listening for. Ask them to count back three from eight. If the first word out of their mouth is "eight", you have heard the mistake this whole week is built around — and it is not carelessness, it is a perfectly sensible guess, because when we count FORWARDS we do say the number we start on. Counting back is the other way round: the number under your finger is where you are, not a step you have taken, so the first thing you say is seven. Say that sentence out loud with them a few times and it usually lands in a day or two. Two easy ways to practise without a screen. Draw a line of numbers on the pavement with chalk, stand on one and take real steps backwards, saying a number as each foot lands. Or count down the stairs together, which is the same walk with the numbers already painted on it. If they lose their place halfway, that is a different slip and a much easier one — slow the hops down until one number goes with one movement, and no more. What you should NOT expect yet is the written sentence. Your child will hear "eight take away three is five" well ahead of the day anyone asks them to write it down, and hearing it said while the path is in front of them is exactly the right amount for now.',
  ],
  /**
   * The puzzle asks the question no page in the week keys: not where the walk
   * ends, but how far it went — and it asks for it as a DOING task rather than a
   * tapping one, which is the band's sanctioned form. Every day page hands the
   * child a flag and a number of hops; here the two ends are given and the hops
   * are theirs to make and mark.
   *
   * It is also the only place where the off-by-one leaves a trace. A child who
   * rings the number they are standing on finishes with one ring too many, and
   * can see it without anybody saying so.
   *
   * It carries no `asserts` (disclosure 8): what the picture can compute is a
   * mark's position and what the item asks for is a count of hops, and
   * `figureValue` has no selector for the second. One drawn start and one drawn
   * finish fix both, so they cannot disagree.
   */
  puzzle: (r) => {
    const from = r.int(5, PATH_TO);
    // TWO TO FOUR HOPS, and the ceiling is the point. Drawing the finish
    // anywhere below the start let one seed ask for a walk of eight, which is
    // both far outside the three hops the week teaches and more rings than a
    // four-year-old will keep track of. One hop past the taught range is the
    // right amount of stretch for a puzzle; five is a different task.
    const hops = r.int(2, Math.min(4, from - 1));
    const to = from - hops;
    return {
      id: 'A17-PZ-01',
      title: 'Puzzle Grove: Ring Every Number You Say',
      puzzleType: 'construction',
      prompt: [
        '[image: a number path with a flag on one step and a dot on another]',
        spoken(`Start on ${String(from)}. Walk back to ${String(to)}. Ring every number you say.`),
      ].join(' '),
      figure: numberLine(
        {
          min: PATH_FROM,
          max: PATH_TO,
          step: 1,
          labels: 'all',
          marks: [
            { at: from, style: 'flag' },
            { at: to, style: 'point' },
          ],
        },
        { alt: 'a straight path with numbered steps, a flag partway along it and a dot further back' },
      ),
      answer: {
        value: String(from - to),
        acceptableForms: [`${countNoun(from - to, 'rings')} drawn`],
        validation: 'manual-review',
      },
      hintLadder: ladder(
        'Do you ring the number you are standing on?',
        'Ring the next one down, then keep going.',
      ),
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'ring-each-number-said' },
  sprint: null,
  mastery: [
    { gen: masteryWalk, diff: 2 },
    { gen: masteryWayOne, diff: 3 },
    { gen: masteryStory, diff: 3 },
    { gen: masteryFirst, diff: 3 },
    { gen: masteryPuppet, diff: 3 },
    { gen: masteryWayTwo, diff: 3 },
  ],
  isomorphNotes:
    'Both forms run one list of six generators at one list of six difficulties, index against index, each taking its numbers from a stream of its own so that no pair is served twice. Every answer is a tap on one of three cards written into this file, which keeps a numeric band-A page clear of the four buttons the display layer would otherwise invent for it, and all six pages carry the identical number path so a check never asks a child to read a picture they have not already met. 01: a backward walk, keyed on the step the walker finishes under. 02 and 06: one flag and one hop count under two stories, counted back for one and counted on for the other, questioned in the same words both times, so the number wanted is the smaller of the pair here and the larger there. 03: that walk set inside somewhere a child has been, naming a person, a place and both numbers. 04: which number is spoken on the FIRST hop, one below the flag however far the walk runs. 05: a puppet who spends his opening count standing still and finishes a place high. THE TWO DIRECTION SLOTS ARE ALLOTTED ONE EACH within a form rather than tossed for page by page: a child who always walks downhill takes precisely one of them, a child who always walks uphill takes precisely the other, and the two forms are allotted independently of one another. SLOT 04 IS THE ONE THAT REFUSES THE WEEK ITS OWN HABIT. Subtracting whatever pair of numbers a page happens to state fails there by construction, since no walk that slot draws is a single hop and the first number spoken can therefore never coincide with the last; it fails again on one direction page; and four of six is where that leaves it, which certifies nobody. NOTHING IS SPOKEN BEFORE IT IS ASKED FOR: the alt, which autoplays ahead of the question at this band, names the path, the numbered steps and the flag, and holds no digit and no number word anywhere, so no form can be answered out of the audio alone. The numeral 0 reaches no card, because no walk drawn here ends where it began; the numeral 10 reaches only the two direction slots, which are the only slots that can key it.',
  mistakeBank: [
    {
      errorTag: 'procedure-slip',
      subtype: 'counts-the-start-number-as-a-hop',
      description: 'Begins the count back on the number under the flag, so one hop is spent standing still and the walk finishes one place above where the story sent it. It is a reasonable mistake rather than a careless one: counting forwards really does begin on the number you are on, and nobody has yet said that counting back does not.',
      exampleWrongAnswer: 'counting back three from eight and saying eight, seven, six',
      distractorRationale: 'It reaches every page whose answer is a landing number, it is what the puppet announces for himself, and it sits one above the truth without exception. No count-back question can key it, which is exactly why the week says it aloud in the lesson and builds a certifying slot to catch it, rather than leaving it in an option list to be guessed past.',
      reteachPointer: 'explanation/script[2] (the hand resting on the eight while the first arc leaves it)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'walks-the-wrong-way-along-the-path',
      description: 'Takes the right number of hops in the direction the numbers grow, so the answer comes out further along the path than the walker ever stood. Adding is the move this child owns most securely, and any story carrying a pair of numbers tends to attract it.',
      exampleWrongAnswer: 'counting back two from six and answering eight',
      distractorRationale: 'A live card on every landing page, and the KEYED answer on whichever direction slot the story sends forwards, so it can neither be struck out nor leaned on. The very same number is correct or incorrect according to a single word, and building that sensitivity is what the week is for.',
      reteachPointer: 'guidedExamples/A17-GE-03 (the walk that goes the other way)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'hands-the-flag-back-unchanged',
      description: 'Answers with the number the flag is standing on. The drawing got all the attention and the story got none, so the walk never happened at all; it is what a child says when a page of numbers looks like something to read rather than something to travel along.',
      exampleWrongAnswer: 'asked where a walk back from seven ends, answering seven',
      distractorRationale: 'Offered on every path page, where it is the one number the picture states outright, and never keyed on any of them. It is the card that tells an adult the child is looking at the drawing and not listening to the question, which is a different problem from miscounting and needs a different sentence to fix.',
      reteachPointer: 'guidedExamples/A17-GE-01 (the finger that has not moved yet)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-other-half-of-the-question',
      description: 'Gives the number of hops when the place was wanted, or the landing number when the first hop was wanted. Nothing is miscounted; what goes astray is which of the two numbers on the page the question named.',
      exampleWrongAnswer: 'asked which number is said first on a walk back from nine, answering six',
      distractorRationale: 'Live on the first-hop pages, on the take-apart page where the showing part is offered for the covered one, and on the warm-ups where the struck group is offered for the standing one. It is the commonest slip of the week among children who can count perfectly well, and it is why two pages ask their questions about the same drawing in different words.',
      reteachPointer: 'explanation/summary (one number for every hop, and where you stop is the answer)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Subtraction as a walk rather than a picture: we put a finger on a number path and counted backwards, one number for every hop, and read off where we stopped. We practised the rule that decides everything — you do not say the number you are standing on — and we told a walk backwards apart from a walk forwards over the same path.',
    improvingCandidates: [
      'counting back from a number instead of counting every object again',
      'moving off the starting number on the very first hop',
      'hearing whether a story walks back along the path or on along it',
      'working out a covered part when counting it is not possible',
    ],
    strengtheningByTag: [
      {
        errorTag: 'procedure-slip',
        text: 'starting the count on the first HOP rather than on the flag — we will keep asking "what do you say first?" before anybody sets off',
      },
      {
        errorTag: 'concept-misconception',
        text: 'walking the way the story says, because the same flag and the same hops give two different answers depending on one word',
      },
      {
        errorTag: 'representation-misread',
        text: 'treating the number under the flag as a starting place rather than as an answer waiting to be read off',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted back one number for every hop, and you left the starting number alone instead of saying it first.',
      questionForChild: 'You are standing on this number. What do you say first?',
      schoolSyncHook: 'Count down the stairs at home together and tell us how far your child got before losing the thread — next week\'s walks can start there.',
    },
    vocabularyForParent: [
      'count back (say the numbers going down, one for each hop)',
      'number path (a line of numbers laid out in order that you can walk along)',
      'hop (a single jump onto the number next door)',
      'number sentence (the numbers and signs written down, as in 8 minus 3)',
    ],
  },
});
