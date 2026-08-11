/**
 * Level A · Week 9 — "Counting 11–20" (conceptId: counting-11-20).
 *
 * Built on `makeWeekBuilder` + `lib/earlynumber`, following the SHAPE of the
 * a01/a02/a11 exemplars and none of their sentences, scenes, nouns or names.
 * FILL-ARCHITECTURE §3 row A9: anchor "ten-frame + extras"; core form "count on
 * from 10"; perceptual discrimination **thirteen vs thirty (audio!)**; puppet
 * error-analysis "counts …12, 14…"; Day-5 "match teen sets".
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **A teen number already has a ten in it, so the count never starts again
 *    at one.** The double ten-frame is where that ten becomes a thing you can
 *    see: one frame fills right up, and everything else is counted ON from it.
 *    Every day meets the pair of frames — read it, build it, read what sits
 *    outside it, and hear it.
 *  - **PAST TEN THE DIFFICULTY MOVES INTO THE EAR.** This is the one week in
 *    the level whose misconception is auditory. "Thirteen" and "thirty" differ
 *    by one soft syllable, and a four-year-old genuinely mishears it — so the
 *    week carries an item the child can only answer by LISTENING, with no
 *    picture to rescue them (disclosure 1).
 *  - **The picture is the question.** `GATE_PROFILE.A` replaces the multi-step
 *    density gate with `pictorialPerDay: 1`; every day carries figures built
 *    from the items' own drawn values. The single deliberately picture-less
 *    item is the listening one, and disclosure 1 is why.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Retrieval is 21.1%** (4 of 19 daily items): one warm-up on Days 1–4,
 *    each from a different strictly-earlier week (A2, A4, A5, A6) in a
 *    different format, and each one a generator that already ships its own
 *    authored options (disclosure 5).
 *
 * ── TEN DISCLOSURES (FANOUT kit §E2.3: document the choice in the header) ──
 *
 * 1. **THE FAMILY'S OWN teen-vs-ty TRAP CANNOT CERTIFY, AND THAT IS ARITHMETIC
 *    RATHER THAN TASTE — so this week's discrimination is a LISTENING item.**
 *    `numeralTrap({trap:'teen-ty'})` exists, its `verifyFor` is registered, and
 *    it does serve 13↔30 … 19↔90. But it decides the pair with a PICTURE: it
 *    draws `n = 10 + o` counters into a double ten-frame, whose capacity is
 *    twenty (`figures/assert.ts`: "frames must be 1 or 2"). Every -ty it offers
 *    is at least thirty, so no draw of it can ever put a -ty in the frames —
 *    the teen is the answer on 100% of draws, "tap the smaller number" scores
 *    full marks without counting or listening, and the -ty option is offered
 *    every single time and keyed never, which is the dead-option shape §E2.11
 *    forbids. It would also teach the wrong rule: a child who learns "never the
 *    big one" has learned a rule about the page, not a difference between two
 *    words.
 *
 *    Taken in the kit §E2.3 order, and the third door was the right one.
 *    - The contrast is TAUGHT where two pictures are available and the answer
 *      is already on the page: `script[1]` fills one frame and puts three
 *      outside it (thirteen), `script[2]` stands three whole towers of ten
 *      beside it (thirty), and `script[3]` says both words slowly.
 *    - It is CERTIFIED in the assessed core by `hearTheNumber` (below), which
 *      moves the decision into the channel the misconception actually lives in.
 *      The child hears a number word and taps its numeral; **which member of
 *      the confusable family is asked for is drawn independently**, so the teen,
 *      the tens name and the bare digit are each the answer a third of the time.
 *      It registers on `a_numeral_trap_v1` — the same transform the family trap
 *      uses — so the truth is still recomputed by the library, not by this file.
 *    - It is NAMED in the mistakeBank (`hears-the-tens-name`) with its
 *      distractor rationale.
 *    The missing primitive — a counter picture that can hold thirty inside the
 *    ten-frame idiom — is recorded for the orchestrator.
 *
 * 2. **THE LISTENING ITEM HAS NO PICTURE, AND THAT IS THE DESIGN.** Band A is
 *    `audioFirst`: `speakablePrompt` prepends the scene and every band-A screen
 *    autoplays it. A picture of the quantity would answer the question before
 *    the audio finished — "make sure the picture does not quietly rescue them
 *    from having to listen" is the whole brief for this cell. So the item ships
 *    no `figure` and no `[image: …]` bracket (with no figure the BRACKET is what
 *    gets spoken — `figures/prompt.ts` falls back to it — so an empty-handed
 *    bracket would have reintroduced the leak it was meant to avoid). The
 *    band-A picture gate is per DAY, not per item (`pictorialPerDay: 1`), and
 *    every day this item appears on carries two other figured items.
 *    Consequence, handled rather than ignored: a prompt with no numeral has no
 *    surface signature (`lib/guard.ts` signs on numeric tokens), so this
 *    generator carries its OWN deterministic freshness guard on the spoken
 *    word — see `freshDraft`.
 *
 * 3. **THE SPOKEN SCENE NEVER NAMES A TEEN — AND A NUMBER WORD IS A NUMBER.**
 *    Every figure in this file describes layout only: "two frames with some
 *    counters in them", "some shells in two rows on a beach towel", "two empty
 *    frames". The `[image: …]` brackets keep their counts, because that is what
 *    `signatureOf` and QG-1/QG-4 sign for operand freshness (L29) and emptying
 *    them would silently un-guard every draw; the figure `alt` is what the
 *    audio actually reads, and `speakablePrompt` prefers it. The numbers that
 *    stay in an alt are GIVENS the question itself states (`teenTenAnd`'s "ten
 *    and 3 more") or fixed structural facts of the manipulative. The word
 *    "two" survives in "two frames" for the same reason a02 kept "ten-frame":
 *    it names the apparatus, it is a thing the child SEES, and no item in this
 *    week has an answer of two.
 *
 * 4. **A9 DEEPENS A2, AND THE DELTA IS STRUCTURAL** — see `deepeningDelta`.
 *    Short form: A2 taught keeping your place inside one frame; A9 keeps the
 *    ten and moves on. What is inherited is the frame and one-to-one counting;
 *    what is new is the second frame, the count-ON (rather than count-all), the
 *    two-digit numeral, and an error channel A2 did not have — the ear.
 *
 * 5. **"FREE-ENTRY NUMERIC" IS NOT A REAL ANSWER MODE AT BAND A, so every
 *    certifying slot here carries AUTHORED options.** A pre-reader cannot type;
 *    `AnswerEntry` hands a choice-less numeric band-A item to `tapOptionsFor`,
 *    which INVENTS number buttons at render time from the answer alone. A
 *    runtime function cannot know a slot's answer RANGE, so a slot drawing
 *    11–20 was necessarily being offered 8, 9 and 10 — numbers no draw of it can
 *    key (L53). `withTapChoices` (below) replaces them with three numbers drawn
 *    from the slot's OWN range, so every option is the true answer on some other
 *    draw and nothing can be struck out unread; the rank the truth takes is
 *    dealt from `RANK_DEAL` before the wrong numbers are chosen. All four
 *    warm-ups are generators that already ship authored options
 *    (`howManyChoice`, `setForNumeral`, `compareSets`, `pickExtreme`), so this
 *    week hands the display layer no bare numeral on any page that certifies.
 *
 *    WHAT IS LEFT — AND THE FIRST VERSION OF THIS SENTENCE MISCOUNTED IT, which
 *    is worth more than the miscount. It said "three teaching pages still do".
 *    There were FIVE: the two named below, the puzzle, **and `A9-D4-01` and
 *    `A9-D4-04`**, both `exact-numeric` with no `choices` in 300 of 300 packs.
 *    A reader found them; no gate could. `bb-answer-entropy` only measures slots
 *    that HAVE options, so a slot with none is invisible to it, and the third
 *    Day-4 story was wrapped, so the day looked finished. Both are now wrapped in
 *    `withTapChoices` like every other counting slot (see `storyTowel`), and the
 *    count is back to three, re-measured over 500 packs: the Day-1 build
 *    task and the Day-5 tell-me task are `manual-review` (there is nothing to
 *    tap, and `AnswerEntry` short-circuits before the button-maker), and the
 *    puzzle's leftover count is `exact-numeric` because `Puzzle` has no `choices`
 *    field at all in `types.ts`. None of the three promotes a child. Recorded for
 *    the orchestrator: a gate asserting "no band-A item validates a numeric form
 *    without authored choices" would have caught this on the day it shipped.
 *
 * 6. **THE RANK DEAL IS A CLOSED FORM, NOT A HAND-TUNED TABLE.** Three numbers
 *    are offered and every one must be a count the slot can key, so they all
 *    live inside the slot's range — and that alone decides the ends: the lowest
 *    count in a range has nothing below it and is always the smallest number on
 *    the page, the highest is always the largest, and the second and
 *    second-highest can never reach the far rank. Left uniform that thins the
 *    middle. `RANK_DEAL` pays it back through the counts that are free to
 *    choose, with integer weights `[K−3, K−6, K−3]` over a range of `K` values,
 *    which makes each rank exactly `K/3` in expectation. Derived once, asserted
 *    at module load for every range this file uses, and MEASURED — see the
 *    report's rank tables.
 *
 * 7. **SIX THIN LOCAL GENERATORS, and why each is not in the family.**
 *    `hearTheNumber` (disclosure 1 — the family's trap decides by picture and
 *    this one decides by ear), `buildTheTeen` (`tenFrameBuild` says "Draw 3
 *    counters in the frame" — singular — beside a picture of two frames, which
 *    is a sentence a pre-reader hears and a picture that disagrees with it),
 *    `puppetSkipsOn` (the family's `puppetSlip` draws its scene as a scattered
 *    pile; a slip made while counting ON has to happen on the frames the
 *    counting-on uses), the two `countOnStory` forms and the `frames` story
 *    (the family has no counting story generator — its word problems join or
 *    take away, neither of which A9 has taught), and `tellTheTen` (the Day-5
 *    oral half). All follow the family's conventions exactly: a registered
 *    templateId, a figure from `lib/figures`, prose through `lib/format`,
 *    `authorMeta` stamped.
 *
 * 8. **THE PUPPET'S SLIP ROTATES DIRECTION, AND THE RECIPE'S OWN SLIP KEEPS THE
 *    MAJORITY.** "…12, 14…" is a SKIP, which always undercounts — so with the
 *    puppet's own number on the page the truth can never be the smallest of the
 *    three, and a child who never taps the smallest is right every time. The
 *    other half of losing your place past ten is meeting a counter twice, which
 *    overcounts, and `a_verify_count_slip_v1` derives both. So the slip is drawn:
 *    two draws in three are the recipe's skip (truth top or middle), one in
 *    three is the double-count (truth bottom), which lands each rank at a third.
 *    Both branches are the same failure — the ten was left behind and the place
 *    was lost — and neither number is invented.
 *
 * 9. **THE SIX-FAMILY IS RESERVED FOR THE TAUGHT EXAMPLE.** `hearTheNumber`
 *    draws its ones digit from {3,4,5,7,8,9} rather than the family trap's full
 *    3–9, because guided example A9-GE-03 works "six / sixteen / sixty" aloud
 *    and an assessed page that re-serves the worked example verbatim is the
 *    defect `echoesAGuidedExample` exists to stop — which cannot see this item,
 *    since its prompt carries no numeral to compare. Excluding the cell rather
 *    than nudging it keeps all three ranks at exactly a third; nudging a
 *    collision would have moved one cell of eighteen from one rank to another.
 *    Sixteen is still met all week in the counting items; it is only the trap
 *    that skips its family.
 *
 *    The Day-5 teacher's-note strip is the only strip (settled ruling
 *    2026-08-09, FILL-ARCHITECTURE §1 as amended); it is not re-disclosed here.
 *
 * 10. **THE FRESHNESS SENTENCE IN `isomorphNotes` WAS AN ASPIRATION, AND HALF OF
 *     IT IS NOW A MECHANISM.** It read "no count/noun pairing crosses from Form
 *     A", and measured over 300 packs that was false in 20.3% of them: Form B's
 *     numeral-to-set slot prints three (count, kind) pairings of its own and
 *     collides with one Form A printed. Nothing could have caught it —
 *     `drawUniqueItem` signs on the PROMPT's numeric tokens, and a group page's
 *     tokens are its three counts, so two pages naming different counts pass the
 *     guard while repeating a pairing inside them (the L52 shape: sign what the
 *     child MEETS, not what the string happens to hold).
 *
 *     `certifying` (below) makes the Form-A-to-Form-B half true by construction
 *     and leaves the daily half open with its rate written down, which is what A6
 *     did when it hit the same wall. The scope is not a shrug: Form B is the
 *     corrective form, so "not the page you have just failed" is the guarantee
 *     worth paying for, and closing the daily half as well would put a second
 *     rejection axis on a draw pool this week keeps deliberately single (see ONE
 *     RANGE, 11-20). Enforced: 0 of 2,500 Form-B pairings over 500 packs. Left
 *     open and disclosed: 8.2% of Form-B pairings recur somewhere in the days.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  countArrangement,
  howManyChoice,
  pickExtreme,
  setForNumeral,
  teenExtra,
  teenTenAnd,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsParam, counterGroups, counters, tenFrame } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn fresh per item; never hardcode a name that is also in this pool (kit §F.3). */
