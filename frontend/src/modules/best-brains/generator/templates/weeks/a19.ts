/**
 * Level A · Week 19 — "Length & height" (conceptId: length-and-height).
 *
 * FILL-ARCHITECTURE §3 row A19: anchor "line up at a common start"; core forms
 * longer/shorter/taller choice; perceptual discrimination **the staggered-baseline
 * trap**; puppet error-analysis "compares without aligning ends"; Day-5 "order
 * three objects (figure, R)". Catalog row: direct comparison and measuring with
 * nonstandard units (cubes), with "order three objects by size — how do you
 * know?" as the non-computational focus.
 *
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 *
 *  - **TWO THINGS ARE ONLY COMPARABLE ONCE THEY BEGIN TOGETHER.** A child of
 *    four settles "which is longer?" by looking at the right-hand ends, and that
 *    rule is correct exactly half the time — which is why it survives so long
 *    and why nothing but a page built to punish it will remove it. So the trap
 *    is not a garnish on this week, it IS the week: five of the fourteen core
 *    pages and two of the six mastery slots lay their objects down at DIFFERENT
 *    starting places, and where the keyed object sits along the line is dealt
 *    per pack rather than drawn, so "take the one that pokes out furthest" is
 *    worth a third of a three-way page in EVERY pack and never more — measured
 *    33.3% over 500 packs, with exactly two of a pack's six such pages rewarding
 *    it in 400 packs out of 400.
 *  - **AND THE ENDS ARE NOT A LIE — THEY ARE A CONCLUSION.** Once everything
 *    begins at one mark, the thing reaching furthest really is the longest, and
 *    a week that only ever punished end-reading would teach the mirror
 *    falsehood. So the aligned page runs beside it all week — three objects from
 *    one mark on Days 1 and 5, and the family's own two-object page on Day 2 —
 *    and there the far end is right every time. What a child has to learn is
 *    which of the two pictures is in front of them.
 *  - **A LENGTH DOES NOT CHANGE WHEN A THING IS MOVED, AND THE PACK ENFORCES
 *    IT.** Every named object carries ONE length for the whole pack, registered
 *    the first time it is drawn and read back everywhere after. Only the
 *    STARTING PLACES move from page to page. So the invariance the week is
 *    teaching is a property of the generated pack rather than a sentence in the
 *    lesson: the brown lace that beat the white lace on Monday beats it on
 *    Friday, from whatever mark either of them happens to begin at.
 *  - **A MEASUREMENT IS A COUNT OF IDENTICAL THINGS.** The second strand lays
 *    cubes along a thing and counts them, which is what makes a comparison
 *    arguable instead of a staring contest. Six of the nineteen day pages and
 *    three of the six mastery slots are that count, because producing a
 *    measurement is the week's own computational skill and the catalog names it.
 *  - **Nothing here can be answered off the sentence alone on the pages that
 *    matter.** Band A spends its multi-step quota on `pictorialPerDay: 1`, and
 *    every non-retrieval page on Days 1–4 draws its picture out of the very
 *    numbers its own answer is computed from.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Five pages in nineteen face backwards** — one a day, each from a
 *    different earlier week in a different format, and each one something a
 *    measurement stops working without: counting a straight line of identical
 *    things (A1), finding the group a stated numeral names (A2), matching two
 *    rows one for one (A5), ranking three groups (A6), and naming a flat shape
 *    (A7) — which is settled by counting its corners rather than by how it
 *    looks, the same substitution this week makes when it stops reading ends and
 *    starts counting cubes.
 *
 * ── TWELVE DISCLOSURES ──────────────────────────────────────────────────────
 *
 * 1. **NO PRIMITIVE DRAWS A STAGGERED BASELINE, SO ONE IS BUILT OUT OF AN EMPTY
 *    LEADING SEGMENT — and that is the single most load-bearing decision in the
 *    file.** Everything in `figures.ts` starts its rows at one left edge:
 *    `CountersFig`'s compare branch puts every row at `cx = gutter + …`, and
 *    `BarModelFig` walks each bar's segments from `barX0`. `spread` widens a
 *    row's GAPS (A5's conservation trap) and moves nobody's beginning. So the
 *    recipe's own discrimination is, taken literally, undrawable.
 *
 *    What it is built from instead: a bar whose FIRST segment is the empty table
 *    in front of the object (`fill: 'none'`, which `BarModelFig.paint` renders
 *    as an unfilled outline) and whose second segment is the object itself
 *    (filled, hatched or soft). A zero-length gap draws nothing at all
 *    (`sg.w < 0.3` returns null), so an object that begins at the mark is drawn
 *    exactly as it would have been anyway and the aligned and staggered pages
 *    are the same picture with one number changed. Filled against unfilled is
 *    the distinction a colour-blind child keeps, which is why the gap is not
 *    merely a paler version of the object.
 *
 *    What is asserted, and what is not: the figure asserts the FIRST ROW'S
 *    RIGHT-HAND END (`asserts: param:endFirst` over `bar:0`, which sums a bar's
 *    segments), never a length. That is the quantity the misconception reads, so
 *    QG-13 proves the picture really does put the end where the item claims —
 *    the trap is drawn honestly or the seed sweep fails. **Recorded for the
 *    orchestrator:** a `start` (or `offset`) field on `BarModelParams.bars`, and
 *    a `length:k` selector beside `bar:k` in `figures/assert.ts`, would let this
 *    week say what it means instead of spelling it with an empty segment.
 *
 * 2. **HEIGHT IS MEASURED AND NEVER COMPARED, BECAUSE A COMPARED HEIGHT CANNOT
 *    BE DRAWN STANDING UP.** The concept is "Length & height" and the recipe's
 *    core forms include a taller-choice. A tower of cubes IS drawable —
 *    `arrangementFor` maps "in a tower" to the `stack` layout and a single group
 *    of n stacks into one column — so "how many cubes tall is the candle?" ships
 *    and certifies. TWO towers do not: the non-compare branch of `CountersFig`
 *    lays each group box out at `by = top + (bandH − b.h) / 2`, so a short tower
 *    is CENTRED against a tall one and the two float rather than standing on a
 *    floor. A page asking which is taller beside that picture would be a word
 *    disagreeing with its drawing, which is the L27 class exactly.
 *
 *    An `area-grid` with `shadedCells` can fake two towers on squared paper, and
 *    it was rejected on two counts rather than on taste: it draws empty cells
 *    above every short tower, so the picture offers a second countable quantity
 *    that is not the height; and `figureValue` returns null for a grid shaded
 *    only by `shadedCells`, so QG-13 could not pin it. The tower slot therefore
 *    keys 2–6 cubes (the `stack` layout wraps into a second column at seven, and
 *    a two-column tower is not a tower). Taller and tallest are taught in the
 *    script, glossed in the vocabulary, asked for in the Day-5 telling and named
 *    in the grown-ups' strip, where a real object stood against a wall does the
 *    work no primitive can. **Recorded for the orchestrator:** a `baseline:
 *    'floor'` option on the counters group layout would unlock A19's height
 *    comparison and B23's bar-chart reading at the same time.
 *
 * 3. **REMOVING ONE BLIND HABIT INSTALLED ANOTHER, AND ONLY MEASURING FOUND IT.**
 *    The first build set the right-hand ends a cube or two apart and dealt where
 *    the keyed object's end landed, which put the misconception at a flat third
 *    exactly as intended. It also handed the page away by the other side: a long
 *    thing needs a lot of line, so a long thing made to FINISH early must have
 *    STARTED early. Over 500 packs, "take whichever begins furthest to the left"
 *    scored **81.3%** on the three-way staggered pages, 85.0% on the pair and
 *    95.8% on the puppet's — a page a child scores without measuring anything,
 *    sitting inside the very week that exists to stop exactly that.
 *
 *    It is not repairable by dealing, and that is the interesting part. Solving
 *    for a flat third on BOTH margins at once — over the six start-place /
 *    end-place cells the geometry allows — has a unique answer, and the answer is
 *    that the keyed object must occupy the same place in both orders. So
 *    `layAlongLine` now runs the beginnings and the endings in ONE order: every
 *    object starts to the right of the one before it and finishes to the right of
 *    it too. Which begins first, which ends first, which sits furthest right,
 *    which is in the middle — every ordinal on the page now names the same object
 *    as every other, so none of them can name the answer more often than chance,
 *    and the only thing left that separates the three is how much line each one
 *    covers. Measured over 500 packs: every one of those habits lands between
 *    30.8% and 35.8% against a 33.3% floor.
 *
 *    On top of that the keyed object's PLACE in that single order is rotated once
 *    per pack, so "the one that pokes out furthest" is right on exactly two of a
 *    pack's six three-way staggered pages — 400 packs out of 400, not a third on
 *    average, which is the distinction a20's disclosure 10 paid for. One rotation
 *    serves both polarities: asked for the longest the habit is the rightmost
 *    place, asked for the shortest it is the leftmost, and a flat rotation leaves
 *    both at a third.
 *
 *    Two mechanical notes, each of which cost a measurement. The rotation is
 *    taken ONCE PER ITEM, before `drawUniqueItem` may retry, because a retry
 *    re-enters the generator and a schedule consumed inside the loop spends the
 *    next page's slot on a redraw (a20's finding, inherited). And the pages carry
 *    their rotation turn in `generator.params`: without it, `makeWeekBuilder`'s
 *    Form-B core-collision check occasionally rebuilt a mastery item, the rebuild
 *    spent a turn, and one pack in four hundred came out with three of its six
 *    staggered pages rewarding the misconception instead of two.
 *
 * 4. **THE PUPPET IS EXEMPT FROM THAT ROTATION, AND HE HAS TO BE.** Error
 *    analysis requires him to be mistaken, so on his page the object poking out
 *    furthest is never the answer. Read alone that page teaches "the one that
 *    sticks out is never right", which is as false as the belief the week
 *    attacks. Two things hold it: his page is one of the eight comparison pages
 *    a child meets, and it is barred from both mastery forms; and the same habit
 *    is measured separately on every other page, where it is at or near that
 *    page's own chance floor. The report carries both numbers, split by page
 *    type, because the aggregate over a week that contains an error-analysis
 *    page is not a number anybody should read.
 *
 * 5. **THE PUPPET'S PICK IS READ OFF THE DRAWING BY CODE; THE TRUTH IS READ OFF
 *    THE REGISTRY.** Row A19's slip — "compares without aligning ends" — has an
 *    OBJECT for its output, not a value, and every `{correct, wrong}` transform
 *    registered at this band returns a pair of numbers
 *    (`a_verify_count_slip_v1` gives `{n, n ± 1}`, `a_verify_countback_slip_v1`
 *    a difference and its off-by-one, `a_verify_teen_write_v1` a digit
 *    reversal). Forcing one of them to emit two object names would mean
 *    inventing operands with no referent on the page, which is the §E2.12
 *    fabrication-with-extra-steps class.
 *
 *    Nothing is invented either way. The puppet names the row whose end sits
 *    furthest along — computed from the same `end` values the picture is drawn
 *    from — and the truth beside it is recomputed by the registered
 *    `a_pick_extreme_v1`, which re-finds the greatest length independently of
 *    anything this file believes; QG-11 checks the keyed card against it at
 *    every seed. What is given up is the D8 half of that audit (there is no
 *    misconception VALUE for the prompt to show); what is bought is the recipe's
 *    own slip on the page instead of a borrowed counting one.
 *
 * 6. **`compareMeasure({attr:'length'})` IS USED, ONCE, AND IT IS THE ALIGNED
 *    HALF OF THE WEEK'S ARGUMENT.** `meta/HANDOFF-2026-08-10-LEVEL-A.md` §5
 *    clears it: it compares through a common unit, which is honest, and its bar
 *    model draws both bars from one edge with `scaleMax: max(a, b)`. That is the
 *    picture this week wants for "we measured both, so now we can argue" — and
 *    it is the one form where both measurements are SPOKEN, which matters for
 *    disclosure 9. Its own draw defect is already repaired upstream (it now
 *    swaps which thing gets the larger count on half of draws, so the answer is
 *    no longer the first thing named on three draws in four); measured here at
 *    the served rates in the report.
 *
 *    Its unit is steps and this week's is cubes, deliberately kept apart rather
 *    than smoothed: a step and a cube are both nonstandard units and the point
 *    of the strand is that ANY repeated thing measures, provided every one of
 *    them matches. Its ladder is replaced with this week's, because a library
 *    ladder shipped into a core slot is the same sentence in every A week that
 *    ever calls it. Its scene pool never names a thing after the attribute it
 *    asks about, and neither does anything here — see disclosure 8.
 *
 * 7. **THREE CARDS ON EVERY CERTIFYING SLOT, AND THE CARD VALUES ARE COMPUTED
 *    FROM THE SLOT'S OWN KEY SET (L53, L38).** A pre-reader cannot type, and a
 *    choice-less numeric band-A page is handed to `tapOptionsFor`, which invents
 *    four buttons from the answer alone. So all six mastery slots and every core
 *    page carry authored cards. On the three numeric slots the two wrong cards
 *    are the slot's own honest miscounts (one or two cubes over, one or two
 *    under), and **the shape of the pair is dealt before the count is drawn**,
 *    not after: the rotation picks "both cards below the answer", "one either
 *    side" or "both above", and the count is then drawn from the values that
 *    shape can serve. So the answer sits lowest, middle and highest in turn —
 *    each exactly a third of the time in every pack — and no card is ever a
 *    value the slot cannot key. The price is that the COUNT is no longer
 *    uniform: the middle of each range is served more often than its ends, and
 *    both distributions are in the report. Rank was chosen over flatness because
 *    "tap the biggest number" is a strategy and "the answer is often six" is not.
 *
 * 8. **NO OBJECT IN THIS FILE IS NAMED AFTER THE ATTRIBUTE IT IS ASKED ABOUT.**
 *    `lib/earlynumber.ts` records why: a pool holding "long stick" and "short
 *    stick" beside "which one is longer?" is scored without measuring on the
 *    draws where the long one wins, and contradicts itself on the rest. Every
 *    comparable thing here is separated by COLOUR or by pattern (red straw
 *    against blue straw, spotty tape against plain tape), which is orthogonal to
 *    length; the things measured with cubes are stationery and toys whose length
 *    nobody has an opinion about, so any count is honest. Note what that costs
 *    and why it is paid anyway: a pre-reader cannot read "the red straw" on a
 *    button either, which is the general band-A condition a07 measured — a
 *    choice button is never voiced. The colour words are therefore spoken in the
 *    script, printed in the picture's row labels beside each row, and named in
 *    the strip for the grown-up who is sitting there.
 *
 * 9. **THE COMPARISON PAGES CANNOT BE ANSWERED BY EAR, AND THAT IS WHAT A
 *    PERCEPTUAL COMPARISON IS.** At band A the figure's accessible name beats
 *    the authored bracket (`speakablePrompt`) and is autoplayed BEFORE the
 *    question. On a staggered page the two facts a listener would need are
 *    exactly the two facts the item is testing: which is longer (the answer) and
 *    where each one begins (the whole trap). So the alt names the objects in the
 *    order the picture draws them and stops there.
 *
 *    Counted rather than waved at: of the nineteen day pages, TWELVE are fully
 *    answerable from the audio — the five warm-ups, the six cube-measuring pages
 *    (four measurements and two stories), and the family's paired comparison,
 *    whose spoken scene carries both measurements. SEVEN are not: the three
 *    staggered comparisons, the two aligned trios, the puppet and Friday's sort,
 *    though that last is adult-mediated by construction and R-flagged anyway. So
 *    the computational half of the week — producing a measurement, which is what
 *    the catalog row names — is entirely open to a child who cannot see, and the
 *    perceptual half is not. The repair is a renderer that can describe an
 *    offset, not a better sentence, which is why disclosure 1 records the missing
 *    primitive rather than smoothing over the gap.
 *
 * 10. **NO DIGIT AND NO NUMBER WORD IN ANY ACCESSIBLE NAME, PROVEN RATHER THAN
 *    INTENDED (L48).** The rule that matters is the conditional one: no number
 *    an alt speaks may equal that item's key. Here the cheapest way to satisfy
 *    it is also the right one, because on this week's numeric slots the number
 *    the alt would want to say — how many cubes — IS the answer, and on the
 *    comparison slots any spoken length settles the comparison outright. So
 *    `alt()` throws at module load on a digit or on any of zero–twenty, the tens
 *    names, hundred, and the numbers that travel in disguise (once, twice,
 *    single, double, twin, pair, couple, dozen, half, both); and `spokenSafe`
 *    re-checks every figure that actually reaches a child at draw time,
 *    including all five library warm-ups and the library comparison, because
 *    those alts are assembled where this file cannot see them at load time. The
 *    scan is in the report. The `[image: …]` brackets keep their numbers: they
 *    are never shown (`promptText` strips them) and never spoken (the figure's
 *    own name wins), and they are what QG-1 and QG-4 sign to keep operand
 *    surfaces fresh.
 *
 * 11. **SIX LOCAL GENERATORS, EACH NAMING THE FAMILY GAP IT FILLS.**
 *    `cubeCount` — `compareMeasure` always compares two things, and the family
 *    has no generator that measures ONE thing against a unit, which is the act
 *    the comparing is built out of. `alongTheLine` — nothing in the family lays
 *    anything down at an offset (disclosure 1), and `pickExtreme` ranks drawn
 *    SETS by their own size rather than three objects by a measurement taken of
 *    them. `puppetTrustsTheEnds` — `PuppetSlip` is a closed union of
 *    double-count, skip-count, count-back-start and teen-writing, with no
 *    comparison slip in it. `cubeStory` (one instance laying cubes along a flat
 *    thing, one building a stack up to a standing one) — the family's word
 *    problems join and take away, and this week has taught neither.
 *    `orderThree` — `sortAndTell`
 *    sorts groups by their own count, a different act from ordering objects by a
 *    measurement. Each keeps the family's contract: a registered templateId, a
 *    picture built by `lib/figures` from the item's own values, every quantity
 *    through `lib/format`, and an `authorMeta` stamp.
 *
 * 12. **WHAT THE PUZZLE ADDS THAT NO DAY DOES.** Every page in the week picks an
 *    extreme — the longest, the shortest, the count. The puzzle asks for a
 *    MATCH: four cards laid from one start line and cube-divided, exactly two of
 *    them the same length, and the child must compare every pair rather than
 *    scan for a winner. So the new move is a search over pairs, and the payoff
 *    is the idea the week has been circling — that measuring settles sameness as
 *    well as difference. `Puzzle` carries no `choices` field, so its answer is
 *    typed rather than tapped; that is a schema limit and it is recorded here
 *    rather than worked around. Its figure asserts the twin's own bar, so the
 *    picture and the answer are proved to agree.
 */

