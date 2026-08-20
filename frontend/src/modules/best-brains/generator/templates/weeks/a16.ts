/**
 * Level A · Week 16 — "Meeting subtraction" (conceptId: meeting-subtraction).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber`. a14 is this week's
 * mirror twin and was read in full; a12 and a03 were read for their ARCHITECTURE
 * only — the authored-choices wrapper, the per-pack deal, the rank rotation, the
 * way a substitution and a measured rank get disclosed. Not one sentence, scene,
 * name, ladder, gloss or rationale below is theirs; the token-overlap scan across
 * `weeks/` that backs that up is in the report.
 *
 * FILL-ARCHITECTURE §3 row A16: anchor "take-away acted out"; core form "picture
 * take-away"; perceptual discrimination "which picture shows take-away? (join vs
 * remove)"; puppet error-analysis "adds when the story removes"; Day-5
 * "story-sort: add vs take-away". Catalog: computational focus "take-away
 * stories within 5; − symbol; cross-out strategy", non-computational Day-5 focus
 * "subtraction story drawing with draw-the-answer box".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THE WEEK CLAIMS, AND HOW THE CONTENT FORCES IT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  - **Subtraction arrives as something that HAPPENS, not as a smaller answer.**
 *    Some were here, some are not here any more, and what is left can be found by
 *    looking at what still stands. So every core page draws the whole starting
 *    group and strikes the departed through it — the catalog's cross-out strategy
 *    is the picture, not a tip in a teacher's note. The child never meets a page
 *    that shows only the remainder, because the whole point is that the missing
 *    ones were once there.
 *  - **The same picture, two directions — the week's discrimination, and the
 *    mirror of the one A14 built.** A14 drew two groups and asked whether anybody
 *    handed anything over. A16 draws ONE group and tells one of two stories over
 *    it: some went away, or some came to join them. The drawing is identical, the
 *    question is identical, and only one word of the story changes, so the child
 *    cannot answer by hunting for a cross or a plus. Two of the six certifying
 *    slots are that page, dealt one each way per form (disclosure 4).
 *  - **Which part is the question about?** A cross-out picture holds two counts —
 *    the struck ones and the standing ones — and reading which one the question
 *    names is the whole of the strategy. `whichPart` puts both questions over one
 *    drawing, so a child who has decided that this week means "make it smaller"
 *    is caught. It is also what stops "always subtract" from certifying a form on
 *    its own (measured; the table is in the report).
 *  - **The puppet adds when the story removes**, and his number is not authored:
 *    `d_verify_binop_misconception_v1` computes it from the page's own two counts
 *    (disclosure 1). The word "wrong" is nowhere on the page: he "put them back
 *    on", which is what he actually did.
 *  - **The − sign is met, named and read aloud, and it is NOT pretended onto the
 *    page** (disclosure 3). It lives in the lesson script, in the written
 *    sentence the script's own visual direction carries, in the vocabulary, in a
 *    guided example and in the Day-5 task, where the child hears it said and sees
 *    it written. No page asks a child to move it, complete it or solve for it: at
 *    band A a symbol is introduced, never manipulated.
 *  - **Nothing here is answerable off the sentence.** Every one of the twelve
 *    non-retrieval items on Days 1–4 carries a figure built from its own drawn
 *    counts, and so do all three on Day 5 — and no figure `alt` anywhere in the
 *    week names any quantity at all, which matters because the alt is spoken
 *    BEFORE the question at this band.
 *  - **No timers.** `sprint: null`. A timed element at band A is a hard fail.
 *  - **Four of the nineteen daily items look backwards** (21.1%), one opening
 *    each of Days 1–4, no two the same shape and no two from the same week: the hiding game (A12), a join
 *    to be told apart from a take-away (A14), the step backwards along the path
 *    (A6) and counting a scatter without losing the thread (A1).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCLOSURES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. **THE RECIPE'S PUPPET SLIP IS DERIVABLE, AND THAT IS THE OPPOSITE OF WHAT
 *    THE MIRROR WEEK FOUND.** Row A16's slip is "adds when the story removes",
 *    which is an OPERATION SWAP over one operand pair — precisely the shape
 *    `d_verify_binop_misconception_v1` exists for. With `{a, b, op: '-', wrongOp:
 *    '+'}` it returns `{correct: a − b, wrong: a + b}`: the truth of the page and
 *    the puppet's own number, both recomputed from the two counts the picture is
 *    drawn from. QG-11 then checks BOTH halves at every seed — the keyed option
 *    against `correct`, and the prompt against `wrong`, so a puppet who said a
 *    number the misconception does not produce fails the pack.
 *
 *    Kit §E2.3 says to spend ten minutes hunting for the identity before
 *    reframing anything, and this is what that looks like when the hunt succeeds.
 *    A14's mirror slip ("counts only the new birds") has a difference of `−a`,
 *    which no registered transform can express, and its author had to move the
 *    misconception and say so. This one costs nothing: no substitution, no
 *    reframing, no fabricated number, and the D8 half of the audit — the half
 *    A14 had to give up — is live on every puppet page in this file.
 *
 * 2. **THE COUNTING PAGES PIN `d_verify_binop_v1` AND NOT THE FAMILY'S OWN
 *    `a_takeaway_v1`, BECAUSE THE FAMILY'S PIN WOULD BE DEAD CODE HERE.**
 *    `a_takeaway_v1` registers an `answerFor`, and QG-5 re-derives an `answerFor`
 *    only for `exact-numeric`, `equivalent-numeric`, `equivalent-fraction`,
 *    `ordered-list` and `set` (`validator.ts:471`) — never for `choice-key`. At
 *    this band a certifying page MUST be `choice-key`: a pre-reader cannot type,
 *    and a numeric band-A item with no authored choices is handed to
 *    `tapOptionsFor`, which invents four buttons from a function that cannot know
 *    the slot's answer range (L53). So on every page this week can serve,
 *    `a_takeaway_v1`'s pin would be dead code. `d_verify_binop_v1` registers a
 *    `verifyFor`, which QG-11 runs on choice items, and `{a, b, op: '-'}`
 *    recomputes exactly `a − b` from the same two counts the picture holds. Same
 *    arithmetic, live audit. **Recorded for the orchestrator: `earlynumber` wants
 *    an `a_takeaway_v1` verify twin**, so a band-A take-away page can carry a
 *    family-native id and a live pin at the same time — the same note a14 left
 *    about `a_join_v1`, now made twice from opposite sides of the same gap.
 *
 * 3. **THE MINUS SIGN CANNOT BE DRAWN ON THE ONLY HONEST TAKE-AWAY PICTURE, AND
 *    NOTHING IN THIS FILE PRETENDS OTHERWISE.** `CountersFig` draws a relation's
 *    operator BETWEEN groups — `groups.slice(0, -1).map(…)` — so a figure with a
 *    single group renders no sign at all, whatever its relation says. And a
 *    single group is the only truthful take-away layout inside five:
 *      · one group of `a` with the last `b` struck through draws exactly `a`
 *        things, which is how many there were, and the arrow that `takeAway` adds
 *        (it fires only for `groups.length === 1`) shows where they went;
 *      · `[{count: a}, {count: b}]` with `relation: 'remove'` DOES draw a minus,
 *        and it draws `a + b` things for a story that only ever had `a` — the
 *        picture would lie about the quantity on the page;
 *      · `[{count: a − b}, {count: b}]` draws the right number of things and puts
 *        the minus between the stayers and the leavers, which prints the sentence
 *        `(a − b) − b`. The count is honest and the arithmetic on the page is
 *        false, which is worse than no symbol at all.
 *    So the week does what a14 did for the equals sign it could not draw. The
 *    sign is NAMED in the lesson script, WRITTEN in that script's visual
 *    direction (which the lesson renders as text, so the child sees the glyph
 *    while the teacher reads it aloud), glossed in the vocabulary, spoken in
 *    guided example three, and described by what it DOES — never by where it sits
 *    — on the Day-5 drawing page. **Recorded for the orchestrator: a one-group
 *    `remove` figure should render its minus beside the struck run**, which is a
 *    small change to `CountersFig` and would let A16, A17 and A18 draw the symbol
 *    they teach. A number-sentence primitive (a drawn row of numerals and
 *    operators with one blank box) would serve the same three weeks; a14 asked
 *    for it first and this week seconds it.
 *
 * 4. **THE DISCRIMINATION IS A NUMBER, NOT A VERDICT — AND A BALANCED DRAW IS NOT
 *    A BALANCED PAGE (L52), so its direction is DEALT.** `wentOrCame` draws one
 *    group, then one of two sentences over it — `Then 2 shells went away.` or
 *    `Then 2 shells came to join them.` — and asks the same question either way:
 *    "How many shells are here now?" The count in the story is spoken; the count
 *    in the group is only in the drawing; so neither half of the page can be
 *    skipped. Both outcomes are live keyed values, `a − b` and `a + b`, and the
 *    arriving one is last week's own move (A15 count-on by one, two or three) met
 *    from the other side.
 *
 *    Four fair coins land the same way on one pack in eight, and a pack whose
 *    discrimination pages all remove is a pack where "make it smaller" was never
 *    once punished. So the two DAILY pages take one direction each (which day
 *    removes is drawn per pack), and each MASTERY FORM takes one of each across
 *    its two slots (which slot removes is drawn per form, remembered against the
 *    form's own rng object so a page rebuilt by the freshness guard or by the
 *    assembler's guided-example check keeps the direction it already had rather
 *    than borrowing the other form's). Both functions are idempotent rather than
 *    consuming, for the reason a12 recorded: a schedule spent per CALL hands the
 *    next page the wrong side.
 *
 *    WHAT THAT COSTS, MEASURED RATHER THAN ASSERTED. "Always take away" and
 *    "always add" are exactly complementary on this page, so each scores exactly
 *    one of the two discrimination slots in every form and neither can be pushed
 *    below a half without deleting one of the two situations the week exists to
 *    contrast. That is a floor, not a defect, and a14 reached the same one from
 *    the mirror image. What is NOT left to chance is the rank: the option pools
 *    of the two directions are mirror images, so the key's position among the
 *    three cards rotates on both (measured; see the report).
 *
 * 5. **WHICH VALUES MAY BE OFFERED IS ARITHMETIC, NOT TASTE (L38).** Inside five
 *    a take-away runs from 2 − 1 to 5 − 4, so a remainder is 1, 2, 3 or 4 and can
 *    never be 0 or 5. Two consequences, both load-bearing:
 *      · **0 is never offered anywhere in the week.** "They are all gone" is a
 *        real belief and it is named in the mistake bank, but no draw in a week
 *        whose subtrahend stops one short of the whole can make it true, so
 *        offering it would hand every child a card to strike out unread and turn
 *        a three-way page into a coin flip.
 *      · **The starting count `a` and the departed count `b` ARE offered**, and
 *        both are genuinely keyable — `b` is the answer whenever `whichPart` asks
 *        how many went away, and every value 1–4 is a remainder on some draw. The
 *        one value that is offered and never keyed on a take-away page is the
 *        puppet's `a + b`, which is what an error-analysis page IS.
 *    Nothing in this week is in `DECLARED_LURES`, because nothing in it needs to
 *    be: every card it offers is reachable as an answer somewhere in the week.
 *
 * 6. **SEVEN LOCAL GENERATORS, AND WHY NONE OF THEM IS IN THE FAMILY.**
 *    `pictureTakeAway` is the family's own take-away page and it is not served
 *    here. Its answer is `exact-numeric` with nothing to tap, which at band A
 *    means four buttons invented while the page renders (disclosure 2), and its
 *    one question would arrive in A16, A17 and A18 alike. So `whatIsLeft`
 *    and `whichPart` are local, and they differ from each other the way counting
 *    differs from reading: count what still stands, or work out which of the two
 *    groups the question named. `wentOrCame` is local because the family's
 *    `joinOrTakeAway` contrasts two DIFFERENT pictures and asks the child to name
 *    the move — a good page, and not the one this week's brief asks for, which is
 *    one picture under two stories. `puppetAdds` is local because `PuppetSlip` is
 *    a closed union of 'double-count' | 'skip-count' | 'count-back-start' |
 *    'teen-writing' with no add-instead-of-subtract slip in it. `takeAwayStory`
 *    is local because the family has no story generator. `sortTheStory` and
 *    `drawWhatIsLeft` are the Day-5 pair and have no family form. Every one of
 *    them builds an item the way the family does: a registered templateId, a
 *    picture from `lib/figures`, every quantity through `lib/format`, an
 *    `authorMeta` stamp for the preflight.
 *
 * 7. **THE DAY-5 SORT IS A TWO-WAY PAGE, AND THE THIRD BIN IT WANTS CANNOT BE
 *    PINNED.** §3's Day-5 for this row is "story-sort: add vs take-away", and
 *    `a_join_or_take_v1` recomputes exactly that from `{isJoin}`. A third bin —
 *    "nothing changed", the case a14's whole week is about — would make the page
 *    a three-way instead of a coin flip, and no registered transform can express
 *    it: the sort transform is binary by construction, and inventing a key for
 *    the third bin is the fabrication the kit rules out. So the page ships as the
 *    recipe wrote it, with the coin-flip floor stated rather than hidden, and the
 *    three-way version is **recorded for the orchestrator: `a_join_or_take_v1`
 *    wants a `mode` param with a 'neither' branch**, which would also serve A18,
 *    whose Day-5 sorts number sentences true against false.
 *
 * 8. **THE DAY-5 DRAWING IS THE CATALOG'S "DRAW-THE-ANSWER BOX" IN THE ONLY FORM
 *    THAT EXISTS.** No primitive draws a box, a numeral or an answer frame, so
 *    the box the catalog names is the per-item scratchpad the child already draws
 *    on. What is pinned is the number the drawing must come to: `answer.value`
 *    records it, the figure asserts its own remaining count, and QG-13 compares
 *    the two at every seed. The validation is `manual-review` because nothing can
 *    grade a drawing, and because `'set'` — the other candidate — sits in
 *    `needsTypedEntry` and puts a text box in front of a four-year-old, which a12
 *    reported and which is still open.
 *
 * 9. **THE PUZZLE CARRIES NO `asserts`.** It draws a row and asks how many must
 *    be crossed out to leave a stated number, so the quantity the picture can
 *    compute (its own count, which is the GIVEN) is not the quantity the item
 *    asks for (the part that must go). An assertion pointed at the count would put
 *    a true picture and a true answer on opposite sides of QG-13, so there is
 *    none: aiming an assertion at the wrong quantity is worse than having no
 *    assertion at all. One drawn `here` produces both the number in the picture and the
 *    `here − stay` in the key, so the two cannot disagree.
 *
 * 10. **WHAT MEASURING FOUND, AND IT WAS FIVE REAL DEFECTS.** All five passed
 *    the 200-seed validator run and every one of them would have shipped.
 *      · **"ALWAYS SUBTRACT" CERTIFIED A FORM ON ITS OWN, TWICE OVER.** With
 *        every slot but the two direction pages keyed on `here − gone`, a child
 *        who applies the week's operation to whatever two numbers are drawn and
 *        never decides anything scored 5 of 6 — exactly the pass mark — on 100%
 *        of forms. Adding the part question, drawn on a coin, took that to
 *        60.6%, which is where this file first reported it. That was wrong to
 *        report as a floor: the week is about deciding, so a form that promotes
 *        a non-decider is L51 (does guessing reward the misconception the week
 *        teaches against?), and the calibration is a14 at 2.0% and a03 at 2.4%.
 *        Two changes closed it. The certifying part slot now always asks for the
 *        group that WENT, and the two pairs where `here = 2 × gone` — where the
 *        difference and the departed count coincide, so the habit is ticked by
 *        accident — are barred from that question. Per slot, the share of forms
 *        where the difference is the keyed answer: 100 / 49.8 / 100 / 0.0 / 100
 *        / 50.2. "Always subtract" now takes 4.00 of 6 and passes 0.0% of 3,000
 *        forms, while a child who reads the question still answers all six.
 *      · **THREE WARM-UPS OFFERED CARDS THEY COULD NEVER KEY** (L38). The join
 *        warm-up offered 6 on 45% of its draws though a join inside five stops
 *        at 5; the step-back offered 5 on 28% though a step back from five lands
 *        at 4; the scatter offered 1 and 6 on about 30% each though it counts
 *        2 to 5. Each pool is now clipped to what its own question can reach,
 *        and the slot's rank spread improved as a side effect — the scatter went
 *        from 23/50/27 to 33/33/34.
 *      · **THE TAKE-AWAY PAGES SAT AT THE BOTTOM RANK 60% OF THE TIME**, because
 *        a remainder is a part and four of the ten pairs leave a remainder of one
 *        with nothing honest beneath it. Asking the dealer for the TOP rank and
 *        letting it fall back (see `twoWrongs`) moved them to 40/40/20, which is
 *        as flat as ten pairs and no zero card allow.
 *      · **FIFTEEN PERCENT OF DAY-3 PAGES SERVED ONE KIND OF THING TWICE.** The
 *        pack-wide round of nine that a14 uses does not divide into days of four,
 *        so the wrap landed mid-day. Claiming per STREAM instead — the assembler
 *        already gives each day and each form its own — took it to 0 of 7,500
 *        day-pages. What is left is 28 mastery forms in 1,600 (1.8%) that repeat
 *        a kind, all of them caused by the assembler retrying a Form-B slot whose
 *        core collides with Form A's: the discarded draft keeps the kind it
 *        claimed. **Recorded for the orchestrator: a generator has no way to know
 *        its draft was thrown away**, which is the whole of this residue.
 *      · The puppet's third card is taken from BELOW the truth whenever an honest
 *        value exists there, rather than on a coin. His own card is `here + gone`
 *        and is always the largest number on the page, so the truth can never be
 *        the biggest; a coin left it the smallest two draws in three, and
 *        preferring the low side gives 39/61/0 — flat as this page gets while the
 *        puppet is still the one who got it wrong.
 *
 *    WHAT THE OTHER BLIND HABITS SCORE, over 3,000 forms, out of six: tap the
 *    largest 0.91 (0.0% of forms pass), tap the smallest 2.20 (1.9%), tap the
 *    middle 2.89 (9.2%), tap the first card 1.99 (1.8%), add everything 1.00
 *    (0.0% — it takes the one direction page that adds and nothing else).
 *
 * 11. **WHAT KIND OF THING A PAGE DRAWS IS CLAIMED PER SITTING.** The freshness
 *    guard signs an item on its NUMBERS, so two pages showing different counts of
 *    the same thing look perfectly fresh to it, and the first build duly served
 *    two flower stories on one Day 4. What decides "one page" for a reader is the
 *    sitting — a day, or a mastery form — and the assembler already hands each of
 *    those its own rng stream, so the stream is the scope. See `claimKind`.
 *
 * 12. **WHAT ONLY READING THE GENERATED WEEK FOUND.** Five things, and no gate
 *    sees any of them.
 *      · The first `whatIsLeft` prompt was "How many are left?", which is
 *        `pictureTakeAway`'s own sentence and would have put the family's
 *        question into a fourth week.
 *      · The Day-5 sort told its two stories with "went away" and "taken away"
 *        while one of its two buttons read "take away". A child could match the
 *        sound and never look at the group, so the stories now slip things INTO
 *        a hat or shake them OUT of it and share no word with either button.
 *      · The first discrimination alt read "a row of shells before anything
 *        happens", which is narration a picture cannot show; it now says what the
 *        drawing looks like and the story carries the rest.
 *      · The part question was drawn on a coin on all three of its daily pages,
 *        so one pack in four asked the same one three times and never showed the
 *        contrast at all — and when Day 1 drew "which ones stayed" it asked it
 *        straight after two pages that had just asked the same thing. Day 1 now
 *        asks for the group that WENT, Day 2 for the group that stayed and Day 3
 *        takes the coin. The certifying slot is fixed rather than drawn, for a
 *        different reason entirely — see disclosure 10.
 *      · The puzzle said "Cross out some shells. Leave just 1." — "some" for one
 *        thing, on the draws where one thing had to go. It now states the target
 *        first and asks for the rest to go, which reads right at every draw.
 *
 * 13. **A SHARED TRANSFORM MADE THE ASSEMBLER REBUILD PAGES THAT WERE NEVER THE
 *    SAME PAGE, AND THAT EXHAUSTED A FRESHNESS POOL.** Found at seed 471, after
 *    the fix in disclosure 10 shifted the draws: one mastery form shipped its
 *    two direction pages on the same pair of numbers, which QG-1 duly failed.
 *
 *    The pool was not the cause, it was the casualty. Four page types here pin
 *    `d_verify_binop_v1`, and the assembler compares a Form-B slot against every
 *    Form-A core on `{templateId, params}` alone — so a direction page drawing
 *    `{4, 1, '-'}` read as a repeat of a story page that had drawn `{4, 1, '-'}`,
 *    and was rebuilt. Every rebuilt draft is thrown away AFTER `drawUniqueItem`
 *    has already spent its surface, so an eight-pair pool was being asked to
 *    cover six pages and three ghosts. Instrumented at seed 471: nine surfaces
 *    claimed for six served items, ninety-six freshness probes, and the last page
 *    with nothing left to take.
 *
 *    Two changes, and the second is the real one. The pool is now cut by A15's
 *    count-on range (the moving part is at most three) rather than by a cap on
 *    the arriving total, which is the same idea stated from the right end and
 *    leaves nine pairs instead of eight. And every page type that pins the shared
 *    transform now carries one honest distinguishing param — `asks` for which
 *    question the part page posed, `told` for which way the story went, `place`
 *    for which frame a story used — so two different pages that happen to hold
 *    the same two numbers are no longer read as one. Re-instrumented at the same
 *    seed: six surfaces for six items and eight probes, the ghosts gone. Clean
 *    over 1,200 seeds on the kit's own sequence and 2,800 more across three other
 *    seed families.
 *
 *    **Recorded for the orchestrator, because a week file can only work around
 *    it:** the Form-B collision check treats params as the identity of a
 *    question, so any level where several page types share one transform pays
 *    this tax in silent rebuilds — and the rebuild spends a freshness surface it
 *    then discards. Either the check should include the item's `type` and
 *    `cognitiveOp`, or a discarded draft should give its surface back.
  */