const NAMES = ['Sanne', 'Hugo', 'Tilly', 'Omar', 'Greta', 'Jae', 'Rosa', 'Bode'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/** The whole week lives here: past ten, where the ten stops being the answer. */
const LO = 11;
const HI = 20;
/** Both frames full. The number the apparatus itself keeps suggesting. */
const BOTH_FRAMES = 20;
/** The ten that is already counted before a teen begins. */
const TEN = 10;

// ---------------------------------------------------------------------------
// The band-A prose law, applied per SENTENCE
//
// `lib/earlynumber.ts` caps a PROMPT at ten words, which is the law — but it
// caps the whole string, so a two-sentence prompt trips a cap it does not break
// while a hint ladder is not capped at all. `bb-readability-test` measures every
// SENTENCE on every child-facing surface with its own splitter and word counter;
// this mirrors both exactly, and it is applied to every child-facing string this
// file authors, so an eleventh word throws the moment the module loads or the
// item is drawn.
//
// `[image: …]` alt text is EXEMPT and never passes through here — it is what a
// screen-reader child has INSTEAD of the picture.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A9: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** `[image: <scene>] <question>` — the scene is the spoken picture, not a sentence the child reads. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** A hint ladder, word-capped and (by construction here) name-free and number-free. */
function hints(...rungs: string[]): string[] {
  return rungs.map(say);
}

/**
 * Re-voice a shared generator's hint ladder without touching the shared library.
 *
 * The ladder DEDUP counts a template at most twice across the non-retrieval
 * core, and this week runs fifteen core items over eleven generators, so the
 * ladders are budgeted before the days are (kit §E "A-band lessons", item 1).
 * Beyond the budget: all 24 Level-A weeks draw on the same family, so shipping
 * its built-in ladders verbatim would make every A week hint identically —
 * invisible to the per-pack gates and exactly what `bb-cross-week-test` looks
 * for. The advice genuinely differs here too: past ten every rung has to say
 * "keep the ten and move on", which is not what a 1–10 ladder says.
 *
 * Works entirely inside the returned closure, takes no rng draw and leaves the
 * prompt untouched, so the QG-1/QG-4 surface signature is unchanged.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * A warm-up: the same family item, flagged as retrieval and pointed at its week.
 *
 * `GATE_PROFILE.A.warmupFormats` is 0 — retrieval is permitted, not demanded —
 * so each warm-up has to earn its slot. All four are the substrate this week
 * stands on: counting a set to ten (A2), matching a numeral to a set (A4),
 * deciding which row has more (A5), and picking the biggest of three (A6).
 * Retrieval items are exempt from the ladder dedup and from the cross-week
 * ladder scan, so these keep the family's own hints: a warm-up should sound
 * like the week it came from, not like this one.
 */
/**
 * DON'T PUT THE SAME NUMBER OF COUNTERS IN THE FRAMES TWICE.
 *
 * Found by reading the generated week, not by a gate. Day 1 reads the frames and
 * then composes a teen from them, and on seed 1 both landed on sixteen: "How
 * many counters in both frames?" answered 16, and directly below it "Ten and 6
 * more. What number?" answered 16 off a picture that looks identical. The pack
 * guard cannot see it, because the composition item's prompt carries the EXTRAS
 * as its only numeral (`computation|1tok|6`) while the read carries the total
 * (`computation|1tok|16`) — two namespaces, one picture. Measured before this
 * wrapper: a repeated double-frame count in 300 of 300 packs.
 *
 * So the signature is taken from the PICTURE rather than from the prompt, which
 * is the surface a child actually meets (L52). Applied innermost, so a redraw
 * costs no option draws; bounded and deterministic, never a loop that runs until
 * it succeeds (L19). Eleven double-frame pages draw from ten counts, so one
 * repeat is arithmetically forced — what this removes is the repeat landing on
 * the SAME DAY, and it is measured rather than assumed.
 */
function notAlreadyOnFrames(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 6 && guard.taken(`a9-frames|${String(figureHolds(draft))}`); k++) {
      draft = base(rng, guard, difficulty);
    }
    guard.add(`a9-frames|${String(figureHolds(draft))}`);
    return draft;
  };
}

function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// THE FRESHNESS CLAIM, ENFORCED ON THE HALF THAT CERTIFIES (disclosure 10)
// ===========================================================================

/**
 * Every (count, kind) pair an item actually PRINTS, read off its own params.
 *
 * Two shapes carry them in this week: a counted picture states one pair
 * (`{n, noun}`), and a numeral-to-set page states three, one per drawn group
 * (`{counts[], nouns[]}`). Slots that print no kind at all — the frame read, the
 * composed teen, the listening item — return nothing and are simply not covered,
 * which is the honest scope rather than a gap papered over.
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
 * WHY A WRAPPER AND NOT A WIDER GUARD. `drawUniqueItem` signs on the prompt's
 * numeric tokens, so it already forces every mastery prompt apart; what it
 * cannot see is that Form B slot 05 drew a group of 13 apples when Form A slot
 * 02 printed 13 apples in a row. Signing (count, kind) pack-wide instead would
 * fix that and cost more than it buys: eleven counting pages plus six group
 * pages draw against ten counts, so the pool is already tight (see the note on
 * ONE RANGE, and `notAlreadyOnFrames`), and rejecting on a second axis across
 * the whole pack leaves the LAST slots to draw holding whatever the earlier ones
 * did not want — the A1 marginal defect this file was built to avoid.
 *
 * So the enforcement is scoped to the guarantee that matters: a child who has
 * just failed Form A must not meet Form A's own surfaces again on the corrective
 * form. Form A draws once and registers what it printed; Form B redraws, bounded
 * at twelve tries and deterministic, until nothing it prints is on that list.
 * Form A itself is untouched, so its draws are exactly what they were.
 *
 * Idempotent under the assembler's own Form-B core-collision redraw: the first
 * entry for a slot is Form A and every later entry is Form B, so a rebuilt Form-B
 * draft is re-checked against the same list rather than corrupting it.
 */
