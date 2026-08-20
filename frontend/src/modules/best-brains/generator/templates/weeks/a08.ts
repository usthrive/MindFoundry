/**
 * Level A · Week 8 — "Position & sorting" (conceptId: position-and-sorting).
 *
 * FILL-ARCHITECTURE §3 row A8: anchor "above/below/beside scene"; core forms
 * "choose the position word" and "attribute sort"; perceptual discrimination
 * **left/right vs above/below**; puppet error-analysis "sorts one item by the
 * wrong attribute"; Day-5 "two-way sort". Catalog row: sort by one attribute and
 * count the sorted groups, with above/below/beside/between picture logic as the
 * non-computational Day-5 focus.
 *
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 *
 *  - **ONE KIND TO A GROUP, AND EVERY GROUP IN A PLACE OF ITS OWN.** Those are
 *    the two halves and they are deliberately not taught apart. A sorted board
 *    can be read by WHAT a group holds or by WHERE it sits, and a four-year-old
 *    who has only ever been asked one of those two questions answers the other
 *    one by habit. So the board is the same apparatus all week and the QUESTION
 *    keeps changing which of its two handles it takes hold of.
 *  - **THE MISCONCEPTION IS ONE THING WEARING TWO COATS.** Answering by place
 *    when the question named a kind is the puppet's slip; answering with a
 *    side-to-side word for a picture stacked up and down is the discrimination.
 *    Both are "I read the handle I am used to". Teaching them as one idea is why
 *    this week's discrimination and its error-analysis page are not two unrelated
 *    exercises.
 *  - **A PLACE IS A RELATION, NEVER A PROPERTY.** Nothing on this board is "the
 *    top one" by nature; a group is above another group, and turning the same two
 *    kinds through a quarter turn makes the same pair left and right instead. So
 *    every position page draws its axis from a coin before it draws anything
 *    else, and no kind, size or index ever predicts a place.
 *  - **Nothing here is a page of words.** `GATE_PROFILE.A` spends the multi-step
 *    quota on `pictorialPerDay`, so every working day draws its board out of the
 *    counts its own item answers with.
 *  - **No timers.** `sprint: null`.
 *  - **Four pages in nineteen face backwards** — one on each of Days 1–4, from a
 *    different earlier week in a different format each time: a loose scatter
 *    named by its numeral (A1), two rows matched one for one (A5), the group that
 *    holds a stated number (A2), and a flat shape named by its corners (A7).
 *
 * ── ELEVEN DISCLOSURES ──────────────────────────────────────────────────────
 *
 * 1. **HALF THIS RECIPE WAS RULED STRUCTURALLY BLOCKED, AND THIS IS WHAT WENT IN
 *    ITS PLACE.** `HANDOFF-2026-08-10-LEVEL-A.md` §5 records A8 as half blocked:
 *    sorting is fully drawable, and there is no primitive that draws a room, a
 *    shelf or a table with things on and under it, so the recipe's
 *    "above/below/beside scene" anchor cannot be built and must not be faked.
 *    What replaces it is the ORDER OF THE DRAWN GROUPS, which is a real spatial
 *    fact recomputable from the figure's own params:
 *      · `CountersFig`'s compare branch puts group *j* at
 *        `top + pitch/2 + j·(pitch + rowGap)`, so group 0 is drawn ABOVE group 1
 *        and every row starts at the same left edge (`cx = gutter + …`);
 *      · its default branch walks a cursor from `(W − totalW)/2` rightwards, one
 *        group box at a time, so group 0 is drawn LEFT of group 1 and both boxes
 *        are centred in the same vertical band (`by = top + (bandH − b.h)/2`).
 *    So a stacked pair is above/below and NOT left/right, a side-by-side pair is
 *    left/right and NOT above/below, and both facts follow from `params.relation`
 *    plus the group index. The anchor this week declares is therefore
 *    "one kind to a group" — the sorting half, which is drawable — and the
 *    position half is carried by row order, exactly as the ruling directs.
 *    **Recorded for the orchestrator:** a scene primitive (a shelf, a table, a
 *    box with an inside and an outside) is what row order is standing in for,
 *    and it would also unlock "in front of", "behind" and "inside".
 *
 * 2. **LEFT/RIGHT DID NOT NEED SUBSTITUTING, AND THE ARGUMENT IS THE LAYOUT CODE
 *    RATHER THAN AN INTENTION.** The brief allows above/below versus beside if
 *    left/right cannot be made honest. It can: the default counters layout is a
 *    left-to-right cursor over group boxes, so "the group on the left" is group
 *    0 by construction, on every render, at every size. The discrimination
 *    therefore ships as the recipe wrote it — **left/right against
 *    above/below** — with the axis drawn by a coin and the two families offered
 *    against each other on every single draw.
 *
 *    Two costs are disclosed rather than smoothed over. **First**, a stacked
 *    board's rows have different lengths, so a longer row does stick out further
 *    to the right even though every row begins at the same x; "left" and "right"
 *    are false of it in the sense the week teaches (which group starts nearer the
 *    left edge) and a child who reads "sticks out further" as "is to the right"
 *    has a defensible reading of a picture that was not built for it. The
 *    mitigation is that the option is never left/right ALONE: it is always one
 *    up-down word against one side-to-side word, so the child is asked which
 *    AXIS the board runs on and not which end of it a row reaches.
 *    **Second**, `beside` is not an option word anywhere. It is true of every
 *    side-by-side draw at the same time as left and right, and a page with two
 *    true buttons is not an askable question (kit §E2.7). It is taught in the
 *    script and used in the grown-ups' strip, where its being a looser word costs
 *    nothing.
 *
 * 3. **THE PUPPET SORTS BY PLACE WHEN IT WAS ASKED FOR A KIND, AND THAT IS THE
 *    ROW'S SLIP IN THE PRIMITIVES THAT EXIST.** Row A8's puppet "sorts one item
 *    by the wrong attribute". The literal build — one thing sitting in the wrong
 *    bin — cannot be drawn: a `CountersParams` group carries ONE icon, so a pile
 *    of shells with a stray leaf in it does not exist in the primitive set, and
 *    the only way to show a mis-sort would be a bin whose LABEL disagrees with
 *    its contents, which is a reading task on a pre-reader band. Taken in kit
 *    §E2.3 order:
 *
 *    *The identity hunt first.* For the puppet's number to be derivable it must
 *    fall out of a registered transform. `a_verify_count_slip_v1` returns
 *    `{n, n ± 1}` and a mis-sort is not a miscount by one; forcing
 *    `d_verify_binop_misconception_v1` to return `{t, u}` for two drawn group
 *    counts needs operands `((t + u)/2, (u − t)/2)`, which are not quantities
 *    anybody can point at on the board — the §E2.12 shape, fabrication with extra
 *    steps. So the puppet's number cannot come from the registry.
 *
 *    *So the slip is reframed until it is genuinely on the page.* The puppet
 *    answers a KIND question with a PLACE: asked for the shells, it counts
 *    whichever group sits on the left, or on the right, or in the middle, and
 *    reports that group's count. Nothing is invented — the number it says is a
 *    group a child can point at and count, drawn from the same board — and the
 *    misconception is the week's own headline one rather than a borrowed
 *    counting slip. The TRUTH is pinned by the registry: the page registers
 *    `d_verify_binop_v1` with `{a: everything on the board, b: everything that is
 *    not the named kind, op: '-'}`, so QG-11 recomputes the answer from two
 *    quantities that are both really drawn and compares it with the card keyed
 *    correct, on every draw at every seed.
 *
 *    The puppet's own number is BARRED from its cards. Offering it would make
 *    "take one of the other two" worth half a page, which is worth teaching with
 *    and not worth certifying on — hence Day 3, and hence no mastery slot.
 *
 *    **Recorded for the orchestrator:** `earlynumber` wants an
 *    `a_verify_sort_slip_v1` taking `{counts, nouns, want, took}` and returning
 *    `{correct: counts[want], wrong: counts[took]}`. It is six lines and it would
 *    pin both halves of the commonest sorting error at this age.
 *
 * 4. **NO REGISTERED TRANSFORM CAN EXPRESS A PLACE, SO THE POSITION SLOT CARRIES
 *    NO GENERATOR AND A SECOND IMPLEMENTATION INSTEAD.** Every truth in the
 *    registry is a number, a noun drawn from a count, a shape name or an
 *    operation word; there is no `verifyFor` anywhere that reads a layout. Three
 *    routes were considered and rejected: keying the position page on
 *    `a_set_for_numeral_v1` (its truth is the group holding a stated count, which
 *    is a different question); on `d_verify_binop_v1` with the count smuggled
 *    into `acceptableForms` (that turns a pin green while proving nothing —
 *    exactly what QG-11's whole-value match was tightened to stop); and inventing
 *    a `templateId` (an unregistered id silently skips the audit). So
 *    `whereDoesItSit` ships with no `generator`, and `placeDrawn` re-derives the
 *    word from the FIGURE'S OWN `params.relation` and group index and throws if
 *    it disagrees with the card keyed correct. That runs on every draw of every
 *    item at every seed, so a layout change that made a picture disagree with its
 *    answer fails the two-hundred-seed sweep rather than shipping green. Its
 *    figure carries no `asserts` for the matching reason: `figures/assert.ts`
 *    gives `counters` the selectors `count | remaining | group:k` and there is no
 *    `position`, and an unrecognised selector returns null by design.
 *    **Recorded for the orchestrator:** a `place:k` selector on `counters`, and
 *    an `a_place_of_group_v1` transform, would let QG-13 and QG-11 prove what
 *    this file can only prove locally.
 *
 * 5. **AUTHORED CARDS ON EVERY SLOT (L53), AND THE AUDIT THEY SWITCH OFF IS
 *    REBUILT.** A pre-reader cannot type, and a numeric band-A page without
 *    `choices` is handed to `tapOptionsFor`, which invents four buttons from the
 *    answer alone and cannot know a slot's range. So every page here carries its
 *    own cards — days, stories, warm-ups, both mastery forms and the puppet — and
 *    all four warm-ups were chosen from generators that already author three
 *    (`howManyChoice`, `compareSets`, `setForNumeral`, `shapeName`), so none of
 *    them needed a wrapper to become tappable. `numeralTrap` was ruled out at
 *    once and re-measured here rather than taken on trust: `{trap:'six-nine'}`
 *    returns exactly TWO cards, `9` and `6`, which cannot serve a certifying
 *    band-A slot at all (L53 wants three), and a22 measured that its digit-swap
 *    variant's accessible name speaks numbers.
 *
 *    QG-5's enablement list does not include `choice-key`, so the arithmetic
 *    re-check falls silent the moment cards go on. Every page this file writes
 *    for itself therefore registers `d_verify_binop_v1`, which carries a
 *    `verifyFor` and is audited by QG-11 whether or not the page has buttons.
 *
 *    **AND THAT PIN WAS PROBED RATHER THAN TRUSTED, WHICH FOUND A HOLE IN IT.**
 *    Corrupting a stored param on a served page fires QG-11 exactly as intended
 *    (`option keyed correct ("6") != recomputed truth "5"`). But MIS-KEYING THE
 *    CARD — moving `isCorrect` to a different button and leaving everything else
 *    alone — passes every gate in the stack on a pack that is otherwise valid.
 *    The reason is structural and it is not this week's: QG-11's option branch
 *    accepts the truth if it appears in `answer.acceptableForms`, and a band-A
 *    choice item has to list its numeral there or the answer is illegible to
 *    everything downstream. So on every carded numeric item in the corpus, the
 *    audit of WHICH BUTTON IS KEYED is satisfied by a field the item was always
 *    going to carry. **Recorded for the orchestrator, not fixed:** that branch
 *    should match `correct.text` alone. `withCards` closes it locally instead, on
 *    every draw at every seed, alongside recomputing the key from the figure's
 *    own drawn groups and refusing to emit an item whose picture, params and
 *    keyed card do not all agree.
 *
 * 6. **WHICH NUMERALS A SLOT MAY OFFER IS COMPUTED FROM ITS OWN CELLS, NEVER
 *    DECLARED (L38).** No button list is typed anywhere in this file. Every
 *    numeric slot draws its groups from the same eight cells, exports the set its
 *    own answer function returns over them at module load, and `threeCards`
 *    throws on any value outside it. For the record: every numeric slot in the
 *    week — the two sort-and-count pages, the two place-given pages, the two
 *    stories, the puppet and their mastery twins — keys two to nine, which is
 *    also the set every card comes from, so no card can be struck out unread.
 *    The position slot keys one of four words and offers three of them.
 *
 *    The pool a card comes from is the key's NEAREST NEIGHBOURS IN THE KEY SET
 *    rather than `key ± 1, ± 2`, because the puppet's set has a hole punched in
 *    it — the number the puppet said out loud is barred from its own cards — and
 *    an arithmetic window would sometimes have found nothing to offer.
 *
 * 7. **WHERE THE TRUTH SITS IS SETTLED BEFORE THE WRONG NUMBERS EXIST.** Every
 *    card is a value its own slot can key, so all three come out of one set — and
 *    a set fixes its own ends: the lowest member has nothing beneath it and is
 *    always the smallest number shown, the highest is always the largest, and
 *    left uniform the middle seat starves. `seatOdds` solves for a weight per key
 *    and seat whose average over a slot's cells is a flat third, by alternately
 *    rescaling the three seat columns and renormalising each key's row until
 *    neither margin moves; a cell set that cannot reach a flat third refuses to
 *    load rather than shipping a tilt. Where a bar closes a seat at draw time the
 *    weights are renormalised over the seats that are actually open, so the deal
 *    degrades to the nearest reachable rotation instead of throwing. Served rates
 *    are in the report.
 *
 * 8. **SIX LOCAL GENERATORS, EACH NAMING THE FAMILY GAP IT FILLS.**
 *    `sortAndCount` — `setForNumeral` runs the same board the other way (it
 *    states a number and asks which group holds it), and this week needs the
 *    kind stated and the number asked for. `countTheRow` and `countTheEnd` —
 *    nothing in `lib/earlynumber.ts` routes a question by WHERE a group sits;
 *    `pickExtreme` routes by size and `compareSets` by a pairing, and both are
 *    other weeks' content. `whereDoesItSit` — disclosure 4. `puppetGoesByPlace`
 *    — `PuppetSlip` is a closed union (double-count, skip-count,
 *    count-back-start, teen-writing) and a sorting slip is none of them.
 *    `sortStory` — the family's word problems join and take away, and this week
 *    has taught neither. `tidyAndTell` — `sortAndTell` sorts three drawn groups
 *    by how many, which is A1's Day-5 and not a two-way sort with real objects.
 *    All six keep the family's contract: a resolvable id where one exists, a
 *    picture built by `lib/figures` from the item's own values, quantities
 *    through `lib/format`, and an `authorMeta` stamp.
 *
 * 9. **NO DIGIT AND NO NUMBER WORD IN ANY ACCESSIBLE NAME (L48), PLUS ONE EXTRA
 *    RULE THIS WEEK NEEDS.** At band A the alt is not a fallback for the picture,
 *    it IS the picture: `speakablePrompt` prefers it over the bracket and every
 *    band-A screen autoplays it BEFORE the question.
 *      · Every alt this file writes goes through `alt()`, which throws at module
 *        load on a digit or on any of zero–twenty, the tens names, hundred, and
 *        the numbers that travel in disguise — once, twice, single, double, twin,
 *        pair, couple, dozen, half, both.
 *      · Every alt that REACHES A CHILD is checked again at draw time by
 *        `spokenSafe`, which wraps all ten generators including the four library
 *        warm-ups, because five of this week's pictures are assembled inside
 *        `lib/` where this file cannot see them at load time.
 *      · **The extra rule.** On the position slot the ANSWER is a word, so the
 *        no-number test is not enough: an alt reading "a row of shells above a
 *        row of leaves" would play the key aloud before the question. `hushed()`
 *        refuses above, below, under, beneath, over, top, bottom, left, right,
 *        beside, next to, side by side, between and their obvious cousins on that
 *        slot's names only. **What it costs, stated plainly: a child who cannot
 *        see the picture cannot answer the position pages.** That is not a
 *        detector's fault, it is what a perceptual question is; the two
 *        place-GIVEN pages do describe their arrangement in full, because there
 *        the layout is handed over and only the counting is asked for, so the
 *        week's position content is not entirely closed to a screen reader.
 *      · The library's four warm-up alts arrive clean and are re-checked anyway.
 *        `compareSets` says "a row of X above a row of Y", which is a position
 *        phrase and is deliberately kept: its own key is a group name, the word
 *        cannot be its answer, and hearing "above" on Day 2 in a page from A5 is
 *        the vocabulary arriving where a child meets it rather than a leak.
 *    The `[image: …]` brackets keep their counts: `signatureOf` signs them for
 *    operand freshness (L29), `promptText` strips them before anything is shown,
 *    and the figure's own name wins over them wherever a figure exists — which is
 *    every page but one.
 *
 * 10. **NOT ONE NUMERAL IN A WORKED EXAMPLE, AND THAT IS A DECISION.**
 *    `makeWeekBuilder` rebuilds any DAY item whose prompt's numeric tokens match
 *    a guided example's, and does NOT apply that filter to the mastery forms, so
 *    a two-numeral example quietly deletes a cell from a day slot while its
 *    mastery twin keeps it — and the cards, computed from the full cell list, go
 *    on offering a numeral that day slot can no longer serve. A13 found it and
 *    a22 and a23 wrote it up. Every example here describes its board by kind and
 *    prints no count at all, so the filter's two-token floor is never reached and
 *    the served key sets in the report are the whole key sets.
 *
 * 11. **HALF THE KEYED WORDS ARE WORDS NO SCREEN READS ALOUD, SO THE WEEK TEACHES
 *    THEM WHERE A CHILD WILL ACTUALLY HEAR THEM.** a07 measured the general
 *    condition: `CheckRunner` speaks `speakablePrompt(prompt, figure.alt)` and
 *    nothing else, so a choice button is never voiced. This week keys above,
 *    below, left and right, and a pre-reader can read none of them. All four are
 *    therefore spoken in `explanation.script`, worked in two guided examples,
 *    glossed in `vocabulary`, and named in the grown-ups' strip with the one
 *    instruction that matters — say the word while your hands do the moving.
 *    `beside` and `between` are taught the same way even though only `between`
 *    appears in a question and `beside` in none.
 *
 *    BB-G1 does not fire: `conceptFamily('position-and-sorting')` returns itself
 *    and no earlier A week reduces to it, so `priorSameFamily` is empty and §6.13
 *    never asks for a `deepeningDelta`. Nothing is declared, because this really
 *    is the level's first sorting week — the ledger is right here, which is worth
 *    recording after three weeks in a row reported it wrong elsewhere.
 */

