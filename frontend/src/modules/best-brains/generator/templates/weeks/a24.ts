/**
 * Level A · Week 24 — "Ready for Level B (consolidation)" (conceptId:
 * ready-for-level-b). THE LEVEL-EXIT GATE.
 *
 * FILL-ARCHITECTURE §3 row A24: concept "Ready for B"; anchor "mixed stories";
 * core forms "retrieval-heavy mix of A12-A23"; perceptual discrimination "mixed
 * +/- choice"; puppet error-analysis "(mixed)"; Day-5 "my favourite way to make
 * 10" (oral R). Catalog row: computational focus "mixed capstone: count/write to
 * 20, +/- within 10, bonds to 10"; non-computational Day-5 focus
 * "math-vocabulary picture crossword with word bank".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE RULE THIS WEEK IS WRITTEN AGAINST
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * FILL-ARCHITECTURE §3: a consolidation week is "documented DEEPENING -
 * integration of the level's skills at raised complexity, explicit
 * deepeningDelta, retrieval share raised toward 30%, and a real exit-check
 * emphasis. **Never a bare mixed-review pile.**"
 *
 * So the first question this file had to answer is what INTEGRATION adds that
 * twenty-three separate weeks did not, given that the band's ceiling does not
 * move: still within ten for the operations, still to twenty for the counting.
 * The answer is not harder numbers. It is TWO THINGS, and every core page below
 * exists to force one or both of them:
 *
 *  1. **CHOOSING THE MOVE WHEN NOTHING ON THE PAGE SIGNALS IT.** Every earlier
 *     week announced its own move by announcing itself: A13 was the partners
 *     page, A17 was the counting-back page, A23 was the teen page. A child can
 *     be fluent in all twenty-three and never once have decided which of them a
 *     page wants.
 *  2. **HOLDING A NUMBER ACROSS TWO IDEAS THAT WERE TAUGHT APART.** This is the
 *     one that makes the week hard in the right way and it is the whole design:
 *     **on every core page, one of the two amounts is only in the PICTURE and
 *     the other is only in the WORDS.** The child must count a drawn set (A1,
 *     A2, A9), keep that number in their head, and then do something to it that
 *     a sentence asked for (A13, A14-A18, A23). Neither half is new. Doing both
 *     without either one being written down is.
 *
 * The model for this is A21, whose own report is the exemplar the brief names:
 * merging two separately-taught ideas onto ONE SHARED POOL made the week harder
 * in the right way and killed a card-sorting shortcut at the same time. The same
 * move is made twice here - once on the discrimination (disclosure 3) and once
 * on the puppet (disclosure 5).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  - **THE MOVE LIVES IN THE WORDS AND THE AMOUNT LIVES IN THE PICTURE.**
 *    `storyOnTheMat` draws a group, states one number, and asks the same
 *    question whichever way the story goes: things come to the mat, or things go
 *    from it. One syllable separates the two stories and nothing else does, so
 *    keyword matching has nothing to match.
 *  - **TWO PAGES CANNOT BE ANSWERED BY ANY ARITHMETIC REFLEX AT ALL.**
 *    `bondToTen` and `overTheTen` each state exactly ONE number, so there is no
 *    pair of stated numbers for a blind rule to add or subtract. A17's `firstHop`
 *    is the ancestor; this week has two of them and they carry the level's two
 *    biggest ideas - partners of ten, and a teen as ten and some.
 *  - **THE DISCRIMINATION HAS THREE BINS, WHICH IS THE THING A16 AND A18 BOTH
 *    ASKED FOR AND NEITHER COULD BUILD.** "Add or take away?" is a coin flip and
 *    both weeks disclosed it as one. A24 can build the third bin because it is
 *    allowed to reach outside the addition family: a collection that is only
 *    MOVED is A1 and A5's conservation, it is honestly neither move, and it puts
 *    a third class on every page of the slot (disclosure 3).
 *  - **THE PUPPET IS MIXED, AND "MIXED" MEANS THREE DIFFERENT REGISTERED
 *    TRANSFORMS.** Row A24's puppet column reads "(mixed)". The slip rotates over
 *    A10/A23's digit reversal, A17's count-back off-by-one and A18's operation
 *    swap, pinned by `a_verify_teen_write_v1`, `a_verify_countback_slip_v1` and
 *    `d_verify_binop_misconception_v1` respectively - three transforms, three
 *    slips, nothing authored (disclosure 5).
 *  - **RETRIEVAL IS 30.0%, THE TOP OF THE BAND**, and it is six formats from six
 *    different weeks - A4, A5, A7, A11, A13 and A22 - so what is revisited is the
 *    level rather than last week. The dose arithmetic is in disclosure 2.
 *  - **A picture on every working page.** Thirteen of the fourteen core pages draw
 *    themselves out of the numbers they compute with; the fourteenth is Friday's
 *    spoken task, where the band allows a page with nothing on it.
 *  - **No timers.** `sprint: null`. A timed element at band A is a hard fail and
 *    `makeWeekBuilder` refuses a Level-A sprint outright.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCLOSURES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. **THE `deepeningDelta` IS SHIPPED AND THE GATE NEVER ASKS FOR IT.**
 *    `conceptFamily('ready-for-level-b')` strips nothing and matches no earlier
 *    catalog cell, so `priorSameFamily` returns an empty list and §6.13's
 *    precondition never fires - on the one week of the level that is NOTHING BUT
 *    a deepening of the other twenty-three. This is the third shape of the hole
 *    a17 and a18 recorded from the `meeting-` and the compound-id sides, and the
 *    ledger repair for the first does not reach it. The delta is declared anyway,
 *    because FILL-ARCHITECTURE §3 requires it of a consolidation week and because
 *    a delta the gate cannot demand is still the thing a reader needs.
 *    **Recorded for the orchestrator, thirding a17 and a18: the family key needs
 *    an explicit `deepens` edge**, since a consolidation cell shares a prefix
 *    with nothing by construction. Reported, not fixed - `lib/ledger.ts` is not
 *    this file's to change.
 *
 * 2. **RETRIEVAL 30.0%, AND THE ARITHMETIC RATHER THAN THE INTENTION.**
 *    Kit §C: the share must land in 20-30% of DAILY items and every day must
 *    dose to 5-15 minutes at `2.5 + Σ(0.8 + 0.25 × difficulty)`. Twenty daily
 *    items over five days of four is the only shape that reaches the ceiling
 *    exactly: 6/20 = 30.0%, where 5/19 would have been 26.3% and 6/19 would have
 *    been 31.6% and thrown. The days dose to 7.7, 8.45, 8.45, 8.45 and 8.45
 *    minutes, all inside the band with room above and below. The level's other
 *    weeks run 21.1%; this one runs 30.0% and every point of the rise is spent on
 *    a week that has not been retrieved from yet.
 *
 *    WHICH SIX, AND WHY THOSE. One page per format, one format per week, chosen
 *    so that the six warm-ups plus the four core forms touch the whole level
 *    rather than the recipe's own A12-A23 slice twice over: matching a numeral to
 *    a drawn group (A4), more/fewer/same by one-for-one matching (A5), naming a
 *    flat shape by its corners (A7), continuing an AAB pattern (A11), the hiding
 *    game on ten (A13) and counting towers of ten (A22). The core then carries
 *    counting to twenty, bonds to ten, joining, parting, and a teen as ten and
 *    some - so between them the exit week revisits number, comparison, geometry,
 *    pattern, bonds, place value and both operations.
 *
 *    ONE OF THE SIX IS PLACED RATHER THAN SCATTERED. A5's comparison page is
 *    flagged as a discrimination by the family that wrote it, and the gate that
 *    wants a discrimination in Days 2-3 counts flags without asking which week
 *    they came from. Letting it land on Day 2 or Day 3 would therefore let A24
 *    pass its own requirement using A5's trap. It runs on Day 4; the requirement is
 *    met by `nameTheMove`, which is the discrimination this week actually teaches.
 *
 * 3. **THE DISCRIMINATION HAS A THIRD BIN, AND IT IS THE ONE TWO EARLIER WEEKS
 *    RECORDED AS UNBUILDABLE.** `joinOrTakeAway` deals TWO cards, so a coin
 *    scores half of it; a16 shipped that and said so, a18 shipped it again and
 *    seconded the ask for a third branch, noting that "nothing moved" is a label
 *    no draw of `a_join_or_take_v1` can make true - a dead option dressed as a
 *    fix. Both were right about their own weeks. An addition week has no honest
 *    third answer to "add or take away?".
 *
 *    A CONSOLIDATION WEEK DOES, because it is allowed to reach back past the
 *    addition family. A collection that is tipped out of a row and into a ring
 *    has neither grown nor shrunk - that is A1's scattered-versus-row and A5's
 *    conservation, the trap FILL-ARCHITECTURE §3 calls "THE A trap" - and it is
 *    an honest, drawable, keyed third answer. So `nameTheMove` runs three
 *    branches off one three-word bank:
 *
 *      join      two groups drawn together      key: add          pin a_join_or_take_v1
 *      remove    one group, some struck through key: take away    pin a_join_or_take_v1
 *      rearrange one group, now in a ring       key: the same     pin a_compare_sets_v1
 *
 *    Every one of the three cards is keyed on some draw of the slot, so none can
 *    be struck out unread, and every page carries three classes rather than two.
 *
 *    **THE THIRD PIN IS A READING OF `a_compare_sets_v1` AND IT IS STATED RATHER
 *    THAN ASSUMED.** That transform returns `'they are the same'` whenever its
 *    two counts are equal. The two collections it is handed here are the SAME
 *    collection before the story and after it - which is exactly what conservation
 *    asserts, and exactly what the page claims - so the params `{a: n, b: n}` are
 *    a true statement about the item and the truth QG-11 recomputes is the truth
 *    the page keys. It is not a06's rejected shape (a transform registered with a
 *    test the page never asks about); the transform is asked precisely the
 *    question the page asks. **Recorded for the orchestrator, thirding a16 and
 *    a18: `a_join_or_take_v1` still wants a native third branch**, so that a
 *    week without a conservation story to hand can build this page too.
 *
 *    The word on the card never appears in its own question. `assertBankClean`
 *    throws at module load and again on every draw if "add", "take", "away" or
 *    "same" turns up in a story - which is why things "come to the mat", "go
 *    home" and "sit in a ring" rather than being added, taken away or left the
 *    same.
 *
 * 4. **TWO SLOTS THAT NO FIXED ARITHMETIC HABIT CAN ANSWER, AND HOW THEY GOT THAT
 *    WAY.** The brief asks every week to carry at least one page a reflex cannot
 *    reach. A17 built one by keying a value that is neither the sum nor the
 *    difference of what its page prints. A18 wanted the same thing and proved it
 *    could not have it: give a story two spoken amounts and one operation, and
 *    every question you can ask about them resolves to their sum or their
 *    difference, whichever way round you phrase it.
 *
 *    So this week attacks the premise instead of the conclusion — it stops the two
 *    amounts BOTH being spoken. `bondToTen` prints the target and draws the group,
 *    so the answer is `10 − n` for an `n` no sentence ever mentions. `overTheTen`
 *    prints what moves and draws the frame, so the answer is `10 + o ± b` for a
 *    `10 + o` no sentence ever mentions. Either way a child running a fixed
 *    operation over the printed numbers is holding a single number with nowhere to
 *    put it.
 *
 *    That is not a dodge, and the honest way to say so is to name the habit it
 *    leaves alive: a child CAN count the picture and then apply a fixed move to
 *    whatever they counted. That is this week's real always-add, it is fully
 *    measurable, and disclosure 8 reports it under its own name rather than
 *    hiding behind an undefined classical one.
 *
 * 5. **THE PUPPET IS THREE SLIPS AND THREE TRANSFORMS, AND NONE OF THEM IS
 *    AUTHORED.** Row A24's puppet column is "(mixed)", and mixed here is taken to
 *    mean the level's own slips rather than one slip over mixed numbers:
 *      · **the digits the other way round** (A10, A23): the puppet writes 31 for
 *        a frame holding thirteen. `a_verify_teen_write_v1 {n}` returns
 *        `{correct: n, wrong: reversed}` and QG-11 checks both halves - the keyed
 *        card against the truth and the prompt against the reversal. Eleven is
 *        barred by the transform itself (it reads the same reversed) and is
 *        barred here too.
 *      · **the count-back that starts on the wrong number** (A17): the puppet
 *        says one too many are left. `a_verify_countback_slip_v1 {a, b}` returns
 *        `{correct: a − b, wrong: a − b + 1}`.
 *      · **the removal answered by adding** (A18): the puppet gives the total.
 *        `d_verify_binop_misconception_v1 {a, b, op:'-', wrongOp:'+'}` returns
 *        `{correct: a − b, wrong: a + b}`.
 *    Three branches, three registered transforms, three of the level's weeks. The
 *    two removal branches are told with DIFFERENT pictures on purpose - the
 *    count-back branch draws the removal, the swap branch draws only the group as
 *    it stood - so they are not one page printed twice.
 *
 *    THE PUPPET'S OWN NUMBER IS OFFERED AS A CARD ONLY WHEN THE SLOT CAN KEY IT.
 *    a16 offered it always and reported it as what error analysis costs; a18 met
 *    the same thing from the plus-one side and withheld it. Here the reversal (31
 *    for 13) is never a teen and is therefore never a tap target, while the
 *    count-back's `a − b + 1` and the swap's `a + b` are offered exactly when they
 *    fall inside the slot's own key set. The word "wrong" never appears; the
 *    puppet is named; the child is asked how many are really left.
 *
 * 6. **A PICTURE'S NAME MAY NOT CONTAIN THE ANSWER, AND THIS WEEK CHECKS IT TWICE
 *    (L48).** Band A plays the picture's name to the child first and asks the
 *    question afterwards, so a number sitting in that name is the answer announced
 *    to somebody who has no way to read past it. One check cannot cover the whole
 *    pack, so there are two of them, aimed at different halves:
 *      · at MODULE LOAD, `alt()` sees every picture name typed into this file and
 *        rejects any digit and any spoken number — zero through twenty, the tens,
 *        hundred, and the ones that hide (once, twice, single, double, twin, pair,
 *        couple, both, dozen, half). Refusing all of them, rather than only the
 *        dangerous ones, costs nothing here: every drawing in this week holds
 *        either the count a page asks for or the amount a page has deliberately
 *        left unspoken, and there is no third kind of number for a picture to
 *        mention.
 *      · at DRAW TIME, `spokenSafe()` wraps everything, which is the only way to
 *        reach the six pages whose names are assembled in `lib/`. It asks what
 *        this particular draw would accept and objects only if the name says one
 *        of those things. That is why A22's warm-up can go on calling its picture
 *        "towers of ten blocks": that page answers between twenty and fifty, so
 *        "ten" is never its answer, and it is the fact a child who cannot see the
 *        towers most needs to be told.
 *    Numbers stay in the `[image: …]` brackets, which is not an exception but the
 *    mechanism: the bracket is stripped before display, loses to the figure's own
 *    name in the audio, and is what the pack guard reads to keep operand surfaces
 *    apart. So the amount a child has to COUNT is visible to the software and
 *    inaudible to the child — which is precisely what the second claim above
 *    needs to be true.
 *
 * 7. **THE COUNTING PAGES ARE PINNED BY A LEVEL-D TRANSFORM RATHER THAN BY THE
 *    FAMILY'S OWN, AND FOUR WEEKS HAVE NOW SAID WHY.** `a_join_v1` and
 *    `a_takeaway_v1` do the right arithmetic and register it as an `answerFor`.
 *    QG-5 calls an `answerFor` only when the item validates numerically, and every
 *    certifying page in this band has to be a tap on authored cards instead — a
 *    four-year-old cannot type, and a numeric page with no cards gets buttons
 *    invented for it at runtime (L53). So the family's pins would sit there
 *    green and never run. `d_verify_binop_v1` registers a `verifyFor` instead,
 *    QG-11 calls those on card items, and `{a, b, op}` arrives at the same number
 *    the story does. Identical arithmetic; the difference is that this one is
 *    actually checked. **Recorded for the orchestrator, and this is the fifth week
 *    to record it: `earlynumber` wants verify twins for `a_join_v1` and
 *    `a_takeaway_v1`.**
 *
 *    Every pinned page also stores what it ASKED (`'now' | 'to-ten' | 'teen' |
 *    'swap'`), which is true of the page and is there for a mechanical reason: the
 *    assembler decides whether a Form-B slot repeats a Form-A one by comparing the
 *    template and its params and nothing else. Four page types here share one
 *    template, so a bond and a story that both happened to draw a six and a two
 *    would look like the same question, and the rebuild would burn a fresh surface
 *    to no purpose. Naming the question keeps them apart honestly. a16, a17 and
 *    a18 have each recorded the underlying limit; this is the fourth week to work
 *    around it.
 *
 * 8. **WHICH NUMERALS MAY BE OFFERED IS COMPUTED FROM EACH POOL, NEVER DECLARED
 *    BY HAND (L38), AND THE FIRST BUILD GOT THE UNIT WRONG.** Every page type below
 *    runs its own pool through its own answer function at module load and derives
 *    the SET of values that page can ever key; no card outside that set is built.
 *
 *    The unit is the SLOT AND THE DIRECTION, not the form. The first build clipped
 *    the story cards to the union of both moves, arguing that the pack serves the
 *    form both ways so a numeral offered on a joining page is keyed by a parting
 *    page. Measuring the SERVED sets over 2,000 forms killed the argument: the
 *    certifying joining slot offered 1, 2, 3 and 10 while keying only 4 to 9, and
 *    the parting slot offered 1, 9 and 10 while keying 2 to 8 — and 10 and 11 were
 *    offered by no slot that could ever key them at all. Whatever is true of the
 *    form, a child answers a SLOT. The sets after the repair, all measured on what
 *    is served rather than on what was meant:
 *      · story, joining: keys and cards {4…9}. Story, parting: {2…8}.
 *      · bond: {1…9} on the daily instances and {2…8} on the certifying one, whose
 *        narrower draw is what guarantees a card exists on BOTH sides of the answer
 *        at every draw so the rank can rotate.
 *      · teen, joining: {12…19}. Teen, parting: {11…17}.
 *      · puppet: {12…19} on the reversal branch, {1…6} on the count-back branch and
 *        {1…8} on the swap branch.
 *      · nothing keys or offers zero anywhere: every pool leaves at least one
 *        thing on the mat, and no group is ever drawn empty.
 *    Measured over 2,000 mastery forms after the repair: NO numeral is offered at
 *    any slot that slot cannot key. The computed gate also caught two things a
 *    declared interval would not have: the bond page's numeral 5, unreachable on
 *    the certifying instance because that instance draws its group from 2 to 8 and
 *    10 − 5 = 5 is the group's own count, and the reversal branch's 31, which is
 *    not a teen and so is said in the prompt without ever being a tap target.
 *
 * 9. **THE MASTERY FORM IS THE EXIT CHECK AND IT IS DEALT, NOT DRAWN.** Six slots,
 *    and the list is the level rather than the week: a joining story, a parting
 *    story, the three-way move choice, a bond to ten reached from a counted group,
 *    a teen met by a move, and the puppet. Between them they certify counting,
 *    both operations, choosing between them, partners of ten, teen structure and
 *    error analysis - which is what "ready for Level B" has to mean.
 *
 *    L51's bar is that no blind strategy may certify. The habits are pinned to a
 *    fixed score on 100% of forms rather than in expectation, which is the whole
 *    of what a16 got wrong twice: slot 1 always keys a sum, slot 2 always keys a
 *    difference, slot 5 always keys a sum, slot 4 is inherently a difference, slot
 *    3 keys a word and slot 6 rotates. So a child who always joins whatever they
 *    counted takes 2 or 3 of six, a child who always parts takes 2 or 3 of six,
 *    and the pass mark is 5 of six (80% of 6). Neither can certify at any seed.
 *    Measured rates, including the teachability check, are in the report.
 *
 *    THE BRANCHED SLOTS ARE DEALT ONCE PER PACK, NOT PER FORM, and that is a
 *    schema fact rather than a preference: QG-4 compares Form A and Form B on
 *    `templateId` when both carry a generator, and slots 3 and 6 reach three
 *    different transforms. Dealing the branch per pack keeps the isomorph class
 *    intact while the operands stay fresh, which is what an isomorph IS.
 *
 * 10. **DAY 5 IS NOT A CROSSWORD, AND HERE IS EXACTLY WHAT IT IS INSTEAD.** The
 *    catalog's non-computational focus for this cell is a "math-vocabulary picture
 *    crossword with word bank". Three things make that unbuildable rather than
 *    merely hard, and none of them is a content problem:
 *      · there is no crossword primitive - `figures/types.ts` ships nine and every
 *        one of them is a quantity picture;
 *      · `Puzzle` carries no `choices` field, so a puzzle's answer is TYPED
 *        however it is worded, and a pre-reader cannot type a word (a21 recorded
 *        this and a19 recorded it independently);
 *      · no registered transform holds a DEFINITION, so a "which word means the
 *        part that is hiding?" page would have an authored truth, which the kit
 *        forbids outright.
 *    What ships instead, and it keeps both halves the two specs ask for:
 *      · **the word bank is real and it is keyed.** `nameTheMove` puts three of
 *        the level's math words on oversized cards - add, take away, the same -
 *        against a drawn story, and the child taps the one that tells what
 *        happened. Every card is keyed on some draw and every branch is pinned by
 *        a registered transform (disclosure 3). It runs on Days 2, 3 and 5 and in
 *        the mastery form, so the vocabulary is assessed rather than decorated.
 *      · **the recipe's Day-5 line ships word for word.** `myWayToTen` asks for a
 *        favourite way to make ten, out loud, off the screen: ten real things
 *        fetched from the house, split however the child likes, both parts named.
 *        There is no key, so it carries none — a transform returning somebody's
 *        favourite would be an invented answer to an open question. It doubles as
 *        the week's justification demand and is the one page with no picture,
 *        which only Friday permits.
 *      · **the puzzle does the making.** It hands over a started mat, asks for it
 *        to be built up to ten, and asks for a second way in the same breath. The
 *        countable half comes out of the drawing; the second way is asked aloud
 *        rather than pushed into the key.
 *    **Recorded for the orchestrator:** cards on `Puzzle` are the missing piece for
 *    a band that cannot read — a19 and a21 have each asked, and it is a schema
 *    limit rather than an authoring one. Building the crossword itself would need a
 *    word-grid primitive AND a transform that holds glosses; neither exists, and
 *    nothing here pretends otherwise.
 *
 * 11. **SHARED-LIBRARY FINDINGS FROM WIRING THE SIX WARM-UPS.** Measured, and
 *    reported rather than fixed - a week file may not edit `lib/`:
 *      · **`howManyChoice` is not used here and the reason is measured.** At any
 *        `{min, max}` it can offer `min − 2`, `min − 1`, `max + 1` and `max + 2`
 *        while keying only `min…max`, so four numerals are permanently unkeyable
 *        at that slot. a08, a19 and a21 each measured it. `setForNumeral` is used
 *        instead: its cards are the drawn groups themselves and its target index
 *        is drawn uniformly, so every card is keyed on other draws.
 *      · **`patternNext` deals TWO cards**, so a coin scores half of it. It is
 *        used as a warm-up and certifies nothing, and it is the only two-card page
 *        in the week. `numeralTrap`, `solidChoice` and both `compareMeasure`
 *        variants share the limit and are not used at all.
 *      · **`partnersHiding` and `countByTens` both validate `exact-numeric`**,
 *        which at band A means a numeric pad. On a warm-up that is the family's
 *        own shape and every A week has served it; on a certifying slot it would
 *        be the L53 defect, and no certifying slot here is anything but
 *        `choice-key` over authored cards.
 *
 * 12. **WHAT READING THE GENERATED WEEK FOUND.** Ten things, and no gate sees any
 *    of them.
 *      · **The verb did not agree with the count it was driven by.** On roughly a
 *        quarter of story pages the mover was a single thing and the sentence read
 *        "Then 1 apple go from the mat" — read ALOUD to a pre-reader who cannot see
 *        it to forgive it. `format.ts` guarantees number-and-noun agreement and has
 *        no verb; `verbFor` is the same guarantee one word further along.
 *      · **Two consecutive certifying pages showed the identical picture.** Mastery
 *        slots 05 and 06 both drew a frame holding fourteen, and `drawUniqueItem`
 *        could not see it because it signs on the PROMPT's numerals — "4, 3" and
 *        "4, 41", two different questions about one drawing. The frame's own
 *        content is now registered in the pack's guard by a deterministic walk.
 *      · **One numeral did two jobs in two consecutive sentences.** The puppet's
 *        count-back page produced "Then 3 balls went in the box. Wix says 3 are
 *        left", and with a mover of one it produced a puppet who appeared to say
 *        nothing had left at all. Both coincidences are barred at the pool.
 *      · **Two ring pictures met on one day**, one asking what a rearranged pile
 *        comes to and one asking a bond — the same drawing under two entirely
 *        different questions. The ring now belongs to the word bank alone and the
 *        bond page spreads its group out.
 *      · The first build's two removal stories - the discrimination's and the
 *        puppet's - both read "went away", and "away" is half of a card in the
 *        word bank. `assertBankClean` now throws on it at module load; the shells
 *        go home.
 *      · The story page's two directions first read "brings" and "takes", which is
 *        two different verbs and therefore answers the page from the verb alone -
 *        a18's finding, arrived at again. They now "come to the mat" and "go from
 *        the mat", and only the preposition moves.
 *      · The bond page first asked "How many more?", which is true of any target
 *        and has no answer until one is named. It asks for ten by name now.
 *      · The teen page first said "counters" three times in three sentences,
 *        because the frame, the loose ones and the arrivals are all counters. The
 *        frame is now a frame and only the movers are counted.
 *      · The puppet's swap branch first drew the cross-outs, which made it the
 *        count-back branch's page with a different number on it. It draws the
 *        group as it stood, and the removal is now only in the words - which is
 *        also what makes the slip visible.
 *      · The `[image: …]` bracket on the rearrange branch first named the row the
 *        collection came FROM, while the picture drew the ring it went to - a
 *        scene direction describing a board that was not the board. It follows the
 *        drawing now, and the row lives in the question where the child hears it.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  countByTens,
  partnersHiding,
  patternNext,
  setForNumeral,
  shapeName,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsParam, counterGroups, counters, tenFrame } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Eight people, drawn fresh per page; nothing below hardcodes one (kit §F.3). */
