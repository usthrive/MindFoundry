/**
 * Level A · Week 12 — "Partners of 5 (number bonds)" (conceptId: partners-of-5).
 *
 * Assembled the way a01, a02 and a11 are assembled, and written in none of their
 * words: no sentence, scene, noun, hint or puppet page here is theirs.
 * FILL-ARCHITECTURE §3 row A12: anchor "5-frame hiding game"; core form
 * how-many-hiding as **icon-as-unknown** (the band-A form of the W13 algebra
 * thread); perceptual discrimination "partners vs plain count"; puppet
 * error-analysis on the hiding game; Day-5 "show ALL ways to make 5" as a `set`
 * answer.
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **A hidden part is still there, and it can be KNOWN rather than seen.**
 *    That is the whole idea, and it is why the anchor is a game rather than a
 *    picture: a card slides across a full five-frame, nothing leaves, and the
 *    part underneath is recoverable from the part on show. Every core item is
 *    that one move, met from a different side.
 *  - **The unknown wears an ICON, never a blank.** `partnerBox` writes the
 *    algebra sentence as "3 and ▢ make 5" — a box a four-year-old can put a
 *    finger on — and the hiding game writes the same sentence as a card on a
 *    frame. The two are deliberately adjacent all week: the picture IS the
 *    equation at this band.
 *  - **Reading which part is wanted is mathematics, not comprehension trivia.**
 *    The recipe's discrimination is "partners vs plain count", and `seeOrHide`
 *    puts both questions over the SAME drawn frame, so the child cannot answer
 *    either by habit.
 *  - **Nothing here is asked in words alone.** The band trades the multi-step
 *    quota for a picture on every working day, which at this concept is not a
 *    concession but the only way to pose it: a bond you cannot see is a bond you
 *    cannot reason about. So each of Days 1–4 carries drawn frames built from the
 *    item's own values, and each hiding frame wears ONE cover (disclosure 6).
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Five of the eighteen daily items look backwards** (27.8%), one to a day,
 *    no two of them the same shape and no two from the same earlier week. Each
 *    is a piece of the ground a bond has to stand on: counting to five, the frame
 *    itself, the next number along, ten-and-some-more — which is the first
 *    splitting a child ever does — and matching two rows one for one.
 *
 * ── FOR A13, WHICH DEEPENS THIS WEEK ────────────────────────────────────────
 * `conceptFamily('partners-of-5')` is `partners-of` and no earlier cell shares
 * it, so A12 carries NO `deepeningDelta` — it opens the family. A13 (partners of
 * 10) does share it and must declare one. The facts A13 will want to write
 * against: A12 fixes the whole at FIVE, which is odd, so a part never equals its
 * own partner and every bond is asymmetric; the whole fits in ONE row, so it is
 * subitised rather than counted; there are exactly four hiding cells (1|4, 2|3,
 * 3|2, 4|1) and the week meets all four many times over rather than sampling a
 * space; and the missing part is always small enough to be found by whispering
 * on. A13's frame has two rows, ten cells, nine hiding cells and a partner that
 * can equal its own twin — and its recipe slip ("uses the 5-partner for 10") is
 * only nameable BECAUSE this week taught the 5-partner.
 *
 * ── EIGHT DISCLOSURES (FANOUT kit §E2.3: document the choice in the header) ──
 *
 * 1. **THE RECIPE'S PUPPET SLIP IS NOT DERIVABLE FROM THE VERIFY LIBRARY, and
 *    that is provable rather than a judgement.** Row A12 names the slip "says 2
 *    hiding when 3 are shown of 5". Read literally it is not a slip at all —
 *    5 − 3 is 2 — so the row means the misconception it can only mean: the
 *    puppet reports the part he can SEE as the part that is hiding. Call the
 *    shown part `s` and the truth `h = 5 − s`; the slip's value is `s`, so
 *    `wrong − correct = s − h = 5 − 2h`, which changes with every cell.
 *
 *    No registered transform produces that pair. `a_verify_count_slip_v1` gives
 *    `{n, n ± 1}` and `a_verify_countback_slip_v1` gives `{a − b, a − b + 1}` —
 *    both a FIXED offset of one, so each matches the recipe on exactly one of the
 *    four cells (h = 2) and misses the other three. `d_verify_binop_misconception_v1`
 *    varies the OPERATION over one operand pair, so producing `{h, s}` needs
 *    operands solving `x − y = h` with `x + y = s`, i.e. `x = 2.5` — not an
 *    integer at any cell; the multiplicative variants (`x − y = h`, `x·y = s`)
 *    have an integer solution only at h = 2, and it is `(3, 1)`, a pair with no
 *    referent in a five-frame. That is fabrication with extra steps (§E2.12).
 *
 *    Taken in the kit §E2.3 order, ending at the third option. The misconception
 *    is MOVED to where it can be shown honestly, and it is now on EVERY partner
 *    page in the week rather than in three places: it is a live option on every
 *    `seeOrHide` draw (the "other part", offered 100% of the time and keyed only
 *    when the question names it), it is the first authored option on every page
 *    `withPartnerChoices` builds (disclosure 3), it is a live option in the puppet
 *    item itself, and it heads the mistakeBank with its own distractor rationale.
 *    What the puppet DOES is the derivable
 *    complementary slip of disclosure 2 — chosen because it is the error the
 *    week's own strategy produces, not a slip parked beside the concept.
 *
 * 2. **The puppet's slip is the count-ON off-by-one, and `a_verify_countback_slip_v1`
 *    computes it exactly.** The strategy this week teaches is: start on the part
 *    showing and whisper on to five. A child who counts the number they START on
 *    as their first whisper says "three, four, five — three!" and reports `h + 1`.
 *    That is the same off-by-one the template was written for, walked the other
 *    way, and the arithmetic is identical: with `{a: 5, b: shown}` it returns
 *    `{correct: 5 − shown, wrong: 5 − shown + 1}`, which is the true partner and
 *    the slip's own output. Nothing is invented and nothing is asserted — QG-11
 *    recomputes both halves from the params and checks the prompt really shows
 *    the puppet's number. The template id names a count-BACK story; reusing a
 *    registered transform for a structurally identical claim is the corpus's own
 *    convention (a11 ran four different questions through `a_numeral_for_set_v1`),
 *    and it is recorded here rather than buried. A `a_verify_countup_slip_v1`
 *    alias would document it better; noted for the orchestrator.
 *
 * 3. **THE ANSWER SPACE IS FOUR VALUES WIDE, AND "FREE-ENTRY NUMERIC" IS NOT A
 *    REAL ANSWER MODE AT THIS BAND — the first draft of this disclosure was built
 *    on an answer mode that does not exist.** A partner of five is 1, 2, 3 or 4 —
 *    never 0 (an option no child looking at a covered frame could pick) and never
 *    5 (the frame's own capacity). That is exactly the shape that manufactures a
 *    dead option, and the answer here WAS to budget four of the six mastery slots
 *    as small free-entry numerics: no rank to sit at, no option to strike out.
 *
 *    That reasoning was right about the content and wrong about the child. A
 *    pre-reader cannot type. `AnswerEntry` takes a numeric band-A item with no
 *    authored `choices` and calls `tapOptionsFor`, which INVENTS four number
 *    buttons at render time — so those four slots have been four-button multiple
 *    choice since the day they shipped, with generator-invented distractors in
 *    place of the ones this file would have written, and no gate could see them
 *    because the buttons never existed in the pack. The consequence was arithmetic
 *    rather than bad luck: a runtime generator cannot know an answer's RANGE, so
 *    offering `answer ± 1, ± 2` around a partner of five necessarily offered 0 and
 *    5 — the two values this week's question can never take. Seven of A12's
 *    mastery slots carried an option offered on more than half their draws and
 *    keyed on none, more than any other week.
 *
 *    - **EVERY CERTIFYING SLOT NOW CARRIES AUTHORED CHOICES.** Three options,
 *      each a misconception this week can name: the part on show (the classic
 *      partners error), the part on show miscounted by one (both errors at once),
 *      the ±1 whisper slip, and the whole frame held to one draw in three. The
 *      wrapper is `withPartnerChoices`; the day pages that use the same generators
 *      carry them too, so no page anywhere in the week offers 0 or 5-as-a-partner.
 *      Measured over 500 packs on the four wrapped mastery slots: every value 1–4
 *      keyed on 22.2–28.0% of draws, the key at rank 1 of 3 on 38.2–42.4%, rank 2
 *      on 32.2–36.4%, rank 3 on 24.0–27.2%, and the one never-keyed option (the
 *      whole) offered on 30.0–35.0%. `seeOrHide` and `puppetCountsOn` are
 *      unchanged in shape and re-measured in their own comments. Nothing in the
 *      week reaches 54% at a rank, against a 95% gate.
 *    - **What remains, and it is a floor rather than a defect.** On any
 *      three-option error-analysis page "the puppet is never right" strikes one
 *      option out for free, so the floor is a coin flip: measured 50.0%. a01
 *      argued the same ceiling, and the only way past it is to let the puppet
 *      sometimes be correct, which stops being error analysis. The four wrapped
 *      slots have the same shape from the other side — the part on show can be
 *      struck by a child who has counted it — measured at exactly 50.0%, rising to
 *      65.1–67.5% for a child who has also learned that a part of five is never
 *      five. Neither certifies: playing every elimination and guessing the rest
 *      scores a whole mastery form at 59.5% against an 80% bar. And on `seeOrHide`
 *      the two blind habits — "always say the part you can see" and "always say
 *      the partner" — are complementary, so exactly one is right on every draw and
 *      balancing them is the only honest defence. That balance is now DEALT rather
 *      than drawn (see the deal above §"the listening discrimination"): every pack
 *      serves exactly two scored pages of each, so neither habit can score more
 *      than two of the four in any pack — 500 of 500. Note which one that
 *      punishes. "Always say the partner" requires the bond to have been made, so
 *      it diagnoses a child who is not listening; "always say the part you can
 *      see" requires no bond at all. Reported, not hidden.
 *
 * 4. **Five thin local generators, and why each is not in the family.**
 *    `seeOrHide` (the family has no generator that poses a frame as a CHOICE and
 *    none that asks the two partner questions over one drawing — `partnersHiding`
 *    returns a typed answer with no options to rotate), `puppetCountsOn`
 *    (`PuppetSlip` is a closed union of 'double-count' | 'skip-count' |
 *    'count-back-start' | 'teen-writing'; there is no partner slip in it),
 *    `drawTheRest` (the family builds a frame to a GIVEN number, `tenFrameBuild`,
 *    and reads its gaps, `tenFrameEmpty`, but never asks the child to DRAW the
 *    missing part — which is the production direction of the bond), and the two
 *    Day-4 story forms `cardStory` and `fillStory` (the family has no story
 *    generator at all; its word problems join or take away, neither of which A12
 *    has taught). None of the five departs from how the family builds an item —
 *    each names a templateId the registry resolves, draws its picture through
 *    `lib/figures`, renders every quantity through `lib/format` and stamps its
 *    `authorMeta` — so they extend the family rather than sidestep it. Recorded
 *    for the orchestrator.
 *
 * 5. **The Day-5 "say both parts" ships OPEN, with no answer key, and the week
 *    needs it.** FILL-ARCHITECTURE §3 sets the band's production stance —
 *    "the telling is oral (R-flagged), the making is computable" — and §6.12's
 *    dual-strand coupling gate demands one non-computational item that asks for a
 *    justification. `allWaysToMake` cannot be that item: its `set` validation is
 *    computable by design, which is the point of the Day-5 signature. `makeAndTell`
 *    therefore ships with `manual-review` and no template behind it at all. The
 *    alternative was to attach one and have it "recompute" a split the child has
 *    not chosen yet, which is the precise move the kit rules out: a manufactured
 *    key on an open task looks checked and is not. §7's named list of A-band oral
 *    Day-5s does not include A12; it ends in an ellipsis, and this is one.
 *
 * 6. **`coverStyle: 'single'` on every hiding frame, including the ones this file
 *    draws itself.** `lib/figures.ts` states the reason: the default 'cells'
 *    gives each hidden counter its own cover, and a child who COUNTS the covers
 *    has not found a partner — the scaffold would replace the reasoning the item
 *    exists for. The family's `partnersHiding` and `partnerBox` already pass it;
 *    `seeOrHide`, `puppetCountsOn` and `cardStory` pass it too, and so do the
 *    lesson script and every guided example, so a child never meets a countable
 *    cover anywhere in the week.
 *
 * 7. **`allWaysToMake`'s completeness claim WAS audited by no gate; the hole was
 *    closed on 2026-08-10 and the local re-derivation stays.** `a_all_ways_v1`
 *    registers an `answerFor` that rebuilds every ordered pair, and QG-5's
 *    arithmetic re-check used to run for four validations with `'set'` not among
 *    them — measured at the time, a pack with a pair deleted from that answer
 *    still validated clean. `'set'` has since joined that list
 *    (`validator.ts:472`), so the pin is now live and this week's Day-5 answer is
 *    checked by the corpus as well as by `withCheckedWays`, which enumerates the
 *    pairs a second time and throws on disagreement. The wrapper is kept: two
 *    implementations that must agree is a stronger claim than one, and it is the
 *    only check that survives if the validation ever changes.
 *
 *    WHAT IS STILL OPEN ON THAT ITEM, and it is a display defect rather than a
 *    content one. `'set'` is in `needsTypedEntry`, and a band-A item that reaches
 *    it falls through to a TEXT BOX — so "Show all the ways to make 5" puts a
 *    keyboard in front of a four-year-old who cannot read. `tapOptionsFor`
 *    returns null for a non-numeric answer, which is correct, so nothing in this
 *    file can route around it without giving up the computable Day-5 answer.
 *    Reported for the orchestrator; not fixable from a week file.
 *
 * 8. **The puzzle's picture carries no `asserts`, and that is deliberate.** It
 *    draws five loose things in a row and asks how many are left AFTER some are
 *    coloured, so the quantity the picture can compute (its total, five) is not
 *    the quantity the item asks for (the other part). `figureValue` for a
 *    `counters` figure offers `count`, `group:k` and `remaining`, and none of
 *    them names "the part not yet coloured" — the colouring has not happened
 *    when the picture is drawn. Pointing the assertion at the total anyway would
 *    have QG-13 report a contradiction between a truthful picture and a correct
 *    answer, which is worse than no assertion at all — so it is left off rather
 *    than pointed somewhere it does not belong. What guarantees the pair instead
 *    is that one drawn `k` produces both the number in the prompt and the
 *    `5 − k` in the key, so they cannot disagree. The missing selector (a "not-yet-marked" counters
 *    quantity) is recorded for the orchestrator.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  allWaysToMake,
  compareSets,
  countArrangement,
  neighbourNumber,
  partnerBox,
  partnersHiding,
  teenTenAnd,
  tenFrameRead,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsAnswerOf, assertsParam, counters, tenFrame } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn fresh per item; never hardcode a name that is also in this pool (kit §F.3). */