import type { ErrorTag } from '../../../types';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';
import { drawFresh, makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareMeasure,
  compareSets,
  howManyChoice,
  pickExtreme,
  setForNumeral,
  shapeName,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswerOf, assertsParam, barModel, counters } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn per page; no line below writes one of these in by hand (kit §F.3). */
const NAMES = ['Juno', 'Rowan', 'Ezra', 'Mira', 'Tobi', 'Halla', 'Nadia', 'Casper'] as const;

/**
 * A different child on every page that names one.
 *
 * A plain `r.pick` put Casper on both of Day 4's stories in a pack read end to
 * end, which reads as one story told twice — and no gate can see it, because a
 * name is not an operand and never enters a surface signature. One draw picks
 * the starting point and the pool is then walked by index, so the correction
 * costs no extra draws and stays seed-stable (kit §E2.4).
 */
function someone(r: Rng, guard: TupleGuard): string {
  const from = NAMES.indexOf(r.pick(NAMES));
  for (let k = 0; k < NAMES.length; k++) {
    const name = NAMES[(from + k) % NAMES.length];
    if (!guard.taken(`a19:who|${name}`)) {
      guard.add(`a19:who|${name}`);
      return name;
    }
  }
  return NAMES[from];
}

// ---------------------------------------------------------------------------
// The sentence law, counted the way the GATE counts it
//
// Two ceilings exist and they measure different things. `earlynumber`'s `ask()`
// weighs a whole prompt string at once, so a two-sentence puppet page trips a
// limit it never really breaks, and nothing anywhere caps a hint rung or a step
// in a worked example. `bb-readability-test` walks one SENTENCE at a time over
// every surface a child hears, and that is the measurement a build fails on. Its
// splitter and its counter are mirrored here and every authored line is pushed
// through them, so an eleventh word throws at module load or at draw time rather
// than surviving to a reviewer.
//
// A picture's accessible name is not capped here. It is the whole of what a
// child who cannot see the drawing has instead of it, and buying brevity by
// describing less is the wrong trade; it carries two stricter rules of its own
// below (disclosure 10).
// ---------------------------------------------------------------------------

