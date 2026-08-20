/**
 * Level A · Week 21 — "Solid shapes & building" (conceptId: solid-shapes-and-building).
 *
 * FILL-ARCHITECTURE §3 row A21: anchor "roll / stack / slide test"; core forms
 * "which solid, which rolls"; perceptual discrimination **circle (flat) vs
 * sphere (solid)**; puppet error-analysis "stacks the sphere"; Day-5
 * "build-and-tell (R)". Catalog row: name sphere/cube/cone/cylinder and compose
 * new shapes from parts, with "what can you build from these?" as the
 * non-computational Day-5 focus.
 *
 * `meta/HANDOFF-2026-08-10-LEVEL-A.md` §5 clears this week as NOT blocked on one
 * condition — `solidChoice` draws no figure, so it must be paired with a
 * pictorial item on Days 1–4. That condition is met, and the shape of the week
 * falls out of it: **the naming and the roll/stack test are text-and-choice, and
 * the pictures are the BUILDING.**
 *
 * WHAT A CHILD NEEDS IN FRONT OF THEM, said plainly because this is the week it
 * matters most: **a ball, a box, a tin and a party hat, on the table, before the
 * screen is opened.** Nothing in the renderer can draw a solid (disclosure 1),
 * so on the naming and testing pages the page asks and the HANDS answer. The
 * grown-ups' strip says so in as many words, and the scaffold note repeats it.
 *
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 *
 *  - **A SOLID IS KNOWN BY WHAT IT DOES, NOT BY WHAT IT LOOKS LIKE.** Push it:
 *    does it roll? Put something on it: does that stay? Those two questions are
 *    the whole apparatus, and they are the only two properties in the week that
 *    a registered transform can re-derive, so they are also the two the software
 *    can prove. Every naming page is settled by a test the child can run, and
 *    the lesson never asks a four-year-old to recognise a silhouette.
 *  - **THE NAME TRAVELS WITH THE SHAPE, NOT WITH THE OBJECT.** A ball is a
 *    sphere and so is an orange; a party hat is a cone and so is a road cone.
 *    That is why the four objects on the buttons are a ball, a box, a can and a
 *    **party hat** rather than "a cone": a page that asks "which one is a cone?"
 *    beside a button reading "the cone" is answered by hearing the question, and
 *    a quarter of every naming draw would have been free (disclosure 3).
 *  - **A DRAWING OF A ROUND THING IS NOT A ROUND THING.** The recipe's
 *    discrimination is circle against sphere, and it is the one place where the
 *    missing renderer is not an obstacle but the point: a circle drawn on the
 *    page cannot be picked up, cannot roll and cannot be stacked, and a ball can
 *    do two of the three. So a drawn shape stands on every test page as an
 *    honest wrong answer, and one question in four asks for it — which is what
 *    keeps any single "odd one out" rule down at chance (disclosures 4 and 5).
 *  - **BUILDING IS COUNTING.** "Compose new shapes from parts" is the catalog's
 *    own second half, and at this band it is a count: how many boxes stand in
 *    the tower, how many pieces of the heap can go in it at all. Those are the
 *    pages that carry the pictures, and every one of them draws only what the
 *    week says is possible — no tower in this pack is ever built out of
 *    something that rolls (disclosure 2).
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail
 *    and `makeWeekBuilder` refuses a Level-A sprint outright.
 *  - **Four pages in nineteen face backwards** — one on each of Days 1–4, from
 *    four earlier weeks in four formats: naming a flat shape by its corners
 *    (A7), finding the group that holds a stated number (A8), counting a drawn
 *    set (A1) and matching two rows one for one (A5). Retrieval is 21.1%. A20 —
 *    the other object-handling week, and the one the brief names as a natural
 *    source — is NOT among them, for two measured reasons in disclosure 8.
 *
 * ── TWELVE DISCLOSURES ──────────────────────────────────────────────────────
 *
 * 1. **THERE IS NO SOLID IN THE RENDERER, AND NOTHING HERE PRETENDS OTHERWISE.**
 *    `figures/types.ts` ships nine primitives and every one of them is flat:
 *    `AngleFigureParams.shape` is 'angle' | 'triangle' | 'quadrilateral' |
 *    'polygon' (so there is not even a CIRCLE, which a07 recorded from the other
 *    side), and the remaining eight draw lines, frames, grids, charts, clocks
 *    and coins. A sphere, a cube, a cylinder and a cone cannot be drawn at all.
 *    So the naming form and the roll/stack test are TEXT AND CHOICE — the ruling
 *    in `HANDOFF-2026-08-10-LEVEL-A.md` §5, applied — and the day's picture is
 *    carried by an item that can be drawn honestly.
 *
 *    That is not a smaller week. It is the correct one: at three to five the
 *    "why" is enacted (FILL-ARCHITECTURE §3), and rolling something is enacted
 *    while looking at a picture of it is not. A drawn cube is a hexagon with
 *    three extra lines, and a four-year-old asked whether *that* rolls has been
 *    asked a question about a drawing.
 *
 *    What IS drawn, and where it comes from: `CountersFig` renders the `ball`
 *    icon as a circle with two seam curves and the `block` icon as a rounded
 *    rectangle with a lid line, and `arrangementFor` maps the word "tower" to
 *    the `stack` layout, which piles one icon above the next. So a tower of
 *    boxes and a heap of balls-and-boxes are both real pictures built from the
 *    item's own numbers. **Recorded for the orchestrator:** a `solid` primitive
 *    taking `{shape: 'sphere'|'cube'|'cylinder'|'cone', count}` would unlock
 *    A21's naming pages, the flat-versus-solid discrimination as a picture, and
 *    B-band net work later; it is the single largest content gap this week met.
 *
 * 2. **NO TOWER IN THIS PACK IS BUILT OUT OF SOMETHING THAT ROLLS, AND THAT IS
 *    ENFORCED IN CODE RATHER THAN REMEMBERED.** The `stack` layout will happily
 *    pile ball icons into a column, and a page that draws a tower of balls while
 *    the week teaches that a ball rolls off a pile is the L27 class exactly — a
 *    picture disagreeing with its own lesson. `towerOf` is the only route to a
 *    stacked figure in this file and it throws unless the noun it is handed
 *    belongs to a solid whose `stacks` flag is true. It runs at module load
 *    (against the drawing nouns) and on every draw, so the 200-seed sweep is the
 *    enforcement point.
 *
 * 3. **THE FOURTH OBJECT IS A PARTY HAT, AND THAT ONE WORD DECIDED THE WHOLE
 *    NAMING DEAL.** Three of the four solids have an everyday name that differs
 *    from the shape name — ball/sphere, box/cube, can/cylinder — and the fourth
 *    does not: a cone is called a cone. Built the obvious way, a naming page
 *    keyed on it reads "Tap the cone" over a button saying "the cone", so on a
 *    quarter of draws the answer is the word the question just said, in BOTH
 *    directions of the form. Two repairs were rejected before this one: dropping
 *    the cone from the naming slot makes it a permanently unkeyable card there
 *    (L38), and keeping it and shrugging leaves a measurable free draw. Naming
 *    the object a **party hat** removes the coincidence and is better content
 *    besides — the shape name has to travel to a new object, which is what
 *    naming a solid IS. Measured: no option word appears anywhere in its own
 *    item's question, on any slot, at any seed (the report carries the scan).
 *
 *    The price is paid where it is cheapest: `a_solid_v1` re-derives its truth
 *    from a private `SOLID_PROPS` table keyed on 'cone', so a page keyed on the
 *    party hat lists `cone` in `answer.acceptableForms` — which is honest on its
 *    own terms (a child who answers "the cone" is right) and is what QG-11's
 *    whole-value match reads.
 *
 * 4. **THE FIRST BUILD KEPT THE ANCHOR AND THE DISCRIMINATION APART, AND
 *    MEASURING KILLED IT.** Two generators: a stack test over the four solids
 *    (key uniform over four, both polarities, every card keyable) and a separate
 *    flat-against-solid page (key alternating between the drawings and the
 *    things, every card keyable). Both were honest and both passed every
 *    strategy in the required list — always-largest, always-first-card, always
 *    the round one, always the same solid, all inside a point of a third.
 *
 *    And both were three cards drawn from a pool holding exactly TWO classes, so
 *    on every single draw the answer was the card that was not like the other
 *    two. Measured over 600 packs: "take the odd one out" scored 62.9% across
 *    the mastery form and would have certified **20.6%** of children. It is not
 *    quite a blind strategy — the child has to know which words name drawings
 *    and which name things — but it answers the page without hearing which
 *    question was asked, and a bar of 5% is a bar.
 *
 * 5. **THE REPAIR IS A THIRD CLASS ON EVERY PAGE, AND IT ALSO RESTORES THE ROLL
 *    TEST.** Of the four solids, three roll and one does not, so "which one
 *    rolls?" has exactly ONE honest wrong solid — the box — and the first build
 *    recorded it as unbuildable at three cards. Both problems have the same
 *    answer, and the week already owned it: **a circle drawn on the page neither
 *    rolls nor stacks nor can be held**, so it is an honest wrong card for a
 *    property question, and it puts a third class on the page.
 *
 *    So `theTest` asks four questions off one seven-card pool — roll, stack,
 *    roll-off, and drawn-flat — and every page mixes a drawing with two solids
 *    or a solid with a drawing and another solid. Every one of the seven cards
 *    is keyed on some draw of the slot. Three of the four questions register
 *    `a_solid_v1` with the test they actually ask; the flat branch carries no
 *    generator, and QG-4 compares mastery templateIds only when both slots have
 *    one, so a property draw beside a flat draw is not a mismatch.
 *
 *    TWO CHOICES IN THERE ARE FIXED RATHER THAN DRAWN, and they are the whole of
 *    what makes the third class pay. The roll-off question always offers the CAN
 *    as its solid wrong card, and the drawn-flat question always offers the BOX.
 *    Without them, "always take the one that rolls" would be right on its own
 *    question (unavoidable), on half of roll-off and on half of flat — 50%.
 *    Pinned, each of the three class rules is right on exactly its own quarter.
 *    Measured over 600 packs on the mastery form: flat-vs-solid 32.2%,
 *    stacks-vs-not 42.0%, rolls-vs-not 31.4%, and the three-way form of the same
 *    idea 42.9% — certifying 1.6%, 3.4%, 0.8% and 4.1%, all under the bar,
 *    against 20.6% before.
 *
 *    The residue is honest and stated: the PUPPET's page still draws its three
 *    cards from two classes, because a puppet who stacks a sphere has to be
 *    offered solids. One such slot in a six-slot form is what the arithmetic
 *    allows — two would put "odd one out" back over 10% — so the puppet is the
 *    only one, and the two others were removed by merging rather than by
 *    dropping content.
 *
 * 6. **THE PUPPET GETS THREE THINGS WRONG, AND EACH ONE IS THERE TO UNPIN
 *    SOMETHING.** Row A21's puppet "stacks the sphere". Built literally — Pip
 *    stacks the ball, the child taps what Pip should have used — the key can
 *    only ever be the box or the can, so the ball and the party hat are offered
 *    on every draw and keyed on none, and "not the one Pip just named" turns a
 *    three-card page into a coin flip (a08's finding, inherited). And even
 *    repaired that far it stayed a two-class page, which disclosure 5 measures
 *    as the thing that certifies a card-sorter. So the slip rotates three ways:
 *      · Pip's tower keeps falling down, no piece named — tap the one that will
 *        stack (key: box or can; the wrong cards are one non-stacker and one
 *        drawn shape, and neither is eliminable, because nothing was named);
 *      · Pip put the ball on the pile and it rolled off — tap the one that will
 *        roll off too (key: the OTHER non-stacker; the wrong cards are the can
 *        and a drawn shape, and Pip's own piece is barred because it is already
 *        known to roll off and would be a second true answer);
 *      · Pip filled a bag with solid things and one of them is only a drawing —
 *        tap the drawing (key: circle, square or triangle; the wrong cards are
 *        the box and a roller). This is the recipe's own discrimination arriving
 *        as a puppet slip, and it is what makes the flat words keyable in this
 *        slot rather than decoration in it.
 *    Across the slot the key covers all four solids AND all three drawn shapes,
 *    every card is keyable, and every page carries three classes. The two fixed
 *    cards — the can on the second branch, the box on the third — do the same
 *    job here as in `theTest`. `a_solid_v1` pins the first two branches —
 *    `test: 'stacks'`, then `test: 'rolls'` — and it is a real re-derivation
 *    rather than
 *    an echo: the transform looks the solid up in a table this file cannot see
 *    and THROWS if the keyed solid does not actually pass the named test.
 *
 *    The word "wrong" never appears; Pip's tower keeps falling down, and the
 *    child fixes it.
 *
 * 7. **THE NAMING TRUTH CANNOT BE REGISTERED, SO THE NAMING PAGES CARRY NO
 *    GENERATOR AND A LOCAL CROSS-CHECK INSTEAD.** `EARLYNUMBER_TEMPLATE_DEFS`
 *    holds one solid transform, `a_solid_v1`, and it answers exactly one
 *    question: does this named solid pass this named test. There is nothing that
 *    maps a shape name to an object or back. Three routes were considered and
 *    rejected in kit §E2.3 order: registering `a_solid_v1` on a naming page with
 *    a `test` the page never asks about (true metadata describing the wrong
 *    question); smuggling the shape name into `acceptableForms` so a pin goes
 *    green while proving nothing (the hole a08 recorded); and inventing a
 *    templateId, which silently skips the audit altogether. So `nameTheSolid`
 *    ships with no `generator`, exactly as a08's `whereDoesItSit` does.
 *
 *    In its place, and stated for what it is: **two independently written tables
 *    that must agree.** `SOLIDS` carries the shape name beside the object;
 *    `SHAPE_OF` is written separately from the object to the shape name;
 *    `assertNaming` throws at module load and again on every draw if they
 *    disagree, or if a keyed card is not the object the question names. That is
 *    a consistency check, not a proof — the honest description — and it would
 *    still catch the edit that swapped a row. **Recorded for the orchestrator:**
 *    an `a_solid_name_v1` taking `{thing}` and returning `{correct: <shape>}`,
 *    six lines beside `a_solid_v1`, would make the corpus's own audit cover the
 *    computational focus the catalog names for this cell.
 *
 * 8. **`solidChoice` IS MEASURED AND NOT USED, AND BOTH HALVES OF THAT ARE
 *    DELIBERATE.** The shipped generator is the right idea and cannot certify a
 *    band-A slot as it stands, for two reasons that are independent of each
 *    other:
 *      · **It offers TWO cards.** `makeChoices(r, correct, [oneWrong])` returns
 *        a two-button page, and a two-button page at band A is a coin flip — the
 *        L53 line a08 drew for `numeralTrap` and the brief repeats.
 *      · **On the `rolls` test its wrong card can never move.** It picks the key
 *        from `SOLIDS.filter(s => s[test])` and the wrong card from the
 *        complement, and only ONE of the four solids fails the roll test, so the
 *        wrong card is the box on 100% of `rolls` draws while the key rotates
 *        over three. Measured over 6,000 draws per test, served: on `rolls` the
 *        key is ball/can/cone at 33.9/33.6/32.6% and the wrong card is the box
 *        at 100.0%; on `stacks` the key is box/can at 50.5/49.5% and the wrong
 *        card is ball/cone at 49.7/50.3%. Both variants deal exactly 2.00 cards
 *        a page. Reported to the orchestrator, not fixed here: a `lib/` file
 *        belongs to the orchestrator.
 *    `theTest` below is the local rebuild — three authored cards, four
 *    polarities, every card keyable — and it keeps the family's contract by
 *    registering the same `a_solid_v1` pin on the three property branches.
 *
 *    **AND `compareMeasure` IS WHY A20 IS NOT A WARM-UP HERE, WHICH IS A CALL
 *    AGAINST THE BRIEF'S OWN SUGGESTION AND IS MADE ON MEASUREMENT.** A20 has
 *    exactly one library generator, and it fails this week twice:
 *      · `{attr: 'capacity'}` NAMES A VESSEL AFTER ITS OWN UNIT. Its pool is
 *        jug/mug, pot/cup, bucket/bowl and its unit is `cups`, so one draw in
 *        three prints "the pot fills 5 cups, the cup fills 8 cups" — a cup that
 *        holds eight cups. Served: 33.3% of capacity draws name the cup, and on
 *        every one of them the scene is an absurdity a five-year-old would be
 *        right to object to. This is `lib/earlynumber.ts`'s own recorded rule —
 *        "NEVER name a thing after the attribute the item asks about", written
 *        into the `length` pool after a19 measured it — not applied to
 *        `capacity`. **Reported for the orchestrator, not fixed.**
 *      · `{attr: 'weight'}` draws its pair from bag/ball, book/leaf and
 *        rock/feather and measures in `blocks`, so a third of its draws put "the
 *        ball" on a card and every draw builds its picture out of block icons —
 *        which are the drawn boxes this week teaches with. A group of drawn boxes
 *        labelled "ball", in the week that separates a ball from a box, is worse
 *        than no retrieval at all.
 *    Both variants also ship TWO cards. A5's row-matching page is used instead:
 *    it is three-carded, it collides with nothing here, and one-for-one matching
 *    is what "how many of these can go in the tower" ends in.
 *
 * 9. **NO NUMBER AN ALT SPEAKS IS EVER THAT ITEM'S KEY, PROVED AT LOAD AND
 *    AGAIN AT DRAW TIME (L48).** At band A the picture's accessible name is
 *    autoplayed BEFORE the question (`speakablePrompt` prefers it over the
 *    authored bracket), so a number inside it is the answer read aloud to a
 *    child who cannot read the alternative. Every alt this file writes goes
 *    through `alt()`, which throws at module load on a digit or on any of
 *    zero–twenty, the tens names, hundred, and the numbers that travel in
 *    disguise (once, twice, single, double, twin, pair, couple, both, dozen,
 *    half). The absolute form is the right one HERE and only because of what
 *    this week's pictures are for: every drawn page keys a COUNT of what is
 *    drawn, so any number the alt could honestly offer is the answer.
 *
 *    The other half is the rule as the brief actually states it, and it has to
 *    be conditional, because four of the pack's generators are assembled inside
 *    `lib/` where this file cannot see their strings. `spokenSafe` recomputes
 *    the item's OWN key set on every draw and refuses only an overlap — so
 *    A20's warm-up may keep saying "both measured in cups", which is the one
 *    fact a child who cannot see the picture needs and which no draw of that
 *    page can ever key, while an alt that spoke this page's own count would
 *    throw. The `[image: …]` brackets keep their numbers: `promptText` strips
 *    them, the figure's own name beats them in `speakablePrompt`, and they are
 *    what QG-1 and QG-4 sign to keep operand surfaces fresh.
 *
 * 10. **THE PAGES WITH NO NUMBERS HAD TO BE MADE DISTINCT BY HAND, BECAUSE THE
 *     PACK GUARD CANNOT SEE THEM.** `drawUniqueItem` signs an item on the
 *     numeric tokens of its prompt and returns "zero-token prose items … accepted
 *     as-is" — and eleven of this week's fifteen core pages carry no number at
 *     all. Two things follow. The validator's own QG-4 asserts
 *     `formB[i].prompt !== formA[i].prompt`, which nothing would have
 *     guaranteed; and, worse for the child, a07 measured that identical
 *     sentences on one day pass every gate in the stack. So every text page's
 *     visible sentence is registered in the pack's shared `TupleGuard` by
 *     `freshLine`, which walks two stems across the eight-name pool and takes
 *     the first line the pack has not already used. It draws its starting point
 *     once and then walks deterministically, so it consumes a fixed number of
 *     rng values however many candidates it rejects (kit §E2.4) — a redraw loop
 *     here would have made every later page in the pack depend on this one.
 *     Measured over 500 packs: 0 duplicate visible prompts anywhere in a pack,
 *     and 0 Form-A/Form-B collisions.
 *
 * 11. **SEVEN LOCAL GENERATORS, EACH NAMING THE FAMILY GAP IT FILLS.**
 *     `nameTheSolid` — the family has no generator that maps a shape name to an
 *     object or back, which is the catalog's own computational focus for this
 *     cell (disclosure 7). `theTest` — `solidChoice` ships two cards and a frozen
 *     wrong card (disclosure 8), and nothing in the family contrasts a drawing
 *     with a thing at all; `shapeName` and `shapeCorners` are about flat shapes
 *     only, which is A7's week. `puppetPile` — `PuppetSlip` is
 *     a closed union of double-count, skip-count, count-back-start and
 *     teen-writing, and stacking a sphere is none of them. `towerCount` —
 *     `countArrangement` counts a row and validates `exact-numeric`, which at
 *     band A is a keyboard (L53); this counts a STACK and authors its cards.
 *     `heapParts` and `planTheBuild` — the family's word problems join and take
 *     away, and this week has taught neither; what it has taught is that only
 *     some pieces can go in a tower. `buildAndTell` — `sortAndTell` sorts drawn
 *     groups by how many, and Friday here is a child with objects in their
 *     hands. Each keeps the family's contract: a resolvable templateId wherever
 *     one honestly exists, a picture built by `lib/figures` from the item's own
 *     values, quantities through `lib/format`, and an `authorMeta` stamp.
 *
 * 12. **WHAT READING THE GENERATED WEEK FOUND, AND WHAT THE SCAN FOUND.**
 *     Reading: the first build asked "How many boxes?" on both of the drawn
 *     pages, so a child met one sentence twice on Day 2 with only the picture
 *     changed — fixed by giving each drawn form two stems of its own, which
 *     `freshLine` then rotates. It also had the puzzle asking a child to "tap"
 *     a number on a surface with no buttons: `Puzzle` carries no `choices`
 *     field, so its answer is typed however it is worded, and the wording now
 *     admits that rather than promising a tap. **Recorded for the orchestrator:**
 *     a `choices` field on `Puzzle` is what a pre-reader band needs; it is a
 *     schema limit, not a content one, and a19 recorded it independently.
 *
 *     Two more that only reading found, both in the `[image: …]` brackets that
 *     no gate and no child ever sees. The heap pages printed their two counts in
 *     a fixed "balls and boxes" order while the picture drew whichever group the
 *     draw put first, so the scene direction described a board that was not the
 *     board; it now follows the drawn order. And the Day-4 story handed a child
 *     "5 balls and 2 boxes in a box of parts" — one word for two things, on the
 *     one page whose whole question is which pieces are boxes. It is a basket
 *     now.
 *
 *     The scan: the strongest attractor was **a07**, the same geometry thread
 *     one week-family over, and after re-voicing what survives is house
 *     boilerplate every A week ships (the band-A `scaffoldNotes` preamble, the
 *     `isomorphNotes` opener) and the shared library call shapes. The full
 *     token-overlap table is in the report.
 */