const FOLK = ['Anwen', 'Ludvig', 'Marnie', 'Basim', 'Ivette', 'Ruben', 'Sunna', 'Teodor'] as const;

/** The mat every story in this week happens on, and the frame every teen sits in. */
const FRAME_CELLS = 10;

// ===========================================================================
// Ten words, and the unit is the SENTENCE
//
// Two different laws are in play and only one of them is enforced upstream. The
// family's `ask()` weighs a prompt whole, which is the wrong unit for a page that
// tells a story in three short sentences and no unit at all for a hint rung or a
// worked step. `bb-readability-test` is the law that binds, and it walks sentence
// by sentence over everything a child hears. `say()` is that walk, run at the
// moment a line is written, so an eleventh word is a build failure rather than a
// note somebody leaves in a review.
//
// The picture's spoken name is exempt on purpose. It is not a prompt; it is what
// stands in for the drawing for a child who cannot see it, and shortening it to
// meet a prompt's budget takes away the thing rather than the words. Its own rule
// is stricter and is set out below.
// ===========================================================================

const SENTENCE_CEILING = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > SENTENCE_CEILING) {
      throw new Error(
        `A24: a band-A sentence runs to ${String(n)} words (ceiling ${String(SENTENCE_CEILING)}): "${sentence}"`,
      );
    }
  }
  return text;
}

