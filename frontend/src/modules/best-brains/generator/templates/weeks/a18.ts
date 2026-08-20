/**
 * Level A · Week 18 — "Add & subtract together" (conceptId:
 * add-and-subtract-within-10).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber`. a14, a16 and a17 are
 * the three weeks this one concludes and all three headers were read end to
 * end; a12 was read for its authored-choices ARCHITECTURE only. What is taken
 * from them is machinery — a per-pack deal, a per-form deal, a rank dealer, a
 * cards wrapper round a family generator, the habit of measuring what is
 * SERVED rather than what was meant. Not one sentence, scene, container, name,
 * verb pair, ladder, gloss, rationale or note below is theirs; the
 * token-overlap scan across `weeks/` that backs that up is in the report.
 *
 * FILL-ARCHITECTURE §3 row A18: anchor "choose the move"; core form "mixed
 * picture problems"; perceptual discrimination "+/− choice from the picture";
 * puppet error-analysis "picks + for a removal story"; Day-5 "true/false
 * sentence sort". Catalog: computational focus "mixed +/− within 10; choose the
 * operation from the story", non-computational Day-5 focus "which-operation
 * picture sort (join vs take away)".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THE WEEK CLAIMS, AND HOW THE CONTENT FORCES IT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  - **The page stops telling the child which operation to do.** In A14 every
 *    drawing joined; in A16 every drawing struck things out; in A17 every walk
 *    ran backwards along one path. Each of those weeks handed the operation
 *    over before the question began, and the child's work was to carry it out.
 *    Here the picture is the same whichever way the story goes — one group,
 *    drawn as it stood BEFORE anything happened — so the drawing states a
 *    quantity and settles nothing. The move has to be taken out of the words.
 *  - **The verb is not the operation, and the week says so with one word.**
 *    `tipsInOrOut` puts one picture under two stories that share every syllable
 *    but the last: things are tipped IN, or things are tipped OUT. A child who
 *    has learned that "gives" means take away and "finds" means add has nothing
 *    to hold on to, which is the point — keyword matching is the habit this
 *    week is built to break, and it is broken by a page that offers no keyword.
 *  - **Both answers are live everywhere.** Every counting page in the file can
 *    key a sum and can key a difference, so no card in the week can be struck
 *    out unread and no habit can score a page from the numbers alone. What
 *    that costs and what it buys is measured in disclosure 8, not asserted.
 *  - **The puppet joins two counts that the story parted**, and his number is
 *    not authored: `d_verify_binop_misconception_v1` computes it from the two
 *    counts the page states (disclosure 2). Nothing on his page calls him
 *    wrong; it says what he did, which was add.
 *  - **One page in the week cannot be answered by adding OR by subtracting**,
 *    and it is a certifying one. `gapsLeft` shows a counting frame, drops more
 *    counters into it, and asks about the cells that stay empty — so the story
 *    adds while the question takes away, and the answer is neither the sum nor
 *    the difference of the two numbers spoken (disclosure 4).
 *  - **Nothing is answerable off the sentence, and nothing is spoken before it
 *    is asked.** All sixteen non-retrieval items on Days 1–4 carry a figure
 *    built from their own drawn numbers, and no figure `alt` anywhere in the
 *    file holds a digit or a number word — which matters because at this band
 *    the alt is autoplayed BEFORE the question.
 *  - **No timers.** `sprint: null`. A timed element at band A is a hard fail.
 *  - **Four of the nineteen daily items look backwards** (21.1%), one opening
 *    each of Days 1–4, four formats from four weeks: the cross-out A16 taught,
 *    the count-back slip A17 spent a week on, the join A14 opened with, and the
 *    covered part A12 built, because a whole that can be split is the ground
 *    both of this week's moves stand on.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCLOSURES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. **THE PICTURE IS THE STATE BEFORE THE STORY, AND THAT IS THE WHOLE
 *    DESIGN.** Every predecessor drew the move: a plus between two groups
 *    (A14), a line through the departed (A16), arcs along a path (A17). A
 *    drawing that shows the move cannot be used in a week about choosing it —
 *    a child would read the operation off the page and never listen. So every
 *    assessed picture here is one plain group, and the only thing it asserts is
 *    the count it was drawn from (`assertsParam('a')`, re-derived by QG-13 at
 *    every seed). The move lives in the words and nowhere else.
 *
 *    The two exceptions are deliberate and neither is assessed for a number.
 *    The Day-1 and Day-5 picture sorts are the catalog's own non-computational
 *    focus — there the drawing DOES show the move, because naming what a
 *    picture does is the question (disclosure 6). And the lesson script draws
 *    both moves, because a worked example already carries its answer.
 *
 * 2. **THE RECIPE'S PUPPET SLIP IS DERIVABLE, AND IT COSTS NOTHING.** Row A18's
 *    slip is "picks + for a removal story", which is an OPERATION SWAP over one
 *    operand pair — the exact shape `d_verify_binop_misconception_v1` exists
 *    for. With `{a, b, op: '-', wrongOp: '+'}` it returns `{correct: a − b,
 *    wrong: a + b}`: the truth of the page and the puppet's own number, both
 *    recomputed from the two counts the story states. QG-11 checks both halves
 *    at every seed — the keyed option against `correct`, the prompt against
 *    `wrong` — so a puppet who announced a number the misconception does not
 *    produce would fail the pack. Nothing is authored, reframed or invented.
 *
 *    Kit §E2.3 asks for ten minutes of hunting before any reframe; here there
 *    was nothing to hunt. a14 had to relocate its slip and said so; a12 proved
 *    its own undrawable; a16 found this same identity from the other side. The
 *    third time is the charm and it is worth stating why: an operation swap is
 *    the ONE misconception family the library expresses natively, and A18's
 *    recipe row happens to name exactly that.
 *
 * 3. **EVERY COUNTING PAGE PINS `d_verify_binop_v1` AND NOT THE FAMILY'S
 *    `a_join_v1` / `a_takeaway_v1`, FOR THE REASON THREE WEEKS HAVE NOW
 *    RECORDED.** Both family templates register an `answerFor`, and QG-5
 *    re-derives an `answerFor` only for the five numeric validations — never
 *    for `choice-key`. At this band a certifying page MUST be `choice-key`: a
 *    pre-reader cannot type, and a numeric band-A item with no authored choices
 *    falls through to `tapOptionsFor`, which invents four buttons from a
 *    function that cannot know the slot's answer range (L53). `d_verify_binop_v1`
 *    registers a `verifyFor`, which QG-11 runs on choice items, and `{a, b, op}`
 *    recomputes exactly the number the story comes to. Same arithmetic, live
 *    audit. **Recorded for the orchestrator, now for the fourth week running:
 *    `earlynumber` wants verify twins for `a_join_v1` and `a_takeaway_v1`.**
 *
 * 4. **THE SLOT NEITHER HABIT CAN WIN, AND WHY IT HAD TO BE BUILT RATHER THAN
 *    FOUND.** A17's `firstHop` keys a number that is neither the sum nor the
 *    difference of the two numbers on its page, and that is what stopped a
 *    blind subtracter certifying. A18 needs the same and cannot borrow it,
 *    because with two spoken numbers and one binary operation every inverse
 *    question a story can ask IS a sum or a difference: "how many were there
 *    before some left" is the sum, "how many arrived" is the difference. That
 *    is arithmetic, not a shortage of imagination, and it was worked through
 *    before anything was written.
 *
 *    The way out is to make the two spoken numbers not be the two operands.
 *    `gapsLeft` draws a counting frame holding `f` counters, says so, says that
 *    `g` more go in, and asks how many cells stay EMPTY. The answer is
 *    `10 − f − g`; the ten is in the drawing and is never spoken. So the story
 *    is a join and the question is a take-away, which is the week's own lesson
 *    stated as hard as it can be stated, and four coincidences are barred at
 *    the pool so no blind rule can pick it up by accident:
 *      · `f + g = 5` would make the answer equal the sum;
 *      · `f = 5` would make it equal the difference;
 *      · `10 − g = 2f` would make it equal the counters already in;
 *      · `10 − f = 2g` would make it equal the counters arriving.
 *    Eleven pairs survive, keying every value from one to eight except five —
 *    five is unreachable precisely BECAUSE it is the sum-coincidence, so it is
 *    also barred from every card the slot offers (disclosure 5).
 *
 * 5. **WHICH NUMERALS MAY BE OFFERED IS COMPUTED FROM THE POOL, NOT DECLARED BY
 *    HAND (L38).** a17 clipped each slot's cards to a closed INTERVAL its
 *    answer lives in. That is right until a bar punches a hole in the middle of
 *    the interval, which is exactly what disclosure 4's barred pairs do. So
 *    every page type here derives the SET of values it can key by running its
 *    own pair pool through its own answer function at module load, and no card
 *    outside that set is ever built. A gate that is computed cannot drift from
 *    the pool it guards, and it caught the numeral five on `gapsLeft`, which an
 *    interval would have offered on a fifth of that slot's draws and keyed on
 *    none.
 *
 *    The sets, for the record: a join page keys 4 through 10, a take-away page
 *    keys 1 through 8, the discrimination keys 1 through 10 because both moves
 *    live in one slot, the puppet keys 1 through 8, and the frame page keys
 *    {1,2,3,4,6,7,8}. Zero is offered nowhere and is nowhere the answer: no
 *    story here empties a group, and no draw makes a group of none.
 *
 *    **The error-analysis page is the one structural exception, and this week
 *    pays less for it than its predecessors did.** The puppet's number is
 *    `a + b`, which is larger than the truth by construction, so on the draws
 *    where it exceeds eight it is a numeral the slot can never key — the L38
 *    shape, created by the form itself. a16 offered it on every draw and
 *    reported it as what error analysis costs; a17 met the same thing from the
 *    plus-one side. Here the card is offered only when it falls inside the
 *    slot's own key set, which is 10 of the 17 pairs; on the other 7 the
 *    puppet's number is still SAID in the prompt (QG-11 checks that) and simply
 *    is not a tap target. So no numeral in this week is offered at a slot that
 *    cannot key it, anywhere, on any draw.
 *
 * 6. **THE DAY-5 PICTURE SORT IS THE FAMILY'S OWN AND IT IS A TWO-WAY PAGE.**
 *    The catalog's non-computational focus for this cell is "which-operation
 *    picture sort (join vs take away)", and `joinOrTakeAway` recomputes exactly
 *    that from `{isJoin}`. It offers two cards, so a coin scores half of it,
 *    and that floor is stated here rather than hidden: a16 shipped the same
 *    two-way sort for the same reason. A third bin would fix it and cannot be
 *    pinned — the transform is binary by construction, and "nothing moved"
 *    would be a label no draw of this generator can ever make true, which is a
 *    dead option dressed as a fix (L38). **Recorded for the orchestrator,
 *    seconding a16: `a_join_or_take_v1` wants a third branch**, and a
 *    one-group figure with no marks is the picture it would need.
 *
 *    What the week does about the floor instead: the sort is served twice and
 *    never certifies anything. Every slot that DOES certify keys a number, so a
 *    child who taps a word has produced no evidence and is never asked to.
 *
 * 7. **THE NUMBER SENTENCE IS SPOKEN AND TAPPED, AND IT IS STILL NOT DRAWN.**
 *    §3 gives A18 the Day-5 signature "true/false sentence sort", and there is
 *    no primitive anywhere in `lib/figures.ts` that draws a numeral, an
 *    operator, an equals sign or an answer box. a14 asked for one, a16
 *    seconded it, a17 recorded that A14, A15, A17 and A18 had each now needed
 *    it. This is the fourth ask and the first where the sentence has to carry a
 *    RESULT: `readsTheSentence` offers three sentences that differ from one
 *    another by exactly one symbol — the true one, the same numbers with the
 *    other sign, and the right sign with a result one out — and the child taps
 *    the one that tells the truth. The sentences live on the tap targets and in
 *    the lesson script, which is where a band-A sentence honestly can live.
 *
 *    **What could not be built, and what shipped instead.** The recipe's own
 *    illustration is a yes/no judgement over a single sentence, which is a coin
 *    flip and which is why it became a three-card sort. Nothing in the registry
 *    can read a sentence, so the pin proves the keyed card's ARITHMETIC rather
 *    than its truth: `d_verify_binop_v1` recomputes what the story comes to and
 *    the answer records that number beside the sentence. The match cannot come
 *    apart anyway, because one drawn boolean writes the story's last word, the
 *    card's sign and the params' `op` in a single expression.
 *
 * 8. **WHAT MEASURING FOUND, AND IT WAS SEVEN REAL DEFECTS.** Every one passed
 *    the 200-seed validator run and every one would have shipped.
 *      · **THE MASTERY FORM CERTIFIED A BLIND SUBTRACTER.** The first draft
 *        keyed a difference on four of the six slots — the take-away story, the
 *        puppet, and both directions of the discrimination on the packs where
 *        the coin fell that way — so a child who takes whatever two numbers a
 *        page states and never decides anything scored 5 of 6, which IS the
 *        pass mark, on a third of forms. That is L51 exactly, and a16 lost the
 *        same argument twice before repairing it. The form is now DEALT rather
 *        than drawn: one slot always keys a sum, two always key a difference,
 *        one can key neither, and the two discrimination slots take one
 *        direction each. Both habits are pinned to a fixed score on 100% of
 *        forms — always-add takes 2 of 6, always-subtract 3 of 6 — while a
 *        child who reads the question still answers all six. Per-slot and
 *        per-habit tables are in the report.
 *      · **THE COIN WAS NOT ENOUGH, AND THE DEAL HAD TO REACH THE DAILIES
 *        TWICE OVER.** Four fair coins land the same way on one pack in eight,
 *        so packs existed whose Day-2 and Day-3 discriminations both tipped
 *        inwards and whose Day-4 stories all filled a container. Deciding each
 *        pair once per pack fixed Day 4 but not Days 2 and 3: with the core
 *        page and the discrimination dealt out of SEPARATE coins, half of all
 *        packs still produced a working day on which every story pulled the
 *        same way — 17.0% of day-pages, measured. One coin now settles both,
 *        read the opposite way for the discrimination, and both the day pages
 *        and the mastery forms carry one of each on 100% of packs.
 *      · **THE JOIN PAGES SAT AT THE TOP RANK.** A total is larger than every
 *        honest miscount except an over-count, so the first pool held three
 *        cards below the key and one above and the key was the biggest card on
 *        62% of draws — "tap the biggest" as a strategy, which is the commonest
 *        form of L43. Carrying both over-counts (one thing counted twice, and
 *        two) gives the dealer something on the high side, and a uniform target
 *        rank then measures flat. The take-away pages had the mirror problem
 *        from the other end and took the mirror repair.
 *      · **THE FRAME PAGE OFFERED A NUMERAL IT COULD NEVER KEY.** Clipping its
 *        cards to the interval 1–8 offered the numeral five, which the barred
 *        sum-coincidence makes unreachable at that slot (disclosure 4). Deriving
 *        the key set from the pool instead of declaring an interval removed it,
 *        and the same change is what lets the puppet's card be withheld exactly
 *        when it would be unkeyable (disclosure 5).
 *      · **THE PUPPET'S THIRD CARD PINNED THE KEY TO THE MIDDLE.** His number
 *        is always above the truth, so a third card taken from below put the
 *        key at rank 1 on every draw where one existed. The side is now drawn,
 *        and on the draws where his card is withheld the ordinary dealer runs
 *        and the key can reach the top like anywhere else.
 *      · **TWO PAGE TYPES SHIPPED THE SAME QUESTION.** The core page and the
 *        discrimination both drew one group and asked "How many are there
 *        now?", so a pack that served both read as one page printed twice. The
 *        stories still share their shape — that is what makes a discrimination
 *        a discrimination — and the four questions no longer do.
 *      · **A SHARED WARM-UP CARRIED A NUMERAL IT COULD NEVER KEY.**
 *        `puppetSlip`'s count-back branch builds its own three cards, and the
 *        numerals it reaches run one above and one below what its question can
 *        answer, so at the range this week uses it offered 9, 10 or 0 on 10.7%
 *        of that slot's draws and keyed none of them — at ANY range, since the
 *        truth tops out one below the start while the puppet's number tops out
 *        at it. The cards are rebuilt from outside through this week's own
 *        wrapper (disclosure 12); the family generator is untouched and
 *        reported.
 *
 * 9. **WHAT ONLY READING THE GENERATED WEEK FOUND.** Seven things, and no gate
 *    sees any of them.
 *      · The first core prompt said "How many are left?", which is A16's
 *        sentence and A17 had already caught itself reaching for it. A week
 *        where the group may have GROWN cannot ask what is left, so the
 *        question became what there is now.
 *      · The first discrimination said "puts in" against "takes out" — two
 *        words apart, and the verb alone answered it. One verb doing both jobs
 *        is the whole idea, so both stories now tip, and only the last word
 *        moves.
 *      · Every story page named its person twice in two short sentences. The
 *        container sentences now open with the things rather than the person,
 *        so the name is said once and the count still reads correctly at every
 *        draw.
 *      · The frame page asked "How many cells are empty?", which is true of
 *        the drawing before the story as well as after it — two defensible
 *        answers, the §E2.7 class. It now asks which cells STAY empty, which
 *        has one reading.
 *      · The discrimination's scene bracket named the tub, which no primitive
 *        draws — a caption describing something not on the screen, and the L27
 *        class. What is drawn is the group; the tub is narration and now lives
 *        only in the question, where the child hears it.
 *      · Its question read "How many things FILL the tub now?", which is false
 *        of a tub that is not full and is exactly the sort of word a four-year
 *        -old takes literally.
 *      · Three of the four container asks repeated their own opening verb — 
 *        "shells sit in a pail … how many shells sit in the pail now" — and one
 *        core verb pair ended "and drops 3", which at this band reads as easily
 *        as dropping something IN as letting it go. Both were rewritten.
 *
 * 10. **A SHARED TRANSFORM IS WHY SIX PAGE TYPES CARRY A DISTINGUISHING PARAM.**
 *    The assembler compares a Form-B slot against every Form-A core on
 *    `{templateId, params}` alone, so two different questions holding the same
 *    two numbers read as one repeat and the draft is rebuilt — spending a
 *    freshness surface it then throws away. a16 found this at seed 471 and a17
 *    seconded it. Every page here that pins `d_verify_binop_v1` carries one
 *    honest param naming what it asked (`asks: 'now' | 'tipped' | 'gaps' |
 *    'sentence' | 'drawn'`, or `place`), so a core page and a story that both
 *    drew six-and-two are no longer the same question to the check.
 *    **Recorded for the orchestrator, thirding a16 and a17:** the collision
 *    check should include `type` and `cognitiveOp`, or a discarded draft should
 *    give its surface back.
 *
 * 11. **BB-G1 DOES NOT FIRE ON THIS WEEK EITHER, AND THE DELTA SHIPS ANYWAY.**
 *    `conceptFamily('add-and-subtract-within-10')` strips the magnitude range
 *    and returns `add-and-subtract`, while A14 and A15 reduce to `addition` and
 *    A16 and A17 to `subtraction`. No earlier cell shares the family, so
 *    `priorSameFamily` returns an empty list and §6.13's precondition never
 *    triggers — on the one week of the level that is nothing BUT a deepening of
 *    four earlier ones. a17 found the same hole from the `meeting-` side and
 *    the ledger was repaired for it; this is the second shape of the same
 *    defect and the repair does not reach it. **Recorded for the orchestrator:
 *    the family key needs a synonym table, or the ledger needs an explicit
 *    `deepens` edge**, because a compound concept id will never share a prefix
 *    with the two simple ones it composes. Reported, not fixed — `lib/ledger.ts`
 *    is not this file's to change.
 *
 * 12. **SHARED-LIBRARY DEFECTS FOUND WHILE WIRING THE WARM-UPS.** Two family
 *    generators still interpolate a count into the picture's accessible name,
 *    which at this band is autoplayed to a pre-reader before the question:
 *    `puppetSlip`'s count-back branch says how many are crossed out, and
 *    `partnersHiding` names the frame's own capacity. Both are repaired HERE by
 *    a local wrapper that replaces the alt and touches nothing else, because a
 *    week file may not edit `lib/`. `pictureJoin` and `pictureTakeAway` were
 *    already repaired upstream and arrive clean. Reported, not fixed.
 */