const NAMES = ['Yusuf', 'Bela', 'Kwame', 'Tariq', 'Lucia', 'Ozan', 'Neve', 'Fen'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/** The whole this week partitions. Odd on purpose: a part never equals its partner. */
const TOTAL = 5;

// ---------------------------------------------------------------------------
// Ten words, counted the way the GATE counts them
//
// Two ceilings exist and they are not the same ceiling. The family's `ask()`
// weighs a whole prompt string, so this week's three-sentence puppet page ("Oh
// no! Wix got mixed up and says 3. Tap the right number.") would fail a limit it
// never actually breaks — and no ceiling of any kind reaches a hint rung. What
// `bb-readability-test` weighs is one SENTENCE at a time, on every surface a
// child hears, and that is the measurement this file has to satisfy. So its own
// splitter and counter are reproduced here and every authored string is pushed
// through them, which turns the ceiling into something that throws at module
// load rather than something a reviewer has to notice.
//
// Alt text does not come through here. It is the whole of what a child using a
// screen reader gets, and this week's pictures are frames with cards lying
// across them: shortening those descriptions means saying less about the cover,
// which is the one thing the week is about.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A12: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** The scene rides in a bracket; only the question after it is a sentence with a ceiling. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Rungs, each pushed through the ceiling. Nothing here names a child or a quantity. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Give a family generator this week's help, leaving `lib/` alone.
 *
 * Two family generators carry the concept and thirteen core items have to be
 * built out of them, against a rule that lets one ladder appear twice. That
 * arithmetic decided the shape of the week before any day was written (kit §E
 * "A-band lessons", item 1): eleven ladders across thirteen items, the busiest
 * of them used twice.
 *
 * The budget is only half the reason. A single family serves all 24 weeks of
 * this band, so a week that ships the library's ladders untouched is a week
 * whose help sounds exactly like the help in the other twenty-three — and
 * nothing inside one pack can see that, which is the hole `bb-cross-week-test`
 * was cut to look through. The help also genuinely wants to change as the week
 * moves: Monday's frame is still about believing five is in there at all, while
 * from Tuesday on the child has a strategy to run and the rungs should point at
 * where it goes wrong.
 *
 * Nothing here touches the draw. The wrapper replaces one field on an already-
 * built draft, so the operand surface QG-1 and QG-4 sign is the same string it
 * would have been.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * One family item from an earlier week, re-flagged as the day's warm-up.
 *
 * The band's profile asks for no minimum number of warm-up formats, so nothing
 * forces these onto the page and each one has to be worth its minute. A bond is
 * a claim about how a quantity comes APART, and it collapses the moment any of
 * four earlier things is shaky — so those four are what come back, plus the one
 * that IS a decomposition already. Counting a small loose group (A1). Reading a
 * frame (A2). Saying the next number along, which is the whispering the whole
 * week runs on (A6). Ten-and-some-more, the first time a child ever splits a
 * number and the direct ancestor of this one (A10). Matching two rows one for
 * one (A5).
 *
 * The ladder is left exactly as the source week wrote it. Warm-ups sit outside
 * both the per-pack dedup and the corpus-wide ladder scan, and a warm-up that
 * has been re-voiced into THIS week's register no longer sounds like the week it
 * is meant to bring back.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ---------------------------------------------------------------------------
// The two spoken scenes this file authors
//
// `lib/earlynumber.ts` sets the law these two obey: an alt says what a picture
// LOOKS like and never the quantity the item wants. At this band it bites twice
// as hard, because the alt is not a fallback — every screen plays
// `speakablePrompt(prompt, figure.alt)` aloud, and the alt wins over the
// bracket, so it is the first thing a four-year-old receives.
//
// This week is the hardest case the law has, and the reason is arithmetic: five
// is odd and a bond has two parts, so NAMING EITHER PART GIVES THE OTHER AWAY.
// An alt saying "three showing" answers "how many are hiding" as surely as one
// saying "two hidden" would. Both strings below therefore carry no count at all
// — a frame, a card, some gaps — and the picture is left to be looked at.
//
// The `[image: …]` bracket keeps its numbers. It is never displayed and never
// spoken, and it is what QG-1 and QG-4 sign to keep operand surfaces fresh.
// ---------------------------------------------------------------------------

const COVERED_ALT = 'a five-frame with some counters showing and a card over the rest';
const GAPPY_ALT = 'a five-frame with some counters in it and some boxes still empty';

// ===========================================================================
// THE LISTENING DISCRIMINATION IS DEALT PER PACK, NOT DRAWN PER PAGE
// ===========================================================================

/**
 * Which question each `seeOrHide` page asks is decided ONCE FOR THE PACK, before
 * any of its four pages is built.
 *
 * WHY, and it is L52 exactly. The first build drew `asksHidden` with a fair coin
 * on every page and measured the marginal, which came out at half and half. A
 * reader then read the pack a child actually sits, at seed 11, and found all four
 * SCORED partner-choice pages asking "hiding" — D2-03, D3-03, MA-03 and MB-03 —
 * so "always give the partner" scored four out of four without listening once.
 * The flip survived only in GE-03, which is not scored. Four fair coins land the
 * same way on one pack in eight; a marginal cannot see that, and the mistakeBank's
 * claim that habit "is wrong exactly half the time" was a statement about the
 * generator rather than about the page.
 *
 * So the two questions are DEALT, out of the pack's own `TupleGuard` — the one
 * object every generator in a pack shares — in two independent pairs:
 *   · the two DAILY pages take one each, and which day gets "can you see" is
 *     drawn per pack;
 *   · the two MASTERY forms take one each, and which form gets "can you see" is
 *     drawn per pack.
 * Every pack therefore serves exactly two scored "How many can you see?" pages
 * and two scored "How many are hiding?" pages, with at least one of each in the
 * dailies. Neither blind habit can score more than two of the four, in any pack.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO, because the project's own gate forbids it.
 * The brief asked for at least one "can you see" page in EVERY mastery form. Each
 * form carries exactly one `seeOrHide` slot, so satisfying that literally means
 * pinning slot 03 to "can you see" on both forms — and the moment the question
 * stops flipping, the keyed value is always the part on show and the OTHER part
 * is offered on 100% of draws while being keyed on none. That is a dead option in
 * a certifying slot, which `bb-answer-entropy-test` fails as NEVER_CORRECT, and
 * it would also hand a bond-less child a page he can score by counting what he
 * can see. The flip is what makes the option live (the generator's own argument,
 * below), so the guarantee is stated where it can be kept: one scored "can you
 * see" in the dailies of every pack, and one across the two mastery forms of
 * every pack. Recorded rather than quietly narrowed.
 *
 * A DEAL IS CONSUMED ONCE PER ITEM, NEVER ONCE PER ATTEMPT (A20's corollary).
 * `drawUniqueItem` rebuilds a page whose surface collides and `makeWeekBuilder`
 * rebuilds one that echoes a guided example or repeats a Form-A core, so a
 * schedule that spends a slot per CALL hands the next page the wrong side. Both
 * functions below are therefore idempotent rather than consuming: the daily side
 * is a pure function of (which day, the one coin stored in the guard), and the
 * mastery side is remembered against the form's own rng object, so a rebuilt page
 * gets the side it already had instead of the other form's.
 */
type Side = 'see' | 'hide';

/** Which daily page asks "How many can you see?" — drawn once, then read back. */
function dailySeeDay(rng: Rng, guard: TupleGuard): 2 | 3 {
  if (guard.taken('a12:see-day=2')) return 2;
  if (guard.taken('a12:see-day=3')) return 3;
  const day: 2 | 3 = rng.chance(0.5) ? 2 : 3;
  guard.add(`a12:see-day=${String(day)}`);
  return day;
}

const dailySide = (day: 2 | 3) => (rng: Rng, guard: TupleGuard): Side =>
  dailySeeDay(rng, guard) === day ? 'see' : 'hide';

/**
 * The mastery pair, one side each.
 *
 * Keyed on the form's own rng object — `makeWeekBuilder` gives Form A and Form B
 * separate streams, and hands the SAME stream back on a rebuild. So a rebuild
 * reads its remembered side instead of taking the other form's, which a plain
 * guard counter could not tell apart. The map holds nothing between packs: each
 * pack builds fresh streams, so its entries die with it.
 */
const MASTERY_SIDE = new WeakMap<Rng, Side>();

function masterySide(rng: Rng, guard: TupleGuard): Side {
  const already = MASTERY_SIDE.get(rng);
  if (already) return already;
  let side: Side;
  if (guard.taken('a12:mastery-first=see')) side = 'hide';
  else if (guard.taken('a12:mastery-first=hide')) side = 'see';
  else {
    side = rng.chance(0.5) ? 'see' : 'hide';
    guard.add(`a12:mastery-first=${side}`);
  }
  MASTERY_SIDE.set(rng, side);
  return side;
}

// ===========================================================================
// AUTHORED OPTIONS FOR EVERY PARTNER ITEM — because band A has no free entry
// ===========================================================================

/**
 * Three options a four-year-old really gives, on every page whose answer is a
 * partner of five.
 *
 * WHAT THIS REPLACES, AND WHY THE THING IT REPLACES WAS NEVER THERE. Disclosure 3
 * budgeted four of the six mastery slots as small free-entry numerics, on the
 * argument that a four-value answer space plus a three-option page manufactures a
 * dead option. The argument was right; the answer mode was imaginary. A pre-reader
 * cannot type, so `AnswerEntry` takes any numeric band-A item with no authored
 * `choices` and calls `tapOptionsFor`, which INVENTS four number buttons at render
 * time from the answer alone. Those slots have been four-button multiple choice
 * since the day they shipped, with generator-invented distractors in place of the
 * ones this file would have written — and because the buttons never existed in
 * the pack, no gate could see them.
 *
 * The consequence is arithmetic rather than bad luck. A partner of five is 1, 2, 3
 * or 4, so a runtime generator offering `answer ± 1, ± 2` must reach outside that
 * range: it offered ZERO — no child looking at a frame with counters in it says
 * none are hiding — and it offered FIVE, the frame's own capacity, on pages where
 * five is what the frame holds rather than what is under the card. Measured
 * through the projection `bb-answer-entropy-test` now runs, seven of this week's
 * mastery slots carried an option offered on more than half their draws and keyed
 * on none. A runtime generator cannot know an item's answer RANGE. Only the week
 * can, so the week states it.
 *
 * THE OPTIONS, AND THE MISCONCEPTION EACH ONE ENCODES. Two of the three seats are
 * fixed and the third is drawn from a pool of three:
 *   the part on show   the classic partners error — the child answers the only
 *                      number the picture actually offers, because a covered part
 *                      has no count to read. Offered on EVERY draw; it heads the
 *                      mistakeBank.
 *   one whisper out    the count ran a box past the part it was on, or stopped a
 *                      box short. Which side exists is FIXED by the cell rather
 *                      than drawn: a partner of one has nothing honest below it,
 *                      at a partner of two "one more" IS the part on show, and at
 *                      a partner of four it is the whole frame. Deterministic,
 *                      never a redraw loop (kit §E2.4).
 *   the part on show,  the two errors compounded: the child gives the part he can
 *   miscounted        see, and miscounts it on the way. It is the commonest
 *                      wrong answer a grown-up actually hears on this game, and
 *                      it is what stops the option SET from naming the answer —
 *                      see below.
 *   the whole, five    what the frame HOLDS, given instead of one part of it. Held
 *                      to one draw in three, because a part of five is never five
 *                      and an option that can never be keyed must not be a fixture.
 *
 * WHY A POOL OF THREE RATHER THAN TWO, and it is a tell that only shows up when
 * you write the option sets out. With the part on show plus a single whisper slip,
 * the three numerals on the page are a function of the answer alone: {1,2,4} could
 * only ever be a partner of one, {1,2,3} only a partner of two. Two-thirds of the
 * draws named their own answer to anyone holding four small sets in their head.
 * Adding the compounded error makes every set reachable from two different cells —
 * {1,2,4} is a partner of one with a whisper slip OR a partner of four with the
 * shown part miscounted, and the same holds for {1,2,3}, {1,3,4} and {2,3,4} — so
 * no option set in this week determines its key. Enumerated over 500 packs: all
 * six sets that occur ({1,2,3} {1,2,4} {1,3,4} {1,4,5} {2,3,4} {2,3,5}) are
 * reachable from two different partners, against two draws in three under the
 * two-candidate version this replaced.
 *
 * THE ANSWER SITS AT NO FIXED RANK, and the rotation is per DRAW rather than per
 * slot. Both the cell and the third option are drawn fresh on every page, and
 * `makeChoices` shuffles the positions off the same stream, so neither "tap the
 * second-smallest" nor "tap the second button" is worth anything — and a child
 * re-sitting Form B meets a different rank from the one Form A gave him. (Hashing
 * a rank off an item id does the opposite: an id is constant for a slot, so the
 * rank rotates across slots and freezes inside one, which reads as balanced in
 * aggregate and is a 100% tell on the corrective pass.)
 *
 * WHAT IT COSTS, STATED PLAINLY RATHER THAN LEFT FOR A READER. On a page that
 * offers the part on show, a child who has counted that part can strike it without
 * making the bond; if he has also learned that a part of five is never five, the
 * one draw in three that offers the whole collapses to a single option. Measured
 * over 500 packs, that compound elimination scores 65.1–67.5% on the four
 * hidden-part slots, against a 33.3% chance floor — and striking the shown part
 * alone scores exactly 50.0%, the a01 ceiling met from another side. It is the
 * price of putting the week's two named misconceptions on the page at all, and it
 * certifies nobody: the same child meets the discrimination at slot 03, where the
 * part on show is the ANSWER half the time (his elimination scores 50.0–53.6%
 * there), and the puppet at slot 06 (39.5–39.7%). Run end to end, a child playing
 * every elimination available and guessing among what is left scores a mastery
 * form at 59.5% against the 80% pass bar and passes 1.9% of 1,000 forms. The way
 * past this ceiling is a fourth option, which a four-value answer space cannot
 * fill honestly; recorded rather than argued away.
 *
 * IT ALSO MOVES THE ANSWER RE-CHECK, so that is done here rather than lost.
 * QG-5's arithmetic re-check runs for `exact-numeric` and four siblings, and a
 * `choice-key` answer is not one of them — so the registry's `answerFor` stops
 * being called for these slots. A second, independent derivation replaces it: the
 * partner is recomputed from the item's OWN `generator.params` and compared with
 * what the family generator keyed, and a disagreement throws for every seed at
 * once instead of one page quietly shipping wrong. The picture keeps its
 * assertion too — `acceptableForms` carries the numeral, which is what QG-13
 * compares the frame's covered run against.
 */
interface PartnerCells {
  /** The whole the page partitions. */
  whole: number;
  /** The part the child can count: showing, stated, or already in the frame. */
  onShow: number;
}

/** What the two shown-part options mean on THIS page; the rest read the same everywhere. */
interface OnShowVoice {
  /** Giving the part the child can count, as the part that is wanted. */
  plain: string;
  /** The same error with a miscount on top. */
  miscounted: string;
}

function withPartnerChoices(
  base: ItemGen,
  read: (params: Record<string, unknown>) => PartnerCells,
  voice: OnShowVoice,
): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) {
      throw new Error('A12 withPartnerChoices: the item carries no generator params to re-derive the partner from');
    }
    const { whole, onShow } = read(params);
    const key = whole - onShow;
    // The re-derivation QG-5 no longer performs for a choice-key answer.
    if (String(key) !== draft.answer.value) {
      throw new Error(
        `A12 withPartnerChoices: ${draft.generator?.templateId ?? 'an item'} keyed "${draft.answer.value}", but ${String(whole)} - ${String(onShow)} is ${String(key)}`,
      );
    }
    if (whole !== TOTAL || key < 1 || key >= whole) {
      throw new Error(`A12 withPartnerChoices: a partner of ${String(whole)} came out ${String(key)} - outside this week's cells`);
    }
    // One out, on whichever side of the key an honest value exists. A key of one
    // has nothing countable below it (zero is not a miscount of a frame with
    // things in it); at two, one more IS the part on show; at four, one more is
    // the whole frame. So the side is fixed by the cell rather than drawn.
    const slip = key + 1 !== onShow && key + 1 !== whole ? key + 1 : key - 1;
    // The same two errors compounded: the part on show, miscounted by one. Its
    // side is fixed the same way — down unless down is the key or nothing at all.
    const misread = onShow - 1 !== key && onShow - 1 >= 1 ? onShow - 1 : onShow + 1;
    const values = [key, onShow, slip, misread, whole];
    if (new Set(values).size !== values.length || slip < 1 || misread < 1 || misread > whole) {
      throw new Error(`A12 withPartnerChoices: the options collided at a partner of ${String(key)} out of ${String(whole)}`);
    }
    const onShowOption = {
      text: String(onShow),
      errorTag: 'concept-misconception' as ErrorTag,
      rationale: voice.plain,
    };
    const wholeOption = {
      text: String(whole),
      errorTag: 'representation-misread' as ErrorTag,
      rationale: 'What the frame HOLDS, answered instead of the one part the question names.',
    };
    const slipOption = {
      text: String(slip),
      errorTag: 'procedure-slip' as ErrorTag,
      rationale:
        slip > key
          ? 'One too many - the count ran a box past the part it was on.'
          : 'One too few - the count stopped a box short of five.',
    };
    const misreadOption = {
      text: String(misread),
      errorTag: 'procedure-slip' as ErrorTag,
      rationale: voice.miscounted,
    };
    // The whole is held to one bucket in three: it can never be keyed, so it must
    // never become the option that is simply always there (kit §E2.11). The other
    // two share the remaining two buckets, which is what keeps the option SET from
    // naming its own answer.
    const bucket = rng.int(0, 2);
    const third = bucket === 2 ? wholeOption : bucket === 1 ? misreadOption : slipOption;
    const { choices, correctKey } = makeChoices(rng, String(key), [onShowOption, third]);
    const withChoices: ItemDraft = {
      ...draft,
      choices,
      answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
      errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
    };
    return withChoices;
  };
}