/** The stored prompt: a bracketed scene the guard reads, then the sentence a child hears. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Help rungs, measured. Nothing here names a child, a thing or a quantity. */
function rungs(...steps: string[]): string[] {
  return steps.map(say);
}

/**
 * The verb, agreeing with the count that drives it.
 *
 * Found by reading a generated pack: a drawn move of one printed "Then 1 apple go
 * from the mat" on every story page whose mover was a single thing — roughly a
 * quarter of them — and it is read ALOUD to a pre-reader who cannot see the
 * sentence to forgive it. `format.ts` owns number-and-noun agreement and has no
 * verb; this is the same guarantee one word further along, kept local because a
 * week file may not extend `lib/`. **Recorded for the orchestrator: `format.ts`
 * wants a `verbFor(count, singular, plural)` beside `unitFor`** — every level that
 * lets a quantity drive a clause needs it, and this is the second week to write
 * one by hand.
 */
function verbFor(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// ===========================================================================
// WHAT A PICTURE IS CALLED  (disclosure 6)
// ===========================================================================

/**
 * Everything a listener counts as a number, whether or not it is written as one.
 * "A pair of shoes" and "two shoes" arrive at a four-year-old's ear identically,
 * so the disguised forms are listed beside the plain ones.
 */
const HEARD_AS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
  once: 1, single: 1, twice: 2, double: 2, twin: 2, pair: 2, couple: 2, both: 2, dozen: 12,
  half: 2,
};

const HEARD_WORD = new RegExp(`\\b(${Object.keys(HEARD_AS).join('|')})\\b`, 'gi');

/** Every number a string SAYS OUT LOUD, digits and words alike. */
function heardNumbers(text: string): number[] {
  const out = (text.match(/\d+/g) ?? []).map(Number);
  for (const hit of text.matchAll(HEARD_WORD)) out.push(HEARD_AS[hit[1].toLowerCase()]);
  return out;
}

/**
 * The gate on picture names WRITTEN IN THIS FILE, and it refuses numbers outright.
 *
 * The contract's rule is narrower than that: an alt may not speak a number that
 * happens to be its own item's answer, which is what `spokenSafe` checks further
 * down. The absolute form is used here because of what this week's drawings are
 * FOR. Every one of them either holds the count a page asks for, or holds the
 * amount the page deliberately declines to state so that the child has to find it
 * by counting. Both are numbers a picture must not read out, so there is nothing
 * left for a number in an alt to be, and the cheap rule and the correct rule
 * coincide.
 */
function alt(text: string): string {
  if (/\d/.test(text)) {
    throw new Error(`A24 alt: a digit is played ahead of the question in "${text}"`);
  }
  const heard = heardNumbers(text);
  if (heard.length > 0) {
    throw new Error(`A24 alt: the number ${String(heard[0])} is played ahead of the question in "${text}"`);
  }
  return text;
}

/** Everything one particular draw would mark right, as numbers. */
function keySet(draft: ItemDraft): number[] {
  const keyed = draft.choices?.find((c) => c.isCorrect)?.text;
  const surfaces = [
    ...(keyed === undefined ? [draft.answer.value] : [keyed]),
    ...(draft.answer.acceptableForms ?? []),
  ];
  return surfaces.flatMap(heardNumbers);
}

/**
 * The same law, applied where a picture name REACHES A CHILD rather than where it
 * was typed — which is the only place it can be applied to six of this pack's
 * pages, because their strings are assembled in `lib/` and this file never sees
 * them.
 *
 * Here the absolute form would be actively wrong, and A22's warm-up is the case
 * that proves it. Its picture is called "some towers of ten blocks". A tokenizer
 * counts that "ten"; a child who cannot see the screen counts it as the ONE fact
 * that makes the page make sense, because a tower being a ten is the entire
 * content of counting by tens. That page keys twenty through fifty and can never
 * key ten, so nothing is disclosed and something important is carried. Strip it
 * and a blind child is handed a picture of nothing in particular.
 *
 * So: work out what this draw would accept, and object only when the picture's
 * name says one of those things. It raises rather than logs, which is the whole
 * difference between a rule the author intended and a rule the 200-seed sweep
 * enforces.
 */
function spokenSafe(base: ItemGen, who: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (draft.figure) {
      const keys = new Set(keySet(draft));
      const clash = heardNumbers(draft.figure.alt).find((v) => keys.has(v));
      if (clash !== undefined) {
        throw new Error(
          `A24 spokenSafe(${who}): the picture's name says ${String(clash)}, which is this draw's own answer: "${draft.figure.alt}"`,
        );
      }
    }
    return draft;
  };
}

/**
 * Help written for this week, bolted on from outside the family.
 *
 * Two reasons, one countable and one not. The countable one is a budget: three
 * servings of any ladder is a failure, so fourteen core pages cannot be planned
 * without first deciding how many kinds of help the week will own (kit §E, A-band
 * lesson 1). Seven is the floor; nine ship. The
 * other reason is that the help really is different here. "Count the mat before
 * you listen" belongs to a page that hides half its numbers; "fill the rest of
 * the ten" belongs to a bond; "the frame is already a whole ten" belongs to a
 * teen. Say any of those inside `lib/earlynumber` and all twenty-four A weeks say
 * it too.
 *
 * The wrapper swaps one field on a finished draft and touches no rng, so whatever
 * QG-1 and QG-4 signed for freshness is exactly what they still see.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * A page from an earlier week, opening a day here.
 *
 * Nothing about it is re-voiced, and that is the point rather than an oversight.
 * The value of a warm-up is that it comes back sounding like the week it came
 * from; polish it into this week's register and a child meets a new page wearing
 * an old number, which is not retrieval at all.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

const wrap = (name: string, gen: ItemGen, ladder: string[]): ItemGen =>
  withHints(spokenSafe(gen, name), rungs(...ladder));

// ===========================================================================
// Deals — decided once per PACK, never left to a per-page coin (L52)
// ===========================================================================

/**
 * One toss, remembered.
 *
 * Left to a coin per page, four pages come out the same way once in eight packs —
 * and a pack in which every story brings things is a pack that never once asked
 * the child to decide, which is the whole subject of the week. So the toss happens
 * at whichever page is built first and every later page READS it out of the guard.
 * Reading rather than spending is what makes it survive a rebuild: when
 * `drawUniqueItem` discards a draw, or the assembler rebuilds a page that echoed a
 * worked example, the page comes back with the side it already had instead of
 * quietly taking its neighbour's.
 */
function packCoin(r: Rng, guard: TupleGuard, token: string): 0 | 1 {
  if (guard.taken(`${token}=0`)) return 0;
  if (guard.taken(`${token}=1`)) return 1;
  const side: 0 | 1 = r.chance(0.5) ? 0 : 1;
  guard.add(`${token}=${String(side)}`);
  return side;
}

/**
 * One shuffle, stored, then read by position.
 *
 * The word bank runs three ways and the puppet three ways, and a pack that meets
 * only one of them has assessed a third of what it claims to. Shuffling once and
 * letting each page ask for its OWN position guarantees the whole set appears.
 * Position rather than turn order matters more than it looks: a counter that
 * advances on every call hands the next page a branch belonging to a draw that was
 * thrown away, and the discard is invisible from inside the generator. Asking by
 * position cannot go wrong that way, which is why the counter form is not used
 * here at all rather than used carefully.
 */
function packOrder<T extends string>(r: Rng, guard: TupleGuard, token: string, options: readonly T[]): T[] {
  if (!guard.taken(`${token}!`)) {
    guard.add(`${token}!`);
    r.shuffle([...options]).forEach((v, i) => guard.add(`${token}:${String(i)}=${v}`));
  }
  return options.map((_, i) => options.find((v) => guard.taken(`${token}:${String(i)}=${v}`)) ?? options[i]);
}

/**
 * NO TWO PAGES IN A PACK SHOW THE SAME FILLED FRAME.
 *
 * Found by reading a generated pack, and no gate can see it: mastery slots 05 and
 * 06 both drew a frame holding fourteen, so a child met the identical picture on
 * two consecutive certifying pages. `drawUniqueItem` could not catch it because it
 * signs on the PROMPT's numerals and those two prompts hold "4, 3" and "4, 41" —
 * two different questions about one drawing. So the frame's own content is
 * registered in the pack's shared guard instead of its prompt's.
 *
 * One rng value picks where to start looking and the search after that is plain
 * arithmetic, so the cost is fixed no matter how many frames are already taken —
 * a loop that redrew would have coupled every later page in the pack to this one
 * (kit §E2.4). It runs before `drawUniqueItem`, not inside it, so a discarded draw
 * cannot quietly consume a second frame out of a supply of eight.
 */
function freshFrame(r: Rng, guard: TupleGuard, pool: readonly number[]): number {
  const start = r.int(0, pool.length - 1);
  for (let k = 0; k < pool.length; k++) {
    const v = pool[(start + k) % pool.length];
    if (!guard.taken(`a24:frame|${String(v)}`)) {
      guard.add(`a24:frame|${String(v)}`);
      return v;
    }
  }
  return pool[start];
}

// ===========================================================================
// The numbers, held as a MOVE rather than as two loose counts
// ===========================================================================

/**
 * One pair, both stories. `a` is what the mat already holds and `b` is what the
 * story moves, so the same draw answers "how many now?" as `a + b` if the words
 * bring and as `a − b` if they take.
 *
 * The pool is shaped by three requirements and one bar. Both readings have to
 * finish inside ten, and the taking one has to leave something on the mat, which
 * gives `a + b ≤ 10` and `a − b ≥ 1`. The mover tops out at four because A15's
 * count-on went as far as three and a fifth step would be new content smuggled in
 * under an old heading.
 *
 * THE BAR IS `a ≠ 2b`, and it is aimed at the one shortcut this week's design
 * creates. Because the mat is drawn and only the mover is spoken, `b` is the sole
 * number a child hears — and whenever the mat holds exactly double it, `a − b`
 * IS `b`, so repeating what was just said out loud earns a tick on every taking
 * page. The page would then reward the opposite of what it teaches. Three pairs
 * are struck out for it; seventeen survive.
 */
