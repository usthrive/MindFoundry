/**
 * Level A · Week 7 — "Flat shapes" (conceptId: flat-shapes).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber` and `lib/figures`. The
 * exemplars a11, a01, a04, a05 and a12 were read for their ARCHITECTURE — the
 * option deal, the rank rotation, the ladder budget, the withHints closure.
 * Every sentence, scene, name, hint, gloss and rationale below was written for
 * this week; the cross-corpus token-overlap scan that backs that up is in the
 * report.
 *
 * FILL-ARCHITECTURE §3 row A7: anchor "sides-and-corners feel"; core forms
 * "choose shape, count corners"; perceptual discrimination "rotated square is
 * still a square"; puppet error-analysis "calls the tilted square a diamond";
 * Day-5 "shape sort by property (+oral R)". No `deepeningDelta`: 'flat-shapes'
 * is its own concept family and A1–A6 are all counting weeks, so
 * `priorSameFamily` is empty and BB-G1's precondition never fires.
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **A shape keeps its name when you turn it.** Turning moves a shape; it
 *    never remakes one. That single sentence is the week, and it is not asserted
 *    at the child — it is made unavoidable. Every page draws a shape that HAS
 *    been turned, the amount of turn is drawn independently of which shape it
 *    is. Two slots always tip, one always lands the shape back in its everyday
 *    pose, and every other slot flips a coin: served over 700 packs that is 67%
 *    tipped against 33% upright, with the four shapes inside 23.3-26.6% of BOTH
 *    poses. So orientation carries no information about the answer anywhere in
 *    the pack, and a child who reads the tilt instead of the shape is wrong
 *    exactly as often as chance (measured; disclosure 4).
 *  - **The name comes from the corners, so the corners are what we teach.** The
 *    anchor is a finger travelling the edge and stopping at each bump. Naming
 *    and counting are therefore the same act at two zoom levels, and the two
 *    core forms share ONE option deal: the three shapes offered on a naming page
 *    and the three numbers offered on a counting page are the same three shapes
 *    seen twice (disclosure 3).
 *  - **Every corner is like every other corner, and every side like every other
 *    side.** That is the equal-parts language FILL-ARCHITECTURE §3 asks A7 to
 *    plant for B22, and it lives where a claim about equality can be SHOWN: the
 *    lesson script and the guided examples, whose figures carry the equal-side
 *    tick marks that no assessed item in this file is allowed (disclosure 2).
 *  - **The picture is the question.** `GATE_PROFILE.A` swaps the multi-step row
 *    for `pictorialPerDay: 1`; every non-retrieval item on Days 1–4 carries a
 *    shape figure built from the same corner count its own answer is keyed on.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail,
 *    and `makeWeekBuilder` refuses a Level-A sprint outright.
 *  - **Retrieval is 21.1%** (4 of 19 daily items), one warm-up on each of Days
 *    1–4, from A1, A2, A4 and A6 in four different formats.
 *
 * ── TEN DISCLOSURES (FANOUT kit §E2.3: document the choice in the header) ──
 *
 * 1. **THE ROTATION IS REAL, AND IT WAS PROBED RATHER THAN ASSUMED.** A7 is the
 *    class of recipe L49 found unbuildable three times over, so the first
 *    question was whether the renderer can draw the discrimination at all.
 *    `AngleFigureParams.rotation` exists AND `AngleFig.tsx` honours it: it spins
 *    the CONSTRUCTED model points (`AngleFig.tsx:166-169`) rather than wrapping
 *    the SVG in a transform, precisely so the drawing stays exact while it
 *    turns. Re-implementing its vertex construction and its bounding-box fit and
 *    running them gives, for `{shape:'quadrilateral', angles:[90,90,90,90],
 *    rotation:45}`, the four points (60,140) (160,240) (260,140) (160,40) in a
 *    320×280 viewBox — a true 200-by-200 diamond standing on its lowest corner.
 *    Nothing had to be invented and nothing was quietly simplified.
 *
 *    What the primitive CANNOT draw is the catalog's shape list. `AngleFigure`
 *    takes 'angle' | 'triangle' | 'quadrilateral' | 'polygon', so there is no
 *    circle at all, and a quadrilateral is built by `tangentialPolygon`, which
 *    is fixed by its ANGLES — four right angles always close into a square, so a
 *    non-square RECTANGLE is not expressible either. The catalog row for A7 says
 *    "circle, square, triangle, rectangle". This week therefore teaches the four
 *    shapes `lib/earlynumber.ts`'s own `FLAT_SHAPES` already ships — triangle,
 *    square, pentagon, hexagon — which is the same substitution the library made
 *    before this week existed, and which keeps three of the five shapes named by
 *    the US kindergarten standard (triangle, square, hexagon). WHAT IS LOST:
 *    circle (and with it "curved edge versus straight edge", the cleanest
 *    property contrast at this age) and rectangle (and with it "a square is a
 *    special rectangle", which is C22's work anyway). Recorded for the
 *    orchestrator: a `circle` member on `AngleFigureParams.shape`, and an
 *    explicit-vertex or aspect-ratio route to a rectangle, would each unlock a
 *    real A7 item. Neither was faked here.
 *
 * 2. **NO ASSESSED FIGURE IN THIS FILE CARRIES `sideMarks`, AND THAT IS THE L33
 *    TEST APPLIED HONESTLY.** `FLAT_SHAPES` builds its triangle with
 *    `sideMarks:[1,1,1]` and its square with `[1,1,1,1]` — one tick per side,
 *    drawn to show the sides are equal. For a shape with n sides that is n ticks
 *    on the page, and n is exactly the corner count the week asks for. A child
 *    can count ticks instead of travelling the edge, and on a naming page the
 *    ticks give the count that gives the name. So the ticks appear only in
 *    `explanation.script` and in the guided examples, where the answer is
 *    already on the page and "all four sides are the same, all four corners are
 *    the same" is the thing being taught — which is also where §3 asks A7 to
 *    plant B22's equal-parts seed. Every assessed figure is built by the local
 *    `shapeFigure` wrapper below, which cannot emit `sideMarks`, and also sets
 *    `showArcs:false` and `showRightMarks:false` so no angle arc, degree label
 *    or square-corner mark decorates a vertex. A bare outline is the whole
 *    picture.
 *
 * 3. **ONE OPTION DEAL SERVES BOTH CORE FORMS, AND ITS RANK IS FLAT BY
 *    CONSTRUCTION RATHER THAN BY LUCK.** Four shapes ordered by corner count
 *    give four possible truths, and any three of them put the truth at a rank a
 *    child can play. Two of the four are trapped: a triangle has no shape below
 *    it, so its count is the smallest number offered on EVERY draw, and a
 *    hexagon has none above it. Widening the option pool with counts no shape
 *    has — 2, 7 — would buy the rank back and cost more than it buys, because
 *    those numbers can never be the answer and become strike-out fodder (§E2.11,
 *    L43). So the rank is bought inside the honest pool instead: `pairFor` sends
 *    a truth of 4 to both-above one time in three and one-below-one-above
 *    otherwise, and mirrors that for a truth of 5. The arithmetic is exact — a
 *    quarter of draws forced to rank 1, a quarter to rank 3, and a third of each
 *    of the two free quarters redirected — so every rank sits on a third IN
 *    EXPECTATION, and every number offered is a number this page keys on some
 *    other draw. The naming form uses the SAME deal on the same shapes, so "tap
 *    the shape with the fewest corners" is worth a third too. SERVED, which is
 *    the number that counts (L52): across the twelve certifying slots over 700
 *    packs the truth lands at rank 1 on 30.4-36.6% of draws, rank 2 on
 *    30.0-34.9% and rank 3 on 32.4-35.6%, against a 33.3% floor. Full tables in
 *    the report.
 *
 * 4. **THE TILT IS DRAWN INDEPENDENTLY OF THE SHAPE, WHICH IS THE ONE THING
 *    THIS WEEK COULD MOST EASILY HAVE GOT WRONG.** `lib/earlynumber.ts`'s
 *    shipped `shapeName({tilt:true})` opens `opts.tilt ? FLAT_SHAPES[1] : …` —
 *    the tilted shape is the square, always. Served, that makes "when it is
 *    turned, tap square" a complete answer to the discrimination page, and the
 *    discrimination is then measuring nothing. It also offers 'diamond' as an
 *    option on 100% of tilted draws while keying it on none, which is
 *    `NEVER_CORRECT` by the entropy gate's own threshold. Neither generator in
 *    that family is used here for that reason; both are re-authored locally so
 *    that the shape is uniform over four and the pose is a separate draw. Every
 *    tilt-vs-shape joint distribution is in the report.
 *
 *    The pose draw is itself the mechanism, not a flag. An "upright" figure is
 *    NOT rotation zero: it is a rotation drawn from the shape's own rotational
 *    symmetry group (a square 90/180/270, a triangle 120/240, a pentagon
 *    72/144/216/288, a hexagon 60 through 300), which is a genuine turn that
 *    lands the shape back in its everyday pose. Verified by re-running the
 *    renderer's construction and fit: the vertex set is identical to rotation
 *    zero in all four shapes. A "tipped" figure is a rotation half a symmetry
 *    step away, jittered by up to a third of a half-step, so it is unmistakably
 *    over — a square at 45 is the diamond, a triangle at 60 is point-down, a
 *    hexagon at 30 rests on a corner. Two consequences fall out for free: the
 *    turn is honest content rather than a boolean, and the printed scene carries
 *    a second widely-varying number, which is what keeps `drawUniqueItem` from
 *    pinning these slots (see disclosure 6).
 *
 * 5. **THE PUPPET SAYS "A DIAMOND", THE RECIPE'S WORD, AND IT IS NEVER AN
 *    OPTION.** The obvious build of row A7's puppet-EA — tilted square, options
 *    {square, diamond, one more} — fails twice at once: 'diamond' is offered
 *    every draw and keyed none, and the key is "square" on 100% of draws, which
 *    is `CONSTANT_ANSWER` and, worse, teaches one of the exact blind habits this
 *    week exists to punish ("always answer square"). The family's own
 *    `puppetSlip` shows the way out: it puts the puppet's WRONG VALUE in the
 *    prompt, where a child hears it, and keeps the option set honest. So
 *    `puppetTurnsIt` draws the shape uniformly over four, tips it, and has the
 *    puppet rename it out loud — 'a diamond' when the shape is the square,
 *    which is the recipe verbatim and happens on a quarter of draws, and the
 *    name of another shape otherwise, which is the same misconception ("the turn
 *    made it something else") reaching for the only other words a four-year-old
 *    has. The options are shape names, the key is uniform over four, and the
 *    puppet's word is on the page as prose, never as a button.
 *
 *    The rank falls out exactly, and that is worth stating because it was not
 *    arranged: when the puppet names a real shape, the two distractors are the
 *    two shapes left over, and drawing the puppet's shape uniformly from the
 *    other three puts the truth at rank 1, 2 and 3 in the proportions the deal
 *    in disclosure 3 was built to force. The diamond branch uses `pairFor`, so
 *    it agrees, and the deal's own third lands on top of it. Measured over 3,000
 *    packs per form rather than asserted: rank 1/2/3 = 34.6/31.8/33.6 (Form A)
 *    and 35.6/32.0/32.5 (Form B). The ~1pp lean onto rank 1 is not noise and it
 *    is traceable rather than hand-waved: rank 1 is P(triangle) + P(square) / 3,
 *    and the triangle is served at 26.0-26.8% instead of 25.0% because the
 *    pack-wide surface guard rejects a repeat and the redraw is not neutral. The
 *    puppet says "a diamond" on 24.5-25.1% of draws, which is the square's share
 *    exactly, and its word is offered as a button on 0.0% of them.
 *
 * 6. **THE `[image: …]` BRACKET CARRIES TWO NUMBERS, AND WITHOUT THE SECOND ONE
 *    THIS WEEK WOULD PIN ITS OWN SLOTS.** `drawUniqueItem` signs an item on the
 *    numeric tokens of its prompt, and a one-token item signs as
 *    `type|1tok|<n>`. A shape item's only natural number is its corner count,
 *    which takes four values — so a pack asking eight naming questions would
 *    exhaust the signature space after four and then redraw eighty times per
 *    item, which biases which shape reaches the page (kit §E, A1-exemplar lesson
 *    5; L39). The scene therefore prints the corner count AND the turn in
 *    degrees, both of them true of the drawing, which gives a two-token commuted
 *    signature over a wide space. The bracket never reaches the child:
 *    `promptText` strips it and `speakablePrompt` prefers the figure's `alt`
 *    over it, and `bb-readability` measures alt text separately from sentences.
 *    Emptying it would leave every shape item unsigned and therefore unguarded,
 *    which is the opposite of the repair. Turn values start at 20, corner counts
 *    stop at 6, so the two token families cannot collide.
 *
 * 7. **THE CORNER-COUNT TRUTH IS RE-DERIVED LOCALLY, BECAUSE NO SHIPPED GATE
 *    CAN DO IT — AND THAT GAP IS GENERAL, NOT A7'S.** Two shipped rules meet
 *    head-on here. L53 requires a certifying band-A numeric item to carry
 *    AUTHORED choices; `validator.ts` S-SCHEMA requires any item with choices to
 *    validate as `choice-key`; and QG-5's enablement list is
 *    ['exact-numeric','equivalent-numeric','equivalent-fraction','ordered-list',
 *    'set'] — `choice-key` is not in it. So `a_shape_corners_v1`'s `answerFor`
 *    is registered, resolvable, and never called for any item that obeys L53.
 *    QG-11 cannot cover it either: `a_shape_corners_v1` is an `AnswerDef` with
 *    no `verifyFor`, and the v2 detector at `validator.ts:644` only fires on a
 *    prompt matching the embedded-claim regex, which a corner question does not.
 *    This is the L50 shape exactly — an enablement list reading an empty set —
 *    and it applies to every band-A numeric slot in the corpus that took L53's
 *    advice, not only to this week. Recorded for the orchestrator.
 *
 *    What this file does instead is a real second implementation rather than a
 *    shrug. `drawnCorners` recomputes the corner count the way `AngleFig`
 *    constructs its model — `sides` for a polygon, `angles.length` for a
 *    triangle or a quadrilateral — reading the FIGURE PARAMS that were actually
 *    emitted, and `assertShape` throws if it disagrees with the count the item
 *    keyed or with the count its name was derived from. It runs on every draw of
 *    every item at every seed, so a table edit that made a picture disagree with
 *    its answer would fail the 200-seed sweep instead of shipping green.
 *    (The naming form needs no such crutch: `a_shape_name_v1` is a `verifyFor`,
 *    it derives the name from `params.corners`, and QG-11 compares it with the
 *    keyed option's text on every naming and puppet item in the pack.)
 *
 *    NO FIGURE HERE CARRIES `asserts`, and that is the same missing selector
 *    seen from the other side. `figures/assert.ts` gives `angle-figure` the
 *    selectors `angle | sum | missing`; there is no `corners` or `sides`, and an
 *    unrecognised selector returns null by design. Asserting the angle SUM
 *    against a corner count would be a pin aimed at the wrong quantity, so the
 *    assertion is omitted rather than misdirected — a11 reached the same
 *    conclusion about its pattern strips. Recorded: a `corners` selector on
 *    `angle-figure` would let QG-13 prove the picture holds the count the item
 *    keys, which is the guarantee this week most wants and cannot have.
 *
 * 8. **THE DAY-5 SORT IS OBJECTS ON A TABLE, NOT A PICTURE, AND THAT IS THE
 *    BAND'S OWN RULE.** Row A7's Day-5 is "shape sort by property", which wants
 *    several shapes side by side; a `PackItem` carries ONE `figure`, and there
 *    is no primitive that draws a collection of shapes. FILL-ARCHITECTURE §3
 *    settles it rather than blocking it: at band A "independent means the child
 *    does it with objects", and the Day-5 production task is make/show/build
 *    with an oral R-flagged telling. So `sortAndTellShapes` sends the child to
 *    find three flat things in a named room and sort them by corners, validates
 *    `manual-review`, carries NO generator, and is the item that satisfies the
 *    dual-strand coupling gate. It is the only item in the file without a
 *    picture, and Day 5 is the only day where that is legal (`pictorialPerDay`
 *    is checked on Days 1–4). Recorded for the orchestrator: a multi-shape
 *    figure primitive would make the drawn sort possible and would also unlock
 *    the "which one is the odd one out" family this week could not build.
 *
 * 9. **FOUR THINGS ONLY READING THE GENERATED WEEK FOUND**, each recorded at the
 *    line that fixes it rather than only here.
 *    - **Every naming page read the same sentence.** Day 1's two naming items
 *      both printed "Tap the name of this shape." verbatim, and Form A's first
 *      two mastery slots both printed "This shape has been turned. Tap its
 *      name." No gate can see it: `drawUniqueItem` signs on NUMERIC tokens and
 *      these sentences carry none, so the pictures differing was enough for the
 *      guard while the child met one sentence twice on the same page pair. Fixed
 *      with a `stem` per instance (see `nameQuestion` / `countQuestion`).
 *
 *      WHAT THAT FIX GUARANTEES, re-measured over 500 packs after a reader
 *      caught the sentence that followed it overstating: **0 duplicate visible
 *      prompts within a day (0 of 13,500 page pairs) and 0 within a mastery form
 *      (0 of 15,000)**. It does NOT guarantee anything across the two mastery
 *      forms, and the earlier claim of "0 between Form A and Form B" was simply
 *      false — Form B's slot 02 asks Form A's slot 02 in the same words on 100%
 *      of packs, and slots 01/03/04/05 collide on 51.0/23.4/14.0/12.0% (slot 06
 *      on 0.4%). That is the isomorph contract working rather than a defect: a
 *      mastery slot is a re-attempt at ONE question, the stem is a property of
 *      the SLOT (which is what killed the within-day repeat), and a slot whose
 *      pose is fixed has exactly one sentence to ask with. What is guaranteed
 *      across the forms is the thing that matters and is separately enforced:
 *      the PICTURE always differs, because `drawUniqueItem` signs on the corner
 *      count and the turn, so `formB[i].prompt !== formA[i].prompt` holds on
 *      every draw (`bb-verify-packs` asserts it) and no child ever re-answers
 *      the same drawing.
 *    - **Every picture was described in the same eleven words.** One alt per
 *      pose meant a child heard the identical opening line on eight of nineteen
 *      pages. Three wordings per pose now, all saying the same true things.
 *    - **Two guided-example alts said the answer.** "a six-sided shape resting
 *      on a corner" over "how many corners does this shape have?" and "a
 *      three-sided shape turned point downwards" over "tap its name". The
 *      spoken-answer gate exempts guided examples by design — a worked example
 *      states its answer on purpose — so nothing would have fired. Repaired
 *      anyway: a modelled example should still let the child do the counting.
 *    - **The puzzle key read as though naming were part of the task.** It asks
 *      only for two corner counts, so both counts alone now stand as an
 *      acceptable form; the piece names remain in the canonical value because a
 *      set answer has to say which count belongs to which.
 *
 *    And one thing the SCAN found rather than the reading, which is the §E2.13
 *    lesson arriving on schedule: the strongest attractor was **c22, the same
 *    recipe cell one level up**, which this file never opened. Independent runs
 *    of five or more words landed on it anyway ("four straight sides, four
 *    corners"; "a square tipped onto its corner named a diamond"), alongside
 *    borrowed teacher-note formulas from a01, a11, a12, a20, b23 and c15. All
 *    re-voiced. What survives is house boilerplate that every A week ships
 *    verbatim (the band-A `scaffoldNotes` preamble) and the corpus-wide
 *    `isomorphNotes` opener — API shape, kept deliberately.
 *
 * 10. **HALF THE WEEK'S KEYED WORDS WERE NEVER SPOKEN, AND NOTHING IN THE STACK
 *     COULD SAY SO.** Band A is `audioFirst` and `CheckRunner.tsx:128` speaks
 *     `speakablePrompt(item.prompt, item.figure?.alt)` — the scene and the
 *     question, and NOTHING ELSE. No screen in the app ever reads a choice
 *     button aloud. So the only route by which the word on a button can reach a
 *     four-year-old is the lesson: the script, the guided examples, the
 *     vocabulary gloss. Measured over 500 packs before this repair: "triangle"
 *     and "square" appeared in a spoken lesson surface on 100% of packs,
 *     **"pentagon" and "hexagon" on 0.0%**, and neither was in `kidGloss`. Two
 *     of the four keyed names were therefore words the child had never heard and
 *     could not read, on the roughly half of assessed pages that draw a five- or
 *     six-sided shape. Every gate passed: `bb-answer-entropy` measures whether an
 *     option is KEYABLE, not whether it is KNOWABLE, and no gate in the corpus
 *     compares an option's text against the taught vocabulary.
 *
 *     Fixed where the child will actually hear it, and re-measured at 100%:
 *     `script[5]` counts a drawn pentagon to five and names it; A7-GE-03 already
 *     draws a hexagon and now closes by naming it once the six has been counted;
 *     and both words carry a `kidGloss`. The removal that paid for the gloss is
 *     stated at the table rather than hidden — 'matching' was dropped, because
 *     `validator.ts` S-SCHEMA caps `vocabulary` at six entries and `script` at
 *     six segments, and a word the week KEYS outranks a word the week merely
 *     uses. Removing the two shapes instead was never available: they are the
 *     content, and the four-shape table is what makes the rank deal flat
 *     (disclosure 3). Recorded for the orchestrator: a gate that checks every
 *     WORD-valued option against the pack's own spoken surfaces would have
 *     caught this at every band, and would catch it in b/c weeks too.
 */