/** The covered-frame reading of `generator.params`; both partner templates agree. */
const coveredCells = (p: Record<string, unknown>): PartnerCells => ({
  whole: Number(p.total),
  onShow: Number(p.shown),
});

/** The gappy-frame reading: what is already in, against what the frame holds. */
const gapCells = (p: Record<string, unknown>): PartnerCells => ({
  whole: Number(p.cap),
  onShow: Number(p.filled),
});

const HIDING_VOICE: OnShowVoice = {
  plain: 'The part on show, given as the part hiding - the bond was never made.',
  miscounted: 'The part on show again, miscounted by one on the way - both errors at once.',
};
const BOX_VOICE: OnShowVoice = {
  plain: 'The part the sentence already tells you, put straight back into the box.',
  miscounted: 'The part the sentence tells you, miscounted by one and put into the box.',
};
const GAP_VOICE: OnShowVoice = {
  plain: 'The part already in the frame, given as the part still needed to fill it.',
  miscounted: 'The part already in the frame, miscounted by one, given as the part needed.',
};

// ===========================================================================
// Local generator 1 — partners vs plain count (the recipe's discrimination)
// ===========================================================================

/**
 * One drawn frame, and the question decides which part is wanted.
 *
 * This is FILL-ARCHITECTURE §3's "partners vs plain count" in the only form that
 * can be honest: both questions must sit over the SAME picture, or the child
 * tells them apart by the drawing instead of by listening. So the frame is drawn
 * once and the question is drawn beside it — "How many can you see?" reads the
 * part on show, "How many are hiding?" reads its partner — and the other part is
 * offered as an option either way.
 *
 * WHY THAT MATTERS FOR THE ANSWER SPACE. With only the hiding question, the
 * shown count would be offered on every draw and keyed on none: a dead option in
 * a four-value space (kit §E2.11), and the shape a child learns to strike out.
 * Drawing the question makes it a live answer instead — so the same option
 * teaches the discrimination and cannot be eliminated for free.
 *
 * Every option is something a four-year-old really says, and none is invented:
 *   the other part   the part the question did NOT name — the week's headline
 *                    misconception when the hiding part was asked for, and a
 *                    plain mis-listen when the showing part was
 *   the whole, 5     what the frame HOLDS, answered instead of one part of it
 *   one out          the count slipped a box, in whichever direction the honest
 *                    value exists (a key of one has nothing below it but zero)
 *
 * WHICH QUESTION THIS PAGE ASKS IS NOT DRAWN HERE. It is dealt for the whole pack
 * before any page is built (see the deal above), because a fair coin per page
 * gives one pack in eight four pages that all ask the same thing — which is what
 * a reader found at seed 11, and what a marginal cannot show. The generator takes
 * its side as an argument and is otherwise unchanged.
 *
 * WHICH THIRD OPTION IS OFFERED IS DRAWN, so the truth lands lowest, middle and
 * highest in turn: measured over 500 packs and this generator's four slots, every
 * value 1–4 is keyed on 23.2–27.0% of draws, and the key sits at rank 1 of 3 on
 * 29.4–35.4%, rank 2 on 45.0–52.6%, rank 3 on 15.6–19.6%. The
 * whole is held to one bucket in three, so it is offered on 30.0–33.0% of pages
 * rather than half of them — below the rate at which
 * `bb-answer-entropy-test` calls a never-keyed option dead, and below the rate at
 * which "never the five" is learnable. It cannot be made live by widening the
 * draw: a part of five is never five, at any cell, so it is a lure by the
 * mathematics rather than by the sampling (the L36 test). Recorded for the
 * orchestrator, which may prefer it in that script's DECLARED_LURES with this
 * argument.
 */
