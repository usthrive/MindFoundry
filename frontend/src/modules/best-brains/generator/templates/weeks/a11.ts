/**
 * Level A · Week 11 — "Patterns" (conceptId: patterns).
 *
 * Built on `makeWeekBuilder` + `lib/earlynumber`, following the SHAPE of the a01
 * and a02 exemplars and none of their sentences, scenes or nouns.
 * FILL-ARCHITECTURE §3 row A11: anchor "say-the-pattern-aloud"; core form
 * what-comes-next over AB / ABB / AAB; perceptual discrimination "AB vs ABB";
 * puppet error-analysis "continues an ABB as an AB"; Day-5 "fix-the-broken-
 * pattern" plus an oral R-flagged "make-your-own".
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **A pattern is a part that comes back, and the ear finds it before the eye
 *    does.** Every core item is a drawn strip the child says out loud; the
 *    anchor is the chant, not the picture, which is why the lesson, the guided
 *    examples and nine of the eleven hint ladders all start by saying it.
 *  - **Not every pattern is a back-and-forth.** That single belief is what a
 *    three-year-old brings and what this week removes, so it is attacked from
 *    three sides: the repeat-length discrimination (`howManyRepeat`), the
 *    what-comes-next runs whose true next element REPEATS rather than swaps
 *    (four of the nine), and the puppet who alternates and is caught doing it.
 *  - **The picture is the question.** `GATE_PROFILE.A` swaps the multi-step
 *    density gate for `pictorialPerDay: 1`; every non-retrieval item on Days 1–4
 *    carries a strip built from its own drawn run.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Retrieval is 25%** (5 of 20 daily items), one warm-up a day, each from a
 *    different strictly-earlier week (A1, A2, A4, A6, A10) in a different
 *    format, so no day repeats a warm-up shape.
 *
 * ── EIGHT DISCLOSURES (FANOUT kit §E2.3: document the choice in the header) ──
 *
 * 1. **THE RECIPE'S DISCRIMINATION CANNOT BE DRAWN AS TWO STRIPS, and that is
 *    provable rather than a judgement.** "AB vs ABB" wants an AB run and an ABB
 *    run in ONE picture. A pattern run is drawable only as `counterGroups` with
 *    one counter per slot (that is how the family's own `patternNext` draws it),
 *    because a `CountersParams` group carries ONE icon and one count. Two runs
 *    would need two groups, and a group cannot hold two kinds. `relation:
 *    'compare'` does stack groups as rows — but each row is still n copies of a
 *    single icon, so a row can never BE a pattern. A picture claiming otherwise
 *    would be a lying figure, which is the one thing `lib/figures.ts` exists to
 *    prevent.
 *
 *    Taken in the kit §E2.3 order. The contrast is TAUGHT where two figures are
 *    available and the answer is already on the page — `script[0]` chants an AB
 *    strip, `script[1]` chants the ABB strip beside it, and `script[2]` names
 *    what changed. It is PRACTISED on Days 2 and 3 by the honest, drawable form
 *    of the same question: `howManyRepeat` (below) asks how many things are said
 *    before the strip repeats, which is 2 for an AB and 3 for an ABB or an AAB —
 *    the discrimination itself, over one strip, with the "heard it as a plain
 *    back-and-forth" answer offered as a live option and named in the
 *    mistakeBank. Every strip in that item is SIX counters long whatever its
 *    kind, so the strip's length can never hint at the answer. It is CERTIFIED
 *    in mastery by slots 02, 04 and 06 rather than by that item — see disclosure
 *    8, which is where the reasoning lives. The missing primitive (a per-group
 *    pattern, or a second row of mixed icons) is recorded for the orchestrator.
 *
 * 2. **A TWO-SYMBOL PATTERN HAS A TWO-OPTION "WHAT COMES NEXT", and no third
 *    option can be invented honestly.** The answer is one of the two kinds in
 *    the strip; a third kind would be an option that is FALSE UNDER EVERY DRAW
 *    and never on the page, which is the dead option §E2.11 forbids. So the nine
 *    what-comes-next items in this week are two-way, and the floor is a coin
 *    flip. What is measurable there is not the rank but the STRUCTURAL habit,
 *    and there are only two: "say the same one again" and "say the other one".
 *    They are complementary, so exactly one of them is right on every draw and
 *    the only honest defence is to BALANCE them. Measured over 1,200 packs and
 *    the week's fifteen what-comes-next slots, "say the same one again" scores
 *    53.3% and "say the other one" 46.7%, so neither blind habit is worth more
 *    than a coin. ("Say the one the strip starts with" scores 46.7% too.) The
 *    three-option work is carried by the items that CAN carry it:
 *    `howManyRepeat`, `puppetSwapsIt`, `spotTheOddOne` and the counting forms.
 *
 * 3. **THE PUPPET SLIP'S OWN QUESTION HAS A BINARY TRUTH, so the question was
 *    moved rather than the misconception.** "Pip continued the ABB as an AB"
 *    posed directly ("what should Pip have said?") offers the two kinds and
 *    NAMES one of them in the prompt, so "tap the one the puppet did not say"
 *    scores full marks with no pattern reading at all — the two-option
 *    error-analysis defect `puppetSlip` itself carries a third option to avoid.
 *    A third kind cannot exist (disclosure 2). So `puppetSwapsIt` keeps the slip
 *    exactly as the recipe names it — Pip carries the strip on by alternating
 *    from the last thing — and asks the question a three-way answer space
 *    supports: how many at the start still fit before Pip's first mix-up. The
 *    count is derived from the same unit table that draws the strip, it lands on
 *    every value from 4 to 8 across the eighteen (kind, length, offset) cells,
 *    and Pip's own number is not on the page to be eliminated.
 *
 * 4. **PATTERN FIGURES CARRY NO `asserts`, and that is the family's own ruling.**
 *    `patternNext` says it plainly: "what the picture claims here is an ORDER,
 *    not a number". `figureValue` for a `counters` figure can recompute the
 *    total, a group's count or the remaining count — none of which is what any
 *    item here asks for (a repeat length, a position along the strip, the count
 *    of ONE kind spread through a run of two). Asserting the total against an
 *    answer of "3" would make QG-13 fail a picture that is perfectly honest, so
 *    the assertion is omitted rather than aimed at the wrong quantity. The
 *    guarantee is structural instead: every strip, every option and every keyed
 *    answer in this file comes from the same `UNIT`/`runOf` pair of functions,
 *    and `a_pattern_next_v1` re-derives the next element from ITS OWN copy of
 *    the unit table — so the two independent implementations must agree or QG-11
 *    fires. The missing selector (a `pattern:` family for counters) is recorded.
 *
 * 5. **Six thin local generators, and why each is not in the family.**
 *    `howManyRepeat` (the drawable discrimination of disclosure 1 — the family
 *    has one pattern generator and it only asks what comes next), `puppetSwapsIt`
 *    (`PuppetSlip` is a closed union of 'double-count' | 'skip-count' |
 *    'count-back-start' | 'teen-writing'; there is no pattern slip in it),
 *    `spotTheOddOne` (fix-the-broken has no family generator at all) and the
 *    two Day-4 story forms (`patternStory` and `countOneKind` — the family has no
 *    story generator at all, its word problems all join or take away, which A11
 *    has not taught) plus the Day-5 `makeYourOwn`. All follow the family's
 *    conventions exactly — a registered templateId, a figure from `lib/figures`,
 *    prose through `lib/format`, `authorMeta` stamped — so they are the family's
 *    shape rather than an escape from it. Recorded for the orchestrator.
 *
 * 6. **The Day-5 make-your-own ships OPEN, with no answer key.**
 *    FILL-ARCHITECTURE §7 lists A11 by name: the computable core is the
 *    sort/match/build choice work, and the oral "tell how you know" is the
 *    flagged part. `makeYourOwn` therefore validates `manual-review` and carries
 *    NO `generator` — inventing a template that "computes" a pattern the child
 *    has not made yet would be faking a computable answer for an open task,
 *    which the kit forbids outright. It is also the item that satisfies the
 *    dual-strand coupling gate.
 *
 * 7. **The Day-5 teacher's-note strip is the only strip.** FILL-ARCHITECTURE §1
 *    asks for one every day at band A; `validator.ts` S-SCHEMA rejects a strip on
 *    Days 1–4 and `PuzzleGrove.tsx` reads Day 5's, hardcoded. Settled ruling,
 *    recorded here only because a reader of this file will otherwise wonder.
 *
 * 8. **`howManyRepeat` TEACHES on Days 2 and 3 and does not CERTIFY, and the
 *    split is deliberate.** Its answer space has exactly two values — a repeating
 *    part is two things long or three — so every other option on the page is
 *    never-correct by construction and no arrangement gets all of them under the
 *    50% at which `bb-answer-entropy-test` calls an option dead. Measured, "1"
 *    reached 53% in the mastery slot. The available answers were: declare the
 *    lure, cut to a bare two-way {2, 3}, or certify with something else.
 *
 *    Declaring it was refused, and rightly: the gate keeps MASTERY apart from
 *    day slots precisely because mastery promotes a child, and recording a
 *    three-way page that is really a coin flip as intended is not a fix. Cutting
 *    to {2, 3} silences the gate honestly but ships a third 50/50 into a
 *    six-item check. So slot 03 certifies with `spotTheOddOne` instead, on three
 *    grounds:
 *
 *    - **The discrimination is still certified, three times over.** Slots 02
 *      (`nextRepeatABB`), 04 (`storyMat`) and 06 (`puppetMixUp`) are every one of
 *      them drawn where the true next thing REPEATS the last, which is exactly
 *      where "every pattern is a back-and-forth" produces the offered distractor.
 *      A two-option item whose distractor IS the named misconception is not a
 *      coin flip for the child who holds it — they fail it systematically, every
 *      time. Guessing rescues the child who knows nothing, not the child who is
 *      wrong, and it is the second one this week exists for.
 *    - **`spotTheOddOne` asks MORE of the repeating unit, not less.**
 *      `howManyRepeat` wants the unit's LENGTH; the broken strip wants its
 *      CONTENT, carried across ten slots to the first that disagrees. Two whole
 *      repeats stand before the break by construction, so the unit cannot be
 *      dodged — and a child reading an ABB strip as alternating breaks at slot
 *      three, which is never on the page (the options start at p-2, never below
 *      five). Measured 5/6/7/8 keyed, top value 44%, ranks 32/34/34, worst
 *      never-correct 32%: the widest honest answer space in the week.
 *    - **What is LOST is diagnosis, not certification.** The broken strip's
 *      distractors are counting slips, so it says the child failed and not why.
 *      That is the right trade for a slot whose question is "can they do it";
 *      "which error" is the teaching slot's job, and it stays there — on Days 2
 *      and 3 in `howManyRepeat`, and in mastery slot 06, whose whole option set
 *      is built out of the misconception.
 *
 *    Three of the six mastery slots remain two-option, and that is the ceiling
 *    this concept has: a two-symbol pattern has a two-symbol "what comes next"
 *    (disclosure 2), and the week owns only four wide-answer forms, two of which
 *    slots 03 and 06 already use.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  howManyChoice,
  neighbourNumber,
  patternNext,
  setForNumeral,
  teenTenAnd,
  tenFrameRead,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { counterGroups } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** One name per item, drawn. Nothing in this file may name a child directly (kit §F.3). */
