/**
 * Level A · Week 3 — "Writing numbers 0–5" (conceptId: writing-numbers-0-5).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber`. a05, a07 and a12 were
 * read for their ARCHITECTURE only — the option deal, the rank rotation, the
 * per-pack freshness, the figure discipline, the authored-choices wrapper. Every
 * sentence, scene, name, hint, gloss and distractor rationale below was written
 * for this week.
 *
 * FILL-ARCHITECTURE §3 row A3: anchor "trace → write"; core forms "trace,
 * write-from-count"; Day-5 "numeral↔set match". Catalog: computational focus
 * "numeral tracing and free writing 0–5", non-computational Day-5 focus "number
 * hunt: numerals in real-world scenes".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE SUBSTITUTION, STATED FIRST BECAUSE IT CHANGES THE WEEK
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **The recipe's discrimination — "correct 3 vs mirrored 3" — is not built, and
 * ZERO is built in its place.** The substitution is a standing ruling
 * (`meta/HANDOFF-2026-08-10-LEVEL-A.md` §5, carried into
 * `build/SEAM-AUDIT-K8.md` §6 table M0 week 6), not a choice made here.
 *
 * WHY THE MIRRORED 3 CANNOT BE BUILT. Three independent blocks, none of which a
 * new renderer would lift: there is no numeral-glyph primitive in
 * `lib/figures.ts` (the nine builders draw counters, frames, lines, bars, grids,
 * clocks, coins, points and angles — never a written digit); a reversed 3 is not
 * an ASCII character, so it cannot be an option string either; and the item's
 * figure `alt` is spoken BEFORE the question at this band, so any alt able to
 * describe the two candidates would have to name the digit out loud and hand the
 * answer over.
 *
 * WHY ZERO IS THE RIGHT SUBSTITUTE. It is this week's genuinely new content —
 * A1 counted 1–5 and the catalog says *writing 0–5*, so zero is the one numeral
 * the child has never met. It is buildable exactly where the mirrored glyph is
 * not: an empty five-frame is a real picture (the boxes are drawn; the emptiness
 * is visible) and a speakable scene. And the misconception it carries is the
 * genuine perceptual trap at four and five — **none is a quantity with a mark of
 * its own, not the absence of an answer.**
 *   · Discrimination: an empty frame against a frame holding one (`noneOrOne`,
 *     Days 2 and 3), plus "which quantity did the question name?" (`emptyBoxes`).
 *   · Puppet-EA: a box with nothing in it is given a number it should not have,
 *     or is slid past because there is nothing there to touch (`puppetFrame`).
 *   · Day 5: numeral↔set match with an empty group live in the set, per the
 *     recipe.
 *
 * **WHAT IS LOST, PLAINLY.** Three things, and none of them is small.
 *  1. *The reversal itself goes untaught.* A child who writes ϵ for 3 or a
 *     backwards 2 meets nothing in this week that names it. That is the single
 *     commonest thing a reception teacher corrects, and the corpus now has no
 *     cell for it at all — A4's 6/9 flip is a different confusion (two numerals
 *     swapped, not one numeral mirrored) and does not cover it.
 *  2. *The week's own anchor is only half-rendered.* "Trace → write" needs a
 *     numeral to trace, and there is none to draw, so the tracing lives entirely
 *     off-screen — in the lesson script, in the guided examples and in the Day-5
 *     parent strip, where it is directed as finger-in-the-air, finger-on-a-palm
 *     and finger-in-sand. On screen the child only ever WRITES (on the scratch
 *     pad, `manual-review`). The half of the anchor a device could carry is the
 *     half it does not carry.
 *  3. *The discrimination is now about quantity rather than about symbol shape.*
 *     A3 was the one place in Level A where the perceptual contrast was between
 *     two MARKS. Every remaining A-band discrimination compares sets, lengths,
 *     poses or sounds. The level ships without a single item that looks at the
 *     written symbol itself.
 * A numeral-glyph primitive — a drawn digit with an optional mirror flag and a
 * trace path — would restore all three at once, and it is the single most
 * valuable thing missing from `lib/figures.ts` for this band. Recorded for the
 * orchestrator rather than worked around.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THE WEEK CLAIMS, AND HOW THE CONTENT FORCES IT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  - **A number is a mark you make, and every count from none to five has one.**
 *    So the child's job on every page is to get from a picture to a numeral, and
 *    the numeral is the thing tapped or written — never the picture.
 *  - **An empty frame has an answer.** It is drawn on Day 1, it is the
 *    completion guided example, it is a live keyed card in every certifying
 *    slot, and it is what the puppet gets wrong.
 *  - **Nothing here is answerable off the sentence.** The counts live only in the
 *    drawing. Band A trades the multi-step quota for `pictorialPerDay: 1`; all
 *    fifteen non-retrieval items on Days 1–4 carry a figure built from their own
 *    drawn values.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Retrieval is 21.1%** (4 of 19 daily items), one warm-up on each of Days
 *    1–4, drawn only from A1 and A2 because nothing earlier exists.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DISCLOSURES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. **THE FIVE-FRAME IS THE ONLY VESSEL THAT CAN DRAW ZERO, AND THAT DECIDED
 *    THE WEEK'S PICTURES.** A counters group of zero renders as nothing at all —
 *    `CountersFig` lays out `n` glyphs and a group of none occupies zero width,
 *    so an "empty plate" is a caption with a blank beside it and a child cannot
 *    see that a plate is there to be empty. A five-frame draws its five boxes
 *    whatever is in them, so emptiness is visible rather than implied. Every
 *    item whose answer can be zero therefore uses `tenFrame(n, {size: 5})`; the
 *    loose-counter pictures are kept for counts of one and up, where they are
 *    honest and give the week something other than a frame to look at. The one
 *    place a labelled empty group is used deliberately is the Day-5 match, where
 *    `relation: 'compare'` puts each group on its own labelled row so the empty
 *    row still reads as a row. A container primitive — a drawn plate, tray or
 *    box that exists independently of what is in it — is what the library is
 *    missing here, and it is what would let a zero story leave the frame.
 *
 * 2. **EVERY CERTIFYING SLOT CARRIES AUTHORED CHOICES, AND SO DOES EVERY WARM-UP
 *    THAT COULD.** A band-A numeric item with no `choices` is not a free-entry
 *    page: `AnswerEntry` hands it to `tapOptionsFor`, which invents four buttons
 *    at render time from a function that cannot know the slot's answer range
 *    (L53), and a pre-reader cannot type in any case. All six mastery slots and
 *    all fifteen non-retrieval day items here are `choice-key` with three
 *    authored options, or `manual-review`, which `AnswerEntry` short-circuits
 *    before the button-maker is reached. All four warm-ups arrive from the
 *    family as `exact-numeric` with no options, so `withThreeCounts` gives each
 *    of them the WHOLE range its own draw can produce as its three cards:
 *    the set is then constant and carries no information, while the key's rank
 *    moves with the picture, so nothing on those pages is unkeyable. Nothing is
 *    added to `DECLARED_LURES`: this week declares no lure, because it has none.
 *
 * 3. **THE RANK IS EXACTLY FLAT ON FOUR OF THE SIX CERTIFYING SLOTS, AND THE
 *    ARITHMETIC IS WHY, NOT LUCK.** With an answer space of 0–5 the extremes
 *    pin themselves: zero can only ever be the smallest number offered and five
 *    can only ever be the largest, so a naive deal leaves "tap the smallest"
 *    and "tap the biggest" both worth more than a third. The fix is the FALLBACK
 *    ORDER in `dealTwo`. A target rank is drawn uniformly; when the drawn count
 *    cannot realise it, the deal steps to the NEAREST rank rather than cycling.
 *    On the frame pages the wrong-value pool is {n±1, n±2, the five boxes, the
 *    empty boxes}, which makes "truth lowest" reachable at n = 0,1,2,3 and
 *    "truth highest" at n = 2,3,4,5 — and nearest-fallback then sends n = 1's
 *    impossible "highest" to "middle" and n = 4's impossible "lowest" to
 *    "middle", which lands every rank on exactly 1/3. Measured rates for every
 *    slot are in the report; they are not approximately a third, they are a
 *    third. The two slots that are not flat are named there too, with the
 *    structural reason for each.
 *
 * 4. **THE PUPPET'S SLIP IS `a_verify_count_slip_v1`, AND THE `slip` PARAM IS
 *    READ AS ITS ARITHMETIC RATHER THAN AS THE FAMILY'S NARRATION.** The
 *    transform takes `{n, slip}` and returns `{correct: n, wrong: n ± 1}` —
 *    `slip` is a DIRECTION switch, and the family's docstring names the
 *    commonest cause of each direction ("double-count: one object touched
 *    twice"; "skip-count: one object never touched"). This week's cause is a
 *    different one in the same direction, and it is the recipe's own: a box with
 *    NOTHING in it is given a number it should not have (one too many), or is
 *    slid past because there is nothing in it to touch (one too few). Both are
 *    literally what the transform computes; nothing is fabricated, and QG-11
 *    recomputes both halves at every seed. The rationale printed on each card
 *    says which of the two the drawn page is. This is the §E2.3 case — the
 *    verify library has no "treated an absence as an answer" transform — and it
 *    is resolved by finding the identity rather than by inventing a number: the
 *    misconception's output IS the truth ± 1, which the registry already
 *    computes. On the ASK-EMPTY branch the param `n` carries the count of EMPTY
 *    boxes rather than of counters, which is what that page asks about; the
 *    transform's contract is "the truth is n", and the empty boxes are a set
 *    with a size like any other.
 *
 * 5. **`emptyBoxes` KEYS ZERO, AND THAT IS THE WHOLE REASON IT IS CORE RATHER
 *    THAN A WARM-UP.** The family's `tenFrameEmpty` asks the same question and
 *    cannot ever key zero — its guard clamps the fill to between one and
 *    `size − 1`, so at least one box is always empty and at least one is always
 *    full. That is right for A2, where the point is that a frame has two parts.
 *    It is wrong here, where the point is that a FULL frame still has an answer
 *    to "how many boxes have nothing in them", and that answer is zero. So the
 *    local version draws the fill across the whole range 0–5 on a five-frame.
 *    It also runs through `a_numeral_for_set_v1`, whose contract is "the set has
 *    n members and the numeral for it is n": here the set is the empty boxes,
 *    which is a true reading of that transform and is stated rather than buried.
 *
 * 6. **THE `[image: …]` BRACKET NAMES THE COUNT AND THE FIGURE `alt` NEVER
 *    DOES.** `promptText` strips the bracket before anything reaches the screen
 *    and `speakablePrompt` prefers `figure.alt` over it, so the bracket reaches
 *    nobody — but it carries the numeric token this pack's freshness machinery
 *    signs items with, and emptying it would stop the item being guarded at all.
 *    The ALT is what a four-year-old actually HEARS, before the question, so it
 *    names the frame, names the kind of thing that goes in it, and names no
 *    quantity whatever. The frame is called "a five-frame" — hyphenated, one
 *    token, the manipulative's own name — never "a frame of five boxes", because
 *    a bare "five" in a spoken scene beside an answer of 5 is a disclosure the
 *    spoken-answer gate is right to catch.
 *
 * 7. **FRESHNESS IS SIGNED ON THE KIND OF THING, NOT ON THE COUNT.** With six counts
 *    in the week's whole range, `drawUniqueItem`'s one-token signature would pin
 *    slots the way it pinned A1's (kit §E lesson 5: a Form-A slot keyed "2" on
 *    77% of draws). So every generator here draws through `drawFresh` on the
 *    DRAWN KIND — nine drawable kinds against at most five uses of any one
 *    namespace, and each generator carries its own namespace so one form cannot
 *    exhaust another's. Signing on the kind rather than on the pair is what
 *    reading a generated week changed: (count, kind) left two Day-1 pages both
 *    showing shells, which is a repeat a reader sees and no gate does, and the
 *    count is uniform either way because a redraw discards both. Two consequences worth
 *    stating: the day pages' prompts carry a single numeric token, so QG-1 never
 *    applies to them (a one-token prompt has no surface signature), and Form B's
 *    distinctness from Form A is carried by the pair being fresh rather than by
 *    the prompt guard. The two generators whose prompts DO carry two or more
 *    tokens — the puppet and the Day-5 match — sign on the values that appear in
 *    the prompt, so their Form-A and Form-B surfaces cannot collide.
 *
 * 8. **NINE LOCAL GENERATORS, AND WHY NONE OF THEM IS IN THE FAMILY.** Six exist
 *    because the family's numeral forms cannot reach zero: `howManyChoice` draws
 *    from a caller range but builds its options as n ± 1 and n ± 2, which at a
 *    floor of zero offers negative numbers; `tenFrameRead` and `tenFrameEmpty`
 *    validate as `exact-numeric` with no options at all; `tenFrameEmpty` cannot
 *    key zero by construction (disclosure 5); `setForNumeral` shuffles nouns
 *    across groups without ever offering an empty one; and `puppetSlip`'s closed
 *    `PuppetSlip` union has no empty-box slip in it. Two more are the wrappers
 *    disclosure 2 describes. None departs from how the family builds an item:
 *    each names a `templateId` the registry resolves, draws its picture through
 *    `lib/figures`, renders every quantity through `lib/format`, and stamps
 *    `authorMeta` for the preflight to read.
 *
 * 9. **WHAT ONLY READING THE GENERATED WEEK FOUND.** The first build asked
 *    "Tap the number that shows how many" on every numeral page, which is the
 *    family's own sentence and would have shipped a04's and a01's question
 *    verbatim into a third week; the questions here are the week's own and they
 *    say WRITE, because that is what this week is. The first `emptyBoxes` asked
 *    "How many boxes are empty?", which is `tenFrameEmpty`'s exact sentence;
 *    "How many boxes have nothing in them?" is both fresher and clearer about
 *    what emptiness is. And the first Day-4 story put the frame in a story that
 *    said "fills her frame", which is false on the draw the week exists for.
 */