const WORD_CEILING = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > WORD_CEILING) {
      throw new Error(`A19: a band-A sentence runs to ${String(n)} words (ceiling ${String(WORD_CEILING)}): "${sentence}"`);
    }
  }
  return text;
}

/** `[image: scene] question` — the bracket feeds the freshness guard; the question is spoken. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Help rungs, measured. Nothing here names a child, a colour or a quantity. */
function rungs(...steps: string[]): string[] {
  return steps.map(say);
}

// ===========================================================================
// WHAT A PICTURE IS CALLED (disclosure 10)
// ===========================================================================

/**
 * Numbers that travel without a digit — including the ones in disguise, because
 * a pre-reader hears no difference between "twice" and "two".
 */
const SPOKEN_VALUE: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
  once: 1, single: 1, twice: 2, double: 2, twin: 2, pair: 2, couple: 2, both: 2, dozen: 12,
};

const SPOKEN_WORD = new RegExp(`\\b(${Object.keys(SPOKEN_VALUE).join('|')})\\b`, 'gi');

/** Every number a string SAYS, digits and words alike. */
function numbersSpoken(text: string): number[] {
  const out = (text.match(/\d+/g) ?? []).map(Number);
  for (const hit of text.matchAll(SPOKEN_WORD)) out.push(SPOKEN_VALUE[hit[1].toLowerCase()]);
  return out;
}

/**
 * A name for a picture that this file wrote, held to the ABSOLUTE rule.
 *
 * The rule that binds is the conditional one — no number an alt speaks may equal
 * that item's key — and `spokenSafe` below enforces exactly that. This stricter
 * gate applies to the strings authored here because for every one of them the
 * absolute rule is also the right one: on the measuring pages the number the alt
 * would want to say (how many cubes) IS the answer, and on the comparison pages
 * any spoken length settles the comparison outright. There is nothing left that
 * a number could honestly buy a child who cannot see the drawing, so using none
 * is the cheapest way to be safe rather than a cost (FILL-AGENT-BRIEF §2a).
 */
function alt(text: string): string {
  if (/\d/.test(text)) {
    throw new Error(`A19 alt: a digit is played ahead of the question in "${text}"`);
  }
  const spoken = numbersSpoken(text);
  if (spoken.length > 0) {
    throw new Error(`A19 alt: the number ${String(spoken[0])} is played ahead of the question in "${text}"`);
  }
  return text;
}

/** Every value the item would accept as correct — the key set of one draw. */
function keyValues(draft: ItemDraft): number[] {
  const keyed = draft.choices?.find((c) => c.isCorrect)?.text;
  const surfaces = [
    ...(keyed === undefined ? [draft.answer.value] : [keyed]),
    ...(draft.answer.acceptableForms ?? []),
  ];
  return surfaces.flatMap(numbersSpoken);
}

/**
 * THE RULE AS IT IS ACTUALLY STATED, checked where an alt ARRIVES rather than
 * where it was written (disclosure 10).
 *
 * The load-time guard above covers this file's own strings. This is the other
 * half, and it is the half that has to be conditional: six of the twelve
 * generators a pack serves are assembled inside `lib/`, where this file cannot
 * see them, and one of them legitimately says a number word. `compareMeasure`'s
 * accessible name reads "the green string beside the yellow string, both
 * measured in steps" — "both" is a two to a tokenizer, and that page keys an
 * OBJECT NAME, so no draw of it can ever have two for an answer. Banning the
 * word outright would strip the one fact a child who cannot see the picture
 * needs — that the same unit measured them both — for no gain at all, which is
 * precisely the trade FILL-AGENT-BRIEF §2a records as having been made once and
 * reverted.
 *
 * So this computes the item's OWN key set on every draw and refuses only an
 * overlap. It throws rather than warning, so the rule is an invariant of the
 * week instead of an intention of its author.
 */
function spokenSafe(base: ItemGen, who: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (draft.figure) {
      const keys = new Set(keyValues(draft));
      const clash = numbersSpoken(draft.figure.alt).find((v) => keys.has(v));
      if (clash !== undefined) {
        throw new Error(
          `A19 spokenSafe(${who}): the picture's name says ${String(clash)}, which is this draw's own answer: "${draft.figure.alt}"`,
        );
      }
    }
    return draft;
  };
}

/**
 * Give a generator help written for THIS week without reaching into `lib/`.
 *
 * A ladder may appear at most twice across the fourteen non-retrieval core
 * pages, which puts a floor of seven distinct ladders under the week and made
 * the ladder count a design input rather than an afterthought (kit §E, A-band
 * lesson 1); ten are shipped. The arithmetic is only half of it. The help
 * genuinely wants to differ — a row of cubes wants "one touch, one name", a
 * staggered pair wants "look away from the ends", a tower wants "start at the
 * bottom" — and none of that could be said in the shared family without saying
 * it in all twenty-four A weeks at once.
 *
 * The closure rewrites one field of an already-built draft and draws no rng, so
 * the prompt QG-1 and QG-4 sign for freshness is untouched.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Bring an earlier week's own page back, flagged as today's warm-up.
 *
 * Band A sets no minimum on warm-up formats, so nothing obliges these to exist
 * and each has to earn its minute. What decided the five is what a measurement
 * actually stands on. Counting a straight line of identical things (A1) is
 * literally what counting cubes along a comb is. Finding the group a numeral
 * names (A2) is the same link run the other way, and it is the one this week
 * asks for when it says "how many cubes long". Matching two rows one for one
 * (A5) is direct comparison a fortnight early, on counts instead of lengths.
 * Ranking three groups (A6) is Friday's sort with the objects swapped for
 * sets. And naming a flat shape (A7) is the same substitution this week makes:
 * what a shape is called is settled by counting its corners rather than by how
 * it looks, exactly as what a thing measures is settled by counting cubes rather
 * than by which end pokes out.
 *
 * Their help arrives untouched from the week that wrote it, on purpose. A
 * warm-up is supposed to sound like where it came from, and re-voicing it into
 * this week's register would quietly remove what makes it retrieval.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The things this week lays down, and the pack registry that fixes how long
// each of them is
// ===========================================================================

/**
 * Objects that get COMPARED, separated by colour or pattern and never by size
 * (disclosure 8). Five families of three: a page takes one family, so every
 * comparison is between things a child has no prior opinion about, and the
 * picture is the only evidence there is.
 *
 * None of these appears in `compareMeasure`'s own length pool (red/blue ribbon,
 * green/yellow string, brown/grey stick), so the library page a pack also serves
 * never collides with one of these.
 */
const FAMILIES: ReadonlyArray<readonly [string, string, string]> = [
  ['red straw', 'blue straw', 'green straw'],
  ['brown lace', 'white lace', 'black lace'],
  ['pink strip', 'yellow strip', 'purple strip'],
  ['gold cord', 'silver cord', 'grey cord'],
  ['spotty tape', 'stripy tape', 'plain tape'],
];

/**
 * The length triples a family may be dealt, every one of them spread so no two
 * members are within a cube of each other.
 *
 * A one-cube difference is about eight per cent of the drawing's width, which is
 * a difference a four-year-old cannot see and should not be asked to; the item
 * would then be measuring eyesight. Two cubes is roughly fifty pixels at the
 * shipped figure width and is unmistakable, so every comparison this week poses
 * is one a child who lines the beginnings up can actually settle.
 */
const LENGTH_SETS: ReadonlyArray<readonly [number, number, number]> = [
  [2, 4, 6], [3, 5, 7], [4, 6, 8], [5, 7, 9], [2, 4, 7], [3, 5, 8], [4, 6, 9], [2, 5, 7],
];

/** True once per pack for a given key — the "has this been set up yet?" test. */
function firstTime(guard: TupleGuard, key: string): boolean {
  if (guard.taken(key)) return false;
  guard.add(key);
  return true;
}

/**
 * ONE LENGTH PER NAMED THING, FOR THE WHOLE PACK — the week's own claim, made
 * into a property of the generated pack.
 *
 * Drawing each page's lengths independently would let the brown lace beat the
 * white lace on Tuesday and lose to it on Thursday. Every page would be
 * internally honest and the week would still be teaching the opposite of what it
 * says, because the one thing a length is supposed to survive is being moved. So
 * a family's three lengths are dealt the first time any page uses it and read
 * back everywhere after; only the STARTING PLACES move.
 *
 * The registry is keyed on the pack's own `TupleGuard`, which is the one object
 * every generator in a pack shares. Reading a stored value is a probe rather
 * than a fetch, so it consumes no rng and nothing about draw order changes what
 * a later page shows.
 */
function familyLengths(r: Rng, guard: TupleGuard, family: readonly string[]): number[] {
  if (firstTime(guard, `a19:fam:${family[0]}`)) {
    // NO TWO FAMILIES GET THE SAME TRIPLE. Two families dealt the same three
    // lengths print the same three numbers, and `drawUniqueItem` signs a prompt
    // on its numeric tokens with the order thrown away - so a pack could run out
    // of distinct surfaces for the aligned pages, which is a redraw loop
    // exhausting rather than a page repeating (measured: seed 81 before this).
    // Taking the sets without replacement removes the cause instead of raising
    // the retry count.
    const free = LENGTH_SETS.map((set, i) => ({ set, i })).filter((e) => !guard.taken(`a19:set:${String(e.i)}`));
    const taken = free.length > 0 ? r.pick(free) : { set: r.pick(LENGTH_SETS), i: -1 };
    if (taken.i >= 0) guard.add(`a19:set:${String(taken.i)}`);
    const dealt = r.shuffle([...taken.set]);
    family.forEach((name, i) => guard.add(`a19:len:${name}=${String(dealt[i])}`));
  }
  return family.map((name) => {
    for (let v = 2; v <= 10; v++) if (guard.taken(`a19:len:${name}=${String(v)}`)) return v;
    throw new Error(`A19: no length registered for "${name}"`);
  });
}