import type { ErrorTag } from '../../../types';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  howManyChoice,
  setForNumeral,
  shapeName,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsParam, counterGroups, counters } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn per page; nothing below hardcodes a name that is also in the pool (kit §F.3). */
const NAMES = ['Ilse', 'Nero', 'Oyin', 'Sabra', 'Wilbur', 'Thandi', 'Emrys', 'Lotta'] as const;

// ---------------------------------------------------------------------------
// The sentence law, counted the way the GATE counts it
//
// `earlynumber`'s own `ask()` weighs a whole prompt at once, so a three-sentence
// puppet page trips a ceiling it never really breaks, and nothing anywhere caps
// a hint rung or a step in a worked example. `bb-readability-test` walks one
// SENTENCE at a time across every surface a child hears. Its splitter and its
// counter are mirrored here, and every authored line is pushed through them, so
// an eleventh word throws at module load or at draw time instead of surviving to
// a reviewer.
//
// A picture's accessible name is not capped here: it is the whole of what a child
// who cannot see the drawing has instead of it, and buying brevity by describing
// less is the wrong trade. It carries a stricter rule of its own below.
// ---------------------------------------------------------------------------

const SENTENCE_CEILING = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > SENTENCE_CEILING) {
      throw new Error(`A21: a band-A sentence runs to ${String(n)} words (ceiling ${String(SENTENCE_CEILING)}): "${sentence}"`);
    }
  }
  return text;
}