import type { BBFigure, FigureAssertion } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  joinOrTakeAway,
  partnersHiding,
  pictureJoin,
  pictureTakeAway,
  puppetSlip,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsParam, counterGroups, counters, mathSentence, tenFrame } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Eight people, drawn fresh per page. Nothing below hardcodes one (kit §F.3). */
const FOLK = ['Enzo', 'Petra', 'Chidi', 'Lark', 'Imre', 'Noor', 'Cassia', 'Vesna'] as const;

/** The frame every counting picture in this week fits inside. */
const HOW_MANY_CELLS = 10;

// ===========================================================================
// The numbers, held as a MOVE rather than as two loose counts
// ===========================================================================

/**
 * `a` is the group that was already there and `b` is the group that moves, so
 * one drawn pair serves both directions: `a + b` if the story brings them and
 * `a − b` if it takes them. Holding the PAIR is what keeps the freshness
 * machinery fed — `drawUniqueItem` signs an item on its format class plus its
 * sorted numeric tokens, so each page type has exactly these surfaces, and
 * drawing the two counts separately would make the crowded pairs far commoner
 * than the sparse ones.
 */
interface Move {
  a: number;
  b: number;
}

/**
 * EVERY PAIR THE WEEK MAY DRAW, AND THE SINGLE BAR THAT SHAPES THE POOL.
 *
 * Both moves have to stay inside ten and both have to leave something behind,
 * so `a + b ≤ 10` and `a − b ≥ 1`; the group that moves is at most four,
 * because A15 taught counting on by one, two or three and asking for five here
 * would be teaching a second thing under cover of the first.
 *
 * The bar is `a ≠ 2b`. When the group already there is exactly twice the group
 * that moves, the difference and the moving count are the SAME NUMBER — so a
 * child who taps the smaller number the story said is ticked by accident on
 * every take-away page, and the page's purpose is exactly reversed. a16
 * measured that coincidence keeping a blind habit alive at 19% of certifying
 * forms after its main repair, and the shared `pictureTakeAway` alt was rewritten
 * upstream for the same reason. Three pairs go; seventeen remain.
 */
const MOVES: readonly Move[] = (() => {
  const out: Move[] = [];
  for (let a = 2; a <= 9; a++) {
    for (let b = 1; b <= 4; b++) {
      if (a + b <= HOW_MANY_CELLS && a - b >= 1 && a !== 2 * b) out.push({ a, b });
    }
  }
  return out;
})();