/**
 * WHERE THE KEYED OBJECT SITS ALONG THE LINE, DEALT ONCE PER PACK
 * (disclosure 3).
 *
 * Returns 0, 1 or 2 in a per-pack rotation: 0 puts the keyed object leftmost —
 * first to begin and first to finish, since `layAlongLine` runs the beginnings
 * and the endings in one order — and 2 puts it rightmost. One rotation is enough
 * for both polarities of the question: asked for the longest, the habit under
 * test is "take the one that pokes out furthest", which is place 2; asked for
 * the shortest it is "take the one that stops soonest", which is place 0. A flat
 * rotation therefore leaves BOTH at exactly a third, and leaves "begins furthest
 * left", "sits furthest right" and every other ordinal there too.
 *
 * Six three-way staggered pages reach a pack, so each place is served exactly
 * twice in every pack rather than a third of the time on average. A turn counter
 * rather than a free list, so a seventh call wraps to the first place instead of
 * degrading into whatever is left.
 */
function nextEndPlace(r: Rng, guard: TupleGuard): { place: number; turn: number } {
  if (firstTime(guard, 'a19:endsched')) {
    r.shuffle([0, 1, 2]).forEach((v, i) => guard.add(`a19:endorder:${String(i)}=${String(v)}`));
  }
  for (let turn = 0; ; turn++) {
    if (guard.taken(`a19:endturn:${String(turn)}`)) continue;
    guard.add(`a19:endturn:${String(turn)}`);
    const slot = turn % 3;
    for (let v = 0; v <= 2; v++) {
      if (guard.taken(`a19:endorder:${String(slot)}=${String(v)}`)) return { place: v, turn };
    }
    return { place: slot, turn };
  }
}

/**
 * THE ROTATION IS ONLY FOR THE THREE-WAY PAGES, AND KEEPING THE OTHERS OUT OF IT
 * IS NOT TIDINESS.
 *
 * The rotation has period three and there are exactly six three-way staggered
 * pages in a pack, so left to itself it hands each place out exactly twice. Let
 * the two-object page draw from the same counter and two things go wrong at
 * once: the six lose their exact split, because the trio pages no longer land on
 * consecutive turns; and the pair page has to fold three places onto two, which
 * a modulo does by giving the first of them twice the weight — measured 66.0%
 * for "take whichever begins furthest left" on a page whose floor is 50%.
 *
 * So the pair, the puppet and Friday's sort draw their own place directly, each
 * on the range its own form allows, and the rotation stays exact for the six
 * pages it was built for.
 */
function drawnPlace(r: Rng, lo: number, hi: number): number {
  return r.int(lo, hi);
}

// ---------------------------------------------------------------------------
// Laying things down along one line
// ---------------------------------------------------------------------------

interface Laid {
  name: string;
  len: number;
  start: number;
  end: number;
}

/**
 * Lay the objects out so the BEGINNINGS AND THE ENDINGS RUN IN THE SAME ORDER —
 * which is the one arrangement in which neither of them says anything about
 * length, and it took a measurement to find that out.
 *
 * The obvious construction — set the ends a cube or two apart and let the
 * beginnings fall where they may — was built first and measured, and it hands
 * the page away. A long thing needs a lot of line, so a long thing forced to
 * finish early must have STARTED early; over 500 packs "take whichever one
 * begins furthest to the left" scored 81.3% on the three-way staggered pages,
 * 85.0% on the pair and 95.8% on the puppet's. One misconception had been
 * removed and a second, just as blind, had been installed in its place. Worse,
 * that one is not repairable by dealing: solving for the two flat margins gives
 * a unique answer, and the answer is this arrangement.
 *
 * So each object is placed to the right of the one before it and finishes to the
 * right of it as well. The step between two neighbours is at least
 * `previous length − this length + 1`, which is exactly what makes the endings
 * keep the order the beginnings are in, plus nought to two cubes drawn for
 * variety. Every ordinal a child could read off the page — which begins first,
 * which ends first, which sits furthest right, which is in the middle — then
 * names the same object as every other, so the ONLY thing left that distinguishes
 * the three is how much line each of them covers, which is the mathematics. The
 * measured result is in the report: every one of those habits lands within a
 * point of a third.
 *
 * Single pass, no redraw loop, no rejection (kit §E2.4).
 */
function layAlongLine(
  r: Rng,
  items: ReadonlyArray<{ name: string; len: number }>,
  orderFromLeft: readonly number[],
): Laid[] {
  const laid: Laid[] = items.map((it) => ({ name: it.name, len: it.len, start: 0, end: it.len }));
  // The leftmost thing need not touch the table edge either.
  let cursor = r.int(0, 1);
  let prev = -1;
  orderFromLeft.forEach((idx, k) => {
    if (k > 0) cursor += Math.max(1, items[prev].len - items[idx].len + 1) + r.int(0, 2);
    laid[idx] = { name: items[idx].name, len: items[idx].len, start: cursor, end: cursor + items[idx].len };
    prev = idx;
  });
  return laid;
}

/**
 * Everything begins at ONE mark — the picture the week is arguing for.
 *
 * The mark is not always the table edge, and drawing it is not decoration: a
 * child who only ever meets alignment at the left edge of the paper learns the
 * edge rather than the idea. It also gives the aligned pages a surface that
 * varies, which is what stopped the freshness guard exhausting them.
 */
function layFromTheMark(items: ReadonlyArray<{ name: string; len: number }>, mark = 0): Laid[] {
  return items.map((it) => ({ name: it.name, len: it.len, start: mark, end: mark + it.len }));
}

/** A left-to-right order with `targetIdx` at a named place, the rest shuffled around it. */
function orderWith(r: Rng, m: number, targetIdx: number, place: number): number[] {
  const rest = r.shuffle(Array.from({ length: m }, (_, i) => i).filter((i) => i !== targetIdx));
  const out: number[] = [];
  let k = 0;
  for (let p = 0; p < m; p++) out.push(p === place ? targetIdx : rest[k++]);
  return out;
}

/** Which drawn row is which — the three fills a row can take, distinct in greyscale. */
const ROW_FILLS = ['solid', 'hatch', 'soft'] as const;

/**
 * The rows, with the empty table in front of each one (disclosure 1).
 *
 * A zero-length gap is drawn as nothing at all, so an aligned page and a
 * staggered page are the same call with one number changed — which is exactly
 * what the week claims they are.
 */
function lineFigure(laid: readonly Laid[], altText: string, asserted = true): BBFigure {
  return barModel(
    laid.map((e, i) => ({
      label: e.name,
      segments: [
        { value: e.start, fill: 'none' as const },
        { value: e.len, fill: ROW_FILLS[i % ROW_FILLS.length] },
      ],
    })),
    {
      scaleMax: Math.max(...laid.map((e) => e.end)),
      alt: altText,
      // ASSERTS A GIVEN, NEVER THE ANSWER (kit §E2.5). `bar:0` sums the first
      // row's segments, which is where that row ENDS - the very quantity the
      // misconception reads off the page, and never the length the item asks
      // about.
      //
      // Dropped on the lesson script and the worked examples, because QG-13
      // audits those surfaces against an ANSWER and they carry no
      // `generator.params` for a param assertion to name; asserting there would
      // be a claim the gate cannot check rather than one it can.
      asserts: asserted ? assertsParam('endFirst', 'bar:0') : undefined,
    },
  );
}

/** "on the table: red straw, blue straw, then green straw" — order of drawing, nothing else. */
function lineAlt(names: readonly string[]): string {
  const last = names[names.length - 1];
  return alt(`on the table: ${names.slice(0, -1).join(', ')}, then ${last}`);
}

/** The bracket the freshness guard signs: never shown, never spoken. */
function lineScene(laid: readonly Laid[]): string {
  return laid.map((e) => `the ${e.name} from ${String(e.start)} to ${String(e.end)}`).join(', ');
}

// ===========================================================================
// The three cards a numeric page offers (disclosure 7)
// ===========================================================================

type Seat = 'top' | 'middle' | 'bottom';
const SEATS: readonly Seat[] = ['top', 'middle', 'bottom'];

/**
 * Where the answer sits among the three numbers on offer, dealt per slot per
 * pack, then the count drawn from what that seat can serve.
 *
 * Doing it in this order is the whole point. Draw the count first and the seat
 * has to be repaired at the ends of the range — the smallest count can never be
 * offered two smaller cards — and the repairs pile up on one seat, which is the
 * "answer at a fixed rank" defect wearing a different coat (§E2.11). Dealing the
 * seat first makes the rank flat by construction and pushes the unevenness onto
 * the count, where it is a preference and not a strategy.
 */
function nextSeat(r: Rng, guard: TupleGuard, slot: string): Seat {
  if (firstTime(guard, `a19:seatsched:${slot}`)) {
    r.shuffle([...SEATS]).forEach((s, i) => guard.add(`a19:seatorder:${slot}:${String(i)}=${s}`));
  }
  for (let turn = 0; ; turn++) {
    if (guard.taken(`a19:seatturn:${slot}:${String(turn)}`)) continue;
    guard.add(`a19:seatturn:${slot}:${String(turn)}`);
    const k = turn % 3;
    for (const s of SEATS) if (guard.taken(`a19:seatorder:${slot}:${String(k)}=${s}`)) return s;
    return SEATS[k];
  }
}

/** The counts a seat can serve inside a slot's own key range. */
function countsForSeat(seat: Seat, lo: number, hi: number): number[] {
  const from = seat === 'top' ? lo + 2 : seat === 'middle' ? lo + 1 : lo;
  const to = seat === 'top' ? hi : seat === 'middle' ? hi - 1 : hi - 2;
  const out: number[] = [];
  for (let v = from; v <= to; v++) out.push(v);
  if (out.length === 0) throw new Error(`A19: seat "${seat}" cannot be served from ${String(lo)}-${String(hi)}`);
  return out;
}

/**
 * Two honest miscounts beside the truth, and never a value the slot cannot key.
 *
 * Every card comes from inside the slot's own range, so no child ever learns to
 * strike one out unread (L38). The wrong values are what really goes wrong on a
 * row of cubes at four: a cube stepped over, or a cube touched twice, once or
 * twice over the length of the row.
 */