import type { ErrorTag } from '../../../types';
import type { AngleFigureParams, BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';
import { makeChoices } from '../shared';
import type { ItemDraft } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { howManyChoice, neighbourNumber, numeralTrap, setForNumeral, PUPPETS } from '../lib/earlynumber';
import { shapeFigure } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** One name per item, drawn. No child is ever named directly (kit §F.3). */
const NAMES = ['Iva', 'Torin', 'Selma', 'Amos', 'Rhea', 'Kito', 'Vidya', 'Berit'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/** Rooms a four-year-old can actually go and stand in, for the Day-5 hunt. */
const ROOMS = ['kitchen', 'garden', 'hallway', 'bedroom', 'porch', 'shed'] as const;

// ---------------------------------------------------------------------------
// The band-A length law, applied per SENTENCE
//
// The family's own `ask()` caps a whole PROMPT at ten words, which lets a
// two-sentence prompt through a cap it never breaks, and leaves hint ladders,
// script lines and puzzle prose uncapped altogether. `bb-readability-test`
// measures every SENTENCE of every child-facing surface with its own splitter.
// This mirrors the gate rather than the family, and it throws at module load or
// at draw time, so an eleventh word cannot reach a seed sweep.
//
// The `[image: …]` bracket is deliberately not passed through here. It is a
// scene direction the child never hears (the figure's `alt` wins in
// `speakablePrompt`) and the readability gate measures it on its own advisory
// ceiling of thirty words, for the reason recorded in that file: the fix for a
// long alt is always to describe the picture LESS, which is the wrong trade.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A7 length law broken: ${String(n)} words, ceiling ${String(MAX_WORDS)} — "${sentence}"`);
    }
  }
  return text;
}

