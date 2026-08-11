/**
 * Level A · Week 4 — "Writing numbers 6–10" (conceptId: writing-numbers-6-10).
 *
 * Composed with `makeWeekBuilder` over `lib/earlynumber`. The exemplars a01, a02
 * and a11 were read for their ARCHITECTURE; every sentence, scene, name and noun
 * below was written for this week, and the cross-corpus overlap scan that proves
 * it is in the report.
 *
 * FILL-ARCHITECTURE §3 row A4: anchor "trace → write"; core forms write-from-count
 * and frame→numeral; perceptual discrimination "6 vs 9 flip"; puppet
 * error-analysis "writes 9 for six"; Day-5 "numeral↔set match".
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **A numeral is a SHAPE that has to survive the trip from the eye to the
 *    paper.** A2 stopped at the spoken number; A4 does not. Every core item ends
 *    in a numeral: written with a finger on the three handwriting pages, tapped
 *    on the eleven that offer options, so the count is never the end of the job.
 *  - **Two of these five shapes are the same shape.** Six and nine are one curl
 *    turned round, and no other pair in 0–10 is. That single fact is the week:
 *    it is taught in the script, posed as the discrimination, offered as a live
 *    option on every certifying slot that can carry it, and it is what the
 *    puzzle is built out of.
 *  - **Ten is the first number that needs two marks.** It arrives here as a
 *    difficulty rather than as a new idea: the frame that holds it is A2's, but
 *    writing it is a one and a zero, in that order.
 *  - **Nothing is asked without a drawing.** At band A `pictorialPerDay: 1`
 *    stands in for the multi-step density row, and this week clears it on every
 *    item rather than one: each figure is built from the values its own item
 *    computes from.
 *  - **No timers, anywhere.** `sprint: null`; `makeWeekBuilder` refuses a Level-A
 *    sprint outright, and QG-7 refuses a non-null `fluencySprint`.
 *  - **Retrieval is 21.1%** (4 of 19 daily items), one warm-up on each of Days
 *    1–4, from A3, A1, A2 and A1 in four different formats.
 *
 * ── WHAT WAS DECIDED AND WHY — eight notes, per FANOUT kit §E2.3 ────────────
 *
 * 1. **THE PUPPET'S SLIP IS NOT THE RECIPE'S, AND THE SUBSTITUTION IS PROVED
 *    RATHER THAN PREFERRED.** §3 row A4 names "writes 9 for six". The `verifyFor`
 *    registry cannot express that value, and this is structural, not a failure of
 *    search (L36 says prove it first, so here is the proof over every registered
 *    transform that returns a `wrong`):
 *      · `a_verify_count_slip_v1`  — wrong = n ± 1. |9 − 6| = 3. Impossible.
 *      · `a_verify_countback_slip_v1` — wrong = correct + 1. Impossible.
 *      · `a_verify_teen_write_v1`  — wrong = the digit string reversed, and it
 *        throws on a palindrome. EVERY one-digit numeral is a palindrome, so it
 *        throws on 6 and on 9: a structural NULL for single digits, exactly as
 *        `e_verify_int_compare_v1` is a structural null at Level B (kit §E2.12).
 *      · `d_verify_binop_misconception_v1` — varies the OPERATION over ONE fixed
 *        operand pair. I did find the identity, and it is real: `{a:3, b:3,
 *        op:'+', wrongOp:'*'}` returns exactly `{correct:'6', wrong:'9'}`, and
 *        the mirror pair returns `{correct:'9', wrong:'6'}`. It is still refused.
 *        A4 has taught neither addition (A14) nor multiplication (Level C), and
 *        the operands 3 and 3 have no referent in a page about the shape of a
 *        numeral — the pair exists only because it hits the two target values,
 *        which is the "fabrication with extra steps" §E2.12 names by name.
 *
 *    Taken in the kit §E2.3 order, the misconception therefore MOVES to where it
 *    can be shown honestly and needs no `wrong` value at all — a discrimination
 *    OPTION. It is live in five places: `sixNineTrap` (the library's own
 *    `numeralTrap('six-nine')`, whose distractor is computed by library code and
 *    proved false by `a_numeral_trap_v1`'s verify returning `correct = n`), every
 *    draw of `numeralForSet`, `numeralForFrame` and the three Day-4 stories where
 *    the count is a six or a nine, the Day-5 puzzle, and the mistakeBank.
 *
 *    What the puppet carries instead is the COMPLEMENTARY slip that IS derivable
 *    and that this week's own act creates: a count that lost its place on the way
 *    to the paper. `puppetWrites` registers `a_verify_count_slip_v1`, so the
 *    number the puppet wrote is recomputed by the registry and QG-11 asserts the
 *    prompt shows it. No number in this file's prompts is authored.
 *
 *    THE ONE PLACE THE FLIP IS AUTHORED, said plainly: `FLIP` below is a table of
 *    two entries, and the Day-5 puzzle keys `FLIP[n]`. That is a claim about the
 *    GEOMETRY of two printed marks — a 6 rotated half a turn is a 9 — not about
 *    arithmetic, so no arithmetic transform could pin it and none pretends to. It
 *    is the same fact the library's own `numeralTrap('six-nine')` is built on
 *    (`confused = n === 6 ? 9 : 6`), and a module-load invariant below refuses to
 *    load if the table is ever anything but an involution on {6, 9} inside the
 *    week's own range. Recorded for the orchestrator: a `verifyFor` for glyph
 *    rotation would let the recipe's puppet ship as written.
 *
 * 2. **THE 6-vs-9 DISCRIMINATION IS DELIBERATELY TWO-WAY, AND A THIRD OPTION
 *    WOULD MAKE IT WORSE.** `numeralTrap('six-nine')` draws n ∈ {6, 9} at even
 *    odds and offers the truth against its flip. A child who holds the
 *    misconception — "I read every six as a nine" — scores 50%, and so does a
 *    child who guesses, so the habit is worth NOTHING over chance. Add a third
 *    honest miscount and the floor drops to 33.3% while the misconception-holder
 *    still scores 50%: the page would then pay 17 points for holding exactly the
 *    belief the week exists to remove. That is L51's question ("does guessing it
 *    reward the misconception I am teaching against?") answered by arithmetic
 *    rather than by taste, and it is why this slot stays at two options and stays
 *    on Day 2 as a TEACHING page. It does not certify, for the second reason
 *    below.
 *
 * 3. **`sixNineTrap` RUNS ONCE PER PACK, because its answer space holds two
 *    values.** Its prompt carries one numeric token, so `drawUniqueItem` signs it
 *    `representation|1tok|6` or `…|9`; a second use in mastery would need four
 *    more distinct draws from a two-value pool, exhaust the guard, and risk
 *    `formA[i].prompt === formB[i].prompt`, which `bb-verify-packs` asserts
 *    against. The discrimination is certified INSIDE the wide slots instead: the
 *    flip is a live, keyable option on mastery slots 01, 02, 03, 05 and 06
 *    whenever the drawn count is a six or a nine, so a child who confuses the two
 *    shapes taps it there. Measured rates are in the report and in `isomorphNotes`.
 *
 * 4. **EVERY NUMBER THIS WEEK OFFERS IS A COUNT ITS OWN SLOT CAN KEY.** "Free-entry
 *    numeric" is not an answer mode at band A: a pre-reader cannot type, so
 *    `AnswerEntry` hands a choice-less numeric item to `tapOptionsFor`, which
 *    invents four number buttons at render time from a function that cannot know
 *    the slot's answer RANGE. Every certifying slot here therefore ships AUTHORED
 *    options, and all of them are drawn from 6–10 — the range the picture itself
 *    is drawn from — so no value can be struck out unread. Nothing is added to
 *    `DECLARED_LURES`, because this week declares no lure: it has none.
 *
 *    What that leaves, measured over 600 packs rather than waved at. The three
 *    `writeIt`/`writeAndSay` pages and the puzzle validate `manual-review`, which
 *    `AnswerEntry` short-circuits into a single "I did it!" acknowledgement
 *    BEFORE it would reach `tapOptionsFor` — no invented buttons, no grading, and
 *    the writing happens on paper, where a numeral can actually be traced. That
 *    leaves exactly ONE page in the week the display layer must build buttons
 *    for: the Day-3 warm-up, A2's "how many boxes are empty?". It is retrieval
 *    and it certifies nobody, and it is also clean — a frame drawn 6-9 leaves 1-4
 *    empty, all four are offered on 100% of draws and all four are keyed
 *    (24.5 / 23.8 / 25.3 / 26.3%), so nothing there is dead and no rank is fixed.
 *    Across every authored-choice slot in the week — 27 of them, both mastery
 *    forms included — the count of options offered and never keyed is ZERO. The
 *    single exception in the whole pack is the Day-4 warm-up, the A1 tap-the-
 *    numeral at 2-5, whose family generator builds its options from n ± 1 and
 *    n ± 2: it offers 6 on 24.8% of draws, 1 on 18.5% and 7 on 6.5%, none of
 *    which a 2-5 slot can key. Retrieval, uncertifying, and far under the half of
 *    draws at which `bb-answer-entropy-test` calls an option dead — but a rate
 *    nobody writes down is a rate nobody fixes. Recorded for the orchestrator.
 *
 * 5. **WHERE THE TRUTH WILL STAND IS SETTLED BEFORE THE WRONG NUMBERS ARE.** A
 *    five-value range does not spread its own ranks: nothing in 6–10 sits under a
 *    six or over a ten, so each of those counts has exactly one rank available; a
 *    seven has one number beneath it and a nine one above, so neither reaches the
 *    far end. Pull the wrong numerals first and the middle rank starves. So
 *    `RANK_WEIGHTS` fixes the rank first and spends the freedom the interior
 *    counts have to repay what the ends cannot give. The weights are solved, not
 *    tuned — the working sits beside the table — and the served rates are in the
 *    report. L43 is applied as the invariant it states rather than as the
 *    instance it was found in: no rank may be the answer's home, high, low or
 *    middle.
 *
 * 6. **NO NUMERAL CAN BE DRAWN, so the shape contrast is taught in words and by
 *    the grown-up's hand.** `lib/figures.ts` has no glyph primitive — the blocker
 *    L49 recorded against A3's mirrored 3 — so `script[2]` describes the two
 *    curls while the picture beside it shows the SETS they stand for, and the
 *    Day-5 teacher's-note strip gives the parent the tracing script. Every item
 *    in the week therefore poses the flip as picture → numeral, which is the
 *    direction the renderer can actually serve. Recorded for the orchestrator.
 *
 * 7. **Six thin local generators, and why each is not in the family.** `writeIt`
 *    (nothing in `lib/earlynumber.ts` asks a child to WRITE a numeral —
 *    `tenFrameBuild` draws counters, not marks), `numeralForSet` and
 *    `numeralForFrame` (the family's `howManyChoice` builds its options from ±1
 *    and ±2 of the drawn count, which at a floor of six offers 4 and 5 — values
 *    no draw of a 6–10 slot can ever key; and `tenFrameRead` returns a typed
 *    answer with no options at all), `puppetWrites` (disclosure 1), the three
 *    Day-4 story frames (the family has no counting story generator; its word
 *    problems join or take away, neither of which A4 has taught) and `writeAndSay`
 *    (the Day-5 oral half). Each keeps the family's contract to the letter: a
 *    templateId that resolves in the registry, a picture built by `lib/figures`
 *    out of the item's own values, every quantity rendered through `lib/format`,
 *    and `authorMeta` stamped for the preflight to read.
 *
 * 8. **TWO SENTENCES IN `isomorphNotes` ASSERTED THINGS NOTHING ENFORCED**, and
 *    a reader measured both. This is the L47/L52 shape and it is worth naming
 *    plainly: a claim a pack makes about itself is a gate only if something runs.
 *
 *    · "Nothing in Form B repeats a count-and-kind pair that Form A or a daily
 *      page has already printed" was FALSE IN 98.7% OF 300 PACKS, and in both
 *      judged seeds. The `{count, kind}` signature `freshCount` introduced is
 *      namespaced PER PICTURE — `a4:line|…`, `a4:heap|…`, `a4:frame|…` — for the
 *      reason recorded there, so a doorstep line of eight shells and a heap of
 *      eight shells were never in competition and the note read the guard as
 *      wider than it is. The certifying half is now enforced by `certifying`
 *      (0 of 4,000 Form-B pairs over 500 packs); the daily half is arithmetically
 *      out of reach and the note says so with the numbers, which is what A6 did
 *      at the same wall.
 *
 *    · "the truth is a six or a nine on 32.4% of the twelve mastery draws" was
 *      simply the wrong number: **39.0%** over 3,600 draws, which is close to the
 *      40% two counts in five would give and was never going to be 32.4%. The
 *      companion figure in the same sentence was right — the flip is on the page
 *      for 73.6% of those, re-measured at 73.9% — which is the tell: an estimate
 *      that was measured stood, and one beside it that was not, did not. Nothing
 *      about the content changed for this; the sentence did.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { drawFresh, makeChoices, numberWords } from '../shared';
import type { ItemDraft } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  howManyChoice,
  numeralTrap,
  pickExtreme,
  setForNumeral,
  tenFrameEmpty,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsParam, counters, iconFor, tenFrame } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Eight names, one drawn per item. Nothing below may hardcode one of them (kit §F.3). */
