/**
 * Level A · Week 14 — "Meeting addition" (conceptId: meeting-addition).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber`. a05, a12 and a03 were
 * read for their ARCHITECTURE only — the per-pack deal, the rank rotation, the
 * authored-choices wrapper, the figure discipline, the way a substitution is
 * disclosed. Every sentence, scene, name, hint, gloss and distractor rationale
 * below was written for this week, and the token-overlap scan across `weeks/`
 * that backs that up is in the report.
 *
 * FILL-ARCHITECTURE §3 row A14: anchor "join stories acted out"; core form
 * "picture-join count-all"; perceptual discrimination "joining vs just-looking
 * scenes"; puppet error-analysis "counts only the new birds"; Day-5 "tell a join
 * story for 2+3 (oral R)". Catalog: computational focus "join stories with
 * objects/pictures within 5; + and = symbols", non-computational Day-5 focus
 * "addition story drawing: [set]+[set]=[draw the total]".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THE WEEK CLAIMS, AND HOW THE CONTENT FORCES IT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  - **Two numbers on a page are not an addition. A JOIN is.** This is the week
 *    a child MEETS adding, so the content is the SITUATION rather than the
 *    arithmetic: two groups become one group, and the total is found by counting
 *    all of them. Four of the week's nineteen daily pages and two of its six
 *    certifying slots therefore put the SAME picture under two different
 *    stories — one where a child hands their group over, one where nobody hands
 *    anything over — and ask the same question of both. Adding when nothing was
 *    joined is the mistake, and it is a live, keyed answer here rather than a
 *    warning in a teacher's note.
 *  - **The + is drawn, not written about.** `counterGroups(..., {relation:
 *    'join'})` renders a real plus sign between the two groups, so the symbol
 *    arrives the way the catalog asks — met, named and read aloud — on a page
 *    where it means something. The child never manipulates it: no page in this
 *    week asks for a missing addend, a rearranged sentence or a filled-in box.
 *    The `=` cannot be drawn by any primitive (disclosure 6), so it lives in the
 *    lesson script, the vocabulary, the guided examples and the Day-5 drawing
 *    task, where it is said aloud and pointed at.
 *  - **The puppet's slip is the subtle one.** After the joining he answers "how
 *    many arrived" instead of "how many now", so he says three when two were
 *    there and three flew in. He is never "wrong"; he "got mixed up".
 *  - **Nothing here is answerable off the sentence.** Every count lives in the
 *    drawing. Band A trades the multi-step quota for `pictorialPerDay: 1`; all
 *    fifteen non-retrieval items on Days 1–4 carry a figure built from their own
 *    drawn values, and the figure `alt` — which is spoken BEFORE the question at
 *    this band — names no quantity anywhere in the week.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Retrieval is 21.1%** (4 of 19 daily items), one warm-up on Days 1–4, from
 *    A12, A1, A6 and A3 in four different formats. A12 leads, because a child who
 *    knows 2 and 3 hide inside 5 is meeting that same fact from the other side.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCLOSURES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. **THE RECIPE'S PUPPET SLIP IS NOT DERIVABLE FROM THE VERIFY LIBRARY, and
 *    the proof is short enough to write down (L36, kit §E2.3).** Row A14's slip
 *    is "counts only the new birds": with `a` already there and `b` arriving,
 *    the truth is `a + b` and the slip's output is `b`, so `wrong − correct =
 *    −a`, which CHANGES WITH EVERY DRAW.
 *      · Every {correct, wrong} transform registered for this band returns a
 *        FIXED offset of one — `a_verify_count_slip_v1` gives `{n, n ± 1}` and
 *        `a_verify_countback_slip_v1` gives `{a − b, a − b + 1}` — so each
 *        matches the recipe only on the single cell where `a = 1`, and there the
 *        slip is indistinguishable from an ordinary miscount. Pinning it that way
 *        would mean drawing "one was already there" on every puppet page in the
 *        week, which is not the misconception, it is a coincidence.
 *      · `d_verify_binop_misconception_v1` varies the OPERATION over one operand
 *        pair, so producing `{a + b, b}` needs operands solving `x + y = a + b`
 *        and `x − y = b`, i.e. `x = (a + 2b)/2, y = a/2`. Non-integral for every
 *        odd `a`; and where `a` is even it is a pair with no referent in the
 *        story (a join of 4 and 1 would ship operands 3 and 2). That is §E2.12's
 *        fabrication-with-extra-steps.
 *      · `d_verify_binop_v1`'s multiplicative reading fares no better: `a − b =
 *        b` needs `a = 2b` and `a × b = b` needs `a = 1`, and inside a total of
 *        five the only cell either reaches is 2 + 1.
 *
 *    **Nothing is fabricated, because nothing needs to be.** The puppet's number
 *    is `b` — the count of the SECOND DRAWN GROUP, the one the picture puts to
 *    the right of the plus sign — so it is read off this page's own drawing by
 *    code, exactly as a20's puppet names whichever object the trio declares
 *    biggest and a05's names whichever row the figure spread. And the TRUTH, the
 *    only half a wrong key could corrupt, is recomputed by the registered
 *    `d_verify_binop_v1` from the same two counts the picture is built out of;
 *    QG-11 checks the keyed option against it at every seed. What is lost is the
 *    D8 half of the audit — the prompt is not checked for a recomputed
 *    misconception VALUE, because the library cannot compute one. What is gained
 *    is the recipe's own slip on the page instead of a borrowed one.
 *
 * 2. **EVERY PAGE WHOSE ANSWER IS A TOTAL REGISTERS `d_verify_binop_v1`, NOT THE
 *    FAMILY'S `a_join_v1`, AND THE REASON IS THAT `a_join_v1`'S AUDIT CANNOT RUN
 *    HERE.** `a_join_v1` registers an `answerFor`, and QG-5 re-derives an
 *    `answerFor` only for `exact-numeric` and four numeric siblings — never for
 *    `choice-key`. At band A a certifying page MUST be `choice-key` (a
 *    pre-reader cannot type, and a choice-less numeric item is handed to
 *    `tapOptionsFor`, which invents four buttons from a function that cannot know
 *    the slot's answer range — L53). So on every page this week could serve,
 *    `a_join_v1`'s pin is dead code. `d_verify_binop_v1` registers a `verifyFor`,
 *    which QG-11 runs on choice items, and with `{a, b, op: '+'}` it recomputes
 *    exactly `a + b` from the item's own two drawn counts. Same arithmetic, live
 *    audit. Reusing a registered transform for a structurally identical claim is
 *    the corpus's own convention (a12 ran a count-ON slip through the count-BACK
 *    template; a11 ran four questions through `a_numeral_for_set_v1`), and B4,
 *    B9 and B21 already pin choice items this way. **Recorded for the
 *    orchestrator: `earlynumber` should gain an `a_join_v1` verify twin**, so a
 *    band-A join page can carry a family-native id and a live pin at once.
 *
 * 3. **THE DISCRIMINATION IS THE WHOLE WEEK, SO IT IS A NUMBER AND NOT A
 *    VERDICT.** "Is this adding?" is a two-way page with a coin-flip floor, and
 *    it lets a child answer without ever finding out how many. So `joinOrLook`
 *    draws two children's groups side by side WITHOUT a plus sign, then draws one
 *    of two sentences over them — `Roque gives every shell to Yenna.` or
 *    `Nobody gives any shells away.` — and asks the SAME question either way:
 *    "How many shells does Yenna have now?" One verb changes; the picture does
 *    not. Three modes, three live keyed values:
 *      join, ask the receiver  → a + b
 *      nobody gives, ask the first child  → a
 *      nobody gives, ask the second child → b
 *    The mode is DEALT per pack rather than drawn per page (disclosure 4), so
 *    every pack serves exactly one join page and one no-join page in the dailies,
 *    and exactly one of each inside every mastery form.
 *
 *    WHAT THAT COSTS, MEASURED RATHER THAN ASSERTED. Two blind habits are exactly
 *    complementary on this page — "add the two numbers you can see" is right on
 *    the join draw and wrong on the other, and "count the group belonging to the
 *    child the question names" is the mirror — so each scores exactly one of the
 *    two discrimination pages in every mastery form, 50%, and neither can be
 *    pushed lower without removing one of the two situations the week exists to
 *    contrast. a12 measured the same complementary pair on its own listening
 *    discrimination and reached the same conclusion: balancing them is the only
 *    honest defence. The RANK is a different matter and it is flat — the total is
 *    the largest card, a part is the smallest or the middle one, and the three
 *    outcomes come out a third each (measured; the table is in the report).
 *
 * 4. **A BALANCED DRAW IS NOT A BALANCED PAGE (L52), so the discrimination's
 *    mode is dealt out of the pack's own guard.** Four fair coins land the same
 *    way on one pack in eight, and a pack whose four discrimination pages all
 *    join is a pack where "always add" scores four out of four. So the two DAILY
 *    pages take one mode each (which day joins is drawn per pack), and each
 *    MASTERY FORM takes one of each across its two slots (which slot joins is
 *    drawn per form, remembered against the form's own rng object so a rebuilt
 *    page gets the mode it already had rather than the other form's). Both
 *    functions are idempotent rather than consuming: `drawUniqueItem` rebuilds a
 *    page whose surface collides and `makeWeekBuilder` rebuilds one that echoes a
 *    guided example or repeats a Form-A core, and a schedule spent per CALL would
 *    hand the next page the wrong side (a12's corollary).
 *
 * 5. **THE VALUE 1 IS NEVER OFFERED ON A PAGE WHOSE ANSWER IS A TOTAL, and that
 *    is arithmetic rather than taste.** Joins within five run from 1 + 1 to
 *    2 + 3, so a total is 2, 3, 4 or 5 and can never be 1 — while "counted only
 *    one of the two groups" produces a 1 on seven of the ten cells. An option
 *    offered often and keyable never is the dead-option shape (L38/§E2.11): the
 *    child learns to strike it out and a three-card page becomes a coin flip. So
 *    the part-instead-of-whole card is drawn from whichever of the two groups
 *    holds more than one, and 1 reaches a card only on the single cell where both
 *    groups hold one, which is a sixth of draws. Note where the same value IS
 *    live: on `joinOrLook` a part is the ANSWER two draws in three, so 1 is keyed
 *    there and belongs on the page.
 *
 * 6. **THE EQUALS SIGN CANNOT BE DRAWN, AND NOTHING IN THIS FILE PRETENDS
 *    OTHERWISE.** `CountersFig` renders a plus between joined groups and a minus
 *    between removed ones, and no primitive in `lib/figures.ts` draws an equals
 *    sign, a numeral or an answer box — so the catalog's "[set] + [set] = [draw
 *    the total]" cannot be laid out as a picture. What the week does instead: the
 *    plus sign is drawn on every join page and NAMED on the `joinNumeral` pages;
 *    the equals sign is said aloud in the lesson script (which reads a whole
 *    sentence, "2 + 3 = 5"), glossed in the vocabulary, spoken in a guided
 *    example, and named in the Day-5 drawing task, where the child draws the
 *    total the sign asks for. **Recorded for the orchestrator: a number-sentence
 *    primitive — a drawn row of numerals and operators with one blank box — is
 *    what `lib/figures.ts` is missing for this cell**, and it would also unblock
 *    A15, A17 and A18, whose Day-5 signatures all name a number sentence.
 *
 * 7. **SEVEN LOCAL GENERATORS, AND WHY NONE OF THEM IS IN THE FAMILY.**
 *    `pictureJoin` is the family's join page and it is not served here: it
 *    validates as `exact-numeric` with no options, which at band A is four
 *    render-time buttons rather than an answer mode (disclosure 2), and its
 *    prompt and hint ladder are the ones every other join week would ship. So
 *    `joinCount` and `joinNumeral` are local, and they differ from each other the
 *    way `a_count_v1` differs from `a_numeral_for_set_v1` — count the things, or
 *    name the number the things make. `joinOrLook` is local because the family
 *    has no generator that puts two stories over one drawing (`joinOrTakeAway`
 *    contrasts a join with a REMOVAL, which this week has not taught, and it
 *    changes the picture to do it). `puppetJoin` is local because `PuppetSlip` is
 *    a closed union of 'double-count' | 'skip-count' | 'count-back-start' |
 *    'teen-writing' with no part-for-whole slip in it. `joinStory` is local
 *    because the family has no story generator at all. `tellJoinStory` and
 *    `drawTheWhole` are the Day-5 production pair and have no family form. None
 *    departs from how the family builds an item: each names a templateId the
 *    registry resolves, draws its picture through `lib/figures`, renders every
 *    quantity through `lib/format`, and stamps `authorMeta` for the preflight.
 *
 * 8. **THE DAY-5 ORAL HALF SHIPS OPEN, WITH NO ANSWER KEY, AND THE WEEK NEEDS
 *    IT.** §3's production stance is "the telling is oral (R-flagged), the making
 *    is computable", and §6.12's dual-strand gate wants one non-computational
 *    item demanding a justification. `tellJoinStory` therefore validates as
 *    `manual-review`: a child invents a story for a drawn join, and no key can
 *    exist for a story that has not been told. What IS pinned is the total the
 *    story must land on — the answer records the whole sentence and the figure
 *    asserts its total — so an adult holding the page knows what a correct story
 *    comes to. Attaching a template that "recomputes" the child's story is the
 *    precise move the kit rules out.
 *
 * 9. **THE PUZZLE CARRIES NO `asserts`, AND ITS ANSWER IS `manual-review` RATHER
 *    THAN `set`.** It draws a short row and asks the child to draw more until
 *    there are five, so the quantity the picture can compute (its own count, the
 *    part already there) is not the quantity the item asks for (the part still to
 *    come). Pointing the assertion at the count anyway would have QG-13 report a
 *    contradiction between a truthful picture and a correct answer, so it is left
 *    off rather than aimed somewhere it does not belong. The validation is
 *    `manual-review` because `'set'` sits in `needsTypedEntry` and a band-A item
 *    that reaches it falls through to a TEXT BOX — a12 reported that defect and
 *    it is still open, so this week does not walk into it. The truth is still
 *    code-computed and recorded in `answer.value` for the adult, exactly as
 *    `tenFrameBuild` does.
 *
 * 10. **WHAT MEASURING FOUND, AND IT WAS TWO REAL DEFECTS.** Both passed the
 *    200-seed validator run and both would have shipped.
 *      · **THE MASTERY DEAL COULD NOT EXPRESS ONE OF ITS OWN OUTCOMES.** The
 *        first version stored `chance ? slot : -slot` at whichever discrimination
 *        slot ran first — always slot 2, because a form is built in order — so
 *        slot 6 compared against a value that could never equal 6 and was dealt
 *        "no join" on every draw of every pack. Measured over 1,200 packs: half
 *        of all forms carried no join page at all, "count the group the question
 *        names" scored 66.8% instead of 50%, and the WHOLE became a card slot 6
 *        offered on 50.9% of its draws and keyed on none of them. Named slots and
 *        an explicit list fixed it; re-measured, every form now carries exactly
 *        one join page (1,500 of 1,500) and both habits sit on exactly 50.0%.
 *      · **THE PUPPET'S PAGE HAD A PERMANENTLY DEAD CARD.** Barring a single
 *        newcomer looked right — a slip of "counted only the one that came"
 *        prints a 1, and 1 is not a reachable total — but it also barred the join
 *        of one and one, and with it the only way for a TOTAL of two to occur. So
 *        the numeral 2 was offered on 61.4% of that slot's draws and could not be
 *        keyed on any of them: the exact L38 shape, in a certifying slot, created
 *        by a rule written to prevent it. Letting the one-and-one join back in
 *        makes 2 a keyed value; ordering the larger group into the arriving slot
 *        keeps 1 off the puppet's card except on that one pair (16.7% of draws,
 *        never keyed, well under the rate at which a card is learnable). Nothing
 *        is in `DECLARED_LURES`: this week declares no lure, because it has none.
 *      · A third, smaller thing: the puppet's third card was drawn on a fair coin
 *        and came out 65-68% "truth in the middle", because two of the six joins
 *        have nothing honest between the puppet's number and the whole. Choosing
 *        the low side on three draws in four of the joins that CAN put it at
 *        49.7/50.3. The truth can still never be the smallest card on that page —
 *        the puppet's number is a part and a part is always smaller — which is
 *        the same structural floor a01, a12 and a20 all reported.
 *
 * 11. **WHAT KIND OF THING A PAGE DRAWS IS SPREAD, NOT DRAWN FRESH EACH TIME.**
 *    The freshness guard signs an item on its NUMBERS, so two pages showing
 *    different counts of the same thing are perfectly fresh to it — and the first
 *    build duly put two leaf stories on one Day 4 and two shell pages next to
 *    each other on Day 5. Kinds are now claimed out of the pack's guard in rounds
 *    of nine, taken once per item outside the freshness loop, which took the rate
 *    of a day serving one kind twice from routine to 3 days in 2,000 (measured
 *    over 400 packs). It is also why there are FOUR story frames for three daily
 *    stories: with three, the mastery slot had to borrow one and a pack served
 *    the same container three times.
 *
 * 12. **WHAT ONLY READING THE GENERATED WEEK FOUND.** The first `joinStory`
 *    frames put the two groups on a tray, a sill and a bench, which are a05's
 *    three frames word for word — rewritten to a hoop, a raft and a wagon, none
 *    of which any A-band week uses. The first `joinCount` prompt was "How many
 *    ducks in all?", which is `pictureJoin`'s own sentence and would have shipped
 *    the family's question into a fourth week. And the first puppet page said
 *    "Nim says 3", which is a bare claim; "Nim got mixed up and says 3" is the
 *    band's own softening and keeps the word "wrong" off a page about being
 *    wrong. The Day-5 drawing task pointed at an equals sign that is nowhere on
 *    the page ("Equals means: this is what they make") and now describes what
 *    the two signs DO instead, which is true whatever is drawn. And the Day-2
 *    discrimination's second rung began "If nobody did…", which is half-dead on
 *    every draw where somebody did — a ladder cannot vary with the drawn mode
 *    (the dedup gate is seed-invariant only while a slot's help is fixed), so it
 *    now points at the decision rather than at one side of it.
 *
 *    Also from reading, and it is the one thing here that is not a defect: the
 *    joins of one and one read oddly in a story frame — "both groups of balls"
 *    is a lot of grammar for two balls — but they are drawn a sixth of the time,
 *    they are a real join within five, and dropping them costs the week the only
 *    total of two it can make.
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
  setForNumeral,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsAnswerOf, counterGroups, counters, mathSentence } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Eight names, drawn fresh per page. Nothing below hardcodes one (kit §F.3). */