import type { ErrorTag } from '../../../types';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { compareSets, howManyChoice, setForNumeral, shapeName, COUNTABLE_NOUNS, PUPPETS } from '../lib/earlynumber';
import { assertsParam, counterGroups } from '../lib/figures';
import { countNoun } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn per item. No line below writes one of these in by hand (kit §F.3). */
const NAMES = ['Arto', 'Delphine', 'Kian', 'Lars', 'Neela', 'Oona', 'Solveig', 'Tenzin'] as const;

/**
 * A different person on every page that names one.
 *
 * A plain `r.pick` puts the same child on two Day-4 stories often enough to read
 * as one story told twice, and no gate can see it: a name is not an operand and
 * never enters a surface signature. One draw picks the starting point and the
 * pool is then walked by index, so the correction costs no extra draws and stays
 * seed-stable (L19).
 */
function someone(r: Rng, guard: TupleGuard): string {
  const from = NAMES.indexOf(r.pick(NAMES));
  for (let k = 0; k < NAMES.length; k++) {
    const name = NAMES[(from + k) % NAMES.length];
    if (!guard.taken(`a08:who|${name}`)) {
      guard.add(`a08:who|${name}`);
      return name;
    }
  }
  return NAMES[from];
}

// ---------------------------------------------------------------------------
// The sentence law, applied where the gate applies it
//
// `earlynumber`'s `ask()` caps a PROMPT taken whole, so it waves through two
// nine-word sentences and never sees a hint at all. `bb-readability-test` walks
// every child-facing surface one sentence at a time, and that is the measure a
// build fails on. This mirrors its splitter and its counter, and every authored
// line passes through it, so an eleventh word throws at module load or at draw
// time rather than surviving to a report.
//
// A figure's accessible name is deliberately NOT capped here. That string is
// what a child who cannot see the picture has instead of the picture, and buying
// brevity by describing less is the wrong trade; it has two stricter gates of
// its own below.
// ---------------------------------------------------------------------------