function certifying(base: ItemGen, slot: number): ItemGen {
  const mine = `a9:mform|${String(slot)}`;
  return (rng, guard, difficulty) => {
    if (!guard.taken(mine)) {
      guard.add(mine);
      const draft = base(rng, guard, difficulty);
      for (const q of printedPairs(draft)) guard.add(`a9:formA|${q}`);
      return draft;
    }
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 12 && printedPairs(draft).some((q) => guard.taken(`a9:formA|${q}`)); k++) {
      draft = base(rng, guard, difficulty);
    }
    return draft;
  };
}

/**
 * Freshness for an item whose prompt carries no numeral.
 *
 * `drawUniqueItem` signs on the prompt's numeric tokens and returns null for a
 * prompt with none, so the listening item is unguarded by construction
 * (disclosure 2). This is the same contract with an explicit signature instead:
 * bounded, deterministic, and it registers what it accepted so a later day
 * cannot serve the same spoken word.
 */
function freshDraft(
  rng: Rng,
  guard: TupleGuard,
  build: (r: Rng) => ItemDraft,
  sigOf: (d: ItemDraft) => string,
): ItemDraft {
  let draft = build(rng);
  for (let k = 0; k < 12 && guard.taken(sigOf(draft)); k++) draft = build(rng);
  guard.add(sigOf(draft));
  return draft;
}

// ===========================================================================
// THE RE-DERIVATION GUARD — because QG-5 stops auditing a slot the moment it
// carries authored options
// ===========================================================================

/**
 * QG-5's arithmetic re-check is enabled for `exact-numeric`,
 * `equivalent-numeric`, `equivalent-fraction`, `ordered-list` and `set` — and
 * NOT for `choice-key`. So the moment a certifying slot gets the authored
 * options band A requires (disclosure 5), the central arithmetic audit stops
 * covering it. A clean negative control proved it: a pack asserting a six-corner
 * shape is a "square" produced zero violations.
 *
 * This is that audit, rebuilt locally and INDEPENDENTLY. It never asks the
 * library what the answer is; it recomputes the answer from the generator's own
 * params using a second implementation written here, and throws if that
 * disagrees with the value the item keyed or with the quantity the picture is
 * drawn from. It is not a comment about the invariant — it is the invariant.
 */
interface Rederivation {
  /** The answer, recomputed from `generator.params` alone. */
  answer: (p: Record<string, unknown>) => number;
  /** How many things the item's own picture must hold, given that answer. */
  drawn: (answer: number) => number;
}

const REDERIVE: Record<string, Rederivation> = {
  // The frame read: the answer IS what the frames hold.
  a_frame_read_v1: { answer: (p) => intParam(p, 'n'), drawn: (a) => a },
  // A counted arrangement (row, two rows, or the story frames): likewise.
  a_count_v1: { answer: (p) => intParam(p, 'n'), drawn: (a) => a },
  // "Ten and o more": a full ten plus the extras, and the picture holds both.
  a_teen_ten_and_v1: { answer: (p) => TEN + intParam(p, 'o'), drawn: (a) => a },
  // "n is ten and how many more?": the answer is what sits OUTSIDE the ten, so
  // the picture holds ten more than the answer. A guard that forgot this would
  // be an echo of the generator rather than a check on it.
  a_teen_extra_v1: { answer: (p) => intParam(p, 'n') - TEN, drawn: (a) => a + TEN },
};

function intParam(p: Record<string, unknown>, key: string): number {
  const v = p[key];
  if (typeof v !== 'number' || !Number.isInteger(v)) {
    throw new Error(`A9 re-derivation: param '${key}' is missing or not a whole number`);
  }
  return v;
}

/** How many things a figure this file emits actually draws. */
function figureHolds(draft: ItemDraft): number {
  const fig = draft.figure;
  if (!fig) throw new Error('A9 re-derivation: a picture-bearing slot lost its figure');
  if (fig.type === 'ten-frame') return fig.params.filled;
  if (fig.type === 'counters') return fig.params.groups.reduce((acc, g) => acc + g.count, 0);
  throw new Error(`A9 re-derivation: no counter reading for a ${fig.type} figure`);
}

/**
 * Prove a drafted item's keyed option against the params, the picture and the
 * range it is allowed to key. Called on every authored-option slot in the week.
 */
function certify(draft: ItemDraft, expected: number, lo: number, hi: number): void {
  const id = draft.generator?.templateId ?? 'an item';
  if (expected < lo || expected > hi) {
    throw new Error(`A9 certify: ${id} answered ${String(expected)}, outside its own ${String(lo)}-${String(hi)} range`);
  }
  const keyed = draft.choices?.find((c) => c.isCorrect);
  if (!keyed) throw new Error(`A9 certify: ${id} has no option marked correct`);
  if (keyed.text !== String(expected)) {
    throw new Error(`A9 certify: ${id} keyed "${keyed.text}" but its params recompute ${String(expected)}`);
  }
  if (draft.answer.value !== keyed.key) {
    throw new Error(`A9 certify: ${id} points at key "${draft.answer.value}" but the correct option is "${keyed.key}"`);
  }
  const texts = draft.choices?.map((c) => c.text) ?? [];
  if (new Set(texts).size !== texts.length) {
    throw new Error(`A9 certify: ${id} offers the same number twice (${texts.join('/')})`);
  }
}

// ===========================================================================
// The three numbers a tapped counting page puts in front of the child
// ===========================================================================

/**
 * A wrong count is not a random number: it is a specific thing that went wrong on
 * a specific picture, and the rationale has to say which. `over(k)` describes a
 * total that has run k past the drawing, `under(k)` a total that has stopped k
 * short of it, and `capacity` the case where the child reports how much the
 * apparatus could hold. These strings reach a teacher's report and never a
 * child's page — the child sees a bare numeral — so the ten-word law is off here.
 */
interface CountVoice {
  over: (k: number) => string;
  under: (k: number) => string;
  /** Only the frames have a capacity to answer instead of what sits in them. */
  capacity?: string;
}

/** The pair of frames. The ten is settled before the counting starts, so anything
 *  that goes wrong goes wrong out among the extras. */
const FRAME_VOICE: CountVoice = {
  over: (k) =>
    `Runs ${k === 1 ? 'one' : 'two'} past the frames: the ten held, then ${k === 1 ? 'an outside counter answered to two number words' : 'two outside counters each answered to two number words'}.`,
  under: (k) =>
    `Lands ${k === 1 ? 'one' : 'two'} short of the frames: the count-on jumped ${k === 1 ? 'a number' : 'two numbers'}, which is the "twelve, fourteen" slip made ${k === 1 ? 'once' : 'twice'}.`,
  capacity:
    'The apparatus answered in place of its contents - two frames hold twenty however few counters are sitting in them.',
};
/** A plain line of things. There is a route through it, and every failure here is
 *  the finger and the voice coming apart along that route. */
const ROW_VOICE: CountVoice = {
  over: (k) =>
    `Runs ${k === 1 ? 'one' : 'two'} past the line: the finger backtracked, so ${k === 1 ? 'one thing collected a spare number word' : 'two things collected a spare number word each'}.`,
  under: (k) =>
    `Lands ${k === 1 ? 'one' : 'two'} short of the line: a long unstructured row is where the ten is dropped and the tail is hurried.`,
};
/** Just the extras, with the ten hidden under a hand. Whatever goes wrong has to
 *  happen at the boundary between what is covered and what is not. */
const EXTRA_VOICE: CountVoice = {
  over: (k) =>
    `The ten leaks into the answer: ${k === 1 ? 'one counter still inside the full frame gets' : 'two counters still inside the full frame get'} counted as though ${k === 1 ? 'it were' : 'they were'} an extra.`,
  under: (k) =>
    `The hand covering the ten also covered ${k === 1 ? 'one of the extras' : 'two of the extras'}, so ${k === 1 ? 'it never reached' : 'they never reached'} the count.`,
};

/**
 * WHICH RANK THE TRUTH TAKES, and the deal is arithmetic rather than taste
 * (LEARNINGS L43, kit §E2.11).
 *
 * Three numbers are offered and every one of them must be a count the slot can
 * actually key, so they all live inside the slot's own range `[lo, hi]`. That
 * alone decides the four end counts: `lo` has nothing below it and is ALWAYS the
 * smallest number on the page; `hi` is always the largest; `lo+1` can never be
 * the largest of three (only one count sits below it) and `hi-1` can never be
 * the smallest. Every other count is free to take any rank.
 *
 * Writing `K` for the number of counts in the range and `I = K - 4` for the free
 * ones, the four ends contribute one draw each to ranks 1, 2, 2 and 3. Making
 * every rank land on `K/3` therefore needs the free counts to supply
 * `K/3 - 1`, `K/3 - 2` and `K/3 - 1` — which, cleared of fractions, is the
 * integer weight triple `[K-3, K-6, K-3]` out of `3(K-4)`. It needs `K >= 6`,
 * and both ranges this file uses satisfy that: 11-20 gives `[7, 4, 7]` out of
 * 18, and 1-9 gives `[6, 3, 6]` out of 15.
 */
interface RankDeal {
  /** Weight for rank 1 / 2 / 3, in units of `outOf`. */
  weights: readonly [number, number, number];
  outOf: number;
}

function rankDeal(n: number, lo: number, hi: number): RankDeal {
  const K = hi - lo + 1;
  const outOf = 3 * (K - 4);
  if (n === lo) return { weights: [outOf, 0, 0], outOf };
  if (n === lo + 1 || n === hi - 1) return { weights: [0, outOf, 0], outOf };
  if (n === hi) return { weights: [0, 0, outOf], outOf };
  return { weights: [K - 3, K - 6, K - 3], outOf };
}