interface Move {
  a: number;
  b: number;
}

const MOVES: readonly Move[] = (() => {
  const out: Move[] = [];
  for (let a = 2; a <= 9; a++) {
    for (let b = 1; b <= 4; b++) {
      if (a + b <= FRAME_CELLS && a - b >= 1 && a !== 2 * b) out.push({ a, b });
    }
  }
  return out;
})();

/** Which way a story runs. One word apart on the page, one operation apart underneath. */
type Way = 'join' | 'part';

const wayOf = (m: Move, way: Way): number => (way === 'join' ? m.a + m.b : m.a - m.b);

/**
 * Every value the story form can key, computed from the pool rather than declared
 * (disclosure 8). Both moves live in one form and the per-pack deal serves the
 * form both ways inside every pack, so this union is what a child actually meets.
 */
const STORY_KEYS: ReadonlySet<number> = new Set(
  MOVES.flatMap((m) => [wayOf(m, 'join'), wayOf(m, 'part')]),
);

/** The bond page: a drawn group, and how many more would fill a ten. */
const bondKey = (n: number): number => FRAME_CELLS - n;

/** The teen page: a full frame, some loose ones, and something that moves. */
interface Teen {
  o: number;
  b: number;
}

const TEEN_MOVES: Record<Way, readonly Teen[]> = {
  join: (() => {
    const out: Teen[] = [];
    for (let o = 1; o <= 8; o++) for (let b = 1; b <= 3; b++) if (o + b <= 9) out.push({ o, b });
    return out;
  })(),
  part: (() => {
    const out: Teen[] = [];
    for (let o = 2; o <= 8; o++) for (let b = 1; b <= 3; b++) if (o - b >= 1) out.push({ o, b });
    return out;
  })(),
};

const teenKey = (t: Teen, way: Way): number =>
  way === 'join' ? FRAME_CELLS + t.o + t.b : FRAME_CELLS + t.o - t.b;

const TEEN_KEYS: ReadonlySet<number> = new Set(
  (['join', 'part'] as const).flatMap((w) => TEEN_MOVES[w].map((t) => teenKey(t, w))),
);

/**
 * The two removal branches of the puppet page, each with its own pool and its own
 * key set.
 *
 * THE COUNT-BACK BRANCH BARS TWO COINCIDENCES, and reading a generated pack is
 * what found both. The puppet's number is `a − b + 1`, and:
 *  · when `b = 1` that number IS the group on the mat, so "Then 1 ball went in the
 *    box. Wix says 5 are left" over a mat of five reads as a puppet who says
 *    nothing left at all — a different slip from the one the page is about, and
 *    the child cannot tell which they are being asked to fix;
 *  · when `a = 2b − 1` it equals the amount that went in the box, so one numeral
 *    does two jobs in two consecutive sentences ("Then 3 balls went in the box.
 *    Wix says 3 are left").
 * Nine pairs go; eight remain, keying one to six. The swap branch needs neither
 * bar — `a + b` can equal neither `a` nor `b` — and keeps the whole pool.
 */
const COUNTBACK_MOVES: readonly Move[] = MOVES.filter((m) => m.b >= 2 && m.a !== 2 * m.b - 1);
const COUNTBACK_KEYS: ReadonlySet<number> = new Set(COUNTBACK_MOVES.map((m) => m.a - m.b));
const SWAP_MOVES: readonly Move[] = MOVES;
const SWAP_KEYS: ReadonlySet<number> = new Set(SWAP_MOVES.map((m) => m.a - m.b));

/** The reversal branch: a teen the transform will actually accept. */
const TEEN_NUMERALS: readonly number[] = [12, 13, 14, 15, 16, 17, 18, 19];
const TEEN_NUMERAL_KEYS: ReadonlySet<number> = new Set(TEEN_NUMERALS);

/**
 * Nothing below may ship if a pool has quietly emptied or a bar has stopped
 * biting. Checked before a single pack is built.
 */
(function checkPools(): void {
  if (MOVES.length !== 17) throw new Error(`A24: the story pool holds ${String(MOVES.length)} pairs, expected 17`);
  if (MOVES.some((m) => m.a === 2 * m.b)) throw new Error('A24: the echo bar has stopped biting');
  if (STORY_KEYS.has(0)) throw new Error('A24: the story form can key zero');
  for (const w of ['join', 'part'] as const) {
    if (TEEN_MOVES[w].length === 0) throw new Error(`A24: the teen pool has no ${w} pairs`);
  }
  // Cards are clipped per DIRECTION (disclosure 8); this checks the union anyway,
  // because a teen page that could key ten or twenty would have stopped being a
  // teen page and no per-direction check would notice.
  for (const k of TEEN_KEYS) {
    if (k < 11 || k > 19) throw new Error(`A24: a teen draw keys ${String(k)}, outside eleven to nineteen`);
  }
  for (let n = 1; n <= 9; n++) {
    if (bondKey(n) < 1 || bondKey(n) > 9) throw new Error(`A24: a bond of ${String(n)} keys outside one to nine`);
  }
  if (TEEN_NUMERALS.includes(11)) throw new Error('A24: eleven reads the same reversed and cannot be the puppet page');
})();

// ===========================================================================
// The card deal
// ===========================================================================

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Filter a list of honest wrong values down to the ones this slot is actually
 * capable of keying, keeping the first appearance of each and dropping the rest
 * (disclosure 8).
 */
function offerable(values: readonly number[], truth: number, keys: ReadonlySet<number>): number[] {
  const seen = new Set<number>([truth]);
  const out: number[] = [];
  for (const v of values) {
    if (!keys.has(v) || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/**
 * Pick the two wrong cards, choosing WHERE the right one will sit among them.
 *
 * L43 is an invariant, not a direction. Wherever the answer always sits, some
 * button-shaped rule pays: put both wrong cards above it and the smallest button
 * is always right, put both below and the biggest is, put one on each side and the
 * middle one is. Left alone, each page type falls into a different one of the
 * three — a total outruns nearly every miscount of it, what is left after a
 * removal undercuts nearly every miscount of that, and a bond to ten goes
 * whichever way the drawn group happens to send it.
 *
 * So the position is REQUESTED (0 lowest, 1 middle, 2 highest) and, when the
 * values available cannot build it, the nearest buildable position is used
 * instead. Nearest rather than next-in-cycle, because a cycle would funnel every
 * impossible request into whichever shape is always available and quietly
 * reproduce the bias it exists to remove.
 *
 * Nothing here loops on content, so a seed always spends the same draws (§E2.4).
 */
function dealCards(r: Rng, pool: readonly number[], truth: number, aim: number): number[] {
  const under = pool.filter((v) => v < truth);
  const over = pool.filter((v) => v > truth);
  const shapes = [
    () => (over.length >= 2 ? r.shuffle(over).slice(0, 2) : null),
    () => (under.length >= 1 && over.length >= 1 ? [r.pick(under), r.pick(over)] : null),
    () => (under.length >= 2 ? r.shuffle(under).slice(0, 2) : null),
  ];
  for (const rank of [0, 1, 2].sort((x, y) => Math.abs(x - aim) - Math.abs(y - aim))) {
    const got = shapes[rank]();
    if (got) return got;
  }
  throw new Error('A24 dealCards: no pairing of honest values exists for this draw');
}

// ===========================================================================
// What a child was doing when they tapped something else
//
// Each of these takes the CARD and the numbers behind it and works out what it
// means, instead of being told by the branch that built it. The difference shows
// up on the day somebody edits a branch: a rationale derived from the value cannot
// end up describing a card that is no longer there. Nothing here is read to a
// child, so the ten-word law does not apply.
// ===========================================================================

function whyNotTheStory(v: number, m: Move, way: Way): Card {
  const text = String(v);
  if (v === wayOf(m, way === 'join' ? 'part' : 'join')) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale:
        'The other move, done on the same two amounts. Choosing between them is the whole of what this week asks, and the sentence is the only place the choice is written down, so this is the card that shows a child who watched the picture and never listened.',
    };
  }
  if (v === m.a) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale:
        'The group counted off the picture and handed straight back. The counting was sound and the story was heard as a caption rather than as something happening, so nothing ever arrived or left.',
    };
  }
  if (v === m.b) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale:
        'The one number the page says out loud, echoed. It is the cheapest answer available on a page whose other amount has to be counted, which is why the pool bars every pair that would make it accidentally right.',
    };
  }
  if (Math.abs(v - wayOf(m, way)) === 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale:
        'Out by one. The counting had to leave the things on the mat and carry on over things that were only described, and at that join a child either misses one or gives one two numbers. It is where almost every counting error at this age lives.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale:
      'Adrift by more than one. The mat was counted again from the beginning after the story had been heard, and the second count went astray somewhere in the middle of it.',
  };
}

function whyNotTheBond(v: number, n: number): Card {
  const text = String(v);
  if (v === n) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale:
        'What is on the mat, given for what is missing from it. It is the number the child has just worked hardest for, and handing it over is what happens when the counting is finished before the question is heard.',
    };
  }
  if (Math.abs(v - n) === 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale:
        'The group itself miscounted by one, and then the partner taken from that. The bond is understood; the count underneath it wobbled, which is exactly what a page that hides the count exists to reveal.',
    };
  }
  return {
    text,
    errorTag: 'fact-recall',
    rationale:
      'A neighbour of the true partner. The pair for ten is nearly there and is being reached for rather than built, so it lands a step to one side.',
  };
}

function whyNotTheTeen(v: number, t: Teen, way: Way): Card {
  const text = String(v);
  if (v === FRAME_CELLS + t.o) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale:
        'The number the frame held before the story. Reading a full frame and its loose ones is real work and it is tempting to stop there, so this is the card for a child who did the naming and never did the move.',
    };
  }
  if (v === teenKey(t, way === 'join' ? 'part' : 'join')) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale:
        'The pile handled the opposite way. Nothing reaches the frame in either reading, so the two candidate answers land within a step or two of each other and only the sentence tells them apart.',
    };
  }
  if (v === FRAME_CELLS + t.b) {
    return {
      text,
      errorTag: 'representation-misread',
      rationale:
        'The ten with only the movers set beside it. The loose ones already in the frame were read as part of the ten rather than as the pile the story acts on.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale:
      'One out among the loose ones. Counting past ten is where a teen number is easiest to lose, because the frame stops helping the moment the counting leaves it.',
  };
}

// ===========================================================================
// Core generator 1 — the story on the mat  (A1/A2/A9 × A14-A18)
// ===========================================================================

/**
 * A group is DRAWN, one amount is SPOKEN, and the same question is asked whichever
 * way the story runs.
 *
 * This is the week's own form and it is the second claim in the header made
 * literal: the child has to count the mat, hold that number, and then do to it
 * what the sentence describes. The picture shows the mat BEFORE anything moves and
 * asserts only that count, so nothing on it says which move is coming; the two
 * stories share every word but one.
 *
 * `way` is either fixed (the two certifying slots) or read from a per-pack coin
 * (the three daily pages), so every pack serves the form both ways.
 */
