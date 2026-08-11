/**
 * Level A · Week 2 — "Counting 6–10" (conceptId: counting-6-10).
 *
 * Rebuilt onto `makeWeekBuilder` + `lib/earlynumber`, following the A1 exemplar's
 * shape (never its sentences or its scenes). FILL-ARCHITECTURE §3 row A2: anchor
 * "the ten-frame"; core forms frame read/build and count a row; perceptual
 * discrimination "a longer row of 5 vs a tight row of 6 — which is MORE?";
 * puppet error-analysis "skips an object mid-count"; Day-5 "match sets ↔
 * numerals".
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **Past five, the eye stops helping, so the count needs a STRUCTURE.** The
 *    ten-frame is that structure: a full row is always five, and the rest are
 *    counted ON from it. Every day meets the frame — read it, build it, read
 *    what is missing from it, and tell it apart from the box that holds it.
 *  - **Keeping your place is the new difficulty, not the size of the number.**
 *    1–5 could be seen at a glance; 6–10 cannot. So the arrangements grow
 *    (a row of ten, two rows, a loose pile) while the range stays 6–10.
 *  - **How much room a group takes up is not how many there are.** Taught in the
 *    script against two pictures, certified in the core by the frame-vs-box
 *    discrimination and by the more/fewer/same comparison (see disclosure 1).
 *  - **The picture is the question.** `GATE_PROFILE.A` replaces the multi-step
 *    density gate with `pictorialPerDay: 1`; every non-retrieval item on Days
 *    1–4 carries a figure built from its own drawn values.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Retrieval is legal here and A2 uses it.** Unlike A·W1 there IS an earlier
 *    week, and counting 1–5 is the substrate for 6–10, so one warm-up a day on
 *    Days 1–4 replays A·W1 in four different formats (4/19 items = 21.1%).
 *
 * ── FIVE DISCLOSURES (FANOUT kit §E2.3 "document the choice in the header") ──
 *
 * 1. **THE RECIPE'S OWN DISCRIMINATION CANNOT BE DRAWN, and this is provable
 *    rather than a judgement.** "A longer row of 5 beside a tight row of 6"
 *    needs two rows drawn at DIFFERENT spacings in ONE picture.
 *    `CountersParams` has no per-group spacing and `arrangement` is a property
 *    of the whole figure, not of a group; `CountersFig`'s `compare` branch
 *    computes one `pitch` from the longest row and starts every row at the same
 *    left edge. So inside one figure more counters ALWAYS occupy more width —
 *    at every arrangement, since `layout()` is linear in `pitch` for row, rows,
 *    scatter, ring and stack alike. A picture claiming otherwise would be a
 *    lying figure, which is the one thing `lib/figures.ts` exists to prevent.
 *
 *    Taken in the kit §E2.3 order. The trap is TAUGHT where two figures are
 *    available and the answer is already on the page — `script[2]` shows five
 *    buttons scattered wide, `script[3]` the same six sitting tight in the frame,
 *    and the counting settles it. It is CERTIFIED in the assessed core by the
 *    honest, drawable form of the same misconception: `frameShows` (below), where
 *    the tidy full row and the ten-cell box are both bigger-looking things than
 *    the answer, and by `compareSets`, whose one-draw-in-five equal rows make
 *    "they look alike, so count" the whole item. And it is carried by name in
 *    the mistakeBank (`longer-row-means-more`) with its distractor rationale.
 *    The missing primitive is recorded for the orchestrator.
 *
 * 2. **The `[image: …]` scene names the count the item asks for, and at band A
 *    that count is SPOKEN.** `PracticePage` autoplays `speakablePrompt` for band
 *    A, which prefers `figure.alt`; `countArrangement`'s alt is "7 ducks in a
 *    row", so a child hears "7 ducks in a row. Count the ducks. How many?" This
 *    is the rule `clockAlt` already follows in the same file ("an alt reading
 *    'half past three' would hand the answer to exactly the child who cannot see
 *    the drawing") applied inconsistently — and it affects `countArrangement`,
 *    `howManyChoice`, `tenFrameRead`, `puppetSlip` and `compareSets`, i.e. most
 *    of Level A, not this week. RESOLVED IN THE LIBRARY (B1.1): the bracket is
 *    still untouched — its number is what QG-1/QG-4 sign for operand freshness
 *    (`figures/prompt.ts` says so), so removing it would silently un-guard every
 *    draw — and the fix went where the audio actually reads from, `figure.alt`,
 *    which `speakablePrompt` prefers. See the "SPOKEN scene" section of
 *    `lib/earlynumber.ts`, and `scripts/bb-spoken-answer-test.ts`, which now
 *    fails any pack whose spoken scene discloses the item's own answer. The two
 *    alts this file authors from scratch — `frameShows` and `matchAndTell` —
 *    were already written the `clockAlt` way ("a full row and 3 counters
 *    below"), describing the picture faithfully without stating the number the
 *    child is asked for, and are unchanged.
 *
 * 3. **Three thin local generators, and why each is not in the family.**
 *    `frameShows` (the drawable discrimination of disclosure 1 — no family
 *    generator poses a ten-frame READ as a choice, and `tenFrameRead` returns a
 *    typed answer with no options to rotate), the counting story forms
 *    (`lib/earlynumber.ts` has no story generator for pure counting;
 *    `pictureJoin`/`pictureTakeAway` are addition and subtraction, which A2 has
 *    not taught), and `matchAndTell` (the Day-5 oral part: `sortAndTell` sorts
 *    three groups, which is A1's Day-5 signature, and A2's is matching a set to
 *    a named numeral). All three follow the family's conventions exactly —
 *    registered templateId, figure from `lib/figures`, prose through
 *    `lib/format`, `authorMeta` stamped.
 *
 * 4. **The Day-5 teacher's-note strip is the only strip.** FILL-ARCHITECTURE §1
 *    asks for one every day at band A; `validator.ts` S-SCHEMA rejects a strip on
 *    Days 1–4 and `PuzzleGrove.tsx` reads Day 5's, hardcoded. A1 recorded the
 *    same conflict; it blocks all 24 Level-A weeks and needs a renderer first.
 *
 * 5. **"FREE-ENTRY NUMERIC" IS NOT A REAL ANSWER MODE AT BAND A, so the three
 *    counting slots that certify now carry AUTHORED options.** A pre-reader
 *    cannot type. `AnswerEntry` hands a choice-less numeric band-A item to
 *    `tapOptionsFor`, which INVENTS four number buttons at render time — the
 *    answer plus answer±1..3, the rank rotated by a hash of the item id and the
 *    answer — so those buttons were always the real page, and no per-pack gate
 *    could see them because they never existed in the pack. The damage is
 *    arithmetic rather than bad luck: a runtime function cannot know a slot's
 *    answer RANGE, so every slot here drawing 6-10 was necessarily offered 5, 4
 *    and 3, numbers it can never key. Measured over 300 packs before the repair:
 *    the frame read offered "5" on 62.0% of Form B draws and keyed it on none
 *    (`bb-answer-entropy-test` counted 77 of 120 and called it NEVER_CORRECT),
 *    the row count offered 5 on 19.0-37.0% and 11 on 20.0-41.7%, and the basket
 *    story offered 3-5 on 20.7-41.7%. Only the first crossed the gate's
 *    half-the-draws line; all three are the same defect, and the two quiet ones
 *    were quiet because of where a hash happened to fall.
 *
 *    - **THE OPTIONS ARE COUNTS THE SLOT CAN KEY, WHICH DELETES THE DEAD NUMBER
 *      RATHER THAN DILUTING IT.** `withTapChoices` (below) offers three numbers
 *      drawn from 6-10, the range the picture itself is drawn from, so every
 *      number on the page is the true answer on some other draw of the same slot
 *      and nothing can be struck out unread. Measured over 500 packs, all three
 *      repaired slots and both forms: no option is ever never-keyed, and every
 *      value from six to ten is keyed on 15.2-23.6% of draws.
 *    - **THE RANK IS DEALT FROM A TABLE, because the range decides most of it.**
 *      Six has nothing below it and ten nothing above it inside 6-10, so a drawn
 *      six is always the smallest number on the page and a drawn ten always the
 *      largest; seven can never be the largest of three and nine never the
 *      smallest. Left to itself that thins the middle. `RANK_WEIGHTS` pays it
 *      back through the counts that are free to choose, and the result is
 *      measured over 500 packs per form: the truth is the smallest number on
 *      29.0-31.8% of draws, the middle on 32.6-37.0% and the largest on
 *      31.6-38.4%, against a 33.3% floor. "Tap the ten" — the frame's own size,
 *      offered on 63.3% of 1,000 frame-read draws — scores 19.6-23.2%.
 *    - **NO COUNT IS EVER SPOKEN, so "tap the first number you hear" has nothing
 *      to work on.** At band A `speakablePrompt` reads `figure.alt` before the
 *      question, and across 3,000 measured draws of these three slots the spoken
 *      line carries no count at all ("a ten-frame with some counters in it. How
 *      many counters are in the frame?"). The one number WORD anywhere in them is
 *      the "ten" inside "ten-frame", which names the manipulative and is this
 *      week's own vocabulary; a child who taps it every time scores 19.6-23.2%.
 *    - **FIVE IS GONE FROM THE FRAME READ, and that is the point rather than a
 *      loss.** "The full row read as the whole answer" is this week's named
 *      misconception, but a slot drawing 6-10 can never key five, so offering it
 *      there is exactly the dead option the repair exists to remove. It stays
 *      where it is honest — `frameShows` on Day 2, a teaching slot — and the
 *      mistakeBank now says so. Measured there over 500 packs it is offered on
 *      37.4% of draws, not the 27% this file used to claim: the old figure
 *      counted only the pairing that offers it deliberately and missed the draws
 *      where the honest "one counter missed" IS five, at a frame holding six.
 *    - **THE DAY PAGES THAT SHARE THESE GENERATORS CARRY THE OPTIONS TOO**, and
 *      the pages that do not certify keep their free-entry numeric — the same
 *      line A1 drew, and for the same reason: the law is about the slots that
 *      promote a child. WHAT THAT LEAVES, MEASURED OVER 300 PACKS RATHER THAN
 *      WAVED AT: three teaching pages here still hand the display layer a bare
 *      numeral and get an unkeyable button back — the A1 warm-up row of 3-5 is
 *      offered "1" and "2" on 64.0% of draws, the Day-2 two-row count is offered
 *      "5" on 59.3%, and the Day-4 frame story on 58.3%. `bb-answer-entropy-test`
 *      suppresses a NEVER_CORRECT in a day slot on purpose (a gate nobody can
 *      pass is a gate people switch off), so none of these is a finding, and none
 *      of them certifies anybody. They are named here because a rate nobody wrote
 *      down is a rate nobody fixes; `withTapChoices` takes the two non-warm-up
 *      ones as they stand. Recorded for the orchestrator.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  compareSets,
  countArrangement,
  howManyChoice,
  pickExtreme,
  puppetSlip,
  setForNumeral,
  tenFrameBuild,
  tenFrameEmpty,
  tenFrameRead,
  COUNTABLE_NOUNS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsParam, counterGroups, counters, tenFrame } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn fresh per item; never hardcode a name that is also in this pool (kit §F.3). */