const NAMES = ['Elif', 'Jonah', 'Priya', 'Marcus', 'Suri', 'Dev', 'Hana', 'Cato'] as const;
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// The band-A prose law, applied per SENTENCE
//
// `lib/earlynumber.ts` caps a PROMPT at ten words, which is the law — but it
// caps the whole string, so a two-sentence prompt trips a cap it does not break
// while a hint ladder is not capped at all. `bb-readability-test` measures every
// SENTENCE on every child-facing surface with its own splitter and word counter;
// this mirrors both, and it is applied to every child-facing string this file
// authors, so an eleventh word throws the moment the module loads or the item is
// drawn.
//
// `[image: …]` alt text is EXEMPT and never passes through here — it is what a
// screen-reader child has INSTEAD of the picture, and a pattern strip must be
// read out slot by slot or it is not a pattern.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A11: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
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
 * The ladder DEDUP allows a template at most twice across the non-retrieval
 * core, and this week runs fifteen core items over one family generator used
 * seven ways, so the ladders had to be budgeted before the days were (kit §E
 * "A-band lessons", item 1): fifteen items, eleven distinct ladders, none used
 * more than twice. Beyond the budget, all 24 Level-A weeks draw on the same
 * family, so shipping its built-in ladders verbatim would make every A week hint
 * identically — invisible to the per-pack gates, and exactly what
 * `bb-cross-week-test` exists to find. The advice genuinely differs per kind
 * too: an AB strip wants "listen for the swap", an ABB strip wants "listen for
 * the one that comes twice".
 *
 * Works entirely inside the returned closure, takes no rng draw and leaves the
 * prompt untouched, so the QG-1/QG-4 surface signature is unchanged.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * No two items in this pack may print the SAME STRIP.
 *
 * Found by reading the generated week, and it is a hole the shared guard cannot
 * cover: `drawUniqueItem` signs an item on the NUMERIC TOKENS of its prompt, and
 * a pattern prompt has none — "[image: duck, leaf, leaf, duck, leaf, leaf] What
 * comes next?" carries no digit anywhere. So every pattern item in this file has
 * a null signature, is never guarded, and two slots drawing the same kind, the
 * same length and the same two nouns print the identical page. That also breaks
 * the mastery contract, which requires `formB[i].prompt !== formA[i].prompt`.
 *
 * This registers the whole prompt in a namespace of its own and redraws while it
 * is taken. Bounded and deterministic (a redraw advances the seeded stream), it
 * takes no rng of its own, and it leaves the prompt untouched.
 */
function withFreshStrip(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    let draft = base(rng, guard, difficulty);
    for (let k = 0; k < 12 && guard.taken(`strip|${draft.prompt}`); k++) {
      draft = base(rng, guard, difficulty);
    }
    guard.add(`strip|${draft.prompt}`);
    return draft;
  };
}

/**
 * A warm-up: a family item from a strictly-earlier week, flagged as retrieval.
 *
 * `GATE_PROFILE.A.warmupFormats` is 0 — retrieval is permitted, not demanded —
 * so each warm-up has to earn its slot. A pattern is a rule about ORDER laid
 * over things you can count, so the five replay exactly the substrate this week
 * stands on: reading a frame (A2), what comes after (A6), tapping the numeral
 * for a loose group (A1), ten-and-some-more (A10) and finding the group that
 * holds a named number (A4). One a day, five different formats, five different
 * weeks.
 *
 * Retrieval items are exempt from the ladder dedup and from the cross-week
 * ladder scan, so these keep the family's own hints: a warm-up should sound like
 * the week it came from, not like this one.
 */
function warmUp(base: ItemGen, week: number): ItemGen {
  return (rng, guard, difficulty) => ({
    ...base(rng, guard, difficulty),
    isRetrieval: true,
    retrievalSource: { level: 'A' as const, week },
  });
}

// ===========================================================================
// The pattern algebra this file computes from
// ===========================================================================

type PatternKind = 'AB' | 'ABB' | 'AAB';