/** `[image: scene] question` — the bracket feeds the freshness guard, the question is spoken. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Help rungs, measured. Nothing here names a child, a piece or a quantity. */
function rungs(...steps: string[]): string[] {
  return steps.map(say);
}

// ===========================================================================
// WHAT A PICTURE IS CALLED  (disclosure 9)
// ===========================================================================

/**
 * Numbers that reach an ear without a digit, including the ones in disguise: a
 * pre-reader hears no difference between "a pair" and "two".
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
 * A picture name written by this file, held to the ABSOLUTE rule.
 *
 * The binding rule is the conditional one — no number an alt speaks may equal
 * that item's key — and `spokenSafe` enforces exactly that where the alt
 * arrives. This stricter gate governs the strings written here because for every
 * one of them the absolute rule is also the right one: each drawn page in this
 * week keys a COUNT of what is drawn, so there is no number an alt could
 * honestly offer that is not the answer. Using none costs a child who cannot see
 * the picture nothing at all, which is the test FILL-AGENT-BRIEF §2a sets.
 */
function alt(text: string): string {
  if (/\d/.test(text)) {
    throw new Error(`A21 alt: a digit is played ahead of the question in "${text}"`);
  }
  const heard = heardNumbers(text);
  if (heard.length > 0) {
    throw new Error(`A21 alt: the number ${String(heard[0])} is played ahead of the question in "${text}"`);
  }
  return text;
}

/** Every value this draw would accept as correct — one item's key set. */
function keySet(draft: ItemDraft): number[] {
  const keyed = draft.choices?.find((c) => c.isCorrect)?.text;
  const surfaces = [
    ...(keyed === undefined ? [draft.answer.value] : [keyed]),
    ...(draft.answer.acceptableForms ?? []),
  ];
  return surfaces.flatMap(heardNumbers);
}

/**
 * THE RULE AS THE BRIEF STATES IT, checked where an alt ARRIVES rather than
 * where it was written.
 *
 * The load-time guard above covers this file's own strings. This is the other
 * half, and it has to be conditional: four of the pack's generators are built
 * inside `lib/`, and one of them says a number word on purpose. A20's warm-up
 * names its picture "the jug beside the mug, both measured in cups" — "both" is
 * a two to any tokenizer — and that page keys an OBJECT, so no draw of it can
 * have two for an answer. Banning the word outright would strip the one fact a
 * blind child needs, which is precisely the trade the brief records as having
 * been made once and reverted.
 *
 * So this computes the item's own key set on every draw and refuses only an
 * overlap. It throws rather than warns, which makes the rule an invariant of the
 * week instead of an intention of its author.
 */
function spokenSafe(base: ItemGen, who: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (draft.figure) {
      const keys = new Set(keySet(draft));
      const clash = heardNumbers(draft.figure.alt).find((v) => keys.has(v));
      if (clash !== undefined) {
        throw new Error(
          `A21 spokenSafe(${who}): the picture's name says ${String(clash)}, which is this draw's own answer: "${draft.figure.alt}"`,
        );
      }
    }
    return draft;
  };
}

/**
 * Give a generator help written for THIS week without reaching into `lib/`.
 *
 * A ladder may appear at most twice across the fifteen non-retrieval core pages,
 * which puts a floor of eight distinct ladders under the week and made the
 * ladder count a design input rather than an afterthought (kit §E, A-band lesson
 * 1); thirteen are shipped. The arithmetic is only half of it — the help
 * genuinely differs. A naming page wants "run the test, then say the word"; a
 * stacking page wants "look for a flat face"; a tower wants "start at the floor
 * and climb". None of that could be said in the shared family without saying it
 * in all twenty-four A weeks at once.
 *
 * The closure rewrites one field of an already-built draft and draws no rng, so
 * the prompt QG-1 and QG-4 sign for freshness is untouched.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * A page from a week already finished, served again as the day's opener.
 *
 * Band A sets no minimum on warm-up formats, so nothing obliges these to exist
 * and each has to earn its minute. What decided the four is what handling a
 * solid actually rests on. Naming a flat shape by counting its corners (A7) is
 * the same substitution this week makes one dimension up — the name comes from a
 * property, never from the look. Finding the group a stated numeral names (A8)
 * is sorting by a rule, which is what the roll test is. Counting a drawn set
 * (A1) is what every tower page ends in. And matching two rows one for one (A5)
 * is how a child settles "will these pieces reach?" with no number at all.
 * A20 was the natural fifth and is measured out in disclosure 8.
 *
 * Their help arrives untouched from the week that wrote it, deliberately. A
 * warm-up should sound like where it came from; re-voicing one into this week's
 * register quietly removes what makes it retrieval.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The four solids this week teaches
// ===========================================================================

interface Solid {
  /** The mathematical name — the word the catalog asks this cell to teach. */
  shape: string;
  /** What a four-year-old calls the object, and what a card says. */
  thing: string;
  /** The key `a_solid_v1` looks the properties up under (its own table). */
  registry: string;
  rolls: boolean;
  stacks: boolean;
}

/**
 * Object, shape name and the two test results, in one table.
 *
 * `registry` is the name `lib/earlynumber.ts` keeps privately in `SOLID_PROPS`,
 * and it is separate from `thing` for one solid only: the cone's object is a
 * party hat here (disclosure 3), while the transform knows it as 'cone'.
 */
const SOLIDS: readonly Solid[] = [
  { shape: 'sphere', thing: 'ball', registry: 'ball', rolls: true, stacks: false },
  { shape: 'cube', thing: 'box', registry: 'box', rolls: false, stacks: true },
  { shape: 'cylinder', thing: 'can', registry: 'can', rolls: true, stacks: true },
  { shape: 'cone', thing: 'party hat', registry: 'cone', rolls: true, stacks: false },
];

/**
 * The SECOND table (disclosure 7), written from the object to the shape name and
 * deliberately not derived from `SOLIDS`.
 *
 * Two tables that must agree is what this file has instead of a registered
 * transform for the naming form. It is a consistency check and not a proof, and
 * saying so is the point: it catches the edit that changes one row and forgets
 * the other, which is the failure a single table cannot catch at all.
 */
const SHAPE_OF: Record<string, string> = {
  ball: 'sphere',
  box: 'cube',
  can: 'cylinder',
  'party hat': 'cone',
};

/** Both tables, checked against each other before a single item is drawn. */
(function checkTables(): void {
  const seen = new Set<string>();
  for (const s of SOLIDS) {
    if (SHAPE_OF[s.thing] !== s.shape) {
      throw new Error(`A21: the two name tables disagree about the ${s.thing}`);
    }
    if (seen.has(s.shape) || seen.has(s.thing)) {
      throw new Error(`A21: "${s.shape}" or "${s.thing}" is listed twice`);
    }
    seen.add(s.shape);
    seen.add(s.thing);
    // Disclosure 3: no shape name may sit inside its own object word, or a
    // question naming one hands over the card naming the other.
    if (s.thing.includes(s.shape) || s.shape.includes(s.thing)) {
      throw new Error(`A21: the word "${s.shape}" gives away the card "${s.thing}"`);
    }
  }
  if (Object.keys(SHAPE_OF).length !== SOLIDS.length) {
    throw new Error('A21: the two name tables are different lengths');
  }
})();

const card = (s: Solid): string => `the ${s.thing}`;

/** The stackers and the rollers-off, computed rather than typed (disclosure 5). */
const STACKERS = SOLIDS.filter((s) => s.stacks);
const ROLLERS_OFF = SOLIDS.filter((s) => !s.stacks);

/**
 * Flat shapes: things you draw, never things you hold.
 *
 * Only these three, and each is the flat cousin of a solid the week teaches — a
 * circle to the sphere, a square to the cube, a triangle to the cone seen from
 * the side. That pairing is the discrimination's whole content, and it is why
 * the pool is not padded with a pentagon nobody has a solid for.
 */
const FLATS = ['circle', 'square', 'triangle'] as const;

const flatCard = (f: string): string => `the ${f}`;

/**
 * REFUSE TO EMIT A NAMING PAGE WHOSE CARD AND QUESTION HAVE DRIFTED APART.
 *
 * Runs on every draw of every naming item at every seed, so a table edit that
 * made a question disagree with its key fails the 200-seed sweep rather than
 * shipping green (disclosure 7).
 */
function assertNaming(question: string, keyed: string, thing: string, shape: string): void {
  if (SHAPE_OF[thing] !== shape) {
    throw new Error(`A21: "${thing}" is not a ${shape} in the second table`);
  }
  if (keyed !== `the ${thing}` && keyed !== shape) {
    throw new Error(`A21: the keyed card "${keyed}" names neither the ${thing} nor the ${shape}`);
  }
  if (question.toLowerCase().includes(keyed.toLowerCase().replace(/^the /, ''))) {
    throw new Error(`A21: the question already says the keyed word "${keyed}"`);
  }
}

// ===========================================================================
// Pictures — and the one law they all obey  (disclosure 2)
// ===========================================================================