function threeCards(r: Rng, n: number, seat: Seat) {
  const over = (k: number) => ({
    text: String(n + k),
    errorTag: 'representation-misread' as ErrorTag,
    rationale:
      k === 1
        ? 'One cube was touched twice, so the count ran on past the end.'
        : 'The count doubled back over the row and picked up two cubes again.',
  });
  const under = (k: number) => ({
    text: String(n - k),
    errorTag: 'procedure-slip' as ErrorTag,
    rationale:
      k === 1
        ? 'A cube was stepped over, so the count stopped one short.'
        : 'Two cubes went by in one move along the row.',
  });
  const pair = seat === 'top' ? [under(1), under(2)] : seat === 'middle' ? [under(1), over(1)] : [over(1), over(2)];
  return makeChoices(r, String(n), pair);
}

// ===========================================================================
// The things measured with cubes
// ===========================================================================

/**
 * Flat things to lay cubes along, and things to stack cubes beside.
 *
 * Every one of them is something whose length nobody has an opinion about — a
 * comb is as long as it is — so any count the page draws is honest and a child's
 * own knowledge never argues with the picture. The compared objects of
 * `FAMILIES` are deliberately absent from both pools: a page that printed "the
 * red straw is six cubes" would hand over the answer to every comparison in the
 * pack, which is the same leak in a different direction.
 *
 * The pools are sized so no pack measures the same thing twice: ten flat things
 * against six flat pages, six upright things against four tower pages.
 */
const FLAT_THINGS = [
  'paintbrush', 'comb', 'glue stick', 'pencil case', 'bookmark',
  'toy car', 'hair clip', 'chalk', 'envelope', 'lolly stick',
] as const;

const TOWER_THINGS = ['candle', 'teddy', 'plant pot', 'money box', 'drum', 'egg cup'] as const;

/** Keyable ranges. The tower stops at six: the `stack` layout wraps at seven. */
const FLAT_RANGE: readonly [number, number] = [3, 9];
const TOWER_RANGE: readonly [number, number] = [2, 6];

/**
 * Cubes drawn at one fixed scale, so a cube is the same size on every page.
 *
 * Letting the row fill the drawing would make a three-cube row of enormous
 * flat rectangles and a nine-cube row of small square ones, and a unit that
 * changes size page to page is the one thing a measuring week may not draw.
 */
const CUBE_SCALE = 10;

/** One thing, drawn as the cubes that measured it. */
function cubeTape(label: string, len: number, altText: string, asserted: boolean): BBFigure {
  return barModel(
    [{ label, segments: Array.from({ length: len }, () => ({ value: 1, fill: 'solid' as const })) }],
    {
      scaleMax: CUBE_SCALE,
      alt: altText,
      asserts: asserted ? assertsParam('n') : undefined,
    },
  );
}

// ===========================================================================
// Local generator 1 — measure one thing in cubes
// ===========================================================================

/**
 * How many cubes long, or how many cubes tall. One thing, one chain of cubes,
 * nothing to compare it to.
 *
 * This is the act the whole comparison strand is built out of and the family has
 * no generator for it: `compareMeasure` always weighs two things against each
 * other, which is the second lesson rather than the first. A child who cannot
 * say how long a thing is cannot argue about which of two is longer, so it runs
 * on Days 1 and 2 before any comparison certifies anything, and it holds two of
 * the six mastery slots.
 *
 * FRESHNESS ON THE THING, NOT ON THE COUNT. `drawUniqueItem` signs a one-token
 * prompt as `<type>|1tok|<n>`, and this week serves eight measuring pages over
 * ranges holding five and seven values — the a01 failure exactly, where the
 * guard emptied the pool before the mastery slots drew and pinned one of them to
 * a single answer. So the guard is moved off the number entirely: every
 * measuring page registers `thing:<axis>:<name>`, so a pack never measures the
 * same object twice, and Form A and Form B differ by the object's name rather
 * than by luck. The count is then free to follow the seat rotation.
 */