const NAMES = ['Yenna', 'Roque', 'Salma', 'Kaito', 'Bruna', 'Mirek', 'Anouk', 'Ludo'] as const;

/** The whole a join may reach this week: the catalog says "within 5". */
const WHOLE = 5;

/**
 * Every join within five, as UNORDERED pairs — and drawing the pair first is
 * what keeps the week's freshness machinery from running dry.
 *
 * `drawUniqueItem` signs an item on its format class plus the SORTED numeric
 * tokens of its prompt, so a week whose whole number space is `a + b ≤ 5` has
 * exactly six surfaces per item type. Drawing `a` and `b` independently would
 * hand the six an uneven weight — {1,2} is reachable two ways and {1,1} only one
 * — and the rarest surface would then be the one a late page has to find. Drawing
 * the PAIR uniformly and then flipping a coin for the order makes every surface
 * equally likely, which drops the chance of a freshness redraw failing from about
 * one in five thousand packs to about one in two million.
 */
const PAIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 1], [1, 2], [1, 3], [1, 4], [2, 2], [2, 3],
];

interface Join {
  /** The group already there — drawn to the LEFT of the plus sign. */
  a: number;
  /** The group that arrives — drawn to the RIGHT of the plus sign. */
  b: number;
  noun: string;
}

/**
 * WHAT KIND OF THING A PAGE DRAWS IS TAKEN ONCE PER ITEM AND SPREAD ACROSS THE
 * PACK, because only reading a generated week showed why it has to be.
 *
 * `drawUniqueItem` signs an item on its NUMBERS, so two pages that print
 * different counts of the same thing are perfectly fresh to it — and the first
 * build duly served two leaf stories on one Day 4 and two shell pages side by
 * side on Day 5. A reader sees that immediately and no gate ever will (a03's
 * author found the same thing one week along and fixed it the same way).
 *
 * So a kind is claimed out of the pack's own guard in ROUNDS: every one of the
 * nine is used before any is used twice, then the next round opens. It is taken
 * OUTSIDE the freshness loop, once per item — a redraw changes the counts and
 * keeps the kind — so a rejected draft never permanently spends one of the nine,
 * which is the leak a05 measured when it tried to police freshness inside the
 * loop.
 */