const NAMES = ['Kai', 'Nadia', 'Ezra', 'Freya', 'Tobi', 'Amara', 'Orla', 'Zuri'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/** The range every numeral in this week is written from. */
const LO = 6;
const HI = 10;
/** The frame's capacity — A2's manipulative, met here as a thing to LABEL. */
const FRAME = 10;

// ---------------------------------------------------------------------------
// TEN WORDS, COUNTED PER SENTENCE
//
// Two different rules are in play and only one of them is the gate. The family's
// own `ask()` refuses an eleven-WORD PROMPT, which lets a two-sentence prompt of
// nine words each through while catching a single long one; hint ladders it never
// sees at all. What actually blocks a week is `bb-readability-test`, and it holds
// every SENTENCE of every child-facing surface to the band's ceiling. `say()`
// below is that gate's splitter and its word counter, reimplemented, so a
// sentence this file cannot ship throws at import or at the first draw instead of
// surviving to a batch run.
//
// One surface is deliberately outside it: a figure's alt. That string is the
// picture for a child who cannot see the picture, and a length rule on it buys
// brevity by taking away the drawing.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A4: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** `[image: scene] question` — the bracket is the picture, spoken; only the question is read. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** A ladder: word-capped here, and free of names and numbers by how it is written. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Swap a library generator's ladder for one written here, without editing `lib/`.
 *
 * The budget came first and the days were laid out around it (kit §E "A-band
 * lessons", item 1). No ladder may appear more than twice across the fifteen
 * non-retrieval core items, and the local generators take their ladders as
 * parameters, so the only items still needing this wrapper are the two the week
 * serves straight from the library. Measured on the assembled pack: fifteen core
 * items carry fifteen distinct ladders, so the dedup has seven spare.
 *
 * There is a second reason beyond the budget, and it only shows up at corpus
 * scale: every Level-A week is built on the same eleven generators, so a week
 * that ships their stock hints ships the same advice as its twenty-three
 * neighbours. Nothing inside a pack can see that. The advice is also genuinely
 * different per picture — a line wants an end to start from, a heap wants a
 * route, a frame wants its first five.
 *
 * All of it happens inside the returned closure: no rng is consumed and the
 * prompt is not touched, so the surface QG-1 and the pack guard sign is the same
 * one the base generator produced.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * Tag a strictly-earlier week's item as this week's warm-up.
 *
 * Band A demands no minimum number of warm-up formats, so nothing forces these
 * four onto the page and each has to justify itself. A4 rests on three prior
 * cells and replays one a day: A3's numeral↔set matching over 0–5 (the very act
 * this week carries into 6–10), A1's compare-by-counting, A2's frame read
 * backwards for its gaps, and A1's tap-the-numeral round a small ring. BB-G8(b)
 * asks only whether a warm-up re-serves THIS week's target at THIS week's
 * difficulty; none of the four does, and the one that comes closest — A3's
 * matching — differs by the whole range the week exists to add.
 *
 * Their ladders stay as the library wrote them, and that is on purpose rather
 * than by exemption: a warm-up ought to sound like the week it came from.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// THE FRESHNESS CLAIM, ENFORCED ON THE HALF THAT CERTIFIES (disclosure 8)
// ===========================================================================

/**
 * Every (count, kind) pair a page actually PRINTS, read off its own params.
 *
 * Two shapes carry them here: a single drawn picture states one pair
 * (`{n, noun}`), and the numeral-to-set page states three, one per drawn group
 * (`{counts[], nouns[]}`). The six-nine trap, the empty-frame warm-up and the
 * puppet's `{n, slip}` print no kind and are simply not covered — which is the
 * honest scope, not a hole quietly left open.
 */
function printedPairs(draft: ItemDraft): string[] {
  const p = draft.generator?.params as Record<string, unknown> | undefined;
  if (!p) return [];
  const out: string[] = [];
  if (typeof p.n === 'number' && typeof p.noun === 'string') out.push(`${String(p.n)}|${p.noun}`);
  const counts: unknown = p.counts;
  const nouns: unknown = p.nouns;
  if (Array.isArray(counts) && Array.isArray(nouns)) {
    for (let i = 0; i < counts.length; i++) {
      const c: unknown = counts[i];
      const kind: unknown = nouns[i];
      if (typeof c === 'number' && typeof kind === 'string') out.push(`${String(c)}|${kind}`);
    }
  }
  return out;
}

/**
 * A mastery slot whose Form-B draw may not reprint a pair its Form-A draw did.
 *
 * WHY THIS SCOPE AND NOT THE WHOLE PACK — the arithmetic, because a scope chosen
 * without one is a preference. A pair is (a count from 6–10) × (one of the nine
 * drawable kinds) = 45 surfaces, and 30.0 of them are printed on the five days
 * and Form A before Form B draws its first page. Refusing every one of those
 * would leave Form B's eight pairs to be found in the fifteen cells that remain,
 * and the LAST slot to draw would face 82% of the space already spoken for — the
 * exact mechanism by which A1's mastery slot came to key "2" on 77% of its draws
 * (see `freshCount`). Form A alone is eight pairs, so refusing those costs an 18%
 * rejection and leaves every count with free kinds. That is a guarantee that can
 * be paid for.
 *
 * It is also the guarantee worth having: Form B is the corrective form, so what
 * a child must not meet on it is the surface they have just failed. A repeat off
 * a DAILY page is a different picture on a different day under a different
 * question, and its rate is written down in `isomorphNotes` rather than claimed
 * away.
 *
 * Form A is untouched — it draws once and registers what it printed, so every
 * Form A page in the corpus is exactly what it was. Form B redraws, bounded at
 * twelve tries and deterministic, never a loop that runs until it succeeds (L19).
 * Idempotent under the assembler's own Form-B core-collision rebuild: the first
 * entry for a slot is Form A and every later entry is Form B.
 */
function certifying(base: ItemGen, slot: number): ItemGen {
  const mine = `a4:mform|${String(slot)}`;
  return (rng, guard, difficulty) => {
    if (!guard.taken(mine)) {
      guard.add(mine);
      const draft = base(rng, guard, difficulty);
      for (const q of printedPairs(draft)) guard.add(`a4:formA|${q}`);
      return draft;
    }
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 12 && printedPairs(draft).some((q) => guard.taken(`a4:formA|${q}`)); k++) {
      draft = base(rng, guard, difficulty);
    }
    return draft;
  };
}