const WORD_CEILING = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > WORD_CEILING) {
      throw new Error(`A08: a band-A sentence runs to ${String(n)} words (ceiling ${String(WORD_CEILING)}): "${sentence}"`);
    }
  }
  return text;
}

/** `[image: board] question` — the bracket feeds the freshness guard, the question is spoken. */
function boardPrompt(board: string, question: string): string {
  return `[image: ${board}] ${say(question)}`;
}

/** Help rungs: measured, and free of names and numerals by how they are written. */
function rungs(...steps: string[]): string[] {
  return steps.map(say);
}

/** "shells, leaves and stars" — the kinds on the board, never their counts. */
function kindList(nouns: readonly string[]): string {
  if (nouns.length <= 1) return nouns[0] ?? '';
  return `${nouns.slice(0, -1).join(', ')} and ${nouns[nouns.length - 1]}`;
}

/**
 * THREE WORDINGS PER KIND OF BOARD, DRAWN.
 *
 * Found by reading the generated week, and nothing in the gate stack can see it:
 * with one wording per layout a child heard the identical closing eleven words
 * open four of the nineteen pages, because the kinds changed and the frame did
 * not. Every wording in a family says the same true things about the same
 * drawing, and the quiet ones say them without naming a place at all.
 */
const KIND_NAMES = [
  (k: string) => `groups of ${k}, each kind kept apart from the others`,
  (k: string) => `groups of ${k}, gathered so that no kind is muddled in with another`,
  (k: string) => `groups of ${k}, sorted into heaps with a clear space around each heap`,
] as const;

const ROW_NAMES = [
  (k: string) => `rows of ${k}, stacked in that order from the top down`,
  (k: string) => `rows of ${k}, laid across the page and named here in the order they run downwards`,
  (k: string) => `rows of ${k}, sitting in that order, with the first named nearest the top`,
] as const;

const LINE_NAMES = [
  (k: string) => `groups of ${k}, set out in that order from the left`,
  (k: string) => `groups of ${k}, standing along a line and named here starting at the left`,
  (k: string) => `groups of ${k}, spread across the page in that order, left to right`,
] as const;

const QUIET_NAMES = [
  (a: string, b: string) => `the ${a} and the ${b}, each kind gathered into a group of its own`,
  (a: string, b: string) => `the ${a} and the ${b}, kept in separate groups with clear space around each`,
  (a: string, b: string) => `the ${a} and the ${b}, sorted apart so that no group holds a mixture`,
] as const;

// ===========================================================================
// WHAT A PICTURE IS CALLED (disclosure 9)
// ===========================================================================

const SPOKEN_NUMBER =
  /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|once|twice|single|double|twin|pair|couple|dozen|half|both)\b/i;

function alt(text: string): string {
  if (/\d/.test(text)) {
    throw new Error(`A08 alt: a digit is spoken ahead of the question in "${text}"`);
  }
  const hit = SPOKEN_NUMBER.exec(text);
  if (hit) {
    throw new Error(`A08 alt: the number word "${hit[0]}" is spoken ahead of the question in "${text}"`);
  }
  return text;
}

/**
 * Every way a layout could be named out loud — barred on the one slot whose
 * ANSWER is a layout (disclosure 9).
 *
 * Wider than the four keyed words on purpose: "the top row" and "underneath"
 * hand over `above` and `below` just as plainly as the words themselves, and a
 * child hearing "side by side" before a question about an axis has been told
 * which axis it is.
 */
const SPOKEN_PLACE =
  /\b(above|below|under|underneath|beneath|over|top|bottom|upper|lower|left|right|beside|alongside|next to|side by side|between|middle|stacked|column|end)\b/i;

function hushed(text: string): string {
  const hit = SPOKEN_PLACE.exec(alt(text));
  if (hit) {
    throw new Error(`A08 alt: the place word "${hit[0]}" answers the question it is played before, in "${text}"`);
  }
  return text;
}

/**
 * Every accessible name a child could actually be played, checked where it
 * arrives rather than where it was written.
 *
 * The load-time guard covers this file's own strings. This is the other half:
 * four of the ten generators are assembled inside `lib/`, and a library alt that
 * grew a number later would reach a child without this. It throws rather than
 * warning, which makes the rule an invariant of the week instead of an intention
 * of its author.
 */
function spokenSafe(base: ItemGen, who: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (draft.figure) {
      try {
        alt(draft.figure.alt);
      } catch (e) {
        throw new Error(`A08 spokenSafe(${who}): ${(e as Error).message}`);
      }
    }
    return draft;
  };
}

/**
 * Mark an earlier week's item as this week's warm-up.
 *
 * `GATE_PROFILE.A.warmupFormats` is zero — retrieval is permitted here, never
 * demanded — so each of the four has to earn its page. A scatter named by its
 * numeral (A1) is the counting this week does inside a group. Two rows matched
 * one for one (A5) is this board's own apparatus met a week earlier, and its
 * scene says "above" out loud on the day the word becomes a button. The group
 * that holds a stated number (A2) is this week's sort-and-count run backwards.
 * And naming a flat shape by its corners (A7) is sorting itself: deciding which
 * of several kinds a thing belongs to. Their hints stay as the library wrote
 * them — a warm-up should sound like the week it came from, and retrieval is
 * exempt from the ladder dedup.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

/**
 * Give a generator a ladder of its own without touching the shared library.
 *
 * The dedup allows one ladder template at most twice across the non-retrieval
 * core, and fifteen core items over six local generators would collapse without
 * this. Runs inside the returned closure, draws no rng and leaves the prompt
 * alone, so the QG-1/QG-4 surface signature is unchanged.
 */
function withRungs(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

// ===========================================================================
// THE BOARD — the one apparatus the week is built on
// ===========================================================================

/**
 * Which way the groups run.
 *
 * 'stack' is `relation: 'compare'`, which lays one row per group down the page
 * with every row starting at the same left edge. 'row' is the default layout,
 * which walks a cursor rightwards over group boxes, all of them centred in one
 * vertical band. Disclosure 1 quotes the two lines of `CountersFig` this rests
 * on; nothing else in the file assumes anything about where a group is drawn.
 */
type Axis = 'stack' | 'row';

/** The four words a place can be, at this band, on this apparatus. */
type Place = 'above' | 'below' | 'left' | 'right';
const PLACES: readonly Place[] = ['above', 'below', 'left', 'right'];

/** Which axis a word belongs to — the whole of the discrimination, in one line. */
function axisOf(place: Place): Axis {
  return place === 'above' || place === 'below' ? 'stack' : 'row';
}

/**
 * The counts a board may hold. Eight cells, and never two the same on one board:
 * a repeated count would make two groups interchangeable to a child who has
 * counted them, which is a different question from the one being asked.
 */
const LOW = 2;
const HIGH = 9;
const CELLS: readonly number[] = Array.from({ length: HIGH - LOW + 1 }, (_, i) => LOW + i);
const COUNT_KEYS: ReadonlySet<number> = new Set(CELLS);

interface Heap {
  count: number;
  noun: string;
}

/** `k` kinds and `k` counts, all different, assigned to places by the shuffle alone. */
function heaps(r: Rng, k: number): Heap[] {
  const counts = r.shuffle([...CELLS]).slice(0, k);
  const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, k);
  return counts.map((count, i) => ({ count, noun: nouns[i] }));
}

/** The bracket: every count and kind on the board, in the order they are drawn. */
function boardScene(board: Heap[]): string {
  return board.map((g) => countNoun(g.count, g.noun)).join(', ');
}

/**
 * The picture. `label` names each group for a grown-up reading over a shoulder;
 * a four-year-old tells the kinds apart by their glyphs, which is why the sort
 * is honest on a pre-reader band at all.
 */
function boardFigure(board: Heap[], axis: Axis, name: string, of?: number): BBFigure {
  return counterGroups(
    board.map((g) => ({ count: g.count, noun: g.noun, label: g.noun })),
    {
      arrangement: 'in a row',
      ...(axis === 'stack' ? { relation: 'compare' as const } : {}),
      alt: name,
      ...(of !== undefined ? { asserts: assertsParam('n', `group:${String(of)}`) } : {}),
    },
  );
}

/**
 * The place a group is DRAWN in, read back off the figure rather than off the
 * variable that built it (disclosure 4).
 *
 * Only defined for a pair, because only a pair has one unambiguous answer: on a
 * board of three the middle group is below the top one AND above the bottom one,
 * and a question with two true answers is not a question (kit §E2.7).
 */
function placeDrawn(fig: BBFigure, idx: number): Place {
  if (fig.type !== 'counters') {
    throw new Error(`A08 placeDrawn: a ${fig.type} has no groups to place`);
  }
  const groups = fig.params.groups;
  if (groups.length !== 2) {
    throw new Error(`A08 placeDrawn: a place is only single-valued for a pair, not ${String(groups.length)} groups`);
  }
  if (idx !== 0 && idx !== 1) throw new Error(`A08 placeDrawn: no group at index ${String(idx)}`);
  return fig.params.relation === 'compare' ? (idx === 0 ? 'above' : 'below') : idx === 0 ? 'left' : 'right';
}

/** What a board holds in one of its groups, for the picture-versus-key check. */
function groupHolds(draft: ItemDraft, idx: number): number | null {
  const fig = draft.figure;
  if (!fig || fig.type !== 'counters') return null;
  return fig.params.groups[idx]?.count ?? null;
}

// ===========================================================================
// WHICH SEAT THE TRUTH TAKES (disclosure 7)
// ===========================================================================

const SEAT_GRAIN = 720;
type Odds = readonly [number, number, number];

/**
 * Which of the three seats a key can physically occupy, given what its own pool
 * can stand beside it. Lowest needs two cards above, middle one on each side,
 * highest two below.
 */
function openSeats(key: number, pool: readonly number[]): [boolean, boolean, boolean] {
  let under = 0;
  let over = 0;
  for (const v of pool) {
    if (v < key) under += 1;
    else if (v > key) over += 1;
  }
  return [over >= 2, under >= 1 && over >= 1, under >= 2];
}

/**
 * A weight per key and seat whose average over the slot's cells is a flat third.
 *
 * Rows are keys, columns are seats. Every row starts spread evenly over the
 * seats it can reach; then each column is scaled so its mean lands on a third
 * and each row is renormalised back to a probability, and that pair of moves
 * repeats until both margins hold at once. Where a flat third is out of reach
 * the fit will not settle and the check below refuses to load the module, which
 * is the point of doing it here rather than finding a tilt in a report later.
 */
