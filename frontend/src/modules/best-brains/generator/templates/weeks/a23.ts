/**
 * Level A · Week 23 — "Teen numbers = 10 + some" (conceptId: teen-numbers-ten-plus-some).
 *
 * FILL-ARCHITECTURE §3 row A23: anchor "full frame + extras"; core forms "10+n
 * choice" and "icon-as-unknown"; perceptual discrimination **10+3 vs 3+10 vs 13
 * — all the same!**; puppet error-analysis "breaks 17 into 7 and 7"; Day-5
 * "break-apart match". Catalog row: decompose 11–19 as ten + ones with frames,
 * and build-a-teen (fill the frame, count what is over) as the
 * non-computational Day-5 focus.
 *
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 *
 *  - **A teen amount COMES APART, and one of the two parts is always a whole
 *    ten.** Not "a teen has a ten hiding in it" (A9 said that) and not "the ten
 *    gets the front mark" (A10 said that) — this week hands the child the two
 *    parts as separate objects and asks them to put them together and pull them
 *    apart again. Every core page is a break or a build.
 *  - **THE TWO PARTS CAN BE HANDED OVER IN EITHER ORDER, AND THAT IS THE WHOLE
 *    DISCRIMINATION.** A ten with 3 beside it, 3 with a ten beside it, and the
 *    numeral: one amount, three names. A child who thinks the ten has to come
 *    first has not seen that the parts are things rather than positions, so the
 *    composition page draws its order from a coin and the discrimination offers
 *    the truth written each way half the time.
 *  - **THE UNKNOWN IS AN ICON, WHICH IS WHAT MAKES THIS STRUCTURAL RATHER THAN
 *    ANOTHER COUNTING PAGE.** "These are ten and ▢" — and, in the other order,
 *    "These are ▢ and ten" — is the band-A algebra form A12 opened, moved past
 *    ten. The box is a part, not a total, and the child fills it from the
 *    picture.
 *  - **No page here is words alone.** `GATE_PROFILE.A` spends the multi-step
 *    quota on `pictorialPerDay`, so each of Days 1–4 draws its picture out of
 *    the values its own item computes with.
 *  - **No timers.** `sprint: null`.
 *  - **Twenty-one per cent of the daily pages face backwards** — four items,
 *    one on each of Days 1–4, each from a different earlier week in a different
 *    format: a teen counted with nothing grouping it (A9), the whole ten split
 *    behind a card (A13), the same split one size down as an icon sentence
 *    (A12), and two heaps pushed together (A14).
 *
 * ── ELEVEN DISCLOSURES ──────────────────────────────────────────────────────
 *
 * 1. **THE RECIPE'S PUPPET SLIP IS NOT A MISCOUNT AND NO REGISTERED TRANSFORM
 *    RETURNS IT, SO IT IS DERIVED FROM A REGION OF THE PICTURE INSTEAD.** Row
 *    A23's puppet "breaks 17 into 7 and 7": asked to take a teen apart it shares
 *    it out fairly, because "break apart" was heard as "give us half each"
 *    rather than "a whole ten and the rest". Taken in kit §E2.3 order:
 *
 *    *First the identity hunt.* `d_verify_binop_misconception_v1` holds one
 *    operand pair still and swaps the operation, so producing `{correct: n − 10,
 *    wrong: ⌈n/2⌉}` from a single pair needs `x − y = n − 10` with `x + y = n/2`,
 *    which gives `x = 3n/4 − 5` — whole only when `n` is a multiple of four, so
 *    two cells of nine, and at those two the pair is `(4, 2)` and `(7, 1)`,
 *    numbers with no referent in a heap of counters. The band's own transforms
 *    are further away, not nearer: `a_verify_count_slip_v1` returns `{n, n ± 1}`
 *    and `a_verify_teen_write_v1` returns the reversed digit string, and a fair
 *    share is neither. So the pair is unreachable and inventing it would be
 *    fabrication.
 *
 *    *So, §E2.3's second door: reframe until the slip is genuinely computed.*
 *    It is. `puppetSharesItOut` LAYS THE COUNTERS IN TWO ROWS OF THE PUPPET'S
 *    OWN SHARE — the picture draws `⌈n/2⌉` above `⌊n/2⌋` — so the two numbers
 *    the puppet says are two rows a child can point at and count, exactly the
 *    move C17 and A13 used. The figure asserts the top row against a stored
 *    param, so the drawing cannot drift from the claim. The TRUTH is pinned by
 *    the registry: the page registers `d_verify_binop_v1` with `{a: n, b: 10,
 *    op: '-'}`, so QG-11 recomputes what is over the ten from the params and
 *    compares it with the card keyed correct.
 *
 *    **Recorded for the orchestrator, thirding A13's ask:** `earlynumber` wants
 *    a `a_verify_fair_share_slip_v1` returning `{correct: n − 10, wrong: ⌈n/2⌉}`.
 *    It is four lines and it would pin both halves of the commonest
 *    break-apart error at this age.
 *
 *    NINETEEN IS BARRED FROM THAT PAGE, and the arithmetic is why: a fair share
 *    of nineteen is ten and nine, which is a correct break-apart, so the puppet
 *    would be right and the page would be about nothing. Eleven to eighteen
 *    survive and key one to eight.
 *
 * 2. **THE ORDER OF THE PARTS IS DRAWN, NEVER FIXED — ON THE COMPOSITION PAGE,
 *    ON THE ICON PAGE AND INSIDE THE DISCRIMINATION'S CARDS.** If the ten always
 *    came first, "the big part leads" would be a rule about this file's habits
 *    that a child could learn instead of the mathematics, and the misconception
 *    the recipe names would never be touched. So `joinTheParts` draws which heap
 *    is the ten by a fair coin, `boxOnTheFrames` draws whether the box stands
 *    before or after the ten, and `whichCardSaysIt` writes each of its three
 *    cards in an order of its own with both orders always present. Measured
 *    rates are in the report, not in this paragraph.
 *
 * 3. **THE DISCRIMINATION HAD TO BECOME "WHICH CARD", BECAUSE "ARE THESE THE
 *    SAME?" IS UNASKABLE AND "WHICH SHOWS THIS AMOUNT?" HAS TWO ANSWERS.** The
 *    recipe's line is that 10+3, 3+10 and 13 are all the same, and that is
 *    exactly what stops the obvious forms working: offer the child a teen
 *    picture and the three names of it and every card is correct (§E2.7 — a
 *    computable answer is not an askable question). Two other framings were
 *    worked through and dropped for reasons worth recording:
 *      · **An odd-one-out over three cards is beatable without arithmetic.** Two
 *        cards saying one amount and one saying another can always be separated
 *        by matching digit strings, and a teen numeral always contains its own
 *        ones digit, so the shortcut survives every re-dress.
 *      · **Two collections compared side by side cannot be DRAWN.**
 *        `CountersFig` lays `relation: 'compare'` out as one row per group on a
 *        shared pitch, so a four-group figure is four rows and not two
 *        collections; a picture of "a ten and some over" against "some over and
 *        a ten" does not exist in the primitive set. Authoring against it would
 *        be the L27 class. **Recorded for the orchestrator:** a `compare` of two
 *        COMPOSED collections is the missing primitive.
 *    What ships is a teen drawn on the frames beside three cards, each naming a
 *    ten and a number of loose ones in one order or the other, exactly one of
 *    which comes to what the frames hold. The lures are honest miscounts of what
 *    is over the ten, and at least one is always written in the opposite order
 *    to the truth — so a child who will only accept a ten-first card is picking
 *    a wrong amount half the time, which is the misconception losing.
 *
 * 4. **THE CARDS ARE PROSE PAIRS AND THAT IS A READING LOAD, WHICH IS DISCLOSED
 *    RATHER THAN HIDDEN.** "10 and 4" is two numerals and one small word; the
 *    band already keys nouns ("the shells") and whole clauses ("they are the
 *    same") through `setForNumeral`, `compareSets` and `joinOrTakeAway`, so a
 *    text card is inside the established contract, and `speakablePrompt` plays
 *    the page. It is still more to hold than a bare numeral, which is why the
 *    discrimination never runs first on a day and never carries the day's lowest
 *    difficulty.
 *
 * 5. **AUTHORED CARDS ON EVERY NUMERIC SLOT (L53), AND THE AUDIT THEY SWITCH
 *    OFF IS REBUILT TWICE OVER.** A pre-reader cannot type, and a numeric band-A
 *    item without `choices` is handed to `tapOptionsFor`, which invents buttons
 *    from the answer alone and cannot know a slot's range. So every slot in this
 *    week — core, story, warm-up and mastery — ships cards. QG-5 re-derives an
 *    `answerFor` for five numeric validations and `choice-key` is not among
 *    them, so the four library warm-ups stop being audited the moment the cards
 *    go on; `withTaps` replaces that with a re-derivation written here, checked
 *    against what the generator keyed AND against what the picture draws. Every
 *    page this file writes for itself goes further and pins `d_verify_binop_v1`
 *    or `a_set_for_numeral_v1`, both of which register a `verifyFor`, so QG-11
 *    audits them as choice items and the central check never stops running.
 *    (Fourth week running that `a_join_v1`, `a_frame_read_v1`,
 *    `a_teen_ten_and_v1` and `a_teen_extra_v1` want verify twins —
 *    **recorded again**.)
 *
 * 6. **WHICH NUMERALS A SLOT MAY OFFER IS COMPUTED FROM ITS OWN POOL, NEVER
 *    DECLARED (L38).** Six of the seven weeks before this one shipped a card no
 *    draw could key, past a clean two-hundred-seed sweep, because a card list
 *    was written by hand and a pool moved later. Nothing here writes one down:
 *    each slot exports the SET its own answer function returns over its own
 *    cells, built at module load, and `dealCards` throws on any value outside
 *    it. For the record — the composition page, the crate story and the Day-5
 *    match key 11–19; the icon page, the loose-heap page, the two other stories
 *    and the Day-5 build key 1–9; the puppet keys 1–8 (disclosure 1); the
 *    discrimination keys one of its own three cards; and the warm-ups key
 *    11–19, 1–9, 1–4 and 4–10.
 *
 *    The pool a card is drawn from is the key's NEAREST NEIGHBOURS IN THE KEY
 *    SET rather than `key ± 1, ± 2`, because the puppet's set has holes punched
 *    in it: the two numbers the puppet said out loud are barred from its own
 *    cards, so an arithmetic window would sometimes have found nothing to offer.
 *
 * 7. **WHERE THE TRUTH SITS IS SETTLED BEFORE THE WRONG NUMBERS EXIST.** Every
 *    card is a value its own slot can key, so all three live in one set — and a
 *    set pins its own ends: the lowest member has nothing beneath it and is
 *    always the smallest number on the page, the highest is always the largest,
 *    and the runners-up can never reach the far seat. Left uniform the middle
 *    seat starves. `seatShares` solves for per-key weights whose average over
 *    the slot's keys is a flat third, by repeatedly rescaling the three seat
 *    columns and renormalising each key's row until both marginals hold; a key
 *    set that cannot reach a flat third refuses to load rather than shipping a
 *    tilt. One solver serves all ten carded slots and the served rates are in
 *    the report.
 *
 * 8. **SEVEN LOCAL GENERATORS, EACH NAMING THE FAMILY GAP IT FILLS.**
 *    `joinTheParts` — `teenTenAnd` states its two parts in one fixed order and
 *    draws them inside a double frame, where a ten can only ever be first;
 *    order is this week's content, so the parts had to become two heaps.
 *    `boxOnTheFrames` — `partnerBox` is the family's icon-as-unknown form and
 *    its `total` is typed `5 | 10`, so it cannot reach a teen at all.
 *    `takeTheTenOut` — `teenExtra` asks the same arithmetic but names the total
 *    in the question, which at this band is spoken, and an English teen name
 *    announces its own ones digit; this page shows the amount instead of saying
 *    it. `whichCardSaysIt` — disclosure 3. `puppetSharesItOut` — `PuppetSlip` is
 *    a closed union (double-count, skip-count, count-back-start, teen-writing)
 *    and a fair share is none of them. `teenStory` — the family's word problems
 *    join or take away, and this week has taught neither. `buildAndSay` — the
 *    family's Day-5 oral form sorts and tells, which is not building a teen.
 *    All seven keep the family's contract: a templateId that resolves, a picture
 *    from `lib/figures` built out of the item's own values, quantities through
 *    `lib/format`, an `authorMeta` stamp.
 *
 * 9. **NO DIGIT AND NO NUMBER WORD IN ANY ACCESSIBLE NAME (L48), ENFORCED ON
 *    THE LIBRARY'S ALTS AS WELL AS ON THIS FILE'S.** At band A the alt is not a
 *    fallback for the picture, it IS the picture: `speakablePrompt` prefers it
 *    over the bracket and every band-A screen autoplays it BEFORE the question.
 *    This is the most exposed week in the level — every answer is a teen or the
 *    part of one, so "ten", "eleven" … "nineteen" and every digit are all live,
 *    and so is "one" hiding inside "the big one".
 *      · Every alt this file writes is built by `alt()`, which throws at module
 *        load on a digit or on any of zero–twenty, the tens names, hundred, and
 *        once, twice, single, double, twin, pair, couple, dozen, half and both —
 *        numbers wearing coats.
 *      · Every alt that REACHES A CHILD is checked again at draw time by
 *        `spokenSafe`, which wraps all eleven generators including the four
 *        library warm-ups. That is how `partnerBox` was caught: its alt is its
 *        own scene string, "a frame of 5 with 3 counters and a covered box",
 *        which speaks two digits over a page whose whole subject is a number.
 *        It is repaired HERE by a local wrapper that replaces one field and
 *        touches nothing else — a week file may not edit `lib/`. **Reported, not
 *        fixed.** `teenTenAnd` and `teenExtra` carry the same defect
 *        ("a full frame of ten and 3 counters more"); this file does not use
 *        either, for the reasons in disclosure 8, so it repairs neither.
 *      · `tenFrameRead`, `tenFrameEmpty` and `partnersHiding` were repaired
 *        centrally after A13 measured it, and `countArrangement` and
 *        `pictureJoin` after A16; all arrive clean and are re-checked anyway.
 *    The `[image: …]` brackets keep their counts: they are what `signatureOf`
 *    signs for operand freshness (L29), `promptText` strips them before anything
 *    is shown, and the figure alt wins over them wherever a figure exists —
 *    which is every page in this file.
 *
 * 10. **THE GUIDED EXAMPLES COUNT NOTHING IN THEIR BRACKETS, ON PURPOSE.**
 *    `makeWeekBuilder` rebuilds any DAY item whose prompt's numeric tokens match
 *    a guided example's, and does NOT apply that filter to the mastery forms, so
 *    a two-numeral example silently removes a cell from a day slot while leaving
 *    its mastery twin able to key it — and the cards, computed from the full
 *    pool, then offer a numeral that day slot can never serve. A13 found it and
 *    reported it. Every example here carries at most ONE numeral, so the
 *    filter's two-token minimum is never reached, no day slot loses a cell, and
 *    the served key sets in the report are the whole key sets.
 *
 * 11. **BB-G1 DOES NOT FIRE, AND THE REASON IS WORTH RECORDING RATHER THAN
 *    ROUTING ROUND.** `conceptFamily('teen-numbers-ten-plus-some')` returns
 *    itself — no `meeting-` prefix, no trailing magnitude — while A9 reduces to
 *    `counting` and A10 to `writing-numbers`. So `priorSameFamily` is empty and
 *    §6.13 never asks for a `deepeningDelta`, on the third week running about
 *    the same nine numerals. A18 recorded the compound-id shape of this hole and
 *    A17 the `meeting-` shape; this is a third: **a family key built from the
 *    concept id cannot see that "teen numbers" and "counting 11–20" are the same
 *    numbers.** No delta is declared, because the gate is the contract and
 *    inventing one here would paper over the ledger's gap rather than report it.
 *    What A23 adds to A9 and A10 is stated in `isomorphNotes` and in the parent
 *    strip instead. **Recorded for the orchestrator: the ledger wants an
 *    explicit `deepens` edge, or a synonym table.**
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  countArrangement,
  partnerBox,
  partnersHiding,
  pictureJoin,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsParam, counterGroups, counters, tenFrame } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn per item. No line below writes one of these in by hand (kit §F.3). */