// ===========================================================================
// The one fact this week is built on
// ===========================================================================

/**
 * THE 6/9 PAIR — the only two numerals in this week's range that are one shape
 * turned round, and the only value in this file that no registry transform pins
 * (header disclosure 1).
 *
 * It is a claim about the GEOMETRY of two printed marks, so the invariant below
 * is what stands in for a `verifyFor`: the table must be an involution, must
 * never map a numeral to itself, and both sides must live inside the week's own
 * range so a flip is always a value some draw of the same slot really keys. If
 * any of that ever stops being true the module refuses to load, at every seed,
 * rather than quietly offering a number no page can justify.
 */
const FLIP: Record<number, number> = { 6: 9, 9: 6 };

for (const [key, value] of Object.entries(FLIP)) {
  const n = Number(key);
  if (FLIP[value] !== n) throw new Error(`A4 FLIP: ${key} → ${String(value)} does not turn back`);
  if (value === n) throw new Error(`A4 FLIP: ${key} maps to itself, so the trap has no second option`);
  for (const v of [n, value]) {
    if (v < LO || v > HI) throw new Error(`A4 FLIP: ${String(v)} sits outside ${String(LO)}-${String(HI)}`);
  }
}

/**
 * WHICH RANK THE TRUTH TAKES, PER DRAWN COUNT — arithmetic, not taste (L43).
 *
 * Every numeral on a page must be a count this week can key, so the whole option
 * set lives in 6–10 — and the range then constrains where the truth may stand. A
 * six has no smaller neighbour inside it and a ten no larger one, so each is
 * pinned to one end. A seven has a single count beneath it, so it can never be
 * the highest of three; a nine has a single count above it, so it can never be
 * the lowest. Eight alone is unconstrained.
 *
 * Solving with `n` uniform over the five counts: the low share is (1 + a + b)/5
 * and the high share (1 + c + d)/5, where a, b, c and d are the freedoms of
 * seven, eight, nine and eight again. Setting both to a third gives
 * a + b = c + d = 2/3, which thirds satisfy — hence the rows below, denominated
 * in three. A zero is a rank that count physically cannot occupy, and the loop
 * after the table checks every non-zero cell against the real menus instead of
 * believing this paragraph.
 */
const RANK_WEIGHTS: Record<number, readonly [number, number, number]> = {
  6: [3, 0, 0],
  7: [1, 2, 0],
  8: [1, 1, 1],
  9: [0, 2, 1],
  10: [0, 0, 3],
};

/** Every count below `n` this week's slots can key. */
function belowOf(n: number): number[] {
  const out: number[] = [];
  for (let v = LO; v < n; v++) out.push(v);
  return out;
}
/** Every count above `n` this week's slots can key. */
function aboveOf(n: number): number[] {
  const out: number[] = [];
  for (let v = n + 1; v <= HI; v++) out.push(v);
  return out;
}

for (const [key, weights] of Object.entries(RANK_WEIGHTS)) {
  const n = Number(key);
  if (weights[0] + weights[1] + weights[2] !== 3) {
    throw new Error(`A4 RANK_WEIGHTS: the weights for ${key} do not sum to three`);
  }
  const below = belowOf(n).length;
  const above = aboveOf(n).length;
  const room = [above >= 2, below >= 1 && above >= 1, below >= 2];
  weights.forEach((w, rank) => {
    if (w > 0 && !room[rank]) {
      throw new Error(`A4 RANK_WEIGHTS: a count of ${key} cannot sit at rank ${String(rank + 1)} of three`);
    }
  });
}
if (Object.keys(RANK_WEIGHTS).length !== HI - LO + 1) {
  throw new Error('A4 RANK_WEIGHTS: every count in the range needs a row');
}

// ===========================================================================
// What a wrong numeral MEANS, said in its own picture's terms
// ===========================================================================

/**
 * Teacher-facing rationales — the child only ever sees a numeral — so these are
 * not word-capped. `over(k)` is a count that ran k past the last thing, `under(k)`
 * is a count that stopped k short, and `box` is the frame's own capacity written
 * down instead of its contents. The FLIP rationale is shared, because it is about
 * the mark rather than about the picture.
 */
interface Voice {
  over: (k: number) => string;
  under: (k: number) => string;
  /** Only a frame has a capacity to write down instead of a count. */
  box?: string;
}

/**
 * HOW BIG THE SLIP WAS, SPELLED OUT — and the reason it is a function rather
 * than a ternary is a defect READING the generated week found and no gate did.
 *
 * The first version wrote `k === 1 ? 'One' : 'Two'`, which is true while the
 * options are the truth's immediate neighbours and false the moment the rank
 * deal reaches further: a truth of six offered against ten had "10" explained as
 * "Two too many" when ten is FOUR too many, and a truth of seven offered against
 * ten said the same. The rationale is what a grown-up reads to a child who got
 * it wrong, so a rationale that miscounts the miscount is worse than none. `k`
 * runs 1 to 4 across this range, and the word now comes from the number.
 */
