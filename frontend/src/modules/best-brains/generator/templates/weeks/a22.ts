/**
 * Level A · Week 22 — "Counting to 50 & tens" (conceptId: counting-to-50-and-tens).
 *
 * FILL-ARCHITECTURE §3 row A22: anchor "tens-towers"; core forms "count by
 * tens" and "how many tens"; perceptual discrimination **24 vs 42**; puppet
 * error-analysis "reads 24 as forty-two"; Day-5 "tens-and-more match". Catalog
 * row: rote to 50, count groups of 10, skip-count by 10s, with groups-of-10
 * picture puzzles (bundling) as the non-computational focus.
 *
 * WHAT THE WEEK CLAIMS, AND HOW THE PAGES FORCE IT
 *
 *  - **A TEN CAN BE PICKED UP.** Ten blocks pushed together stop being ten
 *    things and become one thing, and once that has happened they are never
 *    counted again — they are counted OVER, in tens. Every page in the file is
 *    built on the same apparatus: a line of towers, each ten high, with the
 *    blocks that did not make a tower standing loose at the end.
 *  - **A TWO-DIGIT NUMERAL IS A COUNT OF TOWERS AND A COUNT OF LOOSE ONES, AND
 *    THE FRONT MARK IS THE ONE THAT COUNTS TOWERS.** That is the week, and it is
 *    why the discrimination is 24 against 42: the same two marks, the same two
 *    piles, and the only thing that decides between them is which pile the front
 *    mark was written for.
 *  - **THE PUPPET'S SLIP IS THE AUDIO TWIN OF THE SAME THING.** Reading the
 *    marks aloud in the order the eye met them gives "forty-two" for a picture
 *    of two towers and four loose blocks. Nothing is miscounted; the reading
 *    order is what fails, which is why the repair is to count the towers FIRST
 *    and only then say the marks.
 *  - **A22 IS NOT A10 WITH BIGGER NUMBERS.** A10 owns digit order for TEENS
 *    (13 against 31), where the ten is invisible in the word and there is only
 *    ever one of it, so the child's only job is to know the ten leads. Here both
 *    counts vary, both are drawn, and the tens can be picked up and counted as
 *    objects — so the front mark stops being a rule about teens and becomes a
 *    quantity a child can put a finger on. Nothing in this file asks a child to
 *    write a numeral, and nothing in A10 asks them to count a group of tens.
 *  - **Nothing here is a page of words.** The band trades its multi-step quota
 *    for a picture on every working day, and each of those pictures is built
 *    out of the numbers its own item is doing arithmetic on.
 *  - **No timers.** `sprint: null`.
 *  - **One page in five looks back rather than forward** — four of the nineteen,
 *    spread one to a day across Days 1 to 4, no two of them from the same week
 *    or in the same format: a teen collection counted with nothing grouping it (A9), the empty
 *    cells of a full-size frame (A13), the next number along a path (A6), and a
 *    small set named by its numeral (A4).
 *
 * ── TWELVE DISCLOSURES ──────────────────────────────────────────────────────
 *
 * 1. **THE COLLISION THIS WEEK IS BUILT AROUND: "how many tens" KEYS THREE AND
 *    "count by tens" KEYS THIRTY, AND ONE DIGIT ANSWERS BOTH.** A child who has
 *    learned nothing but "say how many tall stacks there are" passes the first
 *    page; a child who has learned "say that, then add a nought" passes the
 *    second. Both are executable from the picture without any place-value idea
 *    at all, so the two questions are deliberately kept on separate slots with
 *    separate card sets and separate pictures, and the reflexes are measured:
 *      · **count the towers and say that** — the correct method on
 *        `howManyTens`, and a wrong answer on every other numeric slot in the
 *        week, because no other slot keys a value in 1–4;
 *      · **count the loose ones and say that** — never the key anywhere,
 *        because `fillTheNextTower` bars the one cell where ten minus the loose
 *        count equals the loose count, and every cell in the week bars the
 *        loose count from equalling the tower count.
 *    The measured rates are in the report. The design rule behind them: a slot
 *    whose key is a single digit never shares a card set with a slot whose key
 *    is a two-digit numeral, so a reflex that produces the wrong KIND of number
 *    produces a value that is not on the page at all.
 *
 * 2. **ONE SLOT IS ANSWERED BY NEITHER MARK, ON PURPOSE (kit §2b, a17's
 *    `firstHop`).** `fillTheNextTower` shows the same towers and asks how many
 *    more blocks would finish another tower — ten minus the loose count. It is
 *    not the tower count, not the loose count, and not the whole amount, so no
 *    reading habit reaches it; the only route is the partner-of-ten bond A13
 *    taught, which is why A13 is one of the warm-ups. Two cells are barred at
 *    the source so the coincidences cannot resurrect a beaten habit: a loose
 *    count of five keys five (the loose-count reflex would win), and any cell
 *    where the tower count happens to equal ten minus the loose count is
 *    dropped (the tower-count reflex would win).
 *
 * 3. **THE DISCRIMINATION ALWAYS PUTS THE SWAP ON THE PAGE, AND THAT IS WHAT
 *    DECIDES ITS SEATS.** `whichNumeralSaysIt` draws both counts from one to
 *    four so that the swapped numeral is a value the slot itself really keys on
 *    some other draw (L38: no permanently unkeyable card). The swap therefore
 *    stands above the truth on exactly the draws where the loose count exceeds
 *    the tower count and below it otherwise, which fixes half of the answer's
 *    rank before anything else is chosen. So the third card is drawn to complete
 *    it: on a swap-above draw the truth takes the lowest seat when the third
 *    card is also above and the middle seat when it is below, and the mirror on
 *    a swap-below draw. Twelve cells, six of each kind, and the seat weights are
 *    solved to a flat third rather than assumed — see disclosure 6.
 *
 *    What this costs, said plainly: the top seat is unreachable for a swap-above
 *    cell and the bottom seat for a swap-below one, so the rank is flat ACROSS
 *    the slot and not within a cell. A child who already knows which pile is
 *    bigger knows which side of the truth the swap falls on — but that knowledge
 *    IS the week's content, so it is mastery leaking into the page rather than a
 *    shortcut around it.
 *
 * 4. **THE PUPPET'S NUMBER IS THE REGISTRY'S, NOT THIS FILE'S.**
 *    `a_verify_teen_write_v1` reverses the digit string of its stored `n` and
 *    refuses a palindrome, so for a drawn twenty-four it returns
 *    `{correct: '24', wrong: '42'}` — row A22's slip exactly, recomputed rather
 *    than authored, and QG-11 checks both halves (the keyed card against
 *    `correct`, the prompt against `wrong`). The transform's ID names teens
 *    because A10 was the first week to need it; its BEHAVIOUR is a plain digit
 *    reversal with no teen in it. **Recorded for the orchestrator:** the id
 *    wants to be `a_verify_digit_swap_v1`, or the teen name will keep sending
 *    later authors looking for a transform that is already there.
 *
 *    What the puppet said is announced and then withheld from the buttons. A
 *    page that names one of its own three numbers is worth half a page to a
 *    child who eliminates it, and half a page is worth teaching with and not
 *    worth promoting on — hence Day 3, and hence no mastery slot.
 *
 * 5. **THE DAY-5 MATCH IS THE ONE PLACE WHERE BOTH COUNTS MUST BE READ.** Three
 *    cards, each naming a number of tens and a number of loose ones, exactly one
 *    of which describes the picture — and the two wrong cards are built to
 *    differ from the truth in DIFFERENT PARTS: one has the loose count right and
 *    the tower count out by one, the other has the tower count right and the
 *    loose count out by one. So counting only the towers leaves two cards
 *    standing and counting only the loose ones leaves two cards standing, and
 *    neither half of the picture decides the page on its own. The
 *    discrimination cannot be built this way — the swap differs in both parts by
 *    construction — which is why the two pages are complementary rather than one
 *    page run twice.
 *
 * 6. **THE ANSWER'S RANK IS FITTED, NOT LEFT TO FALL WHERE IT LIKES.** Since
 *    every card has to be something the slot can key, all three come out of one
 *    set — and any set decides its own extremes for you: whatever sits at the
 *    bottom of it can only ever be the lowest number shown, whatever sits at the
 *    top only ever the highest. Draw uniformly on top of that and the middle
 *    position runs dry, at which point a child who taps the biggest, or always
 *    the one in between, starts collecting marks for nothing. `seatTable` fits
 *    a weight per key and position by alternating two moves — scale each
 *    position's column toward a third, renormalise each key's row back to a
 *    probability — until neither margin will move, and it declines to load at
 *    all when no fit exists. One solver covers all nine carded slots; each
 *    supplies its own account of which positions a given key can occupy at all.
 *    The rates it produces are in the report, not asserted here.
 *
 * 7. **WHICH NUMERALS A SLOT MAY OFFER IS COMPUTED FROM ITS OWN CELLS, NEVER
 *    DECLARED (L38).** No list of buttons is typed out anywhere in this file.
 *    Every slot lists its admissible cells when the module loads, runs its own
 *    answer function across them to see what it can key, and hands the result to
 *    `threeCards`, which refuses anything outside it. For the record — the
 *    skip-count page keys twenty, thirty, forty and fifty; the tens-count page
 *    and the star story key one to four; the finish-the-tower page and the shell
 *    story key one to four and six to nine;
 *    the discrimination and the puppet both key the twelve two-digit numerals
 *    whose marks are both one to four and different; the button story keys any
 *    of the twenty-nine amounts the apparatus can draw; the Day-5 match keys one
 *    of thirty-six cards; and
 *    the four warm-ups key eleven to twenty, one to nine, seven to ten and six
 *    to ten.
 *
 * 8. **EIGHT LOCAL GENERATORS, EACH NAMING THE FAMILY GAP IT FILLS.**
 *    `howManyTens`, `fillTheNextTower`, `whichNumeralSaysIt`,
 *    `puppetReadsItBackwards`, `tensAndMoreMatch`, three `tensStory` frames and
 *    `bundleAndTell`. The family owns exactly one A22 form — `countByTens`,
 *    which this week uses and which draws the anchor — and one A22
 *    discrimination, `numeralTrap({trap: 'digit-swap'})`, which is NOT used, for
 *    three measured reasons: it offers **two** cards where L53 requires three on
 *    a certifying slot; its swapped card is `10·o + t` with the ones digit drawn
 *    up to nine, so a drawn twenty-seven offers seventy-two — a numeral outside
 *    the week's ceiling of fifty and one no draw of that generator can ever key;
 *    and its accessible name speaks a number (disclosure 9). The other seven
 *    forms have no family generator at all: nothing in `lib/earlynumber.ts`
 *    counts a group of tens, completes a ten from a remainder, matches a
 *    part-description to a place-value picture, bundles a heap, or tells a
 *    real-world story about tens. Each of the eight honours the same four
 *    obligations the family imposes on itself: an id the registry can resolve, a
 *    drawing assembled by `lib/figures` from the values the item is working
 *    with, every quantity rendered through `lib/format`, and an `authorMeta`
 *    stamp for the preflight.
 *
 * 9. **NOT A DIGIT AND NOT A NUMBER WORD IN ANYTHING A PICTURE IS CALLED (L48)
 *    — AND THE STANDING NOTE THAT THE LIBRARY IS NOW CLEAN IS OUT OF DATE.** At
 *    band A the alt is not a fallback for the picture, it IS the picture: `speakablePrompt`
 *    prefers it over the bracket and every band-A screen autoplays it BEFORE the
 *    question. This week's answers run from one to fifty, so every digit and
 *    every number word from zero to fifty is live.
 *      · Locally written names all pass through `alt()`, which refuses at module
 *        load any digit, any word from zero to twenty, any of the tens names,
 *        hundred, and the numbers that travel in disguise — once, twice, single,
 *        double, twin, pair, couple, dozen, half, both.
 *      · Every alt that REACHES A CHILD is checked again at draw time by
 *        `spokenSafe`, which wraps all thirteen generators including the four
 *        library warm-ups — a23 recorded that its draw-time pass caught two
 *        cases its module-load pass could not, and the same split applies here
 *        because five of this week's pictures are built inside `lib/`.
 *      · **`countByTens` FAILS IT.** Its alt is the fixed string `'some towers
 *        of ten blocks'`, which plays the word "ten" to a pre-reader over a page
 *        whose answer is a multiple of ten — and on a single-tower draw the word
 *        spoken and the answer keyed are the same number. The fix applied here
 *        swaps that one string on the way past and leaves the rest of the draft
 *        alone, because a week has no business editing the shared library.
 *        **Reported upward rather than repaired.**
 *        `numeralTrap` carries the same defect twice over
 *        (`'some towers of ten and some loose blocks'` and `'two ten-frames with
 *        some counters in them'` — the second speaks two number words); this
 *        file does not use it, for the reasons in disclosure 8, so it repairs
 *        neither.
 *      · `countArrangement`, `tenFrameEmpty`, `neighbourNumber` and
 *        `howManyChoice` were all repaired centrally by earlier weeks and arrive
 *        clean. They are re-checked anyway, because "it was clean last week" is
 *        not a property a build can rely on.
 *    What the rule costs, disclosed rather than hidden: a child who cannot see
 *    the picture is told that towers are standing in a line and is NOT told that
 *    each one is a ten. That is the trade L48 makes everywhere, and it is worse
 *    here than usual because the tower's height is the whole apparatus. The
 *    question says "count by tens" and the week teaches the tower, so the fact
 *    survives in every surface a child meets deliberately — but a
 *    `figures/types.ts` field for a structural given a screen reader may hear
 *    would close it properly. **Recorded for the orchestrator.**
 *
 *    None of this touches the `[image: …]` brackets, which go on counting. They
 *    exist to give an item its operand signature (L29), they are stripped out of
 *    the prompt before a screen ever renders it, and wherever a picture exists
 *    the picture's own name is what gets played instead — which is every page
 *    here.
 *
 * 10. **CARDS ON EVERY NUMERIC PAGE (L53), AND TWO REPLACEMENTS FOR THE CHECK
 *    THAT COSTS.** Typing is not an answer mode at four; and a numeric band-A
 *    page that ships no `choices` is completed at display time by
 *    `tapOptionsFor`, which manufactures buttons out of the answer and knows
 *    nothing about what the slot can draw. Every numeric page here therefore
 *    carries its own — days, stories, warm-ups and both mastery forms. The
 *    cost is that the arithmetic re-check only fires on five numeric
 *    validations and a tapped key is not one of them, so `a_count_tens_v1`,
 *    `a_count_v1`, `a_frame_empty_v1` and `a_neighbour_v1` all fall silent the
 *    moment the buttons go on; `withCards` puts a second derivation in their
 *    place, written here and held against both what the generator keyed and
 *    what the picture draws. The eight pages this
 *    file builds itself go one better and register a transform that carries a
 *    `verifyFor` — the binary-operation truth, or the digit reversal — which
 *    QG-11 audits whether or not the page has buttons on it, so the central
 *    check keeps running where it matters most.
 *    (Fifth week running that `a_count_v1`, `a_count_tens_v1`,
 *    `a_frame_empty_v1` and `a_neighbour_v1` want verify twins —
 *    **recorded again**.)
 *
 * 11. **NOT ONE NUMERAL IN A WORKED EXAMPLE'S BRACKET, AND THAT IS A DECISION.**
 *    A day item whose prompt carries the same numeric tokens as a worked example
 *    is thrown away and redrawn; the mastery forms are exempt from that filter.
 *    So an example printing two numbers quietly deletes a cell from a day slot
 *    while its mastery twin keeps it — and the cards, built from the full cell
 *    list, go on offering a numeral that day slot has been made incapable of
 *    serving. A13 met it and wrote it up. The way past it is to describe the
 *    picture rather than count it, which is what all four examples here do: none
 *    prints a numeral, the filter's two-token floor is never crossed, and the
 *    key sets in the report are the complete ones.
 *
 * 12. **BB-G1 DOES NOT FIRE, AND THE REASON IS RECORDED RATHER THAN ROUTED
 *    ROUND.** `conceptFamily('counting-to-50-and-tens')` returns itself: there is
 *    no `meeting-` prefix to strip and the id ends in a word, not a magnitude,
 *    so none of the ledger's suffix rules bite. A1, A2 and A9 all reduce to
 *    `counting`, which does not match, so `priorSameFamily` is empty and §6.13
 *    never asks for a `deepeningDelta` — on a week that is plainly a fourth pass
 *    over counting. Three earlier weeks have written this gap up from three
 *    different sides — compound ids, the `meeting-` prefix, outright synonyms.
 *    Here is a fourth side of it: **peeling suffixes off an id will never reveal
 *    that "counting to 50 and tens" and "counting 11–20" name the same verb.**
 *    No delta is declared, because the gate is the contract and inventing one to
 *    satisfy it would paper over the ledger's gap instead of reporting it. The
 *    advance over A9 and A10 is written out in `isomorphNotes` and in the
 *    grown-ups' strip, where a reader will actually meet it.
 *
 * 13. **WHAT THE SWEEP SAYS, INCLUDING THE TWO NUMBERS THAT ARE MEANT TO BE
 *    HIGH AND THE ONE THAT IS A KNOWN COST OF THE FORM.** Over eighteen thousand
 *    carded draws the truth is the lowest number on the page 33.4% of the time,
 *    the middle 33.3% and the highest 33.3%, with every one of the thirty slots
 *    inside 29.3–38.3% and the first card correct on 29.5–36.5%. The two
 *    reflexes this week is built against — say how many towers, say how many are
 *    loose — score 16.7% and 0.0%, both under a third; and the rule the week
 *    TEACHES, recomputed from each picture and question by an independent solver
 *    rather than read back off the key, is correct on 100.0% of all eighteen
 *    thousand, which is the check that the pages are learnable and not merely
 *    unguessable. Three further numbers are disclosed rather than buried:
 *      · **Counting only ONE of the two piles and guessing between whatever
 *        cards survive scores 77.8% (towers) and 72.2% (loose) on the
 *        discrimination.** That is arithmetic, not a leak: on a three-card
 *        place-value page carrying the swap, the swap is eliminated by EITHER
 *        count, so one half of the picture must always be worth more than
 *        chance. It is partial credit for partial mastery. What could be fixed
 *        was the asymmetry — measured at 76.1% against 52.4% before the third
 *        card's KIND was drawn rather than taken, 77.7% against 72.3% after —
 *        and what removes the shortcut outright is the Day-5 match, measured at
 *        50.0% and 50.0%.
 *      · **Reversing the number the puppet said scores 100%.** Every
 *        error-analysis page that states its slip hands the truth to a child who
 *        knows the slip, and a digit reversal is its own inverse, so nothing
 *        avoids this; A10 shipped the same shape and recorded it. Executing it
 *        needs a two-digit numeral read and the leading mark understood, which
 *        is the week's own content — so it is mastery arriving early on a page
 *        that teaches, and that page carries no mastery slot. What WAS fixed is
 *        the range: see `PUPPET_CELLS`.
 *      · **Answering the whole amount whatever was asked scores 47.0%**, because
 *        fourteen of the thirty slots really do key it. It is not a reflex —
 *        producing it means composing ten times the towers with the loose ones —
 *        but it is the shape of "answers the other question", which is why that
 *        habit has a mistakeBank entry and why the value is never offered on the
 *        thirteen slots where it is wrong.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  countArrangement,
  countByTens,
  howManyChoice,
  neighbourNumber,
  tenFrameEmpty,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsParam, counterGroups, counters } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn per item. No line below writes one of these in by hand (kit §F.3). */