import type { BBFigure, FigureAssertion } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  countArrangement,
  neighbourNumber,
  partnersHiding,
  pictureJoin,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswerOf, assertsParam, counterGroups, counters } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Eight names, drawn fresh per story. Nothing below hardcodes one (kit §F.3). */
const NAMES = ['Talia', 'Nuri', 'Esben', 'Mona', 'Javi', 'Keiko', 'Sadie', 'Obi'] as const;

/** The largest group a take-away may start from: the catalog says "within 5". */
const WHOLE = 5;

/**
 * EVERY TAKE-AWAY INSIDE FIVE, DRAWN AS A PAIR RATHER THAN AS TWO NUMBERS.
 *
 * `here` is the group that was there and `gone` is the part that left, so `here −
 * gone` is what the page asks for and `gone < here` keeps a remainder on the
 * page. Ten pairs, and drawing the PAIR uniformly is what keeps the week's
 * freshness machinery from running dry: `drawUniqueItem` signs an item on its
 * format class plus its sorted numeric tokens, so each item type has exactly
 * these ten surfaces, and drawing the two numbers independently would make the
 * pairs with a large `here` far commoner than the rest.
 *
 * Why the whole is never taken. A remainder of zero is a real and important
 * take-away, and it is A17's to teach: here it would put a card on the page that
 * says "none" beside three pages whose answer can never be none, and the value 0
 * would then be offered often and keyed never — the dead-option shape this file
 * spends disclosure 5 avoiding.
 */