/**
 * A SECOND, INDEPENDENT COPY of the repeating units — deliberately, not by
 * accident. `lib/earlynumber.ts` keeps `PATTERN_UNITS` private and the
 * registered `a_pattern_next_v1` re-derives the next element from that private
 * copy. So when a generator here builds a strip from THIS table and keys an
 * option, QG-11 checks it against the library's table: two implementations that
 * must agree, which is a real re-derivation rather than an echo of the drawn
 * value. If either table drifts, every seed fails at once.
 */
const UNIT: Record<PatternKind, ReadonlyArray<0 | 1>> = {
  AB: [0, 1],
  ABB: [0, 1, 1],
  AAB: [0, 0, 1],
};

const ALL_KINDS: readonly PatternKind[] = ['AB', 'ABB', 'AAB'];

/** The element at 0-based position `i` of a repeating unit. */
function slotAt(kind: PatternKind, i: number): 0 | 1 {
  const u = UNIT[kind];
  return u[i % u.length];
}

/**
 * `len` slots of the pattern, starting `offset` slots into the unit.
 *
 * The offset is not decoration and it was added on a MEASUREMENT (see
 * `puppetSwapsIt`). A strip may honestly begin anywhere in its own unit — a
 * string of beads picked up halfway along reads "shell, shell, star, shell,
 * shell, star", which is the same rule seen from a different starting point —
 * and every item here that reads a strip is offset-invariant by construction:
 * the repeat length, the count of each kind over a whole number of repeats, and
 * the position of a break are all properties of the rule, not of where the
 * looking began.
 */
function runOf(kind: PatternKind, len: number, offset = 0): Array<0 | 1> {
  return Array.from({ length: len }, (_, i) => slotAt(kind, offset + i));
}

/**
 * Two kinds a child can tell apart at a glance.
 *
 * Deterministic nudge, never a redraw loop (kit §E2.4). A pattern IS telling two
 * kinds apart, so two near-identical silhouettes make the picture argue with the
 * item: `iconFor` draws an apple and a ball as two similar rounds at 14 viewBox
 * units, and nothing else in the pool collides. One substitution, no rng.
 */
function twoKinds(r: Rng): [string, string] {
  const [a, b] = r.shuffle([...COUNTABLE_NOUNS]);
  const round = (n: string) => n === 'apples' || n === 'balls';
  return round(a) && round(b) ? [a, 'blocks'] : [a, b];
}

/** "duck, leaf, leaf, duck, leaf, leaf" — the strip, read slot by slot. */
function stripScene(run: ReadonlyArray<0 | 1>, nouns: readonly [string, string]): string {
  return run.map((s) => unitFor(1, nouns[s])).join(', ');
}

/**
 * The strip, drawn one counter per slot.
 *
 * The alt IS the run, and that is a GIVEN rather than a leak: the strip is what
 * the picture LOOKS like, it is what a sighted child sees, and it names BOTH
 * kinds on offer so it can never say which one comes next (kit §E2, and the
 * `bb-spoken-answer-test` G4 guard by name). It carries no count anywhere.
 */
function stripFigure(run: ReadonlyArray<0 | 1>, nouns: readonly [string, string], alt: string) {
  return counterGroups(
    run.map((s) => ({ count: 1, noun: nouns[s] })),
    { alt },
  );
}

// ===========================================================================
// Local generator 1 — how long is the part that comes back
// ===========================================================================

/**
 * The AB-vs-ABB discrimination, in the drawable form of disclosure 1.
 *
 * The child says the strip out loud and taps how many things are said before it
 * repeats: two for an AB, three for an ABB or an AAB. EVERY STRIP IS SIX
 * COUNTERS LONG whatever its kind — three AB repeats, two ABB repeats, two AAB
 * repeats — so the length of the picture can never hint at the answer, and the
 * only way through is to hear where the part comes back.
 *
 * Every option is something a four-year-old really answers, and none is
 * invented:
 *   2 / 3   the other unit length. Offered against a three-long strip it is the
 *           NAMED misconception of the whole week — the strip heard as a plain
 *           back-and-forth. Offered against a two-long strip it is one step too
 *           far, into the repeat rather than before it.
 *   3 / 4   one past the whole part — the chant carried on into the next repeat.
 *   1       only one kind counted inside the part.
 *   6       the whole strip counted instead of one part.
 *
 * WHICH PAIR IS OFFERED IS DRAWN, so the truth is sometimes the smallest number
 * on the page, sometimes the middle and sometimes the largest — the invariant
 * being that the answer must not sit at a fixed RANK (kit §E2.11). Measured
 * across 1,200 packs the truth lands lowest 43%, middle 41%, highest 16%, and no
 * option is offered on half the draws while never being the answer. The highest
 * rank is the thin one and it cannot be widened: a truth of two has exactly one
 * honest number below it, so only the three-long parts can put the answer on
 * top. Nudges are
 * deterministic: a two-long part has only ONE honest number below it, so its
 * both-below pairing steps down to the straddle rather than redrawing.
 */