const FOLK = ['Amaru', 'Delphi', 'Elke', 'Ilse', 'Naya', 'Orin', 'Sorrel', 'Yusra'] as const;

/**
 * A different person on every page that names one.
 *
 * Left to `r.pick` the same child turns up in two or three of Day 4's stories
 * often enough to make the day read as one anecdote retold, and nothing in the
 * battery would ever say so — a name is not an operand, so it never reaches a
 * surface signature. The repair is to spend a single draw on where in the pool
 * to start and then step through it, which keeps the stream length fixed and
 * the pack reproducible (L19). Eight names against five naming pages means a
 * repeat is never forced on it.
 */
function someone(r: Rng, guard: TupleGuard): string {
  const entry = FOLK.indexOf(r.pick(FOLK));
  for (let step = 0; step < FOLK.length; step++) {
    const name = FOLK[(entry + step) % FOLK.length];
    if (!guard.taken(`a22:folk|${name}`)) {
      guard.add(`a22:folk|${name}`);
      return name;
    }
  }
  return FOLK[entry];
}

/** How tall a tower is, and therefore how much one mark at the front is worth. */
const TEN = 10;
/** Towers beside a loose pile: four is the most that leaves room under fifty. */
const T_LO = 1;
const T_HI = 4;
/** Loose blocks: one to nine, because a tenth would have made another tower. */
const O_LO = 1;
const O_HI = 9;
/** Towers with nothing loose — the skip-count page. Two to five, and fifty caps it. */
const K_LO = 2;
const K_HI = 5;

// ---------------------------------------------------------------------------
// TEN WORDS, COUNTED THE WAY THE BUILD COUNTS THEM
//
// There are two ceilings in play and they do not measure the same object. The
// family's `ask()` weighs a whole prompt, so a prompt of two nine-word
// sentences clears it and a hint is never weighed at all. The build's
// readability pass weighs SENTENCES, one at a time, across everything a child
// meets. That is the ceiling that can fail a build, so it is the one reproduced
// here — same split, same word test — and every line this file authors is put
// through it, prompts and hints and prose alike. An eleventh word is therefore
// a load-time or draw-time crash rather than a review note.
//
// Accessible names are exempt by design. That string stands IN PLACE of the
// drawing for a child who cannot see it, and shortening it means describing
// less of the picture. It answers to a harder rule instead (`alt`, below).
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A22: band-A sentence runs to ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
    }
  }
  return text;
}