const TAKE_PAIRS: ReadonlyArray<readonly [number, number]> = [
  [2, 1], [3, 1], [3, 2], [4, 1], [4, 2], [4, 3], [5, 1], [5, 2], [5, 3], [5, 4],
];

/**
 * The pairs the DISCRIMINATION may draw, which are not quite the same set.
 *
 * That page tells one of two stories over one drawing, so its numbers have to
 * work in both directions at once: `here − gone` must leave something (a
 * take-away inside five, exactly as the week promises) and `here + gone` must be
 * a count-on a child has already been taught. The second condition is what
 * decides the list, and it is A15's: count on by one, two or three. So the part
 * that moves is capped at three and nine of the ten pairs survive, with the
 * arriving totals running to eight.
 *
 * The cap was first written as "the arriving total may not pass seven", which is
 * the same idea measured from the wrong end. It left eight pairs, and eight was
 * not enough: this page's freshness pool has to absorb the assembler's rebuilds
 * as well as its own six items, and seed 471 duly ran the pool dry and shipped a
 * repeated surface (disclosure 13).
 */
const BOTH_WAYS_PAIRS: ReadonlyArray<readonly [number, number]> = TAKE_PAIRS.filter(
  ([, moved]) => moved <= 3,
);

/**
 * The pairs a "HOW MANY WENT AWAY?" page may draw, which are the take-away pairs
 * minus the two that answer themselves.
 *
 * That page exists to defeat one habit: subtract whatever two numbers are drawn.
 * On `here = 2 × gone` the difference IS the departed count — 4 with 2 crossed
 * out answers 2 either way — so those draws tick a child who never read the
 * question, which is the page's whole purpose reversed. Two of the ten pairs do
 * it, and dropping them takes the habit from 18.9% of certifying forms to none
 * (disclosure 10). Nothing else about the page changes: the same picture, the
 * same three cards, the same eight remaining pairs a "how many are still here?"
 * page may also draw.
 */
const WENT_PAIRS: ReadonlyArray<readonly [number, number]> = TAKE_PAIRS.filter(
  ([here, gone]) => here - gone !== gone,
);

interface Take {
  /** How many were there before anything happened — every one of them is drawn. */
  here: number;
  /** How many left. They are drawn too, with a line through them. */
  gone: number;
  noun: string;
}

/**
 * WHAT KIND OF THING A PAGE DRAWS IS CLAIMED PER STREAM, because the freshness
 * guard cannot see the difference and a reader can.
 *
 * The guard signs an item on its NUMBERS, so four flowers with one struck and
 * three flowers with two struck are two perfectly fresh items to it and one dull
 * page to a child. What decides "one page" is not the pack, though — it is the
 * SITTING: a day, or a mastery form. And the assembler already hands each of
 * those its own rng stream, one per day and one per form, so the stream itself
 * is the scope. Kinds are therefore remembered against the stream that drew
 * them: no day and no form ever shows the same kind of thing twice, while a kind
 * is free to come back on another day, which is what keeps all nine in use.
 *
 * Measured, and it took three tries. Claiming out of the pack-wide guard in
 * rounds of nine — the shape a14 used — left 15% of Day 3 pages serving one kind
 * twice, because a round of nine does not divide into days of four and the wrap
 * lands mid-day. Per stream it is structurally impossible: a day holds at most
 * four items against a pool of nine, a form holds six.
 *
 * The claim is taken once per item and OUTSIDE the freshness loop, so a draft
 * rejected for repeating a surface gives its kind back rather than burning it.
 */
const KINDS_DRAWN_ON = new WeakMap<Rng, string[]>();

function kindsOn(rng: Rng): string[] {
  let drawn = KINDS_DRAWN_ON.get(rng);
  if (!drawn) {
    drawn = [];
    KINDS_DRAWN_ON.set(rng, drawn);
  }
  return drawn;
}

/**
 * A SLIDING WINDOW RATHER THAN A GROWING LIST, and the difference is measurable.
 *
 * A plain "never twice on this stream" list works until the assembler REBUILDS a
 * draft — it retries a Form-B slot whose mathematical core collides with Form
 * A's, and every retry claims a kind that is then thrown away with the draft.
 * Three retries exhaust nine nouns, and the served page has to take whatever is
 * left. Measured at 2.6% of mastery forms, always on the last slot. Remembering
 * only the last few claims fixes it at the root: a repeat now needs a whole
 * pool's worth of claims between the two pages, which no sitting reaches.
 */
function claimKind(rng: Rng, pool: readonly string[]): string {
  const drawn = kindsOn(rng);
  const recent = new Set(drawn.slice(-(pool.length - 1)));
  const free = pool.filter((k) => !recent.has(k));
  // ONE DRAW, from the kinds that are actually available — never a retry loop.
  // The loop version was written first and measured worse: with eight of nine
  // nouns inside the window it missed all forty times on about one draw in a
  // hundred and fell back to a blind pick, which is exactly the repeat the
  // window exists to stop. A filtered pick cannot fail, and it consumes a fixed
  // number of draws, which is what keeps later items on the stream stable (L19).
  const kind = rng.pick(free.length > 0 ? free : pool);
  drawn.push(kind);
  return kind;
}

/**
 * A WARM-UP DRAWS ITS OWN KIND OF THING, AND THE SITTING HAS TO BE TOLD.
 *
 * Two of the four come back from the family printing a real noun, chosen by a
 * plain `pick` that knows nothing about this pack. Measured over 1,200 packs
 * before this wrapper: 787 day-pages served one kind twice, every one of them a
 * warm-up landing on a noun a core page went on to claim — invisible to every
 * gate, and obvious to anyone reading a Day 4 with two flower pages on it.
 *
 * So the warm-up's noun is read off the finished draft and marked as used on
 * that day's stream, before the day's core items ask for theirs. Reading rather
 * than passing is forced: `pictureJoin` keeps its noun in its prompt and not in
 * its params, and a week file may not reach into `lib/` to change that. The
 * singular is checked too, because a drawn count of one prints "1 leaf" and a
 * match on "leaves" alone would miss it.
 */
function spreadsItsKind(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const shown = COUNTABLE_NOUNS.find(
      (n) => draft.prompt.includes(n) || draft.prompt.includes(unitFor(1, n)),
    );
    if (shown) kindsOn(rng).push(shown);
    return draft;
  };
}

function takeAway(r: Rng, noun: string): Take {
  const [here, gone] = r.pick(TAKE_PAIRS);
  return { here, gone, noun };
}

// ---------------------------------------------------------------------------
// THE WORD CAP, COUNTED THE WAY THE GATE COUNTS IT
//
// Two ceilings exist and only one of them is the law here. `earlynumber`'s
// `ask()` weighs a whole prompt, which would refuse this week's three-sentence
// puppet page for a length none of its sentences actually has. The gate weighs
// ONE SENTENCE, wherever a child hears it, and the gate is the law. Its splitter
// and its counter are copied below and every authored string in the file goes
// through them, so an eleventh word stops the module loading or stops the page
// being drawn — never a reviewer counting on their fingers.
//
// Alt text is deliberately not routed through here. It is the whole of what a
// child using a screen reader has instead of the picture, and the only way to
// shorten it is to describe the drawing less.
// ---------------------------------------------------------------------------

const WORD_CAP = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const spoken = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((word) => /[a-z0-9]/i.test(word)).length;
    if (spoken > WORD_CAP) {
      throw new Error(`A16: band-A sentence runs to ${String(spoken)} words (cap ${String(WORD_CAP)}): "${sentence}"`);
    }
  }
  return text;
}

/** The scene rides in a bracket and is never displayed; only the question is capped prose. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** A ladder, every rung capped. Nothing in one names a child, a puppet or a number. */
function rungs(...ladder: string[]): string[] {
  return ladder.map(say);
}

/**
 * Give a FAMILY generator this week's own help, without touching `lib/`.
 *
 * No ladder may be served more than twice across the fifteen non-retrieval core
 * items, which puts a floor of eight distinct ladders under the week — so how many
 * ladders exist is decided before any page is (kit §E, A-band lesson 1).
 * Twenty-six of them ship here, one per page and one per certifying slot, and
 * no two are the same. The arithmetic is only half the
 * reason: the help genuinely differs. A first meeting wants "those ones are not
 * there any more"; the discrimination wants "listen for which way the group
 * went"; the puppet wants "he put them back on". None of those could live in the
 * shared family without being said in all twenty-four Level-A weeks at once,
 * which is the sameness `bb-cross-week-test` reads the whole corpus to find.
 *
 * The closure rewrites one field of a finished draft and draws nothing itself,
 * so the prompt that QG-1 and QG-4 sign is untouched. The local generators take
 * their ladder as a required ARGUMENT instead of being wrapped, so a page with
 * no help on it does not compile.
 */