function seatOdds(cells: readonly number[], poolOf: (key: number) => number[], who: string): ReadonlyMap<number, Odds> {
  const reach = cells.map((k) => openSeats(k, poolOf(k)));
  reach.forEach((row, i) => {
    if (!row.some(Boolean)) {
      throw new Error(`A08 seatOdds(${who}): a key of ${String(cells[i])} can sit nowhere among three cards`);
    }
  });
  let rows = reach.map((row) => {
    const live = row.filter(Boolean).length;
    return row.map((ok) => (ok ? 1 / live : 0));
  });
  for (let pass = 0; pass < 400; pass++) {
    const mean = [0, 1, 2].map((j) => rows.reduce((acc, row) => acc + row[j], 0) / cells.length);
    rows = rows.map((row) => {
      const lifted = row.map((v, j) => (mean[j] > 1e-12 ? v / mean[j] : 0));
      const sum = lifted.reduce((a, b) => a + b, 0);
      if (sum < 1e-12) throw new Error(`A08 seatOdds(${who}): a key lost every seat during the fit`);
      return lifted.map((v) => v / sum);
    });
  }
  for (const j of [0, 1, 2]) {
    const share = rows.reduce((acc, row) => acc + row[j], 0) / cells.length;
    if (Math.abs(share - 1 / 3) > 0.005) {
      throw new Error(`A08 seatOdds(${who}): seat ${String(j + 1)} settles at ${(share * 100).toFixed(1)}%, not a flat third`);
    }
  }
  const table = new Map<number, Odds>();
  cells.forEach((k, i) => {
    const raw = rows[i].map((v) => v * SEAT_GRAIN);
    const floors = raw.map((v) => Math.floor(v));
    let left = SEAT_GRAIN - floors.reduce((a, b) => a + b, 0);
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

/**
 * The nearest members of the key set either side of the truth, minus anything
 * the page has already said out loud.
 *
 * Nearest-in-the-set rather than `key ± 1, ± 2`, because a set with a hole in it
 * — the puppet's, which bars the number it spoke — can leave an arithmetic
 * window empty while perfectly good cards sit just outside it (disclosure 6).
 */
function nearest(key: number, keys: ReadonlySet<number>, barred: ReadonlySet<number>): number[] {
  const sorted = [...keys].filter((v) => v !== key && !barred.has(v)).sort((a, b) => a - b);
  return [...sorted.filter((v) => v < key).slice(-2), ...sorted.filter((v) => v > key).slice(0, 2)];
}

/**
 * Run every accessible-name wording once, at module load.
 *
 * The two guards above only fire when a wording is DRAWN, so a family of three
 * would otherwise be a third checked per item and a bad third could sit unpicked
 * through a whole sweep. Exercising them here makes a number word or a place
 * word in any wording a load-time failure, which is the only kind an author
 * cannot miss.
 */
for (const build of KIND_NAMES) alt(build('shells, leaves and stars'));
for (const build of ROW_NAMES) alt(build('shells, leaves and stars'));
for (const build of LINE_NAMES) alt(build('shells, leaves and stars'));
for (const build of QUIET_NAMES) hushed(build('shells', 'leaves'));

const NOTHING_BARRED: ReadonlySet<number> = new Set<number>();

/** The seat weights every numeric slot in the week deals from. */
const COUNT_SEATS = seatOdds(CELLS, (k) => nearest(k, COUNT_KEYS, NOTHING_BARRED), 'a counted group');

/**
 * Draw a seat, honouring a bar that may have closed the one the table wanted.
 *
 * Renormalising over the OPEN seats keeps the deal as close to the fitted
 * rotation as the pool allows; falling back to a flat draw over whatever is open
 * keeps it deterministic when the table gives every open seat a zero. One rng
 * draw either way, never a loop (L19).
 */
function pickSeat(r: Rng, key: number, pool: readonly number[], who: string): 0 | 1 | 2 {
  const w = COUNT_SEATS.get(key);
  if (!w) throw new Error(`A08 pickSeat(${who}): no seat weights for a key of ${String(key)}`);
  const open = openSeats(key, pool);
  const live = [0, 1, 2].filter((j) => open[j]) as Array<0 | 1 | 2>;
  if (!live.length) throw new Error(`A08 pickSeat(${who}): a key of ${String(key)} has no seat left once its bar is applied`);
  const total = live.reduce<number>((acc, j) => acc + w[j], 0);
  const t = r.int(0, SEAT_GRAIN - 1);
  if (total <= 0) return live[t % live.length];
  let run = 0;
  for (const j of live) {
    run += (w[j] * SEAT_GRAIN) / total;
    if (t < run) return j;
  }
  return live[live.length - 1];
}

// ===========================================================================
// WHAT A WRONG NUMBER MEANS, SAID IN ITS OWN BOARD'S TERMS
// ===========================================================================

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * These reach a grown-up's report and never a child's page — the child taps a
 * bare numeral — so the ten-word law is off here. The account is taken from the
 * VALUE rather than from the branch that chose it, because an account taken from
 * the branch drifts away from the number it is attached to.
 */
interface Voice {
  over: (gap: number) => string;
  under: (gap: number) => string;
}

const gapWord = (k: number): string => numberWords(k);

const KIND_VOICE: Voice = {
  over: (k) => `${gapWord(k)} past what that kind comes to: the counting carried on into the neighbouring group instead of stopping where the kind changed.`,
  under: (k) => `${gapWord(k)} short of what that kind comes to: the group was abandoned before its far end, which is what happens when the eye leaves early.`,
};

const ROW_VOICE: Voice = {
  over: (k) => `${gapWord(k)} more than the named row holds: the finger dropped onto the row underneath and kept going along it.`,
  under: (k) => `${gapWord(k)} fewer than the named row holds: the row was picked up partway along, so its opening stretch was never said.`,
};

const END_VOICE: Voice = {
  over: (k) => `${gapWord(k)} beyond that group: the gap between two groups was read as a space inside one, so the next group's opening things were swept in.`,
  under: (k) => `${gapWord(k)} inside that group: counting began at the second thing, which is the commonest way a group of this size comes back light.`,
};

const STORY_VOICE: Voice = {
  over: (k) => `${gapWord(k)} too many for the kind the story asked about: things of another kind were counted alongside it.`,
  under: (k) => `${gapWord(k)} too few for the kind the story asked about: part of the group was treated as belonging somewhere else.`,
};

const SHELF_VOICE: Voice = {
  over: (k) => `${gapWord(k)} more than that row of the bookcase holds: the rows stand close together, and the count slid onto the next one.`,
  under: (k) => `${gapWord(k)} less than that row of the bookcase holds: its far end was left uncounted, which is what a long row invites.`,
};

const PUPPET_VOICE: Voice = {
  over: (k) => `${gapWord(k)} over the named kind: the repair was begun from the puppet's group and stopped ${gapWord(k)} late.`,
  under: (k) => `${gapWord(k)} under the named kind: the right group was found and then read in a hurry.`,
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
 * Three numerals, every one of them keyable, with the truth in the seat it was
 * dealt.
 *
 * Nothing is written down here: the pool is the slot's own key set, so every
 * number on the page is one this same slot really keys on some other draw and
 * none can be crossed out unread. The seat is settled before the wrong values
 * are chosen, and which two neighbours are shown is the last thing decided, so
 * it cannot disturb the seat.
 */
function threeCards(
  r: Rng,
  key: number,
  barred: ReadonlySet<number>,
  why: (v: number, key: number) => Card,
  who: string,
): { choices: ReturnType<typeof makeChoices>['choices']; correctKey: string } {
  if (!COUNT_KEYS.has(key)) {
    throw new Error(`A08 threeCards(${who}): a key of ${String(key)} is outside the cells this week draws`);
  }
  const pool = nearest(key, COUNT_KEYS, barred);
  const seat = pickSeat(r, key, pool, who);
  const under = pool.filter((v) => v < key);
  const over = pool.filter((v) => v > key);
  const twoOf = (from: number[]) => (from.length <= 2 ? [...from] : r.shuffle([...from]).slice(0, 2));
  const oneOf = (from: number[]) => (from.length === 1 ? from[0] : r.pick(from));
  const values = seat === 0 ? twoOf(over) : seat === 2 ? twoOf(under) : [oneOf(under), oneOf(over)];
  if (values.length !== 2 || new Set(values).size !== 2) {
    throw new Error(`A08 threeCards(${who}): a key of ${String(key)} could not find two honest cards`);
  }
  const shown = [key, ...values].sort((a, b) => a - b);
  if (shown.indexOf(key) !== seat) {
    throw new Error(
      `A08 threeCards(${who}): dealt seat ${String(seat + 1)} but ${String(key)} printed at ${String(shown.indexOf(key) + 1)} of ${shown.join('/')}`,
    );
  }
  return makeChoices(r, String(key), values.map((v) => why(v, key)));
}

/**
 * Fit a page this file wrote with the cards a band-A slot needs, and rebuild the
 * audit that putting cards on it takes away (disclosure 5).
 *
 * The key is recomputed a second time from the stored params, then held against
 * what the page keyed AND against what its own picture draws in the group the
 * question is about. A disagreement between the three throws at every seed at
 * once instead of surviving on one.
 */
interface CardSpec {
  barred?: (params: Record<string, unknown>) => ReadonlySet<number>;
  why: (v: number, key: number) => Card;
  tags: ErrorTag[];
  who: string;
}

function withCards(base: ItemGen, spec: CardSpec): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error(`A08 withCards(${spec.who}): no generator params reached this page, so nothing can be recomputed`);
    const key = Number(params.a) - Number(params.b);
    if (String(key) !== draft.answer.value) {
      throw new Error(`A08 withCards(${spec.who}): the page keyed "${draft.answer.value}" but this week recomputes ${String(key)}`);
    }
    // Which group the question is about is a DRAW, never a property of the slot
    // (that is the whole of `countTheRow`'s rotation), so it is read back out of
    // the item's own params rather than declared once beside the generator.
    const drawn = groupHolds(draft, Number(params.of));
    if (drawn !== key) {
      throw new Error(`A08 withCards(${spec.who}): the answer is ${String(key)} but its group draws ${String(drawn)}`);
    }
    const { choices, correctKey } = threeCards(rng, key, spec.barred?.(params) ?? NOTHING_BARRED, spec.why, spec.who);
    // THE CHECK QG-11 CANNOT MAKE, proved by negative control rather than assumed.
    // Corrupting a stored param fires QG-11 as designed; MIS-KEYING THE CARD does
    // not, because its match also accepts `answer.acceptableForms`, and a band-A
    // choice item has to list its numeral there for the answer to be legible at
    // all. So which card is marked correct is pinned here instead.
    const keyed = choices.find((c) => c.isCorrect);
    if (!keyed || keyed.text !== String(key)) {
      throw new Error(`A08 withCards(${spec.who}): the card marked correct reads "${String(keyed?.text)}" against a truth of ${String(key)}`);
    }
    return {
      ...draft,
      choices,
      answer: { value: correctKey, acceptableForms: [String(key), numberWords(key)], validation: 'choice-key' },
      errorTags: spec.tags,
    };
  };
}

/**
 * The two quantities a sorted board hands a child for free, and the pair the
 * registry recomputes the answer from: everything drawn, and everything that is
 * not the kind or the place the question named. Both are pointable, which is
 * what makes `d_verify_binop_v1` an honest pin here rather than an echo.
 */
function apart(board: Heap[], of: number): { a: number; b: number } {
  const a = board.reduce((acc, g) => acc + g.count, 0);
  return { a, b: a - board[of].count };
}

const SORT_TAGS: ErrorTag[] = ['task-comprehension', 'representation-misread'];
const COUNT_TAGS: ErrorTag[] = ['representation-misread', 'procedure-slip'];

// ===========================================================================
// Local generator 1 — SORT BY KIND, COUNT THE GROUP (the catalog's own line)
// ===========================================================================

/**
 * A board sorted one kind to a group, and the child counts the kind that was
 * named.
 *
 * Not `setForNumeral`, which runs the same board the other way: it states a
 * number and asks which group shows it, so the counting is a search and the
 * answer is a group's name. Here the kind is the given and the count is the
 * answer, which is the catalog's computational focus verbatim and also the form
 * a numeral is the honest button for.
 *
 * The axis is drawn by a coin on every page in this file, including this one
 * where it is beside the point, so that no slot in the week can quietly become
 * the one where the board always runs the same way.
 */
function sortAndCount(stem: 'plain' | 'sorted'): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const board = heaps(r, 3);
      const axis: Axis = r.chance(0.5) ? 'stack' : 'row';
      const of = r.int(0, 2);
      const noun = board[of].noun;
      const { a, b } = apart(board, of);
      const question =
        stem === 'plain'
          ? `Tap how many ${noun} there are.`
          : `Each kind has its own group. Count the ${noun}.`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: boardPrompt(boardScene(board), question),
        figure: boardFigure(
          board,
          axis,
          alt(r.pick(KIND_NAMES)(kindList(board.map((g) => g.noun)))),
          of,
        ),
        answer: { value: String(board[of].count), acceptableForms: [numberWords(board[of].count)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `asks` keeps two pages that drew the same three counts from reading
          // as one question to the Form-B collision check, which compares cores
          // on {templateId, params} alone (a16/a17/a18's finding).
          params: { a, b, op: '-', n: board[of].count, of, asks: `kind-${stem}`, noun, axis },
          seed: r.uint(),
        },
        hintLadder: rungs('Find the group that holds that kind.', 'Count only inside it. Stop where the kind changes.'),
        errorTags: SORT_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'count-the-named-kind' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — THE PLACE IS THE GIVEN, up and down
// ===========================================================================

/** Where a stacked board's rows are, in the words a four-year-old is handed. */
const ROW_WORDS = ['on top', 'in the middle', 'at the bottom'] as const;

/**
 * Three rows, one kind to a row, and the question routes by WHICH ROW.
 *
 * This is the position half of the week with the position handed over instead of
 * asked for, and it is the page that makes the word load-bearing: a child who
 * ignores it lands on the wrong row two times in three, and the answer is a
 * count so no amount of guessing which row produces a number.
 *
 * The row is drawn per item rather than fixed per slot. Fixed, the slot would
 * teach "the top one" — the relational invariant b12 shipped (kit §E2.11) — and
 * a child could stop listening to the sentence that carries the content.
 */
function countTheRow(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const board = heaps(r, 3);
      const of = r.int(0, 2);
      const { a, b } = apart(board, of);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: boardPrompt(boardScene(board), `Count the row ${ROW_WORDS[of]}.`),
        figure: boardFigure(
          board,
          'stack',
          // NAMES THE ARRANGEMENT ON PURPOSE. Here the layout is the GIVEN and
          // the count is the answer, so a child who cannot see the board is told
          // which row is which and loses only the counting — which is what every
          // counting page in the corpus costs them. The one slot whose answer IS
          // the layout hushes it instead (disclosure 9).
          alt(r.pick(ROW_NAMES)(kindList(board.map((g) => g.noun)))),
          of,
        ),
        answer: { value: String(board[of].count), acceptableForms: [numberWords(board[of].count)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a, b, op: '-', n: board[of].count, of, asks: 'row', row: ROW_WORDS[of] },
          seed: r.uint(),
        },
        hintLadder: rungs('Say the row word again, then put a finger there.', 'Keep the finger on that row while you count.'),
        errorTags: COUNT_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'count-the-named-row' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — THE PLACE IS THE GIVEN, side to side
// ===========================================================================

/** Where a side-by-side board's groups are — and where the catalog's 'between' lives. */
const END_WORDS = ['on the left', 'between the others', 'on the right'] as const;

/**
 * The same routing turned through a quarter turn: three groups side by side, and
 * the question names one of them by its place along the line.
 *
 * The middle one is asked for as "between the others", which is the catalog's
 * fourth position word and the only one this week could put in a question
 * without ambiguity — a middle ROW is below one row and above another at the same
 * time, whereas a middle GROUP is between the two beside it and nothing else.
 */
function countTheEnd(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const board = heaps(r, 3);
      const of = r.int(0, 2);
      const { a, b } = apart(board, of);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: boardPrompt(boardScene(board), `Count the group ${END_WORDS[of]}.`),
        figure: boardFigure(
          board,
          'row',
          alt(r.pick(LINE_NAMES)(kindList(board.map((g) => g.noun)))),
          of,
        ),
        answer: { value: String(board[of].count), acceptableForms: [numberWords(board[of].count)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a, b, op: '-', n: board[of].count, of, asks: 'end', spot: END_WORDS[of] },
          seed: r.uint(),
        },
        hintLadder: rungs('Point at the group the words send you to.', 'Then count what is in that one group only.'),
        errorTags: COUNT_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'count-the-placed-group' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — WHERE DOES IT SIT (the recipe's discrimination)
// ===========================================================================

/** Why a place that is not this board's place is not this board's place. */
function whyNotThere(offered: Place, truth: Place): Card {
  const sameAxis = axisOf(offered) === axisOf(truth);
  return {
    text: offered,
    errorTag: (sameAxis ? 'procedure-slip' : 'concept-misconception') as ErrorTag,
    rationale: sameAxis
      ? `The right axis, read from the wrong end: this names the other group on the same board, so the two kinds were told apart after the board was.`
      : `A ${axisOf(offered) === 'row' ? 'side-to-side' : 'up-and-down'} word for a board that runs ${axisOf(truth) === 'row' ? 'side to side' : 'up and down'} - the axis was never looked at, only the kind.`,
  };
}

/**
 * Two kinds, an axis drawn by a coin, and the child says WHERE one of them sits.
 *
 * A pair rather than a trio, because a place is only single-valued for a pair
 * (see `placeDrawn`). The two cards beside the truth are drawn from the other
 * three words, and since only ONE of those three shares the truth's axis, every
 * page carries at least one word from the other family whichever way the draw
 * falls — which is the recipe's "left/right vs above/below" holding on every
 * single draw rather than on average.
 *
 * No `generator` and no `asserts`: disclosure 4 records why neither the registry
 * nor `figures/assert.ts` can express a place, and `placeDrawn` re-derives the
 * word from the emitted figure instead.
 */
function whereDoesItSit(stem: 'sits' | 'find'): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const board = heaps(r, 2);
      const axis: Axis = r.chance(0.5) ? 'stack' : 'row';
      const of = r.chance(0.5) ? 1 : 0;
      const noun = board[of].noun;
      // Named in a fixed order, so the alt cannot leak the drawn order to a
      // child who has worked out that this file names groups as it draws them.
      const spoken = [...board.map((g) => g.noun)].sort();
      const figure = boardFigure(
        board,
        axis,
        hushed(r.pick(QUIET_NAMES)(spoken[0], spoken[1])),
      );
      const truth = placeDrawn(figure, of);
      const others = r.shuffle(PLACES.filter((p) => p !== truth)).slice(0, 2);
      const { choices, correctKey } = makeChoices(r, truth, others.map((p) => whyNotThere(p, truth)));
      const draft: ItemDraft = {
        type: 'representation',
        prompt: boardPrompt(
          boardScene(board),
          stem === 'sits' ? `Tap the word for where the ${noun} sit.` : `Which word tells you where the ${noun} are?`,
        ),
        figure,
        choices,
        answer: { value: correctKey, acceptableForms: [truth], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        hintLadder:
          stem === 'sits'
            ? rungs('Does this board run up and down, or across?', 'Now say which end that kind is at.')
            : rungs('Trace the board with a finger before choosing.', 'A finger that goes down needs a down word.'),
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'name-the-place', isDiscrimination: true },
      };
      // The audit no shipped gate can run for a place (disclosure 4).
      const keyed = draft.choices?.find((c) => c.isCorrect)?.text;
      if (keyed !== placeDrawn(figure, of)) {
        throw new Error(`A08 whereDoesItSit: the board draws "${placeDrawn(figure, of)}" but the page keyed "${String(keyed)}"`);
      }
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — HELP THE PUPPET, who went by place instead of by kind
// ===========================================================================

/**
 * The band-A error-analysis form on the recipe's own slip (disclosure 3).
 *
 * A NAMED puppet is asked for a kind and answers with a place: it counts
 * whichever group sits on the left, or between the others, or on the right, and
 * says that group's count. Every number in the prompt is a group a child can
 * point at, the truth is recomputed by the registry from two quantities that are
 * both drawn, and the puppet's own number is barred from the cards.
 *
 * §3's rules kept: the puppet is named rather than "a student", the child repairs
 * it by tapping, the word "wrong" never appears, and the numeric truth is
 * recomputed rather than authored.
 */
function puppetGoesByPlace(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const board = heaps(r, 3);
      const puppet = r.pick(PUPPETS);
      const of = r.int(0, 2);
      // The place it took is drawn from the two that are NOT the named kind's,
      // so the puppet is never accidentally right. One draw, no loop (L19).
      const took = r.pick([0, 1, 2].filter((i) => i !== of));
      const noun = board[of].noun;
      const { a, b } = apart(board, of);
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: boardPrompt(
          boardScene(board),
          `${puppet} looks for the ${noun}. ${puppet} counts the group ${END_WORDS[took]} and says ${String(board[took].count)}. Tap how many ${noun} there are.`,
        ),
        figure: boardFigure(
          board,
          'row',
          alt(r.pick(LINE_NAMES)(kindList(board.map((g) => g.noun)))),
          of,
        ),
        answer: { value: String(board[of].count), acceptableForms: [numberWords(board[of].count)], validation: 'exact-numeric' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a, b, op: '-', n: board[of].count, of, asks: 'puppet', said: board[took].count },
          seed: r.uint(),
        },
        hintLadder: rungs('The puppet looked at a place, not at a kind.', 'Find that kind first. Then count it together.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-place-fix', isErrorAnalysis: true },
      };
      if (board[took].count === board[of].count) {
        throw new Error(`A08 puppetGoesByPlace: the puppet's group and the named kind both hold ${String(board[of].count)}`);
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
 * has no sorting story generator at all, so the two frames live here.
 *
 * They are deliberately the week's two axes rather than one situation dressed
 * twice: the toybox is tipped out and the kinds are set out side by side, and
 * the bookcase is filled row by row. Both nouns were scanned against the whole
 * weeks directory at the END of the build (kit §E2.8) — a shelf, a crate, a
 * doorstep, a pinboard, a sandpit, a plank, a wheelbarrow, a pegboard, a
 * windowsill and a cupboard were all claimed by weeks written before or beside
 * this one.
 */
type Story = 'toybox' | 'bookcase';

/**
 * THREE ROWS IN THE BOOKCASE, NOT TWO, AND THAT WAS A MEASURED REPAIR.
 *
 * With two rows the row the story asks for is either the fuller one or the
 * emptier one, so "the bigger group" and "the smaller group" each described the
 * answer on exactly half of 300 served draws. The answer is a count, so neither
 * habit produces a number without counting and no card strategy moved — but a
 * page where a size habit picks the right row half the time is teaching the
 * habit anyway. A third row puts every picture habit back on a third, which is
 * where the rest of the week already sits.
 */
const SHELF_WORDS = ['top', 'middle', 'bottom'] as const;

function sortStory(which: Story): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const board = heaps(r, 3);
      const name = someone(r, guard);
      const of = r.int(0, 2);
      const { a, b } = apart(board, of);
      const line =
        which === 'toybox'
          ? `${name} sorts the toybox, one kind to a heap. How many ${board[of].noun} are in that heap?`
          : `${name} fills the bookcase row by row. How many are on the ${SHELF_WORDS[of]} row?`;
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: boardPrompt(boardScene(board), line),
        figure: boardFigure(
          board,
          which === 'toybox' ? 'row' : 'stack',
          alt(
            which === 'toybox'
              ? `groups of ${kindList(board.map((g) => g.noun))}, tipped out and gathered kind by kind`
              : `rows of ${kindList(board.map((g) => g.noun))}, filled in that order down a bookcase`,
          ),
          of,
        ),
        answer: { value: String(board[of].count), acceptableForms: [numberWords(board[of].count)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a, b, op: '-', n: board[of].count, of, asks: which, noun: board[of].noun },
          seed: r.uint(),
        },
        hintLadder:
          which === 'toybox'
            ? rungs('Everything of one kind went into one heap.', 'Find that heap, then count it slowly.')
            : rungs('Run a finger along the row the words name.', 'Count what your finger meets, and nothing else.'),
        errorTags: ['task-comprehension', 'procedure-slip'],
        // No `situationType`: BB-W5's families are all quantity relations and
        // none of them describes "a child puts things away". The gate is off at
        // band A (`situationTypes: 0`), so an untrue label would be metadata
        // that lies rather than metadata that helps.
        authorMeta: { stepCount: 1, cognitiveOp: `story-${which}` },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 7 — the Day-5 two-way sort, with objects and out loud
// ===========================================================================

/** Places a four-year-old can actually kneel down and sort on. */
const FLOORS = ['rug', 'doormat', 'blanket', 'towel', 'step', 'lawn'] as const;
/** Two-way sorts a four-year-old can make from what is already in the room. */
const SORTS = [
  { kind: 'socks', by: 'colour' },
  { kind: 'toy animals', by: 'size' },
  { kind: 'lids', by: 'colour' },
  { kind: 'spoons', by: 'size' },
] as const;

/**
 * Row A8's Day-5 signature, done with hands: sort one heap by an attribute, then
 * lay the two piles one above the other and SAY which is which.
 *
 * That is the two-way sort at this band — once by the attribute, once by place —
 * and the telling is the only place the difference between doing it and
 * understanding it can be heard. FILL-ARCHITECTURE §3 settles the form: at band
 * A "independent" means the child does it with objects, and the production task
 * is make/show/build with an oral R-flagged telling.
 *
 * `manual-review` is both the honest validation and the right input mode: at
 * band A `AnswerEntry` renders a manual-review page as one oversized
 * acknowledgement, so a four-year-old never meets the keyboard a `'set'` answer
 * would route them to. It carries NO generator, because inventing a template
 * that "computes" a sort of objects nobody has picked up yet would be faking a
 * computable answer for an open task. It is the only item in the file without a
 * picture, and Day 5 is the only day where that is legal (`pictorialPerDay` is
 * checked on Days 1-4), and it is the item that satisfies the dual-strand
 * coupling gate.
 */
function tidyAndTell(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const floor = r.pick(FLOORS);
      const sort = r.pick(SORTS);
      const name = someone(r, guard);
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: say(
          `Sort the ${sort.kind} by ${sort.by} with ${name}. Lay one pile above the other on the ${floor}. Say which pile is which.`,
        ),
        answer: {
          value: `two piles sorted by ${sort.by}, laid one above the other, with the place of each said out loud`,
          acceptableForms: [],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        hintLadder: rungs('Decide what makes two things belong together.', 'Then choose which pile goes on top, and say so.'),
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: { stepCount: 1, cognitiveOp: 'sort-two-ways-and-tell' },
      };
      return draft;
    });
}

// ===========================================================================
// The generators, bound to this week's ranges and given its voice
// ===========================================================================

/** CERTIFIES (mastery 01) — the catalog's computational focus, said plainly. */
const kindPlain = spokenSafe(
  withCards(sortAndCount('plain'), {
    why: voiced(KIND_VOICE, 'representation-misread'),
    tags: SORT_TAGS,
    who: 'a named kind',
  }),
  'a named kind',
);

/**
 * CERTIFIES (mastery 06) — the same question with the sort named out loud.
 *
 * A LADDER OF ITS OWN, and the reason is arithmetic rather than taste: the two
 * stems share one generator, so between them they would spend three of the two
 * uses the dedup allows a template across the non-retrieval core. It is also
 * better advice — a page that has just said "each kind has its own group" wants
 * the child sent to the boundary between groups, not to the group itself.
 */
const kindSorted = withRungs(
  spokenSafe(
    withCards(sortAndCount('sorted'), {
      why: voiced(KIND_VOICE, 'representation-misread'),
      tags: SORT_TAGS,
      who: 'a sorted board',
    }),
    'a sorted board',
  ),
  rungs('Every group here holds one kind and no other.', 'So count to the edge of that kind, then stop.'),
);

/** CERTIFIES (mastery 02) — the place handed over, up and down. */
const rowCount = withRungs(
  spokenSafe(
    withCards(countTheRow(), {
        why: voiced(ROW_VOICE, 'procedure-slip'),
      tags: COUNT_TAGS,
      who: 'a named row',
    }),
    'a named row',
  ),
  rungs('Say the row word again, then put a finger there.', 'Keep the finger on that row while you count.'),
);

/** CERTIFIES (mastery 04) — the place handed over, side to side. */
const endCount = withRungs(
  spokenSafe(
    withCards(countTheEnd(), {
        why: voiced(END_VOICE, 'procedure-slip'),
      tags: COUNT_TAGS,
      who: 'a placed group',
    }),
    'a placed group',
  ),
  rungs('Point at the group the words send you to.', 'Then count what is in that one group only.'),
);

/** CERTIFIES (mastery 03) — the week's discrimination, in both of its stems. */
const placeSits = spokenSafe(whereDoesItSit('sits'), 'a place, asked plainly');
const placeFind = spokenSafe(whereDoesItSit('find'), 'a place, asked again');

const puppetPage = spokenSafe(
  withCards(puppetGoesByPlace(), {
    // The number the puppet said is on the page already. Offering it as a card
    // would make "take one of the other two" worth half a page (disclosure 3).
    barred: (p) => new Set([Number(p.said)]),
    why: voiced(PUPPET_VOICE, 'procedure-slip'),
    tags: ['task-comprehension', 'representation-misread'],
    who: 'the puppet',
  }),
  'the puppet',
);

/** CERTIFIES (mastery 05) — the transfer page, sorted by hand and by kind. */
const storyToybox = spokenSafe(
  withCards(sortStory('toybox'), {
    why: voiced(STORY_VOICE, 'task-comprehension'),
    tags: ['task-comprehension', 'procedure-slip'],
    who: 'the toybox',
  }),
  'the toybox',
);

const storyBookcase = spokenSafe(
  withCards(sortStory('bookcase'), {
    why: voiced(SHELF_VOICE, 'procedure-slip'),
    tags: ['task-comprehension', 'procedure-slip'],
    who: 'the bookcase',
  }),
  'the bookcase',
);

const day5Tell = spokenSafe(tidyAndTell(), 'the tidying');

// --- the four warm-ups: one week, one format and one day each ----------------
const warmScatter = warmUp(spokenSafe(howManyChoice({ min: 3, max: 5, arrangement: 'scattered' }), 'a loose scatter'), 1);
const warmMatched = warmUp(spokenSafe(compareSets({ which: 'fewer', min: 3, max: 8 }), 'two matched rows'), 5);
const warmWhichGroup = warmUp(spokenSafe(setForNumeral({ min: 6, max: 10, groups: 3 }), 'the named number'), 2);
const warmShape = warmUp(spokenSafe(shapeName({}), 'a flat shape'), 7);

// ===========================================================================
// The week
// ===========================================================================

export const buildA08 = makeWeekBuilder({
  level: 'A',
  week: 8,
  conceptId: 'position-and-sorting',
  conceptName: 'Position & sorting',
  strandTags: ['number-sense-counting', 'algebra-geometry'],
  prerequisiteWeeks: [
    { level: 'A', week: 2 },
    { level: 'A', week: 5 },
  ],
  pedagogyContract: 'v2',
  // Band A spends the §6.1 multi-step row on the pictorial rule, so this
  // selector is inert here; it is declared because the kit asks every non-D
  // blueprint to name its family, and putting things into groups by a property
  // is a classification move rather than an operation.
  conceptFamily: 'place-value',
  conceptualAnchor: 'one kind to a group',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt is spoken, never read; one question fills a page; targets are finger-sized. Do this one on the floor before you do it on the screen. Tip out a bowl of odds and ends and ask for one rule - all the round ones here, everything else there - then count each pile out loud. The place words are the harder half: say them while your hands move, because a word learned standing still does not travel. Put a pile above another and name it, then slide the same two piles side by side and name them again, so the child hears that nothing about the piles changed except where they went. Mascot present.',
  },
  explanation: {
    hook: say('Look at this jumble. Let us put the same ones together. Now each heap holds one kind.'),
    whyBeforeHow: say(
      'Sorting means one kind to a group. We sort because an unsorted heap cannot be counted. Once a kind is gathered, that group has an amount. Groups have places too. One group can sit above another, or beside it. Where a group sits never changes what it holds.',
    ),
    script: [
      {
        say: say('Here is a jumble. Let us make one group for each kind.'),
        visual: 'A loose scatter of blocks and shells before anything has been sorted.',
        figure: counterGroups([{ count: 7, noun: 'blocks' }], {
          arrangement: 'scattered',
          alt: alt('a heap of blocks tipped out and left where they fell'),
        }),
      },
      {
        say: say('Now count one group. Only that kind. Nothing else.'),
        visual: 'Three tidy groups side by side, each holding one kind of thing.',
        figure: counterGroups(
          [{ count: 4, noun: 'blocks', label: 'blocks' }, { count: 6, noun: 'shells', label: 'shells' }, { count: 3, noun: 'leaves', label: 'leaves' }],
          { arrangement: 'in a row', alt: alt('groups of blocks, shells and leaves, gathered kind by kind') },
        ),
      },
      {
        // The two vertical words, taught where the board is stacked and the
        // answer is not being asked for.
        say: say('This board goes up and down. The shells are above the leaves.'),
        visual: 'A row of shells with a row of leaves stacked directly beneath it.',
        figure: counterGroups(
          [{ count: 5, noun: 'shells', label: 'shells' }, { count: 3, noun: 'leaves', label: 'leaves' }],
          { relation: 'compare', arrangement: 'in a row', alt: alt('a row of shells with a row of leaves stacked under it') },
        ),
      },
      {
        // The two horizontal words, on the SAME two kinds, so the child hears
        // that the place changed and the amounts did not.
        say: say('Watch. Same shells, same leaves. Now they sit beside each other.'),
        visual: 'The same two kinds moved to sit side by side, shells on the left.',
        figure: counterGroups(
          [{ count: 5, noun: 'shells', label: 'shells' }, { count: 3, noun: 'leaves', label: 'leaves' }],
          { arrangement: 'in a row', alt: alt('a group of shells set beside a group of leaves') },
        ),
      },
      {
        say: say('The shells are on the left. The leaves are on the right. Nothing else moved.'),
        visual: 'The same side-by-side board, with a hand pointing first left and then right.',
        figure: counterGroups(
          [{ count: 5, noun: 'shells', label: 'shells' }, { count: 3, noun: 'leaves', label: 'leaves' }],
          { arrangement: 'in a row', alt: alt('the same groups again, still set beside each other') },
        ),
      },
      {
        say: say('The middle group sits between the other two.'),
        visual: 'Three groups side by side, with the middle one ringed by a finger.',
        figure: counterGroups(
          [{ count: 4, noun: 'balls', label: 'balls' }, { count: 6, noun: 'stars', label: 'stars' }, { count: 3, noun: 'buttons', label: 'buttons' }],
          { arrangement: 'in a row', alt: alt('groups of balls, stars and buttons, set out along a line') },
        ),
      },
    ],
    summary: say(
      'One kind to a group. Then count just that group. A group also has a place. Above, below, left, right.',
    ),
    vocabulary: [
      { term: 'sort', kidGloss: 'put the same kind of thing together' },
      { term: 'above', kidGloss: 'sitting higher up than the other one' },
      { term: 'below', kidGloss: 'sitting lower down than the other one' },
      { term: 'left', kidGloss: 'the side your hand goes to first' },
      { term: 'right', kidGloss: 'the other side, away from the first hand' },
      { term: 'between', kidGloss: 'in the space with one thing each side' },
    ],
  },
  guidedExamples: [
    {
      // NOT ONE NUMERAL IN ANY EXAMPLE (disclosure 10): the two-token filter is
      // never reached, so no day slot quietly loses a cell.
      ...ge(
        8,
        1,
        'modeled',
        // No name here or below: every name this week uses is drawn from `NAMES`
        // at item time, and hardcoding one that is also in the pool is the kit
        // §F.3 collision.
        boardPrompt('groups of apples, buttons and ducks in a line', 'Tap how many buttons there are.'),
        [
          {
            teacherSay: say('Watch me. I am not counting everything. I only want one kind.'),
            expected: 'the buttons',
          },
          { childDo: say('Count inside that group with me.'), expected: '5' },
          { teacherSay: say('Five buttons. The apples and ducks were never mine to count.') },
        ],
        '5',
      ),
      visual: 'Three groups in a line: apples, then buttons, then ducks.',
      // NO ASSERTION ON ANY EXAMPLE, and it is a schema fact rather than a
      // preference: a guided example is audited against its ANSWER alone
      // (`validator.ts` passes `{answer: [g.answer]}` and no params), and a
      // counters figure's default quantity is everything it draws. `assertsAnswer`
      // would set QG-13 comparing an honest picture with a correct answer and
      // calling them a contradiction.
      figure: counterGroups(
        [{ count: 3, noun: 'apples', label: 'apples' }, { count: 5, noun: 'buttons', label: 'buttons' }, { count: 4, noun: 'ducks', label: 'ducks' }],
        { arrangement: 'in a row', alt: alt('groups of apples, buttons and ducks, set out along a line') },
      ),
    },
    {
      ...ge(8, 2, 'completion', boardPrompt('rows of flowers and stars, stacked up the page', 'Tap the word for where the stars sit.'), [
        { teacherSay: say('First I ask myself which way this board runs.') },
        { childDo: say('It runs up and down. So which end?'), expected: 'below' },
        { teacherSay: say('Below. A down word, for a board that goes down.') },
      ], 'below'),
      visual: 'A row of flowers with a row of stars stacked beneath it.',
      figure: counterGroups(
        [{ count: 4, noun: 'flowers', label: 'flowers' }, { count: 6, noun: 'stars', label: 'stars' }],
        { relation: 'compare', arrangement: 'in a row', alt: alt('a row of flowers with a row of stars stacked under it') },
      ),
    },
    {
      ...ge(8, 3, 'prompted', boardPrompt('groups of shells and balls, set out side by side', 'Which word tells you where the balls are?'), [
        { teacherSay: say('Same question, but look what the board is doing now.') },
        { childDo: say('It goes across. So say an across word.'), expected: 'right' },
        { teacherSay: say('Nothing about the balls changed. Only where they went.') },
      ], 'right'),
      visual: 'A group of shells set beside a group of balls, shells nearer the left.',
      figure: counterGroups(
        [{ count: 6, noun: 'shells', label: 'shells' }, { count: 4, noun: 'balls', label: 'balls' }],
        { arrangement: 'in a row', alt: alt('a group of shells set beside a group of balls') },
      ),
    },
    {
      ...ge(8, 4, 'independent', boardPrompt('rows of leaves, ducks and blocks, stacked up the page', 'Count the row in the middle.'), [
        { childDo: say('Put a finger on that row, then count along it.'), expected: '7' },
      ], '7'),
      visual: 'Three stacked rows: leaves on top, then ducks, then blocks.',
      figure: counterGroups(
        [{ count: 3, noun: 'leaves', label: 'leaves' }, { count: 7, noun: 'ducks', label: 'ducks' }, { count: 5, noun: 'blocks', label: 'blocks' }],
        { relation: 'compare', arrangement: 'in a row', alt: alt('rows of leaves, ducks and blocks, stacked in that order from the top down') },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the sort, then the first place word, on a board the
    // child has already met counting.
    [
      { gen: warmScatter, diff: 1 },
      { gen: kindPlain, diff: 1 },
      { gen: rowCount, diff: 2 },
      { gen: placeSits, diff: 2 },
    ],
    // Day 2 — the axis becomes the question, beside a page where it is only the
    // routing, so the two uses of a place meet on one day.
    [
      { gen: warmMatched, diff: 2 },
      { gen: placeFind, diff: 3 },
      { gen: kindSorted, diff: 2 },
      { gen: endCount, diff: 2 },
    ],
    // Day 3 — the discrimination again, and the puppet who answers a kind
    // question with a place.
    [
      { gen: warmWhichGroup, diff: 2 },
      { gen: placeSits, diff: 3 },
      { gen: rowCount, diff: 2 },
      { gen: puppetPage, diff: 3 },
    ],
    // Day 4 — single-step real-world pictures (the band-A form of G7), one
    // sorted by kind and one filled row by row.
    [
      { gen: warmShape, diff: 2 },
      { gen: storyToybox, diff: 2 },
      { gen: storyBookcase, diff: 3 },
      { gen: kindPlain, diff: 2 },
    ],
    // Day 5 — the non-computational focus: one more place read, one more place
    // counted, then off the chair to sort real things two ways and tell.
    [
      { gen: endCount, diff: 2 },
      { gen: placeFind, diff: 2 },
      { gen: day5Tell, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    "For grown-ups: this week has two halves that look unrelated and are not. The first is sorting - one kind to a group - and it is the quiet beginning of everything later: a group you can name is a group you can count, and a group you can count is an amount. The second is place words, and those are harder than they look. Above, below, left and right are not properties of a thing, they are relations between two things, so the very same pile is above one heap and below another depending on what you set it beside. That is why the pages keep moving the same two kinds around. Two things are worth watching for. The first is the mistake the puppet makes: asked for the shells, a great many four-year-olds count whichever group is nearest, or first, or biggest - they answer by WHERE instead of by WHAT. It is not carelessness, it is a sensible shortcut that has worked all their life, and the cure is to name the kind out loud and put a finger on it before a single number is said. The second is that left and right will not stick this week and are not meant to; say them constantly while your hands are moving - pass the cup to your left hand, put the shoes on the right - because a place word learned sitting still does not travel. Best of all, sort real things on the floor: buttons, socks, leaves from the garden. Choose one rule, follow it to the end, then count each pile and say where it is.",
  ],
  /**
   * The band-A production puzzle, and the making is the mathematics.
   *
   * Every core page runs from a picture to a word or a number. This one runs the
   * other way for the first time in the week: the child is given a place word and
   * has to PUT something there, which is the only move that proves a place word
   * means anything rather than being a label they can match. The count they must
   * copy is read off a group the words send them to, so the sort and the place
   * are both needed and neither on its own is enough.
   *
   * `manual-review`, because nothing can grade a crayon and because `Puzzle`
   * carries no `choices` field at all in `types.ts`: left numeric it would fall
   * through to `tapOptionsFor`, which invents buttons from the answer alone. The
   * number the drawing must come to is in `answer.value` for the grown-up and for
   * any audit. The picture carries no assertion - what it draws is the board
   * before the child has added anything, and what the page asks for does not
   * exist until they have.
   */
  puzzle: (r, guard) => {
    // Not a board the days have already worked on. Bounded, deterministic, and
    // the space is far larger than the handful of boards a pack takes.
    let board = heaps(r, 3);
    for (let k = 0; k < 10 && guard.taken(`a08:pz|${board.map((g) => g.count).join('-')}`); k++) board = heaps(r, 3);
    guard.add(`a08:pz|${board.map((g) => g.count).join('-')}`);
    const copy = board[0].count;
    return {
      id: 'A8-PZ-01',
      title: 'Puzzle Grove: Put It Where I Say',
      puzzleType: 'construction',
      prompt: [
        `[image: ${boardScene(board)}]`,
        // Not "Count the group on the left" — that is `countTheEnd`'s own
        // sentence, and found by reading: at one seed the puzzle opened with the
        // line a Day-5 page had just used. No gate compares two prompts that
        // carry different numbers.
        say('How many are in the group on the left?'),
        say('Now draw that many buttons below the middle group.'),
        say('Say where your new group sits.'),
      ].join(' '),
      figure: counterGroups(
        board.map((g) => ({ count: g.count, noun: g.noun, label: g.noun })),
        { arrangement: 'in a row', alt: alt(r.pick(LINE_NAMES)(kindList(board.map((g) => g.noun)))) },
      ),
      answer: {
        value: `${String(copy)} buttons drawn below the middle group`,
        acceptableForms: [String(copy), `${numberWords(copy)} buttons below the middle group`],
        validation: 'manual-review',
      },
      hintLadder: rungs('Find the group the words send you to first.', 'Draw yours under the middle one, not beside it.'),
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'put-a-group-in-a-named-place' },
  sprint: null,
  mastery: [
    { gen: kindPlain, diff: 2 },
    { gen: rowCount, diff: 3 },
    { gen: placeFind, diff: 3 },
    { gen: endCount, diff: 2 },
    { gen: storyToybox, diff: 3 },
    { gen: kindSorted, diff: 3 },
  ],
  isomorphNotes:
    'Form B is Form A\'s twin index by index - one generator and one difficulty per slot, its board dealt off a stream of its own - and every slot ships cards authored here, so nothing certifying is left as a bare numeral for the display layer to invent buttons around. 01 and 06 are the catalog line itself: a board sorted one kind to a group, with the kind named and the amount asked for, which is the direction a numeral is the honest button for. The group the question names is drawn uniformly over the three, so no habit about which group to count - the first, the biggest, the nearest - is worth more than a third. 02 and 04 hand the place over instead of asking for it, once up and down and once side to side, and the row or group asked for is drawn per item rather than fixed per slot: fixed, the slot would teach "the top one" instead of teaching that the word decides, which is the relational invariant that has to be rotated rather than merely varied. 04 is where the catalog\'s fourth position word lives, since a middle GROUP is between the two beside it and nothing else, while a middle ROW is below one and above another at once and could not be asked for at all. 03 is the discrimination and the reason the week exists: two kinds, an axis drawn by a coin, and three place words of which exactly one is true - and because only one of the three words left over shares the truth\'s axis, every single draw carries at least one word from the other family, so a child who has learned a favourite word rather than how to read a board is choosing between axes on every page. 05 is a real-world transfer page with a story in front of it and the same sort behind it. On every numeric slot the cards come from the eight counts the week draws, which is the set that slot itself keys, so every numeral offered is one it really answers on some other draw and none can be struck out unread. WHICH SEAT the truth takes is settled by fitted weights before any wrong value is chosen, because the lowest count has nothing beneath it and the highest nothing above, and a set left to itself starves its middle seat. What is NOT separately enforced, rather than claimed away: Form B is kept off Form A ground by the assembler, which rebuilds any Form-B page whose template and params match its twin, and by the pack-wide surface guard signing three counts per board - but which KIND is paired with which count is not signed, and the position slot carries no registered template at all, so its truth is re-derived from the emitted figure by this file instead of by the registry.',
  mistakeBank: [
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-by-where-not-by-what',
      description:
        'Asked for a named kind, counts whichever group is handiest - the first one, the nearest one, the biggest one - and reports that. It is the week\'s headline misconception and it is not carelessness: at four, "the one in front of me" has been a reliable answer to almost every question anyone has asked, and a board of sorted groups is the first time it stops working.',
      exampleWrongAnswer: 'asked how many shells, counts the group on the left because it is nearest',
      distractorRationale:
        'No card can carry it: the number the habit produces is some other group\'s count, which moves wherever the board moves instead of standing a fixed step from the truth. So it is met by the TASK on every page: the group the question names is drawn uniformly over the three, so no place is worth more than a third, and the puppet page puts the habit on the page as prose and asks the child to repair it. Both of the puppet\'s numbers - the one it said and the one it should have said - are real drawn groups, and the one it said is barred from that page\'s own cards.',
      reteachPointer: 'explanation/script[1] (count one group, only that kind, nothing else)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'reads-the-board-on-the-wrong-axis',
      description:
        'Reaches for a side-to-side word when the board is stacked up and down, or the reverse. A child holding this can point at the right group perfectly well and still name where it is with a word from the wrong family, because the words have been learned as labels for groups rather than as directions the board runs in.',
      exampleWrongAnswer: 'a row stacked under another row, answered as "right"',
      distractorRationale:
        'Every position page offers at least one word from the other axis, on every draw, by construction: only one of the three words left over shares the truth\'s axis, so whichever two are dealt, one of them crosses. The axis itself is a coin flip drawn before anything else, so the four words are each keyed a quarter of the time and no favourite word beats chance.',
      reteachPointer: 'explanation/script[3] (same shells, same leaves - now they sit beside each other)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-past-where-the-kind-changes',
      description:
        'Starts inside the right group and carries on into the next one, because the gap between two groups is read as a space inside one. Commonest on a board set out side by side, where the groups sit closest together, and it is the reason the sorting has to be seen as well as done.',
      exampleWrongAnswer: 'a group of 4 counted as 6, the next group\'s first things swept in',
      distractorRationale:
        'A count that runs on lands a step or a stride above the truth, and both of those numbers are in the pool wherever the cell list has room for them. Neither is a decoy: each is what this same slot answers on some other draw, so there is nothing about either to eliminate at a glance, and the only route past them is to find where one kind stops and start the count again from there.',
      reteachPointer: 'guidedExamples/A8-GE-01 (the apples and ducks were never mine to count)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'lets-go-of-the-row-partway',
      description:
        'Finds the right row or group and then loses it: the finger drifts onto the neighbouring row, or the count begins at the second thing rather than the first. It belongs to the placed pages specifically, where holding a row in mind is a separate job from counting along it.',
      exampleWrongAnswer: 'a row of 7 reported as 6, the first thing on the row never said',
      distractorRationale:
        'The pool reaches as far beneath the truth as it reaches over it, so no page here rewards a habit of guessing light. Which two neighbours actually appear is settled only once the truth has been given its seat, and each card\'s explanation is generated from the NUMBER the card carries rather than from the reasoning that chose it - which is what stops an account ending up beside a value it does not describe.',
      reteachPointer: 'guidedExamples/A8-GE-04 (put a finger on that row, then count along it)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Putting things into groups by one rule, and saying where each group sits. First we sorted - one kind to a group - and counted just the group we were asked about, which is harder than it sounds when three groups are sitting side by side. Then we learned four place words: above, below, left and right. The idea underneath both halves is the same one: a group has an amount AND a place, and the two are different questions about the same picture.',
    improvingCandidates: [
      'counting only the group that was named, and stopping where the kind changes',
      'saying whether a board runs up and down or across before choosing a word',
      'finding a group from a place word instead of from what it holds',
      'holding one row in mind while counting along it',
      'sorting a real heap by one rule and following it to the end',
    ],
    strengtheningByTag: [
      {
        errorTag: 'task-comprehension',
        text: 'answering about the kind that was asked for, not the group that was nearest',
      },
      {
        errorTag: 'concept-misconception',
        text: 'reading which way a board runs before reaching for a place word',
      },
      {
        errorTag: 'representation-misread',
        text: 'stopping at the edge of a group instead of counting on into the next',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping a finger on the named row so the count cannot wander off it',
      },
    ],
    homeFocus: {
      praiseLine:
        'You chose one rule for that heap and stuck to it. Then you found the very group I had asked about.',
      questionForChild: 'Can you put all the same ones together, then tell me where each pile is?',
      schoolSyncHook: 'Sorting turns up early in most reception rooms - tell us how theirs does it and we will lean the same way.',
    },
    vocabularyForParent: [
      'sort (put things into groups by one rule, and follow that rule all the way)',
      'above and below (a relation between two things, never a property of one - the same pile is above one heap and below another)',
      'left and right (say them while your hands are moving; a place word learned sitting still does not travel)',
      'beside (next to, side by side - the looser word, useful when neither thing is higher than the other)',
      'between (in the space with one thing on each side)',
    ],
  },
});