/** The a01 prompt shape: a bracket nobody sees, carrying the surface signature, then the spoken question. */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${say(question)}`;
}

/** The help ladder. Word-counted, and kept role-based so it reads the same at every seed. */
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
    throw new Error(`A22 alt: a digit is spoken ahead of the question in "${text}"`);
  }
  const hit = SPOKEN_NUMBER.exec(text);
  if (hit) {
    throw new Error(`A22 alt: the number word "${hit[0]}" is spoken ahead of the question in "${text}"`);
  }
  return text;
}

/**
 * The week's one picture, named by shape alone.
 *
 * `many` is whether more than one tower is standing and `loose` is whether
 * anything failed to make a tower — both are facts about the LAYOUT, which is
 * what an accessible name is for, and neither is a count. The height of a tower
 * is exactly what cannot be said here (disclosure 9).
 */
function towerAlt(noun: string, many: boolean, loose: boolean): string {
  if (many) {
    return loose
      ? alt(`towers of ${noun} standing in a line, with loose ones beside them`)
      : alt(`towers of ${noun} standing in a line, all the same height`);
  }
  return loose
    ? alt(`a tower of ${noun} standing alone, with loose ones beside it`)
    : alt(`a tower of ${noun} standing alone`);
}

/** Nothing gathered, nothing standing — where a bundling page begins. */
function heapAlt(noun: string): string {
  return alt(`${noun} lying loose across a mat, none of them gathered together`);
}

/** Two heaps of the same thing, set apart — the puzzle's picture. */
function twoHeapsAlt(noun: string): string {
  return alt(`${noun} lying in a heap, and more of them in a heap further along`);
}

/**
 * THE SAME RULE AGAIN, THIS TIME WHERE THE STRING ACTUALLY ARRIVES.
 *
 * Gating the alts this file writes covers eight of the week's thirteen
 * generators. The other five build their pictures inside `lib/`, and one of them
 * builds a name with the word "ten" in it. Since a week may not reach into the
 * library, the only place left to catch it is the moment the draft comes back —
 * so every generator, local and borrowed, is wrapped and the check throws rather
 * than warns. That turns the rule from something the author meant to do into
 * something the week cannot be built without.
 */
function spokenSafe(base: ItemGen, who: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (draft.figure) {
      try {
        alt(draft.figure.alt);
      } catch (e) {
        throw new Error(`A22 spokenSafe(${who}): ${(e as Error).message}`);
      }
    }
    return draft;
  };
}

/**
 * Swap out a borrowed generator's spoken name without touching anything else.
 *
 * Exactly one property is rebuilt. The drawn quantities, the stored params and
 * the figure's own assertion all come through untouched, so the picture audit
 * proves precisely what it proved before the swap. Reached for only when the
 * library says a number out loud (disclosure 9).
 */
function withPlainAlt(base: ItemGen, spoken: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.figure) {
      throw new Error('A22 withPlainAlt: this generator emits no figure, so it has no spoken name to swap');
    }
    return { ...draft, figure: { ...draft.figure, alt: alt(spoken) } };
  };
}

/**
 * Stamp a page from an earlier week as this week's way in.
 *
 * The band asks for no particular number of warm-up formats, so nothing forces
 * these four onto the days; each is here because the week cannot be built on
 * top of anything else. A teen collection counted loose (A9) is the
 * amount that a tower is about to be made out of. The empty cells of a
 * full-size frame (A13) is ten minus what is there, which is precisely the
 * arithmetic of finishing a tower. The next number on a path (A6) is the rote
 * spine that skip counting rides on. And a small set named by its numeral (A4)
 * is one mark standing for one count, which is the thing this week doubles.
 * Each keeps the ladder its own week gave it. A page that faces backwards ought
 * to sound like the week it faces, and retrieval sits outside the dedup anyway.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// WHAT EACH SLOT MAY DRAW, AND THEREFORE WHAT IT MAY OFFER (disclosure 7)
// ===========================================================================

function span(lo: number, hi: number): number[] {
  const out: number[] = [];
  for (let v = lo; v <= hi; v++) out.push(v);
  return out;
}

interface Cell {
  t: number;
  o: number;
}

/** Every towers-and-loose picture the apparatus can draw under fifty. */
const ALL_CELLS: Cell[] = span(T_LO, T_HI).flatMap((t) => span(O_LO, O_HI).map((o) => ({ t, o })));

/** The skip-count page: towers only, nothing left over. */
const TOWER_CELLS = span(K_LO, K_HI);
const TOWER_KEYS: ReadonlySet<number> = new Set(TOWER_CELLS.map((k) => TEN * k));

/** How many tens — the key is the tower count itself. */
const TENS_CELLS = ALL_CELLS.filter((c) => c.o !== c.t);
const TENS_KEYS: ReadonlySet<number> = new Set(TENS_CELLS.map((c) => c.t));

/**
 * Finishing a tower (disclosure 2). A loose count of five is barred because ten
 * minus five is five, so the loose-count reflex would be right; a cell whose
 * tower count equals ten minus its loose count is barred because the
 * tower-count reflex would be. What is left is the one slot in the week no
 * reading habit reaches.
 */
const FILL_CELLS = ALL_CELLS.filter((c) => c.o !== 5 && c.t !== TEN - c.o && c.o !== c.t);
const FILL_KEYS: ReadonlySet<number> = new Set(FILL_CELLS.map((c) => TEN - c.o));

/**
 * The discrimination's cells: both marks one to four and different, so the
 * swapped numeral is a value this slot itself keys on some other draw.
 */
const NUMERAL_CELLS = ALL_CELLS.filter((c) => c.o <= T_HI && c.o !== c.t);
const NUMERAL_KEYS: ReadonlySet<number> = new Set(NUMERAL_CELLS.map((c) => TEN * c.t + c.o));

/**
 * Whole amounts — the button story and the puppet both key one of these.
 *
 * Their cards are honest near-misses of the same picture rather than the nearest
 * members of the key set, because at two digits the two are not the same thing:
 * nineteen's nearest neighbour upwards is twenty-one, which no single slip of
 * the eye produces. So a cell only stays if it can still find TWO near-misses
 * inside what is left, and the filter is run to a fixed point — dropping a cell
 * takes a card away from its neighbours, and a card no draw can key is exactly
 * the L38 defect this is guarding against.
 */
function settleWholeCells(seed: readonly Cell[]): Cell[] {
  let cells = [...seed];
  for (let pass = 0; pass < 8; pass++) {
    const keys = new Set(cells.map((c) => TEN * c.t + c.o));
    const kept = cells.filter((c) => nearMisses(c.t, c.o, keys).length >= 2);
    if (kept.length === cells.length) return kept;
    cells = kept;
  }
  throw new Error('A22: the whole-amount cells never settled');
}
const WHOLE_CELLS = settleWholeCells(ALL_CELLS.filter((c) => c.o !== c.t));
const WHOLE_KEYS: ReadonlySet<number> = new Set(WHOLE_CELLS.map((c) => TEN * c.t + c.o));
const wholePool = (key: number): number[] => nearMisses(Math.floor(key / TEN), key % TEN, WHOLE_KEYS);

/** The Day-5 match, where both counts have to be read (disclosure 5). */
const MATCH_CELLS = ALL_CELLS;
const MATCH_KEYS: ReadonlySet<number> = new Set(MATCH_CELLS.map((c) => TEN * c.t + c.o));

/** Warm-up key sets, each the image of its own library draw range. */
const HEAP_KEYS: ReadonlySet<number> = new Set(span(11, 20));
const EMPTY_KEYS: ReadonlySet<number> = new Set(span(1, 9));
const NEXT_KEYS: ReadonlySet<number> = new Set(span(7, 10));
const SMALL_KEYS: ReadonlySet<number> = new Set(span(6, 10));

const swapOf = (n: number): number => TEN * (n % TEN) + Math.floor(n / TEN);

/**
 * The honest near-misses of a two-digit picture: one tower too many or too few,
 * one loose block too many or too few. Kept to values the slot itself keys.
 */
function nearMisses(t: number, o: number, keys: ReadonlySet<number>): number[] {
  const n = TEN * t + o;
  return [TEN * (t - 1) + o, TEN * (t + 1) + o, n - 1, n + 1].filter((v) => v !== n && keys.has(v));
}

/**
 * The same list with a two-block miscount added either side.
 *
 * Only the puppet needs it. Its cells are the discrimination's twelve — see
 * `PUPPET_CELLS` for why — and twelve cells with one-step misses alone cannot
 * spread the answer's rank evenly: five of them can only ever sit in one
 * position. Miscounting a loose pile by two is as honest a slip as miscounting
 * it by one (the family's own `puppetSlip` offers both), and it opens the
 * positions that were shut.
 */
function nearMissesWide(t: number, o: number, keys: ReadonlySet<number>): number[] {
  const n = TEN * t + o;
  return [TEN * (t - 1) + o, TEN * (t + 1) + o, n - 2, n - 1, n + 1, n + 2].filter((v) => v !== n && keys.has(v));
}

/** The nearest members of a key set either side of the truth, minus anything barred. */
function nearest(key: number, keys: ReadonlySet<number>, barred: ReadonlySet<number>): number[] {
  const sorted = [...keys].filter((v) => v !== key && !barred.has(v)).sort((a, b) => a - b);
  return [...sorted.filter((v) => v < key).slice(-2), ...sorted.filter((v) => v > key).slice(0, 2)];
}

const NOTHING_BARRED: ReadonlySet<number> = new Set<number>();

// ===========================================================================
// WHICH SEAT THE TRUTH TAKES (disclosure 6)
// ===========================================================================

const SEAT_UNITS = 1000;
type Seats = readonly [number, number, number];
type SeatsOpen = [boolean, boolean, boolean];

/** A key can only take a seat its own pool can furnish: two higher cards, one of each, or two lower. */
function seatsFromPool(key: number, pool: readonly number[]): SeatsOpen {
  let below = 0;
  let above = 0;
  for (const v of pool) {
    if (v < key) below += 1;
    else if (v > key) above += 1;
  }
  return [above >= 2, below >= 1 && above >= 1, below >= 2];
}

/**
 * Weights per key, fitted so that averaged across the slot no seat is favoured.
 *
 * A key per row, a seat per column. Every row opens spread evenly across the
 * seats that key can physically take; then the columns are scaled until their
 * means sit on a third and the rows renormalised back into probabilities, and
 * those two moves alternate until neither margin moves. When no arrangement can
 * reach a flat third the iteration will not settle, the check underneath it
 * fails, and the file does not load — which is the whole reason it happens at
 * load time rather than turning up as a tilt in a report a week later.
 */
function seatTable(keys: readonly number[], openOf: (key: number) => SeatsOpen, who: string): ReadonlyMap<number, Seats> {
  const open = keys.map(openOf);
  open.forEach((row, i) => {
    if (!row.some(Boolean)) {
      throw new Error(`A22 seatTable(${who}): a key of ${String(keys[i])} can sit nowhere among three cards`);
    }
  });
  let rows = open.map((row) => {
    const live = row.filter(Boolean).length;
    return row.map((ok) => (ok ? 1 / live : 0));
  });
  for (let pass = 0; pass < 600; pass++) {
    const mean = [0, 1, 2].map((j) => rows.reduce((acc, row) => acc + row[j], 0) / keys.length);
    rows = rows.map((row) => {
      const lifted = row.map((v, j) => (mean[j] > 1e-12 ? v / mean[j] : 0));
      const total = lifted.reduce((a, b) => a + b, 0);
      if (total < 1e-12) throw new Error(`A22 seatTable(${who}): a key lost every seat during the fit`);
      return lifted.map((v) => v / total);
    });
  }
  for (const j of [0, 1, 2]) {
    const share = rows.reduce((acc, row) => acc + row[j], 0) / keys.length;
    if (Math.abs(share - 1 / 3) > 0.005) {
      throw new Error(`A22 seatTable(${who}): seat ${String(j + 1)} settles at ${(share * 100).toFixed(1)}%, not a flat third`);
    }
  }
  // Rounded by largest remainder so the integer weights still add to the
  // denominator, and so a seat the key could never occupy keeps a hard zero.
  const table = new Map<number, Seats>();
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

function seatDraw(r: Rng, table: ReadonlyMap<number, Seats>, key: number, who: string): 0 | 1 | 2 {
  const w = table.get(key);
  if (!w) throw new Error(`A22 seatDraw(${who}): no seat weights for a key of ${String(key)}`);
  const t = r.int(0, SEAT_UNITS - 1);
  if (t < w[0]) return 0;
  if (t < w[0] + w[1]) return 1;
  return 2;
}

// ===========================================================================
// EVERY WRONG CARD ACCOUNTED FOR, IN THE LANGUAGE OF ITS OWN DRAWING
// ===========================================================================

interface Card {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
}

/**
 * Where these end up is a teacher's report, never a page — what the child sees
 * is one numeral on a button — so nothing here is word-capped. `over` explains a
 * number that overshot the drawing and `under` one that fell short of it, and
 * both are computed from the VALUE on the card. Deriving them from the branch
 * that chose the card instead lets an explanation quietly stop describing the
 * number it is printed beside.
 */
interface Voice {
  over: (gap: number) => string;
  under: (gap: number) => string;
}

const gapWord = (k: number): string => numberWords(k);

/**
 * The skip count moves a whole tower at a time, so its gaps are whole tens and
 * the account is told in towers rather than in blocks.
 */
const SKIP_VOICE: Voice = {
  over: (k) => `${gapWord(k / TEN)} tower${k === TEN ? '' : 's'} too many in the chant: the number words carried on after the last stack had been touched.`,
  under: (k) => `${gapWord(k / TEN)} tower${k === TEN ? '' : 's'} short in the chant: the number words ran out while a stack was still standing unread.`,
};

const TENS_VOICE: Voice = {
  over: (k) => `${gapWord(k)} more group${k === 1 ? '' : 's'} than there are towers: the loose pile was counted as though it were finished.`,
  under: (k) => `${gapWord(k)} fewer group${k === 1 ? '' : 's'} than there are towers: a stack was passed over while the eye was on the loose ones.`,
};

const FILL_VOICE: Voice = {
  over: (k) => `${gapWord(k)} past what the tower still needs: the count of the gap set off from the wrong block and ran long.`,
  under: (k) => `${gapWord(k)} short of what the tower still needs: the loose pile was read as fuller than it is, so less was asked for.`,
};

/**
 * A whole-amount card is one tower out or one loose block out, so the gap says
 * which: a step of ten is a stack, anything smaller is the pile at the end.
 */
const WHOLE_VOICE: Voice = {
  over: (k) =>
    k === TEN
      ? 'A whole tower counted twice, so the total runs a full stack past what is standing there.'
      : `${gapWord(k)} past what the blocks come to: the pile at the end was read as holding more than it does.`,
  under: (k) =>
    k === TEN
      ? 'A whole tower left out of the total, so the count is a full stack short of what is standing there.'
      : `${gapWord(k)} short of what the blocks come to: a loose block at the end was passed by without a number word.`,
};

const PLAIN_VOICE: Voice = {
  over: (k) => `A count that gained ${gapWord(k)} somewhere: a thing in the group answered to a number word it had already used.`,
  under: (k) => `A count that lost ${gapWord(k)} somewhere: a thing in the group was passed by without a number word of its own.`,
};

const PATH_VOICE: Voice = {
  over: (k) => `${gapWord(k)} too far along the path: the step was taken and then taken again before anything was said.`,
  under: (k) => `${gapWord(k)} short along the path: the number under the finger was reported instead of the one after it.`,
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
 * Deal three numbers, all of them things this slot answers on some draw, with
 * the truth in the seat it was already given.
 *
 * No list is authored anywhere in this file. The candidates come out of the
 * slot's own key set, which means a child who learns to strike out whichever
 * number "could not possibly be it" learns nothing and loses a card. Order of
 * operations matters as much as the values: the seat is fixed first
 * (disclosure 6) and the two companions are picked to satisfy it, so choosing
 * them can never quietly move the answer's rank.
 */
function threeCards(
  r: Rng,
  key: number,
  pool: readonly number[],
  keys: ReadonlySet<number>,
  seats: ReadonlyMap<number, Seats>,
  why: (v: number, key: number) => Card,
  who: string,
): { choices: ReturnType<typeof makeChoices>['choices']; correctKey: string } {
  const live = [...new Set(pool)].filter((v) => v !== key);
  for (const v of live) {
    if (!keys.has(v)) throw new Error(`A22 threeCards(${who}): ${String(v)} is outside the slot's own key set`);
  }
  const below = live.filter((v) => v < key);
  const above = live.filter((v) => v > key);
  const seat = seatDraw(r, seats, key, who);
  const twoOf = (from: number[]) => (from.length <= 2 ? [...from] : r.shuffle([...from]).slice(0, 2));
  const oneOf = (from: number[]) => (from.length === 1 ? from[0] : r.pick(from));
  const others = seat === 0 ? twoOf(above) : seat === 2 ? twoOf(below) : [oneOf(below), oneOf(above)];
  if (others.length !== 2 || new Set(others).size !== 2) {
    throw new Error(`A22 threeCards(${who}): a key of ${String(key)} could not find two honest cards`);
  }
  const shown = [key, ...others].sort((a, b) => a - b);
  if (shown.indexOf(key) !== seat) {
    throw new Error(
      `A22 threeCards(${who}): dealt seat ${String(seat + 1)} but ${String(key)} printed at ${String(shown.indexOf(key) + 1)} of ${shown.join('/')}`,
    );
  }
  return makeChoices(r, String(key), others.map((v) => why(v, key)));
}