/**
 * The pairs the PUPPET may draw. Identical to the rest — his page needs both a
 * live difference and a stateable sum, which every pair supplies — and named
 * separately so the reason his cards behave differently (disclosure 5) sits
 * beside the pool rather than inside the generator.
 */
const PUPPET_MOVES: readonly Move[] = MOVES;

/**
 * THE FRAME PAGE'S PAIRS, AND ALL FOUR BARS ARE THE POINT OF THE PAGE.
 *
 * `f` counters sit in the frame, `g` more go in, and the answer is the cells
 * that stay empty: `10 − f − g`. The page exists to be unwinnable by blind
 * arithmetic (disclosure 4), so every pair whose answer coincides with a value
 * a blind rule produces is refused: the sum of the two spoken numbers, their
 * difference, and either of the two numbers themselves. Eleven pairs survive.
 */
interface Fill {
  f: number;
  g: number;
}

const FILLS: readonly Fill[] = (() => {
  const out: Fill[] = [];
  for (let f = 1; f <= 8; f++) {
    for (let g = 1; g <= 3; g++) {
      const gaps = HOW_MANY_CELLS - f - g;
      if (gaps < 1) continue;
      if (gaps === f + g || gaps === f - g || gaps === f || gaps === g) continue;
      out.push({ f, g });
    }
  }
  return out;
})();

// ===========================================================================
// Which numerals a slot may offer — derived, never declared (disclosure 5)
// ===========================================================================

/**
 * Run a pool through the page's own answer function and keep the answers. A
 * card outside this set is a card a child could learn to strike out unread, and
 * a set computed from the pool cannot drift out of step with it the way a
 * hand-written interval can.
 */
function keysOf<T>(pool: readonly T[], answer: (v: T) => number): ReadonlySet<number> {
  return new Set(pool.map(answer));
}

const JOIN_KEYS = keysOf(MOVES, (m) => m.a + m.b);
const PART_KEYS = keysOf(MOVES, (m) => m.a - m.b);
/** One slot, both moves: the discrimination is the only page that can key either. */
const EITHER_KEYS: ReadonlySet<number> = new Set([...JOIN_KEYS, ...PART_KEYS]);
const GAP_KEYS = keysOf(FILLS, (v) => HOW_MANY_CELLS - v.f - v.g);

// ===========================================================================
// The word cap, counted the way the gate counts it
//
// Two ceilings exist and only one is the law here. `earlynumber`'s `ask()`
// weighs a whole prompt, which would refuse this week's three-sentence puppet
// page for a length none of its sentences has. The readability gate weighs ONE
// SENTENCE wherever a child hears it, and the gate is the law. Its splitter and
// its counter are reproduced below and every authored child-facing string goes
// through them, so an eleventh word stops the module loading or stops the page
// being built — never a reviewer counting on their fingers.
//
// Figure alts are deliberately not routed through it: an alt is the whole of
// what a child on a screen reader has instead of the drawing, and the only way
// to shorten one is to describe the picture less.
// ===========================================================================

const MOST_WORDS = 10;

function spoken(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const words = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (words > MOST_WORDS) {
      throw new Error(
        `A18 readability: one breath of ${String(words)}, and this band allows ${String(MOST_WORDS)} — "${sentence}"`,
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
 * No ladder may serve more than twice across the sixteen non-retrieval core
 * items, which puts a floor of eight distinct ladders under the week before a
 * page is designed (kit §E, A-band lesson 1). Twenty-six ship here, one per
 * page and one per certifying slot, and no two are alike. The arithmetic is
 * only half the reason: "listen for the last word" and "look for lines drawn
 * across some of them" are not the same nudge, and neither could live in the
 * shared family without being said in all twenty-four Level-A weeks at once.
 *
 * The closure rewrites one field of a finished draft and draws nothing itself,
 * so the prompt QG-1 and QG-4 sign is untouched. Local generators take their
 * ladder as a required ARGUMENT instead, so a page with no help does not
 * compile.
 */
function withHelp(base: ItemGen, rungs: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: rungs });
}

/** Put an earlier week back in front of the child as a game, never as review. */
function asGame(base: ItemGen, week: number): ItemGen {
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
 * they are being asked. A number word is a number wherever it appears (L48):
 * a14 shipped an alt whose "two groups of" spoke the answer on every draw whose
 * total was two, and a17 found the bare word "one" hiding inside its own path
 * description. So an alt here says what the drawing LOOKS like and never how
 * much of it there is.
 */
function rowAlt(noun: string): string {
  return `${noun} standing together, with room around them`;
}

const FRAME_ALT = 'a counting frame with some cells filled and the rest standing open';

/** One plain group, drawn as it stood before the story touched it. */
function groupFigure(n: number, noun: string, asserts: FigureAssertion): BBFigure {
  return counters(n, noun, { arrangement: 'in a row', alt: rowAlt(noun), asserts });
}

// ===========================================================================
// Choosing the cards
// ===========================================================================

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Each candidate once, in the order offered, with everything the slot cannot
 * key thrown away (disclosure 5).
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
 * Two wrong values, with the truth's RANK aimed rather than left to fall.
 *
 * L43 states the defect as an invariant and not as a direction: the answer must
 * not sit at a fixed rank among the numbers on offer. All three positions are
 * traps — every card above makes "tap the smallest" a strategy, every card
 * below makes "tap the biggest" one, and one either side makes "tap the middle"
 * one. A join page falls into the second by default, because a total is bigger
 * than almost every honest miscount of it; a take-away page falls into the
 * first for the mirror reason.
 *
 * So a target rank is asked for — 0 puts the truth lowest, 1 in the middle, 2
 * highest — and when the drawn pair cannot reach it the deal steps to whichever
 * rank is nearest. Stepping rather than cycling matters: a cycle would pour
 * every unreachable target into the one shape that is always buildable.
 *
 * Deterministic throughout. A branch that cannot be built is rejected on its
 * pool sizes before it draws anything, so the same seed always spends the same
 * number of draws (kit §E2.4 — never a redraw loop).
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
  throw new Error('A18 dealCards: no pairing of honest values exists for this draw');
}

// ===========================================================================
// What a child was doing when they tapped something else
// ===========================================================================

/**
 * Read off the VALUE and the drawn pair rather than off the branch that
 * produced them, so what is said about a card cannot drift from the card
 * itself. The tests run in the week's own order of importance: the other move
 * first, because choosing between the two is what the week is for, then the
 * whole-page misreadings, then the ordinary miscounts. Teacher-facing, so no
 * word cap applies.
 */
function whyNotTheTotal(v: number, m: Move): Card {
  const text = String(v);
  if (v === m.a - m.b) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'The two counts parted when the story put them together. This is the whole decision the week is about, answered the other way round, and it is the single most useful card on any page whose story brings something.',
    };
  }
  if (v === m.a) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'The group that was already there, handed back unchanged. The story was heard as a description of what is on the table rather than as something happening to it, so nobody arrived at all.',
    };
  }
  if (v === m.b) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'Only the arrivals counted. The newcomers are the interesting part of a join story and a child who watches them can forget that the old group is still sitting there.',
    };
  }
  if (v === m.a + m.b - 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One short. The count crossed from the old group into the new one and let a single thing slip past unnamed, which is where almost every counting slip in a join happens.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'Beyond the total. Either something at the seam was named twice over, or the counting words outlasted the things themselves.',
  };
}

function whyNotTheRest(v: number, m: Move): Card {
  const text = String(v);
  if (v === m.a + m.b) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'The two counts joined when the story parted them. Adding is the move a child owns most securely, so any story carrying a pair of numbers attracts it, and it is exactly what the puppet does on his own page.',
    };
  }
  if (v === m.a) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'The starting group given back whole. The story was taken as a picture caption rather than as an event, so nothing was ever removed from anything.',
    };
  }
  if (v === m.b) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'The departing amount given for the staying one. Both amounts are said aloud and only one answers the question; this child took the one the story dwelt on.',
    };
  }
  if (v === m.a - m.b + 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One too many kept. The removing stopped a beat early, usually because the first thing to go was counted as though it were still standing there.',
    };
  }
  if (v === m.a - m.b - 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One too few kept. The removing carried on after the story had finished taking, which is what happens when the fingers move faster than the words.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'Out by more than a single thing. The group was re-counted from scratch and lost its place partway along.',
  };
}

/** The frame page's cards, read off the fill rather than off a branch. */
function whyNotTheGaps(v: number, fl: Fill): Card {
  const text = String(v);
  if (v === HOW_MANY_CELLS - fl.f) {
    return {
      text,
      errorTag: 'task-comprehension',
      rationale: 'The gaps counted before the story happened. The picture was read and the sentence was not, so the counters that were about to arrive never took their cells.',
    };
  }
  if (v === fl.f + fl.g) {
    return {
      text,
      errorTag: 'concept-misconception',
      rationale: 'The counters counted where the cells were wanted. The story adds and the question subtracts, and this is the answer a child gives when the story is followed instead of the question — which is precisely what this page exists to catch.',
    };
  }
  if (v === fl.f) {
    return {
      text,
      errorTag: 'representation-misread',
      rationale: 'The counters already in the frame, handed over as they stand. It is the one number both the picture and the sentence agree on, which is what makes it tempting when the question has not been understood.',
    };
  }
  return {
    text,
    errorTag: 'procedure-slip',
    rationale: 'The empty cells miscounted by a step or two. Gaps are harder to count than things, because there is nothing to touch and nothing to move aside.',
  };
}

// ===========================================================================
// Deciding which way a story goes — dealt, never left to a coin (L52)
// ===========================================================================

type Move2 = 'join' | 'part';
type Decide = (rng: Rng, guard: TupleGuard) => Move2;

const always = (way: Move2): Decide => () => way;

/**
 * WHICH DAY GETS WHICH MOVE IS DECIDED ONCE PER PACK.
 *
 * Drawn per page, two fair coins land the same way on one pack in four, and a
 * pack whose Day-2 and Day-3 pages both bring things is a pack where choosing
 * was never once required. So the coin is spent at whichever of the two pages
 * is built first and read back afterwards — a pure function of the day and the
 * one token stored in the pack's guard, so a page rebuilt by `drawUniqueItem`
 * or by the assembler's echo check gets the move it already had rather than the
 * other day's. Idempotent rather than consuming, for the reason a12 first
 * recorded: a schedule spent per CALL hands the next page the wrong side.
 *
 * Two separate tokens, because the core pages and the discrimination pages are
 * dealt independently — a pack in which every page on a day pulls the same way
 * is exactly what the deal exists to prevent.
 */
function dealtDay(rng: Rng, guard: TupleGuard, token: string): 2 | 3 {
  if (guard.taken(`${token}=2`)) return 2;
  if (guard.taken(`${token}=3`)) return 3;
  const day: 2 | 3 = rng.chance(0.5) ? 2 : 3;
  guard.add(`${token}=${String(day)}`);
  return day;
}

const coreDay = (day: 2 | 3): Decide => (rng, guard) =>
  dealtDay(rng, guard, 'a18:core-join-day') === day ? 'join' : 'part';

/**
 * The discrimination takes the OTHER move on the same day, out of the SAME
 * coin. Dealt independently it measured a Day 2 whose two decidable pages both
 * pulled the same way on half of packs — and a day on which every story goes
 * one way is a day where choosing was never required. One coin for both, read
 * the opposite way, puts one of each on every working day of every pack.
 */
const tipDay = (day: 2 | 3): Decide => (rng, guard) =>
  dealtDay(rng, guard, 'a18:core-join-day') === day ? 'part' : 'join';