function howManyRepeat(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
    // HALF THE STRIPS TAKE TURNS, and that is a measured weighting rather than a
    // pedagogical one. Drawn uniformly from the three kinds, two thirds of the
    // strips have a three-long part, so "always tap 3" scored 68% on a page whose
    // chance floor is 33% — a shortcut a child meets six times a week and keeps.
    // One draw, an even split between the two-long and the three-long part.
    const pickKind = r.int(0, 3);
    const kind: PatternKind = pickKind <= 1 ? 'AB' : pickKind === 2 ? 'ABB' : 'AAB';
    const unitLen = UNIT[kind].length;
    const len = 6;
    const offset = r.int(0, 2);
    const nouns = twoKinds(r);
    const run = runOf(kind, len, offset);

    // "1" IS A DECLARED LURE, AND ITS OFFER RATE IS HELD DOWN TO SUIT.
    //
    // Applying the L36 test honestly: a repeating part of one thing is not a
    // pattern at all, so across every legal draw here (AB, ABB, AAB) the answer
    // is 2 or 3 and "1" can never be keyed. It cannot be made live by widening
    // the draw either, because the only draw that would key it — a strip of one
    // kind repeated — is not a pattern a child of four can hear as one. What CAN
    // go wrong is a child learning to strike it out, so it is offered by ONE
    // bucket per truth rather than two: measured below the rate at which
    // `bb-answer-entropy-test` calls an option dead, and well below the rate at
    // which "never the one" becomes learnable. Recorded for the orchestrator,
    // which may prefer to add it to that script's DECLARED_LURES with this
    // argument.
    const oneKind = {
      text: '1',
      errorTag: 'representation-misread' as ErrorTag,
      rationale: 'Only one kind counted inside the part - the other kind was not said.',
    };
    const swap = {
      text: String(unitLen === 2 ? 3 : 2),
      errorTag: (unitLen === 2 ? 'procedure-slip' : 'concept-misconception') as ErrorTag,
      rationale:
        unitLen === 2
          ? 'One step too far - the chant ran on into the repeat instead of stopping before it.'
          : 'Heard as a plain back-and-forth, so the part that comes back was cut short.',
    };
    const over = {
      text: String(unitLen + 1),
      errorTag: 'procedure-slip' as ErrorTag,
      rationale: 'The whole part said, and then one more - the chant did not stop at the end.',
    };
    const twoParts = {
      text: String(2 * unitLen),
      errorTag: 'task-comprehension' as ErrorTag,
      rationale: 'Two whole parts chanted before stopping, when the question wants one.',
    };
    const whole = {
      text: String(len),
      errorTag: 'task-comprehension' as ErrorTag,
      rationale: 'The whole strip counted, when the question asks for one part only.',
    };

    // Pairings, chosen so the truth changes RANK between draws. A two-long part
    // has only "1" below it, so its both-below bucket does not exist and the
    // draw steps DOWN TO THE BOTH-ABOVE bucket — deterministic, never a redraw.
    //
    // The direction of that step was chosen on a measurement, not on taste. It
    // used to fall to the straddle, which handed the straddle two thirds of every
    // two-long draw and pushed "1" — an option no legal draw can key — onto 50%
    // of the pages, the exact rate at which `bb-answer-entropy-test` calls an
    // option DEAD. Stepping the other way holds it near a third (see the report),
    // and the truth still lands lowest, middle and highest in turn.
    let bucket = r.int(0, 2);
    // The step-down is split on `pickKind`, which is 0 or 1 with EXACTLY equal
    // probability once the strip is known to be two-long, so the two surviving
    // buckets stay at a half each. Splitting it on the offset instead (three
    // values, two of them even) tipped the low bucket to 5/9 and carried "two
    // whole parts" up with it — measured, not reasoned.
    if (unitLen === 2 && bucket === 2) bucket = pickKind === 0 ? 0 : 1;
    // WHICH NEVER-KEYED VALUE SITS IN WHICH BUCKET WAS SETTLED BY MEASURING.
    //
    // Two wrong slots a draw and three values that no legal draw can key (1, 4
    // and 6) leaves each of them near 40% however they are arranged — that is
    // arithmetic, not a choice. What IS a choice is which one carries the excess,
    // and the first arrangement put the whole strip length in both truths' lowest
    // bucket and measured it at 48% of pages, a hair under the line at which
    // `bb-answer-entropy-test` calls an option dead. Moving the two-long strip's
    // second high option onto "two whole parts" instead spreads the same mass:
    // measured over 1,200 packs: 1 -> 41%, 4 -> 43%, 6 -> 34%.
    const wrongs =
      unitLen === 2
        ? bucket === 0
          ? [swap, twoParts] // 3 and 4 against a truth of 2 — truth is the SMALLEST
          : [oneKind, swap] // 1 and 3 — truth is the MIDDLE
        : bucket === 0
          ? [over, whole] // 4 and 6 against a truth of 3 — SMALLEST
          : bucket === 1
            ? [swap, whole] // 2 and 6 — MIDDLE
            : [oneKind, swap]; // 1 and 2 — LARGEST

    const { choices, correctKey } = makeChoices(r, String(unitLen), wrongs);
    const scene = stripScene(run, nouns);
    const draft: ItemDraft = {
      type: 'representation',
      prompt: scenePrompt(scene, 'How many do we say before it repeats?'),
      figure: stripFigure(run, nouns, scene),
      choices,
      answer: { value: correctKey, acceptableForms: [String(unitLen)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: {
        templateId: 'a_numeral_for_set_v1',
        params: { n: unitLen, kind, len, offset, nounA: nouns[0], nounB: nouns[1] },
        seed: r.uint(),
      },
      hintLadder: hints('Say the strip out loud, right from the start.', 'Stop the moment the whole part comes back.'),
      errorTags: ['concept-misconception', 'representation-misread'],
      authorMeta: { stepCount: 1, cognitiveOp: 'read-the-repeat', isDiscrimination: true },
    };
    return draft;
    });
}

// ===========================================================================
// Local generator 2 — help the puppet (the A11 alternating slip)
// ===========================================================================

/**
 * A NAMED puppet carried the strip on by swapping back and forth, which is the
 * recipe's slip word for word: "continues an ABB as an AB". The picture shows
 * the whole strip Pip made — the true part first, then Pip's three — and the
 * child counts how many at the start still fit.
 *
 * Nothing is invented. Pip's three are `other(last), last, other(last)`, the
 * literal output of alternating from the last thing said; the true three are
 * read off the unit table; and the answer is the position of the first
 * disagreement, which lands on the first, second or third of Pip's additions in
 * exactly two of the six (kind, length) cells each. So the count is 4, 5, 7 or 8
 * across the draw, never a constant.
 *
 * Disclosure 3 in the header explains why the question is "how many fit" rather
 * than "what should Pip have said": with two kinds on the page and Pip's own
 * choice named, the direct question is answered by elimination alone. The word
 * "wrong" never appears — "Pip got mixed up" is the band's form — and the
 * numeric truth is recomputed by the registered `a_numeral_for_set_v1`.
 *
 * WHY THE STRIP STARTS AT A DRAWN OFFSET, which is a fix and not a flourish.
 * Started always at the top of the unit, the first disagreement falls at a fixed
 * place in the cycle: `fit` came out 4, 5, 7 or 8 and NEVER 6, because both
 * families are pinned to one residue class mod 3. Six then sat next door to the
 * two commonest answers, so the honest "one place short" and "one place too far"
 * wrongs offered it on 53% of draws while it could never be right — a DEAD
 * OPTION a child learns to strike out (kit §E2.11), measured over 400 seeds and
 * invisible to every per-pack gate. Letting the strip begin one or two slots
 * into its own unit frees `fit` to be any of 4–8, and 6 is keyed like the rest.
 */
function puppetSwapsIt(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
    const kind = r.pick(['ABB', 'AAB'] as const);
    const len = r.int(4, 6);
    const offset = r.int(0, 2);
    const nouns = twoKinds(r);
    const puppet = r.pick(PUPPETS);
    const run = runOf(kind, len, offset);
    const last = run[len - 1];
    const other = (s: 0 | 1): 0 | 1 => (s === 0 ? 1 : 0);
    const trueNext: Array<0 | 1> = [
      slotAt(kind, offset + len),
      slotAt(kind, offset + len + 1),
      slotAt(kind, offset + len + 2),
    ];
    const pipNext: Array<0 | 1> = [other(last), last, other(last)];
    // A three-slot window of ABB or AAB always contains a pair, and Pip never
    // says the same kind twice, so a disagreement inside the first three is
    // guaranteed rather than assumed — but it is FOUND, never defaulted to, so a
    // future unit that broke the guarantee would throw instead of keying a
    // strip that has no mix-up at all.
    let div = 0;
    for (let i = 0; i < 3; i++) {
      if (pipNext[i] !== trueNext[i]) {
        div = i + 1;
        break;
      }
    }
    if (div === 0) throw new Error(`A11 puppetSwapsIt: ${kind} at offset ${String(offset)} has no mix-up in three`);
    const fit = len + div - 1;
    const total = len + 3;
    const strip = [...run, ...pipNext];

    const below = [
      {
        text: String(fit - 2),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'Lost the count along the strip and stopped two places short.',
      },
      {
        text: String(fit - 1),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'Stopped one place short, before the last one that still fits.',
      },
    ];
    const above = [
      {
        text: String(fit + 1),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'The mixed-up one was counted in too, one place past where the strip still fits.',
      },
      {
        text: String(total),
        errorTag: 'task-comprehension' as ErrorTag,
        rationale: 'The whole strip counted, mix-up and all, instead of the part that fits.',
      },
    ].filter((w, i, list) => list.findIndex((o) => o.text === w.text) === i);

    // Deterministic step-down: when the mix-up is the LAST of the puppet's three,
    // "one too far" and "the whole strip" are the same number, so there is no
    // both-above pair and the bucket falls back to the straddle.
    let bucket = r.int(0, 2);
    if (bucket === 0 && above.length < 2) bucket = 1;
    const wrongs = bucket === 0 ? above : bucket === 1 ? [below[1], above[0]] : below;

    const { choices, correctKey } = makeChoices(r, String(fit), wrongs);
    const scene = stripScene(strip, nouns);
    const draft: ItemDraft = {
      type: 'error-analysis',
      prompt: scenePrompt(scene, `Oh no! ${puppet} got mixed up. Count the ones before that.`),
      figure: stripFigure(strip, nouns, scene),
      choices,
      answer: { value: correctKey, acceptableForms: [String(fit)], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      generator: {
        templateId: 'a_numeral_for_set_v1',
        params: { n: fit, kind, len, offset, nounA: nouns[0], nounB: nouns[1] },
        seed: r.uint(),
      },
      hintLadder: hints('Chant along the strip with the puppet.', 'The puppet swapped when it should have stayed.'),
      errorTags: ['concept-misconception', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
    };
    return draft;
    });
}