/** Which drawing noun stands for which solid. Only these two can be drawn. */
const DRAWN_AS: Record<string, string> = { balls: 'ball', blocks: 'box' };

/** The card word for a drawing noun, so a picture and a button agree. */
const PIECE_WORD: Record<string, string> = { balls: 'balls', blocks: 'boxes' };

/** True when the solid a drawing noun stands for can be stacked. */
function stacksAsDrawn(noun: string): boolean {
  const thing = DRAWN_AS[noun];
  const solid = SOLIDS.find((s) => s.thing === thing);
  if (!solid) throw new Error(`A21: nothing is drawn as "${noun}"`);
  return solid.stacks;
}

/**
 * A tower. THE ONLY ROUTE TO A STACKED FIGURE IN THIS FILE, and it throws unless
 * the thing being piled up can actually be piled up (disclosure 2).
 *
 * `pin` is off by default, and that default is a schema fact rather than a
 * preference: a lesson script segment carries no answer and no params, and a
 * guided example is audited against its ANSWER alone (`validator.ts` passes
 * `{answer: [g.answer]}` and nothing else). An assertion on either would set
 * QG-13 comparing an honest picture against a surface with nothing to compare
 * it to. It is turned on for assessed items, where `generator.params.n` exists
 * and QG-13 can prove the drawn tower really holds the count the item keys.
 */
function towerOf(n: number, noun: string, altText: string, pin = false): BBFigure {
  if (!stacksAsDrawn(noun)) {
    throw new Error(`A21: a tower of ${noun} is a picture of something the week says cannot happen`);
  }
  return counters(n, noun, {
    arrangement: 'in a tower',
    alt: alt(altText),
    ...(pin ? { asserts: assertsParam('n') } : {}),
  });
}

/** Loose pieces tipped out side by side — the heap a build starts from. */
function heapOf(
  groups: ReadonlyArray<{ count: number; noun: string }>,
  keyIndex: number,
  altText: string,
): BBFigure {
  return counterGroups(
    groups.map((g) => ({ count: g.count, noun: g.noun, label: PIECE_WORD[g.noun] })),
    { arrangement: 'in a row', alt: alt(altText), asserts: assertsParam('n', `group:${String(keyIndex)}`) },
  );
}

// Both tower nouns are checked before a single pack is built.
(function checkDrawing(): void {
  for (const noun of Object.keys(DRAWN_AS)) {
    if (!(noun in PIECE_WORD)) throw new Error(`A21: "${noun}" has no card word`);
  }
  if (!stacksAsDrawn('blocks')) throw new Error('A21: the drawn box has stopped stacking');
  if (stacksAsDrawn('balls')) throw new Error('A21: the drawn ball has started stacking');
})();

// ===========================================================================
// Sentences a pack never repeats  (disclosure 10)
// ===========================================================================

/**
 * Take the first phrasing of this question the pack has not already used.
 *
 * Eleven of the fifteen core pages carry no number, so `drawUniqueItem` signs
 * them null and never guards them: without this, Form B could re-ask Form A's
 * sentence word for word (which the validator's QG-4 blocks outright) and a
 * child could meet the same sentence twice on one day (which nothing blocks at
 * all — a07 measured it).
 *
 * Two rng values are drawn, once, before the walk: where in the name pool to
 * start and which stem to try first. The walk itself is deterministic, so the
 * number of rng values consumed does not depend on how many candidates are
 * rejected — which is what keeps every later page in the pack independent of
 * this one (kit §E2.4).
 */
function freshLine(r: Rng, guard: TupleGuard, make: (stem: number, who: string) => string): string {
  const start = r.int(0, NAMES.length - 1);
  const firstStem = r.int(0, 1);
  for (let s = 0; s < 2; s++) {
    for (let k = 0; k < NAMES.length; k++) {
      const line = make((firstStem + s) % 2, NAMES[(start + k) % NAMES.length]);
      if (!guard.taken(`a21:line|${line}`)) {
        guard.add(`a21:line|${line}`);
        return line;
      }
    }
  }
  const fallback = make(firstStem, NAMES[start]);
  guard.add(`a21:line|${fallback}`);
  return fallback;
}

// ===========================================================================
// The card deal, for the three-of-a-pool forms
// ===========================================================================

/**
 * Two other solids to stand beside the truth, drawn without replacement.
 *
 * The naming forms run over all four solids, so the deal is simply "any two of
 * the other three" — every card is a solid this same slot keys on other draws,
 * and `makeChoices` shuffles the buttons, so no card sits at a fixed seat. There
 * is no numeric rank to rotate here: a shape name has no size, which is exactly
 * why the naming pages are the ones no arithmetic reflex can touch.
 */
function twoOthers(r: Rng, keep: Solid): Solid[] {
  return r.shuffle(SOLIDS.filter((s) => s.thing !== keep.thing)).slice(0, 2);
}

// ===========================================================================
// Local generator 1 — name the solid, in both directions
// ===========================================================================

/**
 * Match a shape name to an object, or an object to its shape name.
 *
 * `toObject` says the mathematical word and offers three objects; `toName` says
 * the object and offers three shape names. Both key uniformly over the four
 * solids, and `assertNaming` refuses any draw whose question already contains
 * its own answer — which is the check disclosure 3 exists for and the reason the
 * cone's object is a party hat.
 *
 * No `generator`: the registry has no shape-name transform (disclosure 7), and
 * an unregistered id would silently skip the audit rather than fail it.
 */