function storyOnTheMat(opts: {
  way: Way | ((r: Rng, guard: TupleGuard) => Way);
  maxSum?: number;
  minDiff?: number;
}): ItemGen {
  const pool = MOVES.filter(
    (m) => m.a + m.b <= (opts.maxSum ?? FRAME_CELLS) && m.a - m.b >= (opts.minDiff ?? 1),
  );
  if (pool.length === 0) throw new Error('A24 storyOnTheMat: the pool is empty');
  // PER DIRECTION, NOT PER FORM. The first build clipped this slot's cards to the
  // union of both moves, on the argument that the pack serves the form both ways
  // — and measuring the SERVED sets killed the argument: the certifying joining
  // slot offered 1, 2, 3 and 10 while keying only 4 to 9, and the parting slot
  // offered 1, 9 and 10 while keying 2 to 8. Whatever is true of the form, those
  // are numerals a SLOT can never key, which is the L38 shape. Each direction now
  // derives its own key set from its own pool and no card leaves it.
  const keysFor: Record<Way, ReadonlySet<number>> = {
    join: new Set(pool.map((m) => wayOf(m, 'join'))),
    part: new Set(pool.map((m) => wayOf(m, 'part'))),
  };
  return (rng, guard, difficulty) => {
    const way = typeof opts.way === 'function' ? opts.way(rng, guard) : opts.way;
    return drawUniqueItem(rng, guard, (r) => {
      const m = r.pick(pool);
      const noun = r.pick(COUNTABLE_NOUNS);
      const who = r.pick(FOLK);
      const key = wayOf(m, way);
      const other = wayOf(m, way === 'join' ? 'part' : 'join');
      const candidates = offerable(
        r.shuffle([other, m.a, m.b, key - 1, key + 1, key - 2, key + 2]),
        key,
        keysFor[way],
      );
      const cards = dealCards(r, candidates, key, r.int(0, 2)).map((v) => whyNotTheStory(v, m, way));
      const { choices, correctKey } = makeChoices(r, String(key), cards);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(
          `${countNoun(m.a, noun)} on the mat`,
          `${who} has these ${noun}. Then ${countNoun(m.b, noun)} ${
            way === 'join'
              ? `${verbFor(m.b, 'comes', 'come')} to`
              : `${verbFor(m.b, 'goes', 'go')} from`
          } the mat. How many ${noun} are on the mat now?`,
        ),
        figure: counters(m.a, noun, {
          arrangement: 'in a row',
          alt: alt(`${noun} laid out on the mat, just as they were at the start`),
          asserts: assertsParam('a'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key), numberWords(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: m.a, b: m.b, op: way === 'join' ? '+' : '-', asks: 'now' },
          seed: r.uint(),
        },
        hintLadder: rungs('Count the mat first. Then listen again.', 'Hold that number. Now do what the words say.'),
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'story-on-the-mat' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Core generator 2 — the bond reached from a counted group  (A1/A2 × A12/A13)
// ===========================================================================

/**
 * A drawn group and one target: how many more would make ten?
 *
 * This is one of the two slots no arithmetic reflex can win (disclosure 4). The
 * page states exactly one number — the ten it is aiming for — so a child who takes
 * the numbers a page says and applies a fixed operation has nothing to operate on.
 * The other amount is on the mat and has to be counted, which is what turns A13's
 * partner into a capstone rather than a repeat.
 *
 * The certifying instance draws its group from two to eight rather than one to
 * nine, and that narrowing is what buys the rank rotation: with the key between
 * two and eight, an honest card exists on BOTH sides of it at every draw.
 */
function bondToTen(opts: { min: number; max: number }): ItemGen {
  const groups: number[] = [];
  for (let n = opts.min; n <= opts.max; n++) groups.push(n);
  const keys: ReadonlySet<number> = new Set(groups.map(bondKey));
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.pick(groups);
      const noun = r.pick(COUNTABLE_NOUNS);
      const who = r.pick(FOLK);
      const key = bondKey(n);
      const candidates = offerable(
        r.shuffle([n, key - 1, key + 1, n - 1, n + 1, key - 2, key + 2]),
        key,
        keys,
      );
      const cards = dealCards(r, candidates, key, r.int(0, 2)).map((v) => whyNotTheBond(v, n));
      const { choices, correctKey } = makeChoices(r, String(key), cards);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(
          `${countNoun(n, noun)} spread out on the mat`,
          `${who} wants ten ${noun}. How many more make ten?`,
        ),
        // Spread out rather than ringed, and that is a reading fix rather than a
        // preference: the word bank's rearrange branch owns the ring, and a pack
        // that drew both on one day put two ring pictures in front of a child who
        // was being asked two entirely different questions about them.
        figure: counters(n, noun, {
          arrangement: 'scattered',
          alt: alt(`${noun} spread out across the mat`),
          asserts: assertsParam('b'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key), numberWords(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: FRAME_CELLS, b: n, op: '-', asks: 'to-ten' },
          seed: r.uint(),
        },
        hintLadder: rungs('Count the ring. Then think of a full ten.', 'Fill the rest of the ten in your head.'),
        errorTags: ['task-comprehension', 'procedure-slip', 'fact-recall'],
        authorMeta: { stepCount: 1, cognitiveOp: 'bond-to-ten' },
      };
      return draft;
    });
}

// ===========================================================================
// Core generator 3 — a teen met by a move  (A23 × A14-A18)
// ===========================================================================

/**
 * A full frame with loose ones beside it, and something happens to the loose ones.
 *
 * The second slot no reflex can win, and the one that carries the catalog's
 * "count/write to 20": the whole ten is never spoken and never touched, the move
 * happens among the ones, and the child names the number the frame comes to. So
 * the arithmetic stays inside ten exactly as the catalog says while the answer
 * runs to twenty exactly as the catalog also says.
 */
function overTheTen(opts: { way: Way | ((r: Rng, guard: TupleGuard) => Way) }): ItemGen {
  return (rng, guard, difficulty) => {
    const way = typeof opts.way === 'function' ? opts.way(rng, guard) : opts.way;
    const pool = TEEN_MOVES[way];
    // Same per-direction discipline as the story page: joining keys 12 to 19 and
    // parting keys 11 to 17, so a card of 11 on a joining page — which the union
    // allowed and which measuring found — is refused.
    const keys: ReadonlySet<number> = new Set(pool.map((x) => teenKey(x, way)));
    const frames = [...new Set(pool.map((x) => FRAME_CELLS + x.o))].sort((x, y) => x - y);
    const filled = freshFrame(rng, guard, frames);
    const withThisFrame = pool.filter((x) => FRAME_CELLS + x.o === filled);
    return drawUniqueItem(rng, guard, (r) => {
      const t = r.pick(withThisFrame);
      const who = r.pick(FOLK);
      const key = teenKey(t, way);
      const candidates = offerable(
        r.shuffle([
          FRAME_CELLS + t.o,
          teenKey(t, way === 'join' ? 'part' : 'join'),
          FRAME_CELLS + t.b,
          key - 1,
          key + 1,
          key - 2,
          key + 2,
        ]),
        key,
        keys,
      );
      const cards = dealCards(r, candidates, key, r.int(0, 2)).map((v) => whyNotTheTeen(v, t, way));
      const { choices, correctKey } = makeChoices(r, String(key), cards);
      const draft: ItemDraft = {
        type: 'word-problem',
        // "some loose ones … the loose ones" ran twice in two sentences in the
        // first build, because the frame, the pile beside it and the movers are
        // all counters. The pile is named once and the movers are placed against
        // it instead, and the two directions now differ by their last word only.
        prompt: scenePrompt(
          `a full frame of 10 and ${countNoun(t.o, 'counters')} beside it`,
          `${who} has a full frame and a pile beside it. Then ${countNoun(t.b, 'counters')} ${
            way === 'join' ? verbFor(t.b, 'joins', 'join') : verbFor(t.b, 'leaves', 'leave')
          } the pile. What number is it now?`,
        ),
        figure: tenFrame(FRAME_CELLS + t.o, {
          frames: 2,
          alt: alt('a frame filled right up, with loose counters standing beside it'),
          asserts: assertsParam('a'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key), numberWords(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: FRAME_CELLS + t.o, b: t.b, op: way === 'join' ? '+' : '-', asks: 'teen' },
          seed: r.uint(),
        },
        hintLadder: rungs('The filled frame stays a whole ten.', 'Only the loose ones change. Count those.'),
        errorTags: ['task-comprehension', 'concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'over-the-ten' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Core generator 4 — the word bank, three bins wide  (disclosure 3)
// ===========================================================================

type Bin = 'join' | 'remove' | 'rearrange';

const BINS: readonly Bin[] = ['join', 'remove', 'rearrange'];

const WORD_FOR: Record<Bin, string> = {
  join: 'add',
  remove: 'take away',
  rearrange: 'the same',
};

/**
 * No card word may appear in its own page's question, in any of the three bins.
 *
 * "went away" and "add one more" both slipped into a first build, and either one
 * answers the page by being heard. Checked at module load against the fixed stems
 * and again on every draw against the assembled sentence, so a later edit fails
 * the sweep rather than shipping green.
 */
const BANK_WORDS = ['add', 'take', 'away', 'same'] as const;

function assertBankClean(question: string): string {
  for (const w of BANK_WORDS) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(question)) {
      throw new Error(`A24 word bank: the question says the card word "${w}": "${question}"`);
    }
  }
  return question;
}

(function checkBank(): void {
  const words = new Set(Object.values(WORD_FOR));
  if (words.size !== BINS.length) throw new Error('A24: two bins of the word bank carry the same word');
  for (const bin of BINS) {
    if (!WORD_FOR[bin]) throw new Error(`A24: the bin "${bin}" has no word`);
  }
})();

function otherWords(bin: Bin): Card[] {
  return BINS.filter((b) => b !== bin).map((b, i) => ({
    text: WORD_FOR[b],
    errorTag: (i === 0 ? 'concept-misconception' : 'task-comprehension') as ErrorTag,
    rationale:
      b === 'rearrange'
        ? 'Says the amount held still on a page where it did not. A collection that only moves keeps its number, and a collection that gains or loses one does not — telling those apart is the third bin this page exists to add.'
        : b === 'join'
          ? 'Names joining. It is the first move a child learns to trust, so it gets reached for wherever a page shows two amounts at once, whether or not anything actually arrived.'
          : 'Names parting. Anything ruled through, tipped out or shifted about can look like a loss, so even a page where the number never changed attracts it.',
  }));
}

/**
 * Three stories, three words, one bank — the recipe's "mixed +/− choice" grown
 * the third bin a16 and a18 both asked for.
 *
 * The picture DOES show the move here, and that is deliberate and the opposite of
 * what the story pages do: naming what a picture shows is the question, so the
 * drawing is the data rather than a signpost. The bin is dealt per pack across the
 * three daily pages, so every pack meets all three.
 */
function nameTheMove(opts: { bin: (r: Rng, guard: TupleGuard) => Bin }): ItemGen {
  return (rng, guard, difficulty) => {
    const bin = opts.bin(rng, guard);
    return drawUniqueItem(rng, guard, (r) => {
      const noun = r.pick(COUNTABLE_NOUNS);
      const { choices, correctKey } = makeChoices(r, WORD_FOR[bin], otherWords(bin));
      let scene: string;
      let story: string;
      let figure: ItemDraft['figure'];
      let generator: ItemDraft['generator'];
      let forms: string[];

      if (bin === 'join') {
        const m = r.pick(MOVES);
        scene = `${countNoun(m.a, noun)} and ${countNoun(m.b, noun)} pushed together`;
        story = `Some ${noun} were here. More ${noun} came.`;
        figure = counterGroups([{ count: m.a, noun }, { count: m.b, noun }], {
          relation: 'join',
          alt: alt(`a bunch of ${noun} with another bunch pushed up against it`),
        });
        generator = { templateId: 'a_join_or_take_v1', params: { a: m.a, b: m.b, isJoin: true }, seed: r.uint() };
        forms = ['add'];
      } else if (bin === 'remove') {
        const m = r.pick(MOVES);
        scene = `${countNoun(m.a, noun)} with ${String(m.b)} struck through`;
        // "went away" was the first build's verb and "away" is half of a card in
        // this very bank, so the page answered itself out loud. Everything that
        // leaves in this week goes in the box, on this page and on the puppet's.
        story = `Some ${noun} were here. Then ${countNoun(m.b, noun)} went in the box.`;
        figure = counterGroups([{ count: m.a, noun }], {
          relation: 'remove',
          crossedOut: m.b,
          alt: alt(`${noun} on the mat, with the ones that left ruled through`),
        });
        generator = { templateId: 'a_join_or_take_v1', params: { a: m.a, b: m.b, isJoin: false }, seed: r.uint() };
        forms = ['take away'];
      } else {
        const n = r.int(3, 8);
        scene = `${countNoun(n, noun)} in a ring`;
        story = `These ${noun} sat in a row. Now they sit in a ring.`;
        figure = counters(n, noun, {
          arrangement: 'in a ring',
          alt: alt(`${noun} moved round into a ring on the mat`),
          asserts: assertsParam('a'),
        });
        generator = {
          templateId: 'a_compare_sets_v1',
          params: { a: n, b: n, nounA: noun, nounB: noun, which: 'more' },
          seed: r.uint(),
        };
        forms = ['the same', 'they are the same'];
      }

      const question = assertBankClean(`${say(story)} ${say('Which word tells what happened?')}`);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: `[image: ${scene}] ${question}`,
        figure,
        choices,
        answer: { value: correctKey, acceptableForms: forms, validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator,
        hintLadder: rungs('Look at the picture. Then say the story back.', 'Did the pile grow, shrink or only move?'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        // Flagged on the SLOT rather than on this draw's bin, so the §6.3 gate
        // reaches the same verdict at every seed. It is true of every draw: three
        // words stand on every page and only the story separates them.
        authorMeta: { stepCount: 1, cognitiveOp: 'name-the-move', isDiscrimination: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Core generator 5 — help the puppet, whose slips are the level's  (disclosure 5)
// ===========================================================================

type Slip = 'reversed' | 'countback' | 'swap';

const SLIPS: readonly Slip[] = ['reversed', 'countback', 'swap'];

function helpThePuppet(opts: { slip: (r: Rng, guard: TupleGuard) => Slip }): ItemGen {
  return (rng, guard, difficulty) => {
    const slip = opts.slip(rng, guard);
    // Drawn before the item, like the teen page's, so a rebuild inside
    // `drawUniqueItem` cannot spend a second frame out of the pack's supply.
    const frame = slip === 'reversed' ? freshFrame(rng, guard, TEEN_NUMERALS) : 0;
    return drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const noun = r.pick(COUNTABLE_NOUNS);

      if (slip === 'reversed') {
        const n = frame;
        const shown = String(n).split('').reverse().join('');
        const candidates = offerable(
          r.shuffle([n - 1, n + 1, n - 2, n + 2]),
          n,
          TEEN_NUMERAL_KEYS,
        );
        const cards = dealCards(r, candidates, n, r.int(0, 2)).map((v) => ({
          text: String(v),
          errorTag: 'procedure-slip' as ErrorTag,
          rationale:
            'The whole ten read correctly and the loose ones counted a step out. The frame does the hard half for a child; what is beside it still has to be counted one by one.',
        }));
        const { choices, correctKey } = makeChoices(r, String(n), cards);
        const draft: ItemDraft = {
          type: 'error-analysis',
          prompt: scenePrompt(
            `a full frame of 10 and ${countNoun(n - FRAME_CELLS, 'counters')} beside it`,
            `${puppet} wrote ${shown} for this frame. Tap the number ${puppet} means.`,
          ),
          figure: tenFrame(n, {
            frames: 2,
            alt: alt('a frame filled right up, with loose counters standing beside it'),
            asserts: assertsParam('n'),
          }),
          choices,
          answer: { value: correctKey, acceptableForms: [String(n), numberWords(n)], validation: 'choice-key' },
          difficulty,
          strand: 'noncomputational',
          isRetrieval: false,
          generator: { templateId: 'a_verify_teen_write_v1', params: { n }, seed: r.uint() },
          hintLadder: rungs('Read the frame with the puppet. Ten first.', 'A teen says its ten before its loose ones.'),
          errorTags: ['representation-misread', 'procedure-slip'],
          authorMeta: { stepCount: 1, cognitiveOp: 'help-the-puppet', isErrorAnalysis: true },
        };
        return draft;
      }

      const keys = slip === 'countback' ? COUNTBACK_KEYS : SWAP_KEYS;
      const m = r.pick(slip === 'countback' ? COUNTBACK_MOVES : SWAP_MOVES);
      const key = m.a - m.b;
      const shownValue = slip === 'countback' ? key + 1 : m.a + m.b;
      const rest = offerable(r.shuffle([m.a, m.b, key - 1, key + 1, key + 2]), key, keys);
      // THE NUMBER THE PUPPET SAID IS A TAP TARGET WHEREVER THIS SLOT CAN KEY IT —
      // it is the card a teacher learns most from — and the second card is then
      // taken from a side chosen by a coin. Both halves are needed. The puppet's
      // number always exceeds the truth, so pairing it with something smaller every
      // time would park the answer in the middle seat on every page that had one.
      // When his number is out of range the page falls back to the ordinary deal
      // and the answer can sit at the top like anywhere else.
      const puppetCardIsKeyable = keys.has(shownValue) && shownValue !== key;
      const below = rest.filter((v) => v < key);
      const above = rest.filter((v) => v > key && v !== shownValue);
      const wantBelow = r.chance(0.5);
      const partner = wantBelow
        ? (below.length > 0 ? r.pick(below) : above.length > 0 ? r.pick(above) : null)
        : (above.length > 0 ? r.pick(above) : below.length > 0 ? r.pick(below) : null);
      const values =
        puppetCardIsKeyable && partner !== null
          ? [shownValue, partner]
          : dealCards(r, rest, key, r.int(0, 2));
      const cards = values.map((v) => {
        if (v === shownValue) {
          return {
            text: String(v),
            errorTag: (slip === 'countback' ? 'procedure-slip' : 'concept-misconception') as ErrorTag,
            rationale:
              slip === 'countback'
                ? "The puppet's own number, agreed with. Counting back that starts on the number you already have keeps one thing too many, and it is the commonest slip in the level because saying the start number feels like counting it."
                : "The puppet's number, taken at face value. Joining is the first move a child learns to trust, and two amounts in one sentence are enough to summon it even when the sentence plainly removes one from the other.",
          };
        }
        return whyNotTheStory(v, m, 'part');
      });
      const { choices, correctKey } = makeChoices(r, String(key), cards);
      const draft: ItemDraft = {
        type: 'error-analysis',
        // The two removal branches are told with DIFFERENT pictures on purpose: the
        // count-back branch draws the removal, so the slip is visible against the
        // struck-through things, while the swap branch draws only the mat as it
        // stood, so the puppet's total has nothing on the page to lean on. The
        // first build drew both the same way and they read as one page twice.
        prompt:
          slip === 'countback'
            ? scenePrompt(
                `${countNoun(m.a, noun)} with ${String(m.b)} struck through`,
                `Then ${countNoun(m.b, noun)} went in the box. ${puppet} says ${String(shownValue)} are left. Tap how many are really left.`,
              )
            : scenePrompt(
                `${countNoun(m.a, noun)} on the mat`,
                `Then ${countNoun(m.b, noun)} went in the box. ${puppet} says ${String(shownValue)} are left. Tap how many are really left.`,
              ),
        figure:
          slip === 'countback'
            ? counterGroups([{ count: m.a, noun }], {
                relation: 'remove',
                crossedOut: m.b,
                alt: alt(`${noun} on the mat, with the ones that left ruled through`),
                asserts: assertsParam('a'),
              })
            : counters(m.a, noun, {
                arrangement: 'in a row',
                alt: alt(`${noun} laid out on the mat, just as they were at the start`),
                asserts: assertsParam('a'),
              }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key), numberWords(key)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator:
          slip === 'countback'
            ? { templateId: 'a_verify_countback_slip_v1', params: { a: m.a, b: m.b }, seed: r.uint() }
            : {
                templateId: 'd_verify_binop_misconception_v1',
                params: { a: m.a, b: m.b, op: '-', wrongOp: '+', asks: 'swap' },
                seed: r.uint(),
              },
        hintLadder: rungs('Count the mat with the puppet, slowly.', 'Cover the ones that went. Count what stands.'),
        errorTags:
          slip === 'countback'
            ? ['procedure-slip', 'task-comprehension']
            : ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'help-the-puppet', isErrorAnalysis: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Core generator 6 — Friday: my favourite way to make ten  (oral R)
// ===========================================================================

/**
 * "My favourite way to make 10", which is the recipe's Day-5 line and is shipped
 * without alteration.
 *
 * Nothing here is keyed and nothing here pretends to be. There is no correct
 * favourite, so `manual-review` and no template: inventing a transform that
 * returned one would be exactly the fabricated-answer-for-an-open-task the kit
 * rules out. It is also the week's justification demand, and its lack of a picture
 * is legal only because it sits on Day 5.
 */
function myWayToTen(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      // "Fetch ten ducks" was in the first build, because the drawable-noun pool is
      // a DRAWING pool and Friday happens off the screen. What a child can actually
      // fetch is whatever is in the house, and saying so is also what makes the way
      // theirs rather than the page's.
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: say(
          r.chance(0.5)
            ? 'Fetch ten small things from the house. Split them your favourite way. Say both parts out loud.'
            : 'Find ten small things you like. Make two piles from them. Say what is in each pile.',
        ),
        answer: {
          value: 'ten real things split into two parts, with both parts named out loud',
          acceptableForms: [],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        hintLadder: rungs('Set them all out before you split them.', 'Say one part, then say the other part.'),
        errorTags: ['task-comprehension', 'fact-recall'],
        authorMeta: { stepCount: 1, cognitiveOp: 'tell-your-ten' },
      };
      return draft;
    });
}

// ===========================================================================
// The generator instances — ladders budgeted before the days were
//
// Nine ladders carry fourteen core pages, and none is served three times. Two
// ladders that differ only in a numeral count as ONE to the dedup, which is a
// non-issue here: not a rung below mentions a quantity, a child or a thing.
// ===========================================================================

/**
 * Four story pages across the week, and one per-pack coin deals TWO of each move.
 *
 * The split matters and it was measured rather than assumed. The first day plan
 * ran three story pages and three bond pages, and a child who counts the picture
 * and then subtracts whatever else is in play — this week's real "always
 * subtract" — was right on 52.7% of the week's carded pages, against 19.2% for
 * the joining twin. Most of that gap is honest (a bond to ten IS a subtraction,
 * and a story that removes IS answered by subtracting), but two of the three bond
 * pages were spending the week's practice on one direction. One bond page became
 * a fourth story page, and the four are now dealt two-and-two on every pack, so
 * the pages where a move must be CHOSEN split evenly at every seed.
 */
const dayWay = (slot: 0 | 1 | 2 | 3) => (r: Rng, guard: TupleGuard): Way => {
  const side = packCoin(r, guard, 'a24:story-way');
  const table: Way[][] = [
    ['join', 'part', 'join', 'part'],
    ['part', 'join', 'part', 'join'],
  ];
  return table[side][slot];
};

/** Days 2 and 4 run the teen form; the same trick, its own coin. */
const dayTeenWay = (slot: 0 | 1) => (r: Rng, guard: TupleGuard): Way => {
  const side = packCoin(r, guard, 'a24:teen-way');
  return (side === 0 ? (['join', 'part'] as const) : (['part', 'join'] as const))[slot];
};

/** Days 2, 3 and 5 run the word bank; a per-pack order gives every pack all three bins. */
const dayBin = (slot: 0 | 1 | 2) => (r: Rng, guard: TupleGuard): Bin =>
  packOrder(r, guard, 'a24:bins', BINS)[slot];

/** Days 3 and 5 run the puppet; two different slips from one per-pack order. */
const daySlip = (slot: 0 | 1) => (r: Rng, guard: TupleGuard): Slip =>
  packOrder(r, guard, 'a24:slips', SLIPS)[slot];

/**
 * The mastery form's branched slots are dealt once per PACK, not per form
 * (disclosure 9): QG-4 compares Form A and Form B on `templateId` when both carry
 * a generator, and these two slots reach three different transforms.
 */
const certBin = (r: Rng, guard: TupleGuard): Bin => packOrder(r, guard, 'a24:cert-bin', BINS)[0];
const certSlip = (r: Rng, guard: TupleGuard): Slip => packOrder(r, guard, 'a24:cert-slip', SLIPS)[0];

const storyA = wrap('storyA', storyOnTheMat({ way: dayWay(0) }), [
  'Count the mat first. Then listen again.',
  'Hold that number. Now do what the words say.',
]);
const storyB = wrap('storyB', storyOnTheMat({ way: dayWay(1) }), [
  'Nothing on the picture says which move.',
  'The sentence says it. Say the sentence back.',
]);
const storyC = wrap('storyC', storyOnTheMat({ way: dayWay(2) }), [
  'Count the mat first. Then listen again.',
  'Hold that number. Now do what the words say.',
]);
const storyD = wrap('storyD', storyOnTheMat({ way: dayWay(3) }), [
  'Nothing on the picture says which move.',
  'The sentence says it. Say the sentence back.',
]);

const bondA = wrap('bondA', bondToTen({ min: 1, max: 9 }), [
  'Count the ring. Then think of a full ten.',
  'Fill the rest of the ten in your head.',
]);
const bondB = wrap('bondB', bondToTen({ min: 1, max: 9 }), [
  'Which pair for ten starts with this ring?',
  'Build the ten. The missing part is your answer.',
]);

const teenA = wrap('teenA', overTheTen({ way: dayTeenWay(0) }), [
  'The filled frame stays a whole ten.',
  'Only the loose ones change. Count those.',
]);
const teenB = wrap('teenB', overTheTen({ way: dayTeenWay(1) }), [
  'The filled frame stays a whole ten.',
  'Only the loose ones change. Count those.',
]);

const bankA = wrap('bankA', nameTheMove({ bin: dayBin(0) }), [
  'Look at the picture. Then say the story back.',
  'Did the pile grow, shrink or only move?',
]);
const bankB = wrap('bankB', nameTheMove({ bin: dayBin(1) }), [
  'Count the picture twice, before and after.',
  'If the number held still, nothing was gained or lost.',
]);
const bankC = wrap('bankC', nameTheMove({ bin: dayBin(2) }), [
  'Look at the picture. Then say the story back.',
  'Did the pile grow, shrink or only move?',
]);

const puppetA = wrap('puppetA', helpThePuppet({ slip: daySlip(0) }), [
  'Help the puppet. Do the whole thing slowly.',
  'Do it once yourself before you choose.',
]);
const puppetB = wrap('puppetB', helpThePuppet({ slip: daySlip(1) }), [
  'Help the puppet. Do the whole thing slowly.',
  'Do it once yourself before you choose.',
]);

const tellTen = wrap('tellTen', myWayToTen(), [
  'Set them all out before you split them.',
  'Say one part, then say the other part.',
]);

// --- the certifying instances ----------------------------------------------
// Slot 1 always keys a sum and slot 2 always keys a difference, so both blind
// moves are pinned on 100% of forms rather than in expectation (disclosure 9).
// `maxSum: 9` and `minDiff: 2` are not decoration: they guarantee an honest card
// exists ABOVE a sum and BELOW a difference at every draw, so the truth's rank can
// rotate on the two slots where a fixed direction would otherwise fix it.
const certJoin = wrap('certJoin', storyOnTheMat({ way: 'join', maxSum: 9 }), [
  'Count the mat. Then listen to the whole story.',
  'Two amounts belong to the mat now.',
]);
const certPart = wrap('certPart', storyOnTheMat({ way: 'part', minDiff: 2 }), [
  'Count the mat. Then listen to the whole story.',
  'Some of what you counted is not there now.',
]);
const certBond = wrap('certBond', bondToTen({ min: 2, max: 8 }), [
  'Count the ring, then reach for a whole ten.',
  'The missing part of the ten is the answer.',
]);
const certTeen = wrap('certTeen', overTheTen({ way: 'join' }), [
  'A full frame is one whole ten, always.',
  'Count the loose ones on from ten.',
]);
const certBank = wrap('certBank', nameTheMove({ bin: certBin }), [
  'Say what the picture did, in your own words.',
  'Then find the word that means it.',
]);
const certPuppet = wrap('certPuppet', helpThePuppet({ slip: certSlip }), [
  'Do the puppet job yourself, right through.',
  'Only then look at what the puppet said.',
]);

// --- six warm-ups: six formats, six source weeks -----------------------------
// These go through `spokenSafe` as well. Their picture names are built inside the
// family, so the load-time guard never sees the strings; the draw-time one does
// (disclosure 6).
const warmMatchNumeral = spokenSafe(warmUp(setForNumeral({ min: 3, max: 9, groups: 3 }), 4), 'warmMatchNumeral');
const warmShape = spokenSafe(warmUp(shapeName({}), 7), 'warmShape');
const warmPattern = spokenSafe(warmUp(patternNext({ kind: 'AAB', length: 6 }), 11), 'warmPattern');
const warmHiding = spokenSafe(warmUp(partnersHiding({ total: 10 }), 13), 'warmHiding');
const warmTens = spokenSafe(warmUp(countByTens({ minTens: 2, maxTens: 5 }), 22), 'warmTens');
// Day 4, always. The family stamped A5's comparison page as a discrimination, and
// the gate that wants one in Days 2-3 does not care which week stamped it — so
// placing it early would let A24 tick its own box with A5's trap.
const warmCompare = spokenSafe(warmUp(compareSets({ which: 'fewer', min: 3, max: 8 }), 5), 'warmCompare');

// ===========================================================================
// The week
// ===========================================================================

export const buildA24 = makeWeekBuilder({
  level: 'A',
  week: 24,
  conceptId: 'ready-for-level-b',
  conceptName: 'Ready for Level B (consolidation)',
  strandTags: ['number-sense-counting', 'addition-subtraction'],
  prerequisiteWeeks: [
    { level: 'A', week: 13 },
    { level: 'A', week: 18 },
    { level: 'A', week: 23 },
  ],
  pedagogyContract: 'v2',
  // Band A spends the §6.1 multi-step row on the pictorial rule, so this selector
  // is inert here. It is declared because the kit asks every non-D blueprint to
  // name its family, and a capstone about choosing between joining and parting is
  // an operation concept whatever else it gathers up.
  conceptFamily: 'operation',
  conceptualAnchor: 'mixed stories',
  deepeningDelta:
    'Every earlier week of Level A announced its own move by announcing itself: A13 was the partners page, A15 the counting-on page, A17 the counting-back page, A22 the tens page, A23 the teen page. A child can be fluent in all twenty-three and never once have decided which of them a page wants. A24 takes the page title away — and then does the thing that makes this an integration rather than a mixture: on every core page ONE OF THE TWO AMOUNTS IS ONLY IN THE PICTURE AND THE OTHER IS ONLY IN THE WORDS. The child counts a drawn group, holds that number while a sentence is read, and then does to it whatever the sentence asked. Neither half is new; doing both with neither written down is. That is why two of the pages here cannot be answered by any arithmetic reflex at all — a bond to ten reached from a group nobody counted for you, and a teen number met by a move that touches only its loose ones — and it is why the discrimination now has three bins instead of two: a collection that is merely rearranged is honestly neither move, which no single-operation week had any way to say. Retrieval is raised from the level standard of 21.1% to the top of the band at 30.0% and drawn from six different weeks in six different formats, so what is revisited is the level rather than last week.',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. This is the exit week, so read each story ONCE and then wait - the whole design rests on your child counting the picture and then listening, and a second reading before they have counted quietly does the holding for them. Have ten small things within reach for Friday. Read every button out loud; the words on them are the ones this level taught. Mascot present.',
  },
  explanation: {
    hook: say(
      'Here are five shells. Now listen. Two more come. What do you do?',
    ),
    whyBeforeHow: say(
      'This week tells mixed stories. Nothing on the page says which move to make. Why? Because the picture only shows you what is there. The words say what happens to it. So you do two jobs, not one. Count what you can see. Then hold that number and listen. The moving part is never in the picture at all.',
    ),
    script: [
      {
        say: say('Look at the mat. Count the shells with me.'),
        visual: 'Shells laid out on the mat, before anything moves.',
        figure: counters(5, 'shells', {
          arrangement: 'in a row',
          alt: alt('shells laid out on the mat, just as they were at the start'),
        }),
      },
      {
        say: say('Five. Hold five in your head. Now listen. Two more come.'),
        visual: 'A second small group of shells arriving beside the first.',
        figure: counterGroups([{ count: 5, noun: 'shells' }, { count: 2, noun: 'shells' }], {
          relation: 'join',
          alt: alt('a bunch of shells with another bunch pushed up against it'),
        }),
      },
      {
        say: say('Five, then six, seven. Seven shells on the mat.'),
        visual: 'The joined pile of shells, counted on from the first group.',
        figure: counters(7, 'shells', {
          arrangement: 'in a row',
          alt: alt('every shell together on the mat after the story'),
        }),
      },
      {
        say: say('Now a new mat. Count these. Then two go away.'),
        visual: 'A group of shells with the two that leave ruled through.',
        figure: counterGroups([{ count: 6, noun: 'shells' }], {
          relation: 'remove',
          crossedOut: 2,
          alt: alt('shells on the mat, with the ones that left ruled through'),
        }),
      },
      {
        say: say('Same picture, different words. The words pick the move.'),
        visual: 'The two mats side by side, one grown and one shrunk.',
      },
      {
        say: say('One more. These only moved. The number held still.'),
        visual: 'A ring of shells that a moment ago was a row.',
        figure: counters(6, 'shells', {
          arrangement: 'in a ring',
          alt: alt('shells moved round into a ring on the mat'),
        }),
      },
    ],
    summary: say(
      'Count the picture. Hold the number. Listen for the move. Some stories only move things.',
    ),
    vocabulary: [
      { term: 'add', kidGloss: 'more come, so the pile grows' },
      { term: 'take away', kidGloss: 'some go, so the pile gets smaller' },
      { term: 'the same', kidGloss: 'things moved, but the number held still' },
      { term: 'partner', kidGloss: 'the part that finishes a ten' },
      { term: 'a whole ten', kidGloss: 'a frame that has run out of room' },
      { term: 'teen number', kidGloss: 'a full frame, and the extras that would not fit' },
    ],
  },
  guidedExamples: [
    {
      ...ge(24, 1, 'modeled', scenePrompt('4 shells on the mat', 'Then 3 shells come to the mat. How many shells now?'), [
        {
          teacherSay: say('Watch me. I count the mat before I listen.'),
          expected: '4',
        },
        { teacherSay: say('I hold four. Now the words. Three more come.'), expected: 'three more' },
        { childDo: say('Count on with me from four.'), expected: '7' },
      ], '7'),
      visual: 'Four shells on the mat, counted before the story is read.',
      // The worked examples pin nothing, and the reason is in the audit rather
      // than in the pedagogy. QG-13 checks a guided example's picture against its
      // ANSWER, since that is the only target a guided example has, and a counters
      // figure claims everything it draws. Here the drawing is the mat BEFORE the
      // story and the answer is the mat after it, so a pin would ask the gate to
      // reconcile two numbers that are supposed to differ.
      figure: counters(4, 'shells', {
        arrangement: 'in a row',
        alt: alt('shells laid out on the mat, just as they were at the start'),
      }),
    },
    {
      ...ge(24, 2, 'completion', scenePrompt('8 leaves on the mat', 'Then 3 leaves go from the mat. How many leaves now?'), [
        { teacherSay: say('Same kind of picture. Different words. What changes?') },
        { childDo: say('Count the mat first. Say the number out loud.'), expected: '8' },
        { childDo: say('Now take off the three that went.'), expected: '5' },
      ], '5'),
      visual: 'Eight leaves on the mat, before three of them go home.',
      figure: counters(8, 'leaves', {
        arrangement: 'in a row',
        alt: alt('leaves laid out on the mat, just as they were at the start'),
      }),
    },
    {
      ...ge(24, 3, 'prompted', scenePrompt('6 buttons spread out on the mat', 'How many more make ten?'), [
        { childDo: say('Count them, then build up to a ten.'), expected: '4' },
      ], '4'),
      visual: 'Six buttons spread on the mat, short of a full ten.',
      figure: counters(6, 'buttons', {
        arrangement: 'scattered',
        alt: alt('buttons spread out across the mat'),
      }),
    },
    {
      ...ge(24, 4, 'independent', scenePrompt('a full frame of 10 and 4 counters beside it', 'Then 2 counters join the pile. What number now?'), [
        { childDo: say('Read the frame. Then change the pile.'), expected: '16' },
      ], '16'),
      visual: 'A filled frame with loose counters standing beside it.',
      figure: tenFrame(14, {
        frames: 2,
        alt: alt('a frame filled right up, with loose counters standing beside it'),
      }),
    },
  ],
  days: [
    // Day 1 — concept echo, and the echo is the LEVEL. Two backward pages open
    // the exit week, then the two forms that hide half of themselves.
    [
      { gen: warmShape, diff: 2 },
      { gen: warmPattern, diff: 2 },
      { gen: storyA, diff: 2 },
      { gen: bondA, diff: 2 },
    ],
    // Day 2 — the word bank arrives with three bins, and the teen form joins it.
    [
      { gen: warmHiding, diff: 2 },
      { gen: bankA, diff: 3 },
      { gen: storyB, diff: 3 },
      { gen: teenA, diff: 3 },
    ],
    // Day 3 — the bank again, a second bond, and the puppet's first slip.
    [
      { gen: warmTens, diff: 2 },
      { gen: bankB, diff: 3 },
      { gen: bondB, diff: 3 },
      { gen: puppetA, diff: 3 },
    ],
    // Day 4 — word problems: three stories that hide half of themselves, dealt so
    // the two directions land two-and-two across the week, and the conservation
    // warm-up parked here rather than in the gate's window.
    [
      { gen: warmCompare, diff: 2 },
      { gen: storyC, diff: 3 },
      { gen: teenB, diff: 3 },
      { gen: storyD, diff: 3 },
    ],
    // Day 5 — the word bank as the vocabulary page, the puppet's second slip, and
    // out of the chair with ten real things.
    [
      { gen: warmMatchNumeral, diff: 2 },
      { gen: bankC, diff: 3 },
      { gen: puppetB, diff: 3 },
      { gen: tellTen, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // Day 5 only. `validator.ts` S-SCHEMA rejects a strip on Days 1-4 and
    // `PuzzleGrove.tsx` renders Day 5's, hardcoded. Settled 2026-08-10; no week
    // discloses it any more.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this is the last week of the level, and it is built differently from the twenty-three before it. Nothing here is new mathematics. What is new is that the page has stopped telling your child what kind of page it is. Every earlier week said so in its title - the partners week, the counting-back week, the teen week - and a child can be very good at all of them without ever having chosen. So the stories here are mixed, and one thing more: on nearly every page, one of the two amounts is only in the picture and the other is only in the words. Your child has to count what they can see, keep that number in their head while you read, and only then do what the sentence asked. That is the single hardest thing in this level and it is the right thing to be hard about, because Level B assumes it. Two moments will look like slips and neither is. First, they answer with the number you just said out loud - "three" when the mat held six and three more came. That is not carelessness; holding a counted number while listening is genuinely new, and the fix is to let them count again with a finger parked on the mat. Second, they insist that shells tipped from a row into a ring are fewer, because the ring looks smaller. That is the oldest idea in this level and it is worth meeting one last time: push them back into a row and count again, and let the counting win the argument. Friday needs ten small things in a bowl - pasta, buttons, socks, anything - and the question is theirs to answer however they like. There is no favourite way to make ten that is better than another, and saying both parts out loud is the whole of the task.',
  ],
  /**
   * Friday's production task, where the making IS the arithmetic.
   *
   * The catalog asks for a vocabulary crossword and nothing downstream can draw
   * one (disclosure 10), so the word bank lives on the day pages where it can be
   * keyed and the puzzle takes the other half of Friday: make ten, twice, from a
   * start somebody else chose. The number is code-derived from the picture the
   * child is looking at; the second way is asked in the prompt rather than faked
   * into the key.
   *
   * A puzzle's answer is typed, whatever the wording promises, because the schema
   * gives `Puzzle` no cards. The prompt is written to that fact rather than around
   * it: it asks for something a grown-up can write down, and the second way is
   * asked for out loud where nothing has to be typed at all.
   */
  puzzle: (r) => {
    const start = r.int(2, 8);
    const noun = r.pick(COUNTABLE_NOUNS);
    return {
      id: 'A24-PZ-01',
      title: 'Puzzle Grove: Two Ways to Make Ten',
      puzzleType: 'construction',
      prompt: [
        `[image: ${countNoun(start, noun)} on the mat]`,
        say(`Here are your ${noun}.`),
        say('Put more on until the mat holds ten.'),
        say('How many did you put on?'),
        say('Now clear the mat and make ten another way.'),
      ].join(' '),
      figure: counters(start, noun, {
        arrangement: 'in a row',
        // NO ASSERTION: the picture shows the START and the answer is what is
        // still missing, so an assertion would set QG-13 comparing an honest
        // drawing against a number it was never meant to show.
        alt: alt(`${noun} laid out on the mat, ready to be built up`),
      }),
      answer: {
        value: String(bondKey(start)),
        acceptableForms: [String(bondKey(start)), numberWords(bondKey(start))],
        validation: 'exact-numeric',
      },
      hintLadder: rungs(
        'Count what is on the mat before you add any.',
        'Fill the mat up to a whole ten. Count only what you put on.',
      ),
      errorTags: ['task-comprehension', 'fact-recall'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'build-to-ten' },
  sprint: null,
  mastery: [
    // Six slots, and the list is the LEVEL rather than the week. 01 and 02 are the
    // story form both ways, dealt so one always keys a sum and the other always a
    // difference; 03 is the three-way move choice; 04 is a bond to ten reached from
    // a group nobody counted for you; 05 is a teen met by a move; 06 is the puppet,
    // whose slip is one of the level's three. Between them they certify counting,
    // both operations, choosing between them, partners of ten, teen structure and
    // error analysis — which is what "ready for Level B" has to mean.
    { gen: certJoin, diff: 3 },
    { gen: certPart, diff: 3 },
    { gen: certBank, diff: 3 },
    { gen: certBond, diff: 3 },
    { gen: certTeen, diff: 4 },
    { gen: certPuppet, diff: 4 },
  ],
  isomorphNotes:
    'Form B answers Form A slot for slot - the same generator at the same difficulty in each place, with its numbers drawn off a separate stream - and every slot is a tap on cards written into this file, so no certifying page is left as a bare numeral for the display layer to invent buttons around. Measured over 2000 forms: the truth takes the lowest, middle and highest seat on offer at rates between 20% and 44% on every numeric slot, no card is ever offered at a slot that slot cannot key, and the correct rule answers all six. 01 and 02 are the same story form run both ways: a group drawn on the mat, one amount spoken, and the same closing question whichever way the story goes, so nothing but the sentence says which move to make. Which way each of the two runs is FIXED rather than drawn - 01 always keys a sum and 02 always keys a difference - because a form that left it to a coin would let a child who only ever joins, or only ever parts, score whatever four fair coins happened to give them; pinned, each of those two habits takes a fixed and non-certifying share of every form at every seed. 01 draws its sum below ten and 02 its difference above one, which is not decoration either: it guarantees an honest card exists above the sum and below the difference at every draw, so the truth takes the low, middle and high seat in turn on the two slots a fixed direction would otherwise pin. 03 is the word bank and the discrimination at once - three of the level words on the cards, a drawn story on the page, and three bins rather than the two an addition week can build, because a collection that is only tipped from a row into a ring is honestly neither move. 04 asks the partner of ten for a group nobody counted for the child, and 05 asks what a full frame and its loose ones come to after something happens to the loose ones; both state exactly ONE number, so no fixed arithmetic reflex has a pair to work on. 06 is the puppet, rotating over a reversed teen numeral, a count-back that starts on the wrong number and a removal answered by adding, each pinned by its own registered transform. Every numeral offered anywhere in the form is one THAT SLOT keys, not merely one the form keys somewhere - each direction of each page type derives its own key set from its own pool at module load, so the joining story offers only four to nine, the parting story two to eight, the bond page two to eight, the joining teen page twelve to nineteen, and the puppet whichever range its branch reaches. Nothing can be struck out unread. WHICH BRANCH slots 03 and 06 take is dealt once per pack rather than once per form, and that is a schema fact rather than a preference: those two slots reach three different registered transforms, and QG-4 compares Form A against Form B on templateId whenever both carry a generator, so a per-form deal would break the isomorph class on the very slots that most need one. What is NOT separately enforced, rather than claimed away: the pack-wide surface guard keeps operand tuples apart across the whole pack and the assembler rebuilds any Form-B page whose template and params match its twin, but the noun a page is dressed in is not signed, so the same two counts may appear once in shells and once in leaves across the pack.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'the-move-taken-from-the-picture-not-the-words',
      description:
        'Reads the operation off the drawing instead of the sentence, so a mat that plainly holds two piles is added whatever the story said, and anything struck through is taken away whatever the story said. For twenty-three weeks the picture was a reliable signpost, because each week only ever drew its own move. This is the week that stops it being one, and the misconception is really a habit that used to be correct.',
      exampleWrongAnswer: 'a mat of six with two going home, answered as eight',
      distractorRationale:
        'Put the OTHER reading of the same two amounts on the page, on every story and on the puppet, clipped to the values that slot really keys so it can never be dismissed as impossible. No other card tells a teacher as much. What stops it turning into a free ride is the DEAL: one certifying slot always ends in a sum and one always ends in a difference, so a child who only ever joins and a child who only ever parts each collect a fixed share of every form and neither share reaches the pass mark.',
      reteachPointer: 'explanation/script[4] (same picture, different words - the words pick the move)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-with-the-number-that-was-said-aloud',
      description:
        'Gives back the one amount the page spoke, or the one it drew, without ever putting them together. Holding a counted number in mind while a sentence is read is the new demand of this week, and when it fails what comes back is whichever half of the page was met most recently.',
      exampleWrongAnswer: 'a mat of six with three more arriving, answered as three',
      distractorRationale:
        'Offer BOTH halves as cards - the drawn group and the spoken amount - so the shortcut is visible rather than merely possible. Then bar every pair in which the spoken amount is accidentally right: when the mat holds exactly twice what moves, the difference and the spoken number are the same, and the page would tick a child who never listened. Three pairs are removed from the pool for that reason and the bar is checked at module load.',
      reteachPointer: 'guidedExamples/A24-GE-01 (count the mat before you listen, then hold that number)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place-between-the-drawing-and-the-words',
      description:
        'Knows the move, chooses it correctly, and still returns a number one out - because the count had to cross from things that are drawn to things that are only described, and there is nothing to touch on the second half. A tall pile gives it more chances than a short one, and counting past ten gives it more again.',
      exampleWrongAnswer: 'a mat of seven with two more arriving, answered as eight',
      distractorRationale:
        'Offer a value a step over the truth and a value a step under it, since a place lost between the drawn half and the spoken half produces exactly those. Then decide WHERE the truth will stand among them before the numbers are drawn at all: the deal is asked for a position and takes the closest one those numbers can build. Measured over 2000 mastery forms, the right answer is the biggest button on offer between 22 and 44 per cent of the time depending on the slot, the smallest between 24 and 43, and neither between 30 and 37 - so no button-shaped rule pays. The cost is that the drawn amounts are no longer evenly spread, and that is the cheaper of the two: a position on the page is something a child can learn to play, and a number they have not worked out is not.',
      reteachPointer: 'explanation/script[2] (five, then six, seven - counting on from the group you already hold)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-a-teen-from-its-loose-ones-first',
      description:
        'Writes or taps a teen number the way it was met rather than the way it is written - the loose ones first and the ten behind them, which is 31 for thirteen. The spoken name is no help: "thirteen" says its ones before its ten, and this is the one place in the level where the language works against the notation.',
      exampleWrongAnswer: 'a frame holding thirteen, written as 31',
      distractorRationale:
        'Give it to the PUPPET rather than to a card. The reversal is not a teen at all, so it is a numeral the slot can never key and offering it would be a permanently dead option; it is said in the prompt, where the child has to notice it, and the tap targets are honest teen neighbours instead. The truth and the reversal are both recomputed by a registered transform, so neither half of the page is authored.',
      reteachPointer: 'explanation/vocabulary (a teen number is a whole ten with some loose ones beside it)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'reaches-for-the-partner-of-ten-instead-of-building-it',
      description:
        'Knows that a pair for ten is wanted and produces a neighbour of the right one, because the pair is being recalled rather than built. At this age that is progress rather than failure - it means the bond is becoming a fact - but it lands a step to one side until the frame has been filled enough times.',
      exampleWrongAnswer: 'a ring of six, answered with three more to make ten',
      distractorRationale:
        'Offer neighbours of the true partner, and separately offer the group itself, so a page can tell a child who is reaching for the fact from a child who has answered a different question. Every card is clipped to the values that slot actually keys, which is what removed the numeral five from the certifying bond page: that instance draws its ring from two to eight, and a ring of five would key its own count.',
      reteachPointer: 'guidedExamples/A24-GE-03 (count the ring, then build up to ten)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The last week of the level, and it gathers the whole of it. Nothing new was taught. What changed is that the page stopped saying what kind of page it was: the stories are mixed, so your child has to decide whether something arrived, went away, or only moved. And on nearly every page one of the two amounts was only in the picture while the other was only in the words - so they had to count what they could see, hold that number while the story was read, and only then act on it. That is the demand Level B assumes, and it is what this week checks.',
    improvingCandidates: [
      'counting a drawn group and holding the number while a story is read',
      'deciding which move a story wants when nothing on the page says',
      'finding the partner that finishes a ten from a group they counted themselves',
      'reading a full frame and its loose ones as one teen number',
      'spotting that a collection which only moves keeps its number',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'letting the words pick the move rather than the picture - we will keep reading the story once and waiting',
      },
      {
        errorTag: 'task-comprehension',
        text: 'putting the counted half and the spoken half together instead of handing one of them back',
      },
      {
        errorTag: 'fact-recall',
        text: 'building the pairs for ten on a frame until they come without counting',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the place when the counting leaves the picture - a finger parked on the last thing touched is the whole fix',
      },
      {
        errorTag: 'representation-misread',
        text: 'writing a teen number with its ten in front, even though its name says the ones first',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the mat first and held that number while I read the rest, and that is why the story could not trick you into the wrong move.',
      questionForChild: 'Six shells were in a row and now they are in a ring - are there still six?',
      schoolSyncHook: 'Tell us what their class is starting next term and we will point the Level-B warm-ups at it.',
    },
    vocabularyForParent: [
      'add (more arrive, so the pile grows - the word, not the symbol, is what matters at this age)',
      'take away (some leave, so the pile shrinks)',
      'the same (things moved and the number held still - the idea a spread-out row looks like more is the oldest one in this level)',
      'partner (the part that finishes a ten: six and four, seven and three)',
      'a whole ten (a frame that has run out of room - everything from eleven to nineteen is built on it)',
      'teen number (a full frame, and the extras that would not fit, which is why thirteen is ten and three)',
    ],
  },
});