/** How much a drawing really contains — the quantity the key is held against below. */
function figureHolds(draft: ItemDraft): number | null {
  const fig = draft.figure;
  if (!fig) return null;
  if (fig.type === 'ten-frame') return fig.params.filled;
  if (fig.type === 'counters') return fig.params.groups.reduce((acc, g) => acc + g.count, 0);
  return null;
}

interface CardSpec {
  /** Second derivation of the answer, from the stored params alone (disclosure 10). */
  keyOf: (params: Record<string, unknown>) => number;
  keys: ReadonlySet<number>;
  seats: ReadonlyMap<number, Seats>;
  poolOf: (key: number) => number[];
  why: (v: number, key: number) => Card;
  tags: ErrorTag[];
  /** The count the drawing has to contain if that key is right. Omitted where the key cannot rebuild it. */
  drawn?: (key: number) => number;
  who: string;
}

/**
 * Give a numeric page the buttons band A needs, and put back the audit that
 * doing so switches off.
 *
 * Three things then have to agree: the answer the generator keyed, the answer a
 * function in THIS file recovers from the stored params, and the amount the
 * drawing contains. Any two of them parting company is a crash on every seed at
 * once, which is the only kind of disagreement worth having — a check that fails
 * on one seed in fifty is a check that ships.
 */
function withCards(base: ItemGen, spec: CardSpec): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const params = draft.generator?.params;
    if (!params) throw new Error(`A22 withCards(${spec.who}): no generator params reached this page, so nothing can be recomputed`);
    const key = spec.keyOf(params);
    const keyedAs = draft.answer.validation === 'choice-key' ? draft.choices?.find((c) => c.isCorrect)?.text : draft.answer.value;
    if (String(key) !== keyedAs) {
      throw new Error(`A22 withCards(${spec.who}): the page keyed "${String(keyedAs)}" but this week recomputes ${String(key)}`);
    }
    if (!spec.keys.has(key)) {
      throw new Error(`A22 withCards(${spec.who}): a key of ${String(key)} lies outside the slot's own key set`);
    }
    if (spec.drawn) {
      const held = figureHolds(draft);
      if (held !== spec.drawn(key)) {
        throw new Error(
          `A22 withCards(${spec.who}): the answer is ${String(key)} but the picture draws ${String(held)}, not ${String(spec.drawn(key))}`,
        );
      }
    }
    const { choices, correctKey } = threeCards(rng, key, spec.poolOf(key), spec.keys, spec.seats, spec.why, spec.who);
    return {
      ...draft,
      choices,
      answer: {
        // Whatever the generator meant by `units` belonged to a typed answer,
        // and this page no longer has one — what it has is a letter. The forms
        // the item already accepted are carried across in `acceptableForms`,
        // which is the list the picture audit measures the drawing against.
        value: correctKey,
        acceptableForms: [String(key), ...draft.answer.acceptableForms.filter((f) => f !== String(key))],
        validation: 'choice-key',
      },
      errorTags: spec.tags,
    };
  };
}

/**
 * ONE AMOUNT, ONE APPEARANCE, ACROSS A DAY'S PAGES.
 *
 * Four slots build the identical picture and print different things about it —
 * the tens count, the gap to the next tower, the numeral, the description — so
 * two of them can land on one amount and sign into different namespaces, which
 * is the L52 shape (sign what the child MEETS). What is signed here is the
 * amount the drawing contains, which is the thing the child actually sees. Capped at a fixed number of attempts, so the
 * rng stream advances by a known amount and the pack stays reproducible (L19);
 * an unbounded retry would make every later page depend on this one. Day pages
 * only — `isomorphNotes` says why the mastery forms are deliberately left out.
 */
function freshScene(base: ItemGen, tag: string): ItemGen {
  return (rng, guard, difficulty) => {
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 8 && guard.taken(`a22:${tag}|${String(figureHolds(draft))}`); k++) {
      draft = base(rng, guard, difficulty);
    }
    guard.add(`a22:${tag}|${String(figureHolds(draft))}`);
    return draft;
  };
}

const PLACE_TAGS: ErrorTag[] = ['concept-misconception', 'representation-misread'];
const COUNT_TAGS: ErrorTag[] = ['representation-misread', 'procedure-slip'];

// ===========================================================================
// The picture every core page is built on
// ===========================================================================

/** `t` towers of ten and `o` loose — one figure builder, used nine ways. */
function towerFigure(t: number, o: number, noun: string, asserts: ReturnType<typeof assertsParam>) {
  const groups = [
    ...Array.from({ length: t }, () => ({ count: TEN, noun })),
    ...(o > 0 ? [{ count: o, noun }] : []),
  ];
  return counterGroups(groups, { arrangement: 'towers', alt: towerAlt(noun, t > 1, o > 0), asserts });
}

/** The bracket, which carries the operand surface and is never shown or spoken. */
function towerScene(t: number, o: number, noun: string): string {
  return `${countNoun(t, 'towers')} of ten and ${countNoun(o, noun)} loose`;
}

/** Draw one towers-and-loose cell from a list, without a redraw loop. */
function pickCell(r: Rng, cells: readonly Cell[]): Cell {
  return cells[r.int(0, cells.length - 1)];
}

// ===========================================================================
// Local generator 1 — HOW MANY TENS (the recipe's second core form)
// ===========================================================================

/**
 * Towers and a loose pile, and the child says how many TENS are there.
 *
 * The answer is the tower count, and the picture holds one more group than that
 * — the loose pile — so "count the groups on the page" is wrong by exactly one
 * on every draw, and that one is an offered card whenever it is inside the key
 * set. That is the whole reason the loose pile is never empty here: with towers
 * alone the page would be a perceptual count of tall things, and the child would
 * never have to decide what counts as a ten.
 *
 * Registered on `d_verify_binop_v1` with the blocks that ARE in towers shared
 * into tens, so QG-11 recomputes the tower count from two quantities that are
 * both really on the page rather than reading it back off a stored answer.
 */