function nextKind(rng: Rng, guard: TupleGuard, pool: readonly string[]): string {
  for (let round = 0; round < 8; round++) {
    for (let k = 0; k < 40; k++) {
      const kind = rng.pick(pool);
      const sig = `a14:kind${String(round)}|${kind}`;
      if (!guard.taken(sig)) {
        guard.add(sig);
        return kind;
      }
    }
  }
  return rng.pick(pool);
}

function drawCounts(r: Rng): { a: number; b: number } {
  const [x, y] = r.pick(PAIRS);
  const flip = r.chance(0.5);
  return { a: flip ? x : y, b: flip ? y : x };
}

/**
 * The puppet's own draw: the group that holds MORE THAN ONE is the one that
 * arrives, whenever there is such a group.
 *
 * This is an ordering rule, not a filter, and the difference was measured
 * (disclosure 10). The puppet's card is a PART and the key is a WHOLE, and inside
 * a total of five those two ranges barely overlap — so the ordering matters and
 * so does keeping every pair. Ordering the bigger group into the arriving slot
 * keeps the value 1 off the puppet's card except on the single pair where both
 * groups hold one, and keeping that pair is what makes a total of two reachable,
 * which is the only thing that stops the numeral 2 being a card this page can
 * never key.
 *
 * It also keeps the slip legible. "Counted only the new one" and "lost one where
 * the groups meet" print the same number when a single thing arrives, so on the
 * one-and-one pair the page is a weaker exhibit of the misconception than
 * elsewhere. That is a sixth of its draws and it is the price of the option
 * space; the other five sixths show the slip at its full size.
 */
function drawArrival(r: Rng, noun: string): Join {
  const [x, y] = r.pick(PAIRS);
  if ((x >= 2) === (y >= 2)) {
    const flip = r.chance(0.5);
    return { a: flip ? x : y, b: flip ? y : x, noun };
  }
  return x >= 2 ? { a: y, b: x, noun } : { a: x, b: y, noun };
}

// ---------------------------------------------------------------------------
// TEN WORDS, COUNTED THE WAY THE GATE COUNTS THEM
//
// Two ceilings exist and only one of them is the law. `earlynumber`'s `ask()`
// weighs a whole prompt string, so this week's three-sentence puppet page would
// trip a limit none of its sentences breaks; `bb-readability-test` weighs one
// SENTENCE at a time on every surface a child hears, and that is the measurement
// this file has to pass. Its splitter and its word counter are mirrored below
// and every authored string is pushed through them, so an eleventh word throws
// when the module loads or when the item is drawn — never at review time.
//
// Alt text does not come through here and must not. It is the whole of what a
// screen-reader child has instead of the picture, and shortening it means saying
// less about the drawing.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A14: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** The scene rides in a bracket; only the question after it is capped prose. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Rungs, each pushed through the ceiling. Nothing here names a child or a number. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Give a FAMILY generator this week's help, leaving `lib/` alone.
 *
 * A ladder may appear at most twice across the fifteen non-retrieval core items,
 * which puts a floor of eight distinct ladders under the week and makes the
 * ladder count a design input rather than an afterthought (kit §E, A-band lesson
 * 1); twenty-six distinct ladders are shipped, and the only ones that repeat are
 * the six mastery ladders, which repeat because Form A and Form B are the same
 * slot met twice. The arithmetic is only half of it — the help genuinely wants to
 * differ. A first meeting wants "move them together first"; a discrimination
 * wants "listen for who handed something over"; a puppet page wants "count the
 * ones that were waiting too". None of those could live in the shared family
 * without being said in all twenty-four Level-A weeks at once, which is the
 * sameness `bb-cross-week-test` reads the whole corpus to find.
 *
 * The closure rewrites one field of an already-built draft and draws nothing
 * itself, so the prompt QG-1 and QG-4 sign for freshness is untouched.
 *
 * THE LOCAL GENERATORS DO NOT USE IT, and that is deliberate rather than
 * inconsistent. Wrapping means the generator has to emit SOME ladder for the
 * wrapper to throw away, and every week that does it emits the same placeholder
 * sentence, which is a string that ships the day somebody forgets the wrapper.
 * A ladder this file owns is a required ARGUMENT instead, so the compiler
 * refuses a page with no help on it.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Bring an earlier week's own item back as today's warm-up.
 *
 * Band A sets no minimum on warm-up formats, so each of the four has to earn its
 * minute, and what decided them is what a join actually rests on. A12's hiding
 * game comes first and it is the load-bearing one: a child who knows that 2 and
 * 3 hide inside 5 is meeting this week's fact from the other side, and the whole
 * of A15 depends on the two being the same fact. Then counting a group without
 * losing your place (A1), which is what count-all IS; saying the next number
 * along (A6), which is what counting the second group on will become; and
 * putting a numeral on a set (A3), because a total that cannot be named is not
 * an answer.
 *
 * The ladders are re-voiced rather than inherited. a12 argued the other way — a
 * warm-up re-voiced no longer sounds like the week it brings back — and it is a
 * fair point; a05 and a03 both re-voiced theirs, and the deciding reason is that
 * the family's ladders are shared by all twenty-four A weeks, so leaving them is
 * the one collision `bb-cross-week-test` will find that this file could have
 * prevented.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
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
 * THE ALT NAMES THE PLUS SIGN AND NEVER A QUANTITY, and at this band that is an
 * AUDIO rule before it is an accessibility one.
 *
 * `speakablePrompt(prompt, figure.alt)` prepends the scene to the question and
 * prefers the alt over the `[image: …]` bracket, and every band-A screen
 * autoplays it — so the alt is the first thing a four-year-old receives, before
 * the question is even asked. Saying how many are in either group would perform
 * the whole item aloud. Naming the PLUS SIGN gives nothing away and is the point:
 * a child who cannot see the drawing still learns that a mark sits between the
 * two groups and that the mark means "put them together".
 *
 * The bracket keeps its numbers. It is never displayed and never spoken, and it
 * is what QG-1 and QG-4 sign to keep operand surfaces fresh; emptying it would
 * make `signatureOf` return null and stop the item being guarded at all (L29).
 */
function joinFigure(p: Join, asserts: FigureAssertion): BBFigure {
  return counterGroups(
    [{ count: p.a, noun: p.noun }, { count: p.b, noun: p.noun }],
    {
      relation: 'join',
      // NO NUMBER WORD, and "two" was one (L48: a number word is a number,
      // wherever it appears). The alt withheld both group counts on purpose, but
      // still opened "two groups of …" — and this week's smallest total IS two,
      // so on every 1+1 draw the autoplay spoke the answer aloud before asking
      // for it. `bb-spoken-answer-test` failed band A on 80 of 800 items for
      // exactly that. The group count is visible in the drawing and needs no
      // narration; the plus sign is what the alt exists to name.
      alt: `a group of ${p.noun} and another group of ${p.noun}, with a plus sign between them`,
      asserts,
    },
  );
}

/** The bracket for a join: both counts, in the order the picture draws them. */
function joinScene(p: Join): string {
  return `${countNoun(p.a, p.noun)} and ${countNoun(p.b, p.noun)} together`;
}

/**
 * The discrimination picture: two children's groups, side by side, and NO plus
 * sign anywhere.
 *
 * That absence is the item. The brief for this week is "same picture, different
 * story", so if a join drew a plus and a no-join did not, the child would answer
 * by hunting for the sign instead of by listening to what happened — and the
 * misconception the page exists to unseat is precisely "two numbers on a page
 * make an addition". So both stories are told over this drawing, which shows only
 * what is true before anybody does anything: two groups, one labelled with each
 * child's name.
 */