const NAMES = ['Beren', 'Calla', 'Dmitri', 'Eshan', 'Fritha', 'Hollis', 'Jorunn', 'Marisol'] as const;

/**
 * A different person on every page that names one.
 *
 * FOUND BY READING THE GENERATED WEEK, not by a gate: a plain `r.pick` put the
 * same child on all three Day-4 stories at seed 3, which no gate can see (the
 * name is not an operand and never enters a surface signature) and which reads
 * as one story told three times. One rng draw picks the starting point and the
 * pool is then walked by index, so the correction costs no extra draws and stays
 * seed-stable (L19). Nine pages name someone against eight names, so at most one
 * repeat is forced; the walk puts it as far from its twin as the pool allows.
 */
function someone(r: Rng, guard: TupleGuard): string {
  const start = NAMES.indexOf(r.pick(NAMES));
  for (let k = 0; k < NAMES.length; k++) {
    const name = NAMES[(start + k) % NAMES.length];
    if (!guard.taken(`a23:name|${name}`)) {
      guard.add(`a23:name|${name}`);
      return name;
    }
  }
  return NAMES[start];
}

/** The part that is always there once a teen comes apart. */
const TEN = 10;
/** The amounts this week takes apart (catalog row: 11–19). */
const LO = 11;
const HI = 19;

// ---------------------------------------------------------------------------
// The sentence law, applied where the gate applies it
//
// Two limits measure different objects. `earlynumber`'s `ask()` caps a PROMPT
// taken whole, so it waves through a two-sentence prompt of nine words each and
// never sees a hint at all. `bb-readability-test` walks every child-facing
// surface one sentence at a time, and that is the one that fails a build. This
// mirrors its splitter and its counter, and every authored line goes through it,
// so an eleventh word throws when the module loads or when the item is drawn.
//
// A figure's accessible name is deliberately NOT capped here: that string is
// what a child who cannot see the picture has instead of the picture, and
// buying brevity by taking the drawing away is a bad trade. It has a stricter
// gate of its own (`alt`, below).
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A23: band-A sentence runs to ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** `[image: scene] question` — the bracket feeds the freshness guard, the question is spoken. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** Help rungs: measured, and free of names and numerals by how they are written. */
function rungs(...steps: string[]): string[] {
  return steps.map(say);
}

// ---------------------------------------------------------------------------
// ACCESSIBLE NAMES SAY NO NUMBER AT ALL (disclosure 9)
// ---------------------------------------------------------------------------

const SPOKEN_NUMBER =
  /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|once|twice|single|double|twin|pair|couple|dozen|half|both)\b/i;

function alt(text: string): string {
  if (/\d/.test(text)) {
    throw new Error(`A23 alt: a digit is spoken ahead of the question in "${text}"`);
  }
  const hit = SPOKEN_NUMBER.exec(text);
  if (hit) {
    throw new Error(`A23 alt: the number word "${hit[0]}" is spoken ahead of the question in "${text}"`);
  }
  return text;
}

/** The pair of frames, however full they happen to be. */
const FRAMES_ALT = alt('the big frames, holding counters in their cells');
/** The same frames before anything has gone into them. */
const EMPTY_FRAMES_ALT = alt('the big frames, standing empty');
/** Two heaps waiting to be pushed together — which is the larger is the picture. */
function joinedAlt(noun: string, bigFirst: boolean): string {
  return bigFirst
    ? alt(`a large heap of ${noun} pushed up against a small heap`)
    : alt(`a small heap of ${noun} pushed up against a large heap`);
}
/** A collection with nothing grouping it, described by kind and layout only. */
function looseAlt(noun: string, look: string): string {
  return alt(`some ${noun} ${look}`);
}
/** Groups laid out for a matching page — the kinds, never the counts. */
function groupsAlt(nouns: readonly string[]): string {
  const named = nouns.length <= 1 ? (nouns[0] ?? '') : `${nouns.slice(0, -1).join(', ')} and ${nouns[nouns.length - 1]}`;
  return alt(`groups set out beside each other: ${named}`);
}
/** The puppet's two shares, drawn one above the other. */
function sharesAlt(noun: string): string {
  return alt(`a row of ${noun} with another row of them underneath`);
}

/**
 * Every accessible name a child could actually be played, checked at draw time.
 *
 * Disclosure 9 says why the alts this file writes are gated at module load. This
 * is the other half: the four library warm-ups build their own alts, and one of
 * them speaks two digits. A week file may not repair `lib/`, so the check runs
 * where the string arrives and throws rather than letting it through — which
 * makes the rule an invariant of the week instead of an intention of the author.
 */
function spokenSafe(base: ItemGen, who: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (draft.figure) {
      try {
        alt(draft.figure.alt);
      } catch (e) {
        throw new Error(`A23 spokenSafe(${who}): ${(e as Error).message}`);
      }
    }
    return draft;
  };
}

/**
 * Replace a library generator's accessible name from outside `lib/`.
 *
 * One field moves and nothing else does — params, drawn quantities and the
 * figure's own assertion all survive, so QG-13 goes on proving exactly what it
 * proved. Used only where the library's alt speaks a number (disclosure 9).
 */
function withPlainAlt(base: ItemGen, spoken: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.figure) {
      throw new Error('A23 withPlainAlt: nothing is drawn here, so there is no spoken name to replace');
    }
    return { ...draft, figure: { ...draft.figure, alt: alt(spoken) } };
  };
}