// ===========================================================================
// Local generator 3 — the Day-5 broken strip
// ===========================================================================

/**
 * One thing on the strip has been swapped for the other kind, and the child taps
 * where the strip stops fitting.
 *
 * TWO WHOLE REPEATS ALWAYS COME FIRST, and that is a correctness requirement
 * rather than a kindness (kit §E2.7 — a computable answer is not the same as an
 * askable question). Break an AB strip at its third slot and the opening reads
 * "duck, leaf, leaf", which is a perfectly good ABB; the strip then has two
 * defensible break points and the item has no answer. With two complete repeats
 * standing before it, the shortest pattern the opening can be is the one the
 * strip was drawn from, and the first slot that disagrees with it is unique.
 * Every strip is TEN counters long whatever its kind, so the length never hints
 * at where the break is.
 *
 * The honest wrong answers are misses along the strip, not misreadings of the
 * pattern: one place short, two places short, one place past, or the very end of
 * the strip. Which pair is offered is drawn, so the truth is not pinned to a
 * rank.
 */
function spotTheOddOne(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
    const kind = r.pick(ALL_KINDS);
    const unitLen = UNIT[kind].length;
    const len = 10;
    const offset = r.int(0, 2);
    const nouns = twoKinds(r);
    // Two whole repeats stand before the break; two slots stand after it, so an
    // "one place past" and an "end of the strip" option are always distinct.
    const p = r.int(2 * unitLen + 1, len - 2);
    const run = runOf(kind, len, offset);
    run[p - 1] = run[p - 1] === 0 ? 1 : 0;

    const below = [
      {
        text: String(p - 2),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'Lost the place while counting along and landed two too early.',
      },
      {
        text: String(p - 1),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'Blamed the one just before - it still fits the chant.',
      },
    ];
    const above = [
      {
        text: String(p + 1),
        errorTag: 'procedure-slip' as ErrorTag,
        rationale: 'Heard the break one beat late and blamed the one after it.',
      },
      {
        text: String(len),
        errorTag: 'task-comprehension' as ErrorTag,
        rationale: 'Tapped the end of the strip instead of the place it stops fitting.',
      },
    ];
    const bucket = r.int(0, 2);
    const wrongs = bucket === 0 ? above : bucket === 1 ? [below[1], above[0]] : below;

    const { choices, correctKey } = makeChoices(r, String(p), wrongs);
    const scene = stripScene(run, nouns);
    const draft: ItemDraft = {
      type: 'representation',
      // "Tap where the strip stops" was the first wording, and reading the
      // generated week killed it: a child hears "where the strip stops" as the
      // END of the strip, and the numeral options then have no referent at all.
      // Counting ALONG to the odd one is the same act, it says what the number
      // means, and it matches the answer mode the options actually offer.
      prompt: scenePrompt(scene, 'One does not fit. Count along to it.'),
      figure: stripFigure(run, nouns, scene),
      choices,
      answer: { value: correctKey, acceptableForms: [String(p)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: {
        templateId: 'a_numeral_for_set_v1',
        params: { n: p, kind, len, offset, nounA: nouns[0], nounB: nouns[1] },
        seed: r.uint(),
      },
      hintLadder: hints('Chant the pattern along the strip, slowly.', 'Number them as you chant along.'),
      errorTags: ['concept-misconception', 'procedure-slip'],
      authorMeta: { stepCount: 1, cognitiveOp: 'find-the-break' },
    };
    return draft;
    });
}

// ===========================================================================
// Local generator 4 — the Day-4 real-world pattern pictures
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family's `patternNext` carries no story sentence and takes no name, so the two
 * story frames live here.
 *
 * Both frames are drawn at a length where the true next thing REPEATS the last
 * one rather than swapping it, so a child who reads every strip as a
 * back-and-forth gets both of Day 4 wrong and hears why. The keyed option names
 * ONE of the kind ("the shell"), because one thing comes next; both renderings
 * stay in the accepted list, because the plural is what `a_pattern_next_v1`
 * recomputes and QG-11 needs one of them to match it. The family generator keys
 * the singular too as of the B1.1 fix this week's first pass reported, so the
 * two now read alike on the page.
 */
interface StoryFrame {
  kind: PatternKind;
  len: number;
  line: (name: string, nounA: string, nounB: string) => string;
  ladder: string[];
}

// THREADING A STRING WAS THE FIRST FRAME AND IT WAS RE-DRESSED.
// Scanned against the whole weeks directory at the end rather than the start
// (kit §E2.8): b05 threads bells onto a string, c06 registers a 'bead-craft'
// context whose verb is "threads", and c17 threads beads onto a bracelet. A
// repeated real-world frame across weeks is the corpus's documented weakness and
// no per-pack gate can see it. A mat and a ledge are unclaimed, and both hold a
// row of things the same way a string does.
const STORY_FRAMES: Record<'mat' | 'ledge', StoryFrame> = {
  mat: {
    kind: 'ABB',
    len: 5,
    line: (name, a, b) => `${name} lays ${unitFor(2, a)} and ${unitFor(2, b)} out on a mat.`,
    ladder: ['Chant across the mat from the left end.', 'Keep chanting past the last one.'],
  },
  ledge: {
    kind: 'AAB',
    // SEVEN, not four, and reading the generated week is what changed it. At
    // four the strip printed "duck, duck, shell, duck": the shortest rule that
    // fits it really is unique, so the item has one answer — but one repeat plus
    // a single beat is not enough for a four-year-old to HEAR the rule, and this
    // band finds patterns by ear. Seven lays two whole repeats down before the
    // question is asked. It is the same shape as the Day-3 plain item, on
    // purpose: Day 4 is where a shape already met turns up inside a story.
    len: 7,
    line: (name, a, b) => `${name} sets ${unitFor(2, a)} and ${unitFor(2, b)} along a ledge.`,
    ladder: ['Point and chant along the ledge out loud.', 'The next one is the one your chant says.'],
  },
};

function patternStory(which: 'mat' | 'ledge'): ItemGen {
  const frame = STORY_FRAMES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
    const nouns = twoKinds(r);
    // NO OFFSET HERE, unlike the strip readers: both frames are drawn at a
    // length where the true next thing REPEATS the last one, and that property
    // holds only when the strip starts at the top of its unit.
    const run = runOf(frame.kind, frame.len);
    const nextIdx = slotAt(frame.kind, frame.len);
    const nextNoun = nouns[nextIdx];
    const otherNoun = nouns[1 - nextIdx];
    const name = one(r);
    const { choices, correctKey } = makeChoices(r, `the ${unitFor(1, nextNoun)}`, [
      {
        text: `the ${unitFor(1, otherNoun)}`,
        errorTag: 'concept-misconception' as ErrorTag,
        rationale: 'Swaps every single time - reads any strip as a plain back-and-forth.',
      },
    ]);
    const scene = stripScene(run, nouns);
    const draft: ItemDraft = {
      type: 'word-problem',
      prompt: scenePrompt(scene, `${frame.line(name, nouns[0], nouns[1])} What comes next?`),
      figure: stripFigure(run, nouns, scene),
      choices,
      answer: {
        value: correctKey,
        acceptableForms: [`the ${unitFor(1, nextNoun)}`, unitFor(1, nextNoun), `the ${nextNoun}`, nextNoun],
        validation: 'choice-key',
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: {
        templateId: 'a_pattern_next_v1',
        params: { kind: frame.kind, len: frame.len, nounA: nouns[0], nounB: nouns[1] },
        seed: r.uint(),
      },
      hintLadder: hints(...frame.ladder),
      errorTags: ['concept-misconception', 'task-comprehension'],
      authorMeta: { stepCount: 1, cognitiveOp: 'pattern-story', situationType: 'part-whole' },
    };
    return draft;
    });
}