function ownedFigure(
  p: Join,
  names: readonly [string, string],
  asserts: FigureAssertion,
): BBFigure {
  return counterGroups(
    [
      { count: p.a, noun: p.noun, label: names[0] },
      { count: p.b, noun: p.noun, label: names[1] },
    ],
    { alt: `${names[0]}'s ${p.noun} beside ${names[1]}'s ${p.noun}`, asserts },
  );
}

// ===========================================================================
// The option deal — one mechanism, every page whose answer is a whole
// ===========================================================================

interface Wrong {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Two wrong values, with the truth's RANK rotated.
 *
 * L43 states the defect as an INVARIANT rather than as a direction: the answer
 * must not sit at a fixed rank among the numbers on offer. "All distractors
 * below" makes "tap the biggest" score full marks, and it is the shape a join
 * page falls into by default, because a total is larger than either of its parts
 * and larger than any part-for-whole slip. So a target rank is drawn uniformly —
 * 0 puts the truth lowest, 1 in the middle, 2 highest — and when the drawn join
 * cannot realise it (a total of two has almost nothing honest beneath it) the
 * deal steps to the NEAREST reachable rank rather than cycling, which is what
 * keeps the marginal from piling onto whichever end is always available.
 *
 * Deterministic throughout: one `r.int` for the target, then shuffles inside the
 * branch that succeeds. Never a redraw loop, which would consume a variable
 * number of draws and break seed stability (kit §E2.4).
 */
function twoWrongs(r: Rng, below: readonly number[], above: readonly number[]): number[] {
  const build = [
    () => (above.length >= 2 ? r.shuffle(above).slice(0, 2) : null),
    () => (below.length >= 1 && above.length >= 1 ? [r.pick(below), r.pick(above)] : null),
    () => (below.length >= 2 ? r.shuffle(below).slice(0, 2) : null),
  ];
  const wanted = r.int(0, 2);
  const order = [0, 1, 2].sort((x, y) => Math.abs(x - wanted) - Math.abs(y - wanted));
  for (const k of order) {
    const got = build[k]();
    if (got) return got;
  }
  throw new Error('A14 twoWrongs: this join offers fewer than two honest wrong values');
}

/** Each value once, in the order offered, with anything unusable dropped. */
function tidy(values: readonly number[], truth: number, floor: number): number[] {
  const seen = new Set<number>([truth]);
  const out: number[] = [];
  for (const v of values) {
    if (v < floor || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/**
 * Why a number that is not the whole might still be tapped.
 *
 * Read off the VALUE and the drawn join rather than off the branch that produced
 * them, so a rationale can never drift from the card it explains. The order of
 * the tests is the order of the WEEK: the part-for-whole readings are checked
 * first because they are the misconception this week exists to name, and the
 * counting slips are read off whatever is left. Where both readings are true at
 * once — a group of one is also "the total less one" — the part reading wins,
 * and it is the more useful thing for an adult to be told. Teacher-facing, so it
 * carries no word cap.
 */
function whyNotTheWhole(v: number, p: Join): Wrong {
  const text = String(v);
  const whole = p.a + p.b;
  if (v === p.a && v === p.b) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'One of the two groups given as the answer. Both groups hold the same number here, so there is no telling which one was counted — only that the counting stopped after one of them.',
    };
  }
  if (v === p.b) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'Only the ones that arrived. The question "how many came?" has been answered in place of "how many now?" — the group that was already waiting was never counted at all. This is the week\'s headline slip and it is the puppet\'s.',
    };
  }
  if (v === p.a) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'Only the ones that were already there. The picture was read as a starting number with some decoration beside it, so the arriving group was looked at and not joined in.',
    };
  }
  if (v === whole - 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One short. Counting all of them means crossing the gap between the two groups, and the hand jumped that gap without touching the thing on the far side of it.',
    };
  }
  if (v === whole - 2) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'Two short. The count restarted after the gap instead of carrying on, so the first thing in the second group took a number that had already been said.',
    };
  }
  if (v === whole + 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One too many. The last thing in the first group was touched again as the second group began, which is what crossing the gap does when nothing marks where it was.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'Two too many. The count doubled back over the join, giving two things a second number each before it carried on.',
  };
}

/**
 * The three cards for a page whose answer is the whole.
 *
 * BELOW the whole: the two parts and the two short counts. The value 1 is barred
 * unless the whole is two, because a total is never 1 and an option that can
 * never be keyed must not become a fixture (disclosure 5). ABOVE the whole: the
 * two over-counts, which are the only honest values a join of five can produce
 * on the high side, and which are what stops "tap the biggest" from being a
 * strategy.
 */
function wholeCards(r: Rng, p: Join): { correct: string; wrongs: Wrong[] } {
  const whole = p.a + p.b;
  const floor = whole === 2 ? 1 : 2;
  const below = tidy([p.b, p.a, whole - 1, whole - 2], whole, floor).filter((v) => v < whole);
  const above = tidy([whole + 1, whole + 2], whole, floor).filter((v) => v > whole);
  return {
    correct: String(whole),
    wrongs: twoWrongs(r, below, above).map((v) => whyNotTheWhole(v, p)),
  };
}

// ===========================================================================
// Local generator 1 — count them all (the week's core form)
// ===========================================================================

/**
 * Two groups, a drawn plus sign, and the whole to be found by counting all of it.
 *
 * The truth is recomputed by the registered `d_verify_binop_v1` from the same two
 * counts the picture is built out of (disclosure 2), and QG-13 independently
 * re-derives the drawing's own total and compares it with the keyed option — so
 * the picture, the params and the key are pinned to each other twice over.
 */