/** `[image: <scene>] <question>` — the scene is the picture, not a line to read. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** A hint ladder, length-checked and by construction name-free and number-free. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Give a generator its own ladder without touching the shared library.
 *
 * The dedup allows one ladder template at most twice across the non-retrieval
 * core, and fifteen core items over four local generators would collapse to four
 * ladders without this. It also stops all 24 Level-A weeks hinting in the
 * family's voice, which no per-pack gate can see. The advice genuinely differs
 * per pose too: an upright shape wants "start at a corner and go round", a
 * tipped one wants "turn your head, not the counting".
 *
 * Runs entirely inside the returned closure, draws no rng and leaves the prompt
 * untouched, so the QG-1/QG-4 surface signature is unchanged.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * A warm-up: a family item from a strictly-earlier week, flagged as retrieval.
 *
 * `GATE_PROFILE.A.warmupFormats` is 0, so a warm-up has to earn its place rather
 * than fill a quota. Naming a shape is deciding WHICH of several groups a thing
 * belongs to, and counting its corners is one-to-one counting with the objects
 * stuck to an edge — so the four replay exactly that substrate: tapping the
 * numeral for a loose group (A1), finding the group that holds a named number
 * (A2), telling two look-alike numerals apart (A4) and saying what comes next
 * along the path (A6). One a day, four weeks, four formats.
 *
 * Retrieval items sit outside the ladder dedup and the cross-week ladder scan,
 * so these keep the family's own hints: a warm-up should sound like the week it
 * came from rather than like the week it is visiting.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The shape table this file computes from
// ===========================================================================

interface FlatShape {
  name: string;
  corners: number;
  /** The figure params, given a turn in degrees. */
  build: (rotation: number) => AngleFigureParams;
}

/**
 * The four shapes the renderer can draw, ORDERED BY CORNER COUNT.
 *
 * The order is load-bearing: `pairFor` deals ranks by index, so index IS the
 * position of a shape's count among the four, and nothing has to sort at draw
 * time. See disclosure 1 for the two shapes that are missing and why.
 *
 * A SECOND, INDEPENDENT COPY of the same four shapes `lib/earlynumber.ts` keeps
 * privately in `FLAT_SHAPES`, and that is deliberate. The registered
 * `a_shape_name_v1` derives a name from the corner count using the library's own
 * `SHAPE_BY_CORNERS`, so when an item here builds a figure from THIS table and
 * keys a name, QG-11 checks it against a table this file cannot see. Two
 * implementations that must agree is a re-derivation; reading back the value the
 * generator drew is an echo.
 */
const SHAPES: readonly FlatShape[] = [
  { name: 'triangle', corners: 3, build: (rotation) => ({ shape: 'triangle', angles: [60, 60, 60], rotation }) },
  { name: 'square', corners: 4, build: (rotation) => ({ shape: 'quadrilateral', angles: [90, 90, 90, 90], rotation }) },
  { name: 'pentagon', corners: 5, build: (rotation) => ({ shape: 'polygon', sides: 5, rotation }) },
  { name: 'hexagon', corners: 6, build: (rotation) => ({ shape: 'polygon', sides: 6, rotation }) },
];

/**
 * The corner count the RENDERER will draw, recomputed from the emitted params.
 *
 * `AngleFig` builds its model from `sides` for a polygon and from the `angles`
 * array for a triangle or a quadrilateral, and the polygon vertex count is what
 * a child's finger will meet going round the edge. So this is the drawn truth,
 * derived from the picture rather than from the table that asked for it — which
 * is the check disclosure 7 explains no shipped gate can run.
 */