/**
 * Two kinds run through one strip and the question names ONE of them.
 *
 * The unused quantity is DRAWN rather than narrated, which is the `has-distractor`
 * posing in its band-A form: an item that consumes every number it states quietly
 * teaches "use all the numbers", and children learn it. Here the second kind is
 * not a number at all — it is half the picture, and the child must walk the strip
 * counting only their own kind, which is the counting substrate A1 and A2 built
 * put to work inside a pattern.
 *
 * Every strip is six long, so the three answers 2, 3 and 4 all occur: an AB strip
 * holds three of each, an ABB strip two of one and four of the other.
 */
function countOneKind(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
    const kind = r.pick(ALL_KINDS);
    const len = 6;
    // Six is a whole number of repeats for every kind here, so the count of each
    // kind is the same wherever the strip is picked up: the offset varies the
    // picture without touching the answer.
    const offset = r.int(0, 2);
    const nouns = twoKinds(r);
    const run = runOf(kind, len, offset);
    const askIdx = r.int(0, 1);
    const asked = nouns[askIdx];
    const n = run.filter((s) => s === askIdx).length;
    const name = one(r);
    const scene = stripScene(run, nouns);
    const draft: ItemDraft = {
      type: 'word-problem',
      // Plural in the question, always. `unitFor` would agree the noun with a
      // drawn count of two and ask "How many ball?", which both mis-speaks and
      // narrows the strip to a single object before the child has looked.
      prompt: scenePrompt(scene, `${name} lays out a strip. How many ${asked}?`),
      figure: stripFigure(run, nouns, scene),
      answer: {
        value: String(n),
        acceptableForms: [numberWords(n), countNoun(n, asked)],
        validation: 'exact-numeric',
        units: asked,
      },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: {
        templateId: 'a_count_v1',
        params: { n, noun: asked, arrangement: 'in a row' },
        seed: r.uint(),
      },
      hintLadder: hints('Hear which kind the question names.', 'Walk the strip and skip the other kind.'),
      errorTags: ['task-comprehension', 'procedure-slip'],
      authorMeta: {
        stepCount: 1,
        cognitiveOp: 'count-one-kind',
        situationType: 'part-whole',
        posing: 'has-distractor',
      },
    };
    return draft;
    });
}

// ===========================================================================
// Local generator 5 — Day-5 make your own, and say it
// ===========================================================================

/**
 * The A11 Day-5 signature's second half (FILL-ARCHITECTURE §3 row A11:
 * "make-your-own (R)"), shipped OPEN exactly as §7 lists it.
 *
 * There is no answer key and there is no `generator`, and that is the point: a
 * pattern the child has not built yet cannot be recomputed, and a template that
 * pretended to would be a faked computable answer for an open task (kit §E,
 * Level E's four R-cells, the same rule). What IS code-drawn is the picture — a
 * heap of each kind to build from — and what is asked is the chant, which is the
 * week's anchor. It is also the item that satisfies the dual-strand coupling
 * gate, which wants one non-computational item demanding a justification.
 */
function makeYourOwn(): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
    const nouns = twoKinds(r);
    const scene = `some ${nouns[0]} and some ${nouns[1]} to build with`;
    const draft: ItemDraft = {
      type: 'reasoning',
      prompt: scenePrompt(scene, 'Build your own pattern. Say it out loud.'),
      figure: counterGroups(
        [
          { count: 4, noun: nouns[0], label: nouns[0] },
          { count: 4, noun: nouns[1], label: nouns[1] },
        ],
        { alt: scene },
      ),
      answer: {
        value: 'a strip whose part comes back, and the chant that says it',
        acceptableForms: [],
        validation: 'manual-review',
      },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      hintLadder: hints('Choose a part first. Then lay it again.', 'Chant it out loud and hear it come back.'),
      errorTags: ['task-comprehension', 'concept-misconception'],
      authorMeta: { stepCount: 1, cognitiveOp: 'make-a-pattern' },
    };
    return draft;
    });
}

// ===========================================================================
// The family generator, bound to A11's kinds and given this week's voice
// ===========================================================================

/**
 * WHY EVERY SLOT NAMES ITS OWN LENGTH, and it is a measurement rather than a
 * tidiness decision.
 *
 * `patternNext`'s default length is twice the unit, and at every multiple of the
 * unit the next element is `unit[0]` — the very thing the strip STARTS with. Run
 * the whole week on defaults and the answer is "whatever the strip begins with"
 * on 100% of draws, in a week whose entire content is that the beginning is not
 * the only thing that comes back. It is the relational invariant kit §E2.11
 * names: the keyed text varies on every seed and the item is still free.
 *
 * So each slot draws its own length, and the lengths are chosen for the only
 * blind habit a two-way pattern question has: the true next element either
 * REPEATS the last thing on the strip or SWAPS it, and one of the two is right
 * on every draw. Five slots swap, four repeat. Reported, and measured.
 */
const nextSwapAB = withFreshStrip(
  withHints(
    patternNext({ kind: 'AB', length: 4 }),
    hints('Chant it out loud, right from the start.', 'This one takes turns. Whose turn is next?'),
  ),
);
const nextSwapABLong = withFreshStrip(
  withHints(
    patternNext({ kind: 'AB', length: 5 }),
    hints('Chant it out loud, right from the start.', 'This one takes turns. Whose turn is next?'),
  ),
);
const nextSwapABB = withFreshStrip(
  withHints(
    patternNext({ kind: 'ABB', length: 6 }),
    hints('Chant the whole strip out loud, slowly.', 'One kind comes twice. Listen for the pair.'),
  ),
);
const nextSwapABBLong = withFreshStrip(
  withHints(
    patternNext({ kind: 'ABB', length: 7 }),
    hints('Chant the whole strip out loud, slowly.', 'One kind comes twice. Listen for the pair.'),
  ),
);
const nextSwapAAB = withFreshStrip(
  withHints(
    patternNext({ kind: 'AAB', length: 6 }),
    hints('Chant it out loud and hear the pair.', 'A pair comes first here, then one on its own.'),
  ),
);
/**
 * The two slots where the strip does NOT take turns: the true next thing is the
 * same as the last thing on the strip, so a child alternating out of habit is
 * caught. This is the AB-vs-ABB discrimination inside the core form.
 */
const nextRepeatABB = withFreshStrip(
  withHints(
    patternNext({ kind: 'ABB', length: 8 }),
    hints('Chant it out loud. Do not guess a swap.', 'Sometimes the same kind comes round twice.'),
  ),
);
const nextRepeatAAB = withFreshStrip(
  withHints(
    patternNext({ kind: 'AAB', length: 7 }),
    hints('Chant it out loud and hear the pair.', 'A pair comes first here, then one on its own.'),
  ),
);

const repeatLength = withFreshStrip(howManyRepeat());
const puppetMixUp = withFreshStrip(puppetSwapsIt());
const brokenStrip = withFreshStrip(spotTheOddOne());
const storyMat = withFreshStrip(patternStory('mat'));
const storyLedge = withFreshStrip(patternStory('ledge'));
const stripCount = withFreshStrip(countOneKind());
const buildYourOwn = withFreshStrip(makeYourOwn());