function cubeCount(opts: { axis: 'along' | 'up'; slot: string }): ItemGen {
  const { axis, slot } = opts;
  const pool: readonly string[] = axis === 'along' ? FLAT_THINGS : TOWER_THINGS;
  const [lo, hi] = axis === 'along' ? FLAT_RANGE : TOWER_RANGE;
  return (rng, guard, difficulty) => {
    // Seat first, count second (disclosure 7), and both outside any retry.
    const seat = nextSeat(rng, guard, slot);
    const room = countsForSeat(seat, lo, hi);
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ thing: r.pick(pool), n: r.pick(room), seed: r.uint() }),
      (v) => `thing:${axis}:${v.thing}`,
    );
    const { thing, n } = draw;
    const scene =
      axis === 'along'
        ? `${countNoun(n, 'cubes')} laid along the ${thing}`
        : `${countNoun(n, 'cubes')} stacked beside the ${thing}`;
    const question = axis === 'along' ? `How many cubes long is the ${thing}?` : `How many cubes tall is the ${thing}?`;
    const { choices, correctKey } = threeCards(rng, n, seat);
    const draft: ItemDraft = {
      type: 'computation',
      prompt: scenePrompt(scene, question),
      // ASKS: how many cubes. So the name says what the picture is OF and never
      // how many of them there are (disclosure 10).
      figure:
        axis === 'along'
          ? cubeTape(thing, n, alt(`the cubes laid along the ${thing}`), true)
          : counters(n, 'blocks', {
            arrangement: 'in a tower',
            alt: alt(`the cubes stacked beside the ${thing}`),
            asserts: assertsParam('n'),
          }),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n), numberWords(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, thing, axis }, seed: draw.seed },
      hintLadder: rungs('Stand-in rungs; the bound instance below supplies them.'),
      errorTags: ['procedure-slip', 'representation-misread'],
      authorMeta: { stepCount: 1, cognitiveOp: axis === 'along' ? 'measure-length-cubes' : 'measure-height-cubes' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 2 — the comparison, aligned or staggered
// ===========================================================================

/**
 * The recipe's core form and the recipe's trap, built as one generator because
 * they are one picture with one number changed.
 *
 * `staggered: false` puts every object down at the mark, which is the page the
 * week is arguing FOR — and there the object reaching furthest really is the
 * longest, so a child who reads the ends is right and should be. `staggered:
 * true` gives each object its own beginning and deals where the answer's end
 * lands (disclosure 3), so the same reading is right a third of the time and no
 * oftener.
 *
 * WHICH ROW IS DRAWN FIRST IS SHUFFLED INDEPENDENTLY of where the ends fall, so
 * "take the top row" and "take whatever the audio names first" are worth a third
 * of the page as well. The three cards are the three objects themselves, so
 * there is no numeric rank for a card to sit at and nothing to strike out: on a
 * three-way page every option is the answer on about a third of draws by
 * construction, because a family's three lengths are dealt afresh per pack and
 * the question alternates between the longest and the shortest.
 *
 * The truth is recomputed by the registered `a_pick_extreme_v1`, which re-finds
 * the greatest or least LENGTH from the same array the picture is drawn from —
 * so a page keyed on the row that merely ends furthest along fails QG-11 rather
 * than shipping.
 */
function alongTheLine(opts: { members: 2 | 3; ask: 'longest' | 'shortest'; staggered: boolean }): ItemGen {
  const { members, ask, staggered } = opts;
  return (rng, guard, difficulty) => {
    // Taken once per ITEM, outside the freshness retry, so a redraw cannot
    // spend the next page's place in the rotation (disclosure 3). Only the
    // three-way pages draw on the rotation; the two-object page takes its own
    // coin, because its floor is a half and not a third.
    const dealt = !staggered || members !== 3 ? null : nextEndPlace(rng, guard);
    const place = dealt ? dealt.place : staggered ? drawnPlace(rng, 0, 1) : 0;
    return drawUniqueItem(rng, guard, (r) => {
      const family = r.pick(FAMILIES);
      const lengths = familyLengths(r, guard, family);
      const chosen = r
        .shuffle(family.map((name, i) => ({ name, len: lengths[i] })))
        .slice(0, members);
      const wanted = ask === 'longest' ? Math.max(...chosen.map((c) => c.len)) : Math.min(...chosen.map((c) => c.len));
      const targetIdx = chosen.findIndex((c) => c.len === wanted);
      const laid = staggered
        ? layAlongLine(r, chosen, orderWith(r, members, targetIdx, place % members))
        : layFromTheMark(chosen, r.int(0, 3));
      const shown = r.shuffle(laid);
      const winner = shown.find((e) => e.len === wanted)!;
      const question =
        members === 2
          ? ask === 'longest'
            ? 'Which one is longer?'
            : 'Which one is shorter?'
          : ask === 'longest'
            ? 'Which one is longest?'
            : 'Which one is shortest?';
      const { choices, correctKey } = makeChoices(
        r,
        `the ${winner.name}`,
        shown
          .filter((e) => e.name !== winner.name)
          .map((e) => ({
            text: `the ${e.name}`,
            errorTag: (e.end === Math.max(...shown.map((x) => x.end)) || e.end === Math.min(...shown.map((x) => x.end))
              ? 'concept-misconception'
              : 'representation-misread') as ErrorTag,
            rationale:
              e.end === Math.max(...shown.map((x) => x.end))
                ? 'The end poking out furthest, taken before the beginnings were matched.'
                : e.end === Math.min(...shown.map((x) => x.end))
                  ? 'The end stopping soonest, taken while the beginnings still sat apart.'
                  : 'Chosen from the middle of the page without lining anything up.',
          })),
      );
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(lineScene(shown), question),
        figure: lineFigure(shown, lineAlt(shown.map((e) => e.name))),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${winner.name}`, winner.name], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_pick_extreme_v1',
          params: {
            a: shown[0].len,
            counts: shown.map((e) => e.len),
            nouns: shown.map((e) => e.name),
            which: ask === 'longest' ? 'biggest' : 'smallest',
            // The first row's right-hand end, which is what the picture asserts
            // (disclosure 1), and what tells this page apart from its aligned
            // twin in the Form-B core-collision check.
            endFirst: shown[0].end,
            staggered,
            // WHICH TURN OF THE PACK'S ROTATION THIS PAGE TOOK, recorded because
            // it is part of what produced the page and because without it the
            // page is not distinguishable from its own twin.
            // `makeWeekBuilder` rebuilds a Form-B item whose `templateId|params`
            // matches a Form-A one, and a rebuild re-enters this generator and
            // spends a turn: measured, one pack in four hundred came out with
            // three of its six staggered pages rewarding the misconception
            // instead of two (seed 1943, slot MB.5). Carrying the turn makes two
            // calls structurally distinct, so the collision check cannot fire on
            // these pages at all and the rotation stays exact.
            ...(dealt ? { turn: dealt.turn } : {}),
          },
          seed: r.uint(),
        },
        hintLadder: rungs('Stand-in rungs; the bound instance below supplies them.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: {
          stepCount: 1,
          cognitiveOp: staggered ? `compare-length-staggered-${ask}` : `compare-length-aligned-${ask}`,
          ...(staggered ? { isDiscrimination: true } : {}),
        },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 3 — the puppet who trusts the ends
// ===========================================================================

/**
 * A NAMED puppet answers from the right-hand ends, which is row A19's slip word
 * for word: "compares without aligning ends".
 *
 * Nothing is invented (disclosure 5). His answer is the row the drawing puts
 * furthest along, read out of the same `end` values the picture is built from;
 * the truth beside it is recomputed by `a_pick_extreme_v1` from the lengths. The
 * word "wrong" never appears — "Oh no!" and "picked" are the band's form.
 *
 * ONLY THE PAGES WHERE THE ENDS MISLEAD ARE DRAWN HERE, because error analysis
 * requires him to be mistaken; that makes the furthest-along row never the
 * answer on this page, which would be a new false rule if this page were the
 * only one. Disclosure 4 measures the same habit on every other page instead,
 * and bars this form from both mastery forms: a page that names one of its own
 * three cards is scored by elimination half the time, which is worth teaching
 * with and not worth promoting on.
 */
function puppetTrustsTheEnds(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const family = r.pick(FAMILIES);
      const lengths = familyLengths(r, guard, family);
      const chosen = r.shuffle(family.map((name, i) => ({ name, len: lengths[i] })));
      const wanted = Math.max(...chosen.map((c) => c.len));
      const targetIdx = chosen.findIndex((c) => c.len === wanted);
      // Never the rightmost place: the puppet has to be mistaken, so the longest
      // thing may not also be the one whose end pokes out furthest. That is the
      // form's own cost and disclosure 4 measures what it does to the week.
      const laid = layAlongLine(r, chosen, orderWith(r, 3, targetIdx, drawnPlace(r, 0, 1)));
      const shown = r.shuffle(laid);
      const longest = shown.find((e) => e.len === wanted)!;
      const furthest = shown.slice().sort((x, y) => y.end - x.end)[0];
      const puppet = r.pick(PUPPETS);
      const { choices, correctKey } = makeChoices(
        r,
        `the ${longest.name}`,
        shown
          .filter((e) => e.name !== longest.name)
          .map((e) => ({
            text: `the ${e.name}`,
            errorTag: (e.name === furthest.name ? 'concept-misconception' : 'task-comprehension') as ErrorTag,
            rationale:
              e.name === furthest.name
                ? 'The puppet\'s answer: the end furthest along, from a row that began late.'
                : 'A third row, taken without matching any of the beginnings first.',
          })),
      );
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(
          lineScene(shown),
          `Oh no! ${puppet} picked the ${furthest.name}. Its end goes furthest. Which one is really longest?`,
        ),
        figure: lineFigure(shown, lineAlt(shown.map((e) => e.name))),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${longest.name}`, longest.name], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_pick_extreme_v1',
          params: {
            a: shown[0].len,
            counts: shown.map((e) => e.len),
            nouns: shown.map((e) => e.name),
            which: 'biggest',
            endFirst: shown[0].end,
            // What the puppet said, kept in the params rather than only in the
            // prompt: it is the misconception the page exists to show, and it
            // also keeps this item's identity clear of the plain staggered page,
            // which shares the template.
            puppetPicked: furthest.name,
          },
          seed: r.uint(),
        },
        hintLadder: rungs('Stand-in rungs; the bound instance below supplies them.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix-ends', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — the Day-4 measuring story
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: one pictured real-world move is
 * what a four-year-old's word problem IS, not a two-step with a step removed.
 * The family carries no story generator at all, so this one lives here.
 *
 * What the story adds is a PERSON doing the measuring, and a chain of cubes that
 * arrives the way it really does — laid down one at a time, each touching the
 * one before. That last condition is the whole difficulty of measuring at this
 * age and it is stated in the question rather than assumed, because a chain with
 * a gap in it is the commonest thing a five-year-old builds.
 */
function cubeStory(opts: { axis: 'along' | 'up' }): ItemGen {
  const { axis } = opts;
  const pool: readonly string[] = axis === 'along' ? FLAT_THINGS : TOWER_THINGS;
  const [lo, hi] = axis === 'along' ? FLAT_RANGE : TOWER_RANGE;
  return (rng, guard, difficulty) => {
    const seat = nextSeat(rng, guard, `story-${axis}`);
    const room = countsForSeat(seat, lo, hi);
    // The child is named OUTSIDE the freshness draw. `drawFresh` re-samples when
    // an object is already taken, and a name claimed inside the sampler is
    // claimed by every discarded attempt too — which burned the eight-name pool
    // and put one child on two story pages of the same pack 47 times in 500
    // (found by reading a generated week, not by a gate: a name is not an
    // operand and never enters a surface signature).
    const who = someone(rng, guard);
    const draw = drawFresh(
      rng,
      guard,
      (r) => ({ thing: r.pick(pool), n: r.pick(room), seed: r.uint() }),
      (v) => `thing:${axis}:${v.thing}`,
    );
    const { thing, n } = draw;
    const { choices, correctKey } = threeCards(rng, n, seat);
    const draft: ItemDraft = {
      type: 'word-problem',
      prompt:
        axis === 'along'
          ? scenePrompt(
            `${countNoun(n, 'cubes')} in a chain beside the ${thing}`,
            `${who} lays cubes along the ${thing}. How many cubes?`,
          )
          : scenePrompt(
            `${countNoun(n, 'cubes')} in a stack beside the ${thing}`,
            `${who} builds a stack up to the ${thing}. How many cubes?`,
          ),
      figure:
        axis === 'along'
          ? cubeTape(thing, n, alt(`the chain of cubes beside the ${thing}`), true)
          : counters(n, 'blocks', {
            arrangement: 'in a tower',
            alt: alt(`the stack of cubes built beside the ${thing}`),
            asserts: assertsParam('n'),
          }),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n), numberWords(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, thing, who, axis }, seed: draw.seed },
      hintLadder: rungs('Stand-in rungs; the bound instance below supplies them.'),
      errorTags: ['task-comprehension', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: `measure-story-${axis}`, situationType: 'measurement' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 5 — Friday: order three, and say how you knew
// ===========================================================================

/**
 * The Day-5 signature the recipe names — "order 3 objects (figure, R)" — with
 * the telling as the open part.
 *
 * The order itself is computed from the dealt lengths and is on the page for an
 * adult to check; what has no key is the how-do-you-know, and that is the half
 * the catalog's non-computational focus is about. `a_sort_and_tell_v1` registers
 * neither an `answerFor` nor a `verifyFor` — it is the family's marker for
 * exactly this shape — so nothing pretends to grade a sentence a child says out
 * loud. It is also the item that satisfies the §6.12 dual-strand coupling gate.
 *
 * Staggered rather than aligned, and shortest first rather than longest:
 * ordering three things that all begin at the mark is a glance, and the sentence
 * the child is being asked for ("I slid them together") only exists if the
 * sliding was necessary.
 */
function orderThree(): ItemGen {
  return (rng, guard, difficulty) => {
    // Friday's own place, off the rotation the six three-way pages own.
    const place = drawnPlace(rng, 0, 2);
    return drawUniqueItem(rng, guard, (r) => {
      const family = r.pick(FAMILIES);
      const lengths = familyLengths(r, guard, family);
      const chosen = r.shuffle(family.map((name, i) => ({ name, len: lengths[i] })));
      const shortest = Math.min(...chosen.map((c) => c.len));
      const targetIdx = chosen.findIndex((c) => c.len === shortest);
      const laid = layAlongLine(r, chosen, orderWith(r, 3, targetIdx, place % 3));
      const shown = r.shuffle(laid);
      const order = shown.slice().sort((x, y) => x.len - y.len).map((e) => e.name);
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(lineScene(shown), 'Put them in order, shortest first. How do you know?'),
        figure: lineFigure(shown, lineAlt(shown.map((e) => e.name))),
        answer: { value: order.join(', '), acceptableForms: [], validation: 'manual-review' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_sort_and_tell_v1',
          params: { a: shown[0].len, endFirst: shown[0].end },
          seed: r.uint(),
        },
        hintLadder: rungs('Stand-in rungs; the bound instance below supplies them.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'order-by-length' },
      };
      return draft;
    });
  };
}

// ===========================================================================
// The generators, bound and given this week's voice
// ===========================================================================

const cubesAlong = withHints(
  spokenSafe(cubeCount({ axis: 'along', slot: 'along' }), 'cubesAlong'),
  rungs('Touch the cube at the very start of the row.', 'Slide it along and name each cube once.'),
);
const cubesUp = withHints(
  spokenSafe(cubeCount({ axis: 'up', slot: 'up' }), 'cubesUp'),
  rungs('Begin at the bottom cube and climb upwards.', 'Stop on the cube at the very top.'),
);

const alignedTrio = withHints(
  spokenSafe(alongTheLine({ members: 3, ask: 'longest', staggered: false }), 'alignedTrio'),
  rungs('These three all begin at the same mark.', 'Follow each one and see who gets furthest.'),
);
const staggeredPair = withHints(
  spokenSafe(alongTheLine({ members: 2, ask: 'longest', staggered: true }), 'staggeredPair'),
  rungs('Take your eyes off the ends for a moment.', 'Find where each one begins, then bring them together.'),
);
const staggeredLongest = withHints(
  spokenSafe(alongTheLine({ members: 3, ask: 'longest', staggered: true }), 'staggeredLongest'),
  rungs('The ends are not the place to look first.', 'Match up the beginnings, then see who gets furthest.'),
);
const staggeredShortest = withHints(
  spokenSafe(alongTheLine({ members: 3, ask: 'shortest', staggered: true }), 'staggeredShortest'),
  rungs('Beginnings first, endings second.', 'From a shared mark, the shortest runs out soonest.'),
);

const puppetPage = withHints(
  spokenSafe(puppetTrustsTheEnds(), 'puppetPage'),
  rungs('Check where the puppet started looking.', 'Bring all three beginnings together before deciding.'),
);

const measuringStory = withHints(
  spokenSafe(cubeStory({ axis: 'along' }), 'measuringStory'),
  rungs('Every cube must touch the one beside it.', 'Do not stop before the very far end.'),
);
const buildingStory = withHints(
  spokenSafe(cubeStory({ axis: 'up' }), 'buildingStory'),
  rungs('No gaps: each cube sits right on the last.', 'Count them going up, and stop level with the top.'),
);

const friday = withHints(
  spokenSafe(orderThree(), 'friday'),
  rungs('Hold each one against the same starting mark.', 'The one that runs out soonest goes first.'),
);

/**
 * The family's own comparison, aligned, with both measurements spoken
 * (disclosure 6). Its ladder is this week's; its draw, its pool and its picture
 * are the library's untouched.
 */
const measuredPair = withHints(
  spokenSafe(compareMeasure({ attr: 'length' }), 'measuredPair'),
  rungs('One counted step is the same as another.', 'Whichever needed more steps is the longer one.'),
);

// --- the five warm-ups, one format and one source week each ----------------
// Floors, not defaults. `setForNumeral` and `pickExtreme` need room for three
// honestly different groups; `compareSets` needs room for a tie to be reachable;
// `howManyChoice` needs two cards either side of its answer. Ranges chosen so no
// drawn page contradicts its own description.
const warmCountLine = warmUp(spokenSafe(howManyChoice({ min: 3, max: 9, arrangement: 'in a row' }), 'warmCountLine'), 1);
const warmNamedGroup = warmUp(spokenSafe(setForNumeral({ min: 3, max: 9 }), 'warmNamedGroup'), 2);
const warmMatchRows = warmUp(spokenSafe(compareSets({ which: 'more', min: 3, max: 8 }), 'warmMatchRows'), 5);
const warmFewestGroup = warmUp(spokenSafe(pickExtreme({ which: 'smallest', min: 2, max: 9 }), 'warmFewestGroup'), 6);
// UNTILTED, AND THE TILT WAS MEASURED OUT RATHER THAN ASSUMED HARMLESS.
// `shapeName({tilt:true})` is A7's own discrimination and it always draws the
// square, so read as a warm-up its key never moves: over 500 packs it keyed
// "square" on 500 of them, with "diamond" offered on every draw and correct on
// none. In A7, where the lesson IS that a turned square is still a square, that
// is the point; anywhere else it is a page a child scores by saying one word
// twice. Untilted, the shape is drawn from all four and the answer moves.
const warmNameShape = warmUp(spokenSafe(shapeName(), 'warmNameShape'), 7);

// ===========================================================================
// The teaching objects
//
// Every object the lesson and the worked examples name is OUTSIDE both draw
// pools, so a modelled length can never contradict a length the pack dealt: the
// twig is seven cubes in the script and the twig is nowhere else. Their numbers
// also keep every guided-example PROMPT under two numeric tokens, so
// `makeWeekBuilder`'s echo filter — which rebuilds a day item whose numerals
// match an example's, and does NOT apply the same filter to the mastery forms —
// never fires at all, and the served key sets in the report are the whole key
// sets (the a13 defect, met by removing its precondition).
// ===========================================================================

const TWIG = { name: 'twig', len: 7 };
const SPOON = { name: 'spoon', len: 5 };
const PEG = { name: 'peg', len: 4 };
const PIPE_CLEANER = { name: 'pipe cleaner', len: 9 };

/** The staggered pair the lesson opens on: the spoon begins late and ends late. */
const TAUGHT_PAIR: Laid[] = [
  { name: TWIG.name, len: TWIG.len, start: 0, end: 7 },
  { name: SPOON.name, len: SPOON.len, start: 3, end: 8 },
];

/** The same two, brought to the mark. */
const TAUGHT_ALIGNED: Laid[] = layFromTheMark([TWIG, SPOON]);

/** Three, staggered, for the last worked example. */
const TAUGHT_TRIO: Laid[] = [
  { name: PEG.name, len: PEG.len, start: 5, end: 9 },
  { name: PIPE_CLEANER.name, len: PIPE_CLEANER.len, start: 0, end: 9 - 1 },
  { name: SPOON.name, len: SPOON.len, start: 2, end: 7 },
];

// ===========================================================================
// The week
// ===========================================================================

export const buildA19 = makeWeekBuilder({
  level: 'A',
  week: 19,
  conceptId: 'length-and-height',
  conceptName: 'Length & height',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 5 },
    { level: 'A', week: 6 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'line up at a common start',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Before you open the app, put two straws on the table with one of them pushed forward, and ask which is longer before anyone measures. Let the guess stand, then slide both back against the edge of a book and look again - that moment is the whole week. Keep a pot of identical cubes, bricks or pasta shells within reach for the counting pages, and say out loud that they all match, because that is the part a child skips. For the standing-up pages, back your child against a doorframe beside a teddy. Mascot present.',
  },
  explanation: {
    hook: say(
      'Two straws lie on the table. One end sticks out further. Is that one longer? Look again! Slide them both against the same line.',
    ),
    whyBeforeHow: say(
      'A straw can look longer because it starts further along. So we line up at a common start. Now the one reaching further really is longer. Cubes settle it too, when every cube matches.',
    ),
    script: [
      {
        say: say('Here lie a twig and a spoon. The spoon ends further along.'),
        visual: 'A twig and a spoon on the table, the spoon pushed forward so its end reaches further.',
        figure: lineFigure(TAUGHT_PAIR, lineAlt([TWIG.name, SPOON.name]), false),
      },
      {
        say: say('Do not trust that yet. They begin in different places.'),
        visual: 'The same two, with a finger pointing at where each one begins.',
        figure: lineFigure(TAUGHT_PAIR, lineAlt([TWIG.name, SPOON.name]), false),
      },
      {
        // The discrimination TAUGHT, where both pictures are available and the
        // answer is already on the page (kit §E2.5).
        say: say('Now both begin at one mark. The twig wins after all.'),
        visual: 'The twig and the spoon slid back so their left ends touch one drawn line.',
        figure: lineFigure(TAUGHT_ALIGNED, lineAlt([TWIG.name, SPOON.name]), false),
      },
      {
        say: say('Cubes tell us too. Lay them along, all touching, none skipped.'),
        visual: 'A chain of cubes laid end to end along the peg, with no gaps between them.',
        figure: cubeTape(PEG.name, PEG.len, alt('the cubes laid along the peg'), false),
      },
      {
        say: say('Standing things work the same way. Both feet on the floor.'),
        visual: 'A teddy beside a candle, both standing on the same tabletop, with cubes stacked beside each.',
        figure: counters(4, 'blocks', { arrangement: 'in a tower', alt: alt('the cubes stacked beside the teddy') }),
      },
    ],
    summary: say(
      'Line the beginnings up first, then look. The one reaching further is longer. Cubes tell you how many.',
    ),
    vocabulary: [
      { term: 'longer', kidGloss: 'reaches further when both begin at one mark' },
      { term: 'shorter', kidGloss: 'runs out sooner when both begin together' },
      { term: 'taller', kidGloss: 'longer, but standing up from the floor' },
      { term: 'start line', kidGloss: 'the mark both things are pushed back to' },
      { term: 'cube', kidGloss: 'a small block, and every cube matches the rest' },
    ],
  },
  guidedExamples: [
    {
      ...ge(19, 1, 'modeled', scenePrompt('the twig and the spoon on the table', 'Which one is longer?'), [
        { teacherSay: say('Watch me. The spoon end sticks out further. Should I pick it?') },
        { childDo: say('Point at where each one begins.'), expected: 'not the same place' },
        { teacherSay: say('They begin apart. So I slide them back to one mark.') },
        { childDo: say('Now say which one reaches further.'), expected: 'the twig' },
      ], 'the twig'),
      visual: 'The twig and the spoon, the spoon pushed forward, then both slid back to a drawn line.',
      figure: lineFigure(TAUGHT_PAIR, lineAlt([TWIG.name, SPOON.name]), false),
    },
    {
      ...ge(19, 2, 'completion', scenePrompt('cubes laid along the peg', 'How many cubes long is the peg?'), [
        { teacherSay: say('Touch the cube nearest the start. Then the next.') },
        { childDo: say('Count along to the last cube.'), expected: '4' },
      ], '4'),
      visual: 'A chain of cubes along the peg, each one touching the next.',
      figure: cubeTape(PEG.name, PEG.len, alt('the cubes laid along the peg'), false),
    },
    {
      ...ge(19, 3, 'prompted', scenePrompt('cubes stacked beside the teddy', 'How many cubes tall is the teddy?'), [
        { teacherSay: say('Both feet stay on the table. Build up from there.') },
        { childDo: say('Go up the stack, naming each cube.'), expected: '4' },
      ], '4'),
      visual: 'A tower of cubes standing beside the teddy, both on the same tabletop.',
      figure: counters(4, 'blocks', { arrangement: 'in a tower', alt: alt('the cubes stacked beside the teddy') }),
    },
    {
      ...ge(19, 4, 'independent', scenePrompt('the peg, the pipe cleaner and the spoon', 'Which one is longest?'), [
        { childDo: say('Bring all three beginnings together. Then choose.'), expected: 'the pipe cleaner' },
      ], 'the pipe cleaner'),
      visual: 'Three things at three different starting places, then all three slid back to one line.',
      figure: lineFigure(TAUGHT_TRIO, lineAlt([PEG.name, PIPE_CLEANER.name, SPOON.name]), false),
    },
  ],
  days: [
    // Day 1 — concept echo: measure one thing both ways, then the first
    // comparison the measuring makes possible, with everything at the mark.
    [
      { gen: warmCountLine, diff: 1 },
      { gen: cubesAlong, diff: 2 },
      { gen: alignedTrio, diff: 2 },
      { gen: cubesUp, diff: 2 },
    ],
    // Day 2 — the beginnings come apart for the first time, beside the family's
    // aligned page where both measurements are spoken.
    [
      { gen: warmMatchRows, diff: 2 },
      { gen: cubesAlong, diff: 2 },
      { gen: staggeredPair, diff: 3 },
      { gen: measuredPair, diff: 2 },
    ],
    // Day 3 — three at once, staggered, and the puppet who answers from the ends.
    [
      { gen: warmNameShape, diff: 2 },
      { gen: staggeredLongest, diff: 3 },
      { gen: cubesUp, diff: 2 },
      { gen: puppetPage, diff: 3 },
    ],
    // Day 4 — someone doing the measuring, once along and once upward, and the
    // question turned round on the third page.
    [
      { gen: warmNamedGroup, diff: 2 },
      { gen: measuringStory, diff: 2 },
      { gen: buildingStory, diff: 3 },
      { gen: staggeredShortest, diff: 3 },
    ],
    // Day 5 — order three and say how you knew, then the page where lining up
    // has already been done for you.
    [
      { gen: warmFewestGroup, diff: 2 },
      { gen: friday, diff: 3 },
      { gen: alignedTrio, diff: 2 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: a child of four settles "which is longer?" by looking at the far ends, and that rule is right about half the time, which is exactly why it survives. Telling them does not shift it; sliding does. Put two pencils on the table with one pushed forward, ask which is longer, accept the answer without correcting it, then push both back against the edge of a book and ask again. Say what you did out loud - "now they both start here" - because the words are what the child takes away. Then measure something with a pot of identical cubes, bricks or pasta shells, and be fussy in front of them about two things: every cube touching the next, and every cube the same as the rest. Those are the two rules every ruler in their life will run on. For standing-up things, a doorframe and a pencil mark beat any picture; stand your child beside a teddy, both feet flat, and let them see that lifting onto tiptoe is cheating in the same way that pushing a pencil forward was. And if they start insisting the one that sticks out is never the longest, they have swapped one rule for another - line three things up honestly and let the ends tell the truth.',
  ],
  /**
   * A colouring page whose colouring cannot be done without measuring, and whose
   * MOVE is one no day makes (disclosure 12).
   *
   * Every page this week hunts for an extreme. Here nothing is extreme: four
   * cards lie from the same mark, cut into cubes, and exactly two of them match.
   * The child has to test pairs rather than scan for a winner, and the payoff is
   * the idea the whole week has been circling - that measuring settles sameness
   * as surely as it settles difference.
   */
  puzzle: (r, guard) => {
    // Card names of their own, so the puzzle never borrows a length the pack
    // dealt to something else.
    const CARDS = ['star card', 'moon card', 'sun card', 'boat card', 'leaf card'] as const;
    const twin = r.int(3, 8);
    const spare = [3, 4, 5, 6, 7, 8, 9].filter((v) => v !== twin);
    const [other1, other2] = r.shuffle(spare).slice(0, 2);
    const picked = r.shuffle([...CARDS]).slice(0, 4);
    const rows = r.shuffle([
      { name: picked[0], len: twin },
      { name: picked[1], len: twin },
      { name: picked[2], len: other1 },
      { name: picked[3], len: other2 },
    ]);
    // Recounted from the drawn rows rather than read back off `twin`, so a
    // dealing slip throws the answer off instead of hiding inside it.
    const counted = rows.filter((row) => rows.filter((o) => o.len === row.len).length === 2);
    const answer = counted[0].len;
    const twinIdx = rows.findIndex((row) => row.len === answer);
    guard.add(`a19:puzzle=${String(answer)}`);
    return {
      id: 'A19-PZ-01',
      title: 'Puzzle Grove: The Cube Line Decides',
      puzzleType: 'math-art',
      prompt: [
        `[image: ${rows.map((row) => `the ${row.name} of ${String(row.len)} cubes`).join(', ')}]`,
        say('Four cards begin at the same line.'),
        say('Two of them are exactly the same length.'),
        say('Colour those two cards.'),
        say('How many cubes long are they?'),
      ].join(' '),
      figure: barModel(
        rows.map((row, i) => ({
          label: row.name,
          segments: Array.from({ length: row.len }, () => ({
            value: 1,
            fill: (i === twinIdx || rows[i].len === answer ? 'solid' : 'soft') as 'solid' | 'soft',
          })),
        })),
        {
          scaleMax: CUBE_SCALE,
          // NOT "four cards": the puzzle keys a cube count that can be four, so
          // the tally of rows is a number this picture's name may not say
          // (disclosure 10, and the reason the rule is stated conditionally).
          alt: alt('cards cut into cubes, laid out in rows'),
          // The twin's own row, so the picture is proved to hold the answer the
          // page asks for rather than the four rows added together.
          asserts: assertsAnswerOf(`bar:${String(twinIdx)}`),
        },
      ),
      answer: {
        value: String(answer),
        acceptableForms: [numberWords(answer)],
        validation: 'exact-numeric',
      },
      hintLadder: rungs('Count the cubes on one card, then try another.', 'Carry that count across to the next card.'),
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'match-equal-lengths' },
  sprint: null,
  mastery: [
    { gen: cubesAlong, diff: 2 },
    { gen: staggeredLongest, diff: 3 },
    { gen: cubesUp, diff: 2 },
    { gen: measuringStory, diff: 3 },
    { gen: staggeredShortest, diff: 3 },
    { gen: alignedTrio, diff: 2 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh objects and lengths off a separate stream. 01: how many cubes long one flat thing is, tapped from three numerals. 02: three things laid down at three different beginnings, longest tapped - the week\'s trap, and the place the keyed thing takes among the right-hand ends is dealt per pack so that "take whichever pokes out furthest" is right on exactly two of a pack\'s six three-way staggered pages, never none and never more. 03: how many cubes tall one standing thing is, tapped from three numerals. 04: a measuring story with a person in it, tapped from three numerals. 05: the same staggered trio asked the other way round, shortest tapped, with the dealt place read from the other end because the habit there is "take whichever stops soonest". 06: three things all beginning at one mark, longest tapped - the page where reading the ends is the CORRECT move, so the week never teaches that the far end is a liar. Three slots take a numeral and three take an object name; none is two-way, because a two-option comparison certifies a coin flip. On all three numeral slots the answer\'s seat among the three cards is dealt before its value is drawn, so it is lowest, middle and highest on exactly a third of that slot\'s pages in every pack. Every named object carries ONE length for the whole pack: the brown lace that beats the white lace on Monday beats it on Friday and beats it in both mastery forms, from whatever mark either of them happens to begin at.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'reads-the-far-end',
      description:
        'Decides which of two things is longer by which one\'s far end reaches further, without checking where either of them began. It is not carelessness: on a table where things usually are pushed together, the rule works, and a child has years of evidence for it.',
      exampleWrongAnswer: 'a spoon starting three cubes along and ending at eight called longer than a twig running from nothing to seven',
      distractorRationale:
        'Put the thing whose end goes furthest on every card list, then DEAL where the keyed thing sits: exactly two of a pack\'s six three-way staggered pages hand the far end the win, and two whole pages a day are aligned, where the far end is the right thing to read. The habit loses without its opposite being installed in its place.',
      reteachPointer: 'explanation/script[2] (both slid back to one mark, and the twig wins after all)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-the-cubes-loosely',
      description:
        'Touches one cube twice, or lets the finger jump two at a time, so the chain is counted as longer or shorter than it is. Keeping a place along a row of identical things is the whole difficulty of measuring at this age.',
      exampleWrongAnswer: 'a chain of six cubes reported as seven after the first cube was named twice',
      distractorRationale:
        'Offer one and two cubes either side of the truth, and deal WHERE the truth sits among the three cards before its value is drawn, so no child can score by always tapping the biggest number or always the middle one.',
      reteachPointer: 'guidedExamples/A19-GE-02 (start on the very first cube, touch every one)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'chain-with-a-gap',
      description:
        'Lays the measuring cubes down with spaces between them, or starts the chain part way along the object, so the count answers a different question from the one asked. The rule that every unit must touch the next is the one children skip.',
      exampleWrongAnswer: 'a comb measured as five cubes because the chain began at the teeth rather than at the end',
      distractorRationale:
        'Offer counts one and two short of the truth, and state the touching rule inside the story question rather than assuming it, so the page tests the laying-down as well as the counting.',
      reteachPointer: 'explanation/script[3] (all touching, none skipped)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-other-direction',
      description:
        'Answers with whichever thing the last few pages wanted, so a shortest-question collects the longest thing. The two questions arrive over pictures that are indistinguishable, and by the third page nobody is listening past the first three words.',
      exampleWrongAnswer: 'asked which is shortest, taps the thing that reaches furthest from the shared mark',
      distractorRationale:
        'Put longest and shortest over pictures a child cannot tell apart, and let the direction alone decide who wins; the third card is then a row that answers neither question.',
      reteachPointer: 'guidedExamples/A19-GE-04 (bring all three beginnings together, then choose)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Comparing how long things are, and finding out that the far end tells you nothing until both things begin at the same place. We laid straws and laces down at different starting points and slid them together before deciding, measured combs and candles by laying identical cubes along them and stacking cubes beside them, and put three things in order from shortest to longest. We also met a puppet who answers by looking at the far ends, and put him right.',
    improvingCandidates: [
      'pushing both things back to one mark before deciding',
      'saying how you know, not just which one you chose',
      'laying cubes so each one touches the next, with none skipped',
      'catching which way round the question was asked before answering',
      'lining three things up and then ranking them',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'separating "sticks out further" from "is longer" - we will keep laying things down at different starting points',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping a place along a row of identical cubes, now that the rows run to nine',
      },
      {
        errorTag: 'task-comprehension',
        text: 'catching which way round a question was asked, now that both directions sit over one picture',
      },
    ],
    homeFocus: {
      praiseLine:
        'You lined up both ends before you chose, and you counted every cube along the way.',
      questionForChild: 'Which is longer - your shoe, or the big wooden spoon?',
      schoolSyncHook: 'Tell us what nursery measures with - conkers, hand spans, a knotted string - and these pages will use the same thing.',
    },
    vocabularyForParent: [
      'longer / shorter (settled from a shared starting line, never from the far end)',
      'height (a length measured upward from the floor, with both feet flat)',
      'nonstandard unit (cubes, hands or footsteps - anything repeated, so long as they all match)',
      'direct comparison (putting two things side by side instead of measuring either)',
    ],
  },
});