/**
 * Mark an earlier week's item as this week's warm-up.
 *
 * `GATE_PROFILE.A.warmupFormats` is zero — retrieval is permitted here, never
 * demanded — so each of the four has to earn its page, and all four are the
 * substrate this week stands on. A teen counted loose (A9) is the amount that
 * has to come apart. A whole ten split behind one card (A13) is this week's
 * bond one size up, met on the frame it lives on. The same split written as an
 * icon sentence at five (A12) is the exact form the box pages inherit. And two
 * heaps pushed together (A14) is the act the composition page performs past
 * ten. Their hints stay as the library wrote them: a warm-up should sound like
 * the week it came from, and retrieval is exempt from the ladder dedup.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// KEY SETS, BUILT FROM THE POOLS THEMSELVES (disclosure 6)
// ===========================================================================

function span(lo: number, hi: number): number[] {
  const out: number[] = [];
  for (let v = lo; v <= hi; v++) out.push(v);
  return out;
}

/** Whole teen amounts: what a composition page and the Day-5 match key. */
const TEEN_CELLS = span(LO, HI);
const TEEN_KEYS: ReadonlySet<number> = new Set(TEEN_CELLS);
/** What is over the ten: what every break-apart page keys. */
const OVER_CELLS = span(1, 9);
const OVER_KEYS: ReadonlySet<number> = new Set(OVER_CELLS);
/** The puppet's page, nineteen barred at the source (disclosure 1). */
const SHARE_CELLS = span(LO, 18);
const SHARE_KEYS: ReadonlySet<number> = new Set(SHARE_CELLS.map((n) => n - TEN));
/** A teen counted in a ring (A9's warm-up). */
const RING_KEYS: ReadonlySet<number> = new Set(TEEN_CELLS);
/** The hidden part of a whole ten (A13's warm-up). */
const HIDE_KEYS: ReadonlySet<number> = new Set(span(1, 9));
/** The box in a five sentence (A12's warm-up). */
const BOX5_KEYS: ReadonlySet<number> = new Set(span(1, 4));
/**
 * Two small heaps joined (A14's warm-up).
 *
 * `pictureJoin` draws the first heap with room left for a legal second, so from
 * 2–5 against a ceiling of ten the reachable totals run four to ten — not the
 * fifteen an interval taken off the two ranges alone would suggest. Enumerated
 * rather than assumed, because a card outside the reachable set is the L38 shape.
 */
const JOIN_LO = 2;
const JOIN_HI = 5;
const JOIN_CAP = 10;
const HEAP_KEYS: ReadonlySet<number> = new Set(span(2 * JOIN_LO, JOIN_CAP));

/** The puppet's own two numbers for a given total, which its cards may not repeat. */
function fairShares(n: number): [number, number] {
  const bigger = Math.ceil(n / 2);
  return [bigger, n - bigger];
}

// ===========================================================================
// WHICH SEAT THE TRUTH TAKES (disclosure 7)
// ===========================================================================

const SEAT_UNITS = 1000;
type SeatShare = readonly [number, number, number];

/**
 * Which of the three seats a key can physically occupy, given what its own pool
 * can stand beside it. Smallest needs two cards above; middle needs one on each
 * side; largest needs two below.
 */
function seatsOpenTo(key: number, pool: readonly number[]): [boolean, boolean, boolean] {
  let under = 0;
  let over = 0;
  for (const v of pool) {
    if (v < key) under += 1;
    else if (v > key) over += 1;
  }
  return [over >= 2, under >= 1 && over >= 1, under >= 2];
}

/**
 * Per-key seat weights whose average over the slot's keys is a flat third.
 *
 * Rows are keys, columns are the three seats. Each row starts spread evenly over
 * the seats it can reach; then every column is scaled so its mean lands on a
 * third and every row is renormalised back to a probability, and that pair of
 * moves is repeated until both marginals hold together. Where a flat third is
 * out of reach the fit cannot settle and the check below refuses to load the
 * module — which is the point of doing it here rather than finding a tilt in a
 * report afterwards.
 */
function seatShares(keys: readonly number[], poolOf: (key: number) => number[], who: string): ReadonlyMap<number, SeatShare> {
  const open = keys.map((k) => seatsOpenTo(k, poolOf(k)));
  open.forEach((row, i) => {
    if (!row.some(Boolean)) {
      throw new Error(`A23 seatShares(${who}): a key of ${String(keys[i])} can sit nowhere among three cards`);
    }
  });
  let rows = open.map((row) => {
    const live = row.filter(Boolean).length;
    return row.map((ok) => (ok ? 1 / live : 0));
  });
  for (let pass = 0; pass < 500; pass++) {
    const mean = [0, 1, 2].map((j) => rows.reduce((acc, row) => acc + row[j], 0) / keys.length);
    rows = rows.map((row) => {
      const lifted = row.map((v, j) => (mean[j] > 1e-12 ? v / mean[j] : 0));
      const total = lifted.reduce((a, b) => a + b, 0);
      if (total < 1e-12) throw new Error(`A23 seatShares(${who}): a key lost every seat during the fit`);
      return lifted.map((v) => v / total);
    });
  }
  for (const j of [0, 1, 2]) {
    const share = rows.reduce((acc, row) => acc + row[j], 0) / keys.length;
    if (Math.abs(share - 1 / 3) > 0.005) {
      throw new Error(`A23 seatShares(${who}): seat ${String(j + 1)} settles at ${(share * 100).toFixed(1)}%, not a flat third`);
    }
  }
  // Largest remainder, so the whole numbers still sum to the denominator and a
  // seat that was never reachable keeps a weight of zero.
  const table = new Map<number, SeatShare>();
  keys.forEach((k, i) => {
    const raw = rows[i].map((v) => v * SEAT_UNITS);
    const floors = raw.map((v) => Math.floor(v));
    let left = SEAT_UNITS - floors.reduce((a, b) => a + b, 0);
    const order = [0, 1, 2].sort((a, b) => raw[b] - floors[b] - (raw[a] - floors[a]));
    for (const j of order) {
      if (left <= 0) break;
      if (rows[i][j] > 0) {
        floors[j] += 1;
        left -= 1;
      }
    }
    table.set(k, [floors[0], floors[1], floors[2]]);
  });
  return table;
}

function seatFor(r: Rng, table: ReadonlyMap<number, SeatShare>, key: number, who: string): 0 | 1 | 2 {
  const w = table.get(key);
  if (!w) throw new Error(`A23 seatFor(${who}): no seat weights for a key of ${String(key)}`);
  const t = r.int(0, SEAT_UNITS - 1);
  if (t < w[0]) return 0;
  if (t < w[0] + w[1]) return 1;
  return 2;
}

/**
 * The nearest members of the key set either side of the truth, barring any value
 * the page has already spoken.
 *
 * Nearest-in-the-set rather than `key ± 1, ± 2`, because a key set with holes in
 * it — the puppet's, which bars the two numbers it said out loud — can leave an
 * arithmetic window empty while three perfectly good cards sit just outside it
 * (disclosure 6).
 */
function neighbours(key: number, keys: ReadonlySet<number>, barred: ReadonlySet<number>): number[] {
  const sorted = [...keys].filter((v) => v !== key && !barred.has(v)).sort((a, b) => a - b);
  const under = sorted.filter((v) => v < key).slice(-2);
  const over = sorted.filter((v) => v > key).slice(0, 2);
  return [...under, ...over];
}

const NOTHING_BARRED: ReadonlySet<number> = new Set<number>();

// ===========================================================================
// WHAT A WRONG NUMBER MEANS, SAID IN ITS OWN PICTURE'S TERMS
// ===========================================================================

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * These reach a grown-up's report and never a child's page — the child taps a
 * bare numeral — so the ten-word law is off here. `over` accounts for a number
 * that has run past the drawing, `under` for one that stopped short of it, and
 * the account is taken from the VALUE rather than from the branch that chose it,
 * because an account taken from the branch can drift away from the number it is
 * attached to.
 */
interface Voice {
  over: (gap: number) => string;
  under: (gap: number) => string;
}

const gapWord = (k: number): string => numberWords(k);

const JOIN_VOICE: Voice = {
  over: (k) => `${gapWord(k)} past what the two heaps hold: the whole ten was kept and then the small heap was counted on ${gapWord(k)} too far.`,
  under: (k) => `${gapWord(k)} short of what the two heaps hold: the count set off from the ten and let go of the small heap ${gapWord(k)} early.`,
};

const FRAME_VOICE: Voice = {
  over: (k) => `The packed frame bleeds into the answer: ${k === 1 ? 'a counter' : 'two counters'} still inside it ${k === 1 ? 'is' : 'are'} named as though ${k === 1 ? 'it stood' : 'they stood'} outside.`,
  under: (k) => `A hand laid over the packed frame covered ${k === 1 ? 'one of the loose ones' : 'two of the loose ones'} as well, so ${k === 1 ? 'it' : 'they'} never reached the box.`,
};

const HEAP_VOICE: Voice = {
  over: (k) => `${gapWord(k)} too many for what stayed behind: with nothing marking where the ten ended, ${k === 1 ? 'a thing came round again' : 'things came round again'} before the count stopped.`,
  under: (k) => `${gapWord(k)} too few for what stayed behind: the group of ten was pulled out generously and took ${k === 1 ? 'a stray with it' : 'strays with it'}.`,
};

const LINE_VOICE: Voice = {
  over: (k) => `The things in the line ran out before the reciting did, so the report overshoots by ${gapWord(k)}.`,
  under: (k) => `The far end of the line was given up on: the tenth was found and then ${gapWord(k)} of the tail never arrived.`,
};

const SHARE_VOICE: Voice = {
  over: (k) => `${gapWord(k)} more than stands outside a whole ten: the repair was begun from the puppet's rows and stopped ${gapWord(k)} late.`,
  under: (k) => `${gapWord(k)} less than stands outside a whole ten: the ten was rebuilt greedily, so ${k === 1 ? 'a counter' : 'counters'} that belonged outside ${k === 1 ? 'was' : 'were'} swept into it.`,
};

const PLAIN_VOICE: Voice = {
  over: (k) => `A count that gained ${gapWord(k)} somewhere: a thing in the group answered to a number word it had already used.`,
  under: (k) => `A count that lost ${gapWord(k)} somewhere: a thing in the group was passed by without a number word of its own.`,
};

function voiced(voice: Voice, tag: ErrorTag): (v: number, key: number) => Card {
  return (v, key) => ({
    text: String(v),
    errorTag: tag,
    rationale: v > key ? voice.over(v - key) : voice.under(key - v),
  });
}

// ===========================================================================
// THE CARDS
// ===========================================================================

/**
 * Three values, every one of them keyable, with the truth in the seat it was
 * dealt.
 *
 * Nothing is written down here: the pool is the slot's own key set, so every
 * number on the page is what some other draw of that same slot really keys and
 * none can be crossed out unread. The seat is settled before the wrong values
 * are chosen (disclosure 7), and the choice of which two neighbours to show is
 * the last thing decided, so it cannot disturb the seat.
 */
function dealCards(
  r: Rng,
  key: number,
  pool: readonly number[],
  keys: ReadonlySet<number>,
  seats: ReadonlyMap<number, SeatShare>,
  why: (v: number, key: number) => Card,
  who: string,
): { choices: ReturnType<typeof makeChoices>['choices']; correctKey: string } {
  const live = [...new Set(pool)].filter((v) => v !== key && keys.has(v));
  if (live.length !== pool.filter((v) => v !== key).length) {
    throw new Error(`A23 dealCards(${who}): a card outside the slot's own key set was offered beside ${String(key)}`);
  }
  const under = live.filter((v) => v < key);
  const over = live.filter((v) => v > key);
  const seat = seatFor(r, seats, key, who);
  const twoOf = (from: number[]) => (from.length <= 2 ? [...from] : r.shuffle([...from]).slice(0, 2));
  const oneOf = (from: number[]) => (from.length === 1 ? from[0] : r.pick(from));
  const values = seat === 0 ? twoOf(over) : seat === 2 ? twoOf(under) : [oneOf(under), oneOf(over)];
  if (values.length !== 2 || new Set(values).size !== 2) {
    throw new Error(`A23 dealCards(${who}): a key of ${String(key)} could not find two honest cards`);
  }
  const shown = [key, ...values].sort((a, b) => a - b);
  if (shown.indexOf(key) !== seat) {
    throw new Error(
      `A23 dealCards(${who}): dealt seat ${String(seat + 1)} but ${String(key)} printed at ${String(shown.indexOf(key) + 1)} of ${shown.join('/')}`,
    );
  }
  return makeChoices(r, String(key), values.map((v) => why(v, key)));
}