/** Candidate totals that overshoot `n` and still lie inside what the slot can key,
 *  closest first; on the frame pages the drawing's capacity joins them. */
function optionsAbove(n: number, voice: CountVoice, hi: number): number[] {
  const menu = voice.capacity ? [n + 1, n + 2, BOTH_FRAMES] : [n + 1, n + 2];
  return [...new Set(menu)].filter((v) => v > n && v <= hi);
}
/** Candidate totals that fall short of `n` and still lie inside the slot's range. */
function optionsBelow(n: number, lo: number): number[] {
  return [n - 1, n - 2].filter((v) => v >= lo);
}

/**
 * The deal is checked against the two menus at module load for every range this
 * file uses, so an impossible rank throws here rather than at some unlucky seed.
 */
for (const [lo, hi] of [[LO, HI], [1, 9]] as const) {
  if (hi - lo + 1 < 6) throw new Error(`A9 rankDeal: a range of ${String(hi - lo + 1)} counts cannot balance three ranks`);
  const totals = [0, 0, 0];
  for (let n = lo; n <= hi; n++) {
    const { weights, outOf } = rankDeal(n, lo, hi);
    if (weights[0] + weights[1] + weights[2] !== outOf) {
      throw new Error(`A9 rankDeal: the weights for ${String(n)} in ${String(lo)}-${String(hi)} do not sum to ${String(outOf)}`);
    }
    for (const voice of [FRAME_VOICE, ROW_VOICE, EXTRA_VOICE]) {
      const above = optionsAbove(n, voice, hi).length;
      const below = optionsBelow(n, lo).length;
      const room = [above >= 2, above >= 1 && below >= 1, below >= 2];
      weights.forEach((w, rank) => {
        if (w > 0 && !room[rank]) {
          throw new Error(`A9 rankDeal: a count of ${String(n)} cannot sit at rank ${String(rank + 1)} of three`);
        }
      });
    }
    weights.forEach((w, rank) => { totals[rank] += w / outOf; });
  }
  const want = (hi - lo + 1) / 3;
  for (const t of totals) {
    if (Math.abs(t - want) > 1e-9) {
      throw new Error(`A9 rankDeal: range ${String(lo)}-${String(hi)} deals ${totals.map((x) => x.toFixed(3)).join('/')}, not ${want.toFixed(3)} each`);
    }
  }
}

interface TapSpec {
  voice: CountVoice;
  /** The range this slot can key — every option is drawn from it. */
  lo: number;
  hi: number;
}

/**
 * Give a counting item the three numbers it should have shipped with.
 *
 * Disclosure 5 says why the slot needs them at all. What this function insists on
 * is where they come from: nothing is written down here, everything is drawn. The
 * pool is the slot's own answer range, which is the property that matters — put a
 * numeral on the page that the range cannot produce and you have taught the child
 * to eliminate it on sight instead of to count. Beneath the truth sit totals that
 * stopped early; above it, totals that ran on; on the frame pages the drawing's
 * own capacity of twenty joins the upper pool, because a part-filled pair of
 * frames really can be answered with the number of boxes.
 *
 * The position the truth is to take is settled first (`rankDeal`), and each wrong
 * number is then explained from its VALUE rather than from the branch that chose
 * it — an explanation derived from the branch can drift away from the number it
 * is attached to, one derived from the value cannot.
 *
 * No rng is consumed ahead of `base` (L19), and neither the prompt string nor the
 * figure is touched, so the pack-wide surface signature is exactly what it was
 * before the wrapper. QG-13 still holds too: the numeral the drawing was built
 * from stays in `acceptableForms`, which is what the assertion compares against.
 */
function withTapChoices(base: ItemGen, spec: TapSpec): ItemGen {
  const { voice, lo, hi } = spec;
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const templateId = draft.generator?.templateId;
    const params = draft.generator?.params;
    if (!templateId || !params) {
      throw new Error('A9 withTapChoices: this slot arrived with no template or params, so nothing can be recomputed');
    }
    const rule = REDERIVE[templateId];
    if (!rule) throw new Error(`A9 withTapChoices: no independent re-derivation for template "${templateId}"`);

    // THE AUDIT QG-5 NO LONGER PERFORMS once the answer is a choice key.
    const n = rule.answer(params);
    if (String(n) !== draft.answer.value) {
      throw new Error(
        `A9 withTapChoices: ${templateId} keyed "${draft.answer.value}", but its params recompute ${String(n)}`,
      );
    }
    const held = figureHolds(draft);
    if (held !== rule.drawn(n)) {
      throw new Error(
        `A9 withTapChoices: ${templateId} answers ${String(n)}, but its picture draws ${String(held)} things, not ${String(rule.drawn(n))}`,
      );
    }
    if (n < lo || n > hi) {
      throw new Error(
        `A9 withTapChoices: ${String(n)} sits outside this slot's own ${String(lo)}-${String(hi)}, which would put an unkeyable number on the page`,
      );
    }

    const above = optionsAbove(n, voice, hi);
    const below = optionsBelow(n, lo);
    const { weights, outOf } = rankDeal(n, lo, hi);
    const t = rng.int(0, outOf - 1);
    const rank = t < weights[0] ? 0 : t < weights[0] + weights[1] ? 1 : 2;
    const two = (pool: number[]) => (pool.length <= 2 ? pool : rng.shuffle([...pool]).slice(0, 2));
    const oneOf = (pool: number[]) => (pool.length === 1 ? pool[0] : rng.pick(pool));
    const values = rank === 0 ? two(above) : rank === 2 ? two(below) : [oneOf(below), oneOf(above)];

    const whyWrong = (v: number): { text: string; errorTag: ErrorTag; rationale: string } => {
      if (voice.capacity && v === BOTH_FRAMES) {
        return { text: String(v), errorTag: 'representation-misread', rationale: voice.capacity };
      }
      return v > n
        ? { text: String(v), errorTag: 'procedure-slip', rationale: voice.over(v - n) }
        : { text: String(v), errorTag: 'procedure-slip', rationale: voice.under(n - v) };
    };
    const { choices, correctKey } = makeChoices(rng, String(n), values.map(whyWrong));

    // The rank that was dealt must be the rank the page actually shows.
    const shown = [n, ...values].sort((a, b) => a - b);
    if (shown.indexOf(n) !== rank || new Set(shown).size !== 3) {
      throw new Error(
        `A9 withTapChoices: dealt rank ${String(rank + 1)} but ${String(n)} came out at rank ${String(shown.indexOf(n) + 1)} of ${shown.join('/')}`,
      );
    }

    const withChoices: ItemDraft = {
      ...draft,
      choices,
      // `units` goes with the free-entry form it belonged to: the answer is now
      // a tapped key, and the numeral it stands for keeps every spoken form the
      // item already accepted, which is what QG-11 and QG-13 re-derive against.
      answer: {
        value: correctKey,
        acceptableForms: [String(n), ...draft.answer.acceptableForms.filter((f) => f !== String(n))],
        validation: 'choice-key',
      },
    };
    certify(withChoices, n, lo, hi);
    return withChoices;
  };
}

// ===========================================================================
// Local generator 1 — HEAR the number (the week's discrimination)
// ===========================================================================

/**
 * The ones digits this trap runs over: the family trap's own 3-9, less the six
 * family, which the taught example owns (disclosure 9).
 */
const HEARD_ONES = [3, 4, 5, 7, 8, 9] as const;
/** Which member of a confusable family is asked for. Drawn INDEPENDENTLY. */
const HEARD_KINDS = ['bare', 'teen', 'tens'] as const;
type HeardKind = (typeof HEARD_KINDS)[number];

/** The second implementation of the triple, used to check the first. */
function heardValue(kind: HeardKind, o: number): number {
  if (kind === 'bare') return o;
  if (kind === 'teen') return TEN + o;
  return TEN * o;
}

/**
 * A number word is spoken and the child taps its numeral.
 *
 * THREE / THIRTEEN / THIRTY is one confusable family, not a pair, and that is
 * why the bare digit is on the page rather than a manufactured third option: a
 * four-year-old who hears "thirteen" and answers 3 has heard the front of the
 * word and stopped, which is the same failure as answering 30 with one syllable
 * less of it. All three are real numerals, all three are the truth on a third of
 * draws, and none can be struck out unread.
 *
 * WHY THE KEY ROTATES ACROSS ALL THREE. The family's own picture-decided trap
 * can only ever key the teen (disclosure 1), which makes "never tap the big
 * one" worth full marks — a rule about the page instead of a difference between
 * two words. Here the member asked for is drawn independently of the ones digit,
 * so the truth is the smallest number on the page a third of the time, the
 * middle a third, and the largest a third; there is no rank, no size and no
 * shape a child can tap without listening.
 *
 * NO PICTURE AND NO BRACKET (disclosure 2): the answer must come out of the ear.
 * Registered on `a_numeral_trap_v1`, the same transform the family trap uses, so
 * QG-11 recomputes the truth from the params rather than taking this file's word
 * for it.
 */