function drawnCorners(params: AngleFigureParams): number {
  if (params.shape === 'polygon') return params.sides ?? 5;
  return params.angles?.length ?? 0;
}

/**
 * Refuse to emit an item whose picture and answer have drifted apart.
 *
 * Throws rather than warns, and throws on EVERY draw rather than on a sampled
 * one, so the 200-seed sweep is the enforcement point.
 */
function assertShape(params: AngleFigureParams, corners: number): void {
  const drawn = drawnCorners(params);
  if (drawn !== corners) {
    throw new Error(`A7: figure draws ${String(drawn)} corners but the item keys ${String(corners)}`);
  }
}

/** A shape's rotational symmetry step, in degrees: the turn that changes nothing. */
function symmetryStep(shape: FlatShape): number {
  return 360 / shape.corners;
}

/**
 * A turn, in degrees, in one of the two poses.
 *
 * UPRIGHT is a genuine turn of one to n−1 symmetry steps. The shape lands back
 * where it started — verified by re-running the renderer's construction and
 * bounding-box fit, which gives a vertex set identical to rotation zero for all
 * four shapes — so the picture is the everyday pose while the printed scene
 * still carries a varied number (disclosure 6). Zero is excluded so that every
 * item in the pack has honestly been turned, which is the week's whole claim.
 *
 * TIPPED is half a symmetry step away from those, jittered by up to a third of
 * that half-step, then offset by a whole number of symmetry steps so the printed
 * value varies as widely as the upright one does. Half a step is the furthest a
 * shape can be from its own pose, so this is the maximal tip rather than a
 * cautious one: a square lands on 45 and is the diamond, a triangle on 60 and is
 * point-down, a hexagon on 30 and rests on a corner. The jitter is bounded below
 * a sixth of a step, so no tipped draw can ever wander back to upright.
 */
function turnFor(r: Rng, shape: FlatShape, tipped: boolean): number {
  const step = symmetryStep(shape);
  const k = r.int(tipped ? 0 : 1, shape.corners - 1);
  if (!tipped) return k * step;
  const half = step / 2;
  const jitter = r.int(-Math.floor(half / 3), Math.floor(half / 3));
  return k * step + half + jitter;
}

/**
 * What a slot asks of the pose.
 *
 * 'either' is the default and it is the setting that carries the week's claim:
 * the pose is a coin flip drawn BEFORE and independently of the shape, so on
 * most pages orientation is not merely uncorrelated with the answer, it is not
 * even a property of the slot. 'upright' belongs to Day 1, where a shape is met
 * in its everyday pose before it is ever tipped; 'tipped' belongs to the two
 * discrimination slots and to the puppet, where the turn IS the question.
 *
 * There is a measured reason to prefer 'either' everywhere else, and it is not
 * only pedagogy. An upright figure's turn is a multiple of the shape's symmetry
 * step, so a triangle has just TWO upright surfaces (120 and 240) against a
 * hexagon's five — and `drawUniqueItem` guards the whole pack on that surface.
 * With six upright naming slots competing for fourteen upright surfaces, the
 * triangle's two were routinely gone by the time a mastery slot drew, and the
 * redraw pushed the shape somewhere else: measured over 500 packs, the triangle
 * was served on 17.2% of `formA[0]` draws against its 25.0% draw share, and the
 * key sat at rank 1 on 23.8% of them against a 33.3% floor. That is L39 exactly
 * — measure what is SERVED, not what you meant to draw — and the fix is to stop
 * so many slots demanding the scarce pose rather than to widen the scene with
 * turns of 480 degrees. Re-measured after the change, the numbers are in the
 * report.
 */
type Pose = 'upright' | 'tipped' | 'either';

/** Resolve a slot's pose into this draw's pose. Drawn before the shape. */
function poseFor(r: Rng, pose: Pose): boolean {
  return pose === 'either' ? r.int(0, 1) === 1 : pose === 'tipped';
}

/**
 * Each slot asks its question in its own words.
 *
 * Found by reading the generated week, and nothing in the gate stack can see
 * it: `drawUniqueItem` signs on the numeric tokens of the prompt, and these
 * sentences carry none, so Day 1's two naming pages both read "Tap the name of
 * this shape." verbatim, and Form A's first two mastery slots both read "This
 * shape has been turned. Tap its name." The pictures differed and the surface
 * guard was satisfied; the CHILD met the same sentence twice on one page pair.
 * A `stem` per instance fixes it without touching the question being asked.
 */
type NameStem = 'name' | 'call';
type CountStem = 'howmany' | 'count';

function nameQuestion(stem: NameStem, tipped: boolean): string {
  if (tipped) return stem === 'name' ? 'This shape has been turned. Tap its name.' : 'Someone turned it round. What is it called?';
  return stem === 'name' ? 'Tap the name of this shape.' : 'What is this shape called? Tap it.';
}

function countQuestion(stem: CountStem, tipped: boolean, who: string): string {
  if (tipped) {
    return stem === 'howmany'
      ? `${who} turned this shape right over. How many corners now?`
      : `${who} gave it a turn. Count the corners now.`;
  }
  return stem === 'howmany' ? 'How many corners does this shape have?' : 'Count the corners. Tap how many there are.';
}

/**
 * The picture: a bare outline, and nothing else on it.
 *
 * `showArcs:false` and `showRightMarks:false` between them suppress every
 * annotation `AngleFig` can draw — the vertex arcs, the degree labels and the
 * little square corner mark it would otherwise stamp on all four right angles of
 * a square. `sideMarks` is unreachable from here by construction (disclosure 2):
 * one tick per side is the corner count drawn on the page.
 *
 * The alt says the shape is flat, that its edges are straight, and which way up
 * it is standing. It does not name the shape and it does not name a number,
 * because at band A the alt is SPOKEN before the question and both would be the
 * answer read aloud — the name IS what the corner count is being taught to
 * yield, so naming either gives away both (L48, and the semantic case the
 * spoken-answer gate records as one a token check cannot see).
 */
/**
 * Three wordings per pose, drawn.
 *
 * Found by reading the generated week: with one wording per pose, a child heard
 * the identical eleven-word sentence open eight of the nineteen pages, which is
 * the sort of thing only reading catches — no gate measures repetition across a
 * pack's spoken lines. All six say the same three true things (flat, straight
 * edges, which way up) and none of them names a shape or a number.
 *
 * Every tipped wording is true of every tipped draw: a turn that is not a
 * multiple of the symmetry step leaves exactly one vertex lowest on a convex
 * polygon, so "tipped onto a point" is a fact about the drawing rather than a
 * flourish about the square.
 */
const ALT_UPRIGHT = [
  'a flat shape with straight edges, standing the usual way up',
  'a flat shape whose edges are all straight, sitting the usual way',
  'a flat shape made of straight edges, resting the right way up',
] as const;
const ALT_TIPPED = [
  'a flat shape with straight edges, tipped right over',
  'a flat shape whose edges are all straight, leaning right over',
  'a flat shape made of straight edges, tipped onto a point',
] as const;

function shapeFig(r: Rng, shape: FlatShape, rotation: number, tipped: boolean): BBFigure {
  const params: AngleFigureParams = { ...shape.build(rotation), showArcs: false, showRightMarks: false };
  assertShape(params, shape.corners);
  return shapeFigure(params, { alt: r.pick(tipped ? ALT_TIPPED : ALT_UPRIGHT) });
}

/**
 * The scene printed in the `[image: …]` bracket — two numbers, both true.
 *
 * Never seen and never heard (disclosure 6); it exists so the pack's surface
 * guard has something to sign, and so a human reading the generated JSON can see
 * exactly what was drawn.
 */
function shapeScene(shape: FlatShape, rotation: number, tipped: boolean): string {
  return `a ${shape.name} with ${countNoun(shape.corners, 'corners')}, turned ${String(rotation)} degrees, ${tipped ? 'now tipped over' : 'still standing upright'}`;
}

// ===========================================================================
// The option deal — one mechanism, both core forms
// ===========================================================================

/**
 * Two other shapes to stand beside the truth, with the truth's RANK rotated.
 *
 * Returns indices into `SHAPES`, which is ordered by corner count, so the rank
 * of `i` among the three returned-plus-itself is decided entirely here. The
 * arithmetic, stated once because the whole of disclosure 3 rests on it:
 *
 *   i = 0  no shape has fewer corners, so the truth is the smallest: rank 1.
 *   i = 3  no shape has more, so the truth is the largest: rank 3.
 *   i = 1  rank 3 is impossible (only one shape sits below it). Both-above
 *          gives rank 1; one-below gives rank 2. Both-above is taken one time
 *          in three.
 *   i = 2  the mirror: both-below gives rank 3, taken one time in three.
 *
 * With the truth uniform over four shapes that is 1/4 + (1/4)(1/3) = 1/3 at
 * rank 1, the same at rank 3, and the remainder at rank 2 — exactly a third
 * each, not approximately. Every index returned is a shape this page keys on
 * some other draw, so no option can ever be struck out unread.
 *
 * Deterministic throughout: `r.int` is drawn once and read, never looped on.
 */