/** What a figure this file emits actually holds, for the picture-versus-key check. */
function figureHolds(draft: ItemDraft): number | null {
  const fig = draft.figure;
  if (!fig) return null;
  if (fig.type === 'ten-frame') return fig.params.filled;
  if (fig.type === 'counters') return fig.params.groups.reduce((acc, g) => acc + g.count, 0);
  return null;
}

interface TapSpec {
  /** The key, recomputed from the item's own stored params (disclosure 5). */
  keyOf: (params: Record<string, unknown>) => number;
  keys: ReadonlySet<number>;
  seats: ReadonlyMap<number, SeatShare>;
  poolOf: (key: number) => number[];
  why: (v: number, key: number) => Card;
  tags: ErrorTag[];
  /** How many things the item's own picture must draw, given that key. */
  drawn?: (key: number) => number;
  who: string;
}

/**
 * Fit a numeric generator with the cards a band-A page needs, and rebuild the
 * audit that putting cards on it takes away.
 *
 * The key is worked out a second time from the stored params by a function
 * written in this file, compared with what the generator keyed and with what the
 * picture draws. A disagreement between the library and this week throws at
 * every seed at once instead of surviving on one.
 */
function withTaps(base: ItemGen, spec: TapSpec): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error(`A23 withTaps(${spec.who}): no generator params reached this page, so nothing can be recomputed`);
    const key = spec.keyOf(params);
    const keyedAs = draft.answer.validation === 'choice-key' ? draft.choices?.find((c) => c.isCorrect)?.text : draft.answer.value;
    if (String(key) !== keyedAs) {
      throw new Error(`A23 withTaps(${spec.who}): the page keyed "${String(keyedAs)}" but this week recomputes ${String(key)}`);
    }
    if (!spec.keys.has(key)) {
      throw new Error(`A23 withTaps(${spec.who}): a key of ${String(key)} lies outside the slot's own key set`);
    }
    if (spec.drawn) {
      const held = figureHolds(draft);
      if (held !== spec.drawn(key)) {
        throw new Error(
          `A23 withTaps(${spec.who}): the answer is ${String(key)} but the picture draws ${String(held)}, not ${String(spec.drawn(key))}`,
        );
      }
    }
    const { choices, correctKey } = dealCards(rng, key, spec.poolOf(key), spec.keys, spec.seats, spec.why, spec.who);
    return {
      ...draft,
      choices,
      answer: {
        // `units` belongs to the free-entry form this page has stopped being:
        // the answer is a tapped key now, and every spoken form the item already
        // accepted rides along in `acceptableForms`, which is what QG-13
        // compares the drawing against.
        value: correctKey,
        acceptableForms: [String(key), ...draft.answer.acceptableForms.filter((f) => f !== String(key))],
        validation: 'choice-key',
      },
      errorTags: spec.tags,
    };
  };
}

/**
 * DON'T DRAW THE SAME PAIR OF FRAMES TWICE ON ONE SET OF PAGES.
 *
 * The icon page prints the total it was drawn from and the composition page
 * prints only what is over the ten, so two pages built on the identical picture
 * sign into different namespaces and the pack guard waves both through — the L52
 * shape, sign what the child MEETS. The signature here is taken from what the
 * picture holds instead. Bounded and deterministic, never a loop that runs until
 * it succeeds (L19), and applied innermost so a redraw costs no card draws.
 */
function freshPicture(base: ItemGen, tag: string): ItemGen {
  return (rng, guard, difficulty) => {
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 8 && guard.taken(`a23:${tag}|${String(figureHolds(draft))}`); k++) {
      draft = base(rng, guard, difficulty);
    }
    guard.add(`a23:${tag}|${String(figureHolds(draft))}`);
    return draft;
  };
}

const BREAK_TAGS: ErrorTag[] = ['concept-misconception', 'representation-misread'];
const COUNT_TAGS: ErrorTag[] = ['representation-misread', 'procedure-slip'];

// ===========================================================================
// Local generator 1 — PUT THE TWO PARTS TOGETHER (the recipe's 10+n choice)
// ===========================================================================

/**
 * A whole ten and a few loose ones, side by side, and the child names what they
 * come to — with which heap is the ten decided by a coin.
 *
 * Not `teenTenAnd`: its sentence states the ten first every time and its picture
 * is a double frame, where a ten CANNOT be second (the first frame fills before
 * the next is touched). The order of the two parts is this week's content, so
 * the parts had to stop being regions of one apparatus and become two heaps
 * that can be set down either way round.
 *
 * Registered on `d_verify_binop_v1` — which carries a `verifyFor` and is
 * therefore audited by QG-11 even as a choice item, unlike the family's
 * `a_join_v1` (disclosure 5) — with `{a, b}` in the drawn order, so the params
 * record which heap was put down first as well as what the page comes to.
 */