function joinCount(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = nextKind(rng, guard, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = { ...drawCounts(r), noun };
      const { correct, wrongs } = wholeCards(r, p);
      const { choices, correctKey } = makeChoices(r, correct, wrongs);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(joinScene(p), `The two groups made one group. How many ${p.noun}?`),
        figure: joinFigure(p, assertsAnswer),
        choices,
        answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.a, b: p.b, op: '+' }, seed: r.uint() },
        hintLadder: ladder,
        errorTags: ['concept-misconception', 'procedure-slip', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'count-all-join' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 2 — name the number the two groups make
// ===========================================================================

/**
 * The same drawing, met from the symbol's side: the plus sign is NAMED, and the
 * child taps the numeral for what it made.
 *
 * This is `a_count_v1` versus `a_numeral_for_set_v1` applied to a join — count
 * the things, or put a name on what they come to — and it is the page where the
 * catalog's "+ symbol" actually lands. The sign is met, named and read aloud; it
 * is never moved, never completed and never solved for.
 */
function joinNumeral(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = nextKind(rng, guard, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = { ...drawCounts(r), noun };
      const { correct, wrongs } = wholeCards(r, p);
      const { choices, correctKey } = makeChoices(r, correct, wrongs);
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(
          joinScene(p),
          `The plus sign says: put them together. Tap the number of ${p.noun} now.`,
        ),
        figure: joinFigure(p, assertsAnswer),
        choices,
        answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.a, b: p.b, op: '+' }, seed: r.uint() },
        hintLadder: ladder,
        errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'name-the-whole' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// The discrimination — joining versus just looking
// ===========================================================================

type Look = 'join' | 'keep';

/**
 * WHICH DAILY DISCRIMINATION PAGE IS A JOIN IS DECIDED ONCE FOR THE PACK.
 *
 * Drawn per page, two fair coins land the same way on one pack in four, and a
 * pack whose Day-2 and Day-3 discriminations both join is a pack where "add the
 * two numbers you can see" was never once punished. So the coin is spent once, at
 * whichever page is built first, and read back afterwards — a pure function of
 * (which day, the one value stored in the pack's own guard), so a page rebuilt by
 * `drawUniqueItem` or by the assembler's guided-example check gets the mode it
 * already had rather than the other day's.
 */
function joinDay(rng: Rng, guard: TupleGuard): 2 | 3 {
  if (guard.taken('a14:join-day=2')) return 2;
  if (guard.taken('a14:join-day=3')) return 3;
  const day: 2 | 3 = rng.chance(0.5) ? 2 : 3;
  guard.add(`a14:join-day=${String(day)}`);
  return day;
}

const dailyLook = (day: 2 | 3) => (rng: Rng, guard: TupleGuard): Look =>
  joinDay(rng, guard) === day ? 'join' : 'keep';

/**
 * The mastery pair, one mode each, dealt PER FORM.
 *
 * Keyed on the form's own rng object, because `makeWeekBuilder` gives Form A and
 * Form B separate streams and hands the SAME stream back on a rebuild — so a
 * rebuilt page reads its remembered mode instead of taking the other form's,
 * which a plain guard counter could not tell apart. The map holds nothing between
 * packs: each pack builds fresh streams, so its entries die with it.
 *
 * The guarantee this buys is per FORM rather than per corpus: every mastery form
 * a child sits carries exactly one join page and one no-join page, so neither
 * blind habit can score more than one of the two, ever.
 */
const MASTERY_JOIN_SLOT = new WeakMap<Rng, number>();

/**
 * The two mastery slots the deal runs over, named here rather than inferred.
 *
 * THE FIRST VERSION INFERRED THEM AND WAS SILENTLY BROKEN, which is disclosure
 * 11 and is worth the sentence. It stored `chance ? slot : -slot` at whichever
 * slot ran first — always slot 2, since `makeWeekBuilder` builds a form in order
 * — so slot 6 read a value that could never equal 6 and was dealt "keep" on
 * every draw of every pack. Measured: half of all forms carried no join page at
 * all, "count the named child's group" scored 67% instead of 50%, and the whole
 * became a card slot 6 offered on half its draws and keyed on none of them. A
 * deal that cannot express one of its own outcomes reads exactly like a deal
 * that is working.
 */
const LOOK_SLOTS = [2, 6] as const;

function masteryLook(slot: (typeof LOOK_SLOTS)[number]) {
  return (rng: Rng, _guard: TupleGuard): Look => {
    let joinSlot = MASTERY_JOIN_SLOT.get(rng);
    if (joinSlot === undefined) {
      joinSlot = rng.chance(0.5) ? LOOK_SLOTS[0] : LOOK_SLOTS[1];
      MASTERY_JOIN_SLOT.set(rng, joinSlot);
    }
    return joinSlot === slot ? 'join' : 'keep';
  };
}

/**
 * Same picture, different story — the heart of the week (disclosure 3).
 *
 * One drawing of two children's groups carries either "Roque gives every shell to
 * Yenna" or "Nobody gives any shells away", and the question is the same either
 * way: how many does the named child have NOW? A join makes the answer the whole;
 * no join leaves it at whichever group the question names. All three values are
 * live, so no card can be struck out unread, and the two habits that could answer
 * the page without listening — always add, always count the named group — are
 * exactly complementary and each scores exactly one of the two pages in any form.
 *
 * `d_verify_binop_v1` recomputes the key from what the SITUATION says: the number
 * the named child had, plus the number that was handed to them. On the join page
 * that is `a + b`. On the no-join page it is `a + 0` or `b + 0`, and the zero is
 * not a placeholder — it is how many arrived, which is none, and saying so is the
 * point of the page. `shown` rides in the params too, so two pages that happen to
 * pose the same sum over different drawings are not mistaken for the same item by
 * the assembler's Form-B core check (a20's lesson).
 */
function joinOrLook(side: (rng: Rng, guard: TupleGuard) => Look, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    // Taken ONCE PER ITEM, outside the freshness loop: a redraw must not spend
    // the other page's mode, nor a second kind of thing.
    const mode = side(rng, guard);
    const noun = nextKind(rng, guard, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = { ...drawCounts(r), noun };
      const [first, second] = r.shuffle([...NAMES]).slice(0, 2) as [string, string];
      const whole = p.a + p.b;
      // On a join the second child hands their group over, so the first child is
      // the one the question can honestly ask about; asking the giver would key a
      // zero, which is a different week's idea. With no join either child may be
      // asked, and which one is drawn — that is what keeps a part live at both
      // ends of the pair.
      const askFirst = mode === 'join' ? true : r.chance(0.5);
      const key = mode === 'join' ? whole : askFirst ? p.a : p.b;
      const asked = askFirst ? first : second;
      const held = askFirst ? p.a : p.b;
      const other = askFirst ? p.b : p.a;

      const cards: Wrong[] = [];
      if (mode === 'join') {
        cards.push({
          text: String(p.a),
          errorTag: 'concept-misconception',
          rationale: 'Only the group that was already there. The handed-over group was looked at and never joined in, so the picture was read as a starting number with something beside it.',
        });
        cards.push(
          p.b === p.a
            ? {
              text: String(whole + 1),
              errorTag: 'procedure-slip',
              rationale: 'One too many. Both groups were counted, but the thing where the two groups meet took a second number as the count crossed over.',
            }
            : {
              text: String(p.b),
              errorTag: 'concept-misconception',
              rationale: 'Only the group that was handed over. "How many came?" answered in place of "how many now?" — the week\'s headline slip, and the puppet\'s.',
            },
        );
      } else {
        cards.push({
          text: String(whole),
          errorTag: 'task-comprehension',
          rationale: 'Both groups added although nobody handed anything over. Two numbers on one page were taken as an instruction to add, which is exactly the belief this page exists to unseat.',
        });
        cards.push(
          other === held
            ? {
              text: String(whole + 1),
              errorTag: 'procedure-slip',
              rationale: 'Both groups added, and one thing counted twice as the count crossed between them — the adding was not asked for and it was not done cleanly either.',
            }
            : {
              text: String(other),
              errorTag: 'representation-misread',
              rationale: 'The other child\'s group, counted instead of the one the question names. The counting was sound; the listening picked the wrong owner.',
            },
        );
      }
      const { choices, correctKey } = makeChoices(r, String(key), cards);

      const story = mode === 'join'
        ? `${second} gives every ${unitFor(1, p.noun)} to ${first}.`
        : `Nobody gives any ${p.noun} away.`;
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(
          `${countNoun(p.a, p.noun)} for ${first} and ${countNoun(p.b, p.noun)} for ${second}`,
          `${story} How many ${p.noun} does ${asked} have now?`,
        ),
        figure: ownedFigure(
          p,
          [first, second],
          mode === 'join' ? assertsAnswer : assertsAnswerOf(askFirst ? 'group:0' : 'group:1'),
        ),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: {
            a: held,
            b: mode === 'join' ? other : 0,
            op: '+',
            shown: [p.a, p.b],
          },
          seed: r.uint(),
        },
        hintLadder: ladder,
        errorTags: ['concept-misconception', 'task-comprehension', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'join-or-look', isDiscrimination: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 3 — help the puppet (the recipe's own slip)
// ===========================================================================

/**
 * A named puppet answers "how many arrived" when the question asked "how many
 * now", and the number he gives is READ OFF THE DRAWING rather than authored: it
 * is `b`, the count of the group the picture puts to the right of the plus sign
 * (disclosure 1). The word "wrong" never appears; he "got mixed up".
 *
 * His card can never be the answer — that is what error analysis IS — so the
 * page floors at a coin flip for a child who has learnt that much, and the third
 * card is drawn on either side of the whole so that "tap the biggest" is worth no
 * more than the same coin. Both floors are measured and reported rather than
 * argued away; a01, a12 and a20 all reached the same ceiling, and the only way
 * past it is to let the puppet sometimes be right, at which point it is not error
 * analysis.
 */
function puppetJoin(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = nextKind(rng, guard, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = drawArrival(r, noun);
      const puppet = r.pick(PUPPETS);
      const whole = p.a + p.b;
      const below = tidy([p.a, whole - 1, whole - 2], whole, 2).filter((v) => v < whole && v !== p.b);
      const above = [whole + 1, whole + 2];
      // THREE DRAWS IN FOUR, NOT A COIN, AND THE FRACTION IS ARITHMETIC.
      //
      // The puppet's card is a PART, so it always sits below the whole and the
      // truth can never be the smallest number on this page — that is what error
      // analysis costs and a20 disclosed the same floor. What is left to rotate
      // is middle against highest, and a fair coin does not rotate it evenly:
      // two of the six joins (one-and-one, and one-and-two) have nothing honest
      // between the puppet's number and the whole, so they force the third card
      // above and a coin lands at two thirds middle (measured 65.5% and 68.2% on
      // the two certifying puppet slots before this). Choosing below on three
      // draws in four of the four pairs that CAN takes both outcomes to a half.
      const third = below.length > 0 && r.int(1, 4) <= 3 ? r.pick(below) : r.pick(above);
      const { choices, correctKey } = makeChoices(r, String(whole), [
        {
          text: String(p.b),
          errorTag: 'concept-misconception',
          rationale: 'The puppet\'s own number: the ones that arrived, counted as though they were the whole. He answered a question the story asked earlier and stopped there.',
        },
        whyNotTheWhole(third, p),
      ]);
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(
          joinScene(p),
          `Some more ${p.noun} came. ${puppet} got mixed up and says ${String(p.b)}. How many ${p.noun} now?`,
        ),
        figure: joinFigure(p, assertsAnswer),
        choices,
        answer: { value: correctKey, acceptableForms: [String(whole)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `said` records what the puppet counted, so this page is reproducible
          // from its params and is never mistaken for a plain join by the
          // assembler's Form-B core-collision check (a20's lesson).
          params: { a: p.a, b: p.b, op: '+', said: p.b },
          seed: r.uint(),
        },
        hintLadder: ladder,
        errorTags: ['concept-misconception', 'procedure-slip', 'task-comprehension'],
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
 * family carries no story generator, so the three frames live here.
 *
 * Each frame supplies a container and a verb and nothing else; the kind of thing
 * and both counts are DRAWN per item, so no scene in this week is welded to a
 * noun. THE HOOP, THE RAFT AND THE WAGON STAY IN THE STORY AND OUT OF THE
 * PICTURE: no primitive draws a container, so an alt naming one would describe
 * something that is not there (the L27 class). The picture is two groups and a
 * plus sign, so that is what the alt says; where they were put is narration and
 * belongs in the question.
 *
 * The seven nouns below are `COUNTABLE_NOUNS` minus ducks and stars. Both are
 * fine to count and fine to join, and neither is fine to load into a wagon — a
 * story is the one place in the week where a noun has to survive being handled.
 */
const STORY_NOUNS = COUNTABLE_NOUNS.filter((n) => n !== 'ducks' && n !== 'stars');

interface Frame {
  line: (name: string, noun: string) => string;
  ask: (noun: string) => string;
  ladder: string[];
}

/**
 * FOUR frames for three daily pages, because the fourth belongs to the mastery
 * slot and reading a generated week is what made that obvious. With three, the
 * certifying slot had to borrow one of Day 4's, so a pack served the same
 * container three times — once on Day 4 and once in each mastery form — and the
 * repetition read as a shortage rather than as a design.
 */
const FRAMES: Record<'hoop' | 'raft' | 'wagon' | 'punnet', Frame> = {
  hoop: {
    line: (name, noun) => `${name} puts both groups of ${noun} in one hoop.`,
    ask: (noun) => `How many ${noun} are in the hoop now?`,
    ladder: ['Point at the hoop and picture them inside it.', 'Nothing in the hoop gets left out.'],
  },
  raft: {
    line: (name, noun) => `${name} floats both groups of ${noun} on one raft.`,
    ask: (noun) => `How many ${noun} are on the raft now?`,
    ladder: ['They all share the raft now. None stayed behind.', 'Nobody is spare here. Every one gets a number.'],
  },
  wagon: {
    line: (name, noun) => `${name} loads both groups of ${noun} into one wagon.`,
    ask: (noun) => `How many ${noun} are in the wagon now?`,
    ladder: ['Everything got loaded. Nothing was left on the ground.', 'Move along the wagon without doubling back.'],
  },
  punnet: {
    line: (name, noun) => `${name} tips both groups of ${noun} into one punnet.`,
    ask: (noun) => `How many ${noun} are in the punnet now?`,
    ladder: ['They are mixed up in there together now.', 'Nothing hides in there. Find them all.'],
  },
};

function joinStory(which: 'hoop' | 'raft' | 'wagon' | 'punnet'): ItemGen {
  const frame = FRAMES[which];
  return (rng, guard, difficulty) => {
    const noun = nextKind(rng, guard, STORY_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p: Join = { ...drawCounts(r), noun };
      const name = r.pick(NAMES);
      const { correct, wrongs } = wholeCards(r, p);
      const { choices, correctKey } = makeChoices(r, correct, wrongs);
      const draft: ItemDraft = {
        type: 'word-problem',
        // NO GIVEN: the sentence names the person, the kind and the container,
        // and neither quantity. The only place either count exists is the drawing.
        prompt: scenePrompt(joinScene(p), `${frame.line(name, p.noun)} ${frame.ask(p.noun)}`),
        figure: joinFigure(p, assertsAnswer),
        choices,
        answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.a, b: p.b, op: '+' }, seed: r.uint() },
        hintLadder: hints(...frame.ladder),
        errorTags: ['concept-misconception', 'procedure-slip', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'join-story', situationType: 'combine' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generators 5 and 6 — the Day-5 production pair
// ===========================================================================

/**
 * The recipe's Day-5: tell a join story for the drawn sum, out loud.
 *
 * Open by construction (disclosure 8) — no key can exist for a story nobody has
 * told yet — but not unchecked: `answer.value` records the whole number sentence
 * so an adult holding the page knows what a correct story has to come to, the
 * numeral rides in `acceptableForms` so QG-13 can compare the drawing's own total
 * against it, and the picture is code-drawn from the same two counts. This is also
 * the item that satisfies the dual-strand coupling gate.
 */
function tellJoinStory(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = nextKind(rng, guard, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = { ...drawCounts(r), noun };
      const whole = p.a + p.b;
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(joinScene(p), 'Tell a join story about this picture.'),
        figure: joinFigure(p, assertsAnswer),
        answer: {
          value: `${String(p.a)} + ${String(p.b)} = ${String(whole)}`,
          acceptableForms: [String(whole)],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.a, b: p.b, op: '+' }, seed: r.uint() },
        hintLadder: ladder,
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'tell-a-join-story' },
      };
      return draft;
    });
  };
}

/**
 * The catalog's Day-5 non-computational focus — "[set] + [set] = [draw the
 * total]" — in the only form the renderer can carry (disclosure 6). The two sets
 * and the plus sign are drawn; the equals sign is spoken in the question; the
 * total is what the child draws.
 */
function drawTheWhole(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const noun = nextKind(rng, guard, COUNTABLE_NOUNS);
    return drawUniqueItem(rng, guard, (r) => {
      const p = { ...drawCounts(r), noun };
      const whole = p.a + p.b;
      const draft: ItemDraft = {
        type: 'drawing',
        // The two signs are described by what they DO, not by where they sit:
        // the plus really is drawn between the groups, and the equals sign is
        // nowhere on the page, so a question pointing at one would be describing
        // something the child cannot find (the L27 class).
        prompt: scenePrompt(
          joinScene(p),
          'Plus puts them together. Equals shows what they make. Draw them all.',
        ),
        figure: joinFigure(p, assertsAnswer),
        answer: {
          value: String(whole),
          acceptableForms: [`${countNoun(whole, p.noun)} drawn`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: p.a, b: p.b, op: '+' }, seed: r.uint() },
        hintLadder: ladder,
        errorTags: ['procedure-slip', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'draw-the-whole' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 7 — give a family warm-up the cards it needs
// ===========================================================================

/**
 * A band-A numeric item with no authored `choices` is not a free-entry page: it
 * is four buttons a render-time function invents, from a function that cannot
 * know the slot's answer range (L53), for a child who cannot type. Three of the
 * four warm-ups arrive from the family that way, so each is given three authored
 * cards drawn from the honest miscounts ITS OWN question produces, with the
 * truth's rank rotated by the same dealer the core pages use.
 *
 * It also takes back an audit it would otherwise lose: a `choice-key` answer is
 * not re-derived by QG-5, so the wrapper re-reads the item's own
 * `generator.params`, recomputes the answer independently, and refuses to build
 * if the picture and the key have parted company. It takes no rng draw before
 * `base` and leaves the prompt and the figure untouched, so the surface QG-1
 * signs is unchanged.
 */
function withCards(
  base: ItemGen,
  read: (params: Record<string, unknown>) => number,
  pool: (n: number, params: Record<string, unknown>) => number[],
  why: (v: number, n: number, params: Record<string, unknown>) => Wrong,
): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error('A14 withCards: this warm-up ships no params, so its key cannot be re-derived');
    const n = read(params);
    const stated = [draft.answer.value, ...draft.answer.acceptableForms];
    if (!Number.isInteger(n) || !stated.includes(String(n))) {
      throw new Error(
        `A14 withCards: ${draft.generator?.templateId ?? 'an item'} keyed "${draft.answer.value}", but its own params give ${String(n)}`,
      );
    }
    const values = tidy(pool(n, params), n, 1);
    const below = values.filter((v) => v < n);
    const above = values.filter((v) => v > n);
    const { choices, correctKey } = makeChoices(
      rng,
      String(n),
      twoWrongs(rng, below, above).map((v) => why(v, n, params)),
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
 * A12 — the hiding game, and the most load-bearing prior week this file has.
 *
 * Its three cards are the part on show (the bond never made), and one whisper
 * either side. Every value 1–4 is keyable, so nothing on the page can be struck
 * out unread.
 */
const warmHiding = warmUp(
  withHints(
    withCards(
      partnersHiding({ total: 5 }),
      (p) => Number(p.total) - Number(p.shown),
      (n, p) => [Number(p.shown), n - 1, n + 1].filter((v) => v >= 1 && v <= 4),
      (v, n, p) => {
        if (v === Number(p.shown)) {
          return {
            text: String(v),
            errorTag: 'concept-misconception',
            rationale: 'The counters still in sight, handed back as the answer to a question about the ones out of sight. Nothing was worked out; the visible number was repeated.',
          };
        }
        return v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'One too many. The whispering started on the box it was already sitting on, so an extra number was said before the frame was full.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'One too few. The whispering stopped a box early, before the frame had actually been filled.',
          };
      },
    ),
    hints('Some of them are asleep under the card.', 'Count on quietly until the frame would be full.'),
  ),
  12,
);

/** A1 — count a small group laid in a ring, where there is no end to start from. */
const warmCountRing = warmUp(
  withHints(
    withCards(
      countArrangement({ min: 2, max: 5, arrangement: 'in a ring' }),
      (p) => Number(p.n),
      (n) => [n - 1, n + 1, n - 2, n + 2].filter((v) => v >= 2 && v <= 5),
      (v, n) => (v > n
        ? {
          text: String(v),
          errorTag: 'representation-misread',
          rationale: `${v - n === 1 ? 'One' : 'Two'} too many. A ring has no end, so the counting went round past the one it started on and gave it a second number.`,
        }
        : {
          text: String(v),
          errorTag: 'procedure-slip',
          rationale: `${n - v === 1 ? 'One' : 'Two'} too few. The counting stopped before it had come all the way round the ring.`,
        }),
    ),
    hints('Which one will you count first? Remember it.', 'Stop the moment you reach that one again.'),
  ),
  1,
);

/** A6 — the next number along, which is what counting a group on will become. */
const warmNextNumber = warmUp(
  withHints(
    withCards(
      neighbourNumber({ kind: 'after', min: 1, max: 4 }),
      (p) => Number(p.n) + 1,
      (n) => [n - 1, n + 1, n - 2, n + 2].filter((v) => v >= 2 && v <= 5),
      (v, n) => (v === n - 1
        ? {
          text: String(v),
          errorTag: 'concept-misconception',
          rationale: 'The number the path already showed, given back unchanged — the step forward was never taken.',
        }
        : v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: `${v - n === 1 ? 'Two steps' : 'Three steps'} forward instead of one, so the walk went past the empty spot on the path.`,
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'A step backwards along the path. The direction was lost before the walking started.',
          }),
    ),
    hints('Find the number the path is showing you.', 'Walk one step towards the bigger end.'),
  ),
  6,
);

/** A3 — a numeral matched to a set, because a whole that cannot be named is not an answer. */
const warmNameTheGroup = warmUp(
  withHints(
    setForNumeral({ min: 1, max: 5, groups: 3 }),
    hints('Work through a whole group before you leave it.', 'Only one group finishes on the number you heard.'),
  ),
  3,
);

// --- the core forms, each in its own voice ----------------------------------

const meetTheJoin = joinCount(
  hints('Slide the two groups together with your finger.', 'Now count them as one long group.'),
);
const meetTheJoinAgain = joinCount(
  hints('Nobody went away. They are all still here.', 'Start on the left and touch every one.'),
);
const countAcrossTheGap = joinCount(
  hints('Watch the gap where the two groups meet.', 'Carry the counting straight over it. Do not restart.'),
);
const namePlusDay1 = joinNumeral(
  hints('The plus sign is a little cross between them.', 'It means both groups belong to one number.'),
);
const namePlusDay2 = joinNumeral(
  hints('Say what the plus sign told you to do.', 'Join them in your head before you tap.'),
);
const namePlusDay3 = joinNumeral(
  hints('Both groups have one number now, not two.', 'Work out the number, then look at the cards.'),
);
const lookDay2 = joinOrLook(
  dailyLook(2),
  // BOTH RUNGS HAVE TO BE TRUE OF BOTH STORIES, and reading a generated week is
  // what caught that: this slot's second rung used to begin "If nobody did..."
  // and was half-dead on every draw where somebody did. A ladder cannot vary
  // with the mode either — the dedup gate is only seed-invariant while a slot's
  // help is fixed — so the help has to point at the DECISION rather than at one
  // side of it.
  hints('Listen again. Did anybody hand anything over?', 'That answer decides which things to count.'),
);
const lookDay3 = joinOrLook(
  dailyLook(3),
  hints('Two groups on a page are not always added.', 'Something has to happen first. Did it?'),
);
const puppetDay3 = puppetJoin(
  hints('The puppet counted the ones that just came.', 'Count the ones that were waiting as well.'),
);
const puppetDay5 = puppetJoin(
  hints('Ask the puppet which ones got left out.', 'Start again at the very beginning with them.'),
);
const storyHoop = joinStory('hoop');
const storyRaft = joinStory('raft');
const storyWagon = joinStory('wagon');
const tellAStory = tellJoinStory(
  hints('Say who they belong to and what happened.', 'End your story with the new number.'),
);
const drawThemAll = drawTheWhole(
  hints('Draw the waiting ones first, then the new ones.', 'Check that none of them got missed out.'),
);

// --- the six mastery slots, in their own voice ------------------------------

const masteryCount = joinCount(
  hints('Both groups are one group in this picture.', 'Not one of them is left outside it.'),
);
const masteryLookOne = joinOrLook(
  masteryLook(2),
  hints('The words tell you whether to join them.', 'The picture only tells you how many there are.'),
);
const masteryStory = joinStory('punnet');
const masteryNumeral = joinNumeral(
  hints('Find the plus sign and say what it asks.', 'Do what it asks, then tap that number.'),
);
const masteryPuppet = puppetJoin(
  hints('Somebody got missed out of the counting.', 'Find them, then count the whole group again.'),
);
const masteryLookTwo = joinOrLook(
  masteryLook(6),
  hints('Who ended up holding them? Work that out first.', 'Then count only what that child is holding.'),
);

// ===========================================================================
// The week
// ===========================================================================

export const buildA14 = makeWeekBuilder({
  level: 'A',
  week: 14,
  conceptId: 'meeting-addition',
  conceptName: 'Meeting addition',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [
    { level: 'A', week: 12 },
    { level: 'A', week: 13 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'acting the join story out',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Every join picture draws a real plus sign between the two groups, so the symbol arrives on a page where it means something. Do this with real things before the screen: put two small piles on the table, ask how many, then SLIDE them together while your child watches and ask again. Then do it once without sliding them, and ask the same question. Telling the two apart is the week. Mascot present.',
  },
  explanation: {
    hook: say(
      'Two ducks float on the pond. Three more land beside them. Now they all swim in one group. How many ducks is that? Let us find out together.',
    ),
    whyBeforeHow: say(
      'Two groups can turn into one group. That is adding. Numbers alone do not tell you. We know it is adding because something happens. Things arrive. Things get put on one plate. So we start by acting the join story out. Move them together with your hands. Then count every single one.',
    ),
    script: [
      {
        say: say('Here are two shells. Over here are three more shells.'),
        visual: 'Two shells on the left, three shells on the right, with a gap between them.',
        figure: counterGroups(
          [{ count: 2, noun: 'shells' }, { count: 3, noun: 'shells' }],
          { alt: 'a group of shells beside another group of shells' },
        ),
      },
      {
        say: say('Watch. I slide them together. Now they are one group.'),
        visual: 'The same five shells pushed into one group, with a plus sign where the gap was.',
        figure: counterGroups(
          [{ count: 2, noun: 'shells' }, { count: 3, noun: 'shells' }],
          { relation: 'join', alt: 'two groups of shells with a plus sign between them' },
        ),
      },
      {
        say: say('That little cross is a plus sign. It means: put them together.'),
        visual: 'The plus sign standing between the two groups of shells.',
        // The same joined picture as the segment above, held still while the
        // symbol in the middle of it is named. Nothing moves between the two
        // segments because nothing should: the child has already watched the
        // groups slide together, and this is the moment the mark that records
        // it gets its name.
        figure: counterGroups(
          [{ count: 2, noun: 'shells' }, { count: 3, noun: 'shells' }],
          { relation: 'join', alt: 'two groups of shells with a plus sign standing between them' },
        ),
      },
      {
        say: say('We write it like this. 2 + 3 = 5. Five shells!'),
        visual: 'The number sentence 2 + 3 = 5 written out large, with the 5 underlined.',
        // The three segments above built the join out of shells; this one is the
        // WRITING, which is a picture in its own right and was carrying none.
        // The underline sits under the 5 because that is the part the say ends
        // on ("Five shells!") — a teacher's pen, not an animation.
        figure: mathSentence(
          [{ text: '2' }, { text: '+' }, { text: '3' }, { text: '=' }, { text: '5', mark: 'underline' }],
          { alt: 'the number sentence two plus three equals five written out large, with the five underlined' },
        ),
      },
    ],
    summary: say(
      'Two groups became one group. That is adding. Count every one to find how many. The plus sign joins them. The equals sign tells what they make.',
    ),
    vocabulary: [
      { term: 'add', kidGloss: 'make one group out of two smaller groups' },
      { term: 'plus', kidGloss: 'the little cross that says: put them together' },
      { term: 'equals', kidGloss: 'the two lines that say: this makes that' },
      { term: 'join', kidGloss: 'when things arrive and stay with the others' },
    ],
  },
  guidedExamples: [
    {
      // Every guided-example bracket names all three numbers, which is what a
      // worked example is for — and it also keeps the assembler's echo check off
      // the day pages, since no generated item ever prints three counts.
      ...ge(
        14,
        1,
        'modeled',
        scenePrompt('3 buttons and 1 button, 4 buttons in all', 'The two groups made one group. How many buttons?'),
        [
          {
            teacherSay: say('Watch me. I push the one button up to the three.'),
            expected: 'one group of buttons',
          },
          { teacherSay: say('They are one group now. So do I start again?') },
          { childDo: say('Count them all with me, right across.'), expected: '4' },
          { teacherSay: say('Four buttons. The last one still counts!') },
        ],
        '4',
      ),
      visual: 'Three buttons and one button sliding together into a single group of four.',
      figure: counterGroups(
        [{ count: 3, noun: 'buttons' }, { count: 1, noun: 'buttons' }],
        { relation: 'join', alt: 'two groups of buttons with a plus sign between them', asserts: assertsAnswer },
      ),
    },
    {
      ...ge(
        14,
        2,
        'completion',
        scenePrompt('2 apples and 3 apples, 5 apples in all', 'The two groups made one group. How many apples?'),
        [
          { teacherSay: say('Here we go. Two apples, and then...') },
          { childDo: say('Carry on across the gap. Do not stop.'), expected: '5' },
          { teacherSay: say('You crossed the gap. That is the whole trick.') },
        ],
        '5',
      ),
      visual: 'Two apples and three apples joined, with a finger tracing across the gap.',
      figure: counterGroups(
        [{ count: 2, noun: 'apples' }, { count: 3, noun: 'apples' }],
        { relation: 'join', alt: 'two groups of apples with a plus sign between them', asserts: assertsAnswer },
      ),
    },
    {
      ...ge(
        14,
        3,
        'prompted',
        scenePrompt('4 leaves for Anouk and 1 leaf for Mirek, 5 leaves in all', 'Nobody gives any leaves away. How many leaves does Mirek have?'),
        [
          { teacherSay: say('Nothing moved this time. Listen to that again.') },
          { childDo: say('So count only what belongs to him.'), expected: '1' },
        ],
        '1',
      ),
      visual: 'Four leaves under one name and one leaf under another, staying where they are.',
      figure: counterGroups(
        [{ count: 4, noun: 'leaves', label: 'Anouk' }, { count: 1, noun: 'leaves', label: 'Mirek' }],
        { alt: 'one child\'s leaves beside another child\'s leaves', asserts: assertsAnswerOf('group:1') },
      ),
    },
    {
      ...ge(
        14,
        4,
        'independent',
        scenePrompt('1 flower and 2 flowers, 3 flowers in all', 'The two groups made one group. How many flowers?'),
        [{ childDo: say('Join them and count them on your own.'), expected: '3' }],
        '3',
      ),
      visual: 'One flower and two flowers joined into a group of three.',
      figure: counterGroups(
        [{ count: 1, noun: 'flowers' }, { count: 2, noun: 'flowers' }],
        { relation: 'join', alt: 'two groups of flowers with a plus sign between them', asserts: assertsAnswer },
      ),
    },
  ],
  days: [
    // Day 1 — the join met, and the plus sign named on the page that draws it.
    [
      { gen: warmHiding, diff: 2 },
      { gen: meetTheJoin, diff: 2 },
      { gen: meetTheJoinAgain, diff: 2 },
      { gen: namePlusDay1, diff: 3 },
    ],
    // Day 2 — practice, and the first page where nobody joins anything.
    [
      { gen: warmCountRing, diff: 1 },
      { gen: countAcrossTheGap, diff: 2 },
      { gen: lookDay2, diff: 3 },
      { gen: namePlusDay2, diff: 3 },
    ],
    // Day 3 — the contrast again, and the puppet who answers the earlier question.
    [
      { gen: warmNextNumber, diff: 2 },
      { gen: lookDay3, diff: 3 },
      { gen: puppetDay3, diff: 3 },
      { gen: namePlusDay3, diff: 3 },
    ],
    // Day 4 — real-world single-step picture problems (the band-A form of G7).
    [
      { gen: warmNameTheGroup, diff: 2 },
      { gen: storyHoop, diff: 3 },
      { gen: storyRaft, diff: 3 },
      { gen: storyWagon, diff: 3 },
    ],
    // Day 5 — tell a join story out loud, draw what the equals sign asks for,
    // and settle the puppet one more time.
    [
      { gen: tellAStory, diff: 3 },
      { gen: drawThemAll, diff: 2 },
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
    'For grown-ups: this is the week your child meets adding, and the surprising part is that adding is a STORY before it is a sum. Two piles of buttons on the table are just two piles. They become an addition when something happens to them — you slide them together, someone hands theirs over, more arrive. Try both at home with anything you have: put out two small piles, ask how many altogether, then push them into one and ask again. Another day, put out two piles and ask how many YOU have, with nobody moving anything. Children who have decided that "two numbers means add" will add on both days, and catching that now saves a great deal later. When they do count, watch the gap in the middle: the commonest slip is to stop at the end of the first pile or to count the last one twice as they cross over. Say the plus sign out loud when you see one, and say the equals sign too — "two and three equals five" — long before anyone asks them to write it.',
  ],
  /**
   * The puzzle is a BUILD, which is a move no page in this week makes: every day
   * page counts a join that is already drawn, and this one makes a join that is
   * not there yet. The child is given part of five and draws the rest, which is
   * the join met from the far side and is the bridge into A15.
   *
   * It carries no `asserts` (disclosure 9): the quantity the picture can compute
   * is the part already there, and the item asks for the part still to come, so
   * pointing the assertion at the drawing would have QG-13 report a contradiction
   * between a truthful picture and a correct answer. What guarantees the pair
   * instead is that one drawn `have` produces both the number in the picture and
   * the `5 − have` in the key.
   */
  puzzle: (r) => {
    const noun = r.pick(STORY_NOUNS);
    const have = r.int(1, 4);
    return {
      id: 'A14-PZ-01',
      title: 'Puzzle Grove: Who Else Is Coming?',
      puzzleType: 'construction',
      prompt: [
        `[image: ${countNoun(have, noun)} in a row]`,
        say(`Draw more ${noun}. Make five ${noun} in all.`),
      ].join(' '),
      figure: counters(have, noun, {
        arrangement: 'in a row',
        alt: `a short row of ${noun}`,
      }),
      answer: {
        value: String(WHOLE - have),
        acceptableForms: [`${countNoun(WHOLE - have, noun)} drawn`],
        validation: 'manual-review',
      },
      hintLadder: hints('Count what is already sitting on the page.', 'Then keep whispering on until you reach five.'),
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'make-five' },
  sprint: null,
  mastery: [
    { gen: masteryCount, diff: 2 },
    { gen: masteryLookOne, diff: 3 },
    { gen: masteryStory, diff: 3 },
    { gen: masteryNumeral, diff: 3 },
    { gen: masteryPuppet, diff: 3 },
    { gen: masteryLookTwo, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh surfaces off a separate stream. Every slot is a tap with three authored cards, so no certifying page is left as a bare numeric for the display layer to invent buttons for. 01: count a drawn join and give the whole. 02 and 06: the same drawing under two stories - one child hands their group over, or nobody hands anything over - with the same question asked either way, so the answer is the whole on one and a single part on the other. 03: a story that names a person, a kind and a container, and neither count. 04: the plus sign named, and the numeral for what it made. 05: a puppet who gives the number that arrived instead of the number there is now. WHICH OF THE TWO DISCRIMINATION SLOTS IS THE JOIN IS DEALT PER FORM, not left to a coin per page: every form carries exactly one join page and one no-join page, so a child who adds every pair of numbers on sight scores exactly one of the two, and so does a child who never adds anything. Both mastery forms are dealt independently. NEITHER COUNT IS EVER SPOKEN: the figure alt, which is read aloud first at this band, names the two kinds and the plus sign and no quantity at all, so a form cannot be answered from the audio. The value 1 is never offered on a page whose answer is a whole, because a join within five never totals one and an option that can never be keyed teaches a child to strike it out unread; on the two discrimination slots a part IS the answer two draws in three, so small values are live there and are offered.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'part-given-for-whole',
      description: 'Answers with one of the two groups instead of the whole — most often the group that arrived, because the story spent its last breath on them and "how many came?" is the question that seems to have been asked. It is not carelessness; it is a child answering a real question that nobody asked.',
      exampleWrongAnswer: 'two on the pond and three flying in, answered as three',
      distractorRationale: 'Offered on every page whose answer is a whole and on both discrimination pages, and it is what the puppet says out loud on his own page. It is never the keyed answer to "how many now", and it is the keyed answer two draws in three on the discrimination pages, where the question names one child and nobody handed anything over — so the same value is right or wrong depending only on the story, which is the distinction the week exists to build.',
      reteachPointer: 'explanation/script[1] (the two groups slid together into one)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'adds-without-a-join',
      description: 'Adds the two numbers on the page although nobody joined anything — two groups sitting side by side are read as an instruction to add. This is the belief the week exists to unseat, and it is the one that survives into every later story-problem week if it is not caught here.',
      exampleWrongAnswer: 'asked how many one child has when nobody gave anything away, answers with both groups added',
      distractorRationale: 'The whole is a live card on both discrimination pages and is keyed on exactly one of the two in every mastery form, because the mode is dealt rather than drawn. So "add whatever you see" cannot be eliminated and cannot be relied on: it is right half the time by construction, which is what makes the page worth sitting.',
      reteachPointer: 'guidedExamples/A14-GE-03 (nobody gives any leaves away)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place-at-the-gap',
      description: 'Counts all of them but loses the thread where the two groups meet — either the hand jumps the gap without touching the thing on the far side, or the last of the first group is touched again as the second group begins.',
      exampleWrongAnswer: 'a join of two and three counted as four, or as six',
      distractorRationale: 'One short and one over are both offered on every page whose answer is a whole, and they are the only honest values above the whole, so they are what keeps "tap the biggest card" from being a strategy on a join page. On the warm-ups the same slip appears as a count one or two out.',
      reteachPointer: 'guidedExamples/A14-GE-02 (carrying the count across the gap)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-the-wrong-owner',
      description: 'Counts the wrong group — the other child\'s, or the wrong side of the picture. The counting itself is sound; what went astray is which set the question was about.',
      exampleWrongAnswer: 'asked how many one child has, counts the group under the other name',
      distractorRationale: 'Offered on the discrimination pages, where each group carries its owner\'s name under it and the question names one of them; on the numeral pages it appears as the count of one group given as the number the plus sign made.',
      reteachPointer: 'Day-3 discrimination page: say the name in the question back before counting anything',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Meeting addition as a story: two groups become one group, and we find out how many by counting all of them. We also met the plus sign and the equals sign, and practised telling whether a picture is actually an adding story or just two groups sitting near each other.',
    improvingCandidates: [
      'sliding two groups together and counting straight across the gap',
      'telling a joining story apart from a nobody-moved story',
      'saying what the plus sign asks you to do',
      'answering "how many now?" instead of "how many came?"',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'counting the group that was already waiting as well as the group that arrived — we will keep asking "and who else is here?" before anyone answers',
      },
      {
        errorTag: 'task-comprehension',
        text: 'checking that something really happened before adding, because two numbers on a page are not always an addition',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the count going across the gap where the two groups meet, so nothing is skipped and nothing is counted twice',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the ones that were already there as well as the new ones, and you carried the counting right across the middle.',
      questionForChild: 'These two piles are near each other. Is that adding, or does something have to happen first?',
      schoolSyncHook: 'Tell us what arrives at your house in twos and threes — socks, spoons, snack cups — and the join stories will use them.',
    },
    vocabularyForParent: [
      'add (two groups become one, and we count them all)',
      'plus (the sign that says: put them together)',
      'equals (the sign that says: this makes that)',
      'count all (find the total by counting every one, across both groups)',
    ],
  },
});