function withLadder(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Put an earlier week back in front of the child as a game, not a review.
 *
 * Band A sets no floor on warm-up formats, so each of the four has to earn its
 * minute against what a take-away actually rests on. A12's hiding game is the
 * load-bearing one and it opens the week: a child who knows that 2 and 3 hide
 * inside 5 already knows what "3 went away" leaves, and this week's job is to
 * put that fact into a story. A14's join comes second, on the day the child
 * first has to tell the two apart. A6's step backwards along the path is the
 * count-back A17 will build on. A1's scatter is the plain count-all that every
 * cross-out page ends with.
 *
 * Their ladders are re-voiced rather than inherited. One family ladder serves
 * every A week that ever calls the generator, so a warm-up that keeps its own
 * help arrives in this pack already saying what a dozen other packs say.
 */
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
 * THE ALT NEVER NAMES A QUANTITY, and at this band that is an audio rule before
 * it is an accessibility one.
 *
 * `speakablePrompt(prompt, figure.alt)` puts the scene in front of the question
 * and prefers the alt over the `[image: …]` bracket, and every band-A screen
 * autoplays the result — so a four-year-old hears the alt before the question.
 * On a take-away page there are two counts a child could be asked for and both
 * are drawn, so naming EITHER of them aloud performs the item. What the alt says
 * instead is what the drawing looks like: a row, some of it struck through, and
 * an arrow going away from the marks. A child who cannot see the picture still
 * learns that the crossed things left, which is the idea; how many there are
 * stays the child's to find.
 *
 * The bracket keeps its numbers. It is never displayed and never spoken, and it
 * is what QG-1 and QG-4 sign to keep operand surfaces fresh; emptying it would
 * make the item unguardable (L29).
 */
function goneFigure(p: Take, asserts: FigureAssertion): BBFigure {
  return counterGroups(
    [{ count: p.here, noun: p.noun }],
    {
      relation: 'remove',
      crossedOut: p.gone,
      alt: `a row of ${p.noun}, some of them crossed through, with an arrow leading away from the marks`,
      asserts,
    },
  );
}

/** The bracket for a cross-out page: both counts, in the order the picture holds them. */
function goneScene(p: Take): string {
  return `${countNoun(p.here, p.noun)} with ${String(p.gone)} crossed out`;
}

/**
 * The discrimination's picture: one group, nothing struck, no sign anywhere.
 *
 * The absence is the item. The brief for this week is one drawing under two
 * stories, so a page that crossed things out when the story removed them would
 * be answered by looking for the marks instead of by listening — and the belief
 * the page exists to unseat is precisely that a picture decides what happened to
 * it. So the drawing shows only what is true before anybody does anything, and
 * the story does the rest.
 */
function stillFigure(p: Take, asserts: FigureAssertion): BBFigure {
  return counterGroups(
    [{ count: p.here, noun: p.noun }],
    { alt: `a row of ${p.noun} side by side`, asserts },
  );
}

// ===========================================================================
// Choosing the cards — the one dealer every counting page goes through
// ===========================================================================

interface Wrong {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Two wrong values, with the truth's RANK rotated.
 *
 * L43 states the defect as an invariant rather than as a direction: the answer
 * must not sit at a fixed rank among the numbers on offer. "All distractors
 * above" makes "tap the smallest" score full marks, and that is the shape a
 * take-away page falls into by default, because a remainder is smaller than the
 * group it came from and smaller than every over-count. So a target rank is
 * drawn — 0 puts the truth lowest, 1 in the middle, 2 highest — and when the
 * drawn pair cannot reach it (a remainder of one has almost nothing honest
 * beneath it) the deal falls back to whichever rank is closest to the one asked
 * for. Falling back rather than cycling matters: a cycle would pour every
 * unreachable target into the one shape that is always buildable.
 *
 * WHICH TARGET EACH PAGE ASKS FOR IS ITSELF A DECISION, and it was measured. On
 * a page whose answer is a remainder the pull is entirely downward: four of the
 * ten take-away pairs leave a remainder of one, and the only honest values under
 * one are none, so those four force the truth to the bottom whatever is asked
 * for. Drawing the target uniformly there gave 60% at the bottom rank; asking
 * for the TOP every time and letting the stepping fall back gives 40/40/20,
 * which is the flattest that ten pairs and no zero card can be. The
 * discrimination is the opposite case — its two directions have mirror-image
 * pools — so it draws its target and mirrors it, and stays flat without help.
 *
 * Deterministic throughout: one `r.int` for the target, then shuffles inside the
 * branch that succeeds. Never a redraw loop, which would consume a variable
 * number of draws and break seed stability (kit §E2.4).
 */
function twoWrongs(r: Rng, below: readonly number[], above: readonly number[], wanted: number): number[] {
  const shapes = [
    () => (above.length >= 2 ? r.shuffle(above).slice(0, 2) : null),
    () => (below.length >= 1 && above.length >= 1 ? [r.pick(below), r.pick(above)] : null),
    () => (below.length >= 2 ? r.shuffle(below).slice(0, 2) : null),
  ];
  const order = [0, 1, 2].sort((x, y) => Math.abs(x - wanted) - Math.abs(y - wanted));
  for (const k of order) {
    const got = shapes[k]();
    if (got) return got;
  }
  throw new Error('A16 twoWrongs: this draw offers fewer than two honest wrong values');
}

/** Each value once, in the order offered, with the unusable dropped. */
function usable(values: readonly number[], truth: number): number[] {
  const seen = new Set<number>([truth]);
  const out: number[] = [];
  for (const v of values) {
    if (v < 1 || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/**
 * What a child was doing when they tapped something other than the remainder.
 *
 * Read off the VALUE and the drawn pair rather than off the branch that produced
 * them, so what is said about a card cannot drift from the card itself. The
 * tests run in the week's own order: the two whole-page misreadings come first
 * because they are what this week exists to name, then the part-for-part swap,
 * then the counting slips. Where two readings are true of one number — with a
 * group of three and one gone, "counted them all" and "one too many" both print
 * three — the earlier, more useful reading wins. Teacher-facing, so no word cap.
 */
function whyNotTheRest(v: number, p: Take): Wrong {
  const text = String(v);
  const rest = p.here - p.gone;
  if (v === p.here + p.gone) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'The two counts added. The story was heard as "some more arrived" when it said the opposite, so the departing group was counted back IN instead of out. This is the week\'s headline slip and it is the puppet\'s.',
    };
  }
  if (v === p.here) {
    return {
      text,
      errorTag: 'representation-misread',
      rationale: 'Everything on the page counted, marks and all. The crossings were read as decoration rather than as the thing that happened, so nothing was taken away at all.',
    };
  }
  if (v === p.gone) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'The group that went, given as the answer to a question about the group that stayed. The counting was sound; what was answered is the other half of the picture.',
    };
  }
  if (v === rest + 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One too many. The count ran on into the marked run and picked up the first crossed thing before it stopped.',
    };
  }
  if (v === rest - 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One short. The count stopped a place early, or one of the standing things was passed over on the way to the marks.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'Two out. The hand lost the line between what is still standing and what has gone, and counted across it in one direction or the other.',
  };
}

/**
 * The same job for the page's OTHER question — why a number that is not the
 * departed count might still be tapped.
 *
 * It is not the same list read backwards, and that is the point of having two:
 * on "how many went away?" a near miss is a miscount of the MARKED run rather
 * than of the standing one, and the part-for-part swap points the other way. A
 * single explainer would have had to guess which question produced the card, and
 * a rationale that guesses is a rationale that will eventually be wrong.
 */
function whyNotTheGone(v: number, p: Take): Wrong {
  const text = String(v);
  const rest = p.here - p.gone;
  if (v === p.here + p.gone) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'The two counts added. Two numbers on a page were taken as an instruction to add, when the question only asked which part of one group had a line through it.',
    };
  }
  if (v === p.here) {
    return {
      text,
      errorTag: 'representation-misread',
      rationale: 'The whole row counted, marks and all, for a question about the marked part alone. The line through a thing was read as decoration rather than as what makes it one of the ones that went.',
    };
  }
  if (v === rest) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'The group that stayed, given as the answer to a question about the group that went. This is the week\'s commonest slip seen from the other side, and it is exactly why this page asks its question two ways.',
    };
  }
  if (v === p.gone + 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One too many. The count of the marked run started on the last standing thing and carried one extra into the answer.',
    };
  }
  if (v === p.gone - 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One short. One of the marked things was passed over, most often the one at the very end of the row.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'Two out. The line between what is marked and what is standing was lost, and the count crossed it in one direction or the other.',
  };
}

/**
 * The three cards for a page that asks how many are still standing.
 *
 * BELOW the remainder: the departed group when it is smaller than what stayed,
 * and the one-short count. ABOVE it: the one-too-many count, the whole starting
 * group, and the two counts added — which is the only value a take-away can
 * honestly produce on the high side, and is what stops "tap the smallest" from
 * being a strategy. The value 0 appears nowhere (disclosure 5).
 */
function restCards(r: Rng, p: Take): { correct: string; wrongs: Wrong[] } {
  const rest = p.here - p.gone;
  const below = usable([p.gone, rest - 1], rest).filter((v) => v < rest);
  const above = usable([rest + 1, p.here, p.here + p.gone], rest).filter((v) => v > rest);
  return {
    correct: String(rest),
    // ASK FOR THE TOP RANK AND LET THE STEPPING FALL BACK (see `twoWrongs`):
    // a remainder is a part, so every honest value except a handful sits above
    // it, and a uniform target measured 60% at the bottom rank.
    wrongs: twoWrongs(r, below, above, 2).map((v) => whyNotTheRest(v, p)),
  };
}

// ===========================================================================
// Local generator 1 — count what is still standing (the week's core form)
// ===========================================================================

/**
 * One group, the departed struck through, and the remainder to be found by
 * counting what has no mark on it.
 *
 * The truth is recomputed by the registered `d_verify_binop_v1` from the same
 * two counts the picture is built out of (disclosure 2), and QG-13 independently
 * re-derives the drawing's own remaining count and compares it with the keyed
 * option — so the picture, the params and the key are pinned to each other twice
 * over.
 */