/** Day 4's third story, dealt once per pack so the trio is never all one way. */
const thirdStory: Decide = (rng, guard) => {
  if (guard.taken('a18:third-story=join')) return 'join';
  if (guard.taken('a18:third-story=part')) return 'part';
  const way: Move2 = rng.chance(0.5) ? 'join' : 'part';
  guard.add(`a18:third-story=${way}`);
  return way;
};

/**
 * ONE OF EACH DIRECTION INSIDE EVERY MASTERY FORM.
 *
 * Keyed on the form's own rng object, because `makeWeekBuilder` gives Form A
 * and Form B separate streams and hands the SAME stream back on a rebuild — so
 * a rebuilt page finds the direction it was already given rather than the other
 * form's, which a plain counter could not distinguish. Nothing survives the
 * pack: the streams are new every time and the entries go with them.
 *
 * The guarantee is per FORM. Every form a child sits carries one page that
 * tips in and one that tips out, so neither blind move can take both, and the
 * two forms are dealt independently of one another.
 */
const FORM_TIP_IN = new WeakMap<Rng, number>();
const TIP_SLOTS = [2, 6] as const;

function formTip(slot: (typeof TIP_SLOTS)[number]): Decide {
  return (rng) => {
    let inSlot = FORM_TIP_IN.get(rng);
    if (inSlot === undefined) {
      inSlot = rng.chance(0.5) ? TIP_SLOTS[0] : TIP_SLOTS[1];
      FORM_TIP_IN.set(rng, inSlot);
    }
    return inSlot === slot ? 'join' : 'part';
  };
}

// ===========================================================================
// Local generator 1 — the mixed picture problem (the week's core form)
// ===========================================================================

/**
 * One group drawn, one story told, one question: how many now?
 *
 * The picture holds only the starting group, so it states a quantity and
 * decides nothing (disclosure 1); the story decides everything. Each instance
 * carries its own pair of verbs, so a child meets several ways of saying that
 * something arrived and several ways of saying that something went, rather than
 * two words repeated all week — and no verb is ever a reliable guide, because
 * the discrimination pages use the same verb for both.
 */
interface Verbs {
  join: (b: number) => string;
  part: (b: number) => string;
}