function slipSize(k: number): string {
  const word = numberWords(k);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * A MECHANISM IS ONLY HONEST WHILE THE SLIP IS SMALL — the second thing reading
 * the generated week caught.
 *
 * The rank deal can put a wrong numeral four away from the truth (a six offered
 * against a ten), and the per-picture mechanisms do not survive that: "the second
 * row was begun before the first ran out, so four went into the count twice" is
 * not a thing a child does, and a rationale a teacher cannot believe is worse
 * than a plain one. So each voice states its mechanism for a slip of one or two
 * and falls back to the honest general account past that.
 */
function slip(k: number, over: boolean, near: string, far: string): string {
  return `${slipSize(k)} too ${over ? 'many' : 'few'} - ${k <= 2 ? near : far}`;
}
/** "one" / "three" — the size of a slip in words, never a bare digit. */
const nWord = (k: number): string => numberWords(k);

const FLIP_RATIONALE =
  'Six and nine are one curl turned round, so the count was held correctly and the mark went down the wrong way up.';

/** A line hands the child an order for free; the slip is stepping out of it. */
const LINE_VOICE: Voice = {
  over: (k) =>
    slip(k, true,
      `the count ran ${nWord(k)} past the end of the line, and the number it stopped on is the number that got written.`,
      'the count came adrift along the line and finished well past the last one.'),
  under: (k) =>
    slip(k, false,
      `the last ${nWord(k)} in the line never got a number, so a short number reached the paper.`,
      'the line was abandoned well before its end, and that early number is the one written down.'),
};

/** A heap hands nothing over: a thing can be met twice, or missed altogether. */
const HEAP_VOICE: Voice = {
  over: (k) =>
    slip(k, true,
      `the heap kept no order, so ${nWord(k)} came round a second time before the mark was made.`,
      'the heap was counted with no route through it, so several things were met more than once.'),
  under: (k) =>
    slip(k, false,
      `only the top of the heap was read, and ${nWord(k)} underneath reached neither the count nor the paper.`,
      'only the top of the heap was read, and what lay under it was never reached at all.'),
};

/** A ring has no ends, so the danger is not the order but where the circle began. */
const RING_VOICE: Voice = {
  over: (k) =>
    slip(k, true,
      `the circle was carried past the one it began on, so ${nWord(k)} got a second number.`,
      'the starting one was never marked, so the circle went round again before it stopped.'),
  under: (k) =>
    slip(k, false,
      `the starting one was forgotten and the circle closed ${nWord(k)} early.`,
      'the circle closed long before it came back to where it began.'),
};

/** Two rows in a box: the danger is the jump from the end of one row to the next. */
const BOX_VOICE: Voice = {
  over: (k) =>
    slip(k, true,
      `the second row was begun before the first had run out, so ${nWord(k)} went into the count twice.`,
      'the two rows were counted across each other, so the overlap was counted twice over.'),
  under: (k) =>
    slip(k, false,
      `the jump from the end of one row to the start of the next stepped over ${nWord(k)}.`,
      'the count changed rows early and left the rest of the first row unnamed.'),
};

/** The frame: five is read at a glance, and the slip lives among the loose ones. */
const FRAME_VOICE: Voice = {
  over: (k) =>
    slip(k, true,
      `the full row was taken as five and the loose counters below it were then carried ${nWord(k)} too far.`,
      'the frame was read as fuller than it is, with the empty boxes counted in as well.'),
  under: (k) =>
    slip(k, false,
      `the count carried on from the full row but stopped ${nWord(k)} short of the last one.`,
      'the count stopped at or near the full row and never took in the loose counters below it.'),
  box: "The frame's own ten written down - a full box and a part-filled box are the same box, and only one of them holds ten.",
};

// ===========================================================================
// The shared option builder — three numerals, all of them keyable
// ===========================================================================

/**
 * Pull `k` values out of one side's menu, giving the flip a fair chance of the
 * place when it is available there.
 *
 * Both draws happen on every call whether or not a flip exists, so the number of
 * rng draws this consumes is a function of the pool alone — no branch of it can
 * shift a later item in the pack (L19). Bounded, and no loop redraws anything.
 */
function pullFrom(r: Rng, n: number, pool: number[], k: number): number[] {
  const shuffled = r.shuffle([...pool]);
  const wantFlip = r.int(0, 1) === 1;
  const f = FLIP[n];
  if (wantFlip && f !== undefined && pool.includes(f)) {
    return [f, ...shuffled.filter((v) => v !== f)].slice(0, k);
  }
  return shuffled.slice(0, k);
}

/**
 * Fit a picture-to-numeral item with the three numbers a band-A page needs.
 *
 * WHICH numbers appear is decided by the draw, never authored: the rank the truth
 * will take is dealt first from `RANK_WEIGHTS`, then the wrong numerals are pulled
 * from the side that rank requires — so the truth lands lowest, middle and highest
 * in turn instead of sitting where the arithmetic of the range would park it.
 *
 * WHY EVERY OPTION IS KEYABLE. All three numerals come out of the same 6–10 the
 * picture was drawn from, so each is what some other draw of this very slot keys.
 * Nothing on the page can be eliminated without looking at the drawing, which is
 * why this week declares no lure: it has none to declare.
 *
 * WHAT EACH WRONG NUMBER MEANS is read off the VALUE, never off the branch that
 * produced it, so a rationale cannot drift from the number it explains — and the
 * flip is recognised by the table rather than by the branch, so it carries its own
 * meaning wherever the deal happens to place it.
 */
function numeralChoices(
  r: Rng,
  n: number,
  voice: Voice,
): { choices: ReturnType<typeof makeChoices>['choices']; correctKey: string; rank: number } {
  if (!Number.isInteger(n) || n < LO || n > HI) {
    throw new Error(`A4 numeralChoices: a count of ${String(n)} falls outside ${String(LO)}-${String(HI)}`);
  }
  const weights = RANK_WEIGHTS[n];
  const t = r.int(0, 2);
  const rank = t < weights[0] ? 0 : t < weights[0] + weights[1] ? 1 : 2;
  const below = belowOf(n);
  const above = aboveOf(n);
  const values =
    rank === 0
      ? pullFrom(r, n, above, 2)
      : rank === 2
        ? pullFrom(r, n, below, 2)
        : [...pullFrom(r, n, below, 1), ...pullFrom(r, n, above, 1)];

  const whyWrong = (v: number): { text: string; errorTag: ErrorTag; rationale: string } => {
    if (FLIP[n] === v) {
      return { text: String(v), errorTag: 'concept-misconception', rationale: FLIP_RATIONALE };
    }
    if (voice.box !== undefined && v === FRAME) {
      return { text: String(v), errorTag: 'representation-misread', rationale: voice.box };
    }
    return v > n
      ? { text: String(v), errorTag: 'procedure-slip', rationale: voice.over(v - n) }
      : { text: String(v), errorTag: 'procedure-slip', rationale: voice.under(n - v) };
  };

  const { choices, correctKey } = makeChoices(r, String(n), values.map(whyWrong));

  // Dealt rank and printed rank must agree, or the deal proved nothing.
  const shown = [n, ...values].sort((a, b) => a - b);
  if (shown.indexOf(n) !== rank || new Set(shown).size !== 3) {
    throw new Error(
      `A4 numeralChoices: dealt rank ${String(rank + 1)} but ${String(n)} came out at rank ${String(shown.indexOf(n) + 1)} of ${shown.join('/')}`,
    );
  }
  return { choices, correctKey, rank };
}

// ===========================================================================
// Drawing the picture's own values, signed on {count, kind}
// ===========================================================================

/**
 * A ONE-TOKEN PROMPT SIGNS AS `<type>|1tok|<n>`, AND FIVE COUNTS DO NOT GO ROUND
 * SEVEN SLOTS (kit §E "A-band lessons", item 5).
 *
 * Every page in this week states one number, so `drawUniqueItem`'s namespace for
 * a slot holds exactly the five counts 6–10 — and the numeral slots want eight
 * draws between the days and the two mastery forms. Past the fifth the guard is
 * exhausted, the last draw is accepted whatever it is, and the slot that draws
 * last is left holding whichever count the others did not want. That is precisely
 * how A1's mastery slot came to key "2" on 77% of draws.
 *
 * So the surface is signed on `{count, kind}` instead, which is 5 × 9 = 45
 * surfaces per slot family rather than 5, and the served marginal stays flat. The
 * signature is namespaced per slot family so Form A and Form B of the SAME slot
 * are still forced apart, which is what `bb-verify-packs` asserts.
 */
function freshCount(rng: Rng, guard: { taken: (s: string) => boolean; add: (s: string) => void }, tag: string) {
  return drawFresh(
    rng,
    guard as never,
    (r: Rng) => ({ n: r.int(LO, HI), noun: r.pick(COUNTABLE_NOUNS) }),
    (v) => `a4:${tag}|${String(v.n)}|${v.noun}`,
  );
}

/**
 * THE NAMESPACE IS THE PICTURE, NOT THE SLOT — found by reading the generated
 * week rather than by a gate.
 *
 * Namespacing per SLOT lets two slots that draw the same shape print the same
 * page: a Day-1 row of eight shells and a Day-4 doorstep of eight shells are the
 * same drawing with a different sentence over it, and a child meets both in one
 * week. So every item that draws the same KIND of picture shares one namespace —
 * lines, heaps, packed rows, rings, frames — and `{count, kind}` cannot repeat
 * inside a pack whichever slot asks for it. Form A and Form B of one mastery slot
 * are still forced apart, because they always share a picture.
 */
const PICTURE_TAG: Record<string, string> = {
  'in a row': 'line',
  'in two rows': 'rows',
  scattered: 'heap',
  'in a ring': 'ring',
};

/** "in two rows" said as a layout rather than as a count (a NUMBER WORD IS A NUMBER). */
const ARRANGEMENT_ALT: Record<string, string> = {
  'in two rows': 'in a row above another row',
};
function looksLike(noun: string, arrangement: string): string {
  return `some ${noun} ${ARRANGEMENT_ALT[arrangement] ?? arrangement}`;
}

// ===========================================================================
// Local generator 1 — trace, then WRITE (the week's anchor act)
// ===========================================================================

/**
 * The child counts the picture and writes the numeral with a finger.
 *
 * `manual-review` is the honest validation and it is also the right INPUT: at
 * band A `AnswerEntry` renders a manual-review item as one oversized "I did it!"
 * acknowledgement, so a four-year-old is never shown a keyboard and the writing
 * happens on paper, where a numeral can actually be traced. The truth is still
 * code-computed — it is the drawn `n`, recomputed by `a_count_v1` / `a_frame_read_v1`
 * — so the grown-up marking it has the number in front of them.
 *
 * The figure asserts the answer it is drawn from, which is legitimate here
 * because the item does not ask the child to CHOOSE the count: it asks them to
 * make the mark. Nothing on the page hands over the shape of the numeral, and the
 * shape is the new work.
 */
function writeIt(kind: 'line' | 'frame'): ItemGen {
  return (rng, guard, difficulty) => {
    const { n, noun } = freshCount(rng, guard, kind === 'frame' ? 'frame' : 'line');
    if (kind === 'frame') {
      const scene = `a frame holding ${countNoun(n, noun)}`;
      const draft: ItemDraft = {
        type: 'drawing',
        prompt: scenePrompt(scene, 'Read the frame. Write that number.'),
        // ASKS: the numeral for what the frame holds. The frame is named as the
        // manipulative — a structural fact a child SEES, and this band's own
        // vocabulary — while what sits in it stays for the child to count.
        figure: tenFrame(n, {
          size: FRAME,
          icon: iconFor(noun),
          alt: `a ten-frame with some ${noun} in it`,
          asserts: assertsAnswer,
        }),
        answer: {
          value: String(n),
          acceptableForms: [numberWords(n), `${countNoun(n, noun)} written`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_read_v1', params: { n, noun }, seed: rng.uint() },
        hintLadder: hints('Five are already sitting in the top row.', 'Trace the mark in the air before the paper.'),
        errorTags: ['procedure-slip', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'write-numeral' },
      };
      return draft;
    }
    const scene = `${countNoun(n, noun)} in a row`;
    const draft: ItemDraft = {
      type: 'drawing',
      prompt: scenePrompt(scene, `Count the ${noun}. Write that number.`),
      // ASKS: the numeral for the row. So the alt names the layout and the kind,
      // and never the count (L48 — at band A the alt is SPOKEN first).
      figure: counters(n, noun, {
        arrangement: 'in a row',
        alt: looksLike(noun, 'in a row'),
        asserts: assertsAnswer,
      }),
      answer: {
        value: String(n),
        acceptableForms: [numberWords(n), `${countNoun(n, noun)} written`],
        validation: 'manual-review',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_count_v1', params: { n, noun, arrangement: 'in a row' }, seed: rng.uint() },
      hintLadder: hints('Touch each one and stop at the last.', 'Hold that number while your finger writes it.'),
      errorTags: ['procedure-slip', 'representation-misread'],
      authorMeta: { stepCount: 1, cognitiveOp: 'write-numeral' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 2 — set → numeral, with the flip live (CERTIFIES)
// ===========================================================================

/**
 * The recipe's "write-from-count", in the answer mode a pre-reader can actually
 * use. The picture is drawn, and the child taps the numeral they would write.
 *
 * WHY NOT `howManyChoice`. The family generator builds its options from n ± 1 and
 * n ± 2, so on a slot whose floor is six it offers 4 and 5 — numbers no draw of
 * this range can ever key, which is the dead option §E2.11 forbids and the one
 * this week can most easily avoid. Every option here is a count from 6–10.
 *
 * Registered on `a_numeral_for_set_v1`, whose `verifyFor` recomputes the truth
 * from the same `n` the picture is built from, so QG-11 proves the keyed option
 * is the number the drawing actually holds.
 */
function numeralForSet(arrangement: string, voice: Voice, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const { n, noun } = freshCount(rng, guard, PICTURE_TAG[arrangement]);
    const { choices, correctKey } = numeralChoices(rng, n, voice);
    const scene = `${countNoun(n, noun)} ${arrangement}`;
    const draft: ItemDraft = {
      type: 'representation',
      prompt: scenePrompt(scene, 'Which number would you write?'),
      figure: counters(n, noun, {
        arrangement,
        alt: looksLike(noun, arrangement),
        asserts: assertsParam('n'),
      }),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun, arrangement }, seed: rng.uint() },
      hintLadder: ladder,
      errorTags: ['representation-misread', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: 'numeral-for-set' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 3 — frame → numeral (CERTIFIES)
// ===========================================================================

/**
 * The recipe's second core form: the ten-frame, read and then LABELLED.
 *
 * The frame is where "ten needs two marks" lives, so the frame's own capacity is
 * offered as a live option — and it is live rather than a lure: the slot really
 * draws ten on a fifth of its pages, so a child who taps it out of habit is right
 * about as often as a guess and a child who learns to strike it out is wrong just
 * as often. Both facts are measured and reported.
 */
function numeralForFrame(ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => {
    const { n, noun } = freshCount(rng, guard, 'frame');
    const { choices, correctKey } = numeralChoices(rng, n, FRAME_VOICE);
    const scene = `a frame holding ${countNoun(n, noun)}`;
    const draft: ItemDraft = {
      type: 'computation',
      prompt: scenePrompt(scene, 'Which number does the frame show?'),
      figure: tenFrame(n, {
        size: FRAME,
        icon: iconFor(noun),
        alt: `a ten-frame with some ${noun} in it`,
        asserts: assertsParam('n'),
      }),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun }, seed: rng.uint() },
      hintLadder: ladder,
      errorTags: ['representation-misread', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'numeral-for-frame' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 4 — help the puppet (the derivable slip, disclosure 1)
// ===========================================================================

/**
 * A NAMED puppet counted the frame and wrote down a number that lost its place
 * on the way to the paper. The word "wrong" never appears; the child fixes it by
 * tapping; and the number the puppet wrote is RECOMPUTED by the registered
 * `a_verify_count_slip_v1`, which QG-11 then requires the prompt to show. Nothing
 * about the slip is authored.
 *
 * The slip is drawn BEFORE the count, so the puppet's number always lands inside
 * 6–10 and can never be a value the slot cannot key: a skip lands one below, so
 * the count starts at seven; a double lands one above, so it stops at nine.
 *
 * WHICH SIDE THE THIRD NUMBER TAKES IS WEIGHTED, not halved. Left even, the
 * puppet's number would be the flanking option two draws in three and the truth
 * would sit in the middle half the time; a third of the draws putting the third
 * number OPPOSITE the puppet balances the three ranks. Both the availability
 * steps are deterministic (a strip that has no room on one side takes the other),
 * never a redraw loop.
 *
 * This page TEACHES on Day 3 and does not certify, and the reason is measured:
 * the prompt names the puppet's number, so "tap one of the other two" is worth
 * half a page against a third for a guess. That is the shape of every
 * error-analysis item in the family, it is worth having, and it is not worth
 * promoting a child on.
 */
function puppetWrites(): ItemGen {
  return (rng, guard, difficulty) => {
    const drawn = drawFresh(
      rng,
      guard as never,
      (r: Rng) => {
        const skip = r.int(0, 1) === 1;
        const n = skip ? r.int(LO + 1, HI) : r.int(LO, HI - 1);
        return { skip, n, noun: r.pick(COUNTABLE_NOUNS), puppet: r.pick(PUPPETS) };
      },
      (v) => `a4:frame|${String(v.n)}|${v.noun}`,
    );
    const { skip, n, noun, puppet } = drawn;
    const slip = skip ? 'skip-count' : 'double-count';
    const wrote = skip ? n - 1 : n + 1;

    // The third number sits opposite the puppet's on a third of draws and beside
    // it on the rest, so the truth lands lowest, middle and highest in turn.
    const opposite = rng.int(0, 2) === 0;
    const sameSide = skip ? n - 2 : n + 2;
    const otherSide = skip ? n + 1 : n - 1;
    const inRange = (v: number) => v >= LO && v <= HI;
    // At each end of the range one of the two sides has no countable number left,
    // so the deal steps to the other one. Deterministic; never a redraw.
    const third = opposite
      ? inRange(otherSide)
        ? otherSide
        : sameSide
      : inRange(sameSide)
        ? sameSide
        : otherSide;
    if (!inRange(third) || third === n || third === wrote) {
      throw new Error(`A4 puppetWrites: a third option of ${String(third)} is not a countable, distinct number`);
    }

    // No FLIP branch here, and that is arithmetic rather than an omission: every
    // option on this page sits within two of the truth, and the flip is three
    // away, so it cannot arise. The flip is carried by the slots that CAN offer
    // it — see `numeralChoices`.
    const meaning = (v: number): { text: string; errorTag: ErrorTag; rationale: string } => {
      const k = Math.abs(v - n);
      return v > n
        ? { text: String(v), errorTag: 'procedure-slip', rationale: FRAME_VOICE.over(k) }
        : { text: String(v), errorTag: 'procedure-slip', rationale: FRAME_VOICE.under(k) };
    };
    const { choices, correctKey } = makeChoices(rng, String(n), [meaning(wrote), meaning(third)]);

    const scene = `a frame holding ${countNoun(n, noun)}`;
    const draft: ItemDraft = {
      type: 'error-analysis',
      // The puppet's number is stated on purpose — that is the form — and it is
      // the value `a_verify_count_slip_v1` recomputes, so QG-11 checks it.
      prompt: scenePrompt(scene, `${puppet} counted these and wrote ${String(wrote)}. Which number is right?`),
      figure: tenFrame(n, {
        size: FRAME,
        icon: iconFor(noun),
        alt: `a ten-frame with some ${noun} in it`,
        asserts: assertsParam('n'),
      }),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      generator: { templateId: 'a_verify_count_slip_v1', params: { n, slip }, seed: rng.uint() },
      hintLadder: hints('Count it again with the puppet, slowly.', 'Watch the very last one in the frame.'),
      errorTags: ['procedure-slip', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 5 — the Day-4 real-world picture problems
// ===========================================================================

/**
 * Three real-world pages, each of them ending in a numeral.
 *
 * The multi-step row is off at this band, and that is not a concession: a
 * single-step picture inside a real situation IS the band-A word problem, and a
 * two-step version would be another age's item wearing this one's clothes. No
 * family generator serves it either — the only story forms in `lib/earlynumber.ts`
 * join or take away, and A4 has taught neither — so the frames are built here.
 *
 * THE COUNTS ARE SHOWN AND NEVER SAID (L48, and the `countOneKind` pattern in
 * a01). The sentence names the KIND and the place, never the quantity; the
 * `[image: …]` bracket keeps the count, because that is the numeric token QG-1
 * and the pack guard sign the page with and emptying it would un-guard the item;
 * and the figure alt — the string `speakablePrompt` actually reads aloud —
 * carries no number at all.
 */
interface StoryFrame {
  /** The story sentence: kinds and places, never counts. */
  line: (name: string, noun: string) => string;
  /** The question, which is where each frame's own writing act is named. */
  ask: string;
  /** What the `[image: …]` bracket says — counts kept, for the guard. */
  scene: (n: number, noun: string) => string;
  /** The SPOKEN description: layout and kind only. */
  alt: (noun: string) => string;
  arrangement: string;
  voice: Voice;
  ladder: string[];
}

// SCANNED AGAINST THE WHOLE WEEKS DIRECTORY AT THE END, NOT THE START (§E2.8).
// A shelf, a basket, a picnic rug, a garden path, a mat, a ledge, a tray, a jar,
// a crate and a bench are all claimed by weeks written before or beside this one,
// and a repeated real-world frame across two weeks is the corpus's documented
// weakness (L24) that no per-pack gate can see. A doorstep, a tree stump and a
// box lid are unclaimed, and each holds things in a different shape: a line, a
// heap, and two packed rows.
const STORY_FRAMES: Record<'doorstep' | 'stump' | 'lid', StoryFrame> = {
  doorstep: {
    line: (name, noun) => `${name} puts some ${unitFor(2, noun)} out on the doorstep.`,
    ask: 'Which number says how many?',
    scene: (n, noun) => `${countNoun(n, noun)} standing in a line on a doorstep`,
    alt: (noun) => `some ${noun} standing in a line on a doorstep`,
    arrangement: 'in a row',
    voice: LINE_VOICE,
    ladder: ['Work from the far end back towards you.', 'Whatever you say at the end is it.'],
  },
  stump: {
    line: (name, noun) => `${name} spreads some ${unitFor(2, noun)} over a tree stump.`,
    ask: 'Which number says how many?',
    scene: (n, noun) => `${countNoun(n, noun)} dotted over a tree stump`,
    alt: (noun) => `some ${noun} dotted over a tree stump`,
    arrangement: 'scattered',
    voice: HEAP_VOICE,
    ladder: ['A heap has no order. Make your own.', 'Move each one away after you name it.'],
  },
  lid: {
    line: (name, noun) => `${name} fills a box with some ${unitFor(2, noun)}.`,
    ask: 'Which number goes on the lid?',
    scene: (n, noun) => `${countNoun(n, noun)} sitting in two rows inside a box`,
    alt: (noun) => `some ${noun} sitting in a row above another row`,
    arrangement: 'in two rows',
    voice: BOX_VOICE,
    ladder: ['Finish the top row before you drop down.', 'Do not go back to the top row again.'],
  },
};

function numberStory(which: 'doorstep' | 'stump' | 'lid'): ItemGen {
  const frame = STORY_FRAMES[which];
  return (rng, guard, difficulty) => {
    const { n, noun } = freshCount(rng, guard, PICTURE_TAG[frame.arrangement]);
    const name = one(rng);
    const { choices, correctKey } = numeralChoices(rng, n, frame.voice);
    const draft: ItemDraft = {
      type: 'word-problem',
      // The QUESTION never agrees the noun with the drawn count: `unitFor(n, …)`
      // would narrow the picture to one object before the child has looked.
      prompt: scenePrompt(frame.scene(n, noun), `${frame.line(name, noun)} ${frame.ask}`),
      figure: counters(n, noun, {
        arrangement: frame.arrangement,
        alt: frame.alt(noun),
        asserts: assertsParam('n'),
      }),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: {
        templateId: 'a_numeral_for_set_v1',
        params: { n, noun, arrangement: frame.arrangement, place: which },
        seed: rng.uint(),
      },
      hintLadder: hints(...frame.ladder),
      errorTags: ['task-comprehension', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: 'number-story', situationType: 'part-whole' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 6 — Day-5: write it, then say how it goes
// ===========================================================================

/**
 * The oral half of the A4 Day-5 signature. The child counts a loose heap, writes
 * the numeral and TELLS a grown-up how the mark is made — which way it starts,
 * which way it turns — because that telling is the only place a reversal can be
 * caught before it becomes a habit.
 *
 * The heap and the numeral are both code-derived. The DESCRIPTION is not
 * computable and no template here pretends otherwise, so the item validates
 * `manual-review`: an open task keeps an open answer. This is also the week's one
 * justification-demanding non-computational page, which is what the strand
 * coupling check looks for.
 */
function writeAndSay(): ItemGen {
  return (rng, guard, difficulty) => {
    const { n, noun } = freshCount(rng, guard, 'heap');
    const scene = `${countNoun(n, noun)} in a loose heap`;
    const draft: ItemDraft = {
      type: 'reasoning',
      prompt: scenePrompt(scene, 'Write this number. Then tell how it goes.'),
      figure: counters(n, noun, {
        arrangement: 'scattered',
        alt: `some ${noun} in a loose heap`,
        asserts: assertsAnswer,
      }),
      answer: {
        value: String(n),
        acceptableForms: [numberWords(n), `${countNoun(n, noun)} written`],
        validation: 'manual-review',
      },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      generator: { templateId: 'a_count_v1', params: { n, noun, arrangement: 'scattered' }, seed: rng.uint() },
      hintLadder: hints('Say each number aloud as your finger moves.', 'Where does your mark start? Which way next?'),
      errorTags: ['task-comprehension', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'write-and-say' },
    };
    return draft;
  };
}

// ===========================================================================
// The generators, bound to A4's range and given this week's voice
// ===========================================================================

const writeRow = writeIt('line');
const writeFrame = writeIt('frame');

const setRow = numeralForSet(
  'in a row',
  LINE_VOICE,
  hints('Pick an end. Move steadily to the other.', 'Now find the mark that says that number.'),
);
const setTwoRows = numeralForSet(
  'in two rows',
  BOX_VOICE,
  hints('Sweep the upper row from left to right.', 'Then drop down. Never climb back up.'),
);
const setScattered = numeralForSet(
  'scattered',
  HEAP_VOICE,
  hints('Choose a route through the heap and keep it.', 'Two of these marks are the same curl.'),
);
const setRing = numeralForSet(
  'in a ring',
  RING_VOICE,
  hints('Pick a starting one and remember it.', 'Stop when you get back to that one.'),
);

/** The anchor read, met on Day 1 and again on Day 5 — and the slot that certifies it. */
const frameRead = numeralForFrame(
  hints('The first row is a five you already know.', 'Add the loose ones underneath, one at a time.'),
);
/** The same read on Day 2, where the box itself starts arguing for its own ten. */
const frameReadAgain = numeralForFrame(
  hints('A box does not shrink when it empties.', 'Count what is there, not what fits.'),
);

/**
 * The recipe's discrimination, straight from the family. Two options, once a
 * pack, on a teaching day — the arithmetic for both decisions is in header
 * disclosures 2 and 3.
 */
const sixNineTrap = withHints(
  numeralTrap({ trap: 'six-nine' }),
  hints('Do the counting first. The marks can wait.', 'One curl loops low. One loops high.'),
);

const puppetSlipItem = puppetWrites();
const storyDoorstep = numberStory('doorstep');
const storyStump = numberStory('stump');
const storyLid = numberStory('lid');

/** The other direction: a number is spoken aloud and the child hunts its group. */
const whichGroupShows = withHints(
  setForNumeral({ min: LO, max: HI, groups: 3 }),
  hints('Keep your number safe while you count.', 'Stop as soon as a group lands on it.'),
);

const day5Write = writeAndSay();

// --- the four warm-ups, one format and one source week each ----------------
const warmMatchSmall = warmUp(setForNumeral({ min: 1, max: 5, groups: 3 }), 3);
const warmMost = warmUp(pickExtreme({ which: 'biggest', min: 2, max: 5 }), 1);
const warmGaps = warmUp(tenFrameEmpty({ min: LO, max: HI - 1, size: FRAME }), 2);
const warmTapSmall = warmUp(howManyChoice({ min: 2, max: 5, arrangement: 'in a ring' }), 1);

// ===========================================================================
// The week
// ===========================================================================

export const buildA04 = makeWeekBuilder({
  level: 'A',
  week: 4,
  conceptId: 'writing-numbers-6-10',
  conceptName: 'Writing numbers 6–10',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 2 },
    { level: 'A', week: 3 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'tracing the shape before writing it',
  // Band A replaces the §6.1 multi-step row with the pictorial-per-day rule, so
  // this selector is inert here; it is declared because the kit asks every
  // non-D blueprint to name its family, and writing a numeral is a
  // representation skill rather than an operation.
  conceptFamily: 'place-value',
  deepeningDelta:
    'A2 counted 6 to 10 and stopped at the number the child SAID; A3 wrote 0 to 5, a range in which every numeral is a different shape and every count can be taken in at a glance. A4 joins the two and is harder than either. What is INHERITED is the act (count, then make the mark) and the range (6 to 10). What is NEW is that the mark now has to survive past five: the count needs the ten-frame to hold its place, and the numeral needs a shape the hand can find. What makes it HARDER is the two places the join breaks, neither of which exists below six. Six and nine are one curl turned round, so a numeral drawn perfectly can still say the wrong number - the only such pair in the range, and the reason this week has a discrimination at all. And ten is the first number a child writes with two marks, so one count no longer maps to one symbol. A3 asked "can you make this shape?"; A4 asks "is it the shape you meant, and is it facing the right way?".',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Prompts are spoken, not read; one question fills a page; targets are finger-sized. Writing happens on paper, not on the screen: keep a chunky pencil and a sheet beside the tablet, and let the child trace each numeral in the air, then on your palm, then on the page. Say the shape out loud while they draw it - the words are what they will remember when the hand forgets. Reversals are normal at this age and are a hand problem, not a number problem; mark the starting dot rather than correcting the finished mark. Mascot present.',
  },
  explanation: {
    hook: say(
      'A number can be said. A number can also be written. Written, it is a shape you draw. Some shapes are twins. Look closely!',
    ),
    whyBeforeHow: say(
      'A numeral is a mark that stands for a number. We learn it by tracing the shape before writing it. That helps because the hand remembers its own path. Six loops low, down at the bottom. Nine loops high, then drops. Same curl, turned round. So we always check which way it faces.',
    ),
    script: [
      {
        say: say('Here are six shells. Count them with me. Six!'),
        visual: 'Six shells in a line, with one finger on the first.',
        figure: counters(6, 'shells', { arrangement: 'in a row', alt: 'six shells in a row' }),
      },
      {
        say: say('Now nine shells. Begin at five. Seven, eight, nine.'),
        visual: 'Nine shells in a line, with the first five already behind us.',
        figure: counters(9, 'shells', { arrangement: 'in a row', alt: 'nine shells in a row' }),
      },
      {
        // The recipe's discrimination, TAUGHT where the answer is already on the
        // page. No primitive draws a numeral (header disclosure 6), so the two
        // marks are described while the picture holds the sets they stand for.
        say: say('Six and nine share one curl. Six loops low. Nine loops high.'),
        visual: 'A ten-frame holding six, with the teacher tracing a 6 and a 9 in the air beside it.',
        figure: tenFrame(6, { alt: 'a ten-frame with one counter under a full row' }),
      },
      {
        say: say('Ten fills every box. Ten needs two marks. One, then zero.'),
        visual: 'A ten-frame filled right up to its last box.',
        figure: tenFrame(10, { alt: 'a ten-frame with no empty boxes left' }),
      },
    ],
    summary: say(
      'Count the things. Hold the number. Draw its shape. Then check which way your curl is facing.',
    ),
    vocabulary: [
      { term: 'numeral', kidGloss: 'the mark we write for a number' },
      { term: 'trace', kidGloss: 'draw over a shape with your finger' },
      { term: 'curl', kidGloss: 'the round part of a six or a nine' },
      { term: 'facing', kidGloss: 'which way round a shape sits' },
    ],
  },
  guidedExamples: [
    {
      ...ge(4, 1, 'modeled', scenePrompt('seven shells in a row', 'Count the shells. Write that number.'), [
        {
          teacherSay: say('Watch me. I touch each one, then hold the number.'),
          expected: '7',
        },
        { childDo: say('Say the number with me before I draw.'), expected: '7' },
        { teacherSay: say('Seven. Across the top, then slide down left.') },
      ], '7'),
      visual: 'Seven shells in a line, with one finger moving along it.',
      figure: counters(7, 'shells', {
        arrangement: 'in a row',
        alt: 'seven shells in a row',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(4, 2, 'completion', scenePrompt('a ten-frame with one counter under a full row', 'Which number does the frame show?'), [
        { teacherSay: say('Look at the upper row. Full rows always hold five.') },
        { childDo: say('Carry on for the one underneath.'), expected: '6' },
        { teacherSay: say('Six. Its curl loops low, near the ground.') },
      ], '6'),
      visual: 'A ten-frame with one counter sitting under a full row.',
      figure: tenFrame(6, { alt: 'a ten-frame with one counter under a full row', asserts: assertsAnswer }),
    },
    {
      ...ge(4, 3, 'prompted', scenePrompt('nine buttons tipped into a heap', 'Which number would you write?'), [
        { teacherSay: say('Push each button aside as you count it.') },
        { childDo: say('Now draw it. High loop first, then down.'), expected: '9' },
      ], '9'),
      visual: 'Nine buttons tipped into a heap, moved away one by one.',
      figure: counters(9, 'buttons', {
        arrangement: 'scattered',
        alt: 'nine buttons tipped into a heap',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(4, 4, 'independent', scenePrompt('a ten-frame with no empty boxes left', 'Read the frame. Write that number.'), [
        { childDo: say('Count both rows. Two marks this time.'), expected: '10' },
      ], '10'),
      visual: 'A ten-frame filled right up to its last box.',
      figure: tenFrame(10, { alt: 'a ten-frame with no empty boxes left', asserts: assertsAnswer }),
    },
  ],
  days: [
    // Day 1 — concept echo: count past five, then make the mark, in three
    // answer modes (write it, tap it, read the frame and tap it).
    [
      { gen: warmMatchSmall, diff: 1 },
      { gen: writeRow, diff: 2 },
      { gen: setRow, diff: 2 },
      { gen: frameRead, diff: 3 },
    ],
    // Day 2 — the two shapes that are one shape: the discrimination lands, and
    // the frame starts arguing for its own ten.
    [
      { gen: warmMost, diff: 2 },
      { gen: setTwoRows, diff: 2 },
      { gen: sixNineTrap, diff: 3 },
      { gen: frameReadAgain, diff: 3 },
    ],
    // Day 3 — the arrangement that loses a count fastest, the frame written from
    // scratch, and a puppet whose number lost its place on the way to the paper.
    [
      { gen: warmGaps, diff: 2 },
      { gen: setScattered, diff: 3 },
      { gen: writeFrame, diff: 2 },
      { gen: puppetSlipItem, diff: 3 },
    ],
    // Day 4 — real-world single-step picture problems (band-A form of G7): a
    // line, a heap and two packed rows, each ending in a written numeral.
    [
      { gen: warmTapSmall, diff: 2 },
      { gen: storyDoorstep, diff: 2 },
      { gen: storyStump, diff: 3 },
      { gen: storyLid, diff: 3 },
    ],
    // Day 5 — numeral↔set matched in both directions, then write one and say how
    // the mark goes.
    [
      { gen: whichGroupShows, diff: 2 },
      { gen: setRing, diff: 3 },
      { gen: day5Write, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    "For grown-ups: this week is half counting and half handwriting, and the handwriting half is where it gets hard. Three of the things you are about to see are not mistakes at all. A backwards 6 or 9 is a HAND problem, not a number problem - almost every four-year-old writes some numerals mirrored, and it settles on its own once the starting point is fixed. So do not rub it out; put a small dot where the mark should begin and let them start from the dot. Say the shape while they draw it, in the same words every time (\"six loops low\", \"nine loops high, then down\"), because the words outlast the hand. Second, expect them to recount from one whenever you ask how many; that is the stage, not forgetfulness. Third, ten will take two marks and they will often write only one - a frame with both rows full is the picture that makes it obvious. At home, numbers to write are everywhere: the front door, the microwave, the page number, the number of forks on the table. Ask for the numeral, then ask which way its curl faces.",
  ],
  /**
   * The band-A production puzzle. Here the TURNING is the mathematics.
   *
   * You cannot answer it without counting a set, writing its numeral, and then
   * looking at your own mark as a shape rather than as a number — which is the
   * week's whole claim, met from the other end. The days all run picture →
   * numeral; the puzzle runs numeral → numeral, and the move it demands (rotate
   * the mark and re-read it) appears nowhere in the core.
   *
   * The answer is `FLIP[n]`, the one authored value in this file, and header
   * disclosure 1 says so plainly: it is a claim about the geometry of two printed
   * marks rather than an arithmetic one, held by a module-load invariant. The
   * figure carries NO assertion, deliberately — the picture shows the count the
   * child starts from, and the answer is what their numeral BECOMES, so asserting
   * the answer against the drawing would make QG-13 fail an honest picture.
   */
  puzzle: (r, guard) => {
    const drawn = drawFresh(
      r,
      guard,
      (rr: Rng) => ({ n: rr.chance(0.5) ? 6 : 9, noun: rr.pick(COUNTABLE_NOUNS) }),
      (v) => `a4:line|${String(v.n)}|${v.noun}`,
    );
    const { n, noun } = drawn;
    const turned = FLIP[n];
    const scene = `${countNoun(n, noun)} in a row`;
    return {
      id: 'A4-PZ-01',
      title: 'Puzzle Grove: Turn the Paper Round',
      puzzleType: 'game',
      prompt: [
        `[image: ${scene}]`,
        say(`Count the ${noun}. Write that number.`),
        say('Now turn your paper upside down.'),
        say('Which number do you see?'),
      ].join(' '),
      figure: counters(n, noun, { arrangement: 'in a row', alt: looksLike(noun, 'in a row') }),
      // MANUAL-REVIEW, AND THE MEASUREMENT IS WHY. The key is definite and it is
      // code-derived, so it stays in the pack for the grown-up and for any audit
      // — but the ACT is turning over a piece of paper the child wrote on, which
      // no screen can check. Left as `exact-numeric` it fell through to
      // `tapOptionsFor`, and measured over 600 packs that hands a four-year-old
      // eight possible buttons of which six can never be right, with the answer
      // pinned to the second or third smallest on 100% of draws: `tapOptionsFor`
      // rotates the rank on a hash of (item id, answer), and a slot whose answer
      // space holds two values can therefore only ever reach two of the four
      // ranks. `Puzzle` carries no `choices` field, so authored options are not
      // available here; one oversized acknowledgement is. Recorded for the
      // orchestrator: `tapOptionsFor`'s rotation is only as wide as the slot's
      // answer space, which is the L53 shape one layer down.
      answer: {
        value: String(turned),
        acceptableForms: [numberWords(turned), `${numberWords(n)} turned round`],
        validation: 'manual-review',
      },
      hintLadder: hints('Count them slowly, right along the line.', 'Now look at your own mark the other way up.'),
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'turn-the-mark' },
  sprint: null,
  mastery: [
    { gen: certifying(frameRead, 0), diff: 3 },
    { gen: certifying(setRow, 1), diff: 2 },
    { gen: certifying(setScattered, 2), diff: 3 },
    { gen: certifying(whichGroupShows, 3), diff: 2 },
    { gen: certifying(storyDoorstep, 4), diff: 2 },
    { gen: certifying(storyLid, 5), diff: 3 },
  ],
  isomorphNotes:
    'Form B answers Form A slot for slot: the same generator at the same difficulty in each place, with its operands drawn off a separate stream. Every slot is a tap on AUTHORED options: no certifying page is left as a bare numeral for the display layer to invent buttons for, and every number offered anywhere in the six is a count from 6 to 10 that the same slot really keys on some other draw, so nothing can be struck out unread. 01: read a ten-frame and choose its numeral, with the frame\'s own ten among the numbers offered - live rather than a lure, since a fifth of the draws really do fill it. 02: choose the numeral for a tidy row. 03: choose the numeral for a loose heap, the arrangement that loses a count fastest. 04: the reverse direction - a number is named and the child finds the group holding it. 05 and 06: two real-world pictures, a doorstep line and a box packed in two rows. On 01, 02, 03, 05 and 06 the RANK the truth will hold is dealt from a weight table before the wrong numerals are chosen, because six can only be the smallest of three numbers drawn from 6 to 10 and ten can only be the largest; and whenever the drawn count is a six or a nine its flip is pulled forward as an option - re-measured over 500 packs after a reader caught the first number wrong, the truth is a six or a nine on 39.0% of the twelve mastery draws - 38.7% of the ten that offer numerals at all, slot 04 being a group hunt - and its flip is on the page for 73.9% of those - so the week\'s own discrimination is certified inside the wide slots rather than by a two-option page. Every slot signs its surface on the pair {count, kind}, which is 45 surfaces rather than 5, so no slot is left holding the count the others did not want. Nothing in Form B repeats a count-and-kind pair that FORM A printed, and that is now ENFORCED rather than asserted: Form B redraws, bounded at twelve tries and deterministic, until nothing it prints is on Form A\'s list, measured at 0 of 4,000 Form-B pairs over 500 packs. It was never true of the DAILY pages and this note used to claim it was - measured, 26.4% of Form-B pairs also appear somewhere in the five days, in 91.0% of packs. The arithmetic says why that half cannot be bought: 45 pairs exist, 30.0 of them are printed on the days and Form A before Form B draws its first page, and squeezing Form B\'s eight into the fifteen cells left would hand the last slot to draw whatever the earlier ones did not want - which is the marginal defect the {count, kind} signature was introduced to prevent in the first place.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'six-nine-turned-round',
      description:
        'Reads or writes a six as a nine, or a nine as a six. The two numerals are one curl turned half a round, and they are the only such pair in this range - so a child can count perfectly, hold the number perfectly, and still put the wrong mark on the paper.',
      exampleWrongAnswer: 'a row of 6 shells labelled 9',
      distractorRationale:
        "Offer the flip itself. It is the whole point of the week and it is never a lure: on the discrimination the two numerals are the only options, and on the certifying slots the flip is a count the same slot keys on other draws, so a child who strikes it out is wrong exactly as often as a child who taps it. The discrimination is deliberately TWO-way - a third option would drop a guess to a third while leaving the misconception worth a half, which pays a child for holding the very belief the week removes.",
      reteachPointer: 'explanation/script[2] (six loops low, nine loops high - the same curl, turned round)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-count-before-the-mark',
      description:
        'Counts the picture and then writes a number one or two out, because the number was dropped somewhere between the last object and the paper. A count past five cannot be checked at a glance, so the child who made the slip is the last person able to spot it - which is what the puppet page is for.',
      exampleWrongAnswer: '8 counters in a frame, written down as 7',
      distractorRationale:
        'Offer one and two either side of the true count, drawn from 6 to 10 so every one of them is a number the same slot really keys. The puppet page shows the same slip with its value recomputed by the registry, so the number the puppet wrote is never authored.',
      reteachPointer: 'guidedExamples/A4-GE-01 (touch each one, then stop and HOLD the number before drawing)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'writes-what-the-box-holds',
      description:
        'Writes ten on a frame that is not full, because a ten-frame IS a box of ten - the capacity gets recorded where the contents belong. The tidier the frame looks, the likelier it is.',
      exampleWrongAnswer: 'a frame with 7 counters sitting in it, labelled 10',
      distractorRationale:
        "The frame slots put the box's own ten on the page beside the count really sitting in it. That option stays live rather than turning into a lure, because a fifth of the draws genuinely fill the frame, so tapping ten out of habit scores about what a guess is worth.",
      reteachPointer: 'guidedExamples/A4-GE-02 (the top row is five - now count on for what is below it)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-story-not-the-picture',
      description:
        'Answers a real-world page from the words rather than from the drawing - the sentence names a doorstep, a stump or a box, and the child reaches for a number without counting what is actually there.',
      exampleWrongAnswer: 'a box packed with 9 blocks labelled 10, because a box "holds ten"',
      distractorRationale:
        'The Day-4 sentences name the KIND and the place and never the quantity, so the only place either number exists is the picture. Every option offered is a count that picture could really hold.',
      reteachPointer: 'Day-4 pages: say what you are about to count out loud, then count it',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'ten-written-with-one-mark',
      description:
        'Writes a single mark for ten, because every number written so far has needed exactly one. Ten is the first numeral in a child\'s life that is two marks in a fixed order, and the order is what goes first.',
      exampleWrongAnswer: 'a full ten-frame labelled 0 or 1',
      distractorRationale:
        'Not offered as a distractor, and that is deliberate: a single mark for ten is not a number this range can key, so putting it on a page would teach a child to strike it out rather than to count. It is carried by the frame slots instead, which draw a full frame on a fifth of their pages and ask for its numeral, and by the script segment that names the two marks in order.',
      reteachPointer: 'explanation/script[3] (ten fills both rows and needs two marks - a one, then a zero)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Writing the numerals 6, 7, 8, 9 and 10 from a picture - counting a group, holding the number, and then making the mark. We met the two numerals that are the same shape turned round, six and nine, and practised checking which way a curl faces before calling it finished. We also met ten, which is the first number that needs two marks in a fixed order, and used the ten-frame to see why.',
    improvingCandidates: [
      'holding a count in their head while the hand makes the mark',
      'checking which way round a six or a nine is facing',
      'writing ten as two marks, in the right order',
      'reading a part-filled frame instead of the size of the box',
      'counting a loose heap without losing their place',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'telling a six from a nine - we will keep saying the shape out loud while the hand draws it',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the number safe between the last object and the paper - counting out loud is the fix',
      },
      {
        errorTag: 'representation-misread',
        text: 'labelling a frame by its contents rather than by its size - part-filled frames are what we will keep working with',
      },
      {
        errorTag: 'task-comprehension',
        text: 'counting the picture on a story page instead of guessing from the words',
      },
      {
        errorTag: 'fact-recall',
        text: 'writing ten with both of its marks, the one before the zero',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted right through to the last one, and you checked which way your curl was facing before you called it done.',
      questionForChild: 'Can you write how many steps are up to your front door?',
      schoolSyncHook: 'Tell us the words their class uses for forming a six and a nine and we will use the same ones.',
    },
    vocabularyForParent: [
      'numeral (the written mark, as opposed to the spoken number)',
      'reversal (a numeral written the right shape but the wrong way round - normal at this age)',
      'forming (the path the hand takes; where the mark starts matters more than how it ends)',
      'ten-frame (a ten-hole tray; a full upper row always means five)',
    ],
  },
});