function whatIsLeft(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = claimKind(rng, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = takeAway(r, noun);
      const { correct, wrongs } = restCards(r, p);
      const { choices, correctKey } = makeChoices(r, correct, wrongs);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(goneScene(p), `The crossed ones went away. How many ${p.noun} now?`),
        figure: goneFigure(p, assertsAnswerOf('remaining')),
        choices,
        answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.here, b: p.gone, op: '-' }, seed: r.uint() },
        hintLadder: ladder,
        errorTags: ['concept-misconception', 'representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'count-what-stands' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 2 — which part is the question about?
// ===========================================================================

/**
 * The same drawing, and a question that names one of its two groups.
 *
 * A cross-out picture holds two counts, and the cross-out strategy is not "the
 * answer is the smaller number" — it is knowing which of the two the question
 * wants. So the page asks either how many went away or how many are still here,
 * and both are honest reads of one drawing. It is also the slot that stops
 * "always subtract" from certifying a mastery form by itself (disclosure 10).
 *
 * WHICH QUESTION IS ASKED IS TAUGHT ON THE DAY PAGES AND FIXED ON THE CERTIFYING
 * ONE, and both halves of that were settled by measurement.
 *
 * The day pages first. On a fair coin one pack in four asked the same question
 * on all three of them, and a child who never meets the other question has not
 * met the contrast this page exists for; worse, when Day 1 drew "which ones
 * stayed" it asked that directly after two pages that had just asked it in
 * other words. So Day 1 asks for the group that WENT — the new reading, right
 * after two pages about the group that stayed — Day 2 asks for the group that
 * stayed, and Day 3 takes the coin. Variety is worth having where nothing is
 * being certified.
 *
 * THE CERTIFYING SLOT ALWAYS ASKS FOR THE GROUP THAT WENT, AND THAT IS L51.
 * A coin here left one habit alive: subtract whatever two numbers are drawn.
 * Slots 1, 3 and 5 are take-away pages and the difference IS their answer; the
 * two direction slots are dealt one each way, so the habit takes exactly one of
 * them; the part slot was the only other page that could refuse it, and on a
 * coin it refused only half the time. Measured over 3,000 forms: 60.6% of them
 * certified a child who never once decided anything — against 2.0% for a14 and
 * 2.4% for a03. The week is ABOUT deciding, so a form that promotes a
 * non-decider is the A20 defect wearing different clothes (L51: ask whether
 * guessing rewards the very misconception the week teaches against).
 *
 * Fixing the phrasing was not enough on its own — it went to 18.9%, because on
 * `here = 2 × gone` the difference and the departed count are the same number
 * and the habit is ticked by coincidence. Those two pairs are barred from this
 * question (see `WENT_PAIRS`). Now every form carries two pages the habit cannot
 * win, it tops out at 4 of 6, and it certifies nobody: 0.0% of 3,000 forms.
 *
 * WHAT THE FIXED PHRASING DOES NOT COST. The key still varies over 1, 2, 3 and 4
 * across seeds (37/26/24/13), the rank still rotates (37/38/25), and nothing is
 * spoken: the alt names the row, the marks and the arrow and carries no number
 * word at all, so the departed count exists only where it is drawn.
 *
 * The two sides print the SAME NUMERALS — the bracket carries both counts either
 * way — so the freshness guard has nothing to prefer between them and the coin
 * cannot be quietly bent by a redraw (the b09 lesson, kit §E2.9a). The assertion
 * follows the question: the remaining count when the question asks for it, and
 * the starting count as a GIVEN when it does not (kit §E2.5).
 */
type Part = 'stayed' | 'went' | 'either';

function whichPart(ladder: string[], asks: Part): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = claimKind(rng, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      // Drawn first, before anything the guard can see, so the side of the coin
      // is decided by the stream and not by which surfaces are still free.
      const asksWhoStayed = asks === 'either' ? r.chance(0.5) : asks === 'stayed';
      // ONE draw either way, from the list the question is allowed (WENT_PAIRS):
      // the two pairs whose difference equals the departed count are barred from
      // the page that asks for the departed count, and only from that page.
      const [here, gone] = r.pick(asksWhoStayed ? TAKE_PAIRS : WENT_PAIRS);
      const p: Take = { here, gone, noun };
      const rest = p.here - p.gone;
      const key = asksWhoStayed ? rest : p.gone;
      const pool = asksWhoStayed
        ? { below: [p.gone, rest - 1], above: [rest + 1, p.here, p.here + p.gone] }
        : { below: [rest, p.gone - 1], above: [rest, p.gone + 1, p.here, p.here + p.gone] };
      const below = usable(pool.below, key).filter((v) => v < key);
      const above = usable(pool.above, key).filter((v) => v > key);
      const wrongs = twoWrongs(r, below, above, 2).map((v) =>
        (asksWhoStayed ? whyNotTheRest(v, p) : whyNotTheGone(v, p)),
      );
      const { choices, correctKey } = makeChoices(r, String(key), wrongs);
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(
          goneScene(p),
          asksWhoStayed
            ? `Take away means some are gone. How many ${p.noun} are still here?`
            : `Take away means some are gone. How many ${p.noun} went away?`,
        ),
        figure: goneFigure(p, asksWhoStayed ? assertsAnswerOf('remaining') : assertsParam('a')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `op` follows the QUESTION: the remaining count really is `here −
          // gone`, and the departed count really is `here − rest`, so both sides
          // of the coin are recomputed by the same registered transform from the
          // page's own two numbers rather than one of them being taken on trust.
          // `asks` rides along because four of this week's page types pin the
          // same transform, and the assembler compares Form B against Form A on
          // {templateId, params} alone — see disclosure 13.
          params: asksWhoStayed
            ? { a: p.here, b: p.gone, op: '-', asks: 'stayed' }
            : { a: p.here, b: rest, op: '-', asks: 'went' },
          seed: r.uint(),
        },
        hintLadder: ladder,
        errorTags: ['task-comprehension', 'representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'which-part-is-asked' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// The discrimination — did they go, or did they come?
// ===========================================================================

type Way = 'away' | 'along';

/**
 * WHICH DAILY DISCRIMINATION PAGE TAKES THINGS AWAY IS DECIDED ONCE PER PACK.
 *
 * Drawn per page, two fair coins land the same way on one pack in four, and a
 * pack whose Day-2 and Day-3 pages both remove is a pack where "this week means
 * smaller" was never punished. So the coin is spent once, at whichever page is
 * built first, and read back afterwards — a pure function of (which day, the one
 * token stored in the pack's guard), so a page rebuilt by `drawUniqueItem` or by
 * the assembler's guided-example check gets the direction it already had rather
 * than the other day's.
 */
function awayDay(rng: Rng, guard: TupleGuard): 2 | 3 {
  if (guard.taken('a16:away-day=2')) return 2;
  if (guard.taken('a16:away-day=3')) return 3;
  const day: 2 | 3 = rng.chance(0.5) ? 2 : 3;
  guard.add(`a16:away-day=${String(day)}`);
  return day;
}

const dailyWay = (day: 2 | 3) => (rng: Rng, guard: TupleGuard): Way =>
  awayDay(rng, guard) === day ? 'away' : 'along';

/**
 * One of each direction inside every form, dealt rather than drawn.
 *
 * Keyed on the form's own rng object, because `makeWeekBuilder` gives Form A and
 * Form B separate streams and hands the SAME stream back on a rebuild — so a
 * rebuilt page finds the direction it was already given rather than the other
 * form's — something a plain counter cannot distinguish. Nothing survives the
 * pack: the streams are new every time, and the entries go with them.
 *
 * The guarantee is per FORM rather than per corpus: every form a child sits
 * carries one page of each kind, so neither of the two blind directions can ever
 * take both.
 */
const FORM_AWAY_SLOT = new WeakMap<Rng, number>();

/** The two slots the deal runs over, named here rather than inferred from build order. */
const WAY_SLOTS = [2, 6] as const;

function masteryWay(slot: (typeof WAY_SLOTS)[number]) {
  return (rng: Rng, _guard: TupleGuard): Way => {
    let awaySlot = FORM_AWAY_SLOT.get(rng);
    if (awaySlot === undefined) {
      awaySlot = rng.chance(0.5) ? WAY_SLOTS[0] : WAY_SLOTS[1];
      FORM_AWAY_SLOT.set(rng, awaySlot);
    }
    return awaySlot === slot ? 'away' : 'along';
  };
}

/**
 * One drawing, two stories, one question — the heart of the week (disclosure 4).
 *
 * A row of things is drawn, and then either `Then 2 shells went away.` or `Then 2
 * shells came to join them.`, and the question is the same either way: how many
 * are here now? The drawing does not move. Both answers are live keyed values,
 * so no card can be struck out unread, and the two habits that could answer the
 * page without listening are exactly complementary — each scores one of the two
 * pages in any form and neither can do better.
 *
 * `d_verify_binop_v1` recomputes the key from what the STORY did: minus on the
 * page where things left, plus on the page where they arrived, over the same two
 * counts either way. The option pools are mirror images of each other, which is
 * what lets the key's rank rotate on both sides.
 */
function wentOrCame(side: (rng: Rng, guard: TupleGuard) => Way, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    // Once per item, and outside the freshness loop. A redraw is allowed to change
    // the numbers; it is not allowed to spend the other page's direction or to
    // claim a second kind of thing for one page.
    const way = side(rng, guard);
    const noun = claimKind(rng, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const [here, moved] = r.pick(BOTH_WAYS_PAIRS);
      const p: Take = { here, gone: moved, noun };
      const fewer = here - moved;
      const more = here + moved;
      const key = way === 'away' ? fewer : more;
      const cards: Wrong[] = [
        {
          text: String(way === 'away' ? more : fewer),
          errorTag: 'concept-misconception',
          rationale: way === 'away'
            ? 'The story sent some away and they were counted in. Two numbers and a group were taken as an instruction to add, which is the belief this page exists to unseat.'
            : 'The story brought some along and they were taken off. The habit of the week ran ahead of the listening.',
        },
        {
          text: String(way === 'away' ? here : here),
          errorTag: 'task-comprehension',
          rationale: 'The group as it was drawn, handed back unchanged. The picture was read and the story was not, so nothing was done to the number at all.',
        },
      ];
      const below = usable(way === 'away' ? [fewer - 1] : [here, fewer, more - 1], key).filter((v) => v < key);
      const above = usable(way === 'away' ? [fewer + 1, here, more] : [more + 1], key).filter((v) => v > key);
      const wanted = r.int(0, 2);
      const wrongs = twoWrongs(r, below, above, way === 'away' ? wanted : 2 - wanted).map((v) => {
        if (v === (way === 'away' ? more : fewer)) return cards[0];
        if (v === here) return cards[1];
        return v > key
          ? {
            text: String(v),
            errorTag: 'procedure-slip' as ErrorTag,
            rationale: 'One too many. The counting went a step past where the story left the group, either by starting on a number already said or by not stopping.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip' as ErrorTag,
            rationale: 'One short. The counting stopped a step before the story did, so one of the things in the row was never given a number.',
          };
      });
      const { choices, correctKey } = makeChoices(r, String(key), wrongs);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(
          `${countNoun(here, noun)} in a row, ${String(moved)} on the move`,
          way === 'away'
            ? `Then ${countNoun(moved, noun)} went away. How many ${noun} are here now?`
            : `Then ${countNoun(moved, noun)} came to join them. How many ${noun} are here now?`,
        ),
        figure: stillFigure(p, assertsParam('a')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `told` records what the story did, which the op already says on the
          // arriving draw and does not on the departing one — where this page
          // and three others would otherwise pin an identical core (disclosure
          // 13).
          params: { a: here, b: moved, op: way === 'away' ? '-' : '+', told: way },
          seed: r.uint(),
        },
        hintLadder: ladder,
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'which-way-did-it-go', isDiscrimination: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 3 — the puppet who does the other move
// ===========================================================================

/**
 * A named puppet hears a take-away story and adds, and his number is computed
 * rather than authored: `d_verify_binop_misconception_v1` returns `{here − gone,
 * here + gone}` from the page's own pair (disclosure 1). QG-11 checks both
 * halves at every seed — the keyed option against the truth, and the prompt
 * against the misconception's own output. The word "wrong" never appears; what
 * the page says is what he did.
 *
 * His card is always the largest number on offer, so the truth can never be the
 * biggest here — that is what error analysis costs, and it is why the third card
 * is taken from BELOW the truth whenever an honest value exists there
 * (disclosure 10). A child who has learnt that the puppet is never right still
 * faces a coin flip, which is the floor a01, a12, a14 and a20 all reported and
 * the only way past it is to let him sometimes be right.
 */
function puppetAdds(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = claimKind(rng, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = takeAway(r, noun);
      const puppet = r.pick(PUPPETS);
      const rest = p.here - p.gone;
      const said = p.here + p.gone;
      const below = usable([rest - 1, p.gone], rest).filter((v) => v < rest);
      const above = usable([rest + 1, p.here], rest).filter((v) => v > rest);
      const third = below.length > 0 ? r.pick(below) : r.pick(above);
      const { choices, correctKey } = makeChoices(r, String(rest), [
        {
          text: String(said),
          errorTag: 'concept-misconception',
          rationale: 'The puppet\'s own number: the group that left, added on instead of taken off. He heard a story about things going and did the move he knows best.',
        },
        whyNotTheRest(third, p),
      ]);
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(
          goneScene(p),
          `Some ${p.noun} went away. ${puppet} put them back on and says ${String(said)}. How many ${p.noun} are left?`,
        ),
        figure: goneFigure(p, assertsAnswerOf('remaining')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(rest)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_misconception_v1',
          params: { a: p.here, b: p.gone, op: '-', wrongOp: '+' },
          seed: r.uint(),
        },
        hintLadder: ladder,
        errorTags: ['concept-misconception', 'representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 4 — the Day-4 real-world picture story
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family has no story generator at all, so this week's four places are set out
 * below.
 *
 * Each frame supplies a place and a leaving verb and nothing else; the kind of
 * thing and both counts are DRAWN, so no scene in this week is welded to a noun.
 * THE PLACE STAYS IN THE STORY AND OUT OF THE PICTURE: no primitive draws a
 * puddle or a cart, so an alt naming one would describe something that is not
 * there (the L27 class). The drawing is a row with marks on it, so that is what
 * the alt says, and where it happened is narration that belongs in the question.
 *
 * The nouns are the countable pool without ducks and stars. A story is the one
 * place in this week where a thing has to be handled — scooped, tipped, rolled —
 * and neither of those two survives being handled.
 */
const STORY_NOUNS = COUNTABLE_NOUNS.filter((n) => n !== 'ducks' && n !== 'stars');

interface Frame {
  line: (name: string, noun: string) => string;
  ask: (noun: string) => string;
  ladder: string[];
}

/**
 * FOUR frames for three daily pages: the fourth is the certifying slot's own.
 * Three frames would have the mastery page borrowing from Day 4, and a pack that
 * visits the same puddle three times in a week looks short of ideas rather than
 * deliberate.
 */
const FRAMES: Record<'puddle' | 'hill' | 'boat' | 'cart', Frame> = {
  puddle: {
    line: (name, noun) => `${name} scoops some ${noun} out of the puddle.`,
    ask: (noun) => `How many ${noun} are left in the puddle?`,
    ladder: ['The scooped ones are out and dry now.', 'Count what is still down in the water.'],
  },
  hill: {
    line: (_name, noun) => `Some ${noun} tumble all the way down the hill.`,
    ask: (noun) => `How many ${noun} stay up on the hill?`,
    ladder: ['The tumbling ones are far away by now.', 'Count only the ones that stayed up top.'],
  },
  boat: {
    line: (name, noun) => `${name} passes some ${noun} off the little boat.`,
    ask: (noun) => `How many ${noun} sit on the boat now?`,
    ladder: ['Somebody took those ones off the boat.', 'Count who is still sitting on it.'],
  },
  cart: {
    line: (name, noun) => `${name} takes some ${noun} out of the cart.`,
    ask: (noun) => `How many ${noun} ride in the cart now?`,
    ladder: ['The tipped ones landed on the ground.', 'Count what is still riding along.'],
  },
};

function takeAwayStory(which: 'puddle' | 'hill' | 'boat' | 'cart'): ItemGen {
  const frame = FRAMES[which];
  return (rng, guard, difficulty) => {
    const noun = claimKind(rng, STORY_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = takeAway(r, noun);
      const name = r.pick(NAMES);
      const { correct, wrongs } = restCards(r, p);
      const { choices, correctKey } = makeChoices(r, correct, wrongs);
      const draft: ItemDraft = {
        type: 'word-problem',
        // The sentence hands over nothing countable — a person, a kind of thing
        // and a place — so both quantities exist only where they are drawn.
        prompt: scenePrompt(goneScene(p), `${frame.line(name, p.noun)} ${frame.ask(p.noun)}`),
        figure: goneFigure(p, assertsAnswerOf('remaining')),
        choices,
        answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.here, b: p.gone, op: '-', place: which }, seed: r.uint() },
        hintLadder: rungs(...frame.ladder),
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        // 'part-whole' and not 'separate': `SituationType` carries 'combine',
        // 'comparison' and 'part-whole' but has no SEPARATE member, and a
        // take-away story is the closest thing it can say — the whole is drawn,
        // one part leaves, the other part is what the question wants. Recorded
        // for the orchestrator: the early-years situation taxonomy is join /
        // separate / part-part-whole / compare, and the second of those has no
        // name in the union, so A16, A17 and A18 all have to borrow one.
        authorMeta: { stepCount: 1, cognitiveOp: 'take-away-story', situationType: 'part-whole' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generators 5 and 6 — the Day-5 pair
// ===========================================================================

/**
 * The recipe's Day-5: sort the story into the move it made (disclosure 7).
 *
 * One row of things, and a hat. Either some of them are slipped into the hat, or
 * some are shaken out of it and join the row — and the child names the move
 * rather than doing it, which is the non-computational read of the week's whole
 * contrast. The stories deliberately share no word with either button: an
 * earlier draft said "went away" beside a button reading "take away", and a child
 * could have matched the sound without ever looking at the group.
 *
 * `a_join_or_take_v1` recomputes the key from `isJoin`, so the sort is pinned
 * rather than asserted.
 */
function sortTheStory(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = claimKind(rng, STORY_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const adds = r.chance(0.5);
      const [here, moved] = r.pick(BOTH_WAYS_PAIRS);
      const name = r.pick(NAMES);
      const { choices, correctKey } = makeChoices(r, adds ? 'add' : 'take away', [
        {
          text: adds ? 'take away' : 'add',
          errorTag: 'task-comprehension',
          rationale: 'Names the other move. The hat was heard but not which way the things went through it, so the story was sorted by the fact that something happened rather than by what happened.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(
          `${countNoun(here, noun)} in a row and a hat`,
          adds
            ? `${name} shakes ${countNoun(moved, noun)} out of the hat. Tap the word for this story.`
            : `${name} slips ${countNoun(moved, noun)} into the hat. Tap the word for this story.`,
        ),
        figure: counters(here, noun, {
          arrangement: 'in a row',
          alt: `a row of ${noun} side by side`,
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [adds ? 'add' : 'take away'], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_join_or_take_v1',
          params: { a: here, b: moved, isJoin: adds },
          seed: r.uint(),
        },
        hintLadder: ladder,
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'name-the-move', isDiscrimination: true },
      };
      return draft;
    });
  };
}

/**
 * The catalog's Day-5 non-computational focus — a subtraction story drawing with
 * a draw-the-answer box — in the only form that exists (disclosure 8). The
 * starting group and the marks are drawn by code; the answer is drawn by the
 * child, on the scratchpad every band-A page already carries; and the telling is
 * oral, which is §3's production stance for this band.
 */
function drawWhatIsLeft(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = claimKind(rng, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = takeAway(r, noun);
      const rest = p.here - p.gone;
      const draft: ItemDraft = {
        type: 'drawing',
        // The sign is described by what it DOES. It is nowhere on this page, and
        // a question pointing at where it sits would send a child hunting for
        // something that is not there (the L27 class, and a14's lesson 12).
        prompt: scenePrompt(
          goneScene(p),
          `Take away means some are gone. Draw the ones still here. Say what went.`,
        ),
        figure: goneFigure(p, assertsAnswerOf('remaining')),
        answer: {
          value: String(rest),
          acceptableForms: [`${countNoun(rest, p.noun)} drawn`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.here, b: p.gone, op: '-' }, seed: r.uint() },
        hintLadder: ladder,
        errorTags: ['representation-misread', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'draw-what-is-left' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 7 — give a family warm-up the cards it needs
// ===========================================================================

/**
 * At this band a numeric item with no authored `choices` does not become a
 * free-entry page. It becomes four buttons that a render-time function guesses
 * at without knowing what range the slot's answer lives in (L53) — for a child
 * who could not type into a box anyway. All four warm-ups
 * arrive from the family that way, so each is given three authored cards drawn
 * from the honest miscounts ITS OWN question produces, with the truth's rank
 * put through the same rank dealer that serves the core pages.
 *
 * It also takes back an audit that would otherwise be lost: QG-5 does not
 * re-derive an `answerFor` for a `choice-key` item, so the wrapper re-reads the
 * item's own `generator.params`, recomputes the answer independently, and
 * refuses to build if the picture and the key have parted company. Nothing is
 * drawn before `base` runs, and neither the prompt nor the figure is touched, so
 * the surface QG-1 signs is the one the family produced.
 */
function withCards(
  base: ItemGen,
  truthOf: (params: Record<string, unknown>) => number,
  poolOf: (n: number, params: Record<string, unknown>) => number[],
  whyOf: (v: number, n: number, params: Record<string, unknown>) => Wrong,
): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error('A16 withCards: no params on this warm-up, so nothing can re-derive its key');
    const n = truthOf(params);
    const stated = [draft.answer.value, ...draft.answer.acceptableForms];
    if (!Number.isInteger(n) || !stated.includes(String(n))) {
      throw new Error(
        `A16 withCards: ${draft.generator?.templateId ?? 'an item'} keyed "${draft.answer.value}", but its own params give ${String(n)}`,
      );
    }
    const values = usable(poolOf(n, params), n);
    const below = values.filter((v) => v < n);
    const above = values.filter((v) => v > n);
    const { choices, correctKey } = makeChoices(
      rng,
      String(n),
      twoWrongs(rng, below, above, rng.int(0, 2)).map((v) => whyOf(v, n, params)),
    );
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

/**
 * A12 — the hiding game, and the closest thing to a take-away the child has met.
 *
 * Its cards are the part in plain sight — the bond never made — and one whisper
 * to each side of the truth. A partner of five is 1, 2, 3 or 4 and all four are
 * keyed across the seeds, so no card here can be ruled out before it is read.
 */
const warmHidden = asWarmUp(
  withLadder(
    withCards(
      partnersHiding({ total: 5 }),
      (p) => Number(p.total) - Number(p.shown),
      (n, p) => [Number(p.shown), n - 1, n + 1].filter((v) => v >= 1 && v <= 4),
      (v, n, p) => {
        if (v === Number(p.shown)) {
          return {
            text: String(v),
            errorTag: 'task-comprehension',
            rationale: 'The part on show, offered for the part under the cover. Nothing was worked out here; a number that was already known was said again.',
          };
        }
        return v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'One too many. The count on to five started a step late, which adds a number that no empty cell stands for.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'One too few. The count on to five gave up while the frame still had a gap in it.',
          };
      },
    ),
    rungs('The cover is hiding a few of them.', 'Count on to five. How many did you say?'),
  ),
  12,
);

/** A14 — a join, on the day the child first has to tell the two moves apart. */
const warmJoin = asWarmUp(
  spreadsItsKind(withLadder(
    withCards(
      pictureJoin({ min: 1, max: 4, maxTotal: WHOLE }),
      (p) => Number(p.a) + Number(p.b),
      // NOTHING ABOVE FIVE IS OFFERED, and that is measured rather than tidy. A
      // join inside five cannot total six, so a card of six is one a child can
      // strike out unread; before the cap it was offered on 45% of this slot's
      // draws and keyed on none of them (L38). The over-count that survives the
      // cap is the same slip made twice, which is what keeps the key off the top
      // of the page on the small totals.
      (n, p) => {
        const bigger = Math.max(Number(p.a), Number(p.b));
        return [bigger >= 2 ? bigger : n - 1, n - 1, n - 2, n + 1, n + 2].filter((v) => v >= 1 && v <= WHOLE);
      },
      (v, n, p) => {
        if (v === Math.max(Number(p.a), Number(p.b))) {
          return {
            text: String(v),
            errorTag: 'task-comprehension',
            rationale: 'One of the two groups given for both of them. The counting stopped where the first group did, so the joining never happened.',
          };
        }
        return v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: `${v - n === 1 ? 'One' : 'Two'} too many. Something in the middle answered to two numbers as the counting swung from one group to the next.`,
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: `${n - v === 1 ? 'One' : 'Two'} short. The count ran out of numbers before it ran out of things, most likely at the gap.`,
          };
      },
    ),
    rungs('Nobody went away in this picture.', 'Two little groups, and one number for both.'),
  )),
  14,
);

/** A6 — one step backwards along the path, which is what A17 will count on. */
const warmStepBack = asWarmUp(
  withLadder(
    withCards(
      neighbourNumber({ kind: 'before', min: 2, max: 5 }),
      (p) => Number(p.n) - 1,
      // The step lands in 1–4, so 5 is a card this slot can never key; it was
      // offered on 28% of draws before the range was narrowed to what the
      // question can actually reach.
      (n) => [n + 1, n + 2, n - 1, n - 2].filter((v) => v >= 1 && v <= 4),
      (v, n) => (v === n + 1
        ? {
          text: String(v),
          errorTag: 'task-comprehension',
          rationale: 'The number the path already shows, handed back unchanged — the step was never taken.',
        }
        : v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'A move in the wrong direction, so the walk ended up further along instead of further back.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Two steps back where one was asked for, so the gap on the path was walked straight past.',
          }),
    ),
    rungs('Which end of the path holds the small numbers?', 'Take one step that way and stop.'),
  ),
  6,
);

/** A1 — the plain count-all that every cross-out page finishes with. */
const warmScatter = asWarmUp(
  spreadsItsKind(withLadder(
    withCards(
      countArrangement({ min: 2, max: 5, arrangement: 'scattered' }),
      (p) => Number(p.n),
      // Held to the range the scatter itself is drawn from: 1 and 6 were each
      // offered on about 30% of draws and could not be keyed on any of them.
      (n) => [n + 1, n - 1, n + 2, n - 2].filter((v) => v >= 2 && v <= 5),
      (v, n) => (v > n
        ? {
          text: String(v),
          errorTag: 'representation-misread',
          rationale: `${v - n === 1 ? 'One' : 'Two'} too many. With nothing in a line there is no order to hold on to, and something already counted was counted again.`,
        }
        : {
          text: String(v),
          errorTag: 'procedure-slip',
          rationale: `${n - v === 1 ? 'One' : 'Two'} too few. The count wandered off the ones it had not reached yet and stopped early.`,
        }),
    ),
    rungs('They are all jumbled about here.', 'Keep your eyes on the ones not counted yet.'),
  )),
  1,
);

// --- the core forms, each in its own voice ----------------------------------

const meetsTheTakeAway = whatIsLeft(
  rungs('Put a finger on each crossed one.', 'Those ones have gone. Count the rest.'),
);
const countsWhatStands = whatIsLeft(
  rungs('The marked ones are not in the row now.', 'Count only the ones standing up.'),
);
const crossesAndCounts = whatIsLeft(
  rungs('Find every mark before you count anything.', 'Now count what has no mark on it.'),
);
const namesThePart = whichPart(
  rungs('Listen for which ones the question wants.', 'Then count that little group on its own.'),
  'went',
);
const namesThePartAgain = whichPart(
  rungs('Two groups are here now, not one.', 'The words say which of them to count.'),
  'stayed',
);
const namesThePartDay3 = whichPart(
  rungs('Say the question over in your head.', 'Point at the group it is about.'),
  'either',
);
const listenDay2 = wentOrCame(
  dailyWay(2),
  // BOTH RUNGS MUST BE TRUE OF BOTH STORIES. The ladder cannot follow the drawn
  // direction either, since the dedup gate only stays seed-invariant while a
  // slot's help holds still. So the help names the decision and leaves the
  // answer to the story.
  rungs('Listen again. Did they go, or did they come?', 'That one word decides. Then count.'),
);
const listenDay3 = wentOrCame(
  dailyWay(3),
  rungs('The picture is the same either way.', 'Only the story says what happened next.'),
);
const puppetDay3 = puppetAdds(
  rungs('The puppet counted the gone ones too.', 'They went. Take them off and count.'),
);
const puppetDay5 = puppetAdds(
  rungs('Ask the puppet where those ones went.', 'They are gone, so count the rest.'),
);
const storyPuddle = takeAwayStory('puddle');
const storyHill = takeAwayStory('hill');
const storyBoat = takeAwayStory('boat');
const sortsTheStory = sortTheStory(
  rungs('Follow the things into the hat or out.', 'Did the row get bigger or smaller?'),
);
const drawsWhatIsLeft = drawWhatIsLeft(
  rungs('Look at the ones with no mark.', 'Draw that many, one at a time.'),
);

// --- the six certifying slots -----------------------------------------------

const masteryRest = whatIsLeft(
  rungs('Some of these are marked and gone.', 'Count what is left when you skip those.'),
);
const masteryWayOne = wentOrCame(
  masteryWay(2),
  rungs('Something happened after this picture was drawn.', 'Work out what, then count from there.'),
);
const masteryStory = takeAwayStory('cart');
const masteryPart = whichPart(
  rungs('Which ones does the question mean?', 'Count that group and nothing else.'),
  'went',
);
const masteryPuppet = puppetAdds(
  rungs('Some of them are not there any more.', 'Count what is left on the page.'),
);
const masteryWayTwo = wentOrCame(
  masteryWay(6),
  rungs('Say the story back before you tap.', 'Did the row grow, or did it shrink?'),
);

// ===========================================================================
// The week
// ===========================================================================

export const buildA16 = makeWeekBuilder({
  level: 'A',
  week: 16,
  conceptId: 'meeting-subtraction',
  conceptName: 'Meeting subtraction',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [
    { level: 'A', week: 14 },
    { level: 'A', week: 15 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'acting out what goes away',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Every take-away picture draws the whole starting group and puts a line through the ones that left, so the child can still see what is missing. Do it with real things before the screen: put five buttons out, count them, then slide two of them into your hand and ask how many are still on the table. Bring the two back and ask again. The week is the difference between those two questions. Mascot present.',
  },
  explanation: {
    hook: say(
      'Five shells sit on a rock. A wave washes two away. Three shells are still there. Where did the other two go? Let us find out together.',
    ),
    whyBeforeHow: say(
      'A group can get smaller. Some of it goes away. That is taking away. We know because we put a line through what went. So we start by acting out what goes away. Move them off with your hand. Then count the ones still standing.',
    ),
    script: [
      {
        say: say('Here are five shells in a row on the mat.'),
        visual: 'Five shells laid out in a row, all of them whole.',
        figure: counterGroups(
          [{ count: 5, noun: 'shells' }],
          { alt: 'a row of shells side by side' },
        ),
      },
      {
        say: say('Watch. Two shells go away. I cross those two out.'),
        visual: 'The same row, with a line through the last two shells and an arrow leading off.',
        figure: counterGroups(
          [{ count: 5, noun: 'shells' }],
          {
            relation: 'remove',
            crossedOut: 2,
            alt: 'a row of shells, some of them crossed through, with an arrow leading away from the marks',
          },
        ),
      },
      {
        say: say('The crossed ones are gone. Count the rest with me.'),
        visual: 'A finger touching each uncrossed shell in turn, skipping the crossed ones.',
      },
      {
        say: say('Five take away two is three. We write it like this.'),
        visual: 'The take-away sentence written under the picture: 5 − 2 = 3.',
      },
    ],
    summary: say(
      'A group got smaller. Some of it went away. Cross out what went. Count what is still there. The take-away sign means: some are gone.',
    ),
    vocabulary: [
      { term: 'take away', kidGloss: 'when some of a group goes, and fewer are left' },
      { term: 'minus', kidGloss: 'the little dash that says: some went away' },
      { term: 'left', kidGloss: 'the ones still here after the others go' },
      { term: 'cross out', kidGloss: 'put a line through the ones that went' },
    ],
  },
  guidedExamples: [
    {
      // Every guided-example bracket names all three numbers, which is what a
      // worked example is for — and it keeps the assembler's echo check off the
      // day pages, since no generated item ever prints three counts.
      ...ge(
        16,
        1,
        'modeled',
        scenePrompt('4 blocks with 1 crossed out, 3 blocks left', 'The crossed ones went away. How many blocks now?'),
        [
          {
            teacherSay: say('Watch me. I put my hand over the crossed block.'),
            expected: 'the crossed block hidden',
          },
          { teacherSay: say('That one is gone now. So do I count it?') },
          { childDo: say('Count the ones we can still see.'), expected: '3' },
          { teacherSay: say('Three blocks. The gone one is not part of it.') },
        ],
        '3',
      ),
      visual: 'Four blocks in a row, the last one crossed through, a hand covering it.',
      figure: counterGroups(
        [{ count: 4, noun: 'blocks' }],
        {
          relation: 'remove',
          crossedOut: 1,
          alt: 'a row of blocks, one of them crossed through, with an arrow leading away from the mark',
          asserts: assertsAnswerOf('remaining'),
        },
      ),
    },
    {
      ...ge(
        16,
        2,
        'completion',
        scenePrompt('5 apples with 3 crossed out, 2 apples left', 'The crossed ones went away. How many apples now?'),
        [
          { teacherSay: say('Three of them have a line through. So...') },
          { childDo: say('Count only the ones with no line.'), expected: '2' },
          { teacherSay: say('Two apples. You skipped every crossed one.') },
        ],
        '2',
      ),
      visual: 'Five apples with the last three crossed through and a finger on the two that remain.',
      figure: counterGroups(
        [{ count: 5, noun: 'apples' }],
        {
          relation: 'remove',
          crossedOut: 3,
          alt: 'a row of apples, some of them crossed through, with an arrow leading away from the marks',
          asserts: assertsAnswerOf('remaining'),
        },
      ),
    },
    {
      ...ge(
        16,
        3,
        'prompted',
        scenePrompt('3 leaves and 2 leaves joined, 5 leaves in all', 'Then 2 leaves came to join them. How many leaves now?'),
        [
          { teacherSay: say('Careful. Nothing went away in this one.') },
          { childDo: say('Two more came. So count them all.'), expected: '5' },
          { teacherSay: say('Five. The plus sign joins. The minus sign takes away.') },
        ],
        '5',
      ),
      visual: 'Three leaves and two more leaves, side by side with a plus sign between them.',
      figure: counterGroups(
        [{ count: 3, noun: 'leaves' }, { count: 2, noun: 'leaves' }],
        { relation: 'join', alt: 'a group of leaves, a plus sign, then another group of leaves', asserts: assertsAnswerOf('count') },
      ),
    },
    {
      ...ge(
        16,
        4,
        'independent',
        scenePrompt('3 flowers with 2 crossed out, 1 flower left', 'The crossed ones went away. How many flowers now?'),
        [{ childDo: say('Take the marked ones off. Count what stays.'), expected: '1' }],
        '1',
      ),
      visual: 'Three flowers with the last two crossed through.',
      figure: counterGroups(
        [{ count: 3, noun: 'flowers' }],
        {
          relation: 'remove',
          crossedOut: 2,
          alt: 'a row of flowers, some of them crossed through, with an arrow leading away from the marks',
          asserts: assertsAnswerOf('remaining'),
        },
      ),
    },
  ],
  days: [
    // Day 1 — the take-away met, and the two groups a crossed-out picture holds.
    [
      { gen: warmHidden, diff: 2 },
      { gen: meetsTheTakeAway, diff: 2 },
      { gen: countsWhatStands, diff: 2 },
      { gen: namesThePart, diff: 3 },
    ],
    // Day 2 — a join to remember, then the first page where the story decides.
    [
      { gen: warmJoin, diff: 1 },
      { gen: crossesAndCounts, diff: 2 },
      { gen: listenDay2, diff: 3 },
      { gen: namesThePartAgain, diff: 3 },
    ],
    // Day 3 — the contrast again, and the puppet who does the other move.
    [
      { gen: warmStepBack, diff: 2 },
      { gen: listenDay3, diff: 3 },
      { gen: puppetDay3, diff: 3 },
      { gen: namesThePartDay3, diff: 3 },
    ],
    // Day 4 — one thing happening somewhere real, three times over.
    [
      { gen: warmScatter, diff: 2 },
      { gen: storyPuddle, diff: 3 },
      { gen: storyHill, diff: 3 },
      { gen: storyBoat, diff: 3 },
    ],
    // Day 5 — name the move, draw what is left, and settle the puppet once more.
    [
      { gen: sortsTheStory, diff: 3 },
      { gen: drawsWhatIsLeft, diff: 2 },
      { gen: puppetDay5, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // Day-5 only. `validator.ts` (S-SCHEMA) rejects a strip on Days 1–4 and
    // `PuzzleGrove.tsx` renders Day 5's, hardcoded; FILL-ARCHITECTURE §1 was
    // amended to match on 2026-08-09, so this is the spec rather than a deviation.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this is the week your child meets taking away, and the useful surprise is that it is easier to see than to say. Put out a small handful of anything — buttons, socks, grapes — count them together, then slide two of them away while your child watches and ask how many are still on the table. The sliding matters: a child who only ever sees the answer group has to take your word for what happened, while a child who watches two leave can point at the gap. On paper we do the same thing by drawing a line through the ones that went, so the whole story stays on the page. Two things to listen for. Some children answer with the group that LEFT rather than the group that stayed, which is a listening slip and not a counting one — ask "how many are still here?" and then "how many went?" over the same picture, and let them hear that those are two questions. Others add whatever numbers they hear, because adding is what last month was about; that is the puppet\'s mistake in this week and it is worth laughing about together. Say the sign out loud when you write it — "five take away two is three" — long before anyone asks them to write it themselves.',
  ],
  /**
   * The puzzle asks the question no page in the week keys: not how many are left,
   * but how many must GO. Every day page is handed a picture with the marks
   * already on it and counts what survived; here the marks are the child's to
   * make, and the target is stated instead. That is the inverse move, it is the
   * bridge into A17's count-back, and it is a doing task rather than a tapping
   * one — the band's sanctioned build form.
   *
   * It carries no `asserts` (disclosure 9): the quantity the picture can compute
   * is the group as it was handed over, and the item asks for the part that must
   * leave it. One drawn `here` fixes both, so they cannot disagree.
   */
  puzzle: (r) => {
    const noun = r.pick(STORY_NOUNS);
    const here = r.int(3, WHOLE);
    const stay = r.int(1, here - 1);
    return {
      id: 'A16-PZ-01',
      title: 'Puzzle Grove: How Many Must Go?',
      puzzleType: 'construction',
      prompt: [
        `[image: ${countNoun(here, noun)} in a row]`,
        say(`Leave just ${countNoun(stay, noun)}. Cross the rest off.`),
      ].join(' '),
      figure: counters(here, noun, {
        arrangement: 'in a row',
        alt: `a row of ${noun} side by side`,
      }),
      answer: {
        value: String(here - stay),
        acceptableForms: [`${countNoun(here - stay, noun)} crossed out`],
        validation: 'manual-review',
      },
      hintLadder: rungs('Count what is sitting there right now.', 'Cross one off. Is the row small enough yet?'),
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'cross-out-to-leave' },
  sprint: null,
  mastery: [
    { gen: masteryRest, diff: 2 },
    { gen: masteryWayOne, diff: 3 },
    { gen: masteryStory, diff: 3 },
    { gen: masteryPart, diff: 3 },
    { gen: masteryPuppet, diff: 3 },
    { gen: masteryWayTwo, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh surfaces off a separate stream. All six slots are answered by tapping one of three authored cards, so nothing here falls through to the buttons the display layer invents for a numeric band-A item. 01: count what is still standing in a crossed-out row. 02 and 06: one row of things under two stories - some went away, or some came to join them - with the same question asked either way, so the answer is the smaller count on one and the larger on the other. 03: a story that names a person, a kind and a place, and neither count. 04: the same crossed-out picture with the question naming one of its two groups, so the answer is what stayed or what went. 05: a puppet who adds the departing group back on instead of taking it off. WHICH OF THE TWO DIRECTION SLOTS TAKES THINGS AWAY IS DEALT PER FORM, not left to a coin per page: every form carries exactly one page each way, so a child who makes every group smaller on sight scores exactly one of the two, and so does a child who adds everything. Both forms are dealt independently. SLOT 04 IS WHAT STOPS THE WEEK CERTIFYING ITS OWN HABIT, and on a form it always asks for the group that WENT: a child who subtracts whatever two numbers are drawn is then wrong here and wrong on one of the two direction pages, so the best that habit can do is four of six and it certifies nobody. The daily pages ask the question both ways round; only the certifying one is fixed. NO COUNT IS EVER SPOKEN: the figure alt, which is read aloud first at this band, names the kind of thing, the marks and the arrow, and no quantity at all, so a form cannot be answered from the audio. The value 0 is never offered anywhere, because a take-away that stops one short of the whole can never produce it and an option that can never be keyed teaches a child to strike it out unread.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'adds-when-the-story-removes',
      description: 'Adds the two counts when the story took one of them away. Adding is the move the child owns, so a story with two numbers in it gets the move that is closest to hand — and the answer comes out bigger than the group ever was, which is the tell an adult can spot from across the room.',
      exampleWrongAnswer: 'five shells with two washed away, answered as seven',
      distractorRationale: 'It sits among the cards of every page that asks for a count, and it is the number the puppet says out loud on his own. No take-away question can key it. The discrimination page keys it whenever the story brings things along instead — so one number is right or wrong depending only on which way the story went, and that is the distinction the week exists to build.',
      reteachPointer: 'explanation/script[1] (two shells crossed out of the row of five)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-group-that-went',
      description: 'Gives the count of the group that left when the question asked about the group that stayed. Nothing is miscounted; what went astray is which half of the picture the question named. It is the commonest slip of the week and it is a listening error, not an arithmetic one.',
      exampleWrongAnswer: 'asked how many are still here with three crossed out of five, answers three',
      distractorRationale: 'A live card on every take-away page, and the KEYED answer on the certifying slot that asks how many went away, which is drawn on a coin. So "give the crossed count" cannot be eliminated and cannot be relied on: it is right about half the time on that slot by construction, which is what makes reading the question worth doing.',
      reteachPointer: 'guidedExamples/A16-GE-01 (the crossed block covered by a hand)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-the-crossed-ones-too',
      description: 'Counts every drawn thing, marks and all, so the answer is the group as it was before anything happened. The line through a thing has been read as decoration rather than as the event, which is the exact thing the cross-out strategy asks a child to believe.',
      exampleWrongAnswer: 'four leaves with one crossed out, answered as four',
      distractorRationale: 'Offered on every cross-out page and on both discrimination pages, where it is the number the picture shows before the story moves anything. It is never keyed on a take-away page, and it is what a child says when they can see the picture but have not yet accepted that a crossed thing has gone.',
      reteachPointer: 'explanation/script[2] (the finger skipping the crossed ones)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-line-between-gone-and-here',
      description: 'Counts the standing things but loses the place where the marks begin — either the count runs on and picks up the first crossed one, or it stops a place early and leaves a standing thing unnamed.',
      exampleWrongAnswer: 'five apples with three crossed out, answered as three or as one',
      distractorRationale: 'Both near misses sit in the pool of every counting page, and they are the two numbers closest to the truth, so a child who has almost held the line lands on one of them rather than on a value from the far side of the picture. On the warm-ups the same slip shows up as a count one or two out.',
      reteachPointer: 'guidedExamples/A16-GE-02 (counting only the apples with no line)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Meeting subtraction as a story: a group gets smaller because some of it goes away, and we find out how many are left by crossing out what went and counting the rest. We met the take-away sign, and we practised telling a going-away story apart from a coming-along one.',
    improvingCandidates: [
      'crossing out what went and counting only what still stands',
      'telling a going-away story apart from a coming-along one',
      'answering "how many are still here?" and "how many went?" as two different questions',
      'saying what the take-away sign asks you to do',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'taking the departing group OFF rather than adding it on — we will keep asking "did the group get bigger or smaller?" before anyone answers',
      },
      {
        errorTag: 'task-comprehension',
        text: 'hearing which group the question is about, because a crossed-out picture holds two numbers and only one of them is being asked for',
      },
      {
        errorTag: 'representation-misread',
        text: 'treating a crossed-out thing as gone rather than as still on the page, so the marks change the count instead of decorating it',
      },
    ],
    homeFocus: {
      praiseLine:
        'You crossed out the ones that went and then counted only the ones still standing, without counting the marked ones again.',
      questionForChild: 'Some went away and some are still here. Which ones does my question want?',
      schoolSyncHook: 'Tell us what goes away at your house — socks off the line, grapes off the plate — and next week\'s stories will use them.',
    },
    vocabularyForParent: [
      'take away (some of a group goes, and fewer are left)',
      'minus (the sign that says: some went away)',
      'left (the ones still there once the others have gone)',
      'cross out (draw a line through what went, so the whole story stays on the page)',
    ],
  },
});