function joinTheParts(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const over = r.int(1, 9);
      const noun = r.pick(COUNTABLE_NOUNS);
      const name = someone(r, guard);
      const tenFirst = r.chance(0.5);
      const a = tenFirst ? TEN : over;
      const b = tenFirst ? over : TEN;
      const scene = `${countNoun(a, noun)} and ${countNoun(b, noun)} pushed together`;
      const question = tenFirst
        ? `${name} has a whole ten, then ${String(over)} more. Tap the number they make.`
        : `${name} has ${countNoun(over, noun)}, then a whole ten. Tap the number they make.`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, question),
        figure: counterGroups([{ count: a, noun }, { count: b, noun }], {
          relation: 'join',
          alt: joinedAlt(noun, tenFirst),
          asserts: assertsAnswer,
        }),
        answer: { value: String(TEN + over), acceptableForms: [numberWords(TEN + over)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `asks` distinguishes this page from a story that happens to draw the
          // same two numbers: the assembler compares Form-B cores on
          // {templateId, params} alone (a16/a17/a18's finding), and without it a
          // rebuilt draft would spend a freshness surface for nothing.
          params: { a, b, op: '+', asks: 'join', tenFirst },
          seed: r.uint(),
        },
        hintLadder: rungs('Look for the heap you need not count.', 'Hold that ten and count the other heap on.'),
        errorTags: COUNT_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'put-the-parts-together' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — THE BOX (icon-as-unknown, the band-A algebra form)
// ===========================================================================

/**
 * The frames hold a teen, one part of the sentence is a box, and the child fills
 * it. "These are ten and ▢" — or, on the other half of the draws, "These are ▢
 * and ten", because a box that only ever stood second would teach the position
 * rather than the part.
 *
 * Not `partnerBox`, which is the family's own icon-as-unknown form: its `total`
 * is typed `5 | 10` and it partitions the frame it is given, so no draw of it
 * can reach a teen. What is inherited is the shape of the sentence, which is why
 * A12 is one of the warm-ups.
 *
 * The total is SHOWN and never said. That matters more here than anywhere else
 * in the week: at this band the prompt is played aloud, and an English teen name
 * announces its own ones digit — "four-teen" hands over the answer to a child
 * who has only learned to echo the front of a word. `teenExtra` states the
 * total, which is why this page is not that page (disclosure 8).
 */
function boxOnTheFrames(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const boxFirst = r.chance(0.5);
      const question = boxFirst ? 'These are ▢ and ten. Fill the box.' : 'These are ten and ▢. Fill the box.';
      const draft: ItemDraft = {
        type: 'computation',
        // TWO NUMBERS IN THE BRACKET, ON PURPOSE. `signatureOf` signs a prompt
        // carrying one numeral as `<type>|1tok|<n>`, which puts this page, both
        // heap pages and the A9 warm-up in one namespace of nine values against
        // nine draws a pack — saturation, and whichever slot drew last would
        // hold whatever the others did not want (the A1 marginal defect). Naming
        // the packed ten as well moves this page into the commuted namespace and
        // leaves the single-token pool at five draws. Nothing is disclosed by it:
        // `promptText` strips the bracket before anything is shown and
        // `speakablePrompt` plays the figure's own name over it.
        prompt: scenePrompt(`${countNoun(TEN, 'counters')} packed and ${countNoun(n - TEN, 'counters')} over`, question),
        figure: tenFrame(n, { size: 10, frames: 2, alt: FRAMES_ALT, asserts: assertsParam('a') }),
        answer: { value: String(n - TEN), acceptableForms: [numberWords(n - TEN)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: n, b: TEN, op: '-', asks: 'box', boxFirst }, seed: r.uint() },
        hintLadder: rungs('One frame has no gap left in it.', 'The box holds whatever spills past that frame.'),
        errorTags: BREAK_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'fill-the-icon' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — TAKE THE TEN OUT of a heap that has not been sorted
// ===========================================================================

interface HeapShape {
  ask: string;
  bracket: (n: number, noun: string) => string;
  look: string;
  arrangement: string;
  voice: Voice;
}

const HEAP_SHAPES: Record<'jumble' | 'line', HeapShape> = {
  jumble: {
    ask: 'Take a whole ten out. How many stayed?',
    bracket: (n, noun) => `${countNoun(n, noun)} tipped out anyhow`,
    look: 'tipped out anyhow',
    arrangement: 'scattered',
    voice: HEAP_VOICE,
  },
  line: {
    ask: 'Break a whole ten off. How many are over?',
    bracket: (n, noun) => `${countNoun(n, noun)} laid end to end`,
    look: 'laid end to end',
    arrangement: 'in a row',
    voice: LINE_VOICE,
  },
};

/**
 * The same break-apart with nothing on the page grouping the ten for the child.
 *
 * This is the harder half of the anchor and it is where the week is actually
 * tested: on the frames the ten is a thing you can see, and here it has to be
 * MADE before there is anything to be over it. The total is shown rather than
 * said, for the reason recorded on `boxOnTheFrames`.
 */
function takeTheTenOut(which: 'jumble' | 'line'): ItemGen {
  const shape = HEAP_SHAPES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const noun = r.pick(COUNTABLE_NOUNS);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(shape.bracket(n, noun), shape.ask),
        figure: counters(n, noun, {
          arrangement: shape.arrangement,
          alt: looseAlt(noun, shape.look),
          asserts: assertsParam('a'),
        }),
        answer: { value: String(n - TEN), acceptableForms: [numberWords(n - TEN)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: n, b: TEN, op: '-', asks: which, noun },
          seed: r.uint(),
        },
        hintLadder:
          which === 'jumble'
            ? rungs('Slide ten of them right away from the rest.', 'Count only what stayed behind.')
            : rungs('Work from one end and stop at the tenth.', 'Everything after that stop still needs counting.'),
        errorTags: BREAK_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: `pull-a-ten-from-a-${which}` },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — WHICH CARD SAYS IT (the week's discrimination)
// ===========================================================================

/** "10 and 4" — a whole ten and what is over it, written in a drawn order. */
function cardText(over: number, tenFirst: boolean): string {
  return tenFirst ? `${String(TEN)} and ${String(over)}` : `${String(over)} and ${String(TEN)}`;
}

/**
 * A teen on the frames, and three cards each naming a ten and some loose ones.
 *
 * Disclosure 3 records the two framings that were worked through and dropped.
 * What decides this page is the amount — exactly one card comes to what the
 * frames hold — and what makes it the RECIPE'S page is that the cards are
 * written in both orders and the truth takes each of them half the time. Both
 * orders are always present, so there is no "the odd-looking one is wrong" to be
 * learned; and a child who will only accept a card with the ten in front is
 * choosing a wrong amount on half the draws, which is the misconception losing
 * rather than being avoided.
 *
 * Registered on `a_set_for_numeral_v1`, whose `verifyFor` looks up which of the
 * stored options really holds the stored amount and returns it — so QG-11 proves
 * the keyed card from the params rather than believing this file. The frames
 * assert their own count against the same param.
 */
function whichCardSaysIt(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const over = n - TEN;
      const seats = TEEN_SEATS;
      const seat = seatFor(r, seats, n, 'the cards');
      const pool = neighbours(n, TEEN_KEYS, NOTHING_BARRED);
      const under = pool.filter((v) => v < n);
      const above = pool.filter((v) => v > n);
      const twoOf = (from: number[]) => (from.length <= 2 ? [...from] : r.shuffle([...from]).slice(0, 2));
      const oneOf = (from: number[]) => (from.length === 1 ? from[0] : r.pick(from));
      const others = seat === 0 ? twoOf(above) : seat === 2 ? twoOf(under) : [oneOf(under), oneOf(above)];
      if (others.length !== 2 || new Set(others).size !== 2) {
        throw new Error(`A23 whichCardSaysIt: ${String(n)} could not find two honest cards`);
      }
      // Each card takes its own order; if all three come out alike, one is
      // turned round so both readings are always on the page. One draw, no loop.
      const orders = [r.chance(0.5), r.chance(0.5), r.chance(0.5)];
      if (orders[0] === orders[1] && orders[1] === orders[2]) orders[r.int(0, 2)] = !orders[0];
      const amounts = [n, ...others];
      const texts = amounts.map((v, i) => cardText(v - TEN, orders[i]));
      if (new Set(texts).size !== 3) {
        throw new Error(`A23 whichCardSaysIt: two cards read the same (${texts.join(' / ')})`);
      }
      const { choices, correctKey } = makeChoices(
        r,
        texts[0],
        [1, 2].map((i) => ({
          text: texts[i],
          errorTag: (orders[i] === orders[0] ? 'procedure-slip' : 'concept-misconception') as ErrorTag,
          rationale:
            orders[i] === orders[0]
              ? `A whole ten with ${gapWord(Math.abs(amounts[i] - n))} ${amounts[i] > n ? 'too many' : 'too few'} beside it — the loose ones were counted, not the frames.`
              : `The loose part and the ten set down the other way round, which is fine, beside a loose part that is ${amounts[i] > n ? 'larger' : 'smaller'} than the one drawn — so it is the AMOUNT that rules this card out, never the order.`,
        })),
      );
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(`${countNoun(n, 'counters')} along the frames`, 'Tap the card that says these counters.'),
        figure: tenFrame(n, { size: 10, frames: 2, alt: FRAMES_ALT, asserts: assertsParam('n') }),
        choices,
        answer: { value: correctKey, acceptableForms: [texts[0], String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_set_for_numeral_v1',
          params: { n, counts: amounts, nouns: texts, over, tenFirst: orders[0] },
          seed: r.uint(),
        },
        hintLadder: rungs('Count what sits past the packed frame.', 'A card fits only when that part matches.'),
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: { stepCount: 1, cognitiveOp: 'match-the-broken-pair', isDiscrimination: true },
      };
      // The audit QG-5 stops running once the answer is a tapped key.
      if (figureHolds(draft) !== n) {
        throw new Error(`A23 whichCardSaysIt: the frames draw ${String(figureHolds(draft))} against a truth of ${String(n)}`);
      }
      for (const v of amounts) {
        if (!TEEN_KEYS.has(v)) throw new Error(`A23 whichCardSaysIt: a card of ${String(v)} is outside what this page can key`);
      }
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — HELP THE PUPPET, who shared it out fairly
// ===========================================================================

/**
 * The band-A error-analysis form on the recipe's own slip.
 *
 * A NAMED puppet takes the teen apart into two equal shares — "seventeen is
 * seven and seven" is the recipe's example, and the shape is the same at every
 * total: break apart heard as give us half each. Disclosure 1 records why no
 * registered transform returns that pair and how the page derives it honestly
 * instead: THE PUPPET'S TWO NUMBERS ARE THE TWO ROWS OF THE DRAWING, so both are
 * regions a child can point at and count, and the figure asserts the top row
 * against its own stored param. The truth is pinned by the registry.
 *
 * §3's rules kept: the puppet is named rather than "a student", the child
 * repairs it by TAPPING, the word "wrong" never appears, and the numeric truth
 * is recomputed rather than authored. The puppet's numbers stay in the question
 * and are barred from the cards — offering what the puppet said makes "tap one
 * of the other two" worth half a page, which is why this page teaches on Day 3
 * and is not one of the six that certify.
 */
function puppetSharesItOut(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const n = r.pick(SHARE_CELLS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const [bigger, smaller] = fairShares(n);
      const over = n - TEN;
      if (bigger === over || smaller === over) {
        throw new Error(`A23 puppetSharesItOut: a fair share of ${String(n)} already answers the question`);
      }
      const { choices, correctKey } = dealCards(
        r,
        over,
        neighbours(over, SHARE_KEYS, new Set([bigger, smaller])),
        SHARE_KEYS,
        SHARE_SEATS,
        voiced(SHARE_VOICE, 'procedure-slip'),
        'the puppet',
      );
      const draft: ItemDraft = {
        type: 'error-analysis',
        // The puppet's two numbers are stated on purpose — that is the form, and
        // they are the two rows the picture draws. The question then has to ASK
        // something: a page that only reports what a puppet did asks nothing.
        prompt: scenePrompt(
          `${countNoun(bigger, noun)} and ${countNoun(smaller, noun)} in two rows`,
          `${puppet} says these are ${String(bigger)} and ${String(smaller)}. Tap what is over a whole ten.`,
        ),
        figure: counterGroups([{ count: bigger, noun }, { count: smaller, noun }], {
          arrangement: 'in a row',
          relation: 'compare',
          alt: sharesAlt(noun),
          asserts: assertsParam('bigger', 'group:0'),
        }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(over)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: n, b: TEN, op: '-', asks: 'share', bigger, smaller },
          seed: r.uint(),
        },
        hintLadder: rungs('A fair share is not a ten and the rest.', 'Rebuild a whole ten first. Then look again.'),
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-share-fix', isErrorAnalysis: true },
      };
      const held = figureHolds(draft);
      if (held !== n) {
        throw new Error(`A23 puppetSharesItOut: the rows draw ${String(held)} against a total of ${String(n)}`);
      }
      if (bigger + smaller !== n || bigger - smaller > 1 || bigger < smaller) {
        throw new Error(`A23 puppetSharesItOut: ${String(bigger)} and ${String(smaller)} is not a fair share of ${String(n)}`);
      }
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — the Day-4 real-world pages
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null because a single-step picture inside a real
 * situation IS the band-A word problem, not a watered-down two-step. The family
 * has no counting story generator — its word problems join or take away, and
 * this week has taught neither — so the three frames live here.
 *
 * The sentence names the kind and the place and, on two of the three, no
 * quantity at all: the only place the amount exists is the drawing. Scanned
 * against the whole weeks directory at the END of the build (§E2.8), because a
 * shelf, a doorstep, a beach towel, a market stall, a pinboard, an apron, a
 * windowbox, a tree stump, a picnic rug, a garden path, a mat, a ledge, a tray,
 * a sill, a bench, a basket, a stool, a saucer, a hoop, a raft, a wagon, a
 * puddle and a boat were all claimed by weeks written before or beside this one.
 */
interface StoryFrame {
  line: (name: string, noun: string, over: number) => string;
  ask: string;
  bracket: (n: number, noun: string) => string;
  look: string;
  arrangement: string;
  nouns: readonly string[];
  /** 'whole' keys the teen; 'over' keys what stands past the ten. */
  asks: 'whole' | 'over';
  voice: Voice;
  ladder: string[];
}

const STORY_FRAMES: Record<'crate' | 'sandpit' | 'plank', StoryFrame> = {
  crate: {
    line: (name, noun, over) => `${name} packs ten ${unitFor(2, noun)}, then ${String(over)} more.`,
    ask: 'So how many are packed?',
    bracket: (n, noun) => `${countNoun(n, noun)} packed in a crate`,
    look: 'packed into a crate, stacked in tidy rows',
    arrangement: 'in two rows',
    nouns: ['apples', 'blocks', 'buttons'],
    asks: 'whole',
    voice: JOIN_VOICE,
    ladder: ['Ten are counted before you even start.', 'Carry on from ten through the ones left.'],
  },
  sandpit: {
    line: (name, noun) => `${name} digs some ${unitFor(2, noun)} out of a sandpit.`,
    // Nothing is named that the drawing does not hold: the ten is put back into
    // the sand the child can see, never into a bucket nobody drew (L27).
    ask: 'A whole ten is put back. How many stay?',
    bracket: (n, noun) => `${countNoun(n, noun)} dug out of a sandpit`,
    look: 'left lying about where they were dropped',
    arrangement: 'scattered',
    nouns: ['shells', 'balls', 'blocks'],
    asks: 'over',
    voice: HEAP_VOICE,
    ladder: ['Scoop ten of them out of the sand.', 'Whatever escaped that scoop is the answer.'],
  },
  plank: {
    line: (name, noun) => `${name} lays some ${unitFor(2, noun)} along a plank.`,
    ask: 'How many are past the first ten?',
    bracket: (n, noun) => `${countNoun(n, noun)} laid along a plank`,
    look: 'set out in a straight line, evenly spaced',
    arrangement: 'in a row',
    nouns: ['leaves', 'flowers', 'buttons'],
    asks: 'over',
    voice: LINE_VOICE,
    ladder: ['Find the tenth one and put a finger on it.', 'Count from there to the far end.'],
  },
};

function teenStory(which: 'crate' | 'sandpit' | 'plank'): ItemGen {
  const frame = STORY_FRAMES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const over = n - TEN;
      const noun = r.pick(frame.nouns);
      const name = someone(r, guard);
      const whole = frame.asks === 'whole';
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(frame.bracket(n, noun), `${frame.line(name, noun, over)} ${frame.ask}`),
        figure: counters(n, noun, {
          arrangement: frame.arrangement,
          alt: looseAlt(noun, frame.look),
          // A whole-amount page draws exactly what it keys, so it asserts the
          // answer; a break-apart page draws ten more than it keys, so it
          // asserts the stored total instead. Getting that backwards would make
          // the picture an echo of the generator rather than a check on it.
          asserts: whole ? assertsAnswer : assertsParam('a'),
        }),
        answer: {
          value: String(whole ? n : over),
          acceptableForms: [numberWords(whole ? n : over)],
          validation: 'exact-numeric',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // A whole-amount story puts its two pieces together; a break-apart
          // story takes the ten off what is drawn. Same registered transform,
          // opposite move, and `asks` keeps two stories that drew the same
          // numbers from reading as one question to the Form-B collision check.
          params: whole
            ? { a: TEN, b: over, op: '+', asks: which, noun }
            : { a: n, b: TEN, op: '-', asks: which, noun },
          seed: r.uint(),
        },
        hintLadder: rungs(...frame.ladder),
        errorTags: ['task-comprehension', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: `story-${which}`, situationType: 'part-whole' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 7 — the Day-5 build, and the telling that goes with it
// ===========================================================================

/**
 * The catalog's own Day-5 line, built rather than read: fill the frame, count
 * what is over. The child puts the counters in, and then SAYS which part is the
 * ten and which part is over it — the only place the difference between doing it
 * and understanding it can actually be heard.
 *
 * `manual-review` is both the honest validation and the right input mode: at
 * band A `AnswerEntry` renders a manual-review page as one oversized
 * acknowledgement, so a four-year-old never meets the keyboard that a `'set'`
 * answer would route them to (still an open routing question, raised by A12 and
 * seconded by A13). The truth is still code-computed — the registry recomputes
 * what is over the ten from the same `n` the instruction states — so the
 * grown-up marking it has the number in front of them. The frames carry no
 * assertion because an empty pair of frames is the workspace, not a claim.
 */
function buildAndSay(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const draft: ItemDraft = {
        type: 'reasoning',
        // GIVEN, not a leak: the question itself says how many to put in, and
        // what it asks for is the part that is over the ten.
        prompt: scenePrompt('two empty frames', `Build ${String(n)} in the frames. Say what is over.`),
        figure: tenFrame(0, { size: 10, frames: 2, alt: EMPTY_FRAMES_ALT }),
        answer: {
          value: String(n - TEN),
          acceptableForms: [numberWords(n - TEN), `a whole ten and ${countNoun(n - TEN, 'counters')}`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: n, b: TEN, op: '-', asks: 'build' }, seed: r.uint() },
        hintLadder: rungs('Load the near frame until no cell is left.', 'Then point at the ones sitting outside it.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'build-then-name-the-parts' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 8 — the Day-5 break-apart match
// ===========================================================================

/**
 * Three drawn groups, and the child taps the one that is a whole ten with a
 * stated number over it.
 *
 * The recipe's Day-5 signature, run in the direction the rest of the week does
 * not: everywhere else the amount is shown and its parts are asked for, and here
 * the PARTS are stated and the amount has to be found. Nothing on the page has
 * grouped the ten inside any of the three groups, so each one has to be counted
 * through — which is also why the counts sit close together rather than at
 * arm's length.
 *
 * Registered on `a_set_for_numeral_v1`, the family's own numeral-to-set
 * transform, which finds the group really holding the stated amount and returns
 * its name. The stated number of loose ones never names the amount out loud, so
 * a child who hears only the front of a teen word has nothing to echo.
 */
function groupThatBreaks(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(LO, HI);
      const over = n - TEN;
      const seat = seatFor(r, TEEN_SEATS, n, 'the match');
      const pool = neighbours(n, TEEN_KEYS, NOTHING_BARRED);
      const under = pool.filter((v) => v < n);
      const above = pool.filter((v) => v > n);
      const twoOf = (from: number[]) => (from.length <= 2 ? [...from] : r.shuffle([...from]).slice(0, 2));
      const oneOf = (from: number[]) => (from.length === 1 ? from[0] : r.pick(from));
      const others = seat === 0 ? twoOf(above) : seat === 2 ? twoOf(under) : [oneOf(under), oneOf(above)];
      if (others.length !== 2 || new Set(others).size !== 2) {
        throw new Error(`A23 groupThatBreaks: ${String(n)} could not find two honest groups`);
      }
      const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
      const target = r.int(0, 2);
      const counts = [others[0], others[1]];
      const laid = [0, 1, 2].map((i) => (i === target ? n : (counts.shift() as number)));
      const { choices, correctKey } = makeChoices(
        r,
        `the ${nouns[target]}`,
        [0, 1, 2]
          .filter((i) => i !== target)
          .map((i) => ({
            text: `the ${nouns[i]}`,
            errorTag: 'representation-misread' as ErrorTag,
            rationale: `That group is a whole ten with ${gapWord(Math.abs(laid[i] - n))} ${laid[i] > n ? 'too many' : 'too few'} over it — near enough to answer from a glance, and not near enough to be right.`,
          })),
      );
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(
          laid.map((c, i) => countNoun(c, nouns[i])).join(', '),
          `Tap the group that is a ten and ${String(over)} over.`,
        ),
        figure: counterGroups(
          laid.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
          { alt: groupsAlt(nouns), asserts: assertsParam('n', `group:${String(target)}`) },
        ),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${nouns[target]}`, nouns[target]], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_set_for_numeral_v1', params: { n, counts: laid, nouns, over }, seed: r.uint() },
        hintLadder: rungs('Every group here holds a whole ten inside it.', 'Check what pokes out past that ten.'),
        errorTags: ['representation-misread', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'find-the-broken-amount' },
      };
      return draft;
    });
}

// ===========================================================================
// The seat tables, one per carded slot (disclosure 7)
// ===========================================================================

const TEEN_SEATS = seatShares(TEEN_CELLS, (k) => neighbours(k, TEEN_KEYS, NOTHING_BARRED), 'a whole teen');
const OVER_SEATS = seatShares(OVER_CELLS, (k) => neighbours(k, OVER_KEYS, NOTHING_BARRED), 'what is over');
const SHARE_SEATS = seatShares(
  [...SHARE_KEYS].sort((a, b) => a - b),
  (k) => {
    const [bigger, smaller] = fairShares(k + TEN);
    return neighbours(k, SHARE_KEYS, new Set([bigger, smaller]));
  },
  'the puppet',
);
const RING_SEATS = seatShares([...RING_KEYS].sort((a, b) => a - b), (k) => neighbours(k, RING_KEYS, NOTHING_BARRED), 'a teen in a ring');
const HIDE_SEATS = seatShares([...HIDE_KEYS].sort((a, b) => a - b), (k) => neighbours(k, HIDE_KEYS, NOTHING_BARRED), 'the hidden part');
const BOX5_SEATS = seatShares([...BOX5_KEYS].sort((a, b) => a - b), (k) => neighbours(k, BOX5_KEYS, NOTHING_BARRED), 'the small box');
const HEAP_SEATS = seatShares([...HEAP_KEYS].sort((a, b) => a - b), (k) => neighbours(k, HEAP_KEYS, NOTHING_BARRED), 'two small heaps');

// ===========================================================================
// The generators, bound to this week's ranges and given its voice
// ===========================================================================

/** CERTIFIES (mastery 01) — the two parts put together, either way round. */
const partsTogether = spokenSafe(
  withTaps(joinTheParts(), {
    keyOf: (p) => Number(p.a) + Number(p.b),
    keys: TEEN_KEYS,
    seats: TEEN_SEATS,
    poolOf: (k) => neighbours(k, TEEN_KEYS, NOTHING_BARRED),
    why: voiced(JOIN_VOICE, 'procedure-slip'),
    tags: COUNT_TAGS,
    drawn: (k) => k,
    who: 'the two heaps',
  }),
  'the two heaps',
);

/** CERTIFIES (mastery 02) — the icon-as-unknown, on the anchor. */
const iconBox = spokenSafe(
  withTaps(boxOnTheFrames(), {
    keyOf: (p) => Number(p.a) - Number(p.b),
    keys: OVER_KEYS,
    seats: OVER_SEATS,
    poolOf: (k) => neighbours(k, OVER_KEYS, NOTHING_BARRED),
    why: voiced(FRAME_VOICE, 'representation-misread'),
    tags: BREAK_TAGS,
    drawn: (k) => k + TEN,
    who: 'the box',
  }),
  'the box',
);
const iconBoxDay = freshPicture(iconBox, 'frames');

/** CERTIFIES (mastery 04) — the same break with nothing grouping the ten. */
function heapBreak(which: 'jumble' | 'line'): ItemGen {
  return spokenSafe(
    withTaps(takeTheTenOut(which), {
      keyOf: (p) => Number(p.a) - Number(p.b),
      keys: OVER_KEYS,
      seats: OVER_SEATS,
      poolOf: (k) => neighbours(k, OVER_KEYS, NOTHING_BARRED),
      why: voiced(HEAP_SHAPES[which].voice, 'procedure-slip'),
      tags: BREAK_TAGS,
      drawn: (k) => k + TEN,
      who: `a ${which}`,
    }),
    `a ${which}`,
  );
}
const jumbleBreak = heapBreak('jumble');
const lineBreak = heapBreak('line');

/** CERTIFIES (mastery 03) — the week's discrimination. */
const cardMatch = spokenSafe(whichCardSaysIt(), 'the cards');
const cardMatchDay = freshPicture(cardMatch, 'frames');

const puppetPage = spokenSafe(freshPicture(puppetSharesItOut(), 'shares'), 'the puppet');

/** CERTIFIES (mastery 06) — the transfer page, with no frame anywhere on it. */
function cardedStory(which: 'crate' | 'sandpit' | 'plank'): ItemGen {
  const frame = STORY_FRAMES[which];
  const whole = frame.asks === 'whole';
  return spokenSafe(
    withTaps(teenStory(which), {
      keyOf: (p) => (whole ? Number(p.a) + Number(p.b) : Number(p.a) - Number(p.b)),
      keys: whole ? TEEN_KEYS : OVER_KEYS,
      seats: whole ? TEEN_SEATS : OVER_SEATS,
      poolOf: (k) => neighbours(k, whole ? TEEN_KEYS : OVER_KEYS, NOTHING_BARRED),
      why: voiced(frame.voice, 'procedure-slip'),
      tags: ['task-comprehension', 'procedure-slip'],
      drawn: (k) => (whole ? k : k + TEN),
      who: `the ${which}`,
    }),
    `the ${which}`,
  );
}
const storyCrate = cardedStory('crate');
const storySandpit = cardedStory('sandpit');
const storyPlank = cardedStory('plank');

/** CERTIFIES (mastery 05) — the break-apart match, run the other way round. */
const matchTheBreak = spokenSafe(groupThatBreaks(), 'the match');

const day5Build = spokenSafe(buildAndSay(), 'the build');

// --- the four warm-ups: one week, one format and one day each ----------------
const warmRingTeen = warmUp(
  spokenSafe(
    withTaps(countArrangement({ min: LO, max: HI, arrangement: 'in a ring' }), {
      keyOf: (p) => Number(p.n),
      keys: RING_KEYS,
      seats: RING_SEATS,
      poolOf: (k) => neighbours(k, RING_KEYS, NOTHING_BARRED),
      why: voiced(PLAIN_VOICE, 'procedure-slip'),
      tags: ['procedure-slip'],
      drawn: (k) => k,
      who: 'a teen in a ring',
    }),
    'a teen in a ring',
  ),
  9,
);

const warmHiddenTen = warmUp(
  spokenSafe(
    withTaps(partnersHiding({ total: 10 }), {
      keyOf: (p) => Number(p.total) - Number(p.shown),
      keys: HIDE_KEYS,
      seats: HIDE_SEATS,
      poolOf: (k) => neighbours(k, HIDE_KEYS, NOTHING_BARRED),
      why: voiced(PLAIN_VOICE, 'concept-misconception'),
      tags: ['concept-misconception', 'fact-recall'],
      drawn: (k) => TEN - k,
      who: 'the hidden part',
    }),
    'the hidden part',
  ),
  13,
);

/**
 * A12's icon sentence, with the accessible name repaired on the way past.
 *
 * `partnerBox` builds its alt out of its own scene string, so the picture is
 * announced as "a frame of 5 with 3 counters and a covered box" — two digits
 * played to a pre-reader before a question about a number. Both are stated in
 * the question too, so nothing is disclosed that the child was not told; the
 * rule is still the rule, and at band A a spoken digit before the question is
 * exactly what L48 closed. Repaired here, reported to the orchestrator, not
 * fixed in `lib/` (disclosure 9).
 */
const warmBoxOfFive = warmUp(
  spokenSafe(
    withTaps(withPlainAlt(partnerBox({ total: 5 }), 'the small frame, some of its cells behind a cover'), {
      keyOf: (p) => Number(p.total) - Number(p.shown),
      keys: BOX5_KEYS,
      seats: BOX5_SEATS,
      poolOf: (k) => neighbours(k, BOX5_KEYS, NOTHING_BARRED),
      why: voiced(PLAIN_VOICE, 'concept-misconception'),
      tags: ['concept-misconception', 'task-comprehension'],
      drawn: (k) => 5 - k,
      who: 'the small box',
    }),
    'the small box',
  ),
  12,
);

const warmTwoHeaps = warmUp(
  spokenSafe(
    withTaps(pictureJoin({ min: JOIN_LO, max: JOIN_HI, maxTotal: 10 }), {
      keyOf: (p) => Number(p.a) + Number(p.b),
      keys: HEAP_KEYS,
      seats: HEAP_SEATS,
      poolOf: (k) => neighbours(k, HEAP_KEYS, NOTHING_BARRED),
      why: voiced(PLAIN_VOICE, 'procedure-slip'),
      tags: ['task-comprehension', 'procedure-slip'],
      drawn: (k) => k,
      who: 'two small heaps',
    }),
    'two small heaps',
  ),
  14,
);

// ===========================================================================
// The week
// ===========================================================================

export const buildA23 = makeWeekBuilder({
  level: 'A',
  week: 23,
  conceptId: 'teen-numbers-ten-plus-some',
  conceptName: 'Teen numbers = 10 + some',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 9 },
    { level: 'A', week: 13 },
  ],
  pedagogyContract: 'v2',
  // Band A spends the §6.1 multi-step row on the pictorial rule, so this
  // selector is inert here; it is declared because the kit asks every non-D
  // blueprint to name its family, and taking an amount apart into a ten and
  // what is over is a place-value move rather than an operation.
  conceptFamily: 'place-value',
  conceptualAnchor: 'a whole ten and what is over',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt is spoken, never read; one question fills a page; targets are finger-sized. Keep ten of something in a pot and a loose handful beside it, and do the breaking with hands before anything happens on the screen. Say both parts out loud each time and swap which one you name first, because a child who only ever hears the ten first learns an order instead of an amount. When a teen comes apart, put the ten down first and count what is left; when it goes back together, start from the ten and carry on. Sharing the pile into two equal halves is the expected mistake and it is a sensible one — say what it does, do not correct it. Mascot present.',
  },
  explanation: {
    hook: say('Here is a heap. Push ten of them aside. Look what is left. That little bit is easy to see.'),
    whyBeforeHow: say(
      'A teen number comes apart into two pieces. Each teen is a whole ten and what is over. So we never count that ten again. It is already counted. The two pieces go down either way round. Ten first, or the little part first. The heap is the same size both times.',
    ),
    script: [
      {
        say: say('This frame is full. That is a whole ten.'),
        visual: 'The left frame full to its corners; the right frame bare.',
        figure: tenFrame(10, { size: 10, frames: 2, alt: alt('a full frame standing next to an empty frame') }),
      },
      {
        say: say('Now four wait outside it. So this comes apart neatly.'),
        visual: 'The same full frame, now with a few counters spilling into the next.',
        figure: tenFrame(14, { size: 10, frames: 2, alt: FRAMES_ALT }),
      },
      {
        // The order idea, taught where both arrangements are on the page and the
        // answer is already known (disclosure 2).
        say: say('Watch. I move the little part in front. Still the same heap!'),
        visual: 'The four counters moved to the left of the packed ten, as two loose heaps.',
        figure: counterGroups([{ count: 4, noun: 'blocks' }, { count: 10, noun: 'blocks' }], {
          relation: 'join',
          alt: joinedAlt('blocks', false),
        }),
      },
      {
        say: say('Sharing it in half is not breaking it apart. Look why.'),
        visual: 'The same amount laid out as two equal rows, beside the packed frame.',
        figure: counterGroups([{ count: 7, noun: 'blocks' }, { count: 7, noun: 'blocks' }], {
          arrangement: 'in a row',
          relation: 'compare',
          alt: sharesAlt('blocks'),
        }),
      },
    ],
    summary: say(
      'Find the whole ten and put it down. Count what is over. Those two pieces are the number. Swap them round and nothing changes.',
    ),
    vocabulary: [
      { term: 'break apart', kidGloss: 'split a heap into a whole ten and the rest' },
      { term: 'a whole ten', kidGloss: 'the packed part that is already counted' },
      { term: 'over', kidGloss: 'the loose ones standing past the packed ten' },
      { term: 'either way round', kidGloss: 'the two pieces put down in any order' },
    ],
  },
  guidedExamples: [
    {
      ...ge(
        23,
        1,
        'modeled',
        // No name here, and none in any example below: every name this week uses
        // is drawn from `NAMES` at item time, and hardcoding one that is also in
        // the pool is the kit §F.3 collision.
        scenePrompt('a large heap of shells and a small heap pushed together', 'A whole ten, then 4 more. Tap the number they make.'),
        [
          {
            teacherSay: say('Watch me. I am not counting the big heap. I can see it is a whole ten already.'),
            expected: '10',
          },
          { childDo: say('Count the little heap on from there.'), expected: '11, 12, 13, 14' },
          { teacherSay: say('Fourteen. A whole ten, and four standing over it.') },
        ],
        '14',
      ),
      visual: 'A heap of ten shells pushed up against a heap of four.',
      figure: counterGroups([{ count: 10, noun: 'shells' }, { count: 4, noun: 'shells' }], {
        relation: 'join',
        alt: joinedAlt('shells', true),
        asserts: assertsAnswer,
      }),
    },
    {
      ...ge(23, 2, 'completion', scenePrompt('counters along the frames', 'These are ten and ▢. Fill the box.'), [
        { teacherSay: say('I will start. The first frame has no gap left.') },
        { childDo: say('So count only what stands outside it.'), expected: '6' },
        { teacherSay: say('The box holds six. A whole ten, and six over.') },
      ], '6'),
      // NO ASSERTION ON THE LAST THREE EXAMPLES, and it is a schema fact rather
      // than a preference: a guided example is audited against its ANSWER alone
      // (`validator.ts` passes `{answer: [g.answer]}` and no params), and each of
      // these draws a whole teen while keying a piece of one. `assertsAnswer`
      // would set QG-13 comparing an honest picture with a correct answer and
      // calling them a contradiction, which is worse than making no claim.
      visual: 'Every cell of the left frame taken, and a handful begun on the right.',
      figure: tenFrame(16, { size: 10, frames: 2, alt: FRAMES_ALT }),
    },
    {
      ...ge(23, 3, 'prompted', scenePrompt('counters along the frames', 'Tap the card that says these counters.'), [
        { teacherSay: say('Two of these cards put the ten first. One does not.') },
        { childDo: say('Never mind the order. Which amount fits?'), expected: '12' },
        { teacherSay: say('Both ways round would have been fine here.') },
      ], '2 and 10'),
      visual: 'The frames with a packed ten and a small group beside it, and three cards below.',
      figure: tenFrame(12, { size: 10, frames: 2, alt: FRAMES_ALT }),
    },
    {
      ...ge(23, 4, 'independent', scenePrompt('buttons tipped out anyhow', 'Take a whole ten out. How many stayed?'), [
        { childDo: say('Slide ten away, then count what is left.'), expected: '3' },
      ], '3'),
      visual: 'A loose scatter of buttons, with a group of ten pushed clear of the rest.',
      figure: counters(13, 'buttons', {
        arrangement: 'scattered',
        alt: looseAlt('buttons', 'tipped out anyhow'),
      }),
    },
  ],
  days: [
    // Day 1 — the two pieces meet: put them together, then take them apart on the
    // apparatus where the ten can be seen.
    [
      { gen: warmRingTeen, diff: 1 },
      { gen: partsTogether, diff: 2 },
      { gen: iconBoxDay, diff: 2 },
      { gen: matchTheBreak, diff: 3 },
    ],
    // Day 2 — the frames go away for the break, and the order of the pieces meets
    // its trap.
    [
      { gen: warmHiddenTen, diff: 2 },
      { gen: partsTogether, diff: 2 },
      { gen: cardMatchDay, diff: 3 },
      { gen: jumbleBreak, diff: 3 },
    ],
    // Day 3 — the trap again, the puppet who shared it out fairly, and one more
    // break with nothing grouping the ten.
    [
      { gen: warmBoxOfFive, diff: 2 },
      { gen: iconBoxDay, diff: 3 },
      { gen: cardMatchDay, diff: 3 },
      { gen: puppetPage, diff: 3 },
    ],
    // Day 4 — single-step real-world pictures (the band-A form of G7), two of
    // them asking for the part that stands over the ten.
    [
      { gen: warmTwoHeaps, diff: 2 },
      { gen: storyCrate, diff: 2 },
      { gen: storySandpit, diff: 3 },
      { gen: storyPlank, diff: 3 },
    ],
    // Day 5 — match a stated break to the amount that has it, break one more
    // loose line, then build a teen and say both of its pieces.
    [
      { gen: matchTheBreak, diff: 2 },
      { gen: lineBreak, diff: 3 },
      { gen: day5Build, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    "For grown-ups: this week is not more counting. It is the idea that a teen amount is made of two pieces, one of which is always a whole ten, and that those pieces are things rather than places - so ten with four beside it and four with ten beside it are the same heap. Two things are worth watching for. The first is the mistake the puppet makes: asked to break fourteen apart, a great many four-year-olds share it into seven and seven, because at this age break apart and share out fairly are the same phrase. That is a sensible mistake and it deserves a sentence rather than a correction - say what a fair share does, then rebuild the ten in front of them and let them see the difference. The second is quieter: a child can get every page right by hearing the front of the number word, since four-teen announces its own four. So do it away from the screen with objects and no number named at all - tip out a handful, ask them to pull a whole ten out of it, and ask what is left. Keep ten of something in a pot so the ten is a THING with a lid on it, and swap which piece you name first every single time.",
  ],
  /**
   * The band-A production puzzle, and the making is the mathematics.
   *
   * Every core page hands the child one end to work from: the frame fills from
   * its first cell, the story runs from the start of the line. Here the ten is
   * pulled out twice, once from each end, and the question is whether what is
   * left comes out the same both times — which is the week's own idea applied to
   * a move the core never asks for. `manual-review`, because nothing can grade a
   * crayon and because `Puzzle` carries no `choices` field at all in `types.ts`:
   * left numeric it would fall through to `tapOptionsFor`, which invents buttons
   * from the answer alone. The number the ringing must come to is in
   * `answer.value` for the grown-up and for any audit. The picture carries no
   * assertion — what it draws is the whole line, and what the page asks for only
   * exists once a ring has been drawn round part of it.
   */
  puzzle: (r, guard) => {
    // Not a length the days have already worked on. Bounded, deterministic, and
    // the range holds nine values against at most a handful taken.
    let n = r.int(LO, HI);
    for (let k = 0; k < 12 && guard.taken(`a23:ring|${String(n)}`); k++) n = r.int(LO, HI);
    guard.add(`a23:ring|${String(n)}`);
    const scene = `${countNoun(n, 'buttons')} in one long line`;
    return {
      id: 'A23-PZ-01',
      title: 'Puzzle Grove: A Ten From Each End',
      puzzleType: 'construction',
      prompt: [
        `[image: ${scene}]`,
        say('Ring ten from the left end.'),
        say('Now ring ten from the right end.'),
        say('How many are over each time?'),
      ].join(' '),
      figure: counters(n, 'buttons', { arrangement: 'in a row', alt: looseAlt('buttons', 'stretched out in a long line') }),
      answer: {
        value: String(n - TEN),
        acceptableForms: [numberWords(n - TEN), 'the same both times'],
        validation: 'manual-review',
      },
      hintLadder: rungs('Ring ten of them before counting anything.', 'The ones outside your ring are the answer.'),
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'ring-a-ten-from-either-end' },
  sprint: null,
  mastery: [
    { gen: partsTogether, diff: 2 },
    { gen: iconBox, diff: 2 },
    { gen: cardMatch, diff: 3 },
    { gen: jumbleBreak, diff: 3 },
    { gen: matchTheBreak, diff: 3 },
    { gen: storySandpit, diff: 3 },
  ],
  isomorphNotes:
    'Form B answers Form A slot for slot - the same generator at the same difficulty in each place, with its numbers drawn off a separate stream - and every slot is a tap on cards written into this file, so no certifying page is left as a bare numeral for the display layer to build buttons around. 01 sets a whole ten beside a few loose ones and asks what they come to, with which of the two heaps is the ten decided by a fair coin, so the page is answered by the amount and never by the position. 02 is the icon sentence on the frames, where the box stands before the ten as often as after it and the total is drawn rather than spoken - which matters at this band, because a teen name says its own ones digit out loud and a spoken total would hand the answer to a child who has only learned to echo the front of a word. 04 asks the same break of a heap that nobody has sorted, so the ten has to be made before anything can stand over it, and it is the hardest of the four numeric slots for that reason. 06 is a real-world page with no frame anywhere on it. On the whole-amount slots the cards are drawn from 11-19 and on the break-apart slots from 1-9, in both cases the set the slot itself keys, so every numeral offered is one that slot really keys on some other draw and none can be struck out unread. WHICH SEAT the truth takes is settled by weights before any wrong value is chosen, because eleven has nothing beneath it in its set and nineteen nothing above it, and a set left to itself starves its middle seat. 03 is the discrimination and it is the reason the week exists: a teen on the frames against three cards, each naming a whole ten and some loose ones in one order or the other, with both orders always on the page and the truth taking each of them half the time - so a child who will only accept a card with the ten in front is choosing a wrong AMOUNT half the time, and no shape, size or position on the page survives as a shortcut. 05 states the two pieces and asks which of three counted groups has them, which is the only slot in the week that runs from the parts to the whole. What is NOT separately enforced, rather than claimed away: Form B is kept off Form A ground by the assembler, which rebuilds any Form-B page whose template and params match its twin, and by the pack-wide surface guard - but the count-and-kind pairing inside a page is not signed, and the frame pictures are additionally kept apart on the DAY pages only, by a signature taken from what the picture holds rather than from what the prompt prints. The mastery forms draw free there on purpose: five frame draws against nine counts would leave whichever slot drew last holding the leftover, which is the marginal defect a wide signature exists to prevent. This week is the third in a row about the same nine numerals and the ledger cannot see that - A9 counted them, A10 wrote them, and A23 takes them apart - so what is new here is stated in the parent strip and in the report rather than in a deepeningDelta the gate never asked for.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'shares-it-out-fairly',
      description:
        'Asked to break a teen apart, splits it into two equal shares - fourteen as seven and seven - because at four or five "break it apart" and "share it out fairly" are the same instruction. It is the recipe\'s own slip and it is not a miscount: the arithmetic of the halving is usually perfect.',
      exampleWrongAnswer: 'sixteen broken into eight and eight',
      distractorRationale:
        'It cannot be a card. The value a fair share produces is at least six while the truth is at most nine, so on most draws it is a number the page could key for some other total, and offering it beside a prompt that has already said it out loud would make "tap one of the other two" worth half a page. So it is SHOWN in the puppet question, where the child has to produce the repair rather than avoid a lure, and both of the puppet\'s numbers are barred from that page\'s own card pool.',
      reteachPointer: 'explanation/script[3] (sharing it in half is not breaking it apart)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'the-ten-must-come-first',
      description:
        'Accepts "ten and 4" as a description of a teen amount and rejects "4 and ten", because the two pieces have been learned as positions rather than as things. A child holding this can compose and decompose perfectly and still fail the moment the parts arrive in the other order - which is most of real life.',
      exampleWrongAnswer: 'shown a packed ten and 4 loose, rejects the card reading "4 and 10"',
      distractorRationale:
        'Every page that names both pieces draws their order from a fair coin, and the discrimination puts both readings on the page every single time with the truth taking each of them half the time. So the misconception does not merely fail to help - it actively costs, because the card it prefers carries a loose part that does not match the drawing. Rotating the order rather than teaching it is the whole design: a rule about which piece leads is exactly what this week exists to remove.',
      reteachPointer: 'explanation/script[2] (the little part moved in front, still the same heap)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'answers-the-front-of-the-word',
      description:
        'Hears "fourteen", says "four", and is right - because an English teen name announces its own ones digit before anything else. It looks like understanding and it is not: the same child hands back "four" for how many there are in all, and cannot do it at all when nobody says the number.',
      exampleWrongAnswer: 'asked how many in all for a drawn fourteen, answers 4',
      distractorRationale:
        'This one is met by the TASK and not by an option, because the numeral it produces is the right answer to the question next door. So no break-apart page in this week states its total: the icon sentence, both heap pages, the two break-apart stories and the Day-5 match all SHOW the amount and ask for a piece of it. The only pages that say a number out loud are the ones that state a PIECE and ask for the whole, where echoing it is a wrong answer.',
      reteachPointer: 'guidedExamples/A23-GE-04 (slide ten away, then count what is left)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-the-packed-ten-again',
      description:
        'Starts at one and counts straight through the packed frame before reaching the loose ones. The total usually comes out right and the break-apart never does, because the ten was never a piece - it was just the first ten things.',
      exampleWrongAnswer: 'reports 13 for what is over the ten on a drawn thirteen',
      distractorRationale:
        'Values one and two past the truth sit in the pool on every break-apart page, which is what a leaking packed frame produces when a counter or two inside it gets named as though it stood outside. They are honest miscounts of the same picture rather than decoys, and both are the true answer on some other draw of the same slot, so a child cannot separate them by eye and has to look at the frame again.',
      reteachPointer: 'explanation/script[0] (a full frame is a whole ten, already counted)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'the-ten-takes-a-stray-with-it',
      description:
        'Pulls a group of ten out of an unsorted heap and takes eleven, so what is left is a step light. It is the slip that belongs to this week specifically: on the frames the ten is fixed by the apparatus, and in a heap it has to be made by hand, which is a different act with a different way of going wrong.',
      exampleWrongAnswer: 'a heap of 15 broken as a ten and 4',
      distractorRationale:
        'One short and two short both stand in the pool on the heap pages and in the two loose stories, mirroring the pair above the truth, so the page cannot be answered by leaning one way. The account attached to each card is read off its VALUE rather than off the branch that chose it, so a rationale can never drift away from the number it explains.',
      reteachPointer: 'guidedExamples/A23-GE-02 (the first frame has no gap left)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'gives-back-the-piece-that-was-stated',
      description:
        'On a page that states one piece and asks for the whole, hands back the piece. It is the mirror of answering the front of the word and it shows up on the composition pages and on the Day-5 match, where a number is spoken and a bigger one is wanted.',
      exampleWrongAnswer: 'told a whole ten and 6 more, answers 6',
      distractorRationale:
        'The stated piece is never a card on those pages: they key 11-19 and the piece is at most nine, so a single digit could not be right under any draw and putting it there would teach a child to strike out small numbers instead of to count. The habit is met by the CARDS being close together instead - all three are whole teens within two of each other, so the decision is about how far past the ten the drawing goes.',
      reteachPointer: 'guidedExamples/A23-GE-01 (a whole ten, and four standing over it)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Taking teen amounts apart and putting them back together. Every number from eleven to nineteen is made of two pieces, and one of them is always a whole ten - so we practised pulling that ten out of a heap, naming what was left standing over it, and then joining the two pieces back up. We also worked hard on one particular idea: the two pieces can be put down in either order. A whole ten with four beside it and four with a whole ten beside it are the same heap, and a card saying either one is a true card.',
    improvingCandidates: [
      'pulling a whole ten out of a heap that nobody has sorted',
      'naming what stands over the ten without counting the ten again',
      'reading a broken-up amount whichever piece is named first',
      'filling in a missing piece when the box stands for it',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'telling a fair share apart from a break into a whole ten and the rest',
      },
      {
        errorTag: 'representation-misread',
        text: 'treating the packed ten as one piece rather than counting through it again',
      },
      {
        errorTag: 'procedure-slip',
        text: 'pulling out exactly ten by hand, so nothing extra travels with it',
      },
      {
        errorTag: 'task-comprehension',
        text: 'noticing whether a page wants a piece or wants the whole heap',
      },
    ],
    homeFocus: {
      praiseLine:
        'You broke the heap into a whole ten and the rest, and you counted only the part that was left over.',
      questionForChild: 'Tip out a handful. Can you pull a whole ten out of it?',
      schoolSyncHook: 'Say the word if columns of tens and ones turn up in school books, and we will match the pace.',
    },
    vocabularyForParent: [
      'break apart (split an amount into a whole ten and whatever is over it)',
      'a whole ten (the piece that is already counted, so it never gets counted again)',
      'over (the loose ones standing past the packed ten)',
      'either way round (the two pieces put down in any order - the amount does not change)',
    ],
  },
});