function nameTheSolid(opts: { direction: 'toObject' | 'toName' }): ItemGen {
  const { direction } = opts;
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const solid = r.pick(SOLIDS);
      const [a, b] = twoOthers(r, solid);
      const toObject = direction === 'toObject';
      const { choices, correctKey } = makeChoices(
        r,
        toObject ? card(solid) : solid.shape,
        [a, b].map((other, i) => ({
          text: toObject ? card(other) : other.shape,
          errorTag: (i === 0 ? 'representation-misread' : 'concept-misconception') as ErrorTag,
          rationale:
            i === 0
              ? `That name belongs to the ${other.thing}, which is a ${other.shape}.`
              : `Matched by a passing look; the ${other.thing} answers the two tests differently.`,
        })),
      );
      const keyed = choices.find((c) => c.isCorrect)?.text ?? '';
      const question = freshLine(r, guard, (stem, who) =>
        toObject
          ? stem === 0
            ? say(`${who} needs a ${solid.shape}. Tap the ${solid.shape}.`)
            : say(`Which one is a ${solid.shape}? Tap it for ${who}.`)
          : stem === 0
            ? say(`${who} holds the ${solid.thing}. Tap its shape name.`)
            : say(`${who} picks up the ${solid.thing}. What shape is it?`),
      );
      assertNaming(question, keyed, solid.thing, solid.shape);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: question,
        choices,
        answer: {
          value: correctKey,
          acceptableForms: toObject ? [card(solid), solid.thing] : [solid.shape],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        hintLadder: rungs('Run both tests on it before you choose.', 'Give it a push, then rest something on top.'),
        errorTags: ['representation-misread', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'name-solid' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — the roll / stack / flat test, on one pool
// ===========================================================================

/** Which of the four questions this draw asks. */
type TestPolarity = 'roll' | 'stack' | 'rolloff' | 'flat';

const POLARITIES: readonly TestPolarity[] = ['roll', 'stack', 'rolloff', 'flat'];

/**
 * The two solids the deal below pins by name — and the lookup asserts that each
 * is UNIQUE, not merely present.
 *
 * Both fixed cards in `theTest` and in the puppet rest on there being exactly
 * one solid that will not roll and exactly one that passes both tests. A table
 * edit that added a second of either would leave the code compiling, the sweep
 * green and the balance in disclosure 5 quietly false, so the count is checked
 * at module load rather than assumed from a `find`.
 */
function theOnly(what: string, test: (s: Solid) => boolean): Solid {
  const hits = SOLIDS.filter(test);
  if (hits.length !== 1) {
    throw new Error(`A21: expected exactly one ${what}, the table has ${String(hits.length)}`);
  }
  return hits[0];
}

const THE_BOX = theOnly('solid that will not roll', (s) => !s.rolls);
const THE_CAN = theOnly('solid that both rolls and stacks', (s) => s.rolls && s.stacks);

/**
 * THE WEEK'S ANCHOR AND ITS DISCRIMINATION, ON ONE PAGE — which is not tidiness,
 * it is the only construction that survived measurement (disclosures 4 and 5).
 *
 * The first build kept them apart: a stack test over the four solids, and a
 * separate flat-against-solid page. Both worked, both were honest, and both were
 * three cards drawn from a pool with exactly TWO classes in it, so on every draw
 * the answer was the card that was not like the other two. Measured over 600
 * packs, "take the odd one out" scored 62.9% across the mastery form and would
 * have certified 20.6% of children. Every card was keyable, every solid was
 * keyed a quarter of the time, and none of that mattered: the page could be
 * answered without hearing which question was asked.
 *
 * The repair is to put THREE classes on every page, which needs a third kind of
 * card — and the week already has one. A circle drawn on the page neither rolls
 * nor stacks, so it is an honest wrong answer to a property question AND it is
 * the recipe's own discrimination doing work on every draw rather than on two
 * pages a week. So one generator asks four questions off one seven-card pool:
 *
 *   roll     key: ball, can or party hat · wrongs: the box + a drawn shape
 *   stack    key: box or can             · wrongs: a roller-off + a drawn shape
 *   rolloff  key: ball or party hat      · wrongs: THE CAN + a drawn shape
 *   flat     key: circle, square or triangle · wrongs: THE BOX + a roller-off
 *
 * Every one of the seven cards is keyed on some draw of the slot, so none can be
 * struck out unread. And the two fixed choices — the can on `rolloff`, the box
 * on `flat` — are the whole of what keeps a third fixed rule from paying: without
 * them, "always take the one that rolls" would be right on `roll` (its own
 * question, unavoidable) AND on half of `rolloff` AND on half of `flat`, which is
 * 50%. Pinned, each of the three class rules is right on exactly its own quarter.
 * Measured rates are in the report.
 *
 * `a_solid_v1` is registered on the three property branches with the test that
 * branch actually asks about, so QG-11 looks the solid up in the library's own
 * table and throws if the keyed one does not pass it. The `flat` branch carries
 * no generator: its key is a drawn shape and no registered transform knows one.
 * QG-4 pairs mastery slots on `templateId` only when BOTH carry a generator, so
 * a Form-A property draw beside a Form-B flat draw is not a mismatch.
 */
/**
 * WHICH OF THE FOUR QUESTIONS COMES NEXT, DEALT ONCE PER PACK RATHER THAN DRAWN.
 *
 * Five test pages reach a child in a week — three in the core, one in each
 * mastery form — and drawing the question freely leaves whole packs where the
 * roll test never appears and the same question is asked three times. Worse for
 * the measurement: the balance that makes each class rule land on its own
 * quarter is then true on AVERAGE and false on the page, which is L52 exactly.
 * A per-pack cycle over a shuffled order hands each question out in turn, so
 * every pack meets all four and the fifth page starts the cycle again.
 *
 * One shuffle is drawn, once, the first time a test page is built; every later
 * call only READS the pack's guard, which consumes no rng and so cannot move any
 * other page. Safe to call inside `drawUniqueItem` here because these prompts
 * carry no numeral: their signature is null, the guard never rejects them, and
 * the builder is therefore never re-entered (a19's turn-spending gotcha, checked
 * rather than assumed).
 */
function nextQuestion(r: Rng, guard: TupleGuard): TestPolarity {
  if (!guard.taken('a21:qcycle')) {
    guard.add('a21:qcycle');
    r.shuffle([...POLARITIES]).forEach((q, i) => guard.add(`a21:qorder:${String(i)}=${q}`));
  }
  for (let turn = 0; ; turn++) {
    if (guard.taken(`a21:qturn:${String(turn)}`)) continue;
    guard.add(`a21:qturn:${String(turn)}`);
    const slot = turn % POLARITIES.length;
    for (const q of POLARITIES) {
      if (guard.taken(`a21:qorder:${String(slot)}=${q}`)) return q;
    }
    return POLARITIES[slot];
  }
}

function theTest(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const polarity = nextQuestion(r, guard);
      const rollers = SOLIDS.filter((s) => s.rolls);
      let keyText: string;
      let forms: string[];
      let firstWrong: string;
      let secondWrong: string;
      let pin: { name: string; test: 'rolls' | 'stacks' } | null;
      let whyFirst: string;
      let whySecond: string;

      if (polarity === 'flat') {
        const shape = r.pick([...FLATS]);
        keyText = flatCard(shape);
        forms = [flatCard(shape), shape];
        // Fixed at the box, so "take whatever rolls" cannot pay here.
        firstWrong = card(THE_BOX);
        const roller = r.pick(ROLLERS_OFF);
        secondWrong = card(roller);
        pin = null;
        whyFirst = `The ${THE_BOX.thing} is a thing with an inside; you can lift it off the table.`;
        whySecond = `The ${roller.thing} would roll off the paper, so it was never on it.`;
      } else if (polarity === 'roll') {
        const key = r.pick(rollers);
        keyText = card(key);
        forms = [card(key), key.thing, key.registry];
        firstWrong = card(THE_BOX);
        const shape = r.pick([...FLATS]);
        secondWrong = flatCard(shape);
        pin = { name: key.registry, test: 'rolls' };
        whyFirst = `Every side of the ${THE_BOX.thing} is flat, so a push only slides it.`;
        whySecond = `A ${shape} is drawn on the page; a drawing cannot travel anywhere.`;
      } else if (polarity === 'stack') {
        const key = r.pick(STACKERS);
        keyText = card(key);
        forms = [card(key), key.thing, key.registry];
        const roller = r.pick(ROLLERS_OFF);
        firstWrong = card(roller);
        const shape = r.pick([...FLATS]);
        secondWrong = flatCard(shape);
        pin = { name: key.registry, test: 'stacks' };
        whyFirst = `The ${roller.thing} curves away at the top, so the next piece slides straight off.`;
        whySecond = `A ${shape} is drawn on the page; nothing at all can be rested on it.`;
      } else {
        const key = r.pick(ROLLERS_OFF);
        keyText = card(key);
        forms = [card(key), key.thing, key.registry];
        // Fixed at the can, mirroring the box on `flat`.
        firstWrong = card(THE_CAN);
        const shape = r.pick([...FLATS]);
        secondWrong = flatCard(shape);
        pin = { name: key.registry, test: 'rolls' };
        whyFirst = `Stood on its flat end the ${THE_CAN.thing} stays exactly where it is put.`;
        whySecond = `A ${shape} is drawn on the page and never joined the pile at all.`;
      }

      const { choices, correctKey } = makeChoices(r, keyText, [
        { text: firstWrong, errorTag: 'concept-misconception' as ErrorTag, rationale: whyFirst },
        { text: secondWrong, errorTag: 'representation-misread' as ErrorTag, rationale: whySecond },
      ]);
      const question = freshLine(r, guard, (stem, who) => {
        if (polarity === 'roll') {
          return stem === 0
            ? say(`${who} pushes each one along the floor. Tap the one that rolls.`)
            : say(`${who} wants a piece that will roll away. Tap it.`);
        }
        if (polarity === 'stack') {
          return stem === 0
            ? say(`${who} is building a tower. Tap the one that will stack.`)
            : say(`${who} needs one more piece. Tap the one that will stack.`);
        }
        if (polarity === 'rolloff') {
          return stem === 0
            ? say(`${who} puts one on the pile. Tap the one that rolls off.`)
            : say(`${who} needs the pile to stay up. Tap the one that rolls off.`);
        }
        return stem === 0
          ? say(`${who} looks for a drawing. Tap the one drawn on paper.`)
          : say(`${who} could not lift one of these. Tap the flat one.`);
      });
      const draft: ItemDraft = {
        type: 'classification',
        prompt: question,
        choices,
        answer: { value: correctKey, acceptableForms: forms, validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        ...(pin ? { generator: { templateId: 'a_solid_v1', params: { name: pin.name, test: pin.test }, seed: r.uint() } } : {}),
        hintLadder: rungs('Try the piece two ways before you answer.', 'Push it once, then rest something on its top.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        // Flagged on the SLOT rather than on this draw's polarity, so the §6.3
        // gate reaches the same verdict at every seed. It is true of every draw:
        // a drawn shape stands beside solids on the page whichever question is
        // asked, and telling them apart is the recipe's own discrimination.
        authorMeta: { stepCount: 1, cognitiveOp: 'test-solid', isDiscrimination: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — help the puppet, whose tower keeps falling
// ===========================================================================

/**
 * Row A21's puppet-EA, built so its key moves over all four solids
 * (disclosure 6).
 *
 * Branch 'falls' names no piece at all — Pip's tower keeps collapsing — so the
 * two non-stackers are honest cards that nothing in the prompt eliminates, and
 * the key is the box or the can. Branch 'rolled' names Pip's piece and asks
 * which of the others will do the same, so the key is the remaining non-stacker
 * and the two stackers are the wrong cards; Pip's own piece is barred from the
 * cards there because it is already known to roll off and would be a second true
 * answer, not a distractor.
 *
 * The word "wrong" never appears, and the puppet is never "a student".
 */
function puppetPile(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const named = r.pick(ROLLERS_OFF);
      const slip = (['falls', 'rolled', 'drawing'] as const)[r.int(0, 2)];
      const shape = r.pick([...FLATS]);
      let keyText: string;
      let forms: string[];
      let firstWrong: string;
      let secondWrong: string;
      let whyFirst: string;
      let whySecond: string;
      let pin: { name: string; test: 'rolls' | 'stacks' } | null;

      if (slip === 'falls') {
        const key = r.pick(STACKERS);
        keyText = card(key);
        forms = [card(key), key.thing, key.registry];
        const roller = r.pick(ROLLERS_OFF);
        firstWrong = card(roller);
        secondWrong = flatCard(shape);
        whyFirst = `Every side of the ${roller.thing} curves away, so the piece above it slides off.`;
        whySecond = `A ${shape} is drawn on the page; it was never in the pile to begin with.`;
        pin = { name: key.registry, test: 'stacks' };
      } else if (slip === 'rolled') {
        const key = ROLLERS_OFF.filter((s) => s.thing !== named.thing)[0];
        keyText = card(key);
        forms = [card(key), key.thing, key.registry];
        // Fixed at the can, so "take whatever rolls" cannot pay on this branch.
        firstWrong = card(THE_CAN);
        secondWrong = flatCard(shape);
        whyFirst = `Stood on its flat end the ${THE_CAN.thing} holds its place on the pile.`;
        whySecond = `A ${shape} is drawn on the page and cannot travel anywhere at all.`;
        pin = { name: key.registry, test: 'rolls' };
      } else {
        keyText = flatCard(shape);
        forms = [flatCard(shape), shape];
        // Fixed at the box, mirroring the can above.
        firstWrong = card(THE_BOX);
        const roller = r.pick(ROLLERS_OFF);
        secondWrong = card(roller);
        whyFirst = `The ${THE_BOX.thing} is a solid thing; it goes in the bag and stays there.`;
        whySecond = `The ${roller.thing} is a solid thing too, even though it will not sit still.`;
        pin = null;
      }

      const { choices, correctKey } = makeChoices(r, keyText, [
        { text: firstWrong, errorTag: 'concept-misconception' as ErrorTag, rationale: whyFirst },
        { text: secondWrong, errorTag: 'representation-misread' as ErrorTag, rationale: whySecond },
      ]);
      const question = freshLine(r, guard, (stem, who) => {
        if (slip === 'falls') {
          return stem === 0
            ? say(`${puppet} keeps building a tower. It keeps falling down. Tap the one that will stack.`)
            : say(`${who} watches ${puppet} build. The tower keeps falling. Tap the one that will stack.`);
        }
        if (slip === 'rolled') {
          return stem === 0
            ? say(`${puppet} put the ${named.thing} on the pile. It rolled off. Tap the one that will roll off too.`)
            : say(`${who} saw the ${named.thing} roll off ${puppet}'s pile. Tap the one that will roll off too.`);
        }
        return stem === 0
          ? say(`${puppet} filled a bag with solid things. One is only a drawing. Tap the drawing.`)
          : say(`${who} looks in ${puppet}'s bag of solid things. Tap the drawing.`);
      });
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: question,
        choices,
        answer: { value: correctKey, acceptableForms: forms, validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        ...(pin ? { generator: { templateId: 'a_solid_v1', params: { name: pin.name, test: pin.test }, seed: r.uint() } } : {}),
        hintLadder: rungs('Help the puppet. Try each piece on the pile.', 'The piece that stays has a flat top.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'fix-the-pile', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — count the tower a build made
// ===========================================================================

/**
 * How many boxes stand in a drawn tower — "compose from parts", counted.
 *
 * Six is the ceiling because `CountersFig`'s `stack` layout wraps into a second
 * column at seven, and a two-column tower is not a tower.
 *
 * THE SHAPE OF THE CARD PAIR IS DEALT BEFORE THE COUNT IS DRAWN, not after: the
 * rotation picks "both cards below", "one either side" or "both above", and the
 * count is then drawn from the values that shape can serve. So the answer sits
 * lowest, middle and highest in turn rather than on average, and every card is a
 * count this same slot keys on other draws. The price is that the COUNT is no
 * longer uniform — the middle of the range is served more often than its ends —
 * and rank was chosen over flatness because "tap the biggest number" is a
 * strategy and "the answer is often four" is not (a19's finding, applied).
 */
function towerCount(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const shape = r.int(0, 2);
      // 2–6 is the drawable range; each shape needs room for its own pair.
      const n = shape === 0 ? r.int(4, 6) : shape === 1 ? r.int(3, 5) : r.int(2, 4);
      const pair =
        shape === 0
          ? [n - 2, n - 1] // both below — the answer is the biggest on offer
          : shape === 1
            ? [n - 1, n + 1] // one either side — the answer is the middle
            : [n + 1, n + 2]; // both above — the answer is the smallest
      const { choices, correctKey } = makeChoices(
        r,
        String(n),
        pair.map((v) => ({
          text: String(v),
          errorTag: (v < n ? 'procedure-slip' : 'representation-misread') as ErrorTag,
          rationale:
            v < n
              ? 'A box in the middle of the tower never got a number.'
              : 'One box answered to two numbers, so the climb overshot the top.',
        })),
      );
      const question = freshLine(r, guard, (stem, who) =>
        stem === 0
          ? say(`${who} built this tower. How many boxes are in it?`)
          : say(`${who} stacked these boxes. Tap how many there are.`),
      );
      const draft: ItemDraft = {
        type: 'computation',
        prompt: `[image: a tower of ${countNoun(n, 'boxes')}] ${question}`,
        figure: towerOf(n, 'blocks', 'boxes piled into a tower, resting on the flat tops below', true),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n), numberWords(n)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_count_v1', params: { n, noun: 'blocks' }, seed: r.uint() },
        hintLadder: rungs('Start at the floor and climb the tower.', 'Say a number at each box on the way up.'),
        errorTags: ['procedure-slip', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'count-tower' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — count one kind in a heap of parts
// ===========================================================================

/**
 * The heap a build starts from: some balls, some boxes, and a question about one
 * kind of piece.
 *
 * The wrong cards are the two mistakes this picture really invites — counting
 * the other kind, and counting the whole heap — and the rank is dealt first so
 * neither "tap the biggest" nor "tap the smallest" pays. The whole-heap card is
 * always above the key, so it can only serve the two shapes where a card above
 * is wanted; on the third the second card is an honest miscount instead.
 */
function heapParts(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const rank = r.int(0, 2);
      const askBoxes = r.int(0, 1) === 0;
      // `k` is the count asked for, `m` the other kind's; the rank decides which
      // side of `k` the two cards fall, and both counts are drawn to fit it.
      //
      // EVERY CARD IS A COUNT THIS SLOT KEYS ON OTHER DRAWS, and buying that
      // cost the item its most obvious wrong card. The first build offered the
      // WHOLE BOARD — "counted both heaps together" — which is the honest
      // misconception and which a child can point at; measured over 600 packs it
      // also put values of 7 to 11 on the page while the slot's key is a single
      // heap and can never exceed 6. That is the L38 shape: a card the page can
      // never key, on 2 of 3 draws. The repair is §E2.3's own move — take the
      // misconception to where it can be shown honestly. The card is now a count
      // that CROSSES the two heaps rather than adding them: one or two pieces of
      // the other kind counted in with these, which is the same slip at the scale
      // a four-year-old actually makes it, and which lands inside 2-6 every time.
      // "Counted the whole table" keeps its place in the mistakeBank, where the
      // reteach path needs it and no card has to be dealt for it.
      let k: number;
      let m: number;
      let second: number;
      if (rank === 0) {
        k = r.int(2, 4);
        m = r.int(k + 1, 6);           // both cards above — the answer is lowest
        second = k + 1 === m ? k + 2 : k + 1;
      } else if (rank === 1) {
        m = r.int(2, 4);
        k = r.int(m + 1, 5);           // one either side — the answer is the middle
        second = k + 1;
      } else {
        m = r.int(2, 4);
        k = r.int(m + 2, 6);           // both cards below — the answer is highest
        second = k - 1;
      }
      const boxes = askBoxes ? k : m;
      const balls = askBoxes ? m : k;
      const ballsFirst = r.int(0, 1) === 0;
      const groups = ballsFirst
        ? [{ count: balls, noun: 'balls' }, { count: boxes, noun: 'blocks' }]
        : [{ count: boxes, noun: 'blocks' }, { count: balls, noun: 'balls' }];
      const keyIndex = groups.findIndex((g) => (askBoxes ? g.noun === 'blocks' : g.noun === 'balls'));
      const kind = askBoxes ? 'boxes' : 'balls';
      const { choices, correctKey } = makeChoices(r, String(k), [
        {
          text: String(m),
          errorTag: 'representation-misread' as ErrorTag,
          rationale: `That is the other heap; the question asked only about the ${kind}.`,
        },
        {
          text: String(second),
          errorTag: (rank === 2 ? 'procedure-slip' : 'task-comprehension') as ErrorTag,
          rationale:
            rank === 2
              ? `One of the ${kind} slipped past while the counting went on.`
              : `${second - k === 1 ? 'One piece' : 'Two pieces'} from the other heap got counted in with the ${kind}.`,
        },
      ]);
      const question = freshLine(r, guard, (stem, who) =>
        stem === 0
          ? say(`${who} will ${askBoxes ? 'stack the boxes' : 'roll the balls'}. How many ${kind} are there?`)
          : say(`${who} sorts the pieces. Tap how many ${kind} there are.`),
      );
      const draft: ItemDraft = {
        type: 'representation',
        // THE BRACKET LISTS THE HEAPS IN THE ORDER THEY ARE DRAWN. Found by
        // reading the generated pack: with the scene fixed at "balls and boxes"
        // while the picture put the boxes first, a human reading the JSON — or a
        // gate reading the scene — saw a board that was not the board. Nothing
        // downstream would ever have said so, because the bracket is stripped
        // before a child sees it.
        prompt: `[image: ${groups.map((g) => countNoun(g.count, PIECE_WORD[g.noun])).join(' and ')} tipped out on the table] ${question}`,
        figure: heapOf(groups, keyIndex, 'balls and boxes tipped out beside each other on the table'),
        choices,
        answer: { value: correctKey, acceptableForms: [String(k), numberWords(k)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_count_v1', params: { n: k, kind, other: m }, seed: r.uint() },
        hintLadder: rungs('Cover the other heap with your spare hand.', 'Now only one kind of piece is left to count.'),
        errorTags: ['representation-misread', 'task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'count-parts' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 7 — the Day-4 real-world picture problem, band-A form
// ===========================================================================

/**
 * A heap of pieces and a tower that has to stand up: how many of these can go in
 * it at all?
 *
 * This is the week's own single-step real-world item, and the step is the roll
 * test rather than a count: the child has to decide WHICH pieces can be used
 * before there is anything to count. That is what separates it from `heapParts`,
 * where the kind is named for them.
 *
 * No `situationType` is declared: BB-W5's families are all quantity relations
 * and none of them describes "some pieces will not stay on a pile". The gate is
 * off at band A (`situationTypes: 0`), so a borrowed label would be metadata
 * that lies rather than metadata that helps.
 */
function planTheBuild(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const rank = r.int(0, 2);
      // Same card law as the heap page, for the same measured reason: the whole
      // board is the honest misconception here too ("a ball would sit still on a
      // pile") and it is the one value the slot can never key, since the tower is
      // always a part of the table. The above-card is instead the tower with one
      // or two rollers let into it — the slip at the scale a child makes it.
      let boxes: number;
      let balls: number;
      let second: number;
      if (rank === 0) {
        boxes = r.int(2, 4);
        balls = r.int(boxes + 1, 6);     // both cards above — the answer is lowest
        second = boxes + 1 === balls ? boxes + 2 : boxes + 1;
      } else if (rank === 1) {
        balls = r.int(2, 4);
        boxes = r.int(balls + 1, 5);     // one either side — the answer is the middle
        second = boxes + 1;
      } else {
        balls = r.int(2, 4);
        boxes = r.int(balls + 2, 6);     // both cards below — the answer is highest
        second = boxes - 1;
      }
      const ballsFirst = r.int(0, 1) === 0;
      const groups = ballsFirst
        ? [{ count: balls, noun: 'balls' }, { count: boxes, noun: 'blocks' }]
        : [{ count: boxes, noun: 'blocks' }, { count: balls, noun: 'balls' }];
      const keyIndex = groups.findIndex((g) => g.noun === 'blocks');
      const { choices, correctKey } = makeChoices(r, String(boxes), [
        {
          text: String(balls),
          errorTag: 'concept-misconception' as ErrorTag,
          rationale: 'Counted the pieces that roll away instead of the ones that stay put.',
        },
        {
          text: String(second),
          errorTag: (rank === 2 ? 'procedure-slip' : 'concept-misconception') as ErrorTag,
          rationale:
            rank === 2
              ? 'A box near the bottom of the basket was never touched.'
              : `${second - boxes === 1 ? 'One roller was' : 'Two rollers were'} let into the tower, and the tower would come down.`,
        },
      ]);
      const question = freshLine(r, guard, (stem, who) =>
        stem === 0
          ? say(`${who} wants a tower that will not fall. Tap how many pieces can go in it.`)
          : say(`${who} builds a tower that stays up. Tap how many pieces it uses.`),
      );
      const draft: ItemDraft = {
        type: 'word-problem',
        // "a box of parts" holding "2 boxes" was in the first build, and it uses
        // one word for two things on a page where the whole question turns on
        // which pieces are boxes. A basket has no shape claim to make.
        prompt: `[image: ${groups.map((g) => countNoun(g.count, PIECE_WORD[g.noun])).join(' and ')} in a basket of parts] ${question}`,
        figure: heapOf(groups, keyIndex, 'a basket of parts tipped out: some balls beside some boxes'),
        choices,
        answer: { value: correctKey, acceptableForms: [String(boxes), numberWords(boxes)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_count_v1', params: { n: boxes, noun: 'blocks', loose: balls }, seed: r.uint() },
        hintLadder: rungs('Push each piece first and watch what it does.', 'Roll the rollers away first. Count the rest.'),
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'plan-the-build' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 8 — Friday: build it, then tell it
// ===========================================================================

/**
 * Fetch three real solids, build something, and say what each piece does.
 *
 * The open half is the telling, so it ships `manual-review` with NO generator: a
 * template that "computed" a model nobody has picked up yet would be faking a
 * computable answer for an open task, which the kit forbids outright. It is the
 * item that satisfies the dual-strand coupling gate, and it is the only page in
 * the week without a picture — Day 5 is the only day where that is legal.
 */
function buildAndTell(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const line = freshLine(r, guard, (stem, who) =>
        stem === 0
          ? say(`Fetch a ball, a box and a can. Build something tall. Tell ${who} what each piece does.`)
          : say(`Bring three solid things to ${who}. Build the tallest tower you can. Say why it stands.`),
      );
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: line,
        answer: {
          value: 'a model built from real solids, with each piece named and its roll or stack test told out loud',
          acceptableForms: [],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        hintLadder: rungs('Test every piece on the floor before you build.', 'The pieces that roll belong beside the tower.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'build-and-tell' },
      };
      return draft;
    });
}

// ===========================================================================
// The generator instances — ladders budgeted before the days were
//
// Fifteen non-retrieval core pages over thirteen distinct ladders, none used
// more than twice. The dedup normalises digits away, so two ladders differing
// only by a number would count as one; none of these carry a number at all.
// ===========================================================================

const wrap = (name: string, gen: ItemGen, ladder: string[]): ItemGen =>
  withHints(spokenSafe(gen, name), rungs(...ladder));

const nameObject1 = wrap('nameObject1', nameTheSolid({ direction: 'toObject' }), [
  'Run both tests on it before you choose.',
  'Give it a push, then rest something on top.',
]);
const nameObject2 = wrap('nameObject2', nameTheSolid({ direction: 'toObject' }), [
  'Picture the piece in your hand, not on a shelf.',
  'One shape name belongs to one kind of face.',
]);
const nameWord1 = wrap('nameWord1', nameTheSolid({ direction: 'toName' }), [
  'Say what the piece does, then say its name.',
  'Round all over, flat all over, or pointed.',
]);
const nameWord2 = wrap('nameWord2', nameTheSolid({ direction: 'toName' }), [
  'Every shape name was said out loud this week.',
  'Hunt for the flat parts first, then choose.',
]);
const testIt1 = wrap('testIt1', theTest(), [
  'Feel for a flat face with your thumb.',
  'A flat face holds a pile. A curve lets go.',
]);
const testIt2 = wrap('testIt2', theTest(), [
  'Set each one down and let go of it.',
  'Whatever stays still will carry another piece.',
]);
const testIt3 = wrap('testIt3', theTest(), [
  'Think about lifting each one off the table.',
  'Paper shapes stay put; solid things come away.',
]);
const puppetTower = wrap('puppetTower', puppetPile(), [
  'Help the puppet. Try each piece on the pile.',
  'The piece that stays has a flat top.',
]);
const towerBoxes = wrap('towerBoxes', towerCount(), [
  'Start at the floor and climb the tower.',
  'Say a number at each box on the way up.',
]);
const heapCount = wrap('heapCount', heapParts(), [
  'Cover the other heap with your spare hand.',
  'Now only one kind of piece is left to count.',
]);
const buildPlan = wrap('buildPlan', planTheBuild(), [
  'Push each piece first and watch what it does.',
  'Roll the rollers away first. Count the rest.',
]);
const buildTell = wrap('buildTell', buildAndTell(), [
  'Test every piece on the floor before you build.',
  'The pieces that roll belong beside the tower.',
]);

// --- the four warm-ups, one format and one source week each -----------------
// `spokenSafe` wraps these too: their alts are assembled inside `lib/`, where
// this file's load-time `alt()` cannot see them (disclosure 9).
const warmFlatShape = spokenSafe(warmUp(shapeName({}), 7), 'warmFlatShape');
const warmWhichGroup = spokenSafe(warmUp(setForNumeral({ min: 3, max: 8, groups: 3 }), 8), 'warmWhichGroup');
const warmHowMany = spokenSafe(warmUp(howManyChoice({ min: 3, max: 6, arrangement: 'in a ring' }), 1), 'warmHowMany');
// A5's page carries `isDiscrimination`, so it sits on DAY 4 and nowhere else:
// the §6.3 gate counts flagged items in Days 2–3 without asking whether they are
// retrieval, and a borrowed flag would satisfy this week's own requirement with
// another week's trap.
const warmMoreRow = spokenSafe(warmUp(compareSets({ which: 'more', min: 3, max: 8 }), 5), 'warmMoreRow');

// ===========================================================================
// The week
// ===========================================================================

export const buildA21 = makeWeekBuilder({
  level: 'A',
  week: 21,
  conceptId: 'solid-shapes-and-building',
  conceptName: 'Solid shapes & building',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [
    { level: 'A', week: 7 },
    { level: 'A', week: 20 },
  ],
  pedagogyContract: 'v2',
  // Band A spends the §6.1 multi-step row on the pictorial rule, so this
  // selector is inert here. It is declared because the kit asks every non-D
  // blueprint to name its family, and sorting solids by what they do is a
  // classification move rather than an operation. No `deepeningDelta`:
  // `conceptFamily('solid-shapes-and-building')` matches no earlier catalog
  // cell, so BB-G1's precondition never fires — A7 is 'flat-shapes', a
  // different family and a different dimension.
  conceptFamily: 'place-value',
  conceptualAnchor: 'the roll and stack test',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. This week needs a table, not a screen. Before you start, put out four things: a ball, a box, a tin and a party hat or a paper cone. The pages ask and the hands answer, so let your child push each one and then try to rest another on top. Read the buttons out loud - the shape words are new and none of them can be read yet. Mascot present.',
  },
  explanation: {
    hook: say(
      'Put a ball on the floor. Give it a push. Off it goes. Now try that with a box.',
    ),
    whyBeforeHow: say(
      'A solid is known by what it does. Why? Because a curved side travels and a flat side stays. So we use the roll and stack test. Push it once. Then rest another piece on top. Those two answers give the shape its name.',
    ),
    script: [
      {
        say: say('Here is a ball. Push it and it rolls away.'),
        visual: 'One ball resting on the floor, ready for a push.',
        figure: counters(1, 'balls', {
          arrangement: 'in a row',
          alt: alt('a ball sitting on the floor, waiting to be pushed'),
        }),
      },
      {
        say: say('Now rest a piece on the ball. It rolls off. A ball is a sphere.'),
        visual: 'Balls scattered across the floor where they rolled to.',
        figure: counters(4, 'balls', {
          arrangement: 'scattered',
          alt: alt('balls spread across the floor, each stopped where it rolled'),
        }),
      },
      {
        say: say('A box will not roll. Its sides are flat. It stacks.'),
        visual: 'Boxes piled into a tower, each on the flat top below.',
        figure: towerOf(4, 'blocks', 'boxes piled up, each resting on the flat top below'),
      },
      {
        // The two shape names a child would otherwise never hear said. Every
        // keyed word in this week is spoken in the lesson, because no screen in
        // the app ever reads a choice button aloud (a07's disclosure 10).
        say: say('A box is a cube. A can is a cylinder. Both stack.'),
        visual: 'Boxes laid out in a line, ready to be built with.',
        figure: counters(5, 'blocks', {
          arrangement: 'in a row',
          alt: alt('boxes laid out along a line, waiting to be stacked'),
        }),
      },
      {
        say: say('A party hat is a cone. It rolls on its side.'),
        visual: 'A party hat lying on its side beside an upright one - hands do this, no picture can.',
      },
      {
        // The discrimination, taught where nothing is assessed. The counter dot
        // is the only circle the renderer can draw, and this is the one place it
        // is used (disclosure 1).
        say: say('A circle is flat. You draw it. A ball is solid. You hold it.'),
        visual: 'A filled circle drawn on the page, flat and going nowhere.',
        figure: counters(1, 'dots', {
          arrangement: 'in a row',
          alt: alt('a filled circle drawn flat on the page'),
        }),
      },
    ],
    summary: say(
      'Push it, then stack it. Those two answers name a solid. A drawn shape does neither.',
    ),
    vocabulary: [
      // Six is the S-SCHEMA ceiling and all six are words this week KEYS. The
      // roll and stack words are Tier-1 already; the shape names are not, and a
      // keyed word a pre-reader has never heard is not a word at all.
      { term: 'solid', kidGloss: 'a thing with an inside, that you can pick up' },
      { term: 'flat', kidGloss: 'drawn on the page, with no inside at all' },
      { term: 'sphere', kidGloss: 'round all over, like a ball' },
      { term: 'cube', kidGloss: 'six flat sides, like a box' },
      { term: 'cylinder', kidGloss: 'flat at each end, round in between' },
      { term: 'cone', kidGloss: 'flat at the bottom, with a point on top' },
    ],
  },
  guidedExamples: [
    {
      ...ge(21, 1, 'modeled', scenePrompt('a ball set beside a box', 'Which one can we stack, a ball or a box?'), [
        {
          teacherSay: say('Watch me first. I am giving this ball a push.'),
          expected: 'it rolls',
        },
        { childDo: say('Now rest a piece on the ball with me.'), expected: 'it rolls off' },
        { teacherSay: say('The box has flat sides. So the box stacks.') },
      ], 'the box'),
      visual: 'A ball set beside a box on the table.',
      // NO ASSERTION ON ANY EXAMPLE, and it is a schema fact rather than a
      // preference: a guided example is audited against its ANSWER alone
      // (`validator.ts` passes `{answer: [g.answer]}` and no params), and a
      // counters figure's default quantity is everything it draws. An assertion
      // here would set QG-13 comparing an honest picture with a correct word.
      figure: counterGroups(
        [{ count: 1, noun: 'balls', label: 'ball' }, { count: 1, noun: 'blocks', label: 'box' }],
        { arrangement: 'in a row', alt: alt('a ball set beside a box on the table') },
      ),
    },
    {
      ...ge(21, 2, 'completion', scenePrompt('a flat circle drawn on the page', 'Which one can we hold, the circle or the ball?'), [
        { teacherSay: say('This circle is only a drawing. It stays flat.') },
        { childDo: say('Try to lift the circle off the page.'), expected: 'it will not come' },
        { teacherSay: say('A ball is solid. It comes away in your hand.') },
      ], 'the ball'),
      visual: 'A filled circle drawn on the page, with a hand hovering over it.',
      figure: counters(1, 'dots', {
        arrangement: 'in a row',
        alt: alt('a filled circle drawn flat on the page'),
      }),
    },
    {
      ...ge(21, 3, 'prompted', scenePrompt('a tower of 3 boxes', 'What shape name does a box have?'), [
        { teacherSay: say('Every side of a box is flat and square.') },
        { childDo: say('Say the shape name for a box.'), expected: 'cube' },
        { teacherSay: say('Cube. Every box in that tower is a cube.') },
      ], 'cube'),
      visual: 'A tower of boxes, each resting on the flat top below.',
      figure: towerOf(3, 'blocks', 'boxes piled into a tower on the table'),
    },
    {
      ...ge(21, 4, 'independent', scenePrompt('a tower of 5 boxes', 'How many boxes are in this tower?'), [
        { childDo: say('Touch each box and count up the tower.'), expected: '5' },
      ], '5'),
      visual: 'A taller tower of boxes, built from the floor upwards.',
      figure: towerOf(5, 'blocks', 'a taller tower of boxes, built up from the floor'),
    },
  ],
  days: [
    // Day 1 — concept echo: the two tests, the four names, and a tower to count.
    // The picture is the tower; the naming and testing pages are objects in the
    // hand, which is the ruling this week was cleared under.
    [
      { gen: warmFlatShape, diff: 1 },
      { gen: nameObject1, diff: 1 },
      { gen: towerBoxes, diff: 2 },
      { gen: testIt1, diff: 2 },
    ],
    // Day 2 — a drawn shape now stands beside the solids on every test page.
    // The heap beside it carries the day's picture.
    [
      { gen: warmWhichGroup, diff: 2 },
      { gen: testIt2, diff: 3 },
      { gen: heapCount, diff: 2 },
      { gen: nameWord1, diff: 2 },
    ],
    // Day 3 — the test again, then the puppet whose tower will not stand up.
    // The heap page keeps the day pictorial.
    [
      { gen: warmHowMany, diff: 2 },
      { gen: testIt3, diff: 3 },
      { gen: heapCount, diff: 2 },
      { gen: puppetTower, diff: 3 },
    ],
    // Day 4 — the real-world build: a basket of parts, and only some of them
    // can go in the tower.
    [
      { gen: warmMoreRow, diff: 2 },
      { gen: buildPlan, diff: 2 },
      { gen: testIt1, diff: 3 },
      { gen: nameObject2, diff: 2 },
    ],
    // Day 5 — one more of each naming direction, then out of the chair to build
    // something and say why it stands.
    [
      { gen: nameWord2, diff: 2 },
      { gen: testIt3, diff: 3 },
      { gen: buildTell, diff: 3 },
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
    'For grown-ups: this is a week of objects, and it will not work from the screen alone. Put four things on the table before you begin - a ball, a box, a tin of beans and a party hat, or a cone twisted out of paper. Nothing in the software can draw a solid, and that is honest rather than a shortfall: a drawing of a cube is a flat picture with extra lines, and a child asked whether it rolls has been asked about the picture. So the pages ask and the hands answer. Two moments ahead will look like slips and neither is. First, your child insists a can cannot be stacked. They are half right, and the half they are right about is the interesting one: stood on its end a tin holds a pile, laid on its side it runs away across the floor. Let them find that out by doing it, and you have taught more than the page did. Second, they call a drawn circle a ball. Nearly every round thing they have ever met came away in their hand, so a round thing that stays on the paper is genuinely strange. Slide a finger under it and let the paper win the argument. The best cupboard for all of this is the food one: tins, cereal boxes, oranges, a rolled-up paper cone. Name each one, run both tests on it, and say the shape word out loud every time - not one of those four words can be read yet.',
  ],
  /**
   * The sanctioned band-A production puzzle, and the BUILDING is the mathematics.
   *
   * The catalog's non-computational focus for A21 is "shape-construction puzzle:
   * what can you build from these?", and this is that question made answerable:
   * a heap holding both kinds of piece, and the tallest tower it can make is
   * decided by the roll test before a single piece is counted. Every day page
   * either tests one piece or counts one heap; this one has to do both in order,
   * which is the new move.
   *
   * The number is code-derived from the picture the child is looking at. The
   * telling — what the leftover pieces became — is the open half, and it is
   * asked in the prompt rather than faked into the key.
   *
   * `Puzzle` carries no `choices` field, so its answer is typed however it is
   * worded; that is a schema limit, recorded in disclosure 12 rather than
   * papered over with a "tap" the surface cannot offer.
   */
  puzzle: (r) => {
    const boxes = r.int(3, 6);
    // NEVER THE SAME TWO COUNTS. Found by reading a generated puzzle: an equal
    // heap ("5 balls and 5 boxes") makes the answer true of the rollers as well,
    // so a child who counted the wrong half is marked right and the roll test —
    // the whole point of the page — is never run. One deterministic step down
    // rather than a redraw loop, so the pack's later draws do not move.
    const drawn = r.int(2, 5);
    const balls = drawn === boxes ? drawn - 1 : drawn;
    const ballsFirst = r.int(0, 1) === 0;
    const groups = ballsFirst
      ? [{ count: balls, noun: 'balls' }, { count: boxes, noun: 'blocks' }]
      : [{ count: boxes, noun: 'blocks' }, { count: balls, noun: 'balls' }];
    return {
      id: 'A21-PZ-01',
      title: 'Puzzle Grove: Build the Tallest Tower',
      puzzleType: 'construction',
      prompt: [
        `[image: ${countNoun(balls, 'balls')} and ${countNoun(boxes, 'boxes')} tipped out together]`,
        say('Here are all your building pieces.'),
        say('Build the tallest tower these can make.'),
        say('How many pieces stand in it?'),
        say('Then say what the leftovers became.'),
      ].join(' '),
      figure: counterGroups(
        groups.map((g) => ({ count: g.count, noun: g.noun, label: PIECE_WORD[g.noun] })),
        { arrangement: 'in a row', alt: alt('balls and boxes tipped out together, ready to build with') },
      ),
      answer: {
        value: String(boxes),
        acceptableForms: [String(boxes), numberWords(boxes)],
        validation: 'exact-numeric',
      },
      hintLadder: rungs(
        'Push every piece once before you build anything.',
        'The rollers cannot stay in a tower. Count the rest.',
      ),
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'sort-then-build' },
  sprint: null,
  mastery: [
    // Six slots, and the shape of the list is the contract's own split: two ask
    // the name in each direction, one runs the test, one repairs a build, and
    // two compose and count. The puppet is the only slot whose three cards come
    // from a two-class pool, and one such slot is what keeps "take the odd one
    // out" from certifying (disclosure 5); the second and third were removed by
    // merging the test with its discrimination rather than by dropping content.
    { gen: nameObject1, diff: 2 },
    { gen: nameWord1, diff: 2 },
    { gen: testIt2, diff: 3 },
    { gen: puppetTower, diff: 3 },
    { gen: towerBoxes, diff: 2 },
    { gen: buildPlan, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; the same generator and difficulty in each slot, drawn fresh off a separate stream. The six slots are the contract split in half: 01 says a shape name and offers three objects, 02 runs the same skill backwards by naming an object and offering three shape names, 03 is the roll, stack, roll-off and drawn-flat test on one seven-card pool, 04 is the puppet whose tower keeps falling, and 05 and 06 compose - counting a drawn tower, then deciding which pieces of a basket can go in one at all. Slots 01 to 04 key a word and 05 and 06 key a count, so no single answer mode covers the form. Every card is a word or a count this same slot keys on other draws, so none can be struck out unread, and no option word appears anywhere in its own question - which is why the fourth object is a party hat rather than a cone. On slot 03 a drawn shape stands beside solids on every draw, so the flat-against-solid discrimination is met on every page of that slot rather than on a page of its own; slot 04 is the only one whose three cards come from a pool with two classes in it, and one such slot is what keeps a card-classifying shortcut below the certifying bar. The four word slots carry no number at all, so the pack surface guard signs them null - their Form-A and Form-B sentences are kept apart by a per-pack line register instead, which walks two stems across the name pool and takes the first line the pack has not used.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'a-drawing-is-treated-as-a-thing',
      description:
        'Expects a shape drawn on the page to behave like a thing, so the circle is asked to roll and the square to carry a pile. This is experience talking, not confusion: almost every round object a four-year-old has met so far came away in the hand, and paper is the strange case.',
      exampleWrongAnswer: 'a circle drawn on the page, chosen as the thing you can pick up',
      distractorRationale:
        'Put a drawn shape on every test page as an honest wrong card - a circle neither rolls nor stacks nor comes off the paper - and key it on one question in four. That does two jobs at once: the misconception is met on every page rather than on two, and the page stops being one class against another, which is what a three-card question over two classes always is. Measured over 600 packs, taking the odd card out by flat-versus-solid is right 32.2% of the time on the mastery form, against a 33.3% floor.',
      reteachPointer: 'explanation/script[5] (a circle is flat and you draw it; a ball is solid and you hold it)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'names-the-solid-from-a-passing-look',
      description:
        'Answers with the shape word that comes to hand rather than the one the tests have just earned, so a can is called a cube or a party hat a sphere. At this age a name is still a label a grown-up supplied, not yet a conclusion the object argues for.',
      exampleWrongAnswer: 'a can named as a cube because both of them stack',
      distractorRationale:
        'Offer two of the other three solids, drawn without replacement, so every card names a solid this slot keys on other draws. There is no numeric rank to game here - a shape name has no size - which is why the naming pages are the ones no arithmetic reflex can win. Check as well that the question never contains its own answer: that is what rules the word "cone" out as an object name and puts a party hat on the card instead.',
      reteachPointer: 'guidedExamples/A21-GE-03 (every side of a box is flat and square, so a box is a cube)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place-climbing-the-tower',
      description:
        'Knows to count and still returns the wrong number, because the eye lets go of where it had reached. A tall tower gives it more chances than a short one, and a heap holding two kinds of piece gives it more again.',
      exampleWrongAnswer: 'a tower of five boxes counted as six, the bottom box met twice',
      distractorRationale:
        'Cards are counts a slip of this kind really produces - a step short of the true one, or a step past it - and WHICH SIDE they fall on is settled before the tower height is drawn at all. A third of pages put both cards under the answer, a third put one each side, a third put both over it, so the answer takes the low, middle and high seat in turn instead of on average. That costs the height its flat spread, and the trade is deliberate: a seat can be played and a favourite number cannot.',
      reteachPointer: 'guidedExamples/A21-GE-04 (touch each box and count up the tower)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'counts-the-whole-table',
      description:
        'Counts everything tipped out rather than the pieces the question is about - both kinds together when one was named, or the rollers as well as the stackers when only a tower was asked for. The counting is sound; what has been missed is which pieces the question was ever about.',
      exampleWrongAnswer: 'a heap of three balls and four boxes answered as seven when only the boxes were asked for',
      distractorRationale:
        'NOT offered as a card, and that was measured rather than assumed. The whole-heap total is what this misreading really produces, but a heap of two kinds runs to eleven while the answer is a single heap and can never pass six, so on two draws in three the card was a number the slot could never key - the L38 shape (measured: values 7 to 11, offered on 66% of heap pages, keyed on none). The card offered instead is the same slip at the scale a four-year-old makes it: one or two pieces of the OTHER kind counted in with these, which lands inside the answer range every time and is keyed by the slot on other draws. The whole-table reading keeps its place here, where the reteach path needs it and no card has to be dealt for it.',
      reteachPointer: 'explanation/summary (push it, then stack it - those two answers name a solid)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Naming solid shapes by what they do, and building with the ones that stay put. Every object got two questions this week - does it roll, and will another piece sit on top of it - and the pair of answers gave it a name: sphere, cube, cylinder, cone. The shift your child is making is from recognising a shape to arguing for one, which is also why a circle drawn on paper never turned out to be a ball, however round it looked.',
    improvingCandidates: [
      'running both tests on a piece before naming it',
      'saying a shape name for an everyday object, not just for the toy it was learned on',
      'telling a shape drawn on paper from a solid thing in the hand',
      'choosing which pieces can go in a tower before starting to build',
      'counting the pieces of one kind when two kinds are tipped out together',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'letting the test settle it rather than the look - we will keep pushing real things and watching what they do',
      },
      {
        errorTag: 'representation-misread',
        text: 'attaching a shape name to a new object; a tin and a rolling pin are both cylinders',
      },
      {
        errorTag: 'task-comprehension',
        text: 'holding on to which pieces the question meant, with two kinds tipped out at once',
      },
      {
        errorTag: 'procedure-slip',
        text: 'holding the bottom of the tower while counting upwards - a finger parked there is the whole fix',
      },
    ],
    homeFocus: {
      praiseLine:
        'You sorted the pieces with your own hands, and you found that the tin holds a pile only when it stands on its end.',
      questionForChild: 'Can you find something in this kitchen that rolls and also stacks?',
      schoolSyncHook: 'Tell us what their group builds with - wooden blocks, junk boxes, magnetic tiles - and the objects named here will match.',
    },
    vocabularyForParent: [
      'solid (a thing with an inside - the whole week rests on the difference between this and a drawing)',
      'sphere (round all over: a ball, an orange, a marble - it rolls and it will not stack)',
      'cube (six flat square sides: a dice, a stock cube - it stacks and it will not roll)',
      'cylinder (flat at both ends, round in between: a tin, a rolling pin - it does both, depending on how you set it down)',
      'cone (flat at the bottom, a point on top: a party hat, a road cone - your child cannot read any of these four words, so say them out loud every time)',
    ],
  },
});