function mixedPicture(side: Decide, verbs: Verbs, rungs: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    // Taken once per item and OUTSIDE the freshness loop: a redraw may change
    // the numbers, it may not spend the other page's move.
    const way = side(rng, guard);
    return drawUniqueItem(rng, guard, (r) => {
      const m = r.pick(MOVES);
      const noun = r.pick(COUNTABLE_NOUNS);
      const who = r.pick(FOLK);
      const truth = way === 'join' ? m.a + m.b : m.a - m.b;
      const keys = way === 'join' ? JOIN_KEYS : PART_KEYS;
      // BOTH OVER-COUNTS ARE CARRIED, and that is what lets the rank rotate.
      // Almost every honest miscount of a join sits BELOW the total, so a pool
      // with one card above it could not reach the top rank at all and the key
      // was the biggest number on the page six draws in ten (disclosure 8).
      const pool = offerable(
        way === 'join'
          ? [m.a - m.b, m.a, m.b, m.a + m.b - 1, m.a + m.b + 1, m.a + m.b + 2]
          : [m.a + m.b, m.a, m.b, m.a - m.b + 1, m.a - m.b - 1, m.a - m.b - 2],
        truth,
        keys,
      );
      const wrongs = dealCards(r, pool, truth, r.int(0, 2)).map((v) =>
        way === 'join' ? whyNotTheTotal(v, m) : whyNotTheRest(v, m),
      );
      const { choices, correctKey } = makeChoices(r, String(truth), wrongs);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: withScene(
          'one bunch of things, drawn all together',
          `${who} has ${countNoun(m.a, noun)} ${way === 'join' ? verbs.join(m.b) : verbs.part(m.b)}. How many ${noun} are there now?`,
        ),
        figure: groupFigure(m.a, noun, assertsParam('a')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(truth)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: m.a, b: m.b, op: way === 'join' ? '+' : '-', asks: 'now' },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'choose-operation' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 2 — the discrimination: tipped in, or tipped out?
// ===========================================================================

/**
 * One picture, one verb, two stories a single word apart.
 *
 * `Enzo tips 2 shells in.` or `Enzo tips 2 shells out.` The drawing does not
 * move, the question does not move, and the verb — the thing a child learns to
 * hunt for — is identical on both sides. Only the last word decides, which is
 * the lesson the whole level has been building towards: the words around a
 * number tell you what happened, and no single word can be trusted to do it
 * alone.
 *
 * Both landings are live keyed values, so no card can be ruled out unread, and
 * the two sides print the SAME NUMERALS, which is the b09 lesson (kit §E2.9a):
 * with identical operand surfaces the freshness guard has nothing to prefer
 * between them, so a redraw cannot quietly bend the deal.
 *
 * THE PRICE, MEASURED. "Always add" and "always take away" are exactly
 * complementary here, so each takes precisely one of the two certifying slots
 * in every form and neither can be pushed below a half without deleting one of
 * the two situations the week exists to contrast. That is a floor and not a
 * defect; a14 and a16 reached the same one from their own contrasts. What the
 * floor does NOT do is certify anybody — see disclosure 8.
 */
function tipsInOrOut(side: Decide, rungs: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const way = side(rng, guard);
    return drawUniqueItem(rng, guard, (r) => {
      const m = r.pick(MOVES);
      const noun = r.pick(COUNTABLE_NOUNS);
      const who = r.pick(FOLK);
      const truth = way === 'join' ? m.a + m.b : m.a - m.b;
      // THE ONLY SLOT IN THE WEEK THAT MAY OFFER EITHER MOVE'S ANSWER. A fixed
      // join page cannot offer a difference of three, because three is not a
      // total it can ever key; this page keys both, so the value it offers is
      // always keyable AT THIS SLOT — which is the test L38 actually applies.
      const pool = offerable(
        way === 'join'
          ? [m.a - m.b, m.a, m.b, m.a + m.b - 1, m.a + m.b + 1, m.a + m.b + 2]
          : [m.a + m.b, m.a, m.b, m.a - m.b + 1, m.a - m.b - 1, m.a - m.b - 2],
        truth,
        EITHER_KEYS,
      );
      // The two moves pull the key to opposite ends of the pool, so the aim is
      // drawn once and MIRRORED — the page that tips out asks for the rank the
      // page that tips in did not, and neither side has to be flattened by hand.
      const aim = r.int(0, 2);
      const wrongs = dealCards(r, pool, truth, way === 'join' ? aim : 2 - aim).map((v) =>
        way === 'join' ? whyNotTheTotal(v, m) : whyNotTheRest(v, m),
      );
      const { choices, correctKey } = makeChoices(r, String(truth), wrongs);
      const draft: ItemDraft = {
        type: 'classification',
        // THE TUB IS NARRATION AND STAYS OUT OF THE SCENE. No primitive draws a
        // container, so a bracket naming one would describe something that is
        // not on the screen (the L27 class); what is drawn is the group, so that
        // is what the bracket and the alt both say, and where the things live is
        // the question's business (kit §E, A-band lesson 4).
        prompt: withScene(
          'a row of things with nothing marked on them',
          `${countNoun(m.a, noun)} are in a tub. ${who} tips ${countNoun(m.b, noun)} ${way === 'join' ? 'in' : 'out'}. How many ${noun} sit in the tub now?`,
        ),
        figure: groupFigure(m.a, noun, assertsParam('a')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(truth)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `asks` records which page this was, and `tipped` which way the last
          // word sent the things. Without them a discrimination and a core page
          // that drew the same pair pin an identical core (disclosure 10).
          params: { a: m.a, b: m.b, op: way === 'join' ? '+' : '-', asks: 'tipped', tipped: way },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        authorMeta: {
          stepCount: 1,
          cognitiveOp: 'choose-operation-from-one-word',
          isDiscrimination: true,
        },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 3 — the page neither habit can win
// ===========================================================================

/**
 * The counting frame, the counters going in, and the cells that stay empty.
 *
 * The story adds and the question takes away, so a child who hears "more go in"
 * and reaches for the bigger number is caught by the very sentence that seemed
 * to help. It is the hardest page in the week and it is the one that makes the
 * certifying form honest: the answer is `10 − f − g`, the ten is in the drawing
 * and never spoken, and every pair whose answer coincides with a sum, a
 * difference or either spoken number is barred at the pool (disclosure 4).
 *
 * `{a: the gaps before, b: the arrivals, op: '-'}` is not a fudge — the empty
 * cells really are a quantity the child can see and count, and taking the
 * arrivals off them really is the move. The figure asserts that same `a`
 * through the frame's own `empty` selector, so the picture, the params and the
 * key are pinned to one another twice over.
 */
function gapsLeft(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const fl = r.pick(FILLS);
      const who = r.pick(FOLK);
      const gapsBefore = HOW_MANY_CELLS - fl.f;
      const truth = gapsBefore - fl.g;
      const pool = offerable(
        [gapsBefore, fl.f + fl.g, fl.f, truth + 1, truth - 1, truth + 2],
        truth,
        GAP_KEYS,
      );
      const wrongs = dealCards(r, pool, truth, r.int(0, 2)).map((v) => whyNotTheGaps(v, fl));
      const { choices, correctKey } = makeChoices(r, String(truth), wrongs);
      const draft: ItemDraft = {
        type: 'representation',
        prompt: withScene(
          'a counting frame part filled, with open cells left',
          `The frame holds ${countNoun(fl.f, 'counters')}. ${who} drops ${String(fl.g)} more in. How many cells stay empty?`,
        ),
        figure: tenFrame(fl.f, {
          size: 10,
          alt: FRAME_ALT,
          asserts: assertsParam('a', 'empty'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(truth)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: gapsBefore, b: fl.g, op: '-', asks: 'gaps' },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['task-comprehension', 'concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'count-the-gaps-after-a-join' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — the puppet who joins what the story parted
// ===========================================================================

/**
 * A named puppet hears a take-away story and adds, which is row A18's own slip
 * and which `d_verify_binop_misconception_v1` computes from the page's two
 * counts (disclosure 2). QG-11 checks both halves at every seed: the keyed
 * option against the truth, and the prompt against the misconception's own
 * output. The word "wrong" is nowhere on the page; what it says is what he did.
 *
 * HIS NUMBER IS OFFERED ONLY WHEN THE SLOT COULD KEY IT. A sum is bigger than
 * the difference of the same pair, so on the draws where it climbs past what a
 * take-away page can ever answer it becomes a numeral that is offered and never
 * correct — the L38 shape, manufactured by the form itself. a16 offered it
 * always and called the cost structural; a17 met the same thing from the
 * plus-one side. Here it goes on a card when it is inside the key set and stays
 * in the prompt otherwise, so nothing this slot offers is unreachable.
 *
 * The third card's side is drawn rather than fixed: his number is always above
 * the truth, so a card taken from below every time would pin the key to the
 * middle rank on every draw that had one.
 */
function puppetJoinsInstead(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const m = r.pick(PUPPET_MOVES);
      const noun = r.pick(COUNTABLE_NOUNS);
      const puppet = r.pick(PUPPETS);
      const truth = m.a - m.b;
      const said = m.a + m.b;
      const pool = offerable(
        [said, m.a, m.b, truth + 1, truth - 1, truth + 2],
        truth,
        PART_KEYS,
      );
      const wrongs = pool.includes(said)
        ? [
          whyNotTheRest(said, m),
          // His card sits above the truth, so the second one decides the rank:
          // below him and the key is in the middle, above him and it is at the
          // bottom. Drawn, not fixed.
          whyNotTheRest(
            (() => {
              const rest = pool.filter((v) => v !== said);
              const under = rest.filter((v) => v < truth);
              const over = rest.filter((v) => v > truth);
              if (under.length > 0 && (over.length === 0 || r.chance(0.5))) return r.pick(under);
              return r.pick(over.length > 0 ? over : under);
            })(),
            m,
          ),
        ]
        : dealCards(r, pool, truth, r.int(0, 2)).map((v) => whyNotTheRest(v, m));
      const { choices, correctKey } = makeChoices(r, String(truth), wrongs);
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: withScene(
          'one bunch of things, drawn all together',
          `${puppet} has ${countNoun(m.a, noun)} and gives ${String(m.b)} away. ${puppet} adds them and says ${String(said)}. Tap the number this story really makes.`,
        ),
        figure: groupFigure(m.a, noun, assertsParam('a')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(truth)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_misconception_v1',
          params: { a: m.a, b: m.b, op: '-', wrongOp: '+' },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        authorMeta: {
          stepCount: 1,
          cognitiveOp: 'find-the-move-the-story-made',
          isErrorAnalysis: true,
        },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — the Day-4 real-world stories
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family has no story generator, so this week's four places are set out below.
 *
 * All four are containers a child has watched being loaded and unloaded, which
 * is what makes one plain group the honest picture — the container is where the
 * things are, and the drawing shows the things. THE CONTAINER STAYS IN THE
 * STORY AND OUT OF THE PICTURE: no primitive draws a barrow or a nest, so an
 * alt naming one would describe something that is not on the screen (the L27
 * class).
 *
 * Each frame owns its kind of thing rather than drawing one, which is a14's
 * repeated-scene problem solved at the root: a Day 4 that visits three places
 * shows three different things, every time, without a claim register.
 *
 * FOUR FRAMES FOR THREE DAILY STORIES. The fourth belongs to the certifying
 * slot; with three, the mastery page would have to borrow one, and a pack that
 * visits the same barrow three times in a week looks short of ideas rather than
 * deliberate.
 */
type Place = 'pail' | 'barrow' | 'nest' | 'trolley';

interface Frame {
  noun: string;
  /** The things, and where they are. The person is named in the move, not here. */
  here: (n: number) => string;
  join: (who: string, n: number) => string;
  part: (who: string, n: number) => string;
  ask: string;
  rungs: string[];
}

const FRAMES: Record<Place, Frame> = {
  pail: {
    noun: 'shells',
    here: (n) => `${countNoun(n, 'shells')} sit in a pail.`,
    join: (who, n) => `${who} drops in ${countNoun(n, 'shells')}.`,
    part: (who, n) => `${who} lifts out ${countNoun(n, 'shells')}.`,
    ask: 'How many shells are in the pail now?',
    rungs: [
      'Picture the pail before anybody touches it.',
      'Then follow what the hands actually do.',
    ],
  },
  barrow: {
    noun: 'leaves',
    here: (n) => `${countNoun(n, 'leaves')} ride on a barrow.`,
    join: (who, n) => `${who} piles on ${countNoun(n, 'leaves')}.`,
    part: (who, n) => `${who} rakes off ${countNoun(n, 'leaves')}.`,
    ask: 'How many leaves sit on the barrow now?',
    rungs: [
      'Was anything added to that load?',
      'Or was some of it taken off again?',
    ],
  },
  nest: {
    noun: 'buttons',
    here: (n) => `${countNoun(n, 'buttons')} hide in a nest.`,
    join: (who, n) => `${who} tucks in ${countNoun(n, 'buttons')}.`,
    part: (who, n) => `${who} pulls out ${countNoun(n, 'buttons')}.`,
    ask: 'How many buttons are in the nest now?',
    rungs: [
      'Think about whether the nest fills or empties.',
      'Count it the way the story ends.',
    ],
  },
  trolley: {
    noun: 'apples',
    here: (n) => `${countNoun(n, 'apples')} roll in a trolley.`,
    join: (who, n) => `${who} pops in ${countNoun(n, 'apples')}.`,
    part: (who, n) => `${who} takes back ${countNoun(n, 'apples')}.`,
    ask: 'How many apples sit in the trolley now?',
    rungs: [
      'Watch what the hands do to the load.',
      'Count what is riding along afterwards.',
    ],
  },
};

function placeStory(place: Place, side: Decide): ItemGen {
  const frame = FRAMES[place];
  return (rng, guard, difficulty) => {
    const way = side(rng, guard);
    return drawUniqueItem(rng, guard, (r) => {
      const m = r.pick(MOVES);
      const who = r.pick(FOLK);
      const truth = way === 'join' ? m.a + m.b : m.a - m.b;
      const keys = way === 'join' ? JOIN_KEYS : PART_KEYS;
      const pool = offerable(
        way === 'join'
          ? [m.a - m.b, m.a, m.b, m.a + m.b - 1, m.a + m.b + 1, m.a + m.b + 2]
          : [m.a + m.b, m.a, m.b, m.a - m.b + 1, m.a - m.b - 1, m.a - m.b - 2],
        truth,
        keys,
      );
      const wrongs = dealCards(r, pool, truth, r.int(0, 2)).map((v) =>
        way === 'join' ? whyNotTheTotal(v, m) : whyNotTheRest(v, m),
      );
      const { choices, correctKey } = makeChoices(r, String(truth), wrongs);
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: withScene(
          'one bunch of things, drawn all together',
          `${frame.here(m.a)} ${way === 'join' ? frame.join(who, m.b) : frame.part(who, m.b)} ${frame.ask}`,
        ),
        figure: groupFigure(m.a, frame.noun, assertsParam('a')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(truth)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: m.a, b: m.b, op: way === 'join' ? '+' : '-', place },
          seed: r.uint(),
        },
        hintLadder: ladder(...frame.rungs),
        errorTags: ['concept-misconception', 'task-comprehension', 'procedure-slip'],
        // 'combine' for a story that brings things together; 'part-whole' for
        // one that takes them apart. `SituationType` carries no SEPARATE member,
        // so the second borrows the nearest thing the union can say — a16 first
        // recorded this and a17 seconded it, and A18 is the week where BOTH
        // families appear on one page type and the gap shows most plainly.
        authorMeta: {
          stepCount: 1,
          cognitiveOp: 'choose-operation-in-a-place',
          situationType: way === 'join' ? 'combine' : 'part-whole',
        },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generators 6 and 7 — the Day-5 pair
// ===========================================================================

/**
 * The recipe's Day-5: sort number sentences by whether they tell the truth
 * (disclosure 7).
 *
 * A story is told over a drawn group and three sentences are offered. The keyed
 * one says what happened and comes to the right number; one keeps the numbers
 * and swaps the sign; one keeps the sign and misses the result by a step. Three
 * cards, one symbol apart each, so a child has to work the story out before any
 * of them can be told from the others.
 *
 * NOTHING IN THE REGISTRY CAN READ A SENTENCE, so the pin proves the keyed
 * card's ARITHMETIC rather than its truth: `d_verify_binop_v1` recomputes what
 * the story comes to and the answer records that number beside the sentence,
 * which is what QG-11 compares. The MATCH cannot come apart anyway, because a
 * single drawn boolean writes the story's last word, the card's sign and the
 * params' `op` in one expression.
 *
 * The move is drawn here rather than dealt. This page certifies nothing and no
 * mastery form sees it, so what matters is that both signs reach the keyed card
 * — which keeps either shape from being learnable as "the one that is never
 * true".
 */
function readsTheSentence(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const m = r.pick(MOVES);
      const noun = r.pick(COUNTABLE_NOUNS);
      const who = r.pick(FOLK);
      const brings = r.chance(0.5);
      const sign = brings ? '+' : '−';
      const other = brings ? '−' : '+';
      const truth = brings ? m.a + m.b : m.a - m.b;
      // A result one out, on whichever side the pool allows — never below one,
      // because no story here empties a group and a sentence claiming it would
      // be false for a reason the week has not taught.
      const slipped = truth > 1 ? truth - 1 : truth + 1;
      const { choices, correctKey } = makeChoices(
        r,
        `${String(m.a)} ${sign} ${String(m.b)} = ${String(truth)}`,
        [
          {
            text: `${String(m.a)} ${other} ${String(m.b)} = ${String(truth)}`,
            errorTag: 'concept-misconception',
            rationale: 'The right numbers and the right result under the sign that could not have produced it. A child reading only the numerals will accept this, which is why the sentence and the story have to be checked against each other rather than skimmed.',
          },
          {
            text: `${String(m.a)} ${sign} ${String(m.b)} = ${String(slipped)}`,
            errorTag: 'procedure-slip',
            rationale: 'The right move with the counting a step out. The decision was made correctly and the arithmetic was not, which is a different problem from choosing the wrong move and needs a different sentence to fix.',
          },
        ],
      );
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: withScene(
          'one bunch of things, drawn all together',
          `${who} has ${countNoun(m.a, noun)} and ${brings ? `gets ${String(m.b)} more` : `sends ${String(m.b)} off`}. Tap the sentence that tells the truth.`,
        ),
        figure: groupFigure(m.a, noun, assertsParam('a')),
        choices,
        answer: {
          // TWO SURFACES OF ONE CLAIM, and the second is what keeps the pin
          // alive: `d_verify_binop_v1` returns a NUMBER and cannot read a
          // sentence, so recording what the keyed sentence comes to lets QG-11
          // recompute the arithmetic the card asserts.
          value: correctKey,
          acceptableForms: [
            `${String(m.a)} ${sign} ${String(m.b)} = ${String(truth)}`,
            String(truth),
          ],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: m.a, b: m.b, op: brings ? '+' : '-', asks: 'sentence' },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: {
          stepCount: 1,
          cognitiveOp: 'judge-a-number-sentence',
          isDiscrimination: true,
        },
      };
      return draft;
    });
}

/**
 * §3's production stance at band A — make, show, build — in the form this week
 * owns: the child decides whether to DRAW or to MARK, and the crayon is the
 * answer.
 *
 * It is the choice the whole week is about, performed instead of tapped. A
 * story that brings things wants more of them on the page; a story that takes
 * things wants some of the drawn ones scored out; and a child who has not
 * decided cannot begin. `manual-review`, because nothing can grade a crayon —
 * the number the page must come to is still code-computed and recorded in
 * `answer.value`, and the figure asserts the row it was drawn from, so an adult
 * holding the page knows what right looks like. `'set'` was the other candidate
 * and is the wrong one: it sits in `needsTypedEntry` and puts a text box in
 * front of a four-year-old, which a12 reported and which is still open.
 */
function showsTheMove(rungs: string[]): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const m = r.pick(MOVES);
      const noun = r.pick(COUNTABLE_NOUNS);
      const who = r.pick(FOLK);
      const brings = r.chance(0.5);
      const truth = brings ? m.a + m.b : m.a - m.b;
      const draft: ItemDraft = {
        type: 'drawing',
        prompt: withScene(
          'one bunch of things, drawn all together',
          `${who} has ${countNoun(m.a, noun)} and ${brings ? `picks up ${String(m.b)} more` : `lets ${String(m.b)} go`}. ${brings ? 'Draw the ones that arrive.' : 'Mark the ones that leave.'}`,
        ),
        figure: groupFigure(m.a, noun, assertsParam('a')),
        answer: {
          value: String(truth),
          acceptableForms: [`${countNoun(truth, noun)} left standing`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: m.a, b: m.b, op: brings ? '+' : '-', asks: 'drawn' },
          seed: r.uint(),
        },
        hintLadder: rungs,
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'draw-or-mark-the-move' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 8 — three tap cards for a family warm-up
// ===========================================================================

/**
 * At this band a numeric item with no authored `choices` does not become a
 * free-entry page. It becomes four buttons a render-time function guesses at
 * without knowing what range the slot's answer lives in (L53) — for a child who
 * could not type into a box anyway. Three of this week's four warm-ups arrive
 * from the family that way, so each is handed three authored cards drawn from
 * the honest miscounts ITS OWN question produces, clipped to the numerals that
 * question can reach, with the truth's rank put through the dealer the core
 * pages use.
 *
 * It also takes back an audit that would otherwise be lost: QG-5 does not
 * re-derive an `answerFor` for a `choice-key` item, so the wrapper re-reads the
 * item's own `generator.params`, recomputes the answer independently, and
 * refuses to build if the picture and the key have parted company. Nothing is
 * drawn before `base` runs and neither the prompt nor the figure is touched, so
 * the surface QG-1 signs is the one the family produced.
 */
function withThreeCards(
  base: ItemGen,
  truthOf: (params: Record<string, unknown>) => number,
  reach: readonly number[],
  poolOf: (n: number, params: Record<string, unknown>) => number[],
  whyOf: (v: number, n: number, params: Record<string, unknown>) => Card,
): ItemGen {
  const keys = new Set(reach);
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) {
      throw new Error('A18 withThreeCards: no generator params arrived, so the key cannot be re-derived');
    }
    const n = truthOf(params);
    const stated = [draft.answer.value, ...draft.answer.acceptableForms];
    if (!Number.isInteger(n) || !stated.includes(String(n))) {
      throw new Error(
        `A18 withThreeCards: ${draft.generator?.templateId ?? 'an item'} states "${draft.answer.value}" where its params give ${String(n)}`,
      );
    }
    const pool = offerable(poolOf(n, params), n, keys);
    const { choices, correctKey } = makeChoices(
      rng,
      String(n),
      dealCards(rng, pool, n, rng.int(0, 2)).map((v) => whyOf(v, n, params)),
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
 * Two of this week's warm-ups arrive with a number inside the picture's
 * accessible name (disclosure 12), and at this band the alt is autoplayed
 * before the question, so the bar is absolute: no digit and no number word in
 * any alt, whether or not it happens to be the answer this draw (L48). The
 * replacement describes the same drawing and says less, which is the only
 * honest direction to move an alt in. The spread keeps every param and the
 * assertion untouched; only the alt moves, and the assertion is what QG-13
 * audits.
 */
function withQuietAlt(base: ItemGen, altOf: (draft: ItemDraft) => string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.figure) {
      throw new Error('A18 withQuietAlt: nothing is drawn on this warm-up, so there is no alt to quieten');
    }
    const figure = { ...draft.figure, alt: altOf(draft) } as BBFigure;
    return { ...draft, figure };
  };
}

/** The kind of thing a family prompt drew, read back so an alt can name it. */
function thingIn(draft: ItemDraft): string {
  return (
    COUNTABLE_NOUNS.find((n) => draft.prompt.includes(n) || draft.prompt.includes(unitFor(1, n))) ??
    'small things'
  );
}

// ===========================================================================
// The week's generators, bound and given this week's voice
// ===========================================================================

// --- the four warm-ups ------------------------------------------------------

/** A16 — the cross-out, on the day the picture stops showing the move. */
const gameCrossOut = asGame(
  withHelp(
    withThreeCards(
      pictureTakeAway({ min: 2, max: 5 }),
      (p) => Number(p.a) - Number(p.b),
      [1, 2, 3, 4],
      // The two counts the drawing holds, last week's headline slip and one
      // whisper either side. Without the joined pair, a take-away of one from
      // two has a single honest card in reach and the dealer has nothing to work
      // with.
      (n, p) => [Number(p.a) + Number(p.b), Number(p.a), Number(p.b), n + 1, n - 1, n + 2, n - 2],
      (v, n, p) => {
        if (v === Number(p.a) + Number(p.b)) {
          return {
            text: String(v),
            errorTag: 'concept-misconception',
            rationale: 'Both amounts read as one heap. A stroke drawn through something is easily mistaken for a badge saying count me too, and this is the number that mistake produces.',
          };
        }
        if (v === Number(p.a)) {
          return {
            text: String(v),
            errorTag: 'representation-misread',
            rationale: 'The row totalled exactly as drawn. Nothing was subtracted anywhere, because the strokes were treated as pattern on things that are all still present.',
          };
        }
        if (v === Number(p.b)) {
          return {
            text: String(v),
            errorTag: 'task-comprehension',
            rationale: 'The struck-through run given for the untouched run. Two amounts live in this drawing and the sentence wanted the other one.',
          };
        }
        return v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Past the answer. The pointing hand travelled on into the struck part and gave a name to something that had already left.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Short of the answer. The pointing hand reached the strokes ahead of the words, so a surviving thing went unnamed.',
          };
      },
    ),
    ladder('A line across something means it has gone.', 'Count the ones no line has touched.'),
  ),
  16,
);

/**
 * A17 — the count-back slip, met as a puppet game.
 *
 * TWO SHARED-LIBRARY REPAIRS, BOTH DONE FROM OUTSIDE (disclosure 12). Its alt
 * interpolates the crossed-out count, which at this band is spoken before the
 * question. And its own three cards cannot avoid a numeral the slot can never
 * key: with a start of at most `max`, the truth runs to `max − 1` while the
 * puppet's number runs to `max` and its third card to `max + 1` or to zero, so
 * every range leaves a card outside the answer set — measured here at 10.7% of
 * that slot's draws before the repair. The cards are therefore rebuilt through
 * the same wrapper the other warm-ups use, clipped to what this question can
 * actually answer, which also puts the puppet's own number on a tap target only
 * when it is reachable — the same discipline the week's own puppet page uses.
 * **Recorded for the orchestrator: `puppetSlip`'s count-back branch offers a
 * dead numeral at every range, and its alt names a count.**
 */
const gameCountBack = asGame(
  withQuietAlt(
    withHelp(
      withThreeCards(
        puppetSlip({ slip: 'count-back-start', min: 4, max: 9 }),
        (p) => Number(p.a) - Number(p.b),
        [1, 2, 3, 4, 5, 6, 7, 8],
        (n, p) => [n + 1, Number(p.a), n - 1, n + 2, n - 2],
        (v, n, p) => {
          if (v === n + 1) {
            return {
              text: String(v),
              errorTag: 'procedure-slip',
              rationale: 'The number the puppet announced. He treated the place he set off from as his opening step, so a whole step went by with nobody moving.',
            };
          }
          if (v === Number(p.a)) {
            return {
              text: String(v),
              errorTag: 'representation-misread',
              rationale: 'The full row tallied, strokes included. That answers how many were there to begin with, not how many outlasted the story.',
            };
          }
          return v > n
            ? {
              text: String(v),
              errorTag: 'procedure-slip',
              rationale: 'Too many kept. The stepping back ran out before every struck-through thing had been accounted for.',
            }
            : {
              text: String(v),
              errorTag: 'procedure-slip',
              rationale: 'Too few kept. The stepping back carried on after the final stroke had already been passed.',
            };
        },
      ),
      ladder('Do the taking-away yourself, one thing at a time.', 'Stop when every marked one has gone.'),
    ),
    (d) => `${thingIn(d)} in a line, some of them scored out`,
  ),
  17,
);

/** A14 — the join, because half of this week's decisions end in one. */
const gameJoin = asGame(
  withHelp(
    withThreeCards(
      pictureJoin({ min: 1, max: 4, maxTotal: 5 }),
      (p) => Number(p.a) + Number(p.b),
      [2, 3, 4, 5],
      // A join of one and one totals two, the bottom of what this question can
      // reach, so both the smaller bunch and the count-one-short fall outside it
      // and the over-counts are all that is left. Two of them are carried for
      // that draw alone.
      (n, p) => {
        const fuller = Math.max(Number(p.a), Number(p.b));
        return [fuller, n - 1, n + 1, n + 2, n - 2];
      },
      (v, n, p) => {
        if (v === Math.max(Number(p.a), Number(p.b))) {
          return {
            text: String(v),
            errorTag: 'task-comprehension',
            rationale: 'The larger huddle alone. Counting stopped where it ended, as though the smaller huddle belonged to somebody else entirely.',
          };
        }
        return v > n
          ? {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Past the answer. A thing at the boundary picked up two names as the counting stepped across between the huddles.',
          }
          : {
            text: String(v),
            errorTag: 'procedure-slip',
            rationale: 'Short of the answer. The counting words ran dry ahead of the things, almost always right where the huddles touch.',
          };
      },
    ),
    ladder('Nothing has left this picture at all.', 'One number has to cover both bunches.'),
  ),
  14,
);

/**
 * A12 — the covered part, because a whole that can be split is the ground both
 * of this week's moves stand on. Its alt names the frame's own capacity, so it
 * is repaired here as well (disclosure 12).
 */
const gameHiding = asGame(
  withQuietAlt(
    withHelp(
      withThreeCards(
        partnersHiding({ total: 10 }),
        (p) => Number(p.total) - Number(p.shown),
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        (n, p) => [Number(p.shown), Number(p.total), n + 1, n - 1, n + 2, n - 2],
        (v, n, p) => {
          if (v === Number(p.shown)) {
            return {
              text: String(v),
              errorTag: 'task-comprehension',
              rationale: 'The visible part repeated straight back. It was known before the question began, so no whole was taken apart anywhere on this page.',
            };
          }
          if (v === Number(p.total)) {
            return {
              text: String(v),
              errorTag: 'concept-misconception',
              rationale: 'The full frame offered as one of its own parts. Sliding something across a few counters leaves the total precisely where it was.',
            };
          }
          return v > n
            ? {
              text: String(v),
              errorTag: 'procedure-slip',
              rationale: 'Past the answer. Counting on from what shows began a place too soon and claimed a cell nothing is hiding.',
            }
            : {
              text: String(v),
              errorTag: 'procedure-slip',
              rationale: 'Short of the answer. Counting on from what shows gave up while hidden cells were still unaccounted for.',
            };
        },
      ),
      ladder('You cannot see under the cover.', 'Count up from the ones on show.'),
    ),
    () => 'a counting frame, partly screened so some cells cannot be seen',
  ),
  12,
);

// --- the core forms, each in its own voice -----------------------------------

const VERBS_ONE: Verbs = {
  join: (b) => `and finds ${String(b)} more`,
  part: (b) => `and loses ${String(b)}`,
};
const VERBS_TWO: Verbs = {
  join: (b) => `and gathers ${String(b)} more`,
  part: (b) => `and hands over ${String(b)}`,
};
const VERBS_THREE: Verbs = {
  join: (b) => `and is given ${String(b)} more`,
  part: (b) => `and gives away ${String(b)}`,
};
const VERBS_FOUR: Verbs = {
  join: (b) => `and spots ${String(b)} more`,
  part: (b) => `and puts ${String(b)} back`,
};

const meetsAJoin = mixedPicture(
  always('join'),
  VERBS_ONE,
  ladder('Did the story bring more, or take some?', 'Count the whole lot once you know.'),
);
const meetsATakeAway = mixedPicture(
  always('part'),
  VERBS_TWO,
  ladder('Listen for whether the group grew or shrank.', 'Then count what the story leaves behind.'),
);
const decidesOnDayTwo = mixedPicture(
  coreDay(2),
  VERBS_THREE,
  ladder('One word in the story picks the move.', 'Hunt for it before a single thing is counted.'),
);
const decidesOnDayThree = mixedPicture(
  coreDay(3),
  VERBS_FOUR,
  ladder('Say the story again in your own words.', 'Are there more of them now, or fewer?'),
);

const listensDayTwo = tipsInOrOut(
  tipDay(2),
  // BOTH RUNGS MUST BE TRUE OF BOTH STORIES: the dedup gate is seed-invariant
  // only while a slot's help holds still, so the help names the decision and
  // leaves the answer to the story.
  ladder('The little word at the end matters most.', 'It says which way the things travelled.'),
);
const listensDayThree = tipsInOrOut(
  tipDay(3),
  ladder('The doing word is the same in both stories.', 'Only the last word tells them apart.'),
);

const countsTheGaps = gapsLeft(
  ladder('Look at the cells with nothing in them.', 'Some of those gaps are about to fill.'),
);
const puppetDayThree = puppetJoinsInstead(
  ladder('The puppet joined two counts together.', 'The story sent some of them away instead.'),
);

const storyPail = placeStory('pail', always('join'));
const storyBarrow = placeStory('barrow', always('part'));
const storyNest = placeStory('nest', thirdStory);

const sortsOnDayOne = withHelp(
  joinOrTakeAway({ min: 2, max: 5 }),
  ladder('Are these things gathered together, or marked out?', 'That is what tells you the move.'),
);
const sortsOnDayFive = withHelp(
  joinOrTakeAway({ min: 2, max: 5 }),
  ladder('Look for a group arriving beside another.', 'Look for lines drawn across some of them.'),
);

const checksTheSentence = readsTheSentence(
  ladder('Settle the answer in your own head first.', 'Then look for the card that agrees.'),
);
const drawsOrMarks = showsTheMove(
  ladder('Decide first whether to draw or to mark.', 'The story tells you which one it wants.'),
);

// --- the six certifying slots ------------------------------------------------

const masteryJoin = mixedPicture(
  always('join'),
  VERBS_ONE,
  ladder('Ask what the story does to the group.', 'Then count the group the story left.'),
);
const masteryTipOne = tipsInOrOut(
  formTip(2),
  ladder('Repeat that last little word to yourself.', 'It decides everything about this page.'),
);
const masteryStory = placeStory('trolley', always('part'));
const masteryGaps = gapsLeft(
  ladder('The counters go in; the gaps go down.', 'Count only the gaps that survive.'),
);
const masteryPuppet = puppetJoinsInstead(
  ladder('Two numbers can be joined or parted.', 'Work out which one this story asked for.'),
);
const masteryTipTwo = tipsInOrOut(
  formTip(6),
  ladder('Hear the story right through to its end.', 'The ending is where the move hides.'),
);

// ===========================================================================
// The week
// ===========================================================================

export const buildA18 = makeWeekBuilder({
  level: 'A',
  week: 18,
  conceptId: 'add-and-subtract-within-10',
  conceptName: 'Add & subtract together',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [
    { level: 'A', week: 16 },
    { level: 'A', week: 17 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'choose the move',
  /**
   * BB-G1 (§6.13). Declared because the week genuinely deepens four earlier
   * ones, not because the gate demands it — as disclosure 11 records, the
   * ledger's family key cannot connect a compound concept id to the two simple
   * ones it composes, so the precondition never fires and the absence of this
   * string would have shipped.
   */
  deepeningDelta:
    'A14 gave a child the situation: two groups become one group, and the total is found by counting all of them. A16 gave the mirror situation: some of a group are gone, and what stands can still be counted. A17 turned that second situation into a METHOD — a number path, a walk backwards along it, an answer that is where the walk ends rather than something the picture shows. Each of those three weeks handed the operation over before the question started, so the drawing itself announced what to do: a plus between two groups, a line through the departed, arcs running down a path. A18 takes that away. Every assessed picture here is one plain group drawn as it stood BEFORE anything happened, identical whichever way the story goes, so the page states a quantity and settles nothing; the move has to be taken out of the words. Four things are new because of it. The two operations meet on one page for the first time, so both answers are live everywhere and no card can be struck out unread. The discrimination stops contrasting two SITUATIONS and starts contrasting two SENTENCES that share every word but the last, which is what breaks keyword matching. The certifying form is dealt rather than drawn, so a child who always adds and a child who always takes away are each held to a fixed score and neither can pass. And one page asks a question the story does not answer — the counters go into the frame while the cells that stay empty go down — so choosing the move stops being a guess about vocabulary and becomes a decision about what was actually asked.',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt is spoken; a page carries a single question; the tap targets are large. Every assessed picture in this week shows ONE group exactly as it stood before the story began — no plus sign, no crossings-out, nothing that gives the move away — because deciding the move is the work. Do it with real things before the screen: put some buttons on the table, count them together, then say either "two more arrive" or "two go away" and let your child move the buttons and count again. Say the two sentences in the same voice, one straight after the other, so the only difference they can hear is the word that matters. Mascot present.',
  },
  explanation: {
    hook: spoken(
      'Petra keeps 6 blocks. Something happens to them. Do we end up with more blocks, or fewer? Listen hard and find out.',
    ),
    whyBeforeHow: spoken(
      'Two numbers alone never tell you what to do. We know because the same pair can grow or shrink. So we choose the move from the story first. Ask this: are there more now, or fewer? Then count.',
    ),
    script: [
      {
        say: spoken('These blocks belong to Petra. Count them with me.'),
        visual: 'Six blocks in one plain row: nothing joined on, nothing scored through.',
        figure: counterGroups([{ count: 6, noun: 'blocks' }], {
          arrangement: 'in a row',
          alt: rowAlt('blocks'),
        }),
      },
      {
        say: spoken('Two blocks arrive. More now, so we add.'),
        visual: 'Two further blocks drawn to the right of the six, joined by a plus: 6 + 2 = 8.',
        figure: counterGroups(
          [{ count: 6, noun: 'blocks' }, { count: 2, noun: 'blocks' }],
          { relation: 'join', alt: 'a longer run of blocks and a shorter run beside it' },
        ),
      },
      {
        say: spoken('This time two blocks are taken instead.'),
        visual: 'The same six blocks with the final two scored through, and 6 − 2 = 4 below.',
        figure: counterGroups([{ count: 6, noun: 'blocks' }], {
          arrangement: 'in a row',
          relation: 'remove',
          crossedOut: 2,
          alt: 'a run of blocks with strokes drawn over the last of them',
        }),
      },
      {
        say: spoken('Same blocks, same two. The story chose the move.'),
        visual:
          'The two sentences one under the other, 6 + 2 = 8 and 6 − 2 = 4, with a ring round each sign.',
        // Two peer lines, no arrow between them: neither sentence becomes the
        // other, which is the whole point of the segment. Only the SIGN differs,
        // so only the sign is ringed — the six and the two are deliberately left
        // unmarked so the child's eye lands on the one thing the story changed.
        figure: mathSentence(
          [{ text: '6' }, { text: '+', mark: 'ring' }, { text: '2' }, { text: '=' }, { text: '8' }],
          {
            then: {
              connector: 'and',
              tokens: [{ text: '6' }, { text: '−', mark: 'ring' }, { text: '2' }, { text: '=' }, { text: '4' }],
            },
            alt:
              'two number sentences one under the other, six plus two equals eight and six minus two equals four, ' +
              'with a ring drawn round the plus sign and round the minus sign',
          },
        ),
      },
    ],
    summary: spoken(
      'Listen to the story before you touch a number. Did something arrive? Then there are more. Did something leave? Then there are fewer. Choose the move, and only then count.',
    ),
    vocabulary: [
      { term: 'add', kidGloss: 'bring more things to the ones already there' },
      { term: 'take away', kidGloss: 'part of a group leaves, and a smaller amount stays' },
      { term: 'the move', kidGloss: 'what the story does to a group' },
      { term: 'number sentence', kidGloss: 'a written line saying what happened to a group' },
    ],
  },
  guidedExamples: [
    {
      // Every guided-example bracket names three numbers, which is what a worked
      // example is for — and it keeps the assembler's echo check off the day
      // pages, since no generated counting item here prints three counts.
      ...ge(
        18,
        1,
        'modeled',
        withScene(
          'a row of buttons with room beside them',
          'Chidi has 5 buttons and finds 3 more. How many buttons now? Say 5, 3, and 8.',
        ),
        [
          {
            teacherSay: spoken('Watch me. I do not count yet. First I ask what happened.'),
            expected: 'the finger still resting on the drawn row',
          },
          { teacherSay: spoken('He found some. Did he end up with more, or fewer?') },
          { childDo: spoken('Say whether the group grew or shrank.'), expected: 'more' },
          { teacherSay: spoken('More means we add. Count them all: 5 + 3 = 8.'), expected: '8' },
        ],
        '8',
      ),
      visual: 'Five buttons drawn in a row, three further ones alongside, a plus between the two runs.',
      figure: counterGroups(
        [{ count: 5, noun: 'buttons' }, { count: 3, noun: 'buttons' }],
        { relation: 'join', alt: 'a longer run of buttons and a shorter run beside it', asserts: { equals: 'answer' } },
      ),
    },
    {
      ...ge(
        18,
        2,
        'completion',
        withScene(
          'a row of leaves with room beside them',
          'Lark has 7 leaves and gives 3 away. How many leaves now? Say 7, 3, and 4.',
        ),
        [
          { teacherSay: spoken('She gave some away, so ask yourself the question.') },
          { childDo: spoken('Say whether the group grew or shrank.'), expected: 'fewer' },
          { teacherSay: spoken('Fewer means we take away. What does 7 − 3 come to?'), expected: '4' },
        ],
        '4',
      ),
      visual: 'Seven leaves drawn in a row with the final three scored through.',
      figure: counterGroups([{ count: 7, noun: 'leaves' }], {
        arrangement: 'in a row',
        relation: 'remove',
        crossedOut: 3,
        alt: 'a run of leaves with strokes drawn over the last of them',
        asserts: { of: 'remaining', equals: 'answer' },
      }),
    },
    {
      ...ge(
        18,
        3,
        'prompted',
        withScene(
          'a row of apples beside an open tub',
          '4 apples are in a tub. Imre tips 2 apples out. Say 4, 2, and 2.',
        ),
        [
          { teacherSay: spoken('Careful. Nothing arrived in this one at all.') },
          { childDo: spoken('Choose the move, then count what stays.'), expected: '2' },
          { teacherSay: spoken('The word out did all the work there.') },
        ],
        '2',
      ),
      visual: 'Four apples drawn in a row, the final two scored through, with 4 − 2 = 2 below.',
      // A WORKED EXAMPLE MAY DRAW THE MOVE, and only a worked example may. Its
      // answer is already on the page, so showing the two apples leaving is
      // modelling rather than giving away — and it is the one place a child sees
      // the taking-out that the assessed pages deliberately never draw
      // (disclosure 1).
      figure: counterGroups([{ count: 4, noun: 'apples' }], {
        arrangement: 'in a row',
        relation: 'remove',
        crossedOut: 2,
        alt: 'a run of apples with strokes drawn over the last of them',
        asserts: { of: 'remaining', equals: 'answer' },
      }),
    },
    {
      ...ge(
        18,
        4,
        'independent',
        withScene(
          'a row of stars with room beside them',
          'Noor has 6 stars and wins 3 more. How many stars now? Say 6, 3, and 9.',
        ),
        [{ childDo: spoken('Decide the move first, and then count them.'), expected: '9' }],
        '9',
      ),
      visual: 'Six stars drawn in a row with three further ones alongside them.',
      figure: counterGroups(
        [{ count: 6, noun: 'stars' }, { count: 3, noun: 'stars' }],
        { relation: 'join', alt: 'a longer run of stars and a shorter run beside it', asserts: { equals: 'answer' } },
      ),
    },
  ],
  days: [
    // Day 1 — name the move in a picture, then meet it in both directions.
    [
      { gen: gameCrossOut, diff: 2 },
      { gen: sortsOnDayOne, diff: 2 },
      { gen: meetsAJoin, diff: 2 },
      { gen: meetsATakeAway, diff: 2 },
    ],
    // Day 2 — the story alone decides, and one page where the story is not the
    // question.
    [
      { gen: gameCountBack, diff: 2 },
      { gen: decidesOnDayTwo, diff: 2 },
      { gen: listensDayTwo, diff: 3 },
      { gen: countsTheGaps, diff: 3 },
    ],
    // Day 3 — the same verb both ways, and the puppet who adds anyway.
    [
      { gen: gameJoin, diff: 2 },
      { gen: listensDayThree, diff: 3 },
      { gen: decidesOnDayThree, diff: 2 },
      { gen: puppetDayThree, diff: 3 },
    ],
    // Day 4 — three containers, filling and emptying.
    [
      { gen: gameHiding, diff: 2 },
      { gen: storyPail, diff: 3 },
      { gen: storyBarrow, diff: 3 },
      { gen: storyNest, diff: 3 },
    ],
    // Day 5 — sort the pictures, judge the sentences, show the move yourself.
    [
      { gen: sortsOnDayFive, diff: 2 },
      { gen: checksTheSentence, diff: 3 },
      { gen: drawsOrMarks, diff: 2 },
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
    'For grown-ups: for four weeks your child has been told which sum to do. Adding week, taking-away week, counting-back week — every page announced itself, and the work was carrying it out. This week the pages stop announcing. Same picture, same two numbers, and the story decides. That is a genuinely new demand and it is normal for a confident counter to wobble at it for a few days. Here is the one habit worth heading off. Children learn very fast that certain words mean certain sums — gave, lost and away mean take away; found, more and altogether mean add — and it works often enough to feel like knowledge. It is not knowledge, and it falls over the moment a story says something like "she was given three more". So ask a question that has nothing to do with words: are there more of them now, or fewer? A child who can answer that has chosen the move, and the counting afterwards is the easy half. Two ways to practise without a screen. Put a handful of buttons on the table and narrate small events — two arrive, one goes, three arrive — pausing each time to ask more or fewer before anybody counts. Or tell the same story twice with one word changed and see whether they hear it. What you should NOT expect yet is a written sum. Hearing "six and two more makes eight" while the buttons are in front of them is exactly the right amount for now.',
  ],
  /**
   * THE PUZZLE ASKS THE QUESTION NO PAGE IN THE WEEK KEYS: not what the move
   * makes, but which move to make.
   *
   * Every day page hands the child a story and asks for a number. Here the two
   * ENDS are given — a drawn row and a target said aloud — and both the move and
   * its size are theirs to work out and then perform. It is the band's
   * sanctioned build task, and it is the only place in the week where choosing
   * wrongly leaves a visible trace: a child who draws when they should have
   * marked ends up further from the target than they started, and can see it.
   *
   * It carries no `asserts`. What the picture can compute is the row it was
   * drawn from, which is the GIVEN; what the item asks for is how many things
   * must move. `figureValue` has no selector for the second, and aiming the
   * assertion at the first would put a truthful picture and a correct answer on
   * opposite sides of QG-13. One drawn row and one drawn target produce both the
   * drawing and the key, so they cannot disagree.
   */
  puzzle: (r) => {
    const noun = r.pick(COUNTABLE_NOUNS);
    const here = r.int(3, 8);
    const step = r.int(1, 3);
    // Deterministic and never degenerate: the target is a real distance away in
    // whichever direction was drawn, and a row of three to eight leaves room for
    // three steps on both sides inside ten (kit §E2.4 — never a redraw loop).
    const up = r.chance(0.5);
    const target = up ? Math.min(HOW_MANY_CELLS, here + step) : Math.max(1, here - step);
    const moved = Math.abs(target - here);
    return {
      id: 'A18-PZ-01',
      title: 'Puzzle Grove: Draw It or Cross It',
      puzzleType: 'construction',
      prompt: [
        '[image: a row of things with space around it]',
        spoken(
          `This row has ${countNoun(here, noun)}. Make it show ${String(target)}. Then say which move you used.`,
        ),
      ].join(' '),
      figure: counters(here, noun, {
        arrangement: 'in a row',
        alt: rowAlt(noun),
      }),
      answer: {
        value: String(moved),
        acceptableForms: [
          up ? `${countNoun(moved, noun)} drawn on` : `${countNoun(moved, noun)} marked off`,
        ],
        validation: 'manual-review',
      },
      hintLadder: ladder(
        'How many things does the row hold already?',
        'Is your target above that, or below it?',
      ),
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'pick-the-move-that-reaches-a-target' },
  sprint: null,
  mastery: [
    { gen: masteryJoin, diff: 2 },
    { gen: masteryTipOne, diff: 3 },
    { gen: masteryStory, diff: 3 },
    { gen: masteryGaps, diff: 3 },
    { gen: masteryPuppet, diff: 3 },
    { gen: masteryTipTwo, diff: 3 },
  ],
  isomorphNotes:
    'The two forms are built from a single list of six generators and a single list of six difficulties, matched position for position, with a separate number stream behind each form so no pair is ever served twice in one pack. Nothing is typed: every answer is one of three cards authored in this file, which is what stops the display layer inventing four number buttons for a numeric page at this band. Five of the six pages draw ONE plain group exactly as it stood before anything happened, so the drawing states a quantity and gives no hint of the move; the sixth draws a counting frame. 01: a story that brings more, keyed on the joined total. 02 and 06: one group under two stories that share every word but the last, tipped in for one and tipped out for the other, questioned identically both times, so the number wanted is the larger of the pair here and the smaller there. 03: the same choice made at a real container being loaded or emptied, with a person, a place and both amounts named. 04: a frame with counters dropping into it, keyed on the CELLS THAT STAY EMPTY. 05: a puppet who joins two counts that his own story parted, and finishes above the truth. THE TWO DECIDING SLOTS TAKE ONE MOVE EACH inside a form, handed out rather than tossed for, and each form is handed out on its own. THE SIX SLOTS ARE DEALT SO THAT NEITHER BLIND OPERATION CAN PASS. Slot 01 always keys a sum; slots 03 and 05 always key a difference; slots 02 and 06 key one of each; and slot 04 can key neither, because its answer is the frame\'s ten less both stated counts and every pair whose gaps coincide with the sum, the difference or either stated count is refused at the pool. So a child who adds whatever two numbers a page states scores exactly two of six on every form, and a child who subtracts them scores exactly three, while a child who reads the question answers all six. NO ANSWER IS HEARD BEFORE ITS QUESTION: at this band the accessible name of the picture plays first, and here it names only the things and the room around them, carrying no digit and no number word, so the audio alone settles nothing. Every numeral a slot offers is a numeral that slot can key, computed from its own pair pool rather than declared: 0 reaches no card in the week, 10 reaches only the two story-direction slots, and 5 never reaches the frame slot, which cannot key it.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'runs-the-move-the-story-did-not-ask-for',
      description: 'Applies one operation to whatever two numbers a page states, whichever way the story actually went. It is not carelessness: for four weeks running, every page a child met announced its own operation, so reading a story for the move is a demand none of the earlier weeks made and it has to be built.',
      exampleWrongAnswer: 'told that a tray of seven lost three, and answering ten',
      distractorRationale: 'Whichever move the story did NOT make appears as a card on every counting page here, and it is the KEYED value wherever a story goes the other way — so it can be neither ignored nor relied upon. One word settles whether that same numeral is the answer, and growing an ear for the word is the point of the week.',
      reteachPointer: 'explanation/script[3] (the same blocks and the same two, with the story picking the move)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-with-one-of-the-two-counts',
      description: 'Hands back the group that was already there, or the group that moved, instead of the group the question asked about. Nothing is miscounted; what goes astray is which of the two numbers in the story the question named.',
      exampleWrongAnswer: 'asked what stays when three of nine go, and answering three',
      distractorRationale: 'Both stated counts are offered wherever the slot can key them, and both ARE keyed somewhere in the week — the starting group whenever a warm-up asks about the whole row, the moving group whenever the numbers fall that way. It is the commonest slip among children who can count perfectly well, and it is why the frame page asks about a quantity neither number can supply.',
      reteachPointer: 'explanation/summary (decide the move, and count only after that)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place-at-the-join-or-the-cut',
      description: 'Chooses the right move and then miscounts by a step, almost always at the point where the old group meets the new one or where the removing is supposed to stop. The reasoning is sound and the fingers are ahead of the words.',
      exampleWrongAnswer: 'putting five and three together and reporting nine',
      distractorRationale: 'One card either side of the truth is offered wherever the slot can key it, so a near miss lands on a real button rather than on nothing, and an adult can tell a counting wobble apart from a wrong decision at a glance. The two are different problems and they need different sentences.',
      reteachPointer: 'guidedExamples/A18-GE-01 (counting them all after the move is chosen)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-the-picture-and-ignores-the-story',
      description: 'Answers with what the drawing shows, because in the weeks before this one the drawing usually held the answer. Here it never does: the picture is the group as it stood before anything happened, so it is a starting point and not a result.',
      exampleWrongAnswer: 'asked how many cells stay empty, answering the counters already in the frame',
      distractorRationale: 'The drawn amount appears on the frame page and on the covered-part warm-up, where the picture states it outright, and neither page keys it. It is the card that shows an adult a child was watching instead of listening, and that wants a different conversation from a miscount.',
      reteachPointer: 'guidedExamples/A18-GE-03 (the word out doing all the work)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Choosing the operation instead of being told it. Every picture this week showed a group exactly as it was before anything happened, so the story had to be listened to: did something arrive, or did something leave? We practised asking "more, or fewer?" before touching a number, and we met two stories that used the same words and meant opposite things.',
    improvingCandidates: [
      'asking whether a group grew or shrank before counting anything',
      'hearing a whole story through to its last word',
      'telling two stories apart when they share the same verb',
      'working out a quantity the story did not mention at all',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'choosing the move from the whole story rather than from one familiar word — we will keep telling the same story twice with one word changed',
      },
      {
        errorTag: 'task-comprehension',
        text: 'settling which of the two counts a question is asking about before answering it',
      },
      {
        errorTag: 'representation-misread',
        text: 'treating the drawing as where the story starts rather than as where the answer is waiting',
      },
    ],
    homeFocus: {
      praiseLine:
        'You noticed that the group was going to get smaller, and you counted it that way.',
      questionForChild: 'More of them now, or fewer? How can you tell?',
      schoolSyncHook: 'Tell us which word in a story trips your child up most, and next week\'s stories can lean on it.',
    },
    vocabularyForParent: [
      'add (bring more things to the ones already there)',
      'take away (part of a group leaves, and a smaller amount stays)',
      'the move (what a story does to a group: brings some, or takes some)',
      'number sentence (a written line saying what happened, such as six minus two)',
    ],
  },
});