// --- the five warm-ups, one format and one source week each ----------------
const warmFrame = warmUp(tenFrameRead({ min: 6, max: 10, size: 10 }), 2);
const warmAfter = warmUp(neighbourNumber({ kind: 'after', min: 2, max: 9 }), 6);
// Min THREE, found by reading the generated week: `howManyChoice`'s honest "two
// too few" distractor is n-2, so a drawn set of two offers ZERO as an option -
// "none of them" beside a picture that plainly holds some. A floor of three keeps
// every option a countable number. Recorded for the orchestrator.
const warmTapNumeral = warmUp(howManyChoice({ min: 3, max: 5, arrangement: 'scattered' }), 1);
const warmTeen = warmUp(teenTenAnd({ min: 1, max: 9 }), 10);
const warmWhichGroup = warmUp(setForNumeral({ min: 6, max: 10, groups: 3 }), 4);

// ===========================================================================
// The week
// ===========================================================================

export const buildA11 = makeWeekBuilder({
  level: 'A',
  week: 11,
  conceptId: 'patterns',
  conceptName: 'Patterns',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [
    { level: 'A', week: 2 },
    { level: 'A', week: 6 },
  ],
  pedagogyContract: 'v2',
  conceptualAnchor: 'saying the pattern out loud',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. This week is heard before it is seen, so chant every strip with your child before they answer, and let them join in on the last thing. Real objects on a table beat anything on a screen: two kinds of spoon, two colours of sock, two shapes of pasta. Lay a strip, chant it, then walk away and let them carry it on. Mascot present.',
  },
  explanation: {
    hook: say(
      'A pattern is a part that comes back. Star, shell, shell. Star, shell, shell. Listen! You can hear it coming.',
    ),
    whyBeforeHow: say(
      'Patterns hide in a line of things. We find them by saying the pattern out loud. That works because our ears catch what eyes miss. Say it slowly, then say it again. The part that keeps coming back is the pattern. Now you know what comes next.',
    ),
    script: [
      {
        say: say('Here is a strip. Star, shell. Star, shell. Chant it with me.'),
        visual: 'A strip of four: star, shell, star, shell.',
        figure: counterGroups(
          [
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
          ],
          { alt: 'star, shell, star, shell' },
        ),
      },
      {
        say: say('Now this strip. Star, shell, shell. Star, shell, shell. Hear the two shells?'),
        visual: 'A strip of six: star, shell, shell, star, shell, shell.',
        figure: counterGroups(
          [
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'shells' },
          ],
          { alt: 'star, shell, shell, star, shell, shell' },
        ),
      },
      {
        // The recipe's discrimination, TAUGHT where two pictures are available
        // and the answer is already on the page (disclosure 1).
        say: say('Not every strip takes turns. That one said shell twice. Slow ears catch it. Quick eyes miss it.'),
        visual: 'The same six-strip again, with the two shells side by side.',
        figure: counterGroups(
          [
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'shells' },
          ],
          { alt: 'the same strip again: star, shell, shell, star, shell, shell' },
        ),
      },
      {
        say: say('One more. Star, star, shell. Star, star, shell. Now the pair comes first.'),
        visual: 'A strip of six: star, star, shell, star, star, shell.',
        figure: counterGroups(
          [
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'stars' },
            { count: 1, noun: 'shells' },
          ],
          { alt: 'star, star, shell, star, star, shell' },
        ),
      },
    ],
    summary: say(
      'A pattern has a part that comes back. Say it out loud to hear that part. Then you can say what comes next.',
    ),
    vocabulary: [
      { term: 'pattern', kidGloss: 'a part that comes back again and again' },
      { term: 'the part', kidGloss: 'the bit you chant before it starts over' },
      { term: 'comes next', kidGloss: 'what the chant says after the last one' },
      { term: 'takes turns', kidGloss: 'one, then the other, then one again' },
      { term: 'strip', kidGloss: 'a line of things laid out in order' },
    ],
  },
  guidedExamples: [
    {
      ...ge(11, 1, 'modeled', scenePrompt('star, shell, star, shell', 'What comes next?'), [
        {
          teacherSay: say('Watch me. I chant it out loud. Star, shell. Star, shell.'),
          expected: 'star',
        },
        { childDo: say('Chant the next one with me.'), expected: 'star' },
        { teacherSay: say('Star! The part came back around.') },
      ], 'star'),
      visual: 'A strip of four: star, shell, star, shell.',
      figure: counterGroups(
        [
          { count: 1, noun: 'stars' },
          { count: 1, noun: 'shells' },
          { count: 1, noun: 'stars' },
          { count: 1, noun: 'shells' },
        ],
        { alt: 'star, shell, star, shell' },
      ),
    },
    {
      ...ge(11, 2, 'completion', scenePrompt('leaf, ball, ball, leaf, ball, ball', 'What comes next?'), [
        { teacherSay: say('Listen to me first. Leaf, ball, ball.') },
        { childDo: say('Chant the rest out loud.'), expected: 'leaf, ball, ball' },
        { teacherSay: say('A leaf comes next. Two balls always follow it.') },
      ], 'leaf'),
      visual: 'A strip of six: leaf, ball, ball, leaf, ball, ball.',
      figure: counterGroups(
        [
          { count: 1, noun: 'leaves' },
          { count: 1, noun: 'balls' },
          { count: 1, noun: 'balls' },
          { count: 1, noun: 'leaves' },
          { count: 1, noun: 'balls' },
          { count: 1, noun: 'balls' },
        ],
        { alt: 'leaf, ball, ball, leaf, ball, ball' },
      ),
    },
    {
      ...ge(11, 3, 'prompted', scenePrompt('leaf, ball, ball, leaf, ball, ball', 'How many do we say before it repeats?'), [
        { teacherSay: say('Chant one whole part, then stop.') },
        { childDo: say('Count the ones you just said.'), expected: '3' },
      ], '3'),
      visual: 'The same six-strip, with one whole part chanted.',
      figure: counterGroups(
        [
          { count: 1, noun: 'leaves' },
          { count: 1, noun: 'balls' },
          { count: 1, noun: 'balls' },
          { count: 1, noun: 'leaves' },
          { count: 1, noun: 'balls' },
          { count: 1, noun: 'balls' },
        ],
        { alt: 'the same strip: leaf, ball, ball, leaf, ball, ball' },
      ),
    },
    {
      ...ge(11, 4, 'independent', scenePrompt('duck, duck, flower, duck, duck, flower', 'What comes next?'), [
        { childDo: say('Chant it out loud. Then say the next one.'), expected: 'duck' },
      ], 'duck'),
      visual: 'A strip of six: duck, duck, flower, duck, duck, flower.',
      figure: counterGroups(
        [
          { count: 1, noun: 'ducks' },
          { count: 1, noun: 'ducks' },
          { count: 1, noun: 'flowers' },
          { count: 1, noun: 'ducks' },
          { count: 1, noun: 'ducks' },
          { count: 1, noun: 'flowers' },
        ],
        { alt: 'duck, duck, flower, duck, duck, flower' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the three kinds of strip, one after another, each
    // chanted before it is answered.
    [
      { gen: warmFrame, diff: 1 },
      { gen: nextSwapAB, diff: 1 },
      { gen: nextSwapABB, diff: 2 },
      { gen: nextSwapAAB, diff: 2 },
    ],
    // Day 2 — the strip stops taking turns: the repeat-length discrimination
    // arrives, and so does the first strip whose next thing is the same again.
    [
      { gen: warmAfter, diff: 2 },
      { gen: nextSwapABLong, diff: 2 },
      { gen: repeatLength, diff: 3 },
      { gen: nextRepeatABB, diff: 3 },
    ],
    // Day 3 — the pair-first strip, the discrimination again, and the puppet who
    // carries every strip on as a back-and-forth.
    [
      { gen: warmTapNumeral, diff: 2 },
      { gen: nextRepeatAAB, diff: 3 },
      { gen: repeatLength, diff: 3 },
      { gen: puppetMixUp, diff: 3 },
    ],
    // Day 4 — real-world single-step pattern pictures (band-A form of G7), both
    // drawn at a length where the next thing repeats rather than swaps.
    [
      { gen: warmTeen, diff: 2 },
      { gen: storyMat, diff: 2 },
      { gen: stripCount, diff: 3 },
      { gen: storyLedge, diff: 3 },
    ],
    // Day 5 — fix the broken strip, then build one of your own and chant it.
    [
      { gen: warmWhichGroup, diff: 2 },
      { gen: nextSwapABBLong, diff: 2 },
      { gen: brokenStrip, diff: 3 },
      { gen: buildYourOwn, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // Day-5 only — see disclosure 7.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: a pattern is not a picture, it is a rule - and at this age the rule is found by EAR, not by eye. Chant the strip with your child ("spoon, fork, fork, spoon, fork, fork") and let them join in on the last one. Two things look like errors and are not. If your child carries every strip on as a simple back-and-forth, that is the normal starting point, not carelessness: the alternating strip is the only one most three-year-olds have met, so it is what they hear everywhere. Chant a strip that has a pair in it, slowly, and let the sound correct them rather than you. And if they build a strip and then abandon the rule halfway, that is a memory load, not a misunderstanding - ask them to chant what they have made so far before they add the next one. At home the best pattern kit is the cutlery drawer, the sock basket or the stairs. Make one, chant it, then leave a gap and let them fill it.',
  ],
  /**
   * The sanctioned band-A production puzzle, and the BUILDING is the mathematics.
   *
   * You cannot lay the next part of a strip without chanting the part first, and
   * you cannot say how many of each kind you used without counting what you laid.
   * It asks for the strip in the direction the days do not: the days read a strip
   * somebody else laid and say ONE next thing, while here the child lays a whole
   * part and then reads their own work back.
   *
   * The answer is the composition of one repeat, which is the same multiset
   * wherever the strip happens to stop, so it is code-derived rather than tied to
   * where the drawing ended. Every counter named is actually DRAWN - no worksheet
   * furniture with no referent on the page.
   */
  puzzle: (r) => {
    const kind = r.pick(['ABB', 'AAB'] as const);
    const nouns = twoKinds(r);
    const run = runOf(kind, 6);
    const firsts = UNIT[kind].filter((s) => s === 0).length;
    const seconds = UNIT[kind].length - firsts;
    const scene = stripScene(run, nouns);
    return {
      id: 'A11-PZ-01',
      title: 'Puzzle Grove: Carry the Chant On',
      puzzleType: 'pattern',
      prompt: [
        `[image: ${scene}]`,
        say('Chant this strip out loud, twice.'),
        say('Now lay the next part yourself.'),
        say('How many of each did that take?'),
      ].join(' '),
      figure: stripFigure(run, nouns, scene),
      answer: {
        value: `${nouns[0]}: ${String(firsts)}; ${nouns[1]}: ${String(seconds)}`,
        acceptableForms: [],
        validation: 'set',
      },
      hintLadder: hints('Chant one whole part, then stop and look.', 'Lay that part again, in the very same order.'),
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'lay-the-next-part' },
  sprint: null,
  mastery: [
    { gen: nextSwapAB, diff: 2 },
    { gen: nextRepeatABB, diff: 3 },
    // Slot 03 CERTIFIES with the broken strip, not with the repeat length — see
    // disclosure 8. Same type and difficulty, so the isomorph class is unchanged.
    { gen: brokenStrip, diff: 3 },
    { gen: storyMat, diff: 2 },
    { gen: stripCount, diff: 3 },
    { gen: puppetMixUp, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh strips off a separate stream. 01: what comes next on a take-turns strip. 02: what comes next where the next thing REPEATS the last one, so an alternating habit fails. 03: find where a ten-long strip stops fitting, with two whole repeats laid down before the break so the rule is settled before the question is asked. 04: a mat story whose next thing also repeats. 05: count one kind along a two-kind strip, with the other kind drawn and unused. 06: the puppet who carries a strip on by swapping, counted up to its first mix-up. Every strip in this pack is registered by its whole printed line, so no slot can reprint another slot strip - a pattern prompt carries no digits, so the shared numeric-surface guard never sees it.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'every-pattern-is-a-swap',
      description:
        'Carries every strip on as a simple back-and-forth, because the alternating strip is the only kind most children have met. Says the other kind next even when the strip has just said one kind twice.',
      exampleWrongAnswer: 'a strip reading duck, leaf, leaf, duck, leaf carried on with a duck',
      distractorRationale: 'Offer the other kind on every what-comes-next item, and draw four of the nine at a length where the true next thing REPEATS the last one.',
      reteachPointer: 'explanation/script[2] (not every strip takes turns - the one that said shell twice)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-the-place-along-the-strip',
      description:
        'Chants the strip correctly but loses the place while walking it, so the count or the position lands one or two out. A long strip makes it far likelier than a short one.',
      exampleWrongAnswer: 'the break at the seventh thing tapped as the sixth',
      distractorRationale: 'Offer one place short, two places short and one place past the true answer on any item answered by a position along the strip.',
      reteachPointer: 'guidedExamples/A11-GE-03 (chant one whole part, then stop, then count what you said)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-about-the-whole-strip',
      description:
        'Answers about the whole strip when the question asks about one part of it, or counts both kinds when the question names one. The strip holds several countable things at once.',
      exampleWrongAnswer: 'asked how many are said before a six-long strip repeats, answers 6',
      distractorRationale: 'Offer the whole strip length beside the true answer whenever the question asks about a part of the strip.',
      reteachPointer: 'Day-4 strip stories (the chant names two kinds; the question wants one)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'reads-one-kind-only',
      description:
        'Reads the part that comes back as one kind rather than as the whole run of things, so a pair plus a single is heard as just the single.',
      exampleWrongAnswer: 'a part reading star, shell, shell answered as 1',
      distractorRationale: 'Offer 1 as the count of a single kind inside the part, beside the true length of the whole part.',
      reteachPointer: 'explanation/script[3] (the pair comes first, then one on its own - three things in the part)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Finding, carrying on and mending repeating patterns - and doing it by ear. We chanted strips out loud (star, shell, shell, star, shell, shell), found the part that comes back, and said what comes next. We also met strips that do NOT simply take turns, which is the big step this week: a strip can say one kind twice before it changes, and only a slow chant catches it.',
    improvingCandidates: [
      'chanting a strip out loud before answering anything about it',
      'carrying on a strip that says one kind twice, instead of swapping every time',
      'hearing how many things are said before a strip starts over',
      'finding the one thing on a strip that does not fit',
      'building their own strip and keeping the rule going',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'letting a strip say the same kind twice - we will keep chanting pair strips slowly until the ear expects them',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping their place along a long strip - pointing at each one while chanting is the fix',
      },
      {
        errorTag: 'task-comprehension',
        text: 'noticing whether a question asks about one part of the strip or the whole of it',
      },
    ],
    homeFocus: {
      praiseLine:
        'You chanted the whole strip out loud before you answered, and you noticed the pair that comes round every time.',
      questionForChild: 'Can you lay a pattern with two kinds of spoon - and chant it to me?',
      schoolSyncHook: 'If their class patterns with beads, pegs or clapping, let us know and the strips will use it.',
    },
    vocabularyForParent: [
      'pattern (a part that comes back again and again)',
      'the part (what you chant before the strip starts over)',
      'AB and ABB (take-turns strips, and strips with a pair in them)',
      'chanting (saying a strip out loud - the way a child of this age finds the rule)',
    ],
  },
});