function seeOrHide(side: (rng: Rng, guard: TupleGuard) => Side): ItemGen {
  return (rng, guard, difficulty) => {
    // Taken ONCE PER ITEM, outside the freshness loop: a redraw must not spend
    // the other page's side (A20's corollary to L52).
    const asksHidden = side(rng, guard) === 'hide';
    return drawUniqueItem(rng, guard, (r) => {
      const shown = r.int(1, TOTAL - 1);
      const hidden = TOTAL - shown;
      const key = asksHidden ? hidden : shown;
      const other = TOTAL - key;
      // The honest one-out slip, on whichever side of the key it exists. A key
      // of one has no countable value below it (zero is not a miscount of a
      // frame with things in it), and a key of four has none above it that is
      // not the whole; so the direction is FIXED by the key rather than drawn,
      // and the rank rotation is carried by the whole/slip choice below.
      // Deterministic, never a redraw loop (kit §E2.4).
      const slip = key <= 2 ? (key === 1 ? key + 1 : key - 1) : key === 3 ? key + 1 : key - 1;
      const otherOption = {
        text: String(other),
        errorTag: (asksHidden ? 'concept-misconception' : 'task-comprehension') as ErrorTag,
        rationale: asksHidden
          ? 'The part on show, given as the part hiding - the bond was never made.'
          : 'The hidden partner, given when the question named the part on show.',
      };
      const wholeOption = {
        text: String(TOTAL),
        errorTag: 'representation-misread' as ErrorTag,
        rationale: 'What the frame HOLDS, answered instead of the one part the question names.',
      };
      const slipOption = {
        text: String(slip),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale:
          slip > key
            ? 'One too many - the count ran a box past the part it was on.'
            : 'One too few - the count stopped a box short of the part.',
      };
      const useWhole = r.int(0, 2) === 2;
      const { choices, correctKey } = makeChoices(r, String(key), [
        otherOption,
        useWhole ? wholeOption : slipOption,
      ]);
      const scene = `a frame of ${String(TOTAL)} with ${countNoun(shown, 'counters')} showing and a card on top`;
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(scene, asksHidden ? 'How many are hiding?' : 'How many can you see?'),
        figure: tenFrame(shown, {
          size: TOTAL,
          hidden,
          coverStyle: 'single',
          alt: COVERED_ALT,
          // The picture's OWN claim, aimed at whichever part is keyed: the cells
          // filled when the showing part is asked for, the covered run when the
          // hidden one is. Both are recomputed by QG-13 from the frame's params,
          // so a card drawn over the wrong number of boxes fails rather than
          // being trusted.
          asserts: asksHidden ? assertsParam('n', 'hidden') : assertsParam('n'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(key)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_numeral_for_set_v1',
          params: { n: key, total: TOTAL, shown, asksHidden },
          seed: r.uint(),
        },
        hintLadder: hints('Listen again. Which part does it want?', 'One part is showing. One part is not.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'partner-or-count', isDiscrimination: true },
      };
      return draft;
    });
  };
}

// ===========================================================================
// Local generator 2 — help the puppet (the A12 count-on slip)
// ===========================================================================

/**
 * A NAMED puppet whispered on from the part he could see and counted the number
 * he started on, so he says one too many.
 *
 * Nothing is invented. Whispering from `shown` up to five and counting the start
 * names `5 − shown + 1` numbers, which is `hidden + 1` — and that is exactly what
 * `a_verify_countback_slip_v1` returns as `wrong` for `{a: 5, b: shown}`, beside
 * the true partner as `correct`. QG-11 recomputes both halves from those params
 * and checks the prompt really shows the puppet's number, so the slip is a
 * genuine misconception output rather than an authored one. The word "wrong"
 * never appears — "Oh no! Pip got mixed up" is the band's form.
 *
 * THE RECIPE'S OWN SLIP IS ON THE PAGE AS AN OPTION (header disclosure 1): "the
 * part he could see" is offered wherever an honest value exists for it, so a
 * child who holds that misconception meets it here as a live temptation even
 * though the puppet is not the one making it.
 *
 * A THIRD OPTION, AND ITS SIDE IS DRAWN — but the truth can never be the BIGGEST
 * number on this page, and that is structural rather than a defect. In any
 * error-analysis item the puppet's number is never the answer, so a two-option
 * page is scored by elimination alone; a01 established the third-option fix and
 * the ceiling it reaches. Here the puppet's number is `hidden + 1` by
 * construction, so something on every page is above the truth and the truth is
 * either the smallest or the middle. Both are reachable at two of the four cells
 * and the side is drawn there, which is as far as the shape goes: measured
 * 47.6–53.4% smallest and 46.6–52.4% middle over 500 packs and this generator's
 * three slots, with every value 1–4 keyed on 21.8–29.0% of draws, against the 95%
 * at which `bb-answer-entropy-test` calls a rank constant.
 *
 * THE OPTIONS ARE ENUMERATED FROM THE CELL, not chosen per cell by hand, so a
 * value that would collide with the truth or with the puppet's own number drops
 * out rather than being special-cased. Four honest values exist at all:
 *   the part on show    the recipe's own slip (disclosure 1), live wherever it
 *                       is distinct from the puppet's number
 *   two whispers on     the same off-by-one made twice
 *   one whisper short   the frame left unfilled
 *   the whole, 5        what the frame HOLDS, offered only where nothing else
 *                       lies above the truth, which holds its offer rate to
 *                       37.0–39.0% of pages rather than three quarters of them
 *
 * THE SCENE CARRIES NO COUNT, and that is a guard fix rather than a style one.
 * With the part on show inside the bracket the prompt's tokens were `{shown,
 * said}` — and `{4, 2}` and `{2, 4}` COMMUTE, so `drawUniqueItem` read the
 * one-hiding and three-hiding cells as the same surface and refused the second.
 * Four cells collapsed to three unequal classes, and the mastery slots that draw
 * last were left holding the heavy ones: measured, Form B keyed a hidden part of
 * two on 46.8% of draws and the middle rank on 92.3%. With `said` as the only
 * numeral every cell has its own signature, the four are equally weighted, and
 * both forms come back to 25% a cell.
 */
function puppetCountsOn(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const shown = r.int(1, TOTAL - 1);
      const hidden = TOTAL - shown;
      const said = hidden + 1;
      const puppet = r.pick(PUPPETS);
      const above: Array<{ text: string; errorTag: ErrorTag; rationale: string }> = [];
      const below: Array<{ text: string; errorTag: ErrorTag; rationale: string }> = [];
      const offer = (v: number, errorTag: ErrorTag, rationale: string) => {
        if (v < 1 || v > TOTAL || v === hidden || v === said) return;
        const side = v > hidden ? above : below;
        if (side.some((w) => w.text === String(v))) return;
        side.push({ text: String(v), errorTag, rationale });
      };
      offer(shown, 'concept-misconception', 'The part on show, given as the part hiding - the recipe slip, live on the page.');
      offer(hidden + 2, 'procedure-slip', 'The whisper counted the start AND ran a box past the frame.');
      offer(hidden - 1, 'procedure-slip', 'The whispering stopped a box early, so the frame was never filled.');
      // The whole frame is held back to the cells where nothing else lies above
      // the truth; offered everywhere it fits, it would reach three quarters of
      // the pages while never being right (kit §E2.11).
      if (above.length === 0) {
        offer(TOTAL, 'representation-misread', 'What the frame HOLDS, answered instead of the part under the card.');
      }
      const side = above.length > 0 && below.length > 0 ? (r.chance(0.5) ? above : below) : above.length > 0 ? above : below;
      const third = side[side.length === 1 ? 0 : r.int(0, side.length - 1)];
      const { choices, correctKey } = makeChoices(r, String(hidden), [
        {
          text: String(said),
          errorTag: 'procedure-slip' as ErrorTag,
          rationale: 'Counted the number he started on as a whisper, so the count ran one too far.',
        },
        third,
      ]);
      const scene = COVERED_ALT;
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(scene, `Oh no! ${puppet} got mixed up and says ${String(said)}. Tap the right number.`),
        figure: tenFrame(shown, {
          size: TOTAL,
          hidden,
          coverStyle: 'single',
          alt: COVERED_ALT,
          asserts: assertsAnswerOf('hidden'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(hidden)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_verify_countback_slip_v1',
          params: { a: TOTAL, b: shown },
          seed: r.uint(),
        },
        hintLadder: hints('Count on with the puppet, out loud.', 'The first whisper is the next box, not this one.'),
        errorTags: ['procedure-slip', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — draw the missing part
// ===========================================================================

/**
 * The bond in the PRODUCTION direction: the frame is short of five and the child
 * puts the rest in.
 *
 * The family builds a frame to a number it is given (`tenFrameBuild`) and reads
 * the gaps in one somebody else filled (`tenFrameEmpty`), but never asks for the
 * missing part to be MADE — and making it is a different act from naming it. It
 * is also the visible rung directly below the hiding game, which is why it opens
 * the week and returns on Day 2: the gaps can be counted here, and on Day 3 the
 * same gaps go under a card and have to be reasoned about instead.
 *
 * The answer is still code-computed — `a_frame_empty_v1` re-derives `cap −
 * filled` from the same params the frame is drawn from — and the picture asserts
 * that quantity, so a frame drawn one counter out fails QG-13 rather than
 * shipping.
 */
function drawTheRest(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const filled = r.int(1, TOTAL - 1);
      const rest = TOTAL - filled;
      const scene = `a five-frame with ${countNoun(filled, 'counters')} and some empty boxes`;
      const draft: ItemDraft = {
        type: 'drawing',
        prompt: scenePrompt(scene, 'Draw counters until the frame is full.'),
        figure: tenFrame(filled, { size: TOTAL, alt: GAPPY_ALT, asserts: assertsAnswerOf('empty') }),
        answer: {
          value: String(rest),
          acceptableForms: [`${countNoun(rest, 'counters')} drawn`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_empty_v1', params: { filled, cap: TOTAL }, seed: r.uint() },
        hintLadder: hints('A full frame has no gaps left.', 'Draw into each gap, one at a time.'),
        errorTags: ['procedure-slip', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'make-the-missing-part' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — the Day-4 real-world partner pictures
// ===========================================================================

/**
 * The multi-step row is switched OFF for this band, and the profile means it:
 * one pictured real-world move is what a four-year-old's word problem IS, rather
 * than a two-step with a step taken out. The
 * family carries no story generator, so the two frames live here — and both keep
 * the five-frame as a five-frame, because a picture is only honest about what it
 * actually draws. What the story adds is a PERSON doing the thing, which is what
 * turns the week's move into something a child recognises from the kitchen
 * table.
 *
 * `cardStory` states the whole in the sentence ("Bela puts 5 counters in"), so
 * five is a given the child hears before the picture is described; the part
 * hiding is the answer and appears nowhere. `fillStory` states no number at all
 * and asks for the gap, so the picture's own gaps are the data.
 */
function cardStory(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const shown = r.int(1, TOTAL - 1);
      const hidden = TOTAL - shown;
      const name = one(r);
      const scene = `a frame of ${String(TOTAL)} with ${countNoun(shown, 'counters')} showing and a card laid over it`;
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(
          scene,
          `${name} puts ${String(TOTAL)} counters in. A card hides some. How many are hiding?`,
        ),
        figure: tenFrame(shown, {
          size: TOTAL,
          hidden,
          coverStyle: 'single',
          alt: COVERED_ALT,
          asserts: assertsAnswerOf('hidden'),
        }),
        answer: {
          value: String(hidden),
          acceptableForms: [numberWords(hidden), countNoun(hidden, 'counters')],
          validation: 'exact-numeric',
          units: 'counters',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_partner_hidden_v1',
          params: { total: TOTAL, shown },
          seed: r.uint(),
        },
        hintLadder: hints('Nothing went away. It only got covered.', 'Count the part on show. Then whisper to five.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'partner-story', situationType: 'part-whole' },
      };
      return draft;
    });
}

function fillStory(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const filled = r.int(1, TOTAL - 1);
      const rest = TOTAL - filled;
      const name = one(r);
      const scene = `a five-frame with ${countNoun(filled, 'counters')} and empty boxes waiting`;
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(scene, `${name} needs a full frame. How many more counters?`),
        figure: tenFrame(filled, { size: TOTAL, alt: GAPPY_ALT, asserts: assertsAnswerOf('empty') }),
        answer: {
          value: String(rest),
          acceptableForms: [numberWords(rest), countNoun(rest, 'counters')],
          validation: 'exact-numeric',
          units: 'counters',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_empty_v1', params: { filled, cap: TOTAL }, seed: r.uint() },
        hintLadder: hints('A full frame needs every box used.', 'Count the boxes still waiting.'),
        errorTags: ['task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'fill-to-five', situationType: 'part-whole' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — Day-5 make a bond, and say it
// ===========================================================================

/**
 * The oral half of the Day-5 signature (header disclosure 5), shipped OPEN.
 *
 * The missing key and the missing `generator` are the design. Which split the
 * child chooses is not knowable in advance, so nothing can recompute it, and a
 * template claiming otherwise would be a fabricated answer wearing a checked
 * answer's clothes. The frame IS drawn — empty, and the alt says so. What is
 * asked is the sentence the four days before it were building towards: both
 * parts, out loud. It is also the one item in the week that carries a
 * justification demand, which is what §6.12 wants.
 */
function makeAndTell(): ItemGen {
  return (rng, guard, difficulty) =>
    // `_r`: this item draws NOTHING. Which bond the child makes is the child's,
    // so there is no operand to draw and no signature to keep fresh — the prompt
    // carries no numeral the guard could sign on. Kept inside `drawUniqueItem`
    // so the family's shape holds and a future numbered variant needs no rewire.
    drawUniqueItem(rng, guard, (_r) => {
      const scene = 'an empty five-frame';
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(scene, 'Fill it with five. Cover some. Say both parts.'),
        figure: tenFrame(0, { size: TOTAL, alt: scene }),
        answer: {
          value: 'the part on show and the part under the hand, said aloud',
          acceptableForms: [],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        hintLadder: hints('Choose how many to cover. Then look.', 'Say the showing part and the hidden part.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'make-and-tell' },
      };
      return draft;
    });
}

// ===========================================================================
// The family generators, bound to A12's whole and given this week's voice
// ===========================================================================

/**
 * WHY THE SAME TWO GENERATORS RUN FOUR TIMES EACH, and why that is a budget
 * rather than an accident.
 *
 * A partner of five has exactly four cells, so `partnersHiding` can print four
 * distinct pages and `partnerBox` four more. `drawUniqueItem` signs each on its
 * prompt's numeric tokens, and the two sign into different namespaces (two
 * tokens against four), so eight distinct surfaces exist and this week spends
 * exactly eight: two days plus both mastery forms for each. Spending exactly the
 * pool is what keeps every slot's served marginal uniform — the accepted draws
 * are a random permutation of the four cells, so no slot is left holding the
 * leftovers the way A1's mastery slot was (kit §E "A-band lessons", item 5).
 * Adding a ninth use of either would hand one slot a repeat.
 */
const hideSome = withPartnerChoices(
  withHints(
    partnersHiding({ total: TOTAL }),
    hints('Five sit in there. Some are just covered.', 'Say the ones showing. Then keep going to five.'),
  ),
  coveredCells,
  HIDING_VOICE,
);
const hideAgain = withPartnerChoices(
  withHints(
    partnersHiding({ total: TOTAL }),
    hints('Start on the last one showing.', 'Whisper on to five. Count those whispers.'),
  ),
  coveredCells,
  HIDING_VOICE,
);

/** The icon-as-unknown sentence: a box a four-year-old can put a finger on. */
const boxSentence = withPartnerChoices(
  withHints(
    partnerBox({ total: TOTAL }),
    hints('The box stands for the part you cannot see.', 'Both parts together must always make five.'),
  ),
  coveredCells,
  BOX_VOICE,
);
const boxAgain = withPartnerChoices(
  withHints(
    partnerBox({ total: TOTAL }),
    hints('Read the sentence out loud, slowly.', 'One part is told you. Find the other.'),
  ),
  coveredCells,
  BOX_VOICE,
);

/**
 * Day-5 production: every way to make five — and the completeness claim really
 * is checked, which it would not be without the wrapper below.
 *
 * `a_all_ways_v1` registers an `answerFor` that rebuilds the whole list, and when
 * this week was written NOTHING EVER CALLED IT: QG-5's arithmetic re-check was
 * gated on four validations, `'set'` was not among them, and dropping a pair from
 * a generated pack's answer left `validatePack` reporting 0 violations. The hole
 * was reported and has since been closed — `'set'` now sits in that list
 * (`validator.ts:471`), so the corpus checks this claim too.
 *
 * The wrapper stays, because a second check is not the same as a duplicate one:
 * it is an INDEPENDENT enumeration of the ordered pairs, built here and compared
 * with what the family drafted, the way a11 rebuilt its pattern table. Two
 * implementations that must agree is a real re-derivation; if either drifts, every
 * seed throws at once instead of one page quietly shipping short — and it is the
 * check that survives if the item's validation ever changes.
 */
function withCheckedWays(base: ItemGen, total: number): ItemGen {
  const expected: string[] = [];
  for (let a = 0; a <= total; a++) expected.push(`${String(a)}+${String(total - a)}`);
  const want = expected.join('; ');
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (draft.answer.value !== want) {
      throw new Error(`A12 withCheckedWays: the ways to make ${String(total)} came out "${draft.answer.value}", not "${want}"`);
    }
    return draft;
  };
}

const everyWay = withCheckedWays(
  withHints(
    allWaysToMake({ total: TOTAL }),
    hints('Try one part first, then grow it.', 'Stop when one side holds all five.'),
  ),
  TOTAL,
);

const spotTheGap = drawTheRest();
/**
 * Three sites, three sides of the deal. The two daily pages take one question
 * each and the two mastery forms take one each, so the sides are a property of
 * the SITE rather than of a coin thrown on the page — which is what makes them
 * idempotent when a page is rebuilt.
 */
const seeOrHideDay2 = seeOrHide(dailySide(2));
const seeOrHideDay3 = seeOrHide(dailySide(3));
const seeOrHideMastery = seeOrHide(masterySide);
const puppetMixUp = puppetCountsOn();
const storyCard = withPartnerChoices(cardStory(), coveredCells, HIDING_VOICE);
const storyFill = withPartnerChoices(fillStory(), gapCells, GAP_VOICE);
const bondAloud = makeAndTell();

// --- the five warm-ups, one format and one source week each ----------------
// A FLOOR OF THREE, and it is about the picture rather than the arithmetic. Two
// things laid out cannot make a ring — the drawing is a pair, the alt says "some
// shells in a ring", and a child looking at two shells has been told something
// that is not true of what is in front of them. Found by reading a generated
// week at seed 41, where the A1 warm-up drew two. Three is the smallest count
// the word survives. Recorded for the orchestrator: `countArrangement` takes any
// floor its caller passes, so nothing stops the next week doing it again.
const warmCountRing = warmUp(countArrangement({ min: 3, max: 5, arrangement: 'in a ring' }), 1);
const warmReadFrame = warmUp(tenFrameRead({ min: 6, max: 10, size: 10 }), 2);
const warmNextAlong = warmUp(neighbourNumber({ kind: 'after', min: 2, max: 9 }), 6);
const warmTenAnd = warmUp(teenTenAnd({ min: 1, max: 9 }), 10);
const warmWhichRow = warmUp(compareSets({ which: 'more', min: 2, max: 5 }), 5);

// ===========================================================================
// The week
// ===========================================================================

export const buildA12 = makeWeekBuilder({
  level: 'A',
  week: 12,
  conceptId: 'partners-of-5',
  conceptName: 'Partners of 5 (number bonds)',
  strandTags: ['number-sense-counting', 'addition-subtraction'],
  prerequisiteWeeks: [
    { level: 'A', week: 1 },
    { level: 'A', week: 2 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the five-frame hiding game',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Five real objects and a postcard beat anything on a screen this week: build five, slide the card across, and ask before you lift it. Lift it every single time — the reveal is what makes the hidden part feel real rather than guessed. Move the card along so the same five split a different way, and let your child slide it for you too. Mascot present.',
  },
  explanation: {
    hook: say(
      'Five buttons sit in a frame. A card slides over. Some are gone from sight. But nothing left the frame. Where did they go?',
    ),
    whyBeforeHow: say(
      'Five things can split into two parts. Nothing goes away, so we still have five. We play the five-frame hiding game. A card covers one part. That part is still there. Count what you can see. Then think about the part hiding.',
    ),
    script: [
      {
        say: say('Five counters fill this frame. Every box has one. Five!'),
        visual: 'A five-frame with all five boxes filled.',
        figure: tenFrame(5, { size: TOTAL, alt: 'a five-frame with all five boxes filled' }),
      },
      {
        say: say('Now I slide a card across. Three still show. Two hide.'),
        visual: 'The same frame, with a card lying over two of the boxes.',
        figure: tenFrame(3, {
          size: TOTAL,
          hidden: 2,
          coverStyle: 'single',
          alt: 'the same frame with three counters showing and a card over two boxes',
        }),
      },
      {
        // The recipe's discrimination, TAUGHT where one picture can be asked two
        // ways and the answer is already on the page (kit §E2.5).
        say: say('Listen hard. Sometimes I ask what you see. Sometimes what hides.'),
        visual: 'The same covered frame, asked two different ways.',
        figure: tenFrame(3, {
          size: TOTAL,
          hidden: 2,
          coverStyle: 'single',
          alt: 'the same covered frame again',
        }),
      },
      {
        say: say('Move the card. Now one shows and four hide. Still five!'),
        visual: 'The same five counters, with the card slid further along.',
        figure: tenFrame(1, {
          size: TOTAL,
          hidden: 4,
          coverStyle: 'single',
          alt: 'the same frame with one counter showing and a card over four boxes',
        }),
      },
    ],
    summary: say(
      'Five splits into two parts. Count the part you see. The rest are hiding. Both parts always make five.',
    ),
    vocabulary: [
      { term: 'partner', kidGloss: 'the other part that makes five with yours' },
      { term: 'five-frame', kidGloss: 'a row of five boxes, one counter in each' },
      { term: 'hiding', kidGloss: 'still there, but under the card' },
      { term: 'both parts', kidGloss: 'the part showing and the part hidden' },
      { term: 'make five', kidGloss: 'two parts that come to five together' },
    ],
  },
  guidedExamples: [
    {
      ...ge(12, 1, 'modeled', scenePrompt('a five-frame with 3 counters showing and a card over the rest', 'How many are hiding?'), [
        {
          teacherSay: say('Watch me. I count what I can see. One, two, three.'),
          expected: '3',
        },
        { childDo: say('Now whisper on with me to five.'), expected: '4, 5' },
        { teacherSay: say('That was two whispers. So two are hiding.') },
      ], '2'),
      visual: 'A five-frame with three counters showing and a card over two boxes.',
      figure: tenFrame(3, {
        size: TOTAL,
        hidden: 2,
        coverStyle: 'single',
        alt: 'a five-frame with three counters showing and a card over two boxes',
        asserts: assertsAnswerOf('hidden'),
      }),
    },
    {
      ...ge(12, 2, 'completion', scenePrompt('a five-frame with 4 counters and a covered box', 'Fill the box: 4 and ▢ make 5.'), [
        { teacherSay: say('Four are showing. I begin at four.'), expected: '4' },
        { childDo: say('Whisper on to five. How many whispers?'), expected: '1' },
        { teacherSay: say('One! So one hides inside the box.') },
      ], '1'),
      visual: 'A five-frame with four counters and one box covered.',
      figure: tenFrame(4, {
        size: TOTAL,
        hidden: 1,
        coverStyle: 'single',
        alt: 'a five-frame with four counters and one covered box',
        asserts: assertsAnswerOf('hidden'),
      }),
    },
    {
      ...ge(12, 3, 'prompted', scenePrompt('a five-frame with 2 counters showing and a card over the rest', 'How many can you see?'), [
        { teacherSay: say('Careful. This time the question changed.') },
        { childDo: say('Count only the ones not covered.'), expected: '2' },
      ], '2'),
      visual: 'The covered frame again, with the other question asked.',
      figure: tenFrame(2, {
        size: TOTAL,
        hidden: 3,
        coverStyle: 'single',
        alt: 'a five-frame with two counters showing and a card over the rest',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(12, 4, 'independent', scenePrompt('a five-frame with 1 counter showing and a card over the rest', 'How many are hiding?'), [
        { childDo: say('Whisper on from the one you can see.'), expected: '4' },
      ], '4'),
      visual: 'A five-frame with one counter showing and a card over four boxes.',
      figure: tenFrame(1, {
        size: TOTAL,
        hidden: 4,
        coverStyle: 'single',
        alt: 'a five-frame with one counter showing and a card over the rest',
        asserts: assertsAnswerOf('hidden'),
      }),
    },
  ],
  days: [
    // Day 1 — concept echo: the gaps you can count, then the same gaps under a
    // card, then the sentence that writes it down.
    [
      { gen: warmCountRing, diff: 1 },
      { gen: spotTheGap, diff: 2 },
      { gen: hideSome, diff: 2 },
      { gen: boxSentence, diff: 2 },
    ],
    // Day 2 — the strategy arrives (whisper on from the part you can see) and
    // with it the discrimination: the same frame, two different questions.
    [
      { gen: warmReadFrame, diff: 2 },
      { gen: spotTheGap, diff: 2 },
      { gen: seeOrHideDay2, diff: 3 },
      { gen: hideAgain, diff: 3 },
    ],
    // Day 3 — the sentence again, the discrimination again, and the puppet who
    // whispers on but counts the number he started from.
    [
      { gen: warmNextAlong, diff: 2 },
      { gen: boxAgain, diff: 3 },
      { gen: seeOrHideDay3, diff: 3 },
      { gen: puppetMixUp, diff: 3 },
    ],
    // Day 4 — the same move inside a story someone is living: one child hides
    // part of a full frame, another is short of a full one. Missing part twice,
    // once invisible and once still countable.
    [
      { gen: warmTenAnd, diff: 2 },
      { gen: storyCard, diff: 3 },
      { gen: storyFill, diff: 3 },
    ],
    // Day 5 — every way to make five, then make one of your own and say it.
    [
      { gen: warmWhichRow, diff: 2 },
      { gen: everyWay, diff: 3 },
      { gen: bondAloud, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: a number bond is not a fact to memorise yet - it is the discovery that five can come apart and still be five. The best equipment you own is one hand. Hold up five fingers, count them together, then curl some down and ask how many are still up. Straighten them again afterwards, EVERY time. That straightening is what turns a guess into knowledge; a child who is never shown the answer simply learns to guess more confidently. Two things look like errors and are not. If your child recounts all five from one after every move, that is the stage they are at rather than carelessness - ask again immediately afterwards instead of correcting. And if they answer with the part still standing up when you asked about the part curled down, they have heard the question as "how many are there" - say it again slowly and touch the folded fingers. Away from hands, this week lives in the fruit bowl, the shoe rack and the pegs on a coat: make five, hide part of it, and let them tell you what is gone.',
  ],
  /**
   * The band's sanctioned solve-and-colour page. Nothing is being decorated: a
   * child cannot colour the rest without first working out what the rest IS.
   *
   * It asks for the bond in the direction the days never do. Every day this week
   * hands the child a part and asks for its partner; here the child MAKES the
   * split themselves, by colouring, and then reads the other part off their own
   * work. It also moves the bond off the frame: five loose things in a row have
   * no boxes to count and no card to lift, so the only thing holding the whole
   * together is the child's own count — which is the test of whether five has
   * become a quantity rather than a picture.
   *
   * Every object named is actually DRAWN, and the answer is code-derived from the
   * one drawn value the prompt states.
   */
  puzzle: (r) => {
    const noun = r.pick(COUNTABLE_NOUNS);
    const k = r.int(1, TOTAL - 1);
    const scene = `${countNoun(TOTAL, noun)} laid out in a row`;
    return {
      id: 'A12-PZ-01',
      title: 'Puzzle Grove: Two Colors Make Five',
      puzzleType: 'math-art',
      prompt: [
        `[image: ${scene}]`,
        say(`Color ${countNoun(k, noun)} red.`),
        say('Color the rest blue.'),
        say('How many are blue?'),
      ].join(' '),
      // No `asserts` — see header disclosure 8. The picture's own quantity is the
      // WHOLE, and the item asks for a part that does not exist until the child
      // has coloured.
      // "IN A ROW", NEVER "IN ONE ROW". A NUMBER WORD IN AN ALT IS A NUMBER
      // (`bb-spoken-answer-test` G3, and the reason `ARRANGEMENT_ALT` exists in
      // `lib/earlynumber.ts`): the first draft read "laid out in one row" over an
      // answer of one on a quarter of draws, so the spoken line handed the answer
      // over before the question. Found by running the gate's own rules over this
      // week before wiring, not by reading.
      figure: counters(TOTAL, noun, { arrangement: 'in a row', alt: `some ${noun} laid out in a row` }),
      answer: {
        value: String(TOTAL - k),
        acceptableForms: [numberWords(TOTAL - k), countNoun(TOTAL - k, noun)],
        validation: 'exact-numeric',
      },
      hintLadder: hints('Color slowly, one at a time.', 'Now count only the blue ones.'),
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'color-both-parts' },
  sprint: null,
  mastery: [
    { gen: hideSome, diff: 2 },
    { gen: boxSentence, diff: 2 },
    { gen: seeOrHideMastery, diff: 3 },
    { gen: storyCard, diff: 3 },
    { gen: storyFill, diff: 3 },
    { gen: puppetMixUp, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh cells off a separate stream. 01: how many hide under the card. 02: the same bond written as a sentence with a box for the unknown. 03: one covered frame asked either way - what you can see, or what is hiding - so the part not asked for is a live option rather than a permanent decoy. 04: a story whose whole is stated and whose second part is under a card. 05: a story with no number stated at all, where the missing part is still an open gap. 06: the puppet who whispers on but counts the box he started from. Every slot offers three authored options and every option is a mistake this week can name - the part on show, that same part miscounted by one, the whisper that ran one box too far or stopped one short, and the whole frame on one page in three. Nothing offers 0 or a partner of 5, because a partner of five is never either. Which of the two questions slot 03 asks is dealt for the pack rather than drawn per page: one form asks what can be seen and the other asks what is hiding, so a child who answers by habit is wrong on one of them whichever habit he has. Every bond cell is spent exactly once across the daily pages and the two forms, so no slot is left holding the leftovers.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'answers-the-part-on-show',
      description:
        'Gives the part that can be seen when the question asks for the part that is hidden. The commonest partner error at this age, and not laziness: a covered part has no count to read, so the child answers the only number the picture offers.',
      exampleWrongAnswer: 'a frame with two counters showing answered "two are hiding"',
      distractorRationale:
        'Offer the part on show on every partner item in the week, and offer it again miscounted by one on a third of them. On the two discrimination pages it is keyed whenever the question names that part, so there it can never be struck out for free; on the hidden-part pages it can be struck by a child who has counted it, which leaves a two-way choice and is the floor this shape has.',
      reteachPointer: 'explanation/script[2] (one covered frame, asked two different ways)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'answers-what-the-frame-holds',
      description:
        'Answers with five - what the frame HOLDS - instead of one part of it. The frame is the most solid number on the page and it stays the same whatever the card does, so it is the number that comes to mind.',
      exampleWrongAnswer: 'asked how many hide under the card, answers 5',
      distractorRationale:
        'Offer the whole beside the parts on one draw in three of every partner item, and on the cells of the puppet page where nothing else lies above the truth. It is never the answer - a part of five is never five - so its rate is held to a bucket rather than allowed to become the option that is simply always there. Measured over 500 packs: offered on 30.0-35.0% of the partner pages and 37.0-39.0% of the puppet pages, against the 50% at which a never-keyed option counts as dead.',
      reteachPointer: 'guidedExamples/A12-GE-01 (three showing, whisper on, two hiding)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'counts-the-start-as-a-whisper',
      description:
        'Whispers on from the part showing but counts the number started on, so the answer lands one too high. This is the cost of the strategy the week teaches, and it is the slip worth catching early.',
      exampleWrongAnswer: 'whispering "three, four, five" from three showing and answering 3',
      distractorRationale:
        'Offer one more than the true partner. On the puppet page it is the number he says out loud, recomputed from the frame rather than authored. On every other partner page it is offered as the third option on a third of the draws, on whichever side of the answer an honest value exists - a partner of one has nothing below it, and one more than a partner of four is the whole frame.',
      reteachPointer: 'explanation/script[1] (the card slides across, three show and two hide)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-other-question',
      description:
        'Reads every covered frame as the same question. Once the hiding game is familiar the child stops listening and gives the partner even when the question asked for the part on show.',
      exampleWrongAnswer: 'asked how many can be seen, gives the number under the card',
      distractorRationale:
        'Ask both questions over one drawn frame and offer the other part either way. Which page asks which is DEALT for the pack rather than drawn per page: the two daily discrimination pages take one question each, and so do the two mastery forms, so every pack serves exactly two of each and neither habit can score more than two of the four - 500 packs of 500. Balancing the pool alone did not do this: measured on the pack a reader actually sat, all four asked "hiding".',
      reteachPointer: 'guidedExamples/A12-GE-03 (careful - this time the question changed)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Taking five apart into two parts and putting it back together - number bonds, met as a hiding game. We filled a five-frame, slid a card over some of the counters, and worked out how many were underneath without lifting it. We also wrote the same idea as a sentence with a box for the part we could not see, drew the missing part ourselves, and finished the week by finding every way there is to make five.',
    improvingCandidates: [
      'working out the hidden part instead of guessing at it',
      'whispering on from the part they can see, and stopping at five',
      'waiting for the end of the question before deciding which part to give',
      'treating an empty box in a sentence as something to be worked out',
      'finding more than one way to split five',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'trusting that a covered part is still there - we will keep lifting the card afterwards so the answer is checked, not taken on trust',
      },
      {
        errorTag: 'procedure-slip',
        text: 'starting the whisper on the NEXT box rather than the one already counted, which is where the off-by-one comes from',
      },
      {
        errorTag: 'task-comprehension',
        text: 'listening for which part a question wants, now that two different questions arrive over the same picture',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the part you could see and then found the hidden part without lifting the card, and you were right when we checked.',
      questionForChild: 'Hold up five fingers. Curl two down - how many are still standing?',
      schoolSyncHook: 'If bonds arrive at nursery as fingers, dominoes or a rekenrek, say so and we will hide counters the way they do.',
    },
    vocabularyForParent: [
      'number bond (two parts that make one whole)',
      'partner (the part that goes with yours to make five)',
      'five-frame (a row of five boxes, one counter to a box)',
      'whispering on (counting up from the part you can see to the whole)',
    ],
  },
});