import type { BBFigure } from '../../../figures/types';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { drawFresh, makeChoices } from '../shared';
import type { ItemDraft } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  countArrangement,
  tenFrameEmpty,
  tenFrameRead,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import {
  assertsAnswer,
  assertsAnswerOf,
  assertsParam,
  counterGroups,
  counters,
  iconFor,
  tenFrame,
} from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** The frame this week works in: five boxes, so the range is none to five. */
const FRAME = 5;

/** Eight names, one drawn per story. Nothing below hardcodes one (kit §F.3). */
const NAMES = ['Suki', 'Marek', 'Odile', 'Boaz', 'Linnea', 'Tavi', 'Gwen', 'Roshan'] as const;

// ---------------------------------------------------------------------------
// TEN WORDS, COUNTED THE WAY THE GATE COUNTS THEM
//
// Two ceilings exist and only one is the law. `earlynumber`'s `ask()` weighs a
// whole prompt string, so a three-sentence puppet page trips a limit it never
// breaks; `bb-readability-test` weighs one SENTENCE at a time on every surface a
// child hears, and that is the measurement this file must pass. Its splitter and
// its word counter are mirrored here and every authored string is pushed through
// them, so an eleventh word throws when the module loads or when the item is
// drawn — never at review time.
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
      throw new Error(`A3: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
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
 * Swap in help written for THIS week without reaching into `lib/`.
 *
 * A ladder may appear at most twice across the fifteen non-retrieval core items,
 * which puts a floor of eight distinct ladders under the week and makes the
 * ladder count a design input rather than an afterthought (kit §E, A-band lesson
 * 1); twenty-one are shipped, so no ladder is used more than once anywhere. The
 * arithmetic is only half of it — the help genuinely wants to differ. A first
 * meeting wants "look in the boxes, not at them"; an empty frame wants "nothing
 * still has a number"; a puppet page wants "count it yourself first". None of
 * those could live in the shared family without being said in all twenty-four
 * Level-A weeks at once.
 *
 * The closure rewrites one field of an already-built draft and draws nothing
 * itself, so the prompt QG-1 and QG-4 sign for freshness is untouched.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Bring an earlier week's own item back as today's warm-up.
 *
 * A3 is the third cell in the whole curriculum graph, so there are exactly two
 * weeks to retrieve from and the four warm-ups have to earn their minute out of
 * a very small library. What decided them is what WRITING a numeral rests on:
 * counting a short row without losing your place (A1), reading a frame that is
 * partly full (A2), counting a jumble where you have to make your own order
 * (A2), and putting counters INTO a frame, which is the hand-movement the
 * writing pages ask for in a different register (A2).
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The two vessels
// ===========================================================================

/**
 * The frame that can be empty.
 *
 * `alt` names the manipulative and the kind of thing that goes in it and no
 * quantity at all, so a child who hears it before the question knows what he is
 * looking at and still has to look. "five-frame" is hyphenated on purpose
 * (disclosure 6).
 */
function frameFigure(n: number, noun: string, asserts?: BBFigure['asserts']): BBFigure {
  return tenFrame(n, {
    size: 5,
    icon: iconFor(noun),
    alt: `the small frame that ${noun} go in`,
    ...(asserts ? { asserts } : {}),
  });
}

/** Loose things on a surface — used only where the count is one or more. */
function looseFigure(n: number, noun: string, layout: 'row' | 'heap', where: string): BBFigure {
  return counters(n, noun, {
    arrangement: layout === 'row' ? 'in a row' : 'scattered',
    alt: layout === 'row' ? `a row of ${noun} on ${where}` : `${noun} dotted about on ${where}`,
    asserts: assertsParam('n'),
  });
}

// ===========================================================================
// The option deal — one mechanism, every numeral form
// ===========================================================================

interface Wrong {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Two wrong values, with the truth's RANK rotated — and the rotation is exact
 * rather than approximate on the frame pages (disclosure 3).
 *
 * A target rank is drawn uniformly: 0 puts the truth lowest (both wrongs above),
 * 1 puts it in the middle, 2 puts it highest. When the drawn count cannot
 * realise the target — nothing sits below zero, nothing above five — the deal
 * steps to the NEAREST reachable rank rather than cycling, which is what makes
 * the marginal come out level instead of piling on the extremes. Deterministic
 * throughout: one `r.int` for the target, then shuffles; never a redraw loop
 * (kit §E2.4).
 */
function dealTwo(r: Rng, below: readonly number[], above: readonly number[]): number[] {
  const reachable: Record<number, boolean> = {
    0: above.length >= 2,
    1: below.length >= 1 && above.length >= 1,
    2: below.length >= 2,
  };
  const want = r.int(0, 2);
  const order = want === 0 ? [0, 1, 2] : want === 1 ? [1, 0, 2] : [2, 1, 0];
  for (const rank of order) {
    if (!reachable[rank]) continue;
    if (rank === 0) return r.shuffle(above).slice(0, 2);
    if (rank === 2) return r.shuffle(below).slice(0, 2);
    return [r.pick(below), r.pick(above)];
  }
  throw new Error('A3 dealTwo: no rank is reachable — the wrong-value pool is too thin');
}

/**
 * The offerable values, each appearing once, in the order they were offered.
 *
 * `floor` IS THE DEAD-OPTION FIX AND IT WAS MEASURED, NOT ANTICIPATED. A slot
 * whose count starts at one — the Day-1 opener, the loose row, the two loose
 * stories — can never key zero, but "one too few" offers zero the moment the
 * drawn count is one. Measured over 1,200 packs before this argument existed,
 * "0" was offered on those four slots and keyed on none of them: the L38 shape
 * exactly, a card a child learns to strike out unread, turning a three-way page
 * into a coin flip. So a slot may only ever offer a value it is able to key, and
 * `floor` is the lowest count the slot can draw.
 *
 * It pays twice, which is why it is worth stating rather than just doing. With
 * zero removed, a drawn count of one has NOTHING below it, so `dealTwo`'s
 * nearest-fallback sends both of its unreachable targets to "truth lowest" — and
 * that is exactly the weight the top of the range was missing. The four slots
 * measured 19/41/40 before and a level third afterwards.
 */
function tidyPool(values: readonly number[], truth: number, floor = 0): number[] {
  const seen = new Set<number>([truth]);
  const out: number[] = [];
  for (const v of values) {
    if (v < floor || v > FRAME || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/**
 * Why a number that is not the answer might still be tapped on a COUNTING page.
 *
 * Read off the value and the truth rather than off the branch that produced
 * them, so a rationale can never drift from the card it explains. The order of
 * the tests is the order of the causes: a miscount by one or two is checked
 * first because it explains those values best, and the frame-shaped errors are
 * read off what is left.
 */
function countRationale(v: number, n: number, vessel: 'frame' | 'loose'): Wrong {
  const text = String(v);
  if (v === n + 1) {
    return n === 0
      ? {
        text,
        errorTag: 'concept-misconception',
        rationale: 'The first counting word said over an empty frame — none was treated as too little to have a number, so the count began anyway.',
      }
      : {
        text,
        errorTag: 'procedure-slip',
        rationale: vessel === 'frame'
          ? 'One too many: a box was given a number twice, or an empty one was given a number at all.'
          : 'One too many: the hand came back over something it had already counted.',
      };
  }
  if (v === n + 2) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'Two too many: the counting carried on past the last thing and picked up two extra numbers.',
    };
  }
  if (v === n - 1) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'One too few: one of them was passed over and never given a number of its own.',
    };
  }
  if (v === n - 2) {
    return {
      text,
      errorTag: 'procedure-slip',
      rationale: 'Two too few: the counting stopped two short, before the last two were reached.',
    };
  }
  if (v === FRAME) {
    return {
      text,
      errorTag: 'representation-misread',
      rationale: 'The five boxes counted instead of what is sitting in them — the frame is the loudest thing on the page.',
    };
  }
  return {
    text,
    errorTag: 'representation-misread',
    rationale: 'The empty boxes counted instead of the full ones — the gaps are as easy to see as the things.',
  };
}

// ===========================================================================
// Local generator 1 — count it, then choose its mark
// ===========================================================================

/**
 * The week's spine: a picture, and three numerals to choose between.
 *
 * The truth is recomputed by the registered `a_numeral_for_set_v1`, which
 * returns the numeral for a set of `n`, so QG-11 proves the keyed card is the
 * truth at every seed rather than taking this file's word for it; the figure
 * asserts the same `n`, so QG-13 proves the picture holds what the answer says.
 *
 * On the frame the wrong-value pool carries the two frame-shaped errors as well
 * as the four miscounts — counting the five boxes, and counting the empty ones —
 * which is what makes every rank reachable and the deal exactly level
 * (disclosure 3). The loose pictures have neither error available, because there
 * is no frame to misread, and their rank is reported as it measures.
 */
function countAndWrite(opts: {
  tag: string;
  lo: number;
  hi: number;
  vessel: 'frame' | 'loose';
  layout?: 'row' | 'heap';
  where?: string;
  ask: string;
}): ItemGen {
  const { tag, lo, hi, vessel, ask } = opts;
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ n: r.int(lo, hi), noun: r.pick(COUNTABLE_NOUNS), seed: r.uint() }),
      (v) => `a3:${tag}:${v.noun}`,
    );
    const { n, noun } = draw;

    const pool = vessel === 'frame'
      ? [n - 1, n - 2, n + 1, n + 2, FRAME, FRAME - n]
      : [n - 1, n - 2, n + 1, n + 2];
    const offerable = tidyPool(pool, n, lo);
    const below = offerable.filter((v) => v < n);
    const above = offerable.filter((v) => v > n);
    const wrongs = dealTwo(rng, below, above).map((v) => countRationale(v, n, vessel));
    const { choices, correctKey } = makeChoices(rng, String(n), wrongs);

    const scene = vessel === 'frame'
      ? `a five-frame holding ${countNoun(n, noun)}`
      : `${countNoun(n, noun)} on ${opts.where ?? 'the table'}`;

    const draft: ItemDraft = {
      type: 'representation',
      prompt: scenePrompt(scene, ask),
      figure: vessel === 'frame'
        ? frameFigure(n, noun, assertsParam('n'))
        : looseFigure(n, noun, opts.layout ?? 'row', opts.where ?? 'the table'),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun }, seed: draw.seed },
      hintLadder: hints('Count the picture before you read the cards.', 'Whatever you said last is your mark.'),
      errorTags: ['representation-misread', 'procedure-slip', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'choose-numeral' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 2 — none, one or two (the substituted discrimination)
// ===========================================================================

/**
 * The bottom of the number line, where the week's trap lives.
 *
 * The frame holds none, one or two, and the three cards are ALWAYS 0, 1 and 2.
 * A constant option set is usually a tell — a12 measured a week where the set
 * named its own key — but it can only carry information if some member is keyed
 * more often than another, and here the drawn count is uniform over the three,
 * so the set is worth precisely nothing and the rank is exactly a third at every
 * position. What is left is the only thing the item is for: deciding whether the
 * frame in front of you holds nothing, one thing or two.
 *
 * That is the recipe's "an empty frame versus a frame holding one", with two
 * added so the page is a genuine three-way rather than a coin flip, and so the
 * child who has decided that "none means one" has somewhere else to be wrong.
 */
function noneOrOne(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ n: r.int(0, 2), noun: r.pick(COUNTABLE_NOUNS), seed: r.uint() }),
      (v) => `a3:few:${v.noun}`,
    );
    const { n, noun } = draw;

    const voice = (v: number): Wrong => {
      if (v === 0) {
        return {
          text: '0',
          errorTag: 'concept-misconception',
          rationale: 'A frame that does hold something read as an empty one — one or two things are easy to miss when the boxes are mostly bare.',
        };
      }
      if (v === 1) {
        return n === 0
          ? {
            text: '1',
            errorTag: 'concept-misconception',
            rationale: 'None answered as one: the child cannot let an empty frame have no things in it, so the count starts anyway.',
          }
          : {
            text: '1',
            errorTag: 'procedure-slip',
            rationale: 'Two things counted as one — the second was seen and never given its own number.',
          };
      }
      return n === 0
        ? {
          text: '2',
          errorTag: 'representation-misread',
          rationale: 'Empty boxes counted as though something were in them, so a bare frame comes back with a number of its own.',
        }
        : {
          text: '2',
          errorTag: 'procedure-slip',
          rationale: 'One thing counted twice — the finger came back to it and said the next number.',
        };
    };
    const wrongs = [0, 1, 2].filter((v) => v !== n).map(voice);
    const { choices, correctKey } = makeChoices(rng, String(n), wrongs);

    const draft: ItemDraft = {
      type: 'classification',
      prompt: scenePrompt(`a five-frame holding ${countNoun(n, noun)}`, 'Is it none, one or two?'),
      figure: frameFigure(n, noun, assertsParam('n')),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun }, seed: draw.seed },
      hintLadder: hints('Look inside the boxes, one by one.', 'Some frames hold nothing at all.'),
      errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
      authorMeta: { stepCount: 1, cognitiveOp: 'tell-none-from-one', isDiscrimination: true },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 3 — the boxes with nothing in them
// ===========================================================================

/**
 * Zero arrived at from the other side: a FULL frame has no empty boxes, and
 * "none" is the answer to a question about a picture that is not empty at all.
 *
 * It is also a discrimination in its own right, and a perceptual one: two
 * countable quantities sit in the same picture and only the question says which
 * is wanted. The card carrying the OTHER quantity is offered on every draw and
 * keyed on none of them — but the numeral on it is keyed constantly on other
 * draws, so no value can be struck out unread, and a child who eliminates it has
 * had to count the full boxes to know what it says.
 */
function emptyBoxes(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ filled: r.int(0, FRAME), noun: r.pick(COUNTABLE_NOUNS), seed: r.uint() }),
      (v) => `a3:gap:${v.noun}`,
    );
    const { filled, noun } = draw;
    const truth = FRAME - filled;

    const voice = (v: number): Wrong => {
      if (v === filled) {
        return {
          text: String(v),
          errorTag: 'task-comprehension',
          rationale: 'The full boxes counted when the question asked for the bare ones — the things are louder than the gaps.',
        };
      }
      if (v === FRAME) {
        return {
          text: String(v),
          errorTag: 'representation-misread',
          rationale: 'Every box counted, full and bare together, as if the question had asked how big the frame is.',
        };
      }
      return {
        text: String(v),
        errorTag: 'procedure-slip',
        rationale: v > truth
          ? 'One or two too many: a box with something in it was swept up with the bare ones.'
          : 'One or two too few: a bare box at the end of the row was passed over.',
      };
    };

    const pool = [truth - 1, truth - 2, truth + 1, truth + 2, filled, FRAME];
    const below = tidyPool(pool, truth).filter((v) => v < truth);
    const above = tidyPool(pool, truth).filter((v) => v > truth);
    const wrongs = dealTwo(rng, below, above).map(voice);
    const { choices, correctKey } = makeChoices(rng, String(truth), wrongs);

    const draft: ItemDraft = {
      type: 'computation',
      prompt: scenePrompt(
        `a five-frame holding ${countNoun(filled, noun)}`,
        'How many boxes have nothing in them?',
      ),
      figure: frameFigure(filled, noun, assertsAnswerOf('empty')),
      choices,
      answer: { value: correctKey, acceptableForms: [String(truth)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n: truth, noun }, seed: draw.seed },
      hintLadder: hints('Listen again. Which boxes were asked about?', 'Touch only the boxes waiting to be filled.'),
      errorTags: ['task-comprehension', 'procedure-slip', 'representation-misread'],
      authorMeta: { stepCount: 1, cognitiveOp: 'count-the-bare-boxes', isDiscrimination: true },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 4 — help the puppet
// ===========================================================================

/**
 * A named puppet and an empty box (disclosure 4).
 *
 * Two questions sit over the same picture and the puppet's slip is the same
 * confusion answered from either side: asked what is IN the frame, he gives a
 * number to a box that holds nothing, which is one too many; asked how many
 * boxes are bare, his finger slides past one because there is nothing in it to
 * touch, which is one too few. Both directions are what `a_verify_count_slip_v1`
 * computes from the truth, so the shown slip is code-derived and QG-11
 * recomputes both halves.
 *
 * WHICH QUESTION IS ASKED IS DRAWN, and that is what keeps the rank moving. A
 * one-directional slip pins the truth to the bottom or the middle of the page —
 * the puppet's own number is always on the same side of it — so a child who has
 * noticed that the puppet is never right has a page half-answered. Drawing the
 * side puts the truth above his number as often as below, and the third card
 * then decides the rest.
 */
function puppetFrame(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({
        asksFilled: r.chance(0.5),
        filled: r.int(0, FRAME - 1),
        noun: r.pick(COUNTABLE_NOUNS),
        puppet: r.pick(PUPPETS),
        seed: r.uint(),
      }),
      (v) => `a3:pup:${v.asksFilled ? 'in' : 'bare'}:${String(v.filled)}`,
    );
    const { asksFilled, filled, noun, puppet } = draw;
    const truth = asksFilled ? filled : FRAME - filled;
    const said = asksFilled ? truth + 1 : truth - 1;
    const slip = asksFilled ? 'double-count' : 'skip-count';

    const puppetCard: Wrong = {
      text: String(said),
      errorTag: 'concept-misconception',
      rationale: asksFilled
        ? 'A box with nothing in it was given a number of its own, so the count came out one too big.'
        : 'A bare box was slid past — there was nothing in it to put a finger on — so the count came out one too small.',
    };
    // A THIRD CARD OF ZERO IS NOT A MISCOUNT AND MUST NOT BE EXPLAINED AS ONE.
    // Reading a generated week put "0" on a page whose truth was five, under a
    // rationale about the counting stopping early — true of the arithmetic and
    // false of the child. Zero has one cause at this age wherever it appears
    // wrongly, and it is the week's own: a bare box stops feeling like a box,
    // and then the page feels like it has nothing to answer.
    const third = (v: number): Wrong => {
      if (v === 0) {
        return {
          text: '0',
          errorTag: 'concept-misconception',
          rationale: 'None given for a page that does have something to count - once a box is bare it stops feeling like a box at all.',
        };
      }
      return {
        text: String(v),
        errorTag: 'procedure-slip',
        rationale: v > truth
          ? asksFilled
            ? 'Too many: a bare box was swept up with the ones that hold something.'
            : 'Too many: a box with something in it was counted among the bare ones.'
          : asksFilled
            ? 'Too few: something sitting in the frame was passed over and never counted.'
            : 'Too few: a bare box at the end of the row was passed over.',
      };
    };

    // WHICH SIDE THE THIRD CARD FALLS ON IS A FAIR COIN, and it is the only
    // rank lever this form has. The puppet's own number is always one step from
    // the truth on a fixed side, so the truth can read lowest or middle on the
    // "what is in it" pages and highest or middle on the "how many are bare"
    // pages — never all three. A one-directional slip on a three-card page
    // cannot do better than a half and a half within its branch, which is the
    // ceiling a01 recorded and this slot meets: a quarter, a half, a quarter,
    // measured. The coin is written symmetrically rather than as a
    // short-circuit, because `side && below.length` silently sent every
    // empty-below draw to the same place and pulled the branch off its half.
    const others = tidyPool(
      asksFilled ? [truth - 1, truth - 2, truth + 2, FRAME] : [truth + 1, truth + 2, truth - 2, 0],
      truth,
    ).filter((v) => v !== said);
    const below = others.filter((v) => v < truth);
    const above = others.filter((v) => v > truth);
    const useBelow = below.length > 0 && (above.length === 0 || rng.chance(0.5));
    const wrongs = [puppetCard, third(rng.pick(useBelow ? below : above))];
    const { choices, correctKey } = makeChoices(rng, String(truth), wrongs);

    const question = asksFilled
      ? `How many ${noun} are in it? ${puppet} says ${String(said)}. Tap the right number.`
      : `How many boxes have nothing in them? ${puppet} says ${String(said)}. Tap the right number.`;

    const draft: ItemDraft = {
      type: 'error-analysis',
      prompt: scenePrompt(`a five-frame holding ${countNoun(filled, noun)}`, question),
      figure: frameFigure(filled, noun, asksFilled ? assertsParam('n') : assertsParam('n', 'empty')),
      choices,
      answer: { value: correctKey, acceptableForms: [String(truth)], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      generator: { templateId: 'a_verify_count_slip_v1', params: { n: truth, slip }, seed: draw.seed },
      hintLadder: hints('Do the counting yourself, slowly.', 'Then look for where the finger went astray.'),
      errorTags: ['concept-misconception', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 5 — the Day-4 stories
// ===========================================================================

interface StoryFrame {
  /** The opening line: who, and what they did with the things. */
  line: (name: string, noun: string) => string;
  /** The question that follows it. */
  ask: string;
  /** How the picture is drawn, and what the bracket calls it. */
  vessel: 'frame' | 'loose';
  layout?: 'row' | 'heap';
  where?: string;
  /** The lowest count the story can honestly carry. */
  lo: number;
  ladder: string[];
}

/**
 * Three places, and only one of them can be empty.
 *
 * A saucer with nothing on it is a drawing of nothing (disclosure 1), so the two
 * loose stories start at one and the frame story carries the whole range down to
 * none. That is not a compromise hidden in the ranges: the frame story is the
 * one that goes in the mastery form, because it is the only story shape where a
 * child meets the week's own answer under a real-world sentence.
 */
const STORIES: Record<'saucer' | 'stool' | 'tidy', StoryFrame> = {
  saucer: {
    line: (name, noun) => `${name} tips the ${noun} onto a saucer.`,
    ask: 'How many landed on the saucer?',
    vessel: 'loose',
    layout: 'heap',
    where: 'a saucer',
    lo: 1,
    ladder: ['A jumble has no beginning. Choose one.', 'Once it has a number, move it away.'],
  },
  stool: {
    line: (name, noun) => `${name} lines the ${noun} up on a stool.`,
    ask: 'How many are on the stool?',
    vessel: 'loose',
    layout: 'row',
    where: 'a stool',
    lo: 1,
    ladder: ['Work along the stool from one end.', 'The row ends, and so does the counting.'],
  },
  tidy: {
    line: (name, noun) => `${name} keeps the ${noun} in a frame.`,
    ask: 'How many are inside it?',
    vessel: 'frame',
    lo: 0,
    ladder: ['Look inside the frame, box by box.', 'An empty frame still has an answer.'],
  },
};

/** A real-world single-step picture problem — the band-A form of the G7 row. */
function numberStory(which: 'saucer' | 'stool' | 'tidy'): ItemGen {
  const frame = STORIES[which];
  return (rng, guard, difficulty) => {
    // ONE NAME AND ONE KIND OF THING PER STORY, ACROSS THE WHOLE PACK — and
    // this is the fix reading a generated week produced. The name was drawn with
    // a plain `pick` and the noun was signed together with the count, so seed 3
    // put the same child in all three Day-4 stories and the same apples in two
    // of them. Both are signed on their own now: nine drawable kinds and eight
    // names against five story items, so a pack cannot repeat either.
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ n: r.int(frame.lo, FRAME), noun: r.pick(COUNTABLE_NOUNS), seed: r.uint() }),
      (v) => `a3:story:${v.noun}`,
    );
    const { n, noun } = draw;
    const name = drawFresh(rng, guard, (r) => r.pick(NAMES), (v) => `a3:name:${v}`);

    const pool = frame.vessel === 'frame'
      ? [n - 1, n - 2, n + 1, n + 2, FRAME, FRAME - n]
      : [n - 1, n - 2, n + 1, n + 2];
    const offerable = tidyPool(pool, n, frame.lo);
    const below = offerable.filter((v) => v < n);
    const above = offerable.filter((v) => v > n);
    const wrongs = dealTwo(rng, below, above).map((v) => countRationale(v, n, frame.vessel));
    const { choices, correctKey } = makeChoices(rng, String(n), wrongs);

    const scene = frame.vessel === 'frame'
      ? `a five-frame holding ${countNoun(n, noun)}`
      : `${countNoun(n, noun)} on ${frame.where ?? 'a saucer'}`;

    const draft: ItemDraft = {
      type: 'word-problem',
      prompt: scenePrompt(scene, `${frame.line(name, unitFor(2, noun))} ${frame.ask}`),
      figure: frame.vessel === 'frame'
        ? frameFigure(n, noun, assertsParam('n'))
        : looseFigure(n, noun, frame.layout ?? 'row', frame.where ?? 'a saucer'),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun }, seed: draw.seed },
      hintLadder: frame.ladder,
      errorTags: ['representation-misread', 'procedure-slip', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'story-numeral', situationType: 'combine' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 6 — the Day-5 numeral↔set match, with an empty group live
// ===========================================================================

/**
 * The recipe's Day-5 signature: a number is named and the child finds the group
 * that shows it.
 *
 * Three groups are drawn from 0–5 with no repeats, so an EMPTY group is on the
 * page on exactly half the draws and is the keyed answer on one draw in six —
 * the arithmetic is `C(5,2)/C(6,3)` for the group being present and a third for
 * it being the one named. `relation: 'compare'` puts every group on its own
 * labelled row, which is what lets an empty group read as a row that is empty
 * rather than as a gap in the picture (disclosure 1).
 *
 * The truth is a NOUN, so there is no numeric rank to pin; the habit that could
 * answer it is "tap the shortest row", and since the named number is drawn
 * uniformly among the three that is worth a third. The registered
 * `a_set_for_numeral_v1` re-finds the group holding `n` from the counts in
 * `generator.params`, so QG-11 proves the keyed row rather than trusting the
 * index this file chose.
 */
function matchTheNumeral(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => {
        const counts = r.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3);
        const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
        return { counts, nouns, target: r.int(0, 2), seed: r.uint() };
      },
      (v) => `a3:match:${[...v.counts].sort((a, b) => a - b).join('-')}:${String(v.counts[v.target])}`,
    );
    const { counts, nouns, target } = draw;
    const n = counts[target];

    const wrongs: Wrong[] = counts
      .map((c, i) => ({ c, i }))
      .filter(({ i }) => i !== target)
      .map(({ c, i }) => ({
        text: `the ${nouns[i]}`,
        errorTag: (c === 0 ? 'concept-misconception' : 'representation-misread') as ErrorTag,
        rationale: c === 0
          ? 'The empty row taken for whichever number was called — a row with nothing on it is read as "no answer" rather than as none.'
          : `That row holds ${String(c)} — chosen from how long it looks instead of from counting it.`,
      }));
    const { choices, correctKey } = makeChoices(rng, `the ${nouns[target]}`, wrongs);

    const draft: ItemDraft = {
      type: 'classification',
      prompt: scenePrompt(
        counts.map((c, i) => countNoun(c, nouns[i])).join(', '),
        `Which row shows ${String(n)}? Tap it.`,
      ),
      figure: counterGroups(
        counts.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
        {
          relation: 'compare',
          alt: `three rows to count: ${nouns[0]}, ${nouns[1]} and ${nouns[2]}`,
          asserts: assertsParam('n', `group:${String(target)}`),
        },
      ),
      choices,
      answer: {
        value: correctKey,
        acceptableForms: [`the ${nouns[target]}`, nouns[target]],
        validation: 'choice-key',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: {
        templateId: 'a_set_for_numeral_v1',
        params: { n, counts, nouns },
        seed: draw.seed,
      },
      hintLadder: hints('Count one row all the way first.', 'Only one row lands on that number.'),
      errorTags: ['representation-misread', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'match-set-to-numeral' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generators 7 and 8 — the two production tasks
// ===========================================================================

/**
 * Free writing, which is the catalog's own computational focus and the half of
 * "trace → write" a screen can carry.
 *
 * The child reads the frame and MAKES the mark on the scratch pad. There is no
 * numeral primitive to trace over (see the substitution note), so the tracing
 * that precedes this is directed in the lesson script and in the parent strip
 * and happens in the air, on a palm and in sand. `manual-review` at band A
 * renders a single "I did it!" tap rather than a keyboard, so the item is
 * ungraded by design: the answer is still code-derived from the drawn count and
 * is what the grown-up beside the child checks against.
 */
function writeItYourself(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ n: r.int(0, FRAME), noun: r.pick(COUNTABLE_NOUNS), seed: r.uint() }),
      (v) => `a3:write:${String(v.n)}:${v.noun}`,
    );
    const { n, noun } = draw;
    const draft: ItemDraft = {
      type: 'drawing',
      prompt: scenePrompt(
        `a five-frame holding ${countNoun(n, noun)}`,
        'Write the number for this frame.',
      ),
      figure: frameFigure(n, noun, assertsAnswer),
      answer: {
        value: String(n),
        acceptableForms: [`the number for ${countNoun(n, noun)}`],
        validation: 'manual-review',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_frame_read_v1', params: { n }, seed: draw.seed },
      hintLadder: hints('Say the number out loud first.', 'Now let your finger make its mark.'),
      errorTags: ['representation-misread', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: 'write-numeral' },
    };
    return draft;
  };
}

/**
 * The number hunt — the catalog's non-computational Day-5 focus, in its band-A
 * production form.
 *
 * The computable core is the frame's count; the open part is the hunt, which is
 * oral and happens away from the screen. Zero is in range and is the best draw
 * of the lot: the numerals a four-year-old can actually find in a room are door
 * numbers, oven dials, lift buttons and page corners, and every one of them has
 * a 0 on it somewhere. This is the item that carries the dual-strand coupling
 * gate — a non-computational task that demands a justification the software
 * cannot mark.
 */
function numberHunt(): ItemGen {
  return (rng, guard, difficulty) => {
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ n: r.int(0, FRAME), noun: r.pick(COUNTABLE_NOUNS), seed: r.uint() }),
      (v) => `a3:hunt:${String(v.n)}:${v.noun}`,
    );
    const { n, noun } = draw;
    const draft: ItemDraft = {
      type: 'reasoning',
      prompt: scenePrompt(
        `a five-frame holding ${countNoun(n, noun)}`,
        'Write how many. Then find that number nearby.',
      ),
      figure: frameFigure(n, noun, assertsAnswer),
      answer: {
        value: String(n),
        acceptableForms: [],
        validation: 'manual-review',
      },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      generator: { templateId: 'a_frame_read_v1', params: { n }, seed: draw.seed },
      hintLadder: hints('Numbers hide on doors and on dials.', 'Point at yours and say it out loud.'),
      errorTags: ['task-comprehension', 'representation-misread'],
      authorMeta: { stepCount: 1, cognitiveOp: 'hunt-the-numeral' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 9 — give a family warm-up the buttons it needs
// ===========================================================================

/**
 * Three cards for a warm-up that arrived with none (disclosure 2).
 *
 * The options ARE the whole range the wrapped generator can draw, which deletes
 * the dead option rather than diluting it: every card is keyed on some draw of
 * the slot and none can be struck out unread. The set being constant carries no
 * information — it is the same three numerals whatever the picture holds — while
 * the key's RANK moves with the drawn count, which is the opposite of the fixed
 * rank L43 is about.
 *
 * It also takes back an audit that would otherwise be lost. A `choice-key`
 * answer is not re-derived by QG-5, so the wrapper re-reads the item's own
 * `generator.params` and refuses to build if the picture and the key have parted
 * company. It takes no rng draw before `base` and leaves the prompt and figure
 * untouched, so the surface QG-1 signs is unchanged.
 */
function withThreeCounts(
  base: ItemGen,
  opts: {
    lo: number;
    hi: number;
    from: (params: Record<string, unknown>) => number;
    over: (k: number) => string;
    under: (k: number) => string;
  },
): ItemGen {
  if (opts.hi - opts.lo !== 2) {
    throw new Error(
      `A3 withThreeCounts: the cards ARE the drawn range, so it must hold three values (got ${String(opts.lo)}-${String(opts.hi)})`,
    );
  }
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error('A3 withThreeCounts: no generator params on this item, so its key cannot be re-checked');
    const n = opts.from(params);
    const stated = [draft.answer.value, ...draft.answer.acceptableForms];
    if (!Number.isInteger(n) || !stated.includes(String(n))) {
      throw new Error(
        `A3 withThreeCounts: ${draft.generator?.templateId ?? 'an item'} keyed "${draft.answer.value}" while its picture holds ${String(n)}`,
      );
    }
    if (n < opts.lo || n > opts.hi) {
      throw new Error(
        `A3 withThreeCounts: an answer of ${String(n)} fell outside ${String(opts.lo)}-${String(opts.hi)}, so a card would be unreachable`,
      );
    }
    const wrongs: Wrong[] = [];
    for (let v = opts.lo; v <= opts.hi; v++) {
      if (v === n) continue;
      wrongs.push(
        v > n
          ? { text: String(v), errorTag: 'representation-misread', rationale: opts.over(v - n) }
          : { text: String(v), errorTag: 'procedure-slip', rationale: opts.under(n - v) },
      );
    }
    const { choices, correctKey } = makeChoices(rng, String(n), wrongs);
    return {
      ...draft,
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
    };
  };
}

// ===========================================================================
// The week's forms, bound and given their own help
// ===========================================================================

// --- the four warm-ups ------------------------------------------------------

/** A1 — count a short row without losing your place. */
const warmCountRow = warmUp(
  withHints(
    withThreeCounts(countArrangement({ min: 3, max: 5, arrangement: 'in a row' }), {
      lo: 3,
      hi: 5,
      from: (p) => Number(p.n),
      over: (k) => `${k === 1 ? 'One' : 'Two'} too many: the finger came round a second time to ${k === 1 ? 'one thing' : 'two things'}.`,
      under: (k) => `${k === 1 ? 'One' : 'Two'} too few: ${k === 1 ? 'the last thing in the row was' : 'the last two things in the row were'} never reached.`,
    }),
    hints('Begin at the near end and say one.', 'Keep going until the row is done.'),
  ),
  1,
);

/** A2 — read a frame that is partly full. */
const warmFrameRead = warmUp(
  withHints(
    withThreeCounts(tenFrameRead({ min: 6, max: 8, size: 10 }), {
      lo: 6,
      hi: 8,
      from: (p) => Number(p.n),
      over: (k) => `${k === 1 ? 'One' : 'Two'} too many: ${k === 1 ? 'an empty box was' : 'two empty boxes were'} swept up with the full ones.`,
      under: (k) => `${k === 1 ? 'One' : 'Two'} too few: the second row was left before it had been finished.`,
    }),
    hints('The top row fills before the next one.', 'A full row is five. Carry on.'),
  ),
  2,
);

/**
 * A2 — the frame read for what is NOT in it, on the day the core extends it.
 *
 * It replaced a build warm-up ("draw 9 counters in this frame") that read badly
 * in a week about zero: the spoken scene for that item is literally "an empty
 * frame", and a child who has just been taught that an empty frame means none is
 * then asked to put nine things in one. This is the same question the day's core
 * item asks, on the ten-frame and in A2's own words, and it can never key zero —
 * which is exactly the step the core item takes (disclosure 5).
 */
const warmFrameGaps = warmUp(
  withHints(
    withThreeCounts(tenFrameEmpty({ min: 7, max: 9, size: 10 }), {
      lo: 1,
      hi: 3,
      from: (p) => Number(p.cap) - Number(p.filled),
      over: (k) => `${k === 1 ? 'One' : 'Two'} too many: ${k === 1 ? 'a box that already held something was' : 'two boxes that already held something were'} counted as bare.`,
      under: (k) => `${k === 1 ? 'One' : 'Two'} too few: ${k === 1 ? 'a bare box down in the second row was' : 'two bare boxes down in the second row were'} never reached.`,
    }),
    hints('Some boxes have been left standing empty.', 'Put a finger on each empty one, then count.'),
  ),
  2,
);

/** A2 — a jumble, where the order has to be the child's own. */
const warmCountHeap = warmUp(
  withHints(
    withThreeCounts(countArrangement({ min: 6, max: 8, arrangement: 'scattered' }), {
      lo: 6,
      hi: 8,
      from: (p) => Number(p.n),
      over: (k) => `${k === 1 ? 'One' : 'Two'} too many: with no row to follow, ${k === 1 ? 'one was met a second time' : 'two were met a second time'}.`,
      under: (k) => `${k === 1 ? 'One' : 'Two'} too few: ${k === 1 ? 'one at the edge of the jumble was' : 'two at the edge of the jumble were'} never reached.`,
    }),
    hints('A jumble has no start. Pick one.', 'Push each one away as soon as it is named.'),
  ),
  2,
);

// --- the core forms ---------------------------------------------------------

const meetTheFrame = withHints(
  countAndWrite({ tag: 'cwFrame', lo: 1, hi: FRAME, vessel: 'frame', ask: 'Which number should we write?' }),
  hints('Look in the boxes, not at the boxes.', 'One number for one thing, all the way across.'),
);
const meetZero = withHints(
  countAndWrite({ tag: 'cwFrame', lo: 0, hi: FRAME, vessel: 'frame', ask: 'Which number belongs to this frame?' }),
  hints('Some frames have nothing in them.', 'Nothing still has a number of its own.'),
);
const frameAgain = withHints(
  countAndWrite({ tag: 'cwFrame', lo: 0, hi: FRAME, vessel: 'frame', ask: 'Which number should we write?' }),
  hints('Point at each thing before you choose.', 'Stop at the end and keep that number.'),
);
const looseRow = withHints(
  countAndWrite({
    tag: 'cwLoose',
    lo: 1,
    hi: FRAME,
    vessel: 'loose',
    layout: 'row',
    where: 'a napkin',
    ask: 'Which number goes with this row?',
  }),
  hints('Start at one end and work across.', 'Nobody in the row goes without a number.'),
);
const fewOrNone = withHints(
  noneOrOne(),
  hints('An empty box is not a thing.', 'Count only what is sitting inside.'),
);
const fewOrNoneAgain = withHints(
  noneOrOne(),
  hints('Is anything in there at all?', 'None, one or two. Look closely.'),
);
const bareBoxes = withHints(
  emptyBoxes(),
  hints('Empty means no thing inside it.', 'Count those boxes and no others.'),
);
const puppetDay3 = withHints(
  puppetFrame(),
  hints('Count it yourself before you decide.', 'An empty box has nothing to count.'),
);
const puppetDay5 = withHints(
  puppetFrame(),
  hints('Go box by box along the frame.', 'Then choose the card that fits.'),
);
const storySaucer = numberStory('saucer');
const storyStool = numberStory('stool');
const storyTidy = numberStory('tidy');
const matchRows = withHints(
  matchTheNumeral(),
  hints('Count every row before you pick.', 'Two rows are not the one you want.'),
);
const writeIt = writeItYourself();
const hunt = numberHunt();

// --- the six mastery slots, in their own voice ------------------------------

const masteryFrame = withHints(
  countAndWrite({ tag: 'cwFrame', lo: 0, hi: FRAME, vessel: 'frame', ask: 'Which number should we write?' }),
  hints('Count what is inside the frame.', 'Then find that number on a card.'),
);
const masteryFew = withHints(
  noneOrOne(),
  hints('Nothing, one thing, or two things?', 'Look hard before you tap.'),
);
const masteryBare = withHints(
  emptyBoxes(),
  hints('The question asked about the empty boxes.', 'Say a number as you pass each empty box.'),
);
const masteryStory = withHints(
  numberStory('tidy'),
  hints('Hear the story, then look inside.', 'Count once, all the way, carefully.'),
);
const masteryMatch = withHints(
  matchTheNumeral(),
  hints('Take the rows one at a time.', 'Stop at the row that lands on it.'),
);
const masteryPuppet = withHints(
  puppetFrame(),
  hints('Do the counting for yourself first.', 'An empty box is easy to miss.'),
);

// ===========================================================================
// The week
// ===========================================================================

export const buildA03 = makeWeekBuilder({
  level: 'A',
  week: 3,
  conceptId: 'writing-numbers-0-5',
  conceptName: 'Writing numbers 0–5',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 1 },
    { level: 'A', week: 2 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'trace it, then write it',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. The number the child writes is made by hand on the scratch pad, never typed. Before the screen, trace each mark three ways with a finger: in the air, on an open palm, and through something rough like sand or a tea towel. The mark for none is the one that needs the most saying out loud, because nothing on the table looks like an answer. Mascot present.',
  },
  explanation: {
    hook: say(
      'A number is a word you say. A number is also a mark you write. Today we write the marks for none up to five. Watch my finger first. Then your finger has a go.',
    ),
    whyBeforeHow: say(
      'Every number has a mark of its own. We learn each mark the same way. We trace, because the hand needs a path. First we trace it, then write it. An empty frame has a mark too. That mark is zero. Zero says none, and none is still a number.',
    ),
    script: [
      {
        say: say('Here is a frame. I put three shells in it.'),
        visual: 'A five-frame with a shell in each of its first three boxes.',
        figure: tenFrame(3, {
          size: 5,
          icon: 'shell',
          alt: 'a five-frame with a shell in each of its first three boxes',
        }),
      },
      {
        say: say('I count them. One, two, three. Now I write three.'),
        visual: 'The same three shells, with a finger tracing the mark for three in the air above them.',
        figure: tenFrame(3, {
          size: 5,
          icon: 'shell',
          alt: 'the same three shells, counted from the left',
        }),
      },
      {
        say: say('Watch. I take every shell out again.'),
        visual: 'The same five-frame, emptied out, every box showing through.',
        figure: tenFrame(0, {
          size: 5,
          icon: 'shell',
          alt: 'the same five-frame with nothing sitting in any box',
        }),
      },
      {
        say: say('The frame is empty. Empty still has a number. We write zero for none.'),
        visual: 'The bare five-frame, with a finger tracing the round mark for zero beside it.',
        figure: tenFrame(0, {
          size: 5,
          icon: 'shell',
          alt: 'the bare five-frame, waiting for its number',
        }),
      },
    ],
    summary: say(
      'Count what is inside. Say the number. Then write it. An empty frame gets a number too. That number is zero.',
    ),
    vocabulary: [
      { term: 'zero', kidGloss: 'none at all, and it has its own mark' },
      { term: 'write', kidGloss: 'make the number mark with your own hand' },
      { term: 'trace', kidGloss: 'run your finger along a mark that is already there' },
      { term: 'five-frame', kidGloss: 'a strip of five boxes to put things in' },
      { term: 'empty', kidGloss: 'nothing is inside it' },
    ],
  },
  guidedExamples: [
    {
      ...ge(
        3,
        1,
        'modeled',
        scenePrompt('a five-frame holding 3 apples', 'Which number should we write?'),
        [
          {
            teacherSay: say('Watch me. I touch each apple and say a number.'),
            expected: 'one, two, three',
          },
          { teacherSay: say('My last number was three. So what do I write?') },
          { childDo: say('Draw the mark for three in the air.'), expected: '3' },
          { teacherSay: say('Three. One mark, and it belongs to three.') },
        ],
        '3',
      ),
      visual: 'A five-frame with an apple in each of its first three boxes.',
      figure: tenFrame(3, {
        size: 5,
        icon: 'apple',
        alt: 'a five-frame with an apple in each of its first three boxes',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(
        3,
        2,
        'completion',
        scenePrompt('a five-frame holding 0 shells', 'Which number should we write?'),
        [
          { teacherSay: say('I look in every box. Nothing is in there.') },
          { childDo: say('Tell me how many shells are inside.'), expected: 'none' },
          { teacherSay: say('None. And none has a mark. We write zero.') },
        ],
        '0',
      ),
      visual: 'The same frame, emptied out, every box showing through.',
      figure: tenFrame(0, {
        size: 5,
        icon: 'shell',
        alt: 'a five-frame with nothing sitting in any box',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(
        3,
        3,
        'prompted',
        scenePrompt('a five-frame holding 5 stars', 'Which number should we write?'),
        [
          { teacherSay: say('Nothing is missing here. Every box is taken.') },
          { childDo: say('Count them, then write the mark.'), expected: '5' },
        ],
        '5',
      ),
      visual: 'A five-frame with a star in every box.',
      figure: tenFrame(5, {
        size: 5,
        icon: 'star',
        alt: 'a five-frame with a star in every box',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(
        3,
        4,
        'independent',
        scenePrompt('a five-frame holding 2 buttons', 'Which number should we write?'),
        [{ childDo: say('Count on your own. Then write it.'), expected: '2' }],
        '2',
      ),
      visual: 'A five-frame with a button in each of its first two boxes.',
      figure: tenFrame(2, {
        size: 5,
        icon: 'dot',
        alt: 'a five-frame with a button in each of its first two boxes',
        asserts: assertsAnswer,
      }),
    },
  ],
  days: [
    // Day 1 — the frame, the count, the mark. Zero arrives on the second page
    // rather than being saved up: it is the week's content, not its twist.
    [
      { gen: warmCountRow, diff: 1 },
      { gen: meetTheFrame, diff: 2 },
      { gen: meetZero, diff: 2 },
      { gen: writeIt, diff: 2 },
    ],
    // Day 2 — the bottom of the number line, and the same work off the frame.
    [
      { gen: warmFrameRead, diff: 2 },
      { gen: fewOrNone, diff: 2 },
      { gen: looseRow, diff: 3 },
      { gen: frameAgain, diff: 3 },
    ],
    // Day 3 — the other route to zero, and the puppet who cannot take it.
    [
      { gen: warmFrameGaps, diff: 2 },
      { gen: bareBoxes, diff: 3 },
      { gen: puppetDay3, diff: 3 },
      { gen: fewOrNoneAgain, diff: 3 },
    ],
    // Day 4 — real-world single-step picture problems (the band-A form of G7).
    [
      { gen: warmCountHeap, diff: 2 },
      { gen: storySaucer, diff: 3 },
      { gen: storyStool, diff: 3 },
      { gen: storyTidy, diff: 3 },
    ],
    // Day 5 — match a number to a set, mend the puppet, then hunt a numeral
    // out in the room, which is the catalog's own non-computational focus.
    [
      { gen: matchRows, diff: 3 },
      { gen: puppetDay5, diff: 3 },
      { gen: hunt, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this week is about the MARK, not about counting — your child could already count to five, and now they meet the squiggle that stands for it. Two things help more than anything else on a screen. First, let the hand learn the path before the pencil does: trace each number big, in the air, on your palm, on a steamy window, in a tray of sand or flour. Say the number out loud every single time the finger moves. Backwards and mirrored numbers are completely normal at four and five and they sort themselves out with practice, so please do not correct them hard — just trace it again together the right way round. Second, zero. Zero is genuinely strange, and most children resist it: asked how many biscuits are on an empty plate, they will often say nothing at all rather than "none", because it does not feel like an answer. Put an empty plate on the table on purpose. Ask how many are on it. When they say "none", say "yes — and none has a number, and it is zero", and write it for them. Look for zero out in the world too: on the oven, the lift buttons, a door number, the microwave. Finding one in the wild is what makes it real.',
  ],
  /**
   * A MAKE, which is a move no page in this week makes: every day item ends in
   * a tap, and this one ends in a mark on the page. The child colours the boxes
   * with nothing in them and then writes how many that was — so the count is
   * produced rather than recognised, and the answer can be as low as one on a
   * nearly-full frame. `manual-review` is the sanctioned band-A puzzle form: it
   * is ungraded, it renders a single "I did it!" tap, and the number is what the
   * grown-up beside the child looks at. The figure asserts its own empty count,
   * so QG-13 proves the picture and the answer agree.
   */
  puzzle: (r) => {
    const filled = r.int(1, FRAME - 1);
    const noun = r.pick(COUNTABLE_NOUNS);
    return {
      id: 'A3-PZ-01',
      title: 'Puzzle Grove: Colour the Empty Boxes',
      puzzleType: 'math-art',
      prompt: [
        `[image: a five-frame holding ${countNoun(filled, noun)}]`,
        say('Colour every box with nothing in it. Then write how many you coloured.'),
      ].join(' '),
      figure: frameFigure(filled, noun, assertsAnswerOf('empty')),
      answer: {
        value: String(FRAME - filled),
        acceptableForms: [],
        validation: 'manual-review',
      },
      hintLadder: hints('Look for the boxes that are standing empty.', 'Colour those, then count your colours.'),
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'colour-then-write' },
  sprint: null,
  mastery: [
    { gen: masteryFrame, diff: 2 },
    { gen: masteryFew, diff: 2 },
    { gen: masteryBare, diff: 3 },
    { gen: masteryStory, diff: 3 },
    { gen: masteryMatch, diff: 3 },
    { gen: masteryPuppet, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh surfaces off a separate stream. Every slot is a tap with three authored cards, so no certifying page is left as a bare numeric for the display layer to invent buttons for. 01 and 04: count what is in a five-frame and choose its numeral, once cold and once inside a story, with none to five all live. 02: none, one or two, over a frame that holds one of the three - the substituted discrimination, and the one slot whose three cards never change. 03: how many boxes have nothing in them, which keys zero whenever the frame is full. 05: a number is named and one of three drawn rows shows it, with an empty row on the page half the time. 06: the puppet, who gives a bare box a number it should not have or slides past one because there is nothing in it to touch. NO COUNT IS EVER SPOKEN: the figure alt, which is read aloud first at this band, names the five-frame and the kind of thing that goes in it and no quantity at all, so a child who cannot read still has to look. THE ANSWER SITS AT NO FIXED RANK on the four numeral slots, and on the frame pages that is exact rather than approximate: the wrong-value pool carries the two frame-shaped misreadings as well as the four miscounts, a target rank is drawn uniformly, and a count that cannot reach its target steps to the nearest rank instead of cycling - which lands lowest, middle and highest on a third each. The two slots that are not level are named in the report with the structural reason: slot 02 is level by construction, and slot 06 cannot key the truth highest as often as lowest because a one-directional slip always puts the puppet\'s own number on the same side of it. Operand freshness is signed on the pair (count, kind) rather than on the count alone: six counts by nine drawable kinds is fifty-four surfaces per generator against at most five uses, so a slot cannot be pinned to one numeral the way a one-token guard pins it, and Form B never reprints Form A\'s pair.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'none-is-not-an-answer',
      description:
        'Treats an empty frame as a page with nothing to answer rather than as a page whose answer is zero, so the count begins anyway and comes back as one. It is not carelessness: at four and five a numeral feels like a label for a pile of things, and a bare table looks like the question has been taken away.',
      exampleWrongAnswer: '1 tapped for a five-frame with nothing in any box',
      distractorRationale:
        'Every frame page can draw an empty frame, and on those pages "1" is offered as the first counting word said before anything was touched. It is never a fixture and it is never a lure: on the far more common pages where the frame really does hold one, "1" is the keyed answer, so a child who strikes it out unread loses those pages instead of gaining these.',
      reteachPointer: 'explanation/script[3] (the emptied frame, and the mark that still belongs to it)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-the-frame-not-the-things',
      description:
        'Counts the boxes instead of what is sitting in them, or counts the bare boxes instead of the full ones. The frame is the loudest thing on the page and its five boxes are always there to be counted, whatever is inside.',
      exampleWrongAnswer: '5 tapped for a five-frame holding two shells',
      distractorRationale:
        'Offered on the frame pages as the whole-frame count and as the count of the gaps. Both are keyed on other draws - the whole frame whenever it is full, the gaps whenever the question asks for them - so neither numeral is ever a card that cannot be right, and eliminating either one still costs a child a count.',
      reteachPointer: 'guidedExamples/A3-GE-01 (touching each apple, never each box)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place',
      description:
        'Meets one thing twice, or passes one over, so the number comes back one or two off. On a scattered picture it is the commonest slip there is, because the child has to invent an order and then remember it.',
      exampleWrongAnswer: '4 tapped for a row of three, after the first was counted twice',
      distractorRationale:
        'Every counting page offers one or two of the four honest miscounts, and which pair is offered rotates so the true number lands lowest, middle and highest in turn. On the warm-ups the same slip appears as a count one or two away inside the three-card range the slot can actually draw.',
      reteachPointer: 'explanation/script[1] (counting the three shells from the left, one at a time)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-louder-quantity',
      description:
        'Answers the count the picture makes obvious rather than the one the question named - gives what is in the frame when asked for the bare boxes, or the other way round. Both numbers really are on the page, and only listening tells them apart.',
      exampleWrongAnswer: 'asked how many boxes are bare, taps the number of shells',
      distractorRationale:
        'The bare-boxes pages offer the full count as a card on every draw, and the puppet asks about each quantity in turn, so a child who answers the question he expected rather than the one he heard lands on a card that is offered and is not keyed. The numeral itself is keyed constantly on other draws, so nothing can be struck out on sight.',
      reteachPointer: 'Day-3 empty-box pages: repeat the question aloud before a box is touched',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Writing the numerals 0 to 5 - going from a picture, to the number said out loud, to the mark made by hand. Most of the week is about zero, which is genuinely new: your child could already count, and now meets the idea that "none" is a number with a mark of its own rather than an empty answer.',
    improvingCandidates: [
      'counting what is inside a frame rather than counting its boxes',
      'writing 0 for a frame with nothing in it, instead of leaving it blank',
      'telling an empty frame apart from a frame holding one',
      'hearing which quantity a question asked for before starting to count',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'letting none be an answer - we will keep putting an empty plate on the table and asking, because saying it out loud is what makes it stick',
      },
      {
        errorTag: 'representation-misread',
        text: 'looking inside the boxes rather than at them, so the frame stops being the thing that gets counted',
      },
      {
        errorTag: 'task-comprehension',
        text: 'listening to the end of the question, since two different numbers are usually sitting in the same picture',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the bare boxes and wrote 0 for them, instead of leaving the page blank.',
      questionForChild: 'How many biscuits are on this empty plate - and can you write it for me?',
      schoolSyncHook: 'Tell us what your child likes lining up at nursery and the pictures will use it.',
    },
    vocabularyForParent: [
      'zero (none at all, and it has a mark of its own)',
      'numeral (the shape on the page, as against the word in the air)',
      'five-frame (a strip of five boxes, so a count can be seen at a glance)',
      'trace (running a finger along a mark before writing it)',
    ],
  },
});