function hearTheNumber(): ItemGen {
  return (rng, guard, difficulty) =>
    freshDraft(
      rng,
      guard,
      (r) => {
        const o = r.pick(HEARD_ONES);
        const kind = r.pick(HEARD_KINDS);
        const n = heardValue(kind, o);
        const bare = { value: o, why: 'Only the front of the word was heard, so everything after it was dropped.' };
        const teen = { value: TEN + o, why: 'The teen name heard for a word that never had a teen ending.' };
        const tens = { value: TEN * o, why: 'The tens name heard for a word that never had a tens ending.' };
        const swapTeen = 'The tens name heard for the teen name - the two differ by one soft syllable.';
        const swapTens = 'The teen name heard for the tens name - the same syllable, mistaken the other way.';
        const wrongs =
          kind === 'teen'
            ? [
              { text: String(bare.value), errorTag: 'representation-misread' as ErrorTag, rationale: bare.why },
              { text: String(tens.value), errorTag: 'concept-misconception' as ErrorTag, rationale: swapTeen },
            ]
            : kind === 'tens'
              ? [
                { text: String(bare.value), errorTag: 'representation-misread' as ErrorTag, rationale: bare.why },
                { text: String(teen.value), errorTag: 'concept-misconception' as ErrorTag, rationale: swapTens },
              ]
              : [
                { text: String(teen.value), errorTag: 'representation-misread' as ErrorTag, rationale: teen.why },
                { text: String(tens.value), errorTag: 'representation-misread' as ErrorTag, rationale: tens.why },
              ];
        const { choices, correctKey } = makeChoices(r, String(n), wrongs);
        const draft: ItemDraft = {
          type: 'representation',
          // No `[image: …]`: with no figure the bracket is what the audio reads,
          // and this item's whole point is that nothing but the word decides it.
          prompt: say(`Listen. Tap the number ${numberWords(n)}.`),
          choices,
          answer: { value: correctKey, acceptableForms: [String(n), numberWords(n)], validation: 'choice-key' },
          difficulty,
          strand: 'computational',
          isRetrieval: false,
          // `o` and `kind` ship so the guard below can rebuild `n` a second way.
          generator: { templateId: 'a_numeral_trap_v1', params: { n, trap: 'teen-ty', o, kind }, seed: r.uint() },
          hintLadder: hints('Close your eyes and listen again.', 'The ending of the word decides it.'),
          errorTags: ['representation-misread', 'concept-misconception'],
          authorMeta: { stepCount: 1, cognitiveOp: 'hear-the-number', isDiscrimination: true },
        };
        // The audit QG-5 does not run on a choice key, rebuilt from the params.
        const rebuilt = heardValue(kind, o);
        if (rebuilt !== n) {
          throw new Error(`A9 hearTheNumber: params rebuild ${String(rebuilt)} but the item drew ${String(n)}`);
        }
        certify(draft, rebuilt, Math.min(...HEARD_ONES), TEN * Math.max(...HEARD_ONES));
        if (/\d/.test(draft.prompt)) {
          throw new Error(`A9 hearTheNumber: the prompt shows a numeral ("${draft.prompt}") — the child must hear it, not read it`);
        }
        return draft;
      },
      (d) => `a9-heard|${String(d.generator?.params.n)}`,
    );
}

// ===========================================================================
// Local generator 2 — READ both frames
// ===========================================================================

/**
 * How many counters the two frames hold — the week's anchor, read.
 *
 * `tenFrameRead` cannot serve it, and this was found by reading the generated
 * week rather than by any gate: its question is "How many counters are in the
 * frame?", singular, while its own alt says "two ten-frames". A pre-reader
 * HEARS both, one after the other, on the slot that certifies the anchor. The
 * mathematics was never wrong; the sentence was about a different picture.
 *
 * Everything else is the family's: the same `a_frame_read_v1` template, the same
 * `assertsAnswer` clause proving the picture holds what the item keys, and an
 * alt that names the apparatus and never what is in it.
 */