function howManyTens(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const { t, o } = pickCell(r, TENS_CELLS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(towerScene(t, o, noun), 'How many tens are here?'),
        figure: towerFigure(t, o, noun, assertsParam('total')),
        answer: { value: String(t), acceptableForms: [numberWords(t)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // `asks` keeps two pages that drew the same picture from reading as one
          // question to the Form-B collision check, which compares a core on
          // {templateId, params} alone (a16/a17/a18's finding).
          params: { a: TEN * t, b: TEN, op: '/', total: TEN * t + o, t, o, asks: 'tens' },
          seed: r.uint(),
        },
        hintLadder: rungs('Only a finished tower is a ten.', 'Count the towers and leave the loose pile alone.'),
        errorTags: PLACE_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'count-the-tens' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 2 — FINISH THE TOWER (the slot no reading habit reaches)
// ===========================================================================

/**
 * The same towers, and the child says how many more blocks would make one more
 * tower.
 *
 * Disclosure 2 records why this page exists and which two cells are barred from
 * it. What it adds pedagogically is the reason bundling works at all: the loose
 * pile is not just a remainder, it is a tower that has not happened yet, and
 * knowing how far off it is turns "some left over" into a quantity.
 *
 * `d_verify_binop_v1` takes ten minus the loose count — both numbers structural
 * facts of the drawing, one the tower's height and one a group the picture
 * holds.
 */
function fillTheNextTower(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const { t, o } = pickCell(r, FILL_CELLS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(towerScene(t, o, noun), 'How many more would finish another tower?'),
        figure: towerFigure(t, o, noun, assertsParam('total')),
        answer: { value: String(TEN - o), acceptableForms: [numberWords(TEN - o)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: TEN, b: o, op: '-', total: TEN * t + o, t, o, asks: 'fill' },
          seed: r.uint(),
        },
        hintLadder: rungs('Stand the loose pile beside a finished tower.', 'Count the space it has not reached yet.'),
        errorTags: ['concept-misconception', 'fact-recall'],
        authorMeta: { stepCount: 1, cognitiveOp: 'finish-a-ten', usesPriorSkill: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — WHICH NUMERAL SAYS IT (24 vs 42, the week's trap)
// ===========================================================================

/** Which seats a discrimination cell can occupy, given that the swap is always shown. */
function numeralSeatsOpen(t: number, o: number): SeatsOpen {
  const n = TEN * t + o;
  const swap = swapOf(n);
  const thirds = nearMisses(t, o, NUMERAL_KEYS).filter((v) => v !== swap);
  const anyAbove = thirds.some((v) => v > n);
  const anyBelow = thirds.some((v) => v < n);
  const swapAbove = swap > n;
  return [swapAbove && anyAbove, swapAbove ? anyBelow : anyAbove, !swapAbove && anyBelow];
}

/**
 * A line of towers with a loose pile, and three numerals — one of them the same
 * two marks the other way round.
 *
 * The recipe's cell, and the reason the week exists. A child who writes the
 * marks in the order the eye met them picks the swap; a child who knows the
 * front mark counts the towers picks the truth; and there is nothing on the page
 * — no size, no shape, no position — that separates them, because the swap is
 * always present, is a numeral this slot really keys on other draws, and stands
 * above the truth exactly as often as below it (disclosure 3).
 *
 * The third card is an honest near-miss of the same picture: one tower too many
 * or too few, or one loose block too many or too few. It is drawn LAST, on the
 * side the dealt seat requires, so it completes the rank rather than deciding
 * it.
 */
function whichNumeralSaysIt(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const { t, o } = pickCell(r, NUMERAL_CELLS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const n = TEN * t + o;
      const swap = swapOf(n);
      const seat = seatDraw(r, NUMERAL_SEATS, n, 'the numeral');
      const swapAbove = swap > n;
      const wantAbove = seat === 0 || (seat === 1 && !swapAbove);
      const options = nearMisses(t, o, NUMERAL_KEYS)
        .filter((v) => v !== swap)
        .filter((v) => (wantAbove ? v > n : v < n));
      if (options.length === 0) {
        throw new Error(`A22 whichNumeralSaysIt: ${String(n)} has no honest card on the side seat ${String(seat + 1)} needs`);
      }
      // WHICH PART THE THIRD CARD MISSES ON IS DRAWN, NOT LEFT TO THE POOL.
      //
      // Measured before this line existed: a child who counts only the towers
      // and guesses between whatever is left scored 76.1%, against 52.4% for a
      // child who counts only the loose ones — because a side of the truth
      // usually offers a tower-miss and only sometimes a loose-miss, so the
      // pool's own shape decided which half of the picture paid. On a three-card
      // place-value page with the swap present, one of the two half-strategies
      // must score 100% and the other 50% (the swap differs in BOTH parts, so it
      // is eliminated by either count); what can be fixed is that neither part
      // is privileged. Drawing the kind evenly puts both halves at the same
      // number. The Day-5 match is the page that removes the shortcut outright.
      const towerMiss = options.filter((v) => Math.abs(v - n) === TEN);
      const looseMiss = options.filter((v) => Math.abs(v - n) === 1);
      const kind = towerMiss.length > 0 && looseMiss.length > 0 ? (r.chance(0.5) ? towerMiss : looseMiss) : towerMiss.length > 0 ? towerMiss : looseMiss;
      const third = kind.length === 1 ? kind[0] : r.pick(kind);
      const shown = [n, swap, third].sort((a, b) => a - b);
      if (new Set(shown).size !== 3 || shown.indexOf(n) !== seat) {
        throw new Error(`A22 whichNumeralSaysIt: ${String(n)} printed at ${String(shown.indexOf(n) + 1)} of ${shown.join('/')} against seat ${String(seat + 1)}`);
      }
      const towerGap = Math.abs(Math.floor(third / TEN) - t);
      const { choices, correctKey } = makeChoices(r, String(n), [
        {
          text: String(swap),
          errorTag: 'concept-misconception' as ErrorTag,
          rationale:
            'The two marks of the drawing, set down in the order the eye met them rather than in the order they mean. It keys a real amount — a different line of towers with a different pile beside it — so it can never be struck out for looking odd.',
        },
        {
          text: String(third),
          errorTag: 'representation-misread' as ErrorTag,
          rationale:
            towerGap > 0
              ? `The loose pile read correctly and the towers out by ${gapWord(towerGap)}: what a finger that slides past a stack, or lands on one twice, actually produces.`
              : `The towers read correctly and the loose pile out by ${gapWord(Math.abs(third - n))}: the near-miss that a second look at the same picture settles.`,
        },
      ]);
      const draft: ItemDraft = {
        type: 'representation',
        // FOUND BY READING THE GENERATED WEEK: this question used to say "these
        // blocks" while the drawn noun was apples, flowers or leaves on three
        // draws in four. No gate can see it — the noun is not an operand, and
        // the figure agreed with the params throughout — and a page that names
        // the wrong thing is exactly what a four-year-old notices first.
        prompt: scenePrompt(towerScene(t, o, noun), 'How many in all? Tap that number.'),
        figure: towerFigure(t, o, noun, assertsParam('total')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: TEN * t, b: o, op: '+', total: n, t, o, asks: 'numeral' },
          seed: r.uint(),
        },
        hintLadder: rungs('Work out the towers, then the ones left over.', 'The mark in front belongs to the towers.'),
        errorTags: PLACE_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'read-the-place-value', isDiscrimination: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 4 — THE PUPPET, who read a true picture in a false order
// ===========================================================================

/**
 * Help-the-puppet, run on the exact slip row A22 names.
 *
 * A NAMED puppet looks at two towers and four loose blocks and reads it as
 * "forty-two". Nothing was miscounted — both piles were seen correctly — and
 * that is what makes it worth a page: the repair is not to count again but to
 * decide which pile the front mark belongs to. Disclosure 4 records that the
 * puppet's number is the registry's own digit reversal, so QG-11 checks the
 * shown slip as well as the keyed truth.
 *
 * Every §3 rule holds: somebody with a name made the slip, not "a student"; the
 * repair is a tap and not a sentence; nothing on the page calls anything wrong;
 * and the true value comes back out of the registry rather than off this file's
 * word. What the puppet said is kept off its own buttons — and because a page
 * that announces two of its three numbers is worth less than a full page, it
 * runs on Day 3 and never certifies.
 */
function puppetReadsItBackwards(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const { t, o } = pickCell(r, PUPPET_CELLS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const n = TEN * t + o;
      const swap = swapOf(n);
      // The puppet's own number is barred from its cards. It never turns up in
      // the miss pool anyway — a digit reversal is a tower AND a pile away, not
      // one or the other — so the filter is a guarantee rather than a working
      // part, and it stays so the next author need not re-derive it.
      const { choices, correctKey } = threeCards(
        r,
        n,
        nearMissesWide(t, o, PUPPET_KEYS).filter((v) => v !== swap),
        PUPPET_KEYS,
        PUPPET_SEATS,
        voiced(WHOLE_VOICE, 'representation-misread'),
        'the puppet',
      );
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(
          towerScene(t, o, noun),
          `${puppet} reads these as ${String(swap)}. Tap what they really show.`,
        ),
        figure: towerFigure(t, o, noun, assertsParam('n')),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_verify_teen_write_v1', params: { n, t, o }, seed: r.uint() },
        hintLadder: rungs('Put a hand over the loose pile.', 'Say the towers first, then take the hand away.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-order-fix', isErrorAnalysis: true },
      };
      if (figureHolds(draft) !== n) {
        throw new Error(`A22 puppetReadsItBackwards: the towers draw ${String(figureHolds(draft))} against a truth of ${String(n)}`);
      }
      return draft;
    });
}

// ===========================================================================
// Local generator 5 — THE TENS-AND-MORE MATCH (Day 5)
// ===========================================================================

/** "3 tens and 4 more" — both counts named, in the order the marks are written. */
function partsCard(t: number, o: number): string {
  return `${countNoun(t, 'tens')} and ${String(o)} more`;
}

/** Which seats a match cell can take, given that one card misses on each part. */
function matchSeatsOpen(t: number, o: number): SeatsOpen {
  const upT = t < T_HI;
  const downT = t > T_LO;
  const upO = o < O_HI;
  const downO = o > O_LO;
  return [upT && upO, (upT && downO) || (downT && upO), downT && downO];
}

/**
 * The picture, and three descriptions of it — exactly one true.
 *
 * Disclosure 5 records the construction and why it is not the discrimination
 * again: one wrong card has the loose count right and the tower count out by
 * one, the other has the tower count right and the loose count out by one, so
 * reading half the picture leaves two cards standing whichever half is read.
 * That is the only page in the week where BOTH counts must be produced before
 * anything can be tapped, which is why it carries the Day-5 signature.
 *
 * Registered on `d_verify_binop_v1` as ten times the towers plus the loose ones
 * — the place-value sum itself — with the numeral in `acceptableForms` so QG-11
 * can hold the keyed card against a recomputed value.
 */
function tensAndMoreMatch(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const { t, o } = pickCell(r, MATCH_CELLS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const n = TEN * t + o;
      const seat = seatDraw(r, MATCH_SEATS, n, 'the match');
      // Seat 0 wants both wrong cards above the truth, seat 2 both below, seat 1
      // one of each — and the mixed seat picks which part goes high by a coin
      // wherever both arrangements are legal, so the tens card is not always the
      // one on the same side.
      const towerHighLegal = t < T_HI && o > O_LO;
      const looseHighLegal = t > T_LO && o < O_HI;
      const towerUp =
        seat === 0 ? true : seat === 2 ? false : towerHighLegal && looseHighLegal ? r.chance(0.5) : towerHighLegal;
      const looseUp = seat === 0 ? true : seat === 2 ? false : !towerUp;
      const towerMiss = { t: t + (towerUp ? 1 : -1), o };
      const looseMiss = { t, o: o + (looseUp ? 1 : -1) };
      for (const cell of [towerMiss, looseMiss]) {
        if (!MATCH_KEYS.has(TEN * cell.t + cell.o)) {
          throw new Error(`A22 tensAndMoreMatch: a card of ${String(TEN * cell.t + cell.o)} is outside what this page can key`);
        }
      }
      const shown = [n, TEN * towerMiss.t + towerMiss.o, TEN * looseMiss.t + looseMiss.o].sort((a, b) => a - b);
      if (new Set(shown).size !== 3 || shown.indexOf(n) !== seat) {
        throw new Error(`A22 tensAndMoreMatch: ${String(n)} printed at ${String(shown.indexOf(n) + 1)} of ${shown.join('/')} against seat ${String(seat + 1)}`);
      }
      const { choices, correctKey } = makeChoices(r, partsCard(t, o), [
        {
          text: partsCard(towerMiss.t, towerMiss.o),
          errorTag: 'representation-misread' as ErrorTag,
          rationale: `The loose ones read correctly and the towers out by one the ${towerUp ? 'high' : 'low'} way — so a child who counts only the small pile and stops has no reason to reject it.`,
        },
        {
          text: partsCard(looseMiss.t, looseMiss.o),
          errorTag: 'procedure-slip' as ErrorTag,
          rationale: `The towers read correctly and the loose ones out by one the ${looseUp ? 'high' : 'low'} way — the mirror card, so counting only the towers leaves this one standing too.`,
        },
      ]);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(towerScene(t, o, noun), 'Tap the card that tells both parts.'),
        figure: towerFigure(t, o, noun, assertsParam('total')),
        choices,
        answer: { value: correctKey, acceptableForms: [partsCard(t, o), String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          params: { a: TEN * t, b: o, op: '+', total: n, t, o, asks: 'match' },
          seed: r.uint(),
        },
        hintLadder: rungs('Each card claims two things at once.', 'Turn a card down if either claim is off.'),
        errorTags: COUNT_TAGS,
        authorMeta: { stepCount: 1, cognitiveOp: 'match-both-parts' },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 6 — the Day-4 real-world pages
// ===========================================================================

/**
 * At this band a word problem is one picture inside one real situation; the
 * multi-step row is switched off because a two-step here would be a D-week item
 * with the numbers made smaller, not a harder version of anything. The family
 * cannot supply these — every word problem it owns joins two sets or takes one
 * away, and neither has been taught this week — so all three are written here.
 *
 * Each asks a DIFFERENT question of the same apparatus, which is what keeps Day
 * 4 from being one page three times: the buttons ask what the whole thing comes
 * to, the shells ask how far off the next ten is, and the stars ask how many
 * tens are finished. Their places are named and not drawn, following the band's
 * standing practice; nothing is claimed that the picture does not hold.
 */
interface StoryFrame {
  line: (name: string, noun: string) => string;
  ask: string;
  noun: string;
  /** 'whole' keys the amount, 'fill' what the next ten still needs, 'tens' the tower count. */
  asks: 'whole' | 'fill' | 'tens';
  voice: Voice;
  ladder: [string, string];
}

type StoryKind = 'buttons' | 'shells' | 'stars';

/**
 * Each frame is an ACT rather than a container, and that is deliberate: the
 * picture is a line of stacks, so a story about dropping things into a jar would
 * describe a scene nobody drew (the L27 class, caught by reading the generated
 * week — the first draft had shells going into a jar and stacks coming out).
 * What the sentence names, the drawing holds.
 */
const STORY_FRAMES: Record<StoryKind, StoryFrame> = {
  buttons: {
    line: (name, noun) => `${name} stacks ${unitFor(2, noun)} in tens.`,
    ask: 'A few are still loose. How many buttons in all?',
    noun: 'buttons',
    asks: 'whole',
    voice: WHOLE_VOICE,
    ladder: ['A finished tower needs no counting at all.', 'Skip along them, then take the small pile on.'],
  },
  shells: {
    line: (name, noun) => `${name} piles ${unitFor(2, noun)} in tens.`,
    ask: 'One pile stopped short. How many more would finish it?',
    noun: 'shells',
    asks: 'fill',
    voice: FILL_VOICE,
    ladder: ['Find the pile that never became a tower.', 'Work out what it is still waiting for.'],
  },
  stars: {
    // "on a chart in tens" was the first draft and it read against the drawing:
    // the picture is a row of standing columns, so the sentence has to name the
    // columns rather than the sheet they are stuck to.
    line: (name, noun) => `${name} sticks ${unitFor(2, noun)} in columns of ten.`,
    ask: 'How many columns are finished?',
    noun: 'stars',
    asks: 'tens',
    voice: TENS_VOICE,
    ladder: ['A pile that stopped short is not a ten.', 'Count only the ones that made it.'],
  },
};

function tensStory(which: StoryKind): ItemGen {
  const frame = STORY_FRAMES[which];
  const cells = frame.asks === 'fill' ? FILL_CELLS : frame.asks === 'tens' ? TENS_CELLS : WHOLE_CELLS;
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const { t, o } = pickCell(r, cells);
      const noun = frame.noun;
      const name = someone(r, guard);
      const key = frame.asks === 'whole' ? TEN * t + o : frame.asks === 'fill' ? TEN - o : t;
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(towerScene(t, o, noun), `${frame.line(name, noun)} ${frame.ask}`),
        figure: towerFigure(t, o, noun, assertsParam('total')),
        answer: { value: String(key), acceptableForms: [numberWords(key)], validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'd_verify_binop_v1',
          // One transform doing three jobs. `asks` is what stops the collision
          // check treating two stories that happened on the same numbers as a
          // single repeated question.
          params:
            frame.asks === 'whole'
              ? { a: TEN * t, b: o, op: '+', total: TEN * t + o, t, o, asks: which }
              : frame.asks === 'fill'
                ? { a: TEN, b: o, op: '-', total: TEN * t + o, t, o, asks: which }
                : { a: TEN * t, b: TEN, op: '/', total: TEN * t + o, t, o, asks: which },
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
// Local generator 7 — making the tens by hand, and saying what would not go
// ===========================================================================

/**
 * The catalog's own non-computational focus, done with hands: a heap that nobody
 * has grouped, and the child makes the tens out of it and says what would not go.
 *
 * Every other page in the week is handed its towers already built. Here the
 * grouping is the work, which is the half of bundling that a picture cannot do
 * for a child — and it is where "some left over" first becomes a number rather
 * than a leftover feeling.
 *
 * Marked by hand, and that is the honest call twice over. It is honest about
 * the task, because what is being judged is a heap that got sorted; and it is
 * honest about the input, because a hand-marked page renders as one large
 * acknowledgement instead of the keyboard a set-valued answer would summon for a
 * four-year-old (an open routing question, first raised by A12 and seconded by
 * A13). The number itself is still derived rather than written down: the
 * registry takes the blocks that made tens off the heap, so whoever marks it has
 * the answer in front of them.
 */
function bundleAndTell(): ItemGen {
  const HEAP_NOUNS = COUNTABLE_NOUNS.filter((n) => n !== 'blocks');
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.pick(BUNDLE_CELLS);
      const noun = r.pick(HEAP_NOUNS);
      const made = Math.floor(n / TEN);
      const over = n - TEN * made;
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(`${countNoun(n, noun)} emptied out across a mat`, 'Group them into tens. Say how many are left.'),
        figure: counters(n, noun, { arrangement: 'scattered', alt: heapAlt(noun), asserts: assertsParam('a') }),
        answer: {
          value: String(over),
          acceptableForms: [numberWords(over), `${countNoun(made, 'tens')} and ${countNoun(over, noun)} over`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'd_verify_binop_v1', params: { a: n, b: TEN * made, op: '-', asks: 'bundle' }, seed: r.uint() },
        hintLadder: rungs('Sweep them into groups of ten first.', 'The ones with no group to join are the answer.'),
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: { stepCount: 1, cognitiveOp: 'bundle-then-name-the-rest' },
      };
      return draft;
    });
}

// ===========================================================================
// One solved weight table per carded slot (disclosure 6)
// ===========================================================================

/**
 * THE PUPPET SPEAKS ITS NUMBER ALOUD, SO ITS NUMBER HAS TO BE ONE OF THIS
 * WEEK'S.
 *
 * Found by reading a generated week and not by any gate: on a picture of one
 * tower and nine loose blocks the reversal is ninety-one, and the page then
 * says "ninety-one" to a four-year-old on a week whose ceiling is fifty. The
 * arithmetic was right, the registry agreed with it, the sweep was clean, and
 * the number was simply out of the child's world. So the puppet draws from the
 * discrimination's cells, where BOTH marks run one to four and the reversal is
 * therefore another amount the same apparatus can build — at most forty-three.
 */
const PUPPET_CELLS = NUMERAL_CELLS;
const PUPPET_KEYS = NUMERAL_KEYS;

/** The bundling heap: never a whole number of tens, and inside what one group may draw. */
const BUNDLE_CELLS = span(12, 29).filter((n) => n % TEN !== 0);

const TOWER_SEATS = seatTable(
  [...TOWER_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, nearest(k, TOWER_KEYS, NOTHING_BARRED)),
  'the skip count',
);
const TENS_SEATS = seatTable(
  [...TENS_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, nearest(k, TENS_KEYS, NOTHING_BARRED)),
  'the tens count',
);
const FILL_SEATS = seatTable(
  [...FILL_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, nearest(k, FILL_KEYS, NOTHING_BARRED)),
  'the gap to the next tower',
);
const NUMERAL_SEATS = seatTable(
  NUMERAL_CELLS.map((c) => TEN * c.t + c.o).sort((a, b) => a - b),
  (n) => numeralSeatsOpen(Math.floor(n / TEN), n % TEN),
  'the numeral',
);
const MATCH_SEATS = seatTable(
  MATCH_CELLS.map((c) => TEN * c.t + c.o).sort((a, b) => a - b),
  (n) => matchSeatsOpen(Math.floor(n / TEN), n % TEN),
  'the match',
);
const WHOLE_SEATS = seatTable(
  [...WHOLE_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, wholePool(k)),
  'a whole amount',
);
const PUPPET_SEATS = seatTable(
  [...PUPPET_KEYS].sort((a, b) => a - b),
  (n) => seatsFromPool(n, nearMissesWide(Math.floor(n / TEN), n % TEN, PUPPET_KEYS).filter((v) => v !== swapOf(n))),
  'the puppet',
);
const HEAP_SEATS = seatTable(
  [...HEAP_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, nearest(k, HEAP_KEYS, NOTHING_BARRED)),
  'a loose teen',
);
const EMPTY_SEATS = seatTable(
  [...EMPTY_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, nearest(k, EMPTY_KEYS, NOTHING_BARRED)),
  'the empty cells',
);
const NEXT_SEATS = seatTable(
  [...NEXT_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, nearest(k, NEXT_KEYS, NOTHING_BARRED)),
  'the next number',
);
const SMALL_SEATS = seatTable(
  [...SMALL_KEYS].sort((a, b) => a - b),
  (k) => seatsFromPool(k, nearest(k, SMALL_KEYS, NOTHING_BARRED)),
  'a small set',
);

// ===========================================================================
// Each form, fixed to the cells it may draw and dressed in this week's language
// ===========================================================================

/**
 * CERTIFIES (mastery 01) — count by tens.
 *
 * The family's own A22 form, used as the recipe names it. Two changes are made
 * from outside `lib/` and both are disclosed: the accessible name is replaced
 * because the library's speaks a number (disclosure 9), and the cards are
 * written here because a numeric band-A page without them is handed to the
 * display layer's invented buttons (disclosure 10). The draw starts at two
 * towers rather than one: the library's scene and alt both say "towers", and a
 * single-tower draw would have a picture of one thing announced in the plural.
 * A single ten is met on the tens-count page and in the Day-1 script instead.
 */
const skipCount = spokenSafe(
  withCards(withPlainAlt(countByTens({ minTens: K_LO, maxTens: K_HI }), 'towers of blocks standing in a line, all the same height'), {
    keyOf: (p) => TEN * Number(p.k),
    keys: TOWER_KEYS,
    seats: TOWER_SEATS,
    poolOf: (k) => nearest(k, TOWER_KEYS, NOTHING_BARRED),
    why: voiced(SKIP_VOICE, 'procedure-slip'),
    tags: COUNT_TAGS,
    drawn: (k) => k,
    who: 'the skip count',
  }),
  'the skip count',
);
const skipCountDay = freshScene(skipCount, 'towers');

/** CERTIFIES (mastery 02) — how many tens. */
const tensCount = spokenSafe(
  withCards(howManyTens(), {
    keyOf: (p) => Number(p.a) / Number(p.b),
    keys: TENS_KEYS,
    seats: TENS_SEATS,
    poolOf: (k) => nearest(k, TENS_KEYS, NOTHING_BARRED),
    why: voiced(TENS_VOICE, 'concept-misconception'),
    tags: PLACE_TAGS,
    // No `drawn` check here or on any towers-and-loose page: the picture holds
    // ten times the towers PLUS the loose pile, which the key alone cannot
    // rebuild. What stands in its place is the figure's own assertion against
    // the stored total, which QG-13 proves on every seed.
    who: 'the tens count',
  }),
  'the tens count',
);
const tensCountDay = freshScene(tensCount, 'towers');

/** CERTIFIES (mastery 03) — the week's discrimination. */
const numeralChoice = spokenSafe(whichNumeralSaysIt(), 'the numeral');
const numeralChoiceDay = freshScene(numeralChoice, 'towers');

/** CERTIFIES (mastery 04) — the slot no reading habit reaches. */
const gapToTen = spokenSafe(
  withCards(fillTheNextTower(), {
    keyOf: (p) => Number(p.a) - Number(p.b),
    keys: FILL_KEYS,
    seats: FILL_SEATS,
    poolOf: (k) => nearest(k, FILL_KEYS, NOTHING_BARRED),
    why: voiced(FILL_VOICE, 'fact-recall'),
    tags: ['concept-misconception', 'fact-recall'],
    who: 'the gap to the next tower',
  }),
  'the gap to the next tower',
);
const gapToTenDay = freshScene(gapToTen, 'towers');

/** CERTIFIES (mastery 05) — the Day-5 match, where both counts must be read. */
const partsMatch = spokenSafe(tensAndMoreMatch(), 'the match');
const partsMatchDay = freshScene(partsMatch, 'towers');

const puppetPage = spokenSafe(freshScene(puppetReadsItBackwards(), 'towers'), 'the puppet');

/** CERTIFIES (mastery 06) — the transfer page, told as an act rather than an apparatus. */
function cardedStory(which: StoryKind): ItemGen {
  const frame = STORY_FRAMES[which];
  const keys = frame.asks === 'whole' ? WHOLE_KEYS : frame.asks === 'fill' ? FILL_KEYS : TENS_KEYS;
  const seats = frame.asks === 'whole' ? WHOLE_SEATS : frame.asks === 'fill' ? FILL_SEATS : TENS_SEATS;
  const poolOf = frame.asks === 'whole' ? wholePool : (k: number) => nearest(k, keys, NOTHING_BARRED);
  return spokenSafe(
    withCards(tensStory(which), {
      keyOf: (p) => (String(p.op) === '+' ? Number(p.a) + Number(p.b) : String(p.op) === '-' ? Number(p.a) - Number(p.b) : Number(p.a) / Number(p.b)),
      keys,
      seats,
      poolOf,
      why: voiced(frame.voice, 'procedure-slip'),
      tags: ['task-comprehension', 'procedure-slip'],
      who: `the ${which}`,
    }),
    `the ${which}`,
  );
}
const storyButtons = cardedStory('buttons');
const storyShells = cardedStory('shells');
const storyStars = cardedStory('stars');
const storyButtonsDay = freshScene(storyButtons, 'towers');
const storyShellsDay = freshScene(storyShells, 'towers');
const storyStarsDay = freshScene(storyStars, 'towers');

const day5Bundle = spokenSafe(bundleAndTell(), 'the heap');

// --- backward-facing pages: four earlier weeks, four formats, one per day -----

const warmLooseTeen = warmUp(
  spokenSafe(
    withCards(countArrangement({ min: 11, max: 20, arrangement: 'in two rows' }), {
      keyOf: (p) => Number(p.n),
      keys: HEAP_KEYS,
      seats: HEAP_SEATS,
      poolOf: (k) => nearest(k, HEAP_KEYS, NOTHING_BARRED),
      why: voiced(PLAIN_VOICE, 'procedure-slip'),
      tags: ['representation-misread', 'procedure-slip'],
      drawn: (k) => k,
      who: 'a loose teen',
    }),
    'a loose teen',
  ),
  9,
);

const warmEmptyCells = warmUp(
  spokenSafe(
    withCards(tenFrameEmpty({ min: 1, max: 9 }), {
      keyOf: (p) => Number(p.cap) - Number(p.filled),
      keys: EMPTY_KEYS,
      seats: EMPTY_SEATS,
      poolOf: (k) => nearest(k, EMPTY_KEYS, NOTHING_BARRED),
      why: voiced(PLAIN_VOICE, 'concept-misconception'),
      tags: ['concept-misconception', 'task-comprehension'],
      drawn: (k) => TEN - k,
      who: 'the empty cells',
    }),
    'the empty cells',
  ),
  13,
);

const warmNextNumber = warmUp(
  spokenSafe(
    withCards(neighbourNumber({ kind: 'after', min: 6, max: 9 }), {
      keyOf: (p) => Number(p.n) + 1,
      keys: NEXT_KEYS,
      seats: NEXT_SEATS,
      poolOf: (k) => nearest(k, NEXT_KEYS, NOTHING_BARRED),
      why: voiced(PATH_VOICE, 'fact-recall'),
      tags: ['fact-recall', 'concept-misconception'],
      who: 'the next number',
    }),
    'the next number',
  ),
  6,
);

const warmSmallSet = warmUp(
  spokenSafe(
    withCards(howManyChoice({ min: 6, max: 10 }), {
      keyOf: (p) => Number(p.n),
      keys: SMALL_KEYS,
      seats: SMALL_SEATS,
      poolOf: (k) => nearest(k, SMALL_KEYS, NOTHING_BARRED),
      why: voiced(PLAIN_VOICE, 'representation-misread'),
      tags: ['representation-misread', 'procedure-slip'],
      drawn: (k) => k,
      who: 'a small set',
    }),
    'a small set',
  ),
  4,
);

// ===========================================================================
// The week
// ===========================================================================

export const buildA22 = makeWeekBuilder({
  level: 'A',
  week: 22,
  conceptId: 'counting-to-50-and-tens',
  conceptName: 'Counting to 50 & tens',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [
    { level: 'A', week: 9 },
    { level: 'A', week: 10 },
  ],
  pedagogyContract: 'v2',
  // Nothing reads this at band A — the multi-step row it selects is switched
  // off in favour of the picture rule — but the kit asks every non-D blueprint
  // to name its family, and a mark that means ten because of where it is
  // standing belongs to place value rather than to arithmetic.
  conceptFamily: 'place-value',
  // §6.9 wants the declared anchor VERBATIM inside `whyBeforeHow`, which is
  // prose read aloud to a pre-reader. The recipe's label is "tens-towers", which
  // is a filing name rather than an English phrase; the object is the same one.
  conceptualAnchor: 'towers of ten',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt is spoken, never read; one question fills a page; targets are finger-sized. Build the towers with real blocks before anything happens on the screen, and let the child push the ten together with both hands - the whole idea is that a ten becomes one thing you can pick up. Count the towers out loud by tens and then carry on through the loose ones. When a number is said, ask which part of it counts towers before asking what it is. Reading the marks in the order they were seen is the expected mistake and it is a sensible one; say what it does rather than correcting it. Mascot present.',
  },
  explanation: {
    hook: say('Look at all these blocks. Push ten of them together. Now it is one tower.'),
    whyBeforeHow: say(
      'Ten blocks make one tower. So we never count those ten again. Towers of ten are quick to count. Say ten, twenty, thirty, and point. Then count the loose blocks on. A number has two marks. The front mark counts the towers. The last mark counts the loose ones. Swap the marks and the number changes.',
    ),
    script: [
      {
        say: say('Ten blocks went into this tower. It is one tower now.'),
        visual: 'A single tower of ten blocks, with nothing beside it.',
        figure: counterGroups([{ count: 10, noun: 'blocks' }], {
          arrangement: 'towers',
          alt: towerAlt('blocks', false, false),
        }),
      },
      {
        say: say('Now watch me point. Ten. Twenty. Thirty. Forty.'),
        visual: 'Four towers standing in a line, a finger moving along the tops.',
        figure: counterGroups(
          Array.from({ length: 4 }, () => ({ count: 10, noun: 'blocks' })),
          { arrangement: 'towers', alt: towerAlt('blocks', true, false) },
        ),
      },
      {
        // The two counts, side by side and both true of one picture, taught where
        // the answer is already known (disclosure 1).
        say: say('Here are two towers. Three blocks never made a tower.'),
        visual: 'Two towers with a short pile of three blocks at the end of the line.',
        figure: counterGroups(
          [{ count: 10, noun: 'blocks' }, { count: 10, noun: 'blocks' }, { count: 3, noun: 'blocks' }],
          { arrangement: 'towers', alt: towerAlt('blocks', true, true) },
        ),
      },
      {
        say: say('Towers first, always. So this one says twenty-three.'),
        visual: 'The same picture, with the tower count spoken before the loose count.',
        figure: counterGroups(
          [{ count: 10, noun: 'blocks' }, { count: 10, noun: 'blocks' }, { count: 3, noun: 'blocks' }],
          { arrangement: 'towers', alt: towerAlt('blocks', true, true) },
        ),
      },
    ],
    summary: say(
      'Count the towers by tens. Then count the loose ones on. The tower mark always goes in front.',
    ),
    vocabulary: [
      { term: 'a tower', kidGloss: 'ten blocks pushed together so they count as one' },
      { term: 'count by tens', kidGloss: 'say ten, twenty, thirty as you touch each tower' },
      { term: 'loose', kidGloss: 'the blocks left over that never made a tower' },
      { term: 'the front mark', kidGloss: 'the mark that says how many towers there are' },
    ],
  },
  guidedExamples: [
    {
      ...ge(
        22,
        1,
        'modeled',
        // Deliberately nobody's story. Names are drawn from `FOLK` when an item
        // is built, and writing one into an example would put a fixed name
        // beside the same name drawn at random — the §F.3 collision.
        scenePrompt('towers of blocks standing in a line', 'Count by tens. How many blocks?'),
        [
          { teacherSay: say('Watch me. I do not count these blocks one by one.') },
          { childDo: say('Touch each tower and say the tens with me.'), expected: '10, 20, 30' },
          { teacherSay: say('Thirty. Three towers, and every tower is a ten.') },
        ],
        '30',
      ),
      // The one example whose picture draws exactly what it keys, so it is the
      // one that may assert. A guided example is audited against its ANSWER
      // alone (`validator.ts` passes `{answer: [g.answer]}` and no params), so
      // `assertsParam` could never resolve on this surface at all.
      visual: 'A line of three block towers, every one built to the same height.',
      figure: counterGroups(
        Array.from({ length: 3 }, () => ({ count: 10, noun: 'blocks' })),
        { arrangement: 'towers', alt: towerAlt('blocks', true, false), asserts: assertsAnswer },
      ),
    },
    {
      ...ge(22, 2, 'completion', scenePrompt('towers of blocks with loose ones beside them', 'How many tens are here?'), [
        { teacherSay: say('I will start. A tower has to be finished to count.') },
        { childDo: say('So how many towers made it all the way?'), expected: '4' },
        { teacherSay: say('Four tens. The little pile is not one of them.') },
      ], '4'),
      // THE LAST THREE EXAMPLES CLAIM NOTHING ABOUT THEIR PICTURES, and the
      // reason is structural. A worked example is measured against its answer
      // and nothing else — no params reach the picture audit here — while each
      // of these three draws a whole amount and keys a piece of one. Asserting
      // would therefore hand the audit an honest drawing and a correct answer
      // and invite it to call them contradictory. Silence is the truer claim.
      visual: 'Four full towers and a short pile of blocks at the end.',
      figure: counterGroups(
        [...Array.from({ length: 4 }, () => ({ count: 10, noun: 'blocks' })), { count: 6, noun: 'blocks' }],
        { arrangement: 'towers', alt: towerAlt('blocks', true, true) },
      ),
    },
    {
      ...ge(22, 3, 'prompted', scenePrompt('towers of blocks with loose ones beside them', 'How many in all? Tap that number.'), [
        { teacherSay: say('Look. Two of these are built from one pair of marks.') },
        { childDo: say('Count the towers. Which mark should go in front?'), expected: '3' },
        { teacherSay: say('The towers were counted first, so their mark leads.') },
      ], '32'),
      visual: 'Three towers and a short pile, with three numbers below them.',
      figure: counterGroups(
        [...Array.from({ length: 3 }, () => ({ count: 10, noun: 'blocks' })), { count: 2, noun: 'blocks' }],
        { arrangement: 'towers', alt: towerAlt('blocks', true, true) },
      ),
    },
    {
      ...ge(22, 4, 'independent', scenePrompt('shells emptied out across a mat', 'Group them into tens. Say how many are left.'), [
        { childDo: say('Push ten clear, then ten again, then look.'), expected: '5' },
      ], '5'),
      visual: 'Shells lying loose across a mat, not yet gathered into groups.',
      figure: counters(25, 'shells', { arrangement: 'scattered', alt: heapAlt('shells') }),
    },
  ],
  days: [
    // Day 1 — a ten becomes a thing: build it, count by it, and count how many
    // of it there are.
    [
      { gen: warmLooseTeen, diff: 1 },
      { gen: skipCountDay, diff: 2 },
      { gen: tensCountDay, diff: 2 },
      { gen: partsMatchDay, diff: 3 },
    ],
    // Day 2 — the marks arrive, and the order of them meets its trap.
    [
      { gen: warmEmptyCells, diff: 2 },
      { gen: tensCountDay, diff: 2 },
      { gen: numeralChoiceDay, diff: 3 },
      { gen: gapToTenDay, diff: 3 },
    ],
    // Day 3 — the trap again, and the puppet who read the marks in the order
    // they were seen.
    [
      { gen: warmNextNumber, diff: 2 },
      { gen: skipCountDay, diff: 3 },
      { gen: numeralChoiceDay, diff: 3 },
      { gen: puppetPage, diff: 3 },
    ],
    // Day 4 — single-step real-world pictures (the band-A form of G7), each
    // asking a different question of the same apparatus.
    [
      { gen: warmSmallSet, diff: 2 },
      { gen: storyButtonsDay, diff: 2 },
      { gen: storyShellsDay, diff: 3 },
      { gen: storyStarsDay, diff: 3 },
    ],
    // Day 5 — match both parts, work out what the next ten still wants, then
    // make the tens by hand and name what would not go.
    [
      { gen: partsMatchDay, diff: 2 },
      { gen: gapToTenDay, diff: 3 },
      { gen: day5Bundle, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    "For grown-ups: the idea this week is that ten things can be pushed together and become ONE thing - a tower - and that once that has happened the ten inside it never gets counted again. Everything else follows from it. Counting by tens is only fast because a tower is one touch. A two-digit number is only short because its front mark counts towers and its last mark counts the blocks that did not make one. Two things are worth watching for. The first is the mistake the puppet makes: shown two towers and four loose blocks, a great many four- and five-year-olds say forty-two. Nothing was miscounted - both piles were seen perfectly - and the marks were simply said in the order the eye met them. So do not correct the counting; ask which pile the first mark was for, and let them hear the difference. The second is quieter: a child can pass a whole page of this by saying how many tall stacks there are, without ever knowing that a stack is worth ten. So take the tower apart in front of them now and then, count the ten back out one at a time, and push it together again. Keep a pot of ten of something with a lid on it, so a ten is a thing with a name.",
  ],
  /**
   * The week's build task, where nothing is computed until something is made.
   *
   * Every core page hands the child towers that somebody else built. Here the
   * blocks are in two separate heaps and neither heap is a ten, so the tens have
   * to be MADE, and made across the gap between the piles — which is the move
   * the week never asks for and the one that shows whether a ten is really a
   * quantity rather than a shape on the page. Marked by hand, because no gate
   * grades a crayon and because a `Puzzle` has nowhere to put options —
   * `types.ts` gives it no `choices` field — so a numeric one is completed at
   * display time by `tapOptionsFor`, out of the answer and nothing else. What
   * the ringing has to come to sits in `answer.value`, for whoever marks it and
   * for any audit. The picture carries
   * no assertion — what it draws is two heaps, and what the page asks for does
   * not exist until a ring has been drawn round part of them.
   */
  puzzle: (r, guard) => {
    // Steered off amounts the days have used. A fixed attempt count, so the
    // stream advances predictably, over a range wide enough that it rarely runs.
    let n = r.int(21, 45);
    for (let k = 0; k < 12 && guard.taken(`a22:rings|${String(n)}`); k++) n = r.int(21, 45);
    guard.add(`a22:rings|${String(n)}`);
    const near = Math.ceil(n / 2);
    const far = n - near;
    return {
      id: 'A22-PZ-01',
      title: 'Puzzle Grove: Tens Across Two Heaps',
      puzzleType: 'construction',
      prompt: [
        `[image: ${countNoun(near, 'blocks')} in one heap and ${countNoun(far, 'blocks')} in another]`,
        say('Ring ten blocks at a time.'),
        say('You may take from both heaps.'),
        say('How many rings did you draw?'),
      ].join(' '),
      figure: counterGroups([{ count: near, noun: 'blocks' }, { count: far, noun: 'blocks' }], {
        arrangement: 'scattered',
        alt: twoHeapsAlt('blocks'),
      }),
      answer: {
        value: String(Math.floor(n / TEN)),
        acceptableForms: [numberWords(Math.floor(n / TEN)), `${countNoun(Math.floor(n / TEN), 'tens')} and some over`],
        validation: 'manual-review',
      },
      hintLadder: rungs('A ring may reach across the gap between heaps.', 'Close each ring before hunting for the next.'),
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'make-tens-across-two-heaps' },
  sprint: null,
  mastery: [
    { gen: skipCount, diff: 2 },
    { gen: tensCount, diff: 2 },
    { gen: numeralChoice, diff: 3 },
    { gen: gapToTen, diff: 3 },
    { gen: partsMatch, diff: 3 },
    { gen: storyButtons, diff: 3 },
  ],
  isomorphNotes:
    'The two forms pair index by index: each slot runs one generator at one difficulty in both, off streams that never share a draw, and every one of the twelve pages is answered by tapping a card this file wrote, so nothing that certifies is left as a bare numeral for the display layer to invent buttons around. 01 counts a line of towers by tens and keys twenty, thirty, forty or fifty. 02 shows the same apparatus with a pile that never made a tower and asks how many TENS are there, keying one to four; the two are kept on separate slots with separate card sets on purpose, because a child who has learned only to count tall stacks passes both, and the report measures exactly how far that reflex gets. 04 is the slot no reading habit reaches: it asks how many more blocks would finish another tower, which is neither mark of the number and neither pile on the page, and its cells bar a loose count of five and any cell whose tower count equals the gap, so the two coincidences that would have handed it to a reflex are gone. 06 is a real-world page in a place with no apparatus in it. On the whole-amount slots the cards are two-digit numerals the slot itself keys, on the tens-count slots single digits from one to four, and in every case the offered set is the image of the slot own draw pool, so every numeral on a page is one that page really keys on some other draw and none can be struck out unread. WHICH SEAT the truth takes is settled by solved weights before any wrong value is chosen, because the smallest member of a set has nothing beneath it and the largest nothing above, and a set left to itself starves its middle seat. 03 is the discrimination and it is the reason the week exists: towers and a loose pile against three numerals, one of which is the same two marks the other way round, always present and always a numeral the slot itself keys - so a child who writes the marks in the order the eye met them is choosing a real but different amount every single time, and the misconception costs rather than merely failing to help. 05 states both parts on every card and makes them miss in different places, one card out on the towers and one out on the loose ones, so reading half the picture leaves two cards standing whichever half is read; it is the only slot in the week where both counts must be produced before anything can be tapped. Three things are stated as limits rather than as guarantees. The assembler rebuilds any Form-B page whose template and params repeat its twin, and the pack-wide guard keeps operand surfaces apart, but neither of them signs WHICH KIND of thing a page drew, so the same amount can arrive twice in different nouns. The tower pictures are held apart by amount on the DAY pages alone, through a signature read off what the drawing holds rather than off what the prompt prints; measured over six hundred packs, no day repeats a picture. And the mastery forms are left out of that guard deliberately, since six further claims on one pool of amounts would hand the last slot to draw whatever the others declined - the marginal tilt a wide signature exists to stop. This week is the fourth about counting and the ledger cannot see that - A1 and A2 counted to ten, A9 counted past it, A10 wrote the marks down, and A22 makes the ten into an object and counts groups of it - so what is new here is stated in the parent strip and in the report rather than in a deepeningDelta the gate never asked for.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'says-the-marks-in-the-order-seen',
      description:
        'Shown two towers and four loose blocks, reads it as forty-two. Nothing has been miscounted: both piles were seen correctly and the marks were said in the order the eye met them. It is the recipe\'s own slip and it is the whole reason two-digit numerals are hard, because for the first time in a child\'s life the order of two marks changes what they mean.',
      exampleWrongAnswer: 'three towers and one loose block read as 13',
      distractorRationale:
        'It is a card on the discrimination every single time, and it is always a numeral that slot really keys on some other draw - two towers and four loose is 24 on one draw and 42 on another, so the swap can never be struck out for looking odd or looking big. It stands above the truth exactly as often as below it, which is what stops the answer settling at a rank, and a child who holds this misconception is therefore choosing a genuinely different amount rather than being caught by a decoy.',
      reteachPointer: 'explanation/script[3] (towers first, always)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'counts-the-loose-pile-as-a-ten',
      description:
        'Counts the groups on the page instead of the tens, so a line of three towers with a small pile beside it is reported as four tens. The child has understood that tens are things to be counted and has not yet understood that a thing has to be FINISHED to be one.',
      exampleWrongAnswer: 'three towers and two loose blocks, asked how many tens, answers 4',
      distractorRationale:
        'One more than the tower count sits in the pool on every tens-count page and in the star story, which is exactly what counting the groups produces, and it is the true answer on other draws of the same slot. It is met by the TASK as well: the loose pile is never empty on those pages, so the picture always holds one more group than the answer and the decision cannot be dodged.',
      reteachPointer: 'guidedExamples/A22-GE-02 (a tower has to be finished to count)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'counts-the-tower-back-out',
      description:
        'Starts at one and counts every block, straight through the towers, arriving at the right total by the slowest possible road. The total is usually correct and the idea is missing: the ten was never one thing, it was just the first ten blocks, so nothing has been gained by building it.',
      exampleWrongAnswer: 'counts thirty blocks one at a time instead of saying ten, twenty, thirty',
      distractorRationale:
        'This one produces the RIGHT number, so it cannot be an option - a card carrying it would be the answer. It is met by the cards on the skip-count page being whole tens apart, which makes a single miscount inside a tower invisible and a lost or repeated TOWER the only thing that separates them, and by the puzzle, where the tens have to be made across two heaps and counting through is barely possible.',
      reteachPointer: 'explanation/script[0] (ten blocks went in, it is one tower now)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'guesses-what-the-next-ten-needs',
      description:
        'Knows the loose pile is not a ten and cannot say how far off it is. The partner-of-ten bond from A13 has not yet transferred out of the frame it was learned in, so a pile of six beside a tower produces a guess rather than four.',
      exampleWrongAnswer: 'a pile of six, asked how many more finish a tower, answers 6',
      distractorRationale:
        'Values one and two either side of the gap stand in the pool on the finish-the-tower page and in the shell story, and every one of them is the true answer on some other draw of the same slot. The reflex answer - the size of the loose pile itself - is barred by construction: the one cell where the pile and the gap are equal is dropped, so saying the pile is never right.',
      reteachPointer: 'guidedExamples/A22-GE-04 (push ten clear, then ten again, then look)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place-in-the-skip-count',
      description:
        'Chants ten, twenty, thirty perfectly and does not land one word on each tower, so the chant runs on past the last stack or stops while one is still standing. It is the skip-count version of losing your place in a count, and it is the reason pointing matters more here than the words do.',
      exampleWrongAnswer: 'four towers counted as fifty',
      distractorRationale:
        'The cards on the skip-count page are whole tens apart, because a tower counted twice or missed is worth exactly ten - so every wrong value on that page is the output of this slip and none of them is a decoy. Which side of the truth they fall on rotates, so a child cannot lean high or low and be right more often than chance.',
      reteachPointer: 'explanation/script[1] (a finger moving along the tops)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-other-question',
      description:
        'Reads the picture correctly and hands back the wrong part of it: says thirty when asked how many tens, or three when asked how many blocks. Two questions live on one picture all week, and telling them apart is a real part of what is being learned.',
      exampleWrongAnswer: 'three towers, asked how many blocks, answers 3',
      distractorRationale:
        'It cannot be an option, and that is deliberate: a slot keying a tens count offers single digits and a slot keying an amount offers two-digit numerals, so the number this habit produces is never on the page at all. Putting it there would teach a child to sort cards by how big they look instead of listening to the question. The habit is met by the pages being INTERLEAVED across the week instead, and the report measures how far it gets.',
      reteachPointer: 'explanation/script[2] (two towers, and three that never made one)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Making tens into things you can pick up, and reading the numbers that come out of them. We pushed ten blocks together into a tower, counted lines of towers by tens up to fifty, and worked out how many tens a picture holds when some blocks are left loose at the end. Then we did the part this week really exists for: a two-digit number has a mark that counts the towers and a mark that counts the loose ones, and putting them down in the other order says something else. Twenty-four and forty-two use the very same two marks.',
    improvingCandidates: [
      'counting a line of towers by tens instead of block by block',
      'telling a finished ten from a pile that stopped short',
      'saying which mark of a number counts the tens',
      'working out how many more a pile needs to become a ten',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'putting the tens mark in front, whichever pile was noticed first',
      },
      {
        errorTag: 'representation-misread',
        text: 'counting only the towers that are actually finished',
      },
      {
        errorTag: 'fact-recall',
        text: 'knowing what a small pile still needs to reach a whole ten',
      },
      {
        errorTag: 'task-comprehension',
        text: 'hearing whether a question asks for the groups or for everything',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the towers first, and then you said which mark was for them.',
      questionForChild: 'Tip out a handful. How many tens can you make?',
      schoolSyncHook: 'Tell us when bundles of ten start appearing in schoolwork and we will line the two up.',
    },
    vocabularyForParent: [
      'a tower (ten blocks pushed together, counted as one thing from then on)',
      'count by tens (ten, twenty, thirty - one number word per tower)',
      'loose (what is standing outside every tower once the tens are built)',
      'the front mark (the digit that says how many tens, and the reason 24 is not 42)',
    ],
  },
});