const NAMES = ['Nia', 'Theo', 'Isla', 'Rafi', 'Ada', 'Milo', 'Zara', 'Otis'] as const;
const one = (r: Rng): string => r.pick(NAMES);

/** The whole week lives here: past five, where a glance stops working. */
const LO = 6;
const HI = 10;
/** The frame's capacity, and the number the box itself keeps suggesting. */
const FRAME = 10;

// ---------------------------------------------------------------------------
// The band-A prose law, applied per SENTENCE
//
// `lib/earlynumber.ts` caps a prompt at ten words, which is the law — but it
// caps the whole string, so a two-sentence prompt trips a cap it does not break
// while a hint ladder is not capped at all. `bb-readability-test` measures per
// SENTENCE with its own splitter and word counter; this mirrors both exactly and
// is applied to every child-facing string this file authors, so an eleventh word
// throws the moment the module loads or the item is drawn.
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
      throw new Error(`A2: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
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
 * core, and this week runs fifteen core items over nine family generators, so
 * the ladders have to be budgeted before the days are (kit §E "A-band lessons",
 * item 1). Beyond the budget: all 24 Level-A weeks draw on the same family, so
 * shipping its built-in ladders verbatim would make every A week hint identically
 * — invisible to the per-pack gates and exactly what `bb-cross-week-test` looks
 * for. The advice genuinely differs per arrangement too: a two-row picture wants
 * "finish the top row"; a loose pile wants "walk a path and never jump back".
 *
 * Works entirely inside the returned closure, takes no rng draw and leaves the
 * prompt untouched, so the QG-1/QG-4 surface signature is unchanged.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * A warm-up: the same family item, flagged as retrieval and pointed at A·W1.
 *
 * A2 is not the origin, so QG-2's carve-out does not apply and the 20–30% share
 * is enforced. `GATE_PROFILE.A.warmupFormats` is 0 — retrieval is permitted, not
 * demanded — so each warm-up has to earn its slot: counting 1–5 is the substrate
 * for 6–10, and each of the four replays a different A1 form (count a row, tap
 * the numeral, find the group, find the fewest) so no day repeats a format.
 *
 * Retrieval items are exempt from the ladder dedup and from the cross-week
 * ladder scan, so these keep the family's own hints: a warm-up should sound
 * like the week it came from, not like this one.
 */
/**
 * Don't BUILD the number the page above just READ.
 *
 * Found by reading the generated week, not by a gate. Day 1 reads a frame and
 * then builds one, and on two seeds running both landed on six: "How many
 * counters are in the frame?" answered 6, then "Draw 6 counters in the frame."
 * The pack guard cannot see it, because a one-token prompt is signed
 * `<type>|1tok|<n>` and the read is a `computation` while the build is a
 * `drawing` — two namespaces, one number. This re-reads the build's own drawn
 * `n` and redraws while that value is already spoken for as a COUNT anywhere in
 * the pack. Bounded and deterministic (a redraw advances the seeded stream), it
 * takes no extra rng of its own, and it leaves the prompt untouched.
 */
function notAlreadyCounted(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 12; k++) {
      const n = draft.generator?.params.n;
      if (typeof n !== 'number' || !guard.taken(`computation|1tok|${String(n)}`)) break;
      draft = base(rng, guard, difficulty);
    }
    return draft;
  };
}

function warmUp(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A', week: 1 },
  });
}

// ===========================================================================
// Authored options for the counting slots that CERTIFY
// ===========================================================================

/**
 * What a wrong number MEANS on one of this week's pictures, said in that
 * picture's own terms. `over(k)` is k things given a second number, `under(k)`
 * is k things never given one, and `box` is the frame answered instead of its
 * contents. Teacher-facing — the child only ever sees a numeral — so these are
 * not word-capped.
 */
interface CountVoice {
  over: (k: number) => string;
  under: (k: number) => string;
  /** Only a frame has a box to answer instead of what sits in it. */
  box?: string;
}

/** A frame: the full row is read, and the slip happens among the loose ones below it. */
const FRAME_VOICE: CountVoice = {
  over: (k) =>
    `${k === 1 ? 'One' : 'Two'} too many - the full row was read as five and then ${k === 1 ? 'a counter below it was' : 'two counters below it were'} met twice, so the count carried past the last one.`,
  under: (k) =>
    `${k === 1 ? 'One' : 'Two'} too few - the count carried on from five but ${k === 1 ? 'a counter below the row was' : 'two counters below the row were'} left without a number.`,
  box: 'What the frame HOLDS, answered instead of what sits in it - the box is ten whether it is full or not.',
};
/** A row: there is a line to follow, so a slip is a finger out of step with it. */
const ROW_VOICE: CountVoice = {
  over: (k) =>
    `${k === 1 ? 'One' : 'Two'} too many - the finger doubled back along the line, so ${k === 1 ? 'a thing was' : 'two things were'} given a second number.`,
  under: (k) =>
    `${k === 1 ? 'One' : 'Two'} too few - the number words ran out before the line did, which is what hurrying past six does.`,
};
/** A loose pile: nothing holds the place, so a slip is a thing met again or never met. */
const PILE_VOICE: CountVoice = {
  over: (k) =>
    `${k === 1 ? 'One' : 'Two'} too many - nothing was set aside while counting, so ${k === 1 ? 'a thing already counted came' : 'two things already counted came'} round again.`,
  under: (k) =>
    `${k === 1 ? 'One' : 'Two'} too few - the pile was read off the top and ${k === 1 ? 'one underneath was' : 'two underneath were'} never reached.`,
};

/**
 * WHICH RANK THE TRUTH TAKES, PER DRAWN COUNT — and the table is arithmetic
 * rather than taste (LEARNINGS L43, kit §E2.11).
 *
 * Three numbers are offered and every one of them must be a count this slot can
 * actually key, so they all live in 6-10. That alone decides most of the ranks:
 * six has nothing below it inside the range and ten has nothing above it, so a
 * drawn six is ALWAYS the smallest number on the page and a drawn ten is always
 * the largest. Seven cannot be the largest of three (only six sits below it) and
 * nine cannot be the smallest (only ten sits above it). Eight is the one count
 * free to take any rank.
 *
 * Left uniform over the ranks each count allows, that lands 36.7/26.7/36.7 —
 * the middle thinned by the two counts that cannot reach it. The weights below
 * (out of five) tilt the free choices toward the middle to pay that back, which
 * is what makes "tap the middle" worth no more than "tap the biggest". Measured
 * over 500 packs, both repaired slots and both forms: see the header, disclosure
 * 5. A count with no weight at a rank is a count that cannot honestly hold it.
 */
const RANK_WEIGHTS: Record<number, readonly [number, number, number]> = {
  6: [5, 0, 0],
  7: [2, 3, 0],
  8: [1, 3, 1],
  9: [0, 3, 2],
  10: [0, 0, 5],
};

/** The numbers above `n` this slot could key, nearest first; the box is one of them. */
function optionsAbove(n: number, voice: CountVoice): number[] {
  const menu = voice.box ? [n + 1, n + 2, FRAME] : [n + 1, n + 2];
  return [...new Set(menu)].filter((v) => v > n && v <= HI);
}
/** The numbers below `n` this slot could key, nearest first. */
function optionsBelow(n: number): number[] {
  return [n - 1, n - 2].filter((v) => v >= LO);
}

// The weight table is checked against the two menus at module load, so an
// impossible rank throws here rather than at some unlucky seed.
for (const [key, weights] of Object.entries(RANK_WEIGHTS)) {
  const n = Number(key);
  if (weights[0] + weights[1] + weights[2] !== 5) {
    throw new Error(`A2 RANK_WEIGHTS: the weights for ${key} do not sum to five`);
  }
  for (const voice of [FRAME_VOICE, ROW_VOICE, PILE_VOICE]) {
    const above = optionsAbove(n, voice).length;
    const below = optionsBelow(n).length;
    const room = [above >= 2, above >= 1 && below >= 1, below >= 2];
    weights.forEach((w, rank) => {
      if (w > 0 && !room[rank]) {
        throw new Error(`A2 RANK_WEIGHTS: a count of ${key} cannot sit at rank ${String(rank + 1)} of three`);
      }
    });
  }
}

/**
 * Give a counting item the three numbers it should have shipped with.
 *
 * WHY IT EXISTS. `tenFrameRead`, `countArrangement` and this file's own story
 * form all return an `exact-numeric` answer and no `choices`, and at band A that
 * is not a free-entry page: `AnswerEntry` hands a choice-less numeric item to
 * `tapOptionsFor`, which INVENTS four number buttons at render time — the answer
 * plus answer±1..3, the rank rotated by a hash of the item id and the answer. A
 * pre-reader cannot type, so those buttons were always the real page, and no
 * per-pack gate could see them because they never existed in the pack.
 *
 * The consequence is arithmetic rather than bad luck: a runtime function cannot
 * know a slot's answer RANGE, so a slot drawing 6-10 was necessarily offered 5,
 * 4 and 3 — numbers no draw of it can ever key. Measured over 300 packs before
 * this repair, the certifying frame read offered "5" on 62.0% of Form B draws
 * and keyed it on none.
 *
 * WHY EVERY OPTION IS A COUNT THE SLOT CAN KEY. The three numbers are drawn from
 * 6-10, the same range the picture is drawn from, so each of them is the true
 * answer on some other draw of the same slot and there is no value left for a
 * child to strike out unread. That is the defect deleted rather than diluted:
 * nothing is offered here that has to be argued down to a tolerable rate.
 *
 * WHICH numbers appear is decided by the draw, never authored: below the truth
 * is a thing that never got a number, above it is a thing that got two, and on a
 * frame the box's own ten is up there too. The rank the truth takes is drawn
 * first, from the counts that can honestly hold it (see `RANK_WEIGHTS`), and the
 * meaning of each wrong number is read off the VALUE rather than off the branch
 * that produced it, so a rationale cannot drift from the number it explains.
 *
 * Takes no rng draw before `base` (L19) and leaves the prompt and the figure
 * alone, so the surface signature the pack guard and QG-1 work from is unchanged
 * — the same contract `withHints` and `notAlreadyCounted` follow. The figure
 * keeps its `asserts: answer` clause and still passes QG-13, because the numeral
 * the picture is drawn from stays in the accepted forms.
 */
function withTapChoices(base: ItemGen, voice: CountVoice): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) {
      throw new Error('A2 withTapChoices: the item carries no generator params to re-count from');
    }
    // The re-derivation QG-5 no longer performs once the answer is a choice key:
    // the number keyed must be the number the picture is drawn from.
    const n = Number(params.n);
    if (!Number.isInteger(n) || String(n) !== draft.answer.value) {
      throw new Error(
        `A2 withTapChoices: ${draft.generator?.templateId ?? 'an item'} keyed "${draft.answer.value}", but its picture is drawn from n = ${String(params.n)}`,
      );
    }
    if (n < LO || n > HI) {
      throw new Error(
        `A2 withTapChoices: a count of ${String(n)} fell outside ${String(LO)}-${String(HI)}, so an option would be unreachable`,
      );
    }

    const above = optionsAbove(n, voice);
    const below = optionsBelow(n);
    const weights = RANK_WEIGHTS[n];
    const t = rng.int(0, 4);
    const rank = t < weights[0] ? 0 : t < weights[0] + weights[1] ? 1 : 2;
    const two = (pool: number[]) => (pool.length <= 2 ? pool : rng.shuffle([...pool]).slice(0, 2));
    const oneOf = (pool: number[]) => (pool.length === 1 ? pool[0] : rng.pick(pool));
    const values = rank === 0 ? two(above) : rank === 2 ? two(below) : [oneOf(below), oneOf(above)];

    const whyWrong = (v: number): { text: string; errorTag: ErrorTag; rationale: string } => {
      if (voice.box && v === FRAME) {
        return { text: String(v), errorTag: 'representation-misread', rationale: voice.box };
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
        `A2 withTapChoices: dealt rank ${String(rank + 1)} but ${String(n)} came out at rank ${String(shown.indexOf(n) + 1)} of ${shown.join('/')}`,
      );
    }

    const withChoices: ItemDraft = {
      ...draft,
      choices,
      // `units` goes with the free-entry form it belonged to: the answer is now
      // a tapped key, and the numeral it stands for keeps every spoken form the
      // item already accepted ("eight", "8 shells"), which is what QG-11 and
      // QG-13 re-derive against.
      answer: {
        value: correctKey,
        acceptableForms: [String(n), ...draft.answer.acceptableForms.filter((f) => f !== String(n))],
        validation: 'choice-key',
      },
    };
    return withChoices;
  };
}

// ===========================================================================
// Local generator 1 — what the FRAME shows (the drawable discrimination)
// ===========================================================================

/**
 * A ten-frame holds `n` counters and the child taps the number it shows.
 *
 * This is disclosure 1's honest, drawable form of "how much room it takes up is
 * not how many there are". Every option is a real thing a four-year-old reads
 * off this picture, and none is invented:
 *   5        the full top row, read as the whole answer — the tidiest, most
 *            complete-LOOKING part of the picture, and the commonest stop
 *   10       the frame HOLDS ten, so the box is answered instead of its contents
 *   10 − n   the empty boxes counted instead of the counters
 *   n + 1    one of the loose counters below the row touched twice
 *   n − 1    one of the loose counters below the row never touched
 *
 * WHICH PAIR IS OFFERED IS DRAWN, so the truth is sometimes the smallest number
 * on the page, sometimes the middle, sometimes the largest — the invariant being
 * that the answer must not sit at a fixed RANK. That is the defect this rebuild
 * exists to remove: the old A2 keyed the SMALLEST option on 100% of 120 draws in
 * two slots, and bracketing the answer instead (n−1, n, n+1) is the same defect
 * mirrored, because "tap the middle" then scores full marks. Nudges are
 * deterministic, never redraw loops (kit §E2.4).
 */
function frameShows(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const extra = n - 5;
      let pairing = r.int(0, 2);
      // A frame of ten cannot offer "the box holds ten" as a number ABOVE the
      // answer, and n+1 would BE ten at nine. Step down; never redraw.
      if (pairing === 1 && n === FRAME) pairing = 0;
      if (pairing === 2 && n >= FRAME - 1) pairing = 0;
      const fullRow = {
        text: '5',
        errorTag: 'concept-misconception' as ErrorTag,
        rationale: 'The full top row read as the whole answer - the tidy row ends the count early.',
      };
      const wholeBox = {
        text: String(FRAME),
        errorTag: 'representation-misread' as ErrorTag,
        rationale: 'What the box HOLDS, not what is in it - answered from the size of the frame.',
      };
      const emptyBoxes = {
        text: String(FRAME - n),
        errorTag: 'task-comprehension' as ErrorTag,
        rationale: 'The empty boxes counted instead of the counters sitting in them.',
      };
      const touchedTwice = {
        text: String(n + 1),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'One counter below the full row touched twice, so the count ran one too far.',
      };
      const missedOne = {
        text: String(n - 1),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'One counter below the full row never touched, so the count stopped a step short.',
      };
      // "5" IS A DECLARED LURE, AND ITS OFFER RATE IS HELD DOWN TO SUIT.
      //
      // Applying the L36 test honestly: five is false under EVERY draw this item
      // can make, because the frame always holds more than a full row here — and
      // it is false as a NAMED MISCONCEPTION, the belief the ten-frame exists to
      // unseat ("the tidy full row is the answer"). Keying it would teach the
      // very thing the week removes, so it cannot be made live by widening the
      // draw. What CAN go wrong is a child learning to strike it out, so it is
      // offered by ONE pairing rather than two — and this is now the ONLY item in
      // the week that offers it at all, because the certifying frame read cannot
      // (a slot drawing 6-10 can never key five, which is the dead option
      // disclosure 5 exists to delete rather than to argue down).
      //
      // MEASURED AT 37.4% OF 500 DRAWS, not the 27% this comment used to claim.
      // The old figure counted the deliberate pairing alone — a third of draws,
      // less the frames holding ten — and missed the draws where five arrives
      // honestly: at a frame of six, "one counter below the row never touched" IS
      // five, so the both-below pairing offers it too. Still below the 50% at
      // which `bb-answer-entropy-test` calls an option dead, and below the rate
      // at which "never the five" is learnable — but a number in a comment has to
      // be the number a script prints. Recorded for the orchestrator, which may
      // prefer to add it to that script's DECLARED_LURES with this argument.
      const wrongs =
        pairing === 0
          ? [missedOne, emptyBoxes] // truth is the LARGEST number offered
          : pairing === 1
            ? [fullRow, wholeBox] // truth is the MIDDLE
            : [wholeBox, touchedTwice]; // truth is the SMALLEST
      const { choices, correctKey } = makeChoices(r, String(n), wrongs);
      // Disclosure 2: this alt describes the picture the `clockAlt` way — the
      // layout, faithfully, without stating the number being asked for.
      const scene = `a ten-frame with a full row and ${countNoun(extra, 'counters')} below`;
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(scene, 'Tap the number this frame shows.'),
        figure: tenFrame(n, { size: FRAME, alt: scene, asserts: assertsParam('n') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_numeral_for_set_v1', params: { n }, seed: r.uint() },
        hintLadder: hints('The box is bigger than what sits in it.', 'A full row is five. Keep going below.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'read-frame-not-box', isDiscrimination: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — the Day-4 real-world counting picture problems
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family has no counting story generator (its word problems join or take away,
 * neither of which A2 has taught), so the three frames live here.
 */
interface StoryFrame {
  /** The story sentence. */
  line: (name: string, n: number, noun: string) => string;
  /** What the picture actually shows — the alt, so it must be true of the drawing. */
  scene: (n: number, noun: string) => string;
  /** The SPOKEN description: layout only, never the count being asked for. */
  alt: (noun: string) => string;
  /** Fixed noun, for the frame story, whose picture can only hold counters. */
  noun?: string;
  arrangement: string;
  ladder: string[];
}

const STORY_FRAMES: Record<'shelf' | 'basket' | 'frame', StoryFrame> = {
  shelf: {
    line: (name, _n, noun) => `${name} lines up some ${unitFor(2, noun)} along the shelf.`,
    scene: (n, noun) => `${countNoun(n, noun)} in a row on a shelf`,
    alt: (noun) => `${unitFor(2, noun)} in a row on a shelf`,
    arrangement: 'in a row',
    ladder: ['Begin at one end and work along.', 'Give every single one its own number.'],
  },
  basket: {
    line: (name, _n, noun) => `${name} tips some ${unitFor(2, noun)} out of a basket.`,
    scene: (n, noun) => `${countNoun(n, noun)} in a loose pile`,
    alt: (noun) => `${unitFor(2, noun)} in a loose pile`,
    arrangement: 'scattered',
    ladder: ['A loose pile is easy to lose. Go slowly.', 'Set each one down once it has a number.'],
  },
  frame: {
    line: (name) => `${name} drops some counters into the frame.`,
    scene: (n) => `a frame of ${String(FRAME)} with ${countNoun(n, 'counters')} in it`,
    alt: () => `a ten-frame with some counters in it`,
    noun: 'counters',
    arrangement: 'in a frame',
    ladder: ['The frame shows its five before it shows more.', 'Start at five and carry on up.'],
  },
};

/** One kind of thing, counted. The figure asserts the answer it is drawn from. */
function countStory(which: 'shelf' | 'basket' | 'frame'): ItemGen {
  const frame = STORY_FRAMES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const noun = frame.noun ?? r.pick(COUNTABLE_NOUNS);
      const name = one(r);
      const scene = frame.scene(n, noun);
      const spokenAlt = frame.alt(noun);
      const draft: ItemDraft = {
        type: 'word-problem',
        // The QUESTION always names the plural: `unitFor(n, …)` would say "How
        // many shell?" and hand a drawn count of one straight to the child.
        prompt: scenePrompt(scene, `${frame.line(name, n, noun)} How many ${noun}?`),
        figure:
          which === 'frame'
            ? tenFrame(n, { size: FRAME, alt: spokenAlt, asserts: assertsAnswer })
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
        authorMeta: { stepCount: 1, cognitiveOp: 'count-story', situationType: 'part-whole' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — Day-5 match a set to a numeral, and SAY how
// ===========================================================================

/**
 * The A2 Day-5 signature (FILL-ARCHITECTURE §3 row A2: "match sets ↔ numerals")
 * with the band's oral half attached: the child points at the group holding the
 * named number and says what they did to be sure.
 *
 * The matching is computable and the picture is code-drawn; the TELLING is the
 * honest not-fully-computable part (§7), so it ships `manual-review` exactly as
 * the D-established convention requires — never a faked computable answer for an
 * open task. It is also the item that satisfies the dual-strand coupling gate,
 * which wants one non-computational item demanding a justification.
 *
 * Registered on `a_set_for_numeral_v1`, whose `verifyFor` FINDS the group holding
 * n from the counts rather than taking this generator's word for which one it
 * was, so QG-11 re-derives the answer the oral part is told about.
 */
function matchAndTell(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const pool: number[] = [];
      for (let v = LO; v <= HI; v++) pool.push(v);
      const picked = r.shuffle(pool).slice(0, 3);
      const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
      const targetIdx = r.int(0, 2);
      const n = picked[targetIdx];
      // Disclosure 2 again, on the one Day-5 item this file authors: the family's
      // three-group scene reads "9 flowers, 8 leaves, 10 balls", which SAYS which
      // group holds the named number to the child who is being asked to find it.
      // This scene names what is drawn and leaves the counting to the child.
      const scene = `three groups to count: ${nouns[0]}, ${nouns[1]} and ${nouns[2]}`;
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(scene, `Point at the group holding ${String(n)}. Say how you knew.`),
        figure: counterGroups(
          picked.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
          { alt: scene, asserts: assertsParam('n', `group:${String(targetIdx)}`) },
        ),
        answer: {
          value: nouns[targetIdx],
          acceptableForms: [`the ${nouns[targetIdx]}`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_set_for_numeral_v1',
          params: { n, counts: picked, nouns },
          seed: r.uint(),
        },
        hintLadder: hints('Count out loud so you can hear yourself.', 'Then tell us which group you chose, and why.'),
        errorTags: ['representation-misread', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'match-and-tell' },
      };
      return draft;
    });
}

// ===========================================================================
// The family generators, bound to A2's range and given this week's voice
// ===========================================================================

/**
 * Every core count draws from the SAME 6–10 range, and that is a measurement
 * decision rather than a tidiness one (kit §E "A-band lessons", item 5).
 * `drawUniqueItem` signs a one-token prompt as `<type>|1tok|<n>`, so the
 * `computation` counting items share one namespace of five values. With EQUAL
 * ranges the accepted draws are a random permutation of that namespace and every
 * slot's served marginal stays uniform. Let one generator run 6–9 while its
 * neighbours run 6–10 and the wide one is left holding 10 whenever it draws last
 * — which is exactly how A1's mastery slot came to key "2" on 77% of draws.
 * Measured here, not assumed: see the report's rank tables.
 */
// CERTIFYING SLOT (mastery 02) — so it carries authored options, and the Day-1
// page that shares this generator carries them too. See `withTapChoices`.
const countRow = withHints(
  withTapChoices(countArrangement({ min: LO, max: HI, arrangement: 'in a row' }), ROW_VOICE),
  hints('Begin at one end and travel to the other.', 'Say one number for each thing you touch.'),
);
const countTwoRows = withHints(
  countArrangement({ min: LO, max: HI, arrangement: 'in two rows' }),
  hints('Read the top row all the way across.', 'Now carry on below without going back.'),
);

/**
 * Read a filled frame — the week's anchor, met on Day 1, and the slot that
 * certifies it (mastery 01). Authored options, so the display layer never
 * invents a "5" this slot cannot key; the Day-1 page carries them too.
 */
const frameRead = withHints(
  withTapChoices(tenFrameRead({ min: LO, max: HI, size: FRAME }), FRAME_VOICE),
  hints('A full row is five, every time.', 'Carry on past five for the ones below it.'),
);

/**
 * BUILD the frame, which is the harder half: nothing can be read at a glance
 * from an empty frame, so the child must put one counter down per number word.
 * A pre-filled frame would let the answer be seen instead of made — the one
 * strategy this week must not let the child skip (kit §F.7).
 */
const frameBuild = withHints(
  notAlreadyCounted(tenFrameBuild({ min: LO, max: HI, size: FRAME })),
  hints('Fill the top row first, then move below.', 'Say each number out loud as you put one in.'),
);

/** What is MISSING from the frame — the same picture read the other way. */
const frameEmpty = withHints(
  tenFrameEmpty({ min: LO, max: HI - 1, size: FRAME }),
  hints('This question is about the gaps.', 'Count the boxes with nothing inside them.'),
);

/** Set → numeral, over the arrangement that loses a counter fastest. */
const tapScatter = withHints(
  howManyChoice({ min: LO, max: HI, arrangement: 'scattered' }),
  hints('Count along a path, never jumping about.', 'Mark each one in your head as you pass it.'),
);

/** Set → numeral again on Day 5, over the tidiest arrangement, as the match-up. */
const tapRow = withHints(
  howManyChoice({ min: LO, max: HI, arrangement: 'in a row' }),
  hints('Do not read the numbers yet.', 'Count first, then find that number below.'),
);

/** Numeral → set: the number is named, the child taps the group that holds it. */
const whichGroupShows = withHints(
  setForNumeral({ min: LO, max: HI, groups: 3 }),
  hints('Keep your number in your head.', 'Count each group, and stop when one matches.'),
);

/**
 * More / fewer / same across two rows — and the SAME draw is the point.
 * `compareSets` draws equal rows one time in five and keys "they are the same"
 * then, so the option is live rather than a dead third door, and an equal draw
 * is the week's own content: two rows that look alike, settled by counting.
 */
const compareRows = withHints(
  compareSets({ which: 'more', min: LO, max: HI }),
  hints('Look down the two rows, pair by pair.', 'A counter with no partner is what decides it.'),
);

/** Help the puppet: it skipped one, so its number stopped a step short. */
const puppetSkips = withHints(
  puppetSlip({ slip: 'skip-count', min: LO, max: HI }),
  hints('Count out loud together, nice and slowly.', 'Did every one of them get a number?'),
);

const frameChoice = frameShows();
const storyShelf = countStory('shelf');
// CERTIFYING SLOT (mastery 06) — the one story form that certifies, so it is the
// one that carries options; the shelf and the frame stories are Day-4 teaching
// pages and stay as they are. The law is about the slots that promote a child.
const storyBasket = withTapChoices(countStory('basket'), PILE_VOICE);
const storyFrame = countStory('frame');
const day5Match = matchAndTell();

// --- the four A·W1 warm-ups, one format each -------------------------------
const warmCountRow = warmUp(countArrangement({ min: 3, max: 5, arrangement: 'in a row' }));
const warmTapNumeral = warmUp(howManyChoice({ min: 3, max: 5, arrangement: 'in a ring' }));
const warmWhichGroup = warmUp(setForNumeral({ min: 1, max: 5, groups: 3 }));
const warmFewest = warmUp(pickExtreme({ which: 'smallest', min: 1, max: 5 }));

// ===========================================================================
// The week
// ===========================================================================

export const buildA02 = makeWeekBuilder({
  level: 'A',
  week: 2,
  conceptId: 'counting-6-10',
  conceptName: 'Counting 6–10',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [{ level: 'A', week: 1 }],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the ten-frame',
  deepeningDelta:
    'A1 counted 1 to 5, where a small group can still be taken in at a glance. A2 goes past five, where it cannot, so the week is about keeping your place: the ten-frame arrives as the structure that holds it (a full row is always five, and the rest are counted ON from there), the arrangements grow from a short row to a row of ten, two rows and a loose pile, and the child reads what is MISSING from a frame as well as what is in it. A1 asked "how many?"; A2 asks "how do you not lose one?".',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. A real ten-frame and ten counters beside the screen beats anything on it — build each number before reading it. Expect a recount from one every time; that is the stage, not a mistake. Keep a finger on the last one counted, and let the child move objects as they count them. Mascot present.',
  },
  explanation: {
    hook: say(
      'Ten shells sit in a rock pool. Can you see how many? Our eyes stop helping past five. So we count them, one by one. Counting never guesses.',
    ),
    whyBeforeHow: say(
      'Past five, counting gets slippery. We lose our place, because there are so many. So we use the ten-frame. It holds five in a row, then five more. A full row is always five. Start at five. Count the rest on. The frame keeps our place for us.',
    ),
    script: [
      {
        say: say('Here are six ducks. Watch my finger. One, two, three, four, five, six.'),
        visual: 'Six ducks in a row, touched one at a time.',
        figure: counters(6, 'ducks', { arrangement: 'in a row', alt: 'six ducks in a row' }),
      },
      {
        say: say('Now six sit in a frame. The top row is full. That is five. Then one more. Six!'),
        visual: 'A ten-frame with a full top row of five and one counter below it.',
        figure: tenFrame(6, { alt: 'a ten-frame with a full top row and one more below' }),
      },
      {
        // The recipe's length trap, taught where two pictures are available and
        // the answer is already on the page (disclosure 1).
        say: say('These buttons spread out wide. They take up lots of room. Count them. Only five.'),
        visual: 'Five buttons spread far apart across the page.',
        figure: counters(5, 'buttons', { arrangement: 'scattered', alt: 'five buttons spread out wide' }),
      },
      {
        say: say('These six sit tight in the frame. Six is more than five. Room does not tell us. Counting does.'),
        visual: 'The same ten-frame again, still holding six counters.',
        figure: tenFrame(6, { alt: 'the same frame again, still holding six counters' }),
      },
    ],
    summary: say(
      'Big groups need a plan. Use the frame. A full row is five. Count the rest on. The last number tells how many.',
    ),
    vocabulary: [
      { term: 'ten-frame', kidGloss: 'a box of ten, five in each row' },
      { term: 'full row', kidGloss: 'five counters with no gap left' },
      { term: 'count on', kidGloss: 'start at a number you know and keep going' },
      { term: 'keep your place', kidGloss: 'know which ones you have counted already' },
    ],
  },
  guidedExamples: [
    {
      ...ge(2, 1, 'modeled', scenePrompt('a ten-frame with a full top row and two more', 'How many counters?'), [
        {
          teacherSay: say('Watch me. The top row is full, so that is five.'),
          expected: '5',
        },
        { childDo: say('Count the two below, on from five.'), expected: '6, 7' },
        { teacherSay: say('Seven! I never went back to one.') },
      ], '7'),
      visual: 'A ten-frame with a full top row of five and two counters below.',
      figure: tenFrame(7, {
        alt: 'a ten-frame with a full top row and two more below',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(2, 2, 'completion', scenePrompt('nine buttons in a row', 'How many buttons?'), [
        { teacherSay: say('I will begin. One, two, three, four, five.') },
        { childDo: say('Carry on from five to the end.'), expected: '6, 7, 8, 9' },
        { teacherSay: say('Nine! You did not start over.') },
      ], '9'),
      visual: 'Nine buttons in one long row.',
      figure: counters(9, 'buttons', {
        arrangement: 'in a row',
        alt: 'nine buttons in a row',
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(2, 3, 'prompted', scenePrompt('a ten-frame with both rows full', 'How many counters?'), [
        { teacherSay: say('Both rows are full now. Each row holds five.') },
        { childDo: say('Say five, then count the bottom row on.'), expected: '10' },
      ], '10'),
      visual: 'A ten-frame with both rows full.',
      figure: tenFrame(10, { alt: 'a ten-frame with both rows full', asserts: assertsAnswer }),
    },
    {
      ...ge(2, 4, 'independent', scenePrompt('eight shells in a loose pile', 'How many shells?'), [
        { childDo: say('Pick one shell first. Push each aside after.'), expected: '8' },
      ], '8'),
      visual: 'Eight shells tipped out in a loose pile.',
      figure: counters(8, 'shells', {
        arrangement: 'scattered',
        alt: 'eight shells in a loose pile',
        asserts: assertsAnswer,
      }),
    },
  ],
  days: [
    // Day 1 — concept echo: the frame arrives, read and then BUILT, beside the
    // plain row it is meant to organise.
    [
      { gen: warmCountRow, diff: 1 },
      { gen: countRow, diff: 2 },
      { gen: frameRead, diff: 2 },
      { gen: frameBuild, diff: 3 },
    ],
    // Day 2 — the arrangement starts to fight back, and both discriminations
    // land: the box is not its contents, and two look-alike rows need counting.
    [
      { gen: warmTapNumeral, diff: 2 },
      { gen: countTwoRows, diff: 2 },
      { gen: frameChoice, diff: 3 },
      { gen: compareRows, diff: 3 },
    ],
    // Day 3 — the hardest arrangement to keep a place in, the frame read
    // backwards, and "help the puppet" (it skipped one).
    [
      { gen: warmWhichGroup, diff: 2 },
      { gen: tapScatter, diff: 3 },
      { gen: frameEmpty, diff: 3 },
      { gen: puppetSkips, diff: 3 },
    ],
    // Day 4 — real-world single-step picture problems (band-A form of G7),
    // ending on one that puts the week's anchor inside a story.
    [
      { gen: storyShelf, diff: 2 },
      { gen: warmFewest, diff: 2 },
      { gen: storyBasket, diff: 3 },
      { gen: storyFrame, diff: 3 },
    ],
    // Day 5 — match sets to numerals in both directions, then say how you knew.
    [
      { gen: whichGroupShows, diff: 2 },
      { gen: tapRow, diff: 3 },
      { gen: day5Match, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // Day-5 only — see disclosure 4.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: past five, counting is no longer about the number words - it is about not losing your place, and the ten-frame is the tool for that. A full row is five, every time, so a child can stop starting again at one and count on from five instead. Two things look like errors and are not. Recounting from one whenever you ask "how many?" is a normal stage; ask again straight after they count rather than correcting. And judging a spread-out handful as "more" than a tidy one is genuinely how it looks at this age - push a handful of buttons apart, count them together, then bunch them up and count again. At home, an egg box makes a real ten-frame: fill it while laying the table, and stop at the number you were given.',
  ],
  /**
   * The sanctioned band-A production puzzle, and the BUILDING is the mathematics.
   * You cannot fill a frame to seven without saying one number per counter, and
   * you cannot answer what is left over without seeing the frame as ten. It asks
   * for the frame in the direction the days do not: Day 1 fills it to a given
   * number, Day 3 reads the gaps off a frame someone else filled; here the child
   * makes the frame AND then reads its gaps, which is the two halves joined.
   *
   * The counters land in a frame that is actually DRAWN, empty, at the size the
   * prompt names — no worksheet furniture with no referent on the page.
   */
  puzzle: (r, guard) => {
    // Not the number Day 1 already built. The puzzle draws after every day, so
    // the build page's `drawing|1tok|<n>` surface is registered by now; without
    // this the two pages carried the identical instruction at seed 3. Bounded,
    // deterministic, and the range holds four values against one taken.
    let n = r.int(LO, HI - 1);
    for (let k = 0; k < 12 && guard.taken(`drawing|1tok|${String(n)}`); k++) n = r.int(LO, HI - 1);
    const scene = `an empty frame of ${String(FRAME)}`;
    return {
      id: 'A2-PZ-01',
      title: 'Puzzle Grove: The Frame Builder',
      puzzleType: 'construction',
      prompt: [
        `[image: ${scene}]`,
        say(`Fill the frame with ${String(n)} counters.`),
        say('Start along the top row.'),
        say('How many boxes stay empty?'),
      ].join(' '),
      figure: tenFrame(0, { size: FRAME, alt: scene }),
      answer: {
        value: String(FRAME - n),
        acceptableForms: [numberWords(FRAME - n), countNoun(FRAME - n, 'boxes')],
        validation: 'exact-numeric',
      },
      hintLadder: hints('Put one counter in each box, in order.', 'Now count the boxes you left alone.'),
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'build-frame-then-read-gaps' },
  sprint: null,
  mastery: [
    { gen: frameRead, diff: 2 },
    { gen: countRow, diff: 2 },
    { gen: tapScatter, diff: 3 },
    { gen: whichGroupShows, diff: 3 },
    { gen: compareRows, diff: 3 },
    { gen: storyBasket, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. Every slot is a tap: no certifying page is left as a bare numeral for the display layer to invent buttons for. 01: read a ten-frame holding 6-10, offered against three counts the slot can key - one of them the frame\'s own ten, so "the box, not its contents" is on the page as a number and is still true on the draws that fill it. 02: count a row of 6-10, offered the same way. 03: tap the numeral for a loose pile, with the pair of miscounts rotated so the truth is not at a fixed rank. 04: numeral to set across three drawn groups. 05: which row has more, including the one-in-five draw where neither does. 06: a counting story over a tipped-out pile, again offered against countable numbers only. On 01, 02 and 06 the rank the truth will hold is dealt from a weight table before the wrong numbers are chosen, because six can only be the smallest of three numbers drawn from 6-10 and ten can only be the largest. Every core count draws the same 6-10 range, so the shared one-token surface guard leaves each slot a uniform marginal rather than the leftovers. No count/noun pair reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'reads-the-box',
      description:
        'Answers a ten-frame with ten because the frame holds ten - reading the size of the box instead of counting what is in it.',
      exampleWrongAnswer: 'a frame holding 7 counters answered as 10',
      distractorRationale:
        "Offer the frame's own capacity beside the true count on the frame items. It is a live number rather than a lure: measured over 1,000 certifying frame-read draws it is offered on 63.3% and is the truth on 19.6-20.6% of them, because the frame really does hold ten on a fifth of draws - so a child who taps it out of habit scores below the 33.3% a guess is worth, and a child who learns to strike it out is wrong just as often.",
      reteachPointer: 'explanation/script[1] (the full row is five, then count the rest on)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'stops-at-the-full-row',
      description:
        'Reads the tidy full top row as the whole answer and stops at five, instead of counting on to the loose counters below it.',
      exampleWrongAnswer: 'a frame holding 8 counters answered as 5',
      distractorRationale:
        'Offer five itself on the Day-2 frame item, where it is offered on 37.4% of 500 measured draws. It is NOT offered on the frame read that certifies, and that is the honest limit of this distractor: every number on a certifying page has to be a count the page can key, and a frame drawn from 6-10 can never hold five. A number that is wrong under every draw teaches a child to strike it out rather than to count, so it stays on the teaching slot and out of the check.',
      reteachPointer: 'guidedExamples/A2-GE-01 (five, then count the two below on)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'skipped-object',
      description:
        'Leaves one object out of the count, so the number lands a step short of the group. Past six the eye can no longer check the answer, so the slip goes unnoticed - which is why the puppet makes it here rather than in A1.',
      exampleWrongAnswer: 'counts 9 shells as 8',
      distractorRationale:
        'Undershoot by one and by two, so the shortfall itself has to be measured rather than spotted. It is on the page whenever the truth is not the smallest count its slot can draw: the frame read, the row count and the basket story all offer their below-the-truth numbers out of 6-10, so the undershoot is a number the same slot keys on another draw and can never be struck out unread.',
      reteachPointer: 'guidedExamples/A2-GE-04 (one shell first, then push each aside as it is counted)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'counts-one-twice',
      description:
        'Gives one object two numbers - the finger doubles back, or nothing is set aside as it is counted, so the count runs past the last thing. Past six there is no way to check it by eye, which is why it survives here and not in A1.',
      exampleWrongAnswer: 'counts 7 counters as 8',
      distractorRationale:
        'Overshoot by one and by two beside the true count, mirrored on the undershoot: offered whenever the truth is not the largest count its slot can draw. Both are drawn from 6-10, so an overshoot is always a number that slot keys on some other draw.',
      reteachPointer: 'explanation/script[0] (one finger, one number word, all the way along)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'longer-row-means-more',
      description:
        'Says the row that stretches further has more, judging by the room a group takes up rather than by matching one to one. The A-band conservation trap, and the reason A2 keeps a draw where the two rows are genuinely equal.',
      exampleWrongAnswer: 'five spread wide called more than six bunched together',
      distractorRationale:
        'On any comparison, offer "they are the same" as a live option and key it whenever the rows really are equal.',
      reteachPointer: 'explanation/script[2] (five spread out wide, counted anyway)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'counts-the-wrong-thing',
      description:
        'Counts the empty boxes when the question asks for the counters, or the counters when it asks for the gaps - the picture holds two countable things.',
      exampleWrongAnswer: 'asked how many boxes are empty in a frame of 7, answers 7',
      distractorRationale:
        'Offer the number of empty boxes beside the number of counters on the Day-2 frame item, and ask for the gaps outright on Day 3 so the same picture is read both ways. The certifying frame read cannot carry it: a frame holding 6-10 leaves 0-4 empty boxes, none of which that slot can ever key, so the option would be dead on arrival there.',
      reteachPointer: 'Day-3 replay: say out loud which of the two you are about to count',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Counting groups of 6 to 10, where a glance stops working and keeping your place starts to matter. We met the ten-frame: a box of ten with five in each row, so a full row is always five and the rest can be counted on from there. We also counted rows, two rows and loose piles, read what was missing from a frame, and met the idea that a group taking up more room does not make it more.',
    improvingCandidates: [
      'counting on from a full row instead of starting again at one',
      'keeping their place in a loose pile past six',
      'building a given number in a ten-frame and stopping at it',
      'reading how many boxes are still empty in a frame',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'telling what the frame HOLDS from what is in it right now - we will keep filling frames only part way',
      },
      {
        errorTag: 'concept-misconception',
        text: 'not stopping at the full row: five is where the counting carries on, not where it ends',
      },
      {
        errorTag: 'procedure-slip',
        text: 'giving every object its own number in a loose pile - moving each one aside as it is counted is the fix',
      },
      {
        errorTag: 'task-comprehension',
        text: 'noticing which of the two things a frame question is asking about, the counters or the gaps',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted on from the full row instead of starting again at one, and you moved each shell aside so none got counted twice.',
      questionForChild: 'Can you fill an egg box with 7 eggs - and how many holes are left?',
      schoolSyncHook: 'Tell us whether their class uses a ten-frame or a bead string and we will match the pictures to it.',
    },
    vocabularyForParent: [
      'ten-frame (a box of ten, five to a row)',
      'full row (five, with no gap left)',
      'count on (carry on from a number you already know)',
      'keeping your place (knowing which ones are already counted)',
    ],
  },
});