function readBothFrames(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const scene = `two frames holding ${countNoun(n, 'counters')}`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, 'How many counters in both frames?'),
        figure: tenFrame(n, {
          size: 10,
          frames: 2,
          alt: 'two frames with some counters in them',
          asserts: assertsAnswer,
        }),
        answer: { value: String(n), acceptableForms: [numberWords(n)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_read_v1', params: { n }, seed: r.uint() },
        hintLadder: hints('The first frame fills right up.', 'Count the ones outside it on from ten.'),
        errorTags: ['representation-misread', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'read-both-frames' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — BUILD a teen across both frames
// ===========================================================================

/**
 * The frames are empty and the child puts the counters in.
 *
 * `tenFrameBuild` cannot serve this: its prompt says "Draw 3 counters in the
 * frame", singular, beside a picture of two frames — a sentence a pre-reader
 * HEARS while looking at something that disagrees with it. Everything else is
 * the family's: the answer is the drawn `n`, the frames carry no assertion
 * because an empty frame is the workspace rather than a claim, and it registers
 * on `a_frame_build_v1`.
 *
 * It is the harder half of the anchor. Nothing can be read at a glance from an
 * empty pair of frames, so the child has to fill the first one to its end and
 * count ON — which is the one strategy this week must not let them skip.
 */
function buildTheTeen(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const scene = 'two empty frames';
      const draft: ItemDraft = {
        type: 'drawing',
        // GIVEN, not a leak: the question itself says how many to put in.
        prompt: scenePrompt(scene, `Put ${String(n)} counters in the frames.`),
        figure: tenFrame(0, { size: 10, frames: 2, alt: scene }),
        answer: {
          value: String(n),
          acceptableForms: [`${countNoun(n, 'counters')} drawn`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_build_v1', params: { n }, seed: r.uint() },
        hintLadder: hints('Fill the first frame right to the end.', 'Then keep counting into the second frame.'),
        errorTags: ['procedure-slip', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'build-teen' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — help the puppet, who lost the place counting ON
// ===========================================================================

/**
 * The band-A error-analysis form, on the apparatus the counting-on happens on.
 *
 * `puppetSlip` draws its scene as a scattered pile, which is A1/A2's picture: a
 * slip made while counting ON has to happen on the frames, or the child cannot
 * see where the ten stopped and the extras began. Everything else is the
 * family's rules kept: a NAMED puppet made the slip, the child fixes it by
 * TAPPING, the word "wrong" never appears, and the numeric truth is recomputed
 * by the registered `a_verify_count_slip_v1` — which also derives the puppet's
 * own number, so QG-11 proves both halves.
 *
 * The slip's DIRECTION is drawn (disclosure 8): two draws in three are the
 * recipe's "…12, 14…" skip, one in three is a counter met twice. Without that,
 * the puppet's number is always below the truth and "never tap the smallest"
 * answers the page.
 */
function puppetSkipsOn(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      // 13-18 keeps every number on the page inside 11-20: the child can check
      // any of them against two frames, and none of them is off the apparatus.
      const n = r.int(13, 18);
      const skipped = r.int(0, 2) !== 2;
      const slip = skipped ? 'skip-count' : 'double-count';
      const wrong = skipped ? n - 1 : n + 1;
      // Skips land the truth at the top or the middle; the double-count lands it
      // at the bottom. Weighted so all three ranks come out at a third.
      const third = skipped ? (r.int(0, 1) === 1 ? n - 2 : n + 1) : n + 2;
      const scene = `two frames holding ${countNoun(n, 'counters')}`;
      const { choices, correctKey } = makeChoices(r, String(n), [
        {
          text: String(wrong),
          errorTag: 'procedure-slip' as ErrorTag,
          rationale: skipped
            ? 'A number word went missing during the count-on, leaving the total one under what the frames hold.'
            : 'An extra beyond the ten answered to two number words, pushing the total one over what the frames hold.',
        },
        {
          text: String(third),
          errorTag: 'procedure-slip' as ErrorTag,
          rationale:
            third < n
              ? 'Two numbers were jumped over, not one - the same slip made twice while counting on.'
              : third === n + 1
                ? 'Over-corrected: a counter was met twice instead of being jumped over.'
                : 'Two of the extras each answered to a spare number word, pushing the total two over what the frames hold.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'error-analysis',
        // The puppet's number is stated on purpose - that is the form. The
        // starting total lives in the bracket, and the alt below never says it.
        // FOUND BY READING THE GENERATED WEEK, not by a gate: the first version
        // of this prompt stated the puppet's number and then stopped, so the
        // page was "Pip counts on and says 19." with no task in it at all. Every
        // gate passed it — the options were right, the picture was right, the
        // arithmetic was right, and nobody had been asked to do anything.
        prompt: scenePrompt(scene, `${puppet} counts on and says ${String(wrong)}. Tap the number the frames show.`),
        figure: tenFrame(n, {
          size: 10,
          frames: 2,
          alt: 'two frames with some counters in them',
          asserts: assertsParam('n'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_verify_count_slip_v1', params: { n, slip }, seed: r.uint() },
        hintLadder: hints('Count on together, slowly, past the ten.', 'Did every counter get its own number?'),
        errorTags: ['procedure-slip', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
      };
      // The audit QG-5 does not run on a choice key. The picture must hold the
      // truth, and the puppet's number must be the slip its template derives.
      if (figureHolds(draft) !== n) {
        throw new Error(`A9 puppetSkipsOn: the frames draw ${String(figureHolds(draft))} but the truth is ${String(n)}`);
      }
      if (wrong !== (slip === 'skip-count' ? n - 1 : n + 1)) {
        throw new Error(`A9 puppetSkipsOn: a ${slip} of ${String(n)} is not ${String(wrong)}`);
      }
      if (!draft.prompt.includes(String(wrong))) {
        throw new Error(`A9 puppetSkipsOn: the prompt does not show the puppet's ${String(wrong)}`);
      }
      certify(draft, n, LO, HI);
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — the Day-4 real-world counting-on pictures
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family has no counting story generator (its word problems join or take away,
 * neither of which A9 has taught), so the three frames live here.
 */
interface StoryFrame {
  /** The story sentence. */
  line: (name: string, noun: string) => string;
  /** What the picture actually shows — the bracket, which carries the count. */
  scene: (n: number, noun: string) => string;
  /** The SPOKEN description: layout only, never the count being asked for. */
  alt: (noun: string) => string;
  /** Which things this scene can honestly hold. */
  nouns: readonly string[];
  arrangement: string;
  onFrames?: boolean;
  ladder: string[];
}

const STORY_FRAMES: Record<'towel' | 'stall' | 'frames', StoryFrame> = {
  towel: {
    line: (name, noun) => `${name} lays some ${unitFor(2, noun)} out on a beach towel.`,
    scene: (n, noun) => `${countNoun(n, noun)} in two rows on a beach towel`,
    alt: (noun) => `some ${unitFor(2, noun)} in two rows on a beach towel`,
    nouns: ['shells', 'buttons', 'blocks'],
    arrangement: 'in two rows',
    ladder: ['Count ten of them and stop there.', 'Now carry on with the ones left over.'],
  },
  stall: {
    line: (name, noun) => `${name} sets some ${unitFor(2, noun)} out on a market stall.`,
    scene: (n, noun) => `${countNoun(n, noun)} in a long line on a market stall`,
    alt: (noun) => `some ${unitFor(2, noun)} in a long line on a market stall`,
    nouns: ['apples', 'flowers', 'balls'],
    arrangement: 'in a row',
    ladder: ['Point at each one as you count.', 'Say ten out loud, then keep going.'],
  },
  frames: {
    line: (name) => `${name} tips counters into both frames.`,
    scene: (n) => `two frames holding ${countNoun(n, 'counters')}`,
    alt: () => 'two frames with some counters in them',
    nouns: ['counters'],
    arrangement: 'in two rows',
    onFrames: true,
    ladder: ['One frame is already a whole ten.', 'Count the second frame on from ten.'],
  },
};

/** One kind of thing, counted past ten. The figure is drawn from the same `n`. */
function countOnStory(which: 'towel' | 'stall' | 'frames'): ItemGen {
  const frame = STORY_FRAMES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const noun = r.pick(frame.nouns);
      const name = one(r);
      const scene = frame.scene(n, noun);
      const spokenAlt = frame.alt(noun);
      const draft: ItemDraft = {
        type: 'word-problem',
        // The QUESTION always names the plural: `unitFor(n, …)` cannot say
        // anything else here (n >= 11), but the rule is the rule.
        prompt: scenePrompt(scene, `${frame.line(name, noun)} How many ${noun}?`),
        figure: frame.onFrames
          ? tenFrame(n, { size: 10, frames: 2, alt: spokenAlt, asserts: assertsAnswer })
          : counters(n, noun, { arrangement: frame.arrangement, alt: spokenAlt, asserts: assertsAnswer }),
        answer: {
          value: String(n),
          acceptableForms: [numberWords(n), countNoun(n, noun)],
          validation: 'exact-numeric',
          units: noun,
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_count_v1',
          params: { n, noun, arrangement: frame.arrangement },
          seed: r.uint(),
        },
        hintLadder: hints(...frame.ladder),
        errorTags: ['task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: `count-on-${which}`, situationType: 'part-whole' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — Day-5 say the number, and show where the ten is
// ===========================================================================

/**
 * The oral half of the A-band Day-5 signature, on the week's own idea: the child
 * reads the frames, says the teen, and points at the ten inside it.
 *
 * The numeral is computable and the picture is code-drawn; the TELLING is the
 * honest not-fully-computable part (§7), so it ships `manual-review` exactly as
 * the D-established convention requires — never a faked computable answer for an
 * open task. It is also the item that satisfies the dual-strand coupling gate,
 * which wants one non-computational item demanding a justification. Registered
 * on `a_frame_read_v1`, whose `answerFor` is the same numeral the child says.
 */
function tellTheTen(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const scene = `two frames holding ${countNoun(n, 'counters')}`;
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(scene, 'Say this number. Tell where the ten is.'),
        figure: tenFrame(n, {
          size: 10,
          frames: 2,
          alt: 'two frames with some counters in them',
          asserts: assertsAnswer,
        }),
        answer: {
          value: String(n),
          acceptableForms: [numberWords(n), `ten and ${numberWords(n - TEN)}`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_read_v1', params: { n }, seed: r.uint() },
        hintLadder: hints('Count out loud so we can hear.', 'Then point at the ten and explain.'),
        errorTags: ['representation-misread', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'say-and-show-the-ten' },
      };
      return draft;
    });
}

// ===========================================================================
// The family generators, bound to A9's range and given this week's voice
// ===========================================================================

/**
 * ONE RANGE, 11-20, FOR EVERY COUNTING SLOT — and the reason is measurement, not
 * neatness (kit §E "A-band lessons", item 5).
 *
 * A prompt carrying a single numeral is signed `<type>|1tok|<n>`, so all the
 * `computation` counting pages compete for one pool of ten values. When they all
 * fish from the same pool, whatever each one is handed is just a shuffle of that
 * pool, and no slot's served distribution tilts. Give one generator a shorter
 * range than its neighbours and it stops being a shuffle: the wide generator is
 * left with whatever the narrow one could not take, which is how A1 ended up with
 * a mastery slot keying "2" on 77% of its draws.
 */

/** CERTIFYING (mastery 01) — the anchor, read. Authored options, so the display
 *  layer never invents an "8" this slot cannot key. */
const frameRead = withTapChoices(notAlreadyOnFrames(readBothFrames()), { voice: FRAME_VOICE, lo: LO, hi: HI });

/** CERTIFYING (mastery 04) — the teen composed: ten and some more.
 *  `o` runs 1–10 so this slot reaches twenty ("ten and ten more"), which keeps
 *  its option range identical to every other counting slot in the week. */
const teenAndMore = withHints(
  withTapChoices(notAlreadyOnFrames(teenTenAnd({ min: 1, max: 10 })), { voice: FRAME_VOICE, lo: LO, hi: HI }),
  hints('A full ten is already sitting there.', 'Carry on counting from ten, one by one.'),
);

/** The teen decomposed — what sits OUTSIDE the ten. Its own range, its own deal. */
const teenExtraAsk = withHints(
  withTapChoices(notAlreadyOnFrames(teenExtra({ min: LO, max: HI - 1 })), { voice: EXTRA_VOICE, lo: 1, hi: 9 }),
  hints('Cover the full frame with your hand.', 'Count only what pokes out beside it.'),
);

/** Two rows, where the ten is nowhere marked and the child has to make it. */
const countTwoRows = withHints(
  withTapChoices(countArrangement({ min: LO, max: HI, arrangement: 'in two rows' }), {
    voice: ROW_VOICE,
    lo: LO,
    hi: HI,
  }),
  hints('Finish the whole upper row first.', 'Then keep the count going in the lower row.'),
);

/** CERTIFYING (mastery 02) — one long line, the hardest place to keep a ten. */
const countRow = withHints(
  withTapChoices(countArrangement({ min: LO, max: HI, arrangement: 'in a row' }), {
    voice: ROW_VOICE,
    lo: LO,
    hi: HI,
  }),
  hints('Count ten first, then stop and look.', 'Carry on from ten to the very end.'),
);

/** CERTIFYING (mastery 05) — numeral to teen set, the Day-5 match one way. */
const whichGroupShowsTeen = withHints(
  setForNumeral({ min: LO, max: HI, groups: 3 }),
  hints('Carry the spoken number with you.', 'Count each group on from ten.'),
);

/** Teen set to numeral — the same match, read the other way. */
const tapTeenNumeral = withHints(
  howManyChoice({ min: LO, max: HI, arrangement: 'in two rows' }),
  hints('Do the counting first, then read the numbers.', 'Look for the one you finished on.'),
);

/** CERTIFYING (mastery 03) — the week's discrimination, in the ear. */
const heardNumber = hearTheNumber();

const teenBuild = buildTheTeen();
const puppetLosesThePlace = notAlreadyOnFrames(puppetSkipsOn());
/**
 * The two Day-4 stories that were shipping as bare numerals, repaired.
 *
 * FOUND BY A READER, not by a gate, and it is disclosure 5's own rule broken on
 * disclosure 5's own day: `A9-D4-01` and `A9-D4-04` validated `exact-numeric`
 * with no `choices` in 300 of 300 packs, so `AnswerEntry` handed them to
 * `tapOptionsFor` and INVENTED their buttons at render time — from a function
 * that cannot know a slot draws 11-20, on the two pages of the week where the
 * count has to be made without a frame to make it in. Every
 * misconception-faithful distractor this file writes everywhere else was thrown
 * away on them. `storyStall`, the third story and the one that certifies, was
 * already wrapped, which is what made the gap invisible: the day looked done.
 *
 * The wrapper is the same one every other counting slot uses, so both now carry
 * the rank deal and the voice that belongs to their picture — the towel is two
 * loose rows with nothing grouping the ten, which is `ROW_VOICE`; the frames
 * page is the apparatus, so `FRAME_VOICE` brings its capacity of twenty along as
 * a live option. No prompt, figure or answer value changes; `withTapChoices`
 * re-derives each answer from the item's own params before it will build.
 */
const storyTowel = withTapChoices(countOnStory('towel'), { voice: ROW_VOICE, lo: LO, hi: HI });
/**
 * CERTIFYING (mastery 06) — and it is the story with NO frame in it, which is
 * the point. Slots 01 and 04 already certify the anchor; the hardest thing this
 * week asks is to make the ten yourself when nothing on the page has grouped it,
 * so the check ends on a long line of apples rather than on the apparatus.
 *
 * It is also what keeps the picture guard solvable: twelve double-frame pages
 * drawing from ten counts forces two repeats a pack, and measured, one pack in
 * four then put two of them on the same page set. Certifying here instead leaves
 * ten frame pages and ten counts.
 */
const storyStall = withHints(
  withTapChoices(countOnStory('stall'), { voice: ROW_VOICE, lo: LO, hi: HI }),
  hints('Point at each one as you count.', 'Say ten out loud, then keep going.'),
);
/** The anchor inside a story — a Day-4 teaching page. Wrapped for the reason
 *  recorded on `storyTowel`. */
const storyFrames = withTapChoices(notAlreadyOnFrames(countOnStory('frames')), {
  voice: FRAME_VOICE,
  lo: LO,
  hi: HI,
});
const day5Tell = notAlreadyOnFrames(tellTheTen());

// --- the four warm-ups, one format and one source week each ------------------
const warmCountToTen = warmUp(howManyChoice({ min: 6, max: 10, arrangement: 'in a ring' }), 2);
const warmNumeralToSet = warmUp(setForNumeral({ min: 6, max: 10, groups: 3 }), 4);
const warmWhichHasMore = warmUp(compareSets({ which: 'more', min: 5, max: 10 }), 5);
const warmBiggest = warmUp(pickExtreme({ which: 'biggest', min: 4, max: 10 }), 6);

// ===========================================================================
// The week
// ===========================================================================

export const buildA09 = makeWeekBuilder({
  level: 'A',
  week: 9,
  conceptId: 'counting-11-20',
  conceptName: 'Counting 11–20',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [{ level: 'A', week: 2 }, { level: 'A', week: 6 }],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the double ten-frame',
  deepeningDelta:
    'A2 counted 6 to 10 on one ten-frame, where the whole answer still fitted in the box and the difficulty was keeping your place inside it. A9 keeps that one-to-one counting and the frame itself, and changes three things. First the apparatus: a SECOND frame arrives, so the ten stops being the biggest thing on the page and becomes the thing that is already counted. Second the move: A2 counted every object from one; A9 counts ON from ten, which means holding a number in your head while your finger is somewhere else, and the week reads the extras both ways (ten and 3 more, and 13 is ten and how many more). Third — and this is the part A2 has no version of — the error channel moves into the EAR: eleven and twelve break the naming rule, and thirteen and thirty differ by one soft syllable, so this week carries a discrimination the child can only answer by listening. Same representation family, a range that has doubled, a strategy that replaces counting-all, and a misconception A2 could not produce.',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Two real ten-frames and twenty counters beside the screen beat anything on it — fill the first frame right up before the second is touched. Say the number words slowly and let the child watch your mouth: thirteen and thirty are told apart by the ending, not the beginning. A count that begins again at one is normal here, not an error to correct. Mascot present.',
  },
  explanation: {
    hook: say(
      'Here is a pile of shells. Too many to see at once. One frame fills right up. Ten! The rest sit outside. Now we keep going.',
    ),
    whyBeforeHow: say(
      'A teen number hides a ten inside it. So we never start again at one. The double ten-frame shows that ten. One frame fills right up. The rest sit outside it. We count those on from ten. Now listen hard. Thirteen and thirty sound almost the same.',
    ),
    script: [
      {
        say: say('Ten counters fill this frame. Watch. Ten. That is our ten.'),
        visual: 'A full ten-frame with a second, empty frame beside it.',
        figure: tenFrame(10, { size: 10, frames: 2, alt: 'a full frame and an empty one beside it' }),
      },
      {
        say: say('Now three more sit outside. Ten, eleven, twelve, thirteen. Thirteen!'),
        visual: 'The full frame, with three counters in the second frame.',
        figure: tenFrame(13, { size: 10, frames: 2, alt: 'a full frame and three counters in the next one' }),
      },
      {
        // The recipe's trap, taught where two pictures are available and the
        // answer is already on the page (disclosure 1).
        say: say('Now listen. Thirty is three whole tens. It is far past twenty.'),
        visual: 'Three tall towers, each of ten blocks, standing side by side.',
        figure: counterGroups(
          [{ count: 10, noun: 'blocks' }, { count: 10, noun: 'blocks' }, { count: 10, noun: 'blocks' }],
          { arrangement: 'towers', alt: 'three towers of ten blocks' },
        ),
      },
      {
        say: say('Thirteen keeps its ten at the front. Say both words slowly.'),
        visual: 'The thirteen frames again, pointed at while both words are said.',
        figure: tenFrame(13, { size: 10, frames: 2, alt: 'the same two frames again, one full' }),
      },
    ],
    summary: say(
      'A teen is ten and some more. Fill the ten first. Count the extras on. Listen right to the end of the word.',
    ),
    vocabulary: [
      { term: 'teen number', kidGloss: 'a number from eleven up to nineteen' },
      { term: 'count on', kidGloss: 'keep the ten and carry straight on' },
      { term: 'the extras', kidGloss: 'the ones sitting outside the full frame' },
      { term: 'twenty', kidGloss: 'both frames full, with no box left over' },
    ],
  },
  guidedExamples: [
    {
      ...ge(9, 1, 'modeled', scenePrompt('two frames holding 14 counters', 'How many counters in all?'), [
        {
          teacherSay: say('Watch me. I am not going back to one. Look, the first frame is packed. I have ten already.'),
          expected: '10',
        },
        { childDo: say('Count the extras on from ten.'), expected: '11, 12, 13, 14' },
        { teacherSay: say('Fourteen! Ten, and four more outside.') },
      ], '14'),
      visual: 'One frame filled to its last box; four counters begun in the next.',
      figure: tenFrame(14, {
        size: 10,
        frames: 2,
        alt: 'two frames with some counters in them',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(9, 2, 'completion', scenePrompt('two frames holding 19 counters', 'How many counters?'), [
        { teacherSay: say('I will begin. The first frame is full. Ten.') },
        { childDo: say('Carry on into the second frame.'), expected: '19' },
        { teacherSay: say('Nineteen! One box is still empty.') },
      ], '19'),
      visual: 'One frame packed solid; the next one holding all but its last box.',
      figure: tenFrame(19, {
        size: 10,
        frames: 2,
        alt: 'two frames with some counters in them',
        asserts: assertsAnswer,
      }),
    },
    {
      // No picture on purpose: this is the ear, not the eye (disclosure 2).
      ...ge(9, 3, 'prompted', say('Listen. Tap the number sixteen.'), [
        { teacherSay: say('Say it with me. Six-teen. It keeps the teen ending.') },
        { childDo: say('Find the number that keeps its ten.'), expected: '16' },
        { teacherSay: say('Sixty ends the other way. Listen for it.') },
      ], '16'),
      visual: 'No picture on purpose - only the three numbers to choose from.',
    },
    {
      ...ge(9, 4, 'independent', scenePrompt('11 shells in two rows on a beach towel', 'How many shells?'), [
        { childDo: say('Count ten of them, then carry on.'), expected: '11' },
      ], '11'),
      visual: 'Eleven shells laid out in two rows on a beach towel.',
      figure: counters(11, 'shells', {
        arrangement: 'in two rows',
        alt: 'some shells in two rows on a beach towel',
        asserts: assertsAnswer,
      }),
    },
  ],
  days: [
    // Day 1 — concept echo: the second frame arrives. The teen is read, made
    // from a ten, and then BUILT with nothing to read at all.
    [
      { gen: warmCountToTen, diff: 1 },
      { gen: frameRead, diff: 2 },
      { gen: teenAndMore, diff: 2 },
      { gen: teenBuild, diff: 3 },
    ],
    // Day 2 — the frames go away and the ten has to be carried: two loose rows,
    // the listening trap, and the teen read backwards.
    [
      { gen: warmNumeralToSet, diff: 2 },
      { gen: countTwoRows, diff: 2 },
      { gen: heardNumber, diff: 3 },
      { gen: teenExtraAsk, diff: 3 },
    ],
    // Day 3 — one long line with no structure at all, the trap again, and
    // "help the puppet", who lost the place counting on.
    [
      { gen: warmWhichHasMore, diff: 2 },
      { gen: countRow, diff: 2 },
      { gen: heardNumber, diff: 3 },
      { gen: puppetLosesThePlace, diff: 3 },
    ],
    // Day 4 — real-world single-step picture problems (band-A form of G7),
    // ending on one that puts the week's anchor inside a story.
    [
      { gen: storyTowel, diff: 2 },
      { gen: warmBiggest, diff: 2 },
      { gen: storyStall, diff: 3 },
      { gen: storyFrames, diff: 3 },
    ],
    // Day 5 — match teen sets both ways, then say the number and show the ten.
    [
      { gen: whichGroupShowsTeen, diff: 2 },
      { gen: tapTeenNumeral, diff: 3 },
      { gen: day5Tell, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: everything this week rests on one move - stop at ten, keep it, and carry on. A child who reaches seventeen by going right back to "one" every time is not getting it wrong; they are simply at the stage before that move, and what shifts them is a filled frame they can put a hand flat over while the rest is counted. Two things are worth knowing. Eleven and twelve are irregular - they do not announce their ten the way sixteen does - so they live in the counting pages here and not in the listening game. And thirteen against thirty is a genuine hearing problem at four: say the pair slowly in turn and let them watch how your mouth finishes, because that is where the whole difference lives. Try it away from the screen with two hands: count the ten fingers, say TEN out loud, then carry straight on along the buttons of a coat.',
  ],
  /**
   * The sanctioned band-A production puzzle, and the MAKING is the mathematics.
   *
   * Every day page hands the child a ten that is already grouped for them — the
   * first frame, the full row, the tower. Here nothing is grouped: it is a plain
   * line of buttons, and the child has to MAKE the ten before the counting-on has
   * anywhere to start. That is the week's concept applied a genuinely new way,
   * and it is why the picture is a row and not a frame.
   */
  puzzle: (r, guard) => {
    // Not the number Day 1 already built. The puzzle draws after every day, so
    // the build page's `drawing|1tok|<n>` surface is registered by now. Bounded,
    // deterministic, and the range holds eight values against one taken.
    let n = r.int(LO + 1, HI - 1);
    for (let k = 0; k < 12 && guard.taken(`drawing|1tok|${String(n)}`); k++) n = r.int(LO + 1, HI - 1);
    guard.add(`a9-puzzle|${String(n)}`);
    const scene = `${countNoun(n, 'buttons')} in one long line`;
    return {
      id: 'A9-PZ-01',
      title: 'Puzzle Grove: Colour the Ten First',
      puzzleType: 'construction',
      prompt: [
        `[image: ${scene}]`,
        say('Colour ten buttons blue.'),
        say('Colour the rest yellow.'),
        say('How many are yellow?'),
      ].join(' '),
      figure: counters(n, 'buttons', { arrangement: 'in a row', alt: 'a long line of buttons' }),
      answer: {
        value: String(n - TEN),
        acceptableForms: [numberWords(n - TEN), countNoun(n - TEN, 'buttons')],
        validation: 'exact-numeric',
      },
      hintLadder: hints('Touch ten buttons first, then colour those.', 'Now count only the ones left over.'),
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'group-a-ten-by-hand-then-read-the-remainder' },
  sprint: null,
  mastery: [
    { gen: certifying(frameRead, 0), diff: 2 },
    { gen: certifying(countRow, 1), diff: 2 },
    { gen: certifying(heardNumber, 2), diff: 3 },
    { gen: certifying(teenAndMore, 3), diff: 2 },
    { gen: certifying(whichGroupShowsTeen, 4), diff: 3 },
    { gen: certifying(storyStall, 5), diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. Nothing here is a bare numeral handed to the display layer to invent buttons around: all six slots ship their own three numbers. 01 reads the two frames; 02 counts one unstructured line; 04 composes a teen from a stated ten; 06 is a market-stall story with no frame in it at all, which is the hardest transfer the week asks for. Those four take their three numbers out of 11-20, the range the picture itself is drawn from, so no numeral on any page is one the slot could not key on some other draw - and twenty rides along on the frame pages as the apparatus answered in place of its contents, live because two full frames really are twenty on a tenth of the draws. Which of the three positions the truth will occupy is settled by weights BEFORE any wrong number exists, because eleven has nothing beneath it in the range and twenty nothing above it; without that the middle position thins out. 03 is the listening slot: a spoken word against the bare digit, the teen and the tens name, with the member asked for drawn apart from the digit, so no size, position or shape on the page survives as a shortcut and no picture is offered to lean on. 05 names a teen and asks which of three drawn groups holds it. The counting slots all share one 11-20 draw pool, so the pack-wide surface guard hands each of them a level marginal instead of leftovers. No count/noun pairing crosses from Form A into Form B, and that is now ENFORCED rather than asserted: Form B redraws, bounded at twelve tries and deterministic, until nothing it prints was printed by Form A, measured at 0 of 2,500 Form-B pairings over 500 packs. It is NOT true of the daily pages, and this sentence used to claim it was - measured, a Form-B pairing also turns up somewhere in the five days on 8.2% of Form-B pairings and in 36.2% of packs. That half is left open on purpose. Twenty-one count/kind pairings are already printed before Form B draws, the eleven double-frame pages are competing for ten counts, and refusing the daily half would add a second rejection axis to a pool this week deliberately keeps single - which is how a slot ends up holding whatever the earlier slots did not want. What the recurrence actually is, when it happens, is a different picture on a different day under a different question; what it is never is the page a child has just failed, which is the guarantee the corrective form has to make and does.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'hears-the-tens-name',
      description:
        'Hears "thirteen" and takes it for "thirty" (or the other way round). The two words differ by one soft syllable at the very end, and at four or five the ear has not sorted them yet - which is why this week carries an item the child can only answer by listening.',
      exampleWrongAnswer: 'asked for thirteen, taps 30',
      distractorRationale:
        'Offer the whole confusable family - the bare digit, the teen and the tens name - and draw which one is ASKED FOR independently of the digit, so each is the answer on a third of draws. The family\'s picture-decided trap cannot do this: a double ten-frame holds twenty at most, so every -ty it offers is unkeyable and "never tap the big one" answers the page without listening.',
      reteachPointer: 'explanation/script[2] (thirty is three whole tens, far past twenty)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'answers-the-extras',
      description:
        'Names the extras alone and drops the ten that is already sitting there - seventeen said as seven. It is what happens when the first frame stops being counted at all once it is full, and it is the commonest teen error at this age.',
      exampleWrongAnswer: 'two frames holding 17 counters answered as 7',
      distractorRationale:
        'Rather than dangle the single digit as bait, Day 2 turns it into the QUESTION - "14 is ten and how many more?" - where the extras are the truth and the miscounts around them come out of 1-9, every one of them keyable. That is the only honest home for it. On a page keying 11-20 a single digit could never be right under any draw, so putting it there would teach a child to strike out short numbers instead of to count.',
      reteachPointer: 'guidedExamples/A9-GE-01 (the packed first frame is already ten)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-the-apparatus',
      description:
        'Says twenty for any part-filled pair of frames, because twenty is what the drawing is BUILT to hold. A2 met the same reflex on a single box of ten; twice the apparatus makes it twice as tempting, and it is why the frames are never filled right up on the teaching pages.',
      exampleWrongAnswer: 'two frames holding 16 counters answered as 20',
      distractorRationale:
        'Twenty rides along on the frame pages as an ordinary member of the option pool. Calling it a lure would be false: a tenth of the draws genuinely fill both frames, and the numbers bear that out - over 600 packs per form it appears on 52.5-57.8% of the frame slots while being the true answer on 22.0-25.4% of the pages carrying it - under the 33.3% a shrug is worth. Tapping it by reflex loses; crossing it out unread loses equally often.',
      reteachPointer: 'explanation/script[0] (ten counters fill this frame - that is our ten)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'skips-a-number-counting-on',
      description:
        'The recitation outruns the finger and a number word goes missing - "…twelve, fourteen…" - leaving the total a step light. Below ten a child spots the shortfall by looking; nobody eyeballs a teen collection, so nothing catches it - and that is why this is the slip the puppet brings to A9.',
      exampleWrongAnswer: 'counts 16 counters as 15',
      distractorRationale:
        'One short and two short both sit in the option pool, so a child cannot separate them by eye and has to recount. Day 3 gives the same slip a voice: the puppet says the one-short number out loud, and the third number on the page is DRAWN rather than fixed - a two-numbers-jumped total on 46.1% of served skip pages and a met-twice total one OVER the truth on the other 53.9%, measured over 500 packs. An earlier version of this line said only "a two-numbers-jumped total beside it", which was true of fewer than half the pages it described. Both branches are needed and the arithmetic says so: the puppet\'s own number always sits one below the truth, so a third number always below it too would leave the truth highest on every skip page and "never tap the smallest" would answer them all without counting. Everything offered is inside the page\'s own 11-20, so a short answer is never a number that is short by definition.',
      reteachPointer: 'guidedExamples/A9-GE-02 (carry on into the second frame, one box at a time)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'meets-a-counter-twice',
      description:
        'An extra answers to two number words and the total overshoots. It is the skip turned round, and the week needs it: a puppet who only ever undercounts makes "never choose the lowest number" a free pass, which teaches position instead of counting.',
      exampleWrongAnswer: 'counts 14 counters as 15',
      distractorRationale:
        'One over and two over stand beside the truth wherever the range leaves room above it, mirroring the pair below. On the puppet page this is the branch that runs a third of the time, and it is what lets the true number sit lowest on the page - measured at 30.7% lowest, 36.5% middle, 32.8% highest over 600 packs.',
      reteachPointer: 'Day-3 replay: count on together and watch the finger, not the mouth',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'starts-again-at-one',
      description:
        'Counts the full frame from one every time instead of starting at ten - the stage before counting on, and not an error to correct so much as a habit to replace. It shows up as a slow, whispered recount and often still lands on the right number.',
      exampleWrongAnswer: 'counts "one, two, three…" through the full frame before reaching the extras',
      distractorRationale:
        'It produces no wrong numeral of its own, so it is met by the TASK rather than by an option: the build page hands the child an empty pair of frames, the story pages hand them no frame at all, and the puzzle makes them group the ten by hand before there is anything to count on from.',
      reteachPointer: 'explanation/whyBeforeHow (a teen number hides a ten, so we never start again at one)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Counting collections of 11 to 20, where the answer no longer fits in one ten-frame. We met the second frame: fill the first one right up, call it ten, and go on from there rather than back to the beginning. We read teen numbers as "ten and some more" and back the other way, counted long lines and loose rows where nothing groups the ten for you, and played a listening game for the two words that sound almost the same - thirteen and thirty.',
    improvingCandidates: [
      'holding on to the ten rather than restarting the count at one',
      'keeping the ten in their head while their finger is on the extras',
      'reading a teen number as ten and some more',
      'hearing the end of a number word before choosing',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'telling thirteen from thirty by ear - we will keep saying both words slowly, side by side',
      },
      {
        errorTag: 'representation-misread',
        text: 'answering the whole number rather than the counters outside the full frame',
      },
      {
        errorTag: 'procedure-slip',
        text: 'giving every extra its own number past ten, so none is jumped over or met twice',
      },
      {
        errorTag: 'task-comprehension',
        text: 'starting at ten rather than at one - the ten is already counted before we begin',
      },
    ],
    homeFocus: {
      praiseLine:
        'You held on to your ten and counted forward from it, and you waited for the end of the word before you chose.',
      questionForChild: 'Show me ten fingers. Now keep going - how many are there altogether?',
      schoolSyncHook: 'Let us know if teen numerals are being written at school yet, and the pages will follow suit.',
    },
    vocabularyForParent: [
      'teen number (eleven to nineteen - each one is ten and some more)',
      'count on (keep a number you have already reached and carry forward from it)',
      'the extras (the ones sitting outside the full ten)',
      'twenty (both frames full, with nothing left over)',
    ],
  },
});