function pairFor(r: Rng, i: number): [number, number] {
  const below = [0, 1, 2, 3].filter((j) => j < i);
  const above = [0, 1, 2, 3].filter((j) => j > i);
  const takeExtreme = r.int(0, 2) === 0;
  if (below.length === 0) {
    const [a, b] = r.shuffle(above).slice(0, 2);
    return [a, b];
  }
  if (above.length === 0) {
    const [a, b] = r.shuffle(below).slice(0, 2);
    return [a, b];
  }
  // i = 1 has one below and two above; i = 2 has two below and one above. The
  // "extreme" branch is the one that pushes the truth to an end of the page.
  if (above.length >= 2) {
    if (takeExtreme) {
      const [a, b] = r.shuffle(above).slice(0, 2);
      return [a, b];
    }
    return [below[0], r.pick(above)];
  }
  if (takeExtreme) {
    const [a, b] = r.shuffle(below).slice(0, 2);
    return [a, b];
  }
  return [above[0], r.pick(below)];
}

/** Why a shape's name is not this shape's name, said as a property. */
function nameRationale(other: FlatShape, truth: FlatShape): string {
  return `That name belongs to the shape with ${countNoun(other.corners, 'corners')}; this one has ${countNoun(truth.corners, 'corners')}.`;
}

/** Why a corner count that belongs to a different shape is the wrong count. */
function countRationale(other: FlatShape, truth: FlatShape): string {
  return other.corners < truth.corners
    ? 'The walk round the edge stopped early, before the starting bump came back.'
    : 'One bump got said twice, so the number ran on past the true count.';
}

// ===========================================================================
// Local generator 1 — name the shape
// ===========================================================================

/**
 * Tap the name of the drawn shape.
 *
 * `tipped` decides the pose only. The SHAPE is uniform over all four in both
 * poses, which is the fix disclosure 4 exists for: the shipped
 * `shapeName({tilt:true})` returns the square on every tilted draw, and this one
 * must not, or "turned means square" answers the discrimination page outright.
 *
 * Options are the three shape NAMES the deal returns, so every option is a name
 * this page keys on other draws, and the truth's rank by corner count is a third
 * at each position. 'diamond' is not among them and is not anywhere near a
 * button in this file — it is the puppet's word and it lives in prose
 * (disclosure 5).
 */
function nameShape(opts: { pose: Pose; stem: NameStem }): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const tipped = poseFor(r, opts.pose);
      const i = r.int(0, SHAPES.length - 1);
      const shape = SHAPES[i];
      const rotation = turnFor(r, shape, tipped);
      const [j, k] = pairFor(r, i);
      const { choices, correctKey } = makeChoices(r, shape.name, [
        {
          text: SHAPES[j].name,
          errorTag: (tipped ? 'concept-misconception' : 'representation-misread') as ErrorTag,
          rationale: tipped
            ? 'The turn was read as a change, so the shape was given a new name.'
            : nameRationale(SHAPES[j], shape),
        },
        {
          text: SHAPES[k].name,
          errorTag: 'representation-misread' as ErrorTag,
          rationale: nameRationale(SHAPES[k], shape),
        },
      ]);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(shapeScene(shape, rotation, tipped), nameQuestion(opts.stem, tipped)),
        figure: shapeFig(r, shape, rotation, tipped),
        choices,
        answer: { value: correctKey, acceptableForms: [shape.name], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_shape_name_v1',
          params: { corners: shape.corners, turn: rotation, tilt: tipped },
          seed: r.uint(),
        },
        hintLadder: ['Run a finger round the edge and feel each bump.', 'The bumps are corners. Their number gives the name.'],
        errorTags: ['concept-misconception', 'representation-misread'],
        // Keyed on the SLOT's pose, never on this draw's coin flip: the
        // discrimination gate counts flagged items in Days 2-3 and must reach
        // the same verdict at every seed.
        authorMeta: {
          stepCount: 1,
          cognitiveOp: 'classify-shape',
          ...(opts.pose === 'tipped' ? { isDiscrimination: true } : {}),
        },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — count the corners
// ===========================================================================

/**
 * How many corners the drawn shape has, with AUTHORED options.
 *
 * The family's `shapeCorners` validates `exact-numeric` and offers nothing,
 * which at band A is not a free-entry page: `AnswerEntry` hands a choice-less
 * numeric item to `tapOptionsFor`, which invents four buttons at render time
 * (L53). A slot whose answer can only ever be 3, 4, 5 or 6 gets a rank rotation
 * only as wide as its answer space, and none of the misconception-faithful
 * distractors the content discipline exists to produce survive the trip. So the
 * options are authored here, and they are the corner counts of the two shapes
 * the deal returned — three real counts, each keyed on other draws.
 *
 * `tipped` again decides only the pose, and on a tipped draw the nearer wrong
 * count carries the week's own misconception rather than a counting slip: a
 * child who believes the turn remade the shape expects the count to have moved.
 */
function cornerCount(opts: { pose: Pose; stem: CountStem }): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const tipped = poseFor(r, opts.pose);
      const i = r.int(0, SHAPES.length - 1);
      const shape = SHAPES[i];
      const rotation = turnFor(r, shape, tipped);
      const [j, k] = pairFor(r, i);
      const nearer = Math.abs(SHAPES[j].corners - shape.corners) <= Math.abs(SHAPES[k].corners - shape.corners) ? j : k;
      const distractor = (idx: number) => ({
        text: String(SHAPES[idx].corners),
        errorTag: (tipped && idx === nearer ? 'concept-misconception' : 'procedure-slip') as ErrorTag,
        rationale:
          tipped && idx === nearer
            ? 'The turn was thought to change the shape, so the count was changed to match.'
            : countRationale(SHAPES[idx], shape),
      });
      const { choices, correctKey } = makeChoices(r, String(shape.corners), [distractor(j), distractor(k)]);
      const who = one(r);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(shapeScene(shape, rotation, tipped), countQuestion(opts.stem, tipped, who)),
        figure: shapeFig(r, shape, rotation, tipped),
        choices,
        answer: { value: correctKey, acceptableForms: [String(shape.corners)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_shape_corners_v1',
          params: { corners: shape.corners, turn: rotation },
          seed: r.uint(),
        },
        hintLadder: tipped
          ? ['Turn your head, not the counting. Start anywhere.', 'A turn slides the corners along. It never adds one.']
          : ['Park a fingertip on any bump. Leave it parked.', 'Walk the edge all the way back to that fingertip.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
        // Slot-keyed, not draw-keyed — see the note on the naming form.
        authorMeta: {
          stepCount: 1,
          cognitiveOp: 'count-corners',
          ...(opts.pose === 'tipped' ? { isDiscrimination: true } : {}),
        },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — help the puppet, who renamed a turned shape
// ===========================================================================

/**
 * The recipe's puppet-EA, built so that its key moves (disclosure 5).
 *
 * The shape is uniform over four and always tipped. The puppet renames it out
 * loud: 'a diamond' for the square, which is row A7's word exactly, and the name
 * of another shape otherwise — the same belief, reaching for the only other
 * words a four-year-old has for "it turned into something else". The puppet's
 * word is spoken in the prompt, the way the family's own `puppetSlip` speaks its
 * wrong number, and is never a button.
 *
 * `a_shape_name_v1` is registered as a `verifyFor`, so QG-11 recomputes the true
 * name from `params.corners` and compares it with the keyed option's text on
 * every draw. The word "wrong" never appears; the puppet is mixed up, and the
 * child says what the shape really is.
 */
function puppetTurnsIt(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const i = r.int(0, SHAPES.length - 1);
      const shape = SHAPES[i];
      const rotation = turnFor(r, shape, true);
      const puppet = r.pick(PUPPETS);
      const who = one(r);
      const isSquare = shape.name === 'square';
      // The renamed-to shape, for every shape but the square. Drawn uniformly
      // from the other three, which is what makes the two LEFT-OVER shapes the
      // distractors and hands the rank rotation over for free.
      const renamedTo = isSquare ? -1 : r.shuffle([0, 1, 2, 3].filter((x) => x !== i))[0];
      const [j, k] = isSquare
        ? pairFor(r, i)
        : ([0, 1, 2, 3].filter((x) => x !== i && x !== renamedTo) as [number, number]);
      const puppetWord = isSquare ? 'a diamond' : `a ${SHAPES[renamedTo].name}`;
      const { choices, correctKey } = makeChoices(r, shape.name, [
        {
          text: SHAPES[j].name,
          errorTag: 'concept-misconception' as ErrorTag,
          rationale: 'A turned shape was treated as a new shape, so a new name was picked.',
        },
        {
          text: SHAPES[k].name,
          errorTag: 'representation-misread' as ErrorTag,
          rationale: nameRationale(SHAPES[k], shape),
        },
      ]);
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(
          shapeScene(shape, rotation, true),
          `${who} turned this shape. ${puppet} calls it ${puppetWord}. Tap its real name.`,
        ),
        figure: shapeFig(r, shape, rotation, true),
        choices,
        answer: { value: correctKey, acceptableForms: [shape.name], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_shape_name_v1',
          params: { corners: shape.corners, turn: rotation, tilt: true },
          seed: r.uint(),
        },
        hintLadder: ['Help the puppet. Count the bumps round the edge together.', 'A turn moves the bumps. It never takes one away.'],
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'error-analysis', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — the Day-4 single-step picture problem, band-A form
// ===========================================================================

/** Where a flat shape turns up in a four-year-old's day. */
const FINDS = {
  tile: { verb: 'finds', place: 'a tile on the floor' },
  card: { verb: 'cuts', place: 'a shape for a card' },
  sign: { verb: 'spots', place: 'a sign by the road' },
  patch: { verb: 'sews', place: 'a patch on a bag' },
} as const;

type FindKind = keyof typeof FINDS;

/**
 * A real-world single-step picture problem — G7 in its band-A form.
 *
 * `ask` decides which property the story wants, so the two Day-4 instances put
 * the same picture to two different questions rather than dressing one question
 * twice. The pose is a coin flip drawn independently of the shape here as
 * everywhere else, which is what keeps the week's joint distribution flat on the
 * pages a child meets last (measured; the table is in the report).
 */
function shapeStory(kind: FindKind, opts: { ask: 'name' | 'corners' }): ItemGen {
  const find = FINDS[kind];
  const { ask } = opts;
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const tipped = poseFor(r, 'either');
      const i = r.int(0, SHAPES.length - 1);
      const shape = SHAPES[i];
      const rotation = turnFor(r, shape, tipped);
      const [j, k] = pairFor(r, i);
      const who = one(r);
      const { choices, correctKey } =
        ask === 'name'
          ? makeChoices(r, shape.name, [
            {
              text: SHAPES[j].name,
              errorTag: 'representation-misread' as ErrorTag,
              rationale: nameRationale(SHAPES[j], shape),
            },
            {
              text: SHAPES[k].name,
              errorTag: 'concept-misconception' as ErrorTag,
              rationale: 'The pose was read instead of the corners, so the name moved with it.',
            },
          ])
          : makeChoices(r, String(shape.corners), [
            {
              text: String(SHAPES[j].corners),
              errorTag: 'procedure-slip' as ErrorTag,
              rationale: countRationale(SHAPES[j], shape),
            },
            {
              text: String(SHAPES[k].corners),
              errorTag: 'procedure-slip' as ErrorTag,
              rationale: countRationale(SHAPES[k], shape),
            },
          ]);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(
          shapeScene(shape, rotation, tipped),
          ask === 'name'
            ? `${who} ${find.verb} ${find.place}. Tap its name.`
            : `${who} ${find.verb} ${find.place}. How many corners has it?`,
        ),
        figure: shapeFig(r, shape, rotation, tipped),
        choices,
        answer: {
          value: correctKey,
          acceptableForms: [ask === 'name' ? shape.name : String(shape.corners)],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator:
          ask === 'name'
            ? { templateId: 'a_shape_name_v1', params: { corners: shape.corners, turn: rotation, tilt: tipped }, seed: r.uint() }
            : { templateId: 'a_shape_corners_v1', params: { corners: shape.corners, turn: rotation }, seed: r.uint() },
        hintLadder:
          ask === 'name'
            ? ['Look at the edge, not at which way it lies.', 'Count the bumps. Then say the name that fits.']
            : ['Start at any bump and mark it with a finger.', 'Go all the way round, back to that finger.'],
        errorTags: ask === 'name' ? ['representation-misread', 'concept-misconception'] : ['procedure-slip', 'representation-misread'],
        // No `situationType`: the BB-W5 families are all quantity relations and
        // none of them describes "a child meets a shape". The gate is off at band
        // A (`situationTypes: 0`), so an untrue label would be decoration that
        // lies rather than metadata that helps.
        authorMeta: { stepCount: 1, cognitiveOp: ask === 'name' ? 'classify-shape' : 'count-corners' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — the Day-5 sort, with objects and out loud
// ===========================================================================

/**
 * Find three flat things, sort them by corners, and say how you knew.
 *
 * The open half is the telling, so it ships `manual-review` with NO generator
 * (disclosure 8): inventing a template that "computes" a sort of objects the
 * child has not picked up yet would be faking a computable answer for an open
 * task, which the kit forbids outright. It is also the item that satisfies the
 * dual-strand coupling gate.
 *
 * It carries no picture, and Day 5 is the only day where that is allowed.
 */
function sortAndTellShapes(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const room = r.pick(ROOMS);
      const who = one(r);
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: say(`Hunt in the ${room} with ${who}. Find three flat shapes. Put the fewest corners first. Tell how you knew.`),
        answer: {
          value: 'three flat things placed fewest corners first, with the reason said out loud',
          acceptableForms: [],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        hintLadder: ['Feel each one before you move it anywhere.', 'Say your count out loud as you set it down.'],
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'sort-by-property' },
      };
      return draft;
    });
}

// ===========================================================================
// The generator instances — ladders budgeted before the days were
//
// Fifteen non-retrieval core items, eleven distinct ladders, none used more
// than twice. The dedup normalises digits away, so two ladders differing only
// by a number would count as one; none of these do.
//
// Only the two Day-1 forms demand the upright pose, and only the two
// discrimination forms and the puppet demand the tipped one. Everything else
// flips a coin, for the measured reason recorded on `Pose`.
// ===========================================================================

const nameFlat = withHints(
  nameShape({ pose: 'upright', stem: 'name' }),
  hints('Run a finger round the edge and feel each bump.', 'The bumps are corners. Their number gives the name.'),
);
const nameFlatAgain = withHints(
  nameShape({ pose: 'upright', stem: 'call' }),
  hints('Look at the straight edges first. Count them slowly.', 'Sides and corners come in pairs. Either one tells you.'),
);
const nameEither = withHints(
  nameShape({ pose: 'either', stem: 'call' }),
  hints('Which way it lies makes no difference at all.', 'Find the bumps, count them, then choose the word.'),
);
const nameTipped = withHints(
  nameShape({ pose: 'tipped', stem: 'name' }),
  hints('Do not let the tilt fool your eyes. Feel instead.', 'A turn slides a shape along. It never remakes it.'),
);
const cornersFlat = withHints(
  cornerCount({ pose: 'upright', stem: 'howmany' }),
  hints('Park a fingertip on any bump. Leave it parked.', 'Walk the edge all the way back to that fingertip.'),
);
const cornersEither = withHints(
  cornerCount({ pose: 'either', stem: 'count' }),
  hints('Say a number out loud at every bump you meet.', 'The bump you set off from is where you stop.'),
);
const cornersTipped = withHints(
  cornerCount({ pose: 'tipped', stem: 'howmany' }),
  hints('Turn your head, not the counting. Start anywhere.', 'A turn moves the corners along. It never adds one.'),
);
const puppetDiamond = withHints(
  puppetTurnsIt(),
  hints('Help the puppet. Count the bumps round the edge together.', 'The bumps did not move apart. Only the shape leaned.'),
);
const storyTile = withHints(
  shapeStory('tile', { ask: 'name' }),
  hints('Ignore which way it lies on the floor.', 'Count what the edge does, then choose the word.'),
);
const storyPatch = withHints(
  shapeStory('patch', { ask: 'corners' }),
  hints('Choose a bump to set off from before counting.', 'Keep going one way only, right back to it.'),
);
const sortTell = withHints(
  sortAndTellShapes(),
  hints('Feel each one before you move it anywhere.', 'Say your count out loud as you set it down.'),
);

// --- the four warm-ups, one format and one source week each ----------------
// A floor of three on the loose group, for the reason a11's author recorded:
// `howManyChoice`'s honest "two too few" distractor is n−2, so a drawn set of
// two would offer zero beside a picture that plainly holds some.
const warmTapNumeral = warmUp(howManyChoice({ min: 3, max: 5, arrangement: 'in a row' }), 1);
const warmWhichGroup = warmUp(setForNumeral({ min: 6, max: 10, groups: 3 }), 2);
const warmSixNine = warmUp(numeralTrap({ trap: 'six-nine' }), 4);
const warmAfter = warmUp(neighbourNumber({ kind: 'after', min: 2, max: 9 }), 6);

// ===========================================================================
// The week
// ===========================================================================

export const buildA07 = makeWeekBuilder({
  level: 'A',
  week: 7,
  conceptId: 'flat-shapes',
  conceptName: 'Flat shapes',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [
    { level: 'A', week: 1 },
    { level: 'A', week: 6 },
  ],
  pedagogyContract: 'v2',
  conceptFamily: 'place-value',
  conceptualAnchor: 'feeling the corners with a finger',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Fingers do the work here, ahead of eyes. Let your child trace each shape on the screen with a fingertip and say a number at every bump. Real things beat pictures here: a coaster, a cracker, a floor tile, a road sign out of the car window. Pick one up, name it, then turn it in their hands and ask whether it changed. Mascot present.',
  },
  explanation: {
    hook: say(
      'Shapes have bumps you can feel. Run your finger round the edge. Stop at every bump. Those bumps are corners.',
    ),
    whyBeforeHow: say(
      'A shape keeps its name when you turn it. Why? Because turning moves a shape but never changes it. We check by feeling the corners with a finger. Count the corners. Count the straight sides too. The count stays the same, so the name does too.',
    ),
    script: [
      {
        say: say('Look at this one. Count its bumps with me. Four!'),
        visual: 'A square standing flat, with a tick on each of its four matching sides.',
        figure: shapeFigure(
          { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], showArcs: false, showRightMarks: false },
          { alt: 'a square standing flat, with a tick mark on each side' },
        ),
      },
      {
        // The equal-corners talk FILL-ARCHITECTURE §3 asks A7 to plant for B22.
        // Shown, not asserted: the ticks say the sides match, and nothing here
        // is assessed, so the picture may hand over what it likes (L33).
        say: say('Every side matches every other side. Every corner matches too.'),
        visual: 'The same square, with all four ticks together showing four equal sides.',
        figure: shapeFigure(
          { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], showArcs: false, showRightMarks: false },
          { alt: 'the same square again, its four ticks showing four matching sides' },
        ),
      },
      {
        say: say('Now watch. I tip it over onto one corner. Count with me.'),
        visual: 'The same square turned 45 degrees, standing on its lowest corner.',
        figure: shapeFigure(
          { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], rotation: 45, showArcs: false, showRightMarks: false },
          { alt: 'the square tipped over, resting on one corner, ticks still on every side' },
        ),
      },
      {
        say: say('Some people call that a diamond. It is still a square.'),
        visual: 'The tipped square again, with its four sides and four corners unchanged.',
        figure: shapeFigure(
          { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], rotation: 45, showArcs: false, showRightMarks: false },
          { alt: 'the tipped square once more, four matching sides and four corners' },
        ),
      },
      {
        say: say('This one has three corners. That makes it a triangle.'),
        visual: 'A triangle standing flat, with a tick on each of its three equal sides.',
        figure: shapeFigure(
          { shape: 'triangle', angles: [60, 60, 60], sideMarks: [1, 1, 1], showArcs: false, showRightMarks: false },
          { alt: 'a triangle standing flat, with a tick mark on each side' },
        ),
      },
      {
        // THE TWO WORDS THE WEEK KEYS AND NEVER SAID (disclosure 10). Six
        // segments is the S-SCHEMA ceiling, so the pentagon takes the last one
        // and the hexagon is named in A7-GE-03, which already draws one.
        say: say('Count this one. Five corners! That makes it a pentagon.'),
        visual: 'A pentagon standing flat, with a tick on each of its five equal sides.',
        figure: shapeFigure(
          { shape: 'polygon', sides: 5, sideMarks: [1, 1, 1, 1, 1], showArcs: false },
          { alt: 'a pentagon standing flat, with a tick mark on each side' },
        ),
      },
    ],
    summary: say(
      'Turning a shape never changes it. Feel the corners and count them. That count gives the shape its name.',
    ),
    vocabulary: [
      // Six entries is the S-SCHEMA ceiling, and 'matching' gave up its place to
      // the two shape names (disclosure 10). The equal-parts language it glossed
      // is SHOWN rather than listed — script[1] and the ticked guided-example
      // figures — whereas 'pentagon' and 'hexagon' are words this week KEYS, and
      // a keyed word a pre-reader has never heard is not a word at all.
      { term: 'corner', kidGloss: 'a bump where two straight edges meet' },
      { term: 'side', kidGloss: 'one straight edge running between two bumps' },
      { term: 'flat shape', kidGloss: 'a shape you can draw round on paper' },
      { term: 'turn', kidGloss: 'moving a shape round without changing it' },
      { term: 'pentagon', kidGloss: 'a flat shape with five corners' },
      { term: 'hexagon', kidGloss: 'a flat shape with six corners' },
    ],
  },
  guidedExamples: [
    {
      ...ge(7, 1, 'modeled', scenePrompt('a square with 4 corners, standing upright', 'Tap the name of this shape.'), [
        {
          teacherSay: say('Watch me. I am parking my thumb on this bump.'),
          expected: '4',
        },
        { childDo: say('Travel the edge with me. Count each bump.'), expected: '4' },
        { teacherSay: say('Four corners. So this shape is a square.') },
      ], 'square'),
      visual: 'A square standing flat, its four sides ticked as matching.',
      figure: shapeFigure(
        { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], showArcs: false, showRightMarks: false },
        { alt: 'a square standing flat, four matching sides ticked' },
      ),
    },
    {
      ...ge(7, 2, 'completion', scenePrompt('the same square, turned 45 degrees, now tipped over', 'It has been tipped. Tap its name.'), [
        { teacherSay: say('I tipped it over. Nothing was taken off it.') },
        { childDo: say('Count the bumps again. Say each number.'), expected: '4' },
        { teacherSay: say('Still four. So it is still a square.') },
      ], 'square'),
      visual: 'The same square tipped onto one corner, its four ticks unchanged.',
      figure: shapeFigure(
        { shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], rotation: 45, showArcs: false, showRightMarks: false },
        { alt: 'the square resting on one corner, four matching sides ticked' },
      ),
    },
    {
      ...ge(7, 3, 'prompted', scenePrompt('a hexagon with 6 corners, turned 30 degrees, now tipped over', 'How many corners does this shape have?'), [
        { teacherSay: say('Pick a bump. Any bump will do.') },
        { childDo: say('Walk the whole edge, back to your bump.'), expected: '6' },
        // The other half of disclosure 10: the hexagon is named where one is
        // already drawn and the count has just been made, so the word arrives
        // attached to its six corners rather than as a label to memorise.
        { teacherSay: say('Six corners. That makes it a hexagon.') },
      ], '6'),
      visual: 'A hexagon resting on one corner, with a tick on each of its six sides.',
      figure: shapeFigure(
        { shape: 'polygon', sides: 6, sideMarks: [1, 1, 1, 1, 1, 1], rotation: 30, showArcs: false },
        { alt: 'a flat shape with straight edges, resting on a corner, every side ticked' },
      ),
    },
    {
      ...ge(7, 4, 'independent', scenePrompt('a triangle with 3 corners, turned 60 degrees, now tipped over', 'This shape has been turned. Tap its name.'), [
        { childDo: say('Feel the corners. Then say the name.'), expected: 'triangle' },
      ], 'triangle'),
      visual: 'A triangle turned point-down, with a tick on each of its three sides.',
      figure: shapeFigure(
        { shape: 'triangle', angles: [60, 60, 60], sideMarks: [1, 1, 1], rotation: 60, showArcs: false, showRightMarks: false },
        { alt: 'a flat shape with straight edges, turned point downwards, every side ticked' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the finger, the bumps, the name. Every shape has
    // been turned and every one of them landed back in its everyday pose, so
    // the idea "a turn is not a change" is met before it is ever tested.
    [
      { gen: warmTapNumeral, diff: 1 },
      { gen: nameFlat, diff: 1 },
      { gen: cornersFlat, diff: 2 },
      { gen: nameFlatAgain, diff: 2 },
    ],
    // Day 2 — the first tip. The naming discrimination arrives, and the two
    // pages beside it flip a coin for their pose, so the tilt stops being a
    // property of the slot on the very day it becomes the question.
    [
      { gen: warmWhichGroup, diff: 2 },
      { gen: nameTipped, diff: 3 },
      { gen: cornersEither, diff: 2 },
      { gen: nameEither, diff: 2 },
    ],
    // Day 3 — the count under a turn, the naming discrimination again, and the
    // puppet who gives a turned shape a brand new name.
    [
      { gen: warmSixNine, diff: 2 },
      { gen: cornersTipped, diff: 3 },
      { gen: nameTipped, diff: 3 },
      { gen: puppetDiamond, diff: 3 },
    ],
    // Day 4 — shapes where a four-year-old actually meets them, one asked for
    // its name and one for its corners, each drawn in a pose of its own.
    [
      { gen: warmAfter, diff: 2 },
      { gen: storyTile, diff: 2 },
      { gen: storyPatch, diff: 3 },
      { gen: cornersEither, diff: 2 },
    ],
    // Day 5 — one more shape each way, then out of the chair to sort real
    // things and say how you knew.
    [
      { gen: nameEither, diff: 2 },
      { gen: cornersTipped, diff: 3 },
      { gen: sortTell, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // Day 5 only. FILL-ARCHITECTURE §1 asked for one every day at band A and was
    // amended on 2026-08-09 to match the code: `validator.ts` S-SCHEMA rejects a
    // strip on Days 1-4 and `PuzzleGrove.tsx` renders Day 5's, hardcoded. This
    // is settled, not a deviation.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: a shape is a rule about its edges and its bumps, never a picture in a particular pose. Everything this week rests on that one sentence. Two moments ahead will read as slips, and neither is. First, your child looks at a square standing on its point and calls it a diamond. Nearly every square they have met so far sat flat, so a leaning one arrives as a stranger - this is arithmetic of experience, not a lapse. Resist handing over the right word. Put the square into their hands, let them do the turning, and count the corners before and after. At four, counting persuades and telling does not. Second, they get lost halfway round a five- or six-sided shape. Nothing is misunderstood there; they simply ran out of places to hold. Park their fingertip on the bump they set off from, so the walk has somewhere to come home to. Your best shape drawer is the kitchen one: coasters, crackers, floor tiles, toast cut corner to corner. Name one, turn it, ask whether it is still the same thing.',
  ],
  /**
   * The sanctioned band-A production puzzle, and the BUILDING is the mathematics.
   *
   * The catalog's non-computational focus for A7 is "shape art: build a picture
   * from shapes". The days READ a shape somebody else drew; here the child adds
   * a piece of their own and then reports a property of each, which needs the
   * two halves of the week pulling in opposite directions: the drawn piece has
   * to be COUNTED (its name is never given), and the piece they add is NAMED, so
   * its corners have to be RECALLED. That is the naming form run backwards, and
   * it is the only place in the week the child goes from a word to a count.
   *
   * Both numbers are code-derived from the same shape table the picture is built
   * from, and every piece named is a piece the child really has: the first is
   * drawn on the page and the second is the one they were just asked to add.
   * The drawn piece is tipped or upright on the same independent coin flip as
   * everywhere else, so the puzzle cannot become the one page where the pose
   * tells you something.
   */
  puzzle: (r) => {
    const i = r.int(0, SHAPES.length - 1);
    const first = SHAPES[i];
    const second = SHAPES[r.shuffle([0, 1, 2, 3].filter((x) => x !== i))[0]];
    const tipped = r.int(0, 1) === 1;
    const rotation = turnFor(r, first, tipped);
    return {
      id: 'A7-PZ-01',
      title: 'Puzzle Grove: Build a Shape Picture',
      puzzleType: 'construction',
      prompt: [
        `[image: ${shapeScene(first, rotation, tipped)}]`,
        say('Here is your first piece.'),
        say(`Draw a ${second.name} beside it to finish the picture.`),
        say('How many corners has each piece?'),
      ].join(' '),
      figure: shapeFig(r, first, rotation, tipped),
      answer: {
        // The child is asked for two COUNTS, so both counts on their own are a
        // complete answer; the key names the pieces because a set answer has to
        // say which count belongs to which, and the drawn piece's name is never
        // given to the child. Found by reading the generated puzzle: the key
        // read as though naming were part of the task, and it is not.
        value: `${first.name}: ${String(first.corners)}; ${second.name}: ${String(second.corners)}`,
        acceptableForms: [`${String(first.corners)} and ${String(second.corners)}`, `${String(first.corners)}, ${String(second.corners)}`],
        validation: 'set',
      },
      hintLadder: hints(
        'Travel the drawn piece first, one bump at a time.',
        'For your own piece, picture it before you draw it.',
      ),
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'build-a-shape-picture' },
  sprint: null,
  mastery: [
    { gen: nameEither, diff: 2 },
    { gen: nameTipped, diff: 3 },
    { gen: cornersEither, diff: 2 },
    { gen: cornersTipped, diff: 3 },
    { gen: storyPatch, diff: 3 },
    { gen: puppetDiamond, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; the same generator and difficulty in each slot, drawn fresh off a separate stream. 01: name a shape whose pose is a coin flip drawn before the shape is, so orientation is not even a property of the slot. 02: name a shape that has been tipped right over, which is the week discrimination - the shape is uniform over all four, so a turned page is a square exactly a quarter of the time and never more. 03: count the corners, pose again a coin flip, with authored options rather than the four buttons a choice-less numeric item is given at render time. 04: count the corners after a tip, with the near wrong count carrying the turn misconception rather than a counting slip. 05: a patch story, its pose drawn independently of its shape. 06: the puppet who renames a tipped shape, keyed on what it really is. Every option on every slot is a shape or a corner count that this same slot answers on other draws, and the truth sits at each of the three ranks a third of the time by construction rather than by average. Every prompt carries its corner count and its turn in degrees inside the picture direction, which is what gives the pack surface guard two tokens to sign on; without the turn a shape item would sign on one of four values and the guard would redraw itself into a bias.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'a-turned-shape-is-a-new-shape',
      description:
        'Treats the pose as part of the shape, so turning one makes it something else. A square standing on one of its points gets called "a diamond", and the same belief will rename a leaning triangle or hexagon just as readily. Nothing has gone wrong in the child: nearly every shape they have ever been shown was sitting flat, so a leaning one genuinely looks like a stranger.',
      exampleWrongAnswer: 'a square standing on its point, answered as a diamond',
      distractorRationale:
        'On every tipped naming page offer another shape name tagged to this belief, and draw the shape uniformly over all four so that "when it is turned, tap square" is worth a quarter and never more. Keep "diamond" out of the option set: it can never be the answer, so as a button it is struck out unread. It belongs in the puppet prose, where it is heard and argued with.',
      reteachPointer: 'explanation/script[3] (some people call that a diamond; it is still a square)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place-round-the-edge',
      description:
        'Counts corners correctly but loses the starting bump on the way round, so the count lands one over or one under. Far likelier on a five- or six-sided shape than on a triangle, and likelier again once the shape has been tipped and the usual landmarks have moved.',
      exampleWrongAnswer: 'a pentagon counted as six corners, the first bump met twice',
      distractorRationale:
        'Offer the corner counts of two OTHER shapes from the same four, and let the deal in disclosure 3 decide which side of the truth they fall. Both directions are open only where the shape table leaves room, and the honest numbers are these, measured over 6,000 served corner pages: with a square or a pentagon on the page the two wrong counts straddle the truth on 67.0% and 68.2% of draws, and are exactly one under and one over on 32.0% and 33.7%; with a TRIANGLE or a HEXAGON they never straddle it, because a triangle has no shape below it and a hexagon none above, so both wrong counts are forced to one side. Overall 33.7% of corner pages offer a landing place in both directions. The earlier wording of this line claimed both directions everywhere and was false on two shapes in four; widening the pool with counts no shape has - 2, 7 - would buy them back and cost a dead option (disclosure 3, L43). What holds on every draw is the part that matters: every number offered is a real corner count that this same slot keys on other draws, so none can be eliminated as impossible, and the truth still sits at each of the three ranks a third of the time.',
      reteachPointer: 'guidedExamples/A7-GE-03 (choose a bump to set off from, then walk the whole edge back to it)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'names-a-shape-with-a-different-count',
      description:
        'Reaches for whichever shape word is most familiar instead of the one the edge earns, so a five-sided shape comes back as a hexagon or a square. Name and count are not yet welded together, and the familiar word gets there first.',
      exampleWrongAnswer: 'a pentagon named as a hexagon',
      distractorRationale:
        'Offer the names of two other shapes from the same four, chosen so the truth sits at the smallest, middle and largest corner count in turn. Every name offered is keyed on other draws, so no name becomes the one that is never right.',
      reteachPointer: 'explanation/script[4] (three corners, so that makes it a triangle)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-about-the-other-piece',
      description:
        'Answers about the wrong piece when a page holds two of them - the drawn one and the one the child added - or gives a single number where two were asked for. Only the puzzle carries two shapes at once, so it is the only page this can happen on.',
      exampleWrongAnswer: 'the drawn piece counted twice, and the piece the child added not counted at all',
      distractorRationale:
        'Not offered as a button anywhere: the only page it can occur on is the puzzle, whose answer names both pieces and is checked as a set. It is listed so the reteach path exists when a child gives one number for two pieces.',
      reteachPointer: 'puzzle A7-PZ-01 (travel the drawn piece first, then picture your own)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Naming flat shapes by their corners, and finding out that turning one never changes it. We ran a finger round each edge and said a number at every bump, then met the same shape tipped right over and counted again. What is new this week is that the count refuses to move: a square standing on its point still has four corners, so it is still a square. Many children call that one a diamond, and taking that word apart is half of what the week is for.',
    improvingCandidates: [
      'travelling the whole edge with a finger before answering anything',
      'naming a shape that has been tipped over, not just one sitting flat',
      'counting the corners of a five- or six-sided shape without losing the place',
      'saying what stays the same when a shape is turned round',
      'sorting real objects by how many corners they have',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'letting a shape keep its name once it is turned - we will keep tipping real things over and counting them together',
      },
      {
        errorTag: 'procedure-slip',
        text: 'holding the starting corner while travelling round - a fingertip parked on it is the whole fix',
      },
      {
        errorTag: 'representation-misread',
        text: 'letting the corners choose the word, instead of choosing the word first',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted every corner with your finger, and you noticed the turn had changed nothing at all.',
      questionForChild: 'Can you find a flat shape in this room and count its corners?',
      schoolSyncHook: 'Does their class name shapes from blocks, tiles or road signs? Send word and these pages will follow suit.',
    },
    vocabularyForParent: [
      'corner (the bump where two straight edges meet - what the name is counted from)',
      'side (one straight edge; a flat shape has as many sides as corners)',
      'turning (moving a shape round; it never makes a different shape)',
      'diamond (not a shape name here - it is a square that has been tipped over)',
      'pentagon and hexagon (five corners and six corners - your child cannot read either word, so say them out loud with the counting every time one comes up)',
    ],
  },
});
